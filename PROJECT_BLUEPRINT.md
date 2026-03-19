# Enterprise PPT System Blueprint

## Project Overview

### Product Goal
Build an enterprise PPT production system that takes deep research as upstream input and produces high-quality, editable, reusable, reviewable presentation decks.

### Core Positioning
- This is a production system, not a one-shot PPT generator.
- Large models belong in the judgment layer.
- Code belongs in the execution layer.
- Style intelligence is an independent asset layer.
- Editable PPTX is a first-class delivery target.
- The system should learn reusable layout and style knowledge from strong reference decks.

### Success Criteria
- Research can be handed off as structured inputs instead of raw chat output.
- Storyline and slide content are inspectable before rendering.
- Style choices are made intentionally through reusable patterns and theme tokens.
- Preview and delivery outputs are both reproducible.
- Final output is locally revisable by editing structured content and rerendering affected pages.
- Strong decks can be ingested and abstracted into reusable page patterns, alignment rules, and component recipes.

## System Model

### Layering Principle
Separate judgment from execution.

Judgment layer:
- research extraction and interpretation
- audience adaptation
- storyline construction
- page-type selection
- design critique
- QA review suggestions

Execution layer:
- schema validation
- style token resolution
- deterministic layout calculation
- preview rendering
- editable PPTX export
- local rerender
- export QA

### Canonical Flow
`brief -> research_output -> storyline_output -> slides_output -> style_map/theme -> preview -> editable_pptx -> qa_report`

## Module Design

### 1. Deep Research
Purpose:
- Produce fact base, source map, interpretation boundaries, risks, and domain constraints.

Inputs:
- topic
- audience
- industry
- objective
- constraints
- source materials

Outputs:
- `research_output.json`
- `source_map.md`
- optional long-form research report

Owns:
- fact extraction
- source attribution
- confidence tagging
- industry constraints
- open questions

Must not own:
- slide ordering
- page-type choice
- theme or layout decisions
- rendering logic

### 2. Story Builder
Purpose:
- Convert research into chapter logic, page sequence, and structured slide content.

Inputs:
- `research_output.json`
- brief and audience model
- optional reference deck extraction

Outputs:
- `storyline_output.json`
- `slides_output.json`

Owns:
- chapter questions
- page claims
- narrative roles
- evidence selection
- what to cut
- layout hints at semantic level only

Must not own:
- theme tokens
- visual component geometry
- PPTX export logic

### 3. Style Intelligence
Purpose:
- Preserve design memory and convert narrative intent into reusable visual decisions.

Inputs:
- style family
- audience tone
- page types
- reference pattern extractions

Outputs:
- `style_map.json`
- `theme.json`
- pattern cards
- component definitions

Owns:
- theme token sets
- page-type registry
- pattern library
- component library
- reference extraction memory
- anti-pattern knowledge
- deck learning outputs from reference decks

Must not own:
- research facts
- chapter logic
- final slide rendering

### 3A. Deck Learning System
Purpose:
- Learn reusable page-layout and visual-expression knowledge from high-quality decks, PDFs, and slide screenshots.

Inputs:
- reference decks
- reference PDFs
- reference slide screenshots
- extraction annotations

Outputs:
- layout pattern cards
- alignment and spacing rules
- image-usage recipes
- highlight grammar
- component recipes
- benchmark reference sets

Owns:
- reference ingestion
- slide decomposition
- layout skeleton extraction
- visual anchor extraction
- premium-pattern abstraction
- anti-pattern capture

Must not own:
- final deck rendering
- business research generation
- direct storyline generation

### 4. Renderer / Delivery
Purpose:
- Turn structured slide content plus style decisions into preview and editable outputs.

Inputs:
- `slides_output.json`
- `style_map.json`
- `theme.json`

Outputs:
- preview HTML
- preview PNG
- editable PPTX
- render manifest

Owns:
- deterministic page layout
- native PPT object mapping
- local rerender
- versioned output directories

Must not own:
- factual interpretation
- storyline rewriting
- design memory authoring

### 5. QA
Purpose:
- Verify factual defensibility, narrative quality, visual intentionality, and export integrity.

Inputs:
- rendered outputs
- structured content
- source map

Outputs:
- `qa_report.json`
- review checklist
- fix list

Owns:
- content QA rules
- visual QA rules
- export QA rules
- regression checks

Must not own:
- direct slide generation
- primary research generation

## Recommended Repository Structure

