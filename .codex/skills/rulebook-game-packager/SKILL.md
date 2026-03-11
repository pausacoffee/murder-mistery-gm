---
name: rulebook-game-packager
description: Create or update a murder mystery game package from scanned rulebooks or extracted text. Use when converting a game into this repository's catalog/game package structure, including metadata, phase order, timers, transition guards, and review placeholders.
---

# Rulebook Game Packager

Use this skill when a user provides a murder mystery rulebook scan, OCR text, or a partially structured document and wants a playable package added to this repository.

## Output Contract
Create or update:
- `data/catalog.json`
- `games/<id>/game.json`
- `games/<id>/slides.html` for migration-safe output, or `games/<id>/slides.json` if the renderer supports it
- `games/<id>/rules.json` when rule modal content is externalized
- `games/<id>/assets/` references only when the asset is actually available
- add `theme` in `game.json` only when a real override is needed; otherwise rely on `styles/themes/default.css`

## Workflow
1. Extract metadata: title, player counts, synopsis, aliases for search.
2. Extract the game flow in order: intro, setup, parts, phases, vote/selection steps, ending.
3. Extract timing:
   - shared timer
   - per-player timer
   - special guard or transition checks
4. Map rulebook content into reusable slide types.
5. Record any uncertainty as placeholders or TODO markers instead of guessing.
6. Update the catalog entry so the game is searchable immediately.

## Slide Heuristics
- Story/setup prose: `story`
- Ordered phase explanation: `order`
- Timed action: `timer`
- Character or NPC explanation: `custom` or dedicated slide if the renderer supports it
- Voting/selection ceremony: `vote` or `selection`
- Final instruction: `ending`

## Order Diagram Rule
- When building an order or flow diagram, do not render textual arrows such as `→`, `=>`, or `->`.
- Use CSS or SVG vector arrows instead.
- Reuse the repository's existing arrow component/style when available.

## Transition Guards
If the rulebook requires a check before entering the next part, encode it as slide data when supported.

For `slides.html`, prefer:
- `data-next-confirm-title`
- `data-next-confirm-detail`
- optional `data-next-confirm-note`

Do not add a game-specific JS branch just to block the next slide.

## Constraints
- Do not invent missing numbers, names, or conditions.
- Keep catalog data short and search-oriented.
- Keep package data execution-oriented.
- Prefer repository schema consistency over mirroring the PDF layout exactly.
- If the rulebook is written in Japanese or another language, convert the package output into natural Korean GM-facing copy instead of leaving OCR fragments as-is.
- Do not assume every game needs its own theme CSS file.
- If a game has no distinctive visual override, leave it on the default theme and keep styling changes in shared CSS layers.

## Review Handoff
At the end, clearly mark:
- what was confidently extracted
- what remains placeholder
- what needs human verification against the original rulebook
