# 도메인 팩 작성 가이드

> 대상 독자: 이 플랫폼을 새 도메인(제조·금융·의료·타 공공기관 등)으로 전환하려는 **모든 AI 모델/세션**.
> 이 가이드대로 작성하면 모델에 관계없이 동일한 수준의 결과물이 나와야 한다.
> 작성 후에는 반드시 [QUALITY-CHECKLIST.md](QUALITY-CHECKLIST.md)의 "도메인 전환 검수"를 실행한다.
>
> ⚠️ **스키마 정본은 이 문서가 아니라 코드다**(DECISIONS.md ADR-7). 이 문서는 코드의 스냅샷·안내다.
> 필드 shape의 최종 계약은 각 에이전트 파일 상단 `CONTENT_DEFAULTS`·실제 소비 지점·`liveEngine.js` 주석.
> 이 문서와 코드가 어긋나면 **코드를 신뢰하고 이 문서를 즉시 갱신**하라.

## 0. 작업 순서 (요약)

1. `src/domains/_template.js`를 복사해 `src/domains/<도메인id>.js` 생성
2. 아래 §2 스키마에 따라 전 필드 작성 (§3 콘텐츠 품질 기준 준수)
3. `src/domains/index.js`에 import + `DOMAINS` + `DOMAIN_LIST` 등록
4. **`.claude/skills/genos-verify/scripts/verify.mjs`의 `DOMAINS` 배열에 판정 기준 등록** — banned(금칙어)·generalMarkers·hubMarkers·orchCards. 누락 시 새 도메인이 자동 검증에서 빠진다(index.js 등록과 나란히 반드시 함께).
5. ASCII 경로 복사 빌드(EXIT 0) → 프리뷰에서 도메인 전환 → **검수 체크리스트 + verify.mjs 실행** (빌드 판정 규칙: [DECISIONS.md ADR-3](DECISIONS.md))
6. 커밋 (한국어 메시지) → push → 배포 확인

코어 파일(RootApp/UserApp/AgentHub/App)은 **수정하지 않는 것이 정상**이다.
수정이 필요하다고 느껴지면 = 코어에 하드코딩이 남아 있다는 뜻 → 해당 문자열을 팩 필드+fallback 패턴으로 일반화하는 작업을 먼저 분리 커밋으로 수행하라.

## 1. 소비 지점 지도 (필드가 어디에 쓰이는가)

| 필드 | 소비 위치 | 화면 |
|---|---|---|
| orgShort, platformTitle, brandColor, welcome, statusBadge, footerNote, userFeatures | RootApp.jsx | 포털 선택 화면, 로딩 화면, 브라우저 탭 제목 |
| orgName | RootApp, UserApp(좌상단 로고), AgentHub(부제), App.jsx(사이드바 하단) | 전 화면 조직 표기 |
| user, workspaces, llmModels (필수) | UserApp.jsx 컴포넌트 상단 주입부 | 사용자 포털 전체 |
| suggestions, sampleAnswers, docs, history, modeDesc, agentFeed, agentCatalog (선택 — 생략 시 REB 기본값) | UserApp.jsx 주입부 및 getAIResponse | 사용자 포털 전체 |
| mapIntel (선택 — 생략 시 지도 기능 비활성) | UserApp getAIResponse → user/mapIntel.js → MapIntelCard.jsx | GENERAL 채팅 지역 질의 응답 (히트맵+시계열) |
| orchestration (선택 — 생략 시 시나리오 카드 비노출) | AgentHub.jsx(허브 상단 카드) → OrchestrationScenario.jsx | 에이전트 허브 오케스트레이션 시나리오 (4개 에이전트 릴레이 데모) |
| notifications (선택 — 생략 시 헤더 벨 비노출) | ChatHeader.jsx 알림 센터 드롭다운 + ChatMessages 빈 화면 '오늘의 업무 브리핑' | `[{id, severity:'alert'\|'warn'\|'info', title, body, time, link:{agentId}}]` — link.agentId는 에이전트 id 또는 `orchestration:<idx>` 딥링크 |
| agentRouting (선택 — 생략 시 핸드오프 카드 비노출) | UserApp handleSend → ChatMessages 답변 하단 카드 | `[{keywords:[소문자], agentId, reason}]` — GENERAL 탭 답변에 '다음 단계' 이동 카드. 선행 규칙 우선, 지도 응답에는 미부착 |
| liveMetric (선택 — 생략 시 라이브 카드·실시간 알림 비활성) | UserApp 1초 틱 엔진(user/liveEngine.js) → LiveMetricCard + 알림 센터·브리핑 병합 | 스키마·거동은 `src/user/liveEngine.js` 상단 주석이 정본. 임계 상향 돌파 시 alert가 실시간 알림으로 도착, recovery로 고착 방지. 배속 1×/10×/60× |

