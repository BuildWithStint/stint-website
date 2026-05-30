# AGENTS.md

Guidance for any AI coding agent (Copilot, Claude Code, Cursor, etc.) operating in this repo. This is the tool-agnostic companion to [.github/copilot-instructions.md](.github/copilot-instructions.md) — read that one too.

## Build & run

```bash
npm install
cp .env.example .env.local        # then fill in real values
npm run dev                       # http://localhost:3000
npm run build && npm run start    # production build
npm run lint                      # ESLint
```

There is no test suite yet. Validate changes by `npm run build` and exercising the affected route in the browser.

## Required environment

See [.env.example](.env.example). At minimum, the app needs:

- `MONGODB_URI` — Atlas connection string
- `JWT_SECRET`, `JWT_REFRESH_SECRET` — long random strings
- `NEXT_PUBLIC_API_BASE_URL` — usually `/api`
- `EMAIL_*` — only required if you exercise contact / notification flows

## Boundaries

- **Stack is fixed:** Next.js App Router, Mongoose, axios, Tailwind, Framer Motion. Don't swap.
- **Auth model is fixed:** `role: 'admin' | 'user'` + `isSuperUser: boolean`. The super-admin (`admin@stint.com`) is bootstrapped in [lib/database.ts](lib/database.ts) on every connect.
- **Public review visibility:** A feedback document is publicly visible only when `isVisible: true` AND `approvedBy` points to a user with `isSuperUser: true`. Enforced in [app/api/feedback/route.ts](app/api/feedback/route.ts) and [app/api/feedback/[id]/route.ts](app/api/feedback/[id]/route.ts).

## Code style

- TypeScript everywhere. No `any` unless interfacing with `jsonwebtoken` decoded payloads.
- Client components: `'use client'` directive at the top.
- All HTTP from the browser goes through [src/services/api.ts](src/services/api.ts).
- All DB access goes through Mongoose models in [lib/models/](lib/models/).
- Keep comments minimal — only when the *why* is non-obvious.
- Don't update legacy docs (`README.md`, `STRUCTURE.md`); add/update [SETUP.md](SETUP.md) or [ADMIN_GUIDE.md](ADMIN_GUIDE.md) instead.

## Safe to do without asking

- Edit any file under `app/`, `lib/`, `src/`, `scripts/`.
- Run `npm run dev`, `npm run build`, `npm run lint`.
- Add new `scripts/*.mjs` migrations and run them locally.

## Ask first

- Any operation against a non-local MongoDB (Atlas).
- Any `git push`, force-push, branch deletion, or PR merge.
- Editing `.env.local` values you weren't given.
- Changing the auth/permission model.
