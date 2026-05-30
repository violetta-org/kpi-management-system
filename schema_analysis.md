# 📊 Database Schema & Relationship Analysis

This report provides a detailed overview of the Dataverse tables, fields, and relationships generated for the **Quản lý Định biên Nhân sự** (Personnel Allocation & KPI Management) application.

## 1. Entity Overview

Below is the list of custom tables created in the solution:

| Table Logical Name | Display Name | Description |
| :--- | :--- | :--- |
| `cr5db_AppraisalKPIDetail` | **Appraisal KPI Detail** | This table contains detailed KPI scores and comments linked to Performance Appraisal and KPI Target. |
| `cr5db_ApprovalDelegation` | **Approval Delegation** | This table contains records of approval delegations between users |
| `cr5db_AuditTrailLog` | **Audit Trail Log** | This table contains audit trail logs of actions executed by users |
| `cr5db_Company` | **Company** | This table contains records of companies |
| `cr5db_Department` | **Department** | This table contains records of departments |
| `cr5db_EvaluationPeriod` | **Evaluation Period** | This table contains evaluation period details |
| `cr5db_HeadcountRequest` | **Headcount Request** | Manages headcount change requests across departments |
| `cr5db_JobPosition` | **Job Position** | This table contains records of job position details |
| `cr5db_KPIActualLog` | **KPI Actual Log** | This table contains actual KPI values logged with evidence and lookup references to KPI Target and Task. |
| `cr5db_KPILibrary` | **KPI Library** | This table contains KPI definitions including code, name, unit and formula. |
| `cr5db_KPITarget` | **KPI Target** | This table contains KPI target values with weights and lookup references to KPI Library, User, and Evaluation Period. |
| `cr5db_Objective` | **Objective** | This table contains objectives linked to projects and evaluation periods |
| `cr5db_PerformanceAppraisal` | **Performance Appraisal** | This table contains performance appraisal records with scores and lookup references to User and Evaluation Period. |
| `cr5db_PositionCatalog` | **Position Catalog** | This table contains records of position catalog details |
| `cr5db_Project` | **Project** | This table contains records of projects |
| `cr5db_ProjectIssue` | **Project Issue** | This table contains issues related to projects, tasks, and users |
| `cr5db_ProjectLabelAssignment` | **Project Label Assignment** | This table contains assignments of labels to projects |
| `cr5db_ProjectObjectiveAlignment` | **Project Objective Alignment** | This table serves as a many-to-many relationship between Project and Objective tables, capturing contribution percentages. |
| `cr5db_ProjectPhase` | **Project Phase** | This table contains records of project phases |
| `cr5db_ProjectRisk` | **Project Risk** | This table contains risks associated with projects |
| `cr5db_ProjectTeam` | **Project Team** | This table contains records of project teams |
| `cr5db_ResourceAllocation` | **Resource Allocation** | This table contains records of resource allocations |
| `cr5db_SystemLabel` | **System Label** | This table contains system label details |
| `cr5db_SystemNotification` | **System Notification** | This table contains system notifications sent to users |
| `cr5db_SystemParameter` | **System Parameter** | This table contains system parameters |
| `cr5db_SystemPolicyRule` | **System Policy Rule** | This table contains system policy rules |
| `cr5db_Task` | **Task** | This table contains tasks with descriptions, due dates, and relationships |
| `cr5db_TaskComment` | **Task Comment** | This table contains comments on tasks by users |
| `cr5db_TaskDependency` | **Task Dependency** | This table contains dependencies between tasks |
| `cr5db_TaskLabelAssignment` | **Task Label Assignment** | This table contains assignments of labels to tasks |
| `cr5db_TimesheetLog` | **Timesheet Log** | This table contains timesheet logs for tasks and users |
| `cr5db_User` | **User** | This table contains records of users |
| `cr5db_UserProjectRole` | **User Project Role** | This table contains records of user project roles |
| `new_RoleAssignment` | **Role Assignment** | Tracks role assignments to users with audit information |
| `new_SystemRole` | **System Role** | Defines system roles with hierarchy and permissions |
| `new_TaskOwnership` | **Task Ownership** | Tracks task ownership for filtering purposes |
| `new_TimesheetAudit` | **Timesheet Audit** | Stores timesheet approval and rejection audit trail information |

