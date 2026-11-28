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

/** 말의 뼈대의 세 역할. */
export type SpeechRole = "claim" | "reason" | "example";

export const SPEECH_ROLE_LABEL: Record<SpeechRole, string> = { claim: "주장", reason: "근거", example: "예시" };

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
  /** 단원 id. 업적이면 `a:<slug>`, 정부 정책이면 `p:<slug>`, 언행이면 `w:<slug>`. */
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
  /**
   * ox = O/X(알기), choice = 보기 고르기(가리기부터), debate = 쟁점에 답하기(답하기),
   * say = 직접 말하기·쓰기(말하기), parts = 말의 뼈대 가르기(말하기).
   */
  kind: "ox" | "choice" | "debate" | "say" | "parts";
  /** O/X 문항의 문장, 보기 문항의 문장(사실·주장 가리기)이나 질문(숫자 읽기). */
  statement: string;
  /** O/X 문항의 답. 보기 문항은 늘 true다(문장 자체는 근거가 있는 말이다). */
  answer: boolean;
  /** 보기 문항 — 보기와 정답 번호, 어디서 듣는 말인지. */
  choice?: {
    prompt: string;
    from?: string;
    /** 함께 보여 주는 근거(제목과 근거 문항의 원자료 문장). */
    evidence?: string;
    options: Array<{ label: string; hint: string }>;
    correct: number;
  };
  /**
   * 쟁점 문항(4단계 답하기) — 지인 메시지에 ① 답의 뼈대 ② 근거를 고르고 ③ 모범 답변을 본다. 둘 다 맞아야 맞힌 것이다.
   */
  debate?: {
    message: string;
    skeleton: { options: Array<{ label: string; hint: string }>; correct: number; why: string };
    evidence: { options: string[]; correct: number };
    /** 모범 답변 — 위키 반론의 답변 그대로. */
    response: string;
    /** 원본 반론 자리. */
    href: string;
  };
  /**
   * 직접 말하기·쓰기(5단계) — 지인 메시지에 내 말로 답하고, 모범 답변과 네 칸 점검표로 스스로 견준다.
   * ★ AI가 채점하지 않는다(docs/jamgong-roadmap.md §8). 쓴 글은 기기에만 둔다(sayStore.ts).
   */
  say?: {
    message: string;
    /** 모범 답변 — 4단계 문항의 모범 답 그대로. */
    response: string;
    href: string;
  };
  /**
   * 말의 뼈대(5단계) — 연설·글의 이어진 문장을 주장·근거·예시로 가른다. 나눈 것은 편집자다(src/content/study/speech.ts).
   */
  parts?: {
    sentences: Array<{ text: string; role: SpeechRole }>;
    why: string;
    href: string;
  };
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
