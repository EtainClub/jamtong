import { policySchema, type Policy } from "../schema";
import { TRIAL_CORPORATE_CARD } from "./corporate-card";
import { TRIAL_DAEJANG } from "./daejang";
import { TRIAL_ELECTION_LAW } from "./election-law";
import { TRIAL_NORTH_REMITTANCE } from "./north-remittance";
import { TRIAL_PERJURY } from "./perjury";
import { TRIAL_SUSPENSION } from "./suspension";

/**
 * 이재명 대통령 형사재판 — `/trials` 허브와 사건별 정책 페이지.
 *
 * 사건 하나가 정책 팩트 하나다(`/wiki/policy/trial-…`). 허브는 그 위에 다섯 사건을
 * 한 화면에 늘어놓고, 사건마다 **검찰 주장 · 대통령 측 반론 · 법원 판단**을 나란히
 * 보여 준다. 허브가 새로 만드는 문장은 없다 — 모두 claim id로 가리킨다.
 *
 * ★ 세 목소리는 assertionType으로 갈린다.
 *   검찰 주장과 대통령 측 반론은 CLAIM(누가 말했는지 붙는다), 법원 판단은 FACT다.
 *   어느 칸에 넣었는지와 claim의 성격이 어긋나면 빌드가 멈춘다(아래 검사).
 *
 * ★ 단계 칩은 claim 원문에서 떼어 온다.
 *   `stage`는 화면에서 가장 먼저 읽히는 말이다. 편집자가 고쳐 쓴 말이 거기 서면
 *   근거 없는 문장이 가장 눈에 띄는 자리를 차지한다. 그래서 `stageClaimId`가
 *   가리키는 claim 원문에 글자 그대로 있어야 한다. 카르텔의 headline과 같은 규칙이다.
 */

export interface TrialCase {
  no: string;
  slug: string;
  name: string;
  /** 마지막으로 확인된 단계를 한 마디로. stageClaimId의 원문에 그대로 있어야 한다. */
  stage: string;
  stageClaimId: string;
  /** 이 재판이 묻는 것. 단정이 아니라 물음으로 적는다. */
  question: string;
  prosecution: string[];
  defense: string[];
  court: string[];
  /** 법원 판단은 아니지만 확인된 사실(경찰 처분 등). FACT만. */
  facts?: string[];
}

const parse = (input: unknown): Policy => policySchema.parse(input);

export const TRIAL_POLICIES: Policy[] = [
  TRIAL_ELECTION_LAW,
  TRIAL_PERJURY,
  TRIAL_DAEJANG,
  TRIAL_NORTH_REMITTANCE,
  TRIAL_CORPORATE_CARD,
  TRIAL_SUSPENSION,
].map(parse);

export const TRIAL_BACKGROUND_SLUG = TRIAL_SUSPENSION.slug;

export const TRIALS: TrialCase[] = [
  {
    no: "①",
    slug: TRIAL_ELECTION_LAW.slug,
    name: "공직선거법 위반",
    stage: "유죄 취지의 파기환송",
    stageClaimId: "claim-remand",
    question: "대선 과정의 발언을 어디까지 '사실의 공표'로 보고 처벌할 수 있는가?",
    prosecution: ["claim-charge"],
    defense: ["claim-defense-charge", "claim-defense-first"],
    court: [
      "claim-first",
      "claim-appeal",
      "claim-knew",
      "claim-remand",
      "claim-majority",
      "claim-dissent",
    ],
  },
  {
    no: "②",
    slug: TRIAL_PERJURY.slug,
    name: "위증교사",
    stage: "1심 무죄",
    stageClaimId: "claim-acquitted",
    question: "증인의 위증과 별개로, 그 위증을 의도적으로 하게 했다는 고의가 증명되는가?",
    prosecution: ["claim-charge", "claim-prosecution-sentence", "claim-prosecution-appeal"],
    defense: ["claim-defense", "claim-defense-after"],
    court: ["claim-acquitted", "claim-reason", "claim-witness"],
  },
  {
    no: "③",
    slug: TRIAL_DAEJANG.slug,
    name: "대장동·위례·백현동·성남FC",
    stage: "1심 판단 전",
    stageClaimId: "claim-suspended",
    question: "정책적 판단과 형사상 배임·뇌물의 경계는 어디인가?",
    prosecution: ["claim-daejang-charge", "claim-fc-charge", "claim-baekhyeon-charge"],
    defense: ["claim-defense", "claim-baekhyeon-defense", "claim-baekhyeon-party"],
    court: ["claim-warrant", "claim-private-verdict", "claim-private-leadership"],
    facts: ["claim-police"],
  },
  {
    no: "④",
    slug: TRIAL_NORTH_REMITTANCE.slug,
    name: "쌍방울 대북송금",
    stage: "공판준비기일 단계",
    stageClaimId: "claim-own-stage",
    question: "대납이 있었다는 판단과 별개로, 이 대통령이 그것을 알았거나 승인했는가?",
    prosecution: ["claim-charge"],
    defense: ["claim-defense"],
    court: ["claim-warrant", "claim-lee-final", "claim-lee-hwayoung", "claim-separate"],
  },
  {
    no: "⑤",
    slug: TRIAL_CORPORATE_CARD.slug,
    name: "경기도 법인카드",
    stage: "공판준비기일 단계",
    stageClaimId: "claim-suspended",
    question: "사적 사용이 있었다면, 이 대통령이 그것을 지시하거나 알았는가?",
    prosecution: ["claim-charge", "claim-amount"],
    defense: ["claim-defense", "claim-party"],
    court: ["claim-spouse-court"],
    facts: ["claim-police"],
  },
];

/* 모듈을 불러올 때 한 번 검사한다. 틀리면 빌드가 멈춘다. */
const bySlug = new Map(TRIAL_POLICIES.map((p) => [p.slug, p]));
for (const trial of TRIALS) {
  const policy = bySlug.get(trial.slug);
  if (!policy) throw new Error(`재판 ${trial.name}: 정책 ${trial.slug}가 없다`);
  const claims = new Map(policy.claims.map((c) => [c.id, c]));

  const stageClaim = claims.get(trial.stageClaimId);
  if (!stageClaim) throw new Error(`재판 ${trial.name}: 없는 claim ${trial.stageClaimId}`);
  if (!stageClaim.text.includes(trial.stage)) {
    throw new Error(`재판 ${trial.name}: 단계 "${trial.stage}"가 claim 원문에 없다`);
  }

  const columns: [string, string[], "CLAIM" | "FACT"][] = [
    ["prosecution", trial.prosecution, "CLAIM"],
    ["defense", trial.defense, "CLAIM"],
    ["court", trial.court, "FACT"],
    ["facts", trial.facts ?? [], "FACT"],
  ];
  for (const [column, ids, expected] of columns) {
    for (const id of ids) {
      const claim = claims.get(id);
      if (!claim) throw new Error(`재판 ${trial.name}: ${column}에 없는 claim ${id}`);
      if (claim.assertionType !== expected) {
        throw new Error(`재판 ${trial.name}: ${column}의 ${id}는 ${expected}여야 한다`);
      }
    }
  }
}
