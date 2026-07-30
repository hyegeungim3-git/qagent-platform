# GenOS — 멀티 도메인 생성형 AI 플랫폼 데모

> **이 문서는 모든 AI 모델(Fable 5, Opus, Sonnet 등)과 세션의 공통 진입점이다.**
> 작업 시작 전 반드시 끝까지 읽고, 규모 있는 작업 후에는 이 문서의 "현재 상태"를 갱신하라.
>
> ## 🔑 처음 이어받는 모델이라면 (승계 온보딩)
> Fable 5가 아니어도 같은 수준을 재현하도록 설계돼 있다. 순서대로:
> **[docs/HANDOVER.md](docs/HANDOVER.md)**(온보딩 프로토콜 + 자격 게이트 6문 + 캘리브레이션) →
> **[docs/DECISIONS.md](docs/DECISIONS.md)**(왜 지금 모습인가 — 불변식/ADR) → 이 문서 나머지.
> 이 저장소의 모든 변경 작업은 **`genos-work` 스킬**이 진입점(표준 루프). 왜 이 체계인지: 품질은 모델이 아니라 체계에서 나온다(`~/.claude/guides/품질기준-마스터.md` §0).

## 1. 프로젝트 정체

- **본질**: 특정 조직 전용 데모가 아니라, **도메인(발주처)을 갈아끼울 수 있는 범용 AI 에이전트 플랫폼**.
  코어 플랫폼(도메인 중립)과 도메인 팩(콘텐츠)의 2층 구조를 절대 무너뜨리지 말 것.
- **스택**: React 19 + Vite 7 + Tailwind CSS v4. 백엔드 없음 — 모든 AI 응답은 mock 시뮬레이션.
- **구성**: 포털 선택(RootApp) → 사용자 포털(UserApp: 일반/에이전트/보안 3탭, 10개 에이전트) + 관리자 시스템(App: 45개 페이지).

## 2. 배포·버전 (역할을 혼동하지 말 것)

| 역할 | 주소 | 저장소/참조 |
|---|---|---|
| **v3 개발 라인 (push 대상)** | https://hyegeungim3-git.github.io/reb-ai-platform-v3/ | **origin = reb-ai-platform-v3** 의 `main` |
| **v2 동결 (2026-07-12, 시각 보완 07-13)** | https://hyegeungim3-git.github.io/reb-ai-platform-v2/ | remote명 `v2` — main = v2.0 트리 + 오케스트레이션 UI 세련화(순수 시각). **v2.0 태그는 원본 보존**. 기능 개발 push 금지, 시각 보완만 예외 |
| v2.0 초기 스냅샷 (7/5 동결) | https://hyegeungim3-git.github.io/reb-ai-platform/ | remote명 snapshot |
| v1.0 안정 버전 | https://hyegeungim3-git.github.io/genos-app/ | genos-app |

- `main` push 시 GitHub Actions로 자동 배포. 배포 확인: `gh run watch <id> --exit-status`
- 실패한 런은 `rerun --failed` 금지(아티팩트 중복) — 새 런을 실행할 것.

## 3. 아키텍처 — 도메인 팩 시스템

```
src/
├── domains/            ← 도메인 팩 (콘텐츠 계층)
│   ├── index.js        ← 레지스트리 + localStorage('genos.activeDomain') + mergeAgentTeams()
│   ├── _template.js    ← 새 팩 작성용 템플릿 (레지스트리 미등록)
│   ├── reb.js          ← 한국부동산원 (기본값)
│   ├── manufacturing.js← 한빛정밀 (제조)
│   └── civic.js        ← 한성시청 (공공행정)
├── RootApp.jsx         ← 포털 선택 + 도메인 스위처. domain을 UserApp/App에 prop으로 주입
├── UserApp.jsx         ← 컴포넌트 상단에서 도메인 프로파일을 상수로 주입(shadowing) 후 사용
├── App.jsx             ← 관리자 (5,900줄 모놀리식 — 분해 예정. 콘텐츠는 아직 REB 고정)
└── user/
    ├── data/constants.js  ← 도메인 중립 기본값 + MODES/MCP_TOOLS 등 코어 데이터
    ├── data/responses.js  ← REB용 AI 응답·문서 템플릿
    └── components/agents/ ← 10개 에이전트 (내부 mock은 아직 REB 고정)
```

- **새 도메인 추가 = 팩 파일 1개 + index.js 등록.** 코어 파일 수정이 필요해지면 설계 위반이니 먼저 코어를 일반화하라.
- 상세 작성법: **[docs/DOMAIN-PACK-GUIDE.md](docs/DOMAIN-PACK-GUIDE.md)** (스키마 전체 + 콘텐츠 품질 기준)
- 검수 절차: **[docs/QUALITY-CHECKLIST.md](docs/QUALITY-CHECKLIST.md)** (필수 — 완료 보고 전 실행)

## 4. 작업 규칙 (위반 시 실제 사고 이력 있음)

1. **파일 수정은 Edit 도구만.** PowerShell `-replace`/`Set-Content`는 한글 파일을 파괴한다.
   대량 치환은 Python(`io.open(..., encoding='utf-8')`)으로, 실행 후 스크립트 삭제.
