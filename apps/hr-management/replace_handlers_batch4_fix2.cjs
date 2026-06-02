const fs = require('fs');
let content = fs.readFileSync('src/app.tsx', 'utf8');

// Replace handleSaveLeaveBalance
let handleSaveLeaveBalanceOld = content.match(/const handleSaveLeaveBalance = async \(data: \{ entitlement: number; carriedOver: number; usedDays: number; \}\) => \{[\s\S]*?\n  \};/);
if (handleSaveLeaveBalanceOld) {
  let newFunc = `const handleSaveLeaveBalance = async (data: { entitlement: number; carriedOver: number; usedDays: number; }) => {
    if (!editingLeaveBalance) return;
    try {
      setIsLoading(true);
      await New_leavebalanceService.update(editingLeaveBalance.new_leavebalanceid, {
        new_totalentitlement: data.entitlement,
        new_carriedover: data.carriedOver,
        new_useddays: data.usedDays
      } as any);
      setShowLeaveBalanceModal(false);
      setEditingLeaveBalance(null);
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi cập nhật quỹ phép.');
      setIsLoading(false);
    }
  };`;
  content = content.replace(handleSaveLeaveBalanceOld[0], newFunc);
}

fs.writeFileSync('src/app.tsx', content, 'utf8');
