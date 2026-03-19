import { access, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

import { loadJsonFile, writeJsonFile } from "../lib/json.js";
import { getArgValue, repoPath } from "../lib/paths.js";
import { writeSvgPreviews } from "../lib/render/svgPreview.js";
import { ensureVisualAssets } from "../lib/render/visualAssets.js";
import { loadTheme } from "../lib/style/loadTheme.js";

type SlidesOutput = {
  deck_title: string;
  slides: Array<{
    id: string;
    title: string;
    subtitle?: string;
    claim: string;
    page_type?: string;
    page_type_hint?: string;
    blocks: Record<string, unknown>;
  }>;
};

type StyleMap = {
  theme_family: string;
  slides: Array<{
    slide_id: string;
    page_type: string;
    visual_anchor: string;
    weight_center: string;
    component_bindings?: string[];
    editable_target?: string;
    learned_pattern?: {
      pattern_id: string;
      source_references: string[];
      layout_rules: string[];
      alignment_rules: string[];
      highlight_grammar?: string[];
      image_usage?: {
        required?: boolean;
        mode?: "hero" | "contextual" | "texture" | "none";
        placement_guidance?: string;
      };
      editable_target?: string;
    };
  }>;
};

type RenderManifest = {
  deck_id: string;
  version: string;
  generated_at: string;
  outputs: Record<string, string>;
  slide_artifacts: Array<{
    slide_id: string;
    rerendered: boolean;
  }>;
};

type ThemeType = Awaited<ReturnType<typeof loadTheme>>;
type SlideType = SlidesOutput["slides"][number];
type PptxSlide = {
  background: { color: string };
  addShape: (shapeName: string, options?: Record<string, unknown>) => unknown;
  addImage: (options: Record<string, unknown>) => unknown;
  addText: (text: string, options?: Record<string, unknown>) => unknown;
};
type PptxInstance = {
  layout: string;
  author: string;
  company: string;
  subject: string;
  title: string;
  lang: string;
  theme: Record<string, unknown>;
  addSlide: () => PptxSlide;
  writeFile: (props?: { fileName?: string }) => Promise<string>;
};

const SLIDE_W = 13.333;
const SLIDE_H = 7.5;

export async function renderPptxCommand(args: string[]): Promise<void> {
  const require = createRequire(import.meta.url);
  const PptxGenJS = require("pptxgenjs") as new () => PptxInstance;
  const { warnIfSlideHasOverlaps, warnIfSlideElementsOutOfBounds } = require(repoPath("render", "pptxgenjs_helpers", "layout.js")) as {
    warnIfSlideHasOverlaps: (slide: unknown, pptx: unknown) => void;
    warnIfSlideElementsOutOfBounds: (slide: unknown, pptx: unknown) => void;
  };
  const { safeOuterShadow } = require(repoPath("render", "pptxgenjs_helpers", "util.js")) as {
    safeOuterShadow: (color?: string, opacity?: number, angle?: number, blur?: number, offset?: number) => Record<string, unknown>;
  };

  const slidesPath = getArgValue(args, "--slides");
  const styleMapPath = getArgValue(args, "--style-map");

  if (!slidesPath || !styleMapPath) {
    throw new Error("Missing required arguments: --slides <path> --style-map <path>");
  }

  const outManifestPath = getArgValue(args, "--out-manifest") ?? repoPath("output", "delivery", "render-manifest.json");
  const requestedPptxPath = getArgValue(args, "--out-pptx") ?? repoPath("output", "delivery", "mvp-preview-deck.pptx");
  const previewDir = getArgValue(args, "--out-preview-dir") ?? repoPath("output", "preview");
  const themeFile = getArgValue(args, "--theme-file");

  const slidesOutput = await loadJsonFile<SlidesOutput>(slidesPath);
  const styleMap = await loadJsonFile<StyleMap>(styleMapPath);
  const theme = await loadTheme(themeFile ?? styleMap.theme_family);
  const visualAssets = await ensureVisualAssets(path.join(previewDir, "assets"), theme);

  if (slidesOutput.slides.length !== styleMap.slides.length) {
    throw new Error("Slides output and style map do not reference the same number of slides");
  }

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Codex";
  pptx.company = "OpenAI";
  pptx.subject = "Enterprise PPT System MVP";
  pptx.title = slidesOutput.deck_title;
  pptx.lang = "zh-CN";
  pptx.theme = {
    headFontFace: theme.typography.font_family,
    bodyFontFace: theme.typography.font_family,
    lang: "zh-CN"
  };

  const styleBySlideId = new Map(styleMap.slides.map((entry) => [entry.slide_id, entry]));
  for (const slideData of slidesOutput.slides) {
    const styleEntry = styleBySlideId.get(slideData.id);
    if (!styleEntry) {
      throw new Error(`Style map is missing slide ${slideData.id}`);
    }

    const slide = pptx.addSlide();
    addSlideFrame(slide, theme);
    addHeader(slide, slideData, theme);

    switch (styleEntry.page_type) {
      case "cover_orbit":
        renderCoverSlide(slide, slideData, styleEntry, theme, safeOuterShadow, visualAssets.coverOrbitBoard);
        break;
      case "narrative_map":
        renderNarrativeMapSlide(slide, slideData, theme, safeOuterShadow);
        break;
      case "bottleneck_shift":
        renderBottleneckSlide(slide, slideData, styleEntry, theme, safeOuterShadow, visualAssets.controlLoopHero);
        break;
      case "chapter_summary_signal":
        renderSummarySlide(slide, slideData, theme, safeOuterShadow);
        break;
      default:
        renderFallbackSlide(slide, slideData, theme, safeOuterShadow);
        break;
    }

    warnIfSlideHasOverlaps(slide, pptx);
    warnIfSlideElementsOutOfBounds(slide, pptx);
  }

  const outPptxPath = await resolveWritablePptxPath(requestedPptxPath);
  await mkdir(path.dirname(outPptxPath), { recursive: true });
  await mkdir(previewDir, { recursive: true });
  await pptx.writeFile({ fileName: outPptxPath });
  await writeSvgPreviews(slidesOutput.slides, styleBySlideId, theme, previewDir);
  await writeFile(path.join(previewDir, "README.txt"), "Open index.html to review SVG previews.\n", "utf8");

  const manifest: RenderManifest = {
    deck_id: "mvp-deck",
    version: "0.2.0-mvp-preview",
    generated_at: new Date().toISOString(),
    outputs: {
      editable_pptx: outPptxPath,
      preview_svg_dir: previewDir,
      preview_html: path.join(previewDir, "index.html")
    },
    slide_artifacts: slidesOutput.slides.map((slide) => ({
      slide_id: slide.id,
      rerendered: false
    }))
  };

  await writeJsonFile(outManifestPath, manifest);
  console.log(`Rendered editable PPTX to ${outPptxPath}`);
  console.log(`Wrote SVG previews to ${previewDir}`);
  console.log(`Wrote render manifest to ${outManifestPath}`);
}

function addSlideFrame(slide: PptxSlide, theme: ThemeType): void {
  slide.background = { color: theme.palette.background.replace("#", "") };
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: SLIDE_H,
    fill: { color: theme.palette.background.replace("#", "") },
    line: { color: theme.palette.background.replace("#", ""), transparency: 100 }
  });
  slide.addShape("roundRect", {
    x: 0.24,
    y: 0.24,
    w: SLIDE_W - 0.48,
    h: SLIDE_H - 0.48,
    rectRadius: 0.18,
    fill: { color: theme.palette.background.replace("#", ""), transparency: 100 },
    line: { color: "FFFFFF", transparency: 88, width: 1 }
  });
}

