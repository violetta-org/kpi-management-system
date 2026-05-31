import os
import sys
import xml.etree.ElementTree as ET
import glob

ENTITIES_DIR = "./src/Entities"
RELATIONSHIPS_DIR = "./src/Other/Relationships"

# Standard Dataverse columns we want to filter out for readability
SYSTEM_FIELDS = {
    "createdby", "createdon", "createdonbehalfby", "modifiedby", "modifiedon", 
    "modifiedonbehalfby", "ownerid", "owningbusinessunit", "owningteam", "owninguser", 
    "statecode", "statuscode", "timezoneruleversionnumber", "utcconversiontimezonecode",
    "importsequencenumber", "overriddencreatedon", "versionnumber"
}

def get_entity_info(entity_dir):
    entity_name = os.path.basename(entity_dir)
    entity_file = os.path.join(entity_dir, "Entity.xml")
    if not os.path.exists(entity_file):
        return None
    
    info = {
        "logical_name": entity_name,
        "display_name": entity_name.replace("cr5db_", ""),
        "description": "",
        "fields": []
    }
    
    try:
        tree = ET.parse(entity_file)
        root = tree.getroot()
        
        # Get entity description
        desc_node = root.find(".//entity/Descriptions/Description")
        if desc_node is not None:
            info["description"] = desc_node.attrib.get("description", "")
            
        disp_node = root.find(".//entity/LocalizedNames/LocalizedName")
        if disp_node is not None:
            info["display_name"] = disp_node.attrib.get("description", info["display_name"])

        # Find attributes
        for attr in root.findall(".//attribute"):
            phys_name = attr.attrib.get("PhysicalName")
            if phys_name.lower() in SYSTEM_FIELDS:
                continue
                
            attr_type = attr.find("Type")
            attr_type_text = attr_type.text if attr_type is not None else "unknown"
            
            disp = attr.find(".//displayname/displayname")
            if disp is None:
                disp = attr.find(".//displaynames/displayname")
            disp_desc = disp.attrib.get("description") if disp is not None else phys_name
            
            desc = attr.find(".//Descriptions/Description")
            desc_text = desc.attrib.get("description") if desc is not None else ""
            
            # Lookup target types
            targets = []
            if attr_type_text == "lookup":
                for lt in attr.findall(".//LookupType"):
                    # Extract target name if available or guess based on attribute name
                    targets.append(lt.text)
            
            info["fields"].append({
                "physical_name": phys_name,
                "type": attr_type_text,
                "display_name": disp_desc,
                "description": desc_text,
                "targets": targets
            })
    except Exception as e:
        print(f"Error parsing {entity_file}: {e}")
        
    return info

def analyze_relationships():
    relationships = []
    files = glob.glob(os.path.join(RELATIONSHIPS_DIR, "*.xml"))
    for file in files:
        try:
            tree = ET.parse(file)
            root = tree.getroot()
            for rel in root.findall(".//EntityRelationship"):
                rel_name = rel.attrib.get("Name")
                rel_type = rel.find("EntityRelationshipType").text if rel.find("EntityRelationshipType") is not None else ""
                refing = rel.find("ReferencingEntityName").text if rel.find("ReferencingEntityName") is not None else ""
                refed = rel.find("ReferencedEntityName").text if rel.find("ReferencedEntityName") is not None else ""
                attr = rel.find("ReferencingAttributeName").text if rel.find("ReferencingAttributeName") is not None else ""
                
                relationships.append({
                    "name": rel_name,
                    "type": rel_type,
                    "from_entity": refing,
                    "to_entity": refed,
                    "foreign_key": attr
                })
        except Exception as e:
            print(f"Error parsing relationships in {file}: {e}")
    return relationships

