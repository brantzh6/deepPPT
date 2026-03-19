# Style System

<cite>
**Referenced Files in This Document**
- [dark-enterprise-tech.theme.json](file://style/themes/dark-enterprise-tech.theme.json)
- [page-type-registry.json](file://style/patterns/page-type-registry.json)
- [template.pattern-card.json](file://style/patterns/template.pattern-card.json)
- [narrative_map.openclaw-seed.pattern.json](file://style/patterns/narrative_map.openclaw-seed.pattern.json)
- [trust_terminal.openclaw-seed.pattern.json](file://style/patterns/trust_terminal.openclaw-seed.pattern.json)
- [layered_architecture_stack.openclaw-seed.pattern.json](file://style/patterns/layered_architecture_stack.openclaw-seed.pattern.json)
- [bottleneck_shift.openclaw-seed.pattern.json](file://style/patterns/bottleneck_shift.openclaw-seed.pattern.json)
- [chapter_summary_signal.openclaw-seed.pattern.json](file://style/patterns/chapter_summary_signal.openclaw-seed.pattern.json)
- [cover_orbit.openclaw-seed.pattern.json](file://style/patterns/cover_orbit.openclaw-seed.pattern.json)
- [openclaw-executive--seed-01--cover-orbit.json](file://style/reference_extractions/openclaw-executive--seed-01--cover-orbit.json)
- [theme.schema.json](file://schemas/theme.schema.json)
- [pattern_card.schema.json](file://schemas/pattern_card.schema.json)
- [buildStyleMap.ts](file://src/commands/buildStyleMap.ts)
- [inspectStyle.ts](file://src/commands/inspectStyle.ts)
- [style_map.generated.json](file://style/outputs/style_map.generated.json)
</cite>

## Update Summary
**Changes Made**
- Added documentation for three new pattern cards: narrative_map, trust_terminal, and layered_architecture_stack
- Updated pattern card examples to include the new page types
- Enhanced pattern matching examples with new pattern cards
- Updated style resolution examples to reflect new patterns in the style map
- Expanded pattern creation guidelines with new page type categories

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
This document describes the Enterprise PPT System's design intelligence layer with a focus on the style system. It explains how themes define consistent visual foundations, how page types classify slides, and how pattern cards encode reusable design components. The system now includes three new pattern cards for specialized page types: narrative_map for agenda and chapter framing, trust_terminal for trust explanation and architecture reasoning, and layered_architecture_stack for architecture explanation and stack visualization. It also documents the relationships among themes, patterns, and page types, the style resolution process, and how the system integrates with the rendering pipeline. Practical examples illustrate theme customization, pattern creation, and component composition, along with best practices for extensibility and maintenance.

## Project Structure
The style system is organized around three pillars:
- Themes: JSON-defined visual foundations (colors, typography, spacing, radii, borders, shadows, backgrounds).
- Page Types: A registry that categorizes slides by narrative and visual roles, anchors, and layout characteristics.
- Pattern Cards: JSON specifications of proven slide compositions, including component recipes, alignment rules, and anti-patterns.

```mermaid
graph TB
subgraph "Style Layer"
THEME["Theme JSON<br/>style/themes/dark-enterprise-tech.theme.json"]
REG["Page Type Registry<br/>style/patterns/page-type-registry.json"]
PATTERNS["Pattern Cards<br/>style/patterns/*.pattern.json"]
SCHEMAS["JSON Schemas<br/>schemas/*.schema.json"]
end
subgraph "Commands"
BUILD["buildStyleMap.ts<br/>CLI command"]
INSPECT["inspectStyle.ts<br/>CLI command"]
end
subgraph "Outputs"
MAP["style_map.generated.json<br/>style/outputs/style_map.generated.json"]
end
SCHEMAS --> THEME
SCHEMAS --> PATTERNS
THEME --> BUILD
REG --> BUILD
PATTERNS --> BUILD
BUILD --> MAP
INSPECT --> THEME
INSPECT --> REG
```

**Diagram sources**
- [dark-enterprise-tech.theme.json:1-55](file://style/themes/dark-enterprise-tech.theme.json#L1-L55)
- [page-type-registry.json:1-115](file://style/patterns/page-type-registry.json#L1-L115)
- [template.pattern-card.json:1-46](file://style/patterns/template.pattern-card.json#L1-L46)
- [buildStyleMap.ts:1-110](file://src/commands/buildStyleMap.ts#L1-L110)
- [inspectStyle.ts:1-14](file://src/commands/inspectStyle.ts#L1-L14)
- [style_map.generated.json:1-261](file://style/outputs/style_map.generated.json#L1-L261)

**Section sources**
- [dark-enterprise-tech.theme.json:1-55](file://style/themes/dark-enterprise-tech.theme.json#L1-L55)
- [page-type-registry.json:1-115](file://style/patterns/page-type-registry.json#L1-L115)
- [template.pattern-card.json:1-46](file://style/patterns/template.pattern-card.json#L1-L46)
- [buildStyleMap.ts:1-110](file://src/commands/buildStyleMap.ts#L1-L110)
- [inspectStyle.ts:1-14](file://src/commands/inspectStyle.ts#L1-L14)
- [style_map.generated.json:1-261](file://style/outputs/style_map.generated.json#L1-L261)

## Core Components
- Theme: Defines palette, typography, spacing, radius, borders, shadows, and backgrounds. Used to resolve concrete visual attributes during rendering.
- Page Type Registry: Associates each slide with a canonical page type, including narrative roles, visual anchor, weight center, density level, and editable target.
- Pattern Card: Encodes a reusable slide composition with component recipe, layout and alignment rules, highlight grammar, image usage guidance, and anti-patterns.
- Style Map: The output of style resolution, binding each slide to a page type, visual anchor, weight center, density level, component bindings, editable target, and optionally a learned pattern.

**Section sources**
- [dark-enterprise-tech.theme.json:1-55](file://style/themes/dark-enterprise-tech.theme.json#L1-L55)
- [page-type-registry.json:1-115](file://style/patterns/page-type-registry.json#L1-L115)
- [template.pattern-card.json:1-46](file://style/patterns/template.pattern-card.json#L1-L46)
- [buildStyleMap.ts:24-48](file://src/commands/buildStyleMap.ts#L24-L48)
- [style_map.generated.json:1-261](file://style/outputs/style_map.generated.json#L1-L261)

## Architecture Overview
The style system resolves a set of narrative-driven slide definitions into a style map that guides the rendering pipeline. The process:
- Load a theme (explicit or inferred from registry/theme family).
- Load the page type registry.
- For each slide, resolve page type and compute style properties.
- Find the best pattern card for the page type.
- Merge registry defaults with pattern overrides to produce component bindings and editable target.
- Write the style map for downstream rendering.

```mermaid
sequenceDiagram
participant CLI as "CLI"
participant Build as "buildStyleMap.ts"
participant Theme as "loadTheme()"
participant Registry as "loadPageTypeRegistry()"
participant Patterns as "findBestPatternCard()"
participant Writer as "writeJsonFile"
CLI->>Build : "run with --slides, optional --theme, optional --out"
Build->>Registry : "loadPageTypeRegistry()"
Build->>Theme : "loadTheme(themeId or slidesOutput.theme_hint or registry.theme_family)"
loop for each slide
Build->>Registry : "lookup page_type or page_type_hint"
Build->>Patterns : "findBestPatternCard(page_type)"
Build->>Build : "merge registry + pattern defaults"
end
Build->>Writer : "write style_map.generated.json"
Writer-->>CLI : "success"
```

**Diagram sources**
- [buildStyleMap.ts:50-109](file://src/commands/buildStyleMap.ts#L50-L109)
- [page-type-registry.json:1-115](file://style/patterns/page-type-registry.json#L1-L115)
- [style_map.generated.json:1-261](file://style/outputs/style_map.generated.json#L1-L261)

## Detailed Component Analysis

### Theme Management
Themes encapsulate the visual foundation. They include:
- Palette: background, surface, text, accents, and grid.
- Typography: font family and sizes.
- Spacing: named units (xs, sm, md, lg, xl).
- Radius and Borders: shape and border definitions.
- Shadows: card and special glows.
- Backgrounds: base, overlay, hero descriptors.

Validation is enforced via a JSON schema that requires core keys and allows additional properties for extensibility.

Practical customization tips:
- Keep palette harmonious; limit accent usage to reinforce hierarchy.
- Align typography scales with content density expectations per page type.
- Use spacing consistently across components to maintain rhythm.
- Define shadow and glow sparingly to avoid visual noise.

**Section sources**
- [dark-enterprise-tech.theme.json:1-55](file://style/themes/dark-enterprise-tech.theme.json#L1-L55)
- [theme.schema.json:1-58](file://schemas/theme.schema.json#L1-L58)

### Page Type Registry
The registry classifies slides by:
- Canonical id and narrative roles.
- Visual anchor (component id that anchors the composition).
- Weight center (layout balance hint).
- Density level (low/medium/high).
- Editable target (rendering mode for authoring flexibility).

This enables consistent classification and fallback behavior when pattern matching is incomplete. The registry now includes three new page types:
- **narrative_map**: Agenda and chapter framing pages with dominant left-side chapter cards and supporting right-side stacks
- **trust_terminal**: Trust explanation and architecture reasoning pages centered around terminal windows with layered security context
- **layered_architecture_stack**: Architecture explanation and stack visualization pages with vertically stacked architectural layers

**Section sources**
- [page-type-registry.json:1-115](file://style/patterns/page-type-registry.json#L1-L115)

### Pattern Card System
Pattern cards capture reusable slide compositions:
- Identification and page type linkage.
- Narrative roles and topic fit.
- Visual anchor and weight center.
- Layout and alignment rules.
- Highlight grammar and image usage guidance.
- Component recipe (ordered list of components).
- Editable target and anti-patterns.
- Reuse notes and source references.

Pattern cards are discovered by page type and merged into the style map, enriching the resolved slide with learned composition guidance.

Examples:
- Cover Orbit: emphasizes a right-side hero balanced by a left headline stack.
- Bottleneck Shift: prioritizes a large thesis with grounded supporting visuals.
- Chapter Summary Signal: focuses on a dominant takeaway with a compact signal cue.
- **Narrative Map**: establishes narrative priority with a dominant left-side chapter card and supporting right-side stack, plus a decision cue band at the bottom.
- **Trust Terminal**: centers on a terminal window as the dominant trust object with layered security context, using the right side for the terminal and left side for trust claims.
- **Layered Architecture Stack**: vertically stacks architectural layers with distinct visual treatment, using the left side for labels and right side for details.

**Updated** Added three new pattern cards with specialized design specifications for agenda management, trust explanation, and architecture visualization.

**Section sources**
- [template.pattern-card.json:1-46](file://style/patterns/template.pattern-card.json#L1-L46)
- [narrative_map.openclaw-seed.pattern.json:1-52](file://style/patterns/narrative_map.openclaw-seed.pattern.json#L1-L52)
- [trust_terminal.openclaw-seed.pattern.json:1-53](file://style/patterns/trust_terminal.openclaw-seed.pattern.json#L1-L53)
- [layered_architecture_stack.openclaw-seed.pattern.json:1-55](file://style/patterns/layered_architecture_stack.openclaw-seed.pattern.json#L1-L55)
- [cover_orbit.openclaw-seed.pattern.json:1-46](file://style/patterns/cover_orbit.openclaw-seed.pattern.json#L1-L46)
- [bottleneck_shift.openclaw-seed.pattern.json:1-46](file://style/patterns/bottleneck_shift.openclaw-seed.pattern.json#L1-L46)
- [chapter_summary_signal.openclaw-seed.pattern.json:1-45](file://style/patterns/chapter_summary_signal.openclaw-seed.pattern.json#L1-L45)

### Style Resolution and Pattern Matching
The resolution algorithm:
- Validates presence of page_type or page_type_hint.
- Resolves registry entry by id.
- Finds the best pattern card for the page type.
- Merges defaults:
  - visual_anchor: pattern override > slide hint > registry fallback.
  - weight_center: pattern override > slide hint > registry fallback.
  - density_level: slide hint > registry fallback.
  - component_bindings: starts with registry visual_anchor, adds pattern component_recipe.
  - editable_target: pattern override > registry fallback.
- Produces learned_pattern metadata when a pattern is applied.

```mermaid
flowchart TD
Start(["Resolve Slide"]) --> CheckPT["Has page_type or page_type_hint?"]
CheckPT --> |No| ErrorPT["Throw: missing page type"]
CheckPT --> |Yes| LookupRT["Lookup registry by id"]
LookupRT --> FoundRT{"Registry entry found?"}
FoundRT --> |No| ErrorRT["Throw: unknown page type"]
FoundRT --> |Yes| FindPat["Find best pattern card for page_type"]
FindPat --> MergeDefaults["Merge defaults:<br/>visual_anchor, weight_center,<br/>density_level, component_bindings,<br/>editable_target"]
MergeDefaults --> Output["Produce style map entry"]
ErrorPT --> End(["Exit"])
ErrorRT --> End
Output --> End
```

**Diagram sources**
- [buildStyleMap.ts:64-100](file://src/commands/buildStyleMap.ts#L64-L100)
- [page-type-registry.json:1-115](file://style/patterns/page-type-registry.json#L1-L115)
- [template.pattern-card.json:1-46](file://style/patterns/template.pattern-card.json#L1-L46)

**Section sources**
- [buildStyleMap.ts:64-100](file://src/commands/buildStyleMap.ts#L64-L100)

### Rendering Pipeline Integration
The style map produced by the style resolver provides:
- theme_family for rendering to select the appropriate theme.
- Per-slide page_type, visual_anchor, weight_center, density_level, component_bindings, and editable_target.
- Optional learned_pattern metadata to guide authoring and review.

This structured output enables downstream rendering stages to:
- Apply theme tokens to components.
- Compose layouts according to visual anchors and weight centers.
- Enforce alignment and density rules.
- Choose rendering modes based on editable targets.

**Updated** The style map now includes entries for the three new pattern cards, providing comprehensive coverage for agenda management, trust explanation, and architecture visualization scenarios.

**Section sources**
- [style_map.generated.json:1-261](file://style/outputs/style_map.generated.json#L1-L261)
- [buildStyleMap.ts:102-109](file://src/commands/buildStyleMap.ts#L102-L109)

### Practical Examples

#### Theme Customization
- Objective: Create a "Light Enterprise Tech" variant.
- Steps:
  - Duplicate the existing theme JSON.
  - Adjust palette hues to light equivalents.
  - Tune typography sizes and spacing to match lighter contrast expectations.
  - Validate against the theme schema.
- Outcome: A new theme family that preserves design system consistency while adapting tone.

**Section sources**
- [dark-enterprise-tech.theme.json:1-55](file://style/themes/dark-enterprise-tech.theme.json#L1-L55)
- [theme.schema.json:1-58](file://schemas/theme.schema.json#L1-L58)

#### Pattern Creation
- Objective: Add a pattern for "Risk Split."
- Steps:
  - Identify the page type id in the registry.
  - Author a pattern card with:
    - visual_anchor and weight_center aligned to the intended composition.
    - layout_rules and alignment_rules reflecting composition discipline.
    - component_recipe enumerating core UI primitives.
    - highlight_grammar and image_usage guidance.
    - anti_patterns and reuse_notes for quality control.
  - Validate against the pattern card schema.
- Outcome: A reusable pattern that can be matched automatically and surfaced in the style map.

**Updated** Added guidance for creating patterns for the three new page types:
- **Narrative Map patterns** should emphasize left-side dominance with right-side supporting elements and include decision cue bands.
- **Trust Terminal patterns** should center on terminal windows as visual anchors with layered security context and governance labels.
- **Layered Architecture Stack patterns** should focus on vertical stacking with distinct layer treatments and cross-layer connectors.

**Section sources**
- [page-type-registry.json:15-31](file://style/patterns/page-type-registry.json#L15-L31)
- [page-type-registry.json:59-67](file://style/patterns/page-type-registry.json#L59-L67)
- [template.pattern-card.json:1-46](file://style/patterns/template.pattern-card.json#L1-L46)
- [pattern_card.schema.json:1-75](file://schemas/pattern_card.schema.json#L1-L75)

#### Component Composition
- Objective: Compose a "Chapter Summary Signal" slide.
- Steps:
  - Resolve page_type to "chapter_summary_signal."
  - Pattern provides component_recipe: summary text panel, implication panel, signal cue card.
  - Apply theme tokens for typography and spacing.
  - Enforce alignment rules to keep the signal cue aligned to the summary grid.
  - Use image_usage guidance to decide whether a texture is optional.
- Outcome: A concise, high-impact summary slide with consistent visual grammar.

**Updated** Added examples for the three new pattern cards:
- **Narrative Map composition**: Dominant left-side chapter card with supporting right-side stack, plus decision cue band at the bottom. Use accent colors for chapter numbers and decision cues while maintaining readable text colors.
- **Trust Terminal composition**: Right-side terminal window as the primary visual anchor with left-side trust claims and governance labels. Include security indicators and trust badges with subtle glow effects.
- **Layered Architecture Stack composition**: Vertically stacked architectural layers with distinct visual treatments, left-side labels, and right-side details. Use accent colors for critical layers and subtle background variations to distinguish adjacent layers.

**Section sources**
- [chapter_summary_signal.openclaw-seed.pattern.json:1-45](file://style/patterns/chapter_summary_signal.openclaw-seed.pattern.json#L1-L45)
- [narrative_map.openclaw-seed.pattern.json:33-38](file://style/patterns/narrative_map.openclaw-seed.pattern.json#L33-L38)
- [trust_terminal.openclaw-seed.pattern.json:33-39](file://style/patterns/trust_terminal.openclaw-seed.pattern.json#L33-L39)
- [layered_architecture_stack.openclaw-seed.pattern.json:35-41](file://style/patterns/layered_architecture_stack.openclaw-seed.pattern.json#L35-L41)
- [style_map.generated.json:47-86](file://style/outputs/style_map.generated.json#L47-L86)
- [style_map.generated.json:131-172](file://style/outputs/style_map.generated.json#L131-L172)
- [style_map.generated.json:174-217](file://style/outputs/style_map.generated.json#L174-L217)

## Dependency Analysis
The style system exhibits clear separation of concerns:
- Themes are consumed by rendering; they do not depend on patterns or page types.
- Page types provide classification and fallbacks; they do not depend on patterns.
- Pattern cards are discovered by page type and merged into the style map.
- The CLI commands orchestrate loading, matching, and writing the style map.

```mermaid
graph LR
THEME["Theme"] --> RENDER["Rendering Pipeline"]
REG["Page Type Registry"] --> RESOLVE["Style Resolution"]
PATTERNS["Pattern Cards"] --> RESOLVE
RESOLVE --> MAP["Style Map"]
MAP --> RENDER
```

**Diagram sources**
- [dark-enterprise-tech.theme.json:1-55](file://style/themes/dark-enterprise-tech.theme.json#L1-L55)
- [page-type-registry.json:1-115](file://style/patterns/page-type-registry.json#L1-L115)
- [template.pattern-card.json:1-46](file://style/patterns/template.pattern-card.json#L1-L46)
- [buildStyleMap.ts:50-109](file://src/commands/buildStyleMap.ts#L50-L109)
- [style_map.generated.json:1-261](file://style/outputs/style_map.generated.json#L1-L261)

**Section sources**
- [buildStyleMap.ts:50-109](file://src/commands/buildStyleMap.ts#L50-L109)

## Performance Considerations
- Minimize repeated IO: cache loaded registry and theme objects in memory during a single run.
- De-duplicate component bindings: use sets to merge visual anchors and component recipes.
- Batch processing: process slides concurrently with bounded concurrency to improve throughput.
- Schema validation: pre-validate inputs to fail fast and reduce runtime errors.

## Troubleshooting Guide
Common issues and resolutions:
- Missing page_type or page_type_hint:
  - Symptom: Error indicating missing classification.
  - Fix: Provide page_type or page_type_hint in the slides input.
- Unknown page type:
  - Symptom: Error indicating an unrecognized id.
  - Fix: Add the id to the page type registry or correct the value.
- Missing pattern for a page type:
  - Symptom: Slide resolved without learned_pattern metadata.
  - Fix: Create a pattern card for the page type and ensure it passes schema validation.
- Theme mismatch:
  - Symptom: Inconsistent rendering or invalid tokens.
  - Fix: Validate theme JSON against the theme schema and ensure all required keys are present.

**Section sources**
- [buildStyleMap.ts:67-74](file://src/commands/buildStyleMap.ts#L67-L74)
- [page-type-registry.json:1-115](file://style/patterns/page-type-registry.json#L1-L115)
- [theme.schema.json:1-58](file://schemas/theme.schema.json#L1-L58)
- [pattern_card.schema.json:1-75](file://schemas/pattern_card.schema.json#L1-L75)

## Conclusion
The Enterprise PPT System's style system couples a robust theme model with a page type registry and a library of validated pattern cards. The addition of three new pattern cards—narrative_map for agenda management, trust_terminal for trust explanation, and layered_architecture_stack for architecture visualization—expands the system's capabilities for specialized presentation scenarios. Through deterministic resolution and a clear style map output, it ensures consistent visual design at scale. By following the provided schemas, patterns, and best practices, teams can extend the system efficiently and maintain design integrity across large decks.

## Appendices

### Best Practices for Pattern Creation
- Ground patterns in real reference extractions to ensure fidelity to successful compositions.
- Keep component recipes minimal and focused on core primitives.
- Encode explicit layout and alignment rules to reduce ambiguity.
- Provide highlight grammar and image usage guidance to preserve visual discipline.
- Include anti-patterns and reuse notes to guide adoption and prevent misuse.

**Updated** Added guidance for creating patterns for the three new page types:
- **Narrative Map patterns** should establish clear visual hierarchy with dominant left-side elements and supporting right-side elements, plus decision framing mechanisms.
- **Trust Terminal patterns** should leverage terminal windows as primary visual anchors with layered security context and governance framing.
- **Layered Architecture Stack patterns** should focus on clear vertical hierarchy with distinct layer treatments and cross-layer connectivity.

**Section sources**
- [openclaw-executive--seed-01--cover-orbit.json:1-72](file://style/reference_extractions/openclaw-executive--seed-01--cover-orbit.json#L1-L72)
- [template.pattern-card.json:1-46](file://style/patterns/template.pattern-card.json#L1-L46)
- [narrative_map.openclaw-seed.pattern.json:10-21](file://style/patterns/narrative_map.openclaw-seed.pattern.json#L10-L21)
- [trust_terminal.openclaw-seed.pattern.json:10-15](file://style/patterns/trust_terminal.openclaw-seed.pattern.json#L10-L15)
- [layered_architecture_stack.openclaw-seed.pattern.json:10-16](file://style/patterns/layered_architecture_stack.openclaw-seed.pattern.json#L10-L16)

### Maintenance Strategies for Large-Scale Systems
- Version the page type registry and pattern cards to track changes and enable rollbacks.
- Use schema validation in CI to enforce structural consistency.
- Establish a review process for new patterns and theme variants.
- Periodically audit the style map for orphaned components or unused patterns.
- Document theme families and their intended use cases to prevent drift.

**Updated** The expanded pattern library now includes three new categories that require ongoing maintenance and versioning:
- Agenda and navigation patterns (narrative_map)
- Security and trust patterns (trust_terminal) 
- Architecture and technical patterns (layered_architecture_stack)

**Section sources**
- [page-type-registry.json:1-115](file://style/patterns/page-type-registry.json#L1-L115)
- [pattern_card.schema.json:1-75](file://schemas/pattern_card.schema.json#L1-L75)
- [theme.schema.json:1-58](file://schemas/theme.schema.json#L1-L58)
- [narrative_map.openclaw-seed.pattern.json:46-50](file://style/patterns/narrative_map.openclaw-seed.pattern.json#L46-L50)
- [trust_terminal.openclaw-seed.pattern.json:47-51](file://style/patterns/trust_terminal.openclaw-seed.pattern.json#L47-L51)
- [layered_architecture_stack.openclaw-seed.pattern.json:49-53](file://style/patterns/layered_architecture_stack.openclaw-seed.pattern.json#L49-L53)