# Enterprise PPT System

## Goal
Build an enterprise-grade PPT production system that can reliably turn deep research into high-quality, editable presentation materials.

The system must solve the full chain, not just one segment:
- content accuracy
- storyline quality
- visual quality
- repeatable modification
- editable delivery

## Problem Statement
Most PPT generation tools solve only part of the problem:
- some generate content, but the content is shallow or not audience-aware
- some generate slides, but the visual system is generic and template-like
- some create attractive images, but the output is not editable
- few systems support repeated revision under enterprise constraints

This project treats PPT generation as a production system, not a one-shot output task.

## Core Thesis
A high-quality enterprise PPT requires five capabilities working together:
1. research fidelity
2. editorial judgment
3. design judgment
4. deterministic rendering
5. QA and revision loops

Large models are most valuable in the judgment layer:
- extracting the right facts and constraints
- choosing what matters and what to cut
- building a storyline for a specific audience
- selecting the best expression form for each page
- reviewing drafts and identifying weak pages

Code and templates are most valuable in the execution layer:
- layout rules
- theme application
- overflow handling
- page consistency
- editable PPT export
- regression-safe generation

## Product Direction
The system should be split into modules, not built as one monolith.

Recommended modules:
- deep research
- story builder
- style intelligence
- renderer / delivery
- QA

## Non-Goals
At the initial stage, the system should not try to solve:
- full image generation for all slides
- arbitrary design styles with no design system
- perfect one-click output without review
- support for every slide style under the sun

## Success Criteria
The project is successful when it can:
- take a research topic and produce a board-ready storyline
- generate a preview deck with clear visual hierarchy and chapter logic
- export an editable PPTX, not only PNG-backed slides
- support local revision by changing structured content instead of hand-editing every page
- pass a repeatable QA checklist for content and style

## Recommended Repository Structure
```text
enterprise-ppt-system/
├── research/
├── story/
├── design/
├── render/
├── qa/
├── skills/
└── docs/
```

## Recommended Skill Boundary
This should not be a single skill.

Recommended skills:
- `deep-research`: produces fact base, source map, and topic understanding
- `ppt-story-builder`: turns research into storyline and structured slide content
- `ppt-style-renderer`: maps content to page types, themes, previews, and editable output

Optional future skill:
- `ppt-style-memory`: collects and abstracts premium PPT design patterns
