/* ==========================================================================
   SecurityUtils.js - XSS Sanitization & Security Helper
   ========================================================================== */

export class SecurityUtils {
  /**
   * Escape unsafe HTML characters in user-provided input strings.
   * Prevents Cross-Site Scripting (XSS) attacks.
   */
  static escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Sanitize an object recursively, escaping all string properties.
   */
  static sanitizeObject(obj) {
    if (typeof obj === 'string') return SecurityUtils.escapeHTML(obj);
    if (Array.isArray(obj)) return obj.map(SecurityUtils.sanitizeObject);
    if (obj !== null && typeof obj === 'object') {
      const sanitized = {};
      for (const key of Object.keys(obj)) {
        sanitized[key] = SecurityUtils.sanitizeObject(obj[key]);
      }
      return sanitized;
    }
    return obj;
  }
}
