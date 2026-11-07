"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { loadGarden } from "@/lib/firebase/garden";
import { kstDayNumber } from "@/features/garden/rules";
import { readLocal, type GardenData } from "@/features/garden/store";

import { MySection } from "./MySection";

/**
 * MY의 "내 정원" — 정원을 열지 않고도 내 정원이 어떤지 본다.
 *
 * 이 브라우저의 정원과 계정의 정원 중 이 계정 것이고 더 새것을 보인다(정원의 link와 같은 판정).
 * 보이기만 한다. 고치는 것은 정원에서 한다 — 두 곳에서 쓰면 정원이 갈라진다.
 * 하나 예외가 정원 이름(= MY의 닉네임)이다. MyProfile이 이 정원에 이름만 바꿔 쓴다(renameStoredGarden).
 */
export function useMyGarden(uid: string | null): GardenData | null | undefined {
  const [garden, setGarden] = useState<{ uid: string | null; data: GardenData | null } | null>(null);

  useEffect(() => {
    let alive = true;
    const local = readLocal();
    void (async () => {
      let remote: GardenData | null = null;
      if (uid) {
        try {
          remote = await loadGarden<GardenData>(uid);
        } catch (error) {
          console.error("[my] 계정의 정원을 읽지 못했다", error);
        }
      }
      if (!alive) return;
      const usable = remote?.v === 1 ? remote : null;
      const keepLocal = local && (!usable || (local.owner === uid && local.updatedAt >= usable.updatedAt));
      setGarden({ uid, data: keepLocal ? local : (usable ?? local) });
    })();
    return () => {
      alive = false;
    };
  }, [uid]);

  return garden?.uid === uid ? garden.data : undefined;
}

export function MyGarden({
  garden,
  total,
  open,
  onToggle,
}: {
  garden: GardenData | null | undefined;
  /** 품종표의 품종 수. 서버가 넘긴다. */
  total: number;
  open: boolean;
  onToggle: (id: string, open: boolean) => void;
}) {
  const [now] = useState(() => Date.now());

  if (garden === undefined) {
    return (
      <MySection id="garden" icon="🌱" title="내 정원" summary="불러오는 중…" open={open} onToggle={onToggle}>
        <p className="text-[12px] text-ash">불러오는 중…</p>
      </MySection>
    );
  }

  if (garden === null) {
    return (
      <MySection id="garden" icon="🌱" title="내 정원" summary="아직 정원을 시작하지 않았어요" open={open} onToggle={onToggle}>
        <p className="text-[13px] leading-relaxed text-smoke">
          업적·정책·언행 씨앗을 심어 키우고, 열매 속 쪽지로 근거를 한 줄씩 모으는 정원이에요.
        </p>
        <GoGarden label="정원 시작하기" />
      </MySection>
    );
  }

  const dex = Object.keys(garden.dex).length;
  const planted = garden.beds.filter(Boolean).length;
  const ripe = garden.beds.filter((p) => p && p.ripeAt <= now).length;
  const today = kstDayNumber(now);
  const waters = garden.waters?.day === today ? garden.waters : null;
  const share = garden.share ?? { id: null, on: false };

  const rows: Array<[string, string]> = [
    ["잼", garden.jam.toLocaleString()],
    ["도감", `${dex}/${total}`],
    ["모은 쪽지", `${garden.notes.length}장`],
    ["텃밭", planted ? `${planted}/${garden.beds.length}칸 심음${ripe ? ` · ${ripe}칸 다 익음` : ""}` : `${garden.beds.length}칸 비어 있음`],
    ["탐정 온실", `푼 사건 ${garden.cases?.solved.length ?? 0}건`],
    ["시든 잎", `확인 ${garden.leaves?.checked.length ?? 0}장`],
    ["거대 잡초", `상자 ${garden.raids?.length ?? 0}개`],
  ];

  return (
    <MySection
      id="garden"
      icon="🌱"
      title="내 정원"
      summary={`「${garden.nick}」 · 도감 ${dex}/${total}${ripe ? ` · 다 익은 밭 ${ripe}` : ""}${share.on ? " · 공개 중" : ""}`}
      badge={ripe ? "수확" : null}
      open={open}
      onToggle={onToggle}
    >
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[13px]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-ash">{k}</dt>
            <dd className="tabular text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 rounded-card bg-taupe px-3.5 py-3 text-[12px] leading-relaxed text-smoke">
        {share.on && share.id ? (
          <>
            <p className="font-semibold text-ink">정원을 공개하고 있어요</p>
            <p className="mt-0.5">
              오늘 받은 물 {waters?.received.length ?? 0}번 · 준 물 {waters?.given.length ?? 0}번. 공개는 정원 머리의
              &lsquo;자랑하기&rsquo;에서 끄고 켭니다.
            </p>
          </>
        ) : (
          <p>
            정원은 공개하지 않았어요. 공개하면 친구가 링크로 놀러 와 물을 줄 수 있어요(정원 머리의 &lsquo;자랑하기&rsquo;).
          </p>
        )}
        <p className="mt-1.5">정원 이름 「{garden.nick}」은 MY의 닉네임과 같아요. 위 프로필이나 정원의 꽃밭 탭에서 바꿉니다. 정원지기가 되면 이 이름이 명패에 걸려요.</p>
      </div>

      <GoGarden label={ripe ? `수확하러 가기 · ${ripe}칸` : "정원으로 가기"} />
    </MySection>
  );
}

function GoGarden({ label }: { label: string }) {
  return (
    <Link
      href="/garden"
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-eggshell"
    >
      {label}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
