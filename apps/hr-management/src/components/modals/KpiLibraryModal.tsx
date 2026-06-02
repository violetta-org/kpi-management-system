import React, { useState, useEffect } from 'react';

interface KpiLibraryModalProps {
  isOpen: boolean;
  editingKpiLibrary: any | null;
  isAiGenerating: boolean;
  onAiImprove: (name: string, callback: (improvedName: string) => void) => void;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const KpiLibraryModal: React.FC<KpiLibraryModalProps> = ({
  isOpen,
  editingKpiLibrary,
  isAiGenerating,
  onAiImprove,
  onClose,
  onSave
}) => {
  const [kpiLibName, setKpiLibName] = useState('');
  const [kpiLibUnit, setKpiLibUnit] = useState('');
  const [kpiLibFormula, setKpiLibFormula] = useState('');
  const [kpiLibDirection, setKpiLibDirection] = useState(1);
  const [kpiQualityScore, setKpiQualityScore] = useState(0);

  useEffect(() => {
    if (editingKpiLibrary) {
      setKpiLibName(editingKpiLibrary.cr5db_kpiname || '');
      setKpiLibUnit(editingKpiLibrary.cr5db_unit || '');
      setKpiLibFormula(editingKpiLibrary.cr5db_formula || '');
      setKpiLibDirection(editingKpiLibrary.cr5db_optimizationdirection || 1);
    } else {
      setKpiLibName('');
      setKpiLibUnit('');
      setKpiLibFormula('');
      setKpiLibDirection(1);
    }
  }, [editingKpiLibrary]);

  useEffect(() => {
    if (kpiLibName.trim()) {
      let score = 30;
      const lower = kpiLibName.toLowerCase();
      if (lower.includes('tăng') || lower.includes('giảm') || lower.includes('đạt') || lower.includes('increase') || lower.includes('decrease')) score += 20;
      if (/\d/.test(lower) || lower.includes('%')) score += 30;
      if (lower.includes('tháng') || lower.includes('quý') || lower.includes('năm') || lower.includes('ngày') || lower.includes('thời hạn')) score += 20;
      setKpiQualityScore(Math.min(100, score));
    } else {
      setKpiQualityScore(0);
    }
  }, [kpiLibName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      kpiLibName,
      kpiLibUnit,
      kpiLibFormula,
      kpiLibDirection
    });
  };

  const handleAiImprove = () => {
    onAiImprove(kpiLibName, (improved) => {
      setKpiLibName(improved);
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '460px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>
          {editingKpiLibrary ? 'Chinh sua KPI' : 'Them KPI moi vao thu vien'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '13px' }}>Tên KPI <span style={{ color: '#dc2626' }}>*</span></label>
              <button
                type="button"
                onClick={handleAiImprove}
                disabled={isAiGenerating || !kpiLibName.trim()}
                style={{ background: 'none', border: 'none', color: isAiGenerating ? 'var(--color-text-secondary)' : 'var(--color-primary)', fontSize: '13px', fontWeight: 600, cursor: (isAiGenerating || !kpiLibName.trim()) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {isAiGenerating ? <i className="fas fa-spinner fa-spin"></i> : '🪄'} {isAiGenerating ? 'Đang xử lý...' : 'Làm mượt bằng AI'}
              </button>
            </div>
            <input value={kpiLibName} onChange={e => setKpiLibName(e.target.value)} required placeholder="Ví dụ: Doanh số tháng, Tỷ lệ điểm danh..." style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />

            {kpiLibName.trim() && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '11px', fontWeight: 600 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>S.M.A.R.T Score</span>
                  <span style={{ color: kpiQualityScore < 50 ? '#dc2626' : kpiQualityScore < 80 ? '#d97706' : '#10b981' }}>{kpiQualityScore}/100</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-border-light)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${kpiQualityScore}%`,
                    backgroundColor: kpiQualityScore < 50 ? '#dc2626' : kpiQualityScore < 80 ? '#d97706' : '#10b981',
                    transition: 'width 0.3s ease, background-color 0.3s ease'
                  }}></div>
                </div>
                {kpiQualityScore < 70 && (
                  <div style={{ fontSize: '11px', color: '#d97706', marginTop: '6px', fontStyle: 'italic' }}>
                    * Gợi ý: Hãy thêm động từ (Tăng/Giảm), số liệu đo lường hoặc thời hạn để câu KPI chuẩn S.M.A.R.T hơn.
                  </div>
                )}
              </div>
            )}
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Don vi do luong</label>
            <input
              value={kpiLibUnit}
              onChange={e => setKpiLibUnit(e.target.value)}
              list="kpi-unit-options"
              placeholder="Chon hoac nhap don vi (vd: %, VND, km...)"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <datalist id="kpi-unit-options">
              <option value="%">% (Phan tram)</option>
              <option value="VND">VND (Dong)</option>
              <option value="USD">USD (Do la)</option>
              <option value="Days">Days (Ngay)</option>
              <option value="Units">Units (Don vi)</option>
              <option value="Score">Score (Diem)</option>
              <option value="Tasks">Tasks (Nhiem vu)</option>
              <option value="Hours">Hours (Gio)</option>
            </datalist>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Cong thuc tinh (tuy chon)</label>
            <input value={kpiLibFormula} onChange={e => setKpiLibFormula(e.target.value)} placeholder="Vi du: (Actual / Target) * 100" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', fontFamily: 'monospace', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Chiều hướng tối ưu</label>
            <select
              value={kpiLibDirection}
              onChange={e => setKpiLibDirection(Number(e.target.value))}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', height: '40px', backgroundColor: '#ffffff' }}
            >
              <option value={1}>Tối đa hóa (Higher is better)</option>
              <option value={2}>Tối thiểu hóa (Lower is better)</option>
              <option value={3}>Đạt / Không đạt (Binary)</option>
              <option value={4}>Cột mốc (Milestone)</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" onClick={onClose} className="btn-filled-3">Huy</button>
            <button type="submit" className="btn-primary">Luu KPI</button>
          </div>
        </form>
      </div>
    </div>
  );
};
