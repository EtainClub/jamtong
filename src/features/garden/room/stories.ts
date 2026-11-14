import type { Furniture } from "./catalog";

/** 개인 취향·사용·선물 기록과, 그 기록에서 상상한 장식을 구별한다. */
export type FurnitureStoryKind = "affection" | "hobby" | "profile" | "experience" | "gift" | "inspired";
export const STORY_LABEL: Record<FurnitureStoryKind, string> = {
  affection: "직접 애정 표현", hobby: "공개된 취미", profile: "옛 블로그 프로필의 취향", experience: "사용·경험", gift: "선물 수령", inspired: "창작 소품",
};
export interface FurnitureStory {
  kind: FurnitureStoryKind;
  text: string;
  source: keyof typeof STORY_SOURCES;
  /** 보도에서 확인한 짧은 게시 글귀. 작성자가 직접 창작했다고 단정하지 않는다. */
  excerpt?: string;
}

/** 2026-11-14 원문 대조. 사진·상품 이미지를 가져오지 않고 링크와 자체 그림만 쓴다. */
export const STORY_SOURCES = {
  babi: { title: "머니투데이 · SNS에서 반려견 바비 소개", date: "2025-07-14", url: "https://v.daum.net/v/20250714175405730" },
  hobbies: { title: "동아일보 · 공개 취미와 한일 정상 선물 교환", date: "2026-01-14", url: "https://www.donga.com/news/Politics/article/all/20260114/133155806/1" },
  dinner: { title: "청와대 · 대통령쀼 문화가 있는 날 (영상·자막)", date: "2026-03", url: "https://www.president.go.kr/videos/gQGYrSI9" },
  gifts: { title: "MBC · 중국 문방사우와 미국 야구 선물", date: "2025-11-03", url: "https://imnews.imbc.com/replay/2025/nwtoday/article/6771543_36807.html" },
  blog: { title: "이데일리 · 무지개송어 프로필과 옛 블로그 글", date: "2022-03-03", url: "https://v.daum.net/v/20220303155631374" },
} as const;

export const STORY_COLLECTIONS = [
  { id: "babi", label: "바비의 작은 공간" }, { id: "hobby", label: "주말 취미와 서재" },
  { id: "dining", label: "따뜻한 한 상" }, { id: "gift", label: "이야기가 있는 선물" },
  { id: "blog", label: "2006 무지개송어" },
] as const;
export type StoryCollection = (typeof STORY_COLLECTIONS)[number]["id"];

function item(id: string, label: string, kind: "floor" | "wall", size: 1 | 2, price: number, collection: StoryCollection,
  hint: string, story: FurnitureStory): Furniture {
  return { id, label, kind, size, price, art: id, collection, hint, story, newUntil: "2026-12-14" };
}
const hobby = (text: string): FurnitureStory => ({ kind: "hobby", source: "hobbies", text });
const inspired = (source: FurnitureStory["source"], text: string): FurnitureStory => ({ kind: "inspired", source, text });
const gift = (text: string): FurnitureStory => ({ kind: "gift", source: "gifts", text });

