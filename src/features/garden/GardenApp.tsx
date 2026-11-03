"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import { useAuth } from "@/lib/firebase/auth";
import { loadGarden, saveGarden } from "@/lib/firebase/garden";

import styles from "./garden.module.css";
import { GardenScenery } from "./GardenArt";
import { gardenFeedback, setGardenSound } from "./feedback";

import { Beds } from "./Beds";
import { Dex } from "./Dex";
import { FlowerBed } from "./FlowerBed";
import { Toast } from "./parts";
import { PlazaView } from "./PlazaView";
import { bloomBonus, caresFor, formatLeft, isMeteor, isRaining, nextMeteor, nextMonsoon, nextRain } from "./rules";
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

const TABS: Array<{ id: Tab; label: string; icon: string }> = [
  { id: "beds", icon: "🌱", label: "텃밭" },
  { id: "shop", icon: "🏡", label: "상점" },
  { id: "flowers", icon: "🌸", label: "꽃밭" },
  { id: "plaza", icon: "⛲", label: "광장" },
  { id: "dex", icon: "📖", label: "도감" },
];

const SAVE_DELAY = 2_000;

export function GardenApp({ catalog }: { catalog: Species[] }) {
  const byId = useMemo(() => new Map(catalog.map((s) => [s.id, s])), [catalog]);
  const data = useGarden((s) => s.data);
  const [now, setNow] = useState(() => Date.now());
  const [tab, setTab] = useState<Tab>("beds");
  const [sound, setSound] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { ready, configured, ensureUser, user } = useAuth();
  const uid = user?.uid ?? null;
  const plaza = usePlaza(uid, now);
  const flowers = useBlooms(uid);

  const say = useCallback((text: string) => {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setGardenSound(false);
  }, []);

  // 시계. 성장·상점·단비가 모두 이 값으로 그려진다.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(id);
  }, []);

  // 정원을 연다. 원본 페이지의 "씨앗 받기"로 왔으면 그 품종을 기억해 둔다.
  const gift = useRef<string | null>(null);
  useEffect(() => {
    useGarden.getState().boot(catalog);
    const url = new URL(window.location.href);
    const id = url.searchParams.get("gift");
    if (!id) return;
    url.searchParams.delete("gift");
    window.history.replaceState(null, "", url.pathname + url.search);
    gift.current = id;
  }, [catalog]);

  // 계정. 광장에 흔적을 남기고 정원을 기기 사이로 옮기려면 있어야 한다.
  useEffect(() => {
    if (!ready || !configured) return;
    void ensureUser();
  }, [ready, configured, ensureUser]);

  // 동기화. 계정의 정원을 한 번 읽어 맞추고(store.link), 그 뒤로는 바뀔 때마다 늦춰서 쓴다.
  // 읽기 전에 쓰면 다른 기기에서 키운 정원을 이 기기의 빈 정원으로 덮는다.
  // 읽지 못했으면 쓰지도 않는다 — 계정 쪽 정원이 무엇인지 모르는 채로 덮게 된다.
  const [syncedFor, setSyncedFor] = useState<string | null>(null);
  const hasData = Boolean(data);
  useEffect(() => {
    if (!uid || !hasData) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let unsubscribe: (() => void) | null = null;
    let warned = false;

    const save = (snapshot: GardenData) =>
      saveGarden(uid, snapshot).catch((error) => {
        console.error("[garden] 정원을 계정에 저장하지 못했다", error);
        if (!warned && alive) say("정원을 계정에 저장하지 못했어요. 이 기기에는 남아 있어요");
        warned = true;
      });

    void (async () => {
      let remote: GardenData | null;
      try {
        remote = await loadGarden<GardenData>(uid);
      } catch (error) {
        console.error("[garden] 계정의 정원을 읽지 못했다", error);
        if (!alive) return;
        setSyncedFor(uid);
        say("계정의 정원을 불러오지 못했어요. 이번에는 이 기기에만 저장돼요");
        return;
      }
      if (!alive) return;
      const result = useGarden.getState().link(uid, remote);
      setSyncedFor(uid);
      const now = useGarden.getState().data;
      if (result === "local" && now) void save(now);
      unsubscribe = useGarden.subscribe((s) => {
        if (!s.data) return;
        if (timer) clearTimeout(timer);
        const snapshot = s.data;
        timer = setTimeout(() => void save(snapshot), SAVE_DELAY);
      });
    })();
    return () => {
      alive = false;
      unsubscribe?.();
      if (timer) clearTimeout(timer);
    };
  }, [uid, hasData, say]);

  // 계정과 맞추기 전에는 그리지 않는다. 그새 심은 것이 계정 정원에 덮여 사라지지 않게.
  const syncing = configured && (!ready || (uid !== null && syncedFor !== uid));

  // 연 것을 한 번 센다. 계정과 맞춘 뒤라야 "익은 밭"이 이 사람의 진짜 정원 기준이다.
  const opened = useRef(false);
  useEffect(() => {
    if (opened.current || !hasData || syncing) return;
    opened.current = true;
    const beds = useGarden.getState().data?.beds ?? [];
    const at = Date.now();
    track("garden_open", { ripe: beds.filter((p) => p && p.ripeAt <= at).length });
  }, [hasData, syncing]);

  // 선물 씨앗은 계정과 맞춘 뒤에 준다(품종마다 한 번). 먼저 주면 계정 정원에 덮여 사라진다.
  useEffect(() => {
    const id = gift.current;
    if (!id || !hasData || syncing) return;
    gift.current = null;
    const species = catalog.find((s) => s.id === id);
    if (!species) return;
    const given = useGarden.getState().gift(species);
    say(given ? `🌱 「${species.title}」 씨앗을 받았어요` : "이 씨앗은 이미 받았어요");
  }, [hasData, syncing, catalog, say]);

  if (!data || syncing) {
    return <p className="py-16 text-center text-[13px] text-smoke">정원을 여는 중…</p>;
  }

  // 품종표에 있는 업적만 센다. 콘텐츠에서 빠진 업적이나 규칙 점검용 문서는 보너스가 되지 않는다.
  const bloomed = catalog.filter((s) => caresFor(s) && flowers.blooms.get(s.id)?.bloomedAt).length;
  const ripe = data.beds.filter((p) => p && p.ripeAt <= now).length;

  return (
    <div className={`${styles.game} garden -mx-4 min-h-[70vh] rounded-t-3xl px-4 pb-10 pt-4 text-ink`}>
      <header className="garden-world-header">
        <GardenScenery raining={isRaining(now)} />
        <div className="garden-world-title"><span className="garden-eyebrow">JAMTONG GARDEN</span><h1>잼통 정원</h1><p>{data.nick}의 작은 초록 세상</p></div>
        <button type="button" className="garden-sound" aria-pressed={sound} aria-label={`효과음 ${sound ? "끄기" : "켜기"}`} onClick={() => { setSound(!sound); setGardenSound(!sound); }}>{sound ? "♪ 켜짐" : "♪ 소리 켜기"}</button>
      </header>
      <div className="garden-hud flex items-center justify-between">
        <p key={data.jam} className="garden-wallet text-[22px] font-bold tabular-nums">
          🍯 {data.jam.toLocaleString()}
          <span className="ml-1 text-[12px] font-medium text-smoke">잼</span>
        </p>
        <WeatherBadge now={now} catalog={catalog} />
      </div>

      <div role="tablist" aria-label="정원" className="garden-nav sticky top-14 z-30 -mx-4 mt-3 flex gap-1 px-3 py-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            id={`garden-tab-${t.id}`}
            aria-controls={`garden-panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            aria-selected={tab === t.id}
            onKeyDown={(e) => {
              const index = TABS.findIndex((item) => item.id === tab);
              const next = e.key === "ArrowRight" ? (index + 1) % TABS.length : e.key === "ArrowLeft" ? (index + TABS.length - 1) % TABS.length : e.key === "Home" ? 0 : e.key === "End" ? TABS.length - 1 : -1;
              if (next < 0) return;
              e.preventDefault();
              setTab(TABS[next].id);
              document.getElementById(`garden-tab-${TABS[next].id}`)?.focus();
            }}
            onClick={() => { gardenFeedback("tap"); setTab(t.id); }}
            className={`relative flex-1 rounded-full py-2 text-[13px] font-semibold ${
              tab === t.id ? "bg-ink text-eggshell" : "bg-[var(--g-panel)] text-graphite"
            }`}
          >
            <span aria-hidden="true" className="garden-nav-icon">{t.icon}</span>{t.label}
            {t.id === "beds" && ripe > 0 && (
              <span className="absolute -right-0.5 -top-1 rounded-full bg-[var(--g-jam)] px-1.5 text-[10px] text-white">{ripe}</span>
            )}
            {t.id === "plaza" && plaza.level === "overgrown" && (
              <span className="absolute -right-0.5 -top-1 rounded-full bg-[var(--g-weed-dark)] px-1.5 text-[10px] text-white">!</span>
            )}
          </button>
        ))}
      </div>

      <div key={tab} role="tabpanel" id={`garden-panel-${tab}`} aria-labelledby={`garden-tab-${tab}`} className={`garden-screen garden-screen-${tab} mt-4`}>
        {tab === "beds" && (
          <Beds
            data={data}
            catalog={catalog}
            byId={byId}
            now={now}
            plaza={plaza.level}
            bonus={bloomBonus(bloomed)}
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

/**
 * 날씨 알림. 지금 오는 것이 있으면 그것을(여럿이면 모두), 없으면 가장 가까운 것 하나를 보인다.
 * 정해진 시각이라 "그때 들어가자"가 된다(§3.6).
 */
function WeatherBadge({ now, catalog }: { now: number; catalog: Species[] }) {
  const rain = nextRain(now);
  const meteor = nextMeteor(now);
  const monsoon = nextMonsoon(now, catalog);

  const active: Array<{ key: string; text: string; className: string }> = [];
  if (isMeteor(now)) {
    active.push({ key: "meteor", text: `🌠 별똥별 · 반짝 변이 · ${formatLeft(meteor.end - now)}`, className: "garden-meteor" });
  }
  if (monsoon && monsoon.start <= now) {
    active.push({
      key: "monsoon",
      text: `🌦 신품종 장마 · 상점에 새 씨앗 · ${formatLeft(monsoon.end - now)}`,
      className: "garden-monsoon",
    });
  }
  if (isRaining(now)) {
    active.push({ key: "rain", text: `🌧 단비 · 성장 ×2 · ${formatLeft(rain.end - now)}`, className: "garden-rain" });
  }
  if (active.length > 0) {
    return (
      <div className="flex flex-col items-end gap-1">
        {active.map((a) => (
          <p key={a.key} className={`${a.className} rounded-full px-3 py-1 text-[12px] font-semibold text-white`}>
            {a.text}
          </p>
        ))}
      </div>
    );
  }

  const upcoming = [
    { label: "단비", start: rain.start },
    { label: "별똥별", start: meteor.start },
    ...(monsoon ? [{ label: "신품종 장마", start: monsoon.start }] : []),
  ].sort((a, b) => a.start - b.start)[0];
  const at = new Date(upcoming.start).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  });
  return (
    <p className="rounded-full bg-[var(--g-panel)] px-3 py-1 text-[12px] text-graphite">
      다음 {upcoming.label} {at} · {formatLeft(upcoming.start - now)} 뒤
    </p>
  );
}
