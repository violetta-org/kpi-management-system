# Prompt Package 3: Timesheet Logging & Personal Timesheets (UI Layer - Part 2)

*Copy and paste this prompt into the Vibe Coding portal to build the Timesheet entry form, restrict logs, and enable Manager approval controls in the React app:*

```text
Please update the Timesheet Logging feature in the React app:

1. **Fix Critical DatePicker State Propagation Bug:**
   - There is a known issue where the Fluent UI `DatePicker` component allows selecting a date, but the selected value does not propagate to the parent form state, triggering "Please select a date" validation errors on submit.
   - **Fix:** Ensure that the `onSelectDate` handler of the Fluent UI `DatePicker` explicitly propagates the selected `Date` object to the parent component's form state (e.g. using `setValue("dateFieldName", date)` or updating the parent form's state setter). Avoid relying solely on raw text input value changes.
2. When an employee logs time on a task in the Timesheet entry form:
   - Automatically assign the "cr5db_UserID" lookup field in the "Timesheet Log" record to the logged-in user's custom user record ID (currentUserRecord.cr5db_UserId). This should be populated in the background without letting the employee change it.
   - Restrict the task selection dropdown to tasks assigned to the user (cr5db_AssigneeID matches currentUserRecord.cr5db_UserId) or tasks under projects they are team members of.
3. In the Timesheet List/History view:
   - If the system role `currentUserRecord.cr5db_SystemRole` is "Employee", filter the log records so they can only view and edit their own logged timesheets (where cr5db_UserID matches currentUserRecord.cr5db_UserId).
4. Create a "Timesheet Approval" dashboard tab:
   - This tab must only be visible if `currentUserRecord.cr5db_SystemRole` is "ProjectManager", "HRManager", or "Admin".
   - Project Managers should see timesheets submitted for tasks under their projects.
   - Allow managers to mark these timesheets as Approved or Rejected (updating statuscode/statecode).
   - Display summary metrics for managers (Total Hours Worked this week, list of employees who haven't logged hours).

```
