import { Volume2, Search, ClipboardList, FileText, Database, CheckSquare } from "lucide-react";

/* ================================================================== */
/* 한국부동산원 표준 공문서 템플릿                                      */
/* ================================================================== */
export const REPORT_DOC = {
  docNo: "KREA-부동산공시처-2026-026",
  issueDate: "2026. 02. 26.",
  retention: "5년",
  type: "주간업무보고",
  to: "부동산공시처장",
  cc: "공시조사부장",
  from: "부동산공시처 김민준 과장",
  title: "2026년 2월 4주차 주간 업무 실적 보고",
  body: [
    {
      num: "1", heading: "보고 개요",
      rows: [
        ["보고 기간", "2026. 02. 17.(월) ~ 02. 21.(금)"],
        ["작성 부서", "부동산공시처"],
        ["작성자", "김민준 과장"],
      ]
    },
    {
      num: "2", heading: "주요 실적",
      sub: [
        {
          label: "가. 표준지 현장조사",
          bullets: [
            "표준지공시지가 현장조사 <b>5건</b> 완료",
            "대상: 서울 강남구 표준지 3필지, 경기 성남시 표준지 2필지",
            "조사 결과: 인근 거래사례 수집 완료 — 가격 산정 초안 작성 중",
          ],
        },
        {
          label: "나. 비교표준지 가격 검토",
          bullets: [
            "비교표준지 가격 적정성 검토 <b>2건</b> 처리 완료",
            "A지구 표준지 #12: 인근 거래가 반영 보정 완료 (2026.02.18)",
            "B지구 표준지 #07: 이의신청 검토 의견서 작성 완료 (2026.02.20)",
          ],
        },
      ],
    },
    {
      num: "3", heading: "차주 계획",
      bullets: [
        "인천광역시·경기 북부권 표준지 현장조사 실시 예정 (2026. 02. 24. ~ 02. 28.)",
        "연간 표준지 조사 이력 DB 업데이트 및 차기 보고",
      ],
    },
  ],
  attachments: [
    "표준지 현장조사 결과서 5부",
    "비교표준지 가격 검토 의견서 2부",
  ],
  secLevel: "S",
  approval: [
    { role: "기안자", name: "김민준", dept: "부동산공시처", date: "2026.02.26", signed: true },
    { role: "검토자", name: "", dept: "", date: "", signed: false },
    { role: "결재자", name: "", dept: "", date: "", signed: false },
  ],
};

