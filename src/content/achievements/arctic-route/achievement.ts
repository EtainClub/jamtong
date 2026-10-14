import { achievementSchema, type AchievementInput } from "@/content/schema";
import { MOF_2026, NANET_2025 } from "@/content/sources";

/**
 * 북극항로 — Sprint 1 검증용 스토리.
 *
 * 출처
 *  - `src-mof-2026`: 해양수산부 2026년도 업무계획 보도자료. 정책·일정·지원 규모.
 *  - `src-nanet-2025`: 국회도서관 Data&Law 2025-9호. 항로별 거리·운항일수.
 *  - `src-mof-arctic-return`: 해양수산부 2026-10-13 보도자료. 시범운항 실제 왕복 경과.
 *  - 기업 반응 씬: 한국경제·부산일보·문화일보·뉴스토마토·이데일리 보도, MOL·Ocean Conservancy
 *    자료, High North News·Loadstar·gCaptain·MarineLink 보도. 세 칸의 위치만 잼통의 판단이다.
 *  - 전망 씬: 아이뉴스24·뉴스토마토 보도, CHNL 2025 통계, IPCC 전망 보도. 업적이 아니라
 *    전망이므로 결론 두 claim만 INTERPRETATION이고 조건은 모두 출처의 말이다.
 *
 * 거리 수치의 전제 조건에 주의한다. 부산 출발 로테르담행 78,000톤 선박,
 * 7~10월 기준 분석값이다. 북극항로는 연중 통항이 아니므로 이 조건을 빼고
 * 숫자만 보여주면 오도가 된다. `comparisonNote`로 항상 함께 표시한다.
 *
 * 이 파일은 데이터만 담는다. 화면 구성은 features/ 아래 컴포넌트가 하드코딩으로 갖는다.
 */

