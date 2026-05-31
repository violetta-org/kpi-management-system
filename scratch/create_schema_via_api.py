"""
Dataverse Web API Schema Creator
=================================
Creates lookup columns, text columns, and relationships directly via the
Dataverse Web API, bypassing the fragile pac solution XML import process.

Usage:
    python scratch/create_schema_via_api.py

Prerequisites:
    - pip install msal requests
    - Active pac auth profile with access to the QLDA environment
"""

import json
import subprocess
import sys
import time
import requests

# ─── Configuration ───────────────────────────────────────────────────────────
ENV_URL = "https://orgcaf78765.crm5.dynamics.com"
API_URL = f"{ENV_URL}/api/data/v9.2"
PUBLISHER_PREFIX = "cr5db"
SOLUTION_NAME = "VibeApp"

def get_access_token():
    """Extract a Dataverse access token using MSAL device code flow."""
    print("🔑 Initiating MSAL authentication flow...", flush=True)
    
    # Try to load msal, install if missing
    try:
        from msal import PublicClientApplication
    except ImportError:
        print("Installing msal package...", flush=True)
        subprocess.run([sys.executable, "-m", "pip", "install", "msal", "requests"], shell=True)
        from msal import PublicClientApplication

    # Standard Power Platform first-party app (Microsoft Power Platform CLI)
    CLIENT_ID = "51f81489-12ee-4a9e-aaae-a2591f45987d"
    AUTHORITY = "https://login.microsoftonline.com/organizations"
    SCOPES = [f"{ENV_URL}/.default"]

    app = PublicClientApplication(CLIENT_ID, authority=AUTHORITY)

    # Try to get cached token first
    accounts = app.get_accounts()
    if accounts:
        result = app.acquire_token_silent(SCOPES, account=accounts[0])
        if result and "access_token" in result:
            print("✅ Using cached token.", flush=True)
            return result["access_token"]

    # Device code flow
    print("Requesting device code from Microsoft identity service...", flush=True)
    flow = app.initiate_device_flow(scopes=SCOPES)
    if "user_code" not in flow:
        print(f"❌ Failed to create device flow: {flow}", flush=True)
        sys.exit(1)

    print("\n" + "="*80, flush=True)
    print("  🌐 ACTION REQUIRED: Open your web browser and navigate to:", flush=True)
    print(f"     {flow['verification_uri']}", flush=True)
    print("\n  📋 ENTER THIS CODE WHEN PROMPTED:", flush=True)
    print(f"     {flow['user_code']}", flush=True)
    print("="*80 + "\n", flush=True)
    print("Waiting for authentication...", flush=True)

    result = app.acquire_token_by_device_flow(flow)
    if "access_token" not in result:
        print(f"❌ Authentication failed: {result.get('error_description', 'Unknown error')}", flush=True)
        sys.exit(1)

    print("✅ Authenticated successfully!", flush=True)
    return result["access_token"]



# ─── API Helpers ─────────────────────────────────────────────────────────────
def get_headers(token):
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0",
        "Accept": "application/json",
        "MSCRM.SolutionName": SOLUTION_NAME
    }

def get_entity_metadata_id(token, logical_name):
    """Get the MetadataId for an entity by its logical name."""
    url = f"{API_URL}/EntityDefinitions(LogicalName='{logical_name}')?$select=MetadataId,LogicalName,SchemaName"
    r = requests.get(url, headers=get_headers(token))
    if r.status_code == 200:
        data = r.json()
        return data["MetadataId"]
    else:
        print(f"  ⚠️ Could not find entity '{logical_name}': {r.status_code} - {r.text[:300]}")
        return None

def check_attribute_exists(token, entity_logical, attr_logical):
    """Check if an attribute already exists on the entity."""
    url = f"{API_URL}/EntityDefinitions(LogicalName='{entity_logical}')/Attributes(LogicalName='{attr_logical}')?$select=MetadataId"
    r = requests.get(url, headers=get_headers(token))
    return r.status_code == 200

