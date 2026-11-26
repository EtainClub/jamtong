"use client";

import Link from "next/link";
import { loadPot } from "@/lib/firebase/slot";
import { normalizeSlots, potReward } from "./slot/rules";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { track } from "@/lib/analytics";
import { cellId } from "@/lib/firebase/plaza";
import { firebaseConfigured } from "@/lib/firebase/client";
import { watchMine, watchRaidWave, type Raid, type RaidMine } from "@/lib/firebase/raid";

import { GroundDetails, WeedArt } from "./GardenArt";
import { RaidArena } from "./RaidArena";
import { RaidBell } from "./raid/RaidBell";
import { RaidJam } from "./raid/Rewards";
import { formName } from "./raid/forms";
import { RaidWeedArt } from "./RaidWeedArt";
import { LeafButton, LeafSheet } from "./LeafCheck";
import { gardenFeedback, raidFeedback } from "./feedback";
import { RollCall } from "./raid/ArenaParts";
import { boxPerennial, RAID_JAM, RAID_JAM_MAX, raidJamLines, raidLoot, raidOutcome, SPORE_AT, SPORE_COUNT, SPORE_RUBS, sporeCells, SAMPLES_PER_TROPHY, tookPart } from "./raid/rules";

import {
  fruitIcon,
  hash,
  kstDay,
  leafCell,
  leafSlot,
  pickLeaf,
  PLAZA_CELLS,
  PLAZA_LABEL,
  PLAZA_SPEED,
  formatLeft,
  RAID_BOX,
  RAID_GAP_MULT,
  RAID_USES_PER_PERSON,
  RAID_LIFE,
  RAID_PER_DAY,
  RAID_SLOTS,
  kstDayNumber,
  raidClosesAtId,
  raidEndsAt,
  raidId,
  raidPhase,
  raidSlotLabel,
  RAID_RUBS_PER_STRIKE,
  formatClock,
  josa,
  raidGapWindow,
  raidKey,
  raidKind,
  raidGauges,
  raidNeed,
  raidNeedV3,
  RAID_ROLE_MULT,
  type RaidKind,
  TIER_LABEL,
  WEED,
  WEED_REWARD_PER_DAY,
  WEED_SEED_ODDS,
} from "./rules";
import { withInvite } from "./invite";
import { sendGardenLink } from "./share";
import { useGarden } from "./store";
import type { Plaza, Weed } from "./usePlaza";
import { readLocalRaids, useRaid, type CurrentRaid, type RaidState } from "./useRaid";
import { WeedQuiz } from "./memorial/WeedQuiz";
import { makeOx, type OxQuiz } from "./memorial/ox";
import { loadMemorial } from "./memorial/useMemorial";
import type { StrikeResult } from "@/lib/firebase/raid";
import type { Leaf, Species } from "./types";

/**
 * 광장. 모두가 함께 쓰는 정원이고, 모두에게 버프를 준다.
 *
 * ★ 뽑기에는 손맛이 있어야 한다.
 *   한 번 누르면 끝나는 잡초는 일이다. 문지르거나 여러 번 두드려야 뽑히고,
 *   뽑힐 때 흙이 튄다. 손가락으로 문지른 거리 36px이 한 번, 두드림도 한 번이다.
 *
 * ★ 원본 정보 페이지에는 잡초가 없다. 전광판은 광장 안에만 있다.
 */
const RUB_PX = 36;
/** 깨끗함의 문턱. 잡초가 이만큼 이하로 남아야 한다. */
const CLEAN_MAX = Math.ceil(PLAZA_CELLS * 0.2) - 1;

