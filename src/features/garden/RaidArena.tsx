"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { RaidWeedArt } from "./RaidWeedArt";
import { raidFeedback } from "./feedback";
import { AidButtons, AidChips, AidFeed, GapBand, KitRow } from "./raid/ArenaParts";
import { ALARM_LEAD, COMBO_GAP_JUICE, kitOn } from "./raid/rules";
import {
  COMBO_GAP,
  comboTier,
  RAID_GIMMICKS,
  raidRubsPerStrike,
  raidStage,
  raidSurge,
  STAGE_LINE,
  SURGE_MS,
} from "./raidPlay";
import {
  FINISHER_ORDER,
  FINISHERS,
  formatLeft,
  hash,
  josa,
  RAID_USES_PER_PERSON,
  RAID_AIDS,
  RAID_LIFE,
  raidFrenzy,
  raidGapWindow,
  raidNeed,
  raidStrikeValue,
  raidTaunt,
  type RaidAidId,
  type FinisherId,
  type RaidKind,
} from "./rules";
import { useGarden } from "./store";
import { aidActive, type CurrentRaid, type RaidState } from "./useRaid";

/**
 * 거대 잡초와 싸우는 칸 — 타격감·콤보·합동 게이지·약점·반격·필살기·함께 치는 사람들.
 *
 * ★ 화면은 손이 닿는 즉시 반응한다(한 방이 서버에 닿기 전에 -1이 뜬다). 서버가 거절하면
 *   useRaid가 남은 방을 버리고 토스트로 알린다. 합계·체력은 언제나 서버 숫자다.
 * ★ 여기서 바뀌는 것은 "몇 번 문질러야 한 방인가"와 반격·약점뿐이다. 기력 60과 빈틈의 두 배는
 *   규칙이 정한다 — 지원·포자·아이템은 손맛만 바꾼다(docs/garden-miniroom.md §7).
 * ★ 소리는 사람이 켰을 때만, 진동은 움직임 줄이기 설정이 아닐 때만(feedback.ts).
 */

const RUB_PX = 36;
/**
 * 손이 닿은 시각. 이벤트 처리기 안에서만 부른다 — 렌더 중에는 부르지 않는다.
 * (처리기가 훅에 넘겨지는 탓에 린트가 렌더 중 호출로 오해한다.)
 */
const clock = () => Date.now();
/** 반격 경고가 떠 있는 시간. 이 안에 눌러야 피한다. */
const WARN_MS = 1_600;

interface Fx {
  id: number;
  x: number;
  y: number;
  text: string;
  tone: "hit" | "weak" | "fin" | "miss" | "cut" | "info";
}

interface Pos {
  x: number;
  y: number;
}

