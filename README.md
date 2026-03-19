# Enterprise PPT System

This repository is the design-stage skeleton for an enterprise PPT production system.

Current phase:
- project modeling
- repository planning
- schema and contract definition
- style asset planning
- MVP scoping

Not in scope yet:
- business rendering code
- full workflow automation
- production research crawling

Core modules:
- `research/`
- `story/`
- `style/`
- `render/`
- `qa/`

Primary design references:
- [PROJECT_INIT.md](D:/code/enterprise-ppt-system-bootstrap/PROJECT_INIT.md)
- [PROJECT_BLUEPRINT.md](D:/code/enterprise-ppt-system-bootstrap/PROJECT_BLUEPRINT.md)
- [docs/architecture/module-boundaries.md](D:/code/enterprise-ppt-system-bootstrap/docs/architecture/module-boundaries.md)

Recommended implementation direction:
- judgment layer: model-driven research, story, page-type choice, critique
- execution layer: schema validation, preview render, PPTX export, QA
- editable delivery: native PPT objects via `PptxGenJS`

Immediate next step after this skeleton:
- implement schema validation and registry loading
- keep preview and delivery paths separate
- start with the MVP page-type set only
