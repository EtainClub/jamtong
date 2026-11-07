import Link from "next/link";
import type { Metadata } from "next";

import { CHEERS } from "@/content/cheers";
import { STATEMENTS } from "@/content/words";
import { KIND_LABEL, type Statement, type StatementKind } from "@/content/words/schema";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { JsonLd, collectionPageLd } from "@/lib/seo/jsonld";
import { BooksPanel } from "@/features/books/BooksPanel";
import { CheerBoard } from "@/features/words/CheerBoard";
import { cheerTopics } from "@/features/words/cheerTopics";
import { MoreList } from "@/features/words/MoreList";
import { SpeechCard, speechVideoId } from "@/features/words/SpeechCard";
import { WordsTabs } from "@/features/words/WordsTabs";

export const metadata: Metadata = {
  title: "언행",
  description: "이재명 대통령이 직접 공개적으로 한 말과 행동을 원문 그대로 모읍니다.",
  alternates: { canonical: "/words" },
};

/**
 * 언행 목록.
 *
 * 업적과 나란히 두지 않고 따로 세운 이유: 업적은 남이 확인해 준 사실을 모아
 * 근거를 매다는 일이고, 여기는 본인이 한 말 그 자체다. 둘을 한 줄에 늘어놓으면
 * "대통령이 그렇게 말했다"와 "그 일이 그렇게 되었다"가 같은 무게로 읽힌다.
 *
 * 탭이 둘이지만 판단은 하나다. 왼쪽은 본인이 한 말, 오른쪽은 지지자들이 만든
 * 응원 영상이다. 같은 화면에 두되 섞지 않는다 — 섞는 순간 응원이 원문의
 * 권위를 빌려 쓰게 된다. 두 패널은 여기서 서버가 만들고, 탭은 어느 쪽을
 * 보일지만 고른다.
 */
export default function WordsPage() {
  return (
    <>
      <JsonLd
        data={collectionPageLd({
          path: "/words",
          name: "이재명 언행",
          description: "이재명 대통령이 직접 공개적으로 한 말과 행동을 원문 그대로 모읍니다.",
          items: STATEMENTS.map((s) => ({ name: s.title, path: `/words/${s.slug}` })),
        })}
      />
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <h1 className="text-2xl font-light tracking-[-0.02em] text-ink">언행</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          이재명 대통령이 직접 한 말과 행동, 지지자들이 만들어 올린 응원 영상,
          그리고 본인이 쓴 책을 나누어 둡니다.
        </p>

        <WordsTabs words={<WordsPanel />} cheers={<CheerPanel />} books={<BooksPanel />} />
      </main>

      <BottomNav />
    </>
  );
}

/**
 * 대통령의 언행.
 *
 * 유튜브로 틀 수 있는 연설은 위에 따로 묶는다. 연설은 듣는 것이 본래 모습이라
 * 목록에서 바로 틀고 읽을 수 있게 둔다. 영상이 없는 연설은 글과 같은 줄에 남는다.
 *
 * ★ 섹션마다 대표 한 편만 펼친다.
 *   글이 쉰 편을 넘으면서 한 줄로 늘어놓은 목록은 끝까지 내려가기 어려워졌다.
 *   대표(가장 최근) 한 편은 카드로 보이고, 나머지는 "더 보기"로 접는다.
 *   글과 발언은 종류(SNS 글·연설·책…)별로 다시 가른다.
 */
const KIND_ORDER: StatementKind[] = ["post", "speech", "book", "interview", "letter", "act"];

