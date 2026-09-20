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

  page.on('console', msg => console.log('[Browser Console]', msg.text()));
  page.on('pageerror', err => console.error('[Browser Error]', err));

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
  await page.evaluate(() => {
    const btn = document.getElementById('btnDropConfirm');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Host advance to Phase 2 if not auto-advanced
  await page.evaluate(() => {
    const btn = document.getElementById('btnHostAdvancePhase1');
    if (btn) btn.click();
  });

  // Wait for Phase 2
  await page.waitForSelector('#btnVerdictDump, .decision-card', { timeout: 8000 });
  await new Promise(r => setTimeout(r, 800));

  // 4. Phase 2 (The Verdict / Decision)
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(OUT_DIR, 'screen_4_phase2_topnotch.png') });
  console.log('Captured screen_4_phase2_topnotch.png');

  // Select DUMP action to show active state
  await page.evaluate(() => {
    const btn = document.getElementById('btnVerdictDump');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT_DIR, 'screen_4_phase2_dump_selected.png') });
  console.log('Captured screen_4_phase2_dump_selected.png');

  // Confirm player verdict
  await page.evaluate(() => {
    const btn = document.getElementById('btnConfirmVerdict');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Wait a moment for bots to finish their Phase 2 decisions
  await new Promise(r => setTimeout(r, 2000));

  // Host advance to Phase 3 (Sonuç Fazı)
  await page.evaluate(() => {
    const btn = document.getElementById('btnHostRevealPhase3');
    if (btn) btn.click();
  });

  // Wait for Phase 3 recap panel
  await page.waitForSelector('.recap-table-panel', { timeout: 8000 });
  console.log('✅ Found .recap-table-panel!');

  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));

  // Verify intermediate skull popup does NOT exist
  const skullPopup = await page.$('.poison-reveal-card, #poisonRevealScreen');
  console.log('Intermediate Skull Popup Exists?', !!skullPopup ? '❌ YES (ERROR)' : '✅ NO (Correctly unified!)');

  // 5. Phase 3 (Unified Result Screen - captured as fullPage to see the whole table)
  await page.screenshot({ path: path.join(OUT_DIR, 'screen_5_phase3_unified.png'), fullPage: false });
  console.log('Captured screen_5_phase3_unified.png (viewport)');

  await page.screenshot({ path: path.join(OUT_DIR, 'screen_5_phase3_fullpage.png'), fullPage: true });
  console.log('Captured screen_5_phase3_fullpage.png (full page)');

  await browser.close();
  console.log('✅ All captures complete!');
}

main().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
