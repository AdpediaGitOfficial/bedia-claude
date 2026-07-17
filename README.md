# Bedia Privé — Monorepo

This repository groups the parts of the Bedia Privé / Bediapottery platform.

```
.
├── frontend/    Next.js public site (React, TypeScript, Tailwind); static assets in frontend/public/
├── dashboard/   Angular admin dashboard (SPA)
├── backend/     REST API (Node.js, Express, TypeScript, Mongoose/MongoDB)
├── database/    MongoDB dump (mongodump BSON) of `bediaprive_db`
└── docs/        Analysis & documentation
```

## Contents

| Path | Description |
|------|-------------|
| [`frontend/`](frontend/) | The customer-facing web app. Public/static assets live in `frontend/public/`. See `frontend/README.md`. |
| [`dashboard/`](dashboard/) | The Angular admin dashboard SPA. See `dashboard/README.md`. |
| [`backend/`](backend/) | The Express API serving workshops, bookings, Stripe checkout, CMS content, and leads. Copy `backend/.env.example` → `backend/.env` and fill in values. |
| [`database/bediaprive_db/`](database/) | BSON dump for local restore via `mongorestore`. |
| [`docs/BACKEND_ANALYSIS.md`](docs/BACKEND_ANALYSIS.md) | Comprehensive backend + database analysis (architecture, ERD, data flow, security/perf findings). |

## Local setup (quick)

```bash
# Backend
cd backend
cp .env.example .env        # then fill in real values
npm install
npm run start:dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev

# Restore the database dump (optional, local Mongo)
mongorestore --db bediapottery database/bediaprive_db
```

## Security notes

- **Never commit real secrets.** `backend/.env` is git-ignored; only `backend/.env.example` (placeholders) is tracked. Any secret that was previously committed should be considered compromised and rotated.
- **`database/` contains real customer PII and bcrypt password hashes.** Treat this repository as private and handle the dump accordingly.
- See `docs/BACKEND_ANALYSIS.md` for the full list of known security issues and recommended fixes.
