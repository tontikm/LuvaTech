# LuvaTech

Premium company website and live demo of business automation capabilities.

**Stack:** Next.js 16 · React 19 · Tailwind v4 · Prisma · Supabase · OpenAI · Resend · Framer Motion

## Quick start

```bash
cd /Users/mac/luvatech
npm install
cp .env.example .env.local
npm run dev
```

Open **http://localhost:3002**

Without `DATABASE_URL`, data persists to `.data/luvatech-db.json` locally.

## Features

- Premium dark landing page with live product demos
- Floating AI assistant (quotes, lead qual, booking)
- Branded PDF quotation generation + email delivery
- Consultation booking system
- Admin dashboard (leads, conversations, quotes, meetings, analytics)
- 9 service pages + interactive case studies

## Environment

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Supabase Postgres (Prisma) |
| `OPENAI_API_KEY` | AI assistant |
| `RESEND_API_KEY` | Quote/booking emails |
| `NEXT_PUBLIC_SUPABASE_*` | Admin auth |
| `ADMIN_DEV_BYPASS=true` | Skip auth in dev |

## Database

Without `DATABASE_URL`, data saves to `.data/luvatech-db.json` locally.

### Connect your Supabase project

1. Open your **LuvaTech** project in [Supabase Dashboard](https://supabase.com/dashboard)
2. Copy keys into [`.env.local`](/Users/mac/luvatech/.env.local):

| Variable | Where in Supabase |
|----------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → service_role (secret) |
| `DATABASE_URL` | Settings → Database → URI (Transaction pooler, port 6543) |
| `DIRECT_URL` | Settings → Database → URI (Direct, port 5432) |

3. Push the schema and create an admin user:

```bash
npm run env:check
npm run db:push
npm run admin:setup -- you@email.com "Your Name"
```

4. Disable dev bypass and restart:

```env
ADMIN_DEV_BYPASS=false
```

5. Add **http://localhost:3002** to Supabase → Authentication → URL Configuration → Redirect URLs

```bash
npm run db:studio  # browse data
```

## Deploy to Vercel

1. Copy env vars from [`.env.example`](.env.example) into the Vercel project (Settings → Environment Variables). Use your production URL for `NEXT_PUBLIC_SITE_URL` and set `ADMIN_DEV_BYPASS=false`.
2. Run locally first:

```bash
npm run deploy:check   # env + build
npm run db:push        # sync Prisma schema to Supabase
npm run admin:setup -- you@email.com "Your Name"
```

3. Deploy:

```bash
npm run sync:vercel-env   # push Supabase vars to Vercel (ADMIN_DEV_BYPASS=false)
npx vercel link           # once, connect to GitHub repo
npx vercel --prod         # or enable auto-deploy from main in Vercel dashboard
```

**Production:** https://luvatech.vercel.app

4. In Supabase → Authentication → URL Configuration, add these Redirect URLs:
   - `https://luvatech.vercel.app/**`
   - `http://localhost:3002/**` (local dev)

### Phase 3 — API keys (last)

Add in Vercel Production (or locally in `.env.local` then `npm run sync:vercel-env`):

- `OPENAI_API_KEY` — AI assistant
- `RESEND_API_KEY` — quote and booking emails

Smoke-test after keys are set:

```bash
npm run test:email -- you@email.com
npm run test:chatbot
npm run apis:smoke
```

## Security

Production APIs are rate-limited when Upstash Redis is configured:

| Variable | Purpose |
|----------|---------|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL (rate limits + action caps) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |

Create a free database at [upstash.com](https://upstash.com), add both vars to Vercel Production, then run `npm run sync:vercel-env`.

Without Upstash in production, rate-limited routes return **503** so misconfiguration is visible.

**Supabase:** disable public sign-up in Authentication → Providers unless you need it. Admin users are created via `npm run admin:setup`.

Security headers (CSP, HSTS, frame deny) are set in [`next.config.ts`](next.config.ts).

## Ports

| Project | Port |
|---------|------|
| Spotra (tonti) | 3000 |
| LuvaTech | 3002 |
