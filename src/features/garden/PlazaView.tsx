"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import { cellId } from "@/lib/firebase/plaza";

import { GroundDetails, WeedArt } from "./GardenArt";
import { LeafButton, LeafSheet } from "./LeafCheck";
import { gardenFeedback } from "./feedback";

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
  RAID_HITS_PER_PERSON,
  RAID_LIFE,
  RAID_PER_DAY,
  RAID_RUBS_PER_STRIKE,
  raidKey,
  TIER_LABEL,
  WEED,
  WEED_REWARD_PER_DAY,
  WEED_SEED_ODDS,
} from "./rules";
import { useGarden } from "./store";
import type { Plaza, Weed } from "./usePlaza";
import { useRaid, type RaidState } from "./useRaid";
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
        gardenFeedback("reward");
        say("🏆 거대 잡초를 쓰러뜨렸어요! 상자를 열어 보세요");
      } else if (result === "over") say("거대 잡초가 이미 쓰러졌어요");
      else if (result === "escaped") say("💨 거대 잡초가 도망갔어요");
      else if (result === "capped") say(`💪 이번 거대 잡초에 줄 수 있는 ${RAID_HITS_PER_PERSON}방을 다 쳤어요. 친구를 불러 주세요!`);
      else if (result === "error") say("광장에 닿지 못했어요. 잠시 뒤 다시 해 보세요");
    },
    [say],
  );
  const raid = useRaid(uid, now, plaza.level, plaza.today.gardeners, onStrike);
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

      <RaidPanel raid={raid} catalog={catalog} byId={byId} uid={uid} now={now} say={say} />

      <div className="garden-plaza mt-3 rounded-3xl">
        <GroundDetails />
        <div className="garden-field-sign" aria-hidden="true">TOWN GARDEN <span>우리 손으로 가꾸는 정원</span></div>
        <div className="garden-plaza-grid grid grid-cols-6">
        {Array.from({ length: PLAZA_CELLS }, (_, i) => {
          const weed = weedByCell.get(cellId(i));
          return (
            <div key={i} className="garden-meadow-cell relative aspect-square">
              {!weed && i !== leafAt && <span className="garden-meadow-flower" aria-hidden="true">{i % 4 === 0 ? "✿" : "ˬ"}</span>}
              {!weed && i === leafAt && <LeafButton onOpen={() => setLeafOpen(true)} />}
              {weed && <WeedButton key={`${weed.cell}-${weed.since}`} weed={weed} onPulled={onPulled} />}
              {bursts[cellId(i)] && <Dirt key={bursts[cellId(i)]} />}
            </div>
          );
        })}
        </div>
        <p className="garden-field-hint">
          {leafAt !== undefined ? "🍂 시든 잎이 떨어져 있어요. 주워 보세요" : "✋ 잡초를 톡톡 두드리거나 문질러 주세요"}
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
 * 거대 잡초. 광장이 무성해지면 하루 RAID_PER_DAY번까지 나타나고, 다 같이 때려 쓰러뜨린다.
 * 한 사람은 물결마다 RAID_HITS_PER_PERSON방까지 — 혼자서는 쓰러뜨리지 못한다.
 * 쓰러뜨리면 한 번이라도 때린 사람 모두가 희귀 씨앗 상자를 받는다. 오래 두면 도망간다.
 */
