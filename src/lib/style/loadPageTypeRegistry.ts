import { loadJsonFile } from "../json.js";
import { repoPath } from "../paths.js";

export type PageTypeRegistry = {
  registry_version: string;
  theme_family: string;
  page_types: Array<{
    id: string;
    narrative_roles: string[];
    visual_anchor: string;
    weight_center: string;
    density_level: "low" | "medium" | "high";
    mvp_priority: boolean;
    editable_target: string;
  }>;
};

export async function loadPageTypeRegistry(): Promise<PageTypeRegistry> {
  return loadJsonFile<PageTypeRegistry>(repoPath("style", "patterns", "page-type-registry.json"));
}
