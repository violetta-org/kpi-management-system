import React from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { calculateKpiAchievementRate, calculateActualValue } from '../../../utils/kpiLogic';

export const IntegratedActionPanelWidget: React.FC = () => {
  const {
    tasks,
    timesheets,
    kpiTargets,
    kpiLibrariesList,
    evaluationPeriodsList,
    objectivesList,
    currentUserEmail
  } = useAppState();

  const myTasks = tasks.filter(t => t.cr5db_assignee_email?.toLowerCase() === currentUserEmail.toLowerCase() && t.cr5db_status !== 'Completed');
  const myTimesheets = timesheets.filter(ts => ts.cr5db_username?.toLowerCase() === currentUserEmail.toLowerCase() && ts.cr5db_status === 'Draft');
  const myKpis = kpiTargets.filter(k => k.cr5db_user_email?.toLowerCase() === currentUserEmail.toLowerCase());
  const attentionKpis = myKpis.filter(k => {
    const kpiLib = kpiLibrariesList.find(x => x.cr5db_kpilibraryid === k._cr5db_kpicode_value);
    const actualVal = calculateActualValue(k, kpiTargets, tasks, timesheets, objectivesList, kpiLibrariesList, evaluationPeriodsList);
    return calculateKpiAchievementRate(k.cr5db_targetvalue ?? 100, actualVal, kpiLib?.new_direction) < 100;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
      <div style={{ borderRight: '1px solid var(--color-border-light)', paddingRight: '12px' }}>
        <div style={{ fontWeight: 700, fontSize: '12px', color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
          📋 Tasks To Complete ({myTasks.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '110px', overflowY: 'auto' }}>
          {myTasks.slice(0, 2).map((t, idx) => (
            <div key={idx} style={{ fontSize: '11.5px', padding: '4px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
              <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.cr5db_taskname}</div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '10.5px' }}>
                Due: {t.cr5db_due_date ? new Date(t.cr5db_due_date).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          ))}
          {myTasks.length === 0 && <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>All clear!</span>}
        </div>
      </div>

      <div style={{ borderRight: '1px solid var(--color-border-light)', paddingRight: '12px', paddingLeft: '4px' }}>
        <div style={{ fontWeight: 700, fontSize: '12px', color: '#742774', textTransform: 'uppercase', marginBottom: '8px' }}>
          ⏰ Timesheets (Draft) ({myTimesheets.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '110px', overflowY: 'auto' }}>
          {myTimesheets.slice(0, 2).map((ts, idx) => (
            <div key={idx} style={{ fontSize: '11.5px', padding: '4px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
              <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ts.cr5db_timesheetlog1}</div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '10.5px' }}>{ts.cr5db_actualhoursworked} hours logged</div>
            </div>
          ))}
          {myTimesheets.length === 0 && <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>No draft timesheets.</span>}
        </div>
      </div>

      <div style={{ paddingLeft: '4px' }}>
        <div style={{ fontWeight: 700, fontSize: '12px', color: '#107C41', textTransform: 'uppercase', marginBottom: '8px' }}>
          🎯 KPIs to Improve ({attentionKpis.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '110px', overflowY: 'auto' }}>
          {attentionKpis.slice(0, 2).map((k, idx) => {
            const kpiLib = kpiLibrariesList.find(x => x.cr5db_kpilibraryid === k._cr5db_kpicode_value);
            const actualVal = calculateActualValue(k, kpiTargets, tasks, timesheets, objectivesList, kpiLibrariesList, evaluationPeriodsList);
            const rate = calculateKpiAchievementRate(k.cr5db_targetvalue ?? 100, actualVal, kpiLib?.new_direction);
            return (
              <div key={idx} style={{ fontSize: '11.5px', padding: '4px', backgroundColor: '#fafafa', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>{k.cr5db_kpiname}</span>
                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{rate}%</span>
              </div>
            );
          })}
          {attentionKpis.length === 0 && <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>All KPIs achieved!</span>}
        </div>
      </div>
    </div>
  );
};
