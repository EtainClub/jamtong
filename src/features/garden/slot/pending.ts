/**
 * 정원 밖(잼공 판 끝)에서 "이 슬롯을 열어 달라"는 한 번짜리 부탁.
 * 텃밭(Beds)·내 방(GardenHome)이 처음 그릴 때 takeSlotRequest로 가져가고, 이미 떠 있으면 SLOT_OPEN_EVENT로 듣는다.
 */
export type SlotMachineId = "seed" | "room";

export const SLOT_OPEN_EVENT = "jamtong:slot-open";

let pending: SlotMachineId | null = null;

export function requestSlot(machine: SlotMachineId) {
  pending = machine;
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(SLOT_OPEN_EVENT, { detail: machine }));
}

/** 이 슬롯을 열어 달라는 부탁이 있으면 가져간다(한 번만). */
export function takeSlotRequest(machine: SlotMachineId): boolean {
  if (pending !== machine) return false;
  pending = null;
  return true;
}
