const fs = require('fs');

let content = fs.readFileSync('src/hooks/useApprovalEngine.ts', 'utf8');

content = content.replace("setSelectedApproverId: (v: string) => void;", "setSelectedApproverId?: (v: string) => void;");
content = content.replace("setRequestReason: (v: string) => void;", "setRequestReason?: (v: string) => void;");
content = content.replace("requestReason: string;", "requestReason?: string;");
content = content.replace("selectedApproverId: string;", "selectedApproverId?: string;");

fs.writeFileSync('src/hooks/useApprovalEngine.ts', content, 'utf8');
