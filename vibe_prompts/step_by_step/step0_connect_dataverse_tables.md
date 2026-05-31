# Step 0: Connect to Existing Dataverse Tables (Run this in Vibe AI Builder)

Please instruct the Vibe AI Builder agent to connect to our existing Dataverse tables instead of creating new draft tables or duplicates:

```text
Please do not create any new draft tables or duplicate tables. We already have the complete database schema provisioned in our Dataverse environment under the "cr5db_" prefix. 

Please connect the entities in the app to our existing Dataverse tables as follows:

1. Connect the "User" entity to our existing custom table "cr5db_User" (display name "User") which contains custom fields like cr5db_SystemRole, cr5db_Email, and cr5db_Name. Do NOT create or use "User_1".
2. Connect "KPI Target" to "cr5db_KPITarget".
3. Connect "Evaluation Period" to "cr5db_EvaluationPeriod".
4. Connect "Performance Appraisal" to "cr5db_PerformanceAppraisal".
5. Connect "Task" to "cr5db_Task".
6. Connect "Timesheet Log" to "cr5db_TimesheetLog".
7. Connect "Project" to "cr5db_Project".
8. Connect "Project Phase" to "cr5db_ProjectPhase".
9. Connect "Resource Allocation" to "cr5db_ResourceAllocation".
10. Connect "Attendance Log" to "cr5db_AttendanceLog".
11. Connect "Attendance Request" to "cr5db_AttendanceRequest".
12. Connect "Department" to "cr5db_Department".
13. Connect "Job Position" to "cr5db_JobPosition".
14. Connect "Headcount Request" to "cr5db_HeadcountRequest".
15. Connect "Objective" to "cr5db_Objective".

Please sync and update the data model to link all these existing tables together using their predefined relationships.
```
