import subprocess

idp_tables = [
    "new_idp",
    "new_idpaction",
    "new_competencyassessment"
]

print("=== Checking IDP and Competency tables in Dataverse ===")

for name in idp_tables:
    xml_content = f"""<fetch count="1">
  <entity name="{name}">
    <attribute name="{name}id" />
  </entity>
</fetch>"""
    
    temp_xml = f"scratch/temp_fetch_{name}.xml"
    with open(temp_xml, "w", encoding="utf-8") as f:
        f.write(xml_content)
        
    cmd = ["pac", "env", "fetch", "--xmlFile", temp_xml]
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    
    # Clean up file immediately
    import os
    if os.path.exists(temp_xml):
        os.remove(temp_xml)
        
    all_output = result.stdout + "\n" + result.stderr
    if "was not found in the MetadataCache" in all_output:
        print(f"- {name}: NOT FOUND")
    elif "error" in all_output.lower() and "was not found" in all_output.lower():
        print(f"- {name}: NOT FOUND")
    else:
        print(f"- {name}: FOUND or different status")
        print("  Exit code:", result.returncode)
        if result.returncode != 0:
            print("  Output snippet:", all_output[:200])
