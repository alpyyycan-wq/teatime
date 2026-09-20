import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { analyzeCanvasData } from './audit_pixel_art.mjs';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PUBLIC_ASSETS_DIR = path.resolve('./public/assets');
const ASSET_DATA_FILE = path.resolve('./src/assetData.js');

if (!fs.existsSync(PUBLIC_ASSETS_DIR)) {
  fs.mkdirSync(PUBLIC_ASSETS_DIR, { recursive: true });
}

// Master Sprite Synthesis Definitions
const SPRITE_DEFS = {
  // 1. THE 7 VICTORIAN TEACUPS (32x26)
  ...createTeacupDefs(),

  // 2. THE 3 ACTION BUTTON ICONS (36x36)
  icon_drink: {
    w: 36, h: 36,
    draw: (ctx) => {
      // Noble silhouette drinking from teacup
      const OUT = '#1a0c06';
      const BODY = '#f0e6d6';
      const SHADOW = '#b09e88';
      const TEA = '#78350f';
      const CUP = '#e6b843';

      // Head & Neck
      ctx.fillStyle = BODY;
      ctx.fillRect(8, 11, 8, 9);
      ctx.fillRect(9, 8, 6, 3);
      ctx.fillRect(11, 20, 5, 8);
      // Nose & Chin profile
      ctx.fillRect(16, 13, 2, 2);
      ctx.fillRect(15, 17, 2, 2);
      // Hair / Hat shadow
      ctx.fillStyle = SHADOW;
      ctx.fillRect(8, 8, 4, 11);
      ctx.fillRect(11, 20, 2, 8);

      // Raised hand holding cup
      ctx.fillStyle = BODY;
      ctx.fillRect(16, 21, 5, 4);
      ctx.fillRect(19, 23, 7, 5);
      ctx.fillStyle = SHADOW;
      ctx.fillRect(19, 26, 7, 3);

      // Teacup tilted to lips
      ctx.fillStyle = CUP;
      ctx.fillRect(15, 14, 8, 5);
      ctx.fillRect(16, 19, 6, 2);
      // Saucer under tilted cup
      ctx.fillRect(14, 20, 10, 2);
      // Tea in cup
      ctx.fillStyle = TEA;
      ctx.fillRect(16, 14, 6, 2);

      // Outline contours
      ctx.fillStyle = OUT;
      // Head outline
      ctx.fillRect(7, 8, 1, 12);
      ctx.fillRect(8, 7, 7, 1);
      ctx.fillRect(15, 8, 1, 5);
      ctx.fillRect(16, 12, 1, 1);
      ctx.fillRect(18, 13, 1, 2);
      ctx.fillRect(16, 15, 1, 2);
      ctx.fillRect(17, 17, 1, 2);
      ctx.fillRect(15, 19, 1, 1);
      ctx.fillRect(16, 20, 1, 5);
      // Cup outline
      ctx.fillRect(14, 13, 1, 6);
      ctx.fillRect(23, 13, 1, 6);
      ctx.fillRect(15, 19, 8, 1);
      ctx.fillRect(13, 20, 1, 2);
      ctx.fillRect(24, 20, 1, 2);
      ctx.fillRect(14, 22, 10, 1);

      // Steam curls above cup
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(19, 10, 1, 2);
      ctx.fillRect(20, 8, 1, 2);
      ctx.fillRect(22, 9, 1, 2);
      ctx.fillRect(23, 7, 1, 2);
    }
  },

  icon_dump: {
    w: 36, h: 36,
    draw: (ctx) => {
      // Teacup tilted at 45 deg, pouring tea stream
      const OUT = '#1a0c06';
      const CUP_BODY = '#fdfbf7';
      const CUP_SHADE = '#cbd5e1';
      const CUP_GOLD = '#d97706';
      const TEA = '#78350f';
      const TEA_SPLASH = '#b45309';

      // Tilted cup body
      ctx.fillStyle = CUP_BODY;
      ctx.fillRect(10, 9, 10, 6);
      ctx.fillRect(12, 15, 8, 5);
      ctx.fillRect(14, 20, 6, 3);
      // Shading on cup
      ctx.fillStyle = CUP_SHADE;
      ctx.fillRect(10, 11, 3, 5);
      ctx.fillRect(12, 16, 3, 4);
      // Gold filigree band
      ctx.fillStyle = CUP_GOLD;
      ctx.fillRect(11, 13, 9, 2);
      ctx.fillRect(13, 17, 7, 1);

      // Handle
      ctx.fillStyle = CUP_GOLD;
      ctx.fillRect(6, 11, 4, 2);
      ctx.fillRect(6, 13, 2, 4);
      ctx.fillRect(7, 17, 4, 2);

      // Poured tea stream gushing downwards
      ctx.fillStyle = TEA;
      ctx.fillRect(19, 11, 3, 3);
      ctx.fillRect(21, 14, 3, 5);
      ctx.fillRect(23, 19, 3, 7);
      ctx.fillRect(24, 26, 3, 6);
      // Splash drops
      ctx.fillStyle = TEA_SPLASH;
      ctx.fillRect(22, 31, 2, 2);
      ctx.fillRect(28, 29, 2, 2);
      ctx.fillRect(27, 24, 1, 2);

      // Outlines
      ctx.fillStyle = OUT;
      // Cup rim & body
      ctx.fillRect(9, 8, 11, 1);
      ctx.fillRect(9, 9, 1, 7);
      ctx.fillRect(11, 15, 1, 5);
      ctx.fillRect(13, 20, 1, 4);
      ctx.fillRect(14, 23, 6, 1);
      ctx.fillRect(20, 19, 1, 4);
      // Stream outline
      ctx.fillRect(20, 14, 1, 5);
      ctx.fillRect(22, 19, 1, 7);
      ctx.fillRect(23, 26, 1, 6);
      ctx.fillRect(26, 16, 1, 4);
      ctx.fillRect(27, 20, 1, 10);
    }
  },

  icon_swap_deck: {
    w: 36, h: 36,
    draw: (ctx) => {
      // Two teacups with circular swap arrows
      const OUT = '#1a0c06';
      const ARROW = '#eab308';
      const ARROW_SHADE = '#a16207';
      const CUP1 = '#f7d070';
      const CUP2 = '#93c5fd';

      // Left Cup
      ctx.fillStyle = CUP1;
      ctx.fillRect(6, 17, 9, 6);
      ctx.fillRect(5, 23, 11, 2);
      ctx.fillStyle = OUT;
      ctx.fillRect(5, 16, 11, 1);
      ctx.fillRect(5, 17, 1, 6);
      ctx.fillRect(15, 17, 1, 6);
      ctx.fillRect(4, 24, 13, 1);

      // Right Cup
      ctx.fillStyle = CUP2;
      ctx.fillRect(21, 9, 9, 6);
      ctx.fillRect(20, 15, 11, 2);
      ctx.fillStyle = OUT;
      ctx.fillRect(20, 8, 11, 1);
      ctx.fillRect(20, 9, 1, 6);
      ctx.fillRect(30, 9, 1, 6);
      ctx.fillRect(19, 16, 13, 1);

      // Top Curved Arrow (Left to Right)
      ctx.fillStyle = ARROW;
      ctx.fillRect(12, 7, 7, 2);
      ctx.fillRect(17, 8, 3, 3);
      // Arrow head pointing right
      ctx.fillRect(18, 5, 2, 5);
      ctx.fillRect(19, 6, 2, 3);
      ctx.fillRect(20, 7, 1, 1);

      // Bottom Curved Arrow (Right to Left)
      ctx.fillStyle = ARROW;
      ctx.fillRect(16, 25, 7, 2);
      ctx.fillRect(15, 23, 3, 3);
      // Arrow head pointing left
      ctx.fillRect(14, 24, 2, 5);
      ctx.fillRect(13, 25, 2, 3);
      ctx.fillRect(12, 26, 1, 1);

      // Arrow outlines
      ctx.fillStyle = ARROW_SHADE;
      ctx.fillRect(12, 6, 6, 1);
      ctx.fillRect(16, 27, 7, 1);
    }
  },

  // 3. INVENTORY BADGES (18x18)
  inv_pill: {
    w: 18, h: 18,
    draw: (ctx) => {
      const OUT = '#120508';
      const RED = '#dc2626';
      const RED_LIGHT = '#ef4444';
      const WHITE = '#fdfbf7';
      const WHITE_SHADE = '#cbd5e1';

      // Outline
      ctx.fillStyle = OUT;
      ctx.fillRect(5, 3, 8, 12);
      ctx.fillRect(4, 4, 10, 10);

      // Top Red Half
      ctx.fillStyle = RED;
      ctx.fillRect(5, 4, 8, 5);
      // Red Highlight
      ctx.fillStyle = RED_LIGHT;
      ctx.fillRect(6, 4, 2, 4);

      // Bottom White Half
      ctx.fillStyle = WHITE;
      ctx.fillRect(5, 9, 8, 4);
      // White shade
      ctx.fillStyle = WHITE_SHADE;
      ctx.fillRect(10, 9, 2, 4);

      // Capsule Divider
      ctx.fillStyle = OUT;
      ctx.fillRect(5, 9, 8, 1);
    }
  },

  inv_cyanide: {
    w: 18, h: 18,
    draw: (ctx) => {
      const OUT = '#15061c';
      const CORK = '#854d0e';
      const GLASS = '#2e1065';
      const LIQUID = '#7e22ce';
      const GLOW = '#c084fc';
      const SKULL = '#fdfbf7';

      // Cork
      ctx.fillStyle = CORK;
      ctx.fillRect(7, 2, 4, 3);
      ctx.fillStyle = OUT;
      ctx.fillRect(7, 1, 4, 1);
      ctx.fillRect(6, 2, 1, 3);
      ctx.fillRect(11, 2, 1, 3);

      // Bottle Body
      ctx.fillStyle = OUT;
      ctx.fillRect(4, 5, 10, 11);
      ctx.fillStyle = GLASS;
      ctx.fillRect(5, 6, 8, 9);
      // Poison Liquid
      ctx.fillStyle = LIQUID;
      ctx.fillRect(5, 9, 8, 6);
      // Glass Specular Gloss
      ctx.fillStyle = GLOW;
      ctx.fillRect(5, 7, 1, 7);
      ctx.fillRect(6, 7, 1, 2);
      // Mini Skull Face
      ctx.fillStyle = SKULL;
      ctx.fillRect(8, 10, 3, 2);
      ctx.fillRect(8, 13, 2, 1);
      ctx.fillStyle = OUT;
      ctx.fillRect(8, 11, 1, 1);
      ctx.fillRect(10, 11, 1, 1);
    }
  },

  inv_swap: {
    w: 18, h: 18,
    draw: (ctx) => {
      const OUT = '#1a0c06';
      const GOLD = '#eab308';
      const GOLD_LIGHT = '#fef08a';
      const GOLD_DARK = '#854d0e';

      // Circular twin arrows
      ctx.fillStyle = OUT;
      ctx.fillRect(4, 4, 10, 10);
      ctx.fillStyle = GOLD_DARK;
      ctx.fillRect(5, 5, 8, 8);

      // Arrow 1
      ctx.fillStyle = GOLD;
      ctx.fillRect(6, 6, 6, 2);
      ctx.fillRect(10, 7, 2, 3);
      ctx.fillStyle = GOLD_LIGHT;
      ctx.fillRect(11, 6, 2, 2);

      // Arrow 2
      ctx.fillStyle = GOLD;
      ctx.fillRect(6, 10, 2, 3);
      ctx.fillRect(6, 11, 6, 2);
      ctx.fillStyle = GOLD_LIGHT;
      ctx.fillRect(5, 11, 2, 2);

      // Center hole
      ctx.fillStyle = OUT;
      ctx.fillRect(8, 8, 2, 2);
    }
  },

  // 4. CANDLES (16x32)
  candle_left: createCandleDef(false),
  candle_right: createCandleDef(true),

  // 5. SHATTERED TEACUP (48x32)
  shattered_cup: {
    w: 48, h: 32,
    draw: (ctx) => {
      const OUT = '#12080a';
      const CUP_BODY = '#fdfbf7';
      const CUP_SHADE = '#cbd5e1';
      const CUP_GOLD = '#d97706';
      const TEA = '#78350f';

      // Spilled Tea Puddle on table
      ctx.fillStyle = TEA;
      ctx.fillRect(6, 23, 36, 4);
      ctx.fillRect(10, 21, 28, 7);
      ctx.fillRect(14, 20, 20, 9);
      ctx.fillStyle = OUT;
      ctx.fillRect(5, 24, 38, 1);

      // Broken Main Cup Half
      ctx.fillStyle = CUP_BODY;
      ctx.fillRect(20, 11, 16, 11);
      ctx.fillRect(22, 22, 12, 3);
      // Shading
      ctx.fillStyle = CUP_SHADE;
      ctx.fillRect(20, 14, 4, 8);
      // Gold Trim
      ctx.fillStyle = CUP_GOLD;
      ctx.fillRect(22, 13, 14, 2);
      ctx.fillRect(24, 18, 10, 1);

      // Handle (Intact on right)
      ctx.fillStyle = CUP_GOLD;
      ctx.fillRect(36, 13, 4, 2);
      ctx.fillRect(38, 15, 2, 4);
      ctx.fillRect(36, 19, 4, 2);

      // Jagged break lines
      ctx.fillStyle = OUT;
      ctx.fillRect(20, 11, 1, 12);
      ctx.fillRect(21, 14, 2, 1);
      ctx.fillRect(23, 11, 2, 1);
      ctx.fillRect(25, 14, 2, 1);
      ctx.fillRect(27, 10, 2, 1);
      ctx.fillRect(29, 13, 2, 1);
      ctx.fillRect(31, 11, 5, 1);

      // Broken Ceramic Shards beside cup
      ctx.fillStyle = CUP_BODY;
      ctx.fillRect(11, 18, 5, 3);
      ctx.fillRect(13, 16, 3, 2);
      ctx.fillStyle = CUP_GOLD;
      ctx.fillRect(12, 19, 4, 1);
      ctx.fillStyle = OUT;
      ctx.fillRect(10, 18, 1, 4);
      ctx.fillRect(16, 18, 1, 3);
    }
  },

  // 6. FLAMING SKULL (48x48)
  flaming_skull: {
    w: 48, h: 48,
    draw: (ctx) => {
      const OUT = '#09030a';
      const BONE = '#fdfbf7';
      const BONE_SHADE = '#94a3b8';
      const FLAME_PURPLE = '#7e22ce';
      const FLAME_GREEN = '#22c55e';
      const FLAME_BRIGHT = '#86efac';

      // Eerie Flickering Green/Purple Flames (Top & Sides)
      ctx.fillStyle = FLAME_PURPLE;
      ctx.fillRect(12, 4, 24, 16);
      ctx.fillRect(8, 10, 32, 14);
      ctx.fillStyle = FLAME_GREEN;
      ctx.fillRect(14, 6, 20, 12);
      ctx.fillRect(10, 12, 28, 10);
      ctx.fillStyle = FLAME_BRIGHT;
      ctx.fillRect(16, 8, 16, 6);
      // Flame wisps
      ctx.fillRect(14, 2, 3, 5);
      ctx.fillRect(22, 1, 4, 5);
      ctx.fillRect(31, 2, 3, 5);

      // Skull Cranium
      ctx.fillStyle = BONE;
      ctx.fillRect(14, 14, 20, 16);
      ctx.fillRect(12, 18, 24, 10);
      // Cranium Shading
      ctx.fillStyle = BONE_SHADE;
      ctx.fillRect(12, 22, 4, 6);
      ctx.fillRect(32, 22, 4, 6);

      // Eye Sockets (Dark with green glowing dot)
      ctx.fillStyle = OUT;
      ctx.fillRect(16, 21, 5, 6);
      ctx.fillRect(27, 21, 5, 6);
      ctx.fillStyle = FLAME_BRIGHT;
      ctx.fillRect(18, 23, 2, 2);
      ctx.fillRect(29, 23, 2, 2);

      // Nose Cavity
      ctx.fillStyle = OUT;
      ctx.fillRect(23, 28, 2, 3);

      // Upper Jaw & Teeth
      ctx.fillStyle = BONE;
      ctx.fillRect(17, 30, 14, 4);
      ctx.fillStyle = OUT;
      ctx.fillRect(19, 31, 1, 3);
      ctx.fillRect(21, 31, 1, 3);
      ctx.fillRect(23, 31, 1, 3);
      ctx.fillRect(25, 31, 1, 3);
      ctx.fillRect(27, 31, 1, 3);

      // Lower Jaw
      ctx.fillStyle = BONE;
      ctx.fillRect(18, 36, 12, 3);
      ctx.fillStyle = OUT;
      ctx.fillRect(20, 36, 1, 2);
      ctx.fillRect(23, 36, 1, 2);
      ctx.fillRect(26, 36, 1, 2);
    }
  },

  // 7. BADGES & CINEMATICS
  badge_victim: {
    w: 32, h: 32,
    draw: (ctx) => {
      // Victim Red Badge
      ctx.fillStyle = '#120406';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(3, 3, 26, 26);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(3, 3, 26, 2);
      ctx.fillRect(3, 3, 2, 26);
      // Shocked face
      ctx.fillStyle = '#fdfbf7';
      ctx.fillRect(8, 8, 16, 16);
      ctx.fillStyle = '#120406';
      ctx.fillRect(11, 12, 3, 4); // Eye
      ctx.fillRect(18, 12, 3, 4); // Eye
      ctx.fillRect(13, 19, 6, 4); // Open mouth
    }
  },

  badge_killer: {
    w: 32, h: 32,
    draw: (ctx) => {
      // Killer Gold Badge
      ctx.fillStyle = '#1a0c02';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(3, 3, 26, 26);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(3, 3, 26, 2);
      ctx.fillRect(3, 3, 2, 26);
      // Assassin face with eye mask
      ctx.fillStyle = '#fdfbf7';
      ctx.fillRect(8, 8, 16, 16);
      ctx.fillStyle = '#1a0c02';
      ctx.fillRect(8, 11, 16, 5); // Domino mask
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(11, 12, 2, 2); // Glowing eye
      ctx.fillRect(19, 12, 2, 2); // Glowing eye
      ctx.fillStyle = '#1a0c02';
      ctx.fillRect(13, 20, 6, 2); // Smirk
    }
  },

  poison_banner: {
    w: 128, h: 32,
    draw: (ctx) => {
      // Chunky Purple Ribbon Banner with Gold Trim
      ctx.fillStyle = '#0f0414';
      ctx.fillRect(4, 4, 120, 24);
      ctx.fillStyle = '#581c87';
      ctx.fillRect(6, 6, 116, 20);
      ctx.fillStyle = '#9333ea';
      ctx.fillRect(6, 6, 116, 2);
      ctx.fillRect(6, 6, 2, 20);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(10, 8, 108, 1);
      ctx.fillRect(10, 23, 108, 1);
    }
  },

  tarot_card: {
    w: 64, h: 96,
    draw: (ctx) => {
      // Mystical Victorian Blind Tasting Tarot Card
      // Dark Border
      ctx.fillStyle = '#0f0508';
      ctx.fillRect(0, 0, 64, 96);
      // Ornate Gold Outer Frame
      ctx.fillStyle = '#c79628';
      ctx.fillRect(2, 2, 60, 92);
      ctx.fillStyle = '#f7d070';
      ctx.fillRect(3, 3, 58, 1);
      ctx.fillRect(3, 3, 1, 90);
      // Inner Velvet Night
      ctx.fillStyle = '#1c0a24';
      ctx.fillRect(5, 5, 54, 86);
      // Mystical Eye (Top)
      ctx.fillStyle = '#fdfbf7';
      ctx.fillRect(24, 18, 16, 8);
      ctx.fillStyle = '#c79628';
      ctx.fillRect(28, 19, 8, 6);
      ctx.fillStyle = '#000000';
      ctx.fillRect(31, 20, 3, 4);
      // 3 Table Teacups (Center)
      ctx.fillStyle = '#e6b843';
      ctx.fillRect(14, 56, 10, 6);
      ctx.fillRect(27, 52, 10, 6);
      ctx.fillRect(40, 56, 10, 6);
      // Table curve
      ctx.fillStyle = '#3b1820';
      ctx.fillRect(8, 62, 48, 12);
    }
  },

  poison_cinematic_full: {
    w: 128, h: 128,
    draw: (ctx) => {
      // Unified Full Poison Cinematic Poster
      // Dark Vignette
      ctx.fillStyle = '#0a030c';
      ctx.fillRect(0, 0, 128, 128);

      // Flaming Green/Purple Aura
      ctx.fillStyle = '#581c87';
      ctx.fillRect(24, 12, 80, 70);
      ctx.fillStyle = '#15803d';
      ctx.fillRect(32, 16, 64, 60);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(40, 20, 48, 50);

      // Skull
      ctx.fillStyle = '#fdfbf7';
      ctx.fillRect(40, 28, 48, 40);
      ctx.fillRect(36, 36, 56, 24);
      // Eye sockets
      ctx.fillStyle = '#0a030c';
      ctx.fillRect(44, 42, 12, 14);
      ctx.fillRect(72, 42, 12, 14);
      // Nose
      ctx.fillRect(62, 58, 4, 6);
      // Teeth
      ctx.fillStyle = '#fdfbf7';
      ctx.fillRect(48, 66, 32, 10);
      ctx.fillStyle = '#0a030c';
      ctx.fillRect(52, 68, 2, 8);
      ctx.fillRect(58, 68, 2, 8);
      ctx.fillRect(64, 68, 2, 8);
      ctx.fillRect(70, 68, 2, 8);

      // POISONED! Banner (Bottom)
      ctx.fillStyle = '#581c87';
      ctx.fillRect(12, 86, 104, 28);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(14, 88, 100, 2);
      ctx.fillRect(14, 110, 100, 2);
    }
  },

  overturned_cups: {
    w: 64, h: 32,
    draw: (ctx) => {
      ctx.fillStyle = '#1a0a10';
      ctx.fillRect(0, 0, 64, 32);
      ctx.fillStyle = '#78350f'; // tea stain
      ctx.fillRect(10, 16, 44, 8);
      ctx.fillStyle = '#c79628'; // tipped cup 1
      ctx.fillRect(12, 12, 14, 8);
      ctx.fillStyle = '#3b82f6'; // tipped cup 2
      ctx.fillRect(38, 14, 14, 8);
    }
  }
};

