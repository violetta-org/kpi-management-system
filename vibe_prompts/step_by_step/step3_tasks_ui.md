# Step 3: My Tasks Page (Upload My Tasks Screenshot)

Please implement the **My Tasks** page with Role-Based Access Control (RBAC):

1. **Task Display Board/List:**
   - Display a clean list or board of tasks fetched from the `cr5db_Task` table.
   - For each task, display its name, description, project name, project phase, and due date.
   - Show a warning badge (e.g. red/orange) if the task's Due Date is passed and its status is not Completed.

2. **Role-Based Task Filtering:**
   - Query the global user context (`currentUserRecord`).
   - **For Employee role:** Filter the list to only show tasks where `cr5db_AssigneeID` matches `currentUserRecord.cr5db_UserId`. Hide or disable all "Create Task", "Edit Task", and "Delete Task" buttons.
   - **For Project Manager (ProjectManager) role:** Show tasks under projects they manage (verify by checking if they are assigned as a manager role in `cr5db_UserProjectRole` for the active project). Allow them to create, edit, assign, and delete tasks under their projects.
   - **For HR Manager (HRManager) or Admin roles:** Allow full visibility and editing capabilities for all tasks across all projects.

3. **Task Creation & Allocation (Managers only):**
   - Provide a form to create/edit tasks with the following fields:
     - **Project Dropdown:** Fetch list of projects from `cr5db_Project`.
     - **Project Phase Cascading Dropdown:** Filter the project phases dynamically to only show phases where `cr5db_ProjectID` matches the selected Project. Save the selection to `cr5db_ProjectPhaseID`.
     - **Assignee Dropdown:** Filter to show only employees allocated to the selected project's team (query `cr5db_ResourceAllocation` where the project matches the selected project). Save to `cr5db_AssigneeID`.

4. **Employee Checklist/Sub-tasks:**
   - Employees should be able to create personal sub-tasks or check-list items linked to their assigned tasks. They cannot modify the parent task metadata (due date, name, overall description) set by the supervisor.
