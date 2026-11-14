import { formatLeft, isMeteor, isRaining, MINUTE, nextMeteor, nextRain } from "./rules";
import type { Plant, PlazaLevel } from "./types";

/**
 * 정원의 길 — 하단 탭 다섯과 그 안의 칸, 그리고 정원 홈의 새 소식.
 * 설계는 docs/garden-miniroom.md §3. 순수 함수만 둔다(nav.test.ts).
 *
 * ★ 주소의 ?tab= 값은 "자리(place)"다. 옛 탭 이름(flowers·greenhouse·dex·neighbors)도
 *   새 탭의 해당 칸으로 받는다 — "같이 잡자" 링크(/r/…)와 옛 공유 링크가 깨지지 않게.
 */

export type GardenTab = "room" | "beds" | "plaza" | "shop" | "friends";

/** 탭 안의 칸. 방: 방·도감·방명록, 텃밭: 텃밭·온실, 광장: 광장·꽃밭. */
export type Segment = "room" | "dex" | "guestbook" | "beds" | "greenhouse" | "plaza" | "flowers" | "shop" | "friends";

/** 가 볼 수 있는 자리. 탭 이름이거나 칸 이름이다. */
export type Place = GardenTab | Segment;

export interface Nav {
  tab: GardenTab;
  seg: Segment;
}

export const TABS: Array<{ id: GardenTab; icon: string; label: string }> = [
  { id: "room", icon: "🏠", label: "방" },
  { id: "beds", icon: "🌱", label: "텃밭" },
  { id: "plaza", icon: "⛲", label: "광장" },
  { id: "shop", icon: "🏪", label: "상점" },
  { id: "friends", icon: "🤝", label: "1촌" },
];

/** 탭마다의 칸. 첫 칸이 기본이다. 칸이 하나면 전환을 그리지 않는다. */
export const SEGMENTS: Record<GardenTab, Array<{ id: Segment; label: string }>> = {
  room: [
    { id: "room", label: "방" },
    { id: "dex", label: "도감" },
    { id: "guestbook", label: "방명록" },
  ],
  beds: [
    { id: "beds", label: "텃밭" },
    { id: "greenhouse", label: "온실" },
  ],
  plaza: [
    { id: "plaza", label: "광장" },
    { id: "flowers", label: "꽃밭" },
  ],
  shop: [{ id: "shop", label: "상점" }],
  friends: [{ id: "friends", label: "1촌" }],
};

/** 옛 탭 이름과 다른 이름. 지금 이름은 그대로 받는다. */
const ALIASES: Record<string, Place> = {
  home: "room",
  neighbors: "friends",
  ilchon: "friends",
};

/** 자리 → 탭과 칸. 모르는 값이면 null. */
export function navOf(place: string | null | undefined): Nav | null {
  if (!place) return null;
  const p = ALIASES[place] ?? place;
  for (const tab of Object.keys(SEGMENTS) as GardenTab[]) {
    if (p === tab) return { tab, seg: SEGMENTS[tab][0].id };
    if (SEGMENTS[tab].some((s) => s.id === p)) return { tab, seg: p as Segment };
  }
  return null;
}

/**
 * 주소에 탭이 없을 때 여는 자리. 기본은 방(정원 홈)이지만, 아직 한 번도 거두지 않은
 * 정원은 텃밭부터 — 첫 수확을 첫 세션 안에 하게 하는 것이 먼저다(§8의 1).
 */
export function defaultNav(harvested: boolean): Nav {
  return harvested ? { tab: "room", seg: "room" } : { tab: "beds", seg: "beds" };
}

// ── 새 소식 ──────────────────────────────────────────────────────────

export interface NewsItem {
  key: string;
  icon: string;
  text: string;
  /** 누르면 가는 자리. */
  go: Place;
  /** 버튼에 붙는 자리 이름. */
  goLabel: string;
}

