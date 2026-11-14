"use client";

import { useState } from "react";

import { track } from "@/lib/analytics";
import type { RaidAidMark } from "@/lib/firebase/raid";

import { googleCalendarLink } from "../alarm";
import { gardenFeedback } from "../feedback";
import {
  FINISHER_ORDER,
  FINISHERS,
  formatClock,
  formatLeft,
  josa,
  kstDay,
  QUIET_FROM,
  QUIET_UNTIL,
  RAID_AID_ORDER,
  RAID_AIDS,
  RAID_GAP_MULT,
  type FinisherId,
  type RaidAidId,
} from "../rules";
import { Sheet } from "../Sheet";
import { useGarden } from "../store";
import { priceText } from "../shop/parts";
import { aidCooldown, KIT, KIT_ORDER, kitOn, type KitId } from "./rules";

/**
 * 싸움터의 조각 — 빈틈 띠, 지원 단추, 지원 소식, 도구 줄, 싸움터 안 상점(docs/garden-miniroom.md §7).
 * 싸움터는 광장 탭이라 정원의 색을 쓴다(속지 색이 아니다). 누름 자리는 44px 위로.
 */

/** 빈틈 띠 — 다음 빈틈까지, 빈틈이면 ×2와 남은 시간. 지금 칠지 기다릴지가 보이게. */
export function GapBand({
  gap,
  frenzy,
  now,
}: {
  gap: { start: number; end: number; now: boolean } | null;
  frenzy: boolean;
  now: number;
}) {
  if (!gap) {
    return <p className="raid-gap mt-2 rounded-xl px-3 py-1.5 text-center text-[12px] font-semibold">이 거대 잡초에는 빈틈이 없어요(예전 규칙으로 태어났어요)</p>;
  }
  const secs = (ms: number) => {
    const s = Math.max(0, Math.ceil(ms / 1000));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };
  return gap.now ? (
    <p className="raid-gap is-open mt-2 rounded-xl px-3 py-2 text-center text-[13.5px] font-black" role="status" aria-live="polite">
      ⚡ 빈틈! 한 번이 ×{RAID_GAP_MULT} · {secs(gap.end - now)} 남음{frenzy ? " · 🔥 폭주" : ""}
    </p>
  ) : (
    <p className="raid-gap mt-2 rounded-xl px-3 py-1.5 text-center text-[12px] font-semibold">
      ⏳ 다음 빈틈 {formatClock(gap.start, now)} · {gap.start - now < 60 * 60_000 ? secs(gap.start - now) : formatLeft(gap.start - now)} 뒤 — 지금 치면 ×1, 빈틈에 치면 ×{RAID_GAP_MULT}
      {frenzy ? " · 🔥 폭주: 빈틈이 6분" : ""}
    </p>
  );
}

