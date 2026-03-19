# Editable Output Strategy

## Problem
HTML -> PNG -> PPTX is useful for fast preview, but the delivery is not truly editable.
That is acceptable for prototyping, but not for long-term enterprise use.

## Recommended Model
Use a dual-output pipeline:

1. Preview pipeline
- fast
- HTML
- PNG
- used for design iteration and review

2. Delivery pipeline
- structured slide source + style map
- generates native PPT objects
- used for editable enterprise delivery

## Why Keep HTML
HTML remains useful because it is:
- fast to iterate
- expressive for layout experiments
- easy to test locally
- suitable for design review loops

## Why Add Editable PPTX
Editable PPTX is required because:
- enterprise materials change constantly
- users need to revise text after delivery
- management often asks for local edits
- image-backed decks are brittle

## Recommended Delivery Renderer Options
Priority order:
1. Native editable PPT renderer using `pptxgenjs` or similar
2. Python-based PPT object renderer if page-type library is small and controlled
3. SVG intermediate output only as a temporary bridge

## Editing Model
Make structured content the single source of truth.

Recommended workflow:
- edit `slides_output.json`
- rerender only affected pages
- rebuild PPTX

This is better than hand-editing raw HTML or image-backed slides.

## Design Constraint
Any future renderer must map page types to native slide objects.
For example:
- cover_orbit
- compare_split
- terminal_trust
- layered_architecture
- risk_model
- decision_frame

A generic renderer without page-type semantics will not produce high-end results.
