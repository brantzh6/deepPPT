import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export async function loadJsonFile<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  const content = `${JSON.stringify(data, null, 2)}\n`;
  await writeFile(filePath, content, "utf8");
}
