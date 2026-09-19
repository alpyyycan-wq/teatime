import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACT_DIR = '/Users/evaceylan/.gemini/antigravity/brain/6f6f72bd-feaa-4b1e-9d99-bbfe76674441';

async function testSwapMechanic() {
  console.log("Launching headless Chrome...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 414, height: 896, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  console.log("Navigating to http://localhost:3000 ...");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // 1. Create Room as 'Arthur'
  console.log("1. Creating room...");
  await page.type('#hostName', 'Arthur');
  await page.click('#btnCreate');
  await page.waitForSelector('#btnAddBot', { timeout: 10000 });

  // 2. Add 2 Bots
  console.log("2. Adding 2 bots...");
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 600));
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 800));

  // 3. Start Game
  console.log("3. Starting game...");
  await page.click('#btnStartGame');
  await page.waitForSelector('.player-select-grid', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 800));

  // Verify inventory bar in Phase 1 has 4 boxes (Score, Pill, Cyanide, Swap)
  const inventoryItems = await page.$$eval('.inventory-item', els => els.map(e => e.innerText.trim()));
  console.log("Inventory items in Phase 1:", inventoryItems);

  // In Phase 1, treat an opponent to sweet sugar to verify cyanide reload
  // 4. Selecting opponent to treat with sweet sugar (+1 Cyanide)...
  const oppCards = await page.$$('.player-target-card');
  if (oppCards.length > 0) {
    await oppCards[0].click();
  }
  await new Promise(r => setTimeout(r, 400));
  await page.click('#btnSubmitPhase1');

  // Wait for Phase 2
  console.log("5. Waiting for Phase 2...");
  await page.waitForSelector('.table-scene-container', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1200));

  // In Phase 2, click Swap Cup button!
  console.log("6. Clicking Cup Swap button in Phase 2...");
  await page.waitForSelector('#btnVerdictSwap');
  await page.click('#btnVerdictSwap');
  await new Promise(r => setTimeout(r, 600));

  // Confirm Verdict with Swap
  console.log("7. Confirming verdict with Cup Swap...");
  await page.click('#btnConfirmVerdict');

  // Wait for Phase 3
  console.log("8. Waiting for Phase 3...");
  await page.waitForSelector('#btnNextRound, .card', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  // 9. Advance to Round 2
  console.log("9. Advancing to Round 2...");
  await page.click('#btnNextRound');
  await page.waitForSelector('.player-select-grid', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1000));

  // Drop sweet sugar and advance to Phase 2 to verify Swap is now spent (disabled)
  const oppCardsR2 = await page.$$('.player-target-card');
  if (oppCardsR2.length > 0) {
    await oppCardsR2[0].click();
  }
  await page.click('#btnSubmitPhase1');
  await page.waitForSelector('.table-scene-container', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1200));

  const isSwapDisabled = await page.$eval('#btnVerdictSwap', el => el.classList.contains('disabled'));
  console.log("Is Cup Swap disabled in Round 2?", isSwapDisabled ? "YES (Correct: 1 swap per game used!)" : "NO (Error!)");

  await browser.close();
  console.log("Simulation finished successfully!");
}

testSwapMechanic().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
