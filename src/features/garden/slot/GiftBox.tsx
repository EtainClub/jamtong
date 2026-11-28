"use client";

import { useCallback, useEffect, useState } from "react";

import { track } from "@/lib/analytics";
import { useAuth } from "@/lib/firebase/auth";
import { addGiftStock, loadGiftStock, loadGiftWins, takeGiftStock, type GiftWin } from "@/lib/firebase/slot";

import { gardenFeedback } from "../feedback";
import { FURNITURE, FURNITURE_BY_ID } from "../room/catalog";
import { FurnitureIcon } from "../room/RoomArt";
import { OWN_MAX, stowedCount } from "../room/rules";
import { Sheet } from "../Sheet";
import { useGarden } from "../store";
import { canAddToStock, GIFT_EACH_MAX, GIFT_KINDS_MAX, GIFT_WIN_P, giftable, stockTotal, type GiftStock } from "./gift";
import { pct } from "./SlotMachine";

/**
 * 내 뽑기 기계 — 손님에게 줄 아이템을 증정 상자에 넣고 뺀다(slot/gift.ts). 손님은 하루 한 번 무료로 돌려 받아 간다.
 * 넣은 것은 보관함에서 빠지고, 꺼내면 돌아온다. 상자는 공개 방에 있어서 방을 공개해야 쓸 수 있다.
 */