```text
enterprise-ppt-system/
  docs/
    architecture/
    decisions/
    workflows/
  schemas/
    brief.schema.json
    audience_model.schema.json
    research_output.schema.json
    storyline_output.schema.json
    slides_output.schema.json
    style_map.schema.json
    theme.schema.json
    qa_report.schema.json
    render_manifest.schema.json
  research/
    inputs/
    outputs/
    templates/
  story/
    inputs/
    outputs/
    prompts/
    rules/
  style/
    themes/
    patterns/
    components/
    reference_extractions/
    lessons/
  render/
    page_types/
    preview/
    delivery/
    pipeline/
  qa/
    checklists/
    validators/
    reports/
  skills/
    deep-research/
    ppt-story-builder/
    ppt-style-renderer/
    ppt-style-memory/
  assets/
    icons/
    illustrations/
    backgrounds/
    ui_primitives/
  references/
  examples/
  output/
    preview/
    delivery/
    qa/
```

## Schema Plan

### Must Have In Phase 1
- `brief.schema.json`
- `audience_model.schema.json`
- `research_output.schema.json`
- `storyline_output.schema.json`
- `slides_output.schema.json`
- `style_map.schema.json`
- `theme.schema.json`
- `qa_report.schema.json`

### Recommended Data Contracts

`brief`
- topic
- audience
- industry
- objective
- time horizon
- constraints
- preferred tone
- reference deck list

`research_output`
- facts
- interpretations
- risks
- constraints
- open questions
- sources

`storyline_output`
- deck title
- core question
- chapter list
- per-slide claim
- narrative role
- page-type hint

`slides_output`
- slide id
- chapter
- page type
- title and subtitle
- claim
- content blocks
- speaker or review notes
- semantic layout hints

`style_map`
- slide id to page-type binding
- theme family
- visual anchor
- weight center
- density level
- component binding

`theme`
- palette
- typography
- spacing
- radius
- border
- shadow
- background logic

`qa_report`
- content findings
- story findings
- visual findings
- export findings
- severity
- fix owner

## Core Scripts And Runtime Pieces

### Must Have For MVP
- `validate_brief`
- `validate_research_output`
- `build_storyline`
- `build_slides_source`
- `build_style_map`
- `render_preview`
- `render_pptx`
- `rerender_pages`
- `run_qa`
- `package_delivery`

### Supporting Runtime Components
- page-type registry
- theme token resolver
- component resolver
- layout engine
- render manifest generator
- output version manager

## Skills, Assets, References

### Skills
- `deep-research`
  - Upstream knowledge generation and validation.
- `ppt-story-builder`
  - Research to storyline and structured slides.
- `ppt-style-renderer`
  - Page-type binding, preview rendering, editable delivery.
- `ppt-style-memory`
  - Pattern extraction, theme memory, component abstraction.
- `deck-learning`
  - Reference deck ingestion, page decomposition, and reusable layout extraction.

### Assets
- theme token sets
- component primitives
- icon packs
- background systems
- approved illustration fragments
- reference screenshots with metadata
- extracted reference layouts
- benchmark slide crops
- learned image-placement recipes

### References To Keep In Repo
- project init and architecture docs
- operating workflow
- editable output strategy
- style intelligence
- style lessons
- validated slide patterns
- quality bar
- skill split
- example schemas

## MVP Scope

### What To Build First
- one deck category: executive strategy / enterprise technology deck
- one aspect ratio: 16:9
- one core style family: dark enterprise tech
- one structured content flow from `research_output` to `slides_output`
- one independent style intelligence layer
- preview output plus editable PPTX output
- 10 to 12 priority page types
- local rerender by slide id
- QA checklist and export validation

### Priority Page Types
- `cover_orbit`
- `narrative_map`
- `trust_terminal`
- `closed_loop_flow`
- `bottleneck_shift`
- `evolution_split`
- `layered_architecture_stack`
- `scenario_flow`
- `risk_split`
- `security_control_plane`
- `chapter_summary_signal`
- `closing_control_first`

### Explicitly Out Of Scope For MVP
- arbitrary style generation without pattern library
- full autonomous deep research crawler stack
- image-first final delivery
- support for all industries and all deck genres
- full design automation for every possible page type
- one-click no-review finalization
- automated large-scale reference deck learning

## Development Sequence And Acceptance Criteria

### Step 1. Foundation Contracts
Deliver:
- repo skeleton
- schema set
- page-type registry draft
- theme token format

Accept when:
- example inputs validate cleanly
- each module has a documented boundary
- canonical flow is stable