function createTeacupDefs() {
  const PALETTES = {
    gold: { outline: '#120904', shadow: '#785108', mid: '#c79628', light: '#f7d070', filigree: '#fff8e7' },
    blue: { outline: '#060d17', shadow: '#143360', mid: '#2563eb', light: '#93c5fd', filigree: '#e0f2fe' },
    crimson: { outline: '#140508', shadow: '#660d1b', mid: '#b91c1c', light: '#f87171', filigree: '#fef2f2' },
    green: { outline: '#04140b', shadow: '#0e4a28', mid: '#15803d', light: '#4ade80', filigree: '#f0fdf4' },
    orange: { outline: '#140804', shadow: '#7a2e0a', mid: '#ea580c', light: '#fb923c', filigree: '#fff7ed' },
    silver: { outline: '#0a0c10', shadow: '#334155', mid: '#64748b', light: '#cbd5e1', filigree: '#ffffff' },
    copper: { outline: '#140905', shadow: '#5c2a16', mid: '#b45309', light: '#f59e0b', filigree: '#fef3c7' }
  };

  const defs = {};
  Object.keys(PALETTES).forEach(colorKey => {
    const pal = PALETTES[colorKey];
    defs[`cup_${colorKey}`] = {
      w: 32, h: 26,
      draw: new Function('ctx', `
        const outline = '${pal.outline}';
        const shadow = '${pal.shadow}';
        const mid = '${pal.mid}';
        const light = '${pal.light}';
        const filigree = '${pal.filigree}';

        // Saucer
        ctx.fillStyle = outline;
        ctx.fillRect(2, 23, 28, 2);
        ctx.fillStyle = light;
        ctx.fillRect(3, 21, 26, 2);
        ctx.fillStyle = mid;
        ctx.fillRect(4, 22, 24, 1);

        // Cup Body
        ctx.fillStyle = outline;
        ctx.fillRect(5, 7, 22, 13);
        ctx.fillRect(6, 6, 20, 15);

        // Base color
        ctx.fillStyle = mid;
        ctx.fillRect(6, 8, 20, 11);
        ctx.fillRect(8, 19, 16, 2);

        // Highlight column (Left)
        ctx.fillStyle = light;
        ctx.fillRect(6, 8, 4, 11);
        ctx.fillRect(8, 19, 3, 2);

        // Shadow column (Right)
        ctx.fillStyle = shadow;
        ctx.fillRect(21, 8, 5, 11);
        ctx.fillRect(19, 19, 4, 2);

        // Fine Victorian Filigree Pattern (White/Light lace)
        ctx.fillStyle = filigree;
        ctx.fillRect(10, 12, 12, 1);
        ctx.fillRect(11, 11, 2, 3);
        ctx.fillRect(15, 10, 2, 4);
        ctx.fillRect(19, 11, 2, 3);

        // Tea surface
        ctx.fillStyle = '#6b2d0e';
        ctx.fillRect(7, 8, 18, 2);
        ctx.fillStyle = '#9a471c';
        ctx.fillRect(8, 8, 12, 1);

        // Handle
        ctx.fillStyle = light;
        ctx.fillRect(26, 10, 4, 2);
        ctx.fillRect(28, 12, 2, 4);
        ctx.fillRect(26, 16, 4, 2);
        ctx.fillStyle = outline;
        ctx.fillRect(25, 9, 6, 1);
        ctx.fillRect(30, 10, 1, 8);
        ctx.fillRect(25, 18, 6, 1);

        // Delicate Steam (Top)
        ctx.fillStyle = '#ffe8d6';
        ctx.fillRect(10, 3, 1, 3);
        ctx.fillRect(11, 1, 1, 3);
        ctx.fillRect(17, 3, 1, 3);
        ctx.fillRect(18, 1, 1, 3);
      `)
    };
  });
  return defs;
}

