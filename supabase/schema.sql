-- yeolyi.com Supabase 인스턴스에 1회 실행.
-- Settings → API → Exposed schemas 에 'redblue' 추가 필수.

create schema if not exists redblue;

create table if not exists redblue.votes (
  user_id uuid primary key references auth.users on delete cascade,
  choice text not null check (choice in ('red', 'blue')),
  created_at timestamptz not null default now()
);

alter table redblue.votes enable row level security;

-- 본인 row만 SELECT
drop policy if exists "own_row_read" on redblue.votes;
create policy "own_row_read" on redblue.votes
  for select to authenticated
  using (auth.uid() = user_id);

-- 본인 row INSERT (PRIMARY KEY 제약으로 1회만 가능)
drop policy if exists "own_row_insert_once" on redblue.votes;
create policy "own_row_insert_once" on redblue.votes
  for insert to authenticated
  with check (auth.uid() = user_id);

-- UPDATE/DELETE 정책 없음 → RLS로 차단됨 (변경 불가)

-- 참여자 수 (익명 공개)
create or replace function redblue.count_votes()
returns int
language sql
security definer
set search_path = ''
stable
as $$
  select count(*)::int from redblue.votes;
$$;

grant usage on schema redblue to authenticated, anon;
grant select, insert on redblue.votes to authenticated;
grant execute on function redblue.count_votes to authenticated, anon;
