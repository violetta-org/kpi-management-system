const fs = require('fs');

let content = fs.readFileSync('src/app.tsx', 'utf8');

const toReplace = [
  /newBalanceEntitlement, setNewBalanceEntitlement,\n?/g,
  /newBalanceCarriedOver, setNewBalanceCarriedOver,\n?/g,
  /newBalanceUsedDays, setNewBalanceUsedDays,\n?/g,
  /newHolidayName, setNewHolidayName,\n?/g,
  /newHolidayDate, setNewHolidayDate,\n?/g,
  /newOtType, setNewOtType,\n?/g,
  /newOtDate, setNewOtDate,\n?/g,
  /newOtStartTime, setNewOtStartTime,\n?/g,
  /newOtEndTime, setNewOtEndTime,\n?/g,
  /newOtHours, setNewOtHours,\n?/g,
  /newOtReason, setNewOtReason,\n?/g,
  /setNewBalanceEntitlement\(.*?\);\n?/g,
  /setNewBalanceCarriedOver\(.*?\);\n?/g,
  /setNewBalanceUsedDays\(.*?\);\n?/g,
  /setNewHolidayName\(.*?\);\n?/g,
  /setNewHolidayDate\(.*?\);\n?/g,
  /setNewOtType\(.*?\);\n?/g,
  /setNewOtDate\(.*?\);\n?/g,
  /setNewOtStartTime\(.*?\);\n?/g,
  /setNewOtEndTime\(.*?\);\n?/g,
  /setNewOtHours\(.*?\);\n?/g,
  /setNewOtReason\(.*?\);\n?/g
];

toReplace.forEach(r => {
  content = content.replace(r, '');
});

fs.writeFileSync('src/app.tsx', content, 'utf8');
