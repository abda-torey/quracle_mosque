-- Run this in your Supabase project → SQL Editor

create table pledges (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  full_name text not null,
  nickname text,
  phone text not null,
  location text not null,
  amount integer not null,
  payment_method text not null default 'M-Pesa',
  message text,
  status text not null default 'pledged' check (status in ('pledged', 'paid'))
);

-- Allow public read (so the home page can show the list)
alter table pledges enable row level security;

create policy "Anyone can view pledges"
  on pledges for select
  using (true);

-- Only the service role (server-side API) can insert/update/delete
create policy "Service role can insert"
  on pledges for insert
  with check (true);

create policy "Service role can update"
  on pledges for update
  using (true);

create policy "Service role can delete"
  on pledges for delete
  using (true);

-- Index for ordering
create index pledges_created_at_idx on pledges(created_at desc);
