from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
import requests
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import bcrypt
import jwt
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, UploadFile, File, Depends, Header, Query
from fastapi.responses import Response as FastAPIResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from fastapi.middleware.cors import CORSMiddleware
# ---------- Setup ----------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

JWT_ALGORITHM = "HS256"
JWT_SECRET = os.environ["JWT_SECRET"]
APP_NAME = os.environ.get("APP_NAME", "wellicon-pharma")
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"

storage_key: Optional[str] = None

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Wellicon Pharma CMS")
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
api_router = APIRouter(prefix="/api")


# ---------- Auth helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user.get("name", "Admin"),
            "role": user.get("role", "admin"),
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------- Storage helpers ----------
def init_storage() -> Optional[str]:
    global storage_key
    if storage_key:
        return storage_key
    try:
        resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
        resp.raise_for_status()
        storage_key = resp.json()["storage_key"]
        logger.info("Storage initialized")
        return storage_key
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
        return None


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    if not key:
        raise HTTPException(status_code=500, detail="Storage not available")
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data,
        timeout=120,
    )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    if not key:
        raise HTTPException(status_code=500, detail="Storage not available")
    resp = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key},
        timeout=60,
    )
    if resp.status_code == 404:
        raise HTTPException(status_code=404, detail="File not found")
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


# ---------- Models ----------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class CategoryCreate(BaseModel):
    name: str
    slug: Optional[str] = None
    description: Optional[str] = ""


class Category(BaseModel):
    id: str
    name: str
    slug: str
    description: str = ""
    created_at: str


class ProductCreate(BaseModel):
    name: str
    category_id: str
    composition: str = ""
    description: str = ""
    packaging: str = ""
    image_url: Optional[str] = None
    is_active: bool = True


class Product(ProductCreate):
    id: str
    created_at: str
    updated_at: str


