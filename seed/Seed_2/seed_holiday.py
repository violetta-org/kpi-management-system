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

# Power Platform CLI Client ID (Public App, no secret needed)
CLIENT_ID = "51f81489-12ee-4a9e-aaae-a2591f45987d"
AUTHORITY = "https://login.microsoftonline.com/common"

def discover_env_url():
    """Discover the Dataverse environment URL from the configuration."""
    print("🔍 Discovering Dataverse Environment URL...")
    # Check apps/hr-management/power.config.json first
    config_path = "./apps/hr-management/power.config.json"
    if os.path.exists(config_path):
        try:
            with open(config_path, "r", encoding="utf-8") as f:
                config = json.load(f)
                env_url = config.get("EnvironmentUrl") or config.get("environmentUrl")
                if env_url:
                    return env_url
        except Exception:
            pass
            
    # Check root power.config.json
    try:
        if os.path.exists("power.config.json"):
            with open("power.config.json", "r") as f:
                config = json.load(f)
                url = config.get("EnvironmentUrl")
                if url:
                    return url
    except Exception as e:
        print(f"⚠️ Warning: Could not read power.config.json: {e}")
        
    return "https://orgcaf78765.crm5.dynamics.com/"

def parse_args():
    parser = argparse.ArgumentParser(description="Dataverse Holiday Configuration Seeder")
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
        id_field = "cr5db_holidayid"
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
    
    print("\n🌱 Starting Holiday Configuration Seeding Process...")
    
    # Comprehensive Vietnamese Public Holidays for 2026 and 2027
    holidays_data = [
        # --- NĂM 2026 ---
        {"cr5db_name": "Tết Dương Lịch 2026", "cr5db_date": "2026-01-01T00:00:00Z"},
        
        # Tết Nguyên Đán 2026 (Bắt đầu từ 29 Tết đến mùng 5 Tết)
        {"cr5db_name": "Tết Nguyên Đán 2026 (29 Tết)", "cr5db_date": "2026-02-15T00:00:00Z"},
        {"cr5db_name": "Tết Nguyên Đán 2026 (Giao Thừa)", "cr5db_date": "2026-02-16T00:00:00Z"},
        {"cr5db_name": "Tết Nguyên Đán 2026 (Mùng 1)", "cr5db_date": "2026-02-17T00:00:00Z"},
        {"cr5db_name": "Tết Nguyên Đán 2026 (Mùng 2)", "cr5db_date": "2026-02-18T00:00:00Z"},
        {"cr5db_name": "Tết Nguyên Đán 2026 (Mùng 3)", "cr5db_date": "2026-02-19T00:00:00Z"},
        {"cr5db_name": "Tết Nguyên Đán 2026 (Mùng 4)", "cr5db_date": "2026-02-20T00:00:00Z"},
        {"cr5db_name": "Tết Nguyên Đán 2026 (Mùng 5)", "cr5db_date": "2026-02-21T00:00:00Z"},
        
        {"cr5db_name": "Giỗ tổ Hùng Vương 2026", "cr5db_date": "2026-04-26T00:00:00Z"},
        {"cr5db_name": "Nghỉ bù Giỗ tổ Hùng Vương 2026", "cr5db_date": "2026-04-27T00:00:00Z"},
        
        {"cr5db_name": "Ngày Giải phóng miền Nam 2026", "cr5db_date": "2026-04-30T00:00:00Z"},
        {"cr5db_name": "Ngày Quốc tế Lao động 2026", "cr5db_date": "2026-05-01T00:00:00Z"},
        
        {"cr5db_name": "Ngày Quốc Khánh 2026 (Trước Quốc Khánh)", "cr5db_date": "2026-09-01T00:00:00Z"},
        {"cr5db_name": "Ngày Quốc Khánh 2026", "cr5db_date": "2026-09-02T00:00:00Z"},
        
        # --- NĂM 2027 ---
        {"cr5db_name": "Tết Dương Lịch 2027", "cr5db_date": "2027-01-01T00:00:00Z"},
        
        # Tết Nguyên Đán 2027 (Bắt đầu từ 29 Tết đến mùng 5 Tết)
        {"cr5db_name": "Tết Nguyên Đán 2027 (29 Tết)", "cr5db_date": "2027-02-04T00:00:00Z"},
        {"cr5db_name": "Tết Nguyên Đán 2027 (Giao Thừa)", "cr5db_date": "2027-02-05T00:00:00Z"},
        {"cr5db_name": "Tết Nguyên Đán 2027 (Mùng 1)", "cr5db_date": "2027-02-06T00:00:00Z"},
        {"cr5db_name": "Tết Nguyên Đán 2027 (Mùng 2)", "cr5db_date": "2027-02-07T00:00:00Z"},
        {"cr5db_name": "Tết Nguyên Đán 2027 (Mùng 3)", "cr5db_date": "2027-02-08T00:00:00Z"},
        {"cr5db_name": "Tết Nguyên Đán 2027 (Mùng 4)", "cr5db_date": "2027-02-09T00:00:00Z"},
        {"cr5db_name": "Tết Nguyên Đán 2027 (Mùng 5)", "cr5db_date": "2027-02-10T00:00:00Z"},
        
        {"cr5db_name": "Giỗ tổ Hùng Vương 2027", "cr5db_date": "2027-04-16T00:00:00Z"},
        
        {"cr5db_name": "Ngày Giải phóng miền Nam 2027", "cr5db_date": "2027-04-30T00:00:00Z"},
        {"cr5db_name": "Ngày Quốc tế Lao động 2027", "cr5db_date": "2027-05-01T00:00:00Z"},
        {"cr5db_name": "Nghỉ bù Ngày Giải phóng miền Nam 2027", "cr5db_date": "2027-05-03T00:00:00Z"},
        
        {"cr5db_name": "Ngày Quốc Khánh 2027 (Trước Quốc Khánh)", "cr5db_date": "2027-09-01T00:00:00Z"},
        {"cr5db_name": "Ngày Quốc Khánh 2027", "cr5db_date": "2027-09-02T00:00:00Z"}
    ]
    
    created_count = 0
    for h in holidays_data:
        res = insert_record(api_base, "cr5db_holidaies", h, headers)
        if "success" in res:
            created_count += 1
            print(f"  + Holiday '{h['cr5db_name']}' ({h['cr5db_date'][:10]}) created.")
        elif "skipped" in res:
            print(f"  - {res['reason']}")
            break
            
    print(f"\n✅ Successfully seeded {created_count} Holiday Configurations.")

if __name__ == "__main__":
    main()
