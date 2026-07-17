# Bedia Privé — Production Deployment Guide

End-to-end steps to deploy the three apps + MongoDB on a single Linux server
(Ubuntu 22.04 LTS example, e.g. a DigitalOcean droplet). Adjust domains, paths,
and users to your environment.

> ⚠️ **Before a public production launch**, complete the **Security pre‑flight**
> (§10). At minimum: **rotate every secret** that was ever committed, and fix the
> access‑control issues in `docs/BACKEND_ANALYSIS.md`. The steps below get the
> stack *running*; §10 is what makes it *safe*.

---

## 0. Architecture

| Component | Tech | Process | Default port | Public host (example) |
|-----------|------|---------|--------------|-----------------------|
| Backend API | Node/Express/TS | PM2 (Node) | 8000 | `https://api-bediaprive.adpedia.in` |
| Frontend | Next.js (Node server) | PM2 (`next start`) | 3000 | `https://bediaprive.adpedia.in` |
| Admin dashboard | Angular (static SPA) | Nginx static | — | `https://admin-bediaprive.adpedia.in` |
| Database | MongoDB 8.x | systemd (`mongod`) | 27017 (localhost only) | — |
| Reverse proxy / TLS | Nginx + Let's Encrypt | systemd | 80/443 | — |

The app does **not** use MongoDB transactions (they're disabled in code), so a
**standalone `mongod` is sufficient** — no replica set required.

**Prerequisites**
- A server with ≥ 2 vCPU / 4 GB RAM (Next + Angular builds are memory‑hungry).
- Three DNS A‑records pointing at the server IP (site, api, admin).
- A **Stripe account** with a live **secret** key (`sk_live_…`) and a webhook secret.
- SMTP / Gmail app‑password, Google Places API key, S3/DigitalOcean Spaces creds.

---

## 1. Server prep

```bash
sudo apt update && sudo apt -y upgrade
sudo apt -y install git curl ufw nginx
# Firewall: allow SSH + HTTP/HTTPS only (Mongo stays private)
sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw --force enable
```

### Node.js 20 LTS + PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt -y install nodejs
sudo npm i -g pm2
node -v   # v20.x
```

---

## 2. MongoDB 8 — install, secure, restore the dump

### 2.1 Install
```bash
curl -fsSL https://pgp.mongodb.com/server-8.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt update && sudo apt -y install mongodb-org
sudo systemctl enable --now mongod
mongod --version   # db version v8.x
```

### 2.2 Create an admin user + the app DB user, then enable auth
```bash
# Create an admin (run once)
mongosh <<'EOF'
use admin
db.createUser({ user: "root", pwd: "CHANGE_ME_STRONG", roles: ["root"] })
EOF

# Create the application database + least-privilege user
mongosh -u root -p CHANGE_ME_STRONG --authenticationDatabase admin <<'EOF'
use bediaprive_db
db.createUser({
  user: "bediaprive_user",
  pwd: "CHANGE_ME_APP_STRONG",
  roles: [ { role: "readWrite", db: "bediaprive_db" } ]
})
EOF
```

Enable auth + keep Mongo bound to localhost (it's only reached by the API on
the same box):
```bash
sudo sed -i 's/^#\?\s*authorization:.*/  authorization: enabled/' /etc/mongod.conf 2>/dev/null || true
# Ensure these two blocks exist in /etc/mongod.conf:
#   net:
#     bindIp: 127.0.0.1
#   security:
#     authorization: enabled
sudo nano /etc/mongod.conf     # verify bindIp: 127.0.0.1 and security.authorization: enabled
sudo systemctl restart mongod
```

### 2.3 Restore the dump
The BSON dump lives in `database/bediaprive_db/` in this repo.
```bash
cd /var/www/bedia-claude          # (after cloning — see §3)
mongorestore \
  --username bediaprive_user --password CHANGE_ME_APP_STRONG \
  --authenticationDatabase bediaprive_db \
  --nsInclude 'bediaprive_db.*' \
  database/          # mongorestore reads the bediaprive_db/ subfolder

# Verify
mongosh -u bediaprive_user -p CHANGE_ME_APP_STRONG --authenticationDatabase bediaprive_db \
  --eval 'use bediaprive_db; db.getCollectionNames(); db.workshops.countDocuments()'
```
Indexes (unique slugs, `orderNumber`, `bookingNumber`, etc.) are recreated by
`mongorestore` from the `*.metadata.json` files. Mongoose also re‑ensures them
on boot.

> **PII note:** this dump contains real customer data and password hashes. Only
> restore it to a private, access‑controlled database.

The resulting connection string:
```
mongodb://bediaprive_user:CHANGE_ME_APP_STRONG@127.0.0.1:27017/bediaprive_db?authSource=bediaprive_db
```

---

## 3. Get the code

```bash
sudo mkdir -p /var/www && cd /var/www
sudo git clone https://github.com/AdpediaGitOfficial/bedia-claude.git
sudo chown -R $USER:$USER bedia-claude
cd bedia-claude
git checkout main     # or your release branch/tag
```

---

## 4. Backend API (`/backend`)

### 4.1 Environment
```bash
cd /var/www/bedia-claude/backend
cp .env.example .env
nano .env
```
Set **real** values (see `.env.example` for the full list). Critical ones:
```ini
DATABASE=mongodb://bediaprive_user:CHANGE_ME_APP_STRONG@127.0.0.1:27017/bediaprive_db?authSource=bediaprive_db
PORT=8000
NODE_ENV=production
# Must list every browser origin that calls the API (site + dashboard):
CORS_URLS=["https://bediaprive.adpedia.in","https://admin-bediaprive.adpedia.in"]
JWT_SECRET=<long random string, e.g. `openssl rand -base64 48`>
# Stripe MUST be a SECRET key (sk_...) — the app refuses to start on a pk_ key:
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx      # from the Stripe dashboard webhook (see §7)
FRONTEND_URL=https://bediaprive.adpedia.in
# Mail, Google Places, S3/DO Spaces, etc. — fill the rest.
```

**Do not leave required values blank** — the API fails fast at boot (or on first
request) if any of these are missing. Generate the JWT secret so it's never empty:
```bash
grep -q '^JWT_SECRET=.\+' .env || echo "JWT_SECRET=$(openssl rand -base64 48)" >> .env
grep -q '^JWT_DURATION='   .env || echo "JWT_DURATION=60d" >> .env
```
Required (server refuses to start / login breaks without them):
`DATABASE`, `JWT_SECRET`, `STRIPE_SECRET_KEY` (**must be `sk_...`, not `pk_...`**),
`STRIPE_WEBHOOK_SECRET`, `CORS_URLS` (must include the site **and** dashboard origins).

### 4.2 Build & run
```bash
npm ci
npm run build            # tsc -> ./dist
mkdir -p dist/uploads    # local upload dir the static route serves (or use S3/Spaces)

# NOTE: package.json "start" is buggy (`node -r ./dist/index.js`). Run directly:
pm2 start dist/index.js --name bedia-api --time
pm2 save
pm2 startup   # run the printed command once to enable boot persistence
```
Sanity check on the box:
```bash
curl -s localhost:8000/hello         # -> hello world
```

> Uploaded files: the intended durable store is S3/DigitalOcean Spaces
> (`DO_SPACES_*`). If you rely on the local `uploads/` dir instead, it is
> ephemeral per‑deploy and won't work across multiple instances — prefer Spaces.

### 4.3 Create the dashboard admin
The dashboard logs in via `/auth/login` against the `users` collection. If you
restored the dump, the admin's original password is only a hash (unknown), so
set a known one (creates the admin if missing):
```bash
cd /var/www/bedia-claude/backend
npx ts-node scripts/setAdminPassword.ts admin@bediapottery.ae 'ChangeMe_Strong123'
```
Then log in with that email/password and change it afterward (there is no
password‑reset UI; re‑run this script to rotate).

---

## 5. Frontend (`/frontend`, Next.js)

`NEXT_PUBLIC_API_BASE_URL` is **inlined at build time**, so it must be set
*before* `npm run build`.

```bash
cd /var/www/bedia-claude/frontend
printf 'NEXT_PUBLIC_API_BASE_URL=https://api-bediaprive.adpedia.in\n' > .env.local
npm ci
npm run build            # succeeds even if the API is down (ISR fallback)
pm2 start "npm run start" --name bedia-web --time   # next start on :3000
pm2 save
```
For fresh content at deploy time, have the API reachable during `npm run build`
(pages ISR‑revalidate every 5 min regardless).

---

## 6. Admin dashboard (`/dashboard`, Angular → static)

Point the production build at the live API, then build and let Nginx serve the
static output. (A committed `dashboard/.npmrc` sets `legacy-peer-deps=true`, so
`npm ci` / `npm install` resolve this legacy Angular tree without the old
`ERESOLVE` peer‑dependency error — no flags needed.)

```bash
cd /var/www/bedia-claude/dashboard
# Set the prod API URL:
nano src/environments/environment.prod.ts   # baseUrl: 'https://api-bediaprive.adpedia.in'
npm ci
npm run build-prod        # outputs to dist/enlink/
```
Output is static files in `dashboard/dist/enlink/` — served by Nginx in §8 with
SPA fallback.

---

## 7. Nginx reverse proxy + TLS

Install certbot:
```bash
sudo apt -y install certbot python3-certbot-nginx
```

Create `/etc/nginx/sites-available/bedia.conf`:
```nginx
# --- API (backend :8000) ---
server {
  server_name api-bediaprive.adpedia.in;
  client_max_body_size 30m;                 # matches express.json 30mb limit
  location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
  # Stripe webhook needs the raw, unbuffered body:
  location /workshop/stripe-webhook {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_request_buffering off;
  }
}

# --- Frontend (Next :3000) ---
server {
  server_name bediaprive.adpedia.in;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}

# --- Admin dashboard (static SPA) ---
server {
  server_name admin-bediaprive.adpedia.in;
  root /var/www/bedia-claude/dashboard/dist/enlink;
  index index.html;
  location / { try_files $uri $uri/ /index.html; }   # SPA fallback
}
```
Enable + get certificates:
```bash
sudo ln -s /etc/nginx/sites-available/bedia.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d api-bediaprive.adpedia.in -d bediaprive.adpedia.in -d admin-bediaprive.adpedia.in
```
Certbot rewrites the vhosts to 443 and sets up auto‑renewal.

---

## 8. Stripe webhook

1. Stripe Dashboard → Developers → Webhooks → **Add endpoint**.
2. URL: `https://api-bediaprive.adpedia.in/workshop/stripe-webhook`
3. Events: at least `payment_intent.succeeded` (the app handles that today; add
   `payment_intent.payment_failed` once implemented).
4. Copy the **Signing secret** (`whsec_…`) into `STRIPE_WEBHOOK_SECRET` in
   `backend/.env`, then `pm2 restart bedia-api`.
5. Use Stripe's "Send test webhook" to confirm a `200 {received:true}`.

---

## 9. Post‑deploy verification

```bash
# API up + DB connected (should return JSON data, not a 500):
curl -s https://api-bediaprive.adpedia.in/hello
curl -s https://api-bediaprive.adpedia.in/faq/all | head -c 300
# CORS from the site origin:
curl -s -I -X OPTIONS https://api-bediaprive.adpedia.in/category/all \
  -H 'Origin: https://bediaprive.adpedia.in' -H 'Access-Control-Request-Method: GET' | grep -i access-control
# Frontend renders:
curl -s -o /dev/null -w '%{http_code}\n' https://bediaprive.adpedia.in
# Dashboard loads:
curl -s -o /dev/null -w '%{http_code}\n' https://admin-bediaprive.adpedia.in
pm2 status        # bedia-api + bedia-web both "online"
pm2 logs --lines 50
```
Manual smoke test: log into the admin dashboard, load workshops/bookings, and
run **one real end‑to‑end booking + Stripe payment** to confirm the webhook
flips the order to `paid`.

---

## 10. Security pre‑flight (do BEFORE going public)

Non‑negotiable:
1. **Rotate every secret** ever committed — Stripe keys, AWS/DO Spaces key+secret,
   Gmail app password, `JWT_SECRET`, Google API key, Swagger password. Assume all
   are compromised.
2. Confirm **MongoDB auth is enabled** and `bindIp: 127.0.0.1` (never expose 27017).
3. Fix the **access‑control** issues from `docs/BACKEND_ANALYSIS.md`: admin routes
   behind a real role check, remove public `POST /user/register-admin` &
   `POST /auth/register`, close the cart IDOR, and **remove/guard the open
   `/workshop/test-*` and `/test-email` endpoints** (they send real mail).
4. Make the **Stripe webhook idempotent** before taking real payments.
5. Restrict `/api/docs` (Swagger) and ensure `NODE_ENV=production`.

See `docs/BACKEND_ANALYSIS.md` for the full list and rationale.

---

## 11. Operations

- **Logs:** `pm2 logs bedia-api` / `pm2 logs bedia-web`; Nginx in `/var/log/nginx/`.
- **DB backups (daily cron):**
  ```bash
  mongodump --username bediaprive_user --password *** --authenticationDatabase bediaprive_db \
    --db bediaprive_db --out /var/backups/mongo/$(date +\%F)
  ```
- **Redeploy:**
  ```bash
  cd /var/www/bedia-claude && git pull
  (cd backend && npm ci && npm run build && pm2 restart bedia-api)
  (cd frontend && npm ci && npm run build && pm2 restart bedia-web)
  (cd dashboard && npm ci && npm run build-prod)   # static, no restart needed
  ```
- **Zero downtime:** PM2 keeps the old process serving until the new build is
  ready; `pm2 reload bedia-api` for graceful reload.
- **Monitoring:** `pm2 install pm2-logrotate`; consider uptime checks on `/hello`.

---

## 12. Troubleshooting (errors seen in practice)

| Symptom | Cause | Fix |
|---|---|---|
| `npm error code ERESOLVE ... karma-jasmine-html-reporter / jasmine-core` on `npm install` in **dashboard** | Legacy Angular tree under npm 7+ strict peer resolution | Already handled by committed `dashboard/.npmrc` (`legacy-peer-deps=true`). Use `npm ci`. |
| UI: **`secretOrPrivateKey must have a value`** (on register/login) | `JWT_SECRET` empty in `backend/.env` | Set it (`openssl rand -base64 48`), `pm2 restart bedia-api`. API now fails fast at boot if unset. |
| API won't start: `STRIPE_SECRET_KEY is a publishable key (pk_...)` | A `pk_...` key set as the secret key | Use a real Stripe **secret** key `sk_...`. |
| API won't start: `DATABASE is not set` | Missing/empty `DATABASE` | Set the Mongo connection string in `.env`. |
| Dashboard: **`Invalid Email/Password`** for a known admin | Admin missing in the DB the API uses, or password unknown (restored dump has only a hash) | Run §4.3 `setAdminPassword.ts`; confirm `DATABASE` points at the restored DB. |
| DB routes return `500`, `/hello` returns `200` | API up but MongoDB unreachable/authless | Check `mongod` is running, auth enabled, and the `DATABASE` credentials/`authSource` are correct. |
| Browser CORS errors from the site/dashboard | Origin not in `CORS_URLS` | Add the exact origin(s) to `CORS_URLS` (JSON array), restart. |
| `npm audit` shows 1 high (mongoose `$nor`) | Fixed only in 8.24.1, which breaks types; app pins `~8.16.5` | Not exploitable here (no `sanitizeFilter`/`$nor` usage). Use `npm ci` to keep the pinned, patched tree. |
| `npm warn deprecated tslint@6.1.3` (dashboard) | Old Angular uses TSLint | Warning only — safe to ignore; does not block install/build. |