export function PlazaView({
  plaza,
  catalog,
  byId,
  leaves,
  uid,
  now,
  say,
}: {
  plaza: Plaza;
  catalog: Species[];
  byId: Map<string, Species>;
  leaves: Leaf[];
  uid: string | null;
  now: number;
  say: (text: string) => void;
}) {
  const onStrike = useCallback(
    (result: StrikeResult) => {
      if (result === "defeated") {
        say("🏆 거대 잡초를 쓰러뜨렸어요! 상자를 열어 보세요");
      } else if (result === "over") say("거대 잡초가 이미 쓰러졌어요");
      else if (result === "escaped") say("💨 거대 잡초가 도망갔어요");
      else if (result === "capped") say(`💪 이번 거대 잡초에 기력 ${RAID_USES_PER_PERSON}번을 다 썼어요. 지원으로 도와요!`);
      else if (result === "error") say("광장에 닿지 못했어요. 잠시 뒤 다시 해 보세요");
    },
    [say],
  );
  const nick = useGarden((s) => s.data?.nick ?? "");
  const raid = useRaid(uid, nick, now, onStrike);
  // 포자(§7.2 ③): 체력이 절반이 되면 광장 칸 여섯에 돋는다. 물결 id에서 정한 칸이라 모두 같은 칸을 본다.
  // 뽑은 것은 이 기기에서만 센다 — 서버에 쓰지 않는다. 다 뽑으면 다음 빈틈 동안 내 문지르기가 절반.
  // 빈틈은 변신하는 거대 잡초에만 있다. 그래서 포자도 그때만 돋는다.
  const live = raid.raid && raid.raid.phase === "active" && raid.raid.v3 ? raid.raid : null;
  const liveGauges = live ? raidGauges(live) : null;
  const sporesUp = liveGauges !== null && liveGauges.reduce((n, g) => n + g.have, 0) >= liveGauges.reduce((n, g) => n + g.need, 0) * SPORE_AT;
  const sporeAt = live && sporesUp ? sporeCells(live.id, PLAZA_CELLS) : [];
  const [pulled, setPulled] = useState<{ id: string; cells: number[] }>({ id: "", cells: [] });
  const pulledCells = live && pulled.id === live.id ? pulled.cells : [];
  const sporesLeft = sporeAt.filter((c) => !pulledCells.includes(c));
  // 보너스는 다 뽑은 뒤 처음 오는 빈틈 하나 동안. 빈틈이 끝나면 꺼진다.
  const [boostGap, setBoostGap] = useState<{ id: string; end: number } | null>(null);
  const sporeBoost = live !== null && boostGap?.id === live.id && now < boostGap.end;
  const pullSpore = (cell: number) => {
    if (!live) return;
    const cells = [...pulledCells, cell];
    setPulled({ id: live.id, cells });
    gardenFeedback("pull");
    if (sporeAt.every((c) => cells.includes(c))) {
      const w = raidGapWindow(now, live.spawnedAt, live.hp);
      if (w) setBoostGap({ id: live.id, end: w.end });
      say("🍄 포자를 다 뽑았어요! 다음 빈틈 동안 문지르기가 절반이에요");
    } else say(`🍄 포자 ${cells.filter((c) => sporeAt.includes(c)).length}/${SPORE_COUNT}`);
  };
  const weedByCell = new Map(plaza.weeds.map((w) => [w.cell, w]));
  // 시든 잎. 두 시간에 한 장, 잡초가 없는 칸에 떨어진다. 다 덮였으면 뽑아야 보인다.
  const leafLedger = useGarden((s) => s.data?.leaves);
  const leaf = leafLedger ? pickLeaf(leaves, leafLedger, now) : undefined;
  const leafAt = leaf
    ? leafCell(leaf.id, leafSlot(now), new Set(plaza.weeds.map((w) => w.index)))
    : undefined;
  const [leafOpen, setLeafOpen] = useState(false);
  const featured = pickFeatured(catalog, kstDay(now));
  const need = Math.max(0, plaza.weeds.length - CLEAN_MAX);
  const buff = Math.round((PLAZA_SPEED[plaza.level] - 1) * 100);
  // 잡초 O/X 퀴즈. 업적 자료는 광장을 열 때 미리 받아 둔다(뜰 때 기다리지 않게).
  const [oxQuiz, setOxQuiz] = useState<OxQuiz | null>(null);
  useEffect(() => {
    void loadMemorial().catch(() => {});
  }, []);
  const maybeQuiz = () => {
    if (!useGarden.getState().rollWeedQuiz()) return;
    loadMemorial()
      .then((entries) => {
        const quiz = makeOx(entries, Math.random);
        if (quiz) setOxQuiz(quiz);
        else useGarden.getState().settleWeedQuiz(false);
      })
      .catch(() => useGarden.getState().settleWeedQuiz(false));
  };
  // 흙 튀기기는 칸에 그린다. 잡초는 광장 상태가 바뀌는 순간 사라지기 때문이다.
  const [bursts, setBursts] = useState<Record<string, number>>({});

  const onPulled = async (weed: Weed) => {
    const result = await plaza.pull(weed.cell);
    if (result === "gone") {
      say("누가 먼저 뽑았어요 🙌");
      return false;
    }
    if (result === "error") {
      say("광장에 닿지 못했어요. 잠시 뒤 다시 해 보세요");
      return false;
    }
    gardenFeedback("pull");
    const at = Date.now();
    setBursts((b) => ({ ...b, [weed.cell]: at }));
    setTimeout(() => setBursts((b) => (b[weed.cell] === at ? omit(b, weed.cell) : b)), 900);
    track("plaza_pull", { stage: weed.stage });
    const reward = useGarden.getState().weed(weed.stage, catalog);
    if (reward.capped) say("광장이 고마워해요 (오늘 잼 보상은 다 받았어요)");
    else if (reward.seed) say(`🍯 +${reward.jam} · 🌱 ${byId.get(reward.seed)?.title ?? "씨앗"} 씨앗을 찾았어요!`);
    else say(`🍯 +${reward.jam}`);
    if (!reward.capped) maybeQuiz();
    return true;
  };

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="text-[15px] font-bold">광장</h2>
        <p className="text-[12px] text-smoke">
          {plaza.shared ? "모두가 함께 쓰는 정원" : "이 환경에서는 혼자 쓰는 광장"}
        </p>
      </div>

      <div className={`garden-level-${plaza.level} mt-3 rounded-2xl px-4 py-3 text-[13px]`}>
        <p className="font-semibold">
          지금 광장: {PLAZA_LABEL[plaza.level]} · 잡초 {plaza.weeds.length}/{PLAZA_CELLS}
        </p>
        <p className="mt-0.5 text-[12px] opacity-85">
          {buff > 0 ? `모두의 정원이 ${buff}% 빨리 자라요.` : "버프가 꺼졌어요."}
          {plaza.level === "clean" ? " 수확할 때 15% 확률로 광장의 축복(×2)이 붙어요." : ""}
          {" "}새로 심는 씨앗부터 적용돼요.
        </p>
      </div>

      {oxQuiz && <WeedQuiz quiz={oxQuiz} onClose={() => setOxQuiz(null)} say={say} />}
      <RaidOwed uid={uid} currentId={raid.raid?.id ?? null} now={now} catalog={catalog} byId={byId} say={say} />
      <RaidPanel raid={raid} catalog={catalog} byId={byId} uid={uid} now={now} sporeBoost={sporeBoost} say={say} />
      <RaidBell say={say} />

      <div className="garden-plaza mt-3 rounded-3xl">
        <GroundDetails />
        <div className="garden-field-sign" aria-hidden="true">TOWN GARDEN <span>우리 손으로 가꾸는 정원</span></div>
        <div className="garden-plaza-grid grid grid-cols-6">
        {Array.from({ length: PLAZA_CELLS }, (_, i) => {
          const weed = weedByCell.get(cellId(i));
          return (
            <div key={i} className="garden-meadow-cell relative aspect-square">
              {!weed && i !== leafAt && !sporesLeft.includes(i) && <span className="garden-meadow-flower" aria-hidden="true">{i % 4 === 0 ? "✿" : "ˬ"}</span>}
              {!weed && i === leafAt && !sporesLeft.includes(i) && <LeafButton onOpen={() => setLeafOpen(true)} />}
              {weed && !sporesLeft.includes(i) && <WeedButton key={`${weed.cell}-${weed.since}`} weed={weed} onPulled={onPulled} />}
              {sporesLeft.includes(i) && <SporeButton key={`spore-${live?.id}-${i}`} onPulled={() => pullSpore(i)} />}
              {bursts[cellId(i)] && <Dirt key={bursts[cellId(i)]} />}
            </div>
          );
        })}
        </div>
        <p className="garden-field-hint">
          {sporesLeft.length > 0
            ? `🍄 거대 잡초의 포자가 ${sporesLeft.length}곳에 돋았어요. 다 뽑으면 다음 빈틈에 문지르기 절반`
            : leafAt !== undefined ? "🍂 시든 잎이 떨어져 있어요. 주워 보세요" : "✋ 잡초를 톡톡 두드리거나 문질러 주세요"}
        </p>
      </div>

      {leafOpen && leaf && <LeafSheet leaf={leaf} uid={uid} onClose={() => setLeafOpen(false)} say={say} />}

      <p className="mt-2 text-[11.5px] leading-relaxed text-smoke">
        잡초를 문지르거나 여러 번 두드려 뽑아요. 어린 잡초 {WEED.young.rubs}번, 잡초 {WEED.grown.rubs}번, 질긴 잡초{" "}
        {WEED.tough.rubs}번. 한 포기에 잼 {WEED.young.jam}~{WEED.tough.jam}, {Math.round(WEED_SEED_ODDS * 100)}% 확률로 씨앗
        (하루 {WEED_REWARD_PER_DAY}포기까지).
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-2xl bg-[var(--g-panel)] py-3">
          <p className="text-[22px] font-bold tabular-nums">{plaza.today.pulls.toLocaleString()}</p>
          <p className="text-[11.5px] text-smoke">오늘 뽑힌 잡초</p>
        </div>
        <div className="rounded-2xl bg-[var(--g-panel)] py-3">
          <p className="text-[22px] font-bold tabular-nums">{plaza.today.gardeners.toLocaleString()}</p>
          <p className="text-[11.5px] text-smoke">오늘의 정원지기</p>
        </div>
      </div>

      {featured && (
        <section aria-labelledby="billboard" className="mt-5">
          <h3 id="billboard" className="text-[13px] font-bold">
            광장 전광판
          </h3>
          {plaza.level === "clean" ? (
            <Link
              href={featured.href}
              className="garden-pop mt-2 block rounded-2xl border border-stone bg-eggshell p-4 text-ink"
            >
              <p className="text-[11px] font-semibold text-navy">오늘의 카드</p>
              <p className="mt-1 flex items-center gap-2 text-[15px] font-semibold">
                <span className="text-2xl">{fruitIcon(featured)}</span>
                {featured.title}
              </p>
              {featured.notes[0] && (
                <p className="mt-1.5 text-[13px] leading-relaxed text-graphite">{featured.notes[0].text}</p>
              )}
              <p className="mt-2 text-[12px] text-smoke">근거·반론까지 원본에서 보기 →</p>
            </Link>
          ) : (
            <div className="garden-vines mt-2 rounded-2xl px-4 py-6 text-center text-[13px] font-medium text-white">
              잡초가 전광판을 덮었어요.
              <br />
              {need}포기만 더 뽑으면 오늘의 카드가 걸려요.
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function omit(record: Record<string, number>, key: string): Record<string, number> {
  const next = { ...record };
  delete next[key];
  return next;
}

function Dirt() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} className={`garden-dirt garden-dirt-${i}`} />
      ))}
    </span>
  );
}

