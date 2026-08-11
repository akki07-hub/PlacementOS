/* ==========================================================================
   ExportView.js - Export & Restore Center View
   ========================================================================== */

import { ExportService } from '../services/ExportService.js';
import { UIComponents } from '../components/UIComponents.js';

export class ExportView {
  static render(container, appState) {
    container.innerHTML = `
      <div class="grid-cols-2">
        <div class="card" style="text-align:center; padding:2rem;">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;" aria-hidden="true">📄</div>
          <h3>Download PDF Report</h3>
          <p style="color:var(--text-muted); margin-bottom:1.5rem; font-size:0.9rem;">Generate a clean printable Student Placement Readiness Report.</p>
          <button class="btn btn-primary" onclick="window.ExportService.printPDF()">Print / Save PDF</button>
        </div>

        <div class="card" style="text-align:center; padding:2rem;">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;" aria-hidden="true">📊</div>
          <h3>Export Excel / CSV</h3>
          <p style="color:var(--text-muted); margin-bottom:1.5rem; font-size:0.9rem;">Download spreadsheet of all your placement tasks & progress.</p>
          <button class="btn btn-secondary" onclick="window.ExportService.exportCSV(window.appState.data.tasks)">Download CSV</button>
        </div>

        <div class="card" style="text-align:center; padding:2rem;">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;" aria-hidden="true">💾</div>
          <h3>Backup Data</h3>
          <p style="color:var(--text-muted); margin-bottom:1.5rem; font-size:0.9rem;">Export complete JSON state snapshot for local backup.</p>
          <button class="btn btn-outline" onclick="window.ExportService.exportJSON(window.appState.data)">Export Backup JSON</button>
        </div>

        <div class="card" style="text-align:center; padding:2rem;">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;" aria-hidden="true">🔄</div>
          <h3>Restore Backup</h3>
          <p style="color:var(--text-muted); margin-bottom:1.5rem; font-size:0.9rem;">Restore your progress state from a previously saved JSON file.</p>
          <input type="file" id="restore-json-input" accept=".json" style="display:none;" onchange="window.ExportView.handleRestoreFile(this.files[0])">
          <button class="btn btn-outline" onclick="document.getElementById('restore-json-input').click()">Import Backup File</button>
        </div>
      </div>
    `;
  }

  static handleRestoreFile(file) {
    if (!file) return;
    ExportService.importJSON(
      file,
      (parsedData) => {
        window.appState.data = parsedData;
        window.appState.notify();
        UIComponents.showToast('Data restored successfully from backup!', 'success');
      },
      (errorMsg) => {
        UIComponents.showToast(`Restore Failed: ${errorMsg}`, 'danger');
      }
    );
  }
}

window.ExportService = ExportService;
window.ExportView = ExportView;
