import puppeteer from 'puppeteer-core';
import fs from 'fs';
import { ASSET_IMAGES } from './src/assetData.js';
import { CUP_PALETTES, renderColoredTeacup, ICONS } from './src/icons.js';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const cssContent = fs.readFileSync('src/style.css', 'utf-8');

async function renderAllPanels() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

  const players = [
    { id: '1', name: 'Moriarty', isBot: true, palette: 'blue', emblem: '1', sugar: 1, isMe: false },
    { id: '2', name: 'Watson', isBot: true, palette: 'crimson', emblem: '2', sugar: 2, isMe: false },
    { id: '3', name: 'Irene', isBot: true, palette: 'green', emblem: '0', sugar: 0, isMe: false },
    { id: '4', name: 'Player (Sen)', isBot: false, palette: 'gold', emblem: '1', sugar: 1, isMe: true },
    { id: '5', name: 'Lestrade', isBot: true, palette: 'orange', emblem: '3', sugar: 3, isMe: false },
    { id: '6', name: 'Mycroft', isBot: true, palette: 'silver', emblem: '2', sugar: 2, isMe: false },
    { id: '7', name: 'Adler', isBot: true, palette: 'copper', emblem: '1', sugar: 1, isMe: false }
  ];

  const renderCupItem = (p) => `
    <div class="cup-slot-item ${p.isMe ? 'is-me' : ''}">
      <div class="cup-player-nametag ${p.isMe ? 'is-you' : ''}">
        ${p.isMe ? 'Player (Sen)' : `Bot ${p.name}`}
      </div>
      <div class="pixel-teacup">
        ${renderColoredTeacup(p.palette, p.emblem)}
      </div>
      <div class="neon-sugar-badge ${p.isMe ? 'my-sugar-badge' : ''}">
        <span class="neon-sugar-num">${p.sugar}</span>
      </div>
    </div>
  `;

  const row1 = players.slice(0, 2).map(renderCupItem).join('');
  const row2 = players.slice(2, 5).map(renderCupItem).join('');
  const row3 = players.slice(5, 7).map(renderCupItem).join('');

  const table232Html = `
    <div class="cups-table-232">
      <div class="cups-row cups-row-2">${row1}</div>
      <div class="cups-row cups-row-3">${row2}</div>
      <div class="cups-row cups-row-2">${row3}</div>
    </div>
  `;

  const inventoryBarHtml = `
    <div class="inventory-pixel-bar">
      <div class="inv-item-group">
        <div class="inv-slot">
          <div class="inv-icon-wrapper">
            ${ICONS.pillPixel}
            <span class="inv-count-badge">1</span>
          </div>
          <span class="inv-slot-label">Panzehir</span>
        </div>
        <div class="inv-slot">
          <div class="inv-icon-wrapper">
            ${ICONS.poisonPixel}
            <span class="inv-count-badge">2</span>
          </div>
          <span class="inv-slot-label">Siyanür</span>
        </div>
        <div class="inv-slot">
          <div class="inv-icon-wrapper">
            ${ICONS.swapPixel}
            <span class="inv-count-badge">1</span>
          </div>
          <span class="inv-slot-label">Takas</span>
        </div>
      </div>
      <div class="score-stars-group">
        <div class="stars-row">
          <span class="star-filled">★</span>
          <span class="star-filled">★</span>
          <span class="star-filled">★</span>
          <span class="star-filled">★</span>
          <span class="star-empty">★</span>
        </div>
        <div class="score-text-label">Score: 0/8</div>
      </div>
    </div>
  `;

  // -------------------------------------------------------------
  // 1. PANEL 1: DECISION PHASE
  // -------------------------------------------------------------
  const htmlPanel1 = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Pixelify+Sans:wght@700;800&family=Playfair+Display:ital,wght@1,600&display=swap" rel="stylesheet">
      <style>${cssContent}</style>
    </head>
    <body>
      <div id="app">
        <div class="app-header">
          <div class="brand-title">RAUND 1</div>
          <div style="display:flex; align-items:center; gap:8px;">
            <div class="room-badge">3/4 Hazır</div>
            <div style="display:flex; border:1.5px solid #57335e; border-radius:6px; overflow:hidden;">
              <span style="background:#ffd700; color:#211202; padding:3px 8px; font-size:0.65rem; font-weight:800; font-family:var(--font-pixel-heading);">TR</span>
              <span style="background:#2b1830; color:#e5d8c8; padding:3px 8px; font-size:0.65rem; font-weight:800; font-family:var(--font-pixel-heading);">EN</span>
            </div>
          </div>
        </div>

        ${inventoryBarHtml}

        <div class="candles-header">
          <div class="candle-cluster">
            <div class="candle-item short">${ICONS.pixelCandleShort}</div>
            <div class="candle-item tall">${ICONS.pixelCandleTall}</div>
          </div>
          <div class="phase-main-title">DECISION PHASE .</div>
          <div class="candle-cluster">
            <div class="candle-item tall">${ICONS.pixelCandleTall}</div>
          </div>
        </div>

        ${table232Html}

        <div class="action-deck-section">
          <div class="action-deck-title">SELECT AN ACTION</div>
          <div class="pixel-actions-row">
            <div class="pixel-action-card active-gold">
              <div class="pixel-action-icon">${ICONS.actionDrink}</div>
              <div class="pixel-action-title">DRINK</div>
            </div>
            <div class="pixel-action-card">
              <div class="pixel-action-icon">${ICONS.actionDump}</div>
              <div class="pixel-action-title">DUMP</div>
            </div>
            <div class="pixel-action-card">
              <div class="pixel-action-icon">${ICONS.actionSwap}</div>
              <div class="pixel-action-title">SWAP<br>CUP</div>
            </div>
          </div>

          <button class="btn-reveal-table">
            <span class="btn-reveal-icon">➜</span>
            <span class="btn-reveal-text">MASAYI AÇIKLA (FAZI BİTİR)</span>
          </button>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setContent(htmlPanel1);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'verify_panel1_decision.png' });
  console.log('Saved verify_panel1_decision.png');

  // -------------------------------------------------------------
  // 2. PANEL 2: BLIND TASTING TAROT CARD
  // -------------------------------------------------------------
  const htmlPanel2 = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Pixelify+Sans:wght@700;800&family=Playfair+Display:ital,wght@1,600&display=swap" rel="stylesheet">
      <style>${cssContent}</style>
    </head>
    <body>
      <div id="app">
        <div class="app-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-family:var(--font-pixel-heading); font-size:0.75rem; color:#ffd700; font-weight:800;">RAUND MODIFIER</span>
            <span style="font-family:var(--font-pixel-heading); font-size:0.75rem; color:#f7ca3e; font-weight:800;">BLIND TASTING</span>
          </div>
          <div style="display:flex; border:1.5px solid #57335e; border-radius:6px; overflow:hidden;">
            <span style="background:#ffd700; color:#211202; padding:3px 8px; font-size:0.65rem; font-weight:800; font-family:var(--font-pixel-heading);">TR</span>
            <span style="background:#2b1830; color:#e5d8c8; padding:3px 8px; font-size:0.65rem; font-weight:800; font-family:var(--font-pixel-heading);">EN</span>
          </div>
        </div>

        ${inventoryBarHtml}

        <div class="filigree-frame" style="padding: 14px 12px 10px; margin-bottom:10px;">
          <div class="filigree-corner top-left">${ICONS.filigreeCorner}</div>
          <div class="filigree-corner top-right">${ICONS.filigreeCorner}</div>
          <div class="filigree-corner bottom-left">${ICONS.filigreeCorner}</div>
          <div class="filigree-corner bottom-right">${ICONS.filigreeCorner}</div>
          <div class="filigree-inner-border"></div>

          <div class="tarot-view-container">
            <div style="margin-bottom:8px; width:100%; display:flex; justify-content:center;">
              ${ICONS.blindTastingCardArt}
            </div>

            <div class="tarot-rule-text" style="font-size:0.75rem; margin-bottom:10px;">
              Raundun gizli kaderini belirlemek için bir fincan seç.
            </div>

            <button class="btn-accept-challenge" style="padding:11px; margin-bottom:7px; font-size:0.75rem;">
              ⚡ MEYDAN OKUMAYI KABUL ET
            </button>

            <button class="btn-decline-challenge" style="padding:9px; font-size:0.72rem;">
              ✓ REDDET
            </button>

            <div class="tarot-footer-quote" style="margin-top:8px; font-size:0.65rem;">
              Gizli dozlar. İkinci bir şans yok.
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setContent(htmlPanel2);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'verify_panel2_blind_tasting.png' });
  console.log('Saved verify_panel2_blind_tasting.png');

  // -------------------------------------------------------------
  // 3. PANEL 3: RESULT PHASE
  // -------------------------------------------------------------
  const htmlPanel3 = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Pixelify+Sans:wght@700;800&family=Playfair+Display:ital,wght@1,600&display=swap" rel="stylesheet">
      <style>${cssContent}</style>
    </head>
    <body>
      <div id="app">
        <div class="app-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-family:var(--font-pixel-heading); font-size:0.75rem; color:#ffd700; font-weight:800;">RAUND MODIFIER</span>
            <span style="font-family:var(--font-pixel-heading); font-size:0.75rem; color:#f7ca3e; font-weight:800;">BLIND TASTING</span>
          </div>
          <div style="display:flex; border:1.5px solid #57335e; border-radius:6px; overflow:hidden;">
            <span style="background:#ffd700; color:#211202; padding:3px 8px; font-size:0.65rem; font-weight:800; font-family:var(--font-pixel-heading);">TR</span>
            <span style="background:#2b1830; color:#e5d8c8; padding:3px 8px; font-size:0.65rem; font-weight:800; font-family:var(--font-pixel-heading);">EN</span>
          </div>
        </div>

        ${inventoryBarHtml}

        <div class="filigree-frame">
          <div class="filigree-corner top-left">${ICONS.filigreeCorner}</div>
          <div class="filigree-corner top-right">${ICONS.filigreeCorner}</div>
          <div class="filigree-corner bottom-left">${ICONS.filigreeCorner}</div>
          <div class="filigree-corner bottom-right">${ICONS.filigreeCorner}</div>
          <div class="filigree-inner-border"></div>

          <div class="filigree-header-title">RESULT PHASE</div>

          ${table232Html}

          <div class="shattered-cup-scene">
            ${ICONS.shatteredCupPixel}
          </div>
        </div>

        <button class="btn btn-primary" style="width:100%; font-size:0.75rem; padding:12px; margin-top:auto;">
          SONRAKİ RAUNDU BAŞLAT ▸
        </button>
      </div>
    </body>
    </html>
  `;
  await page.setContent(htmlPanel3);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'verify_panel3_result_phase.png' });
  console.log('Saved verify_panel3_result_phase.png');

  // -------------------------------------------------------------
  // 4. PANEL 4: POISON REVEAL SCREEN
  // -------------------------------------------------------------
  const htmlPanel4 = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Pixelify+Sans:wght@700;800&family=Playfair+Display:ital,wght@1,600&display=swap" rel="stylesheet">
      <style>${cssContent}</style>
    </head>
    <body>
      <div id="app">
        <div style="display:flex; justify-content:flex-end; width:100%;">
          <div style="display:flex; border:1.5px solid #57335e; border-radius:6px; overflow:hidden;">
            <span style="background:#ffd700; color:#211202; padding:3px 8px; font-size:0.65rem; font-weight:800; font-family:var(--font-pixel-heading);">TR</span>
            <span style="background:#2b1830; color:#e5d8c8; padding:3px 8px; font-size:0.65rem; font-weight:800; font-family:var(--font-pixel-heading);">EN</span>
          </div>
        </div>

        <div class="poisoned-cinematic-screen" style="cursor:pointer; display:flex; flex-direction:column; align-items:center; width:100%;">
          <div class="poison-poster-card" style="position:relative; width:100%; max-width:340px; margin:0 auto; display:flex; justify-content:center;">
            <img 
              src="${ASSET_IMAGES.poison_cinematic_full}" 
              alt="Poison Reveal" 
              class="poison-poster-img" 
              style="width:100%; height:auto; display:block; image-rendering:pixelated; border-radius:6px; box-shadow:0 8px 30px rgba(0,0,0,0.9);" 
              draggable="false" 
            />
            
            <div class="poison-overlay-killer" style="position:absolute; top:42%; left:50%; transform:translateX(-50%); width:78%; text-align:center; font-family:var(--font-pixel-heading); font-size:0.75rem; font-weight:800; color:#ffd700; text-shadow:1px 1px 0 #000; background:#1b0d22; padding:2px 4px; border-radius:2px; border:1px solid #3d1f4b;">
              KILLER: MORIARTY
            </div>

            <div class="poison-overlay-penalty" style="position:absolute; top:63%; left:28%; transform:translateX(-50%); width:38%; text-align:center; font-family:var(--font-pixel-heading); font-size:0.52rem; font-weight:800; color:#ff6b6b; text-shadow:1px 1px 0 #000; line-height:1.2;">
              PENALTY:<br>-2 ASSASSIN<br>POINTS
            </div>

            <div class="poison-overlay-bonus" style="position:absolute; top:63%; left:72%; transform:translateX(-50%); width:38%; text-align:center; font-family:var(--font-pixel-heading); font-size:0.52rem; font-weight:800; color:#ffd700; text-shadow:1px 1px 0 #000; line-height:1.2;">
              KILLER BONUS:<br>+2 ASSASSIN<br>POINTS
            </div>
          </div>

          <div class="continue-prompt-text" style="margin-top:10px; font-family:var(--font-pixel-heading); font-size:0.72rem; color:#a395ab; letter-spacing:1px; cursor:pointer;">
            TAP TO CONTINUE
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setContent(htmlPanel4);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'verify_panel4_poison_reveal.png' });
  console.log('Saved verify_panel4_poison_reveal.png');

  await browser.close();
}

renderAllPanels().catch(console.error);
