import { cartelSchema, type CartelEntry, type CartelInput } from "./schema";

/**
 * 지역 토착 — 성남과 경기도의 업적 둘이 받친다.
 *
 * `daejangdong`은 개발이익이 어디로 갔는지를, `gyeonggi-valley`는 계곡을
 * 차지하고 있던 불법시설을 걷어 낸 일을 근거까지 갖춰 들고 있다.
 *
 * ★ 이름을 조심한다.
 *   '토착'은 지역 전체를 가리키는 말로 읽히기 쉽다. 여기서 모으는 것은
 *   특정 지역 사람들이 아니라 **한 자리를 오래 차지해 온 구조**이고,
 *   화면의 문장도 그 선을 넘지 않는다.
 */

const raw: CartelInput = {
  id: "local-establishment",
  slug: "local-establishment",
  name: "지역 토착",
  summary:
    "한 자리를 오래 차지해 온 구조를 걷어 낸 일을 모았습니다. 개발이익 환수와 계곡 불법시설 철거입니다.",
  achievementSlugs: ["daejangdong", "gyeonggi-valley"],
  openQuestions: [
    "이 정부 들어 지방 토착비리를 겨냥한 수사나 제도가 있었는지 확인하지 못했습니다.",
    "여기 모인 둘은 성남시장·경기도지사 시기의 일입니다. 같은 표적을 중앙정부에서 어떻게 다루는지는 비어 있습니다.",
  ],
  sourceNote:
    "여기 모인 두 업적은 각자의 근거를 들고 있습니다. 이 페이지가 따로 더하는 " +
    "주장은 없습니다. 2026년 9월 21일 기준입니다.",
};

export const localEstablishment: CartelEntry = {
  cartel: cartelSchema.parse(raw),
  claims: [],
  sources: [],
};
