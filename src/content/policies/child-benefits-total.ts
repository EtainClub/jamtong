import type { PolicyInput } from "./schema";

/**
 * 출산·육아 지원 — 무엇이 언제 바뀌었고, 한 아이에 얼마인가.
 *
 * "이재명 정부 들어 육아휴직·아빠휴가·출산지원금·자립펀드가 완전히 리뉴얼됐다",
 * "한 자녀당 최대 3억 원", "아동수당·첫만남이용권·자립펀드를 합치면 한 명당 6,000만 원
 * 이상", "첫만남이용권 200만 원에 지역화폐 50만 원이 더 나온다"는 글이 돈다(2025년
 * 7~10월 게시물). 제도마다 바뀐 시점이 다르고, 합계는 부모가 넣는 돈과 운용 수익까지
 * 섞여 부풀려진다.
 *
 * ★ 합계는 이 위키가 출처의 숫자로 직접 계산했다. 계산이므로 INTERPRETATION으로 적고
 *   무엇을 넣고 뺐는지 밝힌다.
 * ★ 아동수당 자체는 `child-allowance`가 다룬다.
 * ★ 2026-10-12 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #18·#19·#21·#22.
 *   2026-10-13 이슈 #36 — 합계에 부모급여와 2027년 예산안을 더하고 육아휴직 개편 시점을 원문과 대조했다.
 */
