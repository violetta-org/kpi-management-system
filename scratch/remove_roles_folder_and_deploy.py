import os
import shutil
import subprocess

src_roles = "src/Roles"
backup_roles = "scratch/Roles_backup"
zip_file = "VibeApp.zip"
env_url = "https://orgcaf78765.crm5.dynamics.com/"

print("=== Starting Roles Cleanup and Deploy Workaround ===")

# 1. Backup and remove Roles folder
if os.path.exists(backup_roles):
    shutil.rmtree(backup_roles)

if os.path.exists(src_roles):
    shutil.move(src_roles, backup_roles)
    print("- Moved src/Roles to scratch/Roles_backup")

# 2. Pack the solution
print("- Packing solution...")
pack_cmd = ["python", "automate_alm.py", "--pack"]
pack_result = subprocess.run(pack_cmd, shell=True, capture_output=True, text=True)
print(pack_result.stdout)

# 3. Restore the Roles folder
if os.path.exists(backup_roles):
    shutil.move(backup_roles, src_roles)
    print("- Restored src/Roles from backup")

# 4. Import the packed solution
if pack_result.returncode == 0:
    print("- Importing solution to QLDA...")
    import_cmd = [
        "pac", "solution", "import",
        "--path", zip_file,
        "--environment", env_url,
        "--force-overwrite",
        "--publish-changes"
    ]
    import_result = subprocess.run(import_cmd, shell=True, capture_output=True, text=True)
    print(import_result.stdout)
    if import_result.returncode != 0:
        print("❌ Import failed!")
        print(import_result.stderr)
    else:
        print("🎉 Restore successful! App is back in QLDA.")
else:
    print("❌ Packing failed, skipping import.")
    print(pack_result.stderr)
