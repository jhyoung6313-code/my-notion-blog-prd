// 매직 넘버·매직 스트링을 한곳에 모아 관리한다.
// Notion DB 의 필드명/Status 값과 정확히 일치해야 하므로 변경 시 Notion DB 도 함께 맞춘다.

// ISR 재검증 주기(초). Notion 글 수정 후 최대 이 시간 내에 사이트에 반영된다.
export const REVALIDATE_SECONDS = 60;

// Notion Status(select) 값 — 이 값인 글만 사이트에 노출한다.
export const STATUS_PUBLISHED = "발행됨";

// Notion 데이터베이스 필드명 (PRD 5장 스키마와 일치)
export const NOTION_FIELD = {
  TITLE: "Title",
  SLUG: "Slug",
  CATEGORY: "Category",
  TAGS: "Tags",
  SUMMARY: "Summary",
  COVER: "Cover",
  PUBLISHED: "Published",
  STATUS: "Status",
} as const;

// "전체" 카테고리 탭 식별자 (특정 카테고리로 좁히지 않은 상태)
export const CATEGORY_ALL = "전체";

// 블로그 메타 정보
export const SITE = {
  NAME: "DevBlog",
  DESCRIPTION: "Notion 으로 운영하는 개인 개발 블로그",
} as const;
