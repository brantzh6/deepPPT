# Standard Operating Workflow

## Phase 1. Brief And Audience Model
Required inputs:
- topic
- audience
- industry
- objective
- time horizon
- constraints
- preferred tone
- reference deck samples

Output:
- brief.md
- audience model
- success criteria

## Phase 2. Research
Tasks:
- collect primary and high-quality secondary materials
- separate facts from interpretation
- identify the main tensions and open issues
- extract relevant industry constraints

Output:
- research_output.json
- source_map.md
- topic summary

## Phase 3. Reference Deck Extraction
Tasks:
- extract the main claims from each reference slide
- identify each slide's role in the narrative
- identify each slide's visual type
- capture why the slide works

Output:
- reference_extraction.md
- pattern candidates

## Phase 4. Storyline Lock
Tasks:
- decide chapter-level questions
- decide page sequence
- define one claim per page
- remove weak or duplicate pages

Output:
- storyline_output.json
- chapter map

## Phase 5. Structured Slide Source
Tasks:
- convert storyline into structured slide content
- separate title, claim, evidence, notes, layout hints
- ensure high-risk pages include boundaries and caveats

Output:
- slides_output.json

## Phase 6. Style Mapping
Tasks:
- choose theme family
- bind each page to a page type
- choose visual anchor and layout priority
- detect pages that need asymmetry or stronger emphasis

Output:
- style_map.json
- theme.json

## Phase 7. Preview Rendering
Tasks:
- render only a critical subset first
- review cover, agenda, one architecture page, one risk page, one conclusion page
- fix weak pages locally

Output:
- preview html/png

## Phase 8. Full Rendering
Tasks:
- full deck render
- local page rerender if needed
- editable pptx export

Output:
- preview deck
- editable delivery deck

## Phase 9. QA
Tasks:
- content accuracy review
- audience fit review
- visual QA
- export QA

Output:
- qa checklist
- final fix list

## Golden Rule
Never go directly from topic to full rendered deck.
Always pass through:
- research
- storyline
- structured content
- style map
- preview
- QA
