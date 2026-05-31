# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hr-management.spec.ts >> HR & KPI Management System Offline E2E Integration Test >> Execute complete E2E workflow: Seeding -> Task Completion -> Timesheet Logging -> PM Approval
- Location: tests\hr-management.spec.ts:13:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).not.toContainText(expected) failed

Locator: locator('body')
Expected substring: not "Đang nạp Power Apps & đồng bộ Dataverse..."
Received string: "
    Đang nạp Power Apps & đồng bộ Dataverse...
    
  

"

Call log:
  - Expect "not toContainText" with timeout 30000ms
  - waiting for locator('body')
    46 × locator resolved to <body>…</body>
       - unexpected value "
    Đang nạp Power Apps & đồng bộ Dataverse...
    
  

"

```

```yaml
- text: Đang nạp Power Apps & đồng bộ Dataverse...
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('HR & KPI Management System Offline E2E Integration Test', () => {
  4   |   
  5   |   // Set up dialog handler once to automatically accept all window prompts/confirmations/alerts
  6   |   test.beforeEach(async ({ page }) => {
  7   |     page.on('dialog', async (dialog) => {
  8   |       console.log(`[Dialog Handler] Type: ${dialog.type()}, Message: ${dialog.message()}`);
  9   |       await dialog.accept();
  10  |     });
  11  |   });
  12  | 
  13  |   test('Execute complete E2E workflow: Seeding -> Task Completion -> Timesheet Logging -> PM Approval', async ({ page }) => {
  14  |     
  15  |     // =========================================================================
  16  |     // PHASE 1: ADMIN SEEDING & DATABASE REINITIALIZATION
  17  |     // =========================================================================
  18  |     console.log('\n=========================================');
  19  |     console.log('PHASE 1: ADMIN CLEANUP & FRESH SEEDING');
  20  |     console.log('=========================================');
  21  |     
  22  |     await page.goto('/');
  23  | 
  24  |     // Inject Admin credentials & force Mock Context
  25  |     await page.evaluate(() => {
  26  |       sessionStorage.setItem('devForceMockContext', 'true');
  27  |       sessionStorage.setItem('devUserEmail', 'admin@company.com');
  28  |       sessionStorage.setItem('devUserName', 'Violetta Admin');
  29  |       sessionStorage.setItem('devRoleOverride', 'Admin');
  30  |     });
  31  |     
  32  |     // Reload page to apply Admin context
  33  |     await page.reload();
  34  | 
  35  |     // Wait for the app to load database tables
  36  |     console.log('⏳ Waiting for the Admin session to load database tables...');
> 37  |     await expect(page.locator('body')).not.toContainText('Đang nạp Power Apps & đồng bộ Dataverse...', { timeout: 30000 });
      |                                            ^ Error: expect(locator).not.toContainText(expected) failed
  38  | 
  39  |     // Verify successful role recognition
  40  |     await expect(page.locator('body')).toContainText('Dashboard');
  41  |     await expect(page.locator('.brand-badge')).toContainText('Admin');
  42  |     console.log('✅ Admin role successfully loaded.');
  43  | 
  44  |     // Click Developer Portal to manage Database Seeding
  45  |     await page.click('button:has-text("Developer Portal")');
  46  |     await expect(page.locator('h1')).toContainText('Developer Portal');
  47  |     console.log('✅ Developer Portal screen active.');
  48  | 
  49  |     // Step 1.1: Clean database
  50  |     console.log('🧹 Triggering database cleanup...');
  51  |     await page.click('button:has-text("Clean System Data")');
  52  |     await page.waitForTimeout(5000); // Bounded short wait to let deletion network calls execute
  53  | 
  54  |     // Step 1.2: Seed fresh system data
  55  |     console.log('🌱 Triggering fresh database seeding...');
  56  |     await page.click('button:has-text("Seed System Data")');
  57  |     
  58  |     // Wait for the status box to log that seeding succeeded
  59  |     console.log('⏳ Waiting for seeding process to report success...');
  60  |     const logBox = page.getByText('Hoàn tất Seeding thành công!');
  61  |     await expect(logBox).toBeVisible({ timeout: 60000 });
  62  |     console.log('✅ Database seeded and OData constraints matched successfully!');
  63  | 
  64  |     // Return to dashboard and verify
  65  |     await page.click('button:has-text("Dashboard")');
  66  |     await page.waitForTimeout(2000);
  67  |     await expect(page.locator('body')).toContainText('Headcount Overview');
  68  | 
  69  |     // =========================================================================
  70  |     // PHASE 2: EMPLOYEE ROLE ACTIVITIES (Task -> Completed & Log Timesheet)
  71  |     // =========================================================================
  72  |     console.log('\n=========================================');
  73  |     console.log('PHASE 2: EMPLOYEE ACTIVITIES');
  74  |     console.log('=========================================');
  75  | 
  76  |     // Switch context to Bob Developer (Employee)
  77  |     await page.evaluate(() => {
  78  |       sessionStorage.setItem('devUserEmail', 'dev1@company.com');
  79  |       sessionStorage.setItem('devUserName', 'Bob Developer');
  80  |       sessionStorage.setItem('devRoleOverride', 'Employee');
  81  |     });
  82  |     await page.reload();
  83  | 
  84  |     // Wait for the app to load database tables
  85  |     console.log('⏳ Waiting for the Employee session to load database tables...');
  86  |     await expect(page.locator('body')).not.toContainText('Đang nạp Power Apps & đồng bộ Dataverse...', { timeout: 30000 });
  87  | 
  88  |     // Verify role badges
  89  |     await expect(page.locator('.brand-badge')).toContainText('Employee');
  90  |     console.log('✅ Employee role (Bob Developer) successfully loaded.');
  91  | 
  92  |     // Navigate to tasks
  93  |     await page.click('button:has-text("My Tasks")');
  94  |     await expect(page.locator('body')).toContainText('Thiết lập Schema Dataverse cho bảng ProjectRisk');
  95  |     
  96  |     // Read the task status before
  97  |     const taskTextBefore = await page.evaluate(() => {
  98  |       const el = Array.from(document.querySelectorAll('span')).find(s => s.textContent?.includes('Thiết lập Schema Dataverse'));
  99  |       return el ? (el.closest('div[style*="border-radius: 8px"]') as HTMLElement)?.innerText : 'NOT_FOUND';
  100 |     });
  101 |     console.log(`\n[STATE DUMP] Task before completion:\n"${(taskTextBefore || '').replace(/\n/g, ' | ')}"`);
  102 | 
  103 |     // Click Complete ("Hoàn tất")
  104 |     console.log('🎯 Marking task as Completed...');
  105 |     await page.click('button:has-text("Hoàn tất")');
  106 |     
  107 |     // Assert task status is updated to Completed
  108 |     await expect(page.locator('body')).toContainText('Completed');
  109 |     
  110 |     // Read the task status after
  111 |     await page.waitForTimeout(1000);
  112 |     const taskTextAfter = await page.evaluate(() => {
  113 |       const el = Array.from(document.querySelectorAll('span')).find(s => s.textContent?.includes('Thiết lập Schema Dataverse'));
  114 |       return el ? (el.closest('div[style*="border-radius: 8px"]') as HTMLElement)?.innerText : 'NOT_FOUND';
  115 |     });
  116 |     console.log(`[STATE DUMP] Task after completion:\n"${(taskTextAfter || '').replace(/\n/g, ' | ')}"\n`);
  117 |     console.log('✅ Task status updated to Completed on UI.');
  118 | 
  119 |     // Navigate to Timesheets to log hours
  120 |     await page.click('button:has-text("Timesheets")');
  121 |     await page.click('button:has-text("Log Time")');
  122 | 
  123 |     // Fill log hours modal
  124 |     console.log('📝 Logging Timesheet hours...');
  125 |     await page.fill('input[placeholder="Hôm nay bạn đã làm gì..."]', 'Hoàn tất thiết lập Schema cho bảng ProjectRisk và các relationships.');
  126 |     await page.fill('input[type="number"]', '8');
  127 |     
  128 |     // Submit timesheet
  129 |     await page.click('button[type="submit"]:has-text("Ghi nhận")');
  130 |     
  131 |     // Assert timesheet entry is logged successfully as Pending
  132 |     await page.waitForTimeout(2000);
  133 |     await expect(page.locator('body')).toContainText('Pending');
  134 |     await expect(page.locator('body')).toContainText('8h');
  135 |     
  136 |     // Log the newly created timesheet row
  137 |     const tsRowLoc = page.locator('tr', { hasText: 'Hoàn tất thiết lập Schema' }).first();
```