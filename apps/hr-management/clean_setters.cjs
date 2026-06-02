const fs = require('fs');
let content = fs.readFileSync('src/app.tsx', 'utf8');

const toReplace = [
  /setNewCompanyCode\\(.*?\\);?/g,
  /setNewCompanyName\\(.*?\\);?/g,
  /setNewDeptCode\\(.*?\\);?/g,
  /setNewDeptName\\(.*?\\);?/g,
  /setNewCatalogCode\\(.*?\\);?/g,
  /setNewCatalogName\\(.*?\\);?/g,
  /setNewJobPosName\\(.*?\\);?/g,
  /setNewJobPosDeptId\\(.*?\\);?/g,
  /setNewJobPosCatalogId\\(.*?\\);?/g,
  /setNewJobPosQuota\\(.*?\\);?/g,
  /setNewJobPosCompetencyIds\\(.*?\\);?/g,
  /setSelectedReportsToPositionId\\(.*?\\);?/g
];

toReplace.forEach(r => {
  content = content.replace(r, '');
});

// Fix handleAddJobPosition issues with newJobPosName etc.
// Look at lines 2330, 2338, 2354... Wait, in my v4 script I failed to replace handleAddJobPosition signature because I didn't get the oldSig right!
// But wait! I DID replace the signature in my multi_replace_file_content earlier!!!
// Let's check why newJobPosName is still there in line 2330.
// Ah, my multi_replace_file_content ONLY REPLACED lines 2309 to 2311 and lines 2314 to 2319!
// I did NOT replace the body of the function correctly for all variables!

fs.writeFileSync('src/app.tsx', content, 'utf8');
console.log('Cleaned up setters');