## 2. 스키마 레퍼런스

### 2-1. 필수 필드 (fallback 없음 — 누락 시 화면 깨짐)

```js
id: "mydomain",              // 영소문자. localStorage 키·React key로 사용
orgName: "조직명",            // 예: "한빛정밀"
orgShort: "HBP",             // 영문 약칭 2~4자. 로고·탭 제목에 사용
platformTitle: "…AI 플랫폼",  // 포털 대제목. "<조직/사업명> AI 플랫폼" 꼴
brandColor: "#0F766E",       // 조직 상징색 HEX. 기존 3팩과 겹치지 않게
welcome: "…환영합니다.",      // 포털 인사말 1문장
statusBadge: "시스템 정상 가동 중 · 로컬 LLM · <망 명칭> 분리 적용",
footerNote: "<조직> <사업명> (<연계 시스템> 데모)",  // 포털 하단 사업 표기
userFeatures: [ /* 문자열 4개 — 사용자 포털 카드의 대표 기능. 도메인 언어로 */ ],
user: { name: "홍길동", dept: "부서명", title: "직급" },   // 데모 주인공 1명
workspaces: [ // 정확히 3개 권장. icon은 lucide-react에서 import
  { id: "ws1", name: "…혁신 TF", icon: Factory, active: true },
  { id: "ws2", name: "…", icon: ClipboardCheck },
  { id: "ws3", name: "…보안… TF", icon: ShieldCheck },     // 3번째는 보안 계열 관례
],
llmModels: [ /* 5개. 아래 규칙 필수 */ ],
```

**llmModels 규칙** (보안 데모 서사가 여기에 걸려 있다):
- **배열 [0]이 곧 초기 선택 모델이다** — 코드가 `useState(LLM_MODELS[0])`로 첫 요소를 잡는다. 플랫폼 정책상 [0]에는 **Claude Fable 5** (`type:"보안 게이트웨이"`, `security:"high"`, `status:"running"`, context "400K")를 둔다. 다른 모델을 기본값으로 쓰려면 그 모델을 [0]으로 옮기면 된다(코드 수정 불필요).
- `type:"구축형"` + `status:"running"` 모델이 **최소 1개 필수** — 보안 탭 진입 시 이 조건으로 검색해 자동 전환한다. 없으면 전환 로직이 무의미해진다. 문자열 `"구축형"`은 코드와의 계약이므로 바꾸지 말 것.
- `status:"blocked"` 클라우드 모델 1개 — 가드레일 차단 데모용. 모델명은 자유(기존 3팩은 관례로 Gemini 사용).
- desc의 망 명칭(내부망/OT망/행정망)은 statusBadge와 일치시킬 것.

### 2-2. 선택 필드 (생략 시 REB 기본값으로 fallback — 생략하면 화면에 REB 콘텐츠가 노출되므로, 데모용 팩은 사실상 전부 작성해야 한다)

