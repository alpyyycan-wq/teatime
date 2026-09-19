import fs from 'fs';

const r = (x, y, w, h, fill, opacity) => {
  return `  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${opacity !== undefined ? ` opacity="${opacity}"` : ''}/>\n`;
};

// 1. CANDLE SPRITES
export function generateCandleSvg(variant = 'tall') {
  const isTall = variant === 'tall';
  let out = `<svg class="pixel-candle-svg ${variant}" viewBox="0 0 18 42" width="100%" height="100%" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">\n`;
  
  // Brass Base Pedestal
  out += r(2, 40, 14, 2, '#201206');
  out += r(1, 38, 16, 2, '#422808');
  out += r(3, 36, 12, 2, '#7a510c');
  out += r(4, 34, 10, 2, '#b3821a');
  out += r(5, 32, 8, 2, '#ffd700');
  out += r(6, 30, 6, 2, '#7a510c');
  out += r(7, 30, 4, 1, '#ffd700');

  // Candle shaft
  const shaftStartY = isTall ? 14 : 22;
  const shaftHeight = 30 - shaftStartY;

  out += r(6, shaftStartY, 1, shaftHeight, '#2a180b');
  out += r(11, shaftStartY, 1, shaftHeight, '#2a180b');
  out += r(7, shaftStartY, 1, shaftHeight, '#ffffff');
  out += r(8, shaftStartY, 2, shaftHeight, '#fbf5e8');
  out += r(10, shaftStartY, 1, shaftHeight, '#cfbeaa');

  if (isTall) {
    out += r(5, 17, 2, 4, '#fbf5e8');
    out += r(5, 17, 1, 3, '#ffffff');
    out += r(5, 21, 2, 1, '#2a180b');
    out += r(11, 22, 2, 5, '#cfbeaa');
    out += r(11, 27, 2, 1, '#2a180b');
  } else {
    out += r(5, 24, 2, 3, '#fbf5e8');
    out += r(5, 27, 2, 1, '#2a180b');
  }

  out += r(6, shaftStartY - 1, 6, 1, '#2a180b');
  out += r(7, shaftStartY - 2, 4, 2, '#ffffff');
  out += r(6, shaftStartY - 1, 2, 1, '#ffffff');
  out += r(10, shaftStartY - 1, 2, 1, '#cfbeaa');

  const wickY = isTall ? 9 : 17;
  out += r(8, wickY + 1, 2, 3, '#1c0f08');
  out += r(8, wickY, 2, 1, '#ff3700');

  const flameY = isTall ? 0 : 8;
  out += `  <g class="pixel-flame-anim">\n`;
  out += r(8, flameY + 1, 2, 2, '#ff5500');
  out += r(7, flameY + 3, 4, 2, '#ff7700');
  out += r(6, flameY + 5, 6, 3, '#ff9900');
  out += r(7, flameY + 8, 4, 2, '#ff4400');
  out += r(7, flameY + 3, 4, 2, '#ffee33');
  out += r(6, flameY + 5, 6, 2, '#ffcc00');
  out += r(7, flameY + 6, 4, 2, '#ffee44');
  out += r(8, flameY + 4, 2, 3, '#ffffff');
  out += `  </g>\n`;

  out += `</svg>`;
  return out;
}

