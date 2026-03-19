# Module Boundaries

## Goal
Keep research, story, style, rendering, and QA separable so the system remains revisable and testable.

## Canonical Data Flow
`brief -> research_output -> storyline_output -> slides_output -> style_map/theme -> preview -> editable_pptx -> qa_report`

## Reference Learning Flow
`reference deck/pdf/screenshots -> extraction cards -> pattern library -> style intelligence -> renderer upgrades`

## Deep Research
Input:
- brief
- audience
- industry constraints
- source materials

Output:
- `research_output.json`
- `source_map.md`

Must decide:
- facts
- interpretations
- risks
- constraints
- open questions

Must not decide:
- slide order
- page geometry
- theme
- final page type

## Story Builder
Input:
- `research_output.json`
- audience model
- optional reference extraction

Output:
- `storyline_output.json`
- `slides_output.json`

Must decide:
- chapter questions
- page sequence
- one primary claim per slide
- supporting evidence
- narrative role

May suggest:
- page-type hints
- semantic layout hints

Must not decide:
- token-level style
- x/y positions
- PPT object mapping

## Style Intelligence
Input:
- page-type hints
- audience tone
- theme family
- reference patterns

Output:
- `style_map.json`
- `theme.json`
- pattern and component assets

Must decide:
- page-type binding
- visual anchor
- weight center
- density level
- component choice

Must not decide:
- factual claims
- chapter structure
- export format

## Deck Learning System
Input:
- reference decks
- PDFs
- screenshots
- style review notes

Output:
- pattern cards
- layout skeletons
- alignment rules
- image-placement rules
- benchmark references

Must decide:
- what page type a reference slide represents
- what visual anchor makes it work
- what alignment and spacing logic is reusable
- what should be stored as reusable knowledge instead of copied literally

Must not decide:
- the final content of a new deck
- runtime rendering geometry for a specific output
- business storyline

## Renderer
Input:
- `slides_output.json`
- `style_map.json`
- `theme.json`

Output:
- preview HTML
- preview PNG
- editable PPTX
- `render_manifest.json`

Must decide:
- deterministic layout
- object placement
- overflow handling
- versioned output paths

Must not decide:
- research interpretation
- storyline rewrite
- pattern knowledge authoring

## QA
Input:
- structured content
- render outputs
- source map

Output:
- `qa_report.json`
- fix list

Must decide:
- whether a slide is acceptable
- severity and ownership of defects

Must not decide:
- to silently rewrite content
- to silently restyle pages