```js
suggestions: [ /* 4개 */ { icon: Search, iconBg: "bg-teal-50", iconColor: "text-teal-600",
  title: "8자 내외 라벨", query: "실제 입력될 질문 문장" } ],

sampleAnswers: [ /* suggestions와 짝. 최소 2개 */
  { keywords: ["절삭유", "sop"],   // 소문자로 작성 (질의가 toLowerCase()로 비교됨)
    answer: { content: "마크다운 답변…", citations: [], steps: null,
      // XAI 푸터(선택 — XaiPanel.jsx가 소비): confidence 없고 citations도 없으면 "일반 지식 · 담당자 확인 권장" 배지로 폴백
      confidence: 91,               // 0~100. 75 미만이면 '담당자 검토 권장'(HITL) 배지
      xai: {                        // 전부 선택 — sources 없으면 citations 유사도로 근거 구성 합성
        queryRewrite: "검색 질의 변환문", base: { rag: 88, model: 12 },
        sources: [{ name: "근거 문서명", similarity: 94 }],          // 표시 전용(클릭 안 됨)
        rejected: [{ name: "기각 문서명", similarity: 58, reason: "기각 사유" }],
        reasoning: "판단 근거 1~2문장 (불확실성 언급 권장)",
      } } } ],
  // citations는 반드시 빈 배열 — 인용 뷰어(FILE_DATA)는 아직 REB 전용이다. 근거 표시는 xai.sources로

modeDesc: { GENERAL: "…에 대해 자유롭게 질문하세요" },  // REVIEW/TRANSLATE/REPORT도 교체 가능

agentCatalog: { // 13개 전부 override. key는 아래 에이전트 ID 고정 목록
  "agent-chatbot":      { name: "…챗봇", shortName: "…", desc: "…합니다." },
  // agent-report / agent-meeting / agent-knowledge / agent-internalreg
  // agent-ocr / agent-dbquery / agent-address / agent-dataanalysis / agent-summary
  // agent-translate / agent-review / agent-safety
},  // name·shortName·desc만 교체됨. workflow 등 내부 단계는 base 유지 (한계: §4)

docs: [ /* 3개 — 우측 문서함 */ { id: "d1", name: "파일명.pdf", size: "2.8 MB",
  date: "2026.01.12", tags: ["대외비", "DRM 자동해제"], secLevel: "C" } ],
  // secLevel: C(대외비·빨강) / S(민감·주황) / O(공개·초록), 3건에 C·S·O 하나씩 관례
  // 3번째 문서는 "<조직명>_취업규칙(개정).hwp" 류의 내규 hwp 관례

history: [ /* 5개 — 좌측 최근 대화 */ { id: "h1", title: "…문의", mode: "GENERAL",
  time: "14:30", isToday: true, starred: true } ],
  // mode는 GENERAL/TRANSLATE/REVIEW/REPORT 를 골고루

agentFeed: { // 에이전트 탭 우측 활동 피드
  recent: [ /* 3개 */ { agentId: "agent-meeting", agentName: "회의록", time: "오늘 14:32",
    result: "<접두>-회의록-0312.hwp 생성" } ],   // agentId는 위 고정 목록 중에서
  recommendTitle: "…기한 N일 전",  recommendBody: "…확인하시겠습니까?",
  pendingBody: "2026-03-17 <부서> …회의 녹음이 미처리 상태입니다.",
},
```

