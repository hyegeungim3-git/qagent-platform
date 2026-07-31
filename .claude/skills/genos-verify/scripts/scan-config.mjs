/**
 * 검증 공통 설정 — verify.mjs(넓고 얕게)와 deepscan.mjs(좁고 깊게)가 함께 쓴다.
 *
 * ⚠️ 새 도메인 팩을 추가하면 여기 DOMAINS에 항목을 추가할 것.
 *    (src/domains/index.js 등록과 나란히 — 빠뜨리면 새 도메인이 검증에서 조용히 빠진다)
 */
import fs from "node:fs";

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

export const AGENT_IDS = [
  "agent-chatbot", "agent-report", "agent-meeting", "agent-knowledge", "agent-internalreg",
  "agent-ocr", "agent-dbquery", "agent-address", "agent-dataanalysis", "agent-summary",
  "agent-translate", "agent-review", "agent-safety",
];

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
