"use client";

import Link from "next/link";
import { useState } from "react";

import { track } from "@/lib/analytics";

import { gardenFeedback } from "../feedback";
import { formatLeft, josa, kstDay } from "../rules";
import { FURNITURE, FURNITURE_BY_ID, type Furniture } from "../room/catalog";
import { FurnitureStory } from "../room/FurnitureStory";
import { STORY_COLLECTIONS, STORY_LABEL, type StoryCollection } from "../room/stories";
import { activityOf } from "../room/activities";
import { FurnitureIcon, RoomScene } from "../room/RoomArt";
import { firstOpenSlot, hasSurface, nextRoomSize, OWN_MAX, ROOM_SIZES, onSale, weekLeft, weeklyPicks, type BuyRefusal } from "../room/rules";
import { useGarden, type GardenData } from "../store";
import type { Species } from "../types";
import { BuySheet, ExpandBanner, priceText, ShopCard } from "./parts";
import { PianoPreview } from "../room/PianoPlayer";
import { ActivityPreview } from "./ActivityPreview";

/**
 * 🛋 가구 · 🎨 벽·바닥 (docs/garden-miniroom.md §6). 가구는 꾸밈일 뿐 효과가 없다.
 * 위쪽 "이번 주 진열" 네 칸은 한국 시각 월요일마다 바뀐다(room/rules.ts의 weeklyPicks).
 */
const GROUPS: Array<{ title: string; kinds: Furniture["kind"][] }> = [
  { title: "바닥에 놓는 것", kinds: ["floor"] },
  { title: "벽에 거는 것", kinds: ["wall", "frame-blank"] },
  { title: "창문", kinds: ["window"] },
];

const REFUSAL: Record<BuyRefusal, string> = {
  unknown: "없는 물건이에요",
  "off-sale": "지금은 팔지 않아요",
  owned: "이미 가지고 있어요",
  full: `${OWN_MAX}개까지 가질 수 있어요`,
  jam: "잼이 모자라요",
};

