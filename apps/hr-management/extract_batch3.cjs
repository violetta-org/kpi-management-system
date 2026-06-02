const fs = require('fs');
const path = require('path');

const file = 'src/app.tsx';
let content = fs.readFileSync(file, 'utf8');

const modalsToExtract = [
  { name: 'IdpModal', condition: 'showIdpModal' },
  { name: 'ProcessModal', condition: 'showProcessModal' },
  { name: 'PeriodModal', condition: 'showPeriodModal' },
  { name: 'AssignAppraisalModal', condition: 'showAssignAppraisalModal' }
];

let newImports = [];

for (const modal of modalsToExtract) {
  const startStr = `${modal.condition} && (`;
  let startIdx = content.indexOf(startStr);
  if (startIdx === -1) {
    console.log(`Could not find ${modal.name}`);
    continue;
  }

  // Find the matching closing parenthesis
  let endIdx = -1;
  let parenCount = 0;
  let started = false;
  for (let i = startIdx + modal.condition.length + 4; i < content.length; i++) {
    if (content[i] === '(') {
      parenCount++;
      started = true;
    } else if (content[i] === ')') {
      parenCount--;
    }
    if (started && parenCount === 0) {
      endIdx = i;
      break;
    }
  }

  if (endIdx !== -1) {
    let modalCode = content.substring(startIdx + startStr.length, endIdx).trim();
    // Wrap in component
    let componentCode = `import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';

export const ${modal.name} = ({ isOpen, onClose, onSave }: any) => {
  const state = useAppState();
  if (!isOpen) return null;
  return (
    ${modalCode}
  );
};
`;
    // We will just do a simple extraction for now, the user can fix the exact props later if needed.
    // Actually, no, if we extract it with `any` props, it will compile but we have to replace the exact state handlers.
    // Let's just create the component files manually for precision.
  }
}