## 2. Entity-Relationship Model

These are the primary database relationships established between your custom tables:

| From Table (Referencing) | Relationship Type | To Table (Referenced) | Foreign Key Column |
| :--- | :--- | :--- | :--- |
| `cr5db_AppraisalKPIDetail` | OneToMany | `cr5db_KPITarget` | `cr5db_TargetId` |
| `cr5db_AppraisalKPIDetail` | OneToMany | `cr5db_PerformanceAppraisal` | `cr5db_AppraisalName` |
| `cr5db_Department` | OneToMany | `cr5db_Company` | `cr5db_CompanyID` |
| `cr5db_HeadcountRequest` | OneToMany | `cr5db_Department` | `cr5db_Department` |
| `cr5db_HeadcountRequest` | OneToMany | `cr5db_JobPosition` | `cr5db_ApproverPosition` |
| `cr5db_HeadcountRequest` | OneToMany | `cr5db_JobPosition` | `cr5db_JobPosition` |
| `cr5db_HeadcountRequest` | OneToMany | `cr5db_PositionCatalog` | `cr5db_PositionCatalog` |
| `cr5db_JobPosition` | OneToMany | `cr5db_Department` | `cr5db_Department` |
| `cr5db_JobPosition` | OneToMany | `cr5db_JobPosition` | `cr5db_ReportsToPositionID` |
| `cr5db_JobPosition` | OneToMany | `cr5db_PositionCatalog` | `cr5db_PositionCatalogTitle` |
| `cr5db_KPIActualLog` | OneToMany | `cr5db_KPITarget` | `cr5db_TargetId` |
| `cr5db_KPITarget` | OneToMany | `cr5db_KPILibrary` | `cr5db_KPICode` |
| `cr5db_KPITarget` | OneToMany | `cr5db_Objective` | `cr5db_ParentObjective` |
| `cr5db_KPITarget` | OneToMany | `cr5db_User` | `cr5db_EmployeeID` |
| `cr5db_Objective` | OneToMany | `cr5db_EvaluationPeriod` | `cr5db_PeriodName` |
| `cr5db_PerformanceAppraisal` | OneToMany | `cr5db_EvaluationPeriod` | `cr5db_PeriodID` |
| `cr5db_PerformanceAppraisal` | OneToMany | `cr5db_User` | `cr5db_EmployeeID` |
| `cr5db_PerformanceAppraisal` | OneToMany | `cr5db_User` | `cr5db_EvaluatorID` |
| `cr5db_ProjectIssue` | OneToMany | `cr5db_Task` | `cr5db_TaskID` |
| `cr5db_ProjectLabelAssignment` | OneToMany | `cr5db_SystemLabel` | `cr5db_LabelName` |
| `cr5db_ProjectObjectiveAlignment` | OneToMany | `cr5db_Objective` | `cr5db_Objective` |
| `cr5db_ProjectObjectiveAlignment` | OneToMany | `cr5db_Project` | `cr5db_Project` |
| `cr5db_ProjectPhase` | OneToMany | `cr5db_Project` | `cr5db_ProjectID` |
| `cr5db_ProjectTeam` | OneToMany | `cr5db_Project` | `cr5db_ProjectID` |
| `cr5db_ResourceAllocation` | OneToMany | `cr5db_ProjectTeam` | `cr5db_ProjectTeamID` |
| `cr5db_ResourceAllocation` | OneToMany | `cr5db_User` | `cr5db_UserID` |
| `cr5db_Task` | OneToMany | `cr5db_Objective` | `cr5db_ObjectiveName` |
| `cr5db_Task` | OneToMany | `cr5db_ProjectPhase` | `cr5db_ProjectPhaseID` |
| `cr5db_Task` | OneToMany | `cr5db_Task` | `cr5db_ParentTask` |
| `cr5db_Task` | OneToMany | `cr5db_User` | `cr5db_AssigneeID` |
| `cr5db_TaskComment` | OneToMany | `cr5db_Task` | `cr5db_TaskID` |
| `cr5db_TaskDependency` | OneToMany | `cr5db_Task` | `cr5db_PredecessorTask` |
| `cr5db_TaskDependency` | OneToMany | `cr5db_Task` | `cr5db_SuccessorTask` |
| `cr5db_TaskLabelAssignment` | OneToMany | `cr5db_SystemLabel` | `cr5db_LabelName` |
| `cr5db_TimesheetLog` | OneToMany | `cr5db_Task` | `cr5db_TaskID` |
| `cr5db_TimesheetLog` | OneToMany | `cr5db_User` | `cr5db_UserID` |
| `cr5db_User` | OneToMany | `cr5db_JobPosition` | `cr5db_JobPosition` |
| `cr5db_UserProjectRole` | OneToMany | `cr5db_ResourceAllocation` | `cr5db_AllocationID` |

