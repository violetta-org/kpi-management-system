const fs = require('fs');

let content = fs.readFileSync('src/app.tsx', 'utf8');
const lines = content.split('\n');

const newLines = [];
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  if (
    line.includes('setNewPeriodName') ||
    line.includes('setNewPeriodStartDate') ||
    line.includes('setNewPeriodEndDate')
  ) {
    continue;
  }
  newLines.push(line);
}

fs.writeFileSync('src/app.tsx', newLines.join('\n'), 'utf8');
