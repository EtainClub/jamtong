import { STORY_LABEL, STORY_SOURCES, type FurnitureStory as Story } from "./stories";

/** 상점과 내 방·손님 방에서 같은 설명과 근거를 보여 준다. */
export function FurnitureStory({ story }: { story: Story }) {
  const source = STORY_SOURCES[story.source];
  return (
    <section aria-label="이재명 대통령의 실제 이야기" className="mt-3 rounded-xl border border-[var(--d-line)] bg-[var(--g-panel)] p-3 text-[13px] leading-relaxed">
      <h4 className="font-bold">이재명 대통령의 실제 이야기</h4>
      <p className="mt-1 text-[12px] font-semibold text-[var(--d-sky-ink)]">{STORY_LABEL[story.kind]}</p>
      <p className="mt-1.5">{story.text}</p>
      {story.excerpt && (
        <figure className="mt-3 rounded-lg border border-dashed border-[var(--d-line)] bg-[var(--g-panel)] p-3">
          <figcaption className="text-[11.5px] text-smoke">옛 블로그에 게시된 글귀 · 보도에서 발췌</figcaption>
          <blockquote className="mt-2 whitespace-pre-line font-semibold">“{story.excerpt}”</blockquote>
        </figure>
      )}
      <p className="mt-2 text-[11.5px] text-smoke">기록에서 착안해 잼통이 그린 소품이에요.</p>
      <a href={source.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block min-h-[44px] py-2.5 text-[12px] font-semibold underline underline-offset-2">
        {source.title} · {source.date} ↗
      </a>
    </section>
  );
}
