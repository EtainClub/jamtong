import type { LineStatus, StatusCount } from "@/content/pledges";

/**
 * 공약 이행 막대.
 *
 * 세 칸을 늘 따로 그린다. 시행과 추진 중을 한 색으로 합치면 발표만 된 것이
 * 끝난 것처럼 보인다. "확인 전"은 비어 있는 칸이 아니라 회색 칸으로 그린다 —
 * 안 한 것이 아니라 이 사이트가 아직 근거를 잇지 못한 것이다.
 *
 * 훅이 없어 서버·클라이언트 양쪽에서 쓴다.
 */

export const STATUS_LABEL: Record<LineStatus, string> = {
  done: "시행",
  underway: "추진 중",
  untracked: "확인 전",
};

export const STATUS_DOT: Record<LineStatus, string> = {
  done: "bg-navy",
  underway: "bg-pending",
  untracked: "bg-stone",
};

export const STATUS_CHIP: Record<LineStatus, string> = {
  done: "bg-navy-tint text-navy",
  underway: "bg-pending-tint text-pending",
  untracked: "bg-stone/60 text-ash",
};

export function PledgeBar({ count, size = "md" }: { count: StatusCount; size?: "sm" | "md" }) {
  const pct = (n: number) => (count.total === 0 ? 0 : (n / count.total) * 100);
  return (
    <div
      role="img"
      aria-label={`전체 ${count.total}개 중 시행 ${count.done}개, 추진 중 ${count.underway}개, 확인 전 ${count.untracked}개`}
      className={`flex w-full overflow-hidden rounded-full bg-stone ${size === "sm" ? "h-1.5" : "h-2.5"}`}
    >
      {/* 칸 사이를 1px 띄운다. 붙여 그리면 작은 칸이 옆 칸에 묻힌다. */}
      {count.done > 0 && <span className="h-full bg-navy" style={{ width: `${pct(count.done)}%` }} />}
      {count.underway > 0 && (
        <span
          className="h-full border-l border-canvas bg-pending"
          style={{ width: `${pct(count.underway)}%` }}
        />
      )}
    </div>
  );
}

export function PledgeLegend({ count }: { count: StatusCount }) {
  const rows: [LineStatus, number][] = [
    ["done", count.done],
    ["underway", count.underway],
    ["untracked", count.untracked],
  ];
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-smoke">
      {rows.map(([status, n]) => (
        <li key={status} className="flex items-center gap-1.5">
          <span aria-hidden="true" className={`h-2 w-2 rounded-full ${STATUS_DOT[status]}`} />
          {STATUS_LABEL[status]} <span className="tabular font-semibold text-ink">{n}</span>
        </li>
      ))}
    </ul>
  );
}

/** "2026-10-12" → "2026년 10월 12일". 정밀도가 낮으면 있는 데까지만 적는다. */
export function koreanDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y) return iso;
  return d ? `${y}년 ${m}월 ${d}일` : m ? `${y}년 ${m}월` : `${y}년`;
}

/** 세 가지 상태가 무엇을 뜻하는지. "확인 전"이 "안 했다"로 읽히지 않게 늘 막대 곁에 둔다. */
export function StatusGuide() {
  return (
    <dl className="mt-4 space-y-1.5 border-t border-stone pt-3 text-[12px] leading-relaxed text-smoke">
      <div>
        <dt className="inline font-semibold text-navy">시행</dt>
        <dd className="inline"> — 법이 시행됐거나 제도가 실제로 시작됐습니다.</dd>
      </div>
      <div>
        <dt className="inline font-semibold text-pending">추진 중</dt>
        <dd className="inline">
          {" "}
          — 발표·법 통과·협약까지 왔지만 아직 효력이 없거나, 약속의 일부만 이뤄졌습니다.
        </dd>
      </div>
      <div>
        <dt className="inline font-semibold text-ash">확인 전</dt>
        <dd className="inline">
          {" "}
          — 안 했다는 뜻이 아닙니다. 이 사이트가 아직 근거를 잇지 못했습니다.
        </dd>
      </div>
    </dl>
  );
}
