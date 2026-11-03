"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/lib/firebase/auth";
import { loadGarden, saveGarden } from "@/lib/firebase/garden";

import { Beds } from "./Beds";
import { Dex } from "./Dex";
import { FlowerBed } from "./FlowerBed";
import { Toast } from "./parts";
import { PlazaView } from "./PlazaView";
import { bloomBonus, formatLeft, isRaining, nextRain } from "./rules";
import { Shop } from "./Shop";
import { useGarden, type GardenData } from "./store";
import type { Species } from "./types";
import { useBlooms } from "./useBlooms";
import { usePlaza } from "./usePlaza";

/**
 * 잼통 정원. 설계는 docs/garden-game.md §3 (B안 MVP).
 *
 * 품종표는 서버가 콘텐츠에서 만들어 넘겨 준다. 정원 상태는 이 브라우저에 먼저
 * 쌓이고, 계정이 있으면 Firestore로 따라간다. 광장은 모두가 함께 본다.
 */

type Tab = "beds" | "shop" | "flowers" | "plaza" | "dex";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "beds", label: "텃밭" },
  { id: "shop", label: "상점" },
  { id: "flowers", label: "꽃밭" },
  { id: "plaza", label: "광장" },
  { id: "dex", label: "도감" },
];

const SAVE_DELAY = 2_000;

export function GardenApp({ catalog }: { catalog: Species[] }) {
  const byId = useMemo(() => new Map(catalog.map((s) => [s.id, s])), [catalog]);
  const data = useGarden((s) => s.data);
  const [now, setNow] = useState(() => Date.now());
  const [tab, setTab] = useState<Tab>("beds");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { ready, configured, ensureUser, user } = useAuth();
  const uid = user?.uid ?? null;
  const plaza = usePlaza(uid, now);
  const flowers = useBlooms(uid);

  const say = (text: string) => {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  // 시계. 성장·상점·단비가 모두 이 값으로 그려진다.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(id);
  }, []);

  // 정원을 연다. 원본 페이지의 "씨앗 받기"로 왔으면 씨앗도 준다(품종마다 한 번).
  useEffect(() => {
    useGarden.getState().boot(catalog);
    const url = new URL(window.location.href);
    const gift = url.searchParams.get("gift");
    if (!gift) return;
    url.searchParams.delete("gift");
    window.history.replaceState(null, "", url.pathname + url.search);
    const species = catalog.find((s) => s.id === gift);
    if (!species) return;
    const given = useGarden.getState().gift(species);
    // 알림은 첫 그림이 나간 뒤에 띄운다.
    const t = setTimeout(() => say(given ? `🌱 「${species.title}」 씨앗을 받았어요` : "이 씨앗은 이미 받았어요"), 0);
    return () => clearTimeout(t);
  }, [catalog]);

  // 계정. 광장에 흔적을 남기고 정원을 기기 사이로 옮기려면 있어야 한다.
  useEffect(() => {
    if (!ready || !configured) return;
    void ensureUser();
  }, [ready, configured, ensureUser]);

  // 동기화. 원격을 한 번 읽어 더 새것이면 받고, 그 뒤로는 바뀔 때마다 늦춰서 쓴다.
  // 읽기 전에 쓰면 다른 기기에서 키운 정원을 이 기기의 옛것으로 덮는다.
  useEffect(() => {
    if (!uid || !data) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let unsubscribe: (() => void) | null = null;
    void (async () => {
      try {
        const remote = await loadGarden<GardenData>(uid);
        if (!alive) return;
        if (remote) useGarden.getState().adopt(remote);
      } catch {
        // 읽지 못하면 이 기기의 정원으로 계속 논다.
      }
      if (!alive) return;
      unsubscribe = useGarden.subscribe((s) => {
        if (!s.data) return;
        if (timer) clearTimeout(timer);
        const snapshot = s.data;
        timer = setTimeout(() => void saveGarden(uid, snapshot).catch(() => {}), SAVE_DELAY);
      });
    })();
    return () => {
      alive = false;
      unsubscribe?.();
      if (timer) clearTimeout(timer);
    };
    // 계정이 바뀔 때와 정원이 처음 생길 때만 다시 건다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, Boolean(data)]);

  if (!data) {
    return <p className="py-16 text-center text-[13px] text-smoke">정원을 여는 중…</p>;
  }

  const ripe = data.beds.filter((p) => p && p.ripeAt <= now).length;

  return (
    <div className="garden -mx-4 min-h-[70vh] rounded-t-3xl px-4 pb-10 pt-4 text-ink">
      <div className="flex items-center justify-between">
        <p className="text-[22px] font-bold tabular-nums">
          🍯 {data.jam.toLocaleString()}
          <span className="ml-1 text-[12px] font-medium text-smoke">잼</span>
        </p>
        <RainBadge now={now} />
      </div>

      <div role="tablist" aria-label="정원" className="sticky top-14 z-30 -mx-4 mt-3 flex gap-1 bg-[var(--g-bg)]/95 px-4 py-2 backdrop-blur">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`relative flex-1 rounded-full py-2 text-[13px] font-semibold ${
              tab === t.id ? "bg-ink text-eggshell" : "bg-[var(--g-panel)] text-graphite"
            }`}
          >
            {t.label}
            {t.id === "beds" && ripe > 0 && (
              <span className="absolute -right-0.5 -top-1 rounded-full bg-[var(--g-jam)] px-1.5 text-[10px] text-white">{ripe}</span>
            )}
            {t.id === "plaza" && plaza.level === "overgrown" && (
              <span className="absolute -right-0.5 -top-1 rounded-full bg-[var(--g-weed-dark)] px-1.5 text-[10px] text-white">!</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === "beds" && (
          <Beds
            data={data}
            catalog={catalog}
            byId={byId}
            now={now}
            plaza={plaza.level}
            bonus={bloomBonus(flowers.bloomed)}
            care={flowers.care}
            say={say}
          />
        )}
        {tab === "shop" && <Shop data={data} catalog={catalog} byId={byId} now={now} say={say} />}
        {tab === "flowers" && (
          <FlowerBed data={data} catalog={catalog} blooms={flowers.blooms} uid={uid} now={now} say={say} />
        )}
        {tab === "plaza" && <PlazaView plaza={plaza} catalog={catalog} byId={byId} now={now} say={say} />}
        {tab === "dex" && <Dex data={data} catalog={catalog} />}
      </div>

      <Toast text={toast} />
    </div>
  );
}

function RainBadge({ now }: { now: number }) {
  const w = nextRain(now);
  if (isRaining(now)) {
    return (
      <p className="garden-rain rounded-full px-3 py-1 text-[12px] font-semibold text-white">
        🌧 단비 · 성장 ×2 · {formatLeft(w.end - now)}
      </p>
    );
  }
  const at = new Date(w.start).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  });
  return (
    <p className="rounded-full bg-[var(--g-panel)] px-3 py-1 text-[12px] text-graphite">
      다음 단비 {at} · {formatLeft(w.start - now)} 뒤
    </p>
  );
}
