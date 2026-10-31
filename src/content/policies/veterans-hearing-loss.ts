import type { PolicyInput } from "./schema";

/**
 * 군 복무 중 생긴 이명·난청의 보훈 인정.
 *
 * 「대통령은 국민의 제1공복」·「어렵게 만든 민주주의를 꼭 지켜냅시다」 답글에 "군 사격 훈련으로
 * 얻은 이명·난청을 보훈 대상으로 인정하는 기준을 고쳐 달라"는 요청이 달렸다(잼통 Voice).
 * 확인되는 제도와 2026년 보훈 법령 개정, 확인하지 못한 것을 적는다.
 *
 * ★ 2026년에 이명·난청 인정 기준을 바꾸는 개정은 찾지 못했다. 그 사실을 gaps에 적는다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #118.
 */
export const VETERANS_HEARING_LOSS: PolicyInput = {
  slug: "veterans-hearing-loss",
  title: "군 복무 중 이명·난청의 보훈 인정 기준",
  scope:
    "군 복무 중 소음으로 생긴 이명·난청의 상이등급 기준(데시벨·이명 인정 요건), 판정 원칙, 2026년 보훈 법령 개정의 범위",
  ministries: ["국가보훈부", "국방부"],
  categories: ["welfare"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-criteria",
      text: "군 사격 훈련으로 이명·난청을 얻은 사람들이 보훈 인정을 받도록 기준을 고쳐 달라",
      claimIds: ["claim-hearing-grade", "claim-grade-strict", "claim-2026-amend"],
    },
  ],
  claims: [
    {
      id: "claim-grade-strict",
      text:
        "보훈 상이등급은 실제 다친 신체 부위에 법령이 정한 부위별 등급 기준을 적용해 판정한다. 2026년 7월 중앙행정심판위원회는 " +
        "손목을 다친 군인에게 다리·발가락 기준을 적용한 보훈심사위원회의 판정을 취소했다.",
      assertionType: "FACT",
      sourceIds: ["src-ytn-20260723"],
      verified: true,
    },
    {
      id: "claim-2026-amend",
      text:
        "국가보훈부가 2026년 10월 1일~11월 10일 입법예고한 보훈보상대상자법 시행규칙 개정안은 유족 보상금 지급순위와 " +
        "신상변동신고에 관한 것으로, 이명·난청 인정 기준을 바꾸는 내용이 아니다. 상위 법률은 2027년 1월 1일 시행 예정이다.",
      assertionType: "FACT",
      sourceIds: ["src-lawmaking-88908"],
      verified: true,
    },
    {
      id: "claim-hearing-grade",
      text:
        "2021년 9월 개정된 국가유공자법 시행규칙 별표4에 따르면 두 귀의 청력장애가 각각 공기전도 40dB 이상이면 상이등급 7급이다. 이명은 3회 이상 " +
        "이명검사에서 모두 확인되고 그 귀에 40dB 이상 난청이 함께 있어야 7급으로 인정된다(2012년 기준은 50dB 이상 난청 동반). 이명만으로는 " +
        "등급을 받기 어렵다.",
      assertionType: "FACT",
      sourceIds: ["src-law-nmv-annex4-2021"],
      verified: false,
    },
  ],
  critiqueIds: [],
  timeline: [],
  gaps: [
    "2021년 이후 별표4가 다시 개정됐는지는 국가법령정보센터 현행 조문으로 대조하지 못했다.",
    "군 소음성 난청·이명의 보훈 신청 건수와 인정률 통계는 찾지 못했다.",
    "국가보훈부나 국회에서 이명·난청 인정 기준 개정을 논의한 기록은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-ytn-20260723",
      title: "군 손목 부상자에 다리 기준 적용?...권익위 \"처분 취소\"",
      publisher: "YTN",
      url: "https://www.ytn.co.kr/_ln/0101_202607231040214600",
      publishedAt: "2026-07-23",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-lawmaking-88908",
      title: "보훈보상대상자 지원에 관한 법률 시행규칙 일부개정령안",
      publisher: "국민참여입법센터",
      url: "https://opinion.lawmaking.go.kr/gcom/ogLmPp/88908",
      type: "official",
      license: "public",
    },
    {
      id: "src-law-nmv-annex4-2021",
      title: "국가유공자 등 예우 및 지원에 관한 법률 시행규칙 [별표 4] 신체부위별 상이등급의 결정 (개정 2021. 9. 27.)",
      publisher: "국가법령정보센터",
      url: "https://law.go.kr/LSW//flDownload.do?flSeq=108843043&flNm=%5B%EB%B3%84%ED%91%9C+4%5D+%EC%8B%A0%EC%B2%B4%EB%B6%80%EC%9C%84%EB%B3%84+%EC%83%81%EC%9D%B4%EB%93%B1%EA%B8%89%EC%9D%98+%EA%B2%B0%EC%A0%95%28%EC%A0%9C8%EC%A1%B0%EC%9D%983+%EA%B4%80%EB%A0%A8%29",
      publishedAt: "2021-09-27",
      type: "legislative",
      license: "public",
    },
  ],
};
