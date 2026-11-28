/**
 * 잼공(매일 공부)의 모양 — 서버(build.ts)와 화면이 함께 쓴다. 설계는 docs/daily-study.md.
 *
 * 문항 은행은 서버가 콘텐츠에서 만들어 페이지로 내려 준다. 콘텐츠 전체는 클라이언트로 보내지 않는다.
 */
import type { EraId } from "./eras";

/** 길(코스). 지금은 업적의 길만 문항이 있다 — 나머지는 화면에서 "준비 중". */
export type CourseId = "achievement" | "policy" | "words" | "cartel";

/** 단원의 다섯 단계(§4.1). 지금 문항이 있는 것은 know(알기)뿐이다. */
export type StepId = "know" | "understand" | "source" | "counter" | "speak";

export const STEPS: Array<{ id: StepId; icon: string; label: string }> = [
  { id: "know", icon: "🌱", label: "알기" },
  { id: "understand", icon: "🌿", label: "이해" },
  { id: "source", icon: "🔍", label: "출처" },
  { id: "counter", icon: "⚖️", label: "반론" },
  { id: "speak", icon: "💬", label: "말하기" },
];

export type AssertionKind = "FACT" | "CLAIM" | "INTERPRETATION" | "OPINION";

/** 근거노트에 들어가는 카드 한 장 — O 문항(참인 문장)에서만 만든다. X 문항(흔한 오해)은 싣지 않는다. */
export interface EvidenceCard {
  text: string;
  /** 근거 claim들 가운데 가장 약한 층. CLAIM이면 누구의 주장인지(by)를 함께 쓴다. */
  type: AssertionKind;
  by?: string;
  /** 위키 앵커 `<업적slug>#<claimId>`. */
  anchor: string;
}

export interface StudyUnit {
  /** 단원 id. 업적이면 `a:<slug>`. */
  id: string;
  course: CourseId;
  /** 업적이 선 시기(eras.ts) — 길은 성남시장 → 경기도지사 → 이재명 정부 순서다. */
  era: EraId;
  eraLabel: string;
  title: string;
  kicker: string;
  /** 원본 페이지. */
  href: string;
}

export interface StudyItem {
  /** 영구 id `<단원 id>/<문항 id>` — 상자 기록이 이 id에 붙는다. 문장을 크게 고치면 새 id를 쓴다. */
  id: string;
  unit: string;
  step: StepId;
  kind: "ox";
  statement: string;
  answer: boolean;
  explain: string;
  /** 근거 앵커. 하나 이상. */
  anchors: string[];
  card: EvidenceCard | null;
}

export interface StudyBank {
  units: StudyUnit[];
  items: StudyItem[];
}
