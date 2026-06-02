const fs = require('fs');
const appPath = 'src/app.tsx';
let content = fs.readFileSync(appPath, 'utf8');

function replaceBlock(startMarker, endMarker, newContent) {
  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker, startIdx);
  if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx);
    content = before + newContent + after;
    console.log(`Replaced block from ${startMarker}`);
  } else {
    console.log(`Failed to find ${startMarker} or ${endMarker}`);
  }
}

replaceBlock(
  '{/* Task Modal */ }',
  '{/* Headcount Request Modal */ }',
  `{/* Task Modal */}
  <TaskModal
    isOpen={showTaskModal}
    editingTask={editingTask}
    onClose={() => {
      setShowTaskModal(false);
      setEditingTask(null);
    }}
    onSave={handleSaveTask}
  />
  
  `
);

replaceBlock(
  '{/* Timesheet Modal */ }',
  '{/* KPI Library Modal */ }',
  `{/* Timesheet Modal */}
  <TimesheetModal
    isOpen={showTimesheetModal}
    onClose={() => setShowTimesheetModal(false)}
    onSave={handleAddTimesheet}
  />
  
  `
);

replaceBlock(
  '{/* Leave Request Modal */ }',
  '{/* Leave Balance Modal */ }',
  `{/* Leave Request Modal */}
  <LeaveRequestModal
    isOpen={showLeaveModal}
    onClose={() => setShowLeaveModal(false)}
    onSave={handleLeaveRequestSubmit}
  />
  
  `
);

replaceBlock(
  '{/* KPI Modal */ }',
  '{/* Resource Allocation Modal */ }',
  `{/* KPI Modal */}
  <KpiModal
    isOpen={showKpiModal}
    editingKpi={editingKpi}
    onClose={() => {
      setShowKpiModal(false);
      setEditingKpi(null);
    }}
    onSave={handleSaveKpi}
  />
  
  `
);

fs.writeFileSync(appPath, content, 'utf8');
console.log('Successfully replaced all inline modals!');
