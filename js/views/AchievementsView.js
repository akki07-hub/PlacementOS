/* ==========================================================================
   AchievementsView.js - Dynamic Badge & Achievements Grid View
   ========================================================================== */

export class AchievementsView {
  static render(container, appState) {
    const achievements = appState.data.achievements || [];

    container.innerHTML = `
      <div class="badge-grid">
        ${achievements.map(a => `
          <div class="badge-card ${a.unlocked ? 'unlocked' : 'locked'}" tabindex="0">
            <div class="badge-icon-lg" aria-hidden="true">${a.icon}</div>
            <div style="font-weight:700; font-size:1.05rem; margin-bottom:0.25rem;">${a.title}</div>
            <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">${a.desc}</div>
            ${!a.unlocked ? `
              <div class="progress-bar-bg" style="height:6px; margin-bottom:0.75rem;">
                <div class="progress-bar-fill" style="width:${a.progress || 0}%;"></div>
              </div>
            ` : ''}
            <span class="nav-badge" style="${a.unlocked ? 'background:var(--success-bg); color:var(--success);' : ''}">
              ${a.unlocked ? `Unlocked on ${a.unlockedAt}` : `Progress: ${a.progress || 0}%`}
            </span>
          </div>
        `).join('')}
      </div>
    `;
  }
}
