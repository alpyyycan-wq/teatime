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
  // Standard modern mobile viewport (iPhone 14/15 size)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  console.log("Navigating to http://localhost:3000 ...");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Clear storage
  await page.evaluate(() => {
    localStorage.clear();
    window.location.hash = '';
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // 1. Create Room as 'Eva'
  console.log("Entering name and creating room...");
  await page.type('#hostName', 'Eva');
  await page.click('#btnCreate');
  await page.waitForSelector('#btnAddBot', { timeout: 10000 });

  // 2. Add 3 Bots
  console.log("Adding 3 bots...");
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 600));
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 600));
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 1000));

  // Capture Lobby
  const lobbyShot = path.join(ARTIFACT_DIR, 'screen_2_lobby.png');
  await page.screenshot({ path: lobbyShot, fullPage: false });
  console.log(`Saved Lobby screenshot: ${lobbyShot}`);

  // 3. Start Game
  console.log("Starting game...");
  await page.click('#btnStartGame');
  await page.waitForSelector('.player-target-grid-3col', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1200));

  // Capture Phase 1 Default (Sweet)
  const phase1SweetShot = path.join(ARTIFACT_DIR, 'screen_3_phase1_sweet.png');
  await page.screenshot({ path: phase1SweetShot, fullPage: false });
  console.log(`Saved Phase 1 Sweet screenshot: ${phase1SweetShot}`);

  // Click second target card
  const cards = await page.$$('.player-target-card-3col');
  if (cards.length > 1) {
    await cards[1].click();
    await new Promise(r => setTimeout(r, 400));
  }

  // Click Cyanide button
  const btnCyanide = await page.$('#btnDropCyanide');
  if (btnCyanide) {
    await btnCyanide.click();
    await new Promise(r => setTimeout(r, 600));
    const phase1PoisonShot = path.join(ARTIFACT_DIR, 'screen_3_phase1_cyanide.png');
    await page.screenshot({ path: phase1PoisonShot, fullPage: false });
    console.log(`Saved Phase 1 Cyanide screenshot: ${phase1PoisonShot}`);
  }

  // Also update screen_3_phase1.png to point to phase1SweetShot for default
  const defaultShot = path.join(ARTIFACT_DIR, 'screen_3_phase1.png');
  await page.click('#btnDropSweet');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: defaultShot, fullPage: false });

  await browser.close();
  console.log("All screenshots captured successfully.");
}

run().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
