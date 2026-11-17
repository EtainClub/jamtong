"use client";

import { useEffect } from "react";

import type { RaidKindId } from "../../rules";
import type { RaidForm } from "../forms";
import { bossSrc } from "./BossRig";

/**
 * 다음 형태 그림을 미리 받아 둔다 — 변신하는 순간 빈 칸이 보이지 않게.
 * BossRig와 따로 둔다: BossRig는 공유 카드(서버 라우트)의 방 그림에도 들어가므로 훅을 쓰지 않는다.
 */
export function BossPreload({ kind, form }: { kind: RaidKindId; form: RaidForm }) {
  useEffect(() => {
    if (form >= 3) return;
    const next = new Image();
    next.src = bossSrc(kind, (form + 1) as RaidForm);
  }, [kind, form]);
  return null;
}
