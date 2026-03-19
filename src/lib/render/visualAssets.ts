import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { ThemeDefinition } from "../style/loadTheme.js";

export type VisualAssets = {
  coverOrbitBoard: string;
  controlLoopHero: string;
};

export async function ensureVisualAssets(outputDir: string, theme: ThemeDefinition): Promise<VisualAssets> {
  await mkdir(outputDir, { recursive: true });

  const coverOrbitBoard = path.join(outputDir, "cover-orbit-board.svg");
  const controlLoopHero = path.join(outputDir, "control-loop-hero.svg");

  await writeFile(coverOrbitBoard, buildCoverOrbitBoardSvg(theme), "utf8");
  await writeFile(controlLoopHero, buildControlLoopHeroSvg(theme), "utf8");

  return {
    coverOrbitBoard,
    controlLoopHero
  };
}

function buildCoverOrbitBoardSvg(theme: ThemeDefinition): string {
  const p = theme.palette;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="880" height="600" viewBox="0 0 880 600">
  <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.accent_primary}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${p.accent_secondary}" stop-opacity="0.75"/>
    </linearGradient>
    <radialGradient id="g2" cx="70%" cy="30%" r="60%">
      <stop offset="0%" stop-color="${p.accent_primary}" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="${p.background}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="880" height="600" rx="30" fill="${p.surface}" />
  <rect width="880" height="600" rx="30" fill="url(#g2)" />
  <g opacity="0.9">
    <circle cx="560" cy="270" r="156" fill="none" stroke="${p.accent_primary}" stroke-opacity="0.25" stroke-width="3"/>
    <circle cx="560" cy="270" r="110" fill="none" stroke="${p.accent_secondary}" stroke-opacity="0.34" stroke-width="2.4"/>
    <circle cx="560" cy="270" r="34" fill="url(#g1)"/>
    <circle cx="560" cy="270" r="68" fill="${p.accent_primary}" fill-opacity="0.12"/>
  </g>
  <g>
    <path d="M172 176 C286 176, 344 248, 470 248" fill="none" stroke="${p.accent_primary}" stroke-opacity="0.28" stroke-width="4"/>
    <path d="M612 242 C708 242, 740 182, 784 138" fill="none" stroke="${p.accent_secondary}" stroke-opacity="0.3" stroke-width="4"/>
    <path d="M612 300 C706 324, 738 388, 802 432" fill="none" stroke="${p.accent_primary}" stroke-opacity="0.24" stroke-width="4"/>
  </g>
  <g font-family="${theme.typography.font_family}">
    <rect x="76" y="150" width="186" height="54" rx="27" fill="${p.background}" fill-opacity="0.72" stroke="#FFFFFF" stroke-opacity="0.14"/>
    <text x="112" y="184" fill="${p.text_primary}" font-size="20">Research</text>
    <rect x="654" y="116" width="142" height="54" rx="27" fill="${p.background}" fill-opacity="0.72" stroke="#FFFFFF" stroke-opacity="0.14"/>
    <text x="690" y="150" fill="${p.text_primary}" font-size="20">Delivery</text>
    <rect x="664" y="414" width="124" height="54" rx="27" fill="${p.background}" fill-opacity="0.72" stroke="#FFFFFF" stroke-opacity="0.14"/>
    <text x="708" y="448" fill="${p.text_primary}" font-size="20">QA</text>
  </g>
  <g>
    <rect x="146" y="334" width="272" height="132" rx="22" fill="${p.background}" fill-opacity="0.52" stroke="${p.accent_secondary}" stroke-opacity="0.28"/>
    <circle cx="182" cy="366" r="4" fill="${p.accent_risk}"/>
    <circle cx="198" cy="366" r="4" fill="${p.accent_secondary}"/>
    <circle cx="214" cy="366" r="4" fill="${p.accent_primary}"/>
    <rect x="180" y="396" width="110" height="8" rx="4" fill="${p.text_secondary}" fill-opacity="0.5"/>
    <rect x="180" y="420" width="196" height="8" rx="4" fill="${p.text_secondary}" fill-opacity="0.22"/>
    <rect x="180" y="442" width="164" height="8" rx="4" fill="${p.text_secondary}" fill-opacity="0.22"/>
  </g>