## 3. Detailed Table Columns (Excluding System Fields)

### 📦 Appraisal KPI Detail (`cr5db_AppraisalKPIDetail`)
*This table contains detailed KPI scores and comments linked to Performance Appraisal and KPI Target.*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_AppraisalKPIDetail1` | `nvarchar` | Appraisal KPI Detail |   |
| `cr5db_AppraisalKPIDetailId` | `primarykey` | Appraisal KPI Detail |  Unique identifier for entity instances |
| `cr5db_AppraisalName` | `lookup` | Performance Appraisal |   |
| `cr5db_Comment` | `nvarchar` | Comment |   |
| `cr5db_ScoreAchieved` | `decimal` | Score Achieved |   |
| `cr5db_TargetId` | `lookup` | KPI Target |   |

---

### 📦 Approval Delegation (`cr5db_ApprovalDelegation`)
*This table contains records of approval delegations between users*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_ApprovalDelegationId` | `primarykey` | Approval Delegation |  Unique identifier for entity instances |
| `cr5db_DelegationName` | `nvarchar` | Delegation Name |   |

---

### 📦 Audit Trail Log (`cr5db_AuditTrailLog`)
*This table contains audit trail logs of actions executed by users*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_ActionExecuted` | `nvarchar` | Action Executed |   |
| `cr5db_AuditTrailLogId` | `primarykey` | Audit Trail Log |  Unique identifier for entity instances |
| `cr5db_ChangedFromValue` | `nvarchar` | Changed From Value |   |
| `cr5db_ChangedToValue` | `nvarchar` | Changed To Value |   |
| `cr5db_LogName` | `nvarchar` | Log Name |   |

---

### 📦 Company (`cr5db_Company`)
*This table contains records of companies*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_CompanyCode` | `nvarchar` | Company Code |  Mã định danh duy nhất của công ty (Ví dụ: VNX). Dùng làm key truy vấn |
| `cr5db_CompanyId` | `primarykey` | Company |  Unique identifier for entity instances |
| `cr5db_CompanyName` | `nvarchar` | Company Name |   |

---

### 📦 Department (`cr5db_Department`)
*This table contains records of departments*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_CompanyID` | `lookup` | Company |   |
| `cr5db_DepartmentCode` | `nvarchar` | Department Code |  Mã định danh duy nhất của phòng ban (Ví dụ: RND, MKT). Dùng làm key truy vấn |
| `cr5db_DepartmentId` | `primarykey` | Department |  Unique identifier for entity instances |
| `cr5db_DepartmentName` | `nvarchar` | Department Name |   |

---

### 📦 Evaluation Period (`cr5db_EvaluationPeriod`)
*This table contains evaluation period details*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_EndDate` | `datetime` | End Date |   |
| `cr5db_EvaluationPeriod1` | `nvarchar` | Evaluation Period |   |
| `cr5db_EvaluationPeriodId` | `primarykey` | Evaluation Period |  Unique identifier for entity instances |
| `cr5db_IsLocked` | `bit` | Is Locked |   |
| `cr5db_StartDate` | `datetime` | Start Date |   |

