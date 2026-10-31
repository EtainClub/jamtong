import { ACHIEVEMENTS } from "@/content/achievements";
import { ALL_CLAIMS, MILESTONES } from "@/content/milestones";

import { collusion } from "./collusion";
import { medical } from "./medical";
import { telecom } from "./telecom";
import { restArea } from "./rest-area";
import { revolvingDoor } from "./revolving-door";
import { localEstablishment } from "./local-establishment";
import { refinery } from "./refinery";
import { finance } from "./finance";
import { bureaucracy } from "./bureaucracy";
import { education } from "./education";
import { construction } from "./construction";
import { PENDING_CARTELS } from "./pending";
import {
  GOV_START,
  isOpen,
  validateCartel,
  type Cartel,
  type CartelEntry,
} from "./schema";
import type { DatePrecision, MilestoneStatus } from "@/content/schema";

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
  localEstablishment,
  refinery,
  finance,
  bureaucracy,
  education,
  construction,
  /* 언론 — 이 정부의 조치로 근거가 서지 않았다. */
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
  milestoneDates: new Map(MILESTONES.map((m) => [m.id, m.date])),
  achievementClaimRefs: new Set(
    ACHIEVEMENTS.flatMap((a) =>
      a.claims.filter((c) => c.verified).map((c) => `${a.slug}#${c.id}`),
    ),
  ),
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

/* ── 진행 정도 ──────────────────────────────────────────────────── */

/**
 * 표적 하나의 진행 정도.
 *
 * 카르텔은 한 번에 깨지지 않는다. 법이 통과되고, 시행되고, 첫 선발을 하고,
 * 효과가 재지는 데까지 단계가 있다. 그래서 표적을 "깼다/못 깼다"로 칠하지
 * 않고, 걸린 조치를 하나씩 세어 완료·추진 중·계획으로 나눈다. 공약 이행
 * 현황과 같은 방식이다.
 *
 * 단위는 조치다 — 성과 카드 하나, 또는 업적에서 꺼낸 조치 하나. 업적 전체를
 * 한 칸으로 세지 않는다.
 */
export interface ProgressItem {
  id: string;
  title: string;
  status: MilestoneStatus;
  date: string;
  datePrecision: DatePrecision;
  note?: string;
  /** 근거 서랍을 열 claim. */
  claimId: string;
  claimSourceCount: number;
  /** 업적에서 꺼낸 조치면 그 업적. */
  achievement?: { slug: string; title: string };
  highlight?: { value: string; label: string };
}

export interface ProgressCount {
  done: number;
  ongoing: number;
  planned: number;
  total: number;
}

const STATUS_ORDER: Record<MilestoneStatus, number> = { done: 0, ongoing: 1, planned: 2 };

export function cartelProgress(cartel: Cartel): ProgressItem[] {
  const fromMilestones = cartel.milestoneIds.flatMap((id): ProgressItem[] => {
    const m = MILESTONES.find((x) => x.id === id);
    if (!m) return [];
    const claim = ALL_CLAIMS.find((c) => c.id === m.claimIds[0]);
    return [
      {
        id: m.id,
        title: m.title,
        status: m.status,
        date: m.date,
        datePrecision: m.datePrecision,
        note: m.summary,
        claimId: m.claimIds[0],
        claimSourceCount: claim?.sourceIds.length ?? 0,
        highlight: m.highlight,
      },
    ];
  });

  const fromAchievements = cartel.measures.flatMap((measure): ProgressItem[] => {
    const [slug, claimId] = measure.ref.split("#");
    const a = ACHIEVEMENTS.find((x) => x.slug === slug);
    const claim = a?.claims.find((c) => c.id === claimId);
    if (!a || !claim) return [];
    return [
      {
        id: measure.id,
        title: measure.title,
        status: measure.status,
        date: measure.date,
        datePrecision: measure.datePrecision,
        note: measure.note,
        claimId,
        claimSourceCount: claim.sourceIds.length,
        achievement: { slug: a.slug, title: a.title },
      },
    ];
  });

  return [...fromMilestones, ...fromAchievements].sort(
    (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || a.date.localeCompare(b.date),
  );
}

export function countProgress(items: ProgressItem[]): ProgressCount {
  return {
    done: items.filter((i) => i.status === "done").length,
    ongoing: items.filter((i) => i.status === "ongoing").length,
    planned: items.filter((i) => i.status === "planned").length,
    total: items.length,
  };
}

export { GOV_START, isOpen };
export type { Cartel, CartelEntry };
