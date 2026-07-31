/**
 * 도메인 팩 — 의료 (새빛대학교병원, 가상 대학병원)
 * 동일 플랫폼을 의료 도메인(진료·심사·응급운영)에 맞춰 재구성한 데모 프로파일.
 * M2 진행 중: agentContent(13종 내부) 이관 중. 아직 채우지 않은 키는 코어 기본값으로
 * 폴백되므로 deepscan.mjs로 남은 누수를 확인하며 채운다.
 */
import {
  Hospital, ClipboardCheck, ShieldCheck, Search, Activity, Map,
  FileText, Lock, Users, HeartPulse, Stethoscope, Database, BookOpen,
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
    { id: "n3", severity: "info", title: "적정진료 정례회의 녹음 미처리", body: "2026-07-10 적정진료관리실 정례회의 녹음이 회의록 정리 대기 상태입니다.", time: "어제", link: { agentId: "agent-meeting" } },
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
    "agent-meeting":      { name: "적정진료 회의록 에이전트", shortName: "회의록 정리", desc: "적정진료·의료질 회의 녹음을 발언자 구분과 함께 회의록으로 정리하고 액션 아이템을 추출합니다." },
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
  /* ================================================================
   * 에이전트 내부 콘텐츠 (agentContent) — 키 단위 병합
   * 팩이 주지 않는 키는 코어 CONTENT_DEFAULTS(REB 기준)가 그대로 노출되므로
   * 텍스트를 렌더하는 키는 반드시 채운다.
   * 세계관: SUH- 문서번호 / 보험심사팀·응급의료센터·적정진료관리실 /
   *        청구 342건 중 삭감위험 18건 / 응급실 가동률 92%·NEDOCS 178
   * ================================================================ */
  agentContent: {
    /* ── 원내 Q&A 챗봇 ── */
    "agent-chatbot": {
      headerSubtitle: "진료지침·심사기준·원내 규정 기반 응답",
      inputPlaceholder: "진료지침, 심사기준, 원내 규정에 대해 질문하세요.",
      welcomeText: `안녕하세요! 새빛대학교병원 AI 어시스턴트입니다.\n\n진료지침(CP), 요양급여 심사기준, 감염관리·원내 규정에 관해 자유롭게 질문해 주세요. 원내 지식베이스와 규정집을 근거로 답변합니다.\n\n**자주 묻는 주제:**\n- 입원 진료비 삭감 다빈도 사유\n- 응급실 과밀화 단계별 대응 절차\n- 감염관리 표준주의 지침\n- 의무기록 사본 발급 절차\n- 환자안전 사건 보고 체계`,
      welcomeSources: ['새빛대학교병원 AI 플랫폼 운영지침'],
      suggestQuestions: [
        '입원 진료비 삭감 다빈도 사유가 뭔가요?',
        '응급실 과밀화 2단계 대응 절차 알려줘',
        '감염관리 표준주의 지침 핵심만 정리해줘',
        '의무기록 사본 발급은 어떤 절차인가요?',
      ],
      fallbackAnswerBody: '원내 지식베이스에서 정확히 일치하는 항목을 찾지 못했습니다. 진료지침·심사기준·원내 규정 중 어느 영역인지 좁혀서 다시 질문해 주세요.',
      fallbackSources: ['원내 지식베이스'],
      faqCategories: ['심사·청구', '진료지침', '감염관리', '원무·행정'],
      faqCategoryColors: {
        '심사·청구': 'bg-blue-100 text-blue-700',
        '진료지침':  'bg-violet-100 text-violet-700',
        '감염관리':  'bg-rose-100 text-rose-700',
        '원무·행정': 'bg-emerald-100 text-emerald-700',
      },
      faqItems: [
        { id: 'f1', q: '입원 진료비 삭감 다빈도 사유는?', category: '심사·청구',
          a: '상병-수가 불일치, 산정기준 초과, 의학적 필요성 기재 미흡이 상위 3개 사유입니다. 최근 청구 342건 중 삭감위험 18건이 사전 점검에서 확인되었습니다.',
          sources: ['입원진료비_심사기준서.pdf', '2026년 2월 심사 결과 통보서'] },
        { id: 'f2', q: '삭감 사전점검은 언제 하나요?', category: '심사·청구',
          a: '청구 마감 2일 전 적정진료관리실이 일괄 점검하며, 위험 건은 진료과에 회신해 보완 후 청구합니다.',
          sources: ['적정진료관리 업무지침 제6조'] },
        { id: 'f3', q: '응급실 과밀화 대응 단계는?', category: '진료지침',
          a: 'NEDOCS 점수와 병상 가동률로 판단합니다. 140 이상 1단계(관찰), 160 이상 2단계(비상 소집), 180 이상 3단계(진료 제한 검토)입니다.',
          sources: ['응급의료센터 과밀화 대응 지침'] },
        { id: 'f4', q: '표준주의 지침의 핵심은?', category: '감염관리',
          a: '모든 환자의 혈액·체액을 감염 가능성이 있는 것으로 간주해 손위생, 개인보호구, 기구 소독을 적용합니다.',
          sources: ['감염관리 지침 제3장'] },
        { id: 'f5', q: '의무기록 사본 발급 절차는?', category: '원무·행정',
          a: '본인은 신분증, 대리인은 위임장과 가족관계 서류가 필요합니다. 접수 후 3일 이내 발급이 원칙입니다.',
          sources: ['의무기록 관리규정 제11조', '의료법 제21조'] },
        { id: 'f6', q: '환자안전 사건은 어떻게 보고하나요?', category: '원무·행정',
          a: '발견 즉시 원내 보고 시스템에 등록하고, 중대 사건은 24시간 이내 적정진료관리실에 보고합니다. 보고자에게 불이익이 없도록 비처벌 원칙이 적용됩니다.',
          sources: ['환자안전 규정 제8조', '환자안전법 제11조'] },
      ],
      quickAgents: [
        { label: 'EMR 조회 에이전트',     id: 'agent-dbquery',   color: 'bg-blue-100 text-blue-700' },
        { label: '의학지식 검색 에이전트', id: 'agent-knowledge', color: 'bg-violet-100 text-violet-700' },
        { label: '의무기록 요약 에이전트', id: 'agent-summary',   color: 'bg-emerald-100 text-emerald-700' },
      ],
      correctionExample: '예: "입원 진료비 삭감 다빈도 사유가 뭔가요?"',
      delegateRules: [
        { keywords: ['청구', '삭감', '심사'], agentId: 'agent-dbquery',   agentName: 'EMR 조회 에이전트',     reason: '청구·심사 데이터를 직접 조회해 건별로 확인할 수 있습니다.' },
        { keywords: ['지침', '논문', '약제'], agentId: 'agent-knowledge', agentName: '의학지식 검색 에이전트', reason: '진료지침과 원내 지식베이스에서 근거 문헌을 찾아 줍니다.' },
        { keywords: ['경과기록', '요약', '판독'], agentId: 'agent-summary', agentName: '의무기록 요약 에이전트', reason: '장문의 의무기록에서 핵심 경과만 구조화해 정리합니다.' },
        { keywords: ['회의록', '녹음'], agentId: 'agent-meeting', agentName: '적정진료 회의록 에이전트', reason: '회의 녹음을 발언자 구분 회의록으로 자동 정리합니다.' },
      ],
    },

    /* ── 의학지식 검색 에이전트 ── */
    "agent-knowledge": {
      headerDesc: '진료지침(CP)·심사기준·약제 정보 시맨틱 검색 — 근거 조항과 함께 제시',
      defaultQuery: '입원 진료비 삭감 다빈도 사유와 사전 점검 기준',
      quickQueries: ['삭감 다빈도 사유', '응급실 과밀화 대응 단계', '표준주의 감염관리 지침', '의무기록 사본 발급 절차'],
      knowledgeBases: [
        { id: 'kb1', name: '요양급여 심사기준서', docs: 86, updated: '2026.01.10', icon: BookOpen, color: 'violet' },
        { id: 'kb2', name: '진료지침(CP) 모음', docs: 124, updated: '2026.02.18', icon: FileText, color: 'blue' },
        { id: 'kb3', name: '감염관리 지침', docs: 41, updated: '2026.01.12', icon: BookOpen, color: 'indigo' },
        { id: 'kb4', name: '환자안전 보고 사례집', docs: 63, updated: '2026.01.20', icon: BookOpen, color: 'teal' },
        { id: 'kb5', name: '원내 규정·취업규칙', docs: 18, updated: '2026.03.05', icon: FileText, color: 'emerald' },
        { id: 'kb6', name: '약제 정보·처방 기준', docs: 52, updated: '2025.12.01', icon: BookOpen, color: 'emerald' },
        { id: 'kb7', name: '의료질 평가 지표 정의서', docs: 22, updated: '2026.02.01', icon: BookOpen, color: 'cyan' },
      ],
      defaultSelectedKbIds: ['kb1', 'kb2', 'kb3'],
      recentSearches: [
        { id: 1, query: '상병-수가 불일치 삭감 사례', date: '2026-03-31 16:20', results: 6 },
        { id: 2, query: 'NEDOCS 산출 기준', date: '2026-03-30 10:12', results: 3 },
        { id: 3, query: '중심정맥관 감염관리 번들', date: '2026-03-28 14:55', results: 5 },
      ],
      results: [
        { id: 1, title: '입원 진료비 심사기준 — 산정기준 초과 판단', source: '입원진료비_심사기준서.pdf',
          page: 24, score: 96.2, secLevel: 'C', line: 'p.24 · 2번째 문단',
          excerpt: `요양급여 산정기준을 초과한 청구는 의학적 필요성이 진료기록으로 뒷받침되지 않으면 조정 대상이 된다. 초과 산정 시에는 진료기록에 판단 근거를 구체적으로 기재하여야 한다.`,
          keywords: ['산정기준', '의학적 필요성', '조정'] },
        { id: 2, title: '상병-수가 정합성 확인 절차', source: '입원진료비_심사기준서.pdf',
          page: 31, score: 91.4, secLevel: 'C', line: 'p.31 · 1번째 문단',
          excerpt: `청구 상병과 시행 수가의 인과관계가 확인되지 않는 경우 삭감 위험이 높다. 주상병·부상병 선정이 실제 진료 내용과 일치하는지 청구 전 점검한다.`,
          keywords: ['상병', '수가', '주상병'] },
        { id: 3, title: '응급실 과밀화 단계별 대응', source: '응급의료_과밀화_대응지침.pdf',
          page: 12, score: 84.7, secLevel: 'S', line: 'p.12 · 3번째 문단',
          excerpt: `NEDOCS 140 이상은 1단계(관찰), 160 이상은 2단계(비상 인력 소집), 180 이상은 3단계로 분류하며 3단계에서는 신규 환자 수용 제한을 검토한다.`,
          keywords: ['NEDOCS', '과밀화', '단계'] },
        { id: 4, title: '표준주의 지침 적용 범위', source: '감염관리 지침',
          page: 8, score: 78.1, secLevel: 'O', line: 'p.8 · 제3조',
          excerpt: `모든 환자의 혈액, 체액, 분비물을 감염 가능성이 있는 것으로 간주하고 손위생과 개인보호구 착용을 적용한다.`,
          keywords: ['표준주의', '손위생', '개인보호구'] },
        { id: 5, title: '의무기록 사본 발급 기준', source: '원내 규정',
          page: 5, score: 68.9, secLevel: 'O', line: 'p.5 · 제12조',
          excerpt: `환자 본인은 신분증으로, 대리인은 위임장과 가족관계 증명 서류로 신청할 수 있으며 접수 후 3일 이내 발급을 원칙으로 한다.`,
          keywords: ['의무기록', '사본', '대리인'] },
      ],
      aiSummaries: {
        '입원 진료비 삭감 다빈도 사유와 사전 점검 기준': `검색 결과 5건에 따르면 삭감 다빈도 사유는 ①상병-수가 불일치 ②산정기준 초과 ③의학적 필요성 기재 미흡 순입니다. 초과 산정 자체보다 진료기록에 근거가 남아 있는지가 판단을 가릅니다. 청구 마감 2일 전 사전 점검으로 위험 건을 진료과에 회신하는 절차가 정착돼 있습니다.`,
        DEFAULT: `검색 결과를 분석한 결과 관련 문서에서 연관 내용을 찾았습니다. 상세 내용은 아래 검색 결과를 확인하세요.`,
      },
      similarDocs: [
        { title: '요양급여 적용기준 개정 안내', source: '심사기준_개정안내.pdf', relevance: 82 },
        { title: '진료기록 작성 지침', source: '진료기록_작성지침.pdf', relevance: 76 },
        { title: '의료질 평가 지표 정의서', source: '의료질_지표정의서.pdf', relevance: 70 },
      ],
    },

    /* ── 원내 규정 조회 에이전트 ── */
    "agent-internalreg": {
      headerDesc: '원내 규정·진료지침 조항 검색 + 개정 이력 추적',
      emptyDesc: ['취업규칙, 복무규정, 진료지침 등', '새빛대학교병원 원내 규정을 검색합니다'],
      regSystemFooter: '새빛대학교병원 규정 관리 시스템 연동 · 최신 개정 기준 자동 반영',
      apvDocNum: 'SUH-적정진료관리실-2026-019',
      regCategories: ['취업규칙', '복무규정', '진료지침', '감염관리 규정', '개인정보처리방침', '의료질 관리규정', '환자안전 규정', '계약·구매 규정'],
      defaultCategories: ['취업규칙', '진료지침'],
      suggestions: ['당직 근무 기준', '의무기록 사본 발급', '환자안전 사건 보고', '감염관리 격리 절차', '연차 사용 기준'],
      ragDocs: [
        '취업규칙 제27조 (당직 근무)',
        '복무규정 제9조 (교대 근무)',
        '진료지침 제4조 (협진 의뢰 절차)',
        '감염관리 규정 제11조 (격리 해제 기준)',
        '개인정보처리방침 제5조 (진료정보 제3자 제공)',
        '환자안전 규정 제7조 (사건 보고 체계)',
        '의료질 관리규정 제3조 (지표 산출)',
      ],
      answerText: `당직 근무 중 응급 상황이 발생한 경우, 새빛대학교병원 취업규칙 및 진료지침에 따라 다음 절차를 이행하여야 합니다.

**1. 즉시 조치**
당직의는 환자 상태를 우선 안정화하고, 필요한 경우 해당 진료과 전문의에게 즉시 유선 보고합니다.

**2. 보고 체계**
중증도에 따라 당직 책임자 → 진료부장 순으로 보고하며, 환자안전 사건에 해당하는 경우 환자안전 규정 제7조에 따라 24시간 이내 보고 체계에 등록합니다.

**3. 기록**
조치 내용과 판단 근거를 진료기록에 구체적으로 기재합니다. 기재 미흡은 이후 심사·분쟁에서 불리하게 작용합니다.

※ 출처: 취업규칙 제27조, 진료지침 제4조, 환자안전 규정 제7조`,
      citations: [
        { name: '취업규칙 제27조 (당직 근무)', similarity: 94 },
        { name: '진료지침 제4조 (협진 의뢰 절차)', similarity: 88 },
        { name: '환자안전 규정 제7조 (사건 보고 체계)', similarity: 81 },
      ],
      relatedRegs: [
        { title: '복무규정 제9조 (교대 근무)', desc: '교대 인수인계 및 근무시간 기준' },
        { title: '감염관리 규정 제11조 (격리 해제)', desc: '격리 환자 관리 및 해제 판단 기준' },
      ],
      apvLine: [
        { name: '서지은', dept: '적정진료관리실', title: '책임', role: '작성자' },
        { name: '정하늘', dept: '적정진료관리실', title: '실장', role: '검토자' },
        { name: '오세영', dept: '진료부', title: '진료부장', role: '승인자' },
      ],
    },

    /* ── 의무기록 요약 에이전트 ── */
    "agent-summary": {
      headerDesc: '의무기록·판독지 업로드 → 유형별 요약 → 개정본 비교',
      docAName: '입원경과기록_2026-03-14.pdf',
      docBName: '입원경과기록_2026-03-21.pdf',
      resultDocLabel: '의무기록 요약',
      resultCompareLabel: '경과 비교 요약',
      structureHints: ['주호소·현병력', '경과 요약', '검사·처치', '퇴원 계획'],
      keywords: [
        { word: '급성 충수염', pct: 100 }, { word: '우하복부 통증', pct: 88 }, { word: '복부 CT', pct: 82 },
        { word: '백혈구', pct: 76 }, { word: 'CRP', pct: 74 }, { word: '정맥 항생제', pct: 68 },
        { word: '경구 전환', pct: 61 }, { word: '발열 소실', pct: 55 }, { word: '재원일수', pct: 49 },
        { word: '합병증 없음', pct: 43 }, { word: '외래 추적', pct: 38 }, { word: '퇴원 계획', pct: 32 },
      ],
      sections: [
        { id: 's1', title: '1. 입원 경위', children: ['주호소 및 현병력', '응급의료센터 경유 입원', '초기 활력징후'] },
        { id: 's2', title: '2. 진단 근거', children: ['복부 전산화단층촬영 소견', '혈액검사 결과', '감별 진단 고려사항'] },
        { id: 's3', title: '3. 치료 경과', children: ['정맥 항생제 요법', '일자별 증상 변화', '경구 전환 시점 판단'] },
        { id: 's4', title: '4. 검사 추이', children: ['백혈구 수치 변화', 'CRP 변화', '영상 추적검사'] },
        { id: 's5', title: '5. 퇴원 계획', children: ['경구 항생제 유지 기간', '외래 추적 일정', '재입원 기준 안내'] },
      ],
      summaryContent: `**1. 입원 경위**
환자는 2026년 3월 14일 우하복부 통증을 주호소로 응급의료센터를 경유해 입원하였다. 내원 당시 발열(38.1℃)과 우하복부 압통이 확인되었다.

**2. 진단 근거**
복부 전산화단층촬영에서 충수 주위 염증 소견이 관찰되었고, 혈액검사상 백혈구 14,200/μL, CRP 8.4mg/dL로 상승하여 급성 충수염으로 판단하였다.

**3. 치료 경과**
정맥 항생제 요법을 시행하였으며 입원 3일차부터 발열이 소실되고 복통이 감소하였다. 입원 7일차 임상 증상 및 검사 수치 호전을 확인하고 경구 항생제로 전환하였다.

**4. 검사 추이**
백혈구는 14,200/μL에서 8,600/μL로, CRP는 8.4mg/dL에서 1.9mg/dL로 감소하였다. 추적 영상검사에서 농양 형성 등 합병증은 확인되지 않았다.

**5. 퇴원 계획**
경구 항생제를 5일간 유지하고 2주 후 외래 추적을 예정한다. 발열 재발, 복통 악화, 경구 섭취 불가 시 즉시 재내원하도록 안내하였다.`,
      tableSummaryRows: [
        { ch: '입원 경위', content: '우하복부 통증 주호소 · 응급의료센터 경유 입원', key: '입원 2026.03.14' },
        { ch: '진단 근거', content: '복부 CT 충수 주위 염증 · 백혈구 14,200/μL · CRP 8.4mg/dL', key: 'CT + 혈액검사' },
        { ch: '치료 경과', content: '정맥 항생제 7일 투여 후 경구 전환 · 발열 소실', key: '경구 전환 7일차' },
        { ch: '현재 상태', content: '백혈구 8,600/μL · CRP 1.9mg/dL로 호전 · 합병증 없음', key: 'CRP 8.4→1.9' },
        { ch: '퇴원 계획', content: '경구 항생제 5일 지속 · 외래 추적 1회 · 재입원 기준 안내', key: '외래 추적 2주' },
      ],
      sourceText: `입원 경과기록 (입원 7일차)

주호소는 우하복부 통증이며, 입원 당시 백혈구 14,200/μL, CRP 8.4mg/dL로 염증 소견을 보였다. 복부 CT에서 충수 주위 염증 소견이 확인되어 항생제 치료를 시작하였다.

입원 3일차부터 발열이 소실되었고, 5일차 추적 검사에서 백혈구 8,600/μL, CRP 1.9mg/dL로 호전되었다. 경구 섭취 가능하며 통증은 NRS 2점 수준으로 감소하였다.

현재 항생제는 경구 전환하였으며, 특이 합병증 소견은 없다. 퇴원 후 외래 추적을 계획하고 있다.`,
      summaryText: `**주호소·현병력** 우하복부 통증으로 입원, 입원 시 백혈구 14,200/μL·CRP 8.4mg/dL의 염증 소견.\n\n**경과** 항생제 치료 후 3일차 발열 소실, 5일차 백혈구 8,600/μL·CRP 1.9mg/dL로 호전. 통증 NRS 2점.\n\n**현재** 경구 항생제 전환, 합병증 없음.\n\n**계획** 퇴원 후 외래 추적.`,
      summaryStats: [
        { label: '원문 분량', value: '1,240자' },
        { label: '요약 분량', value: '286자' },
        { label: '압축률', value: '77%' },
        { label: '핵심 수치 보존', value: '8/8' },
      ],
      compareRows: [
        { item: '백혈구', before: '14,200/μL', after: '8,600/μL', note: '정상 범위로 회복' },
        { item: 'CRP', before: '8.4 mg/dL', after: '1.9 mg/dL', note: '염증 호전' },
        { item: '발열', before: '있음', after: '소실', note: '입원 3일차 소실' },
        { item: '통증(NRS)', before: '7점', after: '2점', note: '경구 진통제로 조절' },
        { item: '항생제', before: '정맥', after: '경구', note: '경구 전환 완료' },
      ],
      compareStats: [
        { label: '비교 항목', value: '5건' },
        { label: '호전', value: '5건' },
        { label: '악화', value: '0건' },
      ],
    },

    /* ── 의료 문서 번역 에이전트 ── */
    "agent-translate": {
      headerDesc: '진단서·소견서 입력 → 용어집 기반 번역 → 역번역 검증',
      sourceText: `환자는 2026년 3월 14일 우하복부 통증을 주호소로 본원 응급의료센터를 통해 입원하였습니다.

입원 시 시행한 복부 전산화단층촬영에서 충수 주위 염증 소견이 확인되었으며, 혈액검사상 백혈구 14,200/μL, C-반응성 단백 8.4mg/dL로 상승 소견을 보였습니다.

정맥 항생제 치료를 시행하였고 입원 7일차 현재 임상 증상 및 검사 수치가 호전되어 경구 항생제로 전환하였습니다. 특이 합병증은 관찰되지 않았습니다.`,
      translatedText: `The patient was admitted through the Emergency Medical Center on March 14, 2026, with a chief complaint of right lower quadrant abdominal pain.

Abdominal computed tomography performed on admission revealed periappendiceal inflammatory changes, and laboratory findings showed an elevated white blood cell count of 14,200/μL and C-reactive protein of 8.4 mg/dL.

Intravenous antibiotic therapy was administered. As of hospital day 7, clinical symptoms and laboratory values have improved, and the patient has been transitioned to oral antibiotics. No specific complications have been observed.`,
      backTranslated: `환자는 2026년 3월 14일 우하복부 통증을 주소로 응급의료센터를 통해 입원하였다. 입원 시 시행한 복부 CT에서 충수 주위 염증 변화가 확인되었고, 검사상 백혈구 14,200/μL, C-반응성 단백 8.4mg/dL의 상승이 관찰되었다. 정맥 항생제 치료를 시행하였으며, 입원 7일째 임상 증상과 검사 수치가 호전되어 경구 항생제로 전환하였다. 특이 합병증은 없었다.`,
      summaryKo: `우하복부 통증으로 입원, 복부 CT상 충수 주위 염증 확인. 백혈구 14,200/μL·CRP 8.4mg/dL 상승. 정맥 항생제 후 7일차 호전되어 경구 전환, 합병증 없음.`,
      summaryEn: `Admitted with right lower quadrant pain; CT showed periappendiceal inflammation. WBC 14,200/μL, CRP 8.4 mg/dL. Improved after IV antibiotics and transitioned to oral therapy by hospital day 7 without complications.`,
      chunks: [
        { id: 1, text: '환자는 2026년 3월 14일 우하복부 통증을 주호소로 본원 응급의료센터를 통해 입원하였습니다.' },
        { id: 2, text: '입원 시 시행한 복부 전산화단층촬영에서 충수 주위 염증 소견이 확인되었습니다.' },
        { id: 3, text: '혈액검사상 백혈구 14,200/μL, C-반응성 단백 8.4mg/dL로 상승 소견을 보였습니다.' },
        { id: 4, text: '정맥 항생제 치료를 시행하였고 입원 7일차 현재 임상 증상 및 검사 수치가 호전되었습니다.' },
        { id: 5, text: '경구 항생제로 전환하였으며 특이 합병증은 관찰되지 않았습니다.' },
      ],
      glossary: [
        { ko: '주호소', en: 'Chief complaint', category: '진료' },
        { ko: '우하복부', en: 'Right lower quadrant', category: '해부' },
        { ko: '충수 주위 염증', en: 'Periappendiceal inflammation', category: '진단' },
        { ko: 'C-반응성 단백', en: 'C-reactive protein (CRP)', category: '검사' },
        { ko: '경구 전환', en: 'Transition to oral therapy', category: '치료' },
        { ko: '응급의료센터', en: 'Emergency Medical Center', category: '조직' },
      ],
    },

    /* ── 진료 보고서 작성 ── */
    "agent-report": {
      headerDesc: '보고 유형 선택 → 실적 데이터 자동 반영 → 결재 상신',
      apvLine: [
        { name: '서지은', dept: '적정진료관리실', title: '대리', role: '작성자' },
        { name: '정하늘', dept: '보험심사팀', title: '팀장', role: '검토자' },
        { name: '오세훈', dept: '적정진료관리실', title: '실장', role: '승인자' },
      ],
      docNumFallback: 'SUH-적정진료관리실-2026-027',
      reportTypes: [
        { id: 'weekly',    label: '주간실적보고',   icon: '📊', desc: '주간 심사·삭감 대응 실적 및 차주 계획' },
        { id: 'field',     label: '병동운영보고',   icon: '🏥', desc: '병동별 병상 운영 및 재원 관리 현황' },
        { id: 'monthly',   label: '월간실적보고',   icon: '📈', desc: '월간 청구·심사 종합 실적 보고' },
        { id: 'officetel', label: '의료질지표보고', icon: '📋', desc: '분기별 의료질 평가지표 현황 보고' },
        { id: 'market',    label: '진료동향보고',   icon: '📉', desc: '진료과별 환자 동향 및 전망 보고' },
      ],
      docNums: {
        weekly:    'SUH-적정진료관리실-2026-027',
        field:     'SUH-간호부-2026-052',
        monthly:   'SUH-보험심사팀-2026-071',
        officetel: 'SUH-적정진료관리실-2026-084',
        market:    'SUH-적정진료관리실-2026-096',
      },
      reportDefaults: {
        weekly: {
          dept: '적정진료관리실', period: '2026.03.16 ~ 2026.03.21',
          mainWork: '- 청구 342건 사전점검 실시, 삭감 위험 18건 분류\n- 위험 건 중 14건 보완 완료 후 청구 상신\n- 재원일수 초과 3건 소명 자료 작성 지원',
          nextPlan: '- 경과기록 기반 소명 자료 자동 첨부 절차 적용\n- 다빈도 삭감 사유 진료과 공유 자료 배포',
          special: '상병-처치 코드 불일치가 삭감 사유의 절반을 차지하여 코드 표준화 병행이 필요합니다.',
        },
        field: {
          dept: '간호부', period: '2026.03.21',
          mainWork: '- 병동 5개소 병상 운영 점검\n- 7East 가동률 94%로 신규 배정 제한 적용\n- ICU 전실 대기 3명 확인',
          nextPlan: '- 퇴원 예정 전일 등록 시범 운영 준비\n- 오전 퇴원 처리 지연 원인 분석',
          special: '응급실 과밀화의 주 원인이 병동 배정 지연으로 확인되어 병동·응급 연계 기준 정비가 필요합니다.',
        },
        monthly: {
          dept: '보험심사팀', period: '2026.02.01 ~ 2026.02.28',
          mainWork: '- 월 청구 342건 접수, 심사 완료 338건\n- 실제 삭감 4건(전월 대비 3건 감소)\n- 사전점검 적중률 78%',
          nextPlan: '- 3월 사전점검 대상 확대(외래 포함)\n- 삭감 사유별 진료과 피드백 정례화',
          special: '사전점검 도입 이후 실제 삭감 건수가 지속 감소하고 있습니다.',
        },
        officetel: {
          dept: '적정진료관리실', period: '2026년 1분기',
          mainWork: '- 의료질 평가지표 12개 항목 자료 수집\n- 근거 자료 자동 수집 가능 항목 7개 확인\n- 별도 작성 필요 항목 5개 담당 배정',
          nextPlan: '- 4월 평가 대비 최종 점검\n- 지표별 목표 대비 실적 검토',
          special: '자동 수집 가능 항목은 기존 진료·심사 기록에서 파생되므로 별도 작성 부담이 없습니다.',
        },
        market: {
          dept: '적정진료관리실', period: '2026년 1분기',
          mainWork: '- 진료과별 환자 수 및 재원일수 추이 분석\n- 응급 경유 입원 비율 증가 확인\n- 계절성 질환 내원 패턴 정리',
          nextPlan: '- 2분기 병상 운영 계획 반영\n- 응급 경유 비율 모니터링 지속',
          special: '응급 경유 입원 비율 상승은 병상 회전율과 함께 판단해야 합니다.',
        },
      },
      perfCharts: {
        weekly:  { label: '주간', data: [
          { item: '사전점검', 완료: 342, 목표: 340 },
          { item: '보완 처리', 완료: 14, 목표: 18 },
          { item: '소명 작성', 완료: 3, 목표: 3 },
        ] },
        monthly: { label: '월간', data: [
          { item: '청구 심사', 완료: 338, 목표: 342 },
          { item: '삭감 대응', 완료: 18, 목표: 18 },
          { item: '진료과 피드백', 완료: 6, 목표: 8 },
        ] },
        field:   { label: '병동운영', data: [
          { item: '병상 점검', 완료: 5, 목표: 5 },
          { item: '재원 관리', 완료: 42, 목표: 48 },
          { item: '퇴원 조정', 완료: 11, 목표: 15 },
        ] },
      },
      pressTypeId: 'officetel',
      pressKpiTitle: '의료질 평가지표 현황',
      pressDate: '2026.03.21',
      pressContact: '새빛대학교병원 적정진료관리실 (02-1234-5678)',
      apvRefNo: 'SUH-적정진료관리실-2026-027',
      reportDate: '2026.03.21',
      approvalSystem: '새빛대학교병원 전자결재',
      logoAlt: '새빛대학교병원',
    },

    /* ── 회의록 자동 작성 ── */
    "agent-meeting": {
      headerDesc: '회의 음성 업로드 → 화자 분리 → 안건별 회의록 자동 작성',
      defaultTitle: '3월 적정진료관리위원회 정례회의',
      defaultPlace: '본관 5층 대회의실',
      defaultAttendees: [
        { name: '오세훈', dept: '적정진료관리실', role: '주재(실장)' },
        { name: '정하늘', dept: '보험심사팀', role: '팀장' },
        { name: '서지은', dept: '적정진료관리실', role: '대리' },
        { name: '한도윤', dept: '응급의료센터', role: '팀장' },
      ],
      defaultAgenda: ['2월 진료비 삭감 현황 및 사전점검 결과', '응급실 과밀화 대응 단계 조정'],
      sttSampleText: `오세훈 실장: 2월 삭감 현황부터 보겠습니다. 청구 342건 중 사전점검에서 삭감 위험으로 분류된 게 18건이었고, 실제 삭감은 4건으로 마감됐습니다.
정하늘 팀장: 사전점검 적중률로 보면 18건 중 14건은 보완 후 통과됐습니다. 다빈도 사유는 여전히 상병 코드와 처치 코드 불일치, 그리고 재원일수 초과 소명 누락입니다.
서지은 대리: 재원일수 소명은 경과기록에 근거가 있는데 청구 시 첨부가 빠지는 경우가 많습니다. 요약 에이전트로 경과기록에서 소명 문구를 뽑아 붙이는 절차를 넣으면 줄어들 것으로 봅니다.
한도윤 팀장: 응급실 쪽은 지난주 NEDOCS 178까지 올라갔습니다. 현재 기준으로는 3단계인데, 병동 배정 지연이 주 원인이라 병동과 같이 봐야 합니다.
문가온 수간호사: 오전 퇴원 처리가 늦어지는 게 크고, 퇴원 예정 등록을 전일에 받으면 배정이 빨라집니다.
오세훈 실장: 그럼 퇴원 예정 전일 등록을 4월부터 시범 적용하고, 삭감 소명 자동 첨부는 이번 달 안에 적용하겠습니다. CP 개정안은 다음 회의에서 다루죠.`,
      diarization: [
        { time: '00:00:11', speaker: '오세훈', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200',
          text: '2월 삭감 현황부터 보겠습니다. 청구 342건 중 사전점검에서 삭감 위험으로 분류된 게 18건이었고, 실제 삭감은 4건으로 마감됐습니다.', docKey: 'open', meetingText: '2월 진료비 삭감 현황 보고' },
        { time: '00:01:34', speaker: '정하늘', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200',
          text: '사전점검 적중률로 보면 18건 중 14건은 보완 후 통과됐습니다. 다빈도 사유는 상병 코드와 처치 코드 불일치, 재원일수 초과 소명 누락입니다.', docKey: 'agenda1', meetingText: '삭감 사유 분석' },
        { time: '00:03:02', speaker: '서지은', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200',
          text: '재원일수 소명은 경과기록에 근거가 있는데 청구 시 첨부가 빠지는 경우가 많습니다.', docKey: 'agenda1', meetingText: '소명 자료 누락 원인' },
        { time: '00:04:20', speaker: '서지은', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200',
          text: '요약 에이전트로 경과기록에서 소명 문구를 뽑아 붙이는 절차를 넣으면 줄어들 것으로 봅니다.', docKey: 'agenda1_conc', meetingText: '개선 방안 제안' },
        { time: '00:06:11', speaker: '한도윤', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200',
          text: '응급실 쪽은 지난주 NEDOCS가 178까지 올라갔습니다. 현재 기준으로는 3단계인데, 병동 배정 지연이 주 원인이라 병동과 같이 봐야 합니다.', docKey: 'agenda2', meetingText: '응급실 과밀화 현황' },
        { time: '00:08:05', speaker: '한도윤', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200',
          text: '오전 퇴원 처리가 늦어지는 게 크고, 퇴원 예정 등록을 전일에 받으면 배정이 빨라집니다.', docKey: 'agenda2', meetingText: '병동 측 개선 의견' },
        { time: '00:10:42', speaker: '오세훈', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200',
          text: '그럼 퇴원 예정 전일 등록을 4월부터 시범 적용하고, 삭감 소명 자동 첨부는 이번 달 안에 적용하겠습니다.', docKey: 'decision', meetingText: '결정 사항' },
        { time: '00:12:18', speaker: '오세훈', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200',
          text: '진료지침 개정안은 다음 회의에서 다루죠.', docKey: 'close', meetingText: '차기 안건 이월' },
      ],
      docSections: [
        { key: 'open',        num: '§1',    label: '개회',                   brief: '적정진료관리실장 주재로 회의 개최. 참석 인원 확인 및 목적 공유.', color: 'slate' },
        { key: 'agenda1',     num: '§2-①',  label: '안건 1 · 2월 삭감 현황', brief: '청구 342건 중 위험 18건 · 보완 14건 통과 · 실제 삭감 4건.', color: 'violet' },
        { key: 'agenda1_conc', num: '  └결론', label: '안건 1 결론',          brief: '경과기록 소명 근거 자동 첨부 절차를 3월 중 적용.', color: 'violet' },
        { key: 'agenda2',     num: '§2-②',  label: '안건 2 · 응급실 과밀화', brief: 'NEDOCS 178 · 병동 배정 지연이 주 원인 · 병동 연계 필요.', color: 'blue' },
        { key: 'decision',    num: '§3',    label: '결정 사항',              brief: '① 소명 자동 첨부  ② 퇴원 예정 전일 등록 시범  ③ NEDOCS 기준 정비.', color: 'emerald' },
        { key: 'action',      num: '§4',    label: '조치 사항',              brief: '4개 항목 · 담당자 배정 · 기한 2026.03.31~04.17.', color: 'amber' },
        { key: 'close',       num: '§5',    label: '폐회',                   brief: '차기 회의: 2026.04.17(금) 15:00 예정.', color: 'slate' },
      ],
      speakerLegend: [
        { name: '오세훈', color: 'text-indigo-700', bg: 'bg-indigo-100', border: 'border-indigo-200' },
        { name: '정하늘', color: 'text-violet-700', bg: 'bg-violet-100', border: 'border-violet-200' },
        { name: '서지은', color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-200' },
        { name: '한도윤', color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-200' },
      ],
      actions: [
        { label: '삭감 소명 자료 자동 첨부 절차 적용', person: '서지은', dept: '적정진료관리실', due: '2026.03.31' },
        { label: '퇴원 예정 전일 등록 시범 운영 계획 수립', person: '한도윤', dept: '응급의료센터', due: '2026.04.03' },
        { label: 'NEDOCS 단계별 병동 연계 기준 재정비', person: '한도윤', dept: '응급의료센터', due: '2026.04.10' },
        { label: '진료지침(CP) 개정안 차기 회의 상정', person: '정하늘', dept: '보험심사팀', due: '2026.04.17' },
      ],
      deptName: '적정진료관리실',
      docNum: 'SUH-적정진료관리실-2026-031',
      openingLines: ['적정진료관리실장 주재로 정례회의 개최', '참석 인원 확인 및 회의 목적 공유'],
      agendaDiscussions: [
        { lines: [
            '정하늘 팀장: 2월 청구 342건 중 사전점검 삭감 위험 18건, 보완 후 14건 통과로 실제 삭감은 4건.',
            '정하늘 팀장: 다빈도 사유는 상병-처치 코드 불일치와 재원일수 초과 소명 누락.',
            '서지은 대리: 소명 근거는 경과기록에 있으나 청구 시 첨부가 누락되는 경우가 많음.',
          ],
          conclusion: '경과기록에서 소명 근거를 추출해 청구 시 자동 첨부하는 절차를 3월 중 적용' },
        { lines: [
            '한도윤 팀장: 지난주 NEDOCS 178로 3단계 해당, 병동 배정 지연이 주 원인.',
            '한도윤 팀장: 오전 퇴원 처리 지연이 크며 퇴원 예정 전일 등록 시 배정 속도 개선 예상.',
          ],
          conclusion: '퇴원 예정 전일 등록을 2026년 4월부터 병동 시범 운영' },
      ],
      decisions: [
        '경과기록 기반 재원일수 소명 자료 자동 첨부 — 2026년 3월 중 적용',
        '퇴원 예정 전일 등록 병동 시범 운영 — 2026년 4월 시행',
        'NEDOCS 단계별 대응 기준에 병동 배정 연계 항목 추가',
      ],
      specialNotes: [
        '차기 회의: 2026년 4월 17일(금) 15:00 예정',
        '진료지침(CP) 개정안은 자료 보완 후 차기 회의에 재상정',
      ],
      footerText: '새빛대학교병원 적정진료관리실 · 본 회의록은 AI가 초안을 작성하고 참석자 확인을 거쳐 확정됩니다.',
      logoAlt: '새빛대학교병원',
      apvLine: [
        { name: '서지은', dept: '적정진료관리실', title: '대리', role: '작성자' },
        { name: '정하늘', dept: '보험심사팀', title: '팀장', role: '검토자' },
        { name: '오세훈', dept: '적정진료관리실', title: '실장', role: '승인자' },
      ],
    },

    /* ── 진료문서 검토 ── */
    "agent-review": {
      headerDesc: '진료·행정 문서의 규정 위반과 기재 누락을 조항 단위로 검토',
      highlightDocTitle: '외부 의료기관 진료의뢰 회신문',
      regs: [
        { id: 'r1', label: '의료법' },
        { id: 'r2', label: '개인정보보호법' },
        { id: 'r3', label: '요양급여 심사기준' },
        { id: 'r4', label: '원내 의무기록 관리규정' },
        { id: 'r5', label: '환자안전 규정' },
      ],
      ragDocs: [
        '의료법 제21조 (기록 열람 등)',
        '의료법 시행규칙 제13조 (진료기록부 기재사항)',
        '개인정보보호법 제23조 (민감정보의 처리 제한)',
        '요양급여의 적용기준 및 방법에 관한 세부사항',
        '원내 의무기록 관리규정 제11조 (사본 발급)',
        '원내 진료의뢰·회신 업무지침 제5조',
        '환자안전 규정 제8조 (정보 공유 범위)',
      ],
      violations: [
        {
          clause: '개인정보보호법 제23조 · 원내 의무기록 관리규정 제11조',
          type: '민감정보 과다 기재',
          severity: 'high',
          content: '회신문에 의뢰 목적과 무관한 과거 정신건강 진료 이력과 가족력이 함께 기재되어 있습니다.',
          action: '의뢰 목적에 필요한 범위로 한정하여 해당 문단을 삭제하거나, 환자의 별도 동의 사실을 문서에 명시하십시오.',
        },
        {
          clause: '의료법 시행규칙 제13조',
          type: '필수 기재사항 누락',
          severity: 'medium',
          content: '회신 의사의 면허번호와 회신 일자가 기재되어 있지 않습니다.',
          action: '회신 의사 성명·면허번호·회신 일자를 문서 하단에 기재하십시오.',
        },
        {
          clause: '원내 진료의뢰·회신 업무지침 제5조',
          type: '표현 부적절',
          severity: 'low',
          content: '진단 소견에 확정적 표현이 사용되었으나 근거 검사 결과가 첨부되지 않았습니다.',
          action: '판독지·검사 결과를 첨부하거나 "추정" 등 소견 수준에 맞는 표현으로 수정하십시오.',
        },
      ],
      highlightSegs: [
        { text: '환자는 2026년 3월 14일 우하복부 통증으로 본원 응급의료센터를 경유하여 입원하였습니다. ', type: null },
        { text: '과거 정신건강의학과 진료 이력이 있으며 가족 중 유사 병력이 확인됩니다. ', type: 'high' },
        { text: '복부 전산화단층촬영에서 충수 주위 염증 소견이 관찰되었고 ', type: null },
        { text: '급성 충수염으로 확정 진단하였습니다. ', type: 'low' },
        { text: '정맥 항생제 투여 후 임상 증상 및 염증 수치가 호전되어 경구 항생제로 전환하였습니다. ', type: null },
        { text: '이상으로 회신드립니다.', type: 'medium' },
        { text: ' 추가 문의 사항은 적정진료관리실로 연락 주시기 바랍니다.', type: null },
      ],
      dept: '적정진료관리실',
      docNum: 'SUH-적정진료관리실-2026-034',
      apvDocNum: 'SUH-적정진료관리실-2026-034',
      apvLine: [
        { name: '서지은', dept: '적정진료관리실', title: '대리', role: '작성자' },
        { name: '정하늘', dept: '보험심사팀', title: '팀장', role: '검토자' },
        { name: '오세훈', dept: '적정진료관리실', title: '실장', role: '승인자' },
      ],
      logoAlt: '새빛대학교병원',
    },

    /* ── 환자안전 계획 수립 ── */
    "agent-safety": {
      headerDesc: '시술·처치 전 위험요인 평가와 환자안전 관리계획을 자동 작성',
      defaultProjName: '중심정맥관 삽입 시술 (중환자실·응급의료센터)',
      defaultProjType: '침습적 시술',
      defaultProjLoc: '본관 3층 중환자실 · 응급의료센터 처치실',
      projTypePlaceholder: '시술·처치 유형 (침습적 시술, 검사, 이송 등)',
      riskOptions: ['감염 (카테터 관련 혈류감염)', '기흉·혈흉', '출혈·혈종', '동맥 오천자', '공기색전', '카테터 위치 이상', '환자 오인', '낙상', '진정제 부작용', '의료폐기물 노출'],
      defaultRisks: ['감염 (카테터 관련 혈류감염)', '기흉·혈흉', '환자 오인'],
      riskData: {
        '감염 (카테터 관련 혈류감염)': { level: '높음', freq: '월 1~2건', sev: 5, lkl: 3, lvlColor: 'text-rose-600', measure: '최대멸균차단술 적용, 클로르헥시딘 피부소독 후 완전 건조, 삽입 체크리스트 실시간 기록, 유지 필요성 매일 재평가' },
        '기흉·혈흉': { level: '높음', freq: '분기 1건', sev: 5, lkl: 2, lvlColor: 'text-rose-600', measure: '초음파 유도 하 천자 원칙, 삽입 후 흉부 방사선 촬영으로 위치·합병증 확인, 호흡곤란 발생 시 즉시 보고' },
        '출혈·혈종': { level: '보통', freq: '월 1건', sev: 3, lkl: 3, lvlColor: 'text-amber-600', measure: '시술 전 응고 검사 확인, 항응고제 복용 여부 확인, 천자 후 압박 지혈 및 부위 관찰' },
        '동맥 오천자': { level: '보통', freq: '분기 1건', sev: 4, lkl: 2, lvlColor: 'text-amber-600', measure: '초음파로 혈관 구분 확인, 역류 혈액 성상·압력 확인 후 확장기 삽입' },
        '공기색전': { level: '보통', freq: '연 1건 미만', sev: 5, lkl: 1, lvlColor: 'text-amber-600', measure: '트렌델렌부르크 자세 유지, 삽입·제거 시 호기말 정지 지시, 허브 개방 시간 최소화' },
        '카테터 위치 이상': { level: '보통', freq: '월 1건', sev: 3, lkl: 3, lvlColor: 'text-amber-600', measure: '삽입 후 방사선 촬영으로 선단 위치 확인, 사용 전 판독 결과 확인 절차 준수' },
        '환자 오인': { level: '높음', freq: '연 1~2건', sev: 5, lkl: 2, lvlColor: 'text-rose-600', measure: '시술 직전 타임아웃 시행(환자 2가지 이상 식별자·시술명·부위 구두 확인), 동의서 대조' },
        '낙상': { level: '낮음', freq: '월 1건', sev: 3, lkl: 2, lvlColor: 'text-emerald-600', measure: '진정 후 침상 안정 및 침상난간 상승, 이동 시 보조 인력 동반' },
        '진정제 부작용': { level: '보통', freq: '월 1건', sev: 4, lkl: 2, lvlColor: 'text-amber-600', measure: '시술 중 산소포화도·심전도 감시, 길항제 즉시 사용 가능 위치 비치, 회복 기준 충족 후 감시 종료' },
        '의료폐기물 노출': { level: '낮음', freq: '월 1~2건', sev: 2, lkl: 3, lvlColor: 'text-emerald-600', measure: '주사침 자상 방지 기구 사용, 시술 즉시 전용 용기 폐기, 노출 시 감염관리실 즉시 보고' },
      },
      ragDocs: [
        { name: '중심정맥관 관리 지침(원내 CP)', hits: 14 },
        { name: '감염관리 지침 — 혈관 내 카테터', hits: 11 },
        { name: '환자안전 규정 — 침습적 시술 타임아웃', hits: 8 },
        { name: '진정 관리 지침', hits: 6 },
        { name: '의료폐기물 관리 지침', hits: 4 },
      ],
      ragTags: ['의료법', '환자안전법', '감염관리 지침', '원내 진료지침(CP)', '진정 관리 지침', '의료폐기물 관리'],
      laws: [
        '의료법 제24조의2 (의료행위에 관한 설명)',
        '환자안전법 제11조 (환자안전사고의 보고)',
        '의료관련감염 예방·관리 지침 (질병관리청)',
        '원내 감염관리 규정 제12조 (혈관 내 카테터 관리)',
        '원내 환자안전 규정 제8조 (침습적 시술 전 확인 절차)',
      ],
      checklist: [
        '시술 동의서 취득 및 설명 사항 기록 확인',
        '시술 직전 타임아웃 시행 (환자 식별자 2개·시술명·부위)',
        '최대멸균차단술 물품 준비 및 무균 술기 준수',
        '초음파 유도 장비 작동 확인',
        '응고 검사 결과 및 항응고제 복용 여부 확인',
        '시술 중 산소포화도·심전도 감시 유지',
        '삽입 후 흉부 방사선 촬영으로 선단 위치·합병증 확인',
      ],
      orgMembers: ['한도윤 팀장 (응급의료센터)', '문가온 수간호사 (간호부)', '서지은 대리 (적정진료관리실)'],
      emergencySteps: [
        { label: '최초 발견자', sub: '시술 중단 · 환자 상태 확인', color: 'bg-rose-500' },
        { label: '시술 담당의', sub: '응급 처치 · 활력징후 안정화', color: 'bg-amber-500' },
        { label: '해당 진료과 당직', sub: '전문 처치 · 영상 확인 지시', color: 'bg-blue-500' },
        { label: '적정진료관리실', sub: '환자안전 사건 보고 · 원인 분석', color: 'bg-slate-600' },
      ],
      planSections: [
        { sub: '시술 전 관리', items: ['동의서 취득 및 설명 기록', '응고 검사·항응고제 복용 확인', '타임아웃 시행 및 기록'] },
        { sub: '시술 중 관리', items: ['최대멸균차단술 준수', '초음파 유도 하 천자', '활력징후·산소포화도 지속 감시'] },
        { sub: '시술 후 관리', items: ['흉부 방사선으로 선단 위치 확인', '삽입 부위 매일 관찰 및 기록', '유지 필요성 매일 재평가 후 조기 제거'] },
      ],
      uploadHint: '시술 계획서·동의서 양식을 첨부하면 계획서에 반영됩니다',
      dept: '적정진료관리실',
      docNum: 'SUH-적정진료관리실-2026-048',
      orgLeader: '오세훈 실장 (적정진료관리실)',
      orgManager: '정하늘 팀장 (보험심사팀)',
      brandLine: '새빛대학교병원 환자안전 관리계획',
      logoAlt: '새빛대학교병원',
      apvRef: 'SUH-적정진료관리실-2026-048',
      apvLine: [
        { name: '서지은', dept: '적정진료관리실', title: '대리', role: '작성자' },
        { name: '정하늘', dept: '보험심사팀', title: '팀장', role: '검토자' },
        { name: '오세훈', dept: '적정진료관리실', title: '실장', role: '승인자' },
      ],
    },

    /* ── 의무기록 OCR ── */
    "agent-ocr": {
      headerDesc: '스캔 의무기록·외부 진료의뢰서를 텍스트로 변환하고 개인정보를 마스킹',
      specialModeKeyword: '진료의뢰',
      specialModeDesc: '외부 의뢰서 양식 자동 인식 · 진단·처방 항목 구조화 · 상병 코드 연동',
      specialModeBadge: '진료의뢰서 특화',
      tableCaption: '감지된 표 — 검사 결과 요약',
      sampleFiles: [
        { name: '외부의료기관_진료의뢰서_스캔.pdf', size: '1.8MB', pages: 2, type: 'pdf' },
        { name: '타원_검사결과지.jpg', size: '940KB', pages: 1, type: 'img' },
      ],
      docModeOptions: [
        { value: 'standard', label: '표준 모드', desc: '범용 문서 인식' },
        { value: 'compensation', label: '진료의뢰서 특화', desc: '의뢰·회신 양식 최적화' },
      ],
      extractedText: `진 료 의 뢰 서

의뢰 기관: 한마음가정의학과의원
의뢰 일자: 2026년 3월 14일
환자 성명: 이서준
생년월일: 1988-05-21
연 락 처: 010-2345-6789
주    소: 서울특별시 성동구 왕십리로 210

[의뢰 사유]
3일 전부터 시작된 우하복부 통증으로 내원하였습니다.
압통 및 반발통이 관찰되며 미열(37.9℃)이 동반되었습니다.
본원 검사상 백혈구 13,800/μL으로 상승 소견 보입니다.
급성 충수염 의심되어 정밀 검사 및 처치 의뢰드립니다.

[현재 투약]
- 아세트아미노펜 650mg 1일 3회
- 특이 알레르기력 없음

[첨부 검사]
혈액검사 결과지 1부, 복부 초음파 판독지 1부

의뢰 의사: 박준서 (면허번호 제98765호)`,
      maskedText: `진 료 의 뢰 서

의뢰 기관: 한마음가정의학과의원
의뢰 일자: 2026년 3월 14일
환자 성명: 이○○
생년월일: 1988-**-**
연 락 처: 010-****-6789
주    소: 서울특별시 성동구 ***

[의뢰 사유]
3일 전부터 시작된 우하복부 통증으로 내원하였습니다.
압통 및 반발통이 관찰되며 미열(37.9℃)이 동반되었습니다.
본원 검사상 백혈구 13,800/μL으로 상승 소견 보입니다.
급성 충수염 의심되어 정밀 검사 및 처치 의뢰드립니다.

[현재 투약]
- 아세트아미노펜 650mg 1일 3회
- 특이 알레르기력 없음

[첨부 검사]
혈액검사 결과지 1부, 복부 초음파 판독지 1부

의뢰 의사: 박준서 (면허번호 제98765호)`,
      maskLog: [
        { type: '성명', original: '이서준', masked: '이○○', pos: '9행 7열' },
        { type: '생년월일', original: '1988-05-21', masked: '1988-**-**', pos: '10행 7열' },
        { type: '연락처', original: '010-2345-6789', masked: '010-****-6789', pos: '11행 7열' },
        { type: '주소', original: '서울특별시 성동구 왕십리로 210', masked: '서울특별시 성동구 ***', pos: '12행 7열' },
      ],
      tableData: {
        headers: ['검사 항목', '결과', '단위', '참고치', '판정', '검사일'],
        rows: [
          ['백혈구(WBC)', '13,800', '/μL', '4,000~10,000', '높음', '2026.03.14'],
          ['호중구 비율', '84.2', '%', '40~70', '높음', '2026.03.14'],
          ['C-반응성단백', '6.2', 'mg/dL', '0~0.5', '높음', '2026.03.14'],
          ['헤모글로빈', '14.1', 'g/dL', '13~17', '정상', '2026.03.14'],
          ['혈소판', '242,000', '/μL', '150,000~400,000', '정상', '2026.03.14'],
        ],
      },
      confidenceMap: [
        { line: '진 료 의 뢰 서', score: 99.4, level: 'high' },
        { line: '의뢰 기관: 한마음가정의학과의원', score: 98.1, level: 'high' },
        { line: '의뢰 일자: 2026년 3월 14일', score: 98.8, level: 'high' },
        { line: '환자 성명: 이서준', score: 97.2, level: 'high' },
        { line: '생년월일: 1988-05-21', score: 96.5, level: 'high' },
        { line: '3일 전부터 시작된 우하복부 통증으로 내원', score: 94.3, level: 'high' },
        { line: '압통 및 반발통이 관찰되며 미열(37.9℃) 동반', score: 88.7, level: 'med' },
        { line: '백혈구 13,800/μL으로 상승 소견', score: 91.2, level: 'high' },
        { line: '아세트아미노펜 650mg 1일 3회', score: 84.1, level: 'med' },
        { line: '의뢰 의사: 박준서 (면허번호 제98765호)', score: 72.6, level: 'low' },
      ],
    },

    /* ── EMR 조회 ── */
    "agent-dbquery": {
      headerSubtitle: '입원 에피소드 · 보험청구 · 병상운영 자연어 검색',
      dbStatusLabel: 'EMR DB 연결됨',
      emptyTitle: '진료·청구 데이터를 자연어로 조회하세요',
      dbSources: [
        { key: 'building', label: '입원 에피소드', desc: '입원·퇴원 이력, 주상병, 재원일수, 병동' },
        { key: 'land', label: '보험청구', desc: '청구 건별 금액·유형·심사 결과·삭감 내역' },
        { key: 'lup', label: '병상 운영', desc: '병동별 병상 가동·입원 제한·격리병상 현황' },
      ],
      permissionLevels: [
        { id: 'general', label: '일반 조회', desc: '비식별 통계 범위', badge: 'bg-gray-100 text-gray-600' },
        { id: 'manager', label: '진료부서', desc: '담당 환자 식별정보 포함', badge: 'bg-blue-100 text-blue-700' },
        { id: 'evaluator', label: '보험심사', desc: '청구·심사 전체 데이터', badge: 'bg-violet-100 text-violet-700' },
      ],
      quickQueries: [
        '3월 외과 입원 중 재원일수 7일 넘는 환자 보여줘',
        '2월 청구 건 중 삭감된 건 전부 조회해줘',
        '지금 가동률 90% 넘는 병동 알려줘',
        '심사 보류 상태로 남아 있는 청구 건 조회',
      ],
      queryHistory: [
        { id: 'q1', query: '3월 입원 중 재원일수 초과 환자', date: '2026.03.21', rows: 8, ms: 420 },
        { id: 'q2', query: '2월 삭감 청구 내역', date: '2026.03.18', rows: 4, ms: 380 },
        { id: 'q3', query: '병동별 병상 가동 현황', date: '2026.03.17', rows: 5, ms: 260 },
        { id: 'q4', query: '응급 경유 입원 비율', date: '2026.03.14', rows: 12, ms: 510 },
      ],
      buildingRows: [
        { jibun: 'P-24-0318', buildingName: '외과', structure: 'K35.8 급성 충수염', yongdo: '응급', area: 7, floor: '7East', year: 2026, status: '정상' },
        { jibun: 'P-24-0322', buildingName: '내과', structure: 'J18.9 폐렴', yongdo: '외래', area: 11, floor: '8West', year: 2026, status: '소명필요' },
        { jibun: 'P-24-0331', buildingName: '정형외과', structure: 'S72.0 대퇴골 골절', yongdo: '응급', area: 14, floor: '6East', year: 2026, status: '소명필요' },
        { jibun: 'P-24-0345', buildingName: '내과', structure: 'E11.9 2형 당뇨병', yongdo: '외래', area: 5, floor: '8West', year: 2026, status: '정상' },
        { jibun: 'P-24-0350', buildingName: '신경과', structure: 'I63.9 뇌경색', yongdo: '응급', area: 16, floor: '9East', year: 2026, status: '소명필요' },
        { jibun: 'P-24-0358', buildingName: '외과', structure: 'K80.2 담낭결석', yongdo: '외래', area: 4, floor: '7East', year: 2026, status: '정상' },
        { jibun: 'P-24-0361', buildingName: '호흡기내과', structure: 'J44.9 만성폐쇄성폐질환', yongdo: '응급', area: 9, floor: '8West', year: 2026, status: '정상' },
        { jibun: 'P-24-0367', buildingName: '비뇨의학과', structure: 'N20.0 신장결석', yongdo: '외래', area: 3, floor: '6West', year: 2026, status: '정상' },
      ],
      landRows: [
        { jibun: 'C-2602-0118', jimok: '입원', area: 4820000, ownership: '건강보험', zoning: '삭감', pnu: 'R-2602-0118', landPrice: 312000 },
        { jibun: 'C-2602-0146', jimok: '입원', area: 6140000, ownership: '건강보험', zoning: '정상', pnu: 'R-2602-0146', landPrice: 0 },
        { jibun: 'C-2602-0173', jimok: '외래', area: 380000, ownership: '의료급여', zoning: '보류', pnu: 'R-2602-0173', landPrice: 0 },
        { jibun: 'C-2602-0201', jimok: '입원', area: 8950000, ownership: '자동차보험', zoning: '삭감', pnu: 'R-2602-0201', landPrice: 540000 },
        { jibun: 'C-2602-0228', jimok: '응급', area: 1270000, ownership: '건강보험', zoning: '정상', pnu: 'R-2602-0228', landPrice: 0 },
      ],
      lupRows: [
        { jibun: '7East', zoning: '외과계 병동', district: '수술 후 관리', restrictions: ['가동률 94%', '신규 배정 제한'], fireZone: '음압 2床' },
        { jibun: '8West', zoning: '내과계 병동', district: '', restrictions: ['가동률 88%'], fireZone: '' },
        { jibun: '9East', zoning: '신경계 병동', district: '뇌졸중 집중', restrictions: ['가동률 91%', '신규 배정 제한'], fireZone: '' },
        { jibun: '6East', zoning: '정형외과 병동', district: '', restrictions: ['가동률 76%'], fireZone: '' },
        { jibun: 'ICU', zoning: '중환자실', district: '집중치료', restrictions: ['가동률 92%', '전실 대기 3명'], fireZone: '음압 4床' },
      ],
      sqlMap: {
        building: `SELECT patient_key, dept_name, main_dx, admit_route,
       los_days, ward_code, admit_year, review_status
  FROM emr.inpatient_episode
 WHERE admit_date BETWEEN '2026-03-01' AND '2026-03-31'
   AND los_days > 7
 ORDER BY los_days DESC;`,
        land: `SELECT claim_no, care_type, claim_amount, payer_type,
       review_result, receipt_no, reduced_amount
  FROM insurance.claim
 WHERE claim_month = '2026-02'
   AND review_result IN ('삭감', '보류')
 ORDER BY reduced_amount DESC;`,
        lup: `SELECT ward_code, ward_type, focus_program,
       occupancy_rate, admission_hold, isolation_beds
  FROM emr.ward_status
 WHERE snapshot_at = CURRENT_DATE
 ORDER BY occupancy_rate DESC;`,
      },
      statsBySource: {
        building: [
          { label: '조회 건수', value: '8건', icon: 'table', color: 'text-blue-600' },
          { label: '평균 재원일수', value: '8.6일', icon: 'trend', color: 'text-violet-600' },
          { label: '소명 필요', value: '3건', icon: 'filter', color: 'text-amber-600' },
          { label: '응답 시간', value: '420ms', icon: 'clock', color: 'text-gray-500' },
        ],
        land: [
          { label: '조회 건수', value: '5건', icon: 'table', color: 'text-blue-600' },
          { label: '삭감 건', value: '2건', icon: 'filter', color: 'text-rose-600' },
          { label: '삭감 금액', value: '85.2만원', icon: 'trend', color: 'text-amber-600' },
          { label: '권한 확인', value: '보험심사', icon: 'shield', color: 'text-violet-600' },
        ],
        lup: [
          { label: '조회 병동', value: '5개', icon: 'table', color: 'text-blue-600' },
          { label: '평균 가동률', value: '88.2%', icon: 'trend', color: 'text-amber-600' },
          { label: '배정 제한', value: '2개 병동', icon: 'filter', color: 'text-rose-600' },
          { label: '응답 시간', value: '260ms', icon: 'clock', color: 'text-gray-500' },
        ],
      },
      permissionNotices: {
        general:   '비식별 정보(등록번호 대체키·진료과·재원일수)에 한해 조회 가능합니다.',
        manager:   '환자 식별정보 및 청구 이력이 포함됩니다.',
        evaluator: '전체 데이터(진단·처방·청구·심사결과) 조회 가능 — 의료법·개인정보보호법 준수 필요.',
      },
      buildingColumns: [
        { key: 'jibun', label: '등록번호' },
        { key: 'buildingName', label: '진료과' },
        { key: 'structure', label: '주상병' },
        { key: 'yongdo', label: '입원경로' },
        { key: 'area', label: '재원일수' },
        { key: 'floor', label: '병동' },
        { key: 'year', label: '입원연도' },
        { key: 'status', label: '심사상태' },
      ],
      landColumns: ['청구번호', '진료구분', '청구금액(원)', '청구유형', '심사결과', '접수번호', '삭감금액(원)'],
      lupColumns: ['병동', '병상구분', '가동상태', '입원제한', '격리병상'],
      restrictedNotice: '청구금액·삭감 정보는 관리자 이상 권한에서 조회 가능합니다.',
    },

    /* ── 상병·수가 코드 표준화 ── */
    "agent-address": {
      headerDesc: '상병명·처치명을 표준 코드로 정규화하고 청구 기준과 대조',
      headerStatus: '표준코드 DB 연결됨',
      /* 주소 유형 카드는 병원 업무에 해당 없음 — 기준정보 매핑(master) 단일 유형으로 운영 */
      modeTypes: [
        { m: 'master', icon: '🔗', label: '코드 표준화', desc: '진료과별 자유 기재 상병·처치명을 표준 코드 체계로 매핑', color: 'indigo' },
      ],
      masterMapping: {
        subtitle: '진료과에서 자유 기재된 상병·처치명을 KCD·EDI 표준 코드로 매핑합니다',
        pipeline: [
          { label: '원본 수집', sub: 'EMR 기재 항목 추출 중', ms: 1200 },
          { label: '용어 정규화', sub: '약어·오탈자·동의어 정리 중', ms: 1400 },
          { label: '표준 코드 매칭', sub: 'KCD-8 · EDI 코드 대조 중', ms: 1600 },
          { label: '청구 기준 검증', sub: '급여 적용 기준 대조 중', ms: 1300 },
        ],
        scopes: [
          { key: 'dx', label: '상병명', count: 2140, desc: '진료과 자유 기재 진단명' },
          { key: 'rx', label: '처치·수술명', count: 1380, desc: '수술기록·처치 오더 명칭' },
          { key: 'mat', label: '치료재료', count: 860, desc: '재료 마스터 등재 항목' },
        ],
        summary: [
          { label: '수집 항목', value: '4,380건', sub: '상병 2,140 · 처치 1,380 · 재료 860', tone: 'base' },
          { label: '표준 코드 매핑', value: '68%', sub: '2,978건 매핑 완료', tone: 'base' },
          { label: '미매칭', value: '1,402건', sub: '자유 기재·약어·비급여 항목', tone: 'warn' },
          { label: '청구 반영률', value: '74%', sub: '미매칭 항목은 자동 심사 대상에서 제외', tone: 'warn' },
        ],
        readiness: {
          level: 2, max: 5, label: '표준화 성숙도 2단계',
          note: '코드 체계는 정의되어 있으나 진료과별 기재 방식이 통일되지 않아 자동 심사 적용 범위가 제한됩니다.',
          levels: ['기재 자유', '체계 정의', '규칙 적용', '자동 검증', '전면 자동화'],
        },
        naming: {
          pattern: 'KCD8-<대분류>-<세분류>-<측/차수>',
          example: 'KCD8-K35-80-R',
          note: '측(좌/우)·차수가 필요한 상병은 접미 세그먼트를 반드시 포함해야 청구 시 반려되지 않습니다.',
          segments: [
            { seg: 'KCD8', label: '코드 체계', desc: '한국표준질병사인분류 제8차 개정' },
            { seg: 'K35', label: '대분류', desc: '급성 충수염' },
            { seg: '80', label: '세분류', desc: '상세불명의 급성 충수염' },
            { seg: 'R', label: '측/차수', desc: '해당 시 좌(L)·우(R)·재수술 차수 표기' },
          ],
        },
        rows: [
          { src: '급성 맹장염', srcSystem: 'EMR 진단명', suggest: 'K35.80', name: '상세불명의 급성 충수염', unit: '상병', conf: 96, status: 'auto',
            basis: [{ label: '동의어 사전', detail: '"맹장염"은 충수염의 관용 표현으로 표준 사전에 등재' }, { label: '진료 기록 대조', detail: '수술기록의 충수절제술과 정합' }],
            alts: [{ code: 'K35.２', name: '전반적 복막염을 동반한 급성 충수염', conf: 41, reason: '복막염 기재 없음' }], convert: '' },
          { src: '충수절제술(복강경)', srcSystem: '수술 오더', suggest: 'Q2861', name: '복강경하 충수절제술', unit: '처치', conf: 94, status: 'auto',
            basis: [{ label: '수가 마스터', detail: '접근법(복강경) 명시로 개복술과 구분 가능' }], alts: [{ code: 'Q2860', name: '충수절제술', conf: 52, reason: '개복 접근법 코드' }], convert: '' },
          { src: 'CRP 정량', srcSystem: '검사 오더', suggest: 'D2620', name: 'C-반응성단백 정량검사', unit: '처치', conf: 92, status: 'auto',
            basis: [{ label: '검사 코드 사전', detail: '정성/정량 구분 기재로 단일 후보 확정' }], alts: [], convert: '' },
          { src: 'CVC 삽입', srcSystem: '처치 오더', suggest: 'M6103', name: '중심정맥관 삽입술', unit: '처치', conf: 71, status: 'review',
            basis: [{ label: '약어 사전', detail: 'CVC = Central Venous Catheter로 확장' }, { label: '확인 필요', detail: '초음파 유도 여부에 따라 산정 코드가 달라짐' }],
            alts: [{ code: 'M6104', name: '초음파 유도하 중심정맥관 삽입술', conf: 64, reason: '유도 방식 미기재' }], convert: '' },
          { src: '항생제 IV 7일', srcSystem: '처방 오더', suggest: '-', name: '투여 기간 기재 방식 비표준', unit: '처치', conf: 48, status: 'review',
            basis: [{ label: '확인 필요', detail: '약제 성분명이 아닌 계열로 기재되어 코드 확정 불가' }], alts: [], convert: '성분명·역가·투여경로 분리 기재로 변환 필요' },
          { src: '환자 요청 처치', srcSystem: 'EMR 진단명', suggest: '-', name: '표준 코드 없음', unit: '상병', conf: 0, status: 'none',
            basis: [{ label: '매핑 불가', detail: '비급여 항목이거나 진료 내용이 특정되지 않은 자유 기재' }], alts: [], convert: '' },
          { src: '경과관찰', srcSystem: '진단명', suggest: '-', name: '표준 코드 없음', unit: '상병', conf: 0, status: 'none',
            basis: [{ label: '매핑 불가', detail: '진단이 아닌 진료 계획 기재 — 코드 대상 아님' }], alts: [], convert: '' },
        ],
        reasons: [
          { label: '약어·비표준 표기', count: 512, action: '약어 사전 확장 후 재매핑 (AI 처리 가능)' },
          { label: '성분·역가 미분리 처방', count: 386, action: '처방 입력 양식 분리 (시스템 개선 필요)' },
          { label: '측/차수 누락', count: 274, action: '기재 규칙 안내 후 재기재 (진료과 협조)' },
          { label: '비급여·자유 기재', count: 168, action: '별도 원내 코드 부여 (표준 코드 대상 아님)' },
          { label: '진단 아닌 계획 기재', count: 62, action: '기재 위치 변경 — 매핑 대상에서 제외' },
        ],
        crossMatch: {
          systems: ['EMR', '청구시스템', '수가 마스터', '검사시스템'],
          cells: [
            [null, 74, 68, 81],
            [74, null, 92, 58],
            [68, 92, null, 63],
            [81, 58, 63, null],
          ],
        },
        apply: {
          label: '자동 확정 반영', before: '68%', after: '87%', autoCount: 834, reviewCount: 568,
          note: '신뢰도 90% 이상 834건을 자동 확정하면 표준화율이 68%→87%로 올라갑니다. 나머지 568건은 진료과 확인이 필요하며, 이 중 230건은 기재 양식 개선 없이는 해소되지 않습니다.',
        },
      },
    },

    /* ── 진료데이터 분석 ── */
    "agent-dataanalysis": {
      headerDesc: '청구·재원 데이터를 업로드해 삭감 위험과 병상 운영을 분석',
      barCaption: '진료과별 삭감률 (2026.3 기준) · 단위: %',
      sampleFiles: [
        { id: 'f1', name: '2026년_1분기_청구내역.xlsx', rows: 1284, cols: 18, size: '2.1 MB' },
        { id: 'f2', name: '병동별_병상운영_일별.csv', rows: 2730, cols: 11, size: '1.4 MB' },
        { id: 'f3', name: '응급실_내원_시간대별.xlsx', rows: 892, cols: 9, size: '780 KB' },
      ],
      statsTable: [
        { metric: '월 청구 건수', value: '342건', change: '+4.6%', status: '정상' },
        { metric: '삭감 위험 사전탐지', value: '18건', change: '+2건', status: '주의' },
        { metric: '실제 삭감 건수', value: '4건', change: '-3건', status: '개선' },
        { metric: '평균 재원일수', value: '8.6일', change: '-0.4일', status: '개선' },
        { metric: '응급실 평균 체류시간', value: '4.8시간', change: '+0.6시간', status: '주의' },
        { metric: '병상 가동률', value: '88.2%', change: '+2.1%p', status: '주의' },
      ],
    },
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
      { agentId: "agent-meeting",      agentName: "회의록 정리", time: "오늘 14:32", result: "SUH-회의록-0710.hwp 생성" },
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
