import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { DB } from './src/firebaseConfig.js';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const LIVE_URL = 'https://teatime-7dc11.web.app';
const ARTIFACT_LOCAL_DIR = '/Users/evaceylan/.gemini/antigravity/brain/d1303e47-3822-4da1-9ff3-390e3ae8643d';
const ARTIFACT_PARENT_DIR = '/Users/evaceylan/.gemini/antigravity/brain/6f6f72bd-feaa-4b1e-9d99-bbfe76674441';

async function testSpectatorScreen() {
  console.log('👻 [SPECTATOR TEST] Starting Live Spectator Verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  await page.goto(LIVE_URL, { waitUntil: 'networkidle0' });
  await page.waitForSelector('#hostName', { timeout: 15000 });

  await page.$eval('#hostName', el => {
    el.removeAttribute('maxlength');
    el.value = 'Dedektif_Poyraz';
  });
  await page.click('#btnCreate');
  await page.waitForSelector('#btnAddBot', { timeout: 15000 });

  // Get Room Code
  const roomCode = await page.$eval('h2[style*="letter-spacing:6px"]', el => el.innerText.trim());
  console.log(`   Room Code created: ${roomCode}`);

  // Add 3 Bots
  for (let i = 1; i <= 3; i++) {
    await page.click('#btnAddBot');
    await new Promise(r => setTimeout(r, 500));
  }

  await page.click('#btnStartGame');
  await page.waitForSelector('#btnSubmitPhase1', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));

  // Find host player id in firebase
  const roomData = await DB.get(`rooms/${roomCode}`);
  const hostPlayerId = Object.keys(roomData.players).find(id => roomData.players[id].isHost);
  console.log(`   Host Player ID: ${hostPlayerId}`);

  // Remove host's pill in Firebase so cyanide kills host instantly
  await DB.update(`rooms/${roomCode}/players/${hostPlayerId}`, { pill: 0 });

  // Phase 1: Submit sweet sugar to bot
  const targetCards = await page.$$('.player-target-card-3col');
  if (targetCards.length > 0) {
    await targetCards[0].click();
  }
  await page.click('#btnSubmitPhase1');

  // Wait for Phase 2
  await page.waitForSelector('#btnVerdictDrink', { timeout: 25000 });
  await new Promise(r => setTimeout(r, 1000));

  // Inject cyanide into host's cup in Firebase to guarantee poison death upon DRINK
  await DB.update(`rooms/${roomCode}/players/${hostPlayerId}/roundSugars`, {
    sweet: 0,
    cyanide: 1,
    total: 1,
    cyanideSources: [{ id: 'bot_test', name: 'Bot Moriarty' }]
  });

  console.log('   Injected 1 cyanide & removed pill from host cup.');
  console.log('   Poyraz choosing DRINK to trigger elimination...');
  await page.evaluate(() => document.getElementById('btnVerdictDrink')?.click());
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => document.getElementById('btnConfirmVerdict')?.click());

  // Wait for Poison Cinematic Screen
  console.log('   Waiting for Poison Screen / Phase 3...');
  await page.waitForSelector('.poisoned-cinematic-screen', { timeout: 25000 });
  console.log('   ☠️ Poison cinematic appeared as expected for victim!');

  const poisonShot = path.join(ARTIFACT_LOCAL_DIR, 'qa_spectator_1_poison_reveal.png');
  await page.screenshot({ path: poisonShot });
  if (fs.existsSync(ARTIFACT_PARENT_DIR)) {
    try { fs.copyFileSync(poisonShot, path.join(ARTIFACT_PARENT_DIR, 'qa_spectator_1_poison_reveal.png')); } catch (e) {}
  }

  // Dismiss cinematic
  await page.evaluate(() => {
    document.getElementById('btnPoisonSummary')?.click() || document.getElementById('btnPoisonContinue')?.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Verify Phase 3 Death Card
  const deathCardText = await page.$eval('.death-card', el => el.innerText.replace(/\s+/g, ' ').trim());
  console.log(`   Death Card displayed: "${deathCardText}"`);

  const p3DeathShot = path.join(ARTIFACT_LOCAL_DIR, 'qa_spectator_2_death_phase3.png');
  await page.screenshot({ path: p3DeathShot });
  if (fs.existsSync(ARTIFACT_PARENT_DIR)) {
    try { fs.copyFileSync(p3DeathShot, path.join(ARTIFACT_PARENT_DIR, 'qa_spectator_2_death_phase3.png')); } catch (e) {}
  }

  // Advance to Next Round to enter Spectator Mode
  console.log('   Clicking Next Round to transition to Spectator Screen (Round 2 Phase 1)...');
  await page.evaluate(() => document.getElementById('btnNextRound')?.click() || document.getElementById('btnSpectatorNextRound')?.click());
  await new Promise(r => setTimeout(r, 2000));

  // Verify Spectator Screen is active
  await page.waitForFunction(() => {
    return document.querySelector('.card h2')?.innerText.includes('ÖLÜLER MASASI') ||
           document.querySelector('.room-badge')?.innerText.includes('İZLEYİCİ');
  }, { timeout: 20000 });

  const spectatorData = await page.evaluate(() => {
    const badge = document.querySelector('.room-badge')?.innerText.trim() || '';
    const title = document.querySelector('.card h2')?.innerText.trim() || '';
    const subtitle = document.querySelector('.card p')?.innerText.trim() || '';
    const secretsCard = Array.from(document.querySelectorAll('.card')).find(c => c.innerText.includes('MASA SIRLARI') || c.innerText.includes('CANLI'));
    const secretsText = secretsCard ? secretsCard.innerText.replace(/\s+/g, ' ').trim() : '';
    const hasNextBtn = !!document.getElementById('btnSpectatorNextRound');
    const hasForceBtn = !!document.getElementById('btnSpectatorForcePhase3');
    const hasLeaveBtn = !!document.getElementById('btnLeaveSpectator');

    return { badge, title, subtitle, secretsText, hasNextBtn, hasForceBtn, hasLeaveBtn };
  });

  console.log('\n👻 [SPECTATOR SCREEN VERIFIED]');
  console.log(`   Badge: ${spectatorData.badge}`);
  console.log(`   Title: ${spectatorData.title}`);
  console.log(`   Subtitle: ${spectatorData.subtitle}`);
  console.log(`   Live Secrets: ${spectatorData.secretsText}`);
  console.log(`   Buttons: ForceBtn=${spectatorData.hasForceBtn}, LeaveBtn=${spectatorData.hasLeaveBtn}`);

  const spectatorShot = path.join(ARTIFACT_LOCAL_DIR, 'qa_spectator_3_active_screen.png');
  await page.screenshot({ path: spectatorShot });
  if (fs.existsSync(ARTIFACT_PARENT_DIR)) {
    try { fs.copyFileSync(spectatorShot, path.join(ARTIFACT_PARENT_DIR, 'qa_spectator_3_active_screen.png')); } catch (e) {}
  }

  await browser.close();
  console.log('✅ Spectator Test finished with 100% success!\n');
}

testSpectatorScreen().catch(err => {
  console.error('Spectator Test Error:', err);
  process.exit(1);
});
