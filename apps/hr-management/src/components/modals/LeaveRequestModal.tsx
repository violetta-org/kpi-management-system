import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (leaveData: {
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) => Promise<void>;
}

export const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { holidaysList, isLoading } = useAppState();

  // Local form states
  const [newLeaveType, setNewLeaveType] = useState('Annual Leave');
  const [newLeaveStartDate, setNewLeaveStartDate] = useState('');
  const [newLeaveEndDate, setNewLeaveEndDate] = useState('');
  const [newLeaveReason, setNewLeaveReason] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setNewLeaveType('Annual Leave');
      setNewLeaveStartDate('');
      setNewLeaveEndDate('');
      setNewLeaveReason('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Date parsing utility
  const parseDateOnly = (value?: string) => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  // Working days calculation utility
  const calculateWorkingDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) return 0;

    let workingDays = 0;
    const current = new Date(start);

    // Create array of YYYY-MM-DD strings for holidays for fast lookup
    const holidayDates = holidaysList
      .map(h => {
        const d = parseDateOnly(h.cr5db_date);
        return d ? d.toISOString().split('T')[0] : null;
      })
      .filter((d): d is string => d !== null);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      const currentIso = current.toISOString().split('T')[0];

      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isHoliday = holidayDates.includes(currentIso);

      if (!isWeekend && !isHoliday) {
        workingDays++;
      }
      current.setDate(current.getDate() + 1);
    }
    return workingDays;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      type: newLeaveType,
      startDate: newLeaveStartDate,
      endDate: newLeaveEndDate,
      reason: newLeaveReason,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700 }}>Đăng ký nghỉ phép</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Loại phép</label>
            <select
              value={newLeaveType}
              onChange={e => setNewLeaveType(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
            >
              <option value="Annual Leave">Phép năm (Annual Leave)</option>
              <option value="Sick Leave">Nghỉ ốm (Sick Leave)</option>
              <option value="Unpaid Leave">Nghỉ không lương (Unpaid Leave)</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Từ ngày</label>
              <input
                type="date"
                required
                value={newLeaveStartDate}
                onChange={e => setNewLeaveStartDate(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Đến ngày</label>
              <input
                type="date"
                required
                value={newLeaveEndDate}
                onChange={e => setNewLeaveEndDate(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Số ngày dự kiến (trừ T7, CN)</label>
            <input
              type="text"
              disabled
              value={newLeaveStartDate && newLeaveEndDate ? calculateWorkingDays(newLeaveStartDate, newLeaveEndDate) + ' ngày' : '0 ngày'}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#f5f5f5' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Lý do</label>
            <textarea
              required
              value={newLeaveReason}
              onChange={e => setNewLeaveReason(e.target.value)}
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
