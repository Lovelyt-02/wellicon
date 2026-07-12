# Test Credentials

## Admin Account
- **Email**: admin@wellicon.com
- **Password**: Admin@123
- **Role**: admin

## Auth Endpoints
- POST `/api/auth/login` — login (returns token + sets httpOnly cookie)
- POST `/api/auth/logout` — logout
- GET  `/api/auth/me` — current user (requires auth)

## Public Endpoints
- GET  `/api/categories`
- GET  `/api/products?category={slug}&q={search}`
- GET  `/api/products/{id}`
- GET  `/api/settings`
- POST `/api/inquiries` — submit contact form

## Admin-only Endpoints (require Bearer token or cookie)
- POST/PUT/DELETE `/api/products`
- POST/PUT/DELETE `/api/categories`
- PUT `/api/settings`
- GET `/api/inquiries`
- POST `/api/upload`
- GET `/api/admin/stats`
