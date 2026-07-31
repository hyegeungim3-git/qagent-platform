/**
 * 도메인 팩 — 한국부동산원 (기본)
 * 코어 플랫폼은 이 파일의 스키마만 알고, 조직·업무 내용은 전부 여기서 공급한다.
 */
import { Briefcase, Database, ShieldCheck, Search, Globe, Activity, Map } from "lucide-react";

const reb = {
  id: "reb",
  orgName: "한국부동산원",
  orgShort: "REB",
  sectorLabel: "공공",                  // 화면 표시용 분야명 (탭·로고·타이틀). 본문 조직명은 orgName 유지
  platformTitle: "한국부동산원 AgentQ",
  brandColor: "#003087",
  welcome: "한국부동산원 생성형 AI 플랫폼에 오신 것을 환영합니다.",
  statusBadge: "시스템 정상 가동 중 · 로컬 LLM · 내부망 전용 · 망분리 적용",
  footerNote: "한국부동산원 생성형 AI 플랫폼 구축 사업",
  userFeatures: [
    "일반 질의 (RAG 기반 지식 검색)",
    "문서 사전 검토 (사규 자동 대조)",
    "번역·요약 (한/영/중/일 지원)",
    "보고서 자동 작성 (표준 양식)",
  ],
  user: { name: "김민준", dept: "부동산공시처", title: "과장" },
  workspaces: [
    { id: "ws1", name: "AX센터 AI업무혁신 TF", icon: Briefcase, active: true },
    { id: "ws2", name: "부동산공시처 조사업무반", icon: Database },
    { id: "ws3", name: "정보보안부 보안실태조사 TF", icon: ShieldCheck },
  ],
  llmModels: [
    { id: "m0", name: "Claude Fable 5", shortName: "Fable 5", type: "보안 게이트웨이", context: "400K", security: "high", status: "running", desc: "플래그십 최고 성능 모델 — CSAP 인증 보안 게이트웨이 경유 (기본값)" },
    { id: "m1", name: "GPT-OSS 120B", shortName: "GPT-OSS", type: "구축형", context: "128K", security: "high", status: "running", desc: "고성능 내부망 전용 대형 모델" },
    { id: "m2", name: "Llama-3-Korean 70B", shortName: "Llama-3", type: "구축형", context: "32K", security: "high", status: "running", desc: "빠른 추론 및 에이전트 워크플로우 특화" },
    { id: "m3", name: "EXAONE 3.0 78B", shortName: "EXAONE", type: "구축형", context: "32K", security: "high", status: "running", desc: "사내 규정 및 지식 검색(RAG) 특화" },
    { id: "m4", name: "Gemini 2.5 Pro", shortName: "Gemini", type: "API(Cloud)", context: "1M", security: "low", status: "blocked", desc: "미인증 클라우드 모델 — 망분리 정책으로 차단" },
  ],
  // GENERAL 탭 제안 질의 — null이면 constants.js의 기본 SUGGESTIONS 사용
  suggestions: [
    { icon: Search,   iconBg: "bg-blue-50",   iconColor: "text-blue-600",   title: "공시지가 조사 기준",    query: "표준지공시지가 조사·산정 기준일과 정기 조사 주기가 어떻게 되나요?" },
    { icon: Globe,    iconBg: "bg-green-50",  iconColor: "text-green-600",  title: "AI 사업 예산 조회",    query: "생성형 AI 플랫폼 구축 사업의 총 예산과 사업 기간을 알려주세요." },
    { icon: Activity, iconBg: "bg-rose-50",   iconColor: "text-rose-600",   title: "실거래 이상거래 탐지", query: "이번 주 실거래 신고 중 시세 괴리 의심 거래 현황을 알려줘" },
    { icon: Map,      iconBg: "bg-sky-50",    iconColor: "text-sky-600",    title: "지역별 공시가 분석", query: "전국 시도별 표준지 공시지가 변동률을 지도로 분석해줘" },
  ],
  // 실거래 검증 답변만 팩에서 공급 — 미적중 시 기존 AI_RESPONSES 로직(표준지·예산)으로 폴백
  // 수치는 오케스트레이션 '실거래 신고 이상거래 검증' 시나리오와 동일 세계관 (1,842건·의심 8건)
  sampleAnswers: [
    {
      keywords: ["실거래", "이상거래", "괴리", "업계약", "다운계약"],
      answer: {
        content: "**주간 실거래 신고 검증 현황** (RTMS 자동 검증, 03.16~03.20 신고분)\n\n- **신고 접수**: 아파트 1,842건 — 동일 단지·면적대 12개월 거래 대조로 비교 시세 1,796건 확보\n- **의심 거래 8건 선별** (선별률 0.43%): 고가 괴리(+30% 초과) 3건 · 저가 괴리(-30% 미만) 4건 · 동일 법인 반복 거래 1건\n\n**대표 사례**: A단지 전용 84㎡ — 신고가가 비교 시세 대비 **+34%**, 직전 최고가 거래의 해제 후 재신고 이력 동반 → 신고가 띄우기 의심 유형\n\n**처리 기준**\n1. 고가 괴리 + 해제 이력 동반 건은 즉시 정밀조사 착수 권고\n2. 저가 직거래는 편법 증여 의심 유형(조사 매뉴얼 §3-2) — 조사 후 국세청 통보 요건 검토\n3. 시세 산출 불가 46건(신축·거래 희소)은 감정평가 참조 대기로 분류\n\n에이전트 탭의 **'실거래 신고 이상거래 검증'** 시나리오를 실행하면 실거래 조회 → 괴리 분석 → 법령 대조 → 정밀조사 선별 보고서까지 자동으로 처리됩니다.\n\n※ 출처: 부동산거래관리시스템(RTMS), 부동산 거래신고 등에 관한 법률 제6조, 이상거래 조사 매뉴얼 v4",
        citations: [], steps: null,
        confidence: 89,
        xai: {
          queryRewrite: "주간 실거래 신고 시세 괴리 이상거래 의심 현황",
          base: { rag: 86, model: 14 },
          sources: [
            { name: "RTMS 신고 DB (주간 집계)", similarity: 95 },
            { name: "실거래 해제 이력 대장", similarity: 91 },
            { name: "이상거래 조사 매뉴얼 v4", similarity: 83 },
          ],
          rejected: [
            { name: "공시가격 이의신청 접수 대장", similarity: 49, reason: "실거래 신고 검증과 무관한 공시 업무 문서" },
          ],
          reasoning: "비교 시세 괴리도가 가장 큰 선별 근거이며, 해제 후 재신고 이력이 동반된 건을 우선순위 상위로 올렸습니다. 시세 산출 불가 46건은 판단을 보류하고 감정평가 참조로 분리했습니다.",
        },
      },
    },
  ],
  // 지도 인텔리전스 — GENERAL 채팅에서 지역 질의 시 히트맵+시계열 삽입 (시뮬레이션)
  mapIntel: {
    metricLabel: "표준지 공시지가 변동률",
    unit: "%",
    regionUnit: "시도",
    periodLabel: "2026년 정기공시 기준",
    sourceSystem: "부동산통계정보시스템(R-ONE)",
    sourceNote: "※ 출처: 2026년 표준지공시지가 정기공시 · R-ONE 통계 연계 (시뮬레이션 데이터)",
    mapTitle: "전국 시도별 히트맵",
    chartTitle: "연도별 변동률 추이",
    metricKeywords: ["공시지가", "공시가", "변동률", "지가 변동"],
    wideKeywords: ["시도별", "지역별", "전국", "지도"],
    heatLow: "#DBEAFE", heatHigh: "#1E3A8A",
    avgLabel: "전국 평균",
    seriesLabels: ["'22", "'23", "'24", "'25", "'26"],
    avgSeries: [10.17, -5.92, 1.10, 1.42, 1.65],
    grid: { cols: 4, rows: 6 },
    regions: [
      { id: "seoul",   name: "서울", keywords: ["서울"],           x: 1, y: 0, value: 3.92, series: [11.21, -5.86, 1.87, 3.10, 3.92], insight: "국제교류복합지구 조성과 GTX 역세권 수요로 3년 연속 상승 폭이 확대됐습니다. 강남·서초 상업지 표준지가 상승을 견인했습니다." },
      { id: "gangwon", name: "강원", keywords: ["강원"],           x: 3, y: 0, value: 1.74, series: [7.86, -4.55, 0.92, 1.38, 1.74], insight: "동서고속화철도 착공과 강릉권 관광 수요 회복으로 전국 평균을 상회하는 상승률을 기록했습니다." },
      { id: "incheon", name: "인천", keywords: ["인천"],           x: 0, y: 1, value: 2.34, series: [7.44, -6.33, 0.86, 1.75, 2.34], insight: "검단신도시 성숙과 송도 바이오클러스터 확장으로 주거·산업용지 동반 상승세입니다." },
      { id: "gyeonggi",name: "경기", keywords: ["경기"],           x: 1, y: 1, value: 2.87, series: [9.58, -5.51, 1.24, 2.21, 2.87], insight: "용인·평택 반도체 클러스터 배후 주거지 수요와 GTX-A 개통 효과가 반영되어 수도권 상승을 주도했습니다." },
      { id: "chungbuk",name: "충북", keywords: ["충북", "충청북도"], x: 2, y: 1, value: 1.52, series: [7.34, -4.28, 0.88, 1.21, 1.52], insight: "청주 오송 바이오 산업단지 확장으로 산업용지 중심의 완만한 상승세를 유지하고 있습니다." },
      { id: "gyeongbuk",name:"경북", keywords: ["경북", "경상북도"], x: 3, y: 1, value: 0.88, series: [7.06, -4.24, 0.44, 0.65, 0.88], insight: "포항 이차전지 소재 단지 외 지역은 보합세로, 회복 속도가 전국 평균을 하회합니다." },
      { id: "chungnam",name: "충남", keywords: ["충남", "충청남도"], x: 0, y: 2, value: 1.96, series: [7.02, -4.42, 1.19, 1.62, 1.96], insight: "아산 디스플레이 산단 증설과 천안 성장으로 비수도권 중 상위권 상승률을 기록했습니다." },
      { id: "sejong",  name: "세종", keywords: ["세종"],           x: 1, y: 2, value: 2.19, series: [10.52, -7.06, 1.05, 1.68, 2.19], insight: "'23년 큰 폭 하락 이후 행정기능 이전 기대가 재부상하며 뚜렷한 반등 흐름을 보이고 있습니다." },
      { id: "daejeon", name: "대전", keywords: ["대전"],           x: 2, y: 2, value: 1.87, series: [8.16, -4.84, 1.01, 1.44, 1.87], insight: "원도심 재개발 진척과 대덕특구 연구시설 수요로 상업·업무용지가 상승을 이끌었습니다." },
      { id: "daegu",   name: "대구", keywords: ["대구"],           x: 3, y: 2, value: 0.94, series: [8.53, -5.87, 0.42, 0.68, 0.94], insight: "미분양 해소 지연으로 주거지 회복이 완만하나, 수성구 상업지는 반등이 시작됐습니다." },
      { id: "jeonbuk", name: "전북", keywords: ["전북", "전라북도"], x: 0, y: 3, value: 1.21, series: [7.45, -4.17, 0.71, 0.96, 1.21], insight: "새만금 이차전지 투자 유치 효과가 군산·김제 산업용지에 반영되기 시작했습니다." },
      { id: "gyeongnam",name:"경남", keywords: ["경남", "경상남도"], x: 2, y: 3, value: 1.13, series: [7.68, -4.61, 0.58, 0.87, 1.13], insight: "창원 방산·원전 수주 회복으로 산업용지 중심의 점진적 회복세를 보이고 있습니다." },
      { id: "ulsan",   name: "울산", keywords: ["울산"],           x: 3, y: 3, value: 1.08, series: [7.76, -5.05, 0.55, 0.82, 1.08], insight: "조선업 수주 잔량 증가로 동구 주거지 하락세가 멈추고 상승 전환했습니다." },
      { id: "gwangju", name: "광주", keywords: ["광주"],           x: 0, y: 4, value: 1.15, series: [7.78, -4.79, 0.62, 0.91, 1.15], insight: "AI 집적단지 2단계 착공으로 첨단지구 산업용지가 상승을 견인하고 있습니다." },
      { id: "jeonnam", name: "전남", keywords: ["전남", "전라남도"], x: 1, y: 4, value: 1.05, series: [7.32, -4.36, 0.53, 0.80, 1.05], insight: "여수·광양 산단은 보합세이나 무안 공항권 개발 기대로 소폭 상승했습니다." },
      { id: "busan",   name: "부산", keywords: ["부산"],           x: 2, y: 4, value: 1.62, series: [8.96, -6.10, 0.75, 1.20, 1.62], insight: "가덕도신공항 착공과 북항 재개발 2단계 효과로 강서·중구 일대가 상승을 주도했습니다." },
      { id: "jeju",    name: "제주", keywords: ["제주"],           x: 0, y: 5, value: 0.65, series: [9.32, -7.14, 0.28, 0.45, 0.65], insight: "관광 회복 지연으로 전국 최저 상승률이나, 하락세는 멈추고 소폭 반등했습니다." },
    ],
  },
  // 라이브 지표 — GENERAL 첫 화면 실시간 카드 + 임계 돌파 시 알림 생성 (실거래 검증 세계관과 동일 수치대)
  liveMetric: {
    label: "실거래 신고 최고 괴리율 (주간 롤링)", unit: "%", decimals: 1,
    initial: 24.5, min: 18, max: 38, window: 48,
    threshold: 30, thresholdLabel: "조사 기준 +30%",
    drift: 0.045, noise: 0.5,
    recovery: { at: 35, to: 22 },
    alert: { severity: "alert", title: "실시간 이상거래 의심 감지", body: "시세 괴리율 {value}% 신고 접수 — 정밀조사 선별 검토가 필요합니다.", link: { agentId: "orchestration:1" } },
    source: "RTMS 신고 실시간 검증(시뮬레이션)",
  },
  // 채팅→에이전트 핸드오프 — GENERAL 답변 아래 이동 카드 (선행 규칙 우선, 소문자 키워드)
  agentRouting: [
    { keywords: ["실거래", "이상거래", "괴리"], agentId: "orchestration:1", reason: "주간 신고분 전건 검증과 정밀조사 선별 보고서까지 자동 릴레이로 처리합니다." },
    { keywords: ["이의신청"], agentId: "orchestration:0", reason: "스캔 서류 OCR부터 검토 보고서까지 자동 릴레이로 처리합니다." },
    { keywords: ["번역", "영문"], agentId: "agent-translate", reason: "번역 에이전트가 용어집 매칭과 역번역 검증까지 수행합니다." },
    { keywords: ["보고서", "주간 보고"], agentId: "agent-report", reason: "표준 양식 보고서를 자동 작성하고 결재선까지 지정합니다." },
    { keywords: ["분석", "추이"], agentId: "agent-dataanalysis", reason: "데이터 분석 에이전트가 차트·통계로 심층 분석합니다." },
  ],
  // 알림 센터 — 헤더 벨 드롭다운. link.agentId로 에이전트/시나리오 딥링크 (orchestration:<idx> 허용)
  notifications: [
    { id: "n1", severity: "alert", title: "실거래 이상거래 의심 8건", body: "주간 자동 검증 결과 고가 3·저가 4·반복 거래 1건 — 정밀조사 선별 검토가 필요합니다.", time: "09:00", link: { agentId: "orchestration:1" } },
    { id: "n2", severity: "warn", title: "공시지가 이의신청 12건 접수", body: "스캔 서류 일괄 처리 대기 — OCR·검토 보고서 자동화를 실행할 수 있습니다.", time: "08:15", link: { agentId: "orchestration:0" } },
    { id: "n3", severity: "info", title: "주간 보고서 마감 D-1", body: "부동산공시처 주간 업무 보고 초안 작성을 지원할 수 있습니다.", time: "어제", link: { agentId: "agent-report" } },
  ],
  // 복합 업무 오케스트레이션 — 배열이면 허브에 카드가 시나리오별로 1장씩 노출 (시뮬레이션)
  orchestration: [
  // 시나리오 1 — 공시: 스캔 서류 1묶음이 OCR→주소 표준화→DB조회→검토 보고서를 릴레이
  {
    title: "공시지가 이의신청 서류 일괄 처리",
    brief: "스캔 서류 1묶음이 OCR → 주소 표준화 → 공시지가 DB 조회 → 검토 보고서로 자동 릴레이됩니다.",
    request: "오늘 접수된 공시지가 이의신청서 스캔본을 처리해줘. 신청 필지들의 공시지가와 전년 대비 변동률을 확인해서 검토 보고서까지 만들어줘.",
    attachment: { name: "이의신청서_스캔_0305.pdf", pages: 18, size: "12.4 MB" },
    stages: [
      {
        agentId: "agent-ocr", ms: 3200,
        task: "스캔 이의신청서에서 신청인·대상 필지·신청 사유를 추출하고 개인정보를 자동 마스킹합니다.",
        logs: [
          "Vision_OCR_엔진 호출 — 18면 판독 (300dpi · 표 추출 모드)",
          "이의신청서 12건 인식 완료 · 평균 신뢰도 97.2%",
          "개인정보 자동 마스킹 — 주민번호 12건 · 연락처 12건",
          "신청 사유 분류 — 인근 시세 대비 과다 9 · 이용상황 오류 2 · 면적 정정 1",
        ],
        output: {
          label: "OCR 추출 결과",
          items: [
            "이의신청 12건 구조화 (신청인·지번·신청 사유)",
            "개인정보 24건 마스킹 처리 — 마스킹 로그 자동 기록",
            "첨부 증빙 7건 별도 분류 (감정평가서 4 · 실거래 계약서 3)",
          ],
        },
        handoff: "추출한 지번 주소 12건을 주소 표준화 에이전트로 전달",
      },
      {
        agentId: "agent-address", ms: 2400,
        task: "추출된 지번 주소를 도로명주소·PNU(필지고유번호)로 표준화합니다.",
        logs: [
          "도로명주소_DB 일괄 매칭 — 12건 (fuzzy 모드)",
          "오기 주소 2건 자동 보정 (행정동 개칭 1 · 번지 오탈자 1)",
          "PNU 19자리 필지고유번호 매핑 12건 완료",
          "지오코딩 — 위경도 좌표 · 법정동 코드 부여",
        ],
        output: {
          label: "주소 표준화 결과",
          items: [
            "12건 전건 표준화 성공 (자동 보정 2건 포함)",
            "PNU·법정동 코드 매핑 완료 — 공시지가 DB 조회 키 확보",
          ],
        },
        handoff: "PNU 12건을 DB 검색 에이전트로 전달",
      },
      {
        agentId: "agent-dbquery", ms: 2800,
        task: "필지별 2026년 공시지가와 최근 3년 변동률을 공시지가 정형DB에서 조회합니다.",
        logs: [
          "Text2SQL 변환 — SELECT … FROM std_land_price WHERE pnu IN (12건)",
          "공시지가_정형DB 조회 — 48 rows (본필지 12 · 인근 표준지 36)",
          "전년 대비 변동률 산출 — 12필지 평균 +2.14%",
          "이상치 탐지 — 변동률 ±8% 초과 2필지 식별",
        ],
        output: {
          label: "DB 조회 결과",
          items: [
            "12필지 공시지가·3개년 변동률 집계 완료",
            "인근 표준지 36건 비교 — 가격 균형 범위 이탈 2필지",
          ],
        },
        handoff: "필지별 조회·비교 데이터를 보고서 작성 에이전트로 전달",
      },
      {
        agentId: "agent-report", ms: 3000,
        task: "검토 결과를 이의신청 검토 보고서 표준 양식으로 작성합니다.",
        logs: [
          "표준 템플릿 로드 — 이의신청 검토 보고서 양식 v3",
          "필지별 검토 의견 개조식 변환 — 12건",
          "문서번호 채번 — KREA-부동산공시처-2026-041",
          "결재선 자동 지정 — 담당 → 부장 → 처장",
        ],
        output: {
          label: "보고서 생성",
          items: ["검토 보고서 1건 생성 (12필지 · 붙임 조회표 2종)"],
        },
        handoff: null,
      },
    ],
    result: {
      docNo: "KREA-부동산공시처-2026-041",
      docTitle: "2026년 표준지 공시지가 이의신청(12건) 검토 보고서",
      summary: [
        "접수 12건 중 10건은 인근 표준지 가격 균형 범위 내 — 원안 유지 의견",
        "변동률 ±8% 초과 2필지는 현장 재조사 대상으로 분류 (3월 2주 일정 배정 제안)",
        "재조사 대상 신청인에게 처리 기한 연장 중간통지 발송 필요",
      ],
      metrics: [
        { label: "처리 신청", value: "12건" },
        { label: "개인정보 마스킹", value: "24건" },
        { label: "릴레이 에이전트", value: "4개" },
        { label: "총 소요", value: "약 12초" },
      ],
    },
  },
  // 시나리오 2 — 시장관리: 주간 신고분 검증 요청 1건이 실거래 조회→괴리 분석→법령 대조→선별 보고서를 릴레이
  // (첨부 없는 데이터 트리거형 — sampleAnswers 실거래 답변과 같은 세계관: 신고 1,842건·의심 8건)
  {
    title: "실거래 신고 이상거래 검증",
    brief: "주간 신고분 검증 요청 1건이 실거래 조회 → 괴리 분석 → 법령 대조 → 정밀조사 선별 보고서로 자동 릴레이됩니다.",
    request: "이번 주 접수된 수도권 아파트 실거래 신고 건을 검증해줘. 시세 대비 괴리가 큰 거래를 찾아서 거래신고법 위반 소지를 확인하고 정밀조사 대상 선별 보고서까지 만들어줘.",
    stages: [
      {
        agentId: "agent-dbquery", ms: 2800,
        task: "RTMS(부동산거래관리시스템)에서 주간 신고분과 비교 시세를 조회합니다.",
        logs: [
          "Text2SQL 변환 — 주간 신고분·비교 시세 집계 쿼리 생성",
          "RTMS 신고 DB 조회 — 금주 아파트 신고 1,842건",
          "동일 단지·면적대 12개월 거래 대조 — 비교 시세 1,796건 산출",
          "시세 산출 불가 46건 별도 분류 (신축·거래 희소 단지)",
        ],
        output: {
          label: "실거래 조회 결과",
          items: [
            "금주 신고 1,842건 중 1,796건 비교 시세 확보",
            "시세 산출 불가 46건은 감정평가 참조 대기로 분류",
          ],
        },
        handoff: "신고·비교 시세 데이터셋을 데이터 분석 에이전트로 전달",
      },
      {
        agentId: "agent-dataanalysis", ms: 3200,
        task: "시세 괴리율 분포를 분석하고 이상 거래 패턴을 탐지합니다.",
        logs: [
          "괴리율 분포 분석 — 평균 ±4.2% · 표준편차 3.1%p",
          "고가 괴리(+30% 초과) 3건 · 저가 괴리(-30% 미만) 4건 식별",
          "패턴 탐지 — 동일 법인 간 반복 거래 1건 · 특수관계 의심 2건",
          "해제 후 재신고 이력 대조 — 신고가 띄우기 의심 1건",
        ],
        output: {
          label: "이상 탐지 결과",
          items: [
            "의심 거래 8건 선별 (고가 3 · 저가 4 · 반복 거래 1)",
            "우선순위 점수화 — 상위 3건 즉시 조사 권고",
          ],
          factors: [
            { label: "비교 시세 괴리도", pct: 58 },
            { label: "해제 후 재신고 이력", pct: 27 },
            { label: "법인 간 반복 거래", pct: 15 },
          ],
        },
        handoff: "의심 거래 8건과 판정 근거를 규정 조회 에이전트로 전달",
      },
      {
        agentId: "agent-internalreg", ms: 2400,
        task: "거래신고법과 이상거래 조사 매뉴얼로 조사 착수 요건을 대조합니다.",
        logs: [
          "부동산 거래신고 등에 관한 법률 제6조(조사 권한)·시행령 대조",
          "이상거래 조사 매뉴얼 v4 — 조사 대상 요건 8건 전건 충족",
          "저가 직거래 4건 — 편법 증여 의심 유형(매뉴얼 §3-2) 해당",
          "관계기관 통보 요건 검토 — 국세청 통보 대상 2건",
        ],
        output: {
          label: "규정 대조 결과",
          items: [
            "8건 전건 정밀조사 착수 요건 충족",
            "2건은 조사 완료 후 관계기관 통보 대상으로 분류",
          ],
        },
        handoff: "조사 요건 판정 결과를 보고서 작성 에이전트로 전달",
      },
      {
        agentId: "agent-report", ms: 3000,
        task: "선별 근거를 정밀조사 대상 선별 보고서 표준 양식으로 작성합니다.",
        logs: [
          "정밀조사 선별 보고서 템플릿 로드 (시장관리 양식)",
          "거래별 조사 착안 사항 작성 — 8건",
          "문서번호 채번 — KREA-시장관리-2026-057",
          "결재선 자동 지정 — 담당 → 부장 → 처장",
        ],
        output: {
          label: "보고서 생성",
          items: ["선별 보고서 1건 생성 (8건 · 괴리율 산출표 첨부)"],
        },
        review: "정밀조사 착수와 관계기관 통보는 시장관리 담당자 검토 후 시행됩니다 (보고서는 선별 의견 단계).",
        handoff: null,
      },
    ],
    result: {
      docNo: "KREA-시장관리-2026-057",
      docTitle: "주간 실거래 신고 이상거래(8건) 정밀조사 선별 보고서",
      summary: [
        "금주 신고 1,842건 자동 검증 — 의심 거래 8건 선별 (선별률 0.43%)",
        "신고가 띄우기 의심 1건은 해제 이력 증빙 확보 — 즉시 조사 착수 권고",
        "저가 직거래 4건 중 2건은 조사 후 국세청 통보 요건 해당",
      ],
      metrics: [
        { label: "검증 신고", value: "1,842건" },
        { label: "의심 거래", value: "8건" },
        { label: "릴레이 에이전트", value: "4개" },
        { label: "총 소요", value: "약 11초" },
      ],
    },
  },
  ],
  // 에이전트 카탈로그 오버라이드 없음 (constants.js의 AGENT_TEAMS 원본 사용)
  agentCatalog: {},

  /* ── 상황실 교대 인계 ──
     공시가격 열람·이의신청 기간에는 상황실을 교대로 운영한다.
     제조의 3교대와 형태는 같지만 다루는 것이 설비가 아니라 접수·조사 건이라
     항목 라벨을 그에 맞게 덮는다(코어 라벨은 중립). */
  shiftHandover: {
    title: "상황실 교대 인계",
    hint: "접수 급증·조사 지연·미결 건을 모아 다음 근무조에 넘깁니다",
    itemLabels: {
      alarm:   "긴급·이례 상황",
      action:  "처리 완료",
      pending: "인계 사항(미결)",
      quality: "조사 품질 특이사항",
    },
    shifts: [
      { id: "A", label: "오전조", time: "09:00–14:00" },
      { id: "B", label: "오후조", time: "14:00–19:00" },
      { id: "C", label: "야간 당직", time: "19:00–09:00" },
    ],
    currentId: "B",
    previous: {
      shiftId: "A", author: "박지현 부장", time: "14:05",
      items: [
        { type: "alarm",   text: "강남구 이의신청 오전 접수 47건 — 평시 대비 3배. 상업지 재개발 구역 집중(도곡동 946 일대)" },
        { type: "action",  text: "이의신청 서류 일괄 처리 시나리오로 오전 접수분 38건 분류 완료 — 재조사 대상 9건 선별(KREA-부동산평가처-2026-041)" },
        { type: "pending", text: "재조사 9건 중 4건 현장 재확인 미배정 — 오후조에서 권역 담당 배정 필요" },
        { type: "pending", text: "RTMS 3월 신고 정정분 반영으로 주간 집계가 1,842 → 1,851건으로 재마감됨. 오전 보고서 수치와 불일치하니 인용 시 주의" },
        { type: "quality", text: "위탁 조사기관 B사 제출 조사표 12건에서 이용상황 기재 누락 — 반려 후 재제출 요청함" },
      ],
    },
    draftSeed: {
      alarms: [
        "실거래 괴리율 30% 초과 신고 8건 — 정밀조사 선별 기준 초과 상태 지속",
      ],
      actions: [
        "이의신청 접수분 중 단순 문의 21건 안내 회신 완료 (재조사 대상 아님)",
        "표준지 현장실사 배정표 오류 3건 정정 — 권역 중복 배정 해소",
      ],
      pending: [
        "재조사 9건 현장 확인 — 야간 당직에서 익일 배정표 반영 필요",
        "위탁 조사기관 B사 재제출분 도착 시 조사표 검수 재실시",
      ],
      quality: [
        "금일 조사표 반려율 4.2% — 전일 대비 1.1%p 상승, 기재 누락이 주 사유",
      ],
    },
    note: "확정하면 다음 근무조의 '받은 인계'로 넘어갑니다. 실서비스에서는 공시업무시스템 일일 마감과 연동됩니다.",
  },

  /* ── 조치 지시 추적 ──
     이의신청·정밀조사가 문서 발행으로 끝나면 "그래서 처리됐나"에 답할 수 없다.
     발행 → 착수 → 완료 → 검증까지 상태로 따라간다. */
  workOrderSeed: [
    { docNo: "KREA-부동산평가처-2026-041", title: "이의신청 재조사 9건 현장 재확인",
      source: "이의신청 일괄 처리 시나리오", owner: "부동산평가처 김민준", due: "2026-04-05",
      status: "작업중", updatedAt: "2026-03-31 11:20",
      history: [
        { status: "발행", at: "2026-03-31 09:40", by: "AI 자동 발행" },
        { status: "작업중", at: "2026-03-31 11:20", by: "부동산평가처 김민준" },
      ] },
    { docNo: "KREA-시장관리-2026-057", title: "실거래 의심 8건 정밀조사 착수",
      source: "이상거래 검증 시나리오", owner: "부동산통계처 이수진", due: "2026-04-12",
      status: "발행", updatedAt: "2026-03-30 16:50",
      history: [{ status: "발행", at: "2026-03-30 16:50", by: "AI 자동 발행" }] },
    { docNo: "KREA-부동산평가처-2026-036", title: "위탁 조사기관 B사 조사표 재검수",
      source: "조사표 품질 점검", owner: "부동산평가처 박지현", due: "2026-03-27",
      status: "완료", updatedAt: "2026-03-27 15:30",
      history: [
        { status: "발행", at: "2026-03-25 10:10", by: "부동산평가처 박지현" },
        { status: "작업중", at: "2026-03-26 09:20", by: "부동산평가처 박지현" },
        { status: "완료", at: "2026-03-27 15:30", by: "부동산평가처 박지현" },
      ] },
    { docNo: "KREA-부동산평가처-2026-029", title: "표준지 현장실사 안전 위험성평가 재실시(산지·경사지)",
      source: "안전 정기 점검", owner: "부동산평가처 이상호", due: "2026-03-22",
      status: "검증완료", updatedAt: "2026-03-24 10:00",
      history: [
        { status: "발행", at: "2026-03-20 08:30", by: "부동산평가처 이상호" },
        { status: "작업중", at: "2026-03-21 13:40", by: "부동산평가처 이상호" },
        { status: "완료", at: "2026-03-22 17:10", by: "부동산평가처 이상호" },
        { status: "검증완료", at: "2026-03-24 10:00", by: "경영지원처 안전 담당" },
      ] },
  ],
  workOrderNote: "자동화 시나리오가 문서를 발행하면 여기에 자동 등록됩니다. 실서비스에서는 공시업무시스템 조사지시·전자결재와 양방향 연동됩니다.",

  /* ── 코드 스캔 ──
     현장조사자는 장갑·우천 상황에서 지번을 타이핑하기 어렵다.
     배정표·접수증에 인쇄된 코드를 찍으면 해당 업무로 바로 들어간다. */
  scanLabel: "필지·접수증 코드 스캔",
  scanRegistry: [
    { code: "KREA-2026-041", type: "order", label: "이의신청 재조사 지시 — 진행 상황 확인",
      agentId: "orchestration:0" },
    { code: "PNU-1168010600", type: "equip", label: "도곡동 946-1 표준지 — 대장 조회",
      agentId: "agent-dbquery" },
    { code: "OBJ-2026-0318", type: "lot", label: "이의신청 접수증 0318 — 서류 일괄 처리",
      agentId: "orchestration:0" },
    { code: "RTMS-W12", type: "material", label: "3월 4주 실거래 신고분 — 이상거래 검증",
      agentId: "orchestration:1" },
    { code: "SVY-A-2026", type: "equip", label: "권역 A 조사 배정표 — 현장조사 안전관리계획",
      agentId: "agent-safety" },
  ],

  /* ── 관리자 콘텐츠 오버라이드 (adminContent) ──
     mocks.js의 대부분은 이미 부동산원 기준이라 오버라이드가 필요 없다.
     여기 있는 것은 '나중에 추가된 관리자 페이지'들 — 코어 기본값을 일부러
     도메인 중립으로 둔 자리다(다른 발주처에 공시 업무가 새지 않도록).
     그래서 공공 세계관은 이 팩이 직접 공급한다.
     대상: 망분리 보안 / 예측 모델 운영 / 데이터 카탈로그·리니지 /
           지식 증강 전략 / 중대재해처벌법 / 답변 재현성 */
  adminContent: {
    /* ── 망분리 보안 아키텍처 ── */
    MOCK_DATA_FLOWS: [
      { id: 'df-1', name: '공시 지침·업무 매뉴얼 RAG 검색', source: '문서관리시스템', zone: '내부망', processedAt: '내부 GPU 서버', dest: '내부망 사용자', crossing: false, dataClass: '내부', volume: '일 9,600건', encryption: '전송 TLS 1.3 · 저장 AES-256', status: '정상' },
      { id: 'df-2', name: '실거래 신고 자료 조회(RTMS 연계)', source: 'RTMS 연계 DB', zone: '내부망', processedAt: '내부 분석 서버', dest: '내부망 사용자', crossing: false, dataClass: '대외비', volume: '주 1,842건', encryption: '전송 TLS 1.3 · 저장 AES-256 · 당사자 식별정보 분리보관', status: '정상' },
      { id: 'df-3', name: '현장조사 사진·조서 OCR', source: '조사자 업로드', zone: '내부망', processedAt: '내부 OCR 엔진', dest: '내부 스토리지', crossing: false, dataClass: '내부', volume: '일 320건', encryption: '전송 TLS 1.3 · 저장 AES-256', status: '정상' },
      { id: 'df-4', name: '플래그십 모델 질의(보안 게이트웨이 경유)', source: '사용자 질의', zone: '내부망', processedAt: '외부 상용 LLM', dest: '내부망 사용자', crossing: true, dataClass: '공개', volume: '일 640건', encryption: '전송 TLS 1.3 · 지번·성명·거래금액 마스킹 후 전송', status: '통제 중' },
      { id: 'df-5', name: '공시가격 열람 공표자료 반출', source: '내부 산정 결과', zone: '내부망', processedAt: '반출 검증 서버', dest: '대국민 공시 시스템', crossing: true, dataClass: '공개', volume: '연 2회 배치', encryption: '단방향 반출 · 승인 이력 필수', status: '통제 중' },
    ],
    MOCK_BOUNDARY_POLICY: [
      { grade: '기밀',   label: 'C', internal: '허용', gateway: '차단',   external: '차단', note: '공시가격 확정 전 산정 내역 — 공표 전 유출 시 시장 영향. 내부 GPU에서만 처리' },
      { grade: '대외비', label: 'S', internal: '허용', gateway: '조건부', external: '차단', note: '실거래 신고 당사자 정보 — 마스킹 후에만 게이트웨이 경유, 승인 이력 필수' },
      { grade: '내부',   label: 'I', internal: '허용', gateway: '허용',   external: '차단', note: '조사 지침·업무 매뉴얼. 외부 직접 전송은 불가' },
      { grade: '공개',   label: 'O', internal: '허용', gateway: '허용',   external: '허용', note: '공표 완료된 공시가격·통계. 제한 없음' },
    ],
    MOCK_EXTERNAL_ACCESS: [
      { id: 'ex-1', org: '서울특별시 강남구', user: '지자체 담당자 1', scope: '관할 표준지 조사 결과 열람', grade: '내부', expires: '2026-06-30', mfa: true, lastAccess: '2026-03-31 09:40', status: '활성' },
      { id: 'ex-2', org: '감정평가법인 A', user: '조사 위탁 평가사 1', scope: '배정 필지 조사표 입력', grade: '내부', expires: '2026-09-30', mfa: true, lastAccess: '2026-03-31 14:12', status: '활성' },
      { id: 'ex-3', org: '국토교통부', user: '정책 담당자 1', scope: '집계 통계 열람(개별 필지 불가)', grade: '공개', expires: '2026-12-31', mfa: true, lastAccess: '2026-03-29 11:05', status: '활성' },
      { id: 'ex-4', org: '감정평가법인 B', user: '조사 위탁 평가사 2', scope: '배정 필지 조사표 입력', grade: '내부', expires: '2026-02-28', mfa: false, lastAccess: '2026-02-26 17:30', status: '만료' },
    ],

    /* ── 예측 모델 운영(MLOps) ── */
    MOCK_PRED_MODELS: [
      { id: 'pm-1', name: '실거래 이상거래 탐지 모델', task: '이진분류', version: 'v2.3', deployed: '2026-01-15',
        metricName: 'AUC', baseline: 0.89, current: 0.87, threshold: 0.82, status: '정상',
        samples: '주 1,842건', owner: '부동산통계처', nextRetrain: '2026-04-15' },
      { id: 'pm-2', name: '공시가격 변동률 예측 모델', task: '회귀', version: 'v1.8', deployed: '2025-11-02',
        metricName: 'MAE(%p)', baseline: 0.62, current: 0.94, threshold: 0.90, status: '주의',
        samples: '월 3,200필지', owner: '부동산평가처', nextRetrain: '재학습 검토 중' },
    ],
    MOCK_PRED_TREND: [
      { month: '2025.10', '실거래 이상거래 탐지 모델': 0.89, '공시가격 변동률 예측 모델': 0.62 },
      { month: '2025.12', '실거래 이상거래 탐지 모델': 0.89, '공시가격 변동률 예측 모델': 0.71 },
      { month: '2026.02', '실거래 이상거래 탐지 모델': 0.88, '공시가격 변동률 예측 모델': 0.85 },
      { month: '2026.03', '실거래 이상거래 탐지 모델': 0.87, '공시가격 변동률 예측 모델': 0.94 },
    ],
    MOCK_PRED_DRIFT: [
      { feature: '거래 유형 구성비', psi: 0.31, level: '주의', note: '직거래·법인 매수 비중 증가로 분포 이동' },
      { feature: '지역별 거래량 분포', psi: 0.24, level: '주의', note: '수도권 외곽 거래 감소 · 학습 시점과 상이' },
      { feature: '신고 지연일수', psi: 0.09, level: '정상', note: '유의미한 변화 없음' },
      { feature: '토지 이용 상황', psi: 0.06, level: '정상', note: '유의미한 변화 없음' },
    ],
    MOCK_RETRAIN_RUNS: [
      { id: 'rt-1', model: '공시가격 변동률 예측 모델', trigger: '성능 임계 초과', started: '2026-03-28 02:00',
        champion: 0.94, challenger: 0.68, verdict: '승격 대기', note: '검증셋 개선 확인. 공시 산정에 직접 쓰이므로 담당 평가사 검토 후 배포' },
      { id: 'rt-2', model: '실거래 이상거래 탐지 모델', trigger: '정기(분기)', started: '2026-01-15 02:00',
        champion: 0.86, challenger: 0.89, verdict: '승격 완료', note: 'v2.3으로 배포됨 · 정밀조사 선별 정확도 개선' },
    ],

    /* ── 데이터 카탈로그 · 리니지 ── */
    MOCK_DATA_ASSETS: [
      { id: 'as-1', name: '공시 조사지침·업무 매뉴얼', source: '문서관리시스템', owner: '부동산공시처', grade: '내부',
        format: 'PDF·HWP', volume: '문서 1,240건', cycle: '연 1회 개정', freshness: '2일 전', quality: 94, standardized: 100,
        tags: ['RAG 대상', '규정'], consumers: ['지식 검색', '내규 조회', '문서 검토'] },
      { id: 'as-2', name: '실거래 신고 자료(RTMS)', source: 'RTMS 연계 DB', owner: '부동산통계처', grade: '대외비',
        format: '관계형 테이블', volume: '주 1,842행', cycle: '일 1회', freshness: '6시간 전', quality: 91, standardized: 82,
        tags: ['TAG 대상', '이상탐지'], consumers: ['부동산 대장 조회', '공정 데이터 분석', '보고서 작성'] },
      { id: 'as-3', name: '표준지 조사표·현장 사진', source: '조사자 업로드', owner: '부동산평가처', grade: '내부',
        format: '이미지·조사표', volume: '연 58,000건', cycle: '연 1회 집중', freshness: '1일 전', quality: 76, standardized: 51,
        tags: ['OCR 대상'], consumers: ['문서 인식(OCR)', '주소 표준화'] },
      { id: 'as-4', name: '공시가격 산정 이력', source: '공시 산정 시스템', owner: '부동산공시처', grade: '기밀',
        format: '관계형 테이블', volume: '연 3,200만 필지', cycle: '연 1회 확정', freshness: '공표 전', quality: 97, standardized: 96,
        tags: ['TAG 대상', '공표 전 통제'], consumers: ['부동산 대장 조회(권한 제한)'] },
    ],
    MOCK_DATA_LINEAGE: {
      'as-1': { upstream: [{ name: '국토교통부 지침 원본', type: '문서' }, { name: '개정 이력 대장', type: '문서' }],
        stages: [{ name: '수집', desc: '문서관리시스템 연동 수집', tool: '커넥터' },
                 { name: '청킹', desc: '조항 단위 분할(512토큰)', tool: 'RAG 파이프라인' },
                 { name: '임베딩', desc: '벡터 생성·색인', tool: '임베딩 엔진' }],
        downstream: [{ name: '지식 검색 에이전트', type: '에이전트' }, { name: '내규 조회 에이전트', type: '에이전트' }] },
      'as-2': { upstream: [{ name: '시군구 신고 접수', type: '외부 시스템' }, { name: '등기 전산자료', type: 'DB' }],
        stages: [{ name: '연계 수집', desc: '일 1회 RTMS 배치 연계', tool: 'ETL' },
                 { name: '주소 표준화', desc: 'PNU·법정동 코드 정규화', tool: '기준정보 사전' },
                 { name: '이상 점수 산출', desc: '괴리율·패턴 피처 생성', tool: '이상탐지 모델' },
                 { name: '적재', desc: '분석 DB 적재', tool: '분석 DB' }],
        downstream: [{ name: '부동산 대장 조회', type: '에이전트' }, { name: '이상거래 검증 시나리오', type: '오케스트레이션' }] },
      'as-3': { upstream: [{ name: '현장 촬영 원본', type: '이미지' }, { name: '수기 조사표', type: '문서' }],
        stages: [{ name: '전처리', desc: '기울기·노이즈 보정', tool: '이미지 전처리' },
                 { name: 'OCR', desc: '조사표 항목·표 인식', tool: 'Vision OCR' },
                 { name: '주소 매칭', desc: '지번→PNU 매칭', tool: '주소 표준화' }],
        downstream: [{ name: '문서 인식(OCR) 에이전트', type: '에이전트' }, { name: '주소 표준화 에이전트', type: '에이전트' }] },
      'as-4': { upstream: [{ name: '표준지 조사 결과', type: '테이블' }, { name: '시·도 심의 결과', type: '문서' }],
        stages: [{ name: '산정', desc: '비교표준지 기반 가격 산정', tool: '공시 산정 시스템' },
                 { name: '검증', desc: '±30% 재심의 기준 자동 점검', tool: '검증 룰' },
                 { name: '확정', desc: '심의 후 확정·공표 대기', tool: '결재 시스템' }],
        downstream: [{ name: '부동산 대장 조회(권한 제한)', type: '에이전트' }] },
    },

    /* ── 지식 증강 전략 (RAG · CAG · TAG) ── */
    MOCK_AUG_STRATEGIES: [
      { id: 'rag', name: 'RAG', full: 'Retrieval-Augmented Generation', desc: '벡터 검색으로 근거 조항을 찾아 답변',
        targets: ['조사지침·업무 매뉴얼', '가격공시법령'], share: 58, avgLatency: 1240, hitRate: 89, costPer1k: '₩24',
        strength: '지침이 많고 개정이 잦아도 최신 조항으로 대응', caveat: '검색 지연이 있고 조항 청킹 품질에 좌우된다' },
      { id: 'cag', name: 'CAG', full: 'Cache-Augmented Generation', desc: '자주 참조하는 기준을 캐시에 적재해 검색 없이 답변',
        targets: ['공시기준일·이의신청 기간 등 고정 기준'], share: 21, avgLatency: 320, hitRate: 96, costPer1k: '₩11',
        strength: '"공시기준일은 매년 1월 1일" 같은 답이 항상 동일하게 나온다', caveat: '지침이 개정되면 재적재해야 한다' },
      { id: 'tag', name: 'TAG', full: 'Table-Augmented Generation', desc: '자연어를 SQL로 변환해 실거래·공시 데이터를 집계',
        targets: ['실거래 신고 자료', '공시가격 산정 이력'], share: 21, avgLatency: 910, hitRate: 90, costPer1k: '₩18',
        strength: '"강남구 3월 거래량" 같은 수치는 검색이 아니라 집계해야 정확', caveat: 'PNU·법정동 코드가 표준화돼 있어야 한다' },
    ],
    MOCK_AUG_ROUTES: [
      { id: 'rt-1', order: 1, when: '거래량·변동률·괴리율 등 수치 질의', keywords: '건수, 변동률, 괴리율, 추이, 대비', strategy: 'TAG', hits: 1620, enabled: true },
      { id: 'rt-2', order: 2, when: '고정 기준·기한 조회', keywords: '공시기준일, 이의신청 기간, 열람 기간, 제출 기한', strategy: 'CAG', hits: 1480, enabled: true },
      { id: 'rt-3', order: 3, when: '그 외 지침·법령 근거가 필요한 질의', keywords: '(기본 경로)', strategy: 'RAG', hits: 4280, enabled: true },
    ],
    MOCK_CAG_CACHE: [
      { id: 'cc-1', name: '공시 업무 고정 기준 요약', tokens: '38K', loaded: '2026-03-28 02:10', sourceRev: 'v4 (2026-03-27)', status: '최신', hits: 1240 },
      { id: 'cc-2', name: '이의신청 처리 절차', tokens: '24K', loaded: '2026-03-15 02:10', sourceRev: 'v2 (2026-03-14)', status: '최신', hits: 580 },
      { id: 'cc-3', name: '현장조사 12개 확인 항목', tokens: '18K', loaded: '2026-02-20 02:10', sourceRev: 'v7 (2026-03-25)', status: '재적재 필요', hits: 410 },
    ],

    /* ── 중대재해처벌법 대응 (공공기관도 적용 대상 — 현장조사 업무가 핵심 위험) ── */
    MOCK_SAFETY_DUTIES: [
      { id: 'sd-1', clause: '제1호', name: '안전보건 목표·경영방침 설정', status: '이행', evidence: '2026년 안전보건 경영방침 공표', last: '2026-01-05', owner: '경영지원처', auto: false },
      { id: 'sd-2', clause: '제2호', name: '안전보건 전담 조직 구성', status: '이행', evidence: '안전보건 전담 조직 지정서', last: '2026-01-10', owner: '경영지원처', auto: false },
      { id: 'sd-3', clause: '제3호', name: '유해·위험요인 확인·개선 절차', status: '이행', evidence: '현장조사 위험성평가 이력 (플랫폼 자동 축적)', last: '2026-03-28', owner: '부동산평가처', auto: true },
      { id: 'sd-4', clause: '제4호', name: '재해예방 예산 편성·집행', status: '이행', evidence: '2026년 안전 예산 집행 내역', last: '2026-03-20', owner: '경영지원처', auto: false },
      { id: 'sd-5', clause: '제5호', name: '안전보건관리책임자 업무 수행 평가', status: '미이행', evidence: '반기 평가 미실시', last: '2025-12-30', owner: '경영지원처', auto: false },
      { id: 'sd-6', clause: '제6호', name: '안전 담당 인력 배치', status: '이행', evidence: '조사 권역별 안전 담당 지정', last: '2026-02-14', owner: '경영지원처', auto: false },
      { id: 'sd-7', clause: '제7호', name: '종사자 의견 청취 절차', status: '이행', evidence: '현장조사자 의견청취 결과 (플랫폼 자동 축적)', last: '2026-03-25', owner: '부동산평가처', auto: true },
      { id: 'sd-8', clause: '제8호', name: '중대재해 대응 매뉴얼 마련', status: '이행', evidence: '현장조사 비상대응 매뉴얼 v3', last: '2026-02-01', owner: '경영지원처', auto: false },
      { id: 'sd-9', clause: '제9호', name: '도급·위탁 시 안전 확보 기준', status: '주의', evidence: '위탁 감정평가법인 4개사 중 1개사 평가 미실시', last: '2026-03-10', owner: '부동산평가처', auto: false },
    ],
    MOCK_SAFETY_RISK_LOG: [
      { id: 'sr-1', task: '표준지 현장실사 (도심 상업지역)', doc: 'KREA-부동산평가처-2026-041', assessed: '2026-03-28', by: '김민준', risks: 6, actions: 6, status: '조치 완료' },
      { id: 'sr-2', task: '표준지 현장실사 (산지·경사지)', doc: 'KREA-부동산평가처-2026-039', assessed: '2026-03-21', by: '박지현', risks: 7, actions: 5, status: '조치 중' },
      { id: 'sr-3', task: '노후 건축물 외관 조사', doc: 'KREA-부동산평가처-2026-034', assessed: '2026-03-14', by: '김민준', risks: 5, actions: 5, status: '조치 완료' },
      { id: 'sr-4', task: '동절기 현장조사 (한파 대비)', doc: 'KREA-부동산평가처-2026-028', assessed: '2026-02-20', by: '이상호', risks: 4, actions: 4, status: '조치 완료' },
    ],
    MOCK_SAFETY_TRAINING: [
      { id: 'st-1', name: '현장조사 안전 교육 (정기)', target: '조사 담당 직원', done: 128, total: 128, date: '2026-03-05', status: '완료' },
      { id: 'st-2', name: '교통안전·차량 운행 교육', target: '출장 차량 운행자', done: 96, total: 96, date: '2026-02-18', status: '완료' },
      { id: 'st-3', name: '위탁 조사기관 안전 교육', target: '감정평가법인 조사자', done: 38, total: 52, date: '2026-03-22', status: '진행 중' },
      { id: 'st-4', name: '폭염·한파 대응 특별교육', target: '하계·동계 조사 인력', done: 74, total: 128, date: '2026-03-27', status: '진행 중' },
    ],

    /* ── 답변 재현성 (이의신청 대응·감사 대비 5년 보존) ── */
    MOCK_REPRO_SNAPSHOTS: [
      { id: 'sn-1', at: '2026-03-31 14:22', question: '표준지 공시기준일이 언제인가요?',
        strategy: 'CAG', model: 'Llama-3-Korean 70B', modelVer: 'v1.4', kbRev: 'kb-2026.03.27',
        promptVer: 'p-2.1', temp: 0.2, guardrailVer: 'g-1.8', confidence: 96,
        sources: [{ name: '공시 업무 고정 기준 요약', rev: 'v4 (2026-03-27)' }],
        reproducible: true, drift: [] },
      { id: 'sn-2', at: '2026-03-24 10:05', question: '3월 강남구 실거래 신고 건수와 괴리율 알려줘',
        strategy: 'TAG', model: 'Llama-3-Korean 70B', modelVer: 'v1.4', kbRev: 'kb-2026.03.20',
        promptVer: 'p-2.1', temp: 0.1, guardrailVer: 'g-1.8', confidence: 91,
        sources: [{ name: '실거래 신고 자료(RTMS)', rev: '2026-03-24 집계' }],
        reproducible: false, drift: ['RTMS 신고 정정분이 반영되어 3월 집계가 재마감됨 (1,842 → 1,851건)'] },
      { id: 'sn-3', at: '2026-03-18 16:40', question: '이의신청 처리 기한과 절차가 어떻게 되나요?',
        strategy: 'RAG', model: 'Llama-3-Korean 70B', modelVer: 'v1.4', kbRev: 'kb-2026.03.14',
        promptVer: 'p-2.0', temp: 0.2, guardrailVer: 'g-1.7', confidence: 94,
        sources: [{ name: '이의신청 처리 절차', rev: 'v2 (2026-03-14)' }],
        reproducible: false, drift: ['프롬프트 개정 p-2.0 → p-2.1', '가드레일 g-1.7 → g-1.8 (법령 인용 시 조항 명시 강제)'] },
      { id: 'sn-4', at: '2026-02-27 09:18', question: '현장실사 시 의무 확인 항목이 몇 개인가요?',
        strategy: 'RAG', model: 'Llama-3-Korean 70B', modelVer: 'v1.3', kbRev: 'kb-2026.02.20',
        promptVer: 'p-2.0', temp: 0.2, guardrailVer: 'g-1.7', confidence: 89,
        sources: [{ name: '현장조사 12개 확인 항목', rev: 'v6 (2026-02-14)' }],
        reproducible: false, drift: ['모델 교체 v1.3 → v1.4', '지침 개정으로 근거 문서가 v6 → v7로 갱신됨'] },
    ],
    MOCK_REPRO_POLICY: {
      retentionYears: 5,
      captured: '질의·답변·근거 문서 개정본·모델/프롬프트/가드레일 버전·파라미터',
      excluded: '보안 세션(SECURE) 질의 — 무저장 원칙에 따라 스냅샷 대상 아님',
      items: ['질의 원문', '답변 전문', '증강 전략(RAG/CAG/TAG)', '모델·버전', '지식베이스 리비전', '근거 문서 개정본', '프롬프트 버전', 'temperature', '가드레일 버전', '응답 신뢰도'],
    },
  },
};

export default reb;
