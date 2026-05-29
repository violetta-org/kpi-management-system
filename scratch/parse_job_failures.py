import re
import xml.etree.ElementTree as ET
import json

with open("scratch/temp_query.xml", "w", encoding="utf-8") as f:
    f.write("""<fetch>
  <entity name="importjob">
    <attribute name="data" />
    <order attribute="startedon" descending="true" />
  </entity>
</fetch>""")

import subprocess
result = subprocess.run(["pac", "env", "fetch", "--xmlFile", "scratch/temp_query.xml"], shell=True, capture_output=True, text=True)

match = re.search(r'<importexportxml.*?</importexportxml>', result.stdout, re.DOTALL)
if match:
    xml_str = match.group(0)
    root = ET.fromstring(xml_str)
    
    failures = []
    
    # We will walk the XML tree and check any element named 'result'
    # elements with result attribute not equal to 'success' (case-insensitive)
    for element in root.findall(".//result"):
        res_val = element.get("result")
        if res_val and res_val.lower() != "success":
            # Find parent info if possible
            parent_info = {}
            # Try to get attributes of the parent node
            # Walk up to find grandparent/parent tag
            failures.append({
                "result": res_val,
                "errorcode": element.get("errorcode"),
                "errortext": element.get("errortext"),
                "datetime": element.get("datetime")
            })
            
    print("=== EXTRACTED DATA IMPORT FAILURES ===")
    print(json.dumps(failures, indent=2))
    
    with open("scratch/parsed_import_failures.json", "w", encoding="utf-8") as out_f:
        json.dump(failures, out_f, indent=2)
else:
    print("No XML importexportxml block found in PAC fetch output.")
