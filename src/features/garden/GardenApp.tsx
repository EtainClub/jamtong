"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import { useAuth } from "@/lib/firebase/auth";
import { loadGarden, saveGarden } from "@/lib/firebase/garden";
import { loadCounter, type Counter } from "@/lib/firebase/ilchon";
import { loadTodayRaids } from "@/lib/firebase/raid";

import styles from "./garden.module.css";
import { GardenScenery } from "./GardenArt";
import { gardenFeedback, leaveGardenSound, restoreGardenSound, savedGardenSound, setGardenSound, setGardenTrack } from "./feedback";

import { Beds } from "./Beds";
import { CoachQuest, TabTip } from "./GardenCoach";
import { coachStep } from "./coach";
import { GardenCards } from "./GardenCards";
import { GardenGuide } from "./GardenGuide";
import { GardenNav, SegmentSwitch } from "./GardenNav";
import { FlowerBed } from "./FlowerBed";
import { Greenhouse } from "./Greenhouse";
import { GardenHome } from "./home/GardenHome";
import { IlchonTab } from "./ilchon/IlchonTab";
import { ilchonNews, useIlchonLive, useOwnerIlchon, useRoomLines } from "./ilchon/live";
import { defaultNav, homeNews, navOf, SEGMENTS, TABS, type GardenTab, type Nav, type NewsItem, type Place, type Segment } from "./nav";
import { TitleChips, Toast } from "./parts";
import { PlazaView } from "./PlazaView";
import { HOME_RAID_REFRESH } from "./raid/rules";
import { raidGapWindow, raidPhase, type RaidWave } from "./rules";
import { bloomBonus, caresFor, formatLeft, isMeteor, isRaining, kstDay, kstDayNumber, nextMeteor, nextMonsoon, nextRain, PUBLIC_ID, TITLE_ORDER, titleLabel, titleLevels, type TitleId } from "./rules";
import { ShareCard } from "./ShareCard";
import { GardenShareButton } from "./GardenShareButton";
import { takeInviteParam, useInvite } from "./invite";
import { useShare } from "./share";
import { Shop } from "./shop/Shop";
import { VisitView } from "./VisitView";
import { BASKET_MAX, useGarden, type GardenData } from "./store";
import type { Leaf, Species } from "./types";
import { Neighbors } from "./Neighbors";
import { useBlooms } from "./useBlooms";
import { usePlaza } from "./usePlaza";

/**
 * 잼통 정원. 설계는 docs/garden-game.md §3 (B안 MVP), 화면 구조는 docs/garden-miniroom.md §3.
 *
 * 품종표는 서버가 콘텐츠에서 만들어 넘겨 준다. 정원 상태는 이 브라우저에 먼저
 * 쌓이고, 계정이 있으면 Firestore로 따라간다. 광장은 모두가 함께 본다.
 *
 * 하단 탭 다섯(방·텃밭·광장·상점·1촌)과 탭 안의 칸은 nav.ts. 사이트 하단 탭 대신
 * 정원 하단 탭을 그리고(app/garden/page.tsx), 위쪽 바에 "← 잼통"과 잼 지갑을 둔다.
 */

const SAVE_DELAY = 2_000;

