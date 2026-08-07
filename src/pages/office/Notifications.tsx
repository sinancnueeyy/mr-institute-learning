import { useState, useEffect } from 'react';
import { FadeIn } from '../../components/animations/FadeIn';
import { Button } from '../../components/ui/Button';
import { notificationsRepository } from '../../repositories/operations';
import type { Notification } from '../../types/operations';
import { Bell, CheckCircle2, Info, AlertTriangle, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationsRepository.getAll();
      // Sort by newest first
      const sorted = (res.data || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNotifications(sorted);
    } catch (error) {
      console.error("Error fetching notifications", error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationsRepository.update(id, { isRead: true });
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) return;
    
    try {
      await Promise.all(unread.map(n => notificationsRepository.update(n.id, { isRead: true })));
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error(error);
      toast.error('Failed to mark all as read');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-5 h-5 text-error" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'info':
      default: return <Info className="w-5 h-5 text-info" />;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <FadeIn className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            System Notifications
            {unreadCount > 0 && (
              <span className="bg-error text-white text-xs px-2 py-1 rounded-full font-bold">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-text-secondary">View alerts and updates from the system.</p>
        </div>
        <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
          <Check className="w-4 h-4 mr-2" /> Mark all as read
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {notifications.length > 0 ? (
          <div className="divide-y divide-border">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={cn(
                  "p-4 sm:p-6 transition-colors hover:bg-surface flex items-start gap-4",
                  !notification.isRead ? "bg-indigo-50/30" : ""
                )}
              >
                <div className="shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <h3 className={cn("font-bold text-base", !notification.isRead ? "text-text-primary" : "text-text-secondary")}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className={cn("text-sm", !notification.isRead ? "text-text-secondary" : "text-text-muted")}>
                    {notification.message}
                  </p>
                </div>
                
                {!notification.isRead && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => markAsRead(notification.id)}
                    className="shrink-0 text-indigo-600 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity"
                  >
                    Mark read
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-text-muted">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No notifications</p>
            <p className="text-sm">You are all caught up!</p>
          </div>
        )}
      </div>
    </FadeIn>
  );
}
