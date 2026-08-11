/* ==========================================================================
   HistoryView.js - Dynamic Activity Timeline Stream View
   ========================================================================== */

import { UIComponents } from '../components/UIComponents.js';

export class HistoryView {
  static render(container, appState) {
    const history = appState.data.history || [];

    if (history.length === 0) {
      container.innerHTML = UIComponents.renderEmptyState(
        'No Activity History',
        'As you complete tasks and milestones, your activity stream will automatically log your progress here.'
      );
      return;
    }

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">Activity Timeline Stream</div>
          <span class="nav-badge">${history.length} Logs</span>
        </div>
        <div class="timeline-stream">
          ${history.map(item => `
            <div class="timeline-node">
              <div class="timeline-dot" aria-hidden="true">${item.icon || '📌'}</div>
              <div style="font-weight:600; font-size:0.925rem;">${item.title}</div>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${item.date}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
