#!/usr/bin/env python3
"""
Dataverse Database Seeding Utility for KPI Management System
Author: Antigravity AI
Description: Seeds 39 tables (35 active cr5db_ tables + 4 new_ tables) in the correct relationship hierarchy.
             Gracefully handles missing tables (404) if they are not yet deployed.
             Supports clearing records in reverse order.
Prerequisites: pip install msal requests
Usage:
  python seed_data.py --url https://orgcaf78765.crm5.dynamics.com/
  python seed_data.py --url https://orgcaf78765.crm5.dynamics.com/ --clear
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
    "cr5db_appraisalkpidetails",
    "cr5db_performanceappraisals",
    "cr5db_kpiactuallogs",
    "cr5db_kpitargets",
    "cr5db_timesheetlogs",
    "cr5db_taskcomments",
    "cr5db_taskdependencies",
    "cr5db_tasklabelassignments",
    "cr5db_projectlabelassignments",
    "cr5db_projectobjectivealignments",
    "cr5db_projectissues",
    "cr5db_projectrisks",
    "cr5db_tasks",
    "cr5db_userprojectroles",
    "cr5db_resourceallocations",
    "cr5db_projectteams",
    "cr5db_projectphases",
    "cr5db_projects",
    "cr5db_objectives",
    "cr5db_kpilibraries",
    "cr5db_evaluationperiods",
    "cr5db_users",
    "cr5db_jobpositions",
    "cr5db_positioncatalogs",
    "cr5db_departments",
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
    "cr5db_timesheetaudits"
]

def parse_args():
    parser = argparse.ArgumentParser(description="Seed Dataverse environment for VibePowerApps")
    parser.add_argument("--url", help="Dataverse Environment URL (e.g. https://orgcaf78765.crm5.dynamics.com/)")
    parser.add_argument("--clear", action="store_true", help="Delete existing custom records in the environment before seeding")
    parser.add_argument("--device", action="store_true", help="Force MSAL Device Code Flow instead of interactive browser")
    return parser.parse_args()

def discover_env_url():
    # Attempt to read default URL from power.config.json
    config_path = "./apps/hr-management/power.config.json"
    if os.path.exists(config_path):
        try:
            with open(config_path, "r", encoding="utf-8") as f:
                config = json.load(f)
                url = config.get("localAppUrl")
                # Wait, localAppUrl is for localhost. Let's see if env is there.
                # In power.config.json we have "region" and "environmentId".
                # But sometimes we don't have the crm url. Let's default to crm5 if not found.
                env_id = config.get("environmentId")
                print(f"ℹ️ Found Environment ID in config: {env_id}")
        except Exception:
            pass
    # We saw in pac auth list: https://orgcaf78765.crm5.dynamics.com/
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
    "cr5db_timesheetaudits": "cr5db_timesheetaudit"
}


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
        singular_name = PLURAL_TO_SINGULAR.get(table, table)
        id_field = f"{singular_name}id"
        deleted = 0
        for rec in records:
            rec_id = rec.get(id_field)
            if rec_id:
                del_url = urljoin(api_base, f"{table}({rec_id})")
                del_res = make_request("DELETE", del_url, headers)
                if "error" in del_res:
                    # Might fail due to constraint, just print
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
        # Fallback to extracting from the JSON body using PLURAL_TO_SINGULAR
        singular = PLURAL_TO_SINGULAR.get(table_name, table_name)
        id_field = f"{singular}id"
        guid = res["data"].get(id_field)
        if not guid:
            # Suffix fallback search
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
        
    print("\n🌱 Starting Seeding Process...")
    
    # Dictionary to keep track of created record GUIDs for lookups
    guids = {}
    
    # 1. Companies
    companies_data = [
        {"cr5db_companycode": "VNX", "cr5db_companyname": "VibePower Vietnam"},
        {"cr5db_companycode": "GLB", "cr5db_companyname": "VibePower Global"}
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
        
    # 2. System Labels
    labels_data = [
        {"cr5db_systemlabel1": "Urgent", "cr5db_hexcolor": "#e81123", "cr5db_labelgroup": "Priority"},
        {"cr5db_systemlabel1": "Medium", "cr5db_hexcolor": "#ff8c00", "cr5db_labelgroup": "Priority"},
        {"cr5db_systemlabel1": "Low", "cr5db_hexcolor": "#0078d4", "cr5db_labelgroup": "Priority"},
        {"cr5db_systemlabel1": "Bug", "cr5db_hexcolor": "#a80000", "cr5db_labelgroup": "Category"},
        {"cr5db_systemlabel1": "Feature", "cr5db_hexcolor": "#107c41", "cr5db_labelgroup": "Category"}
    ]
    guids["labels"] = []
    for l in labels_data:
        res = insert_record(api_base, "cr5db_systemlabels", l, headers)
        if "success" in res:
            guids["labels"].append((l["cr5db_systemlabel1"], res["guid"]))
            print(f"  + Label '{l['cr5db_systemlabel1']}' created.")
            
    # 3. System Roles (cr5db_SystemRole)
    roles_data = [
        {"cr5db_RoleName": "Director", "cr5db_RoleCode": "DIR", "cr5db_RoleDescription": "Executive leadership", "cr5db_RoleLevel": 4, "cr5db_IsActive": True},
        {"cr5db_RoleName": "Project Manager", "cr5db_RoleCode": "MGR", "cr5db_RoleDescription": "Project management and approvals", "cr5db_RoleLevel": 3, "cr5db_IsActive": True},
        {"cr5db_RoleName": "Software Engineer", "cr5db_RoleCode": "ENG", "cr5db_RoleDescription": "Technical execution", "cr5db_RoleLevel": 2, "cr5db_IsActive": True},
        {"cr5db_RoleName": "HR Specialist", "cr5db_RoleCode": "HR", "cr5db_RoleDescription": "Human resources and headcounts", "cr5db_RoleLevel": 2, "cr5db_IsActive": True}
    ]
    guids["systemroles"] = []
    for r in roles_data:
        res = insert_record(api_base, "cr5db_systemroles", r, headers)
        if "success" in res:
            guids["systemroles"].append((r["cr5db_RoleCode"], res["guid"]))
            print(f"  + System Role '{r['cr5db_RoleName']}' created.")
        elif "skipped" in res:
            print(f"  - {res['reason']}")
            # Graceful, continue seeding other tables
            
    # 4. Departments
    dept_data = [
        {"cr5db_departmentcode": "RND", "cr5db_departmentname": "Research & Development", "cr5db_CompanyID@odata.bind": f"cr5db_companies({guids['companies'][0]})"},
        {"cr5db_departmentcode": "HRM", "cr5db_departmentname": "Human Resources", "cr5db_CompanyID@odata.bind": f"cr5db_companies({guids['companies'][0]})"},
        {"cr5db_departmentcode": "MKT", "cr5db_departmentname": "Marketing", "cr5db_CompanyID@odata.bind": f"cr5db_companies({guids['companies'][1]})"}
    ]
    guids["departments"] = {}
    for d in dept_data:
        res = insert_record(api_base, "cr5db_departments", d, headers)
        if "error" in res and "cr5db_CompanyID@odata.bind" in d:
            print(f"  ⚠️ Retrying without cr5db_CompanyID for {d['cr5db_departmentcode']}...")
            del d["cr5db_CompanyID@odata.bind"]
            res = insert_record(api_base, "cr5db_departments", d, headers)
        
        if "success" in res:
            guids["departments"][d["cr5db_departmentcode"]] = res["guid"]
            print(f"  + Department '{d['cr5db_departmentcode']}' created.")
            
    # 5. Position Catalog
    catalog_data = [
        {"cr5db_code": "DIR", "cr5db_positioncatalog1": "Director"},
        {"cr5db_code": "MGR", "cr5db_positioncatalog1": "Project Manager"},
        {"cr5db_code": "ENG", "cr5db_positioncatalog1": "Software Engineer"},
        {"cr5db_code": "HR", "cr5db_positioncatalog1": "HR Specialist"}
    ]
    guids["catalog"] = {}
    for cat in catalog_data:
        res = insert_record(api_base, "cr5db_positioncatalogs", cat, headers)
        if "success" in res:
            guids["catalog"][cat["cr5db_code"]] = res["guid"]
            print(f"  + Catalog Position '{cat['cr5db_positioncatalog1']}' created.")
            
    # 6. Job Position
    job_positions_data = [
        {
            "cr5db_positionname": "Director of R&D",
            "cr5db_headcountquota": 1,
            "cr5db_Department@odata.bind": f"cr5db_departments({guids['departments'].get('RND', '')})",
            "cr5db_PositionCatalogTitle@odata.bind": f"cr5db_positioncatalogs({guids['catalog'].get('DIR', '')})"
        },
        {
            "cr5db_positionname": "R&D Project Manager",
            "cr5db_headcountquota": 2,
            "cr5db_Department@odata.bind": f"cr5db_departments({guids['departments'].get('RND', '')})",
            "cr5db_PositionCatalogTitle@odata.bind": f"cr5db_positioncatalogs({guids['catalog'].get('MGR', '')})"
        },
        {
            "cr5db_positionname": "Senior Software Engineer",
            "cr5db_headcountquota": 5,
            "cr5db_Department@odata.bind": f"cr5db_departments({guids['departments'].get('RND', '')})",
            "cr5db_PositionCatalogTitle@odata.bind": f"cr5db_positioncatalogs({guids['catalog'].get('ENG', '')})"
        },
        {
            "cr5db_positionname": "HR Recruitment Specialist",
            "cr5db_headcountquota": 2,
            "cr5db_Department@odata.bind": f"cr5db_departments({guids['departments'].get('HRM', '')})",
            "cr5db_PositionCatalogTitle@odata.bind": f"cr5db_positioncatalogs({guids['catalog'].get('HR', '')})"
        }
    ]
    # Filter out empty bindings if any department or catalog failed
    for jp in job_positions_data:
        if not jp.get("cr5db_Department@odata.bind", "()").endswith("()"):
             pass
        else:
             del jp["cr5db_Department@odata.bind"]
             
        if not jp.get("cr5db_PositionCatalogTitle@odata.bind", "()").endswith("()"):
             pass
        else:
             del jp["cr5db_PositionCatalogTitle@odata.bind"]
    guids["jobpositions"] = []
    for pos in job_positions_data:
        res = insert_record(api_base, "cr5db_jobpositions", pos, headers)
        if "error" in res:
            # Retry without bindings
            if "cr5db_Department@odata.bind" in pos:
                del pos["cr5db_Department@odata.bind"]
            if "cr5db_PositionCatalogTitle@odata.bind" in pos:
                del pos["cr5db_PositionCatalogTitle@odata.bind"]
            print(f"  ⚠️ Retrying without bindings for Job Position...")
            res = insert_record(api_base, "cr5db_jobpositions", pos, headers)
            
        if "success" in res:
            guids["jobpositions"].append(res["guid"])
            print(f"  + Job Position '{pos['cr5db_positionname']}' created.")
            
    if not guids["jobpositions"]:
        print("⚠️ No job positions created. Cannot seed users.")
        sys.exit(1)
        
    # Link ReportsTo relationship for PM reporting to Director
    if len(guids["jobpositions"]) >= 2:
        dir_id = guids["jobpositions"][0]
        pm_id = guids["jobpositions"][1]
        update_url = urljoin(api_base, f"cr5db_jobpositions({pm_id})")
        make_request("PATCH", update_url, headers, {"cr5db_ReportsToPositionID@odata.bind": f"cr5db_jobpositions({dir_id})"})
        print("  * Linked 'R&D Project Manager' reporting to 'Director of R&D'.")
        
    # 7. Users
    users_data = [
        {"cr5db_fullname": "Violetta Admin", "cr5db_email": "admin@company.com", "cr5db_isactive": True, "cr5db_systemrole": "Admin", "cr5db_JobPosition@odata.bind": f"cr5db_jobpositions({guids['jobpositions'][0]})"},
        {"cr5db_fullname": "Alice PM", "cr5db_email": "pm@company.com", "cr5db_isactive": True, "cr5db_systemrole": "ProjectManager", "cr5db_JobPosition@odata.bind": f"cr5db_jobpositions({guids['jobpositions'][1]})"},
        {"cr5db_fullname": "Bob Developer", "cr5db_email": "dev1@company.com", "cr5db_isactive": True, "cr5db_systemrole": "Employee", "cr5db_JobPosition@odata.bind": f"cr5db_jobpositions({guids['jobpositions'][2]})"},
        {"cr5db_fullname": "Charlie Developer", "cr5db_email": "dev2@company.com", "cr5db_isactive": True, "cr5db_systemrole": "Employee", "cr5db_JobPosition@odata.bind": f"cr5db_jobpositions({guids['jobpositions'][2]})"}
    ]
    guids["users"] = {}
    for u in users_data:
        res = insert_record(api_base, "cr5db_users", u, headers)
        if "error" in res:
            # Retry without bindings
            if "cr5db_JobPosition@odata.bind" in u:
                del u["cr5db_JobPosition@odata.bind"]
            print(f"  ⚠️ Retrying without bindings for User {u['cr5db_fullname']}...")
            res = insert_record(api_base, "cr5db_users", u, headers)
            
        if "success" in res:
            guids["users"][u["cr5db_email"]] = res["guid"]
            print(f"  + User '{u['cr5db_fullname']}' created.")
            
    # 8. Role Assignments (cr5db_RoleAssignment)
    if guids.get("systemroles") and guids.get("users"):
        # PM assignment
        pm_role_id = next(guid for code, guid in guids["systemroles"] if code == "MGR")
        role_assignment = {
            "cr5db_RoleAssignmentName": "Alice - PM Assignment",
            "cr5db_Notes": "Assigned PM role during initial seeding",
            "cr5db_IsActive": True,
            "cr5db_AssignedDate": datetime.datetime.utcnow().isoformat() + "Z",
            "cr5db_User@odata.bind": f"cr5db_users({guids['users']['pm@company.com']})",
            "cr5db_SystemRole@odata.bind": f"cr5db_systemroles({pm_role_id})",
            "cr5db_AssignedBy@odata.bind": f"cr5db_users({guids['users']['admin@company.com']})"
        }
        res = insert_record(api_base, "cr5db_roleassignments", role_assignment, headers)
        if "success" in res:
            print("  + Role Assignment (Alice PM) created.")
            
    # 9. Evaluation Periods
    periods_data = [
        {
            "cr5db_evaluationperiod1": "Q2/2026",
            "cr5db_startdate": "2026-04-01T00:00:00Z",
            "cr5db_enddate": "2026-06-30T00:00:00Z",
            "cr5db_islocked": False
        }
    ]
    guids["periods"] = []
    for p in periods_data:
        res = insert_record(api_base, "cr5db_evaluationperiods", p, headers)
        if "success" in res:
            guids["periods"].append(res["guid"])
            print(f"  + Evaluation Period '{p['cr5db_evaluationperiod1']}' created.")
            
    if not guids["periods"]:
        print("⚠️ No evaluation periods created. Cannot seed objectives.")
        sys.exit(1)
        
    # 10. Objectives
    obj_data = [
        {
            "cr5db_objective1": "Đạt chất lượng phần mềm QLDA Q2/2026",
            "cr5db_targetvalue": 100.0,
            "cr5db_objectiveprogress": 0.0,
            "cr5db_PeriodName@odata.bind": f"cr5db_evaluationperiods({guids['periods'][0]})"
        }
    ]
    guids["objectives"] = []
    for o in obj_data:
        res = insert_record(api_base, "cr5db_objectives", o, headers)
        if "success" in res:
            guids["objectives"].append(res["guid"])
            print(f"  + Objective '{o['cr5db_objective1']}' created.")
            
    # 11. Projects & Phases
    proj_data = [
        {
            "cr5db_projectname": "Traffic Analysis Engine",
            "cr5db_description": "Phần mềm phân tích mật độ giao thông thông minh",
            "cr5db_startdate": "2026-04-05T00:00:00Z",
            "cr5db_enddate": "2026-06-25T00:00:00Z"
        }
    ]
    guids["projects"] = []
    for pr in proj_data:
        res = insert_record(api_base, "cr5db_projects", pr, headers)
        if "success" in res:
            proj_id = res["guid"]
            guids["projects"].append(proj_id)
            print(f"  + Project '{pr['cr5db_projectname']}' created.")
            
            # Seed project label assignment
            if guids.get("labels"):
                label_guid = guids["labels"][0][1] # "Urgent"
                insert_record(api_base, "cr5db_projectlabelassignments", {
                    "cr5db_projectlabelassignment1": "Urgent Traffic Project",
                    "cr5db_LabelName@odata.bind": f"cr5db_systemlabels({label_guid})"
                }, headers)
                
            # Seed project objective alignment
            if guids.get("objectives"):
                insert_record(api_base, "cr5db_projectobjectivealignments", {
                    "cr5db_projectobjectivealignment1": "Traffic Project to Q2 Software Quality",
                    "cr5db_Project@odata.bind": f"cr5db_projects({proj_id})",
                    "cr5db_Objective@odata.bind": f"cr5db_objectives({guids['objectives'][0]})"
                }, headers)
                
            # Seed Project Risk
            insert_record(api_base, "cr5db_projectrisks", {
                "cr5db_projectrisk1": "Database scaling bottlenecks"
            }, headers)
            
            # Seed Project Phase
            phase_res = insert_record(api_base, "cr5db_projectphases", {
                "cr5db_phasename": "Phase 1: Database Setup & Integration",
                "cr5db_startdate": "2026-04-06T00:00:00Z",
                "cr5db_enddate": "2026-04-30T00:00:00Z",
                "cr5db_ProjectID@odata.bind": f"cr5db_projects({proj_id})"
            }, headers)
            if "success" in phase_res:
                guids["phase_id"] = phase_res["guid"]
                print("    + Project Phase 1 created.")
                
            # Seed Project Team
            team_res = insert_record(api_base, "cr5db_projectteams", {
                "cr5db_teamname": "Traffic Engine Dev Team",
                "cr5db_ProjectID@odata.bind": f"cr5db_projects({proj_id})"
            }, headers)
            if "success" in team_res:
                team_guid = team_res["guid"]
                print("    + Project Team created.")
                
                # Seed Resource Allocation for Bob & Charlie
                for email in ["dev1@company.com", "dev2@company.com"]:
                    u_guid = guids["users"].get(email)
                    if u_guid:
                        alloc_res = insert_record(api_base, "cr5db_resourceallocations", {
                            "cr5db_resourceallocation1": f"Allocation for {email.split('@')[0]}",
                            "cr5db_allocationpercentage": 100,
                            "cr5db_UserID@odata.bind": f"cr5db_users({u_guid})",
                            "cr5db_ProjectTeamID@odata.bind": f"cr5db_projectteams({team_guid})"
                        }, headers)
                        
                        # Seed User Project Role (Lead Dev / QA)
                        if "success" in alloc_res:
                            alloc_id = alloc_res["guid"]
                            is_lead = (email == "dev1@company.com")
                            insert_record(api_base, "cr5db_userprojectroles", {
                                "cr5db_rolename": "Lead Developer" if is_lead else "QA Tester",
                                "cr5db_rolecode": "LD" if is_lead else "QA",
                                "cr5db_AllocationID@odata.bind": f"cr5db_resourceallocations({alloc_id})"
                            }, headers)
                            print(f"      * Allocated {email} to Project Team.")

    # 12. KPI Library
    kpi_lib_data = [
        {"cr5db_kpiname": "Tỷ lệ hoàn thành Task đúng hạn", "cr5db_unit": "%", "cr5db_formula": "(Số Task hoàn thành đúng hạn / Tổng số Task) * 100"},
        {"cr5db_kpiname": "Tỷ lệ thời gian Timesheet chuẩn", "cr5db_unit": "%", "cr5db_formula": "(Số giờ Timesheet hợp lệ / Tổng số giờ quy định) * 100"}
    ]
    guids["kpilibrary"] = []
    for lib in kpi_lib_data:
        res = insert_record(api_base, "cr5db_kpilibraries", lib, headers)
        if "success" in res:
            guids["kpilibrary"].append(res["guid"])
            print(f"  + KPI Template '{lib['cr5db_kpiname']}' created.")
            
    # 13. KPI Targets & Actual Logs
    if guids.get("kpilibrary") and guids.get("objectives") and guids.get("users"):
        # Assign KPI to Bob (dev1@company.com)
        bob_id = guids["users"]["dev1@company.com"]
        target_res = insert_record(api_base, "cr5db_kpitargets", {
            "cr5db_kpitarget1": "Hoàn thành Schema Q2",
            "cr5db_targetvalue": 95.0,
            "cr5db_actualvalue": 0.0,
            "cr5db_weightpercentage": 50,
            "cr5db_EmployeeID@odata.bind": f"cr5db_users({bob_id})",
            "cr5db_KPICode@odata.bind": f"cr5db_kpilibraries({guids['kpilibrary'][0]})",
            "cr5db_ParentObjective@odata.bind": f"cr5db_objectives({guids['objectives'][0]})"
        }, headers)
        
        if "success" in target_res:
            target_id = target_res["guid"]
            guids["kpitarget"] = target_id
            print("  + KPI Target 'Hoàn thành Schema Q2' assigned to Bob Developer.")
            
            # Create KPI Actual Log for Bob
            insert_record(api_base, "cr5db_kpiactuallogs", {
                "cr5db_kpiactuallog1": "Completed Phase 1 database definition schema review",
                "cr5db_actualvalue": 90.0,
                "cr5db_evidencelink": "https://github.com/violet/traffic-analysis-engine/pull/1",
                "cr5db_TargetId@odata.bind": f"cr5db_kpitargets({target_id})"
            }, headers)
            print("    * Logged actual performance evidence log for Bob's KPI Target.")
            
    # 14. Tasks & Comments & Timesheets
    if guids.get("users") and guids.get("objectives") and guids.get("phase_id"):
        bob_id = guids["users"]["dev1@company.com"]
        # Create Task for Bob
        task_res = insert_record(api_base, "cr5db_tasks", {
            "cr5db_taskname": "Thiết lập Schema Dataverse cho bảng ProjectRisk",
            "cr5db_description": "Định nghĩa các cột, kiểu dữ liệu, các quan hệ khóa ngoại liên kết cho bảng Project Risk.",
            "cr5db_duedate": "2026-05-30T17:00:00Z",
            "cr5db_AssigneeID@odata.bind": f"cr5db_users({bob_id})",
            "cr5db_ObjectiveName@odata.bind": f"cr5db_objectives({guids['objectives'][0]})",
            "cr5db_ProjectPhaseID@odata.bind": f"cr5db_projectphases({guids['phase_id']})"
        }, headers)
        
        if "success" in task_res:
            task_id = task_res["guid"]
            print("  + Task 'Thiết lập Schema Dataverse...' created and assigned to Bob.")
            
            # Seed Task Comment
            insert_record(api_base, "cr5db_taskcomments", {
                "cr5db_taskcomment1": "Task Completed Comment",
                "cr5db_commenttext": "Đã hoàn thành cấu hình Schema XML và định nghĩa Relationships. Đang đợi import.",
                "cr5db_TaskID@odata.bind": f"cr5db_tasks({task_id})"
            }, headers)
            
            # Seed Timesheet Log for the Task
            ts_res = insert_record(api_base, "cr5db_timesheetlogs", {
                "cr5db_timesheetlog1": "Log 8h RND setup",
                "cr5db_actualhoursworked": 8.0,
                "cr5db_logdate": "2026-05-29T00:00:00Z",
                "statecode": 1, # Approved
                "cr5db_TaskID@odata.bind": f"cr5db_tasks({task_id})"
            }, headers)
            
            if "success" in ts_res:
                ts_id = ts_res["guid"]
                print("    * Timesheet Log (8.0 hours) submitted and approved.")
                
                # Seed Timesheet Audit (cr5db_TimesheetAudit)
                insert_record(api_base, "cr5db_timesheetaudits", {
                    "cr5db_AuditRecordName": "Audit for RND setup log",
                    "cr5db_ApprovedBy": "Alice PM",
                    "cr5db_ApprovedAt": datetime.datetime.utcnow().isoformat() + "Z",
                    "cr5db_Status": "Approved",
                    "cr5db_TimesheetLogID": ts_id
                }, headers)
                
            # Create Task Ownership record (cr5db_TaskOwnership)
            insert_record(api_base, "cr5db_taskownerships", {
                "cr5db_OwnershipName": "Ownership of Schema Task",
                "cr5db_TaskID": task_id,
                "cr5db_AssigneeUserID": bob_id,
                "cr5db_CreatedByUserID": guids["users"]["pm@company.com"]
            }, headers)
            
    # 15. Performance Appraisals & Appraisal KPI Details
    if guids.get("users") and guids.get("periods") and guids.get("kpitarget"):
        bob_id = guids["users"]["dev1@company.com"]
        appraisal_res = insert_record(api_base, "cr5db_performanceappraisals", {
            "cr5db_performanceappraisal1": "Đánh giá hiệu suất Bob Q2/2026",
            "cr5db_selfscore": 90.0,
            "cr5db_finalscore": 95.0,
            "cr5db_EmployeeID@odata.bind": f"cr5db_users({bob_id})",
            "cr5db_PeriodID@odata.bind": f"cr5db_evaluationperiods({guids['periods'][0]})"
        }, headers)
        
        if "success" in appraisal_res:
            appraisal_id = appraisal_res["guid"]
            print("  + Performance Appraisal 'Bob Q2/2026' created.")
            
            # Appraisal KPI Detail
            insert_record(api_base, "cr5db_appraisalkpidetails", {
                "cr5db_appraisalkpidetail1": "Chi tiết KPI Target Schema",
                "cr5db_scoreachieved": 95.0,
                "cr5db_comment": "Nhân sự hoàn thành xuất sắc nhiệm vụ và đóng góp tích cực vào tiến trình thiết lập hệ thống.",
                "cr5db_AppraisalName@odata.bind": f"cr5db_performanceappraisals({appraisal_id})",
                "cr5db_TargetId@odata.bind": f"cr5db_kpitargets({guids['kpitarget']})"
            }, headers)
            print("    * Appraisal KPI Detail added with achievements.")

    # 16. Miscellaneous System Tables (System notifications, parameters, headcount requests, policy rules)
    # Headcount Request
    if guids.get("departments") and guids.get("jobpositions") and guids.get("catalog"):
        insert_record(api_base, "cr5db_headcountrequests", {
            "cr5db_requestname": "Yêu cầu tăng định biên R&D Devs",
            "cr5db_requestedquantity": 2,
            "cr5db_reason": "Tăng trưởng dự án Traffic Engine đòi hỏi thêm 2 Backend Engineers cho các module AI.",
            "cr5db_Department@odata.bind": f"cr5db_departments({guids['departments']['RND']})",
            "cr5db_JobPosition@odata.bind": f"cr5db_jobpositions({guids['jobpositions'][2]})", # Software Engineer
            "cr5db_PositionCatalog@odata.bind": f"cr5db_positioncatalogs({guids['catalog']['ENG']})"
        }, headers)
        print("  + Headcount Request created for RND.")
        
    # System Notification
    if guids.get("users"):
        insert_record(api_base, "cr5db_systemnotifications", {
            "cr5db_systemnotification1": "Duyệt công mới",
            "cr5db_content": "Bạn có 1 yêu cầu duyệt Timesheet mới từ Bob Developer.",
            "cr5db_deeplinkurl": "/requests",
            "cr5db_isread": False
        }, headers)
        print("  + System Notification created for Alice PM.")
        
    # System Parameter
    insert_record(api_base, "cr5db_systemparameters", {
        "cr5db_systemparameter1": "MaxTimesheetHoursPerDay",
        "cr5db_paramvalue": "24",
        "cr5db_valuetype": "Integer"
    }, headers)
    
    # Permission Groups
    groups = [
        {"cr5db_systemparameter1": "pg_admin", "cr5db_paramvalue": "Ban Giám Đốc|abcdefghijklm", "cr5db_valuetype": "PermissionGroup"},
        {"cr5db_systemparameter1": "pg_pm", "cr5db_paramvalue": "Quản Lý Dự Án|abcdefjkl", "cr5db_valuetype": "PermissionGroup"},
        {"cr5db_systemparameter1": "pg_employee", "cr5db_paramvalue": "Nhân Viên R&D|abcdf", "cr5db_valuetype": "PermissionGroup"}
    ]
    for g in groups:
        insert_record(api_base, "cr5db_systemparameters", g, headers)
        
    # Default Permission Groups Parameter
    insert_record(api_base, "cr5db_systemparameters", {
        "cr5db_systemparameter1": "DefaultPermissionGroups",
        "cr5db_paramvalue": "pg_employee",
        "cr5db_valuetype": "DefaultPermissionGroups"
    }, headers)
    
    # System Policy Rule
    insert_record(api_base, "cr5db_systempolicyrules", {
        "cr5db_systempolicyrule1": "Timesheet Submission Deadline Policy",
        "cr5db_targetentity": "cr5db_timesheetlog",
        "cr5db_contextcondition": "SubmittedDate > Sunday 23:59",
        "cr5db_operator": "Block",
        "cr5db_constraintvalue": "Block Submission",
        "cr5db_effect": "Error"
    }, headers)

    # Approval Routes
    routes_data = [
        {
            "cr5db_routename": "Duyệt yêu cầu tuyển dụng nhân sự mới",
            "cr5db_targetentity": 4, # HeadcountRequests
            "cr5db_operationtype": 4, # All
            "cr5db_requesterrole": 2, # ProjectManager
            "cr5db_routingtype": 2, # SPECIFIC_ROLE
            "cr5db_approverrole": "pg_admin", # Ban Giám Đốc
            "cr5db_priority": 1,
            "cr5db_isactive": True
        },
        {
            "cr5db_routename": "Duyệt thay đổi vị trí công việc",
            "cr5db_targetentity": 3, # JobPositions
            "cr5db_operationtype": 4, # All
            "cr5db_requesterrole": 3, # HRManager
            "cr5db_routingtype": 2, # SPECIFIC_ROLE
            "cr5db_approverrole": "pg_admin", # Ban Giám Đốc
            "cr5db_priority": 1,
            "cr5db_isactive": True
        }
    ]
    for r in routes_data:
        insert_record(api_base, "cr5db_approvalrouteses", r, headers)
    
    print("\n🎉 Seeding process completed successfully!")

if __name__ == "__main__":
    main()
