import React, { useState, useEffect } from 'react';

interface OvertimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { type: string; date: string; startTime: string; endTime: string; hours: number; reason: string; }) => void;
}

export const OvertimeModal: React.FC<OvertimeModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [type, setType] = useState('Weekday');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [hours, setHours] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setType('Weekday');
      setDate('');
      setStartTime('');
      setEndTime('');
      setHours('');
      setReason('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onSave({
      type,
      date,
      startTime,
      endTime,
      hours: Number(hours),
      reason
    });
    setIsLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700 }}>Xin Làm thêm giờ (OT)</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Loại OT</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
            >
              <option value="Weekday">Ngày thường (Weekday)</option>
              <option value="Weekend">Cuối tuần (Weekend)</option>
              <option value="Holiday">Ngày lễ (Holiday)</option>
              <option value="Night">Ca đêm (Night)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Ngày OT</label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Giờ bắt đầu</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Giờ kết thúc</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Số giờ</label>
            <input
              type="number"
              step="0.5"
              required
              value={hours}
              onChange={e => setHours(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Lý do</label>
            <textarea
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', minHeight: '60px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={onClose} className="btn-filled-3">Hủy</button>
            <button type="submit" className="btn-primary" disabled={isLoading}>Gửi đơn</button>
          </div>
        </form>
      </div>
    </div>
  );
};
