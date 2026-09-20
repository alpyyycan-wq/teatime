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

  // 2. THE 3 ACTION BUTTON ICONS (48x48 High-Fidelity Woodcut/Engravings)
  icon_drink: {
    w: 48, h: 48,
    draw: (ctx) => {
      const OUT = '#120508';
      const SKIN = '#f5eedb';
      const SKIN_SHADOW = '#b89e82';
      const HAT = '#26160f';
      const HAT_GOLD = '#d4af37';
      const SHIRT = '#ffffff';
      const CRAVAT = '#1a0c06';
      const RUBY = '#dc2626';
      const CUP_PORCELAIN = '#fdfbf7';
      const CUP_SHADE = '#cbd5e1';
      const CUP_GOLD = '#eab308';
      const TEA = '#9a3412';
      const TEA_HIGHLIGHT = '#f59e0b';
      const STEAM = '#fef3c7';

      // 1. Top Hat
      ctx.fillStyle = HAT;
      ctx.fillRect(10, 6, 14, 10);
      ctx.fillRect(6, 15, 22, 3);
      // Hat Gold Band
      ctx.fillStyle = HAT_GOLD;
      ctx.fillRect(10, 14, 14, 2);
      ctx.fillStyle = OUT;
      ctx.fillRect(9, 5, 16, 1);
      ctx.fillRect(9, 6, 1, 10);
      ctx.fillRect(24, 6, 1, 10);
      ctx.fillRect(5, 15, 1, 3);
      ctx.fillRect(28, 15, 1, 3);
      ctx.fillRect(6, 18, 22, 1);

      // 2. Aristocrat Face in Profile
      ctx.fillStyle = SKIN;
      ctx.fillRect(12, 18, 10, 11);
      ctx.fillRect(22, 21, 3, 3); // Nose
      ctx.fillRect(21, 26, 3, 2); // Chin
      ctx.fillStyle = SKIN_SHADOW;
      ctx.fillRect(12, 18, 3, 11);
      // Mustache
      ctx.fillStyle = HAT;
      ctx.fillRect(19, 24, 4, 2);
      // Eye
      ctx.fillStyle = OUT;
      ctx.fillRect(18, 20, 2, 2);
      // Ear
      ctx.fillStyle = SKIN_SHADOW;
      ctx.fillRect(11, 21, 2, 4);

      // 3. High Collar & Cravat
      ctx.fillStyle = SHIRT;
      ctx.fillRect(14, 29, 6, 6);
      ctx.fillRect(20, 28, 4, 3); // Wing collar tip
      ctx.fillStyle = CRAVAT;
      ctx.fillRect(15, 33, 6, 8);
      ctx.fillStyle = RUBY;
      ctx.fillRect(17, 34, 2, 2); // Ruby tiepin

      // 4. Gentleman's Hand lifting the cup
      ctx.fillStyle = SKIN;
      ctx.fillRect(25, 29, 5, 4);
      ctx.fillRect(27, 31, 7, 4);
      ctx.fillStyle = SKIN_SHADOW;
      ctx.fillRect(27, 34, 7, 2);

      // 5. Ornate Porcelain Teacup held at lips
      // Cup Saucer
      ctx.fillStyle = CUP_GOLD;
      ctx.fillRect(22, 33, 18, 2);
      ctx.fillStyle = CUP_PORCELAIN;
      ctx.fillRect(24, 32, 14, 2);
      ctx.fillStyle = OUT;
      ctx.fillRect(21, 34, 20, 1);

      // Cup Body
      ctx.fillStyle = CUP_PORCELAIN;
      ctx.fillRect(23, 22, 14, 10);
      ctx.fillRect(25, 21, 10, 2);
      // Shading on cup
      ctx.fillStyle = CUP_SHADE;
      ctx.fillRect(32, 22, 5, 10);
      // Gold Filigree band on cup
      ctx.fillStyle = CUP_GOLD;
      ctx.fillRect(23, 27, 14, 2);
      // Tea in cup tilted towards lips
      ctx.fillStyle = TEA;
      ctx.fillRect(24, 22, 8, 3);
      ctx.fillStyle = TEA_HIGHLIGHT;
      ctx.fillRect(25, 22, 4, 1);

      // Cup Handle
      ctx.fillStyle = CUP_GOLD;
      ctx.fillRect(37, 24, 4, 2);
      ctx.fillRect(39, 26, 2, 4);
      ctx.fillRect(37, 30, 4, 2);
      ctx.fillStyle = OUT;
      ctx.fillRect(37, 23, 5, 1);
      ctx.fillRect(41, 24, 1, 8);
      ctx.fillRect(37, 32, 5, 1);

      // Cup Outline
      ctx.fillStyle = OUT;
      ctx.fillRect(22, 21, 1, 11);
      ctx.fillRect(37, 21, 1, 11);
      ctx.fillRect(23, 20, 12, 1);

      // 6. Fragrant Golden Steam rising
      ctx.fillStyle = STEAM;
      ctx.fillRect(29, 15, 2, 4);
      ctx.fillRect(31, 12, 2, 4);
      ctx.fillRect(30, 9, 2, 3);
      ctx.fillRect(35, 16, 2, 3);
      ctx.fillRect(37, 13, 2, 4);
      ctx.fillRect(36, 10, 2, 3);
    }
  },

  icon_dump: {
    w: 48, h: 48,
    draw: (ctx) => {
      const OUT = '#120508';
      const CUP_BODY = '#fdfbf7';
      const CUP_SHADE = '#cbd5e1';
      const CUP_GOLD = '#d97706';
      const CUP_GOLD_LIGHT = '#fbbf24';
      const TEA = '#78350f';
      const TEA_BRIGHT = '#b45309';
      const TEA_GLINT = '#f59e0b';
      const SPLASH = '#fbbf24';

      // Tilted porcelain teacup (approx 45 deg)
      // Rim
      ctx.fillStyle = OUT;
      ctx.fillRect(14, 8, 16, 2);
      ctx.fillStyle = CUP_GOLD_LIGHT;
      ctx.fillRect(15, 9, 14, 1);

      // Cup body angled
      ctx.fillStyle = CUP_BODY;
      ctx.fillRect(14, 10, 16, 8);
      ctx.fillRect(16, 18, 14, 8);
      ctx.fillRect(19, 26, 10, 5);
      // Pedestal foot
      ctx.fillStyle = CUP_GOLD;
      ctx.fillRect(21, 31, 8, 2);

      // Shading on cup
      ctx.fillStyle = CUP_SHADE;
      ctx.fillRect(14, 12, 5, 6);
      ctx.fillRect(16, 18, 5, 8);
      ctx.fillRect(19, 26, 4, 5);

      // Gold filigree band
      ctx.fillStyle = CUP_GOLD;
      ctx.fillRect(16, 15, 14, 3);
      ctx.fillRect(18, 22, 12, 2);

      // Handle (Left side)
      ctx.fillStyle = CUP_GOLD;
      ctx.fillRect(8, 13, 6, 3);
      ctx.fillRect(7, 16, 3, 8);
      ctx.fillRect(9, 24, 7, 3);
      ctx.fillStyle = OUT;
      ctx.fillRect(7, 12, 8, 1);
      ctx.fillRect(6, 13, 1, 12);
      ctx.fillRect(7, 26, 10, 1);

      // Gushing Tea Stream pouring downwards from rim
      ctx.fillStyle = TEA;
      ctx.fillRect(28, 11, 5, 5);
      ctx.fillRect(31, 15, 6, 7);
      ctx.fillRect(33, 22, 6, 10);
      ctx.fillRect(34, 32, 5, 11);
      // Bright tea stream core
      ctx.fillStyle = TEA_BRIGHT;
      ctx.fillRect(29, 12, 3, 4);
      ctx.fillRect(32, 16, 4, 6);
      ctx.fillRect(34, 23, 4, 9);
      ctx.fillRect(35, 33, 3, 10);
      // Specular tea glint
      ctx.fillStyle = TEA_GLINT;
      ctx.fillRect(33, 17, 2, 4);
      ctx.fillRect(35, 24, 2, 6);
      ctx.fillRect(36, 34, 1, 7);

      // Flying Splash Droplets
      ctx.fillStyle = SPLASH;
      ctx.fillRect(29, 36, 3, 3);
      ctx.fillRect(41, 28, 3, 3);
      ctx.fillRect(42, 36, 3, 3);
      ctx.fillRect(39, 43, 3, 3);
      ctx.fillRect(32, 44, 3, 2);

      // Outlines
      ctx.fillStyle = OUT;
      ctx.fillRect(13, 9, 1, 10);
      ctx.fillRect(15, 18, 1, 9);
      ctx.fillRect(18, 26, 1, 6);
      ctx.fillRect(20, 32, 9, 1);
      // Stream outlines
      ctx.fillRect(30, 10, 1, 5);
      ctx.fillRect(33, 15, 1, 7);
      ctx.fillRect(39, 22, 1, 11);
      ctx.fillRect(39, 33, 1, 11);
    }
  },

  icon_swap_deck: {
    w: 48, h: 48,
    draw: (ctx) => {
      const OUT = '#120508';
      const GOLD_CUP = '#f59e0b';
      const GOLD_CUP_LIGHT = '#fde047';
      const BLUE_CUP = '#2563eb';
      const BLUE_CUP_LIGHT = '#93c5fd';
      const ARROW_GOLD = '#ffd700';
      const ARROW_SHADOW = '#92400e';
      const TEA = '#78350f';

      // Left Cup (Gold / Ivory)
      // Saucer
      ctx.fillStyle = GOLD_CUP;
      ctx.fillRect(5, 36, 16, 2);
      ctx.fillStyle = OUT;
      ctx.fillRect(4, 37, 18, 1);
      // Body
      ctx.fillStyle = GOLD_CUP;
      ctx.fillRect(7, 24, 12, 11);
      ctx.fillStyle = GOLD_CUP_LIGHT;
      ctx.fillRect(7, 24, 3, 11);
      // Tea
      ctx.fillStyle = TEA;
      ctx.fillRect(8, 24, 10, 2);
      // Handle
      ctx.fillStyle = GOLD_CUP_LIGHT;
      ctx.fillRect(4, 26, 3, 2);
      ctx.fillRect(3, 28, 2, 4);
      ctx.fillRect(4, 32, 3, 2);
      // Outline
      ctx.fillStyle = OUT;
      ctx.fillRect(6, 23, 14, 1);
      ctx.fillRect(6, 24, 1, 12);
      ctx.fillRect(19, 24, 1, 12);

      // Right Cup (Sapphire / Silver)
      // Saucer
      ctx.fillStyle = BLUE_CUP;
      ctx.fillRect(27, 22, 16, 2);
      ctx.fillStyle = OUT;
      ctx.fillRect(26, 23, 18, 1);
      // Body
      ctx.fillStyle = BLUE_CUP;
      ctx.fillRect(29, 10, 12, 11);
      ctx.fillStyle = BLUE_CUP_LIGHT;
      ctx.fillRect(29, 10, 3, 11);
      // Tea
      ctx.fillStyle = TEA;
      ctx.fillRect(30, 10, 10, 2);
      // Handle
      ctx.fillStyle = BLUE_CUP_LIGHT;
      ctx.fillRect(41, 12, 3, 2);
      ctx.fillRect(43, 14, 2, 4);
      ctx.fillRect(41, 18, 3, 2);
      // Outline
      ctx.fillStyle = OUT;
      ctx.fillRect(28, 9, 14, 1);
      ctx.fillRect(28, 10, 1, 12);
      ctx.fillRect(41, 10, 1, 12);

      // Top Clockwise Circular Arrow (Sweeping from left to right)
      ctx.fillStyle = ARROW_GOLD;
      ctx.fillRect(14, 7, 16, 3);
      ctx.fillRect(28, 8, 4, 5);
      // Arrowhead pointing right
      ctx.fillRect(30, 4, 3, 9);
      ctx.fillRect(33, 6, 2, 5);
      ctx.fillRect(35, 7, 2, 3);
      ctx.fillStyle = ARROW_SHADOW;
      ctx.fillRect(14, 6, 16, 1);
      ctx.fillRect(14, 10, 14, 1);

      // Bottom Clockwise Circular Arrow (Sweeping from right to left)
      ctx.fillStyle = ARROW_GOLD;
      ctx.fillRect(18, 39, 16, 3);
      ctx.fillRect(16, 37, 4, 4);
      // Arrowhead pointing left
      ctx.fillRect(15, 35, 3, 9);
      ctx.fillRect(13, 37, 2, 5);
      ctx.fillRect(11, 38, 2, 3);
      ctx.fillStyle = ARROW_SHADOW;
      ctx.fillRect(18, 38, 16, 1);
      ctx.fillRect(20, 42, 14, 1);
    }
  },

  // 3. INVENTORY BADGES (24x24 Detailed Victorian Apothecary)
  inv_pill: {
    w: 24, h: 24,
    draw: (ctx) => {
      const OUT = '#120508';
      const GLASS = '#f8fafc';
      const GLASS_SHADE = '#94a3b8';
      const CORK = '#854d0e';
      const RED = '#dc2626';
      const RED_LIGHT = '#ef4444';
      const WHITE = '#ffffff';

      // Cork Stopper
      ctx.fillStyle = CORK;
      ctx.fillRect(9, 2, 6, 3);
      ctx.fillStyle = OUT;
      ctx.fillRect(8, 1, 8, 1);
      ctx.fillRect(8, 2, 1, 3);
      ctx.fillRect(15, 2, 1, 3);

      // Glass Bottle Collar & Body
      ctx.fillStyle = GLASS_SHADE;
      ctx.fillRect(7, 5, 10, 2);
      ctx.fillRect(5, 7, 14, 14);
      // Glass Interior
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(6, 8, 12, 12);
      // Glass Specular Highlight
      ctx.fillStyle = GLASS;
      ctx.fillRect(6, 8, 2, 12);
      ctx.fillRect(7, 8, 2, 3);

      // Antidote Capsule (Floating inside)
      // Red Upper Half
      ctx.fillStyle = RED;
      ctx.fillRect(9, 10, 6, 4);
      ctx.fillStyle = RED_LIGHT;
      ctx.fillRect(10, 10, 2, 4);
      // White Lower Half
      ctx.fillStyle = WHITE;
      ctx.fillRect(9, 14, 6, 4);
      // Cross Symbol
      ctx.fillStyle = WHITE;
      ctx.fillRect(11, 11, 2, 2);
      // Capsule Divider
      ctx.fillStyle = OUT;
      ctx.fillRect(9, 14, 6, 1);

      // Outer Bottle Outline
      ctx.fillStyle = OUT;
      ctx.fillRect(4, 7, 1, 14);
      ctx.fillRect(19, 7, 1, 14);
      ctx.fillRect(5, 21, 14, 1);
    }
  },

  inv_cyanide: {
    w: 24, h: 24,
    draw: (ctx) => {
      const OUT = '#120508';
      const CORK = '#854d0e';
      const AMETHYST = '#581c87';
      const AMETHYST_DARK = '#2e1065';
      const AMETHYST_LIGHT = '#c084fc';
      const POISON = '#7e22ce';
      const SKULL_GOLD = '#fef08a';
      const FUME = '#e9d5ff';

      // Toxic Fume rising from cork
      ctx.fillStyle = FUME;
      ctx.fillRect(11, 0, 2, 2);
      ctx.fillRect(13, 1, 2, 2);

      // Cork Stopper
      ctx.fillStyle = CORK;
      ctx.fillRect(9, 3, 6, 3);
      ctx.fillStyle = OUT;
      ctx.fillRect(8, 2, 8, 1);
      ctx.fillRect(8, 3, 1, 3);
      ctx.fillRect(15, 3, 1, 3);

      // Hexagonal Crystal Bottle Body
      ctx.fillStyle = AMETHYST_DARK;
      ctx.fillRect(7, 6, 10, 2);
      ctx.fillRect(5, 8, 14, 13);
      // Poison Liquid
      ctx.fillStyle = POISON;
      ctx.fillRect(6, 12, 12, 8);
      // Crystal Facet Highlight
      ctx.fillStyle = AMETHYST_LIGHT;
      ctx.fillRect(6, 8, 2, 12);
      ctx.fillRect(8, 8, 2, 3);

      // Brass Skull Emblem Stamped on Glass
      ctx.fillStyle = SKULL_GOLD;
      ctx.fillRect(10, 13, 4, 3); // Cranium
      ctx.fillRect(11, 16, 2, 2); // Jaw
      ctx.fillRect(9, 17, 6, 1); // Crossbones
      ctx.fillStyle = OUT;
      ctx.fillRect(10, 14, 1, 1); // Eye 1
      ctx.fillRect(12, 14, 1, 1); // Eye 2

      // Outer Outline
      ctx.fillStyle = OUT;
      ctx.fillRect(4, 8, 1, 13);
      ctx.fillRect(19, 8, 1, 13);
      ctx.fillRect(5, 21, 14, 1);
    }
  },

  inv_swap: {
    w: 24, h: 24,
    draw: (ctx) => {
      const OUT = '#120508';
      const BRASS = '#ca8a04';
      const BRASS_LIGHT = '#fde047';
      const BRASS_DARK = '#78350f';
      const DIAL = '#fef3c7';

      // Top Watch Winder Loop
      ctx.fillStyle = BRASS_LIGHT;
      ctx.fillRect(10, 1, 4, 2);
      ctx.fillStyle = OUT;
      ctx.fillRect(9, 0, 6, 1);
      ctx.fillRect(9, 1, 1, 3);
      ctx.fillRect(14, 1, 1, 3);

      // Circular Brass Pocket Watch Casing
      ctx.fillStyle = BRASS_DARK;
      ctx.fillRect(6, 4, 12, 16);
      ctx.fillRect(4, 6, 16, 12);
      ctx.fillStyle = BRASS;
      ctx.fillRect(7, 5, 10, 14);
      ctx.fillRect(5, 7, 14, 10);
      // Gilded Rim Highlight
      ctx.fillStyle = BRASS_LIGHT;
      ctx.fillRect(7, 5, 10, 2);
      ctx.fillRect(5, 7, 2, 10);

      // Parchment Watch Face
      ctx.fillStyle = DIAL;
      ctx.fillRect(8, 7, 8, 10);
      ctx.fillRect(7, 8, 10, 8);

      // Clockwork Hands / Twin Exchange Arrows
      ctx.fillStyle = OUT;
      ctx.fillRect(11, 11, 2, 2); // Center pinion
      // Arrow 1 (Pointing 2 o'clock)
      ctx.fillStyle = BRASS_DARK;
      ctx.fillRect(12, 9, 3, 2);
      ctx.fillRect(14, 8, 2, 2);
      // Arrow 2 (Pointing 8 o'clock)
      ctx.fillRect(9, 13, 3, 2);
      ctx.fillRect(8, 14, 2, 2);

      // Outer Rim Outline
      ctx.fillStyle = OUT;
      ctx.fillRect(5, 4, 14, 1);
      ctx.fillRect(3, 6, 1, 12);
      ctx.fillRect(20, 6, 1, 12);
      ctx.fillRect(5, 19, 14, 1);
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
    gold: {
      outline: '#140a04',
      shadow: '#784606',
      mid: '#c79628',
      light: '#f7d070',
      glint: '#fffbeb',
      filigree: '#fef08a',
      goldTrim: '#ffd700',
      teaDark: '#451a03',
      teaLight: '#9a3412'
    },
    blue: {
      outline: '#060d17',
      shadow: '#143360',
      mid: '#2563eb',
      light: '#93c5fd',
      glint: '#eff6ff',
      filigree: '#fde047',
      goldTrim: '#ffd700',
      teaDark: '#451a03',
      teaLight: '#9a3412'
    },
    crimson: {
      outline: '#140508',
      shadow: '#5e0d1b',
      mid: '#b91c1c',
      light: '#f87171',
      glint: '#fff1f2',
      filigree: '#fde047',
      goldTrim: '#ffd700',
      teaDark: '#451a03',
      teaLight: '#9a3412'
    },
    green: {
      outline: '#04140b',
      shadow: '#0d4a25',
      mid: '#15803d',
      light: '#4ade80',
      glint: '#f0fdf4',
      filigree: '#fde047',
      goldTrim: '#ffd700',
      teaDark: '#451a03',
      teaLight: '#9a3412'
    },
    orange: {
      outline: '#140804',
      shadow: '#7a2806',
      mid: '#ea580c',
      light: '#fb923c',
      glint: '#fff7ed',
      filigree: '#fef08a',
      goldTrim: '#ffd700',
      teaDark: '#451a03',
      teaLight: '#9a3412'
    },
    silver: {
      outline: '#0a0c10',
      shadow: '#334155',
      mid: '#64748b',
      light: '#cbd5e1',
      glint: '#ffffff',
      filigree: '#fde047',
      goldTrim: '#ffd700',
      teaDark: '#451a03',
      teaLight: '#9a3412'
    },
    copper: {
      outline: '#140905',
      shadow: '#57220e',
      mid: '#b45309',
      light: '#f59e0b',
      glint: '#fef3c7',
      filigree: '#fef08a',
      goldTrim: '#ffd700',
      teaDark: '#451a03',
      teaLight: '#9a3412'
    }
  };

  const defs = {};
  Object.keys(PALETTES).forEach(colorKey => {
    const pal = PALETTES[colorKey];
    defs[`cup_${colorKey}`] = {
      w: 36, h: 28,
      draw: new Function('ctx', `
        const outline = '${pal.outline}';
        const shadow = '${pal.shadow}';
        const mid = '${pal.mid}';
        const light = '${pal.light}';
        const glint = '${pal.glint}';
        const filigree = '${pal.filigree}';
        const goldTrim = '${pal.goldTrim}';
        const teaDark = '${pal.teaDark}';
        const teaLight = '${pal.teaLight}';

        // 1. Delicate Steam Rising Above Cup
        ctx.fillStyle = '#ffe4b5';
        ctx.fillRect(13, 1, 2, 1);
        ctx.fillRect(12, 2, 2, 1);
        ctx.fillRect(11, 3, 2, 2);
        ctx.fillRect(10, 5, 2, 2);

        ctx.fillRect(21, 1, 2, 1);
        ctx.fillRect(20, 2, 2, 1);
        ctx.fillRect(19, 3, 2, 2);
        ctx.fillRect(18, 5, 2, 2);

        // 2. Saucer Base and Pedestal Shadow
        // Saucer bottom silhouette
        ctx.fillStyle = outline;
        ctx.fillRect(7, 26, 22, 1);
        ctx.fillRect(4, 25, 28, 1);
        ctx.fillRect(2, 24, 32, 1);
        ctx.fillRect(3, 23, 30, 1);

        // Saucer rim & plate body
        ctx.fillStyle = shadow;
        ctx.fillRect(4, 25, 28, 1);
        ctx.fillStyle = mid;
        ctx.fillRect(3, 24, 30, 1);
        ctx.fillStyle = light;
        ctx.fillRect(4, 24, 10, 1);
        ctx.fillStyle = glint;
        ctx.fillRect(6, 24, 4, 1);
        ctx.fillStyle = goldTrim;
        ctx.fillRect(5, 25, 26, 1);

        // Pedestal Foot
        ctx.fillStyle = outline;
        ctx.fillRect(11, 21, 14, 2);
        ctx.fillStyle = goldTrim;
        ctx.fillRect(12, 22, 12, 1);
        ctx.fillStyle = light;
        ctx.fillRect(12, 21, 4, 1);
        ctx.fillStyle = shadow;
        ctx.fillRect(19, 21, 5, 1);

        // 3. Cup Body - Curved Silhouette (Row-by-Row Tonal Hierarchy)
        // Row 20 (narrow waist above pedestal)
        ctx.fillStyle = outline;
        ctx.fillRect(11, 20, 14, 1);
        ctx.fillStyle = goldTrim;
        ctx.fillRect(12, 20, 12, 1);

        // Row 19 (curving outwards)
        ctx.fillStyle = outline;
        ctx.fillRect(9, 19, 18, 1);
        ctx.fillStyle = light;
        ctx.fillRect(10, 19, 4, 1);
        ctx.fillStyle = mid;
        ctx.fillRect(14, 19, 7, 1);
        ctx.fillStyle = shadow;
        ctx.fillRect(21, 19, 5, 1);

        // Row 18
        ctx.fillStyle = outline;
        ctx.fillRect(8, 18, 20, 1);
        ctx.fillStyle = light;
        ctx.fillRect(9, 18, 4, 1);
        ctx.fillStyle = mid;
        ctx.fillRect(13, 18, 8, 1);
        ctx.fillStyle = shadow;
        ctx.fillRect(21, 18, 6, 1);

        // Row 17
        ctx.fillStyle = outline;
        ctx.fillRect(7, 17, 22, 1);
        ctx.fillStyle = light;
        ctx.fillRect(8, 17, 4, 1);
        ctx.fillStyle = mid;
        ctx.fillRect(12, 17, 9, 1);
        ctx.fillStyle = shadow;
        ctx.fillRect(21, 17, 7, 1);

        // Row 16
        ctx.fillStyle = outline;
        ctx.fillRect(7, 16, 22, 1);
        ctx.fillStyle = light;
        ctx.fillRect(8, 16, 4, 1);
        ctx.fillStyle = mid;
        ctx.fillRect(12, 16, 10, 1);
        ctx.fillStyle = shadow;
        ctx.fillRect(22, 16, 6, 1);
        // Filigree emblem center
        ctx.fillStyle = goldTrim;
        ctx.fillRect(17, 16, 2, 1);

        // Row 15
        ctx.fillStyle = outline;
        ctx.fillRect(6, 15, 24, 1);
        ctx.fillStyle = light;
        ctx.fillRect(7, 15, 5, 1);
        ctx.fillStyle = mid;
        ctx.fillRect(12, 15, 10, 1);
        ctx.fillStyle = shadow;
        ctx.fillRect(22, 15, 7, 1);
        // Filigree emblem wing
        ctx.fillStyle = filigree;
        ctx.fillRect(16, 15, 4, 1);

        // Row 14
        ctx.fillStyle = outline;
        ctx.fillRect(6, 14, 24, 1);
        ctx.fillStyle = glint;
        ctx.fillRect(8, 14, 2, 1);
        ctx.fillStyle = light;
        ctx.fillRect(7, 14, 4, 1);
        ctx.fillStyle = mid;
        ctx.fillRect(11, 14, 12, 1);
        ctx.fillStyle = shadow;
        ctx.fillRect(23, 14, 6, 1);
        // Filigree crown
        ctx.fillStyle = filigree;
        ctx.fillRect(15, 14, 6, 1);
        ctx.fillStyle = goldTrim;
        ctx.fillRect(17, 14, 2, 1);

        // Row 13
        ctx.fillStyle = outline;
        ctx.fillRect(5, 13, 26, 1);
        ctx.fillStyle = glint;
        ctx.fillRect(7, 13, 2, 1);
        ctx.fillStyle = light;
        ctx.fillRect(6, 13, 5, 1);
        ctx.fillStyle = mid;
        ctx.fillRect(11, 13, 12, 1);
        ctx.fillStyle = shadow;
        ctx.fillRect(23, 13, 7, 1);
        ctx.fillStyle = filigree;
        ctx.fillRect(16, 13, 4, 1);

        // Row 12
        ctx.fillStyle = outline;
        ctx.fillRect(5, 12, 26, 1);
        ctx.fillStyle = glint;
        ctx.fillRect(7, 12, 2, 1);
        ctx.fillStyle = light;
        ctx.fillRect(6, 12, 5, 1);
        ctx.fillStyle = mid;
        ctx.fillRect(11, 12, 12, 1);
        ctx.fillStyle = shadow;
        ctx.fillRect(23, 12, 7, 1);

        // Row 11
        ctx.fillStyle = outline;
        ctx.fillRect(5, 11, 26, 1);
        ctx.fillStyle = light;
        ctx.fillRect(6, 11, 5, 1);
        ctx.fillStyle = mid;
        ctx.fillRect(11, 11, 12, 1);
        ctx.fillStyle = shadow;
        ctx.fillRect(23, 11, 7, 1);

        // Row 10 (Flared Rim Band)
        ctx.fillStyle = outline;
        ctx.fillRect(4, 10, 28, 1);
        ctx.fillStyle = goldTrim;
        ctx.fillRect(5, 10, 26, 1);

        // Row 9 (Rim opening and Tea Surface)
        ctx.fillStyle = outline;
        ctx.fillRect(4, 9, 28, 1);
        ctx.fillStyle = teaDark;
        ctx.fillRect(6, 9, 24, 1);
        ctx.fillStyle = teaLight;
        ctx.fillRect(8, 9, 12, 1);
        ctx.fillStyle = goldTrim;
        ctx.fillRect(5, 9, 1, 1);
        ctx.fillRect(30, 9, 1, 1);

        // Row 8 (Rim Top Edge)
        ctx.fillStyle = outline;
        ctx.fillRect(5, 8, 26, 1);
        ctx.fillStyle = goldTrim;
        ctx.fillRect(6, 8, 24, 1);

        // Row 7 (Rim Top Lip Silhouette)
        ctx.fillStyle = outline;
        ctx.fillRect(6, 7, 24, 1);

        // 4. Ornate Gilded C-Loop Handle on the Right
        // Outer loop outline
        ctx.fillStyle = outline;
        ctx.fillRect(29, 10, 4, 1);
        ctx.fillRect(32, 11, 3, 1);
        ctx.fillRect(34, 12, 2, 5);
        ctx.fillRect(33, 17, 2, 1);
        ctx.fillRect(31, 18, 3, 1);
        ctx.fillRect(27, 19, 4, 1);

        // Inner loop outline
        ctx.fillRect(29, 12, 3, 1);
        ctx.fillRect(31, 13, 2, 1);
        ctx.fillRect(32, 14, 1, 1);
        ctx.fillRect(31, 15, 2, 1);
        ctx.fillRect(29, 16, 3, 1);
        ctx.fillRect(27, 17, 3, 1);

        // Gold and specular fill on the handle
        ctx.fillStyle = goldTrim;
        ctx.fillRect(29, 11, 3, 1);
        ctx.fillStyle = glint;
        ctx.fillRect(32, 12, 2, 1);
        ctx.fillStyle = goldTrim;
        ctx.fillRect(33, 13, 1, 2);
        ctx.fillStyle = shadow;
        ctx.fillRect(33, 15, 1, 1);
        ctx.fillRect(32, 16, 2, 1);
        ctx.fillRect(30, 17, 3, 1);
        ctx.fillRect(28, 18, 3, 1);
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
