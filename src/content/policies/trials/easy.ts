import type { Policy } from "../schema";
import { TRIAL_POLICIES, TRIALS } from "./index";

/**
 * 대통령 재판 — 쉽게 보기(인포그래픽 카드)용 데이터.
 *
 * 원문 보기의 문장을 줄여 그림으로 옮긴다. 줄이는 과정에서 편집자의 말이
 * 끼어들기 가장 쉬우므로 규칙은 하나다.
 *
 * ★ 카드에 찍히는 글자는 모두 claim 원문에서 글자 그대로 떼어 온다.
 *   단계의 결과(`result`), 큰 숫자(`value`), 맞서는 말(`text`)은 가리키는 claim의
 *   원문에 그대로 있어야 하고, 아래 검사가 빌드에서 확인한다. 단계 이름("1심")과
 *   칸 이름("검찰")만 편집자가 붙이는 이름표다 — 단정이 아니라 자리를 가리킨다.
 *
 * ★ 숫자는 누구의 숫자인지와 함께 쓴다.
 *   금액은 거의 다 검찰이 주장한 액수다. `who`를 빠뜨리면 큰 숫자만 남아 확정액처럼
 *   읽힌다.
 */

export type StepState = "done" | "stopped" | "todo";

export interface EasyStep {
  /** 이름표. "기소", "1심" 같은 자리 이름. */
  label: string;
  state: StepState;
  /** 그 단계의 결과. claim 원문에서 떼어 온다. */
  result?: string;
  claimId?: string;
}

export interface EasyNumber {
  label: string;
  /** 누구의 숫자인가. "검찰 주장", "법원 판단" 같은 이름표. */
  who: string;
  value: string;
  claimId: string;
}

export interface EasyPart {
  label: string;
  /** 막대 길이 계산용(만 원). 화면 글자는 value다. */
  amount: number;
  value: string;
  claimId: string;
}

export type Side = "prosecution" | "defense" | "court" | "other";

export interface EasyVoice {
  side: Side;
  /** 칸 이름. "검찰", "대통령 측", "법원", "경찰" 같은 이름표. */
  label: string;
  text: string;
  claimId: string;
}

export interface TrialEasy {
  slug: string;
  steps: EasyStep[];
  numbers: EasyNumber[];
  /** 한 금액을 나눈 내역. 쌓은 막대로 그린다. */
  breakdown?: { title: string; parts: EasyPart[] };
  voices: EasyVoice[];
}

