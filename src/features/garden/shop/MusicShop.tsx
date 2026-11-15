"use client";

import { useEffect, useRef, useState } from "react";
import { roomBgm } from "@/lib/firebase/roomBgm";
import { gardenFeedback, quietGardenMusic } from "../feedback";
import { MUSIC_SHOP, type PurchasedTrackId, type ShopTrack } from "../musicTracks";
import { useGarden, type GardenData } from "../store";
import { BuySheet, priceText, ShopCard } from "./parts";

function MusicPreview({ track }: { track: ShopTrack }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [remoteUrl, setRemoteUrl] = useState<string | null>(null);
  const [error, setError] = useState(() => !track.src && !track.storagePath);
  const resolvedSrc = track.src ?? remoteUrl;

  useEffect(() => {
    if (track.src || !track.storagePath) return;
    let alive = true;
    void roomBgm.url(track.storagePath).then((url) => {
      if (!alive) return;
      if (url) setRemoteUrl(url);
      else setError(true);
    });
    return () => { alive = false; };
  }, [track]);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;
    let release: (() => void) | undefined;
    const restore = () => { release?.(); release = undefined; };
    const play = () => { release ??= quietGardenMusic(); };
    const hide = () => { if (document.hidden) audio.pause(); };
    audio.addEventListener("play", play);
    for (const event of ["pause", "ended", "error"]) audio.addEventListener(event, restore);
    document.addEventListener("visibilitychange", hide);
    return () => {
      audio.pause();
      restore();
      audio.removeEventListener("play", play);
      for (const event of ["pause", "ended", "error"]) audio.removeEventListener(event, restore);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [resolvedSrc]);

  return <div className="w-full p-3">
    <p className="mb-2 text-center text-[13px] font-bold">구매 전에 무료로 들어 보세요</p>
    {resolvedSrc ? (
      <audio ref={ref} controls preload="none" src={resolvedSrc} aria-label={`${track.label} 미리 듣기`} className="w-full max-w-full" onError={() => setError(true)} onPlaying={() => setError(false)} />
    ) : !error ? (
      <p role="status" className="py-2 text-center text-[12px] text-smoke">음원 주소를 준비하고 있어요…</p>
    ) : null}
    {error && <p role="status" className="mt-2 text-[12px]">음원을 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요.</p>}
    <p className="mt-2 text-center text-[12px] text-smoke">미리 듣기는 잼을 사용하지 않아요</p>
  </div>;
}

const REFUSAL = { unknown: "없는 음원이에요", owned: "이미 구매한 음원이에요", jam: "잼이 모자라요" };

export function MusicShop({ data, say }: { data: GardenData; say: (text: string) => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const owned = (id: string) => data.room.music?.some((t) => t === id) ?? false;
  const buy = (id: string) => {
    const result = useGarden.getState().buyMusic(id);
    if (result !== true) { say(REFUSAL[result]); return; }
    gardenFeedback("reward");
    say("음원을 샀어요. 이제 내 방 음악으로 설정할 수 있어요.");
  };
  const pick = (id: (typeof MUSIC_SHOP)[number]["id"]) => {
    useGarden.getState().setBgm(id);
    say("내 방 음악으로 설정했어요. ♪ 버튼으로 음악을 켜 보세요.");
    setOpen(null);
  };
  const selected: ShopTrack<PurchasedTrackId> | undefined = MUSIC_SHOP.find((t) => t.id === open);
  return <section aria-label="음원">
    <h3 className="garden-diary-title">💿 내 방 음반 가게 · {MUSIC_SHOP.length}곡</h3>
    <p className="my-2 text-[13px] leading-relaxed text-smoke">마음에 드는 곡을 먼저 들어 보세요. 한 번 구매하면 계속 내 방 BGM으로 고를 수 있고, 방문자도 함께 들어요.</p>
    <ul className="garden-shop-grid">
      {MUSIC_SHOP.map((t) => <ShopCard key={t.id}
        art={<span aria-hidden="true" className="text-[48px]">{t.icon}</span>} title={t.label}
        sub={`${t.hint} · ${t.duration}`} badge={owned(t.id) ? "구매함" : t.license === "AI 창작곡" ? "AI 가요" : "새 음원"}
        buyLabel={data.room.bgm === t.id ? "방 음악으로 설정됨" : owned(t.id) ? "방 음악으로 설정" : priceText(t.price)}
        buyDisabled={data.room.bgm === t.id || (!owned(t.id) && data.jam < t.price)}
        onOpen={() => setOpen(t.id)} onBuy={() => owned(t.id) ? pick(t.id) : setOpen(t.id)} />)}
    </ul>
    {selected && <BuySheet title={selected.label} art={<MusicPreview key={selected.id} track={selected} />}
      facts={[["재생 시간", selected.duration], ["구매", owned(selected.id) ? "구매한 음원" : "한 번 구매 · 계속 사용"]]}
      price={selected.price} wallet={data.jam} blocked={owned(selected.id) ? "이미 구매한 음원이에요" : undefined}
      onBuy={() => buy(selected.id)} onClose={() => setOpen(null)}>
      <p>{selected.hint}</p>
      <p className="mt-2 text-[12px] text-smoke">원곡: {selected.title}<br />음악: {selected.artist}</p>
      {selected.source ? (
        <p className="mt-2 text-[12px]"><a href={selected.source} target="_blank" rel="noopener noreferrer" className="underline">음원 원문·작곡가 ↗</a> · <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer" className="underline">CC0 라이선스 ↗</a></p>
      ) : (
        <p className="mt-2 text-[12px] text-smoke">{selected.license} · 잼통 정원 전용 스트리밍 음원</p>
      )}
      {owned(selected.id) && <button type="button" className="garden-diary-btn mt-3 min-h-[44px] w-full" disabled={data.room.bgm === selected.id} onClick={() => pick(selected.id)}>{data.room.bgm === selected.id ? "내 방 음악으로 설정됨" : "내 방 음악으로 설정"}</button>}
    </BuySheet>}
  </section>;
}
