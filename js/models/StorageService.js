/* ==========================================================================
   StorageService.js - LocalStorage & Persistence Management
   ========================================================================== */

const STORAGE_KEY = 'PLACEMENT_ROADMAP_STATE_V2';

export class StorageService {
  static load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch (err) {
      console.error('[StorageService] Failed to load data from localStorage:', err);
    }
    return null;
  }

  static save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      console.error('[StorageService] Failed to save state to localStorage:', err);
      return false;
    }
  }

  static clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (err) {
      console.error('[StorageService] Failed to clear localStorage:', err);
      return false;
    }
  }

  static validateBackupJSON(jsonObj) {
    if (!jsonObj || typeof jsonObj !== 'object') return false;
    // Check key structural properties
    return Array.isArray(jsonObj.tasks) && Array.isArray(jsonObj.roadmap) && typeof jsonObj.user === 'object';
  }
}
