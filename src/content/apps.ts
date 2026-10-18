import { z } from "zod";

/**
 * 잼통 자매 앱.
 *
 * 관련 사이트(`links.ts`)와 따로 둔다. 그쪽은 남이 운영하는 곳을 성격별로
 * 안내하고, 이쪽은 같은 곳에서 만드는 앱을 소개한다. 한 목록에 섞으면
 * "잼통이 운영하지 않는 사이트"라는 그쪽 머리말이 거짓이 된다.
 *
 * 히어로 이미지는 각 앱이 공유 카드로 쓰는 OG 이미지를 내려받아 둔 것이다.
 * 원격 주소를 그대로 걸면 그 앱이 이미지를 바꾸거나 내릴 때 이 화면이 깨진다.
 */
export const sisterAppSchema = z.object({
  id: z.string(),
  name: z.string(),
  /** 이름 옆에 붙는 한 줄. */
  tagline: z.string(),
  description: z.string(),
  url: z.string().url(),
  image: z.string().startsWith("/images/apps/"),
});
export type SisterApp = z.infer<typeof sisterAppSchema>;

const raw: z.input<typeof sisterAppSchema>[] = [
  {
    id: "im",
    name: "임통",
    tagline: "인물 아카이브",
    description:
      "이재명 대통령과 관련된 인물들이 해 온 말과, 그 인물에 대한 다른 사람들의 평가를 원자료와 함께 모아 두는 인물통입니다.",
    url: "https://im.jamtong.kr",
    image: "/images/apps/im.png",
  },
  {
    id: "tt",
    name: "통통",
    tagline: "청소년·청년 정책 활용",
    description:
      "청소년과 청년이 장기적인 목표를 이루도록, 지금 시기에 쓸 수 있는 정부 정책을 찾아 제때 활용하게 돕습니다.",
    url: "https://tt.jamtong.kr",
    image: "/images/apps/tt.png",
  },
  {
    id: "news",
    name: "속통",
    tagline: "이재명 정부 보도의 겉과 속",
    description:
      "이재명 정부를 다루는 언론과 정치 유튜브 채널을 지켜봅니다. 같은 사건에 누가 어떤 제목을 달았는지, 옹호하는 듯한 제목 속에 어떤 인식을 심는지, 어디가 다루지 않았는지 원문 그대로 기록합니다.",
    url: "https://news.jamtong.kr",
    image: "/images/apps/news.png",
  },
  {
    id: "bot",
    name: "잼통 신고 센터",
    tagline: "팩트 체크 댓글",
    description:
      "인스타그램에 도는 정부 정책 관련 가짜 뉴스를 신고하면, 근거를 확인한 팩트 체크 결과를 그 게시물에 댓글로 답니다.",
    url: "https://bot.jamtong.kr",
    image: "/images/apps/bot.png",
  },
  {
    id: "voice",
    name: "잼통 Voice",
    tagline: "시민 목소리 해설",
    description:
      "대통령 X 게시물에 달린 시민의 질문과 비판을 주제별로 묶고, 잼통의 근거로 설명합니다. 근거가 없는 주제는 잼통에 자료 보충을 요청합니다.",
    url: "https://voice.jamtong.kr",
    image: "/images/apps/voice.png",
  },
];

export const SISTER_APPS: SisterApp[] = raw.map((item) => sisterAppSchema.parse(item));
