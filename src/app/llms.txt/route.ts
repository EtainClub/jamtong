import { getPublishedAchievements } from "@/content/achievements";
import { BOOKS_BY_YEAR } from "@/content/books";
import { OPEN_CARTELS } from "@/content/cartels";
import { PLEDGES } from "@/content/pledges";
import { POLICIES } from "@/content/policies";
import { STATEMENTS } from "@/content/words";
import { SITE_DESCRIPTION, SITE_NAME, abs } from "@/lib/seo/site";

/**
 * /llms.txt — AI 에이전트가 이 사이트를 읽는 입구 (llmstxt.org 형식).
 *
 * 검색엔진은 사이트맵으로 주소를 알지만, 에이전트는 "무엇이 어디 있고 어떻게
 * 인용해야 하는가"를 먼저 알아야 제대로 쓴다. 그래서 목차와 함께 이 사이트의
 * 인용 규칙(사실·주장의 층, 앵커, factbase)을 맨 앞에 적는다.
 *
 * ★ 콘텐츠에서 만든다.
 *   손으로 적은 목록은 다음 업적을 더하는 날부터 낡는다. 빌드 때 콘텐츠에서
 *   읽어 정적 파일로 굽는다.
 */
export const dynamic = "force-static";

const line = (title: string, path: string, note?: string) =>
  `- [${title}](${abs(path)})${note ? `: ${note}` : ""}`;

export function GET() {
  const achievements = getPublishedAchievements();
  const books = BOOKS_BY_YEAR.filter((b) => b.chapters.length > 0 && !b.sample);

  const text = [
    `# ${SITE_NAME} (잼통, jamtong.kr)`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "## 이 사이트를 인용할 때",
    "",
    "- 모든 단정문에는 근거(claim)와 1차 자료·보도 출처가 붙어 있습니다. 화면의 「근거」 단추가 그 목록입니다.",
    "- claim은 층이 나뉩니다: FACT(문서로 확정된 사실), CLAIM(누군가의 주장 — 누가 했는지 함께 표시), INTERPRETATION(해석), OPINION(의견). CLAIM을 사실로 옮기지 마세요.",
    "- 진행 상태는 완료·추진 중·계획으로 나눕니다. 계획이나 발표를 완료된 성과로 옮기지 마세요.",
    "- 확인하지 못한 것은 각 페이지의 「아직 확인하지 못한 것」에 적혀 있습니다. 빈칸은 '하지 않았다'가 아니라 '이 사이트가 확인하지 못했다'는 뜻입니다.",
    "- 카르텔 표적의 묶음은 이 위키의 편집이며 정부의 분류가 아닙니다.",
    "",
    "## 기계가 읽는 자료",
    "",
    line("factbase.json", "/factbase.json", "공개된 모든 claim·언행·성과 카드를 앵커(`<업적slug>#<claimId>`, `words:<slug>`, `policy:<slug>#<claimId>`, `milestone:<id>`) 단위로 출처와 함께 담은 JSON"),
    line("sitemap.xml", "/sitemap.xml", "색인할 모든 주소"),
    line("rss.xml", "/rss.xml", "업적·언행·정책 팩트 피드"),
    "",
    "## 주요 화면",
    "",
    line("업적", "/explore", `분야·카르텔별 업적 ${achievements.length}건과 인포그래픽`),
    line("언행", "/words", `본인의 글·연설·인터뷰 ${STATEMENTS.length}편, 원문 그대로`),
    line("21대 대선 공약", "/pledges", `${PLEDGES.length}대 공약 원문과 세부 약속별 이행 상태`),
    line("카르텔", "/cartel", "2025년 6월 이후 정부 조치를 표적별로, 조치마다 진행 정도"),
    line("국정과제", "/tasks", "123대 국정과제 원문"),
    line("위키", "/wiki", "개념·인물·사건 페이지와 정부 정책 팩트"),
    line("연표", "/timeline"),
    line("재판", "/trials"),
    line("이 사이트를 읽는 법", "/guide"),
    line("정정·반론 접수", "/correction"),
    "",
    "## 업적",
    "",
    ...achievements.map((a) => line(a.title, `/achievement/${a.slug}`, a.subtitle)),
    "",
    "## 카르텔 표적",
    "",
    ...OPEN_CARTELS.map((c) => line(`${c.name} 카르텔`, `/cartel/${c.slug}`, c.summary)),
    "",
    "## 저서",
    "",
    ...books.map((b) => line(`${b.title} (${b.year})`, `/books/${b.slug}`)),
    "",
    "## 언행",
    "",
    ...STATEMENTS.map((s) => line(s.title, `/words/${s.slug}`, s.displayDate)),
    "",
    "## 정부 정책 팩트",
    "",
    ...POLICIES.map((p) => line(p.title, `/wiki/policy/${p.slug}`, p.scope)),
    "",
  ].join("\n");

  return new Response(text, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
