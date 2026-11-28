import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 노란봉투법 시행 — 하청 노동자가 원청과 교섭할 길, 파업 손해배상의 기준.
 *
 * ★ 2026-11-28 작성. 초안은 Codex(GPT)가 실시간 검색으로 1차 자료(법령·정책브리핑·부처 보도자료)와 보도를 모아 썼고,
 *   에이전트가 출처 페이지를 직접 받아 인용문이 그대로 있는지, claim의 숫자가 그 출처에 있는지 대조한 뒤 내용을 읽어 고쳤다
 *   (docs/gov-achievements-p1-review.md).
 * ★ 계획·추진과 시행·완료를 구분했다. 부처의 계획·평가와 비판은 CLAIM(주장한 쪽)으로 적었다.
 */
const raw: AchievementInput = {
  id: "yellow-envelope",
  slug: "yellow-envelope",
  title: "노란봉투법 시행",
  subtitle: "하청 노동자가 원청과 교섭할 길, 파업 손해배상의 기준",
  lifeQuestion: "하청 노동자의 원청 교섭과 파업 손해배상은 무엇이 달라졌나?",
  kicker: "주요 정책",
  categories: ["institution", "economy"],
  summary: "노란봉투법으로 불리는 노동조합법 2·3조 개정은 2025년 8월 24일 국회를 통과하고 9월 9일 공포돼 2026년 3월 10일부터 시행됐다. 근로조건을 실질적이고 구체적으로 지배·결정할 수 있는 원청 등의 사용자성을 그 범위에서 인정하고, 노동쟁의 대상을 확대했으며, 근로자별 손해배상 책임비율과 배상액 감면 규정을 마련했다. 정부는 시행 전 해석지침을 확정하고 원·하청 교섭절차 매뉴얼을 발표했다. 고용노동부가 국회에 제출한 자료를 인용한 보도에 따르면 2026년 10월 1일 기준 교섭 요구를 받은 원청은 460곳, 완전 타결된 사업장은 3곳이었고, 사용자성 판단과 교섭절차를 둘러싼 분쟁도 이어졌다.",
  type: "policy",
  publishStatus: "published",
  sourceNote: "2026년 11월 28일 기준으로 확인한 국가법령정보센터 제3조 조문, 고용노동부·정책브리핑 자료와 연합뉴스·경향신문 보도를 사용했다. 전국 교섭 현황은 4월 9일까지의 노동부 발표와 10월 1일 기준 국회 제출자료에 관한 보도이며, 11월 28일 현재의 전국 누계로 확인한 수치가 아니다. 경남의 사용자성 소송 사례는 9월 2일 보도 당시 상태로, 이후 확정판결 여부는 확인하지 못했다. 법 시행이 임금·고용·투자·파업 및 실제 손해배상액에 미친 순효과와 경영계가 우려한 거래 축소·비용 전가의 전국적 발생 규모는 이 자료들로 확인되지 않는다.",
  headlineKeyNumberId: "ye-kn-demands",
  keyNumbers: [
    {"id": "ye-kn-demands", "label": "교섭 요구를 받은 원청", "value": "460", "unit": "곳", "caption": "2026년 10월 1일 기준, 노동부 국회 제출자료를 인용한 보도", "claimId": "ye-october"},
    {"id": "ye-kn-settlements", "label": "원·하청 교섭 완전 타결", "value": "3", "unit": "곳", "caption": "같은 자료의 집계이며 11월 말 누계가 아니다", "claimId": "ye-october"},
    {"id": "ye-kn-paused", "label": "노조의 후속 절차 미진행 사업장", "value": "238", "unit": "곳", "caption": "교섭 요구 후 노조 측이 절차를 진행하지 않은 원청 사업장", "claimId": "ye-october"},
  ],
  timeline: [
    {"id": "ye-t-passage", "date": "2025-08-24", "datePrecision": "day", "title": "개정안 국회 본회의 통과", "summary": "노동조합법 2·3조 개정안이 국회 본회의를 통과했다.", "claimIds": ["ye-enactment"]},
    {"id": "ye-t-promulgation", "date": "2025-09-09", "datePrecision": "day", "title": "개정법 공포", "summary": "정부 이송과 국무회의 의결을 거쳐 공포됐다.", "claimIds": ["ye-enactment"]},
    {"id": "ye-t-guidance", "date": "2026-02-24", "datePrecision": "day", "title": "정부 해석지침 확정 발표", "summary": "사용자성 판단의 구조적 통제와 노동쟁의 대상에 관한 설명을 정비했다.", "claimIds": ["ye-guidance"]},
    {"id": "ye-t-manual", "date": "2026-02-27", "datePrecision": "day", "title": "원·하청 교섭절차 매뉴얼 발표", "summary": "노동부와 중앙노동위원회가 교섭창구 단일화와 교섭단위 분리에 관한 운영 방침을 설명했다.", "claimIds": ["ye-manual"]},
    {"id": "ye-t-enforcement", "date": "2026-03-10", "datePrecision": "day", "title": "개정 노동조합법 시행", "summary": "사용자성 확대, 노동쟁의 대상 확대와 손해배상 제한 규정이 시행됐다.", "claimIds": ["ye-enactment", "ye-employer", "ye-disputes", "ye-damages"]},
    {"id": "ye-t-first-month", "date": "2026-04-10", "datePrecision": "day", "title": "시행 한 달 교섭 요구 집계 발표", "summary": "노동부는 4월 9일까지 원청 372곳을 대상으로 하청 노조·지부·지회 1천11개가 교섭을 요구했다고 발표했다.", "claimIds": ["ye-first-month"]},
    {"id": "ye-t-first-settlement", "date": "2026-09-10", "datePrecision": "day", "title": "현대제철 원·하청 단체협약 조인", "summary": "현대제철과 자회사 노사의 단체협약 조인이 법 시행 이후 첫 원·하청 교섭 타결 사례로 보도됐다.", "claimIds": ["ye-first-settlement"]},
    {"id": "ye-t-october-report", "date": "2026-10-13", "datePrecision": "day", "title": "국회 제출자료로 교섭 진행 현황 보도", "summary": "10월 1일 기준 원청 460곳이 교섭 요구를 받았으나 완전 타결은 3곳으로 집계됐다.", "claimIds": ["ye-october"]},
  ],
  counterpoints: [
    {"id": "ye-cp-uncertainty", "question": "사용자 범위가 모호해 원청과 하청 모두 분쟁 비용만 늘어나는 것 아닌가?", "response": "경제 6단체는 사용자와 노동쟁의 대상의 불명확성에 따른 법적 분쟁을 우려했고, 중소기업계에서는 거래 축소와 비용 전가 가능성도 제기했다. 정부는 해석지침과 교섭절차 매뉴얼을 마련했지만, 웰리브지회 사건처럼 노동위원회의 사용자성 판단 이후 행정소송으로 이어진 사례가 있다. 해당 소송의 최종 결론과 거래 축소·비용 전가의 전국적 규모는 확인되지 않았다.", "claimIds": ["ye-business-concerns", "ye-guidance", "ye-manual", "ye-litigation"]},
    {"id": "ye-cp-immunity", "question": "불법 파업까지 손해배상 책임을 모두 없애는 법 아닌가?", "response": "제3조는 법에 따른 노조 활동에 대한 청구 제한과 사용자의 불법행위에 대한 부득이한 방위행위 면책을 규정한다. 동시에 근로자의 배상책임이 인정되는 경우의 책임비율 산정과 감면 심사도 규정하므로 모든 파업의 배상책임을 일괄 면제하는 내용은 아니다. 경영계는 개별 책임 입증 부담과 불법 파업 억제력 약화를 우려하며, 실제 배상 부담이 얼마나 달라졌는지는 확인되지 않았다.", "claimIds": ["ye-damages", "ye-damages-criticism"]},
    {"id": "ye-cp-implementation", "question": "교섭 요구만 늘고 실제 합의는 거의 없는 것 아닌가?", "response": "10월 1일 기준 요구를 받은 원청 460곳 중 완전 타결은 3곳으로, 요구 건수를 합의 건수로 볼 수 없다. 다만 현대제철 등의 타결 사례도 있고, 238곳은 교섭 요구 후 노조가 후속 절차를 진행하지 않은 상태로 집계돼 지연을 모두 원청의 거부로 설명할 수는 없다. 이 수치는 11월 말 현황이나 최종적인 제도 효과를 보여주는 자료는 아니다.", "claimIds": ["ye-october", "ye-first-settlement"]},
  ],
  claims: [
    { id: "ye-enactment", text: "노동조합 및 노동관계조정법 2·3조 개정안은 2025년 8월 24일 국회 본회의를 통과하고 9월 9일 공포됐다. 개정법은 2026년 3월 10일부터 시행됐다.", assertionType: "FACT", sourceIds: ["src-promulgation", "src-enforcement", "src-law-damages"], verified: true },
    { id: "ye-employer", text: "개정법은 근로계약 체결 당사자가 아니더라도 근로조건에 대해 실질적이고 구체적으로 지배·결정할 수 있는 지위에 있는 자를 그 범위에서 사용자로 인정한다. 하청노조가 원청에 교섭을 요구할 법적 근거가 확대됐지만, 모든 원청이 모든 근로조건의 사용자가 되는 것은 아니다.", assertionType: "FACT", sourceIds: ["src-enforcement"], verified: true },
    { id: "ye-disputes", text: "노동쟁의 대상에 근로조건에 영향을 미치는 사업경영상의 결정과 명백한 단체협약 위반이 포함됐다. 고용노동부는 사업경영상 결정에 정리해고와 구조조정에 따른 배치전환 등이 해당한다고 설명했다.", assertionType: "FACT", sourceIds: ["src-enforcement", "src-guidance"], verified: true },
    { id: "ye-damages", text: "제3조는 법에 따른 단체교섭·쟁의행위·그 밖의 노조 활동에 대한 손해배상 청구를 제한하고, 사용자의 불법행위에 맞서 노조나 근로자의 이익을 방위하기 위해 부득이 손해를 가한 경우의 면책을 규정한다. 법원이 근로자의 배상책임을 인정하면 노조 내 지위·참여 정도·손해 관여 정도·임금 수준 등에 따라 책임비율을 정해야 한다. 배상의무자인 노조와 근로자는 법원에 배상액 감면을 청구할 수 있으며 법원은 경제상태·가족관계·최저생계비 보장 및 존립 유지 등을 고려해 판단한다.", assertionType: "FACT", sourceIds: ["src-law-damages"], verified: true },
    { id: "ye-guidance", text: "고용노동부는 2026년 2월 24일 개정 노동조합법 해석지침을 확정했다고 발표했다. 사용자성 판단의 핵심 고려 요소인 구조적 통제와 불법파견의 차이를 설명하고, 노동쟁의 대상인 배치전환을 일상적 배치전환이 아닌 구조조정에 따른 배치전환으로 명시했다.", assertionType: "FACT", sourceIds: ["src-guidance"], verified: true },
    { id: "ye-manual", text: "고용노동부와 중앙노동위원회는 2026년 2월 27일 원·하청 교섭절차 매뉴얼을 발표하며 원·하청 교섭에도 교섭창구 단일화 절차가 적용된다고 설명했다. 원칙적으로 전체 하청노동자를 하나의 교섭단위로 하되 업무·근로조건·이해관계 등이 다르면 교섭단위 분리가 가능하다는 운영 방침이다.", assertionType: "CLAIM", assertedBy: "고용노동부·중앙노동위원회", sourceIds: ["src-manual"], verified: true },
    { id: "ye-first-month", text: "고용노동부가 2026년 4월 10일 발표한 집계에 따르면 3월 10일부터 4월 9일까지 원청 사업장·기관 372곳을 대상으로 하청 노조·지부·지회 1천11개가 교섭을 요구했다. 교섭 요구 사실을 공고해 교섭절차에 들어간 원청은 33곳이었다.", assertionType: "FACT", sourceIds: ["src-first-month"], verified: true },
    { id: "ye-october", text: "김위상 국민의힘 의원실이 고용노동부로부터 받은 자료를 인용한 2026년 10월 13일 연합뉴스 보도에 따르면 10월 1일 기준 교섭 요구를 받은 원청 사업장은 460곳이며, 완전 타결된 사업장은 3곳이었다. 238곳은 교섭 요구 후 노조가 후속 절차를 진행하지 않아 교섭이 멈춘 상태로 집계됐다. 사용자성 판단과 재심 등 절차도 이어지고 있었다.", assertionType: "FACT", sourceIds: ["src-october"], verified: true },
    { id: "ye-first-settlement", text: "연합뉴스는 2026년 9월 10일 현대제철 당진공장에서 현대제철과 자회사 노사가 단체협약 조인식을 연 것을 개정법 시행 이후 첫 원·하청 교섭 타결 사례로 보도했다. 이후 한강이앰피와 제주국제자유도시개발센터에서도 원·하청 단체협약이 타결됐다고 전했다.", assertionType: "FACT", sourceIds: ["src-october"], verified: true },
    { id: "ye-litigation", text: "2026년 9월 2일 연합뉴스 보도에 따르면 중앙노동위원회는 한화오션이 웰리브지회에 대해 산업안전·작업 안전 의제의 실질적 사용자에 해당한다고 판단했다. 한화오션은 7월 서울행정법원에 중노위 재심판정 취소 소송과 집행정지를 신청했다.", assertionType: "FACT", sourceIds: ["src-litigation"], verified: true },
    { id: "ye-business-concerns", text: "중소기업중앙회를 비롯한 경제 6단체는 법상 사용자와 노동쟁의 대상인 사업경영상 결정의 범위가 불분명해 법적 분쟁이 발생할 수밖에 없다고 우려했다. 연합뉴스가 취재한 중소기업계 관계자는 원청의 거래 중단·일감 축소나 교섭 비용의 하청 전가 가능성을 제기했고, 중기중앙회는 실태 점검과 보완 입법을 요구했다.", assertionType: "CLAIM", assertedBy: "중소기업중앙회 등 경제 6단체·연합뉴스가 취재한 중소기업계 관계자", sourceIds: ["src-business"], verified: true },
    { id: "ye-damages-criticism", text: "경향신문 보도에서 경영계는 조합원별 불법행위 정도와 책임비율에 대한 입증 부담이 커져 손해배상 청구가 어려워질 수 있다는 입장을 밝혔다. 불법 파업 억제력 약화와 기업 재산권 침해 가능성도 우려했다.", assertionType: "CLAIM", assertedBy: "경향신문이 보도한 경영계", sourceIds: ["src-damages-criticism"], verified: true },
  ],
  sources: [
    { id: "src-promulgation", title: "'개정 노동조합법 2·3조' 국무회의 의결…내년 3월 10일 시행", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148948875", publisher: "대한민국 정책브리핑·고용노동부", publishedAt: "2025-09-09", type: "official", license: "public", quote: "지난 8월 24일 국회 본회의를 통과한 '개정 노동조합법 2·3조'가 정부 이송 절차를 거쳐 국무회의 의결(2일)을 마침에 따라 9일 공포됐다." },
    { id: "src-enforcement", title: "3월 10일, 개정 노동조합법 2·3조 시행 개정법 현장 안착 위해 노동부 총력전", url: "https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=19047", publisher: "고용노동부", publishedAt: "2026-03-09", type: "official", license: "public", quote: "이번 법 시행으로 근로계약 당사자가 아니더라도 근로조건에 대해 실질적이고 구체적으로 지배·결정할 수 있는 지위에 있는 자는 그 범위에서 사용자로 인정된다." },
    { id: "src-law-damages", title: "노동조합 및 노동관계조정법 제3조(손해배상 청구의 제한)", url: "https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1021081137", publisher: "국가법령정보센터", publishedAt: "2025-09-09", type: "legislative", license: "public", quote: "③ 법원은 단체교섭, 쟁의행위, 그 밖의 노동조합의 활동으로 인한 손해배상책임을 근로자에게 인정하는 경우 손해의 배상의무자인 근로자에 대하여 다음 각 호에 따라 책임비율을 정하여야 한다." },
    { id: "src-guidance", title: "개정 노동조합법 시행 대비, 정부 현장안착 지원 통한 시행준비 만전", url: "https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=18983", publisher: "고용노동부", publishedAt: "2026-02-24", type: "official", license: "public", quote: "제2조제5호 노동쟁의와 관련한 부분에서는 노동쟁의의 대상이 되는 근로자 ‘배치전환’이 일상적으로 이루어지는 배치전환이 아닌 ‘구조조정에 따른 배치전환’임을 구체적으로 적시하여 현장의 혼선을 예방하였다." },
    { id: "src-manual", title: "노조법 2·3조 현장 안착을 위한 고용노동부장관 중앙노동위원장 공동 브리핑", url: "https://m.korea.kr/news/policyNewsView.do?newsId=156746581", publisher: "대한민국 정책브리핑·고용노동부", publishedAt: "2026-02-27", type: "official", license: "public", quote: "한편, 원청과의 교섭에 있어서 전체 하청노동자 중에서도 업무의 내용이나 특성, 근로조건, 이해관계 등이 다를 경우에는 개정 노조법 시행령에 따라 교섭단위를 합리적으로 분리하는 것도 가능합니다." },
    { id: "src-first-month", title: "노란봉투법 한달, 하청교섭요구 1천건↑…노동부 \"단계적 안착\"", url: "https://www.yna.co.kr/view/AKR20260410081300530", publisher: "연합뉴스", publishedAt: "2026-04-10", type: "press", license: "quotable", quote: "하청노조의 교섭요구에 대해 교섭요구 사실을 공고하며 교섭 절차에 들어간 원청 사업장은 총 33곳이다." },
    { id: "src-october", title: "노란봉투법 원청교섭 460곳 중 타결 3곳…절반은 절차 중단", url: "https://www.yna.co.kr/view/AKR20261012144300530", publisher: "연합뉴스", publishedAt: "2026-10-13", type: "press", license: "quotable", quote: "그러나 실제 원·하청 교섭이 완전 타결된 사업장은 3곳에 그쳤다." },
    { id: "src-litigation", title: "'노란봉투법' 시행 6개월…경남 곳곳 '사용자성' 공방 지속", url: "https://www.yna.co.kr/amp/view/AKR20260902137000052", publisher: "연합뉴스", publishedAt: "2026-09-02", type: "press", license: "quotable", quote: "그러나 한화오션은 지난 7월 서울행정법원에 중노위 재심판정 취소 소송과 집행정지를 신청해 사용자성 공방은 결국 법정으로 이어졌다." },
    { id: "src-business", title: "중소기업계, 노란봉투법 시행에 '우려'…\"보완책 마련해야\"", url: "https://www.yna.co.kr/amp/view/AKR20260310147400030", publisher: "연합뉴스", publishedAt: "2026-03-10", type: "press", license: "quotable", quote: "법상 사용자가 누구인지, 노동쟁의 대상이 되는 사업 경영상 결정이 어디까지 해당하는지가 불분명하다는 지적도 있다." },
    { id: "src-damages-criticism", title: "노란봉투법 10일 시행···무분별한 ‘손배 폭탄’ 줄어드나", url: "https://www.khan.co.kr/article/202603091630011", publisher: "경향신문", publishedAt: "2026-03-09", type: "press", license: "quotable", quote: "이에 반해 경영계는 불법 파업에 대한 억제력이 약해질 수 있다고 우려하고 있다." },
  ],
};

export const yellowEnvelope = achievementSchema.parse(raw);