def main():
    print("Parsing entities...")
    entities = {}
    for d in glob.glob(os.path.join(ENTITIES_DIR, "*")):
        if os.path.isdir(d):
            ent_name = os.path.basename(d)
            info = get_entity_info(d)
            if info:
                entities[ent_name] = info
                
    print(f"Loaded {len(entities)} entities.")
    relationships = analyze_relationships()
    print(f"Loaded {len(relationships)} relationships.")
    
    # Filter relationships to keep only custom ones (between cr5db tables)
    custom_rels = []
    for r in relationships:
        if r["from_entity"].startswith("cr5db_") and r["to_entity"].startswith("cr5db_"):
            custom_rels.append(r)
            
    # Write Markdown output
    with open("schema_analysis.md", "w", encoding="utf-8") as f:
        f.write("# 📊 Database Schema & Relationship Analysis\n\n")
        f.write("This report provides a detailed overview of the Dataverse tables, fields, and relationships generated for the **Quản lý Định biên Nhân sự** (Personnel Allocation & KPI Management) application.\n\n")
        
        # Section 1: Overview
        f.write("## 1. Entity Overview\n\n")
        f.write("Below is the list of custom tables created in the solution:\n\n")
        f.write("| Table Logical Name | Display Name | Description |\n")
        f.write("| :--- | :--- | :--- |\n")
        for ent_name in sorted(entities.keys()):
            ent = entities[ent_name]
            f.write(f"| `{ent['logical_name']}` | **{ent['display_name']}** | {ent['description']} |\n")
        f.write("\n")
        
        # Section 2: Custom Relationships
        f.write("## 2. Entity-Relationship Model\n\n")
        f.write("These are the primary database relationships established between your custom tables:\n\n")
        f.write("| From Table (Referencing) | Relationship Type | To Table (Referenced) | Foreign Key Column |\n")
        f.write("| :--- | :--- | :--- | :--- |\n")
        for r in sorted(custom_rels, key=lambda x: (x["from_entity"], x["to_entity"])):
            f.write(f"| `{r['from_entity']}` | {r['type']} | `{r['to_entity']}` | `{r['foreign_key']}` |\n")
        f.write("\n")
        
        # Section 3: Detailed Fields per Entity
        f.write("## 3. Detailed Table Columns (Excluding System Fields)\n\n")
        for ent_name in sorted(entities.keys()):
            ent = entities[ent_name]
            f.write(f"### 📦 {ent['display_name']} (`{ent['logical_name']}`)\n")
            if ent['description']:
                f.write(f"*{ent['description']}*\n\n")
            f.write("| Column Name | Type | Display Name | Target / Notes |\n")
            f.write("| :--- | :--- | :--- | :--- |\n")
            for field in ent["fields"]:
                target_str = ", ".join(field["targets"]) if field["targets"] else ""
                f.write(f"| `{field['physical_name']}` | `{field['type']}` | {field['display_name']} | {target_str} {field['description']} |\n")
            f.write("\n---\n\n")
            
        # Section 4: Role-Based Access Control (RBAC) Gaps
        f.write("## 4. Role-Based Access Control (RBAC) & Feature Analysis\n\n")
        f.write("### Current State:\n")
        f.write("*   **`cr5db_User` vs. System Users:** The system has a custom `cr5db_User` table representing employees, which is separate from the built-in Dataverse `SystemUser` table. This is common for HR databases, but means that logged-in users must be manually mapped to employee records.\n")
        f.write("*   **`cr5db_UserProjectRole`:** This table lists roles (e.g., `cr5db_RoleName`, `cr5db_RoleCode`), but it is linked via `cr5db_AllocationID` to `cr5db_ResourceAllocation` rather than directly to the User or Project. This means roles are allocated to *specific resource assignments* instead of being system-wide user permissions.\n")
        f.write("*   **CRUD Focus:** The current application structure has entities like `cr5db_Task`, `cr5db_KPITarget`, and `cr5db_TimesheetLog`. However, looking at the fields, **there are no direct columns restricting who can edit what**. Anyone with write access to the app has access to all records because data-level roles are not implemented in the application UI.\n\n")
        
        f.write("### Key Gaps and Recommendations for RBAC:\n\n")
        f.write("1.  **Task Assignee Missing:** The `cr5db_Task` table currently has **no column** linking it to `cr5db_User` (the employee). It only has standard Dataverse owners (`OwnerId` which points to `SystemUser` or `Team`). If you want tasks to be assigned to specific employees in your custom user table, you need to add a lookup column `cr5db_AssigneeID` pointing to `cr5db_User`.\n")
        f.write("2.  **Role Definition:** You should define clear system roles (e.g., `Employee`, `ProjectManager`, `HRManager`, `SystemAdmin`) in a centralized table and associate logged-in Microsoft Entra ID accounts (via email mapping) to these roles.\n")
        f.write("3.  **Filtered Views (UI-Level Security):** The Canvas app should filter records based on the active user's role:\n")
        f.write("    *   *Employees* should only see and edit their own `cr5db_Task` records (where `cr5db_AssigneeID` matches their user record) and log their own `cr5db_TimesheetLog`.\n")
        f.write("    *   *Project Managers* should be able to create tasks and approve timesheets for their projects.\n")
        f.write("    *   *HR/Directors* should see high-level KPI dashboards (`cr5db_PerformanceAppraisal`, `cr5db_KPITarget`).\n")
        f.write("4.  **Security Roles in Dataverse (Data-Level Security):** Create custom Security Roles in the Power Platform Admin Center (e.g. 'Project Member', 'Project Manager') and set Table Permissions (Read, Write, Create) using Owner-based or User-based access levels so that Dataverse itself enforces security, blocking unauthorized CRUD operations even if someone accesses the API directly.\n")
        
    print("Done! Analysis written to schema_analysis.md.")

if __name__ == "__main__":
    main()
