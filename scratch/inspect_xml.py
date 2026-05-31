import re
import xml.etree.ElementTree as ET

# Let's inspect the tags in the XML
with open("scratch/temp_query.xml", "w", encoding="utf-8") as f:
    f.write("""<fetch>
  <entity name="importjob">
    <attribute name="data" />
  </entity>
</fetch>""")

import subprocess
result = subprocess.run(["pac", "env", "fetch", "--xmlFile", "scratch/temp_query.xml"], shell=True, capture_output=True, text=True)

# Extract xml
match = re.search(r'<importexportxml.*?</importexportxml>', result.stdout, re.DOTALL)
if match:
    xml_str = match.group(0)
    root = ET.fromstring(xml_str)
    
    # Print all child tags under root
    print("Root tag:", root.tag)
    print("Children:")
    for child in list(root):
        print(f" - {child.tag} (attribs: {list(child.attrib.keys())})")
        # Print subchildren
        for sub in list(child)[:5]:
            print(f"    - {sub.tag} (attribs: {list(sub.attrib.keys())})")
            for s in list(sub)[:2]:
                print(f"       - {s.tag} (attribs: {list(s.attrib.keys())})")
else:
    print("No xml found in output")
