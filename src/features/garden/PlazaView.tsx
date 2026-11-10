"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import { cellId } from "@/lib/firebase/plaza";

import { GroundDetails, WeedArt } from "./GardenArt";
import { RaidArena } from "./RaidArena";
import { RaidWeedArt } from "./RaidWeedArt";
import { LeafButton, LeafSheet } from "./LeafCheck";
import { gardenFeedback, raidFeedback } from "./feedback";

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
  josa,
  raidKey,
  raidKind,
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
        say("🏆 거대 잡초를 쓰러뜨렸어요! 상자를 열어 보세요");
      } else if (result === "over") say("거대 잡초가 이미 쓰러졌어요");
      else if (result === "escaped") say("💨 거대 잡초가 도망갔어요");
      else if (result === "capped") say(`💪 이번 거대 잡초에 줄 수 있는 ${RAID_HITS_PER_PERSON}방을 다 쳤어요. 친구를 불러 주세요!`);
      else if (result === "error") say("광장에 닿지 못했어요. 잠시 뒤 다시 해 보세요");
    },
    [say],
  );
  const raid = useRaid(uid, now, plaza.level, onStrike);
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
  const spent = raid.mine >= RAID_HITS_PER_PERSON;

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

  if (!r) return null;

  const left = Math.max(0, r.hp - r.hits);
  const odds = RAID_BOX.odds.map((o) => `${TIER_LABEL[o.tier]} ${Math.round(o.p * 100)}%`).join(" · ");
  const need = Math.ceil(r.hp / RAID_HITS_PER_PERSON);
  const kind = raidKind(raid.day, r.wave);
  const order = `오늘 ${["첫", "두", "세", "네", "다섯"][r.wave - 1] ?? r.wave} 번째 거대 잡초`;
  const nextLine = raid.next
    ? raid.next.at > now
      ? `다음 거대 잡초는 ${formatLeft(raid.next.at - now)} 뒤부터, 광장이 무성해지면 나타나요.`
      : "광장이 다시 무성해지면 다음 거대 잡초가 나타나요."
    : "오늘은 여기까지. 내일 또 만나요.";

  if (r.phase === "defeated" && finaleId) {
    return <RaidFinale kind={kind} fighters={r.fighters} mine={raid.mine} hp={r.hp} />;
  }

  if (r.phase === "defeated") {
    return (
      <section aria-labelledby="raid" className="garden-raid-done mt-3 rounded-2xl px-4 py-3.5">
        <h3 id="raid" className="text-[14px] font-bold">🏆 {josa(kind.name, "을를")} 쓰러뜨렸어요</h3>
        <p className="text-[11.5px] opacity-75">{order}</p>
        <p className="mt-0.5 text-[12px] opacity-85">
          {r.fighters.toLocaleString()}명이 함께 {r.hp.toLocaleString()}번 때렸어요
          {raid.mine ? ` · 나는 ${raid.mine}번, 전체의 ${Math.max(1, Math.round((raid.mine / r.hp) * 100))}%` : ""}.
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
        <h3 id="raid" className="text-[14px] font-bold">💨 {kind.escaped}</h3>
        <p className="text-[11.5px] opacity-75">{order}</p>
        <p className="mt-0.5 text-[12px] opacity-85">
          {r.fighters.toLocaleString()}명이 {Math.min(r.hits, r.hp).toLocaleString()}/{r.hp.toLocaleString()}번 때렸지만 {formatLeft(RAID_LIFE)} 안에
          쓰러뜨리지 못했어요. 적어도 {need}명이 모여야 해요.
        </p>
        <p className="mt-1 text-[12px] opacity-85">{nextLine}</p>
      </section>
    );
  }

  const escapeIn = r.spawnedAt !== null ? r.spawnedAt + RAID_LIFE - now : RAID_LIFE;
  return (
    <RaidArena
      raid={raid}
      r={r}
      kind={kind}
      now={now}
      say={say}
      footer={
        <>
          <RaidCall id={r.id} name={kind.name} left={left} hp={r.hp} need={need} escapeIn={escapeIn} loud={spent} say={say} />
          <p className="mt-2 text-[11.5px] leading-relaxed opacity-90">
            {RAID_RUBS_PER_STRIKE}번 문지르면 한 방(햇살 때는 절반), 1초에 한 방, 한 사람은 {RAID_HITS_PER_PERSON}방까지 —
            필살기도 이 몫 안에서 써요. 반짝이는 약점을 문지르면 더 세게 들어가고, 반격 경고가 뜨면 단추를 눌러 피해요.{" "}
            {formatLeft(RAID_LIFE)} 안에 쓰러뜨리면 한 번이라도 때린 모두가 희귀 씨앗 상자를 받아요 ({odds}, 잼 {RAID_BOX.jam}).
            하루 {RAID_PER_DAY}번까지 나타나요.
          </p>
        </>
      }
    />
  );
}

/** 쓰러뜨린 순간 — 지켜보던 사람에게만. 느리게 쪼그라들고, 하얗게 번쩍이고, 씨앗이 터진다. */
function RaidFinale({ kind, fighters, mine, hp }: { kind: RaidKind; fighters: number; mine: number; hp: number }) {
  return (
    <section
      aria-live="assertive"
      className="garden-raid raid-finale mt-3 overflow-hidden rounded-2xl px-4 py-5 text-center text-white"
      style={{ background: `linear-gradient(180deg, ${kind.bg[0]}, ${kind.bg[1]})` }}
    >
      <span className="raid-finale-flash" aria-hidden="true" />
      <div className="raid-finale-weed mx-auto" aria-hidden="true">
        <RaidWeedArt kind={kind.id} />
      </div>
      <span className="pointer-events-none absolute inset-0" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} className="raid-finale-seed" style={{ ["--a" as string]: `${(i / 14) * 360}deg`, animationDelay: `${0.9 + (i % 3) * 0.08}s` }}>
            {i % 3 === 0 ? "🌱" : i % 3 === 1 ? "✨" : "🍯"}
          </span>
        ))}
      </span>
      <p className="raid-finale-title relative text-[20px] font-black">🏆 {fighters.toLocaleString()}명이 함께 쓰러뜨렸어요!</p>
      {mine > 0 && <p className="raid-finale-sub relative mt-1 text-[12.5px] font-semibold">내가 친 방 {mine} · 전체의 {Math.max(1, Math.round((mine / hp) * 100))}%</p>}
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
  loud,
  say,
}: {
  /** 물결 id. 링크(/r/<id>)의 미리보기에 남은 체력이 그려진다. */
  id: string;
  /** 거대 잡초 종류 이름. */
  name: string;
  left: number;
  hp: number;
  need: number;
  escapeIn: number;
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
      `거대 잡초 ${josa(name, "이가")} 나타났어요! 체력 ${left}/${hp} · ${formatLeft(escapeIn)} 뒤 도망가요. ${need}명이 모이면 잡아요 🌿`,
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
