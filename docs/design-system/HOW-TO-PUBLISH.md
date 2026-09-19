# 이 폴더와 디자인 시스템 아티팩트

아티팩트: https://claude.ai/artifact/CbR5ZUuc28S7UrcfAF32Vk

이 폴더(`docs/design-system/`)의 파일이 그 아티팩트의 `project/` 아래에 그대로
올라가 있습니다. 경로가 1:1로 맞습니다.

```
README.md                      → project/README.md
tokens.json                    → project/tokens.json
design-system.json             → project/design-system.json
components/<이름>/README.md     → project/components/<이름>/README.md
components/<이름>/preview.html  → project/components/<이름>/preview.html
```

## 올리는 법

**드래그 앤 드롭으로 올리지 마세요.** 시스템 페이지에 폴더를 끌어다 놓으면
파일이 *에셋*으로 등록되어 `assets/tokens.json` 같은 엉뚱한 자리에 들어갑니다.
디자인 시스템은 에셋이 아니라 `project/` 아래의 파일로 읽힙니다.

Claude Code에서 올립니다. 이 폴더를 지정해 Artifact 도구의 publish를 부르고,
`files`로 각 경로를 `project/…`에 매핑하면 됩니다. "디자인 시스템을 아티팩트에
동기화해줘"라고 말하면 됩니다.

## 방향은 코드 → 아티팩트

토큰의 출처는 `src/app/globals.css`입니다. 순서는 이렇습니다.

1. `globals.css`의 토큰을 고친다
2. `docs/design-system/tokens.json`을 맞춘다
3. 아티팩트에 동기화한다

아티팩트에서 먼저 고치면 저장소와 어긋나고, 다음 동기화 때 덮어써집니다.
아티팩트는 읽기 좋은 표면이고 진실은 저장소에 있습니다.
