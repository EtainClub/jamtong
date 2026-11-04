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
 */

export interface GardenCard {
  gid: string;
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
  nullValue?: null;
  mapValue?: { fields?: Record<string, Value> };
  arrayValue?: { values?: Value[] };
};

const num = (v?: Value) => Number(v?.integerValue ?? v?.doubleValue ?? 0) || 0;

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

  catalog ??= buildCatalog();
  const byId = new Map(catalog.map((s) => [s.id, s]));
  const now = Date.now();
  const growing = (fields.beds?.arrayValue?.values ?? [])
    .map((v) => v.mapValue?.fields)
    .filter((f): f is Record<string, Value> => Boolean(f?.s?.stringValue))
    .map((f) => ({ species: byId.get(f.s.stringValue!), ripe: num(f.r) <= now }))
    .filter((b): b is { species: Species; ripe: boolean } => Boolean(b.species))
    .sort((a, b) => Number(b.ripe) - Number(a.ripe));

  return {
    gid,
    dex: num(fields.dex),
    total: catalog.length,
    golden: num(fields.golden),
    rainbow: num(fields.rainbow),
    growing,
  };
}

export function gardenSummary(card: GardenCard): string {
  const names = [...new Set(card.growing.map((b) => b.species.title))].slice(0, 2);
  const growing = names.length ? `지금 「${names.join("」, 「")}」 등을 키우고 있어요. ` : "";
  return `${growing}도감 ${card.dex}/${card.total}. 물을 주면 친구 정원도, 내 정원도 빨리 자라요.`;
}
