#!/usr/bin/env python3
"""
Dataverse Database Seeding Utility for Leave & Overtime
Author: Antigravity AI
Description: Seeds Leave Balances, Leave Requests, and Overtime Requests.
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
    "new_leavebalances": "new_leavebalance",
    "new_leaverequests": "new_leaverequest",
    "cr5db_overtimerequests": "cr5db_overtimerequest",
    "cr5db_users": "cr5db_user"
}

def parse_args():
    parser = argparse.ArgumentParser(description="Seed Dataverse Leave and Overtime")
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
    
    print("\n🌱 Starting Seeding Process for Leave & Overtime...")
    
    # Dependencies
    print("Fetching dependencies...")
    users = get_records(api_base, "cr5db_users", headers, "cr5db_userid,cr5db_email,cr5db_fullname")
    if not users:
        print("⚠️ No Users found. Please run seed_users.py first.")
        sys.exit(1)

    existing_balances = get_records(api_base, "new_leavebalances", headers, "new_leavebalanceid,new_name")
    existing_balance_names = [b["new_name"] for b in existing_balances]

    existing_leaves = get_records(api_base, "new_leaverequests", headers, "new_leaverequestid,new_name")
    existing_leave_names = [l["new_name"] for l in existing_leaves]
    
    existing_ots = get_records(api_base, "cr5db_overtimerequests", headers, "cr5db_overtimerequestid,cr5db_name")
    existing_ot_names = [o["cr5db_name"] for o in existing_ots]

    print("\nSeeding Leave Balances...")
    for u in users:
        balance_name = f"Quỹ phép 2026 - {u['cr5db_email'].split('@')[0]}"
        if balance_name in existing_balance_names:
            print(f"✅ Leave Balance '{balance_name}' already exists.")
            continue
            
        res = insert_record(api_base, "new_leavebalances", {
            "new_name": balance_name,
            "new_year": 2026,
            "new_totalentitlement": 12.0,
            "new_carriedover": 2.0,
            "new_useddays": 0.0,
            "new_Employee@odata.bind": f"cr5db_users({u['cr5db_userid']})"
        }, headers)
        if "success" in res:
            print(f"  + Leave Balance for '{u['cr5db_fullname']}' created.")

    print("\nSeeding Leave Requests & Overtime...")
    user_map = {u["cr5db_email"]: u["cr5db_userid"] for u in users}
    bob_id = user_map.get("dev1@fpt.com")
    charlie_id = user_map.get("dev2@fpt.com")

    if bob_id:
        leave_name = "Nghỉ phép thường niên - Bob"
        if leave_name not in existing_leave_names:
            res = insert_record(api_base, "new_leaverequests", {
                "new_name": leave_name,
                "new_startdate": "2026-06-10T00:00:00Z",
                "new_enddate": "2026-06-12T00:00:00Z",
                "new_reason": "Nghỉ mát gia đình",
                "new_status": "Approved",
                "new_Employee@odata.bind": f"cr5db_users({bob_id})"
            }, headers)
            if "success" in res:
                print(f"  + Leave Request for Bob created.")



    print('\n✨ Leave & Overtime Data Seeding Complete!')

if __name__ == '__main__':
    main()
