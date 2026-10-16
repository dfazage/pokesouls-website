-- Liste d'attente PokéSouls.
-- Principe : la table est fermée (RLS activée, aucune policy, aucun droit pour anon).
-- Le site passe uniquement par deux fonctions SQL : join_waitlist (inscription / mise à jour du trio)
-- et waitlist_count (nombre d'inscrits). Personne ne peut donc lire la liste depuis le navigateur.

create extension if not exists citext with schema extensions;

create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       extensions.citext not null unique,
  lang        text not null default 'fr' check (lang in ('fr', 'en')),
  trio        text[],
  source      text check (source in ('hero', 'trio', 'footer')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint waitlist_email_format check (email::text ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$' and char_length(email::text) <= 254)
);

alter table public.waitlist enable row level security;
revoke all on public.waitlist from anon, authenticated;

create or replace function public.join_waitlist(
  p_email  text,
  p_lang   text default 'fr',
  p_trio   text[] default null,
  p_source text default null
) returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_email text := lower(trim(coalesce(p_email, '')));
  v_trio  text[];
begin
  if char_length(v_email) > 254 or v_email !~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$' then
    raise exception 'invalid_email' using errcode = '22023';
  end if;
  if p_lang not in ('fr', 'en') then p_lang := 'fr'; end if;
  if p_source not in ('hero', 'trio', 'footer') then p_source := null; end if;
  if p_trio is not null then
    select array_agg(k) into v_trio
    from (select distinct k from unnest(p_trio) as k where k ~ '^[a-z]{2,20}$' limit 3) s;
  end if;

  insert into public.waitlist (email, lang, trio, source)
  values (v_email, p_lang, v_trio, p_source)
  on conflict (email) do update
    set trio = coalesce(excluded.trio, public.waitlist.trio),
        lang = excluded.lang,
        updated_at = now();
  return true;  -- même réponse si l'email existait déjà : on ne révèle pas qui est inscrit
end;
$$;

create or replace function public.waitlist_count()
returns bigint
language sql
security definer
set search_path = public
stable
as $$ select count(*) from public.waitlist $$;

revoke all on function public.join_waitlist(text, text, text[], text) from public;
revoke all on function public.waitlist_count() from public;
grant execute on function public.join_waitlist(text, text, text[], text) to anon, authenticated;
grant execute on function public.waitlist_count() to anon, authenticated;
