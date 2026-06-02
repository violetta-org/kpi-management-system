import React from 'react';
import { Cr5db_tasksService } from '../generated/services/Cr5db_tasksService';
import { Cr5db_kpitargetsService } from '../generated/services/Cr5db_kpitargetsService';
import { Cr5db_jobpositionsService } from '../generated/services/Cr5db_jobpositionsService';
import { Cr5db_headcountrequestsService } from '../generated/services/Cr5db_headcountrequestsService';
import { Cr5db_projectsService } from '../generated/services/Cr5db_projectsService';
import { Cr5db_usersService } from '../generated/services/Cr5db_usersService';
import { Cr5db_changerequestsesService } from '../generated/services/Cr5db_changerequestsesService';
import { Cr5db_audittraillogsService } from '../generated/services/Cr5db_audittraillogsService';
import { Cr5db_systemnotificationsService } from '../generated/services/Cr5db_systemnotificationsService';
import type { User } from '../lib/types';
import type { ActiveRole } from './useAppState';

// ── Lookup Tables ────────────────────────────────────────────────────────────

export const ENTITY_MAPPINGS: Record<string, { service: any; label: string; key: string }> = {
  Tasks: { service: Cr5db_tasksService, label: 'Task', key: 'cr5db_taskid' },
  KPITargets: { service: Cr5db_kpitargetsService, label: 'KPI Target', key: 'cr5db_kpitargetid' },
  JobPositions: { service: Cr5db_jobpositionsService, label: 'Vị trí công việc', key: 'cr5db_jobpositionid' },
  HeadcountRequests: { service: Cr5db_headcountrequestsService, label: 'Yêu cầu Định biên (Headcount)', key: 'cr5db_headcountrequestid' },
  Projects: { service: Cr5db_projectsService, label: 'Dự án', key: 'cr5db_projectid' },
  Users: { service: Cr5db_usersService, label: 'Người dùng', key: 'cr5db_userid' },
};

export const ENTITY_NAME_TO_CODE: Record<string, number> = {
  Tasks: 1, KPITargets: 2, JobPositions: 3, HeadcountRequests: 4, Projects: 5, Users: 6,
};

export const OP_TO_CODE = { Create: 1, Update: 2, Delete: 3, All: 4 } as const;
export const ROLE_TO_CODE = { Employee: 1, Admin: 4 } as const;

// ── Context the engine needs from shared state ────────────────────────────────

export interface ApprovalEngineContext {
  activeRole: ActiveRole;
  currentUserEmail: string;
  usersList: User[];
  jobPositionsList: any[];
  approvalRoutesList: any[];
  setIsLoading: (v: boolean) => void;
  setApprovalModalData: (v: any) => void;
  setSelectedApproverId: (v: string) => void;
  setRequestReason: (v: string) => void;
  setShowApprovalModal: (v: boolean) => void;
  approvalModalData: any;
  requestReason: string;
  selectedApproverId: string;
  fetchLiveValues: () => Promise<void>;
}

// ── Diff renderer (pure UI helper, lives here because it is tightly coupled) ──

