"use client";

import Link from "next/link";

import { MUTATION, MUTATION_ORDER } from "./rules";
import type { Mutation, Note, NoteKind } from "./types";

/**
 * 정원 화면의 작은 조각들.
 *
 * ★ 정원은 색을 쓴다.
 *   사이트 규칙은 "UI는 무채색, 색은 자료에만"이다. 정원은 정보 페이지가 아니라
 *   게임 레이어이고, 흙과 잎이 회색이면 놀이가 되지 않는다. 그래서 정원 색은
 *   GardenApp의 바깥 상자 안에서만(--g-*) 정의하고 밖으로 새지 않게 한다.
 *   정원 안에서 쪽지만은 사이트 색을 따른다 — 쪽지는 자료이기 때문이다.
 */

const KIND_LABEL: Record<NoteKind, string> = {
  FACT: "사실",
  CLAIM: "주장",
  INTERPRETATION: "해석",
  OPINION: "의견",
  COUNTER: "반론",
  CRITIQUE: "비판·한계",
  WORD: "언행 요약",
};

export function MutationChips({ mutations, size = "sm" }: { mutations: Mutation[]; size?: "sm" | "xs" }) {
  if (mutations.length === 0) return null;
  const sorted = MUTATION_ORDER.filter((m) => mutations.includes(m));
  return (
    <span className="inline-flex flex-wrap gap-1">
      {sorted.map((m) => (
        <span
          key={m}
          className={`garden-chip garden-chip-${m} rounded-full font-semibold ${
            size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-1.5 text-[10px]"
          }`}
        >
          {MUTATION[m].label}
        </span>
      ))}
    </span>
  );
}

/** 열매 속 쪽지. 콘텐츠의 한 줄이므로 사이트의 자료 표기를 따른다. */
export function NoteCard({
  note,
  pageHref,
  onSource,
  shineLeft,
  shined,
}: {
  note: Note;
  pageHref: string;
  /** 근거를 열었을 때. 없으면 근거 버튼을 그냥 링크로 둔다. */
  onSource?: () => void;
  shineLeft?: number;
  shined?: boolean;
}) {
  const counter = note.kind === "COUNTER" || note.kind === "CRITIQUE";
  const source = note.sourceUrl ?? note.href;
  return (
    <div className="rounded-xl border border-stone bg-eggshell px-3.5 py-3 text-ink">
      <p className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
        <span className={counter ? "text-burgundy" : "text-navy"}>
          {KIND_LABEL[note.kind]}
          {note.by ? ` · ${note.by}` : ""}
        </span>
        {note.verified === false && note.kind !== "COUNTER" && note.kind !== "WORD" && (
          <span className="rounded bg-pending-tint px-1 text-[10px] text-pending">미검증</span>
        )}
      </p>
      <p className="mt-1 text-[13.5px] leading-relaxed">{note.text}</p>
      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[12px]">
        {source && (
          <a
            href={source}
            target={note.sourceUrl ? "_blank" : undefined}
            rel={note.sourceUrl ? "noopener noreferrer" : undefined}
            onClick={onSource}
            className="rounded-full border border-stone bg-canvas px-3 py-1 font-medium text-graphite hover:border-graphite"
            title={note.sourceTitle}
          >
            근거 보기
            {onSource && !shined && (shineLeft ?? 0) > 0 && (
              <span className="ml-1 text-[11px] text-pending">✨ 원본 광택 ×1.5</span>
            )}
          </a>
        )}
        <Link href={pageHref} className="text-smoke underline-offset-2 hover:text-ink hover:underline">
          원본 페이지
        </Link>
      </div>
    </div>
  );
}

export function Toast({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <div
      role="status"
      className="garden-pop pointer-events-none fixed inset-x-0 bottom-24 z-50 mx-auto w-fit max-w-[90vw] rounded-full bg-ink px-4 py-2 text-center text-[13px] font-medium text-eggshell shadow-lg"
    >
      {text}
    </div>
  );
}
