"use client";

import { useEffect, useMemo, useState } from "react";

import { track } from "@/lib/analytics";

import { gardenFeedback } from "../feedback";
import { hash, josa } from "../rules";
import { Sheet } from "../Sheet";
import { useGarden } from "../store";
import type { Species } from "../types";
import { itemName } from "../room/RoomArt";
import { PhotoCard } from "./PhotoCard";
import type { MemorialEntry } from "./types";

/**
 * 기념품 받기 — 업적을 알아보고(사진 카드) 문제 하나를 맞히면 기념품이 방에 들어온다(docs/garden-achievement-strategy.md §3).
 *
 * ★ 잼으로 사지 않는다. 알아봐서 받는다.
 * ★ 틀리면 "틀렸어요" 대신 그 숫자가 어느 업적의 것인지 사실대로 말한다. 오답 보기도 다른 업적의 실제 숫자다.
 *   그리고 보기 순서를 바꿔 다시 풀게 한다.
 */
export function QuizSheet({
  entry,
  earned,
  byId,
  onClose,
  say,
}: {
  entry: MemorialEntry;
  earned: boolean;
  byId: Map<string, Species>;
  onClose: () => void;
  say: (text: string) => void;
}) {
  const [step, setStep] = useState<"learn" | "quiz" | "done">(earned ? "done" : "learn");
  // 받은 기념품이 간 곳 — 진열장 안이거나, 방이 꽉 차 진열장째 보관함에. 이미 받았던 것을 다시 열면 null.
  const [where, setWhere] = useState<"case" | "stowed" | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  useEffect(() => {
    track("souvenir_view", { slug: entry.slug });
  }, [entry.slug]);
  // 다시 풀 때마다 보기 순서를 바꾼다(같은 자리를 외워 누르지 않게).
  const options = useMemo(
    () => [...entry.quiz.options].sort((a, b) => hash(`${attempt}:${a.text}`) - hash(`${attempt}:${b.text}`)),
    [entry.quiz.options, attempt],
  );
  const choice = picked === null ? null : options[picked];

  const answer = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const right = options[i].answer;
    track("souvenir_quiz", { slug: entry.slug, answer: right });
    if (!right) {
      gardenFeedback("tap");
      return;
    }
    const got = useGarden.getState().earnSouvenir(entry.speciesId, byId);
    if (got === false) {
      say("기념품을 놓을 수 없었어요. 잠시 뒤 다시 해 보세요");
      return;
    }
    gardenFeedback("reward");
    track("souvenir_get", { slug: entry.slug });
    const moved = got.moved ? itemName(got.moved, useGarden.getState().data!.room, byId) : null;
    say(
      `${entry.icon} 「${entry.title}」 기념품을 받았어요 · ` +
        (got.where === "stowed" ? "진열장이 보관함에 있어요" : moved ? `진열장을 놓느라 「${moved}」${josa(moved, "을를").slice(moved.length)} 보관함에 넣었어요` : "방의 기념품 진열장에 넣었어요"),
    );
    setWhere(got.where);
    setStep("done");
  };

  return (
    <Sheet label={`${entry.title} 기념품`} title={`${entry.icon} ${entry.title}`} onClose={onClose}>
      <div className="mt-3 space-y-3">
        {step === "learn" && (
          <>
            <PhotoCard entry={entry} from="memorial" />
            <button type="button" className="garden-diary-btn min-h-[44px] w-full justify-center" onClick={() => { gardenFeedback("tap"); setStep("quiz"); }}>
              🧩 다 읽었어요 — 문제 풀고 기념품 받기
            </button>
          </>
        )}

        {step === "quiz" && (
          <div>
            <p className="text-[14px] font-bold leading-snug">{entry.quiz.question}</p>
            <ol className="mt-2 space-y-1.5">
              {options.map((o, i) => (
                <li key={`${attempt}:${o.text}`}>
                  <button
                    type="button"
                    disabled={picked !== null}
                    onClick={() => answer(i)}
                    className={`min-h-[44px] w-full rounded-xl border px-3 py-2 text-left text-[13px] ${
                      picked === i ? (o.answer ? "border-[var(--g-leaf)] bg-[var(--g-panel)] font-bold" : "border-stone bg-[var(--g-panel)]") : "border-stone bg-white"
                    }`}
                  >
                    {o.text}
                  </button>
                </li>
              ))}
            </ol>
            {choice && !choice.answer && (
              <div className="mt-2 rounded-xl bg-[var(--g-panel)] px-3 py-2 text-[12.5px] leading-relaxed">
                <p>
                  이건 「{choice.from}」의 숫자예요. 이 업적의 숫자는 위 카드에 있어요.
                </p>
                <div className="mt-2 flex gap-2">
                  <button type="button" className="garden-diary-btn is-quiet" onClick={() => { gardenFeedback("tap"); setStep("learn"); setPicked(null); setAttempt((n) => n + 1); }}>
                    카드 다시 보기
                  </button>
                  <button type="button" className="garden-diary-btn" onClick={() => { gardenFeedback("tap"); setPicked(null); setAttempt((n) => n + 1); }}>
                    다시 풀기
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === "done" && (
          <>
            <p className="rounded-xl bg-[var(--g-panel)] px-3 py-2 text-[13px] leading-relaxed">
              {where === "stowed" ? (
                <>
                  {entry.icon} 기념품을 받았어요. <b>기념품 진열장이 보관함에 있어요.</b> 방 꾸미기에서 진열장을 놓으면 지금까지 받은 기념품이 모두 그 안에
                  모여요.
                </>
              ) : (
                <>
                  {entry.icon} 기념품을 {where === "case" ? "받아 방의 기념품 진열장에 넣었어요" : "받았어요"}. 진열장(한 칸)에 받은 기념품이 모두 모이고, 누르면 손님도 카드를 볼 수
                  있어요. 꾸미기에서 기념품 하나를 따로 꺼내 놓을 수도 있어요.
                </>
              )}
              <br />
              <span className="text-smoke">정답 — {entry.quiz.explain}</span>
            </p>
            <PhotoCard entry={entry} from="memorial" compact />
          </>
        )}
      </div>
    </Sheet>
  );
}
