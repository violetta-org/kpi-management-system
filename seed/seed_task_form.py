#!/usr/bin/env python3
"""
Dataverse Database Seeding Utility for Task Form
Author: Antigravity AI
Description: Seeds sample data for the Create Task form (Projects, Phases, Objectives, Tasks, KPI Targets, Users).
"""

import os
import re
import json
import argparse
import sys
from urllib.parse import urljoin

try:
    import msal
    import requests
except ImportError:
    print("❌ Error: Required python packages are missing.")
    print("Please install them using: pip install msal requests")
    sys.exit(1)

CLIENT_ID = "51f81489-12ee-4a9e-aaae-a2591f45987d"
AUTHORITY = "https://login.microsoftonline.com/common"

PLURAL_TO_SINGULAR = {
    "cr5db_projects": "cr5db_project",
    "cr5db_projectphases": "cr5db_projectphase",
    "cr5db_objectives": "cr5db_objective",
    "cr5db_tasks": "cr5db_task",
    "cr5db_kpitargets": "cr5db_kpitarget",
    "cr5db_users": "cr5db_user"
}

def parse_args():
    parser = argparse.ArgumentParser(description="Seed Dataverse environment for Task Form")
    parser.add_argument("--url", help="Dataverse Environment URL (e.g. https://orgcaf78765.crm5.dynamics.com/)")
    parser.add_argument("--device", action="store_true", help="Force MSAL Device Code Flow")
    return parser.parse_args()

def discover_env_url():
    config_path = "./apps/hr-management/power.config.json"
    if os.path.exists(config_path):
        try:
            with open(config_path, "r", encoding="utf-8") as f:
                config = json.load(f)
                env_id = config.get("environmentId")
                print(f"ℹ️ Found Environment ID in config: {env_id}")
        except Exception:
            pass
    return "https://orgcaf78765.crm5.dynamics.com/"

def get_access_token(env_url, use_device_flow):
    scopes = [f"{env_url.rstrip('/')}/.default"]
    app = msal.PublicClientApplication(CLIENT_ID, authority=AUTHORITY)
    
    accounts = app.get_accounts()
    if accounts:
        print("🔍 Attempting to load credentials from token cache...")
        result = app.acquire_token_silent(scopes, account=accounts[0])
        if result and "access_token" in result:
            print("✅ Loaded token from cache successfully.")
            return result["access_token"]
            
    if not use_device_flow:
        try:
            print("🌐 Opening browser for interactive authentication...")
            result = app.acquire_token_interactive(scopes)
            if result and "access_token" in result:
                return result["access_token"]
        except Exception as e:
            print(f"⚠️ Interactive login failed/not supported: {e}")
            print("Falling back to Device Code Flow.")
            
    flow = app.initiate_device_flow(scopes=scopes)
    if "message" not in flow:
        raise Exception(f"MSAL Device Flow initialization failed: {flow}")
        
    print(flow["message"])
    result = app.acquire_token_by_device_flow(flow)
    if result and "access_token" in result:
        return result["access_token"]
        
    raise Exception(f"Failed to obtain access token: {result}")

def make_request(method, url, headers, json_data=None):
    res = requests.request(method, url, headers=headers, json=json_data)
    if res.status_code == 404:
        return {"status": 404, "error": "Table or record not found"}
    if res.status_code not in (200, 201, 204):
        try:
            err_msg = res.json()
        except Exception:
            err_msg = res.text
        return {"status": res.status_code, "error": err_msg}
    return {"status": res.status_code, "data": res.json() if res.text else {}, "headers": res.headers}

def extract_guid(odata_entity_id):
    if not odata_entity_id:
        return None
    match = re.search(r"\(([0-9a-fA-F-]+)\)", odata_entity_id)
    return match.group(1) if match else None

def insert_record(api_base, table_name, data, headers):
    url = urljoin(api_base, table_name)
    res = make_request("POST", url, headers, data)
    if res["status"] == 404:
        return {"skipped": True, "reason": f"Table '{table_name}' not found (404). Solution component may not be deployed."}
    if "error" in res:
        print(f"  ⚠️ Error inserting into '{table_name}': {res['error']}")
        return {"error": res["error"]}
    
    odata_id = res["headers"].get("OData-EntityId")
    guid = extract_guid(odata_id)
    
    if not guid and "data" in res:
        singular = PLURAL_TO_SINGULAR.get(table_name, table_name)
        id_field = f"{singular}id"
        guid = res["data"].get(id_field)
        if not guid:
            for k, v in res["data"].items():
                if k.endswith("id") and v and len(str(v)) == 36:
                    guid = v
                    break
                    
    return {"success": True, "guid": guid}

