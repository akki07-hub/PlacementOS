/* ==========================================================================
   SkillTrackerView.js - Full CRUD Skill Mastery Tracker with Radar Chart
   ========================================================================== */

import { UIComponents } from '../components/UIComponents.js';
import { ChartEngine } from '../components/ChartEngine.js';

export class SkillTrackerView {
  static render(container, appState) {
    const skills = appState.data.skills || [];
    const categories = ['Programming', 'DSA', 'Projects', 'Resume', 'Communication', 'Interview', 'Aptitude', 'Other'];
    const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.75rem;">

        <!-- Add Skill Form Card -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">⚡ Add New Skill</div>
          </div>
          <form id="add-skill-form" style="display:flex; gap:1rem; flex-wrap:wrap; align-items:flex-end;">
            <div class="form-group" style="flex:2; min-width:180px;">
              <label class="form-label">Skill Name *</label>
              <input type="text" id="skill-name-input" class="form-control" placeholder="e.g. React.js, LeetCode, System Design" required>
            </div>
            <div class="form-group" style="flex:1; min-width:140px;">
              <label class="form-label">Category *</label>
              <select id="skill-cat-input" class="form-control">
                ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>
            <div class="form-group" style="flex:1; min-width:120px;">
              <label class="form-label">Level</label>
              <select id="skill-level-input" class="form-control">
                ${levels.map(l => `<option value="${l}">${l}</option>`).join('')}
              </select>
            </div>
            <div class="form-group" style="flex:1; min-width:140px;">
              <label class="form-label">Mastery % (0–100)</label>
              <input type="number" id="skill-pct-input" class="form-control" value="0" min="0" max="100">
            </div>
            <div class="form-group" style="flex:0 0 auto;">
              <button type="submit" class="btn btn-primary" style="margin-top:1.5rem;">+ Add Skill</button>
            </div>
          </form>
        </div>

        ${skills.length === 0 ? UIComponents.renderEmptyState(
          'No Skills Tracked Yet',
          'Add your first skill above! Skills track your technical proficiency across different domains.',
          ''
        ) : `
        <!-- Skill Radar Chart -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Skill Mastery Radar</div>
            <span class="nav-badge">${skills.length} Skills</span>
          </div>
          <div id="skill-radar-container" style="max-width:320px; margin:0 auto;"></div>
        </div>

        <!-- Skill Cards Grid -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Skill Mastery Board</div>
          </div>
          <div class="skill-grid" id="skill-grid">
            ${skills.map(s => SkillTrackerView.renderSkillCard(s, levels)).join('')}
          </div>
        </div>
        `}
      </div>
    `;

    // Add skill form submit
    const form = document.getElementById('add-skill-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('skill-name-input').value.trim();
        const category = document.getElementById('skill-cat-input').value;
        const level = document.getElementById('skill-level-input').value;
        const percent = Math.min(100, Math.max(0, parseInt(document.getElementById('skill-pct-input').value) || 0));

        if (!name) return;

        appState.addSkill({ name, category, level, percent });
        form.reset();
        document.getElementById('skill-pct-input').value = 0;
        UIComponents.showToast(`Skill "${name}" added!`, 'success');
      });
    }

    // Render radar chart
    if (skills.length > 0) {
      setTimeout(() => {
        ChartEngine.renderSkillRadar(
          document.getElementById('skill-radar-container'),
          skills.slice(0, 8) // limit to 8 for radar readability
        );
      }, 50);
    }
  }

  static renderSkillCard(s, levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']) {
    const circumference = 175.9;
    const offset = circumference - (circumference * (s.percent || 0)) / 100;
    return `
      <div class="skill-card" data-skill-id="${s.id}">
        <div class="skill-circle-wrap">
          <svg width="70" height="70" viewBox="0 0 70 70" aria-hidden="true">
            <circle cx="35" cy="35" r="28" fill="none" stroke="var(--bg-subtle)" stroke-width="6"/>
            <circle cx="35" cy="35" r="28" fill="none" stroke="var(--primary-500)" stroke-width="6"
              stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
              stroke-linecap="round" transform="rotate(-90 35 35)" style="transition:stroke-dashoffset 0.8s ease;"/>
          </svg>
          <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.85rem;">
            ${s.percent || 0}%
          </div>
        </div>
        <div style="flex:1;">
          <div style="font-weight:700; font-size:1rem; margin-bottom:2px;">${s.name}</div>
          <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:6px;">${s.category}</div>
          <span class="skill-level-badge">${s.level || 'Beginner'}</span>
        </div>

        <!-- Inline Skill Controls -->
        <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.75rem; padding-top:0.75rem; border-top:1px solid var(--border-subtle);">
          <div style="display:flex; gap:0.4rem; align-items:center; flex-wrap:wrap;">
            <input type="range" min="0" max="100" value="${s.percent || 0}" step="5"
              style="flex:1; min-width:80px; accent-color:var(--primary-500);"
              oninput="SkillTrackerView.updatePercent('${s.id}', this.value)"
              title="Adjust mastery percentage">
            <span style="font-size:0.8rem; font-weight:600; min-width:34px; text-align:right;">${s.percent || 0}%</span>
          </div>
          <div style="display:flex; gap:0.4rem;">
            <select class="form-control" style="flex:1; padding:0.3rem 0.5rem; font-size:0.78rem;"
              onchange="SkillTrackerView.updateLevel('${s.id}', this.value)">
              ${levels.map(l => `<option value="${l}" ${l === s.level ? 'selected' : ''}>${l}</option>`).join('')}
            </select>
            <button class="btn btn-sm btn-outline" style="color:var(--danger); font-size:0.75rem;"
              onclick="if(confirm('Delete skill &quot;${s.name}&quot;?')) SkillTrackerView.deleteSkill('${s.id}')" title="Delete skill">✕</button>
          </div>
        </div>
      </div>
    `;
  }

  static updatePercent(skillId, value) {
    const pct = Math.min(100, Math.max(0, parseInt(value) || 0));
    window.appState.updateSkill(skillId, { percent: pct });
  }

  static updateLevel(skillId, level) {
    window.appState.updateSkill(skillId, { level });
  }

  static deleteSkill(skillId) {
    window.appState.deleteSkill(skillId);
    UIComponents.showToast('Skill removed.', 'info');
  }
}

window.SkillTrackerView = SkillTrackerView;
