from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict

class SocialMediaItem(BaseModel):
    platform: str  # e.g., 'linkedin', 'youtube', etc.
    url: Optional[str] = None
    icon_url: Optional[str] = None  # URL or storage path to custom icon
    active: bool = True
    display_order: int = 0
    open_in_new_tab: bool = True
    nofollow: bool = False

class BackgroundConfig(BaseModel):
    background_type: str = "gradient"  # 'gradient', 'image', 'none'
    image_url: Optional[str] = None
    gradient: Optional[str] = None
    background_size: str = "cover"
    background_position: str = "center"
    background_repeat: str = "no-repeat"
    overlay_color: Optional[str] = None  # hex or rgba
    overlay_opacity: float = 0.0  # 0.0 - 1.0
    parallax: bool = False

class ProductSEO(BaseModel):
    focus_keyword: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    canonical: Optional[str] = None
    schema: Optional[Dict] = None
    faq_schema: Optional[Dict] = None
    breadcrumb_schema: Optional[Dict] = None
    social_share_image: Optional[str] = None
    robots: Optional[str] = None
    slug: Optional[str] = None
    redirect_301: Optional[str] = None
class SiteSettings(BaseModel):
    site_name: Optional[str] = None
    site_url: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    favicon_url: Optional[str] = None
    meta_keywords: Optional[str] = None
    meta_description: Optional[str] = None
    open_graph_image_url: Optional[str] = None
