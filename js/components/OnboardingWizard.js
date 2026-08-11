/* ==========================================================================
   OnboardingWizard.js - First-time User Onboarding Wizard
   ========================================================================== */

import { UIComponents } from './UIComponents.js';
import { Validators } from '../models/Validators.js';

export class OnboardingWizard {
  static show(appState) {
    let overlay = document.getElementById('onboarding-modal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'onboarding-modal';
      overlay.className = 'modal-overlay active';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-label', 'First Time Setup Onboarding');
      document.body.appendChild(overlay);
    } else {
      overlay.classList.add('active');
    }

    OnboardingWizard.renderStep(1, appState);
  }

  static renderStep(step, appState) {
    const overlay = document.getElementById('onboarding-modal');
    if (!overlay) return;

    if (step === 1) {
      overlay.innerHTML = `
        <div class="modal-content" style="max-width:540px; text-align:center; padding:2rem;">
          <div style="font-size:3.5rem; margin-bottom:1rem;">⚡</div>
          <h2 style="font-size:1.75rem; font-weight:800; margin-bottom:0.5rem;">Welcome to PlacementOS</h2>
          <p style="color:var(--text-muted); font-size:0.95rem; margin-bottom:2rem;">Your modern, intelligent productivity dashboard for tracking student career roadmaps and placement readiness.</p>
          
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <button class="btn btn-primary" style="width:100%; justify-content:center; padding:0.8rem;" onclick="window.OnboardingWizard.renderStep(2, window.appState)">
              Start Guided Setup →
            </button>
            <button class="btn btn-outline" style="width:100%; justify-content:center;" onclick="window.appState.loadDemoData(); window.OnboardingWizard.close();">
              Load Sample Demo Data
            </button>
          </div>
        </div>
      `;
    } else if (step === 2) {
      overlay.innerHTML = `
        <div class="modal-content" style="max-width:540px;">
          <div class="modal-header">
            <h3 style="font-size:1.2rem; font-weight:700;">Step 1: Create Profile</h3>
            <span class="nav-badge">Step 1 of 3</span>
          </div>
          <form id="onboard-profile-form" onsubmit="event.preventDefault(); window.OnboardingWizard.handleStep2Submit();">
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input type="text" id="onboard-name" class="form-control" placeholder="e.g. Alex Rivera" required>
                <div id="err-onboard-name" class="form-error-msg" style="color:var(--danger); font-size:0.75rem; display:none; margin-top:2px;"></div>
              </div>
              <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input type="email" id="onboard-email" class="form-control" placeholder="e.g. alex@university.edu" required>
                <div id="err-onboard-email" class="form-error-msg" style="color:var(--danger); font-size:0.75rem; display:none; margin-top:2px;"></div>
              </div>
              <div class="grid-cols-2">
                <div class="form-group">
                  <label class="form-label">College / Institute *</label>
                  <input type="text" id="onboard-college" class="form-control" placeholder="e.g. Inst of Tech" required>
                  <div id="err-onboard-college" class="form-error-msg" style="color:var(--danger); font-size:0.75rem; display:none; margin-top:2px;"></div>
                </div>
                <div class="form-group">
                  <label class="form-label">CGPA (0.0 - 10.0) *</label>
                  <input type="number" step="0.1" id="onboard-cgpa" class="form-control" placeholder="8.5" required>
                  <div id="err-onboard-cgpa" class="form-error-msg" style="color:var(--danger); font-size:0.75rem; display:none; margin-top:2px;"></div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">Next: Career Goals →</button>
            </div>
          </form>
        </div>
      `;
    } else if (step === 3) {
      const data = appState.data;
      overlay.innerHTML = `
        <div class="modal-content" style="max-width:620px;">
          <div class="modal-header">
            <h3 style="font-size:1.2rem; font-weight:700;">Step 2: Select Career Goal</h3>
            <span class="nav-badge">Step 2 of 3</span>
          </div>
          <div class="modal-body" style="max-height:420px; overflow-y:auto;">
            <div class="form-label" style="margin-bottom:0.75rem;">Choose Target Role:</div>
            <div class="grid-cols-2" style="gap:0.75rem; margin-bottom:1.5rem;">
              ${data.careerRoles.map((r, i) => `
                <div class="career-card ${i === 0 ? 'selected' : ''}" id="onboard-role-${r.id}" onclick="window.OnboardingWizard.selectRole('${r.title}', '${r.id}')" style="padding:1rem;">
                  <div style="font-size:1.5rem;">${r.icon}</div>
                  <div style="font-weight:700; font-size:0.9rem;">${r.title}</div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" onclick="window.OnboardingWizard.finishOnboarding()">Complete Setup & Generate Dashboard →</button>
          </div>
        </div>
      `;
    }
  }

  static selectRole(roleTitle, roleId) {
    window.tempOnboardRole = roleTitle;
    document.querySelectorAll('.career-card').forEach(c => c.classList.remove('selected'));
    const target = document.getElementById(`onboard-role-${roleId}`);
    if (target) target.classList.add('selected');
  }

  static handleStep2Submit() {
    const name = document.getElementById('onboard-name').value;
    const email = document.getElementById('onboard-email').value;
    const college = document.getElementById('onboard-college').value;
    const cgpa = document.getElementById('onboard-cgpa').value;

    const valResult = Validators.validateProfile({ name, email, college, cgpa });
    if (!valResult.isValid) {
      Object.keys(valResult.errors).forEach(key => {
        const errEl = document.getElementById(`err-onboard-${key}`);
        if (errEl) {
          errEl.textContent = valResult.errors[key];
          errEl.style.display = 'block';
        }
      });
      return;
    }

    window.tempOnboardProfile = { name, email, college, cgpa };
    OnboardingWizard.renderStep(3, window.appState);
  }

  static finishOnboarding() {
    const prof = window.tempOnboardProfile || { name: 'Student', email: 'student@edu.com', college: 'University', cgpa: '8.5' };
    const role = window.tempOnboardRole || 'Software Engineer';

    window.appState.completeOnboarding({
      ...prof,
      targetRole: role
    });

    OnboardingWizard.close();
    UIComponents.showToast('Onboarding completed! Welcome to PlacementOS.', 'success');
  }

  static close() {
    const overlay = document.getElementById('onboarding-modal');
    if (overlay) overlay.remove();
  }
}

window.OnboardingWizard = OnboardingWizard;
