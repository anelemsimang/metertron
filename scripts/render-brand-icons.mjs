import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = path.resolve(import.meta.dirname, "..");
const FLOW = "#00B4C8";
const RESERVOIR = "#0B1F33";
const VERIFIED = "#A8E63A";
const LIGHT = "#E8F7FA";
const SLATE = "#F4F7F9";

function markSvg(size, { pad = 0, mono = null } = {}) {
  const inner = size - pad * 2;
  const scale = inner / 64;
  const plate = mono ? "none" : RESERVOIR;
  const dial = mono === "white" ? "#ffffff" : mono === "dark" ? RESERVOIR : LIGHT;
  const drop = mono === "white" ? "#ffffff" : mono === "dark" ? RESERVOIR : FLOW;
  const check = mono === "white" ? "#ffffff" : mono === "dark" ? RESERVOIR : VERIFIED;
  const hub = mono === "white" ? RESERVOIR : mono === "dark" ? "#ffffff" : RESERVOIR;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${mono ? "" : `<rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="${plate}"/>`}
  <g transform="translate(${pad} ${pad}) scale(${scale})">
    <circle cx="32" cy="30" r="18" fill="none" stroke="${dial}" stroke-width="2.5"/>
    <path d="M32 14v3.5M46 30h-3.5M32 46v-3.5M18 30h3.5" stroke="${dial}" stroke-width="2" stroke-linecap="round"/>
    <path d="M32 22c5.5 6.2 8.5 9.8 8.5 13.8a8.5 8.5 0 1 1-17 0c0-4 3-7.6 8.5-13.8z" fill="${drop}"/>
    <circle cx="32" cy="36.5" r="2.6" fill="${hub}"/>
    <path d="M24 52.5l4 4 12-11" fill="none" stroke="${check}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;
}

const markOnly = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Metertron">
  <rect width="64" height="64" rx="14" fill="${RESERVOIR}"/>
  <circle cx="32" cy="30" r="18" fill="none" stroke="${LIGHT}" stroke-width="2.5"/>
  <path d="M32 14v3.5M46 30h-3.5M32 46v-3.5M18 30h3.5" stroke="${LIGHT}" stroke-width="2" stroke-linecap="round"/>
  <path d="M32 22c5.5 6.2 8.5 9.8 8.5 13.8a8.5 8.5 0 1 1-17 0c0-4 3-7.6 8.5-13.8z" fill="${FLOW}"/>
  <circle cx="32" cy="36.5" r="2.6" fill="${RESERVOIR}"/>
  <path d="M24 52.5l4 4 12-11" fill="none" stroke="${VERIFIED}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const lockupHorizontal = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 64" role="img" aria-label="metertron">
  <g transform="translate(0 0)">${markOnly.replace(/<\/?svg[^>]*>/g, "")}</g>
  <text x="78" y="42" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="32" font-weight="500" letter-spacing="-1" fill="${RESERVOIR}">metertron</text>
</svg>`;

const lockupStacked = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" role="img" aria-label="metertron">
  <g transform="translate(48 0)">${markOnly.replace(/<\/?svg[^>]*>/g, "")}</g>
  <text x="80" y="100" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="22" font-weight="500" letter-spacing="-0.8" fill="${RESERVOIR}">metertron</text>
</svg>`;

async function png(svg, file) {
  await sharp(Buffer.from(svg)).png().toFile(file);
}

const splash = `<svg xmlns="http://www.w3.org/2000/svg" width="1290" height="2796" viewBox="0 0 1290 2796">
  <rect width="1290" height="2796" fill="${SLATE}"/>
  <g transform="translate(521 1238)">${markSvg(248).replace(/^<svg[^>]*>/, "").replace("</svg>", "")}</g>
  <text x="645" y="1580" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="64" font-weight="500" letter-spacing="-2" fill="${RESERVOIR}">metertron</text>
  <text x="645" y="1640" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="28" fill="#4D5E6D">Every meter, accounted for.</text>
</svg>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${RESERVOIR}"/>
      <stop offset="100%" stop-color="#123048"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="980" cy="120" r="180" fill="${FLOW}" opacity="0.12"/>
  <circle cx="80" cy="540" r="140" fill="${VERIFIED}" opacity="0.1"/>
  <g transform="translate(96 215)">${markSvg(200).replace(/^<svg[^>]*>/, "").replace("</svg>", "")}</g>
  <text x="340" y="300" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="72" font-weight="500" letter-spacing="-2" fill="#ffffff">metertron</text>
  <text x="340" y="360" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="32" fill="${FLOW}">Every meter, accounted for.</text>
  <text x="340" y="420" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="24" fill="#B8C5CF">Field-to-municipality meter installation software</text>
</svg>`;

const emailHeader = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="120" viewBox="0 0 600 120">
  <rect width="600" height="120" fill="${RESERVOIR}"/>
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

// Simple ICO: 32px PNG renamed is not a real ICO; write a multi-size PNG set and a 32px favicon.ico via sharp.
await sharp(Buffer.from(markSvg(32))).resize(32, 32).toFile(path.join(root, "public", "favicon.ico"));

console.log("Metertron brand icons rendered.");
