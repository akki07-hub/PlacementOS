/* ==========================================================================
   Views Engine - SPA Renderers for 12 Dedicated Pages
   Student Career Roadmap & Placement Readiness System
   ========================================================================== */

const ViewRenderers = {
  // 1. Dashboard View
  renderDashboard(container) {
    const state = window.appState;
    const data = state.data;
    const overallProgress = state.getOverallProgress();
    const readinessScore = state.getPlacementReadinessScore();
    const readinessLevel = state.getReadinessLevel(readinessScore);

    const completedTasks = data.tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = data.tasks.filter(t => t.status !== 'completed').length;

    container.innerHTML = `
      <div class="dashboard-layout">
        <!-- Top 6 KPI Cards -->
        <div class="grid-cols-6">
          <div class="card kpi-card">
            <div class="kpi-icon" style="background:var(--primary-100); color:var(--primary-600);">🎯</div>
            <div>
              <div class="kpi-val">${overallProgress}%</div>
              <div class="kpi-label">Overall Progress</div>
            </div>
          </div>

          <div class="card kpi-card">
            <div class="kpi-icon" style="background:var(--accent-purple-500); color:#fff;">🚀</div>
            <div>
              <div class="kpi-val">${readinessScore}</div>
              <div class="kpi-label">Readiness Score</div>
            </div>
          </div>

          <div class="card kpi-card">
            <div class="kpi-icon" style="background:rgba(245, 158, 11, 0.15); color:var(--warning);">🔥</div>
            <div>
              <div class="kpi-val">${data.stats.currentStreak} Days</div>
              <div class="kpi-label">Current Streak</div>
            </div>
          </div>

          <div class="card kpi-card">
            <div class="kpi-icon" style="background:rgba(99, 102, 241, 0.15); color:var(--accent-indigo-500);">⚡</div>
            <div>
              <div class="kpi-val">${data.stats.longestStreak} Days</div>
              <div class="kpi-label">Longest Streak</div>
            </div>
          </div>

          <div class="card kpi-card">
            <div class="kpi-icon" style="background:var(--success-bg); color:var(--success);">✅</div>
            <div>
              <div class="kpi-val">${completedTasks}</div>
              <div class="kpi-label">Completed Tasks</div>
            </div>
          </div>

          <div class="card kpi-card">
            <div class="kpi-icon" style="background:var(--danger-bg); color:var(--danger);">⏳</div>
            <div>
              <div class="kpi-val">${pendingTasks}</div>
              <div class="kpi-label">Pending Tasks</div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
          <div class="card chart-card-lg">
            <div class="card-header">
              <div class="card-title">Weekly Progress Trend</div>
              <span class="nav-badge" style="background:var(--primary-100); color:var(--primary-600);">Hours Spent</span>
            </div>
            <canvas id="dash-weekly-canvas"></canvas>
          </div>

          <div class="card chart-card-sm">
            <div class="card-header">
              <div class="card-title">Skill Mastery Radar</div>
            </div>
            <div id="dash-radar-container"></div>
          </div>
        </div>

        <!-- Horizontal Category Completion & Monthly Progress -->
        <div class="grid-cols-2">
          <div class="card">
            <div class="card-header">
              <div class="card-title">Category Completion</div>
            </div>
            <div style="display:flex; flex-direction:column; gap:1rem;">
              ${data.roadmap.map(cat => {
                const total = cat.milestones.length;
                const done = cat.milestones.filter(m => m.completed).length;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return `
                  <div>
                    <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:4px;">
                      <span>${cat.icon} ${cat.category}</span>
                      <span>${pct}%</span>
                    </div>
                    <div class="progress-bar-bg">
                      <div class="progress-bar-fill" style="width: ${pct}%;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Monthly Progress</div>
            </div>
            <canvas id="dash-monthly-canvas"></canvas>
          </div>
        </div>

        <!-- Recommendations & Upcoming Deadlines Panels -->
        <div class="panels-section">
          <div class="card">
            <div class="card-header">
              <div class="card-title">💡 Personalized Recommendations</div>
            </div>
            <div class="recommendation-list">
              <div class="recommendation-item">
                <div>
                  <div class="rec-title">Complete JavaScript Basics</div>
                  <div class="rec-cat">Programming • High Impact</div>
                </div>
                <button class="btn btn-sm btn-primary" onclick="window.location.hash='#roadmap'">Start</button>
              </div>

              <div class="recommendation-item">
                <div>
                  <div class="rec-title">Practice DSA Arrays & LeetCode</div>
                  <div class="rec-cat">Data Structures • Critical</div>
                </div>
                <button class="btn btn-sm btn-primary" onclick="window.location.hash='#task-manager'">Practice</button>
              </div>

              <div class="recommendation-item">
                <div>
                  <div class="rec-title">Build Portfolio Project</div>
                  <div class="rec-cat">Projects • High Priority</div>
                </div>
                <button class="btn btn-sm btn-primary" onclick="window.location.hash='#roadmap'">Build</button>
              </div>

              <div class="recommendation-item">
                <div>
                  <div class="rec-title">Update Resume with ATS Keywords</div>
                  <div class="rec-cat">Resume • Quick Win</div>
                </div>
                <button class="btn btn-sm btn-primary" onclick="window.location.hash='#task-manager'">Update</button>
              </div>

              <div class="recommendation-item">
                <div>
                  <div class="rec-title">Improve Communication & STAR Method</div>
                  <div class="rec-cat">Interview • Soft Skills</div>
                </div>
                <button class="btn btn-sm btn-primary" onclick="window.location.hash='#roadmap'">Prepare</button>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">📅 Upcoming Deadlines</div>
            </div>
            <div class="deadline-list">
              <div class="deadline-item today">
                <div>
                  <div style="font-weight:600; font-size:0.9rem;">Practice DSA Arrays & Sliding Window</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">Today's Task • High Priority</div>
                </div>
                <span class="priority-pill high">Due Today</span>
              </div>

              <div class="deadline-item tomorrow">
                <div>
                  <div style="font-weight:600; font-size:0.9rem;">Build Full Stack SaaS Dashboard UI</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">Tomorrow's Task • Projects</div>
                </div>
                <span class="priority-pill medium">Tomorrow</span>
              </div>

              <div class="deadline-item upcoming">
                <div>
                  <div style="font-weight:600; font-size:0.9rem;">Trees & Graph Traversal Milestone</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">Upcoming Milestone • DSA</div>
                </div>
                <span class="priority-pill low">Aug 05</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Render Charts
    setTimeout(() => {
      window.ChartEngine.renderLineChart(
        document.getElementById('dash-weekly-canvas'),
        [4, 6.5, 5, 8, 7.5, 9, 10.5],
        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      );

      window.ChartEngine.renderBarChart(
        document.getElementById('dash-monthly-canvas'),
        [45, 62, 78, 90, 110, 125],
        ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
      );

      window.ChartEngine.renderSkillRadar(
        document.getElementById('dash-radar-container'),
        data.skills
      );
    }, 50);
  },

  // 2. Profile View
  renderProfile(container) {
    const u = window.appState.data.user;
    container.innerHTML = `
      <div class="profile-header-card">
        <div class="profile-avatar-lg">${u.avatar}</div>
        <div class="profile-meta">
          <h2>${u.name}</h2>
          <p>${u.college} • Class of ${u.gradYear}</p>
          <div class="profile-tags">
            <span class="tag-pill">Target: ${u.targetRole}</span>
            <span class="tag-pill">CGPA: ${u.cgpa}</span>
            ${u.targetCompanies.map(c => `<span class="tag-pill">${c}</span>`).join('')}
          </div>
        </div>
      </div>

      <div class="grid-cols-2">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Student Details</div>
            <button class="btn btn-sm btn-outline" onclick="UIComponents.openModal('edit-profile-modal')">Edit Profile</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:1rem;">
            <div><strong>Email:</strong> ${u.email}</div>
            <div><strong>College / Institution:</strong> ${u.college}</div>
            <div><strong>Graduation Year:</strong> ${u.gradYear}</div>
            <div><strong>Current CGPA:</strong> ${u.cgpa}</div>
            <div><strong>Bio:</strong> ${u.bio}</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">Target Preferences</div>
          </div>
          <div style="display:flex; flex-direction:column; gap:1rem;">
            <div><strong>Selected Target Role:</strong> ${u.targetRole}</div>
            <div><strong>Dream Target Companies:</strong> ${u.targetCompanies.join(', ')}</div>
            <div><strong>Placement Status:</strong> Active Preparation</div>
          </div>
        </div>
      </div>
    `;
  },

  // 3. Career Goals View
  renderCareerGoals(container) {
    const data = window.appState.data;
    const currentRole = data.user.targetRole;
    const selectedCompanies = data.user.targetCompanies;

    container.innerHTML = `
      <div>
        <div class="career-section-title">Select Your Target Career Role</div>
        <div class="career-grid">
          ${data.careerRoles.map(role => {
            const isSel = role.title === currentRole;
            return `
              <div class="career-card ${isSel ? 'selected' : ''}" onclick="ViewRenderers.setTargetRole('${role.title}')">
                <div class="career-card-check">${isSel ? '✓' : ''}</div>
                <div style="font-size:2rem; margin-bottom:0.5rem;">${role.icon}</div>
                <div style="font-weight:700; font-size:1.05rem; margin-bottom:0.25rem;">${role.title}</div>
                <div style="font-size:0.8rem; color:var(--text-muted);">${role.desc}</div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="career-section-title" style="margin-top:2rem;">Select Your Target Companies</div>
        <div class="company-grid">
          ${data.companies.map(comp => {
            const isSel = selectedCompanies.includes(comp.name);
            return `
              <div class="company-card ${isSel ? 'selected' : ''}" onclick="ViewRenderers.toggleTargetCompany('${comp.name}')">
                <div class="company-logo-avatar">${comp.logo}</div>
                <div style="font-weight:700; font-size:0.95rem;">${comp.name}</div>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${comp.tier}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  setTargetRole(roleTitle) {
    window.appState.data.user.targetRole = roleTitle;
    window.appState.saveState();
    UIComponents.showToast(`Target Career updated to ${roleTitle}!`, 'success');
    ViewRenderers.renderCareerGoals(document.getElementById('page-career-goals'));
  },

  toggleTargetCompany(compName) {
    const list = window.appState.data.user.targetCompanies;
    const idx = list.indexOf(compName);
    if (idx >= 0) list.splice(idx, 1);
    else list.push(compName);
    window.appState.saveState();
    UIComponents.showToast(`Updated target companies list`, 'info');
    ViewRenderers.renderCareerGoals(document.getElementById('page-career-goals'));
  },

  // 4. Roadmap View
  renderRoadmap(container) {
    const roadmap = window.appState.data.roadmap;

    container.innerHTML = `
      <div class="roadmap-accordion">
        ${roadmap.map((cat, idx) => {
          const total = cat.milestones.length;
          const done = cat.milestones.filter(m => m.completed).length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          return `
            <div class="roadmap-category-card ${idx === 0 ? 'open' : ''}" id="cat-card-${cat.id}">
              <div class="category-header" onclick="document.getElementById('cat-card-${cat.id}').classList.toggle('open')">
                <div class="category-title-group">
                  <div class="category-icon-box">${cat.icon}</div>
                  <div>
                    <div style="font-weight:700; font-size:1.1rem;">${cat.category}</div>
                    <div style="font-size:0.8rem; color:var(--text-muted);">${done} of ${total} milestones completed (${pct}%)</div>
                  </div>
                </div>
                <span class="nav-badge" style="background:var(--primary-100); color:var(--primary-600); font-weight:700;">${pct}%</span>
              </div>
              <div class="category-body">
                <div class="milestones-list">
                  ${cat.milestones.map(m => `
                    <div class="milestone-item">
                      <label class="milestone-checkbox-label">
                        <input type="checkbox" ${m.completed ? 'checked' : ''} onchange="window.appState.toggleMilestone('${m.id}'); ViewRenderers.renderRoadmap(document.getElementById('page-roadmap'));">
                        <span style="${m.completed ? 'text-decoration:line-through; color:var(--text-muted);' : ''}">${m.title}</span>
                      </label>
                      <span class="nav-badge">${m.completed ? 'Completed' : 'Pending'}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // 5. Task Manager (Kanban) View
  renderTaskManager(container) {
    const tasks = window.appState.data.tasks;
    const pending = tasks.filter(t => t.status === 'pending');
    const inProgress = tasks.filter(t => t.status === 'in-progress');
    const completed = tasks.filter(t => t.status === 'completed');

    container.innerHTML = `
      <div>
        <div class="kanban-filter-bar">
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-sm btn-outline">All Categories</button>
            <button class="btn btn-sm btn-outline">All Priorities</button>
          </div>
          <button class="btn btn-primary" onclick="UIComponents.openModal('add-task-modal')">+ Add Task</button>
        </div>

        <div class="kanban-board">
          <!-- Column 1: Pending -->
          <div class="kanban-column">
            <div class="column-header">
              <div class="column-title">⏳ Pending <span class="column-count">${pending.length}</span></div>
            </div>
            <div class="task-list">
              ${pending.map(t => ViewRenderers.renderTaskCard(t)).join('')}
            </div>
          </div>

          <!-- Column 2: In Progress -->
          <div class="kanban-column">
            <div class="column-header">
              <div class="column-title">⚡ In Progress <span class="column-count">${inProgress.length}</span></div>
            </div>
            <div class="task-list">
              ${inProgress.map(t => ViewRenderers.renderTaskCard(t)).join('')}
            </div>
          </div>

          <!-- Column 3: Completed -->
          <div class="kanban-column">
            <div class="column-header">
              <div class="column-title">✅ Completed <span class="column-count">${completed.length}</span></div>
            </div>
            <div class="task-list">
              ${completed.map(t => ViewRenderers.renderTaskCard(t)).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderTaskCard(t) {
    return `
      <div class="task-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
          <span class="priority-pill ${t.priority}">${t.priority}</span>
          <span style="font-size:0.75rem; color:var(--text-muted);">${t.category}</span>
        </div>
        <div style="font-weight:600; font-size:0.925rem; margin-bottom:0.5rem;">${t.title}</div>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-bottom:0.5rem;">
          <span>Due: ${t.deadline}</span>
          <span>Est: ${t.estTime || '2h'}</span>
        </div>
        <div class="progress-bar-bg" style="height:5px;">
          <div class="progress-bar-fill" style="width:${t.progress}%;"></div>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.25rem; margin-top:0.75rem;">
          ${t.status !== 'pending' ? `<button class="btn btn-sm btn-outline" style="font-size:0.7rem;" onclick="window.appState.moveTaskStatus('${t.id}', 'pending'); ViewRenderers.renderTaskManager(document.getElementById('page-task-manager'));">← Pending</button>` : ''}
          ${t.status !== 'in-progress' ? `<button class="btn btn-sm btn-outline" style="font-size:0.7rem;" onclick="window.appState.moveTaskStatus('${t.id}', 'in-progress'); ViewRenderers.renderTaskManager(document.getElementById('page-task-manager'));">In Progress</button>` : ''}
          ${t.status !== 'completed' ? `<button class="btn btn-sm btn-outline" style="font-size:0.7rem;" onclick="window.appState.moveTaskStatus('${t.id}', 'completed'); ViewRenderers.renderTaskManager(document.getElementById('page-task-manager'));">Done ✓</button>` : ''}
        </div>
      </div>
    `;
  },

  // 6. Skill Tracker View
  renderSkillTracker(container) {
    const skills = window.appState.data.skills;
    container.innerHTML = `
      <div class="skill-grid">
        ${skills.map(s => `
          <div class="skill-card">
            <div class="skill-circle-wrap">
              <svg width="70" height="70" viewBox="0 0 70 70">
                <circle cx="35" cy="35" r="28" fill="none" stroke="var(--bg-subtle)" stroke-width="6"/>
                <circle cx="35" cy="35" r="28" fill="none" stroke="var(--primary-500)" stroke-width="6"
                  stroke-dasharray="175.9" stroke-dashoffset="${175.9 - (175.9 * s.percent) / 100}"
                  stroke-linecap="round" transform="rotate(-90 35 35)"/>
              </svg>
              <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.85rem;">
                ${s.percent}%
              </div>
            </div>
            <div>
              <div style="font-weight:700; font-size:1rem; margin-bottom:2px;">${s.name}</div>
              <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:6px;">${s.category}</div>
              <span class="skill-level-badge">${s.level}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // 7. Placement Readiness View
  renderPlacementReadiness(container) {
    const state = window.appState;
    const score = state.getPlacementReadinessScore();
    const lvl = state.getReadinessLevel(score);

    container.innerHTML = `
      <div>
        <div class="readiness-hero-card">
          <div id="readiness-gauge-container"></div>
          <div>
            <div style="font-size:0.9rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted); font-weight:700;">Status Level</div>
            <div style="font-size:2rem; font-weight:800; color:${lvl.color}; margin:0.25rem 0;">${lvl.label}</div>
            <p style="color:var(--text-muted); max-width:400px;">Based on your completed roadmap milestones, solved DSA problems, and project portfolio.</p>
          </div>
        </div>

        <div class="card-title" style="margin-bottom:1rem;">Weighted Category Breakdown</div>
        <div class="weighted-scores-grid">
          ${state.data.roadmap.map(cat => {
            const total = cat.milestones.length;
            const done = cat.milestones.filter(m => m.completed).length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return `
              <div class="weighted-bar-item">
                <div style="display:flex; justify-content:space-between; font-weight:600; font-size:0.9rem;">
                  <span>${cat.icon} ${cat.category}</span>
                  <span>${pct}% (Weight: ${cat.weight}%)</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" style="width:${pct}%;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    setTimeout(() => {
      window.ChartEngine.renderCircularGauge(
        document.getElementById('readiness-gauge-container'),
        score,
        'Readiness Score'
      );
    }, 50);
  },

  // 8. Analytics View
  renderAnalytics(container) {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.75rem;">
        <div class="card">
          <div class="card-header">
            <div class="card-title">365-Day Consistency Heatmap</div>
            <span class="nav-badge">Daily Task Submissions</span>
          </div>
          <div class="heatmap-container" id="analytics-heatmap"></div>
        </div>

        <div class="grid-cols-2">
          <div class="card">
            <div class="card-header">
              <div class="card-title">Weekly Productivity (Hours)</div>
            </div>
            <canvas id="analytics-weekly-canvas"></canvas>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Monthly Progress (Tasks Done)</div>
            </div>
            <canvas id="analytics-monthly-canvas"></canvas>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      window.ChartEngine.renderHeatmap(document.getElementById('analytics-heatmap'));
      window.ChartEngine.renderLineChart(document.getElementById('analytics-weekly-canvas'), [5, 8, 6, 9, 11, 12, 14], ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
      window.ChartEngine.renderBarChart(document.getElementById('analytics-monthly-canvas'), [12, 18, 25, 32, 40, 42], ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']);
    }, 50);
  },

  // 9. History View
  renderHistory(container) {
    const history = window.appState.data.history;
    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">Activity Timeline Stream</div>
        </div>
        <div class="timeline-stream">
          ${history.map(item => `
            <div class="timeline-node">
              <div class="timeline-dot">${item.icon}</div>
              <div style="font-weight:600; font-size:0.925rem;">${item.title}</div>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${item.date}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // 10. Achievements View
  renderAchievements(container) {
    const achievements = window.appState.data.achievements;
    container.innerHTML = `
      <div class="badge-grid">
        ${achievements.map(a => `
          <div class="badge-card ${a.unlocked ? 'unlocked' : 'locked'}">
            <div class="badge-icon-lg">${a.icon}</div>
            <div style="font-weight:700; font-size:1.05rem; margin-bottom:0.25rem;">${a.title}</div>
            <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">${a.desc}</div>
            <span class="nav-badge" style="${a.unlocked ? 'background:var(--success-bg); color:var(--success);' : ''}">
              ${a.unlocked ? `Unlocked on ${a.unlockedAt}` : `Locked (${a.progress || 0}%)`}
            </span>
          </div>
        `).join('')}
      </div>
    `;
  },

  // 11. Export View
  renderExport(container) {
    container.innerHTML = `
      <div class="grid-cols-2">
        <div class="card" style="text-align:center; padding:2rem;">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;">📄</div>
          <h3>Download PDF Report</h3>
          <p style="color:var(--text-muted); margin-bottom:1.5rem; font-size:0.9rem;">Generate a clean printable Student Placement Readiness Report.</p>
          <button class="btn btn-primary" onclick="window.print()">Print / Export PDF</button>
        </div>

        <div class="card" style="text-align:center; padding:2rem;">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;">📊</div>
          <h3>Export Excel / CSV</h3>
          <p style="color:var(--text-muted); margin-bottom:1.5rem; font-size:0.9rem;">Download spreadsheet of all your placement tasks & progress.</p>
          <button class="btn btn-secondary" onclick="UIComponents.downloadCSV()">Download CSV</button>
        </div>

        <div class="card" style="text-align:center; padding:2rem;">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;">💾</div>
          <h3>Backup Data</h3>
          <p style="color:var(--text-muted); margin-bottom:1.5rem; font-size:0.9rem;">Export complete JSON state snapshot for local backup.</p>
          <button class="btn btn-outline" onclick="UIComponents.backupJSON()">Export Backup JSON</button>
        </div>

        <div class="card" style="text-align:center; padding:2rem;">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;">🔄</div>
          <h3>Restore Backup</h3>
          <p style="color:var(--text-muted); margin-bottom:1.5rem; font-size:0.9rem;">Restore your progress state from a previously saved JSON file.</p>
          <button class="btn btn-outline" onclick="UIComponents.showToast('Select your JSON backup file to restore', 'info')">Import Backup</button>
        </div>
      </div>
    `;
  },

  // 12. Settings View
  renderSettings(container) {
    const u = window.appState.data.user;
    container.innerHTML = `
      <div style="max-width:700px; display:flex; flex-direction:column; gap:1.5rem;">
        <div class="card">
          <div class="card-title" style="margin-bottom:1.25rem;">Account & Profile Settings</div>
          <form onsubmit="event.preventDefault(); ViewRenderers.saveSettingsForm();">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" id="set-name" class="form-control" value="${u.name}">
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" id="set-email" class="form-control" value="${u.email}">
            </div>
            <div class="form-group">
              <label class="form-label">College / Institution</label>
              <input type="text" id="set-college" class="form-control" value="${u.college}">
            </div>
            <div class="form-group">
              <label class="form-label">Graduation Year</label>
              <input type="text" id="set-grad" class="form-control" value="${u.gradYear}">
            </div>
            <button type="submit" class="btn btn-primary" style="margin-top:0.5rem;">Save Settings</button>
          </form>
        </div>

        <div class="card" style="border-color:var(--danger-bg);">
          <div class="card-title" style="color:var(--danger); margin-bottom:0.5rem;">Danger Zone</div>
          <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:1rem;">Resetting your data will erase all customized roadmap milestones and tasks.</p>
          <button class="btn" style="background:var(--danger); color:#fff;" onclick="if(confirm('Are you sure you want to reset all data?')){ window.appState.resetAllData(); location.reload(); }">Reset All Progress Data</button>
        </div>
      </div>
    `;
  },

  saveSettingsForm() {
    const u = window.appState.data.user;
    u.name = document.getElementById('set-name').value;
    u.email = document.getElementById('set-email').value;
    u.college = document.getElementById('set-college').value;
    u.gradYear = document.getElementById('set-grad').value;
    window.appState.saveState();
    UIComponents.showToast('Profile settings saved successfully!', 'success');
  }
};

window.ViewRenderers = ViewRenderers;
