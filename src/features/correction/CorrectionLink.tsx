import Link from "next/link";

import { correctionsFor } from "@/content/corrections";
import { formatDate } from "@/content/labels";
import { lastUpdated } from "@/lib/content-dates";

/**
 * "이 내용이 틀렸다면" 한 줄 (검토 문서 3장).
 *
 * 창구를 만들어 두고 메뉴 안쪽에만 두면 없는 것과 같다. 틀렸다는 생각은
 * 그 내용을 읽는 자리에서 들지, 메뉴를 뒤질 때 들지 않는다. 그래서 업적과
 * 언행 화면 끝에 두고, 어느 화면이었는지를 링크가 들고 간다.
 *
 * 같은 줄에 마지막으로 고친 날과 이 화면의 정정 기록을 단다. 기준 자료라면
 * "언제 기준인가"와 "틀렸을 때 고쳤는가"가 읽는 자리에서 보여야 한다.
 * 날짜는 저장소 기록에서 읽고, 읽을 수 없으면 적지 않는다.
 */
export function CorrectionLink({
  page,
  contentPaths = [],
  className = "mx-auto max-w-5xl px-5",
}: {
  page: string;
  /** 이 화면을 만드는 콘텐츠 파일. 디렉터리면 끝에 `/`. 마지막 수정일을 여기서 읽는다. */
  contentPaths?: string[];
  className?: string;
}) {
  const updated = contentPaths.length > 0 ? lastUpdated(contentPaths) : null;
  const corrections = correctionsFor(page);
  return (
    <div className={className}>
      <p className="border-t border-stone pt-5 text-[12px] leading-relaxed text-ash">
        여기 실린 내용이 사실과 다릅니까?{" "}
        <Link
          href={`/correction?page=${encodeURIComponent(page)}`}
          className="font-semibold text-navy underline underline-offset-2"
        >
          정정·반론을 요청
        </Link>
        할 수 있습니다. 근거를 보고 고치고, 고치지 않기로 하면 왜 그런지 남깁니다.
      </p>
      <p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-ash">
        {updated && <span className="tabular">마지막 수정 {formatDate(updated, "day")}</span>}
        <Link href="/corrections" className="underline underline-offset-2 hover:text-smoke">
          {corrections.length > 0 ? `이 화면의 정정 ${corrections.length}건` : "정정 기록"}
        </Link>
      </p>
    </div>
  );
}
