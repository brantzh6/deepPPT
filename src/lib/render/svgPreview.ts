import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { ThemeDefinition } from "../style/loadTheme.js";

type SlideRecord = {
  id: string;
  title: string;
  subtitle?: string;
  claim: string;
  page_type?: string;
  page_type_hint?: string;
  blocks: Record<string, unknown>;
};

type StyleEntry = {
  page_type: string;
  learned_pattern?: {
    image_usage?: {
      mode?: "hero" | "contextual" | "texture" | "none";
    };
  };
};

const WIDTH = 1600;
const HEIGHT = 900;

export async function writeSvgPreviews(
  slides: SlideRecord[],
  styleMap: Map<string, StyleEntry>,
  theme: ThemeDefinition,
  outputDir: string
): Promise<void> {
  await mkdir(outputDir, { recursive: true });

  const htmlCards: string[] = [];
  for (const slide of slides) {
    const styleEntry = styleMap.get(slide.id);
    const svg = renderSlideSvg(slide, styleEntry, theme);
    const svgPath = path.join(outputDir, `${slide.id}.svg`);
    await writeFile(svgPath, svg, "utf8");
    htmlCards.push(`<section class="card"><h2>${escapeHtml(slide.title)}</h2><img src="./${slide.id}.svg" alt="${escapeHtml(slide.title)}" /></section>`);
  }

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>MVP Deck Preview</title>
  <style>
    body { margin: 0; background: #06101c; color: #f3f7ff; font-family: Aptos, Segoe UI, sans-serif; padding: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(520px, 1fr)); gap: 20px; }
    .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); border-radius: 18px; padding: 16px; }
    h2 { font-size: 16px; margin: 0 0 12px; color: #aab7cf; }
    img { width: 100%; border-radius: 12px; display: block; background: #08111f; }
  </style>
</head>
<body>
  <div class="grid">
    ${htmlCards.join("\n")}
  </div>
</body>
</html>
`;

  await writeFile(path.join(outputDir, "index.html"), html, "utf8");
}

function renderSlideSvg(slide: SlideRecord, styleEntry: StyleEntry | undefined, theme: ThemeDefinition): string {
  const pageType = styleEntry?.page_type ?? slide.page_type ?? slide.page_type_hint ?? "unknown";
  const palette = theme.palette;
  const defs = `
    <defs>
      <radialGradient id="bgGlow" cx="70%" cy="30%" r="60%">
        <stop offset="0%" stop-color="${withOpacity(palette.accent_primary, 0.18)}" />
        <stop offset="100%" stop-color="${withOpacity(palette.background, 0)}" />
      </radialGradient>
    </defs>
  `;

  const shell = `
    <rect width="${WIDTH}" height="${HEIGHT}" fill="${palette.background}" />
    <rect x="30" y="30" width="${WIDTH - 60}" height="${HEIGHT - 60}" rx="28" fill="none" stroke="rgba(255,255,255,0.08)" />
    <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGlow)" />
    <text x="90" y="92" fill="${palette.text_secondary}" font-family="${theme.typography.font_family}" font-size="18">Enterprise PPT System MVP</text>
    <text x="90" y="164" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="52" font-weight="700">${escapeHtml(slide.title)}</text>
    ${slide.subtitle ? `<text x="90" y="208" fill="${palette.text_secondary}" font-family="${theme.typography.font_family}" font-size="20">${escapeHtml(slide.subtitle)}</text>` : ""}
  `;

  const body = (() => {
    switch (pageType) {
      case "cover_orbit":
        return renderCover(slide, styleEntry, theme);
      case "narrative_map":
        return renderNarrativeMap(slide, theme);
      case "bottleneck_shift":
        return renderBottleneck(slide, styleEntry, theme);
      case "chapter_summary_signal":
        return renderSummary(slide, theme);
      case "trust_terminal":
        return renderTrustTerminal(slide, styleEntry, theme);
      case "layered_architecture_stack":
        return renderLayeredArchitecture(slide, styleEntry, theme);
      default:
        return renderFallback(slide, theme);
    }
  })();

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  ${defs}
  ${shell}
  ${body}
</svg>
`;
}

