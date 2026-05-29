import subprocess
import xml.etree.ElementTree as ET
import os

xml_query = """<fetch>
  <entity name="importjob">
    <attribute name="data" />
    <attribute name="importjobid" />
    <filter>
      <condition attribute="importjobid" operator="eq" value="d223c2e8-0f67-46f1-ac23-877cf4cadf04" />
    </filter>
  </entity>
</fetch>"""

with open("scratch/temp_fetch_data.xml", "w", encoding="utf-8") as f:
    f.write(xml_query)

cmd = ["pac", "env", "fetch", "--xmlFile", "scratch/temp_fetch_data.xml"]
result = subprocess.run(cmd, shell=True, capture_output=True, text=True)

# Write output to a log file
with open("scratch/import_job_raw.log", "w", encoding="utf-8") as f:
    f.write(result.stdout)
    f.write(result.stderr)

print("Fetched import log raw data, saved to scratch/import_job_raw.log")
