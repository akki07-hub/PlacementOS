/* ==========================================================================
   app.js - Main ES6 Application Controller & Router
   ========================================================================== */

import { appState } from './models/StateStore.js';
import { StorageService } from './models/StorageService.js';
import { UIComponents } from './components/UIComponents.js';
import { OnboardingWizard } from './components/OnboardingWizard.js';
import { ExportService } from './services/ExportService.js';

import { DashboardView } from './views/DashboardView.js';
import { ProfileView } from './views/ProfileView.js';
import { CareerGoalsView } from './views/CareerGoalsView.js';
import { RoadmapView } from './views/RoadmapView.js';
import { TaskManagerView } from './views/TaskManagerView.js';
import { SkillTrackerView } from './views/SkillTrackerView.js';
import { PlacementReadinessView } from './views/PlacementReadinessView.js';
import { AnalyticsView } from './views/AnalyticsView.js';
import { HistoryView } from './views/HistoryView.js';
import { AchievementsView } from './views/AchievementsView.js';
import { ExportView } from './views/ExportView.js';
import { SettingsView } from './views/SettingsView.js';

window.appState = appState;
window.UIComponents = UIComponents;
window.StorageService = StorageService;
window.ExportService = ExportService;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme
  const savedTheme = appState.data.theme || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // 2. Initialize Date
  const dateEl = document.getElementById('current-date');
  if (dateEl) {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    dateEl.textContent = new Date().toLocaleDateString('en-US', options);
  }

  // 3. Router Mapping for 12 Views
  const routes = {
    'dashboard': { title: 'Dashboard Overview', renderer: DashboardView.render },
    'profile': { title: 'Student Profile', renderer: ProfileView.render },
    'career-goals': { title: 'Career Goals & Companies', renderer: CareerGoalsView.render },
    'roadmap': { title: 'Placement Career Roadmap', renderer: RoadmapView.render },
    'task-manager': { title: 'Task Manager (Kanban)', renderer: TaskManagerView.render },
    'skill-tracker': { title: 'Skill Mastery Tracker', renderer: SkillTrackerView.render },
    'placement-readiness': { title: 'Placement Readiness Score', renderer: PlacementReadinessView.render },
    'analytics': { title: 'Productivity & Growth Analytics', renderer: AnalyticsView.render },
    'history': { title: 'Activity & Milestone History', renderer: HistoryView.render },
    'achievements': { title: 'Placement Badges & Achievements', renderer: AchievementsView.render },
    'export': { title: 'Export Placement Reports', renderer: ExportView.render },
    'settings': { title: 'System & Account Settings', renderer: SettingsView.render }
  };

  let _currentRoute = null;

  function navigate(forceRender = false) {
    let hash = window.location.hash.replace('#', '') || 'dashboard';
    if (!routes[hash]) hash = 'dashboard';

    const routeChanged = hash !== _currentRoute;
    _currentRoute = hash;

    document.querySelectorAll('.page-view').forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(`page-${hash}`);
    if (targetPage) {
      targetPage.classList.add('active');
      // Only re-render if route changed OR forced (state update)
      if (routeChanged || forceRender) {
        routes[hash].renderer(targetPage, appState);
      }
    }

    document.querySelectorAll('.nav-item').forEach(item => {
      const isActive = item.getAttribute('href') === `#${hash}`;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    const titleEl = document.getElementById('header-title');
    if (titleEl) titleEl.textContent = routes[hash].title;
    document.title = `${routes[hash].title} | PlacementOS`;

    // Sync header profile pill
    const user = appState.data.user;
    const headerAvatar = document.getElementById('header-user-avatar');
    if (headerAvatar && user) {
      headerAvatar.textContent = user.avatar || 'ST';
    }
    const headerAvatarLink = document.querySelector('a.avatar[href="#profile"]');
    if (headerAvatarLink && user) {
      headerAvatarLink.textContent = user.avatar || 'ST';
    }
    // Update sidebar user info
    const sidebarUserName = document.querySelector('.sidebar-footer .user-name');
    const sidebarUserRole = document.querySelector('.sidebar-footer .user-role');
    if (sidebarUserName && user && user.name) sidebarUserName.textContent = user.name;
    if (sidebarUserRole && user && user.targetRole) sidebarUserRole.textContent = user.targetRole;
  }

  window.addEventListener('hashchange', () => navigate(true));

  // 4. Reactive State Store Subscription
  appState.subscribe((data, newBadges) => {
    navigate(true); // Force re-render on state change
    if (newBadges && newBadges.length > 0) {
      newBadges.forEach(b => {
        UIComponents.showToast(`🏆 Achievement Unlocked: "${b.title}"!`, 'success');
      });
    }
    // Update notification badge count
    const unread = (data.notifications || []).filter(n => !n.read).length;
    const notifBadge = document.querySelector('.notification-badge');
    if (notifBadge) {
      notifBadge.textContent = unread > 0 ? unread : '';
      notifBadge.style.display = unread > 0 ? 'flex' : 'none';
    }
  });

  // 5. Initial Navigation
  navigate(true);

  // 6. Check Onboarding Status
  if (!appState.data.user || !appState.data.user.onboardingCompleted) {
    OnboardingWizard.show(appState);
  }

  // 7. Sidebar Toggle
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const appContainer = document.getElementById('app');
  if (sidebarToggle && appContainer) {
    sidebarToggle.addEventListener('click', () => {
      appContainer.classList.toggle('sidebar-collapsed');
    });
  }

  // 8. Theme Switcher
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      appState.data.theme = next;
      StorageService.save(appState.data);
      UIComponents.showToast(`Switched to ${next} mode ✨`, 'info');
    });
  }

  // 9b. Ctrl+K Search Palette
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const input = document.querySelector('.search-input');
      if (input) { input.focus(); input.select(); }
    }
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) activeModal.classList.remove('active');
    }
  });

  // Search input quick navigation
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) return;
      const routeKeys = Object.keys(routes);
      const match = routeKeys.find(k => k.includes(q) || routes[k].title.toLowerCase().includes(q));
      if (match) {
        searchInput._matchRoute = match;
      }
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput._matchRoute) {
        window.location.hash = '#' + searchInput._matchRoute;
        searchInput.value = '';
        searchInput._matchRoute = null;
        searchInput.blur();
      }
    });
  }

  // 9. Notifications Bell Toggle
  const notifBtn = document.getElementById('notif-btn');
  const notifDropdown = document.getElementById('notif-dropdown');
  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
        notifDropdown.classList.remove('active');
      }
    });
  }

  // 10. Add Task Modal Form Submit Handler
  const addTaskForm = document.getElementById('add-task-form');
  if (addTaskForm) {
    addTaskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('task-title-input').value;
      const category = document.getElementById('task-cat-input').value;
      const priority = document.getElementById('task-priority-input').value;
      const deadline = document.getElementById('task-deadline-input').value;

      if (!title) return;

      appState.addTask({ title, category, priority, deadline, status: 'pending' });
      UIComponents.closeModal('add-task-modal');
      addTaskForm.reset();
      UIComponents.showToast('New task created!', 'success');
    });
  }
});
