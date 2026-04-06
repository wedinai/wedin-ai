-- wedin.ai — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)
-- Tables are locked down by default; all writes go through Netlify Functions
-- using the service role key, which bypasses RLS.

-- ── Sessions ──────────────────────────────────────────────────────────────────
-- One row per completed discovery session. Answers stored as JSONB.

create table if not exists sessions (
  id         uuid        default gen_random_uuid() primary key,
  answers    jsonb       not null,
  is_paid    boolean     default false not null,
  paid_at    timestamptz,
  email      text,                    -- set when couple submits email at portrait screen
  state      jsonb,                   -- incremental session state: couple_name, portrait, moment_answers, etc.
  created_at timestamptz default now() not null
);

create index if not exists sessions_email_idx on sessions(email);

-- Migration: run this if the sessions table already exists without new columns
-- alter table sessions add column if not exists is_paid boolean default false not null;
-- alter table sessions add column if not exists paid_at timestamptz;
-- alter table sessions add column if not exists email text;
-- alter table sessions add column if not exists state jsonb;
-- create index if not exists sessions_email_idx on sessions(email);

alter table sessions enable row level security;

-- ── Contacts ──────────────────────────────────────────────────────────────────
-- One row per email capture. Linked to the session that produced it.

create table if not exists contacts (
  id         uuid        default gen_random_uuid() primary key,
  email      text        not null,
  session_id uuid        references sessions(id) on delete set null,
  created_at timestamptz default now() not null
);

alter table contacts enable row level security;