function renderCover(slide: SlideRecord, styleEntry: StyleEntry | undefined, theme: ThemeDefinition): string {
  const palette = theme.palette;
  const storyPoints = (slide.blocks.story_points as string[] | undefined) ?? [];
  const heroMode = styleEntry?.learned_pattern?.image_usage?.mode === "hero";
  const heroFrame = heroMode
    ? { x: 816, y: 214, w: 632, h: 430, orbitX: 1074, orbitY: 420 }
    : { x: 842, y: 228, w: 588, h: 412, orbitX: 1060, orbitY: 428 };
  return `
    <text x="90" y="242" fill="${palette.accent_primary}" font-family="${theme.typography.font_family}" font-size="18" font-weight="700">CONTROL-FIRST</text>
    <rect x="90" y="266" width="${heroMode ? 594 : 580}" height="130" rx="24" fill="${withOpacity(palette.surface_alt, 0.92)}" stroke="${withOpacity(palette.accent_primary, 0.28)}" />
    <text x="118" y="320" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="30" font-weight="600">${escapeHtml(slide.claim)}</text>
    <rect x="${heroFrame.x}" y="${heroFrame.y}" width="${heroFrame.w}" height="${heroFrame.h}" rx="28" fill="${withOpacity(palette.surface, 0.72)}" stroke="${withOpacity(palette.accent_primary, 0.16)}" />
    <g transform="translate(${heroFrame.orbitX} ${heroFrame.orbitY})">
      <circle cx="0" cy="0" r="148" fill="none" stroke="${withOpacity(palette.accent_primary, 0.22)}" stroke-width="3" />
      <circle cx="0" cy="0" r="102" fill="none" stroke="${withOpacity(palette.accent_secondary, 0.35)}" stroke-width="2.5" />
      <circle cx="0" cy="0" r="56" fill="${palette.accent_primary}" opacity="0.18" />
      <circle cx="0" cy="0" r="34" fill="${palette.accent_primary}" />
      <text x="-38" y="8" fill="${palette.background}" font-family="${theme.typography.font_family}" font-size="20" font-weight="700">CORE</text>
      <path d="M-242 -86 C-174 -86, -120 -36, -96 -8" fill="none" stroke="${withOpacity(palette.accent_primary, 0.28)}" stroke-width="4" />
      <path d="M94 -106 C136 -106, 164 -78, 182 -58" fill="none" stroke="${withOpacity(palette.accent_secondary, 0.28)}" stroke-width="4" />
      <path d="M88 112 C130 118, 160 138, 188 164" fill="none" stroke="${withOpacity(palette.accent_primary, 0.24)}" stroke-width="4" />
      <rect x="-292" y="-118" width="176" height="54" rx="27" fill="${withOpacity(palette.surface, 0.95)}" stroke="${withOpacity(palette.text_secondary, 0.2)}" />
      <text x="-258" y="-84" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="18">Research fidelity</text>
      <rect x="108" y="-144" width="194" height="54" rx="27" fill="${withOpacity(palette.surface, 0.95)}" stroke="${withOpacity(palette.text_secondary, 0.2)}" />
      <text x="138" y="-110" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="18">Editable delivery</text>
      <rect x="124" y="112" width="176" height="54" rx="27" fill="${withOpacity(palette.surface, 0.95)}" stroke="${withOpacity(palette.text_secondary, 0.2)}" />
      <text x="162" y="146" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="18">QA loops</text>
    </g>
    ${storyPoints.map((point, index) => `
      <rect x="${90 + index * 178}" y="706" width="162" height="46" rx="23" fill="${withOpacity(palette.surface, 0.95)}" stroke="${withOpacity(palette.text_secondary, 0.22)}" />
      <text x="${126 + index * 178}" y="735" fill="${palette.text_secondary}" font-family="${theme.typography.font_family}" font-size="18">${escapeHtml(point)}</text>
    `).join("")}
  `;
}