export function RaidArena({
  raid,
  r,
  kind,
  now,
  footer,
  sporeBoost,
  say,
}: {
  raid: RaidState;
  r: CurrentRaid;
  kind: RaidKind;
  now: number;
  /** 친구 부르기 단추. */
  footer: ReactNode;
  /** 광장의 포자 여섯을 다 뽑았다 — 다음 빈틈 동안 문지르기 절반(내 손맛만). */
  sporeBoost: boolean;
  say: (text: string) => void;
}) {
  const g = RAID_GIMMICKS[kind.id];
  const spent = raid.me.uses >= RAID_USES_PER_PERSON;
  const gap = raidGapWindow(now, r.spawnedAt, r.hp);
  const frenzy = raidFrenzy(r.spawnedAt, now);
  // 지금 한 번이 세지는 값(빈틈 ×2). rub 안의 value(약점으로 문지르기가 몇으로 세나)와 다르다.
  const mult = raidStrikeValue(now, r.spawnedAt, r.hp);
  const drum = aidActive(r.aids, "drum", now);
  const torch = aidActive(r.aids, "torch", now);
  const kit = useGarden((s) => s.data?.kit);
  const juice = kit ? kitOn(kit, "juice", r.id) : false;
  const clockOn = kit ? kitOn(kit, "clock", r.id) : false;
  const finFx = useGarden((s) => s.data?.loot.fx ?? null);
  const left = Math.max(0, r.hp - r.hits);
  const stage = raidStage(r.hits, r.hp);
  const surge = raidSurge(r.hits, r.hp);

  // ── 지켜보는 동안 바뀐 것 (렌더 중 이전 값과 견준다) ──
  const [mountStage] = useState(stage);
  const [surgeSeen, setSurgeSeen] = useState(surge.count);
  const [surgeUntil, setSurgeUntil] = useState(0);
  if (surge.count !== surgeSeen) {
    setSurgeSeen(surge.count);
    if (surge.count > surgeSeen) setSurgeUntil(now + SURGE_MS);
  }
  const surging = now < surgeUntil;

  const [vines, setVines] = useState<{ stage: number; left: number }>({ stage, left: g.vines ?? 0 });
  if (vines.stage !== stage) setVines({ stage, left: g.vines ?? 0 });
  const vinesLeft = g.vines ? vines.left : 0;

  const shielded = !!g.shield && left / r.hp <= g.shield.below;
  const sporeNow = sporeBoost && Boolean(gap?.now);
  const need = raidRubsPerStrike(kind.id, r.hits, r.hp, surging || Boolean(drum) || sporeNow);
  // 우산: 다음 반격 한 번을 모두가 피한다. 가장 최근 우산 시각을 기억하고, 그 뒤 첫 반격에서 쓴다.
  const lastUmbrella = (r.aids ?? []).filter((m) => m.aid === "umbrella").reduce((t, m) => Math.max(t, m.at), 0);
  const umbrellaRef = useRef({ at: lastUmbrella, used: 0 });
  const [umbrellaUsed, setUmbrellaUsed] = useState(0);
  useEffect(() => {
    umbrellaRef.current.at = lastUmbrella;
  }, [lastUmbrella]);
  const torchRef = useRef(false);
  const frenzyRef = useRef(false);
  useEffect(() => {
    torchRef.current = Boolean(torch);
    frenzyRef.current = frenzy;
  });

  // ── 손맛 상태 ──
  const rubs = useRef(0);
  const [partial, setPartial] = useState(0);
  const [hitKey, setHitKey] = useState(0);
  const [quake, setQuake] = useState<{ n: number; big: boolean }>({ n: 0, big: false });
  const [fx, setFx] = useState<Fx[]>([]);
  const fxSeq = useRef(0);
  const [combo, setCombo] = useState(0);
  const comboTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastRub = useRef(0);
  const [weak, setWeak] = useState<{ id: number; x: number; y: number; fake: boolean } | null>(null);
  const weakSeq = useRef(0);
  const [counter, setCounter] = useState<{ id: number; phase: "warn" | "stun" } | null>(null);
  const counterRef = useRef<{ id: number; phase: "warn" | "stun" } | null>(null);
  const counterSeq = useRef(0);
  const [cut, setCut] = useState<{ id: number; finisher: FinisherId; landed: number | null } | null>(null);
  const busy = useRef(false);
  const cutSeq = useRef(0);
  const [firstPulse] = useState(() => raid.pulses.at(-1)?.seq ?? 0);

  const shownCounter = spent ? null : counter;
  const stunned = shownCounter?.phase === "stun";

  useEffect(() => () => clearTimeout(comboTimer.current), []);

  const pop = (pos: Pos, text: string, tone: Fx["tone"]) => {
    const id = ++fxSeq.current;
    setFx((old) => [...old.slice(-9), { id, x: pos.x, y: pos.y, text, tone }]);
  };

  const landed = (n: number, pos: Pos, big: boolean, times = 1) => {
    setHitKey((k) => k + 1);
    setQuake((q) => ({ n: q.n + 1, big }));
    // 필살기 숫자는 컷인이 크게 그린다. 빈틈이면 ×2를 붙인다(서버가 세는 값과 같다).
    if (!big) pop(pos, times > 1 ? `-${n * times} ×${times}` : `-${n}`, "hit");
    clearTimeout(comboTimer.current);
    setCombo((c) => c + n);
    comboTimer.current = setTimeout(() => setCombo(0), juice ? COMBO_GAP_JUICE : COMBO_GAP);
  };

  const rub = (pos: Pos) => {
    if (r.phase !== "active" || spent) return;
    if (stunned) {
      pop(pos, "😵", "miss");
      return;
    }
    lastRub.current = clock();
    raidFeedback("rub");

    if (vinesLeft > 0) {
      const rest = vinesLeft - 1;
      setVines({ stage, left: rest });
      pop(pos, rest === 0 ? "덩굴을 끊었어요!" : "싹둑", "cut");
      return;
    }

    let value = 1;
    if (weak && Math.hypot(pos.x - weak.x, pos.y - weak.y) < 16) {
      if (weak.fake) {
        value = 0;
        pop(pos, `${g.weak.fake?.label ?? "가짜"}였어요!`, "miss");
      } else {
        value = g.weak.value;
        pop({ x: weak.x, y: weak.y - 8 }, `${g.weak.label}! ×${g.weak.value}`, "weak");
        raidFeedback("weak");
      }
      setWeak(null);
    }

    rubs.current += value;
    let strikes = 0;
    // 줄이 찼으면(손이 1초 규칙보다 빠르면) 문지른 것을 쥐고 있다가 다음 문지르기에 넣는다.
    while (rubs.current >= need && raid.strike()) {
      rubs.current -= need;
      strikes += 1;
    }
    rubs.current = Math.min(rubs.current, need);
    if (strikes > 0) {
      landed(strikes, pos, false, mult);
      if (value <= 1) raidFeedback("hit");
    }
    setPartial(Math.min(rubs.current, need));
  };

  // ── 약점: 잠깐 나타났다 사라진다. 문지르던 사람에게만. ──
  useEffect(() => {
    if (spent) return;
    let alive = true;
    let t: ReturnType<typeof setTimeout>;
    const show = () => {
      if (!alive) return;
      if (Date.now() - lastRub.current < 8_000) {
        // 손전등: 가짜 약점이 없다.
        const fake = !torchRef.current && !!g.weak.fake && Math.random() < g.weak.fake.ratio;
        setWeak({ id: ++weakSeq.current, x: 24 + Math.random() * 52, y: 26 + Math.random() * 44, fake });
      }
      t = setTimeout(hide, 2_600);
    };
    const hide = () => {
      if (!alive) return;
      setWeak(null);
      // 손전등이면 약점이 더 자주 뜬다.
      t = setTimeout(show, (torchRef.current ? 0.4 : 1) * (1_800 + Math.random() * 1_800));
    };
    t = setTimeout(show, 1_500);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [spent, g]);

  // ── 반격: 문지르던 사람에게 가끔. 경고 안에 누르면 피하고 덤으로 한 방. ──
  useEffect(() => {
    if (spent) return;
    let alive = true;
    let t: ReturnType<typeof setTimeout>;
    const c = g.counter;
    const schedule = () => {
      // 폭주: 반격이 잦아진다.
      t = setTimeout(fire, c.everyMs * (frenzyRef.current ? 0.6 : 1) * (0.7 + Math.random() * 0.6));
    };
    const fire = () => {
      if (!alive) return;
      if (Date.now() - lastRub.current > 6_000 || busy.current) return schedule();
      // 큰 우산: 누군가 펼친 뒤 첫 반격은 모두가 피한다.
      const u = umbrellaRef.current;
      if (u.at > u.used && Date.now() >= u.at - 2_000) {
        u.used = u.at;
        setUmbrellaUsed(u.at);
        pop({ x: 50, y: 30 }, "☂️ 우산이 막았어요!", "weak");
        raidFeedback("dodge");
        return schedule();
      }
      const id = ++counterSeq.current;
      counterRef.current = { id, phase: "warn" };
      setCounter(counterRef.current);
      raidFeedback("warn");
      t = setTimeout(() => {
        if (!alive) return;
        if (counterRef.current?.id !== id) return schedule();
        // 가죽 장갑: 한 번은 묶이지 않는다(맞는 순간 하나를 쓴다).
        if (useGarden.getState().useGlove()) {
          counterRef.current = null;
          setCounter(null);
          pop({ x: 50, y: 30 }, "🧤 장갑으로 막았어요", "weak");
          raidFeedback("dodge");
          return schedule();
        }
        counterRef.current = { id, phase: "stun" };
        setCounter(counterRef.current);
        raidFeedback("hurt");
        t = setTimeout(() => {
          if (!alive) return;
          counterRef.current = null;
          setCounter(null);
          schedule();
        }, c.stunMs);
      }, WARN_MS);
    };
    schedule();
    return () => {
      alive = false;
      clearTimeout(t);
      counterRef.current = null;
    };
  }, [spent, g]);

  const dodge = () => {
    if (counterRef.current?.phase !== "warn") return;
    counterRef.current = null;
    setCounter(null);
    raidFeedback("dodge");
    pop({ x: 50, y: 30 }, "회피! 덤으로 한 방", "weak");
    if (raid.strike()) landed(1, { x: 50, y: 50 }, false, mult);
  };

  // ── 자명종: 켠 물결 동안 다음 빈틈 1분 전에 울린다(탭이 열려 있을 때) ──
  const chimeFor = gap && !gap.now && gap.start - now <= ALARM_LEAD && gap.start > now ? gap.start : null;
  const chimed = useRef(0);
  useEffect(() => {
    if (!clockOn || chimeFor === null || chimed.current === chimeFor) return;
    chimed.current = chimeFor;
    raidFeedback("warn");
    say("⏰ 1분 뒤 빈틈이에요! 모여서 쳐요");
  }, [clockOn, chimeFor, say]);

  // ── 지원 ──
  const [aiding, setAiding] = useState(false);
  const castAid = async (kind: RaidAidId) => {
    if (aiding) return;
    setAiding(true);
    raidFeedback("surge");
    const result = await raid.aid(kind);
    setAiding(false);
    if (result === "ok") say(`${RAID_AIDS[kind].icon} ${RAID_AIDS[kind].label} · ${RAID_AIDS[kind].effect}`);
    else if (result === "busy") say("조금 뒤에 다시 걸 수 있어요");
    else if (result === "error") say("광장에 닿지 못했어요. 잠시 뒤 다시 해 보세요");
  };

  // ── 지켜보는 동안 일어난 일의 소리 ──
  const stageRef = useRef(stage);
  useEffect(() => {
    if (stage > stageRef.current) raidFeedback("phase");
    stageRef.current = stage;
  }, [stage]);
  useEffect(() => {
    if (surgeUntil) raidFeedback("surge");
  }, [surgeUntil]);
  const lastPulse = raid.pulses.at(-1);
  useEffect(() => {
    if (lastPulse && lastPulse.seq > firstPulse) raidFeedback("ghost");
  }, [lastPulse, firstPulse]);

  // ── 필살기 ──
  const haveFinishers = useGarden((s) => s.data?.finishers.have);
  const room = RAID_USES_PER_PERSON - raid.me.uses - raid.queued;
  const unleash = async (id: FinisherId) => {
    const item = FINISHERS[id];
    if (busy.current || stunned || room < item.hits) return;
    const store = useGarden.getState();
    if (!store.spendFinisher(id)) return;
    busy.current = true;
    lastRub.current = clock();
    const cutId = ++cutSeq.current;
    setCut({ id: cutId, finisher: id, landed: null });
    raidFeedback("finisher");
    const sent = await raid.finisher(item.hits);
    if (sent.uses > 0) {
      setCut((c) => (c?.id === cutId ? { ...c, landed: sent.hits } : c));
      landed(sent.uses, { x: 50, y: 45 }, true);
    } else {
      store.refundFinisher(id);
      say("필살기가 닿지 못했어요 · 아이템은 돌려받았어요");
      setCut(null);
    }
    setTimeout(() => {
      setCut((c) => (c?.id === cutId ? null : c));
      busy.current = false;
    }, 900);
  };

  const gesture = useRubAt(rub);

  const escapeIn = r.spawnedAt !== null ? r.spawnedAt + RAID_LIFE - now : RAID_LIFE;
  const box = Math.round(196 * Math.min(1.2, 0.9 + r.hp / 3000));
  const tier = comboTier(combo);
  const together = raid.together;
  const togetherLine =
    together >= 2
      ? `⚔️ 지금 ${together}명 이상 함께 치는 중`
      : raid.meActive
        ? "지금은 나 혼자 치는 중 — 친구를 불러 주세요"
        : together === 1
          ? "⚔️ 누군가 치고 있어요 — 같이 쳐요!"
          : null;
  const pulses = raid.pulses.filter((p) => p.seq > firstPulse);
  const teamPulse = [...pulses].reverse().find((p) => p.team);

  return (
    <section
      aria-labelledby="raid"
      className={`garden-raid raid-arena mt-3 rounded-2xl px-4 py-3.5 text-white ${quake.n ? (quake.n % 2 ? "raid-quake-a" : "raid-quake-b") : ""} ${quake.big ? "is-big" : ""} ${surging ? "is-surge" : ""}`}
      style={{ background: `linear-gradient(180deg, ${kind.bg[0]}, ${kind.bg[1]})` }}
    >
      <div className="relative z-10">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[11.5px] font-semibold opacity-80">오늘 {["첫", "두", "세", "네", "다섯"][r.wave - 1] ?? r.wave} 번째 거대 잡초</p>
          <p className="shrink-0 text-[11.5px] tabular-nums opacity-90">도망까지 {formatLeft(Math.max(0, escapeIn))}</p>
        </div>
        <h3 id="raid" className="mt-0.5 text-[17px] font-black tracking-tight">😠 {josa(kind.name, "이가")} 나타났어요!</h3>
        <p className="text-[12px] opacity-85">{kind.trait} · {g.rule}</p>

        {/* 체력 — 노란 막대는 바로, 붉은 막대는 늦게 따라온다. 깎인 만큼이 눈에 보인다. */}
        <div className="raid-hp mt-2" role="progressbar" aria-label="거대 잡초 체력" aria-valuemin={0} aria-valuemax={r.hp} aria-valuenow={left}>
          <div className="raid-hp-trail" style={{ width: `${(left / r.hp) * 100}%` }} />
          <div className="raid-hp-fill" style={{ width: `${(left / r.hp) * 100}%` }} />
          {[0.75, 0.5, 0.25].map((m) => (
            <span key={m} className="raid-hp-mark" style={{ left: `${m * 100}%` }} />
          ))}
        </div>
        <p className="mt-1 flex justify-between text-[11.5px] tabular-nums opacity-90">
          <span>체력 {left.toLocaleString()}/{r.hp.toLocaleString()}</span>
          <span>함께 {r.fighters.toLocaleString()}명 · {raidNeed(r.hp).least === raidNeed(r.hp).most ? `${raidNeed(r.hp).most}명이면 잡아요` : `빈틈에 ${raidNeed(r.hp).least}명 · 아니면 ${raidNeed(r.hp).most}명`}</span>
        </p>

        {/* 합동 게이지 — 모두의 타격으로 찬다. */}
        <div className="mt-2 flex items-center gap-2 text-[11px] font-bold">
          <span className="shrink-0">{surging ? "☀️ 광장의 햇살!" : "🤝 합동 게이지"}</span>
          <div className={`raid-surge h-2 flex-1 overflow-hidden rounded-full bg-black/30 ${surging ? "is-on" : ""}`}>
            <div className="h-full" style={{ width: `${surging ? 100 : surge.fill * 100}%` }} />
          </div>
          <span className="shrink-0 tabular-nums">
            {surging ? `문지르기 절반 · ${Math.ceil((surgeUntil - now) / 1000)}초` : `${"★".repeat(surge.count)}${"☆".repeat(Math.max(0, 4 - surge.count))}`}
          </span>
        </div>

        <GapBand gap={gap} frenzy={frenzy} now={now} />
        <AidChips
          chips={[
            ...(drum ? [`🥁 응원 북 · 문지르기 절반 ${Math.ceil((drum.at + RAID_AIDS.drum.ms - now) / 1000)}초`] : []),
            ...(torch ? [`🔦 손전등 · 가짜 약점 없음 ${Math.ceil((torch.at + RAID_AIDS.torch.ms - now) / 1000)}초`] : []),
            ...(lastUmbrella > umbrellaUsed ? ["☂️ 우산 · 다음 반격을 모두 피해요"] : []),
            ...(sporeNow ? ["🍄 포자를 다 뽑았어요 · 이번 빈틈 문지르기 절반"] : sporeBoost ? ["🍄 포자 보너스 · 다음 빈틈에 문지르기 절반"] : []),
          ]}
        />
        <AidFeed aids={r.aids ?? []} now={now} />
        {togetherLine && (
          <p className={`raid-together mt-2 rounded-full px-3 py-1 text-center text-[12px] font-bold ${together >= 2 ? "is-team" : ""}`} aria-live="polite">
            {togetherLine}
          </p>
        )}
      </div>

      <p className="garden-raid-taunt relative mx-auto mt-3 w-fit max-w-full rounded-2xl bg-white px-3 py-1.5 text-center text-[12.5px] font-bold text-[#2a1a1a]" aria-live="polite">
        &ldquo;{raidTaunt(kind, r.hits, r.hp)}&rdquo;
      </p>

      <div className="relative mx-auto mt-2" style={{ width: box, height: box }}>
        <button
          type="button"
          aria-label={spent ? "이번 거대 잡초에 기력을 다 썼어요 — 아래 지원으로 도울 수 있어요" : `${kind.name} 때리기 (체력 ${left} 남음)`}
          aria-disabled={spent}
          className={`raid-target relative grid h-full w-full touch-none select-none place-items-center overflow-visible rounded-2xl ${spent ? "opacity-60" : ""} ${stunned ? "is-stunned" : ""}`}
          {...gesture}
        >
          <span key={`g${lastPulse?.seq ?? 0}`} className={`raid-jolt-wrap ${lastPulse && lastPulse.seq > firstPulse ? "raid-jolt" : ""}`}>
            <span key={hitKey} className={`garden-weed-body garden-raid-weed raid-body relative ${hitKey ? "raid-hit" : ""}`}>
              <span className={`garden-raid-menace is-${kind.id} raid-stage-${stage}`}>
                <RaidWeedArt kind={kind.id} />
                <StageMarks stage={stage} />
              </span>
            </span>
          </span>
          {shielded && <span className="raid-shield" aria-hidden="true">🛡️</span>}
          {vinesLeft > 0 && <Vines left={vinesLeft} total={g.vines ?? 1} />}
          {weak && !spent && vinesLeft === 0 && (
            <span
              key={weak.id}
              className={`raid-weak ${weak.fake ? "is-fake" : ""}`}
              style={{ left: `${weak.x}%`, top: `${weak.y}%` }}
              aria-hidden="true"
            >
              <span>{weak.fake ? g.weak.fake?.icon : g.weak.icon}</span>
              <small>{weak.fake ? g.weak.fake?.label : g.weak.label}</small>
            </span>
          )}
          {(partial > 0 || raid.queued > 0) && !spent && (
            <span className="pointer-events-none absolute bottom-1 h-1.5 w-2/3 overflow-hidden rounded-full bg-black/30">
              <span className="block h-full bg-white" style={{ width: `${(partial / need) * 100}%` }} />
            </span>
          )}
        </button>

        {/* 다른 사람의 주먹 — 칸 합계가 오를 때마다. */}
        <span className="pointer-events-none absolute inset-0" aria-hidden="true">
          {pulses.map((p) =>
            Array.from({ length: Math.min(4, p.count) }, (_, i) => {
              const h = hash(`${p.seq}:${i}`);
              return (
                <span
                  key={`${p.seq}-${i}`}
                  className="raid-ghost"
                  style={{ left: `${15 + (h % 70)}%`, top: `${18 + ((h >> 8) % 60)}%`, animationDelay: `${i * 90}ms`, ["--hue" as string]: `${h % 360}` }}
                >
                  ✊<b>-1</b>
                </span>
              );
            }),
          )}
          {fx.map((f) => (
            <span key={f.id} className={`raid-fx is-${f.tone}`} style={{ left: `${f.x}%`, top: `${f.y}%` }}>
              {f.text}
            </span>
          ))}
          {fx.length > 0 && fx.at(-1)!.tone !== "info" && <span key={`ring${fx.at(-1)!.id}`} className="raid-ring" style={{ left: `${fx.at(-1)!.x}%`, top: `${fx.at(-1)!.y}%` }} />}
        </span>

        {combo >= 2 && (
          <span key={combo} className={`raid-combo tier-${tier}`} aria-hidden="true">
            {combo}<small>COMBO</small>
          </span>
        )}

        {stage > mountStage && (
          <span key={`stage${stage}`} className="raid-banner is-stage" aria-hidden="true">
            {josa(kind.name, "이가")} {STAGE_LINE[stage]}
          </span>
        )}
        {teamPulse && (
          <span key={`team${teamPulse.seq}`} className="raid-banner is-team" aria-hidden="true">
            🔥 합동 공격!
          </span>
        )}
        {surging && (
          <span key={`surge${surgeUntil}`} className="raid-banner is-surge" aria-hidden="true">
            ☀️ 광장의 햇살! 모두 힘이 나요
          </span>
        )}

        {shownCounter?.phase === "warn" && (
          <div className="raid-counter is-warn" role="alert">
            <span className="raid-counter-icon">{g.counter.icon}</span>
            <p>{josa(kind.name, "이가")} {g.counter.warn}</p>
            <button type="button" onClick={dodge} className="raid-dodge">
              {g.counter.dodge}!
            </button>
            <span className="raid-counter-timer" style={{ animationDuration: `${WARN_MS}ms` }} />
          </div>
        )}
        {stunned && (
          <div className="raid-counter is-stun" role="status">
            <span className="raid-counter-icon">😵</span>
            <p>{g.counter.hurt}</p>
            <span className="raid-counter-timer" style={{ animationDuration: `${g.counter.stunMs}ms` }} />
          </div>
        )}

        {cut && (
          <div key={cut.id} className="raid-cutin" aria-live="assertive">
            <div className="raid-cutin-band">
              <span className="raid-cutin-icon">{finFx === "fx-petal" ? "🌸" : finFx === "fx-star" ? "🌟" : FINISHERS[cut.finisher].icon}</span>
              <span className="raid-cutin-shout">{FINISHERS[cut.finisher].shout}</span>
            </div>
            <span className={`raid-cutin-burst b0 ${finFx ? `is-${finFx}` : ""}`} />
            <span className={`raid-cutin-burst b1 ${finFx ? `is-${finFx}` : ""}`} />
            <span className={`raid-cutin-burst b2 ${finFx ? `is-${finFx}` : ""}`} />
            {cut.landed !== null && <span className="raid-cutin-dmg">-{cut.landed}</span>}
          </div>
        )}
      </div>

      {/* 필살기 — 내 몫 안에서 여러 방을 한 번에. */}
      {!spent && (
        <div className="mt-2">
          <div className="grid grid-cols-3 gap-1.5">
            {FINISHER_ORDER.map((id) => {
              const item = FINISHERS[id];
              const have = haveFinishers?.[id] ?? 0;
              const short = room < item.hits;
              return (
                <button
                  key={id}
                  type="button"
                  disabled={have <= 0 || short || stunned || !!cut}
                  onClick={() => void unleash(id)}
                  className="raid-finisher rounded-xl px-1.5 py-1.5 text-center disabled:opacity-40"
                  aria-label={`${item.label} — 기력 ${item.hits}번 한꺼번에, 가진 것 ${have}개`}
                >
                  <span className="block text-[20px] leading-none">{item.icon}</span>
                  <span className="mt-0.5 block text-[10.5px] font-bold leading-tight">{item.label}</span>
                  <span className="block text-[10px] tabular-nums opacity-85">
                    {item.hits * mult}{mult > 1 ? "(×2)" : ""} · {have}개{short && have > 0 ? " · 기력 부족" : ""}
                  </span>
                </button>
              );
            })}
          </div>
          {!FINISHER_ORDER.some((id) => (haveFinishers?.[id] ?? 0) > 0) && (
            <p className="mt-1 text-center text-[11px] opacity-80">🛒 필살기는 아래 ‘도구 사기’나 상점 탭에서 잼으로 살 수 있어요</p>
          )}
        </div>
      )}

      <div className="mt-2" aria-label={`기력 ${RAID_USES_PER_PERSON - raid.me.uses}/${RAID_USES_PER_PERSON} 남음, 넣은 값 ${raid.me.hits}`}>
        <div className="flex justify-between text-[11.5px] font-semibold tabular-nums">
          <span>⚡ 기력</span>
          <span>
            {RAID_USES_PER_PERSON - raid.me.uses}/{RAID_USES_PER_PERSON} 남음 · 넣은 값 {raid.me.hits}
          </span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/30">
          <div className="h-full bg-white/85" style={{ width: `${((RAID_USES_PER_PERSON - raid.me.uses) / RAID_USES_PER_PERSON) * 100}%` }} />
        </div>
      </div>
      {spent && (
        <p className="mt-2 rounded-xl bg-black/25 px-3 py-2 text-[12px] font-semibold">
          💪 기력을 다 썼어요. 이제 지원으로 도와요 — 혼자서는 쓰러뜨릴 수 없으니 친구에게도 광장을 알려 주세요!
        </p>
      )}
      <AidButtons raidId={r.id} aidAt={raid.me.aidAt} now={now} disabled={aiding || r.phase !== "active"} onAid={(k) => void castAid(k)} />
      <KitRow raidId={r.id} gapAt={gap && !gap.now ? gap.start : gap ? gap.start + 30 * 60_000 : null} now={now} say={say} />
      {footer}
    </section>
  );
}

/** 단계마다 몸에 금이 가고, 마지막에는 별이 돈다. */
function StageMarks({ stage }: { stage: number }) {
  if (stage === 0) return null;
  return (
    <svg viewBox="0 0 120 120" className="raid-marks" aria-hidden="true">
      <path d="M44 52l6 7-4 6 7 5" stroke="#1d1208" strokeWidth="2" fill="none" strokeLinecap="round" />
      {stage >= 2 && <path d="M78 66l-5 6 6 4-3 8M58 86l4-6 5 3" stroke="#1d1208" strokeWidth="2" fill="none" strokeLinecap="round" />}
      {stage >= 2 && <path d="M86 40q3 6 0 9q-3-3 0-9Z" fill="#9fd4ff" stroke="#1d1208" strokeWidth=".8" />}
      {stage >= 3 && (
        <g className="raid-dizzy">
          <text x="38" y="26" fontSize="12">✦</text>
          <text x="70" y="20" fontSize="10">✦</text>
          <text x="54" y="14" fontSize="9">✦</text>
        </g>
      )}
    </svg>
  );
}

/** 땅투기 칡의 덩굴. 끊을수록 옅어진다. */
function Vines({ left, total }: { left: number; total: number }) {
  return (
    <span className="raid-vines" style={{ opacity: 0.35 + (left / total) * 0.65 }} aria-hidden="true">
      <svg viewBox="0 0 120 120">
        <path d="M10 30q30 20 50 0t50 10M6 70q36-18 56 4t54-6M14 104q30-20 48-4t48-8" stroke="#3f6b1d" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M10 30q30 20 50 0t50 10M6 70q36-18 56 4t54-6M14 104q30-20 48-4t48-8" stroke="#7fb03a" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
      <b>덩굴 {left}</b>
    </span>
  );
}

/**
 * 문지르기·두드리기에 손이 닿은 자리(칸 안 %)를 함께 준다. 키보드는 가운데.
 * 드래그로 이미 센 것은 뒤따르는 click에서 다시 세지 않는다(PlazaView의 useRub와 같다).
 */
function useRubAt(rub: (pos: Pos) => void) {
  const last = useRef<{ x: number; y: number; dist: number } | null>(null);
  const at = (e: React.MouseEvent | React.PointerEvent): Pos => {
    const box = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (!box.width || !box.height) return { x: 50, y: 50 };
    return {
      x: Math.max(0, Math.min(100, ((e.clientX - box.left) / box.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - box.top) / box.height) * 100)),
    };
  };
  return {
    onClick: (e: React.MouseEvent) => {
      if (e.detail === 0) rub({ x: 50, y: 50 });
      else if (!last.current || last.current.dist < RUB_PX) rub(at(e));
    },
    onPointerDown: (e: React.PointerEvent) => {
      last.current = { x: e.clientX, y: e.clientY, dist: 0 };
    },
    onPointerMove: (e: React.PointerEvent) => {
      const l = last.current;
      if (!l || e.buttons === 0) return;
      const d = Math.hypot(e.clientX - l.x, e.clientY - l.y);
      l.x = e.clientX;
      l.y = e.clientY;
      l.dist += d;
      if (Math.floor(l.dist / RUB_PX) > Math.floor((l.dist - d) / RUB_PX)) rub(at(e));
    },
  };
}
