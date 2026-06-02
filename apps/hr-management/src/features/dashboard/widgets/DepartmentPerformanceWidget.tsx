import React from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { calculateKpiAchievementRate, calculateActualValue } from '../../../utils/kpiLogic';

export const DepartmentPerformanceWidget: React.FC = () => {
  const {
    companiesList,
    usersList,
    jobPositionsList,
    departmentsList,
    kpiTargets,
    kpiLibrariesList,
    tasks,
    timesheets,
    objectivesList,
    evaluationPeriodsList
  } = useAppState();

  const getUserCompany = (u: any): string => {
    if (!u._cr5db_jobposition_value) return '';
    const pos = jobPositionsList.find(p => p.cr5db_jobpositionid === u._cr5db_jobposition_value);
    if (!pos) return '';
    const dept = departmentsList.find(d => d.cr5db_departmentid === pos._cr5db_department_value);
    if (!dept) return '';
    const company = companiesList.find(c => c.cr5db_companyid === dept._cr5db_companyid_value);
    return company ? company.cr5db_companyname : '';
  };

  const companyPerformance = companiesList.map(c => {
    const compUsers = usersList.filter(u => getUserCompany(u) === c.cr5db_companyname);
    const compEmails = compUsers.map(u => u.cr5db_email?.toLowerCase()).filter(Boolean) as string[];
    const compKpis = kpiTargets.filter(k => compEmails.includes(k.cr5db_user_email?.toLowerCase() || ''));

    let totalRate = 0;
    let count = 0;
    compKpis.forEach(k => {
      const kpiLib = kpiLibrariesList.find(x => x.cr5db_kpilibraryid === k._cr5db_kpicode_value);
      const actualVal = calculateActualValue(k, kpiTargets, tasks, timesheets, objectivesList, kpiLibrariesList, evaluationPeriodsList);
      totalRate += calculateKpiAchievementRate(k.cr5db_targetvalue ?? 100, actualVal, kpiLib?.new_direction);
      count++;
    });

    const avgRate = count > 0 ? Math.round(totalRate / count) : 0;

    const compTasks = tasks.filter(t => compEmails.includes(t.cr5db_assignee_email?.toLowerCase() || ''));
    const completed = compTasks.filter(t => t.cr5db_status === 'Completed').length;
    const taskRate = compTasks.length > 0 ? Math.round((completed / compTasks.length) * 100) : 0;

    return { company: c.cr5db_companyname, kpiRate: avgRate, taskRate };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {companyPerformance.map(cp => (
        <div key={cp.company} style={{ borderBottom: '1px solid var(--color-border-light)', paddingBottom: '8px' }}>
          <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{cp.company}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                <span>KPI Achievement</span>
                <span>{cp.kpiRate}%</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#f0f0f0', borderRadius: '3px' }}>
                <div style={{ width: `${cp.kpiRate}%`, height: '100%', backgroundColor: '#107C41' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                <span>Task Completion</span>
                <span>{cp.taskRate}%</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#f0f0f0', borderRadius: '3px' }}>
                <div style={{ width: `${cp.taskRate}%`, height: '100%', backgroundColor: '#E29E2E' }} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
