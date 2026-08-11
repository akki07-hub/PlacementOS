/* ==========================================================================
   StateStore.js - Enhanced Reactive State Store with Undo/Redo & Security
   ========================================================================== */

import { StorageService } from './StorageService.js';
import { StreakEngine } from './StreakEngine.js';
import { AchievementEngine } from './AchievementEngine.js';
import { ReadinessEngine } from './ReadinessEngine.js';
import { UndoRedoEngine } from './UndoRedoEngine.js';
import { SecurityUtils } from '../utils/SecurityUtils.js';
import { NotificationService } from '../services/NotificationService.js';

export class StateStore {
  constructor() {
    this.listeners = [];
    this.undoRedoEngine = new UndoRedoEngine(20);
    this.data = this.init();
  }

  init() {
    const loaded = StorageService.load();
    if (loaded && loaded.user && loaded.user.onboardingCompleted) {
      return loaded;
    }
    return this.createEmptyState();
  }

  createEmptyState() {
    return {
      theme: 'light',
      user: {
        name: '',
        email: '',
        college: '',
        gradYear: '2027',
        cgpa: '',
        bio: '',
        avatar: '',
        targetRole: 'Software Engineer',
        targetCompanies: ['Google', 'Microsoft', 'Amazon'],
        onboardingCompleted: false
      },
      stats: { currentStreak: 0, longestStreak: 0, lastActiveDate: null },
      careerRoles: [
        { id: 'swe', title: 'Software Engineer', desc: 'Core DSA, System Design, Problem Solving', icon: '💻' },
        { id: 'fullstack', title: 'Full Stack Developer', desc: 'React, Node.js, Databases, REST APIs', icon: '🌐' },
        { id: 'ai', title: 'AI Engineer', desc: 'Python, PyTorch, LLMs, Machine Learning', icon: '🤖' },
        { id: 'data', title: 'Data Analyst', desc: 'SQL, Python, Pandas, Tableau, Statistics', icon: '📊' },
        { id: 'cyber', title: 'Cyber Security Engineer', desc: 'Network Security, Ethical Hacking, Cryptography', icon: '🛡️' },
        { id: 'cloud', title: 'Cloud Engineer', desc: 'AWS, GCP, Terraform, Kubernetes', icon: '☁️' },
        { id: 'devops', title: 'DevOps Engineer', desc: 'CI/CD, Docker, Linux, Infrastructure as Code', icon: '♾️' }
      ],
      companies: [
        { id: 'google', name: 'Google', tier: 'Dream', logo: 'G' },
        { id: 'microsoft', name: 'Microsoft', tier: 'Dream', logo: 'MS' },
        { id: 'amazon', name: 'Amazon', tier: 'Dream', logo: 'AMZ' },
        { id: 'adobe', name: 'Adobe', tier: 'Dream', logo: 'ADB' },
        { id: 'oracle', name: 'Oracle', tier: 'Super Dream', logo: 'ORC' },
        { id: 'tcs', name: 'TCS', tier: 'Mass Recruit', logo: 'TCS' },
        { id: 'infosys', name: 'Infosys', tier: 'Mass Recruit', logo: 'INF' },
        { id: 'accenture', name: 'Accenture', tier: 'Core', logo: 'ACC' },
        { id: 'deloitte', name: 'Deloitte', tier: 'Core', logo: 'DEL' }
      ],
      roadmap: [
        {
          id: 'cat-prog', category: 'Programming', icon: '💻', weight: 20,
          milestones: [
            { id: 'm1', title: 'HTML5 & CSS3 Responsive Layouts', completed: false },
            { id: 'm2', title: 'JavaScript ES6+ & Promises', completed: false },
            { id: 'm3', title: 'React Hooks & State Management', completed: false },
            { id: 'm4', title: 'Node.js Express REST APIs', completed: false }
          ]
        },
        {
          id: 'cat-dsa', category: 'Data Structures & Algorithms', icon: '🧠', weight: 25,
          milestones: [
            { id: 'm5', title: 'Arrays & Two Pointers', completed: false },
            { id: 'm6', title: 'Linked Lists & Hash Tables', completed: false },
            { id: 'm7', title: 'Trees & Graph Traversal (BFS/DFS)', completed: false },
            { id: 'm8', title: 'Dynamic Programming Patterns', completed: false }
          ]
        },
        {
          id: 'cat-projects', category: 'Projects', icon: '🛠️', weight: 20,
          milestones: [
            { id: 'm9', title: 'Responsive Portfolio Website', completed: false },
            { id: 'm10', title: 'Full Stack SaaS Application', completed: false }
          ]
        },
        {
          id: 'cat-resume', category: 'Resume', icon: '📄', weight: 10,
          milestones: [
            { id: 'm11', title: 'ATS Keyword Optimization', completed: false },
            { id: 'm12', title: 'Project Metrics & Bullet Points', completed: false }
          ]
        },
        {
          id: 'cat-communication', category: 'Communication', icon: '🗣️', weight: 10,
          milestones: [
            { id: 'm13', title: 'Elevator Pitch & Behavioral STAR Questions', completed: false }
          ]
        },
        {
          id: 'cat-interview', category: 'Interview Preparation', icon: '🎯', weight: 10,
          milestones: [
            { id: 'm14', title: 'Mock Coding Interviews', completed: false },
            { id: 'm15', title: 'System Design Basics', completed: false }
          ]
        },
        {
          id: 'cat-aptitude', category: 'Aptitude', icon: '📐', weight: 5,
          milestones: [
            { id: 'm16', title: 'Quantitative & Logical Reasoning Tests', completed: false }
          ]
        }
      ],
      tasks: [],
      skills: [
        { id: 's1', name: 'HTML & CSS', category: 'Programming', level: 'Beginner', percent: 30 },
        { id: 's2', name: 'JavaScript / ES6+', category: 'Programming', level: 'Beginner', percent: 25 },
        { id: 's3', name: 'Data Structures (Arrays)', category: 'DSA', level: 'Beginner', percent: 20 },
        { id: 's4', name: 'Resume ATS Optimization', category: 'Resume', level: 'Beginner', percent: 40 }
      ],
      achievements: [
        { id: 'a1', title: 'First Task', desc: 'Completed your very first task', icon: '🏆', unlocked: false, progress: 0 },
        { id: 'a_10_tasks', title: '10 Tasks Completed', desc: 'Finished 10 placement tasks', icon: '⚡', unlocked: false, progress: 0 },
        { id: 'a_50_tasks', title: '50 Tasks Completed', desc: 'Finished 50 placement tasks', icon: '🎯', unlocked: false, progress: 0 },
        { id: 'a4', title: '100 Tasks Completed', desc: 'Finished 100 placement tasks', icon: '💯', unlocked: false, progress: 0 },
        { id: 'a2', title: '7-Day Streak', desc: 'Maintained a 7-day study streak', icon: '🔥', unlocked: false, progress: 0 },
        { id: 'a3', title: '30-Day Streak', desc: 'Maintained a 30-day study streak', icon: '⚡', unlocked: false, progress: 0 },
        { id: 'a_100_roadmap', title: '100% Roadmap', desc: 'Completed all roadmap milestones', icon: '👑', unlocked: false, progress: 0 },
        { id: 'a7', title: 'Interview Ready', desc: 'Attained a Placement Readiness score of 80%+', icon: '🚀', unlocked: false, progress: 0 }
      ],
      history: [],
      notifications: [
        { id: 'n1', title: 'Welcome to PlacementOS!', text: 'Complete your profile to generate your customized roadmap.', time: 'Just now', read: false }
      ]
    };
  }

