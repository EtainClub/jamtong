import { SITE_URL, abs } from "./site";

/**
 * 구조화 데이터 (schema.org).
 *
 * ★ 화면에 없는 것은 적지 않는다.
 *   구조화 데이터는 검색엔진에게 하는 말이고, 사람이 보는 화면과 다른 말을
 *   하면 그것이 곧 스팸이다. 날짜를 모르면 비운다 — 이 사이트는 콘텐츠에
 *   없는 날짜를 지어내지 않는 것을 원칙으로 세워 뒀고, 여기라고 다르지 않다.
 *
 * ★ ClaimReview는 쓰지 않는다.
 *   주장과 근거를 다루는 사이트라 얼핏 맞아 보이지만, 그 타입은 팩트체크
 *   기관의 판정을 싣는 자리다. 우리는 판정하지 않고 층을 갈라 보인다.
 */

const SITE_NAME = "이재명 업적 위키";

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      /*
       * 우리가 만든 객체만 넣는다. `<` 를 막는 것은 콘텐츠에 그 글자가 있을 때
       * 스크립트 태그가 일찍 닫히는 것을 막기 위해서다.
       */
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** 사이트 자체. 홈에만 둔다. */
export function webSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "잼통",
    url: SITE_URL,
    inLanguage: "ko",
    description:
      "읽는 위키가 아니라 이해하는 위키. 업적·사건·맥락·근거를 시각적으로 탐색합니다.",
    publisher: {
      "@type": "Organization",
      name: "잼통",
      url: SITE_URL,
      logo: abs("/images/jamtong-icon-512.png"),
    },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

/** 검색 결과에 경로를 보인다. 상세 화면마다 둔다. */
export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: abs(crumb.path),
    })),
  };
}

export interface ArticleLdInput {
  path: string;
  headline: string;
  description: string;
  /** 아는 날짜만. 모르면 넘기지 않는다. */
  datePublished?: string;
  dateModified?: string;
  /** 원문이 따로 있으면 그 주소. */
  citation?: string;
  /** 어떤 더 큰 것의 일부인지. 자서전의 장이 그렇다. */
  isPartOf?: object;
  /**
   * 이 글의 그림. 공유 카드를 그대로 가리킨다.
   *
   * 화면에 없는 그림을 적으면 안 되는데, 공유 카드는 이 글로 만든 것이라
   * 같은 것을 가리킨다고 말해도 된다.
   */
  image?: string;
}

export function articleLd(input: ArticleLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": abs(input.path),
    headline: input.headline,
    description: input.description,
    url: abs(input.path),
    inLanguage: "ko",
    /* 로그인도 결제도 없이 다 읽을 수 있다. */
    isAccessibleForFree: true,
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.citation ? { citation: input.citation } : {}),
    ...(input.image ? { image: abs(input.image) } : {}),
    ...(input.isPartOf ? { isPartOf: input.isPartOf } : {}),
    publisher: {
      "@type": "Organization",
      name: "잼통",
      url: SITE_URL,
    },
  };
}
