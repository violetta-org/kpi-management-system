#!/usr/bin/env python3
import os

def replace_in_file(filepath, search_replace_list):
    if not os.path.exists(filepath):
        print(f"⚠️ File not found: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    for search_str, replace_str in search_replace_list:
        if search_str in content:
            content = content.replace(search_str, replace_str)
            modified = True
            
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Modified: {filepath}")
    else:
        print(f"➖ No changes: {filepath}")

def main():
    base_dir = "apps/hr-management"
    
    # 1. dataSourcesInfo.ts
    replace_in_file(
        os.path.join(base_dir, ".power/schemas/appschemas/dataSourcesInfo.ts"),
        [
            ('"new_holiday": {', '"cr5db_holiday": {'),
            ('"primaryKey": "new_holidayid",', '"primaryKey": "cr5db_holidayid",')
        ]
    )
    
    # 2. types.ts
    replace_in_file(
        os.path.join(base_dir, "src/lib/types.ts"),
        [
            ("export interface Holiday {\n  new_holidayid: string;\n  new_name: string;\n  new_date: string;\n}",
             "export interface Holiday {\n  cr5db_holidayid: string;\n  cr5db_name: string;\n  cr5db_date: string;\n}")
        ]
    )
    
    # 3. New_holidayService.ts
    replace_in_file(
        os.path.join(base_dir, "src/generated/services/New_holidayService.ts"),
        [
            ("private static readonly dataSourceName = 'new_holiday';", "private static readonly dataSourceName = 'cr5db_holiday';")
        ]
    )
    
    # 4. useLiveData.ts
    replace_in_file(
        os.path.join(base_dir, "src/hooks/useLiveData.ts"),
        [
            ("h.new_holidayid", "h.cr5db_holidayid"),
            ("h.new_name", "h.cr5db_name"),
            ("h.new_date", "h.cr5db_date")
        ]
    )
    
    # 5. app.tsx
    replace_in_file(
        os.path.join(base_dir, "src/app.tsx"),
        [
            ("new_name: newHolidayName,", "cr5db_name: newHolidayName,"),
            ("new_date: new Date(newHolidayDate).toISOString()", "cr5db_date: new Date(newHolidayDate).toISOString()"),
            ("h.new_holidayid", "h.cr5db_holidayid"),
            ("h.new_name", "h.cr5db_name"),
            ("h.new_date", "h.cr5db_date")
        ]
    )
    
    # 6. seed_data_web.ts
    replace_in_file(
        os.path.join(base_dir, "src/lib/seed_data_web.ts"),
        [
            ("new_name: \"Tết Dương Lịch 2026\", new_date:", "cr5db_name: \"Tết Dương Lịch 2026\", cr5db_date:"),
            ("new_name: \"Giỗ tổ Hùng Vương 2026\", new_date:", "cr5db_name: \"Giỗ tổ Hùng Vương 2026\", cr5db_date:"),
            ("new_name: \"Nghỉ bù Giỗ tổ\", new_date:", "cr5db_name: \"Nghỉ bù Giỗ tổ\", cr5db_date:"),
            ("new_name: \"Ngày Giải phóng miền Nam\", new_date:", "cr5db_name: \"Ngày Giải phóng miền Nam\", cr5db_date:"),
            ("new_name: \"Quốc tế Lao động\", new_date:", "cr5db_name: \"Quốc tế Lao động\", cr5db_date:"),
            ("h.new_name", "h.cr5db_name"),
            ('tryDeleteAll("new_holiday",', 'tryDeleteAll("cr5db_holiday",')
        ]
    )

if __name__ == "__main__":
    main()
