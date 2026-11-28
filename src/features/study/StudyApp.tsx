"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { track } from "@/lib/analytics";

import { Lesson } from "./Lesson";
import { Say } from "./Jamtongi";
import { STUDY_HOME, STUDY_SEGMENTS, STUDY_TABS, SOON, studyNavOf, type StudyNav, type StudySegment, type StudyTab } from "./nav";
import { Cards, Review } from "./Notes";
import { Attendance, Settings } from "./Record";
import { Road, UnitSheet } from "./Road";
import { isDue, kstDay, pickSession, streakOf, unitSession } from "./rules";
import { useStudy } from "./store";
import styles from "./study.module.css";
import { Today } from "./Today";
import type { StudyBank } from "./types";

/**
 * 잼공 — 재밌는 공부, 잼통 공부. 설계는 docs/daily-study.md, 시안은 docs/study-room-proto.html.
 *
 * 정원처럼 사이트 안의 별도 앱이다. 사이트 하단 탭 대신 제 하단 탭 다섯(교실·배움길·말하기·근거노트·내 기록)을 그리고,
 * 머리의 "← 잼통"이 정보 페이지로 돌아가는 길이다. 문항 은행은 서버가 콘텐츠에서 만들어 넘겨 준다.
 */
export function StudyApp({ bank }: { bank: StudyBank }) {
  const data = useStudy((s) => s.data);
  /*
   * 주소(?tab=, ?unit=)로 왔으면 그 자리부터. 첫 렌더는 기록(data)이 없어 "여는 중"만 그리므로
   * 여기서 주소창을 읽어도 서버 렌더와 어긋나지 않는다(정원 GardenApp과 같은 방식).
   */
  const [unit, setUnit] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const u = new URL(window.location.href).searchParams.get("unit");
    const id = u ? (u.startsWith("a:") ? u : `a:${u}`) : null;
    return id && bank.units.some((x) => x.id === id) ? id : null;
  });
  const [nav, setNav] = useState<StudyNav>(() => {
    if (typeof window === "undefined") return STUDY_HOME;
    if (unit) return { tab: "road", seg: "path" };
    return studyNavOf(new URL(window.location.href).searchParams.get("tab")) ?? STUDY_HOME;
  });
  const [lesson, setLesson] = useState<{ ids: string[]; mode: "daily" | "unit"; key: number } | null>(null);
  const [today, setToday] = useState(() => (typeof window === "undefined" ? "" : kstDay(Date.now())));
  const opened = useRef(false);

  // 기록은 이 브라우저(localStorage)에 있다. 첫 렌더 뒤에 읽는다.
  useEffect(() => {
    useStudy.getState().boot();
  }, []);

  // 자정을 넘겨 켜 둔 화면도 날짜를 바꾼다.
  useEffect(() => {
    const timer = setInterval(() => setToday(kstDay(Date.now())), 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!data || !today || opened.current) return;
    opened.current = true;
    const due = bank.items.filter((i) => data.boxes[i.id] && isDue(data.boxes[i.id], today)).length;
    track("study_open", { streak: streakOf(data.days, today).count, due });
  }, [data, today, bank]);

  const go = useCallback((next: StudyNav) => {
    setNav(next);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", next.seg);
    url.searchParams.delete("unit");
    window.history.replaceState(null, "", url.pathname + url.search);
    window.scrollTo({ top: 0 });
  }, []);

  const closeLesson = useCallback(() => {
    setLesson(null);
    const d = useStudy.getState().data;
    if (d && !d.intro && Object.keys(d.days).length > 0) useStudy.getState().endIntro();
  }, []);
  const closeUnit = useCallback(() => setUnit(null), []);

  if (!data || !today) {
    return (
      <div className={`${styles.study} -mx-4 min-h-[70vh] px-4 pt-10`}>
        <p className="st-small text-center">잼공을 여는 중…</p>
      </div>
    );
  }

  const streak = streakOf(data.days, today);
  const startDaily = () => setLesson({ ids: pickSession(bank, data.boxes, today), mode: "daily", key: Date.now() });
  const startUnit = (id: string) => {
    setUnit(null);
    setLesson({ ids: unitSession(bank, data.boxes, id), mode: "unit", key: Date.now() });
  };
  const goalLeft = streak.today < data.goal;

  return (
    <div className={`${styles.study} -mx-4 min-h-[calc(100dvh-56px)] px-4 pb-28`}>
      <header className="st-head">
        <div className="st-headrow">
          <Link href="/" className="st-back">
            ← 잼통
          </Link>
          <h1 className="st-title">
            잼공
            {!data.intro && <small>재밌는 공부, 잼통 공부</small>}
          </h1>
          <span className="st-chip" title="이어 간 날">
            🫙 {streak.count}일
          </span>
          <span className="st-chip" title="이번 주 남은 쉼표">
            ⏸ {streak.restsLeft}
          </span>
        </div>
        {STUDY_SEGMENTS[nav.tab].length > 1 && (
          <div className="st-segs" role="group" aria-label="칸 전환">
            {STUDY_SEGMENTS[nav.tab].map((s) => (
              <button key={s.id} type="button" aria-pressed={nav.seg === s.id} onClick={() => go({ tab: nav.tab, seg: s.id })}>
                {s.label}
                {SOON[s.id] && <span className="soon">준비 중</span>}
              </button>
            ))}
          </div>
        )}
      </header>

      <section id={`study-panel-${nav.tab}`} role="tabpanel" aria-labelledby={`study-tab-${nav.tab}`} className="pt-4">
        <Panel
          seg={nav.seg}
          bank={bank}
          today={today}
          streak={streak}
          onDaily={startDaily}
          onUnit={setUnit}
        />
      </section>

      <nav aria-label="잼공 메뉴" className="st-nav">
        <div role="tablist" aria-label="잼공" className="st-tabs">
          {STUDY_TABS.map((t, index) => {
            const on = nav.tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                type="button"
                id={`study-tab-${t.id}`}
                aria-controls={on ? `study-panel-${t.id}` : undefined}
                aria-selected={on}
                tabIndex={on ? 0 : -1}
                className="st-tab"
                onClick={() => go({ tab: t.id, seg: STUDY_SEGMENTS[t.id][0].id })}
                onKeyDown={(e) => {
                  const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                  if (!step) return;
                  e.preventDefault();
                  const next: StudyTab = STUDY_TABS[(index + step + STUDY_TABS.length) % STUDY_TABS.length].id;
                  go({ tab: next, seg: STUDY_SEGMENTS[next][0].id });
                  document.getElementById(`study-tab-${next}`)?.focus();
                }}
              >
                <span className="ico" aria-hidden="true">
                  {t.icon}
                </span>
                {t.label}
                {t.id === "class" && goalLeft && <span className="st-dot" aria-label="오늘 목표가 남았어요" />}
              </button>
            );
          })}
        </div>
      </nav>

      {unit && <UnitSheet bank={bank} boxes={data.boxes} unitId={unit} onStart={() => startUnit(unit)} onClose={closeUnit} />}
      {lesson && <Lesson key={lesson.key} bank={bank} ids={lesson.ids} mode={lesson.mode} onClose={closeLesson} />}
    </div>
  );
}