export function renderDiffContainer(req: any): React.ReactElement | null {
  try {
    const isCreate = req.cr5db_operationtype === 1;
    const isUpdate = req.cr5db_operationtype === 2;
    const isDelete = req.cr5db_operationtype === 3;

    const oldVal = req.cr5db_oldvaluejson ? JSON.parse(req.cr5db_oldvaluejson) : null;
    const newVal = req.cr5db_payloadjson ? JSON.parse(req.cr5db_payloadjson) : null;

    const formatVal = (v: any) => {
      if (v === null || v === undefined) return React.createElement('em', { style: { color: 'var(--color-text-secondary)' } }, 'null');
      if (typeof v === 'object') return JSON.stringify(v);
      return String(v);
    };

    if (isCreate && newVal) {
      return React.createElement(
        'div',
        { style: { backgroundColor: '#f4fbf7', border: '1px solid #d1eedc', borderRadius: '4px', padding: '12px', marginTop: '10px' } },
        React.createElement('div', { style: { fontSize: '12px', fontWeight: 700, color: '#1b5e20', marginBottom: '6px' } }, 'Dữ liệu tạo mới:'),
        React.createElement(
          'table',
          { style: { width: '100%', borderCollapse: 'collapse', fontSize: '12px' } },
          React.createElement('tbody', null,
            Object.keys(newVal).map(key =>
              React.createElement('tr', { key, style: { borderBottom: '1px solid #e8f5e9' } },
                React.createElement('td', { style: { padding: '4px 8px', fontWeight: 600, color: 'var(--color-text-secondary)', width: '35%' } }, key),
                React.createElement('td', { style: { padding: '4px 8px', color: '#1b5e20', backgroundColor: '#e8f5e9' } }, formatVal(newVal[key]))
              )
            )
          )
        )
      );
    }

    if (isDelete && oldVal) {
      return React.createElement(
        'div',
        { style: { backgroundColor: '#fff8f8', border: '1px solid #ffd1d1', borderRadius: '4px', padding: '12px', marginTop: '10px' } },
        React.createElement('div', { style: { fontSize: '12px', fontWeight: 700, color: '#c62828', marginBottom: '6px' } }, 'Dữ liệu xóa:'),
        React.createElement(
          'table',
          { style: { width: '100%', borderCollapse: 'collapse', fontSize: '12px' } },
          React.createElement('tbody', null,
            Object.keys(oldVal).map(key =>
              React.createElement('tr', { key, style: { borderBottom: '1px solid #ffebee' } },
                React.createElement('td', { style: { padding: '4px 8px', fontWeight: 600, color: 'var(--color-text-secondary)', width: '35%' } }, key),
                React.createElement('td', { style: { padding: '4px 8px', color: '#c62828', backgroundColor: '#ffebee', textDecoration: 'line-through' } }, formatVal(oldVal[key]))
              )
            )
          )
        )
      );
    }

    if (isUpdate && newVal && oldVal) {
      const keys = Object.keys(newVal);
      return React.createElement(
        'div',
        { style: { backgroundColor: '#fcfcfc', border: '1px solid var(--color-border-light)', borderRadius: '4px', padding: '12px', marginTop: '10px' } },
        React.createElement('div', { style: { fontSize: '12px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' } }, 'So sánh thay đổi (Trước vs. Sau):'),
        React.createElement(
          'table',
          { style: { width: '100%', borderCollapse: 'collapse', fontSize: '12px' } },
          React.createElement('thead', null,
            React.createElement('tr', { style: { borderBottom: '1px solid var(--color-border)', textAlign: 'left' } },
              React.createElement('th', { style: { padding: '4px 8px', color: 'var(--color-text-secondary)' } }, 'Trường dữ liệu'),
              React.createElement('th', { style: { padding: '4px 8px', color: 'var(--color-text-secondary)' } }, 'Giá trị cũ (Trước)'),
              React.createElement('th', { style: { padding: '4px 8px', color: 'var(--color-text-secondary)' } }, 'Giá trị mới (Sau)')
            )
          ),
          React.createElement('tbody', null,
            keys.map(key => {
              const oVal = oldVal[key];
              const nVal = newVal[key];
              const hasChanged = JSON.stringify(oVal) !== JSON.stringify(nVal);
              return React.createElement('tr', { key, style: { borderBottom: '1px solid var(--color-border-light)', backgroundColor: hasChanged ? '#fffde7' : 'transparent' } },
                React.createElement('td', { style: { padding: '6px 8px', fontWeight: 600, color: 'var(--color-text-secondary)', width: '30%' } }, key),
                React.createElement('td', { style: { padding: '6px 8px', color: '#a80000', textDecoration: hasChanged ? 'line-through' : 'none' } }, formatVal(oVal)),
                React.createElement('td', { style: { padding: '6px 8px', color: hasChanged ? '#1b5e20' : 'var(--color-text)', fontWeight: hasChanged ? 600 : 400 } }, formatVal(nVal))
              );
            })
          )
        )
      );
    }
  } catch (e) {
    console.error(e);
    return React.createElement('div', { style: { fontSize: '11px', color: '#a80000' } }, 'Không thể hiển thị so sánh dữ liệu (JSON không hợp lệ).');
  }
  return null;
}

