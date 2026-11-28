"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { track } from "@/lib/analytics";

import Link from "next/link";

import { EvidenceCardView } from "./EvidenceCardView";
import { flushStudy } from "./flush";
import { markFromStudy } from "./fromStudy";
import { GoalGift } from "./GoalGift";
import { Jamtongi } from "./Jamtongi";
import { kstDay, PAN_MIN, stepDone } from "./rules";
import { useStudy } from "./store";
import { SKIP_PASS } from "./levels";
import { savedSay, saveSay } from "./sayStore";
import { SPEECH_ROLE_LABEL, STEPS, type Level, type SpeechRole, type StudyBank, type StudyItem } from "./types";

/** 3단계부터: 답과 함께 확신도를 고르고, 모르면 「잘 모르겠어요」(docs/jamgong-roadmap.md §5.2). */
function Confidence({
  picked,
  conf,
  checked,
  onConf,
  onUnknown,
}: {
  picked: boolean | number | null;
  conf: "sure" | "maybe";
  checked: boolean;
  onConf: (c: "sure" | "maybe") => void;
  onUnknown: () => void;
}) {
  if (checked) return null;
  return (
    <div className="grid gap-2 pt-1">
      <div className="flex items-center gap-2 text-[12.5px]">
        <span className="st-small">얼마나 확신해요?</span>
        {(["sure", "maybe"] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={conf === c}
            onClick={() => onConf(c)}
            className={`rounded-full border px-3 py-1 font-bold ${conf === c ? "border-[var(--s-ink)] bg-[var(--s-ink)] text-[var(--s-paper)]" : "border-[var(--s-line)]"}`}
          >
            {c === "sure" ? "확실해요" : "아마요"}
          </button>
        ))}
      </div>
      <button type="button" className="st-opt" aria-pressed={picked === -1} onClick={onUnknown}>
        <b>잘 모르겠어요</b>
        <span>모르는 걸 모른다고 하는 것도 판단력이에요</span>
      </button>
    </div>
  );
}

/**
 * 한 판 — 문항을 하나씩 풀고, 바로 풀이(근거 claim으로 쓴 것)와 원문 링크를 본다. 설계는 docs/daily-study.md §4.3·§8.6.
 *
 * ★ 틀려도 막히지 않는다(목숨 없음). 틀린 문항은 판 끝에 한 번 더 나오되, 그 두 번째 답은 상자에 적지 않는다 —
 *   방금 본 풀이를 맞힌 것이지 익힌 것이 아니다.
 * ★ 틀리면 붉게 혼내지 않는다. 호박색으로 "같이 볼까요?" — 풀이가 주인공이다.
 */

/** 문항 머리의 기술 이름(docs/jamgong-roadmap.md §3 표). */
const SKILL_LABEL: Partial<Record<StudyItem["skill"], string>> = {
  A0: "O/X · 알기",
  A1: "가리기 · 사실과 주장",
  A3: "가리기 · 숫자 읽기",
  A2: "따지기 · 확인 수준",
  A4: "따지기 · 자료의 무게",
  B1: "따지기 · 비약 찾기",
  B2: "따지기 · 제목과 근거",
  C2: "도는 말 · 판정",
  C1: "답하기 · 쟁점에 답하기",
  C3: "답하기 · 약점 먼저 말하기",
  C4: "말하기 · 내 말로 답하기",
  B3: "말하기 · 말의 뼈대",
};

/** 말의 뼈대 — 늘 같은 순서. */
const ROLES: SpeechRole[] = ["claim", "reason", "example"];

/**
 * 내 말로 답하기의 네 칸 점검표(docs/jamgong-roadmap.md R6). 모범 답과 견주며 스스로 짚는다 — AI가 채점하지 않는다.
 * 셋 이상이면 익힌 것으로 센다(SAY_PASS).
 */
const SAY_CHECKS = [
  "맞는 부분은 먼저 인정했어요(인정할 게 없으면 체크)",
  "근거를 하나 이상 댔어요",
  "근거보다 세게 말하지 않았어요",
  "30초 안에 끝날 만큼 짧고 분명했어요",
];
const SAY_PASS = 3;

