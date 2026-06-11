import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getPostBySlug, getPostContent } from "@/lib/notion";
import NotionContent from "@/components/NotionContent";
import TagBadge from "@/components/TagBadge";

// ISR 재검증 주기(초). route segment config 는 정적 리터럴이어야 한다(= REVALIDATE_SECONDS).
export const revalidate = 60;

// 글별 SEO 메타데이터(OG 태그·디스크립션) 생성.
export async function generateMetadata({
  params,
}: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "글을 찾을 수 없습니다" };
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function PostDetailPage({
  params,
}: PageProps<"/posts/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const blocks = await getPostContent(post.id);

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/" className="text-sm text-black/50 hover:text-black">
        ← 목록으로
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight">{post.title}</h1>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-black/50">
        {post.category && <span>{post.category}</span>}
        {post.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
        {post.publishedAt && <span className="ml-auto">{post.publishedAt}</span>}
      </div>

      <hr className="my-6 border-black/10" />

      <NotionContent blocks={blocks} />
    </article>
  );
}
