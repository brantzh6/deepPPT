# Quality Assurance

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [cli.ts](file://src/cli.ts)
- [validateContracts.ts](file://src/commands/validateContracts.ts)
- [renderPptx.ts](file://src/commands/renderPptx.ts)
- [schemaCatalog.ts](file://src/lib/schemaCatalog.ts)
- [json.ts](file://src/lib/json.ts)
- [slides_output.schema.json](file://schemas/slides_output.schema.json)
- [storyline_output.schema.json](file://schemas/storyline_output.schema.json)
- [qa_report.schema.json](file://schemas/qa_report.schema.json)
- [final-acceptance.md](file://qa/checklists/final-acceptance.md)
- [quality-bar.md](file://references/quality-bar.md)
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
This document defines the Quality Assurance (QA) framework for the Enterprise PPT System. It explains acceptance criteria, validation procedures, quality gates, and QA reporting across the presentation production pipeline. It also documents the relationship between automated validation and manual review, quality metrics, performance benchmarks, and best practices for preventing common presentation defects.

## Project Structure
The QA system integrates with the broader pipeline through:
- CLI commands for validation and rendering
- JSON schema catalogs and validators
- QA checklists and quality bar standards
- QA report schema for standardized findings

```mermaid
graph TB
CLI["CLI Entrypoint<br/>src/cli.ts"] --> VC["Validate Contracts<br/>src/commands/validateContracts.ts"]
CLI --> RP["Render PPTX<br/>src/commands/renderPptx.ts"]
VC --> SC["Schema Catalog<br/>src/lib/schemaCatalog.ts"]
SC --> SJ["JSON Loader<br/>src/lib/json.ts"]
VC --> SCH1["Slides Schema<br/>schemas/slides_output.schema.json"]
VC --> SCH2["Storyline Schema<br/>schemas/storyline_output.schema.json"]
RP --> LJS["Layout Helpers<br/>render/pptxgenjs_helpers/layout.js"]
RP --> UTL["Util Helpers<br/>render/pptxgenjs_helpers/util.js"]
QA["QA Reports<br/>schemas/qa_report.schema.json"] -.-> CLI
QA -.-> CHECK["Final Acceptance Checklist<br/>qa/checklists/final-acceptance.md"]
QA -.-> BAR["Quality Bar Standards<br/>references/quality-bar.md"]
```

**Diagram sources**
- [cli.ts:1-57](file://src/cli.ts#L1-L57)
- [validateContracts.ts:1-100](file://src/commands/validateContracts.ts#L1-L100)
- [renderPptx.ts:1-187](file://src/commands/renderPptx.ts#L1-L187)
- [schemaCatalog.ts:1-24](file://src/lib/schemaCatalog.ts#L1-L24)
- [json.ts:1-14](file://src/lib/json.ts#L1-L14)
- [slides_output.schema.json:1-53](file://schemas/slides_output.schema.json#L1-L53)
- [storyline_output.schema.json:1-49](file://schemas/storyline_output.schema.json#L1-L49)
- [qa_report.schema.json:1-28](file://schemas/qa_report.schema.json#L1-L28)
- [final-acceptance.md:1-28](file://qa/checklists/final-acceptance.md#L1-L28)
- [quality-bar.md:1-40](file://references/quality-bar.md#L1-L40)

**Section sources**
- [README.md:1-38](file://README.md#L1-L38)
- [cli.ts:1-57](file://src/cli.ts#L1-L57)

## Core Components
- Contract validation engine: Loads schema catalog and validates example datasets against JSON Schemas.
- Rendering pipeline: Produces editable PPTX and SVG previews, with built-in layout warnings.
- QA standards: Final acceptance checklist and quality bar define acceptance criteria.
- QA reporting: Structured QA report schema for findings categorization and severity.

Key responsibilities:
- Automated validation ensures schema compliance and contract integrity.
- Rendering validates layout constraints and writes artifacts for manual review.
- QA standards and reports formalize acceptance and remediation.

**Section sources**
- [validateContracts.ts:7-99](file://src/commands/validateContracts.ts#L7-L99)
- [renderPptx.ts:83-187](file://src/commands/renderPptx.ts#L83-L187)
- [final-acceptance.md:1-28](file://qa/checklists/final-acceptance.md#L1-L28)
- [quality-bar.md:1-40](file://references/quality-bar.md#L1-L40)
- [qa_report.schema.json:8-26](file://schemas/qa_report.schema.json#L8-L26)

## Architecture Overview
The QA pipeline is layered:
- Validation layer: schema-driven checks for contracts and outputs
- Rendering layer: produces deliverables and previews with layout diagnostics
- Review layer: manual QA guided by checklists and quality bar
- Reporting layer: standardized QA report for traceability

```mermaid
sequenceDiagram
participant Dev as "Developer"
participant CLI as "CLI"
participant VC as "Validate Contracts"
participant SC as "Schema Catalog"
participant SJ as "JSON Loader"
participant RP as "Render PPTX"
participant QA as "QA Report"
Dev->>CLI : Run validate-contracts
CLI->>VC : Invoke validateContractsCommand()
VC->>SC : Load schema catalog
SC->>SJ : Read schema files
VC->>SJ : Validate examples
VC-->>CLI : Pass/Fail with errors
Dev->>CLI : Run render-pptx
CLI->>RP : Invoke renderPptxCommand()
RP->>RP : Add frames, header, page-type renders
RP->>RP : Warn overlaps and out-of-bounds
RP-->>CLI : Write PPTX, previews, manifest
Dev->>QA : Compile QA report (structured)
QA-->>Dev : Findings with category/severity
```

**Diagram sources**
- [cli.ts:10-17](file://src/cli.ts#L10-L17)
- [validateContracts.ts:20-98](file://src/commands/validateContracts.ts#L20-L98)
- [schemaCatalog.ts:12-23](file://src/lib/schemaCatalog.ts#L12-L23)
- [json.ts:4-7](file://src/lib/json.ts#L4-L7)
- [renderPptx.ts:135-159](file://src/commands/renderPptx.ts#L135-L159)
- [qa_report.schema.json:8-26](file://schemas/qa_report.schema.json#L8-L26)

## Detailed Component Analysis

### Contract Validation Engine
Purpose:
- Build a schema catalog from the schemas directory
- Validate example datasets against registered schemas
- Fail fast with detailed error messages

Implementation highlights:
- Uses AJV 2020 with strictness configured for early failure
- Iterates over a curated list of example files and their schema IDs
- Emits human-readable errors via AJV’s error formatter

Acceptance criteria:
- All examples must pass schema validation
- Errors must include schema ID and path for traceability

```mermaid
flowchart TD
Start(["Start validate-contracts"]) --> LoadCat["Load schema catalog"]
LoadCat --> IterateEx["Iterate example entries"]
IterateEx --> GetValidator["Get validator by schema ID"]
GetValidator --> LoadData["Load example JSON"]
LoadData --> Validate["Run validator(data)"]
Validate --> Valid{"Valid?"}
Valid --> |Yes| NextEx["Next example"]
Valid --> |No| FormatErr["Format AJV errors"]
FormatErr --> ThrowErr["Throw error with path and details"]
NextEx --> IterateEx
IterateEx --> Done(["Done"])
```

**Diagram sources**
- [validateContracts.ts:22-98](file://src/commands/validateContracts.ts#L22-L98)
- [schemaCatalog.ts:12-23](file://src/lib/schemaCatalog.ts#L12-L23)
- [json.ts:4-7](file://src/lib/json.ts#L4-L7)

**Section sources**
- [validateContracts.ts:7-99](file://src/commands/validateContracts.ts#L7-L99)
- [schemaCatalog.ts:12-23](file://src/lib/schemaCatalog.ts#L12-L23)
- [json.ts:4-7](file://src/lib/json.ts#L4-L7)

### Rendering Pipeline and Quality Gates
Purpose:
- Convert structured slides and style maps into an editable PPTX
- Generate SVG previews for manual review
- Enforce layout quality gates during render

Key quality gates:
- Slide count parity between slides output and style map
- Presence of required arguments (--slides, --style-map)
- Layout warnings for overlaps and out-of-bounds elements
- Output artifact integrity (PPTX, previews, manifest)

```mermaid
sequenceDiagram
participant CLI as "CLI"
participant RP as "renderPptxCommand"
participant LJS as "Layout Helpers"
participant UTL as "Util Helpers"
CLI->>RP : --slides <path> --style-map <path>
RP->>RP : Validate args and load inputs
RP->>RP : Build style map lookup
RP->>RP : Initialize PPTX and theme
loop For each slide
RP->>RP : Add frame/header
RP->>RP : Dispatch page-type renderer
RP->>LJS : warnIfSlideHasOverlaps()
RP->>LJS : warnIfSlideElementsOutOfBounds()
end
RP->>RP : Write PPTX, previews, manifest
RP-->>CLI : Paths to outputs
```

**Diagram sources**
- [renderPptx.ts:94-187](file://src/commands/renderPptx.ts#L94-L187)
- [renderPptx.ts:135-159](file://src/commands/renderPptx.ts#L135-L159)

**Section sources**
- [renderPptx.ts:83-187](file://src/commands/renderPptx.ts#L83-L187)

### QA Standards and Acceptance Criteria
Final acceptance checklist and quality bar define the acceptance bar:
- Content: clear claims, facts or justified interpretation, enterprise boundaries and risks
- Story: concrete questions, logical progression, no redundancy
- Visual: visual anchors, intentional weight center, no large empty containers, page-specific layouts
- Export: no overflow/cutoff, no encoding issues, PPTX opens cleanly, page sequence matches expectations

Final rule: a slide is acceptable only if it is narratively necessary, visually intentional, factually defensible, and locally revisable.

```mermaid
flowchart TD
A["Review Slide"] --> C1["Content Check"]
A --> S1["Story Check"]
A --> V1["Visual Check"]
A --> E1["Export Check"]
C1 --> C2{"Meets criteria?"}
S1 --> S2{"Meets criteria?"}
V1 --> V2{"Meets criteria?"}
E1 --> E2{"Meets criteria?"}
C2 --> |No| R1["Reject"]
S2 --> |No| R1
V2 --> |No| R1
E2 --> |No| R1
C2 --> |Yes| G1["Gate Passed"]
S2 --> |Yes| G1
V2 --> |Yes| G1
E2 --> |Yes| G1
G1 --> FR["Final Rule Check"]
FR --> FR1{"Narratively necessary<br/>Visually intentional<br/>Factually defensible<br/>Locally revisable?"}
FR1 --> |No| R1
FR1 --> |Yes| ACC["Accept"]
```

**Diagram sources**
- [final-acceptance.md:3-27](file://qa/checklists/final-acceptance.md#L3-L27)
- [quality-bar.md:3-39](file://references/quality-bar.md#L3-L39)

**Section sources**
- [final-acceptance.md:1-28](file://qa/checklists/final-acceptance.md#L1-L28)
- [quality-bar.md:1-40](file://references/quality-bar.md#L1-L40)

### QA Report Generation
The QA report schema defines a standardized structure for findings:
- Required fields: deck_id, status, findings array
- Findings items include category, severity, optional slide_id, message, and owner
- Categories: content, story, visual, export
- Severity: low, medium, high

This structure supports traceability and escalation during manual review.

**Section sources**
- [qa_report.schema.json:8-26](file://schemas/qa_report.schema.json#L8-L26)

## Dependency Analysis
The QA framework relies on:
- CLI orchestration for command invocation
- Schema catalog and JSON utilities for validation
- Rendering helpers for layout diagnostics
- QA standards and report schema for consistency

```mermaid
graph LR
CLI["src/cli.ts"] --> VC["src/commands/validateContracts.ts"]
CLI --> RP["src/commands/renderPptx.ts"]
VC --> SC["src/lib/schemaCatalog.ts"]
SC --> SJ["src/lib/json.ts"]
VC --> SCH["schemas/*.schema.json"]
RP --> LJS["render/pptxgenjs_helpers/layout.js"]
RP --> UTL["render/pptxgenjs_helpers/util.js"]
QA["schemas/qa_report.schema.json"] -.-> CLI
QA -.-> CHECK["qa/checklists/final-acceptance.md"]
QA -.-> BAR["references/quality-bar.md"]
```

**Diagram sources**
- [cli.ts:10-17](file://src/cli.ts#L10-L17)
- [validateContracts.ts:20-98](file://src/commands/validateContracts.ts#L20-L98)
- [schemaCatalog.ts:12-23](file://src/lib/schemaCatalog.ts#L12-L23)
- [json.ts:4-7](file://src/lib/json.ts#L4-L7)
- [renderPptx.ts:86-89](file://src/commands/renderPptx.ts#L86-L89)
- [qa_report.schema.json:8-26](file://schemas/qa_report.schema.json#L8-L26)
- [final-acceptance.md:1-28](file://qa/checklists/final-acceptance.md#L1-L28)
- [quality-bar.md:1-40](file://references/quality-bar.md#L1-L40)

**Section sources**
- [cli.ts:1-57](file://src/cli.ts#L1-L57)
- [validateContracts.ts:1-100](file://src/commands/validateContracts.ts#L1-L100)
- [renderPptx.ts:1-187](file://src/commands/renderPptx.ts#L1-L187)

## Performance Considerations
- Validation performance: batch schema registration and reuse validators to minimize overhead
- Rendering performance: avoid unnecessary re-renders; leverage manifests to track rerendered slides
- Preview generation: generate SVG previews in parallel per slide where feasible
- Artifact storage: ensure output directories exist before writing to reduce I/O errors

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- Missing required arguments for rendering: ensure both --slides and --style-map are provided
- Mismatched slide counts: verify slides output and style map contain equal numbers of slides
- Layout violations: address overlaps and out-of-bounds warnings before manual review
- Encoding or export issues: confirm PPTX opens cleanly; re-run render with corrected inputs
- Validation failures: inspect AJV error messages to locate invalid fields in examples

Manual review steps:
- Cross-check each finding against the QA report schema
- Confirm categories and severities align with the quality bar
- Escalate high-severity findings and re-validate after fixes

**Section sources**
- [renderPptx.ts:97-113](file://src/commands/renderPptx.ts#L97-L113)
- [renderPptx.ts:157-159](file://src/commands/renderPptx.ts#L157-L159)
- [validateContracts.ts:94-96](file://src/commands/validateContracts.ts#L94-L96)
- [qa_report.schema.json:8-26](file://schemas/qa_report.schema.json#L8-L26)

## Conclusion
The Enterprise PPT System’s QA framework combines automated schema validation, rendering diagnostics, and structured manual review. By adhering to the final acceptance checklist and quality bar, and by using the QA report schema, teams can maintain high-quality output, prevent common defects, and continuously improve the presentation production pipeline.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices

### Practical QA Workflows
- Pre-render validation: run validate-contracts to ensure schema compliance before rendering
- Render and preview: execute render-pptx; review SVG previews and address layout warnings
- Manual QA: apply final acceptance checklist and quality bar to each slide
- Report findings: populate QA report with category, severity, and remediation ownership

**Section sources**
- [validateContracts.ts:85-98](file://src/commands/validateContracts.ts#L85-L98)
- [renderPptx.ts:165-166](file://src/commands/renderPptx.ts#L165-L166)
- [final-acceptance.md:3-27](file://qa/checklists/final-acceptance.md#L3-L27)
- [quality-bar.md:3-39](file://references/quality-bar.md#L3-L39)
- [qa_report.schema.json:8-26](file://schemas/qa_report.schema.json#L8-L26)

### Standards Compliance and Metrics
- Compliance: adhere to QA report schema for consistent reporting
- Metrics: track pass/fail rates, severity distribution, and remediation turnaround
- Benchmarks: compare slide-level acceptance rates against quality bar targets

**Section sources**
- [qa_report.schema.json:10-22](file://schemas/qa_report.schema.json#L10-L22)
- [quality-bar.md:34-40](file://references/quality-bar.md#L34-L40)