import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFilePath = fileURLToPath(import.meta.url);
const srcDir = path.dirname(path.dirname(currentFilePath));

export const repoRoot = path.dirname(srcDir);

export function repoPath(...segments: string[]): string {
  return path.join(repoRoot, ...segments);
}

export function getArgValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1 || index === args.length - 1) {
    return undefined;
  }
  return args[index + 1];
}
