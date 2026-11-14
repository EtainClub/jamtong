"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * 아래쪽 시트 — 자세히 보기·사기·고르기를 모두 이 틀로 띄운다(docs/garden-miniroom.md §3.1).
 *
 * v1.17의 작물 자세히 보기(Beds.tsx)와 같은 모양이다. <dialog>의 showModal을 쓰므로
 * 뒤쪽은 눌리지 않고, Esc와 바깥 누르기로 닫히며, 포커스가 시트 안에 갇힌다.
 */
export function Sheet({
  label,
  title,
  onClose,
  children,
  className = "",
}: {
  /** 화면 읽기 프로그램이 읽는 이름. */
  label: string;
  /** 시트 맨 위의 제목. 없으면 label을 쓴다. */
  title?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-label={label}
      className="garden-seed-dialog fixed inset-0 z-50 m-0 h-dvh max-h-none w-full max-w-none items-end border-0 bg-transparent p-0 text-inherit open:flex"
      onClick={onClose}
      onCancel={onClose}
    >
      <div
        className={`garden-sheet mx-auto max-h-[78vh] w-full max-w-[560px] overflow-y-auto rounded-t-3xl bg-[var(--g-bg)] p-4 text-[13px] ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span aria-hidden="true" className="garden-sheet-grip" />
        <div className="flex items-center justify-between gap-3">
          <h3 className="min-w-0 text-[15px] font-bold">{title ?? label}</h3>
          <button type="button" onClick={onClose} className="garden-sheet-close shrink-0 text-[13px] text-smoke">
            닫기
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
