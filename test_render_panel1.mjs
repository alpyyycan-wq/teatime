import puppeteer from 'puppeteer-core';
import fs from 'fs';
import { ASSET_IMAGES } from './src/assetData.js';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function testRender() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  
  const cups = [
    { name: 'Bot Moriarty', asset: ASSET_IMAGES.cup_blue, sugar: 1, isMe: false },
    { name: 'Bot Watson', asset: ASSET_IMAGES.cup_crimson, sugar: 2, isMe: false },
    { name: 'Bot Irene', asset: ASSET_IMAGES.cup_green, sugar: 0, isMe: false },
    { name: 'Player (Sen)', asset: ASSET_IMAGES.cup_gold, sugar: 1, isMe: true },
    { name: 'Bot Lestrade', asset: ASSET_IMAGES.cup_orange, sugar: 3, isMe: false },
    { name: 'Bot Mycroft', asset: ASSET_IMAGES.cup_silver, sugar: 2, isMe: false },
    { name: 'Bot Adler', asset: ASSET_IMAGES.cup_copper, sugar: 1, isMe: false }
  ];
  
  const renderCup = (c) => `
    <div class="cup-slot ${c.isMe ? 'is-me' : ''}">
      <div class="cup-name ${c.isMe ? 'is-you' : ''}">${c.name}</div>
      <div class="cup-porcelain">
        <img src="${c.asset}" class="cup-img" />
      </div>
      <div class="sugar-badge ${c.isMe ? 'my-sugar' : ''}">
        <span>${c.sugar}</span>
      </div>
    </div>
  `;
  
  const row1 = cups.slice(0, 2).map(renderCup).join('');
  const row2 = cups.slice(2, 5).map(renderCup).join('');
  const row3 = cups.slice(5, 7).map(renderCup).join('');
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Pixelify+Sans:wght@700;800&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #170b1a;
          color: #f5eedb;
          font-family: 'Pixelify Sans', monospace;
          display: flex;
          justify-content: center;
          padding: 14px 16px;
        }
        .container {
          width: 100%;
          max-width: 360px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        /* Header */
        .header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .round-title {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.82rem;
          color: #e5b95c;
          letter-spacing: 1px;
        }
        .ready-pill {
          background: #2a182d;
          border: 1.5px solid #57335e;
          border-radius: 12px;
          padding: 4px 10px;
          font-size: 0.68rem;
          color: #ffcf77;
          font-weight: 800;
        }
        .lang-toggles {
          display: flex;
          border: 1.5px solid #57335e;
          border-radius: 6px;
          overflow: hidden;
        }
        .lang-btn {
          background: #2b1830;
          color: #e5d8c8;
          border: none;
          padding: 3px 8px;
          font-size: 0.65rem;
          font-weight: 800;
        }
        .lang-btn.active {
          background: #57335e;
          color: #ffd700;
        }
        
        /* Sage Green Inventory Bar */
        .inv-bar {
          width: 100%;
          background: #8b9983;
          border: 2px solid #2e352b;
          border-radius: 10px;
          padding: 6px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 0 #0d060e, inset 0 1px 0 rgba(255,255,255,0.3);
          margin-bottom: 12px;
        }
        .inv-slots {
          display: flex;
          gap: 8px;
        }
        .slot {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .slot-box {
          width: 36px;
          height: 36px;
          background: #a2b09a;
          border: 1.5px solid #4a5445;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);
        }
        .slot-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          background: #111;
          color: #fff;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          padding: 1px 3px;
          border-radius: 3px;
        }
        .slot-label {
          font-size: 0.6rem;
          color: #242b22;
          font-weight: 800;
          margin-top: 2px;
        }
        .score-box {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .stars {
          color: #e5a918;
          font-size: 1rem;
          letter-spacing: 2px;
          text-shadow: 0 1px 0 #2e352b;
        }
        .score-label {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.58rem;
          color: #242b22;
          margin-top: 4px;
          font-weight: 800;
        }
        
        /* Decision Phase & Candles Header */
        .candles-banner {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin: 4px 0 14px;
        }
        .candle-flame {
          display: inline-block;
          width: 6px;
          height: 10px;
          background: #ffd24d;
          border-radius: 50% 50% 30% 30%;
          box-shadow: 0 0 8px #ff9900;
        }
        .candle-body {
          width: 8px;
          background: #e8dcc8;
          border-radius: 1px;
        }
        .candle-body.short { height: 16px; }
        .candle-body.tall { height: 28px; }
        .candle-cluster {
          display: flex;
          align-items: flex-end;
          gap: 4px;
        }
        .candle-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .phase-title {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.85rem;
          color: #ffffff;
          letter-spacing: 1px;
          text-shadow: 0 2px 0 #000;
        }
        
        /* Symmetrical 2-3-2 Table */
        .table-232 {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .row {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          width: 100%;
        }
        .row-2 { gap: 64px; }
        .row-3 { gap: 16px; }
        
        .cup-slot {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          width: 82px;
        }
        .cup-name {
          font-size: 0.65rem;
          font-weight: 700;
          color: #c9b9aa;
          text-shadow: 1px 1px 0 #000;
          margin-bottom: 2px;
          text-align: center;
          white-space: nowrap;
        }
        .cup-name.is-you {
          color: #ffcf77;
          font-weight: 800;
        }
        .cup-porcelain {
          width: 66px;
          display: flex;
          justify-content: center;
        }
        .cup-img {
          width: 100%;
          height: auto;
          image-rendering: pixelated;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.8));
        }
        .sugar-badge {
          background: #081d24;
          border: 1.5px solid #00e5ff;
          box-shadow: 0 0 8px rgba(0, 229, 255, 0.6), inset 0 0 4px rgba(0, 229, 255, 0.3);
          border-radius: 4px;
          padding: 0 7px;
          min-width: 22px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: -8px;
          z-index: 2;
        }
        .sugar-badge span {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.6rem;
          color: #4ee0e8;
          font-weight: bold;
        }
        .cup-slot.is-me {
          filter: drop-shadow(0 0 10px rgba(255, 207, 119, 0.7));
        }
        
        /* Action Section */
        .action-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .action-title {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.68rem;
          color: #f7d070;
          letter-spacing: 1px;
          margin-bottom: 8px;
          text-align: center;
        }
        .action-row {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          margin-bottom: 10px;
        }
        .action-card {
          background: #2b182d;
          border: 2px solid #57335e;
          border-radius: 8px;
          padding: 8px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          box-shadow: 0 4px 0 #0f0710;
          min-height: 72px;
        }
        .action-card.active {
          background: #f2b705;
          border-color: #8c670a;
          box-shadow: 0 0 12px rgba(242, 183, 5, 0.5), 0 4px 0 #6e5006;
        }
        .action-card.active .card-txt {
          color: #160c02;
        }
        .card-txt {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.62rem;
          color: #f7d070;
          text-align: center;
          line-height: 1.1;
        }
        .card-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .card-icon img {
          max-width: 100%;
          max-height: 100%;
          image-rendering: pixelated;
        }
        
        /* Bottom Reveal Button */
        .reveal-btn {
          width: 100%;
          background: #221a36;
          border: 2px solid #4a3e6b;
          border-radius: 8px;
          padding: 12px 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 0 #0b0814;
        }
        .reveal-btn span {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.62rem;
          color: #ffffff;
          letter-spacing: 0.5px;
        }
        .reveal-arrow {
          color: #4ee0e8;
          font-size: 0.8rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="round-title">RAUND 1</div>
          <div style="display:flex; align-items:center; gap:8px;">
            <div class="ready-pill">3/4 Hazır</div>
            <div class="lang-toggles">
              <div class="lang-btn active">TR</div>
              <div class="lang-btn">EN</div>
            </div>
          </div>
        </div>
        
        <!-- Inventory Bar -->
        <div class="inv-bar">
          <div class="inv-slots">
            <div class="slot">
              <div class="slot-box">
                <img src="${ASSET_IMAGES.inv_pill}" style="width:18px; image-rendering:pixelated;" />
                <span class="slot-badge">1</span>
              </div>
              <span class="slot-label">Panzehir</span>
            </div>
            <div class="slot">
              <div class="slot-box">
                <img src="${ASSET_IMAGES.inv_cyanide}" style="width:18px; image-rendering:pixelated;" />
                <span class="slot-badge">2</span>
              </div>
              <span class="slot-label">Siyanür</span>
            </div>
            <div class="slot">
              <div class="slot-box">
                <img src="${ASSET_IMAGES.inv_swap}" style="width:18px; image-rendering:pixelated;" />
                <span class="slot-badge">1</span>
              </div>
              <span class="slot-label">Takas</span>
            </div>
          </div>
          <div class="score-box">
            <div class="stars">★★★★☆</div>
            <div class="score-label">Score: 0/8</div>
          </div>
        </div>
        
        <!-- Flanked Candles Banner -->
        <div class="candles-banner">
          <div class="candle-cluster">
            <div class="candle-item">
              <span class="candle-flame"></span>
              <span class="candle-body short"></span>
            </div>
            <div class="candle-item">
              <span class="candle-flame"></span>
              <span class="candle-body tall"></span>
            </div>
          </div>
          <div class="phase-title">DECISION PHASE .</div>
          <div class="candle-cluster">
            <div class="candle-item">
              <span class="candle-flame"></span>
              <span class="candle-body tall"></span>
            </div>
          </div>
        </div>
        
        <!-- Symmetrical 2-3-2 Teacups Table -->
        <div class="table-232">
          <div class="row row-2">${row1}</div>
          <div class="row row-3">${row2}</div>
          <div class="row row-2">${row3}</div>
        </div>
        
        <!-- Action Cards & Bottom Reveal -->
        <div class="action-section">
          <div class="action-title">SELECT AN ACTION</div>
          <div class="action-row">
            <div class="action-card active">
              <div class="card-icon"><img src="${ASSET_IMAGES.icon_drink}" /></div>
              <div class="card-txt">DRINK</div>
            </div>
            <div class="action-card">
              <div class="card-icon"><img src="${ASSET_IMAGES.icon_dump}" /></div>
              <div class="card-txt">DUMP</div>
            </div>
            <div class="action-card">
              <div class="card-icon"><img src="${ASSET_IMAGES.icon_swap_deck}" /></div>
              <div class="card-txt">SWAP<br>CUP</div>
            </div>
          </div>
          <div class="reveal-btn">
            <span class="reveal-arrow">➜</span>
            <span>MASAYI AÇIKLA (FAZI BİTİR)</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await page.setContent(html);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test_panel1_perfect.png' });
  console.log('Saved test_panel1_perfect.png');
  await browser.close();
}

testRender();
