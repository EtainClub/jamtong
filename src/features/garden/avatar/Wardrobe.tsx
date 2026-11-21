"use client";

import { useEffect, useMemo, useState } from "react";

import { track } from "@/lib/analytics";

import { gardenFeedback } from "../feedback";
import { josa } from "../rules";
import { Sheet } from "../Sheet";
import { CURRENCY, priceText, shortText } from "../shop/parts";
import { useGarden, type GardenData } from "../store";
import { AvatarIcon } from "./AvatarArt";
import { AVATAR_NAME, PARTS, WEAR, WEAR_BY_ID, type Part, type Wear } from "./catalog";
import type { Look } from "./compose";
import { CLOTH_NAMES, CLOTHS, HAIR_COLOR_NAMES, HAIR_COLORS, SKIN_NAMES, SKINS } from "./palette";
import { moodFace, ownsWear, rewardText, unownedWear, type AvatarData, type WearRefusal } from "./rules";

/**
 * 옷 갈아입기 — 꼬마의 얼굴·머리·옷·자리를 고른다. 설계는 docs/garden-avatar.md §7.3.
 *
 * ★ 저장 전까지 장부를 고치지 않는다. 가지지 않은 옷은 입어 볼 수 있지만, 사거나 벗어야 저장된다.
 * ★ 피부색·머리색은 무료. 옷을 사면 잼(또는 뿌리 조각)이 바로 나간다 — 사기는 저장과 따로다.
 * ★ "섞어 보기"는 가진 것 안에서만 고른다. 아무것도 얻지 않는다(뽑기가 아니다).
 */

const REFUSAL: Record<WearRefusal, string> = {
  unknown: "없는 옷이에요",
  "off-sale": "파는 옷이 아니에요",
  owned: "이미 가지고 있어요",
  short: "모자라요",
};

const TINT_PART: Partial<Record<Part, "top" | "bottom" | "shoes">> = { top: "top", bottom: "bottom", shoes: "shoes" };

