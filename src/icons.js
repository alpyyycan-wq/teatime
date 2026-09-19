// Authentic 16-Bit Victorian Pixel Art Assets for "Cup of Tea"
// 100% Faithful to Reference Sheet (media_1789782958476.jpg)
import { ASSET_IMAGES } from './assetData.js';

export const CUP_PALETTES = {
  blue: { key: 'blue', name: 'Moriarty', emblem: '1', asset: ASSET_IMAGES.cup_blue },
  crimson: { key: 'crimson', name: 'Watson', emblem: '2', asset: ASSET_IMAGES.cup_crimson },
  green: { key: 'green', name: 'Irene', emblem: '0', asset: ASSET_IMAGES.cup_green },
  gold: { key: 'gold', name: 'Player (Yon)', emblem: '1', asset: ASSET_IMAGES.cup_gold },
  orange: { key: 'orange', name: 'Lestrade', emblem: '3', asset: ASSET_IMAGES.cup_orange },
  silver: { key: 'silver', name: 'Mycroft', emblem: '2', asset: ASSET_IMAGES.cup_silver },
  copper: { key: 'copper', name: 'Adler', emblem: '1', asset: ASSET_IMAGES.cup_copper }
};

export function renderColoredTeacup(paletteKey = 'blue', emblemText = '') {
  const p = CUP_PALETTES[paletteKey] || CUP_PALETTES.blue;
  const assetSrc = p.asset || ASSET_IMAGES.cup_blue;

  return `
    <div class="teacup-porcelain-wrapper">
      <img 
        src="${assetSrc}" 
        alt="${p.name || 'Teacup'}" 
        class="pixel-teacup-img" 
        draggable="false"
      />
    </div>
  `;
}

