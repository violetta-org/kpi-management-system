# Prompt Package 3: Timesheet Logging & Personal Timesheets (UI Layer - Part 2)

*Copy and paste this prompt into the Vibe Coding portal to build the Timesheet entry form, restrict logs, and enable Manager approval controls in the React app:*

```text
Please update the Timesheet Logging feature in the React app:

1. When an employee logs time on a task in the Timesheet entry form:
   - Automatically assign the "cr5db_UserID" lookup field in the "Timesheet Log" record to the logged-in user's custom user record ID (currentUserRecord.cr5db_UserId). This should be populated in the background without letting the employee change it.
   - Restrict the task selection dropdown to tasks assigned to the user (cr5db_AssigneeID matches currentUserRecord.cr5db_UserId) or tasks under projects they are team members of.
2. In the Timesheet List/History view:
   - Filter the log records so standard employees can only view their own logged timesheets (where cr5db_UserID matches currentUserRecord.cr5db_UserId).
3. Create a "Timesheet Approval" dashboard tab visible only to Project Managers, Department Heads, and HR:
   - Show submitted timesheets for tasks under projects they manage.
   - Allow them to Approve or Reject these timesheets (updating the status reason statuscode/statecode).
   - Display summary stats (Total Hours Worked this week, Total Logged Hours by Employee).
```
