const fs = require('fs');

let content = fs.readFileSync('src/app.tsx', 'utf8');

// 1. Imports
const imports = `import { OtApprovalModal } from './components/modals/OtApprovalModal';
import { DashboardSettingsModal } from './components/modals/DashboardSettingsModal';
import { NotificationsModal } from './components/modals/NotificationsModal';\n`;

content = content.replace("import { OvertimeModal } from './components/modals/OvertimeModal';", "import { OvertimeModal } from './components/modals/OvertimeModal';\n" + imports);


// 2. Replacements
const otApprovalModalCode = fs.readFileSync('temp_OtApprovalModal.txt', 'utf8');
const dashboardSettingsModalCode = fs.readFileSync('temp_DashboardSettingsModal.txt', 'utf8');
const notificationsModalCode = fs.readFileSync('temp_NotificationsModal.txt', 'utf8');

content = content.replace(otApprovalModalCode, `showOtApprovalModal && (
  <OtApprovalModal
    isOpen={showOtApprovalModal}
    onClose={() => setShowOtApprovalModal(false)}
    onApprove={handleApproveOtSubmit}
    onReject={() => {
      handleRejectOt(otToApproveId);
      setShowOtApprovalModal(false);
    }}
    initialHours={otApprovedHours}
  />
)`);

content = content.replace(dashboardSettingsModalCode, `showDashboardSettingsModal && (
  <DashboardSettingsModal
    isOpen={showDashboardSettingsModal}
    onClose={() => setShowDashboardSettingsModal(false)}
    widgetsRegistry={widgetsRegistry}
    activeRole={activeRole}
    enabledWidgets={enabledWidgets}
    onToggleWidget={(id, isChecked) => {
      if (isChecked) {
        saveEnabledWidgets(enabledWidgets.filter(x => x !== id));
      } else {
        saveEnabledWidgets([...enabledWidgets, id]);
      }
    }}
  />
)`);

content = content.replace(notificationsModalCode, `showNotificationsModal && (
  <NotificationsModal
    isOpen={showNotificationsModal}
    onClose={() => setShowNotificationsModal(false)}
    hasOverdueTasks={hasOverdueTasks}
    checkPermission={checkPermission}
    pendingApprovalsTimesheets={pendingApprovalsTimesheets}
    systemNotifications={systemNotifications}
  />
)`);

fs.writeFileSync('src/app.tsx', content, 'utf8');
