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
            
    # 3. System Roles
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
            
    # 4. Evaluation Periods
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

    # 6. Holidays
    holidays_data = [
        {"cr5db_name": "Tết Dương Lịch 2026", "cr5db_date": "2026-01-01T00:00:00Z"},
        {"cr5db_name": "Giỗ tổ Hùng Vương 2026", "cr5db_date": "2026-04-26T00:00:00Z"},
        {"cr5db_name": "Nghỉ bù Giỗ tổ", "cr5db_date": "2026-04-27T00:00:00Z"},
        {"cr5db_name": "Ngày Giải phóng miền Nam", "cr5db_date": "2026-04-30T00:00:00Z"},
        {"cr5db_name": "Quốc tế Lao động", "cr5db_date": "2026-05-01T00:00:00Z"}
    ]
    for h in holidays_data:
        res = insert_record(api_base, "cr5db_holidaies", h, headers)
        if "success" in res:
            print(f"  + Holiday '{h['cr5db_name']}' created.")

    # 7. Process Templates (Onboarding/Offboarding)
    onboarding_template_res = insert_record(api_base, "new_processtemplates", {
        "new_name": "Quy trình Onboarding Kỹ sư phần mềm FSoft",
        "new_type": "Onboarding"
    }, headers)
    
    offboarding_template_res = insert_record(api_base, "new_processtemplates", {
        "new_name": "Quy trình Offboarding Kỹ sư phần mềm FSoft",
        "new_type": "Offboarding"
    }, headers)

    guids["templates"] = {}
    if "success" in onboarding_template_res:
        guids["templates"]["Onboarding"] = onboarding_template_res["guid"]
        print("  + Process Template 'Onboarding' created.")
    if "success" in offboarding_template_res:
        guids["templates"]["Offboarding"] = offboarding_template_res["guid"]
        print("  + Process Template 'Offboarding' created.")

    # 8. Competency Catalog
    competency_catalog_data = [
        {"new_competencyname": "Lập trình React & TypeScript", "new_competencytype": "Functional", "new_description": "Khả năng xây dựng ứng dụng web SPA sử dụng React và TypeScript.", "new_maxlevel": 5},
        {"new_competencyname": "Quản trị cơ sở dữ liệu Dataverse", "new_competencytype": "Technical", "new_description": "Định nghĩa bảng, quan hệ, và truy vấn OData trong Dataverse.", "new_maxlevel": 5},
        {"new_competencyname": "Tích hợp mô hình AI & Prompt Engineering", "new_competencytype": "AI/Advanced", "new_description": "Xây dựng các giải pháp tích hợp AI (Google Gemini, Groq) và tối ưu Prompt.", "new_maxlevel": 5}
    ]
    guids["competencies"] = []
    for comp in competency_catalog_data:
        res = insert_record(api_base, "new_competencycatalogs", comp, headers)
        if "success" in res:
            guids["competencies"].append((comp["new_competencyname"], res["guid"]))
            print(f"  + Competency Catalog '{comp['new_competencyname']}' created.")

    # 9. Bonus Matrix
    bonus_matrix_data = [
        {"new_minscore": 90.0, "new_maxscore": 100.0, "new_multiplier": 1.5},
        {"new_minscore": 75.0, "new_maxscore": 89.9, "new_multiplier": 1.2},
        {"new_minscore": 60.0, "new_maxscore": 74.9, "new_multiplier": 1.0},
        {"new_minscore": 0.0, "new_maxscore": 59.9, "new_multiplier": 0.0}
    ]
    for bm in bonus_matrix_data:
        res = insert_record(api_base, "new_bonusmatrixes", bm, headers)
        if "success" in res:
            print(f"  + Bonus Matrix Rule (x{bm['new_multiplier']}) created.")

    # ==========================================
    # LEVEL 2: LINKED DEFINITIONS
    # ==========================================
    
    # 10. Departments
    dept_data = [
        {"cr5db_departmentcode": "RND", "cr5db_departmentname": "FSoft Software Product R&D", "cr5db_CompanyID@odata.bind": f"cr5db_companies({guids['companies'][0]})"},
        {"cr5db_departmentcode": "HRD", "cr5db_departmentname": "Human Resources Department", "cr5db_CompanyID@odata.bind": f"cr5db_companies({guids['companies'][0]})"},
        {"cr5db_departmentcode": "ITD", "cr5db_departmentname": "IT Infrastructure Support", "cr5db_CompanyID@odata.bind": f"cr5db_companies({guids['companies'][0]})"}
    ]
    guids["departments"] = {}
    for d in dept_data:
        res = insert_record(api_base, "cr5db_departments", d, headers)
        if "success" in res:
            guids["departments"][d["cr5db_departmentcode"]] = res["guid"]
            print(f"  + Department '{d['cr5db_departmentcode']}' created.")

    # 11. Job Positions
    job_positions_data = [
        {
            "cr5db_positionname": "Director of Software Product R&D",
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
            "cr5db_Department@odata.bind": f"cr5db_departments({guids['departments'].get('HRD', '')})",
            "cr5db_PositionCatalogTitle@odata.bind": f"cr5db_positioncatalogs({guids['catalog'].get('HR', '')})"
        }
    ]
    guids["jobpositions"] = []
    for pos in job_positions_data:
        res = insert_record(api_base, "cr5db_jobpositions", pos, headers)
        if "success" in res:
            guids["jobpositions"].append(res["guid"])
            print(f"  + Job Position '{pos['cr5db_positionname']}' created.")

    # Link PM reporting to Director
    if len(guids["jobpositions"]) >= 2:
        dir_id = guids["jobpositions"][0]
        pm_id = guids["jobpositions"][1]
        update_url = urljoin(api_base, f"cr5db_jobpositions({pm_id})")
        make_request("PATCH", update_url, headers, {"cr5db_ReportsToPositionID@odata.bind": f"cr5db_jobpositions({dir_id})"})
        print("  * Linked 'R&D Project Manager' reporting to 'Director of Software Product R&D'.")

    # 12. Process Template Steps
    if guids["templates"].get("Onboarding") and guids["departments"].get("ITD") and guids["departments"].get("HRD"):
        onb_tpl_id = guids["templates"]["Onboarding"]
        steps = [
            {"new_name": "Chuẩn bị chỗ ngồi & Cấp phát Laptop", "new_order": 1, "new_assigneerole": "IT", "new_AssignedDepartment@odata.bind": f"cr5db_departments({guids['departments']['ITD']})"},
            {"new_name": "Ký Hợp đồng thử việc & Khai báo thuế", "new_order": 2, "new_assigneerole": "HR", "new_AssignedDepartment@odata.bind": f"cr5db_departments({guids['departments']['HRD']})"},
            {"new_name": "Tham gia khóa học đào tạo hội nhập FSoft", "new_order": 3, "new_assigneerole": "HR", "new_AssignedDepartment@odata.bind": f"cr5db_departments({guids['departments']['HRD']})"},
            {"new_name": "Giới thiệu đội nhóm R&D và Dự án", "new_order": 4, "new_assigneerole": "Manager"},
            {"new_name": "Hoàn tất cấu hình môi trường code nội bộ", "new_order": 5, "new_assigneerole": "Employee"}
        ]
        for step in steps:
            step["new_ProcessTemplate@odata.bind"] = f"new_processtemplates({onb_tpl_id})"
            res = insert_record(api_base, "new_processtemplatesteps", step, headers)
            if "success" in res:
                print(f"    * Onboarding Step '{step['new_name']}' created.")

    # 13. Job Competencies (Weights)
    if guids["competencies"] and len(guids["jobpositions"]) >= 3:
        eng_pos_id = guids["jobpositions"][2] # Senior Software Engineer
        job_comps = [
            {"new_requiredlevel": 4, "new_weight": 40, "new_Competency@odata.bind": f"new_competencycatalogs({guids['competencies'][0][1]})"}, # React
            {"new_requiredlevel": 4, "new_weight": 30, "new_Competency@odata.bind": f"new_competencycatalogs({guids['competencies'][1][1]})"}, # Dataverse
            {"new_requiredlevel": 3, "new_weight": 30, "new_Competency@odata.bind": f"new_competencycatalogs({guids['competencies'][2][1]})"}  # AI
        ]
        for jc in job_comps:
            jc["new_JobPosition@odata.bind"] = f"cr5db_jobpositions({eng_pos_id})"
            res = insert_record(api_base, "new_jobcompetencies", jc, headers)
            if "success" in res:
                print(f"    * Job Competency requirement created for Engineer position.")

    # ==========================================
    # LEVEL 3: WORKFORCE SEEDING
    # ==========================================
    
    # 14. Users
    users_data = [
        {"cr5db_fullname": "Violetta Admin", "cr5db_email": "admin@fpt.com", "cr5db_isactive": True, "cr5db_systemrole": "Admin", "cr5db_JobPosition@odata.bind": f"cr5db_jobpositions({guids['jobpositions'][0]})"},
        {"cr5db_fullname": "Alice PM", "cr5db_email": "pm@fpt.com", "cr5db_isactive": True, "cr5db_systemrole": "ProjectManager", "cr5db_JobPosition@odata.bind": f"cr5db_jobpositions({guids['jobpositions'][1]})"},
        {"cr5db_fullname": "Bob Developer", "cr5db_email": "dev1@fpt.com", "cr5db_isactive": True, "cr5db_systemrole": "Employee", "cr5db_JobPosition@odata.bind": f"cr5db_jobpositions({guids['jobpositions'][2]})"},
        {"cr5db_fullname": "Charlie Developer", "cr5db_email": "dev2@fpt.com", "cr5db_isactive": True, "cr5db_systemrole": "Employee", "cr5db_JobPosition@odata.bind": f"cr5db_jobpositions({guids['jobpositions'][2]})"}
    ]
    guids["users"] = {}
    for u in users_data:
        res = insert_record(api_base, "cr5db_users", u, headers)
        if "success" in res:
            guids["users"][u["cr5db_email"]] = res["guid"]
            print(f"  + User '{u['cr5db_fullname']}' created.")

    # 15. Role Assignments
    if guids.get("systemroles") and guids.get("users"):
        pm_role_id = next(guid for code, guid in guids["systemroles"] if code == "MGR")
        role_assignment = {
            "cr5db_RoleAssignmentName": "Alice - FSoft PM Assignment",
            "cr5db_Notes": "Assigned PM role during FPT Software seeding",
            "cr5db_IsActive": True,
            "cr5db_AssignedDate": datetime.datetime.utcnow().isoformat() + "Z",
            "cr5db_User@odata.bind": f"cr5db_users({guids['users']['pm@fpt.com']})",
            "cr5db_SystemRole@odata.bind": f"cr5db_systemroles({pm_role_id})",
            "cr5db_AssignedBy@odata.bind": f"cr5db_users({guids['users']['admin@fpt.com']})"
        }
        res = insert_record(api_base, "cr5db_roleassignments", role_assignment, headers)
        if "success" in res:
            print("  + Role Assignment (Alice PM) created.")

    # ==========================================
    # LEVEL 4: WORK CONTAINERS (MASTER TRANSACTIONAL)
    # ==========================================
    
    # 16. Projects
    proj_data = [
        {
            "cr5db_projectname": "FPT Smart Traffic Engine",
            "cr5db_description": "Hệ thống phân tích và tối ưu hóa mật độ giao thông thông minh sử dụng AI của FPT.",
            "cr5db_startdate": "2026-04-05T00:00:00Z",
            "cr5db_enddate": "2026-06-25T00:00:00Z"
        }
    ]
    guids["projects"] = []
    for pr in proj_data:
        res = insert_record(api_base, "cr5db_projects", pr, headers)
        if "success" in res:
            guids["projects"].append(res["guid"])
            print(f"  + Project '{pr['cr5db_projectname']}' created.")

    # Project Label Assignment
    if guids.get("projects") and guids.get("labels"):
        proj_id = guids["projects"][0]
        label_guid = guids["labels"][0][1] # "Urgent"
        insert_record(api_base, "cr5db_projectlabelassignments", {
            "cr5db_projectlabelassignment1": "FSoft Traffic Project - Urgent",
            "cr5db_LabelName@odata.bind": f"cr5db_systemlabels({label_guid})"
        }, headers)

    # 17. Objectives
    obj_data = [
        {
            "cr5db_objective1": "Nâng cao chất lượng phần mềm QLDA Q2/2026",
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

    # Project Objective Alignment
    if guids.get("projects") and guids.get("objectives"):
        insert_record(api_base, "cr5db_projectobjectivealignments", {
            "cr5db_projectobjectivealignment1": "FSoft Smart Traffic to Q2 Software Quality",
            "cr5db_Project@odata.bind": f"cr5db_projects({guids['projects'][0]})",
            "cr5db_Objective@odata.bind": f"cr5db_objectives({guids['objectives'][0]})"
        }, headers)

    # Project Risk
    if guids.get("projects"):
        insert_record(api_base, "cr5db_projectrisks", {
            "cr5db_projectrisk1": "Database scaling bottlenecks on high volume traffic logs",
            "cr5db_impact": "High",
            "cr5db_probability": "Medium",
            "new_mitigationplan": "Implement horizontal partitioning on PostgreSQL",
            "new_Project@odata.bind": f"cr5db_projects({guids['projects'][0]})"
        }, headers)

    # 18. Leave Balances
    if guids.get("users"):
        for email, u_guid in guids["users"].items():
            res = insert_record(api_base, "new_leavebalances", {
                "new_name": f"Quỹ phép 2026 - {email.split('@')[0]}",
                "new_year": 2026,
                "new_totalentitlement": 12.0,
                "new_carriedover": 2.0,
                "new_useddays": 0.0,
                "new_Employee@odata.bind": f"cr5db_users({u_guid})"
            }, headers)
            if "success" in res:
                print(f"  + Leave Balance for '{email}' created.")

    # 19. Individual Development Plans (IDP)
    guids["idps"] = {}
    if guids.get("users"):
        # Bob IDP
        bob_uid = guids["users"]["dev1@fpt.com"]
        res_bob = insert_record(api_base, "new_idps", {
            "new_idpname": "IDP 2026 - Bob Developer",
            "new_status": "Bản nháp",
            "new_Employee@odata.bind": f"cr5db_users({bob_uid})"
        }, headers)
        if "success" in res_bob:
            guids["idps"]["dev1@fpt.com"] = res_bob["guid"]
            print("  + Bob IDP created.")

        # Charlie IDP
        charlie_uid = guids["users"]["dev2@fpt.com"]
        res_charlie = insert_record(api_base, "new_idps", {
            "new_idpname": "IDP 2026 - Charlie Developer",
            "new_status": "Đang thực hiện",
            "new_Employee@odata.bind": f"cr5db_users({charlie_uid})"
        }, headers)
        if "success" in res_charlie:
            guids["idps"]["dev2@fpt.com"] = res_charlie["guid"]
            print("  + Charlie IDP created.")

    # ==========================================
    # LEVEL 5: ACTIONS & ITEMS (TRANSACTIONAL OPERATIONAL)
    # ==========================================
    
    # 20. Project Phases
    if guids.get("projects"):
        proj_id = guids["projects"][0]
        phase_res = insert_record(api_base, "cr5db_projectphases", {
            "cr5db_phasename": "Phase 1: Database Setup & Core Integration",
            "cr5db_startdate": "2026-04-06T00:00:00Z",
            "cr5db_enddate": "2026-04-30T00:00:00Z",
            "cr5db_ProjectID@odata.bind": f"cr5db_projects({proj_id})"
        }, headers)
        if "success" in phase_res:
            guids["phase_id"] = phase_res["guid"]
            print("  + Project Phase 1 created.")

    # 21. Project Teams & Resource Allocations (Bob vs Charlie Burnout)
    if guids.get("projects") and guids.get("users"):
        proj_id = guids["projects"][0]
        team_res = insert_record(api_base, "cr5db_projectteams", {
            "cr5db_teamname": "FPT Smart Traffic Dev Team",
            "cr5db_ProjectID@odata.bind": f"cr5db_projects({proj_id})"
        }, headers)
        if "success" in team_res:
            team_guid = team_res["guid"]
            print("  + Project Team created.")
            
            # Seed resource allocations
            # Bob (100% - Normal Case)
            bob_uid = guids["users"]["dev1@fpt.com"]
            bob_alloc_res = insert_record(api_base, "cr5db_resourceallocations", {
                "cr5db_resourceallocation1": "Bob Allocation (100%)",
                "cr5db_allocationpercentage": 100,
                "cr5db_UserID@odata.bind": f"cr5db_users({bob_uid})",
                "cr5db_ProjectTeamID@odata.bind": f"cr5db_projectteams({team_guid})"
            }, headers)
            if "success" in bob_alloc_res:
                insert_record(api_base, "cr5db_userprojectroles", {
                    "cr5db_rolename": "Lead Software Engineer",
                    "cr5db_rolecode": "LD",
                    "cr5db_AllocationID@odata.bind": f"cr5db_resourceallocations({bob_alloc_res['guid']})"
                }, headers)
                print("    * Allocated Bob Developer at 100%.")

            # Charlie (150% - Overloaded/Burnout Case)
            charlie_uid = guids["users"]["dev2@fpt.com"]
            charlie_alloc_res = insert_record(api_base, "cr5db_resourceallocations", {
                "cr5db_resourceallocation1": "Charlie Allocation (150% Overloaded)",
                "cr5db_allocationpercentage": 150,
                "cr5db_UserID@odata.bind": f"cr5db_users({charlie_uid})",
                "cr5db_ProjectTeamID@odata.bind": f"cr5db_projectteams({team_guid})"
            }, headers)
            if "success" in charlie_alloc_res:
                insert_record(api_base, "cr5db_userprojectroles", {
                    "cr5db_rolename": "Senior Developer",
                    "cr5db_rolecode": "SD",
                    "cr5db_AllocationID@odata.bind": f"cr5db_resourceallocations({charlie_alloc_res['guid']})"
                }, headers)
                print("    * Allocated Charlie Developer at 150% (Burnout Trigger).")

    # 22. KPI Library
    kpi_lib_data = [
        {"cr5db_kpiname": "Tỷ lệ hoàn thành Task đúng hạn", "cr5db_unit": "%", "cr5db_formula": "(Số Task hoàn thành đúng hạn / Tổng số Task) * 100", "new_direction": 1},
        {"cr5db_kpiname": "Tỷ lệ thời gian Timesheet chuẩn", "cr5db_unit": "%", "cr5db_formula": "(Số giờ Timesheet hợp lệ / Tổng số giờ quy định) * 100", "new_direction": 1}
    ]
    guids["kpilibrary"] = []
    for lib in kpi_lib_data:
        res = insert_record(api_base, "cr5db_kpilibraries", lib, headers)
        if "success" in res:
            guids["kpilibrary"].append(res["guid"])
            print(f"  + KPI Template '{lib['cr5db_kpiname']}' created.")

    # 23. KPI Targets & Actual Logs (Bob On-track vs Charlie Lagging)
    if guids.get("kpilibrary") and guids.get("objectives") and guids.get("users"):
        # Bob (target: 95, actual: 90)
        bob_id = guids["users"]["dev1@fpt.com"]
        bob_target = insert_record(api_base, "cr5db_kpitargets", {
            "cr5db_kpitarget1": "Hoàn thành Core API Integration",
            "cr5db_targetvalue": 95.0,
            "cr5db_actualvalue": 0.0,
            "cr5db_weightpercentage": 50,
            "cr5db_EmployeeID@odata.bind": f"cr5db_users({bob_id})",
            "cr5db_KPICode@odata.bind": f"cr5db_kpilibraries({guids['kpilibrary'][0]})",
            "cr5db_ParentObjective@odata.bind": f"cr5db_objectives({guids['objectives'][0]})"
        }, headers)
        if "success" in bob_target:
            guids["bob_target"] = bob_target["guid"]
            insert_record(api_base, "cr5db_kpiactuallogs", {
                "cr5db_kpiactuallog1": "Hoàn thành Schema & Core Endpoints",
                "cr5db_actualvalue": 90.0,
                "cr5db_evidencelink": "https://github.com/fpt/smart-traffic/pull/1",
                "cr5db_TargetId@odata.bind": f"cr5db_kpitargets({bob_target['guid']})"
            }, headers)
            print("  + KPI Target created for Bob Developer (90/95 - On Track).")

        # Charlie (target: 95, actual: 40 - Lag Alert)
        charlie_id = guids["users"]["dev2@fpt.com"]
        charlie_target = insert_record(api_base, "cr5db_kpitargets", {
            "cr5db_kpitarget1": "Thiết lập AI Model Schema",
            "cr5db_targetvalue": 95.0,
            "cr5db_actualvalue": 0.0,
            "cr5db_weightpercentage": 50,
            "cr5db_EmployeeID@odata.bind": f"cr5db_users({charlie_id})",
            "cr5db_KPICode@odata.bind": f"cr5db_kpilibraries({guids['kpilibrary'][0]})",
            "cr5db_ParentObjective@odata.bind": f"cr5db_objectives({guids['objectives'][0]})"
        }, headers)
        if "success" in charlie_target:
            guids["charlie_target"] = charlie_target["guid"]
            insert_record(api_base, "cr5db_kpiactuallogs", {
                "cr5db_kpiactuallog1": "Xây dựng AI model pipeline nháp",
                "cr5db_actualvalue": 40.0,
                "cr5db_evidencelink": "https://github.com/fpt/smart-traffic/pull/15",
                "cr5db_TargetId@odata.bind": f"cr5db_kpitargets({charlie_target['guid']})"
            }, headers)
            print("  + KPI Target created for Charlie Developer (40/95 - Lagging/High Risk Alert).")

    # 24. Performance Appraisals
    if guids.get("users") and guids.get("periods") and guids.get("bob_target") and guids.get("charlie_target"):
        # Bob (95 final - High Performance)
        bob_id = guids["users"]["dev1@fpt.com"]
        bob_appr = insert_record(api_base, "cr5db_performanceappraisals", {
            "cr5db_performanceappraisal1": "Đánh giá hiệu suất Bob Q2/2026",
            "cr5db_selfscore": 90.0,
            "cr5db_finalscore": 95.0,
            "cr5db_EmployeeID@odata.bind": f"cr5db_users({bob_id})",
            "cr5db_PeriodID@odata.bind": f"cr5db_evaluationperiods({guids['periods'][0]})"
        }, headers)
        if "success" in bob_appr:
            insert_record(api_base, "cr5db_appraisalkpidetails", {
                "cr5db_appraisalkpidetail1": "Đánh giá KPI Core API - Bob",
                "cr5db_scoreachieved": 95.0,
                "cr5db_comment": "Hoàn thành xuất sắc toàn bộ Core APIs trước thời hạn.",
                "cr5db_AppraisalName@odata.bind": f"cr5db_performanceappraisals({bob_appr['guid']})",
                "cr5db_TargetId@odata.bind": f"cr5db_kpitargets({guids['bob_target']})"
            }, headers)
            print("  + Appraisal created for Bob Developer (95).")

        # Charlie (55 final - Low Performance Alert)
        charlie_id = guids["users"]["dev2@fpt.com"]
        charlie_appr = insert_record(api_base, "cr5db_performanceappraisals", {
            "cr5db_performanceappraisal1": "Đánh giá hiệu suất Charlie Q2/2026",
            "cr5db_selfscore": 60.0,
            "cr5db_finalscore": 55.0,
            "cr5db_EmployeeID@odata.bind": f"cr5db_users({charlie_id})",
            "cr5db_PeriodID@odata.bind": f"cr5db_evaluationperiods({guids['periods'][0]})"
        }, headers)
        if "success" in charlie_appr:
            insert_record(api_base, "cr5db_appraisalkpidetails", {
                "cr5db_appraisalkpidetail1": "Đánh giá KPI AI Schema - Charlie",
                "cr5db_scoreachieved": 55.0,
                "cr5db_comment": "Tiến độ công việc chậm trễ nghiêm trọng và thường xuyên vắng mặt.",
                "cr5db_AppraisalName@odata.bind": f"cr5db_performanceappraisals({charlie_appr['guid']})",
                "cr5db_TargetId@odata.bind": f"cr5db_kpitargets({guids['charlie_target']})"
            }, headers)
            print("  + Appraisal created for Charlie Developer (55 - Low Score Alert).")

    # 25. Leave Requests (Charlie frequent leaves vs Bob normal)
    if guids.get("users"):
        # Bob (1 day sick leave)
        bob_id = guids["users"]["dev1@fpt.com"]
        insert_record(api_base, "new_leaverequests", {
            "new_name": "Đơn nghỉ bệnh Bob",
            "new_leavetype": "Sick Leave",
            "new_startdate": "2026-06-05T00:00:00Z",
            "new_enddate": "2026-06-05T23:59:59Z",
            "new_durationdays": 1.0,
            "new_reason": "Cảm cúm thông thường",
            "new_status": "Approved",
            "new_Employee@odata.bind": f"cr5db_users({bob_id})",
            "new_Approver@odata.bind": f"cr5db_users({guids['users']['pm@fpt.com']})"
        }, headers)

        # Charlie (2 sick leaves + 2 annual leaves = 4 leaves -> Frequent Leaves Alert)
        charlie_id = guids["users"]["dev2@fpt.com"]
        charlie_leaves = [
            {"new_name": "Nghỉ ốm Charlie đợt 1", "new_leavetype": "Sick Leave", "new_startdate": "2026-05-12T00:00:00Z", "new_enddate": "2026-05-13T23:59:59Z", "new_durationdays": 2.0, "new_reason": "Điều trị nha khoa"},
            {"new_name": "Nghỉ ốm Charlie đợt 2", "new_leavetype": "Sick Leave", "new_startdate": "2026-05-26T00:00:00Z", "new_enddate": "2026-05-26T23:59:59Z", "new_durationdays": 1.0, "new_reason": "Sốt cao siêu vi"},
            {"new_name": "Nghỉ phép năm đợt 1", "new_leavetype": "Annual Leave", "new_startdate": "2026-06-02T00:00:00Z", "new_enddate": "2026-06-02T23:59:59Z", "new_durationdays": 1.0, "new_reason": "Giải quyết việc cá nhân"},
            {"new_name": "Nghỉ phép năm đợt 2", "new_leavetype": "Annual Leave", "new_startdate": "2026-06-16T00:00:00Z", "new_enddate": "2026-06-16T23:59:59Z", "new_durationdays": 1.0, "new_reason": "Gia đình có việc khẩn"}
        ]
        for cl in charlie_leaves:
            cl["new_status"] = "Approved"
            cl["new_Employee@odata.bind"] = f"cr5db_users({charlie_id})"
            cl["new_Approver@odata.bind"] = f"cr5db_users({guids['users']['pm@fpt.com']})"
            insert_record(api_base, "new_leaverequests", cl, headers)
        print("  + Leave Requests created (Bob: 1, Charlie: 4 - Leave Pattern Trigger).")

    # 26. Overtime Requests
    if guids.get("users"):
        bob_id = guids["users"]["dev1@fpt.com"]
        insert_record(api_base, "cr5db_overtimerequests", {
            "cr5db_name": "OT setup Database Server FSoft T7",
            "cr5db_date": "2026-05-30T00:00:00Z",
            "cr5db_starttime": "08:00",
            "cr5db_endtime": "12:00",
            "cr5db_hours": 4.0,
            "cr5db_ottype": "Weekend",
            "cr5db_reason": "Triển khai server dự án Smart Traffic khẩn cấp",
            "cr5db_status": "Pending",
            "cr5db_Employee@odata.bind": f"cr5db_users({bob_id})"
        }, headers)
        print("  + Overtime Request created for Bob.")

    # 27. IDP Actions
    if guids.get("idps"):
        # Bob
        bob_idp = guids["idps"]["dev1@fpt.com"]
        insert_record(api_base, "new_idpactions", {
            "new_actionname": "Hoàn thành khóa học Advanced React trên Udemy",
            "new_status": "Chưa bắt đầu",
            "new_IDP@odata.bind": f"new_idps({bob_idp})"
        }, headers)
        # Charlie
        charlie_idp = guids["idps"]["dev2@fpt.com"]
        insert_record(api_base, "new_idpactions", {
            "new_actionname": "Tham gia Seminar Prompt Engineering do FSoft AI Academy tổ chức",
            "new_status": "Đang thực hiện",
            "new_IDP@odata.bind": f"new_idps({charlie_idp})"
        }, headers)
        print("  + IDP Actions seeded.")

    # 28. Competency Assessment
    if guids.get("users") and guids.get("periods") and guids.get("competencies"):
        bob_uid = guids["users"]["dev1@fpt.com"]
        charlie_uid = guids["users"]["dev2@fpt.com"]
        react_guid = guids["competencies"][0][1]
        ai_guid = guids["competencies"][2][1]

        # Bob - React Assessment (Excelled)
        insert_record(api_base, "new_competencyassessments", {
            "new_selfscore": 4,
            "new_managerscore": 4,
            "new_finalscore": 4,
            "new_managercomment": "Bob chứng tỏ năng lực code tốt, cấu trúc component tối ưu và clean.",
            "new_evidence": "https://github.com/fpt/smart-traffic/pull/3",
            "new_Employee@odata.bind": f"cr5db_users({bob_uid})",
            "new_EvaluationPeriod@odata.bind": f"cr5db_evaluationperiods({guids['periods'][0]})",
            "new_Competency@odata.bind": f"new_competencycatalogs({react_guid})"
        }, headers)

        # Charlie - AI Assessment (Gap detected: managerscore 2 vs self 4)
        insert_record(api_base, "new_competencyassessments", {
            "new_selfscore": 4,
            "new_managerscore": 2,
            "new_finalscore": 2,
            "new_managercomment": "Còn thiếu kinh nghiệm thiết lập prompt RAG tối ưu, cần học hỏi thêm.",
            "new_evidence": "https://github.com/fpt/smart-traffic/pull/18",
            "new_Employee@odata.bind": f"cr5db_users({charlie_uid})",
            "new_EvaluationPeriod@odata.bind": f"cr5db_evaluationperiods({guids['periods'][0]})",
            "new_Competency@odata.bind": f"new_competencycatalogs({ai_guid})"
        }, headers)
        print("  + Competency Assessments created.")

    # 29. Employee Process (Active Onboarding for Charlie)
    if guids.get("users") and guids["templates"].get("Onboarding") and guids.get("departments"):
        charlie_uid = guids["users"]["dev2@fpt.com"]
        onb_tpl_id = guids["templates"]["Onboarding"]
        
        proc_res = insert_record(api_base, "new_employeeprocesses", {
            "new_name": "[Onboarding] Charlie Developer",
            "new_type": "Onboarding",
            "new_status": "In Progress",
            "new_Employee@odata.bind": f"cr5db_users({charlie_uid})",
            "new_Template@odata.bind": f"new_processtemplates({onb_tpl_id})"
        }, headers)

        if "success" in proc_res:
            proc_guid = proc_res["guid"]
            print("  + Employee Onboarding Process created for Charlie.")

            # Create specific active process steps
            it_dept = guids["departments"]["ITD"]
            hr_dept = guids["departments"]["HRD"]
            
            steps = [
                {"new_name": "Chuẩn bị chỗ ngồi & Cấp phát Laptop", "new_order": 1, "new_status": "Completed", "new_assigneerole": "IT", "new_AssignedDepartment@odata.bind": f"cr5db_departments({it_dept})"},
                {"new_name": "Ký Hợp đồng thử việc & Khai báo thuế", "new_order": 2, "new_status": "Completed", "new_assigneerole": "HR", "new_AssignedDepartment@odata.bind": f"cr5db_departments({hr_dept})"},
                {"new_name": "Tham gia khóa học đào tạo hội nhập FSoft", "new_order": 3, "new_status": "Pending", "new_assigneerole": "HR", "new_AssignedDepartment@odata.bind": f"cr5db_departments({hr_dept})"},
                {"new_name": "Giới thiệu đội nhóm R&D và Dự án", "new_order": 4, "new_status": "Pending", "new_assigneerole": "Manager"},
                {"new_name": "Hoàn tất cấu hình môi trường code nội bộ", "new_order": 5, "new_status": "Pending", "new_assigneerole": "Employee"}
            ]
            for s in steps:
                s["new_Process@odata.bind"] = f"new_employeeprocesses({proc_guid})"
                insert_record(api_base, "new_processsteps", s, headers)
            print("    * Active Onboarding Steps loaded.")

    # ==========================================
    # LEVEL 6 & 7: LOGS, TASKS & COMMENTS
    # ==========================================
    
    # 30. Tasks (Bob 1 on-track vs Charlie 5 active -> Overloaded Burnout)
    if guids.get("users") and guids.get("objectives") and guids.get("phase_id"):
        bob_id = guids["users"]["dev1@fpt.com"]
        charlie_id = guids["users"]["dev2@fpt.com"]
        obj_id = guids["objectives"][0]
        phase_id = guids["phase_id"]

        # Bob: 1 task completed, 1 in progress
        bob_t1 = insert_record(api_base, "cr5db_tasks", {
            "cr5db_taskname": "Cấu hình Schema XML cho bảng ProjectRisk",
            "cr5db_description": "Định nghĩa bảng và relationships của bảng rủi ro.",
            "cr5db_duedate": "2026-05-25T17:00:00Z",
            "statecode": 1,
            "cr5db_AssigneeID@odata.bind": f"cr5db_users({bob_id})",
            "cr5db_ObjectiveName@odata.bind": f"cr5db_objectives({obj_id})",
            "cr5db_ProjectPhaseID@odata.bind": f"cr5db_projectphases({phase_id})"
        }, headers)

        if "success" in bob_t1:
            # Seed Bob Timesheet Log
            ts_res = insert_record(api_base, "cr5db_timesheetlogs", {
                "cr5db_timesheetlog1": "Bob timesheet log database setup",
                "cr5db_actualhoursworked": 8.0,
                "cr5db_logdate": "2026-05-24T00:00:00Z",
                "statecode": 1,
                "cr5db_TaskID@odata.bind": f"cr5db_tasks({bob_t1['guid']})"
            }, headers)
            if "success" in ts_res:
                insert_record(api_base, "cr5db_timesheetaudits", {
                    "cr5db_AuditRecordName": "Audit log for Bob T7 setup",
                    "cr5db_ApprovedBy": "Alice PM",
                    "cr5db_ApprovedAt": datetime.datetime.utcnow().isoformat() + "Z",
                    "cr5db_Status": "Approved",
                    "cr5db_TimesheetLogID": ts_res["guid"]
                }, headers)

            # Bob task comment
            insert_record(api_base, "cr5db_taskcomments", {
                "cr5db_taskcomment1": "Task Completed Bob comment",
                "cr5db_commenttext": "Đã Import schema hoàn chỉnh vào Sandbox và test hoạt động.",
                "cr5db_TaskID@odata.bind": f"cr5db_tasks({bob_t1['guid']})"
            }, headers)

        bob_t2 = insert_record(api_base, "cr5db_tasks", {
            "cr5db_taskname": "Viết Unit Tests cho Core API Integration",
            "cr5db_description": "Xây dựng suite test bảo vệ API.",
            "cr5db_duedate": "2026-06-20T17:00:00Z",
            "statecode": 0,
            "cr5db_AssigneeID@odata.bind": f"cr5db_users({bob_id})",
            "cr5db_ObjectiveName@odata.bind": f"cr5db_objectives({obj_id})",
            "cr5db_ProjectPhaseID@odata.bind": f"cr5db_projectphases({phase_id})"
        }, headers)
        if "success" in bob_t2:
            print("  + Bob Developer Tasks seeded (1 completed, 1 in progress).")

        # Charlie: 5 active tasks (triggers Burnout / Overloaded Alert)
        charlie_tasks = [
            {"cr5db_taskname": "Tích hợp thư viện Groq-SDK cho ứng dụng", "cr5db_description": "Cấu hình package và viết file client kết nối api."},
            {"cr5db_taskname": "Xây dựng AI Service gọi Google Gemini 2.5 Flash API", "cr5db_description": "Thiết lập API endpoint gửi context dữ liệu."},
            {"cr5db_taskname": "Cấu hình Prompt RAG cung cấp ngữ cảnh nghiệp vụ", "cr5db_description": "Thu thập kpi targets gộp vào câu hỏi chatbot."},
            {"cr5db_taskname": "Lập trình thuật toán dự báo rủi ro KPI (Time-Decay)", "cr5db_description": "Tính toán chỉ số trễ hạn của các KPI Target."},
            {"cr5db_taskname": "Thiết kế giao diện widget Flight Risk Detector", "cr5db_description": "Vẽ card layout tròn báo cáo nguy cơ burnout của nhân viên."}
        ]
        for idx, ct in enumerate(charlie_tasks):
            ct["statecode"] = 0
            ct["cr5db_duedate"] = f"2026-06-{20 + idx}T17:00:00Z"
            ct["cr5db_AssigneeID@odata.bind"] = f"cr5db_users({charlie_id})"
            ct["cr5db_ObjectiveName@odata.bind"] = f"cr5db_objectives({obj_id})"
            ct["cr5db_ProjectPhaseID@odata.bind"] = f"cr5db_projectphases({phase_id})"
            res = insert_record(api_base, "cr5db_tasks", ct, headers)
            if "success" in res and idx == 0:
                # Add task comment for Charlie
                insert_record(api_base, "cr5db_taskcomments", {
                    "cr5db_taskcomment1": "Task Charlie Comment RAG difficulty",
                    "cr5db_commenttext": "Đang gặp khó khăn khi tối ưu hóa prompt RAG do vượt quá giới hạn ký tự.",
                    "cr5db_TaskID@odata.bind": f"cr5db_tasks({res['guid']})"
                }, headers)
        print("  + Charlie Developer Tasks seeded (5 active tasks - Overloaded/Burnout Alert Trigger).")

    # 31. Miscellaneous System Tables (System parameters, headcount requests, policy rules)
    # Headcount Request
    if guids.get("departments") and guids.get("jobpositions") and guids.get("catalog"):
        insert_record(api_base, "cr5db_headcountrequests", {
            "cr5db_requestname": "Yêu cầu tăng định biên R&D Devs cho dự án Smart Traffic",
            "cr5db_requestedquantity": 2,
            "cr5db_reason": "Tăng trưởng dự án Smart Traffic Engine đòi hỏi thêm 2 Backend Engineers cho các module AI.",
            "cr5db_approvalstatus": 122650000, # Pending OptionSet value
            "cr5db_requesttype": 122650000, # Increase OptionSet value
            "cr5db_Department@odata.bind": f"cr5db_departments({guids['departments']['RND']})",
            "cr5db_JobPosition@odata.bind": f"cr5db_jobpositions({guids['jobpositions'][2]})", # Software Engineer
            "cr5db_PositionCatalog@odata.bind": f"cr5db_positioncatalogs({guids['catalog']['ENG']})"
        }, headers)
        print("  + Headcount Request created for RND.")
        
    # System Notification
    if guids.get("users"):
        insert_record(api_base, "cr5db_systemnotifications", {
            "cr5db_systemnotification1": "Duyệt công mới Smart Traffic",
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
    
    print("\n🎉 Seeding process completed successfully under FPT Software context!")

if __name__ == "__main__":
    main()
