import { getPublishedPosts, isNotionConfigured } from "@/lib/notion";
import { CATEGORY_ALL } from "@/lib/constants";
import CategoryTabs from "@/components/CategoryTabs";
import SearchablePosts from "@/components/SearchablePosts";

// ISR 재검증 주기(초). Next.js 제약상 route segment config 는 정적 리터럴이어야 하므로
// 상수(REVALIDATE_SECONDS) 대신 리터럴 60 을 사용한다. (= lib/constants.ts 의 값과 동일)
export const revalidate = 60;

export default async function Home() {
  const posts = await getPublishedPosts();
  const categories = Array.from(
    new Set(posts.map((post) => post.category).filter(Boolean))
  ).sort();

  return (
    <div className="flex flex-col gap-6">
      <CategoryTabs categories={categories} active={CATEGORY_ALL} />

      {!isNotionConfigured() ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          Notion 환경 변수가 설정되지 않았습니다. <code>.env.local</code> 에
          <code> NOTION_API_KEY</code> 와 <code>NOTION_DATABASE_ID</code> 를
          설정하세요.
        </p>
      ) : (
        <SearchablePosts posts={posts} />
      )}
    </div>
  );
}
