import type { Metadata } from "next";

import {
  ACHIEVEMENTS,
  ACHIEVEMENT_CARDS,
  PART_LABELS,
  byRecency,
  groupAchievements,
} from "@/content/achievements";
import { MILESTONES, ALL_CLAIMS, ALL_SOURCES } from "@/content/milestones";
import { CATEGORY_LABEL, STATUS_LABEL, formatDate } from "@/content/labels";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import {
  AchievementBrowser,
  type BrowserGroup,
} from "@/features/achievement/AchievementBrowser";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";
import { EvidenceDrawer } from "@/features/evidence/EvidenceDrawer";

export const metadata: Metadata = { title: "업적" };

/**
 * 업적 목록.
 *
 * 단위는 업적이다. 업적 하나가 일곱 구성요소를 갖추고, 목록은 그 업적들을
 * 늘어놓는다. 예전에는 업적·쇼츠·세부 성과를 평평하게 나열해서 무엇이 단위인지
 * 보이지 않았다.
 *
 * 스물둘이 되면서 한 줄로는 읽히지 않아 분야 고르기를 앞에 뒀다. 고르는 일은
 * 클라이언트에서 하되, **넘기는 것은 카드에 필요한 것만**이다. Achievement를
 * 통째로 넘기면 근거·인용문·관계도·반론이 전부 직렬화돼 첫 화면에 실린다.
 */
export default function ExplorePage() {
  // 최근 순. 등록 순서는 내가 만든 순서일 뿐 읽는 사람에게는 뜻이 없다.
  const achievements = [...ACHIEVEMENTS].sort(byRecency);
  const featuredSlugs = achievements.filter((a) => a.featured).map((a) => a.slug);
  const groups: BrowserGroup[] = groupAchievements(achievements).map((group) => ({
    category: group.category,
    label: group.label,
    note: group.note,
    slugs: group.items.map((item) => item.slug),
  }));

  const milestones = [
    ...MILESTONES.filter((m) => m.status === "done"),
    ...MILESTONES.filter((m) => m.status !== "done"),
  ];

  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="text-2xl font-light tracking-[-0.02em] text-ink">업적</h1>
          <span className="tabular text-[12px] text-ash">전체 {achievements.length}건</span>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          업적 하나마다 쉬운 설명·연표·모션·관계도·근거·AI 안내·쇼츠를 갖춥니다.
          아직 채워지지 않은 것은 채워지지 않은 대로 보입니다.
        </p>

        <AchievementBrowser
          cards={ACHIEVEMENT_CARDS}
          groups={groups}
          featuredSlugs={featuredSlugs}
          partLabels={PART_LABELS}
        />

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