def create_lookup_column(token, entity_logical, lookup_schema, lookup_logical,
                         display_name, referenced_entity, relationship_name,
                         description=""):
    """Create a lookup column + 1:N relationship via the Web API."""
    print(f"\n📎 Creating lookup: {entity_logical}.{lookup_logical} → {referenced_entity}")

    # Check if already exists
    if check_attribute_exists(token, entity_logical, lookup_logical):
        print(f"  ✅ Already exists, skipping.")
        return True

    url = f"{API_URL}/RelationshipDefinitions"
    payload = {
        "@odata.type": "Microsoft.Dynamics.CRM.OneToManyRelationshipMetadata",
        "SchemaName": relationship_name,
        "ReferencedEntity": referenced_entity,
        "ReferencingEntity": entity_logical,
        "Lookup": {
            "SchemaName": lookup_schema,
            "LogicalName": lookup_logical,
            "DisplayName": {
                "LocalizedLabels": [
                    {"Label": display_name, "LanguageCode": 1033}
                ]
            },
            "Description": {
                "LocalizedLabels": [
                    {"Label": description or f"Lookup to {referenced_entity}", "LanguageCode": 1033}
                ]
            },
            "RequiredLevel": {"Value": "None"}
        },
        "CascadeConfiguration": {
            "Assign": "NoCascade",
            "Delete": "RemoveLink",
            "Merge": "NoCascade",
            "Reparent": "NoCascade",
            "Share": "NoCascade",
            "Unshare": "NoCascade",
            "RollupView": "NoCascade"
        }
    }

    headers = get_headers(token)
    r = requests.post(url, headers=headers, json=payload)

    if r.status_code in (200, 201, 204):
        print(f"  ✅ Created successfully!")
        return True
    elif "DuplicateRelationshipSchemaName" in r.text or "already exists" in r.text.lower():
        print(f"  ✅ Relationship already exists, skipping.")
        return True
    else:
        print(f"  ❌ Failed ({r.status_code}): {r.text[:500]}")
        return False


def create_text_column(token, entity_logical, attr_schema, attr_logical,
                       display_name, max_length=50, description=""):
    """Create a simple text (string) column via the Web API."""
    print(f"\n📝 Creating text column: {entity_logical}.{attr_logical}")

    if check_attribute_exists(token, entity_logical, attr_logical):
        print(f"  ✅ Already exists, skipping.")
        return True

    url = f"{API_URL}/EntityDefinitions(LogicalName='{entity_logical}')/Attributes"
    payload = {
        "@odata.type": "Microsoft.Dynamics.CRM.StringAttributeMetadata",
        "SchemaName": attr_schema,
        "LogicalName": attr_logical,
        "DisplayName": {
            "LocalizedLabels": [
                {"Label": display_name, "LanguageCode": 1033}
            ]
        },
        "Description": {
            "LocalizedLabels": [
                {"Label": description or display_name, "LanguageCode": 1033}
            ]
        },
        "RequiredLevel": {"Value": "None"},
        "MaxLength": max_length,
        "FormatName": {"Value": "Text"}
    }

    headers = get_headers(token)
    r = requests.post(url, headers=headers, json=payload)

    if r.status_code in (200, 201, 204):
        print(f"  ✅ Created successfully!")
        return True
    elif "already exists" in r.text.lower():
        print(f"  ✅ Already exists, skipping.")
        return True
    else:
        print(f"  ❌ Failed ({r.status_code}): {r.text[:500]}")
        return False


