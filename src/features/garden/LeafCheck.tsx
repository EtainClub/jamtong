"use client";

import { useEffect, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import { firebaseConfigured } from "@/lib/firebase/client";
import { checkLeaf } from "@/lib/firebase/leaves";

import { gardenFeedback } from "./feedback";
import { LEAF_JAM, type LeafVerdict } from "./rules";
import { useGarden } from "./store";
import type { Leaf } from "./types";

/**
 * 시든 잎 — 광장 한쪽에 떨어진, 원문 링크가 열리지 않았던 출처 하나.
 * 설계는 docs/garden-game.md §3.8.
 *
 * ★ 상태를 말하지 않는다. "안 열린다고 적혀 있어요"라고 먼저 말하면 확인이 아니라
 *   동의가 된다. 그냥 "열리나요?"만 묻는다.
 * ★ 링크를 열어 본 뒤에야 답할 수 있다. 안 열어 보고 누르는 답은 쓸모가 없다.
 * ★ 어떤 답이든 보상은 같다(rules.ts LEAF_JAM).
 */

export function LeafButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="시든 잎 줍기 — 출처 링크가 열리는지 확인해 주세요"
      className="absolute inset-0 grid place-items-center"
    >
      <span className="garden-bob text-[26px] leading-none drop-shadow">🍂</span>
    </button>
  );
}

export function LeafSheet({
  leaf,
  uid,
  onClose,
  say,
}: {
  leaf: Leaf;
  uid: string | null;
  onClose: () => void;
  say: (text: string) => void;
}) {
  const [opened, setOpened] = useState(false);
  const [busy, setBusy] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  const host = hostOf(leaf.url);

  const answer = async (verdict: LeafVerdict) => {
    if (busy) return;
    setBusy(true);
    const garden = useGarden.getState();
    let write: "ok" | "already" | "error" = "ok";
    if (verdict !== "unsure" && firebaseConfigured) {
      write = uid ? await checkLeaf(uid, leaf.id, verdict) : "error";
    }
    setBusy(false);
    if (write === "error") {
      say("확인을 남기지 못했어요. 잠시 뒤 다시 해 보세요");
      return;
    }
    track("leaf_check", { verdict });
    if (write === "already") {
      garden.leaf(leaf.id, false);
      say("이미 확인한 잎이에요");
    } else {
      const jam = garden.leaf(leaf.id, true);
      gardenFeedback("reward");
      say(`🍂 고마워요! 🍯 +${jam}`);
    }
    onClose();
  };

  return (
    <dialog
      ref={dialog}
      aria-label="시든 잎 확인"
      className="garden-seed-dialog fixed inset-0 z-50 m-0 h-dvh max-h-none w-full max-w-none items-end border-0 bg-transparent p-0 text-inherit open:flex"
      onClick={onClose}
      onCancel={onClose}
    >
      <div
        className="mx-auto w-full max-w-[560px] rounded-t-3xl bg-[var(--g-bg)] p-4 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold">🍂 시든 잎</h3>
          <button type="button" onClick={onClose} className="text-[13px] text-smoke">
            닫기
          </button>
        </div>

        <p className="mt-2 text-[13px] leading-relaxed text-graphite">
          「{leaf.speciesTitle}」에 달린 출처예요. 이 링크가 지금 열리나요?
        </p>

        <a
          href={leaf.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpened(true)}
          className="mt-3 block rounded-2xl border border-stone bg-eggshell px-3.5 py-3 text-ink hover:border-graphite"
        >
          <span className="block text-[13px] font-semibold leading-snug">{leaf.title}</span>
          <span className="mt-1 block truncate text-[12px] text-smoke">{host} · 링크 열어 보기 ↗</span>
        </a>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {(
            [
              ["opens", "잘 열려요"],
              ["fails", "안 열려요"],
              ["unsure", "모르겠어요"],
            ] as const
          ).map(([verdict, label]) => (
            <button
              key={verdict}
              type="button"
              disabled={!opened || busy}
              onClick={() => void answer(verdict)}
              className="rounded-full bg-[var(--g-panel)] py-2.5 text-[13px] font-semibold text-ink disabled:opacity-35"
            >
              {label}
            </button>
          ))}
        </div>

        <p className="mt-3 text-[11.5px] leading-relaxed text-smoke">
          {opened
            ? "‘안 열려요’는 페이지가 없거나, 오류가 나거나, 엉뚱한 페이지로 갈 때예요."
            : "먼저 링크를 열어 보세요. 답은 그다음에 고를 수 있어요."}{" "}
          어떤 답이든 잼 {LEAF_JAM}을 드려요. 결과는 운영자에게 가서 출처를 고치는 데 쓰여요.
        </p>
      </div>
    </dialog>
  );
}

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
