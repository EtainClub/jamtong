"use client";

import Link from "next/link";
import { useEffect } from "react";

import { track } from "@/lib/analytics";

import { MutationChips, NoteCard } from "../parts";
import { RaidTrophyArt } from "../RaidWeedArt";
import { RAID_GIMMICKS } from "../raidPlay";
import { MUTATION, MUTATION_ORDER, RAID_KINDS, TIER_LABEL } from "../rules";
import { Sheet } from "../Sheet";
import type { Species } from "../types";
import { itemName } from "./RoomArt";
import type { Placed, RoomData } from "./rules";

/**
 * 방에 놓인 전시품을 누르면 뜨는 시트 — 방이 근거 전시장이 되는 자리(docs/garden-miniroom.md §4.2).
 *
 * ★ 쪽지 액자는 글을 저장하지 않는다. 품종표에서 지금의 쪽지를 읽어 NoteCard로 그린다 —
 *   종류 표시(주장이면 누구의 주장인지, 미검증이면 그 표시)를 떼지 못하고, 반론·한계 쪽지도
 *   같은 틀이다. 쪽지가 콘텐츠에서 빠졌으면 빈 액자라고 말한다.
 */
export function RoomItemSheet({
  room,
  placed,
  byId,
  onClose,
}: {
  room: RoomData;
  placed: Placed;
  byId: ReadonlyMap<string, Species>;
  onClose: () => void;
}) {
  const shown = room.shown.find((s) => s.id === placed.it);
  const species = shown?.species ? byId.get(shown.species) : undefined;
  const note = shown?.kind === "frame" ? species?.notes.find((n) => n.id === shown.note) : undefined;

  // 액자를 연 것을 센다. 액자 → 원본으로 가는지, 걸린 쪽지가 한쪽으로 쏠리는지 본다(§9).
  useEffect(() => {
    if (shown?.kind === "frame") track("frame_open", { kind: note?.kind ?? "missing" });
  }, [shown?.kind, note?.kind]);

  if (!shown) return null;
  const title = itemName(placed.it, room, byId);
  // 악초 박제 — 그 악초의 성질을 적는다. 특정 사람·집단이 아니라 누구에게나 해로운 행동이다.
  const weed = shown.kind === "trophy" ? RAID_KINDS.find((k) => k.id === shown.species) : undefined;
  if (shown.kind === "trophy") {
    return (
      <Sheet label={`${title} 자세히 보기`} title={title} onClose={onClose}>
        {weed ? (
          <div className="mt-3 space-y-2 text-[13px] leading-relaxed">
            <span className="mx-auto block h-28 w-28"><RaidTrophyArt kind={weed.id} /></span>
            <p className="font-semibold">{weed.name} — {weed.trait}</p>
            <p className="text-smoke">싸울 때: {RAID_GIMMICKS[weed.id].rule}.</p>
            <p className="text-smoke">마지막 대사: “{weed.taunts.at(-1)}”</p>
            <p className="text-[12px] text-smoke">광장에서 여럿이 함께 쓰러뜨리고 표본 조각 셋을 모아 만든 박제예요.</p>
          </div>
        ) : (
          <p className="mt-3 text-[13px] text-smoke">알 수 없는 박제예요.</p>
        )}
      </Sheet>
    );
  }

  return (
    <Sheet label={`${title} 자세히 보기`} title={title} onClose={onClose}>
      {!species ? (
        <p className="mt-3 text-[13px] text-smoke">이 품종은 콘텐츠에서 빠졌어요. 빈 자리로 남아 있어요.</p>
      ) : shown.kind === "frame" ? (
        <div className="mt-3 space-y-2">
          <p className="text-[12.5px] text-smoke">「{species.title}」에서 나온 쪽지예요.</p>
          {note ? (
            <NoteCard note={note} pageHref={species.href} />
          ) : (
            <p className="rounded-xl border border-dashed border-stone px-3.5 py-3 text-[13px] text-smoke">
              이 쪽지는 콘텐츠에서 빠졌어요. 빈 액자예요.{" "}
              <Link href={species.href} className="underline underline-offset-2">원본 페이지</Link>에서 지금의 내용을 볼 수 있어요.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <p className="text-[14px] font-semibold leading-snug">{species.title}</p>
          <p className="text-[12.5px] text-smoke">
            {TIER_LABEL[species.tier]} · {shown.kind === "tree" ? "다년생 나무" : "화분"}
          </p>
          {(shown.mut?.length ?? 0) > 0 && (
            <div className="rounded-xl bg-[var(--g-panel)] px-3 py-2.5 text-[12.5px]">
              <MutationChips mutations={shown.mut ?? []} size="xs" />
              <ul className="mt-1.5 space-y-0.5 text-smoke">
                {MUTATION_ORDER.filter((m) => shown.mut?.includes(m)).map((m) => (
                  <li key={m}>
                    {MUTATION[m].label} · {MUTATION[m].hint} · 확률 {MUTATION[m].odds}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Link href={species.href} className="inline-block min-h-[44px] py-2.5 text-[13px] font-semibold text-graphite underline underline-offset-2">
            이 품종의 원본 페이지 보기 →
          </Link>
        </div>
      )}
    </Sheet>
  );
}
