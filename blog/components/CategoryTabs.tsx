import Link from "next/link";
import { CATEGORY_ALL } from "@/lib/constants";

interface CategoryTabsProps {
  categories: string[]; // "전체"를 제외한 실제 카테고리 목록
  active: string; // 현재 활성 카테고리 (없으면 CATEGORY_ALL)
}

// 홈/카테고리 페이지 상단의 카테고리 필터 탭. "전체"는 홈(/)으로 이동.
export default function CategoryTabs({ categories, active }: CategoryTabsProps) {
  const tabs = [CATEGORY_ALL, ...categories];

  return (
    <nav className="flex flex-wrap gap-2">
      {tabs.map((category) => {
        const isActive = category === active;
        const href =
          category === CATEGORY_ALL
            ? "/"
            : `/category/${encodeURIComponent(category)}`;
        return (
          <Link
            key={category}
            href={href}
            className={
              isActive
                ? "rounded-full bg-black px-3 py-1 text-sm text-white"
                : "rounded-full border border-black/15 px-3 py-1 text-sm text-black/70 hover:border-black/40"
            }
          >
            {category}
          </Link>
        );
      })}
    </nav>
  );
}
