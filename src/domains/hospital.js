/**
 * 도메인 팩 — 의료 (새빛대학교병원, 가상 대학병원)
 * 동일 플랫폼을 의료 도메인(진료·심사·응급운영)에 맞춰 재구성한 데모 프로파일.
 * M1(사용자 포털 완결). agentContent(13종 내부)·adminContent(관리자)는 M2 이관 예정 —
 * 그전까지 에이전트 내부 화면·관리자는 REB 콘텐츠로 폴백된다(알려진 한계).
 */
import {
  Hospital, ClipboardCheck, ShieldCheck, Search, Activity, Map,
  FileText, Lock, Users, HeartPulse, Stethoscope, Database,
} from "lucide-react";

const hospital = {
  id: "hospital",
  orgName: "새빛대학교병원",
  orgShort: "SUH",
  sectorLabel: "의료",                  // 화면 표시용 분야명 (탭·로고·타이틀). 본문 조직명은 orgName 유지
  platformTitle: "새빛대학교병원 AgentQ",
  brandColor: "#0369A1",
  welcome: "새빛대학교병원 의료 생성형 AI 플랫폼에 오신 것을 환영합니다.",
  statusBadge: "시스템 정상 가동 중 · 로컬 LLM · 병원 내부망 전용 · 망분리 적용",
  footerNote: "새빛대학교병원 의료 AI 전환 사업 (EMR·청구심사 연계 데모)",
  userFeatures: [
    "진료지침·심사기준 질의 (RAG)",
    "의무기록·청구서류 OCR 판독",
    "EMR 진료 데이터 자연어 조회",
    "의료 문서 번역 (한/영/중/일)",
  ],
  user: { name: "서지은", dept: "적정진료관리실", title: "책임" },
  workspaces: [
    { id: "ws1", name: "스마트병원 혁신 TF", icon: Hospital, active: true },
    { id: "ws2", name: "적정진료 심사분석반", icon: ClipboardCheck },
    { id: "ws3", name: "의료정보 보안점검 TF", icon: ShieldCheck },
  ],
  llmModels: [
    { id: "m0", name: "Claude Fable 5", shortName: "Fable 5", type: "보안 게이트웨이", context: "400K", security: "high", status: "running", desc: "플래그십 최고 성능 모델 — 의료정보 보안 게이트웨이 경유 (기본값)" },
    { id: "m1", name: "GPT-OSS 120B", shortName: "GPT-OSS", type: "구축형", context: "128K", security: "high", status: "running", desc: "병원 내부망 전용 대형 모델" },
    { id: "m2", name: "Llama-3-Korean 70B", shortName: "Llama-3", type: "구축형", context: "32K", security: "high", status: "running", desc: "의료 에이전트 워크플로우 특화" },
    { id: "m3", name: "EXAONE 3.0 78B", shortName: "EXAONE", type: "구축형", context: "32K", security: "high", status: "running", desc: "진료지침·심사기준 검색(RAG) 특화" },
    { id: "m4", name: "Gemini 2.5 Pro", shortName: "Gemini", type: "API(Cloud)", context: "1M", security: "low", status: "blocked", desc: "미인증 클라우드 모델 — 의료정보 보안 정책으로 차단" },
  ],
  suggestions: [
    { icon: ClipboardCheck, iconBg: "bg-sky-50",     iconColor: "text-sky-600",     title: "심사기준 검색",   query: "입원 진료비 삭감 사유별 심사 기준과 근거기록 요건을 알려줘" },
    { icon: Activity,       iconBg: "bg-rose-50",    iconColor: "text-rose-600",    title: "응급실 현황",     query: "지금 응급실 병상 가동률과 포화 경보 기준을 알려줘" },
    { icon: Users,          iconBg: "bg-violet-50",  iconColor: "text-violet-600",  title: "근무규정 확인",   query: "의료진 당직 근무 규정과 연속근무 제한 기준을 정리해줘" },
    { icon: Map,            iconBg: "bg-cyan-50",    iconColor: "text-cyan-700",    title: "센터별 가동률 지도", query: "센터별 병상 가동률 현황을 지도로 분석해줘" },
  ],
  modeDesc: {
    GENERAL: "진료지침, 심사기준, 원내 규정·업무 절차에 대해 자유롭게 질문하세요",
  },
  sampleAnswers: [
    {
      // 응급 답변을 먼저 — suggestions[1] 질의가 '기준'을 포함해 심사 답변과 충돌할 수 있어 구체 키워드로 선점
      keywords: ["응급실", "병상 가동률", "포화", "수용곤란"],
      answer: {
        content: "**응급실 병상 운영 현황** (응급의료정보시스템 NEDIS, 실시간 기준)\n\n- **병상 가동률**: **92%** — 포화 경보 기준(90%) **초과**\n- **재실 환자**: 47명 (KTAS 1~2 중증 11명), **입원 대기 9명**\n- **과밀화지수(NEDOCS)**: 178 (100 이상 과밀, 180 이상 심각 과밀 임박)\n\n**포화 경보 기준**\n1. 병상 가동률 90% 이상 **또는** NEDOCS 140 이상 → **코드 오렌지** 발령 검토\n2. 수용곤란 통보(응급의료법)는 **중증 병상·배후진료 동시 불가** 시 응급의료센터장 승인으로 발령\n\n에이전트 탭의 **'응급실 포화 경보 대응'** 시나리오를 실행하면 재실·병상 조회 → 과밀도 분석 → 수용곤란 요건 대조 → 대책본부 상황보고까지 자동으로 처리됩니다.\n\n※ 출처: 응급의료정보시스템(NEDIS), 응급의료에 관한 법률(수용곤란 고지), 원내 과밀화 대응 매뉴얼",
        citations: [], steps: null,
        confidence: 92,
        xai: {
          queryRewrite: "응급실 병상 가동률 포화 경보 기준 수용곤란",
          base: { rag: 90, model: 10 },
          sources: [
            { name: "응급의료정보시스템 NEDIS (실시간)", similarity: 96 },
            { name: "원내 과밀화 대응 매뉴얼", similarity: 90 },
            { name: "응급의료에 관한 법률 — 수용곤란 고지", similarity: 84 },
          ],
          rejected: [
            { name: "일반병동 병상 배정 지침", similarity: 55, reason: "응급 병상이 아닌 입원 병동 대상 — 포화 판정과 무관" },
          ],
          reasoning: "실시간 NEDIS 계측(가동률·NEDOCS)을 1순위 근거로 사용했습니다. 코드 오렌지를 '검토'로 둔 것은 발령이 센터장 승인 사항이기 때문이며, 재실·대기 수치는 순간값이라 추세와 함께 봐야 합니다.",
        },
      },
    },
    {
      keywords: ["삭감", "심사청구", "급여기준", "청구"],
      answer: {
        content: "**입원 진료비 삭감위험 사전점검** (청구심사시스템 EDI · 심사기준 DB, 금주 청구분)\n\n- **청구 접수**: 입원 **342건** — 상병(KCD)·수가코드 표준화 완료\n- **삭감 위험 의심**: **18건** (근거기록 미비 7 · 급여기준 초과 6 · 중복청구 5)\n\n**대표 유형**: 상급병실료 청구 중 의학적 필요성 기록이 미비한 건 — 심평원 심사기준상 **삭감 개연성 높음** → 진료과 근거기록 보완 요청 대상\n\n**처리 기준**\n1. 근거기록 미비 건은 **청구 전 진료과 보완** 요청(사후 이의신청보다 삭감률 낮음)\n2. 급여기준 초과 건은 산정특례·심사 예외 해당 여부 확인 후 재산정\n\n에이전트 탭의 **'입원 진료비 삭감위험 사전점검'** 시나리오를 실행하면 청구 서류 판독 → 코드 표준화 → 심사기준 대조 → 점검 보고서까지 자동으로 처리됩니다.\n\n※ 출처: 청구심사시스템(EDI), 건강보험 요양급여 심사기준, 원내 삭감사례 DB",
        citations: [], steps: null,
        confidence: 90,
        xai: {
          queryRewrite: "입원 진료비 삭감 위험 심사 기준 근거기록",
          base: { rag: 87, model: 13 },
          sources: [
            { name: "건강보험 요양급여 심사기준", similarity: 95 },
            { name: "원내 삭감사례 DB (최근 12개월)", similarity: 91 },
            { name: "청구심사시스템 EDI 금주 청구분", similarity: 88 },
          ],
          rejected: [
            { name: "외래 처방 급여기준", similarity: 52, reason: "입원 청구 점검 대상 — 외래 기준은 이 건과 무관" },
          ],
          reasoning: "심사기준과 원내 삭감사례의 유형 일치도가 가장 큰 선별 근거입니다. '청구 전 보완'을 권고한 것은 사후 이의신청보다 삭감률이 낮다는 원내 통계에 근거하며, 18건은 자동 선별이라 진료과 확인이 필요합니다.",
        },
      },
    },
    {
      keywords: ["당직", "연속근무", "근무 규정", "복무"],
      answer: {
        content: "**의료진 당직·연속근무 기준** (새빛대학교병원 취업규칙 제38조, 전공의법 연동)\n\n- **연속근무 제한**: 전공의 **최대 연속 36시간**(응급 시 40시간), 초과 시 사전 승인 필요\n- **주당 근무**: 평균 **80시간 이내**(4주 평균), 당직 후 최소 휴게 보장\n- **당직 편성**: 진료과장이 월 단위로 편성, 근무표는 근무 개시 7일 전 확정\n\n연속근무 초과가 예상되면 진료과장·수련교육부에 사전 통보하고 대체 인력을 배정합니다.\n\n※ 출처: 새빛대학교병원 취업규칙 제38조, 전공의의 수련환경 개선 및 지위 향상을 위한 법률",
        citations: [], steps: null,
        confidence: 95,
        xai: {
          sources: [
            { name: "새빛대학교병원_취업규칙(2025개정).hwp", similarity: 97 },
            { name: "전공의 수련환경 개선법", similarity: 90 },
          ],
        },
      },
    },
  ],
  // 지도 인텔리전스 — 센터별 병상 가동률 히트맵 (시뮬레이션). 응급의료센터 값이 liveMetric과 한 원장.
  mapIntel: {
    metricLabel: "센터별 병상 가동률",
    unit: "%",
    regionUnit: "센터",
    periodLabel: "2026년 7월 2주차 기준",
    sourceSystem: "EMR 병상관리 시스템",
    sourceNote: "※ 출처: EMR 병상관리 · 응급의료정보시스템(NEDIS) 집계 (시뮬레이션 데이터)",
    mapTitle: "원내 센터별 히트맵",
    chartTitle: "월별 가동률 추이",
    metricKeywords: ["병상 가동률", "가동률", "병상 현황"],
    wideKeywords: ["센터별", "전체 센터", "원내", "지도"],
    heatLow: "#E0F2FE", heatHigh: "#0C4A6E",
    avgLabel: "전체 센터 평균",
    seriesLabels: ["2월", "3월", "4월", "5월", "6월", "7월"],
    avgSeries: [79.2, 80.1, 81.0, 80.4, 81.6, 82.3],
    grid: { cols: 3, rows: 3 },
    regions: [
      { id: "er",      name: "응급의료센터",   keywords: ["응급의료센터"],           x: 1, y: 0, value: 92.4, series: [86.1, 87.9, 89.2, 88.4, 90.7, 92.4], insight: "여름철 온열질환·교통사고 유입 증가로 6주 연속 상승, 포화 경보(90%)를 2주째 초과하고 있습니다." },
      { id: "trauma",  name: "권역외상센터",   keywords: ["권역외상센터", "외상센터"], x: 2, y: 0, value: 88.1, series: [83.5, 84.8, 85.9, 86.2, 87.4, 88.1], insight: "중증외상 이송 협약 확대로 재실 기간이 길어지며 가동률이 꾸준히 상승 중입니다." },
      { id: "cancer",  name: "암센터",         keywords: ["암센터"],                 x: 0, y: 0, value: 85.3, series: [84.0, 84.6, 85.1, 84.7, 85.0, 85.3], insight: "항암 주기 입원이 안정적으로 예약 운영되어 편차가 작습니다." },
      { id: "cardio",  name: "심장뇌혈관센터", keywords: ["심장뇌혈관센터", "심장센터"], x: 1, y: 1, value: 89.6, series: [85.2, 86.4, 87.5, 88.0, 88.9, 89.6], insight: "시술 건수 증가와 중환자실 연계 수요로 응급의료센터에 이어 두 번째로 높은 가동률입니다." },
      { id: "peds",    name: "소아청소년센터", keywords: ["소아청소년센터", "소아센터"], x: 2, y: 1, value: 71.8, series: [74.1, 73.2, 72.6, 71.9, 72.0, 71.8], insight: "계절성 호흡기 감소 구간으로 여유 병상이 있어, 전원 조정 시 우선 수용 대상입니다." },
      { id: "women",   name: "여성·모아센터",  keywords: ["여성센터", "모아센터"],     x: 0, y: 1, value: 78.4, series: [77.0, 77.8, 78.1, 77.5, 78.2, 78.4], insight: "분만·신생아 입원이 안정적으로 유지되며 특이 동향은 없습니다." },
      { id: "transp",  name: "장기이식센터",   keywords: ["장기이식센터"],           x: 0, y: 2, value: 83.2, series: [80.4, 81.2, 82.0, 82.5, 82.9, 83.2], insight: "이식 대기·추적 입원이 늘며 완만한 상승세를 보이고 있습니다." },
      { id: "rehab",   name: "재활의학센터",   keywords: ["재활의학센터", "재활센터"], x: 1, y: 2, value: 68.9, series: [71.5, 70.8, 70.1, 69.4, 69.0, 68.9], insight: "장기재활 퇴원 연계가 원활해 가동률이 낮은 편으로, 전실 여유가 가장 큽니다." },
      { id: "general", name: "일반병동",       keywords: ["일반병동"],               x: 2, y: 2, value: 81.0, series: [79.6, 80.0, 80.7, 80.2, 80.8, 81.0], insight: "다과 혼합 입원으로 평균 수준을 유지하며 계절 요인 외 특이점은 없습니다." },
    ],
  },
  // 채팅→에이전트 핸드오프 — GENERAL 답변 아래 '다음 단계' 카드 (선행 규칙 우선, 소문자 키워드)
  agentRouting: [
    { keywords: ["응급", "병상", "포화", "수용곤란"], agentId: "orchestration:1", reason: "재실·병상 조회부터 과밀도 분석·수용곤란 대응 상황보고까지 자동 릴레이로 처리합니다." },
    { keywords: ["삭감", "심사청구", "급여기준"], agentId: "orchestration:0", reason: "청구 서류 판독부터 심사기준 대조·삭감위험 점검 보고서까지 자동 릴레이로 처리합니다." },
    { keywords: ["번역", "영문"], agentId: "agent-translate", reason: "의료 문서 번역 에이전트가 용어집 매칭과 역번역 검증까지 수행합니다." },
    { keywords: ["회의록", "녹음"], agentId: "agent-meeting", reason: "회의 녹음을 발언자 구분 회의록으로 자동 정리합니다." },
    { keywords: ["분석", "추이", "데이터"], agentId: "agent-dataanalysis", reason: "진료 데이터 분석 에이전트가 차트·통계로 심층 분석합니다." },
  ],
  // 알림 센터 + 브리핑. link.agentId 딥링크(orchestration:<idx> 허용) — 대표 사건 수치와 정합
  notifications: [
    { id: "n1", severity: "alert", title: "응급실 포화 경보", body: "응급실 병상 가동률 92% · NEDOCS 178 — 포화 경보(90%) 초과. 수용곤란 대응 시나리오 실행을 권장합니다.", time: "방금", link: { agentId: "orchestration:1" } },
    { id: "n2", severity: "warn", title: "삭감위험 청구 18건 점검 대기", body: "금주 입원 청구 342건 중 삭감 의심 18건 — 진료과 근거기록 보완 요청 전 사전점검이 필요합니다.", time: "08:40", link: { agentId: "orchestration:0" } },
    { id: "n3", severity: "info", title: "적정진료 정례회의 녹음 미처리", body: "2026-07-10 적정진료관리실 정례회의 녹음이 회의록 작성 대기 상태입니다.", time: "어제", link: { agentId: "agent-meeting" } },
  ],
  // 라이브 지표 — 응급실 병상 가동률. 임계 돌파 시 포화 경보 알림 생성. 스키마 정본: user/liveEngine.js
  liveMetric: {
    label: "응급실 병상 가동률", unit: "%", decimals: 1,
    initial: 84.5, min: 62, max: 100, window: 48,
    threshold: 90, thresholdLabel: "포화 경보 90%",
    drift: 0.05, noise: 0.7,
    recovery: { at: 96, to: 80 },
    alert: { severity: "alert", title: "응급실 포화 경보", body: "응급실 병상 가동률 {value}% — 포화 경보(90%) 상향 돌파. 수용곤란 대응 시나리오 실행을 권장합니다.", link: { agentId: "orchestration:1" } },
    source: "응급의료정보시스템(NEDIS) · 1분 주기(시뮬레이션)",
  },
  // 복합 업무 오케스트레이션 — 배열이면 허브에 카드가 시나리오별로 1장씩 노출 (시뮬레이션)
  orchestration: [
  // 시나리오 1 — 서류 트리거형: 청구 서류 1묶음이 OCR→코드 표준화→심사기준 조회→점검 보고서를 릴레이
  {
    title: "입원 진료비 삭감위험 사전점검",
    brief: "청구 서류 1묶음이 OCR → 상병·수가 코드 표준화 → 심사기준 대조 → 삭감위험 점검 보고서로 자동 릴레이됩니다.",
    request: "오늘 마감된 입원 진료비 청구분을 점검해줘. 의무기록에서 근거를 확인하고 상병·수가 코드 표준화해서 심사기준 대조하고 삭감위험 사전점검 보고서까지 만들어줘.",
    attachment: { name: "입원청구_EDI_0712.pdf", pages: 28, size: "16.4 MB" },
    stages: [
      {
        agentId: "agent-ocr", ms: 3200,
        task: "청구 서류·의무기록에서 상병·수가·처치 내역과 근거기록을 추출합니다.",
        logs: [
          "EMR 연동 — 입원 청구 EDI 342건 로드 (표 추출 모드)",
          "의무기록 스캔 판독 · 근거기록 대조 — 평균 신뢰도 96.4%",
          "상병(KCD)·수가코드·처치 내역 정형화 — 4,180행",
          "근거기록 미비 청구 7건 플래그 지정",
        ],
        output: {
          label: "OCR 추출 결과",
          items: [
            "청구 342건 구조화 (상병·수가·처치·근거기록 링크)",
            "상급병실료·고가 처치 등 심사 유의 항목 22건 표시",
          ],
        },
        handoff: "비정형 상병·수가 표기를 코드 표준화 에이전트로 전달",
      },
      {
        agentId: "agent-address", ms: 2400,
        task: "상병(KCD-8)·수가 코드를 표준 코드체계로 정규화합니다.",
        logs: [
          "KCD-8 상병코드 일괄 매칭 — 342건",
          "수가코드(EDI) 정규화 · 구코드 3건 자동 보정",
          "산정특례·특정기호 매핑 확인",
          "심사기준 대조 키(상병·수가·연령) 확보",
        ],
        output: {
          label: "코드 표준화 결과",
          items: [
            "342건 전건 상병·수가 코드 표준화 (자동 보정 3건 포함)",
            "심사기준 DB 조회 키 확보",
          ],
        },
        handoff: "표준 코드를 심사기준 조회 에이전트로 전달",
      },
      {
        agentId: "agent-dbquery", ms: 2800,
        task: "건강보험 심사기준과 원내 삭감사례를 대조해 삭감 위험을 산출합니다.",
        logs: [
          "Text2SQL 변환 — 심사기준·삭감사례 대조 쿼리 생성",
          "건강보험 요양급여 심사기준 조회 — 342건 대조",
          "원내 삭감사례 DB 유사도 매칭 — 최근 12개월",
          "삭감 위험 의심 18건 식별 (근거미비 7·급여초과 6·중복 5)",
        ],
        output: {
          label: "심사기준 대조 결과",
          items: [
            "삭감 위험 18건 선별 — 유형별 분류 완료",
            "청구 전 진료과 근거기록 보완 대상 7건 지정",
          ],
          factors: [
            { label: "근거기록 미비", pct: 44 },
            { label: "급여기준 초과", pct: 33 },
            { label: "중복청구 의심", pct: 23 },
          ],
        },
        handoff: "위험 청구 근거 데이터를 보고서 작성 에이전트로 전달",
      },
      {
        agentId: "agent-report", ms: 3000,
        task: "점검 결과를 삭감위험 사전점검 보고서 표준 양식으로 작성합니다.",
        logs: [
          "삭감위험 점검 보고서 템플릿 로드 (적정진료 QI 양식)",
          "건별 보완 의견 작성 — 18건 (보완 요청 7 · 재산정 6 · 확인 5)",
          "문서번호 채번 — SUH-보험심사팀-2026-071",
          "적정진료관리실 결재선 자동 지정",
        ],
        output: {
          label: "보고서 생성",
          items: ["점검 보고서 1건 생성 (18건 · 유형별 근거·조치 대조표 첨부)"],
        },
        review: "청구 보류·수정·진료과 보완 요청은 보험심사팀장 검토 후 확정됩니다 (보고서는 점검 의견 단계).",
        handoff: null,
      },
    ],
    result: {
      docNo: "SUH-보험심사팀-2026-071",
      docTitle: "입원 진료비 삭감위험 사전점검 보고서 (18건)",
      summary: [
        "금주 입원 청구 342건 자동 점검 — 삭감 위험 18건 선별 (선별률 5.3%)",
        "근거기록 미비 7건은 청구 전 진료과 보완 요청 — 사후 이의신청 대비 삭감률 절감",
        "급여기준 초과 6건은 산정특례·심사 예외 확인 후 재산정 대상",
      ],
      metrics: [
        { label: "점검 청구", value: "342건" },
        { label: "삭감 위험", value: "18건" },
        { label: "릴레이 에이전트", value: "4개" },
        { label: "총 소요", value: "약 11초" },
      ],
    },
  },
  // 시나리오 2 — 이벤트 트리거형(첨부 없음): 응급실 포화 경보 1건이 조회→분석→매뉴얼 대조→상황보고를 릴레이
  {
    title: "응급실 포화 경보 대응",
    brief: "포화 경보 1건이 재실·병상 조회 → 과밀도 분석 → 수용곤란 요건 대조 → 대책 상황보고로 자동 릴레이됩니다.",
    request: "응급실 병상 가동률이 포화 경보 기준을 넘었어. 재실 환자와 병상 현황 확인해서 과밀도 분석하고, 수용곤란 통보 요건 대조해서 응급 과밀 상황보고서까지 만들어줘.",
    stages: [
      {
        agentId: "agent-dbquery", ms: 2600,
        task: "NEDIS·EMR에서 응급실 재실 환자와 병상 현황을 조회합니다.",
        logs: [
          "Text2SQL 변환 — 재실·병상·중증도 집계 쿼리 생성",
          "NEDIS 조회 — 응급실 병상 가동률 92.4% · 재실 47명",
          "중증도(KTAS) 분포 — 1~2등급 11명 · 입원 대기 9명",
          "배후진료(중환자실·수술방) 가용 병상 조회",
        ],
        output: {
          label: "재실·병상 조회 결과",
          items: [
            "병상 가동률 92.4% — 포화 경보(90%) 초과",
            "입원 대기 9명 적체 · 중증 병상 여유 부족",
          ],
        },
        handoff: "재실·병상 시계열을 진료 데이터 분석 에이전트로 전달",
      },
      {
        agentId: "agent-dataanalysis", ms: 3200,
        task: "과밀화지수(NEDOCS)를 산출하고 전실·전원 우선순위를 분석합니다.",
        logs: [
          "NEDOCS 산출 — 178 (100↑ 과밀, 180↑ 심각 과밀 임박)",
          "센터별 여유 병상 스캔 — 소아청소년·재활 여유 확인",
          "재실 체류시간 분석 — 6시간 초과 입원대기 5명",
          "전실 가능 3명 · 전원 조정 대상 2명 선별",
        ],
        output: {
          label: "과밀도 분석 결과",
          items: [
            "NEDOCS 178 — 심각 과밀 임박, 즉시 완화 조치 권고",
            "상급병실 전실 3명 · 타 병원 전원 조정 2명",
          ],
          factors: [
            { label: "입원 대기 적체", pct: 46 },
            { label: "중증환자 병상 점유", pct: 33 },
            { label: "배후진료 지연", pct: 21 },
          ],
        },
        handoff: "포화 지표·완화안을 원내 규정 조회 에이전트로 전달",
      },
      {
        agentId: "agent-internalreg", ms: 2400,
        task: "응급의료 수용곤란 고지 요건과 원내 과밀 대응 매뉴얼을 대조합니다.",
        logs: [
          "응급의료에 관한 법률 — 수용곤란 통보 요건 대조",
          "원내 과밀화 대응 매뉴얼 — 코드 오렌지 발령 기준 확인",
          "가동률 90%↑ + 중증 병상·배후진료 동시 제약 충족",
          "수용곤란 통보 대상 진료권역 확인",
        ],
        output: {
          label: "규정 대조 결과",
          items: [
            "코드 오렌지 발령 요건 충족 — 대책 확대 운영 건의",
            "특정 중증질환 수용곤란 통보 요건 해당",
          ],
        },
        handoff: "발령 요건·조치 현황을 보고서 작성 에이전트로 전달",
      },
      {
        agentId: "agent-report", ms: 2800,
        task: "응급 과밀 상황보고서를 표준 양식으로 작성합니다.",
        logs: [
          "응급 과밀 상황보고 템플릿 로드",
          "현황·분석·조치·계획 4개 절 자동 작성",
          "문서번호 채번 — SUH-응급의료센터-2026-063",
          "응급의료센터장 결재선 자동 지정",
        ],
        output: {
          label: "보고서 생성",
          items: ["상황보고 1보 생성 (병상 현황표·전실/전원 조정안 첨부)"],
        },
        review: "코드 오렌지 발령·수용곤란 통보는 응급의료센터장 승인 사항입니다 (보고서는 건의안 단계).",
        handoff: null,
      },
    ],
    result: {
      docNo: "SUH-응급의료센터-2026-063",
      docTitle: "응급실 과밀 상황보고 제1보 (포화 경보 대응)",
      summary: [
        "병상 가동률 92.4%·NEDOCS 178 — 코드 오렌지 발령 요건 충족, 대책 확대 운영 건의",
        "상급병실 전실 3명·타 병원 전원 조정 2명으로 즉시 완화 — 입원 대기 적체 해소 우선",
        "수용곤란 통보 대상 중증질환 확인 — 센터장 승인 후 진료권역 통보",
      ],
      metrics: [
        { label: "병상 가동률", value: "92.4%" },
        { label: "완화 조치 대상", value: "5명" },
        { label: "릴레이 에이전트", value: "4개" },
        { label: "총 소요", value: "약 11초" },
      ],
    },
  },
  ],
  agentCatalog: {
    "agent-chatbot":      { name: "원내 Q&A 챗봇", shortName: "원내 Q&A", desc: "진료지침·심사기준·원내 규정을 RAG 기반으로 근거와 함께 즉시 답변합니다." },
    "agent-report":       { name: "진료실적 보고 에이전트", shortName: "진료실적 보고", desc: "EMR 실적 데이터를 집계해 주간 진료실적·QI 보고서를 표준 양식으로 자동 작성합니다." },
    "agent-meeting":      { name: "적정진료 회의록 에이전트", shortName: "회의록 작성", desc: "적정진료·의료질 회의 녹음을 발언자 구분과 함께 회의록으로 정리하고 액션 아이템을 추출합니다." },
    "agent-knowledge":    { name: "의학지식 검색 에이전트", shortName: "지식 검색", desc: "진료지침(CP)·최신 논문·약제 정보 등 의학 지식을 시맨틱 검색으로 찾아줍니다." },
    "agent-internalreg":  { name: "원내 규정 조회 에이전트", shortName: "규정 조회", desc: "취업규칙·진료지침·감염관리 규정 등 원내 규정을 조항 단위로 조회합니다." },
    "agent-ocr":          { name: "의무기록 OCR 에이전트", shortName: "의무기록 OCR", desc: "의무기록·청구서류 스캔본을 판독하고 개인정보를 자동 마스킹해 구조화합니다." },
    "agent-dbquery":      { name: "EMR 데이터 조회 에이전트", shortName: "EMR 조회", desc: "자연어로 질문하면 EMR·청구심사 데이터의 진료 실적·병상·청구를 SQL로 변환해 조회합니다." },
    "agent-address":      { name: "상병·수가 코드 표준화 에이전트", shortName: "코드 표준화", desc: "비정형 상병·수가 표기를 KCD·EDI 표준 코드로 매핑·정규화합니다." },
    "agent-dataanalysis": { name: "진료 데이터 분석 에이전트", shortName: "진료 분석", desc: "진료·심사·병상 데이터를 업로드하면 통계 분석과 이상 원인 후보를 시각화합니다." },
    "agent-summary":      { name: "의무기록 요약 에이전트", shortName: "기록 요약", desc: "장문의 의무기록·판독지를 핵심 경과와 함께 구조화 요약합니다." },
    "agent-translate":    { name: "의료 문서 번역 에이전트", shortName: "의료 번역", desc: "진단서·소견서 등 의료 문서를 용어집 기반으로 번역하고 역번역으로 검증합니다." },
    "agent-review":       { name: "기안 사전검토 에이전트", shortName: "기안 검토", desc: "기안문·동의서를 원내 규정·의료법에 비추어 위반 소지를 사전 검토합니다." },
    "agent-safety":       { name: "환자안전 관리계획 에이전트", shortName: "환자안전", desc: "시술·투약 등 진료 과정의 위험 요소를 평가하고 환자안전 관리계획서를 생성합니다." },
  },
  docs: [
    { id: "d1", name: "입원진료비_심사기준서.pdf", size: "3.4 MB", date: "2026.01.10", tags: ["대외비", "DRM 자동해제"], secLevel: "C" },
    { id: "d2", name: "응급의료_과밀화_대응지침.pdf", size: "1.6 MB", date: "2026.01.22", tags: ["OCR 적용"], secLevel: "S" },
    { id: "d3", name: "새빛대학교병원_취업규칙(2025개정).hwp", size: "2.1 MB", date: "2026.02.10", tags: ["사규"], secLevel: "O" },
  ],
  history: [
    { id: "h1", title: "입원 진료비 삭감 심사기준 문의", mode: "GENERAL", time: "14:30", isToday: true, starred: true },
    { id: "h2", title: "영문 진단서 번역", mode: "TRANSLATE", time: "10:15", isToday: true, starred: false },
    { id: "h3", title: "임상시험 동의서 기안 검토", mode: "REVIEW", time: "어제", isToday: false, starred: false },
    { id: "h4", title: "주간 진료실적 보고서 초안", mode: "REPORT", time: "07.09", isToday: false, starred: true },
    { id: "h5", title: "응급실 병상 가동률 현황 확인", mode: "GENERAL", time: "07.08", isToday: false, starred: false },
  ],
  agentFeed: {
    recent: [
      { agentId: "agent-meeting",      agentName: "회의록 작성", time: "오늘 14:32", result: "SUH-회의록-0710.hwp 생성" },
      { agentId: "agent-knowledge",    agentName: "지식 검색",   time: "오늘 10:15", result: "진료지침(CP) 5건 검색" },
      { agentId: "agent-dataanalysis", agentName: "진료 분석",   time: "어제 16:44", result: "삭감위험 유형 추이 분석 완료" },
    ],
    recommendTitle: "적정진료 심사 마감 2일 전",
    recommendBody: "지난 심사 결과와 금주 청구를 대조 검토하여 삭감 위험 청구를 확인하시겠습니까?",
    pendingBody: "2026-07-10 적정진료관리실 정례회의 녹음이 미처리 상태입니다.",
  },
  // SECURE 탭 제안 4종 — 다크 UI 고정 팔레트
  /* ── 결재 상신 전 AI 사전 검수 항목 (docType별) — 의료 문서 기준 ──
     status: 'pass'(자동 체크) | 'warn'(근거 확인 후 사용자가 체크해야 상신 가능) */
  selfChecks: {
    report: [
      { id: 'docnum', label: '문서번호 형식', desc: 'SUH-부서-연도-일련번호 체계 검증', status: 'pass',
        detail: 'SUH-보험심사팀-2026-071 — 형식 정상',
        basis: '문서번호를 원내 문서관리규정의 부여 체계(기관코드-부서코드-연도-일련번호)와 대조한 결과 형식에 부합하며 일련번호 중복이 없습니다.' },
      { id: 'phi', label: '환자 식별정보 비식별', desc: '성명·등록번호·생년월일 등 식별정보 노출 점검', status: 'pass',
        detail: '식별정보 미포함 — 통계·건수 형태로만 기재',
        basis: '의료 문서에서 가장 큰 위험은 환자 식별정보 유출입니다. 본문이 건수·비율 통계로만 구성되어 있고 성명·등록번호가 포함되지 않았음을 확인했습니다.' },
      { id: 'period', label: '집계 기간 명시', desc: '심사 대상 기간과 데이터 마감 시점 기재 여부', status: 'pass',
        detail: '대상 기간 및 마감 시점 표기됨',
        basis: '집계 기간과 마감 시점이 함께 표기되어 재집계 시 동일 수치가 재현됩니다.' },
      { id: 'figures', label: '청구·삭감 수치 정합', desc: '청구 건수와 삭감위험 건수의 합계 일치 여부', status: 'pass',
        detail: '청구 342건 · 삭감위험 18건 — 원장 대조 일치',
        basis: '보고서 수치를 심사 원장 조회 결과와 대조해 청구 건수·삭감위험 건수가 일치함을 확인했습니다.' },
      { id: 'criteria', label: '심사 기준 근거', desc: '급여기준·고시 등 판단 근거 인용 여부', status: 'pass',
        detail: '요양급여 적용기준 인용 확인',
        basis: '삭감위험 판정의 근거가 되는 급여기준이 인용되어 있어 이의신청 대응이 가능합니다.' },
      { id: 'sign', label: '결재선 완성도', desc: '작성자·검토자·승인자 3단 서명 체계 확인', status: 'pass',
        detail: '3단 순차 서명 구조 확인됨',
        basis: '작성자→검토자→승인자 결재선이 빠짐없이 구성되어 있습니다.' },
      { id: 'source', label: '데이터 출처 명시', desc: 'EMR·심사 시스템 등 원천과 조회 시점 표기', status: 'warn',
        detail: '출처(원내 심사 시스템) 미기재 — 하단 표기 권고',
        basis: '수치의 출처 시스템과 조회 시점이 없어 재확인이 어렵습니다. 문서 하단에 출처와 조회 일시를 남기실 것을 권고합니다.' },
    ],
    meeting: [
      { id: 'docnum', label: '문서번호 형식', desc: 'SUH-부서-연도-일련번호 체계 검증', status: 'pass',
        detail: '형식 정상 — 일련번호 중복 없음',
        basis: '회의록 문서번호가 원내 부여 체계에 부합합니다.' },
      { id: 'attend', label: '참석자 정보 완전성', desc: '소속·직위 포함 참석자 명단 기재 여부', status: 'pass',
        detail: '참석자 전원 소속·직위 표기됨',
        basis: '참석자 소속과 직위가 표기되어 후속 조치의 책임 소재가 명확합니다.' },
      { id: 'phi', label: '환자 식별정보 비식별', desc: '증례 논의 시 식별정보 익명 처리 여부', status: 'warn',
        detail: '증례 언급 구간 익명 처리 여부 확인 필요',
        basis: '회의 중 언급된 증례에 환자를 특정할 수 있는 표현이 남아 있는지 확인이 필요합니다. 배포 전 익명 처리 여부를 점검하십시오.' },
      { id: 'decision', label: '안건·결정사항 구분', desc: '논의 경과와 확정 결정사항의 분리 기재', status: 'pass',
        detail: '안건과 결정사항 분리 기재 확인',
        basis: '논의 내용과 확정 사항이 구분되어 있어 무엇이 결정인지 명확합니다.' },
      { id: 'action', label: '액션 아이템 담당·기한', desc: '조치 항목마다 담당과 기한 지정 여부', status: 'pass',
        detail: '액션 항목 전부 담당·기한 지정됨',
        basis: '추출된 조치 항목에 담당자와 기한이 지정되어 이행 점검이 가능합니다.' },
    ],
    safety: [
      { id: 'docnum', label: '문서번호 형식', desc: 'SUH-부서-연도-일련번호 체계 검증', status: 'pass',
        detail: '형식 정상',
        basis: '안전관리계획서 문서번호가 부여 체계에 부합합니다.' },
      { id: 'law', label: '법령·인증 기준 근거', desc: '의료법·환자안전법 등 근거 조항 인용 여부', status: 'pass',
        detail: '환자안전법 근거 인용 확인',
        basis: '환자안전 활동의 법적 근거가 인용되어 있어 인증 심사 대응이 가능합니다.' },
      { id: 'risk', label: '위험요인 평가 완전성', desc: '위험요인별 강도·빈도·저감 대책 기재', status: 'pass',
        detail: '위험요인별 등급·대책 기재 확인',
        basis: '위험요인마다 평가 등급과 구체적 대책이 짝지어져 있습니다.' },
      { id: 'infection', label: '감염관리 조치', desc: '표준주의·격리 등 감염관리 절차 포함 여부', status: 'pass',
        detail: '표준주의 지침 및 격리 절차 명시됨',
        basis: '의료기관 안전계획에서 누락 시 가장 파급이 큰 항목이 감염관리입니다. 표준주의와 격리 절차가 포함되어 있음을 확인했습니다.' },
      { id: 'emergency', label: '비상 대응 체계', desc: '응급 상황 보고 경로와 대응팀 소집 절차', status: 'pass',
        detail: '비상 연락 체계 및 대응팀 소집 절차 확인',
        basis: '응급 상황 발생 시 보고 경로와 대응팀 소집 절차가 순서대로 기재되어 있습니다.' },
      { id: 'training', label: '교육·훈련 계획', desc: '대상자·일시 포함 교육 실시 계획 기재', status: 'warn',
        detail: '교육 일시·대상자 미기재 — 보완 권고',
        basis: '교육 실시 여부만 있고 일시와 대상자가 특정되지 않았습니다. 인증 심사에서 이행 증빙이 어려우므로 일시·대상·시간을 기재하시길 권고합니다.' },
    ],
  },
  secureSuggestions: [
    { icon: FileText,    iconBg: "bg-blue-950/50", iconColor: "text-blue-400", title: "환자정보 포함 기록 분석", query: "개인정보가 포함된 의무기록의 핵심 경과를 정리해줘. 결과는 저장되지 않아" },
    { icon: ShieldCheck, iconBg: "bg-blue-950/50", iconColor: "text-blue-400", title: "현지조사 대응 답변서 초안", query: "심평원 현지조사 지적사항에 대한 답변서 초안을 보안 환경에서 작성해줘" },
    { icon: Search,      iconBg: "bg-blue-950/50", iconColor: "text-blue-400", title: "인사·근무평정 비공개 검토", query: "의료진 근무평정 관련 내용을 보안 환경에서 확인하고 싶어. 대화는 저장되지 않아야 해" },
    { icon: Lock,        iconBg: "bg-blue-950/50", iconColor: "text-blue-400", title: "공개 전 사업 구상 정리",   query: "아직 공개하기 전인 병원 신규 사업 아이디어를 보안 환경에서 문서화해줘" },
  ],
  // REVIEW/TRANSLATE/REPORT/SECURE 모드 응답 오버라이드
  modeAnswers: {
    REVIEW: {
      content: "**[사규·의료법 기반 기안 검토 결과]**\n\n임상시험 동의서 기안을 원내 규정·의료법에 대조했습니다.\n\n**✅ 준수 사항**\n- 설명·동의 절차 및 IRB 승인번호 기재가 규정에 부합\n- 개인정보 수집·이용 고지 문구 포함\n\n**⚠️ 보완 권고**\n- **대리동의 요건** 명시 필요 (동의능력 제한 환자 대상 시)\n- **철회 절차·연락처** 문구 누락 — 생명윤리법 제16조 반영 권장",
      citations: [], steps: null,
    },
    TRANSLATE: {
      content: "**[번역 완료]** — 한국어 → 영어\n\n**진단서 (Medical Certificate)**\n\nThe patient was admitted for inpatient care and received treatment as clinically indicated. The attending physician certifies the diagnosis and the recommended period of recovery as stated in the medical record.\n\n---\n*번역 엔진: Llama-3-Korean 70B · 의료 용어집 적용 · 역번역 검증 완료*",
      citations: [], steps: null,
    },
    REPORT: {
      content: "**[주간 진료실적 보고서 초안]**\n\n**새빛대학교병원 주간 진료실적** (2026-07-06 ~ 07-12)\n\n| 구분 | 이번 주 | 지난주 | 변동 |\n|---|---|---|---|\n| 입원 연인원 | 3,842 | 3,760 | ▲ 2.2% |\n| 외래 연인원 | 21,504 | 21,180 | ▲ 1.5% |\n| 응급실 내원 | 1,286 | 1,192 | ▲ 7.9% |\n| 병상 가동률 | 82.3% | 81.6% | ▲ 0.7%p |\n\n응급실 내원 급증은 여름철 온열질환·외상 유입 영향으로 분석됩니다. 상세는 진료실적 보고 에이전트에서 확인할 수 있습니다.\n\n※ 출처: EMR 실적 집계, 문서번호 SUH-적정진료관리실-2026-058",
      citations: [], steps: null,
    },
    SECURE_DEFAULT: {
      content: "**[보안 문서 스캔 완료]**\n\n업로드된 의무기록을 대상으로 개인정보·보안 취약점을 점검했습니다.\n\n**🔐 자동 처리 내역**\n- 환자 성명·주민등록번호 → 자동 마스킹(***) 처리\n- 연락처 2건 → 벡터 DB 적재 전 마스킹 완료\n\n본 세션의 모든 처리는 병원 내부 로컬 서버에서만 이루어지며 외부로 전송되지 않습니다.",
      citations: [], steps: null,
    },
    SECURE_AIRGAP: {
      content: "**[보안 규정 검토 완료]**\n\n의료정보 망분리 핵심 요건입니다.\n\n- **내부 웹 UI**: 망분리·인터넷 차단 환경 구축 필수\n- **LLM 서비스**: 외부 클라우드 API 연결 금지, 병원 내부 온프레미스만 허용\n- **환자정보 처리**: 가명·익명 처리 후에만 학습 활용, 원본은 내부망 무저장\n\n✅ 현재 세션: 모든 처리가 병원 내부망에서만 이루어지고 있습니다.",
      citations: [], steps: null,
    },
  },
};

export default hospital;
