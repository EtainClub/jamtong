import type { Metadata } from "next";

import { STORIES } from "@/content/stories";
import { ALL_CLAIMS, ALL_SOURCES } from "@/content/achievements";
import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { BUILD } from "@/lib/build-info";

export const metadata: Metadata = {
  title: "이 사이트에 대하여",
  description: "잼통이 무엇을 어떻게 다루는지, 그리고 지금 어떤 빌드가 떠 있는지.",
};

function formatDateTime(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(d);
}

export default function AboutPage() {
  const claimCount = STORIES.reduce((n, s) => n + s.claims.length, 0) + ALL_CLAIMS.length;
  const sourceCount =
    STORIES.reduce((n, s) => n + s.sources.length, 0) + ALL_SOURCES.length;
  const unverified =
    STORIES.reduce((n, s) => n + s.claims.filter((c) => !c.verified).length, 0) +
    ALL_CLAIMS.filter((c) => !c.verified).length;

  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10">
        <h1 className="mt-6 text-2xl font-light tracking-[-0.02em] text-ink">
          이 사이트에 대하여
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-smoke">
          읽는 위키가 아니라 이해하는 위키입니다. 지도를 끌고 연표를 옮기며 무슨 일이
          있었는지 직접 확인합니다.
        </p>

        <section className="mt-8">
          <h2 className="text-[13px] font-semibold text-smoke">지키는 것</h2>
          <p className="mt-2.5 text-[15px] leading-relaxed text-graphite">
            근거 없는 것은 그리지 않습니다. 화면에 뜨는 모든 수치와 단정은 출처를 가리키고,
            출처가 없으면 그 항목 자체가 렌더링되지 않습니다. 빌드가 이를 강제합니다.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-graphite">
            사실과 주장을 구분합니다. 다툼이 있는 수치는 사실로 적지 않고 누구의 계산인지
            밝힙니다. 쟁점을 빼지 않습니다.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-[13px] font-semibold text-smoke">지금 실린 것</h2>
          <dl className="mt-3 divide-y divide-stone border-y border-stone">
            {[
              ["스토리", `${STORIES.length}편`],
              ["근거", `${claimCount}건`],
              ["자료", `${sourceCount}건`],
              ["검증 전", unverified === 0 ? "없음" : `${unverified}건`],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-sm text-smoke">{label}</dt>
                <dd className="tabular text-sm font-semibold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-8">
          <h2 className="text-[13px] font-semibold text-smoke">버전</h2>
          <p className="mt-2.5 text-[13px] leading-relaxed text-ash">
            웹앱이라 따로 설치할 것이 없습니다. 새로고침하면 늘 최신입니다.
            아래는 지금 이 화면을 그린 빌드입니다.
          </p>
          <dl className="mt-3 divide-y divide-stone border-y border-stone">
            {[
              ["버전", BUILD.version],
              ["커밋", BUILD.commit || "—"],
              ["빌드 시각", formatDateTime(BUILD.builtAt)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-sm text-smoke">{label}</dt>
                <dd className="tabular font-mono text-[13px] text-graphite">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-8">
          <h2 className="text-[13px] font-semibold text-smoke">소스 코드</h2>
          <p className="mt-2.5 text-[15px] leading-relaxed text-graphite">
            콘텐츠와 코드가 모두 공개되어 있습니다. 무엇을 근거로 어떻게 썼는지
            이력까지 볼 수 있습니다.
          </p>
          <a
            href="https://github.com/EtainClub/jamtong"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-stone px-4 py-2 text-sm font-medium text-graphite transition-colors hover:border-graphite hover:text-ink"
          >
            github.com/EtainClub/jamtong
            <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>

      <BottomNav />
    </>
  );
}
