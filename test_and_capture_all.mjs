import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACT_DIR = '/Users/evaceylan/.gemini/antigravity/brain/6f6f72bd-feaa-4b1e-9d99-bbfe76674441';

async function runTestAndCapture() {
  console.log('🚀 Starting end-to-end verification and capture on localhost:3000...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  // Clear storage and start fresh
  await page.evaluateOnNewDocument(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // 1. HOME SCREEN
  console.log('1. Loading Home Screen...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  const shotHome = path.join(ARTIFACT_DIR, 'screen_1_home.png');
  await page.screenshot({ path: shotHome, fullPage: false });
  console.log(`✅ Saved Home Screen: ${shotHome}`);

  // 2. CREATE ROOM & LOBBY SCREEN
  console.log('2. Creating room as Lord_Poyraz...');
  await page.type('#hostName', 'Lord_Poyraz');
  await page.click('#btnCreate');
  await page.waitForSelector('#btnAddBot', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 600));

  // Add 3 bots
  console.log('Adding 3 bots to lobby...');
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 400));
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 400));
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 800));

  // Verify seat roster with assigned cups and non-truncated names
  const seatCount = await page.evaluate(() => document.querySelectorAll('.lobby-seat-row').length);
  console.log(`Lobby seat rows found: ${seatCount}`);
  if (seatCount !== 4) {
    throw new Error(`Expected 4 seats in lobby, found ${seatCount}`);
  }

  const shotLobby = path.join(ARTIFACT_DIR, 'screen_2_lobby.png');
  await page.screenshot({ path: shotLobby, fullPage: false });
  console.log(`✅ Saved Lobby Screen: ${shotLobby}`);

  // 3. START GAME -> PHASE 1
  console.log('3. Starting game and entering Phase 1...');
  await page.click('#btnStartGame');
  await page.waitForSelector('#btnSubmitPhase1', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));

  // Verify prominent decision button in Phase 1
  const submitPhase1Text = await page.evaluate(() => {
    const btn = document.getElementById('btnSubmitPhase1');
    return btn ? btn.innerText.trim() : null;
  });
  console.log(`Phase 1 Submit Button Text: "${submitPhase1Text}"`);

  // Target a player card and toggle cyanide
  console.log('Targeting second player and selecting Cyanide...');
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.player-target-card-3col');
    if (cards.length > 1) cards[1].click();
  });
  await new Promise(r => setTimeout(r, 400));

  await page.evaluate(() => {
    const btn = document.getElementById('btnDropCyanide');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const shotPhase1 = path.join(ARTIFACT_DIR, 'screen_3_phase1.png');
  await page.screenshot({ path: shotPhase1, fullPage: false });
  console.log(`✅ Saved Phase 1 Screen: ${shotPhase1}`);

  // Confirm Phase 1 Decision
  console.log('Confirming Phase 1 decision with #btnSubmitPhase1...');
  await page.evaluate(() => {
    const btn = document.getElementById('btnSubmitPhase1');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Verify locked banner in Phase 1
  const phase1LockedBanner = await page.$('.verdict-locked-banner');
  if (phase1LockedBanner) {
    console.log('✅ Phase 1 locked banner successfully displayed!');
  }

  // If host advance button visible, advance to Phase 2
  await page.evaluate(() => {
    const btn = document.getElementById('btnHostAdvancePhase2');
    if (btn) btn.click();
  });

  // 4. PHASE 2 DECISION
  console.log('4. Waiting for Phase 2 (Blind Tasting & Decision)...');
  await page.waitForSelector('.cups-table-232', { timeout: 20000 });
  await new Promise(r => setTimeout(r, 1200));

  // Check initial decision button text (default is DRINK)
  let verdictBtnText = await page.evaluate(() => {
    const btn = document.getElementById('btnConfirmVerdict');
    return btn ? btn.innerText.trim() : null;
  });
  console.log(`Initial Phase 2 Decision Button: "${verdictBtnText}"`);

  // Click DUMP card to switch verdict
  console.log('Selecting DUMP card...');
  await page.evaluate(() => {
    const btn = document.getElementById('btnVerdictDump');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  verdictBtnText = await page.evaluate(() => {
    const btn = document.getElementById('btnConfirmVerdict');
    return btn ? btn.innerText.trim() : null;
  });
  console.log(`Updated Phase 2 Decision Button after selecting DUMP: "${verdictBtnText}"`);

  const shotPhase2BeforeLock = path.join(ARTIFACT_DIR, 'screen_4_phase2_decision.png');
  await page.screenshot({ path: shotPhase2BeforeLock, fullPage: false });
  console.log(`✅ Saved Phase 2 Decision Screen: ${shotPhase2BeforeLock}`);

  // 5. AUDITOR AGENT DOCKET MODAL
  console.log('5. Testing Telemetry Auditor Agent Modal ("Lord Inspector")...');
  await page.evaluate(() => {
    const btn = document.getElementById('btnHeaderAuditor') || document.getElementById('btnToggleAuditor') || document.getElementById('btnHomeAuditorLink');
    if (btn) btn.click();
  });
  await page.waitForSelector('.auditor-docket-modal', { timeout: 8000 });
  await new Promise(r => setTimeout(r, 600));

  // Switch to Critique & Friction tab (tab index 2)
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('.auditor-tab-btn');
    if (tabs.length >= 3) tabs[2].click(); // Tab 3: UX Critique
  });
  await new Promise(r => setTimeout(r, 500));

  const shotAuditorModal = path.join(ARTIFACT_DIR, 'screen_5_auditor_modal.png');
  await page.screenshot({ path: shotAuditorModal, fullPage: false });
  console.log(`✅ Saved Auditor Docket Modal: ${shotAuditorModal}`);

  // Switch to Bot AI Mind tab (tab index 1) to inspect bot reasoning
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('.auditor-tab-btn');
    if (tabs.length >= 2) tabs[1].click(); // Tab 2: Bot AI Mind
  });
  await new Promise(r => setTimeout(r, 500));

  const shotBotNotes = path.join(ARTIFACT_DIR, 'screen_5b_bot_agent_notes.png');
  await page.screenshot({ path: shotBotNotes, fullPage: false });
  console.log(`✅ Saved Bot Agent Notes Modal: ${shotBotNotes}`);

  // Close modal
  await page.evaluate(() => {
    const btn = document.getElementById('btnCloseAuditor');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Confirm Personal Verdict
  console.log('Clicking "KARAR VER: ÇAYI DÖKÜYORUM"...');
  await page.evaluate(() => {
    const btn = document.getElementById('btnConfirmVerdict');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // 6. ADVANCE TO PHASE 3 (RESULTS)
  console.log('6. Host revealing table results via #btnHostRevealPhase3 (if still in Phase 2)...');
  await page.evaluate(() => {
    const btn = document.getElementById('btnHostRevealPhase3');
    if (btn) btn.click();
  });

  // Wait for Phase 3 or Poison Reveal
  console.log('Waiting for Phase 3 / Poison screen...');
  await new Promise(r => setTimeout(r, 3000));

  // Check if poison reveal cinematic appeared
  const poisonScreen = await page.$('.poisoned-cinematic-screen');
  if (poisonScreen) {
    console.log('Poison reveal cinematic triggered! Clicking continue...');
    const btnContinue = await page.$('#btnPoisonContinue');
    if (btnContinue) await btnContinue.click();
    await new Promise(r => setTimeout(r, 1500));
  }

  // Wait for Phase 3 results scene
  await page.waitForSelector('.shattered-cup-scene, .phase-container', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));

  const shotPhase3 = path.join(ARTIFACT_DIR, 'screen_6_phase3_results.png');
  await page.screenshot({ path: shotPhase3, fullPage: false });
  console.log(`✅ Saved Phase 3 Screen: ${shotPhase3}`);

  console.log('🎉 All test phases completed successfully!');
  await browser.close();
}

runTestAndCapture().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
