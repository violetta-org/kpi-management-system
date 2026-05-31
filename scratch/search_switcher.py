import json

log_path = r"C:\Users\violet\.gemini\antigravity\brain\0b2078be-64bd-489c-aaff-a23cfb6632ab\.system_generated\logs\transcript.jsonl"

with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        obj = json.loads(line)
        content = obj.get("content", "")
        if "DevRoleSwitcher" in content:
            print(f"Step {obj.get('step_index')}:")
            print(content[:500] + "...\n")
