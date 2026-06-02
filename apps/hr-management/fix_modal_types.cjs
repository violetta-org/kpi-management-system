const fs = require('fs');

let changeReqContent = fs.readFileSync('src/components/modals/ChangeRequestApprovalModal.tsx', 'utf8');
changeReqContent = changeReqContent.replace("import { User } from '../../generated';", "");
changeReqContent = changeReqContent.replace("validApprovers.map((user: User)", "validApprovers.map((user: any)");
fs.writeFileSync('src/components/modals/ChangeRequestApprovalModal.tsx', changeReqContent, 'utf8');

let resAllocContent = fs.readFileSync('src/components/modals/ResourceAllocationModal.tsx', 'utf8');
resAllocContent = resAllocContent.replace("import { User, Project } from '../../generated';", "");
resAllocContent = resAllocContent.replace("export interface AiSuggestion {\n  user: User;\n  fitScore: number;\n}", "export interface AiSuggestion {\n  user: any;\n  fitScore: number;\n}");
resAllocContent = resAllocContent.replace("usersList: User[];", "usersList: any[];");
resAllocContent = resAllocContent.replace("projects: Project[];", "projects: any[];");
fs.writeFileSync('src/components/modals/ResourceAllocationModal.tsx', resAllocContent, 'utf8');
