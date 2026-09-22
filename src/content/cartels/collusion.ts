import { claimSchema } from "@/content/schema";
import { KOREA_COLLUSION_2026 } from "@/content/sources";

import { cartelSchema, type CartelEntry, type CartelInput } from "./schema";

/**
 * 담합 — 카드뉴스에 없던 표적인데 맨 앞에 둔다.
 *
 * 대통령이 담합을 두고 실제로 이름을 댄 유일한 묶음이기 때문이다. 나머지
 * 열하나는 지지자 카드뉴스의 편집이지만, 이 표적만은 정부 자료에 그대로
 * 적혀 있다.
 *
 * ★ 문제 문장을 우리 말로 쓰지 않는다.
 *   "담합이 뿌리 깊게 퍼져 있다"는 검증된 사실이 아니라 대통령의 규정이다.
 *   그래서 CLAIM으로 싣고 누가 한 말인지 밝힌다. 이 위키가 같은 말을 제
 *   목소리로 하면 그 순간 근거 없는 진단이 된다.
 *
 * ★ 여기 걸린 카드는 전부 계획이다.
 *   공정위의 셋은 법과 고시를 고치겠다는 것이고 하나는 2027년 1월 시행
 *   예정이다. 화면이 '지금까지'와 '진행 중·계획'을 나눠 그리므로 성과 칸에는
 *   아무것도 서지 않는다 — 그게 이 표적의 현재 모습이다.
 */

const claims = [
  claimSchema.parse({
    id: "ct-collusion-president",
    text:
      "이재명 대통령은 2026년 2월 19일 수석보좌관회의에서 “시장 지배력을 악용한 이런 담합 행위는 공정한 경쟁을 가로막고 시장 신뢰를 훼손하며 국민경제 발전을 방해하는 암적 존재”라고 말했다. 설탕·밀가루·육고기·교복·부동산 등 경제·산업 전반에 반시장적 담합이 뿌리 깊게 퍼져 있다고 밝히고, 담합 이득을 훨씬 넘어서는 무거운 제재가 뒤따라야 하며 반복될 경우 시장에서 영구적으로 퇴출시키는 방안도 적극 검토해야 한다고 말했다.",
    assertionType: "CLAIM",
    assertedBy: "이재명 대통령",
    sourceIds: [KOREA_COLLUSION_2026.id],
    verified: true,
  }),
];

const raw: CartelInput = {
  id: "collusion",
  slug: "collusion",
  name: "담합",
  summary:
    "값을 맞춰 놓고 파는 일을 어떻게 다루는지. 대통령이 이름을 댄 분야는 설탕·밀가루·육고기·교복·부동산입니다.",
  problems: [
    {
      id: "cp-scope",
      text:
        "대통령은 2026년 2월 19일 담합을 ‘암적 존재’로 규정하고, 설탕·밀가루·육고기·교복·부동산 등 경제·산업 전반에 뿌리 깊게 퍼져 있다고 말했습니다. 이것은 본인의 규정이며, 각 분야에 실제로 담합이 얼마나 있는지를 이 위키가 따로 대조한 것은 아닙니다.",
      claimId: "ct-collusion-president",
      headline: "암적 존재",
      tags: ["설탕", "밀가루", "육고기", "교복", "부동산"],
    },
  ],
  milestoneIds: ["ct-ftc-repeat", "ct-ftc-structural", "ct-ftc-bidding"],
  openQuestions: [
    "공정위가 지난 1년간 적발했다는 담합 규모를 1차 자료로 대조하지 못했습니다.",
    "대통령이 이름을 댄 다섯 분야(설탕·밀가루·육고기·교복·부동산) 각각에서 실제로 어떤 제재가 있었는지 확인하지 못했습니다.",
    "공정위 2026년 하반기 업무계획과 고시 개정안의 원문을 찾지 못해 보도로 대신했습니다.",
  ],
  sourceNote:
    "대통령 발언은 정책브리핑에서, 공정위 조치는 보도에서 확인했습니다. " +
    "여기 걸린 카드는 모두 계획이며 시행된 것이 아닙니다. 2026년 9월 21일 기준입니다.",
};

export const collusion: CartelEntry = {
  cartel: cartelSchema.parse(raw),
  claims,
  sources: [KOREA_COLLUSION_2026],
};
