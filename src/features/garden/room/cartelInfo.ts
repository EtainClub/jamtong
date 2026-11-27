/** 카르텔 카드 시트가 받는 요약(/garden/cartels.json). 글은 모두 content/cartels의 것이다. */
export interface CartelCardInfo {
  slug: string;
  name: string;
  summary: string;
  /** 담을 것이 하나라도 있는가(content/cartels의 isOpen). 없으면 "정리 전". */
  open: boolean;
  progress: { done: number; ongoing: number; planned: number; total: number };
  problems: Array<{ headline?: string; text: string }>;
}
