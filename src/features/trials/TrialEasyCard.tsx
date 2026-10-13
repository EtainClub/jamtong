import type { Policy } from "@/content/policies/schema";
import type { TrialCase } from "@/content/policies/trials";
import type { EasyStep, EasyVoice, Side, TrialEasy } from "@/content/policies/trials/easy";

import { OpenFullButton } from "./TrialsView";

/*
 * 재판 쉽게 보기 — 인포그래픽 카드.
 *
 * 색은 자료에만 쓴다(globals.css의 규칙). 여기서 색이 뜻하는 것은 "누구의 말인가"
 * 하나뿐이다. 검찰 = burgundy, 대통령 측 = navy, 법원·그 밖 = 잉크. 단계 막대와
 * 테두리는 무채색으로 둔다.
 *
 * 맞서는 말은 따옴표로 감싸지 않는다. 그 사람의 말을 그대로 옮긴 것이 아니라
 * 원문 보기의 claim 문장에서 떼어 온 조각이기 때문이다.
 */

export const SIDE_STYLE: Record<Side, { bar: string; label: string }> = {
  prosecution: { bar: "border-burgundy bg-burgundy-tint/60", label: "text-burgundy" },
  defense: { bar: "border-navy bg-navy-tint/60", label: "text-navy" },
  court: { bar: "border-ink bg-taupe", label: "text-ink" },
  other: { bar: "border-ash bg-taupe/60", label: "text-graphite" },
};

function isVerified(policy: Policy, id?: string) {
  return id ? (policy.claims.find((c) => c.id === id)?.verified ?? false) : true;
}

function Pending() {
  return (
    <span className="ml-1 whitespace-nowrap rounded bg-pending-tint px-1 align-middle text-[9px] font-semibold text-pending">
      미검증
    </span>
  );
}

/* ── 단계 막대 ─────────────────────────────────────────────────────── */

