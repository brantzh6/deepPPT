# Reference Extraction Workflow

## Purpose
Convert a strong reference slide into structured design knowledge that can be reused by the PPT system.

## Output Artifacts
- one `reference_slide_extraction` file per reference slide
- one or more `pattern_card` files when multiple references point to the same reusable page logic

## Step 1: Pick the Right Benchmark Deck
Use decks that are already strong on:
- executive clarity
- image usage
- visual hierarchy
- alignment discipline
- editable-friendly composition

Avoid decks that are strong only because of motion, dense illustration, or full-page raster art.

## Step 2: Select Candidate Slides
For the first batch, prefer slides that represent stable enterprise page needs:
- cover
- chapter opener
- agenda or narrative map
- architecture or operating model
- strategic shift or before/after
- summary or closing signal page

## Step 3: Extract One Slide
For each slide:
1. capture the source path and screenshot path
2. write the page claim in one sentence
3. identify the narrative role
4. identify the page type candidate
5. describe the visual anchor and weight center
6. document alignment logic, image usage, and highlight grammar
7. list why the page works
8. list what should not be copied blindly

Store the result in:
- [template.reference-slide.json](D:/code/enterprise-ppt-system-bootstrap/style/reference_extractions/template.reference-slide.json)

If the original slide file is not available yet:
- use `extraction_mode: documented_seed`
- point `file_path` to the design memo or pattern note that justified the extraction
- add `source_note` to make the limitation explicit
- upgrade the extraction to `direct_slide` later when the real deck or screenshot is available

## Step 4: Merge Repeated Logic into a Pattern Card
When 2 or more extracted slides share the same reusable logic:
1. create a `pattern_card`
2. summarize the common layout rules
3. summarize the common alignment rules
4. define image usage and editable target
5. record anti-patterns

Store the result in:
- [template.pattern-card.json](D:/code/enterprise-ppt-system-bootstrap/style/patterns/template.pattern-card.json)

## Step 5: Feed the Learned Pattern Back
Once a pattern card is stable:
- map it to `style/patterns/page-type-registry.json`
- update renderer rules only after the pattern is clearly reusable
- add QA checks when the pattern has known failure modes

## Review Standard
A good extraction is not a screenshot summary. It explains:
- what the slide is trying to do
- why the layout works
- where the visual weight sits
- how images contribute to impact
- which rules are reusable in a different topic
