# 🧠 Project Memory & Development Guidelines

This folder and document serve as the persistent memory for the **Quản lý Định biên Nhân sự (KPI Management System)** application, guiding the development strategy and workflow for both the user and the Antigravity AI agents.

---

## 📌 1. Project Context & Current State
*   **Previous Approach (Vibe Portal):** The project was initially built using Vibe Portal (`vibe.powerapps.com`). However, the exported metadata is buggy and lacks support for proper unit testing (compiled/minified JS only).
*   **New Direction:** We are transitioning to **Power Apps Code Apps (React + Code-First)** for local development. This enables local development, standard React/TypeScript, custom styling, and full support for unit testing (Jest/Vitest).
*   **Current Action:** The user is currently recovering/rebuilding the app environment. The old local metadata from the previous Vibe-based attempts should be ignored or archived once the new Code App template is set up.

---

## 🔄 2. Workflow for Schema & Table Updates
To ensure database schemas match the application code without losing Cloud sync, we will follow this specific workflow:

1.  **Cloud Prototyping:** If we need to create new tables or update existing ones, the user will first create/modify them directly in the **Dataverse/Canvas Maker Portal** (`make.powerapps.com`).
2.  **Local Sync:** The local agent/CLI will sync these new tables down to the local environment (using `pac code add-data-source` or connection reference CLI commands), which will automatically regenerate the TypeScript models and services (`/generated/`).
3.  **Collaborative Design & Planning:** Based on the synced schema, we will collaborate to refine the application design and create/update the `implementation_plan.md` artifact.
4.  **Finalization:** Once the plan is agreed upon, the user will apply any final schema adjustments on the Cloud Canvas, and the agent will complete the React/TypeScript code implementation at local.

---

## 🎨 3. Design & Styling Requirements (Clean White SaaS)
The application must adhere to a premium, minimalist design:
*   **Dominant Colors:** Pure white (`#FFFFFF`) or ultra-light grey (`#F9FAFB`, `#F3F4F6`) backgrounds for screens, cards, and panels. No dark mode or neon/saturated background blocks.
*   **Typography & Colors:** Clear dark grey or black text (`#111827`) for high contrast and readability.
*   **Accent Color:** Dark Navy Blue (`#1E3A8A` or `#1F2937`) for primary buttons, active states, and headings.
*   **Borders:** Subtle, thin grey borders (`#E5E7EB` or `#D1D5DB`).
*   **Spacing:** Generous paddings and clean grid alignments to give a premium web application feel.

---

## 🧪 4. Testing Requirements
*   All React components and business logic must be fully unit-testable at local using Jest/Vitest and React Testing Library.
*   Mock data will be used to simulate Dataverse API responses (mocking `/generated/services/...`) during tests.
