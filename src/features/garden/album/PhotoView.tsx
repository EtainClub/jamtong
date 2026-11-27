"use client";

import { useState } from "react";

import { track } from "@/lib/analytics";
import { addPhotoComment, deletePhotoComment, hidePhotoComment, hidePhotoLine, reportAlbum, type PhotoComment, type PhotoScrap } from "@/lib/firebase/album";

import { gardenFeedback } from "../feedback";
import { blockPerson, useIlchonLive } from "../ilchon/live";
import { LineComposer, LineRow } from "../ilchon/parts";
import { STICKERS } from "../ilchon/rules";
import type { MemorialEntry } from "../memorial/types";
import { kstDayNumber } from "../rules";
import { useGarden } from "../store";
import type { Species } from "../types";
import { PhotoBody } from "./PhotoBody";
import { canScrap, COMMENT_PHRASES, COMMENT_SAW_SOURCE, COMMENTS_PEEK, FOLDERS, reasonText, type Photo } from "./rules";

/**
 * 사진 한 장 — 사실 칸(PhotoBody) · 주인의 말풍선 · 댓글과 퍼감(docs/garden-album-review.md §5·§6).
 *
 * ★ 말풍선은 "○○의 한 줄"로 사실 칸과 모양·자리를 달리한다. 글로만 그린다.
 * ★ 댓글은 방명록과 같은 한 줄이다. "근거 봤어요"는 이 사진의 근거·원문 링크를 연 뒤에만 고를 수 있다.
 * ★ 퍼감 수는 퍼 갈 수 있는 사진에만 단다. 정원의 순간(방·텃밭 사진 포함)은 퍼 가지 못한다(firestore.rules).
 *   주인은 퍼감 수를 눌러 누가 퍼 갔는지 보고 그 방으로 건너간다.
 */
