// import {
//   Cr5db_companiesService,
//   Cr5db_departmentsService,
//   Cr5db_positioncatalogsService,
//   Cr5db_jobpositionsService,
//   Cr5db_usersService,
//   Cr5db_evaluationperiodsService,
//   Cr5db_objectivesService,
//   Cr5db_projectsService,
//   Cr5db_projectphasesService,
//   Cr5db_projectteamsService,
//   Cr5db_resourceallocationsService,
//   Cr5db_userprojectrolesService,
//   Cr5db_systemlabelsService,
//   Cr5db_projectlabelassignmentsService,
//   Cr5db_projectobjectivealignmentsService,
//   Cr5db_projectrisksService,
//   Cr5db_kpilibrariesService,
//   Cr5db_kpitargetsService,
//   Cr5db_kpiactuallogsService,
//   Cr5db_tasksService,
//   Cr5db_taskcommentsService,
//   Cr5db_timesheetlogsService,
//   Cr5db_performanceappraisalsService,
//   Cr5db_appraisalkpidetailsService,
//   Cr5db_headcountrequestsService,
//   Cr5db_systemnotificationsService,
//   Cr5db_systemparametersService,
//   Cr5db_systempolicyrulesService,
//   Cr5db_approvalroutesesService,
//   Cr5db_taskdependenciesService,
//   Cr5db_tasklabelassignmentsService,
//   Cr5db_projectissuesService,
//   Cr5db_approvaldelegationsService,
//   Cr5db_audittraillogsService,
//   Cr5db_changerequestsesService
// } from '../generated';


// const PLURAL_TO_SINGULAR: Record<string, string> = {
//   "cr5db_appraisalkpidetails": "cr5db_appraisalkpidetail",
//   "cr5db_performanceappraisals": "cr5db_performanceappraisal",
//   "cr5db_kpiactuallogs": "cr5db_kpiactuallog",
//   "cr5db_kpitargets": "cr5db_kpitarget",
//   "cr5db_timesheetlogs": "cr5db_timesheetlog",
//   "cr5db_taskcomments": "cr5db_taskcomment",
//   "cr5db_taskdependencies": "cr5db_taskdependency",
//   "cr5db_tasklabelassignments": "cr5db_tasklabelassignment",
//   "cr5db_projectlabelassignments": "cr5db_projectlabelassignment",
//   "cr5db_projectobjectivealignments": "cr5db_projectobjectivealignment",
//   "cr5db_projectissues": "cr5db_projectissue",
//   "cr5db_projectrisks": "cr5db_projectrisk",
//   "cr5db_tasks": "cr5db_task",
//   "cr5db_userprojectroles": "cr5db_userprojectrole",
//   "cr5db_resourceallocations": "cr5db_resourceallocation",
//   "cr5db_projectteams": "cr5db_projectteam",
//   "cr5db_projectphases": "cr5db_projectphase",
//   "cr5db_projects": "cr5db_project",
//   "cr5db_objectives": "cr5db_objective",
//   "cr5db_kpilibraries": "cr5db_kpilibrary",
//   "cr5db_evaluationperiods": "cr5db_evaluationperiod",
//   "cr5db_users": "cr5db_user",
//   "cr5db_jobpositions": "cr5db_jobposition",
//   "cr5db_positioncatalogs": "cr5db_positioncatalog",
//   "cr5db_departments": "cr5db_department",
//   "cr5db_companies": "cr5db_company",
//   "cr5db_systemlabels": "cr5db_systemlabel",
//   "cr5db_systemnotifications": "cr5db_systemnotification",
//   "cr5db_systemparameters": "cr5db_systemparameter",
//   "cr5db_systempolicyrules": "cr5db_systempolicyrule",
//   "cr5db_headcountrequests": "cr5db_headcountrequest",
//   "cr5db_approvaldelegations": "cr5db_approvaldelegation",
//   "cr5db_audittraillogs": "cr5db_audittraillog",
//   "cr5db_approvalrouteses": "cr5db_approvalroutes",
//   "cr5db_changerequestses": "cr5db_changerequests",
//   "cr5db_roleassignments": "cr5db_roleassignment",
//   "cr5db_systemroles": "cr5db_systemrole",
//   "cr5db_taskownerships": "cr5db_taskownership",
//   "cr5db_timesheetaudits": "cr5db_timesheetaudit"
// };

// export async function runWebSeeding(progressCallback: (status: string) => void): Promise<void> {
//   const guids: Record<string, any> = {};

//   const tryCall = async (actionName: string, fn: () => Promise<any>) => {
//     try {
//       progressCallback(actionName);
//       console.log(`[Seeding] ▶ Bắt đầu: ${actionName}`);
//       const result = await fn();
//       console.log(`[Seeding] ✅ Hoàn tất: ${actionName}`);
//       return result;
//     } catch (error: any) {
//       const errMsg = error?.message || JSON.stringify(error);
//       progressCallback(`❌ LỖI khi "${actionName}": ${errMsg}`);
//       console.error(`[Seeding] ❌ Lỗi: ${actionName}`, error);
//       // Log error and continue to allow partial seeding if some tables are missing
//       return null;
//     }
//   };

//   // Helper: log kết quả từng lệnh create Dataverse
//   const logCreate = (entityName: string, res: any) => {
//     if (res?.success === false) {
//       const errDetail = res?.error?.message || res?.error?.code || JSON.stringify(res?.error);
//       progressCallback(`  ⚠️ ${entityName}: Dataverse trả về success=false → ${errDetail}`);
//       console.error(`[Seeding] ${entityName} create failed:`, res);
//     } else if (res?.data) {
//       const firstKey = Object.keys(res.data).find(k => k.endsWith('id') && k.startsWith('cr5db_'));
//       const id = firstKey ? res.data[firstKey] : '(unknown)';
//       console.log(`[Seeding] ${entityName} created OK, ID=${id}`);
//     } else {
//       progressCallback(`  ⚠️ ${entityName}: Response trống hoặc bất thường`);
//       console.warn(`[Seeding] ${entityName} unexpected response:`, res);
//     }
//   };

//   // Helper: Tạo bản ghi an toàn, tự động catch lỗi và log chi tiết từng bản ghi
//   const safeCreate = async (entityName: string, serviceCreateFn: () => Promise<any>) => {
//     try {
//       const res = await serviceCreateFn();
//       logCreate(entityName, res);
//       return res?.data;
//     } catch (err: any) {
//       const errMsg = err?.message || JSON.stringify(err);
//       progressCallback(`  ❌ LỖI tạo ${entityName}: ${errMsg}`);
//       console.error(`[Seeding] ❌ Lỗi tạo ${entityName}:`, err);
//       return null;
//     }
//   };

//   // Helper: Tránh lỗi OData bind URL bị rỗng hoặc lỗi cú pháp khi GUID trống
//   const bindOData = (entitySet: string, id: string | undefined) => {
//     if (!id) return undefined;
//     return `${entitySet}(${id})`;
//   };

//   // 1. Companies
//   await tryCall("Tạo thông tin Công ty...", async () => {
//     guids["companies"] = [];
//     const companies = [
//       { cr5db_companycode: "VNX", cr5db_companyname: "VibePower Vietnam" },
//       { cr5db_companycode: "GLB", cr5db_companyname: "VibePower Global" }
//     ];
//     for (const c of companies) {
//       const data = await safeCreate(`Company[${c.cr5db_companycode}]`, () => Cr5db_companiesService.create(c as any));
//       if (data?.cr5db_companyid) {
//         guids["companies"].push(data.cr5db_companyid);
//       }
//     }
//   });

//   if (!guids["companies"] || guids["companies"].length === 0) {
//     throw new Error("Không thể tạo dữ liệu Công ty cơ sở. Dừng tiến trình seeding.");
//   }

//   // 2. System Labels
//   await tryCall("Tạo thẻ nhãn hệ thống (System Labels)...", async () => {
//     guids["labels"] = [];
//     const labels = [
//       { cr5db_systemlabel1: "Urgent", cr5db_hexcolor: "#e81123", cr5db_labelgroup: "Priority" },
//       { cr5db_systemlabel1: "Medium", cr5db_hexcolor: "#ff8c00", cr5db_labelgroup: "Priority" },
//       { cr5db_systemlabel1: "Low", cr5db_hexcolor: "#0078d4", cr5db_labelgroup: "Priority" },
//       { cr5db_systemlabel1: "Bug", cr5db_hexcolor: "#a80000", cr5db_labelgroup: "Category" },
//       { cr5db_systemlabel1: "Feature", cr5db_hexcolor: "#107c41", cr5db_labelgroup: "Category" }
//     ];
//     for (const l of labels) {
//       const data = await safeCreate(`Label[${l.cr5db_systemlabel1}]`, () => Cr5db_systemlabelsService.create(l as any));
//       if (data?.cr5db_systemlabelid) {
//         guids["labels"].push({ name: l.cr5db_systemlabel1, id: data.cr5db_systemlabelid });
//       }
//     }
//   });

//   // 3. Departments
//   await tryCall("Tạo Phòng ban...", async () => {
//     guids["departments"] = {};
//     const depts = [
//       {
//         cr5db_departmentcode: "RND",
//         cr5db_departmentname: "Research & Development",
//         "cr5db_CompanyID@odata.bind": bindOData("cr5db_companies", guids["companies"]?.[0])
//       },
//       {
//         cr5db_departmentcode: "HRM",
//         cr5db_departmentname: "Human Resources",
//         "cr5db_CompanyID@odata.bind": bindOData("cr5db_companies", guids["companies"]?.[0])
//       },
//       {
//         cr5db_departmentcode: "MKT",
//         cr5db_departmentname: "Marketing",
//         "cr5db_CompanyID@odata.bind": bindOData("cr5db_companies", guids["companies"]?.[1])
//       }
//     ];
//     for (const d of depts) {
//       const data = await safeCreate(`Department[${d.cr5db_departmentcode}]`, () => Cr5db_departmentsService.create(d as any));
//       if (data?.cr5db_departmentid) {
//         guids["departments"][d.cr5db_departmentcode] = data.cr5db_departmentid;
//       }
//     }
//   });

