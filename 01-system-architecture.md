# System Architecture

## Architecture Principle
Separate judgment from execution.

- Large model: judgment, editing, audience adaptation, page-type selection, review
- Code engine: deterministic rendering, layout, export, regression-safe assembly

## Layers

### 1. Research Layer
Input:
- topic
- audience
- industry
- objective
- constraints
- source materials

Output:
- research report
- fact base
- source map
- key tensions / risks / open questions

### 2. Story Layer
Input:
- research outputs
- reference deck extractions

Output:
- chapter logic
- page-by-page storyline
- per-page claim
- per-page evidence / supporting points
- structured slide source

### 3. Style Intelligence Layer
Input:
- style family
- audience tone
- reference patterns
- page types

Output:
- style map
- theme token set
- page-type bindings
- visual anchors

### 4. Renderer Layer
Input:
- structured slide content
- style map
- theme tokens

Output:
- preview HTML
- preview PNG
- editable PPTX

### 5. QA Layer
Input:
- rendered output
- content source
- source map

Output:
- content QA report
- visual QA report
- fix list

## Canonical Data Flow
```text
deep research
-> research_output.json
-> storyline_output.json
-> slides_output.json
-> style_map.json
-> preview html/png
-> editable pptx
-> qa reports
```

## Why This Separation Matters
Without separation:
- content and layout contaminate each other
- revisions become expensive
- style changes require content rewrites
- rendering bugs are hard to isolate

With separation:
- the same research can feed multiple deck variants
- the same storyline can be rendered in different visual systems
- the same visual system can be reused for new topics
- revisions can happen at the right layer

## Suggested Runtime Components
- content validator
- page-type selector
- theme token resolver
- HTML preview renderer
- editable PPT renderer
- screenshot/export pipeline
- QA checker
