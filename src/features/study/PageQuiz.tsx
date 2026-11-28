"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { track } from "@/lib/analytics";

import type { PageQuizItem } from "./build";
import { useStudy } from "./store";

/**
 * 원본 페이지 끝의 확인 문제 한 개 — 다 읽은 사람에게 "방금 읽은 것, 맞는 말일까요?"를 묻는다(docs/daily-study.md §8.4).
 *
 * ★ 페이지 맨 끝, 정정 링크 위에 둔다. 정보 페이지는 공부·게임 레이어가 가리지 않는다(docs/garden-game.md §1).
 * ★ 잼공 문항과 같은 id다. 여기서 푼 것이 잼공의 상자·근거노트에 그대로 쌓인다 — 잼공을 열면 이어서 시작한다.
 * ★ 맞히면 정원 선물: 그 업적의 씨앗(품종마다 한 번)과 방 가구 하나(업적마다 한 번, 상점 가구 가운데 같은 확률).
 *   선물은 정원에서 받는다(/garden?gift=…&quiz=…). 맞힌 횟수나 공유에는 보상을 걸지 않는다.
 * ★ 문제는 처음 그린 뒤에 고른다(서버 렌더와 어긋나지 않게) — 아직 안 푼 문제를 먼저.
 */
export function PageQuiz({
  items,
  where,
  heading = "방금 읽은 내용, 맞는 말일까요?",
  inset = true,
}: {
  items: PageQuizItem[];
  where: "achievement" | "cartel" | "words" | "wiki";
  heading?: string;
  /** 바깥 여백(넓은 페이지용). 이미 여백이 있는 좁은 본문(카르텔·언행·위키)에서는 false. */
  inset?: boolean;
}) {
  const [at, setAt] = useState<number | null>(null);
  const [picked, setPicked] = useState<boolean | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    const store = useStudy.getState();
    if (!store.data) store.boot();
    const boxes = useStudy.getState().data?.boxes ?? {};
    const fresh = items.map((_, i) => i).filter((i) => !boxes[items[i].id]);
    const pool = fresh.length ? fresh : items.map((_, i) => i);
    // 렌더가 아니라 처음 그린 뒤에 한 번 고른다 — 서버 렌더와 어긋나지 않게.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAt(pool[Math.floor(Math.random() * pool.length)]);
  }, [items]);

  if (items.length === 0) return null;
  const item = at === null ? null : items[at];
  const right = item !== null && picked !== null && picked === item.answer;

  const answer = (yes: boolean) => {
    if (!item || picked !== null) return;
    setPicked(yes);
    const ok = yes === item.answer;
    useStudy.getState().answer(item.id, ok, item.card);
    track("page_quiz", { where, slug: item.slug, correct: ok });
  };

  const next = () => {
    if (at === null) return;
    setAt((at + 1) % items.length);
    setPicked(null);
  };

  return (
    <section aria-labelledby="page-quiz" className={inset ? "mx-auto max-w-5xl px-5" : ""}>
      <div className="rounded-card border border-stone bg-taupe/60 px-4 py-4">
        <p className="text-[11px] font-bold tracking-wide text-smoke">🧠 1분 확인 문제 · 맞히면 잼통 정원 선물</p>
        <h2 id="page-quiz" className="mt-1 text-[15px] font-bold text-ink">
          {heading}
        </h2>
        {!item ? (
          <p className="mt-3 min-h-[120px] text-[13px] text-smoke">문제를 고르는 중…</p>
        ) : (
          <>
            {where !== "achievement" && <p className="mt-2 text-[12px] text-smoke">「{item.title}」에서</p>}
            <p className="mt-2 rounded-card bg-canvas px-4 py-3 text-[15px] font-semibold leading-snug text-ink">{item.statement}</p>
            <div className="mt-2 grid grid-cols-2 gap-2" role="group" aria-label="답 고르기">
              {[true, false].map((yes) => (
                <button
                  key={String(yes)}
                  type="button"
                  disabled={picked !== null}
                  aria-label={yes ? "맞다(O)" : "아니다(X)"}
                  aria-pressed={picked === yes}
                  onClick={() => answer(yes)}
                  className={`min-h-[56px] rounded-card border-2 bg-canvas text-[26px] font-black transition-colors ${
                    picked === null ? "border-stone hover:border-graphite" : yes === item.answer ? "border-[#2f8a57]" : picked === yes ? "border-[#c2410c] opacity-70" : "border-stone opacity-50"
                  }`}
                >
                  {yes ? "⭕" : "❌"}
                </button>
              ))}
            </div>

            {picked !== null && (
              <div className="mt-3 space-y-2 text-[13px] leading-relaxed" aria-live="polite">
                <p className="font-bold text-ink">{right ? "🎉 정답이에요!" : `아쉬워요 — 정답은 ${item.answer ? "⭕" : "❌"}예요.`}</p>
                <p className="text-graphite">{item.explain}</p>
                {where !== "achievement" && (
                  <Link href={`/achievement/${item.slug}`} className="inline-flex min-h-[40px] items-center font-semibold underline underline-offset-2">
                    「{item.title}」 근거 읽기 →
                  </Link>
                )}

                {right && (
                  <Link
                    href={`/garden?gift=${encodeURIComponent(`a:${item.slug}`)}&quiz=${encodeURIComponent(item.id)}`}
                    onClick={() => track("page_quiz_prize", { where, slug: item.slug })}
                    className="flex items-center gap-3 rounded-card border border-[#2f8a57]/40 bg-canvas px-4 py-3 transition-colors hover:border-[#2f8a57]"
                  >
                    <span className="text-xl" aria-hidden>
                      🎁
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-ink">정원에서 정답 선물 받기</span>
                      <span className="block text-[12px] text-smoke">
                        「{item.title}」 씨앗과 내 방에 둘 가구 하나. 업적마다 한 번이고, 가구는 상점 가구 가운데 모두 같은 확률이에요.
                      </span>
                    </span>
                    <span aria-hidden>→</span>
                  </Link>
                )}

                <Link
                  href={`/study?unit=${encodeURIComponent(item.slug)}`}
                  onClick={() => track("page_quiz_study", { where, slug: item.slug })}
                  className="flex items-center gap-3 rounded-card border border-stone bg-canvas px-4 py-3 transition-colors hover:border-graphite"
                >
                  <span className="text-xl" aria-hidden>
                    📖
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-ink">잼공에서 이어 풀기</span>
                    <span className="block text-[12px] text-smoke">
                      방금 푼 문제는 잼공에 기록됐어요.{right && item.card ? " 이 문장은 근거노트 카드가 됐어요." : " 틀린 문제는 며칠 뒤 다시 물어봐요."}
                    </span>
                  </span>
                  <span aria-hidden>→</span>
                </Link>

                {items.length > 1 && (
                  <button type="button" onClick={next} className="min-h-[40px] text-[12.5px] font-semibold text-smoke underline underline-offset-2">
                    다른 문제 풀기
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