//   // 4. Position Catalog
//   await tryCall("Tạo danh mục chức danh (Position Catalog)...", async () => {
//     guids["catalog"] = {};
//     const catalog = [
//       { cr5db_code: "DIR", cr5db_positioncatalog1: "Director" },
//       { cr5db_code: "MGR", cr5db_positioncatalog1: "Project Manager" },
//       { cr5db_code: "ENG", cr5db_positioncatalog1: "Software Engineer" },
//       { cr5db_code: "HR", cr5db_positioncatalog1: "HR Specialist" }
//     ];
//     for (const cat of catalog) {
//       const data = await safeCreate(`Catalog[${cat.cr5db_code}]`, () => Cr5db_positioncatalogsService.create(cat as any));
//       if (data?.cr5db_positioncatalogid) {
//         guids["catalog"][cat.cr5db_code] = data.cr5db_positioncatalogid;
//       }
//     }
//   });

//   // 5. Job Position
//   await tryCall("Tạo vị trí định biên (Job Positions)...", async () => {
//     guids["jobpositions"] = [];
//     const positions = [
//       {
//         cr5db_positionname: "Director of R&D",
//         cr5db_headcountquota: 1,
//         "cr5db_Department@odata.bind": bindOData("cr5db_departments", guids["departments"]?.["RND"]),
//         "cr5db_PositionCatalogTitle@odata.bind": bindOData("cr5db_positioncatalogs", guids["catalog"]?.["DIR"])
//       },
//       {
//         cr5db_positionname: "R&D Project Manager",
//         cr5db_headcountquota: 2,
//         "cr5db_Department@odata.bind": bindOData("cr5db_departments", guids["departments"]?.["RND"]),
//         "cr5db_PositionCatalogTitle@odata.bind": bindOData("cr5db_positioncatalogs", guids["catalog"]?.["MGR"])
//       },
//       {
//         cr5db_positionname: "Senior Software Engineer",
//         cr5db_headcountquota: 5,
//         "cr5db_Department@odata.bind": bindOData("cr5db_departments", guids["departments"]?.["RND"]),
//         "cr5db_PositionCatalogTitle@odata.bind": bindOData("cr5db_positioncatalogs", guids["catalog"]?.["ENG"])
//       },
//       {
//         cr5db_positionname: "HR Recruitment Specialist",
//         cr5db_headcountquota: 2,
//         "cr5db_Department@odata.bind": bindOData("cr5db_departments", guids["departments"]?.["HRM"]),
//         "cr5db_PositionCatalogTitle@odata.bind": bindOData("cr5db_positioncatalogs", guids["catalog"]?.["HR"])
//       }
//     ];
//     for (const pos of positions) {
//       const data = await safeCreate(`JobPosition[${pos.cr5db_positionname}]`, () => Cr5db_jobpositionsService.create(pos as any));
//       if (data?.cr5db_jobpositionid) {
//         guids["jobpositions"].push(data.cr5db_jobpositionid);
//       }
//     }

//     // Link reports to relationship
//     if (guids["jobpositions"] && guids["jobpositions"].length >= 2) {
//       const dirId = guids["jobpositions"][0];
//       const pmId = guids["jobpositions"][1];
//       if (dirId && pmId) {
//         try {
//           console.log(`[Seeding] Linking R&D Project Manager reporting to Director of R&D`);
//           await Cr5db_jobpositionsService.update(pmId, {
//             "cr5db_ReportsToPositionID@odata.bind": bindOData("cr5db_jobpositions", dirId)
//           } as any);
//         } catch (hierarchyErr: any) {
//           console.error(`[Seeding] Failed to link job position hierarchy:`, hierarchyErr);
//         }
//       }
//     }
//   });

//   // 6. Users
//   await tryCall("Tạo người dùng (Employees)...", async () => {
//     guids["users"] = {};
//     const users = [
//       {
//         cr5db_fullname: "Violetta Admin",
//         cr5db_email: "admin@company.com",
//         cr5db_isactive: true,
//         cr5db_systemrole: "Admin",
//         "cr5db_JobPosition@odata.bind": bindOData("cr5db_jobpositions", guids["jobpositions"]?.[0])
//       },
//       {
//         cr5db_fullname: "Alice PM",
//         cr5db_email: "pm@company.com",
//         cr5db_isactive: true,
//         cr5db_systemrole: "ProjectManager",
//         "cr5db_JobPosition@odata.bind": bindOData("cr5db_jobpositions", guids["jobpositions"]?.[1])
//       },
//       {
//         cr5db_fullname: "Bob Developer",
//         cr5db_email: "dev1@company.com",
//         cr5db_isactive: true,
//         cr5db_systemrole: "Employee",
//         "cr5db_JobPosition@odata.bind": bindOData("cr5db_jobpositions", guids["jobpositions"]?.[2])
//       },
//       {
//         cr5db_fullname: "Charlie Developer",
//         cr5db_email: "dev2@company.com",
//         cr5db_isactive: true,
//         cr5db_systemrole: "Employee",
//         "cr5db_JobPosition@odata.bind": bindOData("cr5db_jobpositions", guids["jobpositions"]?.[2])
//       }
//     ];
//     for (const u of users) {
//       const data = await safeCreate(`User[${u.cr5db_fullname}]`, () => Cr5db_usersService.create(u as any));
//       if (data?.cr5db_userid) {
//         guids["users"][u.cr5db_email] = data.cr5db_userid;
//       }
//     }
//   });

//   // 7. Evaluation Period
//   await tryCall("Tạo chu kỳ đánh giá (Evaluation Periods)...", async () => {
//     guids["periods"] = [];
//     const period = {
//       cr5db_evaluationperiod1: "Q2/2026",
//       cr5db_startdate: "2026-04-01T00:00:00Z",
//       cr5db_enddate: "2026-06-30T00:00:00Z",
//       cr5db_islocked: false
//     };
//     const data = await safeCreate('EvaluationPeriod[Q2/2026]', () => Cr5db_evaluationperiodsService.create(period as any));
//     if (data?.cr5db_evaluationperiodid) {
//       guids["periods"].push(data.cr5db_evaluationperiodid);
//     }
//   });

//   // 8. Objectives
//   await tryCall("Tạo mục tiêu chiến lược (Objectives)...", async () => {
//     guids["objectives"] = [];
//     const obj = {
//       cr5db_objective1: "Đạt chất lượng phần mềm QLDA Q2/2026",
//       cr5db_targetvalue: 100,
//       cr5db_objectiveprogress: 0,
//       "cr5db_PeriodName@odata.bind": bindOData("cr5db_evaluationperiods", guids["periods"]?.[0])
//     };
//     const data = await safeCreate('Objective', () => Cr5db_objectivesService.create(obj as any));
//     if (data?.cr5db_objectiveid) {
//       guids["objectives"].push(data.cr5db_objectiveid);
//     }
//   });

//   // 9. Projects & Subcomponents
//   await tryCall("Tạo dự án và các giai đoạn liên quan (Projects & Teams)...", async () => {
//     const proj = {
//       cr5db_projectname: "Traffic Analysis Engine",
//       cr5db_description: "Phần mềm phân tích mật độ giao thông thông minh",
//       cr5db_startdate: "2026-04-05T00:00:00Z",
//       cr5db_enddate: "2026-06-25T00:00:00Z"
//     };
//     const data = await safeCreate('Project[Traffic Analysis Engine]', () => Cr5db_projectsService.create(proj as any));
//     if (data?.cr5db_projectid) {
//       const projId = data.cr5db_projectid;

//       // Labels Assignment
//       if (guids["labels"] && guids["labels"].length > 0) {
//         await safeCreate('ProjectLabelAssignment', () => Cr5db_projectlabelassignmentsService.create({
//           cr5db_projectlabelassignment1: "Traffic Project - Urgent",
//           "cr5db_ProjectID@odata.bind": bindOData("cr5db_projects", projId),
//           "cr5db_LabelName@odata.bind": bindOData("cr5db_systemlabels", guids["labels"][0]?.id)
//         } as any));
//       }

//       // Objective Alignment
//       if (guids["objectives"] && guids["objectives"].length > 0) {
//         await safeCreate('ProjectObjectiveAlignment', () => Cr5db_projectobjectivealignmentsService.create({
//           cr5db_projectobjectivealignment1: "Traffic Objective Alignment",
//           "cr5db_Project@odata.bind": bindOData("cr5db_projects", projId),
//           "cr5db_Objective@odata.bind": bindOData("cr5db_objectives", guids["objectives"][0])
//         } as any));
//       }

//       // Project Risks
//       await safeCreate('ProjectRisk', () => Cr5db_projectrisksService.create({
//         cr5db_projectrisk1: "Database scaling bottlenecks",
//         cr5db_impact: "High",
//         cr5db_probability: "Medium",
//         cr5db_mitigationplan: "Implement horizontal partitioning on PostgreSQL",
//         "cr5db_ProjectID@odata.bind": bindOData("cr5db_projects", projId)
//       } as any));

//       // Project Phase
//       const phaseData = await safeCreate('ProjectPhase[Phase 1]', () => Cr5db_projectphasesService.create({
//         cr5db_phasename: "Phase 1: Database Setup & Integration",
//         cr5db_startdate: "2026-04-06T00:00:00Z",
//         cr5db_enddate: "2026-04-30T00:00:00Z",
//         "cr5db_ProjectID@odata.bind": bindOData("cr5db_projects", projId)
//       } as any));
//       if (phaseData?.cr5db_projectphaseid) {
//         guids["phase_id"] = phaseData.cr5db_projectphaseid;
//       }

