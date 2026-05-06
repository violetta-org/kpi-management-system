# Canvas Authoring Co-Authoring Workflow

## Overview

This repository uses **Canvas Authoring MCP** for live co-authoring of Power Apps Canvas Apps. Instead of pack/unpack cycles, changes sync in real-time between local YAML files and Power Apps Studio.

## Prerequisites

- **.NET 10 SDK** installed on your machine
- Power Apps Studio tab open with **Co-authoring enabled**
- `.cursor/mcp.json` configured with correct environment/app IDs
- MCP server running (Cursor/GitHub Copilot)

## Directory Structure

```
solution/QLDA_Solution/CanvasApps/
├── QLDA_App_src/              # Old source tree (fallback only)
│   └── Other/Src/*.fx.yaml    # fx.yaml representation
└── canvas-sync-workspace/     # SOURCE OF TRUTH FOR CO-AUTHORING
    ├── App.pa.yaml            # App metadata
    ├── Screen1.pa.yaml        # Main screen
    ├── Screen2.pa.yaml        # Edit screen
    ├── Screen3.pa.yaml        # Detail screen
    └── Screen4.pa.yaml        # Kanban board
```

**Important:** `canvas-sync-workspace/` is the single source of truth during co-authoring sessions. All edits should target `.pa.yaml` files here.

## Workflow: Sync → Edit → Compile

### 1. **Sync from Studio** (Get latest state)

```bash
# Pull current app state from live Studio session into canvas-sync-workspace/
sync_canvas --output-dir solution/QLDA_Solution/CanvasApps/canvas-sync-workspace
```

This overwrites `.pa.yaml` files with the current state of the open app.

### 2. **Edit Locally**

Edit `.pa.yaml` files in `canvas-sync-workspace/`:
- Add controls, formulas, properties
- Modify screen layouts
- Update Power Fx logic

Example: Adding a button to Screen1:
```yaml
- btnNewAction:
    Control: Button
    Properties:
      Text: "New Action"
      OnSelect: =Notify("Action triggered")
```

### 3. **Compile & Validate**

```bash
# Validate YAML files against Power Apps authoring service
compile_canvas --input-dir solution/QLDA_Solution/CanvasApps/canvas-sync-workspace
```

This checks syntax, control availability, and formula correctness against the live session. Output appears in Studio in real-time (if session is active and co-authoring is enabled).

## Key Commands

| Command | Purpose |
|---------|---------|
| `sync_canvas` | Pull live session state → local YAML files |
| `compile_canvas` | Validate YAML files and push changes to Studio |
| `list_controls` | List available controls in current session |
| `describe_control` | Get detailed control properties & variants |
| `list_data_sources` | List connected data sources (Dataverse tables, Excel, etc.) |
| `list_apis` | List available connectors |

## Typical Session Flow

1. **Start**: User opens QLDA_App in Power Apps Studio, enables co-authoring
2. **Sync**: Run `sync_canvas` to pull current state (optional if starting fresh)
3. **Edit**: Modify `.pa.yaml` files in editor
4. **Compile**: Run `compile_canvas` — changes appear in Studio tab in real-time
5. **Iterate**: Edit → Compile until design is correct
6. **Save**: Power Apps Studio saves changes automatically during co-authoring

## Important Notes

- **Keep Studio tab open** throughout the session; closing it breaks the connection
- **Co-authoring must be enabled** in Power Apps Studio settings
- **MCP server must be running** (started automatically by Cursor/Copilot CLI)
- **One session at a time**: Only one co-authoring session per app (multiple tabs will conflict)
- **No manual pack/unpack**: `pac canvas pack/unpack` is deprecated for this workflow

## Troubleshooting

### compile_canvas fails with "session not found"
- Check that Power Apps Studio tab is still open
- Verify co-authoring is enabled (Settings > Updates > Co-authoring toggle)
- Ensure MCP server is connected (check Cursor/Copilot terminal for errors)

### Changes don't appear in Studio
- Run `compile_canvas` again (may take a few seconds)
- Check browser console in Studio for validation errors
- Verify YAML syntax is correct (use `describe_control` to check control names)

### YAML validation errors
- Use `list_controls` to confirm control names are exact
- Check control property names match the schema (e.g., `Height` not `height`)
- Ensure formula syntax is valid Power Fx

## Files to Edit

During co-authoring, **only edit files in `canvas-sync-workspace/`**:
- `canvas-sync-workspace/Screen1.pa.yaml` — Main task list screen
- `canvas-sync-workspace/Screen2.pa.yaml` — Create/edit task screen  
- `canvas-sync-workspace/Screen3.pa.yaml` — Task detail screen
- `canvas-sync-workspace/Screen4.pa.yaml` — Kanban board screen
- `canvas-sync-workspace/App.pa.yaml` — App-level formulas and theme

Do **not** edit files in `QLDA_App_src/` during co-authoring (they are read-only fallback copies).
