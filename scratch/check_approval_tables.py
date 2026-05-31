import subprocess
import os

tables = [
    "cr5db_approvalroutes",
    "cr5db_changerequests"
]

print("=== Checking approval tables in Dataverse ===")

for name in tables:
    xml_content = f"""<fetch count="1">
  <entity name="{name}">
    <attribute name="{name}id" />
  </entity>
</fetch>"""
    
    xml_file = f"scratch/temp_{name}.xml"
    with open(xml_file, "w", encoding="utf-8") as f:
        f.write(xml_content)
        
    cmd = ["pac", "env", "fetch", "--xmlFile", xml_file]
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    
    # Clean up temp file
    if os.path.exists(xml_file):
        os.remove(xml_file)
        
    if "was not found in the MetadataCache" in result.stdout or "was not found in the MetadataCache" in result.stderr:
        print(f"- {name}: NOT FOUND")
    else:
        print(f"- {name}: FOUND or ACCESS OK")
