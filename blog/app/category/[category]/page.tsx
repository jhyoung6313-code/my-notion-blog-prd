import { getPublishedPosts, getPostsByCategory } from "@/lib/notion";
import PostCard from "@/components/PostCard";
import CategoryTabs from "@/components/CategoryTabs";

// ISR 재검증 주기(초). route segment config 는 정적 리터럴이어야 한다(= REVALIDATE_SECONDS).
export const revalidate = 60;

export default async function CategoryPage({
  params,
}: PageProps<"/category/[category]">) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  // 탭 구성을 위해 전체 글에서 카테고리 목록을 함께 추출한다.
  const [allPosts, posts] = await Promise.all([
    getPublishedPosts(),
    getPostsByCategory(decodedCategory),
  ]);
  const categories = Array.from(
    new Set(allPosts.map((post) => post.category).filter(Boolean))
  ).sort();

  return (
    <div className="flex flex-col gap-6">
      <CategoryTabs categories={categories} active={decodedCategory} />

      <h1 className="text-xl font-semibold">{decodedCategory}</h1>

      {posts.length === 0 ? (
        <p className="text-black/50">이 카테고리에 글이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
