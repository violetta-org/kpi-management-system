import { useEffect } from 'react';
import { getContext } from '@microsoft/power-apps/app';
import { Cr5db_usersService } from '../generated/services/Cr5db_usersService';
import { Cr5db_tasksService } from '../generated/services/Cr5db_tasksService';
import { Cr5db_headcountrequestsService } from '../generated/services/Cr5db_headcountrequestsService';
import { Cr5db_kpitargetsService } from '../generated/services/Cr5db_kpitargetsService';
import { Cr5db_departmentsService } from '../generated/services/Cr5db_departmentsService';
import { Cr5db_timesheetlogsService } from '../generated/services/Cr5db_timesheetlogsService';
import { Cr5db_projectsService } from '../generated/services/Cr5db_projectsService';
import { Cr5db_performanceappraisalsService } from '../generated/services/Cr5db_performanceappraisalsService';
import { Cr5db_companiesService } from '../generated/services/Cr5db_companiesService';
import { Cr5db_positioncatalogsService } from '../generated/services/Cr5db_positioncatalogsService';
import { Cr5db_jobpositionsService } from '../generated/services/Cr5db_jobpositionsService';
import { Cr5db_audittraillogsService } from '../generated/services/Cr5db_audittraillogsService';
import { Cr5db_projectphasesService } from '../generated/services/Cr5db_projectphasesService';
import { Cr5db_projectrisksService } from '../generated/services/Cr5db_projectrisksService';
import { Cr5db_kpilibrariesService } from '../generated/services/Cr5db_kpilibrariesService';
import { Cr5db_objectivesService } from '../generated/services/Cr5db_objectivesService';
import { Cr5db_resourceallocationsService } from '../generated/services/Cr5db_resourceallocationsService';
import { Cr5db_systemnotificationsService } from '../generated/services/Cr5db_systemnotificationsService';
import { Cr5db_approvalroutesesService } from '../generated/services/Cr5db_approvalroutesesService';
import { Cr5db_changerequestsesService } from '../generated/services/Cr5db_changerequestsesService';
import { Cr5db_systemparametersService } from '../generated/services/Cr5db_systemparametersService';
import { Cr5db_evaluationperiodsService } from '../generated/services/Cr5db_evaluationperiodsService';
import { Cr5db_projectteamsService } from '../generated/services/Cr5db_projectteamsService';
import { New_bonusmatrixService } from '../generated/services/New_bonusmatrixService';
import { New_competencycatalogService } from '../generated/services/New_competencycatalogService';
import { New_jobcompetencyService } from '../generated/services/New_jobcompetencyService';
import { New_competencyassessmentService } from '../generated/services/New_competencyassessmentService';
import { New_idpService } from '../generated/services/New_idpService';
import { New_idpactionService } from '../generated/services/New_idpactionService';
import { New_processtemplateService } from '../generated/services/New_processtemplateService';
import { New_processtemplatestepService } from '../generated/services/New_processtemplatestepService';
import { New_leavebalanceService } from '../generated/services/New_leavebalanceService';
import { New_leaverequestService } from '../generated/services/New_leaverequestService';
import { New_employeeprocessService } from '../generated/services/New_employeeprocessService';
import { New_processstepService } from '../generated/services/New_processstepService';
import { Cr5db_holidaiesService } from '../generated/services/Cr5db_holidaiesService';
import { Cr5db_overtimerequestService } from '../generated/services/Cr5db_overtimerequestService';
import type { User, Task, HeadcountRequest, KPITarget, PermissionGroup, EvaluationPeriod, BonusMatrix, Holiday, OvertimeRequest } from '../lib/types';

/** All setters useLiveData needs to push fetched data into shared state */
export interface LiveDataSetters {
  setIsLoading: (v: boolean) => void;
  setErrorMsg: (v: string | null) => void;
  setCurrentUserEmail: (v: string) => void;
  setCurrentUserName: (v: string) => void;
  setActiveRole: (v: any) => void;
  setUsersList: (v: User[]) => void;
  setDepartmentsList: (v: any[]) => void;
  setCompaniesList: (v: any[]) => void;
  setPositionCatalogList: (v: any[]) => void;
  setJobPositionsList: (v: any[]) => void;
  setAuditLogsList: (v: any[]) => void;
  setResourceAllocationsList: (v: any[]) => void;
  setObjectivesList: (v: any[]) => void;
  setProjects: (v: any[]) => void;
  setProjectPhases: (v: any[]) => void;
  setProjectRisks: (v: any[]) => void;
  setSystemNotifications: (v: any[]) => void;

