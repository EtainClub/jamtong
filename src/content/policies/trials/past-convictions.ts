import type { PolicyInput } from "../schema";
import { sid, sourcesFor } from "./sources";

const P = "tr-pc";
const s = (key: Parameters<typeof sid>[1]) => sid(P, key);

/**
 * 이재명 대통령의 확정된 과거 형사처벌 — 이른바 '전과 4범'.
 *
 * 지금 멈춰 있는 다섯 재판(아직 확정되지 않은 것)과 달리, 이 네 건은 판결이 확정됐다.
 * 그래서 법원이 확정한 사실은 FACT로, 대통령 측 해명과 비판은 CLAIM으로 나눠 적는다.
 *
 * ★ 맥락은 덜어 주는 말이 아니다.
 *   대통령 측은 대부분 시민운동 중의 일이라고 설명한다. 그 설명을 싣되, 법원이
 *   인정한 사실(검사 사칭 공모 "넉넉히 인정", 음주 수치 0.158%, 시의원 폭행)도 같은
 *   카드 안에 같은 크기로 싣는다. 한쪽만 실으면 변론이 되거나 공격이 된다.
 * ★ 판결문 원문은 대조하지 못했다. 모든 문장이 보도 기준이라 verified: true다.
 * ★ 2026-11-11 처음 등록 — /trials/record.
 */
