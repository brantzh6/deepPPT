import { readdir } from "node:fs/promises";
import path from "node:path";

import { loadJsonFile } from "../json.js";
import { repoPath } from "../paths.js";

export type PatternCard = {
  id: string;
  page_type: string;
  density_level?: "low" | "medium" | "high";
  source_references: string[];
  narrative_roles: string[];
  topic_fit?: string[];
  visual_anchor: string;
  weight_center: string;
  layout_rules: string[];
  alignment_rules: string[];
  image_usage?: {
    required?: boolean;
    mode?: "hero" | "contextual" | "texture" | "none";
    placement_guidance?: string;
  };
  highlight_grammar?: string[];
  component_recipe?: string[];
  editable_target?: "native_shapes_plus_text" | "hybrid_native_plus_svg" | "native_only";
  anti_patterns: string[];
  reuse_notes?: string[];
};

export async function loadPatternCards(): Promise<PatternCard[]> {
  const patternDir = repoPath("style", "patterns");
  const files = await readdir(patternDir);
  const patternFiles = files.filter((file) => file.endsWith(".pattern.json"));

  return Promise.all(
    patternFiles.map((file) => loadJsonFile<PatternCard>(path.join(patternDir, file)))
  );
}

export async function findBestPatternCard(pageType: string): Promise<PatternCard | undefined> {
  const cards = await loadPatternCards();
  const candidates = cards.filter((card) => card.page_type === pageType);
  if (candidates.length === 0) {
    return undefined;
  }

  const openClawSeed = candidates.find((card) => card.id.includes("openclaw_seed"));
  return openClawSeed ?? candidates[0];
}
