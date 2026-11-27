import type { Furniture } from "./catalog";

/**
 * 카르텔 카드 — 방 꾸미기 슬롯머신에서만 나오는 전시 소품(docs/garden-slots.md §3).
 *
 * ★ 카르텔 열둘(content/cartels)마다 한 장. 상점에서 팔지 않는다(cur reward) — 슬롯의 「🎯 카르텔 카드」 칸으로만.
 * ★ 카드 그림은 카르텔 지도(/cartel)의 표적 삽화(public/images/cartel/<slug>.webp)를 96px PNG로 줄여
 *   public/images/room/cartel-<slug>.png에 두고, 받침대 위 카드 틀은 코드가 그린다(RoomSvg.tsx의 CartelCardArt).
 *   PNG로 두는 까닭: 공유 카드(/api/garden-card)가 방 그림의 그림 파일을 data URI로 바꿔 넣는다(furnitureSprites.ts).
 * ★ 이름·요약은 콘텐츠의 것이다. 정원 번들에 카르텔 본문을 싣지 않는다 — 카드를 누르면 /garden/cartels.json을 받는다.
 * ★ "깼다"고 그리지 않는다. 카르텔 화면은 표적을 깼다/못 깼다로 칠하지 않는다(content/cartels/index.ts). 카드도 표적일 뿐이다.
 * rules.test.ts가 content/cartels의 CARTELS와 slug·이름·순서를 대조한다.
 */
export const ROOM_CARTELS = [
  { slug: "collusion", name: "담합", color: "#c2553f" },
  { slug: "medical", name: "의료", color: "#3f8fb5" },
  { slug: "telecom", name: "통신", color: "#6b5bb8" },
  { slug: "rest-area", name: "휴게소", color: "#d9893a" },
  { slug: "revolving-door", name: "전관예우", color: "#7a4b3a" },
  { slug: "local-establishment", name: "지역 토착", color: "#5b8a3c" },
  { slug: "refinery", name: "정유사", color: "#3a3f47" },
  { slug: "finance", name: "금융", color: "#c9a227" },
  { slug: "bureaucracy", name: "관료", color: "#4b6584" },
  { slug: "education", name: "교육", color: "#2f8f7f" },
  { slug: "construction", name: "건설", color: "#e0a030" },
  { slug: "media", name: "언론", color: "#9a5a8c" },
] as const;

export type RoomCartel = (typeof ROOM_CARTELS)[number];

export const CARTEL_PREFIX = "cartel-";

export const CARTEL_FURNITURE: Furniture[] = ROOM_CARTELS.map((c) => ({
  id: `${CARTEL_PREFIX}${c.slug}`,
  label: `${c.name} 카르텔 카드`,
  kind: "floor",
  size: 1,
  price: 0,
  cur: "reward",
  art: `${CARTEL_PREFIX}${c.slug}`,
  hint: `방 꾸미기 슬롯머신에서만 나오는 카드예요. 누르면 ‘${c.name}’ 카르텔에 무엇이 걸렸는지 요약을 보고 카르텔 페이지로 갈 수 있어요.`,
  newUntil: "2026-12-27",
}));

const BY_ID = new Map<string, RoomCartel>(ROOM_CARTELS.map((c) => [`${CARTEL_PREFIX}${c.slug}`, c]));

/** 가구 id(=그림 열쇠)가 카르텔 카드면 그 카르텔. */
export function cartelOf(id: string): RoomCartel | undefined {
  return BY_ID.get(id);
}

export function cartelCardImage(slug: string): string {
  return `/images/room/cartel-${slug}.png`;
}

/** 아직 갖지 않은 카르텔 카드(가구 id) — 슬롯의 카르텔 칸은 이 가운데 하나를 준다. */
export function missingCartelCards(owned: Readonly<Record<string, number>>): string[] {
  return CARTEL_FURNITURE.filter((f) => (owned[f.id] ?? 0) === 0).map((f) => f.id);
}
