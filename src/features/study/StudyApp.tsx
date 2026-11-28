"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import { useAuth } from "@/lib/firebase/auth";
import { loadStudy, saveStudy } from "@/lib/firebase/study";

import { Lesson } from "./Lesson";
import { Say } from "./Jamtongi";
import { pickLevelSession } from "./levels";
import { navForLevel, STUDY_HOME, SOON, studyNavOf, visibleSegments, visibleTabs, type StudyNav, type StudySegment } from "./nav";
import { Cards, Review } from "./Notes";
import { Attendance, Settings } from "./Record";
import { Road, UnitSheet } from "./Road";
import { isDue, kstDay, streakOf, unitSession } from "./rules";
import { useStudy, type StudyData } from "./store";
import { sameStudy } from "./sync";
import styles from "./study.module.css";
import { Today } from "./Today";
import type { StudyBank } from "./types";

/**
 * 잼공 — 재밌는 공부, 잼통 공부. 설계는 docs/daily-study.md, 시안은 docs/study-room-proto.html.
 *
 * 정원처럼 사이트 안의 별도 앱이다. 사이트 하단 탭 대신 제 하단 탭 다섯(교실·배움길·말하기·근거노트·내 기록)을 그리고,
 * 머리의 "← 잼통"이 정보 페이지로 돌아가는 길이다. 문항 은행은 서버가 콘텐츠에서 만들어 넘겨 준다.
 */
const SAVE_DELAY = 2_000;

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
  const [lesson, setLesson] = useState<{ ids: string[]; mode: "daily" | "unit" | "intro"; key: number } | null>(null);
  const [today, setToday] = useState(() => (typeof window === "undefined" ? "" : kstDay(Date.now())));
  const opened = useRef(false);

  // 기록은 이 브라우저(localStorage)에 먼저 있다. 첫 렌더 뒤에 읽는다.
  useEffect(() => {
    useStudy.getState().boot();
  }, []);

  // 계정. 기록을 기기 사이로 옮기려면 있어야 한다(정원과 같은 익명 계정).
  const { ready, configured, ensureUser, user } = useAuth();
  const uid = user?.uid ?? null;
  useEffect(() => {
    if (!ready || !configured) return;
    void ensureUser();
  }, [ready, configured, ensureUser]);

  /*
   * 동기화(docs/daily-study.md §11). 계정의 기록을 한 번 읽어 합치고(store.link), 그 뒤로는 바뀔 때마다 늦춰서 쓴다.
   * 기록은 합치므로(sync.ts) 정원처럼 맞추기 전에 화면을 막지 않는다 — 그새 푼 것도 합칠 때 남는다.
   * 읽지 못했으면 쓰지 않는다. 계정 쪽에 무엇이 있는지 모르는 채로 덮게 된다.
   */
  const hasData = Boolean(data);
  useEffect(() => {
    if (!uid || !hasData) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let unsubscribe: (() => void) | null = null;
    const save = (snapshot: StudyData) =>
      saveStudy(uid, snapshot).catch((error) => console.error("[study] 잼공 기록을 계정에 저장하지 못했다", error));
    void (async () => {
      let remote: StudyData | null;
      try {
        remote = await loadStudy<StudyData>(uid);
      } catch (error) {
        console.error("[study] 계정의 잼공 기록을 읽지 못했다 — 이번에는 이 기기에만 둔다", error);
        return;
      }
      if (!alive) return;
      const merged = useStudy.getState().link(remote);
      if (!sameStudy(merged, remote)) void save(merged);
      unsubscribe = useStudy.subscribe((s) => {
        if (!s.data) return;
        if (timer) clearTimeout(timer);
        const snapshot = s.data;
        timer = setTimeout(() => void save(snapshot), SAVE_DELAY);
      });
    })();
    return () => {
      alive = false;
      unsubscribe?.();
      if (timer) clearTimeout(timer);
    };
  }, [uid, hasData]);

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
  const level = data.level ?? 1;
  const tabs = visibleTabs(level);
  const shown = navForLevel(nav, level);
  const segs = visibleSegments(shown.tab, level);
  const startDaily = () => setLesson({ ids: pickLevelSession(bank, data.boxes, today, level), mode: "daily", key: Date.now() });
  const startIntro = (ids: string[]) => setLesson({ ids, mode: "intro", key: Date.now() });
  const startUnit = (id: string) => {
    setUnit(null);
    setLesson({ ids: unitSession(bank, data.boxes, id, level), mode: "unit", key: Date.now() });
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
        {segs.length > 1 && (
          <div className="st-segs" role="group" aria-label="칸 전환">
            {segs.map((s) => (
              <button key={s.id} type="button" aria-pressed={shown.seg === s.id} onClick={() => go({ tab: shown.tab, seg: s.id })}>
                {s.label}
                {SOON[s.id] && <span className="soon">준비 중</span>}
              </button>
            ))}
          </div>
        )}
      </header>

      <section id={`study-panel-${shown.tab}`} role="tabpanel" aria-labelledby={`study-tab-${shown.tab}`} className="pt-4">
        <Panel
          seg={shown.seg}
          bank={bank}
          today={today}
          streak={streak}
          onDaily={startDaily}
          onIntro={startIntro}
          onUnit={setUnit}
        />
      </section>

      <nav aria-label="잼공 메뉴" className="st-nav">
        <div role="tablist" aria-label="잼공" className="st-tabs">
          {tabs.map((t, index) => {
            const on = shown.tab === t.id;
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
                onClick={() => go({ tab: t.id, seg: visibleSegments(t.id, level)[0].id })}
                onKeyDown={(e) => {
                  const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                  if (!step) return;
                  e.preventDefault();
                  const next = tabs[(index + step + tabs.length) % tabs.length].id;
                  go({ tab: next, seg: visibleSegments(next, level)[0].id });
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

      {unit && <UnitSheet bank={bank} boxes={data.boxes} unitId={unit} level={level} onStart={() => startUnit(unit)} onClose={closeUnit} />}
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
  onIntro,
  onUnit,
}: {
  seg: StudySegment;
  bank: StudyBank;
  today: string;
  streak: ReturnType<typeof streakOf>;
  onDaily: () => void;
  onIntro: (ids: string[]) => void;
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
      return <Today bank={bank} data={data} streak={streak} today={today} onDaily={onDaily} onIntro={onIntro} onUnit={onUnit} />;
    case "path":
      return <Road bank={bank} boxes={data.boxes} level={data.level ?? 1} onUnit={onUnit} />;
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
