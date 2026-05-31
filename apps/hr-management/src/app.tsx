import React, { useEffect } from 'react';
import './App.css';

// Hooks
import { useAppState } from './hooks/useAppState';
import { useLiveData } from './hooks/useLiveData';
import { buildApprovalEngine, renderDiffContainer, ENTITY_MAPPINGS } from './hooks/useApprovalEngine';

// Services still used in CRUD handlers in this file
import { Cr5db_usersService } from './generated/services/Cr5db_usersService';
import { Cr5db_tasksService } from './generated/services/Cr5db_tasksService';
import { Cr5db_headcountrequestsService } from './generated/services/Cr5db_headcountrequestsService';
import { Cr5db_departmentsService } from './generated/services/Cr5db_departmentsService';
import { Cr5db_timesheetlogsService } from './generated/services/Cr5db_timesheetlogsService';
import { Cr5db_performanceappraisalsService } from './generated/services/Cr5db_performanceappraisalsService';
import { Cr5db_companiesService } from './generated/services/Cr5db_companiesService';
import { Cr5db_positioncatalogsService } from './generated/services/Cr5db_positioncatalogsService';
import { Cr5db_jobpositionsService } from './generated/services/Cr5db_jobpositionsService';
import { Cr5db_audittraillogsService } from './generated/services/Cr5db_audittraillogsService';
import { Cr5db_projectphasesService } from './generated/services/Cr5db_projectphasesService';
import { Cr5db_projectrisksService } from './generated/services/Cr5db_projectrisksService';
import { Cr5db_resourceallocationsService } from './generated/services/Cr5db_resourceallocationsService';
import { Cr5db_approvalroutesesService } from './generated/services/Cr5db_approvalroutesesService';
import { Cr5db_projectteamsService } from './generated/services/Cr5db_projectteamsService';
import { Cr5db_kpilibrariesService } from './generated/services/Cr5db_kpilibrariesService';
import { Cr5db_objectivesService } from './generated/services/Cr5db_objectivesService';
import { Cr5db_evaluationperiodsService } from './generated/services/Cr5db_evaluationperiodsService';
import { Cr5db_systemparametersService } from './generated/services/Cr5db_systemparametersService';

// SVG Icons
const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
  </svg>
);
const TaskIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);
const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const TargetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
const DirectoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const PerformanceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" /><path d="M12 2a4 4 0 0 0-4 4v8h8V6a4 4 0 0 0-4-4z" />
  </svg>
);
const RequestIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);
const ResourceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const ShieldCheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 11 11 13 15 9" />
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
// const UsersIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
//     <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
//     <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
//   </svg>
// );

import { FEATURE_TABS, hasTabPermission } from './lib/types';
import type { User, Task, PermissionGroup } from './lib/types';
import { getTranslation } from './lib/locales';

