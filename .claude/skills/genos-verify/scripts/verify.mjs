/**
 * genos-app 3도메인 자동 검증 — 금칙어·핵심 마커·시나리오 카드·콘솔 에러
 *
 * 사용법: node .claude/skills/genos-verify/scripts/verify.mjs [baseUrl] [domainId]
 *   baseUrl  기본 http://localhost:5173 (dev 서버 시작 로그의 실제 포트 확인)
 *   domainId 지정 시 해당 도메인만 (reb | manufacturing | civic)
 * 크롬 탐지 실패 시: CHROME_PATH 환경변수로 chrome.exe 경로 지정
 * 종료 코드: 0 = 전 항목 통과, 1 = 실패 있음, 2 = 실행 불가(서버/크롬)
 */
import fs from "node:fs";
import puppeteer from "puppeteer-core";

const BASE = process.argv[2] || "http://localhost:5173";
const ONLY = process.argv[3] || null;

// 도메인별 판정 기준 — 새 도메인 팩을 추가하면 여기에 항목을 추가하라 (index.js 등록과 나란히)
const DOMAINS = [
  {
    id: "reb", label: "한국부동산원",
    banned: ["KOGAS", "kogas", "한빛정밀", "한성시청", "HBP-", "HSC-", "새빛대학교병원", "SUH-"],
    generalMarkers: ["한국부동산원", "오늘의 업무 브리핑", "실거래 이상거래 탐지"],
    hubMarkers: ["공시지가 이의신청 서류 일괄 처리", "실거래 신고 이상거래 검증"],
    orchCards: 2,
  },
  {
    id: "manufacturing", label: "한빛정밀",
    banned: ["KOGAS", "kogas", "한국부동산원", "공시지가", "표준지", "KREA-", "한성시청", "HSC-", "새빛대학교병원", "SUH-"],
    generalMarkers: ["한빛정밀", "오늘의 업무 브리핑", "설비 데이터 진단", "금형 설계 지원"],
    hubMarkers: ["프레스 진동 알람 자동 대응", "협력사 검사성적서 일괄 처리", "금형 설계 아웃라인 자동 생성"],
    orchCards: 3,
  },
  {
    id: "civic", label: "한성시청",
    banned: ["KOGAS", "kogas", "한국부동산원", "공시지가", "KREA-", "한빛정밀", "HBP-", "새빛대학교병원", "SUH-"],
    generalMarkers: ["한성시", "오늘의 업무 브리핑", "재난 상황 확인"],
    hubMarkers: ["옥외광고물 허가 신청 일괄 처리", "호우경보 재난 상황보고 작성"],
    orchCards: 2,
  },
  {
    id: "hospital", label: "새빛대학교병원",
    banned: ["KOGAS", "kogas", "한국부동산원", "공시지가", "표준지", "KREA-", "한빛정밀", "HBP-", "한성시청", "HSC-"],
    generalMarkers: ["오늘의 업무 브리핑", "응급실 현황", "응급실 병상 가동률"],
    hubMarkers: ["입원 진료비 삭감위험 사전점검", "응급실 포화 경보 대응"],
    orchCards: 2,
  },
];

function findChrome() {
  const cands = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    (process.env.LOCALAPPDATA || "") + "\\Google\\Chrome\\Application\\chrome.exe",
  ].filter(Boolean);
  return cands.find(p => { try { return fs.existsSync(p); } catch { return false; } });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function clickByText(page, text, { exact = false } = {}) {
  return page.evaluate(({ text, exact }) => {
    const btn = [...document.querySelectorAll("button")].find(b =>
      exact ? b.textContent.trim() === text : b.textContent.includes(text));
    if (btn) { btn.click(); return true; }
    return false;
  }, { text, exact });
}

