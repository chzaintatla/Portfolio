# SparkWave Digital Systems

Marketing site, CMS and lead management for SparkWave Digital Systems.

| Part | Stack | Folder |
| --- | --- | --- |
| Public site + admin portal | Next.js 16, TypeScript, Tailwind v4, Framer Motion, GSAP, Lenis | `frontend/` |
| API | FastAPI, SQLAlchemy 2, Alembic, JWT (HttpOnly cookie + CSRF), RBAC | `backend/` |
| Database | PostgreSQL 16 (SQLite also supported for quick tests) | — |
| Media | Local disk (dev), Cloudinary or S3 (prod) | — |

All site content — services, projects, industries, technologies, process, engagement models, FAQs,
testimonials, blog, team, SEO, settings — comes from the API and is editable at `/admin`.

## Run locally

```bash
# Backend (Python 3.12)
cd backend
python -m venv .venv && .venv\Scripts\activate      # or: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env                                   # set DATABASE_URL, JWT_SECRET, ADMIN_*

# PostgreSQL: use your own server, or run one locally with no system install
pip install pgserver && python scripts/local_pg.py init   # next time: python scripts/local_pg.py start

alembic upgrade head
python -m app.seed.seed                                # --reset reloads content, keeps users & leads
uvicorn app.main:app --port 8000

# Frontend
cd frontend
npm install
cp .env.example .env.local                             # API_URL=http://localhost:8000
npm run dev
```

Site: http://localhost:3000 · Admin: http://localhost:3000/admin · API docs: http://localhost:8000/api/docs

Tests: `cd backend && pytest` (SQLite) or `TEST_DATABASE_URL=postgresql+psycopg://… pytest` (PostgreSQL).

## How it fits together

- The browser only talks to the Next.js origin; `/api/*` and `/uploads/*` are rewritten to FastAPI, so the
  admin session cookie is first-party (HttpOnly, SameSite=Lax) and mutations carry a double-submit CSRF token.
- Public pages are statically generated and revalidate every 5 minutes; after any CMS edit the API calls
  `POST /revalidate` (shared `REVALIDATE_SECRET`) so changes appear immediately.
- Contact submissions become leads (status, priority, notes, follow-ups, assignment, CSV export) and send an
  admin notification + client confirmation email (logged instead of sent when `SMTP_HOST` is empty).
- Roles: Admin (all), Editor (content), Sales (leads), Viewer — editable per resource in Admin → Roles.

## Deploy

- **Frontend:** Vercel (root `frontend/`), env `API_URL`, `NEXT_PUBLIC_SITE_URL`, `REVALIDATE_SECRET`.
- **Backend:** `backend/Dockerfile` on Railway/Render/AWS/VPS. It runs `alembic upgrade head` on start.
  Set `ENVIRONMENT=production`, a long `JWT_SECRET`, `COOKIE_SECURE=true`, `DATABASE_URL`, `FRONTEND_URL`,
  `REVALIDATE_SECRET`, SMTP and storage variables (see `backend/.env.example`).
- Add GA4 / Meta Pixel / Search Console IDs in Admin → Settings → Analytics.

## Daily blog

Admin → Blog opens with a **daily publishing planner**: last week and next two weeks, a publishing streak,
one-click "Write today's post", and rotating topic ideas (edit them in Settings → Blog topics). Posts dated in
the future are saved as *scheduled* and go live on their date automatically. The public `/blog` page leads with
today's article and a 14-day daily feed.

## Content notes

- Projects: 19 shipped products with real screenshots, plus 34 **concept builds** (`is_demo`, shown with a
  "Concept" badge and labelled as reference solutions). Unpublish or convert them in Admin → Projects.
- Stock photos come from Unsplash (free licence) and are hotlinked from `images.unsplash.com`.
- Demo testimonials are seeded **unpublished**. Company statistics stay hidden until real numbers are entered.
