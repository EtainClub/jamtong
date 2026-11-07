"use client";

import { useEffect, useState } from "react";

import { track } from "@/lib/analytics";
import { firebaseConfigured } from "@/lib/firebase/client";
import { loadPublicGarden, waterGarden, type PublicGarden } from "@/lib/firebase/gardens";

import { PlantArt } from "./GardenArt";
import { gardenFeedback } from "./feedback";
import { TitleChips } from "./parts";
import { formatLeft, TIER_LABEL, WATER_CUT, WATER_PER_DAY } from "./rules";
import { useGarden } from "./store";
import type { Species } from "./types";

/**
 * 친구 정원에 놀러 가기 — /garden?visit=<공개id> (docs/garden-game.md §3.10).
 *
 * 링크를 받은 사람이 처음 만나는 화면이다. 정원을 보여 주고, 물을 주게 하고,
 * 자기 정원으로 데려간다. 거기서 쪽지와 전광판을 거쳐 원본으로 간다.
 *
 * ★ 품종표에 있는 id만 그린다. 공개 문서는 아무 값이나 담길 수 있다.
 */
type Loaded = { garden: PublicGarden; mine: boolean; wateredToday: boolean };

export function VisitView({
  gid,
  uid,
  byId,
  now,
  say,
  onLeave,
}: {
  gid: string;
  uid: string | null;
  byId: Map<string, Species>;
  now: number;
  say: (text: string) => void;
  onLeave: () => void;
}) {
  const [state, setState] = useState<{ gid: string; uid: string | null; loaded: Loaded | null | "error" } | null>(null);
  const [watering, setWatering] = useState(false);
  const room = useGarden((s) => (s.data ? s.waterRoom(gid) : 0));
  const nick = useGarden((s) => s.data?.nick ?? "");

  useEffect(() => {
    let alive = true;
    loadPublicGarden(gid, uid)
      .then((loaded) => {
        if (!alive) return;
        setState({ gid, uid, loaded });
        if (loaded) track("garden_visit", { mine: loaded.mine });
        if (loaded && !loaded.mine) useGarden.getState().metFriend(gid, loaded.garden.nick);
      })
      .catch((error) => {
        console.error("[gardens] 정원을 읽지 못했다", error);
        if (alive) setState({ gid, uid, loaded: "error" });
      });
    return () => {
      alive = false;
    };
  }, [gid, uid]);

  const current = state?.gid === gid && state.uid === uid ? state.loaded : undefined;

  const back = (
    <button
      type="button"
      onClick={onLeave}
      className="mt-4 w-full rounded-full bg-ink py-2.5 text-[13px] font-semibold text-eggshell"
    >
      🌱 내 정원으로 가기
    </button>
  );

  if (!firebaseConfigured) {
    return (
      <div className="py-10 text-center text-[13px] text-smoke">
        이 환경에서는 친구 정원에 갈 수 없어요.
        {back}
      </div>
    );
  }
  if (current === undefined) return <p className="py-16 text-center text-[13px] text-smoke">정원에 가는 중…</p>;
  if (current === "error" || current === null) {
    return (
      <div className="py-10 text-center text-[13px] text-smoke">
        {current === null ? "이 정원이 없거나 주인이 공개를 껐어요." : "정원을 불러오지 못했어요. 잠시 뒤 다시 해 보세요."}
        {back}
      </div>
    );
  }

  const { garden, mine, wateredToday } = current;
  const beds = garden.beds.map((b) => (b && byId.has(b.s) ? { ...b, species: byId.get(b.s)! } : null));
  const ripe = beds.filter((b) => b && b.r <= now).length;

  const water = async () => {
    if (!uid || watering) return;
    setWatering(true);
    const result = await waterGarden(gid, uid, nick || "이웃");
    setWatering(false);
    if (result === "ok") {
      useGarden.getState().gaveWater(gid);
      setState((s) => (s && s.loaded && s.loaded !== "error" ? { ...s, loaded: { ...s.loaded, wateredToday: true } } : s));
      gardenFeedback("reward");
      track("garden_water");
      say(`🚿 물을 줬어요 · 내 텃밭도 ${Math.round(WATER_CUT * 100)}% 빨리 자라요`);
    } else if (result === "already") {
      setState((s) => (s && s.loaded && s.loaded !== "error" ? { ...s, loaded: { ...s.loaded, wateredToday: true } } : s));
      say("오늘은 이미 물을 줬어요");
    } else if (result === "gone") say("주인이 정원 공개를 껐어요");
    else say("물을 주지 못했어요. 잠시 뒤 다시 해 보세요");
  };

  return (
    <div>
      <p className="text-[11px] font-semibold tracking-wide text-smoke">놀러 온 정원</p>
      <h2 className="mt-0.5 text-[18px] font-bold">{garden.nick || "이름 없는"}의 정원</h2>
      <TitleChips levels={garden.titles} className="mt-1.5" />
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <Stat value={garden.dex} label="도감" />
        <Stat value={garden.golden} label="황금 변이" />
        <Stat value={garden.rainbow} label="무지개 변이" />
      </div>

      <ul className="garden-beds mt-4 grid grid-cols-3 gap-2" aria-label="텃밭">
        {beds.map((b, i) => (
          <li key={i} className="garden-soil relative aspect-square overflow-hidden rounded-2xl p-1.5 text-center text-[10.5px] text-[var(--g-soil-ink)]">
            {b ? (
              <>
                <span className="block h-[70%]">
                  <PlantArt species={b.species} progress={Math.min(1, Math.max(0, (now - b.p) / Math.max(1, b.r - b.p)))} />
                </span>
                <span className="block truncate font-semibold">{b.species.title}</span>
                <span className="block opacity-80">
                  {TIER_LABEL[b.species.tier]} · {b.r <= now ? "다 익음" : formatLeft(b.r - now)}
                </span>
              </>
            ) : (
              <span className="grid h-full place-items-center opacity-60">빈 밭</span>
            )}
          </li>
        ))}
      </ul>

      {mine ? (
        <p className="mt-4 rounded-2xl bg-[var(--g-panel)] px-3.5 py-3 text-[12.5px]">
          내 정원이에요. 이 링크를 친구에게 보내면 친구가 물을 줄 수 있어요.
        </p>
      ) : (
        <div className="mt-4 rounded-2xl bg-[var(--g-panel)] px-3.5 py-3">
          <button
            type="button"
            disabled={!uid || watering || wateredToday || room <= 0}
            onClick={() => void water()}
            className="w-full rounded-full bg-[var(--g-leaf)] py-2.5 text-[13.5px] font-semibold text-white disabled:opacity-40"
          >
            {wateredToday ? "오늘 물을 줬어요 💧" : room <= 0 ? `오늘 줄 물을 다 썼어요 (${WATER_PER_DAY}번)` : "🚿 물 주기"}
          </button>
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-smoke">
            물을 주면 이 정원과 내 정원 모두, 자라는 중인 포기의 남은 시간이 {Math.round(WATER_CUT * 100)}% 줄어요. 한
            정원에 하루 한 번, 하루 {WATER_PER_DAY}번까지.
            {ripe > 0 ? ` 지금 다 익은 밭이 ${ripe}칸 있어요.` : ""}
          </p>
        </div>
      )}
      {back}
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-[var(--g-panel)] py-2.5">
      <p className="text-[18px] font-bold tabular-nums">{value.toLocaleString()}</p>
      <p className="text-[11px] text-smoke">{label}</p>
    </div>
  );
}