  setKpiLibrariesList: (v: any[]) => void;
  setApprovalRoutesList: (v: any[]) => void;
  setChangeRequestsList: (v: any[]) => void;
  setProjectTeamsList: (v: any[]) => void;
  setTasks: (v: Task[]) => void;
  setHeadcountRequests: (v: HeadcountRequest[]) => void;
  setKpiTargets: (v: KPITarget[]) => void;
  setTimesheets: (v: any[]) => void;
  setAppraisals: (v: any[]) => void;
  setEvaluationPeriodsList: (v: EvaluationPeriod[]) => void;
  setPermissionGroups: (v: PermissionGroup[]) => void;
  setBonusMatrixList: (v: BonusMatrix[]) => void;
  setCompetencyCatalogList: (v: any[]) => void;
  setJobCompetenciesList: (v: any[]) => void;
  setCompetencyAssessmentsList: (v: any[]) => void;
  setIdpList: (v: any[]) => void;
  setIdpActionList: (v: any[]) => void;
  setProcessTemplateList: (v: any[]) => void;
  setProcessTemplateStepList: (v: any[]) => void;
  setEmployeeProcessList: (v: any[]) => void;
  setProcessStepList: (v: any[]) => void;
  setLeaveBalancesList: (v: any[]) => void;
  setLeaveRequestsList: (v: any[]) => void;
  setHolidaysList: (v: Holiday[]) => void;
  setOvertimeRequestsList: (v: OvertimeRequest[]) => void;
  setDefaultGroups: (v: string) => void;
  setDefaultGroupsDbId: (v: string) => void;
  // Default select setters populated on first load
  setNewReqDeptId: (v: string) => void;
  setNewJobPosDeptId: (v: string) => void;
  
  setAssignRoleUserId: (v: string) => void;
  setNewReqCatalogId: (v: string) => void;
  setNewJobPosCatalogId: (v: string) => void;
  setSelectedDeptCompanyId: (v: string) => void;
  
}

/**
 * Fetches all Dataverse tables in parallel, maps raw records to typed
 * domain objects, and pushes them into the shared App state.
 * Returns a `fetchLiveValues` function you can call to refresh.
 */