  subscribe(fn) {
    this.listeners.push(fn);
  }

  recordSnapshot() {
    this.undoRedoEngine.recordSnapshot(this.data);
  }

  undo() {
    const prev = this.undoRedoEngine.undo(this.data);
    if (prev) {
      this.data = prev;
      StorageService.save(this.data);
      this.notify(false); // don't record snapshot on undo
      return true;
    }
    return false;
  }

  redo() {
    const next = this.undoRedoEngine.redo(this.data);
    if (next) {
      this.data = next;
      StorageService.save(this.data);
      this.notify(false);
      return true;
    }
    return false;
  }

  notify(shouldRecord = true) {
    if (shouldRecord) {
      this.recordSnapshot();
    }

    StreakEngine.updateStreak(this.data.stats);
    const newBadges = AchievementEngine.evaluate(this.data);
    
    StorageService.save(this.data);
    this.listeners.forEach(fn => fn(this.data, newBadges));
  }

  completeOnboarding(userProfile) {
    const cleanName = SecurityUtils.escapeHTML(userProfile.name);
    this.data.user = {
      ...this.data.user,
      ...userProfile,
      name: cleanName,
      email: SecurityUtils.escapeHTML(userProfile.email),
      college: SecurityUtils.escapeHTML(userProfile.college),
      avatar: cleanName ? cleanName.split(' ').map(n=>n[0]).join('').toUpperCase() : 'ST',
      onboardingCompleted: true
    };
    this.addHistoryLog('system', 'Completed First-Time Setup Onboarding', '🎉');
    NotificationService.addNotification(this.data, 'Onboarding Completed', 'Your profile and placement dashboard are ready!');
    this.notify();
  }

