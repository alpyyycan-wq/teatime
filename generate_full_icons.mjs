import fs from 'fs';
import { 
  generateCandleSvg, 
  generateFiligreeCornerSvg, 
  generateShatteredCupSvg, 
  generateFlamingSkullSvg, 
  generateBlindTastingCardSvg 
} from './build_pixel_art.mjs';

const fullIconsJs = `// Pure Retro Pixel Art SVG Assets for "Cup of Tea"
// Designed with crisp pixel grids (shape-rendering: crispEdges) - 0% Vector Slop, 100% Authentic Retro!

export const CUP_PALETTES = {
  blue: {
    cupBody: '#1d4e89',
    cupShade: '#0f2b4d',
    saucer: '#285b99',
    pattern: '#70a5e3',
    accent: '#f7d070',
    tea: '#6b2b18',
    highlight: '#90c0f5'
  },
  crimson: {
    cupBody: '#8f1d2c',
    cupShade: '#520c16',
    saucer: '#ab2437',
    pattern: '#d95264',
    accent: '#f7d070',
    tea: '#6b2b18',
    highlight: '#fa7a8a'
  },
  green: {
    cupBody: '#1b5e32',
    cupShade: '#0e381d',
    saucer: '#267d44',
    pattern: '#43ab6a',
    accent: '#f7d070',
    tea: '#6b2b18',
    highlight: '#70cf94'
  },
  gold: {
    cupBody: '#a67c1e',
    cupShade: '#694c0b',
    saucer: '#c79628',
    pattern: '#e6ba4c',
    accent: '#fff3c2',
    tea: '#6b2b18',
    highlight: '#ffdb78'
  },
  orange: {
    cupBody: '#a84c1d',
    cupShade: '#662b0c',
    saucer: '#c75e28',
    pattern: '#e6814c',
    accent: '#f7d070',
    tea: '#6b2b18',
    highlight: '#ff9e6b'
  },
  silver: {
    cupBody: '#5c6b7d',
    cupShade: '#384250',
    saucer: '#738399',
    pattern: '#9cb0c7',
    accent: '#f7d070',
    tea: '#6b2b18',
    highlight: '#cad7e6'
  },
  copper: {
    cupBody: '#80462e',
    cupShade: '#522919',
    saucer: '#9e5a3c',
    pattern: '#c27c5b',
    accent: '#f7d070',
    tea: '#6b2b18',
    highlight: '#e39d7d'
  }
};

export function renderColoredTeacup(paletteKey = 'blue', emblemText = '') {
  const p = CUP_PALETTES[paletteKey] || CUP_PALETTES.blue;
  const dark = '#0c060e';
  const white = '#ffffff';
  const steam1 = '#ffe8d6';
  const steam2 = '#e8c0a0';
  const gold = p.accent || '#ffd24c';
  const body = p.cupBody;
  const shade = p.cupShade;
  const highlight = p.highlight || p.pattern;
  const teaDark = '#5c2214';
  const teaLight = '#a64a2b';
  const saucer = p.saucer;
  const saucerShade = p.cupShade;

  return \`
    <svg class="pixel-teacup" viewBox="0 0 32 26" width="100%" height="100%" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <!-- 8-Bit Pixel Steam Wisps -->
      <rect x="9" y="4" width="2" height="2" fill="\${steam1}"/>
      <rect x="8" y="2" width="2" height="2" fill="\${steam2}"/>
      <rect x="15" y="3" width="2" height="3" fill="\${steam1}"/>
      <rect x="16" y="1" width="2" height="2" fill="\${steam2}"/>
      <rect x="21" y="4" width="2" height="2" fill="\${steam1}"/>
      <rect x="22" y="2" width="2" height="2" fill="\${steam2}"/>

      <!-- Pixel Saucer Shadow on Table -->
      <rect x="2" y="24" width="26" height="2" fill="\${dark}" opacity="0.6"/>

      <!-- Pixel Saucer Base -->
      <rect x="3" y="22" width="24" height="1" fill="\${dark}"/>
      <rect x="2" y="23" width="26" height="1" fill="\${dark}"/>
      <rect x="4" y="22" width="22" height="1" fill="\${saucer}"/>
      <rect x="3" y="23" width="24" height="1" fill="\${saucerShade}"/>
      <rect x="6" y="22" width="18" height="1" fill="\${gold}"/>

      <!-- Cup Outer Border -->
      <rect x="5" y="8" width="20" height="1" fill="\${dark}"/>
      <rect x="4" y="9" width="1" height="8" fill="\${dark}"/>
      <rect x="25" y="9" width="1" height="8" fill="\${dark}"/>
      <rect x="5" y="17" width="2" height="2" fill="\${dark}"/>
      <rect x="23" y="17" width="2" height="2" fill="\${dark}"/>
      <rect x="7" y="19" width="2" height="2" fill="\${dark}"/>
      <rect x="21" y="19" width="2" height="2" fill="\${dark}"/>
      <rect x="9" y="21" width="12" height="1" fill="\${dark}"/>

      <!-- Cup Body Main Color -->
      <rect x="5" y="9" width="20" height="8" fill="\${body}"/>
      <rect x="7" y="17" width="16" height="2" fill="\${body}"/>
      <rect x="9" y="19" width="12" height="2" fill="\${body}"/>

      <!-- Highlights (Left Side) -->
      <rect x="5" y="9" width="2" height="7" fill="\${highlight}"/>
      <rect x="7" y="16" width="2" height="2" fill="\${highlight}"/>

      <!-- Shadows (Right & Bottom) -->
      <rect x="22" y="9" width="3" height="8" fill="\${shade}"/>
      <rect x="18" y="17" width="5" height="2" fill="\${shade}"/>
      <rect x="15" y="19" width="6" height="2" fill="\${shade}"/>

      <!-- Tea Surface inside Rim -->
      <rect x="6" y="9" width="18" height="2" fill="\${teaDark}"/>
      <rect x="8" y="9" width="10" height="1" fill="\${teaLight}"/>
      <rect x="6" y="8" width="18" height="1" fill="\${gold}"/>

      <!-- Gold Pixel Band Across Cup -->
      <rect x="5" y="13" width="20" height="2" fill="\${gold}"/>
      <rect x="5" y="13" width="2" height="2" fill="\${white}"/>
      <rect x="22" y="13" width="3" height="2" fill="\${shade}"/>

      <!-- Pixel Handle -->
      <rect x="25" y="10" width="4" height="1" fill="\${dark}"/>
      <rect x="28" y="11" width="2" height="5" fill="\${dark}"/>
      <rect x="25" y="15" width="4" height="1" fill="\${dark}"/>
      <rect x="25" y="11" width="3" height="1" fill="\${gold}"/>
      <rect x="27" y="12" width="1" height="3" fill="\${gold}"/>
      <rect x="25" y="14" width="3" height="1" fill="\${saucerShade}"/>

      <!-- Center Number / Emblem Badge -->
      \${emblemText ? \`
        <rect x="12" y="12" width="6" height="5" fill="\${dark}"/>
        <rect x="13" y="13" width="4" height="3" fill="\${gold}"/>
        <text x="15" y="16" text-anchor="middle" fill="\${dark}" font-family="'Press Start 2P', monospace" font-size="3.5" font-weight="bold">\${emblemText}</text>
      \` : ''}
    </svg>
  \`;
}

export const ICONS = {
  // 8-Bit Pixel Antidote Pill
  pillPixel: \`
    <svg width="28" height="28" viewBox="0 0 20 20" shape-rendering="crispEdges" fill="none" class="pixel-icon">
      <rect x="3" y="13" width="5" height="4" fill="#d90429" stroke="#120914" stroke-width="1"/>
      <rect x="6" y="10" width="5" height="4" fill="#ef233c" stroke="#120914" stroke-width="1"/>
      <rect x="9" y="7" width="5" height="4" fill="#edf2f4" stroke="#120914" stroke-width="1"/>
      <rect x="12" y="4" width="5" height="4" fill="#ffffff" stroke="#120914" stroke-width="1"/>
      <rect x="8" y="8" width="4" height="4" fill="#ffd166"/>
      <rect x="14" y="5" width="2" height="2" fill="#ffffff"/>
    </svg>
  \`,

  // 8-Bit Pixel Cyanide Poison Bottle
  poisonPixel: \`
    <svg width="28" height="28" viewBox="0 0 20 20" shape-rendering="crispEdges" fill="none" class="pixel-icon">
      <rect x="8" y="2" width="4" height="2" fill="#b08968" stroke="#120914" stroke-width="1"/>
      <rect x="7" y="4" width="6" height="2" fill="#120914"/>
      <rect x="4" y="6" width="12" height="12" fill="#1b4332" stroke="#120914" stroke-width="1"/>
      <rect x="5" y="7" width="2" height="10" fill="#38b000"/>
      <rect x="13" y="7" width="2" height="10" fill="#081c15"/>
      <rect x="8" y="8" width="4" height="3" fill="#d8f3dc"/>
      <rect x="8" y="12" width="4" height="2" fill="#d8f3dc"/>
      <rect x="8" y="9" width="1" height="1" fill="#081c15"/>
      <rect x="11" y="9" width="1" height="1" fill="#081c15"/>
    </svg>
  \`,

  // 8-Bit Pixel Swap Coin
  swapPixel: \`
    <svg width="28" height="28" viewBox="0 0 20 20" shape-rendering="crispEdges" fill="none" class="pixel-icon">
      <rect x="3" y="3" width="14" height="14" fill="#c39d7b" stroke="#342217" stroke-width="1"/>
      <rect x="5" y="5" width="10" height="10" fill="#ffd166"/>
      <rect x="6" y="7" width="6" height="2" fill="#342217"/>
      <rect x="10" y="6" width="2" height="4" fill="#342217"/>
      <rect x="8" y="11" width="6" height="2" fill="#342217"/>
      <rect x="8" y="10" width="2" height="4" fill="#342217"/>
    </svg>
  \`,

  // Default Teacup
  teacupPixel: renderColoredTeacup('blue', '1'),

  // Retro Pixel Action: DRINK
  actionDrink: \`
    <svg width="40" height="40" viewBox="0 0 24 24" shape-rendering="crispEdges" fill="none">
      <rect x="4" y="6" width="12" height="13" fill="#ffd166" stroke="#120914" stroke-width="1"/>
      <rect x="5" y="7" width="2" height="11" fill="#ffffff"/>
      <rect x="13" y="7" width="2" height="11" fill="#d4a017"/>
      <rect x="4" y="4" width="3" height="2" fill="#ffffff"/>
      <rect x="8" y="3" width="4" height="3" fill="#ffffff"/>
      <rect x="13" y="4" width="3" height="2" fill="#ffffff"/>
      <rect x="16" y="8" width="3" height="1" fill="#120914"/>
      <rect x="18" y="9" width="1" height="5" fill="#120914"/>
      <rect x="16" y="14" width="3" height="1" fill="#120914"/>
      <rect x="16" y="9" width="2" height="5" fill="#d4a017"/>
      <rect x="1" y="4" width="2" height="2" fill="#ff4d6d"/>
      <rect x="21" y="4" width="2" height="2" fill="#ff4d6d"/>
    </svg>
  \`,

  // Retro Pixel Action: DUMP
  actionDump: \`
    <svg width="40" height="40" viewBox="0 0 24 24" shape-rendering="crispEdges" fill="none">
      <rect x="3" y="4" width="12" height="9" fill="#e8d5c4" stroke="#120914" stroke-width="1"/>
      <rect x="4" y="5" width="2" height="7" fill="#ffffff"/>
      <rect x="12" y="6" width="2" height="6" fill="#b09b88"/>
      <rect x="1" y="6" width="2" height="5" fill="#ffd166" stroke="#120914" stroke-width="1"/>
      <rect x="15" y="8" width="4" height="3" fill="#8f3a24"/>
      <rect x="16" y="11" width="3" height="4" fill="#a8482d"/>
      <rect x="17" y="15" width="3" height="4" fill="#c45c3d"/>
      <rect x="14" y="20" width="2" height="2" fill="#c45c3d"/>
      <rect x="18" y="20" width="2" height="2" fill="#c45c3d"/>
      <rect x="21" y="17" width="2" height="2" fill="#8f3a24"/>
      <rect x="12" y="17" width="2" height="2" fill="#8f3a24"/>
    </svg>
  \`,

  // Retro Pixel Action: SWAP CUP
  actionSwap: \`
    <svg width="40" height="40" viewBox="0 0 24 24" shape-rendering="crispEdges" fill="none">
      <rect x="2" y="9" width="7" height="8" fill="#5085c2" stroke="#120914" stroke-width="1"/>
      <rect x="3" y="10" width="1" height="6" fill="#ffffff"/>
      <rect x="15" y="9" width="7" height="8" fill="#c94d5b" stroke="#120914" stroke-width="1"/>
      <rect x="16" y="10" width="1" height="6" fill="#ffffff"/>
      <rect x="7" y="4" width="7" height="2" fill="#ffd700"/>
      <rect x="13" y="3" width="2" height="1" fill="#ffd700"/>
      <rect x="14" y="4" width="2" height="2" fill="#ffd700"/>
      <rect x="13" y="6" width="2" height="1" fill="#ffd700"/>
      <rect x="10" y="19" width="7" height="2" fill="#ffd700"/>
      <rect x="9" y="18" width="2" height="1" fill="#ffd700"/>
      <rect x="8" y="19" width="2" height="2" fill="#ffd700"/>
      <rect x="9" y="21" width="2" height="1" fill="#ffd700"/>
    </svg>
  \`,

  // 8-Bit Pixel Skull
  skull: \`
    <svg width="48" height="48" viewBox="0 0 16 16" shape-rendering="crispEdges" fill="none">
      <rect x="4" y="2" width="8" height="1" fill="#120914"/>
      <rect x="3" y="3" width="10" height="6" fill="#f1faee" stroke="#120914" stroke-width="1"/>
      <rect x="5" y="9" width="6" height="4" fill="#f1faee" stroke="#120914" stroke-width="1"/>
      <rect x="4" y="5" width="2" height="2" fill="#b7094c"/>
      <rect x="10" y="5" width="2" height="2" fill="#b7094c"/>
      <rect x="7" y="7" width="2" height="2" fill="#120914"/>
      <rect x="6" y="10" width="1" height="2" fill="#120914"/>
      <rect x="8" y="10" width="1" height="2" fill="#120914"/>
    </svg>
  \`,

  // 8-Bit Pixel Crown
  crown: \`
    <svg width="48" height="48" viewBox="0 0 16 16" shape-rendering="crispEdges" fill="none">
      <rect x="2" y="10" width="12" height="3" fill="#ffb703" stroke="#120914" stroke-width="1"/>
      <rect x="2" y="5" width="2" height="5" fill="#ffb703" stroke="#120914" stroke-width="1"/>
      <rect x="7" y="3" width="2" height="7" fill="#ffb703" stroke="#120914" stroke-width="1"/>
      <rect x="12" y="5" width="2" height="5" fill="#ffb703" stroke="#120914" stroke-width="1"/>
      <rect x="2" y="4" width="2" height="1" fill="#e63946"/>
      <rect x="7" y="2" width="2" height="1" fill="#2a9d8f"/>
      <rect x="12" y="4" width="2" height="1" fill="#e63946"/>
      <rect x="5" y="11" width="2" height="1" fill="#ffffff"/>
      <rect x="9" y="11" width="2" height="1" fill="#ffffff"/>
    </svg>
  \`,

  // --- Genuine Victorian Gothic Retro Pixel Art Sprites ---

  // Authentic 8-Bit Pixel Candlestick Sprites (Panel 1: Decision Phase Header)
  pixelCandleTall: \`
${generateCandleSvg('tall')}
  \`,

  pixelCandleShort: \`
${generateCandleSvg('short')}
  \`,

  pixelCandle: \`
${generateCandleSvg('tall')}
  \`,

  // Victorian Gold Filigree Corner Ornament (Panel 3: Result Phase Frame)
  filigreeCorner: \`
${generateFiligreeCornerSvg()}
  \`,

  // 16-Bit Retro Toxic Flaming Skull (Panel 4: Poison Cinematic)
  flamingSkullPixel: \`
${generateFlamingSkullSvg()}
  \`,

  // Authentic Shattered Porcelain Teacup & Spilled Tea (Panel 3: Result Phase)
  shatteredCupPixel: \`
${generateShatteredCupSvg()}
  \`,

  // Mystical Victorian Tarot Card: Blind Tasting (Panel 2: Round Modifier)
  blindTastingCardArt: \`
${generateBlindTastingCardSvg()}
  \`
};

// Export helper for dynamic candle rendering
export function renderPixelCandle(variant = 'tall') {
  return variant === 'short' ? ICONS.pixelCandleShort : ICONS.pixelCandleTall;
}
`;

fs.writeFileSync('src/icons.js', fullIconsJs);
console.log("src/icons.js cleanly regenerated and written!");
