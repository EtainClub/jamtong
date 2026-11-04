"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { track } from "@/lib/analytics";

import { gardenFeedback } from "./feedback";
import { NoteCard } from "./parts";
import { CASE_BOX_EVERY, CASE_JAM, kstDay, todaysCases } from "./rules";
import { useGarden, type GardenData } from "./store";
import type { Case, Species } from "./types";

/**
 * 탐정 온실 — SNS에서 도는 주장에 답하는 내용을 찾는 선택 구역. 설계는 docs/garden-game.md §4.
 *
 * ★ "도는 주장"은 늘 그 이름표를 달고 따옴표 안에 둔다. 소문만 덩그러니 보이지 않게,
 *   카드에는 답을 찾으라는 물음이 바로 붙는다.
 * ★ 사람이 소문을 참·거짓으로 가르지 않는다. 답은 콘텐츠가 정해 두었고, 고른 것은
 *   이 기기의 정원에만 남는다.
 * ★ 틀린 보기에는 "틀렸어요" 대신 "이건 「…」 이야기예요"라고 사실대로 말한다.
 */
/** 사건 목록은 온실을 처음 열 때 한 번 받는다(app/garden/cases.json). 탭을 오가도 다시 받지 않는다. */
let loading: Promise<Case[]> | null = null;
function loadCases(): Promise<Case[]> {
  loading ??= fetch("/garden/cases.json")
    .then((r) => (r.ok ? (r.json() as Promise<Case[]>) : Promise.reject(new Error(String(r.status)))))
    .catch((error) => {
      loading = null;
      throw error;
    });
  return loading;
}

export function Greenhouse({
  data,
  catalog,
  now,
  say,
}: {
  data: GardenData;
  catalog: Species[];
  now: number;
  say: (text: string) => void;
}) {
  const [cases, setCases] = useState<Case[] | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    loadCases().then(
      (list) => alive && setCases(list),
      (error) => {
        console.error("[garden] 온실 사건을 받지 못했다", error);
        if (alive) setFailed(true);
      },
    );
    return () => {
      alive = false;
    };
  }, []);

  if (!cases) {
    return (
      <p className="py-16 text-center text-[13px] text-smoke">
        {failed ? "온실 사건을 불러오지 못했어요. 잠시 뒤 다시 열어 보세요." : "온실 문을 여는 중…"}
      </p>
    );
  }

  const today = todaysCases(cases, data.cases, now);
  const solved = new Set(data.cases.solved);
  const doneToday = data.cases.day === kstDay(now) ? data.cases.today.length : 0;
  const toBox = CASE_BOX_EVERY - (data.cases.solved.length % CASE_BOX_EVERY);

  return (
    <section aria-labelledby="greenhouse-title">
      <div className="rounded-2xl bg-[var(--g-panel)] px-4 py-3">
        <h2 id="greenhouse-title" className="text-[15px] font-bold">
          🔍 탐정 온실
        </h2>
        <p className="mt-1 text-[12.5px] leading-relaxed text-graphite">
          SNS에서 도는 말에 답하는 내용을 셋 중에서 찾아요. 틀려도 잃는 건 없어요. 풀면 그 정책의 씨앗과 잼(처음에
          맞히면 {CASE_JAM.first}, 아니면 {CASE_JAM.later})을 받고, {CASE_BOX_EVERY}건마다 🎁 온실 상자가 열려요.
        </p>
        <p className="mt-2 text-[12px] font-semibold text-graphite tabular-nums">
          오늘 사건 {doneToday}/{today.length} · 푼 사건 {solved.size}건 · 온실
          상자까지 {toBox}건
        </p>
      </div>

      <div className="mt-3 space-y-3">
        {today.map((c) => (
          <CaseCard key={c.id} c={c} solved={solved.has(c.id)} catalog={catalog} say={say} />
        ))}
      </div>

      {today.length > 0 && today.every((c) => solved.has(c.id)) && (
        <p className="mt-4 text-center text-[13px] text-smoke">오늘 사건을 다 풀었어요. 내일 새 사건이 와요.</p>
      )}
      {today.length === 0 && (
        <p className="mt-4 text-center text-[13px] text-smoke">
          {cases.length ? "온실의 사건을 모두 풀었어요. 새 정책이 들어오면 사건도 늘어요." : "아직 사건이 없어요."}
        </p>
      )}
    </section>
  );
}

function CaseCard({
  c,
  solved,
  catalog,
  say,
}: {
  c: Case;
  solved: boolean;
  catalog: Species[];
  say: (text: string) => void;
}) {
  const [tried, setTried] = useState<number[]>([]);
  const answer = c.options.find((o) => o.answer);

  const pick = (index: number) => {
    const o = c.options[index];
    const garden = useGarden.getState();
    if (!o.answer) {
      gardenFeedback("tap");
      setTried((t) => [...t, index]);
      garden.missCase(c.id);
      return;
    }
    const result = garden.solveCase(c, catalog);
    if (!result) return;
    track("case_solve", { first_try: result.firstTry });
    gardenFeedback("reward");
    const parts = [`🍯 +${result.jam}`];
    if (result.seed) parts.push(`🌱 「${result.seed.title}」`);
    say(`🔍 찾았어요! ${parts.join(" · ")}`);
    if (result.box) {
      const box = result.box;
      setTimeout(() => say(`🎁 온실 상자: 「${box.title}」 씨앗`), 2400);
    }
  };

  return (
    <article className="rounded-2xl border border-stone bg-eggshell px-3.5 py-3 text-ink">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold text-smoke">
        <span className="rounded bg-canvas px-1.5 py-0.5">도는 주장</span>
        {/* 정책 이름은 풀고 나서 보인다. 먼저 보이면 같은 이름이 붙은 보기를 고르는 놀이가 된다. */}
        {solved && (
          <Link href={c.href} className="truncate underline-offset-2 hover:text-ink hover:underline">
            「{c.policyTitle}」
          </Link>
        )}
      </p>
      <p className="mt-1.5 text-[14px] font-semibold leading-relaxed">“{c.rumor}”</p>

      {solved && answer ? (
        <div className="mt-3">
          <p className="mb-1.5 text-[12px] font-semibold text-graphite">이 말에 답하는 내용</p>
          <NoteCard
            note={answer.note}
            pageHref={answer.href}
            onSource={() => track("evidence_open", { source: "garden", note_id: answer.note.id })}
          />
        </div>
      ) : (
        <>
          <p className="mt-3 text-[12px] font-semibold text-graphite">이 말에 답하는 내용은 무엇일까요?</p>
          <ul className="mt-1.5 space-y-2">
            {c.options.map((o, i) => {
              const wrong = tried.includes(i);
              return (
                <li key={o.note.id}>
                  <button
                    type="button"
                    disabled={wrong}
                    onClick={() => pick(i)}
                    className="block w-full rounded-xl border border-stone bg-canvas px-3 py-2.5 text-left text-[13px] leading-relaxed hover:border-graphite disabled:opacity-60"
                  >
                    {o.note.text}
                  </button>
                  {wrong && (
                    <p className="mt-1 px-1 text-[11.5px] text-smoke">
                      이건{" "}
                      <Link href={o.href} className="underline underline-offset-2">
                        「{o.policyTitle}」
                      </Link>{" "}
                      이야기예요. 다른 보기를 골라 보세요.
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </article>
  );
}
