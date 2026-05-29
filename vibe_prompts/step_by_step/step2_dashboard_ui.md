# Step 2: Dashboard View & Attendance Controls (Upload Dashboard Screenshot)

Please implement the **Dashboard** view exactly as shown in the uploaded screenshot:

1. **Dashboard Welcome Banner:**
   - Display a welcome message at the top: "Good evening, [User's Name]!" (e.g. "Good evening, Quân!").
   - Underneath, display: "Here's what's happening with your work this week".

2. **Metrics Row (4 Cards):**
   - **Card 1: Tasks Due Today:** Displays a check icon and count of tasks assigned to the current user where the due date is today.
   - **Card 2: Hours This Week:** Displays a clock icon and total hours logged in `cr5db_TimesheetLog` by this user for the current week (e.g., "0.0h Hours This Week").
   - **Card 3: KPIs On Track:** Displays a target icon and count of active `cr5db_KPITarget` records for this user where the status is on track.
   - **Card 4: Pending Approvals:** Displays a calendar/check-list icon and count of pending tasks/timesheets/requests waiting for this user's approval (only visible to Managers/HR/Admin).

3. **Quick-Link Cards (3 Cards in a Row):**
   - **My Tasks Card:** Shows "My Tasks", a count of total and upcoming tasks, and a clickable link "View Tasks ->" pointing to the "My Tasks" page.
   - **Timesheets Card:** Shows "Timesheets", a summary of entries this week, and a clickable link "Log Time ->" pointing to the "Timesheets" page.
   - **My KPIs Card:** Shows "My KPIs", a summary of targets, and a clickable link "View KPIs ->" pointing to the "My KPIs" page.

4. **Weekly Progress Card:**
   - Display a card showing the current week date range (e.g., "Weekly Progress: May 25 - May 31, 2026").
   - Render a progress bar or graph representing logged hours vs. the weekly target of 40 hours (e.g., "0.0 / 40h").

5. **Attendance Tracking Widget (Integrate into Dashboard):**
   - Query `cr5db_AttendanceLog` for the current user and today's date.
   - **If not clocked in today:** Show a prominent "Clock In" button. Clicking it creates a new record in `cr5db_AttendanceLog` with `cr5db_ClockIn` = current timestamp, `cr5db_Date` = today, and `cr5db_Status` = "Present".
   - **If clocked in but not clocked out:** Show a "Clock Out" button and display their Clock-In time. Clicking it updates the record with `cr5db_ClockOut` = current timestamp and `cr5db_WorkingHours` = difference in hours.