/** 전부 상시 잼 판매. 받침·선반도 그림에 포함해 기존 벽/바닥 칸에 바로 놓는다. */
export const STORY_FURNITURE: Furniture[] = [
  item("babi-mini", "바비 미니어처", "floor", 1, 280, "babi", "복슬복슬한 말티푸 바비를 작은 장식으로 만나요.",
    { kind: "affection", source: "babi", text: "2025년 7월 SNS에서 가족인 반려견 바비를 소개하고, 함께하며 느끼는 행복과 위로를 전했어요. 그 바비에서 착안한 미니어처예요." }),
  item("babi-bed", "바비 전용 방석", "floor", 1, 90, "babi", "발바닥 무늬를 수놓은 폭신한 강아지 방석.",
    inspired("babi", "반려견 바비의 이야기를 바탕으로 상상한 방석이에요. 실제 바비가 쓰는 방석을 재현한 것은 아니에요.")),
  item("babi-paw", "바비 발자국 액자", "wall", 1, 100, "babi", "작은 발바닥 무늬를 담은 벽 액자.",
    inspired("babi", "바비를 떠올리며 그린 창작 발바닥 액자예요. 실제 발도장이나 소장품은 아니에요.")),
  item("babi-leash", "바비 산책 목줄", "wall", 1, 80, "babi", "작은 벽걸이에 걸어 둔 산책 목줄.",
    inspired("babi", "바비와의 산책을 상상한 장식 목줄이에요. SNS에는 김혜경 여사가 바비의 산책을 챙긴다는 이야기가 있어요. 목줄의 모양은 창작이에요.")),
  item("go-board", "원목 바둑판", "floor", 2, 420, "hobby", "낮은 원목 테이블에 놓인 흑백 바둑돌.",
    hobby("2025년 대선 당시 공개된 취미에 바둑이 포함되어 있어요. 바둑을 즐기는 시간을 작은 원목 바둑판으로 표현했어요.")),
  item("go-stones", "바둑알 세트", "wall", 1, 150, "hobby", "흑돌·백돌 통을 나란히 올린 벽 선반.",
    hobby("공개된 바둑 취미에서 착안한 흑백 바둑알 통이에요. 실제 사용하는 바둑알이나 통의 모양을 재현한 것은 아니에요.")),
  item("hiking-pack", "등산 배낭", "floor", 1, 240, "hobby", "산길을 떠올리는 초록 배낭과 돌돌 만 매트.",
    hobby("공개된 취미에 등산과 걷기가 포함되어 있어요. 산행을 떠올리며 만든 배낭으로, 실제 사용 제품을 특정한 것은 아니에요.")),
  item("hiking-boots", "등산화", "floor", 1, 180, "hobby", "신발 끈을 단단히 묶은 한 켤레.",
    hobby("등산과 걷기 취미에서 착안한 등산화예요. 실제 신는 브랜드나 제품을 재현한 것은 아니에요.")),
  item("hiking-watch", "카시오 등산 시계", "wall", 1, 320, "gift", "작은 진열 선반 위의 아웃도어 손목시계.",
    { kind: "gift", source: "hobbies", text: "2026년 1월 한일 정상 간 선물 교환에서 다카이치 총리는 등산 취미를 고려해 카시오 손목시계를 선물했어요. 그림은 특정 모델의 복제가 아니에요." }),
  item("reading-books", "책 더미", "floor", 1, 110, "hobby", "작은 독서 탁자 위에 쌓인 책과 책갈피.",
    hobby("공개된 취미에 독서가 포함되어 있어요. 책 제목이나 가장 좋아하는 책을 특정하지 않은 장식이에요.")),
  item("reading-shelf", "원목 책장", "wall", 2, 480, "hobby", "책등 색이 알록달록한 벽걸이 원목 책장.",
    inspired("hobbies", "독서 취미에서 상상한 작은 서재의 책장이에요. 실제 집의 책장이나 소장 도서를 재현한 것은 아니에요.")),
  item("reading-light", "독서 스탠드", "floor", 1, 170, "hobby", "책을 환하게 비추는 초록 갓과 작은 책상.",
    inspired("hobbies", "독서 취미에서 상상한 조명 소품이에요. 실제 사용하는 스탠드 제품이라는 뜻은 아니에요.")),
  item("fishing-rod", "낚싯대", "wall", 1, 200, "hobby", "찌와 릴이 달린 벽걸이 낚싯대.",
    hobby("공개된 취미에 낚시가 포함되어 있어요. 바다낚시·민물낚시 중 무엇을 더 좋아하는지나 실제 장비는 특정하지 않았어요.")),
  item("fishing-bag", "낚시 가방", "floor", 1, 190, "hobby", "찌 상자와 함께 세워 둔 긴 낚시 가방.",
    inspired("hobbies", "낚시 취미에서 확장한 창작 가방이에요. 실제 소유한 장비의 모양을 재현한 것은 아니에요.")),
  item("gukbap-table", "소고기 국밥 상", "floor", 2, 260, "dining", "김이 모락모락 나는 국밥과 수저가 놓인 작은 상.",
    { kind: "experience", source: "dinner", text: "청와대의 ‘대통령쀼 문화가 있는 날’ 영상에는 공연을 보러 가기 전 소고기 국밥을 주문하는 장면이 있어요. 그 식사 장면에서 착안했어요." }),
  item("puer-tea", "보이차 다기", "floor", 2, 300, "dining", "나무 찻상 위의 주전자와 작은 찻잔.",
    { kind: "experience", source: "gifts", text: "2025년 중국 측이 김혜경 여사에게 준비한 찻잔 세트를 살펴보며, 이 대통령은 보이차를 우리는 데도 좋겠다는 반응을 보였어요. 즐겨 마시는 차라고 단정하지 않아요." }),
  item("jade-inkstone", "옥빛 벼루", "floor", 1, 280, "gift", "작은 서안에 올려 둔 옥빛 벼루와 먹.",
    gift("2025년 중국 측의 문방사우 선물에는 벼루와 붓이 포함되어 있었어요. 그 선물에서 착안한 옥빛 장식으로, 실제 벼루의 재질과 형태를 그대로 재현한 것은 아니에요.")),
  item("calligraphy-brush", "서예 붓", "wall", 1, 160, "gift", "두루마리 옆에 매단 긴 서예 붓.",
    gift("2025년 중국 측이 이 대통령에게 문방사우를 선물했어요. 붓도 포함된 선물 기록을 바탕으로 만든 장식이며 서예 취미를 뜻하지는 않아요.")),
  item("baseball-ball", "대통령 인장 야구공", "wall", 1, 250, "gift", "유리 진열함 속 붉은 실밥의 기념 야구공.",
    gift("2025년 10월 트럼프 대통령이 선물한 야구공에는 대통령 인장이 담겼어요. 선수 친필 사인은 함께 선물한 배트에 있어요.")),
  item("baseball-bat", "사인 야구 배트", "wall", 2, 340, "gift", "기념 사인을 표현한 벽걸이 야구 배트.",
    gift("2025년 10월 미국 측의 선물에는 워싱턴 내셔널스 선수의 친필 사인이 담긴 배트가 있었어요. 외교 선물 기록이며 이 대통령의 야구 취미를 뜻하지는 않아요.")),
  item("trout-aquarium", "무지개송어 어항", "floor", 2, 380, "blog", "무지갯빛 송어가 있는 작은 어항과 나무 받침.",
    inspired("blog", "2022년 보도에 인용된 옛 네이버 블로그의 닉네임은 ‘무지개송어’예요. 그 이름을 어항으로 상상했어요. 실제로 송어를 길렀다는 뜻은 아니에요.")),
  item("tennis-racket", "테니스 라켓", "wall", 1, 190, "blog", "노란 테니스공과 함께 걸어 둔 라켓.",
    { kind: "profile", source: "blog", text: "2022년 보도에 인용된 옛 네이버 블로그 프로필에는 좋아하는 것으로 테니스를 적었어요. 당시 기록에서 착안한 그림이며 실제 사용 장비를 재현한 것은 아니에요." }),
  item("blog-baseball", "취미 야구공", "wall", 1, 130, "blog", "사인이나 인장이 없는, 작은 선반 위의 야구공.",
    { kind: "profile", source: "blog", text: "옛 블로그 프로필에 좋아하는 것으로 야구를 적었다는 보도가 있어요. 그 취향을 표현한 소품이에요. 2025년에 선물받은 대통령 인장 야구공과는 별개의 창작 그림이에요." }),
  item("soccer-ball", "축구공", "floor", 1, 140, "blog", "초록 매트에 놓인 흑백 무늬 축구공.",
    { kind: "profile", source: "blog", text: "2022년 보도에 인용된 옛 블로그 프로필에는 축구도 좋아하는 것으로 나와요. 당시 자기소개를 바탕으로 만든 소품이며 현재의 최애 종목을 뜻하지는 않아요." }),
  item("blog-diary", "2006 감성 다이어리", "floor", 1, 220, "blog", "하트 스티커를 붙인 다이어리. 누르면 옛 블로그 글귀가 보여요.",
    { kind: "inspired", source: "blog", text: "2006년 무렵 네이버 블로그에 게시된 감성 글에서 착안한 창작 다이어리예요. 아래는 보도에 인용된 짧은 게시 글귀로, 직접 창작한 문장인지는 확인하지 않았어요. 실제 싸이월드 계정이나 소장 일기장을 복원한 것은 아니에요.", excerpt: "오지마. 사랑해버릴 것 같아" }),
];
