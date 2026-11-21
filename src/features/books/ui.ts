import type { ActionHorizon } from "@/content/books/schema";
import type { ReadLocale } from "@/content/books/i18n";

/**
 * 자서전 화면의 글자 — 한국어·일본어·영어.
 *
 * 사이트 전체를 옮기지 않으므로 사전 라이브러리를 들이지 않는다. 장 화면이 쓰는
 * 글자만 여기 모은다. 한국어 값은 원래 화면의 글자 그대로다 — 한국어 화면은
 * 이 파일이 생기기 전과 한 글자도 달라지지 않아야 한다.
 */
export interface BookUi {
  viewMode: string;
  easyTab: string;
  bodyTab: string;
  easyKicker: string;
  scenes: (n: number) => string;
  scene: (i: number) => string;
  prevScene: string;
  nextScene: string;
  pickScene: string;
  quoteToggle: string;
  readBody: string;
  noBody: string;
  truncated: string;
  bodyNote: { summary: string; excerpt: string };
  shortsTitle: string;
  chapterN: (n: number) => string;
  shortsPending: string;
  shortsPendingNote: string;
  shortsNote: (title: string) => string;
  actionsTitle: string;
  actionsNote: string;
  horizon: Record<ActionHorizon, string>;
  minutes: (n: number) => string;
  chapterOf: (n: number, total: number) => string;
  nextChapter: string;
  share: { text: string; aria: string; copied: string; done: string; ask: string; prompt: string };
}

