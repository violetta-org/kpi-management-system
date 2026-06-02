import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { AIGenerateButton } from '../../features/ai/AIGenerateButton';
import { AIService } from '../../features/ai/AIService';
import type { Task } from '../../lib/types';

interface TaskModalProps {
  isOpen: boolean;
  editingTask: Task | null;
  onClose: () => void;
  onSave: (taskData: {
    name: string;
    desc: string;
    projectId: string;
    phaseId: string;
    objectiveId: string;
    parentId: string;
    assigneeId: string;
    kpiTargetId: string;
    dueDate: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
  }) => Promise<void>;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  editingTask,
  onClose,
  onSave,
}) => {
  const {
    projects,
    projectPhases,
    objectivesList,
    tasks,
    kpiTargets,
    usersList,
    currentUserEmail,
  } = useAppState();

  // Local form states
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskProjectId, setNewTaskProjectId] = useState('');
  const [newTaskPhaseId, setNewTaskPhaseId] = useState('');
  const [newTaskObjectiveId, setNewTaskObjectiveId] = useState('');
  const [newTaskParentId, setNewTaskParentId] = useState('');
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState('');
  const [newTaskKpiTargetId, setNewTaskKpiTargetId] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<'Not Started' | 'In Progress' | 'Completed'>('In Progress');

  // Sync form states when editingTask changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        setNewTaskName(editingTask.cr5db_taskname || '');
        setNewTaskDesc(editingTask.cr5db_description || '');
        setNewTaskProjectId((editingTask as any)._cr5db_projectid_value || '');
        setNewTaskPhaseId(editingTask._cr5db_projectphaseid_value || '');
        setNewTaskObjectiveId(editingTask._cr5db_objectivename_value || '');
        setNewTaskParentId(editingTask._cr5db_parenttask_value || '');
        setNewTaskAssigneeId(editingTask._cr5db_assigneeid_value || '');
        setNewTaskKpiTargetId(editingTask._new_kpitarget_value || '');
        setNewTaskDueDate(editingTask.cr5db_due_date || '');
        setNewTaskStatus((editingTask.cr5db_status as any) || 'In Progress');
      } else {
        setNewTaskName('');
        setNewTaskDesc('');
        setNewTaskProjectId('');
        setNewTaskPhaseId('');
        setNewTaskObjectiveId('');
        setNewTaskParentId('');
        setNewTaskAssigneeId('');
        setNewTaskKpiTargetId('');
        setNewTaskDueDate(new Date().toISOString().split('T')[0]);
        setNewTaskStatus('In Progress');
      }
    }
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: newTaskName,
      desc: newTaskDesc,
      projectId: newTaskProjectId,
      phaseId: newTaskPhaseId,
      objectiveId: newTaskObjectiveId,
      parentId: newTaskParentId,
      assigneeId: newTaskAssigneeId,
      kpiTargetId: newTaskKpiTargetId,
      dueDate: newTaskDueDate,
      status: newTaskStatus,
    });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'oklab(0 0 0 / 0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '550px', maxHeight: '503px', overflowY: 'auto', backgroundColor: '#ffffff', border: '1px solid #000000', borderRadius: '8px', padding: '24px', display: 'grid', gap: '16px', boxSizing: 'border-box', position: 'relative', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
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
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', margin: 0 }}>
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
            <AIGenerateButton
              onClick={async () => {
                const selProject = projects.find(p => p.cr5db_projectid === newTaskProjectId);
                const selPhase = projectPhases.find(ph => ph.cr5db_projectphaseid === newTaskPhaseId);
                return await AIService.generateTaskDescription(
                  newTaskName || 'Công việc mới',
                  selProject?.cr5db_projectname || '',
                  selPhase?.cr5db_projectphase1 || ''
                );
              }}
              onSuccess={(text) => setNewTaskDesc(text)}
            />
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

            {/* KPI Target */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '141px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, lineHeight: '14px', color: '#000000' }}>KPI Target</label>
              <select
                value={newTaskKpiTargetId}
                onChange={(e) => setNewTaskKpiTargetId(e.target.value)}
                style={{ height: '36px', padding: '8px 12px', border: '1px solid #000000', borderRadius: '6px', fontSize: '14px', fontWeight: 400, color: '#000000', backgroundColor: '#ffffff', cursor: 'pointer', boxSizing: 'border-box' }}
              >
                <option value="">KPI Target (Optional)</option>
                {kpiTargets
                  .filter(k => {
                    const assignee = usersList.find(u => u.cr5db_userid === (newTaskAssigneeId || usersList.find(x => x.cr5db_email?.toLowerCase() === currentUserEmail.toLowerCase())?.cr5db_userid));
                    return k.cr5db_user_email?.toLowerCase() === assignee?.cr5db_email?.toLowerCase();
                  })
                  .map(k => (
                    <option key={k.cr5db_kpitargetid} value={k.cr5db_kpitargetid}>{k.cr5db_kpiname}</option>
                  ))
                }
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
              onClick={onClose}
              style={{ border: '1px solid #000000', borderRadius: '6px', padding: '8px 16px', height: '36px', width: '485px', fontWeight: 500, fontSize: '14px', backgroundColor: 'transparent', color: '#000000', cursor: 'pointer', boxSizing: 'border-box' }}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
