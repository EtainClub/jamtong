import { claimSchema } from "@/content/schema";
import { X_LOCAL_PRESIDENT_2026 } from "@/content/sources";

import { cartelSchema, type CartelEntry, type CartelInput } from "./schema";

/**
 * 지역 토착 — 경찰의 토착비리 특별단속이 받친다.
 *
 * 처음에는 성남(`daejangdong`)과 경기도(`gyeonggi-valley`)의 일로 채웠다가,
 * 카르텔 화면을 이 정부가 한 일로 좁히면서 비웠다. 그 뒤 대통령이 2026년
 * 10월 30일 토착비리를 직접 지목했고, 경찰청 국가수사본부의 1차 특별단속
 * 결과와 2차 단속 계획이 나와 다시 열었다.
 *
 * ★ 문제 문장은 대통령의 규정이다.
 *   "자치와 분권의 토대를 무너뜨리는 범죄"는 사실 서술이 아니라 본인의 말이다.
 *   CLAIM으로 싣고 누가 한 말인지 밝힌다.
 *
 * ★ 송치는 유죄가 아니다.
 *   1,094명은 경찰이 검찰로 넘긴 사람 수다. 기소되고 재판을 받아야 결론이
 *   난다. 카드 요약에 그렇게 적는다.
 *
 * ★ 이름을 조심한다.
 *   '토착'은 지역 전체를 가리키는 말로 읽히기 쉽다. 여기서 다루는 것은 특정
 *   지역 사람들이 아니라 지역 공직사회의 부패와 유착이다.
 */

const claims = [
  claimSchema.parse({
    id: "ct-local-president",
    text:
      "이재명 대통령은 2026년 10월 30일 X에 “토착비리는 자치와 분권의 토대를 무너뜨리는 범죄입니다. 지역사회의 고질적인 부패와 유착을 방치하면 지역 경쟁력은 물론 부실공사로 국민의 안전까지 훼손할 수 있습니다.”라고 썼다. 지역사회에 깊이 뿌리내린 유착과 부패는 내부고발조차 쉽지 않아 스스로 바로잡기 어렵다며, 경찰청 국가수사본부가 1차 특별단속에서 700여 건을 적발했고 11월부터 지역 공직사회 전반으로 2차 특별단속을 이어간다고 밝혔다.",
    assertionType: "CLAIM",
    assertedBy: "이재명 대통령",
    sourceIds: [X_LOCAL_PRESIDENT_2026.id],
    verified: true,
  }),
];

const raw: CartelInput = {
  id: "local-establishment",
  slug: "local-establishment",
  name: "지역 토착",
  summary:
    "지역 공직사회의 부패와 유착. 경찰이 8개월 동안 1차 특별단속을 마쳤고, 11월부터 대상을 지역 공직사회 전반으로 넓혀 2차 단속을 합니다.",
  problems: [
    {
      id: "lp-president",
      text:
        "대통령은 토착비리를 자치와 분권의 토대를 무너뜨리는 범죄라고 규정하고, 지역의 부패와 유착을 방치하면 부실공사로 국민 안전까지 해칠 수 있다고 말했습니다. 내부고발조차 쉽지 않아 지역 스스로 바로잡기 어렵다는 것이 단속에 나서는 이유로 제시됐습니다. 이것은 본인의 규정이며, 이 위키가 따로 대조한 진단은 아닙니다.",
      claimId: "ct-local-president",
      headline: "자치와 분권의 토대를 무너뜨리는 범죄",
      tags: ["부패와 유착", "부실공사"],
    },
  ],
  milestoneIds: ["ct-local-first", "ct-local-second"],
  openQuestions: [
    "송치된 1,094명 가운데 몇 명이 기소되고 유죄를 받았는지는 아직 알 수 없습니다.",
    "경찰청이 낸 보도자료 원문을 찾지 못해 연합뉴스·노컷뉴스 보도로 확인했습니다. 대통령이 말한 ‘700여 건’과 보도의 ‘785건’은 집계 시점이 다른 것으로 보입니다.",
    "개발이익 환수(성남 판교대장)와 계곡 불법시설 철거(경기도)는 업적에 있습니다. 이 정부의 일이 아니어서 여기 세지 않습니다.",
  ],
  sourceNote:
    "대통령의 말은 본인 X 게시글에서, 단속 결과와 계획은 보도에서 확인했습니다. " +
    "2026년 10월 31일 기준입니다.",
};

export const localEstablishment: CartelEntry = {
  cartel: cartelSchema.parse(raw),
  claims,
  sources: [X_LOCAL_PRESIDENT_2026],
};
