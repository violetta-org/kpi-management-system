import React from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { calculateKpiAchievementRate, calculateActualValue } from '../../../utils/kpiLogic';

export const StrategicAlignmentWidget: React.FC = () => {
  const {
    objectivesList,
    kpiTargets,
    tasks,
    timesheets,
    kpiLibrariesList,
    evaluationPeriodsList,
    currentUserEmail,
    activeRole
  } = useAppState();

  const myObjectives = activeRole === 'Employee'
    ? objectivesList.filter(o => {
      const personalKpis = kpiTargets.filter(k => k.cr5db_user_email?.toLowerCase() === currentUserEmail.toLowerCase() && k._cr5db_parentobjective_value === o.cr5db_objectiveid);
      return personalKpis.length > 0;
    })
    : objectivesList;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {myObjectives.slice(0, 3).map(obj => {
        const objKpis = kpiTargets.filter(k => k._cr5db_parentobjective_value === obj.cr5db_objectiveid);
        const objTasks = tasks.filter(t => t._cr5db_objectivename_value === obj.cr5db_objectiveid);

        let totalRate = 0;
        let kpiCount = 0;
        objKpis.forEach(k => {
          const kpiLib = kpiLibrariesList.find(x => x.cr5db_kpilibraryid === k._cr5db_kpicode_value);
          const actualVal = calculateActualValue(k, kpiTargets, tasks, timesheets, objectivesList, kpiLibrariesList, evaluationPeriodsList);
          totalRate += calculateKpiAchievementRate(k.cr5db_targetvalue ?? 100, actualVal, kpiLib?.new_direction);
          kpiCount++;
        });
        const avgRate = kpiCount > 0 ? Math.round(totalRate / kpiCount) : 0;

        return (
          <div key={obj.cr5db_objectiveid} style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px', backgroundColor: '#fafafa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-primary)' }}>🎯 {obj.cr5db_objective1}</div>
              <span style={{ fontSize: '12px', fontWeight: 700, padding: '2px 8px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}>
                Progress: {avgRate}%
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>KPI Targets ({objKpis.length})</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {objKpis.slice(0, 2).map((k, idx) => {
                    const actualVal = calculateActualValue(k, kpiTargets, tasks, timesheets, objectivesList, kpiLibrariesList, evaluationPeriodsList);
                    return (
                      <div key={idx} style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>• {k.cr5db_kpiname}</span>
                        <span style={{ fontWeight: 600 }}>{actualVal}/{k.cr5db_targetvalue}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>Tasks ({objTasks.length})</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {objTasks.slice(0, 2).map((t, idx) => (
                    <div key={idx} style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>• {t.cr5db_taskname}</span>
                      <span style={{ color: t.cr5db_status === 'Completed' ? '#107C41' : '#E29E2E', fontWeight: 600 }}>{t.cr5db_status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {myObjectives.length > 3 && (
        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
          And {myObjectives.length - 3} more strategic objectives linked to your performance scope.
        </div>
      )}
    </div>
  );
};
