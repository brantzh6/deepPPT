# PPTX Export

<cite>
**Referenced Files in This Document**
- [renderPptx.ts](file://src/commands/renderPptx.ts)
- [layout.js](file://render/pptxgenjs_helpers/layout.js)
- [util.js](file://render/pptxgenjs_helpers/util.js)
- [cli.ts](file://src/cli.ts)
- [dark-enterprise-tech.theme.json](file://style/themes/dark-enterprise-tech.theme.json)
- [page-type-registry.json](file://style/patterns/page-type-registry.json)
- [openclaw-executive--seed--layered_architecture_stack.pattern.json](file://style/patterns/openclaw-executive--seed--layered_architecture_stack.pattern.json)
- [template.pattern-card.json](file://style/patterns/template.pattern-card.json)
</cite>

## Update Summary
**Changes Made**
- Complete redesign of layered architecture slide rendering from traditional two-column layout to modern control panel interface
- Added integrated interactive elements including status LEDs, toggle switches, and connecting lines
- Implemented modern dashboard-style control plane with active state highlighting
- Enhanced visual hierarchy with status indicators and interactive controls
- Refined connector line positioning with proper layer-to-control matching

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
This document explains the PPTX export functionality that generates editable PowerPoint presentations using the PptxGenJS library. It covers the native PowerPoint generation process, slide creation and formatting, layout management, command-line interface, argument handling, output path resolution, slide rendering functions for different page types (cover, narrative map, bottleneck shift, summary, trust terminal, layered architecture), editable delivery strategy, visual styling (shadows, typography, color schemes), performance considerations, memory management, error handling, and integration with the style system and theme application.

## Project Structure
The PPTX export capability is implemented as a command-line tool that orchestrates rendering of slides into a PowerPoint deck. Key areas:
- CLI entrypoint registers and dispatches the render-pptx command.
- The render command loads slides and style map, applies theme, renders per-page-type slides, validates layout, and writes outputs.
- Helpers enforce layout correctness and provide safe shadow utilities.
- Styles and themes define palette, typography, and page-type semantics.

```mermaid
graph TB
CLI["CLI Entrypoint<br/>src/cli.ts"] --> Cmd["renderPptxCommand<br/>src/commands/renderPptx.ts"]
Cmd --> Theme["Theme Loader<br/>style/themes/dark-enterprise-tech.theme.json"]
Cmd --> Patterns["Page Type Registry<br/>style/patterns/page-type-registry.json"]
Cmd --> Helpers["Layout & Util Helpers<br/>render/pptxgenjs_helpers/*"]
Cmd --> Pptx["PptxGenJS Runtime<br/>pptxgenjs"]
Cmd --> Outputs["Outputs<br/>editable PPTX + SVG previews + manifest"]
```

**Diagram sources**
- [cli.ts:19-56](file://src/cli.ts#L19-L56)
- [renderPptx.ts:83-187](file://src/commands/renderPptx.ts#L83-L187)
- [dark-enterprise-tech.theme.json:1-55](file://style/themes/dark-enterprise-tech.theme.json#L1-L55)
- [page-type-registry.json:1-115](file://style/patterns/page-type-registry.json#L1-L115)
- [layout.js:23-232](file://render/pptxgenjs_helpers/layout.js#L23-L232)
- [util.js:4-20](file://render/pptxgenjs_helpers/util.js#L4-L20)

**Section sources**
- [cli.ts:19-56](file://src/cli.ts#L19-L56)
- [renderPptx.ts:83-187](file://src/commands/renderPptx.ts#L83-L187)
- [dark-enterprise-tech.theme.json:1-55](file://style/themes/dark-enterprise-tech.theme.json#L1-L55)
- [page-type-registry.json:1-115](file://style/patterns/page-type-registry.json#L1-L115)
- [layout.js:23-232](file://render/pptxgenjs_helpers/layout.js#L23-L232)
- [util.js:4-20](file://render/pptxgenjs_helpers/util.js#L4-L20)

## Core Components
- CLI command registration and dispatch for render-pptx.
- renderPptxCommand: Loads inputs, initializes PptxGenJS, applies theme, iterates slides, renders per-type, validates layout, writes outputs.
- Layout helpers: Detect overlaps, containment, and out-of-bounds elements; align and distribute elements.
- Utilities: Safe outer shadow factory for consistent shadow definitions.
- Theme and patterns: Palette, typography, page-type registry, and pattern cards inform rendering.

**Section sources**
- [cli.ts:10-17](file://src/cli.ts#L10-L17)
- [renderPptx.ts:83-187](file://src/commands/renderPptx.ts#L83-L187)
- [layout.js:23-232](file://render/pptxgenjs_helpers/layout.js#L23-L232)
- [util.js:4-20](file://render/pptxgenjs_helpers/util.js#L4-L20)
- [dark-enterprise-tech.theme.json:4-53](file://style/themes/dark-enterprise-tech.theme.json#L4-L53)
- [page-type-registry.json:3-112](file://style/patterns/page-type-registry.json#L3-L112)

## Architecture Overview
The render pipeline:
- Parse CLI args and resolve input paths.
- Load slides JSON and style map; validate counts match.
- Load theme; prepare visual assets.
- Initialize PptxGenJS with layout and theme metadata.
- For each slide:
  - Add slide frame and header.
  - Dispatch to page-type renderer.
  - Validate layout (overlaps, out-of-bounds).
- Write PPTX, SVG previews, and render manifest.

```mermaid
sequenceDiagram
participant User as "User"
participant CLI as "CLI"
participant Cmd as "renderPptxCommand"
participant Pptx as "PptxGenJS"
participant Theme as "Theme"
participant Helpers as "Layout Helpers"
User->>CLI : "tsx src/cli.ts render-pptx --slides ... --style-map ..."
CLI->>Cmd : "invoke with args"
Cmd->>Cmd : "resolve paths, load JSON, load theme"
Cmd->>Pptx : "new PptxGenJS(), set layout/theme"
loop For each slide
Cmd->>Pptx : "addSlide()"
Cmd->>Pptx : "addSlideFrame(), addHeader()"
Cmd->>Pptx : "render*Slide(page_type)"
Cmd->>Helpers : "warnIfSlideHasOverlaps(), warnIfSlideElementsOutOfBounds()"
end
Cmd->>Pptx : "writeFile()"
Cmd-->>User : "outputs + manifest"
```

**Diagram sources**
- [cli.ts:19-56](file://src/cli.ts#L19-L56)
- [renderPptx.ts:83-187](file://src/commands/renderPptx.ts#L83-L187)
- [layout.js:23-232](file://render/pptxgenjs_helpers/layout.js#L23-L232)

## Detailed Component Analysis

### CLI and Argument Handling
- Registers render-pptx command and prints help.
- render-pptx expects --slides and --style-map; optional --theme-file, --out-manifest, --out-pptx, --out-preview-dir.
- Validates presence of required inputs and throws if missing.

**Section sources**
- [cli.ts:10-17](file://src/cli.ts#L10-L17)
- [cli.ts:39-50](file://src/cli.ts#L39-L50)
- [renderPptx.ts:94-99](file://src/commands/renderPptx.ts#L94-L99)

### PptxGenJS Initialization and Theme Application
- Creates PptxGenJS instance and sets layout to wide, author/company/subject/title/lang, and theme fonts.
- Applies theme palette and typography to slide background and text.

**Section sources**
- [renderPptx.ts:115-126](file://src/commands/renderPptx.ts#L115-L126)
- [dark-enterprise-tech.theme.json:4-21](file://style/themes/dark-enterprise-tech.theme.json#L4-L21)

### Slide Creation and Frame/Header
- Adds a rounded background frame and a borderless inner rounded rectangle for slide content area.
- Adds header text blocks for deck branding, title, and optional subtitle.

**Section sources**
- [renderPptx.ts:189-208](file://src/commands/renderPptx.ts#L189-L208)
- [renderPptx.ts:210-244](file://src/commands/renderPptx.ts#L210-L244)

### Page-Type Rendering Functions
- Switch by page_type from style map to render specialized layouts:
  - Cover slide: Hero image region, claim card, orbit accents, story points.
  - Narrative map: Dominant/supporting chapters, decision cue.
  - Bottleneck shift: Thesis statement, contextual grounding image, support cards.
  - Chapter summary signal: Summary takeaways, implications, decision cue.
  - Trust terminal: Terminal window interface with security indicators.
  - Layered architecture: Modern control panel interface with integrated interactive elements.
  - Fallback: Generic centered claim block.

```mermaid
flowchart TD
Start(["Start Slide"]) --> Header["Add Header"]
Header --> Type{"page_type"}
Type --> |cover_orbit| Cover["renderCoverSlide"]
Type --> |narrative_map| Map["renderNarrativeMapSlide"]
Type --> |bottleneck_shift| Bottleneck["renderBottleneckSlide"]
Type --> |chapter_summary_signal| Summary["renderSummarySlide"]
Type --> |trust_terminal| Terminal["renderTrustTerminalSlide"]
Type --> |layered_architecture_stack| Architecture["renderLayeredArchitectureSlide"]
Type --> |other/default| Fallback["renderFallbackSlide"]
Cover --> Validate["Validate Layout"]
Map --> Validate
Bottleneck --> Validate
Summary --> Validate
Terminal --> Validate
Architecture --> Validate
Fallback --> Validate
Validate --> End(["Done"])
```

**Diagram sources**
- [renderPptx.ts:139-155](file://src/commands/renderPptx.ts#L139-L155)
- [renderPptx.ts:246-363](file://src/commands/renderPptx.ts#L246-L363)
- [renderPptx.ts:365-436](file://src/commands/renderPptx.ts#L365-L436)
- [renderPptx.ts:438-540](file://src/commands/renderPptx.ts#L438-L540)
- [renderPptx.ts:542-645](file://src/commands/renderPptx.ts#L542-L645)
- [renderPptx.ts:700-866](file://src/commands/renderPptx.ts#L700-L866)
- [renderPptx.ts:868-1063](file://src/commands/renderPptx.ts#L868-L1063)
- [renderPptx.ts:1065-1086](file://src/commands/renderPptx.ts#L1065-L1086)

#### Cover Slide Rendering
- Hero image region with inset and rounded frame.
- Claim card with accent border and shadow.
- Orbit circles and labels for thematic emphasis.
- Story points as small pill-shaped badges below.

**Section sources**
- [renderPptx.ts:246-363](file://src/commands/renderPptx.ts#L246-L363)
- [openclaw-executive--seed--layered_architecture_stack.pattern.json:19-23](file://style/patterns/openclaw-executive--seed--layered_architecture_stack.pattern.json#L19-L23)

#### Narrative Map Rendering
- Left column: dominant chapter block.
- Right column: two stacked supporting chapter cards.
- Bottom bar: decision cue.

**Section sources**
- [renderPptx.ts:365-436](file://src/commands/renderPptx.ts#L365-L436)

#### Bottleneck Shift Rendering
- Left column: oversized primary statement, explanatory note, grounding visual region.
- Right column: up to three support cards with step indicators.
- Uses contextual image mode from pattern.

**Section sources**
- [renderPptx.ts:438-540](file://src/commands/renderPptx.ts#L438-L540)
- [openclaw-executive--seed--layered_architecture_stack.pattern.json:19-23](file://style/patterns/openclaw-executive--seed--layered_architecture_stack.pattern.json#L19-L23)

#### Chapter Summary Signal Rendering
- Left: summary takeaways and implications list.
- Right: decision cue and commentary.

**Section sources**
- [renderPptx.ts:542-645](file://src/commands/renderPptx.ts#L542-L645)
- [openclaw-executive--seed--layered_architecture_stack.pattern.json:19-23](file://style/patterns/openclaw-executive--seed--layered_architecture_stack.pattern.json#L19-L23)

#### Trust Terminal Rendering
- Left column: trust claim and governance labels with pill-shaped indicators.
- Right column: terminal window interface with control dots and security indicators.
- Terminal content with green monospace text and status indicators.

**Section sources**
- [renderPptx.ts:700-866](file://src/commands/renderPptx.ts#L700-L866)

#### Layered Architecture Rendering
**Updated** Complete redesign from traditional two-column layout to modern control panel interface with integrated interactive elements. The layered architecture slide now features:

- **Modern Control Panel Interface**: Stack layers on the left with a control panel on the right featuring interactive elements
- **Status LEDs**: Elliptical indicators showing active/inactive states for each control item
- **Toggle Switches**: Simplified toggle indicators with active state highlighting
- **Connecting Lines**: Dashed lines linking control items to corresponding architecture layers
- **Active State Highlighting**: First control item is highlighted as active with accent color
- **Dashboard Aesthetics**: Modern rounded rectangles with subtle borders and background variations

**Enhanced Layout Structure**:
- Stack area (left): Traditional layer stack with numbering, names, and descriptions
- Control panel (right): Dashboard-style interface with control rows
- Visual connectors: Subtle dashed lines connecting controls to layers

**Interactive Elements**:
- Status LEDs: Green for active, accent color for inactive
- Toggle indicators: Accent color for active, muted for inactive  
- Control rows: Background transparency varies by state
- Labels: Bold text for active items, regular for inactive

**Section sources**
- [renderPptx.ts:868-1063](file://src/commands/renderPptx.ts#L868-L1063)
- [openclaw-executive--seed--layered_architecture_stack.pattern.json:10-23](file://style/patterns/openclaw-executive--seed--layered_architecture_stack.pattern.json#L10-L23)

#### Fallback Rendering
- Large centered claim card for unknown page types.

**Section sources**
- [renderPptx.ts:1065-1086](file://src/commands/renderPptx.ts#L1065-L1086)

### Editable Delivery Strategy
- Uses native PptxGenJS shapes and text to maintain editable object structure.
- Shapes and text remain as PowerPoint-native objects for later editing.
- Pattern metadata includes editable_target hints indicating native shapes plus text.

**Section sources**
- [page-type-registry.json:12](file://style/patterns/page-type-registry.json#L12)
- [page-type-registry.json:21](file://style/patterns/page-type-registry.json#L21)
- [page-type-registry.json:48](file://style/patterns/page-type-registry.json#L48)
- [page-type-registry.json:102](file://style/patterns/page-type-registry.json#L102)
- [openclaw-executive--seed--layered_architecture_stack.pattern.json:42](file://style/patterns/openclaw-executive--seed--layered_architecture_stack.pattern.json#L42)

### Visual Styling: Shadows, Typography, Color Schemes
- Shadows: safeOuterShadow helper ensures consistent outer shadows with color, opacity, angle, blur, offset.
- Typography: theme.typography.font_family applied to headers and body text.
- Color scheme: theme.palette provides background, surface, surface_alt, text_primary/text_secondary, and accent colors.

**Section sources**
- [util.js:4-20](file://render/pptxgenjs_helpers/util.js#L4-L20)
- [renderPptx.ts:122-126](file://src/commands/renderPptx.ts#L122-L126)
- [renderPptx.ts:210-244](file://src/commands/renderPptx.ts#L210-L244)
- [dark-enterprise-tech.theme.json:4-21](file://style/themes/dark-enterprise-tech.theme.json#L4-L21)

### Layout Management and Validation
- warnIfSlideHasOverlaps: Detects overlapping elements, with special handling for diagonal lines and decorative shapes; severity escalates for text overlaps.
- warnIfSlideElementsOutOfBounds: Checks elements against computed slide dimensions and warns on violations.
- Alignment and distribution utilities are available for advanced layout adjustments.

**Section sources**
- [layout.js:23-232](file://render/pptxgenjs_helpers/layout.js#L23-L232)
- [layout.js:575-633](file://render/pptxgenjs_helpers/layout.js#L575-L633)

### Output Path Resolution and Manifest Generation
- resolveWritablePptxPath: If the requested path exists, appends a timestamped suffix to avoid overwrite; otherwise returns the requested path.
- Writes PPTX, SVG previews, and a render manifest with deck metadata and artifact references.

**Section sources**
- [renderPptx.ts:1210-1219](file://src/commands/renderPptx.ts#L1210-L1219)
- [renderPptx.ts:161-186](file://src/commands/renderPptx.ts#L161-L186)

## Dependency Analysis
- renderPptxCommand depends on:
  - PptxGenJS runtime for slide creation and writing.
  - Theme loader for palette and typography.
  - Layout helpers for validation.
  - CLI for argument parsing and dispatch.

```mermaid
graph LR
CLI["src/cli.ts"] --> RP["src/commands/renderPptx.ts"]
RP --> Theme["style/themes/dark-enterprise-tech.theme.json"]
RP --> Patterns["style/patterns/page-type-registry.json"]
RP --> Layout["render/pptxgenjs_helpers/layout.js"]
RP --> Util["render/pptxgenjs_helpers/util.js"]
RP --> Pptx["PptxGenJS"]
```

**Diagram sources**
- [cli.ts:19-56](file://src/cli.ts#L19-L56)
- [renderPptx.ts:83-187](file://src/commands/renderPptx.ts#L83-L187)
- [dark-enterprise-tech.theme.json:1-55](file://style/themes/dark-enterprise-tech.theme.json#L1-L55)
- [page-type-registry.json:1-115](file://style/patterns/page-type-registry.json#L1-L115)
- [layout.js:23-232](file://render/pptxgenjs_helpers/layout.js#L23-L232)
- [util.js:4-20](file://render/pptxgenjs_helpers/util.js#L4-L20)

**Section sources**
- [cli.ts:19-56](file://src/cli.ts#L19-L56)
- [renderPptx.ts:83-187](file://src/commands/renderPptx.ts#L83-L187)
- [layout.js:23-232](file://render/pptxgenjs_helpers/layout.js#L23-L232)
- [util.js:4-20](file://render/pptxgenjs_helpers/util.js#L4-L20)

## Performance Considerations
- Minimize repeated theme lookups by caching theme object per run.
- Prefer batched shape/text additions within a slide to reduce internal reflows.
- Validate early: ensure slides and style map lengths match before iteration.
- Avoid excessive shadow blur and opacity combinations that increase rendering cost.
- For large decks, consider splitting into batches and writing manifests incrementally.

## Troubleshooting Guide
Common issues and remedies:
- Missing required arguments: Ensure --slides and --style-map are provided.
- Mismatched slide counts: The command validates that slides and style map entries match; fix input data.
- Overlapping text elements: The overlap validator raises warnings and suggestions; adjust positions to avoid overlaps.
- Elements outside slide bounds: The out-of-bounds validator logs violations; constrain coordinates within slide dimensions.
- Output path conflicts: The resolver appends a timestamped suffix when the file exists; confirm the intended output location.
- **Updated**: Layered architecture rendering issues: The modern control panel interface now features integrated interactive elements with proper state management and visual feedback.

**Section sources**
- [renderPptx.ts:94-99](file://src/commands/renderPptx.ts#L94-L99)
- [renderPptx.ts:111-113](file://src/commands/renderPptx.ts#L111-L113)
- [layout.js:23-232](file://render/pptxgenjs_helpers/layout.js#L23-L232)
- [layout.js:575-633](file://render/pptxgenjs_helpers/layout.js#L575-L633)
- [renderPptx.ts:1210-1219](file://src/commands/renderPptx.ts#L1210-L1219)

## Conclusion
The PPTX export system integrates CLI orchestration, theme-driven styling, and pattern-aware rendering to produce editable PowerPoint decks. It leverages PptxGenJS for native object fidelity, enforces layout correctness via helper validations, and supports an editable delivery strategy. The modular design allows extension to new page types and refinement of visual styles. Recent enhancements to the layered architecture rendering introduce a modern control panel interface with integrated interactive elements, significantly improving the visual presentation while maintaining backward compatibility.

## Appendices

### Appendix A: Page Types and Pattern Metadata
- Page type registry defines theme family and editable_target for each page type.
- Pattern cards specify image usage modes and editable_target guidance.

**Section sources**
- [page-type-registry.json:3-112](file://style/patterns/page-type-registry.json#L3-L112)
- [openclaw-executive--seed--layered_architecture_stack.pattern.json:19-23](file://style/patterns/openclaw-executive--seed--layered_architecture_stack.pattern.json#L19-L23)
- [template.pattern-card.json:19-23](file://style/patterns/template.pattern-card.json#L19-L23)

### Appendix B: Modern Control Panel Interface Implementation
**Updated** The layered architecture slide rendering now implements a sophisticated control panel interface with the following key features:

**Control Panel Layout**:
- Positioned on the right side of the slide with dedicated width and spacing
- Rounded rectangular background with subtle accent border
- Header text "Control Plane" with secondary color styling
- Aligned with layer stack using consistent vertical spacing

**Interactive Control Items**:
- Each control item corresponds to a specific architecture layer
- Control rows feature rounded rectangles with state-dependent transparency
- Status LEDs: elliptical indicators showing active (green) or inactive states
- Toggle switches: simplified circular indicators with active/inactive colors
- Labels: bold text for active items, regular for inactive with accent color highlighting

**Visual Connections**:
- Dashed lines connect control items to corresponding architecture layers
- Lines use accent secondary color with 60% transparency
- Proper coordinate calculation ensures clean visual alignment
- Distance constraints prevent overly long or misplaced connections

**State Management**:
- First control item automatically becomes active
- Active state triggers accent color application across all interactive elements
- Inactive items use muted color schemes for visual hierarchy
- Background transparency varies by state for depth perception

**Section sources**
- [renderPptx.ts:980-1063](file://src/commands/renderPptx.ts#L980-L1063)
- [openclaw-executive--seed--layered_architecture_stack.pattern.json:10-23](file://style/patterns/openclaw-executive--seed--layered_architecture_stack.pattern.json#L10-L23)