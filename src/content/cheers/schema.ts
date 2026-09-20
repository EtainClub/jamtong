import { z } from "zod";

/**
 * 지지자 응원 영상 — 지지자들이 직접 만들어 올린 것.
 *
 * ★ 업적·언행과 같은 통에 담지 않는다.
 *   업적은 남이 확인해 준 사실이고, 언행은 본인이 한 말 그 자체다. 여기 있는
 *   것은 그 둘 어디에도 속하지 않는 **제삼자가 만든 것**이다. 자료형을 따로
 *   두는 이유가 그것이다. 한 통에 담으면 언젠가 영상 속 주장이 근거 붙은
 *   사실과 같은 무게로 읽힌다.
 *
 * ★ 담아 두지 않고 걸어 둔다.
 *   영상은 유튜브에 있고 우리는 id와 만든 사람만 적는다. 원본이 내려가면
 *   여기서도 안 보이는 것이 맞다 — 만든 사람이 지운 것을 우리가 붙들고 있을
 *   이유가 없다.
 *
 * ★ 평을 달지 않는다.
 *   무슨 영상인지 우리가 요약하지 않는다. 제목과 채널만 적는다. 응원은
 *   응원한 사람의 말이지 우리 말이 아니고, 우리가 한 줄 붙이는 순간 우리가
 *   그 내용을 보증한 것처럼 읽힌다.
 */
export const cheerVideoSchema = z.object({
  id: z.string(),
  /**
   * 유튜브 영상 id. URL이 아니라 id만 적는다 —
   * youtube.com/shorts/<id>, youtu.be/<id>, watch?v=<id> 가 모두 같은 영상이다.
   */
  youtubeId: z.string().regex(/^[\w-]{11}$/, "유튜브 영상 id는 11자다"),
  /** 올린 사람이 붙인 제목. 손대지 않고 그대로 적는다. */
  title: z.string().min(1),
  /** 만든 사람. 채널 이름 그대로. */
  channel: z.string().min(1),
  channelUrl: z.string().url().optional(),
});
export type CheerVideo = z.infer<typeof cheerVideoSchema>;

/**
 * 같은 영상이 두 번 걸리지 않았는지.
 *
 * 응원은 계속 늘어나고, 늘어날수록 손으로 훑어서는 겹친 것을 못 찾는다.
 * 같은 영상이 두 칸을 차지하면 목록이 부풀려진 것처럼 보인다.
 */
export function validateCheers(videos: CheerVideo[]): string[] {
  const errors: string[] = [];
  const seenId = new Set<string>();
  const seenVideo = new Set<string>();

  for (const video of videos) {
    const parsed = cheerVideoSchema.safeParse(video);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        errors.push(`${video.id} → ${issue.path.join(".")}: ${issue.message}`);
      }
    }
    if (seenId.has(video.id)) errors.push(`id가 겹친다: ${video.id}`);
    if (seenVideo.has(video.youtubeId)) {
      errors.push(`같은 영상이 두 번 걸렸다: ${video.youtubeId}`);
    }
    seenId.add(video.id);
    seenVideo.add(video.youtubeId);
  }

  return errors;
}
