/**
 * 업적 기념관·사진첩의 모양 — 클라이언트와 서버가 함께 쓴다(docs/garden-achievement-strategy.md §3).
 * 만드는 쪽은 build.ts(서버, 콘텐츠를 읽는다), 보는 쪽은 /garden/memorial.json을 받아 그린다.
 */

/** 업적의 진행. 성과 카드(milestones)가 이 업적에 이어져 있을 때만 안다 — 없으면 null(모른다). */
export type SouvenirStatus = "done" | "ongoing" | "planned";

export const SOUVENIR_STATUS_LABEL: Record<SouvenirStatus, string> = {
  done: "완료",
  ongoing: "추진 중",
  planned: "계획",
};

/** 품종표에 싣는 작은 표 — 방에 놓인 기념품을 그릴 때 따로 받지 않아도 되게. */
export interface Memento {
  icon: string;
  status: SouvenirStatus | null;
}

/** 한 줄 사실. 업적의 핵심 숫자(keyNumbers) 하나와 그 근거 claim. */
export interface MemorialFact {
  label: string;
  /** "1,166억 달러"처럼 화면에 쓰는 값. */
  value: string;
  caption?: string;
  /** 근거 앵커 `<업적slug>#<claimId>`. */
  anchor: string;
  /** claim의 층. CLAIM이면 누구의 주장인지(by)를 함께 쓴다. */
  type: "FACT" | "CLAIM" | "INTERPRETATION" | "OPINION";
  by?: string;
  verified: boolean;
}

export interface MemorialQuizOption {
  text: string;
  answer: boolean;
  /** 이 보기가 나온 업적. 오답이면 "이건 「…」의 숫자예요"라고 알려 준다. */
  from: string;
  href: string;
}

export interface MemorialEntry {
  slug: string;
  /** 품종 id(a:<slug>). */
  speciesId: string;
  title: string;
  kicker: string;
  subtitle: string;
  summary: string;
  href: string;
  icon: string;
  status: SouvenirStatus | null;
  photo: {
    src: string;
    /** illustration=설명용 AI 삽화(실제 장면이 아니다), card=이 업적의 공유 카드. */
    kind: "illustration" | "card";
    alt: string;
  };
  /** 핵심 숫자 셋까지 — 대표 숫자가 먼저. */
  facts: MemorialFact[];
  /** 반론이 있으면 첫 물음 하나와 그 자리. 사진첩 카드에 같은 크기로 붙인다. */
  counter?: { text: string; href: string };
  quiz: {
    question: string;
    options: MemorialQuizOption[];
    /** 맞혔든 틀렸든 보이는 풀이. 근거 앵커와 함께. */
    explain: string;
    anchor: string;
  };
}
