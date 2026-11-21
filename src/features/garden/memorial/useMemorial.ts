"use client";

import { useEffect, useState } from "react";

import type { MemorialEntry } from "./types";

/**
 * 기념관·사진첩 자료는 처음 열 때 한 번 받는다(app/garden/memorial.json). 탭을 오가도 다시 받지 않는다.
 * 탐정 온실의 cases.json과 같은 방식이다.
 */
let loading: Promise<MemorialEntry[]> | null = null;
export function loadMemorial(): Promise<MemorialEntry[]> {
  loading ??= fetch("/garden/memorial.json")
    .then((r) => (r.ok ? (r.json() as Promise<MemorialEntry[]>) : Promise.reject(new Error(String(r.status)))))
    .catch((error) => {
      loading = null;
      throw error;
    });
  return loading;
}

/** undefined=받는 중, null=받지 못했다. */
export function useMemorial(): MemorialEntry[] | null | undefined {
  const [entries, setEntries] = useState<MemorialEntry[] | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    loadMemorial()
      .then((list) => alive && setEntries(list))
      .catch((error) => {
        console.error("[memorial] 기념관 자료를 받지 못했다", error);
        if (alive) setEntries(null);
      });
    return () => {
      alive = false;
    };
  }, []);
  return entries;
}

/** 업적 품종 id(a:<slug>)로 찾는다. */
export function entryOf(entries: readonly MemorialEntry[] | null | undefined, speciesId: string | undefined): MemorialEntry | undefined {
  return speciesId ? entries?.find((e) => e.speciesId === speciesId) : undefined;
}
