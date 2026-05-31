import os
import sys
import xml.etree.ElementTree as ET
import glob

ENTITIES_DIR = "./src/Entities"
RELATIONSHIPS_DIR = "./src/Other/Relationships"

def get_entity_fields(entity_dir):
    entity_name = os.path.basename(entity_dir)
    entity_file = os.path.join(entity_dir, "Entity.xml")
    if not os.path.exists(entity_file):
        return None
    
    fields = []
    try:
        tree = ET.parse(entity_file)
        root = tree.getroot()
        
        # Find attributes
        for attr in root.findall(".//attribute"):
            phys_name = attr.attrib.get("PhysicalName")
            attr_type = attr.find("Type")
            attr_type_text = attr_type.text if attr_type is not None else "unknown"
            
            disp = attr.find(".//displayname")
            disp_desc = disp.attrib.get("description") if disp is not None else ""
            
            # For lookups, try to find target types
            targets = []
            if attr_type_text == "lookup":
                for lt in attr.findall(".//LookupType"):
                    targets.append(lt.text)
            
            fields.append({
                "physical_name": phys_name,
                "type": attr_type_text,
                "display_name": disp_desc,
                "targets": targets
            })
    except Exception as e:
        print(f"Error parsing {entity_file}: {e}")
        
    return fields

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
    print("=== Analyzing Dataverse Solutions Metadata ===")
    
    # 1. Parse Entities
    entities = {}
    for d in glob.glob(os.path.join(ENTITIES_DIR, "*")):
        if os.path.isdir(d):
            ent_name = os.path.basename(d)
            fields = get_entity_fields(d)
            if fields:
                entities[ent_name] = fields
                
    print(f"Loaded {len(entities)} entities.")
    
    # 2. Parse Relationships
    relationships = analyze_relationships()
    print(f"Loaded {len(relationships)} relationships.")
    
    # 3. Print Entity Relationships Summary
    print("\n--- SCHEMA RELATIONSHIPS ---")
    for r in relationships:
        # Only show custom entities (cr5db_ or standard user/team relationships)
        if "cr5db_" in r["from_entity"] or "cr5db_" in r["to_entity"]:
            print(f"- {r['from_entity']} --[{r['type']} ({r['foreign_key']})]--> {r['to_entity']}")

    # 4. Analyze Role-Based Access controls
    print("\n--- RBAC Analysis (User, Project Team, Roles) ---")
    user_related = []
    role_related = []
    
    for ent, fields in entities.items():
        for f in fields:
            if f["type"] == "lookup" and "cr5db_user" in f["physical_name"].lower():
                user_related.append((ent, f["physical_name"]))
            if "role" in ent.lower() or "role" in f["physical_name"].lower():
                role_related.append((ent, f["physical_name"]))
                
    print("\nTables referencing 'cr5db_User':")
    for t, field in user_related:
        print(f"- {t} via column '{field}'")
        
    print("\nRole-related Tables/Columns:")
    for t, field in role_related:
        print(f"- {t} via column '{field}'")

if __name__ == "__main__":
    main()
