# Initial Setup — STINT Website

Quick-start guide for a new contributor (or AI agent) cloning this repository.

> The legacy [README.md](README.md) describes an older Vite-only version of the project. The current app is **Next.js 16 App Router** with MongoDB-backed API routes. Use this file as the source of truth for setup.

## 1. Prerequisites

- **Node.js** ≥ 20 (the project targets Next.js 16 + React 19)
- **npm** (lockfile is `package-lock.json`)
- A **MongoDB Atlas** cluster (or local `mongod`) — connection string required
- Optional: a Gmail account with an App Password for outbound email

## 2. Clone & install

```bash
git clone <repo-url> stint-website
cd stint-website
npm install
```

## 3. Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Purpose | Example |
| --- | --- | --- |
| `MONGODB_URI` | Mongoose connection string | `mongodb+srv://user:pass@cluster.mongodb.net/stint` |
| `JWT_SECRET` | Signs access tokens | a long random string |
| `JWT_REFRESH_SECRET` | Signs refresh tokens | a different long random string |
| `NEXT_PUBLIC_API_BASE_URL` | Axios base URL | `/api` for local dev |
| `NODE_ENV` | Runtime env | `development` |
| `EMAIL_SERVICE` / `EMAIL_USER` / `EMAIL_PASSWORD` / `EMAIL_FROM` | Nodemailer (contact form) | gmail + app password |

Generate JWT secrets quickly:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## 4. Run the dev server

```bash
npm run dev
```

App: <http://localhost:3000>  ·  API: <http://localhost:3000/api>

On the first DB connection the app auto-creates the default super admin:

- **Email:** `admin@stint.com`
- **Password:** `admin123`

Log in at <http://localhost:3000/admin/login> and **change this password immediately** before deploying anywhere.

## 5. Useful scripts

```bash
npm run dev     # Next.js dev server
npm run build   # Production build
npm run start   # Run the built app
npm run lint    # ESLint
```

One-off database utilities live under `scripts/` and are run directly with Node:

```bash
node scripts/backfill-approvedby.mjs   # stamps approvedBy on legacy visible reviews
```

Use the existing scripts as a template — they read `.env.local` manually then connect via mongoose.

## 6. Project layout (short)

```
app/        Next.js App Router (pages + /api routes)
lib/        DB, models, middleware, JWT, email helpers
src/        UI: components, contexts, services, styles
public/     Static assets (favicon.svg, etc.)
scripts/    One-off DB migrations / seeds (.mjs)
```

A fuller map lives in [.github/copilot-instructions.md](.github/copilot-instructions.md).

## 7. Admin & permissions cheat sheet

- Two-tier admin model: `role: 'admin' | 'user'` plus a boolean `isSuperUser`.
- Only super users can publish a feedback review (`isVisible: true`). The public `/api/feedback` endpoint only returns reviews approved by a super user.
- `admin@stint.com` is force-promoted to super user on every DB connection — see [lib/database.ts](lib/database.ts). Don't try to demote it through the UI.
- More detail in [ADMIN_GUIDE.md](ADMIN_GUIDE.md).

## 8. Deploying

The repo is structured for Vercel (Next.js App Router, no custom server). Configure the same env vars in the Vercel project settings. `app/robots.ts` and `app/sitemap.ts` assume the production domain is `https://stint.digital` — update [app/layout.tsx](app/layout.tsx) `metadataBase` if you deploy elsewhere.

## 9. Where to ask the AI for help

- Repo-wide guidance for AI agents: [.github/copilot-instructions.md](.github/copilot-instructions.md)
- Generic agent rules: [AGENTS.md](AGENTS.md)
- Admin features: [ADMIN_GUIDE.md](ADMIN_GUIDE.md)
