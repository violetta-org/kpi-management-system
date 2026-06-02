const fs = require('fs');

let content = fs.readFileSync('src/hooks/useApprovalEngine.ts', 'utf8');

const regex = /const handleSubmittingApprovalRequest = async \(\) => \{[\s\S]*?ctx\.setIsLoading\(false\);\n    \}\n  \};/;

const match = content.match(regex);
if (match) {
  let newFunc = match[0].replace('const handleSubmittingApprovalRequest = async () => {', 'const handleSubmittingApprovalRequest = async (reason?: string, approverId?: string) => {\n    const finalReason = reason || ctx.requestReason;\n    const finalApproverId = approverId || ctx.selectedApproverId;');
  newFunc = newFunc.replace(/!ctx\.requestReason\.trim\(\)/g, '!finalReason?.trim()');
  newFunc = newFunc.replace(/!ctx\.selectedApproverId/g, '!finalApproverId');
  newFunc = newFunc.replace(/ctx\.requestReason/g, 'finalReason');
  newFunc = newFunc.replace(/ctx\.selectedApproverId/g, 'finalApproverId');
  
  content = content.replace(match[0], newFunc);
  fs.writeFileSync('src/hooks/useApprovalEngine.ts', content, 'utf8');
  console.log("Updated useApprovalEngine.ts");
} else {
  console.log("Could not find handleSubmittingApprovalRequest");
}
