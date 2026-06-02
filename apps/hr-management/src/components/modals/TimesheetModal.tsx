import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { AIGenerateButton } from '../../features/ai/AIGenerateButton';
import { AIService } from '../../features/ai/AIService';

interface TimesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (timesheetData: {
    hours: number;
    date: string;
    description: string;
    taskId: string;
  }) => Promise<void>;
}

export const TimesheetModal: React.FC<TimesheetModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const {
    tasks,
    activeRole,
    currentUserEmail,
    currentUserName,
    usersList,
  } = useAppState();

  // Local form states
  const [newTimesheetDesc, setNewTimesheetDesc] = useState('');
  const [newTimesheetHours, setNewTimesheetHours] = useState(8);
  const [newTimesheetDate, setNewTimesheetDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTimesheetTaskId, setNewTimesheetTaskId] = useState('');

  // Filter tasks that the current user is allowed to log timesheets for
  const availableTasks = tasks.filter(t => {
    if (t.cr5db_status === 'Completed') return false;
    if (activeRole === 'Employee') {
      const isAssigned = t.cr5db_assignee_email?.toLowerCase() === currentUserEmail?.toLowerCase();
      const currentUserFullname = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail?.toLowerCase())?.cr5db_fullname;
      
      const isCreatedByMe = t.createdbyname && (
        t.createdbyname.toLowerCase() === currentUserName?.toLowerCase() ||
        currentUserFullname?.toLowerCase() === t.createdbyname.toLowerCase()
      );
      const isSubtask = !!t._cr5db_parenttask_value;
      return isAssigned && !isCreatedByMe && !isSubtask;
    }
    return true;
  });

  // Sync / Reset local states on open
  useEffect(() => {
    if (isOpen) {
      setNewTimesheetDesc('');
      setNewTimesheetHours(8);
      setNewTimesheetDate(new Date().toISOString().split('T')[0]);
      setNewTimesheetTaskId(availableTasks[0]?.cr5db_taskid || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      hours: newTimesheetHours,
      date: newTimesheetDate,
      description: newTimesheetDesc,
      taskId: newTimesheetTaskId,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700 }}>Log Work Hours</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Mô tả công việc</label>
            <AIGenerateButton
              onClick={async () => {
                const selTask = tasks.find(t => t.cr5db_taskid === newTimesheetTaskId);
                return await AIService.refineTimesheetText(
                  newTimesheetDesc || 'Đã làm việc',
                  selTask?.cr5db_taskname || ''
                );
              }}
              onSuccess={(text) => setNewTimesheetDesc(text)}
            />
            <input
              type="text"
              value={newTimesheetDesc}
              onChange={(e) => setNewTimesheetDesc(e.target.value)}
              className="input-spec"
              required
              placeholder="Hôm nay bạn đã làm gì..."
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Số giờ làm việc</label>
              <input
                type="number"
                min={0.5}
                max={24}
                step={0.5}
                value={newTimesheetHours}
                onChange={(e) => setNewTimesheetHours(Number(e.target.value))}
                className="input-spec"
                style={{ height: '38px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Ngày log</label>
              <input
                type="date"
                value={newTimesheetDate}
                onChange={(e) => setNewTimesheetDate(e.target.value)}
                className="input-spec"
                style={{ height: '38px' }}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Liên kết nhiệm vụ (Task)</label>
            <select
              value={newTimesheetTaskId}
              onChange={(e) => setNewTimesheetTaskId(e.target.value)}
              className="input-spec"
              style={{ height: '38px', padding: '6px 12px' }}
            >
              {availableTasks.map(t => (
                <option key={t.cr5db_taskid} value={t.cr5db_taskid}>{t.cr5db_taskname}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn-filled-3">Hủy</button>
            <button type="submit" className="btn-primary">Ghi nhận</button>
          </div>
        </form>
      </div>
    </div>
  );
};
