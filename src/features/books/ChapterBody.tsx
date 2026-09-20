import type { Chapter } from "@/content/books/schema";

/**
 * 요약 원문을 읽을 수 있게 그린다.
 *
 * 자료는 한 문단이 300~500자다. 그대로 쏟아 놓으면 화면에서 글자 벽이 되어
 * 어디까지 읽었는지 놓친다. 그렇다고 문장을 고치거나 순서를 바꾸지는 않는다 —
 * 여기서 하는 일은 **같은 글에 숨 쉴 자리를 내는 것**뿐이다.
 *
 * 두 가지를 한다.
 *   1. 소제목을 살린다. 로더가 `## `로 표시해 둔 줄을 제목으로 세운다.
 *   2. 긴 문단을 문장 경계에서 끊어 덩이로 나눈다. 글자는 하나도 바뀌지
 *      않고, 눈이 쉬는 자리만 생긴다.
 *
 * 인용 검사(쉽게 보기 토막이 본문에 실재하는가)는 데이터의 문자열을 보므로
 * 여기서 무엇을 하든 영향을 받지 않는다.
 */

/** 이 길이를 넘으면 문단을 덩이로 나눈다. 두세 문장이 한 덩이가 되는 크기다. */
const CHUNK = 170;

/** 문장 끝에서 끊는다. "…다. " 뒤가 경계다. */
function chunk(paragraph: string): string[] {
  const sentences = paragraph.split(/(?<=\.)\s+/);
  const out: string[] = [];
  let buffer = "";

  for (const sentence of sentences) {
    const merged = buffer ? `${buffer} ${sentence}` : sentence;
    if (merged.length >= CHUNK) {
      out.push(merged);
      buffer = "";
      continue;
    }
    buffer = merged;
  }

  if (buffer) {
    /* 남은 꼬리가 너무 짧으면 앞 덩이에 붙인다. 한 줄짜리 문단은 어색하다. */
    if (out.length > 0 && buffer.length < 60) out[out.length - 1] += ` ${buffer}`;
    else out.push(buffer);
  }

  return out;
}

export function ChapterBody({ chapter }: { chapter: Chapter }) {
  const blocks = (chapter.body ?? "").split("\n\n");

  return (
    <div className="mt-6">
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) {
          return (
            <h3
              key={index}
              className="mt-9 border-t border-stone pt-6 text-[15px] font-bold leading-snug text-ink first:mt-0 first:border-0 first:pt-0"
            >
              {block.slice(3)}
            </h3>
          );
        }

        return (
          <div key={index} className="mt-5 space-y-3.5">
            {chunk(block).map((part, n) => (
              <p key={n} className="text-[15.5px] leading-[1.95] tracking-[-0.003em] text-graphite">
                {part}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
