import os
import subprocess

solution_xml_path = "src/Other/Solution.xml"
print("=== Cleaning up missing Workflows from Solution.xml ===")

if os.path.exists(solution_xml_path):
    with open(solution_xml_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    new_lines = []
    removed_count = 0
    for line in lines:
        if 'type="20"' in line:
            removed_count += 1
            continue
        new_lines.append(line)
        
    with open(solution_xml_path, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    print(f"- Removed {removed_count} missing workflow references from Solution.xml")

# Pack the solution
print("- Packing solution...")
pack_cmd = ["python", "automate_alm.py", "--pack"]
pack_result = subprocess.run(pack_cmd, shell=True, capture_output=True, text=True)
print(pack_result.stdout)

# Import the solution
print("- Importing solution to QLDA...")
import_cmd = [
    "pac", "solution", "import",
    "--path", "VibeApp.zip",
    "--environment", "https://orgcaf78765.crm5.dynamics.com/",
    "--force-overwrite",
    "--publish-changes"
]
import_result = subprocess.run(import_cmd, shell=True, capture_output=True, text=True)
print(import_result.stdout)
if import_result.returncode != 0:
    print("❌ Import failed!")
    print(import_result.stderr)
else:
    print("🎉 Import succeeded!")
