const fs = require('fs');

const appPath = 'src/app.tsx';
let appContent = fs.readFileSync(appPath, 'utf8');

// 1. Remove duplicate Modals imports
const duplicateImportBlock = `import { TaskModal } from './components/modals/TaskModal';
import { LeaveRequestModal } from './components/modals/LeaveRequestModal';
import { TimesheetModal } from './components/modals/TimesheetModal';
import { KpiModal } from './components/modals/KpiModal';`;

// It might be present multiple times, keep only the first one
const firstIdx = appContent.indexOf(duplicateImportBlock);
if (firstIdx !== -1) {
  const nextIdx = appContent.indexOf(duplicateImportBlock, firstIdx + 1);
  if (nextIdx !== -1) {
    appContent = appContent.substring(0, nextIdx) + appContent.substring(nextIdx + duplicateImportBlock.length);
    console.log('Removed duplicate modal import');
  }
}

// 2. Remove unused variables destructured from useAppState()
const unusedVars = [
  'newLeaveType', 'setNewLeaveType', 'newLeaveStartDate', 'setNewLeaveStartDate', 'newLeaveEndDate', 'setNewLeaveEndDate', 'newLeaveReason', 'setNewLeaveReason',
  'kpiTargetName', 'setKpiTargetName', 'kpiTargetValue', 'setKpiTargetValue', 'kpiActualValue', 'setKpiActualValue', 'kpiWeight', 'setKpiWeight', 'kpiUnit', 'setKpiUnit',
  'kpiEmployeeId', 'setKpiEmployeeId', 'kpiObjectiveId', 'setKpiObjectiveId', 'kpiLibraryId', 'setKpiLibraryId', 'kpiPeriod', 'setKpiPeriod', 'kpiParentKpiId', 'setKpiParentKpiId',
  'kpiRollupMethod', 'setKpiRollupMethod', 'kpiStandardHoursLimit', 'setKpiStandardHoursLimit', 'kpiActiveTasksLimit', 'setKpiActiveTasksLimit',
  'newTaskName', 'setNewTaskName', 'newTaskDesc', 'setNewTaskDesc', 'newTaskAssigneeId', 'setNewTaskAssigneeId', 'newTaskDueDate', 'setNewTaskDueDate',
  'newTaskObjectiveId', 'setNewTaskObjectiveId', 'newTaskParentId', 'setNewTaskParentId', 'newTaskProjectId', 'setNewTaskProjectId', 'newTaskPhaseId', 'setNewTaskPhaseId',
  'newTaskStatus', 'setNewTaskStatus', 'newTaskKpiTargetId', 'setNewTaskKpiTargetId',
  'newTimesheetHours', 'setNewTimesheetHours', 'newTimesheetDate', 'setNewTimesheetDate', 'newTimesheetDesc', 'setNewTimesheetDesc', 'newTimesheetTaskId', 'setNewTimesheetTaskId'
];

for (let v of unusedVars) {
  const regex = new RegExp(`^\\s*${v},\\s*$`, 'gm');
  appContent = appContent.replace(regex, '');
}

fs.writeFileSync(appPath, appContent, 'utf8');

// 3. Fix TaskModal.tsx
const taskModalPath = 'src/components/modals/TaskModal.tsx';
let taskModalContent = fs.readFileSync(taskModalPath, 'utf8');
taskModalContent = taskModalContent.replace('editingTask._cr5db_projectid_value', '(editingTask as any)._cr5db_projectid_value');
taskModalContent = taskModalContent.replace('editingTask.cr5db_duedate', 'editingTask.cr5db_due_date');
fs.writeFileSync(taskModalPath, taskModalContent, 'utf8');

console.log('Fixes applied successfully!');
