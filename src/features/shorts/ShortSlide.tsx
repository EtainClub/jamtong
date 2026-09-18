"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Achievement, Claim } from "@/content/schema";
import { CATEGORY_LABEL, STATUS_LABEL, formatDate } from "@/content/labels";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";
import { CATEGORY_THEME, parseCountable } from "./theme";

/**
 * 숏츠 한 장.
 *
 * 6초 안에 하나만 전달한다: 무슨 일이 있었고, 숫자가 얼마이며, 근거가 무엇인지.
 * 설명을 늘리면 숏츠가 아니게 되므로 본문은 두 줄을 넘기지 않는다.
 *
 * 등장 순서에 의도가 있다. 숫자가 먼저 올라오고 제목이 뒤따른다 —
 * 스크롤을 멈추게 하는 것은 문장이 아니라 숫자다.
 */

const COUNT_MS = 1100;

export function ShortSlide({
  item,
  claims,
  active,
}: {
  item: Achievement;
  claims: Claim[];
  active: boolean;
}) {
  const theme = CATEGORY_THEME[item.categories[0]];
  const supporting = item.claimIds
    .map((id) => claims.find((c) => c.id === id))
    .filter((c): c is Claim => Boolean(c));
  const sourceCount = new Set(supporting.flatMap((c) => c.sourceIds)).size;

  return (
    <article
      className="relative flex h-full w-full flex-col overflow-hidden px-7 py-16 sm:px-10"
      style={{ background: `linear-gradient(160deg, ${theme.from}, ${theme.to})` }}
      aria-roledescription="숏츠"
      aria-label={item.title}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
        style={{ background: theme.accent, opacity: 0.1 }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={{ background: theme.accent, color: theme.onAccent }}
        >
          {STATUS_LABEL[item.status]}
        </span>
        {item.categories.slice(0, 2).map((c) => (
          <span
            key={c}
            className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/70"
          >
            {CATEGORY_LABEL[c]}
          </span>
        ))}
      </div>

      <div className={item.highlight ? "mt-auto" : "my-auto"}>
        {item.highlight && (
          <Reveal active={active} delay={180}>
            <p className="leading-[0.95]">
              <CountUp value={item.highlight.value} active={active} accent={theme.accent} />
            </p>
            <p className="mt-3 text-sm font-medium text-white/60">{item.highlight.label}</p>
          </Reveal>
        )}

        <Reveal active={active} delay={item.highlight ? 520 : 180}>
          <h2 className="mt-7 text-[28px] font-bold leading-[1.25] tracking-tight text-white sm:text-[34px]">
            {item.title}
          </h2>
        </Reveal>

        <Reveal active={active} delay={item.highlight ? 760 : 420}>
          <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-white/65">
            {item.summary}
          </p>
        </Reveal>
      </div>

      <Reveal active={active} delay={1000}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {supporting[0] && (
            <EvidenceButton claimId={supporting[0].id} count={sourceCount} />
          )}
          <span className="text-xs text-white/40">
            {formatDate(item.date, item.datePrecision)}
          </span>
          {item.storySlug && (
            <Link
              href={`/story/${item.storySlug}`}
              className="ml-auto rounded-full px-4 py-2 text-sm font-bold transition-opacity hover:opacity-85"
              style={{ background: theme.accent, color: theme.onAccent }}
            >
              직접 움직여보기 →
            </Link>
          )}
        </div>
      </Reveal>
    </article>
  );
}

/** 활성화된 슬라이드에서만 순서대로 올라온다. */
function Reveal({
  active,
  delay,
  children,
}: {
  active: boolean;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 420ms ${delay}ms var(--ease-out-expo), transform 420ms ${delay}ms var(--ease-out-expo)`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * 숫자 카운트업.
 *
 * DOM을 직접 쓴다. 프레임마다 setState를 하면 60fps로 리렌더가 돌고,
 * 이 컴포넌트가 바꾸는 것은 텍스트 한 줄뿐이라 React를 거칠 이유가 없다.
 *
 * 초기 렌더는 최종값이다. 서버 출력과 자바스크립트가 꺼진 환경에서 0이 보이면
 * 그건 틀린 숫자다.
 */
function CountUp({
  value,
  active,
  accent,
}: {
  value: string;
  active: boolean;
  accent: string;
}) {
  const parsed = parseCountable(value);
  const ref = useRef<HTMLSpanElement>(null);

  const format = (n: number) =>
    parsed.prefix +
    n.toLocaleString("ko-KR", {
      minimumFractionDigits: parsed.decimals,
      maximumFractionDigits: parsed.decimals,
    }) +
    parsed.suffix;

  useEffect(() => {
    const node = ref.current;
    const target = parsed.target;
    if (node === null || target === null) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!active || reduced) {
      node.textContent = format(target);
      return;
    }

    const start = performance.now();
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - start) / COUNT_MS);
      // ease-out-cubic. 끝에서 천천히 멈춰야 숫자가 읽힌다.
      node.textContent = format(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(step);
    });

    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, value]);

  if (parsed.target === null) {
    return (
      <span
        className="tabular text-[52px] font-black tracking-tight sm:text-[64px]"
        style={{ color: accent }}
      >
        {value}
      </span>
    );
  }

  return (
    <span
      className="tabular text-[52px] font-black tracking-tight sm:text-[64px]"
      style={{ color: accent }}
      aria-label={value}
    >
      <span ref={ref} aria-hidden="true">
        {format(parsed.target)}
      </span>
    </span>
  );
}
