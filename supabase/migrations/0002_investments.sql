-- Investments: a per-user watchlist of assets grouped by risk level.
-- Prices/history are never stored here - they're fetched live from external
-- market data APIs (CoinGecko, data912.com) at request time.

create type public.risk_level as enum ('bajo', 'medio', 'alto');
create type public.asset_type as enum ('crypto', 'cedear', 'accion_arg', 'bono_arg');

create table public.assets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null,
  asset_type  public.asset_type not null,
  symbol      text not null,
  risk_level  public.risk_level not null,
  created_at  timestamptz not null default now(),
  unique (user_id, asset_type, symbol)
);

create index assets_user_id_idx on public.assets (user_id);

alter table public.assets enable row level security;

create policy "assets_select_own" on public.assets for select using (auth.uid() = user_id);
create policy "assets_insert_own" on public.assets for insert with check (auth.uid() = user_id);
create policy "assets_update_own" on public.assets for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "assets_delete_own" on public.assets for delete using (auth.uid() = user_id);
