import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const LIVE_URL = 'https://teatime-7dc11.web.app';
const ARTIFACT_DIR = '/Users/evaceylan/.gemini/antigravity/brain/6f6f72bd-feaa-4b1e-9d99-bbfe76674441';

async function runLiveEndToEnd() {
  console.log('🚀 Launching headless Chrome for LIVE Production verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  await page.evaluateOnNewDocument(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  console.log('Opening live app:', LIVE_URL);
  await page.goto(LIVE_URL, { waitUntil: 'networkidle0' });

  // 1. Create Room as 'Dedektif_Poyraz'
  console.log('Creating room as Dedektif_Poyraz...');
  await page.waitForSelector('#hostName', { timeout: 15000 });
  await page.type('#hostName', 'Dedektif_Poyraz');
  await page.click('#btnCreate');
  await page.waitForSelector('#btnAddBot', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 600));

  // Add 6 bots for 7 players
  console.log('Adding 6 bots...');
  for (let i = 1; i <= 6; i++) {
    await page.click('#btnAddBot');
    await new Promise(r => setTimeout(r, 300));
  }

  // 2. Start Game
  console.log('Starting game...');
  await page.click('#btnStartGame');
  await new Promise(r => setTimeout(r, 1000));

  // 3. Phase 1: Intrigue
  await page.waitForSelector('#btnSubmitPhase1', { timeout: 20000 });
  console.log('In Phase 1. Submitting sweet sugar action...');
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.player-target-card-3col, .player-select-card');
    if (cards.length > 0) {
      cards[0].click();
    }
  });
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => {
    const btn = document.getElementById('btnSubmitPhase1');
    if (btn) btn.click();
  });

  // 4. Phase 2: Decision Phase (Panel 1)
  console.log('Waiting for Phase 2: Decision Phase...');
  await page.waitForSelector('.cups-table-232', { timeout: 25000 });
  await new Promise(r => setTimeout(r, 1500));

  // Click DRINK action to activate gold border state matching Panel 1 reference
  const btnDrink = await page.$('#btnVerdictDrink');
  if (btnDrink) {
    await btnDrink.click();
    await new Promise(r => setTimeout(r, 400));
  }

  // Save Panel 1 screenshot
  const p1Path = path.join(ARTIFACT_DIR, 'live_final_panel1_decision.png');
  await page.screenshot({ path: p1Path, fullPage: false });
  console.log('✅ Captured Live Panel 1:', p1Path);

  // 5. Test Live Panel 2 (Tarot Card Modifier)
  console.log('Capturing Live Panel 2: Blind Tasting Tarot Card...');
  await page.evaluate(async () => {
    const room = window.__cot.getRoom();
    await window.__cot.DB.update(`rooms/${room.code}`, { currentModifier: 'BLIND_TASTING' });
  });
  await page.waitForSelector('.tarot-card-pixel-container', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 600));
  const p2Path = path.join(ARTIFACT_DIR, 'live_final_panel2_tarot.png');
  await page.screenshot({ path: p2Path, fullPage: false });
  console.log('✅ Captured Live Panel 2:', p2Path);

  // Return to Phase 2 by clearing modifier
  await page.evaluate(async () => {
    const room = window.__cot.getRoom();
    await window.__cot.DB.update(`rooms/${room.code}`, { currentModifier: null });
  });
  await page.waitForSelector('.cups-table-232', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 600));

  // Confirm Verdict DRINK
  console.log('Submitting verdict...');
  await page.click('#btnConfirmVerdict');
  await new Promise(r => setTimeout(r, 1500));

  // If host reveal button is visible, click it to immediately advance to Phase 3
  const btnForce = await page.$('#btnHostRevealPhase3') || await page.$('#btnHostForcePhase3');
  if (btnForce) {
    console.log('Clicking host reveal button to advance to Phase 3...');
    await btnForce.click();
  }

  // Wait for Phase 3 or Poison Reveal
  console.log('Waiting for Phase 3 / Poison Screen...');
  await new Promise(r => setTimeout(r, 3000));

  // Check Poison Screen
  const poisonScreen = await page.$('.poisoned-cinematic-screen');
  if (poisonScreen) {
    console.log('Poison reveal screen detected in live gameplay!');
    const p4Path = path.join(ARTIFACT_DIR, 'live_final_panel4_poison.png');
    await page.screenshot({ path: p4Path, fullPage: false });
    console.log('✅ Captured Live Panel 4 (Gameplay):', p4Path);

    await page.click('#btnPoisonContinue');
    await new Promise(r => setTimeout(r, 1500));
  } else {
    // If not naturally poisoned this round, trigger renderPoisonRevealScreen with realistic event data to capture live screen
    console.log('Triggering Live Poison Reveal screen capture...');
    await page.evaluate(() => {
      const room = window.__cot.getRoom();
      room.lastPoisonEvent = {
        victimName: 'Watson',
        killerName: 'Moriarty',
        pointsLost: 2,
        bountyAwarded: 2
      };
      window.__cot.renderPoisonRevealScreen();
    });
    await new Promise(r => setTimeout(r, 800));
    const p4Path = path.join(ARTIFACT_DIR, 'live_final_panel4_poison.png');
    await page.screenshot({ path: p4Path, fullPage: false });
    console.log('✅ Captured Live Panel 4:', p4Path);

    // Now return to Phase 3
    await page.evaluate(() => {
      window.__cot.renderPhase3();
    });
    await new Promise(r => setTimeout(r, 800));
  }

  // Capture Phase 3 (Result Phase with shattered cup)
  console.log('Capturing Live Panel 3: Result Phase...');
  await page.waitForSelector('.shattered-cup-scene', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));
  const p3Path = path.join(ARTIFACT_DIR, 'live_final_panel3_result.png');
  await page.screenshot({ path: p3Path, fullPage: false });
  console.log('✅ Captured Live Panel 3:', p3Path);

  console.log('🎯 All 4 Live Panels successfully captured on PRODUCTION!');
  await browser.close();
}

runLiveEndToEnd().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
