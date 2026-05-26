# User Features Documentation

This document provides a comprehensive guide to all user features in the HR Headcount Management application, covering the complete UI/UX experience for each role.

---

## Table of Contents

1. [Role Overview](#role-overview)
2. [Dashboard (Home)](#dashboard-home)
3. [Task Management](#task-management)
4. [Timesheets](#timesheets)
5. [KPIs & Objectives](#kpis--objectives)
6. [Performance & Appraisals](#performance--appraisals)
7. [Companies & Departments](#companies--departments)
8. [Position Catalog](#position-catalog)
9. [Headcount Management](#headcount-management)
10. [Approval Requests](#approval-requests)
11. [Resource Planning](#resource-planning)
12. [Employee Directory](#employee-directory)
13. [Role Management](#role-management)

---

## Role Overview

The application supports four distinct roles with different access levels:

| Role | Access Level | Description |
|------|--------------|-------------|
| **Admin** | Full Access | Complete system control including all settings, roles, data, and administrative functions |
| **HR Manager** | HR Operations | Manages employees, positions, headcount, KPIs, performance reviews, and role assignments |
| **Project Manager** | Team Management | Views team performance, approves timesheets, manages tasks and resources for their projects |
| **Employee** | Basic Access | Views and manages own tasks, timesheets, KPIs, and can access the employee directory |

### Role Derivation

Roles are assigned through two mechanisms:
1. **Position-Based (Automatic)**: Derived from job position titles (e.g., "HR Director" automatically grants HR Manager role)
2. **Manual Assignment**: Explicitly assigned by admins or HR managers for elevated permissions

---

## Dashboard (Home)

The dashboard provides a personalized overview based on user role.

### Employee Dashboard Features

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **Personalized Greeting** | Time-based greeting with user's name | Header with "Good morning/afternoon/evening, [Name]!" |
| **Overdue Tasks Alert** | Banner showing tasks past their due date | Red alert banner with task list, links to Task Management |
| **Tasks Due Today** | Count of tasks due on current date | Stat card with icon and count |
| **Hours This Week** | Total hours logged in current work week | Stat card showing hours (e.g., "23.5h") |
| **Overdue Task Count** | Number of overdue tasks (if any) | Red-highlighted stat card with warning icon |
| **KPIs On Track** | Count of KPIs meeting ≥80% target | Stat card (shown when no overdue tasks) |
| **Pending Approvals** | Timesheets awaiting manager approval | Amber stat card with count |
| **Quick Actions** | Navigation cards to key features | Cards for My Tasks, Timesheets, My KPIs with "View" buttons |
| **Weekly Progress** | Visual summary of the week | Progress bar for hours, badges for tasks/entries/KPIs |

### Admin/HR Manager Dashboard Features

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **Headcount Overview Header** | Organization-wide headcount summary | Page title with description |
| **Total Quota** | Sum of all job position quotas | Stat card with trending up icon |
| **Current Headcount** | Total actual employees | Stat card with users icon |
| **Over Quota** | Positions exceeding quota | Red stat card with warning |
| **Under Quota** | Positions below quota | Stat card with trending down icon |
| **Pending Approval** | Headcount requests awaiting approval | Amber stat card with clipboard icon |
| **Headcount by Company Chart** | Bar chart comparing quota vs actual | Interactive chart with tooltips, legend |
| **Summary Cards** | Quick counts for companies, departments, positions | Three cards with totals |

---

## Task Management

**Access**: All roles (with role-based filtering)

### Role-Based Access Control (RBAC)

| Role | Visible Tasks | Edit Rights |
|------|---------------|-------------|
| Admin | All tasks across all projects | Full edit/delete on all tasks |
| HR Manager | All tasks across all projects | Full edit/delete on all tasks |
| Project Manager | Tasks in managed projects | Edit tasks in managed projects |
| Employee | Only assigned or self-created tasks | Edit own pending tasks only |

### Features

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **Task List View** | Grid of task cards with key info | Responsive grid (2-3 columns) |
| **Create Task** | Add new task with details | "New Task" button → dialog form |
| **Edit Task** | Modify existing task | Edit button on card hover → dialog |
| **Delete Task** | Remove task (with confirmation) | Delete button → confirmation dialog |
| **Search** | Filter tasks by name or description | Search input with icon |
| **Project Filter** | Filter tasks by project | Dropdown selector |
| **Overdue Indicator** | Visual warning for past-due tasks | Red border + banner on card |
| **Assignee Display** | Shows assigned user with avatar | User info section with email |
| **Task Ownership** | Links tasks to assignees and creators | Task ownership table integration |
| **Linked Objective** | Shows parent objective if linked | Border section with objective name |
| **Parent Task** | Shows parent task for subtasks | Border section with parent name |
| **Due Date** | Task deadline with formatted date | Calendar icon + formatted date |
| **Role Badge** | Shows current user's role | Badge next to welcome message |
| **RBAC Banners** | Info about visible scope | Colored banners explaining access |

### Task Form Fields

- Task Name (required)
- Description (optional)
- Due Date (date picker)
- Linked Objective (dropdown)
- Parent Task (dropdown for subtasks)
- Assignee (user selection)

---

## Timesheets

**Access**: All roles

### My Timesheets Tab

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **Log Time** | Create new timesheet entry | "Log Time" button → entry dialog |
| **Edit Entry** | Modify pending entries | Edit icon on table row (pending only*) |
| **Delete Entry** | Remove timesheet entry | Delete icon → confirmation |
| **Weekly Summary Cards** | This week's totals | 4 cards: Hours, Pending, Approved, Avg Daily |
| **Entry Table** | List of time entries | Table with Date, Task, Hours, Status, Actions |
| **Status Badges** | Visual status indicators | Green (Approved), Yellow (Pending), Red (Rejected) |
| **Audit Info Tooltip** | Approval details on hover | Shows approver name, date, rejection reason |

*Managers and Admins can edit any timesheet regardless of status

### Approvals Tab (Managers Only)

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **Team Hours This Week** | Total hours logged by team | Summary stat card |
| **Pending Approvals Count** | Number awaiting review | Amber stat card with count |
| **Users Without Logs** | Team members who haven't logged | List of up to 5 users |
| **Pending Warning** | Alert when approvals waiting | Alert banner with count |
| **Status Filter** | Filter by approval status | Dropdown: All, Pending, Approved, Rejected |
| **Approval Table** | Team timesheet entries | Table with employee info, actions |
| **Approve Button** | Approve entry | Green checkmark button |
| **Reject Button** | Reject entry (requires reason) | Red X button → reason dialog |
| **Rejection Reason** | Required comment for rejections | Textarea in confirmation dialog |

### Timesheet Entry Form Fields

- Date (date picker)
- Task (dropdown of available tasks)
- Hours Worked (numeric input)
- Notes (optional)

---

## KPIs & Objectives

**Access**: All roles (management features for Admins/HR Managers/Project Managers)

### Overview

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **Stats Summary** | KPI performance overview | 4 cards: Total, On Track, At Risk, Behind |
| **KPIs by Objective** | Grouped KPI display | Collapsible cards per objective |
| **Overall Achievement** | Weighted average per objective | Percentage + progress bar in header |
| **Individual KPI Details** | Target vs actual comparison | Expandable KPI rows with metrics |
| **Progress Indicator** | Visual achievement display | Color-coded percentage + progress bar |

### Manager Features

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **New KPI Target** | Create new KPI target | "New KPI Target" button → dialog |
| **Manage Objectives** | Create/edit objectives | "Manage Objectives" button → sheet |
| **Edit KPI** | Modify KPI target | Dropdown menu → Edit option |
| **Delete KPI** | Remove KPI target | Dropdown menu → Delete → confirmation |
| **Log Progress** | Record actual values | Dropdown menu → Log Progress → dialog |

### Employee View (Progress Tab)

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **Progress Charts** | Visual KPI progress over time | Line charts per KPI |
| **Time Range Selector** | Filter by period | Buttons: Week, Month, Quarter |
| **Custom Date Range** | Pick specific dates | Calendar date range picker |
| **Date Display** | Shows selected range | Text showing from/to dates |

### KPI Target Form Fields

- Parent Objective (required dropdown)
- KPI Template (required dropdown from library)
- Target Value (numeric)
- Weight Percentage (numeric, for scoring)
- Evaluation Period (dropdown)

---

## Performance & Appraisals

**Access**: All roles (full admin features for Admins/HR Managers)

### My KPIs Tab

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **Active Period Banner** | Shows current evaluation period | Info alert with period name |
| **Period Filter** | Filter by evaluation period | Dropdown selector |
| **Performance Stats** | KPI achievement summary | 4 cards: Total, On Track, At Risk, Behind |
| **Objective Groups** | KPIs grouped by objective | Collapsible cards |
| **Update Actual Value** | Edit your KPI actuals | Pencil button → dialog with target info |
| **Achievement Calculation** | Auto-calculates rate | Shows percentage based on actual/target |

### My Appraisals Tab

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **Self-Assessment Info** | Guidance for self-scoring | Info alert banner |
| **Appraisal Cards** | Your performance reviews | Cards with scores and status |
| **Self Score** | Your self-assessment score | Large number display |
| **Final Score** | Manager's assessment | Large number or "Pending" |
| **Variance** | Difference between scores | Calculated difference |
| **Edit Self-Score** | Update your assessment | Button → dialog with score input |
| **View KPIs** | See linked KPI details | Button → dialog with KPI table |

### Team Appraisals Tab (Managers)

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **Summary Stats** | Team appraisal overview | 3 cards: Pending, Completed, Total |
| **Search** | Find team members | Search input |
| **Pending Reviews List** | Appraisals awaiting review | List with Review button |
| **Review Dialog** | Enter final score | Dialog with employee self-score, final score input |
| **Auto-Calculate** | Calculate score from KPIs | Button that computes weighted average |
| **Manager Comments** | Add review notes | Textarea in review dialog |

### Administration Tab (Admins/HR)

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **Period Management** | Create evaluation periods | "New Period" button → dialog |
| **Period List** | Active/past periods | Table with dates, status |
| **Bulk Create KPIs** | Mass KPI creation | Template-based bulk operations |
| **Objective Templates** | Standard objective library | Manageable objective templates |

---

## Companies & Departments

**Access**: Admin, HR Manager only

### Companies Panel

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **Company List** | All registered companies | Scrollable list with cards |
| **Add Company** | Create new company | "Add" button → dialog |
| **Edit Company** | Modify company details | Edit icon on card |
| **Delete Company** | Remove company | Delete icon → confirmation |
| **Search** | Filter companies | Search input |
| **Department Count** | Shows departments per company | Text showing count |
| **Selection Highlight** | Visual selection state | Border highlight on selected |

### Departments Panel

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **Department List** | Departments for selected company | Scrollable list with cards |
| **Add Department** | Create new department | "Add" button (requires company selected) |
| **Edit Department** | Modify department details | Edit icon on card |
| **Delete Department** | Remove department | Delete icon → confirmation |
| **Search** | Filter departments | Search input |
| **Company Badge** | Shows parent company | Badge in header |
| **Empty State** | Prompt to select company | Message when no company selected |

### Form Fields

**Company:**
- Company Code (required)
- Company Name (required)

**Department:**
- Department Code (required)
- Department Name (required)
- Company (auto-set from selection)

---

## Position Catalog

**Access**: Admin, HR Manager only

### Features

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **Position Table** | Standard job titles list | Table with code, title, actions |
| **Add Position** | Create new position type | "Add New" button → dialog |
| **Edit Position** | Modify position details | Edit icon |
| **Delete Position** | Remove position | Delete icon → confirmation |
| **Search** | Filter positions | Search input |
| **Position Count** | Total positions badge | Badge next to title |

### Form Fields

- Position Code (required, e.g., "MGR")
- Position Title (required, e.g., "Manager")

---

## Headcount Management

**Access**: Admin, HR Manager only

### Features

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **Job Positions Table** | All positions with quotas | Full-width table |
| **Add Position** | Create new job position | "Add New" button → dialog |
| **Edit Position** | Modify position details | Edit icon |
| **Delete Position** | Remove position | Delete icon → confirmation |
| **Search** | Filter positions | Search input |
| **Company Filter** | Filter by company | Dropdown selector |
| **Department Filter** | Filter by department | Dropdown selector (filtered by company) |
| **Position Count** | Total positions badge | Badge next to title |
| **Quota Status** | Visual over/under indication | Color-coded actual count with icons |
| **Reporting Line** | Shows "Reports To" position | Text with branch icon |

### Table Columns

- Position Name (with company name)
- Department
- Title (from Position Catalog)
- Reports To
- Quota (target headcount)
- Actual (current headcount with status)
- Actions

### Form Fields

- Position Name (required)
- Department (required dropdown)
- Position Title (from catalog)
- Reports To (for org hierarchy)
- Headcount Quota (required number)
- Current Headcount (number)

### Visual Indicators

| Status | Color | Icon |
|--------|-------|------|
| Over Quota | Red | Warning triangle |
| Under Quota | Amber | None |
| At Quota | Green | Checkmark |

---

## Approval Requests

**Access**: Admin, HR Manager, Project Manager (limited)

### Features

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **Stats Cards** | Request summary | 3 cards: Pending, Approved, Rejected |
| **Request Table** | All headcount requests | Full-width table |
| **Create Request** | Submit new request | "New Request" button → dialog |
| **View Details** | See full request info | Eye icon → detail dialog |
| **Approve Request** | Approve pending request | Checkmark button → confirmation |
| **Reject Request** | Reject pending request | X button → confirmation |
| **Search** | Filter requests | Search input |
| **Type Filter** | Filter by request type | Dropdown selector |
| **Status Filter** | Filter by status | Dropdown selector |

### Request Types

| Type | Description | Icon |
|------|-------------|------|
| Increase | Add headcount | Arrow Up Right |
| Decrease | Reduce headcount | Arrow Down Right |
| New Position | Create new role | User Plus |

### Table Columns

- Request Name
- Type (with icon)
- Department
- Quantity (+/- badge)
- Approver
- Created Date
- Status (badge)
- Actions

### Form Fields

- Request Name (required)
- Request Type (required dropdown)
- Department (required dropdown)
- Related Position (optional)
- Position Catalog (for new positions)
- Requested Quantity (required number)
- Approver (optional, auto-routes if empty)
- Reason (required textarea)

---

## Resource Planning

**Access**: Admin, HR Manager, Project Manager

### Features

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **Stats Overview** | Allocation summary | 4 cards: Total Allocations, Avg Allocation, Projects, Resources |
| **Project Filter** | Filter by project | Dropdown selector |
| **Department Filter** | Filter by department | Dropdown selector |
| **Project Groups** | Allocations grouped by project | Collapsible project cards |
| **Project Header** | Project name with allocation stats | Card header with project info |
| **Allocation Cards** | Individual user allocations | Clickable cards with user info |
| **Allocation Details** | Full allocation information | Click card → detail dialog |
| **Progress Bars** | Visual allocation percentage | Progress bars showing % allocated |
| **Team Badge** | Shows team assignment | Badge with team name |

### Allocation Detail Dialog

- User Avatar & Name
- Allocation Percentage (with progress bar)
- Project Name
- Team Name
- Position
- Department

---

## Employee Directory

**Access**: Admin, HR Manager, Project Manager only

**Note**: Employees are redirected to dashboard when accessing this page.

### Features

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **Stats Overview** | Employee counts | 3 cards: Total, Active, Assigned Positions |
| **Search** | Filter by name, email, position | Search input |
| **Company Filter** | Filter by company | Dropdown selector |
| **Department Filter** | Filter by department (filtered by company) | Dropdown selector |
| **Status Filter** | Filter active/inactive | Dropdown selector |
| **Employee Grid** | Responsive card layout | Grid of employee cards |
| **Employee Card** | Summary info | Avatar, name, position, email, department |
| **Status Indicator** | Active/inactive icon | Green check or gray X |
| **Detail Dialog** | Full employee information | Click card → detail dialog |

### Employee Detail Dialog

- Avatar (initials)
- Full Name
- Status Badge
- Email
- Position
- Department
- Company
- Reports To (supervisor name)

---

## Role Management

**Access**: Admin, HR Manager only

### Features

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **Access Gate** | Blocks unauthorized users | Error message for non-admins |
| **Hybrid Role Info** | Explains role system | Info banner explaining automatic vs manual roles |
| **Role Overview Cards** | Summary of each role | 4 cards showing role counts |
| **Search** | Filter users | Search input |
| **Role Filter** | Filter by assigned role | Dropdown selector |
| **Users Table** | All users with role info | Full-width table |
| **Position Role** | Auto-derived role from position | Badge marked "(Auto)" |
| **Assigned Roles** | Manually assigned roles | Color-coded badges |
| **Assign Role** | Add role to user | Button → assignment dialog |
| **Revoke Role** | Remove role assignment | Delete button → confirmation |

### Users & Assignments Tab

| Column | Description |
|--------|-------------|
| User | Avatar, name, email |
| Job Position | Position title |
| Position-Derived Role | Auto-calculated role |
| Assigned Roles | Manual role assignments |
| Actions | Assign/Revoke buttons |

### Assignment History Tab

| Feature | Description | UI Elements |
|---------|-------------|-------------|
| **History Table** | All role assignments | Table with full audit info |
| **Status Toggle** | Activate/deactivate | Toggle button |
| **Assignment Notes** | Reason for assignment | Displayed in table |
| **Assigned By** | Who made the assignment | User name |
| **Date** | When assigned | Formatted date |

### Role Assignment Dialog

- User (pre-selected)
- Role (required dropdown)
- Notes (optional textarea)

### Role Colors & Icons

| Role | Color | Icon |
|------|-------|------|
| Admin | Red (destructive) | Shield Alert |
| HR Manager | Primary | Shield Check |
| Project Manager | Accent | Shield |
| Employee | Secondary | Users |

---

## Common UI Patterns

### Navigation

- **Sidebar Menu**: Persistent left navigation (visible on all pages)
- **Hamburger Menu**: Collapses sidebar on mobile
- **Breadcrumbs**: Not used (flat navigation structure)

### Data Entry

- **Dialog Forms**: Modal dialogs for create/edit operations
- **Inline Edit**: Not used (all edits via dialogs)
- **Confirmation Dialogs**: Required for destructive actions (delete, revoke)

### Feedback

- **Toast Notifications**: Success/error messages (top-right, auto-dismiss)
- **Loading States**: Skeleton placeholders and spinners
- **Empty States**: Illustrated messages when no data
- **Error Handling**: Graceful error messages with retry options

### Visual Design

- **Cards**: Primary container for grouped information
- **Tables**: Used for list views with many columns
- **Badges**: Status indicators, counts, role labels
- **Progress Bars**: Visual completion/allocation indicators
- **Color Coding**: Consistent semantic colors (green=success, red=error, amber=warning)
- **Icons**: Lucide icons throughout for consistency
- **Animations**: Subtle entrance animations using Motion library

### Responsive Design

- **Mobile**: Single column layouts, collapsible navigation
- **Tablet**: 2-column grids, condensed tables
- **Desktop**: Full layouts with sidebar visible

---

## Accessibility Features

- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management in dialogs
- Screen reader-friendly status announcements
- Color contrast compliance (WCAG AA)
- Loading states marked with aria-hidden
