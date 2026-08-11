/* ==========================================================================
   State Management & Mock Data Engine
   Student Career Roadmap & Placement Readiness System
   ========================================================================== */

const STORAGE_KEY = 'PLACEMENT_ROADMAP_STATE_V1';

const defaultState = {
  theme: 'light',
  user: {
    name: 'Alex Rivera',
    email: 'alex.rivera@university.edu',
    college: 'Institute of Technology',
    gradYear: '2027',
    cgpa: '8.8 / 10',
    bio: 'Passionate computer science student aiming for Tier-1 software engineering & full-stack roles.',
    avatar: 'AR',
    targetRole: 'Software Engineer',
    targetCompanies: ['Google', 'Microsoft', 'Amazon', 'Adobe']
  },
  stats: {
    currentStreak: 12,
    longestStreak: 24,
    lastActiveDate: '2026-07-28'
  },
  careerRoles: [
    { id: 'swe', title: 'Software Engineer', desc: 'Core DSA, System Design, Problem Solving', icon: '💻' },
    { id: 'fullstack', title: 'Full Stack Developer', desc: 'React, Node.js, Databases, REST/GraphQL APIs', icon: '🌐' },
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
      id: 'cat-programming',
      category: 'Programming',
      icon: '💻',
      weight: 20,
      milestones: [
        { id: 'm1', title: 'HTML5 Semantic Markup', completed: true },
        { id: 'm2', title: 'CSS3 Flexbox & Grid Systems', completed: true },
        { id: 'm3', title: 'JavaScript ES6+ & Async/Await', completed: true },
        { id: 'm4', title: 'React Fundamentals & Hooks', completed: true },
        { id: 'm5', title: 'Node.js Express REST APIs', completed: false },
        { id: 'm6', title: 'Python Object-Oriented Programming', completed: false }
      ]
    },
    {
      id: 'cat-dsa',
      category: 'Data Structures & Algorithms',
      icon: '🧠',
      weight: 25,
      milestones: [
        { id: 'm7', title: 'Arrays & Strings (LeetCode 75)', completed: true },
        { id: 'm8', title: 'Linked Lists & Two Pointers', completed: true },
        { id: 'm9', title: 'Stacks, Queues & Hash Tables', completed: true },
        { id: 'm10', title: 'Trees, Binary Search Trees & Heaps', completed: false },
        { id: 'm11', title: 'Graph Traversal (BFS / DFS)', completed: false },
        { id: 'm12', title: 'Dynamic Programming Patterns', completed: false }
      ]
    },
    {
      id: 'cat-projects',
      category: 'Projects',
      icon: '🛠️',
      weight: 20,
      milestones: [
        { id: 'm13', title: 'Responsive Portfolio Website', completed: true },
        { id: 'm14', title: 'Full-Stack SaaS Application', completed: true },
        { id: 'm15', title: 'AI-Powered Resume Analyzer', completed: false },
        { id: 'm16', title: 'Open Source Contribution', completed: false }
      ]
    },
    {
      id: 'cat-resume',
      category: 'Resume',
      icon: '📄',
      weight: 10,
      milestones: [
        { id: 'm17', title: 'ATS Keyword Optimization', completed: true },
        { id: 'm18', title: 'Project Metrics & Impact Formatting', completed: true },
        { id: 'm19', title: 'LinkedIn Profile Optimization', completed: true },
        { id: 'm20', title: 'Cold Email & Referral Templates', completed: false }
      ]
    },
    {
      id: 'cat-communication',
      category: 'Communication',
      icon: '🗣️',
      weight: 10,
      milestones: [
        { id: 'm21', title: 'Elevator Pitch Crafting', completed: true },
        { id: 'm22', title: 'Behavioral Questions (STAR Method)', completed: true },
        { id: 'm23', title: 'Group Discussion Strategies', completed: false }
      ]
    },
    {
      id: 'cat-interview',
      category: 'Interview Preparation',
      icon: '🎯',
      weight: 10,
      milestones: [
        { id: 'm24', title: 'Mock Coding Interviews (Pramp/Interviewing.io)', completed: false },
        { id: 'm25', title: 'System Design Basics', completed: false },
        { id: 'm26', title: 'HR Round Questions Practice', completed: true }
      ]
    },
    {
      id: 'cat-aptitude',
      category: 'Aptitude',
      icon: '📐',
      weight: 5,
      milestones: [
        { id: 'm27', title: 'Quantitative Aptitude Practice', completed: true },
        { id: 'm28', title: 'Logical Reasoning Tests', completed: true },
        { id: 'm29', title: 'Verbal Ability & Comprehension', completed: true }
      ]
    }
  ],
  tasks: [
    { id: 't1', title: 'Complete JavaScript Async & Promises module', priority: 'high', category: 'Programming', status: 'completed', deadline: '2026-07-25', progress: 100, estTime: '3h' },
    { id: 't2', title: 'Practice DSA Arrays & Sliding Window LeetCode problems', priority: 'high', category: 'DSA', status: 'in-progress', deadline: '2026-07-29', progress: 65, estTime: '4h' },
    { id: 't3', title: 'Build Full Stack Placement Dashboard UI', priority: 'high', category: 'Projects', status: 'in-progress', deadline: '2026-07-30', progress: 80, estTime: '8h' },
    { id: 't4', title: 'Update Resume with ATS formatting', priority: 'medium', category: 'Resume', status: 'completed', deadline: '2026-07-24', progress: 100, estTime: '2h' },
    { id: 't5', title: 'Improve Communication & STAR method answers', priority: 'low', category: 'Communication', status: 'pending', deadline: '2026-08-02', progress: 0, estTime: '3h' },
    { id: 't6', title: 'Solve 5 Dynamic Programming Hard Questions', priority: 'high', category: 'DSA', status: 'pending', deadline: '2026-08-05', progress: 0, estTime: '6h' },
    { id: 't7', title: 'Practice System Design URL Shortener Architecture', priority: 'medium', category: 'Interview', status: 'pending', deadline: '2026-08-07', progress: 0, estTime: '4h' }
  ],
  skills: [
    { id: 's1', name: 'HTML & CSS', category: 'Programming', level: 'Expert', percent: 95 },
    { id: 's2', name: 'JavaScript / ES6+', category: 'Programming', level: 'Advanced', percent: 88 },
    { id: 's3', name: 'React.js', category: 'Programming', level: 'Advanced', percent: 82 },
    { id: 's4', name: 'Data Structures (Arrays/Trees)', category: 'DSA', level: 'Intermediate', percent: 70 },
    { id: 's5', name: 'Dynamic Programming', category: 'DSA', level: 'Beginner', percent: 45 },
    { id: 's6', name: 'Node.js & Express', category: 'Programming', level: 'Intermediate', percent: 65 },
    { id: 's7', name: 'Resume ATS Optimization', category: 'Resume', level: 'Expert', percent: 90 },
    { id: 's8', name: 'Behavioral Interviews (STAR)', category: 'Communication', level: 'Advanced', percent: 85 }
  ],
  achievements: [
    { id: 'a1', title: 'First Task', desc: 'Completed your very first placement task', icon: '🏆', unlocked: true, unlockedAt: '2026-07-10' },
    { id: 'a2', title: '7-Day Streak', desc: 'Maintained a active study streak for 7 consecutive days', icon: '🔥', unlocked: true, unlockedAt: '2026-07-20' },
    { id: 'a3', title: '30-Day Streak', desc: 'Maintained an active streak for 30 consecutive days', icon: '⚡', unlocked: false, progress: 40 },
    { id: 'a4', title: '100 Tasks Completed', desc: 'Successfully executed 100 placement readiness tasks', icon: '💯', unlocked: false, progress: 42 },
    { id: 'a5', title: 'Complete Programming', desc: 'Achieved 100% completion in the Programming category', icon: '💻', unlocked: false, progress: 66 },
    { id: 'a6', title: 'Complete DSA', desc: 'Mastered all Data Structures & Algorithms milestones', icon: '🧠', unlocked: false, progress: 50 },
    { id: 'a7', title: 'Interview Ready', desc: 'Attained a Placement Readiness score of 80%+', icon: '🚀', unlocked: false, progress: 78 },
    { id: 'a8', title: 'Placement Master', desc: 'Unlocked all target company recommendations & skills', icon: '👑', unlocked: false, progress: 70 }
  ],
  history: [
    { id: 'h1', type: 'task', title: 'Completed "Update Resume with ATS formatting"', date: '2026-07-28 14:30', icon: '✅' },
    { id: 'h2', type: 'milestone', title: 'Unlocked Milestone "JavaScript ES6+ & Async/Await"', date: '2026-07-27 18:15', icon: '🎯' },
    { id: 'h3', type: 'achievement', title: 'Earned Badge "7-Day Streak"', date: '2026-07-20 09:00', icon: '🔥' },
    { id: 'h4', type: 'readiness', title: 'Placement Readiness Score increased to 78%', date: '2026-07-26 11:20', icon: '📈' }
  ],
  notifications: [
    { id: 'n1', title: 'Upcoming Deadline Today', text: 'DSA Arrays practice task is due today.', time: '10 mins ago', read: false },
    { id: 'n2', title: 'Streak Maintained!', text: 'You are on a 12-day streak. Keep it up!', time: '2 hours ago', read: false },
    { id: 'n3', title: 'New Recommendation', text: 'Consider completing Mock Technical Interview.', time: '1 day ago', read: true }
  ]
};

