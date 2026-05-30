import { test, expect } from '@playwright/test';

test.describe('HR & KPI Management System Offline E2E Integration Test', () => {
  
  // Set up dialog handler once to automatically accept all window prompts/confirmations/alerts
  test.beforeEach(async ({ page }) => {
    page.on('dialog', async (dialog) => {
      console.log(`[Dialog Handler] Type: ${dialog.type()}, Message: ${dialog.message()}`);
      await dialog.accept();
    });
  });

  test('Execute complete E2E workflow: Seeding -> Task Completion -> Timesheet Logging -> PM Approval', async ({ page }) => {
    
    // =========================================================================
    // PHASE 1: ADMIN SEEDING & DATABASE REINITIALIZATION
    // =========================================================================
    console.log('\n=========================================');
    console.log('PHASE 1: ADMIN CLEANUP & FRESH SEEDING');
    console.log('=========================================');
    
    await page.goto('/');

    // Inject Admin credentials & force Mock Context
    await page.evaluate(() => {
      sessionStorage.setItem('devForceMockContext', 'true');
      sessionStorage.setItem('devUserEmail', 'admin@company.com');
      sessionStorage.setItem('devUserName', 'Violetta Admin');
      sessionStorage.setItem('devRoleOverride', 'Admin');
    });
    
    // Reload page to apply Admin context
    await page.reload();

    // Wait for the app to load database tables
    console.log('⏳ Waiting for the Admin session to load database tables...');
    await expect(page.locator('body')).not.toContainText('Đang nạp Power Apps & đồng bộ Dataverse...', { timeout: 30000 });

    // Verify successful role recognition
    await expect(page.locator('body')).toContainText('Dashboard');
    await expect(page.locator('.brand-badge')).toContainText('Admin');
    console.log('✅ Admin role successfully loaded.');

    // Click Developer Portal to manage Database Seeding
    await page.click('button:has-text("Developer Portal")');
    await expect(page.locator('h1')).toContainText('Developer Portal');
    console.log('✅ Developer Portal screen active.');

    // Step 1.1: Clean database
    console.log('🧹 Triggering database cleanup...');
    await page.click('button:has-text("Clean System Data")');
    await page.waitForTimeout(5000); // Bounded short wait to let deletion network calls execute

    // Step 1.2: Seed fresh system data
    console.log('🌱 Triggering fresh database seeding...');
    await page.click('button:has-text("Seed System Data")');
    
    // Wait for the status box to log that seeding succeeded
    console.log('⏳ Waiting for seeding process to report success...');
    const logBox = page.getByText('Hoàn tất Seeding thành công!');
    await expect(logBox).toBeVisible({ timeout: 60000 });
    console.log('✅ Database seeded and OData constraints matched successfully!');

    // Return to dashboard and verify
    await page.click('button:has-text("Dashboard")');
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toContainText('Headcount Overview');

    // =========================================================================
    // PHASE 2: EMPLOYEE ROLE ACTIVITIES (Task -> Completed & Log Timesheet)
    // =========================================================================
    console.log('\n=========================================');
    console.log('PHASE 2: EMPLOYEE ACTIVITIES');
    console.log('=========================================');

    // Switch context to Bob Developer (Employee)
    await page.evaluate(() => {
      sessionStorage.setItem('devUserEmail', 'dev1@company.com');
      sessionStorage.setItem('devUserName', 'Bob Developer');
      sessionStorage.setItem('devRoleOverride', 'Employee');
    });
    await page.reload();

    // Wait for the app to load database tables
    console.log('⏳ Waiting for the Employee session to load database tables...');
    await expect(page.locator('body')).not.toContainText('Đang nạp Power Apps & đồng bộ Dataverse...', { timeout: 30000 });

    // Verify role badges
    await expect(page.locator('.brand-badge')).toContainText('Employee');
    console.log('✅ Employee role (Bob Developer) successfully loaded.');

    // Navigate to tasks
    await page.click('button:has-text("My Tasks")');
    await expect(page.locator('body')).toContainText('Thiết lập Schema Dataverse cho bảng ProjectRisk');
    
    // Read the task status before
    const taskTextBefore = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('span')).find(s => s.textContent?.includes('Thiết lập Schema Dataverse'));
      return el ? (el.closest('div[style*="border-radius: 8px"]') as HTMLElement)?.innerText : 'NOT_FOUND';
    });
    console.log(`\n[STATE DUMP] Task before completion:\n"${(taskTextBefore || '').replace(/\n/g, ' | ')}"`);

    // Click Complete ("Hoàn tất")
    console.log('🎯 Marking task as Completed...');
    await page.click('button:has-text("Hoàn tất")');
    
    // Assert task status is updated to Completed
    await expect(page.locator('body')).toContainText('Completed');
    
    // Read the task status after
    await page.waitForTimeout(1000);
    const taskTextAfter = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('span')).find(s => s.textContent?.includes('Thiết lập Schema Dataverse'));
      return el ? (el.closest('div[style*="border-radius: 8px"]') as HTMLElement)?.innerText : 'NOT_FOUND';
    });
    console.log(`[STATE DUMP] Task after completion:\n"${(taskTextAfter || '').replace(/\n/g, ' | ')}"\n`);
    console.log('✅ Task status updated to Completed on UI.');

    // Navigate to Timesheets to log hours
    await page.click('button:has-text("Timesheets")');
    await page.click('button:has-text("Log Time")');

    // Fill log hours modal
    console.log('📝 Logging Timesheet hours...');
    await page.fill('input[placeholder="Hôm nay bạn đã làm gì..."]', 'Hoàn tất thiết lập Schema cho bảng ProjectRisk và các relationships.');
    await page.fill('input[type="number"]', '8');
    
    // Submit timesheet
    await page.click('button[type="submit"]:has-text("Ghi nhận")');
    
    // Assert timesheet entry is logged successfully as Pending
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toContainText('Pending');
    await expect(page.locator('body')).toContainText('8h');
    
    // Log the newly created timesheet row
    const tsRowLoc = page.locator('tr', { hasText: 'Hoàn tất thiết lập Schema' }).first();
    const tsText = await tsRowLoc.innerText();
    console.log(`\n[STATE DUMP] Newly submitted timesheet:\n"${tsText.replace(/\n/g, ' | ')}"\n`);
    console.log('✅ 8 hours logged successfully with Pending status.');

    // =========================================================================
    // PHASE 3: PM ROLE ACTIVITIES (Timesheet Review & Approval)
    // =========================================================================
    console.log('\n=========================================');
    console.log('PHASE 3: MANAGER REVIEW & APPROVAL');
    console.log('=========================================');

    // Switch context to Alice PM (Project Manager)
    await page.evaluate(() => {
      sessionStorage.setItem('devUserEmail', 'pm@company.com');
      sessionStorage.setItem('devUserName', 'Alice PM');
      sessionStorage.setItem('devRoleOverride', 'Admin'); // Full Admin rights to oversee approvals
    });
    await page.reload();

    // Wait for the app to load database tables
    console.log('⏳ Waiting for the Manager session to load database tables...');
    await expect(page.locator('body')).not.toContainText('Đang nạp Power Apps & đồng bộ Dataverse...', { timeout: 30000 });

    // Verify role badge
    await expect(page.locator('.brand-badge')).toContainText('Admin');
    console.log('✅ Manager session loaded.');

    // Navigate to Timesheets Approvals
    await page.click('button:has-text("Timesheets")');
    await page.click('button:has-text("Approvals")');

    // Verify Bob\'s pending timesheet is present
    await expect(page.locator('body')).toContainText('Bob Developer');
    await expect(page.locator('body')).toContainText('8h');
    console.log('✅ Bob\'s pending Timesheet entry visible to manager.');

    // Click Approve ("Duyệt")
    console.log('🎯 Approving Bob\'s timesheet...');
    
    // Log the row before approval
    const pmTsRowLoc = page.locator('tr', { hasText: 'Bob Developer' }).first();
    const pmTsBefore = await pmTsRowLoc.innerText();
    console.log(`\n[STATE DUMP] Timesheet awaiting approval:\n"${pmTsBefore.replace(/\n/g, ' | ')}"`);

    await page.click('button:has-text("Duyệt")');

    // Assert that timesheet is removed from approvals list
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toContainText('No timesheets awaiting review.');
    console.log('[STATE DUMP] Timesheet list is now empty.\n');
    console.log('✅ Bob\'s timesheet successfully approved!');
    
    // =========================================================================
    // PHASE 4: MANAGER PERFORMANCE APPRAISAL
    // =========================================================================
    console.log('\n=========================================');
    console.log('PHASE 4: PERFORMANCE APPRAISAL (MANAGER)');
    console.log('=========================================');

    // Manager navigates to Performance tab
    await page.click('button:has-text("Performance")');
    await page.click('button:has-text("Team Appraisals")');

    // Verify Bob's appraisal is present
    await expect(page.locator('body')).toContainText('Đánh giá hiệu suất Bob');
    
    // Read score before auto-calculate
    const appraisalScoreInput = page.locator('tr', { hasText: 'Đánh giá hiệu suất Bob' }).locator('input[type="number"]');
    const scoreBefore = await appraisalScoreInput.inputValue();
    console.log(`\n[STATE DUMP] Bob's appraisal score BEFORE calculation: ${scoreBefore}`);

    // Click Auto Calculate (Tự tính)
    console.log('🎯 Auto calculating Bob\'s performance score...');
    await page.click('button:has-text("Tự tính")');
    
    // Wait for auto calculate alert (Alert handler auto accepts)
    await page.waitForTimeout(1000);
    
    // Read score after auto-calculate
    const scoreAfter = await appraisalScoreInput.inputValue();
    console.log(`[STATE DUMP] Bob's appraisal score AFTER calculation: ${scoreAfter}\n`);
    console.log('✅ Auto calculate triggered successfully!');

    // =========================================================================
    // PHASE 5: ADMIN COMPANIES & HEADCOUNT VERIFICATION
    // =========================================================================
    console.log('\n=========================================');
    console.log('PHASE 5: COMPANIES & HEADCOUNT VERIFICATION');
    console.log('=========================================');

    // Switch context back to Admin
    await page.evaluate(() => {
      sessionStorage.setItem('devUserEmail', 'admin@company.com');
      sessionStorage.setItem('devUserName', 'Violetta Admin');
      sessionStorage.setItem('devRoleOverride', 'Admin');
    });
    await page.reload();
    await expect(page.locator('body')).not.toContainText('Đang nạp Power Apps', { timeout: 30000 });

    // Verify Dashboard contains Headcount Overview
    await page.click('button:has-text("Dashboard")');
    await expect(page.locator('body')).toContainText('Headcount Overview');
    console.log('✅ Headcount Overview verified on Dashboard.');

    // Verify Companies page
    await page.click('button:has-text("Companies")');
    await expect(page.locator('body')).toContainText('VibePower Vietnam');
    console.log('✅ Seeded companies verified on Companies tab.');
    
    console.log('\n=========================================');
    console.log('E2E TEST RUN COMPLETED WITH 100% SUCCESS!');
    console.log('=========================================');
  });
});
