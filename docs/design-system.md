# Design System

This project uses a warm editorial UI style with soft glass surfaces, bold
rounded shapes, and a restrained teal accent.

## Core Character

- Tone: calm, polished, slightly premium
- Visual mix: soft organic background + sharp modern typography
- Shape language: large radii, pill buttons, roomy spacing
- Contrast strategy: muted surfaces with a single clear accent color

## Typography

- Primary font: `Space Grotesk`
- Fallbacks: `"Avenir Next"`, `"Segoe UI"`, `sans-serif`
- Headings use tight tracking and heavier weight
- Small labels use uppercase with wide letter spacing

Typography patterns:

- Primary page headings: bold with negative tracking
- Eyebrow labels: uppercase, compact, tracked out
- Body text: muted, readable, not overly dense

## Color System

The system is built from semantic tokens rather than hardcoded utility colors.

### Light Theme

- Background: `--color-bg: #f5efe4`
- Elevated surface: `--color-bg-elevated: rgba(255, 251, 245, 0.8)`
- Strong surface: `--color-bg-strong: #fffdf8`
- Text: `--color-text: #221c15`
- Muted text: `--color-muted: #6a6258`
- Border: `--color-border: rgba(60, 43, 18, 0.12)`
- Accent: `--color-accent: #0f766e`
- Strong accent: `--color-accent-strong: #115e59`
- Soft accent fill: `--color-accent-soft: rgba(15, 118, 110, 0.12)`
- Focus ring: `--color-ring: rgba(15, 118, 110, 0.32)`

### Dark Theme

- Background: `--color-bg: #10181f`
- Elevated surface: `--color-bg-elevated: rgba(20, 31, 40, 0.82)`
- Strong surface: `--color-bg-strong: #16212b`
- Text: `--color-text: #eff4f6`
- Muted text: `--color-muted: #9ab0bc`
- Border: `--color-border: rgba(214, 231, 240, 0.12)`
- Accent: `--color-accent: #5eead4`
- Strong accent: `--color-accent-strong: #99f6e4`
- Soft accent fill: `--color-accent-soft: rgba(94, 234, 212, 0.14)`
- Focus ring: `--color-ring: rgba(94, 234, 212, 0.35)`

## Background Treatment

The page background is not flat.

It combines:

- a warm or dark vertical gradient
- a soft radial highlight in the top-left
- a teal radial glow off to the side
- a faint fixed grid overlay fading downward

This gives the app atmosphere without distracting from the content.

## Surface System

The main reusable surface is `.panel`.

Panel characteristics:

- large radius: `2rem`
- semi-transparent elevated background
- subtle border
- heavy blur
- deep soft shadow

Use panels for:

- headers
- auth cards
- sidebars
- CRUD workspaces

## Component Patterns

### Primary Button

Class: `.button-primary`

- full pill radius
- solid accent fill
- white text
- stronger accent on hover

Use for:

- submit actions
- primary route actions
- confirmations

### Secondary Button

Class: `.button-secondary`

- full pill radius
- bordered surface treatment
- translucent neutral fill
- stronger surface on hover

Use for:

- navigation
- edit/delete actions
- lower-priority controls

### Eyebrow Label

Class: `.eyebrow`

- pill shape
- bordered accent-soft fill
- uppercase tracked text
- accent-colored label text

Use for:

- section labels
- small status markers
- page context framing

## Form Language

Inputs and textareas should feel soft and spacious.

Patterns:

- large rounded corners
- translucent background
- subtle border
- visible accent-colored focus state
- no overly dense spacing

## Spacing And Layout

- Layouts favor generous whitespace over compact density
- Main app shells use centered max-width containers
- Desktop layouts often split into a main panel plus sidebar
- Mobile layouts collapse cleanly into stacked sections

General spacing feel:

- outer page padding is comfortable, not edge-to-edge
- cards breathe internally
- action groups use small consistent gaps

## Theme Behavior

Theme state is stored in local storage and supports:

- `system`
- `light`
- `dark`

Implementation notes:

- the resolved theme toggles the `dark` class on `document.documentElement`
- the selected mode is stored in local storage
- system preference is tracked with `matchMedia`

## Reuse Guidance

If reusing this style in another project, preserve these pieces first:

1. Semantic CSS tokens from [src/index.css](/home/johan/Development/react-crud-starter/src/index.css)
2. Theme runtime from [src/theme/theme-provider.tsx](/home/johan/Development/react-crud-starter/src/theme/theme-provider.tsx)
3. Reusable surface and action classes:
   - `.panel`
   - `.button-primary`
   - `.button-secondary`
   - `.eyebrow`

If adapting it:

- keep the semantic token structure
- change accent color first, not component shapes
- preserve the surface softness and large radii
- keep typography expressive rather than default-system plain

## Files That Define The Current Look

- [src/index.css](/home/johan/Development/react-crud-starter/src/index.css)
- [src/theme/theme-context.ts](/home/johan/Development/react-crud-starter/src/theme/theme-context.ts)
- [src/theme/theme-provider.tsx](/home/johan/Development/react-crud-starter/src/theme/theme-provider.tsx)
- [src/theme/theme-toggle.tsx](/home/johan/Development/react-crud-starter/src/theme/theme-toggle.tsx)
