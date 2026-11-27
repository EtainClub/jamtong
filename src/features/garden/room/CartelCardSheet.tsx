"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { track } from "@/lib/analytics";

import { Sheet } from "../Sheet";
import type { CartelCardInfo } from "./cartelInfo";
import type { RoomCartel } from "./cartels";

/**
 * 카르텔 카드를 누르면 — 그 카르텔의 요약과 카르텔 페이지로 가는 길(room/cartels.ts).
 * 요약은 처음 열 때 한 번 받는다(app/garden/cartels.json).
 *
 * ★ 카르텔 페이지처럼 "이 묶음은 이 위키가 지은 것"을 밝힌다. 진행은 조치를 센 것이지 깼다/못 깼다가 아니다.
 */
let loading: Promise<CartelCardInfo[]> | null = null;
function loadCartels(): Promise<CartelCardInfo[]> {
  loading ??= fetch("/garden/cartels.json")
    .then((r) => (r.ok ? (r.json() as Promise<CartelCardInfo[]>) : Promise.reject(new Error(String(r.status)))))
    .catch((error) => {
      loading = null;
      throw error;
    });
  return loading;
}

export function CartelCardSheet({ cartel, onClose }: { cartel: RoomCartel; onClose: () => void }) {
  /** undefined=받는 중, null=받지 못했다. */
  const [list, setList] = useState<CartelCardInfo[] | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    track("cartel_card_open", { slug: cartel.slug });
    loadCartels()
      .then((x) => alive && setList(x))
      .catch((error) => {
        console.error("[garden] 카르텔 요약을 받지 못했다", error);
        if (alive) setList(null);
      });
    return () => {
      alive = false;
    };
  }, [cartel.slug]);

  const info = list?.find((c) => c.slug === cartel.slug);
  const href = `/cartel/${cartel.slug}`;

  return (
    <Sheet label={`${cartel.name} 카르텔 카드`} title={`🎯 ${cartel.name} 카르텔`} onClose={onClose}>
      <div className="mt-3 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/images/cartel/${cartel.slug}.webp`} alt="" width={96} height={96} className="h-24 w-24 shrink-0 rounded-xl border-2 object-contain p-1" style={{ borderColor: cartel.color, background: "#fffdf6" }} />
        <div className="min-w-0 text-[12px] text-smoke">
          <p className="font-semibold" style={{ color: cartel.color }}>슬롯머신에서만 나오는 카드</p>
          {info && (info.open ? <ProgressLine p={info.progress} /> : <p className="mt-0.5">아직 정리 전인 표적이에요.</p>)}
        </div>
      </div>

      {list === undefined ? (
        <p className="mt-3 text-[13px] text-smoke">여는 중…</p>
      ) : !info ? (
        <p className="mt-3 text-[13px] text-smoke">요약을 받지 못했어요. 카르텔 페이지에서 바로 볼 수 있어요.</p>
      ) : (
        <div className="mt-3 space-y-2 text-[13px] leading-relaxed">
          <p>{info.summary}</p>
          {info.problems.length > 0 && (
            <div>
              <p className="text-[12px] font-bold text-smoke">무엇이 문제인가</p>
              <ul className="mt-1 space-y-1.5">
                {info.problems.map((p, i) => (
                  <li key={i} className="rounded-xl border border-stone bg-white px-3 py-2">
                    {p.headline && <b className="block">{p.headline}</b>}
                    <span className="text-[12.5px]">{p.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <p className="mt-3 text-[11.5px] leading-relaxed text-smoke">
        이 묶음은 잼통 위키가 지은 것으로, 정부의 분류가 아니에요. 문장마다 붙은 근거는 카르텔 페이지에 있어요.
      </p>
      <Link href={href} className="garden-diary-btn mt-2 inline-flex min-h-[44px] items-center" onClick={() => track("cartel_card_link", { slug: cartel.slug })}>
        {cartel.name} 카르텔 페이지에서 근거 보기 →
      </Link>
    </Sheet>
  );
}

function ProgressLine({ p }: { p: CartelCardInfo["progress"] }) {
  if (p.total === 0) return <p className="mt-0.5">걸린 조치를 아직 세지 않았어요.</p>;
  return (
    <p className="mt-0.5 tabular-nums">
      걸린 조치 {p.total}건 · 완료 {p.done} · 추진 중 {p.ongoing} · 계획 {p.planned}
    </p>
  );
}