export function Wardrobe({
  data,
  levels,
  onClose,
  say,
}: {
  data: GardenData;
  levels?: Partial<Record<"dex" | "storm" | "plaza", number>>;
  onClose: () => void;
  say: (text: string) => void;
}) {
  const saved = data.room.avatar!;
  const [draft, setDraft] = useState<AvatarData>(saved);
  const [part, setPart] = useState<Part>("hair");
  const owned = { owned: saved.owned };
  const face = moodFace(data.room.mood);
  // 시트는 누른 뒤에만 열리므로(서버에서 그리지 않는다) 처음 값에서 바로 읽어도 된다.
  const [reduceMotion] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  // 열 때 한 번 — 조건을 채운 받는 옷을 옷장에 넣는다.
  useEffect(() => {
    const got = useGarden.getState().claimWear(levels ?? {});
    if (got.length) say(`🎁 ${got.map((id) => WEAR_BY_ID.get(id)?.label).join(", ")}을(를) 받았어요`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const look = draft.look;
  const setLook = (next: Partial<Look>) => setDraft((d) => ({ ...d, look: { ...d.look, ...next } }));
  const unowned = unownedWear(owned, look);
  const dirty = JSON.stringify(draft) !== JSON.stringify({ ...saved, owned: draft.owned });
  const items = useMemo(() => WEAR.filter((w) => w.part === part), [part]);
  const optional = PARTS.find((p) => p.id === part)?.optional ?? false;
  const current = part === "bubble" ? look.bubble : look[part as Exclude<Part, "bubble">];
  const currentWear = current ? WEAR_BY_ID.get(current) : undefined;
  const tintPart = TINT_PART[part];

  const wear = (w: Wear | null) => {
    gardenFeedback("tap");
    if (part === "bubble") setLook({ bubble: w?.id ?? "basic" });
    else setLook({ [part]: w?.id } as Partial<Look>);
  };

  const shuffle = () => {
    gardenFeedback("tap");
    const one = (p: Exclude<Part, "bubble">) => {
      const mine = WEAR.filter((w) => w.part === p && ownsWear(owned, w.id));
      return mine[Math.floor(Math.random() * mine.length)]?.id;
    };
    setLook({
      hair: one("hair") ?? look.hair,
      eyes: one("eyes") ?? look.eyes,
      top: one("top") ?? look.top,
      bottom: one("bottom") ?? look.bottom,
      shoes: one("shoes") ?? look.shoes,
      hairColor: Math.floor(Math.random() * HAIR_COLORS.length),
      tint: { top: Math.floor(Math.random() * CLOTHS.length), bottom: Math.floor(Math.random() * CLOTHS.length), shoes: Math.floor(Math.random() * CLOTHS.length) },
    });
  };

  const buy = (w: Wear) => {
    const out = useGarden.getState().buyWear(w.id);
    if (out !== true) {
      say(out === "short" ? shortText(w.price - (w.cur === "root" ? data.roots : data.jam), w.cur === "root" ? "root" : "jam") : REFUSAL[out]);
      return;
    }
    gardenFeedback("reward");
    track("shop_buy", { cat: "wear" });
    setDraft((d) => ({ ...d, owned: [...d.owned, w.id] }));
    say(`👕 ${josa(w.label, "을를")} 샀어요`);
  };

  const save = () => {
    if (!useGarden.getState().saveAvatar(draft)) {
      say("저장하지 못했어요 — 가지지 않은 옷을 사거나 벗어 주세요");
      return;
    }
    const parts = (Object.keys(look) as Array<keyof Look>).filter((k) => JSON.stringify(look[k]) !== JSON.stringify(saved.look[k]));
    if (parts.length) track("avatar_edit", { parts: parts.join(",") });
    if (draft.on !== saved.on || draft.roam !== saved.roam) track("avatar_place", { on: draft.on, roam: draft.roam });
    gardenFeedback("reward");
    say(`${AVATAR_NAME}를 꾸몄어요`);
    onClose();
  };

  const close = () => {
    if (dirty && !window.confirm("저장하지 않고 닫을까요? 바꾼 것이 사라져요(산 옷은 남아요).")) return;
    onClose();
  };

  return (
    <Sheet label={`${AVATAR_NAME} 옷 갈아입기`} title="옷 갈아입기" onClose={close}>
      <div className="mt-2 flex items-end justify-center gap-4">
        <AvatarIcon look={look} face={face} size={120} label={`지금 ${AVATAR_NAME}`} />
        <button type="button" className="garden-diary-btn is-quiet" onClick={shuffle}>🎲 섞어 보기</button>
      </div>

      <Swatches label="피부" names={SKIN_NAMES} colors={SKINS.map((t) => t[0])} value={look.skin} onPick={(skin) => setLook({ skin })} />
      <Swatches label="머리색" names={HAIR_COLOR_NAMES} colors={HAIR_COLORS.map((t) => t[0])} value={look.hairColor} onPick={(hairColor) => setLook({ hairColor })} />

      <div className="garden-chips mt-3" role="group" aria-label="부위">
        {PARTS.map((p) => (
          <button key={p.id} type="button" aria-pressed={part === p.id} className="garden-chip-btn" onClick={() => { gardenFeedback("tap"); setPart(p.id); }}>
            {p.label}
          </button>
        ))}
      </div>

      <ul className="mt-2 grid grid-cols-4 gap-2">
        {optional && (
          <li>
            <button type="button" aria-pressed={!current} className="garden-wear-btn" onClick={() => wear(null)}>
              <span className="text-[22px]" aria-hidden="true">∅</span>
              <span>없음</span>
            </button>
          </li>
        )}
        {items.map((w) => {
          const has = ownsWear(owned, w.id) || draft.owned.includes(w.id);
          const preview: Look = part === "bubble" ? look : { ...look, [part]: w.id };
          return (
            <li key={w.id}>
              <button type="button" aria-pressed={current === w.id} className="garden-wear-btn" onClick={() => wear(w)} aria-label={`${w.label}${has ? "" : " · 입어 보기"}`}>
                {part === "bubble" ? (
                  <span className={`garden-avatar-bubble-chip is-${w.id}`} aria-hidden="true">💬</span>
                ) : (
                  <AvatarIcon look={preview} face={face} size={52} />
                )}
                <span className="truncate">{w.label}</span>
                {!has && <span className="garden-wear-lock">🔒 {w.cur === "reward" ? "받기" : priceText(w.price, w.cur === "root" ? "root" : "jam")}</span>}
              </button>
            </li>
          );
        })}
      </ul>

      {currentWear && !ownsWear(owned, currentWear.id) && !draft.owned.includes(currentWear.id) && (
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-[var(--d-line)] p-2 text-[12.5px]" aria-live="polite">
          <p className="min-w-0 flex-1">
            <b>{currentWear.label}</b> 입어 보는 중 · {currentWear.hint}
            {currentWear.cur === "reward" && currentWear.reward && <><br />{rewardText(currentWear.reward)}</>}
          </p>
          {currentWear.cur !== "reward" && (() => {
            const cur = currentWear.cur === "root" ? "root" : "jam";
            const wallet = cur === "root" ? data.roots : data.jam;
            return (
              <button type="button" className="garden-shop-buy" disabled={wallet < currentWear.price} onClick={() => buy(currentWear)} aria-label={`${currentWear.label} 사기`}>
                {wallet < currentWear.price ? `${CURRENCY[cur].label} 모자라요` : `사기 · ${priceText(currentWear.price, cur)}`}
              </button>
            );
          })()}
        </div>
      )}

      {tintPart && currentWear?.tint && (
        <Swatches
          label="옷 색"
          names={CLOTH_NAMES}
          colors={CLOTHS.map((t) => t[0])}
          value={look.tint?.[tintPart] ?? currentWear.color ?? 0}
          onPick={(n) => setLook({ tint: { ...look.tint, [tintPart]: n } })}
        />
      )}

      <p className="mt-4 text-[12.5px] leading-relaxed text-smoke">
        서는 자리는 방 ‘✏️ 꾸미기’에서 {AVATAR_NAME}를 끌어 옮겨요. 의자·소파에 두면 앉고, 침대면 자고, 피아노·키보드면 연주해요.
      </p>

      <div className="mt-3 flex flex-wrap gap-4 text-[13px]">
        <label className="flex min-h-[44px] items-center gap-2">
          <input type="checkbox" checked={draft.on} onChange={(e) => setDraft((d) => ({ ...d, on: e.target.checked }))} />
          방에 세우기
        </label>
        <label className="flex min-h-[44px] items-center gap-2">
          <input type="checkbox" checked={draft.roam} disabled={!draft.on} onChange={(e) => setDraft((d) => ({ ...d, roam: e.target.checked }))} />
          돌아다니기
        </label>
      </div>
      {draft.roam && reduceMotion && (
        <p className="text-[12px] text-smoke">이 기기는 ‘동작 줄이기’가 켜져 있어서 {AVATAR_NAME}가 제자리에 있어요. 다른 기기의 손님에게는 돌아다녀요.</p>
      )}

      <div className="mt-3 flex items-center gap-2">
        <p className="min-w-0 flex-1 text-[12px] text-smoke" aria-live="polite">
          {unowned.length ? "입어 보는 옷을 사거나 벗어야 저장해요" : "방을 열어 두면 손님도 이 모습을 봐요."}
        </p>
        <button type="button" className="garden-diary-btn is-quiet" onClick={() => setDraft(saved)} disabled={!dirty}>되돌리기</button>
        <button type="button" className="garden-diary-btn" onClick={save} disabled={unowned.length > 0}>저장</button>
      </div>
    </Sheet>
  );
}

function Swatches({ label, names, colors, value, onPick }: { label: string; names: readonly string[]; colors: string[]; value: number; onPick: (n: number) => void }) {
  return (
    <fieldset className="mt-3">
      <legend className="text-[13px] font-bold">{label}</legend>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {colors.map((c, i) => (
          <button
            key={c}
            type="button"
            aria-pressed={value === i}
            aria-label={`${label} ${names[i]}`}
            className="garden-avatar-swatch"
            style={{ background: c }}
            onClick={() => { gardenFeedback("tap"); onPick(i); }}
          />
        ))}
      </div>
    </fieldset>
  );
}
