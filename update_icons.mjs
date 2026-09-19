import fs from 'fs';
import { 
  generateCandleSvg, 
  generateFiligreeCornerSvg, 
  generateShatteredCupSvg, 
  generateFlamingSkullSvg, 
  generateBlindTastingCardSvg 
} from './build_pixel_art.mjs';

const existingIcons = fs.readFileSync('src/icons.js', 'utf8');

// Get lines 1 to 297 (up to crown)
const crownEndIdx = existingIcons.indexOf('  crown: `');
const nextIconIdx = existingIcons.indexOf('  // 16-Bit Retro Flaming Skull', crownEndIdx);
const basePart = existingIcons.substring(0, nextIconIdx);

const candleTall = generateCandleSvg('tall');
const candleShort = generateCandleSvg('short');
const filigreeCorner = generateFiligreeCornerSvg();
const shatteredCup = generateShatteredCupSvg();
const flamingSkull = generateFlamingSkullSvg();
const tarotCard = generateBlindTastingCardSvg();

const newContent = `${basePart}  // --- Genuine Victorian Gothic Retro Pixel Art Sprites ---

  // Authentic 8-Bit Pixel Candlestick Sprites (Panel 1: Decision Phase Header)
  pixelCandleTall: \`
${candleTall}
  \`,

  pixelCandleShort: \`
${candleShort}
  \`,

  pixelCandle: \`
${candleTall}
  \`,

  // Victorian Gold Filigree Corner Ornament (Panel 3: Result Phase Frame)
  filigreeCorner: \`
${filigreeCorner}
  \`,

  // 16-Bit Retro Toxic Flaming Skull (Panel 4: Poison Cinematic)
  flamingSkullPixel: \`
${flamingSkull}
  \`,

  // Authentic Shattered Porcelain Teacup & Spilled Tea (Panel 3: Result Phase)
  shatteredCupPixel: \`
${shatteredCup}
  \`,

  // Mystical Victorian Tarot Card: Blind Tasting (Panel 2: Round Modifier)
  blindTastingCardArt: \`
${tarotCard}
  \`
};

// Export helper for dynamic candle rendering
export function renderPixelCandle(variant = 'tall') {
  return variant === 'short' ? ICONS.pixelCandleShort : ICONS.pixelCandleTall;
}
`;

fs.writeFileSync('src/icons.js', newContent);
console.log("src/icons.js successfully upgraded!");