  addTask(taskData) {
    const newTask = {
      id: 't_' + Date.now(),
      title: SecurityUtils.escapeHTML(taskData.title.trim()),
      category: SecurityUtils.escapeHTML(taskData.category),
      priority: SecurityUtils.escapeHTML(taskData.priority),
      status: taskData.status || 'pending',
      deadline: taskData.deadline || new Date().toISOString().split('T')[0],
      progress: taskData.status === 'completed' ? 100 : 0,
      estTime: taskData.estTime || '2h',
      createdAt: new Date().toISOString()
    };
    this.data.tasks.unshift(newTask);
    this.addHistoryLog('task', `Created task "${newTask.title}"`, '📋');
    NotificationService.addNotification(this.data, 'Task Created', `Added "${newTask.title}"`);
    this.notify();
  }

  updateTask(taskId, updatedFields) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (task) {
      const sanitized = SecurityUtils.sanitizeObject(updatedFields);
      Object.assign(task, sanitized);
      if (updatedFields.status === 'completed') task.progress = 100;
      this.addHistoryLog('task', `Updated task "${task.title}"`, '✏️');
      this.notify();
    }
  }

  deleteTask(taskId) {
    const idx = this.data.tasks.findIndex(t => t.id === taskId);
    if (idx >= 0) {
      const removed = this.data.tasks.splice(idx, 1)[0];
      this.addHistoryLog('task', `Deleted task "${removed.title}"`, '🗑️');
      this.notify();
    }
  }

  duplicateTask(taskId) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (task) {
      const dup = {
        ...JSON.parse(JSON.stringify(task)),
        id: 't_' + Date.now(),
        title: `${task.title} (Copy)`,
        createdAt: new Date().toISOString()
      };
      this.data.tasks.unshift(dup);
      this.addHistoryLog('task', `Duplicated task "${dup.title}"`, '📄');
      this.notify();
    }
  }

  addSkill(skillData) {
    const newSkill = {
      id: 's_' + Date.now(),
      name: SecurityUtils.escapeHTML(skillData.name.trim()),
      category: SecurityUtils.escapeHTML(skillData.category || 'Other'),
      level: SecurityUtils.escapeHTML(skillData.level || 'Beginner'),
      percent: Math.min(100, Math.max(0, parseInt(skillData.percent) || 0))
    };
    if (!this.data.skills) this.data.skills = [];
    this.data.skills.push(newSkill);
    this.addHistoryLog('skill', `Added skill "${newSkill.name}"`, '⚡');
    this.notify();
  }

  updateSkill(skillId, updatedFields) {
    if (!this.data.skills) return;
    const skill = this.data.skills.find(s => s.id === skillId);
    if (skill) {
      if (updatedFields.percent !== undefined) skill.percent = Math.min(100, Math.max(0, parseInt(updatedFields.percent) || 0));
      if (updatedFields.level !== undefined) skill.level = SecurityUtils.escapeHTML(updatedFields.level);
      if (updatedFields.name !== undefined) skill.name = SecurityUtils.escapeHTML(updatedFields.name.trim());
      StorageService.save(this.data);
      // Lightweight save (no full notify to avoid re-render loop on slider drag)
    }
  }

  updateSkillAndNotify(skillId, updatedFields) {
    this.updateSkill(skillId, updatedFields);
    this.addHistoryLog('skill', `Updated skill`, '✏️');
    this.notify();
  }

  deleteSkill(skillId) {
    if (!this.data.skills) return;
    const idx = this.data.skills.findIndex(s => s.id === skillId);
    if (idx >= 0) {
      const removed = this.data.skills.splice(idx, 1)[0];
      this.addHistoryLog('skill', `Removed skill "${removed.name}"`, '🗑️');
      this.notify();
    }
  }

  addMilestone(categoryId, title) {
    const cat = this.data.roadmap.find(c => c.id === categoryId || c.category === categoryId);
    if (cat) {
      const newM = {
        id: 'm_' + Date.now(),
        title: SecurityUtils.escapeHTML(title.trim()),
        completed: false
      };
      cat.milestones.push(newM);
      this.addHistoryLog('milestone', `Added milestone "${newM.title}" to ${cat.category}`, '➕');
      this.notify();
    }
  }

  editMilestone(milestoneId, newTitle) {
    this.data.roadmap.forEach(cat => {
      const m = cat.milestones.find(item => item.id === milestoneId);
      if (m) {
        m.title = SecurityUtils.escapeHTML(newTitle.trim());
        this.addHistoryLog('milestone', `Renamed milestone to "${m.title}"`, '✏️');
        this.notify();
      }
    });
  }

  deleteMilestone(milestoneId) {
    this.data.roadmap.forEach(cat => {
      const idx = cat.milestones.findIndex(item => item.id === milestoneId);
      if (idx >= 0) {
        const removed = cat.milestones.splice(idx, 1)[0];
        this.addHistoryLog('milestone', `Deleted milestone "${removed.title}"`, '🗑️');
        this.notify();
      }
    });
  }

  toggleMilestone(milestoneId) {
    this.data.roadmap.forEach(cat => {
      const m = cat.milestones.find(item => item.id === milestoneId);
      if (m) {
        m.completed = !m.completed;
        const text = m.completed ? `Completed milestone "${m.title}"` : `Unchecked milestone "${m.title}"`;
        this.addHistoryLog(m.completed ? 'milestone' : 'system', text, m.completed ? '🎯' : '🔄');
        this.notify();
      }
    });
  }

  addHistoryLog(type, title, icon = '📌') {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    this.data.history.unshift({
      id: 'h_' + Date.now(),
      type,
      title: SecurityUtils.escapeHTML(title),
      date: formatted,
      icon
    });
  }

  loadDemoData() {
    this.data = this.createEmptyState();
    this.data.user = {
      name: 'Alex Rivera',
      email: 'alex.rivera@university.edu',
      college: 'Institute of Technology',
      gradYear: '2027',
      cgpa: '8.8',
      bio: 'Passionate CS student aiming for Tier-1 software engineering & full-stack roles.',
      avatar: 'AR',
      targetRole: 'Software Engineer',
      targetCompanies: ['Google', 'Microsoft', 'Amazon', 'Adobe'],
      onboardingCompleted: true
    };
    this.data.stats = { currentStreak: 12, longestStreak: 24, lastActiveDate: new Date().toISOString().split('T')[0] };
    this.data.tasks = [
      { id: 't1', title: 'Complete JavaScript Async & Promises module', priority: 'high', category: 'Programming', status: 'completed', deadline: '2026-07-25', progress: 100, estTime: '3h' },
      { id: 't2', title: 'Practice DSA Arrays & Sliding Window problems', priority: 'high', category: 'Data Structures & Algorithms', status: 'in-progress', deadline: '2026-07-29', progress: 65, estTime: '4h' },
      { id: 't3', title: 'Build Full Stack Placement Dashboard UI', priority: 'high', category: 'Projects', status: 'in-progress', deadline: '2026-07-30', progress: 80, estTime: '8h' },
      { id: 't4', title: 'Update Resume with ATS formatting', priority: 'medium', category: 'Resume', status: 'completed', deadline: '2026-07-24', progress: 100, estTime: '2h' }
    ];
    this.addHistoryLog('system', 'Loaded Demo Sample Data', '📦');
    this.notify();
  }

  resetAllData() {
    StorageService.clear();
    this.data = this.createEmptyState();
    this.notify();
  }
}

export const appState = new StateStore();
