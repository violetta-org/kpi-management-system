import requests
import json
import os

ENV_URL = "https://orgcaf78765.crm5.dynamics.com"
API_URL = f"{ENV_URL}/api/data/v9.2"
cache_path = "scratch/token_cache.json"

if not os.path.exists(cache_path):
    print("No token cache found!")
    exit(1)

# Read cached token
from msal import SerializableTokenCache, PublicClientApplication
cache = SerializableTokenCache()
cache.deserialize(open(cache_path, "r").read())
app = PublicClientApplication("51f81489-12ee-4a9e-aaae-a2591f45987d", authority="https://login.microsoftonline.com/organizations", token_cache=cache)
accounts = app.get_accounts()
token = app.acquire_token_silent([f"{ENV_URL}/.default"], account=accounts[0])["access_token"]

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

# Default rules to seed
# Choice mappings:
# targetentity: 1: Tasks, 2: KPITargets, 3: JobPositions, 4: HeadcountRequests, 5: Projects, 6: Users
# operationtype: 1: Create, 2: Update, 3: Delete, 4: All
# requesterrole: 1: Employee, 2: ProjectManager, 3: HRManager, 4: Admin
# routingtype: 1: POSITION_HIERARCHY, 2: SPECIFIC_ROLE, 3: DEPARTMENT_HEAD, 4: SPECIFIC_USER
rules = [
    {
        "cr5db_routename": "Task → Quản lý trực tiếp",
        "cr5db_targetentity": 1,
        "cr5db_operationtype": 4,
        "cr5db_requesterrole": 1,
        "cr5db_routingtype": 1,
        "cr5db_priority": 1,
        "cr5db_isactive": True
    },
    {
        "cr5db_routename": "Headcount → HR",
        "cr5db_targetentity": 4,
        "cr5db_operationtype": 4,
        "cr5db_requesterrole": 1,
        "cr5db_routingtype": 2,
        "cr5db_approverrole": "HRManager",
        "cr5db_priority": 1,
        "cr5db_isactive": True
    },
    {
        "cr5db_routename": "Headcount → Admin",
        "cr5db_targetentity": 4,
        "cr5db_operationtype": 4,
        "cr5db_requesterrole": 3,
        "cr5db_routingtype": 2,
        "cr5db_approverrole": "Admin",
        "cr5db_priority": 1,
        "cr5db_isactive": True
    },
    {
        "cr5db_routename": "KPI → HR",
        "cr5db_targetentity": 2,
        "cr5db_operationtype": 4,
        "cr5db_requesterrole": 2,
        "cr5db_routingtype": 2,
        "cr5db_approverrole": "HRManager",
        "cr5db_priority": 1,
        "cr5db_isactive": True
    },
    {
        "cr5db_routename": "JobPos → Admin",
        "cr5db_targetentity": 3,
        "cr5db_operationtype": 4,
        "cr5db_requesterrole": 3,
        "cr5db_routingtype": 2,
        "cr5db_approverrole": "Admin",
        "cr5db_priority": 1,
        "cr5db_isactive": True
    },
    {
        "cr5db_routename": "User → Admin",
        "cr5db_targetentity": 6,
        "cr5db_operationtype": 4,
        "cr5db_requesterrole": 3,
        "cr5db_routingtype": 2,
        "cr5db_approverrole": "Admin",
        "cr5db_priority": 1,
        "cr5db_isactive": True
    },
    {
        "cr5db_routename": "Project → Admin",
        "cr5db_targetentity": 5,
        "cr5db_operationtype": 4,
        "cr5db_requesterrole": 2,
        "cr5db_routingtype": 2,
        "cr5db_approverrole": "Admin",
        "cr5db_priority": 1,
        "cr5db_isactive": True
    }
]

print("=== Seeding default approval routes in Dataverse ===")

# First, fetch existing rules to prevent duplicates
existing_rules = []
r_list = requests.get(f"{API_URL}/cr5db_approvalrouteses?$select=cr5db_routename", headers=headers)
if r_list.status_code == 200:
    existing_rules = [item["cr5db_routename"] for item in r_list.json().get("value", [])]

for r_data in rules:
    name = r_data["cr5db_routename"]
    if name in existing_rules:
        print(f"✅ Rule '{name}' already exists, skipping.")
        continue
        
    r = requests.post(f"{API_URL}/cr5db_approvalrouteses", headers=headers, json=r_data)
    if r.status_code in (200, 201, 204):
        print(f"🎉 Seeded rule: {name}")
    else:
        print(f"❌ Failed to seed rule '{name}': {r.status_code} - {r.text[:200]}")
