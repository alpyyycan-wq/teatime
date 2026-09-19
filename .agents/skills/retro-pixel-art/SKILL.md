---
name: retro-pixel-art
description: Authentic 8-bit, 16-bit, and retro pixel-art development guide for SVGs, CSS, Canvas, and web game interfaces. Use whenever creating, styling, reviewing, or debugging pixel art, retro gaming UI, sprites, or retro aesthetic web apps. Enforces strict zero-tolerance for vector "AI-slop" (smooth curves, bezier paths, anti-aliased circles, soft blur shadows) and dictates integer grid matrices, crispEdges rendering, stepped dithering, chunky 3D borders, and retro typography.
---

# Retro Pixel-Art Architecture & Style Guide

This skill provides strict engineering and design standards for creating **authentic 8-bit, 16-bit, and retro arcade pixel art** in modern web applications (SVG, CSS, HTML5 Canvas, and WebGL).

---

## 🚫 The "AI-Slop" Trap: Why Default AI Pixel Art Fails

By default, LLMs and modern vector generators attempt to simulate pixel art by creating high-resolution vector SVGs with:
- Smooth Bezier curves (`<path d="M... C... Q... Z">`)
- Anti-aliased `<circle>` and `<ellipse>` tags
- Smooth radial or linear gradients (`<radialGradient>`)
- High-blur CSS drop-shadows (`box-shadow: 0 8px 24px rgba(0,0,0,0.5)`)
- Smooth rounded corners (`border-radius: 12px` or `16px`)

**Result:** An uncanny, muddy vector graphic that looks like an "AI-slop" vector illustration rather than genuine pixel art.

---

## ⚔️ The 7 Golden Commandments of Web Pixel Art

### 1. Mandatory Crisp Rendering Flags
Every SVG and container displaying pixel art **MUST** explicitly turn off browser interpolation:

```html
<!-- Inside SVG tags -->
<svg viewBox="0 0 32 32" shape-rendering="crispEdges">
```

```css
/* In CSS for pixel canvases, SVGs, and pixel images */
.pixel-art, .pixel-teacup, .pixel-icon {
  image-rendering: pixelated;         /* Modern standard */
  image-rendering: -moz-crisp-edges;  /* Firefox legacy */
  image-rendering: crisp-edges;       /* Safari / Chromium */
  shape-rendering: crispEdges;
}
```

### 2. Zero Bezier Curves or Anti-Aliased Circles
- **NEVER** use `C`, `S`, `Q`, `T` cubic/quadratic bezier commands.
- **NEVER** use `<ellipse>` or smooth `<circle>`.
- Every shape must be composed of **discrete integer coordinate blocks** (`<rect x=".." y=".." width=".." height="..">`) or rectilinear stepped paths (`M`, `H`, `V`, `L` with integer coordinates).

### 3. Integer Low-Resolution Grids
Always author the sprite inside a low-resolution canvas/viewBox, then let CSS scale it up:
- **Small Icons/Tokens:** 16×16 or 20×20
- **Items, Teacups, Cards:** 24×24 or 32×26 or 32×32
- **Portraits & Banners:** 64×64 or 96×64

```html
<!-- Example 32x26 Grid scaled smoothly to 76px via CSS -->
<svg viewBox="0 0 32 26" class="pixel-sprite" shape-rendering="crispEdges">
  <!-- All coordinates are discrete whole integers -->
  <rect x="5" y="8" width="20" height="1" fill="#120914" />
</svg>
```

### 4. Dithered Shading (No Gradients)
Do not use smooth CSS or SVG gradients. In retro games, lighting is achieved with:
- **Stepped Tonal Bands:** Highlight tone (left/top) -> Midtone (body) -> Shadow tone (right/bottom) -> Dark outline (`#120914`).
- **Checkerboard Dithering:** Alternating 1×1 pixel blocks (e.g., `#f7d070` and `#c79628`) to create an intermediate shade.

```
Dithered 2x2 cluster:
[Tone A] [Tone B]
[Tone B] [Tone A]
```

