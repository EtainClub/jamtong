import Image from "next/image";
import Link from "next/link";

import type { ProgressCount } from "@/content/cartels";
import type { Cartel } from "@/content/cartels/schema";
import { ProgressBar } from "./CartelProgress";

/**
 * 카르텔 지도 — 가운데를 두고 표적들이 둘러선다.
 *
 * ★ n×n 격자의 바깥 테두리에 세운다.
 *   테두리는 4n−4칸이고 안쪽 (n−2)×(n−2)가 가운데 자리다. 원 위에 좌표로
 *   흩어 놓으면 휴대폰 폭에서 이름이 서로 겹치고, 수가 바뀔 때마다 각도를
 *   다시 맞춰야 한다. 격자는 칸이 남으면 빈칸으로 둘 뿐이다.
 *
 * ★ 왼쪽 위에서 시계 방향으로, 들여다본 것이 먼저다.
 *   빈 것을 섞어 두면 열어 볼 것이 있는 자리가 보이지 않는다. 목록일 때
 *   둘을 나눠 그린 것과 같은 이유다.
 *
 * 그림은 표적을 상징하는 삽화다. 항목별 확인 상태는 테두리와 문구로 남긴다.
 */
export function CartelRing({
  open,
  empty,
  counts,
}: {
  open: Cartel[];
  empty: Cartel[];
  /** 표적별 진행. 칸마다 작은 막대로 보인다. */
  counts: Record<string, ProgressCount>;
}) {
  const items = [...open.map((c) => ({ cartel: c, open: true })), ...empty.map((c) => ({ cartel: c, open: false }))];

  let n = 3;
  while (4 * n - 4 < items.length) n += 1;
  const cells = perimeter(n);

  return (
    <nav aria-label="카르텔 표적" className="relative mt-6">
      {/* 가운데에서 퍼지는 고리. 칸들이 한 덩어리로 읽히게 한다. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[8%] rounded-full border border-dashed border-stone"
      />
      <ol
        className="relative grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
          gridAutoRows: "1fr",
        }}
      >
        {items.map(({ cartel, open: isOpen }, i) => {
          const [row, col] = cells[i];
          return (
            <li key={cartel.slug} style={{ gridRow: row, gridColumn: col }}>
              <Link
                href={`/cartel/${cartel.slug}`}
                title={cartel.summary}
                className={`group flex h-full flex-col items-center gap-2 rounded-card px-1 pb-2.5 pt-3 text-center transition-colors ${
                  isOpen
                    ? "border border-stone bg-taupe hover:border-graphite"
                    : "border border-dashed border-stone bg-canvas hover:border-graphite"
                }`}
              >
                {/* 휴대폰 폭에서는 칸 너비를 다 쓰고(약 76px), 넓은 화면에서도 원본 192px의 절반을 넘지 않는다. */}
                <span
                  className="relative grid aspect-square w-full max-w-[96px] place-items-center transition-transform group-hover:scale-105"
                >
                  <Image
                    src={`/images/cartel/${cartel.slug}.webp`}
                    alt=""
                    width={192}
                    height={192}
                    sizes="96px"
                    className="h-full w-full object-contain"
                  />
                </span>
                <span
                  className={`text-[12px] font-bold leading-tight ${
                    isOpen ? "text-ink" : "text-smoke"
                  }`}
                >
                  {cartel.name}
                </span>
                {!isOpen && <span className="-mt-1 text-[10px] text-ash">정리 전</span>}
                {isOpen && counts[cartel.slug] && (
                  <span className="-mt-0.5 block w-full px-2">
                    <ProgressBar count={counts[cartel.slug]} size="sm" />
                  </span>
                )}
              </Link>
            </li>
          );
        })}

        <li
          aria-hidden="true"
          className="grid place-items-center"
          style={{ gridRow: `2 / ${n}`, gridColumn: `2 / ${n}` }}
        >
          <div className="relative aspect-square w-full max-w-[220px] text-center text-eggshell">
            <Image
              src="/images/cartel/lee-breaking-cartel.webp"
              alt=""
              width={440}
              height={440}
              sizes="(max-width: 560px) 44vw, 220px"
              loading="eager"
              className="h-full w-full object-contain"
            />
            <div className="absolute inset-x-1 bottom-0 rounded-lg bg-ink/90 px-1 py-1.5">
              <p className="text-[9px] font-semibold tracking-[0.08em] text-eggshell/60">
                표적별로 보기
              </p>
              <p className="text-[18px] font-extrabold tracking-[-0.02em]">카르텔</p>
              <p className="tabular text-[9px] leading-relaxed text-eggshell/75">
                들여다본 것 {open.length}
                {" · "}
                정리 전 {empty.length}
              </p>
            </div>
          </div>
        </li>
      </ol>
    </nav>
  );
}

/** n×n 격자의 테두리 칸을 왼쪽 위에서 시계 방향으로. [행, 열], 1부터. */
function perimeter(n: number): [number, number][] {
  const cells: [number, number][] = [];
  for (let c = 1; c <= n; c++) cells.push([1, c]);
  for (let r = 2; r <= n; r++) cells.push([r, n]);
  for (let c = n - 1; c >= 1; c--) cells.push([n, c]);
  for (let r = n - 1; r >= 2; r--) cells.push([r, 1]);
  return cells;
}
