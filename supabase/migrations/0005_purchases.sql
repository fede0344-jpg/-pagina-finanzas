-- Purchases: each buy of an asset (date + amount invested + price paid).
-- The quantity is stored at purchase time (invested / buy_price) so the
-- return can be computed later against the live price without re-fetching
-- history. Prices are in the asset's quote currency: USD for crypto, ARS
-- for CEDEARs, Argentine stocks and bonds.

create table public.purchases (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  asset_type     public.asset_type not null,
  symbol         text not null check (char_length(symbol) between 1 and 20),
  name           text not null check (char_length(name) between 1 and 60),
  purchase_date  date not null,
  invested       numeric(18, 2) not null check (invested > 0),
  buy_price      numeric(24, 8) not null check (buy_price > 0),
  quantity       numeric(30, 12) not null check (quantity > 0),
  created_at     timestamptz not null default now()
);

create index purchases_user_id_idx on public.purchases (user_id, purchase_date desc);

alter table public.purchases enable row level security;

create policy "purchases_select_own" on public.purchases for select using (auth.uid() = user_id);
create policy "purchases_insert_own" on public.purchases for insert with check (auth.uid() = user_id);
create policy "purchases_update_own" on public.purchases for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "purchases_delete_own" on public.purchases for delete using (auth.uid() = user_id);