export const TRIAL_PAST_CONVICTIONS: PolicyInput = {
  slug: "trial-past-convictions",
  title: "대통령의 확정된 과거 형사처벌 네 건",
  scope:
    "이재명 대통령이 취임 전 벌금형을 확정받은 네 사건(2002년 검사 사칭, 2004년 음주운전, 2004년 성남시의회 항의, 2010년 선거 명함 배포)의 경위·판결·해명·비판",
  ministries: [],
  categories: ["institution"],
  asOf: "2026-11-11",
  rumors: [
    {
      id: "rumor-four",
      text: "이재명 대통령은 전과 4범이다",
      claimIds: ["claim-four", "claim-frame-defense", "claim-frame-critic"],
    },
  ],
  claims: [
    /* ── 개요 ── */
    {
      id: "claim-four",
      text:
        "이 대통령이 2021년 8월 공개한 범죄·수사경력 회보서에는 공무원 자격 사칭(벌금 150만 원), " +
        "2004년 음주운전(벌금 150만 원), 2004년 특수공무집행방해(벌금 500만 원), 2010년 공직선거법 " +
        "위반(벌금 50만 원) 네 건이 적혀 있다. 네 건 모두 벌금형이다.",
      assertionType: "FACT",
      sourceIds: [s("hankook-20210805")],
      verified: true,
    },
    {
      id: "claim-bulletin",
      text:
        "공직선거법 제49조는 후보자 등록 때 벌금 100만 원 이상 형의 범죄경력만 증명서류로 내도록 하고, 100만 원 " +
        "미만은 포함하지 않는다. 그래서 '전과 몇 건'을 두고 공식 기재 범위와 회보서 범위가 다를 수 있다.",
      assertionType: "FACT",
      sourceIds: [s("dailian-20210811")],
      verified: true,
    },
    {
      id: "claim-frame-defense",
      text:
        "이 대통령 측은 2025년 대선에서 '전과 4범'이라는 말이 사실과 맥락을 따지지 않은 정치적 공격이며, " +
        "대부분 시민의 권리를 위한 활동 과정에서 생긴 일이라 폭력·사기 같은 파렴치 범죄와 구분해야 한다고 했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 후보 측(2025년 대선)",
      sourceIds: [s("gjdream-20250520")],
      verified: true,
    },
    {
      id: "claim-frame-critic",
      text:
        "뉴데일리는 2022년 2월 이 후보의 선거공보 소명이 법원 판결과 다르다고 보도했다. 공보물은 검사 " +
        "이름을 알려 준 것이 사칭을 도운 것으로 판결됐다고 적었지만, 판결은 PD와의 공모를 인정했다는 것이다.",
      assertionType: "CLAIM",
      assertedBy: "뉴데일리 보도",
      sourceIds: [s("newdaily-20220223")],
      verified: true,
    },

    /* ── ① 검사 사칭 ── */
    {
      id: "pc1-what",
      text:
        "KBS '추적 60분'의 최철호 PD는 분당 파크뷰 특혜분양 논란을 취재하던 2002년 5월 10일 이 대통령(당시 " +
        "변호사)의 법률사무소에서 김병량 당시 성남시장의 수행비서 김진성 씨에게 전화해 검찰을 사칭하며 김 시장과의 " +
        "통화를 시도했다. 한국일보는 최 PD가 수원지검 검사 행세를 했다고 썼다.",
      assertionType: "FACT",
      sourceIds: [s("hankook-20241125"), s("newspim-20241125")],
      verified: true,
    },
    {
      id: "pc1-verdict",
      text:
        "검찰은 2002년 7월 이 대통령을 공무원자격사칭 등 혐의로 기소했다. 1심은 벌금 250만 원, 항소심은 " +
        "벌금 150만 원을 선고했고, 2004년 12월 대법원에서 벌금 150만 원이 확정됐다.",
      assertionType: "FACT",
      sourceIds: [s("newspim-20241125"), s("hankook-20241125")],
      verified: true,
    },
    {
      id: "pc1-court",
      text:
        "법원은 현장 스태프 진술 등을 근거로 \"피고인이 PD와 공모해 검사의 자격을 사칭하여 그 직권을 " +
        "행사한 사실을 넉넉히 인정할 수 있다\"고 판시했다.",
      assertionType: "FACT",
      sourceIds: [s("hankook-20241125"), s("newdaily-20220223")],
      verified: true,
    },
    {
      id: "pc1-defense",
      text:
        "이 대통령은 검사 이름을 알려 준 것은 맞지만 PD가 검사를 사칭할 줄 몰랐고 질문 내용을 지시한 적도 " +
        "없다고 주장했다. 2022년 선거공보에는 \"담당 검사 이름과 사건 중요 사항을 물어 알려주었는데, " +
        "법정다툼 끝에 결국 검사 사칭을 도운 것으로 판결됨\"이라고 적었다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: [s("hankook-20241125"), s("newdaily-20220223")],
      verified: true,
    },
    {
      id: "pc1-after",
      text:
        "이 대통령이 2018년 경기지사 후보 토론회에서 이 사건을 두고 누명을 썼다는 취지로 말한 것이 " +
        "허위사실공표로 기소됐으나, 2020년 대법원 전원합의체가 무죄 취지로 판결해 같은 해 무죄가 확정됐다. " +
        "그 재판의 증언을 둘러싸고 다시 위증교사로 기소됐고, 2024년 11월 25일 1심은 무죄였다.",
      assertionType: "FACT",
      sourceIds: [s("hankook-20241125"), s("newspim-20241125")],
      verified: true,
    },

    /* ── ② 음주운전 ── */
    {
      id: "pc2-what",
      text:
        "이 대통령은 2004년 5월 1일 오전 1시 21분께 혈중알코올농도 0.158% 상태로 자택에서 성남시 분당구 " +
        "수내동 중앙공원 앞 도로까지 운전했다. 수원지법 성남지원은 같은 해 7월 28일 벌금 150만 원의 " +
        "약식명령을 내렸다.",
      assertionType: "FACT",
      sourceIds: [s("dt-20211006"), s("hankook-20210805")],
      verified: true,
    },
    {
      id: "pc2-disclosure",
      text:
        "2021년 민주당 경선에서 김두관 의원이 음주운전 재범 가능성을 제기하자, 이 대통령(당시 경기지사)은 " +
        "범죄·수사경력 회보서를 공개했고 음주운전은 한 건으로 나왔다.",
      assertionType: "FACT",
      sourceIds: [s("hankook-20210805")],
      verified: true,
    },
    {
      id: "pc2-defense",
      text:
        "이 대통령 측은 농협 부정대출 사건을 파헤치려고 급히 현장으로 가던 중 생긴 잘못이라고 설명했다. " +
        "이 대통령은 음주운전이 명백한 잘못이라고 인정해 왔다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령 측",
      sourceIds: [s("hankook-20210805"), s("gjdream-20250520")],
      verified: true,
    },

    /* ── ③ 성남시의회 항의 ── */
    {
      id: "pc3-what",
      text:
        "2004년 성남시립병원 설립 운동 당시 시의회에서 병원 설립 조례 제정이 무산되자 시민들이 의회에 " +
        "들어가 항의했고, 그 과정에서 시의원 3명이 폭행당하는 일이 있었다. 설립 운동 대표였던 이 대통령은 " +
        "특수공무집행방해·공용물건손상 혐의로 벌금 500만 원을 선고받았다.",
      assertionType: "FACT",
      sourceIds: [s("newdaily-20210928"), s("hankook-20210805")],
      verified: true,
    },
    {
      id: "pc3-defense",
      text:
        "이 대통령은 \"당시 내가 설립 운동대표였기 때문에 공동책임을 졌다\"고 해명했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: [s("newdaily-20210928")],
      verified: true,
    },
    {
      id: "pc3-context",
      text:
        "경향신문은 2025년 6월, 추진위원회가 시민 서명을 받아 시립병원 설립 조례안을 시의회에 상정했으나 한나라당이 " +
        "다수인 시의회가 \"47초 만에 날치기 부결\"시켰고, 이 대통령과 시민들이 거세게 항의하다 특수공무방해죄로 " +
        "수배돼 유죄 판결을 받았다고 썼다. 이 대통령은 저서에서 조례안 부결을 정치에 뛰어든 계기로 적었다.",
      assertionType: "FACT",
      sourceIds: [s("khan-20250604")],
      verified: true,
    },
    {
      id: "pc3-later",
      text: "이 대통령은 성남시장 재임 중 시립의료원 설립을 추진했고, 성남시의료원은 2019년 완공됐다.",
      assertionType: "FACT",
      sourceIds: [s("newdaily-20210928")],
      verified: true,
    },
    {
      id: "pc3-critique",
      text:
        "국민의힘 박정훈 의원은 2025년 10월 대법원에서 확인했다는 판결문을 근거로, 김현지 실장이 " +
        "당시 시의회 복도에서 의원들의 출입을 막아 함께 벌금형을 받았다며 두 사람을 \"범죄공동체\"라고 불렀다.",
      assertionType: "CLAIM",
      assertedBy: "국민의힘 박정훈 의원",
      sourceIds: [s("pressian-20251014")],
      verified: true,
    },

    /* ── ④ 2010년 선거 명함 ── */
    {
      id: "pc4-what",
      text:
        "이 대통령은 2010년 지방선거 예비후보자 신분으로 4월 26일 오전 지하철 산성역 구내에서 명함 300장을 " +
        "배포한 혐의로 기소됐다. 검찰은 벌금 100만 원을 구형했고, 수원지법 형사합의1부는 2010년 12월 2일 " +
        "벌금 50만 원을 선고했다.",
      assertionType: "FACT",
      sourceIds: [s("seoul-20101202")],
      verified: true,
    },
    {
      id: "pc4-court",
      text:
        "1심 재판부는 선관위 안내 책자에 혼동의 여지가 있었고 다른 후보와의 형평, 선거에 직접 영향을 미쳤다고 " +
        "보기 어려운 점을 양형에 고려했다.",
      assertionType: "FACT",
      sourceIds: [s("seoul-20101202")],
      verified: true,
    },
    {
      id: "pc4-final",
      text:
        "2심도 배포 장소가 선거운동이 허용되지 않는 지하철역 구내라고 보고 같은 형을 선고했고, 대법원은 " +
        "2011년 4월 28일 벌금 50만 원을 확정했다. 100만 원 미만이라 성남시장직은 유지됐다.",
      assertionType: "FACT",
      sourceIds: [s("lawtimes-20110428")],
      verified: true,
    },
    {
      id: "pc4-defense",
      text:
        "이 대통령(당시 성남시장)은 한나라당 후보의 명함 배포는 수사하지 않고 민주당 단체장만 수사한 " +
        "\"야당탄압 수사\"라고 주장했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 당시 성남시장",
      sourceIds: [s("seoul-20101202")],
      verified: true,
    },
  ],
  critiqueIds: ["claim-frame-critic", "pc1-court", "pc3-critique"],
  timeline: [
    {
      id: "t-pc1-call",
      date: "2002-05",
      datePrecision: "month",
      title: "검사 사칭 통화",
      summary: "파크뷰 특혜분양 취재 중.",
      claimIds: ["pc1-what"],
    },
    {
      id: "t-pc2",
      date: "2004-07-28",
      datePrecision: "day",
      title: "음주운전 약식명령 벌금 150만 원",
      summary: "혈중알코올농도 0.158%.",
      claimIds: ["pc2-what"],
    },
    {
      id: "t-pc3",
      date: "2004",
      datePrecision: "year",
      title: "성남시의회 항의 사건 벌금 500만 원",
      summary: "특수공무집행방해·공용물건손상.",
      claimIds: ["pc3-what"],
    },
    {
      id: "t-pc1-final",
      date: "2004-12",
      datePrecision: "month",
      title: "검사 사칭 벌금 150만 원 확정",
      summary: "대법원.",
      claimIds: ["pc1-verdict"],
    },
    {
      id: "t-pc4-final",
      date: "2011-04-28",
      datePrecision: "day",
      title: "선거 명함 배포 벌금 50만 원 확정",
      summary: "시장직 유지.",
      claimIds: ["pc4-final"],
    },
    {
      id: "t-disclosure",
      date: "2021-08-05",
      datePrecision: "day",
      title: "범죄·수사경력 회보서 공개",
      summary: "음주운전은 한 건.",
      claimIds: ["claim-four", "pc2-disclosure"],
    },
  ],
  gaps: [
    "네 건 모두 판결문 원문과 대조하지 못했다. 문장은 인용한 기사 본문과 대조했다. 음주운전 약식명령 내용은 국회의원실이 입수한 결정문을 인용한 보도다.",
    "성남시의회 사건의 경위는 보도마다 다르게 쓴다. 경향신문은 '47초 만에 날치기 부결', 시민 '20만 명' 서명이라 썼고, 2003년 보도에는 서명 1만7천여 명으로 나온다. 회의록과 대조하지 못했다.",
    "검사 사칭 사건의 1·2심 선고일을 확인하지 못했다. 뉴데일리는 '2003년 7월 벌금 150만원 선고', 한국일보(2021)는 회보서 항목을 '2002년'으로 적어 기준이 다르다.",
    "성남시의회 사건의 선고 법원·선고일과 항소 여부는 확인하지 못했다. 일부 자료는 2004년 8월 선고로 적는다. 시의원 폭행은 보도 표현이며, 누가 폭행했는지는 판결문으로 확인하지 못했다.",
    "음주운전 해명을 한국일보는 '2005년 농협부정대출 사건'으로 옮겼는데, 운전은 2004년 5월이라 연도가 맞지 않는다. 해명 원문은 확인하지 못했다.",
    "2010년 같은 장소에서 명함을 돌렸다는 다른 후보가 수사·처벌됐는지는 확인하지 못했다.",
    "국민의힘이 공개했다는 2004년 판결문은 보지 못했다. 김현지 실장 관련 내용은 국민의힘의 주장으로만 적었다.",
  ],
  sources: sourcesFor(P, [
    "hankook-20210805",
    "dt-20211006",
    "hankook-20241125",
    "newspim-20241125",
    "newdaily-20220223",
    "dailian-20210811",
    "khan-20250604",
    "newdaily-20210928",
    "pressian-20251014",
    "gjdream-20250520",
    "seoul-20101202",
    "lawtimes-20110428",
  ]),
};

