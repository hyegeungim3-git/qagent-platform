/**
 * 검증 공통 설정 — verify.mjs(넓고 얕게)와 deepscan.mjs(좁고 깊게)가 함께 쓴다.
 *
 * ⚠️ 새 도메인 팩을 추가하면 여기 DOMAINS에 항목을 추가할 것.
 *    (src/domains/index.js 등록과 나란히 — 빠뜨리면 새 도메인이 검증에서 조용히 빠진다)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/* 도메인별 판정 기준
 *  banned      : 얕은 스캔(verify)용 금칙어 — 타 도메인 조직명·문서번호 접두
 *  deepExtra   : 깊은 스캔(deepscan)에서만 추가로 보는 업무 용어.
 *                해당 도메인에서 '정상 업무 용어'인 것은 절대 넣지 말 것.
 *                (예: 행정·제조는 협력사·사업장 주소를 실제로 다루므로
 *                 도로명주소·법정동·지번을 넣으면 오탐이 된다)
 *  deepSkip    : 깊은 스캔 제외 — 그 용어들이 원래 자기 콘텐츠인 원본 도메인
 */
export const DOMAINS = [
  {
    id: "reb", label: "한국부동산원", deepSkip: true,
    banned: ["KOGAS", "kogas", "한빛정밀", "한성시청", "HBP-", "HSC-", "새빛대학교병원", "SUH-"],
    generalMarkers: ["한국부동산원", "오늘의 업무 브리핑", "실거래 이상거래 탐지"],
    hubMarkers: ["공시지가 이의신청 서류 일괄 처리", "실거래 신고 이상거래 검증"],
    orchCards: 2,
    deepExtra: [],
  },
  {
    id: "manufacturing", label: "한빛정밀",
    banned: ["KOGAS", "kogas", "한국부동산원", "공시지가", "표준지", "KREA-", "한성시청", "HSC-", "새빛대학교병원", "SUH-"],
    generalMarkers: ["한빛정밀", "오늘의 업무 브리핑", "설비 데이터 진단", "도면 설계 지원", "AX 로드맵", "데이터 보안"],
    hubMarkers: ["프레스 진동 알람 자동 대응", "협력사 검사성적서 일괄 처리", "도면 설계 아웃라인 자동 생성"],
    orchCards: 3,
    // 주소 관련 용어는 제외 — 협력사·사업장 주소 표준화는 제조에서도 실제 업무다
    deepExtra: ["부동산공시처", "감정평가", "필지", "국토교통부", "R-ONE", "408002", "전월세", "reb.or.kr"],
  },
  {
    id: "civic", label: "한성시청",
    banned: ["KOGAS", "kogas", "한국부동산원", "공시지가", "KREA-", "한빛정밀", "HBP-", "새빛대학교병원", "SUH-"],
    generalMarkers: ["한성시", "오늘의 업무 브리핑", "재난 상황 확인"],
    hubMarkers: ["옥외광고물 허가 신청 일괄 처리", "호우경보 재난 상황보고 작성"],
    orchCards: 2,
    // 도로명주소·법정동·지번은 지자체 본연 업무라 제외
    deepExtra: ["부동산공시처", "표준지", "감정평가", "필지", "R-ONE", "408002", "전월세", "reb.or.kr"],
  },
  {
    id: "hospital", label: "새빛대학교병원",
    banned: ["KOGAS", "kogas", "한국부동산원", "공시지가", "표준지", "KREA-", "한빛정밀", "HBP-", "한성시청", "HSC-"],
    generalMarkers: ["오늘의 업무 브리핑", "응급실 현황", "응급실 병상 가동률"],
    hubMarkers: ["입원 진료비 삭감위험 사전점검", "응급실 포화 경보 대응"],
    orchCards: 2,
    // 의료에는 주소·부동산 용어가 업무상 등장할 이유가 없다
    deepExtra: ["부동산공시처", "감정평가", "필지", "국토교통부", "R-ONE", "408002", "전월세",
                "도로명주소", "지오코딩", "법정동", "지번", "reb.or.kr"],
  },
];

/* 관리자 화면 판정 — adminscan.mjs 전용.
 * verify·deepscan은 사용자 포털만 본다. 관리자 45+ 페이지는 mocks.js 기본값을
 * 팩 adminContent가 덮는 구조라, 팩이 키를 빠뜨리면 '중립 기본값' 또는 '타 도메인
 * 콘텐츠'가 조용히 노출된다 — 화면은 멀쩡해 보이므로 사람 눈으로는 잘 안 잡힌다.
 *
 * pages: [메뉴 id, 기본 탭에서 반드시 보여야 할 마커[]]
 *   ⚠️ 마커는 '첫 화면에 실제로 렌더되는 문자열'이어야 한다.
 *      탭·아코디언 안쪽 문자열을 넣으면 정상인데 FAIL이 난다(실제로 겪음).
 * adminBanned: 그 도메인 관리자에 나오면 안 되는 타 도메인 용어.
 */
