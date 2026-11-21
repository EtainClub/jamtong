"use client";

import { useEffect, useState } from "react";

import { track } from "@/lib/analytics";

import { gardenFeedback } from "../feedback";
import { ALBUM_MAX } from "../room/rules";
import { Sheet } from "../Sheet";
import { useGarden, type GardenData } from "../store";
import type { Species } from "../types";
import { PhotoCard } from "./PhotoCard";
import { entryOf, useMemorial } from "./useMemorial";

/**
 * 사진첩 — 거둔 업적 씨앗을 사진 한 장으로 올려 둔다(docs/garden-achievement-strategy.md §3).
 * 사진 한 장이 업적 하나를 알아보게 하는 카드다: 사진·한 줄 요약·핵심 숫자·반론·원본 링크.
 *
 * ★ 거둔 업적만 올린다. 사진과 글은 모두 콘텐츠에서 온다 — 사진첩에 사람이 지은 글이 들어갈 자리가 없다.
 * ★ 내 방이면 올리고 내리고, 남의 방이면 본다(album만 넘긴다).
 */
export function AlbumView({
  data,
  album,
  ownerNick,
  byId,
  say,
}: {
  /** 내 방이면 내 정원. 남의 방이면 없다. */
  data?: GardenData;
  /** 남의 방의 사진첩(공개 문서에서 읽은 품종 id). 내 방이면 data에서 읽는다. */
  album?: readonly string[];
  ownerNick: string;
  byId: Map<string, Species>;
  say?: (text: string) => void;
}) {
  const entries = useMemorial();
  const mine = Boolean(data);
  const ids = (data ? data.room.album : album) ?? [];
  const [picking, setPicking] = useState(false);
  useEffect(() => {
    track("album_open", { mine });
  }, [mine]);

  if (entries === undefined) return <p className="mt-4 text-[13px] text-smoke">사진첩을 여는 중…</p>;
  if (entries === null) return <p className="mt-4 text-[13px] text-smoke">사진첩 자료를 받지 못했어요. 잠시 뒤 다시 열어 주세요.</p>;

  const photos = [...ids].reverse().map((id) => entryOf(entries, id)).filter((e) => e !== undefined);
  // 올릴 수 있는 것 — 거둔 업적 품종 가운데 아직 안 올린 것.
  const harvested = data ? entries.filter((e) => data.dex[e.speciesId] && !ids.includes(e.speciesId)) : [];
  const unharvested = data ? entries.filter((e) => !data.dex[e.speciesId]).length : 0;

  return (
    <section aria-labelledby="garden-album" className="mt-4">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="garden-album" className="garden-diary-title">{mine ? "내 사진첩" : `${ownerNick}의 사진첩`}</h2>
        <p className="text-[12px] tabular-nums text-smoke">
          {photos.length}/{ALBUM_MAX}장
        </p>
      </div>
      {mine && (
        <>
          <p className="mt-1 text-[12.5px] leading-relaxed text-smoke">
            거둔 업적 씨앗을 사진첩에 올려요. 사진마다 그 업적의 핵심 숫자와 근거가 붙어서, 놀러 온 손님도 한 장으로 알아볼 수 있어요.
          </p>
          <button
            type="button"
            className="garden-diary-btn mt-2 min-h-[44px]"
            disabled={ids.length >= ALBUM_MAX}
            onClick={() => { gardenFeedback("tap"); setPicking(true); }}
          >
            📷 사진 올리기{harvested.length ? ` · 올릴 수 있는 업적 ${harvested.length}` : ""}
          </button>
        </>
      )}

      {photos.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-dashed border-stone px-4 py-6 text-center text-[13px] text-smoke">
          {mine ? "아직 올린 사진이 없어요. 업적 씨앗을 거두면 여기에 올릴 수 있어요." : "아직 올린 사진이 없어요."}
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {photos.map((e) => (
            <li key={e.slug}>
              <PhotoCard entry={e} from="album" />
              {mine && (
                <button
                  type="button"
                  className="mt-1 min-h-[36px] px-1 text-[12px] text-smoke underline underline-offset-2"
                  onClick={() => {
                    useGarden.getState().removeFromAlbum(e.speciesId);
                    say?.(`사진첩에서 「${e.title}」을 내렸어요`);
                  }}
                >
                  사진첩에서 내리기
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {picking && data && (
        <Sheet label="사진첩에 올릴 업적 고르기" title="📷 사진 올리기" onClose={() => setPicking(false)}>
          <p className="mt-2 text-[12.5px] text-smoke">거둔 업적 씨앗만 올릴 수 있어요.{unharvested ? ` 아직 거두지 않은 업적 ${unharvested}개는 씨앗을 심고 거두면 열려요.` : ""}</p>
          {harvested.length === 0 ? (
            <p className="mt-3 text-[13px]">올릴 수 있는 업적이 없어요. 업적 씨앗(★ 깃발·다년생 품종)을 거둬 보세요.</p>
          ) : (
            <ul className="mt-3 space-y-1.5">
              {harvested.map((e) => (
                <li key={e.slug}>
                  <button
                    type="button"
                    className="flex min-h-[48px] w-full items-center gap-2 rounded-xl border border-stone bg-white px-3 py-2 text-left"
                    onClick={() => {
                      const got = useGarden.getState().addToAlbum(e.speciesId, byId);
                      if (got === true) {
                        gardenFeedback("reward");
                        track("album_add", { slug: e.slug });
                        say?.(`📷 사진첩에 「${e.title}」을 올렸어요`);
                        setPicking(false);
                      } else say?.(got === "full" ? `사진첩은 ${ALBUM_MAX}장까지예요` : "올릴 수 없는 업적이에요");
                    }}
                  >
                    <span className="text-[22px]" aria-hidden="true">{e.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold">{e.title}</span>
                      <span className="block truncate text-[11.5px] text-smoke">{e.facts[0] ? `${e.facts[0].label} ${e.facts[0].value}` : e.subtitle}</span>
                    </span>
                    <span className="shrink-0 text-[12px] font-semibold">올리기</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Sheet>
      )}
    </section>
  );
}
