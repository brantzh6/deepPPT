# Style Intelligence

## Purpose
Style intelligence is the design memory of the system.
Its role is not to generate slides directly, but to provide reusable visual reasoning and reusable assets.

## What It Should Store

### 1. Reference Samples
- source images or screenshots
- source metadata
- audience / domain tags
- quality notes

### 2. Pattern Library
Each strong page should be abstracted into a pattern:
- page type
- topic fit
- visual anchor
- layout rules
- hierarchy rules
- anti-patterns

### 3. Theme Library
Themes should be stored as token sets, not screenshots.
A theme should include:
- color palette
- typography rules
- spacing scale
- border / radius system
- shadow / glow system
- background logic

### 4. Component Library
Reusable objects:
- terminal window
- chip row
- orbit / core node
- timeline axis
- architecture stack
- decision core
- risk split
- status bars

## What To Extract From Every Good Reference Slide
- narrative role
- slide type
- visual anchor
- weight center
- asymmetry or symmetry
- density level
- what makes it feel premium
- what should not be copied blindly

## Pattern Card Template
```yaml
id: trust_terminal_v1
page_type: trust_architecture
topic_fit:
  - architecture explanation
  - trust explanation
visual_anchor: terminal_window
weight_center: right-middle
theme_family: dark-tech
layout_rules:
  - left concept block
  - right execution stack
  - no more than 3 major layers
anti_patterns:
  - pure bullet lists
  - empty boxes
  - perfect symmetry
```

## Why This Matters
Without style intelligence, the renderer falls back to generic templates.
That produces slides that are visually acceptable but strategically weak.

With style intelligence, the system can choose expression forms intentionally.

## Files To Keep Alongside This One
To preserve actual project knowledge, style intelligence should not live in one file only.

At minimum, keep:
- `style-lessons-from-openclaw-deck.md`
- `validated-slide-patterns.md`

These files record:
- concrete style failures and fixes
- page types that proved reusable
- what created “premium” feeling in practice
- what repeatedly made pages look weak
