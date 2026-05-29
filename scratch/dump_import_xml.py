import re
import xml.etree.ElementTree as ET

with open("scratch/temp_query.xml", "w", encoding="utf-8") as f:
    f.write("""<fetch>
  <entity name="importjob">
    <attribute name="data" />
  </entity>
</fetch>""")

import subprocess
result = subprocess.run(["pac", "env", "fetch", "--xmlFile", "scratch/temp_query.xml"], shell=True, capture_output=True, text=True)

match = re.search(r'<importexportxml.*?</importexportxml>', result.stdout, re.DOTALL)
if match:
    xml_str = match.group(0)
    root = ET.fromstring(xml_str)
    
    # Check if there are any attributes on root
    print("Root attributes:", root.attrib)
    
    # Check if there are any elements containing error text or failed status
    # Print the XML structure or any elements that look interesting
    for element in root.iter():
        # print element if it has some non-empty attributes or tags related to status
        for attr, val in element.attrib.items():
            if 'fail' in val.lower() or 'error' in val.lower() or 'errortext' in attr.lower():
                print(f"Tag: {element.tag}, Attr: {attr} = {val}")
        if element.text and ('fail' in element.text.lower() or 'error' in element.text.lower()):
            print(f"Tag: {element.tag}, Text: {element.text[:200]}")
else:
    print("No XML found.")
