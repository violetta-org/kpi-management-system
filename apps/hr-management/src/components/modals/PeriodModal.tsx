import React, { useState, useEffect } from 'react';

interface PeriodModalProps {
  isOpen: boolean;
  editingPeriod: any | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    startDate: string;
    endDate: string;
  }) => void;
}

export const PeriodModal: React.FC<PeriodModalProps> = ({
  isOpen,
  editingPeriod,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (editingPeriod) {
      setName(editingPeriod.cr5db_periodname || '');
      setStartDate(editingPeriod.cr5db_startdate ? editingPeriod.cr5db_startdate.substring(0, 10) : '');
      setEndDate(editingPeriod.cr5db_enddate ? editingPeriod.cr5db_enddate.substring(0, 10) : '');
    } else {
      setName('');
      setStartDate('');
      setEndDate('');
    }
  }, [editingPeriod, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, startDate, endDate });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '400px', padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
          {editingPeriod ? 'Cập nhật chu kỳ đánh giá' : 'Tạo mới chu kỳ đánh giá'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>
              Tên chu kỳ <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Đánh giá hiệu suất Q3/2026"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Ngày bắt đầu</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Ngày kết thúc</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
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
              Lưu chu kỳ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
