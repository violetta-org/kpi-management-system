import os
import shutil
import subprocess

src_dir = "src"
temp_src_dir = "scratch/temp_src_v2"
v2_zip = "scratch/VibeApp_v2.zip"
env_url = "https://orgcaf78765.crm5.dynamics.com/"

print("=== Starting Canvas App Rename & Restore Workflow ===")

# 1. Clean up old temp dirs
if os.path.exists(temp_src_dir):
    shutil.rmtree(temp_src_dir)
if os.path.exists(v2_zip):
    os.remove(v2_zip)

# 2. Copy src folder to temp
shutil.copytree(src_dir, temp_src_dir)
print("- Copied src to temp folder")

# 3. Rename files and folders
old_app_folder = os.path.join(temp_src_dir, "CanvasApps/new_qunlnhbinnhns_a5b77_CodeAppPackages")
new_app_folder = os.path.join(temp_src_dir, "CanvasApps/new_qunlnhbinnhns_a5b77_v2_CodeAppPackages")
if os.path.exists(old_app_folder):
    os.rename(old_app_folder, new_app_folder)
    print("- Renamed CodeAppPackages folder to v2")

old_meta_file = os.path.join(temp_src_dir, "CanvasApps/new_qunlnhbinnhns_a5b77.meta.xml")
new_meta_file = os.path.join(temp_src_dir, "CanvasApps/new_qunlnhbinnhns_a5b77_v2.meta.xml")
if os.path.exists(old_meta_file):
    os.rename(old_meta_file, new_meta_file)
    print("- Renamed meta.xml file to v2")

# 4. Replace content in meta.xml
if os.path.exists(new_meta_file):
    with open(new_meta_file, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace("new_qunlnhbinnhns_a5b77", "new_qunlnhbinnhns_a5b77_v2")
    with open(new_meta_file, "w", encoding="utf-8") as f:
        f.write(content)
    print("- Updated names inside meta.xml")

# 5. Replace content in Solution.xml
solution_xml_path = os.path.join(temp_src_dir, "Other/Solution.xml")
if os.path.exists(solution_xml_path):
    with open(solution_xml_path, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace("new_qunlnhbinnhns_a5b77", "new_qunlnhbinnhns_a5b77_v2")
    with open(solution_xml_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("- Updated names inside Solution.xml")

# 6. Pack the v2 solution
print("- Packing renamed solution...")
pack_cmd = ["pac", "solution", "pack", "--zipfile", v2_zip, "--folder", temp_src_dir]
pack_result = subprocess.run(pack_cmd, shell=True, capture_output=True, text=True)
print(pack_result.stdout)
if pack_result.returncode != 0:
    print("❌ Packing failed!")
    print(pack_result.stderr)
    exit(1)

# 7. Import v2 solution
print("- Importing renamed solution into QLDA...")
import_cmd = [
    "pac", "solution", "import",
    "--path", v2_zip,
    "--environment", env_url,
    "--force-overwrite",
    "--publish-changes"
]
import_result = subprocess.run(import_cmd, shell=True, capture_output=True, text=True)
print(import_result.stdout)
if import_result.returncode != 0:
    print("❌ Import failed!")
    print(import_result.stderr)
    exit(1)

print("🎉 Restore successful! Check vibe.powerapps.com for the new 'v2' app.")
