#!/usr/bin/env python3
import os
import re
import json
import argparse
import sys
import datetime
import random
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
    parser = argparse.ArgumentParser(description="Seed Dataverse environment")
    parser.add_argument("--url", help="Dataverse Environment URL")
    parser.add_argument("--clear", action="store_true", help="Delete existing custom records")
    parser.add_argument("--device", action="store_true", help="Force MSAL Device Code Flow")
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

def insert_record(api_base, table_name, data, headers):
    url = urljoin(api_base, table_name)
    res = make_request("POST", url, headers, data)
    if res["status"] == 404:
        return {"skipped": True, "reason": f"Table '{table_name}' not found"}
    if "error" in res:
        print(f"  ⚠️ Error inserting into '{table_name}': {res['error']}")
        return {"error": res["error"]}
    odata_id = res["headers"].get("OData-EntityId")
    guid = extract_guid(odata_id)
    if not guid and "data" in res:
        guid = res["data"].get(f"{table_name[:-1]}id")
    return {"success": True, "guid": guid}

def clear_records(api_base, headers):
    print("🧹 Deleting cr5db_departments...")
    res = make_request("GET", urljoin(api_base, "cr5db_departments?$select=cr5db_departmentid"), headers)
    records = res.get("data", {}).get("value", [])
    for rec in records:
        del_id = rec.get("cr5db_departmentid")
        if del_id:
            make_request("DELETE", urljoin(api_base, f"cr5db_departments({del_id})"), headers)
    print("✅ Deleted departments.")

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
        sys.exit(0)
        
    print("\n🌱 Starting Department Seeding Process...")
    print("🔍 Fetching Company...")
    res = make_request("GET", urljoin(api_base, "cr5db_companies?$select=cr5db_companyid"), headers)
    if res["status"] != 200 or not res.get("data", {}).get("value"):
        print("⚠️ No company found. Please run seed_company.py first.")
        sys.exit(1)
        
    company_id = res["data"]["value"][0]["cr5db_companyid"]
    print(f"✅ Found Company ID: {company_id}")
    
    dept_keywords = [
        ("RND", "Software Product R&D"),
        ("HRD", "Human Resources"),
        ("ITD", "IT Infrastructure Support"),
        ("MKT", "Marketing & Communications"),
        ("SAL", "Sales & Account Management"),
        ("FIN", "Finance & Accounting"),
        ("LGL", "Legal & Compliance"),
        ("PRD", "Product Management"),
        ("QA",  "Quality Assurance"),
        ("CS",  "Customer Success"),
        ("OP",  "Operations"),
        ("SEC", "Cybersecurity"),
        ("DAT", "Data & Analytics"),
        ("RMP", "Risk Management"),
        ("PROC", "Procurement & Supply Chain"),
        ("ENG", "Engineering Core"),
        ("AI", "Artificial Intelligence Research"),
        ("UIX", "UI/UX Design Studio"),
        ("BD", "Business Development"),
        ("CR", "Corporate Relations"),
        ("IN", "Innovation Lab"),
        ("LOG", "Logistics & Fleet"),
        ("SUP", "Global Support Center")
    ]
    
    # Shuffle or pick a random subset to ensure random generation
    selected_depts = random.sample(dept_keywords, len(dept_keywords))
    
    created_count = 0
    for code, name in selected_depts:
        d = {
            "cr5db_departmentcode": code,
            "cr5db_departmentname": name,
            "cr5db_CompanyID@odata.bind": f"cr5db_companies({company_id})"
        }
        res_insert = insert_record(api_base, "cr5db_departments", d, headers)
        if "success" in res_insert:
            print(f"  + Department '{code}' ({name}) created.")
            created_count += 1
            
    print(f"✨ Department Seeding Complete! Created {created_count} departments.")

if __name__ == '__main__':
    main()
