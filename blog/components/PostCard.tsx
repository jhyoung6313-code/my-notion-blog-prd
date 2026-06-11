import Link from "next/link";
import type { Post } from "@/types/post";
import TagBadge from "@/components/TagBadge";

// 글 목록·카테고리·태그 페이지에서 공용으로 쓰는 글 카드.
export default function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-black/10 transition hover:shadow-md"
    >
      {post.cover ? (
        // 이미지 최적화(next/image 전환)는 ROADMAP P5 에서 수행한다.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover}
          alt={post.title}
          className="h-44 w-full object-cover"
        />
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-black/5 text-black/30">
          No Image
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {post.category && (
          <span className="text-xs font-medium text-black/50">
            {post.category}
          </span>
        )}
        <h2 className="line-clamp-2 text-lg font-semibold group-hover:underline">
          {post.title}
        </h2>
        {post.summary && (
          <p className="line-clamp-2 text-sm text-black/60">{post.summary}</p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
          {post.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
          {post.publishedAt && (
            <span className="ml-auto text-xs text-black/40">
              {post.publishedAt}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