//       // Project Team
//       const teamData = await safeCreate('ProjectTeam', () => Cr5db_projectteamsService.create({
//         cr5db_teamname: "Traffic Engine Dev Team",
//         "cr5db_ProjectID@odata.bind": bindOData("cr5db_projects", projId)
//       } as any));
//       if (teamData?.cr5db_projectteamid) {
//         const teamId = teamData.cr5db_projectteamid;

//         // Allocations
//         for (const email of ["dev1@company.com", "dev2@company.com"]) {
//           const uId = guids["users"][email];
//           if (uId) {
//             const allocData = await safeCreate(`ResourceAllocation[${email.split('@')[0]}]`, () => Cr5db_resourceallocationsService.create({
//               cr5db_resourceallocation1: `Allocation for ${email.split('@')[0]}`,
//               cr5db_allocationpercentage: 100,
//               "cr5db_UserID@odata.bind": bindOData("cr5db_users", uId),
//               "cr5db_ProjectTeamID@odata.bind": bindOData("cr5db_projectteams", teamId)
//             } as any));

//             if (allocData?.cr5db_resourceallocationid) {
//               const allocId = allocData.cr5db_resourceallocationid;
//               const isLead = email === "dev1@company.com";
//               await safeCreate(`UserProjectRole[${isLead ? 'Lead' : 'QA'}]`, () => Cr5db_userprojectrolesService.create({
//                 cr5db_rolename: isLead ? "Lead Developer" : "QA Tester",
//                 cr5db_rolecode: isLead ? "LD" : "QA",
//                 "cr5db_AllocationID@odata.bind": bindOData("cr5db_resourceallocations", allocId)
//               } as any));
//             }
//           }
//         }
//       }
//     }
//   });

//   // 10. KPI Library
//   await tryCall("Tạo danh mục mẫu chỉ số KPI...", async () => {
//     guids["kpilibrary"] = [];
//     const library = [
//       { cr5db_kpiname: "Tỷ lệ hoàn thành Task đúng hạn", cr5db_unit: "%", cr5db_formula: "(Số Task hoàn thành đúng hạn / Tổng số Task) * 100" },
//       { cr5db_kpiname: "Tỷ lệ thời gian Timesheet chuẩn", cr5db_unit: "%", cr5db_formula: "(Số giờ Timesheet hợp lệ / Tổng số giờ quy định) * 100" }
//     ];
//     for (const lib of library) {
//       const data = await safeCreate(`KPILibrary[${lib.cr5db_kpiname}]`, () => Cr5db_kpilibrariesService.create(lib as any));
//       if (data?.cr5db_kpilibraryid) {
//         guids["kpilibrary"].push(data.cr5db_kpilibraryid);
//       }
//     }
//   });

//   // 11. KPI Targets & Actuals
//   await tryCall("Gán chỉ tiêu và ghi nhận thực tế KPI...", async () => {
//     const bobId = guids["users"]["dev1@company.com"];
//     const targetData = await safeCreate('KPITarget', () => Cr5db_kpitargetsService.create({
//       cr5db_kpitarget1: "Hoàn thành Schema Q2",
//       cr5db_targetvalue: 95,
//       cr5db_actualvalue: 0,
//       cr5db_weightpercentage: 50,
//       "cr5db_EmployeeID@odata.bind": bindOData("cr5db_users", bobId),
//       "cr5db_KPICode@odata.bind": bindOData("cr5db_kpilibraries", guids["kpilibrary"]?.[0]),
//       "cr5db_ParentObjective@odata.bind": bindOData("cr5db_objectives", guids["objectives"]?.[0])
//     } as any));

//     if (targetData?.cr5db_kpitargetid) {
//       const targetId = targetData.cr5db_kpitargetid;
//       guids["kpitarget"] = targetId;

//       await safeCreate('KPIActualLog', () => Cr5db_kpiactuallogsService.create({
//         cr5db_kpiactuallog1: "Completed Phase 1 database definition schema review",
//         cr5db_actualvalue: 90,
//         cr5db_evidencelink: "https://github.com/violet/traffic-analysis-engine/pull/1",
//         "cr5db_TargetId@odata.bind": bindOData("cr5db_kpitargets", targetId)
//       } as any));
//     }
//   });

//   // 12. Tasks, Comments & Timesheets
//   await tryCall("Tạo công việc (Tasks), timesheets và bình luận...", async () => {
//     const bobId = guids["users"]["dev1@company.com"];
//     const taskData = await safeCreate('Task[Setup Dataverse schema]', () => Cr5db_tasksService.create({
//       cr5db_taskname: "Thiết lập Schema Dataverse cho bảng ProjectRisk",
//       cr5db_description: "Định nghĩa các cột, kiểu dữ liệu, các quan hệ khóa ngoại liên kết cho bảng Project Risk.",
//       cr5db_duedate: "2026-05-30T17:00:00Z",
//       cr5db_status: "Completed",
//       "cr5db_AssigneeID@odata.bind": bindOData("cr5db_users", bobId),
//       "cr5db_ObjectiveName@odata.bind": bindOData("cr5db_objectives", guids["objectives"]?.[0]),
//       "cr5db_ProjectPhaseID@odata.bind": bindOData("cr5db_projectphases", guids["phase_id"])
//     } as any));

//     if (taskData?.cr5db_taskid) {
//       const taskId = taskData.cr5db_taskid;

//       await safeCreate('TaskComment', () => Cr5db_taskcommentsService.create({
//         cr5db_taskcomment1: "Task Completed Comment",
//         cr5db_commenttext: "Đã hoàn thành cấu hình Schema XML và định nghĩa Relationships. Đang đợi import.",
//         "cr5db_TaskID@odata.bind": bindOData("cr5db_tasks", taskId)
//       } as any));

//       await safeCreate('TimesheetLog', () => Cr5db_timesheetlogsService.create({
//         cr5db_timesheetlog1: "Log 8h RND setup",
//         cr5db_actualhoursworked: 8,
//         cr5db_logdate: "2026-05-29T00:00:00Z",
//         statecode: 1, // Approved
//         "cr5db_TaskID@odata.bind": bindOData("cr5db_tasks", taskId)
//       } as any));
//     }
//   });

//   // 13. Appraisals
//   await tryCall("Tạo đánh giá hiệu suất (Performance Appraisals)...", async () => {
//     const bobId = guids["users"]["dev1@company.com"];
//     const appraisalData = await safeCreate('PerformanceAppraisal', () => Cr5db_performanceappraisalsService.create({
//       cr5db_performanceappraisal1: "Đánh giá hiệu suất Bob Q2/2026",
//       cr5db_selfscore: 90,
//       cr5db_finalscore: 95,
//       "cr5db_EmployeeID@odata.bind": bindOData("cr5db_users", bobId),
//       "cr5db_PeriodName@odata.bind": bindOData("cr5db_evaluationperiods", guids["periods"]?.[0])
//     } as any));

//     if (appraisalData?.cr5db_performanceappraisalid && guids["kpitarget"]) {
//       const appraisalId = appraisalData.cr5db_performanceappraisalid;
//       await safeCreate('AppraisalKPIDetails', () => Cr5db_appraisalkpidetailsService.create({
//         cr5db_appraisalkpidetail1: "Chi tiết KPI Target Schema",
//         cr5db_scoreachieved: 95,
//         cr5db_comment: "Nhân sự hoàn thành xuất sắc nhiệm vụ và đóng góp tích cực vào tiến trình thiết lập hệ thống.",
//         "cr5db_AppraisalName@odata.bind": bindOData("cr5db_performanceappraisals", appraisalId),
//         "cr5db_TargetId@odata.bind": bindOData("cr5db_kpitargets", guids["kpitarget"])
//       } as any));
//     }
//   });

//   // 14. System Configuration & Extras
//   await tryCall("Cấu hình chính sách, headcount và các cấu hình phụ trợ...", async () => {
//     // Headcount Request
//     await safeCreate('HeadcountRequest', () => Cr5db_headcountrequestsService.create({
//       cr5db_requestname: "Yêu cầu tăng định biên R&D Devs",
//       cr5db_requestedquantity: 2,
//       cr5db_reason: "Tăng trưởng dự án Traffic Engine đòi hỏi thêm 2 Backend Engineers cho các module AI.",
//       cr5db_approvalstatus: "Pending",
//       cr5db_requesttype: "Increase",
//       "cr5db_Department@odata.bind": bindOData("cr5db_departments", guids["departments"]?.["RND"]),
//       "cr5db_JobPosition@odata.bind": bindOData("cr5db_jobpositions", guids["jobpositions"]?.[2]),
//       "cr5db_PositionCatalog@odata.bind": bindOData("cr5db_positioncatalogs", guids["catalog"]?.["ENG"])
//     } as any));

//     // System Notification
//     const pmId = guids["users"]["pm@company.com"];
//     await safeCreate('SystemNotification', () => Cr5db_systemnotificationsService.create({
//       cr5db_systemnotification1: "Duyệt công mới",
//       cr5db_content: "Bạn có 1 yêu cầu duyệt Timesheet mới từ Bob Developer.",
//       cr5db_deeplinkurl: "/requests",
//       cr5db_isread: false,
//       "cr5db_RecipientID@odata.bind": bindOData("cr5db_users", pmId)
//     } as any));

//     // System Parameter
//     await safeCreate('SystemParameter[MaxTimesheetHours]', () => Cr5db_systemparametersService.create({
//       cr5db_systemparameter1: "MaxTimesheetHoursPerDay",
//       cr5db_paramvalue: "24",
//       cr5db_valuetype: "Integer"
//     } as any));

