"use client";

import { Say } from "./Jamtongi";
import { addDays, GOALS, RESTS_PER_WEEK, weekday, type Streak } from "./rules";
import { useStudy, type StudyData } from "./store";
import { STEPS } from "./types";

/**
 * 내 기록 › 출석부 — 이 달의 도장 달력. 본인만 본다(docs/daily-study.md §6.1).
 * 쉼표로 메운 날은 ⏸로 보인다. 끊겨도 꾸짖지 않는다.
 */
export function Attendance({ data, streak, today }: { data: StudyData; streak: Streak; today: string }) {
  const first = `${today.slice(0, 7)}-01`;
  const lead = weekday(first); // 일요일 시작 달력
  const rested = new Set(streak.rested);
  const cells: string[] = [];
  for (let d = first; d.slice(0, 7) === first.slice(0, 7); d = addDays(d, 1)) cells.push(d);
  const month = cells.filter((d) => (data.days[d] ?? 0) > 0).length;
  const goalDays = cells.filter((d) => (data.days[d] ?? 0) >= data.goal).length;

  return (
    <div className="grid gap-3">
      <div className="st-card grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <p className="st-h">
            {Number(today.slice(0, 4))}년 {Number(today.slice(5, 7))}월
          </p>
          <span className="st-small">
            공부한 날 {month} · 목표 채운 날 {goalDays}
          </span>
        </div>
        <div className="st-cal">
          {["일", "월", "화", "수", "목", "금", "토"].map((w) => (
            <span key={w} className="dname">
              {w}
            </span>
          ))}
          {Array.from({ length: lead }, (_, k) => (
            <span key={`b${k}`} />
          ))}
          {cells.map((d) => {
            const on = (data.days[d] ?? 0) > 0;
            const rest = rested.has(d);
            const day = Number(d.slice(8));
            return (
              <span key={d} className={`c ${on ? "on" : rest ? "rest" : ""} ${d === today ? "today" : ""} ${d > today ? "future" : ""}`} aria-label={`${day}일${on ? " 공부함" : rest ? " 쉼표" : ""}`}>
                {on ? "🫙" : rest ? "⏸" : day}
              </span>
            );
          })}
        </div>
      </div>
      <Say mood={streak.count > 0 ? "cheer" : "sleep"} size={44}>
        {streak.count > 0 ? `${streak.count}일째 이어 가고 있어요.` : "괜찮아요, 오늘부터 다시 시작하면 돼요."} ⏸ 쉼표는 한 주에 {RESTS_PER_WEEK}개씩
        저절로 채워져서 빠진 날을 메워 줘요.
      </Say>
      <p className="st-small px-1">출석부는 나만 봐요. 1촌·방·공유 카드에 나가지 않아요.</p>
    </div>
  );
}

/** 내 기록 › 설정 — 하루 목표. 알림은 다음 단계(docs/daily-study.md §8.5). */
export function Settings({ data }: { data: StudyData }) {
  const setGoal = useStudy((s) => s.setGoal);
  return (
    <div className="grid gap-3">
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
        <p className="st-small">목표를 넘겨도 더 주는 것은 없어요. 내 속도에 맞게 골라요.</p>
      </div>
      <LevelCard data={data} />
      <div className="st-card grid gap-1">
        <p className="st-eyebrow">기록은 어디에</p>
        <p className="text-[13.5px]">
          이 기기와 잼통 계정에 함께 저장돼요. 같은 계정으로 다른 기기에서 열면 공부한 날·근거 카드·복습 일정이 모두 합쳐져요.
          기록은 나만 볼 수 있어요.
        </p>
      </div>
    </div>
  );
}

/**
 * 내 단계 — 다섯 단계 가운데 어디인지와 「지금 단계에 머물기」(docs/jamgong-roadmap.md §3.1).
 * 1단계에 머무는 것도 성공이다. 머물기를 켜면 다음 단계 초대가 뜨지 않는다.
 */
function LevelCard({ data }: { data: StudyData }) {
  const setStay = useStudy((s) => s.setStay);
  const level = data.level ?? 1;
  return (
    <div className="st-card grid gap-2">
      <p className="st-eyebrow">내 단계</p>
      <ol className="grid gap-1">
        {STEPS.map((s) => (
          <li key={s.id} className={`flex items-start gap-2 text-[13px] ${s.level > level ? "opacity-45" : ""}`}>
            <span aria-hidden="true">{s.icon}</span>
            <span className="min-w-0">
              <b>
                {s.level}단계 {s.label}
              </b>
              {s.level === level && <span className="ml-1 text-[11px] font-bold text-[var(--s-jam-ink)]">지금</span>}
              <span className="st-small block">{s.can}</span>
            </span>
          </li>
        ))}
      </ol>
      <label className="flex items-center justify-between gap-3 border-t border-[var(--s-line)] pt-2 text-[13.5px]">
        <span>
          지금 단계에 머물기
          <span className="st-small block">켜 두면 다음 단계를 권하지 않아요. 기초 사실을 꾸준히 익히는 것만으로도 충분해요.</span>
        </span>
        <input type="checkbox" className="h-5 w-5 shrink-0 accent-[var(--s-ok)]" checked={Boolean(data.stay)} onChange={(e) => setStay(e.target.checked)} />
      </label>
    </div>
  );
}
