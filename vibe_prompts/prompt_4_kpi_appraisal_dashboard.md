# Prompt Package 4: Individual KPIs & Performance Appraisal (UI Layer - Part 3)

*Copy and paste this prompt into the Vibe Coding portal to build the Employee KPI dashboard, self-evaluation controls, and Manager final score evaluations in the React app:*

```text
Please build/update the Performance Appraisal and KPI dashboard in the React app:

1. Create a "My KPIs" dashboard tab for standard employees:
   - Load and display all "KPI Target" (cr5db_KPITarget) records where "cr5db_EmployeeID" matches currentUserRecord.cr5db_UserId for the current active Evaluation Period.
   - For each target, display the KPI Name (from cr5db_KPICode), Target Value, Weight, and the actual logged achieved value (cr5db_ActualValue).
2. Create a "My Appraisals" tab:
   - Display a list of the employee's "Performance Appraisal" (cr5db_PerformanceAppraisal) records (filtered by cr5db_EmployeeID).
   - Clicking an appraisal opens a detailed view showing the associated Appraisal KPI Details (cr5db_AppraisalKPIDetail).
   - Allow employees to enter or update their self-scores (cr5db_SelfScore) and self-comments for each KPI Target during open evaluation periods.
3. Create a "Team Appraisals" manager review panel:
   - Only visible if the user is a Manager (i.e. has team members reporting to them via the cr5db_ReportsToPositionID chain in cr5db_JobPosition, or is explicitly set as the cr5db_EvaluatorID in an appraisal).
   - Display pending appraisals for their team members.
   - Let managers enter the final score (cr5db_FinalScore) and manager comments.
4. Auto-Calculate Score Aggregations:
   - Provide a button/logic to auto-calculate the Appraisal scores based on weights: Appraisal Final Score = Sum of (KPI Target Achievement Rate * KPI Weight Percentage).
```
