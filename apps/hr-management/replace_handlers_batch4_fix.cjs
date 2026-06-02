const fs = require('fs');

let content = fs.readFileSync('src/app.tsx', 'utf8');

// Replace handleSaveLeaveBalance
let handleSaveLeaveBalanceOld = content.match(/const handleSaveLeaveBalance = async \(data: \{ entitlement: number; carriedOver: number; usedDays: number; \}\) => \{[\s\S]*?\n  \};/);
if (handleSaveLeaveBalanceOld) {
  let newFunc = `const handleSaveLeaveBalance = async (data: { entitlement: number; carriedOver: number; usedDays: number; }) => {
    try {
      setIsLoading(true);
      if (editingLeaveBalance) {
        await New_leavebalanceService.update(editingLeaveBalance.new_leavebalanceid, {
          new_totalentitlement: data.entitlement,
          new_carriedover: data.carriedOver,
          new_useddays: data.usedDays
        } as any);
      } else {
        await New_leavebalanceService.create({
          new_totalentitlement: data.entitlement,
          new_carriedover: data.carriedOver,
          new_useddays: data.usedDays,
          new_year: new Date().getFullYear(),
          _new_employee_value: selectedUserId || undefined
        } as any);
      }
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

// Replace handleHolidaySubmit
let handleHolidaySubmitOld = content.match(/const handleHolidaySubmit = async \(data: \{ name: string; date: string; \}\) => \{[\s\S]*?\n  \};/);
if (handleHolidaySubmitOld) {
  let newFunc = `const handleHolidaySubmit = async (data: { name: string; date: string; }) => {
    try {
      setIsLoading(true);
      if (editingHoliday) {
        await Cr5db_holidaiesService.update(editingHoliday.cr5db_holidayid, {
          cr5db_name: data.name,
          cr5db_date: new Date(data.date).toISOString()
        } as any);
      } else {
        await Cr5db_holidaiesService.create({
          cr5db_name: data.name,
          cr5db_date: new Date(data.date).toISOString()
        } as any);
      }
      setShowHolidayModal(false);
      setEditingHoliday(null);
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert('Không thể lưu ngày lễ');
      setIsLoading(false);
    }
  };`;
  content = content.replace(handleHolidaySubmitOld[0], newFunc);
}

// Replace handleOvertimeSubmit
let handleOvertimeSubmitOld = content.match(/const handleOvertimeSubmit = async \(data: \{ type: string; date: string; startTime: string; endTime: string; hours: number; reason: string; \}\) => \{[\s\S]*?\n  \};/);
if (handleOvertimeSubmitOld) {
  let newFunc = `const handleOvertimeSubmit = async (data: { type: string; date: string; startTime: string; endTime: string; hours: number; reason: string; }) => {
    try {
      setIsLoading(true);
      await Cr5db_overtimerequestService.create({
        cr5db_name: \`OT \${data.date} - \${currentUserName}\`,
        cr5db_date: new Date(data.date).toISOString(),
        cr5db_starttime: data.startTime,
        cr5db_endtime: data.endTime,
        cr5db_hours: data.hours,
        cr5db_ottype: data.type,
        cr5db_reason: data.reason,
        cr5db_status: 'Pending',
        "cr5db_employee@odata.bind": \`/cr5db_users(\${currentUserId})\`
      } as any);
      setShowOvertimeModal(false);
      await fetchLiveValues();
      alert("Đã gửi đơn OT thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi gửi đơn OT");
      setIsLoading(false);
    }
  };`;
  content = content.replace(handleOvertimeSubmitOld[0], newFunc);
}

fs.writeFileSync('src/app.tsx', content, 'utf8');
