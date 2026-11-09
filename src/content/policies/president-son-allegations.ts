import type { PolicyInput } from "./schema";

/**
 * 대통령 장남 관련 의혹의 사실관계: 도박 사건 액수, 삼청각 결혼식, '황제골프' 의혹.
 *
 * 대통령 유튜브·X 답글에 "장남 도박 액수를 1,000만 원이 안 된다고 했지만 실제로는 2억 원이 넘어 거짓말을 했다"(이슈 #247),
 * "특권을 비판하던 대통령이 아들 결혼식을 삼청각에서 비싸게 치렀다"(이슈 #246)는 주장이 달렸다(잼통 Voice).
 * 판결·보도로 확인되는 것과 확인되지 않는 것을 나눠 적는다.
 *
 * ★ '1,000만 원'은 손실액에 대한 당시 후보의 설명이고, '2억 3천만 원'은 검찰 공소사실의 게임머니 충전액이다. 두 숫자는 같은 것을 재지 않는다.
 * ★ 결혼식 비용은 공식 발표가 없다. 보도된 대관비는 추정치다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #247, #246(및 #225의 장남 골프 의혹 부분).
 */
export const PRESIDENT_SON_ALLEGATIONS: PolicyInput = {
  slug: "president-son-allegations",
  title: "대통령 장남 관련 의혹의 사실관계: 도박 사건·결혼식·골프",
  scope:
    "장남 이동호 씨의 상습도박·음란물 유포 약식명령(벌금 500만 원) 내용과 '1,000만 원' 발언, 2025년 6월 삼청각 결혼식과 축의금 논란, 2026년 11월 '황제골프' 의혹 고소",
  ministries: ["청와대"],
  categories: ["institution"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-gamble",
      text: "대통령이 장남의 도박 액수를 1,000만 원이 안 된다고 했지만 실제로는 2억 원이 넘어 거짓말을 했다",
      claimIds: ["claim-gamble-case", "claim-gamble-1000"],
    },
    {
      id: "rumor-wedding",
      text: "특권을 비판하던 대통령이 아들 결혼식을 삼청각에서 비싸게 치르고, 이를 문제 삼는 국민을 극우로 몬다",
      claimIds: ["claim-wedding", "claim-wedding-critique"],
    },
  ],
  claims: [
    {
      id: "claim-gamble-case",
      text:
        "검찰 공소사실에 따르면 장남 이씨는 2019년 1월부터 2021년 12월까지 온라인 사이트에서 707회에 걸쳐 약 2억 3,200만 원어치 게임머니를 충전해 홀덤 도박을 했다. " +
        "상습도박과 정보통신망법 위반(음란물 유포) 혐의로 약식기소돼 수원지법이 2024년 10월 31일 벌금 500만 원을 선고했고, 정식재판을 청구하지 않아 확정됐다. 2025년 5월 뒤늦게 알려졌다.",
      assertionType: "FACT",
      sourceIds: ["src-kyeonggi-20250529", "src-newdaily-20250529", "src-newdaily-20250602"],
      verified: true,
    },
    {
      id: "claim-gamble-1000",
      text:
        "이재명 당시 후보는 2021년 12월 기자들에게 아들이 \"대개 한 1000만원 이내를 잃은 것 같다\"고 말했다. 이는 잃은 돈(손실액)에 대한 설명이고, 2억 3천만 원은 충전한 게임머니 총액이다. " +
        "실제 손실액이 얼마였는지는 판결 보도에 나오지 않는다.",
      assertionType: "FACT",
      sourceIds: ["src-newdaily-20250529"],
      verified: false,
    },
    {
      id: "claim-wedding",
      text:
        "장남은 2025년 6월 14일 서울 성북구 삼청각에서 결혼했다. 대통령실은 대통령 내외와 가족·친지가 참석하는 비공개 가족 행사로 열고 화환은 받지 않겠다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-20250617", "src-bosik-20500"],
      verified: true,
    },
    {
      id: "claim-wedding-critique",
      text:
        "하객이 800명을 넘었다는 전언과 삼청각 대관비만 최소 1,500만 원으로 알려졌다는 보도가 나오며 '단출한 가족 행사'라는 설명과 다르다는 비판이 나왔다. " +
        "국민의힘 주진우 의원은 2025년 10월 축의금 총액과 명단 공개를 요구했다. 대통령실은 비용·축의금에 대한 구체적 답을 내놓지 않았다.",
      assertionType: "CLAIM",
      assertedBy: "언론 보도·주진우 의원",
      sourceIds: ["src-daum-wedding", "src-newdaily-20251027", "src-dailian-1564368"],
      verified: true,
    },
    {
      id: "claim-golf-suit",
      text:
        "장남은 2026년 11월 주진우 의원의 '황제골프' 의혹 제기를 허위사실이라며 명예훼손 혐의로 서울경찰청에 고소했다. \"해당 골프장에 간 사실도, 골프를 친 사실도 없다\"고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "대통령 장남",
      sourceIds: ["src-seoul-20261105"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-wedding-critique"],
  timeline: [
    {
      id: "t-fine",
      date: "2024-10-31",
      datePrecision: "day",
      title: "벌금 500만 원 약식명령",
      summary: "상습도박·음란물 유포.",
      claimIds: ["claim-gamble-case"],
    },
    {
      id: "t-wedding",
      date: "2025-06-14",
      datePrecision: "day",
      title: "삼청각 결혼식",
      summary: "비공개 가족 행사.",
      claimIds: ["claim-wedding"],
    },
    {
      id: "t-golf",
      date: "2026-11-05",
      datePrecision: "day",
      title: "장남, '황제골프' 의혹 고소",
      summary: "주진우 의원 상대.",
      claimIds: ["claim-golf-suit"],
    },
  ],
  gaps: [
    "결혼식 실제 비용과 부담 주체, 축의금 수령 여부·액수는 공개되지 않았다.",
    "'1,000만 원' 발언 원문은 2021년 12월 기사로 직접 확인하지 못하고 2025년 보도의 인용으로 확인했다(미검증).",
    "답글이 말한 '문제 삼는 국민을 극우로 몬다'는 대목을 뒷받침하거나 반박할 대통령 발언은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-kyeonggi-20250529",
      title: "'상습도박', '음란글 게시' 혐의…이재명 장남, 벌금형 뒤늦게 확인",
      publisher: "경기일보",
      url: "https://www.kyeonggi.com/article/20250529580426",
      publishedAt: "2025-05-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newdaily-20250529",
      title: "이재명 장남, 도박 2억3천 쓰고 재산 390만원 신고 … \"자금 출처 증명하라\" 봇물",
      publisher: "뉴데일리",
      url: "https://www.newdaily.co.kr/site/data/html/2025/05/29/2025052900231.html",
      publishedAt: "2025-05-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newdaily-20250602",
      title: "[단독] 이재명 아들 '젓가락' 판결문 입수 … '상습도박·음란물 유포' 檢 공소장 모두 수용",
      publisher: "뉴데일리",
      url: "https://www.newdaily.co.kr/site/data/html/2025/06/02/2025060200423.html",
      publishedAt: "2025-06-02",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankyung-20250617",
      title: "청첩장에 이름도 안 넣어 자녀 결혼에 축의금 거절한 그들",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/2025061701317",
      publishedAt: "2025-06-17",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-bosik-20500",
      title: "이재명 대통령 장남 이동호 씨 14일 결혼...왜 이 시점일까",
      publisher: "최보식의언론",
      url: "https://www.bosik.kr/news/articleView.html?idxno=20500",
      publishedAt: "2025-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-daum-wedding",
      title: "이재명 대통령 큰아들 비공개 결혼식 뒷이야기",
      publisher: "신동아(다음 게재)",
      url: "https://v.daum.net/v/bLUZ7zJqyj",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newdaily-20251027",
      title: "권력자 경조사비 정국 강타 … 주진우 \"李 대통령, '아들 삼청각 결혼식' 축의금 총액·명단 밝혀라\" 직격",
      publisher: "뉴데일리",
      url: "https://www.newdaily.co.kr/site/data/html/2025/10/27/2025102700237.html",
      publishedAt: "2025-10-27",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-1564368",
      title: "주진우 \"李대통령, '아들 삼청각 결혼식' 축의금 총액·명단 밝혀야\"",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view2/1564368",
      publishedAt: "2025-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-seoul-20261105",
      title: "李대통령 장남, \"황제골프 아냐\"…주진우 명예훼손 고소",
      publisher: "서울신문",
      url: "https://seoul.co.kr/news/society/2026/11/05/20261105500344",
      publishedAt: "2026-11-05",
      type: "press",
      license: "link-only",
    },
  ],
};
