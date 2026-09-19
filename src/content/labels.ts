import type { Category, MilestoneStatus, SourceType } from "./schema";

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
  if (precision === "circa") return `${date}년경`;
  if (precision === "unknown") return "시점 미상";
  return date;
}
