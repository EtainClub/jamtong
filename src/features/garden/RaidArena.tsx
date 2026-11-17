"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { raidFeedback } from "./feedback";
import { AidButtons, AidChips, AidFeed, GapBand, KitRow } from "./raid/ArenaParts";
import { BossRig } from "./raid/boss/BossRig";
import { Invade, MorphCut } from "./raid/BossStage";
import { RaidJam } from "./raid/Rewards";
import { RAID_JAM } from "./raid/rules";
import { FORM_CUT_MS, FORM_ORDER, FORM_SCALE, formName, nextSkillAt, raidForm, SKILL_WARN_MS, type RaidForm } from "./raid/forms";
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
  raidKey as raidLedgerKey,
  RAID_USES_PER_PERSON,
  RAID_AIDS,
  RAID_LIFE,
  RAID_POOL_LABEL,
  RAID_ROLE_MULT,
  RAID_ROLE_ORDER,
  RAID_ROLES,
  RAID_STRIKE_GAP,
  raidFrenzy,
  raidGapWindow,
  raidGauges,
  raidNeed,
  raidNeedV3,
  raidPoolValue,
  raidTaunt,
  type RaidAidId,
  type FinisherId,
  type RaidGauge,
  type RaidKind,
  type RaidPool,
  type RaidRoleId,
} from "./rules";
import { useGarden } from "./store";
import { aidActive, type CurrentRaid, type RaidState } from "./useRaid";

/**
 * 거대 잡초와 싸우는 칸 — 타격감·콤보·합동 게이지·약점·대기술·필살기·함께 치는 사람들.
 *
 * ★ 보스는 세 형태다(raid/forms.ts). 형태를 30분 안에 넘기면 쓰러지지 않고 변신한다 — 규칙이 정한다.
 *   2형은 칸을 넘어 커지고, 3형에서는 싸움터가 전체 화면 무대가 된다(나갈 수 있다).
 * ★ 게이지는 셋(체력·갑옷·울타리), 역할도 셋이다. 제 역할의 게이지에 넣으면 두 배다. 역할마다 손이 하는 일이 다르다 —
 *   낫잡이는 문지르고, 돋보기꾼은 '출처' 표적을 골라 두드리고, 울타리지기는 박자에 맞춰 막는다.
 *   어느 쪽이든 끝은 같다: 기력 한 번을 게이지 하나에 넣는다(useRaid의 strike).
 * ★ 대기술(반격)은 태어난 시각에서 정해진 때에 온다 — 모두가 같은 순간 같은 예고를 본다.
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
/** 두드림이 이만큼 이어질 때마다 피버. */
const FEVER_AT = 25;
const FEVER_MS = 6_000;
/** 울타리지기의 박자: 한 방의 간격(RAID_STRIKE_GAP)마다 한 번, 앞뒤 이만큼은 맞은 것으로 친다. */
const BEAT_SLACK = 260;
/** 돋보기꾼의 표적 가운데 가짜('카더라')의 비율. 손전등이 켜지면 없다. */
const SEEK_FAKE = 0.35;