// State Manager
class StateStore {
  constructor() {
    this.data = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultState, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  getOverallProgress() {
    let totalMilestones = 0;
    let completedMilestones = 0;
    this.data.roadmap.forEach(cat => {
      cat.milestones.forEach(m => {
        totalMilestones++;
        if (m.completed) completedMilestones++;
      });
    });
    return totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
  }

  getPlacementReadinessScore() {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    this.data.roadmap.forEach(cat => {
      const catTotal = cat.milestones.length;
      const catCompleted = cat.milestones.filter(m => m.completed).length;
      const catRatio = catTotal > 0 ? (catCompleted / catTotal) : 0;
      totalWeightedScore += catRatio * cat.weight;
      totalWeight += cat.weight;
    });

    return totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 100) : 0;
  }

  getReadinessLevel(score) {
    if (score >= 85) return { label: 'Interview Ready', color: 'var(--success)', bg: 'var(--success-bg)' };
    if (score >= 65) return { label: 'Advanced', color: 'var(--primary-600)', bg: 'var(--primary-100)' };
    if (score >= 40) return { label: 'Intermediate', color: 'var(--warning)', bg: 'var(--warning-bg)' };
    return { label: 'Beginner', color: 'var(--danger)', bg: 'var(--danger-bg)' };
  }

