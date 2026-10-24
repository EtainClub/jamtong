import type { PolicyInput } from "./schema";

/**
 * 국가유공자 안장 시설 — 인천가족공원 호국봉안담과 보훈부 사용료 지원.
 *
 * 대통령 X 게시물 답글에 "인천가족공원 국가유공자 호국봉안담의 영구 안장을 추진해 달라"는
 * 요청이 달렸다(잼통 Voice). 호국봉안담은 인천시 공설 시설이고 사용기간이 정해져 있다.
 * 시설의 조건과, 국립묘지 밖 안장 시설에 대한 보훈부 지원을 적는다.
 *
 * ★ 호국봉안담은 인천시(인천시설공단)가 운영한다. 영구 안장으로 바꾸려면 인천시 조례 개정이
 *   필요한 것으로 보이나, 그런 논의가 있다는 자료는 찾지 못했다.
 * ★ 2026-10-24 처음 등록 — 잼통 Voice 이슈 #71.
 */
export const VETERANS_COLUMBARIUM: PolicyInput = {
  slug: "veterans-columbarium",
  title: "국가유공자 안장 시설: 인천 호국봉안담과 사용료 지원",
  scope:
    "인천가족공원 국가유공자 호국봉안담의 규모·자격·사용기간, 국립묘지 밖 안장 시설 사용료에 대한 국가보훈부 지원",
  ministries: ["국가보훈부", "인천광역시"],
  categories: ["welfare"],
  asOf: "2026-10-24",
  rumors: [
    {
      id: "rumor-permanent",
      text: "인천가족공원 국가유공자 호국봉안담의 영구 안장을 추진해 달라",
      claimIds: ["claim-facility", "claim-terms", "claim-mpva-support"],
    },
  ],
  claims: [
    {
      id: "claim-facility",
      text:
        "인천가족공원 호국봉안담은 4,144기를 모실 수 있는 인천시 공설 봉안시설로, 2022년 3월 31일 준공하고 4월 22일 " +
        "첫 안치를 했다. 대상은 국가보훈기본법 제3조 제1호의 국가유공자 가운데 인천에 사는 사람이다.",
      assertionType: "FACT",
      sourceIds: ["src-insiseol-20220425"],
      verified: true,
    },
    {
      id: "claim-terms",
      text:
        "사용료와 관리료는 30년 동안 무료다. 이미 안치된 유공자를 다른 곳으로 옮기는 이장은 할 수 없다. 30년이 지난 " +
        "뒤의 처리는 공고된 자료에 나오지 않는다.",
      assertionType: "FACT",
      sourceIds: ["src-insiseol-20220425"],
      verified: true,
    },
    {
      id: "claim-mpva-support",
      text:
        "국가보훈부는 국립묘지가 아닌 봉안당·봉안장·자연장에 안장된 국가보훈대상자의 유족에게 실제 낸 안장시설 " +
        "사용료를 1기당 100만 원까지 지원한다. 원칙적으로 2023년 1월 1일 이후 사망자가 대상이고 무연고자는 사망 시기 " +
        "제한이 없으며, 안장 후 5년 안에 지방보훈관서에 신청한다. 보훈부는 2026년 10월 18일 지원을 받지 못한 유족 " +
        "1,740명을 찾아 안내하겠다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-vegannews-20261023"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-open",
      date: "2022-04-22",
      datePrecision: "day",
      title: "인천 호국봉안담 첫 안치",
      summary: "4,144기 규모, 30년 무료.",
      claimIds: ["claim-facility", "claim-terms"],
    },
    {
      id: "t-mpva",
      date: "2026-10-18",
      datePrecision: "day",
      title: "보훈부, 안장시설 사용료 지원 안내 확대",
      summary: "미수령 유족 1,740명 안내.",
      claimIds: ["claim-mpva-support"],
    },
  ],
  gaps: [
    "호국봉안담 30년 사용기간이 끝난 뒤 연장·영구 안치가 가능한지 인천시 조례 원문을 확인하지 못했다.",
    "인천 지역 국가유공자의 영구 안장 요구에 대해 국가보훈부나 인천시가 낸 입장은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-insiseol-20220425",
      title: "인천가족공원, 인천국가유공자 호국봉안담 안치 개시",
      publisher: "인천시설공단",
      url: "https://www.insiseol.or.kr/main/bbs/bbsMsgDetail.do?msg_seq=69&bcd=pub_report&pgno=1",
      publishedAt: "2022-04-25",
      type: "official",
      license: "public",
    },
    {
      id: "src-vegannews-20261023",
      title: "국가유공자 안장시설 사용료 100만원까지 지원",
      publisher: "비건뉴스",
      url: "https://www.vegannews.co.kr/news/article.html?no=395845",
      publishedAt: "2026-10-23",
      type: "press",
      license: "link-only",
    },
  ],
};
