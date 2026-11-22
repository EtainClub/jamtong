# 업적 카툰 그림

업적의 쉬운 설명 장면 하나가 카툰 한 칸이다(`<업적slug>/<장면id>.webp`). 화면은 `memorial/build.ts`가 이 폴더를 보고 칸을 잇는다 —
업적의 모든 장면에 그림이 있어야 그 업적의 카툰이 열린다.

- **실제 장면이 아니다.** Codex CLI의 내장 이미지 생성(GPT)으로 만든 설명용 AI 삽화다. 화면이 그렇게 밝힌다.
- 캐릭터 **잼통이**는 잼통 고유의 캐릭터다. 시트 원본은 `assets/cartoons/jamtongi-sheet.png`, 화면용은 `jamtongi.webp`.
- 그림에는 글자를 넣지 않는다. 해설·말풍선·숫자는 화면이 콘텐츠(claim)에서 얹는다.
- 실존 인물·정치인을 그리지 않는다.
- 칸마다 만든 도구·날짜·프롬프트는 `<업적slug>/prompts.json`.
- 새 칸: `pnpm cartoon:gen [slug]`. 검수용 한 장 모음: `scripts/cartoon-sheet.sh <slug> <out.jpg>`. 공유용 GIF·MP4: `pnpm cartoon:render [slug]`(→ `.cartoon-work/media`) 다음 `pnpm cartoon:upload [slug]`(→ Firebase Storage `cartoons/<slug>/`, 주소는 `src/content/cartoons/media.json`). GIF·MP4는 저장소에 넣지 않는다.
