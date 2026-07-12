# 품질 검수 체크리스트

> **완료 보고 전 실행 필수.** "코드를 썼다"는 완료가 아니다 — 완료 = 빌드 통과 + 실행 검증 + 증거.
> 각 절의 명령/스크립트는 복사해서 그대로 실행 가능하도록 유지한다 (코드가 바뀌면 이 문서도 갱신).

## A. 모든 변경 공통

- [ ] 빌드 통과 확인 — **"transformed" 라인이 아니라 종료 코드로 판정할 것.** 이 머신은 한글 경로 탓에 transform 직후 조용히 크래시한다(CLAUDE.md 작업 규칙 4).
  ```powershell
  # ⚠️ /XD에 상대명 dist를 쓰면 node_modules\vite\dist까지 제외되어 빌드가 ERR_MODULE_NOT_FOUND로 깨진다 — 반드시 절대경로로
  robocopy C:\한국부동산원\genos-app $env:TEMP\genos-build /E /XD C:\한국부동산원\genos-app\.git C:\한국부동산원\genos-app\dist | Out-Null
  cd $env:TEMP\genos-build; node node_modules\vite\bin\vite.js build; "EXIT=$LASTEXITCODE"   # EXIT=0 + "✓ built in Xs" 필수
  cd C:\; Remove-Item -Recurse -Force $env:TEMP\genos-build
  ```
  (기준 2,411± 모듈. push 후 CI 빌드 성공으로 갈음 가능)
- [ ] 프리뷰 서버로 변경 화면 진입, **DOM 텍스트로 확인** (스크린샷은 보조 증거)
- [ ] 브라우저 콘솔 에러 0건
- [ ] 의도치 않은 파일 변경 없는지 `git status --short` 확인 후 커밋(한국어, 무엇을·왜)
- [ ] push 후 `gh run watch <id> --exit-status` 성공 + 라이브 URL 200

## B. 도메인 전환 검수 (팩 추가·수정 시 필수)

### B-1. 정적 검사

- [ ] `src/domains/index.js`에 import + DOMAINS + DOMAIN_LIST 3곳 등록됨
- [ ] **`.claude/skills/genos-verify/scripts/verify.mjs`의 `DOMAINS` 배열에 판정 기준(banned·generalMarkers·hubMarkers·orchCards) 등록됨** — 누락 시 새 도메인이 자동 검증에서 빠짐
- [ ] 필수 12필드 전부 존재 (id/orgName/orgShort/platformTitle/brandColor/welcome/statusBadge/footerNote/userFeatures/user/workspaces/llmModels)
- [ ] llmModels: [0]=Claude Fable 5(보안 게이트웨이) / 구축형+running ≥1 / blocked 클라우드 1
- [ ] agentCatalog 키 10개가 고정 ID 목록과 일치 (오타는 조용히 무시됨)

### B-2. 금칙어 DOM 스캔 (핵심 — 브라우저 프리뷰 콘솔/preview_eval에서 실행)

새 도메인으로 전환 후 **일반→에이전트→보안 3개 탭 각각**에서 실행한다.
`FORBIDDEN`은 "다른 도메인들의 고유 어휘"로 구성한다. **새 팩을 추가하면 그 팩의 어휘 목록도 여기에 추가하고 문서를 갱신할 것.**
어휘 선정 기준(팩당 6개 이상): 인물명 / 핵심 부서명 / 문서번호 접두(HBP- 등) / 조직 약칭 / 도메인 전문용어 2개 이상.

```js
(async () => {
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  // 검사할 도메인이 아닌 나머지 도메인들의 고유 어휘
  const FORBIDDEN = {
    reb:          ['공시지가','표준지','부동산','김민준','KREA','부동산공시처','이의신청'],
    manufacturing:['절삭유','프레스','MES','박태윤','HBP','생산기술팀','작업표준','예지보전'],
    civic:        ['여권','조례','민원여권과','이서연','HSC','한성시','옥외광고','주무관'],
  };
  const my = localStorage.getItem('genos.activeDomain') || 'reb';
  const bad = Object.entries(FORBIDDEN).filter(([k]) => k !== my).flatMap(([,v]) => v);
  const out = {};
  for (const tab of ['일반','에이전트','보안']) {
    [...document.querySelectorAll('button')].find(b => b.textContent.trim() === tab)?.click();
    await sleep(800);
    const t = document.body.innerText;
    out[tab] = bad.filter(k => t.includes(k));   // 전부 [] 이어야 통과
  }
  return out;
})()
```

