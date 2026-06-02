# DESIGN.md: My KPIs - Progress Charts

## 1. Dashboard Header
- **Title**: "My KPIs"
  - **Font Size**: `24px`
  - **Weight**: `700` (Bold)
- **Subtitle**: "View your assigned KPIs and track progress"
  - **Font Size**: `16px`
  - **Color**: `#000000`

## 2. Navigation & Filters
The interface uses two levels of tabbed navigation/filtering.

### 2.1. Primary View Tabs
- **Options**: Overview, Progress Charts (Active)
- **Font Size**: `14px`
- **Weight**: `500`
- **Padding**: `4px 8px`
- **Active State**: Indicated by proximity to content, usually with a subtle background or underline (currently transparent).

### 2.2. Time Range Selection
- **Presets**: Week, Month, Quarter, Custom
- **Styling**:
  - **General**: `14px` Medium font, `6px 12px` padding.
  - **Custom Button**:
    - **Border**: `1px solid #000000`
    - **Icon**: Calendar icon (`size-4`) on the left.
    - **Border Radius**: `6px`

## 3. Date Range Indicator
- **Text**: "Showing progress from May 1, 2026 to May 29, 2026"
- **Icon**: Calendar icon prefix.
- **Font Size**: `14px`
- **Margin**: Placed directly above the main chart container.

## 4. Chart Placeholder / Container
- **Structure**: `bg-card` container with a defined border.
- **Border**: `1.11px solid #000000`
- **Border Radius**: `12px` (Rounded-xl)
- **Shadow**: `shadow-sm`
- **Padding**: `24px` vertical padding within the card.
- **Height**: Auto-responsive, centered content.

## 5. Empty State (No Data)
- **Container**: Centered within the Chart Container.
- **Padding**: `48px 24px` (px-6 py-12).
- **Elements**:
  - **Graphic**: Abstract upward trend line icon (muted color).
  - **Main Text**: "No KPI progress data"
    - **Font Size**: `18px` (Approx.)
    - **Weight**: `500`
  - **Support Text**: "Progress charts will appear here once KPIs are assigned to you"
    - **Color**: Muted text foreground.

## 6. Layout Principles
- **Global Spacing**: Uses `space-y-6` (`24px` vertical gap) between the header, tabs, date indicator, and chart card.
- **Responsive Padding**:
  - **Mobile**: `16px` (p-4)
  - **Medium/Large Screens**: `24px` to `32px` (md:p-6 lg:p-8).