import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACT_DIRS = [
  '/Users/evaceylan/.gemini/antigravity/brain/34bca4d7-06b4-49ee-9d40-fe7001b95981',
  '/Users/evaceylan/.gemini/antigravity/brain/6f6f72bd-feaa-4b1e-9d99-bbfe76674441'
];

async function run() {
  console.log("Launching Puppeteer for direct 4-panel visual verification...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  const saveScreenshots = async (filename) => {
    for (const d of ARTIFACT_DIRS) {
      if (fs.existsSync(d)) {
        const p = path.join(d, filename);
        await page.screenshot({ path: p, fullPage: false });
        console.log(`Saved: ${p}`);
      }
    }
  };

  const iconsCode = fs.readFileSync('src/icons.js', 'utf8');
  const extractSvg = (name) => {
    const key = `${name}: \``;
    const start = iconsCode.indexOf(key);
    if (start === -1) return '';
    const s = start + key.length;
    const end = iconsCode.indexOf('`', s);
    return iconsCode.substring(s, end).trim();
  };

  const candleTall = extractSvg('pixelCandleTall');
  const candleShort = extractSvg('pixelCandleShort');
  const filigreeCorner = extractSvg('filigreeCorner');
  const shatteredCup = extractSvg('shatteredCupPixel');
  const flamingSkull = extractSvg('flamingSkullPixel');
  const tarotCard = extractSvg('blindTastingCardArt');
  const pillPixel = extractSvg('pillPixel');
  const poisonPixel = extractSvg('poisonPixel');
  const swapPixel = extractSvg('swapPixel');
  const actionDrink = extractSvg('actionDrink');
  const actionDump = extractSvg('actionDump');
  const actionSwap = extractSvg('actionSwap');

  // Real production inventory bar
  const renderProductionInvBar = (score = 0, pills = 2, cyanides = 1, swaps = 1) => `
    <div class="inventory-pixel-bar">
      <div class="inv-item-group">
        <div class="inv-slot">
          <div class="inv-icon-wrapper">
            ${pillPixel}
            <span class="inv-count-badge">${pills}</span>
          </div>
          <span class="inv-slot-label">Panzehir</span>
        </div>
        <div class="inv-slot">
          <div class="inv-icon-wrapper">
            ${poisonPixel}
            <span class="inv-count-badge">${cyanides}</span>
          </div>
          <span class="inv-slot-label">Siyanür</span>
        </div>
        <div class="inv-slot">
          <div class="inv-icon-wrapper">
            ${swapPixel}
            <span class="inv-count-badge">${swaps}</span>
          </div>
          <span class="inv-slot-label">Takas</span>
        </div>
      </div>

      <div class="score-stars-group">
        <div class="stars-row">
          <span class="star-filled">★</span>
          <span class="star-filled">★</span>
          <span class="star-empty">★</span>
          <span class="star-empty">★</span>
          <span class="star-empty">★</span>
        </div>
        <div class="score-text-label">Skor: ${score}/8</div>
      </div>
    </div>
  `;

  // 7 cups semi-circle layout
  const cupsData = [
    { name: 'Bot Moriarty', col: '#1d4e89', sugar: 1, isMe: false, num: 1 },
    { name: 'Bot Watson', col: '#8f1d2c', sugar: 2, isMe: false, num: 2 },
    { name: 'Bot Irene', col: '#1b5e32', sugar: 0, isMe: false, num: 3 },
    { name: 'Player (Sen)', col: '#a67c1e', sugar: 1, isMe: true, num: 4 },
    { name: 'Bot Lestrade', col: '#a84c1d', sugar: 3, isMe: false, num: 5 },
    { name: 'Bot Mycroft', col: '#5c6b7d', sugar: 2, isMe: false, num: 6 },
    { name: 'Bot Adler', col: '#80462e', sugar: 1, isMe: false, num: 7 }
  ];

  const renderCups = (cups) => cups.map((c) => `
    <div class="cup-slot-item ${c.isMe ? 'is-me' : ''}">
      <div class="cup-player-nametag ${c.isMe ? 'is-you' : ''}">${c.name}</div>
      <div class="pixel-teacup" style="display:flex; justify-content:center;">
        <svg viewBox="0 0 32 26" width="76" height="60" shape-rendering="crispEdges">
          <rect x="9" y="4" width="2" height="2" fill="#ffe8d6"/>
          <rect x="15" y="3" width="2" height="3" fill="#ffe8d6"/>
          <rect x="21" y="4" width="2" height="2" fill="#ffe8d6"/>
          <rect x="4" y="22" width="22" height="1" fill="#c79628"/>
          <rect x="3" y="23" width="24" height="1" fill="#694c0b"/>
          <rect x="5" y="9" width="20" height="8" fill="${c.col}"/>
          <rect x="7" y="17" width="16" height="2" fill="${c.col}"/>
          <rect x="9" y="19" width="12" height="2" fill="${c.col}"/>
          <rect x="5" y="13" width="20" height="2" fill="#ffd700"/>
          <rect x="6" y="8" width="18" height="1" fill="#ffd700"/>
          <rect x="25" y="10" width="4" height="6" fill="#ffd700"/>
          <rect x="27" y="11" width="1" height="4" fill="#180d1e"/>
          <rect x="12" y="12" width="6" height="5" fill="#180d1e"/>
          <text x="15" y="16" text-anchor="middle" fill="#ffd700" font-family="'Press Start 2P', monospace" font-size="3.5" font-weight="bold">${c.num}</text>
        </svg>
      </div>
      <div class="neon-sugar-badge ${c.isMe ? 'my-sugar-badge' : ''}">
        <span style="font-family:var(--font-pixel-heading); font-size:0.75rem; color:#4ee0e8; font-weight:bold;">${c.sugar}</span>
      </div>
    </div>
  `).join('');

  // -------------------------------------------------------------
  // PANEL 1: DECISION PHASE
  // -------------------------------------------------------------
  console.log("Rendering Panel 1: Decision Phase...");
  await page.evaluate(({ invBar, candleTall, candleShort, cupsHtml, actionDrink, actionDump, actionSwap }) => {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="app-header">
        <div class="brand-title">RAUND 1</div>
        <div style="display:flex; align-items:center; gap:8px;">
          <div class="room-badge">3/4 Hazır</div>
          <div style="display:inline-flex; border:2px solid var(--border-strong); border-radius:0; overflow:hidden;">
            <button style="background:var(--btn-espresso); color:#fff; border:none; padding:4px 8px; font-weight:800; font-size:0.7rem;">TR</button>
            <button style="background:var(--bg-card); color:var(--text-main); border:none; padding:4px 8px; font-weight:800; font-size:0.7rem;">EN</button>
          </div>
        </div>
      </div>

      ${invBar}

      <!-- Flanked Candles Header (Genuine Pixel Candlestick Sprites) -->
      <div class="candles-header">
        <div class="candle-cluster">
          <div class="candle-item short">${candleShort}</div>
          <div class="candle-item tall">${candleTall}</div>
        </div>
        <div class="phase-main-title">DECISION PHASE .</div>
        <div class="candle-cluster">
          <div class="candle-item tall">${candleTall}</div>
          <div class="candle-item short">${candleShort}</div>
        </div>
      </div>

      <!-- Multi-Colored Porcelain Teacups Semi-Circle Table Grid -->
      <div class="decision-cups-grid">
        ${cupsHtml}
      </div>

      <!-- Real Production Action Cards Deck Section -->
      <div class="action-deck-section" style="margin-top:6px;">
        <div class="action-deck-title">SELECT AN ACTION</div>
        <div class="action-cards-deck">
          <div class="pixel-action-card active-gold" id="btnVerdictDrink">
            <div class="pixel-action-title">DRINK</div>
            <div class="pixel-action-icon">${actionDrink}</div>
            <div class="pixel-action-badge">+1 Şeker</div>
          </div>

          <div class="pixel-action-card" id="btnVerdictDump">
            <div class="pixel-action-title">DUMP</div>
            <div class="pixel-action-icon">${actionDump}</div>
            <div class="pixel-action-badge">Güvenli</div>
          </div>

          <div class="pixel-action-card" id="btnVerdictSwap">
            <div class="pixel-action-title">SWAP CUP</div>
            <div class="pixel-action-icon">${actionSwap}</div>
            <div class="pixel-action-badge">1 Hak</div>
          </div>
        </div>

        <button class="btn btn-primary" style="margin-top:14px; width:100%; padding:14px; font-size:0.82rem;">
          + MASAYI AÇIKLA (FAZI BİTİR)
        </button>
      </div>
    `;
  }, { 
    invBar: renderProductionInvBar(0, 2, 1, 1), 
    candleTall, 
    candleShort, 
    cupsHtml: renderCups(cupsData),
    actionDrink,
    actionDump,
    actionSwap
  });

  await new Promise(r => setTimeout(r, 600));
  await saveScreenshots('panel_1_decision_phase.png');

  // -------------------------------------------------------------
  // PANEL 2: ROUND MODIFIER (BLIND TASTING TAROT CARD)
  // -------------------------------------------------------------
  console.log("Rendering Panel 2: Tarot Modifier Screen...");
  await page.evaluate(({ invBar, tarotCard }) => {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="app-header" style="margin-bottom:6px;">
        <div class="brand-title">RAUND MODIFIER <span style="font-size:0.75rem; color:#ffd700;">BLIND TASTING</span></div>
      </div>

      ${invBar}

      <div class="tarot-view-container">
        <div style="margin-bottom: 12px; display:flex; justify-content:center;">
          ${tarotCard}
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
  }, { invBar: renderProductionInvBar(0, 1, 1, 1), tarotCard });

  await new Promise(r => setTimeout(r, 600));
  await saveScreenshots('panel_2_round_modifier.png');

  // -------------------------------------------------------------
  // PANEL 3: RESULT PHASE (FILIGREE FRAME & SHATTERED PORCELAIN CUP)
  // -------------------------------------------------------------
  console.log("Rendering Panel 3: Result Phase...");
  await page.evaluate(({ invBar, filigreeCorner, cupsHtml, shatteredCup }) => {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="app-header" style="margin-bottom:6px;">
        <div class="brand-title">RAUND MODIFIER <span style="font-size:0.75rem; color:#ffd700;">BLIND TASTING</span></div>
      </div>

      ${invBar}

      <!-- Panel 3: Golden Filigree Frame with Cups & Shattered Porcelain Teacup Scene -->
      <div class="filigree-frame">
        <div class="filigree-corner top-left">${filigreeCorner}</div>
        <div class="filigree-corner top-right">${filigreeCorner}</div>
        <div class="filigree-corner bottom-left">${filigreeCorner}</div>
        <div class="filigree-corner bottom-right">${filigreeCorner}</div>
        <div class="filigree-inner-border"></div>
        <div class="filigree-header-title">RESULT PHASE</div>
        
        <div class="decision-cups-grid" style="margin: 4px 0 10px;">
          ${cupsHtml}
        </div>

        <div class="shattered-cup-scene">
          ${shatteredCup}
        </div>
      </div>
    `;
  }, { invBar: renderProductionInvBar(0, 2, 1, 1), filigreeCorner, cupsHtml: renderCups(cupsData), shatteredCup });

  await new Promise(r => setTimeout(r, 600));
  await saveScreenshots('panel_3_result_phase.png');

  // -------------------------------------------------------------
  // PANEL 4: POISONED CINEMATIC SCREEN
  // -------------------------------------------------------------
  console.log("Rendering Panel 4: Poisoned Cinematic Screen...");
  await page.evaluate(({ flamingSkull }) => {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div style="display:flex; justify-content:flex-end; width:100%;">
        <div style="display:inline-flex; border:2px solid var(--border-strong); border-radius:0; overflow:hidden;">
          <button style="background:var(--btn-espresso); color:#fff; border:none; padding:4px 8px; font-weight:800; font-size:0.7rem;">TR</button>
          <button style="background:var(--bg-card); color:var(--text-main); border:none; padding:4px 8px; font-weight:800; font-size:0.7rem;">EN</button>
        </div>
      </div>

      <div class="poisoned-cinematic-screen">
        <div class="vintage-header-title">~ Cup of Tea ~</div>

        <div style="margin: 0;">
          ${flamingSkull}
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
            <div class="badge-headline-text">PENALTY:</div>
            <div class="badge-sub-points red">-2 ASSASSIN POINTS</div>
          </div>

          <div class="poison-stat-badge bonus">
            <div class="badge-avatar-box">🎭</div>
            <div class="badge-headline-text">KILLER BONUS:</div>
            <div class="badge-sub-points">+2 ASSASSIN POINTS</div>
          </div>
        </div>

        <button class="btn btn-primary" style="margin-top:6px; width:100%; max-width:280px; padding:12px; font-size:0.78rem;">
          ROUND SUMMARY
        </button>

        <div class="continue-prompt-text" style="margin-top:8px;">
          TAP TO CONTINUE
        </div>
      </div>
    `;
  }, { flamingSkull });

  await new Promise(r => setTimeout(r, 600));
  await saveScreenshots('panel_4_poison_reveal.png');

  await browser.close();
  console.log("Direct 4-panel visual verification completed successfully!");
}

run().catch(err => {
  console.error("Error in render_4_panels:", err);
  process.exit(1);
});
