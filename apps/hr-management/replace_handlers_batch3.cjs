const fs = require('fs');

let content = fs.readFileSync('src/app.tsx', 'utf8');

// Replace handleSavePeriod
let handleSavePeriodOld = content.match(/const handleSavePeriod = async \(e: React\.FormEvent\) => \{[\s\S]*?\n  \};/);
if (handleSavePeriodOld) {
  let newFunc = `const handleSavePeriod = async (data: { name: string; startDate: string; endDate: string }) => {
    if (!data.name.trim()) return;
    if (editingPeriod && editingPeriod.cr5db_islocked) {
      alert("Chu kỳ đang khóa. Vui lòng mở khóa chu kỳ trước khi sửa thông tin.");
      return;
    }
    try {
      setIsLoading(true);
      if (editingPeriod) {
        await Cr5db_evaluationperiodsService.update(editingPeriod.cr5db_evaluationperiodid, {
          cr5db_evaluationperiod1: data.name,
          cr5db_startdate: data.startDate || undefined,
          cr5db_enddate: data.endDate || undefined
        } as any);
      } else {
        await Cr5db_evaluationperiodsService.create({
          cr5db_evaluationperiod1: data.name,
          cr5db_startdate: data.startDate || undefined,
          cr5db_enddate: data.endDate || undefined,
          cr5db_islocked: false
        } as any);
      }
      setShowPeriodModal(false);
      setEditingPeriod(null);
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể lưu chu kỳ đánh giá.");
      setIsLoading(false);
    }
  };`;
  content = content.replace(handleSavePeriodOld[0], newFunc);
}

// Replace handleAssignAppraisal
let handleAssignAppraisalOld = content.match(/const handleAssignAppraisal = async \(e: React\.FormEvent\) => \{[\s\S]*?\n  \};/);
if (handleAssignAppraisalOld) {
  let newFunc = `const handleAssignAppraisal = async (data: { employeeId: string; evaluatorId: string; periodId: string; appraisalName: string; }) => {
    try {
      setIsLoading(true);
      await Cr5db_objectivesService.create({
        _cr5db_employee_value: data.employeeId,
        _cr5db_manager_value: data.evaluatorId,
        _cr5db_periodname_value: data.periodId,
        cr5db_objective1: data.appraisalName || 'Kỳ đánh giá mới',
        cr5db_status: 'Mục tiêu',
        cr5db_progress: 0,
        cr5db_totalweight: 0,
        cr5db_targetvalue: 100
      } as any);
      setShowAssignAppraisalModal(false);
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể phát động đợt đánh giá.");
      setIsLoading(false);
    }
  };`;
  content = content.replace(handleAssignAppraisalOld[0], newFunc);
}

fs.writeFileSync('src/app.tsx', content, 'utf8');