const raw: AchievementInput = {
  id: "arctic-route",
  slug: "arctic-route",
  title: "북극항로",
  subtitle: "수에즈보다 36% 짧은 뱃길. 다만 얼음 때문에 1년 중 몇 달만 열린다",
  kicker: "주요 정책",
  categories: ["diplomacy", "region"],
  summary:
    "부산에서 유럽으로 가는 뱃길은 지금까지 수에즈 운하나 희망봉을 지나 남쪽으로 크게 돌아갔다. " +
    "북극을 가로지르면 로테르담까지 거리는 20,400km에서 13,000km로 줄어든다. " +
    "2026년 8월 22일 수출 화물을 실은 국내 컨테이너선이 부산을 떠나 20일 5시간 만에 영국 펠릭스토우에 닿았고, " +
    "로테르담·그단스크를 거쳐 다시 북극항로로 10월 11일 부산에 돌아왔다. 우리 선사 컨테이너선의 첫 북극항로 왕복이다. " +
    "다만 결빙 때문에 연중 4~5개월만 다닐 수 있다는 한계가 지적되고, 러시아 제재가 풀리는지에 따라 쓸 수 있는 범위가 달라진다. " +
    "배를 직접 움직여 두 항로가 어떻게 다른지 확인해 보라.",
  type: "achievement",
  publishStatus: "published",
  featured: true,
  sourceNote:
    "거리와 일수는 국회도서관이 인용한 한국해양수산개발원의 7~10월 기준 분석값입니다. " +
    "지원 조건과 계획은 해양수산부 2026년도 업무계획에서 왔고, 계획이 실제로 이행됐는지는 " +
    "시범운항 한 건 말고는 대조하지 못했습니다. 시범운항의 왕복 경과는 해양수산부 보도자료(2026-10-13)에서, " +
    "로테르담 입항 시각과 한계는 보도에서 왔습니다. 연료·비용 같은 운항 결과 수치는 아직 공개되지 않았습니다.",

  scenes: [
    {
      id: "route-map",
      kind: "route-map",
      heading: "부산에서 로테르담까지",
      lede:
        "북극 중심 지도입니다. 중심에서 멀어질수록 실제 거리도 멀어지므로, 두 항로의 길이를 눈으로 직접 비교할 수 있습니다. 스크롤하면 배가 항로를 따라 나아갑니다.",
      claimIds: ["claim-nsr-distance", "claim-suez-distance"],
      routes: [
        {
          id: "nsr",
          name: "북극항로",
          isBaseline: false,
          totalKm: 13000,
          totalDaysMin: 20,
          totalDaysMax: 24,
          claimId: "claim-nsr-distance",
          waypoints: [
            {
              id: "busan",
              name: "부산",
              lon: 129.04,
              lat: 35.1,
              cumulativeKm: 0,
              note: "출발. 2026년 8월 22일 첫 컨테이너선 시범운항이 여기서 출항해 10월 11일 돌아왔다.",
            },
            {
              id: "laperouse",
              name: "라페루즈 해협",
              lon: 142.0,
              lat: 45.8,
              cumulativeKm: 1200,
              note: "동해를 빠져나와 오호츠크해로 들어선다.",
            },
            {
              id: "bering",
              name: "베링 해협",
              lon: -169.0,
              lat: 65.8,
              cumulativeKm: 4100,
              note: "태평양을 벗어나 북극해로 진입하는 관문.",
            },
            {
              id: "east-siberian",
              name: "동시베리아해",
              lon: 165.0,
              lat: 71.0,
              cumulativeKm: 4850,
              note: "여기부터 결빙 구간이다. 쇄빙 능력과 극지 운항 경험이 필요해진다.",
            },
            {
              id: "laptev",
              name: "랍테프해",
              lon: 130.0,
              lat: 76.0,
              cumulativeKm: 6050,
              note: "북위 76도. 항로에서 북극점에 가장 가까워지는 구간.",
            },
            {
              id: "kara",
              name: "카라해",
              lon: 80.0,
              lat: 77.0,
              cumulativeKm: 7800,
              note: "러시아 북극권 연안. 제재 상황에 따라 운항 가능 여부가 갈리는 구간이다.",
            },
            {
              id: "barents",
              name: "바렌츠해",
              lon: 40.0,
              lat: 73.0,
              cumulativeKm: 9200,
              note: "난류의 영향으로 연중 결빙이 적다. 사실상 북극 구간의 출구다.",
            },
            {
              id: "norwegian",
              name: "노르웨이해",
              lon: 5.0,
              lat: 66.0,
              cumulativeKm: 11100,
              note: "북극해를 벗어나 유럽 항로로 합류한다.",
            },
            {
              id: "rotterdam",
              name: "로테르담",
              lon: 4.48,
              lat: 51.92,
              cumulativeKm: 13000,
              note: "도착. 유럽 최대 컨테이너 항만. 시범운항선은 영국 펠릭스토우를 먼저 들른 뒤 9월 13일 이곳에 입항했다.",
            },
          ],
        },
        {
          id: "suez",
          name: "수에즈 항로",
          isBaseline: true,
          totalKm: 20400,
          totalDaysMin: 30,
          totalDaysMax: 34,
          claimId: "claim-suez-distance",
          waypoints: [
            { id: "busan-s", name: "부산", lon: 129.04, lat: 35.1, cumulativeKm: 0, note: "출발." },
            {
              id: "taiwan",
              name: "대만 해협",
              lon: 120.0,
              lat: 24.0,
              cumulativeKm: 1400,
              note: "동중국해를 따라 남하한다.",
            },
            {
              id: "malacca",
              name: "말라카 해협",
              lon: 100.3,
              lat: 2.0,
              cumulativeKm: 3900,
              note: "세계 물동량이 집중되는 병목 구간.",
            },
            { id: "indian", name: "인도양", lon: 70.0, lat: 8.0, cumulativeKm: 7000, note: "적도 부근을 가로지른다." },
            {
              id: "aden",
              name: "아덴만",
              lon: 45.0,
              lat: 12.5,
              cumulativeKm: 9750,
              note: "해적 위험 구간으로 별도의 보안 비용이 든다.",
            },
            { id: "redsea", name: "홍해", lon: 38.0, lat: 22.0, cumulativeKm: 10950, note: "좁고 긴 내해를 북상한다." },
            {
              id: "suez-canal",
              name: "수에즈 운하",
              lon: 32.5,
              lat: 30.5,
              cumulativeKm: 11850,
              note: "통항료가 발생하고, 정체 시 전 구간이 지연된다.",
            },
            { id: "med", name: "지중해", lon: 15.0, lat: 36.0, cumulativeKm: 13450, note: "지중해를 서쪽으로 횡단한다." },
            { id: "gibraltar", name: "지브롤터", lon: -5.6, lat: 36.0, cumulativeKm: 15200, note: "대서양으로 나선다." },
            { id: "biscay", name: "비스케이만", lon: -8.0, lat: 46.0, cumulativeKm: 16400, note: "이베리아 반도를 돌아 북상." },
            { id: "rotterdam-s", name: "로테르담", lon: 4.48, lat: 51.92, cumulativeKm: 20400, note: "도착." },
          ],
        },
      ],

    },
    {
      id: "route-compare",
      kind: "route-compare",
      heading: "세 갈래 길",
      lede:
        "같은 목적지에 닿는 세 항로를 나란히 놓으면 차이가 분명해집니다. 막대 길이는 거리에 정비례합니다.",
      claimIds: ["claim-route-comparison"],
      comparisons: [
        {
          id: "cmp-nsr",
          name: "북극항로 (북동항로)",
          km: 13000,
          daysMin: 20,
          daysMax: 24,
          highlight: true,
          claimId: "claim-route-comparison",
        },
        {
          id: "cmp-suez",
          name: "수에즈 운하",
          km: 20400,
          daysMin: 30,
          daysMax: 34,
          highlight: false,
          claimId: "claim-route-comparison",
        },
        {
          id: "cmp-cape",
          name: "희망봉",
          km: 24000,
          daysMin: 36,
          daysMax: 40,
          highlight: false,
          claimId: "claim-route-comparison",
        },
      ],

    note:
    "부산항에서 출발한 로테르담행 78,000톤 선박을 대상으로 7~10월 기준으로 분석한 값이다. " +
    "북극항로는 결빙으로 연중 통항이 어려우므로, 이 수치는 통항 가능 기간의 조건부 비교다.",
    },
    {
      id: "reactions",
      kind: "reactions",
      heading: "기업들은 어떻게 움직이나",
      lede:
        "정부가 한 일이 아니라 시장의 반응입니다. 한국·일본·중국·미국 기업이 북극항로에 뛰어드는지, 지켜보는지, 거리를 두는지 모았습니다.",
      claimIds: ["claim-co-big-carriers", "claim-co-pledge", "claim-co-sealegend"],
      reactions: {
        asOf: "2026-10-14",
        axis: { out: "거리를 둔다", watch: "지켜본다", in: "뛰어든다" },
        companies: [
          {
            id: "panstar",
            name: "팬스타라인닷컴",
            country: "KR",
            sector: "해운",
            stance: "in",
            action: "시범운항 공모에 홀로 응모",
            summary:
              "정부 시범운항 공모에 유일하게 응모했다. HMM이 갖고 있던 컨테이너선 몸바사호를 사들여 팬스타 아크로호로 이름을 바꾸고 북극항로를 왕복했다.",
            claimIds: ["claim-co-panstar", "claim-trial-return"],
          },
          {
            id: "hmm-panocean",
            name: "HMM·팬오션",
            country: "KR",
            sector: "해운",
            stance: "watch",
            action: "시범운항 공모 불참",
            summary:
              "대형 선사는 시범운항 공모에 응모하지 않았다. 해운업계는 정부의 지원 의지에도 신중하며, 내빙선에 맞는 특화 화물을 찾는 것이 과제라고 본다.",
            claimIds: ["claim-co-big-carriers", "claim-co-industry-cautious"],
          },
          {
            id: "hd-hhi",
            name: "HD현대중공업",
            country: "KR",
            sector: "조선",
            stance: "in",
            action: "스웨덴 쇄빙전용선 수주",
            summary:
              "2026년 4월 스웨덴 해사청과 약 5,148억 원 규모 쇄빙전용선 1척 건조 계약을 맺었다. 2029년 인도할 계획이다.",
            claimIds: ["claim-co-hd"],
          },
          {
            id: "hanwha-ocean",
            name: "한화오션",
            country: "KR",
            sector: "조선",
            stance: "in",
            action: "차세대 쇄빙연구선 건조",
            summary:
              "Arc7급 쇄빙 LNG 운반선 21척을 지은 경험이 있고, 정부 차세대 쇄빙연구선(PC3급)을 2029년까지 짓는다. 미국 해안경비대의 북극 안보쇄빙선 계약은 핀란드 조선소에 돌아갔다.",
            claimIds: ["claim-co-hanwha"],
          },
          {
            id: "samsung-heavy",
            name: "삼성중공업",
            country: "KR",
            sector: "조선",
            stance: "watch",
            was: "in",
            action: "러시아 쇄빙선 사업 차질",
            summary:
              "러시아 즈베즈다 조선소와 하던 쇄빙선 사업이 전쟁 장기화로 차질을 빚어, 계약 해지와 선수금 반환을 두고 국제중재를 하고 있다.",
            claimIds: ["claim-co-samsung"],
          },
          {
            id: "mol",
            name: "상선미쓰이 (MOL)",
            country: "JP",
            sector: "해운·에너지",
            stance: "watch",
            was: "in",
            action: "쇄빙 LNG선 선두 → 제재로 용선 철회",
            summary:
              "2018년 세계 첫 쇄빙 LNG선을 완성해 여름철 북동항로로 러시아 LNG를 중국에 실어 나르며 선두가 되겠다고 했다. 2024년에는 미국·유럽 제재로 한화에 발주한 쇄빙 LNG선 3척을 Arctic LNG 2에 예정대로 쓸 수 없다고 밝혔다.",
            claimIds: ["claim-co-mol"],
          },
          {
            id: "sea-legend",
            name: "Sea Legend (海傳)",
            country: "CN",
            sector: "해운",
            stance: "in",
            action: "2026년 북극 급행 8항차",
            summary:
              "2026년 8~10월 닝보–펠릭스토우 북극 급행을 8항차 운항한다. 일정상 21일이 걸린다. 2025년에는 북동항로로 중국–영국 첫 직항 컨테이너 운송을 마쳤다.",
            claimIds: ["claim-co-sealegend"],
          },
          {
            id: "newnew",
            name: "NewNew Shipping",
            country: "CN",
            sector: "해운",
            stance: "in",
            action: "2026년 운항 확대 예고",
            summary:
              "중국은 2025년 북동항로로 아시아–유럽 컨테이너선을 14회 띄웠다(2023년 7회, 2024년 11회). NewNew Shipping Line은 Sea Legend와 함께 2026년 운항을 늘리겠다고 밝혔다.",
            claimIds: ["claim-co-newnew"],
          },
          {
            id: "pledge",
            name: "나이키·갭·컬럼비아·PVH",
            country: "US",
            sector: "화주",
            stance: "out",
            action: "북극항로 이용 안 한다고 서약",
            summary:
              "2019년 나이키와 해양보존단체 Ocean Conservancy가 만든 서약에 따라 북극해로 화물을 보내지 않겠다고 약속했다. CMA CGM·MSC·하팍로이드·에버그린 같은 대형 선사도 첫 서명사였고, 2026년 보도도 주요 화주의 참여를 전한다.",
            claimIds: ["claim-co-pledge"],
          },
          {
            id: "bollinger",
            name: "볼린저 조선소",
            country: "US",
            sector: "조선(안보)",
            stance: "in",
            action: "해안경비대 대형 쇄빙선 건조",
            summary:
              "상업 항로가 아니라 안보용이다. 미국 해안경비대의 첫 대형 극지 쇄빙선 Polar Sentinel을 짓고 있고, 2030년 인도를 목표로 한다고 의회에 밝혔다(GAO는 2033년 예상).",
            claimIds: ["claim-co-bollinger"],
          },
        ],
        note:
          "세 칸의 위치는 잼통이 출처에 적힌 행동(응모·수주·서약·계약 철회)을 보고 정했습니다. 흐린 자국은 예전 자리입니다. " +
          "일본 NYK·미쓰이물산과 중국 COSCO의 최근 입장은 공개 자료로 확인하지 못해 싣지 않았습니다.",
      },
    },
    {
      id: "outlook",
      kind: "outlook",
      heading: "앞으로 어떻게 될까 — 두 갈래 전망",
      lede:
        "여기서부터는 업적이 아니라 전망입니다. 확인된 첫 왕복에서 출발해, 조건에 따라 상업 항로로 자라는 길과 시범운항에 머무는 길을 나란히 그렸습니다.",
      claimIds: ["claim-outlook-positive", "claim-outlook-negative"],
      outlook: {
        asOf: "2026-10-14",
        notice:
          "이 섹션은 이미 이룬 일이 아니라 앞으로의 전망입니다. 2026년 10월 14일까지 확인된 사실에서 출발해, " +
          "조건에 따라 갈라지는 두 갈래를 잼통이 정리했습니다. 조건마다 근거를 달았지만 갈래의 결론은 예측이며, " +
          "어느 쪽도 보장되지 않습니다. 운항 비용 자료가 아직 공개되지 않아 금액 추정은 싣지 않았습니다.",
        now: {
          label: "지금 · 2026년 10월",
          text: "컨테이너선 한 척이 여름철 북동항로로 부산과 유럽을 처음 왕복했다.",
          claimId: "claim-trial-return",
        },
        scenarios: [
          {
            id: "positive",
            tone: "positive",
            label: "긍정적 시나리오",
            headline: "여름철 정기 항로로 자리 잡고 조선·에너지로 번진다",
            factors: [
              {
                id: "p-sanction",
                label: "제재 해제",
                text: "러시아 제재가 풀려 북동항로로 컨테이너·LNG 수송을 늘린다. 해양수산부 계획의 '해제 시' 갈래다.",
                claimId: "claim-russia",
              },
              {
                id: "p-days",
                label: "열흘의 값",
                text: "수에즈보다 약 10일 빠르다. 홍해가 막혀 희망봉으로 돌아야 하는 해에는 차이가 약 16일로 벌어진다.",
                claimId: "claim-route-comparison",
              },
              {
                id: "p-fuel",
                label: "연료 30%",
                text: "선사는 연료 사용량을 약 30% 줄일 수 있다고 예상한다. 이 예상이 실측 데이터로 확인되어야 한다.",
                claimId: "claim-panstar-forecast",
              },
              {
                id: "p-season",
                label: "길어지는 운항기간",
                text: "IPCC는 2050년까지 북동항로의 항해 적합일이 연 최대 125일로 늘 것으로 전망했다.",
                claimId: "claim-season-2050",
              },
              {
                id: "p-support",
                label: "초기 지원",
                text: "항만시설사용료 50~100% 감면, 선박금융 금리 1%p 인하, LTV 90% 상향이 첫 몇 해의 부담을 줄인다.",
                claimId: "claim-incentives",
              },
            ],
            stages: [
              {
                id: "p-s1",
                when: "2027~2028",
                text: "후속 시범운항이 이어지고 연료 소비·선체 거동 데이터가 쌓인다.",
                claimId: "claim-next-voyage",
              },
              {
                id: "p-s2",
                when: "2030",
                text: "정부 구상대로 정기 상업화에 들어선다. 쇄빙 컨테이너선 건조기술과 극지 해기사가 갖춰진다.",
                claimId: "claim-regular-2030",
              },
              {
                id: "p-s3",
                when: "2030년대",
                text: "운항기간이 길어지고, 해양수산부가 기대하는 조선·금융 등 전후방 산업이 함께 자란다.",
                claimId: "claim-shortest-route",
              },
            ],
            outcome:
              "수에즈 항로를 대신하지는 못해도, 여름철에 함께 쓰는 빠른 길로 자리 잡는다. 운임 절감보다 극지 선박 건조와 에너지 수송 같은 산업 기회가 더 큰 몫이 된다.",
            claimId: "claim-outlook-positive",
          },
          {
            id: "negative",
            tone: "negative",
            label: "부정적 시나리오",
            headline: "몇 년에 한 번 다니는 실험 항로에 머문다",
            factors: [
              {
                id: "n-sanction",
                label: "제재 지속",
                text: "제재가 이어지면 해양수산부도 북서항로 등 대안을 검토하겠다고 했다. 이번 시범운항이 지난 북동항로가 막히는 갈래다.",
                claimId: "claim-russia",
              },
              {
                id: "n-season",
                label: "4~5개월",
                text: "결빙 때문에 연중 4~5개월만 다닐 수 있고 보험료가 높다.",
                claimId: "claim-limits",
              },
              {
                id: "n-ice",
                label: "해마다 다른 얼음",
                text: "2025년 여름·가을 북동항로의 얼음 조건은 불리했다. 열리는 기간을 미리 장담하기 어렵다.",
                claimId: "claim-nsr-2025-ice",
              },
              {
                id: "n-size",
                label: "작은 배의 원가",
                text: "유럽 노선에는 1만 8천~2만 3천TEU급이 다니지만 북극항로에 쓸 수 있는 배는 4~5천TEU급에 그친다는 업계 지적이 있다.",
                claimId: "claim-ship-size",
              },
              {
                id: "n-load",
                label: "다 채우지 못한 배",
                text: "첫 항해는 2,758TEU급 배에 수출 화물 약 737TEU를 싣고 떠났다.",
                claimId: "claim-trial-load",
              },
              {
                id: "n-china",
                label: "앞서 가는 중국",
                text: "2025년 북동항로 컨테이너선 통과는 15회로 늘었고, 항로의 동쪽 끝은 중국이 주도한다.",
                claimId: "claim-nsr-2025",
              },
            ],
            stages: [
              {
                id: "n-s1",
                when: "2027~2028",
                text: "후속 시범운항은 이어지지만, 꾸준한 물동량과 왕복 화물을 확보하지 못해 정기 운항 결정이 미뤄진다.",
                claimId: "claim-backhaul",
              },
              {
                id: "n-s2",
                when: "2030",
                text: "정기 상업화 목표 시점. 제재가 이어지면 북서항로 시범운항 같은 대안 검토로 무게가 옮겨 간다.",
                claimId: "claim-russia",
              },
              {
                id: "n-s3",
                when: "2030년대",
                text: "정부 지원으로 간간이 다니는 실험 항로로 남고, 상업 운항은 앞서 자리 잡은 쪽이 가져간다.",
                claimId: "claim-outlook-negative",
              },
            ],
            outcome:
              "북극항로는 열리는 해에만 지원을 받아 다니는 길로 남는다. 들인 지원에 비해 상업적 성과가 작다는 평가를 받을 수 있다.",
            claimId: "claim-outlook-negative",
          },
        ],
      },
    },
  ],

  /**
   * ⑦ 쇼츠. 유튜브에 올린 뒤 id만 적는다.
   *
   *   youtube.com/shorts/AbCdEfGhIjK  →  youtubeId: "AbCdEfGhIjK"
   *
   * claimIds는 영상에서 말한 내용의 근거다. 짧을수록 맥락이 잘리므로
   * 근거 없는 쇼츠는 스키마가 거부한다.
   *
   *   shorts: [
   *     {
   *       id: "short-arctic-01",
   *       title: "부산에서 유럽까지, 7,400km를 줄인다",
   *       summary: "수에즈 항로와 나란히 놓고 봅니다.",
   *       youtubeId: "AbCdEfGhIjK",
   *       durationSec: 42,
   *       claimIds: ["claim-reduction"],
   *       publishedAt: "2026-09-19",
   *     },
   *   ],
   */
  shorts: [
    {
      id: "short-arctic-01",
      title: "잼통의 북극항로",
      summary: "부산에서 유럽까지, 북극을 가로지르면 뱃길이 얼마나 짧아지는지 1분 안에 봅니다.",
      youtubeId: "hcHv3igHnBw",
      claimIds: ["claim-reduction", "claim-route-comparison"],
      publishedAt: "2026-09-19",
    },
  ],

  // 카드에 실을 한 숫자. 화면 순서상 첫 항목은 건조 지원금이지만,
  // 이 스토리를 한 줄로 말하면 "얼마나 짧아지나"다.
  headlineKeyNumberId: "kn-distance",

  keyNumbers: [
    {
      id: "kn-icebreaker",
      label: "극지항해 선박 건조 지원",
      prefix: "최대",
      value: "110",
      unit: "억 원",
      caption: "쇄빙선 등 1척당",
      claimId: "claim-icebreaker-support",
    },
    {
      id: "kn-portfee",
      label: "항만시설사용료 감면",
      value: "50~100",
      unit: "%",
      caption: "북극 운항 선사 대상",
      claimId: "claim-incentives",
    },
    {
      id: "kn-ltv",
      label: "선박금융 담보인정비율",
      value: "70 → 90",
      unit: "%",
      caption: "투자금리도 1%p 인하",
      claimId: "claim-incentives",
    },
    {
      id: "kn-distance",
      label: "운항 거리 단축",
      prefix: "약",
      value: "36",
      unit: "%",
      caption: "20,400km → 13,000km",
      claimId: "claim-reduction",
    },
    {
      id: "kn-km",
      label: "단축 거리",
      prefix: "약",
      value: "7,400",
      unit: "km",
      caption: "수에즈 항로 대비",
      claimId: "claim-reduction",
    },
    {
      id: "kn-days",
      label: "운항 일수",
      value: "30~34 → 20~24",
      unit: "일",
      caption: "7~10월 기준",
      claimId: "claim-route-comparison",
    },
    {
      id: "kn-trial",
      label: "시범운항 실측 · 부산 → 펠릭스토우",
      value: "20일 5시간",
      caption: "첫 유럽 기항지 도착까지",
      claimId: "claim-trial-voyage",
    },
  ],

  timeline: [
    {
      id: "ev-relocation",
      date: "2025",
      datePrecision: "year",
      title: "해양수산부 부산 이전, 북극항로추진본부 출범",
      summary:
        "새 정부 출범 후 해양수산부가 부산청사로 이전을 완료하고 북극항로추진본부를 새로 출범시켰다. 해양수도권 조성의 기반을 마련한 단계다.",
      claimIds: ["claim-hq-relocation"],
    },
    {
      id: "ev-strategy",
      date: "2026-06",
      displayDate: "2026 상반기",
      datePrecision: "month",
      title: "해양수도권 육성 전략(안) 제시",
      summary:
        "동남권에 행정·사법·금융·기업 인프라를 집적시켜 수도권에 필적하는 해양수도권을 조성하는 전략안을 제시한다. 동남권 투자공사 설립 지원과 해양진흥공사 자본금 확충이 함께 추진된다.",
      claimIds: ["claim-maritime-capital"],
    },
    {
      id: "ev-trial",
      date: "2026-09-13",
      displayDate: "2026년 8월 22일 ~ 9월 13일",
      datePrecision: "day",
      title: "부산 → 유럽 컨테이너선 시범운항",
      summary:
        "국내 컨테이너선 팬스타 아크로호(2,758TEU급)가 수출 화물을 싣고 8월 22일 부산신항을 떠나 북동항로를 거쳐 20일 5시간 만에 영국 펠릭스토우에 도착했고, 9월 13일 로테르담에 입항했다.",
      claimIds: ["claim-trial-voyage", "claim-nsr-distance"],
    },
    {
      id: "ev-return",
      date: "2026-10-11",
      datePrecision: "day",
      title: "북극항로로 부산 귀항, 첫 왕복 완료",
      summary:
        "로테르담에 이어 폴란드 그단스크에 기항한 뒤 다시 북동항로로 10월 11일 부산항에 돌아왔다. 우리 선사 컨테이너선이 북극항로로 한국과 유럽을 왕복한 것은 처음이다. 해양수산부는 후속 시범운항과 상업 운항을 준비하겠다고 밝혔다.",
      claimIds: ["claim-trial-return", "claim-next-voyage"],
    },
    {
      id: "ev-2030",
      date: "2030",
      datePrecision: "year",
      title: "쇄빙 컨테이너선 건조기술 개발 · 극지 해기사 양성",
      summary:
        "2030년까지 쇄빙 컨테이너선 건조기술 등을 개발하고 전문인력인 극지 해기사를 본격 양성한다.",
      claimIds: ["claim-2030-tech"],
    },
  ],

  /**
   * 관계도 — 기관과 사업만으로 구성한다. 실존 개인은 올리지 않는다.
   * 모든 Edge는 이 스토리의 claim을 근거로 갖는다.
   */
  /**
   * 쉬운 설명. 장면마다 근거를 따로 매단다 — 쉽게 쓸수록 한 문장이 감당하는
   * 주장이 커지기 때문이다.
   */
  eli5: {
    intro:
      "부산에서 유럽까지 배로 짐을 보내는 길이 바뀌려고 해요. 여섯 장면으로 나눠서 볼게요.",
    scenes: [
      {
        id: "e-suez",
        title: "지금은 아래로 크게 돌아가요",
        say: "배가 남쪽으로 내려갔다가 수에즈 운하를 지나 유럽으로 올라가요. 길이 아주 길어요.",
        art: "suez-long",
        fact: { value: "20,400 km · 30~34일", tone: "warm" },
        claimIds: ["claim-suez-distance"],
      },
      {
        id: "e-arctic",
        title: "북극 위로 가면 가까워요",
        say: "지구 꼭대기를 가로지르면 훨씬 빨리 도착해요. 위로 넘어가는 게 지름길이에요.",
        art: "arctic-short",
        fact: { value: "13,000 km · 20~24일", tone: "ice" },
        claimIds: ["claim-nsr-distance"],
      },
      {
        id: "e-compare",
        title: "얼마나 줄어드냐면요",
        say: "길이는 7,400km, 시간은 열흘쯤 줄어요. 기름값도 그만큼 아껴요.",
        art: "compare-bars",
        fact: { value: "약 36% 단축", tone: "ice" },
        claimIds: ["claim-reduction"],
      },
      {
        id: "e-season",
        title: "그런데 바다가 얼어요",
        say: "북극 바다는 대부분 얼어 있어요. 얼음이 녹는 여름에만 배가 지나갈 수 있어요.",
        art: "season",
        fact: { value: "7월 ~ 10월", tone: "ice" },
        claimIds: ["claim-route-comparison"],
      },
      {
        id: "e-icebreaker",
        title: "얼음 깨는 배가 필요해요",
        say: "두꺼운 얼음을 밀고 갈 수 있는 특별한 배를 쇄빙선이라고 해요. 정부가 만드는 값을 도와줘요.",
        art: "icebreaker",
        fact: { value: "배 한 척당 최대 110억 원", tone: "ice" },
        claimIds: ["claim-icebreaker-support"],
      },
      {
        id: "e-trial",
        title: "2026년에 한번 가봤어요",
        say: "우리나라 회사 배가 수출 짐을 싣고 북극 위로 유럽까지 갔다가, 같은 길로 부산에 돌아왔어요. 첫 유럽 항구까지 20일 걸렸어요.",
        art: "trial-voyage",
        fact: { value: "갈 때 20일 5시간 · 10월 11일 귀항", tone: "ice" },
        claimIds: ["claim-trial-voyage", "claim-trial-return"],
      },
    ],
    caveat: {
      text:
        "아직 정해지지 않은 것도 있어요. 얼음 때문에 1년에 4~5개월만 다닐 수 있고, 북극 바다의 일부는 러시아를 지나가야 해서 러시아에 대한 제재가 어떻게 되느냐에 따라 이 길을 쓸 수 있을지가 달라져요.",
      claimIds: ["claim-russia", "claim-limits"],
    },
  },

  graph: {
    note:
      "해양수산부 「2026년도 업무계획」·시범운항 보도자료와 국회도서관 『Data&Law』에서 확인된 관계만 그렸다. " +
      "연표를 움직이면 그 시점까지 성립한 관계만 남는다.",
    entities: [
      { id: "mof", name: "해양수산부", kind: "government", isFocus: true },
      { id: "arctic-hq", name: "북극항로추진본부", kind: "organization" },
      { id: "nsr", name: "북극항로", kind: "project" },
      { id: "shipper", name: "국내 민간 선사", kind: "company" },
      { id: "busan", name: "부산항", kind: "place" },
      { id: "rotterdam", name: "로테르담항", kind: "place" },
      { id: "felixstowe", name: "펠릭스토우항", kind: "place" },
      { id: "russia", name: "러시아", kind: "country" },
      { id: "kmi", name: "해양수산개발원", kind: "organization" },
      { id: "tech2030", name: "쇄빙선 기술 · 해기사", kind: "project" },
      { id: "capital", name: "해양수도권", kind: "project" },
    ],
    relations: [
      {
        id: "r-hq",
        fromId: "mof",
        toId: "arctic-hq",
        label: "북극항로추진본부를 새로 출범시켰다.",
        startDate: "2025",
        startPrecision: "year",
        assertionType: "FACT",
        claimIds: ["claim-hq-relocation"],
      },
      {
        id: "r-busan-move",
        fromId: "mof",
        toId: "busan",
        label: "부산청사로 이전을 완료했다.",
        startDate: "2025",
        startPrecision: "year",
        assertionType: "FACT",
        claimIds: ["claim-hq-relocation"],
      },
      {
        id: "r-kmi",
        fromId: "kmi",
        toId: "nsr",
        label: "부산–로테르담 항로별 거리·운항일수를 분석했다. 북극항로 약 13,000km, 20~24일.",
        startDate: "2025-08",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-route-comparison"],
      },
      {
        id: "r-capital",
        fromId: "mof",
        toId: "capital",
        label: "해양수도권 육성 전략(안)을 제시한다.",
        startDate: "2026-06",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-maritime-capital"],
      },
      {
        id: "r-capital-busan",
        fromId: "capital",
        toId: "busan",
        label: "동남권에 행정·사법·금융·기업 인프라를 집적시킨다.",
        startDate: "2026-06",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-maritime-capital"],
      },
      {
        id: "r-support",
        fromId: "mof",
        toId: "shipper",
        label: "극지항해 선박 건조를 최대 110억 원까지 지원한다.",
        startDate: "2026",
        startPrecision: "year",
        assertionType: "FACT",
        claimIds: ["claim-icebreaker-support"],
      },
      {
        id: "r-incentive",
        fromId: "mof",
        toId: "shipper",
        label: "항만시설사용료 50~100% 감면, 선박금융 금리 1%p 인하, LTV 70→90% 상향.",
        startDate: "2026",
        startPrecision: "year",
        assertionType: "FACT",
        claimIds: ["claim-incentives"],
      },
      {
        id: "r-russia",
        fromId: "russia",
        toId: "nsr",
        label:
          "제재가 해제되면 러시아를 경유하는 북동항로로 수송을 확대하고, 지속되면 북서항로 등 대안을 검토한다.",
        startDate: "2026",
        startPrecision: "year",
        assertionType: "FACT",
        claimIds: ["claim-russia"],
      },
      {
        id: "r-trial",
        fromId: "shipper",
        toId: "nsr",
        label: "수출 화물을 실은 컨테이너선으로 북극항로 시범운항을 했다. 출항 20일 5시간 만에 펠릭스토우, 22일 만에 로테르담에 닿았다.",
        startDate: "2026-08-22",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-trial-voyage"],
      },
      {
        id: "r-origin",
        fromId: "busan",
        toId: "nsr",
        label: "시범운항의 기점.",
        startDate: "2026-08-22",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-trial-voyage"],
      },
      {
        id: "r-dest",
        fromId: "nsr",
        toId: "rotterdam",
        label: "시범운항의 두 번째 유럽 기항지. 해양수산부는 북극항로를 아시아와 유럽을 잇는 최단거리 항로로 본다.",
        startDate: "2026-08-22",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-trial-voyage", "claim-shortest-route"],
      },
      {
        id: "r-first-port",
        fromId: "nsr",
        toId: "felixstowe",
        label: "시범운항의 첫 유럽 기항지. 부산 출항 20일 5시간 만에 도착했다.",
        startDate: "2026-08-22",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-trial-voyage"],
      },
      {
        id: "r-return",
        fromId: "nsr",
        toId: "busan",
        label: "로테르담·그단스크를 거쳐 다시 북동항로로 부산에 돌아왔다. 첫 왕복.",
        startDate: "2026-10-11",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-trial-return"],
      },
      {
        id: "r-tech",
        fromId: "mof",
        toId: "tech2030",
        label: "2030년까지 쇄빙 컨테이너선 건조기술을 개발하고 극지 해기사를 양성한다.",
        startDate: "2030",
        startPrecision: "year",
        assertionType: "FACT",
        claimIds: ["claim-2030-tech"],
      },
      {
        id: "r-tech-shipper",
        fromId: "tech2030",
        toId: "shipper",
        label: "확보된 기술과 인력이 선사의 극지 운항 역량으로 이어진다.",
        startDate: "2030",
        startPrecision: "year",
        assertionType: "INTERPRETATION",
        claimIds: ["claim-2030-tech"],
      },
    ],
  },

  counterpoints: [
    {
      id: "ar-cp-season",
      question: "1년 내내 쓸 수 있는 길인가?",
      response:
        "아니다. 위의 거리·일수는 7~10월 기준 분석값이다. 결빙 때문에 연중 4~5개월만 운항할 수 있고 보험료가 높다는 한계가 지적된다. 그래서 이 항로는 수에즈 항로를 대신하는 길이 아니라, 열리는 기간에 함께 쓰는 길에 가깝다.",
      claimIds: ["claim-route-comparison", "claim-limits"],
    },
    {
      id: "ar-cp-russia",
      question: "러시아 바다를 지나는데, 제재 문제는 없나?",
      response:
        "이번 시범운항은 러시아 연안을 따라가는 북동항로로 갔다. 해양수산부 계획도 제재에 따라 갈린다 — 제재가 풀리면 북동항로 수송을 늘리고, 이어지면 북서항로 등 대안을 검토하겠다고 밝혔다. 제재가 어떻게 될지는 이 위키가 말할 수 없고, 그만큼 이 항로의 쓰임새도 아직 정해지지 않았다.",
      claimIds: ["claim-trial-voyage", "claim-russia"],
    },
    {
      id: "ar-cp-once",
      question: "한 번 가 봤다고 상업 항로가 된 것인가?",
      response:
        "아니다. 배 한 척이 한 번 유럽을 다녀왔다. 이것으로 확인된 것은 수출 화물을 실은 컨테이너선이 여름철에 이 길로 왕복할 수 있고, 부산에서 첫 유럽 항구까지 20일 5시간이 걸렸다는 것까지다. 연료·비용 같은 운항 결과 수치는 아직 공개되지 않았다. 해양수산부도 이번 항해를 바탕으로 후속 시범운항과 상업 운항을 '준비'하겠다고 밝힌 단계다. 정기 항로가 되려면 운항 가능 기간과 보험료 문제가 남아 있다.",
      claimIds: ["claim-trial-voyage", "claim-trial-return", "claim-next-voyage", "claim-limits"],
    },
  ],

  claims: [
    {
      id: "claim-shortest-route",
      text:
        "해양수산부는 북극항로를 아시아와 유럽을 연결하는 최단거리 항로로서, 물류비용을 절감하고 조선·금융 등 전후방 산업이 동반 성장할 수 있는 기회로 본다.",
      assertionType: "CLAIM",
      assertedBy: "해양수산부",
      sourceIds: ["src-mof-2026"],
      verified: true,
    },
    {
      id: "claim-trial-voyage",
      text:
        "해양수산부는 2026년도 업무계획에서 하반기에 국내 민간 선사의 컨테이너선으로 부산~로테르담 북극항로 시범운항을 추진한다고 밝혔다. 국내 컨테이너선 팬스타 아크로호(2,758TEU급)는 실제 수출 컨테이너 화물을 싣고 2026년 8월 22일 21시경 부산신항을 출항해 북동항로를 거쳐 20일 5시간 만에 영국 펠릭스토우에 도착했고, 9월 13일 로테르담에 입항했다. 부산 출항 22일 만이다.",
      assertionType: "FACT",
      sourceIds: ["src-mof-2026", "src-mof-arctic-return", "src-seoul-arctic-depart", "src-fn-arctic-arrive"],
      verified: true,
    },
    {
      id: "claim-trial-return",
      text:
        "팬스타 아크로호는 로테르담과 폴란드 그단스크에 차례로 기항한 뒤 다시 북동항로를 거쳐 2026년 10월 11일 부산항으로 돌아왔다. 우리 선사의 컨테이너선이 북극항로로 한국과 유럽을 왕복한 것은 이번이 처음이다.",
      assertionType: "FACT",
      sourceIds: ["src-mof-arctic-return"],
      verified: true,
    },
    {
      id: "claim-next-voyage",
      text:
        "해양수산부는 이번 항해에서 얻은 경험과 데이터를 바탕으로 후속 시범운항과 상업 운항을 준비하고, 북극항로를 국가 장기 과제로 추진하겠다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "해양수산부",
      sourceIds: ["src-mof-arctic-return"],
      verified: true,
    },
    {
      id: "claim-icebreaker-support",
      text: "쇄빙선 등 극지항해 선박을 건조하는 경우 최대 110억 원까지 지원한다.",
      assertionType: "FACT",
      sourceIds: ["src-mof-2026"],
      verified: true,
    },
    {
      id: "claim-incentives",
      text:
        "북극 운항 선사에 항만시설사용료 50~100% 감면, 선박금융 투자금리 1%p 인하, 담보인정비율(LTV) 최대 70%에서 90%로 상향 등의 혜택을 제공한다.",
      assertionType: "FACT",
      sourceIds: ["src-mof-2026"],
      verified: true,
    },
    {
      id: "claim-hq-relocation",
      text:
        "새 정부 출범 후 해양수산부는 부산 이전을 완료하고 북극항로추진본부를 새로 출범시켰다.",
      assertionType: "FACT",
      sourceIds: ["src-mof-2026"],
      verified: true,
    },
    {
      id: "claim-maritime-capital",
      text: "해양수산부는 2026년도 업무계획에서 2026년 상반기 중 '해양수도권 육성 전략(안)'을 제시하겠다고 밝혔다. 이 업적 기준일까지 발표 여부는 대조하지 못했다.",
      assertionType: "FACT",
      sourceIds: ["src-mof-2026"],
      verified: true,
    },
    {
      id: "claim-2030-tech",
      text: "해양수산부는 2030년까지 쇄빙 컨테이너선 건조기술 등을 개발하고 극지 해기사를 본격적으로 양성하겠다는 계획을 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-mof-2026"],
      verified: true,
    },
    {
      id: "claim-russia",
      text:
        "해양수산부는 러시아 제재가 해제되는 경우 북동항로를 통한 컨테이너·LNG 수송 확대를 추진하고, 제재가 지속될 경우 북서항로 시범운항 등 대안을 검토하겠다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-mof-2026"],
      verified: true,
    },

    {
      id: "claim-route-comparison",
      text:
        "한국해양수산개발원이 부산항에서 출발한 로테르담행 78,000톤 선박을 대상으로 7~10월 기준 분석한 결과, 북극항로(북동항로)는 약 13,000km·20~24일, 수에즈 운하 경유는 약 20,400km·30~34일, 희망봉 경유는 약 24,000km·36~40일로 나타났다.",
      assertionType: "FACT",
      sourceIds: ["src-nanet-2025"],
      verified: true,
    },
    {
      id: "claim-nsr-distance",
      text: "부산에서 로테르담까지 북극항로(북동항로) 경유 거리는 약 13,000km, 소요 시간은 약 20~24일이다.",
      assertionType: "FACT",
      sourceIds: ["src-nanet-2025"],
      verified: true,
    },
    {
      id: "claim-suez-distance",
      text: "부산에서 로테르담까지 수에즈 운하 경유 거리는 약 20,400km, 소요 시간은 약 30~34일이다.",
      assertionType: "FACT",
      sourceIds: ["src-nanet-2025"],
      verified: true,
    },
    {
      id: "claim-reduction",
      text:
        "북극항로를 이용하면 수에즈 운하 경유 대비 운항 거리가 약 7,400km, 약 36% 줄어든다. (20,400km → 13,000km)",
      assertionType: "FACT",
      sourceIds: ["src-nanet-2025"],
      verified: true,
    },
    /* ── 기업 반응 씬의 근거. 위치(세 칸)는 잼통의 판단이고 문장은 모두 출처의 말이다. ── */
    {
      id: "claim-co-panstar",
      text:
        "팬스타그룹은 2026년 7월 31일 HMM이 보유하던 컨테이너선 몸바사호의 매입 계약을 마치고 이름을 팬스타 아크로호로 정했다. 정부 시범운항 공모에는 중견 선사인 팬스타라인닷컴만 응모했다.",
      assertionType: "FACT",
      sourceIds: ["src-busan-acro-purchase", "src-hankyung-arctic-viability"],
      verified: true,
    },
    {
      id: "claim-co-big-carriers",
      text: "북극항로 시범운항 공모에 HMM과 팬오션 등 대형 선사는 응모하지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-arctic-viability"],
      verified: true,
    },
    {
      id: "claim-co-industry-cautious",
      text:
        "정부의 적극적인 지원 의지에도 해운업계는 신중한 반응을 보이고 있으며, 후속 운항으로 선종을 다양화하고 내빙선에 적합한 특화 화물을 발굴하는 것이 핵심 과제라는 업계의 지적이 있다.",
      assertionType: "CLAIM",
      assertedBy: "한국경제 보도",
      sourceIds: ["src-hankyung-arctic-viability"],
      verified: true,
    },
    {
      id: "claim-co-hd",
      text:
        "HD현대중공업은 2026년 4월 스웨덴 해사청과 3억 4,890만 달러(약 5,148억 원) 규모 쇄빙전용선 1척의 건조 계약을 맺었고, 2029년 인도할 계획이다.",
      assertionType: "FACT",
      sourceIds: ["src-munhwa-hd-icebreaker"],
      verified: true,
    },
    {
      id: "claim-co-hanwha",
      text:
        "한화오션은 2008년부터 극지용 선박을 개발해 Arc7급 쇄빙 LNG 운반선 21척을 건조했고, 정부 차세대 쇄빙연구선 건조 사업 우선협상대상자로 선정돼 2029년까지 PC3급 연구선을 짓는다. 미국 해안경비대는 북극 안보쇄빙선(ASC) 건조 계약을 핀란드 라우마마린컨스트럭션과 맺었다.",
      assertionType: "FACT",
      sourceIds: ["src-newstomato-kship-arctic"],
      verified: true,
    },
    {
      id: "claim-co-samsung",
      text:
        "삼성중공업이 러시아 즈베즈다 조선소와 진행하던 쇄빙선 사업은 러시아-우크라이나 전쟁 장기화로 차질을 빚었고, 삼성중공업은 계약 해지와 선수금 반환 문제를 두고 국제중재 절차를 진행 중이다.",
      assertionType: "FACT",
      sourceIds: ["src-edaily-kship-icebreaker"],
      verified: true,
    },
    {
      id: "claim-co-mol",
      text:
        "상선미쓰이(MOL)는 2018년 세계 첫 쇄빙 LNG선을 완성해 여름철 북동항로로 러시아에서 중국으로 LNG를 수송하며 북극항로 수송의 선두가 되겠다고 밝혔다(2021년). 2024년에는 미국·유럽 제재 강화로 한화에 발주한 Arc7 LNG선 3척의 용선 계약 구조를 바꿔야 하며, Arctic LNG 2 사업에 예정대로 용선 서비스를 제공할 수 없다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-mol-nsr-blog", "src-hnn-mol-exit"],
      verified: true,
    },
    {
      id: "claim-co-sealegend",
      text:
        "중국 Sea Legend는 2026년 8~10월 닝보–펠릭스토우 북극 급행을 8항차 운항하며, 운항 일정상 21일이 걸린다. 2025년에는 이 회사의 Istanbul Bridge호가 북동항로로 중국–영국 첫 직항 컨테이너 운송을 마쳤다.",
      assertionType: "FACT",
      sourceIds: ["src-loadstar-sealegend", "src-gcaptain-china-2025"],
      verified: true,
    },
    {
      id: "claim-co-newnew",
      text:
        "중국은 2025년 북동항로로 아시아–유럽 컨테이너선을 14회 운항했다(2024년 11회, 2023년 7회). NewNew Shipping Line과 Sea Legend는 2026년 북극 컨테이너 운항을 늘리겠다는 계획을 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-gcaptain-china-2025"],
      verified: true,
    },
    {
      id: "claim-co-pledge",
      text:
        "2019년 10월 나이키와 해양보존단체 Ocean Conservancy는 북극해로 의도적으로 배를 보내지 않겠다는 기업 서약을 내놓았고, 갭·컬럼비아·PVH·H&M·CMA CGM·에버그린·하팍로이드·MSC 등이 첫 서명사로 참여했다. 2026년 10월 보도도 나이키·H&M·갭 등 주요 화주가 이 서약에 참여했다고 전한다.",
      assertionType: "FACT",
      sourceIds: ["src-oc-arctic-pledge", "src-hankyung-arctic-viability"],
      verified: true,
    },
    {
      id: "claim-co-bollinger",
      text:
        "미국 해안경비대의 첫 대형 극지 쇄빙선 Polar Sentinel은 볼린저 조선소가 짓고 있다. 볼린저는 2030년 인도를 목표로 한다고 의회에 밝혔고, GAO는 2033년 인도를 예상한다. 해안경비대는 비용 증가분으로 볼린저에 9억 5,160만 달러 계약을 줬다.",
      assertionType: "FACT",
      sourceIds: ["src-marinelink-bollinger"],
      verified: true,
    },
    /* ── 전망 씬의 근거. 결론 두 개만 잼통의 정리(INTERPRETATION)이고, 나머지는 출처의 말이다. ── */
    {
      id: "claim-panstar-forecast",
      text: "팬스타라인은 북극항로로 운항기간을 약 10일, 연료 사용량을 약 30% 줄일 수 있을 것으로 예상한다.",
      assertionType: "CLAIM",
      assertedBy: "팬스타라인 (아이뉴스24 보도)",
      sourceIds: ["src-inews24-arctic-challenges"],
      verified: true,
    },
    {
      id: "claim-trial-load",
      text: "2,758TEU급 팬스타 아크로호는 화학제품·중고차·자동차 부품 등 수출 화물 약 737TEU를 싣고 출항했다.",
      assertionType: "FACT",
      sourceIds: ["src-inews24-arctic-challenges", "src-seoul-arctic-depart"],
      verified: true,
    },
    {
      id: "claim-regular-2030",
      text:
        "정부는 시범운항에서 확보한 극지 운항 경험과 연료 소비, 선체 거동 등의 데이터를 바탕으로 2030년 북극항로 정기 상업화를 추진한다는 구상이다.",
      assertionType: "CLAIM",
      assertedBy: "정부 (아이뉴스24 보도)",
      sourceIds: ["src-inews24-arctic-challenges"],
      verified: true,
    },
    {
      id: "claim-backhaul",
      text:
        "정기 컨테이너 항로로 정착하려면 지속적인 물동량과 왕복 화물을 확보하는 것이 우선이고, 극지 전용 선박과 전문 인력, 높은 보험료, 선체·장비 유지보수 비용도 고려해야 한다는 지적이 있다.",
      assertionType: "CLAIM",
      assertedBy: "업계 (아이뉴스24 보도)",
      sourceIds: ["src-inews24-arctic-challenges"],
      verified: true,
    },
    {
      id: "claim-ship-size",
      text:
        "현재 유럽 노선에는 1만 8천~2만 3천TEU급 초대형 선박이 투입되지만 북극항로 운항이 가능한 선박은 4천~5천TEU급에 그치고, 컨테이너 해운은 대형 선박 여러 척으로 비용을 분산해야 수익이 난다는 지적이 있다.",
      assertionType: "CLAIM",
      assertedBy: "해운업계 관계자 (뉴스토마토 보도)",
      sourceIds: ["src-newstomato-arctic-calc"],
      verified: true,
    },
    {
      id: "claim-nsr-2025",
      text:
        "2025년 11월 30일까지 북동항로 통과 운항은 103회(선박 88척)였고, 그중 컨테이너선 운항은 15회로 2024년 11회보다 늘었다. 항로의 동쪽 끝은 중국이 주도한다.",
      assertionType: "FACT",
      sourceIds: ["src-chnl-nsr-2025"],
      verified: true,
    },
    {
      id: "claim-nsr-2025-ice",
      text:
        "2025년 여름·가을 운항기 북동항로의 얼음 조건은 불리했다. 첫 통과 선박은 6월 30일 항로에 들어왔고 마지막 선박은 11월 17일 빠져나갔다.",
      assertionType: "FACT",
      sourceIds: ["src-chnl-nsr-2025"],
      verified: true,
    },
    {
      id: "claim-season-2050",
      text:
        "IPCC는 2050년까지 북동항로에서 항해에 적합한 날이 연 최대 125일로 늘 것으로 전망했다. 보도 시점(2014년)의 항해 가능 기간은 약 50일이었다.",
      assertionType: "CLAIM",
      assertedBy: "IPCC (바렌츠옵서버 2014년 보도)",
      sourceIds: ["src-barents-ipcc-2050"],
      verified: true,
    },
    {
      id: "claim-outlook-positive",
      text:
        "잼통의 전망(긍정적 시나리오): 러시아 제재 해제, 운항기간 연장, 연료 절감 예상의 실측 확인이 겹치면 북극항로는 수에즈 항로를 대신하지는 못해도 여름철 정기 항로로 자리 잡고, 쇄빙선 건조·에너지 수송 같은 전후방 산업 기회로 이어질 수 있다. 예측이며 보장되지 않는다.",
      assertionType: "INTERPRETATION",
      sourceIds: [
        "src-mof-2026",
        "src-mof-arctic-return",
        "src-inews24-arctic-challenges",
        "src-barents-ipcc-2050",
        "src-nanet-2025",
      ],
      verified: true,
    },
    {
      id: "claim-outlook-negative",
      text:
        "잼통의 전망(부정적 시나리오): 제재가 이어지고 꾸준한 물동량과 왕복 화물을 확보하지 못하면, 북극항로는 짧은 운항기간과 작은 선박의 원가 부담 속에 정부 지원으로 간간이 다니는 실험 항로에 머물 수 있다. 예측이며 보장되지 않는다.",
      assertionType: "INTERPRETATION",
      sourceIds: [
        "src-mof-2026",
        "src-inews24-arctic-challenges",
        "src-newstomato-arctic-calc",
        "src-chnl-nsr-2025",
        "src-fn-arctic-arrive",
      ],
      verified: true,
    },
    {
      id: "claim-limits",
      text:
        "북극항로는 상업 항로로 자리 잡기에 동절기 제약(연중 4~5개월만 운항 가능)과 높은 보험료 등 한계가 있다고 지적된다.",
      assertionType: "CLAIM",
      assertedBy: "파이낸셜뉴스 보도",
      sourceIds: ["src-fn-arctic-arrive"],
      verified: true,
    },
  ],

  sources: [
    MOF_2026,
    NANET_2025,
    {
      id: "src-mof-arctic-return",
      title: "대한민국, 북극항로 시대를 열다! 첫 컨테이너선 시범운항을 마치고 부산으로",
      url: "https://www.mof.go.kr/doc/ko/selectDoc.do?docSeq=68989&bbsSeq=10&menuSeq=971",
      publisher: "해양수산부 북극항로정책과",
      publishedAt: "2026-10-13",
      type: "official",
      license: "public",
      quote:
        "팬스타 아크로호는 지난 8월 22일 21시경 부산항 신항을 출항해 북동항로를 거쳐 20일 5시간 만에 " +
        "영국 펠릭스토우에 도착했다. 이후 네덜란드 로테르담과 폴란드 그단스크를 차례로 기항한 뒤, " +
        "다시 북동항로를 통해 10월 11일(일) 부산항으로 돌아왔다. 우리 선사의 컨테이너선이 북극항로를 " +
        "이용해 우리나라와 유럽을 왕복한 것은 이번이 처음이다.",
    },
    {
      id: "src-seoul-arctic-depart",
      title: "북극항로 시대 연다… 국내 컨테이너선 22일 첫 시범운항",
      url: "https://www.seoul.co.kr/news/economy/2026/08/21/20260821029003",
      publisher: "서울신문",
      publishedAt: "2026-08-21",
      type: "press",
      license: "quotable",
      quote:
        "해양수산부는 20일 “팬스타 아크로호가 22일 부산신항 3부두에서 출항하고 북동항로를 " +
        "통해 유럽으로 운항한다”고 밝혔다. 팬스타 아크로호는 2758TEU급 컨테이너선이다.",
    },
    {
      id: "src-fn-arctic-arrive",
      title: "'아시아~유럽 최단거리' 북극항로 상업화 '청신호'… 팬스타 아크로호 로테르담 무사 입항",
      url: "https://www.fnnews.com/news/202609132233042683",
      publisher: "파이낸셜뉴스",
      publishedAt: "2026-09-13",
      type: "press",
      license: "quotable",
      quote:
        "13일 해양수산부에 따르면 팬스타 아크로호(2758TEU급)는 한국시간으로 이날 오후 6시 25분께 " +
        "네덜란드 로테르담항에 입항했다. 지난달 22일 부산신항을 출항한 지 22일 만이다. (…) " +
        "동절기(연중 4~5개월만 운항 가능) 제약과 높은 보험료 등 한계도 존재한다.",
    },
    {
      id: "src-hankyung-arctic-viability",
      title: "첫발 뗀 '북극항로' 개척…사업성 확보가 최대 관건",
      url: "https://www.hankyung.com/article/2026101396291",
      publisher: "한국경제",
      publishedAt: "2026-10-13",
      type: "press",
      license: "quotable",
      quote:
        "이번 시범 운항 공모에는 중견 선사인 팬스타라인닷컴만 응모했고 HMM과 팬오션 등 대형 선사는 불참했다. (…) " +
        "정부의 적극적인 지원 의지에도 해운업계는 신중한 반응을 보이고 있다. (…) 나이키와 H&M, 갭 등 주요 화주는 " +
        "북극 생태계를 보호하기 위해 자사 제품을 북극항로로 보내지 않겠다는 기업 서약에 참여했다.",
    },
    {
      id: "src-busan-acro-purchase",
      title: "북극항로 시범운항 선박 매입 완료... HMM의 2800TEU급 컨테이너선",
      url: "https://www.busan.com/view/busan/view.php?code=2026073117592977072",
      publisher: "부산일보",
      publishedAt: "2026-07-31",
      type: "press",
      license: "quotable",
      quote:
        "31일 해운업계에 따르면 팬스타그룹은 이날 HMM이 보유한 컨테이너선 '몸바사(Mombasa)호'의 매각 계약을 완료했다. " +
        "팬스타그룹은 해당 선박의 이름을 '팬스타 아크로(PANSTAR ACRO)호'로 확정하고",
    },
    {
      id: "src-munhwa-hd-icebreaker",
      title: "HD현대중 쇄빙선 첫 수주… 한화는 캐나다 주정부와 MOU",
      url: "https://www.munhwa.com/article/11584158",
      publisher: "문화일보",
      publishedAt: "2026-04-22",
      type: "press",
      license: "quotable",
      quote:
        "HD현대중공업은 스웨덴 해사청과 3억4890만 달러(약 5148억 원) 규모의 쇄빙전용선 1척에 대한 건조 계약을 " +
        "체결했다고 22일 밝혔다. (…) 건조 완료 후 오는 2029년 인도할 계획이다.",
    },
    {
      id: "src-newstomato-kship-arctic",
      title: "미 쇄빙선 수주 실패했지만…북극항로 힘 싣는 K조선",
      url: "https://newstomato.com/ReadNews.aspx?no=1286951",
      publisher: "뉴스토마토",
      publishedAt: "2026-01-06",
      type: "press",
      license: "quotable",
      quote:
        "최근 미 해양경비대는 북극 안보쇄빙선(ASC) 건조 계약을 핀란드 라우마마린컨스트럭션(RMC)과 체결했습니다. (…) " +
        "한화오션은 2008년부터 극지용 선박 개발을 시작해 세계에서 가장 많은 21척의 Arc7급 쇄빙 LNG 운반선을 건조한 경험이 있습니다.",
    },
    {
      id: "src-edaily-kship-icebreaker",
      title: "북극항로 뜨자…K조선, 쇄빙선 수주전 본격화",
      url: "https://edaily.co.kr/News/Read?mediaCodeNo=257&newsId=06560006645546336",
      publisher: "이데일리",
      publishedAt: "2026-08-11",
      type: "press",
      license: "quotable",
      quote:
        "다만 러시아 즈베즈다 조선소와 진행하던 쇄빙선 사업은 러시아-우크라이나 전쟁 장기화로 차질을 빚었다. " +
        "삼성중공업은 현재 계약 해지와 선수금 반환 문제를 두고 국제중재 절차를 진행 중이다.",
    },
    {
      id: "src-mol-nsr-blog",
      title: "Aiming to be a Top Runner in Northern Sea Route Transportation",
      url: "https://www.mol-service.com/blog/northern-sea-route-transportation",
      publisher: "Mitsui O.S.K. Lines",
      publishedAt: "2021-01-20",
      type: "official",
      license: "quotable",
      quote:
        "MOL completed construction of the world's first ice-breaking LNG carrier and began transporting LNG " +
        "from Russia to China via the Northern Sea Route (Summer only).",
    },
    {
      id: "src-hnn-mol-exit",
      title: "Arctic LNG 2 Facing Vessel Shortage as Zvezda Shipyard Delays Delivery, Japanese MOL Exits Charter Contract",
      url: "https://en.highnorthnews.com/business/arctic-lng-2-facing-vessel-shortage-as-zvezda-shipyard-delays-delivery-japanese-mol-exits-charter-contract/214393",
      publisher: "High North News",
      publishedAt: "2024-11-04",
      type: "press",
      license: "quotable",
      quote:
        "MOL had placed orders for three highly ice-capable Arc7 LNG carriers with South Korean shipyard Hanwha. " +
        "(…) will not be able to provide charter services as intended to the Arctic LNG 2 project.",
    },
    {
      id: "src-loadstar-sealegend",
      title: "Sea Legend Shipping returns to Arctic route with China-Europe NSR sailings",
      url: "https://theloadstar.com/sea-legend-shipping-returns-to-arctic-route-with-china-europe-nsr-sailings/",
      publisher: "The Loadstar",
      publishedAt: "2026-07-17",
      type: "press",
      license: "quotable",
      quote:
        "there will be eight sailings by Sea Legend's China-Europe Arctic Express between August and October. " +
        "(…) Sea Legend's vessel schedule shows the voyage will take 21 days.",
    },
    {
      id: "src-gcaptain-china-2025",
      title: "China Expands Arctic Container Shipping With Record 14 Voyages in 2025",
      url: "https://gcaptain.com/china-expands-arctic-container-shipping-with-record-14-voyages-in-2025/",
      publisher: "gCaptain",
      publishedAt: "2025-12-18",
      type: "press",
      license: "quotable",
      quote:
        "14 container ship voyages between Asia and Europe, up from 11 such voyages in 2024 and seven in 2023 " +
        "(…) Shipping companies NewNew Shipping Line and Sea Legend have already signaled plans",
    },
    {
      id: "src-oc-arctic-pledge",
      title: "Nike and Ocean Conservancy Announce New Arctic Shipping Pledge",
      url: "https://oceanconservancy.org/newsroom/press-release/2019/10/24/nike-ocean-conservancy-announce-new-arctic-shipping-pledge/",
      publisher: "Ocean Conservancy",
      publishedAt: "2019-10-24",
      type: "official",
      license: "quotable",
      quote: "commit to not intentionally send ships through this fragile Arctic ecosystem",
    },
    {
      id: "src-marinelink-bollinger",
      title: "Construction of Two Icebreakers at Bollinger Shipyards Progresses",
      url: "https://www.marinelink.com/news/construction-two-icebreakers-bollinger-542208",
      publisher: "MarineLink (USNI News)",
      publishedAt: "2026-08-18",
      type: "press",
      license: "quotable",
      quote:
        "Polar Sentinel would deliver in 2033 (…) tracking to a 2030 delivery (…) a $951.6 million contract to Bollinger",
    },
    {
      id: "src-inews24-arctic-challenges",
      title: "22일 만에 유럽 닿은 북극항로…'10일 단축' 뒤 남은 3대 난제",
      url: "https://www.inews24.com/view/2005898",
      publisher: "아이뉴스24",
      publishedAt: "2026-09-16",
      type: "press",
      license: "quotable",
      quote:
        "운항기간은 약 10일, 연료 사용량은 약 30% 줄일 수 있을 것으로 팬스타는 예상한다. (…) " +
        "정부는 이번 시범운항에서 확보한 극지 운항 경험과 연료 소비, 선체 거동 등의 데이터를 바탕으로 " +
        "2030년 북극항로 정기 상업화를 추진한다는 구상이다. (…) 정기 컨테이너 항로로 정착하려면 " +
        "지속적인 물동량과 왕복 화물을 확보하는 것이 우선",
    },
    {
      id: "src-newstomato-arctic-calc",
      title: "같은 북극항로, 해운업계 셈법은 제각각",
      url: "https://www.newstomato.com/ReadNews.aspx?no=1285924",
      publisher: "뉴스토마토",
      publishedAt: "2025-12-24",
      type: "press",
      license: "quotable",
      quote:
        "현재 유럽 노선에는 1만8000~2만3000TEU급 초대형 선박이 투입되지만 북극항로 운항이 가능한 " +
        "선박은 4000~5000TEU급에 그친다",
    },
    {
      id: "src-chnl-nsr-2025",
      title: "Main Results of NSR Transit Navigation in 2025",
      url: "https://chnl.no/news/main-results-of-nsr-transit-navigation-in-2025/",
      publisher: "CHNL (Centre for High North Logistics, Nord University)",
      publishedAt: "2025-12-09",
      type: "research",
      license: "quotable",
      quote:
        "By November 30, 2025, we recorded 103 transit voyages performed by 88 unique vessels (…) " +
        "We counted 15 such voyages. (…) China dominates the eastern end. (…) ice conditions along " +
        "the NSR during the summer–autumn navigation period of 2025 were unfavorable.",
    },
    {
      id: "src-barents-ipcc-2050",
      title: "125 days of navigable conditions by 2050",
      url: "https://www.thebarentsobserver.com/business/125-days-of-navigable-conditions-by-2050/235762",
      publisher: "The Barents Observer",
      publishedAt: "2014-04-01",
      type: "press",
      license: "quotable",
      quote:
        "The Northern Sea Route is predicted to have up to 125 days per year suitable for navigation " +
        "by 2050. (…) Today the Northern Sea Route is open for navigation around 50 days.",
    },
  ],
};

export const arcticRoute = achievementSchema.parse(raw);
