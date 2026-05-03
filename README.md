# redblue

빨강 vs 파랑 투표 페이지. 결과 공개: **2026-05-18**.

## Stack

- Astro 6 (server output) + React island
- Tailwind v4
- Supabase Auth (Kakao / Google / Apple / GitHub) — `yeolyi.com` 인스턴스 공유
- Vercel 배포 + `vote.yeolyi.com`

## Setup

### 1. yeolyi.com Supabase 사전 설정

**Authentication → Providers** 에서 활성화:
- Kakao, Google, Apple, GitHub
- Redirect URL: `https://vote.yeolyi.com/api/auth/callback` (로컬은 `http://localhost:4321/api/auth/callback`)

**Settings → API → Exposed schemas**: `public, redblue` 추가.

**SQL Editor** 에서 `supabase/schema.sql` 실행.

### 2. 로컬

```bash
cp .env.example .env
# .env 채우기:
# PUBLIC_SUPABASE_URL=https://<yeolyi-project>.supabase.co
# PUBLIC_SUPABASE_ANON_KEY=<anon key>
# PUBLIC_SITE_URL=http://localhost:4321

npm run dev
```

### 3. Vercel 배포

1. Vercel에 import
2. 환경변수 3개 (위와 동일, `PUBLIC_SITE_URL=https://vote.yeolyi.com`)
3. `vote.yeolyi.com` 도메인 연결
4. 모든 OAuth provider Redirect URL을 production URL로 추가

## Schema (`redblue`)

- `votes(user_id pk, choice 'red'|'blue', created_at)` — RLS로 본인 row만 SELECT/INSERT, UPDATE/DELETE 불가
- `count_votes()` — security definer, 익명 공개

## 출처

- 영감: [@MrBeast](https://x.com/MrBeast/status/1916501096811450585)
- 비상업 토이 프로젝트