  toggleMilestone(milestoneId) {
    this.data.roadmap.forEach(cat => {
      const m = cat.milestones.find(item => item.id === milestoneId);
      if (m) {
        m.completed = !m.completed;
        const actionText = m.completed ? `Completed milestone "${m.title}"` : `Unchecked milestone "${m.title}"`;
        this.addHistoryLog(m.completed ? 'milestone' : 'system', actionText, m.completed ? '🎯' : '🔄');
      }
    });
    this.checkAchievementUnlocks();
    this.saveState();
  }

  addTask(task) {
    const newTask = {
      id: 't_' + Date.now(),
      progress: task.status === 'completed' ? 100 : 0,
      ...task
    };
    this.data.tasks.unshift(newTask);
    this.addHistoryLog('task', `Added task "${newTask.title}"`, '📋');
    this.saveState();
  }

  moveTaskStatus(taskId, newStatus) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      if (newStatus === 'completed') task.progress = 100;
      this.addHistoryLog('task', `Moved "${task.title}" to ${newStatus.replace('-', ' ')}`, '✅');
      this.saveState();
    }
  }

  addHistoryLog(type, title, icon = '📌') {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    this.data.history.unshift({
      id: 'h_' + Date.now(),
      type,
      title,
      date: formattedDate,
      icon
    });
  }

  checkAchievementUnlocks() {
    const score = this.getPlacementReadinessScore();
    const readinessAchievement = this.data.achievements.find(a => a.id === 'a7');
    if (readinessAchievement && !readinessAchievement.unlocked && score >= 80) {
      readinessAchievement.unlocked = true;
      readinessAchievement.unlockedAt = new Date().toISOString().split('T')[0];
      this.addHistoryLog('achievement', 'Unlocked Achievement "Interview Ready"!', '🚀');
    }
  }

  resetAllData() {
    this.data = JSON.parse(JSON.stringify(defaultState));
    this.saveState();
  }
}

window.appState = new StateStore();
