import React from 'react';

interface DashboardSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgetsRegistry: Record<string, { title: string; size: string; roles: string[] }>;
  activeRole: string;
  enabledWidgets: string[];
  onToggleWidget: (id: string, isChecked: boolean) => void;
}

export const DashboardSettingsModal: React.FC<DashboardSettingsModalProps> = ({
  isOpen,
  onClose,
  widgetsRegistry,
  activeRole,
  enabledWidgets,
  onToggleWidget
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content" style={{ width: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Cấu hình Dashboard Widgets</h3>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
          Lựa chọn các widget hiển thị trên Dashboard chính của bạn:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', paddingRight: '8px' }}>
          {Object.entries(widgetsRegistry)
            .filter(([_, w]) => w.roles.includes(activeRole))
            .map(([id, w]) => {
              const isChecked = enabledWidgets.includes(id);
              return (
                <label key={id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', border: '1px solid var(--color-border-light)', borderRadius: '6px', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleWidget(id, isChecked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600 }}>{w.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Kích thước: {w.size === 'small' ? 'Nhỏ' : w.size === 'medium' ? 'Trung bình' : 'Lớn'}</div>
                  </div>
                </label>
              );
            })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-filled-2" style={{ padding: '8px 20px', borderRadius: '4px' }}>
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
};
