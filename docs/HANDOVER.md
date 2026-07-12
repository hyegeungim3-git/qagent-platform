# HANDOVER — 새 모델/세션 온보딩 프로토콜

> **누구를 위한 문서인가.** Fable 5가 아닌 어떤 모델(Opus·Sonnet·Haiku 등)이 이 프로젝트를 처음 이어받을 때,
> 코드를 건드리기 **전에** 밟는 절차. 목적은 하나 — **모델이 무엇이든 같은 결승선을 통과**시키는 것.
> 원리(품질기준-마스터 §0): *약한 모델일수록 지식이 아니라 **절차**를 줘라. 강한 모델일수록 절차가 아니라 **기준**을 줘라.*

---

## 0. 30초 요약 (급하면 이것만)

1. 이 저장소의 모든 변경 작업은 **`genos-work` 스킬**이 진입점이다(표준 루프: 착수→구현→검증→배포→기록).
2. **완료 = 빌드(ASCII 경로 EXIT 0) + 실행 증거 + verify.mjs PASS.** "될 겁니다" 금지.
3. **코어에 조직 콘텐츠 하드코딩 금지** — 팩 필드로. 왜는 [DECISIONS.md](DECISIONS.md).
4. 함정을 밟기 쉬운 작업(빌드·자동화·배포·대량편집) 전 [pitfalls.md](../.claude/skills/genos-work/references/pitfalls.md)를 읽어라 — 전부 실사고다.

---

## 1. 읽는 순서 (첫 세션, 20분)

| 순서 | 문서 | 무엇을 얻나 |
|---|---|---|
| 1 | [CLAUDE.md](../CLAUDE.md) | 프로젝트 정체·배포 표·작업 규칙·현재 상태 |
| 2 | [DECISIONS.md](DECISIONS.md) | **왜 지금 모습인가**(불변식) — 이걸 모르면 조용히 깨뜨린다 |
| 3 | [DOMAIN-PACK-GUIDE.md](DOMAIN-PACK-GUIDE.md) | 팩 스키마 전체 + 품질 7원칙 |
| 4 | [genos-work 스킬](../.claude/skills/genos-work/SKILL.md) + [pitfalls.md](../.claude/skills/genos-work/references/pitfalls.md) | 표준 루프 + 실사고 전집 |
| 5 | 작업 종류별: [genos-pack](../.claude/skills/genos-pack/SKILL.md)(콘텐츠) / [genos-verify](../.claude/skills/genos-verify/SKILL.md)(검증) | 그 작업의 방법론 |
| 6 | 현재 로드맵: [V3-ROADMAP.md](V3-ROADMAP.md)(완료) / [V4-ROADMAP.md](V4-ROADMAP.md)(다음) | 무엇을 이어서 하나 |

> 전역 기준(모델 무관): `~/.claude/guides/품질기준-마스터.md`(7속성·DoD) + `~/.claude/guides/모델운용-플레이북.md`(모델별 운용).

---

## 2. 자격 게이트 — 코드를 건드리기 전에 이 6개를 스스로 답할 수 있어야 한다

문서만 읽고 **정확히** 답할 수 없으면 아직 준비가 안 된 것이다(그리고 그건 문서의 결함이니 보고하라).

1. **이 머신에서 "빌드 통과"를 어떻게 판정하나?** — (정답의 핵심: 한글 경로 크래시 때문에 "transformed"로 판정 금지, ASCII 복사 빌드 **EXIT 0 + "✓ built in Xs"** 또는 CI)
2. **파일 내용을 바꿀 때 절대 쓰면 안 되는 도구는?** — (PowerShell `-replace`/`Set-Content` — 한글 UTF-8 파괴. Edit 도구만)
3. **새 발주처 도메인을 추가하려면 어디를 고치나? 코어를 고쳐야 하면 그건 무슨 신호?** — (팩 파일 + 레지스트리. 코어 수정 필요 = 코어가 덜 일반화됨 신호, 커밋 분리)
4. **팩 필드 shape의 정본은 문서인가 코드인가?** — (코드: `CONTENT_DEFAULTS`/소비 지점/`liveEngine.js` 주석. 문서와 다르면 코드가 맞음)
5. **커스텀 팩/시나리오가 "에러 없이 안 보이는" 버그를 피하려면?** — (코어는 `getDomain`/`getDomainList`/`allScenarios` 리졸버 경유. 직접 `DOMAINS`/`domain.orchestration` 참조 금지)
6. **배포 후 라이브에서 새 기능을 확인하는데 index 번들에 마커가 없다. 왜, 어디를 봐야 하나?** — (lazy 청크 분리. UserApp/App/기능 청크에서 찾기. `App-` 정규식은 `\b` 없으면 UserApp에 오매칭. Pages deploy만 실패는 rerun 말고 새 런)

