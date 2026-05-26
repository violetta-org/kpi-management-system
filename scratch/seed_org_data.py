"""
Dataverse Web API Org Data Seeder (Safe URL Params)
===================================================
Seeds the core organizational tables using strictly lowercase logical names
for all standard columns, exact mixed-case Navigation Property Names for
OData binds, and safe dictionary query params to avoid parsing issues with
special characters (like ampersands '&' in 'Director of R&D').

Usage:
    python scratch/seed_org_data.py
"""

import json
import sys
import requests
from create_schema_via_api import get_access_token, get_headers, API_URL, PUBLISHER_PREFIX

def get_entity_sets(token):
    """Retrieve all available EntitySets to get their plural set names."""
    print("📋 Fetching EntitySets from Dataverse metadata...")
    r = requests.get(API_URL, headers=get_headers(token))
    if r.status_code != 200:
        print(f"❌ Failed to fetch EntitySets ({r.status_code}): {r.text[:300]}")
        sys.exit(1)
    
    data = r.json()
    entity_sets = {}
    for item in data.get("value", []):
        name = item.get("name")
        url = item.get("url")
        entity_sets[name.lower()] = url
    return entity_sets

def clean_existing_data(token, entity_sets):
    """Clean up existing records in reverse dependency order."""
    print("\n🧹 Cleaning up existing mock data...")
    headers = get_headers(token)
    
    tables = [
        {"logical": f"{PUBLISHER_PREFIX}_user", "set": f"{PUBLISHER_PREFIX}_users"},
        {"logical": f"{PUBLISHER_PREFIX}_jobposition", "set": f"{PUBLISHER_PREFIX}_jobpositions"},
        {"logical": f"{PUBLISHER_PREFIX}_positioncatalog", "set": f"{PUBLISHER_PREFIX}_positioncatalogs"},
        {"logical": f"{PUBLISHER_PREFIX}_department", "set": f"{PUBLISHER_PREFIX}_departments"},
        {"logical": f"{PUBLISHER_PREFIX}_company", "set": f"{PUBLISHER_PREFIX}_companies"}
    ]
    
    for t in tables:
        logical_name = t["logical"]
        set_name = entity_sets.get(t["set"])
        if not set_name:
            print(f"  ⚠️ Set name not found for {t['set']}, skipping cleanup.")
            continue
        
        # Get all records
        url = f"{API_URL}/{set_name}"
        r = requests.get(url, headers=headers)
        if r.status_code == 200:
            records = r.json().get("value", [])
            print(f"  Found {len(records)} existing records in '{set_name}'")
            for rec in records:
                id_field = f"{logical_name}id"
                rec_id = rec.get(id_field)
                if rec_id:
                    del_url = f"{API_URL}/{set_name}({rec_id})"
                    requests.delete(del_url, headers=headers)
            print(f"  ✅ Cleaned '{set_name}'")

