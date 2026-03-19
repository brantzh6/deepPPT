# Suggested Skill Split

## 1. deep-research
Purpose:
- produce fact base, source map, trend summary, risks, open questions

Output:
- research_output.json
- source_map.md
- research report

## 2. ppt-story-builder
Purpose:
- turn research into storyline and structured slide source

Output:
- storyline_output.json
- slides_output.json

## 3. ppt-style-renderer
Purpose:
- choose page types and render previews / editable output

Output:
- style_map.json
- preview html/png
- editable pptx

## Optional 4. ppt-style-memory
Purpose:
- collect and abstract visual patterns, themes, and components

Output:
- pattern cards
- theme tokens
- component definitions

## Why Split Skills
This keeps context small and responsibilities clear.
It also avoids mixing deep research logic with rendering logic.
