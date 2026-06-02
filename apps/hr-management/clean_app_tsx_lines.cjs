const fs = require('fs');

let content = fs.readFileSync('src/app.tsx', 'utf8');
const lines = content.split('\n');

const varsToPurge = [
  'setNewCompanyCode', 'setNewCompanyName',
  'setNewDeptCode', 'setNewDeptName',
  'setNewCatalogCode', 'setNewCatalogName',
  'setNewJobPosName', 'setNewJobPosQuota', 'setNewJobPosDeptId', 'setNewJobPosCatalogId', 'setNewJobPosCompetencyIds',
  'newJobPosName', 'newJobPosQuota', 'newJobPosDeptId', 'newJobPosCatalogId', 'newJobPosCompetencyIds',
  'setSelectedReportsToPositionId'
];

// For the variables we want to purge, if a line CONTAINS it, what do we do?
// If it's a setter like `setNewCompanyCode('');`, we just delete the line.
// But what if it's in an object `{ setNewJobPosDeptId }`? Delete the line.
// What if it's in a payload like `cr5db_positionname: newJobPosName,`?
// That shouldn't exist anymore because handleAddJobPosition was supposed to be replaced!
// Wait! Let's check handleAddJobPosition first.

let newLines = [];
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  // Skip lines that are just setting the unused variables
  if (
    line.includes('setNewCompanyCode') ||
    line.includes('setNewCompanyName') ||
    line.includes('setNewDeptCode') ||
    line.includes('setNewDeptName') ||
    line.includes('setNewCatalogCode') ||
    line.includes('setNewCatalogName') ||
    line.includes('setNewJobPosName') ||
    line.includes('setNewJobPosQuota') ||
    line.includes('setNewJobPosDeptId') ||
    line.includes('setNewJobPosCatalogId') ||
    line.includes('setNewJobPosCompetencyIds') ||
    line.includes('setSelectedReportsToPositionId')
  ) {
    continue;
  }
  
  // Wait, if it's newJobPosName inside handleAddJobPosition:
  if (line.includes('newJobPosName')) {
    line = line.replace(/newJobPosName/g, 'data.name');
  }
  if (line.includes('newJobPosQuota')) {
    line = line.replace(/newJobPosQuota/g, 'data.quota');
  }
  if (line.includes('newJobPosDeptId')) {
    line = line.replace(/newJobPosDeptId/g, 'data.deptId');
  }
  if (line.includes('newJobPosCatalogId')) {
    line = line.replace(/newJobPosCatalogId/g, 'data.catalogId');
  }
  if (line.includes('newJobPosCompetencyIds')) {
    line = line.replace(/newJobPosCompetencyIds/g, 'data.competencyIds');
  }
  
  newLines.push(line);
}

fs.writeFileSync('src/app.tsx', newLines.join('\n'), 'utf8');
console.log('Cleaned up by deleting lines with setters.');
