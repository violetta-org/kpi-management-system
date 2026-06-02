import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { hasTabPermission } from '../../lib/types';

interface KpiModalProps {
  isOpen: boolean;
  editingKpi: any | null;
  onClose: () => void;
  onSave: (kpiData: {
    targetName: string;
    targetValue: number;
    actualValue: number;
    weight: number;
    unit: string;
    employeeId: string;
    objectiveId: string;
    libraryId: string;
    parentKpiId: string;
    rollupMethod: string;
    period: string;
    standardHoursLimit: number;
    activeTasksLimit: number;
  }) => Promise<void>;
}

export const KpiModal: React.FC<KpiModalProps> = ({
  isOpen,
  editingKpi,
  onClose,
  onSave,
}) => {
  const {
    activeRole,
    usersList,
    currentUserEmail,
    permissionGroups,
    kpiLibrariesList,
    objectivesList,
    evaluationPeriodsList,
    kpiTargets,
  } = useAppState();

  // Local form states
  const [kpiTargetName, setKpiTargetName] = useState('');
  const [kpiTargetValue, setKpiTargetValue] = useState<number>(100);
  const [kpiActualValue, setKpiActualValue] = useState<number>(0);
  const [kpiWeight, setKpiWeight] = useState<number>(10);
  const [kpiUnit, setKpiUnit] = useState('%');
  const [kpiEmployeeId, setKpiEmployeeId] = useState('');
  const [kpiObjectiveId, setKpiObjectiveId] = useState('');
  const [kpiLibraryId, setKpiLibraryId] = useState('');
  const [kpiParentKpiId, setKpiParentKpiId] = useState('');
  const [kpiRollupMethod, setKpiRollupMethod] = useState('Manual');
  const [kpiPeriod, setKpiPeriod] = useState('Q2/2026');
  const [kpiStandardHoursLimit, setKpiStandardHoursLimit] = useState<number>(0);
  const [kpiActiveTasksLimit, setKpiActiveTasksLimit] = useState<number>(0);

  // Helper permission check
  const checkPermission = (tabId: string) => {
    if (activeRole === 'Admin') return true;
    const currentUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
    return hasTabPermission(currentUserObj, tabId, permissionGroups);
  };

  const isEmployeeMode = activeRole === 'Employee' && !checkPermission('kpi-catalog');

  // Sync form states on edit or create
  useEffect(() => {
    if (isOpen) {
      if (editingKpi) {
        setKpiTargetName(editingKpi.cr5db_kpiname || '');
        setKpiTargetValue(editingKpi.cr5db_targetvalue || 100);
        setKpiActualValue(editingKpi.cr5db_actualvalue || 0);
        setKpiWeight(editingKpi.cr5db_weightpercentage || 10);
        setKpiUnit(editingKpi.cr5db_unit || '%');
        setKpiEmployeeId(editingKpi._cr5db_employeeid_value || '');
        setKpiObjectiveId(editingKpi._cr5db_objectiveid_value || '');
        setKpiLibraryId(editingKpi._cr5db_kpilibraryid_value || '');
        setKpiParentKpiId(editingKpi._cr5db_parentkpiid_value || '');
        setKpiRollupMethod(editingKpi.cr5db_rollupmethod || 'Manual');
        setKpiPeriod(editingKpi.cr5db_period || '');
        setKpiStandardHoursLimit(editingKpi.new_standardhourslimit || 0);
        setKpiActiveTasksLimit(editingKpi.new_activetaskslimit || 0);
      } else {
        setKpiTargetName('');
        setKpiTargetValue(100);
        setKpiActualValue(0);
        setKpiWeight(10);
        setKpiUnit('%');
        setKpiEmployeeId(usersList[0]?.cr5db_userid || '');
        setKpiLibraryId(kpiLibrariesList[0]?.cr5db_kpilibraryid || '');
        setKpiObjectiveId(objectivesList[0]?.cr5db_objectiveid || '');
        setKpiParentKpiId('');
        setKpiRollupMethod('Manual');
        setKpiPeriod(evaluationPeriodsList[0]?.cr5db_evaluationperiod1 || 'Q2/2026');
        setKpiStandardHoursLimit(0);
        setKpiActiveTasksLimit(0);
      }
    }
  }, [editingKpi, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      targetName: kpiTargetName,
      targetValue: kpiTargetValue,
      actualValue: kpiActualValue,
      weight: kpiWeight,
      unit: kpiUnit,
      employeeId: kpiEmployeeId,
      objectiveId: kpiObjectiveId,
      libraryId: kpiLibraryId,
      parentKpiId: kpiParentKpiId,
      rollupMethod: kpiRollupMethod,
      period: kpiPeriod,
      standardHoursLimit: kpiStandardHoursLimit,
      activeTasksLimit: kpiActiveTasksLimit,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: isEmployeeMode ? '400px' : '500px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700 }}>
          {isEmployeeMode
            ? 'Cập nhật tiến độ thực tế KPI'
            : editingKpi ? 'Chỉnh sửa mục tiêu KPI' : 'Gán chỉ tiêu KPI mới'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isEmployeeMode ? (
            // Employee Simplified Form
            <>
              <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#FAF9F9', padding: '12px', borderRadius: '6px', border: '1px solid var(--color-border-light)' }}>
                <div><strong>KPI:</strong> {editingKpi?.cr5db_kpiname}</div>
                <div><strong>Mục tiêu chỉ tiêu:</strong> {editingKpi?.cr5db_targetvalue} {editingKpi?.cr5db_unit}</div>
                <div><strong>Tỷ trọng:</strong> {editingKpi?.cr5db_weightpercentage}%</div>
                <div><strong>Giai đoạn:</strong> {editingKpi?.cr5db_period}</div>
              </div>
              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Giá trị thực tế đạt được ({editingKpi?.cr5db_unit})</label>
                <input
                  type="number"
                  step="any"
                  value={kpiActualValue}
                  onChange={(e) => setKpiActualValue(Number(e.target.value))}
                  className="input-spec"
                  required
                />
              </div>
            </>
          ) : (
            // Manager / Admin Complete Form
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Nhân viên thực hiện</label>
                  <select
                    value={kpiEmployeeId}
                    onChange={(e) => setKpiEmployeeId(e.target.value)}
                    className="input-spec"
                    style={{ height: '38px', padding: '6px 12px' }}
                    required
                  >
                    {usersList.map(u => (
                      <option key={u.cr5db_userid} value={u.cr5db_userid}>{u.cr5db_fullname}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Mã KPI danh mục (Library)</label>
                  <select
                    value={kpiLibraryId}
                    onChange={(e) => {
                      const lib = kpiLibrariesList.find(x => x.cr5db_kpilibraryid === e.target.value);
                      setKpiLibraryId(e.target.value);
                      if (lib) {
                        setKpiTargetName(lib.cr5db_kpiname);
                        setKpiUnit(lib.cr5db_unit || '%');
                      }
                    }}
                    className="input-spec"
                    style={{ height: '38px', padding: '6px 12px' }}
                    required
                  >
                    {kpiLibrariesList.map(lib => (
                      <option key={lib.cr5db_kpilibraryid} value={lib.cr5db_kpilibraryid}>
                        {lib.cr5db_kpiname} ({lib.cr5db_unit || '%'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Tên mục tiêu KPI hiển thị</label>
                <input
                  type="text"
                  value={kpiTargetName}
                  onChange={(e) => setKpiTargetName(e.target.value)}
                  className="input-spec"
                  required
                  placeholder="Ví dụ: Tăng trưởng doanh số Q2"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Chu kỳ đánh giá (Period)</label>
                  <select
                    value={kpiPeriod}
                    onChange={(e) => {
                      const newPeriod = e.target.value;
                      setKpiPeriod(newPeriod);
                      const firstObj = objectivesList.find(o => o.cr5db_periodnamename === newPeriod);
                      if (firstObj) {
                        setKpiObjectiveId(firstObj.cr5db_objectiveid);
                      } else {
                        setKpiObjectiveId('');
                      }
                    }}
                    className="input-spec"
                    style={{ height: '38px', padding: '6px 12px' }}
                    required
                  >
                    {evaluationPeriodsList.map(ep => (
                      <option key={ep.cr5db_evaluationperiodid} value={ep.cr5db_evaluationperiod1}>
                        {ep.cr5db_evaluationperiod1}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Liên kết mục tiêu chung (Objective)</label>
                  <select
                    value={kpiObjectiveId}
                    onChange={(e) => {
                      const objId = e.target.value;
                      setKpiObjectiveId(objId);
                      const matchedObj = objectivesList.find(o => o.cr5db_objectiveid === objId);
                      if (matchedObj && matchedObj.cr5db_periodnamename) {
                        setKpiPeriod(matchedObj.cr5db_periodnamename);
                      }
                    }}
                    className="input-spec"
                    style={{ height: '38px', padding: '6px 12px' }}
                    required
                  >
                    {objectivesList
                      .filter(o => !kpiPeriod || o.cr5db_periodnamename === kpiPeriod || !o.cr5db_periodnamename || o.cr5db_objectiveid === kpiObjectiveId)
                      .map(o => (
                        <option key={o.cr5db_objectiveid} value={o.cr5db_objectiveid}>
                          {o.cr5db_objective1}{!o.cr5db_periodnamename ? ' (Không thuộc chu kỳ nào)' : ''}
                        </option>
                      ))
                    }
                    {objectivesList.filter(o => !kpiPeriod || o.cr5db_periodnamename === kpiPeriod || !o.cr5db_periodnamename || o.cr5db_objectiveid === kpiObjectiveId).length === 0 && (
                      <option value="">Không có mục tiêu nào trong chu kỳ này</option>
                    )}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Liên kết KPI cấp trên (Parent KPI)</label>
                  <select
                    value={kpiParentKpiId}
                    onChange={(e) => setKpiParentKpiId(e.target.value)}
                    className="input-spec"
                    style={{ height: '38px', padding: '6px 12px' }}
                  >
                    <option value="">-- Không có (KPI độc lập) --</option>
                    {kpiTargets
                      .filter(k => k.cr5db_kpitargetid !== editingKpi?.cr5db_kpitargetid) // Not itself
                      .filter(k => !kpiPeriod || k.cr5db_period === kpiPeriod) // Same period
                      .map(k => (
                        <option key={k.cr5db_kpitargetid} value={k.cr5db_kpitargetid}>
                          {k.cr5db_kpiname} ({k.cr5db_employee_name || 'No Assignee'})
                        </option>
                      ))
                    }
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Phương pháp tính điểm (Rollup Method)</label>
                  <select
                    value={kpiRollupMethod}
                    onChange={(e) => setKpiRollupMethod(e.target.value)}
                    className="input-spec"
                    style={{ height: '38px', padding: '6px 12px' }}
                    required
                  >
                    <option value="Manual">Manual (Nhập tay / Chỉ xem liên kết)</option>
                    <option value="Average">Average (Trung bình cộng các KPI con)</option>
                    <option value="Sum">Sum (Cộng dồn Actual của các KPI con)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Mục tiêu chỉ tiêu</label>
                  <input
                    type="number"
                    step="any"
                    value={kpiTargetValue}
                    onChange={(e) => setKpiTargetValue(Number(e.target.value))}
                    className="input-spec"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Thực tế hiện tại</label>
                  <input
                    type="number"
                    step="any"
                    value={kpiActualValue}
                    onChange={(e) => setKpiActualValue(Number(e.target.value))}
                    className="input-spec"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Đơn vị đo lường</label>
                  <input
                    type="text"
                    value={kpiUnit}
                    onChange={(e) => setKpiUnit(e.target.value)}
                    className="input-spec"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                    Giới hạn Giờ làm việc (Hours Limit)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min={0}
                    value={kpiStandardHoursLimit}
                    onChange={(e) => setKpiStandardHoursLimit(Number(e.target.value))}
                    className="input-spec"
                    required
                  />
                  <span style={{ fontSize: '10px', color: '#666666' }}>Gợi ý: {Math.round(kpiWeight * 0.4)} giờ/tuần (dựa trên {kpiWeight}%)</span>
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                    Giới hạn Tasks mở (WIP Limit)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={kpiActiveTasksLimit}
                    onChange={(e) => setKpiActiveTasksLimit(Number(e.target.value))}
                    className="input-spec"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Tỷ trọng (%) trong tổng KPI</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={kpiWeight}
                  onChange={(e) => setKpiWeight(Number(e.target.value))}
                  className="input-spec"
                  required
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-filled-3"
            >
              Hủy
            </button>
            <button type="submit" className="btn-filled-2" style={{ backgroundColor: '#742774' }}>
              {editingKpi ? 'Cập nhật' : 'Gán chỉ tiêu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
