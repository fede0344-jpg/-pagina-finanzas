-- Portfolio positions can now be entered by quantity (e.g. 0.5 BTC) instead of
-- a fixed amount. For those, the value is quantity x live price, computed in
-- the app. `currency` keeps the asset's quote currency (USD for crypto, ARS
-- for the rest) and `amount` stays null.

alter table public.portfolio_positions
  add column asset_type public.asset_type,
  add column symbol     text check (symbol is null or char_length(symbol) between 1 and 20),
  add column quantity   numeric(30, 12) check (quantity is null or quantity > 0),
  alter column amount drop not null;

-- Either a fixed amount (as before) or an asset + quantity.
alter table public.portfolio_positions
  add constraint portfolio_positions_amount_or_quantity check (
    (quantity is null and amount is not null and asset_type is null and symbol is null)
    or
    (quantity is not null and asset_type is not null and symbol is not null)
  );
