/**
 * 통통(tt.jamtong.kr)의 청소년·청년 정책 항목을 잼통 정책 팩트로 옮긴다.
 *
 *   pnpm policies:tongtong [통통 저장소 경로]   (기본 ../tongtong)
 *
 * 통통 저장소의 `src/content/policies/raw.ts`를 읽어 공개(published) 항목만 골라
 * `src/content/policies/tongtong.generated.json`에 쓴다. 잼통 빌드는 이 스냅샷만 읽으므로
 * 통통 저장소가 없어도 배포된다. 통통 항목이 바뀌면 이 스크립트를 다시 돌린다.
 *
 * ★ 사실은 통통 것을 그대로 쓴다.
 *   claim 문장·출처·verified를 고치지 않는다. 고칠 것이 있으면 통통에서 고치고 다시 가져온다.
 *   잼통에서만 덧붙이는 것(도는 주장)은 `tongtong.ts`에 둔다.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const TONGTONG_URL = "https://tt.jamtong.kr";
const OUT = resolve(import.meta.dirname, "../src/content/policies/tongtong.generated.json");

/** 통통 분류 → 잼통 분야. 사람에게 직접 가는 지원이라 모두 welfare이고, 돈·일·창업은 economy를 더한다. */
const CATEGORIES: Record<string, string[]> = {
  asset: ["welfare", "economy"],
  housing: ["welfare"],
  employment: ["welfare", "economy"],
  startup: ["economy", "welfare"],
  transport: ["welfare"],
  culture: ["welfare"],
  education: ["welfare"],
};

const EVENT_LABEL: Record<string, string> = {
  introduced: "도입",
  expanded: "확대",
  changed: "변경",
  renamed: "이름 변경",
  ended: "종료",
};

type Claim = {
  id: string;
  text: string;
  assertionType: string;
  assertedBy?: string;
  sourceIds: string[];
  verified?: boolean;
  validUntil?: string;
};
type TongtongPolicy = {
  id: string;
  publishStatus?: string;
  audience: string[];
  category: string;
  name: string;
  summary?: string;
  claims: Claim[];
  counterpoints?: Claim[];
  sources: ({ id: string } & Record<string, unknown>)[];
  policy: {
    history: { date: string; kind: string; summary: string; sourceIds: string[] }[];
    applications: { label: string; startAt: string; endAt: string; note?: string; sourceIds: string[] }[];
  };
  reviewedAt: string;
};

/** 어떤 출처를 쓰는 claim들. 경과 표의 각주를 claim에서 끌어오기 위해서다. */
function claimsCiting(claims: Claim[], sourceIds: string[]): string[] {
  return claims.filter((c) => c.sourceIds.some((id) => sourceIds.includes(id))).map((c) => c.id);
}

function convert(p: TongtongPolicy) {
  // 출처 id는 통통 항목끼리 겹친다(같은 보도자료를 여러 항목이 쓴다). 잼통은 출처를 전역으로 모으므로 항목 id를 앞에 붙인다.
  const sourceId = (id: string) => `tt-${p.id}--${id}`;
  const counterpoints = p.counterpoints ?? [];
  const claims = [...p.claims, ...counterpoints].map((c) => ({ ...c, sourceIds: c.sourceIds.map(sourceId) }));
  const audience = p.audience.includes("youth") ? (p.audience.includes("young_adult") ? "청소년·청년" : "청소년") : "청년";
  const timeline = [
    ...p.policy.history.map((event, i) => ({
      id: `t-history-${i + 1}`,
      date: event.date,
      datePrecision: "day",
      title: EVENT_LABEL[event.kind] ?? event.kind,
      summary: event.summary,
      claimIds: claimsCiting(claims, event.sourceIds.map(sourceId)),
    })),
    ...p.policy.applications.map((app, i) => ({
      id: `t-apply-${i + 1}`,
      date: app.startAt.slice(0, 10),
      datePrecision: "day",
      title: `신청 (${app.label})`,
      summary: `${app.startAt.slice(0, 10)} ~ ${app.endAt.slice(0, 10)}.${app.note ? ` ${app.note}` : ""}`,
      claimIds: claimsCiting(claims, app.sourceIds.map(sourceId)),
    })),
  ];
  return {
    slug: p.id,
    title: p.name,
    scope: `${audience} 정책 — ${(p.summary ?? p.name).replace(/\.$/, "")}`,
    ministries: [],
    categories: CATEGORIES[p.category] ?? ["welfare"],
    asOf: p.reviewedAt,
    claims,
    critiqueIds: counterpoints.map((c) => c.id),
    sources: p.sources.map((source) => ({ ...source, id: sourceId(source.id) })),
    timeline,
    origin: { name: "통통", url: `${TONGTONG_URL}/policy/${p.id}` },
  };
}

async function main() {
  const repo = resolve(process.argv[2] ?? resolve(import.meta.dirname, "../../tongtong"));
  const raw = pathToFileURL(resolve(repo, "src/content/policies/raw.ts")).href;
  const { RAW_POLICIES } = (await import(raw)) as { RAW_POLICIES: TongtongPolicy[] };

  const published = RAW_POLICIES.filter((p) => p.publishStatus === "published");
  const policies = published.map(convert).sort((a, b) => a.slug.localeCompare(b.slug));

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(policies, null, 2) + "\n");
  const claims = policies.reduce((n, p) => n + p.claims.length, 0);
  console.log(`통통 항목 ${RAW_POLICIES.length}개 중 공개 ${published.length}개, claim ${claims}개 → ${OUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
