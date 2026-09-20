import { ACHIEVEMENTS } from "@/content/achievements";
import { STATEMENTS } from "@/content/words";
import { ALL_SOURCES } from "@/content/milestones";

/**
 * 위키 앵커를 사이트의 실제 자리로 잇는다.
 *
 * 위키는 모든 단정문에 `^[...]`로 근거를 단다(AGENTS.md「LLM Wiki」).
 * 그 앵커가 화면에서도 링크로 살아 있어야 읽는 사람이 위키를 믿지 않고
 * 대볼 수 있다. 믿게 만드는 것이 아니라 확인하게 만드는 것이 이 위키의
 * 전부다.
 *
 * 앵커의 실재는 `pnpm wiki:lint` 검사 ①이 이미 보장한다. 여기서는 없는
 * 앵커를 만나면 링크 없이 글자만 남긴다 — 화면이 죽지는 않게.
 */

export interface ResolvedAnchor {
  raw: string;
  /** 각주에 적을 이름. */
  label: string;
  /** 무엇을 가리키는지. */
  kind: "업적" | "언행" | "자료";
  href?: string;
  external?: boolean;
  /** claim id처럼 페이지 안의 어느 대목인지. 링크로 만들 자리는 아직 없다. */
  detail?: string;
}

const achievementTitle = new Map(ACHIEVEMENTS.map((a) => [a.slug, a.title]));
const statementTitle = new Map(STATEMENTS.map((s) => [s.slug, s.title]));

/** 1차 자료는 업적 안에도, 공유 레지스트리에도 있다. 둘 다 본다. */
const sourceById = new Map<string, { title: string; publisher: string; url?: string }>();
for (const source of ALL_SOURCES) {
  sourceById.set(source.id, source);
}
for (const achievement of ACHIEVEMENTS) {
  for (const source of achievement.sources) {
    if (!sourceById.has(source.id)) sourceById.set(source.id, source);
  }
}

export function resolveAnchor(raw: string): ResolvedAnchor {
  if (raw.startsWith("source:")) {
    const id = raw.slice("source:".length);
    const source = sourceById.get(id);
    return {
      raw,
      kind: "자료",
      label: source ? `${source.publisher} 『${source.title}』` : id,
      href: source?.url,
      external: true,
    };
  }

  if (raw.startsWith("words:")) {
    const [slug, point] = raw.slice("words:".length).split("#");
    const title = statementTitle.get(slug);
    return {
      raw,
      kind: "언행",
      label: title ? `「${title}」` : slug,
      href: title ? `/words/${slug}` : undefined,
      detail: point,
    };
  }

  const [slug, claim] = raw.split("#");
  const title = achievementTitle.get(slug);
  return {
    raw,
    kind: "업적",
    label: title ?? slug,
    href: title ? `/achievement/${slug}` : undefined,
    detail: claim,
  };
}