interface Fx {
  id: number;
  x: number;
  y: number;
  text: string;
  tone: "hit" | "crit" | "weak" | "fin" | "miss" | "cut" | "info";
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
  const drum = aidActive(r.aids, "drum", now);
  const torch = aidActive(r.aids, "torch", now);
  const kit = useGarden((s) => s.data?.kit);
  const juice = kit ? kitOn(kit, "juice", r.id) : false;
  const clockOn = kit ? kitOn(kit, "clock", r.id) : false;
  const finFx = useGarden((s) => s.data?.loot.fx ?? null);
  const form = raidForm(r);
  // 이 형태의 세 게이지와 그 합(형태 전체의 진행). 단계·합동 게이지·대사·방패는 합을 본다.
  const gauges = raidGauges(r);
  const prog = { have: gauges.reduce((n, x) => n + x.have, 0), need: Math.max(1, gauges.reduce((n, x) => n + x.need, 0)) };
  const left = prog.need - prog.have;
  const stage = raidStage(prog.have, prog.need);
  const surge = raidSurge(prog.have, prog.need);
  // 역할과 넣을 게이지. 따로 고르지 않으면 제 역할의 게이지에 넣는다. 그 게이지가 다 찼으면(또는 이 형태에 없으면)
  // 아직 덜 찬 게이지로 돌린다 — 남의 일은 한 번이 1이다.
  const role = raid.role;
  const [poolPick, setPoolPick] = useState<{ form: number; pool: RaidPool } | null>(null);
  const wanted: RaidPool = !r.v3 || !role ? 0 : poolPick?.form === form ? poolPick.pool : RAID_ROLES[role].pool;
  const open = ([0, 1, 2] as const).find((i) => gauges[i].have < gauges[i].need);
  const pool: RaidPool = gauges[wanted].have < gauges[wanted].need || open === undefined ? wanted : open;
  // 지금 한 번이 세지는 값(제 역할 ×2, 빈틈 ×2). rub 안의 value(문지르기가 몇으로 세나)와 다르다.
  const mult = raidPoolValue(r, role, pool, now);
  const seeking = role === "seeker" && pool === 1;
  const warding = role === "warden" && pool === 2;
  // 약점의 생김새. 돋보기꾼에게는 늘 '출처'와 '카더라'다.
  const weakLook = seeking
    ? { real: { icon: "📎", label: "출처" }, fake: { icon: "❓", label: "카더라" } }
    : { real: { icon: g.weak.icon, label: g.weak.label }, fake: { icon: g.weak.fake?.icon ?? "❓", label: g.weak.fake?.label ?? "가짜" } };

  // ── 지켜보는 동안 바뀐 것 (렌더 중 이전 값과 견준다) ──
  const [mountStage] = useState(stage);
  // 변신: 보던 중에 형태가 오르면 컷을 띄운다. 늦게 들어온 사람은 컷 없이 그 형태로 시작한다.
  const [formSeen, setFormSeen] = useState<RaidForm>(form);
  const [morphUntil, setMorphUntil] = useState(0);
  if (form !== formSeen) {
    setFormSeen(form);
    if (form > formSeen) setMorphUntil(now + FORM_CUT_MS);
  }
  const morphing = now < morphUntil;
  // 3형의 전체 화면 무대. 나가면 이 물결 동안은 다시 저절로 열리지 않는다.
  const [stageOff, setStageOff] = useState(false);
  const staged = form === 3 && !stageOff;
  const [surgeSeen, setSurgeSeen] = useState(surge.count);
  const [surgeUntil, setSurgeUntil] = useState(0);
  if (surge.count !== surgeSeen) {
    setSurgeSeen(surge.count);
    if (surge.count > surgeSeen) setSurgeUntil(now + SURGE_MS);
  }
  const surging = now < surgeUntil;
  const [feverUntil, setFeverUntil] = useState(0);
  const fever = now < feverUntil;

  const [vines, setVines] = useState<{ stage: number; left: number }>({ stage, left: g.vines ?? 0 });
  if (vines.stage !== stage) setVines({ stage, left: g.vines ?? 0 });
  const vinesLeft = g.vines ? vines.left : 0;

