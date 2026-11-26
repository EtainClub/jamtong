import { MUSIC_SHOP, ownedMusic } from "../musicTracks";
import { hash, kstDay, rng } from "../rules";
import { FURNITURE } from "../room/catalog";
import { roomBookOf } from "../room/library";
import { OWN_MAX, type RoomData } from "../room/rules";
import { roomLineup, roomTable, type RoomPrize, type RoomRow } from "./rules";

/** 슬롯에 오르는 가구의 값 상한 — 특별한 책(100,000잼) 같은 큰 것은 상점에서만. */
export const ROOM_PRIZE_PRICE_MAX = 3000;

/**
 * 이 방이 받을 수 있는 상점 품목 — 늘 파는 가구·소품·창문(가진 수 상한 아래), 아직 없는 벽지·바닥재, 아직 없는 음원.
 * 주마다 바뀌는 한정·전리품·보상 전용·특별한 책은 뺀다(memorial/ox.ts의 giftPool과 같은 선).
 */
export function roomPool(room: RoomData): RoomPrize[] {
  const out: RoomPrize[] = [];
  for (const f of FURNITURE) {
    if (f.price <= 0 || f.price > ROOM_PRIZE_PRICE_MAX || f.cur || f.weekly || f.reading || roomBookOf(f.id)) continue;
    const have = room.owned[f.id] ?? 0;
    if (f.kind === "wallpaper" || f.kind === "flooring") {
      if (have === 0) out.push({ id: f.id, kind: f.kind, label: f.label, price: f.price });
    } else if (f.kind === "floor" || f.kind === "wall" || f.kind === "window") {
      if (have < OWN_MAX) out.push({ id: f.id, kind: "furniture", label: f.label, price: f.price });
    }
  }
  const music = ownedMusic(room.music);
  for (const t of MUSIC_SHOP) if (!music.includes(t.id)) out.push({ id: t.id, kind: "music", label: t.label, price: t.price });
  return out;
}

/** 오늘의 진열과 확률표. 같은 날 같은 방이면 같은 진열이다(받은 것이 빠지면 바뀐다). */
export function todaysRoomTable(room: RoomData, t: number): RoomRow[] {
  return roomTable(roomLineup(roomPool(room), rng(hash(`room-slot:${kstDay(t)}`))));
}
