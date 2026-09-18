import type { Claim, Story } from "@/content/schema";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";

/** 도입부. 요약문이야말로 가장 많이 읽히는 주장이므로 여기에도 근거를 붙인다. */
export function StoryHero({
  story,
  highlights = [],
}: {
  story: Story;
  highlights?: { claimId: string; label: string }[];
}) {
  const chips = highlights
    .map(({ claimId, label }) => {
      const claim = story.claims.find((c: Claim) => c.id === claimId);
      return claim ? { claim, label } : null;
    })
    .filter((v): v is { claim: Claim; label: string } => Boolean(v));

  return (
    <section
      data-scene="hero"
      className="mx-auto max-w-5xl scroll-mt-14 px-5 pt-14 pb-12 sm:pt-20"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ice-400">
        {story.kicker}
      </p>
      <h1 className="mt-4 text-4xl font-bold leading-[1.15] tracking-tight text-text-primary sm:text-6xl">
        {story.title}
      </h1>
      <p className="mt-4 text-xl font-medium leading-snug text-text-secondary sm:text-2xl">
        {story.subtitle}
      </p>
      <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-text-secondary sm:text-base">
        {story.summary}
      </p>

      {chips.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {chips.map(({ claim, label }) => (
            <EvidenceButton
              key={claim.id}
              claimId={claim.id}
              count={claim.sourceIds.length}
              label={label}
            />
          ))}
        </div>
      )}
    </section>
  );
}
