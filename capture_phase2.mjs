import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACT_DIR = '/Users/evaceylan/.gemini/antigravity/brain/6f6f72bd-feaa-4b1e-9d99-bbfe76674441';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Clear storage
  await page.evaluate(() => {
    localStorage.clear();
    window.location.hash = '';
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // 1. Create Room as 'Eva'
  await page.type('#hostName', 'Eva');
  await page.click('#btnCreate');
  await page.waitForSelector('#btnAddBot', { timeout: 10000 });

  // 2. Add 3 Bots
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 500));
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 500));
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 800));

  // 3. Start Game (Phase 1)
  await page.click('#btnStartGame');
  await page.waitForSelector('.player-target-grid-3col', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 800));

  // 4. Submit Phase 1 to advance to Phase 2
  await page.click('#btnSubmitPhase1');
  await page.waitForSelector('.action-deck-section', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1200));

  // Capture Phase 2 (Initial)
  const shotInit = path.join(ARTIFACT_DIR, 'screen_4_phase2_initial.png');
  await page.screenshot({ path: shotInit, fullPage: false });
  console.log(`Saved Phase 2 Initial: ${shotInit}`);

  // Select Drink
  await page.click('#btnVerdictDrink');
  await new Promise(r => setTimeout(r, 400));
  const shotDrink = path.join(ARTIFACT_DIR, 'screen_4_phase2_drink.png');
  await page.screenshot({ path: shotDrink, fullPage: false });
  console.log(`Saved Phase 2 Drink: ${shotDrink}`);

  // Select Dump
  await page.click('#btnVerdictDump');
  await new Promise(r => setTimeout(r, 400));
  const shotDump = path.join(ARTIFACT_DIR, 'screen_4_phase2_dump.png');
  await page.screenshot({ path: shotDump, fullPage: false });
  console.log(`Saved Phase 2 Dump: ${shotDump}`);

  // Select Swap
  const btnSwap = await page.$('#btnVerdictSwap');
  if (btnSwap) {
    await btnSwap.click();
    await new Promise(r => setTimeout(r, 400));
    const shotSwap = path.join(ARTIFACT_DIR, 'screen_4_phase2_swap.png');
    await page.screenshot({ path: shotSwap, fullPage: false });
    console.log(`Saved Phase 2 Swap: ${shotSwap}`);
  }

  await browser.close();
}

run().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
