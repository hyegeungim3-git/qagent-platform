/**
 * genos-app 깊은 화면 스캔 — 에이전트 실행 후 화면·모달까지 들어가 타 도메인 잔재를 잡는다.
 *
 * verify.mjs는 '넓고 얕게'(전 도메인 × 초기 화면) 본다. 그래서 실행해야 나오는 화면의
 * 누수를 구조적으로 못 잡았다 — 실제로 이 스캐너가 다음 3건을 잡았다:
 *   · AgentWorkflowPanel의 공시지가_정형DB·도로명주소 하드코딩 (진행중 화면)
 *   · 문서 레터헤드의 REB 로고 (결과 화면)
 *   · AI 사전 검수 모달의 부동산 통계 점검 항목 (모달)
 *
 * 사용법: node .claude/skills/genos-verify/scripts/deepscan.mjs [baseUrl] [domainId]
 * 종료 코드: 0 = 잔재 없음, 1 = 잔재 있음, 2 = 실행 불가(서버/크롬)
 *
 * 느리다(도메인당 약 6~8분). 도메인 팩을 새로 쓰거나 코어 공용 화면을 건드린 뒤에 돌린다.
 */
import puppeteer from "puppeteer-core";
import { DOMAINS, AGENT_IDS, findChrome, sleep, RESET_STORAGE } from "./scan-config.mjs";

const BASE = process.argv[2] || "http://localhost:5173";
const ONLY = process.argv[3] || null;

/* main 안의 '주 실행 버튼'을 찾아 누른다 — 에이전트마다 문구가 달라 패턴으로 잡는다.
   조회형(DBQuery)은 아이콘 버튼이라 aria-label로 먼저 시도. */
const CLICK_PRIMARY = `(() => {
  const main = document.querySelector('main'); if (!main) return null;
  const byAria = main.querySelector('button[aria-label="질의 실행"]');
  if (byAria) { byAria.click(); return '질의 실행'; }
  const cands = [...main.querySelectorAll('button')].filter(b =>
    /(시작|실행|생성|자동 작성)$/.test(b.innerText.trim()) && b.offsetParent !== null &&
    /bg-(indigo|blue|violet|orange|emerald|teal|rose|slate|amber|green)-[456]00/.test(b.className));
  const b = cands[cands.length - 1];
  if (b) { b.click(); return b.innerText.trim().slice(0, 24); }
  return null;
})()`;

const CLICK_APPROVAL = `(() => {
  const b = [...document.querySelectorAll('button')].find(x => x.innerText.includes('결재 상신'));
  if (b) { b.click(); return true; } return false;
})()`;

const chrome = findChrome();
if (!chrome) { console.error("크롬을 찾지 못했습니다. CHROME_PATH를 지정하세요."); process.exit(2); }

const targets = DOMAINS.filter(d => !d.deepSkip && (!ONLY || d.id === ONLY));
if (!targets.length) { console.error("스캔 대상 도메인이 없습니다."); process.exit(2); }

const browser = await puppeteer.launch({ executablePath: chrome, headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1100 });
const pageErrors = [];
page.on("pageerror", e => pageErrors.push(String(e).slice(0, 140)));

const findings = new Map(); // "domain|where|word" → true

try {
  for (const d of targets) {
    const words = [...new Set([...d.banned, ...(d.deepExtra || [])])];
    const check = (where, text) => {
      for (const w of words) if (text.includes(w)) findings.set(`${d.id}|${where}|${w}`, true);
    };
    process.stdout.write(`[${d.label}] 스캔 중`);

    for (const id of AGENT_IDS) {
      try {
        await page.goto(`${BASE}/#/${d.id}/user/agent/${id}`, { waitUntil: "networkidle2", timeout: 30000 });
        await page.evaluate(RESET_STORAGE);
        await sleep(1400);
        check(`${id}/입력`, await page.evaluate(() => document.body.innerText));

        const clicked = await page.evaluate(CLICK_PRIMARY);
        if (clicked) {
          await sleep(3200);
          check(`${id}/진행중`, await page.evaluate(() => document.body.innerText));
          await sleep(11000);
          check(`${id}/결과`, await page.evaluate(() => document.body.innerText));

          if (await page.evaluate(CLICK_APPROVAL)) {
            await sleep(9000);
            check(`${id}/사전검수`, await page.evaluate(() => document.body.innerText));
          }
        }
      } catch (e) {
        findings.set(`${d.id}|${id}/실행오류|${String(e).slice(0, 60)}`, true);
      }
      process.stdout.write(".");
    }
    process.stdout.write("\n");
  }
} finally {
  await browser.close();
}

/* ── 보고 ── */
const grouped = {};
for (const key of findings.keys()) {
  const [dom, where, word] = key.split("|");
  ((grouped[dom] ||= {})[where] ||= []).push(word);
}
console.log("");
if (!Object.keys(grouped).length) {
  const n = targets.length * AGENT_IDS.length;
  console.log(`[PASS] 잔재 0건 — ${targets.map(d => d.label).join("·")} 에이전트 ${n}종 × (입력·진행·결과·사전검수)`);
} else {
  console.log(`[FAIL] 잔재 ${findings.size}건\n`);
  for (const [dom, wheres] of Object.entries(grouped)) {
    const label = DOMAINS.find(x => x.id === dom)?.label || dom;
    console.log(`[${label}]`);
    for (const [where, ws] of Object.entries(wheres)) console.log(`  ${where}: ${ws.join(", ")}`);
    console.log("");
  }
  console.log("→ 대부분 팩의 agentContent 미공급이 원인이다. 해당 에이전트 키를 팩에 추가하라.");
}
if (pageErrors.length) console.log(`\n페이지 에러 ${pageErrors.length}건: ${pageErrors.slice(0, 3).join(" / ")}`);

process.exit(findings.size ? 1 : 0);
