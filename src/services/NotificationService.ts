/**
 * Browser Notification Service
 * Handles native Web Notifications API for desktop/mobile notifications.
 */

export const NotificationService = {
  /**
   * Request browser notification permission from user.
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('This browser does not support desktop notifications.');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  },

  /**
   * Display a native system notification.
   */
  showNotification(title: string, options?: NotificationOptions): Notification | null {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return null;
    }

    if (Notification.permission === 'granted') {
      try {
        return new Notification(title, {
          icon: '/pwa-192x192.png',
          badge: '/pwa-64x64.png',
          ...options
        });
      } catch (error) {
        console.error('Failed to show native notification:', error);
        return null;
      }
    }

    return null;
  }
};
