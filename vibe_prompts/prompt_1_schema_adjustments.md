# Prompt Package 1: Dataverse Schema Sync (Database Layer)

Good news! We have **already performed all the schema updates locally** in your workspace XML configuration files. This includes:
1. Setting the **Project $\rightarrow$ ProjectObjectiveAlignment** relationship behavior to **Parental (Cascade Delete)** (Pair 10 alignment).
2. Adding lookup fields:
   - `cr5db_Task`: `cr5db_AssigneeID` (User) and `cr5db_ProjectPhaseID` (Project Phase).
   - `cr5db_TimesheetLog`: `cr5db_UserID` (User).
   - `cr5db_PerformanceAppraisal`: `cr5db_EmployeeID` (User), `cr5db_PeriodID` (Evaluation Period), and `cr5db_EvaluatorID` (User).
   - `cr5db_KPITarget`: `cr5db_EmployeeID` (User).

Now, you just need to pack the solution and deploy it to the cloud.

---

## Part A: Deploy Local Schema Changes to Cloud

To sync these changes to your Dynamics 365 environment, follow these steps:

### Option 1: Automate via CLI (Recommended)
Run these commands in your powershell terminal to pack your source folder and import it directly into your environment:
```powershell
# 1. Pack the source XML files back into a Solution ZIP
python automate_alm.py --pack

# 2. Import the Solution ZIP into the cloud (use your Power Platform environment URL)
python automate_alm.py --import-sol --env-url "https://orgcaf78765.crm5.dynamics.com/"
```

### Option 2: Manual Solution Upload
If you prefer not to use CLI import:
1. Run the pack command locally to compile the files:
   ```powershell
   python automate_alm.py --pack
   ```
2. Open [make.powerapps.com](https://make.powerapps.com) in your browser.
3. Select your environment **QLDA** and go to the **Solutions** tab.
4. Click **Import solution** in the top menu, browse and select the generated **`VibeApp.zip`** file in your workspace, and click **Next** $\rightarrow$ **Import**.
5. Once imported, click **Publish all customizations** to make the changes live.

---

## Part B: Vibe Code App Sync Prompt

*After the import is finished and published, copy and paste this prompt into the Vibe Coding portal to register these new columns and relationships within the React app coding environment:*

```text
I have successfully packed and imported the updated solution schemas into our Dataverse environment. Please perform a sync and update our React data models to recognize these newly added lookup fields and relationship properties:

1. Validate the parental cascade delete relationship between "Project" and "ProjectObjectiveAlignment".
2. Sync the new lookup columns:
   - "cr5db_Task" now has "cr5db_AssigneeID" (references cr5db_User) and "cr5db_ProjectPhaseID" (references cr5db_ProjectPhase).
   - "cr5db_TimesheetLog" now has "cr5db_UserID" (references cr5db_User).
   - "cr5db_PerformanceAppraisal" now has "cr5db_EmployeeID" (references cr5db_User), "cr5db_PeriodID" (references cr5db_EvaluationPeriod), and "cr5db_EvaluatorID" (references cr5db_User).
   - "cr5db_KPITarget" now has "cr5db_EmployeeID" (references cr5db_User).
3. Ensure that these tables and their new columns are fully recognized and ready to be used in our React CRUD screens.
```
