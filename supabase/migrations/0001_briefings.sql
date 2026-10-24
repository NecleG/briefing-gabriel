create extension if not exists pgcrypto;

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create table public.briefings (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  company_name text not null check (char_length(company_name) between 1 and 200),
  segment text not null check (char_length(segment) between 1 and 100),
  answers jsonb not null check (pg_column_size(answers) < 60000),
  status text not null default 'novo'
    check (status in ('novo','em_analise','aguardando_cliente','concluido','arquivado')),
  admin_notes text check (char_length(admin_notes) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index briefings_created_idx on public.briefings (created_at desc);
create index briefings_status_idx on public.briefings (status);
create index briefings_company_idx on public.briefings (lower(company_name));

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger briefings_touch before update on public.briefings
  for each row execute function public.touch_updated_at();

alter table public.briefings enable row level security;

-- Visitantes: SOMENTE inserir, e só como "novo", sem notas internas.
create policy "publico_insere" on public.briefings for insert to anon
  with check (status = 'novo' and admin_notes is null);

-- Administrador autorizado: leitura, edição e exclusão.
create policy "admin_le" on public.briefings for select to authenticated using (public.is_admin());
create policy "admin_edita" on public.briefings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admin_exclui" on public.briefings for delete to authenticated using (public.is_admin());

revoke all on public.briefings from anon, authenticated;
grant insert on public.briefings to anon;
grant select, update, delete on public.briefings to authenticated;
revoke all on public.admins from anon, authenticated;
-- Primeiro admin (rode no SQL Editor após criar o usuário em Auth > Users):
-- insert into public.admins (user_id) select id from auth.users where email = 'SEU_EMAIL';
