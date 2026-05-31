import json

log_path = r"C:\Users\violet\.gemini\antigravity\brain\0b2078be-64bd-489c-aaff-a23cfb6632ab\.system_generated\logs\transcript.jsonl"

with open(log_path, "r", encoding="utf-8") as f:
    count = 0
    for line in f:
        obj = json.loads(line)
        calls = obj.get("tool_calls") or []
        if any("file" in c.get("name", "") for c in calls):
            print(f"Step {obj.get('step_index')}:")
            print(json.dumps(calls[0], indent=2))
            count += 1
            if count >= 3:
                break
