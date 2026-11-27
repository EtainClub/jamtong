"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { track } from "@/lib/analytics";
import { markScrap } from "@/lib/firebase/album";

import { gardenFeedback } from "../feedback";
import { withInvite } from "../invite";
import { LINE_PROBLEM_TEXT } from "../ilchon/text";
import { useMemorial } from "../memorial/useMemorial";
import { photoLink, sendGardenLink } from "../share";
import { Sheet } from "../Sheet";
import { useGarden, type GardenData } from "../store";
import type { Species } from "../types";
import { patchOf, PhotoComposer, type ComposeValue } from "./PhotoComposer";
import { PhotoView } from "./PhotoView";
import {
  canScrap,
  defaultFolder,
  defaultReason,
  folderCounts,
  FOLDERS,
  normalizeAlbum,
  ordered,
  parseAnchor,
  PHOTO_MAX,
  photoKey,
  REASON_SCRAP,
  snapCount,
  type Moment,
  type MomentData,
  type Photo,
  type PhotoFrom,
} from "./rules";
import { SNAP_MAX, takeSnap, type Snap, type SnapClip } from "./snap";
import { useAlbumRemote } from "./useAlbumRemote";

/**
 * 사진첩 2 — 골라서 담는 사진첩(docs/garden-album-review.md).
 *
 * 내 방: 장부(GardenData.album)의 사진을 보이고, 담고·고치고·내린다. 방을 열었으면 손님의 댓글·퍼감이 붙는다.
 * 남의 방: 공개 방(gardens/{gid}/photos)에서 읽는다. 댓글(방명록 받기 설정을 따른다)과 퍼가기.
 * 공유: 사진마다 그 한 장의 링크(/g/<공개id>/p/<사진id>)를 건넨다. 내 사진이든 남의 사진이든 열린 방이면.
 *       그 링크로 오면 focus — 사진첩을 그 한 장으로 열고, "사진첩 전체 보기"로 넓힌다.
 *
 * ★ 사진 파일을 받지 않는다. 사진은 콘텐츠 앵커이거나 정원 기록이다. 사람의 글은 한 줄(60자)뿐이다.
 */