- [ ] 3개 탭 모두 `[]` (잔재 0건)
- [ ] **에이전트 내부 화면 13종도 스캔** (2026-07-06 이관 이후 필수): 에이전트 탭 → 사이드바 '전체 허브' 아래 13개 버튼을 순차 클릭하며 각 화면에서 위 `bad` 필터 실행 — 전부 `[]`. 잔재 발견 시 팩 `agentContent`의 해당 키 누락이다 (docs/AGENT-CONTENT-SCHEMA.md 대조)
- [ ] **관리자 전 메뉴(46페이지)도 스캔** (2026-07-06 관리자 이관 이후 필수): 관리자 입장 → 사이드바 전 그룹 펼침(펼침 여부는 chevron svg의 rotate-180으로 판정) → 리프 전부 순차 클릭하며 `bad` 필터 — 전부 `[]`. `bad`에 `reb.or.kr`·`reb.internal` 같은 도메인 주소도 포함할 것(2026-07-06 실누수 사례). 잔재 발견 시 팩 `adminContent` 키 누락 또는 페이지 인라인 하드코딩(→ mocks.js 상수 3곳 등록으로 추출)
- [ ] 잔재 발견 시: 코어 하드코딩이다 → 팩 필드+fallback으로 일반화 후 재검사 (팩에 땜질 금지)
- 알려진 허용 잔존: agent-report 인쇄용 HTML(buildPressHtml/buildReportHtml — 다운로드 파일 전용)은 팩이 함수 교체를 생략하면 REB 레이아웃 유지 (화면 미리보기는 팩 키로 교체됨, DOM 스캔에는 안 걸림)

### B-3. 동작 검사 (새 도메인에서)

- [ ] 포털: 스위처에 새 도메인 표시, 클릭 시 타이틀·브랜드색·배지·기능 4종 변경, 탭 제목 변경
- [ ] 새로고침 후 도메인 유지 (localStorage)
- [ ] 사용자 포털: 사용자명·부서, 워크스페이스 3종, 문서함 3건, 최근 대화 5건이 팩 콘텐츠
- [ ] 제안 질의 클릭 → **~2초 후 도메인 답변** 출력 (기본 fallback 응답이면 keywords 불일치)
- [ ] (mapIntel 보유 팩) 지도 질의 제안 클릭 → 히트맵 타일 전체 + 시계열 차트(선 2개) 렌더, 타일 클릭 시 차트·인사이트 전환, 특정 지역명 질의 시 해당 지역 포커스. **뷰포트 ≥1280에서 검사** (중앙 영역이 좁으면 차트 컬럼이 접힘 — 4단계 반응형 전까지 알려진 한계)
- [ ] (orchestration 보유 팩) 에이전트 탭 허브 상단에 시나리오 카드 표시 → "시나리오 실행" → "자동화 실행" 클릭 → 4개 스테이지가 순차 진행(로그 줄 등장→산출물→핸드오프) → 최종 보고서 카드(문서번호·요약 3줄·지표 4개) 렌더. 콘텐츠가 해당 도메인 언어인지 확인
- [ ] LLM 드롭다운: Claude Fable 5 기본 선택 + blocked 모델 차단 표시
- [ ] 보안 탭 진입 → "로컬 LLM(구축형 모델명)으로 자동 전환" 토스트
- [ ] 에이전트 탭: 카드 10개가 팩 명칭, 우측 활동 피드가 팩 콘텐츠

### B-4. 회귀 검사 (기존 도메인 파손 여부)

- [ ] REB로 전환 → 김민준 과장 / AX센터 TF / 표준지공시지가_조사지침.pdf / "공시지가 조사 기준" 클릭 시 "1월 1일" 포함 답변
- [ ] 나머지 기존 도메인 1개 이상 스팟 체크 (B-2 스캔 포함)

## C. 문서·체계 변경 검수 (이 문서들 자체를 고칠 때)

- [ ] 문서의 모든 코드 조각·명령을 실제 실행해 통과 확인 (죽은 예제 금지)
- [ ] 문서가 참조하는 파일 경로·필드명이 현재 코드와 일치 (`grep -ohE 'domain\??\.[a-zA-Z]+' src/RootApp.jsx src/UserApp.jsx src/App.jsx src/user/components/agents/AgentHub.jsx | sort -u`로 대조)
- [ ] 필드명뿐 아니라 **타입·구조**도 가이드 §2와 일치 확인 (예: workspaces[].icon은 lucide 컴포넌트, sampleAnswers.answer는 {content, citations, steps} — 실제 팩 1개를 열어 스키마와 눈으로 대조)
- [ ] 신선한 시각 검수: 해당 작업을 안 한 별도 에이전트/세션에게 문서만 주고 "이대로 실행 가능한가, 코드와 어긋난 곳은 없는가"를 검토시킬 것
- [ ] CLAUDE.md "현재 상태" 갱신 + 메모리(MEMORY.md) 동기화

## D. 자기검토 7문 (완료 보고 직전, 답을 적어볼 것)

1. 요청 문장의 모든 명사가 결과물에 반영됐는가?
2. 받는 사람이 처음 여는 순간 무엇이 보이는가? (그 화면을 실제로 열어봤는가)
3. 이번 수정이 깨뜨릴 수 있는 연결부는? (도메인 전환·보안탭 전환·인용 클릭·배포 경로)
4. 회의적 검토자가 지적할 1가지와 그에 대한 답은?
5. 제시한 증거가 실행 결과인가, 추정인가?
6. 롤백·삭제의 잔재(미사용 코드·임시 스크립트·옛 캐시)는 없는가?
7. 다음 세션이 이어받을 기록(CLAUDE.md·메모리)을 남겼는가?
