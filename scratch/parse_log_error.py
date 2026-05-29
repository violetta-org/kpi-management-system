
import subprocess
import xml.etree.ElementTree as ET
import re

# Fetch the raw output
xml_query = """<fetch>
  <entity name="importjob">
    <attribute name="data" />
    <attribute name="name" />
    <attribute name="completedon" />
    <filter>
      <condition attribute="importjobid" operator="eq" value="d223c2e8-0f67-46f1-ac23-877cf4cadf04" />
    </filter>
  </entity>
</fetch>"""

with open("scratch/temp_query.xml", "w", encoding="utf-8") as f:
    f.write(xml_query)

result = subprocess.run(["pac", "env", "fetch", "--xmlFile", "scratch/temp_query.xml"], shell=True, capture_output=True, text=True)

# Parse output
stdout = result.stdout
# Find the start of the XML data in stdout. It usually starts with <importexportxml or similar
# Let's search for '<importexportxml'
match = re.search(r'<importexportxml.*?</importexportxml>', stdout, re.DOTALL)
if not match:
    # Try finding any xml looking string
    match = re.search(r'<[^>]+>.*</[^>]+>', stdout, re.DOTALL)

if match:
    xml_str = match.group(0)
    # The xml might have escape characters or entity references
    try:
        root = ET.fromstring(xml_str)
        # Find all result nodes with status="failure"
        failures = []
        for node in root.findall(".//result[@status='failure']"):
            failures.append({
                "type": node.get("type"),
                "name": node.get("name"),
                "errorcode": node.findtext("errorcode"),
                "errordescription": node.findtext("errordescription")
            })
        
        # Also check other nodes
        for node in root.findall(".//*[@status='failed']"):
            failures.append({
                "tag": node.tag,
                "name": node.get("name"),
                "error": node.findtext("error") or node.get("error")
            })
            
        print("=== FAILURES DETECTED IN LOG ===")
        import json
        print(json.dumps(failures, indent=2))
        
        # Write full parsed log for review
        with open("scratch/parsed_import_failures.json", "w", encoding="utf-8") as out_f:
            json.dump(failures, out_f, indent=2)
    except Exception as e:
        print("Failed to parse XML string:", e)
        # Dump snippet of match to check
        print(xml_str[:1000])
else:
    print("Could not find importexportxml in output.")
