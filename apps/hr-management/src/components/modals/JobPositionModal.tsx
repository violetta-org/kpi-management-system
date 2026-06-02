import React, { useState, useEffect } from 'react';

interface JobPositionModalProps {
  isOpen: boolean;
  editingJobPosition: any;
  departmentsList: any[];
  companiesList: any[];
  positionCatalogList: any[];
  jobPositionsList: any[];
  competencyCatalogList: any[];
  onClose: () => void;
  onSave: (data: {
    name: string;
    deptId: string;
    catalogId: string;
    quota: number;
    reportsToId: string;
    competencyIds: string[];
  }) => void;
}

export const JobPositionModal: React.FC<JobPositionModalProps> = ({
  isOpen, editingJobPosition, departmentsList, companiesList, positionCatalogList, jobPositionsList, competencyCatalogList, onClose, onSave
}) => {
  const [newJobPosName, setNewJobPosName] = useState('');
  const [newJobPosDeptId, setNewJobPosDeptId] = useState('');
  const [newJobPosCatalogId, setNewJobPosCatalogId] = useState('');
  const [newJobPosQuota, setNewJobPosQuota] = useState(1);
  const [selectedReportsToPositionId, setSelectedReportsToPositionId] = useState('');
  const [newJobPosCompetencyIds, setNewJobPosCompetencyIds] = useState<string[]>([]);

  useEffect(() => {
    if (editingJobPosition) {
      setNewJobPosName(editingJobPosition.cr5db_positionname || '');
      setNewJobPosDeptId(editingJobPosition._cr5db_department_value || '');
      setNewJobPosCatalogId(editingJobPosition._cr5db_positioncatalog_value || '');
      setNewJobPosQuota(editingJobPosition.cr5db_quota || 1);
      setSelectedReportsToPositionId(editingJobPosition._cr5db_reportsto_value || '');
      // If competencies were fetched and attached to editingJobPosition, we might need to set them here.
      // Assuming they are passed as an array of IDs if available.
      setNewJobPosCompetencyIds(editingJobPosition.competencies || []);
    } else {
      setNewJobPosName('');
      setNewJobPosDeptId('');
      setNewJobPosCatalogId('');
      setNewJobPosQuota(1);
      setSelectedReportsToPositionId('');
      setNewJobPosCompetencyIds([]);
    }
  }, [editingJobPosition, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: newJobPosName,
      deptId: newJobPosDeptId,
      catalogId: newJobPosCatalogId,
      quota: newJobPosQuota,
      reportsToId: selectedReportsToPositionId,
      competencyIds: newJobPosCompetencyIds
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700 }}>
          {editingJobPosition ? 'Edit Job Position' : 'Create Job Position'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Tên vị trí</label>
            <input type="text" value={newJobPosName} onChange={(e) => setNewJobPosName(e.target.value)} className="input-spec" required placeholder="Ví dụ: Senior Frontend Engineer..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Phòng ban</label>
              <select required value={newJobPosDeptId} onChange={(e) => setNewJobPosDeptId(e.target.value)} className="input-spec" style={{ height: '38px', padding: '6px 12px' }}>
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
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Chức danh gốc (Catalog)</label>
              <select required value={newJobPosCatalogId} onChange={(e) => setNewJobPosCatalogId(e.target.value)} className="input-spec" style={{ height: '38px', padding: '6px 12px' }}>
                <option value="" disabled>-- Chọn chức danh gốc --</option>
                {positionCatalogList.map(pc => (
                  <option key={pc.cr5db_positioncatalogid} value={pc.cr5db_positioncatalogid}>{pc.cr5db_positioncatalog1}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Quota định biên</label>
              <input type="number" min={1} value={newJobPosQuota} onChange={(e) => setNewJobPosQuota(Number(e.target.value))} className="input-spec" style={{ height: '38px' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Quản lý trực tiếp (Reports To)</label>
              <select value={selectedReportsToPositionId} onChange={(e) => setSelectedReportsToPositionId(e.target.value)} className="input-spec" style={{ height: '38px', padding: '6px 12px' }}>
                <option value="">Không có</option>
                {jobPositionsList
                  .filter(pos => !editingJobPosition || pos.cr5db_jobpositionid !== editingJobPosition.cr5db_jobpositionid)
                  .map(pos => {
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
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Năng lực yêu cầu</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '10px' }}>
              {competencyCatalogList.map(comp => {
                const isChecked = newJobPosCompetencyIds.includes(comp.new_competencycatalogid);
                return (
                  <label key={comp.new_competencycatalogid} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewJobPosCompetencyIds([...newJobPosCompetencyIds, comp.new_competencycatalogid]);
                        } else {
                          setNewJobPosCompetencyIds(newJobPosCompetencyIds.filter(id => id !== comp.new_competencycatalogid));
                        }
                      }}
                    />
                    <span>{comp.new_name} ({comp.new_type === 'Core' ? 'Lõi' : comp.new_type === 'Leadership' ? 'Lãnh đạo' : 'Chuyên môn'})</span>
                  </label>
                );
              })}
              {competencyCatalogList.length === 0 && (
                <span style={{ fontSize: '12px', color: '#666' }}>Chưa có từ điển năng lực nào.</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn-filled-3">Hủy</button>
            <button type="submit" className="btn-primary">{editingJobPosition ? 'Update' : 'Tạo mới'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
