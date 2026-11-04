import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = path.resolve(import.meta.dirname, "..");
const GROVE = "#0E3D24";
const LEAF = "#147A45";
const CITRUS = "#F07A1A";
const MIST = "#E8F5EE";
const WHITE = "#FFFFFF";
const SLATE = "#F7FAF8";

function markInner(mono = null) {
  const dial = mono === "white" ? "none" : mono === "dark" ? "none" : MIST;
  const ring = mono === "white" ? WHITE : mono === "dark" ? GROVE : LEAF;
  const needle = mono === "white" ? WHITE : mono === "dark" ? GROVE : CITRUS;
  const hub = mono === "white" ? GROVE : mono === "dark" ? WHITE : WHITE;
  const bar = mono ? "" : `<rect x="18" y="54" width="28" height="3.5" rx="1.75" fill="${LEAF}"/>`;
  return `
    <circle cx="32" cy="32" r="20" fill="${dial}" stroke="${ring}" stroke-width="2.75"/>
    <path d="M32 14v4M48 32h-4M32 50v-4M16 32h4M43.3 20.7l-2.8 2.8M43.3 43.3l-2.8-2.8M20.7 43.3l2.8-2.8M20.7 20.7l2.8 2.8" stroke="${ring}" stroke-width="2" stroke-linecap="round"/>
    <path d="M32 32 L44 18" stroke="${needle}" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="32" cy="32" r="4" fill="${needle}"/>
    <circle cx="32" cy="32" r="1.8" fill="${hub}"/>
    ${bar}`;
}

function markSvg(size, { pad = 0, mono = null } = {}) {
  const inner = size - pad * 2;
  const scale = inner / 64;
  const plate = mono ? "none" : GROVE;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${mono ? "" : `<rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="${plate}"/>`}
  <g transform="translate(${pad} ${pad}) scale(${scale})">${markInner(mono)}</g>
</svg>`;
}

const markOnly = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Metertron">
  <rect width="64" height="64" rx="14" fill="${GROVE}"/>
  ${markInner()}
</svg>`;

const lockupHorizontal = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 64" role="img" aria-label="metertron">
  <g transform="translate(0 0)">${markOnly.replace(/<\/?svg[^>]*>/g, "")}</g>
  <text x="78" y="42" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="32" font-weight="500" letter-spacing="-1" fill="${GROVE}">metertron</text>
</svg>`;

const lockupStacked = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" role="img" aria-label="metertron">
  <g transform="translate(48 0)">${markOnly.replace(/<\/?svg[^>]*>/g, "")}</g>
  <text x="80" y="100" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="22" font-weight="500" letter-spacing="-0.8" fill="${GROVE}">metertron</text>
</svg>`;

async function png(svg, file) {
  await sharp(Buffer.from(svg)).png().toFile(file);
}

const splash = `<svg xmlns="http://www.w3.org/2000/svg" width="1290" height="2796" viewBox="0 0 1290 2796">
  <rect width="1290" height="2796" fill="${SLATE}"/>
  <g transform="translate(521 1238)">${markSvg(248).replace(/^<svg[^>]*>/, "").replace("</svg>", "")}</g>
  <text x="645" y="1580" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="64" font-weight="500" letter-spacing="-2" fill="${GROVE}">metertron</text>
  <text x="645" y="1640" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="28" fill="#4D6156">Every meter, accounted for.</text>
</svg>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${GROVE}"/>
      <stop offset="100%" stop-color="#145C38"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="980" cy="120" r="180" fill="${CITRUS}" opacity="0.18"/>
  <circle cx="80" cy="540" r="140" fill="${LEAF}" opacity="0.2"/>
  <g transform="translate(96 215)">${markSvg(200).replace(/^<svg[^>]*>/, "").replace("</svg>", "")}</g>
  <text x="340" y="300" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="72" font-weight="500" letter-spacing="-2" fill="#ffffff">metertron</text>
  <text x="340" y="360" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="32" fill="${CITRUS}">Every meter, accounted for.</text>
  <text x="340" y="420" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="24" fill="${MIST}">Field-to-municipality meter installation software</text>
</svg>`;

const emailHeader = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="120" viewBox="0 0 600 120">
  <rect width="600" height="120" fill="${GROVE}"/>
  <g transform="translate(28 28)">${markSvg(64).replace(/^<svg[^>]*>/, "").replace("</svg>", "")}</g>
  <text x="112" y="72" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="36" font-weight="500" letter-spacing="-1" fill="#ffffff">metertron</text>
</svg>`;

const brandDir = path.join(root, "public", "brand");
const iconsDir = path.join(root, "public", "icons");
await mkdir(brandDir, { recursive: true });
await mkdir(iconsDir, { recursive: true });
await mkdir(path.join(root, "src", "app"), { recursive: true });

await writeFile(path.join(brandDir, "mark.svg"), markOnly);
await writeFile(path.join(brandDir, "lockup-horizontal.svg"), lockupHorizontal);
await writeFile(path.join(brandDir, "lockup-stacked.svg"), lockupStacked);
await writeFile(path.join(brandDir, "mark-mono-white.svg"), markSvg(64, { mono: "white" }));
await writeFile(path.join(brandDir, "mark-mono-dark.svg"), markSvg(64, { mono: "dark" }));
await writeFile(path.join(root, "public", "favicon.svg"), markOnly);

await png(markSvg(512), path.join(brandDir, "mark.png"));
await png(markSvg(16), path.join(iconsDir, "favicon-16.png"));
await png(markSvg(32), path.join(iconsDir, "favicon-32.png"));
await png(markSvg(180), path.join(iconsDir, "apple-touch-icon.png"));
await png(markSvg(192, { pad: 28 }), path.join(iconsDir, "icon-192.png"));
await png(markSvg(512, { pad: 76 }), path.join(iconsDir, "icon-512.png"));
await png(markSvg(192), path.join(iconsDir, "icon-192-any.png"));
await png(markSvg(512), path.join(iconsDir, "icon-512-any.png"));
await png(markSvg(512), path.join(root, "src", "app", "icon.png"));
await png(markSvg(180), path.join(root, "src", "app", "apple-icon.png"));
await png(splash, path.join(root, "public", "splash.png"));
await png(og, path.join(brandDir, "og-default.png"));
await png(emailHeader, path.join(brandDir, "email-header.png"));

await sharp(Buffer.from(markSvg(32))).resize(32, 32).toFile(path.join(root, "public", "favicon.ico"));

console.log("Metertron brand icons rendered (green / orange / white).");
