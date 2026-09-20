import Link from "next/link";

import { HORIZON_LABEL, type ActionItem } from "@/content/books/schema";

/**
 * 할 일 — 이 섹션이 있는 이유.
 *
 * 나힐의 챌린지 자리다. 다만 거기는 스스로 정한 수행이고, 여기는 **읽은
 * 글에서 뽑아낸 것**이다. 그래서 문구를 우리가 지어내지 않고 그 장이 말한
 * 범위 안에서만 만든다.
 *
 * 화면에서 이 블록은 본문보다 아래에 있지만 시각적으로는 더 무겁다. 글을 다
 * 읽지 않고 내려온 사람도 여기서 멈추게 하려는 것이다 — 읽는 것이 목적이
 * 아니라 하는 것이 목적이다.
 */
export function ActionList({ actions }: { actions: ActionItem[] }) {
  /* 오늘 → 이번 주 → 늘. 가까운 것부터 보여야 시작할 수 있다. */
  const order = { today: 0, week: 1, always: 2 } as const;
  const sorted = [...actions].sort((a, b) => order[a.horizon] - order[b.horizon]);

  return (
    <section aria-labelledby="actions" className="mt-9">
      <div className="rounded-card border-2 border-ink bg-taupe/60 px-4 py-5">
        <h2 id="actions" className="text-[15px] font-bold text-ink">
          이 장을 읽었다면, 할 수 있는 일
        </h2>
        <p className="mt-1.5 text-[12px] leading-relaxed text-smoke">
          읽고 끝나지 않게 하려고 둡니다. 이 장이 말한 범위 안에서 뽑은 것이고,
          그 밖의 주장은 넣지 않습니다.
        </p>

        <ol className="mt-4 space-y-3">
          {sorted.map((action, index) => (
            <li key={action.id} className="rounded-card border border-stone bg-canvas px-4 py-3">
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-semibold text-ash">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold text-eggshell">
                  {HORIZON_LABEL[action.horizon]}
                </span>
              </div>

              <h3 className="mt-1.5 text-[14px] font-bold text-ink">{action.title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-smoke">{action.detail}</p>

              {action.link &&
                (action.link.href.startsWith("tel:") ? (
                  <a
                    href={action.link.href}
                    className="mt-2 inline-block text-[12px] font-medium text-navy hover:underline"
                  >
                    {action.link.label} ☎
                  </a>
                ) : action.link.href.startsWith("/") ? (
                  <Link
                    href={action.link.href}
                    className="mt-2 inline-block text-[12px] font-medium text-navy hover:underline"
                  >
                    {action.link.label} →
                  </Link>
                ) : (
                  <a
                    href={action.link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-2 inline-block text-[12px] font-medium text-navy hover:underline"
                  >
                    {action.link.label} ↗
                  </a>
                ))}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