// org: 도메인 팩 주입용 — { name, short, color, en } (미전달 시 REB 기본)
export const generateDocHTML = (doc, org = {}) => {
  const orgName = org.name || "한국부동산원";
  const orgEn = doc.orgEn || org.en || (orgName === "한국부동산원" ? "KOREA REAL ESTATE BOARD" : (org.short || ""));
  const logoLetter = (org.short || "K").charAt(0);
  const sealText = doc.sealText || `${orgName}장`;
  const bc = org.color || "${bc}";
  const bodyHTML = doc.body.map(s => {
    const rowsHTML = s.rows
      ? `<table class="mt">${s.rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}</table>`
      : "";
    const subHTML = s.sub
      ? s.sub.map(ss => `<div class="ssl">${ss.label}</div><ul class="bl">${ss.bullets.map(b => `<li>${b}</li>`).join("")}</ul>`).join("")
      : "";
    const bulletsHTML = s.bullets
      ? `<ul class="bl">${s.bullets.map(b => `<li>${b}</li>`).join("")}</ul>`
      : "";
    return `<div class="sec"><div class="sh">${s.num}. ${s.heading}</div>${rowsHTML}${subHTML}${bulletsHTML}</div>`;
  }).join("");
  const attHTML = doc.attachments.map((a, i) => `<li>${i + 1}. ${a}</li>`).join("");
  const apvHead = doc.approval.map(a => `<th>${a.role}</th>`).join("");
  const apvSig  = doc.approval.map(a => `<td><div class="sig">${a.signed ? "✓\u00a0" + a.name : "\u00a0"}</div></td>`).join("");
  const apvDate = doc.approval.map(a => `<td class="dt2">${a.date || "(미결재)"}</td>`).join("");
  return `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${doc.title}</title><style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Malgun Gothic','맑은 고딕','Apple SD Gothic Neo',sans-serif;font-size:14px;color:#111;background:#ebebeb;padding:32px;line-height:1.85}
.page{background:#fff;max-width:794px;margin:0 auto;padding:56px 64px;box-shadow:0 4px 24px rgba(0,0,0,.13);border-top:6px solid ${bc}}
.lh{display:flex;align-items:center;gap:16px;padding-bottom:18px;border-bottom:2px solid ${bc};margin-bottom:22px}
.lb{width:48px;height:48px;background:${bc};border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;font-weight:900}
.cn{font-size:20px;font-weight:900;color:${bc};line-height:1.2}
.ce{font-size:10.5px;color:#666;font-weight:500;letter-spacing:.07em;margin-top:3px}
.meta{display:grid;grid-template-columns:90px 1fr;gap:6px 12px;font-size:13px;padding:14px 18px;background:#f8fafc;border:1px solid #dde3ea;border-radius:8px;margin-bottom:22px}
.ml{font-weight:700;color:#444}
.doctitle{text-align:center;font-size:19px;font-weight:900;margin:22px 0 26px;padding:14px 0;border-top:2.5px solid ${bc};border-bottom:2.5px solid ${bc};color:#111;letter-spacing:-.02em}
.sec{margin-bottom:24px}
.sh{font-size:15px;font-weight:900;color:${bc};margin-bottom:10px;padding-left:9px;border-left:4px solid ${bc}}
.mt{width:100%;border-collapse:collapse;font-size:13px;margin-bottom:10px}
.mt td{padding:7px 12px;border:1px solid #dde3ea}
.mt td:first-child{background:#f0f4f8;font-weight:700;width:110px;color:#444;white-space:nowrap}
.ssl{font-size:14px;font-weight:700;color:#333;margin:12px 0 6px 18px}
ul.bl{list-style:none;padding-left:28px;font-size:13.5px;line-height:1.95}
ul.bl li{position:relative;padding-left:14px;color:#333}
ul.bl li::before{content:"–";position:absolute;left:0;color:#888}
ol.att{padding-left:24px;font-size:13.5px;line-height:2}
ol.att li{color:#333}
.seal{text-align:right;margin:32px 0 10px;font-size:18px;font-weight:900;color:${bc};padding-top:22px;border-top:1px solid #e5e7eb}
.at{width:100%;border-collapse:collapse;margin-top:6px;font-size:13px}
.at th,.at td{border:1px solid #ccc;text-align:center;padding:10px}
.at th{background:#f0f4f8;font-weight:700;width:33.33%}
.sig{height:56px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:${bc}}
.dt2{font-size:11.5px;color:#888}
b{font-weight:900;color:${bc}}
.ai-note{margin-top:28px;padding:11px 16px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;font-size:12px;color:#92400e;line-height:1.7}
@media print{body{background:#fff;padding:0}.page{box-shadow:none}}
</style></head><body>
<div class="page">
  <div class="lh">
    <div class="lb">${logoLetter}</div>
    <div>
      <div class="cn">${orgName}</div>
      <div class="ce">${orgEn}</div>
    </div>
  </div>
  <div class="meta">
    <span class="ml">문\u00a0서\u00a0번\u00a0호</span><span>${doc.docNo}</span>
    <span class="ml">시\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0행</span><span>${doc.issueDate}</span>
    <span class="ml">보\u00a0존\u00a0기\u00a0간</span><span>${doc.retention}</span>
    <span class="ml">보\u00a0안\u00a0등\u00a0급</span><span><span style="background:${doc.secLevel==='C'?'#dc2626':doc.secLevel==='S'?'#f97316':'#16a34a'};color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:900;letter-spacing:.04em">${doc.secLevel==='C'?'기밀(C)':doc.secLevel==='S'?'민감(S)':'공개(O)'}</span></span>
    <span class="ml">수\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0신</span><span>${doc.to}</span>
    <span class="ml">참\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0조</span><span>${doc.cc}</span>
    <span class="ml">발\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0신</span><span>${doc.from}</span>
  </div>
  <div class="doctitle">제\u00a0\u00a0목 \u00a0: \u00a0${doc.title}</div>
  ${bodyHTML}
  <div class="sec">
    <div class="sh">붙 임</div>
    <ol class="att">${attHTML}</ol>
  </div>
  <div class="seal">${sealText} (직인생략)</div>
  <table class="at">
    <tr>${apvHead}</tr>
    <tr>${apvSig}</tr>
    <tr>${apvDate}</tr>
  </table>
  <div class="ai-note">⚠️ 본 문서는 QAgent AI 에이전트가 자동 생성한 초안입니다. 공식 문서로 활용 전 반드시 내용을 검토하고 담당자의 최종 승인을 받으시기 바랍니다.</div>
</div>
</body></html>`;
};

