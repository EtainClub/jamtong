import media from "./media.json";

/**
 * 업적 카툰의 공유 파일 목록 — Firebase Storage에 올린 GIF·MP4의 주소(docs/garden-cartoon-review.md).
 *
 * `pnpm cartoon:render`로 만들고 `pnpm cartoon:upload`로 올리면 media.json이 갱신된다. 손으로 고치지 않는다.
 * 파일 자체는 저장소에 없다(크다). 칸 그림은 public/cartoons에 있다.
 */
export interface CartoonFile {
  url: string;
  bytes: number;
  sha256: string;
}

export interface CartoonMedia {
  gif?: CartoonFile;
  mp4?: CartoonFile;
}

export const CARTOON_MEDIA: Readonly<Record<string, CartoonMedia>> = media;
