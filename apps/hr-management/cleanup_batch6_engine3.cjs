const fs = require('fs');

let contentApp = fs.readFileSync('src/app.tsx', 'utf8');

const regexImportBlock = /import { ChangeRequestApprovalModal } from '.\/components\/modals\/ChangeRequestApprovalModal';\nimport { ResourceAllocationModal } from '.\/components\/modals\/ResourceAllocationModal';\nimport { RiskModal } from '.\/components\/modals\/RiskModal';\n/g;

// remove all matches, then add one back at the top
contentApp = contentApp.replace(regexImportBlock, '');
contentApp = contentApp.replace("import { NotificationsModal } from './components/modals/NotificationsModal';", "import { NotificationsModal } from './components/modals/NotificationsModal';\nimport { ChangeRequestApprovalModal } from './components/modals/ChangeRequestApprovalModal';\nimport { ResourceAllocationModal } from './components/modals/ResourceAllocationModal';\nimport { RiskModal } from './components/modals/RiskModal';\n");

// Also fix setNewRiskImpact in handleEditRisk if still there
const regexSetImpact = /setNewRiskImpact\([\s\S]*?\);/g;
contentApp = contentApp.replace(regexSetImpact, '');
const regexSetProb = /setNewRiskProbability\([\s\S]*?\);/g;
contentApp = contentApp.replace(regexSetProb, '');

fs.writeFileSync('src/app.tsx', contentApp, 'utf8');
