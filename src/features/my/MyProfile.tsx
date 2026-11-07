"use client";

import { useRef, useState } from "react";

import { useAuth, type Account } from "@/lib/firebase/auth";
import { isUploadedAvatar } from "@/lib/firebase/avatar";
import { renameMyPlaques } from "@/lib/firebase/blooms";
import { saveGarden } from "@/lib/firebase/garden";
import { NICK_MAX } from "@/features/garden/rules";
import { readPendingNick, renameStoredGarden, writePendingNick, type GardenData } from "@/features/garden/store";

/**
 * MY 프로필 카드의 머리 — 사진과 닉네임.
 *
 * ★ 닉네임은 정원 이름이다. 남에게 보이는 이름은 하나뿐이어야 한다(꽃밭 명패, 공개 정원).
 *   구글 계정 이름을 쓰지 않는다 — 대개 실명이다.
 * ★ 사진은 내 화면(상단 단추, MY)에만 쓴다. 공개 자리에는 싣지 않는다(avatar.ts).
 */
export function MyProfile({
  user,
  garden,
  onGarden,
  badge,
}: {
  user: Account | null;
  garden: GardenData | null | undefined;
  onGarden: (next: GardenData) => void;
  badge: React.ReactNode;
}) {
  const { setPhoto, clearPhoto } = useAuth();
  const file = useRef<HTMLInputElement>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [pending, setPending] = useState(() => (typeof window === "undefined" ? null : readPendingNick()));
  const [message, setMessage] = useState<{ text: string; warn?: boolean } | null>(null);

  const nick = garden?.nick ?? pending ?? null;
  const uploaded = user ? isUploadedAvatar(user.photoURL, user.uid) : false;

  const pick = async (f: File | undefined) => {
    if (!f) return;
    setPhotoBusy(true);
    setMessage(null);
    try {
      await setPhoto(f);
      setMessage({ text: "사진을 바꿨어요. 내 화면에만 보여요" });
    } catch (error) {
      console.error("[my] 사진을 올리지 못했다", error);
      const reason = (error as Error).message;
      setMessage({
        text:
          reason === "not-image"
            ? "그림 파일만 올릴 수 있어요"
            : reason === "too-large"
              ? "20MB보다 작은 사진을 골라 주세요"
              : "사진을 올리지 못했어요. 잠시 뒤 다시 해 보세요",
        warn: true,
      });
    } finally {
      setPhotoBusy(false);
      if (file.current) file.current.value = "";
    }
  };

  const reset = async () => {
    setPhotoBusy(true);
    setMessage(null);
    try {
      await clearPhoto();
    } catch (error) {
      console.error("[my] 사진을 내리지 못했다", error);
      setMessage({ text: "사진을 내리지 못했어요. 잠시 뒤 다시 해 보세요", warn: true });
    } finally {
      setPhotoBusy(false);
    }
  };

  const save = async () => {
    if (draft === null) return;
    setMessage(null);
    if (garden) {
      const next = renameStoredGarden(garden, user?.uid ?? null, draft);
      if (!next) return;
      onGarden(next);
      setDraft(null);
      if (user) {
        try {
          await saveGarden(user.uid, next);
        } catch (error) {
          console.error("[my] 정원 이름을 계정에 저장하지 못했다", error);
          setMessage({ text: "이 기기에는 바꿨지만 계정에 저장하지 못했어요. 정원을 열면 다시 맞춰져요", warn: true });
          return;
        }
      }
      if (!user) {
        setMessage({ text: "닉네임을 바꿨어요" });
        return;
      }
      try {
        const { changed, failed } = await renameMyPlaques(user.uid, next.nick);
        setMessage({
          text: failed
            ? "닉네임을 바꿨어요. 꽃밭 명패 일부는 다음에 가꿀 때 바뀌어요"
            : changed
              ? `닉네임을 바꿨어요. 꽃밭 명패 ${changed}개도 새 이름이에요`
              : "닉네임을 바꿨어요",
        });
      } catch (error) {
        console.error("[my] 명패 이름을 바꾸지 못했다", error);
        setMessage({ text: "닉네임을 바꿨어요. 꽃밭 명패는 다음에 가꿀 때 바뀌어요" });
      }
    } else {
      const clean = writePendingNick(draft);
      if (!clean) return;
      setPending(clean);
      setDraft(null);
      setMessage({ text: "정원을 시작하면 이 이름으로 시작해요" });
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => file.current?.click()}
          disabled={!user || photoBusy}
          aria-label="프로필 사진 바꾸기"
          className="group relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-stone bg-stone disabled:opacity-60"
        >
          {user?.photoURL ? (
            // 우리 버킷이나 구글의 이미지. next/image 도메인을 늘리지 않고 그대로 싣는다.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
          ) : (
            <span aria-hidden="true" className="flex h-full w-full items-center justify-center text-[18px] font-bold text-smoke">
              {(nick ?? "잼").slice(0, 1)}
            </span>
          )}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 bg-ink/60 py-0.5 text-center text-[9.5px] font-semibold text-eggshell"
          >
            {photoBusy ? "…" : "사진"}
          </span>
        </button>
        <input
          ref={file}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void pick(e.target.files?.[0])}
        />

        <div className="min-w-0 flex-1">
          {draft === null ? (
            <div className="flex items-center gap-2">
              <p className="truncate text-[15px] font-semibold text-ink">{nick ?? "닉네임을 정해 주세요"}</p>
              <button
                type="button"
                onClick={() => setDraft(nick ?? "")}
                className="shrink-0 rounded-full border border-stone px-2 py-0.5 text-[11px] font-medium text-smoke transition-colors hover:border-graphite hover:text-navy"
              >
                {nick ? "바꾸기" : "정하기"}
              </button>
            </div>
          ) : (
            <form
              className="flex gap-1.5"
              onSubmit={(e) => {
                e.preventDefault();
                void save();
              }}
            >
              <input
                autoFocus
                aria-label="닉네임"
                value={draft}
                maxLength={NICK_MAX}
                onChange={(e) => setDraft(e.target.value)}
                className="min-w-0 flex-1 rounded-full border border-stone bg-canvas px-3 py-1 text-[13px] focus:border-graphite focus:outline-none"
              />
              <button
                type="submit"
                disabled={!draft.trim() || draft.trim() === nick}
                className="shrink-0 rounded-full bg-ink px-3 py-1 text-[12px] font-semibold text-eggshell disabled:opacity-35"
              >
                저장
              </button>
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="shrink-0 rounded-full px-2 py-1 text-[12px] text-ash hover:text-smoke"
              >
                취소
              </button>
            </form>
          )}
          <div className="mt-1">{badge}</div>
        </div>
      </div>

      {draft !== null && (
        <p className="mt-2 text-[11px] leading-relaxed text-ash">
          정원 이름과 같아요. 정원지기가 되면 꽃밭 명패에 걸려 모두에게 보여요. 실명은 쓰지 마세요. {NICK_MAX}자까지.
        </p>
      )}
      {uploaded && !photoBusy && (
        <button type="button" onClick={() => void reset()} className="mt-2 text-[11px] font-medium text-ash underline underline-offset-2 hover:text-smoke">
          올린 사진 내리기
        </button>
      )}
      {message && (
        <p className={`mt-2 text-[11.5px] leading-relaxed ${message.warn ? "text-pending" : "text-smoke"}`}>{message.text}</p>
      )}
    </div>
  );
}
