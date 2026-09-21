import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { Script } from "node:vm";
import ts from "typescript";

/**
 * 실제 라우트 파일을 실행하는 SEO 정책 단위 검사.
 * 콘텐츠와 UI 의존성만 fixture로 대체한다. Firebase 자격 증명은 필요 없다.
 * 타입 검사, 전체 콘텐츠 검사, Next 빌드 및 HTML/XML 출력 검증을 대신하지 않는다.
 */
function loadModule(path, dependencies) {
  const filename = fileURLToPath(new URL(`../${path}`, import.meta.url));
  const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
    fileName: filename,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  });
  const errors = (compiled.diagnostics ?? []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );
  assert.equal(errors.length, 0, `${path}: TypeScript 구문 오류`);

  const sandboxModule = { exports: {} };
  new Script(compiled.outputText, { filename }).runInNewContext(
    {
      module: sandboxModule,
      exports: sandboxModule.exports,
      URLSearchParams,
      require(id) {
        assert.ok(Object.hasOwn(dependencies, id), `${path}: 미등록 의존성 ${id}`);
        return dependencies[id];
      },
    },
    { timeout: 1000 },
  );
  return sandboxModule.exports;
}

const SITE_URL = "https://example.test";
const abs = (path) => new URL(path, SITE_URL).href;
const site = { SITE_URL, abs };
const entries = loadModule("src/app/sitemap.ts", {
  "@/lib/seo/site": site,
  "@/content/achievements": {
    getPublishedAchievements: () => [{ slug: "published-fixture" }],
    // 기존 버그가 재발하면 아래 사건일이 lastModified에 들어가 검사가 실패한다.
    latestEventDate: () => "2010-01-01",
  },
  "@/content/words": {
    STATEMENTS: [{ slug: "statement-fixture", postedAt: "2014-06-01" }],
  },
  "@/content/books": {
    BOOKS_BY_YEAR: [
      { slug: "book-fixture", chapters: [{ slug: "intro" }] },
      { slug: "empty-fixture", chapters: [] },
      { slug: "sample-fixture", sample: true, chapters: [{ slug: "intro" }] },
    ],
  },
  "@/content/cartels": {
    // 목록에 이름만 선 표적은 `OPEN_CARTELS`에서 이미 빠져 나온다.
    // 사이트맵이 지키는 것은 "받은 것만 싣고 날짜를 지어내지 않는다"까지다.
    OPEN_CARTELS: [{ slug: "cartel-fixture" }],
  },
  "@/lib/wiki/load": {
    contentPages: () => [
      { name: "concept/fixture", kind: "concept", updated: "2026-09-20" },
      { name: "concept/no-date", kind: "concept" },
      { name: "concept/bad-date", kind: "concept", updated: "not-a-date" },
      { name: "log", kind: "event", updated: "2026-09-20" },
    ],
  },
}).default();
const entryAt = (path) => {
  const entry = entries.find((item) => item.url === abs(path));
  assert.ok(entry, `사이트맵에 ${path}가 있어야 한다`);
  return entry;
};

for (const path of ["/achievement/published-fixture", "/words/statement-fixture"]) {
  test(`${path}: 사건일/발언일을 수정일로 보내지 않는다`, () => {
    assert.equal(entryAt(path).lastModified, undefined);
  });
}

test("위키의 실제 편집일은 보존한다", () => {
  assert.equal(
    entryAt("/wiki/concept/fixture").lastModified.toISOString(),
    "2026-09-20T00:00:00.000Z",
  );
});

test("수정일을 모르면 날짜를 만들어 넣지 않는다", () => {
  for (const path of [
    "/",
    "/books/book-fixture",
    "/books/book-fixture/intro",
    "/wiki/concept/no-date",
    "/wiki/concept/bad-date",
    "/cartel/cartel-fixture",
  ]) {
    assert.equal(entryAt(path).lastModified, undefined, path);
  }
});