function pickFeatured(catalog: Species[], day: string): Species | undefined {
  const pool = catalog.filter((s) => s.tier === "flagship" || s.tier === "perennial");
  return pool.length ? pool[hash(day) % pool.length] : undefined;
}

/** 포자 잡초 — 광장 칸 위에 얹는 그림. 보통 잡초처럼 문질러 뽑는다. 이 기기에서만 센다. */
function SporeButton({ onPulled }: { onPulled: () => void }) {
  const [rubs, setRubs] = useState(0);
  const [shake, setShake] = useState(0);
  const done = useRef(false);
  const gesture = useRub(() => {
    if (done.current) return;
    gardenFeedback("tap");
    setShake((n) => n + 1);
    const next = rubs + 1;
    setRubs(next);
    if (next >= SPORE_RUBS) {
      done.current = true;
      onPulled();
    }
  });
  return (
    <button
      type="button"
      aria-label={`포자 잡초 뽑기 (${Math.max(0, SPORE_RUBS - rubs)}번 남음)`}
      className="absolute inset-0 grid touch-none select-none place-items-center"
      {...gesture}
    >
      <span key={shake} className={`garden-spore text-[22px] leading-none ${shake ? "garden-shake" : ""}`} aria-hidden="true">🍄</span>
      {rubs > 0 && (
        <span className="pointer-events-none absolute bottom-0.5 h-1 w-3/4 overflow-hidden rounded-full bg-black/20">
          <span className="block h-full bg-white" style={{ width: `${(rubs / SPORE_RUBS) * 100}%` }} />
        </span>
      )}
    </button>
  );
}

