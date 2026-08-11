/* ==========================================================================
   RoadmapView.js - Roadmap Category & Milestone CRUD View
   ========================================================================== */

import { UIComponents } from '../components/UIComponents.js';

export class RoadmapView {
  static render(container, appState) {
    const roadmap = appState.data.roadmap;

    if (!roadmap || roadmap.length === 0) {
      container.innerHTML = UIComponents.renderEmptyState(
        'No Roadmap Categories Yet',
        'Start your career roadmap by adding your first category or resetting default categories.'
      );
      return;
    }

    container.innerHTML = `
      <div class="roadmap-accordion">
        ${roadmap.map((cat, idx) => {
          const total = cat.milestones ? cat.milestones.length : 0;
          const done = cat.milestones ? cat.milestones.filter(m => m.completed).length : 0;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          return `
            <div class="roadmap-category-card ${idx === 0 ? 'open' : ''}" id="cat-card-${cat.id}">
              <div class="category-header" onclick="document.getElementById('cat-card-${cat.id}').classList.toggle('open')">
                <div class="category-title-group">
                  <div class="category-icon-box" aria-hidden="true">${cat.icon}</div>
                  <div>
                    <div style="font-weight:700; font-size:1.1rem;">${cat.category}</div>
                    <div style="font-size:0.8rem; color:var(--text-muted);">${done} of ${total} milestones completed (${pct}%)</div>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <span class="nav-badge" style="background:var(--primary-100); color:var(--primary-600); font-weight:700;">${pct}%</span>
                  <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); window.RoadmapView.promptAddMilestone('${cat.id}')">+ Add Milestone</button>
                </div>
              </div>
              <div class="category-body">
                <div class="milestones-list">
                  ${cat.milestones.map(m => `
                    <div class="milestone-item">
                      <label class="milestone-checkbox-label">
                        <input type="checkbox" ${m.completed ? 'checked' : ''} onchange="window.appState.toggleMilestone('${m.id}')">
                        <span style="${m.completed ? 'text-decoration:line-through; color:var(--text-muted);' : ''}">${m.title}</span>
                      </label>
                      <div style="display:flex; gap:0.5rem;">
                        <button class="btn btn-sm btn-outline" onclick="window.RoadmapView.promptEditMilestone('${m.id}', '${m.title.replace(/'/g, "\\'")}')">Edit</button>
                        <button class="btn btn-sm btn-outline" style="color:var(--danger);" onclick="if(confirm('Delete milestone?')) window.appState.deleteMilestone('${m.id}')">✕</button>
                      </div>
                    </div>
                  `).join('')}
                  ${total === 0 ? `<div style="text-align:center; color:var(--text-muted); padding:1rem;">No milestones in this category yet. Click "+ Add Milestone" above!</div>` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  static promptAddMilestone(catId) {
    const title = prompt('Enter new milestone title:');
    if (title && title.trim()) {
      window.appState.addMilestone(catId, title.trim());
      UIComponents.showToast('Milestone added!', 'success');
    }
  }

  static promptEditMilestone(mId, currentTitle) {
    const newTitle = prompt('Edit milestone title:', currentTitle);
    if (newTitle && newTitle.trim()) {
      window.appState.editMilestone(mId, newTitle.trim());
      UIComponents.showToast('Milestone updated!', 'success');
    }
  }
}

window.RoadmapView = RoadmapView;
