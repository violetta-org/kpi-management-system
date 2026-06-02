#!/usr/bin/env python3
"""
Dataverse Database Seeding Utility for Users
Author: Antigravity AI
Description: Seeds Users (Employees) data. Requires Job Positions to be seeded first.
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
    "cr5db_users": "cr5db_user",
    "cr5db_jobpositions": "cr5db_jobposition",
    "cr5db_departments": "cr5db_department"
}

def parse_args():
    parser = argparse.ArgumentParser(description="Seed Dataverse Users")
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
    
    print("\n🌱 Starting Seeding Process for Users...")
    
    # 1. Fetch Job Positions to link users
    print("Fetching existing Job Positions...")
    job_positions = get_records(api_base, "cr5db_jobpositions", headers, "cr5db_jobpositionid,cr5db_positionname")
    
    if not job_positions:
        print("⚠️ No Job Positions found. Please run seed_jobposition.py first.")
        sys.exit(1)
        
    # Map by name for easy lookup
    jp_map = { jp["cr5db_positionname"]: jp["cr5db_jobpositionid"] for jp in job_positions }
    
    dir_id = jp_map.get("Director of Software Product R&D", job_positions[0]["cr5db_jobpositionid"])
    pm_id = jp_map.get("R&D Project Manager", job_positions[0]["cr5db_jobpositionid"])
    eng_id = jp_map.get("Senior Software Engineer", job_positions[0]["cr5db_jobpositionid"])
    
    users_data = [
        {"cr5db_fullname": "Hà Minh Khoa", "cr5db_email": "102229", "cr5db_isactive": True, "cr5db_systemrole": "Super Admin", "cr5db_JobPosition@odata.bind": f"cr5db_jobpositions({dir_id})"},
        {"cr5db_fullname": "Nguyễn Hữu Minh Quân", "cr5db_email": "102230", "cr5db_isactive": True, "cr5db_systemrole": "Employee", "cr5db_JobPosition@odata.bind": f"cr5db_jobpositions({eng_id})"},
        {"cr5db_fullname": "Alice PM", "cr5db_email": "pm@fpt.com", "cr5db_isactive": True, "cr5db_systemrole": "ProjectManager", "cr5db_JobPosition@odata.bind": f"cr5db_jobpositions({pm_id})"},
        {"cr5db_fullname": "Bob Developer", "cr5db_email": "dev1@fpt.com", "cr5db_isactive": True, "cr5db_systemrole": "Employee", "cr5db_JobPosition@odata.bind": f"cr5db_jobpositions({eng_id})"},
        {"cr5db_fullname": "Charlie Developer", "cr5db_email": "dev2@fpt.com", "cr5db_isactive": True, "cr5db_systemrole": "Employee", "cr5db_JobPosition@odata.bind": f"cr5db_jobpositions({eng_id})"}
    ]
    
    print("Seeding Users...")
    for u in users_data:
        res = insert_record(api_base, "cr5db_users", u, headers)
        if "success" in res:
            print(f"  + User '{u['cr5db_fullname']}' ({u['cr5db_email']}) created.")
            
    print('✨ Users Data Seeding Complete!')

if __name__ == '__main__':
    main()
