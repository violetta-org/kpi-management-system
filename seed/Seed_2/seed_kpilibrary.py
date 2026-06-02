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
        # --- 1: TỐI ĐA HÓA (Higher is better) ---
        {"cr5db_kpiname": "Tăng tỷ lệ hoàn thành dự án đúng hạn lên 95% trong Quý 3", "cr5db_unit": "%", "cr5db_formula": "(Số dự án đúng hạn / Tổng dự án) * 100", "new_direction": 1},
        {"cr5db_kpiname": "Đạt 90% điểm hài lòng nhân viên (eNPS) vào cuối năm", "cr5db_unit": "Điểm", "cr5db_formula": "Tỷ lệ % người ủng hộ - Tỷ lệ % người phản đối", "new_direction": 1},
        {"cr5db_kpiname": "Nâng tỷ lệ chuyển đổi khách hàng mới (Conversion Rate) lên 15%", "cr5db_unit": "%", "cr5db_formula": "(Khách hàng mới / Tổng số Lead) * 100", "new_direction": 1},
        {"cr5db_kpiname": "Tăng trưởng MRR (Doanh thu định kỳ) 20% mỗi quý", "cr5db_unit": "%", "cr5db_formula": "((MRR quý này - MRR quý trước) / MRR quý trước) * 100", "new_direction": 1},
        {"cr5db_kpiname": "Duy trì Server Uptime ở mức 99.99% trong năm 2026", "cr5db_unit": "%", "cr5db_formula": "(Thời gian server chạy / Tổng thời gian) * 100", "new_direction": 1},
        
        # --- 2: TỐI THIỂU HÓA (Lower is better) ---
        {"cr5db_kpiname": "Giảm tỷ lệ lỗi nghiêm trọng (Critical Bugs) xuống dưới 2% ở mỗi Sprint", "cr5db_unit": "%", "cr5db_formula": "(Bug Critical / Tổng số Bug) * 100", "new_direction": 2},
        {"cr5db_kpiname": "Rút ngắn thời gian phản hồi hỗ trợ (FCR) xuống dưới 15 phút", "cr5db_unit": "Phút", "cr5db_formula": "Tổng thời gian chờ / Số lượng ticket", "new_direction": 2},
        {"cr5db_kpiname": "Giảm tỷ lệ nghỉ việc (Turnover Rate) của nhân sự Core xuống dưới 5%", "cr5db_unit": "%", "cr5db_formula": "(Số nhân viên Core nghỉ / Tổng nhân viên Core) * 100", "new_direction": 2},
        {"cr5db_kpiname": "Tối ưu hóa chi phí thu hút khách hàng (CAC) giảm 10%", "cr5db_unit": "%", "cr5db_formula": "((CAC cũ - CAC mới) / CAC cũ) * 100", "new_direction": 2},
        {"cr5db_kpiname": "Giảm tỷ lệ triển khai thất bại (Deployment Failure Rate) xuống 0%", "cr5db_unit": "%", "cr5db_formula": "(Số lần deploy thất bại / Tổng deploy) * 100", "new_direction": 2},

        # --- 3: ĐẠT / KHÔNG ĐẠT (Binary - 1: Đạt, 0: Không đạt) ---
        {"cr5db_kpiname": "Vượt qua kỳ kiểm toán bảo mật ISO 27001 không có lỗi nghiêm trọng", "cr5db_unit": "Binary", "cr5db_formula": "1 = Đạt chứng chỉ, 0 = Không đạt", "new_direction": 3},
        {"cr5db_kpiname": "Hoàn thiện 100% tài liệu pháp lý cho sản phẩm mới trước 30/06", "cr5db_unit": "Binary", "cr5db_formula": "1 = Hoàn thành, 0 = Chưa hoàn thành", "new_direction": 3},
        {"cr5db_kpiname": "100% nhân sự hoàn thành khóa đào tạo An toàn thông tin Q1", "cr5db_unit": "Binary", "cr5db_formula": "1 = Tất cả hoàn thành, 0 = Có người chưa hoàn thành", "new_direction": 3},
        {"cr5db_kpiname": "Tổ chức thành công sự kiện Year End Party 2026", "cr5db_unit": "Binary", "cr5db_formula": "1 = Sự kiện diễn ra thành công, 0 = Hủy/Lỗi", "new_direction": 3},

        # --- 4: CỘT MỐC (Milestone - Tiến độ 0 -> 100%) ---
        {"cr5db_kpiname": "Phát hành thành công Phase 1 của dự án ERP mới (Cột mốc)", "cr5db_unit": "%", "cr5db_formula": "Tỷ lệ % các module Phase 1 đã hoàn thành", "new_direction": 4},
        {"cr5db_kpiname": "Triển khai hệ thống đánh giá hiệu suất (Performance Review System)", "cr5db_unit": "%", "cr5db_formula": "Số phòng ban đã áp dụng / Tổng số phòng ban", "new_direction": 4},
        {"cr5db_kpiname": "Mở rộng chi nhánh sang thị trường Nhật Bản (Tiến độ)", "cr5db_unit": "%", "cr5db_formula": "Tỷ lệ các thủ tục pháp lý và văn phòng đã hoàn thiện", "new_direction": 4}
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
