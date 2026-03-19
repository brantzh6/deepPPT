# ADR-0003: Fast-Track MVP Uses A Delivery-First Path

## Status
Accepted

## Context
The project needs a usable MVP quickly, with acceptable quality, before investing in broader style exploration and a larger preview stack.

## Decision
For MVP:
- lock one theme family
- implement 8 priority page types only
- keep deep research as structured upstream input
- keep style binding semi-automatic
- prioritize editable PPTX rendering first
- derive preview PNG from the rendered PPTX

Deferred until after MVP:
- standalone HTML preview renderer
- multi-theme support
- automatic page-type selection at scale
- generalized style intelligence beyond the MVP page-type set

## Consequences
- delivery value arrives faster
- preview and delivery drift is reduced in early stages
- style quality depends on a strong fixed theme and page-type library
- broader style optimization moves to phase two
