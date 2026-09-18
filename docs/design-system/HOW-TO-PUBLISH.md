# 이 폴더를 디자인 시스템 아티팩트에 올리는 법

빈 시스템 아티팩트가 이미 만들어져 있습니다:
https://claude.ai/artifact/CbR5ZUuc28S7UrcfAF32Vk

이 폴더(`docs/design-system/`)의 내용이 그 아티팩트의 `project/` 아래로 들어갑니다.
비어 있는 시스템의 페이지는 하나의 드롭 대상이라, **폴더를 열어 페이지 위에
끌어다 놓으면** 알아서 자리를 잡습니다.

폴더 구조는 그대로 유지하세요:

```
design-system.json          ← 인덱스
README.md                   ← 브랜드북
tokens.json                 ← 토큰
components/Cover/preview.html
components/<이름>/README.md
components/<이름>/preview.html
```

## 왜 저장소에도 두는가

콘텐츠와 같은 이유입니다. 토큰이 `src/app/globals.css`에서 왔으므로, 코드가
바뀌면 이 파일도 함께 바뀌어야 하고 그 변경은 PR로 남아야 합니다.
아티팩트는 읽기 좋은 표면이고, 진실은 저장소에 있습니다.
