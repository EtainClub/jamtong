import Link from "next/link";

/**
 * "이 내용이 틀렸다면" 한 줄 (검토 문서 3장).
 *
 * 창구를 만들어 두고 메뉴 안쪽에만 두면 없는 것과 같다. 틀렸다는 생각은
 * 그 내용을 읽는 자리에서 들지, 메뉴를 뒤질 때 들지 않는다. 그래서 업적과
 * 언행 화면 끝에 두고, 어느 화면이었는지를 링크가 들고 간다.
 */
export function CorrectionLink({
  page,
  className = "mx-auto max-w-5xl px-5",
}: {
  page: string;
  className?: string;
}) {
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
    </div>
  );
}
