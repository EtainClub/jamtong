import { HOUR, josa, MINUTE, raidKind } from "../rules";
import { formName } from "./forms";
import { RAID_JAM } from "./rules";

/**
 * 거대 잡초 등장 알림의 규칙 — 화면과 서버 라우트가 함께 쓴다. 순수 함수만 둔다(push.test.ts).
 * 설계는 docs/garden-raid-boss.md §8.
 *
 * ★ 알림을 켠 기기는 FCM 주제 하나(PUSH_TOPIC)에 든다. 누가 켰는지의 장부는 두지 않는다.
 * ★ 글은 정해 둔 것뿐이다. 종류 이름은 물결 id에서 셈하고, 사람 이름은 싣지 않는다.
 */

export const PUSH_TOPIC = "raid";

/** 물결 id. lib/og/raid-state.ts의 RAID_ID와 같다. */
export const PUSH_RAID_ID = /^[0-9]{5}-[1-5]$/;

/** 태어난 지 이 안의 물결만 알린다. 늦게 온 요청으로 지난 물결을 알리지 않는다. */
export const PUSH_FRESH = 10 * MINUTE;

/** 알림을 보내는 시간(한국 시각). 밤에 선 물결은 알리지 않는다 — 캘린더 알림과 같은 선. */
export const PUSH_HOURS = { from: 8, to: 22 } as const;

/** 알림이 이만큼 지나도록 닿지 못했으면 버린다(초). 한참 뒤에 울리는 "나타났어요"는 거짓말이다. */
export const PUSH_TTL_SECONDS = 30 * 60;

/** 켜 둔 기기가 토큰을 다시 맞추는 간격. */
export const PUSH_REFRESH = 24 * HOUR;

export function pushHourOk(t: number): boolean {
  const hour = new Date(t + 9 * HOUR).getUTCHours();
  return hour >= PUSH_HOURS.from && hour < PUSH_HOURS.to;
}

/** 이 물결을 지금 알려도 되는가 — 갓 태어났고, 안 쓰러졌고, 낮이다. */
export function pushDue(spawnedAt: number | null, defeatedAt: number | null, now: number): boolean {
  return spawnedAt !== null && defeatedAt === null && now >= spawnedAt && now - spawnedAt <= PUSH_FRESH && pushHourOk(now);
}

export interface PushCopy {
  title: string;
  body: string;
  /** 누르면 여는 곳(사이트 안 경로). */
  url: string;
  /** 같은 물결의 알림이 겹치지 않게 하는 꼬리표. */
  tag: string;
}

/** 형태(1–3)마다의 알림. 2·3형은 변신 알림이다 — 잡으면 받는 잼을 함께 적는다. */
export function pushCopy(id: string, form: 1 | 2 | 3 = 1): PushCopy {
  const [day, wave] = id.split("-").map(Number);
  const kind = raidKind(day, wave);
  if (form === 1) {
    return {
      title: `잼통 광장 · ${josa(kind.name, "이가")} 나타났어요`,
      body: `혼자서는 못 잡아요. 같이 잡으면 최대 ${(RAID_JAM.base + RAID_JAM.forms.reduce((a, b) => a + b, 0)).toLocaleString()}잼!`,
      url: `/garden?tab=plaza&push=${id}`,
      tag: `raid-${id}`,
    };
  }
  return {
    title: `잼통 광장 · ${josa(formName(kind.id, form), "으로")} 변신했어요`,
    body: `${form}형을 잡으면 +${RAID_JAM.forms[form - 1].toLocaleString()}잼. 지금 들어오면 기력이 가득 차 있어요.`,
    url: `/garden?tab=plaza&push=${id}`,
    tag: `raid-${id}-${form}`,
  };
}
