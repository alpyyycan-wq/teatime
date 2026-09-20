import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT_DIR = '/Users/evaceylan/.gemini/antigravity/brain/6f6f72bd-feaa-4b1e-9d99-bbfe76674441';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 }); // Mobile portrait

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // 1. Home Screen
  await page.screenshot({ path: path.join(OUT_DIR, 'screen_1_home_topnotch.png') });
  console.log('Captured screen_1_home_topnotch.png');

  // Create room
  await page.type('#hostName', 'Lord Byron');
  await page.click('#btnCreate');
  await page.waitForSelector('#btnStartGame', { timeout: 8000 });

  // 2. Lobby Screen
  await page.screenshot({ path: path.join(OUT_DIR, 'screen_2_lobby_topnotch.png') });
  console.log('Captured screen_2_lobby_topnotch.png');

  // Fill table with bots so game can start
  await page.click('#btnAddQuick7');
  await new Promise(r => setTimeout(r, 2000));

  // Start game
  await page.click('#btnStartGame');
  await new Promise(r => setTimeout(r, 1500));

  // 3. Phase 1 (Infusion)
  await page.screenshot({ path: path.join(OUT_DIR, 'screen_3_phase1_topnotch.png') });
  console.log('Captured screen_3_phase1_topnotch.png');

  // Submit drop action
  const confirmDrop = await page.$('#btnDropConfirm');
  if (confirmDrop) {
    await confirmDrop.click();
    await new Promise(r => setTimeout(r, 1200));
  }

  // Host advance to Phase 2
  const hostAdvance = await page.$('#btnHostAdvancePhase1');
  if (hostAdvance) {
    await hostAdvance.click();
    await new Promise(r => setTimeout(r, 2000));
  }

  // 4. Phase 2 (The Verdict / Decision)
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(OUT_DIR, 'screen_4_phase2_topnotch.png') });
  console.log('Captured screen_4_phase2_topnotch.png');

  // Select DUMP action to show active state
  const btnDump = await page.$('#btnVerdictDump');
  if (btnDump) {
    await btnDump.click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(OUT_DIR, 'screen_4_phase2_dump_selected.png') });
    console.log('Captured screen_4_phase2_dump_selected.png');
  }

  // Confirm player verdict
  const btnConfirm = await page.$('#btnConfirmVerdict');
  if (btnConfirm) {
    await btnConfirm.click();
    await new Promise(r => setTimeout(r, 800));
  }

  // Host advance to Phase 3 (Sonuç Fazı)
  const btnHostReveal = await page.$('#btnHostRevealPhase3');
  if (btnHostReveal) {
    await btnHostReveal.click();
    await new Promise(r => setTimeout(r, 1500));
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 300));

  // Verify intermediate skull popup does NOT exist
  const skullPopup = await page.$('.poison-reveal-card, #poisonRevealScreen');
  console.log('Intermediate Skull Popup Exists?', !!skullPopup ? '❌ YES (ERROR)' : '✅ NO (Correctly unified!)');

  // 5. Phase 3 (Unified Result Screen)
  await page.screenshot({ path: path.join(OUT_DIR, 'screen_5_phase3_unified.png') });
  console.log('Captured screen_5_phase3_unified.png');

  await browser.close();
  console.log('✅ Capture complete!');
}

main().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
