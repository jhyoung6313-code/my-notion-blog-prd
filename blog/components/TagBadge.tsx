// 태그 한 개를 표시하는 작은 배지. 목록·상세 페이지에서 공용.
export default function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="inline-block rounded-full bg-black/5 px-2 py-0.5 text-xs text-black/60">
      #{tag}
    </span>
  );
}
