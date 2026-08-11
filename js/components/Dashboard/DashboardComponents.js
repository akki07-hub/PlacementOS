/* ==========================================================================
   DashboardComponents.js - Modular Dashboard UI Widgets
   ========================================================================== */

export class DashboardComponents {
  static renderKPICards(kpis) {
    return `
      <div class="grid-cols-6">
        <div class="card kpi-card">
          <div class="kpi-icon" style="background:var(--primary-100); color:var(--primary-600);" aria-hidden="true">🎯</div>
          <div>
            <div class="kpi-val">${kpis.overallProgress}%</div>
            <div class="kpi-label">Overall Progress</div>
          </div>
        </div>

        <div class="card kpi-card">
          <div class="kpi-icon" style="background:var(--accent-purple-500); color:#fff;" aria-hidden="true">🚀</div>
          <div>
            <div class="kpi-val">${kpis.readinessScore}</div>
            <div class="kpi-label">Readiness Score</div>
          </div>
        </div>

        <div class="card kpi-card">
          <div class="kpi-icon" style="background:rgba(245, 158, 11, 0.15); color:var(--warning);" aria-hidden="true">🔥</div>
          <div>
            <div class="kpi-val">${kpis.currentStreak} Days</div>
            <div class="kpi-label">Current Streak</div>
          </div>
        </div>

        <div class="card kpi-card">
          <div class="kpi-icon" style="background:rgba(99, 102, 241, 0.15); color:var(--accent-indigo-500);" aria-hidden="true">⚡</div>
          <div>
            <div class="kpi-val">${kpis.longestStreak} Days</div>
            <div class="kpi-label">Longest Streak</div>
          </div>
        </div>

        <div class="card kpi-card">
          <div class="kpi-icon" style="background:var(--success-bg); color:var(--success);" aria-hidden="true">✅</div>
          <div>
            <div class="kpi-val">${kpis.completedTasks}</div>
            <div class="kpi-label">Completed Tasks</div>
          </div>
        </div>

        <div class="card kpi-card">
          <div class="kpi-icon" style="background:var(--danger-bg); color:var(--danger);" aria-hidden="true">⏳</div>
          <div>
            <div class="kpi-val">${kpis.pendingTasks}</div>
            <div class="kpi-label">Pending Tasks</div>
          </div>
        </div>
      </div>
    `;
  }

  static renderRecommendationPanel(recommendations) {
    return `
      <div class="card">
        <div class="card-header">
          <div class="card-title">💡 Dynamic Recommendations</div>
        </div>
        <div class="recommendation-list">
          ${recommendations.map(rec => `
            <div class="recommendation-item">
              <div>
                <div class="rec-title">${rec.title}</div>
                <div class="rec-cat">${rec.category} • ${rec.priority}</div>
              </div>
              <button class="btn btn-sm btn-primary" onclick="window.location.hash='${rec.actionLink}'">${rec.actionLabel}</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  static renderDeadlinesPanel(deadlines) {
    return `
      <div class="card">
        <div class="card-header">
          <div class="card-title">📅 Upcoming Deadlines</div>
        </div>
        <div class="deadline-list">
          ${deadlines.map(t => `
            <div class="deadline-item ${t.priority}">
              <div>
                <div style="font-weight:600; font-size:0.9rem;">${t.title}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${t.category} • Due: ${t.deadline}</div>
              </div>
              <span class="priority-pill ${t.priority}">${t.priority}</span>
            </div>
          `).join('')}
          ${deadlines.length === 0 ? `<div style="text-align:center; color:var(--text-muted); padding:1rem;">No upcoming pending deadlines!</div>` : ''}
        </div>
      </div>
    `;
  }
}
