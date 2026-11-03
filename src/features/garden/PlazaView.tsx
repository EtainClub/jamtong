"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { track } from "@/lib/analytics";
import { cellId } from "@/lib/firebase/plaza";

import { fruitIcon, hash, kstDay, PLAZA_CELLS, PLAZA_LABEL, PLAZA_SPEED, WEED, WEED_REWARD_PER_DAY, WEED_SEED_ODDS } from "./rules";
import { useGarden } from "./store";
import type { Plaza, Weed } from "./usePlaza";
import type { Species } from "./types";

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
  now,
  say,
}: {
  plaza: Plaza;
  catalog: Species[];
  byId: Map<string, Species>;
  now: number;
  say: (text: string) => void;
}) {
  const weedByCell = new Map(plaza.weeds.map((w) => [w.cell, w]));
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

      <div className="garden-plaza mt-3 grid grid-cols-6 gap-1.5 rounded-3xl p-2.5">
        {Array.from({ length: PLAZA_CELLS }, (_, i) => {
          const weed = weedByCell.get(cellId(i));
          return (
            <div key={i} className="relative aspect-square rounded-xl bg-[var(--g-grass)]">
              {weed && <WeedButton key={`${weed.cell}-${weed.since}`} weed={weed} onPulled={onPulled} />}
              {bursts[cellId(i)] && <Dirt key={bursts[cellId(i)]} />}
            </div>
          );
        })}
      </div>

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
  const last = useRef<{ x: number; y: number; dist: number } | null>(null);

  const rub = () => {
    if (state !== "idle") return;
    setShake((s) => s + 1);
    setRubs((r) => {
      const next = r + 1;
      if (next >= need) {
        setState("pulling");
        void onPulled(weed).then((ok) => setState(ok ? "gone" : "idle"));
      }
      return next;
    });
  };

  if (state === "gone") return null;

  const variant = hash(weed.cell + weed.since) % 3;
  const scale = weed.stage === "young" ? 0.62 : weed.stage === "grown" ? 0.85 : 1.05;

  return (
    <button
      type="button"
      aria-label={`${WEED[weed.stage].label} 뽑기 (${need - rubs}번 남음)`}
      className="absolute inset-0 grid touch-none select-none place-items-center"
      onClick={(e) => {
        // 드래그로 이미 센 것은 다시 세지 않는다. 키보드·두드림만 여기서 센다.
        if (e.detail === 0 || !last.current || last.current.dist < RUB_PX) rub();
      }}
      onPointerDown={(e) => {
        last.current = { x: e.clientX, y: e.clientY, dist: 0 };
      }}
      onPointerMove={(e) => {
        const l = last.current;
        if (!l || e.buttons === 0) return;
        const d = Math.hypot(e.clientX - l.x, e.clientY - l.y);
        l.x = e.clientX;
        l.y = e.clientY;
        l.dist += d;
        if (Math.floor(l.dist / RUB_PX) > Math.floor((l.dist - d) / RUB_PX)) rub();
      }}
    >
      <svg
        key={shake}
        viewBox="0 0 40 40"
        className={`h-full w-full ${shake ? "garden-shake" : ""} ${state === "pulling" ? "garden-lift" : ""}`}
        style={{ transform: `scale(${scale})` }}
      >
        <WeedShape variant={variant} tough={weed.stage === "tough"} />
      </svg>
      {rubs > 0 && (
        <span className="pointer-events-none absolute bottom-0.5 h-1 w-3/4 overflow-hidden rounded-full bg-black/20">
          <span className="block h-full bg-white" style={{ width: `${(rubs / need) * 100}%` }} />
        </span>
      )}
    </button>
  );
}

function WeedShape({ variant, tough }: { variant: number; tough: boolean }) {
  const fill = tough ? "var(--g-weed-dark)" : "var(--g-weed)";
  if (variant === 0) {
    return (
      <g fill={fill}>
        <path d="M20 36 C18 26 10 22 6 12 C14 16 18 22 20 30 Z" />
        <path d="M20 36 C22 24 30 20 34 8 C26 14 22 22 20 30 Z" />
        <path d="M20 36 C19 26 20 16 20 4 C22 16 22 26 21 36 Z" />
      </g>
    );
  }
  if (variant === 1) {
    return (
      <g fill={fill}>
        <ellipse cx="13" cy="22" rx="5" ry="11" transform="rotate(-25 13 22)" />
        <ellipse cx="27" cy="22" rx="5" ry="11" transform="rotate(25 27 22)" />
        <ellipse cx="20" cy="17" rx="4.5" ry="12" />
        {tough && <circle cx="20" cy="6" r="3" fill="var(--g-weed-flower)" />}
      </g>
    );
  }
  return (
    <g fill={fill}>
      <path d="M8 36 L14 10 L17 36 Z" />
      <path d="M15 36 L21 4 L24 36 Z" />
      <path d="M22 36 L30 12 L32 36 Z" />
      {tough && <path d="M4 36 L9 20 L11 36 Z" />}
    </g>
  );
}