function renderNarrativeMap(slide: SlideRecord, theme: ThemeDefinition): string {
  const palette = theme.palette;
  const blocks = slide.blocks as {
    dominant_chapter?: string;
    supporting_chapters?: string[];
    decision_cue?: string;
  };
  const supporting = blocks.supporting_chapters ?? [];
  const contentTop = 244;
  const contentBottom = 662;
  const leftX = 90;
  const leftW = 650;
  const rightX = 790;
  const rightW = 710;
  const gap = 24;
  const cardH = (contentBottom - contentTop - gap) / 2;
  return `
    <rect x="${leftX}" y="${contentTop}" width="${leftW}" height="${contentBottom - contentTop}" rx="28" fill="${withOpacity(palette.surface_alt, 0.94)}" stroke="${withOpacity(palette.accent_primary, 0.3)}" />
    <text x="132" y="312" fill="${palette.accent_primary}" font-family="${theme.typography.font_family}" font-size="18">01 Dominant chapter</text>
    <text x="132" y="392" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="42" font-weight="700">${escapeHtml(blocks.dominant_chapter ?? "Dominant chapter")}</text>
    <rect x="${rightX}" y="${contentTop}" width="${rightW}" height="${cardH}" rx="24" fill="${withOpacity(palette.surface, 0.92)}" stroke="${withOpacity(palette.text_secondary, 0.2)}" />
    <text x="828" y="328" fill="${palette.accent_secondary}" font-family="${theme.typography.font_family}" font-size="18">02 Supporting chapter</text>
    <text x="828" y="382" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="26" font-weight="600">${escapeHtml(supporting[0] ?? "Supporting chapter")}</text>
    <rect x="${rightX}" y="${contentTop + cardH + gap}" width="${rightW}" height="${cardH}" rx="24" fill="${withOpacity(palette.surface, 0.92)}" stroke="${withOpacity(palette.text_secondary, 0.2)}" />
    <text x="828" y="528" fill="${palette.accent_secondary}" font-family="${theme.typography.font_family}" font-size="18">03 Supporting chapter</text>
    <text x="828" y="578" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="26" font-weight="600">${escapeHtml(supporting[1] ?? "Supporting chapter")}</text>
    <rect x="90" y="728" width="1410" height="74" rx="20" fill="${withOpacity(palette.accent_primary, 0.15)}" stroke="${withOpacity(palette.accent_primary, 0.28)}" />
    <text x="124" y="775" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="24">${escapeHtml(blocks.decision_cue ?? "Decision cue")}</text>
  `;
}

