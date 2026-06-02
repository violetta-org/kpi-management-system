import React from 'react';
import { useAppState } from '../../../context/AppStateContext';

interface WorkloadHeatmapWidgetProps {
  onExpand?: (expanded: { id: string; data: any; title: string }) => void;
}

export const WorkloadHeatmapWidget: React.FC<WorkloadHeatmapWidgetProps> = ({ onExpand }) => {
  const {
    usersList,
    resourceAllocationsList,
    tasks,
    language
  } = useAppState();

  // Calculate workload for all users
  const workloads = usersList.map(u => {
    // 1. Allocation
    const userAllocs = resourceAllocationsList.filter(a => a._cr5db_userid_value === u.cr5db_userid);
    const totalAlloc = userAllocs.reduce((sum, a) => sum + (a.cr5db_allocationpercentage || 0), 0);

    // 2. Active Tasks
    const activeTasks = tasks.filter(t => t.cr5db_assignee_email?.toLowerCase() === (u.cr5db_email || '').toLowerCase() && t.cr5db_status !== 'Completed');
    const taskCount = activeTasks.length;

    // Classification
    let status: 'Overloaded' | 'Optimal' | 'Underutilized' = 'Optimal';
    if (totalAlloc > 100 || taskCount >= 5) {
      status = 'Overloaded';
    } else if (totalAlloc < 50 || taskCount === 0) {
      status = 'Underutilized';
    }

    return { user: u, totalAlloc, taskCount, status };
  });

  // Sort: Overloaded first, then sort by Alloc descending
  workloads.sort((a, b) => {
    const rank = { 'Overloaded': 3, 'Optimal': 2, 'Underutilized': 1 };
    if (rank[a.status] !== rank[b.status]) return rank[b.status] - rank[a.status];
    return b.totalAlloc - a.totalAlloc;
  });

  // Top 5
  const topWorkloads = workloads.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-secondary)', paddingBottom: '4px', borderBottom: '1px solid var(--color-border-light)' }}>
        <span>Nhân sự</span>
        <span>Trạng thái</span>
      </div>

      {topWorkloads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-secondary)', fontSize: '12px' }}>Không có dữ liệu phân bổ.</div>
      ) : (
        topWorkloads.map((wl, idx) => {
          let barColor = 'var(--color-primary)';
          let bgColor = '#e6f2eb';
          if (wl.status === 'Overloaded') {
            barColor = '#dc2626';
            bgColor = '#FDF3F3';
          } else if (wl.status === 'Underutilized') {
            barColor = '#9ca3af';
            bgColor = '#f3f4f6';
          }

          // Map alloc to progress bar width (cap at 100% for display)
          const barWidth = Math.min(100, wl.totalAlloc || 10);

          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span style={{ fontWeight: 600 }}>{wl.user.cr5db_fullname}</span>
                <span style={{ fontWeight: 700, color: barColor }}>
                  {wl.status === 'Overloaded' ? '🔴 Quá tải' : wl.status === 'Optimal' ? '🟢 Tối ưu' : '⚪ Rảnh rỗi'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flex: 1, height: '8px', backgroundColor: bgColor, borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${barWidth}%`, height: '100%', backgroundColor: barColor, transition: 'width 0.3s ease' }} />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', width: '90px', textAlign: 'right' }}>
                  {wl.totalAlloc}% | {wl.taskCount} Tasks
                </div>
              </div>
            </div>
          );
        })
      )}
      {workloads.length > 5 && (
        <div 
          style={{ fontSize: '11px', textAlign: 'center', color: 'var(--color-primary)', cursor: 'pointer', marginTop: '4px', fontWeight: 600 }}
          onClick={() => onExpand?.({ id: 'workload_heatmap', data: workloads, title: language === 'vi' ? 'Workload Heatmap (Tất cả nhân sự)' : 'Workload Heatmap (All staff)' })}
        >
          {language === 'vi' ? `Xem tất cả ${workloads.length} nhân sự...` : `View all ${workloads.length} staff...`}
        </div>
      )}
    </div>
  );
};
