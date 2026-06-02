const fs = require('fs');

let content = fs.readFileSync('src/app.tsx', 'utf8');

const replaceInHandler = (handlerName, oldVars, newVars, oldSig, newSig) => {
  const startIdx = content.indexOf(oldSig);
  if (startIdx === -1) {
    console.log('Failed to find signature for ' + handlerName);
    return;
  }
  
  // Find the end of the handler by counting braces
  let braceCount = 0;
  let endIdx = -1;
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

  if (endIdx === -1) {
    console.log('Failed to find end for ' + handlerName);
    return;
  }

  let handlerBody = content.substring(startIdx, endIdx + 1);
  handlerBody = handlerBody.replace(oldSig, newSig);

  for (let i = 0; i < oldVars.length; i++) {
    handlerBody = handlerBody.replace(new RegExp(oldVars[i], 'g'), newVars[i]);
  }

  content = content.substring(0, startIdx) + handlerBody + content.substring(endIdx + 1);
  console.log('Replaced vars in ' + handlerName);
};

// Undo the partial replacement from v2
content = content.replace(
  'const handleAddJobPosition = async (data: { name: string; deptId: string; catalogId: string; quota: number; reportsToId: string; competencyIds: string[] }) => {\n  if (!data.name.trim()) return;',
  'const handleAddJobPosition = async (e: React.FormEvent) => {\n  e.preventDefault();\n  if (!newJobPosName.trim()) return;'
);

replaceInHandler(
  'handleAddJobPosition',
  ['newJobPosName', 'newJobPosDeptId', 'newJobPosCatalogId', 'newJobPosQuota', 'selectedReportsToPositionId', 'newJobPosCompetencyIds'],
  ['data.name', 'data.deptId', 'data.catalogId', 'data.quota', 'data.reportsToId', 'data.competencyIds'],
  'const handleAddJobPosition = async (e: React.FormEvent) => {\n  e.preventDefault();\n  if (!newJobPosName.trim()) return;',
  'const handleAddJobPosition = async (data: { name: string; deptId: string; catalogId: string; quota: number; reportsToId: string; competencyIds: string[] }) => {\n  if (!data.name.trim()) return;'
);

fs.writeFileSync('src/app.tsx', content, 'utf8');
console.log('Batch 2.2 replacements v3 done!');
