# Bedia Admin

A standalone **Next.js** admin dashboard to manage the Bedia Privé website's
**workshops/packages**, categories, clay types, bookings and orders. It talks
only to the existing backend API (no direct DB access) and deploys
**independently to its own domain**.

## Stack
Next.js 16 · React 18 · TypeScript · Tailwind CSS · zustand · axios · lucide-react · sonner.

## What it manages
- **Dashboard** — live stats (`/dashboard/stats`).
- **Workshops / Packages** — full CRUD, incl. each workshop's priced **options (packages)** and default slots.
- **Categories** and **Clay Types** — full CRUD.
- **Bookings** — list, search/filter, inline booking‑status updates.
- **Orders** — read‑only list.

## Auth
Login via `POST /auth/login`; only **admin‑role** accounts can sign in. The JWT
is stored client‑side and attached to every request; a 401/403 bounces back to
`/login`. Create/reset an admin with the backend script:
```bash
cd ../backend && npx ts-node scripts/setAdminPassword.ts admin@bediapottery.ae 'YourPass'
```

## Local development
```bash
cp .env.example .env.local     # set NEXT_PUBLIC_API_BASE_URL
npm ci
npm run dev                    # http://localhost:4000
```

## Environment
| Var | Description |
|-----|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL (no trailing slash). **Baked in at build time** — set before `npm run build`. |

## Deploy (independent, own domain)
Example domain: `https://bedia-claud-admin.adpedia.in`.

```bash
cd admin
printf 'NEXT_PUBLIC_API_BASE_URL=https://bedia-claud-backend.adpedia.in\n' > .env.local
npm ci
npm run build
pm2 start "npm run start" --name bedia-admin   # Next server on :4000
pm2 save
```

Nginx vhost (admin domain → the Next server):
```nginx
server {
  server_name bedia-claud-admin.adpedia.in;
  location / {
    proxy_pass http://127.0.0.1:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```
Then `sudo certbot --nginx -d bedia-claud-admin.adpedia.in`.

### ⚠️ Backend must allow this domain in CORS
The dashboard sends credentialed requests, so the admin origin **must** be in the
backend's `CORS_URLS`. Add it and restart the API:
```ini
# backend/.env
CORS_URLS=["https://bedia-claud-frontend.adpedia.in","https://bedia-claud-dashboard.adpedia.in","https://bedia-claud-admin.adpedia.in"]
```
```bash
pm2 restart bedia-api
```

## Notes
- Same database as the live site — changes here are immediately reflected on the website (it's the same API/DB).
- Deletes are soft (`isDeleted`) on the backend, so removals are recoverable.
- This app is independent of the legacy Angular `dashboard/`; either can run, but this one is the intended replacement.
