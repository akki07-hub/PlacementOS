/* ==========================================================================
   Validators.js - Form & Data Validation Engine
   ========================================================================== */

export class Validators {
  static isEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  static isPhone(phone) {
    if (!phone) return true; // Optional field
    const re = /^\+?[0-9]{7,15}$/;
    return re.test(String(phone).replace(/[\s-]/g, ''));
  }

  static isValidCGPA(cgpa) {
    if (cgpa === undefined || cgpa === null || cgpa === '') return false;
    const val = parseFloat(cgpa);
    return !isNaN(val) && val >= 0.0 && val <= 10.0;
  }

  static isNotEmpty(str) {
    return str !== null && str !== undefined && String(str).trim().length > 0;
  }

  static isValidDate(dateStr) {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return !isNaN(d.getTime());
  }

  static isDuplicateTask(tasks, title, excludeId = null) {
    const cleanTitle = String(title).trim().toLowerCase();
    return tasks.some(t => t.id !== excludeId && t.title.trim().toLowerCase() === cleanTitle);
  }

  static isDuplicateMilestone(roadmap, milestoneTitle, excludeId = null) {
    const clean = String(milestoneTitle).trim().toLowerCase();
    return roadmap.some(cat => 
      cat.milestones.some(m => m.id !== excludeId && m.title.trim().toLowerCase() === clean)
    );
  }

  static validateProfile(profile) {
    const errors = {};
    if (!Validators.isNotEmpty(profile.name)) {
      errors.name = 'Full Name is required';
    }
    if (!Validators.isEmail(profile.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!Validators.isValidCGPA(profile.cgpa)) {
      errors.cgpa = 'CGPA must be a number between 0.0 and 10.0';
    }
    if (!Validators.isNotEmpty(profile.college)) {
      errors.college = 'College/Institution name is required';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static validateTask(task, existingTasks = [], editId = null) {
    const errors = {};
    if (!Validators.isNotEmpty(task.title)) {
      errors.title = 'Task title is required';
    } else if (Validators.isDuplicateTask(existingTasks, task.title, editId)) {
      errors.title = 'A task with this title already exists';
    }
    if (!Validators.isNotEmpty(task.category)) {
      errors.category = 'Category is required';
    }
    if (!Validators.isNotEmpty(task.priority)) {
      errors.priority = 'Priority is required';
    }
    if (task.deadline && !Validators.isValidDate(task.deadline)) {
      errors.deadline = 'Please enter a valid date';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}