// 2. FILIGREE CORNER
export function generateFiligreeCornerSvg() {
  let out = `<svg class="pixel-filigree-corner" viewBox="0 0 24 24" width="100%" height="100%" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">\n`;
  out += r(0, 0, 24, 2, '#ffd700');
  out += r(0, 2, 24, 2, '#c79628');
  out += r(0, 4, 24, 1, '#694c0b');

  out += r(0, 0, 2, 24, '#ffd700');
  out += r(2, 0, 2, 24, '#c79628');
  out += r(4, 0, 1, 24, '#694c0b');

  out += r(0, 0, 6, 6, '#ffd700');
  out += r(1, 1, 4, 4, '#fff099');
  out += r(2, 2, 2, 2, '#ffffff');

  out += r(6, 4, 6, 2, '#ffd700');
  out += r(10, 2, 4, 3, '#c79628');
  out += r(13, 1, 4, 2, '#ffd700');
  out += r(16, 2, 3, 3, '#c79628');
  out += r(18, 4, 2, 3, '#ffd700');
  out += r(17, 6, 2, 2, '#694c0b');

  out += r(4, 6, 2, 6, '#ffd700');
  out += r(2, 10, 3, 4, '#c79628');
  out += r(1, 13, 2, 4, '#ffd700');
  out += r(2, 16, 3, 3, '#c79628');
  out += r(4, 18, 3, 2, '#ffd700');
  out += r(6, 17, 2, 2, '#694c0b');

  out += r(7, 7, 6, 6, '#2a180b');
  out += r(8, 8, 4, 4, '#c79628');
  out += r(9, 7, 2, 6, '#ffd700');
  out += r(7, 9, 6, 2, '#ffd700');
  out += r(9, 9, 2, 2, '#ffffff');

  out += r(11, 11, 3, 3, '#ffd700');
  out += r(13, 13, 2, 2, '#c79628');
  out += r(14, 15, 2, 2, '#694c0b');

  out += `</svg>`;
  return out;
}

