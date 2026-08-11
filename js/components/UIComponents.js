/* ==========================================================================
   UIComponents.js - Reusable Accessible UI Components (Toasts, Modals, Empty States)
   ========================================================================== */

export class UIComponents {
  static showToast(message, type = 'success', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = { success: '✓', info: 'ℹ', warning: '⚠', danger: '✕' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div style="font-weight:700; font-size:1.1rem;" aria-hidden="true">${icons[type] || '•'}</div>
      <div style="flex:1; font-size:0.875rem; font-weight:500;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  static openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      const firstInput = modal.querySelector('input, select, textarea, button');
      if (firstInput) firstInput.focus();
    }
  }

  static closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  static renderEmptyState(title, subtitle, actionHTML = '') {
    return `
      <div class="empty-state-card" style="text-align:center; padding:3rem 1.5rem; background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg);">
        <div style="font-size:3rem; margin-bottom:0.75rem;" aria-hidden="true">🚀</div>
        <h3 style="font-size:1.25rem; font-weight:700; margin-bottom:0.5rem;">${title}</h3>
        <p style="color:var(--text-muted); font-size:0.9rem; max-width:420px; margin:0 auto 1.5rem auto;">${subtitle}</p>
        ${actionHTML}
      </div>
    `;
  }
}
