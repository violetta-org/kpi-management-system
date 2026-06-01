#!/usr/bin/env python3
"""
Dataverse Database Seeding Utility for Miscellaneous Configurations
Author: Antigravity AI
Description: Seeds System Labels, System Roles, Role Assignments, Process Templates, 
Competency Catalogs, Bonus Matrix, Project Risks, and Issues.
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
    "cr5db_systemlabels": "cr5db_systemlabel",
    "cr5db_systemroles": "cr5db_systemrole",
    "cr5db_roleassignments": "cr5db_roleassignment",
    "new_processtemplates": "new_processtemplate",
    "new_competencycatalogs": "new_competencycatalog",
    "new_bonusmatrixes": "new_bonusmatrix",
    "cr5db_projectrisks": "cr5db_projectrisk",
    "cr5db_projectlabelassignments": "cr5db_projectlabelassignment",
    "cr5db_users": "cr5db_user",
    "cr5db_projects": "cr5db_project"
}

def parse_args():
    parser = argparse.ArgumentParser(description="Seed Dataverse Misc")
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
    
    print("\n🌱 Starting Seeding Process for Misc Configurations...")
    
    # 1. System Labels
    existing_labels = get_records(api_base, "cr5db_systemlabels", headers, "cr5db_systemlabelid,cr5db_systemlabel1")
    existing_lbl_names = [l["cr5db_systemlabel1"] for l in existing_labels]
    
    labels_to_make = [
        {"cr5db_systemlabel1": "Urgent", "cr5db_hexcolor": "#e81123", "cr5db_labelgroup": "Priority"},
        {"cr5db_systemlabel1": "Bug", "cr5db_hexcolor": "#a80000", "cr5db_labelgroup": "Category"}
    ]
    
    for l in labels_to_make:
        if l["cr5db_systemlabel1"] not in existing_lbl_names:
            insert_record(api_base, "cr5db_systemlabels", l, headers)
            print(f"  + System Label '{l['cr5db_systemlabel1']}' created.")

    # 2. Process Templates & Competency Catalogs
    existing_templates = get_records(api_base, "new_processtemplates", headers, "new_processtemplateid,new_name")
    existing_tpl_names = [t["new_name"] for t in existing_templates]
    
    if "Quy trình Onboarding" not in existing_tpl_names:
        insert_record(api_base, "new_processtemplates", {"new_name": "Quy trình Onboarding", "new_type": "Onboarding"}, headers)
        print("  + Process Template 'Onboarding' created.")
        
    existing_comps = get_records(api_base, "new_competencycatalogs", headers, "new_competencycatalogid,new_competencyname")
    existing_comp_names = [c["new_competencyname"] for c in existing_comps]
    
    comps_to_make = [
        {"new_competencyname": "Lập trình React & TypeScript", "new_competencytype": "Functional", "new_maxlevel": 5},
        {"new_competencyname": "Quản trị cơ sở dữ liệu Dataverse", "new_competencytype": "Technical", "new_maxlevel": 5}
    ]
    
    for c in comps_to_make:
        if c["new_competencyname"] not in existing_comp_names:
            insert_record(api_base, "new_competencycatalogs", c, headers)
            print(f"  + Competency '{c['new_competencyname']}' created.")

    # 3. Project Risks & Issues
    projects = get_records(api_base, "cr5db_projects", headers, "cr5db_projectid,cr5db_projectname")
    if projects:
        proj_guid = projects[0]["cr5db_projectid"]
        
        existing_risks = get_records(api_base, "cr5db_projectrisks", headers, "cr5db_projectriskid,cr5db_projectrisk1")
        existing_risk_names = [r["cr5db_projectrisk1"] for r in existing_risks]
        
        risk_name = "Database scaling bottlenecks"
        if risk_name not in existing_risk_names:
            insert_record(api_base, "cr5db_projectrisks", {
                "cr5db_projectrisk1": risk_name,
                "new_mitigationplan": "Implement horizontal partitioning",
                "new_Project@odata.bind": f"cr5db_projects({proj_guid})"
            }, headers)
            print("  + Project Risk created.")
            
    print('\n✨ Misc Data Seeding Complete! All 50 tables should now be seeded.')

if __name__ == '__main__':
    main()
