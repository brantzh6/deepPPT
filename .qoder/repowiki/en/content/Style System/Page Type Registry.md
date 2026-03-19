# Page Type Registry

<cite>
**Referenced Files in This Document**
- [page-type-registry.json](file://style/patterns/page-type-registry.json)
- [loadPageTypeRegistry.ts](file://src/lib/style/loadPageTypeRegistry.ts)
- [loadPatternCards.ts](file://src/lib/style/loadPatternCards.ts)
- [template.pattern-card.json](file://style/patterns/template.pattern-card.json)
- [cover_orbit.openclaw-seed.pattern.json](file://style/patterns/cover_orbit.openclaw-seed.pattern.json)
- [bottleneck_shift.openclaw-seed.pattern.json](file://style/patterns/bottleneck_shift.openclaw-seed.pattern.json)
- [chapter_summary_signal.openclaw-seed.pattern.json](file://style/patterns/chapter_summary_signal.openclaw-seed.pattern.json)
- [buildStyleMap.ts](file://src/commands/buildStyleMap.ts)
- [style_map.schema.json](file://schemas/style_map.schema.json)
- [pattern_card.schema.json](file://schemas/pattern_card.schema.json)
- [slides_output.schema.json](file://schemas/slides_output.schema.json)
- [style-intelligence.md](file://references/style-intelligence.md)
- [template.reference-slide.json](file://style/reference_extractions/template.reference-slide.json)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document describes the page type registry system that classifies and manages slide types in the Enterprise PPT System. The registry defines page types by narrative roles, visual anchors, weight centers, density levels, and editability targets. It also connects page types to pattern cards that encode layout rules, alignment logic, component recipes, and design constraints. The system integrates with the style intelligence pipeline to produce a style map that guides rendering and ensures consistent, strategic design decisions across presentations.

## Project Structure
The page type registry and related assets are organized as follows:
- Registry definition: a JSON file enumerating page types and their attributes.
- Pattern cards: JSON documents that describe how each page type should be composed, including layout rules, alignment rules, component recipes, and anti-patterns.
- Loader utilities: TypeScript modules that load the registry and pattern cards into the runtime.
- Command pipeline: a command that consumes slide outputs and builds a style map by combining registry entries with the best matching pattern cards.
- Schemas: JSON Schema definitions that validate the registry, pattern cards, and style map artifacts.

```mermaid
graph TB
subgraph "Registry and Patterns"
R["page-type-registry.json"]
PC1["cover_orbit.openclaw-seed.pattern.json"]
PC2["bottleneck_shift.openclaw-seed.pattern.json"]
PC3["chapter_summary_signal.openclaw-seed.pattern.json"]
TPL["template.pattern-card.json"]
end
subgraph "Loaders"
LPR["loadPageTypeRegistry.ts"]
LPC["loadPatternCards.ts"]
end
subgraph "Pipeline"
BSM["buildStyleMap.ts"]
end
subgraph "Validation"
SMS["style_map.schema.json"]
PCS["pattern_card.schema.json"]
SOS["slides_output.schema.json"]
end
R --> LPR
PC1 --> LPC
PC2 --> LPC
PC3 --> LPC
TPL --> LPC
LPR --> BSM
LPC --> BSM
BSM --> SMS
BSM --> PCS
BSM --> SOS
```

**Diagram sources**
- [page-type-registry.json:1-115](file://style/patterns/page-type-registry.json#L1-L115)
- [loadPageTypeRegistry.ts:1-21](file://src/lib/style/loadPageTypeRegistry.ts#L1-L21)
- [loadPatternCards.ts:1-48](file://src/lib/style/loadPatternCards.ts#L1-L48)
- [buildStyleMap.ts:1-110](file://src/commands/buildStyleMap.ts#L1-L110)
- [style_map.schema.json:1-34](file://schemas/style_map.schema.json#L1-L34)
- [pattern_card.schema.json:1-49](file://schemas/pattern_card.schema.json#L1-L49)
- [slides_output.schema.json:35-52](file://schemas/slides_output.schema.json#L35-L52)

**Section sources**
- [page-type-registry.json:1-115](file://style/patterns/page-type-registry.json#L1-L115)
- [loadPageTypeRegistry.ts:1-21](file://src/lib/style/loadPageTypeRegistry.ts#L1-L21)
- [loadPatternCards.ts:1-48](file://src/lib/style/loadPatternCards.ts#L1-L48)
- [buildStyleMap.ts:1-110](file://src/commands/buildStyleMap.ts#L1-L110)
- [style_map.schema.json:1-34](file://schemas/style_map.schema.json#L1-L34)
- [pattern_card.schema.json:1-49](file://schemas/pattern_card.schema.json#L1-L49)
- [slides_output.schema.json:35-52](file://schemas/slides_output.schema.json#L35-L52)

## Core Components
- Page Type Registry: A JSON catalog of page types with fields such as identifier, narrative roles, visual anchor, weight center, density level, MVP priority, and editable target. It also carries a registry version and theme family.
- Pattern Cards: JSON documents that capture the compositional and design guidance for a page type, including layout rules, alignment rules, component recipes, highlight grammar, image usage guidance, anti-patterns, and reuse notes.
- Loaders:
  - Registry loader: Loads the registry JSON and exposes a typed interface.
  - Pattern card loader: Scans the patterns directory, loads all pattern cards, and selects the best candidate per page type (preferring seed references when present).
- Style Map Builder: Consumes slide outputs, resolves page types via the registry, augments with pattern card details, and writes a validated style map artifact.

Key responsibilities:
- Classification: Narrative roles and visual anchors classify page types for semantic routing.
- Layout requirements: Pattern cards define layout and alignment rules; registry entries supply defaults.
- Design constraints: Anti-patterns and highlight grammar constrain design choices.
- Editability: Editable target informs whether native shapes/text, hybrid (SVG), or native-only editing is preferred.

**Section sources**
- [page-type-registry.json:1-115](file://style/patterns/page-type-registry.json#L1-L115)
- [loadPageTypeRegistry.ts:1-21](file://src/lib/style/loadPageTypeRegistry.ts#L1-L21)
- [loadPatternCards.ts:1-48](file://src/lib/style/loadPatternCards.ts#L1-L48)
- [buildStyleMap.ts:50-109](file://src/commands/buildStyleMap.ts#L50-L109)

## Architecture Overview
The page type registry participates in a two-stage process:
1. Registry ingestion: The registry is loaded and indexed by page type ID.
2. Pattern augmentation: For each slide, the system resolves the page type, fetches the best pattern card, merges layout hints, and emits a style map.

```mermaid
sequenceDiagram
participant CLI as "CLI"
participant BSM as "buildStyleMap.ts"
participant LPR as "loadPageTypeRegistry.ts"
participant LPC as "loadPatternCards.ts"
participant REG as "page-type-registry.json"
participant PC as "Pattern Cards"
CLI->>BSM : "run with --slides"
BSM->>LPR : "loadPageTypeRegistry()"
LPR->>REG : "read registry JSON"
REG-->>LPR : "registry object"
LPR-->>BSM : "registry"
BSM->>PC : "findBestPatternCard(page_type)"
LPC->>PC : "scan and load pattern cards"
PC-->>LPC : "pattern cards"
LPC-->>BSM : "best pattern card"
BSM->>BSM : "merge registry + pattern card + hints"
BSM-->>CLI : "write style_map.generated.json"
```

**Diagram sources**
- [buildStyleMap.ts:50-109](file://src/commands/buildStyleMap.ts#L50-L109)
- [loadPageTypeRegistry.ts:1-21](file://src/lib/style/loadPageTypeRegistry.ts#L1-L21)
- [loadPatternCards.ts:1-48](file://src/lib/style/loadPatternCards.ts#L1-L48)
- [page-type-registry.json:1-115](file://style/patterns/page-type-registry.json#L1-L115)

## Detailed Component Analysis

### Page Type Registry
The registry encodes page types with:
- Identifier: Unique page type ID.
- Narrative roles: Semantic categories guiding content framing.
- Visual anchor: Dominant compositional element.
- Weight center: Asymmetry bias (e.g., right-middle, center-middle).
- Density level: Low, medium, or high.
- MVP priority: Whether the page type is prioritized for MVP.
- Editable target: Native shapes plus text, hybrid native plus SVG, or native only.

Common page types include:
- Cover: Strategic framing and chapter opener.
- Narrative map: Agenda and chapter framing.
- Trust terminal: Trust explanation and architecture reasoning.
- Closed loop flow: Process and execution loop.
- Bottleneck shift: Paradigm shift and thesis page.
- Evolution split: Transition and before-after.
- Layered architecture stack: Architecture and stack explanation.
- Scenario flow: Workflow and scenario.
- Risk split: Risk contrast and control framing.
- Security control plane: Security architecture and governance.
- Chapter summary signal: Summary and decision implication.
- Closing control first: Closing and call to action.

```mermaid
flowchart TD
Start(["Registry Entry"]) --> ID["Identifier"]
Start --> Roles["Narrative Roles"]
Start --> Anchor["Visual Anchor"]
Start --> WC["Weight Center"]
Start --> Density["Density Level"]
Start --> Priority["MVP Priority"]
Start --> EditTarget["Editable Target"]
ID --> Output["Used by loaders and builder"]
Roles --> Output
Anchor --> Output
WC --> Output
Density --> Output
Priority --> Output
EditTarget --> Output
```

**Diagram sources**
- [page-type-registry.json:4-113](file://style/patterns/page-type-registry.json#L4-L113)

**Section sources**
- [page-type-registry.json:1-115](file://style/patterns/page-type-registry.json#L1-L115)
- [loadPageTypeRegistry.ts:4-16](file://src/lib/style/loadPageTypeRegistry.ts#L4-L16)

### Pattern Cards
Pattern cards provide detailed design guidance for each page type:
- Identifiers and references: Page type, pattern ID, and source references.
- Narrative roles and topic fit: Semantic and topical alignment.
- Visual anchor and weight center: Composition intent.
- Layout rules and alignment rules: Structural and grid constraints.
- Image usage guidance: Required modes and placement.
- Highlight grammar: Color, contrast, and effect strategies.
- Component recipe: Reusable components to bind.
- Editable target: Preferred editability mode.
- Anti-patterns and reuse notes: What to avoid and how to adapt.

```mermaid
classDiagram
class PatternCard {
+string id
+string page_type
+string[] source_references
+string[] narrative_roles
+string[] topic_fit
+string visual_anchor
+string weight_center
+string[] layout_rules
+string[] alignment_rules
+ImageUsage image_usage
+string[] highlight_grammar
+string[] component_recipe
+string editable_target
+string[] anti_patterns
+string[] reuse_notes
}
class ImageUsage {
+boolean required
+string mode
+string placement_guidance
}
```

**Diagram sources**
- [loadPatternCards.ts:7-27](file://src/lib/style/loadPatternCards.ts#L7-L27)
- [template.pattern-card.json:1-46](file://style/patterns/template.pattern-card.json#L1-L46)

**Section sources**
- [loadPatternCards.ts:1-48](file://src/lib/style/loadPatternCards.ts#L1-L48)
- [template.pattern-card.json:1-46](file://style/patterns/template.pattern-card.json#L1-L46)
- [cover_orbit.openclaw-seed.pattern.json:1-46](file://style/patterns/cover_orbit.openclaw-seed.pattern.json#L1-L46)
- [bottleneck_shift.openclaw-seed.pattern.json:1-46](file://style/patterns/bottleneck_shift.openclaw-seed.pattern.json#L1-L46)
- [chapter_summary_signal.openclaw-seed.pattern.json:1-45](file://style/patterns/chapter_summary_signal.openclaw-seed.pattern.json#L1-L45)

### Style Map Builder
The style map builder orchestrates registry and pattern card data into a validated style map:
- Loads slide outputs and the page type registry.
- Resolves each slide’s page type from the slide output or hint.
- Looks up the registry entry and the best pattern card.
- Merges visual anchor, weight center, density level, and editable target from pattern card or registry.
- Aggregates component bindings from the visual anchor and component recipe.
- Emits a style map with required fields and optional learned pattern details.

```mermaid
sequenceDiagram
participant BSM as "buildStyleMap.ts"
participant REG as "Registry"
participant PC as "Pattern Cards"
participant OUT as "Style Map"
BSM->>REG : "lookup page_type"
BSM->>PC : "findBestPatternCard(page_type)"
PC-->>BSM : "pattern card or undefined"
BSM->>BSM : "merge visual_anchor, weight_center, density_level, editable_target"
BSM->>OUT : "write style_map"
```

**Diagram sources**
- [buildStyleMap.ts:63-99](file://src/commands/buildStyleMap.ts#L63-L99)

**Section sources**
- [buildStyleMap.ts:50-109](file://src/commands/buildStyleMap.ts#L50-L109)

### Integration with Style Intelligence
The style intelligence system documents the purpose and structure of the registry and pattern library:
- Purpose: Serve as design memory to guide intentional, strategic expression.
- What to store: Reference samples, pattern library, theme tokens, and component library.
- Extraction guidance: For each reference slide, extract narrative role, page type, visual anchor, weight center, density level, and anti-patterns.
- Pattern card template: Provides a structured YAML template for authoring pattern cards.

```mermaid
flowchart TD
SI["Style Intelligence"] --> RS["Reference Samples"]
SI --> PL["Pattern Library"]
SI --> TH["Theme Tokens"]
SI --> CL["Component Library"]
RS --> EX["Extraction Workflow"]
EX --> SL["Reference Slide"]
SL --> PT["Page Type"]
SL --> VA["Visual Anchor"]
SL --> WC["Weight Center"]
SL --> DL["Density Level"]
SL --> AP["Anti-patterns"]
```

**Diagram sources**
- [style-intelligence.md:1-93](file://references/style-intelligence.md#L1-L93)

**Section sources**
- [style-intelligence.md:1-93](file://references/style-intelligence.md#L1-L93)
- [template.reference-slide.json:1-65](file://style/reference_extractions/template.reference-slide.json#L1-L65)

## Dependency Analysis
The system exhibits clear separation of concerns:
- Registry loader depends on JSON loading and repository path utilities.
- Pattern card loader depends on filesystem scanning and JSON loading.
- Style map builder depends on both loaders and writes to a validated style map artifact.
- Schemas validate registry entries, pattern cards, and style maps.

```mermaid
graph LR
LPR["loadPageTypeRegistry.ts"] --> REG["page-type-registry.json"]
LPC["loadPatternCards.ts"] --> PCS["*.pattern.json"]
BSM["buildStyleMap.ts"] --> LPR
BSM --> LPC
BSM --> SMS["style_map.schema.json"]
LPC --> PCS
BSM --> SMS
BSM --> PCS
BSM --> SOS["slides_output.schema.json"]
```

**Diagram sources**
- [loadPageTypeRegistry.ts:1-21](file://src/lib/style/loadPageTypeRegistry.ts#L1-L21)
- [loadPatternCards.ts:1-48](file://src/lib/style/loadPatternCards.ts#L1-L48)
- [buildStyleMap.ts:1-110](file://src/commands/buildStyleMap.ts#L1-L110)
- [style_map.schema.json:1-34](file://schemas/style_map.schema.json#L1-L34)
- [pattern_card.schema.json:1-49](file://schemas/pattern_card.schema.json#L1-L49)
- [slides_output.schema.json:35-52](file://schemas/slides_output.schema.json#L35-L52)

**Section sources**
- [loadPageTypeRegistry.ts:1-21](file://src/lib/style/loadPageTypeRegistry.ts#L1-L21)
- [loadPatternCards.ts:1-48](file://src/lib/style/loadPatternCards.ts#L1-L48)
- [buildStyleMap.ts:1-110](file://src/commands/buildStyleMap.ts#L1-L110)
- [style_map.schema.json:1-34](file://schemas/style_map.schema.json#L1-L34)
- [pattern_card.schema.json:1-49](file://schemas/pattern_card.schema.json#L1-L49)
- [slides_output.schema.json:35-52](file://schemas/slides_output.schema.json#L35-L52)

## Performance Considerations
- Registry and pattern card loading: Both are lightweight JSON reads. Caching or memoization is unnecessary for typical decks.
- Pattern selection: The best pattern lookup scans all cards and filters by page type; this scales linearly with the number of pattern cards. For large catalogs, consider indexing pattern cards by page type.
- Style map building: Iterates over slides and performs lookups; complexity is O(S) for slides plus O(P) for pattern cards. Parallelization of pattern loading is possible if needed.
- Validation: JSON Schema validation occurs during artifact writing; keep schemas concise and targeted to reduce overhead.

## Troubleshooting Guide
Common issues and resolutions:
- Unknown page type: The style map builder throws if a slide lacks a page type or if the page type is not found in the registry. Ensure the slide output includes a valid page type or page type hint.
- Missing pattern card: If no pattern card matches a page type, the learned pattern section is omitted; the builder still succeeds using registry defaults for layout hints and editable target.
- Schema mismatch: Validate generated artifacts against the style map, pattern card, and slides output schemas to catch field mismatches early.
- Editability conflicts: If a slide’s editable target differs from the pattern card, the builder prefers the pattern card’s editable target; adjust pattern cards or slide hints accordingly.

**Section sources**
- [buildStyleMap.ts:67-74](file://src/commands/buildStyleMap.ts#L67-L74)
- [buildStyleMap.ts:75-98](file://src/commands/buildStyleMap.ts#L75-L98)
- [style_map.schema.json:8-34](file://schemas/style_map.schema.json#L8-L34)
- [pattern_card.schema.json:7-49](file://schemas/pattern_card.schema.json#L7-L49)
- [slides_output.schema.json:35-52](file://schemas/slides_output.schema.json#L35-L52)

## Conclusion
The page type registry system provides a structured, extensible foundation for classifying slide types, encoding layout and design constraints, and integrating with the style intelligence pipeline. By combining registry entries with detailed pattern cards, the system enables automated, strategic design decisions and supports maintainable evolution of presentation requirements.

## Appendices

### Appendix A: Example Page Types and Their Roles
- Cover: Strategic framing and chapter opener.
- Content: Information-rich layouts for explanations and summaries.
- Comparison: Side-by-side contrasts and trade-offs.
- Summary: Conclusive takeaways and decision implications.

These roles inform narrative routing and help select appropriate page types and pattern cards.

**Section sources**
- [page-type-registry.json:4-113](file://style/patterns/page-type-registry.json#L4-L113)

### Appendix B: Custom Page Type Creation Workflow
Steps to add a new page type:
1. Define a new registry entry with identifier, narrative roles, visual anchor, weight center, density level, and editable target.
2. Create a pattern card under the patterns directory with layout rules, alignment rules, component recipe, and anti-patterns.
3. Optionally add a reference slide extraction to capture composition insights.
4. Run the style map builder to validate and incorporate the new page type into the style map.

**Section sources**
- [page-type-registry.json:1-115](file://style/patterns/page-type-registry.json#L1-L115)
- [loadPatternCards.ts:29-48](file://src/lib/style/loadPatternCards.ts#L29-L48)
- [template.pattern-card.json:1-46](file://style/patterns/template.pattern-card.json#L1-L46)
- [template.reference-slide.json:1-65](file://style/reference_extractions/template.reference-slide.json#L1-L65)

### Appendix C: Best Practices for Organization and Maintenance
- Keep narrative roles focused and consistent across related page types.
- Prefer explicit visual anchors and weight centers to enforce composition discipline.
- Use anti-patterns to codify recurring design pitfalls.
- Maintain a clear separation between registry entries and pattern cards to enable independent evolution.
- Validate artifacts with JSON Schemas to ensure compatibility and correctness.

**Section sources**
- [style-intelligence.md:15-23](file://references/style-intelligence.md#L15-L23)
- [style_map.schema.json:8-34](file://schemas/style_map.schema.json#L8-L34)
- [pattern_card.schema.json:7-49](file://schemas/pattern_card.schema.json#L7-L49)