# Co-Authoring Quick Start — 5 minutes

## You Need

✅ Power Apps Studio **tab open** with QLDA_App  
✅ Co-authoring **enabled** (Power Apps settings)  
✅ `.NET 10 SDK` installed  
✅ `.cursor/mcp.json` configured (already done ✓)

## One-Time Setup

None — the repo is already wired. MCP server starts automatically in Cursor/Copilot CLI.

## Quick Sync Cycle

### Step 1: Pull latest from Studio
Ask MCP: "Sync the app from Studio"  
Or manually call the `sync_canvas` tool to populate `canvas-sync-workspace/*.pa.yaml`

### Step 2: Edit `.pa.yaml` files
Example: Open `canvas-sync-workspace/Screen1.pa.yaml`
- Add a control
- Modify a formula
- Update properties

```yaml
- btnNewTask:
    Control: Button
    Properties:
      Text: "New Task"
      OnSelect: =Navigate(Screen2)
```

### Step 3: Validate & push
Ask MCP: "Compile the app"  
Or manually call `compile_canvas` tool

Changes appear in Power Apps Studio instantly (if co-authoring tab still open).

### Step 4: Iterate
Repeat steps 2–3 as needed.

### Step 5: Save (automatic)
Power Apps Studio saves during co-authoring. No manual save required.

---

## Cheat Sheet — Key MCP Tools

```
sync_canvas --output-dir solution/QLDA_Solution/CanvasApps/canvas-sync-workspace
↓ pulls app state from open Studio tab into local YAML files

compile_canvas --input-dir solution/QLDA_Solution/CanvasApps/canvas-sync-workspace
↓ validates and pushes changes to live Studio session

list_controls
↓ lists available controls in this app

describe_control Button
↓ shows all properties and options for the Button control
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `compile_canvas` fails ("session not found") | Verify Power Apps Studio tab is open; check co-authoring toggle is ON |
| Changes don't appear in Studio | Wait 2–3 seconds; run `compile_canvas` again; check browser console for errors |
| YAML syntax error when compiling | Use `describe_control <name>` to check property names; verify Power Fx formula is valid |
| "MCP server not responding" | Check Cursor/Copilot terminal for errors; restart MCP if needed |

---

## File Locations

- **Edit these files** during co-authoring:
  - `solution/QLDA_Solution/CanvasApps/canvas-sync-workspace/Screen1.pa.yaml` — Main screen
  - `solution/QLDA_Solution/CanvasApps/canvas-sync-workspace/Screen2.pa.yaml` — Forms/edit screen
  - `solution/QLDA_Solution/CanvasApps/canvas-sync-workspace/App.pa.yaml` — App-level settings

- **Do not edit** (fallback reference only):
  - `solution/QLDA_Solution/CanvasApps/QLDA_App_src/Other/Src/*.pa.yaml`

---

## Next: Make Your First Edit

1. Open `canvas-sync-workspace/Screen1.pa.yaml` in your editor
2. Find a label or button control
3. Change its `Text` property to test: `Text: ="Updated by MCP ✓"`
4. Run `compile_canvas`
5. Watch it appear in Power Apps Studio

That's it! You're co-authoring live.
