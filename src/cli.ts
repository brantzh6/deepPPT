import { buildStyleMapCommand } from "./commands/buildStyleMap.js";
import { inspectStyleCommand } from "./commands/inspectStyle.js";
import { renderPptxCommand } from "./commands/renderPptx.js";
import { rerenderPagesCommand } from "./commands/rerenderPages.js";
import { storyToSlidesCommand } from "./commands/storyToSlides.js";
import { validateContractsCommand } from "./commands/validateContracts.js";

type CommandHandler = (args: string[]) => Promise<void>;

const commands: Record<string, CommandHandler> = {
  "build-style-map": buildStyleMapCommand,
  "inspect-style": inspectStyleCommand,
  "render-pptx": renderPptxCommand,
  "rerender-pages": rerenderPagesCommand,
  "story-to-slides": storyToSlidesCommand,
  "validate-contracts": validateContractsCommand
};

async function main(): Promise<void> {
  const [, , commandName, ...args] = process.argv;

  if (!commandName || commandName === "help" || commandName === "--help") {
    printHelp();
    process.exitCode = commandName ? 0 : 1;
    return;
  }

  const handler = commands[commandName];
  if (!handler) {
    console.error(`Unknown command: ${commandName}`);
    printHelp();
    process.exitCode = 1;
    return;
  }

  await handler(args);
}

function printHelp(): void {
  console.log(`Usage: tsx src/cli.ts <command> [options]

Commands:
  validate-contracts
  inspect-style
  build-style-map --slides <path> [--out <path>] [--theme <id>]
  story-to-slides --research <path> [--out-storyline <path>] [--out-slides <path>]
  render-pptx --slides <path> --style-map <path> [--theme-file <path>] [--out-manifest <path>]
  rerender-pages --manifest <path> --slides <slide1,slide2>
`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
