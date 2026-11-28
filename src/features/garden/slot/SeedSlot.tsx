"use client";

import { track } from "@/lib/analytics";
import { useAuth } from "@/lib/firebase/auth";
import { givePot } from "@/lib/firebase/slot";

import { Sheet } from "../Sheet";
import { useGarden } from "../store";
import type { Species } from "../types";
import { RARE_BY_ID, RARE_SEEDS, rareImage } from "./rare";
import {
  normalizeSlots,
  potShare,
  SEED_PITY,
  SEED_SPIN_COST,
  SEED_SYMBOL_LABEL,
  SEED_SYMBOLS,
  SEED_TABLE,
  SLOT_SPINS_PER_DAY,
  spinsLeft,
  type SeedSymbol,
} from "./rules";
import { pct, SlotMachine, type SlotSymbol } from "./SlotMachine";
import { QuizChance } from "./QuizChance";
import { kstDay } from "../rules";

/**
 * 텃밭 씨앗 슬롯 — 잼을 내고 돌리면 씨앗이 나오고, 희귀 그림 셋이면 희귀 씨앗(docs/garden-slots.md).
 * 희귀 씨앗은 "특별판" — 업적·정책 품종이 자라고 변이가 확정된다(slot/rare.ts).
 */
export function SeedSlot({
  catalog,
  now,
  onClose,
  say,
}: {
  catalog: Species[];
  now: number;
  onClose: () => void;
  say: (text: string) => void;
}) {
  const jam = useGarden((s) => s.data?.jam ?? 0);
  const slots = useGarden((s) => s.data?.slots);
  const uid = useAuth().user?.uid ?? null;
  const ledger = normalizeSlots(slots);
  const today = kstDay(now);
  const left = spinsLeft(ledger, "seed", today);
  const toPity = Math.max(1, SEED_PITY - ledger.seedPity);
  const free = ledger.freeSeed;

  const symbols: SlotSymbol[] = SEED_SYMBOLS.map((k) => ({ key: k, label: labelOf(k), node: symbolNode(k) }));
  const index = (k: SeedSymbol) => SEED_SYMBOLS.indexOf(k);

  return (
    <Sheet label="씨앗 슬롯머신" title="🎰 씨앗 슬롯머신" onClose={onClose}>
      <p className="mt-1 text-center text-[12px] text-smoke">
        가운데 줄에 같은 그림 셋 · 💎 희귀 씨앗 셋이면 특별판 씨앗
      </p>
      <SlotMachine
        symbols={symbols}
        cost={SEED_SPIN_COST}
        jam={jam}
        left={left}
        free={free}
        footer={`희귀 씨앗까지 길어도 ${toPity}번 (천장 ${SEED_PITY}번)`}
        after={(win) => (!win ? <QuizChance machine="seed" now={now} say={say} /> : null)}
        onSpin={() => {
          const mode = ledger.freeSeed > 0 ? ("free" as const) : ("paid" as const);
          const got = useGarden.getState().spinSeedSlot(catalog, Math.random, mode);
          if (got === "jam") return `잼이 ${SEED_SPIN_COST} 있어야 해요`;
          if (got === "done") return `오늘은 ${SLOT_SPINS_PER_DAY}번 다 돌렸어요. 내일 다시 만나요`;
          if (got === "no-free") return "무료 한 번이 없어요";
          // 잼 항아리 — 낸 잼의 5%를 광장에(무료 한 번은 낸 잼이 없다).
          if (uid && got.paid) void givePot(uid, potShare(got.paid)).catch((e) => console.error("[slot] 잼 항아리에 넣지 못했다", e));
          const o = got.spin.outcome;
          track("slot_spin", { machine: "seed", outcome: o.kind, mode, ...(o.kind === "rare" ? { rare: o.rare, pity: got.spin.pity } : {}) });
          const reels = got.spin.reels.map(index) as [number, number, number];
          if (o.kind === "miss") return { reels, win: false, message: <p>꽝이에요. 씨앗은 상점에서도 살 수 있어요.</p> };
          const rare = got.got.find((g) => g.rare);
          if (rare) {
            const r = RARE_BY_ID.get(rare.rare!)!;
            say(`🎉 ${r.label}! 「${rare.species.title}」 특별판 씨앗이 주머니에 들어갔어요`);
            return {
              reels,
              win: true,
              message: (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={rareImage(r.id)} alt="" width={64} height={64} className="rounded-xl" />
                  <div>
                    <p className="text-[15px] font-black">🎉 {r.label}{got.spin.pity ? " (천장)" : ""}</p>
                    <p className="text-[13px]">「{rare.species.title}」 특별판 씨앗 — {r.hint}</p>
                    <NoteLine species={rare.species} />
                    <p className="mt-0.5 text-[12px] text-smoke">텃밭 빈칸을 눌러 씨앗 주머니 맨 위에서 심어요.</p>
                  </div>
                </div>
              ),
            };
          }
          const names = got.got.map((g) => g.species.title);
          const big = got.got.find((g) => g.species.tier === "flagship" || g.species.tier === "perennial");
          return {
            reels,
            win: true,
            message: (
              <>
                <p>
                  {o.kind === "pair" ? "같은 그림 둘! " : "당첨! "}씨앗 {names.length}개: {names.map((n) => `「${n}」`).join(", ")}
                </p>
                {big && <NoteLine species={big.species} />}
              </>
            ),
          };
        }}
        odds={
          <ul className="space-y-0.5">
            {SEED_TABLE.map((r) => (
              <li key={r.label} className="flex justify-between gap-2">
                <span>{r.label}</span>
                <b className="tabular-nums">{pct(r.p)}</b>
              </li>
            ))}
            <li className="flex justify-between gap-2">
              <span>꽝</span>
              <b className="tabular-nums">{pct(1 - SEED_TABLE.reduce((s, r) => s + r.p, 0))}</b>
            </li>
            <li className="pt-1 text-smoke">
              희귀 씨앗 없이 {SEED_PITY}번째가 되면 그 번은 반드시 희귀 씨앗(희귀 씨앗끼리의 비율은 위와 같아요). 하루 {SLOT_SPINS_PER_DAY}번까지.
              한 번에 🍯{SEED_SPIN_COST}. 상점에서 씨앗을 사는 쪽이 평균적으로 더 많이 남아요 — 슬롯은 놀이로 즐겨 주세요.
            </li>
            <li className="pt-1">
              <b>희귀 씨앗</b>
              <ul className="mt-0.5 space-y-0.5">
                {RARE_SEEDS.map((r) => (
                  <li key={r.id} className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={rareImage(r.id)} alt="" width={24} height={24} />
                    <span>
                      {r.label} — {r.hint}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        }
      />
    </Sheet>
  );
}

function labelOf(k: SeedSymbol): string {
  return k === "sprout" || k === "common" || k === "flagship" ? SEED_SYMBOL_LABEL[k].label : (RARE_BY_ID.get(k)?.label ?? k);
}

function symbolNode(k: SeedSymbol) {
  if (k === "sprout" || k === "common" || k === "flagship") return <span>{SEED_SYMBOL_LABEL[k].icon}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={rareImage(k)} alt="" width={64} height={64} draggable={false} />;
}

/**
 * 당첨 카드의 근거 한 줄 — 그 품종(업적·정책)의 쪽지 하나와 "근거 보기"(docs/garden-slots.md).
 * 쪽지는 열매 속 쪽지와 같은 것(콘텐츠의 claim 한 줄)이다. 출처가 있으면 출처로, 없으면 원본 페이지로.
 * 확인된 사실(FACT)을 먼저 고른다. 주장이면 누구의 주장인지 붙인다.
 */
function NoteLine({ species }: { species: Species }) {
  const note = species.notes.find((n) => n.kind === "FACT" && n.verified !== false) ?? species.notes[0];
  if (!note) return null;
  const href = note.sourceUrl ?? note.href ?? species.href;
  const external = Boolean(note.sourceUrl);
  return (
    <p className="mt-1.5 rounded-lg bg-white/70 px-2 py-1.5 text-[12px] leading-relaxed">
      📜 {note.text.length > 90 ? `${note.text.slice(0, 89)}…` : note.text}
      {note.kind === "CLAIM" && note.by ? <span className="opacity-70"> ({note.by}의 주장)</span> : null}{" "}
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={() => track("slot_note", { species: species.id })}
        className="font-semibold underline underline-offset-2"
      >
        근거 보기 →
      </a>
    </p>
  );
}