interface Turn {
  id: string;
  retry: boolean;
}

export function Lesson({
  bank,
  ids,
  mode,
  target,
  onClose,
}: {
  bank: StudyBank;
  ids: string[];
  mode: "daily" | "unit" | "intro" | "check" | "assess";
  /** 건너뛰기 점검이면 열 단계. */
  target?: Level;
  onClose: () => void;
}) {
  const byId = useMemo(() => new Map(bank.items.map((i) => [i.id, i])), [bank]);
  const unitOf = useMemo(() => new Map(bank.units.map((u) => [u.id, u])), [bank]);
  const [queue, setQueue] = useState<Turn[]>(() => ids.filter((id) => byId.has(id)).map((id) => ({ id, retry: false })));
  const [at, setAt] = useState(0);
  /** O/X면 true·false, 보기 문항이면 보기 번호. */
  const [picked, setPicked] = useState<boolean | number | null>(null);
  /** 쟁점 문항의 ① 답의 뼈대. picked는 ② 근거. */
  const [skel, setSkel] = useState<number | null>(null);
  /** 3단계부터: 얼마나 확신하는지(docs/jamgong-roadmap.md §5.2). 「잘 모르겠어요」는 picked = -1. */
  const [conf, setConf] = useState<"sure" | "maybe">("maybe");
  /** 말의 뼈대 — 문장마다 고른 역할(ROLES의 번호). */
  const [roles, setRoles] = useState<Array<number | null>>([]);
  /** 내 말로 답하기 — 쓴 글, 모범 답을 열었는지, 점검표. */
  const [text, setText] = useState("");
  const [said, setSaid] = useState(false);
  const [ticks, setTicks] = useState<boolean[]>([false, false, false, false]);
  /** 실력 점검: 기술 → [맞힘, 문항 수]. */
  const [tally, setTally] = useState<Record<string, [number, number]>>({});
  const [checked, setChecked] = useState(false);
  const [right, setRight] = useState(0);
  const [combo, setCombo] = useState(0);
  const [earned, setEarned] = useState<StudyItem[]>([]);
  const [doneToday, setDoneToday] = useState<number | null>(null);
  const goal = useStudy((s) => s.data?.goal ?? 1);
  const walletBefore = useRef(new Set(useStudy.getState().data?.wallet ?? []));
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const [firstTurns] = useState(() => ids.filter((id) => byId.has(id)).length);
  /** 이 판을 하루 판 수에 세는가 — 한두 문제짜리 연습은 세지 않는다(rules.ts PAN_MIN). */
  const counts = mode !== "unit" || firstTurns >= PAN_MIN;
  const finished = at >= queue.length;
  const turn = queue[at];
  const item = turn ? byId.get(turn.id)! : null;
  const isRight = (it: StudyItem, p: boolean | number | null) =>
    it.kind === "say"
      ? ticks.filter(Boolean).length >= SAY_PASS
      : it.kind === "parts" && it.parts
        ? it.parts.sentences.every((x, k) => roles[k] === ROLES.indexOf(x.role))
        : it.kind === "debate" && it.debate
          ? skel === it.debate.skeleton.correct && p === it.debate.evidence.correct
          : it.kind === "choice" && it.choice
            ? p === it.choice.correct
            : p === it.answer;
  const ok = item !== null && checked && isRight(item, picked);
  /** 말의 뼈대 — 문장마다 역할을 다 골랐나. */
  const partsReady = item?.kind === "parts" && roles.length === (item.parts?.sentences.length ?? -1) && roles.every((x) => x !== null);

  const check = () => {
    if (!item || (picked === null && !partsReady)) return;
    setChecked(true);
    const correct = isRight(item, picked);
    if (mode === "assess") {
      // 실력 점검은 상자에 적지 않는다 — 처음 보는 문장으로 잰 기록만 남긴다.
      setTally((t) => ({ ...t, [item.skill]: [(t[item.skill]?.[0] ?? 0) + (correct ? 1 : 0), (t[item.skill]?.[1] ?? 0) + 1] }));
      if (correct) setRight((n) => n + 1);
      return;
    }
    if (item.kind === "say") saveSay(item.id, text, dayNow);
    if (!correct && conf === "sure" && picked !== -1) useStudy.getState().markSure(item.id);
    if (!turn.retry) {
      useStudy.getState().answer(item.id, correct, item.card !== null);
      if (correct) {
        setRight((n) => n + 1);
        if (item.card && !walletBefore.current.has(item.id)) setEarned((e) => [...e, item]);
      }
    }
    setCombo((c) => (correct ? c + 1 : 0));
    // 내 말로 답하기는 스스로 견준 것이라 판 끝에 다시 내지 않는다 — 다음에 상자가 다시 부른다.
    if (!correct && !turn.retry && item.kind !== "say") setQueue((q) => [...q, { id: item.id, retry: true }]);
  };

  const next = () => {
    if (mode === "assess" && at + 1 >= queue.length && doneToday === null) {
      useStudy.getState().recordCheck({ day: dayNow, right, total: queue.length, skills: tally }, queue.map((t) => t.id));
      track("study_assess", { right, total: queue.length });
      setDoneToday(0);
    } else if (at + 1 >= queue.length && doneToday === null) {
      setDoneToday(counts ? useStudy.getState().finish() : (useStudy.getState().data?.days[dayNow] ?? 0));
      if (mode === "check" && target && right >= SKIP_PASS) useStudy.getState().levelUp(target);
      track("study_finish", { size: firstTurns, right, mode });
    }
    setAt((n) => n + 1);
    setPicked(null);
    setSkel(null);
    setConf("maybe");
    setRoles([]);
    setText("");
    setSaid(false);
    setTicks([false, false, false, false]);
    setChecked(false);
  };

  // 판 끝 「좋아요」 — 오늘 목표를 채웠는데 정원 선물을 받으러 가지 않았으면 한 번 묻는다.
  const [askLeave, setAskLeave] = useState(false);
  const [dayNow] = useState(() => kstDay(Date.now()));
  const perkDay = useStudy((s) => s.data?.perkDay);
  const leave = () => {
    const goalMet = doneToday !== null && doneToday >= goal;
    if (mode !== "intro" && goalMet && perkDay !== dayNow && !askLeave) {
      setAskLeave(true);
      return;
    }
    onClose();
  };

  const pct = Math.round(((at + (checked ? 1 : 0)) / Math.max(1, queue.length)) * 100);

  return (
    <div ref={root} tabIndex={-1} role="dialog" aria-modal="true" aria-label="잼공 한 판" className="st-lesson">
      <div className="st-lesson-col">
        <div className="st-lesson-top">
          <button type="button" className="x" onClick={onClose} aria-label={finished ? "닫기" : "그만두기"}>
            ✕
          </button>
          <div className="st-progress" role="progressbar" aria-valuenow={finished ? 100 : pct} aria-valuemin={0} aria-valuemax={100}>
            <i style={{ width: `${finished ? 100 : pct}%` }} />
          </div>
          <span className="st-combo" aria-live="polite">{combo >= 2 && !finished ? `🔥${combo}` : ""}</span>
        </div>

        {finished ? (
          <>
            <div className="st-lesson-body items-center text-center">
              <Jamtongi mood="cheer" size={92} hop />
              {mode === "assess" ? (
                <AssessResult right={right} total={queue.length} tally={tally} />
              ) : (
              <>
              <p className="st-h text-[22px]">
                {mode === "intro"
                  ? "오늘은 여기까지! 잘했어요"
                  : mode === "check" && target
                    ? right >= SKIP_PASS
                      ? `통과! ${target}단계 「${STEPS.find((x) => x.level === target)?.label}」를 열었어요`
                      : `${firstTurns}문제 가운데 ${right}개 — 조금만 더 해 봐요`
                    : counts
                      ? "한 판 끝!"
                      : "연습 끝!"}
              </p>
              <p className="st-small">
                {firstTurns}문제 가운데 {right}개를 바로 맞혔어요.
                {right < firstTurns ? " 틀린 건 「근거노트 › 다시 볼 것」에 들어갔어요." : ""}
              </p>
              {counts ? (
                <div className="st-reward">
                  <span>🫙 오늘 도장</span>
                  {mode !== "intro" && doneToday !== null && <span>{doneToday >= goal ? "🎯 오늘 목표 채움" : `오늘 ${doneToday}/${goal}판`}</span>}
                </div>
              ) : (
                <p className="st-small">{PAN_MIN}문제보다 짧은 연습은 하루 판 수에 세지 않아요. 푼 문제는 복습 일정에 들어갔어요.</p>
              )}
              {mode === "intro" ? (
                // 첫날에는 정원·목표 이야기를 꺼내지 않는다(docs/jamgong-roadmap.md §4). 모은 카드와 "내일"만.
                <p className="st-small">모은 근거 카드는 「근거노트」에 있어요. 내일 또 와요 — 잊을 때쯤 다시 물어볼게요.</p>
              ) : (
                <GardenPerks bank={bank} ids={ids} goalMet={doneToday !== null && doneToday >= goal} />
              )}
              </>
              )}
              {earned.length > 0 && (
                <div className="grid w-full gap-2 text-left">
                  <p className="st-eyebrow">근거노트에 새로 들어간 카드</p>
                  {earned.map((i) => (
                    <EvidenceCardView key={i.id} item={i} unitTitle={unitOf.get(i.unit)?.title ?? ""} />
                  ))}
                </div>
              )}
            </div>
            <div className="st-foot">
              <button type="button" className="st-btn st-btn-jam" onClick={leave}>
                좋아요
              </button>
            </div>
            {askLeave && (
              <div className="st-confirm" role="dialog" aria-modal="true" aria-label="정원 선물을 아직 안 받았어요">
                <div>
                  <div className="flex items-end gap-2.5">
                    <Jamtongi mood="think" size={44} />
                    <p className="st-bubble">
                      <b>정원 선물을 아직 안 받았어요!</b> 잼 30과 슬롯머신 무료 한 번은 오늘이 지나면 받을 수 없어요.
                    </p>
                  </div>
                  <GoalGift today={dayNow} compact />
                  <button type="button" className="st-btn st-btn-line w-full" onClick={onClose}>
                    받지 않고 닫기
                  </button>
                  <p className="st-small text-center">오늘 안에는 교실 화면에서도 받을 수 있어요.</p>
                </div>
              </div>
            )}
          </>
        ) : item ? (
          <>
            <div className="st-lesson-body">
              <p className="st-small font-bold">
                {SKILL_LABEL[item.skill] ?? "O/X · 알기"} · {unitOf.get(item.unit)?.title}
                {turn.retry ? " · 한 번 더" : ""}
              </p>
              {item.choice?.prompt && <p className="st-small">{item.choice.prompt}</p>}
              {(item.kind === "ox" || item.kind === "choice" || item.kind === "parts") && <p className={item.kind === "parts" ? "st-small font-bold" : "st-q"}>{item.kind === "choice" && item.skill === "A1" ? `“${item.statement}”` : item.statement}</p>}
              {item.choice?.from && <p className="st-small">— {item.choice.from}에서</p>}
              {item.choice?.evidence && (
                <div className="rounded-xl border border-[var(--s-line)] bg-[var(--s-paper)] px-3 py-2 text-[13px] leading-relaxed">
                  <span className="st-eyebrow block">근거(원자료를 정리한 문장)</span>
                  {item.choice.evidence}
                </div>
              )}
              {item.kind === "say" && item.say ? (
                <SayQuestion
                  key={`${item.id}-${at}`}
                  item={item}
                  text={text}
                  said={said}
                  ticks={ticks}
                  checked={checked}
                  onText={setText}
                  onTick={(k) => setTicks((t) => t.map((v, i) => (i === k ? !v : v)))}
                />
              ) : item.kind === "parts" && item.parts ? (
                <PartsQuestion
                  key={`${item.id}-${at}`}
                  item={item}
                  roles={roles}
                  checked={checked}
                  onRole={(k, r) => setRoles((prev) => item.parts!.sentences.map((_, i) => (i === k ? r : (prev[i] ?? null))))}
                />
              ) : item.kind === "debate" && item.debate ? (
                <DebateQuestion item={item} skel={skel} ev={typeof picked === "number" ? picked : null} checked={checked} onSkel={setSkel} onEv={setPicked} />
              ) : item.kind === "choice" && item.choice ? (
                <div className="grid gap-2" role="group" aria-label="답 고르기">
                  {item.choice.options.map((o, k) => {
                    const cls = checked ? (k === item.choice!.correct ? "right" : k === picked ? "wrong" : "") : "";
                    return (
                      <button
                        key={o.label}
                        type="button"
                        className={`st-opt ${cls}`}
                        disabled={checked}
                        aria-pressed={picked === k}
                        onClick={() => setPicked(k)}
                      >
                        <b>{o.label}</b>
                        <span>{o.hint}</span>
                      </button>
                    );
                  })}
                  {item.step === "source" && (
                    <Confidence picked={picked} conf={conf} checked={checked} onConf={setConf} onUnknown={() => setPicked(-1)} />
                  )}
                </div>
              ) : (
              <div className="st-ox" role="group" aria-label="답 고르기">
                {[true, false].map((yes) => {
                  const cls = checked ? (yes === item.answer ? "right" : yes === picked ? "wrong" : "") : "";
                  return (
                    <button
                      key={String(yes)}
                      type="button"
                      className={cls}
                      disabled={checked}
                      aria-pressed={picked === yes}
                      aria-label={yes ? "맞다(O)" : "아니다(X)"}
                      onClick={() => setPicked(yes)}
                    >
                      {yes ? "⭕" : "❌"}
                    </button>
                  );
                })}
              </div>
              )}
            </div>
            <div className={`st-foot ${checked ? (ok ? "good" : "hint") : ""}`} aria-live="polite">
              {checked ? (
                <>
                  <p className="st-fb-title">
                    <Jamtongi mood={ok ? "cheer" : "smile"} size={30} hop={ok} />
                    {item.kind === "say"
                      ? ok
                        ? "잘 말했어요!"
                        : "좋아요. 다음엔 빈 칸을 채워 봐요"
                      : ok
                      ? "맞았어요!"
                      : picked === -1
                        ? `모르는 걸 모른다고 했어요. 정답은 「${item.choice?.options[item.choice.correct].label}」`
                        : item.kind === "debate" || item.kind === "parts"
                        ? "같이 볼까요?"
                        : `같이 볼까요? 정답은 ${item.kind === "choice" && item.choice ? `「${item.choice.options[item.choice.correct].label}」` : item.answer ? "⭕" : "❌"}`}
                  </p>
                  {item.kind === "debate" && item.debate ? (
                    <DebateAnswer item={item} skel={skel} ev={typeof picked === "number" ? picked : null} />
                  ) : item.kind === "parts" && item.parts ? (
                    <PartsAnswer item={item} roles={roles} />
                  ) : item.kind === "say" ? (
                    <p className="text-[13.5px] leading-relaxed">
                      {ticks.filter(Boolean).length}칸을 채웠어요. {item.explain}
                    </p>
                  ) : (
                    <p className="text-[13.5px] leading-relaxed">{item.explain}</p>
                  )}
                  <a className="st-link w-fit" href={item.debate?.href ?? item.say?.href ?? item.parts?.href ?? unitOf.get(item.unit)?.href} target="_blank" rel="noopener">
                    원문 보기 — {unitOf.get(item.unit)?.title}
                  </a>
                  <button type="button" className={`st-btn ${ok ? "st-btn-ok" : "st-btn-jam"}`} onClick={next}>
                    계속
                  </button>
                </>
              ) : item.kind === "say" && !said ? (
                <button
                  type="button"
                  className="st-btn st-btn-jam"
                  onClick={() => {
                    setSaid(true);
                    setPicked(0);
                  }}
                >
                  다 말했어요 · 모범 답 보기
                </button>
              ) : (
                <button type="button" className="st-btn st-btn-jam" disabled={item.kind === "parts" ? !partsReady : picked === null || (item.kind === "debate" && skel === null)} onClick={check}>
                  {item.kind === "say" ? "점검 마치기" : "확인"}
                </button>
              )}
            </div>
            {/* 응원 말풍선은 확인 버튼 아래 — 문제와 버튼 사이를 벌리지 않는다. */}
            {!checked && (
              <div className="flex items-end gap-2.5 px-4 pt-6 pb-4">
                <Jamtongi mood="think" size={40} />
                <div className="st-bubble">근거는 언제나 원본 자료에서 와요. 틀려도 괜찮아요, 풀이를 같이 봐요.</div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

/**
 * 판 끝의 정원 선물(docs/daily-study.md §7) — 하루 목표를 채운 날의 잼과 고른 슬롯머신 무료 한 번, 알기를 마친 단원의 그 업적 씨앗.
 * 선물은 정원에서 받는다(/garden?study=오늘&spin=seed|room · ?gift=a:<slug>). 잼·무료 한 번은 하루 한 번, 씨앗은 품종마다 한 번 — 정원이 센다.
 * 정원은 받은 뒤 그 슬롯을 바로 연다.
 */
function GardenPerks({ bank, ids, goalMet }: { bank: StudyBank; ids: string[]; goalMet: boolean }) {
  // 선택자는 값 하나 — `?? {}`를 안에서 만들면 렌더마다 바뀐 것으로 본다.
  const saved = useStudy((s) => s.data?.boxes);
  const boxes = saved ?? {};
  const [today] = useState(() => kstDay(Date.now()));
  const unitIds = [...new Set(ids.map((id) => bank.items.find((i) => i.id === id)?.unit).filter((u): u is string => Boolean(u)))];
  const known = bank.units.filter((u) => unitIds.includes(u.id) && stepDone(bank.items.filter((i) => i.unit === u.id), boxes, "know")).slice(0, 2);
  if (!goalMet && known.length === 0) return null;
  return (
    <div className="grid w-full gap-2 text-left">
      {/* 하루 목표 선물은 크게(GoalGift). 작은 링크로 두었더니 그냥 지나쳤다. */}
      {goalMet && <GoalGift today={today} />}
      {known.map((u) => (
        <Link
          key={u.id}
          className="st-link"
          href={`/garden?gift=${encodeURIComponent(u.id)}`}
          onClick={() => {
            flushStudy();
            markFromStudy();
            track("study_perk", { kind: "seed" });
          }}
        >
          🌱 「{u.title}」 알기 마침 — 정원에서 그 씨앗 받기(품종마다 한 번) →
        </Link>
      ))}
    </div>
  );
}

/**
 * 쟁점 문항의 문제 쪽 — 지인 메시지, ① 답의 뼈대, ② 근거. 뼈대를 고르면 근거 고르기가 열린다.
 * "다른 이야기로 넘어간다"는 언제나 오답이다(build.ts SKELETON_OPTIONS).
 */
function DebateQuestion({
  item,
  skel,
  ev,
  checked,
  onSkel,
  onEv,
}: {
  item: StudyItem;
  skel: number | null;
  ev: number | null;
  checked: boolean;
  onSkel: (k: number) => void;
  onEv: (k: number) => void;
}) {
  const d = item.debate!;
  return (
    <div className="grid gap-3">
      <div className="flex items-end gap-2">
        <span className="text-[22px]" aria-hidden="true">💬</span>
        <p className="st-bubble">
          <span className="st-small block font-bold">지인</span>
          {d.message}
        </p>
      </div>
      <p className="st-small font-bold">① 어떻게 답할까요?</p>
      <div className="grid gap-2" role="group" aria-label="답의 뼈대 고르기">
        {d.skeleton.options.map((o, k) => {
          const cls = checked ? (k === d.skeleton.correct ? "right" : k === skel ? "wrong" : "") : "";
          return (
            <button key={o.label} type="button" className={`st-opt ${cls}`} disabled={checked} aria-pressed={skel === k} onClick={() => onSkel(k)}>
              <b>{o.label}</b>
              <span>{o.hint}</span>
            </button>
          );
        })}
      </div>
      {skel !== null && (
        <>
          <p className="st-small font-bold">② 어떤 근거를 댈까요?</p>
          <div className="grid gap-2" role="group" aria-label="근거 고르기">
            {d.evidence.options.map((label, k) => {
              const cls = checked ? (k === d.evidence.correct ? "right" : k === ev ? "wrong" : "") : "";
              return (
                <button key={label} type="button" className={`st-opt ${cls}`} disabled={checked} aria-pressed={ev === k} onClick={() => onEv(k)}>
                  <b className="text-[14px]">{label}</b>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/** 쟁점 문항의 풀이 쪽 — 뼈대와 근거가 각각 맞았는지, 왜 그 뼈대인지, 모범 답변. */
function DebateAnswer({ item, skel, ev }: { item: StudyItem; skel: number | null; ev: number | null }) {
  const d = item.debate!;
  const skelOk = skel === d.skeleton.correct;
  const evOk = ev === d.evidence.correct;
  return (
    <div className="grid gap-2 text-[13.5px] leading-relaxed">
      <p>
        {skelOk ? "✅" : "↪️"} 답의 뼈대: <b>{d.skeleton.options[d.skeleton.correct].label}</b>
        {skel === 3 && " — 다른 이야기로 넘어가면 상대는 답을 피했다고 느껴요."}
      </p>
      <p>
        {evOk ? "✅" : "↪️"} 근거: <b>{d.evidence.options[d.evidence.correct]}</b>
      </p>
      <p className="st-small">{d.skeleton.why}</p>
      <details className="rounded-xl bg-[var(--s-paper)] px-3 py-2">
        <summary className="cursor-pointer font-bold">모범 답변 보기</summary>
        <p className="mt-1">{d.response}</p>
      </details>
    </div>
  );
}

/** 기술 이름 — 실력 점검 결과에 쓴다. */
export const SKILL_NAME: Record<string, string> = {
  A0: "내용 알기",
  A1: "사실·주장 가리기",
  A2: "확인 수준",
  A3: "숫자 읽기",
  A4: "자료의 무게",
  B1: "비약 찾기",
  B2: "제목과 근거",
  C1: "쟁점에 답하기",
  C3: "약점 먼저 말하기",
  C2: "도는 말에 답하기",
  C4: "내 말로 답하기",
  B3: "말의 뼈대",
};

/** 실력 점검 결과 — 점수와 순위가 아니라 기술마다 꽃 하나(docs/jamgong-roadmap.md §5.3). */
function AssessResult({ right, total, tally }: { right: number; total: number; tally: Record<string, [number, number]> }) {
  return (
    <div className="grid w-full gap-2">
      <p className="st-h text-[22px]">실력 점검 끝!</p>
      <p className="st-small">처음 보는 문장 {total}개 가운데 {right}개를 가려냈어요. 이 기록은 나만 봐요.</p>
      <div className="grid gap-1.5 text-left">
        {Object.entries(tally).map(([skill, [r, t]]) => (
          <div key={skill} className="flex items-center justify-between rounded-xl border border-[var(--s-line)] px-3 py-2 text-[13.5px]">
            <span>{SKILL_NAME[skill] ?? skill}</span>
            <span aria-label={`${t}개 가운데 ${r}개`}>{r === t ? "🌸" : r * 2 >= t ? "🌿" : "🌱"} {r}/{t}</span>
          </div>
        ))}
      </div>
      <p className="st-small">4주 뒤 다시 재면 어디가 자랐는지 보여 드려요.</p>
    </div>
  );
}

/**
 * 내 말로 답하기 — 지인 메시지에 보기 없이 답한다. 쓰거나 소리 내어 말한 뒤 모범 답을 열고, 네 칸으로 스스로 견준다.
 * 쓴 글은 이 기기에만 남는다(sayStore.ts). 지난번 쓴 글이 있으면 접어서 보여 준다.
 */
function SayQuestion({
  item,
  text,
  said,
  ticks,
  checked,
  onText,
  onTick,
}: {
  item: StudyItem;
  text: string;
  said: boolean;
  ticks: boolean[];
  checked: boolean;
  onText: (t: string) => void;
  onTick: (k: number) => void;
}) {
  const s = item.say!;
  const [before] = useState(() => savedSay(item.id));
  return (
    <div className="grid gap-3">
      <div className="flex items-end gap-2">
        <span className="text-[22px]" aria-hidden="true">💬</span>
        <p className="st-bubble">
          <span className="st-small block font-bold">지인</span>
          {s.message}
        </p>
      </div>
      <label className="grid gap-1.5">
        <span className="st-small font-bold">내 답 — 써도 되고, 소리 내어 말해도 돼요</span>
        <textarea
          className="min-h-[104px] w-full rounded-xl border border-[var(--s-line)] bg-[var(--s-paper)] px-3 py-2 text-[14.5px] leading-relaxed"
          value={text}
          disabled={said}
          maxLength={2000}
          placeholder="인정할 건 인정하고, 근거 하나를 붙여 짧게."
          onChange={(e) => onText(e.target.value)}
        />
        <span className="st-small">쓴 글은 이 기기에만 남아요. 어디에도 보내지 않아요.</span>
      </label>
      {before && !said && (
        <details className="rounded-xl bg-[var(--s-paper)] px-3 py-2 text-[13px]">
          <summary className="cursor-pointer font-bold">지난번 내 답 ({before.day})</summary>
          <p className="mt-1 whitespace-pre-wrap">{before.text}</p>
        </details>
      )}
      {said && (
        <>
          <div className="rounded-xl border border-[var(--s-line)] px-3 py-2 text-[13.5px] leading-relaxed">
            <span className="st-eyebrow block">모범 답</span>
            {s.response}
          </div>
          <p className="st-small font-bold">내 답과 견줘 봐요 — 해낸 칸에 체크</p>
          <div className="grid gap-1.5" role="group" aria-label="네 칸 점검">
            {SAY_CHECKS.map((c, k) => (
              <button key={c} type="button" className="st-opt" disabled={checked} aria-pressed={ticks[k]} onClick={() => onTick(k)}>
                <b className="text-[14px]">
                  {ticks[k] ? "☑️" : "⬜"} {c}
                </b>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** 말의 뼈대 — 문장마다 주장·근거·예시 가운데 하나를 고른다. */
function PartsQuestion({
  item,
  roles,
  checked,
  onRole,
}: {
  item: StudyItem;
  roles: Array<number | null>;
  checked: boolean;
  onRole: (k: number, r: number) => void;
}) {
  const p = item.parts!;
  return (
    <div className="grid gap-3">
      {p.sentences.map((x, k) => (
        <div key={k} className="grid gap-1.5 rounded-xl border border-[var(--s-line)] px-3 py-2">
          <p className="text-[14.5px] leading-relaxed">
            <span className="st-small mr-1 font-bold">{k + 1}</span>
            {x.text}
          </p>
          <div className="flex gap-1.5" role="group" aria-label={`${k + 1}번 문장의 역할`}>
            {ROLES.map((r, ri) => {
              const right = ROLES.indexOf(x.role);
              const cls = checked ? (ri === right ? "right" : ri === roles[k] ? "wrong" : "") : "";
              return (
                <button
                  key={r}
                  type="button"
                  disabled={checked}
                  aria-pressed={roles[k] === ri}
                  onClick={() => onRole(k, ri)}
                  className={`st-opt flex-1 !py-1.5 text-center ${cls}`}
                >
                  <b className="text-[13.5px]">{SPEECH_ROLE_LABEL[r]}</b>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <p className="st-small">주장 = 하려는 말 · 근거 = 왜 그런지 · 예시 = 보여 주는 일</p>
    </div>
  );
}

/** 말의 뼈대 풀이 — 편집자가 나눈 것임을 밝힌다. */
function PartsAnswer({ item, roles }: { item: StudyItem; roles: Array<number | null> }) {
  const p = item.parts!;
  return (
    <div className="grid gap-1.5 text-[13.5px] leading-relaxed">
      {p.sentences.map((x, k) => (
        <p key={k}>
          {roles[k] === ROLES.indexOf(x.role) ? "✅" : "↪️"} {k + 1}번은 <b>{SPEECH_ROLE_LABEL[x.role]}</b>
        </p>
      ))}
      <p>{p.why}</p>
      <p className="st-small">편집자가 나눈 것이에요. 다르게 볼 수도 있어요 — 원문 전체를 읽고 판단해요.</p>
    </div>
  );
}
