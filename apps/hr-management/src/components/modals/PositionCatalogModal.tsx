import React, { useState, useEffect } from 'react';

interface PositionCatalogModalProps {
  isOpen: boolean;
  editingCatalog: any;
  onClose: () => void;
  onSave: (data: { code: string; name: string }) => void;
}

export const PositionCatalogModal: React.FC<PositionCatalogModalProps> = ({ isOpen, editingCatalog, onClose, onSave }) => {
  const [newCatalogCode, setNewCatalogCode] = useState('');
  const [newCatalogName, setNewCatalogName] = useState('');

  useEffect(() => {
    if (editingCatalog) {
      setNewCatalogCode(editingCatalog.cr5db_positioncatalogcode || '');
      setNewCatalogName(editingCatalog.cr5db_positioncatalog1 || '');
    } else {
      setNewCatalogCode('');
      setNewCatalogName('');
    }
  }, [editingCatalog, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ code: newCatalogCode, name: newCatalogName });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700 }}>
          {editingCatalog ? 'Edit Standard Title' : 'Add Standard Title'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Mã</label>
            <input type="text" value={newCatalogCode} onChange={(e) => setNewCatalogCode(e.target.value)} className="input-spec" required placeholder="DEV" />
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Tên chức danh</label>
            <input type="text" value={newCatalogName} onChange={(e) => setNewCatalogName(e.target.value)} className="input-spec" required placeholder="Developer" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn-filled-3">Hủy</button>
            <button type="submit" className="btn-primary">{editingCatalog ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
