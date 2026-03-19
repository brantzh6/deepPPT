import { loadJsonFile, writeJsonFile } from "../lib/json.js";
import { getArgValue } from "../lib/paths.js";

type RenderManifest = {
  deck_id: string;
  version: string;
  generated_at: string;
  outputs: Record<string, string>;
  slide_artifacts?: Array<{
    slide_id: string;
    rerendered?: boolean;
  }>;
};

export async function rerenderPagesCommand(args: string[]): Promise<void> {
  const manifestPath = getArgValue(args, "--manifest");
  const slideIds = getArgValue(args, "--slides");

  if (!manifestPath || !slideIds) {
    throw new Error("Missing required arguments: --manifest <path> --slides <id1,id2>");
  }

  const requestedIds = new Set(slideIds.split(",").map((item) => item.trim()).filter(Boolean));
  if (requestedIds.size === 0) {
    throw new Error("No slide ids provided to --slides");
  }

  const manifest = await loadJsonFile<RenderManifest>(manifestPath);
  const slideArtifacts = manifest.slide_artifacts ?? [];

  manifest.slide_artifacts = slideArtifacts.map((artifact) => ({
    ...artifact,
    rerendered: requestedIds.has(artifact.slide_id)
  }));
  manifest.generated_at = new Date().toISOString();

  await writeJsonFile(manifestPath, manifest);
  console.log(`Marked rerender request for ${requestedIds.size} slide(s) in ${manifestPath}`);
}
