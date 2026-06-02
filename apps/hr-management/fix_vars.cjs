const fs = require('fs');
const appPath = 'src/app.tsx';
let content = fs.readFileSync(appPath, 'utf8');

const vars = [
  'newLeaveType', 'setNewLeaveType', 'newLeaveStartDate', 'setNewLeaveStartDate', 'newLeaveEndDate', 'setNewLeaveEndDate', 'newLeaveReason', 'setNewLeaveReason',
  'kpiTargetName', 'setKpiTargetName', 'kpiTargetValue', 'setKpiTargetValue', 'kpiActualValue', 'setKpiActualValue', 'kpiWeight', 'setKpiWeight', 'kpiUnit', 'setKpiUnit',
  'kpiEmployeeId', 'setKpiEmployeeId', 'kpiObjectiveId', 'setKpiObjectiveId', 'kpiLibraryId', 'setKpiLibraryId', 'kpiPeriod', 'setKpiPeriod', 'kpiParentKpiId', 'setKpiParentKpiId',
  'kpiRollupMethod', 'setKpiRollupMethod', 'kpiStandardHoursLimit', 'setKpiStandardHoursLimit', 'kpiActiveTasksLimit', 'setKpiActiveTasksLimit',
  'newTaskName', 'setNewTaskName', 'newTaskDesc', 'setNewTaskDesc', 'newTaskAssigneeId', 'setNewTaskAssigneeId', 'newTaskDueDate', 'setNewTaskDueDate',
  'newTaskObjectiveId', 'setNewTaskObjectiveId', 'newTaskParentId', 'setNewTaskParentId', 'newTaskProjectId', 'setNewTaskProjectId', 'newTaskPhaseId', 'setNewTaskPhaseId',
  'newTaskStatus', 'setNewTaskStatus', 'newTaskKpiTargetId', 'setNewTaskKpiTargetId',
  'newTimesheetHours', 'setNewTimesheetHours', 'newTimesheetDate', 'setNewTimesheetDate', 'newTimesheetDesc', 'setNewTimesheetDesc', 'newTimesheetTaskId', 'setNewTimesheetTaskId'
];

for (let v of vars) {
  content = content.replace(new RegExp(`\\b${v}\\s*,?\\s*`, 'g'), '');
}

// this might leave empty lines with just commas or spaces, let's clean up
content = content.replace(/^\\s*,?\\s*$/gm, '');

fs.writeFileSync(appPath, content, 'utf8');
console.log('Fixed variables');