function renderBottleneck(slide: SlideRecord, styleEntry: StyleEntry | undefined, theme: ThemeDefinition): string {
  const palette = theme.palette;
  const blocks = slide.blocks as { primary_statement?: string; support_points?: string[] };
  const support = blocks.support_points ?? [];
  const usesContextualVisual = styleEntry?.learned_pattern?.image_usage?.mode === "contextual";
  const contentTop = 236;
  const contentBottom = 770;
  const rightX = usesContextualVisual ? 778 : 786;
  const rightW = usesContextualVisual ? 698 : 674;
  const rightGap = 20;
  const rightCardH = (contentBottom - contentTop - rightGap * 2) / 3;
  return `
    <text x="90" y="246" fill="${palette.accent_secondary}" font-family="${theme.typography.font_family}" font-size="18" font-weight="700">EXECUTION SHIFT</text>
    <text x="90" y="286" fill="${withOpacity(palette.accent_primary, 0.18)}" font-family="${theme.typography.font_family}" font-size="56" font-weight="700">EXECUTE</text>
    <text x="90" y="364" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="54" font-weight="700">${escapeHtml(blocks.primary_statement ?? slide.claim)}</text>
    <rect x="90" y="452" width="164" height="8" rx="4" fill="${palette.accent_secondary}" />
    <rect x="90" y="480" width="642" height="116" rx="24" fill="${withOpacity(palette.surface_alt, 0.92)}" stroke="${withOpacity(palette.accent_secondary, 0.32)}" />
    <text x="128" y="542" fill="${palette.text_secondary}" font-family="${theme.typography.font_family}" font-size="22">The delivery question changes from generating more text to governing execution, editability, and revision speed.</text>
    <rect x="90" y="${usesContextualVisual ? 618 : 626}" width="${usesContextualVisual ? 655 : 642}" height="${usesContextualVisual ? 154 : 144}" rx="24" fill="${withOpacity(palette.surface, 0.92)}" stroke="${withOpacity(palette.accent_primary, 0.32)}" />
    <g transform="translate(${usesContextualVisual ? 122 : 132} ${usesContextualVisual ? 638 : 646})">
      <rect width="206" height="92" rx="16" fill="${withOpacity(palette.background, 0.74)}" stroke="${withOpacity(palette.accent_primary, 0.22)}"/>
      <circle cx="24" cy="24" r="4" fill="${palette.accent_risk}"/>
      <circle cx="40" cy="24" r="4" fill="${palette.accent_secondary}"/>
      <circle cx="56" cy="24" r="4" fill="${palette.accent_primary}"/>
      <rect x="24" y="44" width="92" height="8" rx="4" fill="${withOpacity(palette.text_secondary, 0.42)}"/>
      <rect x="24" y="64" width="146" height="8" rx="4" fill="${withOpacity(palette.text_secondary, 0.2)}"/>
      <rect x="24" y="82" width="112" height="8" rx="4" fill="${withOpacity(palette.text_secondary, 0.2)}"/>
      <path d="M254 50 C304 8, 374 8, 424 50" fill="none" stroke="${palette.accent_primary}" stroke-opacity="0.72" stroke-width="8" stroke-linecap="round"/>
      <path d="M424 50 C378 90, 302 90, 258 50" fill="none" stroke="${palette.accent_secondary}" stroke-opacity="0.32" stroke-width="6" stroke-linecap="round"/>
      <circle cx="254" cy="50" r="15" fill="${palette.background}" stroke="${withOpacity(palette.accent_primary, 0.58)}" stroke-width="3"/>
      <circle cx="424" cy="50" r="15" fill="${palette.background}" stroke="${withOpacity(palette.accent_secondary, 0.58)}" stroke-width="3"/>
      <rect x="450" y="8" width="94" height="20" rx="10" fill="${withOpacity(palette.background, 0.74)}" stroke="rgba(255,255,255,0.12)"/>
      <text x="476" y="22" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="12">Observe</text>
      <rect x="450" y="36" width="94" height="20" rx="10" fill="${withOpacity(palette.background, 0.74)}" stroke="rgba(255,255,255,0.12)"/>
      <text x="476" y="50" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="12">Execute</text>
      <rect x="450" y="64" width="94" height="20" rx="10" fill="${withOpacity(palette.background, 0.74)}" stroke="rgba(255,255,255,0.12)"/>
      <text x="484" y="78" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="12">Verify</text>
    </g>
    ${support.map((point, index) => `
      <rect x="${rightX}" y="${contentTop + index * (rightCardH + rightGap)}" width="${rightW}" height="${rightCardH}" rx="22" fill="${withOpacity(palette.surface, 0.94)}" stroke="${withOpacity(palette.text_secondary, 0.2)}" />
      <rect x="820" y="${264 + index * (rightCardH + rightGap)}" width="46" height="46" rx="12" fill="${withOpacity(palette.accent_secondary, 0.16)}" stroke="${withOpacity(palette.accent_secondary, 0.24)}" />
      <text x="839" y="${293 + index * (rightCardH + rightGap)}" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="18" font-weight="700">${index + 1}</text>
      <text x="894" y="${272 + index * (rightCardH + rightGap)}" fill="${palette.accent_secondary}" font-family="${theme.typography.font_family}" font-size="18">Support ${index + 1}</text>
      <text x="894" y="${314 + index * (rightCardH + rightGap)}" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="24">${escapeHtml(point)}</text>
    `).join("")}
  `;
}

function renderSummary(slide: SlideRecord, theme: ThemeDefinition): string {
  const palette = theme.palette;
  const blocks = slide.blocks as { summary?: string; implications?: string[]; decision_cue?: string };
  const implications = blocks.implications ?? [];
  return `
    <rect x="90" y="244" width="820" height="430" rx="30" fill="${withOpacity(palette.surface_alt, 0.95)}" stroke="${withOpacity(palette.accent_primary, 0.28)}" />
    <text x="128" y="318" fill="${palette.accent_primary}" font-family="${theme.typography.font_family}" font-size="18">Summary signal</text>
    <text x="128" y="396" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="34" font-weight="700">${escapeHtml(blocks.summary ?? slide.claim)}</text>
    ${implications.map((item, index) => `
      <circle cx="144" cy="${472 + index * 64}" r="7" fill="${palette.accent_secondary}" />
      <text x="168" y="${480 + index * 64}" fill="${palette.text_secondary}" font-family="${theme.typography.font_family}" font-size="22">${escapeHtml(item)}</text>
    `).join("")}
    <rect x="924" y="244" width="576" height="430" rx="30" fill="${withOpacity(palette.surface, 0.94)}" stroke="${withOpacity(palette.accent_secondary, 0.28)}" />
    <text x="964" y="318" fill="${palette.accent_secondary}" font-family="${theme.typography.font_family}" font-size="18">Decision cue</text>
    <text x="964" y="404" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="30" font-weight="700">${escapeHtml(blocks.decision_cue ?? "Decision cue")}</text>
    <text x="964" y="520" fill="${palette.text_secondary}" font-family="${theme.typography.font_family}" font-size="22">The decision is not whether agent execution is interesting. The decision is whether it is governable, editable, and reviewable inside enterprise constraints.</text>
  `;
}

