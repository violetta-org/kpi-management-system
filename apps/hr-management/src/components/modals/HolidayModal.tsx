import React, { useState, useEffect } from 'react';

interface HolidayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; date: string }) => void;
  editingHoliday?: any | null;
}

export const HolidayModal: React.FC<HolidayModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingHoliday
}) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingHoliday) {
      setName(editingHoliday.cr5db_holidayname || '');
      setDate(editingHoliday.cr5db_date ? editingHoliday.cr5db_date.substring(0, 10) : '');
    } else {
      setName('');
      setDate('');
    }
  }, [editingHoliday, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onSave({ name, date });
    setIsLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700 }}>{editingHoliday ? 'Sửa Ngày Lễ' : 'Thêm Ngày Lễ'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Tên Ngày Lễ</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Ngày</label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={onClose} className="btn-filled-3">Hủy</button>
            <button type="submit" className="btn-primary" disabled={isLoading}>Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
};
