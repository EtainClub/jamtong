import { freshRoom, roomFromPublic, type RoomData } from "@/features/garden/room/rules";
import type { PublicRoom } from "@/lib/firebase/gardens";

import { buildCatalog } from "@/features/garden/catalog";
import { PUBLIC_ID } from "@/features/garden/rules";
import type { Species } from "@/features/garden/types";

/**
 * 공개 정원을 서버에서 읽는다 — 자랑 카드(/api/garden-card)와 링크 주소(/g/[gid])가 쓴다.
 *
 * firebase-admin은 런타임 의존성이 아니다. 공개 정원은 규칙상 누구나 읽으므로
 * Firestore REST로 읽는다(키는 이미 브라우저에 나가 있는 웹 키다).
 *
 * ★ 카드에 싣는 글자는 저장소에서 온 것뿐이다.
 *   공개 문서에서 받는 것은 품종 id와 숫자뿐이고, 품종 이름은 품종표에서 꺼낸다.
 *   사람이 지은 정원 이름은 카드와 미리보기에 싣지 않는다 — 우리 도메인의 카드에
 *   아무 말이나 박히면 안 된다(api/share-card와 같은 원칙). 이름은 정원 안에서만 보인다.
 *   방명록·1촌평·소식도 싣지 않는다(docs/garden-miniroom.md §5.3).
 */

/** 정원 카드의 색. 자랑 카드(/api/garden-card)와 정원 첫 카드(/garden)가 같이 쓴다. */
export const GARDEN_OG = {
  sky: "#d9eedf",
  grass: "#a9cf7f",
  soil: "#8b6a4a",
  soilDark: "#6f5238",
  leaf: "#3f8a3a",
  ink: "#21401f",
  muted: "#4f6b4a",
  jam: "#c2410c",
  cream: "#fdf8ea",
};

/** 등급마다 열매 색. 정원 화면의 열매 모양과 같은 계열. */
export const GARDEN_FRUIT: Record<string, string> = {
  sprout: "#6d5bd0",
  common: "#e0573a",
  flagship: "#e9a23b",
  perennial: "#3f8a3a",
};

export interface GardenCard {
  gid: string;
  room: RoomData;
  dex: number;
  total: number;
  golden: number;
  rainbow: number;
  /** 지금 밭에 있는 품종(품종표에 있는 것만), 익은 것 먼저. */
  growing: Array<{ species: Species; ripe: boolean }>;
}

type Value = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: null;
  mapValue?: { fields?: Record<string, Value> };
  arrayValue?: { values?: Value[] };
};

const num = (v?: Value) => Number(v?.integerValue ?? v?.doubleValue ?? 0) || 0;

/** Firestore REST values to plain data; roomFromPublic applies the same allowlist as visits. */
function plain(v: Value): unknown {
  if (v.mapValue) return Object.fromEntries(Object.entries(v.mapValue.fields ?? {}).map(([key, value]) => [key, plain(value)]));
  if (v.arrayValue) return (v.arrayValue.values ?? []).map(plain);
  return v.stringValue ?? v.booleanValue ?? (v.integerValue !== undefined || v.doubleValue !== undefined ? num(v) : null);
}

export function cardRoom(value: Value | undefined, byId: ReadonlyMap<string, Species>): RoomData {
  if (!value?.mapValue) return freshRoom();
  const raw = plain(value) as PublicRoom;
  // Only known fields are rendered, and malformed placements are ignored before normalization.
  raw.placed = Array.isArray(raw.placed)
    ? raw.placed.filter((p) =>
        p && typeof p === "object" && typeof p.a === "string" &&
        ("i" in p ? typeof p.i === "string" : typeof p.k === "string" && typeof p.s === "string") &&
        (!("m" in p) || Array.isArray(p.m)),
      )
    : [];
  raw.keys = Array.isArray(raw.keys) ? raw.keys : undefined;
  const room = roomFromPublic(raw, byId);
  // Free text stays inside the room, never on the public-domain share card.
  room.motto = "";
  return room;
}

let catalog: Species[] | null = null;

export async function loadGardenCard(gid: string): Promise<GardenCard | null> {
  if (!PUBLIC_ID.test(gid)) return null;
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!project || !key) return null;

  const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/gardens/${gid}?key=${key}`;
  // 캐시하지 않는다. 주인이 공개를 끄면 카드도 바로 사라져야 한다.
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`공개 정원을 읽지 못했다: ${res.status}`);
  const fields = ((await res.json()) as { fields?: Record<string, Value> }).fields ?? {};
  // 1촌이 있는 방은 공개를 꺼도 지우지 않고 가린다(docs/garden-miniroom.md §5.5). 가린 방은 없는 방과 같다.
  if (fields.hidden?.booleanValue === true) return null;

  catalog ??= buildCatalog();
  const byId = new Map(catalog.map((s) => [s.id, s]));
  const now = Date.now();
  const growing = (fields.beds?.arrayValue?.values ?? [])
    .map((v) => v.mapValue?.fields)
    .filter((f): f is Record<string, Value> => Boolean(f?.s?.stringValue))
    .map((f) => ({ species: byId.get(f.s.stringValue!), ripe: num(f.r) <= now }))
    .filter((b): b is { species: Species; ripe: boolean } => Boolean(b.species))
    .sort((a, b) => Number(b.ripe) - Number(a.ripe));

  const room = cardRoom(fields.room, byId);
  if (room.placed.some((p) => p.it === "keyboard")) {
    const moderation = await fetch(`${url.split("?key=")[0]}/mod/keys?key=${key}`, { cache: "no-store" }).catch(() => null);
    // If moderation cannot be checked, show blank keys rather than a possibly hidden drawing.
    const hidden = moderation?.ok
      ? ((await moderation.json()) as { fields?: Record<string, Value> }).fields?.hidden?.booleanValue === true
      : moderation?.status !== 404;
    if (hidden) {
      room.keys = room.keys.map((k) => ({ ...k, face: "0".repeat(144) }));
      room.keyboards = Object.fromEntries(Object.entries(room.keyboards ?? {}).map(([id, keys]) => [id, keys.map((k) => ({ ...k, face: "0".repeat(144) }))]));
    }
  }

  return {
    gid,
    room,
    dex: num(fields.dex),
    total: catalog.length,
    golden: num(fields.golden),
    rainbow: num(fields.rainbow),
    growing,
  };
}

export function gardenSummary(card: GardenCard): string {
  return `가구와 수확한 품종으로 꾸민 친구의 방을 구경해 보세요. 도감 ${card.dex}/${card.total}.`;
}