export function useLiveData(setters: LiveDataSetters) {
  const fetchLiveValues = async () => {
    try {
      setters.setIsLoading(true);
      setters.setErrorMsg(null);

      // 1. Fetch current user context
      let authenticatedEmail = '';
      let authenticatedName = '';
      
      const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const forceMock = sessionStorage.getItem('devForceMockContext') === 'true' || isLocalHost;

      if (forceMock) {
        console.log('[Dev] Running in offline dev/mock mode.');
        authenticatedEmail = sessionStorage.getItem('devUserEmail') || 'admin@company.com';
        authenticatedName = sessionStorage.getItem('devUserName') || 'Violetta Admin';
      } else {
        try {
          const context = await getContext();
          authenticatedEmail = context.user.userPrincipalName || '';
          authenticatedName = context.user.fullName || '';
        } catch (err) {
          console.error('SDK getContext failed: ', err);
          throw new Error('Ứng dụng chỉ hoạt động trong Power Apps Host. Vui lòng mở từ Power Apps Portal hoặc link Local Play.');
        }
      }

      if (!authenticatedEmail) {
        throw new Error('Không xác thực được danh tính người dùng (thiếu email trong context).');
      }

      setters.setCurrentUserEmail(authenticatedEmail);
      setters.setCurrentUserName(authenticatedName || authenticatedEmail.split('@')[0]);

      // 2. Fetch all tables in parallel (isolated — one failure won't block others)
      const loadErrors: { table: string; error: string }[] = [];
      const safeGet = async <T,>(tableName: string, fn: () => Promise<{ data?: T[] }>): Promise<T[]> => {
        try {
          const res = await fn();
          return res.data || [];
        } catch (e: any) {
          const errMsg = e?.message || e?.error?.message || (typeof e === 'object' ? JSON.stringify(e) : String(e));
          console.error("🔴🔴🔴 [DATAVERSE LOAD ERROR] 🔴🔴🔴\n" +
                        `Table: ${tableName}\n` +
                        `Error Message: ${errMsg}\n` +
                        "Full Error Object:", e);
          loadErrors.push({ table: tableName, error: errMsg });
          return [];
        }
      };

      const [
        allUsers,
        allDepts,
        rawTasks,
        rawHeadcount,
        rawKpi,
        rawTimesheets,
        rawProjects,
        rawAppraisals,
        allCompanies,
        allCatalogs,
        allJobPositions,
        allAuditLogs,
        rawAllocations,
        rawObjectives,
        rawNotifications,
        rawProjectPhases,
        rawProjectRisks,
        rawKpiLibraries,
        rawRoutes,
        rawRequests,
        rawParams,
        rawEvaluationPeriods,
        rawProjectTeams,
        rawBonusMatrix,
        rawCompetencyCatalogs,
        rawJobCompetencies,
        rawCompetencyAssessments,
        rawIdps,
        rawIdpActions,
        rawProcessTemplates,
        rawProcessTemplateSteps,
        rawEmployeeProcesses,
        rawProcessSteps,
        rawLeaveBalances,
        rawLeaveRequests,
        rawHolidays,
        rawOvertimeRequests
      ] = await Promise.all([
        safeGet<User>('Users', Cr5db_usersService.getAll),
        safeGet('Departments', Cr5db_departmentsService.getAll),
        safeGet('Tasks', Cr5db_tasksService.getAll),
        safeGet('Headcount Requests', Cr5db_headcountrequestsService.getAll),
        safeGet('KPI Targets', Cr5db_kpitargetsService.getAll),
        safeGet('Timesheet Logs', Cr5db_timesheetlogsService.getAll),
        safeGet('Projects', Cr5db_projectsService.getAll),
        safeGet('Performance Appraisals', Cr5db_performanceappraisalsService.getAll),
        safeGet('Companies', Cr5db_companiesService.getAll),
        safeGet('Position Catalogs', Cr5db_positioncatalogsService.getAll),
        safeGet('Job Positions', Cr5db_jobpositionsService.getAll),
        safeGet('Audit Trail Logs', Cr5db_audittraillogsService.getAll),
        safeGet('Resource Allocations', Cr5db_resourceallocationsService.getAll),
        safeGet('Objectives', Cr5db_objectivesService.getAll),
        safeGet('System Notifications', Cr5db_systemnotificationsService.getAll),
        safeGet('Project Phases', Cr5db_projectphasesService.getAll),
        safeGet('Project Risks', Cr5db_projectrisksService.getAll),
        safeGet('KPI Libraries', Cr5db_kpilibrariesService.getAll),
        safeGet('Approval Routes', Cr5db_approvalroutesesService.getAll),
        safeGet('Change Requests', Cr5db_changerequestsesService.getAll),
        safeGet('System Parameters', Cr5db_systemparametersService.getAll),
        safeGet('Evaluation Periods', Cr5db_evaluationperiodsService.getAll),
        safeGet('Project Teams', Cr5db_projectteamsService.getAll),
        safeGet<BonusMatrix>('Bonus Matrix', New_bonusmatrixService.getAll),
        safeGet('Competency Catalog', New_competencycatalogService.getAll),
        safeGet('Job Competencies', New_jobcompetencyService.getAll),
        safeGet('Competency Assessments', New_competencyassessmentService.getAll),
        safeGet('IDPs', New_idpService.getAll),
        safeGet('IDP Actions', New_idpactionService.getAll),
        safeGet('Process Templates', New_processtemplateService.getAll),
        safeGet('Process Template Steps', New_processtemplatestepService.getAll),
        safeGet('Employee Processes', New_employeeprocessService.getAll),
        safeGet('Process Steps', New_processstepService.getAll),
        safeGet('Leave Balances', New_leavebalanceService.getAll),
        safeGet('Leave Requests', New_leaverequestService.getAll),
        safeGet('Holidays', Cr5db_holidaiesService.getAll),
        safeGet('Overtime Requests', Cr5db_overtimerequestService.getAll)
      ]);

      if (loadErrors.length > 0) {
        console.error('[Dataverse Load Summary] Failed tables:', loadErrors);
        const errDetails = loadErrors.map(err => `- Bảng ${err.table}: ${err.error}`).join('\n');
        alert(`Không thể tải một số bảng dữ liệu từ Dataverse:\n${errDetails}`);
      }

      console.log('[Dataverse Load Summary] Fetched record counts:', {
        Users: allUsers.length,
        Departments: allDepts.length,
        Tasks: rawTasks.length,
        HeadcountRequests: rawHeadcount.length,
        KPITargets: rawKpi.length,
        TimesheetLogs: rawTimesheets.length,
        Projects: rawProjects.length,
        Appraisals: rawAppraisals.length,
        Companies: allCompanies.length,
        PositionCatalogs: allCatalogs.length,
        JobPositions: allJobPositions.length,
        AuditLogs: allAuditLogs.length,
        ResourceAllocations: rawAllocations.length,
        Objectives: rawObjectives.length,
        Notifications: rawNotifications.length,
        ProjectPhases: rawProjectPhases.length,
        ProjectRisks: rawProjectRisks.length,
        KPILibraries: rawKpiLibraries.length,
        ApprovalRoutes: rawRoutes.length,
        ChangeRequests: rawRequests.length,
        SystemParameters: rawParams.length,
        EvaluationPeriods: rawEvaluationPeriods.length,
        Holidays: rawHolidays.length,
        LeaveBalances: rawLeaveBalances.length,
        LeaveRequests: rawLeaveRequests.length,
        OvertimeRequests: rawOvertimeRequests.length,
        LoadErrors: loadErrors.length
      });
      // Log first raw risk record if any to debug field names
      if (rawProjectRisks.length > 0) {
        console.log('[Dataverse] First rawProjectRisk sample:', JSON.stringify(rawProjectRisks[0], null, 2));
      }

      const parsedGroups: PermissionGroup[] = [];
      let defaultGroupsStr = '';

      rawParams.forEach((param: any) => {
        const paramName = param.cr5db_systemparameter1 || '';
        if (paramName.startsWith('pg_')) {
          const val = param.cr5db_paramvalue || '';
          let name = paramName;
          let tabs: string[] = [];
          if (val.includes('|')) {
            const idx = val.indexOf('|');
            name = val.substring(0, idx);
            const codes = val.substring(idx + 1);
            const REVERSE_MAP: Record<string, string> = {
              a: 'dashboard', b: 'tasks', c: 'timesheets', d: 'kpi', f: 'performance',
              g: 'companies', h: 'positions', i: 'headcount', e: 'requests',
              j: 'directory', k: 'resources', l: 'routes', m: 'kpi-catalog'
            };
            tabs = codes.split('').map((c: string) => REVERSE_MAP[c]).filter(Boolean);
          } else {
            try {
              const parsed = JSON.parse(val || '{}');
              name = parsed.name || paramName;
              tabs = parsed.tabs || [];
            } catch (e) {
              name = val || paramName;
            }
          }
          parsedGroups.push({
            id: paramName,
            name,
            tabs,
            dbId: param.cr5db_systemparameterid
          });
        } else if (paramName === 'DefaultPermissionGroups') {
          defaultGroupsStr = param.cr5db_paramvalue || '';
          setters.setDefaultGroupsDbId(param.cr5db_systemparameterid);
        }
      });

      setters.setPermissionGroups(parsedGroups);
      setters.setDefaultGroups(defaultGroupsStr);

      // Map job position names onto user records
      allUsers.forEach((u: any) => {
        if (u._cr5db_jobposition_value) {
          const matchedPos = allJobPositions.find((p: any) => p.cr5db_jobpositionid === u._cr5db_jobposition_value);
          if (matchedPos) u.cr5db_jobpositionname = matchedPos.cr5db_positionname;
        }
      });

      // Wrap for downstream compatibility
      const tasksResponse = { data: rawTasks };
      const headcountResponse = { data: rawHeadcount };
      const kpiResponse = { data: rawKpi };
      const timesheetsResponse = { data: rawTimesheets };
      const appraisalsResponse = { data: rawAppraisals };

      // Map user names and project team names onto resource allocations
      const mappedAllocations = rawAllocations.map((a: any) => {
        const userId = a._cr5db_userid_value || (a.cr5db_userid as any)?.cr5db_userid || '';
        const matchedUser = allUsers.find((u: User) => u.cr5db_userid === userId);
        
        const teamId = a._cr5db_projectteamid_value || (a.cr5db_projectteamid as any)?.cr5db_projectteamid || '';
        const matchedTeam = rawProjectTeams.find((t: any) => t.cr5db_projectteamid === teamId);
        const projectId = matchedTeam?._cr5db_projectid_value || '';
        
        return {
          ...a,
          cr5db_useridname: matchedUser?.cr5db_fullname || a.cr5db_useridname || 'Thành viên chưa rõ',
          cr5db_projectteamidname: matchedTeam?.cr5db_teamname || a.cr5db_projectteamidname || 'Dự án khác / Không thuộc dự án',
          cr5db_projectid: projectId
        };
      });

      // Map evaluation periods names onto objectives
      const mappedObjectives = rawObjectives.map((obj: any) => {
        const periodId = obj._cr5db_periodname_value;
        const matchedPeriod = rawEvaluationPeriods.find((ep: any) => ep.cr5db_evaluationperiodid === periodId);
        return {
          ...obj,
          cr5db_periodnamename: matchedPeriod ? matchedPeriod.cr5db_evaluationperiod1 : obj.cr5db_periodnamename
        };
      });

      setters.setUsersList(allUsers);
      setters.setDepartmentsList(allDepts);
      setters.setCompaniesList(allCompanies);
      setters.setPositionCatalogList(allCatalogs);
      setters.setJobPositionsList(allJobPositions as any);
      setters.setAuditLogsList(allAuditLogs);
      setters.setResourceAllocationsList(mappedAllocations);
      setters.setObjectivesList(mappedObjectives);
      setters.setProjects(rawProjects);
      setters.setProjectPhases(rawProjectPhases);
      setters.setProjectRisks(rawProjectRisks);
      setters.setSystemNotifications(rawNotifications);
      setters.setKpiLibrariesList(rawKpiLibraries);
      setters.setApprovalRoutesList(rawRoutes);
      setters.setChangeRequestsList(rawRequests);
      setters.setProjectTeamsList(rawProjectTeams);
      setters.setBonusMatrixList(rawBonusMatrix);
      setters.setCompetencyCatalogList(rawCompetencyCatalogs);
      setters.setJobCompetenciesList(rawJobCompetencies);
      setters.setCompetencyAssessmentsList(rawCompetencyAssessments);

      // Populate default select values
      if (allDepts.length > 0) {
        setters.setNewReqDeptId(allDepts[0].cr5db_departmentid);
        setters.setNewJobPosDeptId(allDepts[0].cr5db_departmentid);
      }
      if (allUsers.length > 0) {
        setters.setAssignRoleUserId(allUsers[0].cr5db_userid);
      }
      if (allCatalogs.length > 0) {
        setters.setNewReqCatalogId(allCatalogs[0].cr5db_positioncatalogid);
        setters.setNewJobPosCatalogId(allCatalogs[0].cr5db_positioncatalogid);
      }
      if (allCompanies.length > 0) {
        setters.setSelectedDeptCompanyId(allCompanies[0].cr5db_companyid);
      }

      // Auto-register user if not found
      let userProfile = allUsers.find((u: User) => u.cr5db_email?.toLowerCase() === authenticatedEmail.toLowerCase());
      if (!userProfile) {
        console.log(`Email '${authenticatedEmail}' not found. Auto-registering...`);
        try {
          const newUserName = authenticatedName || authenticatedEmail.split('@')[0];
          const systemRoleToAssign = defaultGroupsStr ? `Employee:${defaultGroupsStr}` : 'Employee';
          const createResult = await Cr5db_usersService.create({
            cr5db_fullname: newUserName,
            cr5db_email: authenticatedEmail,
            cr5db_systemrole: systemRoleToAssign,
            cr5db_isactive: true
          } as any);

          if (createResult.data) {
            const newUserRecord = createResult.data;
            allUsers.push(newUserRecord);
            setters.setUsersList([...allUsers]);
            userProfile = newUserRecord;

            await Cr5db_audittraillogsService.create({
              cr5db_logname: 'User Auto-Registration',
              cr5db_actionexecuted: `Auto-registered new user ${newUserName} (${authenticatedEmail}) on first login`,
              cr5db_changedfromvalue: 'None',
              cr5db_changedtovalue: `Role: ${systemRoleToAssign}`
            } as any);
          } else {
            throw new Error('Không thể tạo mới tài khoản.');
          }
        } catch (regErr) {
          console.error('Auto-registration failed:', regErr);
          throw new Error(`Tài khoản email '${authenticatedEmail}' chưa được đăng ký và tự động đăng ký thất bại.`);
        }
      }

      // Role determination
      const systemRole = userProfile.cr5db_systemrole || '';
      const effectiveRole = systemRole.startsWith('Admin') ? 'Admin' : 'Employee';

      const devOverride = sessionStorage.getItem('devRoleOverride');
      setters.setActiveRole(devOverride ? devOverride : effectiveRole);

      // Map Tasks
      const mappedTasks: Task[] = (tasksResponse.data || []).map((t: any) => {
        const assigneeLookup = t.cr5db_assigneeid as any;
        const assigneeId = t._cr5db_assigneeid_value || assigneeLookup?.cr5db_userid || assigneeLookup?.id || '';
        const assignee = assigneeId ? allUsers.find((u: User) => u.cr5db_userid === assigneeId) : undefined;
        const assigneeName = t.cr5db_assigneeidname || assigneeLookup?.name || assigneeLookup?.cr5db_fullname || '';
        
        // Lookup Project Name via Project Phase & Project relationship
        const phase = rawProjectPhases.find((ph: any) => ph.cr5db_projectphaseid === t._cr5db_projectphaseid_value);
        const proj = phase ? rawProjects.find((p: any) => p.cr5db_projectid === phase._cr5db_projectid_value) : undefined;
        
        return {
          cr5db_taskid: t.cr5db_taskid,
          cr5db_taskname: t.cr5db_taskname,
          cr5db_description: t.cr5db_description || '',
          cr5db_status: t.statecode === 1 ? 'Completed' : 'In Progress',
          cr5db_assignee_email: assignee?.cr5db_email || '',
          cr5db_assignee_name: assignee?.cr5db_fullname || assigneeName || 'Chưa phân công',
          cr5db_project_name: proj?.cr5db_projectname || 'Không thuộc dự án',
          cr5db_due_date: t.cr5db_duedate || '',
          _cr5db_parenttask_value: t._cr5db_parenttask_value || undefined,
          _cr5db_objectivename_value: t._cr5db_objectivename_value || undefined,
          _cr5db_projectphaseid_value: t._cr5db_projectphaseid_value || undefined,
          _cr5db_assigneeid_value: t._cr5db_assigneeid_value || undefined,
          _new_kpitarget_value: t._new_kpitarget_value || undefined,
          new_kpitargetname: t.new_kpitargetname || '',
          createdbyname: t.createdbyname || '',
          _createdby_value: t._createdby_value || ''
        };
      });
      setters.setTasks(mappedTasks);

      // Map Headcount Requests
      const mappedHeadcount: HeadcountRequest[] = (headcountResponse.data || []).map((r: any) => {
        const dept = allDepts.find((d: any) => d.cr5db_departmentid === r._cr5db_department_value);
        let statusStr: 'Pending' | 'Approved' | 'Rejected' = 'Pending';
        if (r.cr5db_approvalstatus === 122650001) statusStr = 'Approved';
        else if (r.cr5db_approvalstatus === 122650002) statusStr = 'Rejected';
        return {
          cr5db_headcountrequestid: r.cr5db_headcountrequestid,
          cr5db_requestname: r.cr5db_requestname,
          cr5db_requesttype: r.cr5db_requesttype === 122650001 ? 'Decrease Headcount' : r.cr5db_requesttype === 122650002 ? 'New Position' : 'Increase Headcount',
          cr5db_departmentname: dept?.cr5db_departmentname || r.cr5db_departmentname || 'Chung',
          cr5db_positiontitle: r.cr5db_positioncatalogname || r.cr5db_jobpositionname || 'Chức danh',
          cr5db_requestedquantity: r.cr5db_requestedquantity || 1,
          cr5db_reason: r.cr5db_reason || '',
          cr5db_approvalstatus: statusStr,
          cr5db_createddate: r.cr5db_createddate || '',
          _cr5db_department_value: r._cr5db_department_value || undefined,
          _cr5db_positioncatalog_value: r._cr5db_positioncatalog_value || undefined,
          _cr5db_approverposition_value: r._cr5db_approverposition_value || undefined,
          raw_requesttype: r.cr5db_requesttype,
          raw_approvalstatus: r.cr5db_approvalstatus
        };
      });
      setters.setHeadcountRequests(mappedHeadcount);

      // Map KPIs
      const mappedKpis: KPITarget[] = (kpiResponse.data || []).map((k: any) => {
        const employee = allUsers.find((u: User) => u.cr5db_userid === k._cr5db_employeeid_value);
        const libraryItem = rawKpiLibraries.find((lib: any) => lib.cr5db_kpilibraryid === k._cr5db_kpicode_value);
        const parentObjective = mappedObjectives.find((obj: any) => obj.cr5db_objectiveid === k._cr5db_parentobjective_value);
        let dynamicActual = k.cr5db_actualvalue || 0;
        if (libraryItem?.cr5db_formula) {
          const formula = libraryItem.cr5db_formula.trim();
          if (formula === '#TASKS_ON_TIME') {
            const userObjTasks = rawTasks.filter((t: any) => 
              t._cr5db_assigneeid_value === k._cr5db_employeeid_value &&
              t._cr5db_objectivename_value === k._cr5db_parentobjective_value
            );
            if (userObjTasks.length > 0) {
              const completedTasks = userObjTasks.filter((t: any) => t.statecode === 1);
              dynamicActual = Math.round((completedTasks.length / userObjTasks.length) * 100);
            } else {
              const userTasks = rawTasks.filter((t: any) => t._cr5db_assigneeid_value === k._cr5db_employeeid_value);
              if (userTasks.length > 0) {
                const completedTasks = userTasks.filter((t: any) => t.statecode === 1);
                dynamicActual = Math.round((completedTasks.length / userTasks.length) * 100);
              } else {
                dynamicActual = 100;
              }
            }
          } else if (formula === '#HOURS_LOGGED') {
            const userTimesheets = rawTimesheets.filter((ts: any) => 
              ts._cr5db_userid_value === k._cr5db_employeeid_value &&
              ts.statecode === 1 &&
              !ts.cr5db_timesheetlog1?.startsWith('[Từ chối]')
            );
            const period = rawEvaluationPeriods.find((ep: any) => ep.cr5db_evaluationperiodid === parentObjective?._cr5db_periodname_value);
            if (period) {
              const start = period.cr5db_startdate ? new Date(period.cr5db_startdate) : null;
              const end = period.cr5db_enddate ? new Date(period.cr5db_enddate) : null;
              const filteredTs = userTimesheets.filter((ts: any) => {
                if (!ts.cr5db_logdate) return false;
                const d = new Date(ts.cr5db_logdate);
                return (!start || d >= start) && (!end || d <= end);
              });
              dynamicActual = filteredTs.reduce((sum: number, ts: any) => sum + (ts.cr5db_actualhoursworked || 0), 0);
            } else {
              dynamicActual = userTimesheets.reduce((sum: number, ts: any) => sum + (ts.cr5db_actualhoursworked || 0), 0);
            }
          }
        }

        // Calculate workload capacity metrics for this KPI target
        const kpiTasks = mappedTasks.filter(t => t._new_kpitarget_value === k.cr5db_kpitargetid);
        const activeKpiTasks = kpiTasks.filter(t => t.cr5db_status !== 'Completed');
        const currentActiveTasks = activeKpiTasks.length;

        const kpiTaskIds = kpiTasks.map(t => t.cr5db_taskid);
        const kpiTimesheets = rawTimesheets.filter((ts: any) => 
          ts._cr5db_taskid_value && 
          kpiTaskIds.includes(ts._cr5db_taskid_value) &&
          ts.statecode === 1 &&
          !ts.cr5db_timesheetlog1?.startsWith('[Từ chối]')
        );
        const currentLoggedHours = kpiTimesheets.reduce((sum: number, ts: any) => sum + (ts.cr5db_actualhoursworked || 0), 0);

        const standardHoursLimit = k.new_standardhourslimit || 0;
        const activeTasksLimit = k.new_activetaskslimit || 0;
        const hasCapacityAlert = (activeTasksLimit > 0 && currentActiveTasks > activeTasksLimit) ||
                                 (standardHoursLimit > 0 && currentLoggedHours > standardHoursLimit);

        return {
          cr5db_kpitargetid: k.cr5db_kpitargetid,
          cr5db_kpiname: k.cr5db_kpitarget1 || libraryItem?.cr5db_kpiname || 'Mục tiêu KPI',
          cr5db_targetvalue: k.cr5db_targetvalue ?? 100,
          cr5db_actualvalue: dynamicActual,
          cr5db_unit: libraryItem?.cr5db_unit || '%',
          cr5db_weightpercentage: k.cr5db_weightpercentage || 0,
          cr5db_user_email: employee?.cr5db_email || '',
          cr5db_period: parentObjective?.cr5db_periodnamename || 'Q2/2026',
          cr5db_objective_name: parentObjective?.cr5db_objective1 || 'Chưa liên kết',
          _cr5db_parentobjective_value: k._cr5db_parentobjective_value || undefined,
          _cr5db_employeeid_value: k._cr5db_employeeid_value || undefined,
          _cr5db_kpicode_value: k._cr5db_kpicode_value || undefined,
          new_standardhourslimit: k.new_standardhourslimit || 0,
          new_activetaskslimit: k.new_activetaskslimit || 0,
          currentActiveTasks,
          currentLoggedHours,
          hasCapacityAlert
        };
      });
      setters.setKpiTargets(mappedKpis);

      // Map Timesheets
      const mappedTimesheets = (timesheetsResponse.data || []).map((ts: any) => {
        const user = allUsers.find((u: User) => u.cr5db_userid === ts._cr5db_userid_value);
        const taskObj = mappedTasks.find((t: any) => t.cr5db_taskid === ts._cr5db_taskid_value);
        
        return {
          cr5db_timesheetlogid: ts.cr5db_timesheetlogid,
          cr5db_timesheetlog1: ts.cr5db_timesheetlog1,
          cr5db_actualhoursworked: ts.cr5db_actualhoursworked || 0,
          cr5db_logdate: ts.cr5db_logdate || '',
          cr5db_taskname: taskObj?.cr5db_taskname || ts.cr5db_taskidname || 'Không xác định',
          _cr5db_taskid_value: ts._cr5db_taskid_value,
          cr5db_username: ts.cr5db_useridname || user?.cr5db_fullname || 'Thành viên',
          cr5db_useremail: user?.cr5db_email || '',
          statecode: ts.statecode,
          statuscode: ts.statuscode
        };
      });
      setters.setTimesheets(mappedTimesheets);

      // Map Appraisals
      const mappedAppraisals = (appraisalsResponse.data || []).map((ap: any) => {
        const employee = allUsers.find((u: User) => u.cr5db_userid === ap._cr5db_employeeid_value);
        const evaluator = allUsers.find((u: User) => u.cr5db_userid === ap._cr5db_evaluatorid_value);
        return {
          cr5db_performanceappraisalid: ap.cr5db_performanceappraisalid,
          cr5db_performanceappraisal1: ap.cr5db_performanceappraisal1,
          cr5db_finalscore: ap.cr5db_finalscore || 0,
          cr5db_selfscore: ap.cr5db_selfscore || 0,
          cr5db_employeename: ap.cr5db_employeeidname || employee?.cr5db_fullname || '',
          cr5db_employeeemail: employee?.cr5db_email || '',
          cr5db_evaluatorname: ap.cr5db_evaluatoridname || evaluator?.cr5db_fullname || '',
          cr5db_periodname: ap.cr5db_periodidname || 'Kỳ đánh giá',
          statecode: ap.statecode,
          statuscode: ap.statuscode,
          new_bonusmultiplier: ap.new_bonusmultiplier || 0
        };
      });
      setters.setAppraisals(mappedAppraisals);

      // Map Evaluation Periods
      const mappedPeriods = (rawEvaluationPeriods || []).map((p: any) => ({
        cr5db_evaluationperiodid: p.cr5db_evaluationperiodid,
        cr5db_evaluationperiod1: p.cr5db_evaluationperiod1,
        cr5db_startdate: p.cr5db_startdate || '',
        cr5db_enddate: p.cr5db_enddate || '',
        cr5db_islocked: !!p.cr5db_islocked
      }));
      setters.setEvaluationPeriodsList(mappedPeriods);
      setters.setIdpList(rawIdps);
      setters.setIdpActionList(rawIdpActions);
      setters.setProcessTemplateList(rawProcessTemplates);
      setters.setProcessTemplateStepList(rawProcessTemplateSteps);
      setters.setEmployeeProcessList(rawEmployeeProcesses);
      setters.setProcessStepList(rawProcessSteps);
      setters.setLeaveBalancesList(rawLeaveBalances);
      setters.setLeaveRequestsList(rawLeaveRequests);
      setters.setHolidaysList((rawHolidays || []).map((h: any) => ({
        cr5db_holidayid: h.cr5db_holidayid,
        cr5db_name: h.cr5db_name || '',
        cr5db_date: h.cr5db_date || ''
      })));
      setters.setOvertimeRequestsList(rawOvertimeRequests);

    } catch (err: any) {
      console.error('Initialization error: ', err);
      setters.setErrorMsg(err.message || 'Lỗi khi kết nối Dataverse.');
    } finally {
      setters.setIsLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchLiveValues();
  }, []);

  return { fetchLiveValues };
}
