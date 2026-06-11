// Notion 데이터 페칭 레이어.
// 모든 Notion API 호출은 이 모듈을 경유한다(서버 전용). 페이지·컴포넌트에서 직접 호출 금지.

import { Client } from "@notionhq/client";
import type { Post, PostBlock } from "@/types/post";
import {
  NOTION_FIELD,
  STATUS_PUBLISHED,
} from "@/lib/constants";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// 환경 변수가 없으면 클라이언트를 만들지 않는다.
// 키 미설정 상태에서도 빌드가 깨지지 않고 "글 없음"으로 동작하게 하기 위함이다.
const notion =
  NOTION_API_KEY && NOTION_DATABASE_ID
    ? new Client({ auth: NOTION_API_KEY })
    : null;

export function isNotionConfigured(): boolean {
  return notion !== null;
}

// ---- Notion 속성 안전 추출 헬퍼 ----
// Notion 응답 타입은 블록·속성마다 형태가 달라 런타임 형태를 좁혀가며 추출한다.

type AnyRecord = Record<string, unknown>;

function getProp(properties: AnyRecord, field: string): AnyRecord | undefined {
  const prop = properties[field];
  return prop && typeof prop === "object" ? (prop as AnyRecord) : undefined;
}

function readPlainText(richTextArray: unknown): string {
  if (!Array.isArray(richTextArray)) return "";
  return richTextArray
    .map((node) =>
      node && typeof node === "object" && "plain_text" in node
        ? String((node as AnyRecord).plain_text ?? "")
        : ""
    )
    .join("");
}

function readTitle(properties: AnyRecord, field: string): string {
  const prop = getProp(properties, field);
  return prop ? readPlainText(prop.title) : "";
}

function readRichText(properties: AnyRecord, field: string): string {
  const prop = getProp(properties, field);
  return prop ? readPlainText(prop.rich_text) : "";
}

function readSelect(properties: AnyRecord, field: string): string {
  const prop = getProp(properties, field);
  const select = prop?.select;
  if (select && typeof select === "object" && "name" in select) {
    return String((select as AnyRecord).name ?? "");
  }
  return "";
}

function readMultiSelect(properties: AnyRecord, field: string): string[] {
  const prop = getProp(properties, field);
  const multi = prop?.multi_select;
  if (!Array.isArray(multi)) return [];
  return multi
    .map((item) =>
      item && typeof item === "object" && "name" in item
        ? String((item as AnyRecord).name ?? "")
        : ""
    )
    .filter(Boolean);
}

function readDate(properties: AnyRecord, field: string): string {
  const prop = getProp(properties, field);
  const date = prop?.date;
  if (date && typeof date === "object" && "start" in date) {
    return String((date as AnyRecord).start ?? "");
  }
  return "";
}

function readCover(properties: AnyRecord, field: string): string | null {
  const prop = getProp(properties, field);
  if (!prop) return null;
  // files 타입과 url 타입 모두 대응
  if (Array.isArray(prop.files) && prop.files.length > 0) {
    const file = prop.files[0] as AnyRecord;
    const external = file.external as AnyRecord | undefined;
    const hosted = file.file as AnyRecord | undefined;
    return String(external?.url ?? hosted?.url ?? "") || null;
  }
  if (typeof prop.url === "string") return prop.url || null;
  return null;
}

// slug 가 비어 있으면 제목에서 자동 생성한다.
function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Notion 페이지 1건 → Post 타입으로 매핑
function mapPageToPost(page: AnyRecord): Post {
  const properties = (page.properties as AnyRecord) ?? {};
  const title = readTitle(properties, NOTION_FIELD.TITLE);
  const rawSlug = readRichText(properties, NOTION_FIELD.SLUG);
  return {
    id: String(page.id ?? ""),
    title,
    slug: rawSlug ? slugify(rawSlug) : slugify(title),
    category: readSelect(properties, NOTION_FIELD.CATEGORY),
    tags: readMultiSelect(properties, NOTION_FIELD.TAGS),
    summary: readRichText(properties, NOTION_FIELD.SUMMARY),
    cover: readCover(properties, NOTION_FIELD.COVER),
    publishedAt: readDate(properties, NOTION_FIELD.PUBLISHED),
  };
}

// ---- 공개 조회 함수 ----

// 발행된 글 전체를 발행일 내림차순으로 가져온다.
export async function getPublishedPosts(): Promise<Post[]> {
  if (!notion || !NOTION_DATABASE_ID) return [];
  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        property: NOTION_FIELD.STATUS,
        select: { equals: STATUS_PUBLISHED },
      },
      sorts: [{ property: NOTION_FIELD.PUBLISHED, direction: "descending" }],
    });
    return (response.results as AnyRecord[]).map(mapPageToPost);
  } catch (error) {
    console.error("[notion] getPublishedPosts 실패:", error);
    return [];
  }
}

// slug 로 발행된 글 1건을 찾는다. 없으면 null.
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPublishedPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

// 특정 카테고리의 발행 글만 반환한다.
export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts.filter((post) => post.category === category);
}

// 글 본문 블록을 가져온다(자식 블록 1단계).
export async function getPostContent(pageId: string): Promise<PostBlock[]> {
  if (!notion) return [];
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });
    return (response.results as AnyRecord[]).map((block) => ({
      id: String(block.id ?? ""),
      type: String(block.type ?? ""),
      data: block,
    }));
  } catch (error) {
    console.error("[notion] getPostContent 실패:", error);
    return [];
  }
}
