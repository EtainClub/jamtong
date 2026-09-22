import Link from "next/link";
import type { Metadata } from "next";

import {
  ACHIEVEMENTS,
  PART_LABELS,
  achievementParts,
  getPublishedAchievements,
} from "@/content/achievements";
import { BOOKS, hasChapters } from "@/content/books";
import { CARTELS, OPEN_CARTELS } from "@/content/cartels";
import { ALL_CLAIMS, ALL_SOURCES } from "@/content/milestones";
import { findScene, type SceneKind } from "@/content/schema";
import { STATEMENTS } from "@/content/words";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { GuideExplainer } from "@/features/guide/GuideExplainer";
import { buildGuideChapters, type AnchorSample } from "@/features/guide/storyboard";
import { contentPages } from "@/lib/wiki/load";

export const metadata: Metadata = {
  title: "둘러보기",
  description:
    "잼통이 무엇을 다루는지, 무엇을 얻어 갈 수 있는지, 무엇을 직접 해볼 수 있는지 3분 안내.",
  alternates: { canonical: "/guide" },
};

/**
 * 둘러보기 — 처음 온 사람을 위한 한 장.
 *
 * ★ `/about`과 하는 일이 다르다.
 *   저쪽은 "이 사이트가 무엇을 지키는가"(규칙·출처 원칙·빌드 정보)다. 규칙을
 *   먼저 읽고 싶은 사람은 적다. 처음 온 사람이 실제로 묻는 것은 "이게 뭔데",
 *   "뭘 얻지", "뭘 해보지" 셋이고, 그 셋에만 답한다. 규칙은 맨 아래에서
 *   `/about`으로 넘긴다. 두 장이 같은 말을 하면 곧 갈라진다.
 *
 * ★ 기능 목록을 쓰지 않는다.
 *   "지도·차트·AI 지원" 식으로 적으면 아무것도 전달되지 않는다. 대신 지금
 *   실제로 열리는 주소를 콘텐츠에서 골라 "여기서 지도를 끌어 보라"고 보낸다.
 *
 * ★ 숫자를 손으로 적지 않는다.
 *   여기 적히는 건수는 전부 콘텐츠에서 센다. 손으로 적으면 다음 업적이
 *   올라온 날부터 이 페이지가 거짓말을 시작한다.
 */

/** 그 장면을 가진 첫 공개 업적. 없으면 그 칸을 통째로 접는다 — 지어내지 않는다. */
function demoFor(kind: SceneKind) {
  return getPublishedAchievements().find((achievement) => findScene(achievement, kind));
}

interface Demo {
  verb: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}

/**
 * 해설 첫 장이 쓸 실물 하나.
 *
 * 숫자 → 근거 문장 → 원자료가 끝까지 이어지는 첫 업적에서 가져온다. 셋 중
 * 하나라도 끊기면 넘어가고, 끝내 없으면 첫 장을 세우지 않는다 — 사슬을
 * 설명하는 자리에 끊긴 예시를 세울 수는 없다.
 */
function anchorSample(): AnchorSample | undefined {
  for (const achievement of getPublishedAchievements()) {
    const key =
      achievement.keyNumbers.find((k) => k.id === achievement.headlineKeyNumberId) ??
      achievement.keyNumbers[0];
    if (!key) continue;
    const claim = achievement.claims.find((c) => c.id === key.claimId);
    if (!claim) continue;
    const source = achievement.sources.find((s) => s.id === claim.sourceIds[0]);
    if (!source) continue;

    return {
      number: key.prefix ? `${key.prefix} ${key.value}` : key.value,
      unit: key.unit,
      label: `${achievement.title} · ${key.label}`,
      claimText: claim.text,
      verified: claim.verified,
      sourcePublisher: source.publisher,
      sourceTitle: source.title,
    };
  }
  return undefined;
}

