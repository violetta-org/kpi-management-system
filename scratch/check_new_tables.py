import subprocess

new_tables = [
    "new_roleassignment",
    "new_systemrole",
    "new_taskownership",
    "new_timesheetaudit"
]

print("=== Checking target new_ tables in Dataverse ===")

for name in new_tables:
    xml_content = f"""<fetch count="1">
  <entity name="{name}">
    <attribute name="{name}id" />
  </entity>
</fetch>"""
    
    with open("scratch/temp_fetch_new.xml", "w", encoding="utf-8") as f:
        f.write(xml_content)
        
    cmd = ["pac", "env", "fetch", "--xmlFile", "scratch/temp_fetch_new.xml"]
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    
    if "was not found in the MetadataCache" in result.stdout or "was not found in the MetadataCache" in result.stderr:
        print(f"- {name}: NOT FOUND")
    elif "connected" in result.stdout.lower() or "connection" in result.stdout.lower():
        if result.returncode == 0:
            print(f"- {name}: FOUND")
        else:
            print(f"- {name}: FOUND (Error code {result.returncode})")
    else:
        print(f"- {name}: Unknown status")

import os
if os.path.exists("scratch/temp_fetch_new.xml"):
    os.remove("scratch/temp_fetch_new.xml")
