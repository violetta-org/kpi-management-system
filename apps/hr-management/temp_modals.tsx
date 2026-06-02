        <form onSubmit={handleSaveJobCompetency} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!editingJobCompetency && (
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Chọn năng lực <span style={{ color: '#dc2626' }}>*</span></label>
              <select value={newJobCompetencyId} onChange={e => setNewJobCompetencyId(e.target.value)} required style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: 'white' }}>
                <option value="">-- Chọn một năng lực --</option>
                {competencyCatalogList.map(c => (
                  <option key={c.new_competencycatalogid} value={c.new_competencycatalogid}>{c.new_competencyname} ({c.new_competencytype})</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Mức điểm yêu cầu (Required Level) <span style={{ color: '#dc2626' }}>*</span></label>
            <input type="number" min="1" max="10" step="0.5" value={newRequiredLevel} onChange={e => setNewRequiredLevel(Number(e.target.value))} required style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" onClick={() => setShowJobCompetencyModal(false)} className="btn-filled-3">Hủy</button>
            <button type="submit" className="btn-primary">Lưu cấu hình</button>
          </div>
        </form>
      </div>
    </div>
  )
}

{/* Timesheet Rejection Modal */ }
{
  showRejectionModal && (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700 }}>Từ chối Timesheet</h3>
        <form onSubmit={handleRejectTimesheetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Lý do từ chối (bắt buộc)</label>
            <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="input-spec" style={{ height: '70px', fontFamily: 'inherit' }} required placeholder="Nhập lý do từ chối..." />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={() => setShowRejectionModal(false)} className="btn-filled-3">Hủy</button>
            <button type="submit" className="btn-primary" style={{ backgroundColor: '#a80000' }}>Từ chối</button>
          </div>
        </form>
      </div>
    </div>
  )
}

{/* Company Modal */ }
{
  showIdpModal && (
    <div className="modal-overlay" onClick={() => setShowIdpModal(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Tạo IDP mới</h3>
        <p style={{ marginBottom: '16px', color: 'var(--color-text-secondary)' }}>
          Nhân viên tạo bản nháp IDP cho chu kỳ hiện tại.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button type="button" onClick={() => setShowIdpModal(false)} className="btn-filled-3">Hủy</button>
          <button onClick={handleSaveIdp} className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Đang lưu...' : 'Tạo mới'}
          </button>
        </div>
      </div>
    </div>
  )
}

{
  showIdpActionModal && editingIdp && (
    <div className="modal-overlay" onClick={() => setShowIdpActionModal(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Chi tiết Kế hoạch phát triển: {editingIdp.new_idp1}</h3>

        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>Danh sách Hành động (Actions)</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '8px' }}>Tên hành động</th>
                <th style={{ padding: '8px' }}>Trạng thái</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {idpActionList.filter(a => a._new_idpid_value === editingIdp.new_idpid).length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: '8px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Chưa có hành động nào.</td>
                </tr>
              )}
              {idpActionList.filter(a => a._new_idpid_value === editingIdp.new_idpid).map(a => (
                <tr key={a.new_idp_actionid} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '8px' }}>{a.new_actionname}</td>
                  <td style={{ padding: '8px' }}>{a.new_status || 'Chưa thực hiện'}</td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>
                    <button onClick={() => handleDeleteIdpAction(a.new_idp_actionid)} className="btn-filled-3" style={{ color: '#a80000', borderColor: '#a80000', padding: '4px 8px', fontSize: '12px' }}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn-filled-3" style={{ marginTop: '12px' }} onClick={() => {
            const name = prompt('Nhập tên hành động mới:');
            if (name) {
              setIsLoading(true);
              import('./generated/services/New_idpactionService').then(({ New_idpactionService }) => {
                New_idpactionService.create({
                  new_actionname: name,
                  new_status: 'Chưa thực hiện',
                  "new_IDPId@odata.bind": `/new_idps(${editingIdp.new_idpid})`
                }).then(() => {
                  // Workaround: Call global fetch directly
                  window.location.reload();
                });
              });
            }
          }}>+ Thêm hành động</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button type="button" onClick={() => setShowIdpActionModal(false)} className="btn-filled-3">Đóng</button>
        </div>
      </div>
    </div>
  )
}

