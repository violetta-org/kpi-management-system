# Update Prompt: Clean White Theme & Official User Context

*Copy and paste this prompt into the Vibe Coding portal to update the theme to a clean white SaaS look, switch to the official getContext() SDK, and resolve any remaining bugs:*

```text
Please update the styling, theme, and user authentication context of our HR Management app to match our design system:

1. Clean White SaaS Theme (Light Mode):
   - Replace any purple themes, purple headers, or heavy purple accents with a clean, minimalist white/light grey SaaS theme matching our reference design.
   - Background: Use a soft light-grey background (#fafafa or #f8f9fa) for the main content area.
   - Sidebar & Cards: Use pure white (#ffffff) for the left sidebar navigation, main content cards, and widgets.
   - Borders & Corners: Use thin, clean borders (1px solid #e2e8f0 or rgba(0,0,0,0.06)) and rounded corners (12px or 8px). Remove any heavy shadow effects.
   - Typography: Use dark slate (#111827) for primary titles, charcoal (#374151) for card values, and medium grey (#4b5563) for secondary labels.
   - Active Menu State: In the left sidebar, the active menu tab (e.g., Dashboard, Tasks) should have a clean, light grey background accent (#f3f4f6) and a dark left-border indicator. No purple highlights.

2. Official User Context Integration (Pro-Dev SDK):
   - Refactor the user resolution logic inside "CurrentUserProvider" to use the official Power Apps Client SDK:
     import { getContext } from '@microsoft/power-apps/app';
   - Call "await getContext()" at startup to retrieve the logged-in user's profile.
   - Extract "ctx.user.userPrincipalName" (email) and "ctx.user.fullName".
   - Query our connected "User_1" (cr5db_User) table to find the record where "cr5db_Email" matches "ctx.user.userPrincipalName".
   - Save this record globally as "currentUserRecord" in our context so child components can read their custom role (cr5db_SystemRole) and database ID.

3. Fix Logic & Connections:
   - Ensure the Clock In/Clock Out attendance card on the Dashboard uses this resolved "currentUserRecord" database ID to create/update records in "cr5db_AttendanceLog".
   - Verify all lists and forms use the correct connected models (Task_1, TimesheetLog_1, KPITarget_1, etc.) to ensure there are no data sync or type errors.
```
