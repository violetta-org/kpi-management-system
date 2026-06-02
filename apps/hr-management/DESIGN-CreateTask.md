# Design System Specification: Create Task Modal

## 1. Core Atmosphere
- **Theme**: Professional, high-contrast, data-centric.
- **Surface**: Pure White (`#ffffff`) on a dim backdrop (`oklab(0 0 0 / 0.5)`).
- **Rounding**: Standard `8px` for containers, `6px` for elements.
- **Borders**: 1px solid black (`#000000`) for all structure-defining lines.

## 2. Global Typography
- **Font Family**: `ui-sans-serif, system-ui, sans-serif`
- **Primary Text**: `#000000`
- **Secondary/Muted**: `rgba(0, 0, 0, 0.7)`

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| Title | `18px` | 600 | `28px` | "Create New Task" |
| Label | `14px` | 500 | `14px` | Form labels |
| Body | `16px` | 400 | `24px` | Input/Textarea text |
| Helper | `12px` | 400 | `16px` | Small notes |

## 3. Container: The Modal Shell (`uid=618`)
- **Layout**: `display: grid; gap: 16px; padding: 24px;`
- **Dimensions**: `width: 550px; max-height: 503px; overflow-y: auto;`
- **Position**: `fixed; top: 50%; left: 50%; translate(-50%, -50%);`
- **Shadow**: `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)`

## 4. Component Library (The Form)

### 4.1. Standard Input & Textarea
- **Border**: `1px solid #000000; border-radius: 6px;`
- **Sizes**: 
  - Input (Name): `h: 36px; p: 4px 12px;`
  - Textarea (Desc): `h: 64px; p: 8px 12px;`

### 4.2. Select Buttons (Comboboxes)
- **Appearance**: Bordered buttons with text aligned to the left and a dropdown arrow (not shown in styles but present in UI).
- **Height**: `36px; padding: 8px 12px;`
- **Widths**:
  - `Project`: 115px
  - `Phase`: 109px
  - `Objective`: 128px
  - `Subtask`: 141px

### 4.3. Assignee Card (Special Component)
- **Container**: `border: 1px solid #000; border-radius: 6px; padding: 12px; display: flex; align-items: center; gap: 12px;`
- **Avatar**: Circle with 1px black border, initials centered.
- **Identity**: `14px Medium` text for name, `12px` for "Assigned to you".

### 4.4. Buttons (Actions)
- **General**: `h: 36px; br: 6px; fw: 500; fs: 14px;`
- **Cancel Button**: `border: 1px solid #000; padding: 8px 16px; w: 485px;`
- **Create Task**: `border: none; padding: 8px 16px; w: 485px;` (Primary action).

## 5. Header & Navigation
- **Header (`uid=614`)**: `display: flex; flex-direction: column; gap: 8px; text-align: center;`
- **Close Button (`uid=616`)**: `position: absolute; top: 16px; right: 16px; size: 16x16; opacity: 0.7;`

## 6. Layout Logic
- **Spacing**: Use a `4px` grid. All margins/gaps are multiples of 4 (8, 12, 16, 24).
- **Overflow**: When form content exceeds `503px`, the modal body scrolls vertically.