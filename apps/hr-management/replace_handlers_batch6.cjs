const fs = require('fs');

let content = fs.readFileSync('src/app.tsx', 'utf8');

// Replace handleSaveAllocation
let handleSaveAllocationOld = content.match(/const handleSaveAllocation = async \(e: React\.FormEvent\) => \{[\s\S]*?\n  \};/);
if (handleSaveAllocationOld) {
  let newFunc = handleSaveAllocationOld[0].replace('const handleSaveAllocation = async (e: React.FormEvent) => {', 'const handleSaveAllocation = async (data: { userId: string; projectId: string; name: string; percentage: number }) => {')
    .replace('e.preventDefault();\n', '')
    .replace('if (!allocationUser || !allocationProject) {', 'if (!data.userId || !data.projectId) {')
    .replace(/allocationUser/g, 'data.userId')
    .replace(/allocationProject/g, 'data.projectId')
    .replace(/allocationName/g, 'data.name')
    .replace(/allocationPercentage/g, 'data.percentage');
    
  content = content.replace(handleSaveAllocationOld[0], newFunc);
}

// Replace handleSaveRisk
let handleSaveRiskOld = content.match(/const handleSaveRisk = async \(e: React\.FormEvent\) => \{[\s\S]*?\n  \};/);
if (handleSaveRiskOld) {
  let newFunc = handleSaveRiskOld[0].replace('const handleSaveRisk = async (e: React.FormEvent) => {', 'const handleSaveRisk = async (data: { name: string; impact: string; probability: string; mitigation: string }) => {')
    .replace('e.preventDefault();\n', '')
    .replace('if (!activeProjectDetails || !newRiskName.trim()) return;', 'if (!activeProjectDetails || !data.name.trim()) return;')
    .replace(/newRiskName/g, 'data.name')
    .replace(/newRiskImpact/g, 'data.impact')
    .replace(/newRiskProbability/g, 'data.probability')
    .replace(/newRiskMitigation/g, 'data.mitigation');
    
  content = content.replace(handleSaveRiskOld[0], newFunc);
}

fs.writeFileSync('src/app.tsx', content, 'utf8');
