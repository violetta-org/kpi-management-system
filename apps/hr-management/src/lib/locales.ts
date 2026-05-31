export type Language = 'vi' | 'en';

export const TRANSLATIONS = {
  vi: {
    appTitle: 'Task & KPI',
    language: {
      select: 'Ngôn ngữ / Language',
      vi: 'Tiếng Việt 🇻🇳',
      en: 'English 🇬🇧',
      toggle: 'Đổi sang Tiếng Anh'
    },
    sidebar: {
      dashboard: 'Bảng điều khiển',
      tasks: 'Công việc',
      timesheets: 'Bảng chấm công',
      kpi: 'KPI của tôi',
      performance: 'Đánh giá hiệu suất',
      companies: 'Công ty',
      positions: 'Danh mục chức danh',
      headcount: 'Định biên nhân sự',
      requests: 'Yêu cầu phê duyệt',
      directory: 'Danh bạ nhân viên',
      resources: 'Quản lý dự án',
      routes: 'Quy trình phê duyệt',
      kpiCatalog: 'Danh mục KPI',
      devPortal: 'Developer Portal'
    },
    common: {
      search: 'Tìm kiếm...',
      actions: 'Thao tác',
      edit: 'Sửa',
      delete: 'Xóa',
      save: 'Lưu',
      cancel: 'Hủy',
      status: 'Trạng thái',
      description: 'Mô tả',
      name: 'Tên',
      startDate: 'Ngày bắt đầu',
      endDate: 'Ngày kết thúc',
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
      loading: 'Đang nạp Power Apps & đồng bộ Dataverse...',
      error: 'Lỗi',
      confirm: 'Xác nhận',
      close: 'Đóng',
      yes: 'Có',
      no: 'Không',
      details: 'Chi tiết',
      reason: 'Lý do',
      saveChanges: 'Lưu thay đổi',
      add: 'Thêm mới',
      back: 'Quay lại',
      all: 'Tất cả'
    },
    dashboard: {
      title: 'Tổng quan Định biên',
      subtitle: 'Giám sát chỉ tiêu định biên và tình trạng phân bổ nhân sự',
      totalQuota: 'Tổng định biên',
      currentHeadcount: 'Nhân sự hiện tại',
      overQuota: 'Vượt định biên',
      underQuota: 'Thiếu định biên',
      pendingApproval: 'Chờ phê duyệt'
    },
    tasks: {
      title: 'Công việc & Phân bổ',
      subtitle: 'Danh sách nhiệm vụ cá nhân và tình trạng thực hiện',
      addNew: 'Thêm công việc',
      taskName: 'Tên công việc',
      assignee: 'Người thực hiện',
      dueDate: 'Hạn hoàn thành',
      project: 'Dự án',
      status: 'Trạng thái',
      notStarted: 'Chưa bắt đầu',
      inProgress: 'Đang thực hiện',
      completed: 'Đã hoàn thành',
      noTasks: 'Không có công việc nào',
      parentTask: 'Công việc cha',
      objective: 'Mục tiêu',
      phase: 'Phân kỳ'
    },
    timesheets: {
      title: 'Timesheets',
      subtitle: 'Ghi nhận và phê duyệt giờ công làm việc',
      myTimesheets: 'Timesheets của tôi',
      approvals: 'Chờ tôi duyệt',
      logHours: 'Báo cáo giờ công',
      hoursWorked: 'Số giờ làm việc',
      date: 'Ngày thực hiện',
      description: 'Mô tả công việc',
      submit: 'Gửi Timesheet',
      approve: 'Phê duyệt',
      reject: 'Từ chối',
      rejectionReason: 'Lý do từ chối'
    },
    kpi: {
      title: 'KPI của tôi',
      subtitle: 'Theo dõi và đánh giá mục tiêu hiệu suất cá nhân',
      overview: 'Tổng quan',
      charts: 'Biểu đồ tiến trình',
      kpiName: 'Chỉ tiêu KPI',
      target: 'Mục tiêu',
      actual: 'Thực tế',
      unit: 'Đơn vị',
      weight: 'Tỷ trọng',
      completionRate: 'Tỷ lệ hoàn thành',
      period: 'Chu kỳ',
      objective: 'Mục tiêu chiến lược'
    },
    performance: {
      title: 'Đánh giá hiệu suất',
      subtitle: 'Quy trình tự đánh giá và quản lý đánh giá hiệu suất nhân sự',
      myAppraisals: 'Đánh giá của tôi',
      teamAppraisals: 'Đánh giá của đội ngũ',
      evaluationCycles: 'Chu kỳ đánh giá',
      finalScore: 'Điểm chung cuộc',
      selfScore: 'Tự chấm điểm',
      evaluator: 'Người đánh giá',
      autoCalc: 'Tự động tính điểm',
      addCycle: 'Thêm chu kỳ mới',
      assignAppraisal: 'Phát động đợt đánh giá',
      isLocked: 'Khóa chu kỳ'
    },
    companies: {
      title: 'Công ty & Phòng ban',
      subtitle: 'Quản lý cơ cấu tổ chức và các phòng ban trực thuộc',
      addNewCompany: 'Thêm công ty',
      addNewDept: 'Thêm phòng ban',
      companyCode: 'Mã công ty',
      companyName: 'Tên công ty',
      deptCode: 'Mã phòng ban',
      deptName: 'Tên phòng ban'
    },
    positions: {
      title: 'Danh mục chức danh',
      subtitle: 'Quản lý chức danh tiêu chuẩn của hệ thống',
      addNew: 'Thêm chức danh',
      code: 'Mã chức danh',
      positionCatalog: 'Chức danh'
    },
    headcount: {
      title: 'Định biên nhân sự',
      subtitle: 'Thiết lập định biên nhân sự cho từng phòng ban',
      addNew: 'Thêm định biên',
      jobPosition: 'Vị trí công việc',
      department: 'Phòng ban',
      quota: 'Chỉ tiêu định biên',
      currentHeadcount: 'Nhân sự thực tế'
    },
    requests: {
      title: 'Yêu cầu & Phê duyệt',
      subtitle: 'Quản lý các đề xuất thay đổi và yêu cầu tuyển dụng',
      changeRequests: 'Đề xuất thay đổi (Dataverse)',
      headcountRequests: 'Yêu cầu định biên / Tuyển dụng',
      requester: 'Người đề xuất',
      approver: 'Người phê duyệt',
      reason: 'Lý do đề xuất',
      details: 'Chi tiết thay đổi',
      entity: 'Thực thể',
      action: 'Hành động',
      approve: 'Phê duyệt',
      reject: 'Từ chối'
    },
    directory: {
      title: 'Danh bạ & Quản lý nhân viên',
      subtitle: 'Quản lý danh sách nhân sự và phân quyền truy cập',
      viewList: 'Xem danh bạ',
      managePersonnel: 'Quản lý nhân viên',
      groups: 'Nhóm phân quyền',
      fullName: 'Họ và tên',
      email: 'Email',
      systemRole: 'Vai trò hệ thống',
      status: 'Trạng thái',
      jobPosition: 'Vị trí công việc',
      addNew: 'Thêm nhân sự mới'
    },
    resources: {
      title: 'Quản lý dự án',
      subtitle: 'Lập kế hoạch dự án, phân kỳ và quản trị rủi ro',
      projectList: 'Danh sách dự án',
      allocations: 'Phân bổ nhân lực',
      projectName: 'Tên dự án',
      projectManager: 'Quản trị dự án',
      phases: 'Các phân kỳ',
      risks: 'Quản trị rủi ro',
      addNewProject: 'Thêm dự án',
      impact: 'Mức tác động',
      probability: 'Khả năng xảy ra',
      mitigation: 'Biện pháp giảm thiểu',
      allocationPercentage: 'Tỷ lệ phân bổ'
    },
    routes: {
      title: 'Quy tắc phê duyệt (Approval Routes)',
      subtitle: 'Cấu hình quy trình phê duyệt cho các thực thể',
      addNew: 'Thêm quy trình',
      routeName: 'Tên quy trình',
      targetEntity: 'Thực thể áp dụng',
      operation: 'Hành động',
      requesterRole: 'Vai trò người yêu cầu',
      routingType: 'Hình thức phê duyệt',
      approver: 'Người phê duyệt',
      priority: 'Độ ưu tiên'
    },
    kpiCatalog: {
      title: 'Danh mục KPI',
      subtitle: 'Quản lý thư viện chỉ số KPI tiêu chuẩn và mục tiêu chiến lược',
      library: 'Thư viện KPI tiêu chuẩn',
      objectives: 'Mục tiêu chiến lược',
      addNewKpi: 'Thêm KPI thư viện',
      addNewObjective: 'Thêm mục tiêu',
      formula: 'Công thức tính',
      unit: 'Đơn vị',
      objectiveName: 'Tên mục tiêu',
      targetScore: 'Điểm mục tiêu'
    }
  },
  en: {
    appTitle: 'Task & KPI',
    language: {
      select: 'Language / Ngôn ngữ',
      vi: 'Tiếng Việt 🇻🇳',
      en: 'English 🇬🇧',
      toggle: 'Switch to Vietnamese'
    },
    sidebar: {
      dashboard: 'Dashboard',
      tasks: 'My Tasks',
      timesheets: 'Timesheets',
      kpi: 'My KPIs',
      performance: 'Performance',
      companies: 'Companies',
      positions: 'Catalog',
      headcount: 'Headcount',
      requests: 'Requests',
      directory: 'Directory',
      resources: 'Resources',
      routes: 'Approval Routes',
      kpiCatalog: 'KPI Catalog',
      devPortal: 'Developer Portal'
    },
    common: {
      search: 'Search...',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      status: 'Status',
      description: 'Description',
      name: 'Name',
      startDate: 'Start Date',
      endDate: 'End Date',
      active: 'Active',
      inactive: 'Inactive',
      loading: 'Loading Power Apps & Dataverse Sync...',
      error: 'Error',
      confirm: 'Confirm',
      close: 'Close',
      yes: 'Yes',
      no: 'No',
      details: 'Details',
      reason: 'Reason',
      saveChanges: 'Save Changes',
      add: 'Add New',
      back: 'Back',
      all: 'All'
    },
    dashboard: {
      title: 'Headcount Overview',
      subtitle: 'Organization quota monitoring and allocation health',
      totalQuota: 'Total Quota',
      currentHeadcount: 'Current Headcount',
      overQuota: 'Over Quota',
      underQuota: 'Under Quota',
      pendingApproval: 'Pending Approval'
    },
    tasks: {
      title: 'Tasks & Allocations',
      subtitle: 'Personal tasks and execution status monitoring',
      addNew: 'Add Task',
      taskName: 'Task Name',
      assignee: 'Assignee',
      dueDate: 'Due Date',
      project: 'Project',
      status: 'Status',
      notStarted: 'Not Started',
      inProgress: 'In Progress',
      completed: 'Completed',
      noTasks: 'No tasks found',
      parentTask: 'Parent Task',
      objective: 'Objective',
      phase: 'Project Phase'
    },
    timesheets: {
      title: 'Timesheets',
      subtitle: 'Log and approve actual hours worked',
      myTimesheets: 'My Timesheets',
      approvals: 'Pending My Approvals',
      logHours: 'Log Hours',
      hoursWorked: 'Hours Worked',
      date: 'Log Date',
      description: 'Description',
      submit: 'Submit Timesheet',
      approve: 'Approve',
      reject: 'Reject',
      rejectionReason: 'Rejection Reason'
    },
    kpi: {
      title: 'My KPIs',
      subtitle: 'Track and evaluate personal performance metrics',
      overview: 'Overview',
      charts: 'Progress Charts',
      kpiName: 'KPI Metric',
      target: 'Target',
      actual: 'Actual',
      unit: 'Unit',
      weight: 'Weight',
      completionRate: 'Completion Rate',
      period: 'Period',
      objective: 'Strategic Objective'
    },
    performance: {
      title: 'Performance Reviews',
      subtitle: 'Self-appraisal and performance evaluation management',
      myAppraisals: 'My Appraisals',
      teamAppraisals: 'Team Appraisals',
      evaluationCycles: 'Evaluation Cycles',
      finalScore: 'Final Score',
      selfScore: 'Self Score',
      evaluator: 'Evaluator',
      autoCalc: 'Auto Calculate',
      addCycle: 'Add Cycle',
      assignAppraisal: 'Assign Appraisal',
      isLocked: 'Lock Cycle'
    },
    companies: {
      title: 'Companies & Departments',
      subtitle: 'Manage corporate structures and sub-departments',
      addNewCompany: 'Add Company',
      addNewDept: 'Add Department',
      companyCode: 'Company Code',
      companyName: 'Company Name',
      deptCode: 'Dept Code',
      deptName: 'Dept Name'
    },
    positions: {
      title: 'Position Catalog',
      subtitle: 'Standardize corporate positions and catalog codes',
      addNew: 'Add Title',
      code: 'Title Code',
      positionCatalog: 'Position Title'
    },
    headcount: {
      title: 'Headcount Quotas',
      subtitle: 'Establish department headcount quotas and constraints',
      addNew: 'Add Quota',
      jobPosition: 'Job Position',
      department: 'Department',
      quota: 'Headcount Quota',
      currentHeadcount: 'Current Headcount'
    },
    requests: {
      title: 'Yêu cầu & Phê duyệt',
      subtitle: 'Manage change requests and recruitment requests',
      changeRequests: 'Dataverse Change Requests',
      headcountRequests: 'Recruitment/Headcount Requests',
      requester: 'Requester',
      approver: 'Approver',
      reason: 'Reason',
      details: 'Change Details',
      entity: 'Entity',
      action: 'Action',
      approve: 'Approve',
      reject: 'Reject'
    },
    directory: {
      title: 'Employee Directory & Management',
      subtitle: 'Manage corporate personnel list and user access groups',
      viewList: 'View Directory',
      managePersonnel: 'Manage Personnel',
      groups: 'Permission Groups',
      fullName: 'Full Name',
      email: 'Email',
      systemRole: 'System Role',
      status: 'Status',
      jobPosition: 'Job Position',
      addNew: 'Add Personnel'
    },
    resources: {
      title: 'Resource Planning',
      subtitle: 'Project planning, phases, and risk management',
      projectList: 'Project List',
      allocations: 'Resource Allocations',
      projectName: 'Project Name',
      projectManager: 'Project Manager',
      phases: 'Project Phases',
      risks: 'Project Risks',
      addNewProject: 'Add Project',
      impact: 'Impact',
      probability: 'Probability',
      mitigation: 'Mitigation Plan',
      allocationPercentage: 'Allocation Percentage'
    },
    routes: {
      title: 'Approval Routes',
      subtitle: 'Configure dynamic multi-stage approval routings',
      addNew: 'Add Route',
      routeName: 'Route Name',
      targetEntity: 'Target Entity',
      operation: 'Operation',
      requesterRole: 'Requester Role',
      routingType: 'Routing Type',
      approver: 'Approver',
      priority: 'Priority'
    },
    kpiCatalog: {
      title: 'KPI Catalog',
      subtitle: 'Manage standard KPI Library and objectives',
      library: 'KPI Library',
      objectives: 'Strategic Objectives',
      addNewKpi: 'Add KPI',
      addNewObjective: 'Add Objective',
      formula: 'Formula',
      unit: 'Unit',
      objectiveName: 'Objective Name',
      targetScore: 'Target Score'
    }
  }
} as const;

export function getTranslation(keyString: string, lang: Language): string {
  const keys = keyString.split('.');
  let current: any = TRANSLATIONS[lang];
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      // Fallback to English if Vietnamese key is missing
      if (lang === 'vi') {
        return getTranslation(keyString, 'en');
      }
      return keyString; // Return path if not found
    }
  }
  return current;
}