function WeedButton({ weed, onPulled }: { weed: Weed; onPulled: (weed: Weed) => Promise<boolean> }) {
  const need = WEED[weed.stage].rubs;
  const [rubs, setRubs] = useState(0);
  const [state, setState] = useState<"idle" | "pulling" | "gone">("idle");
  const [shake, setShake] = useState(0);
  const rubCount = useRef(0);
  const pulling = useRef(false);

  const rub = () => {
    if (pulling.current || state !== "idle") return;
    gardenFeedback("tap");
    setShake((s) => s + 1);
    const next = ++rubCount.current;
    setRubs(next);
    if (next >= need) {
      // Keep the request out of a React updater (Strict Mode may invoke it twice).
      pulling.current = true;
      setState("pulling");
      void onPulled(weed).then((ok) => {
        pulling.current = ok;
        setState(ok ? "gone" : "idle");
      });
    }
  };

  const gesture = useRub(rub);

  if (state === "gone") return null;

  const variant = hash(weed.cell + weed.since) % 3;
  const scale = weed.stage === "young" ? 0.62 : weed.stage === "grown" ? 0.85 : 1.05;

  return (
    <button
      type="button"
      aria-label={`${WEED[weed.stage].label} 뽑기 (${Math.max(0, need - rubs)}번 남음)`}
      className="absolute inset-0 grid touch-none select-none place-items-center"
      {...gesture}
    >
      <span className="garden-weed-sway" style={{ animationDelay: `${-variant * .8}s`, width: "100%", height: "100%" }}>
        <span key={shake} className={`garden-weed-body ${shake ? "garden-shake" : ""} ${state === "pulling" ? "garden-lift" : ""}`} style={{ transform: `scale(${scale})` }}>
          <WeedArt variant={variant} tough={weed.stage === "tough"} />
        </span>
      </span>
      {rubs > 0 && (
        <span className="pointer-events-none absolute bottom-0.5 h-1 w-3/4 overflow-hidden rounded-full bg-black/20">
          <span className="block h-full bg-white" style={{ width: `${(rubs / need) * 100}%` }} />
        </span>
      )}
    </button>
  );
}

/**
 * 문지르기·두드리기. 손가락으로 문지른 거리 RUB_PX마다 한 번, 두드림·키보드도 한 번.
 * 드래그로 이미 센 것은 뒤따르는 click에서 다시 세지 않는다.
 */
function useRub(rub: () => void) {
  const last = useRef<{ x: number; y: number; dist: number } | null>(null);
  return {
    onClick: (e: React.MouseEvent) => {
      if (e.detail === 0 || !last.current || last.current.dist < RUB_PX) rub();
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
      if (Math.floor(l.dist / RUB_PX) > Math.floor((l.dist - d) / RUB_PX)) rub();
    },
  };
}

/**
 * 거대 잡초. 광장이 무성해지면 하루 RAID_PER_DAY번까지 나타나고, 다 같이 쳐서 쓰러뜨린다.
 * 한 사람은 물결마다 기력 RAID_USES_PER_PERSON번까지(빈틈이면 한 번이 두 배) — 혼자서는 쓰러뜨리지 못한다.
 * 쓰러뜨리면 한 번이라도 쳤거나 지원한 모두가 상자와 뿌리 조각을 받는다(docs/garden-miniroom.md §7.4).
 * 오래 두면 도망간다 — 그때도 친 사람은 뿌리 조각 하나.
 */
