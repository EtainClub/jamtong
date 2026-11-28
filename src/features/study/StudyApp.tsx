"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import { useAuth } from "@/lib/firebase/auth";
import { loadStudy, saveStudy } from "@/lib/firebase/study";

import { Lesson } from "./Lesson";
import { Say } from "./Jamtongi";
import { Debates } from "./Debates";
import { Explain } from "./Explain";
import { Rumors } from "./Rumors";
import { setStudyFlusher } from "./flush";
import { assessReady, assessSession, pickLevelSession, skipSession, skipTargets } from "./levels";
import { navForLevel, STUDY_HOME, SOON, studyNavOf, visibleSegments, visibleTabs, type StudyNav, type StudySegment } from "./nav";
import { Cards, Review } from "./Notes";
import { Assessment, Attendance, Settings } from "./Record";
import { Road, UnitSheet } from "./Road";
import { isDue, kstDay, streakOf, unitSession, withoutSkipped } from "./rules";
import { useStudy, type StudyData } from "./store";
import { sameStudy } from "./sync";
import styles from "./study.module.css";
import { Today } from "./Today";
import type { Level, StudyBank } from "./types";

/**
 * 잼공 — 재밌는 공부, 잼통 공부. 설계는 docs/daily-study.md, 시안은 docs/study-room-proto.html.
 *
 * 정원처럼 사이트 안의 별도 앱이다. 사이트 하단 탭 대신 제 하단 탭 다섯(교실·배움길·말하기·근거노트·내 기록)을 그리고,
 * 머리의 "← 잼통"이 정보 페이지로 돌아가는 길이다. 문항 은행은 서버가 콘텐츠에서 만들어 넘겨 준다.
 */
const SAVE_DELAY = 2_000;

/** 1단계 사람이 은행 전체를 받기 시작하는 때(첫 화면이 다 그려진 뒤). 초대·건너뛰기 점검에 필요하다. */
const FULL_BANK_IDLE_MS = 3_000;