def update_relationship_to_parental(token, relationship_name):
    """Update an existing relationship's cascade delete to Parental (Cascade)."""
    print(f"\n🔗 Updating relationship '{relationship_name}' to Parental cascade...")

    url = f"{API_URL}/RelationshipDefinitions(SchemaName='{relationship_name}')"
    r = requests.get(url, headers=get_headers(token))

    if r.status_code != 200:
        print(f"  ⚠️ Relationship '{relationship_name}' not found: {r.status_code}")
        # Try to list relationships for the entity to find the correct name
        return False

    current = r.json()
    cascade = current.get("CascadeConfiguration", {})

    if cascade.get("Delete") == "Cascade":
        print(f"  ✅ Already set to Parental cascade, skipping.")
        return True

    # Update cascade delete to Cascade (Parental)
    patch_payload = {
        "CascadeConfiguration": {
            "Assign": cascade.get("Assign", "Cascade"),
            "Delete": "Cascade",
            "Merge": cascade.get("Merge", "NoCascade"),
            "Reparent": cascade.get("Reparent", "Cascade"),
            "Share": cascade.get("Share", "Cascade"),
            "Unshare": cascade.get("Unshare", "Cascade"),
            "RollupView": cascade.get("RollupView", "NoCascade")
        }
    }

    headers = get_headers(token)
    r = requests.patch(url, headers=headers, json=patch_payload)

    if r.status_code in (200, 204):
        print(f"  ✅ Updated successfully!")
        return True
    else:
        print(f"  ❌ Failed ({r.status_code}): {r.text[:500]}")
        return False


def publish_all(token):
    """Publish all customizations."""
    print(f"\n🚀 Publishing all customizations...")
    url = f"{API_URL}/PublishAllXml"
    r = requests.post(url, headers=get_headers(token), json={})
    if r.status_code in (200, 204):
        print("  ✅ Published!")
        return True
    else:
        print(f"  ❌ Publish failed ({r.status_code}): {r.text[:500]}")
        return False


