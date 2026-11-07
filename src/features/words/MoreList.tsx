/**
 * 대표 항목 아래에 접어 둔 나머지.
 *
 * 목록이 길어지면 섹션 하나가 화면을 다 먹는다. 그래서 섹션마다 대표 한 편만
 * 펼쳐 두고 나머지는 접는다. 네이티브 details라 자바스크립트 없이 서버에서
 * 그대로 굳고, 닫힌 동안에는 안의 썸네일(loading="lazy")도 받지 않는다.
 */
export function MoreList({
  count,
  label = "편",
  children,
}: {
  count: number;
  label?: string;
  children: React.ReactNode;
}) {
  if (count === 0) return null;

  return (
    <details className="group mt-2">
      <summary className="flex cursor-pointer list-none items-center justify-center gap-1 rounded-full border border-stone py-2 text-[12px] font-semibold text-navy transition-colors hover:border-graphite [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">
          더 보기 <span className="font-normal text-ash">{count}{label}</span>
        </span>
        <span className="hidden group-open:inline">접기</span>
        <span aria-hidden="true" className="transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}
