"use client";

import { useEffect, useState } from "react";

import { track } from "@/lib/analytics";
import { useAuth } from "@/lib/firebase/auth";
import { loadGiftStock, loadMyGiftWin, spinGift, type GiftWin } from "@/lib/firebase/slot";

import { FURNITURE_BY_ID } from "../room/catalog";
import { FurnitureIcon } from "../room/RoomArt";
import { OWN_MAX } from "../room/rules";
import { kstDayNumber } from "../rules";
import { Sheet } from "../Sheet";
import { useGarden } from "../store";
import { GIFT_WIN_P, stockTotal, type GiftStock } from "./gift";
import { pct, SlotMachine, type SlotSymbol } from "./SlotMachine";

/** 꽝 칸 — 상자에 하나뿐이어도 꽝이 셋 같은 그림으로 보이지 않게 늘 둔다. */
const BLANK = "__blank";

/**
 * 남의 방 뽑기 기계 — 주인이 넣어 둔 증정 상자에서 하루 한 번 무료로(slot/gift.ts).
 * 결과는 서버의 상자를 읽고 한 번에(트랜잭션) 정한다. 받은 것은 내 보관함에 들어간다.
 */
export function GiftSlot({ gid, ownerNick, onClose, say }: { gid: string; ownerNick: string; onClose: () => void; say: (text: string) => void }) {
  const uid = useAuth().user?.uid ?? null;
  const data = useGarden((s) => s.data);
  /** undefined=여는 중, null=받지 못했다. 돌리는 동안 그림이 바뀌지 않게 처음 읽은 상자로 릴을 그린다. */
  const [stock, setStock] = useState<GiftStock | null | undefined>(undefined);
  const [mine, setMine] = useState<GiftWin | null | undefined>(undefined);
  const [today] = useState(() => kstDayNumber(Date.now()));

  useEffect(() => {
    let alive = true;
    loadGiftStock(gid)
      .then((s) => alive && setStock(s))
      .catch((e) => {
        console.error("[gift] 증정 상자를 읽지 못했다", e);
        if (alive) setStock(null);
      });
    if (uid)
      loadMyGiftWin(gid, uid)
        .then((w) => alive && setMine(w))
        .catch((e) => {
          console.error("[gift] 내 기록을 읽지 못했다", e);
          if (alive) setMine(null);
        });
    return () => {
      alive = false;
    };
  }, [gid, uid]);

  const title = `🎰 ${ownerNick}의 뽑기 기계`;
  if (!uid || !data) {
    return (
      <Sheet label="뽑기 기계" title={title} onClose={onClose}>
        <p className="mt-3 text-[13px]">정원을 연 뒤에 돌려 볼 수 있어요.</p>
      </Sheet>
    );
  }

  const ids = Object.keys(stock ?? {});
  const total = stockTotal(stock ?? {});
  const spun = mine?.day === today;
  const accept = (id: string) => (useGarden.getState().data?.room.owned[id] ?? 0) < OWN_MAX;
  const symbols: SlotSymbol[] = [
    ...ids.map((id) => ({ key: id, label: FURNITURE_BY_ID.get(id)?.label ?? id, node: <span className="garden-slot-art"><FurnitureIcon id={id} size={56} /></span> })),
    { key: BLANK, label: "꽝", node: <span>💨</span> },
  ];
  const blank = symbols.length - 1;

  return (
    <Sheet label={`${ownerNick}의 뽑기 기계`} title={title} onClose={onClose}>
      <p className="mt-1 text-center text-[12px] text-smoke">
        {ownerNick}님이 손님에게 주려고 넣어 둔 아이템이에요 · 하루 한 번 무료 · 받은 것은 내 방 보관함에
      </p>
      {stock === undefined || mine === undefined ? (
        <p className="mt-4 text-[13px] text-smoke">여는 중…</p>
      ) : stock === null ? (
        <p className="mt-4 text-[13px] text-smoke">뽑기 기계를 열지 못했어요. 잠시 뒤 다시 열어 주세요.</p>
      ) : total === 0 ? (
        <p className="mt-4 text-[13px]">아직 증정 상자가 비어 있어요. 주인이 아이템을 넣으면 돌릴 수 있어요.</p>
      ) : (
        <SlotMachine
          symbols={symbols}
          cost={0}
          jam={data.jam}
          left={spun ? 0 : 1}
          free={spun ? 0 : 1}
          freeLabel="🎟 하루 한 번 무료"
          footer={`증정 상자에 ${total}개`}
          onSpin={async () => {
            if (spun) return "오늘은 이 방의 기계를 이미 돌렸어요. 내일 또 놀러 와요";
            const got = await spinGift(gid, { uid, nick: data.nick || "이웃" }, today, accept, Math.random);
            if (got === "done") {
              setMine({ uid, it: "", nick: data.nick, day: today, at: Date.now() });
              return "오늘은 이 방의 기계를 이미 돌렸어요. 내일 또 놀러 와요";
            }
            if (got.kind === "empty") return `받을 수 있는 아이템이 없어요 · 상자의 것을 이미 ${OWN_MAX}개씩 가지고 있어요`;
            setMine({ uid, it: got.kind === "win" ? got.id : "", nick: data.nick, day: today, at: Date.now() });
            track("gacha_guest", { outcome: got.kind, ...(got.kind === "win" ? { item: got.id } : {}) });
            if (got.kind === "miss") {
              let reels: [number, number, number];
              do reels = [0, 1, 2].map(() => Math.floor(Math.random() * symbols.length)) as [number, number, number];
              while ((reels[0] === reels[1] && reels[1] === reels[2]) || !reels.includes(blank));
              return { reels, win: false, message: <p>꽝이에요. 내일 또 돌려 보세요.</p> };
            }
            const at = symbols.findIndex((s) => s.key === got.id);
            const label = FURNITURE_BY_ID.get(got.id)?.label ?? "아이템";
            const kept = useGarden.getState().receiveGift(got.id);
            say(kept ? `🎁 ${label}을(를) 받았어요 · 방 꾸미기 보관함에 있어요` : `🎁 ${label} 당첨! 하지만 보관함에 넣지 못했어요`);
            return {
              reels: [at, at, at],
              win: true,
              message: (
                <div className="flex items-center gap-3">
                  <span className="shrink-0 garden-slot-art"><FurnitureIcon id={got.id} size={56} /></span>
                  <div>
                    <p className="text-[15px] font-black">🎁 {label}</p>
                    <p className="text-[13px]">{ownerNick}님의 선물 — 방 꾸미기 보관함에 있어요</p>
                  </div>
                </div>
              ),
            };
          }}
          odds={
            <ul className="space-y-0.5">
              {ids.map((id) => (
                <li key={id} className="flex justify-between gap-2">
                  <span className="min-w-0 truncate">{FURNITURE_BY_ID.get(id)?.label ?? id} <span className="text-smoke">×{stock[id]}</span></span>
                  <b className="shrink-0 tabular-nums">{pct((GIFT_WIN_P * stock[id]) / total)}</b>
                </li>
              ))}
              <li className="flex justify-between gap-2">
                <span>꽝</span>
                <b className="tabular-nums">{pct(1 - GIFT_WIN_P)}</b>
              </li>
              <li className="pt-1 text-smoke">
                당첨은 {pct(GIFT_WIN_P)}, 당첨이면 상자에 든 수에 비례해 하나예요. 이미 {OWN_MAX}개 가진 아이템은 나오지 않아요. 잼은 들지 않고, 한 방의 기계는 하루 한 번이에요.
              </li>
            </ul>
          }
        />
      )}
    </Sheet>
  );
}
