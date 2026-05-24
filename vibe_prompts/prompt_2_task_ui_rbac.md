# Prompt Package 2: Task Management & Filtering (UI Layer - Part 1)

*Copy and paste this prompt into the Vibe Coding portal to build the Task Assignee UI, Phase Cascading Dropdowns, and role-based filtering logic in the React app:*

```text
Please modify the Task Management screen in the React app:

1. Map the active logged-in Microsoft 365 user to our custom "User" (cr5db_User) table. Run a query matching Session.ActiveUser.Email or User().Email to the cr5db_Email field in the User table. Store this mapped custom user record in a global state variable (e.g., currentUserRecord).
2. Update the Task creation and editing forms:
   - Add a "Project" dropdown (fetching from cr5db_Project).
   - Add a "Project Phase" dropdown. Make this a cascading dropdown that is filtered dynamically to only show phases where the ProjectID matches the selected Project.
   - When a task is saved, save the selected Project Phase ID to "cr5db_ProjectPhaseID".
   - Add an "Assignee" dropdown. Filter this dropdown to list users allocated to the selected project's team (query cr5db_ResourceAllocation where ProjectTeam.ProjectID matches the selected Project). Save the selection to "cr5db_AssigneeID".
3. Implement RBAC Task Filtering on the dashboard:
   - Check the global `currentUserRecord.cr5db_SystemRole` value to determine their access privileges.
   - If the system role is "Employee", filter the Task board/list to only show tasks where "cr5db_AssigneeID" matches their currentUserRecord.cr5db_UserId. They cannot edit other users' tasks.
   - If the system role is "ProjectManager", show all tasks belonging to projects they manage (verify by checking if they are assigned as a manager role in cr5db_UserProjectRole for the active project). They can edit, assign, and delete tasks under their projects.
   - If the system role is "HRManager" or "Admin", they can view and edit all tasks across all projects.
4. UI Enhancements:
   - On the task board/list items, display the Assigned Employee's name and email clearly.
   - Show a warning banner if a task's Due Date is passed and its state is not Completed.
```
