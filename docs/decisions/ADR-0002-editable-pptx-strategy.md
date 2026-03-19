# ADR-0002: Editable PPTX Is A First-Class Output

## Status
Accepted

## Context
HTML to PNG is fast for preview but fails enterprise delivery requirements because text and layout cannot be revised safely after export.

## Decision
Use a dual-output model:
- preview pipeline for HTML and PNG
- delivery pipeline for native editable PPTX

Preferred renderer direction:
- `PptxGenJS` for native PPT objects

Allowed temporary bridge:
- SVG insertion for complex visuals when native object mapping is not yet practical

Rejected as final delivery:
- full-slide raster output
- HTML to PNG to PPT as the only output path

## Consequences
- render logic must preserve semantic page types
- theme and component systems must map to native slide objects
- preview and delivery outputs need shared contracts
