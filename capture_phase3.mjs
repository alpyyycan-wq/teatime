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

  // 3. Start Game
  await page.click('#btnStartGame');
  await page.waitForSelector('.player-target-grid-3col', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 600));

  // 4. Phase 1 Submit
  await page.click('#btnSubmitPhase1');
  await page.waitForSelector('.action-deck-section', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 800));

  // 5. Phase 2: Select Drink and Confirm
  await page.click('#btnVerdictDrink');
  await new Promise(r => setTimeout(r, 400));
  await page.click('#btnConfirmVerdict');

  // Wait for Phase 3 Results or Poison Cinematic
  console.log("Waiting for Phase 3...");
  await page.waitForSelector('.filigree-frame, .poisoned-cinematic-screen, #btnNextRound', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1200));

  // If poison cinematic modal is shown, capture it and dismiss it
  const poisonCinematic = await page.$('.poisoned-cinematic-screen');
  if (poisonCinematic) {
    const poisonShot = path.join(ARTIFACT_DIR, 'screen_5_poison_reveal.png');
    await page.screenshot({ path: poisonShot, fullPage: false });
    console.log(`Saved Poison Reveal Cinematic: ${poisonShot}`);

    const btnSummary = await page.$('#btnPoisonSummary, #btnPoisonContinue');
    if (btnSummary) {
      await btnSummary.click();
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // Capture Phase 3 Results
  const shotResults = path.join(ARTIFACT_DIR, 'screen_6_phase3_results.png');
  await page.screenshot({ path: shotResults, fullPage: false });
  console.log(`Saved Phase 3 Results: ${shotResults}`);

  await browser.close();
}

run().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
