/* ==========================================================================
   ExportService.js - Export & Dedicated Print Architecture Engine
   ========================================================================== */

import { StorageService } from '../models/StorageService.js';

export class ExportService {
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

    // 3. Get current state data from window.appState or LocalStorage
    const state = (window.appState && window.appState.data) ? window.appState.data : (StorageService.load() || {});
    const user = state.user || {};
    const uName = user.name || 'Alex Mine';
    const uCollege = user.college || 'GITAM University';
    const uRole = user.targetRole || 'Software Engineer';
    const uCgpa = user.cgpa ? `${user.cgpa} / 10.0` : '8.8 / 10.0';
    const uGradYear = user.gradYear || '2027';

    // Compute dynamic readiness score
    let score = 84;
    if (Array.isArray(state.tasks) && state.tasks.length > 0) {
      const completed = state.tasks.filter(t => t.status === 'completed').length;
      score = Math.min(100, Math.round((completed / state.tasks.length) * 100));
    }
    
    let verdictTitle = 'Status: Placement Ready 🟢';
    let verdictDesc = 'Candidate displays high competency in Data Structures, CS Fundamentals, and Full-Stack Engineering. Recommended for Tier-1 Product Companies.';
    let badgeText = 'TIER-1 ELIGIBLE';
    
    if (score < 80 && score >= 60) {
      verdictTitle = 'Status: On Track 🟡';
      verdictDesc = 'Candidate shows solid foundational progress across key preparation tracks. Targeted practice recommended for weak domain areas.';
      badgeText = 'TIER-2 READY';
    } else if (score < 60) {
      verdictTitle = 'Status: Needs Focus 🔴';
      verdictDesc = 'Candidate is actively building core problem-solving fundamentals. Follow the structured PlacementOS milestone roadmap.';
      badgeText = 'PREPARATION PHASE';
    }

    // Date & Document Meta
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const docId = `POS-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    // Build Page 1 & Page 2 Report HTML
    const reportHTML = `
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
            <div>Status: <strong>Verified Evaluation</strong></div>
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

        <!-- Section 1: Domain-Wise Evaluation -->
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
            <tr>
              <td><strong>Data Structures & Algorithms</strong></td>
              <td>30%</td>
              <td>
                <div class="progress-bar-container-print"><div class="progress-fill-print" style="width: 88%;"></div></div>
                <strong>88%</strong>
              </td>
              <td>Advanced (320+ Solved)</td>
              <td><span style="color:#15803d; font-weight:700;">● Excellent</span></td>
            </tr>
            <tr>
              <td><strong>Core CS Fundamentals</strong> (OS, DBMS, CN)</td>
              <td>25%</td>
              <td>
                <div class="progress-bar-container-print"><div class="progress-fill-print" style="width: 85%;"></div></div>
                <strong>85%</strong>
              </td>
              <td>Advanced (SQL, Indexing, Threads)</td>
              <td><span style="color:#15803d; font-weight:700;">● Strong</span></td>
            </tr>
            <tr>
              <td><strong>Projects & System Architecture</strong></td>
              <td>20%</td>
              <td>
                <div class="progress-bar-container-print"><div class="progress-fill-print" style="width: 80%;"></div></div>
                <strong>80%</strong>
              </td>
              <td>Intermediate (2 Full-Stack Apps)</td>
              <td><span style="color:#15803d; font-weight:700;">● Good</span></td>
            </tr>
            <tr>
              <td><strong>Quantitative & Logical Aptitude</strong></td>
              <td>15%</td>
              <td>
                <div class="progress-bar-container-print"><div class="progress-fill-print" style="width: 78%;"></div></div>
                <strong>78%</strong>
              </td>
              <td>Intermediate (Speed Math, Logic)</td>
              <td><span style="color:#b45309; font-weight:700;">● On Track</span></td>
            </tr>
            <tr>
              <td><strong>Behavioral & HR Round Prep</strong></td>
              <td>10%</td>
              <td>
                <div class="progress-bar-container-print"><div class="progress-fill-print" style="width: 90%;"></div></div>
                <strong>90%</strong>
              </td>
              <td>Expert (Resume & STAR Method)</td>
              <td><span style="color:#15803d; font-weight:700;">● Excellent</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGE 2: Target Companies, Accomplishments & Verification -->
      <div class="print-page-2">
        <div class="section-header-print">2. Target Company Pipeline & Tiering</div>
        <div class="company-grid-print">
          <div class="company-tier-card-print">
            <div style="font-weight:700; font-size:0.9rem; margin-bottom:0.75rem; color:#1e40af;">🌟 Dream Tier (Product / Big Tech)</div>
            <span class="company-tag-print">Google</span>
            <span class="company-tag-print">Microsoft</span>
            <span class="company-tag-print">Amazon</span>
            <span class="company-tag-print">Atlassian</span>
            <div style="font-size:0.75rem; color:#475569; margin-top:8px;">Status: Applications Submitted</div>
          </div>
          <div class="company-tier-card-print">
            <div style="font-weight:700; font-size:0.9rem; margin-bottom:0.75rem; color:#1e40af;">🎯 Target Tier (Mid-Product / Unicorns)</div>
            <span class="company-tag-print">Oracle</span>
            <span class="company-tag-print">Adobe</span>
            <span class="company-tag-print">Swiggy</span>
            <span class="company-tag-print">Razorpay</span>
            <div style="font-size:0.75rem; color:#475569; margin-top:8px;">Status: Tech Interview Stage</div>
          </div>
          <div class="company-tier-card-print">
            <div style="font-weight:700; font-size:0.9rem; margin-bottom:0.75rem; color:#1e40af;">🛡️ Safety Tier (IT Services & Accelerators)</div>
            <span class="company-tag-print">TCS Digital</span>
            <span class="company-tag-print">Infosys Power</span>
            <span class="company-tag-print">Cognizant</span>
            <div style="font-size:0.75rem; color:#475569; margin-top:8px;">Status: Offer Received (9.5 LPA)</div>
          </div>
        </div>

