import { z } from "zod";

/**
 * 관련 사이트 모음.
 *
 * 링크는 주장이 아니라 안내이므로 claim을 매달지 않는다. 대신 **성격**을
 * 반드시 적는다. 본인이 직접 쓰는 계정과, 지지자가 모인 커뮤니티와, 남이
 * 만든 위키는 읽는 법이 서로 다르다. 그 구분을 지우면 이 목록은 여기서 하는
 * 다른 모든 일과 어긋난다.
 *
 * 설명은 각 사이트가 스스로 밝힌 소개를 옮긴다. 우리가 평가해서 적지 않는다.
 */
export const linkKindSchema = z.enum(["official", "wiki", "community"]);
export type LinkKind = z.infer<typeof linkKindSchema>;

export const KIND_LABEL: Record<LinkKind, string> = {
  official: "본인 채널",
  wiki: "위키·아카이브",
  community: "커뮤니티",
};

export const KIND_NOTE: Record<LinkKind, string> = {
  official: "이재명 대통령 본인 또는 그 측이 운영한다고 밝힌 계정입니다.",
  wiki: "업적·보도를 모아 정리하는 사이트입니다. 잼통과 별개로 운영됩니다.",
  community: "지지자들이 모이는 곳입니다. 공식 채널이 아니며 글은 각자의 것입니다.",
};

export const siteLinkSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  /** 도메인만 따로 적지 않는다. url에서 뽑는다. */
  description: z.string(),
  kind: linkKindSchema,
  /** 이 사이트에만 붙는 단서. */
  note: z.string().optional(),
});
export type SiteLink = z.infer<typeof siteLinkSchema>;

const raw: z.input<typeof siteLinkSchema>[] = [
  {
    id: "news-jamtong",
    title: "이재명 보도 위키",
    url: "https://news.jamtong.kr",
    description:
      "같은 사건에 어느 매체가 어떤 제목을 달았는지, 그리고 어디가 다루지 않았는지를 언론사별로 모아 기록합니다.",
    kind: "wiki",
    note: "잼통과 같은 곳에서 만듭니다. 이쪽은 업적을, 저쪽은 보도를 다룹니다.",
  },
  {
    id: "leejm-wiki",
    title: "이잼위키",
    url: "https://www.leejm.com/",
    description: "이재명정부의 성과를 모아 정리하는 위키입니다.",
    kind: "wiki",
  },
  {
    id: "x-handle",
    title: "이재명 X (트위터)",
    url: "https://x.com/Jaemyung_Lee",
    description: "@Jaemyung_Lee. 계정 소개는 '대한민국 제21대 대통령'입니다.",
    kind: "official",
  },
  {
    id: "youtube",
    title: "이재명 유튜브",
    url: "https://www.youtube.com/channel/UCNJM6dqu70Qr6VaseiW1Org",
    description: "영상이 올라오는 공식 채널입니다. 채널 소개는 '대한민국 제21대 대통령'입니다.",
    kind: "official",
  },
  {
    id: "bluecheernote",
    title: "이잼 응원 공간",
    url: "https://bluecheernote.com/",
    description: "이재명 대통령에게 전하고 싶은 응원과 감사의 마음을 한 장의 메모에 담아주세요.",
    kind: "community",
  },
  {
    id: "cafe-jamgallery",
    title: "재명이네 (네이버 카페)",
    url: "https://cafe.naver.com/jamgallery",
    description: "지지자들이 모여 소식과 자료를 나누는 카페입니다.",
    kind: "community",
  },
  {
    id: "dc-gallery",
    title: "이재명 갤러리 (디시인사이드)",
    url: "https://gall.dcinside.com/mgallery/board/lists/?id=leejaemyung",
    description: "디시인사이드의 이재명 마이너 갤러리입니다.",
    kind: "community",
  },
];

export const SITE_LINKS: SiteLink[] = raw.map((item) => siteLinkSchema.parse(item));

/** 성격별로 묶는다. 화면이 순서를 다시 정하지 않도록 여기서 정한다. */
export const LINK_GROUPS: { kind: LinkKind; links: SiteLink[] }[] = (
  ["official", "wiki", "community"] as const
).map((kind) => ({ kind, links: SITE_LINKS.filter((l) => l.kind === kind) }));

/** 화면에 도메인을 적기 위해. new URL()을 컴포넌트마다 되풀이하지 않는다. */
export const hostOf = (url: string) => new URL(url).host.replace(/^www\./, "");
