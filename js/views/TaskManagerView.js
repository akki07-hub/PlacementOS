/* ==========================================================================
   TaskManagerView.js - Kanban Board Task CRUD, Search, Filter & Sort View
   ========================================================================== */

import { UIComponents } from '../components/UIComponents.js';

export class TaskManagerView {
  static render(container, appState) {
    const tasks = appState.data.tasks || [];
    
    // Read active filters from view state
    const filterCat = window.taskFilterCat || 'all';
    const filterPriority = window.taskFilterPriority || 'all';
    const sortKey = window.taskSortKey || 'deadline';

    let filtered = tasks.filter(t => {
      if (filterCat !== 'all' && t.category !== filterCat) return false;
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sortKey === 'deadline') return new Date(a.deadline || 0) - new Date(b.deadline || 0);
      if (sortKey === 'priority') {
        const pMap = { high: 1, medium: 2, low: 3 };
        return (pMap[a.priority] || 4) - (pMap[b.priority] || 4);
      }
      if (sortKey === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    const pending = filtered.filter(t => t.status === 'pending');
    const inProgress = filtered.filter(t => t.status === 'in-progress');
    const completed = filtered.filter(t => t.status === 'completed');

    container.innerHTML = `
      <div>
        <!-- Kanban Filter & Sort Controls -->
        <div class="kanban-filter-bar">
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center;">
            <select class="form-control" style="width:auto; padding:0.4rem 0.85rem; font-size:0.85rem;" onchange="window.taskFilterCat=this.value; window.appState.notify();">
              <option value="all" ${filterCat === 'all' ? 'selected' : ''}>All Categories</option>
              <option value="DSA" ${filterCat === 'DSA' ? 'selected' : ''}>DSA</option>
              <option value="Programming" ${filterCat === 'Programming' ? 'selected' : ''}>Programming</option>
              <option value="Projects" ${filterCat === 'Projects' ? 'selected' : ''}>Projects</option>
              <option value="Resume" ${filterCat === 'Resume' ? 'selected' : ''}>Resume</option>
              <option value="Communication" ${filterCat === 'Communication' ? 'selected' : ''}>Communication</option>
              <option value="Interview" ${filterCat === 'Interview' ? 'selected' : ''}>Interview</option>
            </select>

            <select class="form-control" style="width:auto; padding:0.4rem 0.85rem; font-size:0.85rem;" onchange="window.taskFilterPriority=this.value; window.appState.notify();">
              <option value="all" ${filterPriority === 'all' ? 'selected' : ''}>All Priorities</option>
              <option value="high" ${filterPriority === 'high' ? 'selected' : ''}>High Priority</option>
              <option value="medium" ${filterPriority === 'medium' ? 'selected' : ''}>Medium Priority</option>
              <option value="low" ${filterPriority === 'low' ? 'selected' : ''}>Low Priority</option>
            </select>

            <select class="form-control" style="width:auto; padding:0.4rem 0.85rem; font-size:0.85rem;" onchange="window.taskSortKey=this.value; window.appState.notify();">
              <option value="deadline" ${sortKey === 'deadline' ? 'selected' : ''}>Sort by Deadline</option>
              <option value="priority" ${sortKey === 'priority' ? 'selected' : ''}>Sort by Priority</option>
              <option value="title" ${sortKey === 'title' ? 'selected' : ''}>Sort by Title</option>
            </select>
          </div>

          <button class="btn btn-primary" onclick="UIComponents.openModal('add-task-modal')">+ Create Task</button>
        </div>

        ${tasks.length === 0 ? UIComponents.renderEmptyState(
          'No Tasks Yet',
          'Create your first placement task to track your progress on the Kanban board!',
          `<button class="btn btn-primary" onclick="UIComponents.openModal('add-task-modal')">+ Create First Task</button>`
        ) : `
          <div class="kanban-board">
            <!-- Column 1: Pending -->
            <div class="kanban-column">
              <div class="column-header">
                <div class="column-title">⏳ Pending <span class="column-count">${pending.length}</span></div>
              </div>
              <div class="task-list">
                ${pending.map(t => TaskManagerView.renderTaskCard(t)).join('')}
              </div>
            </div>

            <!-- Column 2: In Progress -->
            <div class="kanban-column">
              <div class="column-header">
                <div class="column-title">⚡ In Progress <span class="column-count">${inProgress.length}</span></div>
              </div>
              <div class="task-list">
                ${inProgress.map(t => TaskManagerView.renderTaskCard(t)).join('')}
              </div>
            </div>

            <!-- Column 3: Completed -->
            <div class="kanban-column">
              <div class="column-header">
                <div class="column-title">✅ Completed <span class="column-count">${completed.length}</span></div>
              </div>
              <div class="task-list">
                ${completed.map(t => TaskManagerView.renderTaskCard(t)).join('')}
              </div>
            </div>
          </div>
        `}
      </div>
    `;
  }

  static renderTaskCard(t) {
    return `
      <div class="task-card" tabindex="0">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
          <span class="priority-pill ${t.priority}">${t.priority}</span>
          <span style="font-size:0.75rem; color:var(--text-muted);">${t.category}</span>
        </div>
        <div style="font-weight:600; font-size:0.925rem; margin-bottom:0.5rem;">${t.title}</div>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-bottom:0.5rem;">
          <span>Due: ${t.deadline || 'No date'}</span>
          <span>Est: ${t.estTime || '2h'}</span>
        </div>
        <div class="progress-bar-bg" style="height:5px;">
          <div class="progress-bar-fill" style="width:${t.progress || 0}%;"></div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.75rem;">
          <div style="display:flex; gap:0.25rem;">
            <button class="btn btn-sm btn-outline" style="font-size:0.7rem;" title="Duplicate Task" onclick="window.appState.duplicateTask('${t.id}')">📋 Copy</button>
            <button class="btn btn-sm btn-outline" style="font-size:0.7rem; color:var(--danger);" title="Delete Task" onclick="if(confirm('Delete task?')) window.appState.deleteTask('${t.id}')">✕</button>
          </div>

          <div style="display:flex; gap:0.25rem;">
            ${t.status !== 'pending' ? `<button class="btn btn-sm btn-outline" style="font-size:0.7rem;" onclick="window.appState.updateTask('${t.id}', {status:'pending', progress:0})">Pending</button>` : ''}
            ${t.status !== 'in-progress' ? `<button class="btn btn-sm btn-outline" style="font-size:0.7rem;" onclick="window.appState.updateTask('${t.id}', {status:'in-progress', progress:50})">In Progress</button>` : ''}
            ${t.status !== 'completed' ? `<button class="btn btn-sm btn-outline" style="font-size:0.7rem; background:var(--success-bg); color:var(--success);" onclick="window.appState.updateTask('${t.id}', {status:'completed', progress:100})">Done ✓</button>` : ''}
          </div>
        </div>
      </div>
    `;
  }
}
