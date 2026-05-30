import {
  Cr5db_companiesService,
  Cr5db_departmentsService,
  Cr5db_positioncatalogsService,
  Cr5db_jobpositionsService,
  Cr5db_usersService,
  Cr5db_evaluationperiodsService,
  Cr5db_objectivesService,
  Cr5db_projectsService,
  Cr5db_projectphasesService,
  Cr5db_projectteamsService,
  Cr5db_resourceallocationsService,
  Cr5db_userprojectrolesService,
  Cr5db_systemlabelsService,
  Cr5db_projectlabelassignmentsService,
  Cr5db_projectobjectivealignmentsService,
  Cr5db_projectrisksService,
  Cr5db_kpilibrariesService,
  Cr5db_kpitargetsService,
  Cr5db_kpiactuallogsService,
  Cr5db_tasksService,
  Cr5db_taskcommentsService,
  Cr5db_timesheetlogsService,
  Cr5db_performanceappraisalsService,
  Cr5db_appraisalkpidetailsService,
  Cr5db_headcountrequestsService,
  Cr5db_systemnotificationsService,
  Cr5db_systemparametersService,
  Cr5db_systempolicyrulesService,
  Cr5db_approvalroutesesService,
  Cr5db_taskdependenciesService,
  Cr5db_tasklabelassignmentsService,
  Cr5db_projectissuesService,
  Cr5db_approvaldelegationsService,
  Cr5db_audittraillogsService,
  Cr5db_changerequestsesService
} from '../generated';

