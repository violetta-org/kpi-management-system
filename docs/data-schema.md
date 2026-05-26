# Headcount Management System - Data Schema Documentation

This document provides a comprehensive overview of all data tables, their columns, relationships, and data types used in the Headcount Management System.

---

## Table of Contents

1. [Organization Structure](#organization-structure)
   - [Company](#company)
   - [Department](#department)
   - [Position Catalog](#position-catalog)
   - [Job Position](#job-position)
2. [User Management](#user-management)
   - [User](#user)
   - [System Role](#system-role)
   - [Role Assignment](#role-assignment)
3. [Headcount & Requests](#headcount--requests)
   - [Headcount Request](#headcount-request)
4. [Project Management](#project-management)
   - [Project](#project)
   - [Project Phase](#project-phase)
   - [Project Team](#project-team)
   - [Project Risk](#project-risk)
   - [Project Issue](#project-issue)
   - [Project Label Assignment](#project-label-assignment)
   - [Project Objective Alignment](#project-objective-alignment)
5. [Task Management](#task-management)
   - [Task](#task)
   - [Task Comment](#task-comment)
   - [Task Dependency](#task-dependency)
   - [Task Label Assignment](#task-label-assignment)
6. [Time Tracking](#time-tracking)
   - [Timesheet Log](#timesheet-log)
   - [Timesheet Audit](#timesheet-audit)
7. [Performance & KPIs](#performance--kpis)
   - [Objective](#objective)
   - [KPI Library](#kpi-library)
   - [KPI Target](#kpi-target)
   - [KPI Actual Log](#kpi-actual-log)
   - [Performance Appraisal](#performance-appraisal)
8. [Resource Management](#resource-management)
   - [Resource Allocation](#resource-allocation)
   - [User Project Role](#user-project-role)
9. [System Configuration](#system-configuration)
   - [System Label](#system-label)
   - [System Notification](#system-notification)
   - [System Parameter](#system-parameter)
   - [System Policy Rule](#system-policy-rule)

---

## Data Types Reference

| Type | Description |
|------|-------------|
| `UniqueId` | GUID/UUID primary key |
| `Text` | Single line text (max 850 chars) |
| `MultipleLinesText` | Multi-line text field |
| `WholeNumber` | Integer value |
| `Decimal` | Decimal number |
| `YesNo` | Boolean (true/false) |
| `DateOnly` | Date without time |
| `DateAndTime` | Date with time |
| `Email` | Email address format |
| `Choice` | Picklist/Option set |
| `Lookup` | Foreign key reference |

---

## Organization Structure

### Company

**Table Name:** `cr5db_company`  
**Display Name:** Company  
**Description:** This table contains records of companies

| Column | Display Name | Type | Required | Description |
|--------|--------------|------|----------|-------------|
| `cr5db_company_id` | Company ID | UniqueId | ✅ | Primary key |
| `cr5db_company_code` | Company Code | Text | ✅ | Unique identifier code (e.g., VNX) |
| `cr5db_company_name` | Company Name | Text | ✅ | Full company name |

---

### Department

**Table Name:** `cr5db_department`  
**Display Name:** Department  
**Description:** This table contains records of departments

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `cr5db_department_id` | Department ID | UniqueId | ✅ | Primary key |
| `cr5db_department_code` | Department Code | Text | ✅ | - |
| `cr5db_department_name` | Department Name | Text | ✅ | - |
| `cr5db_company_id` | Company | Lookup | ❌ | → `cr5db_company` |

---

### Position Catalog

**Table Name:** `cr5db_position_catalog`  
**Display Name:** Position Catalog  
**Description:** This table contains records of position catalog details (standardized job titles)

| Column | Display Name | Type | Required |
|--------|--------------|------|----------|
| `cr5db_position_catalog_id` | Position Catalog ID | UniqueId | ✅ |
| `cr5db_code` | Code | Text | ❌ |
| `cr5db_position_catalog1` | Position Catalog | Text | ✅ |

---

### Job Position

**Table Name:** `cr5db_job_position`  
**Display Name:** Job Position  
**Description:** This table contains records of job position details

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `cr5db_job_position_id` | Job Position ID | UniqueId | ✅ | Primary key |
| `cr5db_position_name` | Position Name | Text | ✅ | - |
| `cr5db_department_id` | Department | Lookup | ✅ | → `cr5db_department` |
| `cr5db_position_catalog_title_id` | Position Catalog | Lookup | ❌ | → `cr5db_position_catalog` |
| `cr5db_reports_to_position_id` | Reports To | Lookup | ❌ | → `cr5db_job_position` (self-reference) |
| `cr5db_headcount_quota` | Headcount Quota | WholeNumber | ❌ | - |
| `cr5db_current_headcount` | Current Headcount | WholeNumber | ❌ | - |
| `cr5db_current_headcount_date` | Current Headcount (Last Updated On) | DateAndTime | ❌ | - |
| `cr5db_current_headcount_state` | Current Headcount (State) | WholeNumber | ❌ | - |

---

## User Management

### User

**Table Name:** `cr5db_user`  
**Display Name:** User  
**Description:** This table contains records of users

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `cr5db_user_id` | User ID | UniqueId | ✅ | Primary key |
| `cr5db_full_name` | Full Name | Text | ✅ | - |
| `cr5db_email` | Email | Email | ❌ | - |
| `cr5db_is_active` | Is Active | YesNo | ❌ | - |
| `cr5db_job_position_id` | Job Position | Lookup | ❌ | → `cr5db_job_position` |

---

### System Role

**Table Name:** `system_role`  
**Display Name:** System Role  
**Description:** Defines system roles with hierarchy and permissions

| Column | Display Name | Type | Required |
|--------|--------------|------|----------|
| `system_role_id` | System Role ID | UniqueId | ✅ |
| `role_name` | Role Name | Text | ✅ |
| `role_code` | Role Code | Text | ✅ |
| `role_description` | Role Description | Text | ❌ |
| `role_level` | Role Level | WholeNumber | ✅ |
| `is_active` | Is Active | YesNo | ❌ |

**Standard Role Codes:**
- `Admin` - Super Administrator (Level 1)
- `HRManager` - HR Manager (Level 2)
- `ProjectManager` - Project Manager (Level 3)
- `Employee` - Regular Employee (Level 4)

---

### Role Assignment

**Table Name:** `role_assignment`  
**Display Name:** Role Assignment  
**Description:** Tracks role assignments to users with audit information

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `role_assignment_id` | Role Assignment ID | UniqueId | ✅ | Primary key |
| `role_assignment_name` | Role Assignment Name | Text | ✅ | - |
| `user_id` | User | Lookup | ✅ | → `cr5db_user` |
| `system_role_id` | System Role | Lookup | ✅ | → `system_role` |
| `assigned_by_id` | Assigned By | Lookup | ✅ | → `cr5db_user` |
| `assigned_date` | Assigned Date | DateAndTime | ✅ | - |
| `is_active` | Is Active | YesNo | ❌ | - |
| `notes` | Notes | Text | ❌ | - |

---

## Headcount & Requests

### Headcount Request

**Table Name:** `cr5db_headcount_request`  
**Display Name:** Headcount Request  
**Description:** Manages headcount change requests across departments

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `cr5db_headcount_request_id` | Headcount Request ID | UniqueId | ✅ | Primary key |
| `cr5db_request_name` | Request Name | Text | ✅ | - |
| `cr5db_request_type` | Request Type | Choice | ✅ | - |
| `cr5db_department_id` | Department | Lookup | ✅ | → `cr5db_department` |
| `cr5db_job_position_id` | Job Position | Lookup | ❌ | → `cr5db_job_position` |
| `cr5db_position_catalog_id` | Position Catalog | Lookup | ❌ | → `cr5db_position_catalog` |
| `cr5db_requested_quantity` | Requested Quantity | WholeNumber | ✅ | - |
| `cr5db_reason` | Reason | MultipleLinesText | ✅ | - |
| `cr5db_approval_status` | Approval Status | Choice | ✅ | - |
| `cr5db_approver_position_id` | Approver Position | Lookup | ❌ | → `cr5db_job_position` |
| `cr5db_created_date` | Created Date | DateAndTime | ✅ | - |

**Request Type Options:**
- Increase Headcount
- Decrease Headcount
- New Position

**Approval Status Options:**
- Pending (`ApprovalStatusKey0`)
- Approved (`ApprovalStatusKey1`)
- Rejected (`ApprovalStatusKey2`)

---

## Project Management

### Project

**Table Name:** `cr5db_project`  
**Display Name:** Project  
**Description:** This table contains records of projects

| Column | Display Name | Type | Required |
|--------|--------------|------|----------|
| `cr5db_project_id` | Project ID | UniqueId | ✅ |
| `cr5db_project_name` | Project Name | Text | ✅ |
| `cr5db_description` | Description | Text | ❌ |
| `cr5db_start_date` | Start Date | DateOnly | ❌ |
| `cr5db_end_date` | End Date | DateOnly | ❌ |

---

### Project Phase

**Table Name:** `cr5db_project_phase`  
**Display Name:** Project Phase  
**Description:** This table contains records of project phases

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `cr5db_project_phase_id` | Project Phase ID | UniqueId | ✅ | Primary key |
| `cr5db_phase_name` | Phase Name | Text | ✅ | - |
| `cr5db_project_id` | Project | Lookup | ❌ | → `cr5db_project` |
| `cr5db_start_date` | Start Date | DateOnly | ❌ | - |
| `cr5db_end_date` | End Date | DateOnly | ❌ | - |

---

### Project Team

**Table Name:** `cr5db_project_team`  
**Display Name:** Project Team  
**Description:** This table contains records of project teams

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `cr5db_project_team_id` | Project Team ID | UniqueId | ✅ | Primary key |
| `cr5db_team_name` | Team Name | Text | ✅ | - |
| `cr5db_project_id` | Project | Lookup | ❌ | → `cr5db_project` |

---

### Project Risk

**Table Name:** `cr5db_project_risk`  
**Display Name:** Project Risk  
**Description:** This table contains risks associated with projects

| Column | Display Name | Type | Required |
|--------|--------------|------|----------|
| `cr5db_project_risk_id` | Project Risk ID | UniqueId | ✅ |
| `cr5db_project_risk1` | Project Risk | Text | ✅ |
| `cr5db_impact_level` | Impact Level | Choice | ❌ |
| `cr5db_probability_percentage` | Probability Percentage | WholeNumber | ❌ |

---

### Project Issue

**Table Name:** `cr5db_project_issue`  
**Display Name:** Project Issue  
**Description:** This table contains issues related to projects, tasks, and users

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `cr5db_project_issue_id` | Project Issue ID | UniqueId | ✅ | Primary key |
| `cr5db_issue_title` | Issue Title | Text | ✅ | - |
| `cr5db_description` | Description | Text | ❌ | - |
| `cr5db_task_id` | Task | Lookup | ❌ | → `cr5db_task` |

---

### Project Label Assignment

**Table Name:** `cr5db_project_label_assignment`  
**Display Name:** Project Label Assignment  
**Description:** This table contains assignments of labels to projects

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `cr5db_project_label_assignment_id` | Project Label Assignment ID | UniqueId | ✅ | Primary key |
| `cr5db_project_label_assignment1` | Project Label Assignment | Text | ✅ | - |
| `cr5db_label_name_id` | System Label | Lookup | ❌ | → `cr5db_system_label` |

---

### Project Objective Alignment

**Table Name:** `cr5db_project_objective_alignment`  
**Display Name:** Project Objective Alignment  
**Description:** Many-to-many relationship between Project and Objective tables

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `cr5db_project_objective_alignment_id` | Project Objective Alignment ID | UniqueId | ✅ | Primary key |
| `cr5db_project_objective_alignment1` | Project Objective Alignment | Text | ✅ | - |
| `cr5db_project_id` | Project | Lookup | ✅ | → `cr5db_project` |
| `cr5db_objective_id` | Objective | Lookup | ✅ | → `cr5db_objective` |

---

## Task Management

### Task

**Table Name:** `cr5db_task`  
**Display Name:** Task  
**Description:** This table contains tasks with descriptions, due dates, and relationships

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `cr5db_task_id` | Task ID | UniqueId | ✅ | Primary key |
| `cr5db_task_name` | Task Name | Text | ✅ | - |
| `cr5db_description` | Description | Text | ❌ | - |
| `cr5db_due_date` | Due Date | DateAndTime | ❌ | - |
| `cr5db_objective_name_id` | Objective | Lookup | ❌ | → `cr5db_objective` |
| `cr5db_parent_task_id` | Task | Lookup | ❌ | → `cr5db_task` (self-reference for subtasks) |

---

### Task Comment

**Table Name:** `cr5db_task_comment`  
**Display Name:** Task Comment  
**Description:** This table contains comments on tasks by users

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `cr5db_task_comment_id` | Task Comment ID | UniqueId | ✅ | Primary key |
| `cr5db_task_comment1` | Task Comment | Text | ✅ | - |
| `cr5db_comment_text` | Comment Text | Text | ❌ | - |
| `cr5db_task_id` | Task | Lookup | ❌ | → `cr5db_task` |

---

### Task Dependency

**Table Name:** `cr5db_task_dependency`  
**Display Name:** Task Dependency  
**Description:** This table contains dependencies between tasks

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `cr5db_task_dependency_id` | Task Dependency ID | UniqueId | ✅ | Primary key |
| `cr5db_task_dependency1` | Task Dependency | Text | ✅ | - |
| `cr5db_predecessor_task_id` | Task (Predecessor) | Lookup | ❌ | → `cr5db_task` |
| `cr5db_successor_task_id` | Task (Successor) | Lookup | ❌ | → `cr5db_task` |

---

### Task Label Assignment

**Table Name:** `cr5db_task_label_assignment`  
**Display Name:** Task Label Assignment  
**Description:** This table contains assignments of labels to tasks

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `cr5db_task_label_assignment_id` | Task Label Assignment ID | UniqueId | ✅ | Primary key |
| `cr5db_task_label_assignment1` | Task Label Assignment | Text | ✅ | - |
| `cr5db_label_name_id` | System Label | Lookup | ❌ | → `cr5db_system_label` |

---

## Time Tracking

### Timesheet Log

**Table Name:** `cr5db_timesheet_log`  
**Display Name:** Timesheet Log  
**Description:** This table contains timesheet logs for tasks and users

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `cr5db_timesheet_log_id` | Timesheet Log ID | UniqueId | ✅ | Primary key |
| `cr5db_timesheet_log1` | Timesheet Log | Text | ✅ | - |
| `cr5db_log_date` | Log Date | DateOnly | ❌ | - |
| `cr5db_actual_hours_worked` | Actual Hours Worked | Decimal | ❌ | - |
| `cr5db_task_id` | Task | Lookup | ❌ | → `cr5db_task` |

---

### Timesheet Audit

**Table Name:** `timesheet_audit`  
**Display Name:** Timesheet Audit  
**Description:** Stores timesheet approval and rejection audit trail information

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `timesheet_audit_id` | Timesheet Audit ID | UniqueId | ✅ | Primary key |
| `audit_record_name` | Audit Record Name | Text | ✅ | - |
| `timesheet_log_id` | Timesheet Log | Lookup | ✅ | → `cr5db_timesheet_log` |
| `action_type` | Action Type | Choice | ✅ | - |
| `action_by_id` | Action By | Lookup | ✅ | → `cr5db_user` |
| `action_date` | Action Date | DateAndTime | ✅ | - |
| `previous_status` | Previous Status | Text | ❌ | - |
| `new_status` | New Status | Text | ❌ | - |
| `comments` | Comments | Text | ❌ | - |

---

## Performance & KPIs

### Objective

**Table Name:** `cr5db_objective`  
**Display Name:** Objective  
**Description:** This table contains objectives linked to projects and evaluation periods

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `cr5db_objective_id` | Objective ID | UniqueId | ✅ | Primary key |
| `cr5db_objective1` | Objective | Text | ✅ | - |
| `cr5db_target_value` | Target Value | Decimal | ❌ | - |
| `cr5db_objective_progress` | Objective Progress | Decimal | ❌ | Rollup field |
| `cr5db_objective_progress_sum` | Objective Progress (Sum) | Decimal | ❌ | - |
| `cr5db_objective_progress_count` | Objective Progress (Count) | WholeNumber | ❌ | - |
| `cr5db_objective_progress_date` | Objective Progress (Last Updated) | DateAndTime | ❌ | - |
| `cr5db_objective_progress_state` | Objective Progress (State) | WholeNumber | ❌ | - |
| `cr5db_period_name_id` | Evaluation Period | Lookup | ❌ | - |

---

### KPI Library

**Table Name:** `cr5db_kpilibrary`  
**Display Name:** KPI Library  
**Description:** This table contains KPI definitions including code, name, unit and formula

| Column | Display Name | Type | Required |
|--------|--------------|------|----------|
| `cr5db_kpilibrary_id` | KPI Library ID | UniqueId | ✅ |
| `cr5db_kpiname` | KPI Name | Text | ✅ |
| `cr5db_unit` | Unit | Text | ❌ |
| `cr5db_formula` | Formula | Text | ❌ |

---

### KPI Target

**Table Name:** `cr5db_kpitarget`  
**Display Name:** KPI Target  
**Description:** This table contains KPI target values with weights and lookup references

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `cr5db_kpitarget_id` | KPI Target ID | UniqueId | ✅ | Primary key |
| `cr5db_kpitarget1` | KPI Target | Text | ✅ | - |
| `cr5db_kpicode_id` | KPI Template | Lookup | ✅ | → `cr5db_kpilibrary` |
| `cr5db_parent_objective_id` | Parent Objective | Lookup | ✅ | → `cr5db_objective` |
| `cr5db_target_value` | Target Value | Decimal | ❌ | - |
| `cr5db_actual_value` | Actual Value | Decimal | ❌ | - |
| `cr5db_kpiachievement_rate` | KPI Achievement Rate | Decimal | ❌ | Calculated (actual/target) |
| `cr5db_weight_percentage` | Weight Percentage | WholeNumber | ❌ | - |

---

### KPI Actual Log

**Table Name:** `cr5db_kpiactual_log`  
**Display Name:** KPI Actual Log  
**Description:** This table contains actual KPI values logged with evidence

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `cr5db_kpiactual_log_id` | KPI Actual Log ID | UniqueId | ✅ | Primary key |
| `cr5db_kpiactual_log1` | KPI Actual Log | Text | ✅ | - |
| `cr5db_actual_value` | Actual Value | Decimal | ❌ | - |
| `cr5db_evidence_link` | Evidence Link | Text | ❌ | - |
| `cr5db_target_id` | KPI Target | Lookup | ❌ | → `cr5db_kpitarget` |

---

### Performance Appraisal

**Table Name:** `cr5db_performance_appraisal`  
**Display Name:** Performance Appraisal  
**Description:** This table contains performance appraisal records with scores

| Column | Display Name | Type | Required |
|--------|--------------|------|----------|
| `cr5db_performance_appraisal_id` | Performance Appraisal ID | UniqueId | ✅ |
| `cr5db_performance_appraisal1` | Performance Appraisal | Text | ✅ |
| `cr5db_self_score` | Self Score | Decimal | ❌ |
| `cr5db_final_score` | Final Score | Decimal | ❌ |

---

## Resource Management

### Resource Allocation

**Table Name:** `cr5db_resource_allocation`  
**Display Name:** Resource Allocation  
**Description:** This table contains records of resource allocations

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `cr5db_resource_allocation_id` | Resource Allocation ID | UniqueId | ✅ | Primary key |
| `cr5db_resource_allocation1` | Resource Allocation | Text | ✅ | - |
| `cr5db_user_id` | User | Lookup | ❌ | → `cr5db_user` |
| `cr5db_project_team_id` | Project Team | Lookup | ❌ | → `cr5db_project_team` |
| `cr5db_allocation_percentage` | Allocation Percentage | WholeNumber | ❌ | - |

---

### User Project Role

**Table Name:** `cr5db_user_project_role`  
**Display Name:** User Project Role  
**Description:** This table contains records of user project roles

| Column | Display Name | Type | Required | References |
|--------|--------------|------|----------|------------|
| `cr5db_user_project_role_id` | User Project Role ID | UniqueId | ✅ | Primary key |
| `cr5db_role_name` | Role Name | Text | ✅ | - |
| `cr5db_role_code` | Role Code | Text | ✅ | - |
| `cr5db_allocation_id` | Resource Allocation | Lookup | ❌ | → `cr5db_resource_allocation` |

---

## System Configuration

### System Label

**Table Name:** `cr5db_system_label`  
**Display Name:** System Label  
**Description:** This table contains system label details for categorization

| Column | Display Name | Type | Required |
|--------|--------------|------|----------|
| `cr5db_system_label_id` | System Label ID | UniqueId | ✅ |
| `cr5db_system_label1` | System Label | Text | ✅ |
| `cr5db_label_group` | Label Group | Text | ❌ |
| `cr5db_hex_color` | Hex Color | Text | ❌ |

---

### System Notification

**Table Name:** `cr5db_system_notification`  
**Display Name:** System Notification  
**Description:** This table contains system notifications sent to users

| Column | Display Name | Type | Required |
|--------|--------------|------|----------|
| `cr5db_system_notification_id` | System Notification ID | UniqueId | ✅ |
| `cr5db_system_notification1` | System Notification | Text | ✅ |
| `cr5db_content` | Content | Text | ❌ |
| `cr5db_is_read` | Is Read | YesNo | ❌ |
| `cr5db_deep_link_url` | Deep Link Url | Text | ❌ |

---

### System Parameter

**Table Name:** `cr5db_system_parameter`  
**Display Name:** System Parameter  
**Description:** This table contains system parameters for configuration

| Column | Display Name | Type | Required |
|--------|--------------|------|----------|
| `cr5db_system_parameter_id` | System Parameter ID | UniqueId | ✅ |
| `cr5db_system_parameter1` | System Parameter | Text | ✅ |
| `cr5db_param_value` | Param Value | Text | ❌ |
| `cr5db_value_type` | Value Type | Text | ❌ |

---

### System Policy Rule

**Table Name:** `cr5db_system_policy_rule`  
**Display Name:** System Policy Rule  
**Description:** This table contains system policy rules for business logic

| Column | Display Name | Type | Required |
|--------|--------------|------|----------|
| `cr5db_system_policy_rule_id` | System Policy Rule ID | UniqueId | ✅ |
| `cr5db_system_policy_rule1` | System Policy Rule | Text | ✅ |
| `cr5db_target_entity` | Target Entity | Text | ❌ |
| `cr5db_context_condition` | Context Condition | Text | ❌ |
| `cr5db_operator` | Operator | Text | ❌ |
| `cr5db_constraint_value` | Constraint Value | Text | ❌ |
| `cr5db_effect` | Effect | Text | ❌ |

---

## Entity Relationship Summary

### Key Relationships

```
Company (1) ──────────< Department (N)
                              │
                              └──< Job Position (N)
                                        │
                                        ├──< User (N)
                                        └──< Headcount Request (N)

Project (1) ──────────< Project Phase (N)
          └──────────< Project Team (N)
                              │
                              └──< Resource Allocation (N)
                                        │
                                        └──< User Project Role (N)

Objective (1) ─────────< KPI Target (N)
                              │
                              └──< KPI Actual Log (N)

Task (1) ──────────────< Task Comment (N)
       └──────────────< Timesheet Log (N)
       └──────────────< Task Dependency (N)
       └──────────────< Project Issue (N)

User (1) ──────────────< Role Assignment (N) >────────── System Role (1)
       └──────────────< Resource Allocation (N)
```

---

## Notes

1. **Primary Keys**: All tables use GUID/UUID as primary keys (`UniqueId` type)
2. **Naming Convention**: Dataverse tables use `cr5db_` prefix for custom columns
3. **Lookup Fields**: Foreign key relationships are implemented as Lookup type columns
4. **Choice Fields**: Dropdown/picklist fields with predefined options
5. **Rollup Fields**: Some fields like `cr5db_objective_progress` are calculated rollups

---

*Document generated for Headcount Management System v1.0*
