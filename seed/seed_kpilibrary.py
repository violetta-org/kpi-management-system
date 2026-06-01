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
    print("🧹 Deleting cr5db_kpilibraries...")
    res = make_request("GET", urljoin(api_base, "cr5db_kpilibraries?$select=cr5db_kpilibraryid"), headers)
    records = res.get("data", {}).get("value", [])
    for rec in records:
        del_id = rec.get("cr5db_kpilibraryid")
        if del_id:
            make_request("DELETE", urljoin(api_base, f"cr5db_kpilibraries({del_id})"), headers)
    print("✅ Deleted KPI Libraries.")

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
        
    print("\n🌱 Starting KPI Library Seeding Process...")
    
    kpi_lib_data = [
        # Software Engineering / R&D
        {"cr5db_kpiname": "Tỷ lệ hoàn thành Task đúng hạn (On-time Delivery)", "cr5db_unit": "%", "cr5db_formula": "(Số Task hoàn thành đúng hạn / Tổng số Task) * 100", "new_direction": 1},
        {"cr5db_kpiname": "Số lượng Bug nghiêm trọng (Critical Bugs) phát sinh", "cr5db_unit": "Bug", "cr5db_formula": "Tổng số lượng bug mức độ Critical/Blocker trên Production", "new_direction": -1},
        {"cr5db_kpiname": "Độ bao phủ mã nguồn (Code Coverage)", "cr5db_unit": "%", "cr5db_formula": "Tỷ lệ % code được Unit Test bao phủ", "new_direction": 1},
        {"cr5db_kpiname": "Thời gian giải quyết Bug (Bug Resolution Time)", "cr5db_unit": "Giờ", "cr5db_formula": "Tổng thời gian từ lúc tạo bug đến khi đóng bug / Tổng số bug", "new_direction": -1},
        {"cr5db_kpiname": "Tỷ lệ lỗi khi triển khai (Deployment Failure Rate)", "cr5db_unit": "%", "cr5db_formula": "(Số lần deploy thất bại / Tổng số lần deploy) * 100", "new_direction": -1},
        
        # Human Resources (HR)
        {"cr5db_kpiname": "Tỷ lệ thời gian Timesheet hợp lệ", "cr5db_unit": "%", "cr5db_formula": "(Số giờ Timesheet hợp lệ / Tổng số giờ làm việc quy định) * 100", "new_direction": 1},
        {"cr5db_kpiname": "Thời gian tuyển dụng trung bình (Time to Hire)", "cr5db_unit": "Ngày", "cr5db_formula": "Tổng số ngày từ lúc đăng tuyển đến khi nhận offer / Tổng số người được tuyển", "new_direction": -1},
        {"cr5db_kpiname": "Tỷ lệ giữ chân nhân viên (Employee Retention Rate)", "cr5db_unit": "%", "cr5db_formula": "((Tổng nhân viên - Số người nghỉ việc) / Tổng nhân viên) * 100", "new_direction": 1},
        {"cr5db_kpiname": "Mức độ hài lòng của nhân viên (eNPS)", "cr5db_unit": "Điểm", "cr5db_formula": "% Promoter - % Detractor", "new_direction": 1},
        {"cr5db_kpiname": "Tỷ lệ hoàn thành đào tạo (Training Completion Rate)", "cr5db_unit": "%", "cr5db_formula": "(Số nhân viên hoàn thành khóa học / Tổng số người được phân công) * 100", "new_direction": 1},
        
        # Sales & Marketing
        {"cr5db_kpiname": "Tỷ lệ chuyển đổi khách hàng (Conversion Rate)", "cr5db_unit": "%", "cr5db_formula": "(Số khách hàng mua hàng / Tổng số lead) * 100", "new_direction": 1},
        {"cr5db_kpiname": "Chi phí để có một khách hàng mới (CAC)", "cr5db_unit": "VND", "cr5db_formula": "Tổng chi phí Marketing & Sales / Số khách hàng mới thu được", "new_direction": -1},
        {"cr5db_kpiname": "Doanh thu tăng trưởng hàng tháng (MRR Growth)", "cr5db_unit": "%", "cr5db_formula": "((MRR tháng này - MRR tháng trước) / MRR tháng trước) * 100", "new_direction": 1},
        {"cr5db_kpiname": "Chỉ số hài lòng khách hàng (CSAT)", "cr5db_unit": "%", "cr5db_formula": "(Số lượng đánh giá hài lòng / Tổng số đánh giá) * 100", "new_direction": 1},
        
        # Finance & Operations
        {"cr5db_kpiname": "Tỷ suất lợi nhuận ròng (Net Profit Margin)", "cr5db_unit": "%", "cr5db_formula": "(Lợi nhuận ròng / Tổng doanh thu) * 100", "new_direction": 1},
        {"cr5db_kpiname": "Biến động chi phí ngân sách (Budget Variance)", "cr5db_unit": "%", "cr5db_formula": "((Chi phí thực tế - Chi phí dự kiến) / Chi phí dự kiến) * 100", "new_direction": -1},
        {"cr5db_kpiname": "Tỷ lệ thời gian máy chủ hoạt động (Server Uptime)", "cr5db_unit": "%", "cr5db_formula": "(Thời gian server hoạt động / Tổng thời gian trong tháng) * 100", "new_direction": 1},
        {"cr5db_kpiname": "Chỉ số hoàn vốn đầu tư (ROI)", "cr5db_unit": "%", "cr5db_formula": "((Lợi nhuận từ đầu tư - Chi phí đầu tư) / Chi phí đầu tư) * 100", "new_direction": 1},
        
        # Customer Success & Support
        {"cr5db_kpiname": "Thời gian phản hồi đầu tiên (First Response Time)", "cr5db_unit": "Phút", "cr5db_formula": "Tổng thời gian chờ phản hồi đầu tiên / Số lượng ticket", "new_direction": -1},
        {"cr5db_kpiname": "Tỷ lệ giải quyết trong cuộc gọi đầu tiên (FCR)", "cr5db_unit": "%", "cr5db_formula": "(Số ticket giải quyết ngay lần đầu / Tổng số ticket) * 100", "new_direction": 1}
    ]
    
    created_count = 0
    for lib in kpi_lib_data:
        res_insert = insert_record(api_base, "cr5db_kpilibraries", lib, headers)
        if "success" in res_insert:
            print(f"  + KPI Template '{lib['cr5db_kpiname']}' created.")
            created_count += 1
            
    print(f"✨ KPI Library Seeding Complete! Created {created_count} KPI templates.")

if __name__ == '__main__':
    main()
