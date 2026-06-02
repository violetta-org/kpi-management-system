import React, { useState, useEffect } from 'react';

interface BonusMatrixModalProps {
  isOpen: boolean;
  editingBonusMatrix: any | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const BonusMatrixModal: React.FC<BonusMatrixModalProps> = ({
  isOpen,
  editingBonusMatrix,
  onClose,
  onSave
}) => {
  const [newMinScore, setNewMinScore] = useState<number | ''>('');
  const [newMaxScore, setNewMaxScore] = useState<number | ''>('');
  const [newMultiplier, setNewMultiplier] = useState<number | ''>('');

  useEffect(() => {
    if (editingBonusMatrix) {
      setNewMinScore(editingBonusMatrix.cr5db_minscore || 0);
      setNewMaxScore(editingBonusMatrix.cr5db_maxscore || 0);
      setNewMultiplier(editingBonusMatrix.cr5db_multiplier || 1);
    } else {
      setNewMinScore('');
      setNewMaxScore('');
      setNewMultiplier('');
    }
  }, [editingBonusMatrix]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      newMinScore: Number(newMinScore),
      newMaxScore: Number(newMaxScore),
      newMultiplier: Number(newMultiplier)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '420px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>
          {editingBonusMatrix ? 'Chỉnh sửa dải điểm' : 'Thêm dải điểm thưởng'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Điểm tối thiểu (Min Score) <span style={{ color: '#dc2626' }}>*</span></label>
            <input type="number" step="0.01" value={newMinScore} onChange={e => setNewMinScore(Number(e.target.value))} required style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Điểm tối đa (Max Score) <span style={{ color: '#dc2626' }}>*</span></label>
            <input type="number" step="0.01" value={newMaxScore} onChange={e => setNewMaxScore(Number(e.target.value))} required style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Hệ số thưởng (Multiplier) <span style={{ color: '#dc2626' }}>*</span></label>
            <input type="number" step="0.01" value={newMultiplier} onChange={e => setNewMultiplier(Number(e.target.value))} required style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" onClick={onClose} className="btn-filled-3">Hủy</button>
            <button type="submit" className="btn-primary">Lưu cấu hình</button>
          </div>
        </form>
      </div>
    </div>
  );
};
