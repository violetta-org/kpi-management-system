const fs = require('fs');

let content = fs.readFileSync('src/app.tsx', 'utf8');

// The PeriodModal block:
// from `showPeriodModal && (` to the closing `  )\n}\n\n`
const periodStartStr = 'showPeriodModal && (\n    <div className="modal-overlay">';
const periodEndStr = '  )\n}';

let startIdx = content.indexOf(periodStartStr);
if (startIdx !== -1) {
  // Back up to the start of `{` if there is one? No, the code is:
  // showPeriodModal && (
  //   <div className="modal-overlay">
  let endIdx = content.indexOf(periodEndStr, startIdx);
  if (endIdx !== -1) {
    let toReplace = content.substring(startIdx, endIdx + periodEndStr.length);
    let replacement = `<PeriodModal\n    isOpen={showPeriodModal}\n    editingPeriod={editingPeriod}\n    onClose={() => setShowPeriodModal(false)}\n    onSave={handleSavePeriod}\n  />`;
    content = content.replace(toReplace, replacement);
    console.log('Replaced PeriodModal block');
  }
}

// The AssignAppraisalModal block:
// from `{/* Assign Appraisal Modal */ }` to `  )\n}`
const assignStartStr = '{/* Assign Appraisal Modal */ }\n{\n  showAssignAppraisalModal && (\n    <div className="modal-overlay">';
const assignEndStr = '      </div>\n    </div>\n  )\n}';

startIdx = content.indexOf('{/* Assign Appraisal Modal */ }');
if (startIdx !== -1) {
  let endIdx = content.indexOf('  )\n}', startIdx);
  if (endIdx !== -1) {
    let toReplace = content.substring(startIdx, endIdx + 5);
    let replacement = `{/* Assign Appraisal Modal */ }\n{\n  <AssignAppraisalModal\n    isOpen={showAssignAppraisalModal}\n    onClose={() => setShowAssignAppraisalModal(false)}\n    onSave={handleAssignAppraisal}\n  />\n}`;
    content = content.replace(toReplace, replacement);
    console.log('Replaced AssignAppraisalModal block');
  }
}

// Import them
if (!content.includes('import { PeriodModal }')) {
  content = content.replace("import { BonusMatrixModal } from './components/modals/BonusMatrixModal';", "import { BonusMatrixModal } from './components/modals/BonusMatrixModal';\nimport { PeriodModal } from './components/modals/PeriodModal';\nimport { AssignAppraisalModal } from './components/modals/AssignAppraisalModal';");
}

fs.writeFileSync('src/app.tsx', content, 'utf8');
