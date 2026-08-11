/* ==========================================================================
   AchievementEngine.js - Automatic Badge Unlock Evaluation System
   ========================================================================== */

import { ReadinessEngine } from './ReadinessEngine.js';

export class AchievementEngine {
  static evaluate(state) {
    const newlyUnlocked = [];
    const completedTasksCount = state.tasks ? state.tasks.filter(t => t.status === 'completed').length : 0;
    const streak = state.stats ? state.stats.currentStreak : 0;
    const readiness = ReadinessEngine.calculate(state.roadmap);
    
    let totalMilestones = 0;
    let completedMilestones = 0;
    if (state.roadmap) {
      state.roadmap.forEach(cat => {
        cat.milestones.forEach(m => {
          totalMilestones++;
          if (m.completed) completedMilestones++;
        });
      });
    }
    const overallProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

    state.achievements.forEach(ach => {
      if (ach.unlocked) return; // Already unlocked

      let unlockConditionMet = false;
      let currentProgress = 0;

      switch (ach.id) {
        case 'a1': // First Task
          unlockConditionMet = completedTasksCount >= 1;
          currentProgress = Math.min(100, Math.round((completedTasksCount / 1) * 100));
          break;
        case 'a_10_tasks': // 10 Tasks
          unlockConditionMet = completedTasksCount >= 10;
          currentProgress = Math.min(100, Math.round((completedTasksCount / 10) * 100));
          break;
        case 'a_50_tasks': // 50 Tasks
          unlockConditionMet = completedTasksCount >= 50;
          currentProgress = Math.min(100, Math.round((completedTasksCount / 50) * 100));
          break;
        case 'a4': // 100 Tasks Completed
          unlockConditionMet = completedTasksCount >= 100;
          currentProgress = Math.min(100, Math.round((completedTasksCount / 100) * 100));
          break;
        case 'a2': // 7-Day Streak
          unlockConditionMet = streak >= 7;
          currentProgress = Math.min(100, Math.round((streak / 7) * 100));
          break;
        case 'a3': // 30-Day Streak
          unlockConditionMet = streak >= 30;
          currentProgress = Math.min(100, Math.round((streak / 30) * 100));
          break;
        case 'a_100_roadmap': // 100% Roadmap
          unlockConditionMet = overallProgress >= 100;
          currentProgress = Math.round(overallProgress);
          break;
        case 'a7': // Interview Ready
          unlockConditionMet = readiness.score >= 80;
          currentProgress = Math.min(100, Math.round((readiness.score / 80) * 100));
          break;
        default:
          break;
      }

      ach.progress = currentProgress;

      if (unlockConditionMet) {
        ach.unlocked = true;
        ach.unlockedAt = new Date().toISOString().split('T')[0];
        newlyUnlocked.push(ach);
      }
    });

    return newlyUnlocked;
  }
}