/** 지원 단추 셋. 기력과 따로 — 기력을 다 써도 할 수 있다. */
export function AidButtons({
  raidId,
  aidAt,
  now,
  disabled,
  onAid,
}: {
  raidId: string;
  /** 내가 마지막으로 지원한 때. */
  aidAt: number | null;
  now: number;
  disabled: boolean;
  onAid: (kind: RaidAidId) => void;
}) {
  const kit = useGarden((s) => s.data?.kit);
  return (
    <div className="mt-2" role="group" aria-label="지원">
      <p className="text-[11.5px] font-bold opacity-90">📣 지원 — 기력과 따로, 모두에게 걸려요</p>
      <div className="mt-1 grid grid-cols-3 gap-1.5">
        {RAID_AID_ORDER.map((kind) => {
          const a = RAID_AIDS[kind];
          const wait = kit && aidAt !== null ? aidAt + aidCooldown(kit, kind, raidId) - now : 0;
          const ready = wait <= 0;
          return (
            <button
              key={kind}
              type="button"
              disabled={disabled || !ready}
              onClick={() => onAid(kind)}
              className="raid-aid min-h-[52px] rounded-xl px-1 py-1.5 text-center disabled:opacity-45"
              aria-label={`${a.label} — ${a.effect}${ready ? "" : `, ${Math.ceil(wait / 1000)}초 뒤`}`}
            >
              <span className="block text-[19px] leading-none">{a.icon}</span>
              <span className="mt-0.5 block text-[10.5px] font-bold leading-tight">{a.label}</span>
              <span className="block text-[10px] tabular-nums opacity-85">{ready ? "지금 걸기" : `${Math.ceil(wait / 1000)}초`}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** 누가 무엇을 걸었는지 — "파란 참새가 북을 쳤어요". 최근 것만. */
export function AidFeed({ aids, now }: { aids: readonly RaidAidMark[]; now: number }) {
  const fresh = aids.filter((m) => now - m.at < 12_000 && now >= m.at - 2_000).sort((a, b) => b.at - a.at).slice(0, 2);
  if (fresh.length === 0) return null;
  return (
    <ul className="mt-2 space-y-1" aria-live="polite">
      {fresh.map((m) => (
        <li key={`${m.shard}-${m.at}`} className="raid-aid-line rounded-full px-3 py-1 text-center text-[12px] font-bold">
          {RAID_AIDS[m.aid].icon} {josa(m.by, "이가")} {RAID_AIDS[m.aid].did}
        </li>
      ))}
    </ul>
  );
}

/** 지금 켜진 지원 효과 칩. */
export function AidChips({ chips }: { chips: string[] }) {
  if (chips.length === 0) return null;
  return (
    <p className="mt-1.5 flex flex-wrap justify-center gap-1">
      {chips.map((c) => (
        <span key={c} className="rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-bold">
          {c}
        </span>
      ))}
    </p>
  );
}

/** 도구 줄 — 가진 도구를 이 물결에 켠다. 싸움터 안에서 바로 살 수 있다. */
export function KitRow({ raidId, gapAt, now, say }: { raidId: string; gapAt: number | null; now: number; say: (text: string) => void }) {
  const kit = useGarden((s) => s.data?.kit);
  const [shop, setShop] = useState(false);
  if (!kit) return null;
  const arm = (id: KitId) => {
    if (!useGarden.getState().armKit(id, raidId)) return;
    gardenFeedback("tap");
    say(`${KIT[id].icon} ${josa(KIT[id].label, "을를")} 썼어요 · 이번 거대 잡초 동안`);
  };
  const usable = KIT_ORDER.filter((id) => KIT[id].wave && ((kit.have[id] ?? 0) > 0 || kitOn(kit, id, raidId)));
  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {usable.map((id) => {
          const on = kitOn(kit, id, raidId);
          return (
            <button
              key={id}
              type="button"
              disabled={on}
              onClick={() => arm(id)}
              aria-pressed={on}
              className={`raid-kit min-h-[44px] rounded-full px-3 text-[12px] font-bold ${on ? "is-on" : ""}`}
            >
              {KIT[id].icon} {KIT[id].label} {on ? "켜짐" : `${kit.have[id] ?? 0}개`}
            </button>
          );
        })}
        {(kit.have.glove ?? 0) > 0 && (
          <span className="rounded-full bg-black/25 px-3 py-1.5 text-[12px] font-bold">🧤 장갑 {kit.have.glove}개 · 맞으면 저절로</span>
        )}
        <button type="button" onClick={() => { gardenFeedback("tap"); setShop(true); }} className="raid-kit min-h-[44px] rounded-full px-3 text-[12px] font-bold">
          🛒 도구 사기
        </button>
      </div>
      {gapAt !== null && <GapAlarm at={gapAt} now={now} />}
      {shop && <KitShopSheet now={now} say={say} onClose={() => setShop(false)} />}
    </div>
  );
}

/**
 * 빈틈 캘린더 알림 — 익음 알림과 같은 길(/api/garden-alarm). 밤 22시~8시의 빈틈은 넣지 않는다.
 * 넣기는 누구나(§8의 6). 탭 안에서 1분 전에 울리는 것은 자명종이 한다.
 */
function GapAlarm({ at, now }: { at: number; now: number }) {
  const hour = new Date(at + 9 * 3_600_000).getUTCHours();
  if (hour >= QUIET_FROM || hour < QUIET_UNTIL || at - now < 3 * 60_000) return null;
  const go = (via: "ics" | "google") => track("ripe_alarm", { via, hours: Math.round((at - now) / 3_600_000), quiet: false, kind: "gap" });
  return (
    <p className="mt-1.5 text-[11.5px] opacity-90">
      ⏰ 다음 빈틈 {formatClock(at, now)}을 캘린더에:{" "}
      <a href={`/api/garden-alarm?at=${at}&k=gap`} onClick={() => go("ics")} className="inline-block min-h-[32px] py-1 font-bold underline underline-offset-2">휴대폰</a>
      {" · "}
      <a href={googleCalendarLink(at, `${window.location.origin}/garden?tab=plaza`, "gap")} target="_blank" rel="noopener noreferrer" onClick={() => go("google")} className="inline-block min-h-[32px] py-1 font-bold underline underline-offset-2">
        구글
      </a>
    </p>
  );
}

/** 싸움터 안 상점 — 상점 › 도구 › 싸움과 같은 것을 같은 값에. 무작위 없음. */
export function KitShopSheet({ now, say, onClose }: { now: number; say: (text: string) => void; onClose: () => void }) {
  const data = useGarden((s) => s.data);
  if (!data) return null;
  const today = kstDay(now);
  const rows: Array<{ key: string; icon: string; label: string; hint: string; price: number; left: number; have: number; buy: () => boolean }> = [
    ...FINISHER_ORDER.map((id: FinisherId) => {
      const f = FINISHERS[id];
      const used = data.finishers.day === today ? (data.finishers.bought[id] ?? 0) : 0;
      return { key: id, icon: f.icon, label: f.label, hint: `기력 ${f.hits}번을 한 번에(빈틈이면 ×${RAID_GAP_MULT})`, price: f.price, left: f.perDay - used, have: data.finishers.have[id] ?? 0, buy: () => useGarden.getState().buyFinisher(id) };
    }),
    ...KIT_ORDER.map((id) => {
      const k = KIT[id];
      const used = data.kit.day === today ? (data.kit.bought[id] ?? 0) : 0;
      return { key: id, icon: k.icon, label: k.label, hint: k.hint, price: k.price, left: k.perDay - used, have: data.kit.have[id] ?? 0, buy: () => useGarden.getState().buyKit(id) };
    }),
  ];
  return (
    <Sheet label="싸움 도구 사기" title="싸움 도구" onClose={onClose}>
      <p className="mt-1 text-[12px] text-smoke">늘 같은 값, 하루 상한, 무작위 없음. 기력을 더 주는 도구는 없어요 — 혼자서는 못 잡아요.</p>
      <p className="mt-1 text-[12.5px] font-semibold">가진 잼 {priceText(data.jam)}</p>
      <ul className="mt-2 space-y-1.5">
        {rows.map((r) => (
          <li key={r.key} className="flex items-center gap-2 rounded-xl bg-[var(--g-panel)] px-3 py-2">
            <span className="text-[24px] leading-none" aria-hidden="true">{r.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold">{r.label} <span className="font-normal text-smoke">· 가진 것 {r.have}</span></p>
              <p className="text-[11.5px] leading-snug text-smoke">{r.hint}</p>
            </div>
            <button
              type="button"
              disabled={r.left <= 0 || data.jam < r.price}
              onClick={() => {
                if (!r.buy()) return;
                gardenFeedback("reward");
                track("shop_buy", { cat: "tools", from: "raid" });
                say(`${r.icon} ${josa(r.label, "을를")} 샀어요`);
              }}
              className="garden-shop-buy min-h-[44px] shrink-0"
              aria-label={`${r.label} ${r.left <= 0 ? "오늘 끝" : priceText(r.price)}`}
            >
              {r.left <= 0 ? "오늘 끝" : priceText(r.price)}
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}

/** 함께한 사람들 — 친 사람과 지원한 사람을 같은 줄에. 순위도, 가장 많이 친 사람도 없다. */
export function RollCall({ names, fighters }: { names: readonly string[]; fighters: number }) {
  if (fighters <= 0) return null;
  const shown = names.slice(0, 40);
  const unnamed = Math.max(0, fighters - names.length);
  return (
    <div className="mt-2 rounded-xl bg-black/10 px-3 py-2">
      <p className="text-[12px] font-bold">🤝 함께한 사람들 {fighters}명</p>
      <p className="mt-0.5 text-[12px] leading-relaxed">
        {shown.join(" · ")}
        {names.length > shown.length ? ` 외 ${names.length - shown.length}명` : ""}
        {unnamed > 0 ? `${shown.length ? " · " : ""}이름 모를 정원지기 ${unnamed}명` : ""}
      </p>
    </div>
  );
}
