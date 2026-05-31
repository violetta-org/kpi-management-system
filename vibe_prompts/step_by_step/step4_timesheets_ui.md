# Step 4: Timesheets Page (Upload Timesheets Screenshot)

Please implement the **Timesheets** page in the React application:

1. **Logging Hours Form:**
   - Provide a form for logging working hours into the `cr5db_TimesheetLog` table.
   - **Task Selection:** Employees can only select tasks assigned to them (`cr5db_AssigneeID` matches `currentUserRecord.cr5db_UserId`).
   - **Date Picker Selection:** Ensure the Fluent UI DatePicker correctly binds to the form state to avoid validation blocker errors on submit.
   - **Hours & Work Description:** Inputs for numeric hours and description text.

2. **Timesheet Entries List:**
   - Display a list of logged timesheet entries for the current week for the logged-in employee.
   - Show status badges (e.g. "Pending", "Approved", "Rejected").

3. **Manager Approval Queue (Visible to Project Managers, HR, Admin):**
   - Provide an approval tab showing pending timesheets.
   - Project Managers can view and Approve/Reject timesheets logged for projects they manage.
   - Approving updates the status to "Approved", which saves the manager ID and approval timestamp.
