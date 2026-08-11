/* ==========================================================================
   ProfileView.js - Dynamic Profile Management View
   ========================================================================== */

import { UIComponents } from '../components/UIComponents.js';
import { Validators } from '../models/Validators.js';

export class ProfileView {
  static render(container, appState) {
    const u = appState.data.user;

    if (!u || !u.onboardingCompleted) {
      container.innerHTML = UIComponents.renderEmptyState(
        'No Profile Found',
        'Please complete the setup onboarding to create your placement profile.',
        `<button class="btn btn-primary" onclick="window.OnboardingWizard.show(window.appState)">Start Setup</button>`
      );
      return;
    }

    container.innerHTML = `
      <div class="profile-header-card">
        <div class="profile-avatar-lg">${u.avatar || 'ST'}</div>
        <div class="profile-meta">
          <h2>${u.name}</h2>
          <p>${u.college} • Class of ${u.gradYear}</p>
          <div class="profile-tags">
            <span class="tag-pill">Target: ${u.targetRole}</span>
            <span class="tag-pill">CGPA: ${u.cgpa}</span>
            ${(u.targetCompanies || []).map(c => `<span class="tag-pill">${c}</span>`).join('')}
          </div>
        </div>
      </div>

      <div class="grid-cols-2">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Edit Profile Information</div>
          </div>
          <form id="profile-edit-form">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" id="prof-name" class="form-control" value="${u.name || ''}" required>
              <div id="err-prof-name" style="color:var(--danger); font-size:0.75rem; display:none; margin-top:2px;"></div>
            </div>
            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <input type="email" id="prof-email" class="form-control" value="${u.email || ''}" required>
              <div id="err-prof-email" style="color:var(--danger); font-size:0.75rem; display:none; margin-top:2px;"></div>
            </div>
            <div class="form-group">
              <label class="form-label">College / Institution *</label>
              <input type="text" id="prof-college" class="form-control" value="${u.college || ''}" required>
              <div id="err-prof-college" style="color:var(--danger); font-size:0.75rem; display:none; margin-top:2px;"></div>
            </div>
            <div class="grid-cols-2">
              <div class="form-group">
                <label class="form-label">Graduation Year</label>
                <input type="text" id="prof-grad" class="form-control" value="${u.gradYear || '2027'}">
              </div>
              <div class="form-group">
                <label class="form-label">CGPA (0.0 - 10.0) *</label>
                <input type="number" step="0.1" id="prof-cgpa" class="form-control" value="${u.cgpa || ''}" required>
                <div id="err-prof-cgpa" style="color:var(--danger); font-size:0.75rem; display:none; margin-top:2px;"></div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Bio / Summary</label>
              <textarea id="prof-bio" class="form-control" rows="3" placeholder="Short bio...">${u.bio || ''}</textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="margin-top:0.5rem;">Save Profile Changes</button>
          </form>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">Placement Target Overview</div>
          </div>
          <div style="display:flex; flex-direction:column; gap:1.25rem;">
            <div>
              <div style="font-weight:600; font-size:0.85rem; color:var(--text-muted);">Target Career Role</div>
              <div style="font-size:1.1rem; font-weight:700;">${u.targetRole}</div>
            </div>
            <div>
              <div style="font-weight:600; font-size:0.85rem; color:var(--text-muted);">Selected Target Companies</div>
              <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.35rem;">
                ${(u.targetCompanies || []).map(c => `<span class="nav-badge" style="background:var(--primary-100); color:var(--primary-600); font-weight:700;">${c}</span>`).join('')}
              </div>
            </div>
            <button class="btn btn-outline" style="margin-top:1rem;" onclick="window.location.hash='#career-goals'">Change Goals & Target Companies →</button>
          </div>
        </div>
      </div>
    `;

    // Event binding
    const form = document.getElementById('profile-edit-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('prof-name').value;
        const email = document.getElementById('prof-email').value;
        const college = document.getElementById('prof-college').value;
        const gradYear = document.getElementById('prof-grad').value;
        const cgpa = document.getElementById('prof-cgpa').value;
        const bio = document.getElementById('prof-bio').value;

        const valResult = Validators.validateProfile({ name, email, college, cgpa });
        if (!valResult.isValid) {
          Object.keys(valResult.errors).forEach(key => {
            const errEl = document.getElementById(`err-prof-${key}`);
            if (errEl) {
              errEl.textContent = valResult.errors[key];
              errEl.style.display = 'block';
            }
          });
          return;
        }

        appState.data.user = {
          ...appState.data.user,
          name, email, college, gradYear, cgpa, bio,
          avatar: name.split(' ').map(n=>n[0]).join('').toUpperCase()
        };
        appState.notify();
        UIComponents.showToast('Profile updated successfully!', 'success');
      });
    }
  }
}
