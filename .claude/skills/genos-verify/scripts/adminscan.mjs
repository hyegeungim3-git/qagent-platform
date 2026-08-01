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
 *   1단계(렌더) ① 누수 — 그 도메인에 나오면 안 되는 타 도메인 용어(ADMIN_BANNED)
 *              ② 누락 — 그 도메인이 공급했어야 할 마커(ADMIN_PAGES)
 *   2단계(클릭) ③ 크래시 — main 안의 버튼을 실제로 눌러 보고 페이지 에러·흰 화면을 잡는다
 *
 * 쓰는 법:
 *   node .claude/skills/genos-verify/scripts/adminscan.mjs [baseUrl] [domainId] [--no-click]
 *   도메인 생략 시 1단계는 전 도메인, 2단계는 reb 한 도메인(크래시는 코드 결함이라 충분).
 *   팩 adminContent를 크게 바꿨다면 그 도메인을 인자로 넘겨 2단계를 따로 돌릴 것.
 *   약 5~8분(버튼 약 580개). 급할 때만 --no-click.
 *
 * ⚠️ 마커는 반드시 '기본 탭에서 실제로 렌더되는' 문자열로 둘 것.
 *    탭·아코디언 안쪽 문자열을 넣으면 멀쩡한 화면이 FAIL로 잡힌다.
 */
import puppeteer from "puppeteer-core";
import { ADMIN_PAGES, ADMIN_BANNED, adminMenus, findChrome, sleep, RESET_STORAGE } from "./scan-config.mjs";

const ARGS = process.argv.slice(2).filter(a => !a.startsWith("--"));
const FLAGS = process.argv.slice(2).filter(a => a.startsWith("--"));
const BASE = ARGS[0] || "http://localhost:5173";
const ONLY = ARGS[1] || null;
const SKIP_CLICK = FLAGS.includes("--no-click");   // 2단계(클릭 스윕) 생략 — 빠른 확인용
const CLICK_DOMAIN = ONLY || "reb";                // 클릭 크래시는 코드 결함이라 한 도메인이면 충분

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

/* ══════════════════════════════════════════════════════════════════
 * 2단계 — 버튼 클릭 스윕
 *
 * 1단계는 '화면이 그려지는가'만 본다. 그런데 관리자에서 실제로 난 사고는
 * 렌더가 아니라 클릭이었다: useToast()는 함수를 반환하는데 9개 컴포넌트가
 * const { setToast } = useToast()로 구조분해해 undefined를 호출 —
 * 클릭하는 순간 TypeError로 41지점이 죽고 있었다.
 * 정적 스캔(onClick 유무)으로는 못 잡는다. 핸들러는 있고 내용이 죽은 유형이다.
 *
 * 그래서 main 안의 버튼을 실제로 눌러 보고 크래시·흰 화면을 잡는다.
 * 크래시는 코드 결함이라 한 도메인이면 충분하다(팩 adminContent를 크게
 * 바꿨다면 그 도메인을 인자로 넘겨 따로 돌릴 것).
 * ══════════════════════════════════════════════════════════════════ */
const clickFindings = [];
if (!SKIP_CLICK) {
  const menus = adminMenus();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errs = [];
  page.on("pageerror", e => errs.push(String(e.message || e)));
  page.on("console", m => {
    if (m.type() !== "error") return;
    const t = m.text();
    // 리소스 404 등 잡음은 제외하고 '핸들러가 죽은' 신호만 본다
    if (/TypeError|is not a function|undefined|Cannot read/.test(t)) errs.push("console: " + t.slice(0, 160));
  });

  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.evaluate(RESET_STORAGE);
  process.stdout.write(`\n[클릭 스윕] ${CLICK_DOMAIN} · ${menus.length}메뉴 `);

  let clicked = 0;
  for (const menu of menus) {
    const url = `${BASE}/#/${CLICK_DOMAIN}/admin/${menu}`;
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.evaluate(RESET_STORAGE);
    await sleep(450);
    const seen = [];
    let reloadedOnce = false;   // 탭 전환으로 가려진 버튼을 되살리기 위한 1회 재적재
    // 탭 전환으로 새 버튼이 드러나므로 매번 다시 훑는다. 상한은 폭주 방지용.
    for (let i = 0; i < 120; i++) {
      const before = errs.length;
      const label = await page.evaluate((seenArr) => {
        const skip = /포털 선택|사용자 포털|로그아웃/;
        const btns = [...document.querySelectorAll("main button")]
          .filter(b => b.offsetParent !== null && !b.disabled);
        for (const b of btns) {
          const key = ((b.getAttribute("aria-label") || "") + "|" + b.innerText.replace(/\s+/g, " ").trim()).slice(0, 60);
          if (seenArr.includes(key)) continue;
          if (skip.test(key)) { seenArr.push(key); continue; }
          b.click();
          return key;
        }
        return null;
      }, seen);
      /* 현재 DOM에 안 눌러 본 버튼이 없다고 끝내면 안 된다.
         탭을 전환한 상태라 이전 탭에만 있던 버튼이 화면에서 사라졌을 뿐일 수 있다
         (이 함정 때문에 처음엔 545개를 눌러 놓고도 크래시를 못 잡았다).
         한 번 새로 적재해 기본 탭으로 되돌린 뒤 남은 버튼을 마저 누른다. */
      if (!label) {
        if (reloadedOnce) break;
        reloadedOnce = true;
        await page.goto(url, { waitUntil: "networkidle2" });
        await sleep(400);
        continue;
      }
      reloadedOnce = false;
      seen.push(label);
      clicked++;
      await sleep(230);

      const state = await page.evaluate(() => {
        const m = document.querySelector("main");
        return { len: m ? m.innerText.trim().length : 0, hash: location.hash };
      });
      for (const e of errs.slice(before)) {
        clickFindings.push(`${menu} · "${label.replace(/^\|/, "")}" → ${e.slice(0, 110)}`);
      }
      if (state.len < 80) {
        clickFindings.push(`${menu} · "${label.replace(/^\|/, "")}" → 화면이 비었음(본문 ${state.len}자)`);
      }
      // 모달이 열렸으면 닫고, 다른 화면으로 이동했으면 원래 메뉴로 되돌린다
      await page.keyboard.press("Escape");
      if (state.hash !== `#/${CLICK_DOMAIN}/admin/${menu}` || state.len < 80) {
        await page.goto(url, { waitUntil: "networkidle2" });
        await sleep(350);
      }
    }
    process.stdout.write(".");
  }
  process.stdout.write("\n");
  await page.close();

  const uniq = [...new Set(clickFindings)];
  totalFail += uniq.length;
  console.log(`\n[${uniq.length ? "FAIL" : "PASS"}] 클릭 스윕 — 버튼 ${clicked}개 클릭`);
  for (const f of uniq.slice(0, 40)) console.log(`  ✗ ${f}`);
  if (uniq.length > 40) console.log(`  … 외 ${uniq.length - 40}건`);
}

await browser.close();

console.log(totalFail
  ? `\n결과: FAIL — 누락은 팩 adminContent에 키를 추가, 누수는 그 상수를 팩으로 이관,\n      클릭 크래시는 코드 결함이니 스택부터 볼 것.`
  : `\n결과: PASS (관리자 화면 도메인 콘텐츠 · 버튼 클릭 정상)`);
process.exit(totalFail ? 1 : 0);