2. git 커밋 메시지에 쌍따옴표(") 금지 — here-string `@'...'@` 사용 (닫는 `'@`는 줄 시작).
3. Bash 도구의 상대경로는 매 호출 초기화됨 — `cd /c/한국부동산원/genos-app && ...` 형태로.
4. **완료 = 빌드 통과 + 브라우저 DOM 검증 + 증거 제시.** "될 겁니다" 금지.
   - **⚠️ 이 머신에서 `npx vite build`는 한글 경로(C:\한국부동산원) 때문에 "✓ N modules transformed" 직후 네이티브 크래시(0xC0000409)로 조용히 죽는다** (Tailwind v4 네이티브 모듈 × 한글 cwd, 2026-07-05 진단). "transformed" 라인만 보고 통과 판정 금지 — **종료 코드 0 + "✓ built in Xs" + dist/ 타임스탬프 갱신**까지 확인할 것.
   - 로컬 빌드 검증법: 프로젝트를 ASCII 경로로 복사 후 빌드 — `robocopy C:\한국부동산원\genos-app %TEMP%\genos-build /E /XD C:\한국부동산원\genos-app\.git C:\한국부동산원\genos-app\dist` (⚠️ /XD에 상대명 `dist`를 쓰면 node_modules\vite\dist까지 제외돼 빌드가 깨진다 — 절대경로 필수) → 그 폴더에서 `node node_modules\vite\bin\vite.js build` (약 5초, EXIT 0 확인) → 복사본 삭제. 또는 push 후 CI 빌드(`gh run watch`)로 갈음.
   - 빌드: `npx vite build` (2,411 모듈 기준, 2-C 이후)
   - 실행: 프리뷰 서버(.claude/launch.json `genos-app`). 포트는 launch.json상 5174이나 점유 시 다른 포트로 배정되므로 **시작 로그의 실제 포트를 따를 것**. 다른 세션의 dev 서버가 점유 중이면 `PORT=<빈포트> npm run dev`를 백그라운드로 직접 기동.
   - DOM 검증이 스크린샷보다 우선. 검증 스크립트는 QUALITY-CHECKLIST.md 참조. Chrome 확장 미연결 시 puppeteer-core(스크래치패드에 설치) + 로컬 Chrome headless로 검증 가능.
5. 하드코딩 금지 원칙: 조직·업무 콘텐츠를 코어 파일(UserApp/AgentHub/App)에 문자열로 넣지 말 것.
   도메인 팩 필드로 공급하고, 코어에는 REB 기본값 fallback만 남긴다.

## 5. 현재 상태 (2026-07-05)

- ✅ 1단계 P0: 관리자 KOGAS 잔재 제거(324건), 빈 mock·[TEST] 정리, 중복 마운트 제거, 미사용 로고·의존성 제거
- ✅ 2단계 기반: 도메인 팩 아키텍처(3팩), 포털 스위처, Claude Fable 5 플래그십 모델(보안 게이트웨이 서사)
- ✅ 2-A: App.jsx 5,935줄 → admin/(mocks.js + common.jsx + pages/12그룹) + 라우팅 223줄. 분해 중 잠복 버그 발견·수정(HrSyncPage Info 아이콘 미임포트 → HR 메뉴 클릭 시 관리자 전체 크래시였음)
- ✅ 2-B: useAgentSimulation 훅(src/user/hooks/)으로 8개 에이전트 시뮬레이션 통합, cn() 14곳 → utils.jsx 단일화
- ✅ 허브 13종 확장: 미사용이던 Translate·DocReview·SafetyPlan을 재등록 (agent-translate·agent-review·agent-safety, 도메인 팩 3곳 오버라이드 완비)
- ✅ 2-C: UserApp 2,173줄 → 430줄(상태·핸들러·조립) + layout 5모듈(Sidebar·ChatHeader·ChatMessages·ChatInput·RightPanel) + modals 7모듈 + guardrails.js. 동작 변화 없음(전 회귀 통과). 우측 패널 전용 상태(panelTab·내RAG)는 RightPanel로 이관, 죽은 상태 pilotService 제거. 부수 발견: 이 머신 로컬 빌드가 한글 경로 탓에 7주간 조용히 깨져 있었음(작업 규칙 4 참조) + 락파일에 이전 세션의 rollup 4.59 잔재 정리 + tailwind 4.1.18→4.3.2
- ✅ 3단계-지도: **지도 인텔리전스** — GENERAL 채팅에서 지역 질의 감지 시 SVG 타일 히트맵+recharts 시계열 카드 삽입. 코어(user/mapIntel.js 매칭·응답 생성 + components/MapIntelCard.jsx lazy 카드) + 팩 3종 mapIntel 데이터(REB 17개 시도 공시지가 변동률 / 한빛정밀 7개 사업장 가동률 / 한성시 12개 행정동 민원 접수). 각 팩 suggestions[3]을 지도 질의로 교체. 매칭 = metricKeywords ∧ (지역명 ∨ wideKeywords). 조사(은/는·으로/로)는 받침 기반 자동 선택. 스키마: DOMAIN-PACK-GUIDE §2-2. ⚠️ 중앙 영역이 좁으면(뷰포트 <~1000) 차트 컬럼 접힘 — 4단계 반응형에서 해소 예정
- ✅ 3단계-오케스트레이션: **복합 업무 오케스트레이션** — 허브 상단 시나리오 카드에서 요청 1건이 OCR→주소/기준정보 표준화→DB조회→보고서 4개 에이전트를 릴레이하는 자동화 데모. 코어(components/agents/OrchestrationScenario.jsx lazy + AgentHub 카드 + ChatHeader 타이틀 폴백, useAgentSimulation 재사용) + 팩 3종 orchestration 필드(REB 이의신청 일괄 처리 KREA-…-041 / 한빛정밀 검사성적서 판정 HBP-품질-088 / 한성시 옥외광고물 허가 HSC-…-052). 팩에서 생략하면 카드 자체가 비노출. 스키마: DOMAIN-PACK-GUIDE §2-2, 검수: QUALITY-CHECKLIST B-3. 부수 발견: 체크리스트 robocopy `/XD dist`(상대명)가 node_modules\vite\dist까지 제외해 ASCII 복사 빌드가 깨지는 버그 → 절대경로로 수정(작업 규칙 4 반영)
- ✅ 3단계-AI기본법: **AI 기본법 대응 대시보드** — 관리자 사이드바 'AI 서비스' 섹션에 단독 메뉴(id 'aiact', Scale 아이콘). admin/pages/compliance.jsx(AiActCompliancePage) + mocks.js MOCK_AIACT_SYSTEMS(6개 시스템)·MOCK_AIACT_LABELING(6개 표시 규칙)·MOCK_AIACT_ASSESSMENTS(3건 평가). 구성: 법령 근거 배너(제31·33·34·35조) + 지표 카드 4종 + 3탭(고영향 AI 관리: 판정 필터·제34조 책무 체크리스트 모달 / 생성물 표시: 규칙 토글·적용률 바·고지문 미리보기 / 영향평가 현황: 항목별 점수 바·지적사항 조치). 콘텐츠는 관리자 관례대로 REB 고정(mocks.js) — 추후 도메인 이관 대상에 포함
- ✅ 도메인 이관(2026-07-06, 커밋 a4c5d98+bceb651): **에이전트 13종 내부 mock → 팩 agentContent** — 각 에이전트 파일 상단 `export const CONTENT_DEFAULTS`(REB 기본값·스키마 정본) + `domain.agentContent["<id>"]` 키 단위 병합. 코어 승격 필드: modeAnswers(REVIEW/TRANSLATE/REPORT/SECURE 2종)·secureSuggestions·fileData, generateDocHTML(doc, org) 조직 파라미터화. 한빛정밀·한성시청 팩 콘텐츠 완비(에이전트당 7~40키, 금칙어 0·키 대조 통과). 스키마 문서: docs/AGENT-CONTENT-SCHEMA.md. 부수 수정: AddressAgent '처음으로' ReferenceError 크래시(2-B 잠복 버그). 허용 잔존: agent-report 인쇄용 HTML 함수 2종은 팩 생략 시 REB 레이아웃(주석 명기)
- ✅ 4단계 UX 기본선(2026-07-06, 커밋 1effeff): **새로고침 대화 유지** — GENERAL 탭 대화를 localStorage(genos.convos.<도메인>)에 지속, 활성 대화 복원(SECURE는 무저장 서사 유지). **HISTORY 실동작** — 사이드바·빈화면 이력 클릭 시 저장 대화 복원 또는 팩 시드 재구성, 사용자 대화가 시드와 병합 표시. **반응형** — <768 사이드바·우측패널 오버레이+헤더 햄버거, <1280 우측패널 접힘 기본, 100dvh, 지도카드 @container 쿼리로 차트 접힘 해소. **접근성** — Esc 모달 닫기(중앙 핸들러), :focus-visible 링, 주요 아이콘 버튼 aria-label. 375/768/1280 뷰포트 검증 통과
- ✅ 관리자 이관(2026-07-06, 커밋 2960e9e+33eb522+α): **관리자 45페이지+AI기본법 → 팩 adminContent** — mocks.js 61상수 export let + `applyAdminDomain(domain)` 리졸버(페이지 import 무수정, App 렌더 최상단 호출, RootApp key로 도메인별 remount). 페이지 인라인 REB 18상수 추출(ADMIN_ 접두), ADMIN_PERSONA 페르소나 단일화(11곳). 한빛 63키·한성 64키 팩 제공(shape 기계 대조 통과). ⚠️ mocks.js 새 상수는 export let·__REB_DEFAULTS·applyAdminDomain **3곳 등록 필수**. 검수: 3도메인 × 관리자 53리프 전수 DOM 스캔 0건(도중 발견한 MCP 서버 reb.or.kr 인라인 누수 → ADMIN_MCP_SERVERS 추출로 해소), REB 회귀 통과
- ✅ 인쇄 HTML 데이터 구동화(2026-07-06): agent-report buildPressHtml/buildReportHtml이 화면 미리보기와 동일한 press·report 키 + 도메인 org(orgName·brandColor)를 소비 — **팩 추가 작업 0으로 전 도메인 인쇄물 완성** (시그니처 (args, C, org), 팩의 함수 통째 교체 계약은 유지). 브라우저 실경로 검증: REB 44KB·한빛 64KB 인쇄 HTML 캡처, 한빛 인쇄물 REB 금칙어 0·#0F766E 브랜딩. **도메인화 잔여 항목 전부 해소** — §4 한계표 이관 완료
- ✅ 열공정·예지보전 심화(2026-07-12): **오케스트레이션 다중 시나리오 + 한빛정밀 실업무 콘텐츠** — 코어가 orchestration에 객체 1개|배열 모두 허용(utils.jsx orchList, 허브 카드 N장, 라우팅 `orchestration:<idx>`, ChatHeader 연동, attachment 선택화). 한빛정밀 팩: ① 예지보전 릴레이 시나리오 추가(PRS-C03 진동 알람 → 센서조회→FFT 진단→정비지시서→위험성평가, HBP-보전-2026-102, 첨부 없는 알람 트리거형) — 공정회의록의 임계치 하향(4.5→3.5mm/s, 3/20)과 같은 세계관(RMS 4.2는 구 임계치론 미감지) ② agent-dataanalysis를 침탄 열처리 진단으로 교체(존별 온도 편차 추이·로별 경도 규격 여유·예지보전 알람 스택) ③ GENERAL 제안 카드·sampleAnswers에 열처리/예지보전 2건 ④ MES 조회 PRS-C03 설비·진동 조회 이력 연동. 검증: 3도메인 DOM(한빛 카드 2장·릴레이 완주·차트 3종·금칙어 0·콘솔 0, REB/한성 단일 카드 회귀) + ASCII 빌드 EXIT 0. 알려진 한계: 채팅 말풍선이 마크다운 미파싱(** 리터럴 노출) — 전 도메인 공통 기존 관례, 개선 백로그
- ✅ REB 실업무 심화(2026-07-12): **실거래 신고 이상거래 검증** — reb.js orchestration 배열 전환, 시나리오 2(RTMS 주간 신고 1,842건 조회 → 괴리 분석·패턴 탐지(의심 8건) → 거래신고법 제6조·조사 매뉴얼 대조 → 정밀조사 선별 보고서 KREA-시장관리-2026-057, 첨부 없는 데이터 트리거형) 추가. GENERAL 제안 '취업규칙 개정사항'(답변 없던 카드)을 '실거래 이상거래 탐지'로 교체 + sampleAnswers 신설(실거래 1건 — 미적중 시 기존 AI_RESPONSES 폴백 유지, 표준지 '매년 1월 1일' 회귀 통과). 검증: 카드 2장·릴레이 완주·한빛 회귀, ASCII 빌드 EXIT 0
- ✅ 한성시 실업무 심화(2026-07-12): **호우경보 재난 상황보고** — civic.js orchestration 배열 전환, 시나리오 2(재난 데이터 조회(신고 47건·강변동 주의수위 초과) → 위험 분석(공사 구간 임시 제방 중첩, mapIntel 강변동 서사 연결) → 풍수해 매뉴얼 대조(비상 2단계 격상) → NDMS 상황보고 1보 HSC-안전총괄과-2026-063, 이벤트 트리거형) 추가. GENERAL '복무규정'(답변 없던 카드)을 '재난 상황 확인'으로 교체 + sampleAnswers 호우 답변 1건, history h5 교체. **이로써 3도메인 모두 시나리오 2장(서류 트리거형 + 데이터/이벤트 트리거형) 체제 완성.** 검증: 카드 2장·릴레이 완주·여권 회귀, ASCII 빌드 EXIT 0
- ✅ 포털 복귀 버튼 + SFR 표기 제거(2026-07-12, 사용자 지시): RootApp onExitPortal → 사용자 포털은 ChatHeader 우측 LayoutGrid 아이콘 버튼(aria '포털 선택 화면으로'), 관리자는 상단바 '포털 선택' 버튼으로 포털 선택 화면 복귀. RFP 흔적 SFR-### 표기 전수 삭제(reb footerNote·ChatHeader 허브 부제→'멀티 에이전트 허브'·RightPanel·deployment 응답 모드·OCR/요약/규정 에이전트 부제·responses SECURE_AIRGAP·주석 RFP SFR-13) — src 내 잔존 0 (logos.js base64 우연 일치만 허용)
- ✅ XAI·알림·피드백·마감 4종(2026-07-12, 사용자 승인 A→C→B→D): ① **XAI 패키지** — XaiPanel.jsx(답변 신뢰도 게이지·근거 구성 바·'왜 이 답변인가' 접이식: 질의 변환·채택/기각 문서·판단 근거·AI 기본법 제31조 고지, 75 미만·근거 없음 시 담당자 검토 권장 HITL), 오케스트레이션 output.factors 기여도 바 + stage.review 사람 확인 지점, 팩 answer에 confidence·xai 필드(플래그십 4건 rich). ② **알림 센터** — ChatHeader 벨+드롭다운, 팩 notifications 3건×3도메인, link.agentId 딥링크(orchestration:<idx>), 읽음 배지. ③ **피드백 루프** — 답변 👍👎(무동작이던 버튼 연결)+사유 칩 → localStorage genos.feedback.<도메인> → 관리자 'AI 답변 품질 관리'가 상단 병합(SECURE는 무저장). ④ **마감** — mdLite.jsx 채팅 경량 마크다운(볼드·표, React 엘리먼트 방식 XSS 안전), 사이드바 환경설정(토스트)/도움말(튜토리얼) 연결, 액션 버튼 max-md:p-2.5, 뷰포트 전환 시 오버레이 자동 닫기(resize 병행 리스너), 챗봇 <1024 출처 칩 → 모바일 오버레이. 전 항목 3도메인 DOM 검증·ASCII 빌드 EXIT 0
- ✅ 핸드오프·브리핑(2026-07-12): **채팅→에이전트 핸드오프** — 팩 agentRouting `[{keywords,agentId,reason}]` 키워드 매칭 시 GENERAL 답변 아래 '다음 단계' 이동 카드(에이전트 id 또는 orchestration:<idx>, 지도 응답 제외, UserApp이 msg.handoff 부착). **오늘의 업무 브리핑** — GENERAL 빈 화면에 팩 notifications 재사용 카드(처리 대기 N건, 클릭 딥링크). 3팩 라우팅 규칙 4~5개씩. 검증: 한빛 침탄→공정 분석 에이전트 이동, REB 실거래→시나리오 카드(오케스트레이션 제목 해석), 브리핑 클릭→예지보전 시나리오, ASCII 빌드 EXIT 0
- ✅ v2 동결 + v3 개설 + 하네스(2026-07-12): **v2 최종본을 태그 v2.0·브랜치 v2로 동결**(과정=git 이력, 결과물=태그 체크아웃으로 복원), main은 v3 개발 라인 전환(허브 배지 v3.0). **하네스 구축** — .claude/agents/(pack-author·genos-verifier) + .claude/skills/(genos-work 오케스트레이터+pitfalls 전집 / genos-pack / genos-verify+verify.mjs). verify.mjs는 puppeteer-core 헤드리스로 3도메인 금칙어·마커·카드 수·콘솔을 자동 판정(첫 실행 3도메인 PASS·EXIT 0, 실패 경로 EXIT 1 확인). docs/V3-ROADMAP.md P1~P5(라이브 엔진/팩 스튜디오/감사 추적/시나리오 빌더/접근성) 수용 기준 포함. v3 별도 저장소 분리는 사용자 저장소 생성 대기(§2)
- ✅ v3-P1 라이브 데이터 엔진(2026-07-12): 팩 liveMetric로 구동되는 1초 틱 엔진(user/liveEngine.js 순수 step — 스키마는 파일 상단 주석이 정본) + GENERAL 빈 화면 LiveMetricCard(SVG 스파크라인·임계선·배속 1×/10×/60×·'지금 대응하기'). 임계 상향 돌파 시 실시간 알림이 벨·브리핑에 도착(+토스트), recovery로 고착 방지. **진행량은 벽시계 경과×배속**(탭 스로틀 대응, 60초 분할 스텝·600초 상한). 팩 3종: 한빛 진동 RMS(3.5 임계) / REB 괴리율(30%) / 한성 수위(2.5m) — 기존 세계관 수치대와 정합. DoD 5항목 실행 증거 통과(60× 23시뮬분·범위 내·돌파4=배지+4·탭 전환 43→48분·3도메인 카드). 잡은 버그 2: setState 업데이터 내 부수효과(StrictMode 중복 알림)·백그라운드 탭 스로틀 — pitfalls §3 반영
- ✅ v3-P2 도메인 팩 스튜디오(2026-07-12): 관리자 'AI 서비스 > 도메인 팩 스튜디오'(id 'packstudio') — 베이스 팩 복제 + 폼 편집(조직·컬러·페르소나·워크스페이스·제안 카드·시나리오 제목, 빈 칸=베이스 상속) → localStorage genos.customPack 저장 → **포털 스위처 4번째 도메인**으로 즉시 시연. 레지스트리 일반화: index.js getDomain/getDomainList/buildCustomDomain(아이콘·함수는 베이스 상속 — JSON 한계), RootApp이 getDomain 경유(+삭제 후 REB 폴백). 팩 JSON 내보내기(함수 자동 제외 + _meta 승격 안내). DoD 4항목 실행 증거: 한울에너지공사 생성→스위처 4개→3탭 커스텀 렌더(인사·허브 조직명·보안)→JSON 스키마 키 누락 0→새로고침 유지→삭제 후 스위처 3개·REB 폴백. verify.mjs PASS·ASCII 빌드 EXIT 0
- ✅ v3-P3 감사 추적(2026-07-12): user/auditLog.js(도메인별 localStorage genos.audit.<id>, 상한 200) — 사용자 포털 실사용 이벤트 5종(query 신뢰도·근거 여부 / xai_open 첫 열람 / orch_complete 스테이지·HITL·문서번호 / live_alert / feedback) 수집, **SECURE 세션은 호출부에서 제외**(무저장 서사). 관리자 'AI 기본법 대응'에 4번째 탭 '감사 추적(실데이터)' — 지표 5카드(XAI 열람율=열람/질의 실측, 저신뢰·비근거 질의 등)+최근 30건 테이블+새로고침·초기화. DoD 4항목 실행 증거: 시나리오 완주 기록(릴레이 4단계·인적 확인 1지점·KREA-시장관리-2026-057) 조회, XAI 열람율 100% 실측, SECURE 질의 후 로그 불변, 초기화 동작. verify.mjs PASS·ASCII 빌드 EXIT 0
- ✅ v3-P4 시나리오 빌더(2026-07-12): 관리자 '에이전트 > 시나리오 빌더'(id 'agent.scenario') — 13종 에이전트 **선택식**(오타 방지)으로 릴레이 스테이지 2~6단계 조립(빈 필드는 자동 문구 정규화: logs·output·handoff·ms), 도메인당 최대 3개 저장(genos.customScenarios.<도메인>). 코어: user/scenarios.js **allScenarios(domain)** — 팩 orchestration 뒤에 커스텀 오버레이(코어의 시나리오 조회는 이 경로만, UserApp·ChatHeader·AgentHub 전환 완료). 허브 카드에 '커스텀' 배지. JSON 보기 = 팩 스키마 그대로(정식 승격용). DoD 3항목 실행 증거: UI로 3단계 시나리오 생성→허브 카드 3장·완주(감사 로그 자동 기록·문서번호 표시)→JSON 파싱·키 일치→삭제 복귀. verify.mjs PASS·ASCII 빌드 EXIT 0
- ✅ v3-P5 접근성·PWA(2026-07-12): **PWA** — public/(manifest.webmanifest·sw.js·icon-192/512.png System.Drawing 생성), main.jsx PROD 한정 SW 등록(BASE_URL 상대 — GH Pages base 대응). SW 전략: 내비게이션 네트워크 우선+오프라인 시 index 셸 폴백, 해시 자산 캐시 우선 런타임 적재. **접근성** — Lighthouse 접근성 96→100점(포털 main 랜드마크 추가). **verify.mjs 확장** — 도메인별 375 뷰포트 신규 로드 판정(가로 스크롤·포털 진입) 추가, 3도메인 PASS. 스코프 조정: 다크모드 전면·다국어 UI는 사유와 함께 백로그 분리(V3-ROADMAP §P5 기록). **이로써 v3 로드맵 P1~P5 전체 완료**
- ✅ v3 저장소 분리 + 백로그 + V4 로드맵(2026-07-12): **분리** — reb-ai-platform-v3 생성(origin), base '/reb-ai-platform-v3/', Pages workflow 활성화, v3 라이브 200 + App 청크 마커 3종. **v2 복원** — v2 저장소 main에 v2.0 트리 복원 커밋을 fast-forward push(비파괴 — force는 권한 거부, commit-tree 방식), v2 URL이 동결본 재서빙. **백로그** — 환경설정 모달(genos.uiPrefs): ①다크 스킨 — .genos-dark를 UserApp 루트에 스코프한 유틸 오버라이드 CSS(!important, 관리자·포털 라이트 고정, SECURE 무충돌, 파스텔 배지는 포인트로 유지) ②UI 크롬 영어 토글(user/i18n.js — 탭·새 대화·추천 질문·최근 대화·브리핑·내부망 pill, 콘텐츠는 한국어 유지 명시). 검증: 다크 실측(사이드바 #0c1425·카드 #111c33·인사말 대비), 영어 라벨 5종+콘텐츠 한국어, 새로고침 영속, 복원 후 verify.mjs PASS. ⚠️ 편집 직후 스킨이 안 먹으면 HMR 꼬임 — 풀 리로드로 판정(uppercase 라벨은 innerText 대문자 주의). **V4-ROADMAP.md** 수립(W1 실 LLM 하이브리드 / W2 멀티 사용자 결재 / W3 진짜 다국어 / W4 다크 1급 / W5 데이터 수명주기)
- ✅ 승계 체계 + 새 도메인 실전 리허설(2026-07-13): **승계 문서**(docs/DECISIONS.md 10 ADR — 왜/불변식 / docs/HANDOVER.md 온보딩+자격게이트 6문 / CLAUDE.md 최상단 포인터 / 전역 품질기준-마스터 §3-G·모델운용-플레이북 §9). 워크플로우로 **Haiku 4명이 문서만으로 자격게이트 96%(23/24)·transfers=true** 검증 후 실제 gap 4건 즉시 보강. **새빛대학교병원(hospital) 도메인 M1 추가** — 승계 문서만 따라 4번째 발주처 팩 작성(사용자 포털 완결: 3탭·시나리오 2장 완주·mapIntel 9센터·liveMetric 응급실 가동률·알림/브리핑/핸드오프·XAI·SECURE). 세계관 단일원장(청구 342→삭감 18건 SUH-보험심사팀-071 / 응급 가동률 92%·NEDOCS 178 SUH-응급의료센터-063). **리허설 발견 gap**: `_template.js`가 낡아 v3/v4 필드(liveMetric·notifications·agentRouting·secureSuggestions·modeAnswers·agentContent 등) 누락 → 현행화 완료. verify.mjs 4도메인 PASS(hospital 등록)·ASCII 빌드 EXIT 0. **M2 잔여(정직 표기)**: agentContent(13종 내부)·adminContent 미이관 → 에이전트 내부 화면·관리자는 REB 폴백(verify.mjs 미스캔 영역).
- ✅ **한빛정밀 M.AX 전면 재구성**(2026-07-13, 사용자 발주처 Needs 5종 반영): 팩 전체를 **제조 AI/M.AX(Manufacturing AI Transformation)** 관점으로 재구성. **①데이터 표준화** — 포스프레임 태그 4,820개·표준화 62%(2,988)·미매칭 1,834·MES↔SCADA 매칭률 71%·AI 준비도 레벨 2/5 (제안카드 '설비 데이터 진단'·agent-address 기준정보 표준화·agent-dbquery MES·SCADA 조회·관리자 데이터소스/배치/동기화) **②온톨로지 금형설계** — 도면 12,400장·유사도 92%·리드타임 5.2→1.8일·M-318/M-204 (제안카드 '금형 설계 지원'·**신규 시나리오 3 '금형 설계 아웃라인 자동 생성'** HBP-생산기술-2026-117·agent-knowledge 전면 재구성) **③품질예측·공정최적화** — AUC 0.91·불량률 0.42%→0.28%·변수 기여도 (제안카드 '품질 예측 분석'·agent-dataanalysis 보완, 기존 침탄로/예지보전 서사 승계) **④AX 로드맵** — 3개년(2026~2028)·27과제(제조18/사무9)·1단계 6개·연 12억/총 34억 (답변·알림·챗봇 출처원문·관리자 공지/보고) **⑤데이터 보안** — 구축형/폐쇄형/하이브리드 3안 비교·등급 4단계·롤 7종 (SECURE 4제안·modeAnswers·LLM 시스템프롬프트 v2.5.0·권한 매트릭스 7열). sampleAnswers 4→9건(전부 confidence+xai), 오케스트레이션 2→3장, agentRouting 9규칙, 에이전트 13종 검수(재구성1·보완7·유지5), adminContent 42키 보완(신규 키 추가 없음). 검증: verify.mjs **4도메인 PASS**(한빛 기준 갱신: 신규 제안카드 2종·orchCards 3), 금형 답변 DOM(M-318·M-204·리드타임·표 렌더·마크다운 리터럴 0·XAI·핸드오프), 관리자 태스크플로우 AGT-009/010 노출·REB 누수 0, node --check EXIT 0, ASCII 빌드 EXIT 0
- ✅ 오케스트레이션 UI 세련화(2026-07-13, 사용자 "너무 튄다"): 허브 시나리오 카드의 인디고→바이올렛 3-스톱 풀채도 그라디언트 제거 → **흰 카드 + 인디고 단일 포인트(아이콘 칩·CTA)**, border-2 인디고 → 얇은 slate, font-black 남발 → 웨이트 위계 회복(700/600/500), 릴레이 체인은 slate-50 인셋 존으로 2톤 분리. 같은 언어 정돈: 실행 화면 헤더 칩(인디고 플랫)·완료 카드(에메랄드 플랫, teal 제거)·AI추천 카드(단일 인디고)·실행 화면 배경(중립 slate). **라이트/다크 스킨 양쪽 견고**(흰 카드가 .genos-dark로 자동 반전, 인디고 액센트 유지) — DOM 실측 확인, 3-스톱 무지개 그라디언트 잔존 0(중립 배경 웨이시 제외), verify.mjs 4도메인 PASS·콘솔 0·ASCII 빌드 EXIT 0. **자동화 실행 버튼도 플랫 인디고로(놓쳤던 것, 커밋 1bd48f4)**. **v2 동결본에도 동일 세련화 적용**(워크트리 C:\genos-v2에서 편집→v2 remote main push, 커밋 d7157ab, CI success, v2 라이브 카드·버튼 실측 확인) — **v2.0 태그는 원본 보존**(동결 정책: 기능 push 금지, 순수 시각 보완만 예외적 허용)
- ✅ 금형 온톨로지 에이전트 내부 화면 심화(2026-07-31, 커밋 bc01700 = 코어/팩 분리 2건): **코어(KnowledgeAgent)** — ①headerTitle·headerDesc 팩 주입(하드코딩 제거, 미공급 시 REB 기본값) ②`results[].attrs` 온톨로지 속성 매칭 배지(일치=초록, 불일치=회색 — 유사도 점수의 근거를 화면에서 설명) ③`outline` 설계 아웃라인 패널(SVG 개념도 + 자동 산출 제원[출처 도면 표기] + 자동 검증 ok/warn/fail + 기대효과 before→after→delta + 실서비스 대체 지점 note). **전부 선택 필드 — 팩이 공급할 때만 렌더**(REB·한성·병원 무변화 실측). **한빛 팩** — 헤더 '금형 도면 온톨로지 검색 에이전트'(도면 12,400장·리드타임 5.2→1.8일), 상위 2개 도면에 속성 6종(소재·굽힘R·전장·홀피치·스테이지·프레스 톤수 — HBM-2211이 92.0%인 이유/HBM-1987이 아닌 이유가 대조됨), M-318 아웃라인(5스테이지 스트립 레이아웃 SVG, 제원 6종: 다이 클리어런스 편측 0.16mm·스프링백 보정 1.8°·홀 피치 38.50mm·패드 압력 1.2MPa 등, 자동 검증 4건 = 피치 8t·이격 3mm 통과 / 코너 주름·쇼트피닝 경고, DR2 검토 필요 명시). 스키마: AGENT-CONTENT-SCHEMA.md 'agent-knowledge 온톨로지 확장 필드'. 검증: 한빛 DOM 전 항목 렌더(속성 6·SVG·제원·검증·효과·note) + REB 무영향(기본 헤더·지식베이스 유지·금형 누수 0) + verify.mjs 4도메인 PASS + ASCII 빌드 EXIT 0 + CI 런 30587587516 success + 라이브 마커 6종
- ✅ 4단계 잔여 완료(2026-07-06): **에이전트 내부 화면 반응형** — 16개 파일 ~44지점(step2 워크플로우 레일 8곳 `hidden lg:flex`, 그리드 축소 24, 표 overflow-x-auto 7, 2단 비교 세로 스택, w-[px] max-w-full). 375에서 13종 전수 가로 스크롤 0, 1280 시각 무변화 검증. **aria 전수** — 아이콘 전용 버튼 ~40개 aria-label(에이전트 28 + layout/modals 12). 부수 수정: DocPreviewModal 인쇄가 generateDocHTML을 org 없이 호출하던 브랜딩 누수 → org prop 주입. 알려진 한계(문서화): <1024에서 챗봇 우측 FAQ·출처 패널 숨김(출처 칩 클릭 무반응), 문서 사본(A4 레플리카) 내부 레이아웃은 의도적 보존

## 하네스: GenOS 품질 유지 체계 (모델 무관 Fable 5 수준 재현)

**목표:** 어떤 모델이 세션을 이어받아도 같은 과정(표준 루프)·같은 결과물 품질(세계관 일관 콘텐츠 + 실행 증거 완료)을 재현한다.

**트리거:** 이 저장소의 모든 변경 작업(기능·콘텐츠·검수·배포·v3 로드맵 실행)은 `genos-work` 스킬을 사용하라. 팩 콘텐츠 작업은 `pack-author` 에이전트 + `genos-pack` 스킬, 검증은 `genos-verifier` 에이전트 + `genos-verify` 스킬(자동 스캔: `node .claude/skills/genos-verify/scripts/verify.mjs`). 단순 질문·코드 읽기만은 직접 응답 가능.

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-07-12 | 초기 구성 (에이전트 2 · 스킬 3 · verify.mjs) | 전체 | v2 동결·v3 개설과 함께 모델 무관 품질 체계 구축 |
| 2026-07-12 | pitfalls §3에 탭 스로틀·업데이터 부수효과 항목 추가 | genos-work/references/pitfalls.md | P1 구현 중 실발견 2건 반영 |
| 2026-07-12 | verify.mjs가 스캔 전 genos.uiPrefs 제거 | genos-verify/scripts/verify.mjs | 다크·영어 설정 잔재가 한국어 마커 판정 오염 방지 |
| 2026-07-12 | 승계 체계 추가 (DECISIONS.md·HANDOVER.md·CLAUDE.md 온보딩 포인터) | docs/, CLAUDE.md | Fable 5 이후 모델이 이어받거나 재현해도 같은 수준 유지 — 설계 '왜'와 온보딩 절차 외재화 |
| 2026-07-30 | pitfalls §4에 'Pages 설정 소실' 항목 추가 (일시 오류와 구분·복구법) | genos-work/references/pitfalls.md | M.AX 배포 중 configure-pages 404로 build 실패 — 새 런 재시도 2회 낭비 후 원인 판명 |

## 6. 다음 세션 표준 지시문 (사용자가 이 문구로 시작하면 그대로 수행)

- **2-C**: "genos-app/CLAUDE.md 읽고 2-C 진행해줘 — UserApp.jsx 분해. 탭·우측 패널·모달 단위로 나누되 동작 변화 없이. 검증은 docs/QUALITY-CHECKLIST.md 기준(3개 탭 + 도메인 전환 + 에이전트 실행 회귀 포함)."
- **3단계-지도**: "genos-app/CLAUDE.md 읽고 3단계 '지도 인텔리전스' 구현해줘 — GENERAL 채팅에서 지역 질의 시 응답에 지도 히트맵+시계열 차트 삽입(시뮬레이션, 외부 API 금지). 도메인 팩별 데이터(공시지가/공장 가동률/민원 발생)로."
- **3단계-오케스트레이션**: "genos-app/CLAUDE.md 읽고 '복합 업무 오케스트레이션 시나리오' 구현해줘 — 허브에 시나리오 카드 추가: 요청 1건이 OCR→주소→DB조회→보고서 4개 에이전트를 릴레이로 거치는 자동화 데모(각 도메인 팩에 시나리오 정의)."
- **3단계-AI기본법**: "genos-app/CLAUDE.md 읽고 관리자에 'AI 기본법 대응' 대시보드 추가해줘 — 고영향 AI 관리, AI 생성물 표시 의무, 영향평가 현황. admin/pages/ 구조와 기존 가드레일·신뢰성 페이지 스타일에 맞춰서."
- **도메인 이관**: "genos-app/CLAUDE.md 읽고 에이전트 내부 mock 콘텐츠를 도메인 팩으로 이관해줘 — DOMAIN-PACK-GUIDE.md §4 한계표의 항목들. 코어에 팩 필드+REB fallback 추가 커밋과 팩 콘텐츠 커밋을 분리."
- **4단계 P2**: "genos-app/CLAUDE.md 읽고 4단계 UX 기본선 작업해줘 — 반응형(고정폭 사이드바·패널), 접근성(aria·Esc·포커스), 새로고침 시 대화 유지, HISTORY 탭 실동작. 375/768/1280 뷰포트 검증 포함."
- **v3 로드맵 실행**: "genos-app/CLAUDE.md 읽고 docs/V3-ROADMAP.md의 P<N> 실행해줘 — genos-work 스킬 표준 루프(착수→구현→genos-verify 검증→배포→기록)를 따르고, 수용 기준(DoD) 전 항목의 실행 증거를 보고에 포함."

공통 규칙: 완료 전 docs/QUALITY-CHECKLIST.md 실행, CLAUDE.md '현재 상태' 갱신, 한국어 커밋 후 push(자동 배포).

## 7. 도메인 상수 (혼동 주의)

- REB 사용자: 김민준 과장(부동산공시처) / 관리자 페르소나: 김영빈(AI활용 업무혁신 TF)
- 브랜드: REB #003087 / 한빛정밀 #0F766E / 한성시청 #166534
- 문서번호 체계: KREA-부동산공시처-2026-NNN (REB), HBP-·HSC- 접두 (타 도메인)
