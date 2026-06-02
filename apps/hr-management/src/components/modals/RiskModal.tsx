import React, { useState, useEffect } from 'react';

interface RiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    impact: string;
    probability: string;
    mitigation: string;
  }) => void;
  editingRisk?: any | null;
}

export const RiskModal: React.FC<RiskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingRisk
}) => {
  const [newRiskName, setNewRiskName] = useState('');
  const [newRiskImpact, setNewRiskImpact] = useState('Medium');
  const [newRiskProbability, setNewRiskProbability] = useState('Medium');
  const [newRiskMitigation, setNewRiskMitigation] = useState('');

  useEffect(() => {
    if (editingRisk) {
      setNewRiskName(editingRisk.cr5db_riskname || '');
      setNewRiskImpact(editingRisk.cr5db_impact || 'Medium');
      setNewRiskProbability(editingRisk.cr5db_probability || 'Medium');
      setNewRiskMitigation(editingRisk.cr5db_mitigationplan || '');
    } else {
      setNewRiskName('');
      setNewRiskImpact('Medium');
      setNewRiskProbability('Medium');
      setNewRiskMitigation('');
    }
  }, [editingRisk, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: newRiskName,
      impact: newRiskImpact,
      probability: newRiskProbability,
      mitigation: newRiskMitigation
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700 }}>
          {editingRisk ? 'Chỉnh sửa rủi ro dự án' : 'Ghi nhận rủi ro dự án'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Tên/Mô tả rủi ro</label>
            <input
              type="text"
              value={newRiskName}
              onChange={(e) => setNewRiskName(e.target.value)}
              className="input-spec"
              required
              placeholder="Ví dụ: Thiếu hụt nhân lực chủ chốt"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Mức độ ảnh hưởng (Impact)</label>
              <select
                value={newRiskImpact}
                onChange={(e) => setNewRiskImpact(e.target.value)}
                className="input-spec"
                style={{ height: '38px', padding: '6px 12px' }}
              >
                <option value="High">Cao (High)</option>
                <option value="Medium">Trung bình (Medium)</option>
                <option value="Low">Thấp (Low)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Khả năng xảy ra (Probability)</label>
              <select
                value={newRiskProbability}
                onChange={(e) => setNewRiskProbability(e.target.value)}
                className="input-spec"
                style={{ height: '38px', padding: '6px 12px' }}
              >
                <option value="High">Cao (High)</option>
                <option value="Medium">Trung bình (Medium)</option>
                <option value="Low">Thấp (Low)</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Kế hoạch giảm thiểu (Mitigation Plan)</label>
            <textarea
              value={newRiskMitigation}
              onChange={(e) => setNewRiskMitigation(e.target.value)}
              className="input-spec"
              rows={3}
              placeholder="Phương án dự phòng, phân công người phụ trách..."
              style={{ fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-filled-3"
            >
              Hủy
            </button>
            <button type="submit" className="btn-filled-2" style={{ backgroundColor: '#742774' }}>
              {editingRisk ? 'Cập nhật' : 'Lưu rủi ro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