---

### 📦 Headcount Request (`cr5db_HeadcountRequest`)
*Manages headcount change requests across departments*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_ApprovalStatus` | `picklist` | Approval Status |   |
| `cr5db_ApproverPosition` | `lookup` | Approver Position |   |
| `cr5db_CreatedDate` | `datetime` | Created Date |   |
| `cr5db_Department` | `lookup` | Department |   |
| `cr5db_HeadcountRequestId` | `primarykey` | Headcount Request |  Unique identifier for entity instances |
| `cr5db_JobPosition` | `lookup` | Job Position |   |
| `cr5db_PositionCatalog` | `lookup` | Position Catalog |   |
| `cr5db_Reason` | `ntext` | Reason |   |
| `cr5db_RequestedQuantity` | `int` | Requested Quantity |   |
| `cr5db_RequestName` | `nvarchar` | Request Name |   |
| `cr5db_RequestType` | `picklist` | Request Type |   |

---

### 📦 Job Position (`cr5db_JobPosition`)
*This table contains records of job position details*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_CurrentHeadcount` | `int` | Current Headcount |  Số lượng nhân sự thực tế hiện tại đang giữ vị trí này (Hệ thống tự động đếm). |
| `cr5db_Department` | `lookup` | Department |  Phòng ban sở hữu vị trí định biên này |
| `cr5db_HeadcountQuota` | `int` | Headcount Quota |   |
| `cr5db_JobPositionId` | `primarykey` | Job Position |  Unique identifier for entity instances |
| `cr5db_PositionCatalogTitle` | `lookup` | Position Catalog |   |
| `cr5db_PositionName` | `nvarchar` | Position Name |   |
| `cr5db_ReportsToPositionID` | `lookup` | Reports To |  Vị trí cấp trên trực tiếp nhận báo cáo từ vị trí này (Dùng để chạy luồng phê duyệt tự động) |

---

### 📦 KPI Actual Log (`cr5db_KPIActualLog`)
*This table contains actual KPI values logged with evidence and lookup references to KPI Target and Task.*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_ActualValue` | `decimal` | Actual Value |   |
| `cr5db_EvidenceLink` | `nvarchar` | Evidence Link |   |
| `cr5db_KPIActualLog1` | `nvarchar` | KPI Actual Log |   |
| `cr5db_KPIActualLogId` | `primarykey` | KPI Actual Log |  Unique identifier for entity instances |
| `cr5db_TargetId` | `lookup` | KPI Target |   |

---

### 📦 KPI Library (`cr5db_KPILibrary`)
*This table contains KPI definitions including code, name, unit and formula.*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_Formula` | `nvarchar` | Formula |   |
| `cr5db_KPILibraryId` | `primarykey` | KPI Library |  Unique identifier for entity instances |
| `cr5db_KPIName` | `nvarchar` | KPI Name |   |
| `cr5db_Unit` | `nvarchar` | Unit |   |

---

### 📦 KPI Target (`cr5db_KPITarget`)
*This table contains KPI target values with weights and lookup references to KPI Library, User, and Evaluation Period.*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_ActualValue` | `decimal` | Actual Value |  Kết quả thực tế nhân sự đạt được, được đổ về từ các bản ghi nhật ký |
| `cr5db_EmployeeID` | `lookup` | Employee |  The employee this KPI target belongs to |
| `cr5db_KPIAchievementRate` | `decimal` | KPI Achievement Rate |  Tự động tính toán tỷ lệ % hoàn thành dựa trên Target và Actual |
| `cr5db_KPICode` | `lookup` | KPI Template |   |
| `cr5db_KPITarget1` | `nvarchar` | KPI Target |   |
| `cr5db_KPITargetId` | `primarykey` | KPI Target |  Unique identifier for entity instances |
| `cr5db_ParentObjective` | `lookup` | Parent Objective |  Khóa ngoại liên kết chỉ tiêu định lượng này trực thuộc Mục tiêu chiến lược nào. |
| `cr5db_TargetValue` | `decimal` | Target Value |   |
| `cr5db_WeightPercentage` | `int` | Weight Percentage |   |

---

### 📦 Objective (`cr5db_Objective`)
*This table contains objectives linked to projects and evaluation periods*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_Objective1` | `nvarchar` | Objective |   |
| `cr5db_ObjectiveId` | `primarykey` | Objective |  Unique identifier for entity instances |
| `cr5db_ObjectiveProgress` | `decimal` | Objective Progress |   |
| `cr5db_PeriodName` | `lookup` | Evaluation Period |   |
| `cr5db_TargetValue` | `decimal` | Target Value |   |

