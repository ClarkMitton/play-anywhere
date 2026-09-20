-- ─────────────────────────────────────────────────────────────
-- AI SESSION AUTHORING
-- Supports the generate-session edge function and the AI-draft label.
-- ─────────────────────────────────────────────────────────────

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  ip text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists usage_events_created_at_idx
  on public.usage_events (created_at desc);

-- service_role only: the edge function writes here. No anon/authenticated
-- grants and no policies, so browser clients can never read or write it.
grant all on public.usage_events to service_role;

alter table public.usage_events enable row level security;

alter table public.lessons
  add column if not exists ai_generated boolean not null default false,
  add column if not exists generated_at timestamptz;

alter table public.lessons
  add column if not exists ai_notes jsonb;