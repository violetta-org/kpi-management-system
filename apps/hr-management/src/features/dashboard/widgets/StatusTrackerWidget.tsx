import React from 'react';
import { useAppState } from '../../../context/AppStateContext';

export const StatusTrackerWidget: React.FC = () => {
  const {
    evaluationPeriodsList,
    appraisals,
    currentUserEmail,
    language
  } = useAppState();

  const activePeriod = evaluationPeriodsList.find(p => !p.cr5db_islocked);
  const myAppraisal = appraisals.find(ap =>
    ap.cr5db_employeeemail?.toLowerCase() === currentUserEmail.toLowerCase() &&
    ap.cr5db_periodname === activePeriod?.cr5db_evaluationperiod1
  );

  const isSubmitted = myAppraisal?.statecode === 1 || myAppraisal?.statuscode === 2;
  const isManagerReviewed = myAppraisal?.cr5db_finalscore !== null && myAppraisal?.cr5db_finalscore > 0;
  const isLocked = activePeriod?.cr5db_islocked;

  const steps = [
    { label: 'Draft', completed: true },
    { label: language === 'vi' ? 'Đã Nộp' : 'Submitted', completed: isSubmitted || isManagerReviewed || isLocked },
    { label: language === 'vi' ? 'Đã Duyệt' : 'Reviewed', completed: isManagerReviewed || isLocked },
    { label: language === 'vi' ? 'Hoàn tất' : 'Finalized', completed: isLocked }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
        {language === 'vi' ? 'Chu kỳ hiện tại: ' : 'Active Period: '} <strong>{activePeriod?.cr5db_evaluationperiod1 || 'N/A'}</strong>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', padding: '10px 0' }}>
        <div style={{ position: 'absolute', top: '24px', left: '20px', right: '20px', height: '3px', backgroundColor: '#e5e7eb', zIndex: 1 }} />

        {steps.map((st, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative', width: '60px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: st.completed ? 'var(--color-primary)' : '#e5e7eb',
              color: st.completed ? '#ffffff' : 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '13px',
              border: '3px solid #ffffff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              {st.completed ? '✓' : idx + 1}
            </div>
            <span style={{ fontSize: '11px', marginTop: '6px', fontWeight: 600, color: st.completed ? 'var(--color-text)' : 'var(--color-text-secondary)' }}>{st.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