//     // Permission Groups
//     const groups = [
//       { cr5db_systemparameter1: "pg_admin", cr5db_paramvalue: "Ban Giám Đốc|abcdefghijklm", cr5db_valuetype: "PermissionGroup" },
//       { cr5db_systemparameter1: "pg_pm", cr5db_paramvalue: "Quản Lý Dự Án|abcdefjkl", cr5db_valuetype: "PermissionGroup" },
//       { cr5db_systemparameter1: "pg_employee", cr5db_paramvalue: "Nhân Viên R&D|abcdf", cr5db_valuetype: "PermissionGroup" }
//     ];
//     for (const g of groups) {
//       await safeCreate(`PermissionGroup[${g.cr5db_systemparameter1}]`, () => Cr5db_systemparametersService.create(g as any));
//     }

//     // Default Permission Groups Parameter
//     await safeCreate('SystemParameter[DefaultPermissionGroups]', () => Cr5db_systemparametersService.create({
//       cr5db_systemparameter1: "DefaultPermissionGroups",
//       cr5db_paramvalue: "pg_employee",
//       cr5db_valuetype: "DefaultPermissionGroups"
//     } as any));

//     // System Policy Rule
//     await safeCreate('SystemPolicyRule', () => Cr5db_systempolicyrulesService.create({
//       cr5db_systempolicyrule1: "Timesheet Submission Deadline Policy",
//       cr5db_targetentity: "cr5db_timesheetlog",
//       cr5db_contextcondition: "SubmittedDate > Sunday 23:59",
//       cr5db_operator: "Block",
//       cr5db_constraintvalue: "Block Submission",
//       cr5db_effect: "Error"
//     } as any));
//   });

//   // 15. Approval Routes
//   await tryCall("Tạo quy tắc phê duyệt (Approval Routes)...", async () => {
//     const routes = [
//       {
//         cr5db_routename: "Duyệt yêu cầu tuyển dụng nhân sự mới",
//         cr5db_targetentity: 4, // HeadcountRequests
//         cr5db_operationtype: 4, // All
//         cr5db_requesterrole: 2, // ProjectManager
//         cr5db_routingtype: 2, // SPECIFIC_ROLE
//         cr5db_approverrole: "pg_admin", // Ban Giám Đốc
//         cr5db_priority: 1,
//         cr5db_isactive: 1
//       },
//       {
//         cr5db_routename: "Duyệt thay đổi vị trí công việc",
//         cr5db_targetentity: 3, // JobPositions
//         cr5db_operationtype: 4, // All
//         cr5db_requesterrole: 3, // HRManager
//         cr5db_routingtype: 2, // SPECIFIC_ROLE
//         cr5db_approverrole: "pg_admin", // Ban Giám Đốc
//         cr5db_priority: 1,
//         cr5db_isactive: 1
//       }
//     ];
//     for (const r of routes) {
//       await safeCreate(`ApprovalRoute[${r.cr5db_routename}]`, () => Cr5db_approvalroutesesService.create(r as any));
//     }
//   });

//   progressCallback("Hoàn tất Seeding thành công!");
// }

// export async function runWebCleanup(progressCallback: (status: string) => void): Promise<void> {
//   const tryDeleteAll = async (tableName: string, service: any) => {
//     try {
//       progressCallback(`Đang dọn dẹp bảng ${tableName}...`);
//       // Lấy toàn bộ trường để tránh lỗi OData sai tên cột
//       const res = await service.getAll({ maxPageSize: 5000 });
//       console.log(`[CleanData] Bảng ${tableName}, Raw Response:`, res);

//       const records = res?.data || [];
//       if (records.length === 0) {
//         progressCallback(`Bảng ${tableName} không có dữ liệu cần dọn dẹp.`);
//         return;
//       }
      
//       // Xác định tên trường khóa chính (Primary Key Field)
//       const firstRec = records[0];
//       const singularName = PLURAL_TO_SINGULAR[tableName] || tableName;
//       let idField = `${singularName}id`;
//       if (!(idField in firstRec)) {
//         // Fallback: Tìm trường nào bắt đầu bằng cr5db_ và kết thúc bằng id, lấy trường ngắn nhất
//         const keys = Object.keys(firstRec).filter(k => k.startsWith('cr5db_') && k.endsWith('id') && !k.includes('@'));
//         idField = keys.sort((a,b) => a.length - b.length)[0];
//       }

//       console.log(`[CleanData] Bảng ${tableName}, field khóa chính xác định được: ${idField}`);
      
//       progressCallback(`Tìm thấy ${records.length} bản ghi trong ${tableName}. Đang tiến hành xóa...`);
//       let deletedCount = 0;
//       for (const rec of records) {
//         const id = idField ? rec[idField] : undefined;
//         if (id) {
//           try {
//             console.log(`[CleanData] Đang xóa ID: ${id} trong bảng ${tableName}`);
//             await service.delete(id);
//             deletedCount++;
//           } catch (delErr: any) {
//             const errMsg = delErr?.message || JSON.stringify(delErr);
//             progressCallback(`⚠️ Lỗi xóa dòng ${id} trong ${tableName}: ${errMsg}`);
//             console.error(`Error deleting ${id} in ${tableName}:`, delErr);
//           }
//         } else {
//           console.warn(`[CleanData] Bản ghi trong ${tableName} không có field ${idField}`, rec);
//         }
//       }
//       progressCallback(`Đã xóa thành công ${deletedCount}/${records.length} bản ghi trong ${tableName}.`);
//     } catch (error: any) {
//       const errMsg = error?.message || JSON.stringify(error);
//       progressCallback(`❌ Lỗi truy vấn bảng ${tableName}: ${errMsg}`);
//       console.error(`[Cleanup Warning] Failed during clean up of "${tableName}":`, error);
//     }
//   };

//   // Import services needed for deletion (already available via scope)
//   await tryDeleteAll("cr5db_appraisalkpidetails", Cr5db_appraisalkpidetailsService);
//   await tryDeleteAll("cr5db_performanceappraisals", Cr5db_performanceappraisalsService);
//   await tryDeleteAll("cr5db_kpiactuallogs", Cr5db_kpiactuallogsService);
//   await tryDeleteAll("cr5db_kpitargets", Cr5db_kpitargetsService);
//   await tryDeleteAll("cr5db_timesheetlogs", Cr5db_timesheetlogsService);
//   await tryDeleteAll("cr5db_taskcomments", Cr5db_taskcommentsService);
//   await tryDeleteAll("cr5db_taskdependencies", Cr5db_taskdependenciesService);
//   await tryDeleteAll("cr5db_tasklabelassignments", Cr5db_tasklabelassignmentsService);
//   await tryDeleteAll("cr5db_projectlabelassignments", Cr5db_projectlabelassignmentsService);
//   await tryDeleteAll("cr5db_projectobjectivealignments", Cr5db_projectobjectivealignmentsService);
//   await tryDeleteAll("cr5db_projectissues", Cr5db_projectissuesService);
//   await tryDeleteAll("cr5db_projectrisks", Cr5db_projectrisksService);
//   await tryDeleteAll("cr5db_tasks", Cr5db_tasksService);
//   await tryDeleteAll("cr5db_userprojectroles", Cr5db_userprojectrolesService);
//   await tryDeleteAll("cr5db_resourceallocations", Cr5db_resourceallocationsService);
//   await tryDeleteAll("cr5db_projectteams", Cr5db_projectteamsService);
//   await tryDeleteAll("cr5db_projectphases", Cr5db_projectphasesService);
//   await tryDeleteAll("cr5db_projects", Cr5db_projectsService);
//   await tryDeleteAll("cr5db_objectives", Cr5db_objectivesService);
//   await tryDeleteAll("cr5db_kpilibraries", Cr5db_kpilibrariesService);
//   await tryDeleteAll("cr5db_evaluationperiods", Cr5db_evaluationperiodsService);
//   await tryDeleteAll("cr5db_users", Cr5db_usersService);
//   await tryDeleteAll("cr5db_jobpositions", Cr5db_jobpositionsService);
//   await tryDeleteAll("cr5db_positioncatalogs", Cr5db_positioncatalogsService);
//   await tryDeleteAll("cr5db_departments", Cr5db_departmentsService);
//   await tryDeleteAll("cr5db_companies", Cr5db_companiesService);
//   await tryDeleteAll("cr5db_systemlabels", Cr5db_systemlabelsService);
//   await tryDeleteAll("cr5db_systemnotifications", Cr5db_systemnotificationsService);

//   // Clean System Parameters (only those starting with pg_ or MaxTimesheetHoursPerDay or DefaultPermissionGroups)
//   try {
//     progressCallback("Đang dọn dẹp các Cấu hình & Nhóm quyền...");
//     const res = await Cr5db_systemparametersService.getAll({
//       maxPageSize: 5000,
//       select: ['cr5db_systemparameterid', 'cr5db_systemparameter1']
//     });
//     const params = res?.data || [];
//     let count = 0;
//     for (const p of params) {
//       const name = p.cr5db_systemparameter1 || '';
//       if (name.startsWith('pg_') || name === 'DefaultPermissionGroups' || name === 'MaxTimesheetHoursPerDay') {
//         if (p.cr5db_systemparameterid) {
//           try {
//             await Cr5db_systemparametersService.delete(p.cr5db_systemparameterid);
//             count++;
//           } catch (paramErr: any) {
//             progressCallback(`⚠️ Lỗi xóa tham số ${name}: ${paramErr?.message || JSON.stringify(paramErr)}`);
//           }
//         }
//       }
//     }
//     progressCallback(`Đã dọn dẹp xong ${count} tham số hệ thống.`);
//   } catch (err: any) {
//     progressCallback(`❌ Lỗi truy vấn bảng systemparameters: ${err?.message || JSON.stringify(err)}`);
//   }

