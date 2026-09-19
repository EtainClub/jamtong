"use client";

import { useUrlSync } from "@/lib/visual-state/url-sync";

/** VisualState ↔ URL 동기화를 켜는 유일한 지점. 스토리 페이지당 하나만 마운트한다. */
export function UrlSyncBoundary({ achievementId }: { achievementId: string }) {
  useUrlSync(achievementId);
  return null;
}
