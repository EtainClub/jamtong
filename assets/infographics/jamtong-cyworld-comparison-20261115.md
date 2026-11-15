# 싸이월드와 잼통 정원 — 비교 인포그래픽

제작일: 2026-11-15. 싸이월드는 2000년대 미니홈피를, 잼통은 이 날짜의 구현을 기준으로 비교한다. 두 방 그림은 기능을 설명하는 창작 삽화이며 실제 화면 캡처가 아니다. 싸이월드와의 공식 제휴를 뜻하지 않는다.

## 비교 문안

| 비교 | 싸이월드 | 잼통 정원 |
|---|---|---|
| 재화 | 도토리: 현금으로 충전해 사용 | 잼: 수확물 판매·활동으로 획득. 현금 충전 없음 |
| 방 꾸미기 | 미니룸·미니미·스킨 | 가구·벽지·바닥·수확 화분 |
| 배경음악 | 도토리로 BGM 구매 | 무료 기본곡 + 잼으로 음원 구매 |
| 친구와 방문 | 일촌·파도타기 | 1촌·파도타기 + 물 주기 |
| 기록과 소통 | 사진첩·다이어리·일촌평·방명록 | 도감·전시품·1촌평·방명록 |

함께 닮은 점: 내 공간 꾸미기, 음악으로 취향 표현, 친구 방 놀러 가기.

잼통에서 더하는 놀이: 키 그림·소리를 꾸미는 키보드, 주인이 15초 동안 연주해 남기고 방문자가 듣는 피아노, 클릭하면 움직이거나 소리가 나는 LED 응원봉·바비·오르골.

## 싸이월드 자료

- [중앙일보, 「[새로운 도전 나선 싸이월드] 동영상 SNS로 재기 노린다」, 2016-08-21](https://www.joongang.co.kr/article/20480836): 미니미·미니룸, 일촌·파도타기, 도토리 구매와 방·BGM 꾸미기, 일촌평·방명록의 과거 기능. 본문은 요약했으며 기사 사진은 사용하지 않았다.
- [오마이뉴스, 「미니홈피? “음악 들으러 가요”」, 2006-11-23](https://www.ohmynews.com/NWS_Web/View/at_pg.aspx?CNTN_CD=A0000375253&SRS_CD=0000010531): 도토리 충전, BGM 구매·감상, 음악을 들으러 파도타기 하는 이용 사례. 역사적 가격을 현재 가격으로 제시하지 않았다.
- [이데일리, 「‘새출발’ 싸이월드, 내가 산 도토리는 어떻게 되나?」, 2015-10-03](https://www.edaily.co.kr/News/Read?mediaCodeNo=257&newsId=01469446609529312): 과거 미니룸·음원 구매와 서비스 개편. 서비스 버전 차이가 있어 현재 싸이월드의 기능·운영 상태를 단정하지 않는다.

## 잼통 구현 근거

문서의 초기 설계와 실제 코드가 다른 경우 현재 코드를 우선했다.

- `src/features/garden/store.ts`: `sell`의 수확물 판매 보상, 정원 활동 보상, `buyFurniture`, `buyMusic`, `setBgm`. 현금 결제·잼 충전 기능은 없다.
- `src/features/garden/shop/Shop.tsx`, `shop/MusicShop.tsx`, `musicTracks.ts`: 잼으로 가구·음원을 구매하고 기본 음악은 무료로 제공한다.
- `src/features/garden/room/RoomEditor.tsx`, `room/RoomSvg.tsx`, `room/catalog.ts`: 가구·벽·바닥과 수확한 품종의 화분 전시.
- `src/features/garden/ilchon/IlchonTab.tsx`, `ilchon/RoomLines.tsx`, `ilchon/parts.tsx`: 1촌, 파도타기, 물 주기, 1촌평·방명록. 자유 글도 구현되어 있어 ‘정해진 문구만 가능’으로 표현하지 않았다.
- `src/features/garden/room/KeyboardSheet.tsx`, `room/keyboard.ts`: 키 그림과 소리를 직접 정하는 키보드.
- `src/features/garden/room/PianoPlayer.tsx`, `room/piano.ts`: 15초 작곡·저장과 방문자 재생.
- `src/features/garden/room/activities.ts`, `room/lightsticks.ts`, `room/activitySound.ts`: LED 응원봉·바비·오르골의 움직임과 소리.

## 시각 구성

한 장의 세로형 PNG. 아이보리 노트 배경에 싸이월드는 주황·갈색, 잼통은 하늘색·초록을 사용한다. 도토리와 잼의 획득 방식 차이를 크게 보여 주고, 다섯 개 비교 행, 공통점 띠, 잼통 추가 놀이 세 칸으로 구성한다. 이미지 생성 도구로 제작한 창작 삽화이며 서비스 로고·기사 사진을 복제하지 않았다.