//   await tryDeleteAll("cr5db_systempolicyrules", Cr5db_systempolicyrulesService);
//   await tryDeleteAll("cr5db_headcountrequests", Cr5db_headcountrequestsService);
//   await tryDeleteAll("cr5db_approvaldelegations", Cr5db_approvaldelegationsService);
//   await tryDeleteAll("cr5db_audittraillogs", Cr5db_audittraillogsService);
//   await tryDeleteAll("cr5db_approvalrouteses", Cr5db_approvalroutesesService);
//   await tryDeleteAll("cr5db_changerequestses", Cr5db_changerequestsesService);

//   progressCallback("Dọn dẹp hoàn tất thành công!");
// }
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
  Cr5db_changerequestsesService,
  New_processtemplateService,
  New_processtemplatestepService,
  New_employeeprocessService,
  New_processstepService,
  New_leavebalanceService,
  New_leaverequestService,
  New_holidayService,
  New_overtimerequestService
} from '../generated';


const PLURAL_TO_SINGULAR: Record<string, string> = {
  "cr5db_appraisalkpidetails": "cr5db_appraisalkpidetail",
  "cr5db_performanceappraisals": "cr5db_performanceappraisal",
  "cr5db_kpiactuallogs": "cr5db_kpiactuallog",
  "cr5db_kpitargets": "cr5db_kpitarget",
  "cr5db_timesheetlogs": "cr5db_timesheetlog",
  "cr5db_taskcomments": "cr5db_taskcomment",
  "cr5db_taskdependencies": "cr5db_taskdependency",
  "cr5db_tasklabelassignments": "cr5db_tasklabelassignment",
  "cr5db_projectlabelassignments": "cr5db_projectlabelassignment",
  "cr5db_projectobjectivealignments": "cr5db_projectobjectivealignment",
  "cr5db_projectissues": "cr5db_projectissue",
  "cr5db_projectrisks": "cr5db_projectrisk",
  "cr5db_tasks": "cr5db_task",
  "cr5db_userprojectroles": "cr5db_userprojectrole",
  "cr5db_resourceallocations": "cr5db_resourceallocation",
  "cr5db_projectteams": "cr5db_projectteam",
  "cr5db_projectphases": "cr5db_projectphase",
  "cr5db_projects": "cr5db_project",
  "cr5db_objectives": "cr5db_objective",
  "cr5db_kpilibraries": "cr5db_kpilibrary",
  "cr5db_evaluationperiods": "cr5db_evaluationperiod",
  "cr5db_users": "cr5db_user",
  "cr5db_jobpositions": "cr5db_jobposition",
  "cr5db_positioncatalogs": "cr5db_positioncatalog",
  "cr5db_departments": "cr5db_department",
  "cr5db_companies": "cr5db_company",
  "cr5db_systemlabels": "cr5db_systemlabel",
  "cr5db_systemnotifications": "cr5db_systemnotification",
  "cr5db_systemparameters": "cr5db_systemparameter",
  "cr5db_systempolicyrules": "cr5db_systempolicyrule",
  "cr5db_headcountrequests": "cr5db_headcountrequest",
  "cr5db_approvaldelegations": "cr5db_approvaldelegation",
  "cr5db_audittraillogs": "cr5db_audittraillog",
  "cr5db_approvalrouteses": "cr5db_approvalroutes",
  "cr5db_changerequestses": "cr5db_changerequests",
  "cr5db_roleassignments": "cr5db_roleassignment",
  "cr5db_systemroles": "cr5db_systemrole",
  "cr5db_taskownerships": "cr5db_taskownership",
  "cr5db_timesheetaudits": "cr5db_timesheetaudit",
  "new_processtemplatesteps": "new_processtemplatestep",
  "new_employeeprocesses": "new_employeeprocess",
  "new_processsteps": "new_processstep",
  "new_leavebalances": "new_leavebalance",
  "new_leaverequests": "new_leaverequest"
};

