const fs = require('fs');

const content = fs.readFileSync('src/app.tsx', 'utf8');

const modalsToExtract = [
  { name: 'LeaveBalanceModal', condition: 'showLeaveBalanceModal && (' },
  { name: 'HolidayModal', condition: 'showHolidayModal && (' },
  { name: 'OvertimeModal', condition: 'showOvertimeModal && (' }
];

for (const modal of modalsToExtract) {
  let startIdx = content.indexOf(modal.condition);
  if (startIdx === -1) continue;
  
  // Find the exact matching `)` for the `(` in condition
  // The condition `showLeaveBalanceModal && (` has `(` at startIdx + condition.length - 1
  let searchStart = startIdx + modal.condition.length - 1;
  let parenCount = 0;
  let endIdx = -1;
  for (let i = searchStart; i < content.length; i++) {
    if (content[i] === '(') {
      parenCount++;
    } else if (content[i] === ')') {
      parenCount--;
      if (parenCount === 0) {
        endIdx = i;
        break;
      }
    }
  }

  if (endIdx !== -1) {
    fs.writeFileSync(`temp_${modal.name}.txt`, content.substring(startIdx, endIdx + 1), 'utf8');
  }
}
