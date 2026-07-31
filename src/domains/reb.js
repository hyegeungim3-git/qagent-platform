/**
 * 도메인 팩 — 한국부동산원 (기본)
 * 코어 플랫폼은 이 파일의 스키마만 알고, 조직·업무 내용은 전부 여기서 공급한다.
 */
import { Briefcase, Database, ShieldCheck, Search, Globe, Activity, Map } from "lucide-react";

const reb = {
  id: "reb",
  orgName: "한국부동산원",
  orgShort: "REB",
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
};

export default reb;