export function StudyApp({ bank: entry, bankVersion }: { bank: StudyBank; bankVersion: string }) {
  const data = useStudy((s) => s.data);
  /*
   * 은행 — 첫 화면에는 1단계 문항만 실려 온다(build.ts entryBank). 전체는 /study/bank.json에서 받는다.
   * 2단계부터는 곧바로 받고 그동안 "여는 중"을 그린다. 1단계는 첫 화면을 먼저 그리고 조용히 받는다.
   */
  const [full, setFull] = useState<StudyBank | null>(null);
  const [fullError, setFullError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const bank = full ?? entry;
  const needFull = (data?.level ?? 1) >= 2;
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
  const [lesson, setLesson] = useState<{ ids: string[]; mode: "daily" | "unit" | "intro" | "check" | "assess"; target?: Level; key: number } | null>(null);
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
    // 미뤄 둔 저장을 지금 한다 — 화면을 떠날 때 지우지 않고 저장한다(flush.ts).
    let pending: StudyData | null = null;
    const flush = () => {
      if (timer) clearTimeout(timer);
      timer = null;
      if (pending) void save(pending);
      pending = null;
    };
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
        pending = s.data;
        timer = setTimeout(flush, SAVE_DELAY);
      });
    })();
    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    setStudyFlusher(flush);
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      alive = false;
      unsubscribe?.();
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHide);
      setStudyFlusher(null);
      flush();
    };
  }, [uid, hasData]);

  useEffect(() => {
    if (!hasData || full) return;
    let alive = true;
    const load = () =>
      fetch(`/study/bank.json?v=${bankVersion}`)
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json() as Promise<StudyBank>;
        })
        .then((b) => {
          if (!alive) return;
          setFull(b);
          setFullError(false);
        })
        .catch((error) => {
          console.error("[study] 문항 은행 전체를 받지 못했다", error);
          if (alive) setFullError(true);
        });
    const timer = setTimeout(load, needFull ? 0 : FULL_BANK_IDLE_MS);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [hasData, full, needFull, attempt, bankVersion]);

  // 자정을 넘겨 켜 둔 화면도 날짜를 바꾼다.
  useEffect(() => {
    const timer = setInterval(() => setToday(kstDay(Date.now())), 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!data || !today || opened.current) return;
    opened.current = true;
    const due = withoutSkipped(bank, data.skipEras).items.filter((i) => data.boxes[i.id] && isDue(data.boxes[i.id], today)).length;
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

  if (!data || !today || (needFull && !full)) {
    return (
      <div className={`${styles.study} -mx-4 grid min-h-[70vh] content-start gap-3 px-4 pt-10`}>
        {needFull && fullError ? (
          <>
            <p className="st-small text-center">문제를 불러오지 못했어요. 연결을 확인하고 다시 해 주세요.</p>
            <button
              type="button"
              className="st-btn st-btn-jam mx-auto"
              onClick={() => {
                setFullError(false);
                setAttempt((n) => n + 1);
              }}
            >
              다시 불러오기
            </button>
          </>
        ) : (
          <p className="st-small text-center">잼공을 여는 중…</p>
        )}
      </div>
    );
  }

  const streak = streakOf(data.days, today);
  const level = data.level ?? 1;
  const tabs = visibleTabs(level);
  const shown = navForLevel(nav, level);
  const segs = visibleSegments(shown.tab, level);
  // 건너뛴 시기를 뺀 은행 — 오늘의 한 판·점검은 여기서 고른다. 길과 판(문항 찾기)은 전체 은행을 쓴다.
  const scoped = withoutSkipped(bank, data.skipEras);
  const startDaily = () => setLesson({ ids: pickLevelSession(scoped, data.boxes, today, level), mode: "daily", key: Date.now() });
  const startIntro = (ids: string[]) => setLesson({ ids, mode: "intro", key: Date.now() });
  const startCheck = (target: Level) => setLesson({ ids: skipSession(scoped, data.boxes, target), mode: "check", target, key: Date.now() });
  // 빈 판은 열지 않는다 — 문항이 없으면 그대로 둔다.
  const startItems = (ids: string[]) => ids.length > 0 && setLesson({ ids, mode: "unit", key: Date.now() });
  const startAssess = () => setLesson({ ids: assessSession(scoped, data.boxes, data.checked ?? [], level), mode: "assess", key: Date.now() });
  const startUnit = (id: string) => {
    const ids = unitSession(bank, data.boxes, id, level);
    if (ids.length === 0) return;
    setUnit(null);
    setLesson({ ids, mode: "unit", key: Date.now() });
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
          scoped={scoped}
          today={today}
          streak={streak}
          onDaily={startDaily}
          onIntro={startIntro}
          onCheck={startCheck}
          onItems={startItems}
          onAssess={startAssess}
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
      {lesson && <Lesson key={lesson.key} bank={bank} ids={lesson.ids} mode={lesson.mode} target={lesson.target} onClose={closeLesson} />}
    </div>
  );
}

function Panel({
  seg,
  bank,
  scoped,
  today,
  streak,
  onDaily,
  onIntro,
  onCheck,
  onItems,
  onAssess,
  onUnit,
}: {
  seg: StudySegment;
  /** 전체 은행 — 길·근거노트·다시 볼 것. */
  bank: StudyBank;
  /** 건너뛴 시기를 뺀 은행 — 오늘·초대·점검. */
  scoped: StudyBank;
  today: string;
  streak: ReturnType<typeof streakOf>;
  onDaily: () => void;
  onIntro: (ids: string[]) => void;
  onCheck: (target: Level) => void;
  onItems: (ids: string[]) => void;
  onAssess: () => void;
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
      return <Today bank={scoped} data={data} streak={streak} today={today} onDaily={onDaily} onIntro={onIntro} onUnit={onUnit} />;
    case "path":
      return <Road bank={bank} boxes={data.boxes} level={data.level ?? 1} skip={data.skipEras ?? []} onUnit={onUnit} />;
    case "cards":
      return <Cards bank={bank} wallet={data.wallet} />;
    case "review":
      return <Review bank={bank} boxes={data.boxes} today={today} sure={data.sureMisses} />;
    case "attend":
      return <Attendance data={data} streak={streak} today={today} />;
    case "settings":
      return <Settings data={data} targets={skipTargets(scoped, data.level ?? 1)} onCheck={onCheck} />;
    case "rewards": {
      const lv = data.level ?? 1;
      return (
        <Assessment
          data={data}
          today={today}
          ready={assessReady(lv, data.checks, today)}
          poolSize={assessSession(scoped, data.boxes, data.checked ?? [], lv).length}
          onStart={onAssess}
        />
      );
    }
    case "reply":
      return <Debates bank={bank} boxes={data.boxes} onItems={onItems} />;
    case "rumors":
      return <Rumors bank={bank} boxes={data.boxes} onItems={onItems} />;
    case "explain":
      return <Explain bank={bank} boxes={data.boxes} />;
    default:
      return null;
  }
}