export const AI_RESPONSES = {
  GENERAL_PSV: { confidence: 94, content: `**[RAG 기반 답변]** — 출처: 표준지공시지가_조사지침.pdf\n\n표준지공시지가 조사·산정 업무 지침(제2장)에 따르면,\n\n- **표준지공시지가 정기 조사**: 부동산 가격공시에 관한 법률 제3조에 따라 **매년 1월 1일**을 기준으로 연 1회 조사·산정\n- **수시 조사**: 조사 기준일 이후 6개월 이내 중대한 가격 변동 확인 시 수시 조사 가능\n\n⚠️ 인근 표준지 간 가격 균형 유지를 위해 비교표준지 거래사례를 반드시 수집하여야 합니다.`, citations: [{ id: "d1", name: "표준지공시지가_조사지침.pdf", page: 4, similarity: 96, tag: "대외비", secLevel: "C", excerpt: "표준지공시지가 정기 조사는 부동산 가격공시에 관한 법률 제3조에 따라 매년 1월 1일을 기준으로 연 1회 조사·산정하며, 수시 조사는 기준일 이후 6개월 이내 중대한 가격 변동 확인 시 실시할 수 있다." }], steps: null },
  GENERAL_BUDGET: { confidence: 98, content: `**[RAG 기반 답변]** — 출처: 3. 과업지시서.pdf\n\n| 항목 | 내용 |\n|------|------|\n| **사업 기간** | 계약체결일 ~ 2026년 7월 31일 |\n| **사업 금액** | **429,000천원** (VAT 별도) |\n| **발주처** | 한국부동산원 AX센터 AI업무혁신 TF |`, citations: [{ id: "d2", name: "3. 과업지시서.pdf", page: 1, similarity: 99, tag: "문서", secLevel: "S", excerpt: "사업 기간은 계약체결일로부터 2026년 7월 31일까지이며, 총 사업 금액은 429,000천원(VAT 별도)이다. 발주처는 한국부동산원 AX센터 AI업무혁신 TF이다." }], steps: null },
  REVIEW_DEFAULT: { confidence: 91, content: `**[에이전트 문서 검토 결과]**\n\n취업규칙(2025개정) 및 관련 지침 대조 결과입니다.\n\n**✅ 준수 사항**\n- 현장조사 신청 사전 승인 절차 준수\n- 결재 라인 설정이 사내 규정에 부합\n\n**⚠️ 보완 권고 사항**\n- 출장 기간 5박 초과 시 **임원 별도 승인** 필요 (취업규칙 제42조②)\n- **출장비 선지급 신청서** 누락 (출장 3일 전까지 제출 필요)`, citations: [{ id: "d3", name: "한국부동산원_취업규칙.hwp", page: 8, similarity: 94, tag: "사규", secLevel: "O", excerpt: "출장 기간이 5박을 초과하는 경우에는 임원의 별도 승인을 받아야 한다. 출장비 선지급 신청서는 출장 3일 전까지 제출하여야 한다. (취업규칙 제42조 제2항)" }], steps: [{ label: "DRM 해제 및 OCR 추출", detail: "업로드 문서 텍스트 완전 추출 완료" }, { label: "사규 지식망 검색", detail: "취업규칙 출장 조항 검색 완료 (제42조)" }, { label: "규정 대조 및 검토", detail: "위반 소지 분석 및 보완 사항 발췌 완료" }] },
  TRANSLATE_DEFAULT: { content: `**[번역 완료]** — 영어 → 한국어\n\n---\n**[번역 결과]**\n\n**부동산 감정평가 기준 (Real Property Appraisal Standards)**\n\n감정평가사는 대상 물건의 시장가치를 산정할 때, 유사 부동산의 거래 사례 비교법·원가법·수익환원법 중 가장 적합한 방법을 적용하여야 하며, 그 근거를 평가 보고서에 명시하여야 합니다.\n\n---\n*번역 엔진: 로컬 LLM (Llama-3-Korean 70B) | 글자수: 약 130자*`, citations: [{ id: "d1", name: "표준지공시지가_조사지침.pdf", page: 3, similarity: 98, tag: "대외비" }], steps: [{ label: "의미 단위 분할 (Semantic Chunking)", detail: "문서를 문맥 기준으로 분할 완료" }, { label: "한영 번역 (로컬 LLM 처리)", detail: "Llama-3-Korean 70B 모델 번역 완료" }, { label: "공기업 표준 문체 포맷팅", detail: "가독성 높은 형태로 최종 정제 완료" }] },
  REPORT_DEFAULT: { content: `**[주간 실적 보고서 초안 생성 완료]**\n\n---\n\n**부동산공시처 주간 업무 실적 보고**\n\n| 구분 | 내용 |\n|------|------|\n| **보고 기간** | 2026. 02. 17.(월) ~ 02. 21.(금) |\n| **작성 부서** | 부동산공시처 |\n| **작성자** | 김민준 과장 |\n\n**가. 주요 실적**\n1. 표준지공시지가 현장조사: **5건 완료**\n2. 비교표준지 가격 검토: **2건 완료**\n\n**나. 차주 계획**\n- 인천·경기 북부권 표준지 현장조사 예정\n\n---\n⚠️ *AI 생성 초안입니다. 반드시 확인 후 사용하세요.*`, citations: [], steps: [{ label: "표준 양식 불러오기", detail: "주간실적 보고서 사내 표준 템플릿 로드 완료" }, { label: "정보 항목 매핑", detail: "입력 데이터를 목차별로 자동 분류 완료" }, { label: "공문서 개조식 포맷팅", detail: "보고서 양식에 맞게 최종 작성 완료" }], document: null },
  SECURE_DEFAULT: { confidence: 88, content: `**[보안 문서 스캔 완료]**\n\n업로드된 문서 전체를 대상으로 보안 취약점을 점검했습니다.\n\n**✅ 안전 항목**\n- 평문 노출 패스워드: 미발견\n- 사번·주민등록번호 등 식별정보: 미발견\n\n**🔐 자동 처리 내역**\n- 연락처(전화번호) 형식 데이터 2건 → 자동 마스킹(***)처리\n- 이메일 주소 1건 → 벡터 DB 적재 전 마스킹 완료\n\n본 세션의 모든 처리는 내부 로컬 서버에서만 이루어지며 외부 네트워크로 전송되지 않습니다.`, citations: [{ id: "d1", name: "표준지공시지가_조사지침.pdf", page: 2, similarity: 91, tag: "대외비", excerpt: "보안등급 C(대외비) 문서는 외부 반출 시 반드시 DRM 암호화 처리 후 반출하여야 하며, 무단 복제를 금한다." }], steps: null },
  SECURE_AIRGAP: { confidence: 97, content: `**[보안 규정 검토 완료]**\n\n과업지시서 내 망분리 관련 핵심 요건입니다.\n\n- **내부 웹 UI**: 망분리, 인터넷 차단 환경 구축 필수\n- **LLM 서비스**: 외부 클라우드 API 연결 금지, 로컬 온프레미스만 허용\n- **벡터 DB**: 내부망 전용 구축, 외부 전송 금지\n\n✅ 현재 세션: 모든 처리가 내부망에서만 이루어지고 있습니다.`, citations: [{ id: "d2", name: "3. 과업지시서.pdf", page: 2, similarity: 98, tag: "문서", excerpt: "시스템은 인터넷과 완전 차단된 망분리 환경에서 운영되어야 하며, LLM 추론은 외부 클라우드 API 연결 없이 로컬 온프레미스 서버에서만 처리되어야 한다." }], steps: null },
  AGENT1: { content: `**[사규 기반 문서 검토 결과]**\n\n취업규칙(2025개정) 대조 결과입니다.\n\n**✅ 준수 사항**\n- 현장조사 신청 사전 승인 절차 준수\n- 결재 라인 설정이 사내 규정에 부합\n\n**⚠️ 보완 권고**\n- 5박 초과 시 **임원 별도 승인** 필요 (취업규칙 제42조②)\n- **출장비 선지급 신청서** 누락 (출장 3일 전까지 제출 필요)`, citations: [{ id: "d3", name: "한국부동산원_취업규칙.hwp", page: 8, similarity: 94, tag: "사규", secLevel: "O" }], agentSteps: [{ status: "완료", label: "문서 파싱: DRM_자동_복호화_모듈 — 문서 텍스트 완전 추출" }, { status: "완료", label: "규정 검색: 부동산원_사내_지식_검색망 — 출장 관련 조항 검색" }, { status: "완료", label: "대조 검토: 규정 위반 소지 분석 및 보완 사항 발췌 완료" }] },
  AGENT2: { content: `**[번역 완료]** — 영어 → 한국어\n\n**부동산 감정평가 기준 (Real Property Appraisal Standards)**\n\n감정평가사는 대상 물건의 시장가치를 산정할 때 유사 부동산의 거래 사례 비교법·원가법·수익환원법 중 가장 적합한 방법을 적용하고, 그 근거를 평가 보고서에 명시하여야 합니다.\n\n---\n*번역 엔진: Llama-3-Korean 70B | 글자수: 약 130자*`, citations: [{ id: "d1", name: "표준지공시지가_조사지침.pdf", page: 3, similarity: 98, tag: "대외비", secLevel: "C" }], agentSteps: [{ status: "완료", label: "문맥 파악: Semantic Chunking — 의미 단위 분할 완료" }, { status: "완료", label: "번역·요약: Llama-3-Korean 70B — 한영 번역 및 요약 완료" }, { status: "완료", label: "포맷팅: 공기업 표준 문체 최종 정제 완료" }] },
  AGENT3: { content: `**[보고서 초안 생성 완료]**\n\n**부동산공시처 주간 업무 실적 보고**\n\n| 구분 | 내용 |\n|------|------|\n| **보고 기간** | 2026. 02. 17.(월) ~ 02. 21.(금) |\n| **작성 부서** | 부동산공시처 |\n| **작성자** | 김민준 과장 |\n\n**가. 주요 실적**\n1. 표준지공시지가 현장조사: **5건 완료**\n2. 비교표준지 가격 검토: **2건 완료**\n\n---\n⚠️ *AI 생성 초안입니다. 반드시 확인 후 사용하세요.*`, citations: [], agentSteps: [{ status: "완료", label: "양식 로드: 부동산원_사내_지식_검색망 — 주간실적 표준 템플릿 로드" }, { status: "완료", label: "정보 매핑: 입력 데이터를 목차별로 자동 분류 완료" }, { status: "완료", label: "최종 생성: GPT-OSS 120B — 공문서 개조식 포맷팅 완료" }], document: null },
};
// REPORT_DEFAULT.document and AGENT3.document point to REPORT_DOC
AI_RESPONSES.REPORT_DEFAULT.document = REPORT_DOC;
AI_RESPONSES.AGENT3.document = REPORT_DOC;

