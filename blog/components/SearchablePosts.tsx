"use client";

import { useState } from "react";
import type { Post } from "@/types/post";
import PostCard from "@/components/PostCard";

// 홈 글 목록에 검색 기능을 더한 최소 버전.
// 서버에서 받은 글 목록을 클라이언트에서 제목·요약 부분 일치로 필터링한다.
export default function SearchablePosts({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");

  const keyword = query.trim().toLowerCase();
  const filtered = keyword
    ? posts.filter((post) => {
        const haystack = `${post.title} ${post.summary}`.toLowerCase();
        return haystack.includes(keyword);
      })
    : posts;

  return (
    <div className="flex flex-col gap-6">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="제목·요약으로 검색"
        className="w-full rounded-lg border border-black/15 px-4 py-2 text-sm outline-none focus:border-black/40"
      />

      {filtered.length === 0 ? (
        <p className="text-black/50">
          {keyword
            ? `"${query}" 에 대한 검색 결과가 없습니다.`
            : "아직 발행된 글이 없습니다."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
