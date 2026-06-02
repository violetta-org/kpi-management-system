#!/usr/bin/env python3
"""
Dataverse Database Seeding Utility for Appraisals and IDPs
Author: Antigravity AI
Description: Seeds Performance Appraisals, IDPs, and IDP Actions. Avoiding duplicates.
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
    "cr5db_performanceappraisals": "cr5db_performanceappraisal",
    "cr5db_appraisalkpidetails": "cr5db_appraisalkpidetail",
    "new_idps": "new_idp",
    "new_idpactions": "new_idpaction",
    "cr5db_users": "cr5db_user",
    "cr5db_evaluationperiods": "cr5db_evaluationperiod"
}

def parse_args():
    parser = argparse.ArgumentParser(description="Seed Dataverse Appraisals and IDPs")
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
    
    print("\n🌱 Starting Seeding Process for Appraisals & IDPs...")
    
    # Dependencies
    print("Fetching dependencies...")
    users = get_records(api_base, "cr5db_users", headers, "cr5db_userid,cr5db_email")
    user_map = {u["cr5db_email"]: u["cr5db_userid"] for u in users}
    bob_id = user_map.get("dev1@fpt.com")
    charlie_id = user_map.get("dev2@fpt.com")
    
    periods = get_records(api_base, "cr5db_evaluationperiods", headers, "cr5db_evaluationperiodid,cr5db_evaluationperiod1")
    if not periods:
        print("⚠️ No Evaluation Periods found. Please run seed_evaluationperiod.py first.")
        sys.exit(1)
    period_id = periods[0]["cr5db_evaluationperiodid"]

    if not bob_id or not charlie_id:
        print("⚠️ Missing users Bob or Charlie. Please run seed_users.py first.")
        sys.exit(1)

    # 1. Performance Appraisals
    print("\nSeeding Performance Appraisals...")
    existing_apprs = get_records(api_base, "cr5db_performanceappraisals", headers, "cr5db_performanceappraisalid,cr5db_appraisalname")
    existing_appr_names = [a["cr5db_appraisalname"] for a in existing_apprs]
    
    appraisals_to_make = [
        {
            "name": "Đánh giá hiệu suất Q2 - Bob", "score": 92.5, "rating": "Excellent", 
            "status": "Completed", "user_id": bob_id
        },
        {
            "name": "Đánh giá hiệu suất Q2 - Charlie", "score": 65.0, "rating": "Needs Improvement", 
            "status": "Draft", "user_id": charlie_id
        }
    ]
    
    for appr in appraisals_to_make:
        if appr["name"] in existing_appr_names:
            print(f"✅ Appraisal '{appr['name']}' already exists.")
            continue
            
        print(f"Creating Appraisal '{appr['name']}'...")
        res = insert_record(api_base, "cr5db_performanceappraisals", {
            "cr5db_appraisalname": appr["name"],
            "cr5db_totalscore": appr["score"],
            "cr5db_finalrating": appr["rating"],
            "cr5db_status": appr["status"],
            "cr5db_EmployeeID@odata.bind": f"cr5db_users({appr['user_id']})"
        }, headers)
        if "success" in res:
            print("  + Appraisal created.")

    # 2. Individual Development Plans (IDPs)
    print("\nSeeding IDPs & Actions...")
    existing_idps = get_records(api_base, "new_idps", headers, "new_idpid,new_idpname")
    existing_idp_names = {i["new_idpname"]: i["new_idpid"] for i in existing_idps}
    
    idps_to_make = [
        {"name": "IDP 2026 - Bob Developer", "status": "Approved", "user_id": bob_id},
        {"name": "IDP 2026 - Charlie Developer", "status": "In Progress", "user_id": charlie_id}
    ]
    
    for idp in idps_to_make:
        if idp["name"] in existing_idp_names:
            print(f"✅ IDP '{idp['name']}' already exists.")
            idp_guid = existing_idp_names[idp["name"]]
        else:
            print(f"Creating IDP '{idp['name']}'...")
            res = insert_record(api_base, "new_idps", {
                "new_idpname": idp["name"],
                "new_status": idp["status"],
                "new_Employee@odata.bind": f"cr5db_users({idp['user_id']})"
            }, headers)
            if "success" in res:
                idp_guid = res["guid"]
                print("  + IDP created.")
            else:
                continue
                
        # Add IDP Action for Charlie
        if "Charlie" in idp["name"]:
            # Check existing actions for this IDP
            existing_actions = get_records(api_base, "new_idpactions", headers, "new_idpactionid,new_name", f"_new_idp_value eq '{idp_guid}'")
            if not existing_actions:
                print("  Creating IDP Action for Charlie...")
                insert_record(api_base, "new_idpactions", {
                    "new_name": "Tham gia khóa đào tạo Advanced Dataverse API",
                    "new_description": "Cải thiện kỹ năng làm việc với OData",
                    "new_status": "Not Started",
                    "new_IDP@odata.bind": f"new_idps({idp_guid})"
                }, headers)

    print('\n✨ Appraisals & IDPs Data Seeding Complete!')

if __name__ == '__main__':
    main()
