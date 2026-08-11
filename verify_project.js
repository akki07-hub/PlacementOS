/* ==========================================================================
   verify_project.js - Automated Verification & Test Suite for PlacementOS
   ========================================================================== */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('====================================================');
console.log(' 🚀 PLACEMENTOS AUTOMATED VERIFICATION & TEST SUITE ');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

// 1. FILE EXISTENCE & INTEGRITY CHECKS
console.log('🔍 1. Checking Core Project Files & Structure...');

const requiredFiles = [
  'index.html',
  'css/index.css',
  'css/components.css',
  'css/pages.css',
  'js/app.js',
  'js/models/StateStore.js',
  'js/models/StorageService.js',
  'js/models/ReadinessEngine.js',
  'js/models/RecommendationEngine.js',
  'js/models/Validators.js',
  'js/components/UIComponents.js',
  'js/components/OnboardingWizard.js',
  'js/components/ChartEngine.js',
  'js/services/ExportService.js',
  'js/views/DashboardView.js',
  'js/views/ProfileView.js',
  'js/views/CareerGoalsView.js',
  'js/views/RoadmapView.js',
  'js/views/TaskManagerView.js',
  'js/views/SkillTrackerView.js',
  'js/views/PlacementReadinessView.js',
  'js/views/AnalyticsView.js',
  'js/views/HistoryView.js',
  'js/views/AchievementsView.js',
  'js/views/ExportView.js',
  'js/views/SettingsView.js'
];

requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  assert(fs.existsSync(fullPath), `File exists: ${file}`);
});

// 2. IMPORT & DATA ENGINE TESTS
console.log('\n🧠 2. Testing Data Engines & Business Logic...');

async function runLogicTests() {
  try {
    const { ReadinessEngine } = await import('./js/models/ReadinessEngine.js');
    const { RecommendationEngine } = await import('./js/models/RecommendationEngine.js');
    const { Validators } = await import('./js/models/Validators.js');
    const { StorageService } = await import('./js/models/StorageService.js');

    // Test Readiness Engine Calculation
    const mockTasks = [
      { id: '1', category: 'DSA', status: 'completed' },
      { id: '2', category: 'Core CS', status: 'completed' },
      { id: '3', category: 'Web Dev', status: 'pending' },
    ];
    const mockSkills = [
      { id: '1', level: 'Advanced' },
      { id: '2', level: 'Intermediate' }
    ];
    const mockUser = { name: 'Test Student', cgpa: 8.5, targetRole: 'SDE-1' };

    const scoreData = ReadinessEngine.calculateScore(mockTasks, mockSkills, mockUser);
    assert(typeof scoreData.overall === 'number', 'Readiness score returns a valid number');
    assert(scoreData.overall >= 0 && scoreData.overall <= 100, `Score is within 0-100 range (Got: ${scoreData.overall})`);
    assert(scoreData.breakdown !== undefined, 'Score breakdown metrics generated');

    // Test Recommendation Engine
    const recs = RecommendationEngine.getRecommendations({ tasks: mockTasks, skills: mockSkills, user: mockUser });
    assert(Array.isArray(recs), 'Recommendations engine returns an array');
    assert(recs.length > 0, `Generated ${recs.length} actionable recommendations`);

    // Test Validators
    assert(Validators.isEmail('student@college.edu') === true, 'Email validator accepts valid email');
    assert(Validators.isEmail('invalid-email') === false, 'Email validator rejects invalid email');
    assert(Validators.isValidCGPA(8.7) === true, 'CGPA validator accepts 8.7');
    assert(Validators.isValidCGPA(11.5) === false, 'CGPA validator rejects 11.5');
    assert(Validators.isValidCGPA(-1.0) === false, 'CGPA validator rejects -1.0');

    // Test Storage Schema Validation
    const validState = StorageService.getInitialState();
    assert(StorageService.validateBackupJSON(validState) === true, 'Initial state satisfies backup schema validation');
    assert(StorageService.validateBackupJSON({ foo: 'bar' }) === false, 'Backup validator rejects malformed state');

  } catch (err) {
    console.error('Logic test error:', err);
    assert(false, `Logic test execution error: ${err.message}`);
  }
}

// 3. VIEW EXPORT TESTS
console.log('\n🖼️ 3. Validating View Renderers & Component Exports...');

async function runViewTests() {
  const views = [
    { name: 'DashboardView', file: './js/views/DashboardView.js' },
    { name: 'ProfileView', file: './js/views/ProfileView.js' },
    { name: 'CareerGoalsView', file: './js/views/CareerGoalsView.js' },
    { name: 'RoadmapView', file: './js/views/RoadmapView.js' },
    { name: 'TaskManagerView', file: './js/views/TaskManagerView.js' },
    { name: 'SkillTrackerView', file: './js/views/SkillTrackerView.js' },
    { name: 'PlacementReadinessView', file: './js/views/PlacementReadinessView.js' },
    { name: 'AnalyticsView', file: './js/views/AnalyticsView.js' },
    { name: 'HistoryView', file: './js/views/HistoryView.js' },
    { name: 'AchievementsView', file: './js/views/AchievementsView.js' },
    { name: 'ExportView', file: './js/views/ExportView.js' },
    { name: 'SettingsView', file: './js/views/SettingsView.js' }
  ];

  for (const v of views) {
    try {
      const mod = await import(v.file);
      assert(mod[v.name] !== undefined, `Module exports class: ${v.name}`);
      assert(typeof mod[v.name].render === 'function', `Class has static render method: ${v.name}`);
    } catch (err) {
      assert(false, `Failed to load view module ${v.name}: ${err.message}`);
    }
  }
}

// RUN ALL TESTS
(async () => {
  await runLogicTests();
  await runViewTests();

  console.log('\n====================================================');
  console.log(` 📊 VERIFICATION RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
  if (failedTests === 0) {
    console.log(' ✨ ALL VERIFICATION CHECKS PASSED PERFECTLY!');
  } else {
    console.log(` ⚠️ ${failedTests} CHECKS FAILED.`);
  }
  console.log('====================================================\n');
})();