  const shielded = !!g.shield && left / prog.need <= g.shield.below;
  const sporeNow = sporeBoost && Boolean(gap?.now);
  // 피버면 두드림 하나가 한 방이다(그래도 서버가 1초에 한 방만 받는다 — 남는 두드림은 다음 방으로 쌓인다).
  const need = fever ? 1 : raidRubsPerStrike(kind.id, prog.have, prog.need, surging || Boolean(drum) || sporeNow);
  // 우산: 다음 반격 한 번을 모두가 피한다. 가장 최근 우산 시각을 기억하고, 그 뒤 첫 반격에서 쓴다.
  const lastUmbrella = (r.aids ?? []).filter((m) => m.aid === "umbrella").reduce((t, m) => Math.max(t, m.at), 0);
  const umbrellaRef = useRef({ at: lastUmbrella, used: 0 });
  const [umbrellaUsed, setUmbrellaUsed] = useState(0);
  useEffect(() => {
    umbrellaRef.current.at = lastUmbrella;
  }, [lastUmbrella]);
  const torchRef = useRef(false);
  const frenzyRef = useRef(false);
  const formRef = useRef<RaidForm>(form);
  const seekRef = useRef(false);
  useEffect(() => {
    torchRef.current = Boolean(torch);
    frenzyRef.current = frenzy;
    formRef.current = form;
    seekRef.current = seeking;
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
  // 두드릴 때마다: 불꽃(그 자리)·움찔(번갈아)·콤보. 콤보가 FEVER_AT마다 피버 — 잠깐 한 번 두드림이 한 방.
  const [sparks, setSparks] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const sparkSeq = useRef(0);
  const [flinch, setFlinch] = useState(0);

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
    // 필살기 숫자는 컷인이 크게 그린다. 배수(역할·빈틈)를 붙인다 — 서버가 세는 값과 같다. ×4는 크리티컬.
    if (!big) pop({ x: pos.x, y: pos.y - 6 }, times >= 4 ? `크리티컬! -${n * times}` : times > 1 ? `-${n * times} ×${times}` : `-${n}`, times >= 4 ? "crit" : "hit");
  };

  /** 두드림 하나의 손맛 — 결과(한 방이 됐든 아니든)와 상관없이 매번. */
  const tapFeel = (pos: Pos) => {
    const id = ++sparkSeq.current;
    setSparks((old) => [...old.slice(-5), { id, x: pos.x, y: pos.y }]);
    setFlinch((f) => f + 1);
    raidFeedback("rub");
    clearTimeout(comboTimer.current);
    setCombo((c) => {
      const next = c + 1;
      if (next % FEVER_AT === 0) {
        setFeverUntil(clock() + FEVER_MS);
        raidFeedback("surge");
      }
      return next;
    });
    comboTimer.current = setTimeout(() => setCombo(0), juice ? COMBO_GAP_JUICE : COMBO_GAP);
  };

  /** 문지른 값을 쌓고, 한 방만큼 찼으면 기력을 써서 지금 게이지에 넣는다. */
  const addRubs = (value: number, pos: Pos, quiet = false) => {
    rubs.current += value;
    let strikes = 0;
    // 줄이 찼으면(손이 1초 규칙보다 빠르면) 문지른 것을 쥐고 있다가 다음 문지르기에 넣는다.
    while (rubs.current >= need && raid.strike(pool)) {
      rubs.current -= need;
      strikes += 1;
    }
    rubs.current = Math.min(rubs.current, need);
    if (strikes > 0) {
      landed(strikes, pos, false, mult);
      if (!quiet) raidFeedback("hit");
    }
    setPartial(Math.min(rubs.current, need));
  };

  /** 손이 닿아도 되는가 — 싸우는 중이고, 기력이 있고, 역할을 골랐고, 묶이지 않았다. */
  const ready = (pos: Pos): boolean => {
    if (r.phase !== "active" || spent) return false;
    if (r.v3 && !role) {
      pop(pos, "역할을 먼저 골라요", "info");
      return false;
    }
    if (stunned) {
      pop(pos, "😵", "miss");
      return false;
    }
    return true;
  };

  const rub = (pos: Pos) => {
    if (!ready(pos)) return;
    lastRub.current = clock();
    tapFeel(pos);

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
        pop(pos, `${weakLook.fake.label}였어요!`, "miss");
      } else {
        // 돋보기꾼: 진짜 표적 하나가 곧 한 방이다. 그 밖에는 문지르기 몇 번 값.
        value = seeking ? need : g.weak.value;
        pop({ x: weak.x, y: weak.y - 8 }, seeking ? `${weakLook.real.label}! 갑옷에 금` : `${weakLook.real.label}! ×${g.weak.value}`, "weak");
        raidFeedback("weak");
      }
      setWeak(null);
    }
    addRubs(value, pos, value > 1);
  };

  // 울타리지기: 박자(한 방의 간격)에 맞춰 누르면 그대로 한 방. 어긋나면 문지르기 한 번 값.
  const beat0 = useRef(0);
  useEffect(() => {
    beat0.current = clock();
  }, [warding]);
  const beat = () => {
    const pos = { x: 50, y: 78 };
    if (!ready(pos)) return;
    lastRub.current = clock();
    const into = (clock() - beat0.current) % RAID_STRIKE_GAP;
    const onBeat = into < BEAT_SLACK || into > RAID_STRIKE_GAP - BEAT_SLACK;
    if (onBeat) {
      pop(pos, "막았어요!", "weak");
      raidFeedback("dodge");
      addRubs(need, pos, true);
    } else {
      pop(pos, "박자를 맞춰요", "miss");
      raidFeedback("rub");
      addRubs(1, pos);
    }
  };

  // ── 약점: 잠깐 나타났다 사라진다. 문지르던 사람에게만. ──
  useEffect(() => {
    if (spent) return;
    let alive = true;
    let t: ReturnType<typeof setTimeout>;
    const show = () => {
      if (!alive) return;
      if (Date.now() - lastRub.current < 8_000) {
        // 손전등: 가짜 약점이 없다. 돋보기꾼에게는 종류와 상관없이 가짜('카더라')가 섞인다.
        const ratio = seekRef.current ? SEEK_FAKE : (g.weak.fake?.ratio ?? 0);
        const fake = !torchRef.current && Math.random() < ratio;
        setWeak({ id: ++weakSeq.current, x: 24 + Math.random() * 52, y: 26 + Math.random() * 44, fake });
      }
      t = setTimeout(hide, seekRef.current ? 1_700 : 2_600);
    };
    const hide = () => {
      if (!alive) return;
      setWeak(null);
      // 손전등이면 약점이 더 자주 뜬다. 돋보기꾼은 표적이 일이라 쉴 틈 없이 뜬다.
      t = setTimeout(show, seekRef.current ? 350 + Math.random() * 450 : (torchRef.current ? 0.4 : 1) * (1_800 + Math.random() * 1_800));
    };
    t = setTimeout(show, 1_500);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [spent, g]);

  // ── 대기술: 태어난 시각에서 정해진 때에 온다(raid/forms.ts) — 모두가 같은 순간 같은 예고를 본다.
  //    문지르던 사람만 맞는다. 예고 안에 누르면 피하고 덤으로 한 방. ──
  const raidKey = r.id;
  const bornAt = r.spawnedAt;
  useEffect(() => {
    if (spent || bornAt === null) return;
    let alive = true;
    let t: ReturnType<typeof setTimeout>;
    const c = g.counter;
    const schedule = () => {
      // 형태가 오르거나 폭주면 잦아진다. 지금의 형태로 다음 때를 다시 셈한다.
      const at = nextSkillAt(raidKey, formRef.current, frenzyRef.current, bornAt, Date.now());
      t = setTimeout(fire, at - Date.now());
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
      }, SKILL_WARN_MS);
    };
    schedule();
    return () => {
      alive = false;
      clearTimeout(t);
      counterRef.current = null;
    };
  }, [spent, g, raidKey, bornAt]);

  const dodge = () => {
    if (counterRef.current?.phase !== "warn") return;
    counterRef.current = null;
    setCounter(null);
    raidFeedback("dodge");
    pop({ x: 50, y: 30 }, "회피! 덤으로 한 방", "weak");
    if (raid.strike(pool)) landed(1, { x: 50, y: 50 }, false, mult);
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
    if (morphUntil) raidFeedback("morph");
  }, [morphUntil]);
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
    const sent = await raid.finisher(item.hits, pool);
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
  const box = Math.round(216 * Math.min(1.2, 0.9 + prog.need / 3000));
  const need3 = r.v3 ? raidNeedV3(r.v3.n) : raidNeed(r.hp);
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
      className={`garden-raid raid-arena mt-3 rounded-2xl px-4 py-3.5 text-white form-${form} ${staged ? "is-staged" : ""} ${fever ? "is-fever" : ""} ${quake.n ? (quake.n % 2 ? "raid-quake-a" : "raid-quake-b") : ""} ${quake.big ? "is-big" : ""} ${surging ? "is-surge" : ""}`}
      style={{ background: `linear-gradient(180deg, ${kind.bg[0]}, ${kind.bg[1]})` }}
    >
      {staged && <Invade kind={kind} />}
      {form === 3 && (
        <button type="button" onClick={() => setStageOff(!stageOff)} className="raid-stage-toggle">
          {staged ? "↙ 광장으로" : "⛶ 전체 화면 무대"}
        </button>
      )}
      <div className="relative z-10">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[11.5px] font-semibold opacity-80">오늘 {["첫", "두", "세", "네", "다섯"][r.wave - 1] ?? r.wave} 번째 거대 잡초</p>
          <p className="shrink-0 text-[11.5px] tabular-nums opacity-90">도망까지 {formatLeft(Math.max(0, escapeIn))}</p>
        </div>
        <h3 id="raid" className="mt-0.5 text-[17px] font-black tracking-tight">
          {form === 1 ? `${josa(kind.name, "이가")} 나타났어요!` : formName(kind.id, form)}
          {form > 1 && <span className="raid-form-chip">{FORM_ORDER[form]}</span>}
        </h3>
        <p className="text-[12px] opacity-85">{kind.trait} · {g.rule}</p>

        {/* 게이지 — 3.0 물결은 셋(체력·갑옷·울타리)이고 다 차야 넘어간다. 눌러서 넣을 곳을 고른다. */}
        <Gauges gauges={gauges} v3={Boolean(r.v3)} role={role} pool={pool} onPick={(next) => setPoolPick({ form, pool: next })} />
        <p className="mt-1 flex justify-between text-[11.5px] tabular-nums opacity-90">
          <span>{r.v3 ? `${FORM_ORDER[form]} · 남은 ${left.toLocaleString()}` : `체력 ${left.toLocaleString()}/${prog.need.toLocaleString()}`}</span>
          <span>함께 {r.fighters.toLocaleString()}명 · {need3.least === need3.most ? `${need3.most}명이면 잡아요` : `빈틈에 ${need3.least}명 · 아니면 ${need3.most}명`}</span>
        </p>
        {r.v3 && (
          <RaidJam raidKey={raidLedgerKey(raid.day, r.wave)} cleared={form - 1} ended={false} lastForm={raid.me.form} say={say} />
        )}
        {r.v3 && form > 1 && <RolePick role={role} canPick={raid.canPickRole} form={form} onPick={raid.pickRole} />}
        {r.v3 && form === 1 && (
          <p className="mt-2 rounded-full bg-black/25 px-3 py-1 text-center text-[12px] font-bold">
            👊 1형은 모두가 몸통을 두드려요 · 한 번 ×{RAID_ROLE_MULT} · 2형부터 역할을 골라요
          </p>
        )}

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
        &ldquo;{raidTaunt(kind, prog.have, prog.need)}&rdquo;
      </p>

      {/* 커진 몸이 위로 솟을 자리를 조금 비워 둔다. 나머지는 위의 글 뒤로 겹친다. */}
      <div className="raid-boss-box relative mx-auto mt-2" style={{ width: box, height: box, marginTop: Math.round(box * (FORM_SCALE[form] - 1) * 0.55) + 8 }}>
        <button
          type="button"
          aria-label={spent ? "이번 거대 잡초에 기력을 다 썼어요 — 아래 지원으로 도울 수 있어요" : `${kind.name} 때리기 (체력 ${left} 남음)`}
          aria-disabled={spent}
          className={`raid-target relative grid h-full w-full touch-none select-none place-items-center overflow-visible rounded-2xl ${spent ? "opacity-60" : ""} ${stunned ? "is-stunned" : ""}`}
          {...gesture}
        >
          <span key={`g${lastPulse?.seq ?? 0}`} className={`raid-jolt-wrap ${lastPulse && lastPulse.seq > firstPulse ? "raid-jolt" : ""} ${flinch ? (flinch % 2 ? "raid-flinch-a" : "raid-flinch-b") : ""}`}>
            <span key={hitKey} className={`garden-weed-body garden-raid-weed raid-body relative ${hitKey ? "raid-hit" : ""}`}>
              <span
                className={`raid-boss is-${kind.id} ${shownCounter?.phase === "warn" ? "is-casting" : ""} ${morphing ? "is-morphing" : ""} ${frenzy ? "is-frenzy" : ""}`}
                style={{ ["--boss-scale" as string]: FORM_SCALE[form] }}
              >
                <BossRig key={form} kind={kind.id} form={form} />
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
              <span>{weak.fake ? weakLook.fake.icon : weakLook.real.icon}</span>
              <small>{weak.fake ? weakLook.fake.label : weakLook.real.label}</small>
            </span>
          )}
          {/* 한 방까지 남은 두드림 — 칸 하나가 두드림 하나다. */}
          {!spent && need > 1 && need <= 8 && (
            <span className="raid-tap-meter" aria-hidden="true">
              {Array.from({ length: need }, (_, i) => (
                <span key={i} className={i < partial ? "is-on" : ""} />
              ))}
            </span>
          )}
          {sparks.map((p) => (
            <span key={p.id} className="raid-spark" style={{ left: `${p.x}%`, top: `${p.y}%` }} aria-hidden="true">
              <b />
              {[0, 60, 120, 180, 240, 300].map((a) => (
                <i key={a} style={{ ["--a" as string]: `${a + (p.id % 6) * 10}deg` }} />
              ))}
            </span>
          ))}
          {fever && <span className="raid-fever" aria-hidden="true">🔥 FEVER · 한 번에 한 방</span>}
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
            {combo}<small>HIT</small>
          </span>
        )}

        {morphing && <MorphCut key={`morph${form}`} kind={kind} form={form} prize={r.v3 ? RAID_JAM.forms[form - 2] : 0} />}
        {stage > mountStage && !morphing && (
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
            <p>{josa(formName(kind.id, form), "이가")} {g.counter.warn}</p>
            <button type="button" onClick={dodge} className="raid-dodge">
              {g.counter.dodge}!
            </button>
            <span className="raid-counter-timer" style={{ animationDuration: `${SKILL_WARN_MS}ms` }} />
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

      {/* 울타리지기의 박자 판 — 고리가 조여드는 순간 누르면 그대로 한 방이 울타리에 들어간다. */}
      {warding && !spent && r.phase === "active" && (
        <button type="button" onClick={beat} disabled={stunned} className="raid-beat mx-auto mt-3 grid place-items-center disabled:opacity-50" aria-label="박자에 맞춰 막기 — 고리가 조여들 때 누르세요">
          <span key={`ring${warding}`} className="raid-beat-ring" style={{ animationDuration: `${RAID_STRIKE_GAP}ms` }} aria-hidden="true" />
          <span className="text-[22px] leading-none">🛡️</span>
          <span className="text-[11px] font-black">막기</span>
        </button>
      )}

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
                    {item.hits * mult}{mult > 1 ? `(×${mult})` : ""} · {have}개{short && have > 0 ? " · 기력 부족" : ""}
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

const GAUGE_ICON = ["❤️", "🧱", "🛡️"] as const;

/**
 * 세 게이지. 3.0 물결에서는 눌러서 내 기력을 넣을 곳을 고른다 — 제 역할의 게이지는 ×2, 남의 게이지는 ×1.
 * 이 형태에 없는 게이지(목표 0)는 그리지 않는다. 2.0 물결은 체력 하나뿐이고 고를 것이 없다.
 */
function Gauges({ gauges, v3, role, pool, onPick }: { gauges: readonly RaidGauge[]; v3: boolean; role: RaidRoleId | null; pool: RaidPool; onPick: (pool: RaidPool) => void }) {
  return (
    <div className="mt-2 space-y-1">
      {([0, 1, 2] as const).map((i) => {
        const x = gauges[i];
        if (x.need <= 0) return null;
        const left = x.need - x.have;
        const mine = role !== null && RAID_ROLES[role].pool === i;
        const bar = (
          <div className={`raid-hp ${i === 0 ? "" : "is-thin"} is-pool-${i}`} role="progressbar" aria-label={`거대 잡초 ${RAID_POOL_LABEL[i]}`} aria-valuemin={0} aria-valuemax={x.need} aria-valuenow={left}>
            <div className="raid-hp-trail" style={{ width: `${(left / x.need) * 100}%` }} />
            <div className="raid-hp-fill" style={{ width: `${(left / x.need) * 100}%` }} />
          </div>
        );
        if (!v3) return <div key={i}>{bar}</div>;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onPick(i)}
            aria-pressed={pool === i}
            disabled={!role || left <= 0}
            className={`raid-gauge flex w-full items-center gap-2 rounded-lg px-1.5 py-1 text-left ${pool === i ? "is-on" : ""}`}
          >
            <span className="w-[74px] shrink-0 text-[11px] font-bold">
              {GAUGE_ICON[i]} {RAID_POOL_LABEL[i]}
              {role && <small className="ml-1 opacity-80">×{mine ? RAID_ROLE_MULT : 1}</small>}
            </span>
            <span className="min-w-0 flex-1">{bar}</span>
            <span className="w-[76px] shrink-0 text-right text-[11px] tabular-nums">{left <= 0 ? "다 찼어요" : `${left.toLocaleString()} 남음`}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * 역할 고르기. 형태가 시작할 때(이 형태에서 처음 치기 전)만 고르거나 바꿀 수 있다 — 규칙이 그렇다.
 * 한 번 치면 그 형태 동안은 굳는다.
 */
function RolePick({ role, canPick, form, onPick }: { role: RaidRoleId | null; canPick: boolean; form: RaidForm; onPick: (role: RaidRoleId) => void }) {
  if (!canPick) {
    if (!role) return null;
    const mine = RAID_ROLES[role];
    return (
      <p className="mt-2 rounded-full bg-black/25 px-3 py-1 text-center text-[12px] font-bold">
        {mine.icon} {mine.label} · {mine.job} <span className="opacity-75">(다음 형태에서 바꿀 수 있어요)</span>
      </p>
    );
  }
  return (
    <div className="mt-2" role="radiogroup" aria-label="역할 고르기">
      <p className="text-[11.5px] font-bold">
        {role ? `${FORM_ORDER[form]}의 역할 — 치기 전까지 바꿀 수 있어요` : "역할을 골라요 — 제 역할의 게이지에 넣으면 두 배예요"}
      </p>
      <div className="mt-1 grid grid-cols-3 gap-1.5">
        {RAID_ROLE_ORDER.map((id) => {
          const item = RAID_ROLES[id];
          return (
            <button key={id} type="button" role="radio" aria-checked={role === id} onClick={() => onPick(id)} className={`raid-role rounded-xl px-1.5 py-1.5 text-center ${role === id ? "is-on" : ""}`}>
              <span className="block text-[20px] leading-none">{item.icon}</span>
              <span className="mt-0.5 block text-[11.5px] font-black leading-tight">{item.label}</span>
              <span className="block text-[10px] leading-tight opacity-85">
                {RAID_POOL_LABEL[item.pool]} ×{RAID_ROLE_MULT}
              </span>
            </button>
          );
        })}
      </div>
      {role && <p className="mt-1 text-center text-[11px] opacity-85">{RAID_ROLES[role].job}</p>}
    </div>
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
 * 두드리기·문지르기에 손이 닿은 자리(칸 안 %)를 함께 준다. 키보드는 가운데.
 * 손가락이 닿는 순간(pointerdown) 센다 — 모바일의 click은 늦게 오고, 손이 조금만 움직여도 오지 않는다.
 * 뒤따르는 click은 세지 않는다. 문지르면 RUB_PX마다 한 번 더 센다.
 */
function useRubAt(rub: (pos: Pos) => void) {
  const last = useRef<{ x: number; y: number; dist: number } | null>(null);
  const downAt = useRef(0);
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
      // 키보드(Enter·Space)로 누른 것만 여기서 센다. 손가락·마우스는 pointerdown에서 이미 셌다.
      if (e.detail === 0 && clock() - downAt.current > 400) rub({ x: 50, y: 50 });
    },
    onPointerDown: (e: React.PointerEvent) => {
      if (e.button > 0) return;
      downAt.current = clock();
      last.current = { x: e.clientX, y: e.clientY, dist: 0 };
      rub(at(e));
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
    onPointerUp: () => {
      last.current = null;
    },
  };
}
