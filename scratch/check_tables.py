import os
import subprocess

variations = [
    "cr5db_attendancelog",
    "cr5db_attendancerequest",
    "cr5db_taskmetadata",
    "cr5db_taskpermission"
]

print("=== Checking target cr5db_ tables in Dataverse ===")

for name in variations:
    # Write temporary FetchXML
    xml_content = f"""<fetch count="1">
  <entity name="{name}">
    <attribute name="{name}id" />
  </entity>
</fetch>"""
    
    with open("scratch/temp_fetch.xml", "w", encoding="utf-8") as f:
        f.write(xml_content)
        
    # Run pac env fetch
    cmd = ["pac", "env", "fetch", "--xmlFile", "scratch/temp_fetch.xml"]
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    
    if "was not found in the MetadataCache" in result.stdout or "was not found in the MetadataCache" in result.stderr:
        print(f"- {name}: Not Found")
    elif "connected" in result.stdout.lower() or "connection" in result.stdout.lower():
        if result.returncode == 0:
            print(f"- {name}: FOUND! (Success)")
        else:
            # Check if there is some other error, but table exists
            if "Logical" in result.stdout or "Logical" in result.stderr:
                print(f"- {name}: Not Found (logical error)")
            else:
                print(f"- {name}: FOUND! (Returned error code {result.returncode}, but table exists in cache)")
    else:
        print(f"- {name}: Unknown status (Error: {result.stderr.strip() or result.stdout.strip()})")

# Clean up
if os.path.exists("scratch/temp_fetch.xml"):
    os.remove("scratch/temp_fetch.xml")
