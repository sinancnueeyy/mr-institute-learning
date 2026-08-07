import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from './Badge';

// Temporary mock type, replace with real Notification type when integrated
interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: '1',
    title: 'New Admission Application',
    message: 'John Doe has submitted an application for B.Sc Computer Science.',
    type: 'info',
    isRead: false,
    createdAt: new Date().toISOString(),
    link: '/office/applications'
  },
  {
    id: '2',
    title: 'System Update',
    message: 'The system will undergo maintenance at 2 AM tonight.',
    type: 'alert',
    isRead: false,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-secondary hover:text-primary hover:bg-surface rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label={`Notifications (${unreadCount} unread)`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full animate-pulse ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-border overflow-hidden z-50 animate-fade-in origin-top-right"
          role="menu"
          aria-orientation="vertical"
          aria-label="Notifications"
        >
          <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4">
                  {unreadCount} new
                </Badge>
              )}
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={markAllAsRead}
                title="Mark all as read"
                className="p-1 text-text-muted hover:text-primary transition-colors rounded"
              >
                <Check className="w-4 h-4" />
              </button>
              <button 
                onClick={clearAll}
                title="Clear all"
                className="p-1 text-text-muted hover:text-error transition-colors rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-text-secondary">
                <Bell className="w-8 h-8 mx-auto mb-3 text-text-muted/50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 transition-colors hover:bg-surface cursor-pointer ${notification.isRead ? 'opacity-70' : 'bg-primary/5'}`}
                    onClick={() => markAsRead(notification.id)}
                    role="menuitem"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') markAsRead(notification.id); }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-semibold text-text-primary pr-4">
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                      {notification.link && (
                        <Link 
                          to={notification.link}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Details <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-2 border-t border-border bg-surface/50 text-center">
            <Link 
              to="/office/notifications" 
              className="text-sm font-medium text-primary hover:underline"
              onClick={() => setIsOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
