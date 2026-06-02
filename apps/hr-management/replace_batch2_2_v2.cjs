const fs = require('fs');

let content = fs.readFileSync('src/app.tsx', 'utf8');

// 1. Add imports
const imports = `import { CompanyModal } from './components/modals/CompanyModal';
import { DepartmentModal } from './components/modals/DepartmentModal';
import { PositionCatalogModal } from './components/modals/PositionCatalogModal';
import { JobPositionModal } from './components/modals/JobPositionModal';
`;
content = content.replace("import { BonusMatrixModal } from './components/modals/BonusMatrixModal';", "import { BonusMatrixModal } from './components/modals/BonusMatrixModal';\n" + imports);


// 2. Replace Handlers
// To avoid global replacing, I will only replace within the specific handler functions!

const replaceInHandler = (handlerName, oldVars, newVars, oldSig, newSig) => {
  const startIdx = content.indexOf(oldSig);
  if (startIdx === -1) {
    console.log('Failed to find signature for ' + handlerName);
    return;
  }
  const endIdx = content.indexOf('};', startIdx);
  if (endIdx === -1) return;

  let handlerBody = content.substring(startIdx, endIdx + 2);
  handlerBody = handlerBody.replace(oldSig, newSig);

  for (let i = 0; i < oldVars.length; i++) {
    handlerBody = handlerBody.replace(new RegExp(oldVars[i], 'g'), newVars[i]);
  }

  content = content.substring(0, startIdx) + handlerBody + content.substring(endIdx + 2);
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
  'const handleAddJobPosition = async (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!newJobPosName.trim() || !newJobPosDeptId || !newJobPosCatalogId) return;',
  'const handleAddJobPosition = async (data: { name: string; deptId: string; catalogId: string; quota: number; reportsToId: string; competencyIds: string[] }) => {\n    if (!data.name.trim() || !data.deptId || !data.catalogId) return;'
);


// 3. Replace JSX Blocks
const replaceBlock = (startMarker, endMarker, newBlock) => {
  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker, startIdx);
  if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx);
    content = before + newBlock + '\n\n' + after;
    console.log('Replaced block from ' + startMarker);
  } else {
    console.log('Failed to find block from ' + startMarker);
  }
};

const companyModalJSX = `{/* Company Modal */ }
{
  <CompanyModal
    isOpen={showCompanyModal}
    editingCompany={editingCompany}
    onClose={() => {
      setShowCompanyModal(false);
      setEditingCompany(null);
    }}
    onSave={handleAddCompany}
  />
}`;
replaceBlock('{/* Company Modal */ }', '{/* Department Modal */ }', companyModalJSX);

const deptModalJSX = `{/* Department Modal */ }
{
  <DepartmentModal
    isOpen={showDeptModal}
    editingDept={editingDept}
    companiesList={companiesList}
    defaultCompanyId={activeCompanyTab === 'all' ? '' : activeCompanyTab}
    onClose={() => {
      setShowDeptModal(false);
      setEditingDept(null);
    }}
    onSave={handleAddDepartment}
  />
}`;
replaceBlock('{/* Department Modal */ }', '{/* Position Catalog Modal */ }', deptModalJSX);

const catalogModalJSX = `{/* Position Catalog Modal */ }
{
  <PositionCatalogModal
    isOpen={showCatalogModal}
    editingCatalog={editingCatalog}
    onClose={() => {
      setShowCatalogModal(false);
      setEditingCatalog(null);
    }}
    onSave={handleAddCatalog}
  />
}`;
replaceBlock('{/* Position Catalog Modal */ }', '{/* Job Position Modal */ }', catalogModalJSX);

const jobPositionModalJSX = `{/* Job Position Modal */ }
{
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
}`;
replaceBlock('{/* Job Position Modal */ }', '{/* Role Assignment Modal */ }', jobPositionModalJSX);

// 4. Clean up unused vars from the destructuring in the top of app.tsx
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


fs.writeFileSync('src/app.tsx', content, 'utf8');
console.log('Batch 2.2 replacements v2 done!');