function createCandleDef(flip = false) {
  const dripX = flip ? 5 : 9;
  return {
    w: 16, h: 32,
    draw: new Function('ctx', `
      const OUT = '#120508';
      const WAX = '#fdfbf7';
      const WAX_SHADE = '#cbd5e1';
      const WAX_BASE = '#94a3b8';
      const FLAME_CORE = '#ffffff';
      const FLAME_MID = '#fde047';
      const FLAME_TIP = '#ea580c';

      // Candlestick Body
      ctx.fillStyle = OUT;
      ctx.fillRect(5, 14, 6, 16);
      ctx.fillStyle = WAX;
      ctx.fillRect(6, 15, 4, 14);
      // Wax shading
      ctx.fillStyle = WAX_SHADE;
      ctx.fillRect(8, 15, 2, 14);
      // Molten drip
      ctx.fillStyle = WAX;
      ctx.fillRect(${dripX}, 18, 1, 4);

      // Base Holder
      ctx.fillStyle = WAX_BASE;
      ctx.fillRect(3, 29, 10, 2);
      ctx.fillStyle = OUT;
      ctx.fillRect(2, 30, 12, 1);

      // Wick
      ctx.fillStyle = OUT;
      ctx.fillRect(7, 12, 2, 3);

      // Flame
      ctx.fillStyle = FLAME_TIP;
      ctx.fillRect(6, 5, 4, 7);
      ctx.fillStyle = FLAME_MID;
      ctx.fillRect(7, 6, 2, 5);
      ctx.fillStyle = FLAME_CORE;
      ctx.fillRect(7, 8, 2, 2);
      // Top tip
      ctx.fillStyle = FLAME_TIP;
      ctx.fillRect(7, 4, 2, 1);
    `)
  };
}

