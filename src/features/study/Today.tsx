"use client";

import Link from "next/link";
import { useState } from "react";

import { track } from "@/lib/analytics";

import { EvidenceCardView } from "./EvidenceCardView";
import { Jamtongi, Say } from "./Jamtongi";
import { inviteFor, pickLevelSession } from "./levels";
import { addDays, currentUnit, GOALS, isDue, kstDay, STAGE_ICON, unitStage, weekOf, type Streak } from "./rules";
import { useStudy, type StudyData } from "./store";
import { STEPS, type StudyBank, type StudyItem } from "./types";

const WEEK = ["월", "화", "수", "목", "금", "토", "일"];

/**
 * 교실 › 오늘 — 매일 들어오면 처음 보는 곳. 할 일 하나(오늘의 한 판)가 가장 크다(docs/daily-study.md §8.2).
 *
 * ★ 첫 3분(docs/jamgong-roadmap.md §4): 처음 온 사람은 설명이나 설정 없이 **첫 문제가 바로 보인다.**
 *   답하면 풀이와 근거 카드 한 장, "두 개만 더?" → 두 문제 → 끝. 하루 목표는 다음에 온 날 묻는다.
 * ★ 원본 페이지의 확인 문제로 이미 한 문제를 푼 사람은 첫 문제를 건너뛰고 "두 개만 더"부터.
 */
