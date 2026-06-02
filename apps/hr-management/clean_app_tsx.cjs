const fs = require('fs');

let content = fs.readFileSync('src/app.tsx', 'utf8');

// 1. Remove all unused setters
const toReplace = [
  /setNewCompanyCode\\(.*?\\);?/g,
  /setNewCompanyName\\(.*?\\);?/g,
  /setNewDeptCode\\(.*?\\);?/g,
  /setNewDeptName\\(.*?\\);?/g,
  /setNewCatalogCode\\(.*?\\);?/g,
  /setNewCatalogName\\(.*?\\);?/g,
  /setNewJobPosName\\(.*?\\);?/g,
  /setNewJobPosDeptId\\(.*?\\);?/g,
  /setNewJobPosCatalogId\\(.*?\\);?/g,
  /setNewJobPosQuota\\(.*?\\);?/g,
  /setNewJobPosCompetencyIds\\(.*?\\);?/g,
  /setSelectedReportsToPositionId\\(.*?\\);?/g,
  /setNewJobCompetencyId\\(.*?\\);?/g // Since TS suggested it? Wait, let's just wipe out the exact matches
];

toReplace.forEach(r => {
  content = content.replace(r, '');
});

// 2. Fix handleAddJobPosition body precisely
const oldJobPosVars = [
  /newJobPosName/g,
  /newJobPosDeptId/g,
  /newJobPosCatalogId/g,
  /newJobPosQuota/g,
  /selectedReportsToPositionId/g,
  /newJobPosCompetencyIds/g
];

const newJobPosVars = [
  'data.name',
  'data.deptId',
  'data.catalogId',
  'data.quota',
  'data.reportsToId',
  'data.competencyIds'
];

let startIdx = content.indexOf('const handleAddJobPosition = async (data: {');
if (startIdx !== -1) {
  let endIdx = -1;
  let braceCount = 0;
  let started = false;
  for (let i = startIdx; i < content.length; i++) {
    if (content[i] === '{') {
      braceCount++;
      started = true;
    } else if (content[i] === '}') {
      braceCount--;
    }
    if (started && braceCount === 0) {
      endIdx = i;
      break;
    }
  }

  if (endIdx !== -1) {
    let handlerBody = content.substring(startIdx, endIdx + 1);
    
    // Perform regex replacements
    for (let i = 0; i < oldJobPosVars.length; i++) {
      handlerBody = handlerBody.replace(oldJobPosVars[i], newJobPosVars[i]);
    }
    
    content = content.substring(0, startIdx) + handlerBody + content.substring(endIdx + 1);
    console.log('Fixed handleAddJobPosition body');
  }
}

// 3. Remove from edit handlers
const editCompanyMatch = content.match(/const handleEditCompany = \\(company: any\\) => {[\\s\\S]*?setEditingCompany\\(company\\);\\n}/);
if (editCompanyMatch) {
  let body = editCompanyMatch[0];
  body = body.replace(/setNewCompanyCode\\(.*?\\);\\n/g, '');
  body = body.replace(/setNewCompanyName\\(.*?\\);\\n/g, '');
  content = content.replace(editCompanyMatch[0], body);
}

// We can just regex replace all remaining literal strings if they exist
content = content.replace(/setNewJobPosName\\(.*?\\);\\n/g, '');
content = content.replace(/setNewJobPosDeptId\\(.*?\\);\\n/g, '');
content = content.replace(/setNewJobPosCatalogId\\(.*?\\);\\n/g, '');
content = content.replace(/setNewJobPosQuota\\(.*?\\);\\n/g, '');
content = content.replace(/setSelectedReportsToPositionId\\(.*?\\);\\n/g, '');
content = content.replace(/setNewJobPosCompetencyIds\\(.*?\\);\\n/g, '');
content = content.replace(/setNewCompanyCode\\(.*?\\);\\n/g, '');
content = content.replace(/setNewCompanyName\\(.*?\\);\\n/g, '');
content = content.replace(/setNewDeptCode\\(.*?\\);\\n/g, '');
content = content.replace(/setNewDeptName\\(.*?\\);\\n/g, '');
content = content.replace(/setNewCatalogCode\\(.*?\\);\\n/g, '');
content = content.replace(/setNewCatalogName\\(.*?\\);\\n/g, '');

fs.writeFileSync('src/app.tsx', content, 'utf8');
console.log('Done cleanup');
