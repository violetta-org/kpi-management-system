import type { Task, KPITarget, EvaluationPeriod } from '../lib/types';

export const calculateKpiAchievementRate = (
  targetValue: number,
  actualValue: number,
  direction?: number
): number => {
  if (targetValue === 0 && actualValue === 0) return 100;
  
  const dir = direction ?? 1; // Default to Higher is better (1)

  // 2: Lower is Better (Tối thiểu hóa)
  if (dir === 2) {
    if (actualValue <= targetValue) {
      return 100;
    }
    if (targetValue <= 0) {
      return 0; // Target was <= 0 and actual is > target (failed)
    }
    return Math.max(0, Math.round((2 - actualValue / targetValue) * 100));
  }

  // 3: Binary (Đạt / Không đạt), 4: Milestone (Cột mốc)
  if (dir === 3 || dir === 4) {
    return actualValue >= targetValue ? 100 : 0;
  }

  // 1: Higher is Better (Tối đa hóa - Default)
  if (targetValue <= 0) {
    return actualValue >= targetValue ? 100 : 0;
  }
  return Math.round((actualValue / targetValue) * 100);
};

export function calculateActualValue(
  k: KPITarget | any,
  kpiTargets: (KPITarget | any)[],
  tasks: Task[],
  timesheets: any[],
  objectivesList: any[],
  kpiLibrariesList: any[],
  evaluationPeriodsList: EvaluationPeriod[],
  visited = new Set<string>()
): number {
  if (!k) return 0;
  if (visited.has(k.cr5db_kpitargetid)) return 0; // Prevent infinite loops
  visited.add(k.cr5db_kpitargetid);

  const rollupMethod = k.new_rollupmethod;
  if (rollupMethod === 'Sum' || rollupMethod === 'Average') {
    const children = kpiTargets.filter(child => child._new_parentkpi_value === k.cr5db_kpitargetid);
    if (children.length > 0) {
      let sum = 0;
      children.forEach(child => {
        sum += calculateActualValue(child, kpiTargets, tasks, timesheets, objectivesList, kpiLibrariesList, evaluationPeriodsList, visited);
      });
      return rollupMethod === 'Sum' ? sum : sum / children.length;
    }
  }

  const kpiName = k.cr5db_kpiname || '';
  const kpiCode = kpiLibrariesList.find(x => x.cr5db_kpilibraryid === k._cr5db_kpicode_value)?.cr5db_kpicatalogcode || '';
  const email = k.cr5db_user_email || '';

  if (kpiName.includes('#TASKS_ON_TIME') || kpiCode.includes('#TASKS_ON_TIME')) {
    const userTasks = tasks.filter(t => t.cr5db_assignee_email?.toLowerCase() === email.toLowerCase());
    if (userTasks.length === 0) return 0;

    const kpiObjective = objectivesList.find(o => o.cr5db_objectiveid === k._cr5db_parentobjective_value);
    const kpiPeriodName = kpiObjective?.cr5db_periodnamename || k.cr5db_period || '';

    const periodTasks = userTasks.filter(t => {
      if (!t._cr5db_objectivename_value) return false;
      const tObj = objectivesList.find(o => o.cr5db_objectiveid === t._cr5db_objectivename_value);
      return (tObj?.cr5db_periodnamename || '') === kpiPeriodName;
    });

    const relevantTasks = periodTasks.length > 0 ? periodTasks : userTasks;
    const completedOnTime = relevantTasks.filter(t => {
      const isCompleted = t.cr5db_status === 'Completed';
      const compareDate = isCompleted
        ? (t.cr5db_completeddate ? new Date(t.cr5db_completeddate) : new Date(t.modifiedon || Date.now()))
        : new Date();
      const isOverdue = t.cr5db_due_date && new Date(t.cr5db_due_date) < compareDate;
      return isCompleted && !isOverdue;
    });
    return Math.round((completedOnTime.length / relevantTasks.length) * 100);
  }

  if (kpiName.includes('#HOURS_LOGGED') || kpiCode.includes('#HOURS_LOGGED')) {
    const userTimesheets = timesheets.filter(ts => ts.cr5db_username?.toLowerCase() === email.toLowerCase() && ts.statuscode === 2 && !ts.cr5db_timesheetlog1?.startsWith('[Từ chối]'));

    const kpiObjective = objectivesList.find(o => o.cr5db_objectiveid === k._cr5db_parentobjective_value);
    const kpiPeriodName = kpiObjective?.cr5db_periodnamename || k.cr5db_period || '';
    const periodObj = evaluationPeriodsList.find(p => p.cr5db_evaluationperiod1 === kpiPeriodName);

    const start = periodObj?.cr5db_startdate ? new Date(periodObj.cr5db_startdate) : null;
    const end = periodObj?.cr5db_enddate ? new Date(periodObj.cr5db_enddate) : null;

    const periodTimesheets = userTimesheets.filter(ts => {
      if (!ts.cr5db_logdate) return false;
      const d = new Date(ts.cr5db_logdate);
      if (start && d < start) return false;
      if (end && d > end) return false;
      return true;
    });

    return periodTimesheets.reduce((sum, ts) => sum + (ts.cr5db_actualhoursworked || 0), 0);
  }

  return k.cr5db_actualvalue || 0;
}

