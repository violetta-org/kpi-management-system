const fs = require('fs');

let contentApp = fs.readFileSync('src/app.tsx', 'utf8');
contentApp = contentApp.replace(/setSelectedApproverId,?\s*/g, '');
contentApp = contentApp.replace(/setRequestReason,?\s*/g, '');
fs.writeFileSync('src/app.tsx', contentApp, 'utf8');

let contentEngine = fs.readFileSync('src/hooks/useApprovalEngine.ts', 'utf8');
contentEngine = contentEngine.replace(/ctx\.setSelectedApproverId\(/g, 'ctx.setSelectedApproverId?.(');
contentEngine = contentEngine.replace(/ctx\.setRequestReason\(/g, 'ctx.setRequestReason?.(');
fs.writeFileSync('src/hooks/useApprovalEngine.ts', contentEngine, 'utf8');
