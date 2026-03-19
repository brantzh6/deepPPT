import Ajv2020 from "ajv/dist/2020.js";

import { loadJsonFile } from "../lib/json.js";
import { repoPath } from "../lib/paths.js";
import { getSchemaCatalog } from "../lib/schemaCatalog.js";

export async function validateContractsCommand(): Promise<void> {
  type Validator = ((data: unknown) => boolean) & { errors?: unknown[] };
  type AjvLike = {
    addSchema: (schema: object, id?: string) => void;
    getSchema: (id: string) => Validator | undefined;
    errorsText: (errors?: unknown[] | null, options?: { separator?: string }) => string;
  };

  const AjvConstructor = Ajv2020 as unknown as new (options: {
    allErrors: boolean;
    strict: boolean;
  }) => AjvLike;
  const ajv = new AjvConstructor({ allErrors: true, strict: false });
  const catalog = await getSchemaCatalog();

  for (const schemaEntry of catalog) {
    ajv.addSchema(schemaEntry.schema, schemaEntry.id);
  }

  const examples = [
    {
      schemaId: "research_output.schema.json",
      path: repoPath("schemas", "research_output.example.json")
    },
    {
      schemaId: "storyline_output.schema.json",
      path: repoPath("schemas", "storyline_output.example.json")
    },
    {
      schemaId: "slides_output.schema.json",
      path: repoPath("schemas", "slides_output.example.json")
    },
    {
      schemaId: "reference_slide_extraction.schema.json",
      path: repoPath("examples", "reference_slide_extraction.example.json")
    },
    {
      schemaId: "pattern_card.schema.json",
      path: repoPath("examples", "pattern_card.example.json")
    },
    {
      schemaId: "reference_slide_extraction.schema.json",
      path: repoPath("style", "reference_extractions", "template.reference-slide.json")
    },
    {
      schemaId: "reference_slide_extraction.schema.json",
      path: repoPath("style", "reference_extractions", "openclaw-executive--seed-01--cover-orbit.json")
    },
    {
      schemaId: "reference_slide_extraction.schema.json",
      path: repoPath("style", "reference_extractions", "openclaw-executive--seed-02--bottleneck-shift.json")
    },
    {
      schemaId: "reference_slide_extraction.schema.json",
      path: repoPath("style", "reference_extractions", "openclaw-executive--seed-03--chapter-summary-signal.json")
    },
    {
      schemaId: "pattern_card.schema.json",
      path: repoPath("style", "patterns", "template.pattern-card.json")
    },
    {
      schemaId: "pattern_card.schema.json",
      path: repoPath("style", "patterns", "cover_orbit.openclaw-seed.pattern.json")
    },
    {
      schemaId: "pattern_card.schema.json",
      path: repoPath("style", "patterns", "bottleneck_shift.openclaw-seed.pattern.json")
    },
    {
      schemaId: "pattern_card.schema.json",
      path: repoPath("style", "patterns", "chapter_summary_signal.openclaw-seed.pattern.json")
    },
    {
      schemaId: "benchmark_gallery.schema.json",
      path: repoPath("style", "reference_extractions", "benchmark-gallery.json")
    }
  ];

  for (const example of examples) {
    const validate = ajv.getSchema(example.schemaId);
    if (!validate) {
      throw new Error(`Missing validator for ${example.schemaId}`);
    }

    const data = await loadJsonFile<unknown>(example.path);
    const valid = validate(data);
    if (!valid) {
      const detail = ajv.errorsText(validate.errors, { separator: "\n" });
      throw new Error(`Validation failed for ${example.path}\n${detail}`);
    }
    console.log(`Validated ${example.path}`);
  }
}
