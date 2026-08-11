/* ==========================================================================
   PerformanceUtils.js - Debounce, Throttle, Targeted DOM Update & Perf Monitor
   ========================================================================== */

export class PerformanceUtils {
  static debounce(fn, delay = 250) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  static throttle(fn, limit = 200) {
    let inThrottle = false;
    return function (...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Measure execution time of a rendering operation
   */
  static measureTime(name, fn) {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    if (window.devModeActive) {
      console.log(`[PerfMonitor] ${name} executed in ${duration.toFixed(2)}ms`);
      window.lastRenderTime = duration.toFixed(2);
    }
    return result;
  }

  /**
   * Update text content of a targeted DOM node only if changed
   */
  static updateTextIfChanged(element, newText) {
    if (element && element.textContent !== newText) {
      element.textContent = newText;
    }
  }

  /**
   * Update innerHTML of a targeted DOM node only if changed
   */
  static updateHTMLIfChanged(element, newHTML) {
    if (element && element.innerHTML !== newHTML) {
      element.innerHTML = newHTML;
    }
  }
}