function WordsPanel() {
  const speeches = STATEMENTS.flatMap((statement) => {
    const videoId = speechVideoId(statement);
    return videoId ? [{ statement, videoId }] : [];
  });
  const others = STATEMENTS.filter((statement) => !speechVideoId(statement));
  const groups = KIND_ORDER.map((kind) => ({
    kind,
    items: others.filter((statement) => statement.kind === kind),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      <p className="mt-6 text-[13px] leading-relaxed text-smoke">
        본인이 직접, 공개적으로 한 말과 행동을 모읍니다. 원문을 확인한 항목은 원문을 싣고,
        전문이 없는 연설은 영상 자료와 제공된 개요를 표시합니다.
      </p>

      {speeches.length > 0 && (
        <section aria-labelledby="speech-videos" className="mt-8">
          <h2 id="speech-videos" className="text-[13px] font-bold text-ink">
            연설 영상 <span className="font-normal text-ash">{speeches.length}</span>
          </h2>
          <div className="mt-3">
            <SpeechCard statement={speeches[0].statement} videoId={speeches[0].videoId} />
          </div>
          <MoreList count={speeches.length - 1}>
            <ul className="space-y-3">
              {speeches.slice(1).map(({ statement, videoId }) => (
                <li key={statement.id}>
                  <SpeechCard statement={statement} videoId={videoId} />
                </li>
              ))}
            </ul>
          </MoreList>
        </section>
      )}

      <section aria-labelledby="words-others" className="mt-10">
        <h2 id="words-others" className="text-[13px] font-bold text-ink">
          글과 발언 <span className="font-normal text-ash">{others.length}</span>
        </h2>

        <div className="mt-3 space-y-6">
          {groups.map(({ kind, items }) => (
            <section key={kind} aria-labelledby={`words-kind-${kind}`}>
              <h3
                id={`words-kind-${kind}`}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-smoke"
              >
                <span className="rounded-full bg-taupe px-2 py-0.5 text-navy">
                  {KIND_LABEL[kind]}
                </span>
                <span className="font-normal text-ash">{items.length}편</span>
              </h3>
              <div className="mt-2">
                <StatementCard statement={items[0]} />
              </div>
              <MoreList count={items.length - 1}>
                <ul className="divide-y divide-stone overflow-hidden rounded-card border border-stone">
                  {items.slice(1).map((statement) => (
                    <li key={statement.id}>
                      <StatementRow statement={statement} />
                    </li>
                  ))}
                </ul>
              </MoreList>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}

/** 섹션의 대표 한 편. 미리보기 두 줄과 자료 표시까지 보인다. */
function StatementCard({ statement }: { statement: Statement }) {
  return (
    <Link
      href={`/words/${statement.slug}`}
      className="block rounded-card border border-stone px-5 py-4 transition-colors hover:border-graphite"
    >
      <p className="text-[11px] font-semibold text-ash">{statement.displayDate}</p>

      <h4 className="mt-1.5 text-[17px] font-bold tracking-tight text-ink">{statement.title}</h4>

      <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-smoke">
        {statement.body
          ? statement.body.split("\n").filter(Boolean).slice(1).join(" ")
          : statement.overview}
      </p>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-ash">
        <span>{statement.channel}</span>
        {statement.easy && (
          <>
            <span aria-hidden="true">·</span>
            <span>쉽게 보기 있음</span>
          </>
        )}
        {statement.media.length > 0 && (
          <>
            <span aria-hidden="true">·</span>
            <span>{statement.body ? "영상 자료 있음" : "영상 개요 · 영상 자료"}</span>
          </>
        )}
      </div>
    </Link>
  );
}

/** 접어 둔 나머지. 제목과 날짜만 한 줄로 둔다. */
function StatementRow({ statement }: { statement: Statement }) {
  return (
    <Link
      href={`/words/${statement.slug}`}
      className="flex items-baseline gap-3 px-4 py-3 transition-colors hover:bg-taupe/50"
    >
      <span className="min-w-0 flex-1">
        <span className="line-clamp-1 text-[14px] font-semibold tracking-tight text-ink">
          {statement.title}
        </span>
        <span className="mt-0.5 block text-[11px] text-ash">
          {statement.displayDate}
          {statement.easy && " · 쉽게 보기"}
        </span>
      </span>
      <span aria-hidden="true" className="text-[12px] text-ash">
        →
      </span>
    </Link>
  );
}

/**
 * 지지자 응원.
 *
 * 영상에 붙는 "우리가 확인한 것이 아니다" 안내는 영상 칸 맨 위로 옮겼다
 * (CheerBoard의 VideoNotice). 한 줄과 영상을 두 칸으로 가르면서, 영상에만
 * 해당하는 말이 한 줄 칸 위에 서 있을 이유가 없어졌다.
 */
function CheerPanel() {
  return (
    <>
      <p className="mt-6 text-[13px] leading-relaxed text-smoke">
        지지자들이 남긴 응원입니다. 누구나 바로 쓰는 한 줄 응원과, 직접 만들어
        올린 응원 영상이 있습니다.
      </p>

      <CheerBoard seed={CHEERS} topics={cheerTopics()} />
    </>
  );
}
