import Link from "next/link";

/**
 * 원본 페이지에서 정원으로 가는 작은 문. 품종마다 씨앗 하나를 한 번 준다.
 *
 * ★ 페이지 맨 끝, 정정 링크 옆에 둔다.
 *   정보 페이지는 게임이 가리지 않는다(docs/garden-game.md §1). 다 읽은 사람에게
 *   "이것도 키워 볼래요?"를 건네는 자리이지, 읽기 전에 끼어드는 자리가 아니다.
 */
export function SeedGiftLink({ speciesId, title }: { speciesId: string; title: string }) {
  return (
    <div className="mx-auto max-w-5xl px-5">
      <Link
        href={`/garden?gift=${encodeURIComponent(speciesId)}`}
        className="flex items-center gap-3 rounded-card border border-stone bg-taupe/60 px-4 py-3 text-[13px] text-graphite transition-colors hover:border-graphite"
      >
        <span className="text-xl" aria-hidden>
          🌱
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-ink">「{title}」 씨앗 받기</span>
          <span className="text-[12px] text-smoke">잼통 정원에 심고 키워 보세요. 품종마다 한 번 받을 수 있어요.</span>
        </span>
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
