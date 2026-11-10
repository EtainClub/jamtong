import { josa, RAID_HITS_PER_PERSON, RAID_LIFE, raidKind, raidPhase, type RaidKind, type RaidPhase, type RaidWave } from "@/features/garden/rules";

/**
 * 거대 잡초 한 물결을 서버에서 읽는다 — "같이 잡자" 링크(/r/[rid])와 그 카드(/api/raid-card)가 쓴다.
 *
 * 공개 정원(garden-state.ts)과 같은 까닭으로 Firestore REST로 읽는다. 물결 문서와 칸(shards)은
 * 규칙상 누구나 읽는다. 맞은 수 = 물결 문서의 hits + 칸의 합(lib/firebase/raid.ts와 같다).
 * 카드에 싣는 글자는 숫자뿐이다.
 */

export const RAID_ID = /^[0-9]{5}-[1-5]$/;

export interface RaidCard extends RaidWave {
  id: string;
  wave: number;
  /** 거대 잡초 종류. 물결 id에서 정해진다. */
  kind: RaidKind;
  phase: RaidPhase;
  /** 남은 체력. */
  left: number;
  /** 잡는 데 필요한 사람. */
  need: number;
  /** 도망까지 남은 ms. 끝났으면 0. */
  escapeIn: number;
}

type Value = { integerValue?: string; doubleValue?: number; timestampValue?: string; nullValue?: null };
type Fields = Record<string, Value>;

const num = (v?: Value) => Number(v?.integerValue ?? v?.doubleValue ?? 0) || 0;
const time = (v?: Value) => (v?.timestampValue ? Date.parse(v.timestampValue) : null);

export async function loadRaidCard(rid: string): Promise<RaidCard | null> {
  if (!RAID_ID.test(rid)) return null;
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!project || !key) return null;
  const base = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/plazaRaids/${rid}`;

  // 캐시하지 않는다. 체력은 초마다 바뀐다.
  const [raidRes, shardRes] = await Promise.all([
    fetch(`${base}?key=${key}`, { cache: "no-store" }),
    fetch(`${base}/shards?key=${key}&pageSize=20`, { cache: "no-store" }),
  ]);
  if (raidRes.status === 404) return null;
  if (!raidRes.ok) throw new Error(`거대 잡초를 읽지 못했다: ${raidRes.status}`);
  const f = ((await raidRes.json()) as { fields?: Fields }).fields ?? {};
  const shards = shardRes.ok ? (((await shardRes.json()) as { documents?: Array<{ fields?: Fields }> }).documents ?? []) : [];

  const raid: RaidWave = {
    hp: num(f.hp),
    hits: num(f.hits) + shards.reduce((n, d) => n + num(d.fields?.hits), 0),
    fighters: num(f.fighters) + shards.reduce((n, d) => n + num(d.fields?.fighters), 0),
    spawnedAt: time(f.spawnedAt),
    defeatedAt: time(f.defeatedAt),
  };
  if (raid.hp <= 0) return null;
  const now = Date.now();
  const phase = raidPhase(raid, now);
  const [day, wave] = rid.split("-").map(Number);
  return {
    ...raid,
    id: rid,
    wave,
    kind: raidKind(day, wave),
    phase,
    left: phase === "defeated" ? 0 : Math.max(0, raid.hp - raid.hits),
    need: Math.ceil(raid.hp / RAID_HITS_PER_PERSON),
    escapeIn: phase === "active" && raid.spawnedAt !== null ? Math.max(0, raid.spawnedAt + RAID_LIFE - now) : 0,
  };
}

export function raidTitle(card: RaidCard | null): string {
  if (!card) return "광장에서 거대 잡초를 같이 잡아요";
  const name = card.kind.name;
  if (card.phase === "defeated") return `${josa(name, "을를")} 쓰러뜨렸어요`;
  if (card.phase === "escaped") return card.kind.escaped;
  return `${josa(name, "이가")} 나타났어요 — 같이 잡아요`;
}
