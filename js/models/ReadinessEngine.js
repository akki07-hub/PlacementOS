/* ==========================================================================
   ReadinessEngine.js - Weighted Placement Readiness Score Engine
   ========================================================================== */

export class ReadinessEngine {
  static WEIGHTS = {
    'Programming': 20,
    'Data Structures & Algorithms': 25,
    'Projects': 20,
    'Resume': 10,
    'Communication': 10,
    'Interview Preparation': 10,
    'Aptitude': 5
  };

  static calculate(roadmap = []) {
    let totalWeightedScore = 0;
    let totalWeightApplied = 0;
    const categoryScores = {};

    roadmap.forEach(cat => {
      const catName = cat.category;
      const weight = ReadinessEngine.WEIGHTS[catName] || cat.weight || 10;
      const totalMilestones = cat.milestones ? cat.milestones.length : 0;
      const completedMilestones = cat.milestones ? cat.milestones.filter(m => m.completed).length : 0;
      
      const categoryRatio = totalMilestones > 0 ? (completedMilestones / totalMilestones) : 0;
      const categoryPercent = Math.round(categoryRatio * 100);
      
      categoryScores[catName] = {
        percent: categoryPercent,
        completed: completedMilestones,
        total: totalMilestones,
        weight
      };

      totalWeightedScore += categoryRatio * weight;
      totalWeightApplied += weight;
    });

    const score = totalWeightApplied > 0 ? Math.round((totalWeightedScore / totalWeightApplied) * 100) : 0;
    const level = ReadinessEngine.getLevel(score);

    return {
      score,
      level,
      categoryScores
    };
  }

  static getLevel(score) {
    if (score >= 85) return { label: 'Interview Ready', key: 'ready', color: 'var(--success)', bg: 'var(--success-bg)' };
    if (score >= 65) return { label: 'Advanced', key: 'advanced', color: 'var(--primary-600)', bg: 'var(--primary-100)' };
    if (score >= 40) return { label: 'Intermediate', key: 'intermediate', color: 'var(--warning)', bg: 'var(--warning-bg)' };
    return { label: 'Beginner', key: 'beginner', color: 'var(--danger)', bg: 'var(--danger-bg)' };
  }
}
