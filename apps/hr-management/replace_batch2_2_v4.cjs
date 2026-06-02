const fs = require('fs');

let content = fs.readFileSync('src/app.tsx', 'utf8');

// 1. Add imports
const imports = `import { CompanyModal } from './components/modals/CompanyModal';
import { DepartmentModal } from './components/modals/DepartmentModal';
import { PositionCatalogModal } from './components/modals/PositionCatalogModal';
import { JobPositionModal } from './components/modals/JobPositionModal';
`;
content = content.replace("import { BonusMatrixModal } from './components/modals/BonusMatrixModal';", "import { BonusMatrixModal } from './components/modals/BonusMatrixModal';\n" + imports);


const replaceInHandler = (handlerName, oldVars, newVars, oldSig, newSig) => {
  const startIdx = content.indexOf(oldSig);
  if (startIdx === -1) {
    console.log('Failed to find signature for ' + handlerName);
    return;
  }
  
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

replaceInHandler(
  'handleAddCompany',
  ['newCompanyCode', 'newCompanyName'],
  ['data.code', 'data.name'],
  'const handleAddCompany = async (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!newCompanyCode.trim() || !newCompanyName.trim()) return;',
  'const handleAddCompany = async (data: { code: string; name: string }) => {\n    if (!data.code.trim() || !data.name.trim()) return;'
);

replaceInHandler(
  'handleAddDepartment',
  ['newDeptCode', 'newDeptName', 'selectedDeptCompanyId \\? `\\/cr5db_companies\\(\\$\\{selectedDeptCompanyId\\}\\)` : undefined'],
  ['data.code', 'data.name', 'data.companyId ? `/cr5db_companies(${data.companyId})` : undefined'],
  'const handleAddDepartment = async (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!newDeptCode.trim() || !newDeptName.trim()) return;',
  'const handleAddDepartment = async (data: { code: string; name: string; companyId: string }) => {\n    if (!data.code.trim() || !data.name.trim()) return;'
);

replaceInHandler(
  'handleAddCatalog',
  ['newCatalogCode', 'newCatalogName'],
  ['data.code', 'data.name'],
  'const handleAddCatalog = async (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!newCatalogCode.trim() || !newCatalogName.trim()) return;',
  'const handleAddCatalog = async (data: { code: string; name: string }) => {\n    if (!data.code.trim() || !data.name.trim()) return;'
);

replaceInHandler(
  'handleAddJobPosition',
  ['newJobPosName', 'newJobPosDeptId', 'newJobPosCatalogId', 'newJobPosQuota', 'selectedReportsToPositionId', 'newJobPosCompetencyIds'],
  ['data.name', 'data.deptId', 'data.catalogId', 'data.quota', 'data.reportsToId', 'data.competencyIds'],
  'const handleAddJobPosition = async (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!newJobPosName.trim()) return;',
  'const handleAddJobPosition = async (data: { name: string; deptId: string; catalogId: string; quota: number; reportsToId: string; competencyIds: string[] }) => {\n    if (!data.name.trim()) return;'
);


// Extract Modal blocks by looking for the actual boolean conditions
const replaceModalBlock = (conditionString, newBlock) => {
  const startStr = "{\n  " + conditionString + " && (";
  const startIdx = content.indexOf(startStr);
  if (startIdx === -1) {
    console.log('Failed to find start string: ' + startStr);
    return;
  }
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

  if (endIdx !== -1) {
    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx + 1);
    content = before + newBlock + after;
    console.log('Replaced block for ' + conditionString);
  } else {
    console.log('Failed to find end of block for ' + conditionString);
  }
}

replaceModalBlock("showCompanyModal", `{
  <CompanyModal
    isOpen={showCompanyModal}
    editingCompany={editingCompany}
    onClose={() => {
      setShowCompanyModal(false);
      setEditingCompany(null);
    }}
    onSave={handleAddCompany}
  />
}`);

replaceModalBlock("showDeptModal", `{
  <DepartmentModal
    isOpen={showDeptModal}
    editingDept={editingDept}
    companiesList={companiesList}
    defaultCompanyId={companiesList[0]?.cr5db_companyid || ''}
    onClose={() => {
      setShowDeptModal(false);
      setEditingDept(null);
    }}
    onSave={handleAddDepartment}
  />
}`);

replaceModalBlock("showCatalogModal", `{
  <PositionCatalogModal
    isOpen={showCatalogModal}
    editingCatalog={editingCatalog}
    onClose={() => {
      setShowCatalogModal(false);
      setEditingCatalog(null);
    }}
    onSave={handleAddCatalog}
  />
}`);

replaceModalBlock("showJobPositionModal", `{
  <JobPositionModal
    isOpen={showJobPositionModal}
    editingJobPosition={editingJobPosition}
    departmentsList={departmentsList}
    companiesList={companiesList}
    positionCatalogList={positionCatalogList}
    jobPositionsList={jobPositionsList}
    competencyCatalogList={competencyCatalogList}
    onClose={() => {
      setShowJobPositionModal(false);
      setEditingJobPosition(null);
    }}
    onSave={handleAddJobPosition}
  />
}`);


// Clean up unused vars from the destructuring in the top of app.tsx
const varsToRemove = [
  'newCompanyCode, setNewCompanyCode,',
  'newCompanyName, setNewCompanyName,',
  'newDeptCode, setNewDeptCode,',
  'newDeptName, setNewDeptName,',
  'newCatalogCode, setNewCatalogCode,',
  'newCatalogName, setNewCatalogName,',
  'newJobPosName, setNewJobPosName,',
  'newJobPosDeptId, setNewJobPosDeptId,',
  'newJobPosCatalogId, setNewJobPosCatalogId,',
  'newJobPosQuota, setNewJobPosQuota,',
  'newJobPosCompetencyIds, setNewJobPosCompetencyIds,'
];

let top = content.substring(0, 10000);
let bottom = content.substring(10000);

for (let v of varsToRemove) {
  top = top.replace(v, '');
}

content = top + bottom;

// Clean up setNew... calls in edit handlers!
content = content.replace(/setNewCompanyCode\\(.*?\\);\\n/g, '');
content = content.replace(/setNewCompanyName\\(.*?\\);\\n/g, '');
content = content.replace(/setNewDeptCode\\(.*?\\);\\n/g, '');
content = content.replace(/setNewDeptName\\(.*?\\);\\n/g, '');
content = content.replace(/setNewCatalogCode\\(.*?\\);\\n/g, '');
content = content.replace(/setNewCatalogName\\(.*?\\);\\n/g, '');
content = content.replace(/setNewJobPosName\\(.*?\\);\\n/g, '');
content = content.replace(/setNewJobPosDeptId\\(.*?\\);\\n/g, '');
content = content.replace(/setNewJobPosCatalogId\\(.*?\\);\\n/g, '');
content = content.replace(/setNewJobPosQuota\\(.*?\\);\\n/g, '');
content = content.replace(/setSelectedReportsToPositionId\\(.*?\\);\\n/g, '');
content = content.replace(/setNewJobPosCompetencyIds\\(.*?\\);\\n/g, '');

// Also I noticed some unused variables in Onboarding
// But let's leave them for their respective phases. We only removed the variables that are exclusively used by these 4 modals.

fs.writeFileSync('src/app.tsx', content, 'utf8');
console.log('Batch 2.2 replacements v4 done!');
