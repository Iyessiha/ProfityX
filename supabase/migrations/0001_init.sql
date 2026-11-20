-- ProfityX v2 — migration 0001 : comptes, forfaits, abonnements, crédits.
--
-- Principes :
--  * Le solde ne change QUE via les fonctions SECURITY DEFINER ci-dessous.
--    Aucun client (anon / authenticated) ne peut écrire directement dans les tables de crédits.
--  * Le coût d'une fonctionnalité est lu côté serveur (table credit_costs) : le client ne le choisit pas.
--  * Chaque mouvement de crédits est tracé dans credit_ledger (historique de consommation).
--  * Les paiements sont idempotents (unique provider + référence fournisseur).

create extension if not exists pgcrypto;

-- Schéma privé : fonctions internes, non exposées par l'API REST.
create schema if not exists private;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  locale      text not null default 'fr' check (locale in ('fr', 'en')),
  country     text,
  created_at  timestamptz not null default now()
);

create table public.plans (
  code         text primary key,
  name_fr      text not null,
  name_en      text not null,
  kind         text not null check (kind in ('trial', 'subscription', 'pack')),
  price_usd    numeric(10, 2) not null default 0 check (price_usd >= 0),
  credits      integer not null check (credits > 0),
  includes_ea  boolean not null default false,
  active       boolean not null default true
);

create table public.credit_costs (
  feature   text primary key,
  cost      integer not null check (cost > 0),
  label_fr  text not null,
  label_en  text not null
);

create table public.subscriptions (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  plan_code             text not null references public.plans(code),
  status                text not null default 'active'
                          check (status in ('active', 'past_due', 'cancelled', 'expired')),
  current_period_start  timestamptz not null default now(),
  current_period_end    timestamptz not null,
  created_at            timestamptz not null default now()
);
create index subscriptions_user_status_idx on public.subscriptions (user_id, status);

create table public.payments (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  provider      text not null check (provider in ('geniuspay', 'paystack', 'mpesa')),
  provider_ref  text not null,
  plan_code     text not null references public.plans(code),
  amount        numeric(12, 2) not null check (amount >= 0),
  currency      text not null,
  status        text not null default 'succeeded' check (status in ('pending', 'succeeded', 'failed')),
  created_at    timestamptz not null default now(),
  unique (provider, provider_ref)
);

create table public.credit_balances (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  balance     integer not null default 0 check (balance >= 0),
  updated_at  timestamptz not null default now()
);