export function GardenApp({
  catalog,
  leaves,
}: {
  catalog: Species[];
  leaves: Leaf[];
}) {
  const byId = useMemo(() => new Map(catalog.map((s) => [s.id, s])), [catalog]);
  const data = useGarden((s) => s.data);
  const [now, setNow] = useState(() => Date.now());
  // "같이 잡자" 링크(/garden?tab=plaza)로 왔으면 그 자리부터. 옛 탭 이름도 받는다(nav.ts의 navOf).
  // 없으면 null로 두고, 정원을 연 뒤에 정한다(아래 defaultNav). 첫 렌더는 "여는 중"만 그리므로 서버 렌더와 어긋나지 않는다.
  const [nav, setNav] = useState<Nav | null>(() => {
    if (typeof window === "undefined") return null;
    return navOf(new URL(window.location.href).searchParams.get("tab"));
  });
  // 켜 두었던 소리. 첫 렌더는 "여는 중"만 그리므로 서버 렌더와 어긋나지 않는다.
  const [sound, setSound] = useState(() => typeof window !== "undefined" && savedGardenSound());
  const [showShare, setShowShare] = useState(false);
  /** 열린 안내의 절. null이면 닫힘. */
  const [guide, setGuide] = useState<string | null>(null);
  /** 그림 카드 안내. "? 안내"는 이것부터 연다 — 글 안내는 그 안의 "자세한 규칙"으로. */
  const [cards, setCards] = useState(false);
  const openGuide = useCallback((section = "loop") => {
    gardenFeedback("tap");
    setCards(false);
    setGuide(section);
  }, []);
  const openCards = useCallback(() => {
    gardenFeedback("tap");
    setGuide(null);
    setCards(true);
  }, []);
  // 친구 정원 링크(/garden?visit=<공개id>)로 왔으면 그 정원부터 보인다.
  // 첫 렌더는 데이터가 없어 "여는 중"만 그리므로, 서버 렌더와 어긋나지 않는다.
  const [visit, setVisit] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const id = new URL(window.location.href).searchParams.get("visit");
    return id && PUBLIC_ID.test(id) ? id : null;
  });
  const leaveVisit = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("visit");
    window.history.replaceState(null, "", url.pathname + url.search);
    setVisit(null);
  }, []);
  /** 다른 방으로 간다(마실 — 1촌 목록·방명록 이름·아무 방이나·명패). */
  const visitRoom = useCallback((gid: string) => {
    if (!PUBLIC_ID.test(gid)) return;
    setVisit(gid);
    window.scrollTo({ top: 0 });
  }, []);
  /** 자리(탭이나 칸)로 간다. 놀러 간 중이면 내 정원으로 돌아온다. */
  const go = useCallback(
    (place: Place) => {
      const next = navOf(place);
      if (!next) return;
      if (visit) leaveVisit();
      setNav(next);
      window.scrollTo({ top: 0 });
    },
    [visit, leaveVisit],
  );

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

  const toggleSound = () => {
    const on = !sound;
    setSound(on);
    setGardenSound(on);
    if (on) say("♪ 음악을 켰어요 · 무음 모드에서는 들리지 않아요");
  };

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    leaveGardenSound();
  }, []);

  // 브라우저가 자동 재생을 막으므로 켜 두었어도 실제 소리는 첫 터치 때 난다.
  useEffect(() => {
    restoreGardenSound();
  }, []);

  // 내 방 음악. 남의 방에 있는 동안은 VisitView가 그 방의 곡을 틀고, 돌아오면 여기서 내 곡으로 되돌린다.
  const myBgm = useGarden((s) => s.data?.room.bgm);
  useEffect(() => {
    if (myBgm && !visit) setGardenTrack(myBgm);
  }, [myBgm, visit]);

  // 시계. 성장·상점·단비가 모두 이 값으로 그려진다.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(id);
  }, []);

  // 정원을 연다. 원본 페이지의 "씨앗 받기"로 왔으면 그 품종을 기억해 둔다.
  const gift = useRef<string | null>(null);
  const inviteIn = useRef<string | null>(null);
  useEffect(() => {
    useGarden.getState().boot(catalog);
    // 개발 모드는 효과를 두 번 돌린다. 두 번째에는 주소에서 이미 지워져 null이므로 덮지 않는다.
    const invited = takeInviteParam();
    if (invited) inviteIn.current = invited;
    const url = new URL(window.location.href);
    // 탭은 처음 한 번만 따른다. 주소에 남기면 새로고침해도 그 탭으로 돌아간다.
    if (url.searchParams.has("tab")) {
      url.searchParams.delete("tab");
      window.history.replaceState(null, "", url.pathname + url.search);
    }
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

  // 칭호. 정원 기록에서 셈하므로 따로 저장하지 않는다. 계정과 맞춘 뒤의 단계를 기준으로, 오르면 알린다.
  const dex = data?.dex;
  const raids = data?.raids;
  const levels = useMemo(() => (dex && raids ? titleLevels({ dex, raids }) : null), [dex, raids]);
  const seenLevels = useRef<Record<TitleId, number> | null>(null);
  useEffect(() => {
    if (!levels || syncing) return;
    const before = seenLevels.current;
    seenLevels.current = levels;
    const up = before && TITLE_ORDER.find((id) => levels[id] > before[id]);
    if (!up) return;
    track("title_up", { title: up, level: levels[up] });
    gardenFeedback("reward");
    say(`🏅 새 칭호 · ${titleLabel(up, levels[up])}`);
  }, [levels, syncing, say]);

  useShare(uid, !syncing, now, say);
  useInvite(uid, hasData && !syncing, inviteIn, catalog, say);

  // 1촌(docs/garden-miniroom.md §5). 받은 신청은 가볍게 지켜보고, 내 방의 1촌평·방명록·손님 수는 홈을 볼 때 읽는다.
  const knocks = useOwnerIlchon(uid, !syncing);
  const myGid = data?.share.on ? data.share.id : null;
  const onHome = !visit && nav?.tab === "room";
  const myLines = useRoomLines(myGid, Boolean(uid) && !syncing && onHome);
  const [counter, setCounter] = useState<{ gid: string; c: Counter } | null>(null);
  useEffect(() => {
    if (!myGid || !uid || syncing || !onHome) return;
    let alive = true;
    loadCounter(myGid, kstDayNumber(Date.now()))
      .then((c) => alive && setCounter({ gid: myGid, c }))
      .catch((error) => console.error("[ilchon] 손님 수를 읽지 못했다", error));
    return () => {
      alive = false;
    };
  }, [myGid, uid, syncing, onHome]);
  const friendRooms = useIlchonLive((s) => s.rooms);

  // 거대 잡초 소식(새 소식 칸). 홈은 광장 구독을 두지 않는다 — 홈을 볼 때 오늘 물결을 한 번 읽고(문서 id 범위 질의
  // 하나, 있는 물결 수만큼 읽기), HOME_RAID_REFRESH보다 자주 다시 읽지 않는다. 빈틈까지 남은 시간은 시계로 셈한다.
  const [homeRaid, setHomeRaid] = useState<{ day: number; at: number; wave: RaidWave | null } | null>(null);
  const raidDay = kstDayNumber(now);
  const raidStale = !homeRaid || homeRaid.day !== raidDay || now - homeRaid.at > HOME_RAID_REFRESH;
  useEffect(() => {
    if (!configured || !onHome || syncing || !raidStale) return;
    let alive = true;
    loadTodayRaids(raidDay)
      .then((list) => {
        const last = list.sort((a, b) => b.wave - a.wave)[0];
        if (alive) setHomeRaid({ day: raidDay, at: Date.now(), wave: last?.raid ?? null });
      })
      .catch((error) => console.error("[raid] 홈 소식용 거대 잡초를 읽지 못했다", error));
    return () => {
      alive = false;
    };
  }, [configured, onHome, syncing, raidStale, raidDay]);

  // 주소에 탭이 없었으면, 정원을 연 뒤 한 번 정한다 — 첫 수확 전이면 텃밭, 아니면 방(nav.ts의 defaultNav).
  // 렌더 중 상태 고치기(React 문서의 "이전 렌더의 정보 저장")라 한 번 더 그릴 뿐 효과를 돌지 않는다.
  if (nav === null && data && !syncing) setNav(defaultNav(Object.keys(data.dex).length > 0));

  if (!data || syncing || !nav) {
    return <p className="py-16 text-center text-[13px] text-smoke">정원을 여는 중…</p>;
  }

  // 품종표에 있는 업적만 센다. 콘텐츠에서 빠진 업적이나 규칙 점검용 문서는 보너스가 되지 않는다.
  const bloomed = catalog.filter((s) => caresFor(s) && flowers.blooms.get(s.id)?.bloomedAt).length;
  const ripe = data.beds.filter((p) => p && p.ripeAt <= now).length;
  const { tab, seg } = nav;
  const onTab = (t: GardenTab) => {
    if (visit) leaveVisit();
    setNav(t === tab && !visit ? nav : { tab: t, seg: SEGMENTS[t][0].id });
    window.scrollTo({ top: 0 });
  };
  const onSeg = (s: Segment) => setNav({ tab, seg: s });
  // 방·상점·1촌은 다이어리 속지 색, 텃밭·광장은 정원의 초록(§3.3).
  const paper = !visit && (tab === "room" || tab === "shop" || tab === "friends");
  const today = kstDay(now);
  const nectar = catalog.filter((s) => {
    const b = flowers.blooms.get(s.id);
    return caresFor(s) && b?.bloomedAt && (b.ownerUid === uid || b.ownerUid === "local") && !(data.nectar.day === today && data.nectar.taken.includes(s.id));
  }).length;
  const coach = <CoachQuest data={data} now={now} tab={seg} onGo={go} onGuide={openCards} />;
  // 상점은 퀘스트 카드가 이미 설명하고 있으면 팁을 미룬다. 둘이 겹쳐 쌓이지 않게.
  const tip = !(seg === "shop" && coachStep(data, now)) && <TabTip tab={seg} data={data} onGuide={openGuide} />;
  const title = visit ? "놀러 온 방" : tab === "room" ? `${data.nick}의 방` : TABS.find((t) => t.id === tab)?.label;
  // 1촌 소식(새 소식 칸). 1촌 방은 1촌 탭을 열었을 때 읽은 것을 쓴다 — 홈을 위해 따로 읽지 않는다.
  const freshGb = myLines.guestbook?.filter((l) => l.at > data.ilchon.seenGb && !l.hidden && !data.ilchon.blocked.some((b) => b.uid === l.uid)).length ?? 0;
  const latest = ilchonNews(data.ilchon.friends, friendRooms, byId)[0];
  const extra: NewsItem[] = [
    ...(knocks.length ? [{ key: "knocks", icon: "🤝", text: `1촌 신청 ${knocks.length}`, go: "friends" as const, goLabel: "1촌" }] : []),
    ...(freshGb ? [{ key: "guestbook", icon: "📮", text: `새 방명록 ${freshGb}`, go: "guestbook" as const, goLabel: "방명록" }] : []),
    ...(latest ? [{ key: "ilchon-news", icon: "🌿", text: `${latest.nick} — ${latest.text}`, go: "friends" as const, goLabel: "1촌" }] : []),
  ];

  return (
    <div className={`${styles.game} garden ${paper ? "is-paper" : ""} -mx-4 min-h-[70vh] rounded-t-3xl px-4 pb-28 text-ink`}>
      <div className="garden-topbar">
        <Link href="/" className="garden-back">← 잼통</Link>
        <p className="garden-topbar-title">{title}</p>
        <p key={data.jam} className="garden-wallet tabular-nums" aria-label={`잼 ${data.jam.toLocaleString()}`}>
          🍯 {data.jam.toLocaleString()}
        </p>
      </div>
      <div className="garden-toolbar">
        <WeatherBadge now={now} catalog={catalog} onOpen={() => openGuide("weather")} />
        <div className="garden-toolbar-actions">
          {!visit && (
            <button type="button" className="garden-pill" aria-expanded={showShare} aria-controls="garden-share-card" onClick={() => { gardenFeedback("tap"); setShowShare(!showShare); }}>
              🔗 {data.share.on ? "공개 중" : "자랑하기"}
            </button>
          )}
          <GardenShareButton
            nick={data.nick}
            shareId={data.share.id}
            shareOn={data.share.on}
            visit={visit}
            onNeedPublic={() => setShowShare(true)}
            say={say}
          />
          <button type="button" className="garden-pill" aria-haspopup="dialog" onClick={openCards}>? 안내</button>
          <button type="button" className="garden-pill" aria-pressed={sound} aria-label={`음악과 효과음 ${sound ? "끄기" : "켜기"}`} onClick={toggleSound}>♪</button>
        </div>
      </div>

      {showShare && !visit && (
        <div id="garden-share-card" className="mt-3">
          <ShareCard data={data} now={now} say={say} />
        </div>
      )}

      {visit ? (
        <div className="mt-4">
          <VisitView gid={visit} uid={uid} byId={byId} now={now} say={say} onLeave={leaveVisit} onVisit={visitRoom} />
        </div>
      ) : (
        <div role="tabpanel" id={`garden-panel-${tab}`} aria-labelledby={`garden-tab-${tab}`} className={`garden-screen garden-screen-${seg} mt-3`}>
          {(tab === "beds" || tab === "plaza") && (
            <header className="garden-world-header is-band">
              <GardenScenery raining={isRaining(now)} />
              <div className="garden-world-title"><span className="garden-eyebrow">JAMTONG GARDEN</span><p>{data.nick}의 작은 초록 세상</p><TitleChips levels={levels ?? undefined} className="mt-1.5" /></div>
            </header>
          )}
          <SegmentSwitch tab={tab} seg={seg} onSeg={onSeg} />

          {tab === "room" && (
            <GardenHome
              data={data}
              catalog={catalog}
              byId={byId}
              now={now}
              seg={seg}
              onSeg={onSeg}
              onGo={go}
              say={say}
              sound={sound}
              onSound={toggleSound}
              levels={levels ?? undefined}
              coach={seg === "room" ? coach : undefined}
              tip={tip}
              news={homeNews(
                { beds: data.beds, basket: data.basket.length, basketMax: BASKET_MAX, plaza: plaza.level, nectar, extra, raid: raidNews(homeRaid?.day === raidDay ? homeRaid.wave : null, now) },
                now,
              )}
              visitors={counter?.gid === myGid ? counter.c : undefined}
              uid={uid}
              lines={myGid ? myLines : null}
              onVisit={visitRoom}
            />
          )}

          {tab !== "room" && (
            <div key={seg} className="garden-screen-body mt-4">
              {(seg === "beds" || seg === "shop") && coach}
              {seg !== "beds" && tip && <div className="mt-4">{tip}</div>}
              <div className="mt-4">
                {seg === "beds" && (
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
                {seg === "greenhouse" && <Greenhouse data={data} catalog={catalog} now={now} say={say} />}
                {seg === "flowers" && <FlowerBed data={data} catalog={catalog} blooms={flowers.blooms} uid={uid} now={now} say={say} />}
                {seg === "plaza" && <PlazaView plaza={plaza} catalog={catalog} byId={byId} leaves={leaves} uid={uid} now={now} say={say} />}
                {seg === "shop" && (
                  <div className="garden-diary is-plain">
                    <Shop data={data} catalog={catalog} byId={byId} now={now} say={say} />
                  </div>
                )}
                {/* 1촌 탭(docs/garden-miniroom.md §5). 1촌 위, 지금까지의 이웃(함께 쌓은 것·명패)은 그 아래. */}
                {seg === "friends" && (
                  <>
                    <IlchonTab data={data} uid={uid} byId={byId} knocks={knocks} onVisit={visitRoom} say={say} />
                    <div className="garden-diary is-plain mt-6">
                      <Neighbors uid={uid} blooms={flowers.blooms} byId={byId} now={now} onVisit={visitRoom} say={say} />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <GardenNav tab={visit ? null : tab} onTab={onTab} ripe={ripe} overgrown={plaza.level === "overgrown"} knocks={knocks.length} />

      {cards && <GardenCards onClose={() => setCards(false)} onDetail={() => openGuide("loop")} />}
      {guide && <GardenGuide section={guide} onClose={() => setGuide(null)} />}
      <Toast text={toast} />
    </div>
  );
}

/** 홈 새 소식의 거대 잡초 한 줄. 싸우는 중이 아니면 비운다(광장이 무성한지는 homeNews가 따로 말한다). */
function raidNews(wave: RaidWave | null, now: number): { active: boolean; text?: string } | undefined {
  if (!wave || raidPhase(wave, now) !== "active") return undefined;
  const gap = raidGapWindow(now, wave.spawnedAt, wave.hp);
  if (!gap) return { active: true };
  return {
    active: true,
    text: gap.now ? "거대 잡초 등장 · 지금 빈틈! 한 번이 ×2" : `거대 잡초 등장 · 빈틈 ${formatLeft(gap.start - now)} 뒤`,
  };
}

/**
 * 날씨 알림. 지금 오는 것이 있으면 그것을(여럿이면 모두), 없으면 가장 가까운 것 하나를 보인다.
 * 정해진 시각이라 "그때 들어가자"가 된다(§3.6).
 */
function WeatherBadge({ now, catalog, onOpen }: { now: number; catalog: Species[]; onOpen: () => void }) {
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
      <button type="button" onClick={onOpen} aria-label={`${active.map((a) => a.text).join(", ")} · 날씨 안내 보기`} className="garden-weather flex flex-col items-end gap-1">
        {active.map((a) => (
          <span key={a.key} className={`${a.className} rounded-full px-3 py-1 text-[12px] font-semibold text-white`}>
            {a.text}
          </span>
        ))}
      </button>
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
    <button type="button" onClick={onOpen} className="garden-weather garden-weather-next rounded-full bg-[var(--g-panel)] px-3 py-1 text-[12px] text-graphite">
      다음 {upcoming.label} {at} · {formatLeft(upcoming.start - now)} 뒤 <span aria-hidden="true">ⓘ</span>
    </button>
  );
}
