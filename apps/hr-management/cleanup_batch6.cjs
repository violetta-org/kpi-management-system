const fs = require('fs');

let content = fs.readFileSync('src/app.tsx', 'utf8');

const statesToRemove = [
  "const [allocationUser, setAllocationUser] = React.useState('');\n",
  "const [allocationProject, setAllocationProject] = React.useState('');\n",
  "const [allocationPercentage, setAllocationPercentage] = React.useState(100);\n",
  "const [allocationName, setAllocationName] = React.useState('');\n",
  "const [showAiSuggestions, setShowAiSuggestions] = React.useState(false);\n",
  "const [aiFilterSameDept, setAiFilterSameDept] = React.useState(false);\n",
  "const [requestReason, setRequestReason] = React.useState('');\n",
  "const [selectedApproverId, setSelectedApproverId] = React.useState('');\n",
  "const [newRiskName, setNewRiskName] = React.useState('');\n",
  "const [newRiskImpact, setNewRiskImpact] = React.useState('Medium');\n",
  "const [newRiskProbability, setNewRiskProbability] = React.useState('Medium');\n",
  "const [newRiskMitigation, setNewRiskMitigation] = React.useState('');\n"
];

statesToRemove.forEach(state => {
  content = content.replace(state, '');
});

// Remove handleEditRisk setters
const handleEditRiskRegex = /const handleEditRisk = \(risk: any\) => \{([\s\S]*?)\};/;
const match = content.match(handleEditRiskRegex);
if (match) {
  content = content.replace(match[0], `const handleEditRisk = (risk: any) => {
    setEditingRisk(risk);
    setShowRiskModal(true);
  };`);
}

// Remove requestReason and selectedApproverId from useApprovalEngine call
content = content.replace('requestReason, selectedApproverId,', '');

fs.writeFileSync('src/app.tsx', content, 'utf8');
