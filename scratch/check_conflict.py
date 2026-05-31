import json
import re

log_path = r"C:\Users\violet\.gemini\antigravity\brain\909fadb3-e17c-4c92-a0fb-5f92253f87df\.system_generated\steps\111\output.txt"

with open(log_path, "r", encoding="utf-8") as f:
    content = f.read()

# Locate the json block in the output
match = re.search(r"({.*})", content, re.DOTALL)
if match:
    try:
        data = json.loads(match.group(1))
        entities = data.get("value", [])
        print(f"Found {len(entities)} entities in the Dataverse log.")
        
        targets = ["attendance", "permission", "metadata", "log", "request"]
        found = []
        for ent in entities:
            schema_name = ent.get("SchemaName", "")
            for target in targets:
                if target in schema_name.lower():
                    found.append(ent)
                    break
        
        print("\n--- MATCHING ENTITIES IN DATAVERSE ---")
        for ent in found:
            print(f"- SchemaName: {ent.get('SchemaName')}, IsManaged: {ent.get('IsManaged')}, MetadataId: {ent.get('MetadataId')}")
            
    except Exception as e:
        print(f"Failed to parse JSON: {e}")
else:
    print("No JSON block found in log file.")
