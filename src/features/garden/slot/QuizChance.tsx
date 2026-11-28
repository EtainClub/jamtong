"use client";

import Link from "next/link";
import { useState } from "react";

import { track } from "@/lib/analytics";

import { gardenFeedback } from "../feedback";
import { useStudy } from "@/features/study/store";

import { makeOx, type OxQuiz } from "../memorial/ox";
import { useMemorial } from "../memorial/useMemorial";
import { kstDay } from "../rules";
import { useGarden } from "../store";
import { chancesLeft, normalizeSlots } from "./rules";

/**
 * 퀴즈 찬스 — 꽝이 나오면 업적 O/X 문항 하나를 맞혀 한 번 더(무료) 돌린다(docs/garden-slots.md).
 * 문항은 잡초 퀴즈와 같은 "내용을 이해했는지" 묻는 문항(content/quizzes/ox.ts). 맞혔든 틀렸든 풀이와 근거가 붙는다.
 * 문항을 여는 순간 찬스를 쓴다 — 닫고 다시 열어 쉬운 문항을 고를 수 없게.
 */
export function QuizChance({ machine, now, say }: { machine: "seed" | "room"; now: number; say: (text: string) => void }) {
  const entries = useMemorial();
  const slots = useGarden((s) => s.data?.slots);
  const left = chancesLeft(normalizeSlots(slots), kstDay(now));
  const [quiz, setQuiz] = useState<OxQuiz | null>(null);
  const [picked, setPicked] = useState<boolean | null>(null);

  if (!quiz) {
    if (left <= 0 || !entries?.length) return null;
    return (
      <button
        type="button"
        className="garden-slot-chance"
        onClick={() => {
          const q = makeOx(entries, Math.random);
          if (!q || !useGarden.getState().takeSlotChance()) return;
          gardenFeedback("tap");
          setQuiz(q);
        }}
      >
        🧠 퀴즈 찬스 — 맞히면 한 번 더 무료 <span className="opacity-75">(오늘 {left}번)</span>
      </button>
    );
  }

  const right = picked !== null && picked === quiz.answer;
  return (
    <div className="garden-slot-quiz" role="group" aria-label="퀴즈 찬스">
      <p className="text-[11.5px] font-bold opacity-75">🧠 퀴즈 찬스 · 「{quiz.title}」</p>
      <p className="mt-1 text-[14px] font-bold leading-snug">{quiz.statement}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {[true, false].map((yes) => (
          <button
            key={String(yes)}
            type="button"
            disabled={picked !== null}
            aria-label={yes ? "맞다(O)" : "아니다(X)"}
            className={`garden-slot-ox ${picked === yes ? (right ? "is-right" : "is-wrong") : ""}`}
            onClick={() => {
              setPicked(yes);
              const ok = yes === quiz.answer;
              track("slot_chance", { machine, correct: ok, slug: quiz.slug });
              // 잼공과 같은 문항 — 정원에서 푼 것도 잼공 상자·근거노트에 쌓인다.
              useStudy.getState().answer(quiz.item, ok, quiz.answer);
              if (ok) {
                useGarden.getState().winSlotChance(machine);
                gardenFeedback("reward");
                say("🎟 정답! 무료로 한 번 더 당길 수 있어요");
              } else gardenFeedback("tap");
            }}
          >
            {yes ? "⭕" : "❌"}
          </button>
        ))}
      </div>
      {picked !== null && (
        <div className="mt-2 text-[12.5px] leading-relaxed">
          <p className="font-bold">{right ? "🎉 정답 — 🎟 무료 한 번을 받았어요" : `아쉬워요 — 정답은 ${quiz.answer ? "⭕" : "❌"}`}</p>
          <p className="mt-0.5">{quiz.explain}</p>
          <Link href={quiz.href} className="mt-0.5 inline-flex min-h-[36px] items-center font-semibold underline underline-offset-2">
            「{quiz.title}」 근거 보기 →
          </Link>
          <Link href={`/study?unit=${encodeURIComponent(quiz.slug)}`} className="ml-3 inline-flex min-h-[36px] items-center font-semibold underline underline-offset-2">
            📖 잼공에서 공부하기
          </Link>
          <button type="button" className="ml-3 text-[12px] underline underline-offset-2 opacity-75" onClick={() => { setQuiz(null); setPicked(null); }}>
            닫기
          </button>
        </div>
      )}
    </div>
  );
}
