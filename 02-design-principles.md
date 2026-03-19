# Design And Product Principles

## Content Principles
1. Facts first, interpretation second, recommendation third.
2. Every chapter must answer a concrete decision question.
3. Every slide must have one primary claim.
4. Do not confuse knowledge completeness with presentation quality.
5. Enterprise decks must state boundaries, not just upside.

## Story Principles
1. Lock storyline before rendering.
2. A page exists only if it has a clear narrative role.
3. Chapter logic matters more than deck length.
4. A good deck is edited, not merely generated.
5. Audience adaptation is mandatory.

## Visual Principles
1. Color similarity is not design quality.
2. Each slide needs a visual anchor, not just text boxes.
3. Page weight and visual center must be intentional.
4. Repeated generic card layouts degrade perceived quality.
5. Theme consistency and page variety must coexist.

## Rendering Principles
1. Preview and delivery are separate concerns.
2. Use structured content as the single source of truth.
3. Avoid image-only final output as the only delivery mode.
4. Support local page rerendering.
5. Use deterministic export paths and versioned outputs.

## QA Principles
1. Content QA and visual QA are separate review passes.
2. Preview a small critical set of pages before full render.
3. Do not trust one-shot generation for enterprise deliverables.
4. Track unresolved assumptions explicitly.
5. Final delivery must be reproducible.

## Product Principles
1. The system is a PPT production system, not a template launcher.
2. Large models should act as editor, design director, and reviewer.
3. Rules and code should handle precision and stability.
4. Every layer should be inspectable and replaceable.
5. Editable delivery is a first-class requirement.
