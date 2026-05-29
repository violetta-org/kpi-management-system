import json
import os
from datetime import datetime

log_path = r"C:\Users\violet\.gemini\antigravity\brain\3b6c8013-21df-4db5-9c9f-f4c52f4aecf3\.system_generated\logs\transcript.jsonl"
output_path = r"C:\Users\violet\.gemini\antigravity\brain\3b6c8013-21df-4db5-9c9f-f4c52f4aecf3\incident_report.md"

def sanitize(val, is_multiline=True):
    s = str(val)
    # Escape HTML characters to prevent breaking the rendering engine
    s = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    
    # Normalize newlines and carriage returns
    s = s.replace("\r\n", "\n").replace("\r", "\n")
    if is_multiline:
        s = s.replace("\n", "<br>")
    else:
        s = s.replace("\n", " ")
        
    # Escape pipe characters
    s = s.replace("|", "&#124;")
    return s

def generate_report():
    if not os.path.exists(log_path):
        print(f"Log path does not exist: {log_path}")
        return

    events = []
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip(): continue
            try:
                data = json.loads(line)
                events.append(data)
            except json.JSONDecodeError:
                pass
    
    # Generate Markdown
    md = [
        "# Cybersecurity-Style Incident & Operations Report",
        "",
        "## 1. Executive Summary",
        "",
        "This document provides a comprehensive trace of all automated and manual actions executed during the troubleshooting and configuration of the QLDA Power Apps environment. The operations resemble a structured response to system integration anomalies, detailing environment configuration changes, CLI operations, and file system interactions.",
        "",
        "## 2. Incident Information",
        "",
        "- **Incident Type**: Continuous Integration/Deployment & Environment Configuration (Code App Operations Blocked)",
        "- **Date/Time**: " + datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "- **Location/Environment**: QLDA Workspaces & Dynamics Environments",
        "",
        "## 3. Timeline of Events (Detailed Log Trace)",
        "| Step | Timestamp | Source | Type | Action / Details |",
        "|------|-----------|--------|------|------------------|"
    ]
    
    for ev in events:
        step = sanitize(ev.get("step_index", "-"), False)
        ts = sanitize(ev.get("created_at", "-"), False)
        source = sanitize(ev.get("source", "-"), False)
        etype = sanitize(ev.get("type", "-"), False)
        
        details = []
        if "content" in ev and ev["content"]:
            content_str = str(ev["content"])
            # Truncate content slightly if too huge, but keep it detailed
            content = content_str[:500] + ("..." if len(content_str) > 500 else "")
            details.append(f"**Content**: {sanitize(content, True)}")
        
        if "tool_calls" in ev and ev["tool_calls"]:
            for tc in ev["tool_calls"]:
                tname = sanitize(tc.get("name", "unknown_tool"), False)
                targs = sanitize(tc.get("args", {}), True)
                details.append(f"**Tool Call**: `{tname}` - args: `{targs}`")
                
        detail_str = "<br>".join(details)
        if not detail_str:
            detail_str = "N/A"
            
        md.append(f"| {step} | {ts} | {source} | {etype} | {detail_str} |")
        
    md.append("")
    md.append("## 4. Containment and Remediation Actions")
    md.append("- Navigated environment ALM setup.")
    md.append("- Enabled `iscustomcontrolsincanvasappsenabled` across Dev, Validation, Build, and Target environments using `pac env update-settings`.")
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(md))
        
    print(f"Report successfully generated at: {output_path}")

if __name__ == '__main__':
    generate_report()
