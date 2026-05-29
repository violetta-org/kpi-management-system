---
name: design-apps-powerapps-com
description: Design system extracted from Quản lý Định biên Nhân sự (https://apps.powerapps.com/play/e/93f7336b-d087-ef78-9065-10f290d2559a/app/98b5f028-7b8e-4195-84af-d7d9152c95e3?tenantId=42350984-d0f6-4a38-978a-aa84e495e429&sourcehint=1&hint=41e3f32a-bce8-4be7-9685-b0e482b991e8&sourcetime=1779994940915&source=portal). Use when building UI that should match this brand's visual identity.
triggers:
  - "Quản lý Định biên Nhân sự"
  - "apps-powerapps-com"
  - "design like Quản lý Định biên Nhân sự"
  - "Quản lý Định biên Nhân sự風"
source: https://apps.powerapps.com/play/e/93f7336b-d087-ef78-9065-10f290d2559a/app/98b5f028-7b8e-4195-84af-d7d9152c95e3?tenantId=42350984-d0f6-4a38-978a-aa84e495e429&sourcehint=1&hint=41e3f32a-bce8-4be7-9685-b0e482b991e8&sourcetime=1779994940915&source=portal
extractedAt: 2026-05-29T04:25:30.377Z
tags: ["light", "rounded", "accented", "compact", "sans-serif"]
---
# Design System Inspired by Quản lý Định biên Nhân sự

> Auto-extracted from `https://apps.powerapps.com/play/e/93f7336b-d087-ef78-9065-10f290d2559a/app/98b5f028-7b8e-4195-84af-d7d9152c95e3?tenantId=42350984-d0f6-4a38-978a-aa84e495e429&sourcehint=1&hint=41e3f32a-bce8-4be7-9685-b0e482b991e8&sourcetime=1779994940915&source=portal` on 2026-05-29

## 1. Visual Theme & Atmosphere

Friendly, approachable design with rounded shapes and generous whitespace.

**Key Characteristics:**
- Inter as the heading font
- sans-serif as the body font for all running text
- Light/white background (#ffffff) as the primary canvas
- Primary accent `#b6393a` used for CTAs and brand highlights
- Rounded corners (50px+) creating a friendly, approachable feel
- Tags: light, rounded, accented, compact, sans-serif

## 2. Color Palette & Roles

### Primary
- **Primary Accent** (`#b6393a`) · `--color-primary`: Brand color, CTA backgrounds, link text, interactive highlights.
- **Secondary Accent** (`#b15058`) · `--color-secondary`: Secondary brand, hover states, complementary highlights.
- **Background** (`#ffffff`) · `--color-bg`: Page background, primary canvas.
- **Background Secondary** (`#b15058`) · `--color-bg-secondary`: Cards, surfaces, alternating sections.

### Text
- **Text Primary** (`#000000`) · `--color-text`: Headings and body text.
- **Text Secondary** (`#666666`) · `--color-text-secondary`: Muted text, captions, placeholders.

### Borders & Surfaces
- **Border** (`#e5e5e5`) · `--color-border`: Dividers, outlines, input borders.

### Full Extracted Palette

| # | Hex | CSS Variable | Role | Area | Contrast |
|---|---|---|---|---|---|
| 1 | `#b6393a` | `--palette-1` | block | medium | text-light |
| 2 | `#b15058` | `--palette-2` | button | medium | text-light |
| 3 | `#742774` | `--palette-3` | button | small | text-light |
| 4 | `#ffffff` | `--palette-4` | button | small | text-dark |

## 3. Typography Rules

- **Heading Font:** `Inter`, sans-serif
- **Body Font:** `sans-serif`, sans-serif

### Type Scale

| Token | Size | Suggested Usage |
|---|---|---|
| Display | `18px` | headings |
| H1 | `16px` | headings |
| H2 | `14px` | headings |
| H3 | `13.3333px` | headings |
| H4 | `13px` | headings |
| Body L | `12px` | body / supporting text |
| Body | `6px` | body / supporting text |

## 4. Component Stylings

### Primary Button

```css
.btn-primary {
  background: #742774;
  color: #ffffff;
  border-radius: 2px;
  padding: 0px 16px;
  font-size: 14px;
  font-weight: 400;
  border: 1px dotted rgb(0, 0, 0);
  cursor: pointer;
}
```

### Filled Button

```css
.btn-filled {
  background: #b15058;
  color: #ffffff;
  border-radius: 0px;
  padding: 0px 0px;
  font-size: 13.3333px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Filled Button 2

```css
.btn-filled-2 {
  background: #b15058;
  color: #ffffff;
  border-radius: 2px;
  padding: 0px 4px;
  font-size: 14px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Filled Button 3

```css
.btn-filled-3 {
  background: #ffffff;
  color: #323130;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 400;
  border: 1px solid rgb(209, 209, 209);
  cursor: pointer;
}
```

## 5. Layout Principles

- **Base spacing unit:** `4px` — use multiples (8px, 12px, 16px, etc.)

### Spacing Scale (extracted from real elements)

| Token | Value | Role |
|---|---|---|
| spacing-1 | `4px` | element |

### Border Radius Scale

| Token | Value | Element |
|---|---|---|
| radius-card | `50px` | card |
| radius-subtle | `2px` | subtle |
| radius-subtle | `4px` | subtle |

## 6. Depth & Elevation

No prominent box-shadows detected. This design likely uses flat surfaces with borders or background color changes for depth.

## 7. Do's and Don'ts

### Do
- Use `#ffffff` as the primary background color
- Use `Inter` for all headings and `sans-serif` for body text
- Use `#b6393a` as the single dominant accent/CTA color
- Maintain `4px` as the base spacing unit — all gaps should be multiples
- Use rounded corners (`50px`+) consistently for all interactive elements

### Don't
- Don't use colors outside the extracted palette without justification
- Don't substitute Inter/sans-serif with generic alternatives
- Don't use irregular spacing — stick to 4px grid
- Don't use dark/black backgrounds — this is a light-themed design
- Don't use sharp corners — they feel hostile in this rounded design language
- Don't use oversized hero text — this brand uses restrained type
- Don't use pure black (#000000) for text — use `#000000` instead
- Don't add decorative elements not present in the original design — no badges, ribbons, banners, or ornaments unless the source site uses them
- Don't invent UI patterns the source site doesn't have — if the original has no NEW badge, don't add one just because a red is in the palette

## 8. Responsive Behavior

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 640px | Single column, stack sections, reduce font sizes ~80% |
| Tablet | 640–1024px | 2-column where appropriate, maintain spacing ratios |
| Desktop | 1024–1440px | Full layout as designed |
| Wide | > 1440px | Max-width container, center content |

- Touch targets: minimum 44×44px on mobile
- Maintain 4px base unit across breakpoints — only scale multipliers

## 9. Agent Prompt Guide

### Quick Color Reference

```
Background:  #ffffff
Text:        #000000
Accent:      #b6393a
Secondary:   #b15058
Border:      #e5e5e5
```

### Example Prompts

1. "Build a hero section with a `#ffffff` background, `Inter` heading in `#000000`, and a `#b6393a` CTA button with 2px radius."
2. "Create a pricing card using background `#b15058`, border `#e5e5e5`, `sans-serif` for text, and 12px padding."
3. "Design a navigation bar — `#ffffff` background, `#000000` links, `#b6393a` for active state."
4. "Build a feature grid with 3 columns, 12px gap, each card using the card component style."
5. "Create a footer with `#000000` background, `#ffffff` text, and 8px padding."

### Iteration Guide

1. Start with layout structure (sections, grid, spacing)
2. Apply colors from the palette — background first, then text, then accents
3. Set typography — font families, sizes from the type scale, weights
4. Add components — buttons, cards, inputs using the specs above
5. Apply border-radius consistently across all elements
6. Check responsive behavior — test mobile and tablet layouts
7. Final pass — verify all colors match, spacing is consistent, fonts are correct
