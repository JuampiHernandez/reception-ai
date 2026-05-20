# Supabase project for Reception.ai

**Use this project only** — do not use `eleven-hacks-8` or other projects.

| Field | Value |
|-------|--------|
| Name | `reception-ai` |
| Project ref | `kfwwbldrhcmmelguhris` |
| Region | `sa-east-1` |
| Dashboard | https://supabase.com/dashboard/project/kfwwbldrhcmmelguhris |
| API URL | `https://kfwwbldrhcmmelguhris.supabase.co` |

## Schema

Tables were created via MCP migration `reception_ai_initial` (tenants, users, doctors, services, appointments, etc.).

## What you still need manually

**`DATABASE_URL`** — MCP cannot read your database password.

1. Dashboard → **Project Settings** → **Database** → **Connection string** → **URI**
2. Mode: **Transaction** (pooler, port 6543)
3. Paste into `.env.local`:

```env
DATABASE_URL=postgresql://postgres.kfwwbldrhcmmelguhris:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
NEXT_PUBLIC_SUPABASE_URL=https://kfwwbldrhcmmelguhris.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from dashboard>
```

4. Seed demo data:

```bash
npm run db:seed
```

## `eleven-hacks-8` — not modified

That project was only **read** (list tables). No migrations or data were applied there. Nothing to revert.
