  try {
    setIsLoading(true);
    const payload: any = {
      cr5db_positionname: data.name,
      cr5db_headcountquota: Number(data.quota)
    };
    if (editingJobPosition) {
      if (data.deptId) {
        payload["cr5db_Department@odata.bind"] = `/cr5db_departments(${data.deptId})`;
      } else {
        payload.cr5db_Department = null;
      }

      if (data.catalogId) {
        payload["cr5db_PositionCatalogTitle@odata.bind"] = `/cr5db_positioncatalogs(${data.catalogId})`;
      } else {
        payload.cr5db_PositionCatalogTitle = null;
      }

      if (data.reportsToId) {
        payload["cr5db_ReportsToPositionID@odata.bind"] = `/cr5db_jobpositions(${data.reportsToId})`;
      } else {
        payload.cr5db_ReportsToPositionID = null;
      }

      await executeCrudWithApproval(
        "JobPositions",
        "Update",
        payload,
        editingJobPosition.cr5db_jobpositionid,
        `Cập nhật vị trí công việc: ${newJobPosName}`,
        editingJobPosition
      );

      if (activeRole === 'Admin') {
        const posId = editingJobPosition.cr5db_jobpositionid;
        const existingComps = jobCompetenciesList.filter(jc => jc._cr5db_jobposition_value === posId);
        
        const toDelete = existingComps.filter(jc => !newJobPosCompetencyIds.includes(jc._new_competencyid_value));
        const toAdd = newJobPosCompetencyIds.filter(id => !existingComps.some(jc => jc._new_competencyid_value === id));
        
        for (const jc of toDelete) {
          await New_jobcompetencyService.delete(jc.new_jobcompetencyid);
        }
        for (const compId of toAdd) {
          await New_jobcompetencyService.create({
            new_requiredlevel: 3,
            "cr5db_JobPosition@odata.bind": `/cr5db_jobpositions(${posId})`,
            "new_CompetencyID@odata.bind": `/new_competencycatalogs(${compId})`
          } as any);
        }
      }
    } else {
      // For creation, only include lookup fields if they are selected (avoid null properties)
      if (newJobPosDeptId) {
        payload["cr5db_Department@odata.bind"] = `/cr5db_departments(${newJobPosDeptId})`;
      }
      if (newJobPosCatalogId) {
        payload["cr5db_PositionCatalogTitle@odata.bind"] = `/cr5db_positioncatalogs(${newJobPosCatalogId})`;
      }
      if (selectedReportsToPositionId) {
        payload["cr5db_ReportsToPositionID@odata.bind"] = `/cr5db_jobpositions(${selectedReportsToPositionId})`;
      }

      const res = await executeCrudWithApproval(
        "JobPositions",
        "Create",
        payload,
        undefined,
        `Tạo vị trí công việc mới: ${newJobPosName}`
      );

      if (res && res.data && res.data.cr5db_jobpositionid) {
        // Nếu tạo thành công (Admin), tạo luôn các năng lực đã chọn
        for (const compId of newJobPosCompetencyIds) {
          await New_jobcompetencyService.create({
            new_requiredlevel: 3,
            "cr5db_JobPosition@odata.bind": `/cr5db_jobpositions(${res.data.cr5db_jobpositionid})`,
            "new_CompetencyID@odata.bind": `/new_competencycatalogs(${compId})`
          } as any);
        }
      }
    }
    setShowJobPositionModal(false);
    setEditingJobPosition(null);
    setNewJobPosName('');
    setNewJobPosQuota(1);
    setNewJobPosDeptId('');
    setNewJobPosCatalogId('');
    setNewJobPosCompetencyIds([]);
  } catch (err: any) {
    console.error(err);
    alert(`Lỗi khi lưu job position: ${err.message || err}`);
    setIsLoading(false);
  }
};
