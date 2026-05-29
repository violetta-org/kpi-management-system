import zipfile

zip_path = "VibeApp.zip"
try:
    with zipfile.ZipFile(zip_path, "r") as z:
        print("=== Listing Entities in VibeApp.zip ===")
        entities = set()
        for f in z.namelist():
            # normalize path separator
            f_norm = f.replace("\\", "/")
            if "entities/" in f_norm.lower():
                parts = f_norm.split("/")
                # find where 'entities' is
                for idx, part in enumerate(parts):
                    if part.lower() == "entities" and idx + 1 < len(parts):
                        entities.add(parts[idx+1])
        for ent in sorted(entities):
            print(f"  - {ent}")
except Exception as e:
    print(f"Error reading zip: {e}")
