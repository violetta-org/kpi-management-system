#!/usr/bin/env python3
"""
Dataverse Database Seeding Utility for Tasks and Timesheets
Author: Antigravity AI
Description: Seeds realistic Tasks, subtasks, and Timesheet logs. Avoiding duplicates.
"""

import os
import re
import json
import argparse
import sys
import datetime
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
    "cr5db_tasks": "cr5db_task",
    "cr5db_timesheetlogs": "cr5db_timesheetlog",
    "cr5db_projects": "cr5db_project",
    "cr5db_projectphases": "cr5db_projectphase",
    "cr5db_users": "cr5db_user"
}

def parse_args():
    parser = argparse.ArgumentParser(description="Seed Dataverse Tasks and Timesheets")
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

def get_records(api_base, table_name, headers, select=None, filter_query=None):
    url = urljoin(api_base, table_name)
    query_params = []
    if select:
        query_params.append(f"$select={select}")
    if filter_query:
        query_params.append(f"$filter={filter_query}")
    if query_params:
        url += "?" + "&".join(query_params)
        
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
    
    print("\n🌱 Starting Seeding Process for Tasks & Timesheets...")
    
    # Fetch existing core references
    print("Fetching dependencies (Users, Projects, Phases)...")
    users = get_records(api_base, "cr5db_users", headers, "cr5db_userid,cr5db_email")
    user_map = {u["cr5db_email"]: u["cr5db_userid"] for u in users}
    
    bob_id = user_map.get("dev1@fpt.com")
    charlie_id = user_map.get("dev2@fpt.com")
    
    if not bob_id or not charlie_id:
        print("⚠️ Missing users Bob or Charlie. Please run seed_users.py first.")
        sys.exit(1)
        
    projects = get_records(api_base, "cr5db_projects", headers, "cr5db_projectid,cr5db_projectname")
    proj_map = {p["cr5db_projectname"]: p["cr5db_projectid"] for p in projects}
    proj_id = proj_map.get("FPT Smart Traffic Engine")
    
    if not proj_id:
        print("⚠️ Missing project 'FPT Smart Traffic Engine'. Please run seed_projects_teams.py first.")
        sys.exit(1)
        
    phases = get_records(api_base, "cr5db_projectphases", headers, "cr5db_projectphaseid,cr5db_phasename")
    phase_map = {p["cr5db_phasename"]: p["cr5db_projectphaseid"] for p in phases}
    phase_id = phase_map.get("Phase 1: Database Setup & Core Integration")

    # Seed Tasks
    existing_tasks = get_records(api_base, "cr5db_tasks", headers, "cr5db_taskid,cr5db_taskname")
    existing_task_names = {t["cr5db_taskname"]: t["cr5db_taskid"] for t in existing_tasks}
    
    tasks_to_make = [
        {
            "name": "Thiết kế Database Schema cho Traffic Logs",
            "desc": "Sử dụng PostgreSQL partition để xử lý dữ liệu lớn.",
            "status": "In Progress", "priority": "High", "effort": 40.0,
            "user_id": bob_id
        },
        {
            "name": "Phát triển AI Model nhận diện xe cộ",
            "desc": "Sử dụng YOLOv8 để đếm số lượng xe trên camera.",
            "status": "To Do", "priority": "Critical", "effort": 80.0,
            "user_id": charlie_id
        },
        {
            "name": "Xây dựng REST API Data Ingestion",
            "desc": "API Gateway bằng FastAPI/Python.",
            "status": "Done", "priority": "Medium", "effort": 24.0,
            "user_id": bob_id
        }
    ]
    
    task_guids = {}
    print("\nSeeding Tasks...")
    for tk in tasks_to_make:
        if tk["name"] in existing_task_names:
            print(f"✅ Task '{tk['name']}' already exists.")
            task_guids[tk["name"]] = existing_task_names[tk["name"]]
            continue
            
        print(f"Creating Task '{tk['name']}'...")
        payload = {
            "cr5db_taskname": tk["name"],
            "cr5db_description": tk["desc"],
            "cr5db_taskstatus": tk["status"],
            "cr5db_priority": tk["priority"],
            "cr5db_estimatedeffort": tk["effort"],
            "cr5db_ProjectID@odata.bind": f"cr5db_projects({proj_id})",
            "cr5db_AssignedTo@odata.bind": f"cr5db_users({tk['user_id']})"
        }
        if phase_id:
            payload["cr5db_PhaseID@odata.bind"] = f"cr5db_projectphases({phase_id})"
            
        res = insert_record(api_base, "cr5db_tasks", payload, headers)
        if "success" in res:
            task_guids[tk["name"]] = res["guid"]
            print("  + Task created.")

    # Seed Timesheets
    existing_ts = get_records(api_base, "cr5db_timesheetlogs", headers, "cr5db_timesheetlogid,cr5db_timesheetlog1")
    existing_ts_names = [ts["cr5db_timesheetlog1"] for ts in existing_ts]
    
    # Timesheets for Bob (who finished the API task)
    api_task_guid = task_guids.get("Xây dựng REST API Data Ingestion")
    db_task_guid = task_guids.get("Thiết kế Database Schema cho Traffic Logs")
    
    timesheets_to_make = []
    
    if api_task_guid:
        timesheets_to_make.append({
            "name": "Code API Endpoint (Ngày 1)",
            "hours": 8.0, "status": "Approved", "date": "2026-04-06T00:00:00Z",
            "task_guid": api_task_guid, "user_guid": bob_id
        })
        timesheets_to_make.append({
            "name": "Review và Optimize API (Ngày 2)",
            "hours": 6.0, "status": "Approved", "date": "2026-04-07T00:00:00Z",
            "task_guid": api_task_guid, "user_guid": bob_id
        })
        
    if db_task_guid:
        timesheets_to_make.append({
            "name": "Nghiên cứu Partitioning",
            "hours": 4.0, "status": "Pending", "date": "2026-04-08T00:00:00Z",
            "task_guid": db_task_guid, "user_guid": bob_id
        })

    # Charlie Timesheets
    ai_task_guid = task_guids.get("Phát triển AI Model nhận diện xe cộ")
    if ai_task_guid:
        timesheets_to_make.append({
            "name": "Labeling Data YOLOv8",
            "hours": 12.0, "status": "Rejected", "date": "2026-04-06T00:00:00Z",
            "task_guid": ai_task_guid, "user_guid": charlie_id
        })

    print("\nSeeding Timesheets...")
    for ts in timesheets_to_make:
        if ts["name"] in existing_ts_names:
            print(f"✅ Timesheet '{ts['name']}' already exists.")
            continue
            
        print(f"Creating Timesheet '{ts['name']}'...")
        res = insert_record(api_base, "cr5db_timesheetlogs", {
            "cr5db_timesheetlog1": ts["name"],
            "cr5db_hourslogged": ts["hours"],
            "cr5db_approvalstatus": ts["status"],
            "cr5db_logdate": ts["date"],
            "cr5db_TaskID@odata.bind": f"cr5db_tasks({ts['task_guid']})",
            "cr5db_UserID@odata.bind": f"cr5db_users({ts['user_guid']})"
        }, headers)
        
        if "success" in res:
            print(f"  + Timesheet created ({ts['hours']} hrs, Status: {ts['status']}).")

    print('\n✨ Tasks & Timesheets Data Seeding Complete!')

if __name__ == '__main__':
    main()
