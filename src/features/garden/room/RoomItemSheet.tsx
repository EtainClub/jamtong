"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { track } from "@/lib/analytics";

import { MutationChips, NoteCard } from "../parts";
import { RaidTrophyArt } from "../RaidWeedArt";
import { RAID_GIMMICKS } from "../raidPlay";
import { MUTATION, MUTATION_ORDER, RAID_KINDS, TIER_LABEL } from "../rules";
import { Sheet } from "../Sheet";
import type { Species } from "../types";
import { itemName, FurnitureIcon } from "./RoomArt";
import { FURNITURE_BY_ID } from "./catalog";
import { FurnitureStory } from "./FurnitureStory";
import { activityOf } from "./activities";
import { RoomVoicePlayer } from "./RoomVoicePlayer";
import { playActivitySound } from "./activitySound";
import { BookSheet } from "./BookSheet";
import { roomBookOf } from "./library";
import { PianoPlayer } from "./PianoPlayer";
import { pianoNotes, pianoSong, type PianoEvent } from "./piano";
import { PhotoCard } from "../memorial/PhotoCard";
import { entryOf, useMemorial } from "../memorial/useMemorial";
import { SOUVENIR_CASE, souvenirIds, type Placed, type RoomData } from "./rules";

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
  onPianoNotes,
  onPianoSave,
  reader,
}: {
  room: RoomData;
  placed: Placed;
  byId: ReadonlyMap<string, Species>;
  onClose: () => void;
  onPianoNotes?: (notes: number[]) => void;
  onPianoSave?: (song: PianoEvent[]) => boolean;
  /** 특별한 책의 독서대(BookSheet)에 넘길 것. 없으면 예전처럼 요약 링크만. */
  reader?: { mode: "owner" | "guest"; ownerNick: string; gid: string | null; uid: string | null };
}) {
  const shown = room.shown.find((s) => s.id === placed.it);
  const species = shown?.species ? byId.get(shown.species) : undefined;
  const note = shown?.kind === "frame" ? species?.notes.find((n) => n.id === shown.note) : undefined;

  // 액자를 연 것을 센다. 액자 → 원본으로 가는지, 걸린 쪽지가 한쪽으로 쏠리는지 본다(§9).
  useEffect(() => {
    if (shown?.kind === "frame") track("frame_open", { kind: note?.kind ?? "missing" });
  }, [shown?.kind, note?.kind]);

  const furniture = FURNITURE_BY_ID.get(placed.it);
  const activity = activityOf(placed.it);
  const book = roomBookOf(placed.it);
  if (book && reader) {
    return <BookSheet book={book} room={room} mode={reader.mode} ownerNick={reader.ownerNick} gid={reader.gid} uid={reader.uid} catalog={[...byId.values()]} onClose={onClose} />;
  }
  if (placed.it === SOUVENIR_CASE) {
    return <CaseSheet ids={souvenirIds(room)} guest={reader?.mode === "guest"} ownerNick={reader?.ownerNick} onClose={onClose} />;
  }
  if (placed.it === "piano") return <Sheet label="피아노 연주" title="피아노" onClose={onClose}><PianoPlayer key={placed.kb ?? 0} notes={pianoNotes(room.pianos?.[placed.kb ?? 0])} song={pianoSong(room.pianoSongs?.[placed.kb ?? 0])} onChange={onPianoNotes} onSave={onPianoSave} /></Sheet>;
  if (furniture && (furniture.story || activity || furniture.reading)) {
    return (
      <Sheet label={`${furniture.label} 자세히 보기`} title={furniture.label} onClose={onClose}>
        <div className="mt-3 flex justify-center"><FurnitureIcon id={furniture.id} size={96} /></div>
        <p className="mt-2 text-[13px] text-smoke">{furniture.hint}</p>
        {activity?.clips ? <RoomVoicePlayer clips={activity.clips} /> : activity?.sound ? <button type="button" className="garden-diary-btn mt-3" onClick={() => { if (activity.sound) playActivitySound(activity.sound); }}>♪ 소리 다시 듣기</button> : null}
        {furniture.reading && <Link href={furniture.reading.href} className="garden-diary-btn mt-3 inline-flex min-h-[44px] items-center">{furniture.reading.label} →</Link>}
        {furniture.story && <FurnitureStory story={furniture.story} />}
      </Sheet>
    );
  }
  if (!shown) return null;
  const title = itemName(placed.it, room, byId);
  if (shown.kind === "souvenir") {
    return <SouvenirSheet title={title} speciesId={shown.species} guest={reader?.mode === "guest"} onClose={onClose} />;
  }
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

/**
 * 방에 놓인 업적 기념품 — 누르면 그 업적의 사진 카드가 뜬다. 손님도 같은 카드를 본다.
 * 방이 업적을 알리는 자리가 되는 곳이다(docs/garden-achievement-strategy.md §4).
 */
function SouvenirSheet({ title, speciesId, guest, onClose }: { title: string; speciesId?: string; guest: boolean; onClose: () => void }) {
  const entries = useMemorial();
  const entry = entryOf(entries, speciesId);
  useEffect(() => {
    if (speciesId) track("souvenir_tap", { slug: speciesId.slice(2), guest });
  }, [speciesId, guest]);
  return (
    <Sheet label={`${title} 자세히 보기`} title={title} onClose={onClose}>
      <div className="mt-3">
        {entries === undefined ? (
          <p className="text-[13px] text-smoke">불러오는 중…</p>
        ) : entry ? (
          <>
            <p className="mb-2 text-[12.5px] text-smoke">업적 기념관에서 문제를 맞혀 받은 기념품이에요.{guest ? " 정원에서 나도 알아보고 받을 수 있어요." : ""}</p>
            <PhotoCard entry={entry} from="room" />
          </>
        ) : (
          <p className="text-[13px] text-smoke">이 업적은 지금 기념관에 없어요.</p>
        )}
      </div>
    </Sheet>
  );
}

/**
 * 기념품 진열장 — 받은 기념품을 모두 보인다. 하나를 누르면 그 업적의 사진 카드. 손님도 같다.
 * 방이 꽉 차도 진열장 한 칸이면 기념관의 업적이 모두 방에 있다.
 */
function CaseSheet({ ids, guest, ownerNick, onClose }: { ids: readonly string[]; guest: boolean; ownerNick?: string; onClose: () => void }) {
  const entries = useMemorial();
  const [open, setOpen] = useState<string | null>(null);
  const list = ids.map((id) => entryOf(entries, id)).filter((e) => e !== undefined);
  const entry = open ? entryOf(entries, open) : undefined;
  useEffect(() => {
    track("souvenir_tap", { slug: "case", guest });
  }, [guest]);
  return (
    <Sheet label="기념품 진열장" title={`🏛️ ${guest && ownerNick ? `${ownerNick}의 ` : ""}기념품 진열장`} onClose={onClose}>
      <div className="mt-3">
        {entries === undefined ? (
          <p className="text-[13px] text-smoke">불러오는 중…</p>
        ) : entry ? (
          <>
            <button type="button" className="mb-2 min-h-[40px] text-[13px] font-semibold underline underline-offset-2" onClick={() => setOpen(null)}>
              ← 진열장으로
            </button>
            <PhotoCard entry={entry} from="room" />
          </>
        ) : list.length === 0 ? (
          <p className="text-[13px] text-smoke">아직 담긴 기념품이 없어요.</p>
        ) : (
          <>
            <p className="text-[12.5px] text-smoke">
              업적 기념관에서 문제를 맞혀 받은 기념품 {list.length}개예요. 누르면 그 업적의 카드를 볼 수 있어요.{guest ? " 정원에서 나도 알아보고 받을 수 있어요." : ""}
            </p>
            <ul className="mt-2 grid grid-cols-3 gap-2">
              {list.map((e) => (
                <li key={e.slug}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(e.speciesId);
                      track("souvenir_tap", { slug: e.slug, guest });
                    }}
                    className="flex min-h-[92px] w-full flex-col items-center gap-1 rounded-2xl border border-stone bg-white px-1.5 py-2 text-center"
                  >
                    <span className="text-[28px] leading-none" aria-hidden="true">{e.icon}</span>
                    <span className="line-clamp-2 text-[11.5px] font-semibold leading-tight">{e.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Sheet>
  );
}
