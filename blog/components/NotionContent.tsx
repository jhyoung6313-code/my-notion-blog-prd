import type { PostBlock } from "@/types/post";
import type { ReactNode } from "react";

type AnyRecord = Record<string, unknown>;

// Notion rich_text 배열을 JSX 로 변환한다. 코드/굵게 정도의 기본 서식만 처리한다.
function renderRichText(richText: unknown): ReactNode {
  if (!Array.isArray(richText)) return null;
  return richText.map((node, index) => {
    const item = (node ?? {}) as AnyRecord;
    const text = String(item.plain_text ?? "");
    const annotations = (item.annotations as AnyRecord) ?? {};
    const href = item.href ? String(item.href) : null;

    let element: ReactNode = text;
    if (annotations.code) {
      element = (
        <code className="rounded bg-black/5 px-1 py-0.5 text-sm">{text}</code>
      );
    } else if (annotations.bold) {
      element = <strong>{text}</strong>;
    } else if (annotations.italic) {
      element = <em>{text}</em>;
    }

    if (href) {
      return (
        <a
          key={index}
          href={href}
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {element}
        </a>
      );
    }
    return <span key={index}>{element}</span>;
  });
}

// 블록 하나를 렌더링한다. 블록 타입별로 분기한다.
function renderBlock(block: PostBlock): ReactNode {
  const { type, data, id } = block;
  const payload = (data[type] as AnyRecord) ?? {};
  const richText = payload.rich_text;

  switch (type) {
    case "paragraph":
      return (
        <p key={id} className="my-3 leading-7 text-black/80">
          {renderRichText(richText)}
        </p>
      );
    case "heading_1":
      return (
        <h2 key={id} className="mt-8 mb-3 text-2xl font-bold">
          {renderRichText(richText)}
        </h2>
      );
    case "heading_2":
      return (
        <h3 key={id} className="mt-6 mb-2 text-xl font-bold">
          {renderRichText(richText)}
        </h3>
      );
    case "heading_3":
      return (
        <h4 key={id} className="mt-5 mb-2 text-lg font-semibold">
          {renderRichText(richText)}
        </h4>
      );
    case "bulleted_list_item":
      return (
        <li key={id} className="my-1 ml-6 list-disc text-black/80">
          {renderRichText(richText)}
        </li>
      );
    case "numbered_list_item":
      return (
        <li key={id} className="my-1 ml-6 list-decimal text-black/80">
          {renderRichText(richText)}
        </li>
      );
    case "quote":
      return (
        <blockquote
          key={id}
          className="my-4 border-l-4 border-black/20 pl-4 text-black/70 italic"
        >
          {renderRichText(richText)}
        </blockquote>
      );
    case "code":
      return (
        <pre
          key={id}
          className="my-4 overflow-x-auto rounded-lg bg-black/90 p-4 text-sm text-white"
        >
          <code>{renderRichText(richText)}</code>
        </pre>
      );
    case "divider":
      return <hr key={id} className="my-6 border-black/10" />;
    case "image": {
      const image = payload as AnyRecord;
      const external = image.external as AnyRecord | undefined;
      const file = image.file as AnyRecord | undefined;
      const url = String(external?.url ?? file?.url ?? "");
      const caption = readPlainText(image.caption);
      if (!url) return null;
      return (
        <figure key={id} className="my-5">
          {/* 이미지 최적화(next/image)는 ROADMAP P5 에서 수행한다. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={caption || "본문 이미지"} className="rounded-lg" />
          {caption && (
            <figcaption className="mt-2 text-center text-sm text-black/50">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }
    default:
      // 미지원 블록은 조용히 건너뛴다(본문이 깨지지 않도록).
      return null;
  }
}

function readPlainText(richText: unknown): string {
  if (!Array.isArray(richText)) return "";
  return richText
    .map((node) =>
      node && typeof node === "object" && "plain_text" in node
        ? String((node as AnyRecord).plain_text ?? "")
        : ""
    )
    .join("");
}

// 글 본문 전체를 렌더링한다.
export default function NotionContent({ blocks }: { blocks: PostBlock[] }) {
  if (blocks.length === 0) {
    return <p className="text-black/50">본문 내용이 없습니다.</p>;
  }
  return <div className="prose-custom">{blocks.map(renderBlock)}</div>;
}
