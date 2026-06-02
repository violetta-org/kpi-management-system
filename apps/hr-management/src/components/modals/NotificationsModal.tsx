import React from 'react';

interface SystemNotification {
  cr5db_systemnotificationid: string;
  cr5db_isread: boolean;
  cr5db_systemnotification1: string;
  cr5db_content: string;
  cr5db_deeplinkurl?: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasOverdueTasks: boolean;
  checkPermission: (module: string) => boolean;
  pendingApprovalsTimesheets: any[];
  systemNotifications: SystemNotification[];
}

// Inline BellIcon if we don't know the import path
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  hasOverdueTasks,
  checkPermission,
  pendingApprovalsTimesheets,
  systemNotifications
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}><BellIcon /></span>
          <span>Thông báo hệ thống</span>
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
          {/* Overdue alert */}
          {hasOverdueTasks && (
            <div style={{ padding: '10px 12px', border: '1px solid var(--color-primary)', borderRadius: '6px', fontSize: '13px', backgroundColor: '#FDF3F3' }}>
              <strong style={{ color: 'var(--color-primary)' }}>Trễ hạn:</strong> Bạn đang có công việc cần hoàn thành gấp.
            </div>
          )}
          {/* Timesheet Pending alert */}
          {checkPermission('resources') && pendingApprovalsTimesheets.length > 0 && (
            <div style={{ padding: '10px 12px', border: '1px solid #E29E2E', borderRadius: '6px', fontSize: '13px', backgroundColor: '#FFFDF6' }}>
              <strong style={{ color: '#E29E2E' }}>Duyệt giờ:</strong> Đang có {pendingApprovalsTimesheets.length} timesheets đang chờ bạn phê duyệt.
            </div>
          )}

          {/* Dataverse notifications list */}
          {systemNotifications.length === 0 ? (
            <div style={{ padding: '12px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
              Không có thông báo mới từ hệ thống Dataverse.
            </div>
          ) : (
            systemNotifications.map(n => (
              <div key={n.cr5db_systemnotificationid} style={{ padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '6px', fontSize: '13px', backgroundColor: n.cr5db_isread ? '#ffffff' : '#FAF9F9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ color: 'var(--color-text)' }}>{n.cr5db_systemnotification1}</strong>
                  {!n.cr5db_isread && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'inline-block' }} />}
                </div>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '12px', lineHeight: '1.4' }}>{n.cr5db_content}</p>
                {n.cr5db_deeplinkurl && (
                  <a href={n.cr5db_deeplinkurl} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-block', marginTop: '6px', fontWeight: 600 }}>Chi tiết ➔</a>
                )}
              </div>
            ))
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button onClick={onClose} className="btn-filled-3">Đóng</button>
        </div>
      </div>
    </div>
  );
};
