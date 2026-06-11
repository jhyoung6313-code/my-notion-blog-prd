import Link from "next/link";
import { SITE } from "@/lib/constants";

// 모든 페이지 상단 공통 헤더. 사이트 타이틀이 홈으로 이동하는 링크.
export default function Header() {
  return (
    <header className="border-b border-black/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          {SITE.NAME}
        </Link>
        <nav className="text-sm text-black/60">
          <Link href="/" className="hover:text-black">
            홈
          </Link>
        </nav>
      </div>
    </header>
  );
}
