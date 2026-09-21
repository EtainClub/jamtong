"use client";

import { analyticsConfigured, firebaseApp } from "@/lib/firebase/client";

/**
 * 계측 (설계서 41장).
 *
 * ★ 세는 것은 조회수가 아니다.
 *   설계서가 중요하다고 적은 지표는 근거를 열었는가, 연표를 직접 움직였는가,
 *   공유했는가, 물었는가다. 그래서 다섯만 센다 — 페이지뷰는 파이어베이스가
 *   알아서 보내고, 우리가 더 붙일 것은 "이해에 닿았는가"의 흔적뿐이다.
 *
 * ★ 사람이 쓴 글은 보내지 않는다.
 *   질문 문장은 파라미터에 담지 않는다. 길이와 근거가 붙었는지만 보낸다.
 *   그것으로 "질문이 답에 닿는가"는 알 수 있고, 무엇을 물었는지는 우리가
 *   알 자리가 아니다.
 *
 * ★ 측정 ID가 없으면 아무 일도 하지 않는다.
 *   `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`를 넣은 환경에서만 모듈을 내려받고
 *   붙인다. 넣지 않으면 계측 스크립트도 쿠키도 없다. 그래서 이 파일은 켜고
 *   끄는 스위치가 아니라 **없으면 없는 기능**이다.
 *
 * 모듈은 첫 이벤트에서 한 번 동적으로 내려받는다. 첫 화면에 계측을 실어
 * 보내지 않는다 — 들어와서 아무것도 하지 않고 나가는 사람에게는 값을
 * 치우게 하지 않는다.
 */

export type AnalyticsEvent =
  /**
   * 지금 이 화면의 링크를 만들었다.
   * surface: achievement | words | book(자서전 한 권) | chapter(그 안의 장)
   */
  | "share_create"
  /** 주장 옆의 근거를 열었다. 이 사이트에서 가장 중요한 한 번이다. */
  | "evidence_open"
  /** 연표를 직접 움직였다. 스크롤로 흘러간 것은 세지 않는다. */
  | "timeline_seek"
  /** 물었다. surface: guide(화면 안내) | wiki(위키에 묻기) */
  | "agent_question"
  /** 답이 화면을 움직였다. */
  | "agent_action";

type Params = Record<string, string | number | boolean>;

type Logger = (name: string, params?: Params) => void;

let logger: Promise<Logger | null> | null = null;

function load(): Promise<Logger | null> {
  if (typeof window === "undefined" || !analyticsConfigured) return Promise.resolve(null);

  logger ??= import("firebase/analytics")
    .then(async (mod) => {
      /* 지원하지 않는 환경이 있다. 사파리 비공개 창, 쿠키를 막은 브라우저. */
      if (!(await mod.isSupported())) return null;
      const instance = firebaseApp();
      if (!instance) return null;
      const analytics = mod.getAnalytics(instance);
      return (name: string, params?: Params) => mod.logEvent(analytics, name, params);
    })
    .catch(() => null);

  return logger;
}

/**
 * 한 번 센다.
 *
 * 실패해도 조용하다. 계측이 화면을 멈추게 하면 안 된다 — 이 사이트의
 * 부속이지 본체가 아니다.
 */
export function track(event: AnalyticsEvent, params?: Params): void {
  void load().then((log) => log?.(event, params));
}