/* 회의록 자동 작성 에이전트 데이터 */
export const MEET_AGENTS = [
  {icon:Volume2, label:'STT 에이전트', sub:'음성 → 텍스트 변환', color:'bg-violet-600', light:'bg-violet-50 border-violet-200 text-violet-700', ms:3200},
  {icon:Search, label:'분석 에이전트', sub:'화자 구분 · 의사결정 추출', color:'bg-blue-600', light:'bg-blue-50 border-blue-200 text-blue-700', ms:2600},
  {icon:ClipboardList, label:'회의록 작성 에이전트', sub:'표준 양식 회의록 생성', color:'bg-emerald-600', light:'bg-emerald-50 border-emerald-200 text-emerald-700', ms:2800},
];

export const MEET_RESULT = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                      회   의   록
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ 회  의  명 : 표준지공시지가 업무처리지침 개정 검토 회의
□ 일      시 : 2026년 2월 27일 (목) 14:00 ~ 15:30
□ 장      소 : 본사 3층 대회의실 (304호)
□ 주      재 : 부동산공시처장 고성민
□ 참 석 자  : 공시조사부장 이준호, 공시관리부장 박지현,
               법무지원부 대리 최민수, 연구개발실 연구원 김세은

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 개회 (14:00)
   - 부동산공시처장 주재로 회의 개최
   - 참석 인원 확인 및 회의 목적 공유

