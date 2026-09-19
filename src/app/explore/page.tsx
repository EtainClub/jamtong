import Link from "next/link";
import type { Metadata } from "next";

import type { Achievement } from "@/content/schema";
import {
  ACHIEVEMENTS,
  PART_LABELS,
  achievementParts,
  byRecency,
  groupAchievements,
  GROUP_LABEL,
} from "@/content/achievements";
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
  // 최근 순. 등록 순서는 내가 만든 순서일 뿐 읽는 사람에게는 뜻이 없다.
  const achievements = [...ACHIEVEMENTS].sort(byRecency);
  const featured = achievements.filter((a) => a.featured);
  const groups = groupAchievements(achievements);
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

        {/*
          * 주요 업적을 맨 위에 따로 세운다.
          *
          * featured는 콘텐츠가 정한다 — 화면이 임의로 고르면 "왜 이것들인가"에
          * 답할 수 없다. 아래 분야 묶음에 같은 업적이 다시 나오는데, 그게
          * 맞다. 이 줄은 분류가 아니라 **먼저 보라는 표시**이므로, 중복이라고
          * 아래에서 빼면 그 분야의 합이 맞지 않게 된다. 대신 다시 나온다고
          * 적어 둔다 — 적지 않으면 읽는 사람이 같은 것을 두 번 세게 된다.
          */}
        {featured.length > 0 && (
          <section aria-labelledby="ex-featured" className="mt-8">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="ex-featured" className="text-[15px] font-bold text-ink">
                주요 업적
              </h2>
              <span className="text-[11px] text-ash">{featured.length}건</span>
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ash">
              분야를 가리지 않고 먼저 볼 만한 것을 골랐습니다. 아래 분야별 묶음에도
              다시 나옵니다.
            </p>
            <ul className="mt-3 space-y-3">
              {featured.map((achievement) => (
                <li key={achievement.id}>
                  <AchievementCard achievement={achievement} showCategory />
                </li>
              ))}
            </ul>
          </section>
        )}

        {groups.map((group) => (
          <section
            key={group.category}
            aria-labelledby={`ex-${group.category}`}
            className="mt-11"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 id={`ex-${group.category}`} className="text-[15px] font-bold text-ink">
                {group.label}
              </h2>
              <span className="text-[11px] text-ash">{group.items.length}건</span>
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ash">{group.note}</p>
            <ul className="mt-3 space-y-3">
              {group.items.map((achievement) => (
                <li key={achievement.id}>
                  <AchievementCard achievement={achievement} />
                </li>
              ))}
            </ul>
          </section>
        ))}

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

/**
 * 업적 카드.
 *
 * `showCategory`는 분야 이름을 카드에도 적을지다. 묶음 안에서는 바로 위
 * 제목이 이미 분야를 말하고 있으므로 끄고, 분야가 섞이는 '주요 업적' 줄에서만
 * 켠다. 어디서나 켜 두면 "외교·안보" 아래 카드마다 "외교·안보"가 한 번 더
 * 붙어, 읽는 사람은 그 둘이 다른 것인지부터 의심하게 된다.
 *
 * kicker는 여기서 쓰지 않는다. '주요 정책'과 '주요 업적'이 섞여 있어 정보가
 * 되지 못했고, 분야가 그 자리를 대신한다.
 */
function AchievementCard({
  achievement,
  showCategory = false,
}: {
  achievement: Achievement;
  showCategory?: boolean;
}) {
  const parts = achievementParts(achievement);
  const ready = parts.filter(Boolean).length;
  const isDraft = achievement.publishStatus === "draft";

  return (
    <Link
      href={`/achievement/${achievement.slug}`}
      className="block rounded-card border border-stone bg-taupe p-4 transition-colors hover:border-graphite"
    >
      {(showCategory || isDraft) && (
        <div className="mb-1.5 flex items-center gap-2">
          {showCategory && (
            <span className="text-[10px] font-bold text-navy">
              {GROUP_LABEL[achievement.category]}
            </span>
          )}
          {isDraft && (
            <span className="rounded-full bg-pending-tint px-2 py-0.5 text-[10px] font-semibold text-pending">
              초안
            </span>
          )}
        </div>
      )}

      <p className="text-base font-bold text-ink">{achievement.title}</p>
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
