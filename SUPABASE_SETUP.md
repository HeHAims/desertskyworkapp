# Desert Sky WorkApp Supabase Setup

## Environment variables

Add these in Vercel Project Settings > Environment Variables and in a local `.env` file when developing:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_WORKSPACE_ACCESS_CODE=DSW2026
```

## Storage bucket

Create one Supabase Storage bucket:

- `job-files`

For the demo, make it public so uploaded previews can open from the app. For production, use private buckets plus signed URLs.

## Suggested production tables

```sql
create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  access_code_hash text,
  created_at timestamptz default now()
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references companies(id),
  email text not null,
  role text not null default 'technician',
  full_name text,
  active boolean not null default true,
  created_at timestamptz default now()
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  job_code text not null,
  customer_name text,
  account text,
  address text,
  scheduled_date date,
  time_window text,
  status text not null default 'ready',
  instructions text,
  created_at timestamptz default now()
);

create table job_files (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  job_id uuid references jobs(id),
  uploaded_by uuid references auth.users(id),
  upload_type text not null,
  file_name text not null,
  storage_path text not null,
  created_at timestamptz default now()
);

create table job_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  job_id uuid references jobs(id),
  actor_id uuid references auth.users(id),
  event_type text not null,
  note text,
  created_at timestamptz default now()
);
```

## Next production step

Replace the demo access-code check with Supabase Auth plus a `profiles` lookup. Keep the access code as an onboarding gate, but store real users by email so every job action and upload is traceable.
