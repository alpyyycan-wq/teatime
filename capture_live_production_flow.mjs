import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const LIVE_URL = 'https://teatime-7dc11.web.app';

async function runLiveTest() {
  console.log('🚀 Launching Chrome to test LIVE production:', LIVE_URL);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  await page.evaluateOnNewDocument(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // 1. Open Home
  await page.goto(LIVE_URL, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'live_step1_home.png' });
  console.log('Saved live_step1_home.png');

  // 2. Create Room
  await page.waitForSelector('#hostName', { timeout: 15000 });
  await page.type('#hostName', 'Dedektif_Poyraz');
  await page.click('#btnCreate');
  await page.waitForSelector('#btnAddBot', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 600));

  // Add 5 bots so we have 6 players (or 6 bots for 7 players)
  console.log('Adding 6 bots for 7-player table...');
  for (let i = 1; i <= 6; i++) {
    await page.click('#btnAddBot');
    await new Promise(r => setTimeout(r, 400));
  }

  await page.screenshot({ path: 'live_step2_lobby.png' });
  console.log('Saved live_step2_lobby.png');

  // 3. Start Game
  console.log('Starting game...');
  await page.click('#btnStartGame');
  await new Promise(r => setTimeout(r, 1200));

  // 4. Capture Phase 1 (Intrigue / Sugar Drop)
  await page.waitForSelector('#btnSubmitPhase1', { timeout: 20000 });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'live_step3_phase1.png' });
  console.log('Saved live_step3_phase1.png');

  // Submit Phase 1 action
  const targets = await page.$$('.player-target-card-3col');
  if (targets.length > 0) {
    await targets[0].click();
    await new Promise(r => setTimeout(r, 300));
    await page.click('#btnSubmitPhase1');
    console.log('Submitted Phase 1 action!');
  }

  // 5. Wait for Phase 2 (Decision Phase)
  console.log('Waiting for Phase 2...');
  await page.waitForSelector('.cups-table-232', { timeout: 20000 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'live_step4_phase2_decision.png' });
  console.log('Saved live_step4_phase2_decision.png');

  // 6. Test Verdict Selection (e.g. click DUMP)
  const btnDump = await page.$('#btnVerdictDump');
  if (btnDump) {
    await btnDump.click();
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: 'live_step5_phase2_dump_selected.png' });
    console.log('Saved live_step5_phase2_dump_selected.png');
  }

  // 7. Confirm Verdict (MASAYI AÇIKLA)
  const btnConfirm = await page.$('#btnConfirmVerdict');
  if (btnConfirm) {
    await btnConfirm.click();
    console.log('Confirmed verdict!');
  }

  // 8. Wait for Phase 3 (or Poison Screen)
  console.log('Waiting for Phase 3 or Poison Reveal...');
  await new Promise(r => setTimeout(r, 4000));
  
  // Check if Poison Reveal Screen is visible
  const poisonScreen = await page.$('.poisoned-cinematic-screen');
  if (poisonScreen) {
    console.log('Poison reveal screen detected!');
    await page.screenshot({ path: 'live_step6_poison_reveal.png' });
    console.log('Saved live_step6_poison_reveal.png');
    // Dismiss it
    await page.click('#btnPoisonContinue');
    await new Promise(r => setTimeout(r, 1200));
  }

  // Capture Phase 3
  await page.waitForSelector('.filigree-frame', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'live_step7_phase3_result.png' });
  console.log('Saved live_step7_phase3_result.png');

  console.log('🎉 Live production testing complete!');
  await browser.close();
}

runLiveTest().catch(console.error);
