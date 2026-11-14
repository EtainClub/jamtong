"use client";

import type { ReactNode } from "react";

import { Sheet } from "../Sheet";

/**
 * 상점의 조각 — 카드, 사기 시트, 확장 띠. 설계는 docs/garden-miniroom.md §6.
 *
 * ★ 값에는 재화가 붙는다. 지금은 잼뿐이지만 🏆 전리품은 뿌리 조각(§7.4)으로 산다 —
 *   카테고리마다 재화를 정하고(SHOP_CATS), 카드·시트는 그 재화로 값을 그린다.
 * ★ 모자라면 단추를 흐리게만 두지 않고 "잼 80 더 필요해요"라고 적는다.
 */

export type Currency = "jam" | "root";

export const CURRENCY: Record<Currency, { icon: string; label: string }> = {
  jam: { icon: "🍯", label: "잼" },
  root: { icon: "🌰", label: "뿌리 조각" },
};

export type ShopCat = "seeds" | "tools" | "furniture" | "walls" | "trophy";

export const SHOP_CATS: Array<{ id: ShopCat; icon: string; label: string; currency: Currency }> = [
  { id: "seeds", icon: "🌱", label: "씨앗", currency: "jam" },
  { id: "tools", icon: "🧪", label: "도구", currency: "jam" },
  { id: "furniture", icon: "🛋", label: "가구", currency: "jam" },
  { id: "walls", icon: "🎨", label: "벽·바닥", currency: "jam" },
  { id: "trophy", icon: "🏆", label: "전리품", currency: "root" },
];

export function priceText(amount: number, currency: Currency = "jam"): string {
  return `${CURRENCY[currency].icon} ${amount.toLocaleString()}`;
}

/** 못 사는 까닭을 사람 말로. short는 모자란 양. */
export function shortText(short: number, currency: Currency = "jam"): string {
  return `${CURRENCY[currency].label} ${short.toLocaleString()} 더 필요해요`;
}

/**
 * 2열 카드. 카드를 누르면 자세히(시트), 값 단추를 누르면 바로 산다 — 씨앗은 예전처럼 한 번에 사게.
 * 단추 안에 단추를 둘 수 없어서 둘을 나란히 둔다.
 */
export function ShopCard({
  art,
  title,
  sub,
  badge,
  rare,
  buyLabel,
  buyDisabled,
  onOpen,
  onBuy,
}: {
  art: ReactNode;
  title: string;
  sub: string;
  badge?: string;
  rare?: boolean;
  buyLabel: string;
  buyDisabled?: boolean;
  onOpen: () => void;
  onBuy?: () => void;
}) {
  return (
    <li className={`garden-shop-card ${rare ? "is-rare" : ""}`}>
      <button type="button" onClick={onOpen} className="garden-shop-card-main" aria-label={`${title} 자세히 보기`}>
        <span className="garden-shop-card-art">{art}</span>
        <span className="garden-shop-card-title">
          {badge && <span className="garden-chip garden-chip-new mr-1 rounded-full px-1.5 py-0.5 align-[1px] text-[10px]">{badge}</span>}
          {title}
        </span>
        <span className="garden-shop-card-sub">{sub}</span>
      </button>
      <button
        type="button"
        disabled={buyDisabled}
        onClick={onBuy ?? onOpen}
        aria-label={`${title} ${buyLabel}`}
        className="garden-shop-buy"
      >
        {buyLabel}
      </button>
    </li>
  );
}

/** 사기 시트. 큰 그림, 설명, 가진 수·남은 수, (가구는) 방에 놓아 보기, 사기. */
export function BuySheet({
  title,
  art,
  facts,
  children,
  price,
  currency = "jam",
  wallet,
  blocked,
  buyLabel = "사기",
  onBuy,
  onClose,
}: {
  title: string;
  art: ReactNode;
  facts: Array<[string, string]>;
  children?: ReactNode;
  price: number;
  currency?: Currency;
  /** 가진 재화. */
  wallet: number;
  /** 값 말고 못 사는 까닭(품절·오늘 끝·이미 가짐). 있으면 그것을 적는다. */
  blocked?: string;
  buyLabel?: string;
  onBuy: () => void;
  onClose: () => void;
}) {
  const short = Math.max(0, price - wallet);
  return (
    <Sheet label={`${title} 사기`} title={title} onClose={onClose}>
      <div className="garden-buy-art mt-3">{art}</div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-center">
        {facts.map(([k, v]) => (
          <div key={k} className="flex flex-col-reverse rounded-xl bg-[var(--g-panel)] py-2">
            <dt className="text-[11.5px] text-smoke">{k}</dt>
            <dd className="text-[14px] font-bold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      {children && <div className="mt-3 text-[13px] leading-relaxed">{children}</div>}
      <div className="mt-4 flex items-center gap-3">
        <p className="min-w-0 flex-1 text-[12.5px] font-semibold text-smoke" aria-live="polite">
          {blocked ?? (short > 0 ? shortText(short, currency) : `가진 ${CURRENCY[currency].label} ${wallet.toLocaleString()}`)}
        </p>
        <button type="button" disabled={Boolean(blocked) || short > 0} onClick={onBuy} className="garden-shop-buy is-big">
          {buyLabel} · {priceText(price, currency)}
        </button>
      </div>
    </Sheet>
  );
}

/** 확장 띠(텃밭 넓히기·방 넓히기). 카테고리 맨 위에 둔다 — 상점 맨 아래에서는 잘 안 보였다. */
export function ExpandBanner({
  icon,
  title,
  sub,
  price,
  wallet,
  onBuy,
}: {
  icon: string;
  title: string;
  sub: string;
  price: number;
  wallet: number;
  onBuy: () => void;
}) {
  const short = Math.max(0, price - wallet);
  return (
    <div className="garden-expand">
      <span aria-hidden="true" className="text-[26px] leading-none">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-bold">{title}</p>
        <p className="text-[12px] text-smoke">{short > 0 ? `${sub} · ${shortText(short)}` : sub}</p>
      </div>
      <button type="button" disabled={short > 0} onClick={onBuy} className="garden-shop-buy">
        {priceText(price)}
      </button>
    </div>
  );
}