2. 안건 토의

   [안건 1] 표준지공시지가 현장조사 주기 개정(안)
   ─────────────────────────────────────
   ▸ 이준호 부장 : 현행 연 1회 조사 외에 시장 변동성이 큰 지역에 한해
     반기(6개월) 추가 조사를 실시할 것을 제안함.
   ▸ 박지현 부장 : 추가 인력·예산 소요 약 15% 증가 예상.
   ▸ 최민수 대리 : 부동산 가격공시에 관한 법률 시행령 제2조 적용 범위
     확인 필요. 법무지원부 검토 의견서 3월 10일까지 제출 예정.
   ▸ 결 론 : 변동성 상위 10% 지역 한정 반기 추가 조사 추진.

   [안건 2] AI 기반 공시지가 이상탐지 시스템 도입 검토
   ─────────────────────────────────────
   ▸ 김세은 연구원 : GENOS 플랫폼 내 공시지가 자동 이상탐지 모듈 개발 완료.
     가격 급등락 이상징후 감지 정확도 97.3% 달성.
   ▸ 고성민 처장 : 파일럿 적용 대상 지역 3개소 선정 후 3개월 시범
     운영 후 전면 도입 여부 결정.
   ▸ 결 론 : 2026년 3분기 시범 운영 착수.

3. 결정 사항
   ① 변동성 상위 지역 반기 추가 조사 : 2026. 04. 01. 시행
   ② AI 이상탐지 시스템 시범 운영 : 2026. 7월 착수 (3개소)
   ③ 개정 지침 법무팀 최종 검토 후 3월 내 확정

