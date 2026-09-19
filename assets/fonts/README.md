# OG 이미지용 서체

공유 카드(`opengraph-image`)를 그리는 satori는 브라우저가 아니라서 CDN 웹폰트를
쓸 수 없다. 글리프가 담긴 파일을 직접 넘겨야 하고, WOFF2는 지원하지 않는다.
그래서 정적 OTF를 저장소에 둔다.

한글이 필요하다. 서체를 넘기지 않으면 제목이 전부 두부(□□□)로 나온다.

| 파일 | 쓰는 곳 |
| --- | --- |
| `Pretendard-Light.otf` | 카드 제목. 디자인 시스템의 디스플레이 무게(300) |
| `Pretendard-SemiBold.otf` | 키커·라벨 |

빌드 때만 읽는다. 브라우저로 나가지 않는다 — 웹에서 쓰는 Pretendard는
`globals.css`가 CDN 서브셋으로 따로 받는다.

출처: https://github.com/orioncactus/pretendard (v1.3.9, SIL OFL 1.1)