{
  showProcessModal && (
    <div className="modal-overlay" onClick={() => setShowProcessModal(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Tạo Quy trình mới</h3>
        <form onSubmit={handleCreateProcess} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Chọn Nhân viên</label>
            <select
              value={newProcessEmployeeId}
              onChange={(e) => setNewProcessEmployeeId(e.target.value)}
              className="input-spec"
              required
            >
              <option value="">-- Chọn nhân viên --</option>
              {usersList.map(u => (
                <option key={u.cr5db_userid} value={u.cr5db_userid}>{u.cr5db_fullname} ({u.cr5db_email})</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Chọn Template Mẫu</label>
            <select
              value={newProcessTemplateId}
              onChange={(e) => setNewProcessTemplateId(e.target.value)}
              className="input-spec"
              required
            >
              <option value="">-- Chọn template --</option>
              {processTemplateList.map(t => (
                <option key={t.new_processtemplateid} value={t.new_processtemplateid}>{t.new_name} ({t.new_type})</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={() => setShowProcessModal(false)} className="btn-filled-3">Hủy</button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Đang tạo...' : 'Tạo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

{
  showProcessDetailModal && selectedProcessId && (
    <div className="modal-overlay" onClick={() => setShowProcessDetailModal(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px', width: '90%' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Chi tiết quy trình</h3>

        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>Danh sách các bước (Checklist)</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '8px', width: '50px' }}>STT</th>
                <th style={{ padding: '8px' }}>Tên công việc</th>
                <th style={{ padding: '8px' }}>Phân công</th>
                <th style={{ padding: '8px' }}>Trạng thái</th>
                <th style={{ padding: '8px', textAlign: 'center' }}>Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {processStepList
                .filter(s => s._new_processid_value === selectedProcessId)
                .sort((a, b) => (a.new_order || 0) - (b.new_order || 0))
                .map((step, index) => {
                  const assignedUser = usersList.find(u => u.cr5db_userid === step._new_assigneduser_value);
                  const assignedDept = departmentsList.find(d => d.cr5db_departmentid === step._new_assigneddepartment_value);
                  const assigneeText = assignedUser ? assignedUser.cr5db_fullname : (assignedDept ? `Phòng ${assignedDept.cr5db_departmentname}` : step.new_assigneerole);

                  const currentUserPosition = jobPositionsList.find(p => p.cr5db_jobpositionid === currentUserObj?._cr5db_jobposition_value);
                  const isMyTask = activeRole === 'Admin' ||
                    step._new_assigneduser_value === currentUserObj?.cr5db_userid ||
                    (step._new_assigneddepartment_value && currentUserPosition?._cr5db_department_value === step._new_assigneddepartment_value) ||
                    (step.new_assigneerole && step.new_assigneerole === activeRole);

                  return (
                    <tr key={step.new_processstepid} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '8px' }}>{index + 1}</td>
                      <td style={{ padding: '8px', fontWeight: 500 }}>
                        {step.new_name}
                        {step.new_completeddate && <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Hoàn tất: {new Date(step.new_completeddate).toLocaleString('vi-VN')}</div>}
                      </td>
                      <td style={{ padding: '8px' }}>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          backgroundColor: '#f3f2f1',
                          color: '#323130'
                        }}>
                          {assigneeText}
                        </span>
                      </td>
                      <td style={{ padding: '8px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: step.new_status === 'Completed' ? 'rgba(16, 124, 65, 0.1)' : 'rgba(0, 120, 212, 0.1)',
                          color: step.new_status === 'Completed' ? '#107c41' : '#0078d4'
                        }}>
                          {step.new_status || 'Pending'}
                        </span>
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>
                        {step.new_status !== 'Completed' ? (
                          <button
                            className={isMyTask ? "btn-primary" : "btn-filled-3"}
                            style={{ padding: '4px 8px', fontSize: '12px', opacity: isMyTask ? 1 : 0.5, cursor: isMyTask ? 'pointer' : 'not-allowed' }}
                            onClick={() => {
                              if (isMyTask) handleUpdateProcessStep(step.new_processstepid, 'Completed');
                            }}
                            disabled={!isMyTask}
                            title={isMyTask ? "Nhấn để hoàn tất" : "Bạn không có quyền cập nhật task này"}
                          >
                            Hoàn tất
                          </button>
                        ) : (
                          <i className="fas fa-check-circle" style={{ color: '#107c41', fontSize: '16px' }}></i>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button type="button" onClick={() => setShowProcessDetailModal(false)} className="btn-filled-3">Đóng</button>
        </div>
      </div>
    </div>
  )
}

{
  <CompanyModal
    isOpen={showCompanyModal}
    editingCompany={editingCompany}
    onClose={() => {
      setShowCompanyModal(false);
      setEditingCompany(null);
    }}
    onSave={handleAddCompany}
  />
}

{/* Department Modal */ }
{
  <DepartmentModal
    isOpen={showDeptModal}
    editingDept={editingDept}
    companiesList={companiesList}
    defaultCompanyId={companiesList[0]?.cr5db_companyid || ''}
    onClose={() => {
      setShowDeptModal(false);
      setEditingDept(null);
    }}
    onSave={handleAddDepartment}
  />
}

{/* Position Catalog Modal */ }
{
  <PositionCatalogModal
    isOpen={showCatalogModal}
    editingCatalog={editingCatalog}
    onClose={() => {
      setShowCatalogModal(false);
      setEditingCatalog(null);
    }}
    onSave={handleAddCatalog}
  />
}

{/* Job Position Modal */ }
{
  <JobPositionModal
    isOpen={showJobPositionModal}
    editingJobPosition={editingJobPosition}
    departmentsList={departmentsList}
    companiesList={companiesList}
    positionCatalogList={positionCatalogList}
    jobPositionsList={jobPositionsList}
    competencyCatalogList={competencyCatalogList}
    onClose={() => {
      setShowJobPositionModal(false);
      setEditingJobPosition(null);
    }}
    onSave={handleAddJobPosition}
  />
}

{/* Role Assignment Modal */ }
{
  showAssignRoleModal && (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700 }}>Gán vai trò hệ thống</h3>
        <form onSubmit={handleAssignRole} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Chọn User</label>
            <select value={assignRoleUserId} onChange={(e) => setAssignRoleUserId(e.target.value)} className="input-spec" style={{ height: '38px', padding: '6px 12px' }}>
              {usersList.map(u => (
                <option key={u.cr5db_userid} value={u.cr5db_userid}>{u.cr5db_fullname} ({u.cr5db_email || 'No email'})</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Chọn vai trò</label>
            <select value={assignRoleName} onChange={(e) => setAssignRoleName(e.target.value)} className="input-spec" style={{ height: '38px', padding: '6px 12px' }}>
              <option value="Employee">Employee</option>
              {activeRole === 'Admin' && <option value="Admin">Super Admin</option>}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Lý do gán vai trò</label>
            <textarea value={assignRoleNotes} onChange={(e) => setAssignRoleNotes(e.target.value)} className="input-spec" style={{ height: '70px', fontFamily: 'inherit' }} placeholder="Ghi chú gán vai trò..." />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={() => setShowAssignRoleModal(false)} className="btn-filled-3">Hủy</button>
            <button type="submit" className="btn-primary">Gán vai trò</button>
          </div>
        </form>
      </div>
    </div>
  )
}

{/* Directory Details Dialog */ }
{
  selectedDirectoryUser && (
    <div className="modal-overlay" onClick={() => setSelectedDirectoryUser(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700 }}>Thông tin chi tiết</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
          <div><strong>Họ tên:</strong> {selectedDirectoryUser.cr5db_fullname}</div>
          <div><strong>Email:</strong> {selectedDirectoryUser.cr5db_email || 'Chưa cấu hình'}</div>
          <div><strong>Job Position:</strong> {selectedDirectoryUser.cr5db_jobpositionname || 'Chưa phân công'}</div>
          <div><strong>System Role:</strong> {selectedDirectoryUser.cr5db_systemrole || 'Mặc định (Employee)'}</div>
          <div><strong>Trạng thái:</strong> {selectedDirectoryUser.cr5db_isactive ? 'Active' : 'Inactive'}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button onClick={() => setSelectedDirectoryUser(null)} className="btn-filled-3">Đóng</button>
        </div>
      </div>
    </div>
  )
}

{/* Employee Modal (Add / Edit) */ }
{
  showEmployeeModal && (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700 }}>
          {editingEmployee ? 'Chỉnh sửa hồ sơ nhân viên' : 'Thêm mới nhân viên'}
        </h3>
        <form onSubmit={handleSaveEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Họ và tên</label>
            <input
              type="text"
              value={employeeFullName}
              onChange={(e) => setEmployeeFullName(e.target.value)}
              className="input-spec"
              required
              placeholder="Ví dụ: Nguyễn Văn A"
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Email (Microsoft Account)</label>
            <input
              type="email"
              value={employeeEmail}
              onChange={(e) => setEmployeeEmail(e.target.value)}
              className="input-spec"
              required
              placeholder="user@sv1.dut.udn.vn"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Vai trò hệ thống</label>
              <select
                value={employeeRole}
                onChange={(e) => setEmployeeRole(e.target.value)}
                className="input-spec"
                style={{ height: '38px', padding: '6px 12px' }}
              >
                <option value="Employee">Employee</option>
                {activeRole === 'Admin' && <option value="Admin">Super Admin</option>}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Trạng thái</label>
              <select
                value={employeeIsActive ? 'true' : 'false'}
                onChange={(e) => setEmployeeIsActive(e.target.value === 'true')}
                className="input-spec"
                style={{ height: '38px', padding: '6px 12px' }}
              >
                <option value="true">Đang hoạt động</option>
                <option value="false">Tạm khóa</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Vị trí công việc (Job Position)</label>
            <select
              value={employeeJobPositionId}
              onChange={(e) => setEmployeeJobPositionId(e.target.value)}
              className="input-spec"
              style={{ height: '38px', padding: '6px 12px' }}
            >
              <option value="">-- Chưa phân công --</option>
              {jobPositionsList.map(pos => {
                const dept = departmentsList.find(d => d.cr5db_departmentid === pos._cr5db_department_value);
                const company = dept ? companiesList.find(c => c.cr5db_companyid === dept._cr5db_companyid_value) : null;
                const deptPart = dept ? dept.cr5db_departmentname : 'Dùng chung';
                const compPart = company ? ` - ${company.cr5db_companyname}` : '';
                const displayLabel = `${pos.cr5db_positionname} (${deptPart}${compPart})`;
                return (
                  <option key={pos.cr5db_jobpositionid} value={pos.cr5db_jobpositionid}>
                    {displayLabel}
                  </option>
                );
              })}
            </select>
          </div>

          {employeeRole === 'Employee' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600 }}>Nhóm quyền tham gia (Permission Groups):</label>
              {permissionGroups.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Chưa có nhóm quyền nào được tạo.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '10px' }}>
                  {permissionGroups.map(group => {
                    const isChecked = employeeSelectedGroups.includes(group.id);
                    return (
                      <label key={group.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEmployeeSelectedGroups([...employeeSelectedGroups, group.id]);
                            } else {
                              setEmployeeSelectedGroups(employeeSelectedGroups.filter(id => id !== group.id));
                            }
                          }}
                        />
                        <span>{group.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => {
                setShowEmployeeModal(false);
                setEditingEmployee(null);
              }}
              className="btn-filled-3"
            >
              Hủy
            </button>
            <button type="submit" className="btn-primary">
              Lưu hồ sơ
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

{/* Permission Group Modal */ }
{
  showGroupModal && (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700 }}>
          {editingGroup ? 'Chỉnh sửa nhóm quyền' : 'Thêm nhóm quyền mới'}
        </h3>
        <form onSubmit={handleSavePermissionGroup} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Tên nhóm quyền</label>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="input-spec"
              required
              placeholder="Ví dụ: Nhóm Nhân Sự, Nhóm Trưởng Dự Án..."
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Chọn quyền truy cập (Các Tab hiển thị):</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px' }}>
              {FEATURE_TABS.map(tab => {
                const isChecked = newGroupTabs.includes(tab.id);
                return (
                  <label key={tab.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewGroupTabs([...newGroupTabs, tab.id]);
                        } else {
                          setNewGroupTabs(newGroupTabs.filter(id => id !== tab.id));
                        }
                      }}
                    />
                    <span>{tab.labelVi} ({tab.labelEn})</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => {
                setShowGroupModal(false);
                setEditingGroup(null);
                setNewGroupName('');
                setNewGroupTabs([]);
              }}
              className="btn-filled-3"
            >
              Hủy
            </button>
            <button type="submit" className="btn-primary">
              Lưu nhóm
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

{/* Project Modal (Add / Edit) */ }
{
  showProjectModal && (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700 }}>
          {editingProject ? 'Chỉnh sửa dự án' : 'Tạo mới dự án'}
        </h3>
        <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Tên dự án</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="input-spec"
              required
              placeholder="Ví dụ: Triển khai ERP"
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Mô tả dự án</label>
            <textarea
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="input-spec"
              rows={3}
              placeholder="Mô tả mục tiêu, phạm vi dự án..."
              style={{ fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Ngày bắt đầu</label>
              <input
                type="date"
                value={projectStartDate ? projectStartDate.substring(0, 10) : ''}
                onChange={(e) => setProjectStartDate(e.target.value)}
                className="input-spec"
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Ngày kết thúc</label>
              <input
                type="date"
                value={projectEndDate ? projectEndDate.substring(0, 10) : ''}
                onChange={(e) => setProjectEndDate(e.target.value)}
                className="input-spec"
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Trạng thái</label>
            <input
              type="text"
              value={projectStatus === 'Completed' ? 'Đã hoàn thành (Tự động tính theo Giai đoạn)' : projectStatus === 'In Progress' ? 'Đang thực hiện (Tự động tính theo Giai đoạn)' : 'Chưa bắt đầu (Tự động tính theo Giai đoạn)'}
              disabled
              className="input-spec"
              style={{ height: '38px', padding: '6px 12px', backgroundColor: '#f3f2f1', color: '#605e5c', cursor: 'not-allowed' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => {
                setShowProjectModal(false);
                setEditingProject(null);
                setProjectName('');
                setProjectDesc('');
                setProjectStartDate('');
                setProjectEndDate('');
                setProjectStatus('Not Started');
              }}
              className="btn-filled-3"
            >
              Hủy
            </button>
            <button type="submit" className="btn-filled-2" style={{ backgroundColor: '#742774' }}>
              {editingProject ? 'Cập nhật' : 'Lưu lại'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

{/* Phase Modal */ }
{
  showPhaseModal && (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700 }}>
          {editingPhase ? 'Chỉnh sửa giai đoạn dự án' : 'Thêm giai đoạn dự án'}
        </h3>
        <form onSubmit={handleSavePhase} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Tên giai đoạn</label>
            <input
              type="text"
              value={newPhaseName}
              onChange={(e) => setNewPhaseName(e.target.value)}
              className="input-spec"
              required
              placeholder="Ví dụ: Phân tích yêu cầu"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Ngày bắt đầu</label>
              <input
                type="date"
                value={newPhaseStartDate ? newPhaseStartDate.substring(0, 10) : ''}
                onChange={(e) => setNewPhaseStartDate(e.target.value)}
                className="input-spec"
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Ngày kết thúc</label>
              <input
                type="date"
                value={newPhaseEndDate ? newPhaseEndDate.substring(0, 10) : ''}
                onChange={(e) => setNewPhaseEndDate(e.target.value)}
                className="input-spec"
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Trạng thái</label>
            <select
              value={newPhaseStatus}
              onChange={(e) => setNewPhaseStatus(e.target.value)}
              className="input-spec"
              style={{ height: '38px', padding: '6px 12px' }}
            >
              <option value="Not Started">Chưa bắt đầu</option>
              <option value="In Progress">Đang thực hiện</option>
              <option value="Completed">Đã hoàn thành</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => {
                setShowPhaseModal(false);
                setEditingPhase(null);
                setNewPhaseName('');
                setNewPhaseStatus('Not Started');
                setNewPhaseStartDate('');
                setNewPhaseEndDate('');
              }}
              className="btn-filled-3"
            >
              Hủy
            </button>
            <button type="submit" className="btn-filled-2" style={{ backgroundColor: '#742774' }}>
              {editingPhase ? 'Cập nhật' : 'Lưu giai đoạn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

{/* Risk Modal */ }
{
  showRiskModal && (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700 }}>
          {editingRisk ? 'Chỉnh sửa rủi ro dự án' : 'Ghi nhận rủi ro dự án'}
        </h3>
        <form onSubmit={handleSaveRisk} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Tên/Mô tả rủi ro</label>
            <input
              type="text"
              value={newRiskName}
              onChange={(e) => setNewRiskName(e.target.value)}
              className="input-spec"
              required
              placeholder="Ví dụ: Thiếu hụt nhân lực chủ chốt"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Mức độ ảnh hưởng (Impact)</label>
              <select
                value={newRiskImpact}
                onChange={(e) => setNewRiskImpact(e.target.value)}
                className="input-spec"
                style={{ height: '38px', padding: '6px 12px' }}
              >
                <option value="High">Cao (High)</option>
                <option value="Medium">Trung bình (Medium)</option>
                <option value="Low">Thấp (Low)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Khả năng xảy ra (Probability)</label>
              <select
                value={newRiskProbability}
                onChange={(e) => setNewRiskProbability(e.target.value)}
                className="input-spec"
                style={{ height: '38px', padding: '6px 12px' }}
              >
                <option value="High">Cao (High)</option>
                <option value="Medium">Trung bình (Medium)</option>
                <option value="Low">Thấp (Low)</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Kế hoạch giảm thiểu (Mitigation Plan)</label>
            <textarea
              value={newRiskMitigation}
              onChange={(e) => setNewRiskMitigation(e.target.value)}
              className="input-spec"
              rows={3}
              placeholder="Phương án dự phòng, phân công người phụ trách..."
              style={{ fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => {
                setShowRiskModal(false);
                setEditingRisk(null);
                setNewRiskName('');
                setNewRiskImpact('Medium');
                setNewRiskProbability('Medium');
                setNewRiskMitigation('');
              }}
              className="btn-filled-3"
            >
              Hủy
            </button>
            <button type="submit" className="btn-filled-2" style={{ backgroundColor: '#742774' }}>
              {editingRisk ? 'Cập nhật' : 'Lưu rủi ro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

{/* KPI Modal */}
  <KpiModal
    isOpen={showKpiModal}
    editingKpi={editingKpi}
    onClose={() => {
      setShowKpiModal(false);
      setEditingKpi(null);
    }}
    onSave={handleSaveKpi}
  />
  
  {/* Resource Allocation Modal */ }
{
  showAllocationModal && (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '420px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>
          {editingAllocation ? 'Cập nhật phân bổ nhân sự' : 'Phân bổ nhân sự vào dự án'}
        </h3>
        <form onSubmit={handleSaveAllocation} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '13px' }}>Nhân sự <span style={{ color: '#dc2626' }}>*</span></label>
              <button
                type="button"
                onClick={() => {
                  if (!showAiSuggestions) {
                    generateAiSuggestions(aiFilterSameDept);
                  } else {
                    setShowAiSuggestions(false);
                  }
                }}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                🪄 Đề xuất AI
              </button>
            </div>

            {showAiSuggestions ? (
              <div style={{ marginBottom: '12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', padding: '12px', backgroundColor: '#F9FAFB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>TOP GỢI Ý (60% Skill + 40% Avail)</span>
                  <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={aiFilterSameDept}
                      onChange={e => {
                        setAiFilterSameDept(e.target.checked);
                        generateAiSuggestions(e.target.checked);
                      }}
                    />
                    Cùng phòng ban
                  </label>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {aiSuggestions.map(sug => (
                    <div
                      key={sug.user.cr5db_userid}
                      onClick={() => {
                        setAllocationUser(sug.user.cr5db_userid);
                        setShowAiSuggestions(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px',
                        backgroundColor: '#fff',
                        border: '1px solid var(--color-border)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                      onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                    >
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontWeight: 700, fontSize: '12px' }}>
                        {sug.user.cr5db_fullname?.charAt(0) || 'U'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{sug.user.cr5db_fullname}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{sug.user.cr5db_email}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>{sug.fitScore}%</div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Fit Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <select
              value={allocationUser}
              onChange={e => setAllocationUser(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#ffffff' }}
            >
              <option value="">-- Chọn nhân sự --</option>
              {usersList.map(u => (
                <option key={u.cr5db_userid} value={u.cr5db_userid}>{u.cr5db_fullname} ({u.cr5db_email})</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Dự án <span style={{ color: '#dc2626' }}>*</span></label>
            <select
              value={allocationProject}
              onChange={e => setAllocationProject(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#ffffff' }}
            >
              <option value="">-- Chọn dự án --</option>
              {projects.map(p => (
                <option key={p.cr5db_projectid} value={p.cr5db_projectid}>{p.cr5db_projectname}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Tên phân bổ</label>
            <input
              value={allocationName}
              onChange={e => setAllocationName(e.target.value)}
              placeholder="Ví dụ: Phân bổ nhân viên A làm PM dự án B"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Tỷ lệ phân bổ (%) <span style={{ color: '#dc2626' }}>*</span></label>
            <input
              type="number"
              min="1"
              max="100"
              value={allocationPercentage}
              onChange={e => setAllocationPercentage(Number(e.target.value))}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" onClick={() => { setShowAllocationModal(false); setEditingAllocation(null); }} className="btn-filled-3">Hủy</button>
            <button type="submit" className="btn-primary">
              {editingAllocation ? 'Cập nhật' : 'Giao việc'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

{/* System Notifications Modal */ }
{
  showNotificationsModal && (
    <div className="modal-overlay" onClick={() => setShowNotificationsModal(false)}>
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
          <button onClick={() => setShowNotificationsModal(false)} className="btn-filled-3">Đóng</button>
        </div>
      </div>
    </div>
  )
}

{/* 8. Universal Change Request Reason & Approver Selection Modal */ }
{
  showApprovalModal && approvalModalData && (
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
          <div style={{ marginBottom: '6px' }}><strong>Thao tác:</strong> {approvalModalData.operation} ({ENTITY_MAPPINGS[approvalModalData.entityName]?.label || approvalModalData.entityName})</div>
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
              {approvalModalData.validApprovers.map((user: User) => (
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
              onClick={() => {
                setShowApprovalModal(false);
                setIsLoading(false);
              }}
              className="btn-filled-3"
              style={{ padding: '8px 16px' }}
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSubmittingApprovalRequest}
              className="btn-primary"
              style={{ padding: '8px 16px', borderRadius: '4px' }}
            >
              Gửi yêu cầu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


{/* Period Modal */ }
{
  showPeriodModal && (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '400px', padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
          {editingPeriod ? 'Cập nhật chu kỳ đánh giá' : 'Tạo mới chu kỳ đánh giá'}
        </h3>
        <form onSubmit={handleSavePeriod} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Tên chu kỳ <span style={{ color: '#dc2626' }}>*</span></label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Đánh giá hiệu suất Q3/2026"
              value={newPeriodName}
              onChange={e => setNewPeriodName(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Ngày bắt đầu</label>
            <input
              type="date"
              value={newPeriodStartDate}
              onChange={e => setNewPeriodStartDate(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Ngày kết thúc</label>
            <input
              type="date"
              value={newPeriodEndDate}
              onChange={e => setNewPeriodEndDate(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => setShowPeriodModal(false)}
              className="btn-filled-3"
              style={{ padding: '8px 16px' }}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '8px 16px' }}
            >
              Lưu lại
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


{/* Assign Appraisal Modal */ }
{
  showAssignAppraisalModal && (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '450px', padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
          Phát động đợt đánh giá mới
        </h3>
        <form onSubmit={handleAssignAppraisal} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Nhân sự cần đánh giá <span style={{ color: '#dc2626' }}>*</span></label>
            <select
              value={newAppraisalEmployeeId}
              onChange={e => setNewAppraisalEmployeeId(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', backgroundColor: '#ffffff', boxSizing: 'border-box' }}
            >
              {usersList.map(u => (
                <option key={u.cr5db_userid} value={u.cr5db_userid}>{u.cr5db_fullname} ({u.cr5db_email || 'No email'})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Người đánh giá (HR/Manager) <span style={{ color: '#dc2626' }}>*</span></label>
            <select
              value={newAppraisalEvaluatorId}
              onChange={e => setNewAppraisalEvaluatorId(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', backgroundColor: '#ffffff', boxSizing: 'border-box' }}
            >
              {usersList.map(u => (
                <option key={u.cr5db_userid} value={u.cr5db_userid}>{u.cr5db_fullname} ({u.cr5db_email || 'No email'})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Chu kỳ đánh giá <span style={{ color: '#dc2626' }}>*</span></label>
            <select
              value={newAppraisalPeriodId}
              onChange={e => setNewAppraisalPeriodId(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', backgroundColor: '#ffffff', boxSizing: 'border-box' }}
            >
              {evaluationPeriodsList.map(p => (
                <option key={p.cr5db_evaluationperiodid} value={p.cr5db_evaluationperiodid}>{p.cr5db_evaluationperiod1}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Tên đợt đánh giá hiển thị (Tự chọn)</label>
            <input
              type="text"
              placeholder="Để trống để hệ thống tự động sinh tên"
              value={newAppraisalName}
              onChange={e => setNewAppraisalName(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => setShowAssignAppraisalModal(false)}
              className="btn-filled-3"
              style={{ padding: '8px 16px' }}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '8px 16px' }}
            >
              Phát động
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

{/* Leave Request Modal */}
  <LeaveRequestModal
    isOpen={showLeaveModal}
    onClose={() => setShowLeaveModal(false)}
    onSave={handleLeaveRequestSubmit}
  />
  
  {/* Leave Balance Modal */ }
{
  showLeaveBalanceModal && (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700 }}>Cập nhật Quỹ phép</h3>
        <form onSubmit={handleSaveLeaveBalance} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Phép chuẩn</label>
            <input
              type="number"
              required
              value={newBalanceEntitlement}
              onChange={e => setNewBalanceEntitlement(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Tồn năm trước</label>
            <input
              type="number"
              required
              value={newBalanceCarriedOver}
              onChange={e => setNewBalanceCarriedOver(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Đã dùng</label>
            <input
              type="number"
              required
              value={newBalanceUsedDays}
              onChange={e => setNewBalanceUsedDays(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => { setShowLeaveBalanceModal(false); setEditingLeaveBalance(null); }} className="btn-filled-3">Hủy</button>
            <button type="submit" className="btn-primary" disabled={isLoading}>Lưu</button>
          </div>
        </form>
      </div>
    </div>
  )
}

{/* Holiday Modal */ }
{
  showHolidayModal && (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700 }}>{editingHoliday ? 'Sửa Ngày Lễ' : 'Thêm Ngày Lễ'}</h3>
        <form onSubmit={handleHolidaySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Tên Ngày Lễ</label>
            <input
              type="text"
              required
              value={newHolidayName}
              onChange={e => setNewHolidayName(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Ngày</label>
            <input
              type="date"
              required
              value={newHolidayDate}
              onChange={e => setNewHolidayDate(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => { setShowHolidayModal(false); setEditingHoliday(null); }} className="btn-filled-3">Hủy</button>
            <button type="submit" className="btn-primary" disabled={isLoading}>Lưu</button>
          </div>
        </form>
      </div>
    </div>
  )
}

{/* Overtime Request Modal */ }
{
  showOvertimeModal && (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700 }}>Xin Làm thêm giờ (OT)</h3>
        <form onSubmit={handleOvertimeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Loại OT</label>
            <select
              value={newOtType}
              onChange={e => setNewOtType(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
            >
              <option value="Weekday">Ngày thường (Weekday)</option>
              <option value="Weekend">Cuối tuần (Weekend)</option>
              <option value="Holiday">Ngày lễ (Holiday)</option>
              <option value="Night">Ca đêm (Night)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Ngày OT</label>
            <input
              type="date"
              required
              value={newOtDate}
              onChange={e => setNewOtDate(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Giờ bắt đầu</label>
              <input
                type="time"
                required
                value={newOtStartTime}
                onChange={e => setNewOtStartTime(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Giờ kết thúc</label>
              <input
                type="time"
                required
                value={newOtEndTime}
                onChange={e => setNewOtEndTime(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Số giờ</label>
            <input
              type="number"
              step="0.5"
              required
              value={newOtHours}
              onChange={e => setNewOtHours(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Lý do</label>
            <textarea
              required
              value={newOtReason}
              onChange={e => setNewOtReason(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', minHeight: '60px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => setShowOvertimeModal(false)} className="btn-filled-3">Hủy</button>
            <button type="submit" className="btn-primary" disabled={isLoading}>Gửi đơn</button>
          </div>
        </form>
      </div>
    </div>
  )
}

{/* OT Approval Modal */ }
{
  showOtApprovalModal && (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700 }}>Duyệt Làm thêm giờ (OT)</h3>
        <form onSubmit={handleApproveOtSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Số giờ duyệt</label>
            <input
              type="number"
              step="0.5"
              required
              value={otApprovedHours}
              onChange={e => setOtApprovedHours(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => {
                handleRejectOt(otToApproveId);
                setShowOtApprovalModal(false);
              }}
              className="btn-filled-3"
              style={{ color: '#A80000', backgroundColor: '#FDE7E9' }}
            >
              Từ chối
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>Duyệt</button>
          </div>
        </form>
      </div>
    </div>
  )
}

{/* Dashboard Settings Modal */ }
{
  showDashboardSettingsModal && (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content" style={{ width: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Cấu hình Dashboard Widgets</h3>
          <button
            onClick={() => setShowDashboardSettingsModal(false)}
            style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
          Lựa chọn các widget hiển thị trên Dashboard chính của bạn:
        </p>
