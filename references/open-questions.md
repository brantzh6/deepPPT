# Open Questions

## Product Questions
- How much design freedom should the first renderer support?
- Should the first delivery renderer target 8-12 controlled page types only?
- Should editable PPTX be the default output or a second-stage export?

## Technical Questions
- Which native PPT renderer is the primary path: `pptxgenjs` or `python-pptx`?
- How should text fitting and overflow rules be encoded?
- Should page-type selection be fully model-driven or constrained by rule tables?

## Workflow Questions
- How many review loops should be required before full render?
- Should the system force reference extraction whenever reference slides are provided?
- Should final QA be model-only, rule-only, or hybrid?

## Asset Questions
- How should pattern cards be versioned?
- How should themes be packaged for reuse?
- How should new high-quality reference slides be promoted into the pattern library?
