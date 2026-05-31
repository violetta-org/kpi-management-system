import os
import shutil
import subprocess

# Define paths
src_dir = "src"
temp_src_dir = "scratch/temp_src"
tables_zip = "scratch/VibeApp_tables.zip"
full_zip = "VibeApp.zip"
env_url = "https://orgcaf78765.crm5.dynamics.com/"

print("=== Starting 'Deploy Tables First' workaround ===")

# 1. Clean up old temp dirs
if os.path.exists(temp_src_dir):
    shutil.rmtree(temp_src_dir)
if os.path.exists(tables_zip):
    os.remove(tables_zip)

# 2. Copy src folder to temp
shutil.copytree(src_dir, temp_src_dir)
print("- Copied src to temp folder")

# 3. Edit Solution.xml to remove the Canvas App component
solution_xml_path = os.path.join(temp_src_dir, "Other/Solution.xml")
with open(solution_xml_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
removed_app = False
for line in lines:
    if 'schemaName="new_qunlnhbinnhns_a5b77"' in line or 'type="300"' in line:
        removed_app = True
        continue
    new_lines.append(line)

with open(solution_xml_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print(f"- Modified Solution.xml (Removed Canvas App: {removed_app})")

# 4. Remove CanvasApps directory from temp
canvas_apps_temp_dir = os.path.join(temp_src_dir, "CanvasApps")
if os.path.exists(canvas_apps_temp_dir):
    shutil.rmtree(canvas_apps_temp_dir)
print("- Removed CanvasApps folder from temp src")

# 5. Pack the table-only solution
print("- Packing table-only solution...")
pack_cmd = ["pac", "solution", "pack", "--zipfile", tables_zip, "--folder", temp_src_dir]
pack_result = subprocess.run(pack_cmd, shell=True, capture_output=True, text=True)
print(pack_result.stdout)
if pack_result.returncode != 0:
    print("❌ Packing failed!")
    print(pack_result.stderr)
    exit(1)

# 6. Import table-only solution
print("- Importing table-only solution into QLDA...")
import_cmd = [
    "pac", "solution", "import",
    "--path", tables_zip,
    "--environment", env_url,
    "--force-overwrite",
    "--publish-changes"
]
import_result = subprocess.run(import_cmd, shell=True, capture_output=True, text=True)
print(import_result.stdout)
if import_result.returncode != 0:
    print("❌ Table-only import failed!")
    print(import_result.stderr)
    exit(1)

print("✅ Tables imported successfully! Now importing the full solution...")

# 7. Import full solution
import_full_cmd = [
    "pac", "solution", "import",
    "--path", full_zip,
    "--environment", env_url,
    "--force-overwrite",
    "--publish-changes"
]
import_full_result = subprocess.run(import_full_cmd, shell=True, capture_output=True, text=True)
print(import_full_result.stdout)
if import_full_result.returncode != 0:
    print("❌ Full import failed!")
    print(import_full_result.stderr)
    exit(1)

print("🎉 Successfully restored the app state to QLDA!")