export default function GuidePage() {
  const published = getPublishedAchievements();

  const claimCount =
    ACHIEVEMENTS.reduce((n, a) => n + a.claims.length, 0) + ALL_CLAIMS.length;
  const sourceCount =
    ACHIEVEMENTS.reduce((n, a) => n + a.sources.length, 0) + ALL_SOURCES.length;
  const unverified =
    ACHIEVEMENTS.reduce((n, a) => n + a.claims.filter((c) => !c.verified).length, 0) +
    ALL_CLAIMS.filter((c) => !c.verified).length;

  const wikiPages = contentPages().filter((page) => page.name !== "log");
  const booksWithChapters = BOOKS.filter((book) => !book.sample && hasChapters(book));

  const map = demoFor("route-map");
  const flow = demoFor("money-flow");
  const track = demoFor("quantity-track");

  const demos: Demo[] = [
    map && {
      verb: "끌어 봅니다",
      title: map.title,
      body: "두 항로를 같은 지도 위에 겹쳐 둡니다. 어느 쪽이 얼마나 짧은지 글로 읽는 대신 손으로 돌려 봅니다.",
      href: `/achievement/${map.slug}`,
      cta: "지도 열기",
    },
    flow && {
      verb: "따라가 봅니다",
      title: flow.title,
      body: "돈이 어디서 나와 어디로 갔는지 한 화면에 흐르게 둡니다. 갈래마다 근거가 붙어 있습니다.",
      href: `/achievement/${flow.slug}`,
      cta: "흐름 보기",
    },
    track && {
      verb: "눌러 봅니다",
      title: track.title,
      body: "숫자 옆의 작은 버튼을 누르면 그 숫자가 어느 자료에서 나왔는지 그 자리에서 열립니다.",
      href: `/achievement/${track.slug}`,
      cta: "근거 열기",
    },
  ].filter((demo): demo is Demo => Boolean(demo));

  /*
   * 갈래. 각 줄은 "이 갈래가 어떤 질문에 답하는가"로 시작한다. 이름만 늘어놓으면
   * 업적과 언행과 위키가 왜 따로 있는지 알 수 없다 — 처음 온 사람이 가장 먼저
   * 막히는 자리다.
   */
  const layers: { q: string; label: string; body: string; count: string; href: string }[] = [
    {
      q: "무엇을 했나",
      label: "업적",
      body: "남이 확인해 준 사실을 한 편으로 묶고, 문장마다 자료를 매답니다.",
      count: `${published.length}편`,
      href: "/explore",
    },
    {
      q: "본인이 뭐라고 했나",
      label: "언행",
      body: "직접 공개적으로 한 말과 행동을 원문 그대로 둡니다. 고치지 않습니다.",
      count: `${STATEMENTS.length}편`,
      href: "/words",
    },
    {
      q: "같은 때에 무엇과 무엇이 있었나",
      label: "타임라인",
      body: "업적별 연표를 한 줄로 합칩니다. 누르면 그 업적의 바로 그 시점으로 갑니다.",
      count: "전체",
      href: "/timeline",
    },
    {
      q: "무엇을 겨냥한 일인가",
      label: "카르텔",
      body: "분야가 아니라 표적으로 업적을 가로질러 봅니다. 아직 비어 있는 갈래도 그대로 둡니다.",
      count: `${CARTELS.length}갈래 중 ${OPEN_CARTELS.length}갈래`,
      href: "/cartel",
    },
    {
      q: "한 편으로는 보이지 않는 이야기",
      label: "위키",
      body: "여러 업적에 걸친 맥락을 따로 쌓습니다. 에이전트가 쓰고 사람이 읽습니다.",
      count: `${wikiPages.length}쪽`,
      href: "/wiki",
    },
  ];

  /* 일곱 칸의 뜻. PART_LABELS와 같은 순서여야 한다. */
  const PART_NOTES = [
    "긴 설명을 짧은 말과 그림으로 옮긴 것",
    "언제 무슨 일이 있었는지",
    "직접 움직여 보는 지도·흐름·추이",
    "누가 누구와 어떻게 얽혀 있는지",
    "화면의 모든 단정이 가리키는 원자료",
    "물으면 화면이 그 장면으로 움직인다",
    "1분 안에 훑는 세로 영상",
  ];

  const partFill = PART_LABELS.map(
    (_, i) => published.filter((a) => achievementParts(a)[i]).length,
  );

  /*
   * 해설의 대본.
   *
   * 첫 장은 실제로 실려 있는 숫자 하나를 쓴다. 근거 규칙을 설명하는 자리에
   * 지어낸 예시를 세우면 그 자리에서 규칙을 어긴다.
   */
  const chapters = buildGuideChapters({
    anchor: anchorSample(),
    doors: layers.map((layer) => ({ id: layer.href, label: layer.label })),
    parts: PART_LABELS.map((label, i) => ({
      label,
      filled: partFill[i],
      total: published.length,
    })),
  });

  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-12 pt-6">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-ash">둘러보기</p>
        <h1 className="mt-1.5 text-2xl font-light tracking-[-0.02em] text-ink">
          처음 오셨나요
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-smoke">
          이재명 대통령이 한 일을 <strong className="font-semibold text-ink">근거와 함께</strong>{" "}
          보는 곳입니다. 요약해 드리는 대신, 화면에 뜬 숫자마다 어느 자료에서 나왔는지
          눌러서 확인할 수 있게 만들었습니다.
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-stone bg-stone">
          {[
            ["업적", `${published.length}편`],
            ["언행", `${STATEMENTS.length}편`],
            ["근거", `${claimCount}건`],
            ["자료", `${sourceCount}건`],
          ].map(([label, value]) => (
            <div key={label} className="bg-taupe px-4 py-3">
              <dt className="text-[11px] text-ash">{label}</dt>
              <dd className="tabular mt-0.5 text-[17px] font-bold text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        {/*
          * 그림이 먼저 온다.
          *
          * 이 사이트의 구조는 글로 적으면 세 절이지만 그림으로는 세 장이다.
          * 처음 온 사람은 글을 끝까지 읽지 않고, 읽더라도 "근거가 붙는다"가
          * 무슨 뜻인지 문장만으로는 서지 않는다. 대신 세 장을 통째로 지나쳐도
          * 아래 본문만으로 같은 것을 알 수 있게 둔다 — 그림은 입구이지
          * 관문이 아니다.
          */}
        <section aria-labelledby="guide-explainer" className="mt-10">
          <h2 id="guide-explainer" className="text-[17px] font-bold tracking-tight text-ink">
            그림으로 먼저 보기
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-smoke">
            세 장이면 이 사이트가 어떻게 생겼는지 다 나옵니다. 단계를 넘기면 그림이
            움직이고, 무슨 일이 일어났는지는 그 아래에 글로 적힙니다.
          </p>

          <div className="mt-5">
            <GuideExplainer chapters={chapters} />
          </div>
        </section>

        {demos.length > 0 && (
          <section aria-labelledby="guide-try" className="mt-10">
            <h2 id="guide-try" className="text-[17px] font-bold tracking-tight text-ink">
              먼저 하나 해보세요
            </h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-smoke">
              설명을 읽는 것보다 한 번 만져 보는 쪽이 빠릅니다. 셋 중 아무거나 하나면
              이 사이트가 어떻게 생겼는지 알게 됩니다.
            </p>

            <ul className="mt-4 space-y-2.5">
              {demos.map((demo) => (
                <li key={demo.href}>
                  <Link
                    href={demo.href}
                    className="block rounded-card border border-stone bg-taupe px-4 py-3.5 transition-colors hover:border-graphite"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-[15px] font-semibold text-ink">{demo.title}</span>
                      <span className="text-[11px] font-medium text-navy">{demo.verb}</span>
                      <span aria-hidden="true" className="ml-auto text-[13px] text-ash">
                        →
                      </span>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-smoke">{demo.body}</p>
                    <p className="mt-2 text-[11px] font-semibold text-graphite">{demo.cta}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="guide-layers" className="mt-10">
          <h2 id="guide-layers" className="text-[17px] font-bold tracking-tight text-ink">
            다섯 갈래로 들어갑니다
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-smoke">
            같은 자료를 다섯 가지 질문으로 나눠 둡니다. 궁금한 질문 쪽으로 들어가면
            됩니다.
          </p>

          <ul className="mt-4 divide-y divide-stone border-y border-stone">
            {layers.map((layer) => (
              <li key={layer.href}>
                <Link
                  href={layer.href}
                  className="block py-3.5 transition-colors hover:bg-taupe/50"
                >
                  <p className="text-[12px] text-ash">&ldquo;{layer.q}&rdquo;</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-[15px] font-bold text-ink">{layer.label}</span>
                    <span className="tabular text-[11px] text-smoke">{layer.count}</span>
                    <span aria-hidden="true" className="ml-auto text-[13px] text-ash">
                      →
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-smoke">{layer.body}</p>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-3 text-[12px] leading-relaxed text-ash">
            {/*
              * 응원 영상은 건수를 적지 않는다. 코드에 둔 씨앗에 사람들이 올린
              * 것이 섞이므로, 빌드 때 센 수는 화면에 뜨는 수와 다르다.
              */}
            언행 화면에는 지지자들이 올린 응원 영상과 본인이 쓴 책{" "}
            {booksWithChapters.length}권도 탭으로 나뉘어 있습니다. 한 화면에 두되 섞지
            않습니다 — 섞으면 응원이 원문의 권위를 빌려 쓰게 됩니다.
          </p>
        </section>

        <section aria-labelledby="guide-anatomy" className="mt-10">
          <h2 id="guide-anatomy" className="text-[17px] font-bold tracking-tight text-ink">
            업적 한 편은 이렇게 생겼습니다
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-smoke">
            어느 업적을 열어도 같은 일곱 칸입니다. 어디에 무엇이 있는지 한 번만 익히면
            됩니다.
          </p>

          <ol className="mt-4 divide-y divide-stone border-y border-stone">
            {PART_LABELS.map((label, i) => (
              <li key={label} className="flex items-baseline gap-3 py-3">
                <span className="tabular w-4 shrink-0 text-[11px] text-ash">{i + 1}</span>
                <span className="w-[58px] shrink-0 text-[13px] font-bold text-ink">{label}</span>
                <span className="flex-1 text-[13px] leading-relaxed text-smoke">
                  {PART_NOTES[i]}
                </span>
                <span className="tabular shrink-0 text-[11px] text-ash">
                  {partFill[i]}/{published.length}
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-3 text-[12px] leading-relaxed text-ash">
            오른쪽 숫자는 공개된 업적 {published.length}편 중 그 칸이 채워진 편수입니다.
            비어 있는 칸은 비어 있는 채로 보입니다. 감추면 만드는 쪽도 보는 쪽도 무엇이
            남았는지 모릅니다.
          </p>
        </section>

        <section aria-labelledby="guide-doing" className="mt-10">
          <h2 id="guide-doing" className="text-[17px] font-bold tracking-tight text-ink">
            화면에서 할 수 있는 것
          </h2>

          <dl className="mt-4 space-y-4">
            {[
              [
                "쉽게 보기 ↔ 원문 보기",
                "업적 화면 위쪽의 전환 버튼. 한쪽은 그림과 짧은 말로, 다른 쪽은 근거와 수치를 그대로 둡니다. 같은 내용을 두 속도로 읽습니다.",
              ],
              [
                "근거 열기",
                "숫자나 단정문 옆의 작은 버튼. 누르면 아래에서 서랍이 올라오고 원자료 링크가 그대로 있습니다. 근거가 없는 것은 애초에 화면에 그려지지 않습니다.",
              ],
              [
                "AI 안내",
                "업적 화면 아래에 떠 있는 버튼. 물으면 긴 글로 답하는 대신 화면이 그 장면으로 움직입니다. 물어본 이력은 MY에 쌓입니다.",
              ],
              [
                "검색",
                "홈 맨 위. 업적 제목뿐 아니라 근거 문장, 연표 항목, 언행 원문, 책의 장까지 함께 찾습니다.",
              ],
              [
                "공유",
                "보고 있던 상태 그대로 링크가 만들어집니다. 받은 사람이 같은 항로, 같은 시점을 봅니다.",
              ],
            ].map(([label, body]) => (
              <div key={label}>
                <dt className="text-[14px] font-bold text-ink">{label}</dt>
                <dd className="mt-1 text-[13px] leading-relaxed text-smoke">{body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="guide-limits" className="mt-10">
          <h2 id="guide-limits" className="text-[17px] font-bold tracking-tight text-ink">
            믿어도 되는지
          </h2>
          <ul className="mt-3 space-y-2.5 text-[13px] leading-relaxed text-smoke">
            <li className="border-l-2 border-stone pl-3">
              근거 없는 것은 그리지 않습니다. 출처가 없으면 그 항목 자체가 화면에
              나오지 않고, 빌드가 이를 강제합니다.
            </li>
            <li className="border-l-2 border-stone pl-3">
              사실과 주장을 구분합니다. 다툼이 있는 수치는 사실로 적지 않고 누구의
              계산인지 밝힙니다. 쟁점을 빼지 않습니다.
            </li>
            <li className="border-l-2 border-pending pl-3">
              아직 대조하지 못한 것은 그렇게 표시합니다. 지금{" "}
              {unverified === 0 ? "표시된 것이 없습니다" : `${unverified}건입니다`}.
            </li>
            <li className="border-l-2 border-stone pl-3">
              응원 영상은 자료가 아닙니다. 제목과 채널만 알 뿐 내용을 확인하지
              않았으므로, 어디에서도 근거로 쓰지 않습니다.
            </li>
          </ul>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-stone px-4 py-2 text-sm font-medium text-graphite transition-colors hover:border-graphite hover:text-ink"
            >
              규칙 전문 읽기
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/correction"
              className="inline-flex items-center gap-2 rounded-full border border-stone px-4 py-2 text-sm font-medium text-graphite transition-colors hover:border-graphite hover:text-ink"
            >
              틀린 것 알리기
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section aria-labelledby="guide-start" className="mt-10">
          <h2 id="guide-start" className="text-[17px] font-bold tracking-tight text-ink">
            이제 시작하기
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-smoke">
            화면 맨 아래 다섯 개가 어디에 있든 따라다닙니다. 길을 잃을 자리가 없습니다.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-eggshell transition-colors hover:bg-graphite"
          >
            홈으로 가기
            <span aria-hidden="true">→</span>
          </Link>
        </section>
      </main>

      <BottomNav />
    </>
  );
}