// ── Engine Functions ─────────────────────────────────────────────────────────

export function executeDirectCrud(
  entityName: string,
  operation: 'Create' | 'Update' | 'Delete',
  payload: any,
  targetRecordId?: string
) {
  const mapping = ENTITY_MAPPINGS[entityName];
  if (!mapping) throw new Error(`Không tìm thấy cấu hình cho thực thể: ${entityName}`);
  if (operation === 'Create') return mapping.service.create(payload);
  if (operation === 'Update') {
    if (!targetRecordId) throw new Error('Thiếu ID bản ghi cần cập nhật');
    return mapping.service.update(targetRecordId, payload);
  }
  if (!targetRecordId) throw new Error('Thiếu ID bản ghi cần xóa');
  return mapping.service.delete(targetRecordId);
}

export function resolveApprover(
  route: any,
  requesterEmail: string,
  usersList: User[],
  jobPositionsList: any[]
): { defaultApproverId: string; validApprovers: User[] } {
  const requester = usersList.find(u => u.cr5db_email?.toLowerCase() === requesterEmail.toLowerCase());
  const fallbackAdmin = usersList.find(u => u.cr5db_systemrole === 'Admin') || usersList[0];
  const fallbackAdminId = fallbackAdmin?.cr5db_userid || '';
  const generalApproversList = usersList.filter(u =>
    u.cr5db_systemrole === 'Admin' ||
    (u.cr5db_systemrole && u.cr5db_systemrole.startsWith('Employee:'))
  );

  if (!requester) return { defaultApproverId: fallbackAdminId, validApprovers: generalApproversList };

  const rType = typeof route.cr5db_routingtype === 'string'
    ? route.cr5db_routingtype
    : ({ 1: 'POSITION_HIERARCHY', 2: 'SPECIFIC_ROLE', 3: 'DEPARTMENT_HEAD', 4: 'SPECIFIC_USER' } as Record<number, string>)[route.cr5db_routingtype] || 'POSITION_HIERARCHY';

  switch (rType) {
    case 'POSITION_HIERARCHY': {
      const myPos = jobPositionsList.find(p => p.cr5db_jobpositionid === requester._cr5db_jobposition_value);
      let reportsTo = myPos?._cr5db_reportstopositionid_value;
      let approverUser: User | undefined;
      while (reportsTo) {
        const matchedUser = usersList.find(u => u._cr5db_jobposition_value === reportsTo);
        if (matchedUser) { approverUser = matchedUser; break; }
        const nextPos = jobPositionsList.find(p => p.cr5db_jobpositionid === reportsTo);
        reportsTo = nextPos?._cr5db_reportstopositionid_value;
      }
      if (!approverUser) {
        throw new Error("Không tìm thấy Quản lý trực tiếp (Reports To) trong sơ đồ tổ chức. Vui lòng liên hệ HR để cập nhật Job Position.");
      }
      const resolvedId = approverUser.cr5db_userid;
      return {
        defaultApproverId: resolvedId,
        validApprovers: generalApproversList.some(u => u.cr5db_userid === resolvedId)
          ? generalApproversList
          : [approverUser, ...generalApproversList]
      };
    }
    case 'SPECIFIC_ROLE': {
      const targetGroupId = route.cr5db_approverrole || '';
      const filtered = usersList.filter(u => {
        if (u.cr5db_systemrole === 'Admin') return true;
        const roleStr = u.cr5db_systemrole || '';
        if (roleStr.startsWith('Employee:')) {
          const assignedGroups = roleStr.substring(9).split(',');
          return assignedGroups.includes(targetGroupId);
        }
        return false;
      });
      return {
        defaultApproverId: filtered[0]?.cr5db_userid || fallbackAdminId,
        validApprovers: filtered.length > 0 ? filtered : generalApproversList
      };
    }
    case 'DEPARTMENT_HEAD': {
      const myPos = jobPositionsList.find(p => p.cr5db_jobpositionid === requester._cr5db_jobposition_value);
      if (!myPos?._cr5db_department_value) {
        throw new Error("Người gửi không thuộc phòng ban nào. Không thể xác định Trưởng phòng.");
      }
      const deptPositions = jobPositionsList.filter(p => p._cr5db_department_value === myPos._cr5db_department_value);
      const headPos = deptPositions.find(p => !p._cr5db_reportstopositionid_value) || deptPositions[0];
      const matchedHead = headPos ? usersList.find(u => u._cr5db_jobposition_value === headPos.cr5db_jobpositionid) : undefined;
      if (!matchedHead) {
        throw new Error("Không tìm thấy Trưởng phòng. Vui lòng liên hệ HR để cập nhật cơ cấu phòng ban.");
      }
      const resolvedId = matchedHead.cr5db_userid;
      return {
        defaultApproverId: resolvedId,
        validApprovers: [matchedHead, ...generalApproversList.filter(u => u.cr5db_userid !== resolvedId)]
      };
    }
    case 'SPECIFIC_USER': {
      const specificUserId = route._cr5db_approveruser_value || '';
      const matched = usersList.find(u => u.cr5db_userid === specificUserId);
      return {
        defaultApproverId: specificUserId || fallbackAdminId,
        validApprovers: matched ? [matched] : generalApproversList
      };
    }
    default:
      return { defaultApproverId: fallbackAdminId, validApprovers: generalApproversList };
  }
}

