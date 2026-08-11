/* ==========================================================================
   KeyboardShortcuts.js - Global Hotkey Controller
   ========================================================================== */

import { UIComponents } from '../components/UIComponents.js';

export class KeyboardShortcuts {
  static init(appState) {
    document.addEventListener('keydown', (e) => {
      const isCtrl = e.ctrlKey || e.metaKey;

      // Ctrl + K: Search Palette
      if (isCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        UIComponents.openModal('command-palette-modal');
        const input = document.getElementById('palette-search-input');
        if (input) input.focus();
        return;
      }

      // Ctrl + N: Create Task
      if (isCtrl && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        UIComponents.openModal('add-task-modal');
        const titleInput = document.getElementById('task-title-input');
        if (titleInput) titleInput.focus();
        return;
      }

      // Ctrl + /: Shortcuts Cheatsheet
      if (isCtrl && e.key === '/') {
        e.preventDefault();
        UIComponents.openModal('shortcuts-modal');
        return;
      }

      // Ctrl + Z: Undo
      if (isCtrl && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (appState.undo()) {
          UIComponents.showToast('Action undone (Ctrl+Z)', 'info');
        }
        return;
      }

      // Ctrl + Y or Ctrl + Shift + Z: Redo
      if (isCtrl && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        if (appState.redo()) {
          UIComponents.showToast('Action redone (Ctrl+Y)', 'info');
        }
        return;
      }

      // Ctrl + Shift + D: Developer Mode
      if (isCtrl && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        window.devModeActive = !window.devModeActive;
        const panel = document.getElementById('dev-mode-panel');
        if (panel) panel.style.display = window.devModeActive ? 'block' : 'none';
        UIComponents.showToast(`Developer Mode ${window.devModeActive ? 'Enabled' : 'Disabled'}`, 'info');
        return;
      }

      // Esc: Close Modals
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => {
          m.classList.remove('active');
        });
      }
    });
  }
}
