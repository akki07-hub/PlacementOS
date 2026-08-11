/* ==========================================================================
   DashboardView.js - Dynamic Dashboard Renderer
   ========================================================================== */

import { ReadinessEngine } from '../models/ReadinessEngine.js';
import { RecommendationEngine } from '../models/RecommendationEngine.js';
import { ChartEngine } from '../components/ChartEngine.js';

// Helper: compute real weekly task data
function computeWeeklyData(tasks) {
  const weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const todayIndex = today.getDay();
  const weekCounts = new Array(7).fill(0);
  tasks.filter(t => t.status === 'completed' && t.createdAt).forEach(t => {
    const d = new Date(t.createdAt);
    const diffDays = Math.floor((today - d) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) weekCounts[d.getDay()]++;
  });
  const reorderedData = [];
  const reorderedLabels = [];
  for (let i = 6; i >= 0; i--) {
    const idx = (todayIndex - i + 7) % 7;
    reorderedData.push(weekCounts[idx]);
    reorderedLabels.push(weekLabels[idx]);
  }
  return { data: reorderedData, labels: reorderedLabels };
}

function computeMonthlyData(tasks) {
  const today = new Date();
  const data = [];
  const labels = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const label = d.toLocaleString('default', { month: 'short' });
    const count = tasks.filter(t => {
      if (!t.createdAt || t.status !== 'completed') return false;
      const td = new Date(t.createdAt);
      return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear();
    }).length;
    labels.push(label);
    data.push(count);
  }
  return { data, labels };
}

export class DashboardView {
  static render(container, appState) {
    const data = appState.data;
    const readiness = ReadinessEngine.calculate(data.roadmap);
    const recommendations = RecommendationEngine.generate(data);

    let totalMilestones = 0;
    let completedMilestones = 0;
    data.roadmap.forEach(cat => {
      cat.milestones.forEach(m => {
        totalMilestones++;
        if (m.completed) completedMilestones++;
      });
    });
    const overallProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    const completedTasks = data.tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = data.tasks.filter(t => t.status !== 'completed').length;

    container.innerHTML = `
      <div class="dashboard-layout">
        <!-- Top 6 Dynamic KPI Cards -->
        <div class="grid-cols-6">
          <div class="card kpi-card">
            <div class="kpi-icon" style="background:var(--primary-100); color:var(--primary-600);" aria-hidden="true">🎯</div>
            <div>
              <div class="kpi-val">${overallProgress}%</div>
              <div class="kpi-label">Overall Progress</div>
            </div>
          </div>

          <div class="card kpi-card">
            <div class="kpi-icon" style="background:var(--accent-purple-500); color:#fff;" aria-hidden="true">🚀</div>
            <div>
              <div class="kpi-val">${readiness.score}</div>
              <div class="kpi-label">Readiness Score</div>
            </div>
          </div>

          <div class="card kpi-card">
            <div class="kpi-icon" style="background:rgba(245, 158, 11, 0.15); color:var(--warning);" aria-hidden="true">🔥</div>
            <div>
              <div class="kpi-val">${data.stats.currentStreak} Days</div>
              <div class="kpi-label">Current Streak</div>
            </div>
          </div>

          <div class="card kpi-card">
            <div class="kpi-icon" style="background:rgba(99, 102, 241, 0.15); color:var(--accent-indigo-500);" aria-hidden="true">⚡</div>
            <div>
              <div class="kpi-val">${data.stats.longestStreak} Days</div>
              <div class="kpi-label">Longest Streak</div>
            </div>
          </div>

          <div class="card kpi-card">
            <div class="kpi-icon" style="background:var(--success-bg); color:var(--success);" aria-hidden="true">✅</div>
            <div>
              <div class="kpi-val">${completedTasks}</div>
              <div class="kpi-label">Completed Tasks</div>
            </div>
          </div>

          <div class="card kpi-card">
            <div class="kpi-icon" style="background:var(--danger-bg); color:var(--danger);" aria-hidden="true">⏳</div>
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
              <div class="card-title">Weekly Activity Trend</div>
              <span class="nav-badge" style="background:var(--primary-100); color:var(--primary-600);">Study Hours</span>
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

        <!-- Horizontal Category Progress & Monthly Bars -->
        <div class="grid-cols-2">
          <div class="card">
            <div class="card-header">
              <div class="card-title">Category Progress</div>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.85rem;">
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

        <!-- Dynamic Recommendations & Upcoming Deadlines Panels -->
        <div class="panels-section">
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

          <div class="card">
            <div class="card-header">
              <div class="card-title">📅 Upcoming Deadlines</div>
            </div>
            <div class="deadline-list">
              ${data.tasks.filter(t => t.status !== 'completed').slice(0, 4).map(t => `
                <div class="deadline-item ${t.priority}">
                  <div>
                    <div style="font-weight:600; font-size:0.9rem;">${t.title}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${t.category} • Due: ${t.deadline}</div>
                  </div>
                  <span class="priority-pill ${t.priority}">${t.priority}</span>
                </div>
              `).join('')}
              ${data.tasks.filter(t => t.status !== 'completed').length === 0 ? `<div style="text-align:center; color:var(--text-muted); padding:1rem;">No pending deadlines! Great job.</div>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    const weekly = computeWeeklyData(data.tasks);
    const monthly = computeMonthlyData(data.tasks);

    setTimeout(() => {
      ChartEngine.renderLineChart(
        document.getElementById('dash-weekly-canvas'),
        weekly.data,
        weekly.labels
      );

      ChartEngine.renderBarChart(
        document.getElementById('dash-monthly-canvas'),
        monthly.data,
        monthly.labels
      );

      ChartEngine.renderSkillRadar(
        document.getElementById('dash-radar-container'),
        data.skills
      );
    }, 50);
  }
}
