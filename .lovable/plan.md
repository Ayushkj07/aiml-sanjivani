
## Scope

Build a production AI & ML Department Activity Portal matching the layout and structure of https://aiml-activity-portal.vercel.app/ — a public site plus an admin CMS where every piece of content (text, images, PDFs) is editable and reflected live on the public site.

## Stack adjustment (important)

You requested MongoDB + Node/Express + Cloudinary + JWT. Lovable's platform is **TanStack Start (React + Vite) with Lovable Cloud (managed Postgres + Auth + Storage)** — Node/Express/MongoDB servers cannot be hosted here. I'll build the exact same capabilities using the equivalent managed pieces:

| You asked for | We'll use (same capability) |
|---|---|
| Node/Express REST API | TanStack Start server functions |
| MongoDB | Lovable Cloud Postgres |
| JWT auth + admin role | Lovable Cloud Auth + `user_roles` table + `has_role()` RLS |
| Cloudinary image/PDF storage | Lovable Cloud Storage (public bucket, permanent URLs) |
| Gemini (replacing Copilot) | Lovable AI Gateway with `google/gemini-2.5-flash` |

All other requirements — real DB, no dummy data, live sync, full CRUD, admin-only writes, responsive, secure — are met identically. If you must have Node/Express/MongoDB specifically, Lovable is not the right host and you'd need to build/deploy that separately.

## Public routes

`/`, `/about`, `/faculty`, `/student-council`, `/achievements`, `/events`, `/events/$id`, `/gallery`, `/placements`, `/research`, `/news`, `/notices`, `/downloads`, `/contact`

Each route is its own file under `src/routes/` with unique `head()` metadata and loads live data from the DB via TanStack Query.

## Admin routes (`/_authenticated/admin/*`)

Login at `/auth`. Admin-gated dashboard with sub-pages for: Events, Gallery, Faculty, Student Council, Achievements, Placements, Research, News, Notices, Downloads, Contact/Footer/Social, Home/About/Vision/Mission/HOD content blocks, Profile & password.

Every admin page supports Create / Edit / Delete / Show-Hide / Reorder / Replace image where applicable. Uploads go straight to Storage → permanent public URL saved in DB → public page reflects it immediately (React Query invalidation, no redeploy).

## Data model (Postgres, RLS enforced)

- `profiles` (id → auth.users)
- `user_roles` (user_id, role) + `has_role()` security-definer fn
- `site_content` (key, value jsonb) — for editable Home/About/Vision/Mission/HOD/Contact/Footer/Social blocks
- `events` (title, description, date, venue, poster_url, images[], is_visible, sort_order)
- `gallery_images` (url, caption, sort_order)
- `faculty` (name, designation, qualification, email, phone, research_area, photo_url, sort_order)
- `student_council` (name, designation, photo_url, contact, sort_order)
- `achievements` (title, description, date, category, image_url)
- `placements` (student_name, company, package, year, company_logo_url)
- `research` (title, authors, type: paper|publication|patent, year, link, file_url)
- `news` (title, body, image_url, published_at)
- `notices` (title, file_url, published_at)
- `downloads` (title, category: syllabus|form|calendar|timetable|circular, file_url)

Every table: RLS on. `SELECT` public for `is_visible` rows; `INSERT/UPDATE/DELETE` restricted to `has_role(auth.uid(),'admin')`. Grants set for `anon`/`authenticated`/`service_role` per platform rules.

## Storage

Two public buckets: `images` and `documents`. Uploads via authenticated admin only; public read. DB stores the resulting public URL.

## Design

Clean white background, subtle gray borders, minimal accents — matching the reference. Tailwind v4 tokens defined in `src/styles.css` (no ad-hoc colors in components). Responsive desktop/tablet/mobile. No glassmorphism, no extra animations.

## Build order

1. Enable Lovable Cloud; create schema, RLS, storage buckets, `has_role` fn.
2. Design system tokens in `src/styles.css`; shared header/footer layout.
3. Public routes with live DB reads + SEO metadata + sitemap.
4. Auth (`/auth`) + `_authenticated/admin` gate with admin role check.
5. Admin CRUD pages for each entity + image/PDF upload component.
6. Editable site_content blocks (Home hero, About, Vision, Mission, HOD, Contact, Footer, Social).
7. Dashboard with real counts from DB.
8. Seed the first admin user (you'll sign up, then I promote via SQL).

## What is NOT included

- No Node/Express server, no MongoDB, no Cloudinary (replaced with equivalents above).
- No dummy/sample data — DB starts empty and admin populates it.
- No Copilot anywhere; any AI features use Gemini via Lovable AI Gateway.

## Confirm before I start

1. OK to use Lovable Cloud (Postgres + Auth + Storage) in place of MongoDB/Express/Cloudinary? Same capabilities, hosted here.
2. What email should I bootstrap as the first admin? (You'll sign up at `/auth`, then I'll grant the admin role.)
3. Any AI feature you actually want powered by Gemini (e.g. "summarize news", "draft event description"), or is the "replace Copilot with Gemini" line just a guardrail with no active AI feature needed right now?
