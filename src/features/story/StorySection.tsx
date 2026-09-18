/**
 * 스토리 섹션 껍데기.
 *
 * 레이아웃 셋에서 13번 반복된 마크업이다 — 앵커, 제목, 리드, 본문.
 * 같은 것을 열세 번 적어 두면 여백 하나 고칠 때 열세 곳을 고치게 된다.
 *
 * 배치까지 데이터로 만들지는 않는다. 어느 씬을 어떤 순서로 둘지는 스토리마다
 * 다르고, 그 판단은 아직 레이아웃이 갖는다. (설계 검토 문서 5.1)
 */
export function StorySection({
  scene,
  heading,
  lede,
  children,
  first = false,
}: {
  /** `data-scene` 앵커. AI 안내와 씬 내비게이션이 이 값을 찾는다. */
  scene?: string;
  heading: string;
  lede?: string;
  children: React.ReactNode;
  /** 첫 섹션은 위 여백을 두지 않는다. */
  first?: boolean;
}) {
  const headingId = scene ? `sec-${scene}` : undefined;

  return (
    <section
      data-scene={scene}
      aria-labelledby={headingId}
      className={`mx-auto max-w-5xl scroll-mt-14 border-t border-line px-5 pt-12 ${
        first ? "" : "mt-20"
      }`}
    >
      <h2
        id={headingId}
        className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
      >
        {heading}
      </h2>
      {lede && (
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
          {lede}
        </p>
      )}
      <div className="mt-10">{children}</div>
    </section>
  );
}

/**
 * 본문 + 곁다리 숫자 배치. 레이아웃 넷에서 반복됐다.
 *
 * 폭을 하나로 통일했다. 320과 300을 따로 두던 것은 의미 있는 차이가 아니었고,
 * 값이 갈리면 화면마다 눈금이 어긋난다.
 */
export function SceneWithAside({
  children,
  aside,
}: {
  children: React.ReactNode;
  aside: React.ReactNode;
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-14">
      <div className="min-w-0">{children}</div>
      <div className="min-w-0">{aside}</div>
    </div>
  );
}