```js
// 지도 인텔리전스 (3단계) — GENERAL 채팅에서 지역 질의 시 히트맵+시계열 카드 삽입. 생략하면 기능 자체가 비활성.
// 매칭 규칙: 질의에 metricKeywords 중 1개 + (regions[].keywords 또는 wideKeywords 중 1개)가 동시 포함될 때만 발동.
// suggestions 4번째를 지도 질의로 구성하는 것이 관례 (클릭 시 바로 시연되어야 함 — 검수 B-3 항목).
mapIntel: {
  metricLabel: "표준지 공시지가 변동률",  // 응답 본문·카드 헤더에 쓰이는 지표명
  unit: "%",                              // 값 단위 (%, 건 …) — 조사(은/는·으로/로)는 코어가 받침 보고 자동 선택
  regionUnit: "시도",                      // 지역 단위 명칭 (시도/사업장/행정동)
  periodLabel: "2026년 정기공시 기준",
  sourceSystem: "부동산통계정보시스템(R-ONE)",  // 처리 단계 표기용 — 그 도메인의 실제 시스템명 재사용
  sourceNote: "※ 출처: … (시뮬레이션 데이터)",   // '시뮬레이션 데이터' 표기는 반드시 유지
  mapTitle: "전국 시도별 히트맵", chartTitle: "연도별 변동률 추이",
  metricKeywords: ["공시지가", "변동률"],   // 소문자 (질의가 toLowerCase()로 비교됨)
  wideKeywords: ["시도별", "지역별", "전국", "지도"],  // 특정 지역 없이 전체를 묻는 질의 트리거
  heatLow: "#DBEAFE", heatHigh: "#1E3A8A", // 밝은색→어두운색 순서 필수 (어두운 타일엔 흰 글자 자동)
  avgLabel: "전국 평균",
  seriesLabels: ["'22", "'23", "'24", "'25", "'26"],  // 모든 series·avgSeries와 길이 일치
  avgSeries: [10.17, -5.92, 1.10, 1.42, 1.65],        // 마지막 값 ≈ regions value 평균이어야 자연스럽다
  grid: { cols: 4, rows: 6 },              // 타일 좌표계 (x/y는 이 범위 내 0-based)
  regions: [  // 7~17개. x/y는 실제 지리 배치를 근사한 타일 좌표. keywords 겹침 주의(먼저 선언된 지역이 이김)
    { id: "seoul", name: "서울", keywords: ["서울"], x: 1, y: 0, value: 3.92,
      series: [11.21, -5.86, 1.87, 3.10, 3.92],
      insight: "지역 수치의 원인·전망을 담은 도메인 언어 1~2문장." },
  ],
},
```

```js
// 복합 업무 오케스트레이션 (3단계) — 허브 상단 시나리오 카드 + "요청 1건 → 에이전트 4개 릴레이" 실행 데모. 생략하면 카드 자체가 숨겨짐.
// 객체 1개(카드 1장) 또는 배열(시나리오별 카드 1장씩)을 모두 허용 — 예: manufacturing.js의 [예지보전, 검사성적서] 2장.
// ⚠️ 코어의 시나리오 조회는 user/scenarios.js의 allScenarios(domain) 경유 — 관리자 '시나리오 빌더'가 만드는
//    커스텀 시나리오(genos.customScenarios.<도메인>, 도메인당 최대 3개)가 팩 시나리오 뒤에 이어 붙는다.
// stages[].agentId는 아래 고정 목록에서. 4단계(OCR→표준화→DB조회→보고서)가 관례이나 개수·순서는 자유.
// 각 스테이지의 output은 "다음 에이전트의 입력"이 되도록 쓰고, handoff에 무엇을 넘기는지 명시(마지막은 null).
orchestration: {
  title: "공시지가 이의신청 서류 일괄 처리",   // 그 도메인의 실제 반복 업무명
  brief: "허브 카드·헤더에 표시될 1문장 설명",
  request: "사용자가 입력할 법한 자연어 요청 1문장",
  attachment: { name: "스캔파일.pdf", pages: 18, size: "12.4 MB" },  // 선택 — 알람·이벤트 트리거형 시나리오는 생략 가능
  stages: [ // { agentId, ms(연출 시간), task(1문장), logs(3~5줄 — 시스템명·수치 포함), output:{label, items[], factors?}, review?, handoff }
    { agentId: "agent-ocr", ms: 3200, task: "…", logs: ["…"], output: { label: "OCR 추출 결과", items: ["…"] }, handoff: "추출 지번 12건을 …로 전달" },
    // XAI(선택): output.factors = [{label, pct}] 판정 기여도 바 / review = "…" 사람 확인 지점(HITL) 배지 — 분석·판정 스테이지에 권장
  ],
  result: { docNo: "KREA-…-2026-NNN", docTitle: "…검토 보고서", summary: ["…3줄"], metrics: [{ label: "처리 건수", value: "12건" } /* 4개 */] },
},
```

