"use client";

import Link from "next/link";

import { EvidenceCardView } from "./EvidenceCardView";
import { Jamtongi, Say } from "./Jamtongi";
import { addDays, currentUnit, GOALS, isDue, pickSession, STAGE_ICON, unitStage, weekOf, type Streak } from "./rules";
import { useStudy, type StudyData } from "./store";
import type { StudyBank } from "./types";

const WEEK = ["월", "화", "수", "목", "금", "토", "일"];

/**
 * 교실 › 오늘 — 매일 들어오면 처음 보는 곳. 할 일 하나(오늘의 한 판)가 가장 크다(docs/daily-study.md §8.2).
 * 처음 온 사람에게는 하루 목표 고르기와 첫 판만 보인다.
 */
export function Today({
  bank,
  data,
  streak,
  today,
  onDaily,
  onUnit,
}: {
  bank: StudyBank;
  data: StudyData;
  streak: Streak;
  today: string;
  onDaily: () => void;
  onUnit: (unitId: string) => void;
}) {
  const setGoal = useStudy((s) => s.setGoal);

  if (!data.intro) {
    return (
      <div className="grid gap-3">
        <Say mood="cheer" size={60}>
          안녕하세요, 잼통이에요! <b>잼공</b>은 재밌는 공부, 잼통 공부예요. 하루 몇 분씩 업적의 근거를 익혀서, 누가 물어도 자신 있게
          답할 수 있게 도와 드릴게요.
        </Say>
        <div className="st-card grid gap-2">
          <p className="st-eyebrow">하루 목표</p>
          <div className="grid grid-cols-3 gap-2">
            {GOALS.map((g) => (
              <button
                key={g.n}
                type="button"
                aria-pressed={data.goal === g.n}
                onClick={() => setGoal(g.n)}
                className={`st-btn border-2 px-2 ${data.goal === g.n ? "border-[var(--s-jam)] bg-[var(--s-jam-soft)]" : "border-[var(--s-line)] bg-[var(--s-paper)]"}`}
              >
                <span className="block text-[14px]">{g.label}</span>
                <span className="st-small block font-semibold">{g.hint}</span>
              </button>
            ))}
          </div>
          <p className="st-small">한 판은 8문제, 4분쯤이에요. 목표는 나중에 「내 기록 › 설정」에서 바꿀 수 있어요.</p>
        </div>
        <div className="st-cta">
          <p className="st-eyebrow" style={{ color: "inherit", opacity: 0.75 }}>
            첫 판
          </p>
          <p className="st-h">「{bank.units[0]?.title}」부터 시작해요</p>
          <button type="button" className="st-btn st-btn-jam" onClick={onDaily}>
            시작하기
          </button>
        </div>
        <p className="st-small px-1">점수 경쟁이나 순위는 없어요. 기록은 나만 봐요.</p>
      </div>
    );
  }

  const session = pickSession(bank, data.boxes, today);
  const due = session.filter((id) => data.boxes[id] && isDue(data.boxes[id], today)).length;
  const fresh = session.filter((id) => !data.boxes[id]).length;
  const units = new Set(session.map((id) => id.split("/")[0]));
  const unitTitles = bank.units.filter((u) => units.has(u.id)).map((u) => u.title);
  const goalMet = streak.today >= data.goal;
  const cur = currentUnit(bank, data.boxes);
  const curUnit = bank.units.find((u) => u.id === cur);
  const curItems = bank.items.filter((i) => i.unit === cur);
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
            <b>알기</b> {curLearned}/{curItems.length} · 이해 · 출처 · 반론 · 말하기(준비 중)
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