function renderTrustTerminal(slide: SlideRecord, styleEntry: StyleEntry | undefined, theme: ThemeDefinition): string {
  const palette = theme.palette;
  const blocks = slide.blocks as {
    trust_claim?: string;
    governance_labels?: string[];
    terminal_content?: string;
    security_indicators?: string[];
  };
  const governanceLabels = blocks.governance_labels ?? [];
  const securityIndicators = blocks.security_indicators ?? [];
  const indicatorColor = palette.accent_primary;

  // Layout
  const contentTop = 236;
  const leftX = 90;
  const leftW = 700;
  const terminalX = 816;
  const terminalW = 694;
  const terminalH = 420;

  return `
    <!-- Left side: Trust claim -->
    <text x="${leftX}" y="260" fill="${indicatorColor}" font-family="${theme.typography.font_family}" font-size="18" font-weight="700">TRUST ARCHITECTURE</text>
    <text x="${leftX}" y="320" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="36" font-weight="700">${escapeHtml(blocks.trust_claim ?? slide.claim)}</text>
    
    <!-- Governance labels -->
    ${governanceLabels.map((label, index) => `
      <rect x="${leftX}" y="${400 + index * 60}" width="420" height="46" rx="23" fill="${withOpacity(palette.surface, 0.94)}" stroke="${withOpacity(palette.text_secondary, 0.2)}" />
      <text x="${leftX + 24}" y="${430 + index * 60}" fill="${palette.text_secondary}" font-family="${theme.typography.font_family}" font-size="20">${escapeHtml(label)}</text>
    `).join("")}
    
    <!-- Terminal window -->
    <rect x="${terminalX}" y="${contentTop}" width="${terminalW}" height="${terminalH}" rx="24" fill="#1a1a2e" stroke="${withOpacity(palette.accent_primary, 0.5)}" stroke-width="2" />
    <rect x="${terminalX}" y="${contentTop}" width="${terminalW}" height="48" rx="24" fill="#2d2d44" stroke="${withOpacity(palette.accent_primary, 0.5)}" stroke-width="2" />
    
    <!-- Terminal controls -->
    <circle cx="${terminalX + 28}" cy="${contentTop + 24}" r="8" fill="#ff5f56" />
    <circle cx="${terminalX + 52}" cy="${contentTop + 24}" r="8" fill="#ffbd2e" />
    <circle cx="${terminalX + 76}" cy="${contentTop + 24}" r="8" fill="#27c93f" />
    
    <!-- Terminal content -->
    <text x="${terminalX + 32}" y="${contentTop + 100}" fill="#00ff88" font-family="Courier New, monospace" font-size="16">${escapeHtml(blocks.terminal_content ?? "$ agentctl status")}</text>
    
    <!-- Security indicators -->
    ${securityIndicators.map((indicator, index) => `
      <rect x="${terminalX + 32 + index * 220}" y="${contentTop + terminalH + 20}" width="200" height="36" rx="18" fill="${withOpacity(indicatorColor, 0.15)}" stroke="${withOpacity(indicatorColor, 0.3)}" />
      <text x="${terminalX + 52 + index * 220}" y="${contentTop + terminalH + 44}" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="14">✓ ${escapeHtml(indicator)}</text>
    `).join("")}
  `;
}

