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
    
    try:
        from msal import PublicClientApplication, SerializableTokenCache
    except ImportError:
        print("Installing msal package...", flush=True)
        subprocess.run([sys.executable, "-m", "pip", "install", "msal", "requests"], shell=True)
        from msal import PublicClientApplication, SerializableTokenCache

    import os
    cache_path = "scratch/token_cache.json"
    cache = SerializableTokenCache()
    if os.path.exists(cache_path):
        try:
            with open(cache_path, "r") as f:
                cache.deserialize(f.read())
            print("💾 Loaded token cache from disk.")
        except Exception as e:
            print(f"⚠️ Failed to load token cache: {e}")

    CLIENT_ID = "51f81489-12ee-4a9e-aaae-a2591f45987d"
    AUTHORITY = "https://login.microsoftonline.com/organizations"
    SCOPES = [f"{ENV_URL}/.default"]

    app = PublicClientApplication(CLIENT_ID, authority=AUTHORITY, token_cache=cache)

    accounts = app.get_accounts()
    if accounts:
        result = app.acquire_token_silent(SCOPES, account=accounts[0])
        if result and "access_token" in result:
            print("✅ Using cached token.", flush=True)
            return result["access_token"]

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

    if cache.has_state_changed:
        try:
            with open(cache_path, "w") as f:
                f.write(cache.serialize())
            print("💾 Saved token cache to disk.")
        except Exception as e:
            print(f"⚠️ Failed to save token cache: {e}")

    print("✅ Authenticated successfully!", flush=True)
    return result["access_token"]


def get_headers(token):
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0",
        "Accept": "application/json",
        "MSCRM.SolutionName": SOLUTION_NAME
    }


def entity_exists(token, logical_name):
    url = f"{API_URL}/EntityDefinitions(LogicalName='{logical_name}')?$select=MetadataId"
    r = requests.get(url, headers=get_headers(token))
    return r.status_code == 200


def create_entity(token, schema_name, display_name, primary_attr_schema, primary_attr_display):
    logical_name = schema_name.lower()
    if entity_exists(token, logical_name):
        print(f"✅ Table '{schema_name}' already exists, skipping table creation.")
        return True

    print(f"🏗️ Creating table '{schema_name}' ({display_name})...")
    url = f"{API_URL}/EntityDefinitions"
    payload = {
        "SchemaName": schema_name,
        "DisplayName": {
            "LocalizedLabels": [{"Label": display_name, "LanguageCode": 1033}]
        },
        "DisplayCollectionName": {
            "LocalizedLabels": [{"Label": display_name, "LanguageCode": 1033}]
        },
        "Attributes": [
            {
                "@odata.type": "Microsoft.Dynamics.CRM.StringAttributeMetadata",
                "FormatName": {"Value": "Text"},
                "MaxLength": 100,
                "SchemaName": primary_attr_schema,
                "DisplayName": {
                    "LocalizedLabels": [{"Label": primary_attr_display, "LanguageCode": 1033}]
                },
                "RequiredLevel": {"Value": "ApplicationRequired"},
                "IsPrimaryName": True
            }
        ],
        "OwnershipType": "UserOwned",
        "HasActivities": False,
        "HasNotes": False
    }

    r = requests.post(url, headers=get_headers(token), json=payload)
    if r.status_code in (200, 201, 204):
        print(f"✅ Created table '{schema_name}' successfully!")
        return True
    else:
        print(f"❌ Failed to create table ({r.status_code}): {r.text[:500]}")
        return False


def attribute_exists(token, entity_logical, attr_logical):
    url = f"{API_URL}/EntityDefinitions(LogicalName='{entity_logical}')/Attributes(LogicalName='{attr_logical}')?$select=MetadataId"
    r = requests.get(url, headers=get_headers(token))
    return r.status_code == 200


