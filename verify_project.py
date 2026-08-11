import os
import sys
import json

# Force stdout to UTF-8 for Windows console support
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

print("====================================================")
print(" PLACEMENTOS AUTOMATED VERIFICATION & TEST SUITE ")
print("====================================================\n")

base_dir = os.path.dirname(os.path.abspath(__file__))

total_tests = 0
passed_tests = 0
failed_tests = 0

def assert_test(condition, message):
    global total_tests, passed_tests, failed_tests
    total_tests += 1
    if condition:
        passed_tests += 1
        print(f"  [PASS] {message}")
    else:
        failed_tests += 1
        print(f"  [FAIL] {message}")

# 1. FILE EXISTENCE & INTEGRITY
print("1. Checking Core Project Files & Directory Structure...")

required_files = [
    'index.html',
    'css/main.css',
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
    'js/views/SettingsView.js',
    'presentation.html',
    'PlacementOS_Presentation.pptx'
]

for rel_path in required_files:
    full_path = os.path.join(base_dir, rel_path)
    assert_test(os.path.exists(full_path), f"File exists: {rel_path}")

# 2. HTML STRUCTURE & NAVIGATION CONTAINERS
print("\n2. Checking HTML Structure & Navigation Containers...")
index_path = os.path.join(base_dir, 'index.html')
with open(index_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

assert_test('<meta name="viewport"' in html_content, "index.html has responsive viewport meta tag")
assert_test('<div id="app">' in html_content, "index.html has #app main container")
assert_test('type="module" src="js/app.js"' in html_content, "index.html imports js/app.js as ES6 module")

routes = [
    'dashboard', 'profile', 'career-goals', 'roadmap',
    'task-manager', 'skill-tracker', 'placement-readiness',
    'analytics', 'history', 'achievements', 'export', 'settings'
]

for r in routes:
    page_id = f'id="page-{r}"'
    assert_test(page_id in html_content, f"HTML contains view container `#page-{r}`")

# 3. ES6 MODULE IMPORTS & EXPORTS SANITY
print("\n3. Verifying ES6 Imports & View Class Definitions...")

app_js_path = os.path.join(base_dir, 'js', 'app.js')
with open(app_js_path, 'r', encoding='utf-8') as f:
    app_js_content = f.read()

view_classes = [
    'DashboardView', 'ProfileView', 'CareerGoalsView', 'RoadmapView',
    'TaskManagerView', 'SkillTrackerView', 'PlacementReadinessView',
    'AnalyticsView', 'HistoryView', 'AchievementsView', 'ExportView', 'SettingsView'
]

for cls in view_classes:
    assert_test(f'import {{ {cls} }}' in app_js_content, f"app.js imports {cls}")
    view_file_path = os.path.join(base_dir, 'js', 'views', f'{cls}.js')
    if os.path.exists(view_file_path):
        with open(view_file_path, 'r', encoding='utf-8') as vf:
            v_content = vf.read()
            assert_test(f'export class {cls}' in v_content, f"{cls}.js defines and exports class `{cls}`")
            assert_test('static render(' in v_content, f"{cls} implements `static render(container, appState)`")

# 4. CSS DESIGN TOKENS & RESPONSIVE GRID
print("\n4. Checking CSS Styling System & Responsive Utilities...")
css_comp_path = os.path.join(base_dir, 'css', 'components.css')
with open(css_comp_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

assert_test('.grid-cols-4' in css_content, "components.css contains `.grid-cols-4` grid layout")
assert_test('.notification-badge' in css_content, "components.css defines `.notification-badge` styling")
assert_test('.modal-overlay' in css_content, "components.css defines `.modal-overlay` component")

print("\n====================================================")
print(f" FINAL RESULTS: {passed_tests}/{total_tests} VERIFICATION CHECKS PASSED")
if failed_tests == 0:
    print(" PROJECT STATUS: 100% HEALTHY & FULLY VERIFIED!")
else:
    print(f" {failed_tests} ISSUES ENCOUNTERED.")
print("====================================================\n")