### Step 2. Research Handoff
Deliver:
- research intake format
- source map template
- research validator

Accept when:
- facts, interpretations, risks, and constraints are clearly separated
- every factual claim can point to source ids

### Step 3. Story Builder
Deliver:
- storyline contract
- structured slide source contract
- chapter and slide validation rules

Accept when:
- every slide has one primary claim
- every chapter answers one concrete question
- no slide requires layout knowledge to understand its meaning

### Step 4. Style Intelligence
Deliver:
- theme tokens
- pattern cards
- page-type registry
- slide-to-pattern style map

Accept when:
- each important page has a visual anchor
- page weight center is explicit
- style decisions are reusable across more than one topic

### Step 5. Preview Renderer
Deliver:
- HTML preview renderer
- PNG export path
- local rerender for selected pages

Accept when:
- at least 10 page types render consistently
- preview pages show clear hierarchy and no obvious empty-shell layouts
- rerendering one page does not require full deck rebuild

### Step 6. Editable PPT Renderer
Deliver:
- native PPT object mapping for priority page types
- editable PPTX export
- versioned output manifest

Accept when:
- text remains editable
- major shapes and charts remain native objects where practical
- final delivery is not only screenshot-backed slides

### Step 7. QA Layer
Deliver:
- content QA
- visual QA
- export QA
- final fix list format

Accept when:
- common failures are caught automatically or flagged for review
- QA result is reproducible
- a slide is rejected if it is not narratively necessary, visually intentional, factually defensible, and locally revisable

### Step 8. Deck Learning System
Deliver:
- reference ingestion workflow
- slide decomposition format
- pattern extraction cards
- alignment and image-usage rules
- benchmark gallery

Accept when:
- at least one strong external deck can be abstracted into reusable page knowledge
- extracted patterns can influence page-type design or renderer upgrades
- learning output is stored as structured assets, not only screenshots

## Technical Route Options

### Option A. Recommended
Use TypeScript or JavaScript as the main implementation language.

Architecture:
- structured JSON as source of truth
- HTML preview renderer for fast iteration
- `PptxGenJS` delivery renderer for native editable PPTX
- shared page-type registry and theme token system across both renderers

Why this is the preferred path:
- aligns with editable delivery requirement
- keeps preview and delivery separated but consistent
- works well with reusable page-type functions
- matches the current slide skill guidance

### Option B. Unified Intermediate Layout Model
Use a layout AST between structured slide content and final renderers.

Architecture:
- story and style produce a layout-ready slide AST
- one renderer targets HTML
- one renderer targets PPTX

Why it is strong:
- maximum consistency between preview and delivery
- easier regression testing at the layout layer

Tradeoff:
- more design work up front
- slower initial MVP

### Option C. Temporary Hybrid For Complex Visuals
Use native PPT objects for text, simple shapes, charts, and tables, while allowing some complex diagrams to be inserted as SVG.

Why it is acceptable:
- preserves editability for most enterprise content
- reduces early renderer complexity

Constraint:
- this can be a bridge only
- the final system cannot rely on full-slide raster images as delivery

## Recommended MVP Technical Stack
- language: TypeScript
- preview: HTML/CSS renderer
- editable PPTX: `PptxGenJS`
- validation: schema validation plus render QA scripts
- storage: versioned JSON outputs and asset manifests

## Risks And Open Questions

### Main Risks
- style intelligence may collapse into template reuse if pattern cards are too weak
- preview and PPTX outputs may drift if page-type rules are not shared
- story and rendering may get mixed if `slides_output` contains visual geometry too early
- editable PPT support will be expensive for highly custom visual motifs
- QA may remain manual unless visual defects are encoded as concrete checks
- deck learning may degrade into screenshot collection if extraction is not structured

### Open Questions
- How much of deep research is in-repo versus external skill input for MVP?
- Should style intelligence choose page types directly, or should story builder only emit hints and let style finalize?
- What is the minimum set of native PPT components needed to cover premium-looking enterprise pages?
- Which complex visuals are allowed to stay as SVG in MVP?
- What is the first benchmark deck used as the acceptance reference?
- What is the minimum structured format for learned layout knowledge from reference decks?

## Final Recommendation
Start with a strict layered MVP:
- deep research as upstream structured input
- story builder as narrative compiler
- style intelligence as design memory and page-type binding layer
- renderer as deterministic preview plus editable PPT delivery engine
- QA as an explicit gate

Do not start by chasing full automation.
Start by making one deck category excellent, editable, and locally revisable.
