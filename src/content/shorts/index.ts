import { shortSchema, type Short, type ShortInput } from "@/content/schema";

/**
 * 직접 제작한 세로 영상 쇼츠.
 *
 * 영상 파일은 public/shorts/ 아래에 두고 여기에 등록한다.
 * claimIds는 스토리나 성과 카드의 claim id를 가리킨다 — 쇼츠에서 말한 내용의
 * 근거가 어디 있는지 재생 중에도 확인할 수 있어야 한다.
 *
 * 예시:
 *   {
 *     id: "short-arctic-01",
 *     title: "부산에서 유럽까지, 7,400km를 줄인다",
 *     videoUrl: "/shorts/arctic-route.mp4",
 *     posterUrl: "/shorts/arctic-route.jpg",
 *     durationSec: 32,
 *     categories: ["economy"],
 *     claimIds: ["claim-reduction"],
 *     storySlug: "arctic-route",
 *     publishedAt: "2026-09-18",
 *   }
 */
const raw: ShortInput[] = [];

export const SHORTS: Short[] = raw.map((item) => shortSchema.parse(item));
