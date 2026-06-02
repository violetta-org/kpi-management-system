import React, { useState, useEffect } from 'react';

interface LeaveBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { entitlement: number; carriedOver: number; usedDays: number }) => void;
  editingLeaveBalance?: any | null;
}

export const LeaveBalanceModal: React.FC<LeaveBalanceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingLeaveBalance
}) => {
  const [entitlement, setEntitlement] = useState<string>('');
  const [carriedOver, setCarriedOver] = useState<string>('');
  const [usedDays, setUsedDays] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingLeaveBalance) {
      setEntitlement(String(editingLeaveBalance.cr5db_entitlement || 0));
      setCarriedOver(String(editingLeaveBalance.cr5db_carriedover || 0));
      setUsedDays(String(editingLeaveBalance.cr5db_useddays || 0));
    } else {
      setEntitlement('');
      setCarriedOver('');
      setUsedDays('');
    }
  }, [editingLeaveBalance, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onSave({
      entitlement: Number(entitlement),
      carriedOver: Number(carriedOver),
      usedDays: Number(usedDays)
    });
    setIsLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700 }}>Cập nhật Quỹ phép</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Phép chuẩn</label>
            <input
              type="number"
              required
              value={entitlement}
              onChange={e => setEntitlement(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Tồn năm trước</label>
            <input
              type="number"
              required
              value={carriedOver}
              onChange={e => setCarriedOver(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Đã dùng</label>
            <input
              type="number"
              required
              value={usedDays}
              onChange={e => setUsedDays(e.target.value)}
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
