# Fast-Track MVP Plan

## Objective
Ship the first usable enterprise PPT MVP as fast as possible without sacrificing editability or basic quality.

## Chosen Path
- single deck category
- single theme family
- 8 page types
- PPTX-first rendering
- preview generated from PPTX
- QA before style expansion

## Why This Path
- It removes the cost of building two renderers too early.
- It keeps style quality concentrated in one theme instead of diluted across many experiments.
- It preserves the layered model while shrinking implementation scope.

## MVP Build Order

### Step 1. Contracts
- finalize schemas
- keep `research_output`, `storyline_output`, `slides_output`, `style_map`, and `theme` stable

### Step 2. Story Chain
- accept structured research input
- produce chapter logic
- produce slide source with `page_type_hint`

### Step 3. Style Binding
- use one theme
- bind slides to 8 page types
- allow manual override when hints are weak

### Step 4. Delivery Rendering
- map 8 page types to native PPT objects
- support local rerender by slide id
- write versioned output manifest

### Step 5. Preview And QA
- rasterize PPTX to preview PNG
- run export QA
- run content and visual checklists

## Required MVP Page Types
- `cover_orbit`
- `narrative_map`
- `trust_terminal`
- `bottleneck_shift`
- `layered_architecture_stack`
- `scenario_flow`
- `risk_split`
- `chapter_summary_signal`

## Not Now
- new theme families
- style-memory automation
- complex cross-page design systems
- generalized component abstraction beyond the 8 page types
- standalone HTML preview renderer
- automated deck learning from large reference sets

## MVP Done Means
- one topic can move from structured research input to editable PPTX
- the result is reviewable through PNG previews
- rerender is local, not full-deck only
- the deck does not look like a generic template dump

## Phase Two Direction
After MVP, add a `Deck Learning System`:
- ingest strong reference decks
- extract reusable layout and image rules
- expand pattern cards from observed premium pages
- feed learned rules back into style intelligence and renderer upgrades