class SiteSettings(BaseModel):
    # Company / global
    company_name: str = "Wellicon Pharma"
    company_tagline: str = "Caring Health · Curing Lives"
    brand_motto: str = "Way To Healthiness"
    nav_home: str = "Home"
    nav_about: str = "About"
    nav_products: str = "Products"
    nav_contact: str = "Contact"
    header_cta: str = "Get in touch"
    footer_quick_links_title: str = "Quick Links"
    footer_contact_title: str = "Contact"
    footer_admin_title: str = "Admin"
    footer_admin_link: str = "CMS Login →"
    footer_disclaimer: str = "For healthcare professional use. Not for self-medication."
    footer_rights_suffix: str = "All rights reserved."

    # Home — hero
    hero_overline: str = "PHARMACEUTICAL EXCELLENCE"
    hero_title: str = "Caring Health, Curing Lives"
    hero_subtitle: str = "Wellicon Pharmaceuticals — innovating quality medicines for a healthier tomorrow."
    hero_image_url: str = "https://static.prod-images.emergentagent.com/jobs/83ef7e25-6729-485c-a277-13adf6b5bae2/images/0340a14000abdfa6fe2572e8bfaf2174331e1d6c5839963993c79654a70415cb.png"
    hero_cta_primary: str = "Explore products"
    hero_cta_secondary: str = "About us"
    hero_stat1_value: str = "200+"
    hero_stat1_label: str = "Formulations"
    hero_stat2_value: str = "WHO-GMP"
    hero_stat2_label: str = "Certified"
    hero_stat3_value: str = "15+"
    hero_stat3_label: str = "Years"
    hero_badge_label: str = "Quality Assured"
    hero_badge_value: str = "ISO 9001:2015"

    # Home — sections
    home_portfolio_overline: str = "OUR PORTFOLIO"
    home_portfolio_title: str = "Therapeutic divisions"
    home_portfolio_link: str = "View all products →"
    home_featured_overline: str = "FEATURED RANGE"
    home_featured_title: str = "Trusted formulations"
    trust1_title: str = "R&D Driven"
    trust1_body: str = "In-house formulation development and validation laboratories."
    trust2_title: str = "Quality First"
    trust2_body: str = "WHO-GMP compliant manufacturing with stringent QC protocols."
    trust3_title: str = "Patient Focused"
    trust3_body: str = "Affordable medicines that reach every corner of the country."
    home_about_overline: str = "WHO WE ARE"
    home_about_link: str = "Read more about us"
    home_quality_stat_value: str = "98%"
    home_quality_stat_label: str = "Quality Score"
    home_therapy_stat_value: str = "12+"
    home_therapy_stat_label: str = "Therapy Areas"

    # About page
    about_overline: str = "ABOUT US"
    about_title: str = "About Wellicon Pharma"
    about_body: str = (
        "Founded with a single purpose — to deliver world-class pharmaceutical formulations across India and beyond. "
        "Wellicon Pharma combines cutting-edge research with stringent quality control to bring trusted medicines to "
        "healthcare professionals and patients. Our portfolio spans antibacterials, gastroenterology, cardiovascular, "
        "pain management and nutraceutical solutions."
    )
    about_image_url: str = "https://static.prod-images.emergentagent.com/jobs/83ef7e25-6729-485c-a277-13adf6b5bae2/images/c8e9ea12b401d8b4340e8a29134972a32009a205b35612418ecc97cafd2086c2.png"
    about_badge1: str = "WHO-GMP Certified"
    about_badge2: str = "ISO 9001:2015"
    about_badge3: str = "Pan-India Distribution"
    about_badge4: str = "200+ Healthcare Partners"
    about_mission_overline: str = "OUR MISSION"
    about_mission: str = "To deliver innovative, affordable and trusted pharmaceutical solutions that improve lives."
    about_vision_overline: str = "OUR VISION"
    about_vision: str = (
        "To be recognised globally as a benchmark for quality, integrity and innovation in pharmaceuticals — "
        "empowering healthcare professionals and patients with reliable formulations across every therapeutic segment."
    )

    # Products page
    products_overline: str = "CATALOGUE"
    products_title_all: str = "All products"
    products_all_categories: str = "All categories"
    products_search_placeholder: str = "Search by name or composition…"
    products_empty_title: str = "No products found."
    products_empty_subtitle: str = "Try a different category or search term."

    # Product detail
    product_label_composition: str = "Composition"
    product_label_packaging: str = "Packaging"
    product_label_description: str = "Description"
    product_inquire_cta: str = "Enquire about this product"
    product_not_found: str = "Product not found."
    product_loading: str = "Loading…"

    # Contact page
    contact_overline: str = "CONTACT US"
    contact_title: str = "Get in touch with us"
    contact_intro: str = (
        "Whether you're a healthcare professional, distributor, or partner — we'd love to hear from you. "
        "Send us your inquiry and our team will respond promptly."
    )
    contact_label_address: str = "Address"
    contact_label_email: str = "Email"
    contact_label_phone: str = "Phone"
    contact_form_name: str = "Full Name *"
    contact_form_email: str = "Email *"
    contact_form_phone: str = "Phone"
    contact_form_subject: str = "Subject"
    contact_form_message: str = "Message *"
    contact_form_submit: str = "Send message"
    contact_form_submitting: str = "Sending…"
    contact_success: str = "Thank you! We'll get back to you shortly."
    contact_email: str = "info@welliconpharma.com"
    contact_phone: str = "+91 98765 43210"
    contact_address: str = "Plot 21, Industrial Area, Phase II, Chandigarh, India 160002"


class InquiryCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    subject: Optional[str] = ""
    message: str
    product_id: Optional[str] = None


# ---------- Helpers ----------
def slugify(text: str) -> str:
    return "".join(c if c.isalnum() else "-" for c in text.lower()).strip("-")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------- Auth Routes ----------
@api_router.post("/auth/login")
async def login(payload: LoginRequest, response: Response):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(str(user["_id"]), email)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=43200,
        path="/",
    )
    return {
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user.get("name", "Admin"),
            "role": user.get("role", "admin"),
        },
    }


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