function StepDot({ state }: { state: EasyStep["state"] }) {
  if (state === "done") {
    return <span aria-hidden="true" className="block h-3.5 w-3.5 rounded-full bg-ink" />;
  }
  if (state === "stopped") {
    return (
      <span
        aria-hidden="true"
        className="flex h-5 w-5 items-center justify-center gap-[3px] rounded-full border-2 border-ink bg-eggshell"
      >
        <span className="h-2 w-[2.5px] rounded-sm bg-ink" />
        <span className="h-2 w-[2.5px] rounded-sm bg-ink" />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="block h-3.5 w-3.5 rounded-full border-2 border-dashed border-ash bg-eggshell"
    />
  );
}

const STATE_WORD: Record<EasyStep["state"], string> = {
  done: "지남",
  stopped: "여기서 멈춤",
  todo: "남음",
};

export function StepTrack({
  steps,
  policy,
  showPending = true,
}: {
  steps: EasyStep[];
  policy: Policy;
  /** 개요 표에서는 끈다. 다섯 줄 모두에 붙으면 단계가 읽히지 않는다. */
  showPending?: boolean;
}) {
  return (
    <ol
      className="relative grid"
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
    >
      {steps.map((step, i) => (
        <li key={step.label} className="relative flex flex-col items-center px-0.5 text-center">
          {/* 앞 단계와 잇는 선. 지난 구간은 실선, 남은 구간은 점선. */}
          {i > 0 && (
            <span
              aria-hidden="true"
              className={`absolute right-1/2 top-[9px] w-full border-t-2 ${
                step.state === "todo" ? "border-dashed border-stone" : "border-ink"
              }`}
            />
          )}
          <span className="relative z-10 flex h-5 items-center">
            <StepDot state={step.state} />
          </span>
          <span className="mt-1.5 text-[11px] font-bold text-ink">{step.label}</span>
          <span className="sr-only">{STATE_WORD[step.state]}</span>
          {step.state === "stopped" && (
            <span
              aria-hidden="true"
              className="mt-0.5 rounded-full bg-ink px-1.5 py-px text-[9px] font-bold text-eggshell"
            >
              멈춤
            </span>
          )}
          {step.result && (
            <span className="mt-1 text-[10px] leading-snug text-graphite">
              {step.result}
              {showPending && !isVerified(policy, step.claimId) && <Pending />}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

/* ── 맞서는 말 ─────────────────────────────────────────────────────── */

function Voice({ voice, policy }: { voice: EasyVoice; policy: Policy }) {
  const style = SIDE_STYLE[voice.side];
  return (
    <div className={`h-full rounded-r-lg border-l-[3px] px-3 py-2.5 ${style.bar}`}>
      <p className={`text-[10px] font-bold tracking-[0.04em] ${style.label}`}>{voice.label}</p>
      <p className="mt-1 text-[13px] font-semibold leading-snug text-ink">
        {voice.text}
        {!isVerified(policy, voice.claimId) && <Pending />}
      </p>
    </div>
  );
}

/* ── 카드 ──────────────────────────────────────────────────────────── */

/** 사건 카드의 틀. 쉽게 보기와 원문 보기가 같은 머리를 쓴다. */
export function TrialCardShell({
  trial,
  headingId,
  children,
}: {
  trial: TrialCase;
  headingId: string;
  children: React.ReactNode;
}) {
  return (
    <article
      aria-labelledby={headingId}
      className="rounded-card border border-stone bg-eggshell px-4 pb-4 pt-4 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
    >
      <header className="flex items-start justify-between gap-3">
        <h3 id={headingId} className="text-[17px] font-bold tracking-tight text-ink">
          <span className="text-smoke">{trial.no}</span> {trial.name}
        </h3>
        <span className="shrink-0 rounded-full border border-ink px-2 py-0.5 text-[10px] font-bold text-ink">
          재판 중단
        </span>
      </header>
      <p className="mt-1.5 text-[13px] leading-relaxed text-graphite">{trial.question}</p>
      {children}
    </article>
  );
}

export function TrialEasyCard({
  trial,
  easy,
  policy,
}: {
  trial: TrialCase;
  easy: TrialEasy;
  policy: Policy;
}) {
  const accuse = easy.voices.filter((v) => v.side === "prosecution");
  const answer = easy.voices.filter((v) => v.side === "defense");
  const judged = easy.voices.filter((v) => v.side === "court" || v.side === "other");
  const total = easy.breakdown?.parts.reduce((sum, p) => sum + p.amount, 0) ?? 0;

  return (
    <TrialCardShell trial={trial} headingId={`${trial.slug}-easy-h`}>
      <div className="mt-4 rounded-lg bg-taupe/70 px-2 py-3">
        <StepTrack steps={easy.steps} policy={policy} />
      </div>

      {easy.numbers.length > 0 && (
        <dl
          className="mt-3 grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${Math.min(easy.numbers.length, 2)}, minmax(0, 1fr))`,
          }}
        >
          {easy.numbers.map((n) => {
            const prosecution = n.who.startsWith("검찰");
            return (
              <div key={n.label} className="rounded-lg border border-stone px-3 py-2.5">
                <dt className="text-[11px] leading-snug text-smoke">{n.label}</dt>
                <dd
                  className={`tabular mt-0.5 text-[20px] font-bold leading-tight tracking-tight ${
                    prosecution ? "text-burgundy" : "text-ink"
                  }`}
                >
                  {n.value}
                </dd>
                <dd className="mt-1 text-[10px] font-semibold text-ash">
                  {n.who}
                  {!isVerified(policy, n.claimId) && <Pending />}
                </dd>
              </div>
            );
          })}
        </dl>
      )}

      {easy.breakdown && total > 0 && (
        <figure className="mt-3">
          <figcaption className="text-[11px] font-semibold text-smoke">
            {easy.breakdown.title} <span className="font-normal text-ash">· 검찰 주장</span>
          </figcaption>
          <div
            className="mt-1.5 flex h-4 w-full overflow-hidden rounded-full bg-stone"
            aria-hidden="true"
          >
            {easy.breakdown.parts.map((p, i) => (
              <span
                key={p.label}
                className="h-full bg-burgundy"
                style={{
                  width: `${(p.amount / total) * 100}%`,
                  opacity: 1 - i * 0.17,
                  borderRight: "1px solid var(--eggshell)",
                }}
              />
            ))}
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            {easy.breakdown.parts.map((p, i) => (
              <li key={p.label} className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-sm bg-burgundy"
                  style={{ opacity: 1 - i * 0.17 }}
                />
                <span className="text-graphite">{p.label}</span>
                <span className="tabular ml-auto font-semibold text-ink">{p.value}</span>
              </li>
            ))}
          </ul>
        </figure>
      )}

      <div className="mt-4">
        <p className="text-[11px] font-bold text-ink">무엇을 다투나</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="space-y-2">
            {accuse.map((v) => (
              <Voice key={v.text} voice={v} policy={policy} />
            ))}
          </div>
          <div className="space-y-2">
            {answer.map((v) => (
              <Voice key={v.text} voice={v} policy={policy} />
            ))}
          </div>
        </div>
        {judged.length > 0 && (
          <div className="mt-2 space-y-2">
            {judged.map((v) => (
              <Voice key={v.text} voice={v} policy={policy} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex justify-end">
        <OpenFullButton anchor={trial.slug}>원문과 출처 보기 →</OpenFullButton>
      </div>
    </TrialCardShell>
  );
}

/* ── 다섯 재판 한 장 ────────────────────────────────────────────────── */

export function TrialsOverview({
  rows,
  anchorSuffix = "-easy",
}: {
  rows: { trial: TrialCase; easy: TrialEasy; policy: Policy }[];
  /** 누르면 갈 자리. 쉽게 보기는 `<slug>-easy`, 원문 보기는 `<slug>`. */
  anchorSuffix?: string;
}) {
  return (
    <ol className="space-y-3">
      {rows.map(({ trial, easy, policy }) => (
        <li key={trial.slug}>
          <a
            href={`#${trial.slug}${anchorSuffix}`}
            className="block rounded-card border border-stone px-3 pb-3 pt-2.5 transition-colors hover:border-graphite"
          >
            <span className="flex items-baseline justify-between gap-2">
              <span className="text-[13px] font-bold text-ink">
                <span className="text-smoke">{trial.no}</span> {trial.name}
              </span>
              <span className="text-[10px] text-ash">↓</span>
            </span>
            <span className="mt-2 block">
              <StepTrack steps={easy.steps} policy={policy} showPending={false} />
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}

/* ── 낱말 풀이 ─────────────────────────────────────────────────────── */

/** 원문 보기와 같은 풀이를 쓴다 — 두 벌로 두면 한쪽만 고쳐진다. 순서는 기소·무죄·재판 중단. */
const MARKS = ["done", "acquit", "stopped"] as const;

export function TermCards({ terms }: { terms: [string, string][] }) {
  return (
    <ul className="grid grid-cols-3 gap-2">
      {terms
        .map(([term, body], i) => ({ term, body, mark: MARKS[i] ?? "done" }))
        .map((t) => (
          <li key={t.term} className="rounded-card border border-stone bg-taupe/60 px-2.5 py-3">
            <span className="flex h-6 items-center">
              {t.mark === "stopped" ? (
                <StepDot state="stopped" />
              ) : t.mark === "done" ? (
                <StepDot state="done" />
              ) : (
                <span
                  aria-hidden="true"
                  className="block h-3.5 w-3.5 rounded-full border-2 border-ink"
                />
              )}
            </span>
            <span className="mt-1 block text-[13px] font-bold text-ink">{t.term}</span>
            <span className="mt-1 block text-[11px] leading-snug text-graphite">{t.body}</span>
          </li>
        ))}
    </ul>
  );
}
