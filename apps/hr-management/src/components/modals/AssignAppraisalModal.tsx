import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';

interface AssignAppraisalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    employeeId: string;
    evaluatorId: string;
    periodId: string;
    appraisalName: string;
  }) => void;
}

export const AssignAppraisalModal: React.FC<AssignAppraisalModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const { usersList, evaluationPeriodsList } = useAppState();
  
  const [employeeId, setEmployeeId] = useState(usersList[0]?.cr5db_userid || '');
  const [evaluatorId, setEvaluatorId] = useState(usersList[0]?.cr5db_userid || '');
  const [periodId, setPeriodId] = useState(evaluationPeriodsList[0]?.cr5db_evaluationperiodid || '');
  const [appraisalName, setAppraisalName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEmployeeId(usersList[0]?.cr5db_userid || '');
      setEvaluatorId(usersList[0]?.cr5db_userid || '');
      setPeriodId(evaluationPeriodsList[0]?.cr5db_evaluationperiodid || '');
      setAppraisalName('');
    }
  }, [isOpen, usersList, evaluationPeriodsList]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ employeeId, evaluatorId, periodId, appraisalName });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '450px', padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
          Phát động đợt đánh giá mới
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Nhân sự cần đánh giá <span style={{ color: '#dc2626' }}>*</span></label>
            <select
              value={employeeId}
              onChange={e => setEmployeeId(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', backgroundColor: '#ffffff', boxSizing: 'border-box' }}
            >
              {usersList.map(u => (
                <option key={u.cr5db_userid} value={u.cr5db_userid}>{u.cr5db_fullname} ({u.cr5db_email || 'No email'})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Người đánh giá (HR/Manager) <span style={{ color: '#dc2626' }}>*</span></label>
            <select
              value={evaluatorId}
              onChange={e => setEvaluatorId(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', backgroundColor: '#ffffff', boxSizing: 'border-box' }}
            >
              {usersList.map(u => (
                <option key={u.cr5db_userid} value={u.cr5db_userid}>{u.cr5db_fullname} ({u.cr5db_email || 'No email'})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Chu kỳ đánh giá <span style={{ color: '#dc2626' }}>*</span></label>
            <select
              value={periodId}
              onChange={e => setPeriodId(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', backgroundColor: '#ffffff', boxSizing: 'border-box' }}
            >
              {evaluationPeriodsList.map(p => (
                <option key={p.cr5db_evaluationperiodid} value={p.cr5db_evaluationperiodid}>{p.cr5db_evaluationperiod1}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Tên đợt đánh giá hiển thị (Tự chọn)</label>
            <input
              type="text"
              placeholder="VD: KPI Q3/2026 - Nguyễn Văn A"
              value={appraisalName}
              onChange={e => setAppraisalName(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-filled-3"
              style={{ padding: '8px 16px' }}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '8px 16px' }}
            >
              Phát động
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
