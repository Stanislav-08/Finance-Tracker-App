# Finance Tracker

React + Vite frontend, Express + Prisma API, Supabase (Auth + Postgres).

## 1. Database
Supabase dashboard → **SQL Editor** → paste `supabase/setup.sql` → Run.
It creates all tables, seeds categories, adds the sign-up trigger, and enables RLS.
(Don't also run `prisma migrate` against the same database — the SQL file replaces it.)

## 2. Environment
- Root: copy `.env.example` → `.env` (Supabase URL + publishable/anon key, `VITE_API_URL`).
- `server/`: copy `.env.example` → `.env` (DB connection strings from Supabase → Connect).
- Supabase → Authentication → Providers → Email: turn off "Confirm email" for local testing.

## 3. Run
```bash
npm install && npm run dev                 # frontend  http://localhost:5173
cd server && npm install && npx prisma generate && npm run dev   # API  http://localhost:5000
```

## Deploy on Vercel (two projects, one GitHub repo)
1. **API** — New Project → import repo → Root Directory `server`. Env vars: `DATABASE_URL`, `VITE_SUPABASE_URL`, `CLIENT_ORIGIN` (your frontend URL, no trailing slash).
2. **Frontend** — New Project → import repo → Root Directory `.` (Vite preset). Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_API_URL` (your API project URL).
3. Supabase → Authentication → URL Configuration: set Site URL to the frontend URL.
