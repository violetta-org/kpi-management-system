const fs = require('fs');

let content = fs.readFileSync('src/app.tsx', 'utf8');

const modalsToExtract = [
  { name: 'LeaveBalanceModal', condition: 'showLeaveBalanceModal', componentArgs: 'isOpen={showLeaveBalanceModal}\n    onClose={() => { setShowLeaveBalanceModal(false); setEditingLeaveBalance(null); }}\n    onSave={handleSaveLeaveBalance}\n    editingLeaveBalance={editingLeaveBalance}' },
  { name: 'HolidayModal', condition: 'showHolidayModal', componentArgs: 'isOpen={showHolidayModal}\n    onClose={() => { setShowHolidayModal(false); setEditingHoliday(null); }}\n    onSave={handleHolidaySubmit}\n    editingHoliday={editingHoliday}' },
  { name: 'OvertimeModal', condition: 'showOvertimeModal', componentArgs: 'isOpen={showOvertimeModal}\n    onClose={() => setShowOvertimeModal(false)}\n    onSave={handleOvertimeSubmit}' }
];

for (const modal of modalsToExtract) {
  const startStr = `${modal.condition} && (`;
  let startIdx = content.indexOf(startStr);
  if (startIdx === -1) {
    console.log(`Could not find ${modal.name}`);
    continue;
  }

  let endIdx = -1;
  let parenCount = 0;
  let started = false;
  for (let i = startIdx + modal.condition.length + 4; i < content.length; i++) {
    if (content[i] === '(') {
      parenCount++;
      started = true;
    } else if (content[i] === ')') {
      parenCount--;
    }
    if (started && parenCount === 0) {
      endIdx = i;
      break;
    }
  }

  if (endIdx !== -1) {
    let toReplace = content.substring(startIdx, endIdx + 4);
    // Back track to `{` if needed.
    let replacement = `<${modal.name}\n    ${modal.componentArgs}\n  />`;
    content = content.replace(toReplace, replacement);
    console.log(`Replaced ${modal.name}`);
  }
}

// Add imports
if (!content.includes('import { LeaveBalanceModal }')) {
  content = content.replace("import { AssignAppraisalModal } from './components/modals/AssignAppraisalModal';", "import { AssignAppraisalModal } from './components/modals/AssignAppraisalModal';\nimport { LeaveBalanceModal } from './components/modals/LeaveBalanceModal';\nimport { HolidayModal } from './components/modals/HolidayModal';\nimport { OvertimeModal } from './components/modals/OvertimeModal';");
}

fs.writeFileSync('src/app.tsx', content, 'utf8');