def seed_data(token, entity_sets):
    headers = get_headers(token)
    
    company_set = entity_sets.get(f"{PUBLISHER_PREFIX}_companies")
    dept_set = entity_sets.get(f"{PUBLISHER_PREFIX}_departments")
    catalog_set = entity_sets.get(f"{PUBLISHER_PREFIX}_positioncatalogs")
    position_set = entity_sets.get(f"{PUBLISHER_PREFIX}_jobpositions")
    user_set = entity_sets.get(f"{PUBLISHER_PREFIX}_users")
    
    if not all([company_set, dept_set, catalog_set, position_set, user_set]):
        print("❌ Error: One or more required entity sets are not found in Dataverse.")
        sys.exit(1)

    print("\n🏢 Seeding Companies...")
    companies = [
        {"cr5db_companyname": "Vibe Corporation Vietnam", "cr5db_companycode": "VIBE-VN"},
        {"cr5db_companyname": "Vibe Tech Solutions", "cr5db_companycode": "VIBE-TECH"}
    ]
    company_ids = {}
    for c in companies:
        r = requests.post(f"{API_URL}/{company_set}", headers=headers, json=c)
        if r.status_code in (200, 201, 204):
            code = c["cr5db_companycode"]
            params = {
                "$filter": f"cr5db_companycode eq '{code}'",
                "$select": "cr5db_companyid"
            }
            qr = requests.get(f"{API_URL}/{company_set}", headers=headers, params=params).json()
            company_ids[code] = qr["value"][0]["cr5db_companyid"]
            print(f"  ✅ Created Company '{c['cr5db_companyname']}' (ID: {company_ids[code]})")
        else:
            print(f"  ❌ Failed to create Company ({r.status_code}): {r.text[:300]}")

    print("\n📦 Seeding Departments...")
    departments = [
        {
            "cr5db_departmentname": "Research & Development",
            "cr5db_departmentcode": "RND",
            f"cr5db_CompanyID@odata.bind": f"/{company_set}({company_ids['VIBE-VN']})"
        },
        {
            "cr5db_departmentname": "Sales & Marketing",
            "cr5db_departmentcode": "MKT",
            f"cr5db_CompanyID@odata.bind": f"/{company_set}({company_ids['VIBE-VN']})"
        },
        {
            "cr5db_departmentname": "Human Resources",
            "cr5db_departmentcode": "HR",
            f"cr5db_CompanyID@odata.bind": f"/{company_set}({company_ids['VIBE-VN']})"
        }
    ]
    dept_ids = {}
    for d in departments:
        r = requests.post(f"{API_URL}/{dept_set}", headers=headers, json=d)
        if r.status_code in (200, 201, 204):
            code = d["cr5db_departmentcode"]
            params = {
                "$filter": f"cr5db_departmentcode eq '{code}'",
                "$select": "cr5db_departmentid"
            }
            qr = requests.get(f"{API_URL}/{dept_set}", headers=headers, params=params).json()
            dept_ids[code] = qr["value"][0]["cr5db_departmentid"]
            print(f"  ✅ Created Department '{d['cr5db_departmentname']}' (ID: {dept_ids[code]})")
        else:
            print(f"  ❌ Failed to create Department ({r.status_code}): {r.text[:300]}")

    print("\n📋 Seeding Position Catalog...")
    catalogs = [
        {"cr5db_positioncatalog1": "Director of Technology", "cr5db_code": "DIR-TECH"},
        {"cr5db_positioncatalog1": "Software Engineer Lead", "cr5db_code": "ENG-LEAD"},
        {"cr5db_positioncatalog1": "Software Developer", "cr5db_code": "ENG-DEV"},
        {"cr5db_positioncatalog1": "HR Manager", "cr5db_code": "HR-MGR"},
        {"cr5db_positioncatalog1": "HR Specialist", "cr5db_code": "HR-SPEC"},
        {"cr5db_positioncatalog1": "Sales Executive", "cr5db_code": "SALES-EXEC"}
    ]
    catalog_ids = {}
    for cat in catalogs:
        r = requests.post(f"{API_URL}/{catalog_set}", headers=headers, json=cat)
        if r.status_code in (200, 201, 204):
            code = cat["cr5db_code"]
            params = {
                "$filter": f"cr5db_code eq '{code}'",
                "$select": "cr5db_positioncatalogid"
            }
            qr = requests.get(f"{API_URL}/{catalog_set}", headers=headers, params=params).json()
            catalog_ids[code] = qr["value"][0]["cr5db_positioncatalogid"]
            print(f"  ✅ Created Position Catalog '{cat['cr5db_positioncatalog1']}' (ID: {catalog_ids[code]})")
        else:
            print(f"  ❌ Failed to create Catalog ({r.status_code}): {r.text[:300]}")

    print("\n💼 Seeding Job Positions (with Reporting Hierarchies & Quotas)...")
    # 1. Director (reports to none)
    director_pos = {
        "cr5db_positionname": "Director of R&D",
        "cr5db_headcountquota": 1,
        f"cr5db_Department@odata.bind": f"/{dept_set}({dept_ids['RND']})",
        f"cr5db_PositionCatalogTitle@odata.bind": f"/{catalog_set}({catalog_ids['DIR-TECH']})"
    }
    r = requests.post(f"{API_URL}/{position_set}", headers=headers, json=director_pos)
    if r.status_code not in (200, 201, 204):
        print(f"  ❌ Failed to create Director Position ({r.status_code}): {r.text[:300]}")
        sys.exit(1)
    
    params = {
        "$filter": "cr5db_positionname eq 'Director of R&D'",
        "$select": "cr5db_jobpositionid"
    }
    director_pos_id = requests.get(f"{API_URL}/{position_set}", headers=headers, params=params).json()["value"][0]["cr5db_jobpositionid"]
    print(f"  ✅ Created Job Position 'Director of R&D' (ID: {director_pos_id})")

    # 2. R&D Lead (reports to Director)
    lead_pos = {
        "cr5db_positionname": "Software Engineering Lead - Team A",
        "cr5db_headcountquota": 2,
        f"cr5db_Department@odata.bind": f"/{dept_set}({dept_ids['RND']})",
        f"cr5db_PositionCatalogTitle@odata.bind": f"/{catalog_set}({catalog_ids['ENG-LEAD']})",
        f"cr5db_ReportsToPositionID@odata.bind": f"/{position_set}({director_pos_id})"
    }
    r = requests.post(f"{API_URL}/{position_set}", headers=headers, json=lead_pos)
    
    params = {
        "$filter": "cr5db_positionname eq 'Software Engineering Lead - Team A'",
        "$select": "cr5db_jobpositionid"
    }
    lead_pos_id = requests.get(f"{API_URL}/{position_set}", headers=headers, params=params).json()["value"][0]["cr5db_jobpositionid"]
    print(f"  ✅ Created Job Position 'Software Engineering Lead - Team A' (ID: {lead_pos_id})")

    # 3. Developer (reports to Lead)
    dev_pos = {
        "cr5db_positionname": "Software Developer - Team A",
        "cr5db_headcountquota": 5,
        f"cr5db_Department@odata.bind": f"/{dept_set}({dept_ids['RND']})",
        f"cr5db_PositionCatalogTitle@odata.bind": f"/{catalog_set}({catalog_ids['ENG-DEV']})",
        f"cr5db_ReportsToPositionID@odata.bind": f"/{position_set}({lead_pos_id})"
    }
    r = requests.post(f"{API_URL}/{position_set}", headers=headers, json=dev_pos)
    
    params = {
        "$filter": "cr5db_positionname eq 'Software Developer - Team A'",
        "$select": "cr5db_jobpositionid"
    }
    dev_pos_id = requests.get(f"{API_URL}/{position_set}", headers=headers, params=params).json()["value"][0]["cr5db_jobpositionid"]
    print(f"  ✅ Created Job Position 'Software Developer - Team A' (ID: {dev_pos_id})")

    # 4. HR Manager (reports to none)
    hr_mgr_pos = {
        "cr5db_positionname": "HR Manager",
        "cr5db_headcountquota": 1,
        f"cr5db_Department@odata.bind": f"/{dept_set}({dept_ids['HR']})",
        f"cr5db_PositionCatalogTitle@odata.bind": f"/{catalog_set}({catalog_ids['HR-MGR']})"
    }
    r = requests.post(f"{API_URL}/{position_set}", headers=headers, json=hr_mgr_pos)
    
    params = {
        "$filter": "cr5db_positionname eq 'HR Manager'",
        "$select": "cr5db_jobpositionid"
    }
    hr_mgr_pos_id = requests.get(f"{API_URL}/{position_set}", headers=headers, params=params).json()["value"][0]["cr5db_jobpositionid"]
    print(f"  ✅ Created Job Position 'HR Manager' (ID: {hr_mgr_pos_id})")

    print("\n👤 Seeding Users & Mapping Active Developer account...")
    users = [
        {
            "cr5db_fullname": "Developer Admin",
            "cr5db_email": "102230208@sv1.dut.udn.vn",
            "cr5db_isactive": True,
            "cr5db_systemrole": "Admin",
            f"cr5db_JobPosition@odata.bind": f"/{position_set}({director_pos_id})"
        },
        {
            "cr5db_fullname": "Nguyen Van Phong PM",
            "cr5db_email": "pm@sv1.dut.udn.vn",
            "cr5db_isactive": True,
            "cr5db_systemrole": "ProjectManager",
            f"cr5db_JobPosition@odata.bind": f"/{position_set}({lead_pos_id})"
        },
        {
            "cr5db_fullname": "Tran Thi Ha HR",
            "cr5db_email": "hr@sv1.dut.udn.vn",
            "cr5db_isactive": True,
            "cr5db_systemrole": "HRManager",
            f"cr5db_JobPosition@odata.bind": f"/{position_set}({hr_mgr_pos_id})"
        },
        {
            "cr5db_fullname": "Le Van An Employee",
            "cr5db_email": "employee@sv1.dut.udn.vn",
            "cr5db_isactive": True,
            "cr5db_systemrole": "Employee",
            f"cr5db_JobPosition@odata.bind": f"/{position_set}({dev_pos_id})"
        }
    ]
    
    for u in users:
        r = requests.post(f"{API_URL}/{user_set}", headers=headers, json=u)
        if r.status_code in (200, 201, 204):
            print(f"  ✅ Created User '{u['cr5db_fullname']}' ({u['cr5db_email']}) with Role: '{u['cr5db_systemrole']}'")
        else:
            print(f"  ❌ Failed to create User ({r.status_code}): {r.text[:300]}")

    print("\n🎉 Seeding of Organizational Data completed successfully!")

def main():
    token = get_access_token()
    entity_sets = get_entity_sets(token)
    
    clean_existing_data(token, entity_sets)
    seed_data(token, entity_sets)

if __name__ == "__main__":
    main()