# ---------- File Upload ----------
@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files allowed")
    ext = (file.filename.rsplit(".", 1)[-1] if "." in file.filename else "bin").lower()
    path = f"{APP_NAME}/products/{uuid.uuid4()}.{ext}"
    data = await file.read()
    result = put_object(path, data, file.content_type)
    record = {
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": file.content_type,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": now_iso(),
    }
    await db.files.insert_one(record)
    return {"path": result["path"], "url": f"/api/files/{result['path']}"}


@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    data, content_type = get_object(path)
    return FastAPIResponse(content=data, media_type=record.get("content_type", content_type))


# ---------- Categories ----------
@api_router.get("/categories")
async def list_categories():
    cats = await db.categories.find({}, {"_id": 0}).sort("name", 1).to_list(500)
    return cats


@api_router.post("/categories")
async def create_category(payload: CategoryCreate, user: dict = Depends(get_current_user)):
    slug = payload.slug or slugify(payload.name)
    if await db.categories.find_one({"slug": slug}):
        raise HTTPException(status_code=400, detail="Category slug already exists")
    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "slug": slug,
        "description": payload.description or "",
        "created_at": now_iso(),
    }
    await db.categories.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/categories/{cat_id}")
async def update_category(cat_id: str, payload: CategoryCreate, user: dict = Depends(get_current_user)):
    update = {"name": payload.name, "description": payload.description or ""}
    if payload.slug:
        update["slug"] = payload.slug
    result = await db.categories.update_one({"id": cat_id}, {"$set": update})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    cat = await db.categories.find_one({"id": cat_id}, {"_id": 0})
    return cat


@api_router.delete("/categories/{cat_id}")
async def delete_category(cat_id: str, user: dict = Depends(get_current_user)):
    await db.categories.delete_one({"id": cat_id})
    return {"ok": True}


# ---------- Products ----------
@api_router.get("/products")
async def list_products(category: Optional[str] = None, q: Optional[str] = None, only_active: bool = True):
    filt: dict = {}
    if only_active:
        filt["is_active"] = True
    if category:
        cat = await db.categories.find_one({"slug": category}, {"_id": 0})
        if cat:
            filt["category_id"] = cat["id"]
    if q:
        filt["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"composition": {"$regex": q, "$options": "i"}},
        ]
    items = await db.products.find(filt, {"_id": 0}).sort("created_at", -1).to_list(1000)
    # attach category info
    cat_map = {c["id"]: c for c in await db.categories.find({}, {"_id": 0}).to_list(500)}
    for p in items:
        p["category"] = cat_map.get(p.get("category_id"))
    return items


@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    p = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    if p.get("category_id"):
        p["category"] = await db.categories.find_one({"id": p["category_id"]}, {"_id": 0})
    return p


@api_router.post("/products")
async def create_product(payload: ProductCreate, user: dict = Depends(get_current_user)):
    cat = await db.categories.find_one({"id": payload.category_id}, {"_id": 0})
    if not cat:
        raise HTTPException(status_code=400, detail="Invalid category")
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = now_iso()
    doc["updated_at"] = doc["created_at"]
    await db.products.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/products/{product_id}")
async def update_product(product_id: str, payload: ProductCreate, user: dict = Depends(get_current_user)):
    update = payload.model_dump()
    update["updated_at"] = now_iso()
    result = await db.products.update_one({"id": product_id}, {"$set": update})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    p = await db.products.find_one({"id": product_id}, {"_id": 0})
    return p


@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, user: dict = Depends(get_current_user)):
    await db.products.delete_one({"id": product_id})
    return {"ok": True}


# ---------- Site Settings ----------
def merge_settings(doc: Optional[dict] = None) -> dict:
    defaults = SiteSettings().model_dump()
    if not doc:
        return defaults
    merged = {**defaults}
    for key, value in doc.items():
        if key in ("_id", "id"):
            continue
        if key in defaults and value is not None:
            merged[key] = value
    return merged


@api_router.get("/settings")
async def get_settings():
    doc = await db.settings.find_one({"id": "site"}, {"_id": 0})
    if not doc:
        defaults = SiteSettings().model_dump()
        defaults["id"] = "site"
        await db.settings.insert_one(defaults)
        defaults.pop("_id", None)
        return defaults
    merged = merge_settings(doc)
    merged["id"] = "site"
    return merged