export const BOOK_UI: Record<ReadLocale, BookUi> = {
  ko: {
    viewMode: "보기 방식",
    easyTab: "쉽게 보기",
    bodyTab: "요약 원문",
    easyKicker: "쉽게 보기 · 큰 그림으로 읽기",
    scenes: (n) => `장면 ${n}개. 좌우 화살표 키로 넘길 수 있어요.`,
    scene: (i) => `${i + 1}번 장면`,
    prevScene: "이전 장면",
    nextScene: "다음 장면",
    pickScene: "장면 선택",
    quoteToggle: "요약 원문에서 이 대목",
    readBody: "요약 원문으로 읽기",
    noBody: "이 장은 요약 원문을 싣지 못했습니다. 위의 카드가 전부이며, 자세한 내용은 책을 직접 보셔야 합니다.",
    truncated: "이 장의 요약 자료가 중간에서 끊겼습니다. 마지막 대목이 비어 있습니다.",
    bodyNote: {
      summary: "책을 읽고 우리가 옮긴 요약입니다. 저자의 문장이 아닙니다",
      excerpt: "인용 범위 안의 발췌입니다. 전문이 아닙니다",
    },
    shortsTitle: "이 장의 숏츠",
    chapterN: (n) => `${n}장`,
    shortsPending: "준비 중",
    shortsPendingNote:
      "이 장의 본문으로 만든 숏츠가 여기 붙습니다. 아직 만들지 않았습니다 — 영상이 올라오면 제목과 함께 이 자리에 뜹니다.",
    shortsNote: (title) =>
      `「${title}」의 요약을 옮긴 영상입니다. 짧을수록 맥락이 잘리므로, 영상만 보고 판단하기 전에 위의 요약 원문을 함께 보시기 바랍니다.`,
    actionsTitle: "이 장을 읽었다면, 할 수 있는 일",
    actionsNote:
      "읽고 끝나지 않게 하려고 둡니다. 이 장이 말한 범위 안에서 뽑은 것이고, 그 밖의 주장은 넣지 않습니다.",
    horizon: { today: "오늘", week: "이번 주", always: "늘" },
    minutes: (n) => `${n}분`,
    chapterOf: (n, total) => `${n}장 / ${total}`,
    nextChapter: "다음 장",
    share: {
      text: "공유",
      aria: "이 장 공유",
      copied: "이 장의 링크를 클립보드에 복사했습니다.",
      done: "링크를 복사했습니다",
      ask: "이 링크를 복사하세요",
      prompt: "이 장이 누군가에게 필요하다면 링크를 건네세요.",
    },
  },
  ja: {
    viewMode: "表示の切り替え",
    easyTab: "やさしく読む",
    bodyTab: "要約の本文",
    easyKicker: "やさしく読む · 大きな絵で読む",
    scenes: (n) => `${n}つの場面。左右の矢印キーで移動できます。`,
    scene: (i) => `${i + 1}番目の場面`,
    prevScene: "前の場面",
    nextScene: "次の場面",
    pickScene: "場面を選ぶ",
    quoteToggle: "要約の本文のこの箇所",
    readBody: "要約の本文で読む",
    noBody: "この章は要約の本文を載せていません。上のカードがすべてです。詳しくは本をご覧ください。",
    truncated: "この章の要約は途中で切れています。最後の部分がありません。",
    bodyNote: {
      summary: "本を読んで私たちが韓国語で書いた要約を、日本語に訳したものです。著者の文章ではありません",
      excerpt: "引用の範囲内の抜粋です。全文ではありません",
    },
    shortsTitle: "この章のショート動画",
    chapterN: (n) => `第${n}章`,
    shortsPending: "準備中",
    shortsPendingNote: "この章の日本語の動画はまだありません。公開されたら、ここにタイトルとともに表示されます。",
    shortsNote: (title) =>
      `「${title}」の要約をもとにした動画です。短いほど文脈が抜け落ちるため、動画だけで判断せず、上の要約の本文もあわせてご覧ください。`,
    actionsTitle: "この章を読んだら、できること",
    actionsNote:
      "読んで終わりにしないために置いています。この章が語った範囲から選んだもので、それ以外の主張は入れていません。「韓国語」と書いたリンク先は韓国語のページです。",
    horizon: { today: "今日", week: "今週", always: "いつも" },
    minutes: (n) => `${n}分`,
    chapterOf: (n, total) => `第${n}章 / 全${total}章`,
    nextChapter: "次の章",
    share: {
      text: "共有",
      aria: "この章を共有",
      copied: "この章のリンクをコピーしました。",
      done: "リンクをコピーしました",
      ask: "このリンクをコピーしてください",
      prompt: "この章を必要としている人がいたら、リンクを送ってください。",
    },
  },
  en: {
    viewMode: "View",
    easyTab: "Easy read",
    bodyTab: "Full summary",
    easyKicker: "Easy read · the big picture",
    scenes: (n) => `${n} scenes. Use the left and right arrow keys to move between them.`,
    scene: (i) => `Scene ${i + 1}`,
    prevScene: "Previous scene",
    nextScene: "Next scene",
    pickScene: "Choose a scene",
    quoteToggle: "This passage in the full summary",
    readBody: "Read the full summary",
    noBody: "This chapter has no full summary. The cards above are all there is; see the book itself for details.",
    truncated: "The summary of this chapter is cut off. The last part is missing.",
    bodyNote: {
      summary: "Our English translation of a summary we wrote in Korean after reading the book. Not the author's own words",
      excerpt: "An excerpt within the limits of quotation. Not the full text",
    },
    shortsTitle: "Shorts for this chapter",
    chapterN: (n) => `Chapter ${n}`,
    shortsPending: "Coming",
    shortsPendingNote: "There is no English video for this chapter yet. When one is published, it will appear here with its title.",
    shortsNote: (title) =>
      `A video based on the summary of "${title}". The shorter a video, the more context it loses, so please read the full summary above before judging from the video alone.`,
    actionsTitle: "If you've read this chapter, things you can do",
    actionsNote:
      "So that reading doesn't end with reading. These are drawn only from what this chapter says, with no other claims added. Links marked “in Korean” lead to pages in Korean.",
    horizon: { today: "Today", week: "This week", always: "Always" },
    minutes: (n) => `${n} min`,
    chapterOf: (n, total) => `Chapter ${n} of ${total}`,
    nextChapter: "Next chapter",
    share: {
      text: "Share",
      aria: "Share this chapter",
      copied: "Copied the link to this chapter.",
      done: "Link copied",
      ask: "Copy this link",
      prompt: "If someone needs this chapter, send them the link.",
    },
  },
};