function RaidPanel({
  raid,
  catalog,
  byId,
  uid,
  now,
  sporeBoost,
  say,
}: {
  raid: RaidState;
  catalog: Species[];
  byId: Map<string, Species>;
  uid: string | null;
  now: number;
  sporeBoost: boolean;
  say: (text: string) => void;
}) {
  const r = raid.raid;
  const spent = raid.me.uses >= RAID_USES_PER_PERSON;

  // 싸우는 모습을 보던 중에 쓰러지면 피날레를 잠깐 보여 준다. 처음부터 쓰러진 것을 연 사람에게는 보이지 않는다.
  const [seen, setSeen] = useState<{ id: string; phase: string } | null>(r ? { id: r.id, phase: r.phase } : null);
  const [finale, setFinale] = useState<{ id: string; until: number } | null>(null);
  if (r && (seen?.id !== r.id || seen.phase !== r.phase)) {
    if (seen?.id === r.id && seen.phase === "active" && r.phase === "defeated") setFinale({ id: r.id, until: now + 3_400 });
    setSeen({ id: r.id, phase: r.phase });
  }
  const finaleId = finale && finale.id === r?.id && now < finale.until ? finale.id : null;
  useEffect(() => {
    if (finaleId) raidFeedback("defeat");
  }, [finaleId]);

  if (!r) {
    return raid.next ? (
      <p className="mt-3 rounded-2xl bg-[var(--g-panel)] px-4 py-3 text-[12.5px] text-smoke">
        🌱 오늘 {raidSlotLabel(raid.next.wave)} 거대 잡초는 {raid.next.at > now ? `${formatLeft(raid.next.at - now)} 뒤에` : "곧"} 나타나요 · 하루 {RAID_PER_DAY}번(
        {RAID_SLOTS.map((x) => `${x.label} ${x.open}시`).join(" · ")})
      </p>
    ) : null;
  }

  const gauges = raidGauges(r);
  const total = gauges.reduce((n, g) => n + g.need, 0);
  const left = total - gauges.reduce((n, g) => n + g.have, 0);
  const { won, stars } = raidOutcome(r, r.phase);
  const need = r.v3 ? raidNeedV3(r.v3.n) : raidNeed(r.hp);
  const kind = raidKind(raid.day, r.wave);
  const nextLine = raid.next
    ? raid.next.at > now
      ? `다음은 ${raidSlotLabel(raid.next.wave)} 거대 잡초 — ${formatLeft(raid.next.at - now)} 뒤에 나타나요.`
      : `${raidSlotLabel(raid.next.wave)} 거대 잡초가 곧 나타나요.`
    : "오늘은 여기까지. 내일 아침에 또 만나요.";

  if (r.phase === "defeated" && finaleId) {
    return <RaidFinale kind={kind} fighters={r.fighters} stars={stars} />;
  }

  if (won || r.phase === "escaped") {
    return <RaidRewardCard r={r} day={raid.day} me={raid.me} now={now} catalog={catalog} byId={byId} uid={uid} say={say} footer={<p className="mt-1 text-[12px] opacity-85">{nextLine}</p>} />;
  }

  const escapeIn = (raidEndsAt(r) ?? now) - now;
  const gap = raidGapWindow(now, r.spawnedAt, r.hp);
  const odds = (p: number) => `${TIER_LABEL.flagship} ${Math.round((1 - p) * 100)}% · ${TIER_LABEL.perennial} ${Math.round(p * 100)}%`;
  return (
    <RaidArena
      raid={raid}
      r={r}
      kind={kind}
      now={now}
      sporeBoost={sporeBoost}
      say={say}
      footer={
        <>
          <RaidCall id={r.id} name={kind.name} left={left} hp={total} need={need} escapeIn={escapeIn} gapAt={gap ? gap.start : null} loud={spent} say={say} />
          <details className="mt-2 text-[11.5px] leading-relaxed opacity-90">
            <summary className="min-h-[32px] cursor-pointer font-bold">규칙과 보상 보기</summary>
            <p className="mt-1">
              거대 잡초는 하루 {RAID_PER_DAY}번 — {RAID_SLOTS.map((x) => `${x.label} ${x.open}–${x.close}시`).join(" · ")} — 나타나요. 다음 시간대가 열릴 때까지 머물러서,
              그 사이 언제 와서 쳐도 다 쌓여요. 다음 거대 잡초가 나와도 지난 거대 잡초의 보상은 광장 위에 남아 있어요.
            </p>
            {r.v3 ? (
              <>
                <p className="mt-1">
                  🌀 이 거대 잡초는 주에 한 번 나오는 <b>변신하는 거대 잡초</b>예요. 세 번 변신해요. 1형의 체력을 다 깎으면 2형이, 2형의 게이지(체력·갑옷·울타리)를
                  다 채우면 3형이 나오고, 3형을 채우면 쓰러져요. 기력은 형태마다 {RAID_USES_PER_PERSON}번 다시 차요. 2형부터 역할을 골라요 — 제 역할의 게이지는
                  ×{RAID_ROLE_MULT}. 매 시 정각과 30분부터 3분은 빈틈이라 다시 ×{RAID_GAP_MULT}. {formatLeft(RAID_LIFE)}이 지나면 도망가요.
                </p>
                <p className="mt-1">
                  잼은 참여 {RAID_JAM.base.toLocaleString()} · 1형 격파 {RAID_JAM.forms[0].toLocaleString()} · 2형 {RAID_JAM.forms[1].toLocaleString()} · 3형{" "}
                  {RAID_JAM.forms[2].toLocaleString()} — 처음부터 끝까지 함께하면 {RAID_JAM_MAX.toLocaleString()}잼이에요. 1형을 넘기면 희귀 씨앗 상자(
                  {odds(boxPerennial(0))}, ★★★이면 {odds(boxPerennial(3))})와 뿌리 조각도 받아요.
                </p>
              </>
            ) : (
              <p className="mt-1">
                한 사람은 기력 {RAID_USES_PER_PERSON}번까지 — {RAID_RUBS_PER_STRIKE}번 두드리면 한 방, 1초에 한 방이에요. 혼자서는 못 잡고, {need.most}명이 기력을 다 쓰면
                잡혀요. 쓰러뜨리면 한 번이라도 친 모두가 잼 {RAID_BOX.jam}과 희귀 씨앗 상자({odds(boxPerennial(0))}), 뿌리 조각, 표본 조각을 받아요. 표본 조각을 셋
                모으면 그 악초의 박제가 방에 생겨요. 못 잡고 떠나도 친 사람은 뿌리 조각 하나를 받아요.
              </p>
            )}
          </details>
        </>
      }
    />
  );
}

/**
 * 한 물결의 보상 — 쓰러뜨렸거나(변신하는 거대 잡초는 1형만 넘겨도) 떠난 물결. 지금 물결(RaidPanel)과
 * 지난 물결(RaidOwed)이 같이 쓴다. 받을 것은 내 장부(raids·loot)가 물결마다 한 번만 내준다.
 */
