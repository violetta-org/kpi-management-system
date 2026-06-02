import React from 'react';
import { useAppState } from '../../../context/AppStateContext';

export const ComplianceMetricWidget: React.FC = () => {
  const { appraisals, language } = useAppState();

  const totalAp = appraisals.length;
  const submittedAp = appraisals.filter(ap => ap.statecode === 1 || ap.statuscode === 2).length;
  const evaluatedAp = appraisals.filter(ap => ap.cr5db_finalscore !== null && ap.cr5db_finalscore > 0).length;

  const subRate = totalAp > 0 ? Math.round((submittedAp / totalAp) * 100) : 0;
  const evalRate = totalAp > 0 ? Math.round((evaluatedAp / totalAp) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
          <span>{language === 'vi' ? 'Nhân sự đã nộp tự đánh giá' : 'Employees self-submitted'}</span>
          <span>{submittedAp} / {totalAp} ({subRate}%)</span>
        </div>
        <div style={{ height: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ width: `${subRate}%`, height: '100%', backgroundColor: 'var(--color-primary)' }} />
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
          <span>{language === 'vi' ? 'Quản lý đã đánh giá chung cuộc' : 'Managers evaluated'}</span>
          <span>{evaluatedAp} / {totalAp} ({evalRate}%)</span>
        </div>
        <div style={{ height: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ width: `${evalRate}%`, height: '100%', backgroundColor: '#742774' }} />
        </div>
      </div>
    </div>
  );
};
