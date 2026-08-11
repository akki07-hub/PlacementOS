/* ==========================================================================
   CareerGoalsView.js - Interactive Career & Target Company Selector
   ========================================================================== */

import { UIComponents } from '../components/UIComponents.js';

export class CareerGoalsView {
  static render(container, appState) {
    const data = appState.data;
    const currentRole = data.user.targetRole || 'Software Engineer';
    const selectedCompanies = data.user.targetCompanies || [];

    container.innerHTML = `
      <div>
        <div class="career-section-title">Select Your Target Career Role</div>
        <div class="career-grid">
          ${data.careerRoles.map(role => {
            const isSel = role.title === currentRole;
            return `
              <div class="career-card ${isSel ? 'selected' : ''}" id="role-card-${role.id}" tabindex="0" role="button" aria-pressed="${isSel}">
                <div class="career-card-check">${isSel ? '✓' : ''}</div>
                <div style="font-size:2rem; margin-bottom:0.5rem;" aria-hidden="true">${role.icon}</div>
                <div style="font-weight:700; font-size:1.05rem; margin-bottom:0.25rem;">${role.title}</div>
                <div style="font-size:0.8rem; color:var(--text-muted);">${role.desc}</div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="career-section-title" style="margin-top:2rem;">Select Target Companies</div>
        <div class="company-grid">
          ${data.companies.map(comp => {
            const isSel = selectedCompanies.includes(comp.name);
            return `
              <div class="company-card ${isSel ? 'selected' : ''}" id="comp-card-${comp.id}" tabindex="0" role="button" aria-pressed="${isSel}">
                <div class="company-logo-avatar">${comp.logo}</div>
                <div style="font-weight:700; font-size:0.95rem;">${comp.name}</div>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${comp.tier}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Event binding
    data.careerRoles.forEach(role => {
      const card = document.getElementById(`role-card-${role.id}`);
      if (card) {
        card.addEventListener('click', () => {
          appState.data.user.targetRole = role.title;
          appState.notify();
          UIComponents.showToast(`Target role updated to ${role.title}!`, 'success');
        });
      }
    });

    data.companies.forEach(comp => {
      const card = document.getElementById(`comp-card-${comp.id}`);
      if (card) {
        card.addEventListener('click', () => {
          const list = appState.data.user.targetCompanies || [];
          const idx = list.indexOf(comp.name);
          if (idx >= 0) list.splice(idx, 1);
          else list.push(comp.name);
          appState.data.user.targetCompanies = list;
          appState.notify();
          UIComponents.showToast(`Updated target companies list`, 'info');
        });
      }
    });
  }
}
