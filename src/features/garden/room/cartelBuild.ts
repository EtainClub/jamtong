import { CARTELS, cartelProgress, countProgress, isOpen } from "@/content/cartels";

import type { CartelCardInfo } from "./cartelInfo";

/** 카르텔 카드가 보여 줄 요약을 콘텐츠에서 굽는다(서버). /garden/cartels.json이 부른다. */
export function buildCartelCards(): CartelCardInfo[] {
  return CARTELS.map((c) => ({
    slug: c.slug,
    name: c.name,
    summary: c.summary,
    open: isOpen(c),
    progress: countProgress(cartelProgress(c)),
    // 무엇이 문제인가 — 문장마다 근거 claim이 걸린 것(카르텔 페이지와 같은 문장). 카드에는 둘까지.
    problems: c.problems.slice(0, 2).map((p) => ({ ...(p.headline ? { headline: p.headline } : {}), text: p.text })),
  }));
}
