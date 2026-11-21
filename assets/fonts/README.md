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

## 일본어 (옮긴 자서전 장의 카드)

| 파일 | 쓰는 곳 |
| --- | --- |
| `NotoSansJP-Light.otf` | 일본어 카드 제목(300) |
| `NotoSansJP-Medium.otf` | 일본어 카드 키커·라벨. 600을 청하면 이 파일(실제 무게 500)이 쓰인다 |

Pretendard에는 가나가 없고 한자가 한국식 자형이라 일본어 카드에는 따로 둔다.
원본은 4.5MB씩이라 JIS X 0208 전체(제1·2수준 한자 6,355자와 기호), 가나, 전각 기호, ASCII만 남겼다(약 1.6MB씩).
이 밖의 한자를 쓰면 그 글자는 Pretendard로 넘어가거나 빈칸이 된다.

```
pyftsubset NotoSansJP-Light.otf --unicodes-file=unicodes.txt \
  --layout-features='kern,palt,vert' --no-hinting --name-IDs='*'
```

`unicodes.txt`는 U+0020–007E, U+00A0–00FF, U+2010–206F, U+2190–21FF, U+2460–24FF, U+25A0–25FF,
U+3000–30FF, U+FF00–FFEF와 EUC-JP로 읽히는 두 바이트 글자 전부다.

출처: https://github.com/notofonts/noto-cjk `Sans/SubsetOTF/JP` (SIL OFL 1.1)
