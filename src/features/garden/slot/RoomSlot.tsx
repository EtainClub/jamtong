"use client";

import { useState } from "react";

import { track } from "@/lib/analytics";
import { useAuth } from "@/lib/firebase/auth";
import { givePot } from "@/lib/firebase/slot";

import { purchasedTrack } from "../musicTracks";
import { FurnitureIcon } from "../room/RoomArt";
import { kstDay } from "../rules";
import { Sheet } from "../Sheet";
import { useGarden } from "../store";
import { normalizeSlots, potShare, ROOM_PITY, ROOM_SPIN_COST, roomEv, SLOT_SPINS_PER_DAY, spinsLeft, type RoomPrize, type RoomRow } from "./rules";
import { todaysRoomTable } from "./roomPool";
import { pct, SlotMachine, type SlotSymbol } from "./SlotMachine";
import { QuizChance } from "./QuizChance";

const KIND_LABEL: Record<RoomPrize["kind"], string> = { furniture: "가구", wallpaper: "벽지", flooring: "바닥재", music: "음원" };

/**
 * 미니룸 아이템 슬롯 — 잼을 내고 돌리면 오늘의 진열(상점의 가구·벽지·바닥재·음원 여섯) 가운데 같은 그림 셋이면 그 아이템(docs/garden-slots.md).
 * 진열은 날마다 바뀌고, 이미 가진 것(벽지·바닥재·음원)과 가진 수 상한에 닿은 가구는 오르지 않는다.
 */
export function RoomSlot({ now, onClose, say }: { now: number; onClose: () => void; say: (text: string) => void }) {
  const data = useGarden((s) => s.data);
  // 방금 돌린 진열 — 당첨으로 아이템이 빠지면 오늘 진열이 바뀌지만, 멈춘 릴은 돌린 그 진열로 그린다.
  const [spun, setSpun] = useState<RoomRow[] | null>(null);
  const uid = useAuth().user?.uid ?? null;
  if (!data) return null;
  const ledger = normalizeSlots(data.slots);
  const left = spinsLeft(ledger, "room", kstDay(now));
  const table = spun ?? todaysRoomTable(data.room, now);
  const symbols: SlotSymbol[] = table.map((r) => ({ key: r.id, label: r.label, node: prizeNode(r) }));
  const toPity = Math.max(1, ROOM_PITY - ledger.roomPity);

  return (
    <Sheet label="방 꾸미기 슬롯머신" title="🎰 방 꾸미기 슬롯머신" onClose={onClose}>
      <p className="mt-1 text-center text-[12px] text-smoke">오늘의 진열 여섯 · 가운데 줄에 같은 그림 셋이면 그 아이템</p>
      {table.length === 0 ? (
        <p className="mt-4 text-[13px]">받을 수 있는 아이템을 모두 가지고 있어요! 🎉</p>
      ) : (
        <SlotMachine
          symbols={symbols}
          cost={ROOM_SPIN_COST}
          jam={data.jam}
          left={left}
          footer={`아이템까지 길어도 ${toPity}번 (천장 ${ROOM_PITY}번)`}
          free={ledger.freeRoom}
          after={(win) => (!win ? <QuizChance machine="room" now={now} say={say} /> : null)}
          onSpin={() => {
            const got = useGarden.getState().spinRoomSlot(Math.random, ledger.freeRoom > 0 ? "free" : "paid");
            if (got === "jam") return `잼이 ${ROOM_SPIN_COST} 있어야 해요`;
            if (got === "done") return `오늘은 ${SLOT_SPINS_PER_DAY}번 다 돌렸어요. 내일 다시 만나요`;
            if (got === "empty") return "받을 수 있는 아이템이 없어요";
            if (got === "no-free") return "무료 한 번이 없어요";
            if (uid && got.paid) void givePot(uid, potShare(got.paid)).catch((e) => console.error("[slot] 잼 항아리에 넣지 못했다", e));
            const { spin } = got;
            setSpun(got.table);
            track("slot_spin", { machine: "room", outcome: spin.prize ? spin.prize.kind : "miss", ...(spin.prize ? { item: spin.prize.id, pity: spin.pity } : {}) });
            if (!spin.prize) return { reels: spin.reels, win: false, message: <p>꽝이에요. 진열은 내일 바뀌어요.</p> };
            const where = spin.prize.kind === "music" ? "♪ 곡 고르기에서 바로 틀 수 있어요" : "방 꾸미기 보관함에 있어요";
            say(`🎉 ${spin.prize.label} 당첨! ${where}`);
            return {
              reels: spin.reels,
              win: true,
              message: (
                <div className="flex items-center gap-3">
                  <span className="shrink-0">{prizeNode(spin.prize)}</span>
                  <div>
                    <p className="text-[15px] font-black">🎉 {spin.prize.label}{spin.pity ? " (천장)" : ""}</p>
                    <p className="text-[13px]">
                      {KIND_LABEL[spin.prize.kind]} · 상점 값 🍯{spin.prize.price.toLocaleString("ko-KR")} — {where}
                    </p>
                  </div>
                </div>
              ),
            };
          }}
          odds={
            <ul className="space-y-0.5">
              {table.map((r) => (
                <li key={r.id} className="flex justify-between gap-2">
                  <span className="min-w-0 truncate">
                    {KIND_LABEL[r.kind]} · {r.label} <span className="text-smoke">(🍯{r.price.toLocaleString("ko-KR")})</span>
                  </span>
                  <b className="shrink-0 tabular-nums">{pct(r.p)}</b>
                </li>
              ))}
              <li className="flex justify-between gap-2">
                <span>꽝</span>
                <b className="tabular-nums">{pct(1 - table.reduce((s, r) => s + r.p, 0))}</b>
              </li>
              <li className="pt-1 text-smoke">
                비싼 아이템일수록 드물어요. 평균으로 받는 값은 한 번에 약 🍯{Math.round(roomEv(table))}로, 내는 🍯{ROOM_SPIN_COST}보다 적어요 — 꼭 갖고 싶은 것은 상점에서 사는 편이 확실해요.
                아이템 없이 {ROOM_PITY}번째가 되면 그 번은 반드시 진열 하나(위 비율대로). 하루 {SLOT_SPINS_PER_DAY}번까지.
              </li>
            </ul>
          }
        />
      )}
    </Sheet>
  );
}

function prizeNode(r: RoomPrize) {
  if (r.kind === "music") {
    const t = purchasedTrack(r.id);
    return <span>{t?.icon ?? "🎵"}</span>;
  }
  // 가구 그림은 여백이 커서 칸을 꽉 채우고, 벽지·바닥재 견본은 면이 꽉 차 있어 작게 — 릴에서 크기가 고르게 보이도록.
  return (
    <span className={r.kind === "furniture" ? "garden-slot-art" : "garden-slot-art is-swatch"}>
      <FurnitureIcon id={r.id} size={56} />
    </span>
  );
}
