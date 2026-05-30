import sys

with open('seed_data.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all occurrences of new_ with cr5db_ in strings
content = content.replace('"new_', '"cr5db_')
content = content.replace('/new_', '/cr5db_')
content = content.replace('new_RoleAssignment', 'cr5db_RoleAssignment')
content = content.replace('new_SystemRole', 'cr5db_SystemRole')
content = content.replace('new_TaskOwnership', 'cr5db_TaskOwnership')
content = content.replace('new_TimesheetAudit', 'cr5db_TimesheetAudit')
content = content.replace('new_RoleName', 'cr5db_RoleName')
content = content.replace('new_RoleCode', 'cr5db_RoleCode')
content = content.replace('new_RoleDescription', 'cr5db_RoleDescription')
content = content.replace('new_RoleLevel', 'cr5db_RoleLevel')
content = content.replace('new_IsActive', 'cr5db_IsActive')
content = content.replace('new_RoleAssignmentName', 'cr5db_RoleAssignmentName')
content = content.replace('new_Notes', 'cr5db_Notes')
content = content.replace('new_AssignedDate', 'cr5db_AssignedDate')
content = content.replace('new_User', 'cr5db_User')
content = content.replace('new_SystemRole', 'cr5db_SystemRole')
content = content.replace('new_AssignedBy', 'cr5db_AssignedBy')
content = content.replace('new_AuditRecordName', 'cr5db_AuditRecordName')
content = content.replace('new_ApprovedBy', 'cr5db_ApprovedBy')
content = content.replace('new_ApprovedAt', 'cr5db_ApprovedAt')
content = content.replace('new_Status', 'cr5db_Status')
content = content.replace('new_TimesheetLogID', 'cr5db_TimesheetLogID')
content = content.replace('new_OwnershipName', 'cr5db_OwnershipName')
content = content.replace('new_TaskID', 'cr5db_TaskID')
content = content.replace('new_AssigneeUserID', 'cr5db_AssigneeUserID')
content = content.replace('new_CreatedByUserID', 'cr5db_CreatedByUserID')


with open('seed_data.py', 'w', encoding='utf-8') as f:
    f.write(content)
print('Replaced new_ with cr5db_')
