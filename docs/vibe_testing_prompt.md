# Vibe Coding Portal Prompt: TDD Unit Testing (Employee Features)

*Copy and paste this prompt into the Vibe Coding portal chat input to build the unit test suite for employee-facing views in isolation.*

***

Please implement a unit test suite using **Vitest/Jest** and **React Testing Library** for the Employee-facing views. Focus on testing individual components/views in isolation before verifying inter-role interactions.

Write tests for the following components:

### 1. Employee Dashboard Test Suite (`EmployeeDashboard.test.tsx`)
*   **Initial State:** Render the dashboard and verify that the greeting shows the active M365 user name and email.
*   **Clock-In Toggle:**
    *   Mock the scenario where there is no attendance log for today. Verify that the "Clock In" button is displayed.
    *   Simulate clicking "Clock In", assert that a POST request payload is sent to create a `cr5db_AttendanceLog` with current date/time, and verify the UI updates to show the "Clock Out" button.
    *   Mock a clocked-in scenario, click "Clock Out", and verify the status updates and working hours calculation is displayed.
*   **Metrics:** Check that summary dashboard tiles (e.g. Completed Tasks, Logged Hours this week) calculate and display matching values from the mock data.

### 2. My Tasks View Test Suite (`MyTasks.test.tsx`)
*   **Scope Filtering:** Mock the current user as a standard employee. Verify that the task board/list only renders tasks where `cr5db_AssigneeID` matches their custom user ID. Ensure other users' tasks are not rendered.
*   **Creation RBAC Restriction:** Verify that the "New Task" button or task creation form is disabled or hidden for standard employees.
*   **Visual Warning Cue:** Verify that tasks with past due dates (`cr5db_DueDate`) that are not in a "Completed" status render a visual warning badge or overdue warning text.

### 3. Timesheet Logging Test Suite (`TimesheetLog.test.tsx`)
*   **Task Validation:** Verify that the task selection dropdown in the timesheet logging form is restricted to tasks assigned to the current employee.
*   **Self-Assignment:** Simulate submitting a timesheet entry and assert that the `cr5db_UserID` lookup field is automatically assigned to the current employee's ID in the background.
*   **Filtering:** Verify that standard employees can only view their own logged timesheets in the history list (where `cr5db_UserID` matches their user ID).

### 4. My KPIs & Self-Appraisal Test Suite (`MyKPIs.test.tsx`)
*   **Active Period Filter:** Verify that the KPI board only loads and displays KPI Target (`cr5db_KPITarget`) records matching the active Evaluation Period ID.
*   **Achievement Calculation:** Assert that the Achievement Rate is calculated correctly on screen: `Achievement Rate = (Actual Value / Target Value)`.
*   **Self-Evaluation Input:** Verify that employees can type and submit self-evaluation scores (`cr5db_SelfScore`) and self-comments for open evaluation periods, and that they cannot edit them for closed periods.