/** /trials/record 화면의 사건 카드. 문장은 모두 claim id로 가리킨다. */
export interface PastConviction {
  no: string;
  name: string;
  year: string;
  /** 확정 형량. sentenceClaimId 원문에 글자 그대로 있어야 한다. */
  sentence: string;
  sentenceClaimId: string;
  /** 법원이 확정했거나 확인된 사실. FACT만. */
  facts: string[];
  /** 대통령 측 설명. CLAIM만. */
  defense: string[];
  /** 비판. CLAIM이거나, 해명과 맞서는 법원 판단(FACT). */
  critique: string[];
  /** 그 뒤. FACT만. */
  after: string[];
}

export const PAST_CONVICTIONS: PastConviction[] = [
  {
    no: "①",
    name: "공무원자격사칭(검사 사칭)",
    year: "2002년 사건 · 2004년 확정",
    sentence: "벌금 150만 원",
    sentenceClaimId: "pc1-verdict",
    facts: ["pc1-what", "pc1-verdict"],
    defense: ["pc1-defense"],
    critique: ["pc1-court", "claim-frame-critic"],
    after: ["pc1-after"],
  },
  {
    no: "②",
    name: "음주운전",
    year: "2004년",
    sentence: "벌금 150만 원",
    sentenceClaimId: "pc2-what",
    facts: ["pc2-what"],
    defense: ["pc2-defense"],
    critique: [],
    after: ["pc2-disclosure"],
  },
  {
    no: "③",
    name: "특수공무집행방해·공용물건손상",
    year: "2004년",
    sentence: "벌금 500만 원",
    sentenceClaimId: "pc3-what",
    facts: ["pc3-what", "pc3-context"],
    defense: ["pc3-defense"],
    critique: ["pc3-critique"],
    after: ["pc3-later"],
  },
  {
    no: "④",
    name: "공직선거법 위반(명함 배포)",
    year: "2010년 사건 · 2011년 확정",
    sentence: "벌금 50만 원",
    sentenceClaimId: "pc4-final",
    facts: ["pc4-what", "pc4-court", "pc4-final"],
    defense: ["pc4-defense"],
    critique: [],
    after: [],
  },
];