export const CHILD_BENEFITS_TOTAL: PolicyInput = {
  slug: "child-benefits-total",
  title: "출산·육아 지원 — 무엇이 언제 바뀌었고, 한 아이에 얼마인가",
  scope:
    "육아휴직급여·배우자 출산휴가 확대 시점, 첫만남이용권, 우리아이자립펀드, " +
    "아동수당·첫만남이용권·자립펀드를 합친 한 아이당 정부 지원액",
  ministries: ["보건복지부", "고용노동부", "재정경제부"],
  categories: ["welfare"],
  asOf: "2026-10-13",
  rumors: [
    {
      id: "rumor-renewed",
      text: "이재명 정부 들어 육아휴직, 아빠휴가, 출산지원금, 조리원비, 교육비 공제, 자립펀드 제도가 완전히 리뉴얼되었다",
      claimIds: ["claim-leave-2025", "claim-first-voucher", "claim-fund-plan", "claim-fund-status"],
    },
    {
      id: "rumor-voucher-local",
      text: "첫만남이용권이 기존 200만 원에서 지역화폐 50만 원이 추가 지급되도록 증액된다",
      claimIds: ["claim-first-voucher", "claim-no-local-currency"],
    },
    {
      id: "rumor-60m",
      text: "아동수당, 첫만남이용권, 자립펀드를 합치면 자녀 1명당 체감 혜택이 6,000만 원 이상이고 다자녀 가정은 1억 원 이상까지 가능하다",
      claimIds: ["claim-total", "claim-fund-7000", "claim-allowance"],
    },
    {
      id: "rumor-300m",
      text: "2025년 육아정책이 개편되어 출산·양육·교육·주거까지 한 자녀당 최대 3억 원의 혜택을 받을 수 있다",
      claimIds: ["claim-total", "claim-parent-benefit", "claim-2027-plan", "claim-leave-2025"],
    },
  ],
  claims: [
    {
      id: "claim-leave-2025",
      text:
        "육아휴직급여 상한을 월 150만 원에서 최대 250만 원(1~3개월째, 4~6개월째 200만 원, 이후 160만 원)으로 " +
        "올리고 급여의 25%를 복직 뒤에 주던 사후지급을 없애며, 배우자 출산휴가 급여를 5일분에서 20일분으로 " +
        "늘리는 개편은 윤석열 정부가 2024년 8월 27일 국무회의에서 의결한 2025년 예산안과 10월 입법예고한 법령 " +
        "개정안으로 '내년(2025년)부터' 하겠다고 추진한 것이다. 이재명 정부(2025년 6월 출범)가 만든 제도가 " +
        "아니다.",
      assertionType: "FACT",
      sourceIds: ["src-news1-20240827", "src-bokjiro-20241022"],
      verified: true,
    },
    {
      id: "claim-first-voucher",
      text:
        "첫만남이용권은 2024년 1월 1일 이후 출생아부터 첫째 200만 원, 둘째 이상 300만 원이다. 현금이 아니라 " +
        "국민행복카드 바우처로, 출생일부터 2년 안에 써야 한다.",
      assertionType: "FACT",
      sourceIds: ["src-socialservice-first"],
      verified: true,
    },
    {
      id: "claim-no-local-currency",
      text:
        "첫만남이용권 공식 안내에는 지역화폐 50만 원 추가 지급이 없다. 일부 지자체가 자체 출산축하금을 따로 " +
        "주지만 지역마다 다르고 첫만남이용권의 증액이 아니다.",
      assertionType: "FACT",
      sourceIds: ["src-socialservice-first", "src-seoul-birth"],
      verified: false,
    },
    {
      id: "claim-fund-plan",
      text:
        "우리아이자립펀드는 이재명 정부가 2026년 9월 1일 지원방안을 발표한 새 제도다. 2026년 9월 이후 " +
        "출생아가 대상이고, 만 18세까지 정부가 매칭한다. 중위소득 50% 이하는 연 120만 원(정액), 50~100%는 " +
        "부모 50만 원에 최대 100만 원, 100~150%는 부모 100만 원에 최대 100만 원이다. 부모와 정부 납입을 합친 " +
        "한도는 연 200만 원이다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-20261001"],
      verified: true,
    },
    {
      id: "claim-fund-status",
      text:
        "자립펀드는 2027년 예산안에 1,465억 원이 반영됐고 출시 목표는 2027년 하반기다. 2026년 10월 현재 " +
        "가입할 수 있는 상품이 아니며, 비과세 혜택에는 조세특례제한법 개정이 필요하다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-20261001"],
      verified: true,
    },
    {
      id: "claim-fund-7000",
      text:
        "'만기 때 약 7,000만 원'이라는 정부 추정은 연 200만 원을 19년 동안 넣은 원금 약 3,800만 원에 연 6% " +
        "수익을 더한 것이다. 원금에는 부모 납입이 들어 있고 수익은 가정이다. 정부가 넣는 돈은 연 최대 " +
        "100만~120만 원이다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-20261001"],
      verified: true,
    },
    {
      id: "claim-allowance",
      text:
        "아동수당은 월 10만 원이고, 지급 연령은 2026년 만 9세 미만에서 해마다 한 살씩 늘어 2030년 만 13세 " +
        "미만이 된다.",
      assertionType: "FACT",
      sourceIds: ["src-bokjiro-allowance-cb"],
      verified: true,
    },
    {
      id: "claim-parent-benefit",
      text:
        "부모급여는 2024년 1월부터 0세(0~11개월) 아동 가정에 월 100만 원, 1세(12~23개월)에 월 50만 원이다. " +
        "그 전에는 0세 월 70만 원, 1세 월 35만 원이었다.",
      assertionType: "FACT",
      sourceIds: ["src-yonhap-20240111"],
      verified: true,
    },
    {
      id: "claim-2027-plan",
      text:
        "정부가 2026년 9월 1일 국무회의에서 의결한 2027년 예산안은 출산·입양 세액공제, 첫만남이용권, " +
        "부모급여를 합쳐 첫째 1,000만 원, 둘째 1,200만 원, 셋째 이상 1,500만 원을 주는 출산 지원금(지방 우대 " +
        "지역은 500만 원 추가)과, 아동수당을 대신해 12세 이하에게 월 20만 원(지방 우대 지역 최대 30만 원)을 " +
        "주는 아동기본수당을 담았다. 보도는 지방 우대 지역 셋째 아이가 혼인지원금까지 합쳐 최대 7,500만 원을 " +
        "받는다고 계산했다. 국회 확정 전의 정부안이다.",
      assertionType: "FACT",
      sourceIds: ["src-sbsbiz-20260901"],
      verified: true,
    },
    {
      id: "claim-total",
      text:
        "2026년 9월 이후 태어난 첫째 아이 기준으로 지금 제도의 정부 지원을 더하면 부모급여 1,800만 원" +
        "(0세 월 100만 원 × 12개월 + 1세 월 50만 원 × 12개월), 아동수당 약 1,560만 원(월 10만 원 × 13년), " +
        "첫만남이용권 200만 원, 자립펀드 정부 매칭 약 1,900만~2,280만 원(연 100만~120만 원 × 19년)으로 약 " +
        "5,460만~5,840만 원이다. 2027년 예산안대로 바뀌어도 보도가 든 최대 사례는 7,500만 원이다. 3억 원이라는 " +
        "합계는 정부 발표에서 찾지 못했다.",
      assertionType: "INTERPRETATION",
      sourceIds: [
        "src-yonhap-20240111",
        "src-bokjiro-allowance-cb",
        "src-socialservice-first",
        "src-newspim-20261001",
        "src-sbsbiz-20260901",
      ],
      verified: true,
    },
  ],
  critiqueIds: ["claim-fund-status"],
  timeline: [
    {
      id: "t-voucher",
      date: "2024-01-01",
      datePrecision: "day",
      title: "첫만남이용권 둘째 이상 300만 원",
      summary: "첫째 200만 원.",
      claimIds: ["claim-first-voucher"],
    },
    {
      id: "t-leave",
      date: "2025",
      datePrecision: "year",
      title: "육아휴직급여 최대 250만 원 시행",
      summary: "2024년 추진, 배우자 출산휴가 급여 20일분.",
      claimIds: ["claim-leave-2025"],
    },
    {
      id: "t-fund",
      date: "2026-09-01",
      datePrecision: "day",
      title: "우리아이자립펀드 지원방안 발표",
      summary: "2027년 하반기 출시 목표.",
      claimIds: ["claim-fund-plan", "claim-fund-status"],
    },
  ],
  gaps: [
    "합계 계산은 아동수당이 계획대로 2030년 만 13세 미만까지 확대되고 자립펀드가 19년 내내 지금 설계대로 운영된다고 가정했다. 부모급여(0~1세)·보육료 등 다른 지원은 넣지 않았다 — 게시물이 든 세 제도만 더했다.",
    "육아휴직 개편의 정확한 시행일(2025년 1월 1일 또는 2월 23일)을 법령 원문으로 확인하지 못했다.",
    "산후조리원비 지원과 교육비 공제가 이재명 정부에서 바뀌었는지 확인하지 못했다.",
    "다자녀 가정 '1억 원 이상' 주장은 따로 계산하지 않았다. 둘째부터 첫만남이용권이 300만 원이 되는 것 외에 자녀 수에 따라 늘어나는 정부 지원을 확인하지 못했다.",
    "지역화폐 50만 원 추가가 어느 지자체 제도를 가리키는지 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-yonhap-20240111",
      title: "올해부터 부모급여 '0세 100만원·1세 50만원'으로 인상",
      publisher: "연합뉴스(보건복지부 발표)",
      url: "https://v.daum.net/v/20240111120033879",
      publishedAt: "2024-01-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sbsbiz-20260901",
      title: "아이 한명당 최대 7500만원…혼인·출산·양육 지원 확대 [2027 예산안]",
      publisher: "SBS Biz",
      url: "https://biz.sbs.co.kr/amp/article/20000331915",
      publishedAt: "2026-09-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-news1-20240827",
      title: "육아휴직급여 월 150만→250만원 인상…배우자 휴가급여도 4배↑",
      publisher: "뉴스1",
      url: "https://v.daum.net/v/20240827110552493",
      publishedAt: "2024-08-27",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-bokjiro-20241022",
      title: "내년부터 육아휴직 급여 월 최대 250만 원",
      publisher: "복지로(고용노동부)",
      url: "https://www.bokjiro.go.kr/ssis-tbu/cms/pc/news/promotion/1307361_1118.html",
      publishedAt: "2024-10-22",
      type: "official",
      license: "public",
    },
    {
      id: "src-socialservice-first",
      title: "첫만남 이용권 지원사업",
      publisher: "사회서비스 전자바우처(한국사회보장정보원·보건복지부)",
      url: "https://www.socialservice.or.kr:444/user/htmlEditor/view2.do?p_sn=69",
      type: "official",
      license: "public",
    },
    {
      id: "src-seoul-birth",
      title: "아이 낳고 받는 혜택, 이렇게나 많다고?! 더 확대된 돌봄지원 총정리",
      publisher: "서울시 미디어허브",
      url: "https://mediahub.seoul.go.kr/archives/2010106",
      type: "official",
      license: "link-only",
    },
    {
      id: "src-newspim-20261001",
      title: "\"성인될 때 7000만원 목돈\"...정부 지원 '아이자립펀드' 내년 하반기 출시 목표",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20260930001144",
      publishedAt: "2026-10-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-bokjiro-allowance-cb",
      title: "아동수당 9세 미만으로 확대…1~3월분 소급해 24일 지급",
      publisher: "보건복지부 · 정책브리핑",
      url: "https://www.bokjiro.go.kr/ssis-tbu/cms/pc/news/news/1309692_1114.html",
      publishedAt: "2026-04-24",
      type: "official",
      license: "public",
    },
  ],
};
