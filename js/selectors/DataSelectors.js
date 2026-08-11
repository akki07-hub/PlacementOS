/* ==========================================================================
   DataSelectors.js - Pure Business Logic Selectors (Decoupled from UI Views)
   ========================================================================== */

import { ReadinessEngine } from '../models/ReadinessEngine.js';

export class DataSelectors {
  static selectOverallProgress(state) {
    if (!state || !state.roadmap) return 0;
    let total = 0;
    let done = 0;
    state.roadmap.forEach(cat => {
      if (cat.milestones) {
        cat.milestones.forEach(m => {
          total++;
          if (m.completed) done++;
        });
      }
    });
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }

  static selectReadinessScore(state) {
    if (!state || !state.roadmap) return { score: 0, level: { label: 'Beginner' } };
    return ReadinessEngine.calculate(state.roadmap);
  }

  static selectCompletedTaskCount(state) {
    if (!state || !state.tasks) return 0;
    return state.tasks.filter(t => t.status === 'completed').length;
  }

  static selectPendingTaskCount(state) {
    if (!state || !state.tasks) return 0;
    return state.tasks.filter(t => t.status !== 'completed').length;
  }

  static selectUpcomingDeadlines(state, limit = 5) {
    if (!state || !state.tasks) return [];
    return state.tasks
      .filter(t => t.status !== 'completed')
      .sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0))
      .slice(0, limit);
  }

  static selectCategoryCompletion(state) {
    if (!state || !state.roadmap) return [];
    return state.roadmap.map(cat => {
      const total = cat.milestones ? cat.milestones.length : 0;
      const done = cat.milestones ? cat.milestones.filter(m => m.completed).length : 0;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      return {
        id: cat.id,
        category: cat.category,
        icon: cat.icon,
        total,
        done,
        percent: pct
      };
    });
  }

  static selectRealActivityHistory(state) {
    if (!state || !state.history) return [];
    return state.history;
  }
}
