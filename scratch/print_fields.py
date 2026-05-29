import sys
import os
sys.path.append(os.getcwd())
import analyze_schemas

entities = ['new_AttendanceLog', 'new_AttendanceRequest', 'new_TaskMetadata', 'new_TaskPermission']

for t in entities:
    path = os.path.join('src', 'Entities', t)
    fields = analyze_schemas.get_entity_fields(path)
    print(f"=== Entity: {t} ===")
    if not fields:
        print("No fields found or error parsing.")
        continue
    for f in fields:
        phys = f['physical_name']
        ftype = f['type']
        disp = f['display_name']
        targets = f['targets']
        
        # Print custom columns or columns of interest
        if 'new_' in phys.lower() or 'createdby' in phys.lower() or 'modifiedby' in phys.lower():
            target_str = f" -> {targets}" if targets else ""
            print(f"  - {phys} ({ftype}){target_str} [{disp}]")
