import Link from "next/link";
import type { Metadata } from "next";

import type { Achievement } from "@/content/schema";
import { ACHIEVEMENTS, PART_LABELS, achievementParts } from "@/content/achievements";
import { MILESTONES, ALL_CLAIMS, ALL_SOURCES } from "@/content/milestones";
import { CATEGORY_LABEL, STATUS_LABEL, formatDate } from "@/content/labels";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";
import { EvidenceDrawer } from "@/features/evidence/EvidenceDrawer";

export const metadata: Metadata = { title: "업적" };

/**
 * 업적 목록.
 *
 * 단위는 업적이다. 업적 하나가 일곱 구성요소를 갖추고, 목록은 그 업적들을
 * 늘어놓는다. 예전에는 업적·쇼츠·세부 성과를 평평하게 나열해서 무엇이 단위인지
 * 보이지 않았다.
 */
export default function ExplorePage() {
  const achievements = ACHIEVEMENTS;
  const milestones = [
    ...MILESTONES.filter((m) => m.status === "done"),
    ...MILESTONES.filter((m) => m.status !== "done"),
  ];

  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <h1 className="text-2xl font-light tracking-[-0.02em] text-ink">업적</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          업적 하나마다 쉬운 설명·연표·모션·관계도·근거·AI 안내·쇼츠를 갖춥니다.
          아직 채워지지 않은 것은 채워지지 않은 대로 보입니다.
        </p>

        <ul className="mt-6 space-y-3">
          {achievements.map((achievement) => (
            <li key={achievement.id}>
              <AchievementCard achievement={achievement} />
            </li>
          ))}
        </ul>

        <section aria-labelledby="ex-milestones" className="mt-12">
          <h2 id="ex-milestones" className="text-[15px] font-bold text-ink">
            세부 성과 {milestones.length}건
          </h2>
          {/* 이 18건은 독립된 업적이 아니라 한 부처 업무계획에서 뽑은 항목들이다.
              업적과 같은 층에 두면 단위가 흐려지므로 아래에 따로 둔다. */}
          <p className="mt-1.5 text-[12px] leading-relaxed text-ash">
            해양수산부 2026년 업무계획에서 뽑은 항목입니다. 아직 업적으로 묶이지 않았습니다.
          </p>
          <ul className="mt-3 space-y-2">
            {milestones.map((item) => {
              const claim = ALL_CLAIMS.find((c) => c.id === item.claimIds[0]);
              return (
                <li
                  key={item.id}
                  className="rounded-card border border-stone bg-taupe px-4 py-3.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-navy">
                      {CATEGORY_LABEL[item.categories[0]]}
                    </span>
                    <span className="text-[10px] text-ash">
                      {STATUS_LABEL[item.status]} · {formatDate(item.date, item.datePrecision)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[14px] font-semibold leading-snug text-ink">
                    {item.title}
                  </p>
                  {item.highlight && (
                    <p className="tabular mt-1 text-sm font-bold text-navy">
                      {item.highlight.value}{" "}
                      <span className="text-[11px] font-normal text-ash">
                        {item.highlight.label}
                      </span>
                    </p>
                  )}
                  {claim && (
                    <div className="mt-2.5">
                      <EvidenceButton claimId={claim.id} count={claim.sourceIds.length} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      <BottomNav />
      <EvidenceDrawer claims={ALL_CLAIMS} sources={ALL_SOURCES} />
    </>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const parts = achievementParts(achievement);
  const ready = parts.filter(Boolean).length;
  const isDraft = achievement.publishStatus === "draft";

  return (
    <Link
      href={`/achievement/${achievement.slug}`}
      className="block rounded-card border border-stone bg-taupe p-4 transition-colors hover:border-graphite"
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-navy">{achievement.kicker}</span>
        {isDraft && (
          <span className="rounded-full bg-pending-tint px-2 py-0.5 text-[10px] font-semibold text-pending">
            초안
          </span>
        )}
      </div>

      <p className="mt-1.5 text-base font-bold text-ink">{achievement.title}</p>
      <p className="mt-1 text-[13px] leading-snug text-smoke">{achievement.subtitle}</p>

      {/* 일곱 칸 중 몇 칸이 찼는지. 채워진 칸은 잉크, 빈 칸은 테두리만. */}
      <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
        {parts.map((present, i) => (
          <span
            key={PART_LABELS[i]}
            title={PART_LABELS[i]}
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
              present
                ? "bg-ink text-eggshell"
                : "text-ash ring-1 ring-inset ring-stone"
            }`}
          >
            {PART_LABELS[i]}
          </span>
        ))}
      </div>

      <p className="mt-3 text-[11px] text-ash">
        <span className="tabular">{ready}</span>/7 구성 · 근거{" "}
        <span className="tabular">{achievement.claims.length}</span>건 · 자료{" "}
        <span className="tabular">{achievement.sources.length}</span>건
      </p>
    </Link>
  );
}