function RaidPanel({
  raid,
  catalog,
  byId,
  uid,
  now,
  say,
}: {
  raid: RaidState;
  catalog: Species[];
  byId: Map<string, Species>;
  uid: string | null;
  now: number;
  say: (text: string) => void;
}) {
  const r = raid.raid;
  const key = r ? raidKey(raid.day, r.wave) : -1;
  const claimed = useGarden((st) => st.data?.raids.includes(key) ?? false);
  const [shake, setShake] = useState(0);
  const rubs = useRef(0);
  const [partial, setPartial] = useState(0);
  const spent = raid.mine >= RAID_HITS_PER_PERSON;

  const rub = () => {
    if (!r || r.phase !== "active" || spent) return;
    gardenFeedback("tap");
    setShake((n) => n + 1);
    rubs.current += 1;
    if (rubs.current >= RAID_RUBS_PER_STRIKE) {
      rubs.current = 0;
      raid.strike();
    }
    setPartial(rubs.current);
  };
  const gesture = useRub(rub);

  if (!r) return null;

  const left = Math.max(0, r.hp - r.hits);
  const odds = RAID_BOX.odds.map((o) => `${TIER_LABEL[o.tier]} ${Math.round(o.p * 100)}%`).join(" · ");
  const need = Math.ceil(r.hp / RAID_HITS_PER_PERSON);
  const label = `${["첫", "두", "세", "네", "다섯"][r.wave - 1] ?? r.wave} 번째 거대 잡초`;
  const nextLine = raid.next
    ? raid.next.at > now
      ? `다음 거대 잡초는 ${formatLeft(raid.next.at - now)} 뒤부터, 광장이 무성해지면 나타나요.`
      : "광장이 다시 무성해지면 다음 거대 잡초가 나타나요."
    : "오늘은 여기까지. 내일 또 만나요.";

  if (r.phase === "defeated") {
    return (
      <section aria-labelledby="raid" className="garden-raid-done mt-3 rounded-2xl px-4 py-3.5">
        <h3 id="raid" className="text-[14px] font-bold">🏆 {label}를 쓰러뜨렸어요</h3>
        <p className="mt-0.5 text-[12px] opacity-85">
          {r.fighters.toLocaleString()}명이 함께 {r.hp.toLocaleString()}번 때렸어요{raid.mine ? ` · 나는 ${raid.mine}번` : ""}.
        </p>
        {raid.mine > 0 && !claimed && (
          <button
            type="button"
            onClick={() => {
              const got = useGarden.getState().claimRaid(key, `${r.id}:${uid ?? "local"}`, catalog);
              if (!got) return;
              gardenFeedback("reward");
              say(`🎁 희귀 씨앗 상자 · 🍯 +${got.jam}${got.species ? ` · 🌱 ${byId.get(got.species.id)?.title ?? "씨앗"}` : ""}`);
            }}
            className="mt-2 rounded-full bg-[var(--g-jam)] px-3.5 py-1.5 text-[12.5px] font-semibold text-white"
          >
            🎁 희귀 씨앗 상자 열기
          </button>
        )}
        {raid.mine > 0 && claimed && <p className="mt-1.5 text-[12px] font-semibold">상자를 받았어요.</p>}
        {raid.mine === 0 && <p className="mt-1.5 text-[12px]">이번에는 함께하지 못했어요.</p>}
        <p className="mt-1 text-[12px] opacity-85">{nextLine}</p>
      </section>
    );
  }

  if (r.phase === "escaped") {
    return (
      <section aria-labelledby="raid" className="garden-raid-done mt-3 rounded-2xl px-4 py-3.5">
        <h3 id="raid" className="text-[14px] font-bold">💨 {label}가 도망갔어요</h3>
        <p className="mt-0.5 text-[12px] opacity-85">
          {r.fighters.toLocaleString()}명이 {Math.min(r.hits, r.hp).toLocaleString()}/{r.hp.toLocaleString()}번 때렸지만 {formatLeft(RAID_LIFE)} 안에
          쓰러뜨리지 못했어요. 적어도 {need}명이 모여야 해요.
        </p>
        <p className="mt-1 text-[12px] opacity-85">{nextLine}</p>
      </section>
    );
  }

  const escapeIn = r.spawnedAt !== null ? r.spawnedAt + RAID_LIFE - now : RAID_LIFE;
  // 체력이 클수록 그림 칸을 키운다. 그림은 칸 안에서만 그린다 — scale로 키우면 위로 넘쳐
  // 체력·인원 정보를 덮는다.
  const box = Math.round(176 * Math.min(1.25, 0.9 + r.hp / 3000));

  return (
    <section aria-labelledby="raid" className="garden-raid mt-3 rounded-2xl px-4 py-3.5 text-white">
      <div className="relative z-10">
        <div className="flex items-baseline justify-between gap-2">
          <h3 id="raid" className="text-[14px] font-bold">🌿 {label}가 나타났어요</h3>
          <p className="text-[11.5px] tabular-nums opacity-90">도망까지 {formatLeft(escapeIn)}</p>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-black/30" role="progressbar" aria-label="거대 잡초 체력" aria-valuemin={0} aria-valuemax={r.hp} aria-valuenow={left}>
          <div className="h-full bg-[#e9d24a] transition-[width]" style={{ width: `${(left / r.hp) * 100}%` }} />
        </div>
        <p className="mt-1 flex justify-between text-[11.5px] tabular-nums opacity-90">
          <span>체력 {left.toLocaleString()}/{r.hp.toLocaleString()}</span>
          <span>함께 {r.fighters.toLocaleString()}명 · {need}명이면 잡아요</span>
        </p>
      </div>

      <button
        type="button"
        aria-label={spent ? "이번 거대 잡초에 내 몫을 다 쳤어요" : `거대 잡초 때리기 (체력 ${left} 남음)`}
        aria-disabled={spent}
        className={`relative mx-auto mt-3 grid touch-none select-none place-items-center overflow-hidden rounded-2xl ${spent ? "opacity-60" : ""}`}
        style={{ width: box, height: box }}
        {...gesture}
      >
        <span key={shake} className={`garden-weed-body garden-raid-weed relative ${shake ? "garden-shake" : ""}`}>
          <WeedArt variant={2} tough />
        </span>
        {(partial > 0 || raid.queued > 0) && !spent && (
          <span className="pointer-events-none absolute bottom-1 h-1.5 w-2/3 overflow-hidden rounded-full bg-black/30">
            <span className="block h-full bg-white" style={{ width: `${(partial / RAID_RUBS_PER_STRIKE) * 100}%` }} />
          </span>
        )}
      </button>

      <div className="mt-1" aria-label={`내 몫 ${raid.mine}/${RAID_HITS_PER_PERSON}방`}>
        <div className="flex justify-between text-[11.5px] font-semibold tabular-nums">
          <span>내 몫</span>
          <span>{raid.mine}/{RAID_HITS_PER_PERSON}방</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/30">
          <div className="h-full bg-white/85" style={{ width: `${(raid.mine / RAID_HITS_PER_PERSON) * 100}%` }} />
        </div>
      </div>
      {spent && (
        <p className="mt-2 rounded-xl bg-black/25 px-3 py-2 text-[12px] font-semibold">
          💪 내 몫을 다 쳤어요. 혼자서는 쓰러뜨릴 수 없어요 — 친구에게 광장을 알려 주세요!
        </p>
      )}

      <p className="mt-2 text-[11.5px] leading-relaxed opacity-90">
        {RAID_RUBS_PER_STRIKE}번 문지르면 한 방, 1초에 한 방, 한 사람은 {RAID_HITS_PER_PERSON}방까지.{" "}
        {formatLeft(RAID_LIFE)} 안에 쓰러뜨리면 한 번이라도 때린 모두가 희귀 씨앗 상자를 받아요 ({odds}, 잼 {RAID_BOX.jam}).
        하루 {RAID_PER_DAY}번까지 나타나요.
      </p>
    </section>
  );
}