// 3. MASTERPIECE SHATTERED TEACUP SCENE (Panel 3 of reference)
export function generateShatteredCupSvg() {
  // viewBox: 0 0 160 110 - Tilted Porcelain Teacup lying on side matching reference Panel 3
  let out = `<svg class="shattered-cup-svg" viewBox="0 0 160 110" width="100%" height="100%" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">\n`;

  // Deep Purple Velvet Tablecloth Base
  out += r(10, 60, 140, 46, '#180422');
  out += r(16, 56, 128, 50, '#260a34');
  out += r(24, 52, 112, 54, '#38104a');

  // Gold Trim / Fringe along table rim
  out += r(14, 104, 132, 2, '#c79628');
  out += r(18, 106, 124, 2, '#ffd700');
  out += r(22, 108, 116, 1, '#694c0b');

  // Cast Shadows on Tablecloth under cup and puddle
  out += r(30, 72, 100, 24, '#12021a', 0.85);

  // Spilled Tea Pool (Rich Reddish-Amber with Stepped Tonal Bands)
  out += r(28, 76, 52, 20, '#381106');
  out += r(32, 74, 46, 20, '#5a1f0d');
  out += r(36, 78, 38, 14, '#8c3518');
  out += r(40, 80, 28, 10, '#b84e26');
  out += r(44, 82, 18, 5, '#e06b38'); // tea sheen highlight

  // Cyanide Poison Splashes / Floating Droplets in Spilled Tea
  out += r(38, 80, 4, 3, '#00e676');
  out += r(39, 81, 2, 1, '#76ff03');
  out += r(52, 86, 3, 2, '#39ff14');
  out += r(30, 84, 3, 2, '#39ff14');
  out += r(60, 82, 2, 2, '#76ff03');

  // --- TILTED PORCELAIN TEACUP (Curved Stepped Body resting on its side) ---
  // Cup mouth is on the left/bottom-left; base is up-right; handle is on upper-right
  // Center of cup roughly at x=90, y=70

  // Outer Dark Contour of the Tilted Cup
  // Rim contour
  out += r(56, 68, 6, 20, '#160b1c');
  out += r(62, 84, 12, 6, '#160b1c');
  // Bottom belly contour (resting on table)
  out += r(74, 86, 28, 6, '#160b1c');
  out += r(102, 82, 16, 6, '#160b1c');
  // Top belly contour (facing upward)
  out += r(64, 52, 24, 6, '#160b1c');
  out += r(88, 48, 22, 6, '#160b1c');
  // Cup base contour (tilted up-right)
  out += r(110, 54, 12, 26, '#160b1c');

  // Porcelain Body Fill (Ivory Base #f6f0e4)
  out += r(62, 58, 48, 28, '#f6f0e4');
  out += r(74, 54, 36, 32, '#f6f0e4');
  out += r(88, 52, 22, 32, '#f6f0e4');

  // Stepped Porcelain Highlights (Upper lit surface)
  out += r(66, 56, 32, 4, '#ffffff');
  out += r(72, 60, 24, 4, '#ffffff');

  // Stepped Porcelain Shadows (Underbelly & right side)
  out += r(76, 76, 32, 10, '#d9cfbe');
  out += r(92, 70, 18, 14, '#b0a390');
  out += r(102, 60, 8, 20, '#857866');

  // Victorian Blue Decorative Band across tilted body
  out += r(70, 64, 38, 6, '#2d5a88');
  out += r(72, 64, 18, 2, '#5085ba'); // blue highlight
  out += r(94, 66, 14, 4, '#1c3d5e'); // blue shadow

  // Gold Trim Bands (Flanking Blue Band and at Rim)
  out += r(68, 62, 40, 2, '#ffd700');
  out += r(72, 70, 36, 2, '#ffd700');
  out += r(96, 62, 12, 2, '#c79628');
  out += r(98, 70, 10, 2, '#c79628');

  // Gold Rim along intact portion of cup mouth
  out += r(58, 72, 4, 14, '#ffd700');
  out += r(62, 82, 10, 3, '#ffd700');
  out += r(60, 74, 2, 10, '#ffffff'); // gold glint

  // Cup Pedestal Base Trim (Gold ring on base)
  out += r(114, 58, 4, 18, '#ffd700');
  out += r(112, 60, 2, 14, '#c79628');

  // Golden Heart Emblem (On visible flank of the cup body)
  out += r(84, 65, 3, 2, '#ffd700');
  out += r(89, 65, 3, 2, '#ffd700');
  out += r(83, 67, 10, 3, '#ffd700');
  out += r(84, 70, 8, 2, '#c79628');
  out += r(86, 72, 4, 2, '#855c0c');
  out += r(87, 74, 2, 1, '#4a3204');
  out += r(85, 66, 2, 2, '#ffffff'); // Heart specular glint

  // Porcelain Handle (Right upper loop)
  out += r(106, 50, 16, 4, '#160b1c');
  out += r(120, 52, 4, 16, '#160b1c');
  out += r(112, 66, 12, 4, '#160b1c');
  out += r(108, 52, 12, 2, '#ffd700');
  out += r(118, 54, 3, 12, '#ffd700');
  out += r(110, 65, 10, 2, '#c79628');
  out += r(108, 54, 10, 11, '#f6f0e4');
  out += r(110, 56, 7, 7, '#260a34'); // handle hole through to velvet background

  // Jagged Fracture & Break (Top-left section of cup rim missing!)
  out += r(52, 60, 10, 12, '#160b1c');
  out += r(54, 56, 8, 8, '#160b1c');
  out += r(58, 62, 6, 8, '#381106'); // dark inner tea cavity revealed

  // Jagged Crack Lines branching across the ivory porcelain
  out += r(66, 58, 2, 6, '#160b1c');
  out += r(68, 64, 2, 8, '#160b1c');
  out += r(70, 72, 3, 6, '#160b1c');
  out += r(74, 62, 4, 2, '#160b1c'); // hairline branch

  // --- DETACHED SHARP PORCELAIN SHARD (Lying to the left on the cloth) ---
  out += r(20, 72, 14, 14, '#12021a', 0.8); // shard shadow
  out += r(22, 70, 12, 2, '#ffd700'); // gold rim fragment
  out += r(22, 72, 10, 3, '#ffffff'); // porcelain shard face highlight
  out += r(24, 75, 7, 4, '#f6f0e4');
  out += r(26, 79, 4, 3, '#d9cfbe');
  out += r(21, 70, 2, 12, '#160b1c'); // left sharp fracture edge
  out += r(33, 71, 2, 6, '#160b1c'); // right edge
  out += r(28, 82, 3, 2, '#160b1c'); // sharp tip point

  // Helper for 3D Isometric Stepped Sugar Cubes
  const sugarCube = (cx, cy) => {
    let s = '';
    s += r(cx + 1, cy + 6, 8, 2, '#12021a', 0.8);
    // Dark outline
    s += r(cx + 2, cy, 4, 1, '#1f1624');
    s += r(cx + 1, cy + 1, 1, 5, '#1f1624');
    s += r(cx + 7, cy + 1, 1, 5, '#1f1624');
    s += r(cx + 2, cy + 6, 5, 1, '#1f1624');
    // Top face (bright white)
    s += r(cx + 2, cy + 1, 4, 1, '#ffffff');
    s += r(cx + 1, cy + 2, 6, 1, '#ffffff');
    // Left face (light grey)
    s += r(cx + 1, cy + 3, 3, 3, '#ebebeb');
    // Right face (shadow grey)
    s += r(cx + 4, cy + 3, 3, 3, '#a8a8a8');
    // Sparkle corner
    s += r(cx + 2, cy + 1, 1, 1, '#ffffff');
    return s;
  };

  // 4 Scattered Sugar Cubes
  out += sugarCube(18, 86);
  out += sugarCube(48, 92);
  out += sugarCube(80, 92);
  out += sugarCube(126, 82);

  // Sugar crystal crumbs
  out += r(29, 89, 1, 1, '#ffffff');
  out += r(58, 95, 1, 1, '#ffffff');
  out += r(75, 91, 1, 1, '#ffffff');
  out += r(120, 86, 1, 1, '#ffffff');
  out += r(136, 84, 1, 1, '#ffffff');

  out += `</svg>`;
  return out;
}

