"use client";

import { analyticsConfigured, firebaseApp } from "@/lib/firebase/client";

/**
 * 계측 (설계서 41장).
 *
 * ★ 세는 것은 조회수가 아니다.
 *   설계서가 중요하다고 적은 지표는 근거를 열었는가, 연표를 직접 움직였는가,
 *   공유했는가, 물었는가다. 그래서 다섯만 센다 — 페이지뷰는 파이어베이스가
 *   알아서 보내고, 우리가 더 붙일 것은 "이해에 닿았는가"의 흔적뿐이다.
 *
 * ★ 사람이 쓴 글은 보내지 않는다.
 *   질문 문장은 파라미터에 담지 않는다. 길이와 근거가 붙었는지만 보낸다.
 *   그것으로 "질문이 답에 닿는가"는 알 수 있고, 무엇을 물었는지는 우리가
 *   알 자리가 아니다.
 *
 * ★ 측정 ID가 없으면 아무 일도 하지 않는다.
 *   `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`를 넣은 환경에서만 모듈을 내려받고
 *   붙인다. 넣지 않으면 계측 스크립트도 쿠키도 없다. 그래서 이 파일은 켜고
 *   끄는 스위치가 아니라 **없으면 없는 기능**이다.
 *
 * 모듈은 첫 이벤트에서 한 번 동적으로 내려받는다. 첫 화면에 계측을 실어
 * 보내지 않는다 — 들어와서 아무것도 하지 않고 나가는 사람에게는 값을
 * 치우게 하지 않는다.
 */

