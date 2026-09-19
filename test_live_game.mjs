import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACT_DIR = '/Users/evaceylan/.gemini/antigravity/brain/6f6f72bd-feaa-4b1e-9d99-bbfe76674441';
const LIVE_URL = 'https://teatime-7dc11.web.app';

async function runLiveGameTest() {
  console.log('🚀 [QA Lead Burak] Launching headless browser to test LIVE URL:', LIVE_URL);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  // Listen to console logs from the page
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warn') {
      console.log(`[Browser ${msg.type()}]:`, msg.text());
    }
  });

  console.log('1. Navigating to LIVE production site...');
  await page.goto(LIVE_URL, { waitUntil: 'networkidle0' });

  // Create room as 'Poyraz'
  console.log('2. Entering host name "Poyraz" and creating room...');
  await page.waitForSelector('#hostName', { timeout: 10000 });
  await page.type('#hostName', 'Poyraz');
  await page.click('#btnCreate');
  await page.waitForSelector('#btnAddBot', { timeout: 15000 });

  // Add 5 Bots!
  console.log('3. Adding 5 Bots to test live multi-bot environment...');
  for (let i = 1; i <= 5; i++) {
    await page.click('#btnAddBot');
    console.log(`   + Added Bot ${i}`);
    await new Promise(r => setTimeout(r, 700));
  }

  // Capture Lobby
  const lobbyShot = path.join(ARTIFACT_DIR, 'live_1_lobby_5bots.png');
  await page.screenshot({ path: lobbyShot, fullPage: false });
  console.log('   📸 Saved Lobby Screenshot:', lobbyShot);

  // Start the Game!
  console.log('4. Starting the game...');
  await page.click('#btnStartGame');

  // Wait for Phase 1
  console.log('5. Waiting for Phase 1 to render on LIVE site...');
  await page.waitForSelector('#btnSubmitPhase1', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1200));

  const p1Shot = path.join(ARTIFACT_DIR, 'live_2_phase1_cards.png');
  await page.screenshot({ path: p1Shot, fullPage: false });
  console.log('   📸 Saved Phase 1 Screenshot:', p1Shot);

  // Choose to sweeten the tea of opponent 1
  console.log('6. Selecting drop sugar action and confirming Phase 1...');
  const targetCards = await page.$$('.player-target-card-3col');
  if (targetCards.length > 0) {
    await targetCards[0].click();
    await new Promise(r => setTimeout(r, 500));
  }
  await page.click('#btnSubmitPhase1');

  // Wait for Phase 2 (Bots drop their sugars automatically)
  console.log('7. Waiting for Phase 2 (Waiting for bots to make moves)...');
  await page.waitForSelector('#btnVerdictDump', { timeout: 20000 });
  await new Promise(r => setTimeout(r, 1500));

  const p2InitialShot = path.join(ARTIFACT_DIR, 'live_3_phase2_initial.png');
  await page.screenshot({ path: p2InitialShot, fullPage: false });
  console.log('   📸 Saved Phase 2 Initial Screenshot:', p2InitialShot);

  // TEST CRITICAL REQUIREMENT: CHOOSE 'DUMP' (ÇAYI DÖK)
  console.log('8. 🚨 TESTING CRITICAL BUG FIX: Clicking #btnVerdictDump (ÇAYI DÖK)...');
  await page.click('#btnVerdictDump');
  await new Promise(r => setTimeout(r, 600));

  // Check confirm button text
  const confirmBtnText = await page.$eval('#btnConfirmVerdict', el => el.textContent.trim());
  console.log(`   Confirm button text is: "${confirmBtnText}"`);

  const p2DumpSelectedShot = path.join(ARTIFACT_DIR, 'live_4_phase2_dump_selected.png');
  await page.screenshot({ path: p2DumpSelectedShot, fullPage: false });
  console.log('   📸 Saved Phase 2 Dump Selected Screenshot:', p2DumpSelectedShot);

  // Confirm Verdict DUMP
  console.log('9. Confirming DUMP verdict...');
  await page.click('#btnConfirmVerdict');

  // Wait for Phase 3 (Round Resolution)
  console.log('10. Waiting for Phase 3 resolution on LIVE Firebase...');
  await page.waitForFunction(() => {
    return document.querySelector('.banner-relief') || 
           document.querySelector('.banner-regret') || 
           document.querySelector('.poisoned-cinematic-screen') ||
           document.querySelector('.card h2');
  }, { timeout: 25000 });
  await new Promise(r => setTimeout(r, 1500));

  const p3Shot = path.join(ARTIFACT_DIR, 'live_5_phase3_results.png');
  await page.screenshot({ path: p3Shot, fullPage: false });
  console.log('   📸 Saved Phase 3 Results Screenshot:', p3Shot);

  // VERIFICATION: Check what is rendered!
  const hasPoisonHijack = await page.$('.poisoned-cinematic-screen');
  const reliefBanner = await page.$('.banner-relief');
  const regretBanner = await page.$('.banner-regret');

  console.log('\n================ QA VERIFICATION REPORT ================');
  if (hasPoisonHijack) {
    const bannerText = await page.$eval('.banner-text-poisoned', el => el.textContent.trim());
    console.error('❌ FAILURE: Screen was hijacked by poison cinematic! Text:', bannerText);
  } else if (reliefBanner) {
    const text = await page.$eval('.banner-relief', el => el.textContent.trim().replace(/\s+/g, ' '));
    console.log('✅ SUCCESS: Player dumped tea and saw RELIEF banner without hijack!');
    console.log('   Banner content:', text);
  } else if (regretBanner) {
    const text = await page.$eval('.banner-regret', el => el.textContent.trim().replace(/\s+/g, ' '));
    console.log('✅ SUCCESS: Player dumped tea and saw REGRET banner (tea was clean) without hijack!');
    console.log('   Banner content:', text);
  } else {
    console.log('ℹ️ Rendered content check needed, see screenshot:', p3Shot);
  }

  // Check if player is alive
  const deadBadge = await page.$('.death-card');
  if (deadBadge) {
    console.error('❌ FAILURE: Player is marked dead after dumping tea!');
  } else {
    console.log('✅ SUCCESS: Player is ALIVE! No poison death occurred when dumping tea.');
  }
  console.log('========================================================\n');

  await browser.close();
}

runLiveGameTest().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
