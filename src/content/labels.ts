import type { AssertionType, Category, MilestoneStatus, SourceType } from "./schema";

/**
 * 문장의 층. 화면과 공유 카드가 같은 말을 써야 한다 —
 * 서랍에서는 "주장"인데 카드에서는 "CLAIM"으로 나가면 안 된다.
 */
export const ASSERTION_LABEL: Record<AssertionType, string> = {
  FACT: "사실",
  CLAIM: "주장",
  INTERPRETATION: "해석",
  OPINION: "의견",
};

/*
 * 문장의 층에 붙는 색.
 *
 * 말이 labels.ts에 있으므로 색도 여기 둔다 — 서랍과 카르텔 카드가 따로 제
 * 표를 들고 있으면 "주장"이 한쪽에서는 버건디, 한쪽에서는 회색이 된다.
 * 사실은 navy, 주장은 burgundy다. 확정되지 않은 말에 확정된 색을 주지 않는다.
 */
export const ASSERTION_STYLE: Record<AssertionType, string> = {
  FACT: "bg-navy-tint text-navy ring-navy/25",
  CLAIM: "bg-burgundy-tint text-burgundy ring-burgundy/25",
  INTERPRETATION: "bg-taupe text-graphite ring-stone",
  OPINION: "bg-taupe text-graphite ring-stone",
};

export const CATEGORY_LABEL: Record<Category, string> = {
  economy: "경제·물류",
  welfare: "복지",
  labor: "노동",
  health: "보건",
  environment: "환경·안전",
  fisheries: "수산",
  region: "지역균형",
  diplomacy: "외교·안보",
  science: "과학기술",
  education: "교육",
  culture: "문화·체육",
};

/**
 * 상태 표기.
 *
 * 계획을 성과처럼 보이게 하지 않는 것이 이 레이어의 신뢰를 좌우한다.
 * 그래서 "계획"에도 또렷한 색을 주고 숨기지 않는다.
 */
export const STATUS_LABEL: Record<MilestoneStatus, string> = {
  done: "완료",
  ongoing: "추진 중",
  planned: "계획",
};

export const STATUS_STYLE: Record<MilestoneStatus, string> = {
  done: "bg-ink text-eggshell ring-ink",
  ongoing: "bg-taupe text-graphite ring-stone",
  planned: "bg-transparent text-smoke ring-stone",
};

export const SOURCE_TYPE_LABEL: Record<SourceType, string> = {
  official: "정부·공공 공식 자료",
  statistics: "통계 자료",
  legislative: "국회·의회 자료",
  judicial: "판결·수사 자료",
  interview: "인터뷰·발언",
  press: "언론 보도",
  research: "연구 자료",
};

/** 1차 자료와 언론 보도를 한눈에 구분한다. 같은 무게로 보이면 안 된다. */
export const SOURCE_TYPE_TIER: Record<SourceType, "primary" | "secondary"> = {
  official: "primary",
  statistics: "primary",
  legislative: "primary",
  judicial: "primary",
  research: "primary",
  interview: "secondary",
  press: "secondary",
};

export function formatDate(date: string, precision: string): string {
  if (precision === "year") return `${date}년`;
  if (precision === "month") {
    const [y, m] = date.split("-");
    return m ? `${y}년 ${Number(m)}월` : `${y}년`;
  }
  /*
   * 일 단위. 여기가 없어서 "2026-06-29"가 그대로 찍혔다.
   *
   * 기존 성과 카드가 연·월까지만 써서 드러나지 않던 구멍이다. 업적 쪽은
   * displayDate에 "2026년 9월 19일"이라고 직접 적어 두므로 표기가 갈렸다.
   */
  if (precision === "day") {
    const [y, m, d] = date.split("-");
    if (y && m && d) return `${y}년 ${Number(m)}월 ${Number(d)}일`;
    return date;
  }
  if (precision === "circa") return `${date}년경`;
  if (precision === "unknown") return "시점 미상";
  return date;
}
