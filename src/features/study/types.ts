/**
 * 잼공(매일 공부)의 모양 — 서버(build.ts)와 화면이 함께 쓴다. 설계는 docs/daily-study.md.
 *
 * 문항 은행은 서버가 콘텐츠에서 만들어 페이지로 내려 준다. 콘텐츠 전체는 클라이언트로 보내지 않는다.
 */
import type { EraId } from "./eras";

/** 길(코스). 지금은 업적의 길만 문항이 있다 — 나머지는 화면에서 "준비 중". */
export type CourseId = "achievement" | "policy" | "words" | "cartel";

/**
 * 다섯 단계 — 배우는 사람의 단계이자 문항의 단계다(docs/jamgong-roadmap.md §3).
 * 알기(1차 목적: 기초 사실) → 가리기 → 따지기 → 답하기 → 말하기(지향점). 지금 문항이 있는 것은 알기뿐이다.
 * id는 1판의 단원 단계 이름(know…speak)을 그대로 둔다 — 저장된 기록과 문항이 이 id를 쓴다.
 */
export type StepId = "know" | "understand" | "source" | "counter" | "speak";
export type Level = 1 | 2 | 3 | 4 | 5;

export const STEPS: Array<{ id: StepId; level: Level; icon: string; label: string; can: string }> = [
  { id: "know", level: 1, icon: "🌱", label: "알기", can: "무엇을 한 정책인지 말하고, 근거가 어디 있는지 안다" },
  { id: "understand", level: 2, icon: "🌿", label: "가리기", can: "들은 문장이 확인된 사실인지, 누구의 주장인지, 해석인지 가른다" },
  { id: "source", level: 3, icon: "🔍", label: "따지기", can: "아직 확인 안 된 것, 자료의 무게, 비약과 과장된 제목을 짚는다" },
  { id: "counter", level: 4, icon: "⚖️", label: "답하기", can: "공격 질문에 인정할 것은 인정하고 근거로 답한다" },
  { id: "speak", level: 5, icon: "💬", label: "말하기", can: "처음 보는 쟁점에 30초 안에 근거 하나를 붙여 말한다" },
];

export const LEVEL_OF: Record<StepId, Level> = { know: 1, understand: 2, source: 3, counter: 4, speak: 5 };

/**
 * 기술 — 문항마다 하나(docs/jamgong-roadmap.md §3 표). 지금은 A0(내용 알기)뿐이다.
 * A 사실 판단 · B 논리 · C 비난 대응.
 */
export type Skill = "A0" | "A1" | "A2" | "A3" | "A4" | "B1" | "B2" | "B3" | "C1" | "C2" | "C3" | "C4";

export type AssertionKind = "FACT" | "CLAIM" | "INTERPRETATION" | "OPINION";

/** 근거노트에 들어가는 카드 한 장 — O 문항(참인 문장)에서만 만든다. X 문항(헷갈리기 쉬운 문장)은 싣지 않는다. */
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
  skill: Skill;
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
  /**
   * 첫 3분의 세 문제(docs/jamgong-roadmap.md §4) — 서로 다른 단원의 O 문항 가운데 문장과 풀이가 짧은 것.
   * 처음 온 사람이 가볍게 맞히고 근거 카드를 받게 한다.
   */
  starter: string[];
}
