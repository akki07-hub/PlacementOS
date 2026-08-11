/* ==========================================================================
   StreakEngine.js - Study Consistency & Daily Activity Streak Tracker
   ========================================================================== */

export class StreakEngine {
  static updateStreak(stats) {
    const todayStr = new Date().toISOString().split('T')[0];
    const lastActive = stats.lastActiveDate;

    if (!lastActive) {
      stats.currentStreak = 1;
      stats.longestStreak = Math.max(stats.longestStreak || 1, 1);
      stats.lastActiveDate = todayStr;
      return stats;
    }

    if (lastActive === todayStr) {
      // Already logged activity today
      return stats;
    }

    const lastDate = new Date(lastActive);
    const currentDate = new Date(todayStr);
    const diffTime = Math.abs(currentDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Yesterday activity -> increment streak!
      stats.currentStreak = (stats.currentStreak || 0) + 1;
    } else if (diffDays > 1) {
      // Missed days -> reset streak to 1
      stats.currentStreak = 1;
    }

    stats.longestStreak = Math.max(stats.longestStreak || 1, stats.currentStreak);
    stats.lastActiveDate = todayStr;
    return stats;
  }
}