export const TRIAL_EASY: TrialEasy[] = [
  {
    slug: "trial-election-law",
    steps: [
      { label: "기소", state: "done", result: "2022년 9월 8일", claimId: "claim-charge" },
      { label: "1심", state: "done", result: "징역 1년, 집행유예 2년", claimId: "claim-first" },
      { label: "2심", state: "done", result: "공소사실 전부를 무죄", claimId: "claim-appeal" },
      { label: "대법원", state: "done", result: "유죄 취지의 파기환송", claimId: "claim-remand" },
      { label: "파기환송심", state: "stopped", result: "추후 지정", claimId: "claim-suspended" },
    ],
    numbers: [
      { label: "유죄 취지", who: "대법원 다수의견", value: "10명", claimId: "claim-majority" },
      { label: "처벌할 수 없다", who: "대법원 반대의견", value: "2명", claimId: "claim-dissent" },
    ],
    voices: [
      {
        side: "prosecution",
        label: "검찰",
        text: "공직선거법상 허위사실 공표 혐의로 기소했다",
        claimId: "claim-charge",
      },
      {
        side: "defense",
        label: "대통령 측",
        text: "기본적인 사실인정부터 도저히 수긍하기 어려운 결론",
        claimId: "claim-defense-first",
      },
      {
        side: "court",
        label: "대법원 다수의견",
        text: "실제로는 골프를 쳤으므로 허위라고 봤다",
        claimId: "claim-majority",
      },
      {
        side: "court",
        label: "대법원 반대의견",
        text: "'의심스러울 때는 피고인에게 유리하게'라는 형사법의 기본 원칙에 반한다",
        claimId: "claim-dissent",
      },
      {
        side: "court",
        label: "세 심급 모두",
        text: "골프 발언을 뺀 나머지 김문기 관련 발언은 1심에서 이유무죄, 2심에서 무죄였고, 대법원도 이 부분의 원심 판단을 수긍했다",
        claimId: "claim-knew",
      },
    ],
  },
  {
    slug: "trial-perjury",
    steps: [
      { label: "기소", state: "done", claimId: "claim-charge" },
      { label: "1심", state: "done", result: "1심 무죄", claimId: "claim-acquitted" },
      { label: "2심", state: "stopped", result: "추후 지정", claimId: "claim-suspended" },
      { label: "대법원", state: "todo" },
    ],
    numbers: [
      { label: "구형", who: "검찰", value: "징역 3년", claimId: "claim-prosecution-sentence" },
      { label: "증인 김진성 위증", who: "법원 판단", value: "벌금 500만 원", claimId: "claim-witness" },
    ],
    voices: [
      {
        side: "prosecution",
        label: "검찰",
        text: "거짓 주장을 여러 차례 주입한 수법이 유사 사례를 찾기 어려울 만큼 치밀하다",
        claimId: "claim-prosecution-sentence",
      },
      {
        side: "defense",
        label: "대통령 측",
        text: "불리한 증거를 감추고 짜깁기했다",
        claimId: "claim-defense",
      },
      {
        side: "court",
        label: "1심 법원",
        text: "교사의 고의를 인정할 증거가 부족하다고 판단했다",
        claimId: "claim-reason",
      },
      {
        side: "court",
        label: "1심 법원",
        text: "김진성 씨는 기억에 반하는 일부 증언이 위증으로 인정돼",
        claimId: "claim-witness",
      },
    ],
  },
  {
    slug: "trial-daejang",
    steps: [
      { label: "기소", state: "done", result: "2023년 3월 22일", claimId: "claim-daejang-charge" },
      { label: "1심", state: "stopped", result: "1심 판단 전", claimId: "claim-suspended" },
      { label: "2심", state: "todo" },
      { label: "대법원", state: "todo" },
    ],
    numbers: [
      { label: "대장동 손해", who: "검찰 주장", value: "4,895억 원", claimId: "claim-daejang-charge" },
      { label: "성남FC 후원금", who: "검찰 주장", value: "133억 5천만 원", claimId: "claim-fc-charge" },
      { label: "위례 부당 이득", who: "검찰 주장", value: "211억 원", claimId: "claim-wirye-charge" },
      { label: "백현동 손해", who: "검찰 주장", value: "최소 200억 원", claimId: "claim-baekhyeon-charge" },
    ],
    voices: [
      {
        side: "prosecution",
        label: "검찰",
        text: "민간 사업자에게 유리한 대장동 개발 구조를 승인해",
        claimId: "claim-daejang-charge",
      },
      {
        side: "defense",
        label: "대통령 측",
        text: "5,503억 원을 공익으로 환수한 성과",
        claimId: "claim-defense",
      },
      {
        side: "court",
        label: "영장 판사(백현동)",
        text: "피의자의 관여가 있었다고 볼 만한 상당한 의심이 든다",
        claimId: "claim-warrant",
      },
      {
        side: "court",
        label: "영장 판사(백현동)",
        text: "직접 증거 자체는 부족하다",
        claimId: "claim-warrant",
      },
      {
        side: "court",
        label: "민간업자 재판",
        text: "이 대통령이 관여했는지는 판단하지 않았다",
        claimId: "claim-private-leadership",
      },
    ],
  },
  {
    slug: "trial-north-remittance",
    steps: [
      { label: "기소", state: "done", result: "2024년 6월 12일", claimId: "claim-charge" },
      { label: "1심", state: "stopped", result: "공판준비기일 단계", claimId: "claim-own-stage" },
      { label: "2심", state: "todo" },
      { label: "대법원", state: "todo" },
    ],
    numbers: [
      { label: "스마트팜 사업비", who: "검찰 주장", value: "500만 달러", claimId: "claim-charge" },
      { label: "도지사 방북 비용", who: "검찰 주장", value: "300만 달러", claimId: "claim-charge" },
      {
        label: "불법 자금 인정(이화영 사건)",
        who: "법원 판단",
        value: "394만 달러",
        claimId: "claim-lee-hwayoung",
      },
    ],
    voices: [
      {
        side: "prosecution",
        label: "검찰",
        text: "모두 800만 달러를 대신 내게 했다",
        claimId: "claim-charge",
      },
      {
        side: "defense",
        label: "대통령 측",
        text: "800만 달러는 경기도와 무관하게 쌍방울이 독자적으로 추진한 대북사업 비용",
        claimId: "claim-defense",
      },
      {
        side: "court",
        label: "영장 판사",
        text: "다툼의 여지가 있다",
        claimId: "claim-warrant",
      },
      {
        side: "court",
        label: "대법원(이화영 사건)",
        text: "피고인과 검사의 상고를 모두 기각해",
        claimId: "claim-lee-final",
      },
      {
        side: "court",
        label: "그 판결의 범위",
        text: "이 판결은 이 대통령에 대한 판단이 아니다",
        claimId: "claim-separate",
      },
    ],
  },
  {
    slug: "trial-corporate-card",
    steps: [
      { label: "기소", state: "done", result: "2024년 11월 19일", claimId: "claim-charge" },
      { label: "1심", state: "stopped", result: "공판준비기일 단계", claimId: "claim-suspended" },
      { label: "2심", state: "todo" },
      { label: "대법원", state: "todo" },
    ],
    numbers: [
      { label: "배임액", who: "검찰 주장", value: "1억 653만 원", claimId: "claim-amount" },
    ],
    breakdown: {
      title: "검찰이 더한 항목",
      parts: [
        { label: "관용차", amount: 6016, value: "6,016만 원", claimId: "claim-amount" },
        { label: "과일", amount: 2791, value: "2,791만 원", claimId: "claim-amount" },
        { label: "법인카드", amount: 889, value: "889만 원", claimId: "claim-amount" },
        { label: "샌드위치", amount: 685, value: "685만 원", claimId: "claim-amount" },
        { label: "세탁비", amount: 270, value: "270만 원", claimId: "claim-amount" },
      ],
    },
    voices: [
      {
        side: "prosecution",
        label: "검찰",
        text: "경기도 관용차를 사적으로 쓰고",
        claimId: "claim-charge",
      },
      {
        side: "defense",
        label: "대통령 측",
        text: "증거는 없지만 기소한다, 이게 검찰의 입장",
        claimId: "claim-defense",
      },
      {
        side: "other",
        label: "경찰 · 2022년 12월 불송치",
        text: "관여 정황이 확인되지 않는다",
        claimId: "claim-police",
      },
    ],
  },
];