4. 조치 사항
   ┌──┬──────────────────────────────┬──────────┬───────────┐
   │번호│ 내              용           │ 담 당 자 │ 완료 기한 │
   ├──┼──────────────────────────────┼──────────┼───────────┤
   │ 1 │ 추가 조사 대상 지역 선정 기안  │ 박지현   │ 03. 15.  │
   │ 2 │ 법령 검토 의견서 작성         │ 최민수   │ 03. 10.  │
   │ 3 │ 예산 소요 절감 방안 검토 보고 │ 이준호   │ 03. 22.  │
   │ 4 │ AI 시범 운영 대상 지역 선정   │ 김세은   │ 04. 30.  │
   └──┴──────────────────────────────┴──────────┴───────────┘

5. 특이사항
   - 차기 회의 : 2026년 3월 20일 (금) 14:00 예정
   - 법무팀 검토 의견 수렴 후 지침 개정안 공람 예정

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
작성자 : GENOS AI 회의록 에이전트 v1.0
검토자 : ___________________  (서명)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

export const APV_LINE_MEET = [
  {name:'김민준',dept:'부동산공시처',title:'과장',role:'작성자'},
  {name:'이준호',dept:'부동산공시처',title:'공시조사부장',role:'검토자'},
  {name:'고성민',dept:'부동산공시처',title:'처장',role:'승인자'},
];

export const APV_LINE_SAFE = [
  {name:'김민준',dept:'부동산공시처',title:'과장',role:'작성자'},
  {name:'박지현',dept:'부동산공시처',title:'공시관리부장',role:'검토자'},
  {name:'고성민',dept:'부동산공시처',title:'처장',role:'승인자'},
];