@api_router.put("/settings")
async def update_settings(payload: SiteSettings, user: dict = Depends(get_current_user)):
    data = payload.model_dump()
    await db.settings.update_one({"id": "site"}, {"$set": data}, upsert=True)
    data["id"] = "site"
    return data


# ---------- Inquiries ----------
@api_router.post("/inquiries")
async def create_inquiry(payload: InquiryCreate):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = now_iso()
    doc["is_read"] = False
    await db.inquiries.insert_one(doc)
    doc.pop("_id", None)
    return {"ok": True, "id": doc["id"]}


@api_router.get("/inquiries")
async def list_inquiries(user: dict = Depends(get_current_user)):
    items = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return items


@api_router.put("/inquiries/{inquiry_id}/read")
async def mark_inquiry_read(inquiry_id: str, user: dict = Depends(get_current_user)):
    await db.inquiries.update_one({"id": inquiry_id}, {"$set": {"is_read": True}})
    return {"ok": True}


@api_router.delete("/inquiries/{inquiry_id}")
async def delete_inquiry(inquiry_id: str, user: dict = Depends(get_current_user)):
    await db.inquiries.delete_one({"id": inquiry_id})
    return {"ok": True}


# ---------- Dashboard Stats ----------
@api_router.get("/admin/stats")
async def admin_stats(user: dict = Depends(get_current_user)):
    products = await db.products.count_documents({})
    active_products = await db.products.count_documents({"is_active": True})
    categories = await db.categories.count_documents({})
    inquiries = await db.inquiries.count_documents({})
    unread = await db.inquiries.count_documents({"is_read": False})
    return {
        "products": products,
        "active_products": active_products,
        "categories": categories,
        "inquiries": inquiries,
        "unread_inquiries": unread,
    }


# ---------- Health ----------
@api_router.get("/")
async def root():
    return {"status": "ok", "service": "Wellicon Pharma CMS"}


# ---------- Startup ----------
async def seed_admin():
    email = os.environ.get("ADMIN_EMAIL", "[EMAIL_ADDRESS]").lower()
    password = os.environ.get("ADMIN_PASSWORD", "Admin@123")
    existing = await db.users.find_one({"email": email})
    if not existing:
        await db.users.insert_one(
            {
                "email": email,
                "password_hash": hash_password(password),
                "name": "Wellicon Admin",
                "role": "admin",
                "created_at": now_iso(),
            }
        )
        logger.info(f"Admin seeded: {email}")
    elif not verify_password(password, existing["password_hash"]):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(password)}})
        logger.info("Admin password updated")


