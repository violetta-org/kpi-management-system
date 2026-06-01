#!/usr/bin/env python3
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
    print("Please run: pip install msal requests")
    sys.exit(1)

try:
    from dotenv import load_dotenv
    # Load .env file from the project root (one directory up from seed/)
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
    load_dotenv(env_path)
except ImportError:
    pass

# Configuration from environment variables
CLIENT_ID = os.environ.get("POWER_APPS_CLIENT_ID")
TENANT_ID = os.environ.get("POWER_APPS_TENANT_ID")
AUTHORITY = f"https://login.microsoftonline.com/{TENANT_ID}"

if not CLIENT_ID or not TENANT_ID:
    print("❌ Error: Environment variables POWER_APPS_CLIENT_ID and POWER_APPS_TENANT_ID must be set.")
    print("Example (Windows):")
    print("  set POWER_APPS_CLIENT_ID=your-client-id")
    print("  set POWER_APPS_TENANT_ID=your-tenant-id")
    sys.exit(1)

def discover_env_url():
    """Discover the Dataverse environment URL from the configuration."""
    print("🔍 Discovering Dataverse Environment URL...")
    try:
        if os.path.exists("power.config.json"):
            with open("power.config.json", "r") as f:
                config = json.load(f)
                url = config.get("EnvironmentUrl")
                if url:
                    return url
    except Exception as e:
        print(f"⚠️ Warning: Could not read power.config.json: {e}")
        
    print("❌ Error: Could not discover environment URL. Please provide it via --url argument or set it in power.config.json.")
    sys.exit(1)

def parse_args():
    parser = argparse.ArgumentParser(description="Dataverse Evaluation Period Seeder")
    parser.add_argument("--url", help="Dataverse Environment URL (e.g., https://org.crm.dynamics.com)")
    parser.add_argument("--device", action="store_true", help="Force device code flow for authentication")
    return parser.parse_args()

def get_access_token(env_url, use_device_flow):
    scopes = [f"{env_url.rstrip('/')}/.default"]
    app = msal.PublicClientApplication(CLIENT_ID, authority=AUTHORITY)
    
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
        id_field = "cr5db_evaluationperiodid"
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
    
    print("\n🌱 Starting Evaluation Periods Seeding Process...")
    
    periods_data = [
        # Năm 2026
        {"cr5db_evaluationperiod1": "Năm 2026", "cr5db_startdate": "2026-01-01T00:00:00Z", "cr5db_enddate": "2026-12-31T23:59:59Z", "cr5db_islocked": False},
        {"cr5db_evaluationperiod1": "Q1/2026", "cr5db_startdate": "2026-01-01T00:00:00Z", "cr5db_enddate": "2026-03-31T23:59:59Z", "cr5db_islocked": False},
        {"cr5db_evaluationperiod1": "Q2/2026", "cr5db_startdate": "2026-04-01T00:00:00Z", "cr5db_enddate": "2026-06-30T23:59:59Z", "cr5db_islocked": False},
        {"cr5db_evaluationperiod1": "Q3/2026", "cr5db_startdate": "2026-07-01T00:00:00Z", "cr5db_enddate": "2026-09-30T23:59:59Z", "cr5db_islocked": False},
        {"cr5db_evaluationperiod1": "Q4/2026", "cr5db_startdate": "2026-10-01T00:00:00Z", "cr5db_enddate": "2026-12-31T23:59:59Z", "cr5db_islocked": False},
        
        # Năm 2027
        {"cr5db_evaluationperiod1": "Năm 2027", "cr5db_startdate": "2027-01-01T00:00:00Z", "cr5db_enddate": "2027-12-31T23:59:59Z", "cr5db_islocked": False},
        {"cr5db_evaluationperiod1": "Q1/2027", "cr5db_startdate": "2027-01-01T00:00:00Z", "cr5db_enddate": "2027-03-31T23:59:59Z", "cr5db_islocked": False},
        {"cr5db_evaluationperiod1": "Q2/2027", "cr5db_startdate": "2027-04-01T00:00:00Z", "cr5db_enddate": "2027-06-30T23:59:59Z", "cr5db_islocked": False},
        {"cr5db_evaluationperiod1": "Q3/2027", "cr5db_startdate": "2027-07-01T00:00:00Z", "cr5db_enddate": "2027-09-30T23:59:59Z", "cr5db_islocked": False},
        {"cr5db_evaluationperiod1": "Q4/2027", "cr5db_startdate": "2027-10-01T00:00:00Z", "cr5db_enddate": "2027-12-31T23:59:59Z", "cr5db_islocked": False},
    ]
    
    created_count = 0
    for p in periods_data:
        res = insert_record(api_base, "cr5db_evaluationperiods", p, headers)
        if "success" in res:
            created_count += 1
            print(f"  + Evaluation Period '{p['cr5db_evaluationperiod1']}' created.")
        elif "skipped" in res:
            print(f"  - {res['reason']}")
            break
            
    print(f"\\n✅ Successfully seeded {created_count} Evaluation Periods.")

if __name__ == "__main__":
    main()