export const ADMIN_PAGES = {
  reb: [
    ["security.arch",  ["공시 지침·업무 매뉴얼 RAG 검색", "실거래 신고 자료 조회"]],
    ["eval.predops",   ["실거래 이상거래 탐지 모델", "공시가격 변동률 예측 모델"]],
    ["data.catalog",   ["공시 조사지침", "실거래 신고 자료", "표준지 조사표"]],
    ["admin.augment",  ["공시기준일", "이의신청 기간"]],
    ["safetyact",      ["현장조사 위험성평가 이력", "부동산평가처"]],
    ["repro",          ["표준지 공시기준일이 언제인가요"]],
  ],
  manufacturing: [
    ["security.arch", []], ["eval.predops", []], ["data.catalog", []],
    ["admin.augment", []], ["safetyact", []], ["repro", []],
  ],
  civic: [
    ["security.arch",  ["자치법규·민원사무편람 RAG 검색", "재난 상황 데이터 수집"]],
    ["eval.predops",   ["민원 접수량 예측 모델", "침수 위험 예측 모델"]],
    ["data.catalog",   ["자치법규·민원사무편람", "재난 관측 자료"]],
    ["admin.augment",  ["구비서류", "민원 접수·처리 이력"]],
    ["safetyact",      ["공사·행사 위험성평가 이력", "안전총괄과"]],
    ["repro",          ["긴급 여권 발급 구비서류"]],
  ],
  // 의료는 adminContent 미이관 — 중립 기본값이 정상이므로 누수만 본다(마커 없음)
  hospital: [
    ["security.arch", []], ["eval.predops", []], ["data.catalog", []],
    ["admin.augment", []], ["safetyact", []], ["repro", []],
  ],
};

/* 관리자 누수 판정어 — 사용자 포털 banned와 달리 '중립 기본값'은 통과시킨다 */
export const ADMIN_BANNED = {
  reb:           ["한빛정밀", "침탄", "포스프레임", "한성시", "새빛대학교"],
  manufacturing: ["한국부동산원", "공시지가", "표준지", "한성시", "새빛대학교"],
  civic:         ["한빛정밀", "침탄", "포스프레임", "한국부동산원", "공시지가", "표준지", "새빛대학교"],
  hospital:      ["한빛정밀", "침탄", "포스프레임", "한국부동산원", "공시지가", "표준지", "RTMS", "한성시"],
};

export const AGENT_IDS = [
  "agent-chatbot", "agent-report", "agent-meeting", "agent-knowledge", "agent-internalreg",
  "agent-ocr", "agent-dbquery", "agent-address", "agent-dataanalysis", "agent-summary",
  "agent-translate", "agent-review", "agent-safety",
];

/* 관리자 메뉴 전체 목록 — App.jsx의 라우팅 맵을 그대로 읽는다.
   여기에 목록을 하드코딩하면 메뉴가 늘어날 때 조용히 스캔에서 빠지므로
   소스를 정본으로 삼는다(등록 지점이 둘로 갈라지는 것을 막는다). */
export function adminMenus() {
  try {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const app = path.resolve(here, "../../../../src/App.jsx");
    const s = fs.readFileSync(app, "utf8");
    const m = s.match(/'([a-z0-9.]+)':\s*<[A-Za-z]/g) || [];
    return [...new Set(m.map(x => x.match(/'([^']+)'/)[1]))];
  } catch {
    return [];
  }
}

export function findChrome() {
  const cands = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    (process.env.LOCALAPPDATA || "") + "\\Google\\Chrome\\Application\\chrome.exe",
  ].filter(Boolean);
  return cands.find(p => { try { return fs.existsSync(p); } catch { return false; } });
}

export const sleep = ms => new Promise(r => setTimeout(r, ms));

/* 캡처·스캔 전 상태 초기화 — 저장된 대화나 UI 설정이 판정을 오염시키지 않게 */
export const RESET_STORAGE = `(() => { try {
  Object.keys(localStorage).filter(k => k.startsWith('genos.convos')).forEach(k => localStorage.removeItem(k));
  localStorage.removeItem('genos.uiPrefs');
} catch (e) {} })()`;
