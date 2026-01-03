const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');

const COLORS = {
  bg: '#F7F7F7',
  accent: '#4A9B9B',
  white: '#FFFFFF',
  muted: '#E8E8E8',
};

function hexToRgba(hex, alpha = 255) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return { r, g, b, a: alpha };
}

function setPixel(png, x, y, rgba) {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) return;
  const idx = (png.width * y + x) << 2;
  png.data[idx] = rgba.r;
  png.data[idx + 1] = rgba.g;
  png.data[idx + 2] = rgba.b;
  png.data[idx + 3] = rgba.a;
}

function fill(png, rgba) {
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      setPixel(png, x, y, rgba);
    }
  }
}

function fillRect(png, x, y, w, h, rgba) {
  const x0 = Math.max(0, Math.floor(x));
  const y0 = Math.max(0, Math.floor(y));
  const x1 = Math.min(png.width, Math.ceil(x + w));
  const y1 = Math.min(png.height, Math.ceil(y + h));
  for (let yy = y0; yy < y1; yy++) {
    for (let xx = x0; xx < x1; xx++) {
      setPixel(png, xx, yy, rgba);
    }
  }
}

function fillCircle(png, cx, cy, r, rgba) {
  const r2 = r * r;
  const x0 = Math.max(0, Math.floor(cx - r));
  const y0 = Math.max(0, Math.floor(cy - r));
  const x1 = Math.min(png.width - 1, Math.ceil(cx + r));
  const y1 = Math.min(png.height - 1, Math.ceil(cy + r));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) setPixel(png, x, y, rgba);
    }
  }
}

function fillRoundedRect(png, x, y, w, h, radius, rgba) {
  // Body
  fillRect(png, x + radius, y, w - radius * 2, h, rgba);
  fillRect(png, x, y + radius, w, h - radius * 2, rgba);
  // Corners
  fillCircle(png, x + radius, y + radius, radius, rgba);
  fillCircle(png, x + w - radius, y + radius, radius, rgba);
  fillCircle(png, x + radius, y + h - radius, radius, rgba);
  fillCircle(png, x + w - radius, y + h - radius, radius, rgba);
}

function drawGlyph(png, { transparent = false } = {}) {
  const bg = hexToRgba(COLORS.bg, transparent ? 0 : 255);
  const accent = hexToRgba(COLORS.accent, 255);
  const white = hexToRgba(COLORS.white, 255);
  const muted = hexToRgba(COLORS.muted, 255);

  fill(png, bg);

  const size = Math.min(png.width, png.height);
  const cx = png.width / 2;
  const cy = png.height / 2;

  // Outer soft ring
  fillCircle(png, cx, cy, size * 0.36, muted);
  fillCircle(png, cx, cy, size * 0.33, bg);

  // Center card-like tile
  const tileW = size * 0.52;
  const tileH = size * 0.42;
  const tileX = cx - tileW / 2;
  const tileY = cy - tileH / 2;
  fillRoundedRect(png, tileX, tileY, tileW, tileH, Math.round(size * 0.06), accent);

  // Two "pips" on left (like a card)
  fillCircle(png, tileX + tileW * 0.18, tileY + tileH * 0.28, size * 0.03, white);
  fillCircle(png, tileX + tileW * 0.18, tileY + tileH * 0.72, size * 0.03, white);

  // Three score bars on right
  const barX = tileX + tileW * 0.44;
  const baseY = tileY + tileH * 0.78;
  const barW = tileW * 0.12;
  const gap = tileW * 0.06;
  const bars = [0.22, 0.38, 0.56];
  for (let i = 0; i < bars.length; i++) {
    const barH = tileH * bars[i];
    const x = barX + i * (barW + gap);
    const y = baseY - barH;
    fillRoundedRect(png, x, y, barW, barH, Math.round(size * 0.02), white);
  }
}

function writePng(filePath, png) {
  return new Promise((resolve, reject) => {
    png.pack().pipe(fs.createWriteStream(filePath)).on('finish', resolve).on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(ASSETS)) fs.mkdirSync(ASSETS, { recursive: true });

  const icon = new PNG({ width: 1024, height: 1024 });
  drawGlyph(icon, { transparent: false });
  await writePng(path.join(ASSETS, 'icon.png'), icon);

  const adaptive = new PNG({ width: 1024, height: 1024 });
  drawGlyph(adaptive, { transparent: true });
  await writePng(path.join(ASSETS, 'adaptive-icon.png'), adaptive);

  const splash = new PNG({ width: 1024, height: 1024 });
  drawGlyph(splash, { transparent: false });
  await writePng(path.join(ASSETS, 'splash-icon.png'), splash);

  const favicon = new PNG({ width: 48, height: 48 });
  drawGlyph(favicon, { transparent: false });
  await writePng(path.join(ASSETS, 'favicon.png'), favicon);

  console.log('✅ Generated assets:', ['icon.png', 'adaptive-icon.png', 'splash-icon.png', 'favicon.png'].join(', '));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
