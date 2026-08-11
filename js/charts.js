/* ==========================================================================
   Charts & Visualizations Engine (Pure SVG & Canvas)
   Student Career Roadmap & Placement Readiness System
   ========================================================================== */

const ChartEngine = {
  // 1. Radar Chart (SVG)
  renderSkillRadar(container, data) {
    if (!container) return;
    const size = 320;
    const center = size / 2;
    const radius = 110;
    const numAxes = data.length;
    const angleStep = (Math.PI * 2) / numAxes;

    let gridLinesHTML = '';
    for (let level = 1; level <= 4; level++) {
      const r = (radius / 4) * level;
      let points = [];
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        points.push(`${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`);
      }
      gridLinesHTML += `<polygon points="${points.join(' ')}" fill="none" stroke="var(--border-color)" stroke-width="1" stroke-dasharray="${level < 4 ? '3,3' : 'none'}"/>`;
    }

    let axesHTML = '';
    let polyPoints = [];
    let labelsHTML = '';

    data.forEach((d, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      axesHTML += `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="var(--border-color)" stroke-width="1"/>`;

      const valRadius = (radius * d.percent) / 100;
      const px = center + valRadius * Math.cos(angle);
      const py = center + valRadius * Math.sin(angle);
      polyPoints.push(`${px},${py}`);

      // Label offset
      const lx = center + (radius + 22) * Math.cos(angle);
      const ly = center + (radius + 22) * Math.sin(angle);
      const textAnchor = Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end';
      labelsHTML += `<text x="${lx}" y="${ly}" fill="var(--text-muted)" font-size="11" font-weight="600" text-anchor="${textAnchor}" dominant-baseline="middle">${d.name}</text>`;
    });

    const svg = `
      <svg width="100%" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        ${gridLinesHTML}
        ${axesHTML}
        <polygon points="${polyPoints.join(' ')}" fill="rgba(99, 102, 241, 0.25)" stroke="var(--accent-indigo-500)" stroke-width="2.5"/>
        ${polyPoints.map(p => {
          const [cx, cy] = p.split(',');
          return `<circle cx="${cx}" cy="${cy}" r="4" fill="var(--primary-500)" stroke="#ffffff" stroke-width="2"/>`;
        }).join('')}
        ${labelsHTML}
      </svg>
    `;
    container.innerHTML = svg;
  },

  // 2. Smooth Line Chart (Canvas)
  renderLineChart(canvas, dataPoints, labels) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth || 500;
    const height = 240;
    canvas.width = width;
    canvas.height = height;

    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    const maxVal = Math.max(...dataPoints, 10) * 1.2;

    ctx.clearRect(0, 0, width, height);

    // Draw horizontal grid lines
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--border-subtle') || '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (graphHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Points calculation
    const points = dataPoints.map((val, i) => {
      const x = padding + (graphWidth / (dataPoints.length - 1)) * i;
      const y = height - padding - (val / maxVal) * graphHeight;
      return { x, y };
    });

    // Fill Gradient
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    ctx.lineTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw Line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw Circles & Labels
    points.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Label below X axis
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted') || '#64748b';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], p.x, height - 12);
    });
  },

  // 3. Monthly Bar Chart (Canvas)
  renderBarChart(canvas, dataPoints, labels) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth || 500;
    const height = 240;
    canvas.width = width;
    canvas.height = height;

    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    const maxVal = Math.max(...dataPoints, 10) * 1.2;

    ctx.clearRect(0, 0, width, height);

    const barWidth = (graphWidth / dataPoints.length) * 0.45;
    const spacing = graphWidth / dataPoints.length;

    dataPoints.forEach((val, i) => {
      const x = padding + spacing * i + spacing / 2 - barWidth / 2;
      const barH = (val / maxVal) * graphHeight;
      const y = height - padding - barH;

      const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
      gradient.addColorStop(0, '#8b5cf6');
      gradient.addColorStop(1, '#6366f1');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, [6, 6, 0, 0]);
      ctx.fill();

      // Labels
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted') || '#64748b';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + barWidth / 2, height - 12);
    });
  },

  // 4. Circular Gauge / Doughnut (SVG)
  renderCircularGauge(container, score, label = 'Readiness') {
    if (!container) return;
    const size = 160;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="var(--bg-subtle)" stroke-width="${strokeWidth}"/>
        <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="url(#gaugeGrad)" stroke-width="${strokeWidth}"
          stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round" transform="rotate(-90 ${size/2} ${size/2})"
          style="transition: stroke-dashoffset 1s ease;"/>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3b82f6"/>
            <stop offset="100%" stop-color="#8b5cf6"/>
          </linearGradient>
        </defs>
      </svg>
      <div class="gauge-center-text">
        <div class="gauge-score">${score}%</div>
        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">${label}</div>
      </div>
    `;
    container.innerHTML = svg;
  },

  // 5. GitHub-style Contribution Heatmap Grid
  renderHeatmap(container) {
    if (!container) return;
    let cellsHTML = '';
    const weeks = 28; // 28 weeks = 196 days
    for (let i = 0; i < weeks * 7; i++) {
      const randCount = Math.random() > 0.4 ? Math.floor(Math.random() * 5) : 0;
      cellsHTML += `<div class="heatmap-cell" data-count="${randCount}" title="Day ${i+1}: ${randCount} tasks completed"></div>`;
    }
    container.innerHTML = cellsHTML;
  }
};

window.ChartEngine = ChartEngine;
