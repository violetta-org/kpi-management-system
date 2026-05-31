# Step 1: Database Sync & App Shell Initialization

Please initialize the application structure and sync the Dataverse tables. We are building the "Quản lý Định biên Nhân sự" (Personnel Allocation & KPI Management) application.

## 1. Database Schema Synchronization
Please sync the React data models to recognize these tables and relationship schemas:
- **cr5db_User**: Has `cr5db_SystemRole` (Text, Max Length 50) storing roles like `Admin`, `HRManager`, `ProjectManager`, or `Employee`. Also has `cr5db_Email` (Text) and `cr5db_Name` (Text).
- **cr5db_AttendanceLog**: Tracks employee attendance. Has lookup to `cr5db_User` (`cr5db_User`), `cr5db_ClockIn` (DateTime), `cr5db_ClockOut` (DateTime), `cr5db_Date` (Date Only), `cr5db_Status` (Text), and `cr5db_WorkingHours` (Decimal).
- **cr5db_AttendanceRequest**: Tracks leave requests.
- **cr5db_Task**: Tasks under projects. Has `cr5db_AssigneeID` (Lookup to `cr5db_User`) and `cr5db_ProjectPhaseID` (Lookup to `cr5db_ProjectPhase`).
- **cr5db_TimesheetLog**: Timesheets logged. Has `cr5db_UserID` (Lookup to `cr5db_User`).
- **cr5db_PerformanceAppraisal**: Performance appraisal. Has lookups to `cr5db_User` (Employee, Evaluator), `cr5db_EvaluationPeriod` (Period).
- **cr5db_KPITarget**: KPI targets. Has lookup to `cr5db_User` (Employee).

## 2. App Shell & Global User Context
- Create a global React Context `CurrentUserContext` and provider `CurrentUserProvider` to resolve the currently logged-in M365 user.
- Retrieve the current user's email using the official `@microsoft/power-apps/app` SDK context call:
  ```typescript
  import { getContext } from '@microsoft/power-apps/app';
  const ctx = await getContext();
  const userEmail = ctx.user.userPrincipalName; // Use this to get the logged-in email
  ```
- Query the connected `User_1` (or `cr5db_User`) table/model where the email matches `userEmail`. Store this database record globally as the current user.
- Wrap the entire root component (`App.tsx` or main router) with `CurrentUserProvider`.
- Build the main App Shell with a left navigation sidebar containing these tabs:
  1. **Dashboard**
  2. **My Tasks**
  3. **Timesheets**
  4. **My KPIs**
- Include a Header displaying the active user's system role (e.g., an "Employee" badge) and a notification bell icon, exactly matching a standard modern SaaS layout.
