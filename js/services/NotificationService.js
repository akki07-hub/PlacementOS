/* ==========================================================================
   NotificationService.js - Notification Center Engine
   ========================================================================== */

export class NotificationService {
  static getUnreadCount(notifications = []) {
    return notifications.filter(n => !n.read).length;
  }

  static addNotification(state, title, text, icon = '⚡') {
    if (!state.notifications) state.notifications = [];
    const newNotif = {
      id: 'notif_' + Date.now(),
      title,
      text,
      time: 'Just now',
      read: false,
      archived: false,
      icon,
      timestamp: new Date().toISOString()
    };
    state.notifications.unshift(newNotif);
    return newNotif;
  }

  static markAsRead(state, notifId) {
    if (!state.notifications) return;
    const n = state.notifications.find(item => item.id === notifId);
    if (n) n.read = true;
  }

  static markAllAsRead(state) {
    if (!state.notifications) return;
    state.notifications.forEach(n => (n.read = true));
  }

  static archiveNotification(state, notifId) {
    if (!state.notifications) return;
    const n = state.notifications.find(item => item.id === notifId);
    if (n) n.archived = true;
  }
}
