"use client";

import { useState } from "react";

import { MySection } from "./MySection";

/**
 * MY의 "계정과 데이터" — 무엇이 어디에 남고, 어떻게 지우는지 한곳에 적는다.
 *
 * 청소년도 쓰는 사이트라 저장되는 것을 숨기지 않는다. 지울 수 있는 것은 여기서 지우고,
 * 모두와 함께 쓰는 기록(꽃밭·광장 등)은 혼자 지울 수 없다는 것도 그대로 적는다.
 */
export function MyAccount({
  anonymous,
  linkNotice,
  onLink,
  onSignOut,
  asks,
  onDeleteAsks,
  hasGarden,
  onResetGarden,
  open,
  onToggle,
}: {
  anonymous: boolean;
  /** 연결이 거부됐을 때의 안내. 프로필 카드와 같은 것을 연결 단추 아래에 붙인다. */
  linkNotice: React.ReactNode;
  onLink: () => void;
  onSignOut: () => void;
  asks: number;
  onDeleteAsks: () => Promise<void>;
  hasGarden: boolean;
  onResetGarden: () => Promise<void>;
  open: boolean;
  onToggle: (id: string, open: boolean) => void;
}) {
  const [busy, setBusy] = useState<"asks" | "garden" | null>(null);

  const run = async (kind: "asks" | "garden", question: string, action: () => Promise<void>) => {
    if (!window.confirm(question)) return;
    setBusy(kind);
    try {
      await action();
    } finally {
      setBusy(null);
    }
  };

  const STORED: Array<[string, string, string]> = [
    ["AI에게 물은 것", "내 계정", "아래에서 모두 지우거나, 위 목록에서 하나씩"],
    ["정원", "이 브라우저와 내 계정", "아래에서 처음부터 다시 시작"],
    ["프로필 사진", "사진 저장소 · 내 화면(상단·MY)에만 쓰고 공개 정원·명패에는 싣지 않아요", "위 프로필에서 ‘올린 사진 내리기’"],
    ["피드백·응원", "모두에게 보이는 게시판", "‘내가 남긴 것’에서 하나씩"],
    ["정정·반론 접수", "나와 운영자만", "‘내가 남긴 것’에서 거두기"],
    [
      "함께 쓴 기록",
      "꽃밭 가꿈·광장·물 주기·시든 잎·거대 잡초",
      "혼자 지울 수 없어요. 이름 대신 계정 번호로 남고, 꽃밭 명패에는 정원 이름이 걸릴 수 있어요",
    ],
  ];

  return (
    <MySection
      id="account"
      icon="⚙"
      title="계정과 데이터"
      summary={anonymous ? "익명 · 이 브라우저에만 남아요" : "구글 계정 연결됨 · 기기를 옮겨도 따라가요"}
      open={open}
      onToggle={onToggle}
    >
      <p className="text-[12.5px] leading-relaxed text-smoke">
        {anonymous
          ? "지금은 익명으로 쓰고 있어요. 이력과 정원은 이 브라우저에만 있고, 다른 기기에서는 보이지 않아요. 구글 계정을 연결하면 지금까지 쌓인 것이 그대로 따라가요. 다만 그 구글 계정으로 이미 만든 기록이 있으면 그쪽으로 들어가고, 익명 쪽 기록은 보이지 않게 돼요."
          : "구글 계정에 연결돼 있어요. 다른 기기에서 같은 계정으로 들어오면 이력과 정원이 따라가요."}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {anonymous ? (
          <button
            type="button"
            onClick={onLink}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-eggshell"
          >
            구글 계정 연결하기
          </button>
        ) : (
          <button
            type="button"
            onClick={onSignOut}
            className="rounded-full border border-stone bg-canvas px-4 py-2 text-sm font-medium text-smoke transition-colors hover:border-graphite hover:text-navy"
          >
            로그아웃
          </button>
        )}
      </div>

      {linkNotice}

      <h3 className="mt-5 text-[13px] font-bold text-navy">무엇이 어디에 남나요</h3>
      <dl className="mt-2 divide-y divide-stone rounded-card border border-stone">
        {STORED.map(([what, where, how]) => (
          <div key={what} className="px-3.5 py-2.5">
            <dt className="text-[12.5px] font-semibold text-ink">{what}</dt>
            <dd className="mt-0.5 text-[11.5px] leading-relaxed text-ash">
              {where} · {how}
            </dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-5 text-[13px] font-bold text-navy">지우기</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={asks === 0 || busy !== null}
          onClick={() =>
            void run("asks", `AI에게 물은 것 ${asks}건을 모두 지울까요? 되돌릴 수 없어요.`, onDeleteAsks)
          }
          className="rounded-full border border-stone bg-canvas px-4 py-2 text-[13px] font-medium text-smoke transition-colors hover:border-pending hover:text-pending disabled:opacity-40"
        >
          {busy === "asks" ? "지우는 중…" : `AI 이력 모두 지우기 (${asks}건)`}
        </button>
        <button
          type="button"
          disabled={!hasGarden || busy !== null}
          onClick={() =>
            void run(
              "garden",
              "정원을 처음부터 다시 시작할까요? 잼·씨앗·도감·쪽지가 모두 사라지고, 공개한 정원도 내려가요. 되돌릴 수 없어요.",
              onResetGarden,
            )
          }
          className="rounded-full border border-stone bg-canvas px-4 py-2 text-[13px] font-medium text-smoke transition-colors hover:border-pending hover:text-pending disabled:opacity-40"
        >
          {busy === "garden" ? "지우는 중…" : "정원 처음부터 다시 시작"}
        </button>
      </div>
    </MySection>
  );
}