function Panel({
  seg,
  bank,
  today,
  streak,
  onDaily,
  onUnit,
}: {
  seg: StudySegment;
  bank: StudyBank;
  today: string;
  streak: ReturnType<typeof streakOf>;
  onDaily: () => void;
  onUnit: (unitId: string) => void;
}) {
  const data = useStudy((s) => s.data)!;
  const soon = SOON[seg];
  if (soon) {
    return (
      <div className="grid gap-3">
        <Say mood="think">
          <b>준비 중이에요.</b> {soon}
        </Say>
        <button type="button" className="st-btn st-btn-jam w-full" onClick={onDaily}>
          그동안 오늘의 한 판 하기
        </button>
      </div>
    );
  }
  switch (seg) {
    case "today":
      return <Today bank={bank} data={data} streak={streak} today={today} onDaily={onDaily} onUnit={onUnit} />;
    case "path":
      return <Road bank={bank} boxes={data.boxes} onUnit={onUnit} />;
    case "cards":
      return <Cards bank={bank} wallet={data.wallet} />;
    case "review":
      return <Review bank={bank} boxes={data.boxes} today={today} />;
    case "attend":
      return <Attendance data={data} streak={streak} today={today} />;
    case "settings":
      return <Settings data={data} />;
    default:
      return null;
  }
}