function RaidRewardCard({
  r,
  day,
  me,
  now,
  catalog,
  byId,
  uid,
  say,
  title,
  footer,
}: {
  r: CurrentRaid;
  day: number;
  me: RaidMine;
  now: number;
  catalog: Species[];
  byId: Map<string, Species>;
  uid: string | null;
  say: (text: string) => void;
  /** 지난 물결이면 머리말. */
  title?: string;
  footer?: ReactNode;
}) {
  const key = raidKey(day, r.wave);
  const claimed = useGarden((st) => st.data?.raids.includes(key) ?? false);
  const fledClaimed = useGarden((st) => st.data?.loot.fled.includes(key) ?? false);
  const samples = useGarden((st) => st.data?.loot.samples);
  const logged = useGarden((st) => (st.data?.loot.parts[String(key)]?.length ?? 0) > 0);
  // 서버 표식이 아직 없거나(다른 기기) 늦게 와도, 내 장부에 든 형태가 적혀 있으면 든 것이다.
  const part = tookPart(me) || logged;
  const mine: RaidMine = tookPart(me) ? me : { ...me, hits: Math.max(1, me.hits) };
  const kind = raidKind(day, r.wave);
  const { won, stars } = raidOutcome(r, r.phase);
  const gauges = raidGauges(r);
  const total = gauges.reduce((n, g) => n + g.need, 0);
  const left = total - gauges.reduce((n, g) => n + g.have, 0);
  const need = r.v3 ? raidNeedV3(r.v3.n) : raidNeed(r.hp);
  const odds = (p: number) => `${TIER_LABEL.flagship} ${Math.round((1 - p) * 100)}% · ${TIER_LABEL.perennial} ${Math.round(p * 100)}%`;
  const order = `${day === kstDayNumber(now) ? "오늘" : "어제"} ${raidSlotLabel(r.wave)} 거대 잡초${r.v3 ? " · 🌀 변신하는 거대 잡초" : ""}`;

  if (won) {
    const loot = raidLoot("defeated", stars, mine);
    const sample = Math.min(SAMPLES_PER_TROPHY, (samples?.[kind.id] ?? 0) + (claimed ? 0 : 1));
    return (
      <section aria-label={title ?? "거대 잡초 보상"} className="garden-raid-done mt-3 rounded-2xl px-4 py-3.5">
        {title && <p className="text-[11.5px] font-bold opacity-80">{title}</p>}
        <h3 className="text-[14px] font-bold">
          {r.phase === "defeated" ? `🏆 ${josa(kind.name, "을를")} 쓰러뜨렸어요` : `💨 ${formName(kind.id, r.v3?.form ?? 1)}은 놓쳤지만 ${stars}형까지 넘겼어요`} · {"★".repeat(stars)}
        </h3>
        <p className="text-[11.5px] opacity-75">
          {order} · {r.spawnedAt !== null && r.defeatedAt !== null ? `${Math.max(1, Math.round((r.defeatedAt - r.spawnedAt) / 60_000))}분 만에` : ""}
        </p>
        <RollCall names={r.names ?? []} fighters={r.fighters} />
        {r.v3 && <RaidJam raidKey={key} cleared={stars} ended lastForm={me.form} say={say} />}
        {part && !claimed && (
          <div className="mt-2 rounded-xl bg-white/60 px-3 py-2 text-[12px]">
            <p className="font-semibold">받을 것</p>
            <ul className="mt-0.5 space-y-0.5">
              <li>🎁 희귀 씨앗 상자 + 🍯 {RAID_BOX.jam} ({odds(loot.perennial)})</li>
              {loot.lines.map((l) => (
                <li key={l.label}>🌰 {l.label} · 뿌리 조각 {l.roots}</li>
              ))}
              <li>🧪 {kind.name} 표본 조각 1 ({sample}/{SAMPLES_PER_TROPHY} — 셋이면 박제)</li>
            </ul>
            <button
              type="button"
              onClick={() => {
                const got = useGarden.getState().claimRaid(key, `${r.id}:${uid ?? "local"}`, catalog, loot, kind.id);
                if (!got) return;
                gardenFeedback("reward");
                say(
                  `🎁 상자 · 🍯 +${got.jam}${got.species ? ` · 🌱 ${byId.get(got.species.id)?.title ?? "씨앗"}` : ""} · 🌰 +${got.roots}` +
                    (got.trophy ? ` · 🏆 ${kind.name} 박제가 방에!` : "") +
                    (got.wallpaper ? " · 벽지 ‘광장을 지킨 방’" : ""),
                );
              }}
              className="mt-2 min-h-[44px] rounded-full bg-[var(--g-jam)] px-4 py-2 text-[13px] font-semibold text-white"
            >
              🎁 보상 받기
            </button>
          </div>
        )}
        {part && claimed && <p className="mt-1.5 text-[12px] font-semibold">보상을 받았어요.</p>}
        {part && r.phase === "defeated" && <RaidPot id={r.id} raidKey={key} fighters={r.fighters} say={say} />}
        {!part && <p className="mt-1.5 text-[12px]">이번에는 함께하지 못했어요.</p>}
        {footer}
      </section>
    );
  }

  const loot = raidLoot("escaped", 0, mine);
  return (
    <section aria-label={title ?? "거대 잡초 결과"} className="garden-raid-done mt-3 rounded-2xl px-4 py-3.5">
      {title && <p className="text-[11.5px] font-bold opacity-80">{title}</p>}
      <h3 className="text-[14px] font-bold">💨 {kind.escaped}</h3>
      <p className="text-[11.5px] opacity-75">{order}</p>
      {r.v3 && <RaidJam raidKey={key} cleared={0} ended lastForm={me.form} say={say} />}
      <p className="mt-0.5 text-[12px] opacity-85">
        {r.fighters.toLocaleString()}명이 {(total - left).toLocaleString()}/{total.toLocaleString()}만큼 쳤지만 쓰러뜨리지 못했어요.{" "}
        {r.v3 ? `빈틈에 모이면 ${need.least}명, 아니면 ${need.most}명이 필요해요.` : `${need.most}명이 기력을 다 쓰면 잡혀요.`}
      </p>
      {part && loot.roots > 0 && !fledClaimed && (
        <button
          type="button"
          onClick={() => {
            const got = useGarden.getState().claimEscape(key, loot.roots);
            if (got === null) return;
            gardenFeedback("reward");
            say(`🌰 뿌리 조각 +${got} · 빈손은 아니에요`);
          }}
          className="mt-2 min-h-[44px] rounded-full bg-[var(--g-jam)] px-4 py-2 text-[13px] font-semibold text-white"
        >
          🌰 뿌리 조각 {loot.roots} 받기
        </button>
      )}
      {part && loot.roots > 0 && fledClaimed && <p className="mt-1.5 text-[12px] font-semibold">뿌리 조각을 받았어요.</p>}
      {footer}
    </section>
  );
}

