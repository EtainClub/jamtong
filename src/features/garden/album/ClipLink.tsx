import Link from "next/link";

/**
 * 사이트 페이지에서 사진첩으로 담는 작은 문(docs/garden-album-review.md §4).
 * /garden?tab=album&clip=<앵커> — 정원이 열리면 사진첩의 담기 시트가 뜬다(GardenApp).
 *
 * ★ 읽은 자리 끝에 둔다. 정보 페이지는 게임이 가리지 않는다(docs/garden-game.md §1) — SeedGiftLink와 같은 자리 원칙.
 */
export function ClipLink({ anchor, label = "사진첩에 담기", className = "" }: { anchor: string; label?: string; className?: string }) {
  return (
    <Link
      href={`/garden?tab=album&clip=${encodeURIComponent(anchor)}`}
      prefetch={false}
      className={`inline-flex min-h-[36px] items-center gap-1 text-[12px] font-semibold text-navy hover:underline ${className}`}
    >
      <span aria-hidden="true">📷</span> {label}
    </Link>
  );
}

/**
 * 정원 안에서 담기 — 카툰을 보던 시트에서 그 칸을 사진첩에 담는다. 같은 페이지라 주소로 가지 않고
 * 이 이벤트로 GardenApp에 알린다(사진첩 칸으로 옮겨 담기 시트를 연다).
 */
export const CLIP_EVENT = "garden:clip";

export function requestClip(anchor: string): void {
  window.dispatchEvent(new CustomEvent<string>(CLIP_EVENT, { detail: anchor }));
}
