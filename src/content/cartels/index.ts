import { ACHIEVEMENTS } from "@/content/achievements";
import { MILESTONES } from "@/content/milestones";

import { collusion } from "./collusion";
import { medical } from "./medical";
import { telecom } from "./telecom";
import { restArea } from "./rest-area";
import { revolvingDoor } from "./revolving-door";
import { construction } from "./construction";
import { localEstablishment } from "./local-establishment";
import { PENDING_CARTELS } from "./pending";
import { isOpen, validateCartel, type Cartel, type CartelEntry } from "./schema";

/**
 * 카르텔 레지스트리.
 *
 * ★ 순서를 손으로 정한다.
 *   업적은 최근 순으로 세우지만 카르텔에는 날짜가 없다. 무엇이 앞에 오는지는
 *   편집 판단이고, 그 판단이 코드에 보이는 편이 낫다. 맨 앞은 「담합」이다 —
 *   대통령이 실제로 이름을 댄 유일한 묶음이기 때문이다.
 *
 * ★ 열린 것과 빈 것을 섞지 않는다.
 *   목록 화면이 둘을 나눠 그린다. 빈 것을 위에 섞어 두면 열어 볼 것이 있는
 *   자리가 보이지 않는다.
 */
const REGISTERED: CartelEntry[] = [
  collusion,
  medical,
  telecom,
  restArea,
  revolvingDoor,
  construction,
  localEstablishment,
  /* 정유사 · 금융 · 관료 · 언론 · 교육 — 아직 근거가 서지 않았다. */
  ...PENDING_CARTELS,
];

export const CARTEL_ENTRIES: CartelEntry[] = REGISTERED;
export const CARTELS: Cartel[] = REGISTERED.map((e) => e.cartel);
export const CARTEL_CLAIMS = REGISTERED.flatMap((e) => e.claims);
export const CARTEL_SOURCES = REGISTERED.flatMap((e) => e.sources);

export function getCartelEntry(slug: string): CartelEntry | undefined {
  return REGISTERED.find((e) => e.cartel.slug === slug);
}

/** 화면이 둘을 나눠 그린다. 담을 것이 있는 쪽이 위다. */
export const OPEN_CARTELS: Cartel[] = CARTELS.filter(isOpen);
export const EMPTY_CARTELS: Cartel[] = CARTELS.filter((c) => !isOpen(c));

/**
 * 참조가 어긋나면 빌드를 세운다.
 *
 * 목록 페이지만 열어도 걸리게 하려고 레지스트리에서 한다. 업적 쪽과 같은
 * 방식이다 — 상세로 들어가야 알 수 있으면 늦다.
 */
const known = {
  achievementSlugs: new Set(ACHIEVEMENTS.map((a) => a.slug)),
  milestoneIds: new Set(MILESTONES.map((m) => m.id)),
};

const errors: string[] = [];
const seen = new Set<string>();
for (const entry of REGISTERED) {
  if (seen.has(entry.cartel.slug)) errors.push(`카르텔 슬러그가 중복이다: "${entry.cartel.slug}"`);
  seen.add(entry.cartel.slug);
  errors.push(...validateCartel(entry, known));
}
if (errors.length > 0) {
  throw new Error(`카르텔 자료 검증 실패:\n${errors.join("\n")}`);
}

export { isOpen };
export type { Cartel, CartelEntry };
