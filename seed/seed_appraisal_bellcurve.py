#!/usr/bin/env python3
import os
import re
import json
import argparse
import sys
import random
import math
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
    parser = argparse.ArgumentParser(description="Seed Beautiful Bell Curve Appraisals")
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
    search_url = urljoin(api_base, f"{table_name}?$filter={match_field} eq '{match_value}'")
    res_search = make_request("GET", search_url, headers)
    
    guid = None
    if res_search["status"] == 200 and res_search.get("data", {}).get("value"):
        record = res_search["data"]["value"][0]
        for k, v in record.items():
            if k.endswith("id") and isinstance(v, str) and len(v) == 36:
                guid = v
                break
        
        if guid:
            update_url = urljoin(api_base, f"{table_name}({guid})")
            res_update = make_request("PATCH", update_url, headers, data)
            if "error" in res_update:
                print(f"  ⚠️ Error updating '{match_value}' in '{table_name}': {res_update['error']}")
            return {"success": True, "guid": guid, "action": "updated"}

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

    print("\n📊 Creating Beautiful Bell Curve Appraisals...")

    # 1. Fetch Evaluation Period
    print("🔍 Fetching Evaluation Periods...")
    res_periods = make_request("GET", urljoin(api_base, "cr5db_evaluationperiods?$select=cr5db_evaluationperiodid,cr5db_evaluationperiod1"), headers)
    if res_periods["status"] != 200 or not res_periods.get("data", {}).get("value"):
        print("⚠️ No evaluation periods found! Please seed evaluation periods first.")
        sys.exit(1)
    
    period = res_periods["data"]["value"][0]
    period_id = period["cr5db_evaluationperiodid"]
    period_name = period["cr5db_evaluationperiod1"]
    print(f"✅ Found Period: {period_name}")

    # 2. Fetch Users
    print("🔍 Fetching Users...")
    res_users = make_request("GET", urljoin(api_base, "cr5db_users?$select=cr5db_userid,cr5db_fullname,cr5db_email"), headers)
    if res_users["status"] != 200 or not res_users.get("data", {}).get("value"):
        print("⚠️ No users found! Please seed users first.")
        sys.exit(1)
        
    users = res_users["data"]["value"]
    total_users = len(users)
    print(f"✅ Found {total_users} Users. Calculating Bell Curve Distribution...")

    # 3. Calculate Bell Curve (Normal Distribution)
    # Target Distribution:
    # 10% Outstanding (90-100)
    # 20% Exceeds Expectations (80-89)
    # 40% Meets Expectations (60-79)
    # 20% Needs Improvement (40-59)
    # 10% Unsatisfactory (<40)
    
    outstanding_count = math.ceil(total_users * 0.10)
    exceeds_count = math.ceil(total_users * 0.20)
    needs_imp_count = math.ceil(total_users * 0.20)
    unsatisfactory_count = math.floor(total_users * 0.10)
    # Meets expectations takes the rest
    meets_count = total_users - (outstanding_count + exceeds_count + needs_imp_count + unsatisfactory_count)
    
    # In case of rounding making meets_count negative (very small total_users)
    if meets_count < 0:
        meets_count = total_users
        outstanding_count = exceeds_count = needs_imp_count = unsatisfactory_count = 0

    scores = []
    
    # Generate random scores for each bucket
    for _ in range(outstanding_count):
        scores.append(round(random.uniform(90.0, 99.0), 1))
    for _ in range(exceeds_count):
        scores.append(round(random.uniform(80.0, 89.0), 1))
    for _ in range(meets_count):
        scores.append(round(random.uniform(60.0, 79.0), 1))
    for _ in range(needs_imp_count):
        scores.append(round(random.uniform(40.0, 59.0), 1))
    for _ in range(unsatisfactory_count):
        scores.append(round(random.uniform(20.0, 39.0), 1))

    # Shuffle the scores
    random.shuffle(scores)
    random.shuffle(users) # Shuffle users so it's fair/random

    print(f"📈 Bell Curve Distribution: {outstanding_count} Outstanding, {exceeds_count} Exceeds, {meets_count} Meets, {needs_imp_count} Needs Imp., {unsatisfactory_count} Unsatisfactory")

    # 4. Create Appraisals
    created_count = 0
    updated_count = 0
    
    for i, user in enumerate(users):
        final_score = scores[i]
        
        # Self score is usually a bit higher than final score, or randomly close
        self_score = min(100.0, max(0.0, round(final_score + random.uniform(-5.0, 15.0), 1)))
        
        appraisal_name = f"Đánh giá hiệu suất {user['cr5db_fullname']} {period_name}"
        
        payload = {
            "cr5db_performanceappraisal1": appraisal_name,
            "cr5db_selfscore": self_score,
            "cr5db_finalscore": final_score,
            "cr5db_EmployeeID@odata.bind": f"cr5db_users({user['cr5db_userid']})",
            "cr5db_PeriodID@odata.bind": f"cr5db_evaluationperiods({period_id})"
        }

        # Let's match by Appraisal Name so we update if exists
        res = insert_or_update_record(api_base, "cr5db_performanceappraisals", payload, headers, "cr5db_performanceappraisal1", appraisal_name)
        
        if "success" in res:
            action = res["action"]
            if action == "created":
                created_count += 1
            else:
                updated_count += 1
            
            # Print visual bell curve indicator
            bar_len = int(final_score / 5)
            bar = "█" * bar_len
            print(f"  [{final_score:5.1f}] {bar:<20} | {user['cr5db_fullname'][:25]}")

    print(f"\n✨ Bell Curve Seeding Completed! {created_count} created, {updated_count} updated.")

if __name__ == '__main__':
    main()
