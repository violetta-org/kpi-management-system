import React, { useState, useEffect } from 'react';
import './App.css';
import { getContext } from '@microsoft/power-apps/app';

// Services
import { Cr5db_usersService } from './generated/services/Cr5db_usersService';
import { Cr5db_systemnotificationsService } from './generated/services/Cr5db_systemnotificationsService';
import { Cr5db_tasksService } from './generated/services/Cr5db_tasksService';
import { Cr5db_headcountrequestsService } from './generated/services/Cr5db_headcountrequestsService';
import { Cr5db_kpitargetsService } from './generated/services/Cr5db_kpitargetsService';
import { Cr5db_departmentsService } from './generated/services/Cr5db_departmentsService';
import { Cr5db_timesheetlogsService } from './generated/services/Cr5db_timesheetlogsService';
import { Cr5db_projectsService } from './generated/services/Cr5db_projectsService';
import { Cr5db_performanceappraisalsService } from './generated/services/Cr5db_performanceappraisalsService';
import { Cr5db_companiesService } from './generated/services/Cr5db_companiesService';
import { Cr5db_positioncatalogsService } from './generated/services/Cr5db_positioncatalogsService';
import { Cr5db_jobpositionsService } from './generated/services/Cr5db_jobpositionsService';
import { Cr5db_audittraillogsService } from './generated/services/Cr5db_audittraillogsService';
import { Cr5db_projectphasesService } from './generated/services/Cr5db_projectphasesService';
import { Cr5db_projectrisksService } from './generated/services/Cr5db_projectrisksService';
// import { Cr5db_evaluationperiodsService } from './generated/services/Cr5db_evaluationperiodsService';
// import { Cr5db_kpilibrariesService } from './generated/services/Cr5db_kpilibrariesService';
import { Cr5db_objectivesService } from './generated/services/Cr5db_objectivesService';
import { Cr5db_resourceallocationsService } from './generated/services/Cr5db_resourceallocationsService';

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

// Type Interfaces
interface User {
  cr5db_userid: string;
  cr5db_fullname: string;
  cr5db_email?: string;
  cr5db_systemrole?: string;
  cr5db_jobpositionname?: string;
  cr5db_isactive?: boolean;
  _cr5db_jobposition_value?: string;
}

interface Task {
  cr5db_taskid: string;
  cr5db_taskname: string;
  cr5db_description: string;
  cr5db_status: 'Not Started' | 'In Progress' | 'Completed';
  cr5db_assignee_email: string;
  cr5db_assignee_name: string;
  cr5db_project_name: string;
  cr5db_due_date: string;
  _cr5db_parenttask_value?: string;
  _cr5db_objectivename_value?: string;
  createdbyname?: string;
  _createdby_value?: string;
}

interface HeadcountRequest {
  cr5db_headcountrequestid: string;
  cr5db_requestname: string;
  cr5db_requesttype: string;
  cr5db_departmentname: string;
  cr5db_positiontitle: string;
  cr5db_requestedquantity: number;
  cr5db_reason: string;
  cr5db_approvalstatus: 'Pending' | 'Approved' | 'Rejected';
  cr5db_createddate: string;
  _cr5db_department_value?: string;
  _cr5db_job_position_id_value?: string;
  _cr5db_position_catalog_id_value?: string;
  _cr5db_approver_positionid_value?: string;
}

interface KPITarget {
  cr5db_kpitargetid: string;
  cr5db_kpiname: string;
  cr5db_targetvalue: number;
  cr5db_actualvalue: number;
  cr5db_unit: string;
  cr5db_weightpercentage: number;
  cr5db_user_email: string;
  cr5db_period: string;
  _cr5db_parentobjective_value?: string;
  _cr5db_employeeid_value?: string;
}

interface Company {
  cr5db_companyid: string;
  cr5db_companycode: string;
  cr5db_companyname: string;
}

interface PositionCatalog {
  cr5db_positioncatalogid: string;
  cr5db_code?: string;
  cr5db_positioncatalog1: string;
}

interface JobPosition {
  cr5db_jobpositionid: string;
  cr5db_positionname: string;
  _cr5db_department_value?: string;
  _cr5db_positioncatalogtitle_value?: string;
  _cr5db_reportstopositionid_value?: string;
  cr5db_headcountquota?: number;
  cr5db_currentheadcount?: number;
  cr5db_departmentname?: string;
}

interface AuditLog {
  cr5db_audittraillogid: string;
  cr5db_logname: string;
  cr5db_actionexecuted?: string;
  cr5db_changedfromvalue?: string;
  cr5db_changedtovalue?: string;
  createdon?: string;
  createdbyname?: string;
}

function normalizeRole(roleStr: string | undefined): 'Employee' | 'ProjectManager' | 'HRManager' | 'Admin' {
  if (!roleStr) return 'Employee';
  const norm = roleStr.toLowerCase().replace(/[^a-z]/g, '');
  if (norm.includes('superadmin') || norm === 'admin' || norm.includes('hradmin')) return 'Admin';
  if (norm.includes('hrmanager') || norm.includes('hr')) return 'HRManager';
  if (norm.includes('projectmanager') || norm.includes('pm') || norm.includes('manager')) return 'ProjectManager';
  return 'Employee';
}

function getDerivedRole(positionTitle: string | undefined): 'Employee' | 'ProjectManager' | 'HRManager' | 'Admin' {
  if (!positionTitle) return 'Employee';
  const title = positionTitle.toLowerCase();
  if (title.includes('admin') || title.includes('administrator')) return 'Admin';
  if (title.includes('hr') || title.includes('human resource') || title.includes('recruiter')) return 'HRManager';
  if (title.includes('project lead') || title.includes('project manager') || title.includes('pm')) return 'ProjectManager';
  return 'Employee';
}

