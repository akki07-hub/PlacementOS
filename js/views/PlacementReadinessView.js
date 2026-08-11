/* ==========================================================================
   PlacementReadinessView.js - Weighted Placement Readiness Engine View
   ========================================================================== */

import { ReadinessEngine } from '../models/ReadinessEngine.js';
import { ChartEngine } from '../components/ChartEngine.js';

export class PlacementReadinessView {
  static render(container, appState) {
    const readiness = ReadinessEngine.calculate(appState.data.roadmap);
    const score = readiness.score;
    const lvl = readiness.level;
    const catScores = readiness.categoryScores;

    container.innerHTML = `
      <div>
        <div class="readiness-hero-card">
          <div id="readiness-gauge-container"></div>
          <div>
            <div style="font-size:0.9rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted); font-weight:700;">Status Level</div>
            <div style="font-size:2rem; font-weight:800; color:${lvl.color}; margin:0.25rem 0;">${lvl.label}</div>
            <p style="color:var(--text-muted); max-width:420px;">Calculated dynamically from your completed roadmap milestones, DSA problem solving, and project portfolio.</p>
          </div>
        </div>

        <div class="card-title" style="margin-bottom:1rem;">Weighted Category Breakdown</div>
        <div class="weighted-scores-grid">
          ${Object.keys(catScores).map(catName => {
            const info = catScores[catName];
            return `
              <div class="weighted-bar-item">
                <div style="display:flex; justify-content:space-between; font-weight:600; font-size:0.9rem;">
                  <span>${catName}</span>
                  <span>${info.percent}% (Weight: ${info.weight}%)</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" style="width:${info.percent}%;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    setTimeout(() => {
      ChartEngine.renderCircularGauge(
        document.getElementById('readiness-gauge-container'),
        score,
        'Readiness Score'
      );
    }, 50);
  }
}
