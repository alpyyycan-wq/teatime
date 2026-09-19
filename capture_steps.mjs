import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACT_DIR = '/Users/evaceylan/.gemini/antigravity/brain/6f6f72bd-feaa-4b1e-9d99-bbfe76674441';

async function runTestAndCapture() {
  console.log("Launching headless Chrome...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 414, height: 896, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  console.log("Navigating to local Vite app http://localhost:3000 ...");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // 1. Create Room as 'Arthur'
  console.log("Entering name and creating room...");
  await page.type('#hostName', 'Arthur');
  await page.click('#btnCreate');
  await page.waitForSelector('#btnAddBot', { timeout: 10000 });

  // 2. Add 3 Bots
  console.log("Adding 3 bots...");
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 800));
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 800));
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot 1: Lobby
  const shot1 = path.join(ARTIFACT_DIR, 'screenshot_1_lobby.png');
  await page.screenshot({ path: shot1, fullPage: false });
  console.log(`Saved: ${shot1}`);

  // 3. Start Game
  console.log("Starting game...");
  await page.click('#btnStartGame');
  await page.waitForSelector('.player-select-grid', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1000));

  // Screenshot 2: Phase 1 (Sweet Sugar - Player Target Cards)
  const shot2 = path.join(ARTIFACT_DIR, 'screenshot_2_phase1_sweet.png');
  await page.screenshot({ path: shot2, fullPage: false });
  console.log(`Saved: ${shot2}`);

  // Click Cyanide to see Cyanide Cards
  console.log("Testing Cyanide mode target cards...");
  await page.click('#btnDropCyanide');
  await new Promise(r => setTimeout(r, 800));
  const shot2b = path.join(ARTIFACT_DIR, 'screenshot_2_phase1_cyanide.png');
  await page.screenshot({ path: shot2b, fullPage: false });
  console.log(`Saved: ${shot2b}`);

  // Switch back to sweet sugar and select self
  await page.click('#btnDropSweet');
  await new Promise(r => setTimeout(r, 500));

  // Submit drop action
  console.log("Submitting drop action...");
  await page.click('#btnSubmitPhase1');

  // Wait for transition to Phase 2
  console.log("Waiting for Phase 2 (Table Cups Reveal)...");
  await page.waitForSelector('.table-cups-grid', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500));

  // Screenshot 3: Phase 2 (Table Cups & Verdict)
  const shot3 = path.join(ARTIFACT_DIR, 'screenshot_3_phase2_cups.png');
  await page.screenshot({ path: shot3, fullPage: false });
  console.log(`Saved: ${shot3}`);

  // Test selecting DUMP to verify relief/regret banner
  console.log("Selecting [ ÇAYI DÖKÜYORUM ] to test dump feedback...");
  await page.click('#btnVerdictDump');
  await new Promise(r => setTimeout(r, 500));
  await page.click('#btnConfirmVerdict');

  // Wait for transition to Phase 3
  console.log("Waiting for Phase 3 (Results)...");
  await page.waitForSelector('#btnNextRound, .banner-relief, .banner-regret', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  // Screenshot 4: Phase 3 (Results & Leaderboard)
  const shot4 = path.join(ARTIFACT_DIR, 'screenshot_4_phase3_results.png');
  await page.screenshot({ path: shot4, fullPage: false });
  console.log(`Saved: ${shot4}`);

  // 4. Start Round 2 and test Assassin Kill Bounty!
  console.log("Starting Round 2 to test Assassin Kill Bounty...");
  await page.click('#btnNextRound');
  await page.waitForSelector('.player-select-grid', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1000));

  // Arthur selects Cyanide and drops it into first opponent
  await page.click('#btnDropCyanide');
  await new Promise(r => setTimeout(r, 500));
  
  // Get room code and ensure the target bot has pill: 0 so they get eliminated
  const roomCode = await page.evaluate(() => localStorage.getItem('cot_room_code'));
  const myId = await page.evaluate(() => localStorage.getItem('cot_player_id'));

  // Target the first alive bot
  const targetCard = await page.$('.player-target-card');
  const targetBotId = await page.evaluate(el => el.getAttribute('data-target-id'), targetCard);
  console.log(`Targeting bot ${targetBotId} with cyanide...`);
  await targetCard.click();
  await new Promise(r => setTimeout(r, 400));
  await page.click('#btnSubmitPhase1');

  // Wait for Phase 2
  await page.waitForSelector('.table-cups-grid', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));

  // Arthur dumps tea safely
  await page.click('#btnVerdictDump');
  await new Promise(r => setTimeout(r, 400));
  await page.click('#btnConfirmVerdict');

  // Wait for Phase 3
  await page.waitForSelector('#btnNextRound', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  // Screenshot 5: Kill Bounty Banner or Round 2 Results
  const shot5 = path.join(ARTIFACT_DIR, 'screenshot_5_kill_bounty.png');
  await page.screenshot({ path: shot5, fullPage: false });
  console.log(`Saved: ${shot5}`);

  console.log("All screenshots captured successfully!");
  await browser.close();
}

runTestAndCapture().catch(err => {
  console.error("Test capture failed:", err);
  process.exit(1);
});