export function Today({
  bank,
  data,
  streak,
  today,
  onDaily,
  onIntro,
  onUnit,
}: {
  bank: StudyBank;
  data: StudyData;
  streak: Streak;
  today: string;
  onDaily: () => void;
  onIntro: (ids: string[]) => void;
  onUnit: (unitId: string) => void;
}) {
  const setGoal = useStudy((s) => s.setGoal);
  const level = data.level ?? 1;

  if (!data.intro) return <FirstMinutes bank={bank} data={data} onIntro={onIntro} />;

  const firstDay = Object.keys(data.days).sort()[0];
  const askGoal = !data.goalAsked && firstDay !== undefined && today > firstDay;
  const invite = inviteFor(bank, { level, stay: Boolean(data.stay), declinedOn: data.declinedOn }, data.boxes, data.wallet, today);
  const session = pickLevelSession(bank, data.boxes, today, level);
  const due = session.filter((id) => data.boxes[id] && isDue(data.boxes[id], today)).length;
  const fresh = session.filter((id) => !data.boxes[id]).length;
  const units = new Set(session.map((id) => id.split("/")[0]));
  const unitTitles = bank.units.filter((u) => units.has(u.id)).map((u) => u.title);
  const goalMet = streak.today >= data.goal;
  const cur = currentUnit(bank, data.boxes);
  const curUnit = bank.units.find((u) => u.id === cur);
  const curItems = bank.items.filter((i) => i.unit === cur && i.step === "know");
  const curLearned = curItems.filter((i) => (data.boxes[i.id]?.[0] ?? 0) >= 2).length;
  const monday = weekOf(today);
  const rested = new Set(streak.rested);
  const cardItems = data.wallet.map((id) => bank.items.find((i) => i.id === id)).filter((i) => i?.card);
  const dayCard = cardItems.length ? cardItems[Number(today.replaceAll("-", "")) % cardItems.length] : undefined;

  const greet = goalMet
    ? "오늘 목표를 채웠어요! 더 하고 싶으면 한 판 더 해도 좋아요."
    : due > 0
      ? `다시 볼 문제가 ${due}개 있어요. 잊을 때쯤 한 번 더 보면 오래 남아요.`
      : curUnit
        ? `오늘은 「${curUnit.title}」을 알아봐요.`
        : "모든 단원의 알기를 마쳤어요! 복습으로 단단하게 다져요.";

  return (
    <div className="grid gap-3">
      <Say mood={goalMet ? "cheer" : "smile"} size={56}>
        {greet}
      </Say>

      {askGoal && (
        <div className="st-card grid gap-2">
          <p className="st-eyebrow">다시 와 줘서 반가워요 · 하루 목표를 골라 볼까요?</p>
          <div className="grid grid-cols-3 gap-2">
            {GOALS.map((g) => (
              <button
                key={g.n}
                type="button"
                onClick={() => setGoal(g.n)}
                className={`st-btn border-2 px-2 ${g.n === 1 ? "border-[var(--s-jam)] bg-[var(--s-jam-soft)]" : "border-[var(--s-line)] bg-[var(--s-paper)]"}`}
              >
                <span className="block text-[14px]">{g.label}</span>
                <span className="st-small block font-semibold">{g.hint}</span>
              </button>
            ))}
          </div>
          <p className="st-small">가볍게 1판(2분)이면 충분해요. 나중에 「내 기록 › 설정」에서 바꿀 수 있어요.</p>
        </div>
      )}

      {invite && <LevelInvite level={invite} />}

      <div className="st-card">
        <div className="flex items-center justify-between gap-2">
          <span className="st-eyebrow">이번 주 출석</span>
          <span className="st-small">⏸ 쉼표 {streak.restsLeft}개 남음</span>
        </div>
        <div className="st-week">
          {WEEK.map((w, k) => {
            const d = addDays(monday, k);
            const on = (data.days[d] ?? 0) > 0;
            const rest = rested.has(d);
            return (
              <div key={d} className="st-day">
                <span className={`st-stamp ${on ? "on" : rest ? "rest" : ""} ${d === today ? "today" : ""}`} aria-label={`${w}요일 ${on ? "공부함" : rest ? "쉼표" : ""}`}>
                  {on ? "🫙" : rest ? "⏸" : ""}
                </span>
                {w}
              </div>
            );
          })}
        </div>
      </div>

      <div className="st-cta">
        <p className="st-eyebrow" style={{ color: "inherit", opacity: 0.75 }}>
          오늘의 한 판 · 오늘 {streak.today}/{data.goal}판
        </p>
        <p className="st-h">
          {due > 0 && fresh > 0 ? `다시 보기 ${due} + 새 문제 ${fresh}` : due > 0 ? `다시 보기 ${due}문제` : fresh > 0 ? `새 문제 ${fresh}개` : `미리 복습 ${session.length}문제`}
        </p>
        <div className="st-meta">
          <span>약 {Math.max(2, Math.round(session.length / 2))}분</span>
          {unitTitles.slice(0, 3).map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <button type="button" className="st-btn st-btn-jam" onClick={onDaily} disabled={session.length === 0}>
          {goalMet ? "한 판 더" : "시작하기"}
        </button>
      </div>

      {curUnit && (
        <button type="button" className="st-card grid gap-2 text-left" onClick={() => onUnit(curUnit.id)}>
          <span className="flex items-center justify-between gap-2">
            <span className="min-w-0">
              <span className="st-eyebrow block">이어 하기</span>
              <span className="st-h block">{curUnit.title}</span>
            </span>
            <span className="text-[26px]" aria-hidden="true">
              {STAGE_ICON[unitStage(curItems, data.boxes)]}
            </span>
          </span>
          <span className="st-progress" aria-label={`알기 ${curItems.length}문제 가운데 ${curLearned}개 익힘`}>
            <i style={{ width: `${(curLearned / Math.max(1, curItems.length)) * 100}%` }} />
          </span>
          <span className="st-small">
            🌱 알기 {curLearned}/{curItems.length}문제 익힘
          </span>
        </button>
      )}

      {dayCard && (
        <div className="st-card grid gap-2">
          <p className="st-eyebrow">오늘의 근거 한 장</p>
          <EvidenceCardView item={dayCard} unitTitle={bank.units.find((u) => u.id === dayCard.unit)?.title ?? ""} href={bank.units.find((u) => u.id === dayCard.unit)?.href} copy />
        </div>
      )}

      <Link href="/wiki" className="st-card flex items-center gap-3">
        <Jamtongi mood="think" size={36} />
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-bold">모르는 게 있으면 잼통이에게 묻기</span>
          <span className="st-small block">위키에서 AI에게 물어보고, 답에 쓰인 근거를 바로 확인해요.</span>
        </span>
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

/**
 * 첫 3분. 들어오자마자 첫 문제 → 풀이와 근거 카드 → "두 개만 더?"(docs/jamgong-roadmap.md §4).
 * 점검·확신도·단계 설명·정원 이야기를 꺼내지 않는다.
 */
function FirstMinutes({ bank, data, onIntro }: { bank: StudyBank; data: StudyData; onIntro: (ids: string[]) => void }) {
  const answer = useStudy((s) => s.answer);
  const [picked, setPicked] = useState<boolean | null>(null);
  const first = bank.items.find((i) => i.id === bank.starter[0]);
  const answeredAny = Object.keys(data.boxes).length > 0;
  // 첫 문제를 여기서 풀었으면 picked가 있다. 이미 다른 곳(원본 페이지)에서 풀었으면 바로 "두 개만 더".
  const showFirst = first && (!answeredAny || picked !== null);

  const more = (): string[] => {
    const rest = bank.starter.filter((id) => !data.boxes[id] && id !== first?.id);
    const fill = pickLevelSession(bank, data.boxes, kstDay(Date.now()), 1).filter((id) => !data.boxes[id] && !rest.includes(id) && id !== first?.id);
    return [...rest, ...fill].slice(0, 2);
  };

  const choose = (yes: boolean) => {
    if (!first || picked !== null) return;
    setPicked(yes);
    answer(first.id, yes === first.answer, first.card !== null);
    track("study_first", { correct: yes === first.answer });
  };

  if (!showFirst) {
    return (
      <div className="grid gap-3">
        <Say mood="cheer" size={60}>
          벌써 한 문제 풀어 봤네요! <b>두 개만 더</b> 풀면 오늘은 끝이에요. 30초면 돼요.
        </Say>
        <button type="button" className="st-btn st-btn-jam w-full text-[16px]" onClick={() => onIntro(more())}>
          두 개 더 풀기
        </button>
      </div>
    );
  }
  if (!first) return null;
  const right = picked !== null && picked === first.answer;

  return (
    <div className="grid gap-3">
      <Say mood={picked === null ? "smile" : right ? "cheer" : "think"} size={56}>
        {picked === null ? (
          <>
            안녕하세요, 잼통이에요! <b>30초면 돼요.</b> 하나만 풀어 볼까요?
          </>
        ) : right ? (
          "맞았어요! 근거 카드 한 장이 근거노트에 들어갔어요."
        ) : (
          "괜찮아요, 풀이를 같이 봐요. 이렇게 하나씩 알아 가는 거예요."
        )}
      </Say>
      <FirstCard item={first} unitTitle={bank.units.find((u) => u.id === first.unit)?.title ?? ""} picked={picked} onPick={choose} />
      {picked !== null && (
        <>
          {right && <EvidenceCardView item={first} unitTitle={bank.units.find((u) => u.id === first.unit)?.title ?? ""} />}
          <button type="button" className="st-btn st-btn-jam w-full text-[16px]" onClick={() => onIntro(more())}>
            두 개만 더 풀어 볼까요?
          </button>
        </>
      )}
      <p className="st-small px-1">점수 경쟁이나 순위는 없어요. 기록은 나만 봐요.</p>
    </div>
  );
}

function FirstCard({ item, unitTitle, picked, onPick }: { item: StudyItem; unitTitle: string; picked: boolean | null; onPick: (yes: boolean) => void }) {
  const checked = picked !== null;
  return (
    <div className="st-card grid gap-3">
      <p className="st-small font-bold">O/X · {unitTitle}</p>
      <p className="st-q">{item.statement}</p>
      <div className="st-ox" role="group" aria-label="답 고르기">
        {[true, false].map((yes) => (
          <button
            key={String(yes)}
            type="button"
            className={checked ? (yes === item.answer ? "right" : yes === picked ? "wrong" : "") : ""}
            disabled={checked}
            aria-label={yes ? "맞다(O)" : "아니다(X)"}
            onClick={() => onPick(yes)}
          >
            {yes ? "⭕" : "❌"}
          </button>
        ))}
      </div>
      {checked && <p className="text-[13.5px] leading-relaxed">{item.explain}</p>}
    </div>
  );
}

/** 다음 단계 초대 — 초대이지 강요가 아니다. 거절하면 14일 뒤에 다시 묻는다(levels.ts). */
function LevelInvite({ level }: { level: number }) {
  const levelUp = useStudy((s) => s.levelUp);
  const decline = useStudy((s) => s.declineInvite);
  const step = STEPS.find((x) => x.level === level);
  if (!step) return null;
  return (
    <div className="st-card grid gap-2 border-2 border-[var(--s-jam)]">
      <p className="st-eyebrow">다음 단계가 열릴 수 있어요</p>
      <p className="st-h">
        {step.icon} {level}단계 「{step.label}」를 열까요?
      </p>
      <p className="text-[13.5px]">{step.can}. 문제가 조금 더 생각할 거리가 생겨요.</p>
      <div className="flex gap-2">
        <button type="button" className="st-btn st-btn-line flex-1" onClick={() => { decline(); track("study_level", { level, accept: false }); }}>
          지금처럼 할게요
        </button>
        <button type="button" className="st-btn st-btn-jam flex-1" onClick={() => { levelUp(level as 2 | 3 | 4 | 5); track("study_level", { level, accept: true }); }}>
          열기
        </button>
      </div>
    </div>
  );
}
