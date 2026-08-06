-- Seed a curated starter watchlist (by risk tier) for every new user, so
-- Inversiones isn't empty on day one. Users can still add/remove freely.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.categories (user_id, name, kind, color, is_default) values
    (new.id, 'Salario',        'income',  '#16a34a', true),
    (new.id, 'Freelance',      'income',  '#22c55e', true),
    (new.id, 'Otros ingresos', 'income',  '#4ade80', true),
    (new.id, 'Vivienda',       'expense', '#ef4444', true),
    (new.id, 'Alimentación',   'expense', '#f97316', true),
    (new.id, 'Transporte',     'expense', '#eab308', true),
    (new.id, 'Salud',          'expense', '#06b6d4', true),
    (new.id, 'Ocio',           'expense', '#8b5cf6', true),
    (new.id, 'Otros gastos',   'expense', '#64748b', true);

  insert into public.assets (user_id, name, asset_type, symbol, risk_level) values
    (new.id, 'Bono AL30',  'bono_arg', 'AL30',   'bajo'),
    (new.id, 'Bono GD30',  'bono_arg', 'GD30',   'bajo'),
    (new.id, 'Apple',      'cedear',   'AAPL',   'medio'),
    (new.id, 'Microsoft',  'cedear',   'MSFT',   'medio'),
    (new.id, 'Coca-Cola',  'cedear',   'KO',     'medio'),
    (new.id, 'Bitcoin',    'crypto',   'bitcoin',  'alto'),
    (new.id, 'Ethereum',   'crypto',   'ethereum', 'alto'),
    (new.id, 'Solana',     'crypto',   'solana',   'alto');

  return new;
end;
$$;

-- Backfill: give existing users (created before this migration) the same
-- starter watchlist, unless they already have assets loaded.
insert into public.assets (user_id, name, asset_type, symbol, risk_level)
select u.id, defaults.name, defaults.asset_type, defaults.symbol, defaults.risk_level
from auth.users u
cross join (values
  ('Bono AL30',  'bono_arg'::public.asset_type, 'AL30',     'bajo'::public.risk_level),
  ('Bono GD30',  'bono_arg'::public.asset_type, 'GD30',     'bajo'::public.risk_level),
  ('Apple',      'cedear'::public.asset_type,   'AAPL',     'medio'::public.risk_level),
  ('Microsoft',  'cedear'::public.asset_type,   'MSFT',     'medio'::public.risk_level),
  ('Coca-Cola',  'cedear'::public.asset_type,   'KO',       'medio'::public.risk_level),
  ('Bitcoin',    'crypto'::public.asset_type,   'bitcoin',  'alto'::public.risk_level),
  ('Ethereum',   'crypto'::public.asset_type,   'ethereum', 'alto'::public.risk_level),
  ('Solana',     'crypto'::public.asset_type,   'solana',   'alto'::public.risk_level)
) as defaults(name, asset_type, symbol, risk_level)
where not exists (select 1 from public.assets a where a.user_id = u.id)
on conflict (user_id, asset_type, symbol) do nothing;
