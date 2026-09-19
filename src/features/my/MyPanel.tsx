"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/lib/firebase/auth";
import { deleteAsk, listAsks, type AskRecord } from "@/lib/firebase/history";

/**
 * MY — 내 계정과 내가 물은 것들.
 *
 * 익명으로도 쓸 수 있다. 다만 익명 계정은 이 브라우저에만 있으므로, 기기를
 * 옮기면 이력이 따라오지 않는다는 사실을 감추지 않는다. 구글 계정을 연결하면
 * 그때부터 따라간다.
 *
 * 이력은 업적으로 묶는다. 시간순으로 늘어놓으면 스무 개만 넘어도 무엇을
 * 물었는지 다시 읽어야 알 수 있다. 무엇에 대해 물었는지가 먼저다.
 */
export function MyPanel() {
  const { user, ready, configured, ensureUser, signInWithGoogle, signOutUser, rename } =
    useAuth();
  const [asks, setAsks] = useState<AskRecord[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftName, setDraftName] = useState<string | null>(null);
  const uid = user?.uid;

  // MY를 연 것 자체가 "내 것을 보겠다"는 뜻이므로, 여기서 계정을 만든다.
  useEffect(() => {
    if (!ready || !configured) return;
    let alive = true;
    void (async () => {
      try {
        const account = await ensureUser();
        if (!account || !alive) return;
        const rows = await listAsks(account.uid);
        if (alive) setAsks(rows);
      } catch {
        if (alive) setError("이력을 불러오지 못했습니다.");
      }
    })();
    return () => {
      alive = false;
    };
  }, [ready, configured, ensureUser, uid]);

  const onRemove = useCallback(
    async (id: string) => {
      if (!uid) return;
      setAsks((prev) => prev?.filter((a) => a.id !== id) ?? null);
      try {
        await deleteAsk(uid, id);
      } catch {
        setError("삭제하지 못했습니다.");
      }
    },
    [uid],
  );

  if (!configured) {
    return (
      <Note>
        이 환경에는 파이어베이스 설정이 없습니다. 로그인과 이력은 설정이 있는
        곳에서만 동작합니다.
      </Note>
    );
  }

  if (!ready) return <Note>불러오는 중…</Note>;

  const anonymous = user?.isAnonymous ?? true;
  const grouped = groupByAchievement(asks ?? []);

  return (
    <>
      <section aria-labelledby="my-profile" className="mt-6">
        <h2 id="my-profile" className="text-[15px] font-bold text-ink">
          프로필
        </h2>

        <div className="mt-3 rounded-card border border-stone bg-taupe p-4">
          <div className="flex items-center gap-3">
            <Avatar user={user} />
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-ink">
                {user?.displayName || (anonymous ? "익명 이용자" : "이름 없음")}
              </p>
              <p className="truncate text-[12px] text-ash">
                {anonymous ? "이 브라우저에만 저장됩니다" : (user?.email ?? "구글 계정")}
              </p>
            </div>
          </div>

          {/* 이름 고치기. 익명이어도 제 이름을 붙일 수 있다. */}
          <div className="mt-4">
            <label htmlFor="my-name" className="text-[12px] font-medium text-smoke">
              표시 이름
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                id="my-name"
                value={draftName ?? user?.displayName ?? ""}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="이름을 적어 주세요"
                className="min-w-0 flex-1 rounded-full border border-stone bg-canvas px-4 py-2 text-sm text-ink placeholder:text-ash focus:border-graphite focus:outline-none"
              />
              <button
                type="button"
                disabled={busy || draftName === null || draftName === user?.displayName}
                onClick={async () => {
                  if (draftName === null) return;
                  setBusy(true);
                  try {
                    await rename(draftName.trim());
                    setDraftName(null);
                  } catch {
                    setError("이름을 바꾸지 못했습니다.");
                  } finally {
                    setBusy(false);
                  }
                }}
                className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-eggshell transition-opacity disabled:opacity-35"
              >
                저장
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {anonymous ? (
              <button
                type="button"
                onClick={() =>
                  void signInWithGoogle().catch(() => setError("로그인하지 못했습니다."))
                }
                className="rounded-full border border-stone bg-canvas px-4 py-2 text-sm font-medium text-smoke transition-colors hover:border-graphite hover:text-navy"
              >
                구글 계정 연결하기
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void signOutUser()}
                className="rounded-full border border-stone bg-canvas px-4 py-2 text-sm font-medium text-smoke transition-colors hover:border-graphite hover:text-navy"
              >
                로그아웃
              </button>
            )}
          </div>

          {anonymous && (
            <p className="mt-3 border-l-2 border-stone pl-3 text-[12px] leading-relaxed text-ash">
              지금은 익명으로 쓰고 있습니다. 이력은 이 브라우저에만 남고, 다른
              기기에서는 보이지 않습니다. 구글 계정을 연결하면 지금까지 쌓인 것이
              그대로 따라갑니다. 다만 그 구글 계정으로 이미 만든 기록이 있으면
              그쪽으로 들어가고, 익명 쪽 이력은 보이지 않게 됩니다.
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="my-asks" className="mt-9">
        <h2 id="my-asks" className="text-[15px] font-bold text-ink">
          AI에게 물은 것 {asks ? `${asks.length}건` : ""}
        </h2>
        <p className="mt-1.5 text-[12px] leading-relaxed text-ash">
          업적 화면에서 AI 안내에 물은 내용과 그때 받은 답을 그대로 남깁니다.
          근거는 업적 화면에서 엽니다 — 근거 문장은 콘텐츠가 주인이고, 고쳐지면
          고쳐진 것이 보여야 하기 때문입니다.
        </p>

        {error && <Note tone="warn">{error}</Note>}
        {asks === null && !error && <Note>불러오는 중…</Note>}

        {asks?.length === 0 && (
          <Note>
            아직 물어본 것이 없습니다.{" "}
            <Link href="/explore" className="font-medium text-navy underline underline-offset-2">
              업적
            </Link>
            을 열고 오른쪽 아래 &lsquo;AI에게 묻기&rsquo;를 눌러 보세요.
          </Note>
        )}

        {grouped.map(([slug, rows]) => (
          <div key={slug} className="mt-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[13px] font-bold text-navy">{rows[0].achievementTitle}</h3>
              <Link
                href={`/achievement/${slug}`}
                className="shrink-0 text-[11px] font-medium text-ash hover:text-navy"
              >
                업적 열기 ↗
              </Link>
            </div>

            <ul className="mt-2 space-y-2">
              {rows.map((ask) => (
                <li key={ask.id} className="rounded-card border border-stone bg-taupe px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[14px] font-semibold leading-snug text-ink">
                      {ask.question}
                    </p>
                    <button
                      type="button"
                      onClick={() => void onRemove(ask.id)}
                      aria-label="이 기록 지우기"
                      className="shrink-0 rounded-full px-1.5 py-0.5 text-[11px] text-ash transition-colors hover:bg-stone hover:text-smoke"
                    >
                      지우기
                    </button>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-smoke">{ask.message}</p>
                  <p className="mt-2 flex flex-wrap items-center gap-x-2 text-[11px] text-ash">
                    <span className="tabular">{formatWhen(ask.askedAt)}</span>
                    {!ask.grounded && <span className="text-pending">자료 밖 질문</span>}
                    {ask.claimIds.length > 0 && (
                      <span>
                        근거 <span className="tabular">{ask.claimIds.length}</span>건
                      </span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}

/** 업적별로 묶되, 최근에 물은 업적이 위로 온다(목록이 이미 최신순이다). */
function groupByAchievement(asks: AskRecord[]): [string, AskRecord[]][] {
  const map = new Map<string, AskRecord[]>();
  for (const ask of asks) {
    const bucket = map.get(ask.achievementSlug);
    if (bucket) bucket.push(ask);
    else map.set(ask.achievementSlug, [ask]);
  }
  return [...map.entries()];
}

function formatWhen(date: Date | null): string {
  if (!date) return "방금";
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

function Avatar({
  user,
}: {
  user: { photoURL?: string | null; displayName?: string | null } | null;
}) {
  if (user?.photoURL) {
    // 구글 프로필 사진. 도메인을 next/image에 열어 두는 대신 그냥 img로 둔다.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={user.photoURL} alt="" className="h-11 w-11 shrink-0 rounded-full" />;
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone text-[15px] font-bold text-smoke"
    >
      {(user?.displayName ?? "잼").slice(0, 1)}
    </span>
  );
}

function Note({ children, tone }: { children: React.ReactNode; tone?: "warn" }) {
  return (
    <p
      className={`mt-3 border-l-2 pl-4 text-[13px] leading-relaxed ${
        tone === "warn" ? "border-pending text-pending" : "border-stone text-ash"
      }`}
    >
      {children}
    </p>
  );
}