/* ── 검사 ──────────────────────────────────────────────────────────── */

const policies = new Map(TRIAL_POLICIES.map((p) => [p.slug, p]));
const SIDE_TYPE: Record<Side, "CLAIM" | "FACT"> = {
  prosecution: "CLAIM",
  defense: "CLAIM",
  court: "FACT",
  other: "FACT",
};

function claimText(policy: Policy, id: string, where: string): string {
  const claim = policy.claims.find((c) => c.id === id);
  if (!claim) throw new Error(`쉽게 보기 ${policy.slug} ${where}: 없는 claim ${id}`);
  return claim.text;
}

function mustQuote(policy: Policy, id: string, piece: string, where: string) {
  if (!claimText(policy, id, where).includes(piece)) {
    throw new Error(`쉽게 보기 ${policy.slug} ${where}: "${piece}"가 ${id} 원문에 없다`);
  }
}

for (const easy of TRIAL_EASY) {
  const policy = policies.get(easy.slug);
  if (!policy) throw new Error(`쉽게 보기: 정책 ${easy.slug}가 없다`);
  if (!TRIALS.some((t) => t.slug === easy.slug)) {
    throw new Error(`쉽게 보기: ${easy.slug}는 재판 목록에 없다`);
  }
  for (const step of easy.steps) {
    if (step.result && !step.claimId) {
      throw new Error(`쉽게 보기 ${easy.slug} ${step.label}: 결과에 claim이 없다`);
    }
    if (step.claimId) claimText(policy, step.claimId, step.label);
    if (step.result && step.claimId) mustQuote(policy, step.claimId, step.result, step.label);
  }
  for (const n of easy.numbers) mustQuote(policy, n.claimId, n.value, n.label);
  for (const p of easy.breakdown?.parts ?? []) mustQuote(policy, p.claimId, p.value, p.label);
  for (const v of easy.voices) {
    mustQuote(policy, v.claimId, v.text, v.label);
    const claim = policy.claims.find((c) => c.id === v.claimId)!;
    if (claim.assertionType !== SIDE_TYPE[v.side]) {
      throw new Error(`쉽게 보기 ${easy.slug} ${v.label}: ${v.side} 칸은 ${SIDE_TYPE[v.side]}여야 한다`);
    }
  }
}

export function getTrialEasy(slug: string): TrialEasy | undefined {
  return TRIAL_EASY.find((e) => e.slug === slug);
}
