import { readdir } from "node:fs/promises";
import path from "node:path";

import { loadJsonFile } from "./json.js";
import { repoPath } from "./paths.js";

export type SchemaEntry = {
  id: string;
  schema: object;
};

export async function getSchemaCatalog(): Promise<SchemaEntry[]> {
  const schemaDir = repoPath("schemas");
  const files = await readdir(schemaDir);
  const schemaFiles = files.filter((file: string) => file.endsWith(".schema.json"));

  return Promise.all(
    schemaFiles.map(async (file: string) => ({
      id: file,
      schema: await loadJsonFile<object>(path.join(schemaDir, file))
    }))
  );
}
