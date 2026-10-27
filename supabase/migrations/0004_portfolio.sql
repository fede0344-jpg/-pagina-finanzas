-- Portfolio: how much money the user holds in each asset, in ARS or USD.
-- Amounts are entered by hand; percentages are computed in the app.

create table public.portfolio_positions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 40),
  amount      numeric(18, 2) not null check (amount > 0),
  currency    text not null check (currency in ('ARS', 'USD')),
  created_at  timestamptz not null default now()
);

create index portfolio_positions_user_id_idx on public.portfolio_positions (user_id);

alter table public.portfolio_positions enable row level security;

create policy "portfolio_select_own" on public.portfolio_positions for select using (auth.uid() = user_id);
create policy "portfolio_insert_own" on public.portfolio_positions for insert with check (auth.uid() = user_id);
create policy "portfolio_update_own" on public.portfolio_positions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "portfolio_delete_own" on public.portfolio_positions for delete using (auth.uid() = user_id);
