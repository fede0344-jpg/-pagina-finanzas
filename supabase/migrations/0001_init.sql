-- Personal finance MVP: categories + transactions, owned per-user via RLS.

create type public.money_flow as enum ('income', 'expense');

create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null,
  kind        public.money_flow not null,
  color       text not null default '#64748b',
  is_default  boolean not null default false,
  created_at  timestamptz not null default now(),
  unique (user_id, name, kind)
);

create table public.transactions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  category_id  uuid references public.categories (id) on delete set null,
  type         public.money_flow not null,
  amount       numeric(12, 2) not null check (amount > 0),
  description  text,
  occurred_on  date not null default current_date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index categories_user_id_idx on public.categories (user_id);
create index transactions_user_occurred_idx on public.transactions (user_id, occurred_on desc);
create index transactions_category_idx on public.transactions (category_id);

-- Row Level Security: every row is only visible/writable by its owner.
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

create policy "categories_select_own" on public.categories for select using (auth.uid() = user_id);
create policy "categories_insert_own" on public.categories for insert with check (auth.uid() = user_id);
create policy "categories_update_own" on public.categories for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "categories_delete_own" on public.categories for delete using (auth.uid() = user_id);

create policy "transactions_select_own" on public.transactions for select using (auth.uid() = user_id);
create policy "transactions_insert_own" on public.transactions for insert with check (auth.uid() = user_id);
create policy "transactions_update_own" on public.transactions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "transactions_delete_own" on public.transactions for delete using (auth.uid() = user_id);

-- Seed default categories for every new user.
-- security definer + a pinned search_path is required so this function cannot
-- be hijacked by a malicious object shadowing `categories` on another schema.
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
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