# ─── Main Execution ──────────────────────────────────────────────────────────
def main():
    token = get_access_token()

    print(f"\n{'='*60}")
    print(f"  🏗️  Dataverse Schema Creator — QLDA Environment")
    print(f"  Environment: {ENV_URL}")
    print(f"  Solution: {SOLUTION_NAME}")
    print(f"{'='*60}")

    results = []

    # ── 1. Task Table: Add AssigneeID (→ User) ──
    results.append(create_lookup_column(
        token,
        entity_logical=f"{PUBLISHER_PREFIX}_task",
        lookup_schema=f"{PUBLISHER_PREFIX}_AssigneeID",
        lookup_logical=f"{PUBLISHER_PREFIX}_assigneeid",
        display_name="Assignee",
        referenced_entity=f"{PUBLISHER_PREFIX}_user",
        relationship_name=f"{PUBLISHER_PREFIX}_User_Task_Assignee",
        description="The user assigned to this task"
    ))

    # ── 2. Task Table: Add ProjectPhaseID (→ ProjectPhase) ──
    results.append(create_lookup_column(
        token,
        entity_logical=f"{PUBLISHER_PREFIX}_task",
        lookup_schema=f"{PUBLISHER_PREFIX}_ProjectPhaseID",
        lookup_logical=f"{PUBLISHER_PREFIX}_projectphaseid",
        display_name="Project Phase",
        referenced_entity=f"{PUBLISHER_PREFIX}_projectphase",
        relationship_name=f"{PUBLISHER_PREFIX}_ProjectPhase_Task",
        description="The project phase this task belongs to"
    ))

    # ── 3. TimesheetLog Table: Add UserID (→ User) ──
    results.append(create_lookup_column(
        token,
        entity_logical=f"{PUBLISHER_PREFIX}_timesheetlog",
        lookup_schema=f"{PUBLISHER_PREFIX}_UserID",
        lookup_logical=f"{PUBLISHER_PREFIX}_userid",
        display_name="User",
        referenced_entity=f"{PUBLISHER_PREFIX}_user",
        relationship_name=f"{PUBLISHER_PREFIX}_User_TimesheetLog",
        description="The user this timesheet log belongs to"
    ))

    # ── 4. PerformanceAppraisal Table: Add EmployeeID (→ User) ──
    results.append(create_lookup_column(
        token,
        entity_logical=f"{PUBLISHER_PREFIX}_performanceappraisal",
        lookup_schema=f"{PUBLISHER_PREFIX}_EmployeeID",
        lookup_logical=f"{PUBLISHER_PREFIX}_employeeid",
        display_name="Employee",
        referenced_entity=f"{PUBLISHER_PREFIX}_user",
        relationship_name=f"{PUBLISHER_PREFIX}_User_Appraisal_Employee",
        description="The employee being appraised"
    ))

    # ── 5. PerformanceAppraisal Table: Add PeriodID (→ EvaluationPeriod) ──
    results.append(create_lookup_column(
        token,
        entity_logical=f"{PUBLISHER_PREFIX}_performanceappraisal",
        lookup_schema=f"{PUBLISHER_PREFIX}_PeriodID",
        lookup_logical=f"{PUBLISHER_PREFIX}_periodid",
        display_name="Evaluation Period",
        referenced_entity=f"{PUBLISHER_PREFIX}_evaluationperiod",
        relationship_name=f"{PUBLISHER_PREFIX}_Period_Appraisal",
        description="The evaluation period for this appraisal"
    ))

    # ── 6. PerformanceAppraisal Table: Add EvaluatorID (→ User) ──
    results.append(create_lookup_column(
        token,
        entity_logical=f"{PUBLISHER_PREFIX}_performanceappraisal",
        lookup_schema=f"{PUBLISHER_PREFIX}_EvaluatorID",
        lookup_logical=f"{PUBLISHER_PREFIX}_evaluatorid",
        display_name="Evaluator",
        referenced_entity=f"{PUBLISHER_PREFIX}_user",
        relationship_name=f"{PUBLISHER_PREFIX}_User_Appraisal_Evaluator",
        description="The manager/evaluator performing the appraisal"
    ))

    # ── 7. KPITarget Table: Add EmployeeID (→ User) ──
    results.append(create_lookup_column(
        token,
        entity_logical=f"{PUBLISHER_PREFIX}_kpitarget",
        lookup_schema=f"{PUBLISHER_PREFIX}_EmployeeID",
        lookup_logical=f"{PUBLISHER_PREFIX}_employeeid",
        display_name="Employee",
        referenced_entity=f"{PUBLISHER_PREFIX}_user",
        relationship_name=f"{PUBLISHER_PREFIX}_User_KPITarget",
        description="The employee this KPI target belongs to"
    ))

    # ── 8. User Table: Add SystemRole text column ──
    results.append(create_text_column(
        token,
        entity_logical=f"{PUBLISHER_PREFIX}_user",
        attr_schema=f"{PUBLISHER_PREFIX}_SystemRole",
        attr_logical=f"{PUBLISHER_PREFIX}_systemrole",
        display_name="System Role",
        max_length=50,
        description="Global RBAC role: Employee, ProjectManager, HRManager, Admin"
    ))

    # ── 9. Update Project → ProjectObjectiveAlignment to Parental ──
    # Try common naming patterns for the existing relationship
    parental_updated = False
    for rel_name in [
        f"{PUBLISHER_PREFIX}_Project_ProjectObjectiveAlignment",
        f"{PUBLISHER_PREFIX}_project_projectobjectivealignment",
        f"{PUBLISHER_PREFIX}_cr5db_project_cr5db_projectobjectivealignment",
    ]:
        if update_relationship_to_parental(token, rel_name):
            parental_updated = True
            break

    if not parental_updated:
        print("  ⚠️ Could not find the Project→ProjectObjectiveAlignment relationship.")
        print("  You may need to update this manually in the Maker Portal.")

    # ── 10. Publish all customizations ──
    publish_all(token)

    # ── Summary ──
    success_count = sum(1 for r in results if r)
    total = len(results)
    print(f"\n{'='*60}")
    print(f"  📊 Results: {success_count}/{total} schema changes applied successfully")
    print(f"{'='*60}")

    if success_count < total:
        print("  ⚠️ Some changes failed. Review the output above for details.")
        sys.exit(1)
    else:
        print("  🎉 All schema changes applied and published!")
        print("  Next: Re-export the solution to sync local files with cloud.")


if __name__ == "__main__":
    main()
