# DESIGN.md: Task Management Dashboard

## 1. Overview
The Task Management Dashboard is a clean, data-focused interface for managing and viewing tasks. It uses a vertical layout with clear separation between header, informative alerts, filters, and the content area.

## 2. Layout & Spacing
- **Container**: `div.space-y-6.p-6`
  - **Padding**: `24px` (6 units) all around.
  - **Vertical Gap**: `24px` (`space-y-6`) between major sections.
- **Max Width**: Typically full width of the main content area, scaling with the viewport.

## 3. Typography
- **Font Stack**: System sans-serif (`ui-sans-serif, system-ui, sans-serif`).
- **Main Heading (H1)**:
  - **Text**: "Task Management"
  - **Size**: `24px`
  - **Weight**: `700` (Bold)
- **Secondary Text**:
  - **Size**: `14px`
  - **Weight**: `400` (Regular)
- **Empty State Title**:
  - **Size**: `18px`
  - **Weight**: `500` (Medium)
- **Badges/Tags**:
  - **Size**: `12px`
  - **Weight**: `500`

## 4. Components

### 4.1. Header Section
- **Elements**: Icon, Title, Welcome Message, User Role Badge, and "New Task" Button.
- **Role Badge**:
  - **Border**: `1px solid #000000`
  - **Border Radius**: `6px`
  - **Padding**: `2px 8px`
- **New Task Button**:
  - **Text**: "+ New Task"
  - **Layout**: Flexbox with icon.

### 4.2. Info Banner (Alert)
- **Border**: `1px solid #000000`
- **Border Radius**: `8px`
- **Padding**: `16px`
- **Text**: "Employee View: Showing tasks assigned to you..." (Uses `<strong>` for prefix).

### 4.3. Filter & Search Controls
- **Search Input**:
  - **Icon**: Magnifying glass positioned absolutely within the container.
  - **Border**: `1px solid #000000`
  - **Border Radius**: `6px`
  - **Padding**: `4px 12px 4px 40px` (Left padding accommodates icon).
- **Project Filter (Select Button)**:
  - **Border**: `1px solid #000000`
  - **Border Radius**: `6px`
  - **Padding**: `8px 12px`
  - **Layout**: Flexbox (Space-between) for text and chevron.

### 4.4. Empty State Area
- **Container**: `min-height: 218px`, centered content.
- **Border**: `dashed` (though currently computed as `0px dashed` in some states, visually implied as a container).
- **Padding**: `80px 24px` (vertical emphasis).
- **Content**: "No tasks found" (Title) + "Create your first task..." (Subtext).

## 5. Color Palette
- **Background**: `#ffffff` (White)
- **Text/Borders**: `#000000` (Pure Black)
- **Backdrop/Overlay**: (N/A for this view)

## 6. Responsive Behavior
- **Mobile (< 640px)**: Sections stack vertically (`flex-direction: column`).
- **Desktop**: Header items (Title and New Task button) may align horizontally (`flex-row`) with `justify-content: space-between`.