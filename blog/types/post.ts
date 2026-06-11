// 블로그 도메인 공통 타입. 모든 페이지·컴포넌트가 이 타입을 재사용한다.

// 글 목록 카드에 필요한 메타데이터 (본문 블록은 별도 조회)
export interface Post {
  id: string; // Notion 페이지 ID
  title: string;
  slug: string;
  category: string;
  tags: string[];
  summary: string;
  cover: string | null;
  publishedAt: string; // ISO 날짜 문자열
}

// Notion 본문 블록을 렌더링에 필요한 최소 형태로 정규화한 타입
export interface PostBlock {
  id: string;
  type: string;
  // Notion 원본 블록의 해당 type 페이로드를 그대로 보관한다.
  // 블록 타입별 구조가 제각각이라 렌더러에서 분기 처리한다.
  data: Record<string, unknown>;
}
