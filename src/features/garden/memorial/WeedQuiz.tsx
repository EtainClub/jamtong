"use client";

import Link from "next/link";
import { useState } from "react";

import { track } from "@/lib/analytics";

import { gardenFeedback } from "../feedback";
import { FurnitureIcon } from "../room/RoomArt";
import type { Furniture } from "../room/catalog";
import { josa, WEED_QUIZ_ODDS, WEED_QUIZ_PER_DAY } from "../rules";
import { Sheet } from "../Sheet";
import { useGarden } from "../store";
import { useStudy } from "@/features/study/store";

import { giftPool, type OxQuiz } from "./ox";

/**
 * 잡초 O/X 퀴즈 — 광장 잡초를 뽑고 나면 가끔 뜬다. 맞히면 상점 가구 하나를 선물로 받는다(memorial/ox.ts).
 * 답하지 않고 닫아도 오늘 몫 하나를 쓴 것으로 센다(같은 퀴즈를 다시 띄워 고르지 못하게).
 */
export function WeedQuiz({ quiz, onClose, say }: { quiz: OxQuiz; onClose: () => void; say: (text: string) => void }) {
  const [picked, setPicked] = useState<boolean | null>(null);
  const [gift, setGift] = useState<Furniture | null>(null);
  const right = picked !== null && picked === quiz.answer;

  const answer = (yes: boolean) => {
    if (picked !== null) return;
    setPicked(yes);
    const ok = yes === quiz.answer;
    track("weed_quiz", { slug: quiz.slug, answer: ok });
    // 잼공과 같은 문항 — 정원에서 푼 것도 잼공 상자·근거노트에 쌓인다.
    useStudy.getState().answer(quiz.item, ok, quiz.answer);
    const got = useGarden.getState().settleWeedQuiz(ok);
    if (ok && got) {
      setGift(got);
      gardenFeedback("reward");
      say(`🎁 퀴즈 정답! ${josa(got.label, "을를")} 받았어요 · 꾸미기 보관함에 있어요`);
    } else gardenFeedback("tap");
  };

  const close = () => {
    if (picked === null) useGarden.getState().settleWeedQuiz(false);
    onClose();
  };

  return (
    <Sheet label="잡초 O/X 퀴즈" title="🌿 잡초 밑에서 퀴즈가 나왔어요!" onClose={close}>
      <div className="mt-3 space-y-3">
        <p className="text-[12px] text-smoke">맞히면 상점 가구 하나를 선물로 받아요.</p>
        <p className="rounded-2xl bg-[var(--g-panel)] px-4 py-3 text-[15px] font-bold leading-snug">{quiz.statement}</p>
        <div className="grid grid-cols-2 gap-2">
          {[true, false].map((yes) => (
            <button
              key={String(yes)}
              type="button"
              disabled={picked !== null}
              onClick={() => answer(yes)}
              aria-label={yes ? "맞다(O)" : "아니다(X)"}
              className={`min-h-[64px] rounded-2xl border-2 text-[30px] font-black ${
                picked === yes ? (right ? "border-[var(--g-leaf)] bg-white" : "border-stone bg-white opacity-80") : "border-stone bg-white"
              }`}
            >
              {yes ? "⭕" : "❌"}
            </button>
          ))}
        </div>
        {picked !== null && (
          <div className="rounded-2xl bg-[var(--g-panel)] px-4 py-3 text-[13px] leading-relaxed">
            <p className="font-bold">{right ? "🎉 정답이에요!" : `아쉬워요 — 정답은 ${quiz.answer ? "⭕" : "❌"}예요.`}</p>
            <p className="mt-1">{quiz.explain}</p>
            <Link href={quiz.href} className="mt-1 inline-flex min-h-[44px] items-center font-semibold underline underline-offset-2">
              「{quiz.title}」 근거 보기 →
            </Link>
            <Link href={`/study?unit=${encodeURIComponent(quiz.slug)}`} className="ml-3 inline-flex min-h-[44px] items-center font-semibold underline underline-offset-2">
              📖 잼공에서 이 단원 공부하기
            </Link>
            {gift && (
              <p className="mt-1 flex items-center gap-2 rounded-xl bg-white px-3 py-2">
                <FurnitureIcon id={gift.id} size={40} />
                <span>
                  <b>{gift.label}</b>{josa(gift.label, "을를").slice(gift.label.length)} 받았어요. 방 꾸미기 보관함에서 놓을 수 있어요.
                </span>
              </p>
            )}
            {right && !gift && <p className="mt-1 text-smoke">받을 수 있는 가구를 다 가지고 있어서 이번에는 선물이 없어요.</p>}
          </div>
        )}
        <p className="text-[11px] leading-relaxed text-smoke">
          잡초를 뽑으면 {Math.round(WEED_QUIZ_ODDS * 100)}% 확률로 퀴즈가 나와요(하루 {WEED_QUIZ_PER_DAY}번까지, 잼을 받는 잡초에서만). 선물은 상점의 가구·소품·창문{" "}
          {giftPool().length}가지 가운데 하나이고, 모두 같은 확률이에요.
        </p>
        <button type="button" className="garden-diary-btn min-h-[44px] w-full justify-center" onClick={close}>
          {picked === null ? "다음에 풀게요" : "닫기"}
        </button>
      </div>
    </Sheet>
  );
}