function addHeader(slide: PptxSlide, slideData: SlideType, theme: ThemeType): void {
  slide.addText("Enterprise PPT System MVP", {
    x: 0.75,
    y: 0.55,
    w: 3.6,
    h: 0.22,
    fontFace: theme.typography.font_family,
    fontSize: 11,
    color: theme.palette.text_secondary.replace("#", ""),
    margin: 0
  });
  slide.addText(slideData.title, {
    x: 0.75,
    y: 1.02,
    w: 6.1,
    h: 0.42,
    fontFace: theme.typography.font_family,
    fontSize: 26,
    bold: true,
    color: theme.palette.text_primary.replace("#", ""),
    margin: 0
  });
  if (slideData.subtitle) {
    slide.addText(slideData.subtitle, {
      x: 0.75,
      y: 1.62,
      w: 6.9,
      h: 0.28,
      fontFace: theme.typography.font_family,
      fontSize: 11,
      color: theme.palette.text_secondary.replace("#", ""),
      margin: 0
    });
  }
}

function renderCoverSlide(
  slide: PptxSlide,
  slideData: SlideType,
  styleEntry: StyleMap["slides"][number],
  theme: ThemeType,
  safeOuterShadow: ShadowFactory,
  coverOrbitBoardPath: string
): void {
  const heroMode = styleEntry.learned_pattern?.image_usage?.mode === "hero";
  const heroFrame = heroMode
    ? { x: 6.82, y: 1.9, w: 5.46, h: 3.72, imageInset: 0.1 }
    : { x: 7.05, y: 1.98, w: 5.22, h: 3.56, imageInset: 0.11 };
  const claimCardW = heroMode ? 4.95 : 4.82;

  slide.addShape("roundRect", {
    x: 0.75,
    y: 2.06,
    w: claimCardW,
    h: 1.08,
    rectRadius: 0.16,
    fill: { color: theme.palette.surface_alt.replace("#", ""), transparency: 6 },
    line: { color: theme.palette.accent_primary.replace("#", ""), transparency: 68, width: 1.1 },
    shadow: safeOuterShadow("5AC8FA", 0.16, 45, 6, 2)
  });
  slide.addText(slideData.claim, {
    x: 0.98,
    y: 2.3,
    w: 4.35,
    h: 0.58,
    fontFace: theme.typography.font_family,
    fontSize: 19,
    bold: true,
    color: theme.palette.text_primary.replace("#", ""),
    margin: 0
  });

  slide.addShape("roundRect", {
    x: heroFrame.x,
    y: heroFrame.y,
    w: heroFrame.w,
    h: heroFrame.h,
    rectRadius: 0.2,
    fill: { color: theme.palette.surface.replace("#", ""), transparency: 10 },
    line: { color: theme.palette.accent_primary.replace("#", ""), transparency: 84, width: 1 },
    shadow: safeOuterShadow("000000", 0.18, 45, 6, 2)
  });
  slide.addImage({
    path: coverOrbitBoardPath,
    x: heroFrame.x + heroFrame.imageInset,
    y: heroFrame.y + heroFrame.imageInset,
    w: heroFrame.w - heroFrame.imageInset * 2,
    h: heroFrame.h - heroFrame.imageInset * 2
  });

  const storyPoints = (slideData.blocks.story_points as string[] | undefined) ?? [];
  storyPoints.forEach((point, index) => {
    slide.addShape("roundRect", {
      x: 0.75 + index * 1.48,
      y: 6.02,
      w: 1.28,
      h: 0.38,
      rectRadius: 0.18,
      fill: { color: theme.palette.surface.replace("#", ""), transparency: 4 },
      line: { color: "FFFFFF", transparency: 80, width: 1 }
    });
    slide.addText(point, {
      x: 0.95 + index * 1.48,
      y: 6.13,
      w: 0.96,
      h: 0.14,
      fontFace: theme.typography.font_family,
      fontSize: 10,
      color: theme.palette.text_secondary.replace("#", ""),
      margin: 0,
      align: "center"
    });
  });

  const orbitX = heroMode ? 7.42 : 7.56;
  const orbitY = heroMode ? 2.34 : 2.45;
  slide.addShape("ellipse", {
    x: orbitX,
    y: orbitY,
    w: 2.1,
    h: 2.1,
    fill: { color: theme.palette.background.replace("#", ""), transparency: 100 },
    line: { color: theme.palette.accent_primary.replace("#", ""), transparency: 82, width: 1.8 }
  });
  slide.addShape("ellipse", {
    x: orbitX + 0.36,
    y: orbitY + 0.36,
    w: 1.38,
    h: 1.38,
    fill: { color: theme.palette.background.replace("#", ""), transparency: 100 },
    line: { color: theme.palette.accent_secondary.replace("#", ""), transparency: 72, width: 1.4 }
  });
  slide.addShape("ellipse", {
    x: orbitX + 0.66,
    y: orbitY + 0.66,
    w: 0.72,
    h: 0.72,
    fill: { color: theme.palette.accent_primary.replace("#", ""), transparency: 0 },
    line: { color: theme.palette.accent_primary.replace("#", ""), transparency: 100 }
  });
  slide.addText("CORE", {
    x: orbitX + 0.73,
    y: orbitY + 0.89,
    w: 0.56,
    h: 0.16,
    fontFace: theme.typography.font_family,
    fontSize: 10,
    bold: true,
    color: theme.palette.background.replace("#", ""),
    margin: 0,
    align: "center"
  });

}