### 5. Chunky 3D Pixel Borders & Hard Shadows
Pixel interfaces use hard, stepped, non-blurred drop shadows:

```css
/* ✅ AUTHENTIC RETRO PIXEL BUTTON SHADOW */
.pixel-card {
  background: #2b1d28;
  border: 2px solid #573952;
  border-radius: 4px; /* At most 2-4px, never 12-16px */
  box-shadow: 0 4px 0 #0f0710; /* Solid hard shadow, 0px blur */
}

/* ✅ 8-BIT STEPPED BEVEL BORDER (NES style) */
.pixel-box-stepped {
  box-shadow: 
    -3px 0 0 0 #000,
     3px 0 0 0 #000,
     0 -3px 0 0 #000,
     0  3px 0 0 #000;
}
```

### 6. Tactile Retro Input Physics
Arcade and console buttons physically depress and collapse their bottom shadow:

```css
.pixel-button {
  box-shadow: 0 4px 0 #8c670a;
  transition: transform 0.08s ease, box-shadow 0.08s ease;
}

.pixel-button:active,
.pixel-button.pressed {
  transform: translateY(3px);   /* Shift down */
  box-shadow: 0 1px 0 #8c670a;  /* Collapse shadow */
}
```

### 7. Authentic Bitmap Typography
Modern sans-serif fonts ruin pixel art. Use authenticated pixel typography:
- Primary Arcade Titles: `'Press Start 2P', monospace`
- UI Text & Numbers: `'Pixelify Sans', monospace` or `'VT323', monospace`
- Hard Text Shadows:
  ```css
  text-shadow: 2px 2px 0 #000000; /* Crisp 2px black drop offset */
  ```

---

## 🎨 Master Template: Procedural SVG Pixel-Art Sprite (JavaScript)

When generating pixel art dynamically in code, use discrete integer rect maps:

```javascript
// Example: Creating an authentic pixel cup or item
export function createPixelSprite(palette) {
  return `
    <svg viewBox="0 0 32 26" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <!-- 1. Stepped Steam (Top) -->
      <rect x="9" y="4" width="2" height="2" fill="#ffe8d6"/>
      <rect x="8" y="2" width="2" height="2" fill="#e8c0a0"/>
      <rect x="15" y="3" width="2" height="3" fill="#ffe8d6"/>
      <rect x="16" y="1" width="2" height="2" fill="#e8c0a0"/>

      <!-- 2. Dark Outline (Silhouette) -->
      <rect x="5" y="8" width="20" height="1" fill="#0c060e"/>
      <rect x="4" y="9" width="1" height="8" fill="#0c060e"/>
      <rect x="25" y="9" width="1" height="8" fill="#0c060e"/>

      <!-- 3. Base Body Fill -->
      <rect x="5" y="9" width="20" height="8" fill="${palette.body}"/>

      <!-- 4. Left Highlight Column -->
      <rect x="5" y="9" width="2" height="7" fill="${palette.highlight}"/>

      <!-- 5. Right Shadow Column -->
      <rect x="22" y="9" width="3" height="8" fill="${palette.shade}"/>

      <!-- 6. Chunky Saucer Base -->
      <rect x="3" y="22" width="24" height="2" fill="${palette.saucer}"/>
      <rect x="2" y="24" width="26" height="2" fill="#0c060e" opacity="0.6"/>
    </svg>
  `;
}
```

---

## 🔍 Verification Checklist for Pixel Art Tasks

Before considering a pixel-art UI complete, verify:
- [ ] Are any `<ellipse>`, `<circle>`, or curved `C/Q` SVG paths present? (If yes, **DELETE** and replace with `<rect>` blocks).
- [ ] Is `shape-rendering="crispEdges"` present on every SVG?
- [ ] Is `image-rendering: pixelated` present on the CSS class?
- [ ] Are buttons using hard non-blurred box-shadows with active translation?
- [ ] Are font sizes and badges aligned to crisp pixel boundaries?
- [ ] Is the color palette restricted to cohesive 8/16-bit tones (outline, body, highlight, shade)?
