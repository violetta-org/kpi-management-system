import React, { useState, useEffect } from 'react';


interface ChangeRequestApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  approvalModalData: any;
  entityLabel: string;
  onSubmit: (reason: string, approverId: string) => void;
}

export const ChangeRequestApprovalModal: React.FC<ChangeRequestApprovalModalProps> = ({
  isOpen,
  onClose,
  approvalModalData,
  entityLabel,
  onSubmit
}) => {
  const [requestReason, setRequestReason] = useState('');
  const [selectedApproverId, setSelectedApproverId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRequestReason('');
      setSelectedApproverId('');
    }
  }, [isOpen]);

  if (!isOpen || !approvalModalData) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-primary)' }}>
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M12 6v6l4 2" />
          </svg>
          Yêu cầu phê duyệt thay đổi
        </h3>

        <div style={{ padding: '12px', backgroundColor: '#FAF9F9', border: '1px solid var(--color-border-light)', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>
          <div style={{ marginBottom: '6px' }}><strong>Thao tác:</strong> {approvalModalData.operation} ({entityLabel})</div>
          <div style={{ overflowWrap: 'anywhere' }}><strong>Mô tả:</strong> {approvalModalData.description}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Lý do đề xuất <span style={{ color: '#a80000' }}>*</span></label>
            <textarea
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              placeholder="Nhập lý do chi tiết cho đề xuất thay đổi này..."
              style={{
                width: '100%', minHeight: '80px', padding: '8px 12px', borderRadius: '4px',
                border: '1px solid var(--color-border)', outline: 'none', fontSize: '13px',
                fontFamily: 'inherit', resize: 'vertical'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Chọn người phê duyệt <span style={{ color: '#a80000' }}>*</span></label>
            <select
              value={selectedApproverId}
              onChange={(e) => setSelectedApproverId(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '4px',
                border: '1px solid var(--color-border)', outline: 'none', fontSize: '13px',
                backgroundColor: '#ffffff'
              }}
              required
            >
              <option value="">-- Chọn người phê duyệt --</option>
              {approvalModalData.validApprovers.map((user: any) => (
                <option key={user.cr5db_userid} value={user.cr5db_userid}>
                  {user.cr5db_fullname} ({user.cr5db_email}) - {user.cr5db_systemrole}
                </option>
              ))}
            </select>
            <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
              Danh sách hiển thị tối ưu dựa trên quy tắc định tuyến của hệ thống.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={onClose}
              className="btn-filled-3"
              style={{ padding: '8px 16px' }}
            >
              Hủy bỏ
            </button>
            <button
              onClick={() => {
                  if(!requestReason || !selectedApproverId) {
                      alert('Vui lòng nhập lý do và chọn người phê duyệt');
                      return;
                  }
                  onSubmit(requestReason, selectedApproverId);
              }}
              className="btn-primary"
              style={{ padding: '8px 16px', borderRadius: '4px' }}
            >
              Gửi yêu cầu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
