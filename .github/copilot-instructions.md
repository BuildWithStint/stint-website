# Copilot Instructions — STINT Website

Repository-specific guidance for AI coding agents working on this codebase. Read this fully before editing.

## 1. Project at a glance

- **Stack:** Next.js 16 (App Router) + React 19 + TypeScript, Tailwind CSS, Framer Motion, MongoDB (Mongoose), JWT auth, Nodemailer.
- **Production domain:** `https://stint.digital`
- **Package manager:** npm (see `package-lock.json`).
- The legacy `README.md` and `STRUCTURE.md` describe a Vite/React-only setup. **They are out of date** — the real app is Next.js App Router with API routes under `app/api/`. Trust the code over those docs.

## 2. Directory map (authoritative)

```
app/                   Next.js App Router (pages + API)
  layout.tsx           Global metadata, JSON-LD, favicon wiring
  page.tsx             Marketing home (Hero, Work, Team, FeedbackTicker, Contact…)
  work/                /work route (server wrapper + WorkClient)
  admin/               Admin SPA (login, dashboard)
  api/                 Route handlers (REST-ish, JSON)
    auth/              login, refresh, profile (JWT)
    contact/submit     Public contact form intake
    contact-settings/  Admin-managed contact info
    feedback/          GET public (super-admin-approved only), POST/PUT/DELETE admin
    feedback/submit    Public review submission (saved hidden, pending approval)
    feedback/all       Admin list (everything)
    projects/, team/, users/
lib/
  database.ts          Mongoose connect + default super-admin bootstrap
  jwt.ts               Token sign/verify helpers
  middleware.ts        withCors, withDatabase, withAuth (AuthenticatedRequest)
  email.ts             Nodemailer transport
  models/              User, Project, TeamMember, Feedback, ContactSettings
src/
  components/          UI (sections/, admin/, pages/, ui/)
  contexts/            AuthContext, TeamContext
  services/api.ts      Axios client; all API calls live here
  data/                Static fallback data
  constants/, types/, utils/, styles/globals.css
public/                Static assets (favicon.svg, images)
scripts/               One-off mongoose migration / seed scripts (run with `node scripts/<name>.mjs`)
```

## 3. Conventions to follow

### API routes
- Every handler is composed: `export const GET = withCors(withDatabase(handler))`. Add `withAuth` for protected ones.
- Authenticated handlers receive `AuthenticatedRequest` with `req.user = { id, email, role, isSuperUser }`. Always check `req.user?.isSuperUser` for privileged mutations (publishing reviews, deleting users, etc.).
- Return shape is consistent: `{ success: boolean, ...data }` or `{ success: false, error: string }` with proper status codes.
- Validate inputs at the route boundary; trust internal calls.

### Mongoose models
- All under `lib/models/`. Each exports both the interface and the model. Use `mongoose.models.X || mongoose.model('X', schema)` pattern (already in place) to survive hot reload.
- `User.isSuperUser` gates super-admin powers. `admin@stint.com` is bootstrapped as super on every connect (see `lib/database.ts`).
- `Feedback.isVisible` + `Feedback.approvedBy` (User ref) together gate public display. Public `GET /api/feedback` uses an aggregate with `$lookup` and only returns docs whose approver is `isSuperUser: true`.

### Frontend
- Client components must start with `'use client'`. Server components handle metadata.
- Animations use `framer-motion` (`motion`, `AnimatePresence`, `layoutId`). Match existing easing/timing.
- Color tokens: gold accent `--accent: #C8973D`, dark background. Use Tailwind + CSS vars already defined in `src/styles/globals.css`.
- API calls go through `src/services/api.ts` (axios). Do not call `fetch` directly from components.

### Auth flow (frontend)
- `src/contexts/AuthContext.tsx` owns token storage and refresh.
- `src/components/ProtectedRoute.tsx` guards admin pages.
- Default admin login: `admin@stint.com` / `admin123` (dev only — must be rotated in any real environment).

## 4. Editing rules

- Do **not** modify `README.md` / `STRUCTURE.md` to keep them in sync — they are legacy. Use `SETUP.md` and `ADMIN_GUIDE.md` for current docs.
- Do **not** introduce a new HTTP client, ORM, or state library — stick with axios + mongoose + React context.
- Do **not** widen `User` roles or invent new permission tiers. The model is `role: 'admin' | 'user'` + `isSuperUser: boolean`.
- Do **not** create files just to document a change. Update existing docs only when explicitly asked.
- Keep comments minimal and only where the *why* is non-obvious (see global agent guidance).
- When adding migration / seed scripts, place them in `scripts/` as `.mjs` and load env via `.env.local` (see existing scripts for the pattern).

## 5. Common tasks — recipes

- **Add a public-readable API endpoint:** create `app/api/<name>/route.ts`, export `GET = withCors(withDatabase(handler))`, return `{ success, data }`.
- **Add an admin-only endpoint:** wrap with `withAuth`; for super-admin-only, check `req.user?.isSuperUser` inside.
- **Add a model:** drop a file in `lib/models/`, follow the `mongoose.models.X || mongoose.model(...)` pattern, export interface + model.
- **Run a one-off DB script:** copy `scripts/backfill-approvedby.mjs` as a template (it reads `.env.local` manually, then connects via mongoose).
- **Update site metadata / SEO:** edit `app/layout.tsx` (global) or `app/<route>/page.tsx` (per-route). Robots and sitemap live in `app/robots.ts` and `app/sitemap.ts`.

## 6. Things that have bitten us

- The legacy docs imply Vite — they are wrong. This is Next.js.
- `Feedback` documents created before the approval system was added have no `approvedBy` and will silently disappear from the public ticker. Backfill via `scripts/backfill-approvedby.mjs` after introducing approval gating.
- `admin@stint.com` is auto-promoted to super user on every `connectDatabase()` call. Don't try to demote it through the UI — `lib/database.ts` will re-promote on the next request.
- `NEXT_PUBLIC_API_BASE_URL` defaults to `/api` in production (`.env.example`) and `http://localhost:5001/api` in `next.config.js`. For local dev against the same Next server, set it to `/api` in `.env.local`.
