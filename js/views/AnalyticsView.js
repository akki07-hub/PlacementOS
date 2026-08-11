/* ==========================================================================
   AnalyticsView.js - Productivity & Growth Analytics with Real Data
   ========================================================================== */

import { ChartEngine } from '../components/ChartEngine.js';
import { ReadinessEngine } from '../models/ReadinessEngine.js';

export class AnalyticsView {
  static render(container, appState) {
    const data = appState.data;
    const tasks = data.tasks || [];
    const history = data.history || [];

    // Compute real weekly task completion (last 7 days)
    const weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekCounts = new Array(7).fill(0);
    tasks.filter(t => t.status === 'completed' && t.createdAt).forEach(t => {
      const d = new Date(t.createdAt);
      const diffDays = Math.floor((today - d) / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        const dayIndex = d.getDay(); // 0=Sun, 1=Mon...
        weekCounts[dayIndex]++;
      }
    });

    // Reorder so today is last
    const todayIndex = today.getDay();
    const reorderedWeekData = [];
    const reorderedWeekLabels = [];
    for (let i = 6; i >= 0; i--) {
      const idx = (todayIndex - i + 7) % 7;
      reorderedWeekData.push(weekCounts[idx]);
      reorderedWeekLabels.push(weekLabels[idx]);
    }

    // Compute monthly tasks (last 6 months)
    const monthlyData = [];
    const monthLabels = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const label = d.toLocaleString('default', { month: 'short' });
      const count = tasks.filter(t => {
        if (!t.createdAt || t.status !== 'completed') return false;
        const td = new Date(t.createdAt);
        return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear();
      }).length;
      monthLabels.push(label);
      monthlyData.push(count);
    }

    // Category breakdown
    const catMap = {};
    tasks.filter(t => t.status === 'completed').forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + 1;
    });
    const catEntries = Object.entries(catMap).sort((a, b) => b[1] - a[1]);

    // Readiness over time (computed from current state)
    const readiness = ReadinessEngine.calculate(data.roadmap);
    const totalCompleted = tasks.filter(t => t.status === 'completed').length;
    const totalPending = tasks.filter(t => t.status === 'pending').length;
    const totalInProgress = tasks.filter(t => t.status === 'in-progress').length;

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.75rem;">

        <!-- Quick Stats Row -->
        <div class="grid-cols-4" style="gap:1rem;">
          <div class="card kpi-card">
            <div class="kpi-icon" style="background:var(--success-bg); color:var(--success);" aria-hidden="true">✅</div>
            <div>
              <div class="kpi-val">${totalCompleted}</div>
              <div class="kpi-label">Tasks Completed</div>
            </div>
          </div>
          <div class="card kpi-card">
            <div class="kpi-icon" style="background:rgba(245, 158, 11, 0.15); color:var(--warning);" aria-hidden="true">⏳</div>
            <div>
              <div class="kpi-val">${totalPending}</div>
              <div class="kpi-label">Pending</div>
            </div>
          </div>
          <div class="card kpi-card">
            <div class="kpi-icon" style="background:var(--primary-100); color:var(--primary-600);" aria-hidden="true">⚡</div>
            <div>
              <div class="kpi-val">${totalInProgress}</div>
              <div class="kpi-label">In Progress</div>
            </div>
          </div>
          <div class="card kpi-card">
            <div class="kpi-icon" style="background:var(--bg-subtle); color:var(--accent-purple-500);" aria-hidden="true">🔥</div>
            <div>
              <div class="kpi-val">${data.stats?.currentStreak || 0}d</div>
              <div class="kpi-label">Current Streak</div>
            </div>
          </div>
        </div>

        <!-- 365-Day Heatmap -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">365-Day Activity Consistency Heatmap</div>
            <span class="nav-badge">Daily Task & Milestone Activity</span>
          </div>
          <div class="heatmap-container" id="analytics-heatmap"></div>
        </div>

        <!-- Weekly & Monthly Charts -->
        <div class="grid-cols-2">
          <div class="card">
            <div class="card-header">
              <div class="card-title">Weekly Tasks Completed</div>
              <span class="nav-badge" style="background:var(--primary-100); color:var(--primary-600);">Last 7 Days</span>
            </div>
            <canvas id="analytics-weekly-canvas"></canvas>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Monthly Tasks Completed</div>
              <span class="nav-badge" style="background:rgba(139,92,246,0.15); color:var(--accent-purple-500);">Last 6 Months</span>
            </div>
            <canvas id="analytics-monthly-canvas"></canvas>
          </div>
        </div>

        <!-- Category Breakdown & Readiness -->
        <div class="grid-cols-2">
          <div class="card">
            <div class="card-header">
              <div class="card-title">Tasks by Category</div>
            </div>
            ${catEntries.length === 0 ? `
              <div style="text-align:center; color:var(--text-muted); padding:2rem;">
                Complete tasks to see category breakdown.
              </div>
            ` : `
              <div style="display:flex; flex-direction:column; gap:0.75rem;">
                ${catEntries.slice(0, 7).map(([cat, count]) => {
                  const pct = totalCompleted > 0 ? Math.round((count / totalCompleted) * 100) : 0;
                  return `
                    <div>
                      <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:4px;">
                        <span>${cat}</span>
                        <span>${count} tasks (${pct}%)</span>
                      </div>
                      <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width:${pct}%; background:var(--accent-indigo-500);"></div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Readiness Category Scores</div>
              <span class="nav-badge" style="background:var(--success-bg); color:var(--success);">Live Score: ${readiness.score}%</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              ${Object.entries(readiness.categoryScores).map(([cat, info]) => `
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:4px;">
                    <span>${cat}</span>
                    <span>${info.percent}%</span>
                  </div>
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width:${info.percent}%;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

      </div>
    `;

    setTimeout(() => {
      ChartEngine.renderHeatmap(document.getElementById('analytics-heatmap'), history);
      ChartEngine.renderLineChart(
        document.getElementById('analytics-weekly-canvas'),
        reorderedWeekData,
        reorderedWeekLabels
      );
      ChartEngine.renderBarChart(
        document.getElementById('analytics-monthly-canvas'),
        monthlyData,
        monthLabels
      );
    }, 50);
  }
}