export interface NewsInput {
  beds: Array<Plant | null>;
  basket: number;
  basketMax: number;
  plaza: PlazaLevel;
  /** 오늘 받을 수 있는 꽃꿀 수. */
  nectar: number;
  /**
   * 거대 잡초. 지금 싸우는 중이면 그 소식을 띄운다. 정원 홈은 광장 구독을 따로 두지 않으므로
   * 모르면 비워 둔다 — 그때는 광장이 무성한지로만 말한다. (거대 잡초 2.0이 빈틈 시각을 여기 채운다.)
   */
  raid?: { active: boolean; text?: string };
  /** 1촌·방명록 단계가 더하는 소식. 그대로 뒤에 붙인다. */
  extra?: NewsItem[];
}

/** 단비·별똥별을 소식으로 띄우는 거리. 이보다 멀면 날씨 배지에만 둔다. */
export const NEWS_WEATHER_AHEAD = 90 * MINUTE;
/** 바구니가 이만큼 차면 미리 알린다(상한은 store.ts의 BASKET_MAX). */
export const BASKET_WARN_AT = 100;

/**
 * 정원 홈의 새 소식. 지금 할 일이 위에 온다. 아무것도 없으면 "가장 먼저 익는 것 ○ 뒤"
 * 또는 "빈 밭에 심어요" 한 줄을 둔다 — 홈이 비어 있지 않게.
 */
export function homeNews(d: NewsInput, now: number): NewsItem[] {
  const out: NewsItem[] = [];
  const ripe = d.beds.filter((p) => p && p.ripeAt <= now).length;
  if (ripe > 0) out.push({ key: "ripe", icon: "🍓", text: `익은 밭 ${ripe}칸`, go: "beds", goLabel: "텃밭" });

  if (d.raid?.active) {
    out.push({ key: "raid", icon: "🌿", text: d.raid.text ?? "거대 잡초가 나타났어요 · 같이 잡아요", go: "plaza", goLabel: "광장" });
  } else if (d.plaza === "overgrown") {
    out.push({ key: "overgrown", icon: "🌿", text: "광장이 무성해요 · 거대 잡초가 나올 수 있어요", go: "plaza", goLabel: "광장" });
  }

  if (isRaining(now)) {
    out.push({ key: "rain", icon: "🌧", text: `단비 오는 중 · 성장 ×2 · ${formatLeft(nextRain(now).end - now)} 남음`, go: "beds", goLabel: "텃밭" });
  } else if (nextRain(now).start - now <= NEWS_WEATHER_AHEAD) {
    out.push({ key: "rain", icon: "🌧", text: `단비 ${formatLeft(nextRain(now).start - now)} 뒤`, go: "beds", goLabel: "텃밭" });
  }
  if (isMeteor(now)) {
    out.push({ key: "meteor", icon: "🌠", text: `별똥별 지나는 중 · ${formatLeft(nextMeteor(now).end - now)} 남음`, go: "beds", goLabel: "텃밭" });
  } else if (nextMeteor(now).start - now <= NEWS_WEATHER_AHEAD) {
    out.push({ key: "meteor", icon: "🌠", text: `별똥별 ${formatLeft(nextMeteor(now).start - now)} 뒤`, go: "beds", goLabel: "텃밭" });
  }

  if (d.nectar > 0) out.push({ key: "nectar", icon: "🍯", text: `받을 꽃꿀 ${d.nectar}개`, go: "flowers", goLabel: "꽃밭" });
  if (d.basket >= BASKET_WARN_AT) {
    out.push({
      key: "basket",
      icon: "🧺",
      text: d.basket >= d.basketMax ? `바구니가 가득 찼어요 (${d.basket}/${d.basketMax})` : `바구니가 거의 찼어요 (${d.basket}/${d.basketMax})`,
      go: "beds",
      goLabel: "바구니",
    });
  }

  out.push(...(d.extra ?? []));

  if (ripe === 0) {
    const growing = d.beds.filter((p): p is Plant => p !== null && p.ripeAt > now);
    if (growing.length) {
      const first = Math.min(...growing.map((p) => p.ripeAt));
      out.push({ key: "next", icon: "⏳", text: `가장 먼저 익는 것 ${formatLeft(first - now)} 뒤`, go: "beds", goLabel: "텃밭" });
    } else if (d.beds.some((p) => p === null)) {
      out.push({ key: "empty", icon: "🌱", text: "빈 밭이 있어요 · 씨앗을 심어요", go: "beds", goLabel: "텃밭" });
    }
  }
  return out;
}
