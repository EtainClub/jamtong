import packageJson from "../../../package.json";

import { getPublishedAchievements } from "@/content/achievements";
import { COLLECTIONS } from "@/content/milestones";
import { POLICIES } from "@/content/policies";
import type { Claim, Source } from "@/content/schema";
import { STATEMENTS } from "@/content/words";

/**
 * factbase — 바깥 도구(인스타그램 근거 안내봇)가 읽는 근거 묶음.
 *
 * ★ 공개된 것만 담는다.
 *   draft 업적은 빠진다. 이 파일은 누구나 받을 수 있으므로, 화면에 없는 것이
 *   여기로 새면 공개 전 자료가 공개되는 셈이다.
 *
 * ★ 단위는 앵커다.
 *   위키 앵커와 같은 형식을 쓴다(`AGENTS.md`). 받는 쪽은 여기 있는 앵커만
 *   인용할 수 있고, 없는 앵커를 인용한 판정은 버린다. 그래서 id를 지어낼
 *   자리가 없다 — `/api/ask`가 후보에서만 고르게 하는 것과 같은 원리다.
 *
 * ★ assertionType을 그대로 넘긴다.
 *   CLAIM을 평서문으로 옮기면 남의 주장이 우리 사실이 된다. 받는 쪽이 그것을
 *   가릴 수 있도록 누구의 주장인지까지 함께 넘긴다.
 *
 * 성과 카드는 위키 앵커 형식에 없어서 `milestone:<id>`를 새로 쓴다.
 * 정부 정책 팩트는 위키 앵커와 같은 `policy:<slug>#<claimId>`를 쓴다.
 */

export interface FactSource {
  id: string;
  title: string;
  publisher: string;
  url?: string;
  publishedAt?: string;
  license: Source["license"];
}

export interface FactEntry {
  anchor: string;
  kind: "claim" | "words" | "words-point" | "milestone";
  title: string;
  text: string;
  assertionType?: Claim["assertionType"];
  assertedBy?: string;
  status?: "done" | "ongoing" | "planned";
  /** 근거 시점. 근거 자료의 발행일, 카드 날짜, 언행 날짜 중 하나. 없으면 비운다. */
  date?: string;
  sources: FactSource[];
  /** jamtong.kr 기준 경로. */
  path: string;
  categories: string[];
}

export interface Factbase {
  version: string;
  builtAt: string;
  entries: FactEntry[];
}

function toFactSource(source: Source): FactSource {
  return {
    id: source.id,
    title: source.title,
    publisher: source.publisher,
    url: source.url,
    publishedAt: source.publishedAt,
    license: source.license,
  };
}

/** 가장 최근 발행일. claim에는 날짜가 없으므로 근거 자료에서 가져온다. */
function latestDate(sources: FactSource[]): string | undefined {
  const dates = sources.map((s) => s.publishedAt).filter((d): d is string => Boolean(d));
  return dates.sort().at(-1);
}

function claimEntries(
  claims: Claim[],
  sources: Source[],
  anchorOf: (claim: Claim) => string,
  title: string,
  path: string,
  categories: string[],
): FactEntry[] {
  const byId = new Map(sources.map((s) => [s.id, s]));
  return claims.map((claim) => {
    const cited = claim.sourceIds
      .map((id) => byId.get(id))
      .filter((s): s is Source => Boolean(s))
      .map(toFactSource);
    return {
      anchor: anchorOf(claim),
      kind: "claim",
      title,
      text: claim.text,
      assertionType: claim.assertionType,
      assertedBy: claim.assertedBy,
      date: latestDate(cited),
      sources: cited,
      path,
      categories,
    };
  });
}

export function buildFactbase(): Factbase {
  const entries: FactEntry[] = [];

  for (const achievement of getPublishedAchievements()) {
    entries.push(
      ...claimEntries(
        achievement.claims,
        achievement.sources,
        (claim) => `${achievement.slug}#${claim.id}`,
        achievement.title,
        `/achievement/${achievement.slug}`,
        achievement.categories,
      ),
    );
  }

  for (const statement of STATEMENTS) {
    const path = `/words/${statement.slug}`;
    const sources: FactSource[] = statement.url
      ? [
          {
            id: `words:${statement.slug}`,
            title: statement.title,
            publisher: statement.channel,
            url: statement.url,
            publishedAt: statement.postedAt,
            license: "quotable",
          },
        ]
      : [];
    entries.push({
      anchor: `words:${statement.slug}`,
      kind: "words",
      title: statement.title,
      // 원문이 길어도 자르지 않는다. 언행은 원문이 곧 근거다.
      text: statement.body ?? statement.overview ?? "",
      date: statement.postedAt,
      sources,
      path,
      categories: statement.topics,
    });
    for (const point of statement.easy?.points ?? []) {
      entries.push({
        anchor: `words:${statement.slug}#${point.id}`,
        kind: "words-point",
        title: `${statement.title} — ${point.title}`,
        // 요약이 아니라 원문 대목을 근거로 넘긴다. 요약은 우리가 쓴 글이다.
        text: point.quote,
        date: statement.postedAt,
        sources,
        path,
        categories: statement.topics,
      });
    }
  }

  for (const collection of COLLECTIONS) {
    const claimsById = new Map(collection.claims.map((c) => [c.id, c]));
    const sourcesById = new Map(collection.sources.map((s) => [s.id, s]));
    for (const milestone of collection.milestones) {
      const claims = milestone.claimIds
        .map((id) => claimsById.get(id))
        .filter((c): c is Claim => Boolean(c));
      const cited = [...new Set(claims.flatMap((c) => c.sourceIds))]
        .map((id) => sourcesById.get(id))
        .filter((s): s is Source => Boolean(s))
        .map(toFactSource);
      // 카드의 claim이 하나라도 CLAIM이면 카드 전체를 CLAIM으로 넘긴다. 약한 쪽을 따른다.
      const weakest = claims.find((c) => c.assertionType !== "FACT");
      entries.push({
        anchor: `milestone:${milestone.id}`,
        kind: "milestone",
        title: milestone.title,
        text: [milestone.summary, ...claims.map((c) => c.text)].join("\n"),
        assertionType: weakest?.assertionType ?? "FACT",
        assertedBy: weakest?.assertedBy,
        status: milestone.status,
        date: milestone.date,
        sources: cited,
        path: milestone.achievementSlug ? `/achievement/${milestone.achievementSlug}` : "/",
        categories: milestone.categories,
      });
    }
  }

  /*
   * 정부 정책 팩트. 대통령의 업적·언행과 따로 쌓이는 근거다. kind는 업적과 같은
   * "claim"으로 넘기고, 앵커 접두사(`policy:`)로 구별한다 — 받는 쪽 스키마를
   * 바꾸지 않아도 된다.
   */
  for (const policy of POLICIES) {
    entries.push(
      ...claimEntries(
        policy.claims,
        policy.sources,
        (claim) => `policy:${policy.slug}#${claim.id}`,
        policy.title,
        `/wiki/policy/${policy.slug}`,
        policy.categories,
      ),
    );
  }

  const seen = new Set<string>();
  for (const entry of entries) {
    if (seen.has(entry.anchor)) {
      throw new Error(`factbase: 앵커가 겹친다 — ${entry.anchor}`);
    }
    seen.add(entry.anchor);
  }

  return {
    version: packageJson.version,
    builtAt: new Date().toISOString(),
    entries,
  };
}