function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'tasks' | 'timesheets' | 'kpi' | 'performance' | 'companies' | 'positions' | 'headcount' | 'requests' | 'directory' | 'roles' | 'resources'
  >('dashboard');

  // Authenticated Role states
  const [activeRole, setActiveRole] = useState<'Employee' | 'ProjectManager' | 'HRManager' | 'Admin'>('Employee');
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');

  // Floating Switcher
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  // Live Data States
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

  // Newly mapped master list states
  const [companiesList, setCompaniesList] = useState<Company[]>([]);
  const [positionCatalogList, setPositionCatalogList] = useState<PositionCatalog[]>([]);
  const [jobPositionsList, setJobPositionsList] = useState<JobPosition[]>([]);
  const [auditLogsList, setAuditLogsList] = useState<AuditLog[]>([]);
  // const [evaluationPeriodsList, setEvaluationPeriodsList] = useState<any[]>([]);
  // const [kpiLibrariesList, setKpiLibrariesList] = useState<any[]>([]);
  const [resourceAllocationsList, setResourceAllocationsList] = useState<any[]>([]);
  const [objectivesList, setObjectivesList] = useState<any[]>([]);

  // Sub-tabs
  const [activeTimesheetSubTab, setActiveTimesheetSubTab] = useState<'my' | 'approvals'>('my');
  const [activePerformanceSubTab, setActivePerformanceSubTab] = useState<'my' | 'team' | 'admin'>('my');
  const [activeResourcesSubTab, setActiveResourcesSubTab] = useState<'allocations' | 'projects'>('allocations');

  const [collapsedProjects, setCollapsedProjects] = useState<{ [key: string]: boolean }>({});
  const [activeKpiSubTab, setActiveKpiSubTab] = useState<'overview' | 'charts'>('overview');
  const [kpiTimeRange, setKpiTimeRange] = useState<'week' | 'month' | 'quarter' | 'custom'>('quarter');

  // Employee sub-tab & CRUD state
  const [activeDirectorySubTab, setActiveDirectorySubTab] = useState<'view' | 'manage' | 'history'>('view');
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<User | null>(null);
  const [employeeFullName, setEmployeeFullName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeeRole, setEmployeeRole] = useState('Employee');
  const [employeeJobPositionId, setEmployeeJobPositionId] = useState('');
  const [employeeIsActive, setEmployeeIsActive] = useState(true);

  // Project Management states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectStartDate, setProjectStartDate] = useState('');
  const [projectEndDate, setProjectEndDate] = useState('');
  const [projectStatus, setProjectStatus] = useState('Not Started');
  const [activeProjectDetails, setActiveProjectDetails] = useState<any>(null);

  // Phase and Risk states
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [newPhaseName, setNewPhaseName] = useState('');
  const [newPhaseStatus, setNewPhaseStatus] = useState('Not Started');

  const [showRiskModal, setShowRiskModal] = useState(false);
  const [newRiskName, setNewRiskName] = useState('');
  const [newRiskImpact, setNewRiskImpact] = useState('Medium');
  const [newRiskProbability, setNewRiskProbability] = useState('Medium');
  const [newRiskMitigation, setNewRiskMitigation] = useState('');

  // Filter selections
  // const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedDeptCompanyId, setSelectedDeptCompanyId] = useState<string>('');
  const [selectedReportsToPositionId, setSelectedReportsToPositionId] = useState<string>('');

  // Sidebar Hide & Notification states
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [selectedFilterProject, setSelectedFilterProject] = useState('All Projects');

  // Modals & form fields
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskObjectiveId, setNewTaskObjectiveId] = useState('');
  const [newTaskParentId, setNewTaskParentId] = useState('');
  const [newTaskProjectId, setNewTaskProjectId] = useState('');
  const [newTaskPhaseId, setNewTaskPhaseId] = useState('');

  const [showTimesheetModal, setShowTimesheetModal] = useState(false);
  const [newTimesheetHours, setNewTimesheetHours] = useState(8);
  const [newTimesheetDate, setNewTimesheetDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTimesheetDesc, setNewTimesheetDesc] = useState('');
  const [newTimesheetTaskId, setNewTimesheetTaskId] = useState('');

  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [timesheetToRejectId, setTimesheetToRejectId] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState('');

  const [showHeadcountRequestModal, setShowHeadcountRequestModal] = useState(false);
  const [newRequestName, setNewRequestName] = useState('');
  const [newRequestType, setNewRequestType] = useState('Increase Headcount');
  const [newReqDeptId, setNewReqDeptId] = useState('');
  const [newReqCatalogId, setNewReqCatalogId] = useState('');
  const [newReqQty, setNewReqQty] = useState(1);
  const [newReqReason, setNewReqReason] = useState('');

  // Companies & departments modal
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [newCompanyCode, setNewCompanyCode] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');

  const [showDeptModal, setShowDeptModal] = useState(false);
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingDept, setEditingDept] = useState<any | null>(null);

  // Positions catalog modal
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [newCatalogCode, setNewCatalogCode] = useState('');
  const [newCatalogName, setNewCatalogName] = useState('');
  const [editingCatalog, setEditingCatalog] = useState<any | null>(null);

  // Headcount Quota Job Position modal
  const [showJobPositionModal, setShowJobPositionModal] = useState(false);
  const [newJobPosName, setNewJobPosName] = useState('');
  const [newJobPosDeptId, setNewJobPosDeptId] = useState('');
  const [newJobPosCatalogId, setNewJobPosCatalogId] = useState('');
  const [newJobPosQuota, setNewJobPosQuota] = useState(1);
  const [editingJobPosition, setEditingJobPosition] = useState<any | null>(null);

  // Role assignment modal
  const [showAssignRoleModal, setShowAssignRoleModal] = useState(false);
  const [assignRoleUserId, setAssignRoleUserId] = useState('');
  const [assignRoleName, setAssignRoleName] = useState('Employee');
  const [assignRoleNotes, setAssignRoleNotes] = useState('');

  // Employee details dialog
  const [selectedDirectoryUser, setSelectedDirectoryUser] = useState<User | null>(null);

  // Redirect role gates
  useEffect(() => {
    if (activeRole === 'Employee') {
      const allowed = ['dashboard', 'tasks', 'timesheets', 'kpi', 'performance'];
      if (!allowed.includes(activeTab)) {
        setActiveTab('dashboard');
      }
    } else if (activeRole === 'ProjectManager') {
      const allowed = ['dashboard', 'tasks', 'timesheets', 'kpi', 'performance', 'resources', 'directory'];
      if (!allowed.includes(activeTab)) {
        setActiveTab('dashboard');
      }
    }
  }, [activeRole, activeTab]);

  // Fetch from Dataverse
  const fetchLiveValues = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);

      // 1. Fetch current user context
      let authenticatedEmail = '';
      let authenticatedName = '';
      try {
        const context = await getContext();
        authenticatedEmail = context.user.userPrincipalName || '';
        authenticatedName = context.user.fullName || '';
      } catch (err) {
        console.error("SDK getContext failed: ", err);
        throw new Error("Ứng dụng chỉ hoạt động trong Power Apps Host. Vui lòng mở từ Power Apps Portal hoặc link Local Play.");
      }

      if (!authenticatedEmail) {
        throw new Error("Không xác thực được danh tính người dùng (thiếu email trong context).");
      }

      setCurrentUserEmail(authenticatedEmail);
      setCurrentUserName(authenticatedName || authenticatedEmail.split('@')[0]);

      // 2. Fetch all tables from Dataverse services (isolated - one failure won't block others)
      const safeGet = async <T,>(fn: () => Promise<{ data?: T[] }>): Promise<T[]> => {
        try { return (await fn()).data || []; }
        catch (e) { console.warn('Dataverse fetch failed:', e); return []; }
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
        rawProjectRisks
      ] = await Promise.all([
        safeGet<User>(Cr5db_usersService.getAll),
        safeGet(Cr5db_departmentsService.getAll),
        safeGet(Cr5db_tasksService.getAll),
        safeGet(Cr5db_headcountrequestsService.getAll),
        safeGet(Cr5db_kpitargetsService.getAll),
        safeGet(Cr5db_timesheetlogsService.getAll),
        safeGet(Cr5db_projectsService.getAll),
        safeGet(Cr5db_performanceappraisalsService.getAll),
        safeGet(Cr5db_companiesService.getAll),
        safeGet(Cr5db_positioncatalogsService.getAll),
        safeGet(Cr5db_jobpositionsService.getAll),
        safeGet(Cr5db_audittraillogsService.getAll),
        safeGet(Cr5db_resourceallocationsService.getAll),
        safeGet(Cr5db_objectivesService.getAll),
        safeGet(Cr5db_systemnotificationsService.getAll),
        safeGet(Cr5db_projectphasesService.getAll),
        safeGet(Cr5db_projectrisksService.getAll)
      ]);

      // Wrap into response-shaped objects where downstream code needs them
      const tasksResponse = { data: rawTasks };
      const headcountResponse = { data: rawHeadcount };
      const kpiResponse = { data: rawKpi };
      const timesheetsResponse = { data: rawTimesheets };
      const appraisalsResponse = { data: rawAppraisals };
      const allAllocations = rawAllocations;
      const allObjectives = rawObjectives;
      const allNotifications = rawNotifications;

      setUsersList(allUsers);
      setDepartmentsList(allDepts);
      setCompaniesList(allCompanies);
      setPositionCatalogList(allCatalogs);
      setJobPositionsList(allJobPositions as any);
      setAuditLogsList(allAuditLogs);
      setResourceAllocationsList(allAllocations);
      setObjectivesList(allObjectives);
      setProjects(rawProjects);
      setProjectPhases(rawProjectPhases);
      setProjectRisks(rawProjectRisks);
      setSystemNotifications(allNotifications);

      if (allDepts.length > 0) {
        setNewReqDeptId(allDepts[0].cr5db_departmentid);
        setNewJobPosDeptId(allDepts[0].cr5db_departmentid);
      }
      if (allUsers.length > 0) {
        setNewTaskAssigneeId(allUsers[0].cr5db_userid);
        setAssignRoleUserId(allUsers[0].cr5db_userid);
      }
      if (allCatalogs.length > 0) {
        setNewReqCatalogId(allCatalogs[0].cr5db_positioncatalogid);
        setNewJobPosCatalogId(allCatalogs[0].cr5db_positioncatalogid);
      }
      if (allCompanies.length > 0) {
        // setSelectedCompanyId(allCompanies[0].cr5db_companyid);
        setSelectedDeptCompanyId(allCompanies[0].cr5db_companyid);
      }

      // Check User Profile
      let userProfile = allUsers.find(u => u.cr5db_email?.toLowerCase() === authenticatedEmail.toLowerCase());
      if (!userProfile) {
        console.log(`Email '${authenticatedEmail}' not found. Auto-registering as Employee...`);
        try {
          const newUserName = authenticatedName || authenticatedEmail.split('@')[0];
          const createResult = await Cr5db_usersService.create({
            cr5db_fullname: newUserName,
            cr5db_email: authenticatedEmail,
            cr5db_systemrole: 'Employee',
            cr5db_isactive: true
          } as any);

          if (createResult.data) {
            const newUserRecord = createResult.data;
            allUsers.push(newUserRecord);
            setUsersList([...allUsers]);
            userProfile = newUserRecord;

            // Add to audit trail log
            await Cr5db_audittraillogsService.create({
              cr5db_logname: "User Auto-Registration",
              cr5db_actionexecuted: `Auto-registered new user ${newUserName} (${authenticatedEmail}) on first login`,
              cr5db_changedfromvalue: "None",
              cr5db_changedtovalue: "Role: Employee"
            } as any);
          } else {
            throw new Error("Không thể tạo mới tài khoản.");
          }
        } catch (regErr) {
          console.error("Auto-registration failed:", regErr);
          throw new Error(`Tài khoản email '${authenticatedEmail}' chưa được đăng ký và tự động đăng ký thất bại.`);
        }
      }

      // Role determination
      const systemRole = userProfile.cr5db_systemrole || '';
      const positionTitle = userProfile.cr5db_jobpositionname || '';
      const derived = getDerivedRole(positionTitle);
      const manual = systemRole ? normalizeRole(systemRole) : null;
      const effectiveRole = manual || derived || 'Employee';
      setActiveRole(effectiveRole);

      // Map Tasks
      const mappedTasks: Task[] = (tasksResponse.data || []).map(t => {
        const assignee = allUsers.find(u => u.cr5db_userid === t._cr5db_assigneeid_value);
        return {
          cr5db_taskid: t.cr5db_taskid,
          cr5db_taskname: t.cr5db_taskname,
          cr5db_description: t.cr5db_description || '',
          cr5db_status: t.statecode === 1 ? 'Completed' : 'In Progress',
          cr5db_assignee_email: assignee?.cr5db_email || '',
          cr5db_assignee_name: t.cr5db_assigneeidname || 'Chưa phân công',
          cr5db_project_name: t.cr5db_projectphaseidname || 'Dự án chung',
          cr5db_due_date: t.cr5db_duedate || '',
          _cr5db_parenttask_value: t._cr5db_parenttask_value || undefined,
          _cr5db_objectivename_value: t._cr5db_objectivename_value || undefined,
          createdbyname: t.createdbyname || '',
          _createdby_value: t._createdby_value || ''
        };
      });
      setTasks(mappedTasks);
      if (mappedTasks.length > 0) {
        setNewTimesheetTaskId(mappedTasks[0].cr5db_taskid);
      }

      // Map Headcount Requests
      const mappedHeadcount: HeadcountRequest[] = (headcountResponse.data || []).map(r => {
        const dept = allDepts.find(d => d.cr5db_departmentid === r._cr5db_department_value);
        let statusStr: 'Pending' | 'Approved' | 'Rejected' = 'Pending';
        if (r.cr5db_approvalstatus === 122650001) statusStr = 'Approved';
        else if (r.cr5db_approvalstatus === 122650002) statusStr = 'Rejected';
        return {
          cr5db_headcountrequestid: r.cr5db_headcountrequestid,
          cr5db_requestname: r.cr5db_requestname,
          cr5db_requesttype: r.cr5db_requesttype === 122650001 ? 'Decrease Headcount' : r.cr5db_requesttype === 122650002 ? 'New Position' : 'Increase Headcount',
          cr5db_departmentname: dept?.cr5db_departmentname || r.cr5db_departmentname || 'Chung',
          cr5db_positiontitle: r.cr5db_jobpositionname || 'Chức danh',
          cr5db_requestedquantity: r.cr5db_requestedquantity || 1,
          cr5db_reason: r.cr5db_reason || '',
          cr5db_approvalstatus: statusStr,
          cr5db_createddate: r.cr5db_createddate || ''
        };
      });
      setHeadcountRequests(mappedHeadcount);

      // Map KPIs
      const mappedKpis: KPITarget[] = (kpiResponse.data || []).map(k => {
        const employee = allUsers.find(u => u.cr5db_userid === k._cr5db_employeeid_value);
        return {
          cr5db_kpitargetid: k.cr5db_kpitargetid,
          cr5db_kpiname: k.cr5db_kpitarget1 || 'Mục tiêu KPI',
          cr5db_targetvalue: k.cr5db_targetvalue || 100,
          cr5db_actualvalue: k.cr5db_actualvalue || 0,
          cr5db_unit: '%',
          cr5db_weightpercentage: k.cr5db_weightpercentage || 0,
          cr5db_user_email: employee?.cr5db_email || '',
          cr5db_period: k.cr5db_parentobjectivename || 'Q2/2026',
          _cr5db_parentobjective_value: k._cr5db_parentobjective_value || undefined,
          _cr5db_employeeid_value: k._cr5db_employeeid_value || undefined
        };
      });
      setKpiTargets(mappedKpis);

      // Map Timesheets
      const mappedTimesheets = (timesheetsResponse.data || []).map(ts => {
        const user = allUsers.find(u => u.cr5db_userid === ts._cr5db_userid_value);
        return {
          cr5db_timesheetlogid: ts.cr5db_timesheetlogid,
          cr5db_timesheetlog1: ts.cr5db_timesheetlog1,
          cr5db_actualhoursworked: ts.cr5db_actualhoursworked || 0,
          cr5db_logdate: ts.cr5db_logdate || '',
          cr5db_taskname: ts.cr5db_taskidname || 'Nhiệm vụ chung',
          cr5db_username: ts.cr5db_useridname || user?.cr5db_fullname || 'Thành viên',
          cr5db_useremail: user?.cr5db_email || '',
          statecode: ts.statecode
        };
      });
      setTimesheets(mappedTimesheets);

      // Map Appraisals
      const mappedAppraisals = (appraisalsResponse.data || []).map(ap => {
        const employee = allUsers.find(u => u.cr5db_userid === ap._cr5db_employeeid_value);
        const evaluator = allUsers.find(u => u.cr5db_userid === ap._cr5db_evaluatorid_value);
        return {
          cr5db_performanceappraisalid: ap.cr5db_performanceappraisalid,
          cr5db_performanceappraisal1: ap.cr5db_performanceappraisal1,
          cr5db_finalscore: ap.cr5db_finalscore || 0,
          cr5db_selfscore: ap.cr5db_selfscore || 0,
          cr5db_employeename: ap.cr5db_employeeidname || employee?.cr5db_fullname || '',
          cr5db_employeeemail: employee?.cr5db_email || '',
          cr5db_evaluatorname: ap.cr5db_evaluatoridname || evaluator?.cr5db_fullname || '',
          cr5db_periodname: ap.cr5db_periodidname || 'Kỳ đánh giá'
        };
      });
      setAppraisals(mappedAppraisals);

    } catch (err: any) {
      console.error("Initialization error: ", err);
      setErrorMsg(err.message || "Lỗi khi kết nối Dataverse.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveValues();
  }, []);

  // CRUD API Calls

  // Tasks
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    try {
      setIsLoading(true);
      const currentUserRecord = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
      const assigneeId = currentUserRecord?.cr5db_userid || newTaskAssigneeId;
      const record = {
        cr5db_taskname: newTaskName,
        cr5db_description: newTaskDesc,
        cr5db_duedate: newTaskDueDate || new Date().toISOString().split('T')[0],
        "cr5db_AssigneeID@odata.bind": assigneeId ? `/cr5db_users(${assigneeId})` : undefined,
        "cr5db_ObjectiveName@odata.bind": newTaskObjectiveId ? `/cr5db_objectives(${newTaskObjectiveId})` : undefined,
        "cr5db_ParentTask@odata.bind": newTaskParentId ? `/cr5db_tasks(${newTaskParentId})` : undefined,
        "cr5db_ProjectPhaseID@odata.bind": newTaskPhaseId ? `/cr5db_projectphases(${newTaskPhaseId})` : undefined
      };
      await Cr5db_tasksService.create(record as any);
      setShowTaskModal(false);
      setNewTaskName('');
      setNewTaskDesc('');
      setNewTaskProjectId('');
      setNewTaskPhaseId('');
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể lưu công việc mới.");
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
      await Cr5db_timesheetlogsService.update(id, { statecode: 1 });
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể phê duyệt timesheet.");
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

  const handleAutoCalculateAppraisal = async (id: string, email: string) => {
    if (!email) return;
    const employeeKpis = kpiTargets.filter(k => k.cr5db_user_email.toLowerCase() === email.toLowerCase());
    let totalWeight = 0;
    let weightedScore = 0;
    employeeKpis.forEach(k => {
      const target = k.cr5db_targetvalue || 100;
      const actual = k.cr5db_actualvalue || 0;
      const weight = k.cr5db_weightpercentage || 0;
      const rate = target > 0 ? actual / target : 0;
      weightedScore += rate * weight;
      totalWeight += weight;
    });
    const suggested = totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 75;
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
      await Cr5db_timesheetlogsService.update(timesheetToRejectId, { statecode: 2 as any });
      
      const adminUser = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
      await Cr5db_audittraillogsService.create({
        cr5db_logname: "Timesheet Rejection",
        cr5db_actionexecuted: `Timesheet log ${timesheetToRejectId} rejected`,
        cr5db_changedfromvalue: "Status: Pending",
        cr5db_changedtovalue: `Reason: ${rejectionReason} | Rejected By: ${adminUser?.cr5db_fullname || currentUserEmail}`
      } as any);

      setShowRejectionModal(false);
      setRejectionReason('');
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi từ chối timesheet.");
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
    } catch (err) {
      console.error(err);
      alert("Không thể xóa công ty hoặc các phòng ban trực thuộc.");
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
    } catch (err) {
      console.error(err);
      alert("Không thể xóa phòng ban.");
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
    } catch (err) {
      console.error(err);
      alert("Không thể xóa chức danh.");
      setIsLoading(false);
    }
  };

  // Job Positions (Headcount)
  const handleAddJobPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobPosName.trim()) return;
    try {
      setIsLoading(true);
      if (editingJobPosition) {
        await Cr5db_jobpositionsService.update(editingJobPosition.cr5db_jobpositionid, {
          cr5db_positionname: newJobPosName,
          cr5db_headcountquota: Number(newJobPosQuota),
          "cr5db_Department@odata.bind": newJobPosDeptId ? `/cr5db_departments(${newJobPosDeptId})` : undefined,
          "cr5db_PositionCatalogTitle@odata.bind": newJobPosCatalogId ? `/cr5db_positioncatalogs(${newJobPosCatalogId})` : undefined,
          "cr5db_ReportsToPositionID@odata.bind": selectedReportsToPositionId ? `/cr5db_jobpositions(${selectedReportsToPositionId})` : undefined
        } as any);
      } else {
        await Cr5db_jobpositionsService.create({
          cr5db_positionname: newJobPosName,
          cr5db_headcountquota: Number(newJobPosQuota),
          "cr5db_Department@odata.bind": newJobPosDeptId ? `/cr5db_departments(${newJobPosDeptId})` : undefined,
          "cr5db_PositionCatalogTitle@odata.bind": newJobPosCatalogId ? `/cr5db_positioncatalogs(${newJobPosCatalogId})` : undefined,
          "cr5db_ReportsToPositionID@odata.bind": selectedReportsToPositionId ? `/cr5db_jobpositions(${selectedReportsToPositionId})` : undefined
        } as any);
      }
      setShowJobPositionModal(false);
      setEditingJobPosition(null);
      setNewJobPosName('');
      setNewJobPosQuota(1);
      setNewJobPosDeptId('');
      setNewJobPosCatalogId('');
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu job position.");
      setIsLoading(false);
    }
  };

  const handleDeleteJobPosition = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa job position này không?")) return;
    try {
      setIsLoading(true);
      await Cr5db_jobpositionsService.delete(id);
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể xóa job position.");
      setIsLoading(false);
    }
  };

  // Headcount Requests
  const handleAddHeadcountRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestName.trim() || !newReqReason.trim()) return;
    try {
      setIsLoading(true);
      const reqTypeVal = newRequestType === 'Decrease Headcount' ? 122650001 : newRequestType === 'New Position' ? 122650002 : 122650000;
      await Cr5db_headcountrequestsService.create({
        cr5db_requestname: newRequestName,
        cr5db_requestedquantity: Number(newReqQty),
        cr5db_reason: newReqReason,
        cr5db_approvalstatus: 122650000, // Pending
        cr5db_requesttype: reqTypeVal,
        cr5db_createddate: new Date().toISOString().split('T')[0],
        "cr5db_Department@odata.bind": newReqDeptId ? `/cr5db_departments(${newReqDeptId})` : undefined,
        "cr5db_PositionCatalog@odata.bind": newReqCatalogId ? `/cr5db_positioncatalogs(${newReqCatalogId})` : undefined
      } as any);
      setShowHeadcountRequestModal(false);
      setNewRequestName('');
      setNewReqReason('');
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo đề xuất headcount.");
      setIsLoading(false);
    }
  };

  const handleApproveHeadcountRequest = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      setIsLoading(true);
      const statusVal = status === 'Approved' ? 122650001 : 122650002;
      await Cr5db_headcountrequestsService.update(id, {
        cr5db_approvalstatus: statusVal as any
      });
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Thao tác duyệt headcount thất bại.");
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
      setIsLoading(true);
      const payload: any = {
        cr5db_fullname: employeeFullName,
        cr5db_email: employeeEmail,
        cr5db_systemrole: employeeRole,
        cr5db_isactive: employeeIsActive,
      };

      if (employeeJobPositionId) {
        payload["cr5db_JobPosition@odata.bind"] = `/cr5db_jobpositions(${employeeJobPositionId})`;
      } else {
        payload["cr5db_JobPosition@odata.bind"] = null;
      }

      if (editingEmployee) {
        // Update user
        await Cr5db_usersService.update(editingEmployee.cr5db_userid, payload);

        // Add to audit trail log
        const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
        await Cr5db_audittraillogsService.create({
          cr5db_logname: "Employee Update",
          cr5db_actionexecuted: `Updated employee ${editingEmployee.cr5db_fullname} (${employeeEmail})`,
          cr5db_changedfromvalue: editingEmployee.cr5db_systemrole || "None",
          cr5db_changedtovalue: `Updated By: ${activeUserObj?.cr5db_fullname || currentUserEmail} | Active: ${employeeIsActive} | Role: ${employeeRole}`
        } as any);
      } else {
        // Create user
        await Cr5db_usersService.create(payload);

        // Add to audit trail log
        const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
        await Cr5db_audittraillogsService.create({
          cr5db_logname: "Employee Creation",
          cr5db_actionexecuted: `Created new employee ${employeeFullName} (${employeeEmail})`,
          cr5db_changedfromvalue: "None",
          cr5db_changedtovalue: `Created By: ${activeUserObj?.cr5db_fullname || currentUserEmail} | Active: ${employeeIsActive} | Role: ${employeeRole}`
        } as any);
      }

      setShowEmployeeModal(false);
      setEditingEmployee(null);
      setEmployeeFullName('');
      setEmployeeEmail('');
      setEmployeeRole('Employee');
      setEmployeeJobPositionId('');
      setEmployeeIsActive(true);
      await fetchLiveValues();
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
      await Cr5db_usersService.update(user.cr5db_userid, {
        cr5db_isactive: newActiveState
      } as any);

      // Audit Log
      const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
      await Cr5db_audittraillogsService.create({
        cr5db_logname: "Employee Status Toggle",
        cr5db_actionexecuted: `Toggled employee ${user.cr5db_fullname} status to ${newActiveState ? "Active" : "Inactive"}`,
        cr5db_changedfromvalue: user.cr5db_isactive ? "Active" : "Inactive",
        cr5db_changedtovalue: `Toggled By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
      } as any);

      await fetchLiveValues();
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
      await Cr5db_usersService.delete(user.cr5db_userid);

      // Audit Log
      const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
      await Cr5db_audittraillogsService.create({
        cr5db_logname: "Employee Deletion",
        cr5db_actionexecuted: `Deleted employee ${user.cr5db_fullname} (${user.cr5db_email || 'No email'})`,
        cr5db_changedfromvalue: user.cr5db_systemrole || "None",
        cr5db_changedtovalue: `Deleted By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
      } as any);

      await fetchLiveValues();
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
        cr5db_status: projectStatus === 'Completed' ? 122650002 : projectStatus === 'In Progress' ? 122650001 : 122650000,
      };

      if (editingProject) {
        await Cr5db_projectsService.update(editingProject.cr5db_projectid, payload);
        
        // Audit log
        const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
        await Cr5db_audittraillogsService.create({
          cr5db_logname: "Project Update",
          cr5db_actionexecuted: `Updated project ${projectName}`,
          cr5db_changedfromvalue: editingProject.cr5db_projectname,
          cr5db_changedtovalue: `Updated By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
        } as any);
      } else {
        await Cr5db_projectsService.create(payload);

        // Audit log
        const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
        await Cr5db_audittraillogsService.create({
          cr5db_logname: "Project Creation",
          cr5db_actionexecuted: `Created new project ${projectName}`,
          cr5db_changedfromvalue: "None",
          cr5db_changedtovalue: `Created By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
        } as any);
      }

      setShowProjectModal(false);
      setEditingProject(null);
      setProjectName('');
      setProjectDesc('');
      setProjectStartDate('');
      setProjectEndDate('');
      setProjectStatus('Not Started');
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể lưu dự án.");
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn dự án này khỏi hệ thống?")) return;
    try {
      setIsLoading(true);
      const targetProj = projects.find(p => p.cr5db_projectid === id);
      await Cr5db_projectsService.delete(id);

      // Audit Log
      const activeUserObj = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
      await Cr5db_audittraillogsService.create({
        cr5db_logname: "Project Deletion",
        cr5db_actionexecuted: `Deleted project ${targetProj?.cr5db_projectname || id}`,
        cr5db_changedfromvalue: targetProj?.cr5db_projectname || "None",
        cr5db_changedtovalue: `Deleted By: ${activeUserObj?.cr5db_fullname || currentUserEmail}`
      } as any);

      await fetchLiveValues();
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
      const statusVal = newPhaseStatus === 'Completed' ? 122650002 : newPhaseStatus === 'In Progress' ? 122650001 : 122650000;
      await Cr5db_projectphasesService.create({
        cr5db_phasename: newPhaseName,
        cr5db_status: statusVal as any,
        "cr5db_ProjectID@odata.bind": `/cr5db_projects(${activeProjectDetails.cr5db_projectid})`
      } as any);

      setShowPhaseModal(false);
      setNewPhaseName('');
      setNewPhaseStatus('Not Started');
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể thêm giai đoạn dự án.");
      setIsLoading(false);
    }
  };

  const handleSaveRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProjectDetails || !newRiskName.trim()) return;
    try {
      setIsLoading(true);
      await Cr5db_projectrisksService.create({
        cr5db_riskname: newRiskName,
        cr5db_impact: newRiskImpact,
        cr5db_probability: newRiskProbability,
        cr5db_mitigationplan: newRiskMitigation,
        "cr5db_ProjectID@odata.bind": `/cr5db_projects(${activeProjectDetails.cr5db_projectid})`
      } as any);

      setShowRiskModal(false);
      setNewRiskName('');
      setNewRiskImpact('Medium');
      setNewRiskProbability('Medium');
      setNewRiskMitigation('');
      await fetchLiveValues();
    } catch (err) {
      console.error(err);
      alert("Không thể thêm rủi ro dự án.");
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

  const myTimesheets = timesheets.filter(ts => ts.cr5db_useremail.toLowerCase() === currentUserEmail.toLowerCase());
  const totalHoursThisWeek = myTimesheets.reduce((acc, curr) => acc + curr.cr5db_actualhoursworked, 0);
  const totalEntries = myTimesheets.length;
  const pendingCount = myTimesheets.filter(ts => ts.statecode === 0).length;
  const approvedCount = myTimesheets.filter(ts => ts.statecode === 1).length;
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
          data[name].actual += pos.cr5db_currentheadcount || 0;
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
  const totalActualCount = jobPositionsList.reduce((acc, curr) => acc + (curr.cr5db_currentheadcount || 0), 0);
  const overQuotaCount = jobPositionsList.filter(p => (p.cr5db_currentheadcount || 0) > (p.cr5db_headcountquota || 0)).length;
  const underQuotaCount = jobPositionsList.filter(p => (p.cr5db_currentheadcount || 0) < (p.cr5db_headcountquota || 0)).length;
  const pendingRequestCount = headcountRequests.filter(r => r.cr5db_approvalstatus === 'Pending').length;

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
                {activeRole === 'Admin' ? 'Super Admin' : activeRole === 'HRManager' ? 'HR Manager' : activeRole === 'ProjectManager' ? 'Project Manager' : 'Employee'}
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
            {/* Direct Close Button */}
            <button onClick={() => setIsSidebarHidden(true)} title="Ẩn menu" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dynamic Sidebar menu list */}
        <nav className="nav-list">
          <button onClick={() => setActiveTab('dashboard')} className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <span className="nav-icon"><DashboardIcon /></span>Dashboard
          </button>
          <button onClick={() => setActiveTab('tasks')} className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}>
            <span className="nav-icon"><TaskIcon /></span>My Tasks
          </button>
          <button onClick={() => setActiveTab('timesheets')} className={`nav-item ${activeTab === 'timesheets' ? 'active' : ''}`}>
            <span className="nav-icon"><ClockIcon /></span>Timesheets
          </button>
          <button onClick={() => setActiveTab('kpi')} className={`nav-item ${activeTab === 'kpi' ? 'active' : ''}`}>
            <span className="nav-icon"><TargetIcon /></span>My KPIs
          </button>
          {activeRole !== 'Employee' && (
            <button onClick={() => setActiveTab('performance')} className={`nav-item ${activeTab === 'performance' ? 'active' : ''}`}>
              <span className="nav-icon"><PerformanceIcon /></span>Performance
            </button>
          )}

          {(activeRole === 'ProjectManager' || activeRole === 'HRManager' || activeRole === 'Admin') && (
            <>
              <button onClick={() => setActiveTab('resources')} className={`nav-item ${activeTab === 'resources' ? 'active' : ''}`}>
                <span className="nav-icon"><ResourceIcon /></span>Resources
              </button>
              <button onClick={() => setActiveTab('directory')} className={`nav-item ${activeTab === 'directory' ? 'active' : ''}`}>
                <span className="nav-icon"><DirectoryIcon /></span>Directory
              </button>
            </>
          )}

          {(activeRole === 'HRManager' || activeRole === 'Admin') && (
            <>
              <button onClick={() => setActiveTab('companies')} className={`nav-item ${activeTab === 'companies' ? 'active' : ''}`}>
                <span className="nav-icon"><ShieldCheckIcon /></span>Companies
              </button>
              <button onClick={() => setActiveTab('positions')} className={`nav-item ${activeTab === 'positions' ? 'active' : ''}`}>
                <span className="nav-icon"><RequestIcon /></span>Catalog
              </button>
              <button onClick={() => setActiveTab('headcount')} className={`nav-item ${activeTab === 'headcount' ? 'active' : ''}`}>
                <span className="nav-icon"><ShieldIcon /></span>Headcount
              </button>
              <button onClick={() => setActiveTab('requests')} className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`}>
                <span className="nav-icon"><BellIcon /></span>Requests
              </button>
            </>
          )}
        </nav>
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
              {(activeRole === 'HRManager' || activeRole === 'Admin') ? (
                // HR / Admin Dashboard
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Headcount Overview</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>Organization quota monitoring and allocation health</p>
                  </div>

                  <div className="metrics-grid">
                    <div className="metric-card">
                      <span className="metric-value">{totalQuotaCount}</span>
                      <span className="metric-label">Total Quota</span>
                    </div>
                    <div className="metric-card">
                      <span className="metric-value">{totalActualCount}</span>
                      <span className="metric-label">Current Headcount</span>
                    </div>
                    <div className="metric-card" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                      <span className="metric-value">{overQuotaCount}</span>
                      <span className="metric-label">Over Quota</span>
                    </div>
                    <div className="metric-card" style={{ borderColor: '#E29E2E', color: '#E29E2E' }}>
                      <span className="metric-value">{underQuotaCount}</span>
                      <span className="metric-label">Under Quota</span>
                    </div>
                    <div className="metric-card" style={{ borderColor: '#742774', color: '#742774' }}>
                      <span className="metric-value">{pendingRequestCount}</span>
                      <span className="metric-label">Pending Approval</span>
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
                    <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Good morning, {currentUserName.trim().split(' ').pop() || currentUserName}!</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>Here's what's happening with your work this week</p>
                  </div>

                  {/* Overdue Task Banner */}
                  {filteredTasks.some(t => t.cr5db_status !== 'Completed' && t.cr5db_due_date && new Date(t.cr5db_due_date) < new Date()) && (
                    <div style={{ padding: '16px 20px', backgroundColor: '#FDF3F3', border: '1px solid var(--color-primary)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)' }}>Bạn đang có các công việc trễ hạn! Vui lòng hoàn thành sớm.</span>
                      <button onClick={() => setActiveTab('tasks')} className="btn-filled-2" style={{ padding: '6px 12px' }}>Xem công việc</button>
                    </div>
                  )}

                  <div className="metrics-grid">
                    <div className="metric-card" style={{ gap: '8px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--color-text)', display: 'flex', alignItems: 'center' }}><TaskIcon /></span>
                        <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700 }}>{filteredTasks.filter(t => t.cr5db_status !== 'Completed').length}</span>
                      </div>
                      <span className="metric-label" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Tasks Due Today</span>
                    </div>
                    <div className="metric-card" style={{ gap: '8px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--color-text)', display: 'flex', alignItems: 'center' }}><ClockIcon /></span>
                        <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700 }}>{totalHoursThisWeek.toFixed(1)}h</span>
                      </div>
                      <span className="metric-label" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Hours This Week</span>
                    </div>
                    <div className="metric-card" style={{ gap: '8px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--color-text)', display: 'flex', alignItems: 'center' }}><TargetIcon /></span>
                        <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700 }}>{kpiTargets.length}</span>
                      </div>
                      <span className="metric-label" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>KPIs On Track</span>
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
                          {activeRole === 'ProjectManager' ? pendingApprovalsTimesheets.length : pendingCount}
                        </span>
                      </div>
                      <span className="metric-label" style={{ fontSize: '12px', color: '#E29E2E', fontWeight: 500 }}>Pending Approvals</span>
                    </div>
                  </div>

                  <div className="features-grid">
                    <div className="feature-card" style={{ padding: '20px', minHeight: '150px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}><TaskIcon /></span>
                        <span className="feature-title" style={{ fontSize: '15px', fontWeight: 700 }}>My Tasks</span>
                      </div>
                      <span className="feature-desc" style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                        {tasks.filter(t => t.cr5db_assignee_email.toLowerCase() === currentUserEmail.toLowerCase()).length} total tasks, {filteredTasks.filter(t => t.cr5db_status !== 'Completed').length} upcoming
                      </span>
                      <button onClick={() => setActiveTab('tasks')} className="feature-link">View Tasks ➔</button>
                    </div>
                    <div className="feature-card" style={{ padding: '20px', minHeight: '150px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}><ClockIcon /></span>
                        <span className="feature-title" style={{ fontSize: '15px', fontWeight: 700 }}>Timesheets</span>
                      </div>
                      <span className="feature-desc" style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                        {totalEntries} entries logged this week
                      </span>
                      <button onClick={() => setActiveTab('timesheets')} className="feature-link">Log Time ➔</button>
                    </div>
                    <div className="feature-card" style={{ padding: '20px', minHeight: '150px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}><TargetIcon /></span>
                        <span className="feature-title" style={{ fontSize: '15px', fontWeight: 700 }}>My KPIs</span>
                      </div>
                      <span className="feature-desc" style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                        {kpiTargets.length} targets, {kpiTargets.filter(k => k.cr5db_actualvalue >= k.cr5db_targetvalue).length} on track
                      </span>
                      <button onClick={() => setActiveTab('kpi')} className="feature-link">View KPIs ➔</button>
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
                    <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#000000', lineHeight: '1.2' }}>Task Management</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 400, color: 'rgba(0, 0, 0, 0.7)' }}>
                      <span>Welcome, {currentUserName || 'User'}</span>
                      <span style={{ fontSize: '12px', fontWeight: 500, padding: '2px 8px', border: '1px solid #000000', borderRadius: '6px', color: '#000000', textTransform: 'capitalize' }}>
                        {activeRole === 'ProjectManager' ? 'Project Manager' : activeRole === 'HRManager' ? 'HR Manager' : activeRole === 'Admin' ? 'Super Admin' : 'Employee'}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowTaskModal(true)} 
                  className="new-task-btn"
                  style={{ height: '36px', borderRadius: '6px', border: 'none', padding: '8px 16px', fontWeight: 500, fontSize: '14px', backgroundColor: '#000000', color: '#ffffff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxSizing: 'border-box' }}
                >
                  <span>+</span> New Task
                </button>
              </div>

              {/* Info Banner (Alert) */}
              <div style={{ border: '1px solid #000000', borderRadius: '8px', padding: '16px', fontSize: '14px', fontWeight: 400, backgroundColor: '#ffffff', color: '#000000', boxSizing: 'border-box' }}>
                {activeRole === 'Employee' ? (
                  <span><strong>Employee View:</strong> Showing tasks assigned to you or created by you.</span>
                ) : (
                  <span><strong>Manager View:</strong> Showing all tasks for active project management.</span>
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
                    placeholder="Search tasks..."
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
                    <option value="All Projects">All Projects</option>
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
                      <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#000000', margin: 0 }}>No tasks found</h3>
                      <p style={{ fontSize: '14px', fontWeight: 400, color: 'rgba(0, 0, 0, 0.7)', margin: 0 }}>Create your first task...</p>
                    </div>
                  );
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {queryFiltered.map(t => (
                      <div key={t.cr5db_taskid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', border: '1px solid #000000', borderRadius: '8px', backgroundColor: '#ffffff', boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontWeight: 700, fontSize: '16px', color: '#000000' }}>{t.cr5db_taskname}</span>
                            <span style={{ fontSize: '12px', fontWeight: 500, padding: '2px 8px', border: '1px solid #000000', borderRadius: '6px', color: '#000000', backgroundColor: '#ffffff' }}>
                              {t.cr5db_project_name || 'No Project'}
                            </span>
                          </div>
                          <p style={{ fontSize: '14px', fontWeight: 400, color: 'rgba(0, 0, 0, 0.7)', margin: 0 }}>{t.cr5db_description}</p>
                          <span style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.7)' }}>
                            Hạn: {t.cr5db_due_date ? new Date(t.cr5db_due_date).toLocaleDateString('vi-VN') : 'Không giới hạn'} | Phân công: {t.cr5db_assignee_name}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: t.cr5db_status === 'Completed' ? '#107C41' : 'var(--color-primary)' }}>
                            {t.cr5db_status}
                          </span>
                          {t.cr5db_status !== 'Completed' && (
                            <button 
                              onClick={() => handleUpdateTaskStatus(t.cr5db_taskid, 'Completed')} 
                              style={{ height: '36px', borderRadius: '6px', border: '1px solid #000000', padding: '8px 16px', fontWeight: 500, fontSize: '14px', backgroundColor: 'transparent', color: '#000000', cursor: 'pointer', transition: 'background-color 0.2s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              Hoàn tất
                            </button>
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
                    <h2 style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1.2 }}>Timesheets</h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '2px' }}>Log and manage your work hours</p>
                  </div>
                </div>
                <button onClick={() => setShowTimesheetModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>+</span> Log Time
                </button>
              </div>

              {/* Metrics grid matching Image 3 */}
              <div className="metrics-grid">
                <div className="metric-card" style={{ gap: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    <span>This Week</span>
                  </div>
                  <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text)' }}>{totalHoursThisWeek.toFixed(1)}h</span>
                  <span className="metric-label" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{myTimesheets.length} entries logged</span>
                </div>
                <div className="metric-card" style={{ gap: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    <span>Pending</span>
                  </div>
                  <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700, color: '#E29E2E' }}>{pendingCount}</span>
                  <span className="metric-label" style={{ fontSize: '12px', color: '#E29E2E', fontWeight: 500 }}>Awaiting approval</span>
                </div>
                <div className="metric-card" style={{ gap: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>Approved</span>
                  </div>
                  <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700, color: '#107C41' }}>{approvedCount}</span>
                  <span className="metric-label" style={{ fontSize: '12px', color: '#107C41', fontWeight: 500 }}>This week</span>
                </div>
                <div className="metric-card" style={{ gap: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                    <span>Avg Daily</span>
                  </div>
                  <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text)' }}>{avgDaily}h</span>
                  <span className="metric-label" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Average per entry</span>
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
                  My Timesheets
                </button>
                {activeRole !== 'Employee' && (
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
                    Approvals
                  </button>
                )}
              </div>

              {activeTimesheetSubTab === 'my' ? (
                <div className="card-spec" style={{ padding: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>My Time Entries</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '2px', marginBottom: '24px' }}>
                    View and manage your logged work hours
                  </p>

                  {myTimesheets.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)' }}>No time entries yet</h4>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Start logging your work hours to track your time.</p>
                      </div>
                      <button onClick={() => setShowTimesheetModal(true)} className="btn-filled-3" style={{ fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span>+</span> Log Your First Entry
                      </button>
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                          <th style={{ padding: '12px' }}>Ngày log</th>
                          <th style={{ padding: '12px' }}>Nhiệm vụ</th>
                          <th style={{ padding: '12px' }}>Mô tả</th>
                          <th style={{ padding: '12px' }}>Số giờ</th>
                          <th style={{ padding: '12px' }}>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myTimesheets.map(ts => (
                          <tr key={ts.cr5db_timesheetlogid} style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <td style={{ padding: '12px' }}>{ts.cr5db_logdate ? new Date(ts.cr5db_logdate).toLocaleDateString('vi-VN') : ''}</td>
                            <td style={{ padding: '12px' }}>{ts.cr5db_taskname}</td>
                            <td style={{ padding: '12px' }}>{ts.cr5db_timesheetlog1}</td>
                            <td style={{ padding: '12px', fontWeight: 600 }}>{ts.cr5db_actualhoursworked}h</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{ color: ts.statecode === 1 ? '#107C41' : ts.statecode === 2 ? '#a80000' : '#E29E2E', fontWeight: 600 }}>
                                {ts.statecode === 1 ? 'Approved' : ts.statecode === 2 ? 'Rejected' : 'Pending'}
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
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>No timesheets awaiting review.</div>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '12px' }}>Nhân viên</th>
                            <th style={{ padding: '12px' }}>Ngày log</th>
                            <th style={{ padding: '12px' }}>Nhiệm vụ</th>
                            <th style={{ padding: '12px' }}>Mô tả</th>
                            <th style={{ padding: '12px' }}>Số giờ</th>
                            <th style={{ padding: '12px' }}>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingApprovalsTimesheets.map(ts => (
                            <tr key={ts.cr5db_timesheetlogid} style={{ borderBottom: '1px solid var(--color-border)' }}>
                              <td style={{ padding: '12px', fontWeight: 600 }}>{ts.cr5db_username}</td>
                              <td style={{ padding: '12px' }}>{ts.cr5db_logdate ? new Date(ts.cr5db_logdate).toLocaleDateString('vi-VN') : ''}</td>
                              <td style={{ padding: '12px' }}>{ts.cr5db_taskname}</td>
                              <td style={{ padding: '12px' }}>{ts.cr5db_timesheetlog1}</td>
                              <td style={{ padding: '12px', fontWeight: 600 }}>{ts.cr5db_actualhoursworked}h</td>
                              <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleApproveTimesheet(ts.cr5db_timesheetlogid)} className="btn-filled-2" style={{ padding: '4px 8px' }}>Duyệt</button>
                                <button onClick={() => { setTimesheetToRejectId(ts.cr5db_timesheetlogid); setShowRejectionModal(true); }} className="btn-filled-3" style={{ padding: '4px 8px', color: '#a80000' }}>Từ chối</button>
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

          {/* SCREEN 4: MY KPIs */}
          {activeTab === 'kpi' && (
            <div className="space-y-6 p-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', fontFamily: 'ui-sans-serif, system-ui, sans-serif', color: '#000000', backgroundColor: '#ffffff' }}>
              {/* Header section */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#000000', display: 'flex', alignItems: 'center' }}><TargetIcon /></span>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#000000', lineHeight: 1.2 }}>My KPIs</h1>
                  <p style={{ fontSize: '16px', color: '#000000', margin: '2px 0 0 0', fontWeight: 400 }}>View your assigned KPIs and track progress</p>
                </div>
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
                <>
                  {/* Metrics grid */}
                  <div className="metrics-grid">
                    <div className="metric-card" style={{ gap: '16px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--color-text)', display: 'flex', alignItems: 'center' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
                        </span>
                        <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700 }}>{kpiTargets.length}</span>
                      </div>
                      <span className="metric-label" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>KPI Targets</span>
                    </div>
                    <div className="metric-card" style={{ gap: '16px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#107C41', display: 'flex', alignItems: 'center' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        </span>
                        <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700, color: '#107C41' }}>
                          {kpiTargets.filter(k => k.cr5db_actualvalue >= k.cr5db_targetvalue).length}
                        </span>
                      </div>
                      <span className="metric-label" style={{ fontSize: '12px', color: '#107C41', fontWeight: 500 }}>On Track</span>
                    </div>
                    <div className="metric-card" style={{ gap: '16px', padding: '20px', borderColor: kpiTargets.filter(k => k.cr5db_actualvalue < k.cr5db_targetvalue && k.cr5db_actualvalue > 0).length > 0 ? '#E29E2E' : 'var(--color-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#E29E2E', display: 'flex', alignItems: 'center' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                        </span>
                        <span className="metric-value" style={{ fontSize: '28px', fontWeight: 700, color: '#E29E2E' }}>
                          {kpiTargets.filter(k => k.cr5db_actualvalue < k.cr5db_targetvalue && k.cr5db_actualvalue > 0).length}
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
                          {kpiTargets.filter(k => k.cr5db_actualvalue === 0).length}
                        </span>
                      </div>
                      <span className="metric-label" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Behind</span>
                    </div>
                  </div>

                  {/* Main content table card */}
                  <div className="card-spec" style={{ padding: '32px' }}>
                    {kpiTargets.length === 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center', gap: '12px' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-text-secondary)' }}><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)' }}>No KPI targets found</h4>
                          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Create your first KPI target to start tracking performance</p>
                        </div>
                      </div>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '14px 20px' }}>Mục tiêu KPI</th>
                            <th style={{ padding: '14px 20px' }}>Tỷ trọng</th>
                            <th style={{ padding: '14px 20px' }}>Mục tiêu</th>
                            <th style={{ padding: '14px 20px' }}>Thực tế</th>
                            <th style={{ padding: '14px 20px' }}>Đánh giá</th>
                          </tr>
                        </thead>
                        <tbody>
                          {kpiTargets.map(k => {
                            const rate = k.cr5db_targetvalue > 0 ? Math.min(100, Math.round((k.cr5db_actualvalue / k.cr5db_targetvalue) * 100)) : 0;
                            return (
                              <tr key={k.cr5db_kpitargetid} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '14px 20px', fontWeight: 600 }}>{k.cr5db_kpiname}</td>
                                <td style={{ padding: '14px 20px' }}>{k.cr5db_weightpercentage}%</td>
                                <td style={{ padding: '14px 20px' }}>{k.cr5db_targetvalue} {k.cr5db_unit}</td>
                                <td style={{ padding: '14px 20px' }}>{k.cr5db_actualvalue} {k.cr5db_unit}</td>
                                <td style={{ padding: '14px 20px' }}>
                                  <span style={{ fontWeight: 700, color: rate >= 80 ? '#107C41' : 'var(--color-primary)' }}>{rate}%</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Time Range Selection */}
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

                  {/* Date Range Indicator */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#000000', fontWeight: 500 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>Showing progress from May 1, 2026 to May 29, 2026</span>
                  </div>

                  {/* Chart Placeholder Card */}
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
                </>
              )}
            </div>
          )}

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
                  <button onClick={() => setActivePerformanceSubTab('team')} style={{ background: 'none', border: 'none', color: activePerformanceSubTab === 'team' ? 'var(--color-text)' : 'var(--color-text-secondary)', fontWeight: activePerformanceSubTab === 'team' ? 700 : 500, cursor: 'pointer', borderBottom: activePerformanceSubTab === 'team' ? '2px solid var(--color-text)' : 'none', padding: '4px 8px' }}>
                    Team Appraisals
                  </button>
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
                            <td style={{ padding: '14px 20px' }}>{ap.cr5db_selfscore}/100</td>
                            <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--color-primary)' }}>{ap.cr5db_finalscore}/100</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
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
                      const actual = pos.cr5db_currentheadcount || 0;
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
                  <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Headcount Requests</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Submit and approve headcount additions</p>
                </div>
                <button onClick={() => setShowHeadcountRequestModal(true)} className="btn-primary">+ New Request</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {headcountRequests.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed var(--color-border)', borderRadius: '8px', color: 'var(--color-text-secondary)' }}>
                    Chưa có đề xuất nào được tạo.
                  </div>
                ) : (
                  headcountRequests.map(r => (
                    <div key={r.cr5db_headcountrequestid} className="card-spec" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
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
                        <span style={{ fontSize: '13px', fontWeight: 700, color: r.cr5db_approvalstatus === 'Approved' ? '#107C41' : r.cr5db_approvalstatus === 'Rejected' ? '#a80000' : '#E29E2E' }}>
                          {r.cr5db_approvalstatus}
                        </span>
                        {r.cr5db_approvalstatus === 'Pending' && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleApproveHeadcountRequest(r.cr5db_headcountrequestid, 'Approved')} className="btn-filled-2">Duyệt</button>
                            <button onClick={() => handleApproveHeadcountRequest(r.cr5db_headcountrequestid, 'Rejected')} className="btn-filled-3">Từ chối</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SCREEN 10: RESOURCES */}
          {activeTab === 'resources' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Resource Planning</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Allocation metrics and team planning</p>
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
                    const groupName = a.cr5db_projectteamidname || 'Dự án khác / Chung';
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
                  const canManageProject = activeRole === 'Admin' || activeRole === 'HRManager' || activeRole === 'ProjectManager';
                  const canDeleteProject = activeRole === 'Admin';
                  
                  // Get active project team allocations (matched by project name or team name containing project name)
                  const getProjectAllocations = (projName: string) => {
                    return resourceAllocationsList.filter(a => {
                      const teamName = (a.cr5db_projectteamidname || '').toLowerCase();
                      const pName = projName.toLowerCase();
                      return teamName.includes(pName) || pName.includes(teamName);
                    });
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
                              const statusLabel = getProjectStatusLabel(p.cr5db_status || p.cr5db_projectstatus);
                              const statusStyle = getProjectStatusStyle(statusLabel);
                              
                              // Count phases
                              const phasesForProj = projectPhases.filter(ph => ph._cr5db_projectid_value === p.cr5db_projectid);
                              const completedPhases = phasesForProj.filter(ph => ph.cr5db_status === 122650002 || ph.statecode === 1).length;
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
                                          
                                          const statusStr = p.cr5db_status === 122650002 ? 'Completed' : p.cr5db_status === 122650001 ? 'In Progress' : 'Not Started';
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
                                  ...getProjectStatusStyle(getProjectStatusLabel(currentActiveProject.cr5db_status || currentActiveProject.cr5db_projectstatus))
                                }}>
                                  {getProjectStatusLabel(currentActiveProject.cr5db_status || currentActiveProject.cr5db_projectstatus)}
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
                                      const phStatus = ph.cr5db_status === 122650002 ? 'Completed' : ph.cr5db_status === 122650001 ? 'In Progress' : 'Not Started';
                                      const phStyle = getProjectStatusStyle(phStatus);
                                      return (
                                        <div key={ph.cr5db_projectphaseid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', border: '1px solid var(--color-border-light)', borderRadius: '6px', backgroundColor: '#ffffff' }}>
                                          <span style={{ fontSize: '13px', fontWeight: 600 }}>{ph.cr5db_phasename}</span>
                                          <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, ...phStyle }}>{phStatus}</span>
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
                                  risk._cr5db_projectid_value === currentActiveProject.cr5db_projectid ||
                                  risk._cr5db_project_value === currentActiveProject.cr5db_projectid ||
                                  risk.cr5db_projectid === currentActiveProject.cr5db_projectid ||
                                  risk._cr5db_projectid_value?.toLowerCase() === currentActiveProject.cr5db_projectid.toLowerCase()
                                );
                                if (risks.length === 0) {
                                  return <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontStyle: 'italic', padding: '6px' }}>Chưa ghi nhận rủi ro nào.</div>;
                                }
                                return (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {risks.map(r => {
                                      // probability percentage or string, impact level
                                      const impact = r.cr5db_impact || r.cr5db_impactlevel || 'Medium';
                                      const prob = r.cr5db_probability || r.cr5db_probabilitypercentage || 'Medium';
                                      const mitigation = r.cr5db_mitigationplan || 'Chưa lập phương án giảm thiểu.';
                                      
                                      const getBadgeColor = (val: string) => {
                                        if (val === 'High' || val === '122650000') return { backgroundColor: '#fde7e9', color: '#a80000' };
                                        if (val === 'Medium' || val === '122650001') return { backgroundColor: '#fffdf6', color: '#e29e2e' };
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
                                          <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: 0 }}>
                                            <strong>Phương án giảm thiểu:</strong> {mitigation}
                                          </p>
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
                {(activeRole === 'HRManager' || activeRole === 'Admin') && (
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

              {(activeRole === 'HRManager' || activeRole === 'Admin') && (
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
                </div>
              )}

              {activeDirectorySubTab === 'view' || !(activeRole === 'HRManager' || activeRole === 'Admin') ? (
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
                            <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, backgroundColor: u.cr5db_systemrole === 'Admin' ? '#fde7e9' : u.cr5db_systemrole === 'HRManager' ? '#dff6dd' : u.cr5db_systemrole === 'ProjectManager' ? '#d9effc' : '#f3f2f1', color: u.cr5db_systemrole === 'Admin' ? '#a80000' : u.cr5db_systemrole === 'HRManager' ? '#107c41' : u.cr5db_systemrole === 'ProjectManager' ? '#005a9e' : '#323130' }}>
                              {u.cr5db_systemrole || 'Employee'}
                            </span>
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
                                  setEmployeeRole(u.cr5db_systemrole || 'Employee');
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


        </div>
      </main>

      {/* Task Modal */}
      {showTaskModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'oklab(0 0 0 / 0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '550px', maxHeight: '503px', overflowY: 'auto', backgroundColor: '#ffffff', border: '1px solid #000000', borderRadius: '8px', padding: '24px', display: 'grid', gap: '16px', boxSizing: 'border-box', position: 'relative', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowTaskModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', width: '16px', height: '16px', opacity: 0.7, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
              title="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Header */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, lineHeight: '28px', color: '#000000', margin: 0 }}>Create New Task</h3>
            </div>

            {/* Form */}
            <form onSubmit={handleAddTask} style={{ display: 'grid', gap: '16px', margin: 0 }}>
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

              {/* Due Date & Assignee Card Row */}
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

                {/* Assignee Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, lineHeight: '14px', color: '#000000' }}>Assignee</label>
                  {(() => {
                    const currentUserRecord = usersList.find(u => u.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase());
                    const name = currentUserRecord?.cr5db_fullname || currentUserName || 'User';
                    const initials = name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
                    
                    return (
                      <div style={{ border: '1px solid #000000', borderRadius: '6px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxSizing: 'border-box', height: '56px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: '#000000', backgroundColor: '#ffffff' }}>
                          {initials}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 500, color: '#000000', lineHeight: '1.2' }}>{name}</span>
                          <span style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.7)', lineHeight: '1.2' }}>Assigned to you</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', width: '100%', marginTop: '8px' }}>
                <button 
                  type="submit" 
                  style={{ border: 'none', borderRadius: '6px', padding: '8px 16px', height: '36px', width: '485px', fontWeight: 500, fontSize: '14px', backgroundColor: '#000000', color: '#ffffff', cursor: 'pointer', boxSizing: 'border-box' }}
                >
                  Create Task
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowTaskModal(false)} 
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
            <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700 }}>Đề xuất bổ sung định biên</h3>
            <form onSubmit={handleAddHeadcountRequest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Lý do đề xuất</label>
                <textarea value={newReqReason} onChange={(e) => setNewReqReason(e.target.value)} className="input-spec" style={{ height: '70px', fontFamily: 'inherit' }} placeholder="Lý do..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowHeadcountRequestModal(false)} className="btn-filled-3">Hủy</button>
                <button type="submit" className="btn-primary">Gửi đề xuất</button>
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
                  <option value="ProjectManager">Project Manager</option>
                  <option value="HRManager">HR Manager</option>
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
                    <option value="ProjectManager">Project Manager</option>
                    <option value="HRManager">HR Manager</option>
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
                <select 
                  value={projectStatus} 
                  onChange={(e) => setProjectStatus(e.target.value)} 
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
              Thêm giai đoạn dự án
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
                    setNewPhaseName('');
                    setNewPhaseStatus('Not Started');
                  }} 
                  className="btn-filled-3"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-filled-2" style={{ backgroundColor: '#742774' }}>
                  Lưu giai đoạn
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
              Ghi nhận rủi ro dự án
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
                  Lưu rủi ro
                </button>
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
              {filteredTasks.some(t => t.cr5db_status !== 'Completed' && t.cr5db_due_date && new Date(t.cr5db_due_date) < new Date()) && (
                <div style={{ padding: '10px 12px', border: '1px solid var(--color-primary)', borderRadius: '6px', fontSize: '13px', backgroundColor: '#FDF3F3' }}>
                  <strong style={{ color: 'var(--color-primary)' }}>Trễ hạn:</strong> Bạn đang có công việc cần hoàn thành gấp.
                </div>
              )}
              {/* Timesheet Pending alert */}
              {activeRole === 'ProjectManager' && pendingApprovalsTimesheets.length > 0 && (
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

      {/* Floating Gear / Dev Role Switcher */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
        {!showRoleSwitcher ? (
          <button 
            onClick={() => setShowRoleSwitcher(true)}
            style={{
              width: '48px', height: '48px', borderRadius: '50%',
              backgroundColor: '#E29E2E', color: '#ffffff', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        ) : (
          <div style={{
            width: '280px', backgroundColor: '#ffffff', border: '1px solid var(--color-border)',
            borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>Dev Mode Role Switcher</span>
              <button onClick={() => setShowRoleSwitcher(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'var(--color-text-secondary)' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { role: 'Admin', label: 'Super Admin', desc: 'Full system access, role management' },
                { role: 'HRManager', label: 'HR Manager', desc: 'HR data, headcount, role management' },
                { role: 'ProjectManager', label: 'Project Manager', desc: 'Projects, team tasks, resources' },
                { role: 'Employee', label: 'Employee', desc: 'Own tasks, timesheets, KPIs' }
              ].map(r => (
                <button
                  key={r.role}
                  onClick={() => {
                    setActiveRole(r.role as any);
                    setShowRoleSwitcher(false);
                  }}
                  style={{
                    padding: '8px 12px', borderRadius: '4px', textAlign: 'left',
                    border: activeRole === r.role ? '2px solid var(--color-primary)' : '1px solid var(--color-border-light)',
                    backgroundColor: activeRole === r.role ? '#FAF9F9' : '#ffffff',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '2px'
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text)' }}>{r.label}</span>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>{r.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default App;
