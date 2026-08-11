/* ==========================================================================
   RecommendationEngine.js - Dynamic Actionable Recommendations Engine
   ========================================================================== */

import { ReadinessEngine } from './ReadinessEngine.js';

export class RecommendationEngine {
  static generate(state) {
    const recommendations = [];
    const readiness = ReadinessEngine.calculate(state.roadmap);
    const catScores = readiness.categoryScores;

    // Rule 1: Programming check
    const prog = catScores['Programming'];
    if (prog && prog.percent < 50) {
      recommendations.push({
        id: 'rec_prog',
        title: 'Complete JavaScript & Programming Basics',
        category: 'Programming',
        priority: 'High Impact',
        actionLabel: 'Open Roadmap',
        actionLink: '#roadmap'
      });
    }

    // Rule 2: DSA check
    const dsa = catScores['Data Structures & Algorithms'];
    if (dsa && dsa.percent < 40) {
      recommendations.push({
        id: 'rec_dsa',
        title: 'Practice DSA Arrays & Problem Solving',
        category: 'Data Structures',
        priority: 'Critical',
        actionLabel: 'Practice Tasks',
        actionLink: '#task-manager'
      });
    }

    // Rule 3: Projects check
    const proj = catScores['Projects'];
    if (proj && proj.percent < 50) {
      recommendations.push({
        id: 'rec_proj',
        title: 'Build Portfolio Project',
        category: 'Projects',
        priority: 'High Priority',
        actionLabel: 'View Projects',
        actionLink: '#roadmap'
      });
    }

    // Rule 4: Resume check
    const resume = catScores['Resume'];
    if (resume && resume.percent < 70) {
      recommendations.push({
        id: 'rec_resume',
        title: 'Update Resume with ATS Optimization',
        category: 'Resume',
        priority: 'Quick Win',
        actionLabel: 'Update Resume',
        actionLink: '#roadmap'
      });
    }

    // Rule 5: Communication check
    const comm = catScores['Communication'];
    if (comm && comm.percent < 50) {
      recommendations.push({
        id: 'rec_comm',
        title: 'Improve Communication & STAR Method',
        category: 'Interview Prep',
        priority: 'Soft Skills',
        actionLabel: 'Prepare',
        actionLink: '#roadmap'
      });
    }

    // Fallback if user is doing very well across all categories
    if (recommendations.length < 3) {
      recommendations.push({
        id: 'rec_sysdesign',
        title: 'Practice System Design Architecture & LeetCode Hard',
        category: 'Advanced Prep',
        priority: 'Target Dream Companies',
        actionLabel: 'Level Up',
        actionLink: '#task-manager'
      });
    }

    return recommendations.slice(0, 5); // Return top 5 personalized recommendations
  }
}
