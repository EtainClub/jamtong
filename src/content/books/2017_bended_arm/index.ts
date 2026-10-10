import { bookSchema, type Book } from "../schema";
import { bodyOf, loadChapter, minutesOf } from "../body";
import { CHAPTERS } from "./chapters";

/**
 * 『이재명의 굽은 팔 — 굽은 세상을 펴는 이재명의 삶과 공부』 (김영사, 2017).
 *
 * 열여섯 장을 요약으로 옮겼다. 본문은 `text/`에서 빌드 때 읽어 붙인다.
 * 요약은 2025년에 다시 나온 개정판을 읽고 쓴 것이다. 해(year)는 처음 나온
 * 2017년으로 둔다 — 책 목록이 한 사람이 거쳐 온 순서로 읽히게 하려는 것이고,
 * 책에 담긴 공부와 구상도 2016~2017년의 것이다.
 *
 * ★ 2017년 2월 8일에 나왔고 서해성 씨가 대표 집필했다(뉴스토마토 같은 날 기사).
 *   서지 정보는 기사와 서점 목록에서 옮긴 2차 자료라 verified는 false다.
 *   개정판의 서지(출간일·판형)는 아직 대조하지 못했다.
 *
 * ★ 여기 실린 본문은 저자의 문장이 아니다(bodyKind: "summary").
 *   공부 장(4~12장) 끝 노트의 원문은 언행(`/words/bent-arm-*`)에 따로 있다.
 *
 * 1장 원문 제목 줄 끝에 "요약"이 붙어 있다. 자료를 만들 때 남은 표시라 뗀다.
 * 2장과 13장 제목의 " - "는 가름표로 바꾼다.
 */

const chapters = CHAPTERS.map((meta, index) => {
  const loaded = loadChapter("2017_bended_arm", meta.file, meta.drop);

  return {
    id: `bent-arm-${meta.file.replace(".md", "")}`,
    slug: meta.slug,
    order: index + 1,
    title: loaded.title.replace(/\s*요약$/, "").replace(" - ", " — "),
    summary: meta.summary,
    minutes: minutesOf(loaded),
    easy: { lead: meta.lead, points: meta.points },
    body: bodyOf(loaded, meta.cutAt),
    bodyKind: "summary" as const,
    bodySource: `『이재명의 굽은 팔』(2025년 개정판) ${index + 1}장`,
    truncated: meta.truncated,
    actions: meta.actions,
    shorts: meta.shorts ?? [],
  };
});

export const BENT_ARM_BOOK: Book = bookSchema.parse({
  id: "book-bent-arm",
  slug: "bent-arm",
  title: "이재명의 굽은 팔",
  subtitle: "굽은 세상을 펴는 이재명의 삶과 공부",
  publisher: "김영사",
  year: 2017,
  tone: "clay",
  source: {
    title: "이재명 \"굽은 세상을 바르게 만들고 싶다\"",
    publisher: "뉴스토마토",
    url: "https://newstomato.com/ReadNews.aspx?no=730200",
    verified: false,
  },
  note: "2017년 2월, 성남시장이던 저자가 대선을 앞두고 낸 책이며 여기서는 2025년 개정판을 옮겼습니다. 1~3장은 산골 소년이 소년공을 거쳐 인권변호사가 되기까지, 4~12장은 공부모임 '해와 달'에서 교수·활동가들과 정치·세금·복지·평화·노동·젠더·예술을 공부한 기록, 13~16장은 김대중과 노무현, 광화문 도서관의 꿈, 연보, 성남 시정입니다. 여기 실린 글은 저자의 문장이 아니라 우리가 읽고 다시 쓴 요약이며, 공부 장에서는 발제자의 주장과 저자의 생각을 나눠 적었습니다. 구상은 2017년 시점의 것이지 결과가 아닙니다.",
  chapters,
});
