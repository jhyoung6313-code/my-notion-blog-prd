import { SITE } from "@/lib/constants";

// 모든 페이지 하단 공통 푸터.
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-black/10">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-black/50">
        © {year} {SITE.NAME}. Powered by Notion.
      </div>
    </footer>
  );
}