---

### 📦 Performance Appraisal (`cr5db_PerformanceAppraisal`)
*This table contains performance appraisal records with scores and lookup references to User and Evaluation Period.*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_EmployeeID` | `lookup` | Employee |  The employee being appraised |
| `cr5db_EvaluatorID` | `lookup` | Evaluator |  The manager/evaluator performing the appraisal |
| `cr5db_FinalScore` | `decimal` | Final Score |   |
| `cr5db_PerformanceAppraisal1` | `nvarchar` | Performance Appraisal |   |
| `cr5db_PerformanceAppraisalId` | `primarykey` | Performance Appraisal |  Unique identifier for entity instances |
| `cr5db_PeriodID` | `lookup` | Evaluation Period |  The evaluation period for this appraisal |
| `cr5db_SelfScore` | `decimal` | Self Score |   |

---

### 📦 Position Catalog (`cr5db_PositionCatalog`)
*This table contains records of position catalog details*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_Code` | `nvarchar` | Code |   |
| `cr5db_PositionCatalog1` | `nvarchar` | Position Catalog |   |
| `cr5db_PositionCatalogId` | `primarykey` | Position Catalog |  Unique identifier for entity instances |

---

### 📦 Project (`cr5db_Project`)
*This table contains records of projects*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_Description` | `nvarchar` | Description |   |
| `cr5db_EndDate` | `datetime` | End Date |   |
| `cr5db_ProjectId` | `primarykey` | Project |  Unique identifier for entity instances |
| `cr5db_ProjectName` | `nvarchar` | Project Name |   |
| `cr5db_StartDate` | `datetime` | Start Date |   |

---

### 📦 Project Issue (`cr5db_ProjectIssue`)
*This table contains issues related to projects, tasks, and users*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_Description` | `nvarchar` | Description |   |
| `cr5db_IssueTitle` | `nvarchar` | Issue Title |   |
| `cr5db_ProjectIssueId` | `primarykey` | Project Issue |  Unique identifier for entity instances |
| `cr5db_TaskID` | `lookup` | Task |   |

---

### 📦 Project Label Assignment (`cr5db_ProjectLabelAssignment`)
*This table contains assignments of labels to projects*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_LabelName` | `lookup` | System Label |   |
| `cr5db_ProjectLabelAssignment1` | `nvarchar` | Project Label Assignment |   |
| `cr5db_ProjectLabelAssignmentId` | `primarykey` | Project Label Assignment |  Unique identifier for entity instances |

---

### 📦 Project Objective Alignment (`cr5db_ProjectObjectiveAlignment`)
*This table serves as a many-to-many relationship between Project and Objective tables, capturing contribution percentages.*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_Objective` | `lookup` | Objective |   |
| `cr5db_Project` | `lookup` | Project |   |
| `cr5db_ProjectObjectiveAlignment1` | `nvarchar` | Project Objective Alignment |   |
| `cr5db_ProjectObjectiveAlignmentId` | `primarykey` | Project Objective Alignment |  Unique identifier for entity instances |

---

