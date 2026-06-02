const fs = require('fs');

let content = fs.readFileSync('src/app.tsx', 'utf8');

// Replace handleSaveLeaveBalance
let handleSaveLeaveBalanceOld = content.match(/const handleSaveLeaveBalance = async \(e: React\.FormEvent\) => \{[\s\S]*?\n  \};/);
if (handleSaveLeaveBalanceOld) {
  let newFunc = `const handleSaveLeaveBalance = async (data: { entitlement: number; carriedOver: number; usedDays: number; }) => {
    try {
      setIsLoading(true);
      if (editingLeaveBalance) {
        await Cr5db_leavebalancesService.update(editingLeaveBalance.cr5db_leavebalanceid, {
          cr5db_entitlement: data.entitlement,
          cr5db_carriedover: data.carriedOver,
          cr5db_useddays: data.usedDays,
          cr5db_remainingdays: data.entitlement + data.carriedOver - data.usedDays
        } as any);
      } else {
        await Cr5db_leavebalancesService.create({
          cr5db_entitlement: data.entitlement,
          cr5db_carriedover: data.carriedOver,
          cr5db_useddays: data.usedDays,
          cr5db_remainingdays: data.entitlement + data.carriedOver - data.usedDays,
          cr5db_year: new Date().getFullYear(),
          _cr5db_employeeid_value: selectedUserId || undefined
        } as any);
      }
      setShowLeaveBalanceModal(false);
      setEditingLeaveBalance(null);
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert('Không thể lưu quỹ phép.');
      setIsLoading(false);
    }
  };`;
  content = content.replace(handleSaveLeaveBalanceOld[0], newFunc);
}

// Replace handleHolidaySubmit
let handleHolidaySubmitOld = content.match(/const handleHolidaySubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?\n  \};/);
if (handleHolidaySubmitOld) {
  let newFunc = `const handleHolidaySubmit = async (data: { name: string; date: string; }) => {
    try {
      setIsLoading(true);
      if (editingHoliday) {
        await Cr5db_holidaysService.update(editingHoliday.cr5db_holidayid, {
          cr5db_holidayname: data.name,
          cr5db_date: data.date
        } as any);
      } else {
        await Cr5db_holidaysService.create({
          cr5db_holidayname: data.name,
          cr5db_date: data.date
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
let handleOvertimeSubmitOld = content.match(/const handleOvertimeSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?\n  \};/);
if (handleOvertimeSubmitOld) {
  let newFunc = `const handleOvertimeSubmit = async (data: { type: string; date: string; startTime: string; endTime: string; hours: number; reason: string; }) => {
    try {
      setIsLoading(true);
      await Cr5db_overtimesService.create({
        cr5db_ot_type: data.type,
        cr5db_ot_date: data.date,
        cr5db_starttime: data.startTime,
        cr5db_endtime: data.endTime,
        cr5db_hours: data.hours,
        cr5db_reason: data.reason,
        cr5db_status: 'Pending',
        _cr5db_employee_id_value: currentUser?.cr5db_userid
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
