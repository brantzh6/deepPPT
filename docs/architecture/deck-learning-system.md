# Deck Learning System

## Goal
Turn strong external decks into reusable page knowledge, not static inspiration.

## What It Learns
- page types
- layout skeletons
- alignment logic
- weight center
- visual anchors
- image usage
- highlight grammar
- anti-patterns

## Minimal Workflow
1. Ingest a reference deck, PDF, or screenshot set.
2. Extract one slide at a time into `reference_slide_extraction`.
3. Merge repeated strong patterns into `pattern_card`.
4. Feed extracted rules back into `style intelligence`.
5. Use renderer upgrades and QA to verify the learned pattern is actually reusable.

## First Iteration Scope
- start with 1 strong benchmark deck
- extract 3 to 5 representative slides
- create 3 to 5 pattern cards
- focus on reusable executive page types, not edge cases

## Storage Model
- raw reference assets stay in `references/` or external storage
- extracted cards live in `style/reference_extractions/`
- reusable patterns live in `style/patterns/`

## Golden Rule
Do not store only screenshots.
Store why the page works, what should be reused, and what should not be copied literally.