function renderLayeredArchitecture(slide: SlideRecord, styleEntry: StyleEntry | undefined, theme: ThemeDefinition): string {
  const palette = theme.palette;
  const blocks = slide.blocks as {
    architecture_title?: string;
    layers?: Array<{ name: string; description: string; highlight?: boolean }>;
    cross_cutting?: string[];
  };
  const layers = blocks.layers ?? [];
  const crossCutting = blocks.cross_cutting ?? [];
  
  // Layout
  const contentTop = 280;
  const contentBottom = 780;
  const stackX = 90;
  const stackW = 900;
  const detailX = 1020;
  const detailW = 490;
  
  const layerCount = Math.max(layers.length, 1);
  const layerSpacing = 16;
  const layerHeight = (contentBottom - contentTop - (layerCount - 1) * layerSpacing) / layerCount;

  // alignment_rules: "Right-side details align to the stack's right edge"
  const titleY = contentTop - 40; // Shared title baseline
  
  return `
    <!-- Architecture title -->
    <text x="${stackX}" y="${titleY}" fill="${palette.text_secondary}" font-family="${theme.typography.font_family}" font-size="18">${escapeHtml(blocks.architecture_title ?? "Architecture")}</text>
    
    <!-- Stack layers -->
    ${layers.map((layer, index) => {
      const yPos = contentTop + index * (layerHeight + layerSpacing);
      const isHighlighted = layer.highlight;
      const layerColor = isHighlighted ? palette.accent_primary : palette.surface;
      const transparency = isHighlighted ? 0.2 : 0.06;
      const strokeColor = isHighlighted ? palette.accent_primary : "rgba(255,255,255,0.75)";
      const strokeWidth = isHighlighted ? 2 : 1;
      
      return `
        <rect x="${stackX}" y="${yPos}" width="${stackW}" height="${layerHeight}" rx="16" fill="${withOpacity(layerColor, transparency)}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />
        <text x="${stackX + 24}" y="${yPos + 36}" fill="${isHighlighted ? palette.accent_primary : palette.text_secondary}" font-family="${theme.typography.font_family}" font-size="24" font-weight="700">${layerCount - index}</text>
        <text x="${stackX + 72}" y="${yPos + 32}" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="28" font-weight="700">${escapeHtml(layer.name)}</text>
        <text x="${stackX + 72}" y="${yPos + 64}" fill="${palette.text_secondary}" font-family="${theme.typography.font_family}" font-size="18">${escapeHtml(layer.description)}</text>
      `;
    }).join("")}
    
    <!-- Cross-cutting concerns - distributed to fill available space -->
    ${crossCutting.length > 0 ? (() => {
      const detailCardHeight = 56;
      const detailSpacing = (contentBottom - contentTop - detailCardHeight) / Math.max(crossCutting.length - 1, 1);
      return `
      <text x="${detailX}" y="${titleY}" fill="${palette.text_secondary}" font-family="${theme.typography.font_family}" font-size="18">Cross-cutting concerns</text>
      ${crossCutting.map((item, index) => {
        const yPos = contentTop + index * detailSpacing;
        // Align connector with corresponding layer
        const layerIndex = Math.min(index, layerCount - 1);
        const targetLayerY = contentTop + layerIndex * (layerHeight + layerSpacing) + layerHeight / 2;
        return `
        <line x1="${stackX + stackW}" y1="${targetLayerY}" x2="${detailX - 20}" y2="${yPos + detailCardHeight / 2}" stroke="${withOpacity(palette.accent_secondary, 0.5)}" stroke-width="2" stroke-dasharray="8,4" />
        <rect x="${detailX}" y="${yPos}" width="${detailW}" height="${detailCardHeight}" rx="12" fill="${withOpacity(palette.surface_alt, 0.08)}" stroke="${withOpacity(palette.accent_secondary, 0.24)}" stroke-width="1" />
        <text x="${detailX + 20}" y="${yPos + 36}" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="20">${escapeHtml(item)}</text>
      `;
      }).join("")}
    `;
    })() : ""}
  `;
}

function renderFallback(slide: SlideRecord, theme: ThemeDefinition): string {
  const palette = theme.palette;
  return `
    <rect x="90" y="250" width="1420" height="520" rx="28" fill="${withOpacity(palette.surface, 0.94)}" stroke="${withOpacity(palette.text_secondary, 0.2)}" />
    <text x="128" y="360" fill="${palette.text_primary}" font-family="${theme.typography.font_family}" font-size="32">${escapeHtml(slide.claim)}</text>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function withOpacity(hex: string, opacity: number): string {
  const normalized = hex.replace("#", "");
  const bigint = Number.parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${opacity})`;
}
