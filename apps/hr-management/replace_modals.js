const fs = require('fs');
const file = 'src/app.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// We know the exact start strings, let's find them programmatically to be safe against line shifts.
function replaceBlock(startStr, endStr, replacement) {
  let startIndex = lines.findIndex(l => l.includes(startStr));
  if (startIndex === -1) {
    console.log("Could not find start: " + startStr);
    return;
  }
  
  // Find the closing brace/parenthesis for the block. 
  // We know KpiModal ends at `  )` followed by `}`.
  let endIndex = startIndex;
  let braceCount = 0;
  let parenCount = 0;
  let started = false;
  
  for (let i = startIndex; i < lines.length; i++) {
    let line = lines[i];
    for (let char of line) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      if (char === '(') parenCount++;
      if (char === ')') parenCount--;
    }
    started = true;
    
    // If we've started and all brackets are closed, this is the end of the block.
    if (started && braceCount === 0 && parenCount === 0 && i > startIndex + 10) { // +10 to ensure we traversed
      // Actually, for showModal && (...), the outer is just the JSX expression.
      // Let's just use hardcoded line numbers since we just verified them!
      break;
    }
  }
}

// Since I just looked up the exact line numbers:
// Timesheet: 8575 to 8637
// Kpi: 9801 to 10079
// Leave: 10508 to 10574

// Let's double check if they match!
if (lines[8576].includes('showTimesheetModal && (')) {
  lines.splice(8574, 8637 - 8574 + 1, 
    "{/* Timesheet Modal */}",
    "{showTimesheetModal && (",
    "  <TimesheetModal",
    "    isOpen={showTimesheetModal}",
    "    onClose={() => setShowTimesheetModal(false)}",
    "    onSave={handleAddTimesheet}",
    "  />",
    ")}"
  );
  console.log("Replaced TimesheetModal");
} else {
  console.log("Line 8576 mismatch: " + lines[8576]);
}

// Re-read because splice changes line numbers!
// It's better to do it backwards so line numbers don't shift!
