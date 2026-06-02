#!/usr/bin/env python3
"""
Dataverse Database Seeding Utility for Objectives and KPIs
Author: Antigravity AI
Description: Seeds Objectives, KPI Library, KPI Targets, and Actual Logs avoiding duplicates.
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
    "cr5db_objectives": "cr5db_objective",
    "cr5db_kpilibraries": "cr5db_kpilibrary",
    "cr5db_kpitargets": "cr5db_kpitarget",
    "cr5db_kpiactuallogs": "cr5db_kpiactuallog",
    "cr5db_evaluationperiods": "cr5db_evaluationperiod",
    "cr5db_users": "cr5db_user"
}

def parse_args():
    parser = argparse.ArgumentParser(description="Seed Dataverse Objectives and KPIs")
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
    
    print("\n🌱 Starting Seeding Process for Objectives & KPIs...")
    
    # 1. Fetch Evaluation Periods
    periods = get_records(api_base, "cr5db_evaluationperiods", headers, "cr5db_evaluationperiodid,cr5db_evaluationperiod1")
    if not periods:
        print("⚠️ No Evaluation Periods found. Please run seed_evaluationperiod.py first.")
        sys.exit(1)
    period_id = periods[0]["cr5db_evaluationperiodid"]

    # 2. Objectives
    existing_objs = get_records(api_base, "cr5db_objectives", headers, "cr5db_objectiveid,cr5db_objective1")
    existing_obj_names = {o["cr5db_objective1"]: o["cr5db_objectiveid"] for o in existing_objs}
    
    obj_name = "Nâng cao chất lượng phần mềm QLDA Q2/2026"
    if obj_name in existing_obj_names:
        print(f"✅ Objective '{obj_name}' already exists.")
        obj_guid = existing_obj_names[obj_name]
    else:
        print(f"Creating Objective '{obj_name}'...")
        res = insert_record(api_base, "cr5db_objectives", {
            "cr5db_objective1": obj_name,
            "cr5db_targetvalue": 100.0,
            "cr5db_objectiveprogress": 0.0,
            "cr5db_PeriodName@odata.bind": f"cr5db_evaluationperiods({period_id})"
        }, headers)
        if "success" in res:
            obj_guid = res["guid"]
            print("  + Objective created successfully.")
        else:
            sys.exit(1)

    # 3. KPI Library
    existing_kpis = get_records(api_base, "cr5db_kpilibraries", headers, "cr5db_kpilibraryid,cr5db_kpiname")
    existing_kpi_names = {k["cr5db_kpiname"]: k["cr5db_kpilibraryid"] for k in existing_kpis}
    
    kpi_libs = [
        {"cr5db_kpiname": "Tỷ lệ hoàn thành Task đúng hạn", "cr5db_unit": "%", "cr5db_formula": "(Số Task đúng hạn / Tổng) * 100", "new_direction": 1},
        {"cr5db_kpiname": "Tỷ lệ thời gian Timesheet chuẩn", "cr5db_unit": "%", "cr5db_formula": "(Giờ hợp lệ / Giờ quy định) * 100", "new_direction": 1}
    ]
    
    kpi_lib_guids = []
    for lib in kpi_libs:
        if lib["cr5db_kpiname"] in existing_kpi_names:
            print(f"✅ KPI Library '{lib['cr5db_kpiname']}' already exists.")
            kpi_lib_guids.append(existing_kpi_names[lib["cr5db_kpiname"]])
        else:
            print(f"Creating KPI Library '{lib['cr5db_kpiname']}'...")
            res = insert_record(api_base, "cr5db_kpilibraries", lib, headers)
            if "success" in res:
                kpi_lib_guids.append(res["guid"])
                print("  + KPI Library created.")

    # 4. KPI Targets
    users = get_records(api_base, "cr5db_users", headers, "cr5db_userid,cr5db_fullname,cr5db_email")
    user_map = {u["cr5db_email"]: u["cr5db_userid"] for u in users}
    
    existing_targets = get_records(api_base, "cr5db_kpitargets", headers, "cr5db_kpitargetid,cr5db_kpitarget1")
    existing_target_names = [t["cr5db_kpitarget1"] for t in existing_targets]
    
    targets_to_make = [
        {
            "name": "Hoàn thành Core API Integration", "target": 95.0, "email": "dev1@fpt.com", 
            "actual": 90.0, "log_msg": "Hoàn thành Schema & Core Endpoints", "kpi_idx": 0
        },
        {
            "name": "Thiết lập AI Model Schema", "target": 95.0, "email": "dev2@fpt.com", 
            "actual": 40.0, "log_msg": "Xây dựng AI model pipeline nháp", "kpi_idx": 0
        }
    ]
    
    for tg in targets_to_make:
        if tg["name"] in existing_target_names:
            print(f"✅ KPI Target '{tg['name']}' already exists.")
            continue
            
        u_guid = user_map.get(tg["email"])
        if not u_guid or not kpi_lib_guids:
            continue
            
        print(f"Creating KPI Target '{tg['name']}' for {tg['email']}...")
        res = insert_record(api_base, "cr5db_kpitargets", {
            "cr5db_kpitarget1": tg["name"],
            "cr5db_targetvalue": tg["target"],
            "cr5db_actualvalue": 0.0, # Will be updated by logs automatically or simulated here
            "cr5db_weightpercentage": 50,
            "cr5db_EmployeeID@odata.bind": f"cr5db_users({u_guid})",
            "cr5db_KPICode@odata.bind": f"cr5db_kpilibraries({kpi_lib_guids[tg['kpi_idx']]})",
            "cr5db_ParentObjective@odata.bind": f"cr5db_objectives({obj_guid})"
        }, headers)
        
        if "success" in res:
            tg_guid = res["guid"]
            print("  + Target created. Adding Actual Log...")
            insert_record(api_base, "cr5db_kpiactuallogs", {
                "cr5db_kpiactuallog1": tg["log_msg"],
                "cr5db_actualvalue": tg["actual"],
                "cr5db_evidencelink": "https://github.com/violetta-org/kpi-management-system",
                "cr5db_TargetId@odata.bind": f"cr5db_kpitargets({tg_guid})"
            }, headers)
            print("    * Log added.")

    print('✨ Objectives & KPIs Data Seeding Complete!')

if __name__ == '__main__':
    main()
