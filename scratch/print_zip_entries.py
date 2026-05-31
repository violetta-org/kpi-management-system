import zipfile

zip_path = "VibeApp.zip"
try:
    with zipfile.ZipFile(zip_path, "r") as z:
        print("=== Printing first 20 zip entries ===")
        for i, name in enumerate(z.namelist()):
            print(f"  - {name}")
            if i >= 20:
                break
except Exception as e:
    print(f"Error reading zip: {e}")
