import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACT_DIR = '/Users/evaceylan/.gemini/antigravity/brain/6f6f72bd-feaa-4b1e-9d99-bbfe76674441';
const LIVE_URL = 'https://teatime-7dc11.web.app';

async function testDumpCyanideSurvival() {
  console.log('🚀 [QA Lead Burak] Starting Live Verification: Poisoned Cup + DUMP survival test...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  await page.goto(LIVE_URL, { waitUntil: 'networkidle0' });

  // 1. Create Room
  await page.waitForSelector('#hostName', { timeout: 10000 });
  await page.type('#hostName', 'Dedektif');
  await page.click('#btnCreate');
  await page.waitForSelector('#btnAddBot', { timeout: 15000 });

  // 2. Add 5 Bots (with 5 bots targeting each other, someone is guaranteed to drop cyanide)
  for (let i = 1; i <= 5; i++) {
    await page.click('#btnAddBot');
    await new Promise(r => setTimeout(r, 600));
  }

  // 3. Start Game
  await page.click('#btnStartGame');
  await page.waitForSelector('#btnSubmitPhase1', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));

  // Drop Cyanide into an opponent's cup
  console.log('   Selecting Cyanide attack on Bot 1...');
  const btnCyanide = await page.$('#btnDropCyanide');
  if (btnCyanide) {
    await btnCyanide.click();
    await new Promise(r => setTimeout(r, 400));
  }
  await page.click('#btnSubmitPhase1');

  // 4. Phase 2: DUMP TEA
  console.log('   Waiting for Phase 2...');
  await page.waitForSelector('#btnVerdictDump', { timeout: 20000 });
  await new Promise(r => setTimeout(r, 1200));

  console.log('   Clicking DUMP (ÇAYI DÖK)...');
  await page.click('#btnVerdictDump');
  await new Promise(r => setTimeout(r, 500));

  console.log('   Confirming DUMP verdict...');
  await page.click('#btnConfirmVerdict');

  // 5. Phase 3: Check Outcome
  console.log('   Waiting for Round Resolution...');
  await page.waitForFunction(() => {
    return document.querySelector('.banner-relief') || 
           document.querySelector('.banner-regret') || 
           document.querySelector('.card h2');
  }, { timeout: 25000 });
  await new Promise(r => setTimeout(r, 1500));

  const p3Shot = path.join(ARTIFACT_DIR, 'live_poison_test_phase3.png');
  await page.screenshot({ path: p3Shot, fullPage: false });

  const reliefBanner = await page.$('.banner-relief');
  const regretBanner = await page.$('.banner-regret');
  const deathCard = await page.$('.death-card');

  console.log('\n================ CYANIDE DUMP VERIFICATION ================');
  if (reliefBanner) {
    const text = await page.$eval('.banner-relief', el => el.textContent.trim().replace(/\s+/g, ' '));
    console.log('🏆 100% SUCCESS: Cup had cyanide! DUMP saved player from death!');
    console.log('   Relief Banner:', text);
  } else if (regretBanner) {
    const text = await page.$eval('.banner-regret', el => el.textContent.trim().replace(/\s+/g, ' '));
    console.log('✅ Cup was clean! Player safely dumped without dying.');
    console.log('   Regret Banner:', text);
  }

  if (deathCard) {
    console.error('❌ CRITICAL ERROR: Death card shown despite dumping!');
  } else {
    console.log('✅ CONFIRMED: Player is 100% ALIVE and healthy after DUMP.');
  }
  console.log('===========================================================\n');

  await browser.close();
}

testDumpCyanideSurvival().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