export type AnalyticsEvent =
  /**
   * 지금 이 화면의 링크를 만들었다.
   * surface: achievement | words | book(자서전 한 권) | chapter(그 안의 장)
   *          | novel(소설 시리즈) | episode(그 안의 한 편) | garden(내 정원)
   *          | trials(대통령 재판) | wiki(위키 한 쪽) | task(국정과제 하나)
   */
  | "share_create"
  /**
   * 주장 옆의 근거를 열었다. 이 사이트에서 가장 중요한 한 번이다.
   * 정원 쪽지에서 열면 source: garden이 붙는다 — 게임이 원래 지표를
   * 부풀리지 않았는지 따로 볼 수 있게 (docs/garden-game.md §3.11).
   */
  | "evidence_open"
  /** 연표를 직접 움직였다. 스크롤로 흘러간 것은 세지 않는다. */
  | "timeline_seek"
  /** 물었다. surface: guide(화면 안내) | wiki(위키에 묻기) */
  | "agent_question"
  /** 답이 화면을 움직였다. */
  | "agent_action"
  /**
   * 정원을 열었다(계정과 맞춘 뒤 한 번). ripe=열자마자 거둘 수 있던 밭 수.
   * 거두거나 뽑지 않고 둘러만 본 방문도 세야 재방문(D1·D7)과 "익을 때 맞춰 오는가"가
   * 보인다 (docs/garden-game.md §3.11).
   */
  | "garden_open"
  /** 공개 정원 링크로 들어왔다. mine=내 정원이었는지. */
  | "garden_visit"
  /** 친구 정원에 물을 줬다. */
  | "garden_water"
  /** 도감 지도에서 이어진 품종의 원본을 열었다. given=씨앗을 받았는지. */
  | "dex_trail"
  /** 정원 첫 한 바퀴 코치의 단계에 닿았다. step, skipped(건너뛰었으면 true). 어디서 멈추는지 본다. */
  | "garden_coach"
  /** 정원에서 열매를 거뒀다. tier, mutations(변이 수), rot(돌려짓기 가감 — docs/garden-farm-v2.md §4). */
  | "garden_harvest"
  /** 씨앗을 심었다. tier, rot(이 칸의 돌려짓기 가감: 0.1 · 0 · −0.3). */
  | "garden_plant"
  /** 첫 수확 선물(방 소품)을 받았다. placed(방에 놓였는지). 다음에 방 탭을 여는지 본다. */
  | "garden_first_gift"
  /** 잼 공방에서 분야 잼 병을 만들었다. region, mutations(병에 옮겨 간 변이 수), first(처음 만든 분야). */
  | "garden_jar"
  /** 마당 소품을 샀다(docs/garden-farm-v2.md §6 4b). item, price. */
  | "yard_buy"
  /** 마당 꾸밈 자리에 소품을 놓았다. item, slot. */
  | "yard_place"
  /** 광장 잡초를 뽑았다. stage. */
  | "plaza_pull"
  /** 시든 잎(출처 링크)이 열리는지 답했다. verdict: opens | fails | unsure. */
  | "leaf_check"
  /** 탐정 온실의 사건을 풀었다. first_try: 처음 고른 보기가 답이었는가. */
  | "case_solve"
  /**
   * 거대 잡초 — 여럿을 모으는지 본다(docs/garden-game.md §3.11 "처치까지 걸린 시간").
   * raid_spawn: 내가 물결을 세웠다. wave.
   * raid_join: 이 물결에 처음 한 방을 넣었다. wave, fighters(그때까지 모인 사람).
   * raid_end: 내가 든(쳤거나 지원한) 물결이 끝난 것을 봤다. 사람마다 물결당 한 번 — 물결 하나를
   *   보려면 raid로 하나만 고른다. raid(물결 id), wave, result(defeated|escaped), fighters,
   *   hits, hp, minutes(태어나서 끝날 때까지), mine(내 센 값), uses(쓴 기력),
   *   gapShare(쓴 기력 중 빈틈에 쓴 몫 0–1), aids(건 지원 수), stars(빠른 처치 ★, 도망이면 0).
   * raid_aid: 지원을 걸었다. kind(drum|umbrella|torch), wave.
   * 한 방마다 세지 않는다(raid_strike{gap}은 너무 잦다). 빈틈은 raid_end의 gapShare로 본다.
   */
  /** 초대 링크로 와서 초대를 받아들였다(새 정원일 때만). */
  | "invite_accept"
  /** 초대받은 사람이 첫 열매를 거둬 초대가 세어졌다. 초대한 사람도 상자를 받는다. */
  | "invite_join"
  | "raid_spawn"
  | "raid_join"
  | "raid_end"
  | "raid_aid"
  /**
   * 특별한 책(room/library.ts). book_open: 독서대를 열었다(book, mode owner|guest). book_read: 완독 도장(book, chapter).
   * book_lend: 손님이 빌려 읽기를 남겼다. book_ask: 책에게 물었다(grounded). book_seed: 오늘의 책 씨앗을 받았다.
   */
  | "book_open"
  | "book_read"
  | "book_lend"
  | "book_ask"
  | "book_seed"
  /**
   * 거대 잡초 등장 알림(docs/garden-raid-boss.md §8).
   * push_on: 이 기기에서 켰다. push_off: 껐다. push_denied: 권한 창에서 거절했다.
   * raid_push_open: 알림을 눌러 들어왔다. raid(물결 id).
   */
  | "push_on"
  | "push_off"
  | "push_denied"
  | "raid_push_open"
  /** 익음·단비·빈틈 알림을 캘린더에 넣으러 갔다. via: ics | google, hours(알림까지 남은 시간, 반올림), quiet(밤이라 8시로 미뤘다), kind(rain|gap, 없으면 익음). */
  | "ripe_alarm"
  /** 칭호 단계가 올랐다. title(dex|storm|plaza), level(1~3). */
  | "title_up"
  /**
   * 내 방 (docs/garden-miniroom.md §9).
   * frame_open: 방의 쪽지 액자를 열었다. kind(쪽지 종류). 액자 → 원본으로 가는지 본다.
   * room_show: 열매를 전시했거나 쪽지를 액자에 걸었다. kind(pot|tree|frame), tier, mutated.
   *   액자에 걸린 쪽지의 종류 비율(사실만 걸리는지)은 frame일 때의 tier 자리에 쪽지 종류를 싣는다.
   * room_edit: 꾸미기를 마쳤다. placed(놓인 수).
   * shop_buy: 상점에서 샀다. cat(seeds|tools|furniture|walls|trophy).
   */
  | "frame_open"
  /**
   * 업적 기념관·사진첩(docs/garden-achievement-strategy.md §3).
   * souvenir_view: 기념관에서 업적 하나를 열었다(slug). souvenir_quiz: 문제에 답했다(slug, answer). souvenir_get: 기념품을 받았다(slug).
   * souvenir_tap: 방에 놓인 기념품을 눌렀다(guest — 남의 방이면 true). album_add: 사진첩에 올렸다(slug). album_open: 사진첩을 열었다(mine).
   * photo_go: 사진 카드에서 업적 페이지로 갔다(slug, from album|memorial|room).
   */
  | "souvenir_view"
  | "souvenir_quiz"
  | "souvenir_get"
  | "souvenir_tap"
  /** 슬롯머신을 돌렸다(docs/garden-slots.md) — machine seed|room, outcome, 희귀면 rare·pity, 아이템이면 item·pity. */
  | "slot_spin"
  /** 슬롯 퀴즈 찬스(machine, correct), 잼 항아리를 받았다(jam), 손님이 뽑기 기계를 돌렸다, 희귀 씨앗을 거뒀다(kind, count). */
  | "slot_chance"
  | "slot_note"
  | "slot_pot"
  | "gacha_guest"
  | "rare_harvest"
  /** 방의 카르텔 카드(슬롯 전용)를 눌렀다(slug), 카드에서 카르텔 페이지로 갔다(slug). */
  | "cartel_card_open"
  | "cartel_card_link"
  | "album_add"
  | "album_open"
  /**
   * 사진첩 2(docs/garden-album-review.md). album_add(kind a|w|p|b|m, line), album_edit(line), album_scrap(kind) — 손님이 퍼 왔다,
   * album_comment(preset, owner), album_source(kind) — 사진의 근거·원문 링크를 열었다, album_clip(kind) — 사이트의 "사진첩에 담기".
   */
  | "album_edit"
  | "album_scrap"
  | "album_comment"
  | "album_source"
  | "album_clip"
  | "photo_go"
  /** 잡초 O/X 퀴즈에 답했다(slug, answer=맞혔는지). 뜬 수는 plaza_pull과 견준다. */
  | "weed_quiz"
  /** 업적 카툰을 열었다(slug, from memorial|room|album). cartoon_download: 공유 파일을 받았다(slug, kind gif|mp4). */
  | "cartoon_open"
  | "cartoon_download"
  | "room_show"
  | "room_edit"
  | "shop_buy"
  /**
   * 1촌 (docs/garden-miniroom.md §5.5). 누구인지·무슨 글인지는 보내지 않는다 — 수와 종류만.
   * ilchon_knock: 1촌 신청을 보냈다. ilchon_accept: 받은 신청을 수락했다. ilchon_cut: 1촌을 끊었다.
   * room_visit: 공개 방을 열었다. mine(내 방인지), ilchon(그 방 주인이 내 1촌인지).
   * guestbook_post: 방명록·1촌평을 남겼다. preset(정해 둔 문구였는지), where(guestbook|note).
   */
  | "ilchon_knock"
  | "ilchon_accept"
  | "ilchon_cut"
  | "room_visit"
  | "guestbook_post"
  /**
   * 내 키보드 (docs/garden-miniroom.md §4.5). 그림·소리의 내용은 보내지 않는다 — 종류만.
   * key_play: 키보드 시트를 열고 처음 누른 한 번. source(preset|rec), mine(내 방인지). 누를 때마다 보내지 않는다.
   * key_record: 녹음을 올렸다. mode(robot|high|low|original).
   * key_edit: 키를 저장했다. what(face|sound|both|reset).
   */
  | "key_play"
  | "key_record"
  | "key_edit"
  /**
   * 내 방의 꼬마(docs/garden-avatar.md §10.4). 고른 id·피부색·머리색은 보내지 않는다 — 사람을 가르는 셈이 된다.
   * avatar_edit: 저장했다. parts(바뀐 부위 이름을 쉼표로, 예: "hair,top").
   * avatar_tap: 꼬마를 눌렀다. mine(내 방인지).
   * avatar_place: 세우기·돌아다니기를 바꿨다. on, roam.
   */
  | "avatar_edit"
  | "avatar_tap"
  | "avatar_place"
  /**
   * 지지자 응원 — 응원 탭이 사람을 남기게 하는지 본다.
   * cheer_open: 응원 탭을 처음 열었다. from: tab(탭을 눌렀다) | home | garden | neighbors | my | link.
   * cheer_post: 한 줄을 남겼다. starter: none(직접 씀) | edited(첫 문장을 고쳐 씀) | verbatim(첫 문장 그대로),
   *   topic(언행에 붙였는지), from(위와 같음).
   * cheer_agree: 나도요를 눌렀다. on(켰으면 true).
   * cheer_echo: 지난번 이후 내 응원에 붙은 나도요를 봤다. gain.
   * cheer_video_post: 영상을 걸었다. topic.
   * cheer_seed: 응원을 남긴 뒤 그 언행의 씨앗을 받으러 갔다.
   * 글 내용은 보내지 않는다. 어느 언행에 붙였는지도 보내지 않는다 — 있다/없다만.
   */
  | "cheer_open"
  | "cheer_post"
  | "cheer_agree"
  | "cheer_echo"
  | "cheer_video_post"
  | "cheer_seed";

type Params = Record<string, string | number | boolean>;

type Logger = (name: string, params?: Params) => void;

let logger: Promise<Logger | null> | null = null;

function load(): Promise<Logger | null> {
  if (typeof window === "undefined" || !analyticsConfigured) return Promise.resolve(null);

  logger ??= import("firebase/analytics")
    .then(async (mod) => {
      /* 지원하지 않는 환경이 있다. 사파리 비공개 창, 쿠키를 막은 브라우저. */
      if (!(await mod.isSupported())) return null;
      const instance = firebaseApp();
      if (!instance) return null;
      const analytics = mod.getAnalytics(instance);
      return (name: string, params?: Params) => mod.logEvent(analytics, name, params);
    })
    .catch(() => null);

  return logger;
}

/**
 * 한 번 센다.
 *
 * 실패해도 조용하다. 계측이 화면을 멈추게 하면 안 된다 — 이 사이트의
 * 부속이지 본체가 아니다.
 */
export function track(event: AnalyticsEvent, params?: Params): void {
  void load().then((log) => log?.(event, params));
}
