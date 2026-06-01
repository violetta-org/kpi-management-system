import { useState, useEffect } from 'react';
import type { User, Task, HeadcountRequest, KPITarget, Company, PositionCatalog, JobPosition, AuditLog, PermissionGroup, EvaluationPeriod, LeaveBalance, LeaveRequest, Holiday, OvertimeRequest } from '../lib/types';

export type ActiveTab =
  | 'dashboard' | 'tasks' | 'timesheets' | 'kpi' | 'performance'
  | 'companies' | 'positions' | 'headcount' | 'requests' | 'directory'
  | 'roles' | 'resources' | 'routes' | 'kpi-catalog' | 'system-seed' | 'my-processes';

export type ActiveRole = 'Employee' | 'Admin';

export function useAppState() {
  // ── Navigation ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [language, setLanguage] = useState<'vi' | 'en'>(() => {
    return (localStorage.getItem('appLanguage') as 'vi' | 'en') || 'vi';
  });

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === 'vi' ? 'en' : 'vi';
      localStorage.setItem('appLanguage', next);
      return next;
    });
  };
  const [requestsSubTab, setRequestsSubTab] = useState<'change' | 'headcount'>('change');
  const [expandedRequests, setExpandedRequests] = useState<Record<string, boolean>>({});

  // ── Auth / Role ──────────────────────────────────────────────────────────
  const [activeRole, setActiveRole] = useState<ActiveRole>(() => {
    const saved = sessionStorage.getItem('devRoleOverride');
    return (saved as ActiveRole) || 'Employee';
  });
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');

  // ── Live Data ────────────────────────────────────────────────────────────
  const [usersList, setUsersList] = useState<User[]>([]);
  const [departmentsList, setDepartmentsList] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [headcountRequests, setHeadcountRequests] = useState<HeadcountRequest[]>([]);
  const [kpiTargets, setKpiTargets] = useState<KPITarget[]>([]);
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectPhases, setProjectPhases] = useState<any[]>([]);
  const [projectRisks, setProjectRisks] = useState<any[]>([]);
  const [appraisals, setAppraisals] = useState<any[]>([]);
  const [systemNotifications, setSystemNotifications] = useState<any[]>([]);
  const [leaveBalancesList, setLeaveBalancesList] = useState<LeaveBalance[]>([]);
  const [leaveRequestsList, setLeaveRequestsList] = useState<LeaveRequest[]>([]);
  const [holidaysList, setHolidaysList] = useState<Holiday[]>([]);
  const [overtimeRequestsList, setOvertimeRequestsList] = useState<OvertimeRequest[]>([]);

  // ── Master Lists ─────────────────────────────────────────────────────────
  const [companiesList, setCompaniesList] = useState<Company[]>([]);
  const [positionCatalogList, setPositionCatalogList] = useState<PositionCatalog[]>([]);
  const [jobPositionsList, setJobPositionsList] = useState<JobPosition[]>([]);
  const [auditLogsList, setAuditLogsList] = useState<AuditLog[]>([]);
  const [kpiLibrariesList, setKpiLibrariesList] = useState<any[]>([]);
  const [resourceAllocationsList, setResourceAllocationsList] = useState<any[]>([]);
  const [objectivesList, setObjectivesList] = useState<any[]>([]);
  const [approvalRoutesList, setApprovalRoutesList] = useState<any[]>([]);
  const [changeRequestsList, setChangeRequestsList] = useState<any[]>([]);
  const [projectTeamsList, setProjectTeamsList] = useState<any[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [bonusMatrixList, setBonusMatrixList] = useState<any[]>([]);
  const [competencyCatalogList, setCompetencyCatalogList] = useState<any[]>([]);
  const [jobCompetenciesList, setJobCompetenciesList] = useState<any[]>([]);
  const [competencyAssessmentsList, setCompetencyAssessmentsList] = useState<any[]>([]);
  const [defaultGroups, setDefaultGroups] = useState<string>('');
  const [defaultGroupsDbId, setDefaultGroupsDbId] = useState<string>('');

  const [evaluationPeriodsList, setEvaluationPeriodsList] = useState<EvaluationPeriod[]>([]);
  // Period Modal
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [newPeriodName, setNewPeriodName] = useState('');
  const [newPeriodStartDate, setNewPeriodStartDate] = useState('');
  const [newPeriodEndDate, setNewPeriodEndDate] = useState('');
  const [editingPeriod, setEditingPeriod] = useState<EvaluationPeriod | null>(null);
  // Assign Appraisal Modal
  const [showAssignAppraisalModal, setShowAssignAppraisalModal] = useState(false);
  const [newAppraisalName, setNewAppraisalName] = useState('');
  const [newAppraisalEmployeeId, setNewAppraisalEmployeeId] = useState('');
  const [newAppraisalEvaluatorId, setNewAppraisalEvaluatorId] = useState('');
  const [newAppraisalPeriodId, setNewAppraisalPeriodId] = useState('');

  // Debug log when routes/requests reload
  useEffect(() => {
    console.log(`Routes loaded: ${approvalRoutesList.length}, Requests loaded: ${changeRequestsList.length}`);
  }, [approvalRoutesList, changeRequestsList]);

  // ── KPI CRUD Form States ─────────────────────────────────────────────────
  const [showKpiModal, setShowKpiModal] = useState(false);
  const [editingKpi, setEditingKpi] = useState<any>(null);
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

  // ── Sub-Tabs ─────────────────────────────────────────────────────────────
  const [activeTimesheetSubTab, setActiveTimesheetSubTab] = useState<'my' | 'approvals' | 'my-leaves' | 'leave-approvals' | 'leave-balances' | 'holidays' | 'ot' | 'ot-approvals'>('my');
  const [activePerformanceSubTab, setActivePerformanceSubTab] = useState<'my' | 'team' | 'cycles' | 'competency' | 'idp'>('my');

  // IDP states
  const [idpList, setIdpList] = useState<any[]>([]);
  const [idpActionList, setIdpActionList] = useState<any[]>([]);

  // ── Onboarding / Offboarding ─────────────────────────────────────────────
  const [processTemplateList, setProcessTemplateList] = useState<any[]>([]);
  const [processTemplateStepList, setProcessTemplateStepList] = useState<any[]>([]);
  const [employeeProcessList, setEmployeeProcessList] = useState<any[]>([]);
  const [processStepList, setProcessStepList] = useState<any[]>([]);
  const [showIdpModal, setShowIdpModal] = useState(false);
  const [editingIdp, setEditingIdp] = useState<any>(null);
  const [showIdpActionModal, setShowIdpActionModal] = useState(false);
  const [editingIdpAction, setEditingIdpAction] = useState<any>(null);
  const [activeResourcesSubTab, setActiveResourcesSubTab] = useState<'allocations' | 'projects'>('allocations');
  const [collapsedProjects, setCollapsedProjects] = useState<{ [key: string]: boolean }>({});
  const [activeKpiSubTab, setActiveKpiSubTab] = useState<'overview' | 'charts'>('overview');
  const [kpiTimeRange, setKpiTimeRange] = useState<'week' | 'month' | 'quarter' | 'custom'>('quarter');

  // ── Employee Directory ───────────────────────────────────────────────────
  const [activeDirectorySubTab, setActiveDirectorySubTab] = useState<'view' | 'manage' | 'history' | 'groups' | 'orgchart' | 'onboarding'>('view');
  const [expandedOrgNodes, setExpandedOrgNodes] = useState<{ [key: string]: boolean }>({});
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<User | null>(null);
  const [employeeFullName, setEmployeeFullName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeeRole, setEmployeeRole] = useState('Employee');
  const [employeeJobPositionId, setEmployeeJobPositionId] = useState('');
  const [employeeIsActive, setEmployeeIsActive] = useState(true);
  const [selectedDirectoryUser, setSelectedDirectoryUser] = useState<User | null>(null);

  // ── Project Management ───────────────────────────────────────────────────
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectStartDate, setProjectStartDate] = useState('');
  const [projectEndDate, setProjectEndDate] = useState('');
  const [projectStatus, setProjectStatus] = useState('Not Started');
  const [activeProjectDetails, setActiveProjectDetails] = useState<any>(null);

  // ── Phase & Risk ─────────────────────────────────────────────────────────
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [editingPhase, setEditingPhase] = useState<any>(null);
  const [newPhaseName, setNewPhaseName] = useState('');
  const [newPhaseStatus, setNewPhaseStatus] = useState('Not Started');
  const [newPhaseStartDate, setNewPhaseStartDate] = useState('');
  const [newPhaseEndDate, setNewPhaseEndDate] = useState('');
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [editingRisk, setEditingRisk] = useState<any>(null);
  const [newRiskName, setNewRiskName] = useState('');
  const [newRiskImpact, setNewRiskImpact] = useState('Medium');
  const [newRiskProbability, setNewRiskProbability] = useState('Medium');
  const [newRiskMitigation, setNewRiskMitigation] = useState('');

  // ── Filters ──────────────────────────────────────────────────────────────
  const [selectedDeptCompanyId, setSelectedDeptCompanyId] = useState<string>('');
  const [selectedReportsToPositionId, setSelectedReportsToPositionId] = useState<string>('');
  const [selectedKpiEmployeeFilter, setSelectedKpiEmployeeFilter] = useState<string>('All');
  const [selectedKpiObjectiveFilter, setSelectedKpiObjectiveFilter] = useState<string>('All');
  const [selectedKpiPeriodFilter, setSelectedKpiPeriodFilter] = useState<string>('All');

  // ── UI State ─────────────────────────────────────────────────────────────
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [selectedFilterProject, setSelectedFilterProject] = useState('All Projects');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ── Leave Management Modals ────────────────────────────────────────────────
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [newLeaveType, setNewLeaveType] = useState('Annual Leave');
  const [newLeaveStartDate, setNewLeaveStartDate] = useState('');
  const [newLeaveEndDate, setNewLeaveEndDate] = useState('');
  const [newLeaveReason, setNewLeaveReason] = useState('');

  const [showLeaveBalanceModal, setShowLeaveBalanceModal] = useState(false);
  const [editingLeaveBalance, setEditingLeaveBalance] = useState<LeaveBalance | null>(null);
  const [newBalanceEntitlement, setNewBalanceEntitlement] = useState('12');
  const [newBalanceCarriedOver, setNewBalanceCarriedOver] = useState('0');
  const [newBalanceUsedDays, setNewBalanceUsedDays] = useState('0');

  // ── Holiday & Overtime Modals ──────────────────────────────────────────────
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState('');

  const [showOvertimeModal, setShowOvertimeModal] = useState(false);
  const [newOtDate, setNewOtDate] = useState('');
  const [newOtStartTime, setNewOtStartTime] = useState('18:00');
  const [newOtEndTime, setNewOtEndTime] = useState('20:00');
  const [newOtHours, setNewOtHours] = useState('2');
  const [newOtType, setNewOtType] = useState('Weekday');
  const [newOtReason, setNewOtReason] = useState('');
  const [showOtApprovalModal, setShowOtApprovalModal] = useState(false);
  const [otToApproveId, setOtToApproveId] = useState('');
  const [otApprovedHours, setOtApprovedHours] = useState('0');

  // ── Task Modal ───────────────────────────────────────────────────────────
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskObjectiveId, setNewTaskObjectiveId] = useState('');
  const [newTaskParentId, setNewTaskParentId] = useState('');
  const [newTaskProjectId, setNewTaskProjectId] = useState('');
  const [newTaskPhaseId, setNewTaskPhaseId] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<'Not Started' | 'In Progress' | 'Completed'>('In Progress');

  // ── Timesheet Modal ──────────────────────────────────────────────────────
  const [showTimesheetModal, setShowTimesheetModal] = useState(false);
  const [newTimesheetHours, setNewTimesheetHours] = useState(8);
  const [newTimesheetDate, setNewTimesheetDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTimesheetDesc, setNewTimesheetDesc] = useState('');
  const [newTimesheetTaskId, setNewTimesheetTaskId] = useState('');

  // ── Rejection Modal ──────────────────────────────────────────────────────
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [timesheetToRejectId, setTimesheetToRejectId] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState('');

  // ── Headcount Request Modal ──────────────────────────────────────────────
  const [showHeadcountRequestModal, setShowHeadcountRequestModal] = useState(false);
  const [newRequestName, setNewRequestName] = useState('');
  const [newRequestType, setNewRequestType] = useState('Increase Headcount');
  const [newReqDeptId, setNewReqDeptId] = useState('');
  const [newReqCatalogId, setNewReqCatalogId] = useState('');
  const [newReqQty, setNewReqQty] = useState(1);
  const [newReqReason, setNewReqReason] = useState('');
  const [editingHeadcountRequest, setEditingHeadcountRequest] = useState<HeadcountRequest | null>(null);
  const [newReqStatus, setNewReqStatus] = useState<string>('Pending');
  const [newReqReportsToId, setNewReqReportsToId] = useState<string>('');

  // ── Company & Department Modals ──────────────────────────────────────────
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [newCompanyCode, setNewCompanyCode] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingDept, setEditingDept] = useState<any | null>(null);

  // ── Position Catalog Modal ───────────────────────────────────────────────
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [newCatalogCode, setNewCatalogCode] = useState('');
  const [newCatalogName, setNewCatalogName] = useState('');
  const [editingCatalog, setEditingCatalog] = useState<any | null>(null);

  // ── Job Position Modal ───────────────────────────────────────────────────
  const [showJobPositionModal, setShowJobPositionModal] = useState(false);
  const [newJobPosName, setNewJobPosName] = useState('');
  const [newJobPosDeptId, setNewJobPosDeptId] = useState('');
  const [newJobPosCatalogId, setNewJobPosCatalogId] = useState('');
  const [newJobPosQuota, setNewJobPosQuota] = useState(1);
  const [editingJobPosition, setEditingJobPosition] = useState<any | null>(null);

  // ── Role Assignment Modal ────────────────────────────────────────────────
  const [showAssignRoleModal, setShowAssignRoleModal] = useState(false);
  const [assignRoleUserId, setAssignRoleUserId] = useState('');
  const [assignRoleName, setAssignRoleName] = useState('Employee');
  const [assignRoleNotes, setAssignRoleNotes] = useState('');

  // ── Change Request / Approval Modal ─────────────────────────────────────
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalModalData, setApprovalModalData] = useState<{
    entityName: string;
    operation: 'Create' | 'Update' | 'Delete';
    payload: any;
    targetRecordId?: string;
    description: string;
    oldValue?: any;
    defaultApproverId: string;
    validApprovers: User[];
    appliedRouteId?: string;
  } | null>(null);
  const [requestReason, setRequestReason] = useState('');
  const [selectedApproverId, setSelectedApproverId] = useState('');

  // ── KPI Catalog (Library + Objectives) ──────────────────────────────────
  const [activeKpiCatalogSubTab, setActiveKpiCatalogSubTab] = useState<'library' | 'objectives' | 'bonus' | 'competency'>('library');

  // KPI Library item modal
  const [showKpiLibraryModal, setShowKpiLibraryModal] = useState(false);
  const [editingKpiLibrary, setEditingKpiLibrary] = useState<any>(null);
  const [kpiLibName, setKpiLibName] = useState('');
  const [kpiLibUnit, setKpiLibUnit] = useState('%');
  const [kpiLibFormula, setKpiLibFormula] = useState('');
  const [kpiLibDirection, setKpiLibDirection] = useState<number>(1);

  // Objective (period/cycle) modal
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [editingObjective, setEditingObjective] = useState<any>(null);
  const [objectiveName, setObjectiveName] = useState('');
  const [objectiveTarget, setObjectiveTarget] = useState<number>(100);
  const [objectivePeriodId, setObjectivePeriodId] = useState<string>('');

  const [showBonusMatrixModal, setShowBonusMatrixModal] = useState(false);
  const [editingBonusMatrix, setEditingBonusMatrix] = useState<any>(null);
  const [newMinScore, setNewMinScore] = useState<number>(0);
  const [newMaxScore, setNewMaxScore] = useState<number>(0);
  const [newMultiplier, setNewMultiplier] = useState(0);

  // ── Competency Framework States ──────────────────────────────────────────
  const [showCompetencyModal, setShowCompetencyModal] = useState(false);
  const [editingCompetency, setEditingCompetency] = useState<any>(null);
  const [newCompetencyName, setNewCompetencyName] = useState('');
  const [newCompetencyType, setNewCompetencyType] = useState('Core');
  const [newCompetencyDesc, setNewCompetencyDesc] = useState('');
  const [newCompetencyMaxLevel, setNewCompetencyMaxLevel] = useState(5);

  const [showJobCompetencyModal, setShowJobCompetencyModal] = useState(false);
  const [editingJobCompetency, setEditingJobCompetency] = useState<any>(null);
  const [selectedJobPositionId, setSelectedJobPositionId] = useState('');
  const [newJobCompetencyId, setNewJobCompetencyId] = useState('');
  const [newRequiredLevel, setNewRequiredLevel] = useState(3);
  const [newCompetencyWeight, setNewCompetencyWeight] = useState(0);

  // ── Approval Routes Management ───────────────────────────────────────────
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<any | null>(null);
  const [routeName, setRouteName] = useState('');
  const [routeTargetEntity, setRouteTargetEntity] = useState<number>(1);
  const [routeOperation, setRouteOperation] = useState<number>(4); // Default All
  const [routeRequesterRole, setRouteRequesterRole] = useState<number>(1); // Default Employee
  const [routeRoutingType, setRouteRoutingType] = useState<number>(1); // Default POSITION_HIERARCHY
  const [routeApproverRole, setRouteApproverRole] = useState('');
  const [routeApproverUserId, setRouteApproverUserId] = useState('');
  const [routePriority, setRoutePriority] = useState<number>(1);

  // ── Onboarding / Offboarding Modals ──────────────────────────────────────
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [newProcessEmployeeId, setNewProcessEmployeeId] = useState('');
  const [newProcessTemplateId, setNewProcessTemplateId] = useState('');
  
  const [showProcessDetailModal, setShowProcessDetailModal] = useState(false);
  const [selectedProcessId, setSelectedProcessId] = useState('');

  // ── Appraisal cycles ───────────────────────────────────────────────────────
  useEffect(() => {
    if (activeRole === 'Admin') return;
    if (usersList.length === 0) return; // Wait for data to load

    const BASELINE_TABS = ['dashboard', 'tasks', 'timesheets', 'kpi', 'requests', 'my-processes'];
    if (BASELINE_TABS.includes(activeTab)) return;

    const currentUser = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
    if (!currentUser) {
      setActiveTab('dashboard');
      return;
    }

    const roleStr = currentUser.cr5db_systemrole || '';
    if (roleStr.startsWith('Employee:')) {
      const assignedGroupIds = roleStr.substring(9).split(',');
      const hasPermission = permissionGroups.some(group => 
        assignedGroupIds.includes(group.id) && group.tabs.includes(activeTab)
      );
      if (!hasPermission) {
        setActiveTab('dashboard');
      }
    } else {
      setActiveTab('dashboard');
    }
  }, [activeRole, activeTab, usersList, currentUserEmail, permissionGroups]);

  return {
    // Navigation
    activeTab, setActiveTab,
    requestsSubTab, setRequestsSubTab,
    expandedRequests, setExpandedRequests,

    // Auth / Role
    activeRole, setActiveRole,
    currentUserEmail, setCurrentUserEmail,
    currentUserName, setCurrentUserName,

    // Lists
    processTemplateList, setProcessTemplateList,
    processTemplateStepList, setProcessTemplateStepList,
    employeeProcessList, setEmployeeProcessList,
    processStepList, setProcessStepList,
    usersList, setUsersList,
    departmentsList, setDepartmentsList,
    tasks, setTasks,
    headcountRequests, setHeadcountRequests,
    kpiTargets, setKpiTargets,
    timesheets, setTimesheets,
    projects, setProjects,
    projectPhases, setProjectPhases,
    projectRisks, setProjectRisks,
    appraisals, setAppraisals,
    systemNotifications, setSystemNotifications,

    // Master Lists
    companiesList, setCompaniesList,
    positionCatalogList, setPositionCatalogList,
    jobPositionsList, setJobPositionsList,
    auditLogsList, setAuditLogsList,
    kpiLibrariesList, setKpiLibrariesList,
    resourceAllocationsList, setResourceAllocationsList,
    objectivesList, setObjectivesList,
    approvalRoutesList, setApprovalRoutesList,
    changeRequestsList, setChangeRequestsList,
    projectTeamsList, setProjectTeamsList,

    // KPI CRUD
    showLeaveModal, setShowLeaveModal,
    newLeaveType, setNewLeaveType,
    newLeaveStartDate, setNewLeaveStartDate,
    newLeaveEndDate, setNewLeaveEndDate,
    newLeaveReason, setNewLeaveReason,
    showLeaveBalanceModal, setShowLeaveBalanceModal,
    editingLeaveBalance, setEditingLeaveBalance,
    newBalanceEntitlement, setNewBalanceEntitlement,
    newBalanceCarriedOver, setNewBalanceCarriedOver,
    newBalanceUsedDays, setNewBalanceUsedDays,

    showKpiModal, setShowKpiModal,
    editingKpi, setEditingKpi,
    kpiTargetName, setKpiTargetName,
    kpiTargetValue, setKpiTargetValue,
    kpiActualValue, setKpiActualValue,
    kpiWeight, setKpiWeight,
    kpiUnit, setKpiUnit,
    kpiEmployeeId, setKpiEmployeeId,
    kpiObjectiveId, setKpiObjectiveId,
    kpiLibraryId, setKpiLibraryId,
    kpiParentKpiId, setKpiParentKpiId,
    kpiRollupMethod, setKpiRollupMethod,
    kpiPeriod, setKpiPeriod,

    // Sub-Tabs
    activeTimesheetSubTab, setActiveTimesheetSubTab,
    activePerformanceSubTab, setActivePerformanceSubTab,
    activeResourcesSubTab, setActiveResourcesSubTab,
    collapsedProjects, setCollapsedProjects,
    activeKpiSubTab, setActiveKpiSubTab,
    kpiTimeRange, setKpiTimeRange,

    // IDP
    idpList, setIdpList,
    idpActionList, setIdpActionList,
    showIdpModal, setShowIdpModal,
    editingIdp, setEditingIdp,
    showIdpActionModal, setShowIdpActionModal,
    editingIdpAction, setEditingIdpAction,

    // Employee Directory
    activeDirectorySubTab, setActiveDirectorySubTab,
    expandedOrgNodes, setExpandedOrgNodes,
    showEmployeeModal, setShowEmployeeModal,
    editingEmployee, setEditingEmployee,
    employeeFullName, setEmployeeFullName,
    employeeEmail, setEmployeeEmail,
    employeeRole, setEmployeeRole,
    employeeJobPositionId, setEmployeeJobPositionId,
    employeeIsActive, setEmployeeIsActive,
    selectedDirectoryUser, setSelectedDirectoryUser,

    // Project Management
    showProjectModal, setShowProjectModal,
    editingProject, setEditingProject,
    projectName, setProjectName,
    projectDesc, setProjectDesc,
    projectStartDate, setProjectStartDate,
    projectEndDate, setProjectEndDate,
    projectStatus, setProjectStatus,
    activeProjectDetails, setActiveProjectDetails,

    // Phase & Risk
    showPhaseModal, setShowPhaseModal,
    editingPhase, setEditingPhase,
    newPhaseName, setNewPhaseName,
    newPhaseStatus, setNewPhaseStatus,
    newPhaseStartDate, setNewPhaseStartDate,
    newPhaseEndDate, setNewPhaseEndDate,
    showRiskModal, setShowRiskModal,
    editingRisk, setEditingRisk,
    newRiskName, setNewRiskName,
    newRiskImpact, setNewRiskImpact,
    newRiskProbability, setNewRiskProbability,
    newRiskMitigation, setNewRiskMitigation,

    // Filters
    selectedDeptCompanyId, setSelectedDeptCompanyId,
    selectedReportsToPositionId, setSelectedReportsToPositionId,
    selectedKpiEmployeeFilter, setSelectedKpiEmployeeFilter,
    selectedKpiObjectiveFilter, setSelectedKpiObjectiveFilter,
    selectedKpiPeriodFilter, setSelectedKpiPeriodFilter,

    // UI State
    isSidebarHidden, setIsSidebarHidden,
    showNotificationsModal, setShowNotificationsModal,
    taskSearchQuery, setTaskSearchQuery,
    selectedFilterProject, setSelectedFilterProject,
    isLoading, setIsLoading,
    errorMsg, setErrorMsg,

    // Task Modal
    showTaskModal, setShowTaskModal,
    newTaskName, setNewTaskName,
    newTaskDesc, setNewTaskDesc,
    newTaskAssigneeId, setNewTaskAssigneeId,
    newTaskDueDate, setNewTaskDueDate,
    newTaskObjectiveId, setNewTaskObjectiveId,
    newTaskParentId, setNewTaskParentId,
    newTaskProjectId, setNewTaskProjectId,
    newTaskPhaseId, setNewTaskPhaseId,
    editingTask, setEditingTask,
    newTaskStatus, setNewTaskStatus,

    // Timesheet Modal
    showTimesheetModal, setShowTimesheetModal,
    newTimesheetHours, setNewTimesheetHours,
    newTimesheetDate, setNewTimesheetDate,
    newTimesheetDesc, setNewTimesheetDesc,
    newTimesheetTaskId, setNewTimesheetTaskId,

    // Rejection Modal
    showRejectionModal, setShowRejectionModal,
    timesheetToRejectId, setTimesheetToRejectId,
    rejectionReason, setRejectionReason,

    // Headcount Request Modal
    showHeadcountRequestModal, setShowHeadcountRequestModal,
    newRequestName, setNewRequestName,
    newRequestType, setNewRequestType,
    newReqDeptId, setNewReqDeptId,
    newReqCatalogId, setNewReqCatalogId,
    newReqQty, setNewReqQty,
    newReqReason, setNewReqReason,
    editingHeadcountRequest, setEditingHeadcountRequest,
    newReqStatus, setNewReqStatus,
    newReqReportsToId, setNewReqReportsToId,

    // Company & Department Modals
    showCompanyModal, setShowCompanyModal,
    newCompanyCode, setNewCompanyCode,
    newCompanyName, setNewCompanyName,
    showDeptModal, setShowDeptModal,
    newDeptCode, setNewDeptCode,
    newDeptName, setNewDeptName,
    editingCompany, setEditingCompany,
    editingDept, setEditingDept,

    // Position Catalog Modal
    showCatalogModal, setShowCatalogModal,
    newCatalogCode, setNewCatalogCode,
    newCatalogName, setNewCatalogName,
    editingCatalog, setEditingCatalog,

    // Job Position Modal
    showJobPositionModal, setShowJobPositionModal,
    newJobPosName, setNewJobPosName,
    newJobPosDeptId, setNewJobPosDeptId,
    newJobPosCatalogId, setNewJobPosCatalogId,
    newJobPosQuota, setNewJobPosQuota,
    editingJobPosition, setEditingJobPosition,

    // Role Assignment Modal
    showAssignRoleModal, setShowAssignRoleModal,
    assignRoleUserId, setAssignRoleUserId,
    assignRoleName, setAssignRoleName,
    assignRoleNotes, setAssignRoleNotes,

    // Change Request / Approval Modal
    showApprovalModal, setShowApprovalModal,
    approvalModalData, setApprovalModalData,
    requestReason, setRequestReason,
    selectedApproverId, setSelectedApproverId,

    // KPI Catalog
    activeKpiCatalogSubTab, setActiveKpiCatalogSubTab,
    showKpiLibraryModal, setShowKpiLibraryModal,
    editingKpiLibrary, setEditingKpiLibrary,
    kpiLibName, setKpiLibName,
    kpiLibUnit, setKpiLibUnit,
    kpiLibFormula, setKpiLibFormula,
    kpiLibDirection, setKpiLibDirection,
    showObjectiveModal, setShowObjectiveModal,
    editingObjective, setEditingObjective,
    objectiveName, setObjectiveName,
    objectiveTarget, setObjectiveTarget,
    objectivePeriodId, setObjectivePeriodId,
    bonusMatrixList, setBonusMatrixList,
    showBonusMatrixModal, setShowBonusMatrixModal,
    editingBonusMatrix, setEditingBonusMatrix,
    newMinScore, setNewMinScore,
    newMaxScore, setNewMaxScore,
    newMultiplier, setNewMultiplier,

    // Competency Framework
    competencyCatalogList, setCompetencyCatalogList,
    jobCompetenciesList, setJobCompetenciesList,
    competencyAssessmentsList, setCompetencyAssessmentsList,
    showCompetencyModal, setShowCompetencyModal,
    editingCompetency, setEditingCompetency,
    newCompetencyName, setNewCompetencyName,
    newCompetencyType, setNewCompetencyType,
    newCompetencyDesc, setNewCompetencyDesc,
    newCompetencyMaxLevel, setNewCompetencyMaxLevel,
    showJobCompetencyModal, setShowJobCompetencyModal,
    editingJobCompetency, setEditingJobCompetency,
    selectedJobPositionId, setSelectedJobPositionId,
    newJobCompetencyId, setNewJobCompetencyId,
    newRequiredLevel, setNewRequiredLevel,
    newCompetencyWeight, setNewCompetencyWeight,

    // Approval Routes Management
    showRouteModal, setShowRouteModal,
    editingRoute, setEditingRoute,
    routeName, setRouteName,
    routeTargetEntity, setRouteTargetEntity,
    routeOperation, setRouteOperation,
    routeRequesterRole, setRouteRequesterRole,
    routeRoutingType, setRouteRoutingType,
    routeApproverRole, setRouteApproverRole,
    routeApproverUserId, setRouteApproverUserId,
    routePriority, setRoutePriority,
    permissionGroups, setPermissionGroups,
    defaultGroups, setDefaultGroups,
    defaultGroupsDbId, setDefaultGroupsDbId,

    // Onboarding / Offboarding Modals
    showProcessModal, setShowProcessModal,
    newProcessEmployeeId, setNewProcessEmployeeId,
    newProcessTemplateId, setNewProcessTemplateId,
    showProcessDetailModal, setShowProcessDetailModal,
    selectedProcessId, setSelectedProcessId,

    // Appraisal cycles
    evaluationPeriodsList, setEvaluationPeriodsList,
    showPeriodModal, setShowPeriodModal,
    newPeriodName, setNewPeriodName,
    newPeriodStartDate, setNewPeriodStartDate,
    newPeriodEndDate, setNewPeriodEndDate,
    editingPeriod, setEditingPeriod,
    showAssignAppraisalModal, setShowAssignAppraisalModal,
    newAppraisalName, setNewAppraisalName,
    newAppraisalEmployeeId, setNewAppraisalEmployeeId,
    newAppraisalEvaluatorId, setNewAppraisalEvaluatorId,
    newAppraisalPeriodId, setNewAppraisalPeriodId,

    // Leaves
    leaveBalancesList, setLeaveBalancesList,
    leaveRequestsList, setLeaveRequestsList,
    holidaysList, setHolidaysList,
    overtimeRequestsList, setOvertimeRequestsList,

    // Holiday & Overtime Modals
    showHolidayModal, setShowHolidayModal,
    newHolidayName, setNewHolidayName,
    newHolidayDate, setNewHolidayDate,
    showOvertimeModal, setShowOvertimeModal,
    newOtDate, setNewOtDate,
    newOtStartTime, setNewOtStartTime,
    newOtEndTime, setNewOtEndTime,
    newOtHours, setNewOtHours,
    newOtType, setNewOtType,
    newOtReason, setNewOtReason,
    showOtApprovalModal, setShowOtApprovalModal,
    otToApproveId, setOtToApproveId,
    otApprovedHours, setOtApprovedHours,

    // Language localization
    language, setLanguage, toggleLanguage,
  };
}
