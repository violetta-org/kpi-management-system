import React, { useState, useEffect } from 'react';

interface ObjectiveModalProps {
  isOpen: boolean;
  editingObjective: any | null;
  evaluationPeriodsList: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}

export const ObjectiveModal: React.FC<ObjectiveModalProps> = ({
  isOpen,
  editingObjective,
  evaluationPeriodsList,
  onClose,
  onSave
}) => {
  const [objectiveName, setObjectiveName] = useState('');
  const [objectiveTarget, setObjectiveTarget] = useState<number | ''>('');
  const [objectivePeriodId, setObjectivePeriodId] = useState('');

  useEffect(() => {
    if (editingObjective) {
      setObjectiveName(editingObjective.cr5db_objectivename || '');
      setObjectiveTarget(editingObjective.cr5db_targetvalue || '');
      setObjectivePeriodId(editingObjective._cr5db_evaluationperiodid_value || '');
    } else {
      setObjectiveName('');
      setObjectiveTarget('');
      setObjectivePeriodId(evaluationPeriodsList[0]?.cr5db_evaluationperiodid || '');
    }
  }, [editingObjective, evaluationPeriodsList]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      objectiveName,
      objectiveTarget: objectiveTarget === '' ? null : Number(objectiveTarget),
      objectivePeriodId
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '420px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>
          {editingObjective ? 'Chinh sua muc tieu' : 'Them muc tieu moi'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Ten muc tieu <span style={{ color: '#dc2626' }}>*</span></label>
            <input value={objectiveName} onChange={e => setObjectiveName(e.target.value)} required placeholder="Vi du: Phai dat top 1 QLDA, Tang truong doanh so 20%..." style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Gia tri muc tieu</label>
            <input type="number" value={objectiveTarget} onChange={e => setObjectiveTarget(Number(e.target.value))} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Chu kỳ đánh giá (Evaluation Period) <span style={{ color: '#dc2626' }}>*</span></label>
            <select
              value={objectivePeriodId}
              onChange={e => setObjectivePeriodId(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#ffffff' }}
            >
              <option value="">-- Chọn chu kỳ đánh giá --</option>
              {evaluationPeriodsList.map(ep => (
                <option key={ep.cr5db_evaluationperiodid} value={ep.cr5db_evaluationperiodid}>
                  {ep.cr5db_evaluationperiod1}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" onClick={onClose} className="btn-filled-3">Huy</button>
            <button type="submit" className="btn-primary">Luu muc tieu</button>
          </div>
        </form>
      </div>
    </div>
  );
};
