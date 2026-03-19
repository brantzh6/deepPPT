# ADR-0001: Layered PPT Production Pipeline

## Status
Accepted

## Context
Enterprise PPT generation fails when research, story, style, and rendering are merged into a single opaque workflow. That makes revisions expensive and causes shallow content or generic visuals.

## Decision
Adopt a layered pipeline:
- deep research
- story builder
- style intelligence
- renderer
- QA

Each layer must produce structured artifacts that can be inspected and rerun independently.

## Consequences
- local rerender becomes possible
- style can evolve without rewriting content
- the same research can support multiple deck variants
- module contracts become a first-order concern