export async function runWebSeeding(progressCallback: (status: string) => void): Promise<void> {
  const guids: Record<string, any> = {};

  const tryCall = async (actionName: string, fn: () => Promise<any>) => {
    try {
      progressCallback(actionName);
      return await fn();
    } catch (error: any) {
      console.warn(`[Seeding Warning] Failed during "${actionName}":`, error);
      // Log error and continue to allow partial seeding if some tables are missing
      return null;
    }
  };

  // 1. Companies
  await tryCall("Tạo thông tin Công ty...", async () => {
    guids["companies"] = [];
    const companies = [
      { cr5db_companycode: "VNX", cr5db_companyname: "VibePower Vietnam" },
      { cr5db_companycode: "GLB", cr5db_companyname: "VibePower Global" }
    ];
    for (const c of companies) {
      const res = await Cr5db_companiesService.create(c as any);
      if (res?.data?.cr5db_companyid) {
        guids["companies"].push(res.data.cr5db_companyid);
      }
    }
  });

  if (!guids["companies"] || guids["companies"].length === 0) {
    throw new Error("Không thể tạo dữ liệu Công ty cơ sở. Dừng tiến trình seeding.");
  }

  // 2. System Labels
  await tryCall("Tạo thẻ nhãn hệ thống (System Labels)...", async () => {
    guids["labels"] = [];
    const labels = [
      { cr5db_systemlabel1: "Urgent", cr5db_hexcolor: "#e81123", cr5db_labelgroup: "Priority" },
      { cr5db_systemlabel1: "Medium", cr5db_hexcolor: "#ff8c00", cr5db_labelgroup: "Priority" },
      { cr5db_systemlabel1: "Low", cr5db_hexcolor: "#0078d4", cr5db_labelgroup: "Priority" },
      { cr5db_systemlabel1: "Bug", cr5db_hexcolor: "#a80000", cr5db_labelgroup: "Category" },
      { cr5db_systemlabel1: "Feature", cr5db_hexcolor: "#107c41", cr5db_labelgroup: "Category" }
    ];
    for (const l of labels) {
      const res = await Cr5db_systemlabelsService.create(l as any);
      if (res?.data?.cr5db_systemlabelid) {
        guids["labels"].push({ name: l.cr5db_systemlabel1, id: res.data.cr5db_systemlabelid });
      }
    }
  });

  // 3. Departments
  await tryCall("Tạo Phòng ban...", async () => {
    guids["departments"] = {};
    const depts = [
      {
        cr5db_departmentcode: "RND",
        cr5db_departmentname: "Research & Development",
        "cr5db_CompanyID@odata.bind": `/cr5db_companies(${guids["companies"][0]})`
      },
      {
        cr5db_departmentcode: "HRM",
        cr5db_departmentname: "Human Resources",
        "cr5db_CompanyID@odata.bind": `/cr5db_companies(${guids["companies"][0]})`
      },
      {
        cr5db_departmentcode: "MKT",
        cr5db_departmentname: "Marketing",
        "cr5db_CompanyID@odata.bind": `/cr5db_companies(${guids["companies"][1]})`
      }
    ];
    for (const d of depts) {
      const res = await Cr5db_departmentsService.create(d as any);
      if (res?.data?.cr5db_departmentid) {
        guids["departments"][d.cr5db_departmentcode] = res.data.cr5db_departmentid;
      }
    }
  });

  // 4. Position Catalog
  await tryCall("Tạo danh mục chức danh (Position Catalog)...", async () => {
    guids["catalog"] = {};
    const catalog = [
      { cr5db_code: "DIR", cr5db_positioncatalog1: "Director" },
      { cr5db_code: "MGR", cr5db_positioncatalog1: "Project Manager" },
      { cr5db_code: "ENG", cr5db_positioncatalog1: "Software Engineer" },
      { cr5db_code: "HR", cr5db_positioncatalog1: "HR Specialist" }
    ];
    for (const cat of catalog) {
      const res = await Cr5db_positioncatalogsService.create(cat as any);
      if (res?.data?.cr5db_positioncatalogid) {
        guids["catalog"][cat.cr5db_code] = res.data.cr5db_positioncatalogid;
      }
    }
  });

  // 5. Job Position
  await tryCall("Tạo vị trí định biên (Job Positions)...", async () => {
    guids["jobpositions"] = [];
    const positions = [
      {
        cr5db_positionname: "Director of R&D",
        cr5db_headcountquota: 1,
        "cr5db_Department@odata.bind": `/cr5db_departments(${guids["departments"]["RND"]})`,
        "cr5db_PositionCatalogTitle@odata.bind": `/cr5db_positioncatalogs(${guids["catalog"]["DIR"]})`
      },
      {
        cr5db_positionname: "R&D Project Manager",
        cr5db_headcountquota: 2,
        "cr5db_Department@odata.bind": `/cr5db_departments(${guids["departments"]["RND"]})`,
        "cr5db_PositionCatalogTitle@odata.bind": `/cr5db_positioncatalogs(${guids["catalog"]["MGR"]})`
      },
      {
        cr5db_positionname: "Senior Software Engineer",
        cr5db_headcountquota: 5,
        "cr5db_Department@odata.bind": `/cr5db_departments(${guids["departments"]["RND"]})`,
        "cr5db_PositionCatalogTitle@odata.bind": `/cr5db_positioncatalogs(${guids["catalog"]["ENG"]})`
      },
      {
        cr5db_positionname: "HR Recruitment Specialist",
        cr5db_headcountquota: 2,
        "cr5db_Department@odata.bind": `/cr5db_departments(${guids["departments"]["HRM"]})`,
        "cr5db_PositionCatalogTitle@odata.bind": `/cr5db_positioncatalogs(${guids["catalog"]["HR"]})`
      }
    ];
    for (const pos of positions) {
      const res = await Cr5db_jobpositionsService.create(pos as any);
      if (res?.data?.cr5db_jobpositionid) {
        guids["jobpositions"].push(res.data.cr5db_jobpositionid);
      }
    }

    // Link reports to relationship
    if (guids["jobpositions"].length >= 2) {
      const dirId = guids["jobpositions"][0];
      const pmId = guids["jobpositions"][1];
      await Cr5db_jobpositionsService.update(pmId, {
        "cr5db_ReportsToPositionID@odata.bind": `/cr5db_jobpositions(${dirId})`
      } as any);
    }
  });

  // 6. Users
  await tryCall("Tạo người dùng (Employees)...", async () => {
    guids["users"] = {};
    const users = [
      {
        cr5db_fullname: "Violetta Admin",
        cr5db_email: "admin@company.com",
        cr5db_isactive: true,
        cr5db_systemrole: "Admin",
        "cr5db_JobPosition@odata.bind": `/cr5db_jobpositions(${guids["jobpositions"][0]})`
      },
      {
        cr5db_fullname: "Alice PM",
        cr5db_email: "pm@company.com",
        cr5db_isactive: true,
        cr5db_systemrole: "ProjectManager",
        "cr5db_JobPosition@odata.bind": `/cr5db_jobpositions(${guids["jobpositions"][1]})`
      },
      {
        cr5db_fullname: "Bob Developer",
        cr5db_email: "dev1@company.com",
        cr5db_isactive: true,
        cr5db_systemrole: "Employee",
        "cr5db_JobPosition@odata.bind": `/cr5db_jobpositions(${guids["jobpositions"][2]})`
      },
      {
        cr5db_fullname: "Charlie Developer",
        cr5db_email: "dev2@company.com",
        cr5db_isactive: true,
        cr5db_systemrole: "Employee",
        "cr5db_JobPosition@odata.bind": `/cr5db_jobpositions(${guids["jobpositions"][2]})`
      }
    ];
    for (const u of users) {
      const res = await Cr5db_usersService.create(u as any);
      if (res?.data?.cr5db_userid) {
        guids["users"][u.cr5db_email] = res.data.cr5db_userid;
      }
    }
  });

  // 7. Evaluation Period
  await tryCall("Tạo chu kỳ đánh giá (Evaluation Periods)...", async () => {
    guids["periods"] = [];
    const period = {
      cr5db_evaluationperiod1: "Q2/2026",
      cr5db_startdate: "2026-04-01T00:00:00Z",
      cr5db_enddate: "2026-06-30T00:00:00Z",
      cr5db_islocked: false
    };
    const res = await Cr5db_evaluationperiodsService.create(period as any);
    if (res?.data?.cr5db_evaluationperiodid) {
      guids["periods"].push(res.data.cr5db_evaluationperiodid);
    }
  });

  // 8. Objectives
  await tryCall("Tạo mục tiêu chiến lược (Objectives)...", async () => {
    guids["objectives"] = [];
    const obj = {
      cr5db_objective1: "Đạt chất lượng phần mềm QLDA Q2/2026",
      cr5db_targetvalue: 100,
      cr5db_objectiveprogress: 0,
      "cr5db_PeriodName@odata.bind": `/cr5db_evaluationperiods(${guids["periods"][0]})`
    };
    const res = await Cr5db_objectivesService.create(obj as any);
    if (res?.data?.cr5db_objectiveid) {
      guids["objectives"].push(res.data.cr5db_objectiveid);
    }
  });

  // 9. Projects & Subcomponents
  await tryCall("Tạo dự án và các giai đoạn liên quan (Projects & Teams)...", async () => {
    const proj = {
      cr5db_projectname: "Traffic Analysis Engine",
      cr5db_description: "Phần mềm phân tích mật độ giao thông thông minh",
      cr5db_startdate: "2026-04-05T00:00:00Z",
      cr5db_enddate: "2026-06-25T00:00:00Z"
    };
    const res = await Cr5db_projectsService.create(proj as any);
    if (res?.data?.cr5db_projectid) {
      const projId = res.data.cr5db_projectid;

      // Labels Assignment
      if (guids["labels"] && guids["labels"].length > 0) {
        await Cr5db_projectlabelassignmentsService.create({
          cr5db_projectlabelassignment1: "Traffic Project - Urgent",
          "cr5db_ProjectID@odata.bind": `/cr5db_projects(${projId})`,
          "cr5db_LabelName@odata.bind": `/cr5db_systemlabels(${guids["labels"][0].id})`
        } as any);
      }

      // Objective Alignment
      if (guids["objectives"] && guids["objectives"].length > 0) {
        await Cr5db_projectobjectivealignmentsService.create({
          cr5db_projectobjectivealignment1: "Traffic Objective Alignment",
          "cr5db_Project@odata.bind": `/cr5db_projects(${projId})`,
          "cr5db_Objective@odata.bind": `/cr5db_objectives(${guids["objectives"][0]})`
        } as any);
      }

      // Project Risks
      await Cr5db_projectrisksService.create({
        cr5db_projectrisk1: "Database scaling bottlenecks",
        cr5db_impact: "High",
        cr5db_probability: "Medium",
        cr5db_mitigationplan: "Implement horizontal partitioning on PostgreSQL",
        "cr5db_ProjectID@odata.bind": `/cr5db_projects(${projId})`
      } as any);

      // Project Phase
      const phaseRes = await Cr5db_projectphasesService.create({
        cr5db_phasename: "Phase 1: Database Setup & Integration",
        cr5db_startdate: "2026-04-06T00:00:00Z",
        cr5db_enddate: "2026-04-30T00:00:00Z",
        "cr5db_ProjectID@odata.bind": `/cr5db_projects(${projId})`
      } as any);
      if (phaseRes?.data?.cr5db_projectphaseid) {
        guids["phase_id"] = phaseRes.data.cr5db_projectphaseid;
      }

      // Project Team
      const teamRes = await Cr5db_projectteamsService.create({
        cr5db_teamname: "Traffic Engine Dev Team",
        "cr5db_ProjectID@odata.bind": `/cr5db_projects(${projId})`
      } as any);
      if (teamRes?.data?.cr5db_projectteamid) {
        const teamId = teamRes.data.cr5db_projectteamid;

        // Allocations
        for (const email of ["dev1@company.com", "dev2@company.com"]) {
          const uId = guids["users"][email];
          if (uId) {
            const allocRes = await Cr5db_resourceallocationsService.create({
              cr5db_resourceallocation1: `Allocation for ${email.split('@')[0]}`,
              cr5db_allocationpercentage: 100,
              "cr5db_UserID@odata.bind": `/cr5db_users(${uId})`,
              "cr5db_ProjectTeamID@odata.bind": `/cr5db_projectteams(${teamId})`
            } as any);

            if (allocRes?.data?.cr5db_resourceallocationid) {
              const allocId = allocRes.data.cr5db_resourceallocationid;
              const isLead = email === "dev1@company.com";
              await Cr5db_userprojectrolesService.create({
                cr5db_rolename: isLead ? "Lead Developer" : "QA Tester",
                cr5db_rolecode: isLead ? "LD" : "QA",
                "cr5db_AllocationID@odata.bind": `/cr5db_resourceallocations(${allocId})`
              } as any);
            }
          }
        }
      }
    }
  });

  // 10. KPI Library
  await tryCall("Tạo danh mục mẫu chỉ số KPI...", async () => {
    guids["kpilibrary"] = [];
    const library = [
      { cr5db_kpiname: "Tỷ lệ hoàn thành Task đúng hạn", cr5db_unit: "%", cr5db_formula: "(Số Task hoàn thành đúng hạn / Tổng số Task) * 100" },
      { cr5db_kpiname: "Tỷ lệ thời gian Timesheet chuẩn", cr5db_unit: "%", cr5db_formula: "(Số giờ Timesheet hợp lệ / Tổng số giờ quy định) * 100" }
    ];
    for (const lib of library) {
      const res = await Cr5db_kpilibrariesService.create(lib as any);
      if (res?.data?.cr5db_kpilibraryid) {
        guids["kpilibrary"].push(res.data.cr5db_kpilibraryid);
      }
    }
  });

  // 11. KPI Targets & Actuals
  await tryCall("Gán chỉ tiêu và ghi nhận thực tế KPI...", async () => {
    const bobId = guids["users"]["dev1@company.com"];
    const targetRes = await Cr5db_kpitargetsService.create({
      cr5db_kpitarget1: "Hoàn thành Schema Q2",
      cr5db_targetvalue: 95,
      cr5db_actualvalue: 0,
      cr5db_weightpercentage: 50,
      "cr5db_EmployeeID@odata.bind": `/cr5db_users(${bobId})`,
      "cr5db_KPICode@odata.bind": `/cr5db_kpilibraries(${guids["kpilibrary"][0]})`,
      "cr5db_ParentObjective@odata.bind": `/cr5db_objectives(${guids["objectives"][0]})`
    } as any);

    if (targetRes?.data?.cr5db_kpitargetid) {
      const targetId = targetRes.data.cr5db_kpitargetid;
      guids["kpitarget"] = targetId;

      await Cr5db_kpiactuallogsService.create({
        cr5db_kpiactuallog1: "Completed Phase 1 database definition schema review",
        cr5db_actualvalue: 90,
        cr5db_evidencelink: "https://github.com/violet/traffic-analysis-engine/pull/1",
        "cr5db_TargetId@odata.bind": `/cr5db_kpitargets(${targetId})`
      } as any);
    }
  });

  // 12. Tasks, Comments & Timesheets
  await tryCall("Tạo công việc (Tasks), timesheets và bình luận...", async () => {
    const bobId = guids["users"]["dev1@company.com"];
    const taskRes = await Cr5db_tasksService.create({
      cr5db_taskname: "Thiết lập Schema Dataverse cho bảng ProjectRisk",
      cr5db_description: "Định nghĩa các cột, kiểu dữ liệu, các quan hệ khóa ngoại liên kết cho bảng Project Risk.",
      cr5db_duedate: "2026-05-30T17:00:00Z",
      cr5db_status: "Completed",
      "cr5db_AssigneeID@odata.bind": `/cr5db_users(${bobId})`,
      "cr5db_ObjectiveName@odata.bind": `/cr5db_objectives(${guids["objectives"][0]})`,
      "cr5db_ProjectPhaseID@odata.bind": `/cr5db_projectphases(${guids["phase_id"]})`
    } as any);

    if (taskRes?.data?.cr5db_taskid) {
      const taskId = taskRes.data.cr5db_taskid;

      await Cr5db_taskcommentsService.create({
        cr5db_taskcomment1: "Task Completed Comment",
        cr5db_commenttext: "Đã hoàn thành cấu hình Schema XML và định nghĩa Relationships. Đang đợi import.",
        "cr5db_TaskID@odata.bind": `/cr5db_tasks(${taskId})`
      } as any);

      await Cr5db_timesheetlogsService.create({
        cr5db_timesheetlog1: "Log 8h RND setup",
        cr5db_actualhoursworked: 8,
        cr5db_logdate: "2026-05-29T00:00:00Z",
        statecode: 1, // Approved
        "cr5db_TaskID@odata.bind": `/cr5db_tasks(${taskId})`
      } as any);
    }
  });

  // 13. Appraisals
  await tryCall("Tạo đánh giá hiệu suất (Performance Appraisals)...", async () => {
    const bobId = guids["users"]["dev1@company.com"];
    const appraisalRes = await Cr5db_performanceappraisalsService.create({
      cr5db_performanceappraisal1: "Đánh giá hiệu suất Bob Q2/2026",
      cr5db_selfscore: 90,
      cr5db_finalscore: 95,
      "cr5db_EmployeeID@odata.bind": `/cr5db_users(${bobId})`,
      "cr5db_PeriodName@odata.bind": `/cr5db_evaluationperiods(${guids["periods"][0]})`
    } as any);

    if (appraisalRes?.data?.cr5db_performanceappraisalid && guids["kpitarget"]) {
      const appraisalId = appraisalRes.data.cr5db_performanceappraisalid;
      await Cr5db_appraisalkpidetailsService.create({
        cr5db_appraisalkpidetail1: "Chi tiết KPI Target Schema",
        cr5db_scoreachieved: 95,
        cr5db_comment: "Nhân sự hoàn thành xuất sắc nhiệm vụ và đóng góp tích cực vào tiến trình thiết lập hệ thống.",
        "cr5db_AppraisalName@odata.bind": `/cr5db_performanceappraisals(${appraisalId})`,
        "cr5db_TargetId@odata.bind": `/cr5db_kpitargets(${guids["kpitarget"]})`
      } as any);
    }
  });

  // 14. System Configuration & Extras
  await tryCall("Cấu hình chính sách, headcount và các cấu hình phụ trợ...", async () => {
    // Headcount Request
    await Cr5db_headcountrequestsService.create({
      cr5db_requestname: "Yêu cầu tăng định biên R&D Devs",
      cr5db_requestedquantity: 2,
      cr5db_reason: "Tăng trưởng dự án Traffic Engine đòi hỏi thêm 2 Backend Engineers cho các module AI.",
      cr5db_approvalstatus: "Pending",
      cr5db_requesttype: "Increase",
      "cr5db_Department@odata.bind": `/cr5db_departments(${guids["departments"]["RND"]})`,
      "cr5db_JobPosition@odata.bind": `/cr5db_jobpositions(${guids["jobpositions"][2]})`,
      "cr5db_PositionCatalog@odata.bind": `/cr5db_positioncatalogs(${guids["catalog"]["ENG"]})`
    } as any);

    // System Notification
    const pmId = guids["users"]["pm@company.com"];
    await Cr5db_systemnotificationsService.create({
      cr5db_systemnotification1: "Duyệt công mới",
      cr5db_content: "Bạn có 1 yêu cầu duyệt Timesheet mới từ Bob Developer.",
      cr5db_deeplinkurl: "/requests",
      cr5db_isread: false,
      "cr5db_RecipientID@odata.bind": `/cr5db_users(${pmId})`
    } as any);

    // System Parameter
    await Cr5db_systemparametersService.create({
      cr5db_systemparameter1: "MaxTimesheetHoursPerDay",
      cr5db_paramvalue: "24",
      cr5db_valuetype: "Integer"
    } as any);

    // Permission Groups
    const groups = [
      { cr5db_systemparameter1: "pg_admin", cr5db_paramvalue: "Ban Giám Đốc|abcdefghijklm", cr5db_valuetype: "PermissionGroup" },
      { cr5db_systemparameter1: "pg_pm", cr5db_paramvalue: "Quản Lý Dự Án|abcdefjkl", cr5db_valuetype: "PermissionGroup" },
      { cr5db_systemparameter1: "pg_employee", cr5db_paramvalue: "Nhân Viên R&D|abcdf", cr5db_valuetype: "PermissionGroup" }
    ];
    for (const g of groups) {
      await Cr5db_systemparametersService.create(g as any);
    }

    // Default Permission Groups Parameter
    await Cr5db_systemparametersService.create({
      cr5db_systemparameter1: "DefaultPermissionGroups",
      cr5db_paramvalue: "pg_employee",
      cr5db_valuetype: "DefaultPermissionGroups"
    } as any);

    // System Policy Rule
    await Cr5db_systempolicyrulesService.create({
      cr5db_systempolicyrule1: "Timesheet Submission Deadline Policy",
      cr5db_targetentity: "cr5db_timesheetlog",
      cr5db_contextcondition: "SubmittedDate > Sunday 23:59",
      cr5db_operator: "Block",
      cr5db_constraintvalue: "Block Submission",
      cr5db_effect: "Error"
    } as any);
  });

  // 15. Approval Routes
  await tryCall("Tạo quy tắc phê duyệt (Approval Routes)...", async () => {
    const routes = [
      {
        cr5db_routename: "Duyệt yêu cầu tuyển dụng nhân sự mới",
        cr5db_targetentity: 4, // HeadcountRequests
        cr5db_operationtype: 4, // All
        cr5db_requesterrole: 2, // ProjectManager
        cr5db_routingtype: 2, // SPECIFIC_ROLE
        cr5db_approverrole: "pg_admin", // Ban Giám Đốc
        cr5db_priority: 1,
        cr5db_isactive: 1
      },
      {
        cr5db_routename: "Duyệt thay đổi vị trí công việc",
        cr5db_targetentity: 3, // JobPositions
        cr5db_operationtype: 4, // All
        cr5db_requesterrole: 3, // HRManager
        cr5db_routingtype: 2, // SPECIFIC_ROLE
        cr5db_approverrole: "pg_admin", // Ban Giám Đốc
        cr5db_priority: 1,
        cr5db_isactive: 1
      }
    ];
    for (const r of routes) {
      await Cr5db_approvalroutesesService.create(r as any);
    }
  });

  progressCallback("Hoàn tất Seeding thành công!");
}

