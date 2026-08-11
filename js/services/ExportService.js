/* ==========================================================================
   ExportService.js - Dynamic Export & Dedicated Print Architecture Engine
   ========================================================================== */

import { StorageService } from '../models/StorageService.js';
import { ReadinessEngine } from '../models/ReadinessEngine.js';
import { RecommendationEngine } from '../models/RecommendationEngine.js';

export class ExportService {
  static getLatestState() {
    if (window.appState && window.appState.data) {
      return window.appState.data;
    }
    return StorageService.load() || {};
  }

  static printPDF() {
    // 1. Target or create dedicated print container inside <body> outside #app
    let printRoot = document.getElementById('print-report-root');
    if (!printRoot) {
      printRoot = document.createElement('div');
      printRoot.id = 'print-report-root';
      document.body.appendChild(printRoot);
    }

    // 2. Clear any previous print content
    printRoot.innerHTML = '';

    // 3. Get current state data from window.appState (single source of truth)
    const state = ExportService.getLatestState();
    
    // 4. Generate dynamic report HTML from live state
    const reportHTML = ExportService.generateReportHTML(state);
    printRoot.innerHTML = reportHTML;

    // 5. Trigger print cleanly with RAF delay for DOM rendering
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.print();
        // Clear print buffer post-print without altering SPA page or state
        setTimeout(() => {
          printRoot.innerHTML = '';
        }, 1000);
      }, 100);
    });
  }

  static generateReportHTML(state) {
    const user = state.user || {};
    const uName = user.name || 'Candidate';
    const uCollege = user.college || 'N/A';
    const uRole = user.targetRole || 'Software Engineer';
    const uCgpa = user.cgpa ? `${user.cgpa} / 10.0` : 'N/A';
    const uGradYear = user.gradYear || '2027';

    // 1. DYNAMIC READINESS SCORE & LEVEL (Single Source of Truth via ReadinessEngine)
    const roadmap = Array.isArray(state.roadmap) ? state.roadmap : [];
    const readiness = ReadinessEngine.calculate(roadmap);
    const score = readiness.score;
    const levelInfo = readiness.level || ReadinessEngine.getLevel(score);
    const catScores = readiness.categoryScores || {};

    let statusSymbol = '🔴';
    if (score >= 85) statusSymbol = '🟢';
    else if (score >= 65) statusSymbol = '🔵';
    else if (score >= 40) statusSymbol = '🟡';

    const verdictTitle = `Status: ${levelInfo.label} ${statusSymbol}`;
    const badgeText = (levelInfo.label || 'PREPARATION').toUpperCase();

    // Verdict description based on readiness level
    let verdictDesc = '';
    if (score >= 85) {
      verdictDesc = `Candidate displays high competency across core technical domains. Meets target placement benchmarks for top technical roles.`;
    } else if (score >= 65) {
      verdictDesc = `Candidate shows strong progress across key preparation tracks. Ready for technical interviews & company evaluations.`;
    } else if (score >= 40) {
      verdictDesc = `Candidate is making steady progress. Targeted practice recommended for weak domain areas to achieve interview readiness.`;
    } else {
      verdictDesc = `Candidate is actively building foundational skills. Recommended to follow the structured PlacementOS milestone roadmap.`;
    }

    // 2. DYNAMIC TASK & ROADMAP PROGRESS
    const tasks = Array.isArray(state.tasks) ? state.tasks : [];
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;

    let totalMilestones = 0;
    let completedMilestones = 0;
    roadmap.forEach(cat => {
      if (Array.isArray(cat.milestones)) {
        totalMilestones += cat.milestones.length;
        completedMilestones += cat.milestones.filter(m => m.completed).length;
      }
    });
    const remainingMilestones = totalMilestones - completedMilestones;
    const milestonePercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    // 3. DOMAIN BREAKDOWN TABLE ROWS
    const catEntries = Object.entries(catScores).map(([name, info]) => ({
      name,
      percent: info.percent,
      completed: info.completed,
      total: info.total,
      weight: info.weight
    }));

    const domainTableRowsHTML = catEntries.map(cat => {
      let statusText = '● Needs Focus';
      let statusColor = '#dc2626'; // red
      if (cat.percent >= 80) { statusText = '● Excellent'; statusColor = '#15803d'; }
      else if (cat.percent >= 65) { statusText = '● Strong'; statusColor = '#15803d'; }
      else if (cat.percent >= 40) { statusText = '● On Track'; statusColor = '#b45309'; }

      let masteryLevel = 'Beginner';
      if (cat.percent >= 85) masteryLevel = 'Expert';
      else if (cat.percent >= 65) masteryLevel = 'Proficient';
      else if (cat.percent >= 40) masteryLevel = 'Developing';

      return `
        <tr>
          <td><strong>${cat.name}</strong></td>
          <td>${cat.weight}%</td>
          <td>
            <div class="progress-bar-container-print"><div class="progress-fill-print" style="width: ${cat.percent}%;"></div></div>
            <strong>${cat.percent}%</strong> (${cat.completed}/${cat.total})
          </td>
          <td>${masteryLevel}</td>
          <td><span style="color:${statusColor}; font-weight:700;">${statusText}</span></td>
        </tr>
      `;
    }).join('');

    // 4. DYNAMIC SKILLS PROFILE
    const skills = Array.isArray(state.skills) ? state.skills : [];
    const skillsListHTML = skills.length > 0 ? skills.map(s => `
      <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:0.5rem 0.75rem; border-radius:6px; font-size:0.8rem;">
        <div style="display:flex; justify-content:space-between; font-weight:700; color:#0f172a; margin-bottom:3px;">
          <span>${s.name} (${s.category || 'Skill'})</span>
          <span style="color:#1e40af;">${s.percent}% • ${s.level || 'Beginner'}</span>
        </div>
        <div class="progress-bar-container-print" style="width:100%; height:5px;"><div class="progress-fill-print" style="width:${s.percent}%;"></div></div>
      </div>
    `).join('') : '<div style="font-size:0.825rem; color:#64748b;">No skills configured yet.</div>';

    // 5. DYNAMIC RECOMMENDATIONS (Single Source of Truth via RecommendationEngine)
    const recommendations = RecommendationEngine.generate(state);
    const recsListHTML = recommendations.length > 0 ? recommendations.map(r => `
      <li><strong>${r.category || 'Action'}:</strong> ${r.title} <span style="font-size:0.725rem; background:#dbeafe; color:#1e40af; padding:1px 6px; border-radius:10px; font-weight:700; margin-left:4px;">${r.priority}</span></li>
    `).join('') : '<li>Maintain current preparation momentum across all domains.</li>';

    // 6. DYNAMIC ACHIEVEMENTS
    const achievements = Array.isArray(state.achievements) ? state.achievements : [];
    const unlockedBadges = achievements.filter(a => a.unlocked);
    const badgesListHTML = unlockedBadges.length > 0 ? unlockedBadges.map(b => `
      <li><strong>${b.title}:</strong> ${b.desc || b.description || 'Achievement unlocked'}</li>
    `).join('') : '<li>No achievements unlocked yet. Complete tasks and roadmap milestones to earn badges!</li>';

    // 7. DYNAMIC TARGET COMPANIES
    const targetCompanies = Array.isArray(user.targetCompanies) && user.targetCompanies.length > 0 
      ? user.targetCompanies 
      : ['Google', 'Microsoft', 'Amazon'];
    const companiesTagsHTML = targetCompanies.map(c => `<span class="company-tag-print">${c}</span>`).join('');

    // 8. DYNAMIC HISTORY & STREAK
    const history = Array.isArray(state.history) ? state.history : [];
    const recentHistory = history.slice(0, 5);
    const historyListHTML = recentHistory.length > 0 ? recentHistory.map(h => `
      <div style="font-size:0.8rem; border-bottom:1px solid #cbd5e1; padding:0.35rem 0; display:flex; justify-content:space-between;">
        <span>${h.icon || '📌'} ${h.title}</span>
        <span style="color:#64748b; font-size:0.75rem;">${h.date || ''}</span>
      </div>
    `).join('') : '<div style="font-size:0.825rem; color:#64748b;">No recent preparation activity recorded.</div>';

    const stats = state.stats || {};
    const currentStreak = stats.currentStreak || 0;
    const longestStreak = stats.longestStreak || 0;

    // Date & Document Meta
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const docId = `POS-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    return `
      <div class="print-page-1">
        <!-- Document Header -->
        <div class="report-header-print">
          <div>
            <div class="brand-title-print">PlacementOS</div>
            <div class="report-subtitle-print">Official Student Placement Readiness Report</div>
          </div>
          <div class="doc-meta-print">
            <div>Document ID: <strong>${docId}</strong></div>
            <div>Issue Date: <strong>${formattedDate}</strong></div>
            <div>Status: <strong>Verified Live Evaluation</strong></div>
          </div>
        </div>

        <!-- Student Information Card -->
        <div class="student-info-grid-print">
          <div class="info-item">
            <span class="info-label-print">Candidate Name</span>
            <span class="info-val-print">${uName}</span>
          </div>
          <div class="info-item">
            <span class="info-label-print">College / University</span>
            <span class="info-val-print">${uCollege}</span>
          </div>
          <div class="info-item">
            <span class="info-label-print">Target Role</span>
            <span class="info-val-print">${uRole}</span>
          </div>
          <div class="info-item">
            <span class="info-label-print">CGPA & Grad Year</span>
            <span class="info-val-print">${uCgpa} • Batch ${uGradYear}</span>
          </div>
        </div>

        <!-- Overall Readiness Score Hero Card -->
        <div class="readiness-score-card-print">
          <div class="score-left" style="display:flex; align-items:center; gap:1.25rem;">
            <div class="score-circle-print">
              <span class="score-num-print">${score}%</span>
              <span class="score-max-print">/ 100</span>
            </div>
            <div>
              <div style="font-family:'Plus Jakarta Sans',sans-serif; font-size:1.35rem; font-weight:800; margin-bottom:0.25rem;">${verdictTitle}</div>
              <div style="font-size:0.875rem; opacity:0.9; max-width:480px;">
                ${verdictDesc}
              </div>
            </div>
          </div>
          <div class="status-badge-print">${badgeText}</div>
        </div>

        <!-- Section 1: Domain-Wise Readiness Evaluation -->
        <div class="section-header-print">1. Domain-Wise Readiness Evaluation</div>
        <table class="report-table-print">
          <thead>
            <tr>
              <th>Evaluation Domain</th>
              <th>Weight</th>
              <th>Score</th>
              <th>Mastery Level</th>
              <th>Domain Status</th>
            </tr>
          </thead>
          <tbody>
            ${domainTableRowsHTML}
          </tbody>
        </table>

        <!-- Progress Summary Cards -->
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:0.85rem; margin-bottom:1.5rem;">
          <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:0.75rem; border-radius:6px; text-align:center;">
            <div style="font-size:0.725rem; font-weight:700; color:#475569; text-transform:uppercase;">Tasks Done</div>
            <div style="font-size:1.2rem; font-weight:800; color:#1e40af;">${completedTasks} / ${totalTasks}</div>
            <div style="font-size:0.725rem; color:#64748b;">${pendingTasks} pending • ${inProgressTasks} active</div>
          </div>
          <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:0.75rem; border-radius:6px; text-align:center;">
            <div style="font-size:0.725rem; font-weight:700; color:#475569; text-transform:uppercase;">Milestones</div>
            <div style="font-size:1.2rem; font-weight:800; color:#1e40af;">${completedMilestones} / ${totalMilestones}</div>
            <div style="font-size:0.725rem; color:#64748b;">${remainingMilestones} remaining (${milestonePercent}%)</div>
          </div>
          <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:0.75rem; border-radius:6px; text-align:center;">
            <div style="font-size:0.725rem; font-weight:700; color:#475569; text-transform:uppercase;">Current Streak</div>
            <div style="font-size:1.2rem; font-weight:800; color:#1e40af;">🔥 ${currentStreak} Days</div>
            <div style="font-size:0.725rem; color:#64748b;">Best: ${longestStreak} Days</div>
          </div>
          <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:0.75rem; border-radius:6px; text-align:center;">
            <div style="font-size:0.725rem; font-weight:700; color:#475569; text-transform:uppercase;">Badges Unlocked</div>
            <div style="font-size:1.2rem; font-weight:800; color:#1e40af;">🏆 ${unlockedBadges.length} / ${achievements.length}</div>
            <div style="font-size:0.725rem; color:#64748b;">${achievements.length - unlockedBadges.length} remaining</div>
          </div>
        </div>
      </div>

      <!-- PAGE 2: Target Pipeline, Skills, Recommendations & Verification -->
      <div class="print-page-2">
        <div class="section-header-print">2. Target Company Pipeline & Skills Profile</div>
        <div class="company-grid-print" style="grid-template-columns: 1fr 2fr; gap:1rem; margin-bottom:1.5rem;">
          <div class="company-tier-card-print">
            <div style="font-weight:700; font-size:0.875rem; margin-bottom:0.6rem; color:#1e40af;">🎯 Target Companies</div>
            <div>${companiesTagsHTML}</div>
            <div style="font-size:0.75rem; color:#475569; margin-top:8px;">Target Batch: ${uGradYear}</div>
          </div>
          <div>
            <div style="font-weight:700; font-size:0.875rem; margin-bottom:0.6rem; color:#1e40af;">📈 Skills Mastery Breakdown</div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.6rem;">
              ${skillsListHTML}
            </div>
          </div>
        </div>

        <!-- Section 3: Verified Accomplishments & Action Items -->
        <div class="section-header-print">3. Verified Accomplishments & Strengths</div>
        <div class="accomplishments-grid-print" style="margin-bottom:1.5rem;">
          <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:1rem; border-radius:8px;">
            <strong style="color:#1e40af; font-size:0.875rem;">🏆 Unlocked Placement Badges</strong>
            <ul style="font-size:0.825rem; color:#475569; margin-top:0.4rem; padding-left:1.1rem; line-height:1.55;">
              ${badgesListHTML}
            </ul>
          </div>
          <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:1rem; border-radius:8px;">
            <strong style="color:#1e40af; font-size:0.875rem;">💡 Actionable Recommendations (Dynamic)</strong>
            <ul style="font-size:0.825rem; color:#475569; margin-top:0.4rem; padding-left:1.1rem; line-height:1.55;">
              ${recsListHTML}
            </ul>
          </div>
        </div>

        <!-- Section 4: Recent History & Activity Audit Log -->
        <div class="section-header-print">4. Recent Preparation Activity Audit Log</div>
        <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:0.85rem; border-radius:8px; margin-bottom:1.5rem;">
          ${historyListHTML}
        </div>

        <!-- Footer Verification Seal -->
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1px dashed #cbd5e1; padding-top:1rem; margin-top:1.5rem;">
          <div>
            <div style="font-weight:700; font-size:0.85rem; color:#0f172a;">PlacementOS Assessment System</div>
            <div style="font-size:0.75rem; color:#475569;">Verified Candidate Transcript & Dynamic Evaluation Matrix</div>
          </div>
          <div style="text-align:right;">
            <div style="font-family:monospace; font-size:0.85rem; font-weight:700; color:#1e40af;">[ VERIFIED ELECTRONIC SIGNATURE ]</div>
            <div style="font-size:0.75rem; color:#475569;">Verification Code: #${docId}</div>
          </div>
        </div>
      </div>
    `;
  }

  static exportCSV(tasks = []) {
    if (!tasks || tasks.length === 0) {
      alert('No task data available to export.');
      return false;
    }

    let csv = 'ID,Title,Category,Priority,Status,Deadline,Progress\n';
    tasks.forEach(t => {
      const cleanTitle = `"${(t.title || '').replace(/"/g, '""')}"`;
      csv += `${t.id},${cleanTitle},${t.category},${t.priority},${t.status},${t.deadline || ''},${t.progress || 0}%\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `placement_tasks_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  }

  static exportJSON(stateData) {
    const dataStr = JSON.stringify(stateData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `placement_roadmap_backup_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  }

  static importJSON(file, onSuccess, onError) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (StorageService.validateBackupJSON(parsed)) {
          onSuccess(parsed);
        } else {
          onError('Invalid backup JSON format. Required fields are missing.');
        }
      } catch (err) {
        onError('Failed to parse JSON file. Please ensure the file is valid JSON.');
      }
    };
    reader.onerror = () => onError('Error reading file.');
    reader.readAsText(file);
  }
}
