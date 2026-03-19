import { loadPageTypeRegistry } from "../lib/style/loadPageTypeRegistry.js";
import { loadTheme } from "../lib/style/loadTheme.js";

export async function inspectStyleCommand(): Promise<void> {
  const registry = await loadPageTypeRegistry();
  const theme = await loadTheme(registry.theme_family);

  const mvpPageTypes = registry.page_types.filter((pageType) => pageType.mvp_priority).map((pageType) => pageType.id);

  console.log(`Theme: ${theme.name} (${theme.id})`);
  console.log(`Page types: ${registry.page_types.length}`);
  console.log(`MVP page types: ${mvpPageTypes.join(", ")}`);
}
