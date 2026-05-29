import json

log_path = r"C:\Users\violet\.gemini\antigravity\brain\0b2078be-64bd-489c-aaff-a23cfb6632ab\.system_generated\logs\transcript.jsonl"

with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        obj = json.loads(line)
        calls = obj.get("tool_calls") or []
        for t in calls:
            name = t.get("name", "")
            if "file" in name:
                args = t.get("args") or {}
                # print keys and their values
                for k, v in list(args.items()):
                    if k in ["TargetFile", "AbsolutePath"]:
                        # remove internal quotes if they exist
                        clean_val = str(v).strip('"').replace('\\\\', '\\')
                        print(f"{obj.get('step_index')}: {name} -> {k}: {clean_val}")