export async function runWebCleanup(progressCallback: (status: string) => void): Promise<void> {
  const tryDeleteAll = async (tableName: string, service: any) => {
    try {
      progressCallback(`Đang dọn dẹp bảng ${tableName}...`);
      const idField = `${tableName}id`;
      const res = await service.getAll({ maxPageSize: 5000, select: [idField] });
      const records = res?.data || [];
      if (records.length === 0) return;
      
      for (const rec of records) {
        const id = rec[idField];
        if (id) {
          await service.delete(id);
        }
      }
    } catch (error) {
      console.warn(`[Cleanup Warning] Failed during clean up of "${tableName}":`, error);
    }
  };

  // Import services needed for deletion (already available via scope)
  await tryDeleteAll("cr5db_appraisalkpidetails", Cr5db_appraisalkpidetailsService);
  await tryDeleteAll("cr5db_performanceappraisals", Cr5db_performanceappraisalsService);
  await tryDeleteAll("cr5db_kpiactuallogs", Cr5db_kpiactuallogsService);
  await tryDeleteAll("cr5db_kpitargets", Cr5db_kpitargetsService);
  await tryDeleteAll("cr5db_timesheetlogs", Cr5db_timesheetlogsService);
  await tryDeleteAll("cr5db_taskcomments", Cr5db_taskcommentsService);
  await tryDeleteAll("cr5db_taskdependencies", Cr5db_taskdependenciesService);
  await tryDeleteAll("cr5db_tasklabelassignments", Cr5db_tasklabelassignmentsService);
  await tryDeleteAll("cr5db_projectlabelassignments", Cr5db_projectlabelassignmentsService);
  await tryDeleteAll("cr5db_projectobjectivealignments", Cr5db_projectobjectivealignmentsService);
  await tryDeleteAll("cr5db_projectissues", Cr5db_projectissuesService);
  await tryDeleteAll("cr5db_projectrisks", Cr5db_projectrisksService);
  await tryDeleteAll("cr5db_tasks", Cr5db_tasksService);
  await tryDeleteAll("cr5db_userprojectroles", Cr5db_userprojectrolesService);
  await tryDeleteAll("cr5db_resourceallocations", Cr5db_resourceallocationsService);
  await tryDeleteAll("cr5db_projectteams", Cr5db_projectteamsService);
  await tryDeleteAll("cr5db_projectphases", Cr5db_projectphasesService);
  await tryDeleteAll("cr5db_projects", Cr5db_projectsService);
  await tryDeleteAll("cr5db_objectives", Cr5db_objectivesService);
  await tryDeleteAll("cr5db_kpilibraries", Cr5db_kpilibrariesService);
  await tryDeleteAll("cr5db_evaluationperiods", Cr5db_evaluationperiodsService);
  await tryDeleteAll("cr5db_users", Cr5db_usersService);
  await tryDeleteAll("cr5db_jobpositions", Cr5db_jobpositionsService);
  await tryDeleteAll("cr5db_positioncatalogs", Cr5db_positioncatalogsService);
  await tryDeleteAll("cr5db_departments", Cr5db_departmentsService);
  await tryDeleteAll("cr5db_companies", Cr5db_companiesService);
  await tryDeleteAll("cr5db_systemlabels", Cr5db_systemlabelsService);
  await tryDeleteAll("cr5db_systemnotifications", Cr5db_systemnotificationsService);

  // Clean System Parameters (only those starting with pg_ or MaxTimesheetHoursPerDay or DefaultPermissionGroups)
  try {
    progressCallback("Đang dọn dẹp các Cấu hình & Nhóm quyền...");
    const res = await Cr5db_systemparametersService.getAll({
      maxPageSize: 5000,
      select: ['cr5db_systemparameterid', 'cr5db_systemparameter1']
    });
    const params = res?.data || [];
    for (const p of params) {
      const name = p.cr5db_systemparameter1 || '';
      if (name.startsWith('pg_') || name === 'DefaultPermissionGroups' || name === 'MaxTimesheetHoursPerDay') {
        if (p.cr5db_systemparameterid) {
          await Cr5db_systemparametersService.delete(p.cr5db_systemparameterid);
        }
      }
    }
  } catch (err) {}

  await tryDeleteAll("cr5db_systempolicyrules", Cr5db_systempolicyrulesService);
  await tryDeleteAll("cr5db_headcountrequests", Cr5db_headcountrequestsService);
  await tryDeleteAll("cr5db_approvaldelegations", Cr5db_approvaldelegationsService);
  await tryDeleteAll("cr5db_audittraillogs", Cr5db_audittraillogsService);
  await tryDeleteAll("cr5db_approvalrouteses", Cr5db_approvalroutesesService);
  await tryDeleteAll("cr5db_changerequestses", Cr5db_changerequestsesService);

  progressCallback("Dọn dẹp hoàn tất thành công!");
}
