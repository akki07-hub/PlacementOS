/* ==========================================================================
   SettingsView.js - System Settings, Preferences & Account Management
   ========================================================================== */

import { UIComponents } from '../components/UIComponents.js';

export class SettingsView {
  static render(container, appState) {
    const data = appState.data;
    const u = data.user;
    const totalTasks = (data.tasks || []).length;
    const completedTasks = (data.tasks || []).filter(t => t.status === 'completed').length;
    const totalSkills = (data.skills || []).length;
    const unlockedAchievements = (data.achievements || []).filter(a => a.unlocked).length;
    const currentTheme = data.theme || 'light';
    const storageEstimate = (() => {
      try {
        const raw = localStorage.getItem('PLACEMENT_ROADMAP_STATE_V2') || '';
        return (raw.length / 1024).toFixed(1) + ' KB';
      } catch { return 'N/A'; }
    })();

    container.innerHTML = `
      <div style="max-width:800px; display:flex; flex-direction:column; gap:1.75rem;">

        <!-- Account Summary Card -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Account Summary</div>
            <a href="#profile" class="btn btn-sm btn-outline">Edit Profile →</a>
          </div>
          ${u && u.onboardingCompleted ? `
            <div style="display:flex; align-items:center; gap:1.25rem; flex-wrap:wrap;">
              <div style="width:56px; height:56px; border-radius:50%; background:var(--primary-500); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1.25rem; flex-shrink:0;">
                ${u.avatar || 'ST'}
              </div>
              <div style="flex:1;">
                <div style="font-weight:700; font-size:1.1rem;">${u.name}</div>
                <div style="font-size:0.85rem; color:var(--text-muted);">${u.email} • ${u.college} • Class of ${u.gradYear}</div>
                <div style="font-size:0.85rem; color:var(--text-muted);">Target: ${u.targetRole} • CGPA: ${u.cgpa}</div>
              </div>
              <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:0.75rem; flex-shrink:0;">
                <div style="text-align:center; padding:0.5rem 1rem; background:var(--bg-subtle); border-radius:var(--radius-md);">
                  <div style="font-size:1.5rem; font-weight:800;">${completedTasks}/${totalTasks}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">Tasks Done</div>
                </div>
                <div style="text-align:center; padding:0.5rem 1rem; background:var(--bg-subtle); border-radius:var(--radius-md);">
                  <div style="font-size:1.5rem; font-weight:800;">${unlockedAchievements}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">Badges</div>
                </div>
              </div>
            </div>
          ` : `
            <div style="color:var(--text-muted);">No profile found. <button class="btn btn-sm btn-primary" onclick="window.OnboardingWizard.show(window.appState)">Complete Setup</button></div>
          `}
        </div>

        <!-- Application Preferences -->
        <div class="card">
          <div class="card-title" style="margin-bottom:1.25rem;">⚙️ Application Preferences</div>

          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.85rem 0; border-bottom:1px solid var(--border-subtle);">
            <div>
              <div style="font-weight:600; font-size:0.95rem;">Theme Mode</div>
              <div style="font-size:0.8rem; color:var(--text-muted);">Currently: <strong>${currentTheme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}</strong></div>
            </div>
            <button class="btn btn-outline" onclick="document.getElementById('theme-toggle').click()" id="settings-theme-btn">
              Switch to ${currentTheme === 'dark' ? '☀️ Light' : '🌙 Dark'} Mode
            </button>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.85rem 0; border-bottom:1px solid var(--border-subtle);">
            <div>
              <div style="font-weight:600; font-size:0.95rem;">LocalStorage Usage</div>
              <div style="font-size:0.8rem; color:var(--text-muted);">Current data stored: <strong>${storageEstimate}</strong> — ${totalTasks} tasks, ${totalSkills} skills</div>
            </div>
            <span class="nav-badge" style="background:var(--success-bg); color:var(--success);">✓ Connected</span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.85rem 0;">
            <div>
              <div style="font-weight:600; font-size:0.95rem;">Load Sample Demo Data</div>
              <div style="font-size:0.8rem; color:var(--text-muted);">Pre-populate with realistic placement student data for demonstration</div>
            </div>
            <button class="btn btn-secondary" onclick="if(confirm('This will replace your current data with demo data. Continue?')){ window.appState.loadDemoData(); UIComponents.showToast('Demo data loaded successfully!', 'success'); }">
              Load Demo Data
            </button>
          </div>
        </div>

        <!-- Data Management -->
        <div class="card">
          <div class="card-title" style="margin-bottom:1.25rem;">💾 Data Management</div>

          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.85rem 0; border-bottom:1px solid var(--border-subtle);">
            <div>
              <div style="font-weight:600; font-size:0.95rem;">Export Backup</div>
              <div style="font-size:0.8rem; color:var(--text-muted);">Download a full JSON backup of all your progress data</div>
            </div>
            <button class="btn btn-outline" onclick="window.ExportService.exportJSON(window.appState.data)">📥 Export JSON</button>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.85rem 0; border-bottom:1px solid var(--border-subtle);">
            <div>
              <div style="font-weight:600; font-size:0.95rem;">Export PDF Report</div>
              <div style="font-size:0.8rem; color:var(--text-muted);">Generate a printable placement readiness summary report</div>
            </div>
            <button class="btn btn-outline" onclick="window.ExportService.printPDF()">📄 Print / Save PDF</button>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.85rem 0;">
            <div>
              <div style="font-weight:600; font-size:0.95rem;">Export Task List (CSV)</div>
              <div style="font-size:0.8rem; color:var(--text-muted);">Download all tasks as a spreadsheet-compatible CSV file</div>
            </div>
            <button class="btn btn-outline" onclick="window.ExportService.exportCSV(window.appState.data.tasks)">📊 Download CSV</button>
          </div>
        </div>

        <!-- About -->
        <div class="card">
          <div class="card-title" style="margin-bottom:0.75rem;">ℹ️ About PlacementOS</div>
          <p style="font-size:0.875rem; color:var(--text-muted); line-height:1.7;">
            PlacementOS v2.0 is a modern Student Career Roadmap & Placement Readiness System.
            All data is stored locally in your browser's LocalStorage — no server, no account required.
            Built with pure HTML, CSS (Vanilla), and ES6 JavaScript modules.
          </p>
          <div style="display:flex; gap:0.75rem; margin-top:1rem; flex-wrap:wrap;">
            <span class="nav-badge" style="background:var(--primary-100); color:var(--primary-600);">HTML5</span>
            <span class="nav-badge" style="background:var(--primary-100); color:var(--primary-600);">Vanilla CSS</span>
            <span class="nav-badge" style="background:var(--primary-100); color:var(--primary-600);">ES6 Modules</span>
            <span class="nav-badge" style="background:var(--primary-100); color:var(--primary-600);">LocalStorage</span>
            <span class="nav-badge" style="background:var(--primary-100); color:var(--primary-600);">No Dependencies</span>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="card" style="border-color:var(--danger-bg); border-width:1.5px;">
          <div class="card-title" style="color:var(--danger); margin-bottom:0.5rem;">⚠️ Danger Zone</div>
          <p style="color:var(--text-muted); font-size:0.875rem; margin-bottom:1.25rem;">
            Resetting will permanently clear all tasks, milestones, skills, history, and achievements.
            Your data is stored only in this browser — it <strong>cannot be recovered</strong> after reset.
          </p>
          <div style="display:flex; gap:1rem; flex-wrap:wrap;">
            <button class="btn" style="background:var(--danger); color:#fff; font-weight:600;"
              onclick="if(confirm('⚠️ This will permanently delete ALL your progress data and cannot be undone. Are you absolutely sure?')){
                window.appState.resetAllData();
                UIComponents.showToast('All data has been reset. Starting fresh...', 'info');
                window.OnboardingWizard.show(window.appState);
              }">
              🗑️ Reset All Progress Data
            </button>
          </div>
        </div>

      </div>
    `;
  }
}
