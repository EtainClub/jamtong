"use client";

import { track } from "@/lib/analytics";

import { gardenFeedback } from "./feedback";
import { josa } from "./rules";
import { Sheet } from "./Sheet";
import { useGarden } from "./store";
import { YARD_ITEMS, YARD_OWN_MAX, yardLeft, type YardData, type YardItem } from "./yard";
import yardArt from "./yardArt.json";

/**
 * 마당 꾸밈 자리 하나 — 놓인 소품을 치우거나, 가진 소품을 놓거나, 잼으로 사서 놓는다(docs/garden-farm-v2.md §6 4b).
 * 효과는 없다. 사면 바로 이 자리에 놓는다.
 */
export function YardSheet({ slot, yard, jam, say, onClose }: { slot: number; yard: YardData; jam: number; say: (text: string) => void; onClose: () => void }) {
  const here = yard.slots[slot];
  const { buyYard, setYardSlot } = useGarden.getState();
  const put = (item: YardItem) => {
    if (!setYardSlot(slot, item.id)) return;
    gardenFeedback("plant");
    track("yard_place", { item: item.id, slot });
    say(`🏡 ${josa(item.label, "을를")} 마당에 놓았어요`);
    onClose();
  };
  const buy = (item: YardItem) => {
    const out = buyYard(item.id);
    if (out !== true) {
      say(out === "jam" ? `잼이 모자라요 · ${item.price}잼` : out === "full" ? `${item.label} — ${YARD_OWN_MAX}개까지 가질 수 있어요` : "살 수 없어요");
      return;
    }
    gardenFeedback("reward");
    track("yard_buy", { item: item.id, price: item.price });
    const latest = useGarden.getState().data?.yard;
    if (latest && setYardSlot(slot, item.id)) {
      say(`🏡 ${item.label} — 잼 ${item.price}으로 사서 마당에 놓았어요`);
      onClose();
    }
  };
  return (
    <Sheet label={`마당 꾸밈 자리 ${slot + 1}`} title={`🏡 꾸밈 자리 ${slot + 1}`} onClose={onClose}>
      <p className="mt-1 text-[12px] text-smoke">가진 잼 {jam.toLocaleString()} · 한 가지를 {YARD_OWN_MAX}개까지 가질 수 있어요. 꾸밈일 뿐 작물에는 효과가 없어요.</p>
      {here && (
        <button
          type="button"
          className="garden-diary-btn is-quiet mt-2 w-full"
          onClick={() => { if (setYardSlot(slot, null)) { gardenFeedback("tap"); say("마당 소품을 치웠어요 · 다시 놓을 수 있어요"); onClose(); } }}
        >
          이 자리 비우기
        </button>
      )}
      <ul className="mt-3 space-y-2">
        {YARD_ITEMS.map((item) => {
          const left = yardLeft(yard, item.id) + (here === item.id ? 1 : 0);
          const owned = yard.owned[item.id] ?? 0;
          return (
            <li key={item.id} className="garden-yard-item">
              <span className="garden-yard-thumb" aria-hidden="true">
                {(yardArt as string[]).includes(item.id) ? (
                  // 작은 도트 그림 한 장 — next/image의 최적화가 필요 없다(방 상점 아이콘과 같다).
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/images/room-iso/yard-${item.id}.png`} alt="" />
                ) : item.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-semibold">{item.label}{here === item.id ? " · 여기 있어요" : ""}</span>
                <span className="block text-[11.5px] text-smoke">{item.hint} · 가진 것 {owned}</span>
              </span>
              {here !== item.id && left > 0 ? (
                <button type="button" className="garden-diary-btn" onClick={() => put(item)}>놓기</button>
              ) : here !== item.id && owned < YARD_OWN_MAX ? (
                <button type="button" className="garden-diary-btn" disabled={jam < item.price} onClick={() => buy(item)}>
                  🍯 {item.price}
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Sheet>
  );
}