test("계정/공유 URL과 로그/빈 책/샘플 책은 사이트맵에서 제외한다", () => {
  for (const path of [
    "/my",
    "/s/published-fixture",
    "/wiki/log",
    "/books/empty-fixture",
    "/books/sample-fixture",
    "/books/sample-fixture/intro",
  ]) {
    assert.equal(entries.some((entry) => entry.url === abs(path)), false, path);
  }
});

test("사이트맵 URL은 중복·쿼리 없는 절대 주소다", () => {
  assert.equal(new Set(entries.map((entry) => entry.url)).size, entries.length);
  for (const { url } of entries) {
    const parsed = new URL(url);
    assert.equal(parsed.origin, SITE_URL);
    assert.equal(parsed.search, "");
    assert.equal(parsed.hash, "");
  }
});

const robots = loadModule("src/app/robots.ts", { "@/lib/seo/site": site }).default();
const rules = Array.isArray(robots.rules) ? robots.rules : [robots.rules];
const wildcard = rules.find((rule) => [rule.userAgent].flat().includes("*"));
assert.ok(wildcard, "모든 크롤러에 적용되는 기본 규칙이 있어야 한다");
const disallowed = [wildcard.disallow ?? []].flat().filter(Boolean);

// 이 프로젝트의 prefix 규칙뿐 아니라 '*'와 끝의 '$'도 검사한다.
function matchesRule(pattern, path) {
  const anchored = pattern.endsWith("$");
  const body = anchored ? pattern.slice(0, -1) : pattern;
  const escaped = body
    .split("*")
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  return new RegExp(`^${escaped}${anchored ? "$" : ""}`).test(path);
}

for (const path of [
  "/my",
  "/s/published-fixture",
  "/api/share-card?slug=published-fixture",
  "/_next/static/chunks/main.js",
]) {
  test(`${path}: noindex와 공유 자원을 읽을 수 있도록 차단하지 않는다`, () => {
    assert.ok([wildcard.allow].flat().includes("/"));
    assert.equal(disallowed.some((pattern) => matchesRule(pattern, path)), false);
  });
}

test("robots.txt는 절대 주소로 사이트맵을 안내한다", () => {
  assert.equal(robots.sitemap, abs("/sitemap.xml"));
});

test("MY의 noindex/nofollow는 유지한다", () => {
  const { metadata } = loadModule("src/app/my/page.tsx", {
    "react/jsx-runtime": {},
    "@/features/app/AppTopBar": {},
    "@/features/app/BottomNav": {},
    "@/features/my/MyPanel": {},
  });
  assert.equal(metadata.robots.index, false);
  assert.equal(metadata.robots.follow, false);
});

test("공유 페이지의 noindex, canonical, 상태별 OG 카드를 유지한다", async () => {
  const { generateMetadata } = loadModule("src/app/s/[slug]/page.tsx", {
    "react/jsx-runtime": {},
    "next/link": {},
    "next/navigation": {},
    "@/features/app/BackButton": {},
    "@/features/achievement/ShareLanding": {},
    "@/lib/og/share-state": {
      resolveShare: () => ({ achievement: { title: "Fixture", subtitle: "Details" } }),
      shareSummary: () => "Fixture summary",
      isStateful: () => false,
    },
  });
  const metadata = await generateMetadata({
    params: Promise.resolve({ slug: "published-fixture" }),
    searchParams: Promise.resolve({ view: "full", focus: "node", ignored: "value" }),
  });
  assert.equal(metadata.robots.index, false);
  assert.equal(metadata.robots.follow, true);
  assert.equal(metadata.alternates.canonical, "/achievement/published-fixture");
  const card = new URL(metadata.openGraph.images[0].url, SITE_URL);
  assert.equal(card.pathname, "/api/share-card");
  assert.equal(card.searchParams.get("view"), "full");
  assert.equal(card.searchParams.get("focus"), "node");
  assert.equal(card.searchParams.has("ignored"), false);
});