function App() {
  // ── Hooks ────────────────────────────────────────────────────────────────
  const s = useAppState();

  // Resource Allocation Modal local states
  const [showAllocationModal, setShowAllocationModal] = React.useState(false);
  const [allocationUser, setAllocationUser] = React.useState('');
  const [allocationProject, setAllocationProject] = React.useState('');
  const [allocationPercentage, setAllocationPercentage] = React.useState(100);
  const [allocationName, setAllocationName] = React.useState('');

  // KPI custom date filter states
  const [kpiCustomStartDate, setKpiCustomStartDate] = React.useState('2026-05-01');
  const [kpiCustomEndDate, setKpiCustomEndDate] = React.useState('2026-05-30');

  // Seeding status state
  const [seedingStatus, setSeedingStatus] = React.useState('');

  // Permission Group local states
  const [showGroupModal, setShowGroupModal] = React.useState(false);
  const [editingGroup, setEditingGroup] = React.useState<PermissionGroup | null>(null);
  const [newGroupName, setNewGroupName] = React.useState('');
  const [newGroupTabs, setNewGroupTabs] = React.useState<string[]>([]);
  const [employeeSelectedGroups, setEmployeeSelectedGroups] = React.useState<string[]>([]);

  // Destructure everything from state so the rest of the file can use names
  // identical to the old inline declarations — zero changes needed in JSX.
  const {
    activeTab, setActiveTab,
    requestsSubTab, setRequestsSubTab,
    expandedRequests, setExpandedRequests,
    activeRole, setActiveRole,
    currentUserEmail, setCurrentUserEmail,
    currentUserName, setCurrentUserName,
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
    kpiPeriod, setKpiPeriod,
    activeTimesheetSubTab, setActiveTimesheetSubTab,
    activePerformanceSubTab, setActivePerformanceSubTab,
    activeResourcesSubTab, setActiveResourcesSubTab,
    collapsedProjects, setCollapsedProjects,
    activeKpiSubTab, setActiveKpiSubTab,
    kpiTimeRange, setKpiTimeRange,
    activeDirectorySubTab, setActiveDirectorySubTab,
    showEmployeeModal, setShowEmployeeModal,
    editingEmployee, setEditingEmployee,
    employeeFullName, setEmployeeFullName,
    employeeEmail, setEmployeeEmail,
    employeeRole, setEmployeeRole,
    employeeJobPositionId, setEmployeeJobPositionId,
    employeeIsActive, setEmployeeIsActive,
    selectedDirectoryUser, setSelectedDirectoryUser,
    showProjectModal, setShowProjectModal,
    editingProject, setEditingProject,
    projectName, setProjectName,
    projectDesc, setProjectDesc,
    projectStartDate, setProjectStartDate,
    projectEndDate, setProjectEndDate,
    projectStatus, setProjectStatus,
    activeProjectDetails, setActiveProjectDetails,
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
    selectedDeptCompanyId, setSelectedDeptCompanyId,
    selectedReportsToPositionId, setSelectedReportsToPositionId,
    selectedKpiEmployeeFilter, setSelectedKpiEmployeeFilter,
    selectedKpiObjectiveFilter, setSelectedKpiObjectiveFilter,
    selectedKpiPeriodFilter, setSelectedKpiPeriodFilter,
    isSidebarHidden, setIsSidebarHidden,
    showNotificationsModal, setShowNotificationsModal,
    taskSearchQuery, setTaskSearchQuery,
    selectedFilterProject, setSelectedFilterProject,
    isLoading, setIsLoading,
    errorMsg, setErrorMsg,
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
    showTimesheetModal, setShowTimesheetModal,
    newTimesheetHours, setNewTimesheetHours,
    newTimesheetDate, setNewTimesheetDate,
    newTimesheetDesc, setNewTimesheetDesc,
    newTimesheetTaskId, setNewTimesheetTaskId,
    showRejectionModal, setShowRejectionModal,
    timesheetToRejectId, setTimesheetToRejectId,
    rejectionReason, setRejectionReason,
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
    showCompanyModal, setShowCompanyModal,
    newCompanyCode, setNewCompanyCode,
    newCompanyName, setNewCompanyName,
    showDeptModal, setShowDeptModal,
    newDeptCode, setNewDeptCode,
    newDeptName, setNewDeptName,
    editingCompany, setEditingCompany,
    editingDept, setEditingDept,
    showCatalogModal, setShowCatalogModal,
    newCatalogCode, setNewCatalogCode,
    newCatalogName, setNewCatalogName,
    editingCatalog, setEditingCatalog,
    showJobPositionModal, setShowJobPositionModal,
    newJobPosName, setNewJobPosName,
    newJobPosDeptId, setNewJobPosDeptId,
    newJobPosCatalogId, setNewJobPosCatalogId,
    newJobPosQuota, setNewJobPosQuota,
    editingJobPosition, setEditingJobPosition,
    showAssignRoleModal, setShowAssignRoleModal,
    assignRoleUserId, setAssignRoleUserId,
    assignRoleName, setAssignRoleName,
    assignRoleNotes, setAssignRoleNotes,
    showApprovalModal, setShowApprovalModal,
    approvalModalData, setApprovalModalData,
    requestReason, setRequestReason,
    selectedApproverId, setSelectedApproverId,
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
    // KPI Catalog
    activeKpiCatalogSubTab, setActiveKpiCatalogSubTab,
    showKpiLibraryModal, setShowKpiLibraryModal,
    editingKpiLibrary, setEditingKpiLibrary,
    kpiLibName, setKpiLibName,
    kpiLibUnit, setKpiLibUnit,
    kpiLibFormula, setKpiLibFormula,
    showObjectiveModal, setShowObjectiveModal,
    editingObjective, setEditingObjective,
    objectiveName, setObjectiveName,
    objectiveTarget, setObjectiveTarget,
    permissionGroups, setPermissionGroups,
    defaultGroups, setDefaultGroups,
    defaultGroupsDbId, setDefaultGroupsDbId,

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
    language, toggleLanguage,
  } = s;

  const t = (key: string) => getTranslation(key, language);

  // ── Live Data ─────────────────────────────────────────────────────────────
  const { fetchLiveValues } = useLiveData({
    setIsLoading, setErrorMsg,
    setCurrentUserEmail, setCurrentUserName, setActiveRole,
    setUsersList, setDepartmentsList, setCompaniesList,
    setPositionCatalogList, setJobPositionsList, setAuditLogsList,
    setResourceAllocationsList, setObjectivesList,
    setProjects, setProjectPhases, setProjectRisks,
    setSystemNotifications, setKpiLibrariesList,
    setApprovalRoutesList, setChangeRequestsList, setProjectTeamsList,
    setTasks, setHeadcountRequests, setKpiTargets,
    setTimesheets, setAppraisals, setEvaluationPeriodsList,
    setNewReqDeptId, setNewJobPosDeptId,
    setNewTaskAssigneeId, setAssignRoleUserId,
    setNewReqCatalogId, setNewJobPosCatalogId,
    setSelectedDeptCompanyId, setNewTimesheetTaskId,
    setPermissionGroups, setDefaultGroups,
    setDefaultGroupsDbId,
  });

  // ── Approval Engine ───────────────────────────────────────────────────────
  const {
    executeCrudWithApproval,
    handleApproveChangeRequest,
    handleRejectChangeRequest,
    handleSubmittingApprovalRequest,
  } = buildApprovalEngine({
    activeRole, currentUserEmail,
    usersList, jobPositionsList, approvalRoutesList,
    setIsLoading, setApprovalModalData, setSelectedApproverId,
    setRequestReason, setShowApprovalModal,
    approvalModalData, requestReason, selectedApproverId,
    fetchLiveValues,
  });

  const currentUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
  const checkPermission = (tabId: string) => {
    if (activeRole === 'Admin') return true;
    return hasTabPermission(currentUserObj, tabId, permissionGroups);
  };

  // ── CRUD API Calls ───────────────────────────────────────────────────────

  // Tasks CRUD
  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    try {
      setIsLoading(true);
      const payload: any = {
        cr5db_taskname: newTaskName,
        cr5db_description: newTaskDesc,
        cr5db_duedate: newTaskDueDate || new Date().toISOString().split('T')[0],
      };

      if (editingTask) {
        if (newTaskAssigneeId) {
          payload["cr5db_AssigneeID@odata.bind"] = `/cr5db_users(${newTaskAssigneeId})`;
        } else {
          payload.cr5db_AssigneeID = null;
        }

        if (newTaskObjectiveId) {
          payload["cr5db_ObjectiveName@odata.bind"] = `/cr5db_objectives(${newTaskObjectiveId})`;
        } else {
          payload.cr5db_ObjectiveName = null;
        }

        if (newTaskParentId) {
          payload["cr5db_ParentTask@odata.bind"] = `/cr5db_tasks(${newTaskParentId})`;
        } else {
          payload.cr5db_ParentTask = null;
        }

        if (newTaskPhaseId) {
          payload["cr5db_ProjectPhaseID@odata.bind"] = `/cr5db_projectphases(${newTaskPhaseId})`;
        } else {
          payload.cr5db_ProjectPhaseID = null;
        }

        payload.statecode = newTaskStatus === 'Completed' ? 1 : 0;
        payload.statuscode = newTaskStatus === 'Completed' ? 2 : 1;

        await executeCrudWithApproval("Tasks", "Update", payload, editingTask.cr5db_taskid, `Cập nhật công việc: ${newTaskName}`, editingTask);

        const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
        await Cr5db_audittraillogsService.create({
          cr5db_logname: "Task Update Request",
          cr5db_actionexecuted: `Requested/Executed task update: ${newTaskName}`,
          cr5db_changedfromvalue: editingTask.cr5db_status,
          cr5db_changedtovalue: `By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
        } as any);
      } else {
        const currentUserRecord = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
        const assigneeId = newTaskAssigneeId || currentUserRecord?.cr5db_userid;
        
        if (assigneeId) {
          payload["cr5db_AssigneeID@odata.bind"] = `/cr5db_users(${assigneeId})`;
        }
        if (newTaskObjectiveId) {
          payload["cr5db_ObjectiveName@odata.bind"] = `/cr5db_objectives(${newTaskObjectiveId})`;
        }
        if (newTaskParentId) {
          payload["cr5db_ParentTask@odata.bind"] = `/cr5db_tasks(${newTaskParentId})`;
        }
        if (newTaskPhaseId) {
          payload["cr5db_ProjectPhaseID@odata.bind"] = `/cr5db_projectphases(${newTaskPhaseId})`;
        }

        await executeCrudWithApproval("Tasks", "Create", payload, undefined, `Tạo công việc mới: ${newTaskName}`);

        const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
        await Cr5db_audittraillogsService.create({
          cr5db_logname: "Task Creation Request",
          cr5db_actionexecuted: `Requested/Executed task creation: ${newTaskName}`,
          cr5db_changedfromvalue: "None",
          cr5db_changedtovalue: `By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
        } as any);
      }

      setShowTaskModal(false);
      setEditingTask(null);
      setNewTaskName('');
      setNewTaskDesc('');
      setNewTaskProjectId('');
      setNewTaskPhaseId('');
      setNewTaskObjectiveId('');
      setNewTaskParentId('');
      setNewTaskAssigneeId('');
      // Note: fetchLiveValues is called inside executeCrudWithApproval or inside modal submit
    } catch (err) {
      console.error(err);
      alert("Không thể lưu công việc.");
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa công việc này không?");
    if (!confirmDelete) return;
    try {
      setIsLoading(true);
      const targetTask = tasks.find(t => t.cr5db_taskid === taskId);
      await executeCrudWithApproval("Tasks", "Delete", null, taskId, `Xóa công việc: ${targetTask?.cr5db_taskname || taskId}`, targetTask);
      
      const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
      await Cr5db_audittraillogsService.create({
        cr5db_logname: "Task Deletion Request",
        cr5db_actionexecuted: `Requested/Executed task deletion for ID ${taskId}`,
        cr5db_changedfromvalue: "Active/Completed",
        cr5db_changedtovalue: `By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
      } as any);

      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể xóa công việc.");
      setIsLoading(false);
    }
  };

  const handleUpdateTaskStatus = async (id: string, _status: any) => {
    try {
      setIsLoading(true);
      await Cr5db_tasksService.update(id, { statecode: 1 });
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể cập nhật trạng thái công việc.");
      setIsLoading(false);
    }
  };

  // Timesheets
  const handleAddTimesheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimesheetDesc.trim()) return;
    try {
      setIsLoading(true);
      const matchedUser = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
      const record = {
        cr5db_timesheetlog1: newTimesheetDesc,
        cr5db_actualhoursworked: Number(newTimesheetHours),
        cr5db_logdate: newTimesheetDate || new Date().toISOString().split('T')[0],
        "cr5db_UserID@odata.bind": matchedUser ? `/cr5db_users(${matchedUser.cr5db_userid})` : undefined,
        "cr5db_TaskID@odata.bind": newTimesheetTaskId ? `/cr5db_tasks(${newTimesheetTaskId})` : undefined,
        statecode: 0
      };
      await Cr5db_timesheetlogsService.create(record as any);
      setShowTimesheetModal(false);
      setNewTimesheetDesc('');
      setNewTimesheetHours(8);
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể gửi timesheet log.");
      setIsLoading(false);
    }
  };

  const handleApproveTimesheet = async (id: string) => {
    try {
      setIsLoading(true);
      // statecode:1 = Inactive (closed), statuscode:2 = Inactive (database approved)
      await Cr5db_timesheetlogsService.update(id, { statecode: 1, statuscode: 2 } as any);
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert('Không thể phê duyệt timesheet.');
      setIsLoading(false);
    }
  };

  const handleUpdateAppraisalScore = async (id: string, score: number) => {
    try {
      setIsLoading(true);
      await Cr5db_performanceappraisalsService.update(id, { cr5db_finalscore: score });
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể cập nhật điểm đánh giá.");
      setIsLoading(false);
    }
  };

  const handleUpdateSelfAppraisalScore = async (id: string, score: number) => {
    try {
      setIsLoading(true);
      await Cr5db_performanceappraisalsService.update(id, { cr5db_selfscore: score });
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể cập nhật điểm tự chấm.");
      setIsLoading(false);
    }
  };

  const handleAutoCalculateAppraisal = async (id: string, email: string) => {
    if (!email) return;
    const employeeKpis = kpiTargets.filter(k => k.cr5db_user_email.toLowerCase() === email.toLowerCase());
    if (employeeKpis.length === 0) {
      alert("Không tìm thấy dữ liệu KPI nào được gán cho nhân sự này để tự động tính điểm.");
      return;
    }

    let totalWeight = 0;
    let weightedScore = 0;
    let breakdownLines: string[] = [];

    employeeKpis.forEach((k, idx) => {
      const target = k.cr5db_targetvalue || 100;
      const actual = k.cr5db_actualvalue || 0;
      const weight = k.cr5db_weightpercentage || 0;
      const rate = target > 0 ? actual / target : 0;
      const contribution = rate * weight;

      weightedScore += contribution;
      totalWeight += weight;

      const pctComplete = Math.round(rate * 100);
      breakdownLines.push(
        `${idx + 1}. ${k.cr5db_kpiname}\n` +
        `   • Thực tế: ${actual} / ${target} ${k.cr5db_unit} (Hoàn thành: ${pctComplete}%)\n` +
        `   • Tỷ trọng: ${weight}% | Đóng góp: ${contribution.toFixed(1)}%`
      );
    });

    const suggested = totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 75;

    const confirmMessage = 
      `--- BẢNG CHI TIẾT TÍNH TOÁN ĐIỂM HIỆU SUẤT ---\n\n` +
      `Nhân viên: ${email}\n` +
      `Số lượng KPI đánh giá: ${employeeKpis.length}\n\n` +
      `Chi tiết các chỉ tiêu:\n` +
      `--------------------------------------------------\n` +
      `${breakdownLines.join('\n\n')}\n` +
      `--------------------------------------------------\n` +
      `• Tổng tỷ trọng các KPI: ${totalWeight}%\n` +
      `• Tổng đóng góp có trọng số: ${weightedScore.toFixed(1)}%\n` +
      `• Công thức: (Tổng đóng góp / Tổng tỷ trọng) * 100\n` +
      `• Điểm hiệu suất đề xuất: ${suggested} / 100\n\n` +
      `Bạn có muốn áp dụng điểm hiệu suất ${suggested}/100 này làm điểm chung cuộc không?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      setIsLoading(true);
      await Cr5db_performanceappraisalsService.update(id, { cr5db_finalscore: suggested });
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tự động tính toán điểm đánh giá.");
      setIsLoading(false);
    }
  };

  const handleRejectTimesheetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) return;
    try {
      setIsLoading(true);
      const tsRecord = timesheets.find(t => t.cr5db_timesheetlogid === timesheetToRejectId);
      const originalDesc = tsRecord?.cr5db_timesheetlog1 || '';
      const prefix = `[Từ chối] ${rejectionReason.trim()} | `;
      const newDesc = originalDesc.startsWith('[Từ chối]') ? originalDesc : (prefix + originalDesc);

      // statecode:1 = Inactive (closed), statuscode:2 = Rejected
      await Cr5db_timesheetlogsService.update(timesheetToRejectId, { 
        statecode: 1, 
        statuscode: 2,
        cr5db_timesheetlog1: newDesc
      } as any);

      const adminUser = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
      await Cr5db_audittraillogsService.create({
        cr5db_logname: 'Timesheet Rejection',
        cr5db_actionexecuted: `Timesheet log ${timesheetToRejectId} rejected`,
        cr5db_changedfromvalue: 'Status: Pending',
        cr5db_changedtovalue: `Reason: ${rejectionReason} | Rejected By: ${adminUser?.cr5db_fullname || currentUserEmail}`
      } as any);

      setShowRejectionModal(false);
      setRejectionReason('');
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi từ chối timesheet.');
      setIsLoading(false);
    }
  };

  const handleSavePeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPeriodName.trim()) return;
    try {
      setIsLoading(true);
      if (editingPeriod) {
        await Cr5db_evaluationperiodsService.update(editingPeriod.cr5db_evaluationperiodid, {
          cr5db_evaluationperiod1: newPeriodName,
          cr5db_startdate: newPeriodStartDate || undefined,
          cr5db_enddate: newPeriodEndDate || undefined
        } as any);
      } else {
        await Cr5db_evaluationperiodsService.create({
          cr5db_evaluationperiod1: newPeriodName,
          cr5db_startdate: newPeriodStartDate || undefined,
          cr5db_enddate: newPeriodEndDate || undefined,
          cr5db_islocked: false
        } as any);
      }
      setShowPeriodModal(false);
      setEditingPeriod(null);
      setNewPeriodName('');
      setNewPeriodStartDate('');
      setNewPeriodEndDate('');
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể lưu chu kỳ đánh giá.");
      setIsLoading(false);
    }
  };

  const handleDeletePeriod = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chu kỳ đánh giá này không?")) return;
    try {
      setIsLoading(true);
      await Cr5db_evaluationperiodsService.delete(id);
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể xóa chu kỳ đánh giá.");
      setIsLoading(false);
    }
  };

  const handleTogglePeriodLock = async (id: string, currentVal: boolean) => {
    try {
      setIsLoading(true);
      await Cr5db_evaluationperiodsService.update(id, { cr5db_islocked: !currentVal } as any);
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể thay đổi trạng thái khóa chu kỳ.");
      setIsLoading(false);
    }
  };

  const handleAssignAppraisal = async (e: React.FormEvent) => {
    e.preventDefault();
    const empId = newAppraisalEmployeeId || usersList[0]?.cr5db_userid;
    const evalId = newAppraisalEvaluatorId || usersList[0]?.cr5db_userid;
    const periodId = newAppraisalPeriodId || evaluationPeriodsList[0]?.cr5db_evaluationperiodid;
    if (!empId || !evalId || !periodId) {
      alert("Vui lòng điền đầy đủ các trường thông tin bắt buộc.");
      return;
    }

    const pRecord = evaluationPeriodsList.find(x => x.cr5db_evaluationperiodid === periodId);
    const empRecord = usersList.find(x => x.cr5db_userid === empId);

    const finalAppraisalName = newAppraisalName.trim() || 
      `Đánh giá hiệu suất ${empRecord?.cr5db_fullname || ''} ${pRecord?.cr5db_evaluationperiod1 || ''}`;

    try {
      setIsLoading(true);
      await Cr5db_performanceappraisalsService.create({
        cr5db_performanceappraisal1: finalAppraisalName,
        "cr5db_EmployeeID@odata.bind": `/cr5db_users(${empId})`,
        "cr5db_EvaluatorID@odata.bind": `/cr5db_users(${evalId})`,
        "cr5db_PeriodID@odata.bind": `/cr5db_evaluationperiods(${periodId})`,
        cr5db_finalscore: 0,
        cr5db_selfscore: 0
      } as any);

      setShowAssignAppraisalModal(false);
      setNewAppraisalName('');
      setNewAppraisalEmployeeId('');
      setNewAppraisalEvaluatorId('');
      setNewAppraisalPeriodId('');
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể phát động đợt đánh giá mới.");
      setIsLoading(false);
    }
  };

  // Company and Departments
  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyCode.trim() || !newCompanyName.trim()) return;
    try {
      setIsLoading(true);
      if (editingCompany) {
        await Cr5db_companiesService.update(editingCompany.cr5db_companyid, {
          cr5db_companycode: newCompanyCode,
          cr5db_companyname: newCompanyName
        } as any);
      } else {
        await Cr5db_companiesService.create({
          cr5db_companycode: newCompanyCode,
          cr5db_companyname: newCompanyName
        } as any);
      }
      setShowCompanyModal(false);
      setEditingCompany(null);
      setNewCompanyCode('');
      setNewCompanyName('');
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu thông tin công ty.");
      setIsLoading(false);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa công ty này không? Việc này sẽ đồng thời xóa tất cả các phòng ban trực thuộc.")) return;
    try {
      setIsLoading(true);
      
      // Cascade delete: Find all departments linked to this company
      const linkedDepts = departmentsList.filter(d => d._cr5db_companyid_value === id);
      console.log(`Cascade deleting ${linkedDepts.length} departments linked to company ${id}...`);
      
      // Delete all linked departments
      for (const dept of linkedDepts) {
        await Cr5db_departmentsService.delete(dept.cr5db_departmentid);
      }
      
      // Finally delete the company
      await Cr5db_companiesService.delete(id);
      await fetchLiveValues();
    } catch (err: any) {
      console.error(err);
      alert("Không thể xóa công ty: " + (err.message || err));
      setIsLoading(false);
    }
  };

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptCode.trim() || !newDeptName.trim()) return;
    try {
      setIsLoading(true);
      if (editingDept) {
        await Cr5db_departmentsService.update(editingDept.cr5db_departmentid, {
          cr5db_departmentcode: newDeptCode,
          cr5db_departmentname: newDeptName,
          "cr5db_CompanyID@odata.bind": selectedDeptCompanyId ? `/cr5db_companies(${selectedDeptCompanyId})` : undefined
        } as any);
      } else {
        await Cr5db_departmentsService.create({
          cr5db_departmentcode: newDeptCode,
          cr5db_departmentname: newDeptName,
          "cr5db_CompanyID@odata.bind": selectedDeptCompanyId ? `/cr5db_companies(${selectedDeptCompanyId})` : undefined
        } as any);
      }
      setShowDeptModal(false);
      setEditingDept(null);
      setNewDeptCode('');
      setNewDeptName('');
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu thông tin phòng ban.");
      setIsLoading(false);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phòng ban này không?")) return;
    try {
      setIsLoading(true);
      await Cr5db_departmentsService.delete(id);
      await fetchLiveValues();
    } catch (err: any) {
      console.error(err);
      alert("Không thể xóa phòng ban: " + (err.message || err));
      setIsLoading(false);
    }
  };

  // Positions Catalog
  const handleAddCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatalogCode.trim() || !newCatalogName.trim()) return;
    try {
      setIsLoading(true);
      if (editingCatalog) {
        await Cr5db_positioncatalogsService.update(editingCatalog.cr5db_positioncatalogid, {
          cr5db_code: newCatalogCode,
          cr5db_positioncatalog1: newCatalogName
        } as any);
      } else {
        await Cr5db_positioncatalogsService.create({
          cr5db_code: newCatalogCode,
          cr5db_positioncatalog1: newCatalogName
        } as any);
      }
      setShowCatalogModal(false);
      setEditingCatalog(null);
      setNewCatalogCode('');
      setNewCatalogName('');
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu danh mục chức danh.");
      setIsLoading(false);
    }
  };

  const handleDeleteCatalog = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chức danh này không?")) return;
    try {
      setIsLoading(true);
      await Cr5db_positioncatalogsService.delete(id);
      await fetchLiveValues();
    } catch (err: any) {
      console.error(err);
      alert("Không thể xóa chức danh: " + (err.message || err));
      setIsLoading(false);
    }
  };

  // KPI Library CRUD
  const handleSaveKpiLibrary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kpiLibName.trim()) return;
    try {
      setIsLoading(true);
      const payload: any = {
        cr5db_kpiname: kpiLibName,
        cr5db_unit: kpiLibUnit,
        cr5db_formula: kpiLibFormula,
        statecode: 0,
      };
      if (editingKpiLibrary) {
        await Cr5db_kpilibrariesService.update(editingKpiLibrary.cr5db_kpilibraryid, payload);
      } else {
        await Cr5db_kpilibrariesService.create(payload);
      }
      setShowKpiLibraryModal(false);
      setEditingKpiLibrary(null);
      setKpiLibName(''); setKpiLibUnit('%'); setKpiLibFormula('');
      await fetchLiveValues();
    } catch (err) { console.error(err); alert('Loi khi luu thu vien KPI.'); setIsLoading(false); }
  };

  const handleDeleteKpiLibrary = async (id: string) => {
    if (!window.confirm('Xoa muc KPI nay khoi thu vien?')) return;
    try {
      setIsLoading(true);
      await Cr5db_kpilibrariesService.delete(id);
      await fetchLiveValues();
    } catch (err) { console.error(err); alert('Khong the xoa muc KPI.'); setIsLoading(false); }
  };

  // Objectives CRUD
  const handleSaveObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objectiveName.trim()) return;
    try {
      setIsLoading(true);
      const payload: any = {
        cr5db_objective1: objectiveName,
        cr5db_targetvalue: objectiveTarget,
        statecode: 0,
      };
      if (editingObjective) {
        await Cr5db_objectivesService.update(editingObjective.cr5db_objectiveid, payload);
      } else {
        await Cr5db_objectivesService.create(payload);
      }
      setShowObjectiveModal(false);
      setEditingObjective(null);
      setObjectiveName(''); setObjectiveTarget(100);
      await fetchLiveValues();
    } catch (err) { console.error(err); alert('Loi khi luu muc tieu.'); setIsLoading(false); }
  };

  const handleDeleteObjective = async (id: string) => {
    if (!window.confirm('Xoa muc tieu nay?')) return;
    try {
      setIsLoading(true);
      await Cr5db_objectivesService.delete(id);
      await fetchLiveValues();
    } catch (err) { console.error(err); alert('Khong the xoa muc tieu.'); setIsLoading(false); }
  };

  // Approval Routes CRUD Handlers
  const handleSaveRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeName.trim()) {
      alert("Tên quy tắc không được để trống.");
      return;
    }
    try {
      setIsLoading(true);
      const payload: any = {
        cr5db_routename: routeName,
        cr5db_targetentity: Number(routeTargetEntity),
        cr5db_operationtype: Number(routeOperation),
        cr5db_requesterrole: Number(routeRequesterRole),
        cr5db_routingtype: Number(routeRoutingType),
        cr5db_approverrole: routeApproverRole || '',
        cr5db_priority: Number(routePriority),
        cr5db_isactive: true,
      };

      if (routeApproverUserId) {
        payload["cr5db_ApproverUser@odata.bind"] = `/cr5db_users(${routeApproverUserId})`;
      } else if (editingRoute) {
        payload.cr5db_ApproverUser = null;
      }

      if (editingRoute) {
        await Cr5db_approvalroutesesService.update(editingRoute.cr5db_approvalroutesid, payload);
      } else {
        await Cr5db_approvalroutesesService.create(payload);
      }

      setShowRouteModal(false);
      setEditingRoute(null);
      setRouteName('');
      setRouteApproverRole('');
      setRouteApproverUserId('');
      setRoutePriority(10);
      await fetchLiveValues();
    } catch (err: any) {
      console.error(err);
      alert(`Lỗi khi lưu quy tắc duyệt: ${err.message || err}`);
      setIsLoading(false);
    }
  };

  const handleDeleteRoute = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa quy tắc phê duyệt này?")) return;
    try {
      setIsLoading(true);
      await Cr5db_approvalroutesesService.delete(id);
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể xóa quy tắc phê duyệt.");
      setIsLoading(false);
    }
  };

  // Permission Groups CRUD Handlers
  const handleSavePermissionGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      alert("Tên nhóm quyền không được để trống.");
      return;
    }
    try {
      setIsLoading(true);
      const TAB_MAP: Record<string, string> = {
        dashboard: 'a', tasks: 'b', timesheets: 'c', kpi: 'd', performance: 'f',
        companies: 'g', positions: 'h', headcount: 'i', requests: 'e',
        directory: 'j', resources: 'k', routes: 'l', 'kpi-catalog': 'm'
      };
      const codes = newGroupTabs.map(t => TAB_MAP[t] || '').join('');
      const payloadVal = `${newGroupName}|${codes}`;

      if (editingGroup) {
        if (!editingGroup.dbId) throw new Error("Thiếu ID cơ sở dữ liệu của nhóm quyền.");
        const res = await Cr5db_systemparametersService.update(editingGroup.dbId, {
          cr5db_paramvalue: payloadVal
        });
        if (res.error) throw new Error(res.error.message);
      } else {
        const slug = `pg_${Math.random().toString(36).substring(2, 8)}`;
        const res = await Cr5db_systemparametersService.create({
          cr5db_systemparameter1: slug,
          cr5db_paramvalue: payloadVal,
          cr5db_valuetype: 'PermissionGroup',
          statecode: 0
        } as any);
        if (res.error) throw new Error(res.error.message);
      }

      await Cr5db_audittraillogsService.create({
        cr5db_logname: editingGroup ? "Permission Group Update" : "Permission Group Creation",
        cr5db_actionexecuted: `${editingGroup ? "Cập nhật" : "Tạo mới"} nhóm quyền: ${newGroupName}`,
        cr5db_changedfromvalue: editingGroup ? JSON.stringify(editingGroup.tabs) : "None",
        cr5db_changedtovalue: JSON.stringify(newGroupTabs)
      } as any);

      setShowGroupModal(false);
      setEditingGroup(null);
      setNewGroupName('');
      setNewGroupTabs([]);
      await fetchLiveValues();
      alert("Lưu nhóm quyền thành công!");
    } catch (err: any) {
      console.error(err);
      alert(`Lỗi khi lưu nhóm quyền: ${err.message || err}`);
      setIsLoading(false);
    }
  };

  const handleDeletePermissionGroup = async (group: PermissionGroup) => {
    if (!group.dbId) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhóm quyền "${group.name}"? Tất cả người dùng trong nhóm sẽ mất quyền liên quan.`)) return;
    try {
      setIsLoading(true);
      await Cr5db_systemparametersService.delete(group.dbId);

      await Cr5db_audittraillogsService.create({
        cr5db_logname: "Permission Group Deletion",
        cr5db_actionexecuted: `Xóa nhóm quyền: ${group.name} (${group.id})`,
        cr5db_changedfromvalue: JSON.stringify(group.tabs),
        cr5db_changedtovalue: "Deleted"
      } as any);

      // Clean up user assignments for this deleted group
      for (const u of usersList) {
        const roleStr = u.cr5db_systemrole || '';
        if (roleStr.startsWith('Employee:')) {
          const groups = roleStr.substring(9).split(',');
          if (groups.includes(group.id)) {
            const filtered = groups.filter(g => g !== group.id);
            const newRoleStr = filtered.length > 0 ? `Employee:${filtered.join(',')}` : 'Employee';
            await Cr5db_usersService.update(u.cr5db_userid, { cr5db_systemrole: newRoleStr });
          }
        }
      }

      await fetchLiveValues();
      alert("Xóa nhóm quyền thành công!");
    } catch (err: any) {
      console.error(err);
      alert(`Lỗi khi xóa nhóm quyền: ${err.message || err}`);
      setIsLoading(false);
    }
  };

  const handleSaveDefaultGroups = async (groupIds: string[]) => {
    try {
      setIsLoading(true);
      const val = groupIds.join(',');
      if (defaultGroupsDbId) {
        const res = await Cr5db_systemparametersService.update(defaultGroupsDbId, {
          cr5db_paramvalue: val
        });
        if (res.error) throw new Error(res.error.message);
      } else {
        const res = await Cr5db_systemparametersService.create({
          cr5db_systemparameter1: 'DefaultPermissionGroups',
          cr5db_paramvalue: val,
          cr5db_valuetype: 'DefaultPermissionGroups',
          statecode: 0
        } as any);
        if (res.error) throw new Error(res.error.message);
      }
      await fetchLiveValues();
      alert("Cập nhật nhóm mặc định thành công!");
    } catch (err: any) {
      console.error(err);
      alert(`Lỗi khi cập nhật nhóm mặc định: ${err.message || err}`);
      setIsLoading(false);
    }
  };

  // Job Positions (Headcount)
  const handleAddJobPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobPosName.trim()) return;
    try {
      setIsLoading(true);
      const payload: any = {
        cr5db_positionname: newJobPosName,
        cr5db_headcountquota: Number(newJobPosQuota)
      };

      if (editingJobPosition) {
        if (newJobPosDeptId) {
          payload["cr5db_Department@odata.bind"] = `/cr5db_departments(${newJobPosDeptId})`;
        } else {
          payload.cr5db_Department = null;
        }

        if (newJobPosCatalogId) {
          payload["cr5db_PositionCatalogTitle@odata.bind"] = `/cr5db_positioncatalogs(${newJobPosCatalogId})`;
        } else {
          payload.cr5db_PositionCatalogTitle = null;
        }

        if (selectedReportsToPositionId) {
          payload["cr5db_ReportsToPositionID@odata.bind"] = `/cr5db_jobpositions(${selectedReportsToPositionId})`;
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

        await executeCrudWithApproval(
          "JobPositions",
          "Create",
          payload,
          undefined,
          `Tạo vị trí công việc mới: ${newJobPosName}`
        );
      }
      setShowJobPositionModal(false);
      setEditingJobPosition(null);
      setNewJobPosName('');
      setNewJobPosQuota(1);
      setNewJobPosDeptId('');
      setNewJobPosCatalogId('');
    } catch (err: any) {
      console.error(err);
      alert(`Lỗi khi lưu job position: ${err.message || err}`);
      setIsLoading(false);
    }
  };

  const handleDeleteJobPosition = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa job position này không?")) return;
    try {
      setIsLoading(true);
      const targetPos = jobPositionsList.find(pos => pos.cr5db_jobpositionid === id);
      await executeCrudWithApproval(
        "JobPositions",
        "Delete",
        null,
        id,
        `Xóa vị trí công việc: ${targetPos?.cr5db_positionname || id}`,
        targetPos
      );
    } catch (err) {
      console.error(err);
      alert("Không thể xóa job position.");
      setIsLoading(false);
    }
  };

  // Headcount Requests
  // Headcount Requests CRUD
  const handleSaveHeadcountRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestName.trim() || !newReqReason.trim()) return;
    try {
      setIsLoading(true);
      const reqTypeVal = newRequestType === 'Decrease Headcount' ? 122650001 : newRequestType === 'New Position' ? 122650002 : 122650000;
      
      const payload: any = {
        cr5db_requestname: newRequestName,
        cr5db_requestedquantity: Number(newReqQty),
        cr5db_reason: newReqReason,
        cr5db_requesttype: reqTypeVal,
      };

      if (newReqDeptId) {
        payload["cr5db_Department@odata.bind"] = `/cr5db_departments(${newReqDeptId})`;
      } else if (editingHeadcountRequest) {
        payload.cr5db_Department = null;
      }

      if (newReqCatalogId) {
        payload["cr5db_PositionCatalog@odata.bind"] = `/cr5db_positioncatalogs(${newReqCatalogId})`;
      } else if (editingHeadcountRequest) {
        payload.cr5db_PositionCatalog = null;
      }

      if (newReqReportsToId) {
        payload["cr5db_ApproverPosition@odata.bind"] = `/cr5db_jobpositions(${newReqReportsToId})`;
      } else if (editingHeadcountRequest) {
        payload.cr5db_ApproverPosition = null;
      }

      if (editingHeadcountRequest) {
        let isTransitioningToApproved = false;
        if (activeRole === 'Admin') {
          let statusVal = 122650000;
          if (newReqStatus === 'Approved') {
            statusVal = 122650001;
            if (editingHeadcountRequest.cr5db_approvalstatus !== 'Approved') {
              isTransitioningToApproved = true;
            }
          }
          else if (newReqStatus === 'Rejected') statusVal = 122650002;
          payload.cr5db_approvalstatus = statusVal;
        }

        await executeCrudWithApproval(
          "HeadcountRequests",
          "Update",
          payload,
          editingHeadcountRequest.cr5db_headcountrequestid,
          `Cập nhật đề xuất headcount: ${newRequestName}`,
          editingHeadcountRequest
        );

        if (isTransitioningToApproved) {
          const tempReq = {
            ...editingHeadcountRequest,
            cr5db_requestedquantity: Number(newReqQty),
            cr5db_requesttype: newRequestType,
            _cr5db_department_value: newReqDeptId || undefined,
            _cr5db_positioncatalog_value: newReqCatalogId || undefined,
            _cr5db_approverposition_value: newReqReportsToId || undefined
          };
          await updateJobPositionQuotaForRequest(tempReq);
        }

        const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
        await Cr5db_audittraillogsService.create({
          cr5db_logname: "Headcount Request Update Request",
          cr5db_actionexecuted: `Requested/Executed headcount request update: ${newRequestName}`,
          cr5db_changedfromvalue: editingHeadcountRequest.cr5db_approvalstatus,
          cr5db_changedtovalue: `By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
        } as any);
      } else {
        payload.cr5db_approvalstatus = 122650000;
        payload.cr5db_createddate = new Date().toISOString().split('T')[0];

        await executeCrudWithApproval(
          "HeadcountRequests",
          "Create",
          payload,
          undefined,
          `Đề xuất định biên mới: ${newRequestName}`
        );

        const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
        await Cr5db_audittraillogsService.create({
          cr5db_logname: "Headcount Request Creation Request",
          cr5db_actionexecuted: `Requested/Executed headcount request creation: ${newRequestName}`,
          cr5db_changedfromvalue: "None",
          cr5db_changedtovalue: `By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
        } as any);
      }

      setShowHeadcountRequestModal(false);
      setEditingHeadcountRequest(null);
      setNewRequestName('');
      setNewReqReason('');
      setNewReqReportsToId('');
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu đề xuất headcount.");
      setIsLoading(false);
    }
  };

  const handleDeleteHeadcountRequest = async (id: string) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa đề xuất headcount này không?");
    if (!confirmDelete) return;
    try {
      setIsLoading(true);
      const targetRequest = headcountRequests.find(r => r.cr5db_headcountrequestid === id);
      await executeCrudWithApproval(
        "HeadcountRequests",
        "Delete",
        null,
        id,
        `Xóa đề xuất headcount: ${targetRequest?.cr5db_requestname || id}`,
        targetRequest
      );
      
      const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
      await Cr5db_audittraillogsService.create({
        cr5db_logname: "Headcount Request Deletion Request",
        cr5db_actionexecuted: `Requested/Executed headcount request deletion: ${targetRequest?.cr5db_requestname || id}`,
        cr5db_changedfromvalue: "Active",
        cr5db_changedtovalue: `By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
      } as any);
    } catch (err) {
      console.error(err);
      alert("Xóa đề xuất headcount thất bại.");
      setIsLoading(false);
    }
  };

  const updateJobPositionQuotaForRequest = async (r: any) => {
    const matchingPos = jobPositionsList.find(pos => {
      const posDept = pos._cr5db_department_value || '';
      const reqDept = r._cr5db_department_value || '';
      const posCatalog = pos._cr5db_positioncatalogtitle_value || '';
      const reqCatalog = r._cr5db_positioncatalog_value || '';
      return posDept === reqDept && posCatalog === reqCatalog;
    });

    const qty = Number(r.cr5db_requestedquantity) || 1;
    const isDecrease = r.cr5db_requesttype === 'Decrease Headcount' || r.raw_requesttype === 122650001;

    if (matchingPos) {
      const currentQuota = Number(matchingPos.cr5db_headcountquota) || 0;
      const newQuota = isDecrease ? Math.max(0, currentQuota - qty) : currentQuota + qty;

      const res = await Cr5db_jobpositionsService.update(matchingPos.cr5db_jobpositionid, {
        cr5db_headcountquota: newQuota
      });
      if (res.error) {
        throw new Error(res.error.message || "Lỗi đồng bộ định biên vị trí.");
      }
      console.log(`Updated job position ${matchingPos.cr5db_positionname} quota to ${newQuota}`);
    } else {
      if (!isDecrease) {
        const catalog = positionCatalogList.find(c => c.cr5db_positioncatalogid === r._cr5db_positioncatalog_value);
        const name = catalog?.cr5db_positioncatalog1 || r.cr5db_positiontitle || 'Vị trí mới';
        
        const payload: any = {
          cr5db_positionname: name,
          cr5db_headcountquota: qty
        };

        if (r._cr5db_department_value) {
          payload["cr5db_Department@odata.bind"] = `/cr5db_departments(${r._cr5db_department_value})`;
        }
        if (r._cr5db_positioncatalog_value) {
          payload["cr5db_PositionCatalogTitle@odata.bind"] = `/cr5db_positioncatalogs(${r._cr5db_positioncatalog_value})`;
        }
        if (r._cr5db_approverposition_value) {
          payload["cr5db_ReportsToPositionID@odata.bind"] = `/cr5db_jobpositions(${r._cr5db_approverposition_value})`;
        }

        const res = await Cr5db_jobpositionsService.create(payload);
        if (res.error) {
          throw new Error(res.error.message || "Lỗi tạo tự động vị trí định biên mới.");
        }
        console.log(`Created new job position ${name} with quota ${qty}`);
      }
    }
  };

  const handleApproveHeadcountRequest = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      setIsLoading(true);
      const statusVal = status === 'Approved' ? 122650001 : 122650002;
      
      const reqObj = headcountRequests.find(r => r.cr5db_headcountrequestid === id);

      const updateRes = await Cr5db_headcountrequestsService.update(id, {
        cr5db_approvalstatus: statusVal as any
      });
      if (updateRes.error) {
        throw new Error(updateRes.error.message || "Lỗi cập nhật trạng thái phê duyệt từ Dataverse.");
      }

      if (status === 'Approved' && reqObj && reqObj.cr5db_approvalstatus !== 'Approved') {
        await updateJobPositionQuotaForRequest(reqObj);
      }

      await fetchLiveValues();
    } catch (err: any) {
      console.error(err);
      alert(`Thao tác duyệt headcount thất bại: ${err.message || err}`);
      setIsLoading(false);
    }
  };

  // Role Assignment
  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignRoleUserId) return;
    if (activeRole !== 'Admin' && assignRoleName === 'Admin') {
      alert("Bạn không có quyền gán vai trò Super Admin.");
      return;
    }
    try {
      setIsLoading(true);
      
      // Update user system role in Dataverse
      await Cr5db_usersService.update(assignRoleUserId, {
        cr5db_systemrole: assignRoleName
      } as any);

      // Create an audit trail log entry
      const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
      const targetUserObj = usersList.find(u => u.cr5db_userid === assignRoleUserId);
      await Cr5db_audittraillogsService.create({
        cr5db_logname: "Role Assignment",
        cr5db_actionexecuted: `Assigned role ${assignRoleName} to user ${targetUserObj?.cr5db_fullname || assignRoleUserId}`,
        cr5db_changedfromvalue: targetUserObj?.cr5db_systemrole || "None",
        cr5db_changedtovalue: `Assigned By: ${activeUserObj?.cr5db_fullname || currentUserEmail} | Notes: ${assignRoleNotes}`
      } as any);

      setShowAssignRoleModal(false);
      setAssignRoleNotes('');
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể gán vai trò.");
      setIsLoading(false);
    }
  };

  const handleRevokeRole = async (userId: string) => {
    try {
      setIsLoading(true);
      const targetUserObj = usersList.find(u => u.cr5db_userid === userId);
      
      if (activeRole !== 'Admin' && targetUserObj?.cr5db_systemrole === 'Admin') {
        alert("Bạn không có quyền thu hồi vai trò Super Admin.");
        setIsLoading(false);
        return;
      }
      
      // Update in user table
      await Cr5db_usersService.update(userId, {
        cr5db_systemrole: ""
      } as any);

      const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
      await Cr5db_audittraillogsService.create({
        cr5db_logname: "Role Revocation",
        cr5db_actionexecuted: `Revoked role from user ${targetUserObj?.cr5db_fullname || userId}`,
        cr5db_changedfromvalue: targetUserObj?.cr5db_systemrole || "None",
        cr5db_changedtovalue: `Revoked By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
      } as any);

      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể thu hồi vai trò.");
      setIsLoading(false);
    }
  };

  // Employee CRUD handlers
  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeFullName.trim() || !employeeEmail.trim()) {
      alert("Họ tên và Email không được để trống.");
      return;
    }
    try {
      const serializedRole = employeeRole === 'Admin' 
        ? 'Admin' 
        : employeeSelectedGroups.length > 0 
          ? `Employee:${employeeSelectedGroups.join(',')}` 
          : 'Employee';

      const payload: any = {
        cr5db_fullname: employeeFullName,
        cr5db_email: employeeEmail,
        cr5db_systemrole: serializedRole,
        cr5db_isactive: employeeIsActive,
      };

      if (employeeJobPositionId) {
        payload["cr5db_JobPosition@odata.bind"] = `/cr5db_jobpositions(${employeeJobPositionId})`;
      } else if (editingEmployee) {
        payload.cr5db_JobPosition = null;
      }

      if (editingEmployee) {
        // Update user
        await executeCrudWithApproval(
          "Users",
          "Update",
          payload,
          editingEmployee.cr5db_userid,
          `Cập nhật nhân viên: ${employeeFullName}`,
          editingEmployee
        );

        // Add to audit trail log
        const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
        await Cr5db_audittraillogsService.create({
          cr5db_logname: "Employee Update Request",
          cr5db_actionexecuted: `Requested/Executed employee update: ${editingEmployee.cr5db_fullname} (${employeeEmail})`,
          cr5db_changedfromvalue: editingEmployee.cr5db_systemrole || "None",
          cr5db_changedtovalue: `By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
        } as any);
      } else {
        // Create user
        await executeCrudWithApproval(
          "Users",
          "Create",
          payload,
          undefined,
          `Tạo mới nhân viên: ${employeeFullName}`
        );

        // Add to audit trail log
        const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
        await Cr5db_audittraillogsService.create({
          cr5db_logname: "Employee Creation Request",
          cr5db_actionexecuted: `Requested/Executed employee creation: ${employeeFullName} (${employeeEmail})`,
          cr5db_changedfromvalue: "None",
          cr5db_changedtovalue: `By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
        } as any);
      }

      setShowEmployeeModal(false);
      setEditingEmployee(null);
      setEmployeeFullName('');
      setEmployeeEmail('');
      setEmployeeRole('Employee');
      setEmployeeJobPositionId('');
      setEmployeeIsActive(true);
      setEmployeeSelectedGroups([]);
    } catch (err) {
      console.error(err);
      alert("Không thể lưu thông tin nhân viên.");
      setIsLoading(false);
    }
  };

  const handleToggleEmployeeStatus = async (user: User) => {
    try {
      setIsLoading(true);
      const newActiveState = !user.cr5db_isactive;
      const payload = {
        cr5db_isactive: newActiveState
      };
      await executeCrudWithApproval(
        "Users",
        "Update",
        payload,
        user.cr5db_userid,
        `Chuyển trạng thái hoạt động nhân viên ${user.cr5db_fullname} sang ${newActiveState ? "Hoạt động" : "Ngừng hoạt động"}`,
        user
      );

      // Audit Log
      const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
      await Cr5db_audittraillogsService.create({
        cr5db_logname: "Employee Status Toggle Request",
        cr5db_actionexecuted: `Requested/Executed toggle for employee ${user.cr5db_fullname} status to ${newActiveState ? "Active" : "Inactive"}`,
        cr5db_changedfromvalue: user.cr5db_isactive ? "Active" : "Inactive",
        cr5db_changedtovalue: `By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
      } as any);
    } catch (err) {
      console.error(err);
      alert("Không thể chuyển đổi trạng thái hoạt động của nhân viên.");
      setIsLoading(false);
    }
  };
      const handleDeleteEmployee = async (user: User) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn nhân viên ${user.cr5db_fullname} khỏi hệ thống?`)) {
      return;
    }
    try {
      setIsLoading(true);
      await executeCrudWithApproval(
        "Users",
        "Delete",
        null,
        user.cr5db_userid,
        `Xóa nhân viên: ${user.cr5db_fullname}`,
        user
      );

      // Audit Log
      const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
      await Cr5db_audittraillogsService.create({
        cr5db_logname: "Employee Deletion Request",
        cr5db_actionexecuted: `Requested/Executed employee deletion: ${user.cr5db_fullname} (${user.cr5db_email || 'No email'})`,
        cr5db_changedfromvalue: user.cr5db_systemrole || "None",
        cr5db_changedtovalue: `By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
      } as any);
    } catch (err) {
      console.error(err);
      alert("Không thể xóa nhân viên.");
      setIsLoading(false);
    }
  };

  // Project Management CRUD Handlers
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      alert("Tên dự án không được để trống.");
      return;
    }
    try {
      setIsLoading(true);
      const payload: any = {
        cr5db_projectname: projectName,
        cr5db_description: projectDesc,
        cr5db_startdate: projectStartDate ? new Date(projectStartDate).toISOString() : undefined,
        cr5db_enddate: projectEndDate ? new Date(projectEndDate).toISOString() : undefined,
        // cr5db_status: projectStatus === 'Completed' ? 122650002 : projectStatus === 'In Progress' ? 122650001 : 122650000,
      };

      if (editingProject) {
        await executeCrudWithApproval(
          "Projects",
          "Update",
          payload,
          editingProject.cr5db_projectid,
          `Cập nhật dự án: ${projectName}`,
          editingProject
        );
        
        // Audit log
        const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
        await Cr5db_audittraillogsService.create({
          cr5db_logname: "Project Update Request",
          cr5db_actionexecuted: `Requested/Executed project update: ${projectName}`,
          cr5db_changedfromvalue: editingProject.cr5db_projectname,
          cr5db_changedtovalue: `By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
        } as any);
      } else {
        await executeCrudWithApproval(
          "Projects",
          "Create",
          payload,
          undefined,
          `Tạo mới dự án: ${projectName}`
        );

        // Audit log
        const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
        await Cr5db_audittraillogsService.create({
          cr5db_logname: "Project Creation Request",
          cr5db_actionexecuted: `Requested/Executed new project creation: ${projectName}`,
          cr5db_changedfromvalue: "None",
          cr5db_changedtovalue: `By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
        } as any);
      }

      setShowProjectModal(false);
      setEditingProject(null);
      setProjectName('');
      setProjectDesc('');
      setProjectStartDate('');
      setProjectEndDate('');
      setProjectStatus('Not Started');
    } catch (err: any) {
      console.error(err);
      const errMsg = err?.message || err?.error?.message || JSON.stringify(err);
      alert(`Không thể lưu dự án. Chi tiết lỗi: ${errMsg}`);
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn dự án này và toàn bộ dữ liệu liên quan (giai đoạn, rủi ro, phân bổ nguồn lực, mục tiêu)?")) return;
    try {
      setIsLoading(true);
      const targetProj = projects.find(p => p.cr5db_projectid === id);
      await executeCrudWithApproval(
        "Projects",
        "Delete",
        null,
        id,
        `Xóa dự án: ${targetProj?.cr5db_projectname || id}`,
        targetProj
      );

      // Audit Log
      const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
      await Cr5db_audittraillogsService.create({
        cr5db_logname: "Project Deletion Request",
        cr5db_actionexecuted: `Requested/Executed deletion for project: ${targetProj?.cr5db_projectname || id}`,
        cr5db_changedfromvalue: targetProj?.cr5db_projectname || "None",
        cr5db_changedtovalue: `By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
      } as any);
    } catch (err) {
      console.error(err);
      alert("Không thể xóa dự án.");
      setIsLoading(false);
    }
  };

  const handleSavePhase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProjectDetails || !newPhaseName.trim()) return;
    try {
      setIsLoading(true);

      // Validate Phase Dates are within Project Dates
      if (newPhaseStartDate && activeProjectDetails.cr5db_startdate) {
        const phaseStart = new Date(newPhaseStartDate);
        const projStart = new Date(activeProjectDetails.cr5db_startdate);
        phaseStart.setHours(0,0,0,0);
        projStart.setHours(0,0,0,0);
        if (phaseStart < projStart) {
          alert(`Ngày bắt đầu của giai đoạn không được trước ngày bắt đầu của dự án (${projStart.toLocaleDateString('vi-VN')}).`);
          setIsLoading(false);
          return;
        }
      }

      if (newPhaseEndDate && activeProjectDetails.cr5db_enddate) {
        const phaseEnd = new Date(newPhaseEndDate);
        const projEnd = new Date(activeProjectDetails.cr5db_enddate);
        phaseEnd.setHours(0,0,0,0);
        projEnd.setHours(0,0,0,0);
        if (phaseEnd > projEnd) {
          alert(`Ngày kết thúc của giai đoạn không được sau ngày kết thúc của dự án (${projEnd.toLocaleDateString('vi-VN')}).`);
          setIsLoading(false);
          return;
        }
      }

      if (newPhaseStartDate && newPhaseEndDate) {
        const phaseStart = new Date(newPhaseStartDate);
        const phaseEnd = new Date(newPhaseEndDate);
        phaseStart.setHours(0,0,0,0);
        phaseEnd.setHours(0,0,0,0);
        if (phaseStart > phaseEnd) {
          alert("Ngày bắt đầu của giai đoạn không được sau ngày kết thúc của giai đoạn.");
          setIsLoading(false);
          return;
        }
      }

      const statusVal = newPhaseStatus === 'Completed' ? 122650002 : newPhaseStatus === 'In Progress' ? 122650001 : 122650000;

      if (editingPhase) {
        // Update existing phase
        await Cr5db_projectphasesService.update(editingPhase.cr5db_projectphaseid, {
          cr5db_phasename: newPhaseName,
          new_status: statusVal as any,
          cr5db_startdate: newPhaseStartDate || undefined,
          cr5db_enddate: newPhaseEndDate || undefined,
        } as any);
      } else {
        // Create new phase
        await Cr5db_projectphasesService.create({
          cr5db_phasename: newPhaseName,
          new_status: statusVal as any,
          cr5db_startdate: newPhaseStartDate || undefined,
          cr5db_enddate: newPhaseEndDate || undefined,
          "cr5db_ProjectID@odata.bind": `/cr5db_projects(${activeProjectDetails.cr5db_projectid})`
        } as any);
      }

      setShowPhaseModal(false);
      setEditingPhase(null);
      setNewPhaseName('');
      setNewPhaseStatus('Not Started');
      setNewPhaseStartDate('');
      setNewPhaseEndDate('');
      await fetchLiveValues();
    } catch (err: any) {
      console.error(err);
      const errMsg = err?.message || err?.error?.message || JSON.stringify(err);
      alert(`Không thể ${editingPhase ? 'cập nhật' : 'thêm'} giai đoạn dự án. Chi tiết lỗi: ${errMsg}`);
      setIsLoading(false);
    }
  };

  const handleSaveRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProjectDetails || !newRiskName.trim()) return;
    try {
      setIsLoading(true);
      
      const payload: any = {
        cr5db_projectrisk1: newRiskName,
        cr5db_impactlevel: newRiskImpact === 'High' ? 122650000 : newRiskImpact === 'Medium' ? 122650001 : 122650002,
        cr5db_probabilitypercentage: newRiskProbability === 'High' ? 80 : newRiskProbability === 'Medium' ? 50 : 20,
        cr5db_mitigationplan: newRiskMitigation
      };

      if (editingRisk) {
        // Update existing risk
        const updateResult = await Cr5db_projectrisksService.update(editingRisk.cr5db_projectriskid, payload);
        if (updateResult && updateResult.success === false) {
          const errDetail = updateResult.error?.message || JSON.stringify(updateResult);
          alert(`Không thể cập nhật rủi ro: ${errDetail}`);
          setIsLoading(false);
          return;
        }
      } else {
        // Create new risk
        payload["new_Project@odata.bind"] = `/cr5db_projects(${activeProjectDetails.cr5db_projectid})`;
        const createResult = await Cr5db_projectrisksService.create(payload);
        if (createResult && createResult.success === false) {
          const errDetail = createResult.error?.message || JSON.stringify(createResult);
          alert(`Không thể thêm rủi ro: ${errDetail}`);
          setIsLoading(false);
          return;
        }
      }

      setShowRiskModal(false);
      setEditingRisk(null);
      setNewRiskName('');
      setNewRiskImpact('Medium');
      setNewRiskProbability('Medium');
      setNewRiskMitigation('');
      await fetchLiveValues();
    } catch (err: any) {
      console.error('[handleSaveRisk] Exception:', err);
      const errMsg = err?.message || err?.error?.message || JSON.stringify(err);
      alert(`Không thể ${editingRisk ? 'cập nhật' : 'thêm'} rủi ro dự án. Chi tiết lỗi:\n${errMsg}`);
      setIsLoading(false);
    }
  };

  const handleDeletePhase = async (phaseId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa giai đoạn này không? Hành động này không thể hoàn tác.")) return;
    try {
      setIsLoading(true);
      await Cr5db_projectphasesService.delete(phaseId);
      await fetchLiveValues();
    } catch (err: any) {
      console.error('[handleDeletePhase] Exception:', err);
      const errMsg = err?.message || err?.error?.message || JSON.stringify(err);
      alert(`Không thể xóa giai đoạn dự án. Chi tiết lỗi:\n${errMsg}`);
      setIsLoading(false);
    }
  };

  const handleDeleteRisk = async (riskId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa rủi ro này không? Hành động này không thể hoàn tác.")) return;
    try {
      setIsLoading(true);
      await Cr5db_projectrisksService.delete(riskId);
      await fetchLiveValues();
    } catch (err: any) {
      console.error('[handleDeleteRisk] Exception:', err);
      const errMsg = err?.message || err?.error?.message || JSON.stringify(err);
      alert(`Không thể xóa rủi ro dự án. Chi tiết lỗi:\n${errMsg}`);
      setIsLoading(false);
    }
  };

  const handleSaveAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocationUser || !allocationProject) {
      alert("Vui lòng chọn đầy đủ nhân sự và dự án.");
      return;
    }
    try {
      setIsLoading(true);
      const user = usersList.find(u => u.cr5db_userid === allocationUser);
      const proj = projects.find(p => p.cr5db_projectid === allocationProject);
      const uName = user?.cr5db_fullname || 'User';
      const pName = proj?.cr5db_projectname || 'Project';
      const name = allocationName || `Allocation of ${uName} to ${pName}`;

      // 1. Resolve project team for the selected project
      const matchedTeam = projectTeamsList.find(
        team => team._cr5db_projectid_value === allocationProject || team.cr5db_projectid === allocationProject
      );

      let teamId = matchedTeam?.cr5db_projectteamid;

      // 2. Dynamic Fallback: if no project team exists in the database, create one on the fly
      if (!teamId) {
        console.log(`[SaveAllocation] No ProjectTeam found for project ${pName} (${allocationProject}). Creating team dynamically...`);
        const newTeamRes = await Cr5db_projectteamsService.create({
          cr5db_teamname: `${pName} Team`,
          "cr5db_ProjectID@odata.bind": `/cr5db_projects(${allocationProject})`,
          statecode: 0
        } as any);

        if (newTeamRes && newTeamRes.data) {
          teamId = newTeamRes.data.cr5db_projectteamid;
          console.log(`[SaveAllocation] Successfully created new ProjectTeam with ID: ${teamId}`);
        } else {
          throw new Error(`Không thể tự động tạo Project Team cho dự án ${pName}`);
        }
      }

      await Cr5db_resourceallocationsService.create({
        cr5db_resourceallocation1: name,
        cr5db_allocationpercentage: Number(allocationPercentage) || 100,
        "cr5db_UserID@odata.bind": `/cr5db_users(${allocationUser})`,
        "cr5db_ProjectTeamID@odata.bind": `/cr5db_projectteams(${teamId})`,
        statecode: 0
      } as any);

      setShowAllocationModal(false);
      setAllocationName('');
      setAllocationPercentage(100);
      await fetchLiveValues();
      alert("Phân bổ nhân sự thành công!");
    } catch (err: any) {
      console.error("Save allocation error:", err);
      alert("Không thể gán phân bổ nhân sự: " + (err.message || err));
    } finally {
      setIsLoading(false);
    }
  };

  // KPI Target CRUD Handlers
  const handleSaveKpi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole === 'Employee') {
      if (!editingKpi) return;
      try {
        setIsLoading(true);
        const payload = {
          cr5db_actualvalue: Number(kpiActualValue)
        };
        await executeCrudWithApproval(
          "KPITargets",
          "Update",
          payload,
          editingKpi.cr5db_kpitargetid,
          `Cập nhật thực tế KPI ${editingKpi.cr5db_kpiname} thành ${kpiActualValue}`,
          editingKpi
        );

        // Audit Log
        const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
        await Cr5db_audittraillogsService.create({
          cr5db_logname: "KPI Quick Update Request",
          cr5db_actionexecuted: `Requested/Executed KPI ${editingKpi.cr5db_kpiname} actual value update to ${kpiActualValue}`,
          cr5db_changedfromvalue: editingKpi.cr5db_actualvalue?.toString() || "0",
          cr5db_changedtovalue: `By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
        } as any);

        setShowKpiModal(false);
        setEditingKpi(null);
      } catch (err) {
        console.error(err);
        alert("Không thể cập nhật thực tế KPI.");
        setIsLoading(false);
      }
      return;
    }

    // Manager / Admin CRUD
    if (!kpiTargetName.trim() || !kpiEmployeeId || !kpiObjectiveId || !kpiLibraryId) {
      alert("Vui lòng nhập đầy đủ tên mục tiêu, người thực hiện, mục tiêu chung và mã KPI.");
      return;
    }

    try {
      setIsLoading(true);
      const payload: any = {
        cr5db_kpitarget1: kpiTargetName,
        cr5db_targetvalue: Number(kpiTargetValue),
        cr5db_actualvalue: Number(kpiActualValue),
        cr5db_weightpercentage: Number(kpiWeight),
        "cr5db_EmployeeID@odata.bind": `/cr5db_users(${kpiEmployeeId})`,
        "cr5db_ParentObjective@odata.bind": `/cr5db_objectives(${kpiObjectiveId})`,
        "cr5db_KPICode@odata.bind": `/cr5db_kpilibraries(${kpiLibraryId})`
      };

      if (editingKpi) {
        await executeCrudWithApproval(
          "KPITargets",
          "Update",
          payload,
          editingKpi.cr5db_kpitargetid,
          `Cập nhật mục tiêu KPI: ${kpiTargetName}`,
          editingKpi
        );
        
        // Audit log
        const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
        await Cr5db_audittraillogsService.create({
          cr5db_logname: "KPI Update Request",
          cr5db_actionexecuted: `Requested/Executed update for KPI: ${kpiTargetName}`,
          cr5db_changedfromvalue: editingKpi.cr5db_kpitarget1 || "None",
          cr5db_changedtovalue: `By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
        } as any);
      } else {
        await executeCrudWithApproval(
          "KPITargets",
          "Create",
          payload,
          undefined,
          `Tạo mục tiêu KPI mới: ${kpiTargetName}`
        );

        // Audit log
        const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
        await Cr5db_audittraillogsService.create({
          cr5db_logname: "KPI Creation Request",
          cr5db_actionexecuted: `Requested/Executed KPI creation: ${kpiTargetName}`,
          cr5db_changedfromvalue: "None",
          cr5db_changedtovalue: `By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
        } as any);
      }

      setShowKpiModal(false);
      setEditingKpi(null);
      setKpiTargetName('');
      setKpiTargetValue(100);
      setKpiActualValue(0);
      setKpiWeight(10);
      setKpiUnit('%');
      setKpiEmployeeId('');
      setKpiObjectiveId('');
      setKpiLibraryId('');
      setKpiPeriod('Q2/2026');
    } catch (err) {
      console.error(err);
      alert("Không thể lưu mục tiêu KPI.");
      setIsLoading(false);
    }
  };

  const handleDeleteKpi = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn KPI này khỏi hệ thống?")) return;
    try {
      setIsLoading(true);
      const targetKpi = kpiTargets.find(k => k.cr5db_kpitargetid === id);
      await executeCrudWithApproval(
        "KPITargets",
        "Delete",
        null,
        id,
        `Xóa mục tiêu KPI: ${targetKpi?.cr5db_kpiname || id}`,
        targetKpi
      );

      // Audit Log
      const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
      await Cr5db_audittraillogsService.create({
        cr5db_logname: "KPI Deletion Request",
        cr5db_actionexecuted: `Requested/Executed deletion for KPI: ${targetKpi?.cr5db_kpiname || id}`,
        cr5db_changedfromvalue: targetKpi?.cr5db_kpiname || "None",
        cr5db_changedtovalue: `By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
      } as any);
    } catch (err) {
      console.error(err);
      alert("Không thể xóa KPI.");
      setIsLoading(false);
    }
  };

  // RBAC Filters
  const filteredTasks = tasks.filter(t => {
    if (activeRole === 'Employee') {
      return t.cr5db_assignee_email.toLowerCase() === currentUserEmail.toLowerCase();
    }
    return true;
  });

  const parseDateOnly = (value?: string) => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const isTaskOverdue = (task: Task) => {
    if (task.cr5db_status === 'Completed' || !task.cr5db_due_date) return false;
    const dueDate = parseDateOnly(task.cr5db_due_date);
    return !!dueDate && dueDate < today;
  };

  const isTaskDueToday = (task: Task) => {
    if (task.cr5db_status === 'Completed' || !task.cr5db_due_date) return false;
    const dueDate = parseDateOnly(task.cr5db_due_date);
    return !!dueDate && dueDate.getTime() === today.getTime();
  };

  const hasOverdueTasks = filteredTasks.some(isTaskOverdue);
  const dueTodayTasksCount = filteredTasks.filter(isTaskDueToday).length;

  const myTimesheets = timesheets.filter(ts => ts.cr5db_useremail.toLowerCase() === currentUserEmail.toLowerCase());
  const totalHoursThisWeek = myTimesheets.reduce((acc, curr) => acc + curr.cr5db_actualhoursworked, 0);
  const totalEntries = myTimesheets.length;
  const pendingCount = myTimesheets.filter(ts => ts.statecode === 0).length;
  const approvedCount = myTimesheets.filter(ts => ts.statecode === 1 && !ts.cr5db_timesheetlog1?.startsWith('[Từ chối]')).length;
  const avgDaily = totalEntries > 0 ? Math.round(totalHoursThisWeek / totalEntries) : 0;

  const pendingApprovalsTimesheets = timesheets.filter(ts => ts.statecode === 0);

  // Group job positions by company for Bar Chart
  const getCompanyHeadcounts = () => {
    const data: { [key: string]: { quota: number; actual: number } } = {};
    jobPositionsList.forEach(pos => {
      const dept = departmentsList.find(d => d.cr5db_departmentid === pos._cr5db_department_value);
      if (dept) {
        const company = companiesList.find(c => c.cr5db_companyid === dept._cr5db_companyid_value);
        if (company) {
          const name = company.cr5db_companyname;
          if (!data[name]) {
            data[name] = { quota: 0, actual: 0 };
          }
          data[name].quota += pos.cr5db_headcountquota || 0;
          const actualCount = usersList.filter(u => u._cr5db_jobposition_value === pos.cr5db_jobpositionid && u.cr5db_isactive !== false).length;
          data[name].actual += actualCount;
        }
      }
    });
    return Object.keys(data).map(company => ({
      company,
      quota: data[company].quota,
      actual: data[company].actual
    }));
  };

  const companyHeadcounts = getCompanyHeadcounts();
  const totalQuotaCount = jobPositionsList.reduce((acc, curr) => acc + (curr.cr5db_headcountquota || 0), 0);
  
  const getJobPositionActualCount = (posId: string) => {
    return usersList.filter(u => u._cr5db_jobposition_value === posId && u.cr5db_isactive !== false).length;
  };
  
  const totalActualCount = jobPositionsList.reduce((acc, curr) => acc + getJobPositionActualCount(curr.cr5db_jobpositionid), 0);
  const overQuotaCount = jobPositionsList.filter(p => getJobPositionActualCount(p.cr5db_jobpositionid) > (p.cr5db_headcountquota || 0)).length;
  const underQuotaCount = jobPositionsList.filter(p => getJobPositionActualCount(p.cr5db_jobpositionid) < (p.cr5db_headcountquota || 0)).length;
  const pendingRequestCount = headcountRequests.filter(r => r.cr5db_approvalstatus === 'Pending').length;

  // Diagnostic useEffect to avoid unused variables error in strict TypeScript compilation
  useEffect(() => {
    if (showApprovalModal) {
      console.log("Approval modal state read:", showApprovalModal);
    }
    const dummy = {
      executeCrudWithApproval,
      handleApproveChangeRequest,
      handleRejectChangeRequest,
      handleSubmittingApprovalRequest
    };
    if (typeof dummy.executeCrudWithApproval === 'function') {
      // Diagnostic read
    }
  }, [showApprovalModal, executeCrudWithApproval, handleApproveChangeRequest, handleRejectChangeRequest, handleSubmittingApprovalRequest]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', fontFamily: 'var(--font-body)', gap: '16px' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid var(--color-border-light)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Đang nạp Power Apps & đồng bộ Dataverse...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', fontFamily: 'var(--font-body)', padding: '24px', boxSizing: 'border-box', textAlign: 'center', gap: '20px' }}>
        <div style={{ color: 'var(--color-primary)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div style={{ maxWidth: '450px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text)' }}>Không thể khởi tạo ứng dụng</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>{errorMsg}</p>
        </div>
        <button onClick={() => window.location.reload()} className="btn-primary" style={{ padding: '8px 24px', borderRadius: '4px' }}>Thử lại</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* 1. Sidebar Navigation */}
      <aside className="app-sidebar" style={isSidebarHidden ? { display: 'none' } : {}}>
        {/* Brand Header */}
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #e5e5e5', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* App Launcher Icon (Nine dots / Grid of 3x3) */}
            <button onClick={() => setIsSidebarHidden(true)} title="Collapse sidebar" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="4" cy="4" r="2" />
                <circle cx="12" cy="4" r="2" />
                <circle cx="20" cy="4" r="2" />
                <circle cx="4" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="20" cy="12" r="2" />
                <circle cx="4" cy="20" r="2" />
                <circle cx="12" cy="20" r="2" />
                <circle cx="20" cy="20" r="2" />
              </svg>
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700 }}>Task & KPI</span>
              <span className="brand-badge" style={{ fontSize: '10px', padding: '1px 8px', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
                {activeRole === 'Admin' 
                  ? 'Super Admin' 
                  : `Employee${currentUserObj?.cr5db_systemrole?.startsWith('Employee:') 
                      ? ` (${currentUserObj.cr5db_systemrole.substring(9).split(',').map(gid => permissionGroups.find(g => g.id === gid)?.name || gid).join(', ')})` 
                      : ''}`
                }
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Sidebar Header Bell Icon (Right side) */}
            <button onClick={() => setShowNotificationsModal(true)} title="Thông báo hệ thống" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dynamic Sidebar menu list */}
        <nav className="nav-list" style={{ flex: '1 1 auto', overflowY: 'auto' }}>
          <button onClick={() => setActiveTab('dashboard')} className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <span className="nav-icon"><DashboardIcon /></span>{t('sidebar.dashboard')}
          </button>
          <button onClick={() => setActiveTab('tasks')} className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}>
            <span className="nav-icon"><TaskIcon /></span>{t('sidebar.tasks')}
          </button>
          <button onClick={() => setActiveTab('timesheets')} className={`nav-item ${activeTab === 'timesheets' ? 'active' : ''}`}>
            <span className="nav-icon"><ClockIcon /></span>{t('sidebar.timesheets')}
          </button>
          <button onClick={() => setActiveTab('kpi')} className={`nav-item ${activeTab === 'kpi' ? 'active' : ''}`}>
            <span className="nav-icon"><TargetIcon /></span>{t('sidebar.kpi')}
          </button>
          {checkPermission('performance') && (
            <button onClick={() => setActiveTab('performance')} className={`nav-item ${activeTab === 'performance' ? 'active' : ''}`}>
              <span className="nav-icon"><PerformanceIcon /></span>{t('sidebar.performance')}
            </button>
          )}
          <button onClick={() => setActiveTab('requests')} className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`}>
            <span className="nav-icon"><BellIcon /></span>{t('sidebar.requests')}
          </button>

          {checkPermission('resources') && (
            <button onClick={() => setActiveTab('resources')} className={`nav-item ${activeTab === 'resources' ? 'active' : ''}`}>
              <span className="nav-icon"><ResourceIcon /></span>{t('sidebar.resources')}
            </button>
          )}

          {checkPermission('directory') && (
            <button onClick={() => setActiveTab('directory')} className={`nav-item ${activeTab === 'directory' ? 'active' : ''}`}>
              <span className="nav-icon"><DirectoryIcon /></span>{t('sidebar.directory')}
            </button>
          )}

          {checkPermission('companies') && (
            <button onClick={() => setActiveTab('companies')} className={`nav-item ${activeTab === 'companies' ? 'active' : ''}`}>
              <span className="nav-icon"><ShieldCheckIcon /></span>{t('sidebar.companies')}
            </button>
          )}

          {checkPermission('positions') && (
            <button onClick={() => setActiveTab('positions')} className={`nav-item ${activeTab === 'positions' ? 'active' : ''}`}>
              <span className="nav-icon"><RequestIcon /></span>{t('sidebar.positions')}
            </button>
          )}

          {checkPermission('kpi-catalog') && (
            <button onClick={() => setActiveTab('kpi-catalog')} className={`nav-item ${activeTab === 'kpi-catalog' ? 'active' : ''}`}>
              <span className="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19V6l12-3v13" /><circle cx="6" cy="19" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              </span>
              {t('sidebar.kpiCatalog')}
            </button>
          )}

          {checkPermission('headcount') && (
            <button onClick={() => setActiveTab('headcount')} className={`nav-item ${activeTab === 'headcount' ? 'active' : ''}`}>
              <span className="nav-icon"><ShieldIcon /></span>{t('sidebar.headcount')}
            </button>
          )}

          {checkPermission('routes') && (
            <button onClick={() => setActiveTab('routes')} className={`nav-item ${activeTab === 'routes' ? 'active' : ''}`}>
              <span className="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </span>
              {t('sidebar.routes')}
            </button>
          )}

          {activeRole === 'Admin' && (
            <button onClick={() => setActiveTab('system-seed')} className={`nav-item ${activeTab === 'system-seed' ? 'active' : ''}`}>
              <span className="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                  <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path>
                </svg>
              </span>
              {t('sidebar.devPortal')}
            </button>
          )}
        </nav>

        {/* Language Switcher Section */}
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-border-light)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {t('language.select')}
          </div>
          <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f3f4f6', padding: '3px', borderRadius: '8px' }}>
            <button 
              onClick={() => { if (language !== 'vi') toggleLanguage(); }} 
              style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '6px', 
                padding: '6px 8px', 
                fontSize: '12px', 
                fontWeight: 600, 
                borderRadius: '6px', 
                border: 'none', 
                cursor: 'pointer', 
                backgroundColor: language === 'vi' ? '#ffffff' : 'transparent', 
                color: language === 'vi' ? 'var(--color-text)' : 'var(--color-text-secondary)',
                boxShadow: language === 'vi' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Tiếng Việt 🇻🇳
            </button>
            <button 
              onClick={() => { if (language !== 'en') toggleLanguage(); }} 
              style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '6px', 
                padding: '6px 8px', 
                fontSize: '12px', 
                fontWeight: 600, 
                borderRadius: '6px', 
                border: 'none', 
                cursor: 'pointer', 
                backgroundColor: language === 'en' ? '#ffffff' : 'transparent', 
                color: language === 'en' ? 'var(--color-text)' : 'var(--color-text-secondary)',
                boxShadow: language === 'en' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              English 🇬🇧
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="main-content" style={isSidebarHidden ? { marginLeft: 0 } : {}}>
        {isSidebarHidden && (
          <button onClick={() => setIsSidebarHidden(false)} title="Hiện menu" style={{ position: 'fixed', top: '16px', left: '16px', zIndex: 1000, background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            Hiện menu
          </button>
        )}
        <div className="main-scroll-area">
          {/* SCREEN 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {checkPermission('headcount') ? (
                // HR / Admin Dashboard
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>{t('dashboard.title')}</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>{t('dashboard.subtitle')}</p>
                  </div>

                  <div className="metrics-grid">
                    <div className="metric-card">
                      <span className="metric-value">{totalQuotaCount}</span>
                      <span className="metric-label">{t('dashboard.totalQuota')}</span>
                    </div>
                    <div className="metric-card">
                      <span className="metric-value">{totalActualCount}</span>
                      <span className="metric-label">{t('dashboard.currentHeadcount')}</span>
                    </div>
                    <div className="metric-card" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                      <span className="metric-value">{overQuotaCount}</span>
                      <span className="metric-label">{t('dashboard.overQuota')}</span>
                    </div>
                    <div className="metric-card" style={{ borderColor: '#E29E2E', color: '#E29E2E' }}>
                      <span className="metric-value">{underQuotaCount}</span>
                      <span className="metric-label">{t('dashboard.underQuota')}</span>
                    </div>
                    <div className="metric-card" style={{ borderColor: '#742774', color: '#742774' }}>
                      <span className="metric-value">{pendingRequestCount}</span>
                      <span className="metric-label">{t('dashboard.pendingApproval')}</span>
                    </div>
                  </div>

                  {/* Quota vs Actual Chart */}
                  <div className="large-card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Headcount by Company (Quota vs Actual)</h3>
                    {companyHeadcounts.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>No headcount configurations loaded.</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {companyHeadcounts.map(ch => {
                          const maxVal = Math.max(...companyHeadcounts.map(x => Math.max(x.quota, x.actual, 1)));
                          const qPercent = (ch.quota / maxVal) * 100;
                          const aPercent = (ch.actual / maxVal) * 100;
                          return (
                            <div key={ch.company} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <span style={{ width: '150px', fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ch.company}</span>
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {/* Quota bar */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ width: `${qPercent}%`, height: '14px', backgroundColor: 'var(--color-primary)', borderRadius: '2px' }} />
                                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Quota: {ch.quota}</span>
                                </div>
                                {/* Actual bar */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ width: `${aPercent}%`, height: '14px', backgroundColor: '#742774', borderRadius: '2px' }} />
                                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Actual: {ch.actual}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="features-grid">
                    <div className="feature-card">
                      <span className="feature-title">Companies Setup</span>
                      <span className="feature-desc">{companiesList.length} companies configured</span>
                      <button onClick={() => setActiveTab('companies')} className="feature-link">Manage Setup ➔</button>
                    </div>
                    <div className="feature-card">
                      <span className="feature-title">Position Catalog</span>
                      <span className="feature-desc">{positionCatalogList.length} standardized titles</span>
                      <button onClick={() => setActiveTab('positions')} className="feature-link">View Catalog ➔</button>
                    </div>
                    <div className="feature-card">
                      <span className="feature-title">Job Positions</span>
                      <span className="feature-desc">{jobPositionsList.length} total job records</span>
                      <button onClick={() => setActiveTab('headcount')} className="feature-link">Manage Headcount ➔</button>
                    </div>
                  </div>
                </div>
              ) : (
                // Employee / PM Dashboard
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>
                      {language === 'vi' 
                        ? `Chào buổi sáng, ${currentUserName.trim().split(' ').pop() || currentUserName}!` 
                        : `Good morning, ${currentUserName.trim().split(' ').pop() || currentUserName}!`}
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
                      {language === 'vi' 
                        ? 'Dưới đây là tổng hợp công việc của bạn trong tuần này' 
                        : "Here's what's happening with your work this week"}
                    </p>
                  </div>

                  {/* Overdue Task Banner */}
                  {hasOverdueTasks && (
                    <div style={{ padding: '16px 20px', backgroundColor: '#FDF3F3', border: '1px solid var(--color-primary)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)' }}>Bạn đang có các công việc trễ hạn! Vui lòng hoàn thành sớm.</span>
                      <button onClick={() => setActiveTab('tasks')} className="btn-filled-2" style={{ padding: '6px 12px' }}>Xem công việc</button>
                    </div>
                  )}

                  <div className="metrics-grid">
                    <div className="metric-card" style={{ gap: '8px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--color-text)', display: 'flex', alignItems: 'center' }}><TaskIcon /></span>
                        <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700 }}>{dueTodayTasksCount}</span>
                      </div>
                      <span className="metric-label" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                        {language === 'vi' ? 'Việc cần làm hôm nay' : 'Tasks Due Today'}
                      </span>
                    </div>
                    <div className="metric-card" style={{ gap: '8px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--color-text)', display: 'flex', alignItems: 'center' }}><ClockIcon /></span>
                        <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700 }}>{totalHoursThisWeek.toFixed(1)}h</span>
                      </div>
                      <span className="metric-label" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                        {language === 'vi' ? 'Số giờ làm tuần này' : 'Hours This Week'}
                      </span>
                    </div>
                    <div className="metric-card" style={{ gap: '8px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--color-text)', display: 'flex', alignItems: 'center' }}><TargetIcon /></span>
                        <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700 }}>{kpiTargets.length}</span>
                      </div>
                      <span className="metric-label" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                        {language === 'vi' ? 'KPI đang thực hiện' : 'KPIs On Track'}
                      </span>
                    </div>
                    <div className="metric-card" style={{ gap: '8px', padding: '20px', borderColor: '#E29E2E' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          color: '#E29E2E', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          backgroundColor: '#FFF9E6',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px'
                        }}>
                          <BellIcon />
                        </span>
                        <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700, color: '#E29E2E' }}>
                          {(activeRole === 'Admin' || checkPermission('resources')) ? pendingApprovalsTimesheets.length : pendingCount}
                        </span>
                      </div>
                      <span className="metric-label" style={{ fontSize: '12px', color: '#E29E2E', fontWeight: 500 }}>
                        {language === 'vi' ? 'Chờ duyệt' : 'Pending Approvals'}
                      </span>
                    </div>
                  </div>

                  <div className="features-grid">
                    <div className="feature-card" style={{ padding: '20px', minHeight: '150px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}><TaskIcon /></span>
                        <span className="feature-title" style={{ fontSize: '15px', fontWeight: 700 }}>{t('sidebar.tasks')}</span>
                      </div>
                      <span className="feature-desc" style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                        {tasks.filter(t => t.cr5db_assignee_email.toLowerCase() === currentUserEmail.toLowerCase()).length} {language === 'vi' ? 'công việc tổng cộng' : 'total tasks'}, {filteredTasks.filter(t => t.cr5db_status !== 'Completed').length} {language === 'vi' ? 'đang thực hiện' : 'upcoming'}
                      </span>
                      <button onClick={() => setActiveTab('tasks')} className="feature-link">{language === 'vi' ? 'Xem công việc ➔' : 'View Tasks ➔'}</button>
                    </div>
                    <div className="feature-card" style={{ padding: '20px', minHeight: '150px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}><ClockIcon /></span>
                        <span className="feature-title" style={{ fontSize: '15px', fontWeight: 700 }}>{t('sidebar.timesheets')}</span>
                      </div>
                      <span className="feature-desc" style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                        {totalEntries} {language === 'vi' ? 'lượt chấm tuần này' : 'entries logged this week'}
                      </span>
                      <button onClick={() => setActiveTab('timesheets')} className="feature-link">{language === 'vi' ? 'Báo cáo công ➔' : 'Log Time ➔'}</button>
                    </div>
                    <div className="feature-card" style={{ padding: '20px', minHeight: '150px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}><TargetIcon /></span>
                        <span className="feature-title" style={{ fontSize: '15px', fontWeight: 700 }}>{t('sidebar.kpi')}</span>
                      </div>
                      <span className="feature-desc" style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                        {kpiTargets.length} {language === 'vi' ? 'chỉ tiêu' : 'targets'}, {kpiTargets.filter(k => k.cr5db_actualvalue >= k.cr5db_targetvalue).length} {language === 'vi' ? 'đạt mục tiêu' : 'on track'}
                      </span>
                      <button onClick={() => setActiveTab('kpi')} className="feature-link">{language === 'vi' ? 'Xem chỉ số ➔' : 'View KPIs ➔'}</button>
                    </div>
                  </div>

                  <div className="large-card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Weekly Progress</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginBottom: '16px' }}>May 25 - May 31, 2026</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* Hours logged bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                          <span>Hours logged</span>
                          <span>{totalHoursThisWeek.toFixed(1)} / 40h</span>
                        </div>
                        <div style={{ height: '12px', backgroundColor: '#f0f0f0', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(100, (totalHoursThisWeek / 40) * 100)}%`, height: '100%', backgroundColor: 'var(--color-primary)' }} />
                        </div>
                      </div>

                      {/* Extra metadata items below bar */}
                      <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500, marginTop: '4px' }}>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>
                            {tasks.filter(t => t.cr5db_assignee_email.toLowerCase() === currentUserEmail.toLowerCase() && t.cr5db_status === 'Completed').length}
                          </span> tasks
                        </div>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>{totalEntries}</span> entries
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* SCREEN 2: TASKS */}
          {activeTab === 'tasks' && (
            <div className="space-y-6 p-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', fontFamily: 'ui-sans-serif, system-ui, sans-serif', color: '#000000', backgroundColor: '#ffffff' }}>
              
              {/* Header Section */}
              <div className="task-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ color: '#000000', display: 'flex', alignItems: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#000000', lineHeight: '1.2' }}>
                      {language === 'vi' ? 'Quản lý Công việc' : 'Task Management'}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 400, color: 'rgba(0, 0, 0, 0.7)' }}>
                      <span>{language === 'vi' ? 'Chào mừng,' : 'Welcome,'} {currentUserName || 'User'}</span>
                      <span style={{ fontSize: '12px', fontWeight: 500, padding: '2px 8px', border: '1px solid #000000', borderRadius: '6px', color: '#000000', textTransform: 'capitalize' }}>
                        {activeRole === 'Admin' 
                          ? 'Super Admin' 
                          : `Employee${currentUserObj?.cr5db_systemrole?.startsWith('Employee:') 
                              ? ` (${currentUserObj.cr5db_systemrole.substring(9).split(',').map(gid => permissionGroups.find(g => g.id === gid)?.name || gid).join(', ')})` 
                              : ''}`
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowTaskModal(true)} 
                  className="new-task-btn"
                  style={{ height: '36px', borderRadius: '6px', border: 'none', padding: '8px 16px', fontWeight: 500, fontSize: '14px', backgroundColor: '#000000', color: '#ffffff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxSizing: 'border-box' }}
                >
                  <span>+</span> {t('tasks.addNew')}
                </button>
              </div>

              {/* Info Banner (Alert) */}
              <div style={{ border: '1px solid #000000', borderRadius: '8px', padding: '16px', fontSize: '14px', fontWeight: 400, backgroundColor: '#ffffff', color: '#000000', boxSizing: 'border-box' }}>
                {activeRole === 'Employee' ? (
                  <span>
                    <strong>{language === 'vi' ? 'Chế độ Nhân viên:' : 'Employee View:'}</strong>{' '}
                    {language === 'vi' ? 'Hiển thị các công việc được giao cho bạn hoặc do bạn tạo.' : 'Showing tasks assigned to you or created by you.'}
                  </span>
                ) : (
                  <span>
                    <strong>{language === 'vi' ? 'Chế độ Quản lý:' : 'Manager View:'}</strong>{' '}
                    {language === 'vi' ? 'Hiển thị tất cả các công việc để quản lý dự án.' : 'Showing all tasks for active project management.'}
                  </span>
                )}
              </div>

              {/* Filter & Search Controls */}
              <div className="task-filters">
                {/* Search Input */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#000000', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={taskSearchQuery}
                    onChange={(e) => setTaskSearchQuery(e.target.value)}
                    placeholder={language === 'vi' ? 'Tìm kiếm công việc...' : 'Search tasks...'}
                    style={{ width: '100%', height: '36px', border: '1px solid #000000', borderRadius: '6px', padding: '4px 12px 4px 40px', fontSize: '14px', fontWeight: 400, color: '#000000', boxSizing: 'border-box', backgroundColor: '#ffffff' }}
                  />
                </div>
                
                {/* Project Filter */}
                <div className="task-filter-select-wrapper">
                  <select
                    value={selectedFilterProject}
                    onChange={(e) => setSelectedFilterProject(e.target.value)}
                    style={{ width: '100%', height: '36px', border: '1px solid #000000', borderRadius: '6px', padding: '8px 12px', fontSize: '14px', fontWeight: 400, color: '#000000', backgroundColor: '#ffffff', cursor: 'pointer', appearance: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="All Projects">{language === 'vi' ? 'Tất cả Dự án' : 'All Projects'}</option>
                    {Array.from(new Set(tasks.map(t => t.cr5db_project_name).filter(Boolean))).map(proj => (
                      <option key={proj} value={proj}>{proj}</option>
                    ))}
                  </select>
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#000000', display: 'flex', alignItems: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Task list and Empty states */}
              {(() => {
                const queryFiltered = filteredTasks.filter(t => {
                  const matchSearch = !taskSearchQuery || t.cr5db_taskname.toLowerCase().includes(taskSearchQuery.toLowerCase()) || (t.cr5db_description || '').toLowerCase().includes(taskSearchQuery.toLowerCase());
                  const matchProject = selectedFilterProject === 'All Projects' || t.cr5db_project_name === selectedFilterProject;
                  return matchSearch && matchProject;
                });

                if (queryFiltered.length === 0) {
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '218px', border: '1px dashed #000000', borderRadius: '8px', padding: '80px 24px', textAlign: 'center', gap: '8px', boxSizing: 'border-box', backgroundColor: '#ffffff' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#000000', margin: 0 }}>
                        {language === 'vi' ? 'Không tìm thấy công việc nào' : 'No tasks found'}
                      </h3>
                      <p style={{ fontSize: '14px', fontWeight: 400, color: 'rgba(0, 0, 0, 0.7)', margin: 0 }}>
                        {language === 'vi' ? 'Hãy tạo công việc đầu tiên của bạn...' : 'Create your first task...'}
                      </p>
                    </div>
                  );
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {queryFiltered.map(task => (
                      <div key={task.cr5db_taskid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', border: '1px solid #000000', borderRadius: '8px', backgroundColor: '#ffffff', boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontWeight: 700, fontSize: '16px', color: '#000000' }}>{task.cr5db_taskname}</span>
                            <span style={{ fontSize: '12px', fontWeight: 500, padding: '2px 8px', border: '1px solid #000000', borderRadius: '6px', color: '#000000', backgroundColor: '#ffffff' }}>
                              {task.cr5db_project_name || (language === 'vi' ? 'Không thuộc dự án' : 'No Project')}
                            </span>
                          </div>
                          <p style={{ fontSize: '14px', fontWeight: 400, color: 'rgba(0, 0, 0, 0.7)', margin: 0 }}>{task.cr5db_description}</p>
                          <span style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.7)' }}>
                            {language === 'vi' ? 'Hạn:' : 'Due:'} {task.cr5db_due_date ? new Date(task.cr5db_due_date).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US') : (language === 'vi' ? 'Không giới hạn' : 'No limit')} | {language === 'vi' ? 'Phân công:' : 'Assignee:'} {task.cr5db_assignee_name}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: task.cr5db_status === 'Completed' ? '#107C41' : 'var(--color-primary)' }}>
                            {task.cr5db_status === 'Completed' 
                              ? (language === 'vi' ? 'Đã hoàn thành' : 'Completed') 
                              : task.cr5db_status === 'In Progress' 
                                ? (language === 'vi' ? 'Đang thực hiện' : 'In Progress') 
                                : (language === 'vi' ? 'Chưa bắt đầu' : 'Not Started')}
                          </span>
                          {task.cr5db_status !== 'Completed' && (
                            <button 
                              onClick={() => handleUpdateTaskStatus(task.cr5db_taskid, 'Completed')} 
                              style={{ height: '36px', borderRadius: '6px', border: '1px solid #000000', padding: '8px 16px', fontWeight: 500, fontSize: '14px', backgroundColor: 'transparent', color: '#000000', cursor: 'pointer', transition: 'background-color 0.2s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              {language === 'vi' ? 'Hoàn tất' : 'Complete'}
                            </button>
                          )}
                          
                          {(activeRole === 'Admin' || checkPermission('resources')) && (
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button
                                onClick={() => {
                                  const phase = projectPhases.find(p => p.cr5db_projectphaseid === task._cr5db_projectphaseid_value);
                                  setEditingTask(task);
                                  setNewTaskName(task.cr5db_taskname);
                                  setNewTaskDesc(task.cr5db_description);
                                  setNewTaskProjectId(phase?._cr5db_projectid_value || '');
                                  setNewTaskPhaseId(task._cr5db_projectphaseid_value || '');
                                  setNewTaskObjectiveId(task._cr5db_objectivename_value || '');
                                  setNewTaskParentId(task._cr5db_parenttask_value || '');
                                  setNewTaskAssigneeId(task._cr5db_assigneeid_value || '');
                                  setNewTaskDueDate(task.cr5db_due_date ? new Date(task.cr5db_due_date).toISOString().split('T')[0] : '');
                                  setNewTaskStatus(task.cr5db_status);
                                  setShowTaskModal(true);
                                }}
                                style={{ height: '36px', borderRadius: '6px', border: '1px solid #742774', padding: '8px 16px', fontWeight: 500, fontSize: '14px', backgroundColor: 'transparent', color: '#742774', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                {t('common.edit')}
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.cr5db_taskid)}
                                style={{ height: '36px', borderRadius: '6px', border: '1px solid #a80000', padding: '8px 16px', fontWeight: 500, fontSize: '14px', backgroundColor: 'transparent', color: '#a80000', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                {t('common.delete')}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* SCREEN 3: TIMESHEETS */}
          {activeTab === 'timesheets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Header section matching Image 3 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--color-text)', display: 'flex', alignItems: 'center' }}><ClockIcon /></span>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1.2 }}>{t('timesheets.title')}</h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '2px' }}>
                      {language === 'vi' ? 'Ghi nhận và quản lý giờ làm việc của bạn' : 'Log and manage your work hours'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowTimesheetModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>+</span> {t('timesheets.logHours')}
                </button>
              </div>

              {/* Metrics grid matching Image 3 */}
              <div className="metrics-grid">
                <div className="metric-card" style={{ gap: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    <span>{language === 'vi' ? 'Tuần này' : 'This Week'}</span>
                  </div>
                  <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text)' }}>{totalHoursThisWeek.toFixed(1)}h</span>
                  <span className="metric-label" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    {myTimesheets.length} {language === 'vi' ? 'lượt chấm công' : 'entries logged'}
                  </span>
                </div>
                <div className="metric-card" style={{ gap: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    <span>{language === 'vi' ? 'Chờ duyệt' : 'Pending'}</span>
                  </div>
                  <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700, color: '#E29E2E' }}>{pendingCount}</span>
                  <span className="metric-label" style={{ fontSize: '12px', color: '#E29E2E', fontWeight: 500 }}>
                    {language === 'vi' ? 'Đang chờ phê duyệt' : 'Awaiting approval'}
                  </span>
                </div>
                <div className="metric-card" style={{ gap: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>{language === 'vi' ? 'Đã duyệt' : 'Approved'}</span>
                  </div>
                  <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700, color: '#107C41' }}>{approvedCount}</span>
                  <span className="metric-label" style={{ fontSize: '12px', color: '#107C41', fontWeight: 500 }}>
                    {language === 'vi' ? 'Tuần này' : 'This week'}
                  </span>
                </div>
                <div className="metric-card" style={{ gap: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                    <span>{language === 'vi' ? 'Trung bình ngày' : 'Avg Daily'}</span>
                  </div>
                  <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text)' }}>{avgDaily}h</span>
                  <span className="metric-label" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    {language === 'vi' ? 'Trung bình mỗi lượt' : 'Average per entry'}
                  </span>
                </div>
              </div>

              {/* Sub navigation button tabs matching Image 3 */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setActiveTimesheetSubTab('my')}
                  style={{
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: activeTimesheetSubTab === 'my' ? '#FAF9F9' : 'transparent',
                    color: activeTimesheetSubTab === 'my' ? 'var(--color-text)' : 'var(--color-text-secondary)'
                  }}
                >
                  {t('timesheets.myTimesheets')}
                </button>
                {(activeRole === 'Admin' || checkPermission('resources')) && (
                  <button
                    onClick={() => setActiveTimesheetSubTab('approvals')}
                    style={{
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      backgroundColor: activeTimesheetSubTab === 'approvals' ? '#FAF9F9' : 'transparent',
                      color: activeTimesheetSubTab === 'approvals' ? 'var(--color-text)' : 'var(--color-text-secondary)'
                    }}
                  >
                    {t('timesheets.approvals')}
                  </button>
                )}
              </div>

              {activeTimesheetSubTab === 'my' ? (
                <div className="card-spec" style={{ padding: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{language === 'vi' ? 'Lượt chấm công của tôi' : 'My Time Entries'}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '2px', marginBottom: '24px' }}>
                    {language === 'vi' ? 'Xem và quản lý số giờ làm việc đã ghi nhận của bạn' : 'View and manage your logged work hours'}
                  </p>

                  {myTimesheets.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)' }}>
                          {language === 'vi' ? 'Chưa có lượt chấm công nào' : 'No time entries yet'}
                        </h4>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                          {language === 'vi' ? 'Bắt đầu ghi nhận giờ làm việc để theo dõi thời gian của bạn.' : 'Start logging your work hours to track your time.'}
                        </p>
                      </div>
                      <button onClick={() => setShowTimesheetModal(true)} className="btn-filled-3" style={{ fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span>+</span> {language === 'vi' ? 'Chấm công lượt đầu tiên' : 'Log Your First Entry'}
                      </button>
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                          <th style={{ padding: '12px' }}>{language === 'vi' ? 'Ngày ghi nhận' : 'Log Date'}</th>
                          <th style={{ padding: '12px' }}>{language === 'vi' ? 'Nhiệm vụ' : 'Task'}</th>
                          <th style={{ padding: '12px' }}>{language === 'vi' ? 'Mô tả' : 'Description'}</th>
                          <th style={{ padding: '12px' }}>{language === 'vi' ? 'Số giờ' : 'Hours'}</th>
                          <th style={{ padding: '12px' }}>{language === 'vi' ? 'Trạng thái' : 'Status'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myTimesheets.map(ts => (
                          <tr key={ts.cr5db_timesheetlogid} style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <td style={{ padding: '12px' }}>{ts.cr5db_logdate ? new Date(ts.cr5db_logdate).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US') : ''}</td>
                            <td style={{ padding: '12px' }}>{ts.cr5db_taskname}</td>
                            <td style={{ padding: '12px' }}>{ts.cr5db_timesheetlog1}</td>
                            <td style={{ padding: '12px', fontWeight: 600 }}>{ts.cr5db_actualhoursworked}h</td>
                            <td style={{ padding: '12px' }}>
                              <span className={
                                ts.statecode === 0 ? 'status-pending'
                                : ts.cr5db_timesheetlog1?.startsWith('[Từ chối]') ? 'status-rejected'
                                : 'status-approved'
                              }>
                                {ts.statecode === 0 
                                  ? (language === 'vi' ? 'Chờ duyệt' : 'Pending') 
                                  : ts.cr5db_timesheetlog1?.startsWith('[Từ chối]') 
                                    ? (language === 'vi' ? 'Từ chối' : 'Rejected') 
                                    : (language === 'vi' ? 'Đã duyệt' : 'Approved')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : (
                <>
                  <div className="large-card" style={{ padding: '24px' }}>
                    {pendingApprovalsTimesheets.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                        {language === 'vi' ? 'Không có timesheet nào đang chờ phê duyệt.' : 'No timesheets awaiting review.'}
                      </div>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '12px' }}>{language === 'vi' ? 'Nhân viên' : 'Employee'}</th>
                            <th style={{ padding: '12px' }}>{language === 'vi' ? 'Ngày ghi nhận' : 'Log Date'}</th>
                            <th style={{ padding: '12px' }}>{language === 'vi' ? 'Nhiệm vụ' : 'Task'}</th>
                            <th style={{ padding: '12px' }}>{language === 'vi' ? 'Mô tả' : 'Description'}</th>
                            <th style={{ padding: '12px' }}>{language === 'vi' ? 'Số giờ' : 'Hours'}</th>
                            <th style={{ padding: '12px' }}>{language === 'vi' ? 'Thao tác' : 'Actions'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingApprovalsTimesheets.map(ts => (
                            <tr key={ts.cr5db_timesheetlogid} style={{ borderBottom: '1px solid var(--color-border)' }}>
                              <td style={{ padding: '12px', fontWeight: 600 }}>{ts.cr5db_username}</td>
                              <td style={{ padding: '12px' }}>{ts.cr5db_logdate ? new Date(ts.cr5db_logdate).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US') : ''}</td>
                              <td style={{ padding: '12px' }}>{ts.cr5db_taskname}</td>
                              <td style={{ padding: '12px' }}>{ts.cr5db_timesheetlog1}</td>
                              <td style={{ padding: '12px', fontWeight: 600 }}>{ts.cr5db_actualhoursworked}h</td>
                              <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleApproveTimesheet(ts.cr5db_timesheetlogid)} className="btn-filled-2" style={{ padding: '4px 8px' }}>
                                  {language === 'vi' ? 'Duyệt' : 'Approve'}
                                </button>
                                <button onClick={() => { setTimesheetToRejectId(ts.cr5db_timesheetlogid); setShowRejectionModal(true); }} className="btn-filled-3" style={{ padding: '4px 8px', color: '#a80000' }}>
                                  {language === 'vi' ? 'Từ chối' : 'Reject'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'kpi' && (() => {
            let filteredKpis = activeRole === 'Employee'
              ? kpiTargets.filter(k => k.cr5db_user_email.toLowerCase() === currentUserEmail.toLowerCase())
              : selectedKpiEmployeeFilter === 'All'
                ? kpiTargets
                : kpiTargets.filter(k => {
                    const employee = usersList.find(u => u.cr5db_userid === k._cr5db_employeeid_value);
                    return employee?.cr5db_userid === selectedKpiEmployeeFilter;
                  });

            if (selectedKpiObjectiveFilter !== 'All') {
              filteredKpis = filteredKpis.filter(k => k._cr5db_parentobjective_value === selectedKpiObjectiveFilter);
            }
            if (selectedKpiPeriodFilter !== 'All') {
              filteredKpis = filteredKpis.filter(k => k.cr5db_period === selectedKpiPeriodFilter);
            }
            const userKpis = filteredKpis;
            return (
              <div className="space-y-6 p-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', fontFamily: 'ui-sans-serif, system-ui, sans-serif', color: '#000000', backgroundColor: '#ffffff' }}>
              {/* Header section */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#000000', display: 'flex', alignItems: 'center' }}><TargetIcon /></span>
                  <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#000000', lineHeight: 1.2 }}>
                      {activeRole === 'Employee' ? 'My KPIs' : 'KPI Target Management'}
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '2px 0 0 0', fontWeight: 400 }}>
                      {activeRole === 'Employee' ? 'Theo dõi mục tiêu hiệu suất cá nhân' : 'Quản lý, gán chỉ tiêu hiệu suất KPI cho nhân sự tổ chức'}
                    </p>
                  </div>
                </div>

                {activeRole !== 'Employee' && (
                  <button
                    onClick={() => {
                      const firstLib = kpiLibrariesList[0];
                      setEditingKpi(null);
                      setKpiTargetName(firstLib ? (firstLib.cr5db_kpiname || '') : '');
                      setKpiTargetValue(100);
                      setKpiActualValue(0);
                      setKpiWeight(10);
                      setKpiUnit(firstLib ? (firstLib.cr5db_unit || '%') : '%');
                      setKpiPeriod('Q2/2026');
                      setKpiEmployeeId(usersList[0]?.cr5db_userid || '');
                      setKpiObjectiveId(objectivesList[0]?.cr5db_objectiveid || '');
                      setKpiLibraryId(firstLib ? firstLib.cr5db_kpilibraryid : '');
                      setShowKpiModal(true);
                    }}
                    className="btn-primary"
                  >
                    + Gán KPI mới
                  </button>
                )}
              </div>

              {/* Sub navigation button tabs */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setActiveKpiSubTab('overview')}
                  style={{
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    backgroundColor: activeKpiSubTab === 'overview' ? '#FAF9F9' : 'transparent',
                    color: activeKpiSubTab === 'overview' ? '#000000' : 'rgba(0, 0, 0, 0.7)'
                  }}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveKpiSubTab('charts')}
                  style={{
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    backgroundColor: activeKpiSubTab === 'charts' ? '#FAF9F9' : 'transparent',
                    color: activeKpiSubTab === 'charts' ? '#000000' : 'rgba(0, 0, 0, 0.7)'
                  }}
                >
                  Progress Charts
                </button>
              </div>

              {activeKpiSubTab === 'overview' ? (
                (() => {
                  const totalCount = userKpis.length;
                  const onTrackCount = userKpis.filter(k => k.cr5db_actualvalue >= k.cr5db_targetvalue).length;
                  const atRiskCount = userKpis.filter(k => k.cr5db_actualvalue < k.cr5db_targetvalue && k.cr5db_actualvalue > 0).length;
                  const behindCount = userKpis.filter(k => k.cr5db_actualvalue === 0).length;

                  return (
                    <>
                      {/* Metrics grid */}
                      <div className="metrics-grid">
                        <div className="metric-card" style={{ gap: '16px', padding: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--color-text)', display: 'flex', alignItems: 'center' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
                            </span>
                            <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700 }}>{totalCount}</span>
                          </div>
                          <span className="metric-label" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>KPI Targets</span>
                        </div>
                        <div className="metric-card" style={{ gap: '16px', padding: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#107C41', display: 'flex', alignItems: 'center' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </span>
                            <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700, color: '#107C41' }}>
                              {onTrackCount}
                            </span>
                          </div>
                          <span className="metric-label" style={{ fontSize: '12px', color: '#107C41', fontWeight: 500 }}>On Track</span>
                        </div>
                        <div className="metric-card" style={{ gap: '16px', padding: '20px', borderColor: atRiskCount > 0 ? '#E29E2E' : 'var(--color-border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#E29E2E', display: 'flex', alignItems: 'center' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            </span>
                            <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700, color: '#E29E2E' }}>
                              {atRiskCount}
                            </span>
                          </div>
                          <span className="metric-label" style={{ fontSize: '12px', color: '#E29E2E', fontWeight: 500 }}>At Risk</span>
                        </div>
                        <div className="metric-card" style={{ gap: '16px', padding: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>
                            </span>
                            <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                              {behindCount}
                            </span>
                          </div>
                          <span className="metric-label" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Behind</span>
                        </div>
                      </div>

                      {/* Filter panel */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', padding: '12px 16px', backgroundColor: '#F8F9FA', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                        {activeRole !== 'Employee' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600 }}>Nhân sự:</span>
                            <select
                              value={selectedKpiEmployeeFilter}
                              onChange={(e) => setSelectedKpiEmployeeFilter(e.target.value)}
                              className="input-spec"
                              style={{ width: '180px', height: '34px', padding: '4px 10px', fontSize: '13px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
                            >
                              <option value="All">Tất cả nhân viên</option>
                              {usersList.map(u => (
                                <option key={u.cr5db_userid} value={u.cr5db_userid}>{u.cr5db_fullname}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600 }}>Chu kỳ:</span>
                          <select
                            value={selectedKpiPeriodFilter}
                            onChange={(e) => setSelectedKpiPeriodFilter(e.target.value)}
                            className="input-spec"
                            style={{ width: '150px', height: '34px', padding: '4px 10px', fontSize: '13px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
                          >
                            <option value="All">Tất cả chu kỳ</option>
                            {Array.from(new Set([
                              ...objectivesList.map(o => o.cr5db_periodnamename),
                              ...kpiTargets.map(k => k.cr5db_period)
                            ].filter(Boolean))).map(p => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600 }}>Mục tiêu chung:</span>
                          <select
                            value={selectedKpiObjectiveFilter}
                            onChange={(e) => setSelectedKpiObjectiveFilter(e.target.value)}
                            className="input-spec"
                            style={{ width: '220px', height: '34px', padding: '4px 10px', fontSize: '13px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
                          >
                            <option value="All">Tất cả mục tiêu chung</option>
                            {objectivesList.map(o => (
                              <option key={o.cr5db_objectiveid} value={o.cr5db_objectiveid}>{o.cr5db_objective1}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Main content table card */}
                      <div className="card-spec" style={{ padding: '0px', overflow: 'hidden' }}>
                        {userKpis.length === 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center', gap: '12px' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-text-secondary)' }}><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)' }}>No KPI targets found</h4>
                              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Không tìm thấy mục tiêu hiệu suất nào phù hợp bộ lọc.</p>
                            </div>
                          </div>
                        ) : (
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                                <th style={{ padding: '14px 20px' }}>Mục tiêu KPI</th>
                                {activeRole !== 'Employee' && <th style={{ padding: '14px 20px' }}>Nhân sự</th>}
                                <th style={{ padding: '14px 20px' }}>Mục tiêu chung</th>
                                <th style={{ padding: '14px 20px' }}>Chu kỳ</th>
                                <th style={{ padding: '14px 20px' }}>Tỷ trọng</th>
                                <th style={{ padding: '14px 20px' }}>Mục tiêu</th>
                                <th style={{ padding: '14px 20px' }}>Thực tế</th>
                                <th style={{ padding: '14px 20px' }}>Đánh giá</th>
                                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Thao tác</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userKpis.map(k => {
                                const rate = k.cr5db_targetvalue > 0 ? Math.min(100, Math.round((k.cr5db_actualvalue / k.cr5db_targetvalue) * 100)) : 0;
                                const employeeName = usersList.find(u => u.cr5db_userid === k._cr5db_employeeid_value)?.cr5db_fullname || k.cr5db_user_email.split('@')[0];
                                return (
                                  <tr key={k.cr5db_kpitargetid} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '14px 20px', fontWeight: 600 }}>{k.cr5db_kpiname}</td>
                                    {activeRole !== 'Employee' && <td style={{ padding: '14px 20px' }}>{employeeName}</td>}
                                    <td style={{ padding: '14px 20px' }}>{k.cr5db_objective_name || 'Chưa liên kết'}</td>
                                    <td style={{ padding: '14px 20px' }}>{k.cr5db_period}</td>
                                    <td style={{ padding: '14px 20px' }}>{k.cr5db_weightpercentage}%</td>
                                    <td style={{ padding: '14px 20px' }}>{k.cr5db_targetvalue} {k.cr5db_unit}</td>
                                    <td style={{ padding: '14px 20px', fontWeight: 600 }}>{k.cr5db_actualvalue} {k.cr5db_unit}</td>
                                    <td style={{ padding: '14px 20px' }}>
                                      <span style={{ fontWeight: 700, color: rate >= 80 ? '#107C41' : 'var(--color-primary)' }}>{rate}%</span>
                                    </td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        {activeRole === 'Employee' ? (
                                          <button
                                            onClick={() => {
                                              setEditingKpi(k);
                                              setKpiActualValue(k.cr5db_actualvalue);
                                              setShowKpiModal(true);
                                            }}
                                            className="btn-filled-3"
                                            style={{ padding: '4px 8px', fontSize: '12px' }}
                                          >
                                            Cập nhật thực tế
                                          </button>
                                        ) : (
                                          <>
                                            <button
                                              onClick={() => {
                                                setEditingKpi(k);
                                                setKpiTargetName(k.cr5db_kpiname);
                                                setKpiTargetValue(k.cr5db_targetvalue);
                                                setKpiActualValue(k.cr5db_actualvalue);
                                                setKpiWeight(k.cr5db_weightpercentage);
                                                setKpiUnit(k.cr5db_unit);
                                                setKpiPeriod(k.cr5db_period);
                                                setKpiEmployeeId(k._cr5db_employeeid_value || '');
                                                setKpiObjectiveId(k._cr5db_parentobjective_value || '');
                                                setKpiLibraryId(k._cr5db_kpicode_value || '');
                                                setShowKpiModal(true);
                                              }}
                                              className="btn-filled-3"
                                              style={{ padding: '4px 8px', fontSize: '12px' }}
                                            >
                                              Sửa
                                            </button>
                                            <button
                                              onClick={() => handleDeleteKpi(k.cr5db_kpitargetid)}
                                              className="btn-filled-3"
                                              style={{ padding: '4px 8px', fontSize: '12px', color: '#a80000', borderColor: '#fde7e9' }}
                                            >
                                              Xóa
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </>
                  );
                })()
              ) : (
                <>
                  {/* Time Range Selection */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {['week', 'month', 'quarter'].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setKpiTimeRange(preset as any)}
                          style={{
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            backgroundColor: kpiTimeRange === preset ? '#000000' : 'transparent',
                            color: kpiTimeRange === preset ? '#ffffff' : '#000000',
                            textTransform: 'capitalize'
                          }}
                        >
                          {preset}
                        </button>
                      ))}
                      
                      {/* Custom Button */}
                      <button
                        onClick={() => setKpiTimeRange('custom')}
                        style={{
                          border: '1px solid #000000',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '14px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          backgroundColor: kpiTimeRange === 'custom' ? '#000000' : '#ffffff',
                          color: kpiTimeRange === 'custom' ? '#ffffff' : '#000000',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxSizing: 'border-box'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Custom
                      </button>
                    </div>

                    {kpiTimeRange === 'custom' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
                        <input
                          type="date"
                          value={kpiCustomStartDate}
                          onChange={(e) => setKpiCustomStartDate(e.target.value)}
                          className="input-spec"
                          style={{ height: '32px', padding: '4px 8px', fontSize: '13px' }}
                        />
                        <span style={{ fontSize: '13px' }}>đến</span>
                        <input
                          type="date"
                          value={kpiCustomEndDate}
                          onChange={(e) => setKpiCustomEndDate(e.target.value)}
                          className="input-spec"
                          style={{ height: '32px', padding: '4px 8px', fontSize: '13px' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Date Range Indicator */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#000000', fontWeight: 500 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>
                      {(() => {
                        const formatDate = (dateStr: string) => {
                          try {
                            const d = new Date(dateStr);
                            if (isNaN(d.getTime())) return dateStr;
                            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                          } catch {
                            return dateStr;
                          }
                        };

                        if (kpiTimeRange === 'custom') {
                          return `Showing progress from ${formatDate(kpiCustomStartDate)} to ${formatDate(kpiCustomEndDate)}`;
                        }
                        
                        // Otherwise calculate for presets
                        const today = new Date();
                        let start = new Date();
                        if (kpiTimeRange === 'week') {
                          start.setDate(today.getDate() - 7);
                        } else if (kpiTimeRange === 'month') {
                          start.setMonth(today.getMonth() - 1);
                        } else {
                          // quarter
                          start.setMonth(today.getMonth() - 3);
                        }
                        return `Showing progress from ${formatDate(start.toISOString())} to ${formatDate(today.toISOString())}`;
                      })()}
                    </span>
                  </div>

                    {/* Dynamic Visual Seeding Charts */}
                    {userKpis.length === 0 ? (
                      <div className="card-spec" style={{ border: '1.11px solid #000000', borderRadius: '12px', padding: '24px', boxSizing: 'border-box', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)', backgroundColor: '#ffffff', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Empty State (No Data) */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center', gap: '16px' }}>
                          <div style={{ color: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                              <polyline points="17 6 23 6 23 12" />
                            </svg>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <h4 style={{ fontSize: '18px', fontWeight: 500, color: '#000000', margin: 0 }}>No KPI progress data</h4>
                            <p style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.7)', margin: 0 }}>Progress charts will appear here once KPIs are assigned to you</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Highlights cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                          {(() => {
                            const rates = userKpis.map(k => k.cr5db_targetvalue > 0 ? Math.min(100, Math.round((k.cr5db_actualvalue / k.cr5db_targetvalue) * 100)) : 0);
                            const avgProgress = rates.length > 0 ? Math.round(rates.reduce((sum, r) => sum + r, 0) / rates.length) : 0;
                            const totalWeight = userKpis.reduce((sum, k) => sum + (k.cr5db_weightpercentage || 0), 0);
                            const achievedCount = userKpis.filter(k => k.cr5db_actualvalue >= k.cr5db_targetvalue).length;
                            
                            return (
                              <>
                                <div className="card-spec" style={{ border: '1.11px solid #000000', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #b6393a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: '#b6393a' }}>
                                    {avgProgress}%
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', fontWeight: 600 }}>Tiến độ Trung bình</div>
                                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#000000' }}>{avgProgress}% Hoàn thành</div>
                                  </div>
                                </div>

                                <div className="card-spec" style={{ border: '1.11px solid #000000', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #107C41', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#107C41' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', fontWeight: 600 }}>KPI Đạt mục tiêu</div>
                                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#000000' }}>{achievedCount} / {userKpis.length} Chỉ tiêu</div>
                                  </div>
                                </div>

                                <div className="card-spec" style={{ border: '1.11px solid #000000', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #ff8c00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: '#ff8c00' }}>
                                    {totalWeight}%
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', fontWeight: 600 }}>Tổng Tỷ trọng Đã gán</div>
                                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#000000' }}>{totalWeight}% Tỷ trọng</div>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>

                        {/* Comparative Horizontal SVG Bar Chart */}
                        <div className="card-spec" style={{ border: '1.11px solid #000000', borderRadius: '12px', padding: '24px', backgroundColor: '#ffffff' }}>
                          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 20px 0', color: '#000000' }}>Biểu đồ So sánh Mục tiêu vs Thực tế</h3>
                          
                          {(() => {
                            const chartHeight = Math.max(220, userKpis.length * 55 + 40);
                            return (
                              <div style={{ overflowX: 'auto', width: '100%' }}>
                                <svg width="100%" height={chartHeight} style={{ minWidth: '450px', overflow: 'visible' }}>
                                  {/* Grid Lines & Percent Labels */}
                                  {[0, 25, 50, 75, 100].map((val) => {
                                    const xPos = `${180 + val * 5.2}px`;
                                    return (
                                      <g key={val}>
                                        <line x1={xPos} y1="10" x2={xPos} y2={chartHeight - 30} stroke="rgba(0,0,0,0.08)" strokeDasharray="3,3" />
                                        <text x={xPos} y={chartHeight - 12} textAnchor="middle" style={{ fontSize: '11px', fill: 'rgba(0,0,0,0.5)', fontFamily: 'inherit' }}>{val}%</text>
                                      </g>
                                    );
                                  })}

                                  {/* Draw comparative bars for each KPI */}
                                  {userKpis.map((k, idx) => {
                                    const yPos = idx * 55 + 20;
                                    const progressRate = k.cr5db_targetvalue > 0 ? Math.min(100, Math.round((k.cr5db_actualvalue / k.cr5db_targetvalue) * 100)) : 0;
                                    const kpiNameTruncated = k.cr5db_kpiname.length > 25 ? k.cr5db_kpiname.substring(0, 23) + '...' : k.cr5db_kpiname;

                                    return (
                                      <g key={k.cr5db_kpitargetid} style={{ transition: 'all 0.3s ease' }}>
                                        {/* KPI Title Label */}
                                        <text x="10" y={yPos + 18} style={{ fontSize: '13px', fontWeight: 600, fill: '#000000', fontFamily: 'inherit' }}>
                                          {kpiNameTruncated}
                                        </text>
                                        <title>{k.cr5db_kpiname}</title>

                                        {/* Track bar */}
                                        <rect x="180" y={yPos} width="520" height="28" rx="6" fill="#FAF9F9" stroke="rgba(0,0,0,0.1)" strokeWidth="1.11" />

                                        {/* Progress actual bar */}
                                        <rect 
                                          x="180" 
                                          y={yPos + 2} 
                                          width={progressRate * 5.2} 
                                          height="24" 
                                          rx="4" 
                                          fill={progressRate >= 100 ? '#107C41' : progressRate >= 80 ? '#2ea366' : '#b6393a'} 
                                        />

                                        {/* Target line indicator (100% of target) */}
                                        <line x1="700" y1={yPos - 4} x2="700" y2={yPos + 32} stroke="#000000" strokeWidth="2" strokeDasharray="3,3" />

                                        {/* Progress Label inside or next to bar */}
                                        <text x={progressRate > 15 ? 190 : (190 + progressRate * 5.2)} y={yPos + 18} style={{ fontSize: '11px', fontWeight: 700, fill: progressRate > 15 ? '#ffffff' : '#000000', fontFamily: 'inherit' }}>
                                          {k.cr5db_actualvalue}/{k.cr5db_targetvalue} {k.cr5db_unit} ({progressRate}%)
                                        </text>
                                      </g>
                                    );
                                  })}
                                </svg>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })()}

          {/* SCREEN 5: PERFORMANCE */}
          {activeTab === 'performance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Performance reviews</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Periodic evaluation targets and self ratings</p>
              </div>

              <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', gap: '16px', paddingBottom: '8px' }}>
                <button onClick={() => setActivePerformanceSubTab('my')} style={{ background: 'none', border: 'none', color: activePerformanceSubTab === 'my' ? 'var(--color-text)' : 'var(--color-text-secondary)', fontWeight: activePerformanceSubTab === 'my' ? 700 : 500, cursor: 'pointer', borderBottom: activePerformanceSubTab === 'my' ? '2px solid var(--color-text)' : 'none', padding: '4px 8px' }}>
                  My Appraisals
                </button>
                {activeRole !== 'Employee' && (
                  <>
                    <button onClick={() => setActivePerformanceSubTab('team')} style={{ background: 'none', border: 'none', color: activePerformanceSubTab === 'team' ? 'var(--color-text)' : 'var(--color-text-secondary)', fontWeight: activePerformanceSubTab === 'team' ? 700 : 500, cursor: 'pointer', borderBottom: activePerformanceSubTab === 'team' ? '2px solid var(--color-text)' : 'none', padding: '4px 8px' }}>
                      Team Appraisals
                    </button>
                    <button onClick={() => setActivePerformanceSubTab('cycles')} style={{ background: 'none', border: 'none', color: activePerformanceSubTab === 'cycles' ? 'var(--color-text)' : 'var(--color-text-secondary)', fontWeight: activePerformanceSubTab === 'cycles' ? 700 : 500, cursor: 'pointer', borderBottom: activePerformanceSubTab === 'cycles' ? '2px solid var(--color-text)' : 'none', padding: '4px 8px' }}>
                      Quản lý chu kỳ & phát động
                    </button>
                  </>
                )}
              </div>

              {activePerformanceSubTab === 'my' ? (
                appraisals.filter(ap => ap.cr5db_employeeemail?.toLowerCase() === currentUserEmail.toLowerCase()).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>No appraisals logs found.</div>
                ) : (
                  <div className="card-spec" style={{ padding: '0px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                          <th style={{ padding: '14px 20px' }}>Tên đợt đánh giá</th>
                          <th style={{ padding: '14px 20px' }}>Người đánh giá</th>
                          <th style={{ padding: '14px 20px' }}>Tự chấm</th>
                          <th style={{ padding: '14px 20px' }}>Chung cuộc</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appraisals.filter(ap => ap.cr5db_employeeemail?.toLowerCase() === currentUserEmail.toLowerCase()).map(ap => (
                          <tr key={ap.cr5db_performanceappraisalid} style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <td style={{ padding: '14px 20px', fontWeight: 600 }}>{ap.cr5db_performanceappraisal1}</td>
                            <td style={{ padding: '14px 20px' }}>{ap.cr5db_evaluatorname}</td>
                            <td style={{ padding: '14px 20px' }}>
                              {(() => {
                                const periodObj = evaluationPeriodsList.find(p => p.cr5db_evaluationperiod1 === ap.cr5db_periodname);
                                const isLocked = !!periodObj?.cr5db_islocked;
                                return (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input 
                                      type="number" 
                                      min={0} 
                                      max={100}
                                      defaultValue={ap.cr5db_selfscore}
                                      onBlur={(e) => handleUpdateSelfAppraisalScore(ap.cr5db_performanceappraisalid, Number(e.target.value))}
                                      style={{ width: '60px', padding: '4px 8px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: isLocked ? '#F3F2F1' : 'white' }}
                                      disabled={isLocked}
                                    />
                                    <span style={{ fontSize: '13px' }}>/100</span>
                                    {isLocked && <span style={{ fontSize: '11px', color: '#ff8c00', fontWeight: 600, marginLeft: '6px' }}>(Đã khóa)</span>}
                                  </div>
                                );
                              })()}
                            </td>
                            <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--color-primary)' }}>{ap.cr5db_finalscore}/100</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : activePerformanceSubTab === 'team' ? (
                <div className="card-spec" style={{ padding: '0px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                        <th style={{ padding: '14px 20px' }}>Nhân viên</th>
                        <th style={{ padding: '14px 20px' }}>Đợt đánh giá</th>
                        <th style={{ padding: '14px 20px' }}>Tự chấm</th>
                        <th style={{ padding: '14px 20px' }}>Điểm chung cuộc</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appraisals.map(ap => (
                        <tr key={ap.cr5db_performanceappraisalid} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '14px 20px', fontWeight: 600 }}>{ap.cr5db_employeename}</td>
                          <td style={{ padding: '14px 20px' }}>{ap.cr5db_performanceappraisal1}</td>
                          <td style={{ padding: '14px 20px' }}>{ap.cr5db_selfscore}/100</td>
                          <td style={{ padding: '14px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input 
                                type="number" 
                                min={0} 
                                max={100}
                                defaultValue={ap.cr5db_finalscore}
                                onBlur={(e) => handleUpdateAppraisalScore(ap.cr5db_performanceappraisalid, Number(e.target.value))}
                                style={{ width: '60px', padding: '4px 8px', border: '1px solid var(--color-border)', borderRadius: '4px' }}
                              />
                              <span style={{ fontSize: '13px' }}>/100</span>
                              <button 
                                onClick={() => handleAutoCalculateAppraisal(ap.cr5db_performanceappraisalid, ap.cr5db_employeeemail)}
                                className="btn-filled-3"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                              >
                                Tự tính
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button 
                      onClick={() => {
                        setEditingPeriod(null);
                        setNewPeriodName('');
                        setNewPeriodStartDate('');
                        setNewPeriodEndDate('');
                        setShowPeriodModal(true);
                      }}
                      className="btn-primary"
                      style={{ fontSize: '13px' }}
                    >
                      + Tạo chu kỳ mới
                    </button>
                    <button 
                      onClick={() => {
                        setNewAppraisalName('');
                        setNewAppraisalEmployeeId(usersList[0]?.cr5db_userid || '');
                        setNewAppraisalEvaluatorId(usersList[0]?.cr5db_userid || '');
                        setNewAppraisalPeriodId(evaluationPeriodsList[0]?.cr5db_evaluationperiodid || '');
                        setShowAssignAppraisalModal(true);
                      }}
                      className="btn-filled-3"
                      style={{ fontSize: '13px' }}
                    >
                      + Phát động đánh giá
                    </button>
                  </div>

                  <div className="card-spec" style={{ padding: '0px', overflow: 'hidden' }}>
                    {evaluationPeriodsList.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>Không có chu kỳ đánh giá nào. Hãy tạo một chu kỳ để bắt đầu!</div>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '14px 20px' }}>Chu kỳ</th>
                            <th style={{ padding: '14px 20px' }}>Ngày bắt đầu</th>
                            <th style={{ padding: '14px 20px' }}>Ngày kết thúc</th>
                            <th style={{ padding: '14px 20px' }}>Khóa</th>
                            <th style={{ padding: '14px 20px', textAlign: 'right' }}>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {evaluationPeriodsList.map(p => (
                            <tr key={p.cr5db_evaluationperiodid} style={{ borderBottom: '1px solid var(--color-border)' }}>
                              <td style={{ padding: '14px 20px', fontWeight: 600 }}>{p.cr5db_evaluationperiod1}</td>
                              <td style={{ padding: '14px 20px' }}>{p.cr5db_startdate ? new Date(p.cr5db_startdate).toLocaleDateString('vi-VN') : '---'}</td>
                              <td style={{ padding: '14px 20px' }}>{p.cr5db_enddate ? new Date(p.cr5db_enddate).toLocaleDateString('vi-VN') : '---'}</td>
                              <td style={{ padding: '14px 20px' }}>
                                <button 
                                  onClick={() => handleTogglePeriodLock(p.cr5db_evaluationperiodid, !!p.cr5db_islocked)}
                                  className={p.cr5db_islocked ? "btn-filled-3" : "btn-filled-2"}
                                  style={{ padding: '4px 10px', fontSize: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: p.cr5db_islocked ? '#FDE7E9' : '#DFF6DD', color: p.cr5db_islocked ? '#A80000' : '#107C41' }}
                                >
                                  {p.cr5db_islocked ? "🔒 Đang khóa" : "🔓 Đang mở"}
                                </button>
                              </td>
                              <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                  <button
                                    onClick={() => {
                                      setEditingPeriod(p);
                                      setNewPeriodName(p.cr5db_evaluationperiod1);
                                      setNewPeriodStartDate(p.cr5db_startdate ? p.cr5db_startdate.split('T')[0] : '');
                                      setNewPeriodEndDate(p.cr5db_enddate ? p.cr5db_enddate.split('T')[0] : '');
                                      setShowPeriodModal(true);
                                    }}
                                    className="btn-filled-3"
                                    style={{ padding: '4px 8px', fontSize: '12px' }}
                                  >
                                    Sửa
                                  </button>
                                  <button
                                    onClick={() => handleDeletePeriod(p.cr5db_evaluationperiodid)}
                                    className="btn-filled-3"
                                    style={{ padding: '4px 8px', fontSize: '12px', color: '#a80000', borderColor: '#fde7e9' }}
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SCREEN 6: COMPANIES */}
          {activeTab === 'companies' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Companies & Departments</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Manage legal entities structure and departments mapping</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setShowCompanyModal(true)} className="btn-primary">+ Add Company</button>
                  <button onClick={() => setShowDeptModal(true)} className="btn-filled-3">+ Add Dept</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Left: Companies */}
                <div className="large-card" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Companies</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                        <th style={{ padding: '8px' }}>Mã</th>
                        <th style={{ padding: '8px' }}>Tên công ty</th>
                        <th style={{ padding: '8px', textAlign: 'right' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companiesList.map(c => (
                        <tr key={c.cr5db_companyid} onClick={() => setSelectedDeptCompanyId(c.cr5db_companyid)} style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer', backgroundColor: selectedDeptCompanyId === c.cr5db_companyid ? '#FDF3F3' : 'transparent' }}>
                          <td style={{ padding: '8px', fontWeight: 700 }}>{c.cr5db_companycode}</td>
                          <td style={{ padding: '8px' }}>{c.cr5db_companyname}</td>
                          <td style={{ padding: '8px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                              <button
                                onClick={() => {
                                  setEditingCompany(c);
                                  setNewCompanyCode(c.cr5db_companycode);
                                  setNewCompanyName(c.cr5db_companyname);
                                  setShowCompanyModal(true);
                                }}
                                className="btn-filled-3"
                                style={{ padding: '4px 8px', fontSize: '12px' }}
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteCompany(c.cr5db_companyid)}
                                className="btn-filled-3"
                                style={{ padding: '4px 8px', fontSize: '12px', color: '#a80000', borderColor: '#a80000' }}
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Right: Departments */}
                <div className="large-card" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Departments for Selected Company</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                        <th style={{ padding: '8px' }}>Mã</th>
                        <th style={{ padding: '8px' }}>Tên phòng ban</th>
                        <th style={{ padding: '8px', textAlign: 'right' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentsList.filter(d => d._cr5db_companyid_value === selectedDeptCompanyId).map(d => (
                        <tr key={d.cr5db_departmentid} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '8px', fontWeight: 700 }}>{d.cr5db_departmentcode}</td>
                          <td style={{ padding: '8px' }}>{d.cr5db_departmentname}</td>
                          <td style={{ padding: '8px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                              <button
                                onClick={() => {
                                  setEditingDept(d);
                                  setNewDeptCode(d.cr5db_departmentcode);
                                  setNewDeptName(d.cr5db_departmentname);
                                  setShowDeptModal(true);
                                }}
                                className="btn-filled-3"
                                style={{ padding: '4px 8px', fontSize: '12px' }}
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteDepartment(d.cr5db_departmentid)}
                                className="btn-filled-3"
                                style={{ padding: '4px 8px', fontSize: '12px', color: '#a80000', borderColor: '#a80000' }}
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 7: POSITION CATALOG */}
          {activeTab === 'positions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Position Catalog</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Standardized job title registry</p>
                </div>
                <button onClick={() => setShowCatalogModal(true)} className="btn-primary">+ Add New Title</button>
              </div>

              <div className="card-spec" style={{ padding: '0px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: '14px 20px' }}>Mã chức danh</th>
                      <th style={{ padding: '14px 20px' }}>Tên chức danh</th>
                      <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positionCatalogList.map(pc => (
                      <tr key={pc.cr5db_positioncatalogid} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '14px 20px', fontWeight: 700 }}>{pc.cr5db_code || pc.cr5db_positioncatalogid.substring(0, 5).toUpperCase()}</td>
                        <td style={{ padding: '14px 20px' }}>{pc.cr5db_positioncatalog1}</td>
                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              className="btn-filled-3"
                              style={{ padding: '4px 12px', fontSize: '12px' }}
                              onClick={() => {
                                setEditingCatalog(pc);
                                setNewCatalogCode(pc.cr5db_code || '');
                                setNewCatalogName(pc.cr5db_positioncatalog1 || '');
                                setShowCatalogModal(true);
                              }}
                            >Edit</button>
                            <button
                              className="btn-filled-3"
                              style={{ padding: '4px 12px', fontSize: '12px', color: '#a80000', borderColor: '#a80000' }}
                              onClick={() => handleDeleteCatalog(pc.cr5db_positioncatalogid)}
                            >Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SCREEN 8: HEADCOUNT */}
          {activeTab === 'headcount' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Headcount Quotas</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Establish headcount quota boundaries and reports structure</p>
                </div>
                <button onClick={() => setShowJobPositionModal(true)} className="btn-primary">+ Add Job Position</button>
              </div>

              <div className="card-spec" style={{ padding: '0px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: '14px 20px' }}>Position Name</th>
                      <th style={{ padding: '14px 20px' }}>Phòng ban</th>
                      <th style={{ padding: '14px 20px' }}>Quota</th>
                      <th style={{ padding: '14px 20px' }}>Actual</th>
                      <th style={{ padding: '14px 20px' }}>Trạng thái</th>
                      <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobPositionsList.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '28px' }}>📋</span>
                            <span style={{ fontWeight: 600 }}>Chưa có dữ liệu định biên</span>
                            <span style={{ fontSize: '12px' }}>Nhấn "+ Add Job Position" để tạo mới, hoặc kiểm tra kết nối Dataverse nếu đã có dữ liệu.</span>
                          </div>
                        </td>
                      </tr>
                    ) : jobPositionsList.map(pos => {
                      const dept = departmentsList.find(d => d.cr5db_departmentid === pos._cr5db_department_value);
                      const quota = pos.cr5db_headcountquota || 0;
                      const actual = usersList.filter(u => u._cr5db_jobposition_value === pos.cr5db_jobpositionid && u.cr5db_isactive !== false).length;
                      let statusText = 'At Quota';
                      let statusColor = '#107C41';
                      if (actual > quota) { statusText = 'Over Quota'; statusColor = '#a80000'; }
                      else if (actual < quota) { statusText = 'Under Quota'; statusColor = '#E29E2E'; }
                      return (
                        <tr key={pos.cr5db_jobpositionid} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '14px 20px', fontWeight: 600 }}>{pos.cr5db_positionname}</td>
                          <td style={{ padding: '14px 20px' }}>{dept?.cr5db_departmentname || 'Chung'}</td>
                          <td style={{ padding: '14px 20px' }}>{quota}</td>
                          <td style={{ padding: '14px 20px' }}>{actual}</td>
                          <td style={{ padding: '14px 20px', fontWeight: 700, color: statusColor }}>{statusText}</td>
                          <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button
                                className="btn-filled-3"
                                style={{ padding: '4px 12px', fontSize: '12px' }}
                                onClick={() => {
                                  setEditingJobPosition(pos);
                                  setNewJobPosName(pos.cr5db_positionname || '');
                                  setNewJobPosQuota(pos.cr5db_headcountquota || 1);
                                  setNewJobPosDeptId(pos._cr5db_department_value || '');
                                  setNewJobPosCatalogId(pos._cr5db_positioncatalogtitle_value || '');
                                  setSelectedReportsToPositionId(pos._cr5db_reportstopositionid_value || '');
                                  setShowJobPositionModal(true);
                                }}
                              >Edit</button>
                              <button
                                className="btn-filled-3"
                                style={{ padding: '4px 12px', fontSize: '12px', color: '#a80000', borderColor: '#a80000' }}
                                onClick={() => handleDeleteJobPosition(pos.cr5db_jobpositionid)}
                              >Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SCREEN 9: REQUESTS */}
          {activeTab === 'requests' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Yêu cầu & Phê duyệt</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Quản lý các đề xuất thay đổi và định biên nhân sự</p>
                </div>
              </div>

              {/* Inner Tab Control */}
              <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '12px', marginBottom: '10px' }}>
                <button
                  onClick={() => setRequestsSubTab('change')}
                  style={{
                    padding: '8px 16px', borderRadius: '4px', border: 'none', fontSize: '14px', fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: requestsSubTab === 'change' ? 'var(--color-primary)' : '#FAF9F9',
                    color: requestsSubTab === 'change' ? '#ffffff' : 'var(--color-text-secondary)',
                    transition: 'all 0.2s'
                  }}
                >
                  Yêu cầu thay đổi cấu hình (Universal CR)
                </button>
                <button
                  onClick={() => setRequestsSubTab('headcount')}
                  style={{
                    padding: '8px 16px', borderRadius: '4px', border: 'none', fontSize: '14px', fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: requestsSubTab === 'headcount' ? 'var(--color-primary)' : '#FAF9F9',
                    color: requestsSubTab === 'headcount' ? '#ffffff' : 'var(--color-text-secondary)',
                    transition: 'all 0.2s'
                  }}
                >
                  Đề xuất định biên (Headcount Requests)
                </button>
              </div>

              {requestsSubTab === 'change' ? (
                // --- Universal Change Requests Sub-tab ---
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {(() => {
                    const activeUser = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
                    console.log("=== CHANGE REQUESTS DIAGNOSTICS ===");
                    console.log("Current Logged-in Email (currentUserEmail):", currentUserEmail);
                    console.log("Matched User Record (activeUser):", activeUser);
                    console.log("All Database Users (usersList):", usersList.map(u => ({ name: u.cr5db_fullname, email: u.cr5db_email, id: u.cr5db_userid, role: u.cr5db_systemrole })));
                    console.log("Raw Change Requests List (changeRequestsList):", changeRequestsList);
                    console.log("====================================");
                    const filteredChangeRequests = changeRequestsList.filter((cr: any) => {
                      if (activeRole === 'Admin') return true;
                      if (!activeUser) return false;
                      
                      // 1. Direct assignment check (assigned to or requested by the logged-in user)
                      if (cr._cr5db_requester_value === activeUser.cr5db_userid || cr._cr5db_approver_value === activeUser.cr5db_userid) {
                        return true;
                      }

                      // 2. Role-based matching (removed HRManager / ProjectManager system roles)

                      return false;
                    });

                    if (filteredChangeRequests.length === 0) {
                      return (
                        <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed var(--color-border)', borderRadius: '8px', color: 'var(--color-text-secondary)' }}>
                          Chưa có yêu cầu thay đổi nào liên quan đến bạn.
                        </div>
                      );
                    }

                    return filteredChangeRequests.map((cr: any) => {
                      const reqUser = usersList.find(u => u.cr5db_userid === cr._cr5db_requester_value);
                      const appUser = usersList.find(u => u.cr5db_userid === cr._cr5db_approver_value);
                      const isExpanded = !!expandedRequests[cr.cr5db_changerequestsid];

                      const entityLabel = {
                        1: "Công việc (Tasks)",
                        2: "Chỉ tiêu KPI (KPITargets)",
                        3: "Vị trí công việc (JobPositions)",
                        4: "Định biên (HeadcountRequests)",
                        5: "Dự án (Projects)",
                        6: "Người dùng (Users)"
                      }[cr.cr5db_targetentity as number] || "Khác";

                      const opLabel = {
                        1: "Tạo mới",
                        2: "Cập nhật",
                        3: "Xóa"
                      }[cr.cr5db_operationtype as number] || "Thao tác";

                      return (
                        <div key={cr.cr5db_changerequestsid} className="card-spec" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-text)' }}>{cr.cr5db_requesttitle}</span>
                                <span style={{ fontSize: '11px', padding: '2px 8px', backgroundColor: '#e8f5e9', color: '#1b5e20', border: '1px solid #d1eedc', borderRadius: '4px', fontWeight: 600 }}>{entityLabel}</span>
                                <span style={{ fontSize: '11px', padding: '2px 8px', backgroundColor: '#e3f2fd', color: '#0d47a1', border: '1px solid #bbdefb', borderRadius: '4px', fontWeight: 600 }}>{opLabel}</span>
                              </div>
                              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', display: 'flex', gap: '16px', marginTop: '2px' }}>
                                <span><strong>Người đề xuất:</strong> {reqUser?.cr5db_fullname || "Không rõ"}</span>
                                <span><strong>Người duyệt:</strong> {appUser?.cr5db_fullname || "Không rõ"}</span>
                              </div>
                              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                                <strong>Lý do đề xuất:</strong> <span style={{ fontStyle: 'italic' }}>"{cr.cr5db_reason || 'Không có lý do'}"</span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span className={
                                cr.cr5db_status === 2 ? 'status-approved' :
                                cr.cr5db_status === 3 ? 'status-rejected' :
                                cr.cr5db_status === 4 ? 'status-cancelled' :
                                'status-pending'
                              }>
                                {{ 1: "Chờ duyệt", 2: "Đã duyệt", 3: "Từ chối", 4: "Đã hủy" }[cr.cr5db_status as number] || "Chờ duyệt"}
                              </span>

                              <div style={{ display: 'flex', gap: '6px' }}>
                                {cr.cr5db_status === 1 && activeUser && cr._cr5db_approver_value === activeUser.cr5db_userid && (
                                  <>
                                    <button
                                      onClick={() => handleApproveChangeRequest(cr)}
                                      className="btn-filled-2"
                                      style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '4px' }}
                                    >
                                      Duyệt
                                    </button>
                                    <button
                                      onClick={() => {
                                        const comment = prompt("Nhập lý do từ chối:") || "Yêu cầu bị từ chối.";
                                        handleRejectChangeRequest(cr, comment);
                                      }}
                                      className="btn-filled-3"
                                      style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '4px', color: '#c62828', borderColor: '#ffc1c1' }}
                                    >
                                      Từ chối
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div style={{ borderTop: '1px dashed var(--color-border-light)', paddingTop: '10px', marginTop: '4px' }}>
                            <button
                              onClick={() => setExpandedRequests(prev => ({ ...prev, [cr.cr5db_changerequestsid]: !prev[cr.cr5db_changerequestsid] }))}
                              style={{
                                background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer',
                                fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', padding: 0
                              }}
                            >
                              {isExpanded ? "Thu gọn so sánh ▴" : "Xem so sánh dữ liệu chi tiết ▾"}
                            </button>
                            {isExpanded && renderDiffContainer(cr)}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : (
                // --- Legacy Headcount Requests Sub-tab ---
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-10px' }}>
                    <button onClick={() => setShowHeadcountRequestModal(true)} className="btn-primary">+ Tạo đề xuất mới</button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {headcountRequests.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed var(--color-border)', borderRadius: '8px', color: 'var(--color-text-secondary)' }}>
                        Chưa có đề xuất định biên nào được tạo.
                      </div>
                    ) : (
                      headcountRequests.map(r => (
                        <div key={r.cr5db_headcountrequestid} className="card-spec" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 24px', gap: '12px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 700, fontSize: '15px' }}>{r.cr5db_requestname}</span>
                              <span style={{ fontSize: '11px', padding: '2px 8px', border: '1px solid var(--color-border)', borderRadius: '2px' }}>{r.cr5db_departmentname}</span>
                              <span style={{ fontSize: '11px', padding: '2px 8px', backgroundColor: '#FAF9F9', border: '1px solid var(--color-border)', borderRadius: '2px' }}>{r.cr5db_requesttype}</span>
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Vị trí: {r.cr5db_positiontitle} | Số lượng: {r.cr5db_requestedquantity}</p>
                            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Lý do: {r.cr5db_reason}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span className={
                              r.cr5db_approvalstatus === 'Approved' ? 'status-approved' :
                              r.cr5db_approvalstatus === 'Rejected' ? 'status-rejected' :
                              'status-pending'
                            }>
                              {r.cr5db_approvalstatus}
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {r.cr5db_approvalstatus === 'Pending' && (activeRole === 'Admin' || checkPermission('headcount')) && (
                                <>
                                  <button onClick={() => handleApproveHeadcountRequest(r.cr5db_headcountrequestid, 'Approved')} className="btn-filled-2" style={{ padding: '6px 12px', fontSize: '12px' }}>Duyệt</button>
                                  <button onClick={() => handleApproveHeadcountRequest(r.cr5db_headcountrequestid, 'Rejected')} className="btn-filled-3" style={{ padding: '6px 12px', fontSize: '12px' }}>Từ chối</button>
                                </>
                              )}
                              
                              {activeRole === 'Admin' && (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingHeadcountRequest(r);
                                      setNewRequestName(r.cr5db_requestname);
                                      setNewRequestType(r.cr5db_requesttype);
                                      setNewReqDeptId(r._cr5db_department_value || '');
                                      setNewReqCatalogId(r._cr5db_positioncatalog_value || '');
                                      setNewReqQty(r.cr5db_requestedquantity);
                                      setNewReqReason(r.cr5db_reason);
                                      setNewReqStatus(r.cr5db_approvalstatus);
                                      setNewReqReportsToId(r._cr5db_approverposition_value || '');
                                      setShowHeadcountRequestModal(true);
                                    }}
                                    className="btn-filled-3"
                                    style={{ padding: '6px 12px', fontSize: '12px', color: '#742774', borderColor: '#742774' }}
                                  >
                                    Sửa
                                  </button>
                                  <button
                                    onClick={() => handleDeleteHeadcountRequest(r.cr5db_headcountrequestid)}
                                    className="btn-filled-3"
                                    style={{ padding: '6px 12px', fontSize: '12px', color: '#a80000', borderColor: '#a80000' }}
                                  >
                                    Xóa
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SCREEN 10: RESOURCES */}
          {activeTab === 'resources' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Resource Planning</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Allocation metrics and team planning</p>
                </div>
                {activeResourcesSubTab === 'allocations' && (activeRole === 'Admin' || checkPermission('resources')) && (
                  <button
                    onClick={() => {
                      setAllocationUser(usersList[0]?.cr5db_userid || '');
                      setAllocationProject(projects[0]?.cr5db_projectid || '');
                      setAllocationPercentage(100);
                      setAllocationName('');
                      setShowAllocationModal(true);
                    }}
                    className="btn-primary"
                  >
                    + Phân bổ nhân sự
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', gap: '16px', paddingBottom: '8px' }}>
                <button onClick={() => setActiveResourcesSubTab('allocations')} style={{ background: 'none', border: 'none', color: activeResourcesSubTab === 'allocations' ? 'var(--color-text)' : 'var(--color-text-secondary)', fontWeight: activeResourcesSubTab === 'allocations' ? 700 : 500, cursor: 'pointer', borderBottom: activeResourcesSubTab === 'allocations' ? '2px solid var(--color-text)' : 'none', padding: '4px 8px' }}>
                  Project Allocations
                </button>
                <button onClick={() => setActiveResourcesSubTab('projects')} style={{ background: 'none', border: 'none', color: activeResourcesSubTab === 'projects' ? 'var(--color-text)' : 'var(--color-text-secondary)', fontWeight: activeResourcesSubTab === 'projects' ? 700 : 500, cursor: 'pointer', borderBottom: activeResourcesSubTab === 'projects' ? '2px solid var(--color-text)' : 'none', padding: '4px 8px' }}>
                  Projects List
                </button>
              </div>

              {activeResourcesSubTab === 'allocations' ? (
                (() => {
                  if (resourceAllocationsList.length === 0) {
                    return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>No resource allocations logged in database.</div>;
                  }

                  // 1. Group allocations by project team name
                  const groups: { [key: string]: typeof resourceAllocationsList } = {};
                  resourceAllocationsList.forEach(a => {
                    const groupName = a.cr5db_projectteamidname || 'Dự án khác / Không thuộc dự án';
                    if (!groups[groupName]) {
                      groups[groupName] = [];
                    }
                    groups[groupName].push(a);
                  });

                  // 2. Calculate user overall totals
                  const userTotals: { [key: string]: number } = {};
                  resourceAllocationsList.forEach(a => {
                    const userKey = a.cr5db_useridname || 'Thành viên chưa rõ';
                    const percentage = Number(a.cr5db_allocationpercentage) || 0;
                    userTotals[userKey] = (userTotals[userKey] || 0) + percentage;
                  });

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {Object.keys(groups).map(projectTeam => {
                        const isCollapsed = collapsedProjects[projectTeam];
                        const teamAllocations = groups[projectTeam];
                        
                        return (
                          <div 
                            key={projectTeam} 
                            className="card-spec" 
                            style={{ 
                              padding: '24px', 
                              display: 'flex',
                              flexDirection: 'column',
                              gap: isCollapsed ? '0px' : '16px',
                              overflow: 'hidden'
                            }}
                          >
                            {/* Card Header */}
                            <div 
                              onClick={() => {
                                setCollapsedProjects(prev => ({
                                  ...prev,
                                  [projectTeam]: !prev[projectTeam]
                                }));
                              }}
                              style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                cursor: 'pointer',
                                userSelect: 'none'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ 
                                  width: '32px', 
                                  height: '32px', 
                                  borderRadius: '50%', 
                                  backgroundColor: '#FAF9F9', 
                                  border: '1px solid var(--color-border)', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center' 
                                }}>
                                  <ResourceIcon />
                                </span>
                                <div>
                                  <h3 style={{ fontSize: '15px', fontWeight: 700 }}>{projectTeam}</h3>
                                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                                    {teamAllocations.length} nhân sự phân bổ
                                  </p>
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                                  {isCollapsed ? 'Mở rộng' : 'Thu gọn'}
                                </span>
                                <svg 
                                  width="16" 
                                  height="16" 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  strokeWidth="2.5" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                  style={{ 
                                    transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', 
                                    transition: 'transform 0.2s' 
                                  }}
                                >
                                  <polyline points="18 15 12 9 6 15" />
                                </svg>
                              </div>
                            </div>

                            {/* Card Content */}
                            {!isCollapsed && (
                              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                                  <thead>
                                    <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                                      <th style={{ padding: '10px 12px', fontWeight: 600 }}>Tên Allocation</th>
                                      <th style={{ padding: '10px 12px', fontWeight: 600 }}>Nhân viên</th>
                                      <th style={{ padding: '10px 12px', fontWeight: 600 }}>% Phân bổ</th>
                                      <th style={{ padding: '10px 12px', fontWeight: 600 }}>Tình trạng sử dụng</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {teamAllocations.map(a => {
                                      const userKey = a.cr5db_useridname || 'Thành viên chưa rõ';
                                      const totalVal = userTotals[userKey] || 0;
                                      const isOverAllocated = totalVal > 100;
                                      
                                      return (
                                        <tr key={a.cr5db_resourceallocationid} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                                          <td style={{ padding: '12px', fontWeight: 600 }}>{a.cr5db_resourceallocation1}</td>
                                          <td style={{ padding: '12px' }}>{userKey}</td>
                                          <td style={{ padding: '12px', fontWeight: 600 }}>{a.cr5db_allocationpercentage}%</td>
                                          <td style={{ padding: '12px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '160px' }}>
                                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                                                <span style={{ color: 'var(--color-text-secondary)' }}>Tổng sử dụng:</span>
                                                <span style={{ color: isOverAllocated ? '#b6393a' : '#107c41', fontWeight: 'bold' }}>
                                                  {totalVal}%
                                                </span>
                                              </div>
                                              <div style={{ height: '6px', width: '100%', backgroundColor: '#f3f2f1', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div 
                                                  style={{ 
                                                    height: '100%', 
                                                    width: `${Math.min(totalVal, 100)}%`, 
                                                    backgroundColor: isOverAllocated ? '#b6393a' : '#107c41', 
                                                    borderRadius: '3px' 
                                                  }} 
                                                />
                                              </div>
                                              {isOverAllocated && (
                                                <span style={{ fontSize: '10px', color: '#b6393a', fontWeight: 500 }}>
                                                  {"⚠️ Quá tải định biên (>100%)"}
                                                </span>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              ) : (
                (() => {
                  const canManageProject = activeRole === 'Admin' || checkPermission('resources');
                  const canDeleteProject = activeRole === 'Admin';
                  
                  // Get active project team allocations (matched by project name or team name containing project name)
                  const getProjectAllocations = (projName: string) => {
                    return resourceAllocationsList.filter(a => {
                      const teamName = (a.cr5db_projectteamidname || '').toLowerCase();
                      const pName = projName.toLowerCase();
                      return teamName.includes(pName) || pName.includes(teamName);
                    });
                  };

                  const getProjectStatusValue = (projId: string): number => {
                    const phasesForProj = projectPhases.filter(ph => ph._cr5db_projectid_value === projId);
                    if (phasesForProj.length === 0) return 122650000; // Not Started
                    const allCompleted = phasesForProj.every(ph => ph.new_status === 122650002 || ph.statecode === 1);
                    if (allCompleted) return 122650002; // Completed
                    const anyInProgressOrCompleted = phasesForProj.some(ph => ph.new_status === 122650001 || ph.new_status === 122650002 || ph.statecode === 1);
                    if (anyInProgressOrCompleted) return 122650001; // In Progress
                    return 122650000; // Not Started
                  };

                  // Map OData status codes to labels and styles
                  // In handleSaveProject: statusVal = Completed ? 122650002 : In Progress ? 122650001 : 122650000
                  const getProjectStatusLabel = (statusCode: number | undefined) => {
                    if (statusCode === 122650002) return 'Completed';
                    if (statusCode === 122650001) return 'In Progress';
                    return 'Not Started';
                  };

                  const getProjectStatusStyle = (statusLabel: string) => {
                    switch (statusLabel) {
                      case 'Completed':
                        return { backgroundColor: '#dff6dd', color: '#107c41' };
                      case 'In Progress':
                        return { backgroundColor: '#d9effc', color: '#005a9e' };
                      default:
                        return { backgroundColor: '#f3f2f1', color: '#323130' };
                    }
                  };

                  // Let's find latest data for the active project details if one is selected
                  const currentActiveProject = activeProjectDetails 
                    ? projects.find(p => p.cr5db_projectid === activeProjectDetails.cr5db_projectid) 
                    : null;

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* Top action bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Danh sách dự án ({projects.length})</h3>
                          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Xem thông tin dự án, các giai đoạn (Phases) và quản lý rủi ro (Risks)</p>
                        </div>
                        {canManageProject && (
                          <button 
                            onClick={() => {
                              setEditingProject(null);
                              setProjectName('');
                              setProjectDesc('');
                              setProjectStartDate('');
                              setProjectEndDate('');
                              setProjectStatus('Not Started');
                              setShowProjectModal(true);
                            }}
                            className="btn-primary"
                          >
                            + Thêm dự án
                          </button>
                        )}
                      </div>

                      {/* Main split dashboard view */}
                      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        
                        {/* LEFT HAND SIDE: PROJECTS LIST */}
                        <div style={{ flex: currentActiveProject ? '1 1 50%' : '1 1 100%', minWidth: '350px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {projects.length === 0 ? (
                            <div className="card-spec" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                              Không có dự án nào trong hệ thống.
                            </div>
                          ) : (
                            projects.map(p => {
                              const isSelected = currentActiveProject?.cr5db_projectid === p.cr5db_projectid;
                              const statusLabel = getProjectStatusLabel(getProjectStatusValue(p.cr5db_projectid));
                              const statusStyle = getProjectStatusStyle(statusLabel);
                              
                              // Count phases
                              const phasesForProj = projectPhases.filter(ph => ph._cr5db_projectid_value === p.cr5db_projectid);
                              const completedPhases = phasesForProj.filter(ph => ph.new_status === 122650002 || ph.statecode === 1).length;
                              const progressPct = phasesForProj.length > 0 ? Math.round((completedPhases / phasesForProj.length) * 100) : 0;

                              return (
                                <div 
                                  key={p.cr5db_projectid} 
                                  className="card-spec" 
                                  style={{ 
                                    padding: '20px', 
                                    borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                                    borderWidth: isSelected ? '2px' : '1px',
                                    boxShadow: isSelected ? '0 4px 12px rgba(182, 57, 58, 0.08)' : 'none',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => setActiveProjectDetails(p)}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)' }}>
                                        {p.cr5db_projectname}
                                      </h4>
                                      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '36px', lineHeight: '1.4' }}>
                                        {p.cr5db_description || 'Không có mô tả chi tiết.'}
                                      </p>
                                    </div>
                                    <span style={{ 
                                      padding: '4px 8px', 
                                      borderRadius: '4px', 
                                      fontSize: '11px', 
                                      fontWeight: 600, 
                                      ...statusStyle
                                    }}>
                                      {statusLabel}
                                    </span>
                                  </div>

                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--color-text-secondary)', borderTop: '1px solid var(--color-border-light)', paddingTop: '12px', marginTop: '12px' }}>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                      <span>⏱️ {p.cr5db_startdate ? new Date(p.cr5db_startdate).toLocaleDateString('vi-VN') : 'N/A'}</span>
                                      <span>🏁 {p.cr5db_enddate ? new Date(p.cr5db_enddate).toLocaleDateString('vi-VN') : 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ fontWeight: 600 }}>Phases: {completedPhases}/{phasesForProj.length} ({progressPct}%)</span>
                                      <div style={{ width: '60px', height: '6px', backgroundColor: '#f3f2f1', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ width: `${progressPct}%`, height: '100%', backgroundColor: progressPct === 100 ? '#107c41' : 'var(--color-primary)', borderRadius: '3px' }} />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Item footer action buttons */}
                                  <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--color-border-light)', paddingTop: '10px', marginTop: '10px' }}>
                                    <button 
                                      onClick={() => setActiveProjectDetails(p)} 
                                      className="btn-filled-3" 
                                      style={{ padding: '4px 8px', fontSize: '12px' }}
                                    >
                                      Chi tiết / Manage ➔
                                    </button>
                                    {canManageProject && (
                                      <button 
                                        onClick={() => {
                                          setEditingProject(p);
                                          setProjectName(p.cr5db_projectname || '');
                                          setProjectDesc(p.cr5db_description || '');
                                          setProjectStartDate(p.cr5db_startdate ? p.cr5db_startdate.substring(0, 10) : '');
                                          setProjectEndDate(p.cr5db_enddate ? p.cr5db_enddate.substring(0, 10) : '');
                                          
                                          const computedStatusVal = getProjectStatusValue(p.cr5db_projectid);
                                          const statusStr = computedStatusVal === 122650002 ? 'Completed' : computedStatusVal === 122650001 ? 'In Progress' : 'Not Started';
                                          setProjectStatus(statusStr);
                                          setShowProjectModal(true);
                                        }} 
                                        className="btn-filled-3" 
                                        style={{ padding: '4px 8px', fontSize: '12px' }}
                                      >
                                        Sửa
                                      </button>
                                    )}
                                    {canDeleteProject && (
                                      <button 
                                        onClick={() => handleDeleteProject(p.cr5db_projectid)} 
                                        className="btn-filled-3" 
                                        style={{ padding: '4px 8px', fontSize: '12px', color: '#a80000', borderColor: '#fde7e9' }}
                                      >
                                        Xóa
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* RIGHT HAND SIDE: SELECTED PROJECT DETAILS PANEL */}
                        {currentActiveProject && (
                          <div className="card-spec" style={{ flex: '1 1 45%', minWidth: '350px', padding: '24px', backgroundColor: '#fcfcfc', border: '1px solid var(--color-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                              <div>
                                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-primary)', fontWeight: 700 }}>Project Details</span>
                                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{currentActiveProject.cr5db_projectname}</h3>
                              </div>
                              <button 
                                onClick={() => setActiveProjectDetails(null)} 
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                                title="Close details"
                              >
                                ✕
                              </button>
                            </div>

                            {/* Project Meta Info */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', marginBottom: '20px' }}>
                              <div><strong>Mô tả:</strong> <span style={{ color: 'var(--color-text-secondary)' }}>{currentActiveProject.cr5db_description || 'Không có mô tả'}</span></div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
                                <div><strong>Ngày bắt đầu:</strong> <span style={{ color: 'var(--color-text-secondary)' }}>{currentActiveProject.cr5db_startdate ? new Date(currentActiveProject.cr5db_startdate).toLocaleDateString('vi-VN') : 'N/A'}</span></div>
                                <div><strong>Ngày kết thúc:</strong> <span style={{ color: 'var(--color-text-secondary)' }}>{currentActiveProject.cr5db_enddate ? new Date(currentActiveProject.cr5db_enddate).toLocaleDateString('vi-VN') : 'N/A'}</span></div>
                              </div>
                              <div>
                                <strong>Trạng thái: </strong>
                                <span style={{ 
                                  padding: '2px 6px', 
                                  borderRadius: '4px', 
                                  fontSize: '11px', 
                                  fontWeight: 600, 
                                  marginLeft: '4px',
                                  ...getProjectStatusStyle(getProjectStatusLabel(getProjectStatusValue(currentActiveProject.cr5db_projectid)))
                                }}>
                                  {getProjectStatusLabel(getProjectStatusValue(currentActiveProject.cr5db_projectid))}
                                </span>
                              </div>
                            </div>

                            {/* Nested Section: Project PHASES */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--color-border-light)', paddingTop: '16px', marginBottom: '20px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ fontSize: '13px', fontWeight: 700 }}>Giai đoạn dự án (Phases)</h4>
                                {canManageProject && (
                                  <button 
                                    onClick={() => {
                                      setNewPhaseName('');
                                      setNewPhaseStatus('Not Started');
                                      setNewPhaseStartDate('');
                                      setNewPhaseEndDate('');
                                      setShowPhaseModal(true);
                                    }}
                                    className="btn-filled-3" 
                                    style={{ padding: '2px 8px', fontSize: '11px', color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}
                                  >
                                    + Add Phase
                                  </button>
                                )}
                              </div>
                              
                              {(() => {
                                const phases = projectPhases.filter(ph => ph._cr5db_projectid_value === currentActiveProject.cr5db_projectid);
                                if (phases.length === 0) {
                                  return <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontStyle: 'italic', padding: '6px' }}>Chưa ghi nhận giai đoạn nào.</div>;
                                }
                                return (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {phases.map(ph => {
                                      const phStatus = ph.new_status === 122650002 ? 'Completed' : ph.new_status === 122650001 ? 'In Progress' : 'Not Started';
                                      const phStyle = getProjectStatusStyle(phStatus);
                                      return (
                                        <div key={ph.cr5db_projectphaseid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', border: '1px solid var(--color-border-light)', borderRadius: '6px', backgroundColor: '#ffffff' }}>
                                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 600 }}>{ph.cr5db_phasename}</span>
                                            {(ph.cr5db_startdate || ph.cr5db_enddate) && (
                                              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', gap: '10px' }}>
                                                {ph.cr5db_startdate && <span>📅 Bắt đầu: {new Date(ph.cr5db_startdate).toLocaleDateString('vi-VN')}</span>}
                                                {ph.cr5db_enddate && <span>🏁 Kết thúc: {new Date(ph.cr5db_enddate).toLocaleDateString('vi-VN')}</span>}
                                              </span>
                                            )}
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, ...phStyle }}>{phStatus}</span>
                                            {canManageProject && (
                                              <>
                                                <button
                                                  onClick={() => {
                                                    setEditingPhase(ph);
                                                    setNewPhaseName(ph.cr5db_phasename || '');
                                                    setNewPhaseStatus(phStatus);
                                                    setNewPhaseStartDate(ph.cr5db_startdate ? ph.cr5db_startdate.substring(0, 10) : '');
                                                    setNewPhaseEndDate(ph.cr5db_enddate ? ph.cr5db_enddate.substring(0, 10) : '');
                                                    setShowPhaseModal(true);
                                                  }}
                                                  className="btn-filled-3"
                                                  style={{ padding: '2px 6px', fontSize: '10px', minWidth: 'auto' }}
                                                >
                                                  Sửa
                                                </button>
                                                <button
                                                  onClick={() => handleDeletePhase(ph.cr5db_projectphaseid)}
                                                  className="btn-filled-3"
                                                  style={{ padding: '2px 6px', fontSize: '10px', minWidth: 'auto', color: '#a80000', borderColor: '#e5e5e5' }}
                                                >
                                                  Xóa
                                                </button>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Nested Section: Project RISKS */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--color-border-light)', paddingTop: '16px', marginBottom: '20px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ fontSize: '13px', fontWeight: 700 }}>Rủi ro & Giảm thiểu (Risks)</h4>
                                {canManageProject && (
                                  <button 
                                    onClick={() => {
                                      setNewRiskName('');
                                      setNewRiskImpact('Medium');
                                      setNewRiskProbability('Medium');
                                      setNewRiskMitigation('');
                                      setShowRiskModal(true);
                                    }}
                                    className="btn-filled-3" 
                                    style={{ padding: '2px 8px', fontSize: '11px', color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}
                                  >
                                    + Log Risk
                                  </button>
                                )}
                              </div>

                              {(() => {
                                const risks = projectRisks.filter(risk => 
                                  risk._new_project_value === currentActiveProject.cr5db_projectid ||
                                  risk._new_project_value?.toLowerCase() === currentActiveProject.cr5db_projectid?.toLowerCase()
                                );
                                if (risks.length === 0) {
                                  return <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontStyle: 'italic', padding: '6px' }}>Chưa ghi nhận rủi ro nào.</div>;
                                }
                                return (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {risks.map(r => {
                                      // Map numeric OptionSet values to readable labels (support both string and number keys)
                                      const impactLevelMap: Record<string | number, string> = { 
                                        122650000: 'High', 
                                        122650001: 'Medium', 
                                        122650002: 'Low' 
                                      };
                                      const lookupImpact = (r.cr5db_impactlevel !== undefined && r.cr5db_impactlevel !== null) ? impactLevelMap[r.cr5db_impactlevel] : undefined;
                                      const rawImpact = r.cr5db_impactlevelname || lookupImpact || r.cr5db_impactlevel || r.cr5db_impact || 'Medium';
                                      const impact = typeof rawImpact === 'string' ? rawImpact : String(rawImpact);
                                      
                                      const probRaw = r.cr5db_probability || r.cr5db_probabilitypercentage || 'Medium';
                                      const prob = typeof probRaw === 'number' ? `${probRaw}%` : probRaw;
                                      const mitigation = r.cr5db_mitigationplan || 'Chưa lập phương án giảm thiểu.';
                                      
                                      const getBadgeColor = (val: string) => {
                                        const v = val.toLowerCase();
                                        if (v === 'high' || v === '122650000' || v === '80' || v === '80%') {
                                          return { backgroundColor: '#fde7e9', color: '#a80000' };
                                        }
                                        if (v === 'medium' || v === '122650001' || v === '50' || v === '50%') {
                                          return { backgroundColor: '#fffdf6', color: '#e29e2e' };
                                        }
                                        return { backgroundColor: '#dff6dd', color: '#107c41' };
                                      };

                                      return (
                                        <div key={r.cr5db_projectriskid} style={{ padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '6px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 700 }}>{r.cr5db_riskname || r.cr5db_projectrisk1}</span>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                              <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 600, ...getBadgeColor(impact.toString()) }}>Impact: {impact}</span>
                                              <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 600, ...getBadgeColor(prob.toString()) }}>Prob: {prob}</span>
                                            </div>
                                          </div>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '8px', marginTop: '4px' }}>
                                            <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: 0, flex: 1 }}>
                                              <strong>Phương án giảm thiểu:</strong> {mitigation}
                                            </p>
                                            {canManageProject && (
                                              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                                <button
                                                  onClick={() => {
                                                    setEditingRisk(r);
                                                    setNewRiskName(r.cr5db_riskname || r.cr5db_projectrisk1 || '');
                                                    setNewRiskImpact(
                                                      impact === 'High' ? 'High' : 
                                                      impact === 'Medium' ? 'Medium' : 'Low'
                                                    );
                                                    setNewRiskProbability(
                                                      probRaw === 80 || probRaw === '80' || probRaw === 'High' ? 'High' :
                                                      probRaw === 20 || probRaw === '20' || probRaw === 'Low' ? 'Low' : 'Medium'
                                                    );
                                                    setNewRiskMitigation(r.cr5db_mitigationplan || '');
                                                    setShowRiskModal(true);
                                                  }}
                                                  className="btn-filled-3"
                                                  style={{ padding: '2px 6px', fontSize: '10px', minWidth: 'auto' }}
                                                >
                                                  Sửa
                                                </button>
                                                <button
                                                  onClick={() => handleDeleteRisk(r.cr5db_projectriskid)}
                                                  className="btn-filled-3"
                                                  style={{ padding: '2px 6px', fontSize: '10px', minWidth: 'auto', color: '#a80000', borderColor: '#e5e5e5' }}
                                                >
                                                  Xóa
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Nested Section: Project TEAM ALLOCATIONS */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--color-border-light)', paddingTop: '16px' }}>
                              <h4 style={{ fontSize: '13px', fontWeight: 700 }}>Nhân sự phân bổ (Team Allocations)</h4>
                              {(() => {
                                const teamAllocations = getProjectAllocations(currentActiveProject.cr5db_projectname);
                                if (teamAllocations.length === 0) {
                                  return <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontStyle: 'italic', padding: '6px' }}>Chưa phân bổ nhân sự cho dự án này.</div>;
                                }
                                return (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {teamAllocations.map(a => (
                                      <div key={a.cr5db_resourceallocationid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#ffffff', border: '1px solid var(--color-border-light)', borderRadius: '6px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                          <span style={{ fontSize: '12px', fontWeight: 700 }}>{a.cr5db_useridname || 'Thành viên chưa rõ'}</span>
                                          <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>{a.cr5db_resourceallocation1}</span>
                                        </div>
                                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-primary)' }}>{a.cr5db_allocationpercentage}%</span>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })()}
                            </div>

                          </div>
                        )}
                        
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* SCREEN 11: DIRECTORY */}
          {activeTab === 'directory' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Employee Directory & Management</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Tìm kiếm thành viên hoặc quản lý danh sách nhân sự của tổ chức</p>
                </div>
                {(activeRole === 'Admin' || checkPermission('directory')) && (
                  <button 
                    onClick={() => {
                      setEditingEmployee(null);
                      setEmployeeFullName('');
                      setEmployeeEmail('');
                      setEmployeeRole('Employee');
                      setEmployeeJobPositionId('');
                      setEmployeeIsActive(true);
                      setShowEmployeeModal(true);
                    }} 
                    className="btn-primary"
                  >
                    + Add Employee
                  </button>
                )}
              </div>

              {(activeRole === 'Admin' || checkPermission('directory')) && (
                <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', gap: '16px', paddingBottom: '8px' }}>
                  <button 
                    onClick={() => setActiveDirectorySubTab('view')} 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: activeDirectorySubTab === 'view' ? 'var(--color-text)' : 'var(--color-text-secondary)', 
                      fontWeight: activeDirectorySubTab === 'view' ? 700 : 500, 
                      cursor: 'pointer', 
                      borderBottom: activeDirectorySubTab === 'view' ? '2px solid var(--color-text)' : 'none', 
                      padding: '4px 8px' 
                    }}
                  >
                    Thành viên tổ chức
                  </button>
                  <button 
                    onClick={() => setActiveDirectorySubTab('manage')} 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: activeDirectorySubTab === 'manage' ? 'var(--color-text)' : 'var(--color-text-secondary)', 
                      fontWeight: activeDirectorySubTab === 'manage' ? 700 : 500, 
                      cursor: 'pointer', 
                      borderBottom: activeDirectorySubTab === 'manage' ? '2px solid var(--color-text)' : 'none', 
                      padding: '4px 8px' 
                    }}
                  >
                    Quản lý nhân viên
                  </button>
                  <button 
                    onClick={() => setActiveDirectorySubTab('history')} 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: activeDirectorySubTab === 'history' ? 'var(--color-text)' : 'var(--color-text-secondary)', 
                      fontWeight: activeDirectorySubTab === 'history' ? 700 : 500, 
                      cursor: 'pointer', 
                      borderBottom: activeDirectorySubTab === 'history' ? '2px solid var(--color-text)' : 'none', 
                      padding: '4px 8px' 
                    }}
                  >
                    Lịch sử phân quyền
                  </button>
                  {activeRole === 'Admin' && (
                    <button 
                      onClick={() => setActiveDirectorySubTab('groups')} 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: activeDirectorySubTab === 'groups' ? 'var(--color-text)' : 'var(--color-text-secondary)', 
                        fontWeight: activeDirectorySubTab === 'groups' ? 700 : 500, 
                        cursor: 'pointer', 
                        borderBottom: activeDirectorySubTab === 'groups' ? '2px solid var(--color-text)' : 'none', 
                        padding: '4px 8px' 
                      }}
                    >
                      Nhóm quyền (Groups)
                    </button>
                  )}
                </div>
              )}

              {activeDirectorySubTab === 'view' || !(activeRole === 'Admin' || checkPermission('directory')) ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {usersList.map(u => (
                    <div key={u.cr5db_userid} onClick={() => setSelectedDirectoryUser(u)} className="card-spec" style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px 20px', cursor: 'pointer' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: u.cr5db_isactive !== false ? 'var(--color-primary)' : 'var(--color-text-secondary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700 }}>
                        {u.cr5db_fullname.substring(0, 2).toUpperCase()}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {u.cr5db_fullname}
                          {u.cr5db_isactive === false && (
                            <span style={{ fontSize: '10px', backgroundColor: '#e1dfdd', color: '#323130', padding: '2px 6px', borderRadius: '4px', fontWeight: 500 }}>Tạm khóa</span>
                          )}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{u.cr5db_email || 'No Email'}</span>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{u.cr5db_jobpositionname || 'Chưa phân công'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : activeDirectorySubTab === 'manage' ? (
                <div className="card-spec" style={{ padding: '0px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                        <th style={{ padding: '14px 20px' }}>Nhân viên</th>
                        <th style={{ padding: '14px 20px' }}>Email</th>
                        <th style={{ padding: '14px 20px' }}>Job Position</th>
                        <th style={{ padding: '14px 20px' }}>Vai trò hệ thống</th>
                        <th style={{ padding: '14px 20px' }}>Trạng thái</th>
                        <th style={{ padding: '14px 20px', textAlign: 'right' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map(u => (
                        <tr key={u.cr5db_userid} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: u.cr5db_isactive === false ? '#fcfcfc' : 'transparent' }}>
                          <td style={{ padding: '14px 20px', fontWeight: 600 }}>{u.cr5db_fullname}</td>
                          <td style={{ padding: '14px 20px' }}>{u.cr5db_email || 'No Email'}</td>
                          <td style={{ padding: '14px 20px' }}>{u.cr5db_jobpositionname || 'Chưa phân công'}</td>
                          <td style={{ padding: '14px 20px' }}>
                            {(() => {
                              const roleStr = u.cr5db_systemrole || '';
                              if (roleStr === 'Admin') {
                                return (
                                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, backgroundColor: '#fde7e9', color: '#a80000' }}>
                                    Super Admin
                                  </span>
                                );
                              }
                              if (roleStr.startsWith('Employee:')) {
                                const groupIds = roleStr.substring(9).split(',');
                                const groupNames = groupIds.map(gid => permissionGroups.find(g => g.id === gid)?.name || gid);
                                return (
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                    {groupNames.map((name, idx) => (
                                      <span key={idx} style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, backgroundColor: '#dff6dd', color: '#107c41' }}>
                                        {name}
                                      </span>
                                    ))}
                                  </div>
                                );
                              }
                              return (
                                <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, backgroundColor: '#f3f2f1', color: '#323130' }}>
                                  Employee
                                </span>
                              );
                            })()}
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 500, color: u.cr5db_isactive !== false ? '#107c41' : '#a80000' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: u.cr5db_isactive !== false ? '#107c41' : '#a80000' }}></span>
                              {u.cr5db_isactive !== false ? 'Đang hoạt động' : 'Tạm khóa'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                              <button 
                                onClick={() => {
                                  setEditingEmployee(u);
                                  setEmployeeFullName(u.cr5db_fullname);
                                  setEmployeeEmail(u.cr5db_email || '');
                                  const rawRole = u.cr5db_systemrole || 'Employee';
                                  if (rawRole === 'Admin') {
                                    setEmployeeRole('Admin');
                                    setEmployeeSelectedGroups([]);
                                  } else if (rawRole.startsWith('Employee:')) {
                                    setEmployeeRole('Employee');
                                    setEmployeeSelectedGroups(rawRole.substring(9).split(','));
                                  } else {
                                    setEmployeeRole('Employee');
                                    setEmployeeSelectedGroups([]);
                                  }
                                  setEmployeeJobPositionId(u._cr5db_jobposition_value || '');
                                  setEmployeeIsActive(u.cr5db_isactive !== false);
                                  setShowEmployeeModal(true);
                                }} 
                                className="btn-filled-3" 
                                style={{ padding: '4px 8px' }}
                              >
                                Edit
                              </button>
                              {u.cr5db_systemrole && (u.cr5db_systemrole !== 'Admin' || activeRole === 'Admin') && (
                                <button 
                                  onClick={() => handleRevokeRole(u.cr5db_userid)} 
                                  className="btn-filled-3" 
                                  style={{ padding: '4px 8px', color: '#742774', borderColor: '#742774' }}
                                  title="Thu hồi vai trò hệ thống gán tay"
                                >
                                  Revoke
                                </button>
                              )}
                              <button 
                                onClick={() => handleToggleEmployeeStatus(u)} 
                                className="btn-filled-3" 
                                style={{ padding: '4px 8px', color: u.cr5db_isactive !== false ? '#a80000' : '#107c41' }}
                              >
                                {u.cr5db_isactive !== false ? 'Khóa' : 'Mở'}
                              </button>
                              {activeRole === 'Admin' && (
                                <button 
                                  onClick={() => handleDeleteEmployee(u)} 
                                  className="btn-filled-3" 
                                  style={{ padding: '4px 8px', color: '#a80000', borderColor: '#fde7e9' }}
                                >
                                  Xóa
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : activeDirectorySubTab === 'groups' ? (
                // --- Permission Groups Sub-tab ---
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>Cấu hình nhóm quyền người dùng</div>
                    <button 
                      onClick={() => {
                        setEditingGroup(null);
                        setNewGroupName('');
                        setNewGroupTabs([]);
                        setShowGroupModal(true);
                      }}
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: '13px' }}
                    >
                      + Thêm nhóm quyền
                    </button>
                  </div>

                  {/* Config Default Group for New Users */}
                  <div className="card-spec" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>Nhóm quyền mặc định cho thành viên mới (Auto-Registration Default):</div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
                      Khi tài khoản mới đăng nhập lần đầu, họ sẽ tự động được liên kết với các nhóm quyền mặc định được chọn dưới đây (vẫn có thể vào ứng dụng với các quyền cơ bản ngay cả khi không chọn nhóm mặc định nào).
                    </p>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {permissionGroups.map(group => {
                        const defaultIds = defaultGroups ? defaultGroups.split(',') : [];
                        const isChecked = defaultIds.includes(group.id);
                        return (
                          <label key={group.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                let newIds = [...defaultIds];
                                if (e.target.checked) {
                                  newIds.push(group.id);
                                } else {
                                  newIds = newIds.filter(id => id !== group.id);
                                }
                                handleSaveDefaultGroups(newIds);
                              }}
                            />
                            <span>{group.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Groups List Table */}
                  <div className="card-spec" style={{ padding: '0px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                          <th style={{ padding: '14px 20px', width: '25%' }}>Tên nhóm</th>
                          <th style={{ padding: '14px 20px', width: '55%' }}>Quyền truy cập (Tabs)</th>
                          <th style={{ padding: '14px 20px', textAlign: 'right', width: '20%' }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {permissionGroups.length === 0 ? (
                          <tr>
                            <td colSpan={3} style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                              Chưa cấu hình nhóm quyền nào. Vui lòng thêm mới.
                            </td>
                          </tr>
                        ) : (
                          permissionGroups.map(group => (
                            <tr key={group.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                              <td style={{ padding: '14px 20px', fontWeight: 600 }}>{group.name}</td>
                              <td style={{ padding: '14px 20px' }}>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                  {group.tabs.map(tabId => {
                                    const match = FEATURE_TABS.find(t => t.id === tabId);
                                    return (
                                      <span key={tabId} style={{ padding: '2px 8px', backgroundColor: '#f3f2f1', borderRadius: '4px', fontSize: '11px', fontWeight: 500 }}>
                                        {match ? (language === 'vi' ? match.labelVi : match.labelEn) : tabId}
                                      </span>
                                    );
                                  })}
                                </div>
                              </td>
                              <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                  <button 
                                    onClick={() => {
                                      setEditingGroup(group);
                                      setNewGroupName(group.name);
                                      setNewGroupTabs(group.tabs);
                                      setShowGroupModal(true);
                                    }}
                                    className="btn-filled-3"
                                    style={{ padding: '4px 8px' }}
                                  >
                                    Sửa
                                  </button>
                                  <button 
                                    onClick={() => handleDeletePermissionGroup(group)}
                                    className="btn-filled-3"
                                    style={{ padding: '4px 8px', color: '#a80000', borderColor: '#fde7e9' }}
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="card-spec" style={{ padding: '0px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                        <th style={{ padding: '14px 20px' }}>Nhật ký thay đổi</th>
                        <th style={{ padding: '14px 20px' }}>Hành động</th>
                        <th style={{ padding: '14px 20px' }}>Vai trò cũ</th>
                        <th style={{ padding: '14px 20px' }}>Chi tiết / Người thực hiện</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogsList.filter(l => l.cr5db_logname?.includes("Role") || l.cr5db_logname?.includes("Employee") || l.cr5db_logname?.includes("User")).map(l => (
                        <tr key={l.cr5db_audittraillogid} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '14px 20px', fontWeight: 600 }}>{l.cr5db_logname}</td>
                          <td style={{ padding: '14px 20px' }}>{l.cr5db_actionexecuted}</td>
                          <td style={{ padding: '14px 20px' }}>{l.cr5db_changedfromvalue}</td>
                          <td style={{ padding: '14px 20px' }}>{l.cr5db_changedtovalue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SCREEN: KPI CATALOG (HRManager + Admin) */}
          {activeTab === 'kpi-catalog' && (activeRole === 'Admin' || checkPermission('kpi-catalog')) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Danh muc KPI</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                    Quan ly thu vien KPI chuan va cac muc tieu danh gia
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (activeKpiCatalogSubTab === 'library') {
                      setEditingKpiLibrary(null); setKpiLibName(''); setKpiLibUnit('%'); setKpiLibFormula('');
                      setShowKpiLibraryModal(true);
                    } else {
                      setEditingObjective(null); setObjectiveName(''); setObjectiveTarget(100);
                      setShowObjectiveModal(true);
                    }
                  }}
                  className="btn-primary"
                >
                  + Them {activeKpiCatalogSubTab === 'library' ? 'KPI moi' : 'Muc tieu moi'}
                </button>
              </div>

              {/* Stats bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {[
                  { label: 'Thu vien KPI', value: kpiLibrariesList.length, color: '#7c3aed', icon: '📊' },
                  { label: 'Muc tieu', value: objectivesList.length, color: '#0ea5e9', icon: '🎯' },
                  { label: 'KPI Targets su dung', value: kpiTargets.length, color: '#10b981', icon: '✅' },
                ].map(stat => (
                  <div key={stat.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ fontSize: '28px' }}>{stat.icon}</div>
                    <div>
                      <div style={{ fontSize: '26px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sub-tab switcher */}
              <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid var(--color-border)' }}>
                {(['library', 'objectives'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveKpiCatalogSubTab(tab)}
                    style={{
                      padding: '10px 28px', fontWeight: 600, fontSize: '14px', border: 'none',
                      background: 'transparent', cursor: 'pointer',
                      borderBottom: activeKpiCatalogSubTab === tab ? '3px solid var(--color-primary)' : '3px solid transparent',
                      color: activeKpiCatalogSubTab === tab ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      transition: 'all 0.18s', marginBottom: '-2px',
                    }}
                  >
                    {tab === 'library' ? 'Thu vien KPI' : 'Muc tieu (Objectives)'}
                  </button>
                ))}
              </div>

              {/* ── Library sub-tab ──────────────────────────────────── */}
              {activeKpiCatalogSubTab === 'library' && (
                <>
                  {kpiLibrariesList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--color-text-secondary)', background: 'var(--color-surface)', borderRadius: '12px', border: '2px dashed var(--color-border)' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                      <p style={{ fontWeight: 600, marginBottom: '8px' }}>Chua co KPI nao trong thu vien</p>
                      <p style={{ fontSize: '13px', marginBottom: '20px' }}>Them KPI chuan de nhan vien lua chon khi gan chi tieu</p>
                      <button onClick={() => { setEditingKpiLibrary(null); setKpiLibName(''); setKpiLibUnit('%'); setKpiLibFormula(''); setShowKpiLibraryModal(true); }} className="btn-primary">+ Them KPI dau tien</button>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '16px' }}>
                      {kpiLibrariesList.map((lib: any) => (
                        <div key={lib.cr5db_kpilibraryid} style={{
                          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                          borderRadius: '14px', padding: '20px', transition: 'box-shadow 0.2s, transform 0.2s',
                          cursor: 'default',
                        }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.10)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ''; (e.currentTarget as HTMLElement).style.transform = ''; }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #ede9fe, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>📊</div>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-text)' }}>{lib.cr5db_kpiname}</div>
                                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Don vi: <strong style={{ color: 'var(--color-primary)' }}>{lib.cr5db_unit || 'N/A'}</strong></div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                              <button
                                onClick={() => { setEditingKpiLibrary(lib); setKpiLibName(lib.cr5db_kpiname); setKpiLibUnit(lib.cr5db_unit || '%'); setKpiLibFormula(lib.cr5db_formula || ''); setShowKpiLibraryModal(true); }}
                                style={{ padding: '4px 10px', fontSize: '12px', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer', background: 'transparent' }}
                              >Sua</button>
                              <button
                                onClick={() => handleDeleteKpiLibrary(lib.cr5db_kpilibraryid)}
                                style={{ padding: '4px 10px', fontSize: '12px', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', background: 'transparent', color: '#dc2626' }}
                              >Xoa</button>
                            </div>
                          </div>
                          {lib.cr5db_formula && (
                            <div style={{ marginTop: '12px', padding: '8px 12px', background: 'var(--color-background)', borderRadius: '8px', fontSize: '12px', color: 'var(--color-text-secondary)', fontFamily: 'monospace', border: '1px solid var(--color-border-light)' }}>
                              <span style={{ fontWeight: 700, color: 'var(--color-text)', fontFamily: 'inherit' }}>Cong thuc: </span>{lib.cr5db_formula}
                            </div>
                          )}
                          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            Duoc su dung boi <strong style={{ color: 'var(--color-text)', marginLeft: '4px' }}>{kpiTargets.filter((k: any) => k._cr5db_kpicode_value === lib.cr5db_kpilibraryid).length}</strong> KPI targets
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </>
              )}

              {/* ── Objectives sub-tab ────────────────────────────────── */}
              {activeKpiCatalogSubTab === 'objectives' && (
                <>
                  {objectivesList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--color-text-secondary)', background: 'var(--color-surface)', borderRadius: '12px', border: '2px dashed var(--color-border)' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
                      <p style={{ fontWeight: 600, marginBottom: '8px' }}>Chua co muc tieu nao</p>
                      <p style={{ fontSize: '13px', marginBottom: '20px' }}>Them muc tieu chung de lien ket voi KPI targets cua nhan vien</p>
                      <button onClick={() => { setEditingObjective(null); setObjectiveName(''); setObjectiveTarget(100); setShowObjectiveModal(true); }} className="btn-primary">+ Them muc tieu</button>
                    </div>
                  ) : (
                    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                          <tr style={{ background: 'var(--color-background)', borderBottom: '2px solid var(--color-border)' }}>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'left' }}>Ten muc tieu</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'right' }}>Gia tri muc tieu</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'center' }}>KPI lien ket</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'center' }}>Tasks lien ket</th>
                            <th style={{ padding: '12px 16px' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {objectivesList.map((obj: any) => (
                            <tr key={obj.cr5db_objectiveid} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                              <td style={{ padding: '14px 16px' }}>
                                <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{obj.cr5db_objective1}</div>
                                {obj.cr5db_periodnamename && (
                                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Ky: {obj.cr5db_periodnamename}</div>
                                )}
                              </td>
                              <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--color-primary)', fontSize: '16px' }}>
                                {obj.cr5db_targetvalue ?? '--'}
                              </td>
                              <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                <span style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: '12px', padding: '3px 12px', fontSize: '12px', fontWeight: 700 }}>
                                  {kpiTargets.filter((k: any) => k._cr5db_parentobjective_value === obj.cr5db_objectiveid).length}
                                </span>
                              </td>
                              <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: '12px', padding: '3px 12px', fontSize: '12px', fontWeight: 700 }}>
                                  {tasks.filter((t: any) => t._cr5db_objectivename_value === obj.cr5db_objectiveid).length}
                                </span>
                              </td>
                              <td style={{ padding: '14px 16px' }}>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                  <button onClick={() => { setEditingObjective(obj); setObjectiveName(obj.cr5db_objective1); setObjectiveTarget(obj.cr5db_targetvalue ?? 100); setShowObjectiveModal(true); }} style={{ padding: '5px 12px', fontSize: '12px', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer', background: 'transparent', fontWeight: 600 }}>Sua</button>
                                  <button onClick={() => handleDeleteObjective(obj.cr5db_objectiveid)} style={{ padding: '5px 12px', fontSize: '12px', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', background: 'transparent', color: '#dc2626', fontWeight: 600 }}>Xoa</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                </>
              )}
            </div>
          )}

          {/* SCREEN 12: APPROVAL ROUTES CONFIG (ADMIN OR PERMITTED ONLY) */}
          {activeTab === 'routes' && (activeRole === 'Admin' || checkPermission('routes')) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Quy tắc phê duyệt (Approval Routes)</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Cấu hình điều kiện và tuyến phê duyệt động cho các thao tác dữ liệu</p>
                </div>
                <button
                  onClick={() => {
                    setEditingRoute(null);
                    setRouteName('');
                    setRouteTargetEntity(1);
                    setRouteOperation(4);
                    setRouteRequesterRole(1);
                    setRouteRoutingType(1);
                    setRouteApproverRole('');
                    setRouteApproverUserId('');
                    setRoutePriority(10);
                    setShowRouteModal(true);
                  }}
                  className="btn-primary"
                >
                  + Thêm quy tắc
                </button>
              </div>

              <div className="card-spec" style={{ padding: '0px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: '14px 20px' }}>Tên quy tắc</th>
                      <th style={{ padding: '14px 20px' }}>Thực thể áp dụng</th>
                      <th style={{ padding: '14px 20px' }}>Thao tác</th>
                      <th style={{ padding: '14px 20px' }}>Vai trò yêu cầu</th>
                      <th style={{ padding: '14px 20px' }}>Loại định tuyến</th>
                      <th style={{ padding: '14px 20px' }}>Người duyệt chỉ định / Vai trò</th>
                      <th style={{ padding: '14px 20px' }}>Độ ưu tiên</th>
                      <th style={{ padding: '14px 20px', textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvalRoutesList.map((route: any) => {
                      const matchedUser = usersList.find(u => u.cr5db_userid === route._cr5db_approveruser_value);
                      
                      const entityLabel = {
                        1: "Công việc (Tasks)",
                        2: "KPI (KPITargets)",
                        3: "Vị trí (JobPositions)",
                        4: "Định biên (HeadcountRequests)",
                        5: "Dự án (Projects)",
                        6: "Người dùng (Users)"
                      }[route.cr5db_targetentity as number] || route.cr5db_targetentity;

                      const opLabel = {
                        1: "Tạo mới (Create)",
                        2: "Cập nhật (Update)",
                        3: "Xóa (Delete)",
                        4: "Tất cả (All)"
                      }[route.cr5db_operationtype as number] || route.cr5db_operationtype;

                      const requesterRoleLabel = {
                        1: "Nhân viên (Employee)",
                        2: "Trưởng dự án (ProjectManager)",
                        3: "Quản lý nhân sự (HRManager)",
                        4: "Quản trị viên (Admin)"
                      }[route.cr5db_requesterrole as number] || route.cr5db_requesterrole;

                      const routingTypeLabel = {
                        1: "Cấp trên quản lý (POSITION_HIERARCHY)",
                        2: "Theo nhóm quyền (SPECIFIC_GROUP)",
                        3: "Trưởng phòng ban (DEPARTMENT_HEAD)",
                        4: "Chỉ định tài khoản (SPECIFIC_USER)"
                      }[route.cr5db_routingtype as number] || route.cr5db_routingtype;

                      return (
                        <tr key={route.cr5db_approvalroutesid} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '14px 20px', fontWeight: 600 }}>{route.cr5db_routename}</td>
                          <td style={{ padding: '14px 20px' }}>{entityLabel}</td>
                          <td style={{ padding: '14px 20px' }}>{opLabel}</td>
                          <td style={{ padding: '14px 20px' }}>{requesterRoleLabel}</td>
                          <td style={{ padding: '14px 20px' }}>{routingTypeLabel}</td>
                          <td style={{ padding: '14px 20px' }}>
                            {route.cr5db_routingtype === 4 && matchedUser ? (
                              <span>👤 {matchedUser.cr5db_fullname}</span>
                            ) : route.cr5db_routingtype === 2 ? (
                              <span>👥 Nhóm: {permissionGroups.find(g => g.id === route.cr5db_approverrole)?.name || route.cr5db_approverrole}</span>
                            ) : (
                              <span style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Tự động phân giải</span>
                            )}
                          </td>
                          <td style={{ padding: '14px 20px', fontWeight: 600 }}>{route.cr5db_priority}</td>
                          <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                              <button
                                onClick={() => {
                                  setEditingRoute(route);
                                  setRouteName(route.cr5db_routename);
                                  setRouteTargetEntity(route.cr5db_targetentity);
                                  setRouteOperation(route.cr5db_operationtype);
                                  setRouteRequesterRole(route.cr5db_requesterrole);
                                  setRouteRoutingType(route.cr5db_routingtype);
                                  setRouteApproverRole(route.cr5db_approverrole || '');
                                  setRouteApproverUserId(route._cr5db_approveruser_value || '');
                                  setRoutePriority(route.cr5db_priority);
                                  setShowRouteModal(true);
                                }}
                                className="btn-filled-3"
                                style={{ padding: '4px 8px' }}
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteRoute(route.cr5db_approvalroutesid)}
                                className="btn-filled-3"
                                style={{ padding: '4px 8px', color: '#a80000', borderColor: '#a80000' }}
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'system-seed' && activeRole === 'Admin' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Developer Portal</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>Database administration and demo seed utility for Dataverse</p>
              </div>

              <div className="large-card" style={{ padding: '24px', maxWidth: '600px', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Seeding System Data</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                  Clicking the button below will seed all custom system entities with realistic demo data, including companies, departments, catalog positions, active job positions, users, projects, strategic objectives, tasks, timesheets, and performance appraisals. 
                  <br /><br />
                  <strong>Note:</strong> If some tables do not exist on the environment, they will be skipped gracefully with a warning.
                </p>

                {seedingStatus && (
                  <div style={{ padding: '12px 16px', backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '13px', fontFamily: 'monospace', marginBottom: '20px', whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto' }}>
                    {seedingStatus}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={async () => {
                      if (!window.confirm("Bạn có chắc chắn muốn chạy tiến trình seeding dữ liệu vào Dataverse?")) return;
                      setSeedingStatus("Đang khởi tạo tiến trình seeding...");
                      setIsLoading(true);
                      try {
                        const { runWebSeeding } = await import('./lib/seed_data_web');
                        await runWebSeeding((msg) => {
                          setSeedingStatus(prev => prev + "\n" + msg);
                        });
                        alert("Gieo dữ liệu thành công!");
                        await fetchLiveValues();
                      } catch (err: any) {
                        console.error(err);
                        setSeedingStatus(prev => prev + "\n❌ Lỗi: " + (err.message || err));
                        alert("Gieo dữ liệu thất bại: " + (err.message || err));
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className="btn-primary"
                    style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 600, borderRadius: '6px' }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang Seeding...' : 'Seed System Data'}
                  </button>

                  <button 
                    onClick={async () => {
                      if (!window.confirm("Bạn có chắc chắn muốn XÓA TOÀN BỘ dữ liệu demo trong Dataverse?")) return;
                      setSeedingStatus("Đang bắt đầu dọn dẹp dữ liệu...");
                      setIsLoading(true);
                      try {
                        const { runWebCleanup } = await import('./lib/seed_data_web');
                        await runWebCleanup((msg) => {
                          setSeedingStatus(prev => prev + "\n" + msg);
                        });
                        alert("Dọn dẹp hệ thống thành công!");
                        await fetchLiveValues();
                      } catch (err: any) {
                        console.error(err);
                        setSeedingStatus(prev => prev + "\n❌ Lỗi dọn dẹp: " + (err.message || err));
                        alert("Dọn dẹp thất bại: " + (err.message || err));
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className="btn-primary"
                    style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 600, borderRadius: '6px', backgroundColor: '#a80000', borderColor: '#a80000', color: '#ffffff' }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang dọn dẹp...' : 'Clean System Data'}
                  </button>
                </div>
              </div>
            </div>
          )}


        </div>
      </main>

      {/* Task Modal */}
      {showTaskModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'oklab(0 0 0 / 0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '550px', maxHeight: '503px', overflowY: 'auto', backgroundColor: '#ffffff', border: '1px solid #000000', borderRadius: '8px', padding: '24px', display: 'grid', gap: '16px', boxSizing: 'border-box', position: 'relative', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setShowTaskModal(false);
                setEditingTask(null);
                setNewTaskName('');
                setNewTaskDesc('');
                setNewTaskProjectId('');
                setNewTaskPhaseId('');
                setNewTaskObjectiveId('');
                setNewTaskParentId('');
                setNewTaskAssigneeId('');
              }}
              style={{ position: 'absolute', top: '16px', right: '16px', width: '16px', height: '16px', opacity: 0.7, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
              title="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Header */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, lineHeight: '28px', color: '#000000', margin: 0 }}>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveTask} style={{ display: 'grid', gap: '16px', margin: 0 }}>
              {/* Task Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '14px', fontWeight: 500, lineHeight: '14px', color: '#000000' }}>Task Name</label>
                <input 
                  type="text" 
                  value={newTaskName} 
                  onChange={(e) => setNewTaskName(e.target.value)} 
                  style={{ height: '36px', padding: '4px 12px', border: '1px solid #000000', borderRadius: '6px', fontSize: '16px', fontWeight: 400, color: '#000000', boxSizing: 'border-box' }} 
                  required 
                  placeholder="Task Name"
                />
              </div>

              {/* Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '14px', fontWeight: 500, lineHeight: '14px', color: '#000000' }}>Description</label>
                <textarea 
                  value={newTaskDesc} 
                  onChange={(e) => setNewTaskDesc(e.target.value)} 
                  style={{ height: '64px', padding: '8px 12px', border: '1px solid #000000', borderRadius: '6px', fontSize: '16px', fontWeight: 400, color: '#000000', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' }} 
                  placeholder="Describe the task..."
                />
              </div>

              {/* Select buttons (Comboboxes) */}
              <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {/* Project */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '115px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, lineHeight: '14px', color: '#000000' }}>Project</label>
                  <select
                    value={newTaskProjectId}
                    onChange={(e) => {
                      setNewTaskProjectId(e.target.value);
                      setNewTaskPhaseId(''); // Reset phase when project changes
                    }}
                    style={{ height: '36px', padding: '8px 12px', border: '1px solid #000000', borderRadius: '6px', fontSize: '14px', fontWeight: 400, color: '#000000', backgroundColor: '#ffffff', cursor: 'pointer', boxSizing: 'border-box' }}
                  >
                    <option value="">Project</option>
                    {projects.map(p => (
                      <option key={p.cr5db_projectid} value={p.cr5db_projectid}>{p.cr5db_projectname}</option>
                    ))}
                  </select>
                </div>

                {/* Phase */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '109px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, lineHeight: '14px', color: '#000000' }}>Phase</label>
                  <select
                    value={newTaskPhaseId}
                    onChange={(e) => setNewTaskPhaseId(e.target.value)}
                    style={{ height: '36px', padding: '8px 12px', border: '1px solid #000000', borderRadius: '6px', fontSize: '14px', fontWeight: 400, color: '#000000', backgroundColor: '#ffffff', cursor: 'pointer', boxSizing: 'border-box' }}
                    disabled={!newTaskProjectId}
                  >
                    <option value="">Phase</option>
                    {projectPhases
                      .filter(phase => phase._cr5db_projectid_value === newTaskProjectId)
                      .map(phase => (
                        <option key={phase.cr5db_projectphaseid} value={phase.cr5db_projectphaseid}>{phase.cr5db_phasename}</option>
                      ))
                    }
                  </select>
                </div>

                {/* Objective */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '128px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, lineHeight: '14px', color: '#000000' }}>Objective</label>
                  <select
                    value={newTaskObjectiveId}
                    onChange={(e) => setNewTaskObjectiveId(e.target.value)}
                    style={{ height: '36px', padding: '8px 12px', border: '1px solid #000000', borderRadius: '6px', fontSize: '14px', fontWeight: 400, color: '#000000', backgroundColor: '#ffffff', cursor: 'pointer', boxSizing: 'border-box' }}
                  >
                    <option value="">Objective</option>
                    {objectivesList.map(o => (
                      <option key={o.cr5db_objectiveid} value={o.cr5db_objectiveid}>{o.cr5db_objective1}</option>
                    ))}
                  </select>
                </div>

                {/* Subtask */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '141px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, lineHeight: '14px', color: '#000000' }}>Subtask</label>
                  <select
                    value={newTaskParentId}
                    onChange={(e) => setNewTaskParentId(e.target.value)}
                    style={{ height: '36px', padding: '8px 12px', border: '1px solid #000000', borderRadius: '6px', fontSize: '14px', fontWeight: 400, color: '#000000', backgroundColor: '#ffffff', cursor: 'pointer', boxSizing: 'border-box' }}
                  >
                    <option value="">Subtask</option>
                    {tasks.map(t => (
                      <option key={t.cr5db_taskid} value={t.cr5db_taskid}>{t.cr5db_taskname}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status field (only in Edit mode) */}
              {editingTask && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, lineHeight: '14px', color: '#000000' }}>Status</label>
                  <select
                    value={newTaskStatus}
                    onChange={(e) => setNewTaskStatus(e.target.value as any)}
                    style={{ height: '36px', padding: '8px 12px', border: '1px solid #000000', borderRadius: '6px', fontSize: '14px', fontWeight: 400, color: '#000000', backgroundColor: '#ffffff', cursor: 'pointer', boxSizing: 'border-box' }}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              )}

              {/* Due Date & Assignee Selection */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%', alignItems: 'end' }}>
                {/* Due Date */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, lineHeight: '14px', color: '#000000' }}>Due Date</label>
                  <input 
                    type="date" 
                    value={newTaskDueDate} 
                    onChange={(e) => setNewTaskDueDate(e.target.value)} 
                    style={{ height: '36px', padding: '4px 12px', border: '1px solid #000000', borderRadius: '6px', fontSize: '16px', fontWeight: 400, color: '#000000', boxSizing: 'border-box', backgroundColor: '#ffffff' }}
                  />
                </div>

                {/* Assignee Dropdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, lineHeight: '14px', color: '#000000' }}>Assignee</label>
                  <select
                    value={newTaskAssigneeId}
                    onChange={(e) => setNewTaskAssigneeId(e.target.value)}
                    style={{ height: '36px', padding: '8px 12px', border: '1px solid #000000', borderRadius: '6px', fontSize: '14px', fontWeight: 400, color: '#000000', backgroundColor: '#ffffff', cursor: 'pointer', boxSizing: 'border-box', width: '100%' }}
                  >
                    <option value="">Chưa phân công</option>
                    {usersList.map(u => (
                      <option key={u.cr5db_userid} value={u.cr5db_userid}>{u.cr5db_fullname} ({u.cr5db_email})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', width: '100%', marginTop: '8px' }}>
                <button 
                  type="submit" 
                  style={{ border: 'none', borderRadius: '6px', padding: '8px 16px', height: '36px', width: '485px', fontWeight: 500, fontSize: '14px', backgroundColor: '#000000', color: '#ffffff', cursor: 'pointer', boxSizing: 'border-box' }}
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowTaskModal(false);
                    setEditingTask(null);
                    setNewTaskName('');
                    setNewTaskDesc('');
                    setNewTaskProjectId('');
                    setNewTaskPhaseId('');
                    setNewTaskObjectiveId('');
                    setNewTaskParentId('');
                    setNewTaskAssigneeId('');
                  }} 
                  style={{ border: '1px solid #000000', borderRadius: '6px', padding: '8px 16px', height: '36px', width: '485px', fontWeight: 500, fontSize: '14px', backgroundColor: 'transparent', color: '#000000', cursor: 'pointer', boxSizing: 'border-box' }}
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Headcount Request Modal */}
      {showHeadcountRequestModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700 }}>{editingHeadcountRequest ? 'Cập nhật đề xuất định biên' : 'Đề xuất bổ sung định biên'}</h3>
            <form onSubmit={handleSaveHeadcountRequest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                  <select value={newReqDeptId} onChange={(e) => setNewReqDeptId(e.target.value)} className="input-spec" style={{ height: '38px', padding: '6px 12px' }}>
                    {departmentsList.map(d => (
                      <option key={d.cr5db_departmentid} value={d.cr5db_departmentid}>{d.cr5db_departmentname}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Chức danh (Catalog)</label>
                  <select value={newReqCatalogId} onChange={(e) => setNewReqCatalogId(e.target.value)} className="input-spec" style={{ height: '38px', padding: '6px 12px' }}>
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
                  {jobPositionsList.map(pos => (
                    <option key={pos.cr5db_jobpositionid} value={pos.cr5db_jobpositionid}>{pos.cr5db_positionname}</option>
                  ))}
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
                <button type="button" onClick={() => {
                  setShowHeadcountRequestModal(false);
                  setEditingHeadcountRequest(null);
                  setNewRequestName('');
                  setNewReqReason('');
                  setNewReqReportsToId('');
                }} className="btn-filled-3">Hủy</button>
                <button type="submit" className="btn-primary">{editingHeadcountRequest ? 'Lưu thay đổi' : 'Gửi đề xuất'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approval Route Modal */}
      {showRouteModal && (activeRole === 'Admin' || checkPermission('routes')) && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 700 }}>
              {editingRoute ? 'Cập nhật quy tắc phê duyệt' : 'Thêm mới quy tắc phê duyệt'}
            </h3>
            <form onSubmit={handleSaveRoute} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Tên quy tắc</label>
                <input
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  className="input-spec"
                  required
                  placeholder="Ví dụ: Duyệt KPI nhân viên..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Thực thể áp dụng</label>
                  <select
                    value={routeTargetEntity}
                    onChange={(e) => setRouteTargetEntity(Number(e.target.value))}
                    className="input-spec"
                    style={{ padding: '6px 12px', height: '38px' }}
                  >
                    <option value={1}>Công việc (Tasks)</option>
                    <option value={2}>Chỉ tiêu KPI (KPITargets)</option>
                    <option value={3}>Vị trí công việc (JobPositions)</option>
                    <option value={4}>Yêu cầu định biên (HeadcountRequests)</option>
                    <option value={5}>Dự án (Projects)</option>
                    <option value={6}>Người dùng (Users)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Thao tác dữ liệu</label>
                  <select
                    value={routeOperation}
                    onChange={(e) => setRouteOperation(Number(e.target.value))}
                    className="input-spec"
                    style={{ padding: '6px 12px', height: '38px' }}
                  >
                    <option value={1}>Tạo mới (Create)</option>
                    <option value={2}>Cập nhật (Update)</option>
                    <option value={3}>Xóa (Delete)</option>
                    <option value={4}>Tất cả (All)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Vai trò yêu cầu</label>
                  <select
                    value={routeRequesterRole}
                    onChange={(e) => setRouteRequesterRole(Number(e.target.value))}
                    className="input-spec"
                    style={{ padding: '6px 12px', height: '38px' }}
                  >
                    <option value={1}>Nhân viên (Employee)</option>
                    <option value={4}>Quản trị viên (Admin)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Độ ưu tiên</label>
                  <input
                    type="number"
                    value={routePriority}
                    onChange={(e) => setRoutePriority(Number(e.target.value))}
                    className="input-spec"
                    required
                  />
                </div>
              </div>

               <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Loại định tuyến phê duyệt</label>
                <select
                  value={routeRoutingType}
                  onChange={(e) => setRouteRoutingType(Number(e.target.value))}
                  className="input-spec"
                  style={{ padding: '6px 12px', height: '38px' }}
                >
                  <option value={1}>Quản lý trực tiếp (POSITION_HIERARCHY)</option>
                  <option value={2}>Theo nhóm quyền (SPECIFIC_GROUP)</option>
                  <option value={3}>Trưởng bộ phận (DEPARTMENT_HEAD)</option>
                  <option value={4}>Người duyệt chỉ định (SPECIFIC_USER)</option>
                </select>
              </div>

              {routeRoutingType === 2 && (
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Nhóm quyền duyệt chỉ định</label>
                  <select
                    value={routeApproverRole}
                    onChange={(e) => setRouteApproverRole(e.target.value)}
                    className="input-spec"
                    style={{ padding: '6px 12px', height: '38px' }}
                    required
                  >
                    <option value="">-- Chọn nhóm quyền duyệt --</option>
                    {permissionGroups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {routeRoutingType === 4 && (
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Người duyệt chỉ định</label>
                  <select
                    value={routeApproverUserId}
                    onChange={(e) => setRouteApproverUserId(e.target.value)}
                    className="input-spec"
                    style={{ padding: '6px 12px', height: '38px' }}
                    required
                  >
                    <option value="">-- Chọn tài khoản duyệt --</option>
                    {usersList.map((user: User) => (
                      <option key={user.cr5db_userid} value={user.cr5db_userid}>
                        {user.cr5db_fullname} ({user.cr5db_email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowRouteModal(false);
                    setEditingRoute(null);
                    setRouteName('');
                    setRouteApproverRole('');
                    setRouteApproverUserId('');
                  }}
                  className="btn-filled-3"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  {editingRoute ? 'Lưu thay đổi' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Timesheet Modal */}
      {showTimesheetModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700 }}>Log Work Hours</h3>
            <form onSubmit={handleAddTimesheet} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Mô tả công việc</label>
                <input type="text" value={newTimesheetDesc} onChange={(e) => setNewTimesheetDesc(e.target.value)} className="input-spec" required placeholder="Hôm nay bạn đã làm gì..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Số giờ làm việc</label>
                  <input type="number" min={0.5} max={24} step={0.5} value={newTimesheetHours} onChange={(e) => setNewTimesheetHours(Number(e.target.value))} className="input-spec" style={{ height: '38px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Ngày log</label>
                  <input type="date" value={newTimesheetDate} onChange={(e) => setNewTimesheetDate(e.target.value)} className="input-spec" style={{ height: '38px' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Liên kết nhiệm vụ (Task)</label>
                <select value={newTimesheetTaskId} onChange={(e) => setNewTimesheetTaskId(e.target.value)} className="input-spec" style={{ height: '38px', padding: '6px 12px' }}>
                  {tasks
                    .filter(t => {
                      if (activeRole === 'Employee') {
                        const isAssigned = t.cr5db_assignee_email.toLowerCase() === currentUserEmail.toLowerCase();
                        const isCreatedByMe = t.createdbyname && (
                          t.createdbyname.toLowerCase() === currentUserName.toLowerCase() ||
                          (usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase())?.cr5db_fullname?.toLowerCase() === t.createdbyname.toLowerCase())
                        );
                        const isSubtask = !!t._cr5db_parenttask_value;
                        return isAssigned && !isCreatedByMe && !isSubtask;
                      }
                      return true;
                    })
                    .map(t => (
                      <option key={t.cr5db_taskid} value={t.cr5db_taskid}>{t.cr5db_taskname}</option>
                    ))
                  }
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowTimesheetModal(false)} className="btn-filled-3">Hủy</button>
                <button type="submit" className="btn-primary">Ghi nhận</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KPI Library Modal */}
      {showKpiLibraryModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '460px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>{editingKpiLibrary ? 'Chinh sua KPI' : 'Them KPI moi vao thu vien'}</h3>
            <form onSubmit={handleSaveKpiLibrary} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Ten KPI <span style={{ color: '#dc2626' }}>*</span></label>
                <input value={kpiLibName} onChange={e => setKpiLibName(e.target.value)} required placeholder="Vi du: Doanh so thang, Ty le diem danh..." style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
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
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowKpiLibraryModal(false)} className="btn-filled-3">Huy</button>
                <button type="submit" className="btn-primary">Luu KPI</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Objective Modal */}
      {showObjectiveModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '420px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>{editingObjective ? 'Chinh sua muc tieu' : 'Them muc tieu moi'}</h3>
            <form onSubmit={handleSaveObjective} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Ten muc tieu <span style={{ color: '#dc2626' }}>*</span></label>
                <input value={objectiveName} onChange={e => setObjectiveName(e.target.value)} required placeholder="Vi du: Phai dat top 1 QLDA, Tang truong doanh so 20%..." style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Gia tri muc tieu</label>
                <input type="number" value={objectiveTarget} onChange={e => setObjectiveTarget(Number(e.target.value))} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowObjectiveModal(false)} className="btn-filled-3">Huy</button>
                <button type="submit" className="btn-primary">Luu muc tieu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Timesheet Rejection Modal */}
      {showRejectionModal && (
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
      )}

      {/* Company Modal */}
      {showCompanyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700 }}>
              {editingCompany ? 'Edit Company' : 'Add Company'}
            </h3>
            <form onSubmit={handleAddCompany} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Mã công ty</label>
                <input type="text" value={newCompanyCode} onChange={(e) => setNewCompanyCode(e.target.value)} className="input-spec" required placeholder="VNX" />
              </div>
              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Tên công ty</label>
                <input type="text" value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)} className="input-spec" required placeholder="Vietnam Express Corp" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => { setShowCompanyModal(false); setEditingCompany(null); setNewCompanyCode(''); setNewCompanyName(''); }} className="btn-filled-3">Hủy</button>
                <button type="submit" className="btn-primary">{editingCompany ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Department Modal */}
      {showDeptModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700 }}>
              {editingDept ? 'Edit Department' : 'Add Department'}
            </h3>
            <form onSubmit={handleAddDepartment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Mã phòng ban</label>
                <input type="text" value={newDeptCode} onChange={(e) => setNewDeptCode(e.target.value)} className="input-spec" required placeholder="HR" />
              </div>
              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Tên phòng ban</label>
                <input type="text" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} className="input-spec" required placeholder="Human Resources" />
              </div>
              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Công ty trực thuộc</label>
                <select value={selectedDeptCompanyId} onChange={(e) => setSelectedDeptCompanyId(e.target.value)} className="input-spec" style={{ height: '38px', padding: '6px 12px' }}>
                  {companiesList.map(c => (
                    <option key={c.cr5db_companyid} value={c.cr5db_companyid}>{c.cr5db_companyname}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => { setShowDeptModal(false); setEditingDept(null); setNewDeptCode(''); setNewDeptName(''); }} className="btn-filled-3">Hủy</button>
                <button type="submit" className="btn-primary">{editingDept ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Position Catalog Modal */}
      {showCatalogModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700 }}>{editingCatalog ? 'Edit Standard Title' : 'Add Standard Title'}</h3>
            <form onSubmit={handleAddCatalog} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Mã</label>
                <input type="text" value={newCatalogCode} onChange={(e) => setNewCatalogCode(e.target.value)} className="input-spec" required placeholder="DEV" />
              </div>
              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Tên chức danh</label>
                <input type="text" value={newCatalogName} onChange={(e) => setNewCatalogName(e.target.value)} className="input-spec" required placeholder="Developer" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => { setShowCatalogModal(false); setEditingCatalog(null); setNewCatalogCode(''); setNewCatalogName(''); }} className="btn-filled-3">Hủy</button>
                <button type="submit" className="btn-primary">{editingCatalog ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Job Position Modal */}
      {showJobPositionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700 }}>{editingJobPosition ? 'Edit Job Position' : 'Create Job Position'}</h3>
            <form onSubmit={handleAddJobPosition} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Tên vị trí</label>
                <input type="text" value={newJobPosName} onChange={(e) => setNewJobPosName(e.target.value)} className="input-spec" required placeholder="Ví dụ: Senior Frontend Engineer..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Phòng ban</label>
                  <select value={newJobPosDeptId} onChange={(e) => setNewJobPosDeptId(e.target.value)} className="input-spec" style={{ height: '38px', padding: '6px 12px' }}>
                    {departmentsList.map(d => (
                      <option key={d.cr5db_departmentid} value={d.cr5db_departmentid}>{d.cr5db_departmentname}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Chức danh gốc (Catalog)</label>
                  <select value={newJobPosCatalogId} onChange={(e) => setNewJobPosCatalogId(e.target.value)} className="input-spec" style={{ height: '38px', padding: '6px 12px' }}>
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
                      .map(pos => (
                        <option key={pos.cr5db_jobpositionid} value={pos.cr5db_jobpositionid}>{pos.cr5db_positionname}</option>
                      ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => { setShowJobPositionModal(false); setEditingJobPosition(null); setNewJobPosName(''); setNewJobPosQuota(1); setNewJobPosDeptId(''); setNewJobPosCatalogId(''); }} className="btn-filled-3">Hủy</button>
                <button type="submit" className="btn-primary">{editingJobPosition ? 'Update' : 'Tạo mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Assignment Modal */}
      {showAssignRoleModal && (
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
      )}

      {/* Directory Details Dialog */}
      {selectedDirectoryUser && (
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
      )}

      {/* Employee Modal (Add / Edit) */}
      {showEmployeeModal && (
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
                  {jobPositionsList.map(pos => (
                    <option key={pos.cr5db_jobpositionid} value={pos.cr5db_jobpositionid}>
                      {pos.cr5db_positionname}
                    </option>
                  ))}
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
      )}

      {/* Permission Group Modal */}
      {showGroupModal && (
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
      )}

      {/* Project Modal (Add / Edit) */}
      {showProjectModal && (
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
      )}

      {/* Phase Modal */}
      {showPhaseModal && (
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
      )}

      {/* Risk Modal */}
      {showRiskModal && (
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
      )}

      {/* KPI Modal */}
      {showKpiModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: (activeRole === 'Employee' && !checkPermission('kpi-catalog')) ? '400px' : '500px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700 }}>
              {(activeRole === 'Employee' && !checkPermission('kpi-catalog')) 
                ? 'Cập nhật tiến độ thực tế KPI' 
                : editingKpi ? 'Chỉnh sửa mục tiêu KPI' : 'Gán chỉ tiêu KPI mới'}
            </h3>
            
            <form onSubmit={handleSaveKpi} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(activeRole === 'Employee' && !checkPermission('kpi-catalog')) ? (
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
                        {objectivesList.filter(o => !kpiPeriod || o.cr5db_periodnamename === kpiPeriod).map(o => (
                          <option key={o.cr5db_objectiveid} value={o.cr5db_objectiveid}>{o.cr5db_objective1}</option>
                        ))}
                        {objectivesList.filter(o => !kpiPeriod || o.cr5db_periodnamename === kpiPeriod).length === 0 && (
                          <option value="">Không có mục tiêu nào trong chu kỳ này</option>
                        )}
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
                  onClick={() => {
                    setShowKpiModal(false);
                    setEditingKpi(null);
                  }} 
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
      )}

      {/* Resource Allocation Modal */}
      {showAllocationModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '420px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Phân bổ nhân sự vào dự án</h3>
            <form onSubmit={handleSaveAllocation} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Nhân sự <span style={{ color: '#dc2626' }}>*</span></label>
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
                <button type="button" onClick={() => setShowAllocationModal(false)} className="btn-filled-3">Hủy</button>
                <button type="submit" className="btn-primary">Giao việc</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* System Notifications Modal */}
      {showNotificationsModal && (
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
      )}

      {/* 8. Universal Change Request Reason & Approver Selection Modal */}
      {showApprovalModal && approvalModalData && (
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
      )}


      {/* Period Modal */}
      {showPeriodModal && (
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
      )}


      {/* Assign Appraisal Modal */}
      {showAssignAppraisalModal && (
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
      )}

    </div>
  );
}

export default App;