</svg>
`;
}

function buildControlLoopHeroSvg(theme: ThemeDefinition): string {
  const p = theme.palette;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="980" height="200" viewBox="0 0 980 200">
  <defs>
    <linearGradient id="loopA" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.accent_primary}" stop-opacity="0.82"/>
      <stop offset="100%" stop-color="${p.accent_secondary}" stop-opacity="0.78"/>
    </linearGradient>
    <radialGradient id="loopGlow" cx="32%" cy="50%" r="55%">
      <stop offset="0%" stop-color="${p.accent_primary}" stop-opacity="0.36"/>
      <stop offset="100%" stop-color="${p.background}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="980" height="200" rx="26" fill="${p.surface}" />
  <rect width="980" height="200" rx="26" fill="url(#loopGlow)" />
  <g opacity="0.95">
    <rect x="40" y="26" width="258" height="138" rx="20" fill="${p.background}" fill-opacity="0.72" stroke="${p.accent_primary}" stroke-opacity="0.24"/>
    <circle cx="66" cy="48" r="4" fill="${p.accent_risk}"/>
    <circle cx="82" cy="48" r="4" fill="${p.accent_secondary}"/>
    <circle cx="98" cy="48" r="4" fill="${p.accent_primary}"/>
    <rect x="66" y="70" width="110" height="8" rx="4" fill="${p.text_secondary}" fill-opacity="0.42"/>
    <rect x="66" y="92" width="188" height="8" rx="4" fill="${p.text_secondary}" fill-opacity="0.2"/>
    <rect x="66" y="112" width="152" height="8" rx="4" fill="${p.text_secondary}" fill-opacity="0.2"/>
    <rect x="66" y="132" width="74" height="20" rx="10" fill="${p.accent_primary}" fill-opacity="0.14" stroke="${p.accent_primary}" stroke-opacity="0.24"/>
    <rect x="154" y="132" width="70" height="20" rx="10" fill="${p.accent_secondary}" fill-opacity="0.14" stroke="${p.accent_secondary}" stroke-opacity="0.24"/>
  </g>
  <g>
    <path d="M372 102 C438 36, 550 36, 614 100" fill="none" stroke="url(#loopA)" stroke-width="9" stroke-linecap="round" opacity="0.85"/>
    <path d="M614 100 C552 164, 438 164, 374 102" fill="none" stroke="${p.accent_primary}" stroke-opacity="0.28" stroke-width="6" stroke-linecap="round"/>
    <circle cx="372" cy="102" r="18" fill="${p.background}" stroke="${p.accent_primary}" stroke-opacity="0.56" stroke-width="4"/>
    <circle cx="614" cy="100" r="18" fill="${p.background}" stroke="${p.accent_secondary}" stroke-opacity="0.56" stroke-width="4"/>
    <circle cx="494" cy="36" r="13" fill="${p.background}" stroke="${p.accent_primary}" stroke-opacity="0.44" stroke-width="3"/>
    <circle cx="494" cy="166" r="13" fill="${p.background}" stroke="${p.accent_secondary}" stroke-opacity="0.44" stroke-width="3"/>
  </g>
  <g font-family="${theme.typography.font_family}">
    <rect x="730" y="28" width="154" height="24" rx="12" fill="${p.background}" fill-opacity="0.7" stroke="#FFFFFF" stroke-opacity="0.14"/>
    <text x="760" y="44" fill="${p.text_primary}" font-size="13">Observe</text>
    <rect x="730" y="58" width="154" height="24" rx="12" fill="${p.background}" fill-opacity="0.7" stroke="#FFFFFF" stroke-opacity="0.14"/>
    <text x="760" y="74" fill="${p.text_primary}" font-size="13">Execute</text>
    <rect x="730" y="88" width="154" height="24" rx="12" fill="${p.background}" fill-opacity="0.7" stroke="#FFFFFF" stroke-opacity="0.14"/>
    <text x="767" y="104" fill="${p.text_primary}" font-size="13">Verify</text>
    <rect x="730" y="118" width="154" height="24" rx="12" fill="${p.background}" fill-opacity="0.7" stroke="#FFFFFF" stroke-opacity="0.14"/>
    <text x="778" y="134" fill="${p.text_primary}" font-size="13">Fix</text>
  </g>
</svg>
`;
}
