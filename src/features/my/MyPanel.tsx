"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/lib/firebase/auth";
import { deleteGarden } from "@/lib/firebase/garden";
import { deleteAllAsks, deleteAsk, listAsks, type AskRecord } from "@/lib/firebase/history";

import { clearLocal } from "@/features/garden/store";

import { MyAccount } from "./MyAccount";
import { MyContributions } from "./MyContributions";
import { MyGarden, useMyGarden } from "./MyGarden";
import { MySection, useOpenSections } from "./MySection";

/**
 * MY — 나와 잼통 사이에 쌓인 것.
 *
 * 맨 위 프로필 카드는 늘 펼쳐 두고, 그 아래를 접는 섹션으로 나눈다 — 정원, AI 이력,
 * 내가 남긴 것, 계정과 데이터. 섹션마다 접힌 채로 요약 한 줄이 보인다. 이력이 길어져도
 * 다른 섹션을 밀어내지 않는다.
 *
 * 익명으로도 쓸 수 있다. 다만 익명 계정은 이 브라우저에만 있으므로, 기기를
 * 옮기면 따라오지 않는다는 사실을 감추지 않는다(계정과 데이터 섹션).
 *
 * 남에게 보이는 이름은 정원 이름 하나다. 예전의 "표시 이름"은 어디에도 쓰이지 않아 뺐다.
 *
 * 이력은 업적으로 묶는다. 시간순으로 늘어놓으면 스무 개만 넘어도 무엇을
 * 물었는지 다시 읽어야 알 수 있다. 무엇에 대해 물었는지가 먼저다.
 */
export function MyPanel({ speciesTotal }: { speciesTotal: number }) {
  const { user, ready, configured, linkBlock, ensureUser, signInWithGoogle, switchToGoogle, signOutUser } = useAuth();
  const [asks, setAsks] = useState<AskRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gardenReset, setGardenReset] = useState(false);
  const { open, toggle } = useOpenSections();
  const uid = user?.uid ?? null;
  const loadedGarden = useMyGarden(uid);
  const garden = gardenReset ? null : loadedGarden;

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

  const loginError = (e: { code?: string }) => setError(`로그인하지 못했습니다. (${e?.code ?? "알 수 없는 오류"})`);

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
  const name = garden?.nick || user?.displayName || "익명 이용자";

  return (
    <>
      {/* 프로필 카드 — 늘 펼쳐 둔다. */}
      <section aria-label="프로필" className="mt-6 rounded-card border border-stone bg-taupe p-4">
        <div className="flex items-center gap-3">
          <Avatar user={user} name={name} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-ink">{name}</p>
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-[12px] text-ash">
              <span
                className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                  anonymous ? "bg-stone text-graphite" : "bg-navy text-eggshell"
                }`}
              >
                {anonymous ? "익명" : "구글"}
              </span>
              <span className="truncate">{anonymous ? "이 브라우저에만 저장돼요" : (user?.email ?? "구글 계정")}</span>
            </p>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat label="잼" value={garden ? garden.jam.toLocaleString() : "–"} />
          <Stat label="도감" value={garden ? `${Object.keys(garden.dex).length}/${speciesTotal}` : "–"} />
          <Stat label="물어본 것" value={asks ? `${asks.length}` : "–"} />
        </dl>

        {anonymous && (
          <button
            type="button"
            onClick={() => void signInWithGoogle().catch(loginError)}
            className="mt-4 w-full rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-eggshell"
          >
            구글 계정 연결하기 · 기기를 옮겨도 따라가요
          </button>
        )}
        {error && <Note tone="warn">{error}</Note>}
      </section>

      <MyGarden garden={garden} total={speciesTotal} open={open.has("garden")} onToggle={toggle} />

      <MySection
        id="asks"
        icon="💬"
        title="AI에게 물은 것"
        summary={asks === null ? "불러오는 중…" : asks.length ? `${asks.length}건 · 업적 ${grouped.length}개` : "아직 없어요"}
        open={open.has("asks")}
        onToggle={toggle}
      >
        <p className="text-[12px] leading-relaxed text-ash">
          업적 화면에서 AI 안내에 물은 내용과 그때 받은 답을 그대로 남깁니다.
          근거는 업적 화면에서 엽니다 — 근거 문장은 콘텐츠가 주인이고, 고쳐지면
          고쳐진 것이 보여야 하기 때문입니다.
        </p>

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

        {grouped.map(([slug, rows], i) => (
          <details key={slug} open={i === 0} className="group/ask mt-3 rounded-card border border-stone">
            <summary className="flex cursor-pointer list-none items-center gap-3 px-3.5 py-2.5 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-navy">{rows[0].achievementTitle}</span>
              <span className="tabular shrink-0 text-[11px] text-ash">{rows.length}건</span>
              <span aria-hidden="true" className="shrink-0 text-[11px] text-ash transition-transform group-open/ask:rotate-180">
                ▾
              </span>
            </summary>
            <div className="border-t border-stone px-3.5 pb-3 pt-2">
              <Link href={`/achievement/${slug}`} className="text-[11px] font-medium text-ash hover:text-navy">
                업적 열기 ↗
              </Link>
              <ul className="mt-2 space-y-2">
                {rows.map((ask) => (
                  <li key={ask.id} className="rounded-card border border-stone bg-taupe px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[14px] font-semibold leading-snug text-ink">{ask.question}</p>
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
          </details>
        ))}
      </MySection>

      <MyContributions uid={uid} open={open.has("mine")} onToggle={toggle} />

      <MyAccount
        anonymous={anonymous}
        linkBlock={linkBlock}
        onLink={() => void signInWithGoogle().catch(loginError)}
        onSwitch={() => void switchToGoogle().catch(loginError)}
        onSignOut={() => void signOutUser()}
        asks={asks?.length ?? 0}
        onDeleteAsks={async () => {
          if (!uid) return;
          try {
            await deleteAllAsks(uid);
            setAsks([]);
          } catch (e) {
            console.error("[my] AI 이력을 지우지 못했다", e);
            setError("AI 이력을 다 지우지 못했습니다. 잠시 뒤 다시 해 보세요.");
          }
        }}
        hasGarden={Boolean(garden)}
        onResetGarden={async () => {
          if (!uid) return;
          try {
            await deleteGarden(uid, garden?.share?.id ?? null);
            try {
              clearLocal();
            } catch {
              // 이 브라우저 사본을 못 지우면 정원을 열 때 다시 계정에 올라간다. 알린다.
              setError("이 브라우저의 정원 사본을 지우지 못했습니다. 브라우저 저장소를 비워 주세요.");
            }
            setGardenReset(true);
          } catch (e) {
            console.error("[my] 정원을 지우지 못했다", e);
            setError("정원을 지우지 못했습니다. 잠시 뒤 다시 해 보세요.");
          }
        }}
        open={open.has("account")}
        onToggle={toggle}
      />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col-reverse rounded-card bg-canvas py-2">
      <dt className="text-[11px] text-ash">{label}</dt>
      <dd className="tabular text-[16px] font-bold text-ink">{value}</dd>
    </div>
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
  name,
}: {
  user: { photoURL?: string | null } | null;
  name: string;
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
      {name.slice(0, 1)}
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
