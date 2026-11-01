"use client";

import { useState } from "react";

import { track } from "@/lib/analytics";

/**
 * 카카오톡으로 보내기.
 *
 * ★ 이 사이트의 첫째 쓰임은 "지인에게 근거로 보내기"이고, 한국에서 그
 *   길은 대개 카카오톡이다. 링크 복사 → 대화방 붙여 넣기의 두 걸음을 한
 *   걸음으로 줄인다.
 *
 * ★ 키가 없으면 단추도 없다.
 *   `NEXT_PUBLIC_KAKAO_JS_KEY`(카카오 개발자 콘솔의 JavaScript 키)를 넣은
 *   빌드에서만 보인다. 키 없이 누르면 SDK가 실패하고, 실패한 공유 단추는
 *   없는 것보다 나쁘다.
 *
 * ★ SDK는 누를 때 내려받는다.
 *   첫 화면에 카카오 스크립트를 싣지 않는다. 공유하지 않는 사람에게 값을
 *   치우게 하지 않는다 — 계측을 늦게 붙이는 것과 같은 이유다.
 *
 * ★ 카드 모양은 우리 OG 이미지가 정한다(sendScrap).
 *   템플릿을 따로 그리면 공유 카드와 카톡 카드가 갈라진다. 카카오가 페이지의
 *   og 태그를 긁어 카드를 만든다. 그래서 콘솔의 Web 플랫폼에 jamtong.kr이
 *   등록돼 있어야 한다.
 */

const KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
const SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";
const SDK_SRI = "sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka";

interface KakaoSdk {
  init(key: string): void;
  isInitialized(): boolean;
  Share: { sendScrap(options: { requestUrl: string }): void };
}

declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}

let loading: Promise<KakaoSdk> | null = null;

function loadKakao(key: string): Promise<KakaoSdk> {
  if (loading) return loading;
  loading = new Promise<KakaoSdk>((resolve, reject) => {
    const ready = () => {
      const kakao = window.Kakao;
      if (!kakao) return reject(new Error("카카오 SDK를 불러오지 못했습니다."));
      if (!kakao.isInitialized()) kakao.init(key);
      resolve(kakao);
    };
    if (window.Kakao) return ready();
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.integrity = SDK_SRI;
    script.crossOrigin = "anonymous";
    script.async = true;
    script.onload = ready;
    script.onerror = () => reject(new Error("카카오 SDK를 불러오지 못했습니다."));
    document.head.appendChild(script);
  }).catch((e) => {
    loading = null; // 다음 누름에서 다시 시도한다.
    throw e;
  });
  return loading;
}

export const kakaoShareEnabled = Boolean(KEY);

export function KakaoShareButton({
  getUrl,
  surface,
  compact = false,
}: {
  /** 누르는 순간의 주소. 업적 화면은 장면 상태를 주소에 싣기 때문에 미리 정할 수 없다. */
  getUrl: () => string;
  surface: string;
  compact?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (!KEY) return null;

  const onClick = async () => {
    track("share_create", { surface, channel: "kakao" });
    try {
      const kakao = await loadKakao(KEY);
      kakao.Share.sendScrap({ requestUrl: getUrl() });
      setFailed(false);
    } catch {
      setFailed(true);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="카카오톡으로 보내기"
      title={failed ? "카카오톡을 열지 못했습니다. 링크 복사를 써 주세요." : "카카오톡으로 보내기"}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#FEE500] py-2 text-sm font-semibold text-[#191919] transition-opacity hover:opacity-90 ${
        compact ? "px-2.5 sm:px-3.5" : "px-3.5"
      }`}
    >
      <KakaoMark />
      <span className={compact ? "hidden sm:inline" : undefined}>
        {failed ? "다시 시도" : "카톡"}
      </span>
    </button>
  );
}

/** 말풍선. 카카오 로고 지침대로 검은 말풍선을 노란 바탕에 둔다. */
function KakaoMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#191919"
        d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.86 5.32 4.66 6.74l-.95 3.49c-.08.3.26.54.52.37l4.13-2.74c.54.06 1.08.1 1.64.1 5.52 0 10-3.58 10-8S17.52 3 12 3z"
      />
    </svg>
  );
}
