import type { PolicyInput } from "./schema";

/**
 * 국채 발행과 국가채무 전망.
 *
 * "정부가 매년 110조씩 빚을 내겠다고 선언했다", "임기 말 국가채무가 2,000조가 된다"는
 * 글이 돈다(2025년 12월 게시물). 110조는 2026년 예산안의 적자국채 규모로 실제 있는
 * 숫자지만 한 해 치다. 2,000조는 정부의 어느 중기 전망에도 없는 숫자다.
 *
 * ★ 국가채무 전망은 해마다 새로 낸다. 2025년 8월 계획(2025~2029)과 2026년 9월 계획
 *   (2026~2030)을 섞지 않고 각각 적는다. 전망은 정부의 추정이므로 CLAIM이다.
 * ★ 적자 규모가 크다는 비판은 사실이다. 나랏빚이 매년 늘어나는 것도 사실이다.
 *   부정하지 않고 그 크기를 정확히 적는다.
 * ★ 2026-10-11 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #4·#7.
 *   2026-10-13 이슈 #24(1인당 부채)·#35(IMF 권고)를 더했다.
 *   2026-10-23 신통 이슈 #60(박수영 의원의 'GDP 대비 181%')을 더했다.
 *   2026-10-30 잼통 Voice 이슈 #113('세금을 다 쓰고 빚만 늘린다')을 더했다.
 */