/**
 * 아직 받지 않은 지난 물결의 보상. 아침 거대 잡초에 들었는데 점심 거대 잡초가 나와도 보상 창이 사라지지 않게 —
 * 내 장부(loot.parts)에 든 것으로 적힌 어제·오늘의 물결 가운데 지금 물결이 아닌 것을 하나씩 읽어 보인다.
 * 다 받으면(상자·뿌리 조각·잼) 저절로 접힌다.
 */
function RaidOwed({
  uid,
  currentId,
  now,
  catalog,
  byId,
  say,
}: {
  uid: string | null;
  currentId: string | null;
  now: number;
  catalog: Species[];
  byId: Map<string, Species>;
  say: (text: string) => void;
}) {
  const parts = useGarden((st) => st.data?.loot.parts);
  const today = kstDayNumber(now);
  const ids = Object.keys(parts ?? {})
    .map(Number)
    .filter((k) => {
      const day = Math.floor(k / 10);
      const wave = k % 10;
      return (day === today || day === today - 1) && wave >= 1 && wave <= RAID_PER_DAY;
    })
    .map((k) => raidId(Math.floor(k / 10), k % 10))
    .filter((id) => id !== currentId)
    .sort();
  if (ids.length === 0) return null;
  return (
    <>
      {ids.map((id) => (
        <OwedWave key={id} id={id} uid={uid} now={now} catalog={catalog} byId={byId} say={say} />
      ))}
    </>
  );
}

function OwedWave({
  id,
  uid,
  now,
  catalog,
  byId,
  say,
}: {
  id: string;
  uid: string | null;
  now: number;
  catalog: Species[];
  byId: Map<string, Species>;
  say: (text: string) => void;
}) {
  const [day, wave] = id.split("-").map(Number);
  const key = raidKey(day, wave);
  const [remote, setRemote] = useState<Raid | null | undefined>(undefined);
  const [mineRemote, setMineRemote] = useState<RaidMine | null>(null);
  useEffect(() => {
    if (!firebaseConfigured) return;
    return watchRaidWave(id, setRemote);
  }, [id]);
  useEffect(() => {
    if (!firebaseConfigured || !uid) return;
    return watchMine(id, uid, setMineRemote);
  }, [id, uid]);
  const local = firebaseConfigured ? null : (readLocalRaids(day).waves[wave - 1] ?? null);
  const base: Raid | null | undefined = firebaseConfigured ? remote : local ? { ...local, closesAt: raidClosesAtId(id) } : null;
  const me: RaidMine = (firebaseConfigured ? mineRemote : local?.mine) ?? { hits: 0, uses: 0, aids: 0, aidAt: null, role: null, form: 0 };

  const ledger = useGarden((st) => st.data);
  if (!base || !ledger) return null;
  const phase = raidPhase(base, now);
  if (phase === "active") return null;
  const r: CurrentRaid = { ...base, wave, id, phase };
  const { won, stars } = raidOutcome(r, phase);
  // 받을 것이 남았나 — 상자·뿌리 조각·(변신하는 거대 잡초면) 잼 사다리.
  const jamLeft = r.v3 ? raidJamLines(won ? stars : 0, true, ledger.loot.parts[String(key)] ?? [], ledger.loot.paid[String(key)] ?? []).length > 0 : false;
  const owed = won ? !ledger.raids.includes(key) || jamLeft : (!ledger.loot.fled.includes(key) && raidLoot("escaped", 0, { ...me, hits: Math.max(1, me.hits) }).roots > 0) || jamLeft;
  if (!owed) return null;
  return (
    <RaidRewardCard
      r={r}
      day={day}
      me={me}
      now={now}
      catalog={catalog}
      byId={byId}
      uid={uid}
      say={say}
      title={`🎁 아직 받지 않은 보상 · ${day === kstDayNumber(now) ? "오늘" : "어제"} ${raidSlotLabel(wave)}`}
    />
  );
}