**에이전트 ID 고정 목록** (오타 시 조용히 무시되므로 주의):
`agent-chatbot` `agent-report` `agent-meeting` `agent-knowledge` `agent-internalreg` `agent-ocr` `agent-dbquery` `agent-address` `agent-dataanalysis` `agent-summary` `agent-translate` `agent-review` `agent-safety`

### 2-3. 에이전트 내부 콘텐츠 + 코어 승격 필드 (도메인 이관, 2026-07-06)

```js
// 에이전트 내부 화면 콘텐츠 오버라이드 — 키 단위 병합(제공한 키만 교체, 나머지는 REB 기본값)
agentContent: {
  "agent-ocr": { extractedText: "…", maskLog: [/*4*/], /* … */ },
  // 스키마 정본: 각 에이전트 파일 상단 export const CONTENT_DEFAULTS (shape 주석 포함)
  // 전체 키 목록·계약: docs/AGENT-CONTENT-SCHEMA.md
},

secureSuggestions: [ /* 4개 — SECURE 탭 제안. SUGGESTIONS와 동일 shape */ ],

modeAnswers: {  // REVIEW/TRANSLATE/REPORT 모드 + SECURE 응답 오버라이드 (answer 객체 shape)
  REVIEW: { content: "…", citations: [], steps: [/*3*/] },
  TRANSLATE: { … }, REPORT: { …, document: {/* 공문서 객체 — 생략 시 다운로드 버튼용 문서 없음 */} },
  SECURE_DEFAULT: { … }, SECURE_AIRGAP: { … },
},

fileData: { d1: { title, date, secLevel, text, highlights: [] }, … },  // 인용 뷰어 원문 (docs[].id와 일치)
// 공문서 다운로드 HTML은 generateDocHTML(doc, org)로 orgName·orgShort·brandColor 자동 주입 — 팩 작업 불필요
```

- **배열·객체는 통째 교체 계약**: agentContent의 각 키는 항목 수·필드 shape를 REB 기본값과 동일하게 유지할 것 (코어가 인덱스·키에 의존).
- 일부 키는 값 계약이 있다(예: dbSources.key 'building'|'land'|'lup' 고정, address modeTypes.m 고정) — AGENT-CONTENT-SCHEMA.md의 "고정" 표기 참조.

```js
// 관리자 콘텐츠 오버라이드 (2026-07-06 이관) — 키는 src/admin/mocks.js의 export 상수명 그대로
adminContent: {
  ADMIN_PERSONA: { name: "…", role: "관리자", dept: "…", email: "…" },  // 사이드바·작성자·프로필 페르소나
  MOCK_USERS: [ /* 8명, shape 동일 */ ],
  MOCK_AIACT_SYSTEMS: [ /* 6건 — status '고영향 확인'|'검토 중'|'비해당' 값 고정 */ ],
  // … 도메인 종속 키만 제공 (기술 중립 키는 생략 → REB 기본값). 전체 키 목록: mocks.js 하단 __RESOLVER_START__ 블록
},
```
- 리졸버: App.jsx가 렌더 시작 시 `applyAdminDomain(domain)` 호출 → mocks.js의 export let 상수가 통째 교체됨. 페이지는 상수를 직접 import(무수정).
- **mocks.js에 새 상수를 추가할 때는 ①export let ②__REB_DEFAULTS ③applyAdminDomain 3곳 등록 필수** — 누락 시 팩 오버라이드가 조용히 무시된다.
- 관리자 코드 계약 값: 상태 배지 문자열(Running/Stopped/완료/학습 중 등, common.jsx StatusBadge 맵), AIACT status·findings status, MOCK_SATISFACTION_DATA rating(good/edit/bad)은 값 유지.

## 3. 콘텐츠 품질 기준 (모델 무관 동일 수준을 위한 규칙)

