import React from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { calculateKpiAchievementRate, calculateActualValue } from '../../../utils/kpiLogic';

interface RiskAlertsWidgetProps {
  onExpand?: (expanded: { id: string; data: any; title: string }) => void;
}

export const RiskAlertsWidget: React.FC<RiskAlertsWidgetProps> = ({ onExpand }) => {
  const {
    kpiTargets,
    kpiLibrariesList,
    evaluationPeriodsList,
    tasks,
    timesheets,
    objectivesList,
    currentUserEmail,
    activeRole,
    language
  } = useAppState();

  const myKpis = activeRole === 'Employee'
    ? kpiTargets.filter(k => k.cr5db_user_email?.toLowerCase() === currentUserEmail.toLowerCase())
    : kpiTargets;

  const now = Date.now();

  const risks = myKpis.map(k => {
    const kpiLib = kpiLibrariesList.find(x => x.cr5db_kpilibraryid === k._cr5db_kpicode_value);
    const actualVal = calculateActualValue(k, kpiTargets, tasks, timesheets, objectivesList, kpiLibrariesList, evaluationPeriodsList);
    const rate = calculateKpiAchievementRate(k.cr5db_targetvalue || 100, actualVal, kpiLib?.new_direction);

    // Determine Time Percent
    let timePercent = 0;
    let evaluationPeriod = evaluationPeriodsList.find(p => p.cr5db_evaluationperiod1 === k.cr5db_period);
    if (evaluationPeriod && evaluationPeriod.cr5db_startdate && evaluationPeriod.cr5db_enddate) {
      const start = new Date(evaluationPeriod.cr5db_startdate).getTime();
      const end = new Date(evaluationPeriod.cr5db_enddate).getTime();
      if (end > start) {
        const elapsed = now - start;
        const total = end - start;
        timePercent = Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
      }
    }

    let status = 'On Track';
    if (rate < 100) {
      if (timePercent > rate + 20) {
        status = 'High Risk';
      } else if (timePercent > rate + 10) {
        status = 'At Risk';
      }
    }

    return { k, rate, timePercent, status };
  }).filter(item => item.status !== 'On Track');

  const behind = risks.filter(item => item.status === 'High Risk');
  const atRisk = risks.filter(item => item.status === 'At Risk');

  // Sort by biggest gap
  risks.sort((a, b) => (b.timePercent - b.rate) - (a.timePercent - a.rate));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1, backgroundColor: '#FFF4CE', border: '1px solid #795B00', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#795B00' }}>{atRisk.length}</div>
          <div style={{ fontSize: '11px', color: '#795B00', fontWeight: 600 }}>At Risk (+10% lag)</div>
        </div>
        <div style={{ flex: 1, backgroundColor: '#FDE7E9', border: '1px solid #A80000', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#A80000' }}>{behind.length}</div>
          <div style={{ fontSize: '11px', color: '#A80000', fontWeight: 600 }}>High Risk (+20% lag)</div>
        </div>
      </div>

      <div style={{ maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {risks.slice(0, 3).map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '8px', backgroundColor: item.status === 'High Risk' ? '#FDF3F3' : '#FFFAF0', border: `1px solid ${item.status === 'High Risk' ? '#F3D6D6' : '#F3E5CD'}`, borderRadius: '6px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
              <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.k.cr5db_kpiname}</span>
              <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                Prog: <strong style={{ color: 'var(--color-primary)' }}>{item.rate}%</strong> | Time: <strong>{item.timePercent}%</strong>
              </span>
            </div>
            <div style={{ marginLeft: '8px', padding: '4px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, color: '#fff', backgroundColor: item.status === 'High Risk' ? '#dc2626' : '#d97706', whiteSpace: 'nowrap' }}>
              {item.status === 'High Risk' ? 'NGUY CƠ CAO' : 'CẢNH BÁO'}
            </div>
          </div>
        ))}
        {risks.length > 3 && (
          <div 
            style={{ fontSize: '11px', textAlign: 'center', color: 'var(--color-primary)', cursor: 'pointer', marginTop: '4px', fontWeight: 600 }} 
            onClick={() => onExpand?.({ id: 'kpi_risks', data: risks, title: language === 'vi' ? 'Tất cả cảnh báo KPI' : 'All KPI Alerts' })}
          >
            {language === 'vi' ? `Xem tất cả ${risks.length} cảnh báo...` : `View all ${risks.length} alerts...`}
          </div>
        )}
      </div>
    </div>
  );
};