/**
 * Returns bound engine functions. Call this in `App` and destructure what you need.
 */
export function buildApprovalEngine(ctx: ApprovalEngineContext) {
  const executeCrudWithApproval = async (
    entityName: string,
    operation: 'Create' | 'Update' | 'Delete',
    payload: any,
    targetRecordId?: string,
    description?: string,
    oldValue?: any
  ): Promise<any> => {
    // Admin bypasses all approval routing
    if (ctx.activeRole === 'Admin') {
      const res = await executeDirectCrud(entityName, operation, payload, targetRecordId);
      if (res && res.error) {
        throw new Error(res.error.message || `Lỗi khi thực hiện ${operation} trên ${entityName}`);
      }
      await Cr5db_audittraillogsService.create({ 
        cr5db_logname: `Admin Direct ${operation}`, 
        cr5db_actionexecuted: description || `Admin executed ${operation} on ${entityName}`, 
        cr5db_changedfromvalue: oldValue ? JSON.stringify(oldValue) : '', 
        cr5db_changedtovalue: payload ? JSON.stringify(payload) : '' 
      } as any).catch(e => console.error('Audit log error:', e));
      await ctx.fetchLiveValues();
      return res;
    }

    const entityCode = ENTITY_NAME_TO_CODE[entityName];
    const opCode = OP_TO_CODE[operation];
    const reqRoleCode = ROLE_TO_CODE[ctx.activeRole];

    // Sort routes by priority descending (highest priority first)
    const sortedRoutes = [...ctx.approvalRoutesList].sort((a, b) => (b.cr5db_priority || 0) - (a.cr5db_priority || 0));

    const matchedRoute = sortedRoutes.find((route: any) => {
      const rEntity = typeof route.cr5db_targetentity === 'string' ? ENTITY_NAME_TO_CODE[route.cr5db_targetentity] : route.cr5db_targetentity;
      const rOp = typeof route.cr5db_operationtype === 'string' ? (OP_TO_CODE as any)[route.cr5db_operationtype] : route.cr5db_operationtype;
      const rRole = typeof route.cr5db_requesterrole === 'string' ? (ROLE_TO_CODE as any)[route.cr5db_requesterrole] : route.cr5db_requesterrole;
      return route.cr5db_isactive && rEntity === entityCode && (rOp === opCode || rOp === 4) && rRole === reqRoleCode;
    });

    if (!matchedRoute) {
      console.log(`No approval route matched for ${entityName} - ${operation}. Executing directly.`);
      const res = await executeDirectCrud(entityName, operation, payload, targetRecordId);
      await ctx.fetchLiveValues();
      return res;
    }

    const { defaultApproverId, validApprovers } = resolveApprover(matchedRoute, ctx.currentUserEmail, ctx.usersList, ctx.jobPositionsList);

    ctx.setApprovalModalData({
      entityName, operation, payload, targetRecordId,
      description: description || `${operation} ${entityName} request`,
      oldValue, defaultApproverId,
      validApprovers: validApprovers.filter(u => u.cr5db_email?.toLowerCase() !== ctx.currentUserEmail.toLowerCase()),
      appliedRouteId: matchedRoute.cr5db_approvalroutesid
    });
    ctx.setSelectedApproverId(defaultApproverId);
    ctx.setRequestReason('');
    ctx.setShowApprovalModal(true);
    ctx.setIsLoading(false);
    return null;
  };

  const handleApproveChangeRequest = async (request: any) => {
    try {
      const payload = JSON.parse(request.cr5db_payloadjson || '{}');
      const entityName = ({ 1: 'Tasks', 2: 'KPITargets', 3: 'JobPositions', 4: 'HeadcountRequests', 5: 'Projects', 6: 'Users' } as Record<number, string>)[request.cr5db_targetentity as number] || '';
      const operation = ({ 1: 'Create', 2: 'Update', 3: 'Delete' } as Record<number, string>)[request.cr5db_operationtype as number] as 'Create' | 'Update' | 'Delete';

      if (!entityName || !operation) { alert('❌ Dữ liệu Change Request không hợp lệ.'); return; }

      const res = await executeDirectCrud(entityName, operation, payload, request.cr5db_targetrecordid);
      if (res && res.error) {
        throw new Error(res.error.message || "Lỗi khi áp dụng thay đổi vào cơ sở dữ liệu.");
      }
      await Cr5db_changerequestsesService.update(request.cr5db_changerequestsid, { cr5db_status: 2, cr5db_approvercomment: 'Yêu cầu đã được phê duyệt và áp dụng.' });
      await Cr5db_audittraillogsService.create({ cr5db_logname: 'Change Request Approved', cr5db_actionexecuted: `Approved request: ${request.cr5db_requesttitle}`, cr5db_changedfromvalue: 'Pending', cr5db_changedtovalue: 'Approved' } as any);

      const requesterUser = ctx.usersList.find(u => u.cr5db_userid === request._cr5db_requester_value);
      const requesterOwnerId = requesterUser?.ownerid || (requesterUser as any)?._ownerid_value;
      if (requesterOwnerId) {
        await Cr5db_systemnotificationsService.create({ cr5db_systemnotification1: 'Yêu cầu được phê duyệt', cr5db_content: `Yêu cầu thay đổi "${request.cr5db_requesttitle}" của bạn đã được phê duyệt và áp dụng thành công.`, cr5db_deeplinkurl: '#requests', cr5db_isread: false, ownerid: requesterOwnerId, owneridtype: requesterUser?.owneridtype || 'systemusers', statecode: 0 }).catch(e => console.error('Notification error:', e));
      }

      alert('✅ Yêu cầu thay đổi đã được phê duyệt và áp dụng thành công!');
      await ctx.fetchLiveValues();
    } catch (err: any) {
      console.error(err);
      alert(`❌ Phê duyệt thất bại: ${err.message || 'Lỗi không xác định'}`);
    } finally {
      ctx.setIsLoading(false);
    }
  };

  const handleRejectChangeRequest = async (request: any, comment: string) => {
    try {
      ctx.setIsLoading(true);
      await Cr5db_changerequestsesService.update(request.cr5db_changerequestsid, { cr5db_status: 3, cr5db_approvercomment: comment || 'Yêu cầu bị từ chối.' });
      await Cr5db_audittraillogsService.create({ cr5db_logname: 'Change Request Rejected', cr5db_actionexecuted: `Rejected request: ${request.cr5db_requesttitle}`, cr5db_changedfromvalue: 'Pending', cr5db_changedtovalue: 'Rejected' } as any);

      const requesterUser = ctx.usersList.find(u => u.cr5db_userid === request._cr5db_requester_value);
      const requesterOwnerId = requesterUser?.ownerid || (requesterUser as any)?._ownerid_value;
      if (requesterOwnerId) {
        await Cr5db_systemnotificationsService.create({ cr5db_systemnotification1: 'Yêu cầu bị từ chối', cr5db_content: `Yêu cầu thay đổi "${request.cr5db_requesttitle}" của bạn đã bị từ chối. Lý do: ${comment || 'Không có bình luận.'}`, cr5db_deeplinkurl: '#requests', cr5db_isread: false, ownerid: requesterOwnerId, owneridtype: requesterUser?.owneridtype || 'systemusers', statecode: 0 }).catch(e => console.error('Notification error:', e));
      }

      alert('❌ Yêu cầu thay đổi đã bị từ chối.');
      await ctx.fetchLiveValues();
    } catch (err: any) {
      console.error(err);
      alert(`❌ Từ chối thất bại: ${err.message || 'Lỗi không xác định'}`);
    } finally {
      ctx.setIsLoading(false);
    }
  };

  const handleSubmittingApprovalRequest = async () => {
    if (!ctx.approvalModalData) return;
    if (!ctx.requestReason.trim()) { alert('Vui lòng nhập lý do gửi yêu cầu.'); return; }
    if (!ctx.selectedApproverId) { alert('Vui lòng chọn người phê duyệt.'); return; }

    try {
      ctx.setIsLoading(true);
      const requesterRecord = ctx.usersList.find(u => u.cr5db_email?.toLowerCase() === ctx.currentUserEmail.toLowerCase());
      if (!requesterRecord) throw new Error('Không tìm thấy thông tin tài khoản người gửi.');

      const entityCode = ENTITY_NAME_TO_CODE[ctx.approvalModalData.entityName as string];
      const operationCode = (OP_TO_CODE as Record<string, number>)[ctx.approvalModalData.operation as string];

      const createRes = await Cr5db_changerequestsesService.create({
        cr5db_requesttitle: ctx.approvalModalData.description,
        cr5db_targetentity: entityCode as any,
        cr5db_operationtype: operationCode as any,
        cr5db_payloadjson: JSON.stringify(ctx.approvalModalData.payload),
        cr5db_targetrecordid: ctx.approvalModalData.targetRecordId || '',
        cr5db_oldvaluejson: ctx.approvalModalData.oldValue ? JSON.stringify(ctx.approvalModalData.oldValue) : '',
        cr5db_status: 1,
        cr5db_reason: ctx.requestReason,
        'cr5db_Requester@odata.bind': `/cr5db_users(${requesterRecord.cr5db_userid})`,
        'cr5db_Approver@odata.bind': `/cr5db_users(${ctx.selectedApproverId})`,
        'cr5db_AppliedRoute@odata.bind': ctx.approvalModalData.appliedRouteId ? `/cr5db_approvalrouteses(${ctx.approvalModalData.appliedRouteId})` : undefined,
        statecode: 0
      } as any);

      if (createRes.error) {
        throw new Error(createRes.error.message || "Lỗi lưu trữ yêu cầu thay đổi vào Dataverse.");
      }

      const approverUser = ctx.usersList.find(u => u.cr5db_userid === ctx.selectedApproverId);
      const approverOwnerId = approverUser?.ownerid || (approverUser as any)?._ownerid_value;
      if (approverOwnerId) {
        await Cr5db_systemnotificationsService.create({ cr5db_systemnotification1: 'Yêu cầu phê duyệt mới', cr5db_content: `${requesterRecord.cr5db_fullname} đã gửi yêu cầu thay đổi: ${ctx.approvalModalData.description}. Vui lòng phê duyệt hoặc từ chối.`, cr5db_deeplinkurl: '#requests', cr5db_isread: false, ownerid: approverOwnerId, owneridtype: approverUser?.owneridtype || 'systemusers', statecode: 0 }).catch(e => console.error('Notification error:', e));
      }

      alert('✅ Yêu cầu thay đổi đã được gửi thành công. Vui lòng chờ người duyệt phản hồi.');
      ctx.setShowApprovalModal(false);
      await ctx.fetchLiveValues();
    } catch (err: any) {
      console.error(err);
      alert(`❌ Gửi yêu cầu thất bại: ${err.message || 'Lỗi không xác định'}`);
    } finally {
      ctx.setIsLoading(false);
    }
  };

  return {
    executeCrudWithApproval,
    executeDirectCrud,
    handleApproveChangeRequest,
    handleRejectChangeRequest,
    handleSubmittingApprovalRequest,
  };
}