/** 쓰러뜨린 순간 — 지켜보던 사람에게만. 느리게 쪼그라들고, 하얗게 번쩍이고, 씨앗이 터진다. */
function RaidFinale({ kind, fighters, stars }: { kind: RaidKind; fighters: number; stars: number }) {
  return (
    <section
      aria-live="assertive"
      className="garden-raid raid-finale mt-3 overflow-hidden rounded-2xl px-4 py-5 text-center text-white"
      style={{ background: `linear-gradient(180deg, ${kind.bg[0]}, ${kind.bg[1]})` }}
    >
      <span className="raid-finale-flash" aria-hidden="true" />
      <div className="raid-finale-weed mx-auto" aria-hidden="true">
        <RaidWeedArt kind={kind.id} form={3} />
      </div>
      <span className="pointer-events-none absolute inset-0" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} className="raid-finale-seed" style={{ ["--a" as string]: `${(i / 14) * 360}deg`, animationDelay: `${0.9 + (i % 3) * 0.08}s` }}>
            {i % 3 === 0 ? "🌱" : i % 3 === 1 ? "✨" : "🌰"}
          </span>
        ))}
      </span>
      <p className="raid-finale-title relative text-[20px] font-black">🏆 {fighters.toLocaleString()}명이 함께 쓰러뜨렸어요!</p>
      <p className="raid-finale-sub relative mt-1 text-[14px] font-semibold">{"★".repeat(stars)}</p>
    </section>
  );
}

/**
 * "같이 잡자" — 광장 탭이 바로 열리는 링크(/r/<물결id>)를 건넨다. 미리보기에 남은 체력이 보인다.
 * 거대 잡초는 혼자 못 잡으므로 사람을 부르는 길이 패널 안에 있어야 한다.
 * 보낸 횟수에는 아무 보상도 없다(docs/garden-game.md §1). 계측은 share_create{from: raid}만.
 */
function RaidCall({
  id,
  name,
  left,
  hp,
  need,
  escapeIn,
  gapAt,
  loud,
  say,
}: {
  /** 물결 id. 링크(/r/<id>)의 미리보기에 남은 체력이 그려진다. */
  id: string;
  /** 거대 잡초 종류 이름. */
  name: string;
  left: number;
  hp: number;
  need: { least: number; most: number };
  escapeIn: number;
  /** 지금이나 다음 빈틈의 시작. 링크 글에 "빈틈 ○시 ○분"을 적는다. */
  gapAt: number | null;
  /** 내 몫을 다 쳐서 이제 할 수 있는 게 부르기뿐일 때. 더 눈에 띄게. */
  loud: boolean;
  say: (text: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const call = async () => {
    gardenFeedback("tap");
    const result = await sendGardenLink(
      // /r/<물결id>는 미리보기 카드를 보여 주고 사람을 광장으로 보낸다. 내 초대 코드도 함께.
      withInvite(`${window.location.origin}/r/${id}`, "i"),
      "잼통 정원 · 거대 잡초",
      `거대 잡초 ${josa(name, "이가")} 나타났어요! 체력 ${left}/${hp} · ${formatLeft(escapeIn)} 뒤 도망가요.` +
        (gapAt !== null ? ` 빈틈 ${formatClock(gapAt, Date.now())}에 모이면 ${need.least}명이면 잡아요 🌿` : ` ${need.most}명이 모이면 잡아요 🌿`),
      "raid",
    );
    if (result === "copied") {
      setCopied(true);
      say("광장 링크를 복사했어요 · 친구에게 붙여 넣어 주세요");
      setTimeout(() => setCopied(false), 2400);
    } else if (result === "failed") say("링크를 복사하지 못했어요");
  };
  return (
    <button
      type="button"
      onClick={() => void call()}
      className={`mt-2 w-full rounded-full px-3.5 py-2 text-[13px] font-bold ${
        loud ? "bg-[#e9d24a] text-[#2c3a12]" : "bg-white/15 text-white ring-1 ring-white/40"
      }`}
    >
      {copied ? "링크를 복사했어요" : "📣 같이 잡자 — 친구 부르기"}
    </button>
  );
}

/**
 * 광장 잼 항아리(docs/garden-slots.md) — 슬롯머신에 낸 잼의 5%가 물결마다 모인다. 그 물결을 쓰러뜨렸으면
 * 함께한 사람이 나눈다: 모인 잼 ÷ 함께한 사람 수(한 사람 POT_SHARE_MAX까지). 물결마다 한 번 받는다.
 */
function RaidPot({ id, raidKey: key, fighters, say }: { id: string; raidKey: number; fighters: number; say: (text: string) => void }) {
  const [sum, setSum] = useState<number | null>(null);
  const taken = useGarden((st) => normalizeSlots(st.data?.slots).pots.includes(key));
  useEffect(() => {
    let alive = true;
    loadPot(id)
      .then((n) => alive && setSum(n))
      .catch((e) => {
        console.error("[plaza] 잼 항아리를 읽지 못했다", e);
        if (alive) setSum(0);
      });
    return () => {
      alive = false;
    };
  }, [id]);
  if (!sum) return null;
  const share = potReward(sum, fighters);
  return (
    <div className="mt-2 rounded-xl bg-white/60 px-3 py-2 text-[12px]">
      <p className="font-semibold">🍯 광장 잼 항아리 — 모인 잼 {sum.toLocaleString()} · 함께한 {fighters.toLocaleString()}명</p>
      {taken ? (
        <p className="mt-0.5">항아리 몫을 받았어요.</p>
      ) : share > 0 ? (
        <button
          type="button"
          className="mt-1.5 min-h-[40px] rounded-full bg-[var(--g-jam)] px-4 py-1.5 text-[13px] font-semibold text-white"
          onClick={() => {
            if (!useGarden.getState().claimPot(key, share)) return;
            gardenFeedback("reward");
            track("slot_pot", { jam: share });
            say(`🍯 잼 항아리 몫 +${share}`);
          }}
        >
          🍯 내 몫 {share} 받기
        </button>
      ) : (
        <p className="mt-0.5">함께한 사람이 많아 이번 몫은 1잼이 안 돼요.</p>
      )}
    </div>
  );
}
