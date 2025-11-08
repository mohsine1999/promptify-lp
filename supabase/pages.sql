-- Schema for the landing pages used by the Promptify editor.
-- Run inside the Supabase SQL editor or via the Supabase CLI.

create table if not exists public.pages (
  id text primary key,
  slug text unique,
  status text not null default 'draft' check (status in ('draft', 'published')),
  domain text,
  published_at timestamptz,
  doc jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists pages_slug_idx on public.pages (slug);

create or replace function public.handle_pages_updated_at()
returns trigger as
$$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_pages_updated_at on public.pages;
create trigger set_pages_updated_at
before update on public.pages
for each row
execute function public.handle_pages_updated_at();

alter table public.pages enable row level security;

drop policy if exists "Allow authenticated CRUD" on public.pages;
create policy "Allow authenticated CRUD" on public.pages
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Service role keys bypass RLS automatically, so no extra policy is required for them.