export function AlbumView({
  data,
  ownerNick,
  byId,
  uid,
  gid,
  canComment = true,
  legacy,
  focus,
  clip,
  onClipDone,
  onVisit,
  say,
}: {
  /** 내 방이면 내 정원. 남의 방이면 없다. */
  data?: GardenData;
  ownerNick: string;
  byId: Map<string, Species>;
  uid: string | null;
  /** 남의 방의 공개 id. 내 방이면 data에서 읽는다. */
  gid?: string;
  /** 남의 방에 댓글을 남길 수 있는가(그 방의 방명록 받기와 1촌인지). */
  canComment?: boolean;
  /** 사진첩 2 전에 올린 남의 방의 옛 사진첩(업적 품종 id). 공개 사진이 없을 때만 그린다. */
  legacy?: readonly string[];
  /** 사진 링크로 왔으면 그 사진 id — 그 한 장만 먼저 보인다. */
  focus?: string | null;
  /** 사이트 페이지의 "사진첩에 담기"로 왔다(앵커). 내 방·텃밭의 「📸 찍기」로 왔으면 찍은 것(album/snap.ts). */
  clip?: string | SnapClip | null;
  onClipDone?: () => void;
  onVisit?: (gid: string) => void;
  say: (text: string) => void;
}) {
  const entries = useMemorial();
  const mine = Boolean(data);
  const roomId = mine ? (data!.share.on ? data!.share.id : null) : (gid ?? null);
  const remote = useAlbumRemote(roomId, !mine);
  const [folder, setFolder] = useState<number | null>(null);
  const [picking, setPicking] = useState(false);
  const [compose, setCompose] = useState<Compose | null>(null);
  const [scrapped, setScrapped] = useState<Set<string>>(new Set());
  const [focused, setFocused] = useState<string | null>(focus ?? null);
  const myPhotos = useGarden((s) => s.data?.album?.photos);

  useEffect(() => {
    track("album_open", { mine });
  }, [mine]);


  const photos: Array<Photo & { hidden?: boolean }> = useMemo(() => {
    if (mine) return ordered(myPhotos ?? []);
    if (remote.photos && remote.photos.length > 0) return ordered(remote.photos);
    if (remote.photos !== undefined && legacy?.length) return normalizeAlbum(undefined, legacy).photos;
    return remote.photos ?? [];
  }, [mine, myPhotos, remote.photos, legacy]);
  const legacyOnly = !mine && (remote.photos?.length ?? 0) === 0 && Boolean(legacy?.length);
  const counts = folderCounts(photos);
  const focusPhoto = focused ? photos.find((p) => p.id === focused) : undefined;
  const shown = focusPhoto ? [focusPhoto] : folder === null ? photos : photos.filter((p) => p.f === folder);
  const commentsOf = (id: string) => (remote.comments ?? []).filter((c) => c.ph === id);
  const scrapsOf = (id: string) => (remote.scraps ?? []).filter((s) => s.ph === id);

  // 사이트에서 "담기"로 왔으면 담기 시트부터(닫으면 부모가 clip을 지운다).
  const sheet: Compose | null = compose ?? (clip && mine ? (typeof clip === "string" ? { a: clip } : clip) : null);

  const close = () => {
    setCompose(null);
    if (clip) onClipDone?.();
  };

  const submit = (v: ComposeValue): string | null => {
    if (!sheet) return null;
    const store = useGarden.getState();
    if (sheet.edit) {
      const got = store.editPhoto(sheet.edit.id, patchOf(v));
      if (got !== true) return got === "missing" ? "사진을 찾지 못했어요" : LINE_PROBLEM_TEXT[got];
      say("사진을 고쳤어요");
      track("album_edit", { line: Boolean(v.x) });
      close();
      return null;
    }
    const got = store.clipPhoto({ a: sheet.a, md: sheet.md, sn: sheet.sn, from: sheet.from, p: v.p, k: v.k, f: v.f, x: v.x, cv: v.cv, nc: v.nc }, byId);
    if (typeof got === "string") {
      return {
        full: `사진첩은 ${PHOTO_MAX}장까지예요. 한 장을 내리고 담아 주세요`,
        have: "이미 담은 사진이에요",
        snaps: `방·텃밭 사진은 ${SNAP_MAX}장까지예요. 옛 사진을 한 장 내리고 찍어 주세요`,
        bad: "담을 수 없는 사진이에요",
        unknown: "더 이상 없는 자료예요",
        unharvested: "거둔 업적만 담을 수 있어요. 업적 씨앗을 심고 거둬 보세요",
      }[got];
    }
    gardenFeedback("reward");
    track(sheet.from ? "album_scrap" : "album_add", { kind: sheet.a.slice(0, 1), line: Boolean(v.x) });
    say(sheet.from ? `📌 ${sheet.from.n}의 사진을 퍼 왔어요` : sheet.sn ? "📸 오늘의 모습을 사진첩에 남겼어요" : "📷 사진첩에 담았어요");
    close();
    return null;
  };

  // 사진 한 장의 링크. 방을 열어 공개된 사진만 — 닫힌 방의 사진은 링크를 받아도 열리지 않는다.
  const share = async (p: Photo) => {
    if (!roomId) return say("방을 열면 사진을 공유할 수 있어요 · 위쪽 「🔗 자랑하기」에서 열어요");
    const result = await sendGardenLink(
      withInvite(photoLink(roomId, p.id), "i"),
      `${ownerNick}의 사진첩 · 잼통 정원`,
      mine ? "내 사진첩의 한 장이에요 📷" : "이 사진 같이 봐요 📷",
      "photo",
    );
    if (result === "copied") say("🔗 사진 링크를 복사했어요");
    else if (result === "failed") say("링크를 복사하지 못했어요");
  };

  // 손님의 퍼가기 — 내 사진첩에 담고, 그 방에 퍼감 표식을 남긴다(주인이 잼을 받는다).
  const scrap = (p: Photo) => {
    if (!gid || !uid) return say("잠시 뒤 다시 해 보세요");
    if (!useGarden.getState().data) return say("정원을 연 뒤에 퍼 갈 수 있어요");
    setCompose({ a: p.a, md: p.md, from: { g: gid, p: p.id, n: ownerNick.slice(0, 12) || "이웃" } });
  };
  const afterScrap = (photoId: string) => {
    const d = useGarden.getState().data;
    if (!gid || !uid || !d) return;
    markScrap(gid, { uid, gid: d.share.on ? d.share.id : null, nick: d.nick }, photoId)
      .then(() => {
        setScrapped((s) => new Set(s).add(photoId));
        remote.reload();
      })
      .catch((error) => console.error("[album] 퍼감 표식을 남기지 못했다", error));
  };

  if (entries === null && photos.length === 0 && !mine) return <p className="mt-4 text-[13px] text-smoke">사진첩 자료를 받지 못했어요. 잠시 뒤 다시 열어 주세요.</p>;

  const myScraps = new Set([...(remote.scraps ?? []).filter((s) => s.uid === uid).map((s) => s.ph), ...scrapped]);
  const haveKeys = new Set((myPhotos ?? []).map(photoKey));

  return (
    <section aria-labelledby="garden-album" className="mt-4">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="garden-album" className="garden-diary-title">{mine ? "내 사진첩" : `${ownerNick}의 사진첩`}</h2>
        <p className="text-[12px] tabular-nums text-smoke">
          {photos.length}/{PHOTO_MAX}장
        </p>
      </div>
      {mine && (
        <>
          <p className="mt-1 text-[12.5px] leading-relaxed text-smoke">
            업적·카툰 한 칸·언행·정책 팩트·책 한 장, 내 정원의 순간, 그리고 지금 내 방·텃밭을 찍어 담아요. 왜 담았는지 고르거나 직접 쓰면 손님이 댓글을 달고 퍼 갈 수 있어요.
          </p>
          {!data!.share.on && <p className="mt-1 text-[12px] text-smoke">방을 열면 손님이 사진첩을 보고 댓글을 남길 수 있어요.</p>}
          <button
            type="button"
            className="garden-diary-btn mt-2 min-h-[44px]"
            disabled={photos.length >= PHOTO_MAX}
            onClick={() => {
              gardenFeedback("tap");
              setPicking(true);
            }}
          >
            📷 사진 담기
          </button>
        </>
      )}

      {focused && remote.photos !== undefined && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-stone bg-white px-3 py-2 text-[12.5px]">
          <span className="min-w-0 flex-1">{focusPhoto ? "🔗 링크로 받은 사진 한 장이에요" : "링크의 사진을 찾지 못했어요 · 주인이 내렸을 수 있어요"}</span>
          <button type="button" className="garden-chip-btn" onClick={() => { gardenFeedback("tap"); setFocused(null); }}>
            사진첩 전체 보기
          </button>
        </div>
      )}

      {photos.length > 0 && !focusPhoto && (
        <div role="group" aria-label="폴더" className="garden-chips mt-3">
          <button type="button" className="garden-chip-btn" aria-pressed={folder === null} onClick={() => setFolder(null)}>
            전체 {photos.length}
          </button>
          {FOLDERS.map((f, i) =>
            counts[i] ? (
              <button key={f.label} type="button" className="garden-chip-btn" aria-pressed={folder === i} onClick={() => setFolder(i)}>
                {f.icon} {f.label} {counts[i]}
              </button>
            ) : null,
          )}
        </div>
      )}

      {!mine && remote.photos === undefined ? (
        <p className="mt-3 text-[13px] text-smoke">사진첩을 여는 중…</p>
      ) : shown.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-dashed border-stone px-4 py-6 text-center text-[13px] text-smoke">
          {mine ? "아직 담은 사진이 없어요. 「📷 사진 담기」나 업적·언행·정책 페이지의 「사진첩에 담기」로 담아 보세요." : "아직 담은 사진이 없어요."}
        </p>
      ) : (
        <ul className="mt-3 space-y-4">
          {shown.map((p) => (
            <li key={p.id}>
              <PhotoView
                photo={p}
                ownerNick={ownerNick}
                gid={legacyOnly ? null : roomId}
                owner={mine}
                uid={uid}
                entries={entries}
                byId={byId}
                comments={commentsOf(p.id)}
                scraps={scrapsOf(p.id)}
                canComment={canComment}
                scrapped={myScraps.has(p.id) || haveKeys.has(photoKey(p))}
                onScrap={!mine && !legacyOnly && uid && canScrap(p) ? () => scrap(p) : undefined}
                onShare={legacyOnly || (!mine && !roomId) ? undefined : () => void share(p)}
                onEdit={mine ? () => setCompose({ a: p.a, md: p.md, sn: p.sn, edit: p }) : undefined}
                onRemove={
                  mine
                    ? () => {
                        useGarden.getState().removePhoto(p.id);
                        say("사진첩에서 내렸어요");
                      }
                    : undefined
                }
                onChanged={remote.reload}
                onVisit={onVisit}
                say={say}
              />
            </li>
          ))}
        </ul>
      )}

      {picking && data && (
        <PickSheet
          data={data}
          entries={entries}
          byId={byId}
          onClose={() => setPicking(false)}
          onPick={(a, md, sn) => {
            setPicking(false);
            setCompose({ a, md, sn });
          }}
        />
      )}

      {sheet && (
        <PhotoComposer
          title={sheet.edit ? "사진 고치기" : sheet.from ? "📌 퍼 오기" : sheet.sn ? "📸 찰칵! 사진첩에 남기기" : "📷 사진첩에 담기"}
          a={sheet.a}
          md={sheet.md}
          sn={sheet.sn}
          entries={entries}
          byId={byId}
          initial={initialOf(sheet)}
          submitLabel={sheet.edit ? "고치기" : sheet.from ? "내 사진첩에 퍼 오기" : "담기"}
          onClose={close}
          onSubmit={(v) => {
            const why = submit(v);
            if (!why && sheet.from) afterScrap(sheet.from.p);
            return why;
          }}
        />
      )}
    </section>
  );
}

