"use client";

import { useState } from "react";

import { track } from "@/lib/analytics";

import { gardenFeedback } from "../feedback";
import { josa, RAID_KINDS } from "../rules";
import { RaidTrophyArt } from "../RaidWeedArt";
import { SAMPLES_PER_TROPHY, TROPHY_WALLPAPER } from "../raid/rules";
import { FURNITURE, FURNITURE_BY_ID, type Furniture } from "../room/catalog";
import { FurnitureIcon } from "../room/RoomArt";
import { OWN_MAX, type BuyRefusal } from "../room/rules";
import { useGarden, type GardenData } from "../store";
import { BuySheet, CURRENCY, priceText, ShopCard } from "./parts";

/**
 * 🏆 전리품 — 거대 잡초의 뿌리 조각(docs/garden-miniroom.md §7.4)으로 사는 칸.
 *
 * ★ 재화는 잼이 아니라 뿌리 조각이다. 잼으로 살 수 없고 남에게 줄 수 없다.
 * ★ 늘 같은 진열, 정해진 값, 무작위 없음. 꾸밈일 뿐 효과는 없다 — 필살기 연출도 그림만 바뀐다.
 * ★ 박제는 팔지 않는다. 표본 조각 셋으로 생긴다. 이 칸은 모은 정도를 보여 준다.
 */
const REFUSAL: Record<BuyRefusal, string> = {
  unknown: "없는 물건이에요",
  "off-sale": "뿌리 조각으로 사는 물건이 아니에요",
  owned: "이미 가지고 있어요",
  full: `${OWN_MAX}개까지 가질 수 있어요`,
  jam: "뿌리 조각이 모자라요",
};

export function TrophyShop({ data, say }: { data: GardenData; say: (text: string) => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const items = FURNITURE.filter((f) => f.cur === "root");
  const room = data.room;
  const once = (f: Furniture) => f.kind === "wallpaper" || f.kind === "flooring" || f.kind === "fx";
  const owned = (f: Furniture) => once(f) && (room.owned[f.id] ?? 0) > 0;

  const buy = (id: string) => {
    const f = FURNITURE_BY_ID.get(id);
    const out = useGarden.getState().buyTrophy(id);
    if (out !== true || !f) {
      if (out !== true) say(REFUSAL[out]);
      return;
    }
    gardenFeedback("reward");
    track("shop_buy", { cat: "trophy" });
    say(
      f.kind === "fx"
        ? `${f.art} ${josa(f.label, "을를")} 샀어요 · 시트에서 고를 수 있어요`
        : f.kind === "wallpaper" || f.kind === "flooring"
          ? `🎨 ${josa(f.label, "을를")} 샀어요 · 벽·바닥 칸이나 꾸미기에서 발라요`
          : `🏆 ${josa(f.label, "을를")} 샀어요 · 방 꾸미기에서 놓아요`,
    );
  };

  const art = (f: Furniture, size: number) =>
    f.kind === "fx" ? <span style={{ fontSize: size * 0.6 }} className="leading-none">{f.art}</span> : <FurnitureIcon id={f.id} size={size} />;
  const opened = open ? FURNITURE_BY_ID.get(open) : undefined;
  const trophies = new Set(room.shown.filter((s) => s.kind === "trophy").map((s) => s.species));

  return (
    <section aria-label="전리품">
      <p className="garden-shop-notice">
        {CURRENCY.root.icon} 가진 {CURRENCY.root.label} <b className="tabular-nums">{data.roots.toLocaleString()}</b> · 거대 잡초에서만 모여요. 잼으로는 살 수 없어요.
      </p>

      <h3 className="garden-diary-title mt-3">악초 박제</h3>
      <p className="text-[12px] text-smoke">쓰러뜨릴 때마다 그 종류의 표본 조각 하나. {SAMPLES_PER_TROPHY}개면 박제가 방에 생겨요. 여섯 종류를 다 모으면 벽지 ‘{FURNITURE_BY_ID.get(TROPHY_WALLPAPER)?.label}’.</p>
      <ul className="mt-2 grid grid-cols-3 gap-2">
        {RAID_KINDS.map((k) => {
          const have = trophies.has(k.id);
          const n = have ? SAMPLES_PER_TROPHY : (data.loot.samples[k.id] ?? 0);
          return (
            <li key={k.id} className={`rounded-xl border border-dashed border-stone px-1 py-2 text-center ${have ? "bg-white" : "opacity-80"}`}>
              <span className={`mx-auto block h-14 w-14 ${have ? "" : "grayscale opacity-50"}`}>
                <RaidTrophyArt kind={k.id} />
              </span>
              <span className="block text-[11px] font-bold leading-tight">{k.name}</span>
              <span className="block text-[11px] tabular-nums text-smoke">{have ? "박제 ✓" : `표본 ${n}/${SAMPLES_PER_TROPHY}`}</span>
            </li>
          );
        })}
      </ul>

      <h3 className="garden-diary-title mt-4">뿌리 조각으로 바꾸기</h3>
      <ul className="garden-shop-grid">
        {items.map((f) => {
          const have = room.owned[f.id] ?? 0;
          return (
            <ShopCard
              key={f.id}
              art={art(f, 56)}
              title={f.label}
              sub={owned(f) ? "가지고 있어요" : have > 0 ? `가진 것 ${have}개` : f.kind === "fx" ? "필살기 연출" : once(f) ? (f.kind === "wallpaper" ? "벽지" : "바닥재") : f.size === 2 ? "2칸짜리" : "1칸짜리"}
              rare
              buyLabel={owned(f) ? "가짐" : priceText(f.price, "root")}
              buyDisabled={owned(f) || data.roots < f.price || have >= OWN_MAX}
              onOpen={() => { gardenFeedback("tap"); setOpen(f.id); }}
              onBuy={() => buy(f.id)}
            />
          );
        })}
      </ul>

      {opened && (
        <BuySheet
          title={opened.label}
          art={art(opened, 96)}
          facts={[
            ["가진 것", once(opened) ? (owned(opened) ? "있어요" : "없어요") : `${room.owned[opened.id] ?? 0}개`],
            ["크기", opened.kind === "fx" ? "싸움터 연출" : once(opened) ? "방 전체" : `${opened.size}칸`],
          ]}
          price={opened.price}
          currency="root"
          wallet={data.roots}
          blocked={owned(opened) ? "이미 가지고 있어요" : (room.owned[opened.id] ?? 0) >= OWN_MAX ? REFUSAL.full : undefined}
          onBuy={() => buy(opened.id)}
          onClose={() => setOpen(null)}
        >
          <p>{opened.hint}</p>
          {opened.kind === "fx" && owned(opened) && (
            <button
              type="button"
              className="garden-diary-btn mt-3"
              onClick={() => {
                const on = data.loot.fx === opened.id;
                useGarden.getState().setFx(on ? null : opened.id);
                gardenFeedback("tap");
                say(on ? "필살기 연출을 기본으로 돌렸어요" : `${opened.art} 필살기 연출을 골랐어요`);
              }}
            >
              {data.loot.fx === opened.id ? "기본 연출로 돌리기" : "이 연출 쓰기"}
            </button>
          )}
        </BuySheet>
      )}
    </section>
  );
}
