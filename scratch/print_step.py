import json
import sys

step_to_print = 670
log_path = r"C:\Users\violet\.gemini\antigravity\brain\0b2078be-64bd-489c-aaff-a23cfb6632ab\.system_generated\logs\transcript.jsonl"

with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        obj = json.loads(line)
        if obj.get("step_index") == step_to_print:
            print(f"=== Step {step_to_print} Content ===")
            print(obj.get("content"))
            break
