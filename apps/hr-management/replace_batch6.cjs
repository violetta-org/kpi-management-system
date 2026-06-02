const fs = require('fs');

let content = fs.readFileSync('src/app.tsx', 'utf8');

// 1. Imports
const imports = `import { ChangeRequestApprovalModal } from './components/modals/ChangeRequestApprovalModal';
import { ResourceAllocationModal } from './components/modals/ResourceAllocationModal';
import { RiskModal } from './components/modals/RiskModal';\n`;

content = content.replace("import { NotificationsModal } from './components/modals/NotificationsModal';", "import { NotificationsModal } from './components/modals/NotificationsModal';\n" + imports);


// 2. Replacements
const approvalModalCode = fs.readFileSync('temp_ApprovalModal.txt', 'utf8');
const allocationModalCode = fs.readFileSync('temp_AllocationModal.txt', 'utf8');
const riskModalCode = fs.readFileSync('temp_RiskModal.txt', 'utf8');

content = content.replace(approvalModalCode, `showApprovalModal && approvalModalData && (
  <ChangeRequestApprovalModal
    isOpen={showApprovalModal}
    onClose={() => {
      setShowApprovalModal(false);
      setIsLoading(false);
    }}
    approvalModalData={approvalModalData}
    entityLabel={ENTITY_MAPPINGS[approvalModalData.entityName]?.label || approvalModalData.entityName}
    onSubmit={(reason, approverId) => {
      handleSubmittingApprovalRequest(reason, approverId);
    }}
  />
)`);

content = content.replace(allocationModalCode, `showAllocationModal && (
  <ResourceAllocationModal
    isOpen={showAllocationModal}
    onClose={() => { setShowAllocationModal(false); setEditingAllocation(null); }}
    onSave={handleSaveAllocation}
    editingAllocation={editingAllocation}
    usersList={usersList}
    projects={projects}
    aiSuggestions={aiSuggestions}
    onGenerateAiSuggestions={generateAiSuggestions}
  />
)`);

content = content.replace(riskModalCode, `showRiskModal && (
  <RiskModal
    isOpen={showRiskModal}
    onClose={() => {
      setShowRiskModal(false);
      setEditingRisk(null);
    }}
    onSave={handleSaveRisk}
    editingRisk={editingRisk}
  />
)`);

// 3. Clean up states
const toReplace = [
  /requestReason, setRequestReason,\n?/g,
  /selectedApproverId, setSelectedApproverId,\n?/g,
  /allocationUser, setAllocationUser,\n?/g,
  /allocationProject, setAllocationProject,\n?/g,
  /allocationName, setAllocationName,\n?/g,
  /allocationPercentage, setAllocationPercentage,\n?/g,
  /showAiSuggestions, setShowAiSuggestions,\n?/g,
  /aiFilterSameDept, setAiFilterSameDept,\n?/g,
  /newRiskName, setNewRiskName,\n?/g,
  /newRiskImpact, setNewRiskImpact,\n?/g,
  /newRiskProbability, setNewRiskProbability,\n?/g,
  /newRiskMitigation, setNewRiskMitigation,\n?/g,

  /setRequestReason\(.*?\);\n?/g,
  /setSelectedApproverId\(.*?\);\n?/g,
  /setAllocationUser\(.*?\);\n?/g,
  /setAllocationProject\(.*?\);\n?/g,
  /setAllocationName\(.*?\);\n?/g,
  /setAllocationPercentage\(.*?\);\n?/g,
  /setShowAiSuggestions\(.*?\);\n?/g,
  /setAiFilterSameDept\(.*?\);\n?/g,
  /setNewRiskName\(.*?\);\n?/g,
  /setNewRiskImpact\(.*?\);\n?/g,
  /setNewRiskProbability\(.*?\);\n?/g,
  /setNewRiskMitigation\(.*?\);\n?/g
];

toReplace.forEach(r => {
  content = content.replace(r, '');
});

fs.writeFileSync('src/app.tsx', content, 'utf8');