export function RoomShop({
  cat,
  data,
  byId,
  now,
  say,
}: {
  cat: "furniture" | "walls";
  data: GardenData;
  byId: Map<string, Species>;
  now: number;
  say: (text: string) => void;
}) {
  const [collection, setCollection] = useState<StoryCollection | "all">("all");
  const [open, setOpen] = useState<string | null>(null);
  const { buyFurniture, upgradeRoom, applySurface } = useGarden.getState();
  const room = data.room;
  const weekly = weeklyPicks(now);
  const next = nextRoomSize(room);
  const surface = (f: Furniture) => f.kind === "wallpaper" || f.kind === "flooring";

  const buy = (id: string) => {
    const f = FURNITURE_BY_ID.get(id);
    const out = buyFurniture(id);
    if (out !== true || !f) {
      if (out !== true) say(REFUSAL[out]);
      return;
    }
    gardenFeedback("reward");
    track("shop_buy", { cat });
    say(surface(f) ? `🎨 ${josa(f.label, "을를")} 샀어요 · 시트에서 바로 바를 수 있어요` : `🛋 ${josa(f.label, "을를")} 샀어요 · 방 꾸미기에서 놓아요`);
  };

  const today = kstDay(now);
  const isNew = (f: Furniture) => Boolean(f.newUntil && today <= f.newUntil);

  const card = (f: Furniture) => {
    const have = room.owned[f.id] ?? 0;
    const owned = surface(f) && hasSurface(room, f.id, f.kind as "wallpaper" | "flooring");
    return (
      <ShopCard
        key={f.id}
        art={<FurnitureIcon id={f.id} size={56} />}
        title={f.label}
        badge={isNew(f) ? "NEW" : undefined}
        sub={owned ? "가지고 있어요" : have > 0 ? `가진 것 ${have}개` : f.id === "piano" ? "15초 작곡 · 방문자는 감상" : activityOf(f.id)?.clips ? "▶ 실제 목소리 듣기" : activityOf(f.id) ? "누르면 움직여요" : f.story ? STORY_LABEL[f.story.kind] : f.reading ? "누르면 자서전 읽기" : f.shortcut ? "누르면 바로가기" : f.kind === "window" ? "벽 2칸 · 창밖은 지금 날씨" : f.size === 2 ? "2칸짜리" : "1칸짜리"}
        buyLabel={owned ? "가짐" : priceText(f.price)}
        buyDisabled={owned || data.jam < f.price || have >= OWN_MAX}
        onOpen={() => { gardenFeedback("tap"); setOpen(f.id); }}
        onBuy={() => buy(f.id)}
      />
    );
  };

  // 🏆 전리품(뿌리 조각)과 보상은 잼 진열에 두지 않는다 — TrophyShop.tsx.
  const items = FURNITURE.filter((f) => !f.weekly && !f.cur && f.price > 0);
  const stories = items.filter((f) => f.story);
  const opened = open ? FURNITURE_BY_ID.get(open) : undefined;

  return (
    <section aria-label={cat === "furniture" ? "가구" : "벽·바닥"}>
      {cat === "furniture" && next && (
        <ExpandBanner
          icon="🏠"
          title="방 넓히기"
          sub={`${ROOM_SIZES[room.size].label} → ${next.label} · 벽 ${next.width}칸, 바닥 ${next.width * 2}칸`}
          price={next.price}
          wallet={data.jam}
          onBuy={() => {
            if (!upgradeRoom()) return;
            gardenFeedback("reward");
            track("shop_buy", { cat: "furniture" });
            say(`🏠 ${next.label}이 되었어요`);
          }}
        />
      )}

      {cat === "furniture" && (
        <>
          <section aria-label="특별한 책" className="mb-4">
            <h3 className="garden-diary-title">📚 특별한 책 · {items.filter((f) => f.reading).length}권</h3>
            <p className="mt-1 text-[12px] leading-relaxed text-smoke">한 권에 100,000잼으로 만나는 고가 소장품. 방에 놓고 누르면 자서전의 장별 요약을 읽을 수 있어요.</p>
            <ul className="garden-shop-grid">{items.filter((f) => f.reading).map(card)}</ul>
          </section>
          <section aria-label="누르면 반응하는 소품" className="mb-4">
            <h3 className="garden-diary-title">♪ 누르면 반응하는 소품</h3>
            <p className="mt-1 text-[12px] leading-relaxed text-smoke">소품을 눌러 구매 전에 무료로 체험해 보세요. 오르골·종소리부터 실제 목소리 영상까지 만날 수 있어요. 바비·바둑판·어항·축구공 등에도 새 반응이 생겼어요.</p>
            <ul className="garden-shop-grid">{items.filter((f) => !f.story && activityOf(f.id)).map(card)}</ul>
          </section>
          {items.some((f) => isNew(f) && !f.story && !activityOf(f.id)) && (
            <div className="mb-4">
              <h3 className="garden-diary-title">✨ 새로 들어온 가구</h3>
              <ul className="garden-shop-grid">{items.filter((f) => isNew(f) && !f.story && !activityOf(f.id)).map(card)}</ul>
            </div>
          )}
          <section aria-label="이야기가 있는 소품" className="mb-4">
            <h3 className="garden-diary-title">📖 이야기가 있는 소품 · {stories.length}종</h3>
            <p className="mt-1 text-[12px] leading-relaxed text-smoke">이재명 대통령의 반려견·취미·옛 블로그·선물 기록에서 만난 소품이에요. 눌러서 이야기와 출처를 읽어 보세요.</p>
            <div role="group" aria-label="소품 이야기 고르기" className="garden-chips my-2">
              <button type="button" className="garden-chip-btn" aria-pressed={collection === "all"} onClick={() => setCollection("all")}>전체</button>
              {STORY_COLLECTIONS.map((c) => <button key={c.id} type="button" className="garden-chip-btn" aria-pressed={collection === c.id} onClick={() => setCollection(c.id)}>{c.label}</button>)}
            </div>
            <ul className="garden-shop-grid">{stories.filter((f) => collection === "all" || f.collection === collection).map(card)}</ul>
          </section>
          <p className="garden-shop-notice">🗓 이번 주 진열 · 새 진열까지 {formatLeft(weekLeft(now))}</p>
          <ul className="garden-shop-grid">{weekly.map((id) => FURNITURE_BY_ID.get(id)).filter((f): f is Furniture => Boolean(f)).map(card)}</ul>
          {GROUPS.map((g) => (
            <div key={g.title} className="mt-4">
              <h3 className="garden-diary-title">{g.title}</h3>
              <ul className="garden-shop-grid">{items.filter((f) => !f.story && !f.reading && !activityOf(f.id) && g.kinds.includes(f.kind)).map(card)}</ul>
            </div>
          ))}
        </>
      )}

      {cat === "walls" &&
        (["wallpaper", "flooring"] as const).map((kind) => (
          <div key={kind} className="mt-1 first:mt-0">
            <h3 className="garden-diary-title">{kind === "wallpaper" ? "벽지" : "바닥재"}</h3>
            <ul className="garden-shop-grid">
              {FURNITURE.filter((f) => f.kind === kind && ((f.price === 0 && !f.cur) || onSale(f, now) || hasSurface(room, f.id, kind))).map(card)}
            </ul>
          </div>
        ))}

      {opened && (
        <BuySheet
          title={opened.label}
          art={activityOf(opened.id) ? <ActivityPreview key={opened.id} id={opened.id} label={opened.label} /> : <FurnitureIcon id={opened.id} size={96} />}
          facts={[
            ["가진 것", surface(opened) ? (hasSurface(room, opened.id, opened.kind as "wallpaper") ? "있어요" : "없어요") : `${room.owned[opened.id] ?? 0}개`],
            ["크기", surface(opened) ? "방 전체" : opened.kind === "frame-blank" ? "벽 1칸 · 쪽지 한 장" : `${opened.size}칸`],
          ]}
          price={opened.price}
          wallet={data.jam}
          blocked={
            opened.cur
              ? opened.cur === "root"
                ? "🏆 전리품 칸에서 뿌리 조각으로 바꿔요"
                : "여섯 악초의 박제를 다 모으면 받아요"
              : !onSale(opened, now)
              ? opened.price === 0
                ? "처음부터 가진 것이에요"
                : "이번 주 진열에 없어요"
              : surface(opened) && hasSurface(room, opened.id, opened.kind as "wallpaper")
                ? "이미 가지고 있어요"
                : (room.owned[opened.id] ?? 0) >= OWN_MAX
                  ? REFUSAL.full
                  : undefined
          }
          onBuy={() => buy(opened.id)}
          onClose={() => setOpen(null)}
        >
          <p>{opened.hint}</p>
          {opened.id === "piano" && <PianoPreview />}
          {opened.reading && <Link href={opened.reading.href} className="mt-2 inline-flex min-h-[44px] items-center font-semibold underline underline-offset-2">{opened.reading.label} →</Link>}
          {opened.story && <FurnitureStory story={opened.story} />}
          <div className="mt-3">
            <p className="text-[12px] font-semibold text-smoke">방에 놓아 보기</p>
            <div className="mt-1">
              <RoomScene
                room={
                  surface(opened)
                    ? { ...room, [opened.kind === "wallpaper" ? "wall" : "floor"]: opened.id }
                    : room
                }
                ghost={!surface(opened) ? previewSlot(room, opened.id) : null}
                byId={byId}
                now={now}
                label={`${opened.label} 놓아 본 내 방`}
              />
            </div>
            {!surface(opened) && !previewSlot(room, opened.id) && (
              <p className="mt-1 text-[12px] text-smoke">지금 방에는 빈 칸이 없어요. 놓인 것을 넣거나 방을 넓혀 보세요.</p>
            )}
          </div>
          {surface(opened) && hasSurface(room, opened.id, opened.kind as "wallpaper") && (
            <button
              type="button"
              className="garden-diary-btn mt-3"
              disabled={room.wall === opened.id || room.floor === opened.id}
              onClick={() => {
                if (!applySurface(opened.id)) return;
                gardenFeedback("tap");
                say(opened.kind === "wallpaper" ? "🎨 벽지를 바꿨어요" : "🎨 바닥재를 바꿨어요");
              }}
            >
              {room.wall === opened.id || room.floor === opened.id ? "지금 쓰는 중" : "지금 바르기"}
            </button>
          )}
        </BuySheet>
      )}
    </section>
  );
}

/** 미리 보기 자리. 가진 수와 상관없이 첫 빈 칸에 흐리게 얹어 본다. */
function previewSlot(room: GardenData["room"], id: string) {
  const at = firstOpenSlot(room, id);
  return at ? { at, it: id } : null;
}
