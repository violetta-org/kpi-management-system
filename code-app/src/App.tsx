import React, { useState } from 'react';
import './App.css';

// SVG Icon Components for clean Fluent appearance
const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
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
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const TargetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const DirectoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const PerformanceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
    <path d="M12 2a4 4 0 0 0-4 4v8h8V6a4 4 0 0 0-4-4z" />
  </svg>
);

const RequestIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const ResourceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// Type definitions based on Dataverse tables
interface User {
  cr5db_userid: string;
  cr5db_fullname: string;
  cr5db_email: string;
  cr5db_systemrole: 'Employee' | 'Project Manager' | 'HR Admin';
  cr5db_jobpositionname?: string;
  cr5db_isactive: boolean;
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
}

interface HeadcountRequest {
  cr5db_headcountrequestid: string;
  cr5db_requestname: string;
  cr5db_departmentname: string;
  cr5db_positiontitle: string;
  cr5db_requestedquantity: number;
  cr5db_reason: string;
  cr5db_approvalstatus: 'Pending' | 'Approved' | 'Rejected';
  cr5db_createddate: string;
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
}

function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'kpi' | 'headcount' | 'admin'>('dashboard');

  // RBAC Simulator Active User State
  const [activeRole, setActiveRole] = useState<'Employee' | 'Project Manager' | 'HR Admin'>('Project Manager'); // Default to PM (Manager) to match "Quân"
  const [currentUserEmail, setCurrentUserEmail] = useState('quan@company.com');
  const [currentUserName, setCurrentUserName] = useState('Quân');

  // Sample Mock Data (to support immediate local play without live Dataverse connection)
  const [users] = useState<User[]>([
    { cr5db_userid: 'u1', cr5db_fullname: 'Quân', cr5db_email: 'quan@company.com', cr5db_systemrole: 'Project Manager', cr5db_jobpositionname: 'Project Manager', cr5db_isactive: true },
    { cr5db_userid: 'u2', cr5db_fullname: 'Lê Văn A', cr5db_email: 'le.a@vibepower.com', cr5db_systemrole: 'Employee', cr5db_jobpositionname: 'Frontend Developer', cr5db_isactive: true },
    { cr5db_userid: 'u3', cr5db_fullname: 'Trần Văn C', cr5db_email: 'admin@vibepower.com', cr5db_systemrole: 'HR Admin', cr5db_jobpositionname: 'HR Director', cr5db_isactive: true }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { cr5db_taskid: 't1', cr5db_taskname: 'Xây dựng UI cho Module Đánh giá KPI', cr5db_description: 'Sử dụng React và Fluent CSS để tạo các widget trực quan hoá.', cr5db_status: 'In Progress', cr5db_assignee_email: 'quan@company.com', cr5db_assignee_name: 'Quân', cr5db_project_name: 'Quản lý Định biên', cr5db_due_date: '2026-06-15' },
    { cr5db_taskid: 't2', cr5db_taskname: 'Viết tài liệu tích hợp Code-First', cr5db_description: 'Tài liệu hướng dẫn chạy dev local và sử dụng Connection Reference.', cr5db_status: 'Completed', cr5db_assignee_email: 'quan@company.com', cr5db_assignee_name: 'Quân', cr5db_project_name: 'Quản lý Định biên', cr5db_due_date: '2026-05-30' },
    { cr5db_taskid: 't3', cr5db_taskname: 'Duyệt định biên đợt 1 phòng R&D', cr5db_description: 'Xem xét báo cáo nhu cầu bổ sung nhân sự của phòng R&D.', cr5db_status: 'Not Started', cr5db_assignee_email: 'quan@company.com', cr5db_assignee_name: 'Quân', cr5db_project_name: 'Định Biên R&D', cr5db_due_date: '2026-06-05' }
  ]);

  const [headcountRequests, setHeadcountRequests] = useState<HeadcountRequest[]>([
    { cr5db_headcountrequestid: 'h1', cr5db_requestname: 'Bổ sung Dev React Q2', cr5db_departmentname: 'R&D', cr5db_positiontitle: 'Frontend Developer', cr5db_requestedquantity: 2, cr5db_reason: 'Khối lượng dự án tăng nhanh cần bổ sung lực lượng.', cr5db_approvalstatus: 'Pending', cr5db_createddate: '2026-05-20' },
    { cr5db_headcountrequestid: 'h2', cr5db_requestname: 'Tuyển dụng PM AI', cr5db_departmentname: 'R&D', cr5db_positiontitle: 'AI Product Manager', cr5db_requestedquantity: 1, cr5db_reason: 'Phát triển các tính năng Generative AI.', cr5db_approvalstatus: 'Approved', cr5db_createddate: '2026-05-18' }
  ]);

  const [kpiTargets] = useState<KPITarget[]>([
    { cr5db_kpitargetid: 'k1', cr5db_kpiname: 'Tỷ lệ hoàn thành công việc', cr5db_targetvalue: 95, cr5db_actualvalue: 90, cr5db_unit: '%', cr5db_weightpercentage: 40, cr5db_user_email: 'quan@company.com', cr5db_period: 'Q2/2026' },
    { cr5db_kpitargetid: 'k2', cr5db_kpiname: 'Chất lượng code (Bugs/PR)', cr5db_targetvalue: 98, cr5db_actualvalue: 96, cr5db_unit: '%', cr5db_weightpercentage: 30, cr5db_user_email: 'quan@company.com', cr5db_period: 'Q2/2026' }
  ]);

  // Form states for creating items
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('quan@company.com');
  const [newTaskProject] = useState('Quản lý Định biên');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const [showHeadcountModal, setShowHeadcountModal] = useState(false);
  const [newRequestName, setNewRequestName] = useState('');
  const [newReqDept, setNewReqDept] = useState('R&D');
  const [newReqPos, setNewReqPos] = useState('Frontend Developer');
  const [newReqQty, setNewReqQty] = useState(1);
  const [newReqReason, setNewReqReason] = useState('');

  // Handle role switching simulation
  const handleRoleChange = (role: 'Employee' | 'Project Manager' | 'HR Admin') => {
    setActiveRole(role);
    if (role === 'Employee') {
      setCurrentUserEmail('le.a@vibepower.com');
      setCurrentUserName('Lê Văn A');
    } else if (role === 'Project Manager') {
      setCurrentUserEmail('quan@company.com');
      setCurrentUserName('Quân');
    } else {
      setCurrentUserEmail('admin@vibepower.com');
      setCurrentUserName('Trần Văn C');
    }
  };

  // Add a Task handler
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    const assignee = users.find(u => u.cr5db_email === newTaskAssignee);
    const task: Task = {
      cr5db_taskid: 't_' + Date.now(),
      cr5db_taskname: newTaskName,
      cr5db_description: newTaskDesc,
      cr5db_status: 'Not Started',
      cr5db_assignee_email: newTaskAssignee,
      cr5db_assignee_name: assignee ? assignee.cr5db_fullname : 'Unknown',
      cr5db_project_name: newTaskProject,
      cr5db_due_date: newTaskDueDate || new Date().toISOString().split('T')[0]
    };

    setTasks([...tasks, task]);
    setShowTaskModal(false);
    setNewTaskName('');
    setNewTaskDesc('');
  };

  // Add a Headcount Request handler
  const handleAddHeadcount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestName.trim()) return;

    const request: HeadcountRequest = {
      cr5db_headcountrequestid: 'h_' + Date.now(),
      cr5db_requestname: newRequestName,
      cr5db_departmentname: newReqDept,
      cr5db_positiontitle: newReqPos,
      cr5db_requestedquantity: Number(newReqQty),
      cr5db_reason: newReqReason,
      cr5db_approvalstatus: 'Pending',
      cr5db_createddate: new Date().toISOString().split('T')[0]
    };

    setHeadcountRequests([...headcountRequests, request]);
    setShowHeadcountModal(false);
    setNewRequestName('');
    setNewReqReason('');
  };

  // Action Handlers
  const handleApproveRequest = (id: string, status: 'Approved' | 'Rejected') => {
    setHeadcountRequests(headcountRequests.map(r => 
      r.cr5db_headcountrequestid === id ? { ...r, cr5db_approvalstatus: status } : r
    ));
  };

  const handleUpdateTaskStatus = (id: string, status: 'Not Started' | 'In Progress' | 'Completed') => {
    setTasks(tasks.map(t => 
      t.cr5db_taskid === id ? { ...t, cr5db_status: status } : t
    ));
  };

  // RBAC Filters
  const filteredTasks = tasks.filter(t => {
    if (activeRole === 'Employee') {
      return t.cr5db_assignee_email === currentUserEmail;
    }
    return true; // PM and Admin can see all
  });

  return (
    <div className="app-container">
      
      {/* 1. Sidebar Navigation - Exact Layout Match */}
      <aside className="app-sidebar">
        
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            {/* Logo matching screenshot (@ symbol / concentric circles) */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
            <div className="brand-details">
              <span className="brand-name">Task & KPI</span>
              <span className="brand-badge">
                {activeRole === 'HR Admin' ? 'Admin' : activeRole === 'Project Manager' ? 'Manager' : 'Employee'}
              </span>
            </div>
          </div>
          
          {/* Notification bell on top right of sidebar */}
          <button className="btn-tertiary" style={{ padding: '4px', display: 'flex', color: 'var(--color-text)' }}>
            <BellIcon />
          </button>
        </div>
        
        {/* Navigation list */}
        <nav className="nav-list">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <span className="nav-icon"><DashboardIcon /></span>
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('tasks')} 
            className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
          >
            <span className="nav-icon"><TaskIcon /></span>
            My Tasks
          </button>
          <button 
            onClick={() => setActiveTab('kpi')} 
            className={`nav-item ${activeTab === 'kpi' ? 'active' : ''}`}
          >
            <span className="nav-icon"><ClockIcon /></span>
            Timesheets
          </button>
          <button 
            onClick={() => setActiveTab('kpi')} 
            className={`nav-item ${activeTab === 'kpi' ? 'active' : ''}`}
          >
            <span className="nav-icon"><TargetIcon /></span>
            My KPIs
          </button>
          <button 
            onClick={() => setActiveTab('admin')} 
            className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
          >
            <span className="nav-icon"><DirectoryIcon /></span>
            Directory
          </button>
          <button 
            onClick={() => setActiveTab('kpi')} 
            className={`nav-item ${activeTab === 'kpi' ? 'active' : ''}`}
          >
            <span className="nav-icon"><PerformanceIcon /></span>
            Performance
          </button>
          <button 
            onClick={() => setActiveTab('headcount')} 
            className={`nav-item ${activeTab === 'headcount' ? 'active' : ''}`}
          >
            <span className="nav-icon"><RequestIcon /></span>
            Requests
          </button>
          <button 
            onClick={() => setActiveTab('admin')} 
            className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
          >
            <span className="nav-icon"><ResourceIcon /></span>
            Resources
          </button>
        </nav>
        
        {/* Footer Role Switcher */}
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            SIMULATE USER
          </span>
          <select 
            value={activeRole} 
            onChange={(e) => handleRoleChange(e.target.value as any)}
            style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="Project Manager">Manager (Quân)</option>
            <option value="Employee">Employee (Lê Văn A)</option>
            <option value="HR Admin">Admin (Trần Văn C)</option>
          </select>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="main-content">
        
        <div className="main-scroll-area">
          
          {/* SCREEN 1: DASHBOARD (MATCHES SCREENSHOT PRECISELY) */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Header Greeting */}
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
                  Good morning, {currentUserName}!
                </h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
                  Here's what's happening with your work this week
                </p>
              </div>

              {/* 4 Metrics Cards Grid */}
              <div className="metrics-grid">
                
                {/* Metric 1 */}
                <div className="metric-card">
                  <div className="metric-icon">
                    <TaskIcon />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className="metric-value">
                      {filteredTasks.filter(t => t.cr5db_status !== 'Completed').length}
                    </span>
                    <span className="metric-label">Tasks Due Today</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="metric-card">
                  <div className="metric-icon">
                    <ClockIcon />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className="metric-value">0.0h</span>
                    <span className="metric-label">Hours This Week</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="metric-card">
                  <div className="metric-icon">
                    <TargetIcon />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className="metric-value">
                      {kpiTargets.length}
                    </span>
                    <span className="metric-label">KPIs On Track</span>
                  </div>
                </div>

                {/* Metric 4 (yellowish tone badge for calendar as in screenshot) */}
                <div className="metric-card">
                  <div className="metric-icon" style={{ borderColor: '#E29E2E', color: '#E29E2E' }}>
                    <CalendarIcon />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className="metric-value">
                      {headcountRequests.filter(r => r.cr5db_approvalstatus === 'Pending').length}
                    </span>
                    <span className="metric-label">Pending Approvals</span>
                  </div>
                </div>

              </div>

              {/* 3 Features Cards Grid */}
              <div className="features-grid">
                
                {/* Feature 1: My Tasks */}
                <div className="feature-card">
                  <div className="feature-header">
                    <TaskIcon />
                    <span className="feature-title">My Tasks</span>
                  </div>
                  <span className="feature-desc">
                    {filteredTasks.length} total tasks. {filteredTasks.filter(t => t.cr5db_status !== 'Completed').length} upcoming
                  </span>
                  <button onClick={() => setActiveTab('tasks')} className="feature-link">
                    View Tasks ➔
                  </button>
                </div>

                {/* Feature 2: Timesheets */}
                <div className="feature-card">
                  <div className="feature-header">
                    <ClockIcon />
                    <span className="feature-title">Timesheets</span>
                  </div>
                  <span className="feature-desc">0 entries this week</span>
                  <button onClick={() => setActiveTab('kpi')} className="feature-link">
                    Log Time ➔
                  </button>
                </div>

                {/* Feature 3: My KPIs */}
                <div className="feature-card">
                  <div className="feature-header">
                    <TargetIcon />
                    <span className="feature-title">My KPIs</span>
                  </div>
                  <span className="feature-desc">
                    {kpiTargets.length} targets. {kpiTargets.length} on track
                  </span>
                  <button onClick={() => setActiveTab('kpi')} className="feature-link">
                    View KPIs ➔
                  </button>
                </div>

              </div>

              {/* Weekly Progress Card */}
              <div className="large-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Weekly Progress</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '4px' }}>May 25 - May 31, 2026</p>
                  </div>
                </div>
                
                {/* Placeholder progress visual */}
                <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--color-border)', borderRadius: '8px', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                  No active logs for this week period.
                </div>
              </div>

            </div>
          )}

          {/* SCREEN 2: TASKS */}
          {activeTab === 'tasks' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 700 }}>My Tasks</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
                    {activeRole === 'Employee' ? 'Chỉ hiển thị các công việc được giao cho bạn.' : 'Hiển thị toàn bộ công việc trong các dự án.'}
                  </p>
                </div>
                
                {/* PM & Admin can add Tasks */}
                {(activeRole === 'Project Manager' || activeRole === 'HR Admin') && (
                  <button onClick={() => setShowTaskModal(true)} className="btn-primary">
                    Giao công việc mới
                  </button>
                )}
              </div>

              {/* Task list outline layout */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredTasks.map(t => (
                  <div key={t.cr5db_taskid} className="card-spec" style={{ borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px' }}>{t.cr5db_taskname}</span>
                        <span style={{ fontSize: '11px', padding: '2px 8px', border: '1px solid var(--color-border)', borderRadius: '2px' }}>{t.cr5db_project_name}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{t.cr5db_description}</p>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Hạn: {t.cr5db_due_date} | Phân công: {t.cr5db_assignee_name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: t.cr5db_status === 'Completed' ? '#107C41' : 'var(--color-primary)' }}>
                        {t.cr5db_status}
                      </span>
                      {t.cr5db_status !== 'Completed' && (
                        <button onClick={() => handleUpdateTaskStatus(t.cr5db_taskid, 'Completed')} className="btn-filled-3">
                          Xong
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 3: KPI TARGETS */}
          {activeTab === 'kpi' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700 }}>My KPIs</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>Danh sách các chỉ tiêu hiệu suất thiết lập trong kỳ.</p>
              </div>

              <div className="card-spec" style={{ padding: '0px', overflow: 'hidden', borderRadius: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: '14px 20px', fontWeight: 600 }}>Chỉ tiêu KPI</th>
                      <th style={{ padding: '14px 20px', fontWeight: 600 }}>Tỷ trọng</th>
                      <th style={{ padding: '14px 20px', fontWeight: 600 }}>Mục tiêu</th>
                      <th style={{ padding: '14px 20px', fontWeight: 600 }}>Thực tế</th>
                      <th style={{ padding: '14px 20px', fontWeight: 600 }}>Tỷ lệ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kpiTargets.map(k => {
                      const achievementRate = Math.min(100, Math.round((k.cr5db_actualvalue / k.cr5db_targetvalue) * 100));
                      return (
                        <tr key={k.cr5db_kpitargetid} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '14px 20px', fontWeight: 600 }}>{k.cr5db_kpiname}</td>
                          <td style={{ padding: '14px 20px' }}>{k.cr5db_weightpercentage}%</td>
                          <td style={{ padding: '14px 20px' }}>{k.cr5db_targetvalue} {k.cr5db_unit}</td>
                          <td style={{ padding: '14px 20px' }}>{k.cr5db_actualvalue} {k.cr5db_unit}</td>
                          <td style={{ padding: '14px 20px' }}>
                            <span style={{ fontWeight: 700, color: achievementRate >= 95 ? '#107C41' : 'var(--color-primary)' }}>{achievementRate}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SCREEN 4: REQUESTS */}
          {activeTab === 'headcount' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Đề xuất định biên nhân sự</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>Duyệt đề xuất headcount của phòng ban.</p>
                </div>
                {(activeRole === 'Project Manager' || activeRole === 'HR Admin') && (
                  <button onClick={() => setShowHeadcountModal(true)} className="btn-primary">
                    Gửi đề xuất mới
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {headcountRequests.map(r => (
                  <div key={r.cr5db_headcountrequestid} className="card-spec" style={{ borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px' }}>{r.cr5db_requestname}</span>
                        <span style={{ fontSize: '11px', padding: '2px 8px', border: '1px solid var(--color-border)', borderRadius: '2px' }}>{r.cr5db_departmentname}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Vị trí: {r.cr5db_positiontitle} | Số lượng: {r.cr5db_requestedquantity}</p>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Mô tả: {r.cr5db_reason}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: r.cr5db_approvalstatus === 'Approved' ? '#107C41' : 'var(--color-primary)' }}>
                        {r.cr5db_approvalstatus}
                      </span>
                      {activeRole === 'HR Admin' && r.cr5db_approvalstatus === 'Pending' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleApproveRequest(r.cr5db_headcountrequestid, 'Approved')} className="btn-filled-2">Duyệt</button>
                          <button onClick={() => handleApproveRequest(r.cr5db_headcountrequestid, 'Rejected')} className="btn-filled-3">Từ chối</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 5: ADMIN / DIRECTORY */}
          {activeTab === 'admin' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Directory</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>Danh sách thành viên đồng bộ từ Dataverse.</p>
              </div>

              <div className="card-spec" style={{ padding: '0px', overflow: 'hidden', borderRadius: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF9F9', borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Họ tên</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Email</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Vị trí</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Vai trò</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.cr5db_userid} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{u.cr5db_fullname}</td>
                        <td style={{ padding: '12px 16px' }}>{u.cr5db_email}</td>
                        <td style={{ padding: '12px 16px' }}>{u.cr5db_jobpositionname}</td>
                        <td style={{ padding: '12px 16px' }}>{u.cr5db_systemrole}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700 }}>Giao việc (Create Task)</h3>
            <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tên công việc</label>
                <input type="text" value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} className="input-spec" required placeholder="Tên nhiệm vụ..." />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Mô tả</label>
                <textarea value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)} className="input-spec" style={{ height: '70px', fontFamily: 'inherit' }} placeholder="Mô tả công việc..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Người thực hiện</label>
                  <select value={newTaskAssignee} onChange={(e) => setNewTaskAssignee(e.target.value)} className="input-spec" style={{ height: '38px', padding: '6px 12px' }}>
                    {users.map(u => (
                      <option key={u.cr5db_userid} value={u.cr5db_email}>{u.cr5db_fullname}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Hạn hoàn thành</label>
                  <input type="date" value={newTaskDueDate} onChange={(e) => setNewTaskDueDate(e.target.value)} className="input-spec" style={{ height: '38px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowTaskModal(false)} className="btn-filled-3">Hủy</button>
                <button type="submit" className="btn-primary">Giao việc</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Headcount Modal */}
      {showHeadcountModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700 }}>Yêu cầu bổ sung định biên</h3>
            <form onSubmit={handleAddHeadcount} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tên đề xuất</label>
                <input type="text" value={newRequestName} onChange={(e) => setNewRequestName(e.target.value)} className="input-spec" required placeholder="Đề xuất bổ sung..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Phòng ban</label>
                  <select value={newReqDept} onChange={(e) => setNewReqDept(e.target.value)} className="input-spec" style={{ height: '38px', padding: '6px 12px' }}>
                    <option value="R&D">Nghiên cứu & Phát triển (R&D)</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">Nhân sự (HR)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Số lượng</label>
                  <input type="number" min={1} value={newReqQty} onChange={(e) => setNewReqQty(Number(e.target.value))} className="input-spec" style={{ height: '38px' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Chức danh tuyển dụng</label>
                <input type="text" value={newReqPos} onChange={(e) => setNewReqPos(e.target.value)} className="input-spec" required placeholder="Ví dụ: Frontend Developer..." />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Lý do tuyển dụng</label>
                <textarea value={newReqReason} onChange={(e) => setNewReqReason(e.target.value)} className="input-spec" style={{ height: '70px', fontFamily: 'inherit' }} placeholder="Lý do bổ sung..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowHeadcountModal(false)} className="btn-filled-3">Hủy</button>
                <button type="submit" className="btn-primary">Gửi đề xuất</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