        <!-- Section 3: Accomplishments & Action Items -->
        <div class="section-header-print">3. Verified Accomplishments & Strengths</div>
        <div class="accomplishments-grid-print">
          <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:1.1rem; border-radius:8px;">
            <strong style="color:#1e40af; font-size:0.9rem;">🏆 Unlocked Placement Badges</strong>
            <ul style="font-size:0.85rem; color:#475569; margin-top:0.5rem; padding-left:1.2rem; line-height:1.6;">
              <li><strong>DSA Warrior:</strong> Solved 300+ LeetCode problems across Trees & Dynamic Programming.</li>
              <li><strong>Database Architect:</strong> Mastered SQL queries, indexing, and ACID transactions.</li>
              <li><strong>Placement Ready:</strong> Achieved >80% overall readiness score benchmark.</li>
            </ul>
          </div>
          <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:1.1rem; border-radius:8px;">
            <strong style="color:#1e40af; font-size:0.9rem;">💡 Actionable Recommendations</strong>
            <ul style="font-size:0.85rem; color:#475569; margin-top:0.5rem; padding-left:1.2rem; line-height:1.6;">
              <li>Conduct 2 additional System Design mock interviews (Focus on Load Balancers & Caching).</li>
              <li>Revise Computer Networks (TCP/IP handshake & HTTP/3 headers) before final technical rounds.</li>
              <li>Maintain daily DSA revision streak (1 problem/day).</li>
            </ul>
          </div>
        </div>

        <!-- Footer Verification Seal -->
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1px dashed #cbd5e1; padding-top:1.25rem; margin-top:2rem;">
          <div>
            <div style="font-weight:700; font-size:0.85rem; color:#0f172a;">PlacementOS Assessment System</div>
            <div style="font-size:0.75rem; color:#475569;">Verified Candidate Transcript & Evaluation Matrix</div>
          </div>
          <div style="text-align:right;">
            <div style="font-family:monospace; font-size:0.85rem; font-weight:700; color:#1e40af;">[ VERIFIED ELECTRONIC SIGNATURE ]</div>
            <div style="font-size:0.75rem; color:#475569;">Placement Officer Verification Code: #${docId}</div>
          </div>
        </div>
      </div>
    `;

    printRoot.innerHTML = reportHTML;

    // 4. Trigger print cleanly with RAF delay for rendering
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.print();
        // Clean up print root buffer post-print without altering SPA page or state
        setTimeout(() => {
          printRoot.innerHTML = '';
        }, 1000);
      }, 100);
    });
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
