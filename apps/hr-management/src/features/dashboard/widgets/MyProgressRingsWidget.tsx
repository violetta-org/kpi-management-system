import React from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { calculateKpiAchievementRate, calculateActualValue } from '../../../utils/kpiLogic';

export const MyProgressRingsWidget: React.FC = () => {
  const {
    kpiTargets,
    kpiLibrariesList,
    tasks,
    timesheets,
    evaluationPeriodsList,
    objectivesList,
    currentUserEmail
  } = useAppState();

  const myKpis = kpiTargets.filter(k => k.cr5db_user_email?.toLowerCase() === currentUserEmail.toLowerCase());
  let totalKpiRate = 0;
  myKpis.forEach(k => {
    const kpiLib = kpiLibrariesList.find(x => x.cr5db_kpilibraryid === k._cr5db_kpicode_value);
    const actualVal = calculateActualValue(k, kpiTargets, tasks, timesheets, objectivesList, kpiLibrariesList, evaluationPeriodsList);
    totalKpiRate += calculateKpiAchievementRate(k.cr5db_targetvalue ?? 100, actualVal, kpiLib?.new_direction);
  });
  const kpiRate = myKpis.length > 0 ? Math.round(totalKpiRate / myKpis.length) : 0;

  const myTasks = tasks.filter(t => t.cr5db_assignee_email?.toLowerCase() === currentUserEmail.toLowerCase());
  const completedTasks = myTasks.filter(t => t.cr5db_status === 'Completed').length;
  const taskRate = myTasks.length > 0 ? Math.round((completedTasks / myTasks.length) * 100) : 0;

  // Calculate total hours this week
  const myTimesheets = timesheets.filter(ts => ts.cr5db_username?.toLowerCase() === currentUserEmail.toLowerCase());
  const totalHoursThisWeek = myTimesheets.reduce((acc, curr) => acc + (curr.cr5db_actualhoursworked || 0), 0);
  const timesheetRate = Math.min(100, Math.round((totalHoursThisWeek / 40) * 100));

  const ringData = [
    { label: 'KPIs', val: kpiRate, color: '#107C41' },
    { label: 'Tasks', val: taskRate, color: '#b6393a' },
    { label: 'Hours', val: timesheetRate, color: '#742774' }
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
      {ringData.map((r, idx) => {
        const radius = 32;
        const circ = 2 * Math.PI * radius;
        const strokeDashoffset = circ - (r.val / 100) * circ;
        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <svg width="84" height="84" viewBox="0 0 84 84">
              <circle cx="42" cy="42" r={radius} fill="none" stroke="#f3f2f1" strokeWidth="6" />
              <circle
                cx="42"
                cy="42"
                r={radius}
                fill="none"
                stroke={r.color}
                strokeWidth="6"
                strokeDasharray={circ}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 42 42)"
              />
              <text x="42" y="46" textAnchor="middle" fontSize="15px" fontWeight="bold" fill="var(--color-text)">
                {r.val}%
              </text>
            </svg>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{r.label}</span>
          </div>
        );
      })}
    </div>
  );
};
