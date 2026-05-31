# Step 5: My KPIs & Performance Appraisals Page (Upload My KPIs Screenshot)

Please implement the **My KPIs** and performance appraisals module:

1. **My KPIs Tab:**
   - Display the list of active KPI Targets (`cr5db_KPITarget`) assigned to the current employee for the active evaluation period.
   - For each target, display the KPI code, description, target value, and current actual value.
   - **Auto-calculated Achievement Rate:** Dynamically compute and display the achievement rate as:
     `Achievement Rate = (Actual Achieved Value / Target Value)`
   - Show progress bars mapping to the target percentage.

2. **Self-Appraisal Form:**
   - Allow employees to submit self-evaluation scores (`cr5db_SelfScore`) and self-comments for the active evaluation period.
   - Check if an evaluation period (`cr5db_EvaluationPeriod`) is locked. If locked, disable self-evaluations.

3. **Performance Appraisals Manager Dashboard (Managers, HR, Admin only):**
   - Provide a dashboard showing appraisal records (`cr5db_PerformanceAppraisal`) for their team members.
   - Allow managers to input a final score (`cr5db_FinalScore`) and manager comments.
   - **Weighted Appraisal Calculation:** Automatically calculate the final consolidated score:
     `Final Score = Sum of (Achievement Rate * Weight Percentage)` for all KPIs assigned to that employee.
