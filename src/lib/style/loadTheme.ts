import { loadJsonFile } from "../json.js";
import { repoPath } from "../paths.js";

export type ThemeDefinition = {
  id: string;
  name: string;
  palette: Record<string, string>;
  typography: {
    font_family: string;
    title_size: number;
    subtitle_size?: number;
    body_size: number;
    caption_size?: number;
  };
  spacing: Record<string, number>;
  radius?: Record<string, number>;
  borders?: Record<string, unknown>;
  shadows?: Record<string, unknown>;
  backgrounds?: Record<string, unknown>;
};

export async function loadTheme(themeIdOrPath: string): Promise<ThemeDefinition> {
  const themePath = themeIdOrPath.endsWith(".json")
    ? themeIdOrPath
    : repoPath("style", "themes", `${themeIdOrPath}.theme.json`);

  return loadJsonFile<ThemeDefinition>(themePath);
}
