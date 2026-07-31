/**
 * adminscan.mjs — 관리자 화면 도메인 콘텐츠 스캐너
 *
 * 왜 필요한가:
 *   verify.mjs·deepscan.mjs는 둘 다 '사용자 포털'만 본다. 그런데 관리자 45+ 페이지는
 *   mocks.js 기본값 위에 팩 adminContent를 덮는 구조라, 팩이 키를 빠뜨려도 화면은
 *   멀쩡히 렌더된다 — 다른 도메인 콘텐츠나 도메인 중립 일반론이 대신 나올 뿐이다.
 *   실제로 나중에 추가된 관리자 6개 페이지(보안 아키텍처·예측 모델 운영·카탈로그·
 *   증강 전략·중대재해·재현성)가 공공·행정에서 오래 중립 기본값으로 남아 있었다.
 *
 * 무엇을 보는가:
 *   ① 누수 — 그 도메인에 나오면 안 되는 타 도메인 조직명·업무어(ADMIN_BANNED)
 *   ② 누락 — 그 도메인이 공급했어야 할 마커(ADMIN_PAGES)
 *
 * 쓰는 법:
 *   node .claude/skills/genos-verify/scripts/adminscan.mjs [baseUrl] [domainId]
 *   도메인 생략 시 ADMIN_PAGES에 등록된 전 도메인을 순회한다.
 *
 * ⚠️ 마커는 반드시 '기본 탭에서 실제로 렌더되는' 문자열로 둘 것.
 *    탭·아코디언 안쪽 문자열을 넣으면 멀쩡한 화면이 FAIL로 잡힌다.
 */
import puppeteer from "puppeteer-core";
import { ADMIN_PAGES, ADMIN_BANNED, findChrome, sleep, RESET_STORAGE } from "./scan-config.mjs";

const BASE = process.argv[2] || "http://localhost:5173";
const ONLY = process.argv[3] || null;

const targets = Object.keys(ADMIN_PAGES).filter(d => !ONLY || d === ONLY);
if (!targets.length) {
  console.error(`[실행 불가] 알 수 없는 도메인: ${ONLY} (등록: ${Object.keys(ADMIN_PAGES).join(", ")})`);
  process.exit(2);
}

const chrome = findChrome();
if (!chrome) { console.error("[실행 불가] Chrome을 찾지 못함 — CHROME_PATH 환경변수 지정"); process.exit(2); }

const browser = await puppeteer.launch({
  executablePath: chrome, headless: "new", args: ["--no-sandbox", "--disable-gpu"],
});

let totalFail = 0;

for (const dom of targets) {
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("pageerror", e => consoleErrors.push(String(e.message || e)));

  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.evaluate(RESET_STORAGE);

  const banned = ADMIN_BANNED[dom] || [];
  const results = [];

  for (const [menu, markers] of ADMIN_PAGES[dom]) {
    await page.goto(`${BASE}/#/${dom}/admin/${menu}`, { waitUntil: "networkidle2" });
    await sleep(900);
    const txt = await page.evaluate(() => (document.querySelector("main") || document.body).innerText);
    const missing = markers.filter(m => !txt.includes(m));
    const leak = banned.filter(w => txt.includes(w));
    results.push({ menu, missing, leak });
  }

  await page.close();

  const fails = results.filter(r => r.missing.length || r.leak.length);
  totalFail += fails.length + consoleErrors.length;

  console.log(`\n[${fails.length || consoleErrors.length ? "FAIL" : "PASS"}] ${dom} — 관리자 ${ADMIN_PAGES[dom].length}페이지`);
  for (const r of results) {
    const bad = r.missing.length || r.leak.length;
    if (!bad) continue;
    const parts = [];
    if (r.leak.length) parts.push(`누수: ${r.leak.join(", ")}`);
    if (r.missing.length) parts.push(`누락: ${r.missing.join(", ")}`);
    console.log(`  ✗ ${r.menu} — ${parts.join(" · ")}`);
  }
  for (const e of consoleErrors) console.log(`  ✗ 페이지 에러: ${e.slice(0, 120)}`);
}

await browser.close();

console.log(totalFail
  ? `\n결과: FAIL — 누락은 팩 adminContent에 해당 키를 추가하고, 누수는 그 상수를 팩으로 이관하라.`
  : `\n결과: PASS (관리자 화면 도메인 콘텐츠 정상)`);
process.exit(totalFail ? 1 : 0);
