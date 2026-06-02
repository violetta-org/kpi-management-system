import React, { useState, useEffect } from 'react';

interface DepartmentModalProps {
  isOpen: boolean;
  editingDept: any;
  companiesList: any[];
  defaultCompanyId: string;
  onClose: () => void;
  onSave: (data: { code: string; name: string; companyId: string }) => void;
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({ isOpen, editingDept, companiesList, defaultCompanyId, onClose, onSave }) => {
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [selectedDeptCompanyId, setSelectedDeptCompanyId] = useState(defaultCompanyId);

  useEffect(() => {
    if (editingDept) {
      setNewDeptCode(editingDept.cr5db_departmentcode || '');
      setNewDeptName(editingDept.cr5db_departmentname || '');
      setSelectedDeptCompanyId(editingDept._cr5db_companyid_value || defaultCompanyId || (companiesList[0]?.cr5db_companyid || ''));
    } else {
      setNewDeptCode('');
      setNewDeptName('');
      setSelectedDeptCompanyId(defaultCompanyId || (companiesList[0]?.cr5db_companyid || ''));
    }
  }, [editingDept, isOpen, defaultCompanyId, companiesList]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ code: newDeptCode, name: newDeptName, companyId: selectedDeptCompanyId });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700 }}>
          {editingDept ? 'Edit Department' : 'Add Department'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Mã phòng ban</label>
            <input type="text" value={newDeptCode} onChange={(e) => setNewDeptCode(e.target.value)} className="input-spec" required placeholder="HR" />
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Tên phòng ban</label>
            <input type="text" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} className="input-spec" required placeholder="Human Resources" />
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Công ty trực thuộc</label>
            <select value={selectedDeptCompanyId} onChange={(e) => setSelectedDeptCompanyId(e.target.value)} className="input-spec" style={{ height: '38px', padding: '6px 12px' }}>
              {companiesList.map(c => (
                <option key={c.cr5db_companyid} value={c.cr5db_companyid}>{c.cr5db_companyname}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn-filled-3">Hủy</button>
            <button type="submit" className="btn-primary">{editingDept ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
