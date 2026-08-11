/* ==========================================================================
   ChartEngine.js - Responsive SVG & Canvas Charts
   ========================================================================== */

export class ChartEngine {
  static renderSkillRadar(container, skills = []) {
    if (!container) return;
    if (!skills || skills.length === 0) {
      container.innerHTML = `<div class="empty-state-sm">No skill data available</div>`;
      return;
    }

    const size = 300;
    const center = size / 2;
    const radius = 100;
    const numAxes = skills.length;
    const angleStep = (Math.PI * 2) / numAxes;

    let gridLines = '';
    for (let level = 1; level <= 4; level++) {
      const r = (radius / 4) * level;
      let points = [];
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        points.push(`${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`);
      }
      gridLines += `<polygon points="${points.join(' ')}" fill="none" stroke="var(--border-color)" stroke-width="1" stroke-dasharray="${level < 4 ? '3,3' : 'none'}"/>`;
    }

    let axes = '';
    let polyPoints = [];
    let labels = '';

    skills.forEach((d, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      axes += `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="var(--border-color)" stroke-width="1"/>`;

      const valRadius = (radius * (d.percent || 0)) / 100;
      const px = center + valRadius * Math.cos(angle);
      const py = center + valRadius * Math.sin(angle);
      polyPoints.push(`${px},${py}`);

      const lx = center + (radius + 20) * Math.cos(angle);
      const ly = center + (radius + 20) * Math.sin(angle);
      const textAnchor = Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end';
      labels += `<text x="${lx}" y="${ly}" fill="var(--text-muted)" font-size="10" font-weight="600" text-anchor="${textAnchor}" dominant-baseline="middle">${d.name}</text>`;
    });

    container.innerHTML = `
      <svg width="100%" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        ${gridLines}
        ${axes}
        <polygon points="${polyPoints.join(' ')}" fill="rgba(99, 102, 241, 0.25)" stroke="var(--accent-indigo-500)" stroke-width="2.5"/>
        ${polyPoints.map(p => {
          const [cx, cy] = p.split(',');
          return `<circle cx="${cx}" cy="${cy}" r="3.5" fill="var(--primary-500)" stroke="#ffffff" stroke-width="2"/>`;
        }).join('')}
        ${labels}
      </svg>
    `;
  }

  static renderLineChart(canvas, dataPoints = [], labels = []) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement ? canvas.parentElement.clientWidth : 500;
    const height = 220;
    canvas.width = width;
    canvas.height = height;

    const padding = 35;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    const maxVal = Math.max(...dataPoints, 10) * 1.2;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--border-subtle') || '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (graphHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    if (dataPoints.length === 0) return;

    const points = dataPoints.map((val, i) => {
      const x = padding + (graphWidth / Math.max(dataPoints.length - 1, 1)) * i;
      const y = height - padding - (val / maxVal) * graphHeight;
      return { x, y };
    });

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

    points.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted') || '#64748b';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      if (labels[i]) ctx.fillText(labels[i], p.x, height - 10);
    });
  }

  static renderBarChart(canvas, dataPoints = [], labels = []) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement ? canvas.parentElement.clientWidth : 500;
    const height = 220;
    canvas.width = width;
    canvas.height = height;

    const padding = 35;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    const maxVal = Math.max(...dataPoints, 10) * 1.2;

    ctx.clearRect(0, 0, width, height);
    if (dataPoints.length === 0) return;

    const spacing = graphWidth / dataPoints.length;
    const barWidth = Math.min(spacing * 0.45, 30);

    dataPoints.forEach((val, i) => {
      const x = padding + spacing * i + spacing / 2 - barWidth / 2;
      const barH = (val / maxVal) * graphHeight;
      const y = height - padding - barH;

      const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
      gradient.addColorStop(0, '#8b5cf6');
      gradient.addColorStop(1, '#6366f1');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
      ctx.fill();

      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted') || '#64748b';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      if (labels[i]) ctx.fillText(labels[i], x + barWidth / 2, height - 10);
    });
  }

  static renderCircularGauge(container, score = 0, label = 'Readiness') {
    if (!container) return;
    const size = 160;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    container.innerHTML = `
      <div style="position:relative; width:${size}px; height:${size}px; margin:0 auto; display:flex; align-items:center; justify-content:center;">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="var(--bg-subtle)" stroke-width="${strokeWidth}"/>
          <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="url(#gaugeGrad)" stroke-width="${strokeWidth}"
            stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round" transform="rotate(-90 ${size/2} ${size/2})"
            style="transition: stroke-dashoffset 0.8s ease;"/>
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#3b82f6"/>
              <stop offset="100%" stop-color="#8b5cf6"/>
            </linearGradient>
          </defs>
        </svg>
        <div style="position:absolute; text-align:center;">
          <div style="font-size:2.2rem; font-weight:800; font-family:'Plus Jakarta Sans',sans-serif;">${score}%</div>
          <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">${label}</div>
        </div>
      </div>
    `;
  }

  static renderHeatmap(container, history = []) {
    if (!container) return;

    // Build a date → count map from history items
    const activityMap = {};
    history.forEach(h => {
      // date is stored as 'YYYY-MM-DD HH:MM' or 'YYYY-MM-DD'
      const dateStr = h.date ? h.date.split(' ')[0] : null;
      if (dateStr) {
        activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
      }
    });

    // Generate 196 cells (28 weeks × 7 days = 196 days, going backwards)
    const today = new Date();
    let cells = '';
    for (let i = 195; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const count = activityMap[dateStr] || 0;
      const label = `${dateStr}: ${count > 0 ? count + ' activit' + (count === 1 ? 'y' : 'ies') : 'No activity'}`;
      cells += `<div class="heatmap-cell" data-count="${Math.min(count, 4)}" title="${label}"></div>`;
    }
    container.innerHTML = cells;
  }
}
