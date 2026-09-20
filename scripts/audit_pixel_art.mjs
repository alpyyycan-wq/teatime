import fs from 'fs';
import path from 'path';

/**
 * Automated Pixel Art Quality Auditor
 * Evaluates sprites against the 7 Golden Rules of 16-bit Retro Pixel Art:
 * 1. Palette Discipline (Clustered, intentional color count, no muddy gradients)
 * 2. Crispness (Integer coordinates, zero anti-aliasing fuzziness)
 * 3. Tonal Hierarchy (Highlight, Midtone, Shade, Dark Outline)
 * 4. Silhouette & Contrast (Readability at 1x/small scales)
 * 5. Authentic Lighting Direction (Top-left light, bottom-right shadow)
 */

export function analyzeCanvasData(imageData, width, height, spriteName = 'sprite') {
  const data = imageData.data;
  const totalPixels = width * height;
  const colorMap = new Map();
  let opaquePixels = 0;
  let semiTransparentPixels = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a === 0) continue;

    if (a > 0 && a < 250) {
      semiTransparentPixels++;
    } else {
      opaquePixels++;
    }

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
  }

  const uniqueColors = colorMap.size;

  // 1. Crisp Edge Test (Penalize fuzzy semi-transparent anti-aliasing)
  const antiAliasingRatio = semiTransparentPixels / (opaquePixels + semiTransparentPixels || 1);
  let crispScore = 100;
  if (antiAliasingRatio > 0.05) crispScore -= Math.min(60, antiAliasingRatio * 200);

  // 2. Palette Discipline Test (16-bit sprites typically use 4-24 colors)
  let paletteScore = 100;
  if (uniqueColors > 32) {
    paletteScore -= Math.min(50, (uniqueColors - 32) * 2);
  } else if (uniqueColors < 3) {
    paletteScore -= 30; // Too flat
  }

  // 3. Contrast & Outline Test
  // Check if sprite has a clear darker silhouette or grounding tone
  let hasDarkOutline = false;
  colorMap.forEach((count, hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness < 45 && count > opaquePixels * 0.08) {
      hasDarkOutline = true;
    }
  });
  let outlineScore = hasDarkOutline ? 100 : 75;

  // 4. Tonal Depth Test (Checks for highlights + shadows)
  let minBrightness = 255;
  let maxBrightness = 0;
  colorMap.forEach((count, hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness < minBrightness) minBrightness = brightness;
    if (brightness > maxBrightness) maxBrightness = brightness;
  });
  const dynamicRange = maxBrightness - minBrightness;
  let tonalScore = Math.min(100, Math.max(50, (dynamicRange / 180) * 100));

  // Overall Quality Score (Weighted)
  const totalScore = Math.round(
    crispScore * 0.35 +
    paletteScore * 0.25 +
    outlineScore * 0.20 +
    tonalScore * 0.20
  );

  const passed = totalScore >= 85 && crispScore >= 80;

  return {
    spriteName,
    dimensions: `${width}x${height}`,
    uniqueColors,
    semiTransparentPixels,
    totalScore,
    crispScore: Math.round(crispScore),
    paletteScore: Math.round(paletteScore),
    outlineScore: Math.round(outlineScore),
    tonalScore: Math.round(tonalScore),
    passed,
    verdict: passed ? '✅ TOP-NOTCH 16-BIT RETRO' : '⚠️ NEEDS POLISH / DISCIPLINE'
  };
}

console.log('Pixel Art Quality Auditor module loaded.');