function renderNarrativeMapSlide(slide: PptxSlide, slideData: SlideType, theme: ThemeType, safeOuterShadow: ShadowFactory): void {
  const blocks = slideData.blocks as {
    dominant_chapter?: string;
    supporting_chapters?: string[];
    decision_cue?: string;
  };
  const supporting = blocks.supporting_chapters ?? [];
  const contentTop = 1.95;
  const contentBottom = 5.42;
  const leftX = 0.75;
  const leftW = 5.55;
  const rightX = 6.7;
  const rightW = 5.6;
  const gutter = 0.22;
  const stackH = contentBottom - contentTop;
  const cardH = (stackH - gutter) / 2;

  slide.addShape("roundRect", {
    x: leftX,
    y: contentTop,
    w: leftW,
    h: stackH,
    rectRadius: 0.18,
    fill: { color: theme.palette.surface_alt.replace("#", ""), transparency: 4 },
    line: { color: theme.palette.accent_primary.replace("#", ""), transparency: 68, width: 1.1 },
    shadow: safeOuterShadow("000000", 0.18, 45, 4, 1)
  });
  slide.addText("01 Dominant chapter", {
    x: 1.02,
    y: 2.25,
    w: 2.1,
    h: 0.2,
    fontFace: theme.typography.font_family,
    fontSize: 12,
    color: theme.palette.accent_primary.replace("#", ""),
    margin: 0
  });
  slide.addText(blocks.dominant_chapter ?? "Dominant chapter", {
    x: 1.02,
    y: 2.78,
    w: 4.65,
    h: 1,
    fontFace: theme.typography.font_family,
    fontSize: 22,
    bold: true,
    color: theme.palette.text_primary.replace("#", ""),
    margin: 0
  });

  addInfoCard(slide, rightX, contentTop, rightW, cardH, "02 Supporting chapter", supporting[0] ?? "Supporting chapter", theme);
  addInfoCard(slide, rightX, contentTop + cardH + gutter, rightW, cardH, "03 Supporting chapter", supporting[1] ?? "Supporting chapter", theme);

  slide.addShape("roundRect", {
    x: 0.75,
    y: 5.95,
    w: 11.55,
    h: 0.56,
    rectRadius: 0.16,
    fill: { color: theme.palette.accent_primary.replace("#", ""), transparency: 82 },
    line: { color: theme.palette.accent_primary.replace("#", ""), transparency: 70, width: 1 }
  });
  slide.addText(blocks.decision_cue ?? "Decision cue", {
    x: 0.98,
    y: 6.11,
    w: 11.0,
    h: 0.18,
    fontFace: theme.typography.font_family,
    fontSize: 13,
    color: theme.palette.text_primary.replace("#", ""),
    margin: 0
  });
}

