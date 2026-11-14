"use client";

import { useEffect, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import { firebaseConfigured } from "@/lib/firebase/client";
import { deleteKeyRecs, keyRecUrl, loadKeysHidden, reportKeys, setKeysHidden } from "@/lib/firebase/roomKeys";

import { gardenFeedback, musicGrid } from "../feedback";
import { useIlchonLive } from "../ilchon/live";
import { Sheet } from "../Sheet";
import { useGarden } from "../store";
import { KeyEditor } from "./KeyEditor";
import { KeyFace } from "./KeyArt";
import { blankKeys, freshKeys, keyForCode, REC, recSlots, soundLabel, type RoomKey } from "./keyboard";
import { ClipBank, pressKey } from "./keyboardSound";

/**
 * 내 키보드 시트 — 방의 키보드를 누르면 뜬다(내 방·남의 방 모두). 설계는 docs/garden-miniroom.md §4.5.
 *
 * ★ 큰 키 넷을 누른다. 시트가 열려 있으면 1–4, A S D F로도.
 * ★ 녹음 키는 시트를 열 때 넷을 미리 받아 둔다(<audio>, keyboardSound.ts의 ClipBank).
 * ★ 운영자가 가린 키보드(gardens/{gid}/mod/keys)는 손님에게 빈 키·소리 없음으로 보인다. 주인에게는 알림을, 운영자에게는 원래 키를.
 * ★ 신고는 그림·소리를 싣지 않고 자리만 운영자 큐로(lib/firebase/roomKeys.ts의 reportKeys).
 * ★ 계측은 시트를 열고 처음 누른 한 번만 보낸다(key_play) — 누를 때마다 보내면 너무 잦다.
 */
export function KeyboardSheet({
  keys,
  owner,
  ownerUid,
  gid,
  uid,
  nick,
  say,
  onClose,
}: {
  keys: RoomKey[];
  /** 내 방인가. 주인은 키를 고친다. */
  owner: boolean;
  /** 녹음 경로(roomKeys/{uid}/…)의 주인. 모르면 녹음은 조용하다. */
  ownerUid: string | null;
  /** 방의 공개 id. 방을 열지 않았으면 null. */
  gid: string | null;
  uid: string | null;
  nick: string;
  say: (text: string) => void;
  onClose: () => void;
}) {
  const admin = useIlchonLive((s) => s.admin);
  const shareOn = useGarden((s) => Boolean(s.data?.share.on));
  const [hidden, setHidden] = useState(false);
  const [mode, setMode] = useState<"play" | "pick" | number>("play");
  const [down, setDown] = useState<number | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [busy, setBusy] = useState(false);
  const played = useRef(false);
  const bank = useRef<ClipBank | null>(null);

  const blank = hidden && !owner && !admin;
  const shown = blank ? blankKeys() : keys;

  // 운영자가 가렸는가. 방을 연 방만 가릴 수 있다.
  useEffect(() => {
    if (!firebaseConfigured || !gid) return;
    let alive = true;
    void loadKeysHidden(gid).then((h) => alive && setHidden(h));
    return () => {
      alive = false;
    };
  }, [gid]);

  // 녹음 넷을 미리 받는다. 키가 바뀌면(다시 녹음) 다시.
  const recSig = blank || !ownerUid ? "" : recSlots(keys).map((i) => `${i}-${keys[i].ver}`).join(",");
  useEffect(() => {
    if (!firebaseConfigured || !ownerUid || !recSig) return;
    let alive = true;
    const next = new ClipBank();
    const wanted = new Map(recSig.split(",").map((x) => x.split("-").map(Number) as [number, number]));
    void Promise.all([0, 1, 2, 3].map((i) => (wanted.has(i) ? keyRecUrl(ownerUid, i, wanted.get(i)!) : Promise.resolve(null)))).then((urls) => {
      if (!alive) return;
      next.load(urls);
      bank.current?.dispose();
      bank.current = next;
    });
    return () => {
      alive = false;
    };
  }, [ownerUid, recSig]);
  useEffect(() => () => bank.current?.dispose(), []);

  const press = (slot: number) => {
    const key = shown[slot];
    if (!key) return;
    const source = pressKey(key, slot, bank.current);
    if (source && !played.current) {
      played.current = true;
      track("key_play", { source, mine: owner });
    }
  };

  // 손가락 자판(시트가 열려 있고 키를 누르는 화면일 때만). 듣는 쪽은 늘 지금의 press를 부른다.
  const pressSlot = useRef(press);
  useEffect(() => {
    pressSlot.current = press;
  });
  useEffect(() => {
    if (mode !== "play") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      const slot = keyForCode(e.key);
      if (slot === null) return;
      e.preventDefault();
      setDown(slot);
      setTimeout(() => setDown((d) => (d === slot ? null : d)), 140);
      pressSlot.current(slot);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  if (typeof mode === "number" && owner) {
    return (
      <Sheet label={`${mode + 1}번 키 고치기`} title={`${mode + 1}번 키 고치기`} onClose={onClose}>
        <KeyEditor slot={mode} uid={uid} shareOn={shareOn && Boolean(gid)} say={say} onDone={() => setMode("play")} />
      </Sheet>
    );
  }

  const reset = async () => {
    if (!uid && recSlots(keys).length > 0) return say("잠시 뒤 다시 해 보세요");
    setBusy(true);
    try {
      const recs = recSlots(keys).map((slot) => ({ slot, ver: keys[slot].ver }));
      // 녹음을 다 지운 뒤에야 키를 되돌린다 — 못 지운 파일이 어디에도 묶이지 않은 채 남지 않게.
      if (recs.length && uid) await deleteKeyRecs(uid, recs);
      useGarden.getState().setKeys(freshKeys().map((k, i) => ({ ...k, ver: keys[i].ver })));
      track("key_edit", { what: "reset" });
      say("⌨️ 키보드를 처음으로 되돌렸어요");
      setConfirmReset(false);
    } catch (error) {
      console.error("[keyboard] 처음으로 되돌리지 못했다", error);
      say("녹음을 지우지 못했어요. 잠시 뒤 다시 해 보세요");
    } finally {
      setBusy(false);
    }
  };

  const picking = mode === "pick";
  const grid = musicGrid();

  return (
    <Sheet label={owner ? "내 키보드" : `${nick}의 키보드`} title={owner ? "⌨️ 내 키보드" : `⌨️ ${nick}의 키보드`} onClose={onClose}>
      {owner && hidden && (
        <p className="garden-key-note mt-3" role="status">
          운영자가 이 키보드를 가렸어요. 손님에게는 빈 키로 보이고 소리가 나지 않아요. 궁금하면 피드백 게시판에 물어봐 주세요.
        </p>
      )}
      {!owner && admin && hidden && <p className="garden-key-note mt-3">운영자 화면 · 손님에게는 가려진 키보드예요.</p>}
      {picking && <p className="mt-3 text-[13px] font-bold text-[var(--d-sky-ink)]">고칠 키를 골라요</p>}

      <div className="garden-keys mt-3" role="group" aria-label={picking ? "고칠 키 고르기" : "키보드"}>
        {shown.map((k, i) => {
          const sound = soundLabel(k);
          return (
            <div key={i} className="min-w-0">
              <button
                type="button"
                className={`garden-keycap ${down === i ? "is-down" : ""} ${picking ? "is-pick" : ""}`}
                aria-label={picking ? `${i + 1}번 키 고치기 · ${sound.label}` : `${i + 1}번 키 · ${sound.label}`}
                onPointerDown={() => !picking && setDown(i)}
                onPointerUp={() => setDown(null)}
                onPointerLeave={() => setDown((d) => (d === i ? null : d))}
                onPointerCancel={() => setDown(null)}
                onClick={() => {
                  if (picking) {
                    gardenFeedback("tap");
                    setMode(i);
                  } else press(i);
                }}
              >
                <KeyFace face={k.face} className="garden-keycap-face" />
              </button>
              <p className="garden-keycap-tag">
                <span aria-hidden="true">{i + 1}·{"ASDF"[i]}</span>{" "}
                <span aria-hidden="true">{k.sound === REC ? "🎙" : sound.icon}</span>
              </p>
            </div>
          );
        })}
      </div>

      {blank ? (
        <p className="mt-3 text-[12.5px] text-smoke">이 키보드는 지금 쉬는 중이에요.</p>
      ) : (
        <p className="mt-3 text-[12px] leading-relaxed text-smoke">
          {grid ? "♪ 방 음악 박자에 맞춰 울려요. " : ""}
          자판이 있으면 1–4나 A S D F로도 눌러요. 무음 모드에서는 들리지 않아요.
          {recSlots(keys).length > 0 && " 🎙 키는 방 주인이 녹음한 소리예요."}
        </p>
      )}

      {owner && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="garden-diary-btn min-h-[44px]"
            aria-pressed={picking}
            onClick={() => {
              gardenFeedback("tap");
              setMode(picking ? "play" : "pick");
            }}
          >
            {picking ? "그만 고르기" : "✏️ 키 고치기"}
          </button>
          {!confirmReset ? (
            <button type="button" className="garden-diary-btn is-quiet min-h-[44px]" onClick={() => setConfirmReset(true)}>
              처음으로
            </button>
          ) : (
            <div className="garden-key-note w-full">
              <p>키 넷의 그림과 소리를 처음으로 되돌려요. 녹음한 목소리도 지워져요.</p>
              <div className="mt-2 flex gap-2">
                <button type="button" className="garden-diary-btn min-h-[44px]" disabled={busy} onClick={() => void reset()}>
                  되돌리기
                </button>
                <button type="button" className="garden-diary-btn is-quiet min-h-[44px]" onClick={() => setConfirmReset(false)}>
                  그만두기
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!owner && gid && uid && (
        <div className="mt-3 border-t border-dotted border-[var(--d-line)] pt-2">
          <button
            type="button"
            className="min-h-[44px] text-[12.5px] font-bold text-smoke underline underline-offset-2"
            onClick={() => {
              gardenFeedback("tap");
              reportKeys(uid, gid)
                .then(() => say("신고했어요 · 운영자가 살펴봐요"))
                .catch((error) => {
                  console.error("[keyboard] 신고하지 못했다", error);
                  say("신고하지 못했어요. 잠시 뒤 다시 해 보세요");
                });
            }}
          >
            🚩 그림이나 소리가 불편하면 신고하기
          </button>
        </div>
      )}

      {!owner && admin && gid && (
        <div className="garden-key-note mt-3">
          <p className="font-bold">운영자</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className="garden-diary-btn min-h-[44px]"
              disabled={busy}
              onClick={() => {
                setBusy(true);
                setKeysHidden(gid, !hidden)
                  .then(() => {
                    setHidden(!hidden);
                    say(hidden ? "가리기를 풀었어요" : "키보드를 가렸어요");
                  })
                  .catch((error) => {
                    console.error("[keyboard] 가리지 못했다", error);
                    say("가리지 못했어요");
                  })
                  .finally(() => setBusy(false));
              }}
            >
              {hidden ? "가리기 풀기" : "키보드 가리기"}
            </button>
            {ownerUid && recSlots(keys).length > 0 && (
              <button
                type="button"
                className="garden-diary-btn is-quiet min-h-[44px]"
                disabled={busy}
                onClick={() => {
                  setBusy(true);
                  deleteKeyRecs(ownerUid, recSlots(keys).map((slot) => ({ slot, ver: keys[slot].ver })))
                    .then(() => say("녹음 파일을 지웠어요"))
                    .catch((error) => {
                      console.error("[keyboard] 녹음을 지우지 못했다", error);
                      say("녹음을 지우지 못했어요");
                    })
                    .finally(() => setBusy(false));
                }}
              >
                녹음 파일 지우기
              </button>
            )}
          </div>
        </div>
      )}
    </Sheet>
  );
}
