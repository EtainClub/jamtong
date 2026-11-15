"use client";

import { useState } from "react";

import { track } from "@/lib/analytics";

import { AvatarIcon } from "../avatar/AvatarArt";
import { AVATAR_NAME, PARTS, WEAR, WEAR_BY_ID, type Part } from "../avatar/catalog";
import type { Look } from "../avatar/compose";
import { moodFace, rewardText, wearOnSale, type WearRefusal } from "../avatar/rules";
import { gardenFeedback } from "../feedback";
import { josa } from "../rules";
import { useGarden, type GardenData } from "../store";
import { BuySheet, priceText, ShopCard } from "./parts";

/**
 * 👕 옷장 — 꼬마의 옷을 잼(전리품 옷은 뿌리 조각)으로 산다. 설계는 docs/garden-avatar.md §7.2.
 *
 * ★ 카드 그림은 내 꼬마가 그 옷을 입은 모습이다(입어 보기). 입어 보기는 장부를 바꾸지 않는다.
 * ★ 늘 같은 진열, 정해진 값. 뽑기·기간제 없음. 꾸밈일 뿐 효과는 없다.
 * ★ 받는 옷(칭호·황금·박제)은 팔지 않는다. 조건만 적는다.
 */

const REFUSAL: Record<WearRefusal, string> = {
  unknown: "없는 옷이에요",
  "off-sale": "파는 옷이 아니에요",
  owned: "이미 가지고 있어요",
  short: "모자라요",
};

export function WearShop({ data, say }: { data: GardenData; say: (text: string) => void }) {
  const [part, setPart] = useState<Part | "all">("all");
  const [open, setOpen] = useState<string | null>(null);
  const avatar = data.room.avatar;
  if (!avatar) return null;
  const face = moodFace(data.room.mood);
  const has = (id: string) => avatar.owned.includes(id);
  const items = WEAR.filter((w) => (wearOnSale(w) || w.cur === "reward") && (part === "all" || w.part === part));
  const tryOn = (id: string): Look => {
    const w = WEAR_BY_ID.get(id)!;
    return w.part === "bubble" ? avatar.look : { ...avatar.look, [w.part]: id };
  };
  const wallet = (cur: "jam" | "root") => (cur === "root" ? data.roots : data.jam);

  const buy = (id: string) => {
    const w = WEAR_BY_ID.get(id);
    const out = useGarden.getState().buyWear(id);
    if (out !== true || !w) {
      if (out !== true) say(REFUSAL[out]);
      return;
    }
    gardenFeedback("reward");
    track("shop_buy", { cat: "wear" });
    say(`👕 ${josa(w.label, "을를")} 샀어요 · 내 방의 ${AVATAR_NAME}를 눌러 갈아입어요`);
  };

  const opened = open ? WEAR_BY_ID.get(open) : undefined;
  const openedCur = opened?.cur === "root" ? "root" : "jam";

  return (
    <div>
      <p className="text-[12.5px] leading-relaxed text-smoke">
        {AVATAR_NAME}의 옷이에요. 피부색·머리색과 기본 옷은 무료고, 카드는 내 {AVATAR_NAME}가 입어 본 모습이에요.
      </p>
      <div className="garden-chips mt-2" role="group" aria-label="옷 갈래">
        {[{ id: "all" as const, label: "전체" }, ...PARTS.filter((p) => p.id !== "eyes")].map((p) => (
          <button key={p.id} type="button" aria-pressed={part === p.id} className="garden-chip-btn" onClick={() => { gardenFeedback("tap"); setPart(p.id); }}>
            {p.label}
          </button>
        ))}
      </div>
      <ul className="garden-shop-grid mt-3">
        {items.map((w) => {
          const cur = w.cur === "root" ? "root" : "jam";
          const owned = has(w.id);
          const reward = w.cur === "reward";
          return (
            <ShopCard
              key={w.id}
              art={w.part === "bubble" ? <span className={`garden-avatar-bubble-chip is-${w.id}`} aria-hidden="true">💬</span> : <AvatarIcon look={tryOn(w.id)} face={face} size={64} />}
              title={w.label}
              sub={reward ? "받는 옷" : w.hint}
              buyLabel={owned ? "가짐" : reward ? "조건 보기" : priceText(w.price, cur)}
              buyDisabled={owned || (!reward && wallet(cur) < w.price)}
              onOpen={() => { gardenFeedback("tap"); setOpen(w.id); }}
              onBuy={reward ? () => setOpen(w.id) : () => buy(w.id)}
            />
          );
        })}
      </ul>
      {opened && (
        <BuySheet
          title={opened.label}
          art={opened.part === "bubble" ? <span className={`garden-avatar-bubble-chip is-${opened.id}`} aria-hidden="true">💬</span> : <AvatarIcon look={tryOn(opened.id)} face={face} size={120} label={`${opened.label}을 입어 본 ${AVATAR_NAME}`} />}
          facts={[["갈래", PARTS.find((p) => p.id === opened.part)?.label ?? ""], ["가짐", has(opened.id) ? "있음" : "없음"]]}
          price={opened.price}
          currency={openedCur}
          wallet={wallet(openedCur)}
          blocked={has(opened.id) ? "이미 가지고 있어요" : opened.cur === "reward" && opened.reward ? rewardText(opened.reward) : undefined}
          onBuy={() => buy(opened.id)}
          onClose={() => setOpen(null)}
        >
          {opened.hint} 꾸밈일 뿐 효과는 없어요.
        </BuySheet>
      )}
    </div>
  );
}