function renderBottleneckSlide(
  slide: PptxSlide,
  slideData: SlideType,
  styleEntry: StyleMap["slides"][number],
  theme: ThemeType,
  safeOuterShadow: ShadowFactory,
  controlLoopHeroPath: string
): void {
  const blocks = slideData.blocks as { primary_statement?: string; support_points?: string[] };
  const supportPoints = blocks.support_points ?? [];
  const usesContextualVisual = styleEntry.learned_pattern?.image_usage?.mode === "contextual";
  const leftX = 0.75;
  const leftW = usesContextualVisual ? 5.46 : 5.35;
  const rightX = usesContextualVisual ? 6.48 : 6.55;
  const rightW = usesContextualVisual ? 5.82 : 5.75;
  const contentTop = 1.9;
  const contentBottom = 6.42;
  const gap = 0.18;
  const rightCardH = (contentBottom - contentTop - gap * 2) / 3;

  slide.addText("EXECUTION SHIFT", {
    x: leftX,
    y: contentTop,
    w: 2.2,
    h: 0.2,
    fontFace: theme.typography.font_family,
    fontSize: 11,
    bold: true,
    color: theme.palette.accent_secondary.replace("#", ""),
    margin: 0
  });
  slide.addText(blocks.primary_statement ?? slideData.claim, {
    x: leftX,
    y: 2.18,
    w: leftW,
    h: 1.2,
    fontFace: theme.typography.font_family,
    fontSize: 26,
    bold: true,
    color: theme.palette.text_primary.replace("#", ""),
    margin: 0,
    valign: "mid"
  });
  slide.addShape("rect", {
    x: leftX,
    y: 3.88,
    w: 1.4,
    h: 0.06,
    fill: { color: theme.palette.accent_secondary.replace("#", "") },
    line: { color: theme.palette.accent_secondary.replace("#", ""), transparency: 100 }
  });
  slide.addShape("roundRect", {
    x: leftX,
    y: 4.06,
    w: leftW,
    h: 0.98,
    rectRadius: 0.18,
    fill: { color: theme.palette.surface_alt.replace("#", ""), transparency: 4 },
    line: { color: theme.palette.accent_secondary.replace("#", ""), transparency: 68, width: 1.1 },
    shadow: safeOuterShadow("000000", 0.18, 45, 4, 1)
  });
  slide.addText("The delivery question changes from generating more text to governing execution, editability, and revision speed.", {
    x: 1.0,
    y: 4.38,
    w: 4.9,
    h: 0.34,
    fontFace: theme.typography.font_family,
    fontSize: 13,
    color: theme.palette.text_secondary.replace("#", ""),
    margin: 0
  });
  slide.addShape("roundRect", {
    x: leftX,
    y: usesContextualVisual ? 5.2 : 5.26,
    w: leftW,
    h: usesContextualVisual ? 1.22 : 1.16,
    rectRadius: 0.18,
    fill: { color: theme.palette.surface.replace("#", ""), transparency: 8 },
    line: { color: theme.palette.accent_primary.replace("#", ""), transparency: 76, width: 1 },
    shadow: safeOuterShadow("000000", 0.18, 45, 5, 1)
  });
  slide.addImage({
    path: controlLoopHeroPath,
    x: 1.02,
    y: usesContextualVisual ? 5.34 : 5.42,
    w: usesContextualVisual ? 4.58 : 4.36,
    h: usesContextualVisual ? 0.88 : 0.78
  });

  supportPoints.slice(0, 3).forEach((point, index) => {
    addImpactCard(
      slide,
      rightX,
      contentTop + index * (rightCardH + gap),
      rightW,
      rightCardH,
      `Support ${index + 1}`,
      point,
      theme,
      index + 1
    );
  });
}

