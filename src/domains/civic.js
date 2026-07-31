/**
 * 도메인 팩 — 공공행정 (한성시청, 가상 지자체)
 * 동일 플랫폼을 지방자치단체 민원·행정 도메인에 맞춰 재구성한 데모 프로파일.
 */
import {
  Landmark, Users, ShieldCheck, Search, ScrollText, BookOpen, Map, CloudRain,
  FileText, BookMarked, Database, CheckSquare, ClipboardList, Lock,
} from "lucide-react";

const civic = {
  id: "civic",
  orgName: "한성시청",
  orgShort: "HSC",
  platformTitle: "한성시 스마트행정 AI 플랫폼",
  brandColor: "#166534",
  welcome: "한성시 스마트행정 생성형 AI 플랫폼에 오신 것을 환영합니다.",
  statusBadge: "시스템 정상 가동 중 · 로컬 LLM · 행정망 전용 · 망분리 적용",
  footerNote: "한성시 지능형 행정혁신 사업 (온나라·새올 연계 데모)",
  userFeatures: [
    "조례·규칙·지침 질의 (RAG)",
    "민원 서류·공문서 OCR 판독",
    "행정 데이터 자연어 조회",
    "다국어 민원 번역 (한/영/중/일)",
  ],
  user: { name: "이서연", dept: "민원여권과", title: "주무관" },
  workspaces: [
    { id: "ws1", name: "민원혁신 TF", icon: Users, active: true },
    { id: "ws2", name: "기획예산과 시정분석반", icon: Landmark },
    { id: "ws3", name: "정보통신과 보안점검 TF", icon: ShieldCheck },
  ],
  llmModels: [
    { id: "m0", name: "Claude Fable 5", shortName: "Fable 5", type: "보안 게이트웨이", context: "400K", security: "high", status: "running", desc: "플래그십 최고 성능 모델 — 행정망 보안 게이트웨이 경유 (기본값)" },
    { id: "m1", name: "GPT-OSS 120B", shortName: "GPT-OSS", type: "구축형", context: "128K", security: "high", status: "running", desc: "행정망 내부 전용 대형 모델" },
    { id: "m2", name: "Llama-3-Korean 70B", shortName: "Llama-3", type: "구축형", context: "32K", security: "high", status: "running", desc: "민원 분류·에이전트 워크플로우 특화" },
    { id: "m3", name: "EXAONE 3.0 78B", shortName: "EXAONE", type: "구축형", context: "32K", security: "high", status: "running", desc: "조례·규정 검색(RAG) 특화" },
    { id: "m4", name: "Gemini 2.5 Pro", shortName: "Gemini", type: "API(Cloud)", context: "1M", security: "low", status: "blocked", desc: "미인증 클라우드 모델 — 행정망 보안 정책으로 차단" },
  ],
  suggestions: [
    { icon: Search,     iconBg: "bg-green-50",  iconColor: "text-green-700",  title: "여권 발급 안내",   query: "긴급 여권 발급 요건과 처리 기한, 필요한 구비서류를 알려줘" },
    { icon: ScrollText, iconBg: "bg-blue-50",   iconColor: "text-blue-600",   title: "조례 검색",       query: "옥외광고물 설치 허가 관련 조례 조항과 허가 절차를 요약해줘" },
    { icon: CloudRain,  iconBg: "bg-sky-50",    iconColor: "text-sky-600",    title: "재난 상황 확인",   query: "현재 호우경보 상황과 동별 피해 신고 현황을 알려줘" },
    { icon: Map,        iconBg: "bg-emerald-50", iconColor: "text-emerald-700", title: "동별 민원 지도",  query: "이번 달 행정동별 민원 접수 현황을 지도로 분석해줘" },
  ],
  modeDesc: {
    GENERAL: "조례·규칙, 민원 처리 절차, 행정 지침에 대해 자유롭게 질문하세요",
  },
  agentFeed: {
    recent: [
      { agentId: "agent-meeting",      agentName: "회의록 작성",  time: "오늘 14:32", result: "HSC-회의록-0312.hwp 생성" },
      { agentId: "agent-knowledge",    agentName: "지식 검색",    time: "오늘 10:15", result: "여권 발급 지침 5건 검색" },
      { agentId: "agent-dataanalysis", agentName: "시정 분석",    time: "어제 16:44", result: "민원 처리 현황 분석 완료" },
    ],
    recommendTitle: "자치법규 정기 정비 기한 12일 전",
    recommendBody: "지난 정비 결과와 현행 조례를 대조 검토하여 개정 필요 조항을 확인하시겠습니까?",
    pendingBody: "2026-03-17 민원여권과 정례회의 녹음이 미처리 상태입니다.",
  },
  history: [
    { id: "h1", title: "긴급 여권 발급 요건 문의", mode: "GENERAL", time: "14:30", isToday: true, starred: true },
    { id: "h2", title: "조례 개정문 영문 번역", mode: "TRANSLATE", time: "10:15", isToday: true, starred: false },
    { id: "h3", title: "보도자료 초안 규정 검토", mode: "REVIEW", time: "어제", isToday: false, starred: false },
    { id: "h4", title: "주간 시정 보고서 초안", mode: "REPORT", time: "02.20", isToday: false, starred: true },
    { id: "h5", title: "호우경보 피해 신고 현황 확인", mode: "GENERAL", time: "02.18", isToday: false, starred: false },
  ],
  docs: [
    { id: "d1", name: "민원사무편람_2026.pdf", size: "4.1 MB", date: "2026.01.05", tags: ["대외비", "DRM 자동해제"], secLevel: "C" },
    { id: "d2", name: "옥외광고물_관리조례.pdf", size: "1.2 MB", date: "2025.11.28", tags: ["OCR 적용"], secLevel: "S" },
    { id: "d3", name: "한성시_복무규정(2025개정).hwp", size: "1.8 MB", date: "2026.02.10", tags: ["규정"], secLevel: "O" },
  ],
  sampleAnswers: [
    {
      keywords: ["여권", "발급"],
      answer: {
        content: "**긴급 여권 발급 안내** (여권법 시행령 제14조, 민원편람 2026 기준)\n\n- **대상**: 친족 사망·위독 등 인도적 사유, 긴급 상용 출장 (증빙 필요)\n- **처리 기한**: 접수일 포함 **최대 48시간** (일반 여권은 4~5 근무일)\n- **구비서류**: 여권발급신청서, 여권용 사진 1매, 신분증, **긴급성 증빙서류** (사망진단서·출장명령서 등), 수수료 53,000원 (단수여권)\n- **접수처**: 시청 1층 민원여권과 3~5번 창구 (평일 09:00~18:00)\n\n※ 출처: 민원사무편람 2026 개정판 12페이지, 여권법 시행령 제14조",
        citations: [], steps: null,
        confidence: 96,
        xai: {
          sources: [
            { name: "민원사무편람_2026.pdf", similarity: 97 },
            { name: "여권법 시행령 제14조", similarity: 92 },
          ],
        },
      },
    },
    {
      // 수치는 오케스트레이션 '호우경보 재난 상황보고' 시나리오와 동일 세계관 (신고 47건·강변동 집중)
      keywords: ["호우", "재난", "침수", "피해"],
      answer: {
        content: "**호우경보 대응 상황** (재난안전상황실, 03.21 09:00 기준)\n\n- **기상 상황**: 06:00 호우경보 발령 — 시간당 최대 42mm, 누적 118mm (12시간)\n- **피해 신고**: 침수·배수 관련 **47건** 접수 — 강변동 18 · 공단동 12 · 신시가동 8 · 기타 9\n- **하천 수위**: 강변동 관측소 **주의수위 초과** (2.84m / 주의 2.5m · 경계 3.2m), 상승 추세 시간당 +0.12m\n- **조치 상황**: 배수펌프장 4개소 전량 가동, 하천변 산책로 3개 구간 출입 통제\n\n**주의**: 강변동 하천 정비 공사 구간은 임시 제방 구간으로 침수 취약 — 공사 중지 및 장비 대피가 09:30 완료 예정입니다.\n\n에이전트 탭의 **'호우경보 재난 상황보고 작성'** 시나리오를 실행하면 재난 데이터 조회 → 위험 분석 → 매뉴얼 대조 → 대책본부 상황보고서 1보까지 자동으로 처리됩니다.\n\n※ 출처: 재난안전상황실 접수 대장, 하천 수위 자동계측(강변동 관측소), 기상청 특보 통보문",
        citations: [], steps: null,
        confidence: 92,
        xai: {
          queryRewrite: "호우경보 동별 피해 신고 하천 수위 대응 상황",
          base: { rag: 90, model: 10 },
          sources: [
            { name: "재난안전상황실 접수 대장 (실시간)", similarity: 96 },
            { name: "하천 수위 자동계측 — 강변동 관측소", similarity: 93 },
            { name: "기상청 특보 통보문 06:00", similarity: 90 },
          ],
          rejected: [
            { name: "작년 태풍 대응 백서", similarity: 61, reason: "과거 사례 참고용 — 현재 상황 수치와 혼동 방지 위해 제외" },
          ],
          reasoning: "실시간 접수 대장과 수위 계측값을 우선 근거로 사용했습니다. 강변동을 주의 지역으로 지목한 것은 신고 밀도와 공사 구간 취약도가 중첩되기 때문이며, 예측(경계수위 도달 시각)은 추세 외삽이라 불확실성이 있습니다.",
        },
      },
    },
    {
      keywords: ["옥외광고", "조례", "허가"],
      answer: {
        content: "**옥외광고물 설치 허가 절차** (한성시 옥외광고물 관리 조례 제7조~제11조)\n\n1. **허가 대상**: 벽면 이용 간판 중 한 변 10m 이상, 지주 이용 간판 4m 초과, 옥상간판 전체\n2. **신청 서류**: 허가신청서, 배치도·디자인 도안, 구조 안전 확인서 (4m 초과 시)\n3. **처리 기한**: 접수일부터 **7 근무일** (보완 요구 시 중단)\n4. **수수료**: 표시면적 기준 산정 (조례 별표 2)\n\n안전점검 대상 광고물은 매년 정기점검 보고 의무가 있습니다 (조례 제18조).\n\n※ 출처: 한성시 옥외광고물 관리 조례 (2025.11 개정), 제7조·별표 2",
        citations: [], steps: null,
        confidence: 94,
        xai: {
          sources: [
            { name: "옥외광고물_관리조례.pdf", similarity: 96 },
            { name: "조례 별표 2 (수수료 산정)", similarity: 88 },
          ],
        },
      },
    },
  ],
  // 지도 인텔리전스 — 행정동별 민원 접수 히트맵 (시뮬레이션)
  mapIntel: {
    metricLabel: "민원 접수 건수",
    unit: "건",
    regionUnit: "행정동",
    periodLabel: "2026년 6월 월간 집계",
    sourceSystem: "새올행정시스템",
    sourceNote: "※ 출처: 새올행정시스템 민원 통계 월보 (시뮬레이션 데이터)",
    mapTitle: "한성시 행정동 히트맵",
    chartTitle: "월별 접수 추이",
    metricKeywords: ["민원", "접수 건수", "민원량"],
    wideKeywords: ["동별", "행정동별", "지역별", "전체 동", "지도"],
    heatLow: "#DCFCE7", heatHigh: "#14532D",
    avgLabel: "전체 동 평균",
    seriesLabels: ["1월", "2월", "3월", "4월", "5월", "6월"],
    avgSeries: [271, 265, 283, 290, 288, 297],
    grid: { cols: 4, rows: 3 },
    regions: [
      { id: "hosu",     name: "호수동",   keywords: ["호수동"],   x: 0, y: 0, value: 264, series: [201, 195, 228, 259, 248, 264], insight: "봄 관광 성수기 진입 후 호수공원 주변 불법 주정차 민원이 전월 대비 21% 증가했습니다." },
      { id: "bukmun",   name: "북문동",   keywords: ["북문동"],   x: 1, y: 0, value: 205, series: [212, 204, 210, 208, 201, 205], insight: "연중 안정적인 수준으로, 도로 보수 요청이 접수의 대부분을 차지합니다." },
      { id: "sanseong", name: "산성동",   keywords: ["산성동"],   x: 2, y: 0, value: 152, series: [168, 161, 158, 149, 155, 152], insight: "인구 감소 추세로 전체 동 중 접수가 가장 적으며, 고령층 방문 민원 비중이 높아 찾아가는 민원 서비스 시범 대상입니다." },
      { id: "hannae",   name: "한내동",   keywords: ["한내동"],   x: 3, y: 0, value: 187, series: [179, 172, 181, 190, 184, 187], insight: "농지 전용·건축 인허가 문의가 꾸준하며 계절 요인 외 특이 동향은 없습니다." },
      { id: "seomun",   name: "서문동",   keywords: ["서문동"],   x: 0, y: 1, value: 228, series: [235, 228, 231, 224, 230, 228], insight: "전통시장 주변 노점·위생 민원이 중심으로 월별 편차가 작습니다." },
      { id: "jungang",  name: "중앙동",   keywords: ["중앙동"],   x: 1, y: 1, value: 487, series: [452, 438, 465, 471, 469, 487], insight: "시청 소재지로 여권·전입 등 창구 민원이 전체의 38%를 차지합니다. 대기시간 단축을 위해 무인민원발급기 2대 증설을 검토 중입니다." },
      { id: "dongmun",  name: "동문동",   keywords: ["동문동"],   x: 2, y: 1, value: 289, series: [271, 266, 280, 285, 282, 289], insight: "재개발 조합 설립 추진에 따라 도시계획 열람·이주 문의가 증가 추세입니다." },
      { id: "daehak",   name: "대학동",   keywords: ["대학동"],   x: 3, y: 1, value: 342, series: [298, 285, 336, 349, 338, 342], insight: "원룸 밀집 지역으로 3월 개강 이후 전입신고·주정차·소음 민원이 집중됩니다." },
      { id: "gangbyeon",name: "강변동",   keywords: ["강변동"],   x: 0, y: 2, value: 315, series: [289, 284, 301, 312, 308, 315], insight: "하천 정비 공사 구간의 소음·분진 민원이 공정 진행에 따라 완만히 증가하고 있습니다." },
      { id: "nammun",   name: "남문동",   keywords: ["남문동"],   x: 1, y: 2, value: 241, series: [244, 239, 246, 238, 243, 241], insight: "생활 민원 중심으로 안정적이며, 쓰레기 무단투기 신고가 소폭 늘어 CCTV 증설을 협의 중입니다." },
      { id: "sinsigak", name: "신시가동", keywords: ["신시가동", "신시가"], x: 2, y: 2, value: 452, series: [385, 392, 421, 448, 439, 452], insight: "대규모 아파트 입주가 이어지며 전입신고·차량등록 민원이 6개월 새 17% 증가했습니다. 임시 창구 운영을 검토 중입니다." },
      { id: "gongdan",  name: "공단동",   keywords: ["공단동"],   x: 3, y: 2, value: 398, series: [372, 368, 384, 391, 389, 398], insight: "산업단지 특성상 소음·환경 민원 비중이 높으며, 야간 조업 관련 신고가 여름철에 증가하는 경향이 있습니다." },
    ],
  },
  // 라이브 지표 — GENERAL 첫 화면 실시간 카드 + 임계 돌파 시 알림 생성 (재난 세계관과 동일 수치대)
  liveMetric: {
    label: "강변동 하천 수위", unit: "m", decimals: 2,
    initial: 2.28, min: 1.9, max: 3.4, window: 48,
    threshold: 2.5, thresholdLabel: "주의수위 2.5m",
    drift: 0.003, noise: 0.02,
    recovery: { at: 3.1, to: 2.2 },
    alert: { severity: "alert", title: "실시간 수위 경보 — 강변동", body: "하천 수위 {value}m — 주의수위(2.5m) 상향 돌파. 상황보고서 작성을 실행할 수 있습니다.", link: { agentId: "orchestration:1" } },
    source: "하천 수위 자동계측 · 강변동 관측소(시뮬레이션)",
  },
  // 채팅→에이전트 핸드오프 — GENERAL 답변 아래 이동 카드 (선행 규칙 우선, 소문자 키워드)
  agentRouting: [
    { keywords: ["호우", "재난", "침수"], agentId: "orchestration:1", reason: "재난 데이터 조회부터 대책본부 상황보고서 1보까지 자동 릴레이로 처리합니다." },
    { keywords: ["옥외광고"], agentId: "orchestration:0", reason: "허가 신청 스캔 서류를 OCR부터 검토 보고서까지 자동 처리합니다." },
    { keywords: ["번역", "외국인"], agentId: "agent-translate", reason: "다국어 민원 번역 에이전트가 공문 어투로 번역합니다." },
    { keywords: ["회의록", "녹음"], agentId: "agent-meeting", reason: "회의 녹음을 발언자 구분 회의록으로 자동 정리합니다." },
  ],
  // 알림 센터 — 헤더 벨 드롭다운. link.agentId로 에이전트/시나리오 딥링크 (orchestration:<idx> 허용)
  notifications: [
    { id: "n1", severity: "alert", title: "호우경보 발령", body: "06:00 발령 — 피해 신고 47건 · 강변동 주의수위 초과. 상황보고서 자동 작성을 실행할 수 있습니다.", time: "06:02", link: { agentId: "orchestration:1" } },
    { id: "n2", severity: "warn", title: "옥외광고물 허가 신청 8건", body: "주간 접수분 스캔 서류 검토 대기 중입니다.", time: "08:30", link: { agentId: "orchestration:0" } },
    { id: "n3", severity: "info", title: "정례회의 녹음 미처리", body: "3/17 민원여권과 정례회의 녹음이 회의록 작성 대기 상태입니다.", time: "어제", link: { agentId: "agent-meeting" } },
  ],
  // 복합 업무 오케스트레이션 — 배열이면 허브에 카드가 시나리오별로 1장씩 노출 (시뮬레이션)
  orchestration: [
  // 시나리오 1 — 민원: 접수 서류 1묶음이 OCR→주소정제→행정DB조회→검토 보고서를 릴레이
  {
    title: "옥외광고물 허가 신청 일괄 처리",
    brief: "접수 서류 1묶음이 OCR → 주소 정제 → 새올 허가 이력 조회 → 검토 보고서로 자동 릴레이됩니다.",
    request: "이번 주 접수된 옥외광고물 허가 신청서 스캔본을 처리해줘. 설치 주소 표준화하고 새올에서 기존 허가 이력 확인해서 검토 보고서까지 만들어줘.",
    attachment: { name: "옥외광고물_허가신청_0302-0306.pdf", pages: 32, size: "18.2 MB" },
    stages: [
      {
        agentId: "agent-ocr", ms: 3200,
        task: "스캔 신청서에서 신청인·설치 위치·광고물 규격을 추출하고 개인정보를 자동 마스킹합니다.",
        logs: [
          "Vision_OCR_엔진 호출 — 32면 판독 (300dpi · 표 추출 모드)",
          "허가 신청서 8건 인식 완료 · 평균 신뢰도 97.5%",
          "개인정보 자동 마스킹 — 주민번호 8건 · 연락처 8건",
          "첨부 서류 분류 — 디자인 도안 8 · 구조 안전 확인서 3",
        ],
        output: {
          label: "OCR 추출 결과",
          items: [
            "허가 신청 8건 구조화 (신청인·설치 위치·광고물 규격)",
            "개인정보 16건 마스킹 처리 — 마스킹 로그 자동 기록",
          ],
        },
        handoff: "설치 위치 주소 8건을 주소 정제 에이전트로 전달",
      },
      {
        agentId: "agent-address", ms: 2400,
        task: "설치 위치 주소를 도로명주소로 표준화하고 행정동 코드를 부여합니다.",
        logs: [
          "도로명주소 일괄 매칭 — 8건 (fuzzy 모드)",
          "지번 표기 2건 도로명주소 변환",
          "행정동 코드 부여 — 중앙동 3 · 신시가동 2 · 공단동 3",
          "좌표 산출 — 안전점검 구역 중첩 검사용",
        ],
        output: {
          label: "주소 정제 결과",
          items: [
            "8건 전건 표준화 · 행정동 코드 매핑 완료",
            "새올 허가 이력 조회 키(도로명주소·좌표) 확보",
          ],
        },
        handoff: "표준화 주소 8건을 행정DB 조회 에이전트로 전달",
      },
      {
        agentId: "agent-dbquery", ms: 2800,
        task: "위치별 기존 허가 이력과 수수료 산정 기준을 새올행정시스템 DB에서 조회합니다.",
        logs: [
          "Text2SQL 변환 — 허가 이력·수수료 산정 쿼리 생성",
          "새올행정시스템 DB 조회 — 동일 위치 기존 허가 23건",
          "동일 위치 중복 신청 1건 탐지 (기존 허가 2025-114호)",
          "표시면적 기준 수수료 산정 — 8건 (조례 별표 2)",
        ],
        output: {
          label: "행정DB 조회 결과",
          items: [
            "기존 허가 이력 대조 완료 — 중복 1건 · 신규 7건",
            "규격 초과(한 변 10m 이상) 허가 심사 대상 2건 분류",
          ],
        },
        handoff: "건별 검토 근거 데이터를 보고서 작성 에이전트로 전달",
      },
      {
        agentId: "agent-report", ms: 3000,
        task: "검토 결과를 허가 검토 보고서 표준 양식으로 작성합니다.",
        logs: [
          "허가 검토 보고서 템플릿 로드 (옥외광고물 관리 조례 제7조 양식)",
          "건별 검토 의견 개조식 작성 — 8건",
          "문서번호 채번 — HSC-민원여권과-2026-052",
          "결재선 자동 지정 — 주무관 → 팀장 → 과장",
        ],
        output: {
          label: "보고서 생성",
          items: ["검토 보고서 1건 생성 (8건 · 수수료 산정표 첨부)"],
        },
        handoff: null,
      },
    ],
    result: {
      docNo: "HSC-민원여권과-2026-052",
      docTitle: "옥외광고물 표시 허가 신청(8건) 검토 보고서",
      summary: [
        "8건 중 7건은 조례 제7조 허가 요건 충족 — 허가 적정 의견",
        "동일 위치 중복 신청 1건은 기존 허가(2025-114호)와 병합 처리 안내 필요",
        "규격 초과 2건은 구조 안전 확인서 검토 후 7 근무일 내 처리 예정",
      ],
      metrics: [
        { label: "처리 신청", value: "8건" },
        { label: "개인정보 마스킹", value: "16건" },
        { label: "릴레이 에이전트", value: "4개" },
        { label: "총 소요", value: "약 12초" },
      ],
    },
  },
  // 시나리오 2 — 재난: 호우경보 1건이 재난 데이터 조회→위험 분석→매뉴얼 대조→상황보고서를 릴레이
  // (첨부 없는 이벤트 트리거형 — sampleAnswers 호우 답변·mapIntel 강변동 공사 서사와 같은 세계관)
  {
    title: "호우경보 재난 상황보고 작성",
    brief: "호우경보 1건이 재난 데이터 조회 → 위험 지역 분석 → 매뉴얼 대조 → 대책본부 상황보고서로 자동 릴레이됩니다.",
    request: "오늘 06시에 호우경보가 발령됐어. 동별 피해 신고와 하천 수위 확인해서 위험 지역 분석하고, 대응 매뉴얼상 비상 단계 확인해서 재난안전대책본부 상황보고서 1보까지 만들어줘.",
    stages: [
      {
        agentId: "agent-dbquery", ms: 2800,
        task: "재난안전상황실·새올에서 피해 신고와 계측 데이터를 조회합니다.",
        logs: [
          "Text2SQL 변환 — 피해 신고·수위 계측 집계 쿼리 생성",
          "재난 신고 접수 대장 조회 — 침수·배수 관련 47건 (06:00~09:00)",
          "하천 수위 자동계측 — 강변동 관측소 2.84m · 주의수위(2.5m) 초과",
          "배수펌프장 가동 현황 — 4개소 전량 가동 · 처리 용량 71%",
        ],
        output: {
          label: "재난 데이터 조회 결과",
          items: [
            "피해 신고 47건 집계 — 강변동 18 · 공단동 12 · 신시가동 8 · 기타 9",
            "강변동 수위 상승 추세 시간당 +0.12m — 경계수위 도달 약 3시간 전",
          ],
        },
        handoff: "신고·계측 시계열 데이터를 시정 분석 에이전트로 전달",
      },
      {
        agentId: "agent-dataanalysis", ms: 3200,
        task: "신고 급증 패턴과 침수 취약 지역을 분석해 위험 순위를 산정합니다.",
        logs: [
          "동별 신고 밀도 분석 — 강변동이 평시 대비 9.4배로 최고",
          "하천 정비 공사 구간 중첩 검사 — 임시 제방 2개 구간 침수 취약 판정",
          "수위 상승 추세 외삽 — 12:00 전후 경계수위(3.2m) 도달 예상",
          "반지하·지하주차장 밀집 격자 대조 — 우선 점검 대상 14개소 선별",
        ],
        output: {
          label: "위험 분석 결과",
          items: [
            "위험 1순위 강변동 (공사 구간 임시 제방 + 수위 상승 중첩)",
            "우선 점검 14개소·통제 필요 3개 구간 선별",
          ],
          factors: [
            { label: "하천 수위 상승 추세", pct: 41 },
            { label: "공사 구간 취약도", pct: 33 },
            { label: "신고 밀도(평시 대비)", pct: 26 },
          ],
        },
        handoff: "위험 순위·예측 근거를 규정 조회 에이전트로 전달",
      },
      {
        agentId: "agent-internalreg", ms: 2400,
        task: "자연재난 대응 매뉴얼로 비상 단계와 필수 조치를 대조합니다.",
        logs: [
          "자연재난(풍수해) 표준행동매뉴얼 §2 비상 단계 기준 대조",
          "비상 2단계 격상 요건 — 경보 발령 + 주의수위 초과 충족 확인",
          "필수 조치 체크 — 공사장 중지 명령·하상도로 통제·재해약자 확인",
          "행안부 상황보고 양식(NDMS) 필수 항목 12종 매핑",
        ],
        output: {
          label: "매뉴얼 대조 결과",
          items: [
            "비상 2단계 격상 요건 충족 — 대책본부 확대 운영 건의",
            "필수 조치 8건 중 5건 완료 · 3건 진행 중 확인",
          ],
        },
        handoff: "비상 단계 판정·조치 현황을 보고서 작성 에이전트로 전달",
      },
      {
        agentId: "agent-report", ms: 3000,
        task: "재난안전대책본부 상황보고서 1보를 표준 양식으로 작성합니다.",
        logs: [
          "상황보고서 템플릿 로드 (행안부 NDMS 보고 양식)",
          "기상·피해·조치·계획 4개 절 자동 작성",
          "문서번호 채번 — HSC-안전총괄과-2026-063",
          "결재선 자동 지정 — 상황실장 → 부시장 → 시장",
        ],
        output: {
          label: "보고서 생성",
          items: ["상황보고서 1보 생성 (동별 피해 현황표·수위 그래프 첨부)"],
        },
        review: "비상 단계 격상과 대피 권고는 재난안전대책본부장 승인 사항입니다 (보고서는 건의안 상태).",
        handoff: null,
      },
    ],
    result: {
      docNo: "HSC-안전총괄과-2026-063",
      docTitle: "호우경보 대응 상황보고 제1보 (재난안전대책본부)",
      summary: [
        "비상 2단계 격상 건의 — 경보 발령 + 강변동 주의수위 초과로 요건 충족",
        "강변동 하천 정비 공사 구간 중지·장비 대피 및 임시 제방 2개 구간 집중 감시",
        "12:00 경계수위 도달 예상 — 우선 점검 14개소 예찰 후 3시간 내 2보 보고",
      ],
      metrics: [
        { label: "피해 신고 집계", value: "47건" },
        { label: "우선 점검 대상", value: "14개소" },
        { label: "릴레이 에이전트", value: "4개" },
        { label: "총 소요", value: "약 11초" },
      ],
    },
  },
  ],
  // SECURE 탭 제안 4종 — 다크 UI 고정 팔레트(bg-blue-950/50 · text-blue-400) 유지
  secureSuggestions: [
    { icon: FileText,    iconBg: "bg-blue-950/50", iconColor: "text-blue-400", title: "비공개 민원 서류 분석",   query: "개인정보가 포함된 민원 신청 서류의 핵심 내용을 정리해줘. 결과는 저장되지 않아" },
    { icon: ShieldCheck, iconBg: "bg-blue-950/50", iconColor: "text-blue-400", title: "감사 대응 답변서 초안",   query: "감사 지적사항에 대한 답변서 초안을 보안 환경에서 작성해줘" },
    { icon: Search,      iconBg: "bg-blue-950/50", iconColor: "text-blue-400", title: "인사 자료 비공개 검토",   query: "근무평정·인사 관련 내용을 보안 환경에서 확인하고 싶어. 대화는 저장되지 않아야 해" },
    { icon: Lock,        iconBg: "bg-blue-950/50", iconColor: "text-blue-400", title: "공개 전 시정 구상 정리",  query: "아직 공개하기 전인 시정 계획 아이디어를 보안 환경에서 문서화해줘" },
  ],
  // REVIEW/TRANSLATE/REPORT/SECURE 모드 응답 오버라이드 — citations는 항상 [] (REB FILE_DATA 뷰어 연결 방지)
  modeAnswers: {
    REVIEW: {
      confidence: 91,
      content: "**[공문 사전 검토 결과]**\n\n한성시 복무규정(2025개정) 및 위임전결 규정 대조 결과입니다.\n\n**✅ 준수 사항**\n- 기안문 서식이 온나라 표준 서식(시행문)에 부합\n- 민원 처리에 관한 조례 제12조상 처리 기한(7 근무일) 명시 적정\n\n**⚠️ 보완 권고 사항**\n- 지출 수반 사항은 **과장 전결 불가** — 국장 결재 필요 (위임전결 규정 제9조 별표 1)\n- **개인정보 수집·이용 동의서** 미첨부 (한성시 개인정보 처리 지침 제9조)",
      citations: [],
      steps: [
        { label: "DRM 해제 및 OCR 추출", detail: "기안문 텍스트 완전 추출 완료" },
        { label: "자치법규 지식망 검색", detail: "위임전결 규정·복무규정 관련 조항 검색 완료" },
        { label: "규정 대조 및 검토", detail: "절차 하자 분석 및 보완 사항 발췌 완료" },
      ],
    },
    TRANSLATE: {
      content: "**[번역 완료]** — 한국어 → 영어\n\n---\n**[번역 결과]**\n\n**Guide to Move-in Report for Foreign Residents (외국인 주민 전입신고 안내)**\n\nForeign residents who change their place of stay must file a move-in report at the Civil Affairs & Passport Division (Window 6, 1st floor, Hansung City Hall) within 14 days. Required documents: Alien Registration Card and a copy of the housing contract. The report is processed within 3 working days, free of charge.\n\n---\n*번역 엔진: 로컬 LLM (Llama-3-Korean 70B) | 행정 용어집 8건 적용*",
      citations: [],
      steps: [
        { label: "의미 단위 분할 (Semantic Chunking)", detail: "민원 안내문을 문맥 기준으로 분할 완료" },
        { label: "한영 번역 (로컬 LLM 처리)", detail: "Llama-3-Korean 70B 모델 번역 완료" },
        { label: "행정 용어집 적용", detail: "전입신고·체류지 등 표준 대역어 정제 완료" },
      ],
    },
    REPORT: {
      content: "**[주간 업무보고 초안 생성 완료]**\n\n---\n\n**민원여권과 주간 업무 실적 보고**\n\n| 구분 | 내용 |\n|------|------|\n| **보고 기간** | 2026. 03. 09.(월) ~ 03. 13.(금) |\n| **작성 부서** | 민원여권과 |\n| **작성자** | 이서연 주무관 |\n\n**가. 주요 실적**\n1. 여권 발급 처리: **412건 완료** (긴급 발급 6건 포함)\n2. 옥외광고물 표시 허가 검토: **8건 완료**\n\n**나. 차주 계획**\n- 외국인 주민 통합민원 창구 운영 개시 준비\n\n---\n⚠️ *AI 생성 초안입니다. 반드시 확인 후 사용하세요.*",
      citations: [],
      steps: [
        { label: "표준 서식 불러오기", detail: "주간 업무보고 한성시 표준 서식 로드 완료" },
        { label: "정보 항목 매핑", detail: "새올 처리 실적을 목차별로 자동 분류 완료" },
        { label: "공문서 개조식 포맷팅", detail: "온나라 기안 서식에 맞게 최종 작성 완료" },
      ],
    },
    SECURE_DEFAULT: {
      confidence: 88,
      content: "**[보안 문서 스캔 완료]**\n\n업로드된 민원 서류 전체를 대상으로 보안 취약점을 점검했습니다.\n\n**✅ 안전 항목**\n- 평문 노출 패스워드: 미발견\n- 주민등록번호 뒷자리 노출: 미발견\n\n**🔐 자동 처리 내역**\n- 연락처(전화번호) 형식 데이터 2건 → 자동 마스킹(***) 처리\n- 신청인 성명 1건 → 벡터 DB 적재 전 마스킹 완료\n\n본 세션의 모든 처리는 행정망 내부 서버에서만 이루어지며 외부 네트워크로 전송되지 않습니다.",
      citations: [], steps: null,
    },
    SECURE_AIRGAP: {
      confidence: 97,
      content: "**[보안 규정 검토 완료]**\n\n행정망 보안 지침 내 망분리 관련 핵심 요건입니다.\n\n- **내부 웹 UI**: 행정망 전용, 인터넷 차단 환경 구축 필수\n- **LLM 서비스**: 외부 클라우드 API 연결 금지, 청사 내 로컬 서버만 허용\n- **벡터 DB**: 행정망 전용 구축, 새올 연계 데이터 외부 전송 금지\n\n✅ 현재 세션: 모든 처리가 행정망 내부에서만 이루어지고 있습니다.",
      citations: [], steps: null,
    },
  },
  /* 에이전트 내부 콘텐츠 — 각 키는 CONTENT_DEFAULTS(각 에이전트 파일)와 shape·항목 수 동일 계약.
     logo/logoSrc(data URI)는 생략(REB 로고 노출되나 화면 로고는 코어가 org 색으로 처리).
     agent-report의 buildPressHtml/buildReportHtml 생략 = 정상 (2026-07-06 데이터 구동화) —
     기본 빌더가 press·report 접두 키 + 도메인 org로 인쇄 HTML을 생성한다. */
  agentContent: {
    "agent-chatbot": {
      welcomeText: "안녕하세요! 한성시 스마트행정 AI 어시스턴트입니다.\n\n민원 처리 절차, 자치법규, 행정 지침 등에 관해 자유롭게 질문해 주세요. 민원사무편람과 한성시 자치법규집을 기반으로 근거 있는 답변을 제공합니다.\n\n**자주 묻는 주제:**\n- 긴급 여권 발급 요건 및 구비서류\n- 옥외광고물 표시 허가 절차\n- 민원 처리기한 및 연장 통지\n- 유연근무 신청 기준",
      welcomeSources: ["한성시 스마트행정 AI 플랫폼 운영지침"],
      sourcePreviews: {
        "여권발급업무지침.pdf": {
          title: "여권 발급 업무 지침", type: "PDF", pages: 64, page: 12, section: "제4장",
          excerpt: [
            { text: "제4장 긴급 여권 발급\n\n", hl: false },
            { text: "친족의 사망·위독 등 인도적 사유 또는 긴급한 상용 출장이 증빙되는 경우, 접수일 포함 최대 48시간 이내에 단수여권을 발급할 수 있다.", hl: true },
            { text: "\n\n구비서류: 여권발급신청서, 여권용 사진 1매, 신분증, 긴급성 증빙서류(사망진단서·출장명령서 등), 수수료 53,000원.", hl: false },
          ],
        },
        "여권법 시행령 제14조": {
          title: "여권법 시행령", type: "LAW", article: "제14조",
          excerpt: [
            { text: "제14조(여권 발급의 신청)\n① ", hl: false },
            { text: "여권의 발급을 신청하려는 사람은 여권발급신청서에 외교부령으로 정하는 서류를 첨부하여 외교부장관 또는 여권 사무를 위임받은 지방자치단체의 장에게 제출하여야 한다.", hl: true },
            { text: "\n② 긴급한 사유가 있는 경우에는 그 사유를 증명하는 서류를 함께 제출하여야 한다.", hl: false },
          ],
        },
        "한성시 옥외광고물 관리 조례 제7조": {
          title: "한성시 옥외광고물 관리 조례", type: "LAW", article: "제7조·제9조",
          excerpt: [
            { text: "제7조(허가 대상)\n", hl: false },
            { text: "벽면 이용 간판 중 한 변의 길이가 10미터 이상인 것, 지주 이용 간판 중 높이 4미터를 초과하는 것, 옥상간판 전체는 시장의 허가를 받아야 한다.", hl: true },
            { text: "\n\n제9조(처리 기한) 허가 신청은 접수일부터 7 근무일 이내에 처리한다. 보완 요구 기간은 처리 기한에 산입하지 아니한다.", hl: false },
          ],
        },
        "민원사무편람_2026.pdf": {
          title: "민원사무편람 2026 개정판", type: "PDF", pages: 218, page: 34, section: "제3편",
          excerpt: [
            { text: "제3편 인허가 민원\n\n3.2 옥외광고물 표시 허가\n", hl: false },
            { text: "신청 서류: 허가신청서, 배치도·디자인 도안, 구조 안전 확인서(높이 4m 초과 시). 수수료는 표시면적 기준으로 산정한다(조례 별표 2).", hl: true },
            { text: "\n\n안전점검 대상 광고물은 매년 정기점검 결과를 보고하여야 한다(조례 제18조).", hl: false },
          ],
        },
        "민원 처리에 관한 법률 제17조": {
          title: "민원 처리에 관한 법률", type: "LAW", article: "제17조·제21조",
          excerpt: [
            { text: "제17조(법정민원의 처리기간 설정·공표)\n① ", hl: false },
            { text: "행정기관의 장은 법정민원을 신속히 처리하기 위하여 행정기관에 법정민원의 처리기간을 종류별로 미리 정하여 공표하여야 한다.", hl: true },
            { text: "\n\n제21조(민원 처리의 예외) 처리기간을 연장하는 경우에는 그 사유와 처리 완료 예정일을 민원인에게 통지하여야 한다.", hl: false },
          ],
        },
        "한성시 민원 처리에 관한 조례": {
          title: "한성시 민원 처리에 관한 조례", type: "LAW", article: "제12조",
          excerpt: [
            { text: "제12조(처리 기한 및 연장)\n① 일반민원의 처리 기한은 접수일부터 7 근무일로 한다.\n② ", hl: false },
            { text: "부득이한 사유로 처리 기한을 연장하는 경우 1회에 한하여 7 근무일의 범위에서 연장할 수 있으며, 연장 사유와 완료 예정일을 새올행정시스템에 등록하고 민원인에게 통지하여야 한다.", hl: true },
            { text: "\n③ 반복 민원은 3회 이상 동일 내용 접수 시 종결 처리할 수 있다.", hl: false },
          ],
        },
        "한성시_복무규정 제31조": {
          title: "한성시 복무규정 (2025개정)", type: "HWP", page: 22, section: "제31조",
          excerpt: [
            { text: "제31조(유연근무)\n① ", hl: false },
            { text: "직원은 시차출퇴근형·근무시간선택형 유연근무를 신청할 수 있으며, 부서장은 민원 창구 운영에 지장이 없는 범위에서 이를 승인한다. 신청은 시행 7일 전까지 새올 복무관리에 등록한다.", hl: true },
            { text: "\n② 민원 창구 근무자는 창구 운영시간(09:00~18:00) 필수 인원을 확보한 후 승인한다.", hl: false },
          ],
        },
        "개인정보 처리방침 제5조": {
          title: "한성시 개인정보 처리방침", type: "PDF", section: "제5조",
          excerpt: [
            { text: "제5조(개인정보의 보유 기간)\n", hl: false },
            { text: "AI 플랫폼 이용 기록(채팅 내용, 접속 로그)은 보안 정책에 따라 최대 90일간 행정망 내부 서버에 보관되며, 이후 자동 파기된다.", hl: true },
            { text: "\n단, 법령에 따라 보존이 필요한 경우 해당 기간 동안 별도 보관한다. 이용 기록은 감사 목적의 관리자 열람 외에는 제3자에게 제공되지 않는다.", hl: false },
          ],
        },
        "정보보안 운영 정책 3장": {
          title: "한성시 정보보안 운영 정책", type: "PDF", section: "제12·13조",
          excerpt: [
            { text: "제3장 AI 시스템 보안\n\n제12조(사용 이력 관리)\n", hl: false },
            { text: "AI 플랫폼의 모든 대화 이력은 행정망 전용 서버에 암호화하여 저장된다. 보안 채팅(SECURE 탭) 이용 시에는 세션 종료와 함께 해당 세션의 대화 내용이 즉시 삭제된다.", hl: true },
            { text: "\n\n제13조(접근 제어)\n관리자는 감사 목적으로만 이용 이력을 열람할 수 있으며, 무단 열람 시 징계 처분을 받는다.", hl: false },
          ],
        },
        "정보보안 운영 정책 제7조": {
          title: "한성시 정보보안 운영 정책", type: "PDF", section: "제7조",
          excerpt: [
            { text: "제7조(비공개 문서 처리)\n", hl: false },
            { text: "비공개 대상 문서를 AI 플랫폼에서 처리할 경우, 반드시 SECURE 탭(보안 채팅)을 이용하여야 한다. SECURE 탭에서는 행정망 전용 모델만 사용되며, 클라우드 모델로의 데이터 전송이 차단된다.", hl: true },
            { text: "\n\n대외비(C) 등급 이상의 문서 처리 시에는 정보보안담당관의 사전 승인이 필요하다.", hl: false },
          ],
        },
        "개인정보보호 업무지침": {
          title: "한성시 개인정보보호 업무지침", type: "PDF", section: "제8조",
          excerpt: [
            { text: "제8조(AI 시스템 이용 시 준수 사항)\n", hl: false },
            { text: "AI 플랫폼에서 비공개 문서를 처리한 결과물은 외부 저장 매체에 저장하거나 출력할 수 없다. 처리 결과는 업무 목적으로만 활용하여야 하며, 세션 종료 시 자동 삭제된다.", hl: true },
            { text: "\n\n위반 시 개인정보 보호법 및 한성시 개인정보 처리 지침에 따른 징계 절차가 진행된다.", hl: false },
          ],
        },
        "한성시 자치법규집": {
          title: "한성시 자치법규집 (2026)", type: "PDF", pages: 342, page: 5, section: "총목차",
          excerpt: [
            { text: "한성시 자치법규집 총목차\n\n", hl: false },
            { text: "조례 128건, 규칙 54건, 훈령·예규 37건 수록. 최신 개정 사항은 자치법규 정보시스템에서 실시간 확인할 수 있다.", hl: true },
            { text: "\n\n주요 조례: 민원 처리에 관한 조례, 옥외광고물 관리 조례, 행사장 안전관리 조례, 공유재산 관리 조례 등.", hl: false },
          ],
        },
        "한성시 스마트행정 AI 플랫폼 운영지침": {
          title: "스마트행정 AI 플랫폼 운영지침", type: "PDF", section: "제1·2조",
          excerpt: [
            { text: "제1조(목적)\n이 지침은 ", hl: false },
            { text: "한성시 스마트행정 생성형 AI 플랫폼의 안전하고 효율적인 운영을 위한 기준과 절차를 정함을 목적으로 한다.", hl: true },
            { text: "\n\n제2조(적용 범위)\n이 지침은 한성시 소속 공무원 전원에게 적용되며, AI 플랫폼의 모든 기능(챗봇, 보고서, 회의록, OCR 등)에 적용된다.", hl: false },
          ],
        },
      },
      faqItems: [
        {
          id: "f1", q: "긴급 여권 발급 요건과 처리 기한은?", category: "민원처리",
          a: "**긴급 여권 발급**은 인도적 사유·긴급 상용 출장에 한해 가능합니다.\n\n**요건 및 처리:**\n- 대상: 친족 사망·위독, 긴급 출장 (증빙 필수)\n- 처리 기한: 접수일 포함 **최대 48시간** (일반 여권 4~5 근무일)\n- 구비서류: 신청서, 사진 1매, 신분증, 긴급성 증빙서류\n- 수수료: 53,000원 (단수여권)\n\n**접수처:** 시청 1층 민원여권과 3~5번 창구 (평일 09:00~18:00)",
          sources: ["여권발급업무지침.pdf", "여권법 시행령 제14조"],
        },
        {
          id: "f2", q: "옥외광고물 표시 허가 절차를 알려주세요.", category: "인허가",
          a: "옥외광고물 표시 허가 절차는 다음과 같습니다.\n\n**1. 허가 대상 확인**\n- 벽면 간판 한 변 10m 이상 / 지주 간판 4m 초과 / 옥상간판 전체\n\n**2. 신청 서류**\n- 허가신청서, 배치도·디자인 도안\n- 구조 안전 확인서 (높이 4m 초과 시)\n\n**3. 처리**\n- 처리 기한: 접수일부터 **7 근무일** (보완 요구 시 중단)\n- 수수료: 표시면적 기준 산정 (조례 별표 2)",
          sources: ["한성시 옥외광고물 관리 조례 제7조", "민원사무편람_2026.pdf"],
        },
        {
          id: "f3", q: "민원 처리기한 연장은 어떻게 하나요?", category: "민원처리",
          a: "**민원 처리기한 연장**은 조례 제12조에 따라 처리합니다.\n\n- 연장 횟수: **1회 한정**\n- 연장 범위: **7 근무일 이내**\n- 절차: 연장 사유·완료 예정일을 **새올행정시스템에 등록** 후 민원인에게 통지\n- 통지 방법: 서면·전화·알림톡 중 민원인이 선택한 방법\n\n※ 연장 통지 누락은 감사 지적 단골 항목입니다. 처리기한 도래 2일 전 새올 알림을 확인하세요.",
          sources: ["민원 처리에 관한 법률 제17조", "한성시 민원 처리에 관한 조례"],
        },
        {
          id: "f4", q: "유연근무 신청 기준이 어떻게 되나요?", category: "복무규정",
          a: "**유연근무 신청 기준** (한성시 복무규정 제31조):\n\n| 구분 | 내용 |\n|------|------|\n| 유형 | 시차출퇴근형·근무시간선택형 |\n| 신청 기한 | 시행 **7일 전**까지 |\n| 등록 | 새올 복무관리 시스템 |\n| 승인권자 | 부서장 |\n\n※ 민원 창구 근무자는 창구 운영시간(09:00~18:00) 필수 인원 확보 후 승인됩니다.",
          sources: ["한성시_복무규정 제31조"],
        },
        {
          id: "f5", q: "AI 플랫폼 사용 이력은 저장되나요?", category: "시스템",
          a: "사용 이력은 보안 정책에 따라 **최대 90일**간 행정망 내부 서버에 보관됩니다.\n\n- 타 부서·상급자에 자동 공유되지 않습니다\n- 감사 목적으로만 관리자 열람 가능\n- 보안 채팅(SECURE 탭) 이용 시 세션 종료와 함께 즉시 삭제",
          sources: ["개인정보 처리방침 제5조", "정보보안 운영 정책 3장"],
        },
        {
          id: "f6", q: "비공개 문서는 어떻게 처리하나요?", category: "보안",
          a: "비공개 문서 처리 절차:\n\n**1. 접근 권한 확인**\n- 대외비(C): 해당 부서원 이상\n- 비공개 대상: 정보보안담당관 사전 승인 필요\n\n**2. 처리 원칙**\n- 반드시 SECURE 탭(보안 채팅) 사용\n- 행정망 전용 모델만 사용 (클라우드 모델 차단)\n- 처리 결과 세션 종료 시 자동 삭제\n\n**3. 출력·저장 금지**\n- 결과물 외부 저장·출력 금지",
          sources: ["정보보안 운영 정책 제7조", "개인정보보호 업무지침"],
        },
      ],
      faqCategories: ["민원처리", "인허가", "복무규정", "보안", "시스템"],
      faqCategoryColors: {
        "민원처리": "bg-blue-100 text-blue-700",
        "인허가":   "bg-emerald-100 text-emerald-700",
        "복무규정": "bg-amber-100 text-amber-700",
        "보안":     "bg-rose-100 text-rose-700",
        "시스템":   "bg-violet-100 text-violet-700",
      },
      delegateRules: [
        { keywords: ["보고서", "작성", "기안"],   agentId: "agent-report",      agentName: "보고서·보도자료 에이전트", reason: "시정 보고서 자동 작성 전문 에이전트입니다." },
        { keywords: ["회의", "녹음", "회의록"],   agentId: "agent-meeting",     agentName: "회의록 작성 에이전트",     reason: "음성 기반 회의록 작성 전문입니다." },
        { keywords: ["조례", "규칙", "훈령"],     agentId: "agent-internalreg", agentName: "조례·규칙 조회 에이전트",  reason: "자치법규 조항 근거 제시 전문입니다." },
        { keywords: ["OCR", "스캔", "이미지"],    agentId: "agent-ocr",         agentName: "공문서 OCR 에이전트",      reason: "민원 신청서·종이 공문서 텍스트 추출 전문입니다." },
        { keywords: ["요약", "정리", "줄여"],     agentId: "agent-summary",     agentName: "문서 요약 에이전트",       reason: "보고서·용역 문서 요약 전문 에이전트입니다." },
        { keywords: ["데이터", "엑셀", "분석"],   agentId: "agent-dataanalysis", agentName: "시정 데이터 분석 에이전트", reason: "민원·예산 데이터 분석·시각화 전문입니다." },
      ],
      correctionExample: '예: "긴급 여권 발급 구비서류가 어떻게 되나요?"',
      suggestQuestions: [
        "긴급 여권 발급 요건과 처리 기한은?",
        "옥외광고물 표시 허가 절차를 알려주세요.",
        "민원 처리기한 연장은 어떻게 하나요?",
      ],
      fallbackAnswerBody: "한성시 민원사무편람 및 자치법규를 검토한 결과, 관련 내용을 정리해 드립니다.\n\n현재 질문하신 내용과 관련하여 민원사무편람, 자치법규집, 행정 지침 등을 검색하였습니다. 보다 정확한 답변을 위해 구체적인 민원 유형이나 관련 서식명을 함께 알려주시면 더 상세한 안내가 가능합니다.\n\n**참고 자료:**\n- 민원사무편람 2026 개정판\n- 한성시 자치법규집 (조례 128건·규칙 54건)\n- 민원 처리에 관한 법률",
      fallbackSources: ["민원사무편람_2026.pdf", "한성시 자치법규집"],
      headerSubtitle: "민원사무편람 · 자치법규 · 행정 지침 기반 응답",
      inputPlaceholder: "민원 처리 절차나 자치법규에 대해 자유롭게 질문하세요...",
      quickAgents: [
        { label: "회의록 작성 에이전트",   id: "agent-meeting",     color: "bg-purple-100 text-purple-700" },
        { label: "보고서·보도자료 에이전트", id: "agent-report",     color: "bg-emerald-100 text-emerald-700" },
        { label: "조례·규칙 조회 에이전트", id: "agent-internalreg", color: "bg-amber-100 text-amber-700" },
      ],
    },
    "agent-knowledge": {
      defaultQuery: "옥외광고물 설치 허가 처리 기한 및 수수료",
      quickQueries: ["긴급 여권 발급 요건", "민원 처리기한 연장 절차", "유연근무 신청 기준", "행사장 안전관리 절차"],
      knowledgeBases: [
        { id: "kb1", name: "민원사무편람 2026",         docs: 47,  updated: "2026.01.05", icon: BookOpen,   color: "violet" },
        { id: "kb2", name: "한성시 자치법규집",          docs: 112, updated: "2026.02.20", icon: BookMarked, color: "blue" },
        { id: "kb3", name: "옥외광고물 관리 조례",       docs: 9,   updated: "2025.11.28", icon: FileText,   color: "indigo" },
        { id: "kb4", name: "여권 발급 업무 지침",        docs: 23,  updated: "2026.01.15", icon: BookOpen,   color: "teal" },
        { id: "kb5", name: "한성시 복무규정",            docs: 14,  updated: "2026.02.10", icon: FileText,   color: "emerald" },
        { id: "kb6", name: "행사장 안전관리 매뉴얼",     docs: 18,  updated: "2026.03.02", icon: BookOpen,   color: "emerald" },
        { id: "kb7", name: "감사 사례집 (2023~2025)",    docs: 31,  updated: "2025.12.18", icon: BookOpen,   color: "cyan" },
      ],
      defaultSelectedKbIds: ["kb1", "kb2", "kb3"],
      recentSearches: [
        { id: 1, query: "옥외광고물 안전점검 주기",   date: "2026-03-31 16:20", results: 5 },
        { id: 2, query: "여권 수수료 감면 대상",      date: "2026-03-30 10:12", results: 3 },
        { id: 3, query: "반복 민원 종결 처리 기준",   date: "2026-03-28 14:55", results: 7 },
      ],
      results: [
        {
          id: 1, title: "옥외광고물 표시 허가 처리 기준", source: "옥외광고물_관리조례.pdf",
          page: 7, score: 97.3, secLevel: "C", line: "p.7 · 제9조 본문",
          excerpt: "허가 신청은 접수일부터 7 근무일 이내에 처리한다. 보완 요구 기간은 처리 기한에 산입하지 아니하며, 수수료는 표시면적을 기준으로 별표 2에 따라 산정한다.",
          keywords: ["허가", "7 근무일", "수수료", "별표 2"],
        },
        {
          id: 2, title: "인허가 민원 접수·처리 절차", source: "민원사무편람_2026.pdf",
          page: 34, score: 89.1, secLevel: "C", line: "p.34 · 2번째 문단",
          excerpt: "인허가 민원은 새올행정시스템에 접수 즉시 등록하고, 처리 부서 배정 후 담당 주무관이 검토 의견을 작성한다. 현장 확인이 필요한 경우 접수일부터 3 근무일 이내에 방문 일정을 통지한다.",
          keywords: ["인허가", "새올", "현장 확인", "검토 의견"],
        },
        {
          id: 3, title: "수수료 산정 및 감면 기준", source: "옥외광고물_관리조례.pdf",
          page: 21, score: 78.6, secLevel: "C", line: "p.21 · 별표 2",
          excerpt: "표시면적 5제곱미터 이하 30,000원, 5제곱미터 초과 시 1제곱미터당 5,000원 가산. 소상공인·전통시장 상인은 수수료의 100분의 50을 감면한다.",
          keywords: ["수수료", "표시면적", "감면", "소상공인"],
        },
        {
          id: 4, title: "옥외광고물 등의 관리와 옥외광고산업 진흥에 관한 법률 제3조", source: "옥외광고물법",
          page: 3, score: 71.2, secLevel: "O", line: "p.3 · 제3조 본문",
          excerpt: "광고물 등을 표시하거나 설치하려는 자는 대통령령으로 정하는 바에 따라 시장·군수·구청장에게 허가를 받거나 신고하여야 한다. 허가 또는 신고 사항을 변경하려는 경우에도 또한 같다.",
          keywords: ["시장·군수", "허가", "신고", "변경"],
        },
        {
          id: 5, title: "허가 민원 처리 결과 통지", source: "민원사무편람_2026.pdf",
          page: 41, score: 62.4, secLevel: "O", line: "p.41 · 4번째 문단",
          excerpt: "허가 여부가 결정되면 지체 없이 새올행정시스템에 처리 결과를 등록하고, 민원인이 선택한 방법(서면·전화·알림톡)으로 통지한다. 불허가 시에는 그 사유와 이의 제기 절차를 함께 안내한다.",
          keywords: ["처리 결과", "통지", "불허가", "알림톡"],
        },
      ],
      aiSummaries: {
        "옥외광고물 설치 허가 처리 기한 및 수수료": "검색 결과 5건에 따르면, 옥외광고물 표시 허가의 처리 기한은 접수일부터 7 근무일이며 보완 요구 기간은 산입되지 않습니다. 수수료는 표시면적 기준(5㎡ 이하 30,000원, 초과 시 ㎡당 5,000원 가산)으로 산정되고, 소상공인·전통시장 상인은 50% 감면됩니다.",
        DEFAULT: "검색 결과를 분석한 결과, 관련 문서 5건에서 연관 내용을 찾았습니다. 상세 내용은 아래 검색 결과를 확인하세요.",
      },
      similarDocs: [
        { title: "옥외광고물 안전점검 운영 지침", source: "안전점검_운영지침.pdf",   relevance: 84 },
        { title: "한성시 수수료 징수 조례 별표",  source: "수수료징수조례.pdf",      relevance: 79 },
        { title: "인허가 민원 표준 처리 절차도",  source: "민원사무편람_2026.pdf",  relevance: 71 },
      ],
    },
    "agent-internalreg": {
      regCategories: ["복무 조례·규칙", "민원 처리 조례", "재무회계 규칙", "개인정보 처리 지침", "옥외광고물 관리 조례", "공유재산 관리 조례", "행사장 안전관리 조례", "위임전결 규정"],
      defaultCategories: ["복무 조례·규칙", "민원 처리 조례"],
      suggestions: ["유연근무 신청 기준", "민원 처리기한 연장 절차", "수의계약 한도", "출장 여비 정산", "당직 근무 편성"],
      ragDocs: [
        { name: "한성시_복무규정(2025개정).hwp", hits: 12 },
        { name: "민원처리조례_해설집.pdf",       hits: 9 },
        { name: "위임전결규정(2026).pdf",        hits: 7 },
        { name: "재무회계규칙.pdf",              hits: 3 },
        { name: "당직및비상근무규칙.pdf",        hits: 6 },
      ],
      apvLine: [
        { role: "작성자", name: "이서연", dept: "민원여권과", title: "주무관" },
        { role: "검토자", name: "김도윤", dept: "민원여권과", title: "민원지원팀장" },
        { role: "승인자", name: "박정호", dept: "민원여권과", title: "과장" },
      ],
      answerText: `민원 처리기한을 연장해야 하는 경우, 민원 처리에 관한 법률 및 한성시 민원 처리에 관한 조례에 따라 다음 절차를 이행하여야 합니다.

1. 연장 요건 확인: 처리기한 연장은 부득이한 사유(현장 확인 지연, 관계 기관 협의 등)가 있는 경우에 한하며, 1회에 한하여 7 근무일의 범위에서 가능합니다 (조례 제12조 제2항).

2. 새올 등록: 처리기한 도래 전에 새올행정시스템 민원처리 화면에서 연장 사유와 처리 완료 예정일을 등록합니다. 기한 경과 후 소급 등록은 감사 지적 대상입니다.

3. 민원인 통지: 연장 등록과 동시에 민원인이 선택한 방법(서면·전화·알림톡)으로 연장 사유와 완료 예정일을 통지합니다 (민원 처리에 관한 법률 제21조).

4. 결재 처리: 연장 통지문은 온나라 전자결재로 팀장 검토 후 과장 전결 처리합니다 (위임전결 규정 별표 1 제4호).

5. 사후 관리: 연장된 민원은 새올 미결 현황에서 별도 관리되며, 완료 예정일 2일 전 자동 알림이 발송됩니다. 재연장은 불가하므로 기한 내 처리 곤란 시 부서장에게 즉시 보고합니다.`,
      citations: [
        { doc: "한성시 민원 처리에 관한 조례 제12조", title: "처리 기한 및 연장", excerpt: '"부득이한 사유로 처리 기한을 연장하는 경우 1회에 한하여 7 근무일의 범위에서 연장할 수 있으며, 연장 사유와 완료 예정일을 새올행정시스템에 등록하고 민원인에게 통지하여야 한다."' },
        { doc: "민원 처리에 관한 법률 제21조", title: "처리 진행 상황 통지", excerpt: '"행정기관의 장은 처리기간을 연장한 경우 그 사유와 처리 완료 예정일을 지체 없이 민원인에게 통지하여야 한다."' },
        { doc: "위임전결 규정 별표 1 제4호", title: "민원 관련 전결 사항", excerpt: '"민원 처리기한 연장 통지는 과장 전결 사항으로 한다. 다만 동일 민원의 반복 연장 협의는 국장 결재를 받아야 한다."' },
      ],
      relatedRegs: [
        { title: "한성시 민원 처리에 관한 조례 제13조", desc: "반복·중복 민원의 종결 처리 기준 및 절차" },
        { title: "민원 처리에 관한 법률 제23조",        desc: "민원 처리 결과의 통지 방법 및 전자적 통지" },
        { title: "새올행정시스템 운영 지침 제6조",      desc: "민원 미결 현황 관리 및 자동 알림 설정" },
      ],
      regHistory: [
        {
          reg: "민원 처리에 관한 조례",
          changes: [
            { ver: "2025.10 개정", date: "2025-10-01", type: "개정",     badge: "bg-blue-100 text-blue-700",   content: "제12조(처리 기한): 연장 통지 방법에 알림톡 추가, 새올 등록 의무 명시", reason: "비대면 통지 수요 반영" },
            { ver: "2024.03 개정", date: "2024-03-01", type: "일부개정", badge: "bg-slate-100 text-slate-600", content: "제13조 신설 — 반복 민원 3회 이상 접수 시 종결 처리 근거 마련", reason: "민원 처리에 관한 법률 개정 반영" },
            { ver: "2022.07 개정", date: "2022-07-01", type: "일부개정", badge: "bg-slate-100 text-slate-600", content: "제12조 개정 — 일반민원 처리 기한 10일 → 7 근무일로 단축", reason: "민원 서비스 개선 종합대책" },
          ],
        },
        {
          reg: "복무규정",
          changes: [
            { ver: "2025.09 개정", date: "2025-09-01", type: "개정",     badge: "bg-blue-100 text-blue-700",   content: "제31조(유연근무): 신청 기한 10일 전 → 7일 전으로 완화, 새올 복무관리 등록 일원화", reason: "일·가정 양립 지원 강화" },
            { ver: "2024.01 개정", date: "2024-01-01", type: "일부개정", badge: "bg-slate-100 text-slate-600", content: "제18조 개정 — 재택근무 중 사고를 공무상 재해와 동일 기준으로 처리", reason: "근무 형태 다양화 대응" },
          ],
        },
        {
          reg: "위임전결 규정",
          changes: [
            { ver: "2026.01 개정", date: "2026-01-01", type: "개정",     badge: "bg-emerald-100 text-emerald-700", content: "별표 1 개정 — AI 플랫폼 생성 문서의 검토·확정 절차 신설, 전결권 명확화", reason: "스마트행정 AI 플랫폼 도입 대응" },
            { ver: "2025.01 개정", date: "2025-01-01", type: "일부개정", badge: "bg-slate-100 text-slate-600",     content: "별표 1 제4호: 민원 연장 통지 전결권 국장 → 과장으로 하향", reason: "신속 처리 및 책임행정 강화" },
          ],
        },
      ],
      emptyDesc: ["복무 조례, 민원 처리 조례, 위임전결 규정 등", "한성시 자치법규와 내부 규정을 검색합니다"],
      inputPlaceholder: "조례, 규칙, 훈령·예규 등 자치법규에 대해 질문하세요 (Enter로 전송)",
      regSystemFooter: "한성시 자치법규 정보시스템 연동 · 최신 개정 기준 자동 반영",
      apvDocTitle: "자치법규 조회 결과 — 민원 처리기한 연장 절차",
      apvDocNum: "HSC-민원여권과-2026-019",
    },
    "agent-review": {
      apvLine: [
        { name: "이서연", dept: "민원여권과", title: "주무관",       role: "작성자" },
        { name: "김도윤", dept: "민원여권과", title: "민원지원팀장", role: "검토자" },
        { name: "박정호", dept: "민원여권과", title: "과장",         role: "승인자" },
      ],
      ragDocs: [
        "재무회계 규칙 제25조 (수의계약 기준)",
        "민원 처리에 관한 조례 제12조 (처리 기한)",
        "위임전결 규정 별표 1 (전결 사항)",
        "개인정보 처리 지침 제9조 (수집·이용 동의)",
        "복무규정 제24조 (출장 여비 기준)",
        "옥외광고물 관리 조례 제9조 (허가 처리)",
        "행사장 안전관리 조례 제5조 (안전계획 수립)",
      ],
      violations: [
        {
          clause: "재무회계 규칙 제25조 제2항",
          type: "수의계약 한도 초과",
          severity: "high",
          content: "축제 홍보물 제작·설치 견적액이 수의계약 한도(2,000만원) 대비 23% 초과 계상. 한도 초과 시 지명경쟁 입찰 절차가 필요함.",
          action: "계약 방식을 지명경쟁 입찰로 변경하거나, 제작·설치 분리 발주 검토 후 재상신 요망.",
        },
        {
          clause: "민원 처리에 관한 조례 제12조 제2항",
          type: "처리기한 연장 통지 누락",
          severity: "medium",
          content: "허가 검토 지연에 따른 처리기한 연장 사유가 새올행정시스템에 미등록. 민원인 통지 기록도 확인되지 않음.",
          action: "새올 연장 등록 및 민원인 통지(알림톡) 완료 후 증빙 첨부 요망.",
        },
        {
          clause: "개인정보 처리 지침 제9조",
          type: "개인정보 동의서 미첨부",
          severity: "low",
          content: "행사 참여 업체 대표자 연락처 수집 시 개인정보 수집·이용 동의서 미첨부. 경미한 절차적 하자.",
          action: "개인정보 동의서(별지 제9호) 사후 징구 및 파일 첨부.",
        },
      ],
      regs: [
        { id: "r1", label: "복무 조례·규칙" },
        { id: "r2", label: "민원 처리 조례" },
        { id: "r3", label: "재무회계 규칙" },
        { id: "r4", label: "개인정보 처리 지침" },
        { id: "r5", label: "옥외광고물 관리 조례" },
      ],
      highlightSegs: [
        { text: "한성 벚꽃축제 홍보물 제작·설치 지출 품의서\n\n행사 기간: 2026. 04. 03. ~ 2026. 04. 12. (10일)\n행사 장소: 호수동 호수공원 일원\n담당 부서: 민원여권과 (축제 홍보 지원)\n\n━━ 지출 내역 ━━\n현수막 게시대 12개소 게첨: 4,800,000원\n안내 배너·홍보 부스 제작: 6,200,000원\n", type: null },
        { text: "대형 홍보탑 제작·설치 1식: 13,600,000원\n합  계: 24,600,000원 — 수의계약 한도 2,000만원 대비 23% 초과", type: "high" },
        { text: "\n\n━━ 첨부 서류 ━━\n✔ 견적서 3사 비교표\n✔ 홍보물 디자인 시안\n✔ 게시대 배치도\n", type: null },
        { text: "✘ 새올 처리기한 연장 등록 내역 — 미등록 (허가 검토 지연 건)", type: "medium" },
        { text: "\n\n━━ 참여 업체 정보 ━━\n상  호: 한성기획인쇄\n소재지: 한성시 중앙동 24-7\n", type: null },
        { text: "대표자 연락처: 010-5678-1234 (개인정보 수집·이용 동의서 미첨부)", type: "low" },
        { text: "\n\n━━ 품 의 ━━\n위와 같이 축제 홍보물 제작·설치 비용을 지출하고자 품의합니다.\n\n2026년 3월 20일\n민원여권과 이서연 주무관 (인)", type: null },
      ],
      highlightLegendLabels: { high: "높음 — 계약 한도 초과", medium: "중간 — 새올 등록 누락", low: "낮음 — 절차 미비" },
      highlightDocTitle: "한성 벚꽃축제 홍보물 제작·설치 지출 품의서",
      reviewNum: "검토-2026-018",
      dept: "민원여권과",
      docNum: "HSC-민원여권과-2026-047",
      apvDocNum: "HSC-민원여권과-2026-048",
      logoAlt: "한성시청",
    },
    "agent-translate": {
      sourceText: `한성시는 「민원 처리에 관한 법률」 및 한성시 민원 처리에 관한 조례에 따라 2026년 4월 1일부터 외국인 주민 통합민원 창구를 운영합니다. 통합민원 창구는 시청 1층 민원여권과 6번 창구이며, 평일 09:00부터 18:00까지 이용할 수 있습니다.

통합민원 창구에서는 체류지 변경 신고, 외국인등록사실증명 발급, 긴급 여권 관련 안내 등 총 12종의 민원을 처리합니다. 일반민원의 처리 기한은 접수일부터 7 근무일이며, 증명서 발급은 방문 당일 즉시 처리됩니다.

통역 지원(영어·중국어·일본어·베트남어)은 사전 예약제로 운영되며, 방문 3일 전까지 정부24 또는 전화로 신청하시기 바랍니다. 기초생활수급자 및 다문화가족은 제증명 발급 수수료가 면제됩니다.`,
      translatedText: `In accordance with the Civil Petitions Treatment Act and the Hansung City Ordinance on Civil Petition Processing, Hansung City will operate an Integrated Civil Service Desk for foreign residents starting April 1, 2026. The desk is located at Window 6 of the Civil Affairs & Passport Division on the 1st floor of City Hall, open weekdays from 09:00 to 18:00.

The Integrated Desk handles a total of 12 types of civil petitions, including reports of change of residence, issuance of certificates of alien registration, and guidance on emergency passport services. The processing period for general petitions is 7 working days from the date of receipt, and certificates are issued on the spot.

Interpretation services (English, Chinese, Japanese, Vietnamese) are available by advance reservation; please apply via Government24 or by phone at least 3 days before your visit. Certificate issuance fees are waived for basic livelihood security recipients and multicultural families.`,
      chunks: [
        { id: 1, text: "한성시는 「민원 처리에 관한 법률」 및 한성시 민원 처리에 관한 조례에 따라 2026년 4월 1일부터 외국인 주민 통합민원 창구를 운영합니다." },
        { id: 2, text: "통합민원 창구는 시청 1층 민원여권과 6번 창구이며, 평일 09:00부터 18:00까지 이용할 수 있습니다." },
        { id: 3, text: "체류지 변경 신고, 외국인등록사실증명 발급, 긴급 여권 관련 안내 등 총 12종의 민원을 처리합니다." },
        { id: 4, text: "일반민원의 처리 기한은 접수일부터 7 근무일이며, 증명서 발급은 방문 당일 즉시 처리됩니다." },
        { id: 5, text: "통역 지원은 사전 예약제로 운영되며, 기초생활수급자 및 다문화가족은 수수료가 면제됩니다." },
      ],
      summaryKo: `2026년 4월 1일부터 시청 1층 민원여권과 6번 창구에서 외국인 주민 통합민원 창구 운영. 체류지 변경 신고 등 12종 민원 처리, 일반민원 7 근무일·증명서 즉시 발급. 4개 언어 통역 사전 예약제, 수급자·다문화가족 수수료 면제.`,
      summaryEn: `From April 1, 2026, Hansung City operates an Integrated Civil Service Desk for foreign residents (Window 6, City Hall 1F). It handles 12 petition types; general petitions take 7 working days, certificates issued on the spot. Interpretation in 4 languages by reservation; fees waived for welfare recipients and multicultural families.`,
      backTranslated: `한성시는 「민원 처리에 관한 법률」과 한성시 민원 처리 조례에 근거하여 2026년 4월 1일부터 외국인 주민을 위한 통합민원 창구를 운영합니다. 해당 창구는 시청 1층 민원여권과 6번 창구에 위치하며, 평일 09:00~18:00에 이용 가능합니다.

통합 창구에서는 체류지 변경 신고, 외국인등록사실증명 발급, 긴급 여권 안내를 포함한 총 12종의 민원을 처리합니다. 일반민원 처리 기간은 접수일로부터 7 근무일이며, 증명서는 현장에서 즉시 발급됩니다.

통역 서비스(영어, 중국어, 일본어, 베트남어)는 사전 예약으로 이용 가능하며, 방문 최소 3일 전까지 정부24 또는 전화로 신청해야 합니다. 기초생활수급자와 다문화가족은 증명서 발급 수수료가 면제됩니다.`,
      glossary: [
        { ko: "민원",           en: "Civil Petition",                  category: "행정" },
        { ko: "조례",           en: "Municipal Ordinance",             category: "법규" },
        { ko: "전입신고",       en: "Move-in Report",                  category: "민원" },
        { ko: "체류지 변경 신고", en: "Report of Change of Residence",  category: "민원" },
        { ko: "처리 기한",       en: "Processing Deadline",             category: "행정" },
        { ko: "구비서류",       en: "Required Documents",              category: "민원" },
        { ko: "수수료 면제",     en: "Fee Waiver",                      category: "행정" },
        { ko: "인허가",         en: "Permits and Authorizations",      category: "법규" },
      ],
    },
    "agent-summary": {
      docAName: "민원사무편람_2026.pdf",
      docBName: "민원사무편람_2026_개정안.pdf",
      resultDocLabel: "민원사무편람_2026.pdf",
      resultCompareLabel: "편람_2026.pdf  vs  편람_개정안.pdf",
      structureHints: ["제1편 총칙", "제2편 민원 접수·처리", "제3편 인허가 민원", "제4편 처리 결과 통지..."],
      summaryStats: [
        { label: "원문", val: "21,480자" },
        { label: "요약", val: "920자" },
        { label: "압축률", val: "95.7%" },
        { label: "섹션", val: "5개" },
      ],
      compareStats: [
        { label: "비교 항목", val: "8개" },
        { label: "변경 항목", val: "6개" },
        { label: "동일 항목", val: "2개" },
        { label: "주요 차이", val: "기한 단축" },
      ],
      compareRows: [
        { category: "적용 대상",       docA: "법정민원·일반민원 전체 (214종)", docB: "법정민원·일반민원 + 온라인 신청형 민원 (238종)", diff: "대상 확대" },
        { category: "접수 채널",       docA: "창구·우편·팩스",                 docB: "창구·우편·팩스 + 정부24·알림톡 접수",             diff: "채널 추가" },
        { category: "일반민원 처리기한", docA: "접수일부터 7 근무일",           docB: "접수일부터 5 근무일 (AI 사전 검토 2일 단축)",     diff: "기한 단축" },
        { category: "연장 통지 방법",   docA: "서면·전화 통지",                docB: "서면·전화 + 알림톡 병행 통지 의무화",            diff: "통지 강화" },
        { category: "반복 민원 기준",   docA: "3회 이상 접수 시 종결 가능",     docB: "3회 이상 접수 시 종결 가능 (동일)",              diff: "동일" },
        { category: "온라인 접수 목표", docA: "전체 접수의 50%",               docB: "전체 접수의 70% (2027년까지)",                   diff: "목표 상향" },
        { category: "수수료 감면",      docA: "감면 대상 6개 유형",             docB: "감면 대상 6개 유형 (동일)",                      diff: "동일" },
        { category: "기록 보존",        docA: "새올 등록 후 5년 보존",          docB: "새올 등록 후 10년 보존 (전자 기록 강화)",         diff: "기간 연장" },
      ],
      docALabel: "문서 A (현행)",
      docBLabel: "문서 B (개정안)",
      compareFootnote: "EXAONE 3.0 분석 · 주요 변경: 처리기한 단축, 온라인 접수 확대, 알림톡 통지 의무화",
      tableSummaryRows: [
        { ch: "제1편 총칙",     content: "민원 사무 처리의 원칙·용어 정의·적용 범위 규정",             key: "민원 214종 분류" },
        { ch: "제2편 접수·처리", content: "새올 등록 원칙 · 처리기한 7 근무일 · 연장 1회 한정",         key: "연장 통지 의무" },
        { ch: "제3편 인허가",   content: "옥외광고물·식품위생 등 인허가 민원 검토 기준과 현장 확인",     key: "현장 확인 3일 내" },
        { ch: "제4편 통지",     content: "처리 결과 통지 방법 · 불허가 사유 안내 · 이의 제기 절차",     key: "지체 없이 통지" },
        { ch: "제5편 보칙",     content: "새올 기록 5년 보존 · 감사 대응 · 편람 개정 절차",            key: "5년 보존" },
      ],
      keywords: [
        { word: "민원 처리", pct: 94 }, { word: "새올행정시스템", pct: 88 }, { word: "처리기한", pct: 81 },
        { word: "인허가", pct: 76 }, { word: "접수 채널", pct: 72 }, { word: "연장 통지", pct: 68 },
        { word: "옥외광고물", pct: 64 }, { word: "현장 확인", pct: 59 }, { word: "수수료 감면", pct: 54 },
        { word: "반복 민원", pct: 49 }, { word: "알림톡", pct: 45 }, { word: "기록 보존", pct: 41 },
      ],
      sections: [
        { id: "1", title: "제1편 총칙",         children: ["제1조 목적", "제2조 정의", "제3조 적용 범위"] },
        { id: "2", title: "제2편 민원 접수·처리", children: ["제4조 접수 및 새올 등록", "제5조 처리기한", "제6조 처리기한의 연장"] },
        { id: "3", title: "제3편 인허가 민원",   children: ["제7조 검토 기준", "제8조 현장 확인", "제9조 수수료 산정"] },
        { id: "4", title: "제4편 처리 결과 통지", children: ["제10조 통지 방법", "제11조 불허가 사유 안내", "제12조 이의 제기 안내"] },
        { id: "5", title: "제5편 보칙",         children: ["제13조 기록 관리", "제14조 편람의 개정"] },
      ],
      summaryContent: `**제1편 총칙**
본 편람은 「민원 처리에 관한 법률」 및 한성시 민원 처리에 관한 조례에 근거하여 민원 사무 처리의 표준 절차와 기준을 규정한다. 적용 대상은 한성시가 처리하는 **민원 214종**이며, 법정민원·일반민원·고충민원으로 구분한다.

**제2편 민원 접수·처리**
모든 민원은 접수 즉시 **새올행정시스템**에 등록하며, 일반민원의 처리기한은 접수일부터 **7 근무일**로 한다. 처리기한 연장은 **1회에 한하여 7 근무일 범위**에서 가능하며, 연장 사유와 완료 예정일을 민원인에게 통지하여야 한다.

**제3편 인허가 민원**
옥외광고물·식품위생 등 인허가 민원은 담당 주무관이 검토 의견을 작성하고, 현장 확인이 필요한 경우 접수일부터 **3 근무일 이내** 방문 일정을 통지한다. 수수료는 각 조례의 별표 기준에 따라 산정하며, 소상공인은 **100분의 50**을 감면한다.

**제4편 처리 결과 통지**
처리 결과는 지체 없이 새올에 등록하고 민원인이 선택한 방법(서면·전화·알림톡)으로 통지한다. 불허가 시에는 그 사유와 이의 제기 절차를 함께 안내하며, 이의 제기는 통지일부터 **30일 이내** 접수한다.

**제5편 보칙**
민원 처리 기록은 새올 등록 후 **5년간 보존**하며, 처리기한 초과·연장 통지 누락은 정기 감사 점검 항목이다. 편람 개정은 자치행정과 검토를 거쳐 연 1회 정기 반영한다.`,
    },
    "agent-ocr": {
      sampleFiles: [
        { name: "옥외광고물_허가신청서_스캔.pdf", size: "1.9MB", pages: 3, type: "pdf" },
        { name: "사업자등록증_첨부본.jpg",        size: "0.8MB", pages: 1, type: "img" },
      ],
      docModeOptions: [
        { value: "standard",     label: "표준 모드",      desc: "범용 공문서 인식" },
        { value: "compensation", label: "민원 서식 특화", desc: "옥외광고물 허가 서식 최적화" },
      ],
      specialModeKeyword: "옥외광고물 관리 조례",
      specialModeDesc: "허가 서식 자동 적용 · 신청 항목 구조화 · 새올 인허가 대장 연동",
      specialModeBadge: "민원 서식 모드",
      extractedText: `옥외광고물 표시 허가 신청서

접수번호: 민원여권과-2026-접수-0894
접수일자: 2026년 3월 18일
담당자: 이서연 주무관 (민원여권과 민원지원팀)

1. 신청인 정보

성    명: 최영수 (한성기획인쇄 대표)
소 재 지: 한성시 중앙동 24-7
연 락 처: 010-5678-1234

2. 광고물 설치 내역

설치 위치는 한성시 신시가동 210-3 건물 옥상이며, 광고물 종류는 옥상간판 1기입니다. 규격은 가로 12.0m × 세로 3.5m, 표시 면적 42.0제곱미터로 허가 대상(한 변 10m 이상)에 해당합니다.

3. 검토 참고 사항

(1) 구조 안전 확인서: 첨부됨 (높이 4m 초과 — 조례 제8조 의무 서류)
(2) 수수료 산정: 표시 면적 42.0㎡ → 30,000원 + 37㎡ × 5,000원 = 215,000원 (조례 별표 2)
(3) 동일 위치 기존 허가 이력: 새올 조회 결과 없음 (신규)

4. 처리 계획

접수일부터 7 근무일 이내 처리 예정이며, 현장 확인은 3월 20일로 통지하였습니다.

5. 첨부 서류

붙임 1. 광고물 디자인 도안 및 배치도
붙임 2. 구조 안전 확인서 (별지)
붙임 3. 사업자등록증 사본`,
      maskedText: `옥외광고물 표시 허가 신청서

접수번호: 민원여권과-2026-접수-0894
접수일자: 2026년 3월 18일
담당자: ■■■ 주무관 (민원여권과 민원지원팀)

1. 신청인 정보

성    명: ■■■ (한성기획인쇄 대표)
소 재 지: 한성시 ■■동 24-7
연 락 처: 010-****-****

2. 광고물 설치 내역

설치 위치는 한성시 ■■■동 210-3 건물 옥상이며, 광고물 종류는 옥상간판 1기입니다. 규격은 가로 12.0m × 세로 3.5m, 표시 면적 42.0제곱미터로 허가 대상(한 변 10m 이상)에 해당합니다.

3. 검토 참고 사항

(1) 구조 안전 확인서: 첨부됨 (높이 4m 초과 — 조례 제8조 의무 서류)
(2) 수수료 산정: 표시 면적 42.0㎡ → 30,000원 + 37㎡ × 5,000원 = 215,000원 (조례 별표 2)
(3) 동일 위치 기존 허가 이력: 새올 조회 결과 없음 (신규)

4. 처리 계획

접수일부터 7 근무일 이내 처리 예정이며, 현장 확인은 3월 20일로 통지하였습니다.

5. 첨부 서류

붙임 1. 광고물 디자인 도안 및 배치도
붙임 2. 구조 안전 확인서 (별지)
붙임 3. 사업자등록증 사본`,
      maskLog: [
        { type: "성명",   original: "최영수",        masked: "■■■",        pos: "신청인 · 담당자 필드" },
        { type: "연락처", original: "010-5678-1234", masked: "010-****-****", pos: "신청인 정보" },
        { type: "지명",   original: "중앙동",        masked: "■■동",        pos: "신청인 소재지" },
        { type: "지명",   original: "신시가동",      masked: "■■■동",      pos: "설치 위치" },
      ],
      tableData: {
        headers: ["기호", "설치 위치", "광고물 종류", "규격(m)", "수량", "표시 면적(㎡)"],
        rows: [
          ["①", "신시가동 210-3 옥상", "옥상간판",       "12.0×3.5", "1", "42.0"],
          ["②", "중앙동 12-4 벽면",    "벽면 이용 간판", "10.5×2.0", "1", "21.0"],
          ["③", "공단동 55 지주",      "지주 이용 간판", "높이 5.2", "1", "12.4"],
          ["④", "대학동 77-2 벽면",    "돌출간판",       "1.2×3.8",  "2", "9.1"],
          ["⑤", "호수동 88-1 지주",    "현수막 게시대",  "8.0×1.2",  "1", "9.6"],
        ],
      },
      tableCaption: "감지된 표 — 옥외광고물 신청 내역",
      confidenceMap: [
        { line: "옥외광고물 표시 허가 신청서",           score: 99.8, level: "high" },
        { line: "접수번호: 민원여권과-2026-접수-0894",   score: 99.1, level: "high" },
        { line: "접수일자: 2026년 3월 18일",             score: 98.7, level: "high" },
        { line: "성명: 최영수 (한성기획인쇄 대표)",       score: 99.2, level: "high" },
        { line: "1. 신청인 정보",                        score: 99.5, level: "high" },
        { line: "설치 위치는 한성시 신시가동 210-3",     score: 97.8, level: "high" },
        { line: "2. 광고물 설치 내역",                   score: 99.3, level: "high" },
        { line: "규격은 가로 12.0m × 세로 3.5m",         score: 96.4, level: "high" },
        { line: "수수료 산정: 215,000원",                score: 94.2, level: "med" },
        { line: "붙임 1. 광고물 디자인 도안 및 배치도",   score: 98.6, level: "high" },
      ],
    },
    "agent-meeting": {
      defaultTitle: "민원여권과 정례회의 — AI 민원 상담 도입 검토",
      defaultDate: "2026-03-17",
      defaultPlace: "시청 3층 소회의실 (302호)",
      defaultAttendees: [
        { name: "박정호", dept: "민원여권과", role: "주재(과장)" },
        { name: "김도윤", dept: "민원여권과", role: "민원지원팀장" },
        { name: "이서연", dept: "민원여권과", role: "주무관" },
        { name: "홍은지", dept: "기획예산과", role: "시정분석팀장" },
      ],
      defaultAgenda: ["AI 민원 상담 챗봇 시범 도입 검토", "2026년 상반기 민원 창구 운영 개선"],
      sttSampleText: "안녕하십니까 민원여권과 정례회의를 시작하겠습니다 주요 안건은 AI 민원 상담 챗봇 시범 도입과 상반기 민원 창구 운영 개선 두 가지입니다 기획예산과에서 검토한 챗봇 시범 운영 분석 결과를 공유하겠습니다 민원사무편람 기준 답변 정확도 94.2%로 확인됐습니다 상담 처리 시간을 건당 평균 35% 단축할 것으로 분석됩니다 민원 처리에 관한 법률에 따라 AI 안내는 가능하나 처분성 있는 답변은 담당 주무관 확인을 거쳐야 합니다 중앙동 통합민원 창구 3개소 시범 적용을 2026년 하반기에 제안드립니다",
      diarization: [
        { time: "00:00:12", speaker: "박정호", color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200",
          text: "안녕하십니까. 민원여권과 정례회의를 시작하겠습니다. 주요 안건은 AI 민원 상담 챗봇 시범 도입과 2026년 상반기 민원 창구 운영 개선 두 가지입니다.",
          docKey: "open",
          meetingText: "민원여권과장 주재로 회의 개최. 참석 인원 확인 및 회의 목적 공유." },
        { time: "00:01:05", speaker: "홍은지", color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200",
          text: "기획예산과에서 검토한 AI 챗봇 시범 운영 분석 결과를 공유하겠습니다. 민원사무편람 기준 답변 정확도 94.2%로 나왔습니다.",
          docKey: "agenda1",
          meetingText: "홍은지 팀장: AI 챗봇 답변 정확도 94.2%, 편람 기준 충족 확인." },
        { time: "00:02:33", speaker: "김도윤", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200",
          text: "상담 처리 시간을 건당 평균 35% 단축할 수 있을 것으로 분석됩니다. 다만 다국어 민원 응대 시나리오 보강이 필요합니다.",
          docKey: "agenda1",
          meetingText: "김도윤 팀장: 상담 시간 35% 단축 가능. 다국어 응대 시나리오 보강 필요 의견." },
        { time: "00:04:12", speaker: "이서연", color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200",
          text: "법령 검토 결과, 민원 처리에 관한 법률상 AI 안내는 가능하나 처분성 있는 답변은 담당 주무관 확인을 거쳐야 합니다.",
          docKey: "agenda1",
          meetingText: "이서연 주무관: 민원 처리에 관한 법률 — AI 안내 가능, 처분성 답변은 주무관 확인 필요." },
        { time: "00:06:48", speaker: "박정호", color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200",
          text: "챗봇을 1차 안내 도구로 활용하고, 처분성 민원은 담당 주무관이 확인하는 방식으로 진행하면 어떨까요?",
          docKey: "agenda1_conc",
          meetingText: "[결론] AI 챗봇 1차 안내 활용 — 2026년 하반기 통합민원 창구 3개소 시범 적용." },
        { time: "00:07:30", speaker: "홍은지", color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200",
          text: "동의합니다. 2026년 하반기 중앙동 통합민원 창구 3개소 시범 적용을 제안드립니다. 여권·전입 민원 중심으로 시작하는 것이 효율적입니다.",
          docKey: "decision",
          meetingText: "[결정①] AI 민원 상담 챗봇 1차 안내 도입 — 2026년 하반기 창구 3개소 시범 적용." },
        { time: "00:09:15", speaker: "김도윤", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200",
          text: "상반기 창구 운영 개선 관련하여, 4월 1일 외국인 통합민원 창구 개시·6월 30일 무인발급기 2대 증설 목표로 세부 계획을 수립하겠습니다.",
          docKey: "agenda2",
          meetingText: "김도윤 팀장: 2026.04.01 통합창구 개시 · 2026.06.30 무인발급기 증설 목표 세부 계획 수립 예정." },
        { time: "00:10:44", speaker: "박정호", color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200",
          text: "오늘 논의된 내용을 바탕으로 각자 담당 사항을 기한 내 이행해 주시기 바랍니다. 이상으로 회의를 마치겠습니다.",
          docKey: "close",
          meetingText: "차기 회의: 2026년 3월 31일(화) 14:00 예정. 챗봇 시나리오 검토 결과는 온나라 공람 예정." },
      ],
      docSections: [
        { key: "open",         num: "§1",    label: "개회",                     brief: "민원여권과장 주재로 회의 개최. 참석 인원 확인 및 목적 공유.", color: "slate" },
        { key: "agenda1",      num: "§2-①",  label: "안건 1 · AI 민원 상담 챗봇", brief: "답변 정확도 94.2% · 상담 35% 단축 · 처분성 답변 주무관 확인.", color: "violet" },
        { key: "agenda1_conc", num: "  └결론", label: "안건 1 결론",             brief: "AI 1차 안내 도구 활용, 2026년 하반기 창구 3개소 시범 적용.", color: "violet" },
        { key: "agenda2",      num: "§2-②",  label: "안건 2 · 창구 운영 개선",   brief: "2026.04.01 통합창구 개시 · 2026.06.30 무인발급기 증설.", color: "blue" },
        { key: "decision",     num: "§3",    label: "결정 사항",                brief: "① 챗봇 시범 도입  ② 창구 개선 일정 확정  ③ 시나리오 검증 4/15 완료.", color: "emerald" },
        { key: "action",       num: "§4",    label: "조치 사항",                brief: "4개 항목 · 담당자 배정 · 기한 2026.03.25~04.30.", color: "amber" },
        { key: "close",        num: "§5",    label: "폐회",                     brief: "차기 회의: 2026.03.31(화) 14:00 예정.", color: "slate" },
      ],
      speakerLegend: [
        { name: "박정호", color: "text-indigo-700",  bg: "bg-indigo-100",  border: "border-indigo-200" },
        { name: "홍은지", color: "text-violet-700",  bg: "bg-violet-100",  border: "border-violet-200" },
        { name: "김도윤", color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-200" },
        { name: "이서연", color: "text-rose-700",    bg: "bg-rose-100",    border: "border-rose-200" },
      ],
      actions: [
        { label: "AI 챗봇 답변 시나리오 검증 보고서 작성", person: "홍은지", dept: "기획예산과", due: "2026.03.31" },
        { label: "창구 운영 개선 세부 계획 수립",           person: "김도윤", dept: "민원여권과", due: "2026.03.25" },
        { label: "챗봇-새올 연계 테스트 결과 보고",         person: "이서연", dept: "민원여권과", due: "2026.04.15" },
        { label: "통합민원 창구 운영 지침 개정안 작성",     person: "박정호", dept: "민원여권과", due: "2026.04.30" },
      ],
      deptName: "민원여권과",
      docNum: "HSC-민원여권과-2026-046",
      openingLines: ["민원여권과장 주재로 회의 개최", "참석 인원 확인 및 회의 목적 공유"],
      agendaDiscussions: [
        { lines: ["홍은지 팀장: AI 챗봇 답변 정확도 94.2%, 상담 시간 건당 평균 35% 단축 가능.", "김도윤 팀장: 다국어 민원 응대 시나리오 보강 필요 의견.", "이서연 주무관: 민원 처리에 관한 법률상 AI 안내 가능, 처분성 답변은 담당 주무관 확인 필요."],
          conclusion: "AI 챗봇 1차 안내 활용 — 2026년 하반기 통합민원 창구 3개소 시범 적용" },
        { lines: ["김도윤 팀장: 2026.04.01. 외국인 통합민원 창구 개시, 2026.06.30. 무인발급기 2대 증설 목표.", "박정호 과장: 중앙동 창구 대기시간 단축 효과 검증 후 전체 동 확대 방침."],
          conclusion: "2026.04.01. 통합창구 개시, 2026.06.30. 무인발급기 증설 확정" },
      ],
      decisions: [
        "AI 민원 상담 챗봇 1차 안내 도입 — 2026년 하반기 통합민원 창구 3개소 시범 적용",
        "외국인 통합민원 창구: 2026.04.01. 개시 · 무인발급기 2대 2026.06.30. 증설",
        "챗봇 답변 시나리오 검증 2026.04.15. 이전 완료 후 전면 도입 여부 결정",
      ],
      specialNotes: ["차기 회의: 2026년 3월 31일(화) 14:00 예정", "챗봇 시나리오 검토 결과는 온나라 문서로 공람 예정"],
      footerText: "본 회의록은 한성시 스마트행정 AI 회의록 에이전트 v1.0에 의해 자동 생성되었으며, 담당자 검토 후 확정됩니다.",
      logoAlt: "한성시청",
      resultText: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                      회   의   록
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ 회  의  명 : 민원여권과 정례회의 — AI 민원 상담 도입 검토
□ 일      시 : 2026년 3월 17일 (화) 14:00 ~ 15:20
□ 장      소 : 시청 3층 소회의실 (302호)
□ 주      재 : 민원여권과장 박정호
□ 참 석 자  : 민원지원팀장 김도윤, 주무관 이서연,
               기획예산과 시정분석팀장 홍은지

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 개회 (14:00)
   - 민원여권과장 주재로 회의 개최
   - 참석 인원 확인 및 회의 목적 공유

2. 안건 토의

   [안건 1] AI 민원 상담 챗봇 시범 도입 검토
   ─────────────────────────────────────
   ▸ 홍은지 팀장 : 민원사무편람 기준 답변 정확도 94.2%,
     상담 처리 시간 건당 평균 35% 단축 가능 분석 결과 공유.
   ▸ 김도윤 팀장 : 다국어(영·중·일·베) 민원 응대 시나리오
     보강 필요 의견 제시.
   ▸ 이서연 주무관 : 민원 처리에 관한 법률 검토 — AI 안내는
     가능하나 처분성 있는 답변은 담당 주무관 확인 필수.
   ▸ 결 론 : 챗봇 1차 안내 활용, 2026년 하반기 통합민원
     창구 3개소 시범 적용 추진.

   [안건 2] 2026년 상반기 민원 창구 운영 개선
   ─────────────────────────────────────
   ▸ 김도윤 팀장 : 외국인 통합민원 창구 2026.04.01. 개시,
     무인민원발급기 2대 2026.06.30. 증설 목표.
   ▸ 박정호 과장 : 중앙동 창구 대기시간 단축 효과 검증 후
     전체 동 확대 방침.
   ▸ 결 론 : 통합창구 개시·무인발급기 증설 일정 확정.

3. 결정 사항
   ① AI 챗봇 시범 도입 : 2026년 하반기 창구 3개소
   ② 통합민원 창구 개시 : 2026. 04. 01.
   ③ 챗봇 시나리오 검증 4/15 완료 후 전면 도입 결정

4. 조치 사항
   ┌──┬──────────────────────────────┬──────────┬───────────┐
   │번호│ 내              용           │ 담 당 자 │ 완료 기한 │
   ├──┼──────────────────────────────┼──────────┼───────────┤
   │ 1 │ 챗봇 시나리오 검증 보고서     │ 홍은지   │ 03. 31.  │
   │ 2 │ 창구 개선 세부 계획 수립     │ 김도윤   │ 03. 25.  │
   │ 3 │ 챗봇-새올 연계 테스트 보고   │ 이서연   │ 04. 15.  │
   │ 4 │ 창구 운영 지침 개정안 작성   │ 박정호   │ 04. 30.  │
   └──┴──────────────────────────────┴──────────┴───────────┘

5. 특이사항
   - 차기 회의 : 2026년 3월 31일 (화) 14:00 예정
   - 챗봇 시나리오 검토 결과는 온나라 문서로 공람 예정

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
작성자 : 한성시 AI 회의록 에이전트 v1.0
검토자 : ___________________  (서명)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      apvLine: [
        { name: "이서연", dept: "민원여권과", title: "주무관",       role: "작성자" },
        { name: "김도윤", dept: "민원여권과", title: "민원지원팀장", role: "검토자" },
        { name: "박정호", dept: "민원여권과", title: "과장",         role: "승인자" },
      ],
    },
    "agent-safety": {
      agents: [
        { icon: FileText,      label: "입력 분석 에이전트",   sub: "행사장 특성 파악 및 위험 유형 분류",        color: "bg-orange-600",  ms: 2400 },
        { icon: Database,      label: "RAG 검색 에이전트",    sub: "재난안전법·조례·사례 벡터 검색",            color: "bg-blue-600",    ms: 3500 },
        { icon: CheckSquare,   label: "법규 검토 에이전트",   sub: "적용 법령 매핑 및 준수 체크리스트 생성",     color: "bg-purple-600",  ms: 2800 },
        { icon: ClipboardList, label: "계획서 작성 에이전트", sub: "행사장 안전관리계획서 초안 자동 생성",       color: "bg-emerald-600", ms: 3000 },
      ],
      riskOptions: ["인파 밀집", "무대 구조물 전도", "전기·화재", "식품 위생", "차량 진입 통제", "우천·강풍", "미아·실종", "응급환자 발생", "야간 조명 사각", "하천변 익수"],
      riskData: {
        "인파 밀집":        { level: "매우 높음", freq: "높음", sev: 5, lkl: 4, lvlColor: "bg-red-100 text-red-700 border-red-200",       measure: "구역별 수용 인원 산정, 일방통행 동선, 안전요원 50m 간격 배치" },
        "무대 구조물 전도": { level: "높음",     freq: "낮음", sev: 5, lkl: 2, lvlColor: "bg-orange-100 text-orange-700 border-orange-200", measure: "설치 후 구조 안전 확인서 징구, 풍속 10m/s 초과 시 운영 중단" },
        "전기·화재":        { level: "높음",     freq: "보통", sev: 4, lkl: 3, lvlColor: "bg-orange-100 text-orange-700 border-orange-200", measure: "임시 전기 설비 사전 점검, 소화기 20m 간격 비치, 화기 취급 구역 분리" },
        "식품 위생":        { level: "보통",     freq: "보통", sev: 3, lkl: 3, lvlColor: "bg-yellow-100 text-yellow-700 border-yellow-200", measure: "푸드트럭 영업신고 확인, 환경위생과 합동 위생 점검 일 1회" },
        "차량 진입 통제":   { level: "높음",     freq: "보통", sev: 4, lkl: 3, lvlColor: "bg-orange-100 text-orange-700 border-orange-200", measure: "행사 구간 차량 통제(경찰 협조), 진입로 차단시설 설치" },
        "우천·강풍":        { level: "높음",     freq: "보통", sev: 4, lkl: 3, lvlColor: "bg-orange-100 text-orange-700 border-orange-200", measure: "기상특보 발령 시 단계별 축소·중단, 배수로 사전 정비" },
        "미아·실종":        { level: "보통",     freq: "보통", sev: 3, lkl: 3, lvlColor: "bg-yellow-100 text-yellow-700 border-yellow-200", measure: "미아보호소 운영, 안내방송 체계 구축, 아동 손목밴드 배부" },
        "응급환자 발생":    { level: "높음",     freq: "보통", sev: 4, lkl: 3, lvlColor: "bg-orange-100 text-orange-700 border-orange-200", measure: "응급의료소 2개소 운영, 구급차 상시 대기, AED 4대 배치" },
        "야간 조명 사각":   { level: "보통",     freq: "낮음", sev: 3, lkl: 2, lvlColor: "bg-yellow-100 text-yellow-700 border-yellow-200", measure: "임시 조명탑 설치, 야간 순찰조 2개조 편성" },
        "하천변 익수":      { level: "높음",     freq: "낮음", sev: 5, lkl: 2, lvlColor: "bg-orange-100 text-orange-700 border-orange-200", measure: "호수 접근 구간 안전펜스 설치, 수상 안전요원 배치" },
      },
      resultText: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        행 사 장 안 전 관 리 계 획 서
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 행사 개요
   ─────────────────────────────────────
   ▸ 행  사  명 : 한성 벚꽃축제 (호수공원 일원)
   ▸ 행사 기간 : 2026. 04. 03. ~ 2026. 04. 12. (10일)
   ▸ 행사 장소 : 호수동 호수공원 및 순환산책로 일대
   ▸ 주 관 : 한성시 안전총괄과·문화관광과
   ▸ 예상 인원 : 일 최대 25,000명 (안전요원 48명 배치)

2. 안전 관리 조직
   ─────────────────────────────────────
   [안전관리책임자] 유경석 과장 (안전총괄과)
       └─ [행사안전담당] 조현우 주무관 (안전총괄과)
              ├─ [현장 안전요원 A조] 이서연 주무관 (민원여권과)
              └─ [현장 안전요원 B조] 윤지우 팀장 (자치행정과)

3. 위험 요인 분석 (위험성 평가)
   ─────────────────────────────────────
   ┌────────────┬────────┬──────┬───────────────────────────────┐
   │ 위험 요인  │ 위험도 │ 빈도 │ 안전 대책                    │
   ├────────────┼────────┼──────┼───────────────────────────────┤
   │ 인파 밀집  │ 매우높음│ 높음 │ 일방통행 동선, 요원 50m 간격 │
   │ 무대 전도  │ 높음   │ 낮음 │ 구조 확인서, 풍속 기준 중단  │
   │ 전기·화재  │ 높음   │ 보통 │ 설비 점검, 소화기 20m 간격   │
   │ 응급환자   │ 높음   │ 보통 │ 의료소 2개소, 구급차 대기    │
   │ 하천변익수 │ 높음   │ 낮음 │ 안전펜스, 수상 요원 배치     │
   └────────────┴────────┴──────┴───────────────────────────────┘

4. 안전관리 계획 (단계별)
   ─────────────────────────────────────
   4.1 행사 개최 전 안전 관리
   ▸ 개최 7일 전 유관기관(경찰·소방·의료) 합동 점검 실시
   ▸ 무대·조명탑 등 임시 구조물 구조 안전 확인서 징구
   ▸ 안전요원 48명 사전 교육 (인파 관리·응급 대응)

   5. 비상 대응 체계
   ─────────────────────────────────────
   사고 발생 → 현장 안전요원 초동 조치 및 119 신고
   ↓
   행사안전담당 보고 (조현우 010-XXXX-XXXX)
   ↓
   안전관리책임자 보고 → 재난안전대책본부 가동 판단

6. 관련 법령 및 규정
   ─────────────────────────────────────
   ① 재난 및 안전관리 기본법 제66조의11 (지역축제 안전관리)
   ② 한성시 행사장 안전관리 조례 제5조 (안전관리계획 수립)
   ③ 공연법 제11조 (무대시설 안전진단)
   ④ 식품위생법 제37조 (임시 영업신고)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
작성: 한성시 안전계획 에이전트 v1.0 | 검토자: _______
참조 법령 수: 4건 | RAG 검색 문서 수: 8건
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      apvLine: [
        { name: "조현우", dept: "안전총괄과", title: "주무관", role: "작성자" },
        { name: "유경석", dept: "안전총괄과", title: "과장",   role: "검토자" },
        { name: "문성재", dept: "행정국",     title: "국장",   role: "승인자" },
      ],
      defaultProjName: "한성 벚꽃축제 안전관리 (호수공원 일원)",
      defaultProjType: "지역 축제",
      defaultProjLoc: "호수동 호수공원 일대",
      defaultDuration: "10일",
      defaultRisks: ["인파 밀집", "무대 구조물 전도", "응급환자 발생"],
      projTypePlaceholder: "행사 유형 (지역 축제, 체육 행사, 현장 점검 등)",
      uploadHint: "행사장 배치도, 무대 도면, 이전 행사 안전 보고서 등을 업로드하세요 (선택)",
      ragDocs: [
        { name: "지역축제 안전관리 매뉴얼(행안부).pdf", hits: 8 },
        { name: "한성시 행사장 안전관리 조례.pdf",      hits: 5 },
        { name: "재난 및 안전관리 기본법 제66조의11.pdf", hits: 4 },
        { name: "공연법 제11조 (무대시설 안전).pdf",     hits: 3 },
        { name: "인파 밀집 위험성평가 지침.pdf",         hits: 2 },
      ],
      ragTags: ["재난안전법", "공연법", "식품위생법", "행사장 안전관리 조례", "인파관리 지침", "응급의료법"],
      checklist: [
        "개최 7일 전 유관기관(경찰·소방·의료) 합동 점검 실시 여부",
        "임시 구조물(무대·조명탑) 구조 안전 확인서 징구 여부",
        "구역별 수용 인원 산정 및 일방통행 동선 확정 여부",
        "안전요원 배치표 작성 및 사전 교육 이수 여부",
        "응급의료소·구급차·AED 배치 완료 여부",
        "기상특보 발령 시 단계별 축소·중단 기준 공유 여부",
        "비상 연락망(119, 재난안전상황실) 현장 게시 여부",
      ],
      laws: [
        "재난 및 안전관리 기본법 제66조의11 (지역축제 안전관리)",
        "한성시 행사장 안전관리 조례 제5조 (안전관리계획 수립)",
        "공연법 제11조 (무대시설 안전진단)",
        "식품위생법 제37조 (임시 영업신고)",
        "도로교통법 제6조 (통행 금지·제한)",
      ],
      orgLeader: "[안전관리책임자] 유경석 안전총괄과장",
      orgManager: "[행사안전담당] 조현우 주무관",
      orgMembers: ["[현장 안전요원 A조] 이서연 주무관 (민원여권과)", "[비상연락담당] 윤지우 팀장 (자치행정과)"],
      emergencySteps: [
        { label: "위험 상황 발생", sub: "현장 초동 조치·대피 유도", color: "bg-red-600" },
        { label: "행사안전담당 연락", sub: "조현우 주무관 010-XXXX-XXXX", color: "bg-orange-500" },
        { label: "119·112 신고", sub: "필요 시 소방·경찰 즉시 요청", color: "bg-orange-500" },
        { label: "재난안전상황실 보고", sub: "대책본부 가동 판단·재발 방지", color: "bg-slate-700" },
      ],
      planSections: [
        { sub: "3.1  행사 개최 전 안전 관리", items: ["개최 7일 전 유관기관 합동 점검 및 지적사항 조치", "임시 구조물 구조 안전 확인서 징구 (공연법 제11조)", "안전요원 48명 배치표 확정 및 인파 관리 교육"] },
        { sub: "3.2  행사 운영 중 안전", items: ["구역별 밀집도 모니터링, 일방통행 동선 유지", "응급의료소 2개소·구급차 상시 대기, AED 4대 배치", "푸드트럭 위생 점검 일 1회 (환경위생과 합동)"] },
        { sub: "3.3  기상 악화·비상 대응", items: ["강풍(풍속 10m/s 초과) 시 무대 운영 즉시 중단", "호우특보 발령 시 하천변 구간 통제 및 단계별 축소", "비상 시 안내방송·전광판으로 대피 동선 즉시 공지"] },
      ],
      dept: "안전총괄과",
      docNum: "HSC-안전총괄과-2026-032",
      brandLine: "HSC · 한성시청",
      logoAlt: "한성시청",
      apvRef: "APV-2026-0402-032",
      periodRange: "2026. 04. 03. ~ 2026. 04. 12.",
    },
    "agent-dataanalysis": {
      sampleFiles: [
        { id: "f1", name: "민원_접수처리현황_2026Q1.xlsx", rows: 3421, cols: 10, size: "2.1MB" },
        { id: "f2", name: "예산_집행실적_2026.csv",        rows: 812,  cols: 9,  size: "0.6MB" },
        { id: "f3", name: "인허가_처리대장_2026.xlsx",     rows: 264,  cols: 14, size: "0.9MB" },
      ],
      trendCaption: "민원 기한 내 처리율 추이 (2025.7 ~ 2026.3) · 단위: %",
      trendData: [
        { month: "2025.7",  전체: 91.2, 온라인: 95.1, 방문: 88.4 },
        { month: "2025.8",  전체: 90.8, 온라인: 94.8, 방문: 87.9 },
        { month: "2025.9",  전체: 91.6, 온라인: 95.4, 방문: 88.7 },
        { month: "2025.10", 전체: 92.1, 온라인: 95.9, 방문: 89.2 },
        { month: "2025.11", 전체: 92.4, 온라인: 96.2, 방문: 89.5 },
        { month: "2025.12", 전체: 91.9, 온라인: 95.7, 방문: 88.9 },
        { month: "2026.1",  전체: 92.6, 온라인: 96.4, 방문: 89.8 },
        { month: "2026.2",  전체: 92.9, 온라인: 96.7, 방문: 90.1 },
        { month: "2026.3",  전체: 93.1, 온라인: 96.9, 방문: 90.4 },
      ],
      trendSeries: [{ key: "전체", color: "#f97316" }, { key: "온라인", color: "#3b82f6" }, { key: "방문", color: "#10b981" }],
      trendDomain: [85, 100], trendRef: 90, trendRefLabel: "목표(90%)",
      barTabLabel: "부서별",
      barCaption: "부서별 민원 처리 건수 (2026.3 기준) · 단위: 건",
      barData: [
        { dept: "민원여권과", 처리건수: 1428 },
        { dept: "환경위생과", 처리건수: 512 },
        { dept: "세무과",     처리건수: 468 },
        { dept: "도시계획과", 처리건수: 386 },
        { dept: "자치행정과", 처리건수: 274 },
        { dept: "문화관광과", 처리건수: 231 },
        { dept: "안전총괄과", 처리건수: 189 },
        { dept: "기획예산과", 처리건수: 94 },
      ],
      barXKey: "dept", barValueKey: "처리건수", barUnit: "건",
      stackTabLabel: "인허가",
      stackCaption: "인허가 접수·처리·반려 현황 (2026년 분기) · 단위: 건",
      stackData: [
        { month: "1월", 접수: 86, 처리: 79, 반려: 7 },
        { month: "2월", 접수: 92, 처리: 84, 반려: 8 },
        { month: "3월", 접수: 104, 처리: 95, 반려: 9 },
      ],
      stackSeries: [{ key: "접수", color: "#f97316" }, { key: "처리", color: "#10b981" }, { key: "반려", color: "#ef4444" }],
      statsTable: [
        { metric: "평균 처리 기간",    value: "4.2일",   change: "-0.4일",  status: "normal" },
        { metric: "기한 내 처리율",    value: "93.1%",   change: "+1.2%p",  status: "normal" },
        { metric: "최장 처리 기간",    value: "21일",    change: "+3일",    status: "high" },
        { metric: "온라인 접수 비중",  value: "61.4%",   change: "+4.8%p",  status: "normal" },
        { metric: "기한 초과 건수",    value: "38건",    change: "+5건",    status: "warning" },
        { metric: "결측치",            value: "0건",     change: "유지",    status: "normal" },
      ],
      outlierSummary: "38건 (1.1%)",
      docStandard: "HSC 표준 서식",
      docStandardNote: "리포트 형식을 선택하면 한성시 표준 서식으로 자동 생성됩니다",
    },
    "agent-dbquery": {
      /* headerTitle 생략 — 허브 카탈로그 이름(행정DB 조회 에이전트)을 승계 */
      headerSubtitle: "인허가 대장 · 공유재산 대장 · 도시계획 열람 자연어 검색",
      dbStatusLabel: "새올 DB 연결됨",
      emptyTitle: "행정 대장을 자연어로 조회하세요",
      dbSources: [
        { key: "building", label: "인허가 대장",   desc: "업소명·업종·허가일·면적·행정처분" },
        { key: "land",     label: "공유재산 대장", desc: "재산번호·구분·면적·사용허가·대부료" },
        { key: "lup",      label: "도시계획 열람", desc: "용도지역·지구·행위 제한 사항" },
      ],
      permissionLevels: [
        { id: "general",   label: "일반",       desc: "공개 대장 정보 조회",              badge: "bg-slate-100 text-slate-600" },
        { id: "manager",   label: "팀장",       desc: "행정처분 이력 + 계약 내역 포함",   badge: "bg-blue-100 text-blue-700" },
        { id: "evaluator", label: "인허가담당", desc: "전체 데이터 + 대부료·수수료 포함", badge: "bg-violet-100 text-violet-700" },
      ],
      permissionNotices: {
        general:   "공개 정보(소재지·업소명·업종·면적)에 한해 조회 가능합니다.",
        manager:   "행정처분 이력 및 사용허가 계약 내역이 포함됩니다.",
        evaluator: "전체 데이터(계약·대부료·수수료 산정) 조회 가능 — 개인정보 처리 지침 준수 필요.",
      },
      queryHistory: [
        { id: 1, query: "중앙동 일반음식점 인허가 현황 (2024년 이후)",  date: "2026-03-31 16:42", rows: 12, ms: "0.31초" },
        { id: 2, query: "공단동 공유재산 대부계약 만료 예정 목록",       date: "2026-03-30 11:18", rows: 8,  ms: "0.55초" },
        { id: 3, query: "신시가동 지구단위계획구역 열람",               date: "2026-03-28 09:05", rows: 23, ms: "0.22초" },
        { id: 4, query: "옥외광고물 허가 위반 업소 현황",               date: "2026-03-25 14:30", rows: 5,  ms: "0.18초" },
      ],
      quickQueries: [
        "중앙동 일반음식점 인허가 현황",
        "공유재산 사용허가 면적 500㎡ 이상",
        "신시가동 도시계획 용도지역 현황",
        "공단동 행정처분 이력 업소 조회",
      ],
      buildingRows: [
        { jibun: "중앙동 12-4",   buildingName: "한성불고기",       structure: "일반음식점",   yongdo: "신규 허가", area: 132,  floor: "지상1",   year: 2024, status: "정상" },
        { jibun: "중앙동 31-2",   buildingName: "시청앞약국",       structure: "의약품 판매업", yongdo: "신규 등록", area: 58,   floor: "지상1",   year: 2021, status: "정상" },
        { jibun: "신시가동 210-3", buildingName: "한성기획인쇄",     structure: "인쇄업",       yongdo: "옥외광고 허가", area: 264, floor: "지상2",  year: 2026, status: "정상" },
        { jibun: "신시가동 185",  buildingName: "푸른숲카페",       structure: "휴게음식점",   yongdo: "신규 허가", area: 96,   floor: "지상1",   year: 2025, status: "정상" },
        { jibun: "공단동 55",     buildingName: "대성금속(주)",     structure: "공장 등록",    yongdo: "변경 등록", area: 1840, floor: "지상2",   year: 2019, status: "정상" },
        { jibun: "공단동 61-8",   buildingName: "한성유통센터",     structure: "물류창고업",   yongdo: "신규 등록", area: 2210, floor: "지상3",   year: 2022, status: "정상" },
        { jibun: "대학동 77-2",   buildingName: "청춘노래연습장",   structure: "노래연습장업", yongdo: "신규 허가", area: 148,  floor: "지하1",   year: 2023, status: "정상" },
        { jibun: "호수동 88-1",   buildingName: "호수뷰펜션",       structure: "숙박업",       yongdo: "무단 용도변경", area: 320, floor: "지상3", year: 2018, status: "위반" },
      ],
      landRows: [
        { jibun: "재산 2026-011", jimok: "행정재산", area: 842.0,  ownership: "법인", zoning: "사용허가",  pnu: "4513-2026-0011", landPrice: 3600000 },
        { jibun: "재산 2026-014", jimok: "일반재산", area: 1260.5, ownership: "법인", zoning: "대부계약",  pnu: "4513-2026-0014", landPrice: 8420000 },
        { jibun: "재산 2025-087", jimok: "행정재산", area: 420.0,  ownership: "개인", zoning: "사용허가",  pnu: "4513-2025-0087", landPrice: 1850000 },
        { jibun: "재산 2025-062", jimok: "일반재산", area: 96.0,   ownership: "개인", zoning: "대부계약",  pnu: "4513-2025-0062", landPrice: 540000 },
        { jibun: "재산 2024-118", jimok: "일반재산", area: 2105.0, ownership: "법인", zoning: "대부계약",  pnu: "4513-2024-0118", landPrice: 12600000 },
      ],
      lupRows: [
        { jibun: "중앙동 12-4",    zoning: "일반상업지역",       district: "중심지구단위계획구역", restrictions: ["건폐율 80%이하", "용적률 800%이하", "높이 제한 없음"], fireZone: "화재예방강화지구" },
        { jibun: "신시가동 210-3", zoning: "준주거지역",         district: "지구단위계획구역",     restrictions: ["건폐율 70%이하", "용적률 400%이하"],                  fireZone: "" },
        { jibun: "공단동 55",      zoning: "일반공업지역",       district: "",                    restrictions: ["건폐율 70%이하", "용적률 350%이하"],                  fireZone: "화재예방강화지구" },
        { jibun: "대학동 77-2",    zoning: "제2종일반주거지역",  district: "",                    restrictions: ["건폐율 60%이하", "용적률 250%이하"],                  fireZone: "" },
        { jibun: "호수동 88-1",    zoning: "자연녹지지역",       district: "경관지구",            restrictions: ["건폐율 20%이하", "용적률 100%이하", "높이 12m이하"],   fireZone: "" },
      ],
      sqlMap: {
        building: `SELECT p.location, p.business_name, p.category,
       p.permit_type, p.floor_area, p.position,
       p.permit_year, p.violation_yn
FROM saeol_permit_register p
WHERE p.dong = '중앙동'
  AND p.permit_date >= '2024-01-01'
ORDER BY p.floor_area DESC
LIMIT 50;`,
        land: `SELECT a.asset_no, a.asset_type, a.area,
       a.party_type, a.contract_type,
       a.mgmt_no, a.annual_rent
FROM saeol_public_property a
WHERE a.area >= 90
ORDER BY a.area DESC
LIMIT 50;`,
        lup: `SELECT u.location, u.zoning_code, u.district_code,
       u.restriction_list, u.fire_zone_code
FROM saeol_urban_plan u
WHERE u.dong = '신시가동'
  AND u.zoning_code IS NOT NULL
ORDER BY u.location ASC
LIMIT 50;`,
      },
      statsBySource: {
        building: [
          { label: "총 건수",   value: "8건",      icon: "table",  color: "text-blue-600" },
          { label: "위반 건수", value: "1건",      icon: "filter", color: "text-red-500" },
          { label: "평균 면적", value: "633.5㎡",  icon: "trend",  color: "text-teal-600" },
          { label: "조회시간",  value: "0.31초",   icon: "clock",  color: "text-slate-500" },
        ],
        land: [
          { label: "총 건수",     value: "5건",       icon: "table",  color: "text-blue-600" },
          { label: "법인 계약",   value: "3건",       icon: "shield", color: "text-violet-600" },
          { label: "평균 면적",   value: "944.7㎡",   icon: "trend",  color: "text-teal-600" },
          { label: "조회시간",    value: "0.55초",    icon: "clock",  color: "text-slate-500" },
        ],
        lup: [
          { label: "총 열람 건수", value: "5건",     icon: "table",  color: "text-blue-600" },
          { label: "용도지역 수",  value: "5종",     icon: "filter", color: "text-amber-600" },
          { label: "지구 지정",    value: "3건",     icon: "trend",  color: "text-teal-600" },
          { label: "조회시간",     value: "0.22초",  icon: "clock",  color: "text-slate-500" },
        ],
      },
      buildingColumns: [
        { key: "jibun",        label: "소재지" },
        { key: "buildingName", label: "업소명" },
        { key: "structure",    label: "업종" },
        { key: "yongdo",       label: "허가 구분" },
        { key: "area",         label: "면적(㎡)" },
        { key: "floor",        label: "위치" },
        { key: "year",         label: "허가연도" },
        { key: "status",       label: "상태" },
      ],
      landColumns: ["재산번호", "재산 구분", "면적(㎡)", "상대방", "계약 형태", "관리번호", "연 대부료(원)"],
      lupColumns: ["소재지", "용도지역", "지구", "행위 제한", "화재예방강화지구"],
      restrictedNotice: "대부료·수수료 정보는 팀장 이상 권한에서 조회 가능합니다.",
    },
    "agent-address": {
      defaultAddress: "한성시 중앙동 12-4",
      addressPlaceholder: "예: 한성시 중앙동 12-4",
      quickExamples: ["한성시 신시가동 210-3", "한성시 호수동 88-1", "한성시 공단동 55"],
      defaultAptQuery: "한성시 신시가동 한성푸른숲아파트",
      aptPlaceholder: "예: 한성시 신시가동 한성푸른숲아파트",
      aptQuickExamples: [
        "한성시 신시가동 한성푸른숲아파트",
        "한성시 중앙동 시청로한마음아파트",
        "한성시 강변동 강변현대아파트",
      ],
      aptLookupResult: {
        query: "한성시 신시가동 한성푸른숲아파트",
        complexName: "한성푸른숲아파트",
        complexCode: "45130-0027",
        address: "한성시 신시가동 350",
        roadAddress: "한성시 신시가로 120",
        legalDong: "신시가동",
        legalCode: "4513010200",
        totalHouseholds: 980,
        totalBuildings: 12,
        buildings: [
          { dongName: "101동", dongCode: "45130002700101", floors: 22, households: 84 },
          { dongName: "102동", dongCode: "45130002700102", floors: 22, households: 84 },
          { dongName: "103동", dongCode: "45130002700103", floors: 22, households: 84 },
          { dongName: "104동", dongCode: "45130002700104", floors: 22, households: 84 },
        ],
        units: [
          { floor: 1, hoName: "101호", hoCode: "45130002700101101", area: 84.92, type: "84㎡A" },
          { floor: 1, hoName: "102호", hoCode: "45130002700101102", area: 59.83, type: "59㎡B" },
          { floor: 2, hoName: "201호", hoCode: "45130002700101201", area: 84.92, type: "84㎡A" },
          { floor: 2, hoName: "202호", hoCode: "45130002700101202", area: 59.83, type: "59㎡B" },
          { floor: 3, hoName: "301호", hoCode: "45130002700101301", area: 84.92, type: "84㎡A" },
          { floor: 3, hoName: "302호", hoCode: "45130002700101302", area: 59.83, type: "59㎡B" },
        ],
      },
      singleResult: {
        road: "한성시 시청로 25",
        jibun: "한성시 중앙동 12-4",
        zip: "39201",
        lat: "36.4172",
        lng: "128.1846",
        buildType: "공동주택", // 값 계약: 코어의 코드 섹션 노출 조건 값 — 변경 금지
        adminDong: "중앙동",
        legalDong: "중앙동",
        legalCode: "4513010100",
        adminCode: "4513051000",
        status: "완전매칭",
        complexName: "시청로한마음아파트",
        complexCode: "45130-0012",
      },
      sampleBatch: `한성시 중앙동 12-4
한성시 신시가동 210-3
한성시 호수동 88-1
한성시 공단동 55
한성시 대학동 77-2`,
      batchResults: [
        { input: "한성시 중앙동 12-4",    road: "한성시 시청로 25",       jibun: "한성시 중앙동 12-4",    zip: "39201", legalCode: "4513010100", adminCode: "4513051000", legalDong: "중앙동",   adminDong: "중앙동",   conf: 98.7, status: "완전매칭" },
        { input: "한성시 신시가동 210-3", road: "한성시 신시가로 120",    jibun: "한성시 신시가동 210-3", zip: "39215", legalCode: "4513010200", adminCode: "4513051500", legalDong: "신시가동", adminDong: "신시가동", conf: 99.1, status: "완전매칭" },
        { input: "한성시 호수동 88-1",    road: "한성시 호수공원길 42",   jibun: "한성시 호수동 88-1",    zip: "39222", legalCode: "4513010300", adminCode: "4513052000", legalDong: "호수동",   adminDong: "호수동",   conf: 97.4, status: "완전매칭" },
        { input: "한성시 공단동 55",      road: "한성시 산단대로 77",     jibun: "한성시 공단동 55",      zip: "39230", legalCode: "4513010400", adminCode: "4513052500", legalDong: "공단동",   adminDong: "공단동",   conf: 96.8, status: "부분매칭" },
        { input: "한성시 대학동 77-2",    road: "한성시 대학로3길 18",    jibun: "한성시 대학동 77-2",    zip: "39241", legalCode: "4513010500", adminCode: "4513053000", legalDong: "대학동",   adminDong: "대학동",   conf: 98.2, status: "완전매칭" },
      ],
      modeTypes: [
        { m: "single",  icon: "📍", label: "단일 주소",   desc: "민원 서식의 주소 1건을 도로명·우편번호·행정동 코드로 표준화", color: "rose" },
        { m: "batch",   icon: "📋", label: "일괄 처리",   desc: "전입신고·고지서 발송 주소를 한 번에 붙여넣어 일괄 표준화",     color: "orange" },
        { m: "ocr",     icon: "🔍", label: "OCR 파일",    desc: "종이 민원 신청서·공문 스캔본에서 주소 자동 추출",             color: "teal" },
        { m: "reverse", icon: "🔢", label: "코드 역조회", desc: "법정동·행정동 코드로 정식 주소를 역방향 조회",                 color: "purple" },
      ],
      ocrDocText: `[옥외광고물 허가 신청 접수 대장]
접수번호: 민원여권과-2026-접수-0894
접수일자: 2026.03.18  담당: 이서연(민원여권과)

1. 접수 개요
신청 유형: 옥외광고물 표시 허가 (일괄 5건)
기준 소재지: 한성시 중앙동 12-4

2. 설치 위치 내역
(1) 신청 1호: 한성시 신시가동 210-3
    현황: 준주거지역 | 옥상간판
(2) 신청 2호: 한성시 공단동 55
    현황: 일반공업지역 | 지주 간판

3. 현장 확인 대상지
   대상 A: 한성시 호수동 88-1
   대상 B: 한성시 대학동 77-2

4. 비고
   주소 정제 후 새올 인허가 대장 조회 예정`,
      ocrAddrResults: [
        { raw: "한성시 중앙동 12-4",    ctx: "기준 소재지",  ocrConf: 98.3, road: "한성시 시청로 25",     jibun: "한성시 중앙동 12-4",    zip: "39201", lat: "36.4172", lng: "128.1846", legalCode: "4513010100", legalDong: "중앙동",   adminCode: "4513051000", adminDong: "중앙동",   matchConf: 98.7, status: "완전매칭" },
        { raw: "한성시 신시가동 210-3", ctx: "신청 1호",     ocrConf: 97.1, road: "한성시 신시가로 120",  jibun: "한성시 신시가동 210-3", zip: "39215", lat: "36.4290", lng: "128.2011", legalCode: "4513010200", legalDong: "신시가동", adminCode: "4513051500", adminDong: "신시가동", matchConf: 99.2, status: "완전매칭" },
        { raw: "한성시 공단동 55",      ctx: "신청 2호",     ocrConf: 96.8, road: "한성시 산단대로 77",   jibun: "한성시 공단동 55",      zip: "39230", lat: "36.4021", lng: "128.2245", legalCode: "4513010400", legalDong: "공단동",   adminCode: "4513052500", adminDong: "공단동",   matchConf: 97.4, status: "완전매칭" },
        { raw: "한성시 호수동 88-1",    ctx: "현장 확인 A",  ocrConf: 94.2, road: "한성시 호수공원길 42", jibun: "한성시 호수동 88-1",    zip: "39222", lat: "36.4388", lng: "128.1702", legalCode: "4513010300", legalDong: "호수동",   adminCode: "4513052000", adminDong: "호수동",   matchConf: 96.8, status: "부분매칭" },
        { raw: "한성시 대학동 77-2",    ctx: "현장 확인 B",  ocrConf: 99.1, road: "한성시 대학로3길 18",  jibun: "한성시 대학동 77-2",    zip: "39241", lat: "36.4105", lng: "128.1933", legalCode: "4513010500", legalDong: "대학동",   adminCode: "4513053000", adminDong: "대학동",   matchConf: 98.2, status: "완전매칭" },
      ],
      ocrFeatureLabel: "민원 신청서 특화",
      codeLookup: {
        "4513010100": { type: "법정동", dong: "중앙동",   road: "한성시 시청로 25",     jibun: "한성시 중앙동 12-4",    zip: "39201", legalCode: "4513010100", adminCode: "4513051000", adminDong: "중앙동",   region: "한성시 > 중앙동 (법정)" },
        "4513051000": { type: "행정동", dong: "중앙동",   road: "한성시 시청로 25",     jibun: "한성시 중앙동 12-4",    zip: "39201", legalCode: "4513010100", adminCode: "4513051000", legalDong: "중앙동",   region: "한성시 > 중앙동 (행정)" },
        "4513010200": { type: "법정동", dong: "신시가동", road: "한성시 신시가로 120",  jibun: "한성시 신시가동 210-3", zip: "39215", legalCode: "4513010200", adminCode: "4513051500", adminDong: "신시가동", region: "한성시 > 신시가동 (법정)" },
        "4513051500": { type: "행정동", dong: "신시가동", road: "한성시 신시가로 120",  jibun: "한성시 신시가동 210-3", zip: "39215", legalCode: "4513010200", adminCode: "4513051500", legalDong: "신시가동", region: "한성시 > 신시가동 (행정)" },
        "4513010300": { type: "법정동", dong: "호수동",   road: "한성시 호수공원길 42", jibun: "한성시 호수동 88-1",    zip: "39222", legalCode: "4513010300", adminCode: "4513052000", adminDong: "호수동",   region: "한성시 > 호수동 (법정)" },
        "4513052000": { type: "행정동", dong: "호수동",   road: "한성시 호수공원길 42", jibun: "한성시 호수동 88-1",    zip: "39222", legalCode: "4513010300", adminCode: "4513052000", legalDong: "호수동",   region: "한성시 > 호수동 (행정)" },
        "4513010400": { type: "법정동", dong: "공단동",   road: "한성시 산단대로 77",   jibun: "한성시 공단동 55",      zip: "39230", legalCode: "4513010400", adminCode: "4513052500", adminDong: "공단동",   region: "한성시 > 공단동 (법정)" },
        "4513052500": { type: "행정동", dong: "공단동",   road: "한성시 산단대로 77",   jibun: "한성시 공단동 55",      zip: "39230", legalCode: "4513010400", adminCode: "4513052500", legalDong: "공단동",   region: "한성시 > 공단동 (행정)" },
        "4513010500": { type: "법정동", dong: "대학동",   road: "한성시 대학로3길 18",  jibun: "한성시 대학동 77-2",    zip: "39241", legalCode: "4513010500", adminCode: "4513053000", adminDong: "대학동",   region: "한성시 > 대학동 (법정)" },
        "4513053000": { type: "행정동", dong: "대학동",   road: "한성시 대학로3길 18",  jibun: "한성시 대학동 77-2",    zip: "39241", legalCode: "4513010500", adminCode: "4513053000", legalDong: "대학동",   region: "한성시 > 대학동 (행정)" },
      },
      codeQuickExamples: [
        { code: "4513010100", label: "한성시 중앙동 (법정)" },
        { code: "4513051500", label: "한성시 신시가동 (행정)" },
        { code: "4513010400", label: "한성시 공단동 (법정)" },
      ],
    },
    /* buildPressHtml/buildReportHtml 생략 = 정상 (2026-07-06 데이터 구동화) —
       기본 빌더가 아래 press·report 접두 키 + 도메인 org로 인쇄 HTML을 생성한다. */
    "agent-report": {
      apvLine: [
        { name: "이서연", dept: "민원여권과", title: "주무관",       role: "작성자" },
        { name: "김도윤", dept: "민원여권과", title: "민원지원팀장", role: "검토자" },
        { name: "박정호", dept: "민원여권과", title: "과장",         role: "승인자" },
      ],
      reportTypes: [
        { id: "weekly",    label: "주간 업무보고",     icon: "📊", desc: "주간 민원 처리 실적 및 차주 계획" },
        { id: "field",     label: "현장 점검보고",     icon: "🚧", desc: "인허가 현장 확인·점검 결과 보고" },
        { id: "monthly",   label: "월간 업무보고",     icon: "📈", desc: "월간 종합 민원행정 실적 보고" },
        { id: "officetel", label: "분기 민원행정 동향", icon: "🏛️", desc: "분기별 민원 처리 통계 보도자료" },
        { id: "market",    label: "시정 현안보고",     icon: "📉", desc: "주요 시정 현안 및 대응 방향 보고" },
      ],
      docNums: {
        weekly:    "HSC-민원여권과-2026-053",
        field:     "HSC-민원여권과-2026-054",
        monthly:   "HSC-민원여권과-2026-055",
        officetel: "HSC-기획예산과-2026-021",
        market:    "HSC-기획예산과-2026-022",
      },
      docNumFallback: "HSC-민원여권과-2026-053",
      reportDefaults: {
        weekly: {
          dept: "민원여권과",
          period: "2026. 03. 09. ~ 03. 13.",
          mainWork: "- 여권 발급 처리 412건 완료 (긴급 발급 6건 포함)\n- 옥외광고물 표시 허가 검토 8건 처리\n- 민원 처리기한 연장 통지 3건 (새올 등록 완료)",
          nextPlan: "- 외국인 통합민원 창구 개시 준비 (4.1. 개시)\n- 분기 민원 실적 집계 및 보고서 작성\n- 허가 처리 결과 통보 5건",
          special: "- 신시가동 전입 민원 급증 (아파트 입주) — 임시 창구 운영 검토 중",
        },
        field: {
          dept: "민원여권과",
          period: "2026. 03. 11. (수)",
          mainWork: "- 옥외광고물 허가 신청지 5개소 현장 확인 완료\n- 표시 면적·구조 안전 확인서 대조 완료\n- 무허가 광고물 2건 확인 및 기록",
          nextPlan: "- 확인 결과 새올 인허가 대장 등록 및 팀장 검토 제출\n- 잔여 신청지 3개소 현장 확인 일정 협의",
          special: "- 호수동 1건 무단 용도변경 의심 — 시정명령 사전통지 예정",
        },
        monthly: {
          dept: "민원여권과",
          period: "2026. 02.",
          mainWork: "- 민원 접수 총 3,298건 처리 (기한 내 처리율 92.9%)\n- 옥외광고물 표시 허가 26건 처리\n- 처리기한 연장 통지 11건 (전건 새올 등록)",
          nextPlan: "- 3월 민원 처리 계획 수립 및 창구 인력 배정\n- 1분기 실적 취합 및 과장 보고",
          special: "- 2월 기한 내 처리율 92.9% — 전월(92.6%) 대비 개선",
        },
        officetel: {
          dept: "기획예산과 시정분석팀",
          period: "2026. 01. ~ 03. (1분기)",
          mainWork: "- '26년 1분기 민원행정 동향 집계 완료 (12개 행정동, 접수 10,480건)\n- 민원 접수 전분기 대비 4.2% 증가 (전입·차량등록 민원 증가 주도)\n- 기한 내 처리율 93.1% (전분기 92.2%), 평균 처리일 4.2일로 단축\n- 온라인(정부24) 접수 비중 61.4% — 목표(60%) 조기 달성\n- 국민신문고 이첩 214건, 반복 민원 비중 2.6% 산출 완료",
          nextPlan: "- '26년 2분기 민원행정 동향 집계 준비 (7월 발표)\n- 행정동별 창구 대기시간 실측 조사 실시\n- 무인민원발급기 증설(2대) 효과 분석 (7월 예정)\n- 기한 초과 다발 부서 컨설팅 계획 수립",
          special: "- 신시가동 접수 17% 증가: 아파트 입주에 따른 전입·차량등록 집중\n- 중앙동 창구 민원 전체의 38% — 무인발급기 2대 증설 검토\n- 공단동 야간 소음 신고 증가 추세 — 여름철 집중 관리 필요",
        },
        market: {
          dept: "기획예산과 시정분석팀",
          period: "2026. 03. (1분기)",
          mainWork: "- 주요 시정 현안 3건 점검: 벚꽃축제 안전관리, 통합민원 창구, AI 챗봇 시범\n- 벚꽃축제 예상 방문객 일 25,000명 — 안전요원 48명 배치 계획 확정\n- 외국인 통합민원 창구 4.1. 개시 — 12종 민원·4개 언어 통역 예약제\n- AI 민원 상담 챗봇 답변 정확도 94.2% 검증 완료",
          nextPlan: "- 2분기 시정 현안 점검 계획 수립\n- 축제 안전관리 결과 평가 및 백서 작성\n- 챗봇 시범 창구 3개소 선정 및 하반기 운영 준비",
          special: "- 재난안전법 제66조의11 개정 시행 — 지역축제 안전관리 의무 강화 대응 필요",
        },
      },
      reportDate: "2026. 03. 13.",
      pressDate: "2026. 04. 10.",
      pressDistDate: "2026년 4월 10일 (금)",
      approvalSystem: "온나라",
      apvRefNo: "APV-2026-0313-053",
      logoAlt: "한성시청",
      perfCharts: {
        weekly:  { label: "주간",     data: [ { item: "여권 발급",   완료: 412, 목표: 400 }, { item: "허가 검토", 완료: 8,  목표: 10 }, { item: "연장 통지", 완료: 3,  목표: 3 } ] },
        monthly: { label: "월간",     data: [ { item: "민원 처리",   완료: 3298, 목표: 3400 }, { item: "허가 처리", 완료: 26, 목표: 30 }, { item: "연장 통지", 완료: 11, 목표: 15 } ] },
        field:   { label: "현장 확인", data: [ { item: "확인 대상지", 완료: 5, 목표: 5 }, { item: "서류 대조",  완료: 8,  목표: 10 }, { item: "위반 기록",  완료: 2,  목표: 2 } ] },
      },
      perfDoneKey: "완료", perfGoalKey: "목표",
      pressTypeId: "officetel",
      pressKpiTitle: "▪ 2026년 1분기 민원행정 핵심 지표 (전분기 대비)",
      pressKpiCards: [
        { label: "민원 접수",       value: "▲ 4.2%",  sub: "전분기 +1.8%",   color: "#dc2626" },
        { label: "기한 내 처리율",  value: "93.1%",   sub: "전분기 92.2%",   color: "#16a34a" },
        { label: "온라인 접수 비중", value: "61.4%",  sub: "목표 60% 달성",  color: "#16a34a" },
        { label: "평균 처리일",     value: "4.2일",   sub: "전분기 4.6일",   color: "#1e40af" },
      ],
      pressKpiStats: [
        { label: "분기 총 접수",       value: "10,480건" },
        { label: "반복 민원 비중",     value: "2.6%" },
        { label: "국민신문고 이첩",    value: "214건" },
      ],
      pressTrendTitle: "▪ 월별 처리 지표 추이 (단위: %)",
      pressTrendData: [
        { month: "1월", 처리율: 92.6, 온라인비중: 59.2, 만족도: 87.8 },
        { month: "2월", 처리율: 92.9, 온라인비중: 60.5, 만족도: 88.1 },
        { month: "3월", 처리율: 93.1, 온라인비중: 61.4, 만족도: 88.4 },
      ],
      pressTrendSeries: [{ key: "처리율", color: "#16a34a" }, { key: "온라인비중", color: "#2563eb" }, { key: "만족도", color: "#dc2626" }],
      pressTrendDomain: [55, 100],
      pressBarTitle: "▪ 주요 행정동별 접수 현황 (건)",
      pressBarData: [
        { area: "중앙동",   민원: 487, 인허가: 39, 신문고: 21 },
        { area: "신시가동", 민원: 452, 인허가: 31, 신문고: 18 },
        { area: "공단동",   민원: 398, 인허가: 24, 신문고: 26 },
        { area: "대학동",   민원: 342, 인허가: 12, 신문고: 14 },
        { area: "강변동",   민원: 315, 인허가: 9,  신문고: 11 },
      ],
      pressBarSeries: [
        { key: "민원",   color: "#93c5fd", posColor: "#93c5fd" },
        { key: "인허가", color: "#86efac", posColor: "#86efac" },
        { key: "신문고", color: "#fca5a5", posColor: "#fca5a5" },
      ],
      pressSections: [
        { num: "1", title: "민원 접수 동향",
          regions: [ { area: "전체", rate: "+4.2%", prev: "+1.8%" }, { area: "창구", rate: "-2.1%", prev: "-0.4%" }, { area: "온라인", rate: "+9.6%", prev: "+5.2%" } ],
          details: [
            { area: "중앙동",   rate: "487건",  note: "여권·전입 등 창구 민원이 전체의 38% — 무인민원발급기 2대 증설 검토 중" },
            { area: "신시가동", rate: "452건",  note: "아파트 입주 지속으로 전입신고·차량등록 민원 6개월 새 17% 증가. 임시 창구 운영 검토" },
            { area: "공단동",   rate: "398건",  note: "산업단지 소음·환경 민원 비중 높음. 야간 조업 신고 여름철 증가 경향 — 집중 관리 대상" },
          ],
        },
        { num: "2", title: "처리 기한 준수 동향",
          regions: [ { area: "전체", rate: "93.1%", prev: "92.2%" }, { area: "일반민원", rate: "94.8%", prev: "94.1%" }, { area: "인허가", rate: "88.7%", prev: "87.2%" } ],
          details: [
            { area: "일반",   rate: "(94.8%)", note: "AI 사전 검토 도입 부서 중심으로 개선. 평균 처리일 4.2일로 전분기 대비 0.4일 단축" },
            { area: "인허가", rate: "(88.7%)", note: "현장 확인 대기가 지연 주요인. 확인 일정 자동 배정 도입으로 개선 추세 (87.2%→88.7%)" },
            { area: "연장",   rate: "(1.9%)",  note: "처리기한 연장 비율 1.9% — 전건 새올 등록·알림톡 통지 완료. 감사 지적 0건" },
          ],
        },
        { num: "3", title: "인허가 처리 동향",
          regions: [ { area: "전체", rate: "282건", prev: "251건" }, { area: "옥외광고", rate: "72건", prev: "58건" }, { area: "일반음식점", rate: "64건", prev: "61건" } ],
          details: [
            { area: "옥외광고", rate: "(+24%)", note: "봄 축제·상권 회복으로 신청 증가. 조례 별표 2 수수료 산정 자동화로 처리 지연 없음" },
            { area: "음식점",   rate: "(+5%)",  note: "신시가동 상가 입점 증가로 신규 허가 꾸준. 위생 점검 병행으로 반려율 8.7% 유지" },
            { area: "위반",     rate: "(9건)",  note: "무허가·무단 변경 9건 적발 — 시정명령 7건, 이행강제금 부과 예고 2건" },
          ],
        },
      ],
      pressIndexTitle: "2026년 1~3월 민원행정 지표 및 증감",
      pressIndexHead: ["구분", "2026.1", "2026.2", "2026.3", "전분기 대비"],
      pressIndexGroups: [
        { label: "민원 접수 (건)",       rows: [ { a: "전체",   v1: "3,421", v2: "3,298", v3: "3,761", c: "+4.2%" }, { a: "창구",   v1: "1,388", v2: "1,302", v3: "1,401", c: "-2.1%" }, { a: "온라인", v1: "2,033", v2: "1,996", v3: "2,360", c: "+9.6%" } ] },
        { label: "기한 내 처리율 (%)",   rows: [ { a: "전체",     v1: "92.6", v2: "92.9", v3: "93.1", c: "+0.9%p" }, { a: "일반민원", v1: "94.2", v2: "94.5", v3: "94.8", c: "+0.7%p" }, { a: "인허가",   v1: "87.9", v2: "88.2", v3: "88.7", c: "+1.5%p" } ] },
        { label: "온라인 접수 비중 (%)", rows: [ { a: "전체",   v1: "59.2", v2: "60.5", v3: "61.4", c: "+2.2%p" }, { a: "증명발급", v1: "72.4", v2: "73.1", v3: "74.0", c: "+1.6%p" }, { a: "인허가",   v1: "31.8", v2: "33.2", v3: "34.6", c: "+2.8%p" } ] },
      ],
      pressIndexNote: "* 집계: 새올행정시스템 민원 통계 월보 | 국민신문고 이첩 건 포함",
      pressRatioTitle: "행정동별 기한초과율 및 평균 처리일",
      pressRatioData: [
        { area: "중앙동",   기한초과율: 5.8, 평균처리일: 4.8 },
        { area: "신시가동", 기한초과율: 6.4, 평균처리일: 5.1 },
        { area: "공단동",   기한초과율: 5.2, 평균처리일: 4.6 },
        { area: "대학동",   기한초과율: 3.4, 평균처리일: 3.9 },
        { area: "전체",     기한초과율: 4.9, 평균처리일: 4.2 },
      ],
      pressRatioLeftKey: "기한초과율", pressRatioRightKey: "평균처리일",
      pressRatioLeftDomain: [0, 10], pressRatioRightDomain: [2, 7],
      pressRatioThreshold: 5,
      pressRatioRefLabel: "관리선 5%",
      pressRatioNote: "* 기한초과율 5% 이상(빨간 막대): 집중 관리 대상 행정동 | 평균 처리일: 접수→결과 통지 소요일",
      pressContact: "기획예산과 시정분석팀장 홍은지 ☎ (054)450-2311 | 담당 주무관 이서연 ☎ (054)450-2314　｜　자료확인: 한성시 열린데이터 포털 data.hansung.go.kr",
    },
  },
  agentCatalog: {
    "agent-chatbot":      { name: "민원 응대 챗봇", shortName: "민원 응대", desc: "민원 처리 절차, 구비서류, 수수료 등을 법령·편람 근거와 함께 즉시 안내합니다." },
    "agent-report":       { name: "보고서·보도자료 에이전트", shortName: "보고서 작성", desc: "시정 실적과 통계를 집계해 내부 보고서와 보도자료 초안을 표준 서식으로 작성합니다." },
    "agent-meeting":      { name: "회의록 작성 에이전트", shortName: "회의록 작성", desc: "위원회·간담회 녹음을 발언자 구분과 함께 회의록으로 정리하고 의결사항을 추출합니다." },
    "agent-knowledge":    { name: "행정 지식 검색 에이전트", shortName: "지식 검색", desc: "조례, 예규, 업무편람, 감사 사례 등 행정 지식을 시맨틱 검색으로 찾아줍니다." },
    "agent-internalreg":  { name: "조례·규칙 조회 에이전트", shortName: "조례 조회", desc: "자치법규를 조항 단위로 검색하고 상위법 위임 관계와 개정 이력을 추적합니다." },
    "agent-ocr":          { name: "공문서 OCR 에이전트", shortName: "공문서 OCR", desc: "민원 신청서, 종이 공문서, 증빙서류를 인식하고 개인정보를 자동 마스킹합니다." },
    "agent-dbquery":      { name: "행정DB 조회 에이전트", shortName: "행정DB 조회", desc: "자연어로 질문하면 민원 통계, 예산 집행, 인허가 현황을 SQL로 변환해 조회합니다." },
    "agent-address":      { name: "주소 정제 에이전트", shortName: "주소 정제", desc: "민원 서류의 지번·도로명 주소를 표준화하고 행정동 코드와 좌표를 매핑합니다." },
    "agent-dataanalysis": { name: "시정 데이터 분석 에이전트", shortName: "시정 분석", desc: "민원·인구·예산 데이터를 업로드하면 추이 분석과 시각화 리포트를 생성합니다." },
    "agent-summary":      { name: "문서 요약 에이전트", shortName: "문서 요약", desc: "감사 보고서, 연구 용역 보고서, 국·과 업무보고를 유형별로 요약하고 개정본을 비교합니다." },
    "agent-translate":    { name: "다국어 민원 번역 에이전트", shortName: "민원 번역", desc: "외국인 민원 서류와 안내문을 한·영·중·일로 번역하고 행정 용어집을 적용합니다." },
    "agent-review":       { name: "공문 사전 검토 에이전트", shortName: "공문 검토", desc: "기안문·공문서를 조례·규칙 및 복무규정과 자동 대조하여 절차 하자를 검토합니다." },
    "agent-safety":       { name: "행사·점검 안전계획 에이전트", shortName: "안전계획", desc: "지역 행사와 현장점검의 위험 요소를 평가하고 재난안전법 기반 안전계획서를 생성합니다." },
  },
  /* ── 관리자 콘텐츠 오버라이드 (adminContent) ──
     키는 src/admin/mocks.js 상수명 그대로 — App.jsx applyAdminDomain()이 렌더 시 교체.
     shape·항목 수·필드 키·코드 계약 문자열(status 등)은 REB 기본값과 동일 계약.
     의도적 제외(도메인 중립 인프라 — REB 기본값 노출): MOCK_GPU_NODES, MOCK_MODELS,
     MOCK_NODES, MOCK_FILTER_RULES, MOCK_RAG_GLOBAL, MOCK_OUTPUT_GUARDRAILS,
     MOCK_CONFIDENCE_CONFIG, MOCK_CODESPACES, MOCK_VOLUMES, MOCK_EMBED_STATUS,
     MOCK_SURVEYS_MGMT, MOCK_APIS, MOCK_CONNECTED_SW, MOCK_AIACT_LABELING */
  adminContent: {
    // 관리자 데모 페르소나 — 사이드바·작성자·프로필 전역
    ADMIN_PERSONA: { name: '강수진', role: '관리자', dept: '정보통신과', email: 'kang@hansung.go.kr' },

    MOCK_EMBEDDING_JOBS: [
      {id:950,name:'민원사무편람 임베딩 v3',plan:'KoE5-base',creator:'강수진',dept:'정보통신과',date:'2026-02-10 14:51:32',gpu:'A100 x1',tbStatus:'실행 중',status:'학습 완료'},
      {id:910,name:'자치법규(조례·규칙) 임베딩 v2',plan:'KoE5-base',creator:'윤지우',dept:'자치행정과',date:'2026-01-28 22:35:46',gpu:'A100 x1',tbStatus:'실행 중',status:'학습 완료'},
      {id:895,name:'훈령·예규 통합 임베딩 v4',plan:'KoE5-large',creator:'윤지우',dept:'자치행정과',date:'2026-01-19 19:59:20',gpu:'A100 x2',tbStatus:'중지됨',status:'취소됨'},
      {id:874,name:'정보공개 결정례 임베딩 v1',plan:'KoE5-base',creator:'홍은지',dept:'기획예산과',date:'2026-01-19 19:40:26',gpu:'A100 x1',tbStatus:'중지됨',status:'학습 완료'},
      {id:856,name:'인허가 대장 임베딩 v2',plan:'BGE-m3-ko',creator:'김도윤',dept:'민원여권과',date:'2026-01-12 12:00:38',gpu:'A100 x1',tbStatus:'중지됨',status:'학습 완료'},
      {id:853,name:'민원 상담 사례 임베딩 v1',plan:'BGE-m3-ko',creator:'서지혜',dept:'복지정책과',date:'2026-01-11 11:37:59',gpu:'A100 x1',tbStatus:'중지됨',status:'오류 발생'},
      {id:847,name:'법령·판례 임베딩 v2',plan:'KoE5-large',creator:'유경석',dept:'안전총괄과',date:'2025-12-18 21:42:03',gpu:'A100 x2',tbStatus:'중지됨',status:'대기 중'},
      {id:844,name:'감사 사례집 임베딩 v1',plan:'KoE5-base',creator:'노태건',dept:'정보통신과',date:'2025-12-18 20:58:53',gpu:'A100 x1',tbStatus:'중지됨',status:'오류 발생'},
      {id:838,name:'재난 대응 매뉴얼 임베딩 v1',plan:'KoE5-base',creator:'조현우',dept:'안전총괄과',date:'2025-12-18 20:46:38',gpu:'A100 x1',tbStatus:'중지됨',status:'오류 발생'},
    ],

    MOCK_MCP_TOOLS: [
      {id:162,name:'Search',desc:'시청 지식베이스 시맨틱 검색',creator:'강수진',dept:'정보통신과',date:'2026-01-29 22:06:28'},
      {id:159,name:'Web Search',desc:'검색 분야 설정 + 검색 분량 설정 추가',creator:'이서연',dept:'민원여권과',date:'2026-01-23 10:59:32'},
      {id:158,name:'Web Crawler',desc:'행정안전부·법제처 고시 수집',creator:'윤지우',dept:'자치행정과',date:'2026-01-21 18:36:52'},
      {id:155,name:'Dynamic SearchFilter',desc:'보안등급별 검색 결과 필터링',creator:'노태건',dept:'정보통신과',date:'2026-01-20 15:27:50'},
      {id:153,name:'Dynamic Filter',desc:'부서 권한 기반 응답 필터링',creator:'홍은지',dept:'기획예산과',date:'2026-01-17 18:01:51'},
      {id:151,name:'CodeDev',desc:'민원 통계 분석 코드 실행 샌드박스',creator:'서지혜',dept:'복지정책과',date:'2025-12-26 14:28:00'},
      {id:150,name:'DocConverter',desc:'HWP·PDF 문서 변환기',creator:'윤지우',dept:'자치행정과',date:'2025-12-24 16:24:45'},
      {id:148,name:'SearchFilter',desc:'자치법규 검색 범위 제한',creator:'이서연',dept:'민원여권과',date:'2025-12-18 17:56:05'},
      {id:146,name:'AddrGeocoder',desc:'주소 표준화·행정동 코드 매핑',creator:'김도윤',dept:'민원여권과',date:'2025-12-12 16:17:30'},
      {id:145,name:'Normality_Test',desc:'민원 통계 분포 정규성 검정',creator:'홍은지',dept:'기획예산과',date:'2025-12-12 14:46:54'},
    ],

    MOCK_PROMPTS: [
      {id:385,name:'[전용] 민원 상담 RAG',desc:'민원 처리 절차·구비서류 질의 응답용 RAG 프롬프트',dept:'민원여권과',date:'2026-01-29 10:41:12'},
      {id:384,name:'처리기한 연장 통지문 프롬프트',desc:'연장 통지문 표준 서식 초안 생성',dept:'민원여권과',date:'2026-01-27 10:54:11'},
      {id:383,name:'[전용] 나만의 RAG',desc:'개인 지식영역 기반 전용 채팅',dept:'정보통신과',date:'2026-01-22 14:10:12'},
      {id:382,name:'보도자료 요약 프롬프트',desc:'주간 보도자료 3줄 요약 생성',dept:'기획예산과',date:'2026-01-22 04:30:28'},
      {id:381,name:'신규 임용자 교육용 프롬프트',desc:'민원 응대 입문 교육 질의응답 자료',dept:'자치행정과',date:'2026-01-22 04:27:45'},
      {id:380,name:'[전용] 조례 원문 뷰어',desc:'전용 채팅 기능(조례 원문 인용·조항 이동)',dept:'자치행정과',date:'2026-01-20 18:30:11'},
      {id:378,name:'[전용] 보고서 자동 생성',desc:'전용 채팅 기능(주간 시정 보고 서식)',dept:'기획예산과',date:'2026-01-13 18:11:50'},
    ],

    MOCK_CHAT_APPS: [
      {id:1663,name:'민원 상담 챗봇',type:'전용 채팅',status:'Online',deploy:'배포',creator:'이서연',dept:'민원여권과',addr:'/apps/minwon-chat'},
      {id:1662,name:'여권 발급 안내 봇',type:'전용 채팅',status:'Online',deploy:'배포',creator:'김도윤',dept:'민원여권과',addr:'/apps/passport-guide'},
      {id:1661,name:'조례 Q&A 봇',type:'전용 채팅',status:'Online',deploy:'배포',creator:'윤지우',dept:'자치행정과',addr:'/apps/ordinance-qa'},
      {id:1656,name:'인허가 진행 조회 도우미',type:'전용 채팅',status:'Online',deploy:'배포',creator:'박정호',dept:'민원여권과',addr:'/apps/permit-status'},
      {id:1655,name:'외국인 민원 번역 봇 (시범)',type:'전용 채팅',status:'Offline',deploy:'배포중지',creator:'서지혜',dept:'복지정책과',addr:'/apps/foreign-translate'},
      {id:1650,name:'정보공개 청구 안내 봇',type:'전용 채팅',status:'Online',deploy:'배포',creator:'홍은지',dept:'기획예산과',addr:'/apps/openinfo'},
      {id:1649,name:'시정 통계 조회 어시스턴트',type:'전용 채팅',status:'Online',deploy:'배포',creator:'홍은지',dept:'기획예산과',addr:'/apps/stats-query'},
      {id:1645,name:'리모트 RAG 채팅',type:'전용 채팅',status:'Offline',deploy:'배포중지',creator:'노태건',dept:'정보통신과',addr:'/apps/remote-rag'},
      {id:1643,name:'복지 급여 안내 봇',type:'전용 채팅',status:'Online',deploy:'배포',creator:'서지혜',dept:'복지정책과',addr:'/apps/welfare-guide'},
      {id:1640,name:'현장 점검 지원 챗봇',type:'전용 채팅',status:'Online',deploy:'배포',creator:'조현우',dept:'안전총괄과',addr:'/apps/field-check'},
    ],

    // 승격: REB 기본값의 user·query가 기업(회사·경쟁사) 어휘 — 행정 어휘로 교체
    MOCK_GUARDRAIL_LOGS: [
      {id:1,time:'2026-02-10 11:23:45',user:'김주무관',query:'비공개 대상 문서 원문 알려줘',rule:'기밀정보 요청',action:'차단'},
      {id:2,time:'2026-02-10 10:15:22',user:'이주무관',query:'타 지자체 공모 대응 전략 내부자료 분석해줘',rule:'경쟁정보 수집',action:'차단'},
      {id:3,time:'2026-02-09 16:42:11',user:'박팀장',query:'직원 수당 지급 명세 전체 목록',rule:'개인정보 접근',action:'차단'},
      {id:4,time:'2026-02-09 14:30:05',user:'최주무관',query:'보안 시스템 우회 방법',rule:'보안 우회 시도',action:'차단'},
      {id:5,time:'2026-02-08 09:12:33',user:'정주무관',query:'퇴직 공무원 연락처 전체',rule:'개인정보 접근',action:'경고'},
    ],

    MOCK_LLM_ADMIN_MODELS: [
      {id:'m-001',name:'GPT-OSS-120B',baseModel:'Meta-Llama-3-405B-Instruct',version:'v2.4.1',
       desc:'한성시 특화 파인튜닝 대용량 LLM — 자치법규 검색, 문서 요약, 에이전트 업무 자동화 최적화',
       status:'Active',temperature:0.3,maxTokens:4096,topP:0.9,contextWindow:'128K',
       systemPrompt:'당신은 한성시청의 전문 AI 어시스턴트입니다.\n\n규칙:\n1. 반드시 자치법규·행정 지침을 우선 참조합니다.\n2. 불확실한 내용은 "확인이 필요합니다"로 답변합니다.\n3. 개인정보 및 비공개 정보는 절대 제공하지 않습니다.\n4. 모든 답변은 공문서 형식을 따릅니다.',
       promptHistory:[
        {ver:'v2.4.1',date:'2026-02-10 14:30',author:'강수진',note:'보안 규칙 4항 추가',
         content:'당신은 한성시청의 전문 AI 어시스턴트입니다.\n\n규칙:\n1. 반드시 자치법규·행정 지침을 우선 참조합니다.\n2. 불확실한 내용은 "확인이 필요합니다"로 답변합니다.\n3. 개인정보 및 비공개 정보는 절대 제공하지 않습니다.\n4. 모든 답변은 공문서 형식을 따릅니다.'},
        {ver:'v2.3.0',date:'2026-01-15 09:00',author:'노태건',note:'처리기한 안내 규칙 개선',
         content:'당신은 한성시청의 AI 어시스턴트입니다.\n\n자치법규를 참조하여 답변하고, 불확실한 내용은 확인 필요 안내를 제공하세요.'},
        {ver:'v2.0.0',date:'2025-12-01 10:00',author:'강수진',note:'초기 배포 버전',
         content:'한성시청 AI 어시스턴트입니다. 전문적이고 정확한 정보를 제공합니다.'},
      ]},
      {id:'m-002',name:'Llama-3-Kor-Instruct',baseModel:'Meta-Llama-3-70B',version:'v1.8.0',
       desc:'70B 한국어 특화 경량 모델 — 복무 질의, 교육 안내 등 빠른 응답 업무에 활용',
       status:'Active',temperature:0.5,maxTokens:2048,topP:0.95,contextWindow:'8K',
       systemPrompt:'한성시청 직원 지원 AI입니다. 복무규정, 맞춤형 복지, 교육 안내를 친절하게 제공합니다.',
       promptHistory:[
        {ver:'v1.8.0',date:'2026-02-01 11:00',author:'윤지우',note:'복무규정 2026 개정 반영',
         content:'한성시청 직원 지원 AI입니다. 복무규정, 맞춤형 복지, 교육 안내를 친절하게 제공합니다.'},
        {ver:'v1.5.0',date:'2025-11-10 09:00',author:'서지혜',note:'교육 안내 기능 추가',content:'한성시청 복무 지원 어시스턴트입니다.'},
      ]},
      {id:'m-003',name:'EXAONE-3.0-7.8B',baseModel:'LG-EXAONE-3.0-7.8B',version:'v1.3.2',
       desc:'LG AI Research 7.8B 경량 모델 — 저지연 실시간 응답, 단순 질의 최적',
       status:'Active',temperature:0.6,maxTokens:1024,topP:0.9,contextWindow:'32K',
       systemPrompt:'한성시 정보 안내 AI입니다. 간결하고 정확하게 답변합니다.',
       promptHistory:[
        {ver:'v1.3.2',date:'2026-01-20 14:00',author:'강수진',note:'응답 간결화 지시어 추가',content:'한성시 정보 안내 AI입니다. 간결하고 정확하게 답변합니다.'},
      ]},
      {id:'m-004',name:'Solar-10.7B-v1.0',baseModel:'Upstage-Solar-Pro-10.7B',version:'v1.0.0',
       desc:'Upstage Solar 10.7B — 비활성화 (성능 평가 후 재도입 예정)',
       status:'Inactive',temperature:0.5,maxTokens:2048,topP:0.9,contextWindow:'4K',
       systemPrompt:'',promptHistory:[]},
    ],

    MOCK_RERANK_PIPELINES: [
      {id:'rp-001',agent:'자치법규 검색 에이전트',model:'BGE-Reranker-v2',topK:5,threshold:0.70,enabled:true,improvement:18.4},
      {id:'rp-002',agent:'민원 분류 어시스턴트',model:'Cross-Encoder-KoE5',topK:3,threshold:0.75,enabled:true,improvement:12.1},
      {id:'rp-003',agent:'복무규정 질의응답 봇',model:'BGE-Reranker-v2',topK:5,threshold:0.65,enabled:true,improvement:9.8},
      {id:'rp-004',agent:'계약서 검토 에이전트',model:'ColBERT-v2-Kor',topK:8,threshold:0.80,enabled:false,improvement:0},
      {id:'rp-005',agent:'민원 대응 가이드',model:'BGE-Reranker-v2',topK:5,threshold:0.85,enabled:true,improvement:22.3},
      {id:'rp-006',agent:'신규 임용자 교육 튜터',model:'Cross-Encoder-KoE5',topK:4,threshold:0.68,enabled:true,improvement:7.5},
    ],

    MOCK_RAG_AREAS: [
      {id:'KA-001',area:'자치법규',topK:8,threshold:0.70,chunkSize:256,override:true,updated:'2026-02-12'},
      {id:'KA-002',area:'민원사무편람',topK:10,threshold:0.65,chunkSize:512,override:true,updated:'2026-02-10'},
      {id:'KA-003',area:'복무·인사규정',topK:5,threshold:0.60,chunkSize:512,override:false,updated:'2026-02-08'},
      {id:'KA-004',area:'계약·회계',topK:6,threshold:0.75,chunkSize:256,override:true,updated:'2026-02-05'},
      {id:'KA-005',area:'교육자료',topK:7,threshold:0.62,chunkSize:512,override:false,updated:'2026-02-11'},
      {id:'KA-006',area:'재난·안전 대응',topK:5,threshold:0.80,chunkSize:256,override:true,updated:'2026-01-28'},
    ],

    MOCK_USERS: [
      {id:'USR-001',name:'강수진',dept:'정보통신과',role:'시스템관리자',email:'kang@hansung.go.kr',status:'Running',lastLogin:'2026-02-14 09:10',loginCount:342,apiCalls:1580},
      {id:'USR-002',name:'김도윤',dept:'민원여권과',role:'부서관리자',email:'kimdy@hansung.go.kr',status:'Running',lastLogin:'2026-02-14 08:45',loginCount:280,apiCalls:920},
      {id:'USR-003',name:'이서연',dept:'민원여권과',role:'일반사용자',email:'lee@hansung.go.kr',status:'Running',lastLogin:'2026-02-13 17:30',loginCount:156,apiCalls:430},
      {id:'USR-004',name:'조현우',dept:'안전총괄과',role:'일반사용자',email:'cho@hansung.go.kr',status:'Running',lastLogin:'2026-02-14 07:20',loginCount:98,apiCalls:210},
      {id:'USR-005',name:'윤지우',dept:'자치행정과',role:'부서관리자',email:'yoon@hansung.go.kr',status:'Stopped',lastLogin:'2026-02-10 14:00',loginCount:45,apiCalls:80},
      {id:'USR-006',name:'서지혜',dept:'복지정책과',role:'일반사용자',email:'seo@hansung.go.kr',status:'Running',lastLogin:'2026-02-13 16:55',loginCount:201,apiCalls:560},
      {id:'USR-007',name:'홍은지',dept:'기획예산과',role:'부서관리자',email:'hong@hansung.go.kr',status:'Running',lastLogin:'2026-02-14 08:00',loginCount:310,apiCalls:1200},
      {id:'USR-008',name:'노태건',dept:'정보통신과',role:'시스템관리자',email:'noh@hansung.go.kr',status:'Running',lastLogin:'2026-02-14 09:05',loginCount:450,apiCalls:2100},
    ],

    MOCK_PERMISSION_REQUESTS: [
      {id:'PRM-001',user:'이서연',dept:'민원여권과',type:'지식영역 접근',target:'자치법규 DB',status:'대기 중',date:'2026-02-13'},
      {id:'PRM-002',user:'조현우',dept:'안전총괄과',type:'API 키 발급',target:'GPT-OSS-120B',status:'대기 중',date:'2026-02-12'},
      {id:'PRM-003',user:'홍은지',dept:'기획예산과',type:'에이전트 배포',target:'현장 점검 보고서 생성기',status:'완료',date:'2026-02-11'},
      {id:'PRM-004',user:'윤지우',dept:'자치행정과',type:'데이터셋 접근',target:'Minwon_Manual_QA_v1',status:'완료',date:'2026-02-10'},
    ],

    MOCK_KNOWLEDGE_AREAS: [
      {id:'KA-001',name:'자치법규',desc:'한성시 조례·규칙·훈령·예규',docs:245,chunks:12400,size:'1.2 GB',owner:'자치행정과',access:['자치행정과','민원여권과','기획예산과'],updated:'2026-02-12',status:'Running'},
      {id:'KA-002',name:'민원사무편람',desc:'민원 접수·처리 실무 문서',docs:180,chunks:9200,size:'850 MB',owner:'민원여권과',access:['민원여권과','복지정책과'],updated:'2026-02-10',status:'Running'},
      {id:'KA-003',name:'복무·인사규정',desc:'복무, 수당, 맞춤형 복지 관련 규정',docs:120,chunks:6100,size:'320 MB',owner:'자치행정과',access:['전체'],updated:'2026-02-08',status:'Running'},
      {id:'KA-004',name:'계약·회계',desc:'계약 서식 및 회계 예규 문서',docs:95,chunks:4800,size:'450 MB',owner:'기획예산과',access:['기획예산과','자치행정과'],updated:'2026-02-05',status:'Running'},
      {id:'KA-005',name:'교육자료',desc:'신규 임용자 교육 및 직무 교육 자료',docs:310,chunks:15600,size:'2.1 GB',owner:'자치행정과',access:['전체'],updated:'2026-02-11',status:'Running'},
      {id:'KA-006',name:'재난·안전 대응',desc:'재난 대응 매뉴얼 및 상황 전파 절차',docs:65,chunks:3200,size:'180 MB',owner:'안전총괄과',access:['전체'],updated:'2026-01-28',status:'Warning'},
    ],

    MOCK_KB_FOLDERS: [
      {id:'f-001',name:'민원사무편람',parent:null,docs:245,perm:'all',owner:'민원여권과'},
      {id:'f-011',name:'여권·증명 발급',parent:'f-001',docs:120,perm:'dept',owner:'민원여권과'},
      {id:'f-012',name:'인허가 민원',parent:'f-001',docs:125,perm:'dept',owner:'민원여권과'},
      {id:'f-002',name:'자치법규',parent:null,docs:180,perm:'dept',owner:'자치행정과'},
      {id:'f-021',name:'개정 이력',parent:'f-002',docs:80,perm:'dept',owner:'자치행정과'},
      {id:'f-003',name:'복무·인사규정',parent:null,docs:120,perm:'all',owner:'자치행정과'},
      {id:'f-004',name:'계약·회계',parent:null,docs:95,perm:'specific',owner:'기획예산과'},
      {id:'f-005',name:'교육자료',parent:null,docs:310,perm:'all',owner:'자치행정과'},
    ],
    MOCK_KB_DOCS: {
      'f-001':[
        {id:'d-001',name:'민원사무편람_2026.pdf',size:'4.2MB',pii:false,status:'완료',chunks:312,uploaded:'2026-02-12',uploader:'김도윤'},
        {id:'d-002',name:'여권발급업무지침.pdf',size:'8.1MB',pii:false,status:'완료',chunks:580,uploaded:'2026-02-10',uploader:'김도윤'},
        {id:'d-003',name:'민원창구_점검체크리스트.xlsx',size:'1.2MB',pii:true,status:'완료',chunks:85,uploaded:'2026-02-08',uploader:'이서연'},
      ],
      'f-002':[
        {id:'d-011',name:'한성시_자치법규집_2026.pdf',size:'12.3MB',pii:false,status:'완료',chunks:820,uploaded:'2026-02-10',uploader:'윤지우'},
        {id:'d-012',name:'2025_조례개정이력.xlsx',size:'2.8MB',pii:true,status:'처리중',chunks:190,uploaded:'2026-02-11',uploader:'윤지우'},
      ],
      'f-003':[
        {id:'d-021',name:'한성시_복무규정_2026_개정안.pdf',size:'2.4MB',pii:true,status:'완료',chunks:145,uploaded:'2026-02-14',uploader:'윤지우'},
        {id:'d-022',name:'맞춤형복지제도안내.pdf',size:'1.8MB',pii:false,status:'완료',chunks:98,uploaded:'2026-01-20',uploader:'서지혜'},
      ],
      'f-004':[{id:'d-031',name:'표준계약서_2026.docx',size:'580KB',pii:false,status:'완료',chunks:62,uploaded:'2026-02-05',uploader:'홍은지'}],
      'f-005':[
        {id:'d-041',name:'신규임용자교육과정.pptx',size:'22.5MB',pii:false,status:'완료',chunks:410,uploaded:'2026-02-01',uploader:'윤지우'},
        {id:'d-042',name:'안전교육_2026_1분기.pdf',size:'5.8MB',pii:false,status:'완료',chunks:270,uploaded:'2026-02-11',uploader:'조현우'},
      ],
    },
    MOCK_BATCH_JOBS: [
      {id:'bj-001',src:'온나라',target:'민원사무편람',schedule:'매일 02:00',lastRun:'2026-02-25 02:00',lastResult:'성공',addedDocs:3,updatedDocs:1,deletedDocs:0,enabled:true},
      {id:'bj-002',src:'인사랑(표준인사)',target:'복무·인사규정',schedule:'매주 월 03:00',lastRun:'2026-02-24 03:00',lastResult:'성공',addedDocs:0,updatedDocs:2,deletedDocs:0,enabled:true},
      {id:'bj-003',src:'e호조(재정)',target:'계약·회계',schedule:'실시간 동기화',lastRun:'2026-02-25 09:15',lastResult:'성공',addedDocs:1,updatedDocs:0,deletedDocs:0,enabled:true},
      {id:'bj-004',src:'온나라',target:'교육자료',schedule:'매일 04:00',lastRun:'2026-02-24 04:00',lastResult:'실패',addedDocs:0,updatedDocs:0,deletedDocs:0,enabled:false},
    ],
    MOCK_SYNC_LOGS: [
      {id:1,time:'2026-02-25 09:15:22',src:'e호조(재정)',folder:'계약·회계',file:'수의계약서_수정본.docx',action:'추가',pii:false,status:'완료'},
      {id:2,time:'2026-02-25 02:00:45',src:'온나라',folder:'민원사무편람',file:'민원응대교육자료_2월.pdf',action:'추가',pii:false,status:'완료'},
      {id:3,time:'2026-02-25 02:00:43',src:'온나라',folder:'민원사무편람',file:'창구점검일지_2월.xlsx',action:'업데이트',pii:true,status:'완료(마스킹)'},
      {id:4,time:'2026-02-24 03:01:12',src:'인사랑(표준인사)',folder:'복무·인사규정',file:'수당기준표_개정.xlsx',action:'업데이트',pii:true,status:'완료(마스킹)'},
      {id:5,time:'2026-02-23 04:00:33',src:'온나라',folder:'교육자료',file:'신규임용교육자료_2월.pptx',action:'추가',pii:false,status:'실패'},
    ],

    MOCK_USAGE_STATS: {
      daily:[
        {date:'02-08',queries:1240,users:85},{date:'02-09',queries:980,users:72},{date:'02-10',queries:1560,users:102},
        {date:'02-11',queries:1890,users:115},{date:'02-12',queries:2100,users:128},{date:'02-13',queries:1780,users:110},{date:'02-14',queries:920,users:68}
      ],
      byDept:[{dept:'민원여권과',queries:3200,pct:28},{dept:'자치행정과',queries:2400,pct:21},{dept:'기획예산과',queries:1800,pct:16},{dept:'안전총괄과',queries:1500,pct:13},{dept:'복지정책과',queries:1200,pct:10},{dept:'기타',queries:1370,pct:12}],
      byModel:[{model:'GPT-OSS-120B',queries:5200,pct:45},{model:'Llama-3-Kor',queries:3100,pct:27},{model:'EXAONE-3.0',queries:2800,pct:24},{model:'기타',queries:370,pct:4}],
      topKeywords:['민원사무편람','처리기한 연장','여권 발급','복무규정','수의계약','교육자료','재난 대응','옥외광고 허가','맞춤형 복지','출장 여비'],
    },

    MOCK_USAGE_HISTORY: [
      {id:'uh-001',user:'강수진',dept:'정보통신과',mode:'GENERAL',query:'민원 처리기한 연장 절차가 어떻게 되나요?',answer:'민원 처리에 관한 조례 제12조에 따르면, 처리기한 연장은 부득이한 사유가 있는 경우 1회에 한하여 7 근무일의 범위에서 가능하며, 연장 사유와 완료 예정일을 새올행정시스템에 등록하고 민원인에게 통지하여야...',time:'2026-02-25 14:30',tokens:284,rating:5,errReport:false},
      {id:'uh-002',user:'이서연',dept:'민원여권과',mode:'REVIEW',query:'업로드한 출장 기안문을 복무규정과 대조해서 절차 하자 검토해줘',answer:'복무규정 대조 결과: 지출 수반 사항은 과장 전결 불가 — 국장 결재 필요(위임전결 규정 제9조 별표 1), 개인정보 수집·이용 동의서 누락...',time:'2026-02-25 13:20',tokens:412,rating:4,errReport:false},
      {id:'uh-003',user:'윤지우',dept:'자치행정과',mode:'TRANSLATE',query:'업로드한 영문 외국인 민원 안내문을 한국어로 번역해줘',answer:'외국인 주민 전입신고 안내 — 체류지를 변경한 외국인 주민은 14일 이내에 시청 1층 민원여권과에서 전입신고를 하여야 하며, 외국인등록증과 주거 계약서 사본이 필요...',time:'2026-02-25 11:05',tokens:556,rating:5,errReport:false},
      {id:'uh-004',user:'조현우',dept:'안전총괄과',mode:'GENERAL',query:'비상시 대피 경로',answer:'청사 건물의 비상 대피 경로는...',time:'2026-02-24 16:42',tokens:185,rating:2,errReport:true,errDetail:'층별 대피도 누락, 환각 의심'},
      {id:'uh-005',user:'홍은지',dept:'기획예산과',mode:'REVIEW',query:'수의계약 한도액 기준 확인',answer:'수의계약은 추정가격이 2천만원 이하인 경우...',time:'2026-02-24 15:30',tokens:320,rating:3,errReport:false},
      {id:'uh-006',user:'김도윤',dept:'민원여권과',mode:'REPORT',query:'이번 주 여권 발급 412건 완료, 처리기한 연장 통지 3건 처리 완료를 주간 실적 보고서로 작성해줘',answer:'민원여권과 주간 업무 실적 보고 | 보고 기간: 2026.02.17~02.21...',time:'2026-02-24 14:15',tokens:680,rating:5,errReport:false},
    ],
    MOCK_SATISFACTION_DATA: {
      avg:4.2, total:342,
      dist:[{stars:5,count:178,pct:52},{stars:4,count:95,pct:28},{stars:3,count:41,pct:12},{stars:2,count:18,pct:5},{stars:1,count:10,pct:3}],
      recent:[
        {id:1,user:'이서연',dept:'민원여권과',stars:4,comment:'공문 검토 결과가 매우 정확했습니다. 더 빠른 응답 속도가 필요합니다.',date:'2026-02-25'},
        {id:2,user:'윤지우',dept:'자치행정과',stars:5,comment:'번역 품질이 훌륭합니다. 행정 문체도 잘 반영됩니다.',date:'2026-02-25'},
        {id:3,user:'조현우',dept:'안전총괄과',stars:2,comment:'비상 대피 경로 답변이 부정확했습니다. 개선 필요.',date:'2026-02-24'},
        {id:4,user:'김도윤',dept:'민원여권과',stars:5,comment:'보고서 자동 작성 기능이 업무 효율을 크게 높여주었습니다.',date:'2026-02-24'},
        {id:5,user:'홍은지',dept:'기획예산과',stars:3,comment:'계약 관련 법령 DB가 더 최신화되면 좋겠습니다.',date:'2026-02-23'},
      ]
    },

    MOCK_DATA_SOURCES_INT: [
      {id:'ds-i01',name:'온나라 문서관리',protocol:'REST API',target:'민원사무편람/교육자료',schedule:'매일 02:00',lastSync:'2026-02-25 02:01',status:'정상',docCount:555,newToday:5},
      {id:'ds-i02',name:'인사랑 (지방인사정보시스템)',protocol:'DB Direct',target:'복무·인사규정',schedule:'매주 월 03:00',lastSync:'2026-02-24 03:02',status:'정상',docCount:120,newToday:0},
      {id:'ds-i03',name:'e호조 (지방재정관리시스템)',protocol:'WebDAV',target:'계약·회계',schedule:'실시간 동기화',lastSync:'2026-02-25 09:15',status:'정상',docCount:95,newToday:1},
      {id:'ds-i04',name:'새올행정시스템',protocol:'REST API',target:'민원사무편람',schedule:'매일 01:00',lastSync:'2026-02-25 01:03',status:'경고',docCount:280,newToday:0},
    ],
    MOCK_DATA_SOURCES_EXT: [
      {id:'ds-e01',name:'법령정보센터 (법제처)',method:'Open API',url:'https://www.law.go.kr/DRF/lawService',target:'자치법규',schedule:'매주 화 05:00',lastSync:'2026-02-25 05:00',status:'정상',docCount:1240,newToday:3},
      {id:'ds-e02',name:'나라장터 (조달청)',method:'Open API',url:'https://openapi.g2b.go.kr/',target:'계약·회계',schedule:'매일 06:00',lastSync:'2026-02-25 06:01',status:'정상',docCount:320,newToday:12},
      {id:'ds-e03',name:'자치법규정보시스템 (ELIS)',method:'크롤링',url:'https://www.elis.go.kr/',target:'자치법규',schedule:'매주 수 04:00',lastSync:'2026-02-19 04:00',status:'정상',docCount:88,newToday:0},
      {id:'ds-e04',name:'행정안전부 민원제도 고시',method:'크롤링',url:'https://www.mois.go.kr/',target:'민원사무편람',schedule:'매주 목 04:00',lastSync:'2026-02-20 04:00',status:'오류',docCount:42,newToday:0},
    ],
    MOCK_DOC_PIPELINE: [
      {id:'dp-001',name:'민원사무편람_2026.pdf',folder:'민원사무편람',src:'온나라',type:'PDF',size:'4.2MB',ingest:'2026-02-25 02:01',parseStatus:'완료',chunkStatus:'완료',embedStatus:'완료',chunks:312,tokens:48200,pii:false,version:3,changeType:'업데이트'},
      {id:'dp-002',name:'민원응대교육자료_2월.pdf',folder:'민원사무편람',src:'온나라',type:'PDF',size:'8.1MB',ingest:'2026-02-25 02:00',parseStatus:'완료',chunkStatus:'완료',embedStatus:'완료',chunks:580,tokens:91000,pii:false,version:1,changeType:'신규'},
      {id:'dp-003',name:'수당기준표_개정.xlsx',folder:'복무·인사규정',src:'인사랑',type:'XLSX',size:'1.8MB',ingest:'2026-02-24 03:01',parseStatus:'완료',chunkStatus:'완료',embedStatus:'완료',chunks:145,tokens:18500,pii:true,version:5,changeType:'업데이트'},
      {id:'dp-004',name:'수의계약서_수정본.docx',folder:'계약·회계',src:'e호조',type:'DOCX',size:'580KB',ingest:'2026-02-25 09:15',parseStatus:'완료',chunkStatus:'완료',embedStatus:'처리중',chunks:62,tokens:9800,pii:false,version:2,changeType:'업데이트'},
      {id:'dp-005',name:'신규임용교육자료_2월.pptx',folder:'교육자료',src:'온나라',type:'PPTX',size:'22.5MB',ingest:'2026-02-23 04:00',parseStatus:'완료',chunkStatus:'실패',embedStatus:'대기',chunks:0,tokens:0,pii:false,version:1,changeType:'신규'},
      {id:'dp-006',name:'민원처리법_시행령_개정.pdf',folder:'자치법규',src:'법령정보센터',type:'PDF',size:'3.2MB',ingest:'2026-02-25 05:00',parseStatus:'완료',chunkStatus:'완료',embedStatus:'완료',chunks:210,tokens:33500,pii:false,version:1,changeType:'신규'},
      {id:'dp-007',name:'나라장터_입찰공고_0225.json',folder:'계약·회계',src:'조달청',type:'JSON',size:'1.1MB',ingest:'2026-02-25 06:01',parseStatus:'완료',chunkStatus:'완료',embedStatus:'완료',chunks:28,tokens:4200,pii:false,version:1,changeType:'신규'},
    ],
    MOCK_CHUNK_QUALITY: [
      {docId:'d-001',name:'민원사무편람_2026.pdf',folder:'민원사무편람',avgLen:154,specialCharPct:1.2,dupPct:0.8,semanticScore:94,status:'양호'},
      {docId:'d-002',name:'여권발급업무지침.pdf',folder:'민원사무편람',avgLen:168,specialCharPct:2.1,dupPct:1.5,semanticScore:91,status:'양호'},
      {docId:'d-011',name:'한성시_자치법규집_2026.pdf',folder:'자치법규',avgLen:142,specialCharPct:4.5,dupPct:3.2,semanticScore:78,status:'주의'},
      {docId:'d-021',name:'한성시_복무규정_2026_개정안.pdf',folder:'복무·인사규정',avgLen:201,specialCharPct:0.8,dupPct:0.4,semanticScore:96,status:'양호'},
      {docId:'d-041',name:'신규임용자교육과정.pptx',folder:'교육자료',avgLen:88,specialCharPct:8.2,dupPct:6.5,semanticScore:58,status:'경고'},
      {docId:'e-006',name:'민원처리법_시행령_개정.pdf',folder:'자치법규',avgLen:178,specialCharPct:1.9,dupPct:0.9,semanticScore:92,status:'양호'},
    ],
    MOCK_CHUNK_PREVIEW: [
      {idx:1,text:'제1조(목적) 이 조례는 민원 처리에 관한 법률 및 같은 법 시행령에서 위임된 사항과 그 시행에 필요한 사항을 규정하여 민원 처리의 공정성과 신속성을 확보함을 목적으로 한다.',len:142,score:96},
      {idx:2,text:'제2조(적용범위) 이 조례는 한성시 및 소속 행정기관에 접수되는 모든 민원 사무와 그 처리를 담당하는 소속 공무원에게 적용한다.',len:88,score:93},
      {idx:3,text:'제3조(정의) ① "일반민원"이란 법정민원·고충민원 외의 민원을 말한다. ② "처리기한"이란 민원을 접수한 날부터 처리 결과를 민원인에게 통지하기까지의 기간을 말한다.',len:165,score:97},
    ],
    MOCK_REPROCESS_QUEUE: [
      {id:'rq-001',doc:'신규임용교육자료_2월.pptx',folder:'교육자료',src:'온나라',stage:'청킹',error:'PPTX 이미지 슬라이드 파싱 오류 (PIL 디코딩 실패)',failedAt:'2026-02-23 04:00',retryCount:2,status:'대기중',priority:'높음'},
      {id:'rq-002',doc:'행정안전부_민원제도고시.pdf',folder:'민원사무편람',src:'크롤링',stage:'임베딩',error:'임베딩 서버 응답 타임아웃 (>30s)',failedAt:'2026-02-20 04:15',retryCount:1,status:'대기중',priority:'보통'},
      {id:'rq-003',doc:'창구점검일지_1월.xlsx',folder:'민원사무편람',src:'온나라',stage:'파싱',error:'암호화된 XLSX 파일 — 비밀번호 해제 필요',failedAt:'2026-02-18 02:05',retryCount:3,status:'수동처리필요',priority:'높음'},
      {id:'rq-004',doc:'재난대응매뉴얼_v3.pdf',folder:'재난·안전 대응',src:'온나라',stage:'임베딩',error:'토큰 수 초과 (한도 32,768 — 실제 41,200토큰)',failedAt:'2026-02-22 09:30',retryCount:0,status:'대기중',priority:'보통'},
    ],

    MOCK_SERVICE_STATS: {
      summary:{users:842,newToday:12,conversations:15240,apiCalls:48920,linkCalls:3280,feedbacks:342},
      daily:[
        {date:'02-19',users:98,conv:1840,api:5820},{date:'02-20',users:115,conv:2100,api:6230},
        {date:'02-21',users:102,conv:1980,api:5940},{date:'02-22',users:45,conv:890,api:2810},
        {date:'02-23',users:32,conv:620,api:1980},{date:'02-24',users:128,conv:2380,api:7100},{date:'02-25',users:134,conv:2460,api:7280},
      ],
      keywords:[
        {word:'민원사무편람',cnt:1240},{word:'처리기한 연장',cnt:980},{word:'여권 발급',cnt:820},{word:'복무규정',cnt:750},
        {word:'수의계약',cnt:680},{word:'교육자료',cnt:540},{word:'재난 대응',cnt:490},{word:'옥외광고 허가',cnt:420},
        {word:'정보공개 청구',cnt:380},{word:'맞춤형 복지',cnt:320},{word:'출장 여비',cnt:280},{word:'보고서 작성',cnt:240},
      ],
      topics:[
        {topic:'민원·인허가',pct:38,c:'bg-red-400'},{topic:'시정·예산',pct:25,c:'bg-blue-400'},
        {topic:'복무·인사',pct:16,c:'bg-green-400'},{topic:'계약·회계',pct:11,c:'bg-purple-400'},{topic:'교육·훈련',pct:10,c:'bg-yellow-400'},
      ],
      apiByEndpoint:[
        {ep:'/api/v1/chat',calls:28420,pct:58},{ep:'/api/v1/rag/search',calls:12880,pct:26},
        {ep:'/api/v1/embed',calls:4820,pct:10},{ep:'/api/v1/agent/run',calls:1940,pct:4},{ep:'기타',calls:860,pct:2},
      ],
      peakHours:[0,0,0,0,0,2,8,42,112,168,145,98,120,145,160,182,195,188,142,95,68,42,18,5],
    },
    MOCK_NOTICES_MGMT: [
      {id:'N-001',title:'[필독] 2026년 1분기 행정망 보안 업데이트 공지',type:'공지',author:'노태건',date:'2026-02-25',views:248,pinned:true,active:true},
      {id:'N-002',title:'GPT-OSS-120B 모델 업그레이드 안내',type:'업데이트',author:'강수진',date:'2026-02-22',views:182,pinned:false,active:true},
      {id:'N-003',title:'3월 정기 점검 (2026.03.08 02:00~06:00)',type:'점검',author:'노태건',date:'2026-02-20',views:124,pinned:false,active:true},
      {id:'N-004',title:'AI 플랫폼 사용 매뉴얼 v2.1 배포',type:'매뉴얼',author:'강수진',date:'2026-02-15',views:340,pinned:false,active:true},
    ],
    MOCK_QNA_MGMT: [
      {id:'Q-001',title:'번역 기능에서 한→중 번역이 안됩니다',user:'서지혜',dept:'복지정책과',date:'2026-02-25',status:'답변완료',answer:'현재 한→중 번역은 베타 기능으로 일부 문장 유형에서 오류가 발생할 수 있습니다. v2.1 패치에서 개선될 예정입니다.'},
      {id:'Q-002',title:'에이전트가 새올 민원 데이터에 접근하지 못하는 경우',user:'이서연',dept:'민원여권과',date:'2026-02-24',status:'처리중',answer:''},
      {id:'Q-003',title:'RAG 검색 시 유사도 점수 기준이 어떻게 되나요?',user:'윤지우',dept:'자치행정과',date:'2026-02-23',status:'답변완료',answer:'현재 코사인 유사도 0.75 이상인 문서가 검색 결과에 포함됩니다. 관리자 설정에서 임계값 조정이 가능합니다.'},
      {id:'Q-004',title:'보고서 자동 생성 길이 제한 변경 가능한가요?',user:'홍은지',dept:'기획예산과',date:'2026-02-21',status:'대기',answer:''},
    ],
    MOCK_IP_BLOCKS: [
      {id:'ib-001',target:'192.168.100.45',type:'IP',reason:'비정상 반복 접속 (10분간 500회)',action:'차단',appliedBy:'노태건',date:'2026-02-24',status:'활성'},
      {id:'ib-002',target:'10.20.30.99',type:'IP',reason:'권한 외 지식영역 접근 시도',action:'차단',appliedBy:'노태건',date:'2026-02-22',status:'활성'},
      {id:'ib-003',target:'USR-EXT-012',type:'ID',reason:'퇴직 처리 미완료 계정',action:'차단',appliedBy:'강수진',date:'2026-02-20',status:'활성'},
      {id:'ib-004',target:'192.168.200.0/24',type:'대역',reason:'위탁업체 외부망 허용 대역',action:'허용',appliedBy:'노태건',date:'2026-02-10',status:'활성'},
    ],
    MOCK_WORK_LOG: [
      {id:1,time:'2026-02-25 14:35',user:'강수진',dept:'정보통신과',ip:'10.20.30.41',action:'문서 업로드',target:'민원사무편람_2026.pdf',detail:'민원사무편람 폴더 업로드 (4.2MB)'},
      {id:2,time:'2026-02-25 14:20',user:'노태건',dept:'정보통신과',ip:'10.20.30.10',action:'설정 변경',target:'GPT-OSS-120B',detail:'Temperature 0.3→0.2 변경'},
      {id:3,time:'2026-02-25 13:55',user:'이서연',dept:'민원여권과',ip:'10.20.30.55',action:'에이전트 호출',target:'민원분류봇',detail:'민원 자동 분류 질의 (응답 2.1s)'},
      {id:4,time:'2026-02-25 11:30',user:'홍은지',dept:'기획예산과',ip:'10.20.30.78',action:'데이터 추출',target:'이용통계_0225.xlsx',detail:'통계 엑셀 다운로드 (48KB)'},
      {id:5,time:'2026-02-25 10:12',user:'윤지우',dept:'자치행정과',ip:'10.20.30.62',action:'지식영역 접근',target:'자치법규 DB',detail:'처리기한 관련 5건 검색'},
    ],
    MOCK_EXTRACT_LOG: [
      {id:1,time:'2026-02-25 11:30',user:'홍은지',dept:'기획예산과',type:'통계 엑셀',file:'이용통계_0225.xlsx',size:'48KB',rows:340},
      {id:2,time:'2026-02-24 16:45',user:'강수진',dept:'정보통신과',type:'로그 CSV',file:'접속로그_0224.csv',size:'1.2MB',rows:5820},
      {id:3,time:'2026-02-23 14:20',user:'노태건',dept:'정보통신과',type:'보고서 PDF',file:'월간리포트_202601.pdf',size:'3.4MB',rows:null},
      {id:4,time:'2026-02-22 10:05',user:'이서연',dept:'민원여권과',type:'질의이력 CSV',file:'질의이력_이서연_0222.csv',size:'89KB',rows:248},
    ],
    MOCK_USAGE_BY_DEPT: [
      {dept:'민원여권과',users:8,queries:3240,avgLen:245,tokens:812000,peakHour:'14:00',abuseSuspect:false},
      {dept:'자치행정과',users:15,queries:2880,avgLen:198,tokens:621000,peakHour:'10:00',abuseSuspect:false},
      {dept:'기획예산과',users:12,queries:2240,avgLen:185,tokens:452000,peakHour:'09:00',abuseSuspect:false},
      {dept:'안전총괄과',users:10,queries:1820,avgLen:142,tokens:284000,peakHour:'14:00',abuseSuspect:false},
      {dept:'복지정책과',users:6,queries:1480,avgLen:312,tokens:502000,peakHour:'11:00',abuseSuspect:false},
      {dept:'정보통신과',users:11,queries:1240,avgLen:168,tokens:228000,peakHour:'15:00',abuseSuspect:false},
    ],
    // 승격: REB 기본값의 user·지식영역명이 REB 팩 인물·폴더 — 한성시 어휘로 교체
    MOCK_ABUSE_ALERTS: [
      {id:'ab-001',user:'미확인',ip:'192.168.100.45',type:'반복 접속',detail:'10분간 500회 API 호출 (정상범위 100회/10분)',detected:'2026-02-25 11:18',status:'차단됨',severity:'위험'},
      {id:'ab-002',user:'USR-EXT-012',ip:'10.20.100.8',type:'권한 외 접근',detail:'계약·회계 지식영역 무단 접근 시도 12회',detected:'2026-02-24 15:30',status:'경고발송',severity:'주의'},
      {id:'ab-003',user:'서지혜',ip:'10.20.30.75',type:'대량 추출',detail:'1시간 내 엑셀 추출 8회 (일 평균 0.3회)',detected:'2026-02-23 14:40',status:'모니터링',severity:'정보'},
    ],
    MOCK_API_APPROVALS: [
      {id:'apr-001',requester:'이서연',dept:'민원여권과',api:'에이전트 실행 API',purpose:'민원 자동 분류 파이프라인 연동',requestDate:'2026-02-24',status:'대기'},
      {id:'apr-002',requester:'조현우',dept:'안전총괄과',api:'RAG 검색 API',purpose:'행사 안전계획 검토 자동화 연동',requestDate:'2026-02-22',status:'대기'},
      {id:'apr-003',requester:'윤지우',dept:'자치행정과',api:'임베딩 API',purpose:'교육자료 유사도 검색 시스템',requestDate:'2026-02-20',status:'승인'},
    ],
    MOCK_PROMPTS_MGMT: [
      {id:'pt-001',name:'민원사무편람 Q&A 시스템 프롬프트',mode:'GENERAL',version:'v2.1',tokens:342,lastUpdated:'2026-02-20',active:true,desc:'민원 처리 절차 전문 답변 프롬프트. 출처 인용 필수, 환각 방지 지시 포함.'},
      {id:'pt-002',name:'공문 사전 검토 평가 프롬프트',mode:'REVIEW',version:'v1.4',tokens:518,lastUpdated:'2026-02-18',active:true,desc:'자치법규 대조 공문 검토용. 절차 하자 항목을 조항 단위로 발췌하도록 지시.'},
      {id:'pt-003',name:'번역·요약 지시 프롬프트',mode:'TRANSLATE',version:'v1.0',tokens:285,lastUpdated:'2026-02-10',active:true,desc:'한/영/중/일 다국어 민원 번역 및 요약 길이 제어 지시.'},
      {id:'pt-004',name:'보고서 생성 프롬프트',mode:'REPORT',version:'v2.0',tokens:624,lastUpdated:'2026-02-15',active:true,desc:'공문서 형식 기반 주간/월간/시정 현안 보고서 자동 생성.'},
    ],
    MOCK_HR_SYNC: {
      lastSync:'2026-02-25 01:00:12',nextSync:'2026-02-26 01:00:00',status:'정상',
      summary:{total:842,new:3,retired:1,moved:5,concurrent:2,leave:4},
      recent:[
        {id:'hr-001',name:'문가영',type:'신규입사',dept:'민원여권과',syncDate:'2026-02-25',action:'계정 생성'},
        {id:'hr-002',name:'박세훈',type:'신규입사',dept:'자치행정과',syncDate:'2026-02-25',action:'계정 생성'},
        {id:'hr-003',name:'장현식',type:'퇴직',dept:'정보통신과',syncDate:'2026-02-25',action:'계정 비활성화'},
        {id:'hr-004',name:'이도현',type:'부서이동',dept:'민원여권과 → 자치행정과',syncDate:'2026-02-24',action:'부서 정보 업데이트'},
        {id:'hr-005',name:'김나윤',type:'겸직',dept:'기획예산과 + 자치행정과',syncDate:'2026-02-24',action:'그룹 추가'},
        {id:'hr-006',name:'최현우',type:'부재설정',dept:'민원여권과',syncDate:'2026-02-23',action:'임시 계정 잠금 (육아휴직)'},
      ],
    },
    MOCK_ACCESS_LOGS: [
      {id:1,time:'2026-02-14 09:10:23',user:'강수진',dept:'정보통신과',action:'로그인',ip:'10.20.30.41',detail:'SSO 인증 성공'},
      {id:2,time:'2026-02-14 09:08:15',user:'이서연',dept:'민원여권과',action:'에이전트 호출',ip:'10.20.30.55',detail:'민원 분류 어시스턴트 질의'},
      {id:3,time:'2026-02-14 08:55:02',user:'노태건',dept:'정보통신과',action:'모델 설정 변경',ip:'10.20.30.10',detail:'GPT-OSS-120B Temperature 0.3→0.2'},
      {id:4,time:'2026-02-14 08:45:33',user:'윤지우',dept:'자치행정과',action:'문서 업로드',ip:'10.20.30.78',detail:'한성시_복무규정_2026_개정안.pdf (2.4MB)'},
      {id:5,time:'2026-02-14 08:30:11',user:'김도윤',dept:'민원여권과',action:'에이전트 호출',ip:'10.20.30.62',detail:'민원 대응 가이드 질의'},
      {id:6,time:'2026-02-14 08:20:45',user:'홍은지',dept:'기획예산과',action:'에이전트 호출',ip:'10.20.30.90',detail:'계약서 검토 에이전트 질의'},
      {id:7,time:'2026-02-13 17:55:10',user:'서지혜',dept:'복지정책과',action:'보고서 생성',ip:'10.20.30.44',detail:'복지 급여 상담 현황 리포트'},
      {id:8,time:'2026-02-13 17:30:22',user:'조현우',dept:'안전총괄과',action:'로그아웃',ip:'10.20.30.33',detail:'세션 종료'},
    ],
    MOCK_QUALITY_REVIEWS: [
      {id:'QR-001',query:'민원 처리기한 연장 횟수는?',answer:'민원 처리에 관한 조례 제12조에 따라 1회에 한하여 7 근무일의 범위에서...',agent:'자치법규 검색 에이전트',reviewer:'윤지우',rating:'good',confidence:0.92,date:'2026-02-13',feedback:'정확한 조례 인용'},
      {id:'QR-002',query:'연가 일수 계산 방법 알려줘',answer:'지방공무원 복무규정에 따라 재직기간별 연가 일수는...',agent:'복무규정 질의응답 봇',reviewer:'서지혜',rating:'edit',confidence:0.78,date:'2026-02-12',feedback:'시 내부 지침 추가 필요'},
      {id:'QR-003',query:'옥외광고물 허가 수수료 산정 기준',answer:'표시면적 5제곱미터 이하 30,000원이며, 초과 시 1제곱미터당 5,000원을 가산하여...',agent:'민원 분류 어시스턴트',reviewer:'이서연',rating:'good',confidence:0.95,date:'2026-02-11',feedback:''},
      {id:'QR-004',query:'비상시 대피 경로',answer:'청사 건물의 비상 대피 경로는...',agent:'민원 대응 가이드',reviewer:'조현우',rating:'bad',confidence:0.55,date:'2026-02-10',feedback:'층별 대피도 누락, 할루시네이션 의심'},
      {id:'QR-005',query:'수의계약 한도액 기준',answer:'수의계약은 추정가격이 2천만원 이하인 경우...',agent:'계약서 검토 에이전트',reviewer:'홍은지',rating:'edit',confidence:0.82,date:'2026-02-09',feedback:'시 회계 예규 한도액 기준 상이'},
    ],
    MOCK_ANNOUNCEMENTS: [
      {id:1,title:'한성시 스마트행정 AI 플랫폼 정식 오픈 안내',category:'공지',status:'Running',startDate:'2026-02-01',endDate:'2026-03-01',author:'노태건',views:452},
      {id:2,title:'시스템 정기 점검 안내 (2/15 02:00~06:00)',category:'점검',status:'Running',startDate:'2026-02-13',endDate:'2026-02-15',author:'노태건',views:128},
      {id:3,title:'신규 모델 Solar-10.7B 서비스 추가',category:'업데이트',status:'Running',startDate:'2026-02-10',endDate:'2026-02-28',author:'강수진',views:89},
      {id:4,title:'개인 지식영역 기능 출시',category:'업데이트',status:'Stopped',startDate:'2026-01-15',endDate:'2026-02-01',author:'강수진',views:310},
    ],
    // 승격: REB 기본값 endpoint에 REB 사내망 도메인 잔존 — 행정망 도메인으로 교체
    MOCK_LINKED_SW: [
      {name:'Milvus Vector DB',version:'2.4.1',status:'Running',endpoint:'milvus.hsc.internal:19530',cpu:12.5,memory:28.4,uptime:'30d 4h'},
      {name:'OCR Engine (Tesseract)',version:'5.3.3',status:'Running',endpoint:'ocr.hsc.internal:8090',cpu:5.2,memory:8.1,uptime:'30d 4h'},
      {name:'vLLM Serving',version:'0.4.2',status:'Running',endpoint:'vllm.hsc.internal:8000',cpu:45.0,memory:62.3,uptime:'14d 2h'},
      {name:'Redis Cache',version:'7.2.4',status:'Running',endpoint:'redis.hsc.internal:6379',cpu:2.1,memory:15.6,uptime:'30d 4h'},
      {name:'MinIO Object Storage',version:'2024.02',status:'Warning',endpoint:'minio.hsc.internal:9000',cpu:8.3,memory:12.0,uptime:'30d 4h'},
      {name:'Agent Runtime',version:'1.2.0',status:'Running',endpoint:'agent.hsc.internal:5000',cpu:18.7,memory:24.5,uptime:'7d 11h'},
    ],

    MOCK_AGENTS: [
      {id:'AGT-001',name:'자치법규 검색 에이전트',desc:'한성시 조례·규칙·훈령·예규를 기반으로 질의응답을 수행합니다.',model:'GPT-OSS-120B',tools:['자치법규 벡터 DB','웹 검색'],mcpTools:['MCP-Search','MCP-WebCrawler'],ragEnabled:true,hitl:false,a2a:false,responseMode:'knowledge',actionable:false,status:'Running',version:'v2.1',creator:'윤지우',dept:'자치행정과',created:'2026-01-15',updated:'2026-02-08',requests24h:342,avgLatency:'1.2s',successRate:98.5,confidence:0.92,systemPrompt:'당신은 한성시청의 자치법규 전문가입니다. 조례·규칙을 정확히 참조하여 답변하세요.',temperature:0.3,maxTokens:2048},
      {id:'AGT-002',name:'민원 분류 어시스턴트',desc:'접수 민원을 유형·소관 부서별로 자동 분류하고 처리 절차를 안내합니다. 새올 연동으로 실시간 분석.',model:'Llama-3-Kor-Instruct',tools:['민원 이력 DB','새올 민원 조회 API'],mcpTools:['MCP-Saeol','MCP-SearchFilter'],ragEnabled:true,hitl:true,a2a:true,responseMode:'knowledge',actionable:false,status:'Running',version:'v1.8',creator:'이서연',dept:'민원여권과',created:'2026-01-20',updated:'2026-02-10',requests24h:189,avgLatency:'0.8s',successRate:97.2,confidence:0.88,systemPrompt:'민원 분류 전문 도우미입니다. 민원 이력과 새올 데이터를 참조하여 소관 부서와 처리 절차를 안내하세요.',temperature:0.2,maxTokens:4096},
      {id:'AGT-003',name:'복무규정 질의응답 봇',desc:'복무/맞춤형 복지/수당 관련 직원 문의에 자동 응답합니다.',model:'EXAONE-3.0-7.8B',tools:['복무규정 벡터 DB'],mcpTools:['MCP-Search'],ragEnabled:true,hitl:false,a2a:false,responseMode:'knowledge',actionable:false,status:'Running',version:'v1.3',creator:'윤지우',dept:'자치행정과',created:'2025-12-05',updated:'2026-02-03',requests24h:567,avgLatency:'0.5s',successRate:95.8,confidence:0.85,systemPrompt:'한성시청 복무규정 전문 도우미입니다. 정확한 조항을 인용하여 답변하세요.',temperature:0.4,maxTokens:1024},
      {id:'AGT-004',name:'계약서 검토 에이전트',desc:'계약서 초안을 검토하고 위험 조항을 식별합니다.',model:'GPT-OSS-120B',tools:['회계 예규 DB','계약 서식 DB'],mcpTools:['MCP-Search','MCP-DynamicFilter'],ragEnabled:true,hitl:true,a2a:false,responseMode:'knowledge',actionable:false,status:'Running',version:'v1.0',creator:'홍은지',dept:'기획예산과',created:'2026-02-01',updated:'2026-02-09',requests24h:45,avgLatency:'2.1s',successRate:99.1,confidence:0.94,systemPrompt:'계약서 전문 검토 에이전트입니다. 불리한 조항이나 누락된 사항을 식별하세요.',temperature:0.1,maxTokens:4096},
      {id:'AGT-005',name:'현장 점검 보고서 생성기',desc:'인허가 현장 확인·점검 데이터를 기반으로 정형화된 보고서를 자동 생성합니다.',model:'Llama-3-Kor-Instruct',tools:['보고서 서식 DB','점검 이력 DB'],mcpTools:['MCP-CodeDev'],ragEnabled:false,hitl:false,a2a:true,responseMode:'direct',actionable:true,status:'Stopped',version:'v0.9',creator:'조현우',dept:'안전총괄과',created:'2026-01-25',updated:'2026-02-05',requests24h:0,avgLatency:'-',successRate:92.0,confidence:0.76,systemPrompt:'현장 점검 보고서를 작성하는 전문 에이전트입니다.',temperature:0.5,maxTokens:8192},
      {id:'AGT-006',name:'신규 임용자 교육 튜터',desc:'신규 임용자 및 민원 창구 담당자 대상 직무 교육 질의응답을 제공합니다.',model:'EXAONE-3.0-7.8B',tools:['교육 자료 벡터 DB','웹 검색'],mcpTools:['MCP-Search','MCP-WebSearch'],ragEnabled:true,hitl:false,a2a:false,responseMode:'knowledge',actionable:false,status:'Running',version:'v1.5',creator:'윤지우',dept:'자치행정과',created:'2025-11-10',updated:'2026-01-28',requests24h:231,avgLatency:'0.6s',successRate:96.4,confidence:0.87,systemPrompt:'한성시청 직무 교육 튜터입니다. 쉽고 정확하게 설명하세요.',temperature:0.6,maxTokens:2048},
      {id:'AGT-007',name:'민원 대응 가이드',desc:'집단 민원 등 긴급 상황 시 대응 절차를 실시간으로 안내합니다.',model:'GPT-OSS-120B',tools:['민원 매뉴얼 DB','알림 서비스 API'],mcpTools:['MCP-Search','MCP-Saeol'],ragEnabled:true,hitl:true,a2a:true,responseMode:'knowledge',actionable:true,status:'Running',version:'v3.0',creator:'김도윤',dept:'민원여권과',created:'2025-10-01',updated:'2026-02-11',requests24h:12,avgLatency:'0.9s',successRate:99.8,confidence:0.96,systemPrompt:'민원 대응 전문 에이전트입니다. 신속하고 정확한 대응 절차를 안내하세요.',temperature:0.1,maxTokens:2048},
      {id:'AGT-008',name:'지출결의 자동 작성',desc:'업무 지시를 받아 e호조에서 지출결의서를 자동으로 작성합니다.',model:'GPT-OSS-120B',tools:['e호조 연동 API','회계 예규 DB'],mcpTools:['MCP-EhojoConnector','MCP-OnnaraSync'],ragEnabled:false,hitl:true,a2a:true,responseMode:'direct',actionable:true,status:'Running',version:'v1.0',creator:'노태건',dept:'정보통신과',created:'2026-02-05',updated:'2026-02-13',requests24h:78,avgLatency:'3.2s',successRate:96.0,confidence:0.90,systemPrompt:'지출결의서 작성 전문 에이전트입니다. e호조와 연동하여 결의서를 자동 생성합니다.',temperature:0.1,maxTokens:2048},
    ],

    MOCK_AGENT_DEPLOYS: [
      {id:'DEP-001',agentId:'AGT-001',agentName:'자치법규 검색 에이전트',model:'GPT-OSS-120B',version:'v2.1',env:'Production',endpoint:'/api/agent/ordinance-reg',deployDate:'2026-02-08 14:30',deployer:'윤지우',status:'Running',replicas:3,cpu:'2 Core',memory:'8 GB',gpu:'H200 x1',uptime:'5d 12h',requests24h:342,errorRate:1.5},
      {id:'DEP-002',agentId:'AGT-002',agentName:'민원 분류 어시스턴트',model:'Llama-3-Kor-Instruct',version:'v1.8',env:'Production',endpoint:'/api/agent/minwon-classify',deployDate:'2026-02-10 09:15',deployer:'이서연',status:'Running',replicas:2,cpu:'4 Core',memory:'16 GB',gpu:'H200 x1',uptime:'3d 2h',requests24h:189,errorRate:2.8},
      {id:'DEP-003',agentId:'AGT-003',agentName:'복무규정 질의응답 봇',model:'EXAONE-3.0-7.8B',version:'v1.3',env:'Production',endpoint:'/api/agent/duty-qa',deployDate:'2026-02-03 11:00',deployer:'윤지우',status:'Running',replicas:2,cpu:'1 Core',memory:'4 GB',gpu:'-',uptime:'10d 1h',requests24h:567,errorRate:4.2},
      {id:'DEP-004',agentId:'AGT-004',agentName:'계약서 검토 에이전트',model:'GPT-OSS-120B',version:'v1.0',env:'Staging',endpoint:'/api/agent/contract-review',deployDate:'2026-02-09 16:45',deployer:'홍은지',status:'Running',replicas:1,cpu:'2 Core',memory:'8 GB',gpu:'H200 x1',uptime:'4d 5h',requests24h:45,errorRate:0.9},
      {id:'DEP-005',agentId:'AGT-005',agentName:'현장 점검 보고서 생성기',model:'Llama-3-Kor-Instruct',version:'v0.9',env:'Staging',endpoint:'/api/agent/inspection-report',deployDate:'2026-02-05 10:00',deployer:'조현우',status:'Stopped',replicas:0,cpu:'-',memory:'-',gpu:'-',uptime:'-',requests24h:0,errorRate:0},
      {id:'DEP-006',agentId:'AGT-006',agentName:'신규 임용자 교육 튜터',model:'EXAONE-3.0-7.8B',version:'v1.5',env:'Production',endpoint:'/api/agent/edu-tutor',deployDate:'2026-01-28 08:30',deployer:'윤지우',status:'Running',replicas:2,cpu:'1 Core',memory:'4 GB',gpu:'-',uptime:'16d 3h',requests24h:231,errorRate:3.6},
      {id:'DEP-007',agentId:'AGT-007',agentName:'민원 대응 가이드',model:'GPT-OSS-120B',version:'v3.0',env:'Production',endpoint:'/api/agent/civil-response',deployDate:'2026-02-11 00:00',deployer:'김도윤',status:'Running',replicas:4,cpu:'4 Core',memory:'16 GB',gpu:'H200 x2',uptime:'2d 11h',requests24h:12,errorRate:0.2},
      {id:'DEP-008',agentId:'AGT-008',agentName:'지출결의 자동 작성',model:'GPT-OSS-120B',version:'v1.0',env:'Staging',endpoint:'/api/agent/expenditure',deployDate:'2026-02-13 10:30',deployer:'노태건',status:'Running',replicas:2,cpu:'2 Core',memory:'8 GB',gpu:'H200 x1',uptime:'1d 0h',requests24h:78,errorRate:4.0},
    ],

    MOCK_WORKFLOWS: [
      {id:'WF-001',name:'집단 민원 종합 대응',desc:'민원 급증 감지 → 분류 → 보고서 생성 → 알림 발송 (A2A 멀티에이전트)',status:'Running',creator:'이서연',created:'2026-02-01',lastRun:'2026-02-13 09:30',runs24h:8,successRate:95.0,protocol:'A2A',hitl:true,
        steps:[{id:'s1',name:'민원 급증 이상 감지',type:'trigger',agentId:null},{id:'s2',name:'민원 분류 어시스턴트',type:'agent',agentId:'AGT-002'},{id:'s3',name:'HITL 전문가 검토',type:'hitl',agentId:null},{id:'s4',name:'심각도 ≥ 높음',type:'condition',agentId:null},{id:'s5',name:'점검 보고서 생성',type:'agent',agentId:'AGT-005'},{id:'s6',name:'민원 대응 가이드',type:'agent',agentId:'AGT-007'},{id:'s7',name:'MCP 알림 발송',type:'mcp',agentId:null}]},
      {id:'WF-002',name:'신규 임용자 온보딩 자동화',desc:'복무 질의 → 교육 콘텐츠 추천 → 자치법규 안내 (MCP 온나라 연동)',status:'Running',creator:'윤지우',created:'2026-01-20',lastRun:'2026-02-12 15:00',runs24h:15,successRate:98.0,protocol:'MCP',hitl:false,
        steps:[{id:'s1',name:'신규 임용자 트리거',type:'trigger',agentId:null},{id:'s2',name:'MCP-OnnaraSync',type:'mcp',agentId:null},{id:'s3',name:'복무규정 질의응답 봇',type:'agent',agentId:'AGT-003'},{id:'s4',name:'신규 임용자 교육 튜터',type:'agent',agentId:'AGT-006'},{id:'s5',name:'자치법규 검색 에이전트',type:'agent',agentId:'AGT-001'}]},
      {id:'WF-003',name:'계약 검토 승인 프로세스',desc:'계약서 업로드 → AI 검토 → 위험 분류 → HITL 승인',status:'Stopped',creator:'홍은지',created:'2026-02-05',lastRun:'2026-02-10 11:20',runs24h:0,successRate:100.0,protocol:'A2A',hitl:true,
        steps:[{id:'s1',name:'계약서 업로드',type:'trigger',agentId:null},{id:'s2',name:'계약서 검토 에이전트',type:'agent',agentId:'AGT-004'},{id:'s3',name:'위험 수준 분기',type:'condition',agentId:null},{id:'s4',name:'HITL 기획예산과 검토',type:'hitl',agentId:null},{id:'s5',name:'승인 요청 발송',type:'action',agentId:null}]},
      {id:'WF-004',name:'지출결의 자동화 파이프라인',desc:'업무 지시 → e호조 데이터 조회 → 결의서 작성 → 승인 (Actionable AI)',status:'Running',creator:'노태건',created:'2026-02-10',lastRun:'2026-02-14 08:30',runs24h:23,successRate:96.5,protocol:'MCP+A2A',hitl:true,
        steps:[{id:'s1',name:'업무 지시 수신',type:'trigger',agentId:null},{id:'s2',name:'MCP-EhojoConnector',type:'mcp',agentId:null},{id:'s3',name:'지출결의 자동 작성',type:'agent',agentId:'AGT-008'},{id:'s4',name:'금액 ≥ 100만원',type:'condition',agentId:null},{id:'s5',name:'HITL 결재 요청',type:'hitl',agentId:null},{id:'s6',name:'e호조 결의서 등록',type:'action',agentId:null}]},
    ],

    UPSTAGE_OCR_MOCK: {
      totalPages:3, totalBlocks:16, elapsed:2.4,
      pages:[
        {page:1,
         text:"제1조 (목적)\n이 조례는 한성시 민원 처리에 관한 사항을 규정하여 민원 처리의 공정성과 신속성을 확보함을 목적으로 한다.\n\n제2조 (적용 범위)\n이 조례는 시 및 소속 행정기관에 접수되는 모든 민원 사무에 적용한다.\n\n제3조 (정의)\n이 조례에서 사용하는 용어의 정의는 다음과 같다.",
         blocks:[
           {text:"제1조 (목적)",bbox:{x:14,y:14,w:35,h:6}},
           {text:"이 조례는 한성시 민원 처리에 관한 사항을 규정하여 민원 처리의 공정성과 신속성을 확보함을 목적으로 한다.",bbox:{x:14,y:22,w:70,h:8}},
           {text:"제2조 (적용 범위)",bbox:{x:14,y:36,w:38,h:6}},
           {text:"이 조례는 시 및 소속 행정기관에 접수되는 모든 민원 사무에 적용한다.",bbox:{x:14,y:44,w:65,h:6}},
           {text:"제3조 (정의)",bbox:{x:14,y:56,w:28,h:6}},
           {text:"이 조례에서 사용하는 용어의 정의는 다음과 같다.",bbox:{x:14,y:64,w:60,h:6}},
         ]},
        {page:2,
         text:"제4조 (처리 기한)\n① 일반민원: 접수일부터 7 근무일 이내 처리\n② 법정민원: 개별 법령이 정한 처리기간 이내 처리\n③ 고충민원: 접수일부터 14일 이내 처리, 현장 확인 시 연장 가능",
         blocks:[
           {text:"제4조 (처리 기한)",bbox:{x:14,y:10,w:36,h:6}},
           {text:"① 일반민원: 접수일부터 7 근무일 이내 처리",bbox:{x:18,y:20,w:66,h:6}},
           {text:"② 법정민원: 개별 법령이 정한 처리기간 이내 처리",bbox:{x:18,y:29,w:62,h:6}},
           {text:"③ 고충민원: 접수일부터 14일 이내 처리, 현장 확인 시 연장 가능",bbox:{x:18,y:38,w:60,h:6}},
         ]},
        {page:3,
         text:"제5조 (처리 결과 통지)\n처리 완료 후 지체 없이 새올행정시스템에 결과를 등록하고 민원인이 선택한 방법으로 통지하여야 한다.\n\n[별표 1] 민원 종류별 처리기한표",
         blocks:[
           {text:"제5조 (처리 결과 통지)",bbox:{x:14,y:10,w:44,h:6}},
           {text:"처리 완료 후 지체 없이 결과를 등록하고 민원인에게 통지하여야 한다.",bbox:{x:14,y:20,w:70,h:8}},
           {text:"[별표 1] 민원 종류별 처리기한표",bbox:{x:14,y:36,w:52,h:6}},
           {text:"(개인 식별 정보 처리됨 — PII 마스킹 적용)",bbox:{x:14,y:46,w:65,h:6}},
           {text:"담당자 서명란",bbox:{x:14,y:58,w:28,h:6}},
           {text:"민원여권과장 확인",bbox:{x:14,y:66,w:34,h:6}},
         ]},
      ]
    },

    UPSTAGE_PARSE_MOCK: {
      statistics:{paragraphs:24,headings:8,tables:3,figures:2,total:37},
      elements:[
        {category:'heading1',content:'한성시 민원 처리에 관한 조례',page:1},
        {category:'heading2',content:'제1장 총칙',page:1},
        {category:'paragraph',content:'제1조 (목적) 이 조례는 한성시 민원 처리에 관한 사항을 규정하여 민원 처리의 공정성과 신속성을 확보함을 목적으로 한다.',page:1},
        {category:'paragraph',content:'제2조 (적용 범위) 이 조례는 시 및 소속 행정기관에 접수되는 모든 민원 사무에 적용한다.',page:1},
        {category:'heading2',content:'제2장 처리 기준',page:2},
        {category:'table',content:'| 민원 종류 | 처리 기한 | 담당부서 |\n|---------|---------|--------|\n| 일반민원 | 7 근무일 | 민원여권과 |\n| 고충민원 | 14일 | 소관 부서 |',page:2},
        {category:'paragraph',content:'제4조 (처리 방법) 민원 처리는 관련 법령 및 내부 기준에 따라 실시한다.',page:2},
        {category:'figure',content:'[그림 1] 민원 처리 업무 흐름도',page:2},
        {category:'heading2',content:'제3장 통지 의무',page:3},
        {category:'paragraph',content:'제5조 (통지 의무) 처리 완료 후 지체 없이 결과를 민원인에게 통지하여야 한다.',page:3},
        {category:'list',content:'• 처리 결과 통지서\n• 처리기한 연장 통지서\n• 반복 민원 종결 통보서',page:3},
        {category:'figure',content:'[그림 2] 통지 체계도',page:3},
      ],
      outputs:{
        markdown:`# 한성시 민원 처리에 관한 조례\n\n## 제1장 총칙\n\n**제1조 (목적)** 이 조례는 한성시 민원 처리에 관한 사항을 규정하여 민원 처리의 공정성과 신속성을 확보함을 목적으로 한다.\n\n**제2조 (적용 범위)** 이 조례는 시 및 소속 행정기관에 접수되는 모든 민원 사무에 적용한다.\n\n## 제2장 처리 기준\n\n| 민원 종류 | 처리 기한 | 담당부서 |\n|---------|---------|--------|\n| 일반민원 | 7 근무일 | 민원여권과 |\n| 고충민원 | 14일 | 소관 부서 |\n\n> [그림 1] 민원 처리 업무 흐름도\n\n## 제3장 통지 의무\n\n**제5조 (통지 의무)** 처리 완료 후 지체 없이 결과를 민원인에게 통지하여야 한다.\n\n- 처리 결과 통지서\n- 처리기한 연장 통지서\n- 반복 민원 종결 통보서`,
        html:`<h1>한성시 민원 처리에 관한 조례</h1>\n<h2>제1장 총칙</h2>\n<p><strong>제1조 (목적)</strong> 이 조례는 한성시 민원 처리에 관한 사항을 규정하여 민원 처리의 공정성과 신속성을 확보함을 목적으로 한다.</p>\n<p><strong>제2조 (적용 범위)</strong> 이 조례는 시 및 소속 행정기관에 접수되는 모든 민원 사무에 적용한다.</p>\n<h2>제2장 처리 기준</h2>\n<table><tr><th>민원 종류</th><th>처리 기한</th><th>담당부서</th></tr><tr><td>일반민원</td><td>7 근무일</td><td>민원여권과</td></tr></table>`,
        text:`한성시 민원 처리에 관한 조례\n\n제1장 총칙\n\n제1조 (목적) 이 조례는 한성시 민원 처리에 관한 사항을 규정하여 민원 처리의 공정성과 신속성을 확보함을 목적으로 한다.\n\n제2조 (적용 범위) 이 조례는 시 및 소속 행정기관에 접수되는 모든 민원 사무에 적용한다.\n\n제2장 처리 기준\n일반민원 | 7 근무일 | 민원여권과\n고충민원 | 14일 | 소관 부서`,
      }
    },

    // AI 기본법 — 기초지자체 고영향 판단 기준으로 재작성
    MOCK_AIACT_SYSTEMS: [
      {id:'hi-001',name:'복지 수급자격 사전판별 AI',dept:'복지정책과',status:'고영향 확인',confirmedAt:'2026-02-10',manager:'서지혜 팀장',
       purpose:'기초생활·긴급복지 등 복지 급여 수급자격 사전판별 및 지원 누락 대상 발굴 지원',
       basis:'공공서비스 영역 — 급여 수급자격 판단은 주민의 권리·의무에 중대한 영향',
       measures:[
         {k:'위험관리 방안 수립·운영',done:true},
         {k:'AI 판단 기준·근거 설명 방안 마련',done:true},
         {k:'이용자 보호 방안 수립·운영',done:true},
         {k:'사람의 관리·감독 체계(최종 검증 인력 지정)',done:true},
         {k:'안전성·신뢰성 확보 조치 문서 작성·보관',done:false},
       ]},
      {id:'hi-002',name:'인허가 검토 지원 AI',dept:'민원여권과',status:'고영향 확인',confirmedAt:'2026-02-18',manager:'김도윤 팀장',
       purpose:'옥외광고물 등 인허가 신청의 요건 충족 여부 검토 및 유사 허가 사례 추천 지원',
       basis:'주민의 권리·의무 관계에 중대한 영향 — 허가 여부 판단 과정에 직접 관여',
       measures:[
         {k:'위험관리 방안 수립·운영',done:true},
         {k:'AI 판단 기준·근거 설명 방안 마련',done:true},
         {k:'이용자 보호 방안 수립·운영',done:false},
         {k:'사람의 관리·감독 체계(최종 검증 인력 지정)',done:true},
         {k:'안전성·신뢰성 확보 조치 문서 작성·보관',done:false},
       ]},
      {id:'hi-003',name:'CCTV 이상행동 감지 AI',dept:'안전총괄과',status:'검토 중',confirmedAt:'-',manager:'조현우 주무관',
       purpose:'방범 CCTV 영상의 이상행동 자동 감지 및 통합관제센터 알림 지원',
       basis:'생체인식 기반 분석 해당 여부 검토 중 (과기정통부 확인 요청 검토)',
       measures:[
         {k:'위험관리 방안 수립·운영',done:false},
         {k:'AI 판단 기준·근거 설명 방안 마련',done:true},
         {k:'이용자 보호 방안 수립·운영',done:true},
         {k:'사람의 관리·감독 체계(최종 검증 인력 지정)',done:false},
         {k:'안전성·신뢰성 확보 조치 문서 작성·보관',done:false},
       ]},
      {id:'hi-004',name:'시정 동향 리포트 모델',dept:'기획예산과',status:'검토 중',confirmedAt:'-',manager:'홍은지 팀장',
       purpose:'주간·월간 시정 동향 리포트 초안 생성 및 민원 통계 요약',
       basis:'통계 기반 시정 전망 제공 — 주민 권리·의무에 대한 직접 영향 여부 판단 진행 중',
       measures:[
         {k:'위험관리 방안 수립·운영',done:false},
         {k:'AI 판단 기준·근거 설명 방안 마련',done:true},
         {k:'이용자 보호 방안 수립·운영',done:false},
         {k:'사람의 관리·감독 체계(최종 검증 인력 지정)',done:true},
         {k:'안전성·신뢰성 확보 조치 문서 작성·보관',done:false},
       ]},
      {id:'hi-005',name:'스마트행정 업무지원 챗봇',dept:'정보통신과',status:'비해당',confirmedAt:'2026-01-28',manager:'강수진 팀장',
       purpose:'직원 내부 업무 질의응답·문서 초안 작성 보조',
       basis:'내부 업무 보조 목적 — 주민의 생명·신체·기본권에 미치는 영향 없음',
       measures:[
         {k:'위험관리 방안 수립·운영',done:true},
         {k:'AI 판단 기준·근거 설명 방안 마련',done:true},
         {k:'이용자 보호 방안 수립·운영',done:true},
         {k:'사람의 관리·감독 체계(최종 검증 인력 지정)',done:true},
         {k:'안전성·신뢰성 확보 조치 문서 작성·보관',done:true},
       ]},
      {id:'hi-006',name:'민원 자동분류 에이전트',dept:'민원여권과',status:'비해당',confirmedAt:'2026-01-28',manager:'이서연 주무관',
       purpose:'접수 민원의 유형·소관 부서 자동 분류 및 이송 지원',
       basis:'접수 전처리 도구 — 처분 의사결정에 관여하지 않아 고영향 요건 미충족',
       measures:[
         {k:'위험관리 방안 수립·운영',done:true},
         {k:'AI 판단 기준·근거 설명 방안 마련',done:true},
         {k:'이용자 보호 방안 수립·운영',done:true},
         {k:'사람의 관리·감독 체계(최종 검증 인력 지정)',done:true},
         {k:'안전성·신뢰성 확보 조치 문서 작성·보관',done:true},
       ]},
    ],

    MOCK_AIACT_ASSESSMENTS: [
      {id:'ia-001',system:'복지 수급자격 사전판별 AI',round:'2026 상반기 정기 영향평가',status:'완료',date:'2026-02-14',assessor:'외부 전문기관 합동평가',grade:'적합',
       scores:[['기본권 영향 관리',88],['안전성',92],['편향성 관리',85],['투명성·설명가능성',90],['책무성',86]],
       findings:[
         {text:'판별 근거 설명문에 소득·재산 기준 적용 사유 보강 필요',status:'조치 완료'},
         {text:'연 1회 편향성 재검증 주기의 내부 규정 문서화',status:'조치 완료'},
       ]},
      {id:'ia-002',system:'인허가 검토 지원 AI',round:'2026 상반기 정기 영향평가',status:'진행 중',progress:65,date:'2026-03-20 완료 예정',assessor:'민원혁신 TF 자체평가',grade:'-',
       scores:[['기본권 영향 관리',82],['안전성',88],['편향성 관리',null],['투명성·설명가능성',null],['책무성',null]],
       findings:[
         {text:'반려 다수 발생 인허가 유형 표본의 편향성 검증 진행 중',status:'진행 중'},
       ]},
      {id:'ia-003',system:'CCTV 이상행동 감지 AI',round:'고영향 해당 여부 사전검토',status:'예정',date:'2026-04-06 착수 예정',assessor:'민원혁신 TF',grade:'-',
       scores:[],
       findings:[]},
    ],

    // ── 페이지 인라인 이관 상수 (ADMIN_ 접두 전부) ──
    ADMIN_MGMT_GROUPS: ['AI Engineer','QA','민원여권과','자치행정과'],
    ADMIN_MCP_SERVERS: [
      {id:1,n:'Local MCP Server',u:'http://localhost:8080',t:'Search, Web Crawler',s:'Running'},
      {id:2,n:'External API Gateway',u:'https://api.hansung.go.kr/mcp',t:'새올 Connector, 온나라 Sync',s:'Running'},
      {id:3,n:'Test Server',u:'http://192.168.10.50:3000',t:'CodeDev',s:'Stopped'},
    ],
    ADMIN_REPORT_ROWS: [
      {id:'RPT-001',title:'2월 민원행정 현황 보고서',type:'요약',template:'민원행정',status:'완료',date:'2026-02-10',pages:12},
      {id:'RPT-002',title:'행정동별 민원 추이 분석 리포트',type:'분석',template:'현장점검',status:'완료',date:'2026-02-09',pages:24},
      {id:'RPT-003',title:'1분기 AI 활용 성과보고',type:'보고서',template:'성과분석',status:'생성 중',date:'2026-02-11',pages:0},
      {id:'RPT-004',title:'외국인 민원 안내문 번역',type:'번역',template:'기술문서',status:'완료',date:'2026-02-08',pages:45},
      {id:'RPT-005',title:'신규 임용자 교육자료 요약',type:'요약',template:'교육',status:'대기 중',date:'2026-02-11',pages:0},
    ],
    ADMIN_REPORT_TEMPLATES: ['민원행정','현장점검','성과분석','기술문서','교육'],
    ADMIN_PROMPT_PREVIEW_INTRO: '당신은 한성시청의 AI 어시스턴트입니다.',
    ADMIN_INTERNAL_TOOLS: [
      {name:'자치법규 벡터 DB',desc:'조례·규칙 및 민원사무편람 검색'},
      {name:'새올 민원 이력 DB',desc:'민원 접수·처리 이력 조회'},
      {name:'알림 서비스 API',desc:'문자/알림톡 통지 발송'},
    ],
    ADMIN_AGENT_NAME_EXAMPLE: '자치법규 검색 에이전트',
    ADMIN_WORKFLOW_NAME_EXAMPLE: '민원 자동 분류',
    ADMIN_DATASET_ROWS: [
      {id:1,n:'Minwon_Manual_QA_v1',d:'민원사무편람 QA 데이터셋',t:'JSONL',s:'124MB',c:'15,000',date:'2026-02-10'},
      {id:2,n:'Ordinance_Corpus',d:'자치법규(조례·규칙) 전문 코퍼스',t:'TXT',s:'512MB',c:'N/A',date:'2026-02-09'},
      {id:3,n:'Employee_Inquiry_Logs',d:'직원 질의 로그',t:'CSV',s:'45MB',c:'8,200',date:'2026-02-08'},
      {id:4,n:'Gemma_Instruction_Tuning',d:'Gemma 한국어 인스트럭션',t:'JSONL',s:'230MB',c:'25,000',date:'2026-02-07'},
      {id:5,n:'EXAONE_Budget_Report',d:'예산 보고서 요약 학습',t:'Parquet',s:'1.2GB',c:'5,000',date:'2026-02-06'},
    ],
    ADMIN_VECTOR_SEARCH_RESULTS: [
      {id:'vec_8a1',score:0.92,content:'...이 조례는 한성시의 민원 처리 업무 수행에 필요한 사항을 규정함을 목적으로 한다...'},
      {id:'vec_3b2',score:0.88,content:'...제 2 조 (적용범위) 이 조례는 한성시 및 소속 행정기관에 접수되는 모든 민원 사무에 적용하며...'},
      {id:'vec_9c3',score:0.75,content:'...일반민원의 처리 기한은 접수일부터 7 근무일로 하며, 연장은 1회에 한한다...'},
    ],
    ADMIN_AGENT_FOLDER_LINKS: [
      {agent:'공문 사전 검토',folders:['자치법규','계약·회계']},
      {agent:'민원 분류 어시스턴트',folders:['민원사무편람','자치법규']},
      {agent:'복무규정 질의응답 봇',folders:['복무·인사규정','교육자료']},
    ],
    ADMIN_MY_DOCS: [
      {name:'민원사무편람_요약.pdf',size:'2.4MB',date:'2026-02-08'},
      {name:'현장점검_매뉴얼.docx',size:'5.1MB',date:'2026-02-05'},
      {name:'AI_활용_사례집.pptx',size:'12MB',date:'2026-01-28'},
    ],
    ADMIN_APPROVAL_ROWS: [
      {id:'APR-101',type:'모델 배포',user:'노태건',dept:'정보통신과',date:'2026-02-09',status:'대기 중',desc:'GPT-OSS-120B 모델 운영 환경 배포 요청'},
      {id:'APR-102',type:'GPU 할당',user:'박세훈',dept:'자치행정과',date:'2026-02-10',status:'대기 중',desc:'VLM 학습을 위한 A100 x4 GPU 할당 요청'},
      {id:'APR-100',type:'GPU 할당',user:'박세훈',dept:'자치행정과',date:'2026-02-08',status:'승인',desc:'임베딩 학습용 GPU 할당'},
      {id:'APR-099',type:'데이터 접근',user:'이서연',dept:'민원여권과',date:'2026-02-07',status:'승인',desc:'민원사무편람 데이터셋 접근 권한 요청'},
      {id:'APR-098',type:'API 키 발급',user:'김나윤',dept:'기획예산과',date:'2026-02-06',status:'거부',desc:'외부 API 키 발급 요청'},
    ],
    ADMIN_QUOTA_DEPTS: [
      {id:1,name:'정보통신과',gpu:{used:4,total:8},mem:{used:256,total:512},storage:{used:8,total:10}},
      {id:2,name:'민원여권과',gpu:{used:1,total:2},mem:{used:64,total:256},storage:{used:3,total:5}},
      {id:3,name:'기획예산과',gpu:{used:2,total:4},mem:{used:180,total:256},storage:{used:4.5,total:5}},
      {id:4,name:'자치행정과',gpu:{used:0,total:1},mem:{used:32,total:128},storage:{used:1,total:5}},
      {id:5,name:'안전총괄과',gpu:{used:0,total:1},mem:{used:16,total:64},storage:{used:0.5,total:2}},
      {id:6,name:'복지정책과',gpu:{used:1,total:2},mem:{used:96,total:128},storage:{used:2,total:3}},
    ],
    ADMIN_PERM_MATRIX: {
      headers:['민원사무편람','자치법규','복무·인사규정','계약·회계','교육자료','재난·안전 대응'],
      rows:[
        {dept:'민원여권과',perm:[true,true,false,false,true,true]},
        {dept:'자치행정과',perm:[true,true,true,false,true,false]},
        {dept:'기획예산과',perm:[false,true,false,true,true,false]},
        {dept:'안전총괄과',perm:[true,false,false,false,true,true]},
        {dept:'복지정책과',perm:[true,false,false,false,true,false]},
        {dept:'정보통신과',perm:[false,false,false,false,true,false]},
      ],
    },
    ADMIN_QUOTA_ADVICE: '민원여권과(3,240건/월)와 자치행정과(2,880건/월)가 전체 사용량의 45%를 차지합니다. 부서별 할당량 설정을 통해 리소스를 균형 있게 배분하세요.',
    ADMIN_USER_GROUPS: [
      {name:'민원행정그룹',type:'부서 그룹',members:27,areas:['민원사무편람','재난·안전 대응','자치법규'],perms:'읽기+쓰기'},
      {name:'계약회계그룹',type:'기능 그룹',members:6,areas:['계약·회계'],perms:'읽기 전용'},
      {name:'관리자 그룹',type:'시스템 그룹',members:3,areas:['전체 영역'],perms:'전체 권한'},
      {name:'외부 위탁업체',type:'외부 그룹',members:12,areas:['교육자료 (일부)'],perms:'제한적 읽기'},
    ],
    AIACT_STD_PHRASE: '본 내용은 한성시 스마트행정 생성형 AI 플랫폼을 활용하여 작성되었습니다. 중요한 의사결정에는 담당 주무관의 검토·확인이 필요합니다.',
  },
};

export default civic;
