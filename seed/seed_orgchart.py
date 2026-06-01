#!/usr/bin/env python3
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

def parse_args():
    parser = argparse.ArgumentParser(description="Seed Beautiful Org Chart Data")
    parser.add_argument("--url", help="Dataverse Environment URL")
    parser.add_argument("--device", action="store_true", help="Force MSAL Device Code Flow")
    return parser.parse_args()

def discover_env_url():
    config_path = "../apps/hr-management/power.config.json"
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

def insert_or_update_record(api_base, table_name, data, headers, match_field, match_value):
    # Try to find existing record
    search_url = urljoin(api_base, f"{table_name}?$filter={match_field} eq '{match_value}'")
    res_search = make_request("GET", search_url, headers)
    
    guid = None
    if res_search["status"] == 200 and res_search.get("data", {}).get("value"):
        # Record exists, get GUID
        record = res_search["data"]["value"][0]
        # Find the ID field dynamically (usually table_name without 's' + 'id', but let's just find anything ending with id)
        for k, v in record.items():
            if k.endswith("id") and isinstance(v, str) and len(v) == 36:
                guid = v
                break
        
        # Update record
        if guid:
            update_url = urljoin(api_base, f"{table_name}({guid})")
            res_update = make_request("PATCH", update_url, headers, data)
            if "error" in res_update:
                print(f"  ⚠️ Error updating '{match_value}' in '{table_name}': {res_update['error']}")
            return {"success": True, "guid": guid, "action": "updated"}

    # Insert new record
    url = urljoin(api_base, table_name)
    res = make_request("POST", url, headers, data)
    if res["status"] == 404:
        return {"skipped": True, "reason": f"Table '{table_name}' not found"}
    if "error" in res:
        print(f"  ⚠️ Error inserting '{match_value}' into '{table_name}': {res['error']}")
        return {"error": res["error"]}
    odata_id = res["headers"].get("OData-EntityId")
    guid = extract_guid(odata_id)
    if not guid and "data" in res:
        for k, v in res["data"].items():
            if k.endswith("id") and v and len(str(v)) == 36:
                guid = v
                break
    return {"success": True, "guid": guid, "action": "created"}


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

    print("\n🌳 Creating Beautiful Organizational Chart Structure...")

    # Define the beautiful structure
    org_structure = {
        "CEO": {
            "name": "Managing Director / CEO",
            "quota": 1,
            "department_code": "RND",
            "reports_to": None,
            "employees": [
                {"name": "Hà Minh Khoa", "email": "102230193@sv1.dut.udn.vn"}
            ]
        },
        "DIR_RND": {
            "name": "Director of Software Product R&D",
            "quota": 1,
            "department_code": "RND",
            "reports_to": "CEO",
            "employees": [
                {"name": "Võ Ngọc Cường", "email": "vncuong9@company.com"}
            ]
        },
        "PM_RND": {
            "name": "R&D Project Manager",
            "quota": 3,
            "department_code": "RND",
            "reports_to": "DIR_RND",
            "employees": [
                {"name": "Nguyễn Hữu Minh Quân", "email": "102230208@sv1.dut.udn.vn"},
                {"name": "Alice PM", "email": "pm@fpt.com"},
                {"name": "Võ Hoàng Phúc", "email": "vhphuc17@company.com"}
            ]
        },
        "LEAD_FE": {
            "name": "Team Lead - Frontend",
            "quota": 1,
            "department_code": "RND",
            "reports_to": "PM_RND",
            "employees": [
                {"name": "Bob Developer", "email": "dev1@fpt.com"}
            ]
        },
        "DEV_FE": {
            "name": "Frontend Developer",
            "quota": 5,
            "department_code": "RND",
            "reports_to": "LEAD_FE",
            "employees": [
                {"name": "Trần Bảo Em", "email": "tbem1@company.com"},
                {"name": "Huỳnh Hải Cường", "email": "hhcuong2@company.com"},
                {"name": "Lê Minh Cường", "email": "lmcuong3@company.com"},
                {"name": "Võ Hoàng Giang", "email": "vhgiang4@company.com"},
                {"name": "Bùi Thị Vy", "email": "btvy5@company.com"}
            ]
        },
        "LEAD_BE": {
            "name": "Team Lead - Backend",
            "quota": 1,
            "department_code": "RND",
            "reports_to": "PM_RND",
            "employees": [
                {"name": "Charlie Developer", "email": "dev2@fpt.com"}
            ]
        },
        "DEV_BE": {
            "name": "Backend Developer",
            "quota": 5,
            "department_code": "RND",
            "reports_to": "LEAD_BE",
            "employees": [
                {"name": "Hoàng Văn Tuấn", "email": "hvtuan6@company.com"},
                {"name": "Bùi Bảo Phong", "email": "bbphong7@company.com"},
                {"name": "Bùi Hoàng Trang", "email": "bhtrang8@company.com"},
                {"name": "Phan Hải Giang", "email": "phgiang10@company.com"},
                {"name": "Vũ Thị Hải", "email": "vthai11@company.com"}
            ]
        },
        "LEAD_AI": {
            "name": "Team Lead - AI / Data",
            "quota": 1,
            "department_code": "RND",
            "reports_to": "PM_RND",
            "employees": [
                {"name": "Trần Ngọc Cường", "email": "tncuong0@company.com"}
            ]
        },
        "DEV_AI": {
            "name": "Data Scientist / AI Engineer",
            "quota": 5,
            "department_code": "RND",
            "reports_to": "LEAD_AI",
            "employees": [
                {"name": "Đỗ Ngọc Vy", "email": "dnvy12@company.com"},
                {"name": "Phan Thanh Em", "email": "ptem13@company.com"},
                {"name": "Phạm Thủy Hà", "email": "ptha14@company.com"},
                {"name": "Vũ Văn Dũng", "email": "vvdung15@company.com"},
                {"name": "Lê Ngọc Tuấn", "email": "lntuan16@company.com"}
            ]
        },
        "DIR_HR": {
            "name": "HR Director",
            "quota": 1,
            "department_code": "HRD",
            "reports_to": "CEO",
            "employees": [
                {"name": "Phan Minh Bình", "email": "pmbinh20@company.com"}
            ]
        },
        "HR_SPEC": {
            "name": "HR Recruitment Specialist",
            "quota": 3,
            "department_code": "HRD",
            "reports_to": "DIR_HR",
            "employees": [
                {"name": "Violetta Admin", "email": "admin@fpt.com"},
                {"name": "Nguyễn Quốc Hà", "email": "nqha18@company.com"},
                {"name": "Phạm Minh Hải", "email": "pmhai19@company.com"}
            ]
        },
        "HR_BP": {
            "name": "HR Business Partner",
            "quota": 4,
            "department_code": "HRD",
            "reports_to": "DIR_HR",
            "employees": [
                {"name": "Đặng Thị Bình", "email": "dtbinh21@company.com"},
                {"name": "Phan Ngọc Em", "email": "pnem22@company.com"},
                {"name": "Lê Văn Cường", "email": "lvcuong23@company.com"},
                {"name": "Trần Thủy An", "email": "ttan24@company.com"}
            ]
        },
        "IT_MGR": {
            "name": "IT Infrastructure Manager",
            "quota": 1,
            "department_code": "ITD",
            "reports_to": "CEO",
            "employees": [
                {"name": "Nguyễn Thanh Linh", "email": "ntlinh25@company.com"}
            ]
        },
        "IT_ADMIN": {
            "name": "System Administrator",
            "quota": 4,
            "department_code": "ITD",
            "reports_to": "IT_MGR",
            "employees": [
                {"name": "Đỗ Gia Phong", "email": "dgphong26@company.com"},
                {"name": "Lê Gia Linh", "email": "lglinh27@company.com"},
                {"name": "Đỗ Bảo Dũng", "email": "dbdung28@company.com"},
                {"name": "Đỗ Quốc Bình", "email": "dqbinh29@company.com"}
            ]
        }
    }

    position_guids = {}

    # Fetch existing departments
    print("🔍 Fetching Departments...")
    res_depts = make_request("GET", urljoin(api_base, "cr5db_departments?$select=cr5db_departmentid,cr5db_departmentcode"), headers)
    dept_map = {}
    if res_depts["status"] == 200 and res_depts.get("data", {}).get("value"):
        for dept in res_depts["data"]["value"]:
            if dept.get("cr5db_departmentcode"):
                dept_map[dept["cr5db_departmentcode"]] = dept["cr5db_departmentid"]

    print("1️⃣ Creating/Updating Job Positions and Hierarchy...")
    # First pass: Create positions without reports_to (to avoid dependency issues)
    for pos_key, pos_data in org_structure.items():
        payload = {
            "cr5db_positionname": pos_data["name"],
            "cr5db_headcountquota": pos_data["quota"]
        }
        dept_code = pos_data.get("department_code")
        if dept_code and dept_code in dept_map:
            payload["cr5db_Department@odata.bind"] = f"cr5db_departments({dept_map[dept_code]})"

        res = insert_or_update_record(api_base, "cr5db_jobpositions", payload, headers, "cr5db_positionname", pos_data["name"])
        if "success" in res:
            position_guids[pos_key] = res["guid"]
            print(f"   [+] {pos_data['name']} -> {res['action']}")

    # Second pass: Update reports_to relationships
    print("2️⃣ Linking Reporting Hierarchy...")
    for pos_key, pos_data in org_structure.items():
        reports_to_key = pos_data["reports_to"]
        if reports_to_key and reports_to_key in position_guids:
            parent_guid = position_guids[reports_to_key]
            child_guid = position_guids[pos_key]
            update_url = urljoin(api_base, f"cr5db_jobpositions({child_guid})")
            payload = {
                "cr5db_ReportsToPositionID@odata.bind": f"cr5db_jobpositions({parent_guid})"
            }
            res_update = make_request("PATCH", update_url, headers, payload)
            if "error" not in res_update:
                print(f"   [+] Linked: {pos_data['name']} -> Reports To -> {org_structure[reports_to_key]['name']}")
            else:
                print(f"   [!] Failed to link {pos_data['name']}: {res_update['error']}")

    # Third pass: Assign employees to positions
    print("3️⃣ Seeding Employees into Organizational Chart...")
    for pos_key, pos_data in org_structure.items():
        pos_guid = position_guids.get(pos_key)
        if not pos_guid:
            continue
            
        for emp in pos_data["employees"]:
            payload = {
                "cr5db_fullname": emp["name"],
                "cr5db_email": emp["email"],
                "cr5db_isactive": True,
                "cr5db_JobPosition@odata.bind": f"cr5db_jobpositions({pos_guid})"
            }
            
            # Update user
            # Find user first
            search_url = urljoin(api_base, f"cr5db_users?$filter=cr5db_email eq '{emp['email']}'")
            res_search = make_request("GET", search_url, headers)
            
            if res_search["status"] == 200 and res_search.get("data", {}).get("value"):
                user_guid = res_search["data"]["value"][0]["cr5db_userid"]
                update_url = urljoin(api_base, f"cr5db_users({user_guid})")
                make_request("PATCH", update_url, headers, {
                    "cr5db_JobPosition@odata.bind": f"cr5db_jobpositions({pos_guid})"
                })
                print(f"   [+] Assigned {emp['name']} ({emp['email']}) to {pos_data['name']}")
            else:
                # If user doesn't exist, create them
                res_create = insert_or_update_record(api_base, "cr5db_users", payload, headers, "cr5db_email", emp["email"])
                if "success" in res_create:
                    print(f"   [+] Created & Assigned {emp['name']} to {pos_data['name']}")

    print("\n✨ Org Chart Seeding Completed Successfully! You can now check the Sơ đồ Tổ chức in Power Apps.")

if __name__ == '__main__':
    main()
