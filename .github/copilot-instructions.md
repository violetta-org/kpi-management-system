# Copilot instructions for QLDA

## Build, test, lint

### Build (Dataverse solution)
Use the `.cdsproj` in `solution/QLDA_Solution`:

```powershell
dotnet build .\solution\QLDA_Solution\QLDA_Solution.cdsproj
```

### Test
There is no repository-wide CLI test runner configured at the root (no unified `npm test`/`pytest`/etc.).

Use the documented Power Platform testing flow instead:
- **Unit/UI logic:** Power Apps Test Studio
- **Integration:** Power Apps/Power Automate Monitor
- **Scenario coverage reference:** `technical_details/Testing_Strategy.md`

Single-test execution is done by running one test case/scenario at a time in Test Studio/UAT (for example a single `TC-*` case), not via a root CLI command.

### Lint
No repository-wide lint command is defined at the root.

## High-level architecture

QLDA is a Power Platform solution workspace with these layers:

1. **Source-of-truth business/technical docs**
   - `Bao_Cao_Phan_Tich_Kha_Thi_Ky_Thuat.md`
   - `Step_wise_project_plan.md`
   - `technical_details/*.md`

2. **Dataverse ALM solution package**
   - `solution/QLDA_Solution/QLDA_Solution.cdsproj`
   - `solution/QLDA_Solution/src/Other/Solution.xml` (publisher prefix: `qlda`)

3. **Canvas app source**
   - `solution/QLDA_Solution/CanvasApps/QLDA_App_src/Src/*.fx.yaml`
   - `solution/QLDA_Solution/CanvasApps/*/*.pa.yaml` (co-authoring source representation)

4. **Planning datasets**
   - `Product_Backlog_500_Updated.xlsx`
   - `product_backlog/`, `datatables/`
   - In this repo context, these are idea inputs; module naming is useful, but backlog details are not authoritative implementation truth.

## Key conventions specific to this repo

- **Preferred editing workflow for Canvas Apps:** use Canvas Authoring MCP co-authoring flow (`sync_canvas` / `compile_canvas`) against a live Studio session; avoid old pack/unpack loops unless fallback is explicitly needed.
- **Co-authoring prerequisites are strict:** keep the Power Apps Studio tab open, co-authoring enabled, and MCP connected to the correct app/environment URL for live sync.
- **MCP runtime requirement:** Canvas Authoring MCP requires **.NET 10 SDK**.
- **Naming conventions in Canvas source:** `clr*` for palette tokens, `var*` for state variables, `col*` for collections.
- **Task status vocabulary is fixed in app logic:** `"Todo"`, `"In Progress"`, `"Done"` (do not introduce variant labels unless refactoring end-to-end).
- **When editing task flows, keep audit behavior aligned** with existing pattern (task mutation + corresponding audit log update).
- **For project documentation changes:** prioritize Vietnamese and align facts with feasibility/step-wise technical docs instead of generated backlog prose.

## Existing assistant-config context to respect

- `.agent/AGENTS.md` and `.cursor/AGENTS.md` are generic agent frameworks, not product specs.
- `.power-platform-skills/plugins/canvas-apps/README.md` and `AGENTS.md` contain the most relevant operational guidance for MCP co-authoring in this repo.
