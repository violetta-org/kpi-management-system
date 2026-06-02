#!/usr/bin/env python3
"""
Dataverse Database Seeding Utility for Projects, Phases, Teams, and Resource Allocations
Author: Antigravity AI
Description: Seeds Project data, avoiding duplicates. Requires Users to be seeded.
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
    "cr5db_projectteams": "cr5db_projectteam",
    "cr5db_resourceallocations": "cr5db_resourceallocation",
    "cr5db_userprojectroles": "cr5db_userprojectrole",
    "cr5db_users": "cr5db_user"
}

def parse_args():
    parser = argparse.ArgumentParser(description="Seed Dataverse Projects and Teams")
    parser.add_argument("--url", help="Dataverse Environment URL")
    parser.add_argument("--device", action="store_true", help="Force MSAL Device Code Flow")
    return parser.parse_args()

def discover_env_url():
    config_path = "./apps/hr-management/power.config.json"
    if os.path.exists(config_path):
        try:
            with open(config_path, "r", encoding="utf-8") as f:
                config = json.load(f)
                env_id = config.get("environmentId")
        except Exception:
            pass
    return "https://orgcaf78765.crm5.dynamics.com/"

def get_access_token(env_url, use_device_flow):
    scopes = [f"{env_url.rstrip('/')}/.default"]
    app = msal.PublicClientApplication(CLIENT_ID, authority=AUTHORITY)
    accounts = app.get_accounts()
    if accounts:
        result = app.acquire_token_silent(scopes, account=accounts[0])
        if result and "access_token" in result:
            return result["access_token"]
            
    if not use_device_flow:
        try:
            result = app.acquire_token_interactive(scopes)
            if result and "access_token" in result:
                return result["access_token"]
        except Exception:
            pass
            
    flow = app.initiate_device_flow(scopes=scopes)
    if "message" not in flow:
        raise Exception("MSAL Device Flow initialization failed")
        
    print(flow["message"])
    result = app.acquire_token_by_device_flow(flow)
    if result and "access_token" in result:
        return result["access_token"]
        
    raise Exception("Failed to obtain access token")

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

def get_records(api_base, table_name, headers, select=None):
    url = urljoin(api_base, table_name)
    if select:
        url += f"?$select={select}"
    res = make_request("GET", url, headers)
    if res["status"] == 200 and "value" in res["data"]:
        return res["data"]["value"]
    return []

def insert_record(api_base, table_name, data, headers):
    url = urljoin(api_base, table_name)
    res = make_request("POST", url, headers, data)
    if res["status"] == 404:
        return {"skipped": True, "reason": f"Table '{table_name}' not found."}
    if "error" in res:
        print(f"  ⚠️ Error inserting into '{table_name}': {res['error']}")
        return {"error": res["error"]}
    
    odata_id = res["headers"].get("OData-EntityId")
    guid = extract_guid(odata_id)
    if not guid and "data" in res:
        singular = PLURAL_TO_SINGULAR.get(table_name, table_name)
        id_field = f"{singular}id"
        guid = res["data"].get(id_field)
    return {"success": True, "guid": guid}

def main():
    args = parse_args()
    env_url = args.url or discover_env_url()
    if not env_url.startswith("http"):
        env_url = "https://" + env_url
        
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
    
    print("\n🌱 Starting Seeding Process for Projects & Teams...")
    
    # Check existing projects to avoid duplicates
    existing_projects = get_records(api_base, "cr5db_projects", headers, "cr5db_projectid,cr5db_projectname")
    existing_project_names = {p["cr5db_projectname"]: p["cr5db_projectid"] for p in existing_projects}
    
    proj_name = "FPT Smart Traffic Engine"
    if proj_name in existing_project_names:
        print(f"✅ Project '{proj_name}' already exists. Skipping project creation.")
        proj_guid = existing_project_names[proj_name]
    else:
        print(f"Creating Project '{proj_name}'...")
        res = insert_record(api_base, "cr5db_projects", {
            "cr5db_projectname": proj_name,
            "cr5db_description": "Hệ thống phân tích và tối ưu hóa mật độ giao thông thông minh sử dụng AI của FPT.",
            "cr5db_startdate": "2026-04-05T00:00:00Z",
            "cr5db_enddate": "2026-06-25T00:00:00Z"
        }, headers)
        if "success" in res:
            proj_guid = res["guid"]
            print("  + Project created successfully.")
        else:
            print("❌ Failed to create Project.")
            sys.exit(1)

    # Project Phases
    existing_phases = get_records(api_base, "cr5db_projectphases", headers, "cr5db_projectphaseid,cr5db_phasename")
    existing_phase_names = {ph["cr5db_phasename"]: ph["cr5db_projectphaseid"] for ph in existing_phases}
    
    phase_name = "Phase 1: Database Setup & Core Integration"
    if phase_name in existing_phase_names:
        print(f"✅ Phase '{phase_name}' already exists.")
    else:
        print(f"Creating Phase '{phase_name}'...")
        res = insert_record(api_base, "cr5db_projectphases", {
            "cr5db_phasename": phase_name,
            "cr5db_startdate": "2026-04-06T00:00:00Z",
            "cr5db_enddate": "2026-04-30T00:00:00Z",
            "cr5db_ProjectID@odata.bind": f"cr5db_projects({proj_guid})"
        }, headers)
        if "success" in res:
            print("  + Phase created.")

    # Project Teams
    existing_teams = get_records(api_base, "cr5db_projectteams", headers, "cr5db_projectteamid,cr5db_teamname")
    existing_team_names = {t["cr5db_teamname"]: t["cr5db_projectteamid"] for t in existing_teams}
    
    team_name = "FPT Smart Traffic Dev Team"
    if team_name in existing_team_names:
        print(f"✅ Team '{team_name}' already exists.")
        team_guid = existing_team_names[team_name]
    else:
        print(f"Creating Team '{team_name}'...")
        res = insert_record(api_base, "cr5db_projectteams", {
            "cr5db_teamname": team_name,
            "cr5db_ProjectID@odata.bind": f"cr5db_projects({proj_guid})"
        }, headers)
        if "success" in res:
            team_guid = res["guid"]
            print("  + Team created.")
        else:
            print("❌ Failed to create Team.")
            sys.exit(1)

    # Resource Allocations
    print("Fetching existing Users to allocate resources...")
    users = get_records(api_base, "cr5db_users", headers, "cr5db_userid,cr5db_fullname,cr5db_email")
    user_map = {u["cr5db_email"]: u["cr5db_userid"] for u in users}
    
    # Let's allocate Bob, Charlie, Alice PM, and Quân
    allocations_to_make = [
        {"email": "dev1@fpt.com", "percent": 100, "role": "Lead Software Engineer", "rolecode": "LD", "name_prefix": "Bob Allocation"},
        {"email": "dev2@fpt.com", "percent": 150, "role": "Senior Developer", "rolecode": "SD", "name_prefix": "Charlie Allocation (Burnout)"},
        {"email": "102230", "percent": 50, "role": "Junior Developer", "rolecode": "JD", "name_prefix": "Quân Allocation"}
    ]
    
    # Check existing allocations for this team
    existing_allocations = get_records(api_base, "cr5db_resourceallocations", headers, "cr5db_resourceallocationid,cr5db_resourceallocation1")
    existing_alloc_names = [a["cr5db_resourceallocation1"] for a in existing_allocations]
    
    for alloc in allocations_to_make:
        u_guid = user_map.get(alloc["email"])
        if not u_guid:
            print(f"⚠️ User {alloc['email']} not found. Skipping allocation.")
            continue
            
        alloc_name = f"{alloc['name_prefix']} - {team_name}"
        if alloc_name in existing_alloc_names:
            print(f"✅ Allocation '{alloc_name}' already exists.")
            continue
            
        print(f"Allocating {alloc['email']} at {alloc['percent']}%...")
        res = insert_record(api_base, "cr5db_resourceallocations", {
            "cr5db_resourceallocation1": alloc_name,
            "cr5db_allocationpercentage": alloc["percent"],
            "cr5db_UserID@odata.bind": f"cr5db_users({u_guid})",
            "cr5db_ProjectTeamID@odata.bind": f"cr5db_projectteams({team_guid})"
        }, headers)
        
        if "success" in res:
            alloc_guid = res["guid"]
            # Assign Role in Project
            insert_record(api_base, "cr5db_userprojectroles", {
                "cr5db_rolename": alloc["role"],
                "cr5db_rolecode": alloc["rolecode"],
                "cr5db_AllocationID@odata.bind": f"cr5db_resourceallocations({alloc_guid})"
            }, headers)
            print(f"  + Allocated successfully with role {alloc['rolecode']}.")

    print('✨ Projects & Teams Data Seeding Complete!')

if __name__ == '__main__':
    main()