function renderSummarySlide(slide: PptxSlide, slideData: SlideType, theme: ThemeType, safeOuterShadow: ShadowFactory): void {
  const blocks = slideData.blocks as { summary?: string; implications?: string[]; decision_cue?: string };
  const implications = blocks.implications ?? [];
  const leftX = 0.75;
  const leftW = 6.55;
  const rightX = 7.7;
  const rightW = 4.6;
  const cardTop = 1.95;
  const cardH = 3.9;

  slide.addShape("roundRect", {
    x: leftX,
    y: cardTop,
    w: leftW,
    h: cardH,
    rectRadius: 0.18,
    fill: { color: theme.palette.surface_alt.replace("#", ""), transparency: 4 },
    line: { color: theme.palette.accent_primary.replace("#", ""), transparency: 68, width: 1.1 },
    shadow: safeOuterShadow("000000", 0.18, 45, 4, 1)
  });
  slide.addText("Summary signal", {
    x: 1.02,
    y: 2.23,
    w: 1.6,
    h: 0.2,
    fontFace: theme.typography.font_family,
    fontSize: 12,
    color: theme.palette.accent_primary.replace("#", ""),
    margin: 0
  });
  slide.addText(blocks.summary ?? slideData.claim, {
    x: 1.02,
    y: 2.68,
    w: 5.75,
    h: 1.05,
    fontFace: theme.typography.font_family,
    fontSize: 21,
    bold: true,
    color: theme.palette.text_primary.replace("#", ""),
    margin: 0
  });
  implications.forEach((item, index) => {
    slide.addShape("ellipse", {
      x: 1.05,
      y: 3.97 + index * 0.55,
      w: 0.08,
      h: 0.08,
      fill: { color: theme.palette.accent_secondary.replace("#", ""), transparency: 0 },
      line: { color: theme.palette.accent_secondary.replace("#", ""), transparency: 100 }
    });
    slide.addText(item, {
      x: 1.22,
      y: 3.9 + index * 0.55,
      w: 5.25,
      h: 0.22,
      fontFace: theme.typography.font_family,
      fontSize: 13,
      color: theme.palette.text_secondary.replace("#", ""),
      margin: 0
    });
  });

  slide.addShape("roundRect", {
    x: rightX,
    y: cardTop,
    w: rightW,
    h: cardH,
    rectRadius: 0.18,
    fill: { color: theme.palette.surface.replace("#", ""), transparency: 4 },
    line: { color: theme.palette.accent_secondary.replace("#", ""), transparency: 68, width: 1.1 },
    shadow: safeOuterShadow("000000", 0.18, 45, 4, 1)
  });
  slide.addText("Decision cue", {
    x: 8.0,
    y: 2.23,
    w: 1.6,
    h: 0.18,
    fontFace: theme.typography.font_family,
    fontSize: 12,
    color: theme.palette.accent_secondary.replace("#", ""),
    margin: 0
  });
  slide.addText(blocks.decision_cue ?? "Decision cue", {
    x: 8.0,
    y: 2.8,
    w: 3.82,
    h: 1.12,
    fontFace: theme.typography.font_family,
    fontSize: 19,
    bold: true,
    color: theme.palette.text_primary.replace("#", ""),
    margin: 0
  });
  slide.addText("The decision is not whether agent execution is interesting. The decision is whether it is governable, editable, and reviewable inside enterprise constraints.", {
    x: 8.0,
    y: 4.18,
    w: 3.78,
    h: 0.88,
    fontFace: theme.typography.font_family,
    fontSize: 13.5,
    color: theme.palette.text_secondary.replace("#", ""),
    margin: 0
  });
}