async function scanDomain(browser, d) {
  const fails = [];
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  const consoleErrors = [];
  page.on("console", m => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 160)); });
  page.on("pageerror", e => consoleErrors.push(String(e).slice(0, 160)));

  try {
    await page.goto(BASE, { waitUntil: "networkidle2", timeout: 30000 });
  } catch (e) {
    await page.close();
    return { fails: [`서버 접속 실패: ${e.message}`], consoleErrors };
  }
  await page.evaluate(id => {
    localStorage.setItem("genos.activeDomain", id);
    localStorage.removeItem("genos.uiPrefs"); // 다크·영어 설정 잔재가 마커 판정을 오염하지 않도록
  }, d.id);
  await page.reload({ waitUntil: "networkidle2" });
  await sleep(600);

  // 포털 → 사용자 포털 진입
  if (!(await clickByText(page, "사용자 포털"))) fails.push("포털: '사용자 포털' 버튼 없음");
  await sleep(1200);

  // GENERAL 화면 스캔
  const generalText = await page.evaluate(() => document.body.innerText);
  for (const w of d.banned) if (generalText.includes(w)) fails.push(`GENERAL 금칙어: "${w}"`);
  for (const m of d.generalMarkers) if (!generalText.includes(m)) fails.push(`GENERAL 마커 누락: "${m}"`);

  // 사이드바 접힘이면 펼치기 (탭 버튼이 사이드바 안에 있음)
  await page.evaluate(() => {
    const ex = [...document.querySelectorAll("button")].find(b => b.getAttribute("aria-label") === "사이드바 펼치기");
    if (ex) ex.click();
  });
  await sleep(400);

  // 에이전트 허브 스캔
  if (!(await clickByText(page, "에이전트", { exact: true }))) fails.push("탭: '에이전트' 버튼 없음(사이드바 확인)");
  await sleep(1500); // lazy 청크 로딩 대기
  const hub = await page.evaluate(() => ({
    text: document.body.innerText,
    cards: [...document.querySelectorAll("button")].filter(b => b.textContent.includes("시나리오 실행")).length,
  }));
  for (const w of d.banned) if (hub.text.includes(w)) fails.push(`허브 금칙어: "${w}"`);
  for (const m of d.hubMarkers) if (!hub.text.includes(m)) fails.push(`허브 마커 누락: "${m}"`);
  if (hub.cards !== d.orchCards) fails.push(`시나리오 카드 ${hub.cards}장 (기대 ${d.orchCards})`);

  // 모바일(375) 회귀 — 신규 로드 기준: 가로 스크롤 금지 + 포털 진입 가능
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await sleep(500);
  if (!(await clickByText(page, "사용자 포털"))) fails.push("375: '사용자 포털' 버튼 없음");
  await sleep(1000);
  const mob = await page.evaluate(() => ({
    hScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  }));
  if (mob.hScroll) fails.push("375: 가로 스크롤 발생");

  await page.close();
  return { fails, consoleErrors };
}

const chrome = findChrome();
if (!chrome) { console.error("[실행 불가] Chrome을 찾지 못함 — CHROME_PATH 환경변수 지정"); process.exit(2); }

const browser = await puppeteer.launch({ executablePath: chrome, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });
let anyFail = false;
try {
  for (const d of DOMAINS) {
    if (ONLY && d.id !== ONLY) continue;
    const { fails, consoleErrors } = await scanDomain(browser, d);
    const errs = consoleErrors.filter(e => !e.includes("favicon")); // 파비콘 404는 무시
    const ok = fails.length === 0 && errs.length === 0;
    if (!ok) anyFail = true;
    console.log(`\n[${ok ? "PASS" : "FAIL"}] ${d.label} (${d.id})`);
    fails.forEach(f => console.log(`  ✗ ${f}`));
    errs.forEach(e => console.log(`  ✗ 콘솔: ${e}`));
    if (ok) console.log("  ✓ 금칙어 0 · 마커 전부 존재 · 카드 수 일치 · 콘솔 에러 0");
  }
} finally {
  await browser.close();
}
console.log(anyFail ? "\n결과: FAIL — 위 항목을 해소한 뒤 재실행" : "\n결과: PASS (전 도메인)");
process.exit(anyFail ? 1 : 0);