export function PhotoView({
  photo,
  ownerNick,
  gid,
  owner,
  uid,
  entries,
  byId,
  comments,
  scraps,
  canComment,
  scrapped,
  onScrap,
  onShare,
  onEdit,
  onRemove,
  onChanged,
  onVisit,
  say,
}: {
  photo: Photo & { hidden?: boolean };
  ownerNick: string;
  /** 공개 방 id — 없으면(방을 닫았다) 댓글·퍼감이 없다. */
  gid: string | null;
  owner: boolean;
  uid: string | null;
  entries: readonly MemorialEntry[] | null | undefined;
  byId: ReadonlyMap<string, Species>;
  comments: PhotoComment[];
  /** 이 사진의 퍼감 표식(최근 것부터). */
  scraps: PhotoScrap[];
  /** 손님이 댓글을 남길 수 있는가(방명록 받기 설정). 주인은 언제나. */
  canComment: boolean;
  /** 이미 퍼 갔는가(손님). */
  scrapped?: boolean;
  onScrap?: () => void;
  /** 이 사진 한 장의 링크를 건넨다. 없으면(방을 닫았다·옛 사진첩) 공유 단추가 없다. */
  onShare?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
  onChanged: () => void;
  onVisit?: (gid: string) => void;
  say: (text: string) => void;
}) {
  const admin = useIlchonLive((s) => s.admin);
  const blocked = useGarden((s) => s.data?.ilchon.blocked);
  // 선택자는 값 하나씩 — 객체를 새로 만들면 렌더마다 바뀐 것으로 본다.
  const myGid = useGarden((s) => (s.data?.share.on ? s.data.share.id : null));
  const myNick = useGarden((s) => s.data?.nick ?? null);
  const [sawSource, setSawSource] = useState(false);
  const [writing, setWriting] = useState(false);
  const [all, setAll] = useState(false);
  const [more, setMore] = useState(false);
  const [whoScrapped, setWhoScrapped] = useState(false);

  const shown = comments.filter((c) => (!c.hidden || owner || admin) && !(owner && blocked?.some((b) => b.uid === c.uid)));
  const visible = all ? shown : shown.slice(0, COMMENTS_PEEK);
  const sticker = STICKERS[photo.k] ?? STICKERS[0];
  const folder = FOLDERS[photo.f] ?? FOLDERS[0];
  const date = photo.at ? new Date(photo.at).toLocaleDateString("ko-KR", { year: "numeric", month: "numeric", day: "numeric", timeZone: "Asia/Seoul" }) : null;
  const takes = Boolean(gid) && !photo.nc && (owner || canComment);
  const fail = (what: string) => (error: unknown) => {
    console.error(`[album] ${what}`, error);
    say(`${what} 잠시 뒤 다시 해 보세요`);
  };

  return (
    <article aria-label={`${ownerNick}의 사진`} className="garden-album-photo">
      {photo.cv && <p className="mb-1 text-[11.5px] font-bold text-[var(--d-sky-ink)]">★ 대표 사진</p>}
      <PhotoBody
        a={photo.a}
        md={photo.md}
        sn={photo.sn}
        entries={entries}
        byId={byId}
        onSource={() => {
          setSawSource(true);
          track("album_source", { kind: photo.a.slice(0, 1) });
        }}
      />

      {/* 사람의 칸 — 사실 칸과 따로. */}
      <div className="garden-album-bubble mt-2">
        <p className="text-[13.5px] leading-snug">
          <span aria-label={sticker.label} className="mr-1">{sticker.icon}</span>
          {reasonText(photo.p) ? <b>{reasonText(photo.p)}</b> : photo.x && !photo.hidden ? <b className="break-words">“{photo.x}”</b> : <b>{photo.hidden ? "운영자가 가린 글이에요" : ""}</b>}
        </p>
        {photo.x && reasonText(photo.p) && (
          <p className={`mt-0.5 break-words text-[13px] ${photo.hidden ? "text-smoke line-through" : ""}`}>
            {photo.hidden ? "운영자가 가린 글이에요" : `“${photo.x}”`}
          </p>
        )}
        <p className="mt-1 text-[11.5px] text-smoke">
          — {ownerNick}의 한 줄 · {folder.icon} {folder.label}
          {date && <> · {date}</>}
          {photo.from && (
            <>
              {" · "}
              {onVisit ? (
                <button type="button" className="underline underline-offset-2" onClick={() => onVisit(photo.from!.g)}>
                  {photo.from.n}의 사진첩에서
                </button>
              ) : (
                <>{photo.from.n}의 사진첩에서</>
              )}
            </>
          )}
        </p>
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[12px]">
        {gid && (
          <span className="text-smoke">
            💬 {shown.length}
            {canScrap(photo) && (
              <>
                {" · "}
                {owner && scraps.length > 0 ? (
                  <button type="button" className="underline underline-offset-2" aria-expanded={whoScrapped} onClick={() => setWhoScrapped(!whoScrapped)}>
                    📌 퍼감 {scraps.length}
                  </button>
                ) : (
                  <>📌 퍼감 {scraps.length}</>
                )}
              </>
            )}
          </span>
        )}
        <span className="flex-1" />
        {takes && uid && (
          <button type="button" className="garden-chip-btn" onClick={() => { gardenFeedback("tap"); setWriting(true); }}>
            댓글
          </button>
        )}
        {onScrap && (
          <button type="button" className="garden-chip-btn" disabled={scrapped} onClick={onScrap}>
            {scrapped ? "퍼 갔어요" : "퍼가기"}
          </button>
        )}
        {onShare && (
          <button type="button" className="garden-chip-btn" aria-label="이 사진 공유하기" onClick={() => { gardenFeedback("tap"); onShare(); }}>
            ↗ 공유
          </button>
        )}
        {owner && onEdit && (
          <button type="button" className="garden-chip-btn" onClick={onEdit}>
            고치기
          </button>
        )}
        {(owner || (photo.x && uid)) && (
          <button type="button" className="garden-chip-btn" aria-expanded={more} aria-label="더 보기" onClick={() => setMore(!more)}>
            ⋯
          </button>
        )}
      </div>
      {whoScrapped && owner && scraps.length > 0 && (
        <p className="mt-1.5 text-[12px] leading-relaxed text-smoke">
          📌 퍼 간 사람{" "}
          {scraps.map((s, i) => (
            <span key={s.id}>
              {i > 0 && ", "}
              {onVisit && s.g ? (
                <button type="button" className="font-semibold text-ink underline underline-offset-2" onClick={() => onVisit(s.g)}>
                  {s.n}
                </button>
              ) : (
                <b className="text-ink">{s.n}</b>
              )}
            </span>
          ))}
        </p>
      )}
      {more && (
        <div className="mt-1.5 flex flex-wrap justify-end gap-1.5">
          {owner && onRemove && (
            <button type="button" className="garden-chip-btn" onClick={onRemove}>
              사진첩에서 내리기
            </button>
          )}
          {!owner && photo.x && gid && uid && (
            <button
              type="button"
              className="garden-chip-btn"
              onClick={() => reportAlbum(uid, gid, { photo: photo.id }).then(() => say("신고했어요 · 운영자가 살펴봐요")).catch(fail("신고하지 못했어요."))}
            >
              한 줄 신고
            </button>
          )}
          {admin && photo.x && gid && (
            <button
              type="button"
              className="garden-chip-btn"
              onClick={() => hidePhotoLine(gid, photo.id, !photo.hidden).then(onChanged).catch(fail("가리지 못했어요."))}
            >
              {photo.hidden ? "가리기 풀기" : "한 줄 가리기(운영자)"}
            </button>
          )}
        </div>
      )}

      {gid && shown.length > 0 && (
        <ul className="mt-1.5">
          {visible.map((c) => (
            <LineRow
              key={c.id}
              line={c}
              phrases={COMMENT_PHRASES}
              owner={owner}
              canRemove={owner || c.uid === uid}
              admin={admin}
              onVisit={onVisit}
              onRemove={() =>
                deletePhotoComment(gid, c.id)
                  .then(() => {
                    say("지웠어요");
                    onChanged();
                  })
                  .catch(fail("지우지 못했어요."))
              }
              onReport={() => {
                if (!uid) return say("잠시 뒤 다시 해 보세요");
                reportAlbum(uid, gid, { comment: c.id }).then(() => say("신고했어요 · 운영자가 살펴봐요")).catch(fail("신고하지 못했어요."));
              }}
              onBlock={
                owner && uid && c.uid !== uid
                  ? () =>
                      blockPerson({ uid, gid }, { uid: c.uid, n: c.n })
                        .then(() => {
                          say(`${c.n}님을 차단했어요`);
                          onChanged();
                        })
                        .catch(fail("차단하지 못했어요."))
                  : undefined
              }
              onHide={() => hidePhotoComment(gid, c.id, !c.hidden).then(onChanged).catch(fail("가리지 못했어요."))}
            />
          ))}
        </ul>
      )}
      {shown.length > COMMENTS_PEEK && (
        <button type="button" className="mt-1 min-h-[36px] text-[12px] text-smoke underline underline-offset-2" onClick={() => setAll(!all)}>
          {all ? "댓글 접기" : `댓글 ${shown.length}개 모두 보기`}
        </button>
      )}

      {writing && gid && uid && myNick && (
        <LineComposer
          title="💬 사진에 댓글"
          label="사진에 댓글 남기기"
          submitLabel="댓글 남기기"
          phrases={COMMENT_PHRASES}
          locked={sawSource ? undefined : new Map([[COMMENT_SAW_SOURCE, "사진의 근거를 열면 고를 수 있어요"]])}
          onClose={() => setWriting(false)}
          onSubmit={async (line) => {
            try {
              await addPhotoComment(gid, { uid, gid: myGid, nick: myNick }, photo.id, line, kstDayNumber(Date.now()));
            } catch (error) {
              const denied = (error as { code?: string }).code === "permission-denied";
              throw new Error(denied ? "오늘은 이 사진에 이미 댓글을 남겼거나, 지금은 댓글을 받지 않아요" : "남기지 못했어요. 잠시 뒤 다시 해 보세요");
            }
            gardenFeedback("reward");
            track("album_comment", { preset: line.p >= 0, owner });
            say("💬 댓글을 남겼어요");
            setWriting(false);
            onChanged();
          }}
        />
      )}
    </article>
  );
}