1. **실물 형식 재현**: 규정은 "제N조(제목) ① …" 조문 형식, 답변엔 "※ 출처: 문서명 (개정연월), N페이지"를 붙인다. 두루뭉술한 설명문은 실격.
2. **수치는 구체적으로**: "정기적으로 점검" ✕ → "정기 조사 연 1회, 표본 검증 반기 1회" ○. 금액·기한·주기·조항번호를 만들어 넣되 상식적 범위로.
3. **고유명사 일관성**: 인물·부서·문서번호 접두(예: HBP-)·시스템명(MES, 새올 등)을 팩 전체에서 통일. 한 필드에서 만든 이름을 다른 필드가 재사용해야 실제 조직처럼 보인다.
4. **도메인 전문용어 최소 5개**: 그 업계 사람이 봐야 아는 용어(예: 제조=SOP·PM·예지보전, 행정=새올·조례·주무관)를 자연스럽게 배치. 반대로 타 도메인 용어는 0개.
5. **에이전트 이름은 업무명 기반으로**: `name`은 "<그 조직의 업무명> 에이전트/챗봇" 꼴(예: "MES 데이터 조회 에이전트"), `shortName`은 접미사 없는 축약 업무명(예: "MES 조회"). 기술 일반명("DB 검색")만 남기는 것은 실격 — 어느 조직에 갖다 놔도 말이 되는 이름이면 도메인화가 안 된 것이다.
6. **가상 조직 사용**: 실존 기업·기관명은 발주처(계약 상대)가 아닌 한 쓰지 않는다. 실존 기관은 정부부처·법령 인용(출처 표기) 용도만 허용.
7. **suggestions ↔ sampleAnswers 짝 맞춤**: 제안 질의 4개 중 최소 2개는 클릭 시 도메인 답변이 나오도록 keywords를 질의 문장의 실제 단어로 구성한다. (검수에서 클릭 테스트함)

## 4. 알려진 한계 (팩으로 아직 이관 안 된 것 — 새 도메인 데모 전 반드시 인지)

| 영역 | 현상 | 우회/계획 |
|---|---|---|
| ~~에이전트 내부 화면~~ | ✅ 이관 완료(2026-07-06) — `agentContent` 팩 필드로 키 단위 오버라이드 (§2-3) | 팩이 키를 생략하면 REB 기본값 노출 — 데모 도메인은 주요 에이전트 키를 채울 것 |
| ~~관리자 시스템~~ | ✅ 이관 완료(2026-07-06) — `adminContent` 팩 필드로 mocks.js 상수 단위 오버라이드 (§2-3). 45페이지+AI기본법 전체 | 팩이 키를 생략하면 REB 기본값(기술 중립 키는 생략이 정상). 기존 팩 2종은 63·64키 제공 완료 |
| ~~REVIEW/TRANSLATE/REPORT 응답~~ | ✅ 이관 완료 — `modeAnswers` 팩 필드 (SECURE 2종 포함, §2-3) | 생략 시 REB 기본 응답 |
| ~~인용(citations) 뷰어~~ | ✅ 이관 완료 — `fileData` 팩 필드 | 생략 시 REB FILE_DATA. 팩 sampleAnswers의 citations id가 fileData 키와 일치해야 원문 열림 |
| ~~SECURE 탭 제안~~ | ✅ 이관 완료 — `secureSuggestions` 팩 필드 | 생략 시 도메인 중립 기본 문구 |

이관 원칙(유지): 코어에 팩 필드 소비 + REB fallback을 추가하는 커밋과, 팩에 콘텐츠를 채우는 커밋을 분리하라.

## 5. 실수 사전 (이번 구축에서 실제로 겪은 것)

- 팩만 만들고 **index.js 등록을 빠뜨림** → 스위처에 안 나타남
- suggestions만 넣고 sampleAnswers 누락 → 클릭 시 "일치 항목 없음" 기본 응답 → 데모 김빠짐
- keywords를 대문자/조사 포함으로 작성 → 매칭 실패 (소문자·핵심 명사만)
- llmModels에 구축형 running 모델 없음 → 보안 탭 자동 전환이 Fable 5를 못 벗어남
- 코어 어딘가의 하드코딩(최근 대화, 문서함, 모드 설명, 활동 피드)이 도메인 전환 후 그대로 노출 → **검수 체크리스트의 금칙어 DOM 스캔으로만 잡힌다. 생략 금지**
