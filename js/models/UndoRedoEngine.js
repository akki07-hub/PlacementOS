/* ==========================================================================
   UndoRedoEngine.js - State History Snapshot Manager (Undo / Redo)
   ========================================================================== */

export class UndoRedoEngine {
  constructor(maxSize = 20) {
    this.past = [];
    this.future = [];
    this.maxSize = maxSize;
  }

  recordSnapshot(currentState) {
    const snapshot = JSON.stringify(currentState);
    // Avoid duplicate identical consecutive snapshots
    if (this.past.length > 0 && this.past[this.past.length - 1] === snapshot) {
      return;
    }
    this.past.push(snapshot);
    if (this.past.length > this.maxSize) {
      this.past.shift();
    }
    this.future = []; // Clear redo stack on new action
  }

  undo(currentState) {
    if (this.past.length === 0) return null;
    this.future.push(JSON.stringify(currentState));
    const previousSnapshot = this.past.pop();
    return JSON.parse(previousSnapshot);
  }

  redo(currentState) {
    if (this.future.length === 0) return null;
    this.past.push(JSON.stringify(currentState));
    const nextSnapshot = this.future.pop();
    return JSON.parse(nextSnapshot);
  }

  canUndo() {
    return this.past.length > 0;
  }

  canRedo() {
    return this.future.length > 0;
  }
}