function renderFallbackSlide(slide: PptxSlide, slideData: SlideType, theme: ThemeType, safeOuterShadow: ShadowFactory): void {
  slide.addShape("roundRect", {
    x: 0.75,
    y: 2.0,
    w: 11.5,
    h: 4.2,
    rectRadius: 0.18,
    fill: { color: theme.palette.surface.replace("#", ""), transparency: 4 },
    line: { color: "FFFFFF", transparency: 80, width: 1 },
    shadow: safeOuterShadow("000000", 0.18, 45, 4, 1)
  });
  slide.addText(slideData.claim, {
    x: 1.08,
    y: 2.6,
    w: 10.7,
    h: 1.2,
    fontFace: theme.typography.font_family,
    fontSize: 22,
    color: theme.palette.text_primary.replace("#", ""),
    margin: 0
  });
}

function addPill(slide: PptxSlide, x: number, y: number, w: number, label: string, theme: ThemeType): void {
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h: 0.42,
    rectRadius: 0.2,
    fill: { color: theme.palette.surface.replace("#", ""), transparency: 4 },
    line: { color: "FFFFFF", transparency: 80, width: 1 }
  });
  slide.addText(label, {
    x: x + 0.12,
    y: y + 0.12,
    w: w - 0.24,
    h: 0.14,
    fontFace: theme.typography.font_family,
    fontSize: 10,
    color: theme.palette.text_primary.replace("#", ""),
    margin: 0,
    align: "center"
  });
}