### 📦 Project Phase (`cr5db_ProjectPhase`)
*This table contains records of project phases*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_EndDate` | `datetime` | End Date |   |
| `cr5db_PhaseName` | `nvarchar` | Phase Name |   |
| `cr5db_ProjectID` | `lookup` | Project |   |
| `cr5db_ProjectPhaseId` | `primarykey` | Project Phase |  Unique identifier for entity instances |
| `cr5db_StartDate` | `datetime` | Start Date |   |

---

### 📦 Project Risk (`cr5db_ProjectRisk`)
*This table contains risks associated with projects*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_ImpactLevel` | `picklist` | Impact Level |   |
| `cr5db_ProbabilityPercentage` | `int` | Probability Percentage |   |
| `cr5db_ProjectRisk1` | `nvarchar` | Project Risk |   |
| `cr5db_ProjectRiskId` | `primarykey` | Project Risk |  Unique identifier for entity instances |

---

### 📦 Project Team (`cr5db_ProjectTeam`)
*This table contains records of project teams*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_ProjectID` | `lookup` | Project |   |
| `cr5db_ProjectTeamId` | `primarykey` | Project Team |  Unique identifier for entity instances |
| `cr5db_TeamName` | `nvarchar` | Team Name |   |

---

### 📦 Resource Allocation (`cr5db_ResourceAllocation`)
*This table contains records of resource allocations*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_AllocationPercentage` | `int` | Allocation Percentage |   |
| `cr5db_ProjectTeamID` | `lookup` | Project Team |   |
| `cr5db_ResourceAllocation1` | `nvarchar` | Resource Allocation |   |
| `cr5db_ResourceAllocationId` | `primarykey` | Resource Allocation |  Unique identifier for entity instances |
| `cr5db_UserID` | `lookup` | User |   |

---

### 📦 System Label (`cr5db_SystemLabel`)
*This table contains system label details*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_HexColor` | `nvarchar` | Hex Color |   |
| `cr5db_LabelGroup` | `nvarchar` | Label Group |   |
| `cr5db_SystemLabel1` | `nvarchar` | System Label |   |
| `cr5db_SystemLabelId` | `primarykey` | System Label |  Unique identifier for entity instances |

---

### 📦 System Notification (`cr5db_SystemNotification`)
*This table contains system notifications sent to users*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_Content` | `nvarchar` | Content |   |
| `cr5db_DeepLinkUrl` | `nvarchar` | Deep Link Url |   |
| `cr5db_IsRead` | `bit` | Is Read |   |
| `cr5db_SystemNotification1` | `nvarchar` | System Notification |   |
| `cr5db_SystemNotificationId` | `primarykey` | System Notification |  Unique identifier for entity instances |

---

### 📦 System Parameter (`cr5db_SystemParameter`)
*This table contains system parameters*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_ParamValue` | `nvarchar` | Param Value |   |
| `cr5db_SystemParameter1` | `nvarchar` | System Parameter |   |
| `cr5db_SystemParameterId` | `primarykey` | System Parameter |  Unique identifier for entity instances |
| `cr5db_ValueType` | `nvarchar` | Value Type |   |

---

### 📦 System Policy Rule (`cr5db_SystemPolicyRule`)
*This table contains system policy rules*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_ConstraintValue` | `nvarchar` | Constraint Value |   |
| `cr5db_ContextCondition` | `nvarchar` | Context Condition |   |
| `cr5db_Effect` | `nvarchar` | Effect |   |
| `cr5db_Operator` | `nvarchar` | Operator |   |
| `cr5db_SystemPolicyRule1` | `nvarchar` | System Policy Rule |   |
| `cr5db_SystemPolicyRuleId` | `primarykey` | System Policy Rule |  Unique identifier for entity instances |
| `cr5db_TargetEntity` | `nvarchar` | Target Entity |   |

---

### 📦 Task (`cr5db_Task`)
*This table contains tasks with descriptions, due dates, and relationships*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_AssigneeID` | `lookup` | Assignee |  The user assigned to this task |
| `cr5db_Description` | `nvarchar` | Description |   |
| `cr5db_DueDate` | `datetime` | Due Date |   |
| `cr5db_ObjectiveName` | `lookup` | Objective |   |
| `cr5db_ParentTask` | `lookup` | Task |   |
| `cr5db_ProjectPhaseID` | `lookup` | Project Phase |  The project phase this task belongs to |
| `cr5db_TaskId` | `primarykey` | Task |  Unique identifier for entity instances |
| `cr5db_TaskName` | `nvarchar` | Task Name |   |

---

### 📦 Task Comment (`cr5db_TaskComment`)
*This table contains comments on tasks by users*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_CommentText` | `nvarchar` | Comment Text |   |
| `cr5db_TaskComment1` | `nvarchar` | Task Comment |   |
| `cr5db_TaskCommentId` | `primarykey` | Task Comment |  Unique identifier for entity instances |
| `cr5db_TaskID` | `lookup` | Task |   |

