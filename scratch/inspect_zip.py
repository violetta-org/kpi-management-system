import zipfile

zip_path = "VibeApp.zip"
print(f"=== Listing all files in {zip_path} ===")
with zipfile.ZipFile(zip_path, "r") as z:
    for name in sorted(z.namelist()):
        # Print files under CanvasApps to see if there is any hidden source code or zip
        if "CanvasApps" in name or name.endswith(".json") or name.endswith(".zip"):
            print(f"- {name}")
