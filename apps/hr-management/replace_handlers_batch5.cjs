const fs = require('fs');

let content = fs.readFileSync('src/app.tsx', 'utf8');

// Replace handleApproveOtSubmit
let handleApproveOtSubmitOld = content.match(/const handleApproveOtSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?\n  \};/);
if (handleApproveOtSubmitOld) {
  let newFunc = handleApproveOtSubmitOld[0].replace('e: React.FormEvent', 'hours: number')
                                           .replace('e.preventDefault();\n', '')
                                           .replace('otApprovedHours', 'hours.toString()');
  content = content.replace(handleApproveOtSubmitOld[0], newFunc);
}

// Clean up unused states
const toReplace = [
  /otApprovedHours, setOtApprovedHours,\n?/g,
  /setOtApprovedHours\(.*?\);\n?/g
];
toReplace.forEach(r => {
  content = content.replace(r, '');
});

fs.writeFileSync('src/app.tsx', content, 'utf8');
