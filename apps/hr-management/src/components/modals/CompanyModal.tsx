import React, { useState, useEffect } from 'react';

interface CompanyModalProps {
  isOpen: boolean;
  editingCompany: any;
  onClose: () => void;
  onSave: (data: { code: string; name: string }) => void;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({ isOpen, editingCompany, onClose, onSave }) => {
  const [newCompanyCode, setNewCompanyCode] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');

  useEffect(() => {
    if (editingCompany) {
      setNewCompanyCode(editingCompany.cr5db_companycode || '');
      setNewCompanyName(editingCompany.cr5db_companyname || '');
    } else {
      setNewCompanyCode('');
      setNewCompanyName('');
    }
  }, [editingCompany, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ code: newCompanyCode, name: newCompanyName });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700 }}>
          {editingCompany ? 'Edit Company' : 'Add Company'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Mã công ty</label>
            <input type="text" value={newCompanyCode} onChange={(e) => setNewCompanyCode(e.target.value)} className="input-spec" required placeholder="VNX" />
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Tên công ty</label>
            <input type="text" value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)} className="input-spec" required placeholder="Vietnam Express Corp" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn-filled-3">Hủy</button>
            <button type="submit" className="btn-primary">{editingCompany ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
