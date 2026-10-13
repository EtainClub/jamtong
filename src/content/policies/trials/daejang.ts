import type { PolicyInput } from "../schema";
import { sid, sourcesFor } from "./sources";

const P = "tr-dj";
const s = (key: Parameters<typeof sid>[1]) => sid(P, key);

/**
 * 대통령 형사재판 ③ 대장동·위례·백현동·성남FC.
 *
 * 네 의혹이 서울중앙지법 형사합의33부에서 한 재판으로 병합돼 있었다. 1심 판단이
 * 하나도 나오지 않은 사건이므로 금액은 전부 **검찰이 주장한 금액**이다. 화면에서
 * 그 금액만 크게 떼어 쓰면 유죄 확정액처럼 읽힌다. 금액이 들어간 문장은 모두
 * CLAIM + assertedBy: 검찰로 둔다.
 *
 * ★ 민간업자 1심(2025-10-31)은 이 대통령에 대한 판단이 아니다.
 *   같은 사건의 다른 피고인 재판이고, 재판부는 대통령의 관여 여부를 판단하지
 *   않았다. 그 판결의 불리한 대목("성남시 수뇌부")도 빼지 않되, 무엇을 판단하지
 *   않았는지를 같은 문장에 적는다.
 */
export const TRIAL_DAEJANG: PolicyInput = {
  slug: "trial-daejang",
  title: "대통령 재판 ③ 대장동·위례·백현동·성남FC",
  scope: "성남시장 시절 개발사업 배임과 성남FC 후원금 뇌물 혐의를 병합한 1심 재판의 경과와 쟁점",
  categories: ["institution"],
  asOf: "2026-10-13",
  claims: [
    {
      id: "claim-daejang-charge",
      text:
        "검찰은 2023년 3월 22일 이재명 대통령(당시 더불어민주당 대표)이 성남시장 시절 민간 " +
        "사업자에게 유리한 대장동 개발 구조를 승인해 성남도시개발공사에 4,895억 원의 손해를 " +
        "끼쳤다며 불구속 기소했다.",
      assertionType: "CLAIM",
      assertedBy: "검찰",
      sourceIds: [s("dailian-0322")],
      verified: false,
    },
    {
      id: "claim-wirye-charge",
      text:
        "검찰은 2013년 11월 위례신도시 개발사업에서 내부 정보를 민간 사업자에게 알려 211억 원의 " +
        "부당 이득을 얻게 했다고 본다.",
      assertionType: "CLAIM",
      assertedBy: "검찰",
      sourceIds: [s("dailian-0322")],
      verified: false,
    },
    {
      id: "claim-fc-charge",
      text:
        "검찰은 성남FC 구단주였던 이 대통령이 두산건설·네이버·차병원·푸른위례 등 4개 기업에서 " +
        "133억 5천만 원의 후원금을 받는 대가로 건축 인허가나 토지 용도 변경 같은 편의를 " +
        "제공했다며 제3자 뇌물 혐의를 적용했다.",
      assertionType: "CLAIM",
      assertedBy: "검찰",
      sourceIds: [s("dailian-0322")],
      verified: false,
    },
    {
      id: "claim-baekhyeon-charge",
      text:
        "검찰은 2023년 10월 12일 백현동 한국식품연구원 부지 개발에서 성남도시개발공사를 사업에서 " +
        "배제해 공사에 최소 200억 원의 손해를 끼쳤다며 특경법상 배임 혐의로 추가 기소했다.",
      assertionType: "CLAIM",
      assertedBy: "검찰",
      sourceIds: [s("inews-1012")],
      verified: false,
    },
    {
      id: "claim-defense",
      text:
        "이 대통령 측은 혐의를 전면 부인하며, 대장동 사업은 5,503억 원을 공익으로 환수한 " +
        "성과이고 성남FC 광고 유치는 적법했다고 주장했다. 기소에 대해서는 답이 정해진 " +
        "'답정기소'라고 비판했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 측(기소 당시)",
      sourceIds: [s("dailian-0322")],
      verified: false,
    },
    {
      id: "claim-baekhyeon-defense",
      text:
        "이 대통령은 2023년 8월 백현동 의혹으로 검찰에 출석하며 낸 서면 진술서에서, 용도변경은 " +
        "민간업자 로비가 아니라 박근혜 전 대통령의 지시로 시작됐고 성남도시개발공사 참여는 " +
        "용도변경 조건이 아니었다고 주장했다. 출석하면서는 \"티끌만한 부정이라도 있었다면 " +
        "수백번의 압수수색과 권력의 탄압으로 이미 가루가 돼 사라졌을 것\"이라고 말했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령(당시 더불어민주당 대표)",
      sourceIds: [s("hani-0817")],
      verified: false,
    },
    {
      id: "claim-baekhyeon-party",
      text:
        "더불어민주당 검찰독재정치탄압대책위원회는 백현동 기소 당일 \"혐의 입증이 어려운 " +
        "상황임에도 무차별적으로 공소를 제기하는 행위는 명백한 공소권 남용\"이라며, 야당 대표의 " +
        "법원 출석 횟수를 늘리려는 '살라미식 쪼개기 기소'라고 비판했다.",
      assertionType: "CLAIM",
      assertedBy: "더불어민주당",
      sourceIds: [s("khan-1012")],
      verified: false,
    },
    {
      id: "claim-warrant",
      text:
        "서울중앙지법 유창훈 영장전담 판사는 2023년 9월 27일 백현동·대북송금 혐의의 구속영장을 " +
        "기각했다. 백현동 부분은 성남도시개발공사 사업참여 배제에 \"피의자의 관여가 있었다고 " +
        "볼 만한 상당한 의심이 든다\"면서도 \"직접 증거 자체는 부족하다\"고 했다. 구속할지를 " +
        "정한 판단이고 유무죄 판단은 아니다.",
      assertionType: "FACT",
      sourceIds: [s("mt-0927")],
      verified: false,
    },
    {
      id: "claim-police",
      text:
        "성남FC 후원금 의혹은 2021년 9월 경기 분당경찰서가 증거불충분을 이유로 불송치 결정했으나, " +
        "2022년 2월 검찰의 보완수사 요구로 다시 수사가 시작됐다.",
      assertionType: "FACT",
      sourceIds: [s("seoul-0704")],
      verified: false,
    },
    {
      id: "claim-suspended",
      text:
        "서울중앙지법 형사합의33부는 2025년 6월 10일 \"헌법 제84조를 적용했다\"며 24일로 잡혀 " +
        "있던 대장동·위례·백현동·성남FC 사건 기일을 추후 지정했다. 1심 판단 전에 멈춘 것이다.",
      assertionType: "FACT",
      sourceIds: [s("edaily-0610")],
      verified: false,
    },
    {
      id: "claim-private-verdict",
      text:
        "같은 사건의 민간업자 재판에서 서울중앙지법 형사22부는 2025년 10월 31일 유동규·김만배 " +
        "씨에게 징역 8년, 정민용 씨에게 6년, 정영학 씨에게 5년, 남욱 씨에게 4년을 선고하고 " +
        "법정구속했다. 업무상 배임은 유죄로, 특경법상 배임은 무죄로 판단했다.",
      assertionType: "FACT",
      sourceIds: [s("segye-1031")],
      verified: false,
    },
    {
      id: "claim-private-leadership",
      text:
        "그 재판부는 유착 배경을 설명하며 '성남시 수뇌부'라는 표현을 썼지만 범위를 구체적으로 " +
        "밝히지 않았고, 최종 결재권자였던 이 대통령이 관여했는지는 판단하지 않았다.",
      assertionType: "FACT",
      sourceIds: [s("segye-1031")],
      verified: false,
    },
  ],
  critiqueIds: ["claim-private-verdict", "claim-private-leadership"],
  timeline: [
    {
      id: "t-charge",
      date: "2023-03-22",
      datePrecision: "day",
      title: "대장동·위례·성남FC 기소",
      summary: "검찰 주장 배임액 4,895억 원, 뇌물 133억 5천만 원.",
      claimIds: ["claim-daejang-charge", "claim-fc-charge", "claim-defense"],
    },
    {
      id: "t-baekhyeon",
      date: "2023-10-12",
      datePrecision: "day",
      title: "백현동 추가 기소",
      summary: "검찰 주장 손해액 최소 200억 원. 민주당은 공소권 남용이라고 했다.",
      claimIds: ["claim-baekhyeon-charge", "claim-baekhyeon-party"],
    },
    {
      id: "t-baekhyeon-statement",
      date: "2023-08-17",
      datePrecision: "day",
      title: "백현동 의혹 검찰 출석",
      summary: "서면 진술서로 혐의를 부인했다.",
      claimIds: ["claim-baekhyeon-defense"],
    },
    {
      id: "t-warrant",
      date: "2023-09-27",
      datePrecision: "day",
      title: "구속영장 기각",
      summary: "관여 의심은 있으나 직접 증거는 부족하다고 했다.",
      claimIds: ["claim-warrant"],
    },
    {
      id: "t-suspend",
      date: "2025-06-10",
      datePrecision: "day",
      title: "1심 기일 추후 지정",
      summary: "헌법 제84조를 적용했다.",
      claimIds: ["claim-suspended"],
    },
    {
      id: "t-private",
      date: "2025-10-31",
      datePrecision: "day",
      title: "민간업자 1심 선고",
      summary: "다른 피고인 재판. 대통령 관여 여부는 판단하지 않았다.",
      claimIds: ["claim-private-verdict", "claim-private-leadership"],
    },
  ],
  gaps: [
    "공소장·판결문 원문과 대조하지 않았다. 모든 문장이 언론 보도 기준이다.",
    "재판 중단 당시 네 의혹 각각의 심리가 어디까지 진행됐는지 확인하지 못했다.",
    "민간업자 1심의 손해액 판단은 보도마다 표현이 달라(약 4,890억 원 손해 인정 / 손해액 불특정으로 특경법 무죄) 판결문으로 확인해야 한다.",
    "백현동에 대한 이 대통령 측 반론은 서면 진술서 보도 기준이다. 진술서 원문은 보지 못했다.",
    "구속영장 기각 결정문 원문은 보지 못했다.",
    "민간업자 재판의 항소심 결과는 확인하지 못했다.",
  ],
  sources: sourcesFor(P, ["dailian-0322", "inews-1012", "hani-0817", "khan-1012", "mt-0927", "seoul-0704", "edaily-0610", "segye-1031"]),
};
