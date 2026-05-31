# Vibe Coding Portal Prompt: Feature Implementation (Attendance, Tasks, Timesheets & KPIs)

*Copy and paste this entire prompt package into the Vibe Coding portal chat input to build the features in the React TypeScript application.*

***

## 1. Solution Schema Synchronization
We are implementing the following custom tables using the standard **`cr5db_`** prefix. Please synchronize and update the React data models to recognize these tables:

*   **Attendance Log** (`cr5db_AttendanceLog`)
    *   `cr5db_AttendanceLogId` (Primary Key)
    *   `cr5db_AttendanceLogName` (Text)
    *   `cr5db_ClockIn` (Date and Time)
    *   `cr5db_ClockOut` (Date and Time)
    *   `cr5db_Date` (Date Only)
    *   `cr5db_Status` (Choice/Picklist)
    *   `cr5db_User` (Lookup to `cr5db_User`)
    *   `cr5db_WorkingHours` (Decimal)
*   **Attendance Request** (`cr5db_AttendanceRequest`)
    *   `cr5db_AttendanceRequestId` (Primary Key)
    *   `cr5db_RequestName` (Text)
    *   `cr5db_RequesterUserID` (Text)
    *   `cr5db_RequestType` (Text)
    *   `cr5db_StartDate` (Date and Time)
    *   `cr5db_EndDate` (Date and Time)
    *   `cr5db_Reason` (Text)
    *   `cr5db_Status` (Text)
    *   `cr5db_ApprovedByUserID` (Text)
    *   `cr5db_ApprovedAt` (Date and Time)
    *   `cr5db_RejectionReason` (Text)
*   **Task Metadata** (`cr5db_TaskMetadata`)
    *   `cr5db_TaskMetadataId` (Primary Key)
    *   `cr5db_MetadataName` (Text)
    *   `cr5db_TaskID` (Text)
    *   `cr5db_TaskType` (Text)
*   **Task Permission** (`cr5db_TaskPermission`)
    *   `cr5db_TaskPermissionId` (Primary Key)
    *   `cr5db_PermissionName` (Text)
    *   `cr5db_TaskID` (Text)
    *   `cr5db_UserID` (Text)
    *   `cr5db_PermissionType` (Text)
    *   `cr5db_GrantedByUserID` (Text)
    *   `cr5db_GrantedAt` (Date and Time)

Please ensure the React CRUD interfaces map to these physical entities and prefix naming conventions.

***

## 2. Feature Workflows

### Mapped User Context & Root Provider
1. Resolve the logged-in Microsoft 365 user by matching `User().Email` or `Session.ActiveUser.Email` to the `cr5db_Email` field in the custom `cr5db_User` table.
2. Store this mapped user record in a React context called `CurrentUserContext` and expose it via the hook `useCurrentUserContext` and provider `CurrentUserProvider`.
3. **CRITICAL FIX:** Ensure that the root component of the app (e.g. `App.tsx` or the main layout component that wraps your routes and views) is wrapped inside the `<CurrentUserProvider>...</CurrentUserProvider>` component, so that child views (like the Dashboard, Tasks, or Timesheets views) can safely use the `useCurrentUserContext` hook without throwing errors.

### Feature A: Attendance Tracking
1.  **Dashboard Clock-In/Clock-Out Controls:**
    *   In the Employee Dashboard, display an interactive card for attendance status.
    *   If the user has not clocked in today (no `cr5db_AttendanceLog` record where `cr5db_User` matches `currentUserRecord.cr5db_UserId` and `cr5db_Date` matches the current date), show a **"Clock In"** button.
    *   Clicking "Clock In" creates a new `cr5db_AttendanceLog` record:
        *   `cr5db_ClockIn` = current timestamp.
        *   `cr5db_Date` = current date.
        *   `cr5db_User` = `currentUserRecord.cr5db_UserId`.
        *   `cr5db_Status` = "Present".
    *   If the user is clocked in but has not clocked out, show a **"Clock Out"** button and display their Clock-In time.
    *   Clicking "Clock Out" updates the record:
        *   `cr5db_ClockOut` = current timestamp.
        *   `cr5db_WorkingHours` = difference in hours between Clock-In and Clock-Out.
2.  **Leave and Attendance Requests:**
    *   Provide an "Attendance Requests" page where employees can submit requests (e.g. Leave, Work from Home, Attendance Correction) using the `cr5db_AttendanceRequest` table.
    *   Supervisors (Admin, HRManager, ProjectManager) should see a pending requests tab to Approve/Reject these requests, which writes their User ID and timestamp to `cr5db_ApprovedByUserID` and `cr5db_ApprovedAt`.

### Feature B: Task Management RBAC (Top-Down Model)
1.  **Task Creation Permissions:**
    *   Only users with `currentUserRecord.cr5db_SystemRole` set to `Admin`, `HRManager`, or `ProjectManager` can create, assign, or delete project tasks (`cr5db_Task`).
    *   For standard `Employee` users, the "New Task" buttons must be hidden or disabled.
2.  **Personal Checklists / Sub-tasks:**
    *   Employees can create personal sub-tasks or check-list items linked to their assigned tasks. They cannot modify the parent task metadata (due date, name, overall description) set by the supervisor.
3.  **Cascading Dropdowns & Allocation Constraints:**
    *   In the Task creation form (visible to managers), the **Project Phase** dropdown must dynamically filter to show only phases under the selected Project.
    *   The **Assignee** dropdown must only show employees allocated to the project team (cross-referencing `cr5db_ResourceAllocation` where the project matches the selected project).

### Feature C: Timesheet Validation
1.  **Date Picker Bindings:**
    *   Ensure that Fluent UI DatePicker selections correctly propagate to form state to avoid validation blocker errors on submit.
2.  **Submission Scope Limits:**
    *   Employees can only log timesheets (`cr5db_TimesheetLog`) against tasks assigned to them (`cr5db_AssigneeID` matches `currentUserRecord.cr5db_UserId`).
3.  **Approval Queue:**
    *   Project Managers see pending timesheets for tasks under projects they manage and can Approve/Reject them.

### Feature D: KPI Achievements & Performance Appraisals
1.  **My KPIs tab:**
    *   Display individual KPI Targets (`cr5db_KPITarget`) for the active period.
    *   Auto-calculate achievement rate: `Achievement Rate = (Actual Achieved Value / Target Value)`.
2.  **Appraisals Form:**
    *   Employees submit self-scores (`cr5db_SelfScore`) for open evaluation periods.
    *   Managers submit final scores (`cr5db_FinalScore`) and auto-aggregate: `Final Score = Sum of (Achievement Rate * Weight Percentage)`.