export const ICONS = {
  // Inventory Pixel Icons
  pillPixel: `
    <img src="${ASSET_IMAGES.inv_pill}" alt="Panzehir" class="pixel-inv-icon" draggable="false" />
  `,
  poisonPixel: `
    <img src="${ASSET_IMAGES.inv_cyanide}" alt="Siyanür" class="pixel-inv-icon" draggable="false" />
  `,
  swapPixel: `
    <img src="${ASSET_IMAGES.inv_swap}" alt="Takas" class="pixel-inv-icon" draggable="false" />
  `,

  // Default Teacup
  teacupPixel: renderColoredTeacup('blue', '1'),

  // Retro Pixel Action: DRINK (Gentleman sipping from cup, Panel 1)
  actionDrink: `
    <img src="${ASSET_IMAGES.icon_drink}" alt="DRINK" class="action-pixel-icon" draggable="false" />
  `,

  // Retro Pixel Action: DUMP (Tilted pouring teacup with droplet, Panel 1)
  actionDump: `
    <img src="${ASSET_IMAGES.icon_dump}" alt="DUMP" class="action-pixel-icon" draggable="false" />
  `,

  // Retro Pixel Action: SWAP CUP (Teacup flanked by circular swap arrows, Panel 1)
  actionSwap: `
    <img src="${ASSET_IMAGES.icon_swap_deck}" alt="SWAP CUP" class="action-pixel-icon swap-deck-icon" draggable="false" />
  `,

  // Skull & Crown
  skull: `
    <img src="${ASSET_IMAGES.badge_victim}" alt="Skull" style="width:28px; height:28px; image-rendering:pixelated;" draggable="false" />
  `,
  crown: `
    <span style="font-size:1.5rem; filter:drop-shadow(0 2px 0 #000);">👑</span>
  `,

  // Authentic 8-Bit Pixel Candlestick Sprites (Panel 1: Decision Phase Header)
  pixelCandleTall: `
    <img src="${ASSET_IMAGES.candle_left}" alt="Candles" class="pixel-candle-img left" draggable="false" />
  `,
  pixelCandleShort: `
    <img src="${ASSET_IMAGES.candle_right}" alt="Candle" class="pixel-candle-img right" draggable="false" />
  `,
  pixelCandle: `
    <img src="${ASSET_IMAGES.candle_left}" alt="Candles" class="pixel-candle-img" draggable="false" />
  `,

  // Victorian Gold Filigree Corner Ornament (Panel 3: Result Phase Frame)
  filigreeCorner: `
    <svg class="pixel-filigree-corner" viewBox="0 0 24 24" width="100%" height="100%" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="24" height="2" fill="#ffd700"/>
      <rect x="0" y="2" width="24" height="2" fill="#c79628"/>
      <rect x="0" y="4" width="24" height="1" fill="#694c0b"/>
      <rect x="0" y="0" width="2" height="24" fill="#ffd700"/>
      <rect x="2" y="0" width="2" height="24" fill="#c79628"/>
      <rect x="4" y="0" width="1" height="24" fill="#694c0b"/>
      <rect x="0" y="0" width="6" height="6" fill="#ffd700"/>
      <rect x="1" y="1" width="4" height="4" fill="#fff099"/>
      <rect x="2" y="2" width="2" height="2" fill="#ffffff"/>
      <rect x="6" y="4" width="6" height="2" fill="#ffd700"/>
      <rect x="10" y="2" width="4" height="3" fill="#c79628"/>
      <rect x="13" y="1" width="4" height="2" fill="#ffd700"/>
      <rect x="16" y="2" width="3" height="3" fill="#c79628"/>
      <rect x="18" y="4" width="2" height="3" fill="#ffd700"/>
      <rect x="17" y="6" width="2" height="2" fill="#694c0b"/>
      <rect x="4" y="6" width="2" height="6" fill="#ffd700"/>
      <rect x="2" y="10" width="3" height="4" fill="#c79628"/>
      <rect x="1" y="13" width="2" height="4" fill="#ffd700"/>
      <rect x="2" y="16" width="3" height="3" fill="#c79628"/>
      <rect x="4" y="18" width="3" height="2" fill="#ffd700"/>
      <rect x="6" y="17" width="2" height="2" fill="#694c0b"/>
      <rect x="7" y="7" width="6" height="6" fill="#2a180b"/>
      <rect x="8" y="8" width="4" height="4" fill="#c79628"/>
      <rect x="9" y="7" width="2" height="6" fill="#ffd700"/>
      <rect x="7" y="9" width="6" height="2" fill="#ffd700"/>
      <rect x="9" y="9" width="2" height="2" fill="#ffffff"/>
      <rect x="11" y="11" width="3" height="3" fill="#ffd700"/>
      <rect x="13" y="13" width="2" height="2" fill="#c79628"/>
      <rect x="14" y="15" width="2" height="2" fill="#694c0b"/>
    </svg>
  `,

  // 16-Bit Retro Toxic Flaming Skull (Panel 4: Poison Cinematic)
  flamingSkullPixel: `
    <div class="flaming-skull-container">
      <img src="${ASSET_IMAGES.flaming_skull}" alt="Flaming Skull" class="flaming-skull-img" draggable="false" />
    </div>
  `,

  // 3D Purple Ribbon Banner (Panel 4: POISONED!)
  poisonBanner: `
    <img src="${ASSET_IMAGES.poison_banner}" alt="POISONED!" class="poison-banner-img" draggable="false" />
  `,

  // Panel 4 Badges
  badgeVictim: `
    <img src="${ASSET_IMAGES.badge_victim}" alt="Victim" class="poison-badge-img" draggable="false" />
  `,
  badgeKiller: `
    <img src="${ASSET_IMAGES.badge_killer}" alt="Killer" class="poison-badge-img" draggable="false" />
  `,

  // Panel 4 Overturned cups background
  overturnedCups: `
    <img src="${ASSET_IMAGES.overturned_cups}" alt="Table" class="overturned-cups-img" draggable="false" />
  `,

  // Full Cinematic Art
  poisonCinematicFull: `
    <img src="${ASSET_IMAGES.poison_cinematic_full}" alt="Poison Cinematic" class="poison-cinematic-full-img" draggable="false" />
  `,

  // Authentic Shattered Porcelain Teacup & Spilled Tea (Panel 3: Result Phase)
  shatteredCupPixel: `
    <div class="shattered-cup-container">
      <img src="${ASSET_IMAGES.shattered_cup}" alt="Shattered Cup" class="shattered-cup-img" draggable="false" />
    </div>
  `,

  // Mystical Victorian Tarot Card: Blind Tasting (Panel 2: Round Modifier)
  blindTastingCardArt: `
    <div class="tarot-card-pixel-container">
      <img src="${ASSET_IMAGES.tarot_card}" alt="Blind Tasting Tarot Card" class="tarot-card-img" draggable="false" />
    </div>
  `
};

// Export helper for dynamic candle rendering
export function renderPixelCandle(variant = 'tall') {
  return variant === 'short' ? ICONS.pixelCandleShort : ICONS.pixelCandleTall;
}
