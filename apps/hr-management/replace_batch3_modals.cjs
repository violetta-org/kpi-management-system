const fs = require('fs');

let content = fs.readFileSync('src/app.tsx', 'utf8');

function replaceModal(condition, componentName, propMap) {
  const startStr = `${condition} && (`;
  const startIdx = content.indexOf(startStr);
  if (startIdx === -1) {
    console.log(`Could not find ${condition}`);
    return;
  }

  let endIdx = -1;
  let parenCount = 0;
  let started = false;
  for (let i = startIdx + startStr.length; i < content.length; i++) {
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
    let props = Object.entries(propMap).map(([k, v]) => `${k}={${v}}`).join('\n    ');
    let replacement = `<${componentName}\n    isOpen={${condition}}\n    ${props}\n  />`;
    content = content.substring(0, startIdx) + replacement + content.substring(endIdx + 1);
    console.log(`Replaced ${componentName}`);
  }
}

replaceModal('showPeriodModal', 'PeriodModal', {
  editingPeriod: 'editingPeriod',
  onClose: '() => setShowPeriodModal(false)',
  onSave: 'handleSavePeriod'
});

replaceModal('showAssignAppraisalModal', 'AssignAppraisalModal', {
  onClose: '() => setShowAssignAppraisalModal(false)',
  onSave: 'handleAssignAppraisal'
});

// Import them
if (!content.includes('import { PeriodModal }')) {
  content = content.replace("import { BonusMatrixModal } from './components/modals/BonusMatrixModal';", "import { BonusMatrixModal } from './components/modals/BonusMatrixModal';\nimport { PeriodModal } from './components/modals/PeriodModal';\nimport { AssignAppraisalModal } from './components/modals/AssignAppraisalModal';");
}

fs.writeFileSync('src/app.tsx', content, 'utf8');
