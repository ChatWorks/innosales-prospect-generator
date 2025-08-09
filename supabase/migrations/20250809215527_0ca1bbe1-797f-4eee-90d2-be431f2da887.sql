-- Enable required extension
create extension if not exists pgcrypto with schema public;

-- Companies table (read-only for authenticated users)
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  kvk_nummer text not null,
  rechtsvorm text,
  hoofdvestiging_nr text,
  sbi_codes text[],
  reg_date date,
  status text,
  vestigingen_count integer,
  total_emp integer,
  place text,
  province text,
  websites text[],
  non_mailing boolean,
  discovered_at timestamptz not null default now(),
  last_checked_at timestamptz,
  source_raw jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (kvk_nummer)
);

alter table public.companies enable row level security;

-- Policies (drop if exists to be idempotent)
drop policy if exists "Authenticated can read companies" on public.companies;
create policy "Authenticated can read companies"
  on public.companies
  for select
  to authenticated
  using (true);

-- Common updated_at trigger function
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Recreate trigger idempotently
drop trigger if exists update_companies_updated_at on public.companies;
create trigger update_companies_updated_at
before update on public.companies
for each row execute function public.update_updated_at_column();

-- Segments table (user-owned)
create table if not exists public.segments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  name text not null,
  filters_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.segments enable row level security;

-- Segment policies
drop policy if exists "Users can view their own segments" on public.segments;
drop policy if exists "Users can insert their own segments" on public.segments;
drop policy if exists "Users can update their own segments" on public.segments;
drop policy if exists "Users can delete their own segments" on public.segments;

create policy "Users can view their own segments"
  on public.segments
  for select
  to authenticated
  using (auth.uid() = owner_id);

create policy "Users can insert their own segments"
  on public.segments
  for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "Users can update their own segments"
  on public.segments
  for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Users can delete their own segments"
  on public.segments
  for delete
  to authenticated
  using (auth.uid() = owner_id);

-- Recreate trigger idempotently
drop trigger if exists update_segments_updated_at on public.segments;
create trigger update_segments_updated_at
before update on public.segments
for each row execute function public.update_updated_at_column();

-- Segment companies (join table)
create table if not exists public.segment_companies (
  segment_id uuid not null references public.segments(id) on delete cascade,
  kvk_nummer text not null references public.companies(kvk_nummer) on update cascade on delete restrict,
  score integer not null default 0,
  flags jsonb,
  ai_interest_label text,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  is_new_since_last_run boolean not null default false,
  primary key (segment_id, kvk_nummer)
);

alter table public.segment_companies enable row level security;

-- Policies for segment_companies

drop policy if exists "Users can view their own segment companies" on public.segment_companies;
drop policy if exists "Users can insert into their own segment companies" on public.segment_companies;
drop policy if exists "Users can update their own segment companies" on public.segment_companies;
drop policy if exists "Users can delete their own segment companies" on public.segment_companies;

create policy "Users can view their own segment companies"
  on public.segment_companies
  for select
  to authenticated
  using (
    exists (
      select 1 from public.segments s
      where s.id = segment_id and s.owner_id = auth.uid()
    )
  );

create policy "Users can insert into their own segment companies"
  on public.segment_companies
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.segments s
      where s.id = segment_id and s.owner_id = auth.uid()
    )
  );

create policy "Users can update their own segment companies"
  on public.segment_companies
  for update
  to authenticated
  using (
    exists (
      select 1 from public.segments s
      where s.id = segment_id and s.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.segments s
      where s.id = segment_id and s.owner_id = auth.uid()
    )
  );

create policy "Users can delete their own segment companies"
  on public.segment_companies
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.segments s
      where s.id = segment_id and s.owner_id = auth.uid()
    )
  );

-- Helpful indexes
create index if not exists idx_companies_kvk on public.companies(kvk_nummer);
create index if not exists idx_companies_place on public.companies(place);
create index if not exists idx_companies_province on public.companies(province);
create index if not exists idx_segment_companies_segment on public.segment_companies(segment_id);
create index if not exists idx_segment_companies_score on public.segment_companies(score);