export const NATIONAL_DEBT: PolicyInput = {
  slug: "national-debt",
  title: "국채 발행과 국가채무 전망",
  scope:
    "2026년 예산의 적자국채·국고채 발행 규모, 2025~2029·2026~2030 국가재정운용계획의 국가채무 전망, " +
    "1인당 국가채무, IMF 2025년 연례협의 권고, 2024년 말 D1~D3와 연금 부채를 더한 'D4' 주장",
  ministries: ["재정경제부", "기획예산처"],
  categories: ["economy"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-spend-all",
      text: "아이들의 미래를 말하면서 세금을 다 쓰고 빚만 늘린다",
      claimIds: ["claim-2026-deficit-bond", "claim-2027-budget", "claim-2026-plan-debt", "claim-imf-2025"],
    },
    {
      id: "rumor-110-every-year",
      text: "정부는 매년 110조 원씩 빚을 내겠다고 선언했다",
      claimIds: ["claim-2026-deficit-bond", "claim-2026-issuance", "claim-2025-plan-deficit", "claim-2027-budget"],
    },
    {
      id: "rumor-2000",
      text: "이대로 가면 임기 종료 시 국가채무는 2,000조 원이 된다",
      claimIds: ["claim-2025-plan-debt", "claim-2026-plan-debt"],
    },
    {
      id: "rumor-per-capita",
      text: "이재명 정부에서 국가부채가 국민 1인당 1억 3,000만 원이다",
      claimIds: ["claim-per-capita", "claim-bis-total"],
    },
    {
      id: "rumor-imf-warning",
      text: "IMF가 이재명 정부의 확장 재정 정책에 이례적으로 강력한 경고를 내고 2030년부터 확장 재정을 반드시 중단해야 한다고 조언했다",
      claimIds: ["claim-imf-2025", "claim-imf-reading"],
    },
    {
      id: "rumor-hidden-181",
      text: "정부가 국가부채를 숨겨 왔고, 숨겨진 진짜 국가부채가 GDP 대비 181%에 달한다",
      claimIds: ["claim-official-2024", "claim-park-d4", "claim-d4-reading"],
    },
  ],
  claims: [
    {
      id: "claim-2026-deficit-bond",
      text:
        "정부는 2025년 8월 발표한 2026년 예산안에서 세입 부족분을 메우는 적자국채를 110조 원으로 " +
        "잡았다. 관리재정수지 적자는 109조 원(GDP 대비 4.0%)으로 제시했다. 110조 원은 2026년 " +
        "한 해 예산안의 숫자다.",
      assertionType: "FACT",
      sourceIds: ["src-herald-20250829", "src-korea-2026-budget"],
      verified: true,
    },
    {
      id: "claim-2026-final",
      text:
        "국회는 2025년 12월 2026년 예산을 총지출 728조 원 규모로 확정했다. 전년보다 54.6조 원" +
        "(8.1%) 늘었다. 2026년 말 국가채무는 1,413.8조 원(GDP 대비 51.6%)으로 계획됐다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-20251203"],
      verified: true,
    },
    {
      id: "claim-2026-issuance",
      text:
        "기획재정부(현 재정경제부)가 2025년 12월 26일 확정한 2026년 국고채 총발행 한도는 225.7조 원이다. 이 중 " +
        "새로 늘어나는 순발행이 109.4조 원, 만기가 돌아온 국채를 갚기 위한 차환발행이 116.2조 원이다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20251226"],
      verified: true,
    },
    {
      id: "claim-2025-plan-deficit",
      text:
        "2025년 8월 낸 2025~2029년 국가재정운용계획은 관리재정수지 적자가 2026~2029년 매년 " +
        "GDP 대비 4.0~4.4% 수준으로 이어진다고 전망했다. 국가채무는 해마다 100조 원 넘게 " +
        "늘어나는 계획이었다.",
      assertionType: "CLAIM",
      assertedBy: "정부(2025~2029년 국가재정운용계획)",
      sourceIds: ["src-herald-20250829"],
      verified: true,
    },
    {
      id: "claim-2025-plan-debt",
      text:
        "같은 2025~2029년 계획에서 정부는 2029년 국가채무를 1,788.9조 원(GDP 대비 58.0%)으로 " +
        "전망했다.",
      assertionType: "CLAIM",
      assertedBy: "정부(2025~2029년 국가재정운용계획)",
      sourceIds: ["src-herald-20250829"],
      verified: true,
    },
    {
      id: "claim-2027-budget",
      text:
        "기획예산처가 2026년 9월 1일 낸 2027년 예산안은 총지출 820.9조 원으로 2026년 본예산" +
        "(727.9조 원)보다 12.8% 늘었다. 관리재정수지 적자는 약 3조 원(GDP 대비 0.1%)으로, " +
        "2026년 본예산의 107.8조 원 적자보다 크게 줄어든 것으로 제시됐다.",
      assertionType: "CLAIM",
      assertedBy: "기획예산처(2027년 예산안)",
      sourceIds: ["src-newspim-20260901", "src-fnnews-20260901"],
      verified: true,
    },
    {
      id: "claim-2026-plan-debt",
      text:
        "2026~2030년 국가재정운용계획은 국가채무가 2026년 1,413.8조 원에서 2030년 1,734.1조 원" +
        "(GDP 대비 49.0%)으로 늘어난다고 전망했다. GDP 대비 비율은 2027년 48.3%, 2028년 48.9%, " +
        "2029년 48.8%다. 관리재정수지 적자는 2028년 1.5%, 2029년 2.5%, 2030년 2.9%(약 100.8조 원)로 " +
        "다시 커진다.",
      assertionType: "CLAIM",
      assertedBy: "기획예산처(2026~2030년 국가재정운용계획)",
      sourceIds: ["src-newspim-20260901", "src-fnnews-20260901"],
      verified: true,
    },
    {
      id: "claim-debt-growth",
      text:
        "2026~2030년 계획대로라도 국가채무는 4년 동안 약 320조 원 늘고, 총지출은 2030년 " +
        "1,005.2조 원으로 1,000조 원을 넘는다. 2029년 이후 적자 비율이 다시 커지는 것도 " +
        "계획에 들어 있다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-20260901", "src-fnnews-20260901"],
      verified: true,
    },
    {
      id: "claim-revenue-assumption",
      text:
        "2027년 적자 축소와 채무비율 하락은 세수가 크게 늘어난다는 전제에 기대고 있다. " +
        "조세부담률이 2026년 17.0%에서 2027년 22.5%로 오른다고 가정했는데, 반도체 호황에 " +
        "따른 세수 증가가 계속될지는 불확실하다는 지적이 있다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-newspim-20260901", "src-newscj-debt"],
      verified: false,
    },
    {
      id: "claim-per-capita",
      text:
        "2026년 말 계획 국가채무 1,413.8조 원을 2025년 말 주민등록인구 5,111만 7,378명으로 나누면 1인당 " +
        "약 2,770만 원이다. 국가채무는 중앙·지방정부가 갚아야 할 빚이다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-hankyung-20251203", "src-newsis-20260104"],
      verified: true,
    },
    {
      id: "claim-bis-total",
      text:
        "국제결제은행(BIS) 기준 한국의 국가총부채는 2025년 1분기 말 6,373조 원(GDP 대비 247.9%)이다. " +
        "정부·가계·기업 빚을 모두 더한 것으로, 이 중 기업 부채만 2,861조 원이다. 이것을 인구로 나누면 1인당 " +
        "약 1억 2,500만 원이 된다. '1인당 1억 3,000만 원'에 가까운 숫자는 기업과 가계 빚까지 넣어야 나온다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-daum-20250918", "src-newsis-20260104"],
      verified: true,
    },
    {
      id: "claim-imf-2025",
      text:
        "IMF 이사회는 2025년 11월 한국 연례협의를 마치며, 마이너스 산출갭을 고려해 현재의 확장적 재정을 " +
        "환영했고 일부 이사는 더 강한 경기 대응이 필요할 수 있다고 했다. 고령화에 따른 장기 지출 압력을 " +
        "들어 성장이 잠재 수준으로 돌아오면 재정 건전화를 재개하고, 세제·지출 효율·연금 개혁과 중기 " +
        "재정준칙(앵커) 도입을 서두르라고 권고했다.",
      assertionType: "CLAIM",
      assertedBy: "IMF 이사회(2025년 한국 연례협의)",
      sourceIds: ["src-imf-pr-25385"],
      verified: true,
    },
    {
      id: "claim-imf-reading",
      text:
        "IMF 발표문에는 '2030년부터 확장 재정을 반드시 중단하라'는 시한이 없고 소비쿠폰 언급도 없다. " +
        "건전화를 권고한 것은 맞지만, 현재의 확장 재정은 오히려 환영했다. '이례적으로 강력한 경고'라는 " +
        "말은 발표문의 어조와 다르다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-imf-pr-25385"],
      verified: true,
    },
    {
      id: "claim-official-2024",
      text:
        "기획재정부가 2025년 12월 11일 발표한 2024년 말 집계로 국가채무(D1)는 1,172조 원(GDP 대비 46.0%), " +
        "일반정부 부채(D2)는 1,270조 8천억 원(49.7%), 공기업까지 넣은 공공부문 부채(D3)는 1,738조 6천억 원" +
        "(68.0%)이다. 정부는 이 세 지표를 해마다 공개한다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-20251216", "src-heraldk-20251210"],
      verified: true,
    },
    {
      id: "claim-park-d4",
      text:
        "박수영 국민의힘 의원은 2025년 12월 16일, D3 1,738조 원에 국민연금 미적립부채 1,575조 원, 공무원연금 " +
        "충당부채 1,052조 원, 군인연금 충당부채 267조 원을 더한 '광의의 국가부채(D4)'가 2024년 말 4,632조 원으로 " +
        "GDP 대비 181%, 1인당 8,963만 원이라고 주장했다. 정부가 D3까지만 발표한다며 D4를 투명하게 공개하라고 했다.",
      assertionType: "CLAIM",
      assertedBy: "박수영 국민의힘 의원실",
      sourceIds: ["src-munhwa-20251216", "src-hankyung-20251216"],
      verified: true,
    },
    {
      id: "claim-d4-reading",
      text:
        "181%는 정부 통계가 아니라 의원실 자체 집계이고, 기획재정부는 연금 충당부채를 포함한 D4 개념을 쓰지 않는다. " +
        "공무원·군인연금 충당부채는 매년 국가결산 재무제표에 따로 공개돼 왔다(2022년 말 1,181조 3천억 원, 2023년 말 1,230조 2천억 원). 이 금액은 " +
        "앞으로 약 70년간 줄 연금을 현재가치로 계산한 추정치로, 가입자가 낼 기여금 수입은 빼지 않은 값이다. " +
        "박 의원의 요구도 '숨긴 빚'을 밝힌 것이 아니라, 공개된 항목을 하나의 지표로 더해 발표하라는 것이다. " +
        "또 숫자의 기준 시점인 2024년 말은 이재명 정부 출범 전이다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-hankyung-20251216", "src-munhwa-20251216", "src-newsis-20230404", "src-newsis-20240410"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-debt-growth", "claim-revenue-assumption"],
  timeline: [
    {
      id: "t-2026-proposal",
      date: "2025-08-29",
      datePrecision: "day",
      title: "2026년 예산안 발표",
      summary: "적자국채 110조, 2029년 국가채무 1,788.9조 전망.",
      claimIds: ["claim-2026-deficit-bond", "claim-2025-plan-debt"],
    },
    {
      id: "t-2026-final",
      date: "2025-12",
      datePrecision: "month",
      title: "2026년 예산 확정",
      summary: "728조, 국가채무 1,413.8조.",
      claimIds: ["claim-2026-final"],
    },
    {
      id: "t-issuance",
      date: "2025-12-26",
      datePrecision: "day",
      title: "2026년 국고채 발행계획",
      summary: "총 225.7조(순발행 109.4조).",
      claimIds: ["claim-2026-issuance"],
    },
    {
      id: "t-2027-proposal",
      date: "2026-09-01",
      datePrecision: "day",
      title: "2027년 예산안·2026~2030 계획",
      summary: "2030년 국가채무 1,734.1조 전망.",
      claimIds: ["claim-2027-budget", "claim-2026-plan-debt"],
    },
  ],
  gaps: [
    "기획예산처·재정경제부 보도자료와 국가재정운용계획 원문을 직접 대조하지 못했다. 수치는 보도와 정책브리핑으로 확인했다.",
    "2026년 확정 예산의 최종 적자국채 규모가 예산안의 110조 원에서 얼마나 바뀌었는지 확인하지 못했다. 확정된 것은 국고채 순발행 한도 109.4조 원이다.",
    "2027~2029년 국가채무 금액(조 원)은 확인하지 못했다. 비율만 적었다. 2027년 1,519.8조 원이라는 보도가 있으나 원문을 대조하지 못했다.",
    "국가채무비율이 2026년 51.6%에서 2027년 48.3%로 떨어지는 이유(세수 증가, GDP 통계 개편 여부 등)를 원자료로 확인하지 못했다.",
    "국회예산정책처의 독자 중기 전망은 싣지 않았다. 2,000조 원이라는 숫자의 출처도 찾지 못했다.",
    "IMF 2025년 연례협의 직원보고서(Country Report No. 25/308)의 장기 부채 전망 표는 직접 확인하지 못했다. '2050년 부채비율 90~130%'라는 보도 수치는 대조하지 못했다.",
    "BIS 국가총부채를 1인당으로 나눈 값은 이 위키의 계산이다. BIS 기준과 정부 국가채무(D1)는 범위가 다르다.",
    "2024회계연도 국가결산의 공무원·군인연금 충당부채 금액은 원자료로 확인하지 못했다. 박 의원이 쓴 1,052조·267조 원과 결산 수치의 차이도 대조하지 못했다.",
  ],
  sources: [
    {
      id: "src-korea-2026-budget",
      title: "2026년 예산안, 혁신과 포용의 재정",
      publisher: "대한민국 정책브리핑",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148949045",
      publishedAt: "2025-09-12",
      type: "official",
      license: "public",
    },
    {
      id: "src-herald-20250829",
      title: "빠듯한 나라살림에 적자국채 110조 발행…내년 나랏빚 1400조 돌파 [2026년 예산안]",
      publisher: "헤럴드경제",
      url: "https://biz.heraldcorp.com/article/10564665",
      publishedAt: "2025-08-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankyung-20251203",
      title: "내년 국가채무 1414조…부채비율 50% 첫 돌파",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/2025120320011",
      publishedAt: "2025-12-03",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20251226",
      title: "내년 국고채 총 발행한도 222.7조…올해보다 0.5조↓",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20251226_0003456127",
      publishedAt: "2025-12-26",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newspim-20260901",
      title: "[2027 예산안] 李정부, 2030년 '1000조' 시대 연다…나라빚 비율 49% 목표",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20260901000421",
      publishedAt: "2026-09-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20260901",
      title: "2030년 재정지출 1000兆… 나랏빚은 1700兆 'GDP比 49%' [2027년 예산안]",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202609011811267507",
      publishedAt: "2026-09-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newscj-debt",
      title: "[경제인사이드] '슈퍼 예산'에 커지는 나랏빚… 2030년 국가채무 1700조 돌파",
      publisher: "천지일보",
      url: "https://www.newscj.com/news/articleView.html?idxno=3429501",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20260104",
      title: "행안부, '2025년 주민등록 인구통계 분석' 결과",
      publisher: "뉴시스(행정안전부 발표)",
      url: "https://www.newsis.com/view/NISX20260104_0003464167",
      publishedAt: "2026-01-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-daum-20250918",
      title: "\"그렇게 심각하다던 영국 보다 더 위험\"…한국 부채, 10년 만에 3000조원 불었다",
      publisher: "다음 뉴스",
      url: "https://v.daum.net/v/20250918045110882",
      publishedAt: "2025-09-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-imf-pr-25385",
      title: "IMF Executive Board Concludes 2025 Article IV Consultation with Republic of Korea (PR 25/385)",
      publisher: "IMF",
      url: "https://www.imf.org/en/news/articles/2025/11/21/pr-25385-republic-of-korea-imf-executive-board-concludes-2025-article-iv-consultation",
      publishedAt: "2025-11-21",
      type: "official",
      license: "public",
    },
    {
      id: "src-heraldk-20251210",
      title: "정부부채 1270.8조…부채비율 6년 만에 첫 하락",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2025121017000054091",
      publishedAt: "2025-12-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankyung-20251216",
      title: "한국 진짜 나랏빚 4632조원…무서운 경고 나왔다",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/2025121659307",
      publishedAt: "2025-12-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-munhwa-20251216",
      title: "박수영 의원 \"진짜 국가 부채는 4632조…1인당 빚 8963만 원\"",
      publisher: "문화일보",
      url: "https://www.munhwa.com/article/11554586",
      publishedAt: "2025-12-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20230404",
      title: "[국가결산]공무원·군인 등 연금충당부채 1181조…1년새 43조↑",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20230404_0002252803",
      publishedAt: "2023-04-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20240410",
      title: "고금리에 국가부채 2439조 '역대 최대'…순자산은 67.6조↑[국가결산]",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20240410_0002694354",
      publishedAt: "2024-04-10",
      type: "press",
      license: "link-only",
    },
  ],
};
