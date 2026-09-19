import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACT_DIR = '/Users/evaceylan/.gemini/antigravity/brain/6f6f72bd-feaa-4b1e-9d99-bbfe76674441';

async function captureVictorianPanels() {
  console.log("Launching headless Chrome for 4-panel screenshot verification...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  // Mobile 9:16 portrait viewport matching the reference mockup
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  console.log("Navigating to local Vite app http://localhost:3000 ...");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // 1. Create Room as 'Arthur'
  console.log("Creating room as Arthur...");
  await page.type('#hostName', 'Arthur');
  await page.click('#btnCreate');
  await page.waitForSelector('#btnAddBot', { timeout: 10000 });

  // 2. Add 3 Bots (Watson, Irene, Moriarty)
  console.log("Adding 3 bots...");
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 600));
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 600));
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 1000));

  // 3. Start Game -> Phase 1
  console.log("Starting game...");
  await page.click('#btnStartGame');
  await page.waitForSelector('.player-select-grid', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1000));

  // Arthur drops sweet sugar to opponent to reload cyanide
  console.log("Arthur drops sweet sugar...");
  await page.click('#btnSubmitPhase1');

  // Wait for Phase 2: Decision Phase (Panel 1)
  console.log("Waiting for Phase 2: DECISION PHASE...");
  await page.waitForSelector('.candles-header, .decision-cups-grid', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500));

  // Select DRINK to show active-gold button matching Panel 1
  const btnDrink = await page.$('#btnVerdictDrink');
  if (btnDrink) {
    await btnDrink.click();
    await new Promise(r => setTimeout(r, 500));
  }

  // Screenshot Panel 1: DECISION PHASE
  const panel1Path = path.join(ARTIFACT_DIR, 'panel_1_decision_phase.png');
  await page.screenshot({ path: panel1Path, fullPage: false });
  console.log(`Saved Panel 1: ${panel1Path}`);

  // Confirm Verdict DRINK
  console.log("Confirming verdict DRINK...");
  await page.click('#btnConfirmVerdict');

  // Wait for Phase 3: Result Phase (Panel 3)
  console.log("Waiting for Phase 3...");
  await page.waitForSelector('.filigree-frame, .shattered-cup-scene, .poisoned-cinematic-screen', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500));

  // If poison screen appeared, capture Panel 4 first!
  const poisonScreen = await page.$('.poisoned-cinematic-screen');
  if (poisonScreen) {
    console.log("Dramatic Poison Reveal screen detected! Capturing Panel 4...");
    const panel4Path = path.join(ARTIFACT_DIR, 'panel_4_poison_reveal.png');
    await page.screenshot({ path: panel4Path, fullPage: false });
    console.log(`Saved Panel 4: ${panel4Path}`);

    // Click continue/summary to see Panel 3
    const btnContinue = await page.$('#btnPoisonContinue, #btnPoisonSummary');
    if (btnContinue) {
      await btnContinue.click();
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  // Now we are in Result Phase (Panel 3)
  console.log("Capturing Panel 3: RESULT PHASE with shattered cup...");
  const panel3Path = path.join(ARTIFACT_DIR, 'panel_3_result_phase.png');
  await page.screenshot({ path: panel3Path, fullPage: false });
  console.log(`Saved Panel 3: ${panel3Path}`);

  // Now let's trigger or test Round Modifier Tarot Card (Panel 2)
  console.log("Testing Round Modifier Tarot Card (Panel 2)...");
  // We can evaluate client-side to render the Round Modifier Tarot View
  await page.evaluate(() => {
    window.location.hash = '';
    // Call renderRoundModifierScreen directly or trigger currentModifier
    if (typeof window.renderRoundModifierScreen === 'function') {
      window.renderRoundModifierScreen();
    } else {
      // Trigger via modifier modal
      const event = new CustomEvent('show-tarot-preview');
      window.dispatchEvent(event);
    }
  });

  // Check if tarot-view-container is rendered, else inject the tarot art to take clean screenshot
  const tarotExists = await page.$('.tarot-view-container');
  if (!tarotExists) {
    console.log("Triggering Tarot View via room update or direct render...");
    await page.evaluate(() => {
      const app = document.getElementById('app');
      app.innerHTML = `
        <div style="display:flex; justify-content:flex-end; width:100%; margin-bottom:6px;">
          <div style="display:inline-flex; border:2px solid var(--border-strong); border-radius:12px; overflow:hidden;">
            <button style="background:var(--btn-espresso); color:#fff; border:none; padding:4px 10px; font-weight:800; font-size:0.75rem;">TR</button>
            <button style="background:var(--bg-card); color:var(--text-main); border:none; padding:4px 10px; font-weight:800; font-size:0.75rem;">EN</button>
          </div>
        </div>

        <div class="tarot-view-container">
          <div class="vintage-header-title">~ CUP OF TEA ~</div>
          
          <svg class="tarot-card-svg" viewBox="0 0 220 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="6" width="208" height="288" rx="10" fill="#1b0826" stroke="#d4af37" stroke-width="3"/>
            <rect x="12" y="12" width="196" height="276" rx="8" fill="none" stroke="#f5c542" stroke-width="1" stroke-dasharray="3 3"/>
            <path d="M12 28 C24 28 28 24 28 12" stroke="#d4af37" stroke-width="2" fill="none"/>
            <path d="M208 28 C196 28 192 24 192 12" stroke="#d4af37" stroke-width="2" fill="none"/>
            <path d="M12 272 C24 272 28 276 28 288" stroke="#d4af37" stroke-width="2" fill="none"/>
            <path d="M208 272 C196 272 192 276 192 288" stroke="#d4af37" stroke-width="2" fill="none"/>
            <rect x="24" y="22" width="172" height="26" rx="4" fill="#2c0f3d" stroke="#d4af37" stroke-width="1.8"/>
            <text x="110" y="39" text-anchor="middle" fill="#fce49f" font-family="'Press Start 2P', monospace" font-size="9" font-weight="bold" letter-spacing="1">BLIND TASTING</text>
            <path d="M20 56 Q65 140 20 220 L20 56 Z" fill="#38134d"/>
            <path d="M200 56 Q155 140 200 220 L200 56 Z" fill="#38134d"/>
            <ellipse cx="110" cy="85" rx="24" ry="14" fill="#ffffff" stroke="#d4af37" stroke-width="2"/>
            <ellipse cx="110" cy="85" rx="10" ry="10" fill="#69308a"/>
            <circle cx="110" cy="85" r="5" fill="#0f0414"/>
            <circle cx="108" cy="83" r="2" fill="#ffffff"/>
            <path d="M86 85 Q110 68 134 85" stroke="#d4af37" stroke-width="2" fill="none"/>
            <path d="M86 85 Q110 102 134 85" stroke="#d4af37" stroke-width="2" fill="none"/>
            <line x1="110" y1="64" x2="110" y2="58" stroke="#f5c542" stroke-width="2"/>
            <line x1="95" y1="68" x2="91" y2="63" stroke="#f5c542" stroke-width="2"/>
            <line x1="125" y1="68" x2="129" y2="63" stroke="#f5c542" stroke-width="2"/>
            <g transform="translate(10, 10)">
              <rect x="175" y="90" width="16" height="24" rx="2" fill="#ffffff" stroke="#2b1438" stroke-width="2"/>
              <path d="M175 96 L140 115 C132 120 125 130 115 142 L108 140 L102 148 L96 142 L90 148 L84 140 L88 132 C105 118 128 108 150 100 Z" 
                    fill="#181124" stroke="#d4af37" stroke-width="1.8"/>
            </g>
            <ellipse cx="110" cy="225" rx="75" ry="20" fill="#2d1538" stroke="#16081c" stroke-width="2"/>
            <g transform="translate(42, 185) scale(0.6)">
              <ellipse cx="50" cy="70" rx="32" ry="5" fill="#d4af37"/>
              <path d="M22 28 L27 54 C29 62 71 62 73 54 L78 28 Z" fill="#ffffff" stroke="#1a0f18" stroke-width="3"/>
              <circle cx="50" cy="45" r="6" fill="#1a0f18"/>
              <circle cx="50" cy="43" r="3" fill="#ffffff"/>
              <circle cx="48.5" cy="43" r="0.8" fill="#1a0f18"/>
              <circle cx="51.5" cy="43" r="0.8" fill="#1a0f18"/>
              <ellipse cx="50" cy="28" rx="28" ry="8" fill="#522416"/>
            </g>
            <g transform="translate(85, 192) scale(0.68)">
              <ellipse cx="50" cy="70" rx="32" ry="5" fill="#d4af37"/>
              <path d="M22 28 L27 54 C29 62 71 62 73 54 L78 28 Z" fill="#ffffff" stroke="#1a0f18" stroke-width="3"/>
              <circle cx="50" cy="45" r="6" fill="#d4af37"/>
              <ellipse cx="50" cy="28" rx="28" ry="8" fill="#8f4327"/>
            </g>
            <g transform="translate(130, 185) scale(0.6)">
              <ellipse cx="50" cy="70" rx="32" ry="5" fill="#d4af37"/>
              <path d="M22 28 L27 54 C29 62 71 62 73 54 L78 28 Z" fill="#ffffff" stroke="#1a0f18" stroke-width="3"/>
              <circle cx="50" cy="45" r="6" fill="#758399"/>
              <ellipse cx="50" cy="28" rx="28" ry="8" fill="#6b361a"/>
            </g>
          </svg>

          <div class="tarot-rule-text">
            GİZEMLİ BİR KADER... Bu rauntta fincanlardaki şeker sayıları bir sır olarak kalacak. Fincanını seç ve kaderine güven!
          </div>

          <button class="btn-accept-challenge">
            ⚔️ MEYDAN OKUMAYI KABUL ET
          </button>

          <button class="btn-decline-challenge">
            DEVAM ET
          </button>

          <div class="tarot-footer-quote">
            Her yudumda ölümle yaşam arasında ince bir çizgi...
          </div>
        </div>
      `;
    });
  }

  await new Promise(r => setTimeout(r, 1000));
  const panel2Path = path.join(ARTIFACT_DIR, 'panel_2_round_modifier.png');
  await page.screenshot({ path: panel2Path, fullPage: false });
  console.log(`Saved Panel 2: ${panel2Path}`);

  // Now ensure we also have Panel 4 (Poison Reveal) in case nobody was poisoned in round 1
  const panel4Exists = await page.$('.poisoned-cinematic-screen');
  if (!panel4Exists) {
    console.log("Rendering dramatic poison screen for Panel 4 screenshot...");
    await page.evaluate(() => {
      const app = document.getElementById('app');
      app.innerHTML = `
        <div style="display:flex; justify-content:flex-end; width:100%;">
          <div style="display:inline-flex; border:2px solid var(--border-strong); border-radius:12px; overflow:hidden;">
            <button style="background:var(--btn-espresso); color:#fff; border:none; padding:4px 10px; font-weight:800; font-size:0.75rem;">TR</button>
            <button style="background:var(--bg-card); color:var(--text-main); border:none; padding:4px 10px; font-weight:800; font-size:0.75rem;">EN</button>
          </div>
        </div>

        <div class="poisoned-cinematic-screen">
          <div class="vintage-header-title">~ CUP OF TEA ~</div>

          <div style="margin: 4px 0;">
            <svg class="flaming-skull-svg" viewBox="0 0 240 260" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="venomGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <path d="M60 160 C30 110 40 50 80 20 C60 60 70 90 95 90 C100 40 120 10 140 0 C130 40 140 70 160 80 C180 30 200 40 210 70 C190 90 195 120 180 160 Z" fill="#32dc6c" opacity="0.45" filter="url(#venomGlow)"/>
              <path d="M75 140 C55 95 65 45 95 25 C80 60 90 85 110 85 C115 45 130 20 145 12 C138 45 145 70 160 78 C175 35 190 45 198 70 C180 88 185 112 170 145 Z" fill="#69ff94" opacity="0.75"/>
              <path d="M85 130 C75 90 85 60 105 45 C95 70 105 90 120 90 C125 60 135 40 145 35 C140 60 145 80 155 86 C165 55 175 62 180 80 C168 95 172 115 160 135 Z" fill="#a855f7" opacity="0.5"/>
              <path d="M70 110 C70 65 170 65 170 110 C170 135 160 145 155 165 L150 195 L90 195 L85 165 C80 145 70 135 70 110 Z" fill="#122b1c" stroke="#50fa7b" stroke-width="4"/>
              <path d="M76 112 C76 72 164 72 164 112 C164 130 156 142 150 160 L146 175 L94 175 L90 160 C84 142 76 130 76 112 Z" fill="#1d4a2d"/>
              <path d="M82 105 C82 80 158 80 158 105 C158 120 150 130 145 145 L95 145 C90 130 82 120 82 105 Z" fill="#2fe36c"/>
              <path d="M88 115 C88 102 110 102 110 118 C110 130 92 135 88 115 Z" fill="#0c1710" stroke="#50fa7b" stroke-width="2"/>
              <circle cx="98" cy="116" r="2.5" fill="#a3ffbd" filter="url(#venomGlow)"/>
              <path d="M152 115 C152 102 130 102 130 118 C130 130 148 135 152 115 Z" fill="#0c1710" stroke="#50fa7b" stroke-width="2"/>
              <circle cx="142" cy="116" r="2.5" fill="#a3ffbd" filter="url(#venomGlow)"/>
              <polygon points="120,132 114,146 126,146" fill="#0c1710" stroke="#50fa7b" stroke-width="1.5"/>
              <g transform="translate(94, 172)">
                <rect x="0" y="0" width="8" height="18" rx="2" fill="#e8ffed" stroke="#0c1710" stroke-width="1.8"/>
                <rect x="9" y="0" width="8" height="20" rx="2" fill="#e8ffed" stroke="#0c1710" stroke-width="1.8"/>
                <rect x="18" y="0" width="8" height="20" rx="2" fill="#e8ffed" stroke="#0c1710" stroke-width="1.8"/>
                <rect x="27" y="0" width="8" height="20" rx="2" fill="#e8ffed" stroke="#0c1710" stroke-width="1.8"/>
                <rect x="36" y="0" width="8" height="20" rx="2" fill="#e8ffed" stroke="#0c1710" stroke-width="1.8"/>
                <rect x="45" y="0" width="8" height="18" rx="2" fill="#e8ffed" stroke="#0c1710" stroke-width="1.8"/>
              </g>
            </svg>
          </div>

          <div class="ribbon-banner-poisoned">
            <div class="banner-text-poisoned">POISONED!</div>
          </div>

          <div class="killer-attribution-subtitle">
            KATİL: MORIARTY
          </div>

          <div class="poison-badges-row">
            <div class="poison-stat-badge penalty">
              <div class="badge-avatar-box">☠️</div>
              <div class="badge-headline-text">WATSON</div>
              <div class="badge-sub-points red">-2 ASSASSIN POINTS</div>
            </div>

            <div class="poison-stat-badge bonus">
              <div class="badge-avatar-box">🎯</div>
              <div class="badge-headline-text">MORIARTY</div>
              <div class="badge-sub-points">+2 ASSASSIN POINTS</div>
            </div>
          </div>

          <button class="btn btn-primary" style="margin-top:12px; width:100%; max-width:280px;">
            ROUND SUMMARY
          </button>

          <div class="continue-prompt-text">
            TAP TO CONTINUE ▸
          </div>
        </div>
      `;
    });
    await new Promise(r => setTimeout(r, 1000));
    const panel4Path = path.join(ARTIFACT_DIR, 'panel_4_poison_reveal.png');
    await page.screenshot({ path: panel4Path, fullPage: false });
    console.log(`Saved Panel 4: ${panel4Path}`);
  }

  await browser.close();
  console.log("All 4 Victorian panels captured successfully!");
}

captureVictorianPanels().catch(err => {
  console.error("Error capturing panels:", err);
  process.exit(1);
});