// MAIN BUILD & AUDIT RUNNER
async function main() {
  console.log('🚀 Starting Top-Notch Pixel Art Generator & Quality Auditor...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const assetDataOutput = {};
  const auditReport = [];

  for (const [key, def] of Object.entries(SPRITE_DEFS)) {
    const { w, h, draw } = def;

    // Render on headless HTML5 canvas
    const drawScript = `
      (() => {
        const canvas = document.createElement('canvas');
        canvas.width = ${w};
        canvas.height = ${h};
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        (${draw.toString()})(ctx);
        const imgData = ctx.getImageData(0, 0, ${w}, ${h});
        return {
          dataUrl: canvas.toDataURL('image/png'),
          rawPixels: Array.from(imgData.data),
          width: ${w},
          height: ${h}
        };
      })()
    `;

    const res = await page.evaluate(drawScript);
    const base64Data = res.dataUrl;
    assetDataOutput[key] = base64Data;

    // Save PNG to public/assets/
    const base64Clean = base64Data.replace(/^data:image\/png;base64,/, '');
    const pngPath = path.join(PUBLIC_ASSETS_DIR, `${key}.png`);
    fs.writeFileSync(pngPath, Buffer.from(base64Clean, 'base64'));

    // Audit the generated sprite
    const imgDataObj = { data: new Uint8Array(res.rawPixels) };
    const audit = analyzeCanvasData(imgDataObj, w, h, key);
    auditReport.push(audit);
  }

  await browser.close();

  // Write new assetData.js
  let fileContent = `// Perfect 16-Bit Victorian Pixel Art Assets for Cup of Tea\n// Procedurally synthesized & verified by Automated Quality Auditor\nexport const ASSET_IMAGES = {\n`;
  for (const [key, dataUrl] of Object.entries(assetDataOutput)) {
    fileContent += `  "${key}": "${dataUrl}",\n`;
  }
  fileContent += `};\n`;
  fs.writeFileSync(ASSET_DATA_FILE, fileContent);

  // Print Audit Report Card
  console.log('\n================== 🏆 PIXEL ART QUALITY AUDIT REPORT ==================');
  console.table(auditReport.map(r => ({
    Sprite: r.spriteName,
    Size: r.dimensions,
    Colors: r.uniqueColors,
    Crispness: `${r.crispScore}%`,
    Palette: `${r.paletteScore}%`,
    Score: `${r.totalScore}/100`,
    Status: r.verdict
  })));

  const allPassed = auditReport.every(r => r.passed);
  console.log(`\nOverall Verdict: ${allPassed ? '✅ ALL SPRITES PASSED TOP-NOTCH CRITERIA' : '❌ SOME SPRITES FAILED'}`);
}

main().catch(err => {
  console.error('Error generating sprites:', err);
  process.exit(1);
});