---

### 📦 Task Dependency (`cr5db_TaskDependency`)
*This table contains dependencies between tasks*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_PredecessorTask` | `lookup` | Task |   |
| `cr5db_SuccessorTask` | `lookup` | Task1 |   |
| `cr5db_TaskDependency1` | `nvarchar` | Task Dependency |   |
| `cr5db_TaskDependencyId` | `primarykey` | Task Dependency |  Unique identifier for entity instances |

---

### 📦 Task Label Assignment (`cr5db_TaskLabelAssignment`)
*This table contains assignments of labels to tasks*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_LabelName` | `lookup` | System Label |   |
| `cr5db_TaskLabelAssignment1` | `nvarchar` | Task Label Assignment |   |
| `cr5db_TaskLabelAssignmentId` | `primarykey` | Task Label Assignment |  Unique identifier for entity instances |

---

### 📦 Timesheet Log (`cr5db_TimesheetLog`)
*This table contains timesheet logs for tasks and users*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_ActualHoursWorked` | `decimal` | Actual Hours Worked |   |
| `cr5db_LogDate` | `datetime` | Log Date |   |
| `cr5db_TaskID` | `lookup` | Task |   |
| `cr5db_TimesheetLog1` | `nvarchar` | Timesheet Log |   |
| `cr5db_TimesheetLogId` | `primarykey` | Timesheet Log |  Unique identifier for entity instances |
| `cr5db_UserID` | `lookup` | User |  The user this timesheet log belongs to |

---

### 📦 User (`cr5db_User`)
*This table contains records of users*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_Email` | `nvarchar` | Email |   |
| `cr5db_FullName` | `nvarchar` | Full Name |   |
| `cr5db_IsActive` | `bit` | Is Active |   |
| `cr5db_JobPosition` | `lookup` | Job Position |  Vị trí/Ghế định biên cụ thể mà nhân viên này đang đảm nhận |
| `cr5db_SystemRole` | `nvarchar` | System Role |  Global RBAC role: Employee, ProjectManager, HRManager, Admin |
| `cr5db_UserId` | `primarykey` | User |  Unique identifier for entity instances |

---

### 📦 User Project Role (`cr5db_UserProjectRole`)
*This table contains records of user project roles*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `cr5db_AllocationID` | `lookup` | Resource Allocation |   |
| `cr5db_RoleCode` | `nvarchar` | Role Code |   |
| `cr5db_RoleName` | `nvarchar` | Role Name |   |
| `cr5db_UserProjectRoleId` | `primarykey` | User Project Role |  Unique identifier for entity instances |

---

### 📦 Role Assignment (`new_RoleAssignment`)
*Tracks role assignments to users with audit information*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `new_AssignedBy` | `lookup` | Assigned By |   |
| `new_AssignedDate` | `datetime` | Assigned Date |   |
| `new_IsActive` | `bit` | Is Active |   |
| `new_Notes` | `nvarchar` | Notes |   |
| `new_RoleAssignmentId` | `primarykey` | Role Assignment |  Unique identifier for entity instances |
| `new_RoleAssignmentName` | `nvarchar` | Role Assignment Name |   |
| `new_SystemRole` | `lookup` | System Role |   |
| `new_User` | `lookup` | User |   |

---

