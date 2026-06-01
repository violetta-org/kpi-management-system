#!/usr/bin/env python3
import os
import re
import json
import argparse
import sys
import random
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
    print("🧹 Deleting cr5db_jobpositions...")
    res = make_request("GET", urljoin(api_base, "cr5db_jobpositions?$select=cr5db_jobpositionid"), headers)
    records = res.get("data", {}).get("value", [])
    for rec in records:
        del_id = rec.get("cr5db_jobpositionid")
        if del_id:
            make_request("DELETE", urljoin(api_base, f"cr5db_jobpositions({del_id})"), headers)
    print("✅ Deleted job positions.")

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
        
    print("\n🌱 Starting Job Position Seeding Process...")
    
    # Fetch Departments
    print("🔍 Fetching Departments...")
    res_depts = make_request("GET", urljoin(api_base, "cr5db_departments?$select=cr5db_departmentid,cr5db_departmentname"), headers)
    departments = res_depts.get("data", {}).get("value", [])
    if not departments:
        print("⚠️ No departments found. Please run seed_department.py first.")
        sys.exit(1)
        
    # Fetch Position Catalogs
    print("🔍 Fetching Position Catalogs...")
    res_cats = make_request("GET", urljoin(api_base, "cr5db_positioncatalogs?$select=cr5db_positioncatalogid,cr5db_positioncatalog1"), headers)
    catalogs = res_cats.get("data", {}).get("value", [])
    if not catalogs:
        print("⚠️ No position catalogs found. Please run seed_positioncatalog.py first.")
        sys.exit(1)
        
    print(f"✅ Found {len(departments)} departments and {len(catalogs)} catalogs.")
    
    # Generate 50 job positions randomly mapping departments and catalogs
    created_count = 0
    for i in range(50):
        dept = random.choice(departments)
        cat = random.choice(catalogs)
        
        # Determine quota based on catalog title heuristics
        title = cat["cr5db_positioncatalog1"].lower()
        if "chief" in title or "director" in title or "manager" in title:
            quota = random.randint(1, 3)
        elif "senior" in title or "lead" in title:
            quota = random.randint(2, 6)
        else:
            quota = random.randint(3, 15)
            
        pos_name = f"{cat['cr5db_positioncatalog1']} of {dept['cr5db_departmentname']}"
        
        d = {
            "cr5db_positionname": pos_name,
            "cr5db_headcountquota": quota,
            "cr5db_Department@odata.bind": f"cr5db_departments({dept['cr5db_departmentid']})",
            "cr5db_PositionCatalogTitle@odata.bind": f"cr5db_positioncatalogs({cat['cr5db_positioncatalogid']})"
        }
        
        res_insert = insert_record(api_base, "cr5db_jobpositions", d, headers)
        if "success" in res_insert:
            print(f"  + Job Position '{pos_name}' (Quota: {quota}) created.")
            created_count += 1
            
    print(f"✨ Job Position Seeding Complete! Created {created_count} positions.")

if __name__ == '__main__':
    main()
