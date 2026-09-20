import Link from "next/link";

import { BOOKS_BY_YEAR } from "@/content/books";
import { BookHelix } from "./BookHelix";

/**
 * 언행의 세 번째 탭.
 *
 * 앞의 두 탭과 층이 또 다르다. 왼쪽은 본인이 한 짧은 말, 가운데는 남이 만든
 * 응원, 여기는 **본인이 쓴 책**이다. 책은 길고 저작물이라 전문을 싣지 못하고,
 * 대신 장마다 요약과 **할 일**을 둔다. 읽고 끝나지 않게 하는 것이 이 탭의
 * 목적이다.
 */
export function BooksPanel() {
  const ready = BOOKS_BY_YEAR.filter((book) => book.chapters.length > 0).length;

  return (
    <section aria-label="자서전">
      <p className="text-[13px] leading-relaxed text-smoke">
        본인이 쓴 책을 장 단위로 끊어 옮깁니다. 장마다 쉽게 보기와 요약 원문,
        그리고 <strong className="font-bold text-ink">읽은 사람이 할 수 있는 일</strong>을
        함께 둡니다.
      </p>

      <BookHelix books={BOOKS_BY_YEAR} />

      <p className="mt-4 text-[12px] leading-relaxed text-ash">
        {ready === 0
          ? "아직 어느 책도 장 단위로 정리하지 않았습니다. 지금 있는 것은 서지 정보뿐이며, 책 내용은 실물을 펴 놓고 한 장씩 넣습니다 — 추측해서 채우지 않습니다."
          : `${ready}권을 장 단위로 정리했습니다. 나머지는 서지 정보만 있습니다.`}
      </p>

      <p className="mt-2 text-[12px] leading-relaxed text-ash">
        전문은 싣지 않습니다. 원문은 인용 범위 안의 발췌만 싣고, 발췌가 없는
        장은 화면이 그렇게 밝힙니다.{" "}
        <Link href="/about" className="text-navy hover:underline">
          이 사이트가 지키는 것
        </Link>
      </p>
    </section>
  );
}
