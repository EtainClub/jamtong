"use client";

import { useState } from "react";

import { KakaoShareButton } from "@/features/app/KakaoShareButton";
import { firebaseConfigured } from "@/lib/firebase/client";

import { gardenFeedback } from "./feedback";
import { gardenLink, sendGardenLink } from "./share";

/**
 * 정원 머리의 공유 — 보고 있는 정원 주인의 링크(/g/<공개id>)를 건넨다.
 *
 * ★ /garden 주소가 아니라 /g/<공개id>를 보낸다. 받는 사람의 미리보기에 그 정원의
 *   자랑 카드가 뜨고, 누르면 그 정원으로 놀러 간다.
 *   친구 정원에 놀러 와 있으면 친구의 링크다.
 * ★ 내 정원이 아직 비공개면 보내지 않는다. 공개는 직접 켠다(docs/garden-game.md §1) —
 *   자랑하기 칸을 열어 무엇이 보이는지 먼저 읽게 하고, 거기서 한 번에 켜고 보낸다.
 * ★ 파이어베이스가 없는 환경에는 공개 정원이 없으므로 정원 주소를 보낸다.
 */
export function GardenShareButton({
  nick,
  shareId,
  shareOn,
  visit,
  onNeedPublic,
  say,
}: {
  nick: string;
  shareId: string | null;
  shareOn: boolean;
  /** 놀러 와 있는 친구 정원의 공개 id. */
  visit: string | null;
  /** 내 정원이 비공개일 때. 자랑하기 칸을 연다. */
  onNeedPublic: () => void;
  say: (text: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const target = (): string | null => {
    if (visit) return gardenLink(visit);
    if (!firebaseConfigured) return `${window.location.origin}/garden`;
    return shareOn && shareId ? gardenLink(shareId) : null;
  };
  const ready = Boolean(visit) || !firebaseConfigured || (shareOn && Boolean(shareId));

  const onShare = async () => {
    gardenFeedback("tap");
    const url = target();
    if (!url) {
      onNeedPublic();
      say("정원을 공개하면 내 정원 링크를 보낼 수 있어요");
      return;
    }
    const result = await sendGardenLink(
      url,
      visit ? "친구의 잼통 정원" : `${nick}의 잼통 정원`,
      visit ? "이 정원에 물 주러 가요 🌱" : "내 정원에 물 주러 와요 🌱",
    );
    if (result === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } else if (result === "failed") {
      say("링크를 복사하지 못했어요");
    }
  };

  return (
    <span className="inline-flex shrink-0 items-center gap-1.5">
      {/* 카톡은 보낼 링크가 정해졌을 때만. 비공개 정원의 /garden 주소가 나가지 않게. */}
      {ready && <KakaoShareButton getUrl={() => target() ?? ""} surface="garden" compact />}
      <button
        type="button"
        onClick={() => void onShare()}
        aria-label={visit ? "이 정원 링크 공유하기" : "내 정원 링크 공유하기"}
        className="garden-pill"
      >
        <span aria-hidden="true">↗</span>
        {copied ? "링크를 복사했어요" : "공유"}
        <span className="sr-only" aria-live="polite">
          {copied ? "정원 링크를 복사했습니다" : ""}
        </span>
      </button>
    </span>
  );
}
