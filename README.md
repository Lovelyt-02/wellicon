# Wellicon Pharma

Pharmaceutical company website with a public marketing site and an admin CMS for products, categories, inquiries, and editable page content.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite + Tailwind CSS + React Router |
| Backend | FastAPI + Uvicorn |
| Database | MongoDB Atlas (Motor / PyMongo) |
| Auth | JWT (cookie + Bearer token) |

## Project structure

```text
wellIconPharma/
├── .gitignore
├── README.md
├── .venv/                    # Python virtualenv (local)
└── app/
    ├── backend/
    │   ├── .env              # Backend secrets (not committed)
    │   ├── requirements.txt
    │   └── server.py         # FastAPI app + API routes
    ├── frontend/
    │   ├── .env              # Frontend config (not committed)
    │   ├── package.json
    │   ├── vite.config.js
    │   ├── public/
    │   └── src/
    │       ├── pages/
    │       │   ├── public/   # Home, About, Products, Contact
    │       │   └── admin/    # CMS dashboard
    │       ├── layouts/
    │       ├── context/
    │       └── lib/api.js
    └── memory/
        └── test_credentials.md
```

## Prerequisites

- Python 3.11+ (3.13 works)
- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)

## Environment setup

### Backend — `app/backend/.env`

```env
MONGO_URL=
DB_NAME=wellicon_pharma_db
CORS_ORIGINS=http://localhost:5173
JWT_SECRET=
ADMIN_EMAIL=admin@wellicon.com
ADMIN_PASSWORD=Admin@123
EMERGENT_LLM_KEY=
APP_NAME=wellicon-pharma
```

| Variable | Purpose |
|----------|---------|
| `MONGO_URL` | MongoDB Atlas connection string |
| `DB_NAME` | Database name |
| `JWT_SECRET` | Secret for signing auth tokens |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin login (created on backend startup) |
| `EMERGENT_LLM_KEY` | Used for image upload storage |
| `APP_NAME` | Storage path prefix |

### Frontend — `app/frontend/.env`

```env
VITE_BACKEND_URL=http://localhost:8000
```

`src/lib/api.js` reads **`VITE_BACKEND_URL` only** (not `VITE_API_URL` / `REACT_APP_*`).

- **Local:** unset → falls back to `http://localhost:8000` in DEV only.
- **Production (Vercel):** you **must** set `VITE_BACKEND_URL` to your Railway URL (no trailing slash), then redeploy. Example:

```env
VITE_BACKEND_URL=https://welliconpharmaceuticals-production-f435.up.railway.app
```

### Railway CORS

On Railway, set `CORS_ORIGINS` to your Vercel origin(s), comma-separated, e.g.:

```env
CORS_ORIGINS=https://your-app.vercel.app,http://localhost:5173
```

## How to run

Use **two terminals**.

### 1. Backend

```powershell
cd e:\Lovely\personal-project\newLearning\wellIconPharma
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r app\backend\requirements.txt
cd app\backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

Health check: [http://localhost:8000/api/](http://localhost:8000/api/)

On startup the backend:

- Seeds the admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- Seeds default categories, sample products, and site settings (if empty)

### 2. Frontend

```powershell
cd e:\Lovely\personal-project\newLearning\wellIconPharma\app\frontend
npm install
npm start
```

App: [http://localhost:5173](http://localhost:5173)

## Admin CMS

| URL | Description |
|-----|-------------|
| [/admin/login](http://localhost:5173/admin/login) | Admin login |
| `/admin` | Dashboard stats |
| `/admin/products` | Product CRUD + image upload |
| `/admin/categories` | Category CRUD |
| `/admin/inquiries` | Contact form submissions |
| `/admin/settings` | **Site Content CMS** — edit titles, copy, images for all public pages |

Default credentials (override via `.env`):

- Email: `admin@wellicon.com`
- Password: `Admin@123`

## Public pages

| Path | Page |
|------|------|
| `/` | Home |
| `/about` | About |
| `/products` | Product catalogue |
| `/products/:id` | Product detail |
| `/contact` | Contact / inquiry form |

## Main API routes

All routes are prefixed with `/api`.

| Area | Examples |
|------|----------|
| Auth | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` |
| Products | `GET/POST /products`, `PUT/DELETE /products/{id}` |
| Categories | `GET/POST /categories`, `PUT/DELETE /categories/{id}` |
| Settings | `GET/PUT /settings` |
| Inquiries | `POST /inquiries`, `GET /inquiries` (admin) |
| Upload | `POST /upload`, `GET /files/{path}` |
| Stats | `GET /admin/stats` |

## Atlas checklist

If the backend crashes with a Mongo DNS / connection error:

1. Copy the connection string from Atlas → Connect → Drivers
2. Put it in `MONGO_URL`
3. Allow your IP under Network Access
4. Restart uvicorn (`Ctrl+C`, then start again)

## License

Private / personal project.
