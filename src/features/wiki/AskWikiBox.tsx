/**
 * 질의 자리 — 아직 연결하지 않았다.
 *
 * 설계(docs/llm-wiki.md §8)는 위키 파이프라인이 모델 API를 부르지 않는다고
 * 정했다. ingest·query·lint의 판단은 저장소를 연 구독제 에이전트가 직접
 * 한다. 그래서 이 상자는 지금 입력을 받지 않는다 — 자리를 먼저 잡아 두고,
 * 붙일지 말지는 이 화면이 실제로 읽히는지를 보고 정한다.
 *
 * 비워 두는 대신 지금 답이 어디 있는지를 가리킨다. 물어서 나온 답은
 * `wiki/synthesis/`에 파일링되므로, 사용자가 볼 것이 이미 있다.
 */
export function AskWikiBox() {
  return (
    <section
      aria-labelledby="ask"
      className="mt-6 rounded-card border border-dashed border-stone bg-taupe/40 px-4 py-4"
    >
      <h2 id="ask" className="text-[13px] font-bold text-ink">
        위키에 묻기
      </h2>

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          disabled
          aria-describedby="ask-note"
          placeholder="예: 이재명 대통령은 무엇을 이루려 하는가?"
          className="min-w-0 flex-1 rounded-full border border-stone bg-canvas px-4 py-2 text-[13px] text-smoke placeholder:text-ash disabled:cursor-not-allowed"
        />
        <button
          type="button"
          disabled
          className="shrink-0 rounded-full border border-stone bg-canvas px-4 py-2 text-[13px] font-medium text-ash disabled:cursor-not-allowed"
        >
          준비 중
        </button>
      </div>

      <p id="ask-note" className="mt-3 text-[12px] leading-relaxed text-smoke">
        아직 연결되지 않았습니다. 이 위키는 사람이 던진 물음에 <strong>저장소를 연
        에이전트</strong>가 답하고, 그 답을 아래 「종합」에 파일링하는 방식으로
        쌓입니다. 채팅에 묻히면 탐색이 누적되지 않기 때문입니다.
      </p>
    </section>
  );
}
