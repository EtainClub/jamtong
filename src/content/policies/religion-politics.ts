import type { PolicyInput } from "./schema";

/**
 * 종교 단체의 정치 개입과 해산 논의 (2025년 12월 국무회의 이후).
 *
 * 대통령 유튜브 영상 답글에 "종교 단체의 정치 개입을 막을 제도를 마련해 달라"는 제안이 달렸다(잼통 Voice).
 * 대통령이 이 문제에 대해 한 말과, 현행법상 수단(민법 제38조 비영리법인 설립허가 취소), 일본의 비교 사례를 적는다.
 *
 * ★ 경기지사 시절 신천지 대응은 achievement:gyeonggi-shincheonji에 있다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #267.
 */
export const RELIGION_POLITICS: PolicyInput = {
  slug: "religion-politics",
  title: "종교 단체의 정치 개입과 법인 해산 논의",
  scope:
    "2025년 12월 국무회의에서 대통령이 언급한 '법률을 어긴 종교단체 해산', 법제처장이 설명한 민법상 근거, 일본의 옛 통일교 해산 명령 확정(2026년 6월)",
  ministries: ["청와대", "법제처", "문화체육관광부"],
  categories: ["institution"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-religion",
      text: "종교 단체의 정치 개입을 막을 제도를 마련해 달라",
      claimIds: ["claim-cabinet", "claim-legal", "claim-spokesperson", "claim-japan"],
    },
  ],
  claims: [
    {
      id: "claim-cabinet",
      text:
        "이 대통령은 2025년 12월 9일 국무회의에서 정치에 개입하고 불법 자금을 쓰는 등 헌법과 법률을 어긴 종교단체는 해산까지 검토해야 한다는 취지로 말했다. " +
        "일본은 법원에 해산을 청구하게 돼 있는데 한국은 주무관청이 결정하는 구조라는 점도 짚었다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-20251209", "src-heraldk-20251208"],
      verified: true,
    },
    {
      id: "claim-legal",
      text:
        "조원철 법제처장은 같은 회의에서 해산 가능성은 민법 제38조(비영리법인 설립허가 취소)의 적용 문제로, 종교단체가 조직적으로 매우 심한 위법행위를 지속했을 때 가능하다고 답했다. " +
        "해산 사유는 최종적으로 법원이 판단하게 된다는 설명도 나왔다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-20251209", "src-ytn-20251209"],
      verified: true,
    },
    {
      id: "claim-spokesperson",
      text:
        "강유정 대변인은 대통령 발언이 특정 종교를 가리킨 것은 아니라고 설명했다. 일부 언론은 김건희 여사 관련 의혹에 연루된 통일교를 겨냥한 발언으로 해석했다.",
      assertionType: "CLAIM",
      assertedBy: "청와대 대변인",
      sourceIds: ["src-ytn-20251209"],
      verified: true,
    },
    {
      id: "claim-japan",
      text:
        "일본에서는 정부가 2023년 10월 옛 통일교(세계평화통일가정연합) 해산을 청구해 2025년 3월 도쿄지방재판소, 2026년 3월 도쿄고등재판소에 이어 " +
        "2026년 6월 최고재판소가 해산 명령을 확정했다. 민법상 불법행위(불법 헌금 권유)를 근거로 해산이 확정된 첫 사례다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-20260624"],
      verified: true,
    },
    {
      id: "claim-worship",
      text:
        "이 대통령은 2026년 11월 7일 X에 \"정치인이나 지도적 인사들에게는 칭찬도 비판도 필요하지만, 그것이 종교적 찬양이나 숭배에 이르러서는 안 된다\"는 글을 올렸다.",
      assertionType: "FACT",
      sourceIds: ["src-kwnews-20261108"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-cabinet",
      date: "2025-12-09",
      datePrecision: "day",
      title: "국무회의 '위법 종교단체 해산' 언급",
      summary: "법제처장 \"민법 38조 적용 문제\".",
      claimIds: ["claim-cabinet", "claim-legal"],
    },
    {
      id: "t-japan",
      date: "2026-06-23",
      datePrecision: "day",
      title: "일본, 옛 통일교 해산 확정",
      summary: "최고재판소 특별항고 기각.",
      claimIds: ["claim-japan"],
    },
  ],
  gaps: [
    "2025년 12월 발언 이후 한국 정부가 특정 종교법인의 설립허가 취소나 해산 절차에 들어갔는지는 공개 자료에서 확인되지 않았다.",
    "종교단체의 정치 개입 자체를 막는 별도 법안(정교분리 입법)이 국회에 발의됐는지는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-heraldk-20251208",
      title: "李대통령 \"종교단체, 법률 위배 행위땐 해산시켜야\"",
      publisher: "헤럴드K",
      url: "https://www.heraldk.com/article/2025120818355253014",
      publishedAt: "2025-12-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-seoul-20251209",
      title: "李 대통령 \"정치 개입하는 종교 단체, 헌법 위반하면 해산시켜야\"",
      publisher: "서울신문",
      url: "https://m.seoul.co.kr/news/2025/12/09/20251209500179",
      publishedAt: "2025-12-09",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ytn-20251209",
      title: "대통령 종교단체 해산 언급과 대변인 설명(YTN 보도)",
      publisher: "YTN",
      url: "https://www.ytn.co.kr/_ln/0101_202512091652286290",
      publishedAt: "2025-12-09",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-seoul-20260624",
      title: "日 대법원, 옛 통일교 해산명령 확정…\"불법 헌금 권유로 다수에게 피해\"",
      publisher: "서울신문",
      url: "https://m.seoul.co.kr/news/2026/06/24/20260624500032",
      publishedAt: "2026-06-24",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kwnews-20261108",
      title: "李대통령 \"정치인 칭찬·비판 필요하나 종교적찬양·숭배 안돼\"",
      publisher: "강원일보",
      url: "https://kwnews.co.kr/article/20261108501012",
      publishedAt: "2026-11-08",
      type: "press",
      license: "link-only",
    },
  ],
};
