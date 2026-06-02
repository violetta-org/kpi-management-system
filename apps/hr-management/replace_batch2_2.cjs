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
// Company
content = content.replace(
  'const handleAddCompany = async (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!newCompanyCode.trim() || !newCompanyName.trim()) return;',
  'const handleAddCompany = async (data: { code: string; name: string }) => {\n    if (!data.code.trim() || !data.name.trim()) return;'
);
content = content.replace(/newCompanyCode/g, 'data.code');
content = content.replace(/newCompanyName/g, 'data.name');

// Dept
content = content.replace(
  'const handleAddDepartment = async (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!newDeptCode.trim() || !newDeptName.trim()) return;',
  'const handleAddDepartment = async (data: { code: string; name: string; companyId: string }) => {\n    if (!data.code.trim() || !data.name.trim()) return;'
);
content = content.replace(/newDeptCode/g, 'data.code');
content = content.replace(/newDeptName/g, 'data.name');
// But wait, the selectedDeptCompanyId was also replaced globally?
// In app.tsx handleAddDepartment used selectedDeptCompanyId. I should replace it with data.companyId.
content = content.replace(
  /selectedDeptCompanyId \? `\/cr5db_companies\(\$\{selectedDeptCompanyId\}\)` : undefined/g,
  'data.companyId ? `/cr5db_companies(${data.companyId})` : undefined'
);


// Catalog
content = content.replace(
  'const handleAddCatalog = async (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!newCatalogCode.trim() || !newCatalogName.trim()) return;',
  'const handleAddCatalog = async (data: { code: string; name: string }) => {\n    if (!data.code.trim() || !data.name.trim()) return;'
);
content = content.replace(/newCatalogCode/g, 'data.code');
content = content.replace(/newCatalogName/g, 'data.name');


// JobPosition
content = content.replace(
  'const handleAddJobPosition = async (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!newJobPosName.trim() || !newJobPosDeptId || !newJobPosCatalogId) return;',
  'const handleAddJobPosition = async (data: { name: string; deptId: string; catalogId: string; quota: number; reportsToId: string; competencyIds: string[] }) => {\n    if (!data.name.trim() || !data.deptId || !data.catalogId) return;'
);
content = content.replace(/newJobPosName/g, 'data.name');
content = content.replace(/newJobPosDeptId/g, 'data.deptId');
content = content.replace(/newJobPosCatalogId/g, 'data.catalogId');
content = content.replace(/newJobPosQuota/g, 'data.quota');
content = content.replace(/selectedReportsToPositionId/g, 'data.reportsToId');
content = content.replace(/newJobPosCompetencyIds/g, 'data.competencyIds');


// 3. Replace JSX Blocks
// To be safe, we extract blocks between comments
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
// It's safer to just remove them directly
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

fs.writeFileSync('src/app.tsx', content, 'utf8');
console.log('Batch 2.2 replacements done!');
