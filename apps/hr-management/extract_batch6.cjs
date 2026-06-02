const fs = require('fs');

function extractModal(content, keyword, outfile) {
  let startIndex = content.indexOf(keyword);
  if (startIndex === -1) {
    console.log("Could not find", keyword);
    return;
  }
  
  let braceCount = 0;
  let started = false;
  let endIndex = -1;
  
  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '(') {
        braceCount++;
        started = true;
    } else if (content[i] === ')') {
        braceCount--;
    }
    
    if (started && braceCount === 0) {
      endIndex = i;
      break;
    }
  }

  if (endIndex !== -1) {
    let modalBlock = content.substring(startIndex, endIndex + 1);
    fs.writeFileSync(outfile, modalBlock, 'utf8');
    console.log("Extracted", outfile);
  } else {
    console.log("Could not find end of", keyword);
  }
}

let content = fs.readFileSync('src/app.tsx', 'utf8');

extractModal(content, 'showApprovalModal && approvalModalData && (', 'temp_ApprovalModal.txt');
extractModal(content, 'showAllocationModal && (', 'temp_AllocationModal.txt');
extractModal(content, 'showRiskModal && (', 'temp_RiskModal.txt');
