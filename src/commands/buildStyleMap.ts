import { loadJsonFile, writeJsonFile } from "../lib/json.js";
import { getArgValue, repoPath } from "../lib/paths.js";
import { loadPageTypeRegistry } from "../lib/style/loadPageTypeRegistry.js";
import { findBestPatternCard } from "../lib/style/loadPatternCards.js";
import { loadTheme } from "../lib/style/loadTheme.js";

type SlidesOutput = {
  deck_title: string;
  theme_hint?: string;
  slides: Array<{
    id: string;
    page_type?: string;
    page_type_hint?: string;
    notes?: {
      visual_anchor?: string;
    };
    layout_hints?: {
      weight_center?: string;
      density_level?: "low" | "medium" | "high";
    };
  }>;
};

type StyleMap = {
  theme_family: string;
  slides: Array<{
    slide_id: string;
    page_type: string;
    visual_anchor: string;
    weight_center: string;
    density_level?: "low" | "medium" | "high";
    component_bindings: string[];
    editable_target: string;
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

export async function buildStyleMapCommand(args: string[]): Promise<void> {
  const slidesPath = getArgValue(args, "--slides");
  if (!slidesPath) {
    throw new Error("Missing required argument: --slides <path>");
  }

  const outPath = getArgValue(args, "--out") ?? repoPath("style", "outputs", "style_map.generated.json");
  const themeId = getArgValue(args, "--theme");

  const slidesOutput = await loadJsonFile<SlidesOutput>(slidesPath);
  const registry = await loadPageTypeRegistry();
  const theme = await loadTheme(themeId ?? slidesOutput.theme_hint ?? registry.theme_family);

  const registryById = new Map(registry.page_types.map((entry) => [entry.id, entry]));
  const styledSlides = await Promise.all(
    slidesOutput.slides.map(async (slide) => {
      const pageType = slide.page_type ?? slide.page_type_hint;
      if (!pageType) {
        throw new Error(`Slide ${slide.id} is missing page_type or page_type_hint`);
      }

      const registryEntry = registryById.get(pageType);
      if (!registryEntry) {
        throw new Error(`Unknown page type: ${pageType} for slide ${slide.id}`);
      }
      const patternCard = await findBestPatternCard(pageType);
      const componentBindings = new Set<string>([registryEntry.visual_anchor]);
      patternCard?.component_recipe?.forEach((component) => componentBindings.add(component));

      return {
        slide_id: slide.id,
        page_type: pageType,
        visual_anchor: patternCard?.visual_anchor ?? slide.notes?.visual_anchor ?? registryEntry.visual_anchor,
        weight_center: patternCard?.weight_center ?? slide.layout_hints?.weight_center ?? registryEntry.weight_center,
        density_level: slide.layout_hints?.density_level ?? registryEntry.density_level,
        component_bindings: Array.from(componentBindings),
        editable_target: patternCard?.editable_target ?? registryEntry.editable_target,
        learned_pattern: patternCard
          ? {
              pattern_id: patternCard.id,
              source_references: patternCard.source_references,
              layout_rules: patternCard.layout_rules,
              alignment_rules: patternCard.alignment_rules,
              highlight_grammar: patternCard.highlight_grammar,
              image_usage: patternCard.image_usage,
              editable_target: patternCard.editable_target
            }
          : undefined
      };
    })
  );

  const styleMap: StyleMap = {
    theme_family: theme.id,
    slides: styledSlides
  };

  await writeJsonFile(outPath, styleMap);
  console.log(`Wrote style map to ${outPath}`);
}
