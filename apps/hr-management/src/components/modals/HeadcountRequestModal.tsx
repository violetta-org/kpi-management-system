import React, { useState, useEffect } from 'react';

interface HeadcountRequestModalProps {
  isOpen: boolean;
  editingHeadcountRequest: any | null;
  activeRole: string;
  departmentsList: any[];
  companiesList: any[];
  positionCatalogList: any[];
  jobPositionsList: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}

export const HeadcountRequestModal: React.FC<HeadcountRequestModalProps> = ({
  isOpen,
  editingHeadcountRequest,
  activeRole,
  departmentsList,
  companiesList,
  positionCatalogList,
  jobPositionsList,
  onClose,
  onSave
}) => {
  const [newRequestName, setNewRequestName] = useState('');
  const [newRequestType, setNewRequestType] = useState('Increase Headcount');
  const [newReqDeptId, setNewReqDeptId] = useState('');
  const [newReqCatalogId, setNewReqCatalogId] = useState('');
  const [newReqQty, setNewReqQty] = useState(1);
  const [newReqReportsToId, setNewReqReportsToId] = useState('');
  const [newReqReason, setNewReqReason] = useState('');
  const [newReqStatus, setNewReqStatus] = useState('Pending');

  useEffect(() => {
    if (editingHeadcountRequest) {
      setNewRequestName(editingHeadcountRequest.cr5db_requestname || '');
      setNewRequestType(editingHeadcountRequest.cr5db_requesttype || 'Increase Headcount');
      setNewReqDeptId(editingHeadcountRequest._cr5db_department_value || '');
      setNewReqCatalogId(editingHeadcountRequest._cr5db_positioncatalog_value || '');
      setNewReqQty(editingHeadcountRequest.cr5db_requestedquantity || 1);
      setNewReqReportsToId(editingHeadcountRequest._cr5db_reportsto_value || '');
      setNewReqReason(editingHeadcountRequest.cr5db_reason || '');
      
      let statusStr = 'Pending';
      if (editingHeadcountRequest.cr5db_approvalstatus === 122650001) statusStr = 'Approved';
      else if (editingHeadcountRequest.cr5db_approvalstatus === 122650002) statusStr = 'Rejected';
      setNewReqStatus(statusStr);
    } else {
      setNewRequestName('');
      setNewRequestType('Increase Headcount');
      setNewReqDeptId(departmentsList[0]?.cr5db_departmentid || '');
      setNewReqCatalogId(positionCatalogList[0]?.cr5db_positioncatalogid || '');
      setNewReqQty(1);
      setNewReqReportsToId('');
      setNewReqReason('');
      setNewReqStatus('Pending');
    }
  }, [editingHeadcountRequest, departmentsList, positionCatalogList]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      newRequestName,
      newRequestType,
      newReqDeptId,
      newReqCatalogId,
      newReqQty,
      newReqReportsToId,
      newReqReason,
      newReqStatus
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700 }}>
          {editingHeadcountRequest ? 'Cập nhật đề xuất định biên' : 'Đề xuất bổ sung định biên'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Tên đề xuất</label>
            <input type="text" value={newRequestName} onChange={(e) => setNewRequestName(e.target.value)} className="input-spec" required placeholder="Đề xuất bổ sung..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Loại đề xuất</label>
              <select value={newRequestType} onChange={(e) => setNewRequestType(e.target.value)} className="input-spec" style={{ height: '38px', padding: '6px 12px' }}>
                <option value="Increase Headcount">Tăng định biên</option>
                <option value="Decrease Headcount">Giảm định biên</option>
                <option value="New Position">Vị trí mới</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Phòng ban</label>
              <select required value={newReqDeptId} onChange={(e) => setNewReqDeptId(e.target.value)} className="input-spec" style={{ height: '38px', padding: '6px 12px' }}>
                <option value="" disabled>-- Chọn phòng ban --</option>
                {departmentsList.map(d => {
                  const company = companiesList.find(c => c.cr5db_companyid === d._cr5db_companyid_value);
                  const displayLabel = company ? `${d.cr5db_departmentname} (${company.cr5db_companyname})` : d.cr5db_departmentname;
                  return (
                    <option key={d.cr5db_departmentid} value={d.cr5db_departmentid}>{displayLabel}</option>
                  );
                })}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Chức danh (Catalog)</label>
              <select required value={newReqCatalogId} onChange={(e) => setNewReqCatalogId(e.target.value)} className="input-spec" style={{ height: '38px', padding: '6px 12px' }}>
                <option value="" disabled>-- Chọn chức danh gốc --</option>
                {positionCatalogList.map(c => (
                  <option key={c.cr5db_positioncatalogid} value={c.cr5db_positioncatalogid}>{c.cr5db_positioncatalog1}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Số lượng</label>
              <input type="number" min={1} value={newReqQty} onChange={(e) => setNewReqQty(Number(e.target.value))} className="input-spec" style={{ height: '38px' }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Quản lý trực tiếp (Reports To)</label>
            <select value={newReqReportsToId} onChange={(e) => setNewReqReportsToId(e.target.value)} className="input-spec" style={{ height: '38px', padding: '6px 12px' }}>
              <option value="">Không có / Vị trí cấp cao nhất</option>
              {jobPositionsList.map(pos => {
                const dept = departmentsList.find(d => d.cr5db_departmentid === pos._cr5db_department_value);
                const company = dept ? companiesList.find(c => c.cr5db_companyid === dept._cr5db_companyid_value) : null;
                const deptPart = dept ? dept.cr5db_departmentname : '';
                const compPart = company ? ` - ${company.cr5db_companyname}` : '';
                const displayLabel = deptPart || compPart ? `${pos.cr5db_positionname} (${deptPart}${compPart})` : pos.cr5db_positionname;
                return (
                  <option key={pos.cr5db_jobpositionid} value={pos.cr5db_jobpositionid}>{displayLabel}</option>
                );
              })}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Lý do đề xuất</label>
            <textarea value={newReqReason} onChange={(e) => setNewReqReason(e.target.value)} className="input-spec" style={{ height: '70px', fontFamily: 'inherit' }} placeholder="Lý do..." />
          </div>

          {editingHeadcountRequest && activeRole === 'Admin' && (
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Trạng thái phê duyệt</label>
              <select value={newReqStatus} onChange={(e) => setNewReqStatus(e.target.value)} className="input-spec" style={{ height: '38px', padding: '6px 12px' }}>
                <option value="Pending">Chờ duyệt</option>
                <option value="Approved">Đã duyệt</option>
                <option value="Rejected">Từ chối</option>
              </select>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn-filled-3">Hủy</button>
            <button type="submit" className="btn-primary">{editingHeadcountRequest ? 'Lưu thay đổi' : 'Gửi đề xuất'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
