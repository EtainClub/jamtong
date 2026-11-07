"use client";

import type { LinkBlock } from "@/lib/firebase/auth";

/**
 * 구글 연결이 거부됐을 때의 안내.
 *
 * 연결 단추 바로 아래에 둔다. 예전에는 접힌 "계정과 데이터" 안에만 있어서, 사용자는
 * 팝업이 닫히고 아무 일도 없었던 것으로 보았다. 무엇이 막혔는지, 무엇을 고를 수 있는지,
 * 고르면 무엇을 잃는지를 여기서 다 말한다.
 */
export function LinkBlockNotice({
  block,
  current,
  onSwitch,
  onRelink,
  onDismiss,
}: {
  block: NonNullable<LinkBlock>;
  /** 지금 익명 기록의 요약. 그 계정으로 들어가면 보이지 않게 될 것. 예: "잼 17,840 · 도감 34종" */
  current: string | null;
  onSwitch: () => void;
  onRelink: () => void;
  onDismiss: () => void;
}) {
  const who = block.email ?? "고른 구글 계정";
  const losing = current ? `지금 익명 기록(${current})` : "지금 익명 기록";

  const confirmSwitch = () => {
    if (window.confirm(`${who}로 들어가면 ${losing}은 다시 볼 수 없어요. 되돌릴 수 없습니다. 들어갈까요?`)) onSwitch();
  };

  return (
    <div role="alert" className="mt-3 rounded-card border border-pending bg-pending-tint p-3.5 text-left">
      <p className="text-[13px] font-semibold leading-relaxed text-pending">
        {block.email ? (
          <>
            <span className="break-all">{block.email}</span>에는 이미 잼통 기록이 따로 있어요
          </>
        ) : (
          "그 구글 계정에는 이미 잼통 기록이 따로 있어요"
        )}
      </p>
      <p className="mt-1.5 text-[12px] leading-relaxed text-smoke">
        그래서 지금 익명 기록에 연결하지 않았어요. 두 기록은 합칠 수 없어서, 하나를 골라야 해요.
      </p>

      <ul className="mt-3 space-y-2.5">
        <li>
          <button
            type="button"
            onClick={confirmSwitch}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-eggshell"
          >
            그 계정으로 들어가기
          </button>
          <p className="mt-1 text-[11.5px] leading-relaxed text-smoke">
            그 계정에 쌓인 기록을 이어 써요. {losing}은 보이지 않게 되고 되돌릴 수 없어요.
          </p>
        </li>
        <li>
          <button
            type="button"
            onClick={onRelink}
            className="rounded-full border border-stone bg-canvas px-4 py-2 text-sm font-medium text-navy"
          >
            다른 구글 계정 고르기
          </button>
          <p className="mt-1 text-[11.5px] leading-relaxed text-smoke">
            아직 잼통에 쓴 적 없는 계정을 고르면 지금 기록이 그대로 그 계정에 붙어요.
          </p>
        </li>
        <li>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full border border-stone bg-canvas px-4 py-2 text-sm font-medium text-smoke"
          >
            익명으로 계속 쓰기
          </button>
          <p className="mt-1 text-[11.5px] leading-relaxed text-smoke">
            아무것도 바뀌지 않아요. 기록은 이 브라우저에만 남아요.
          </p>
        </li>
      </ul>
    </div>
  );
}
