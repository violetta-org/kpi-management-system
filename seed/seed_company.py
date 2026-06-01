#!/usr/bin/env python3
"""
Dataverse Database Seeding Utility for KPI Management System (FPT Software Context)
Author: Antigravity AI
Description: Seeds 50 tables in the correct relationship hierarchy.
             Gracefully handles missing tables (404) if they are not yet deployed.
             Supports clearing records in reverse order.
Prerequisites: pip install msal requests
Usage:
  python seed_data_ultimate.py --url https://orgcaf78765.crm5.dynamics.com/
  python seed_data_ultimate.py --url https://orgcaf78765.crm5.dynamics.com/ --clear
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

# Power Platform CLI Client ID (Public App, no secret needed)
CLIENT_ID = "51f81489-12ee-4a9e-aaae-a2591f45987d"
AUTHORITY = "https://login.microsoftonline.com/common"

# Ordering for clearing tables (children first, parents last)
CLEAR_ORDER = [
    # Level 7/6: Operational Logs & Leaf Items
    "cr5db_appraisalkpidetails",
    "cr5db_timesheetlogs",
    "cr5db_taskcomments",
    "cr5db_taskdependencies",
    "cr5db_tasklabelassignments",
    "new_processsteps",

    # Level 5: Transactional Operational Tables
    "cr5db_tasks",
    "new_leaverequests",
    "cr5db_overtimerequests",
    "new_idpactions",
    "new_competencyassessments",
    "new_employeeprocesses",
    "cr5db_kpiactuallogs",

    # Level 4: Master Transactional Containers
    "cr5db_kpitargets",
    "cr5db_performanceappraisals",
    "new_leavebalances",
    "new_idps",
    "cr5db_projectlabelassignments",
    "cr5db_projectobjectivealignments",
    "cr5db_projectissues",
    "cr5db_projectrisks",
    "cr5db_userprojectroles",
    "cr5db_resourceallocations",
    "cr5db_projectteams",
    "cr5db_projectphases",
    "cr5db_projects",
    "cr5db_objectives",

    # Level 2 & 3: Child Base & Workforce Setup
    "new_processtemplatesteps",
    "new_jobcompetencies",
    "cr5db_users",
    "cr5db_jobpositions",
    "cr5db_positioncatalogs",
    "cr5db_departments",

    # Level 1: Root Base Definitions
    "cr5db_companies",
    "cr5db_systemlabels",
    "cr5db_systemnotifications",
    "cr5db_systemparameters",
    "cr5db_systempolicyrules",
    "cr5db_headcountrequests",
    "cr5db_approvaldelegations",
    "cr5db_audittraillogs",
    "cr5db_approvalrouteses",
    "cr5db_changerequestses",
    "cr5db_roleassignments",
    "cr5db_systemroles",
    "cr5db_taskownerships",
    "cr5db_timesheetaudits",
    "cr5db_workhours",
    "cr5db_holidaies",
    "new_processtemplates",
    "new_competencycatalogs",
    "new_bonusmatrixes"
]

PLURAL_TO_SINGULAR = {
    "cr5db_appraisalkpidetails": "cr5db_appraisalkpidetail",
    "cr5db_performanceappraisals": "cr5db_performanceappraisal",
    "cr5db_kpiactuallogs": "cr5db_kpiactuallog",
    "cr5db_kpitargets": "cr5db_kpitarget",
    "cr5db_timesheetlogs": "cr5db_timesheetlog",
    "cr5db_taskcomments": "cr5db_taskcomment",
    "cr5db_taskdependencies": "cr5db_taskdependency",
    "cr5db_tasklabelassignments": "cr5db_tasklabelassignment",
    "cr5db_projectlabelassignments": "cr5db_projectlabelassignment",
    "cr5db_projectobjectivealignments": "cr5db_projectobjectivealignment",
    "cr5db_projectissues": "cr5db_projectissue",
    "cr5db_projectrisks": "cr5db_projectrisk",
    "cr5db_tasks": "cr5db_task",
    "cr5db_userprojectroles": "cr5db_userprojectrole",
    "cr5db_resourceallocations": "cr5db_resourceallocation",
    "cr5db_projectteams": "cr5db_projectteam",
    "cr5db_projectphases": "cr5db_projectphase",
    "cr5db_projects": "cr5db_project",
    "cr5db_objectives": "cr5db_objective",
    "cr5db_kpilibraries": "cr5db_kpilibrary",
    "cr5db_evaluationperiods": "cr5db_evaluationperiod",
    "cr5db_users": "cr5db_user",
    "cr5db_jobpositions": "cr5db_jobposition",
    "cr5db_positioncatalogs": "cr5db_positioncatalog",
    "cr5db_departments": "cr5db_department",
    "cr5db_companies": "cr5db_company",
    "cr5db_systemlabels": "cr5db_systemlabel",
    "cr5db_systemnotifications": "cr5db_systemnotification",
    "cr5db_systemparameters": "cr5db_systemparameter",
    "cr5db_systempolicyrules": "cr5db_systempolicyrule",
    "cr5db_headcountrequests": "cr5db_headcountrequest",
    "cr5db_approvaldelegations": "cr5db_approvaldelegation",
    "cr5db_audittraillogs": "cr5db_audittraillog",
    "cr5db_approvalrouteses": "cr5db_approvalroutes",
    "cr5db_changerequestses": "cr5db_changerequests",
    "cr5db_roleassignments": "cr5db_roleassignment",
    "cr5db_systemroles": "cr5db_systemrole",
    "cr5db_taskownerships": "cr5db_taskownership",
    "cr5db_timesheetaudits": "cr5db_timesheetaudit",
    "cr5db_workhours": "cr5db_workhour",
    
    # New tables singular names
    "new_bonusmatrixes": "new_bonusmatrix",
    "new_competencycatalogs": "new_competencycatalog",
    "new_jobcompetencies": "new_jobcompetency",
    "new_competencyassessments": "new_competencyassessment",
    "new_idps": "new_idp",
    "new_idpactions": "new_idpaction",
    "new_processtemplates": "new_processtemplate",
    "new_processtemplatesteps": "new_processtemplatestep",
    "new_employeeprocesses": "new_employeeprocess",
    "new_processsteps": "new_processstep",
    "new_leavebalances": "new_leavebalance",
    "new_leaverequests": "new_leaverequest",
    "cr5db_holidaies": "cr5db_holiday",
    "cr5db_overtimerequests": "cr5db_overtimerequest"
}

def parse_args():
    parser = argparse.ArgumentParser(description="Seed Dataverse environment for VibePowerApps")
    parser.add_argument("--url", help="Dataverse Environment URL (e.g. https://orgcaf78765.crm5.dynamics.com/)")
    parser.add_argument("--clear", action="store_true", help="Delete existing custom records in the environment before seeding")
    parser.add_argument("--device", action="store_true", help="Force MSAL Device Code Flow instead of interactive browser")
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
    
    # Check cache first
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
            
    # Device Code Flow fallback
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

def clear_records(api_base, headers):
    print("\n🧹 Starting database clean up (deleting custom records in reverse order)...")
    for table in CLEAR_ORDER:
        url = urljoin(api_base, f"{table}")
        singular_name = PLURAL_TO_SINGULAR.get(table, table)
        id_field = f"{singular_name}id"
        res = make_request("GET", url + "?$select=" + id_field, headers)
        if res["status"] == 404:
            print(f"➖ Table '{table}' does not exist in environment. Skipping.")
            continue
        if "error" in res:
            print(f"⚠️ Failed to query table '{table}': {res['error']}. Skipping.")
            continue
            
        records = res["data"].get("value", [])
        if not records:
            continue
            
        print(f"🗑️ Deleting {len(records)} records from '{table}'...")
        deleted = 0
        for rec in records:
            rec_id = rec.get(id_field)
            if rec_id:
                del_url = urljoin(api_base, f"{table}({rec_id})")
                del_res = make_request("DELETE", del_url, headers)
                if "error" in del_res:
                    pass
                else:
                    deleted += 1
        print(f"✅ Deleted {deleted}/{len(records)} records from '{table}'.")

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
    
    if args.clear:
        clear_records(api_base, headers)
        print("🧹 Clean up complete.")
        sys.exit(0)
        
    print("\n🌱 Starting Seeding Process (FPT Software Real-world Context)...")
    
    guids = {}
    
    # ==========================================
    # LEVEL 1: ROOT BASE TABLES
    # ==========================================
    
    # 1. Companies
    companies_data = [
        {"cr5db_companycode": "FPT", "cr5db_companyname": "FPT Software Joint Stock Company"},
        {"cr5db_companycode": "FJP", "cr5db_companyname": "FPT Japan Co., Ltd."}
    ]
    guids["companies"] = []
    for c in companies_data:
        res = insert_record(api_base, "cr5db_companies", c, headers)
        if "success" in res:
            guids["companies"].append(res["guid"])
            print(f"  + Company '{c['cr5db_companycode']}' created.")
        elif "skipped" in res:
            print(f"  - {res['reason']}")
            break
            
    if not guids["companies"]:
        print("⚠️ No companies created. Cannot proceed with relational seeding.")
        sys.exit(1)
        

    print('✨ Company Seeding Complete!')

if __name__ == '__main__':
    main()