async def seed_initial_data():
    # Categories
    if await db.categories.count_documents({}) == 0:
        defaults = [
            ("Tablets", "tablets", "Oral solid dosage forms for systemic action."),
            ("Capsules", "capsules", "Hard and soft gelatin capsule formulations."),
            ("Syrups", "syrups", "Liquid oral preparations including pediatric ranges."),
            ("Injections", "injections", "Sterile parenteral dosage forms."),
            ("Ointments", "ointments", "Topical creams, gels and ointments."),
            ("Drops", "drops", "Eye, ear and nasal drop formulations."),
        ]
        docs = [
            {"id": str(uuid.uuid4()), "name": n, "slug": s, "description": d, "created_at": now_iso()}
            for n, s, d in defaults
        ]
        await db.categories.insert_many(docs)
        logger.info("Seeded default categories")

    # Sample products
    if await db.products.count_documents({}) == 0:
        cats = await db.categories.find({}, {"_id": 0}).to_list(50)
        cat_by_slug = {c["slug"]: c for c in cats}
        samples = [
            {
                "name": "Welcef-200",
                "slug": "tablets",
                "composition": "Cefixime 200mg",
                "description": "Broad spectrum third-generation cephalosporin antibiotic indicated for respiratory and urinary infections.",
                "packaging": "10x10 Alu-Alu Strip",
            },
            {
                "name": "Wellizole-D",
                "slug": "capsules",
                "composition": "Pantoprazole 40mg + Domperidone 30mg SR",
                "description": "For GERD, peptic ulcer disease and dyspepsia with effective acid suppression.",
                "packaging": "10x10 Alu-Alu",
            },
            {
                "name": "Welcof-LS",
                "slug": "syrups",
                "composition": "Levosalbutamol + Ambroxol + Guaiphenesin",
                "description": "Effective cough syrup for productive cough with bronchospasm.",
                "packaging": "100 ml bottle",
            },
            {
                "name": "Welmox-CV 1.2g",
                "slug": "injections",
                "composition": "Amoxicillin 1000mg + Clavulanic Acid 200mg",
                "description": "Injectable broad spectrum antibiotic for severe infections.",
                "packaging": "Vial with WFI",
            },
            {
                "name": "Welderm Cream",
                "slug": "ointments",
                "composition": "Clobetasol + Neomycin + Miconazole",
                "description": "Triple action topical cream for fungal & bacterial skin infections.",
                "packaging": "15g tube",
            },
            {
                "name": "Wellivit Drops",
                "slug": "drops",
                "composition": "Multivitamin Pediatric Drops",
                "description": "Daily multivitamin drops for infants and children.",
                "packaging": "15ml dropper bottle",
            },
            {
                "name": "Welpara-650",
                "slug": "tablets",
                "composition": "Paracetamol 650mg",
                "description": "Analgesic and antipyretic for fever and mild to moderate pain.",
                "packaging": "15x10 Strip",
            },
            {
                "name": "Wellinerve Plus",
                "slug": "capsules",
                "composition": "Methylcobalamin 1500mcg + ALA 100mg + Vit B6",
                "description": "Neuroprotective nutritional supplement for diabetic neuropathy.",
                "packaging": "10x10 Blister",
            },
        ]
        placeholders = [
            "https://images.unsplash.com/photo-1581159186721-b68b78da4ec9?crop=entropy&cs=srgb&fm=jpg&w=800&q=80",
            "https://images.unsplash.com/photo-1598046937895-2be846402c0d?crop=entropy&cs=srgb&fm=jpg&w=800&q=80",
            "https://static.prod-images.emergentagent.com/jobs/83ef7e25-6729-485c-a277-13adf6b5bae2/images/40ed25b70fa3999788a9fccd30ae5a395d2e3f2fb18bdafcf8e9d6193da4b3fd.png",
            "https://static.prod-images.emergentagent.com/jobs/83ef7e25-6729-485c-a277-13adf6b5bae2/images/c8e9ea12b401d8b4340e8a29134972a32009a205b35612418ecc97cafd2086c2.png",
        ]
        docs = []
        for i, s in enumerate(samples):
            cat = cat_by_slug.get(s["slug"])
            if not cat:
                continue
            docs.append(
                {
                    "id": str(uuid.uuid4()),
                    "name": s["name"],
                    "category_id": cat["id"],
                    "composition": s["composition"],
                    "description": s["description"],
                    "packaging": s["packaging"],
                    "image_url": placeholders[i % len(placeholders)],
                    "is_active": True,
                    "created_at": now_iso(),
                    "updated_at": now_iso(),
                }
            )
        if docs:
            await db.products.insert_many(docs)
            logger.info(f"Seeded {len(docs)} sample products")

    # Default settings
    if not await db.settings.find_one({"id": "site"}):
        defaults = SiteSettings().model_dump()
        defaults["id"] = "site"
        await db.settings.insert_one(defaults)


@app.on_event("startup")
async def on_startup():
    try:
        await db.users.create_index("email", unique=True)
        await db.products.create_index("id", unique=True)
        await db.categories.create_index("slug", unique=True)
        await seed_admin()
        await seed_initial_data()
        init_storage()
    except Exception as e:
        logger.error(f"Startup error: {e}")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()


# Include router and middleware
app.include_router(api_router)
# app.add_middleware(
#     CORSMiddleware,
#     allow_credentials=True,
#     allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
#     allow_methods=["*"],
#     allow_headers=["*"],
# )