def create_text_column(token, entity_logical, attr_schema, display_name, max_length=100, is_memo=False):
    logical_name = attr_schema.lower()
    if attribute_exists(token, entity_logical, logical_name):
        print(f"  ✅ Column '{attr_schema}' already exists, skipping.")
        return True

    print(f"  📝 Creating text column '{attr_schema}'...")
    url = f"{API_URL}/EntityDefinitions(LogicalName='{entity_logical}')/Attributes"
    
    if is_memo:
        payload = {
            "@odata.type": "Microsoft.Dynamics.CRM.MemoAttributeMetadata",
            "SchemaName": attr_schema,
            "DisplayName": {
                "LocalizedLabels": [{"Label": display_name, "LanguageCode": 1033}]
            },
            "RequiredLevel": {"Value": "None"},
            "MaxLength": 1048576
        }
    else:
        payload = {
            "@odata.type": "Microsoft.Dynamics.CRM.StringAttributeMetadata",
            "SchemaName": attr_schema,
            "DisplayName": {
                "LocalizedLabels": [{"Label": display_name, "LanguageCode": 1033}]
            },
            "RequiredLevel": {"Value": "None"},
            "MaxLength": max_length,
            "FormatName": {"Value": "Text"}
        }

    r = requests.post(url, headers=get_headers(token), json=payload)
    if r.status_code in (200, 201, 204):
        print(f"    ✅ Created successfully!")
        return True
    else:
        print(f"    ❌ Failed ({r.status_code}): {r.text[:500]}")
        return False


def create_choice_column(token, entity_logical, attr_schema, display_name, options_dict):
    logical_name = attr_schema.lower()
    if attribute_exists(token, entity_logical, logical_name):
        print(f"  ✅ Choice column '{attr_schema}' already exists, skipping.")
        return True

    print(f"  📋 Creating choice column '{attr_schema}'...")
    url = f"{API_URL}/EntityDefinitions(LogicalName='{entity_logical}')/Attributes"
    
    options = []
    for val, lbl in options_dict.items():
        options.append({
            "Value": val,
            "Label": {
                "LocalizedLabels": [{"Label": lbl, "LanguageCode": 1033}]
            }
        })

    payload = {
        "@odata.type": "Microsoft.Dynamics.CRM.PicklistAttributeMetadata",
        "SchemaName": attr_schema,
        "DisplayName": {
            "LocalizedLabels": [{"Label": display_name, "LanguageCode": 1033}]
        },
        "RequiredLevel": {"Value": "None"},
        "OptionSet": {
            "IsGlobal": False,
            "OptionSetType": "Picklist",
            "Options": options
        }
    }

    r = requests.post(url, headers=get_headers(token), json=payload)
    if r.status_code in (200, 201, 204):
        print(f"    ✅ Created successfully!")
        return True
    else:
        print(f"    ❌ Failed ({r.status_code}): {r.text[:500]}")
        return False


def create_boolean_column(token, entity_logical, attr_schema, display_name, default_val=True):
    logical_name = attr_schema.lower()
    if attribute_exists(token, entity_logical, logical_name):
        print(f"  ✅ Boolean column '{attr_schema}' already exists, skipping.")
        return True

    print(f"  🔘 Creating boolean column '{attr_schema}'...")
    url = f"{API_URL}/EntityDefinitions(LogicalName='{entity_logical}')/Attributes"
    payload = {
        "@odata.type": "Microsoft.Dynamics.CRM.BooleanAttributeMetadata",
        "SchemaName": attr_schema,
        "DisplayName": {
            "LocalizedLabels": [{"Label": display_name, "LanguageCode": 1033}]
        },
        "RequiredLevel": {"Value": "None"},
        "OptionSet": {
            "FalseOption": {
                "Value": 0,
                "Label": {"LocalizedLabels": [{"Label": "No", "LanguageCode": 1033}]}
            },
            "TrueOption": {
                "Value": 1,
                "Label": {"LocalizedLabels": [{"Label": "Yes", "LanguageCode": 1033}]}
            }
        },
        "DefaultValue": default_val
    }

    r = requests.post(url, headers=get_headers(token), json=payload)
    if r.status_code in (200, 201, 204):
        print(f"    ✅ Created successfully!")
        return True
    else:
        print(f"    ❌ Failed ({r.status_code}): {r.text[:500]}")
        return False


