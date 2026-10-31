import Link from "next/link";

import type { ProgressCount, ProgressItem } from "@/content/cartels";
import { STATUS_LABEL, formatDate } from "@/content/labels";
import type { MilestoneStatus } from "@/content/schema";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";

/**
 * 카르텔 진행 막대.
 *
 * 공약 이행 현황과 같은 모양이다. 세 칸을 늘 따로 그린다 — 완료와 추진 중을
 * 한 색으로 합치면 발표만 된 것이 끝난 것처럼 보이고, 계획을 추진 중과 합치면
 * 아직 아무것도 움직이지 않은 것이 움직이는 것처럼 보인다.
 *
 * 막대는 "얼마나 깼는가"가 아니라 "걸린 조치가 어디까지 왔는가"다. 조치가
 * 다 완료돼도 효과가 확인된 것은 아니다. 그 말은 늘 막대 곁에 둔다.
 */

export const PROGRESS_DOT: Record<MilestoneStatus, string> = {
  done: "bg-navy",
  ongoing: "bg-pending",
  planned: "bg-pending/35",
};

const PROGRESS_CHIP: Record<MilestoneStatus, string> = {
  done: "bg-navy-tint text-navy",
  ongoing: "bg-pending-tint text-pending",
  planned: "border border-stone text-smoke",
};

const ORDER: MilestoneStatus[] = ["done", "ongoing", "planned"];

export function ProgressBar({ count, size = "md" }: { count: ProgressCount; size?: "sm" | "md" }) {
  const pct = (n: number) => (count.total === 0 ? 0 : (n / count.total) * 100);
  return (
    <div
      role="img"
      aria-label={`조치 ${count.total}개 중 ${STATUS_LABEL.done} ${count.done}개, ${STATUS_LABEL.ongoing} ${count.ongoing}개, ${STATUS_LABEL.planned} ${count.planned}개`}
      className={`flex w-full overflow-hidden rounded-full bg-stone ${size === "sm" ? "h-1.5" : "h-2.5"}`}
    >
      {ORDER.map((status, i) =>
        count[status] > 0 ? (
          <span
            key={status}
            // 칸 사이를 1px 띄운다. 붙여 그리면 작은 칸이 옆 칸에 묻힌다.
            className={`h-full ${PROGRESS_DOT[status]} ${i > 0 ? "border-l border-canvas" : ""}`}
            style={{ width: `${pct(count[status])}%` }}
          />
        ) : null,
      )}
    </div>
  );
}

export function ProgressLegend({ count }: { count: ProgressCount }) {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-smoke">
      {ORDER.map((status) => (
        <li key={status} className="flex items-center gap-1.5">
          <span aria-hidden="true" className={`h-2 w-2 rounded-full ${PROGRESS_DOT[status]}`} />
          {STATUS_LABEL[status]} <span className="tabular font-semibold text-ink">{count[status]}</span>
        </li>
      ))}
    </ul>
  );
}

/** 세 상태가 무엇을 뜻하는지. "완료"가 "카르텔이 깨졌다"로 읽히지 않게 막대 곁에 둔다. */
export function ProgressGuide() {
  return (
    <dl className="mt-4 space-y-1.5 border-t border-stone pt-3 text-[12px] leading-relaxed text-smoke">
      <div>
        <dt className="inline font-semibold text-navy">{STATUS_LABEL.done}</dt>
        <dd className="inline">
          {" "}
          — 법이 시행됐거나, 제도가 실제로 시작됐거나, 제재 처분이 내려졌습니다.
        </dd>
      </div>
      <div>
        <dt className="inline font-semibold text-pending">{STATUS_LABEL.ongoing}</dt>
        <dd className="inline">
          {" "}
          — 법 통과·합의·시범까지 왔지만 아직 효력이 없거나 일부만 시작됐습니다.
        </dd>
      </div>
      <div>
        <dt className="inline font-semibold text-smoke">{STATUS_LABEL.planned}</dt>
        <dd className="inline"> — 발표·의결까지입니다. 아직 움직이지 않았습니다.</dd>
      </div>
      <p className="pt-1 text-ash">
        조치가 모두 완료돼도 카르텔이 깨졌다는 뜻은 아닙니다. 제재 처분은 소송에서
        달라질 수 있고, 송치는 유죄가 아닙니다. 값이 내렸는지, 구조가 바뀌었는지는
        따로 재야 하고, 각 표적의 「아직 확인하지 못한 것」에 적었습니다.
      </p>
    </dl>
  );
}

/** 조치 하나. 상태 칩이 맨 앞이다 — 「계획」이 제목 뒤에 작게 붙으면 된 일로 읽힌다. */
export function ProgressItemCard({ item }: { item: ProgressItem }) {
  return (
    <li className="rounded-card border border-stone bg-taupe px-4 py-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${PROGRESS_CHIP[item.status]}`}>
          {STATUS_LABEL[item.status]}
        </span>
        <span className="tabular text-[11px] text-ash">
          {formatDate(item.date, item.datePrecision)}
        </span>
      </div>

      <p className="mt-2 text-[14px] font-semibold leading-snug text-ink">{item.title}</p>

      {item.highlight && (
        <p className="mt-2 flex items-baseline gap-1.5">
          <span className="tabular text-[20px] font-light leading-none text-navy">
            {item.highlight.value}
          </span>
          <span className="text-[11px] text-smoke">{item.highlight.label}</span>
        </p>
      )}

      {item.note && <p className="mt-2 text-[13px] leading-relaxed text-smoke">{item.note}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <EvidenceButton claimId={item.claimId} count={item.claimSourceCount} />
        {item.achievement && (
          <Link
            href={`/achievement/${item.achievement.slug}`}
            className="text-[12px] font-medium text-navy underline underline-offset-2"
          >
            「{item.achievement.title}」에서 자세히
          </Link>
        )}
      </div>
    </li>
  );
}