interface Compose {
  a: string;
  md?: MomentData;
  sn?: Snap;
  from?: PhotoFrom;
  edit?: Photo;
}

function initialOf(c: { a: string; edit?: Photo; from?: PhotoFrom }): ComposeValue {
  if (c.edit) return { p: c.edit.p, k: c.edit.k, f: c.edit.f, x: c.edit.x, cv: Boolean(c.edit.cv), nc: Boolean(c.edit.nc) };
  const anchor = parseAnchor(c.a);
  return { p: c.from ? REASON_SCRAP : anchor ? defaultReason(anchor) : 0, k: 0, f: anchor ? defaultFolder(anchor) : 0, x: "", cv: false, nc: false };
}

/** 담을 것 고르기 — 지금 찍기(방·텃밭)·내 정원의 순간·거둔 업적·카툰 한 칸. 언행·정책·책은 그 페이지에서 담는다. */
function PickSheet({
  data,
  entries,
  byId,
  onClose,
  onPick,
}: {
  data: GardenData;
  entries: ReturnType<typeof useMemorial>;
  byId: Map<string, Species>;
  onClose: () => void;
  onPick: (a: string, md?: MomentData, sn?: Snap) => void;
}) {
  const [cutsOf, setCutsOf] = useState<string | null>(null);
  const have = new Set((data.album?.photos ?? []).map(photoKey));
  const snaps = snapCount(data.album?.photos ?? []);
  const moments = (data.album?.moments ?? []).filter((m) => !have.has(photoKey({ a: `m:${m.t}`, md: mdOf(m) })));
  const harvested = (entries ?? []).filter((e) => data.dex[e.speciesId]);
  const cards = harvested.filter((e) => !have.has(photoKey({ a: e.speciesId })));
  const withCuts = harvested.filter((e) => e.cartoon);

  return (
    <Sheet label="사진첩에 담을 것 고르기" title="📷 사진 담기" onClose={onClose}>
      <h3 className="mt-3 text-[13px] font-bold">📸 지금 찍기</h3>
      <p className="mt-1 text-[12.5px] leading-relaxed text-smoke">
        지금의 방과 텃밭을 그대로 남겨요. 나중에 방을 바꾸고 작물을 거둬도 사진 속 그날은 그대로예요. ({snaps}/{SNAP_MAX}장)
      </p>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        {(["room", "yard"] as const).map((kind) => (
          <button
            key={kind}
            type="button"
            disabled={snaps >= SNAP_MAX}
            onClick={() => {
              gardenFeedback("tap");
              const shot = takeSnap(kind, data, Date.now());
              onPick(shot.a, shot.md, shot.sn);
            }}
            className="flex min-h-[56px] items-center justify-center gap-1.5 rounded-xl border border-stone bg-white px-2 text-[13px] font-semibold disabled:opacity-50"
          >
            <span className="text-[22px]" aria-hidden="true">{kind === "room" ? "🏠" : "🌾"}</span>
            {kind === "room" ? "내 방 찍기" : "내 텃밭 찍기"}
          </button>
        ))}
      </div>
      {snaps >= SNAP_MAX && <p className="mt-1 text-[12px] text-smoke">방·텃밭 사진이 {SNAP_MAX}장 다 찼어요. 옛 사진을 내리면 다시 찍을 수 있어요.</p>}

      <h3 className="mt-4 text-[13px] font-bold">🌱 내 정원의 순간</h3>
      {moments.length === 0 ? (
        <p className="mt-1 text-[12.5px] text-smoke">새 품종·황금 열매·거대 잡초·기념품·완독 같은 순간이 생기면 여기에 떠요.</p>
      ) : (
        <ul className="mt-1.5 space-y-1.5">
          {moments.map((m) => (
            <li key={`${m.t}-${m.s}-${m.v}`}>
              <PickRow icon={MOMENT_ICON[m.t]} title={momentLabel(m, byId)} sub={new Date(m.at).toLocaleDateString("ko-KR", { month: "long", day: "numeric", timeZone: "Asia/Seoul" })} onClick={() => onPick(`m:${m.t}`, mdOf(m))} />
            </li>
          ))}
        </ul>
      )}

      <h3 className="mt-4 text-[13px] font-bold">🏛 거둔 업적</h3>
      {entries === undefined ? (
        <p className="mt-1 text-[12.5px] text-smoke">여는 중…</p>
      ) : cards.length === 0 ? (
        <p className="mt-1 text-[12.5px] text-smoke">{harvested.length ? "거둔 업적을 모두 담았어요." : "업적 씨앗(★ 깃발·다년생 품종)을 거두면 담을 수 있어요."}</p>
      ) : (
        <ul className="mt-1.5 space-y-1.5">
          {cards.map((e) => (
            <li key={e.slug}>
              <PickRow icon={e.icon} title={e.title} sub={e.facts[0] ? `${e.facts[0].label} ${e.facts[0].value}` : e.subtitle} onClick={() => onPick(e.speciesId)} />
            </li>
          ))}
        </ul>
      )}

      {withCuts.length > 0 && (
        <>
          <h3 className="mt-4 text-[13px] font-bold">🎞 카툰 한 칸</h3>
          <ul className="mt-1.5 space-y-1.5">
            {withCuts.map((e) => (
              <li key={e.slug}>
                <PickRow icon={e.icon} title={e.title} sub={`${e.cartoon!.panels.length}칸 중 하나 고르기`} onClick={() => setCutsOf(cutsOf === e.slug ? null : e.slug)} />
                {cutsOf === e.slug && (
                  <ul className="mt-1.5 grid grid-cols-2 gap-1.5">
                    {e.cartoon!.panels.map((p) => {
                      const a = `${e.speciesId}/${p.id}`;
                      return (
                        <li key={p.id}>
                          <button type="button" disabled={have.has(photoKey({ a }))} onClick={() => onPick(a)} className="w-full overflow-hidden rounded-xl border border-stone bg-white text-left disabled:opacity-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.image} alt="" loading="lazy" className="aspect-[3/2] w-full object-cover" />
                            <span className="block truncate px-1.5 py-1 text-[11.5px]">{p.title}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <h3 className="mt-4 text-[13px] font-bold">💬 언행 · 🔎 정책 · 📖 책</h3>
      <p className="mt-1 text-[12.5px] leading-relaxed text-smoke">
        읽던 자리에서 담아요. 언행의 장면, 정책의 사실 한 줄, 책의 한 장 아래에 있는 「📷 사진첩에 담기」를 누르세요.
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1.5 text-[12.5px]">
        <Link href="/words" className="garden-chip-btn">언행 보기</Link>
        <Link href="/wiki" className="garden-chip-btn">정책 위키</Link>
        <Link href="/books" className="garden-chip-btn">책 보기</Link>
      </div>
    </Sheet>
  );
}

function PickRow({ icon, title, sub, onClick }: { icon: string; title: string; sub: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-[48px] w-full items-center gap-2 rounded-xl border border-stone bg-white px-3 py-2 text-left">
      <span className="text-[22px]" aria-hidden="true">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold">{title}</span>
        <span className="block truncate text-[11.5px] text-smoke">{sub}</span>
      </span>
      <span className="shrink-0 text-[12px] font-semibold">담기</span>
    </button>
  );
}

const MOMENT_ICON: Record<Moment["t"], string> = { species: "🌱", golden: "✨", rainbow: "🌈", raid: "🌿", souvenir: "🏛", book: "🔖", room: "🏠", yard: "🌾" };

function mdOf(m: Moment): MomentData {
  return { ...(m.s !== undefined ? { s: m.s } : {}), ...(m.v !== undefined ? { v: m.v } : {}) };
}

function momentLabel(m: Moment, byId: Map<string, Species>): string {
  const title = m.s ? byId.get(m.s)?.title : undefined;
  if (m.t === "species") return `새 품종 「${title ?? "?"}」`;
  if (m.t === "golden") return `황금 열매 「${title ?? "?"}」`;
  if (m.t === "rainbow") return `무지개 열매 「${title ?? "?"}」`;
  if (m.t === "souvenir") return `기념품 「${title ?? "?"}」`;
  if (m.t === "raid") return "거대 잡초를 쓰러뜨린 날";
  if (m.t === "room") return "내 방 사진";
  if (m.t === "yard") return "내 텃밭 사진";
  return "책 한 권 완독";
}