def create_integer_column(token, entity_logical, attr_schema, display_name):
    logical_name = attr_schema.lower()
    if attribute_exists(token, entity_logical, logical_name):
        print(f"  ✅ Integer column '{attr_schema}' already exists, skipping.")
        return True

    print(f"  🔢 Creating integer column '{attr_schema}'...")
    url = f"{API_URL}/EntityDefinitions(LogicalName='{entity_logical}')/Attributes"
    payload = {
        "@odata.type": "Microsoft.Dynamics.CRM.IntegerAttributeMetadata",
        "SchemaName": attr_schema,
        "DisplayName": {
            "LocalizedLabels": [{"Label": display_name, "LanguageCode": 1033}]
        },
        "RequiredLevel": {"Value": "None"},
        "Format": "None",
        "MinValue": 0,
        "MaxValue": 2147483647
    }

    r = requests.post(url, headers=get_headers(token), json=payload)
    if r.status_code in (200, 201, 204):
        print(f"    ✅ Created successfully!")
        return True
    else:
        print(f"    ❌ Failed ({r.status_code}): {r.text[:500]}")
        return False


def create_lookup_relationship(token, referencing_entity, referenced_entity, lookup_schema, display_name, relationship_name):
    lookup_logical = lookup_schema.lower()
    if attribute_exists(token, referencing_entity, lookup_logical):
        print(f"  ✅ Lookup '{lookup_schema}' already exists, skipping relationship.")
        return True

    print(f"  🔗 Creating lookup relationship: {referencing_entity}.{lookup_logical} → {referenced_entity}...")
    url = f"{API_URL}/RelationshipDefinitions"
    payload = {
        "@odata.type": "Microsoft.Dynamics.CRM.OneToManyRelationshipMetadata",
        "SchemaName": relationship_name,
        "ReferencedEntity": referenced_entity,
        "ReferencingEntity": referencing_entity,
        "Lookup": {
            "SchemaName": lookup_schema,
            "LogicalName": lookup_logical,
            "DisplayName": {
                "LocalizedLabels": [{"Label": display_name, "LanguageCode": 1033}]
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

    r = requests.post(url, headers=get_headers(token), json=payload)
    if r.status_code in (200, 201, 204):
        print(f"    ✅ Created relationship successfully!")
        return True
    elif "already exists" in r.text.lower() or "DuplicateRelationshipSchemaName" in r.text:
        print(f"    ✅ Relationship already exists, skipping.")
        return True
    else:
        print(f"    ❌ Failed ({r.status_code}): {r.text[:500]}")
        return False


def publish_all(token):
    print(f"\n🚀 Publishing all customizations...")
    url = f"{API_URL}/PublishAllXml"
    r = requests.post(url, headers=get_headers(token), json={})
    if r.status_code in (200, 204):
        print("  ✅ Published successfully!")
        return True
    else:
        print(f"  ❌ Publish failed ({r.status_code}): {r.text[:500]}")
        return False


def main():
    token = get_access_token()

    print(f"\n{'='*60}")
    print(f"  🏗️  Dataverse Schema Creator for Approval Routing")
    print(f"  Environment: {ENV_URL}")
    print(f"  Solution: {SOLUTION_NAME}")
    print(f"{'='*60}\n")

    # 1. CREATE TABLES
    t1_created = create_entity(token, f"{PUBLISHER_PREFIX}_ApprovalRoutes", "Approval Routes", f"{PUBLISHER_PREFIX}_RouteName", "Route Name")
    t2_created = create_entity(token, f"{PUBLISHER_PREFIX}_ChangeRequests", "Change Requests", f"{PUBLISHER_PREFIX}_RequestTitle", "Request Title")

    if not (t1_created and t2_created):
        print("❌ One of the tables failed to create, aborting column creation.")
        sys.exit(1)

    # Allow Dataverse a couple of seconds to index new tables
    time.sleep(3)

    # 2. DEFINE CHOICE OPTIONS
    entities_choices = {
        1: "Tasks",
        2: "KPITargets",
        3: "JobPositions",
        4: "HeadcountRequests",
        5: "Projects",
        6: "Users"
    }
    operation_choices_route = {
        1: "Create",
        2: "Update",
        3: "Delete",
        4: "All"
    }
    operation_choices_req = {
        1: "Create",
        2: "Update",
        3: "Delete"
    }
    role_choices = {
        1: "Employee",
        2: "ProjectManager",
        3: "HRManager",
        4: "Admin"
    }
    routing_choices = {
        1: "POSITION_HIERARCHY",
        2: "SPECIFIC_ROLE",
        3: "DEPARTMENT_HEAD",
        4: "SPECIFIC_USER"
    }
    status_choices = {
        1: "Pending",
        2: "Approved",
        3: "Rejected",
        4: "Cancelled"
    }

    # 3. CREATE COLUMNS ON cr5db_approvalroutes
    print(f"\n⚙️ Creating columns on '{PUBLISHER_PREFIX}_approvalroutes'...")
    t1_logical = f"{PUBLISHER_PREFIX}_approvalroutes"
    create_choice_column(token, t1_logical, f"{PUBLISHER_PREFIX}_TargetEntity", "Target Entity", entities_choices)
    create_choice_column(token, t1_logical, f"{PUBLISHER_PREFIX}_OperationType", "Operation Type", operation_choices_route)
    create_choice_column(token, t1_logical, f"{PUBLISHER_PREFIX}_RequesterRole", "Requester Role", role_choices)
    create_choice_column(token, t1_logical, f"{PUBLISHER_PREFIX}_RoutingType", "Routing Type", routing_choices)
    create_text_column(token, t1_logical, f"{PUBLISHER_PREFIX}_ApproverRole", "Approver Role", max_length=50)
    create_lookup_relationship(token, t1_logical, f"{PUBLISHER_PREFIX}_user", f"{PUBLISHER_PREFIX}_ApproverUser", "Approver User", f"{PUBLISHER_PREFIX}_User_ApprovalRoute_ApproverUser")
    create_integer_column(token, t1_logical, f"{PUBLISHER_PREFIX}_Priority", "Priority")
    create_boolean_column(token, t1_logical, f"{PUBLISHER_PREFIX}_IsActive", "Is Active", default_val=True)

    # 4. CREATE COLUMNS ON cr5db_changerequests
    print(f"\n⚙️ Creating columns on '{PUBLISHER_PREFIX}_changerequests'...")
    t2_logical = f"{PUBLISHER_PREFIX}_changerequests"
    create_choice_column(token, t2_logical, f"{PUBLISHER_PREFIX}_TargetEntity", "Target Entity", entities_choices)
    create_choice_column(token, t2_logical, f"{PUBLISHER_PREFIX}_OperationType", "Operation Type", operation_choices_req)
    create_text_column(token, t2_logical, f"{PUBLISHER_PREFIX}_PayloadJSON", "Payload JSON", is_memo=True)
    create_text_column(token, t2_logical, f"{PUBLISHER_PREFIX}_TargetRecordID", "Target Record ID", max_length=100)
    create_text_column(token, t2_logical, f"{PUBLISHER_PREFIX}_OldValueJSON", "Old Value JSON", is_memo=True)
    create_choice_column(token, t2_logical, f"{PUBLISHER_PREFIX}_Status", "Status", status_choices)
    create_text_column(token, t2_logical, f"{PUBLISHER_PREFIX}_Reason", "Reason", is_memo=True)
    create_text_column(token, t2_logical, f"{PUBLISHER_PREFIX}_ApproverComment", "Approver Comment", is_memo=True)
    create_lookup_relationship(token, t2_logical, f"{PUBLISHER_PREFIX}_user", f"{PUBLISHER_PREFIX}_Requester", "Requester", f"{PUBLISHER_PREFIX}_User_ChangeRequest_Requester")
    create_lookup_relationship(token, t2_logical, f"{PUBLISHER_PREFIX}_user", f"{PUBLISHER_PREFIX}_Approver", "Approver", f"{PUBLISHER_PREFIX}_User_ChangeRequest_Approver")
    create_lookup_relationship(token, t2_logical, f"{PUBLISHER_PREFIX}_approvalroutes", f"{PUBLISHER_PREFIX}_AppliedRoute", "Applied Route", f"{PUBLISHER_PREFIX}_ApprovalRoute_ChangeRequest_AppliedRoute")

    # 5. PUBLISH ALL
    publish_all(token)

    print(f"\n{'='*60}")
    print("🎉 Dataverse Table and Column creation complete!")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
