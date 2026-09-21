import { claimSchema } from "@/content/schema";
import { EX_RESTAREA_2026 } from "@/content/sources";

import { cartelSchema, type CartelEntry, type CartelInput } from "./schema";

/**
 * 휴게소 — 구조를 적을 수 있는 드문 표적.
 *
 * 열둘 가운데 "무엇이 문제인가"를 근거를 달아 적을 수 있는 몇 안 되는
 * 자리다. 값이 비싸다는 것은 평가지만, 도로공사에서 운영업체를 거쳐
 * 입점매장으로 이어지는 **다단계 구조**는 자료에 적힌 사실이다.
 *
 * ★ 값이 내렸다고 적지 않는다.
 *   자료가 말하는 것은 "낮아질 것으로 기대한다"까지다. 시범이 돌기 시작한
 *   지 얼마 되지 않았고 아무도 아직 재지 않았다. 기대를 결과로 옮기는 것이
 *   이 자리에서 가장 하기 쉬운 잘못이다.
 */

const claims = [
  claimSchema.parse({
    id: "ct-restarea-tiers",
    text:
      "고속도로 휴게소는 한국도로공사에서 휴게소 운영업체를 거쳐 입점매장으로 이어지는 다단계 임대 구조였고, 단계마다 수수료가 붙었다. 도로공사는 공사가 입점매장과 직접 계약하면 그 구조가 단순해져 입점매장이 부담하던 수수료율이 대폭 낮아진다고 밝혔다.",
    assertionType: "FACT",
    sourceIds: [EX_RESTAREA_2026.id],
    verified: true,
  }),
];

const raw: CartelInput = {
  id: "rest-area",
  slug: "rest-area",
  name: "휴게소",
  summary:
    "고속도로 휴게소의 임대 구조가 어떻게 바뀌고 있는지. 여덟 곳에서 도는 시범까지이고, 값이 내렸는지는 아직 재지 않았습니다.",
  problems: [
    {
      id: "rp-tiers",
      text:
        "도로공사에서 운영업체를 거쳐 입점매장으로 이어지는 다단계 임대 구조였고, 단계마다 수수료가 붙었습니다. 그 수수료가 음식값에 얹힌다는 것이 이 구조를 손보는 이유로 제시됐습니다.",
      claimId: "ct-restarea-tiers",
    },
  ],
  milestoneIds: ["ct-restarea-direct"],
  openQuestions: [
    "시범 이후 실제로 값이 내렸는지 확인하지 못했습니다. 자료가 말하는 것은 “낮아질 것으로 기대한다”까지입니다.",
    "전국 휴게소가 몇 곳이고 여덟 곳이 그중 얼마인지 확인하지 못했습니다.",
    "수수료율이 기존에 얼마였고 직계약에서 얼마가 되는지, 구체적인 수치를 찾지 못했습니다.",
    "도로공사 발표 원문을 찾지 못해 보도로 대신했습니다.",
  ],
  sourceNote:
    "한국도로공사의 직계약 시범 도입을 보도로 확인했습니다. 값에 미친 영향은 " +
    "아직 측정되지 않았습니다. 2026년 9월 21일 기준입니다.",
};

export const restArea: CartelEntry = {
  cartel: cartelSchema.parse(raw),
  claims,
  sources: [EX_RESTAREA_2026],
};
