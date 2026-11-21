/**
 * 시험 도우미 — 옛 칸 이름("w0"·"b3"·"f5")으로 놓고·옮기고·넣는다. 장부는 아이소 좌표다(docs/garden-miniroom-iso.md §8).
 * 칸은 옛 장부를 옮기는 규칙(isoPlace.ts의 slotToPos) 그대로 좌표가 된다:
 *   w<i> → 오른쪽 벽 가로 i, b<i> → 바닥 u = i·v = 0, f<i> → 바닥 u = i·v = n/2.
 * 옛 칸 규칙처럼 방 너비를 넘는 칸, 벽 칸의 바닥 물건, 바닥 칸의 벽걸이는 받지 않는다.
 * 화면 코드는 이 파일을 쓰지 않는다.
 */
import { isoSpecOf } from "./isoPlace";
import * as R from "./rules";
import type { IsoPos } from "./isoPlace";
import type { Placed, RoomData } from "./rules";

/** 옛 칸 규칙을 지키는 자리. 맞지 않으면 null. */
export function slotPos(room: Pick<RoomData, "size" | "shown">, it: string, at: string): IsoPos | null {
  const slot = R.parseSlot(at);
  const spec = isoSpecOf(it, room.shown);
  if (!slot || !spec || slot.i >= R.roomWidth(room.size)) return null;
  const wallish = spec.layer === "wall" || spec.wallOk;
  if (slot.row === "w" ? !wallish : spec.layer === "wall") return null;
  return R.slotPos(room, it, at);
}

/** 놓인 것의 칸 이름(공개 문서의 a와 같다). */
export const slotOf = (room: Pick<RoomData, "size">, p: Placed): string => R.posSlot(p.pos, room.size);
export const slots = (room: RoomData): string[] => room.placed.map((p) => slotOf(room, p));
export const indexAt = (room: RoomData, at: string): number => room.placed.findIndex((p) => slotOf(room, p) === at);
export const itemAt = (room: RoomData, at: string): Placed | undefined => room.placed[indexAt(room, at)];

export function canPlace(room: RoomData, it: string, at: string): boolean {
  const pos = slotPos(room, it, at);
  return pos !== null && R.canPlace(room, it, pos);
}

export function place(room: RoomData, it: string, at: string): RoomData | null {
  const pos = slotPos(room, it, at);
  return pos && R.place(room, it, pos);
}

export function move(room: RoomData, from: string, to: string): RoomData | null {
  const i = indexAt(room, from);
  const pos = i >= 0 ? slotPos(room, room.placed[i].it, to) : null;
  return pos && R.move(room, i, pos);
}

export function stow(room: RoomData, at: string): RoomData {
  const i = indexAt(room, at);
  return i >= 0 ? R.stow(room, i) : room;
}

/** 장부 한 줄을 칸 이름으로 — 작은 방(6×6) 기준. */
export function at(it: string, slot: string, more: { kb?: number; size?: 0 | 1 | 2; room?: Pick<RoomData, "shown"> } = {}): Placed {
  const pos = slotPos({ size: more.size ?? 0, shown: more.room?.shown ?? [] }, it, slot);
  if (!pos) throw new Error(`${it} @ ${slot}: 칸이 맞지 않는다`);
  return { it, pos, ...(more.kb !== undefined ? { kb: more.kb } : {}) };
}
