/* ==========================================================================
   TaskComponents.js - Modular Kanban Task UI Widgets
   ========================================================================== */

export class TaskComponents {
  static renderTaskCard(t) {
    return `
      <div class="task-card" tabindex="0" aria-label="Task card ${t.title}">
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