/* 현장조사 안전관리계획 수립 에이전트 데이터 */
export const SAFE_AGENTS = [
  {icon:FileText, label:'입력 분석 에이전트', sub:'조사 현장 특성 파악 및 위험 유형 분류', color:'bg-orange-600', ms:2400},
  {icon:Database, label:'RAG 검색 에이전트', sub:'관련 법령·규정·사례 벡터 검색', color:'bg-blue-600', ms:3500},
  {icon:CheckSquare, label:'법규 검토 에이전트', sub:'적용 법령 매핑 및 준수 체크리스트 생성', color:'bg-purple-600', ms:2800},
  {icon:ClipboardList, label:'계획서 작성 에이전트', sub:'현장조사 안전관리계획서 초안 자동 생성', color:'bg-emerald-600', ms:3000},
];

export const SAFE_RISK_OPTIONS = ['낙상·추락','교통사고','폭염·한파 노출','개·맹수 접근','낙석·지반 붕괴','우천 미끄럼','독충·벌레 피해','고압선 인근 작업','수해 지역 진입','야간 조사'];

export const SAFE_RESULT = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        현 장 조 사 안 전 관 리 계 획 서
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 조사 개요
   ─────────────────────────────────────
   ▸ 조  사  명 : 표준지공시지가 현장조사 (서울·경기 북부권)
   ▸ 조사 기간 : 2026. 03. 01. ~ 2026. 03. 31. (1개월)
   ▸ 조사 지역 : 서울 노원구, 경기 의정부시, 경기 양주시 일대
   ▸ 발 주 처 : 한국부동산원 부동산공시처
   ▸ 조사 규모 : 표준지 약 120필지 (조사원 4명)

2. 안전 관리 조직
   ─────────────────────────────────────
   [안전관리책임자] 고성민 처장 (부동산공시처)
       └─ [안전담당자] 이준호 부장 (공시조사부)
              ├─ [현장 조사원 A팀] 박지현 부장 (공시관리부)
              └─ [현장 조사원 B팀] 김세은 연구원 (연구개발실)

3. 위험 요인 분석 (위험성 평가)
   ─────────────────────────────────────
   ┌────────────┬────────┬──────┬───────────────────────────────┐
   │ 위험 요인  │ 위험도 │ 빈도 │ 안전 대책                    │
   ├────────────┼────────┼──────┼───────────────────────────────┤
   │ 낙상·추락  │ 높음   │ 보통 │ 안전화 착용, 경사지 2인 1조  │
   │ 교통사고   │ 높음   │ 가능 │ 야광 조끼 착용, 도로변 주의  │
   │ 폭염 노출  │ 보통   │ 계절 │ 수분 보충, 그늘 휴식 의무화  │
   │ 개·맹수    │ 보통   │ 낮음 │ 방어용 스프레이 휴대 권고    │
   │ 야간 조사  │ 높음   │ 가능 │ 야간 조사 금지 원칙 적용     │
   └────────────┴────────┴──────┴───────────────────────────────┘

4. 안전관리 계획 (단계별)
   ─────────────────────────────────────
   4.1 조사 출발 전 안전 관리
   ▸ 조사 전일 기상 및 현장 접근로 안전 확인
   ▸ 조사원 건강 상태 확인 (체온, 피로도 등)
   ▸ 개인보호장비(안전화, 야광 조끼, 방수 복장) 지급 확인

   4.2 현장 조사 중 안전
   ▸ 2인 1조 원칙 (산간·외진 지역 단독 조사 금지)
   ▸ 30분 간격 팀장 연락 확인 (응답 없을 시 즉시 수색)
   ▸ 낙석 위험 지역·공사 현장 인근 접근 자제

5. 비상 연락 체계
   ─────────────────────────────────────
   사고 발생 → 즉시 현장 대피 및 119 신고
   ↓
   공시조사부장 연락 (이준호 010-XXXX-XXXX)
   ↓
   안전관리책임자 보고 → 원인 조사 및 재발 방지 조치

6. 관련 법령 및 규정
   ─────────────────────────────────────
   ① 산업안전보건법 제36조 (위험성평가)
   ② 한국부동산원 현장조사 안전관리 지침
   ③ 부동산 가격공시에 관한 법률 제3조 (현장조사 의무)
   ④ 도로교통법 제10조 (보행자 안전)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
작성: GENOS 안전관리 에이전트 v1.0 | 검토자: _______
참조 법령 수: 4건 | RAG 검색 문서 수: 8건
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
