# 개인 개발 블로그 (Notion CMS)

Notion을 CMS로 활용해, 글을 Notion에서 작성하면 자동으로 웹사이트에 발행되는 개인 기술 블로그.

## Project Context

작업 시 아래 문서를 항상 참고하여 일관성 있게 개발한다.

- PRD 문서 (무엇을 만들 것인가): @docs/PRD.md
- 개발 로드맵 (어떤 순서로 만들 것인가): @docs/ROADMAP.md

## 개발 원칙

- **개발 순서**: 골격 → 공통 → 개별 기능 순서를 따른다. ([ROADMAP.md](docs/ROADMAP.md) 참고)
  - 개별 기능부터 만들지 않는다. 공통 모듈(`lib/notion.ts`, 공통 컴포넌트)을 먼저 세운다.
- **데이터 접근**: 모든 Notion API 호출은 `lib/notion.ts`를 거친다. 페이지에서 직접 호출하지 않는다.
- **보안**: `NOTION_API_KEY` 등 비밀 키는 `.env.local`에만 두고 절대 커밋하지 않는다. 서버 컴포넌트에서만 호출한다.

## 기술 스택

- Next.js 15 (App Router) + TypeScript
- Notion API (`@notionhq/client`)
- Tailwind CSS + shadcn/ui + Lucide React
- 배포: Vercel (ISR)