def main():
    args = parse_args()
    env_url = args.url or discover_env_url()
    
    if not env_url.startswith("http"):
        env_url = "https://" + env_url
        
    print(f"🎯 Target Dataverse Environment: {env_url}")
    
    try:
        token = get_access_token(env_url, args.device)
    except Exception as e:
        print(f"❌ Auth Error: {e}")
        sys.exit(1)
        
    api_base = urljoin(env_url.rstrip("/") + "/", "api/data/v9.2/")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "Content-Type": "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0",
        "Prefer": "return=representation"
    }
    
    print("\n🌱 Starting Seeding Process for Task Form...")
    
    guids = {}
    
    # 1. Projects
    projects_data = [
        {"cr5db_projectname": "Project Alpha", "cr5db_description": "Mô tả dự án Alpha"},
        {"cr5db_projectname": "Project Beta", "cr5db_description": "Mô tả dự án Beta"}
    ]
    guids["projects"] = []
    print("Seeding Projects...")
    for p in projects_data:
        res = insert_record(api_base, "cr5db_projects", p, headers)
        if "success" in res:
            guids["projects"].append(res["guid"])
            print(f"  + Project '{p['cr5db_projectname']}' created.")

    # 2. Phases
    guids["phases"] = []
    if guids["projects"]:
        phases_data = [
            {
                "cr5db_phasename": "Phase 1: Khởi tạo", 
                "cr5db_ProjectID@odata.bind": f"/cr5db_projects({guids['projects'][0]})"
            },
            {
                "cr5db_phasename": "Phase 2: Thực thi", 
                "cr5db_ProjectID@odata.bind": f"/cr5db_projects({guids['projects'][0]})"
            }
        ]
        print("Seeding Phases...")
        for ph in phases_data:
            res = insert_record(api_base, "cr5db_projectphases", ph, headers)
            if "success" in res:
                guids["phases"].append(res["guid"])
                print(f"  + Phase '{ph['cr5db_phasename']}' created.")

    # 3. Objectives
    objectives_data = [
        {"cr5db_objective1": "Mục tiêu chiến lược Q3"},
        {"cr5db_objective1": "Mục tiêu doanh thu năm"}
    ]
    guids["objectives"] = []
    print("Seeding Objectives...")
    for o in objectives_data:
        res = insert_record(api_base, "cr5db_objectives", o, headers)
        if "success" in res:
            guids["objectives"].append(res["guid"])
            print(f"  + Objective '{o['cr5db_objective1']}' created.")

    # 4. Tasks (Subtasks)
    tasks_data = [
        {"cr5db_taskname": "Subtask 1: Phân tích yêu cầu"},
        {"cr5db_taskname": "Subtask 2: Thiết kế hệ thống"}
    ]
    guids["tasks"] = []
    print("Seeding Tasks (Subtasks)...")
    for t in tasks_data:
        res = insert_record(api_base, "cr5db_tasks", t, headers)
        if "success" in res:
            guids["tasks"].append(res["guid"])
            print(f"  + Task '{t['cr5db_taskname']}' created.")

    # 5. KPI Targets
    kpi_targets_data = [
        {"cr5db_kpitarget1": "KPI Target (Option 1)"},
        {"cr5db_kpitarget1": "KPI Target (Option 2)"}
    ]
    guids["kpitargets"] = []
    print("Seeding KPI Targets...")
    for k in kpi_targets_data:
        res = insert_record(api_base, "cr5db_kpitargets", k, headers)
        if "success" in res:
            guids["kpitargets"].append(res["guid"])
            print(f"  + KPI Target '{k['cr5db_kpitarget1']}' created.")

    # 6. Users
    users_data = [
        {"cr5db_fullname": "Hà Minh Khoa", "cr5db_email": "102229"},
        {"cr5db_fullname": "Nguyễn Hữu Minh Quân", "cr5db_email": "102230"}
    ]
    guids["users"] = []
    print("Seeding Users...")
    for u in users_data:
        res = insert_record(api_base, "cr5db_users", u, headers)
        if "success" in res:
            guids["users"].append(res["guid"])
            print(f"  + User '{u['cr5db_fullname']}' created.")

    print('✨ Task Form Data Seeding Complete!')

if __name__ == '__main__':
    main()
