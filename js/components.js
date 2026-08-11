/* ==========================================================================
   UI Components Engine (Toasts, Modals, Search Palette, Exporter)
   Student Career Roadmap & Placement Readiness System
   ========================================================================== */

const UIComponents = {
  // Toast Notifications
  showToast(message, type = 'success', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      success: '✓',
      info: 'ℹ',
      warning: '⚠',
      danger: '✕'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div style="font-weight:700; font-size:1.1rem;">${icons[type] || '•'}</div>
      <div style="flex:1; font-size:0.875rem; font-weight:500;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // Modal Manager
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  },

  // Command Palette & Instant Search
  initSearchPalette() {
    const searchInputs = document.querySelectorAll('.search-input');
    const commandModal = document.getElementById('command-palette-modal');

    // Ctrl + K shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        UIComponents.openModal('command-palette-modal');
        const paletteInput = document.getElementById('palette-search-input');
        if (paletteInput) paletteInput.focus();
      }
    });

    searchInputs.forEach(input => {
      input.addEventListener('focus', () => {
        UIComponents.openModal('command-palette-modal');
        const paletteInput = document.getElementById('palette-search-input');
        if (paletteInput) paletteInput.focus();
      });
    });

    const paletteInput = document.getElementById('palette-search-input');
    const resultsContainer = document.getElementById('palette-results');

    if (paletteInput && resultsContainer) {
      paletteInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
          resultsContainer.innerHTML = `<div style="padding:1rem; text-align:center; color:var(--text-muted); font-size:0.85rem;">Type to search tasks, skills, and roadmap milestones...</div>`;
          return;
        }

        const state = window.appState.data;
        const matches = [];

        // Search Tasks
        state.tasks.forEach(t => {
          if (t.title.toLowerCase().includes(query) || t.category.toLowerCase().includes(query)) {
            matches.push({ type: 'Task', title: t.title, sub: `Task • Priority: ${t.priority}`, link: '#task-manager' });
          }
        });

        // Search Roadmap
        state.roadmap.forEach(cat => {
          cat.milestones.forEach(m => {
            if (m.title.toLowerCase().includes(query)) {
              matches.push({ type: 'Roadmap', title:m.title, sub: `Milestone • ${cat.category}`, link: '#roadmap' });
            }
          });
        });

        // Search Skills
        state.skills.forEach(s => {
          if (s.name.toLowerCase().includes(query)) {
            matches.push({ type: 'Skill', title: s.name, sub: `Skill • ${s.level} (${s.percent}%)`, link: '#skill-tracker' });
          }
        });

        if (matches.length === 0) {
          resultsContainer.innerHTML = `<div style="padding:1.5rem; text-align:center; color:var(--text-muted);">No matching results found for "${query}"</div>`;
          return;
        }

        resultsContainer.innerHTML = matches.map(m => `
          <div class="palette-item" onclick="window.location.hash='${m.link}'; UIComponents.closeModal('command-palette-modal');"
               style="padding:0.75rem 1rem; border-bottom:1px solid var(--border-subtle); cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:600; font-size:0.9rem;">${m.title}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${m.sub}</div>
            </div>
            <span class="nav-badge">${m.type}</span>
          </div>
        `).join('');
      });
    }
  },

  // Export Helpers
  downloadCSV() {
    const tasks = window.appState.data.tasks;
    let csvContent = "data:text/csv;charset=utf-8,ID,Title,Category,Priority,Status,Deadline,Progress\n";
    tasks.forEach(t => {
      csvContent += `"${t.id}","${t.title}","${t.category}","${t.priority}","${t.status}","${t.deadline}","${t.progress}%"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "placement_tasks_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    UIComponents.showToast('CSV Task Report downloaded successfully!', 'success');
  },

  backupJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.appState.data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `placement_roadmap_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    UIComponents.showToast('State backup JSON exported!', 'success');
  }
};

window.UIComponents = UIComponents;