export function GiftBox({ onClose, say }: { onClose: () => void; say: (text: string) => void }) {
  const uid = useAuth().user?.uid ?? null;
  const data = useGarden((s) => s.data);
  const gid = data?.share.on ? data.share.id : null;
  const [stock, setStock] = useState<GiftStock | null | undefined>(undefined);
  const [wins, setWins] = useState<GiftWin[] | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(() => {
    if (!gid || !uid) return;
    loadGiftStock(gid)
      .then(setStock)
      .catch((e) => {
        console.error("[gift] 증정 상자를 읽지 못했다", e);
        setStock(null);
      });
    loadGiftWins(gid)
      .then(setWins)
      .catch((e) => {
        console.error("[gift] 받아 간 기록을 읽지 못했다", e);
        setWins(null);
      });
  }, [gid, uid]);
  useEffect(reload, [reload]);

  const title = "🎰 내 뽑기 기계 · 증정 상자";
  if (!data) return null;
  if (!gid || !uid) {
    return (
      <Sheet label="내 뽑기 기계" title={title} onClose={onClose}>
        <p className="mt-3 text-[13px] leading-relaxed">
          손님이 이 기계를 돌려 내가 넣어 둔 아이템을 받아 가요. {uid ? "위쪽 「🔗 자랑하기」에서 방을 공개하면" : "로그인하고 방을 공개하면"} 증정 상자를 채울 수 있어요.
        </p>
      </Sheet>
    );
  }

  const room = data.room;
  const spare = FURNITURE.filter((f) => giftable(f.id) && stowedCount(room, f.id) > 0);
  const inBox = Object.entries(stock ?? {});

  const put = async (id: string) => {
    if (busy || !stock) return;
    if (!canAddToStock(stock, id)) return say(`증정 상자에는 ${GIFT_KINDS_MAX}가지, 한 가지 ${GIFT_EACH_MAX}개까지 넣어요`);
    setBusy(true);
    try {
      if (!(await addGiftStock(gid, id))) return say("상자가 가득 찼어요");
      if (!useGarden.getState().boxGift(id)) {
        // 그 사이 보관함에서 사라졌다(다른 기기에서 놓았다) — 상자에 넣은 것을 되돌린다.
        await takeGiftStock(gid, id).catch((e) => console.error("[gift] 되돌리지 못했다", e));
        return say("보관함에 남은 것이 없어요");
      }
      gardenFeedback("tap");
      track("gift_box", { action: "put", item: id });
      say(`🎁 ${FURNITURE_BY_ID.get(id)?.label ?? "아이템"}을(를) 증정 상자에 넣었어요`);
    } catch (e) {
      console.error("[gift] 상자에 넣지 못했다", e);
      say("상자에 넣지 못했어요. 잠시 뒤 다시 해 보세요");
    } finally {
      setBusy(false);
      reload();
    }
  };

  const take = async (id: string) => {
    if (busy) return;
    if ((room.owned[id] ?? 0) >= OWN_MAX) return say(`보관함에 ${OWN_MAX}개까지예요. 하나를 팔거나 둔 뒤에 꺼내요`);
    setBusy(true);
    try {
      if (!(await takeGiftStock(gid, id))) return say("방금 손님이 받아 갔어요");
      useGarden.getState().unboxGift(id);
      gardenFeedback("tap");
      track("gift_box", { action: "take", item: id });
      say(`${FURNITURE_BY_ID.get(id)?.label ?? "아이템"}을(를) 보관함으로 꺼냈어요`);
    } catch (e) {
      console.error("[gift] 상자에서 꺼내지 못했다", e);
      say("꺼내지 못했어요. 잠시 뒤 다시 해 보세요");
    } finally {
      setBusy(false);
      reload();
    }
  };

  return (
    <Sheet label="내 뽑기 기계" title={title} onClose={onClose}>
      <p className="mt-1 text-[12.5px] leading-relaxed text-smoke">
        남는 가구를 넣어 두면 놀러 온 손님이 하루 한 번 무료로 돌려 받아 가요. 당첨 {pct(GIFT_WIN_P)}, 당첨이면 상자에 든 수에 비례해 하나. 넣은 것은 보관함에서 빠지고, 꺼내면 돌아와요.
      </p>

      <h3 className="mt-3 text-[13px] font-bold">🎁 증정 상자 {stock ? `· ${stockTotal(stock)}개` : ""}</h3>
      {stock === undefined ? (
        <p className="mt-1 text-[12.5px] text-smoke">여는 중…</p>
      ) : stock === null ? (
        <p className="mt-1 text-[12.5px] text-smoke">상자를 열지 못했어요. 잠시 뒤 다시 열어 주세요.</p>
      ) : inBox.length === 0 ? (
        <p className="mt-1 text-[12.5px] text-smoke">비어 있어요. 아래 보관함에서 넣어 보세요.</p>
      ) : (
        <ul className="mt-1.5 space-y-1.5">
          {inBox.map(([id, n]) => (
            <Row key={id} id={id} sub={`상자에 ${n}개`} action="꺼내기" disabled={busy} onClick={() => void take(id)} />
          ))}
        </ul>
      )}

      <h3 className="mt-4 text-[13px] font-bold">🧺 보관함에서 넣기</h3>
      {spare.length === 0 ? (
        <p className="mt-1 text-[12.5px] text-smoke">놓지 않고 보관함에 둔 가구가 없어요. 방 꾸미기에서 보관함에 넣은 것만 줄 수 있어요.</p>
      ) : (
        <ul className="mt-1.5 space-y-1.5">
          {spare.map((f) => (
            <Row key={f.id} id={f.id} sub={`보관함 ${stowedCount(room, f.id)}개`} action="넣기" disabled={busy || !stock} onClick={() => void put(f.id)} />
          ))}
        </ul>
      )}

      <h3 className="mt-4 text-[13px] font-bold">🙋 돌려 보고 간 손님</h3>
      {wins === undefined ? (
        <p className="mt-1 text-[12.5px] text-smoke">여는 중…</p>
      ) : !wins?.length ? (
        <p className="mt-1 text-[12.5px] text-smoke">아직 없어요.</p>
      ) : (
        <ul className="mt-1 space-y-0.5 text-[12.5px]">
          {wins.slice(0, 20).map((w) => (
            <li key={w.uid} className="flex justify-between gap-2">
              <span className="min-w-0 truncate">
                <b>{w.nick}</b> — {w.it ? `🎁 ${FURNITURE_BY_ID.get(w.it)?.label ?? "아이템"}` : "꽝"}
              </span>
              <span className="shrink-0 text-smoke">{w.at ? new Date(w.at).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric", timeZone: "Asia/Seoul" }) : ""}</span>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}

function Row({ id, sub, action, disabled, onClick }: { id: string; sub: string; action: string; disabled: boolean; onClick: () => void }) {
  return (
    <li className="flex min-h-[52px] items-center gap-2 rounded-xl border border-stone bg-white px-2 py-1.5">
      <span className="shrink-0"><FurnitureIcon id={id} size={40} /></span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold">{FURNITURE_BY_ID.get(id)?.label ?? id}</span>
        <span className="block text-[11.5px] text-smoke">{sub}</span>
      </span>
      <button type="button" className="garden-chip-btn shrink-0" disabled={disabled} onClick={onClick}>
        {action}
      </button>
    </li>
  );
}
