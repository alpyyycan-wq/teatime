import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACT_DIR = '/Users/evaceylan/.gemini/antigravity/brain/6f6f72bd-feaa-4b1e-9d99-bbfe76674441';

async function testPixelArtUI() {
  console.log("Launching headless Chrome...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  // iPhone 12 / Modern mobile aspect ratio
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  console.log("Navigating to http://localhost:3000 ...");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // 1. Create Room as 'Arthur'
  console.log("1. Creating room in Lobby...");
  await page.type('#hostName', 'Arthur');
  await page.click('#btnCreate');
  await page.waitForSelector('#btnAddBot', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 600));

  // 2. Add 2 Bots (Watson & Moriarty)
  console.log("2. Adding 2 bots...");
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 600));
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 800));

  // Screenshot Lobby
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'pixel_1_lobby.png') });
  console.log("Saved pixel_1_lobby.png");

  // 3. Start Game
  console.log("3. Starting game (Phase 1)...");
  await page.click('#btnStartGame');
  await page.waitForSelector('.player-select-grid', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 800));

  // Screenshot Phase 1
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'pixel_2_phase1.png') });
  console.log("Saved pixel_2_phase1.png");

  // Submit Phase 1 action
  const oppCards = await page.$$('.player-target-card');
  if (oppCards.length > 0) {
    await oppCards[0].click();
  }
  await new Promise(r => setTimeout(r, 400));
  await page.click('#btnSubmitPhase1');

  // 4. Wait for Phase 2 (Table Board Scene!)
  console.log("4. Waiting for Phase 2...");
  await page.waitForSelector('.table-scene-container', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot Phase 2 (Matching reference!)
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'pixel_3_phase2_decision.png') });
  console.log("Saved pixel_3_phase2_decision.png");

  // Test selecting Drink
  await page.click('#btnVerdictDrink');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'pixel_4_phase2_drink_selected.png') });
  console.log("Saved pixel_4_phase2_drink_selected.png");

  // Confirm Verdict
  await page.click('#btnConfirmVerdict');

  // 5. Wait for Phase 3 (Results)
  console.log("5. Waiting for Phase 3 results...");
  await page.waitForSelector('.card', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'pixel_5_phase3_results.png') });
  console.log("Saved pixel_5_phase3_results.png");

  console.log("All UI tests passed successfully!");
  await browser.close();
}

testPixelArtUI().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