create table public.credit_ledger (
  id             bigint generated always as identity primary key,
  user_id        uuid not null references auth.users(id) on delete cascade,
  delta          integer not null check (delta <> 0),
  balance_after  integer not null check (balance_after >= 0),
  kind           text not null check (kind in ('trial', 'subscription', 'pack', 'spend', 'refund', 'adjustment')),
  reason         text not null,
  ref            text,
  created_at     timestamptz not null default now()
);
create index credit_ledger_user_created_idx on public.credit_ledger (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Données de référence
-- ---------------------------------------------------------------------------

-- Prix provisoires (à confirmer avant mise en production).
insert into public.plans (code, name_fr, name_en, kind, price_usd, credits, includes_ea) values
  ('trial',        'Essai',         'Trial',        'trial',        0,  20,   false),
  ('intermediate', 'Intermédiaire', 'Intermediate', 'subscription', 15, 300,  false),
  ('premium',      'Premium',       'Premium',      'subscription', 39, 1000, true);

insert into public.credit_costs (feature, cost, label_fr, label_en) values
  ('quick_question',     1, 'Question rapide',                'Quick question'),
  ('economic_calendar',  1, 'Calendrier économique',          'Economic calendar'),
  ('ai_signal',          3, 'Signal IA',                      'AI signal'),
  ('chart_analysis',     5, 'Analyse de capture de graphique', 'Chart screenshot analysis'),
  ('ea_trade_execution', 1, 'Exécution d''un trade via EA',   'Trade execution via EA');

-- ---------------------------------------------------------------------------
-- Fonctions internes (schéma private)
-- ---------------------------------------------------------------------------

-- Seul point d'écriture des soldes. Verrouille la ligne, refuse un solde négatif.
create or replace function private.apply_credit_change(
  p_user   uuid,
  p_delta  integer,
  p_kind   text,
  p_reason text,
  p_ref    text default null
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_new integer;
begin
  if p_delta is null or p_delta = 0 then
    raise exception 'invalid_delta';
  end if;

  insert into public.credit_balances (user_id, balance)
  values (p_user, 0)
  on conflict (user_id) do nothing;

  update public.credit_balances
     set balance = balance + p_delta,
         updated_at = now()
   where user_id = p_user
     and balance + p_delta >= 0
  returning balance into v_new;

  if v_new is null then
    raise exception 'insufficient_credits';
  end if;

  insert into public.credit_ledger (user_id, delta, balance_after, kind, reason, ref)
  values (p_user, p_delta, v_new, p_kind, p_reason, p_ref);

  return v_new;
end;
$$;

-- Création du profil + crédits d'essai à l'inscription.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_trial integer;
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;

  select credits into v_trial from public.plans where code = 'trial';
  perform private.apply_credit_change(new.id, v_trial, 'trial', 'trial', null);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- ---------------------------------------------------------------------------
-- Fonctions exposées
-- ---------------------------------------------------------------------------

-- Consommation de crédits par l'utilisateur connecté. Le coût vient de credit_costs.
create or replace function public.spend_credits(p_feature text, p_ref text default null)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid  uuid := auth.uid();
  v_cost integer;
begin
  if v_uid is null then
    raise exception 'not_authenticated';
  end if;

  select cost into v_cost from public.credit_costs where feature = p_feature;
  if v_cost is null then
    raise exception 'unknown_feature';
  end if;

  return private.apply_credit_change(v_uid, -v_cost, 'spend', p_feature, left(p_ref, 200));
end;
$$;

-- Activation d'un forfait après paiement confirmé. Appelée UNIQUEMENT par le serveur
-- (webhooks), avec la clé service_role. Idempotente : même référence = pas de double crédit.
create or replace function public.grant_plan_payment(
  p_provider  text,
  p_ref       text,
  p_user      uuid,
  p_plan      text,
  p_amount    numeric,
  p_currency  text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_plan     public.plans;
  v_inserted integer;
begin
  select * into v_plan from public.plans where code = p_plan and active;
  if not found then
    raise exception 'unknown_plan';
  end if;
  if v_plan.kind = 'trial' then
    raise exception 'trial_not_purchasable';
  end if;

  insert into public.payments (user_id, provider, provider_ref, plan_code, amount, currency, status)
  values (p_user, p_provider, p_ref, p_plan, p_amount, p_currency, 'succeeded')
  on conflict (provider, provider_ref) do nothing;

  get diagnostics v_inserted = row_count;
  if v_inserted = 0 then
    return false; -- déjà traité
  end if;

  if v_plan.kind = 'subscription' then
    update public.subscriptions
       set status = 'cancelled'
     where user_id = p_user and status = 'active';

    insert into public.subscriptions (user_id, plan_code, status, current_period_end)
    values (p_user, p_plan, 'active', now() + interval '30 days');
  end if;

  perform private.apply_credit_change(p_user, v_plan.credits, v_plan.kind, p_plan, p_provider || ':' || p_ref);
  return true;
end;
$$;

-- ---------------------------------------------------------------------------
-- Droits (Supabase accorde par défaut tous les droits : on retire tout, puis on rouvre le strict nécessaire)
-- ---------------------------------------------------------------------------

revoke all on all tables in schema public from anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;

grant select on public.plans, public.credit_costs to anon, authenticated;
grant select on public.profiles, public.subscriptions, public.payments,
                public.credit_balances, public.credit_ledger to authenticated;
grant update (full_name, locale, country) on public.profiles to authenticated;

grant execute on function public.spend_credits(text, text) to authenticated;
grant execute on function public.grant_plan_payment(text, text, uuid, text, numeric, text) to service_role;

-- ---------------------------------------------------------------------------
-- Rattrapage : comptes créés avant l'application de cette migration
-- (sur une base neuve, auth.users est vide et ce bloc ne fait rien)
-- ---------------------------------------------------------------------------

insert into public.profiles (id, email)
select u.id, u.email from auth.users u
on conflict (id) do nothing;

do $$
declare
  r record;
  v_trial integer;
begin
  select credits into v_trial from public.plans where code = 'trial';
  for r in
    select u.id from auth.users u
    where not exists (select 1 from public.credit_ledger l where l.user_id = u.id and l.kind = 'trial')
  loop
    perform private.apply_credit_change(r.id, v_trial, 'trial', 'trial', 'backfill');
  end loop;
end
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.profiles        enable row level security;
alter table public.plans           enable row level security;
alter table public.credit_costs    enable row level security;
alter table public.subscriptions   enable row level security;
alter table public.payments        enable row level security;
alter table public.credit_balances enable row level security;
alter table public.credit_ledger   enable row level security;

create policy plans_read_all on public.plans
  for select to anon, authenticated using (true);

create policy credit_costs_read_all on public.credit_costs
  for select to anon, authenticated using (true);

create policy profiles_select_own on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

create policy profiles_update_own on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy subscriptions_select_own on public.subscriptions
  for select to authenticated using ((select auth.uid()) = user_id);

create policy payments_select_own on public.payments
  for select to authenticated using ((select auth.uid()) = user_id);

create policy credit_balances_select_own on public.credit_balances
  for select to authenticated using ((select auth.uid()) = user_id);

create policy credit_ledger_select_own on public.credit_ledger
  for select to authenticated using ((select auth.uid()) = user_id);

-- Aucune politique d'écriture pour anon / authenticated sur les tables de crédits,
-- abonnements et paiements : l'écriture passe uniquement par les fonctions ci-dessus.
