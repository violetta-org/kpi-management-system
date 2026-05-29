import subprocess
import xml.etree.ElementTree as ET

xml_query = """<fetch>
  <entity name="importjob">
    <attribute name="name" />
    <attribute name="startedon" />
    <attribute name="completedon" />
    <attribute name="importjobid" />
    <attribute name="progress" />
    <order attribute="startedon" descending="true" />
  </entity>
</fetch>"""

with open("scratch/temp_list_jobs.xml", "w", encoding="utf-8") as f:
    f.write(xml_query)

cmd = ["pac", "env", "fetch", "--xmlFile", "scratch/temp_list_jobs.xml"]
result = subprocess.run(cmd, shell=True, capture_output=True, text=True)

print(result.stdout)
import os
if os.path.exists("scratch/temp_list_jobs.xml"):
    os.remove("scratch/temp_list_jobs.xml")
