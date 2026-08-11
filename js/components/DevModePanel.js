/* ==========================================================================
   DevModePanel.js - Developer Mode Inspector Panel (Ctrl+Shift+D)
   ========================================================================== */

export class DevModePanel {
  static init(appState) {
    let panel = document.getElementById('dev-mode-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'dev-mode-panel';
      panel.style.cssText = `
        position: fixed; bottom: 1rem; left: 1rem; width: 380px; max-height: 480px;
        background: rgba(17, 24, 39, 0.95); color: #10b981; border: 1px solid #374151;
        border-radius: 12px; font-family: monospace; font-size: 0.75rem; z-index: 99999;
        display: none; box-shadow: 0 10px 25px rgba(0,0,0,0.5); backdrop-filter: blur(12px);
        overflow: hidden; flex-direction: column;
      `;
      document.body.appendChild(panel);
    }

    DevModePanel.update(appState);
  }

  static update(appState) {
    const panel = document.getElementById('dev-mode-panel');
    if (!panel) return;

    const data = appState.data;
    const storageBytes = new Blob([JSON.stringify(data)]).size;
    const renderTime = window.lastRenderTime || '0.00';

    panel.innerHTML = `
      <div style="padding:0.75rem 1rem; background:#1f2937; color:#f9fafb; font-weight:700; display:flex; justify-content:space-between; align-items:center;">
        <span>🛠️ PlacementOS Developer Mode</span>
        <button onclick="document.getElementById('dev-mode-panel').style.display='none'" style="color:#9ca3af;">✕</button>
      </div>
      <div style="padding:1rem; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:0.75rem;">
        <div><strong>Storage Used:</strong> ${storageBytes} bytes (${(storageBytes/1024).toFixed(2)} KB)</div>
        <div><strong>Last Render Time:</strong> ${renderTime}ms</div>
        <div><strong>Undo Stack Depth:</strong> ${appState.undoRedoEngine ? appState.undoRedoEngine.past.length : 0}</div>
        <div><strong>Redo Stack Depth:</strong> ${appState.undoRedoEngine ? appState.undoRedoEngine.future.length : 0}</div>
        <div>
          <strong>Latest Activity Log:</strong>
          <div style="background:#111827; padding:0.5rem; border-radius:6px; margin-top:4px; max-height:120px; overflow-y:auto;">
            ${(data.history || []).slice(0, 5).map(h => `<div>• [${h.date}] ${h.title}</div>`).join('')}
          </div>
        </div>
        <div style="display:flex; gap:0.5rem; margin-top:0.5rem;">
          <button class="btn btn-sm btn-outline" style="color:#10b981; border-color:#374151;" onclick="console.log(window.appState.data); alert('State logged to Browser Console!');">Console Log State</button>
        </div>
      </div>
    `;
  }
}
