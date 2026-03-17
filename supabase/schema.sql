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
  created_at timestamptz default now() not null
);

-- Migration: run this if the sessions table already exists
-- alter table sessions add column if not exists is_paid boolean default false not null;
-- alter table sessions add column if not exists paid_at timestamptz;

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
