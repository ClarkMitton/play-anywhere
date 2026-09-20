-- ─────────────────────────────────────────────────────────────
-- AI SESSION AUTHORING
-- Supports the generate-session edge function and the AI-draft label.
-- ─────────────────────────────────────────────────────────────

-- Backs the daily generation cap. Written by the edge function using the
-- service-role key, so no anon policy exists: clients must not read or
-- write usage data. The in-memory per-IP rate limiter in the function is
-- per-isolate and does not survive recycling, so this table is the real cap.
create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  ip text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists usage_events_created_at_idx
  on public.usage_events (created_at desc);

alter table public.usage_events enable row level security;

-- Labels a lesson as an AI draft. This is a label, not a gate: generated
-- lessons can still be launched. Drives the banner in the Stage Designer.
alter table public.lessons
  add column if not exists ai_generated boolean not null default false,
  add column if not exists generated_at timestamptz;

-- Holds the generated rationale, objectives, run sheet, facts to verify and
-- media still to source, so the tutor can read them in the designer and at
-- teaching time rather than only at the review step.
alter table public.lessons
  add column if not exists ai_notes jsonb;
