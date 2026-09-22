import Link from "next/link";

import type { Achievement, Claim, Milestone } from "@/content/schema";
import type { CartelProblem } from "@/content/cartels/schema";
import {
  ASSERTION_LABEL,
  ASSERTION_STYLE,
  STATUS_LABEL,
  STATUS_STYLE,
  formatDate,
} from "@/content/labels";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";

/**
 * 카르텔 페이지의 카드들.
 *
 * ★ 업적의 `Section`을 쓰지 않는다.
 *   저 껍데기는 업적 화면의 넓은 단(max-w-5xl, 2xl 제목, mt-20)에 맞춰 만든
 *   것이다. 카르텔은 머리글이 560 단이라, 같은 페이지 안에서 단 폭과 제목
 *   크기가 두 번 바뀌었다. 한 화면에 두 개의 리듬이 있으면 어디까지가 한
 *   덩어리인지 읽히지 않는다.
 *
 * ★ 카드가 한눈에 무엇인지 말한다.
 *   예전에는 문단 하나가 통째로 들어앉아 있어서, 그것이 사실인지 누군가의
 *   말인지 읽어 봐야 알 수 있었다. 층(사실·주장)과 말한 사람, 원문에서 떼어
 *   온 한 마디, 이름 댄 것들의 칩을 먼저 세우고 설명을 뒤에 둔다.
 *
 * ★ 크게 세우는 말은 전부 원문에서 온다.
 *   `headline`과 `tags`는 걸린 근거의 원문에 글자 그대로 있어야 하고,
 *   `validateCartel`이 빌드에서 그것을 검사한다. 가장 크게 읽히는 자리에
 *   편집자가 고쳐 쓴 말이 들어가면 근거 없는 문장이 화면을 대표하게 된다.
 */

/** 머리글과 같은 560 단에 서는 절. */
export function CartelSection({
  id,
  heading,
  count,
  lede,
  children,
}: {
  id: string;
  heading: string;
  /** 제목 옆 건수. 절마다 몇 개인지 먼저 보이면 훑기 쉽다. */
  count?: number;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-9">
      <div className="flex items-baseline gap-2">
        <h2 id={id} className="text-[17px] font-bold tracking-tight text-ink">
          {heading}
        </h2>
        {count !== undefined && (
          <span className="tabular text-[12px] text-ash">{count}</span>
        )}
      </div>
      {lede && <p className="mt-1.5 text-[13px] leading-relaxed text-smoke">{lede}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/**
 * 표적의 현재 모습 한 줄.
 *
 * 0을 지우지 않는다. 담합은 성과가 0이고 계획이 셋인데, 0을 감추면 계획만
 * 남아 이미 무언가 된 것처럼 읽힌다. 비어 있는 칸이 이 표적에 대한 가장
 * 정확한 정보일 때가 있다.
 */
export function TargetStats({ items }: { items: { label: string; value: number }[] }) {
  return (
    <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-stone bg-stone">
      {items.map((item) => (
        <div key={item.label} className="bg-taupe px-4 py-3">
          <dt className="text-[11px] text-ash">{item.label}</dt>
          <dd
            className={`tabular mt-0.5 text-[17px] font-bold ${
              item.value === 0 ? "text-ash" : "text-ink"
            }`}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** 원문에서 떼어 온 낱말들. 나열이면 칩, 단계면 화살표로 잇는다. */
function TagRow({ tags, kind }: { tags: string[]; kind: CartelProblem["tagKind"] }) {
  if (tags.length === 0) return null;

  if (kind === "steps") {
    return (
      <ol className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-2">
        {tags.map((tag, i) => (
          <li key={tag} className="flex items-center gap-1.5">
            {i > 0 && (
              <span aria-hidden="true" className="text-[12px] text-ash">
                →
              </span>
            )}
            <span className="rounded-sm border border-stone bg-eggshell px-2.5 py-1 text-[12px] font-semibold text-graphite">
              {tag}
            </span>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ul className="mt-3 flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-stone bg-eggshell px-2.5 py-1 text-[12px] font-semibold text-graphite"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

export function ProblemCard({ problem, claim }: { problem: CartelProblem; claim?: Claim }) {
  const quoted = claim?.assertionType === "CLAIM";

  return (
    <li className="overflow-hidden rounded-card border border-stone bg-taupe/50">
      {claim && (
        <div className="flex flex-wrap items-center gap-2 border-b border-stone px-4 py-2.5">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${
              ASSERTION_STYLE[claim.assertionType]
            }`}
          >
            {ASSERTION_LABEL[claim.assertionType]}
          </span>
          {claim.assertedBy && (
            <span className="text-[12px] font-medium text-smoke">{claim.assertedBy}</span>
          )}
        </div>
      )}

      <div className="px-4 py-4">
        {problem.headline && (
          /*
           * 주장이면 따옴표를 씌운다. 사실과 주장이 같은 모양으로 크게 서면
           * 누군가의 규정이 이 위키의 서술로 읽힌다.
           */
          <p className="text-[21px] font-light leading-snug tracking-[-0.02em] text-ink">
            {quoted ? `“${problem.headline}”` : problem.headline}
          </p>
        )}

        <TagRow tags={problem.tags} kind={problem.tagKind} />

        <p
          className={`text-[13px] leading-relaxed text-smoke ${
            problem.headline || problem.tags.length > 0 ? "mt-3.5" : ""
          }`}
        >
          {problem.text}
        </p>

        {claim && (
          <div className="mt-3">
            <EvidenceButton claimId={claim.id} count={claim.sourceIds.length} />
          </div>
        )}
      </div>
    </li>
  );
}

/** 이 표적을 깊이 다룬 업적. 들어가는 문이므로 카드 전체가 링크다. */
export function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <li>
      <Link
        href={`/achievement/${achievement.slug}`}
        className="block rounded-card border border-stone px-4 py-3.5 transition-colors hover:border-graphite"
      >
        <span className="text-[11px] font-semibold text-navy">{achievement.kicker}</span>
        <span className="mt-0.5 flex items-baseline gap-2">
          <span className="text-[15px] font-bold text-ink">{achievement.title}</span>
          <span aria-hidden="true" className="ml-auto text-[13px] text-ash">
            →
          </span>
        </span>
        <span className="mt-1 block text-[13px] leading-relaxed text-smoke">
          {achievement.subtitle}
        </span>
      </Link>
    </li>
  );
}

/**
 * 성과 카드.
 *
 * 상태 칩을 왼쪽 맨 앞에 둔다. 「계획」이 제목 뒤에 작게 붙어 있으면 훑는
 * 사람은 제목만 읽고 이미 된 일로 받는다.
 */
export function MilestoneCard({ item, claim }: { item: Milestone; claim?: Claim }) {
  return (
    <li className="rounded-card border border-stone bg-taupe px-4 py-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${
            STATUS_STYLE[item.status]
          }`}
        >
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

      {claim && (
        <div className="mt-3">
          <EvidenceButton claimId={claim.id} count={claim.sourceIds.length} />
        </div>
      )}
    </li>
  );
}

/**
 * 아직 확인하지 못한 것.
 *
 * 번호를 붙인다. 점선 상자만 늘어놓으면 몇 칸이 비어 있는지 세어야 알고,
 * 세어 보는 사람은 없다.
 */
export function GapCard({ text, index }: { text: string; index: number }) {
  return (
    <li className="flex gap-3 rounded-card border border-dashed border-stone bg-taupe/40 px-4 py-3">
      <span className="tabular shrink-0 text-[12px] font-bold text-ash">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="text-[13px] leading-relaxed text-smoke">{text}</span>
    </li>
  );
}