// 4. MASTERPIECE ACID GREEN & PURPLE TOXIC FLAMING SKULL (Panel 4 of reference)
export function generateFlamingSkullSvg() {
  // viewBox: 0 0 144 170 - Massive flaming skull with towering licking flame tongues and screaming jaw
  let out = `<svg class="flaming-skull-svg" viewBox="0 0 144 170" width="100%" height="100%" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">\n`;

  // --- 1. OUTER SURREAL PURPLE/VIOLET FLAMES & SMOKE (Towering high above skull) ---
  // Left purple swirling wings
  out += r(20, 48, 12, 60, '#240046');
  out += r(14, 56, 8, 44, '#3c096c');
  out += r(10, 66, 6, 28, '#5a189a');
  out += r(6, 76, 6, 16, '#7b2cbf');
  out += r(4, 82, 4, 8, '#9d4edd');
  out += r(2, 84, 2, 4, '#c77dff'); // outer tip

  // Left upper crest tendrils
  out += r(22, 28, 8, 24, '#3c096c');
  out += r(26, 18, 6, 16, '#5a189a');
  out += r(30, 10, 4, 12, '#7b2cbf');
  out += r(32, 4, 2, 8, '#c77dff');

  // Right purple swirling wings
  out += r(112, 48, 12, 60, '#240046');
  out += r(122, 56, 8, 44, '#3c096c');
  out += r(128, 66, 6, 28, '#5a189a');
  out += r(132, 76, 6, 16, '#7b2cbf');
  out += r(136, 82, 4, 8, '#9d4edd');
  out += r(140, 84, 2, 4, '#c77dff'); // outer tip

  // Right upper crest tendrils
  out += r(114, 28, 8, 24, '#3c096c');
  out += r(112, 18, 6, 16, '#5a189a');
  out += r(110, 10, 4, 12, '#7b2cbf');
  out += r(110, 4, 2, 8, '#c77dff');

  // High center purple crest
  out += r(52, 6, 40, 36, '#240046');
  out += r(58, 2, 28, 28, '#3c096c');
  out += r(64, 0, 16, 20, '#5a189a');
  out += r(68, 0, 8, 12, '#7b2cbf');
  out += r(70, 0, 4, 6, '#c77dff'); // crown spike

  // --- 2. TOWERING ACID GREEN / FLUORESCENT CORE FLAMES ---
  // Deep base green foundation
  out += r(32, 34, 80, 56, '#004b23');
  out += r(36, 24, 72, 48, '#007200');

  // Vivid fluorescent green main body
  out += r(42, 16, 60, 42, '#00b341');
  out += r(46, 10, 52, 36, '#00e676');
  out += r(50, 6, 44, 30, '#39ff14');

  // Licking acid flame spikes rising high
  // Center spike
  out += r(66, 2, 12, 18, '#76ff03');
  out += r(68, 0, 8, 14, '#ccff33');
  out += r(70, 0, 4, 8, '#ffffff'); // white-hot tip
  // Left flame spike
  out += r(48, 8, 10, 20, '#76ff03');
  out += r(50, 6, 6, 14, '#ccff33');
  out += r(52, 4, 2, 8, '#ffffff');
  // Right flame spike
  out += r(86, 8, 10, 20, '#76ff03');
  out += r(88, 6, 6, 14, '#ccff33');
  out += r(90, 4, 2, 8, '#ffffff');

  // Stepped checkerboard dithering between lime `#76ff03` and fluorescent green `#39ff14`
  for (let y = 14; y < 46; y += 4) {
    out += r(40, y, 2, 2, '#76ff03');
    out += r(42, y + 2, 2, 2, '#76ff03');
    out += r(38, y + 2, 2, 2, '#39ff14');
    out += r(102, y, 2, 2, '#76ff03');
    out += r(100, y + 2, 2, 2, '#76ff03');
    out += r(104, y + 2, 2, 2, '#39ff14');
  }

  // --- 3. MENACING PIXEL SKULL (Broad imposing cranium, dark hollow sockets, snarl) ---
  // Cranium Dome Outer Contour
  out += r(48, 66, 48, 4, '#0a140d');
  out += r(40, 70, 64, 4, '#0a140d');
  out += r(34, 74, 76, 4, '#0a140d');
  out += r(30, 78, 84, 30, '#0a140d');

  // Cranium Bone Base (Eerie Pale Mint / Ivory Bone #e2ede0)
  out += r(50, 68, 44, 4, '#e2ede0');
  out += r(42, 72, 60, 4, '#e2ede0');
  out += r(36, 76, 72, 4, '#e2ede0');
  out += r(32, 80, 80, 26, '#d4e4d2');

  // Cranium 3D Highlights (Top left lit dome)
  out += r(52, 70, 30, 4, '#ffffff');
  out += r(44, 74, 38, 4, '#ffffff');
  out += r(38, 78, 28, 8, '#ffffff');

  // Cranium Shading (Right side shadow)
  out += r(94, 76, 18, 26, '#adbeab');
  out += r(104, 80, 8, 22, '#71836e');
  out += r(110, 84, 2, 16, '#435241');

  // Cranial Suture Crack on Forehead
  out += r(70, 70, 2, 6, '#0a140d');
  out += r(72, 76, 2, 5, '#0a140d');
  out += r(71, 81, 2, 4, '#0a140d');

  // Cheekbones (Zygomatic Arches flaring out)
  out += r(26, 96, 10, 14, '#0a140d');
  out += r(28, 98, 8, 10, '#ffffff');
  out += r(108, 96, 10, 14, '#0a140d');
  out += r(108, 98, 6, 10, '#71836e');

  // Hollow Eye Sockets (Menacing Angular Cavities)
  // Left Socket
  out += r(38, 90, 26, 26, '#060a07');
  out += r(40, 88, 22, 2, '#060a07');
  out += r(40, 116, 22, 2, '#060a07');
  // Right Socket
  out += r(80, 90, 26, 26, '#060a07');
  out += r(82, 88, 22, 2, '#060a07');
  out += r(82, 116, 22, 2, '#060a07');

  // Toxic Glowing Pupils (Acid green outer glow + fiery magenta heart glint)
  // Left Pupil
  out += r(48, 98, 8, 8, '#00e676');
  out += r(50, 100, 4, 4, '#39ff14');
  out += r(51, 101, 2, 2, '#ff006e');
  // Right Pupil
  out += r(88, 98, 8, 8, '#00e676');
  out += r(90, 100, 4, 4, '#39ff14');
  out += r(91, 101, 2, 2, '#ff006e');

  // Inverted Heart Nasal Cavity
  out += r(68, 104, 8, 16, '#060a07');
  out += r(66, 110, 12, 8, '#060a07');
  out += r(71, 104, 2, 10, '#71836e'); // Septum bridge

  // Upper Maxilla Bone Shelf
  out += r(46, 118, 52, 4, '#d4e4d2');
  out += r(48, 118, 24, 2, '#ffffff');
  out += r(84, 118, 14, 4, '#adbeab');

  // Upper Teeth (6 individually sculpted stepped ivory teeth with dark gaps)
  const teethX = [48, 56, 64, 72, 80, 88];
  for (let i = 0; i < teethX.length; i++) {
    const tx = teethX[i];
    out += r(tx, 122, 6, 9, '#f6fbf4');
    out += r(tx, 122, 2, 8, '#ffffff'); // highlight
    out += r(tx + 4, 122, 2, 9, '#adbeab'); // shadow
    out += r(tx - 1, 122, 1, 9, '#0a140d'); // dark gap
  }
  out += r(94, 122, 1, 9, '#0a140d');

  // --- 4. OPEN MENACING LOWER MANDIBLE (SCREAMING JAW) ---
  // Wide Dark Oral Abyss Void
  out += r(44, 131, 56, 12, '#060a07');

  // Escaping green toxic vapors from mouth
  out += r(52, 131, 5, 7, '#39ff14', 0.85);
  out += r(70, 132, 6, 6, '#00e676', 0.85);
  out += r(82, 131, 5, 7, '#76ff03', 0.85);

  // Lower Teeth (Pointing upward to interlock in snarl)
  for (let i = 0; i < teethX.length; i++) {
    const tx = teethX[i];
    out += r(tx, 138, 6, 8, '#f6fbf4');
    out += r(tx, 139, 2, 7, '#ffffff');
    out += r(tx + 4, 138, 2, 8, '#adbeab');
    out += r(tx - 1, 138, 1, 8, '#0a140d');
  }
  out += r(94, 138, 1, 8, '#0a140d');

  // Lower Jaw Chin Bone Shelf
  out += r(42, 146, 60, 8, '#0a140d');
  out += r(44, 146, 56, 6, '#d4e4d2');
  out += r(48, 146, 26, 3, '#ffffff');
  out += r(82, 147, 18, 5, '#71836e');
  out += r(52, 152, 40, 6, '#0a140d');
  out += r(54, 152, 36, 4, '#adbeab');

  out += `</svg>`;
  return out;
}

