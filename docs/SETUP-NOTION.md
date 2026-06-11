# Notion 연동 & Vercel 배포 가이드

이 문서는 `blog/` MVP를 **실제로 동작**시키기 위해 사람이 직접 해야 하는 두 가지를 안내한다.
1. Notion Integration·데이터베이스 만들기 → 키 발급
2. GitHub 연동으로 Vercel 자동 배포

---

## 1. Notion 데이터베이스 만들기

### 1-1. Integration 생성 (키 발급)
1. https://www.notion.so/my-integrations 접속 → **New integration**
2. 이름(예: `dev-blog`) 입력, 워크스페이스 선택 → 생성
3. **Internal Integration Secret** 복사 → 이게 `NOTION_API_KEY` (보통 `ntn_...` 또는 `secret_...`)

### 1-2. 블로그 데이터베이스 생성
새 Notion 페이지에서 `/database - full page` 로 데이터베이스를 만들고,
아래 속성(필드)을 **이름·타입 그대로** 만든다. (대소문자·철자 정확히 일치해야 한다)

| 속성 이름 | 타입 | 필수 | 비고 |
|-----------|------|------|------|
| `Title` | 제목(Title) | ✅ | DB 생성 시 기본 존재 |
| `Slug` | 텍스트(Text) | ⬜ | 비우면 제목에서 자동 생성 |
| `Category` | 선택(Select) | ✅ | 예: Frontend / Backend / 회고 |
| `Tags` | 다중 선택(Multi-select) | ⬜ | 예: React, TypeScript |
| `Summary` | 텍스트(Text) | ⬜ | 카드에 보일 한 줄 요약 |
| `Cover` | URL 또는 파일(Files & media) | ⬜ | 썸네일 이미지 |
| `Published` | 날짜(Date) | ✅ | 정렬 기준 |
| `Status` | 선택(Select) | ✅ | 옵션에 **`발행됨`** 을 반드시 추가 |

> ⚠️ **중요**: `Status` 의 옵션 값으로 정확히 **`발행됨`** 을 만들어야 한다.
> 이 값인 글만 사이트에 노출된다. (`lib/constants.ts` 의 `STATUS_PUBLISHED` 와 일치)

### 1-3. Integration 에 DB 접근 권한 주기
1. 만든 데이터베이스 페이지 우측 상단 **⋯ → Connections(연결) → Integration 검색·추가**
2. 1-1 에서 만든 Integration 을 선택

### 1-4. Database ID 복사
데이터베이스를 브라우저로 열면 URL 이 이렇다:
```
https://www.notion.so/<워크스페이스>/<DATABASE_ID>?v=<VIEW_ID>
```
`?v=` 앞의 **32자리 16진수**가 `NOTION_DATABASE_ID`.

### 1-5. 글 한 편 작성해 보기
DB 에 행을 추가하고 Title·Category·Published 를 채운 뒤 **Status 를 `발행됨`** 으로 설정한다.
행을 열어 본문(텍스트/코드/이미지)을 Notion 에디터로 작성한다.

---

## 2. 로컬에서 확인하기

```powershell
# blog/.env.local 생성 (.env.example 복사 후 실제 값 입력)
copy blog\.env.example blog\.env.local
# 편집기로 blog/.env.local 열어 NOTION_API_KEY, NOTION_DATABASE_ID 입력

npm run dev --prefix blog
# http://localhost:3000 접속 → 발행한 글이 카드로 보이면 성공
```

> `.env.local` 은 `.gitignore` 에 포함되어 **절대 커밋되지 않는다.** 키는 여기에만 둔다.

---

## 3. Vercel 배포 (GitHub 연동 자동배포)

1. https://vercel.com 로그인 → **Add New… → Project**
2. GitHub 저장소 `my-notion-blog-prd` 를 **Import**
3. **Root Directory** 를 반드시 **`blog`** 로 지정 (모노레포 구조이므로)
   - Framework Preset: Next.js (자동 인식)
4. **Environment Variables** 에 아래 두 개 등록:
   - `NOTION_API_KEY` = (발급한 Integration Secret)
   - `NOTION_DATABASE_ID` = (DB ID)
5. **Deploy** 클릭 → 빌드 완료 후 `https://<프로젝트>.vercel.app` URL 발급

이후 `main` 브랜치에 푸시할 때마다 Vercel 이 자동 재배포한다.

### 배포 후 확인
- 발급된 URL 접속 → 글 목록 표시
- Notion 에서 글 수정 → 최대 1분(ISR) 내 사이트 반영

---

## 트러블슈팅

| 증상 | 원인·해결 |
|------|-----------|
| 홈에 "Notion 환경 변수가 설정되지 않았습니다" | `.env.local`(로컬) 또는 Vercel 환경변수(배포) 미설정 |
| 글이 하나도 안 보임 | `Status` 값이 정확히 `발행됨` 인지, Integration 이 DB 에 연결됐는지 확인 |
| 빌드는 되는데 데이터가 비어 있음 | `NOTION_DATABASE_ID` 가 정확한지, 필드 이름이 표와 일치하는지 확인 |
| 이미지가 안 보임 | `Cover` 가 URL/파일로 채워졌는지 확인 (이미지 최적화는 ROADMAP P5 단계) |