export async function runWebSeeding(progressCallback: (status: string) => void): Promise<void> {
  const guids: Record<string, any> = {};

  const tryCall = async (actionName: string, fn: () => Promise<any>) => {
    try {
      progressCallback(actionName);
      console.log(`[Seeding] ▶ Bắt đầu: ${actionName}`);
      const result = await fn();
      console.log(`[Seeding] ✅ Hoàn tất: ${actionName}`);
      return result;
    } catch (error: any) {
      const errMsg = error?.message || JSON.stringify(error);
      progressCallback(`❌ LỖI khi "${actionName}": ${errMsg}`);
      console.error(`[Seeding] ❌ Lỗi: ${actionName}`, error);
      return null;
    }
  };

  const logCreate = (entityName: string, res: any) => {
    if (res?.success === false) {
      const errDetail = res?.error?.message || res?.error?.code || JSON.stringify(res?.error);
      progressCallback(`  ⚠️ ${entityName}: Dataverse trả về success=false → ${errDetail}`);
      console.error(`[Seeding] ${entityName} create failed:`, res);
    } else if (res?.data) {
      const firstKey = Object.keys(res.data).find(k => k.endsWith('id') && k.startsWith('cr5db_'));
      const id = firstKey ? res.data[firstKey] : '(unknown)';
      console.log(`[Seeding] ${entityName} created OK, ID=${id}`);
    } else {
      progressCallback(`  ⚠️ ${entityName}: Response trống hoặc bất thường`);
      console.warn(`[Seeding] ${entityName} unexpected response:`, res);
    }
  };

  const safeCreate = async (entityName: string, serviceCreateFn: () => Promise<any>) => {
    try {
      const res = await serviceCreateFn();
      logCreate(entityName, res);
      return res?.data;
    } catch (err: any) {
      const errMsg = err?.message || JSON.stringify(err);
      progressCallback(`  ❌ LỖI tạo ${entityName}: ${errMsg}`);
      console.error(`[Seeding] ❌ Lỗi tạo ${entityName}:`, err);
      return null;
    }
  };

  const bindOData = (entitySet: string, id: string | undefined) => {
    if (!id) return undefined;
    return `${entitySet}(${id})`;
  };

  // 1. Companies
  await tryCall("Tạo thông tin Công ty...", async () => {
    guids["companies"] = [];
    const companies = [
      { cr5db_companycode: "VNX", cr5db_companyname: "VibePower Vietnam" },
      { cr5db_companycode: "GLB", cr5db_companyname: "VibePower Global" }
    ];
    for (const c of companies) {
      const data = await safeCreate(`Company[${c.cr5db_companycode}]`, () => Cr5db_companiesService.create(c as any));
      if (data?.cr5db_companyid) {
        guids["companies"].push(data.cr5db_companyid);
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
      const data = await safeCreate(`Label[${l.cr5db_systemlabel1}]`, () => Cr5db_systemlabelsService.create(l as any));
      if (data?.cr5db_systemlabelid) {
        guids["labels"].push({ name: l.cr5db_systemlabel1, id: data.cr5db_systemlabelid });
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
        "cr5db_CompanyID@odata.bind": bindOData("cr5db_companies", guids["companies"]?.[0])
      },
      {
        cr5db_departmentcode: "HRM",
        cr5db_departmentname: "Human Resources",
        "cr5db_CompanyID@odata.bind": bindOData("cr5db_companies", guids["companies"]?.[0])
      },
      {
        cr5db_departmentcode: "MKT",
        cr5db_departmentname: "Marketing",
        "cr5db_CompanyID@odata.bind": bindOData("cr5db_companies", guids["companies"]?.[1])
      }
    ];
    for (const d of depts) {
      const data = await safeCreate(`Department[${d.cr5db_departmentcode}]`, () => Cr5db_departmentsService.create(d as any));
      if (data?.cr5db_departmentid) {
        guids["departments"][d.cr5db_departmentcode] = data.cr5db_departmentid;
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
      const data = await safeCreate(`Catalog[${cat.cr5db_code}]`, () => Cr5db_positioncatalogsService.create(cat as any));
      if (data?.cr5db_positioncatalogid) {
        guids["catalog"][cat.cr5db_code] = data.cr5db_positioncatalogid;
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
        "cr5db_Department@odata.bind": bindOData("cr5db_departments", guids["departments"]?.["RND"]),
        "cr5db_PositionCatalogTitle@odata.bind": bindOData("cr5db_positioncatalogs", guids["catalog"]?.["DIR"])
      },
      {
        cr5db_positionname: "R&D Project Manager",
        cr5db_headcountquota: 2,
        "cr5db_Department@odata.bind": bindOData("cr5db_departments", guids["departments"]?.["RND"]),
        "cr5db_PositionCatalogTitle@odata.bind": bindOData("cr5db_positioncatalogs", guids["catalog"]?.["MGR"])
      },
      {
        cr5db_positionname: "Senior Software Engineer",
        cr5db_headcountquota: 5,
        "cr5db_Department@odata.bind": bindOData("cr5db_departments", guids["departments"]?.["RND"]),
        "cr5db_PositionCatalogTitle@odata.bind": bindOData("cr5db_positioncatalogs", guids["catalog"]?.["ENG"])
      },
      {
        cr5db_positionname: "HR Recruitment Specialist",
        cr5db_headcountquota: 2,
        "cr5db_Department@odata.bind": bindOData("cr5db_departments", guids["departments"]?.["HRM"]),
        "cr5db_PositionCatalogTitle@odata.bind": bindOData("cr5db_positioncatalogs", guids["catalog"]?.["HR"])
      }
    ];
    for (const pos of positions) {
      const data = await safeCreate(`JobPosition[${pos.cr5db_positionname}]`, () => Cr5db_jobpositionsService.create(pos as any));
      if (data?.cr5db_jobpositionid) {
        guids["jobpositions"].push(data.cr5db_jobpositionid);
      }
    }

    if (guids["jobpositions"] && guids["jobpositions"].length >= 2) {
      const dirId = guids["jobpositions"][0];
      const pmId = guids["jobpositions"][1];
      if (dirId && pmId) {
        try {
          console.log(`[Seeding] Linking R&D Project Manager reporting to Director of R&D`);
          await Cr5db_jobpositionsService.update(pmId, {
            "cr5db_ReportsToPositionID@odata.bind": bindOData("cr5db_jobpositions", dirId)
          } as any);
        } catch (hierarchyErr: any) {
          console.error(`[Seeding] Failed to link job position hierarchy:`, hierarchyErr);
        }
      }
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
        "cr5db_JobPosition@odata.bind": bindOData("cr5db_jobpositions", guids["jobpositions"]?.[0])
      },
      {
        cr5db_fullname: "Alice PM",
        cr5db_email: "pm@company.com",
        cr5db_isactive: true,
        cr5db_systemrole: "ProjectManager",
        "cr5db_JobPosition@odata.bind": bindOData("cr5db_jobpositions", guids["jobpositions"]?.[1])
      },
      {
        cr5db_fullname: "Bob Developer",
        cr5db_email: "dev1@company.com",
        cr5db_isactive: true,
        cr5db_systemrole: "Employee",
        "cr5db_JobPosition@odata.bind": bindOData("cr5db_jobpositions", guids["jobpositions"]?.[2])
      },
      {
        cr5db_fullname: "Charlie Developer",
        cr5db_email: "dev2@company.com",
        cr5db_isactive: true,
        cr5db_systemrole: "Employee",
        "cr5db_JobPosition@odata.bind": bindOData("cr5db_jobpositions", guids["jobpositions"]?.[2])
      }
    ];
    for (const u of users) {
      const data = await safeCreate(`User[${u.cr5db_fullname}]`, () => Cr5db_usersService.create(u as any));
      if (data?.cr5db_userid) {
        guids["users"][u.cr5db_email] = data.cr5db_userid;
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
    const data = await safeCreate('EvaluationPeriod[Q2/2026]', () => Cr5db_evaluationperiodsService.create(period as any));
    if (data?.cr5db_evaluationperiodid) {
      guids["periods"].push(data.cr5db_evaluationperiodid);
    }
  });

  // 8. Objectives
  await tryCall("Tạo mục tiêu chiến lược (Objectives)...", async () => {
    guids["objectives"] = [];
    const obj = {
      cr5db_objective1: "Đạt chất lượng phần mềm QLDA Q2/2026",
      cr5db_targetvalue: 100,
      cr5db_objectiveprogress: 0,
      "cr5db_PeriodName@odata.bind": bindOData("cr5db_evaluationperiods", guids["periods"]?.[0])
    };
    const data = await safeCreate('Objective', () => Cr5db_objectivesService.create(obj as any));
    if (data?.cr5db_objectiveid) {
      guids["objectives"].push(data.cr5db_objectiveid);
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
    const data = await safeCreate('Project[Traffic Analysis Engine]', () => Cr5db_projectsService.create(proj as any));
    if (data?.cr5db_projectid) {
      const projId = data.cr5db_projectid;

      // Labels Assignment
      if (guids["labels"] && guids["labels"].length > 0) {
        await safeCreate('ProjectLabelAssignment', () => Cr5db_projectlabelassignmentsService.create({
          cr5db_projectlabelassignment1: "Traffic Project - Urgent",
          "cr5db_LabelName@odata.bind": bindOData("cr5db_systemlabels", guids["labels"][0]?.id)
        } as any));
      }

      // Objective Alignment
      if (guids["objectives"] && guids["objectives"].length > 0) {
        await safeCreate('ProjectObjectiveAlignment', () => Cr5db_projectobjectivealignmentsService.create({
          cr5db_projectobjectivealignment1: "Traffic Objective Alignment",
          "cr5db_Project@odata.bind": bindOData("cr5db_projects", projId),
          "cr5db_Objective@odata.bind": bindOData("cr5db_objectives", guids["objectives"][0])
        } as any));
      }

      // Project Risks
      await safeCreate('ProjectRisk', () => Cr5db_projectrisksService.create({
        cr5db_projectrisk1: "Database scaling bottlenecks"
      } as any));

      // Project Phase
      const phaseData = await safeCreate('ProjectPhase[Phase 1]', () => Cr5db_projectphasesService.create({
        cr5db_phasename: "Phase 1: Database Setup & Integration",
        cr5db_startdate: "2026-04-06T00:00:00Z",
        cr5db_enddate: "2026-04-30T00:00:00Z",
        "cr5db_ProjectID@odata.bind": bindOData("cr5db_projects", projId)
      } as any));
      if (phaseData?.cr5db_projectphaseid) {
        guids["phase_id"] = phaseData.cr5db_projectphaseid;
      }

      // Project Team
      const teamData = await safeCreate('ProjectTeam', () => Cr5db_projectteamsService.create({
        cr5db_teamname: "Traffic Engine Dev Team",
        "cr5db_ProjectID@odata.bind": bindOData("cr5db_projects", projId)
      } as any));
      if (teamData?.cr5db_projectteamid) {
        const teamId = teamData.cr5db_projectteamid;

        for (const email of ["dev1@company.com", "dev2@company.com"]) {
          const uId = guids["users"][email];
          if (uId) {
            const allocData = await safeCreate(`ResourceAllocation[${email.split('@')[0]}]`, () => Cr5db_resourceallocationsService.create({
              cr5db_resourceallocation1: `Allocation for ${email.split('@')[0]}`,
              cr5db_allocationpercentage: email === "dev2@company.com" ? 150 : 100, // Charlie = 150% for overloaded demo
              "cr5db_UserID@odata.bind": bindOData("cr5db_users", uId),
              "cr5db_ProjectTeamID@odata.bind": bindOData("cr5db_projectteams", teamId)
            } as any));

            if (allocData?.cr5db_resourceallocationid) {
              const allocId = allocData.cr5db_resourceallocationid;
              const isLead = email === "dev1@company.com";
              await safeCreate(`UserProjectRole[${isLead ? 'Lead' : 'QA'}]`, () => Cr5db_userprojectrolesService.create({
                cr5db_rolename: isLead ? "Lead Developer" : "QA Tester",
                cr5db_rolecode: isLead ? "LD" : "QA",
                "cr5db_AllocationID@odata.bind": bindOData("cr5db_resourceallocations", allocId)
              } as any));
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
      const data = await safeCreate(`KPILibrary[${lib.cr5db_kpiname}]`, () => Cr5db_kpilibrariesService.create(lib as any));
      if (data?.cr5db_kpilibraryid) {
        guids["kpilibrary"].push(data.cr5db_kpilibraryid);
      }
    }
  });

  // 11. KPI Targets & Actuals
  await tryCall("Gán chỉ tiêu và ghi nhận thực tế KPI...", async () => {
    const bobId = guids["users"]["dev1@company.com"];
    const targetData = await safeCreate('KPITarget', () => Cr5db_kpitargetsService.create({
      cr5db_kpitarget1: "Hoàn thành Schema Q2",
      cr5db_targetvalue: 95,
      cr5db_actualvalue: 0,
      cr5db_weightpercentage: 50,
      "cr5db_EmployeeID@odata.bind": bindOData("cr5db_users", bobId),
      "cr5db_KPICode@odata.bind": bindOData("cr5db_kpilibraries", guids["kpilibrary"]?.[0]),
      "cr5db_ParentObjective@odata.bind": bindOData("cr5db_objectives", guids["objectives"]?.[0])
    } as any));

    if (targetData?.cr5db_kpitargetid) {
      const targetId = targetData.cr5db_kpitargetid;
      guids["kpitarget"] = targetId;

      await safeCreate('KPIActualLog', () => Cr5db_kpiactuallogsService.create({
        cr5db_kpiactuallog1: "Completed Phase 1 database definition schema review",
        cr5db_actualvalue: 90,
        cr5db_evidencelink: "https://github.com/violet/traffic-analysis-engine/pull/1",
        "cr5db_TargetId@odata.bind": bindOData("cr5db_kpitargets", targetId)
      } as any));
    }
  });

  // 12. Tasks, Comments & Timesheets
  await tryCall("Tạo công việc (Tasks), timesheets và bình luận...", async () => {
    const bobId = guids["users"]["dev1@company.com"];
    const taskData = await safeCreate('Task[Setup Dataverse schema]', () => Cr5db_tasksService.create({
      cr5db_taskname: "Thiết lập Schema Dataverse cho bảng ProjectRisk",
      cr5db_description: "Định nghĩa các cột, kiểu dữ liệu, các quan hệ khóa ngoại liên kết cho bảng Project Risk.",
      cr5db_duedate: "2026-05-30T17:00:00Z",
      "cr5db_AssigneeID@odata.bind": bindOData("cr5db_users", bobId),
      "cr5db_ObjectiveName@odata.bind": bindOData("cr5db_objectives", guids["objectives"]?.[0]),
      "cr5db_ProjectPhaseID@odata.bind": bindOData("cr5db_projectphases", guids["phase_id"])
    } as any));

    if (taskData?.cr5db_taskid) {
      const taskId = taskData.cr5db_taskid;

      await safeCreate('TaskComment', () => Cr5db_taskcommentsService.create({
        cr5db_taskcomment1: "Task Completed Comment",
        cr5db_commenttext: "Đã hoàn thành cấu hình Schema XML và định nghĩa Relationships. Đang đợi import.",
        "cr5db_TaskID@odata.bind": bindOData("cr5db_tasks", taskId)
      } as any));

      await safeCreate('TimesheetLog', () => Cr5db_timesheetlogsService.create({
        cr5db_timesheetlog1: "Log 8h RND setup",
        cr5db_actualhoursworked: 8,
        cr5db_logdate: "2026-05-29T00:00:00Z",
        statecode: 1, // Approved
        "cr5db_TaskID@odata.bind": bindOData("cr5db_tasks", taskId)
      } as any));
    }

    // Seed 5 active tasks for Charlie (Flight Risk/Workload Demo)
    const charlieId = guids["users"]["dev2@company.com"];
    for (let i = 1; i <= 5; i++) {
      await safeCreate(`Task[Charlie Active Task ${i}]`, () => Cr5db_tasksService.create({
        cr5db_taskname: `Nhiệm vụ chưa hoàn thành ${i} của Charlie`,
        cr5db_description: `Demo Overloaded: Đây là task đang active số ${i}`,
        cr5db_duedate: "2026-06-15T17:00:00Z",
        cr5db_status: "In Progress",
        "cr5db_AssigneeID@odata.bind": bindOData("cr5db_users", charlieId)
      } as any));
    }
  });

  // 13. Appraisals
  await tryCall("Tạo đánh giá hiệu suất (Performance Appraisals)...", async () => {
    const bobId = guids["users"]["dev1@company.com"];
    const appraisalData = await safeCreate('PerformanceAppraisal', () => Cr5db_performanceappraisalsService.create({
      cr5db_performanceappraisal1: "Đánh giá hiệu suất Bob Q2/2026",
      cr5db_selfscore: 90,
      cr5db_finalscore: 95,
      "cr5db_EmployeeID@odata.bind": bindOData("cr5db_users", bobId),
      "cr5db_PeriodID@odata.bind": bindOData("cr5db_evaluationperiods", guids["periods"]?.[0])
    } as any));

    if (appraisalData?.cr5db_performanceappraisalid && guids["kpitarget"]) {
      const appraisalId = appraisalData.cr5db_performanceappraisalid;
      await safeCreate('AppraisalKPIDetails', () => Cr5db_appraisalkpidetailsService.create({
        cr5db_appraisalkpidetail1: "Chi tiết KPI Target Schema",
        cr5db_scoreachieved: 95,
        cr5db_comment: "Nhân sự hoàn thành xuất sắc nhiệm vụ và đóng góp tích cực vào tiến trình thiết lập hệ thống.",
        "cr5db_AppraisalName@odata.bind": bindOData("cr5db_performanceappraisals", appraisalId),
        "cr5db_TargetId@odata.bind": bindOData("cr5db_kpitargets", guids["kpitarget"])
      } as any));
    }

    // Seed low appraisal for Charlie (Flight Risk Demo)
    const charlieId = guids["users"]["dev2@company.com"];
    await safeCreate('PerformanceAppraisal[Charlie]', () => Cr5db_performanceappraisalsService.create({
      cr5db_performanceappraisal1: "Đánh giá hiệu suất Charlie Q2/2026",
      cr5db_selfscore: 70,
      cr5db_finalscore: 55, // Low score < 60
      "cr5db_EmployeeID@odata.bind": bindOData("cr5db_users", charlieId),
      "cr5db_PeriodID@odata.bind": bindOData("cr5db_evaluationperiods", guids["periods"]?.[0])
    } as any));
  });

  // 13.5. Leave Requests
  await tryCall("Tạo dữ liệu Nghỉ phép (Leave Requests)...", async () => {
    // Seed 2 Sick Leaves for Charlie (Flight Risk Demo)
    const charlieId = guids["users"]["dev2@company.com"];
    for (let i = 1; i <= 2; i++) {
      await safeCreate(`LeaveRequest[Sick Leave ${i} Charlie]`, () => New_leaverequestService.create({
        new_leaverequest1: `Nghỉ ốm lần ${i}`,
        new_leavetype: "Sick Leave",
        new_status: "Approved",
        "new_EmployeeID@odata.bind": bindOData("cr5db_users", charlieId)
      } as any));
    }
  });

  // 14. System Configuration & Extras
  await tryCall("Cấu hình chính sách, headcount và các cấu hình phụ trợ...", async () => {
    // Headcount Request
    await safeCreate('HeadcountRequest', () => Cr5db_headcountrequestsService.create({
      cr5db_requestname: "Yêu cầu tăng định biên R&D Devs",
      cr5db_requestedquantity: 2,
      cr5db_reason: "Tăng trưởng dự án Traffic Engine đòi hỏi thêm 2 Backend Engineers cho các module AI.",
      cr5db_approvalstatus: 122650000,
      cr5db_requesttype: 122650000,
      "cr5db_Department@odata.bind": bindOData("cr5db_departments", guids["departments"]?.["RND"]),
      "cr5db_JobPosition@odata.bind": bindOData("cr5db_jobpositions", guids["jobpositions"]?.[2]),
      "cr5db_PositionCatalog@odata.bind": bindOData("cr5db_positioncatalogs", guids["catalog"]?.["ENG"])
    } as any));

    // System Notification
    await safeCreate('SystemNotification', () => Cr5db_systemnotificationsService.create({
      cr5db_systemnotification1: "Duyệt công mới",
      cr5db_content: "Bạn có 1 yêu cầu duyệt Timesheet mới từ Bob Developer.",
      cr5db_deeplinkurl: "/requests",
      cr5db_isread: false
    } as any));

    // System Parameter
    await safeCreate('SystemParameter[MaxTimesheetHours]', () => Cr5db_systemparametersService.create({
      cr5db_systemparameter1: "MaxTimesheetHoursPerDay",
      cr5db_paramvalue: "24",
      cr5db_valuetype: "Integer"
    } as any));

    const groups = [
      { cr5db_systemparameter1: "pg_admin", cr5db_paramvalue: "Ban Giám Đốc|abcdefghijklm", cr5db_valuetype: "PermissionGroup" },
      { cr5db_systemparameter1: "pg_pm", cr5db_paramvalue: "Quản Lý Dự Án|abcdefjkl", cr5db_valuetype: "PermissionGroup" },
      { cr5db_systemparameter1: "pg_employee", cr5db_paramvalue: "Nhân Viên R&D|abcdf", cr5db_valuetype: "PermissionGroup" }
    ];
    for (const g of groups) {
      await safeCreate(`PermissionGroup[${g.cr5db_systemparameter1}]`, () => Cr5db_systemparametersService.create(g as any));
    }

    await safeCreate('SystemParameter[DefaultPermissionGroups]', () => Cr5db_systemparametersService.create({
      cr5db_systemparameter1: "DefaultPermissionGroups",
      cr5db_paramvalue: "pg_employee",
      cr5db_valuetype: "DefaultPermissionGroups"
    } as any));

    await safeCreate('SystemPolicyRule', () => Cr5db_systempolicyrulesService.create({
      cr5db_systempolicyrule1: "Timesheet Submission Deadline Policy",
      cr5db_targetentity: "cr5db_timesheetlog",
      cr5db_contextcondition: "SubmittedDate > Sunday 23:59",
      cr5db_operator: "Block",
      cr5db_constraintvalue: "Block Submission",
      cr5db_effect: "Error"
    } as any));
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
        cr5db_isactive: true
      },
      {
        cr5db_routename: "Duyệt thay đổi vị trí công việc",
        cr5db_targetentity: 3, // JobPositions
        cr5db_operationtype: 4, // All
        cr5db_requesterrole: 3, // HRManager
        cr5db_routingtype: 2, // SPECIFIC_ROLE
        cr5db_approverrole: "pg_admin", // Ban Giám Đốc
        cr5db_priority: 1,
        cr5db_isactive: true
      }
    ];
    for (const r of routes) {
      await safeCreate(`ApprovalRoute[${r.cr5db_routename}]`, () => Cr5db_approvalroutesesService.create(r as any));
    }
  });

  // 16. Onboarding/Offboarding Templates
  await tryCall("Tạo mẫu quy trình (Process Templates)...", async () => {
    guids["templates"] = {};
    
    // Onboarding Template
    const onboardingTpl = await safeCreate('ProcessTemplate[Onboarding Chuẩn]', () => New_processtemplateService.create({
      new_name: "Quy trình Onboarding Tiêu chuẩn",
      new_type: "Onboarding"
    } as any));

    if (onboardingTpl?.new_processtemplateid) {
      const tplId = onboardingTpl.new_processtemplateid;
      guids["templates"]["Onboarding"] = tplId;

      const itDeptId = guids["depts"] && guids["depts"]["IT"];
      const hrDeptId = guids["depts"] && guids["depts"]["HR"];

      const steps = [
        { new_name: "Chuẩn bị chỗ ngồi & Thiết bị", new_order: 1, ...(itDeptId ? { "new_AssignedDepartmentId@odata.bind": bindOData("cr5db_departmentses", itDeptId) } : { new_assigneerole: "IT" }) },
        { new_name: "Ký Hợp đồng thử việc", new_order: 2, ...(hrDeptId ? { "new_AssignedDepartmentId@odata.bind": bindOData("cr5db_departmentses", hrDeptId) } : { new_assigneerole: "HR" }) },
        { new_name: "Đào tạo hội nhập văn hóa", new_order: 3, ...(hrDeptId ? { "new_AssignedDepartmentId@odata.bind": bindOData("cr5db_departmentses", hrDeptId) } : { new_assigneerole: "HR" }) },
        { new_name: "Giới thiệu đội nhóm", new_assigneerole: "Manager", new_order: 4 },
        { new_name: "Hoàn tất hồ sơ cá nhân", new_assigneerole: "Employee", new_order: 5 }
      ];

      for (const step of steps) {
        await safeCreate(`TemplateStep[${step.new_name}]`, () => New_processtemplatestepService.create({
          ...step,
          "new_ProcessTemplate@odata.bind": bindOData("new_processtemplate", tplId)
        } as any));
      }
    }

    // Offboarding Template
    const offboardingTpl = await safeCreate('ProcessTemplate[Offboarding Chuẩn]', () => New_processtemplateService.create({
      new_name: "Quy trình Offboarding Tiêu chuẩn",
      new_type: "Offboarding"
    } as any));

    if (offboardingTpl?.new_processtemplateid) {
      const tplId = offboardingTpl.new_processtemplateid;
      guids["templates"]["Offboarding"] = tplId;

      const itDeptId = guids["depts"] && guids["depts"]["IT"];
      const hrDeptId = guids["depts"] && guids["depts"]["HR"];

      const steps = [
        { new_name: "Bàn giao công việc & Tài liệu", new_assigneerole: "Employee", new_order: 1 },
        { new_name: "Thu hồi thiết bị & Thẻ từ", new_order: 2, ...(itDeptId ? { "new_AssignedDepartmentId@odata.bind": bindOData("cr5db_departmentses", itDeptId) } : { new_assigneerole: "IT" }) },
        { new_name: "Khóa quyền truy cập hệ thống", new_order: 3, ...(itDeptId ? { "new_AssignedDepartmentId@odata.bind": bindOData("cr5db_departmentses", itDeptId) } : { new_assigneerole: "IT" }) },
        { new_name: "Thanh toán & Chốt lương", new_order: 4, ...(hrDeptId ? { "new_AssignedDepartmentId@odata.bind": bindOData("cr5db_departmentses", hrDeptId) } : { new_assigneerole: "HR" }) },
        { new_name: "Exit Interview (Phỏng vấn thôi việc)", new_order: 5, ...(hrDeptId ? { "new_AssignedDepartmentId@odata.bind": bindOData("cr5db_departmentses", hrDeptId) } : { new_assigneerole: "HR" }) }
      ];

      for (const step of steps) {
        await safeCreate(`TemplateStep[${step.new_name}]`, () => New_processtemplatestepService.create({
          ...step,
          "new_ProcessTemplate@odata.bind": bindOData("new_processtemplate", tplId)
        } as any));
      }
    }
  });

  progressCallback("Hoàn tất Seeding thành công!");
  // 15. Leave Management (PTO & Requests)
  await tryCall("Tạo Quỹ phép (PTO) và đơn xin nghỉ...", async () => {
    const userEmails = Object.keys(guids["users"]);
    for (const email of userEmails) {
      const uId = guids["users"][email];
      
      // Tạo Quỹ phép 12 ngày cho mỗi user
      await safeCreate(`LeaveBalance[${email}]`, () => New_leavebalanceService.create({
        new_name: `Quỹ phép 2026 - ${email.split('@')[0]}`,
        new_year: 2026,
        new_totalentitlement: 12.0,
        new_carriedover: 2.0,
        new_useddays: 0,
        "_new_employeeid_value@odata.bind": bindOData("cr5db_users", uId)
      } as any));

      // Tạo một đơn nghỉ phép mẫu cho dev1
      if (email === "dev1@company.com") {
        await safeCreate('LeaveRequest[SickLeave]', () => New_leaverequestService.create({
          new_name: "Nghỉ ốm 1 ngày",
          new_leavetype: "Sick Leave",
          new_startdate: "2026-06-05T00:00:00Z",
          new_enddate: "2026-06-05T23:59:59Z",
          new_durationdays: 1.0,
          new_reason: "Cảm cúm nặng",
          new_status: "Pending",
          "_new_employeeid_value@odata.bind": bindOData("cr5db_users", uId)
        } as any));
      }
    }
  });

  // 16. Holidays & Overtime
  await tryCall("Tạo dữ liệu ngày Lễ và Làm thêm giờ (OT)...", async () => {
    // Tạo Ngày Lễ 2026
    const holidays = [
      { cr5db_name: "Tết Dương Lịch 2026", cr5db_date: "2026-01-01T00:00:00Z" },
      { cr5db_name: "Giỗ tổ Hùng Vương 2026", cr5db_date: "2026-04-26T00:00:00Z" }, // Mùng 10/3 AL
      { cr5db_name: "Nghỉ bù Giỗ tổ", cr5db_date: "2026-04-27T00:00:00Z" }, // Bù
      { cr5db_name: "Ngày Giải phóng miền Nam", cr5db_date: "2026-04-30T00:00:00Z" },
      { cr5db_name: "Quốc tế Lao động", cr5db_date: "2026-05-01T00:00:00Z" }
    ];

    for (const h of holidays) {
      await safeCreate(`Holiday[${h.cr5db_name}]`, () => New_holidayService.create(h as any));
    }

    // Tạo OT mẫu cho dev1
    const bobId = guids["users"]["dev1@company.com"];
    if (bobId) {
      await safeCreate('OvertimeRequest[Weekend]', () => New_overtimerequestService.create({
        new_name: "Làm thêm giờ fix lỗi Server T7",
        new_date: "2026-05-30T00:00:00Z", // T7
        new_starttime: "08:00",
        new_endtime: "12:00",
        new_hours: 4.0,
        new_ottype: "Weekend",
        new_reason: "Xử lý sự cố server khẩn cấp",
        new_status: "Pending",
        "_new_employeeid_value@odata.bind": bindOData("cr5db_users", bobId)
      } as any));
    }
  });

}

export async function runWebCleanup(progressCallback: (status: string) => void): Promise<void> {
  const tryDeleteAll = async (tableName: string, service: any) => {
    try {
      progressCallback(`Đang dọn dẹp bảng ${tableName}...`);
      const res = await service.getAll({ maxPageSize: 5000 });
      console.log(`[CleanData] Bảng ${tableName}, Raw Response:`, res);

      const records = res?.data || [];
      if (records.length === 0) {
        progressCallback(`Bảng ${tableName} không có dữ liệu cần dọn dẹp.`);
        return;
      }
      
      const firstRec = records[0];
      const singularName = PLURAL_TO_SINGULAR[tableName] || tableName;
      let idField = `${singularName}id`;
      if (!(idField in firstRec)) {
        const keys = Object.keys(firstRec).filter(k => k.startsWith('cr5db_') && k.endsWith('id') && !k.includes('@'));
        idField = keys.sort((a,b) => a.length - b.length)[0];
      }

      console.log(`[CleanData] Bảng ${tableName}, field khóa chính xác định được: ${idField}`);
      
      progressCallback(`Tìm thấy ${records.length} bản ghi trong ${tableName}. Đang tiến hành xóa...`);
      let deletedCount = 0;
      for (const rec of records) {
        const id = idField ? rec[idField] : undefined;
        if (id) {
          try {
            console.log(`[CleanData] Đang xóa ID: ${id} trong bảng ${tableName}`);
            await service.delete(id);
            deletedCount++;
          } catch (delErr: any) {
            const errMsg = delErr?.message || JSON.stringify(delErr);
            progressCallback(`⚠️ Lỗi xóa dòng ${id} trong ${tableName}: ${errMsg}`);
            console.error(`Error deleting ${id} in ${tableName}:`, delErr);
          }
        } else {
          console.warn(`[CleanData] Bản ghi trong ${tableName} không có field ${idField}`, rec);
        }
      }
      progressCallback(`Đã xóa thành công ${deletedCount}/${records.length} bản ghi trong ${tableName}.`);
    } catch (error: any) {
      const errMsg = error?.message || JSON.stringify(error);
      progressCallback(`❌ Lỗi truy vấn bảng ${tableName}: ${errMsg}`);
      console.error(`[Cleanup Warning] Failed during clean up of "${tableName}":`, error);
    }
  };

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

  try {
    progressCallback("Đang dọn dẹp các Cấu hình & Nhóm quyền...");
    const res = await Cr5db_systemparametersService.getAll({
      maxPageSize: 5000,
      select: ['cr5db_systemparameterid', 'cr5db_systemparameter1']
    });
    const params = res?.data || [];
    let count = 0;
    for (const p of params) {
      const name = p.cr5db_systemparameter1 || '';
      if (name.startsWith('pg_') || name === 'DefaultPermissionGroups' || name === 'MaxTimesheetHoursPerDay') {
        if (p.cr5db_systemparameterid) {
          try {
            await Cr5db_systemparametersService.delete(p.cr5db_systemparameterid);
            count++;
          } catch (paramErr: any) {
            progressCallback(`⚠️ Lỗi xóa tham số ${name}: ${paramErr?.message || JSON.stringify(paramErr)}`);
          }
        }
      }
    }
    progressCallback(`Đã dọn dẹp xong ${count} tham số hệ thống.`);
  } catch (err: any) {
    progressCallback(`❌ Lỗi truy vấn bảng systemparameters: ${err?.message || JSON.stringify(err)}`);
  }

  await tryDeleteAll("cr5db_systempolicyrules", Cr5db_systempolicyrulesService);
  await tryDeleteAll("cr5db_headcountrequests", Cr5db_headcountrequestsService);
  await tryDeleteAll("cr5db_approvaldelegations", Cr5db_approvaldelegationsService);
  await tryDeleteAll("cr5db_audittraillogs", Cr5db_audittraillogsService);
  await tryDeleteAll("cr5db_approvalrouteses", Cr5db_approvalroutesesService);
  await tryDeleteAll("cr5db_changerequestses", Cr5db_changerequestsesService);

  await tryDeleteAll("new_employeeprocess", New_employeeprocessService);
  await tryDeleteAll("new_processtemplatestep", New_processtemplatestepService);
  await tryDeleteAll("new_processtemplate", New_processtemplateService);
  await tryDeleteAll("new_leaverequest", New_leaverequestService);
  await tryDeleteAll("new_leavebalance", New_leavebalanceService);
  await tryDeleteAll("new_processstep", New_processstepService);
  await tryDeleteAll("new_employeeprocess", New_employeeprocessService);
  await tryDeleteAll("cr5db_holiday", New_holidayService);
  await tryDeleteAll("new_overtimerequest", New_overtimerequestService);

  progressCallback("Dọn dẹp hoàn tất thành công!");
}