function addInfoCard(slide: PptxSlide, x: number, y: number, w: number, h: number, label: string, text: string, theme: ThemeType): void {
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h,
    rectRadius: 0.18,
    fill: { color: theme.palette.surface.replace("#", ""), transparency: 4 },
    line: { color: "FFFFFF", transparency: 82, width: 1 }
  });
  slide.addText(label, {
    x: x + 0.28,
    y: y + 0.18,
    w: 1.8,
    h: 0.18,
    fontFace: theme.typography.font_family,
    fontSize: 11,
    color: theme.palette.accent_secondary.replace("#", ""),
    margin: 0
  });
  slide.addText(text, {
    x: x + 0.28,
    y: y + 0.5,
    w: w - 0.55,
    h: h - 0.62,
    fontFace: theme.typography.font_family,
    fontSize: 14,
    color: theme.palette.text_primary.replace("#", ""),
    margin: 0,
    valign: "mid"
  });
}

function addImpactCard(
  slide: PptxSlide,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  text: string,
  theme: ThemeType,
  step: number
): void {
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h,
    rectRadius: 0.18,
    fill: { color: theme.palette.surface.replace("#", ""), transparency: 4 },
    line: { color: "FFFFFF", transparency: 82, width: 1 }
  });
  slide.addShape("roundRect", {
    x: x + 0.24,
    y: y + 0.22,
    w: 0.44,
    h: 0.44,
    rectRadius: 0.12,
    fill: { color: theme.palette.accent_secondary.replace("#", ""), transparency: 10 },
    line: { color: theme.palette.accent_secondary.replace("#", ""), transparency: 80, width: 1 }
  });
  slide.addText(`${step}`, {
    x: x + 0.39,
    y: y + 0.34,
    w: 0.14,
    h: 0.12,
    fontFace: theme.typography.font_family,
    fontSize: 10,
    bold: true,
    color: theme.palette.text_primary.replace("#", ""),
    margin: 0,
    align: "center"
  });
  slide.addText(label, {
    x: x + 0.78,
    y: y + 0.22,
    w: 1.8,
    h: 0.16,
    fontFace: theme.typography.font_family,
    fontSize: 11,
    color: theme.palette.accent_secondary.replace("#", ""),
    margin: 0
  });
  slide.addText(text, {
    x: x + 0.78,
    y: y + 0.48,
    w: w - 1.04,
    h: 0.32,
    fontFace: theme.typography.font_family,
    fontSize: 13.5,
    color: theme.palette.text_primary.replace("#", ""),
    margin: 0
  });
}

type ShadowFactory = (color?: string, opacity?: number, angle?: number, blur?: number, offset?: number) => Record<string, unknown>;

async function resolveWritablePptxPath(requestedPath: string): Promise<string> {
  try {
    await access(requestedPath);
    const stamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
    const parsed = path.parse(requestedPath);
    return path.join(parsed.dir, `${parsed.name}-${stamp}${parsed.ext}`);
  } catch {
    return requestedPath;
  }
}