// 5. MASTERPIECE TAROT CARD ART: BLIND TASTING (Panel 2 of reference)
export function generateBlindTastingCardSvg() {
  // viewBox: 0 0 134 190 - Ornate filigree card, Eye of Providence, Reaching Victorian Hand, 3 teacups
  let out = `<svg class="tarot-card-svg" viewBox="0 0 134 190" width="100%" height="100%" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">\n`;

  // Outer Gothic Card Border
  out += r(4, 4, 126, 182, '#0c0414');
  out += r(6, 6, 122, 178, '#694c0b');
  out += r(8, 8, 118, 174, '#c79628');
  out += r(10, 10, 114, 170, '#160422'); // midnight velvet interior

  // Inner Gold Pinstripe
  out += r(12, 12, 110, 1, '#ffd700');
  out += r(12, 177, 110, 1, '#ffd700');
  out += r(12, 12, 1, 166, '#ffd700');
  out += r(121, 12, 1, 166, '#ffd700');

  // Corner Gold Diamond Rosettes
  const cornerJewel = (cx, cy) => {
    let j = '';
    j += r(cx - 2, cy - 2, 5, 5, '#694c0b');
    j += r(cx - 1, cy - 1, 3, 3, '#ffd700');
    j += r(cx, cy, 1, 1, '#ffffff');
    return j;
  };
  out += cornerJewel(13, 13);
  out += cornerJewel(120, 13);
  out += cornerJewel(13, 176);
  out += cornerJewel(120, 176);

  // Card Header Cartouche: BLIND TASTING
  out += r(20, 16, 94, 16, '#280a3a');
  out += r(20, 16, 94, 1, '#ffd700');
  out += r(20, 31, 94, 1, '#ffd700');
  out += r(20, 16, 1, 16, '#ffd700');
  out += r(113, 16, 1, 16, '#ffd700');
  out += `  <text x="67" y="27" text-anchor="middle" fill="#ffd700" font-family="'Press Start 2P', monospace" font-size="5.2" font-weight="bold" letter-spacing="1">BLIND TASTING</text>\n`;

  // Deep Crimson/Purple Velvet Curtains (Left & Right)
  // Left Curtain Folds
  out += r(13, 33, 22, 112, '#16021e');
  out += r(15, 33, 18, 112, '#350a44');
  out += r(18, 33, 12, 112, '#56146c');
  out += r(22, 33, 5, 112, '#751f8f');
  // Left Gold Tieback Tassel
  out += r(13, 86, 20, 4, '#c79628');
  out += r(15, 87, 16, 2, '#ffd700');

  // Right Curtain Folds
  out += r(99, 33, 22, 112, '#16021e');
  out += r(101, 33, 18, 112, '#350a44');
  out += r(104, 33, 12, 112, '#56146c');
  out += r(107, 33, 5, 112, '#751f8f');
  // Right Gold Tieback Tassel
  out += r(101, 86, 20, 4, '#c79628');
  out += r(103, 87, 16, 2, '#ffd700');

  // Radiating Golden Celestial Sun Rays
  out += r(66, 34, 2, 12, '#ffe066');
  out += r(56, 36, 4, 2, '#ffd700');
  out += r(74, 36, 4, 2, '#ffd700');
  out += r(48, 42, 6, 2, '#ffd700');
  out += r(80, 42, 6, 2, '#ffd700');
  out += r(42, 52, 6, 2, '#ffd700');
  out += r(86, 52, 6, 2, '#ffd700');

  // Golden Pyramid / Triangle (Eye of Providence)
  out += r(66, 44, 2, 2, '#ffd700');
  out += r(64, 46, 6, 2, '#ffd700');
  out += r(62, 48, 10, 2, '#ffd700');
  out += r(60, 50, 14, 2, '#ffd700');
  out += r(58, 52, 18, 2, '#ffd700');
  out += r(56, 54, 22, 2, '#ffd700');
  out += r(54, 56, 26, 2, '#ffd700');
  out += r(52, 58, 30, 2, '#ffd700');
  out += r(50, 60, 34, 2, '#ffd700');
  out += r(48, 62, 38, 2, '#ffd700');

  // Triangle Interior Radiant Ivory Aura
  out += r(54, 50, 26, 12, '#fff6c4');

  // The Mystical Eye of Providence
  out += r(58, 53, 18, 1, '#2c0c38'); // top eyelid
  out += r(58, 61, 18, 1, '#2c0c38'); // bottom eyelid
  out += r(56, 54, 22, 6, '#ffffff'); // white sclera
  out += r(63, 54, 8, 6, '#a00028'); // crimson iris outer
  out += r(64, 55, 6, 4, '#e01e37'); // amber iris
  out += r(66, 56, 2, 2, '#0c0414'); // pupil
  out += r(66, 55, 1, 1, '#ffffff'); // divine glint

  // Reaching Victorian Hand with Articulated Glove (Reaching from upper-right toward center cup)
  // White Ruffled Dress Shirt Cuff
  out += r(96, 62, 14, 12, '#ffffff');
  out += r(94, 64, 4, 8, '#d4d4e4');
  out += r(104, 68, 2, 2, '#ffd700'); // gold cufflink

  // Victorian Black Leather Glove Body
  out += r(84, 72, 16, 14, '#181622');
  out += r(86, 73, 12, 4, '#383448'); // glove leather glint
  out += r(78, 82, 14, 12, '#181622');

  // Articulated Fingers (Poised gracefully over the center cup)
  // Forefinger reaching down
  out += r(72, 90, 4, 16, '#181622');
  out += r(73, 90, 2, 14, '#383448');
  // Middle finger reaching down
  out += r(68, 94, 4, 14, '#181622');
  out += r(69, 94, 2, 12, '#383448');
  // Ring finger
  out += r(76, 92, 3, 10, '#181622');
  // Thumb poised outwards
  out += r(82, 88, 4, 10, '#181622');
  out += r(83, 88, 2, 8, '#383448');

  // Velvet Table with 3 Teacups (y=122..170)
  out += r(18, 126, 98, 46, '#16041f');
  out += r(20, 124, 94, 4, '#2d093d');
  out += r(18, 128, 98, 2, '#ffd700'); // table gold fringe

  // Teacup 1 (Left - White Porcelain with Sinister Skull Emblem)
  out += r(26, 132, 16, 12, '#f2efe9');
  out += r(25, 132, 1, 10, '#180a20');
  out += r(42, 132, 1, 10, '#180a20');
  out += r(28, 144, 12, 2, '#180a20');
  out += r(24, 144, 20, 2, '#ded7cb'); // saucer
  out += r(27, 132, 14, 2, '#4a1808'); // tea
  // Skull Mark
  out += r(32, 135, 4, 4, '#180a20');
  out += r(33, 139, 2, 2, '#180a20');

  // Teacup 2 (Center - Ivory Cup with Gold Trim, Steam, & Sugar Cubes)
  out += r(58, 132, 18, 14, '#fffdf5');
  out += r(57, 132, 1, 12, '#180a20');
  out += r(76, 132, 1, 12, '#180a20');
  out += r(60, 146, 14, 2, '#180a20');
  out += r(54, 146, 26, 2, '#c79628'); // gold saucer
  out += r(58, 132, 18, 2, '#ffd700'); // gold rim
  // Steam wisps
  out += r(64, 124, 2, 5, '#e0d4c6');
  out += r(68, 118, 2, 6, '#e0d4c6');
  // 2 Sugar Cubes beside center cup
  out += r(48, 140, 5, 5, '#ffffff');
  out += r(49, 141, 3, 3, '#d0d0d0');
  out += r(52, 142, 5, 5, '#ffffff');
  out += r(53, 143, 3, 3, '#a0a0a0');

  // Ghostly Toxic Mini-Skull Vapor hovering over Center Cup
  out += r(63, 110, 8, 7, '#39ff14', 0.85);
  out += r(65, 112, 2, 2, '#0c0414'); // eye
  out += r(68, 112, 2, 2, '#0c0414'); // eye
  out += r(66, 117, 2, 2, '#00e676', 0.85);

  // Teacup 3 (Right - White Porcelain)
  out += r(92, 132, 16, 12, '#f2efe9');
  out += r(91, 132, 1, 10, '#180a20');
  out += r(108, 132, 1, 10, '#180a20');
  out += r(94, 144, 12, 2, '#180a20');
  out += r(90, 144, 20, 2, '#ded7cb');
  out += r(93, 132, 14, 2, '#4a1808');

  out += `</svg>`;
  return out;
}

console.log("Upgraded Masterpiece SVGs successfully built!");