### 📦 System Role (`new_SystemRole`)
*Defines system roles with hierarchy and permissions*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `new_IsActive` | `bit` | Is Active |   |
| `new_RoleCode` | `nvarchar` | Role Code |   |
| `new_RoleDescription` | `nvarchar` | Role Description |   |
| `new_RoleLevel` | `int` | Role Level |   |
| `new_RoleName` | `nvarchar` | Role Name |   |
| `new_SystemRoleId` | `primarykey` | System Role |  Unique identifier for entity instances |

---

### 📦 Task Ownership (`new_TaskOwnership`)
*Tracks task ownership for filtering purposes*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `new_AssigneeUserID` | `nvarchar` | Assignee User ID |   |
| `new_CreatedByUserID` | `nvarchar` | Created By User ID |   |
| `new_OwnershipName` | `nvarchar` | Ownership Name |   |
| `new_TaskID` | `nvarchar` | Task ID |   |
| `new_TaskOwnershipId` | `primarykey` | Task Ownership |  Unique identifier for entity instances |

---

### 📦 Timesheet Audit (`new_TimesheetAudit`)
*Stores timesheet approval and rejection audit trail information*

| Column Name | Type | Display Name | Target / Notes |
| :--- | :--- | :--- | :--- |
| `new_ApprovedAt` | `datetime` | Approved At |   |
| `new_ApprovedBy` | `nvarchar` | Approved By |   |
| `new_AuditRecordName` | `nvarchar` | Audit Record Name |   |
| `new_RejectionReason` | `nvarchar` | Rejection Reason |   |
| `new_Status` | `nvarchar` | Status |   |
| `new_TimesheetAuditId` | `primarykey` | Timesheet Audit |  Unique identifier for entity instances |
| `new_TimesheetLogID` | `nvarchar` | Timesheet Log ID |   |

---

## 4. Role-Based Access Control (RBAC) & Feature Analysis

### Current State:
*   **`cr5db_User` vs. System Users:** The system has a custom `cr5db_User` table representing employees, which is separate from the built-in Dataverse `SystemUser` table. This is common for HR databases, but means that logged-in users must be manually mapped to employee records.
*   **`cr5db_UserProjectRole`:** This table lists roles (e.g., `cr5db_RoleName`, `cr5db_RoleCode`), but it is linked via `cr5db_AllocationID` to `cr5db_ResourceAllocation` rather than directly to the User or Project. This means roles are allocated to *specific resource assignments* instead of being system-wide user permissions.
*   **CRUD Focus:** The current application structure has entities like `cr5db_Task`, `cr5db_KPITarget`, and `cr5db_TimesheetLog`. However, looking at the fields, **there are no direct columns restricting who can edit what**. Anyone with write access to the app has access to all records because data-level roles are not implemented in the application UI.

### Key Gaps and Recommendations for RBAC:

1.  **Task Assignee Missing:** The `cr5db_Task` table currently has **no column** linking it to `cr5db_User` (the employee). It only has standard Dataverse owners (`OwnerId` which points to `SystemUser` or `Team`). If you want tasks to be assigned to specific employees in your custom user table, you need to add a lookup column `cr5db_AssigneeID` pointing to `cr5db_User`.
2.  **Role Definition:** You should define clear system roles (e.g., `Employee`, `ProjectManager`, `HRManager`, `SystemAdmin`) in a centralized table and associate logged-in Microsoft Entra ID accounts (via email mapping) to these roles.
3.  **Filtered Views (UI-Level Security):** The Canvas app should filter records based on the active user's role:
    *   *Employees* should only see and edit their own `cr5db_Task` records (where `cr5db_AssigneeID` matches their user record) and log their own `cr5db_TimesheetLog`.
    *   *Project Managers* should be able to create tasks and approve timesheets for their projects.
    *   *HR/Directors* should see high-level KPI dashboards (`cr5db_PerformanceAppraisal`, `cr5db_KPITarget`).
4.  **Security Roles in Dataverse (Data-Level Security):** Create custom Security Roles in the Power Platform Admin Center (e.g. 'Project Member', 'Project Manager') and set Table Permissions (Read, Write, Create) using Owner-based or User-based access levels so that Dataverse itself enforces security, blocking unauthorized CRUD operations even if someone accesses the API directly.
