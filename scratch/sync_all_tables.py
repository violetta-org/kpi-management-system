import subprocess
import sys
import os

entities = [
    "cr5db_AppraisalKPIDetail",
    "cr5db_ApprovalDelegation",
    "cr5db_AuditTrailLog",
    "cr5db_Company",
    "cr5db_Department",
    "cr5db_EvaluationPeriod",
    "cr5db_HeadcountRequest",
    "cr5db_JobPosition",
    "cr5db_KPIActualLog",
    "cr5db_KPILibrary",
    "cr5db_KPITarget",
    "cr5db_Objective",
    "cr5db_PerformanceAppraisal",
    "cr5db_PositionCatalog",
    "cr5db_Project",
    "cr5db_ProjectIssue",
    "cr5db_ProjectLabelAssignment",
    "cr5db_ProjectObjectiveAlignment",
    "cr5db_ProjectPhase",
    "cr5db_ProjectRisk",
    "cr5db_ProjectTeam",
    "cr5db_ResourceAllocation",
    "cr5db_SystemLabel",
    "cr5db_SystemNotification",
    "cr5db_SystemParameter",
    "cr5db_SystemPolicyRule",
    "cr5db_Task",
    "cr5db_TaskComment",
    "cr5db_TaskDependency",
    "cr5db_TaskLabelAssignment",
    "cr5db_TimesheetLog",
    "cr5db_User",
    "cr5db_UserProjectRole"
]

org_url = "https://orgcaf78765.crm5.dynamics.com/"
cwd = r"c:\Users\violet\Documents\MQF\Study Materials\Sixth Semester\QLDA\vibepowerapps\code-app"
cli_path = r"node_modules\@microsoft\power-apps-cli\dist\Bin.js"

print("Starting to sync all cr5db_ tables...")

success_count = 0
failed_entities = []

for entity in entities:
    # Convert entity to lowercase as Dataverse logical names are lowercase
    logical_name = entity.lower()
    print(f"\n--- Syncing {logical_name} ---")
    
    cmd = [
        "node",
        cli_path,
        "add-data-source",
        "--api-id", "dataverse",
        "--resource-name", logical_name,
        "--org-url", org_url
    ]
    
    try:
        # Run command synchronously
        result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, check=False)
        print(result.stdout)
        if result.returncode == 0:
            print(f"SUCCESS: {logical_name} synced.")
            success_count += 1
        else:
            print(f"FAILED: {logical_name} returned code {result.returncode}")
            print(f"Error: {result.stderr}")
            failed_entities.append((logical_name, result.stderr))
    except Exception as e:
        print(f"EXCEPTION: Failed to run command for {logical_name}: {e}")
        failed_entities.append((logical_name, str(e)))

print("\n=== SYNC SUMMARY ===")
print(f"Total attempted: {len(entities)}")
print(f"Successfully synced: {success_count}")
print(f"Failed: {len(failed_entities)}")
if failed_entities:
    print("\nFailed list:")
    for ent, err in failed_entities:
        print(f"- {ent}: {err.strip()}")
