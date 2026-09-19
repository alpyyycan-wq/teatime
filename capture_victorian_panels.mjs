import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACT_DIRS = [
  '/Users/evaceylan/.gemini/antigravity/brain/34bca4d7-06b4-49ee-9d40-fe7001b95981',
  '/Users/evaceylan/.gemini/antigravity/brain/6f6f72bd-feaa-4b1e-9d99-bbfe76674441'
];

async function captureAllPanels() {
  console.log("Launching headless Chrome for 4-panel retro pixel art capture...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  // 390x844 portrait viewport matching reference iPhone mockup
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  const saveToBoth = async (filename) => {
    for (const dir of ARTIFACT_DIRS) {
      if (fs.existsSync(dir)) {
        const dest = path.join(dir, filename);
        await page.screenshot({ path: dest, fullPage: false });
        console.log(`Saved screenshot: ${dest}`);
      }
    }
  };

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // 1. CAPTURE PANEL 1: DECISION PHASE
  console.log("Setting up Panel 1: Decision Phase with bots...");
  await page.type('#hostName', 'Arthur');
  await page.click('#btnCreate');
  await page.waitForSelector('#btnAddBot', { timeout: 10000 });

  // Add 3 Bots
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 400));
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 400));
  await page.click('#btnAddBot');
  await new Promise(r => setTimeout(r, 600));

  // Start game -> Phase 1
  await page.click('#btnStartGame');
  await page.waitForSelector('.player-select-grid', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 800));

  // Submit Phase 1 sweet drop to advance to Phase 2
  await page.click('#btnSubmitPhase1');
  await page.waitForSelector('.candles-header', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1200));

  // Click DRINK action to highlight it in gold like Panel 1
  const btnDrink = await page.$('#btnVerdictDrink');
  if (btnDrink) {
    await btnDrink.click();
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("Capturing Panel 1: Decision Phase...");
  await saveToBoth('panel_1_decision_phase.png');

  // 2. CAPTURE PANEL 2: ROUND MODIFIER (BLIND TASTING TAROT CARD)
  console.log("Setting up Panel 2: Tarot Card Screen...");
  await page.evaluate(() => {
    // Call renderRoundModifierScreen directly
    const tarotContainer = document.querySelector('.tarot-view-container');
    if (!tarotContainer) {
      // Trigger round modifier view
      const app = document.getElementById('app');
      app.innerHTML = `
        <div style="display:flex; justify-content:flex-end; width:100%; margin-bottom:6px;">
          <div style="display:inline-flex; border:2px solid var(--border-strong); border-radius:0; overflow:hidden;">
            <button style="background:var(--btn-espresso); color:#fff; border:none; padding:4px 10px; font-weight:800; font-size:0.75rem;">TR</button>
            <button style="background:var(--bg-card); color:var(--text-main); border:none; padding:4px 10px; font-weight:800; font-size:0.75rem;">EN</button>
          </div>
        </div>

        <div class="tarot-view-container">
          <div class="vintage-header-title">~ CUP OF TEA ~</div>
          
          <div style="margin-bottom: 14px;">
            ${window.__ICONS ? window.__ICONS.blindTastingCardArt : document.querySelector('.tarot-card-svg')?.outerHTML || ''}
          </div>

          <div class="tarot-rule-text">
            Choose a cup to define the hidden fate of the round.
          </div>

          <button class="btn-accept-challenge" id="btnAcceptModifier">
            ⚔️ ACCEPT CHALLENGE
          </button>

          <button class="btn-decline-challenge" id="btnDeclineModifier">
            ✓ DECLINE
          </button>

          <div class="tarot-footer-quote">
            Hidden doses. No second chances.
          </div>
        </div>
      `;
    }
  });

  // Let's make sure window.__ICONS is exposed or retrieve from DOM
  const hasTarotSvg = await page.$('.tarot-card-svg');
  if (!hasTarotSvg) {
    // If not injected, we can read the blindTastingCardArt from icons.js directly in page
    const iconsJs = fs.readFileSync('src/icons.js', 'utf8');
    const startIdx = iconsJs.indexOf('blindTastingCardArt: `') + 'blindTastingCardArt: `'.length;
    const endIdx = iconsJs.indexOf('`', startIdx);
    const tarotSvg = iconsJs.substring(startIdx, endIdx);

    await page.evaluate((svg) => {
      const app = document.getElementById('app');
      app.innerHTML = `
        <div style="display:flex; justify-content:flex-end; width:100%; margin-bottom:6px;">
          <div style="display:inline-flex; border:2px solid var(--border-strong); border-radius:0; overflow:hidden;">
            <button style="background:var(--btn-espresso); color:#fff; border:none; padding:4px 10px; font-weight:800; font-size:0.75rem;">TR</button>
            <button style="background:var(--bg-card); color:var(--text-main); border:none; padding:4px 10px; font-weight:800; font-size:0.75rem;">EN</button>
          </div>
        </div>

        <div class="tarot-view-container">
          <div class="vintage-header-title">~ CUP OF TEA ~</div>
          
          <div style="margin-bottom: 14px;">
            ${svg}
          </div>

          <div class="tarot-rule-text">
            Choose a cup to define the hidden fate of the round.
          </div>

          <button class="btn-accept-challenge">
            ⚔️ ACCEPT CHALLENGE
          </button>

          <button class="btn-decline-challenge">
            ✓ DECLINE
          </button>

          <div class="tarot-footer-quote">
            Hidden doses. No second chances.
          </div>
        </div>
      `;
    }, tarotSvg);
  }

  await new Promise(r => setTimeout(r, 600));
  console.log("Capturing Panel 2: Tarot Card Screen...");
  await saveToBoth('panel_2_round_modifier.png');

  // 3. CAPTURE PANEL 4: POISONED CINEMATIC SCREEN
  console.log("Setting up Panel 4: Poisoned Cinematic Screen...");
  const iconsJs = fs.readFileSync('src/icons.js', 'utf8');
  const startSkull = iconsJs.indexOf('flamingSkullPixel: `') + 'flamingSkullPixel: `'.length;
  const endSkull = iconsJs.indexOf('`', startSkull);
  const skullSvg = iconsJs.substring(startSkull, endSkull);

  await page.evaluate((skull) => {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div style="display:flex; justify-content:flex-end; width:100%;">
        <div style="display:inline-flex; border:2px solid var(--border-strong); border-radius:0; overflow:hidden;">
          <button style="background:var(--btn-espresso); color:#fff; border:none; padding:4px 10px; font-weight:800; font-size:0.75rem;">TR</button>
          <button style="background:var(--bg-card); color:var(--text-main); border:none; padding:4px 10px; font-weight:800; font-size:0.75rem;">EN</button>
        </div>
      </div>

      <div class="poisoned-cinematic-screen">
        <div class="vintage-header-title">~ CUP OF TEA ~</div>

        <div style="margin: 4px 0;">
          ${skull}
        </div>

        <div class="ribbon-banner-poisoned">
          <div class="banner-text-poisoned">POISONED!</div>
        </div>

        <div class="killer-attribution-subtitle">
          KILLER: MORIARTY
        </div>

        <div class="poison-badges-row">
          <div class="poison-stat-badge penalty">
            <div class="badge-avatar-box">☠️</div>
            <div class="badge-headline-text">WATSON</div>
            <div class="badge-sub-points red">-2 PENALTY POINTS</div>
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
  }, skullSvg);

  await new Promise(r => setTimeout(r, 600));
  console.log("Capturing Panel 4: Poisoned Cinematic Screen...");
  await saveToBoth('panel_4_poison_reveal.png');

  // 4. CAPTURE PANEL 3: RESULT PHASE WITH SHATTERED CUP & FILIGREE FRAME
  console.log("Setting up Panel 3: Result Phase...");
  const startShattered = iconsJs.indexOf('shatteredCupPixel: `') + 'shatteredCupPixel: `'.length;
  const endShattered = iconsJs.indexOf('`', startShattered);
  const shatteredSvg = iconsJs.substring(startShattered, endShattered);

  const startCorner = iconsJs.indexOf('filigreeCorner: `') + 'filigreeCorner: `'.length;
  const endCorner = iconsJs.indexOf('`', startCorner);
  const cornerSvg = iconsJs.substring(startCorner, endCorner);

  await page.evaluate(({ shattered, corner }) => {
    const app = document.getElementById('app');
    // Generate 7 cups semi-circle matching Panel 3
    const cups = [
      { name: 'Bot Moriarty', col: '#1d4e89', sugar: 1, isMe: false },
      { name: 'Bot Watson', col: '#8f1d2c', sugar: 2, isMe: false },
      { name: 'Bot Irene', col: '#1b5e32', sugar: 0, isMe: false },
      { name: 'Player (You)', col: '#a67c1e', sugar: 1, isMe: true },
      { name: 'Bot Lestrade', col: '#a84c1d', sugar: 3, isMe: false },
      { name: 'Bot Mycroft', col: '#5c6b7d', sugar: 2, isMe: false },
      { name: 'Bot Adler', col: '#80462e', sugar: 1, isMe: false }
    ];

    const cupsHtml = cups.map((c, idx) => `
      <div class="cup-slot-item ${c.isMe ? 'is-me' : ''}">
        <div class="cup-player-nametag ${c.isMe ? 'is-you' : ''}">${c.name}</div>
        <div class="pixel-teacup" style="display:flex; justify-content:center;">
          <svg viewBox="0 0 32 26" width="76" height="60" shape-rendering="crispEdges">
            <rect x="5" y="9" width="20" height="8" fill="${c.col}"/>
            <rect x="7" y="17" width="16" height="2" fill="${c.col}"/>
            <rect x="9" y="19" width="12" height="2" fill="${c.col}"/>
            <rect x="4" y="22" width="22" height="1" fill="#c79628"/>
            <rect x="3" y="23" width="24" height="1" fill="#694c0b"/>
            <rect x="5" y="13" width="20" height="2" fill="#ffd700"/>
            <rect x="25" y="10" width="4" height="6" fill="#ffd700"/>
            <rect x="27" y="11" width="1" height="4" fill="#180d1e"/>
            <rect x="12" y="12" width="6" height="5" fill="#180d1e"/>
            <text x="15" y="16" text-anchor="middle" fill="#ffd700" font-family="'Press Start 2P', monospace" font-size="3.5" font-weight="bold">${idx+1}</text>
          </svg>
        </div>
        <div class="neon-sugar-badge ${c.isMe ? 'my-sugar-badge' : ''}">
          <span style="font-family:var(--font-pixel-heading); font-size:0.75rem; color:#4ee0e8; font-weight:bold;">${c.sugar}</span>
        </div>
      </div>
    `).join('');

    app.innerHTML = `
      <div style="display:flex; justify-content:flex-end; width:100%; margin-bottom:6px;">
        <div style="display:inline-flex; border:2px solid var(--border-strong); border-radius:0; overflow:hidden;">
          <button style="background:var(--btn-espresso); color:#fff; border:none; padding:4px 10px; font-weight:800; font-size:0.75rem;">TR</button>
          <button style="background:var(--bg-card); color:var(--text-main); border:none; padding:4px 10px; font-weight:800; font-size:0.75rem;">EN</button>
        </div>
      </div>

      <!-- Panel 3: Golden Filigree Frame with Cups & Shattered Porcelain Teacup Scene -->
      <div class="filigree-frame">
        <div class="filigree-corner top-left">${corner}</div>
        <div class="filigree-corner top-right">${corner}</div>
        <div class="filigree-corner bottom-left">${corner}</div>
        <div class="filigree-corner bottom-right">${corner}</div>
        <div class="filigree-inner-border"></div>
        <div class="filigree-header-title">RESULT PHASE</div>
        
        <div class="decision-cups-grid" style="margin: 4px 0 10px;">
          ${cupsHtml}
        </div>

        <div class="shattered-cup-scene">
          ${shattered}
        </div>
      </div>

      <div class="card" style="margin-top:10px;">
        <span class="input-label">SKOR TABLOSU</span>
        <div style="margin-top:6px; font-family:var(--font-pixel-ui); font-size:0.8rem; color:#e0d5c1;">
          1. Moriarty: 12 Puan | 2. Arthur: 9 Puan
        </div>
      </div>
    `;
  }, { shattered: shatteredSvg, corner: cornerSvg });

  await new Promise(r => setTimeout(r, 600));
  console.log("Capturing Panel 3: Result Phase...");
  await saveToBoth('panel_3_result_phase.png');

  await browser.close();
  console.log("All 4 panels captured successfully!");
}

captureAllPanels().catch(err => {
  console.error("Error capturing panels:", err);
  process.exit(1);
});
