const fs = require('fs');

let content = fs.readFileSync('src/app.tsx', 'utf8');

const toReplace = [
  /setNewPeriodName\(''\);\n?/g,
  /setNewPeriodStartDate\(''\);\n?/g,
  /setNewPeriodEndDate\(''\);\n?/g,
  /setNewAppraisalEmployeeId\(.*?\);\n?/g,
  /setNewAppraisalEvaluatorId\(.*?\);\n?/g,
  /setNewAppraisalPeriodId\(.*?\);\n?/g,
  /setNewAppraisalName\(''\);\n?/g,
  /newPeriodName, setNewPeriodName,\n?/g,
  /newPeriodStartDate, setNewPeriodStartDate,\n?/g,
  /newPeriodEndDate, setNewPeriodEndDate,\n?/g,
  /newAppraisalEmployeeId, setNewAppraisalEmployeeId,\n?/g,
  /newAppraisalEvaluatorId, setNewAppraisalEvaluatorId,\n?/g,
  /newAppraisalPeriodId, setNewAppraisalPeriodId,\n?/g,
  /newAppraisalName, setNewAppraisalName,\n?/g
];

toReplace.forEach(r => {
  content = content.replace(r, '');
});

// Remove inline setters from handleEditPeriod if exists
const editPeriodMatch = content.match(/setEditingPeriod\(period\);[\s\S]*?setShowPeriodModal\(true\);/);
if (editPeriodMatch) {
  let rep = editPeriodMatch[0].replace(/setNewPeriodName\(.*?\);\n?/g, '')
                              .replace(/setNewPeriodStartDate\(.*?\);\n?/g, '')
                              .replace(/setNewPeriodEndDate\(.*?\);\n?/g, '');
  content = content.replace(editPeriodMatch[0], rep);
}

fs.writeFileSync('src/app.tsx', content, 'utf8');
console.log('Cleaned up Period & AssignAppraisal modal state');
