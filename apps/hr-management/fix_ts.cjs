const fs = require('fs');

// Fix LiveDataSetters in src/hooks/useLiveData.ts
let liveData = fs.readFileSync('src/hooks/useLiveData.ts', 'utf8');
const liveDataLines = liveData.split('\n');
const newLiveDataLines = [];
for (let i = 0; i < liveDataLines.length; i++) {
  const line = liveDataLines[i];
  if (
    line.includes('setNewReqDeptId') ||
    line.includes('setNewJobPosDeptId') ||
    line.includes('setNewReqCatalogId') ||
    line.includes('setNewJobPosCatalogId')
  ) {
    continue;
  }
  newLiveDataLines.push(line);
}
fs.writeFileSync('src/hooks/useLiveData.ts', newLiveDataLines.join('\n'), 'utf8');

// Fix selectedReportsToPositionId in src/app.tsx
let appTsx = fs.readFileSync('src/app.tsx', 'utf8');
appTsx = appTsx.replace(/selectedReportsToPositionId/g, 'data.reportsToId');
fs.writeFileSync('src/app.tsx', appTsx, 'utf8');

console.log('Fixed typescript issues');