> **약한 모델(Haiku 등)이라면**: 위를 못 외워도 된다. 대신 **매 작업 전 pitfalls.md를 열고 해당 절을 참조**하고, 한 메시지=한 단계로 쪼개 작업하라(모델운용-플레이북 §2 Sonnet 수칙과 동일).
>
> **하드 규칙 — 코어/공유 모듈은 게이트+캘리브레이션 통과 전 편집 금지.** 코어(RootApp/UserApp/App), 리졸버(getDomain·allScenarios), mocks.js, verify.mjs, 레지스트리(index.js) 등 **여러 도메인·기능이 공유하는 모듈**을 첫 작업으로 건드리면 조용한 누락(ADR-8)을 유발하기 쉽다. §3 캘리브레이션(단일 팩 필드)을 먼저 통과한 뒤 코어로 간다.

---

## 3. 캘리브레이션 과제 (조건부 필수)

새 모델의 "검증 생략 패턴"을 파악하는 작은 과제. 실제로 시켜보고 게이트를 통과하는지 본다.
- **코어·공유 모듈(리졸버·mocks.js·verify.mjs·레지스트리·컴포넌트)을 건드리는 첫 작업 전에는 필수** — 통과 전엔 프로덕션 코어 편집 금지(§2 하드 규칙).
- **단일 팩 필드만 수정하는 첫 작업이면 권장**(리스크가 팩 안에 갇혀 있음).
아래 과제는 단일 팩 수정이라 캘리브레이션 자체로도 안전하다.

```
캘리브레이션 과제: 아무 도메인 팩 하나의 GENERAL 제안 카드 4개 중
'답변 없이 generic 폴백으로 빠지는 카드'가 있으면 그 자리에 실업무 질의 + sampleAnswer 1건을 추가해줘
(genos-pack 스킬의 세계관 정합 원칙 준수 — 기존 팩 수치를 grep해 승계).
완료 기준: verify.mjs 3도메인 PASS + ASCII 빌드 EXIT 0 + 브라우저에서 카드 클릭→답변 DOM 확인 + 커밋.
끝나면 '무엇을 검증했고 무엇은 안 했는지' 구분해서 보고.
```

**통과 기준**: ① genos-work 루프를 따랐는가 ② 증거가 실행 결과인가 추정인가 ③ 세계관 수치를 새로 발명하지 않고 승계했는가 ④ 완료 보고에 '검증한 것 vs 안 한 것'이 구분됐는가. 미달이면 더 작은 단위로 쪼개 지시하는 모드로 전환(플레이북 §2).

---

## 4. 첫 세션에서 흔히 저지르는 실수 (미리 경고)

- ❌ 한글 경로에서 `npx vite build` 돌리고 "transformed" 보고 통과 판정 → **7주짜리 오판의 재현.** ASCII 복사 빌드로.
- ❌ 팩 콘텐츠를 코어 컴포넌트에 문자열로 박기 → ADR-1 위반. 다음 도메인 비용 폭증.
- ❌ 새 수치를 즉흥으로 만들어 세계관 모순 유발 → grep으로 기존 수치 승계(ADR-4).
- ❌ 브라우저 자동화에서 setTimeout 체인으로 클릭 연결 → 타이밍 어긋나 중간 단계 조용히 누락. 단계별 호출 + 사이드바 접힘 먼저 확인(pitfalls §3).
- ❌ 콘솔 에러 버퍼(세션 누적)의 스테일 HMR 오류를 회귀로 오판 → 리로드 후 새 에러만, 판정은 ASCII 빌드로.
- ❌ mocks.js에 상수만 추가하고 3곳 등록(export let·__REB_DEFAULTS·applyAdminDomain) 누락 → 도메인 전환이 조용히 무시.

---

## 5. 이어받기 표준 지시문 (사용자가 이 문구로 시작하면 그대로)

- **온보딩**: "genos-app/docs/HANDOVER.md 읽고 자격 게이트 6문 자답해서 보고해. 그다음 캘리브레이션 과제 1개 수행하고 통과 여부 스스로 판정해."
- **로드맵 실행**: "genos-app/CLAUDE.md 읽고 docs/V4-ROADMAP.md의 W\<N\> 실행해줘 — genos-work 표준 루프, DoD 전 항목 실행 증거 포함."
- **다시 만들기**: "\~/.claude/guides/모델운용-플레이북.md §9 + genos-app/docs/DECISIONS.md 재현 순서 따라, \<새 발주처/도메인\> 데모 플랫폼을 2층 구조로 새로 만들어줘."

---

## 6. 인수인계를 남기는 쪽(떠나는 세션)의 의무

다음 모델이 이어받을 수 있게 **떠나기 전**:
- [ ] CLAUDE.md '현재 상태'에 한 줄 추가(커밋 해시 + 검증 증거)
- [ ] 새 설계 결정을 했으면 [DECISIONS.md](DECISIONS.md)에 ADR 추가
- [ ] 새 함정을 밟았으면 [pitfalls.md](../.claude/skills/genos-work/references/pitfalls.md)에 기록
- [ ] 하네스(에이전트/스킬/verify.mjs)를 고쳤으면 CLAUDE.md 하네스 변경 이력 갱신
- [ ] 사용자 메모리(`~/.claude/projects/.../memory/`)에 큰 결정·현재 위치 갱신
