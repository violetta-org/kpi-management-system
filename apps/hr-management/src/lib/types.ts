export interface User {
  cr5db_userid: string;
  cr5db_fullname: string;
  cr5db_email?: string;
  cr5db_systemrole?: string;
  cr5db_jobpositionname?: string;
  cr5db_isactive?: boolean;
  _cr5db_jobposition_value?: string;
  ownerid?: string;
  owneridtype?: string;
}

export interface Task {
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
  _cr5db_projectphaseid_value?: string;
  _cr5db_assigneeid_value?: string;
  createdbyname?: string;
  _createdby_value?: string;
}

export interface HeadcountRequest {
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
  _cr5db_positioncatalog_value?: string;
  raw_requesttype?: number;
  raw_approvalstatus?: number;
}

export interface KPITarget {
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
  _cr5db_kpicode_value?: string;
}

export interface Company {
  cr5db_companyid: string;
  cr5db_companycode: string;
  cr5db_companyname: string;
}

export interface PositionCatalog {
  cr5db_positioncatalogid: string;
  cr5db_code?: string;
  cr5db_positioncatalog1: string;
}

export interface JobPosition {
  cr5db_jobpositionid: string;
  cr5db_positionname: string;
  _cr5db_department_value?: string;
  _cr5db_positioncatalogtitle_value?: string;
  _cr5db_reportstopositionid_value?: string;
  cr5db_headcountquota?: number;
  cr5db_currentheadcount?: number;
  cr5db_departmentname?: string;
}

export interface AuditLog {
  cr5db_audittraillogid: string;
  cr5db_logname: string;
  cr5db_actionexecuted?: string;
  cr5db_changedfromvalue?: string;
  cr5db_changedtovalue?: string;
  createdon?: string;
  createdbyname?: string;
}

export function normalizeRole(roleStr: string | undefined): 'Employee' | 'ProjectManager' | 'HRManager' | 'Admin' {
  if (!roleStr) return 'Employee';
  const norm = roleStr.toLowerCase().replace(/[^a-z]/g, '');
  if (norm.includes('superadmin') || norm === 'admin' || norm.includes('hradmin')) return 'Admin';
  if (norm.includes('hrmanager') || norm.includes('hr')) return 'HRManager';
  if (norm.includes('projectmanager') || norm.includes('pm') || norm.includes('manager')) return 'ProjectManager';
  return 'Employee';
}

export function getDerivedRole(positionTitle: string | undefined): 'Employee' | 'ProjectManager' | 'HRManager' | 'Admin' {
  if (!positionTitle) return 'Employee';
  const title = positionTitle.toLowerCase();
  if (title.includes('admin') || title.includes('administrator')) return 'Admin';
  if (title.includes('hr') || title.includes('human resource') || title.includes('recruiter')) return 'HRManager';
  if (title.includes('project lead') || title.includes('project manager') || title.includes('pm')) return 'ProjectManager';
  return 'Employee';
}
