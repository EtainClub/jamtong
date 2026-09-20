import { validateCheers, type CheerVideo } from "./schema";

/**
 * 지지자 응원 레지스트리.
 *
 * 날짜로 세우지 않는다. 영상이 언제 올라왔는지는 유튜브가 알고 우리는 모른다 —
 * 모르는 것을 적어 두면 그 순서가 사실인 양 읽힌다. 여기 적힌 차례가 곧 순서고,
 * 새로 담은 것을 맨 위에 넣는다.
 */
export const CHEERS: CheerVideo[] = [
  {
    id: "pissue-gwihan",
    youtubeId: "_ZHMWt3iv8I",
    title:
      '"진짜 귀한 줄 알아야 할 너희의 대상은 이재명이다" 유시민 김어준이 아니라..#이재명 #대국민기자회견 #청와대 #유시민 #김어준 #문조텔래유',
    channel: "정치이슈다",
    channelUrl: "https://www.youtube.com/@%EC%A0%95%EC%B9%98%EC%9D%B4%EC%8A%88%EB%8B%A4-Pissue",
  },
];

/** 겹친 영상이 하나라도 있으면 빌드를 세운다. 목록 페이지만 열어도 걸린다. */
const errors = validateCheers(CHEERS);
if (errors.length > 0) {
  throw new Error(`응원 자료 검증 실패:\n${errors.join("\n")}`);
}
