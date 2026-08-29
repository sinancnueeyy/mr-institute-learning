import React, { Suspense, useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants';
import { Button } from '../components/ui/Button';
import { cn } from '../utils';
import { 
  Menu, X, GraduationCap, LayoutDashboard, Users, FileText, 
  Award, Heart, MessageSquare, Bell, BarChart2, LogOut, ChevronRight
} from 'lucide-react';
import { FadeIn } from '../components/animations/FadeIn';
import { CommandPalette } from '../components/ui/CommandPalette';
import { NotificationDropdown } from '../components/ui/NotificationDropdown';
import { useAuth } from '../contexts/AuthContext';

const NAV_LINKS = [
  { label: 'Dashboard', path: ROUTES.OFFICE.DASHBOARD, icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Admissions', path: ROUTES.OFFICE.APPLICATIONS, icon: <FileText className="w-5 h-5" /> },
  { label: 'Students', path: ROUTES.OFFICE.STUDENTS, icon: <Users className="w-5 h-5" /> },
  { label: 'Scholarships', path: ROUTES.OFFICE.SCHOLARSHIPS, icon: <Award className="w-5 h-5" /> },
  { label: 'Charity', path: ROUTES.OFFICE.CHARITY, icon: <Heart className="w-5 h-5" /> },
  { label: 'Enquiries', path: ROUTES.OFFICE.ENQUIRIES, icon: <MessageSquare className="w-5 h-5" /> },
  { label: 'Notifications', path: ROUTES.OFFICE.NOTIFICATIONS, icon: <Bell className="w-5 h-5" /> },
  { label: 'Reports', path: ROUTES.OFFICE.REPORTS, icon: <BarChart2 className="w-5 h-5" /> },
];

export const OfficeLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { label, url };
  });

  return (
    <div className="flex min-h-screen bg-surface">
      <CommandPalette />
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-border fixed h-full z-20">
        <div className="p-6 border-b border-border">
          <Link to={ROUTES.OFFICE.DASHBOARD} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight text-text-primary group-hover:text-brand-primary transition-colors">
                Office Portal
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-text-secondary font-semibold">MR Institute</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 ml-3">Menu</div>
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-brand-primary/10 text-brand-primary" 
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-secondary">
            <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-text-primary">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'O'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-text-primary font-semibold truncate">{user?.displayName || 'Office Admin'}</p>
              <p className="text-xs text-text-muted truncate">{user?.email || 'office@mrinstitute.edu'}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={logout}
            className="w-full justify-start text-error hover:text-error hover:bg-error/10 mt-2"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header & Overlay */}
      <div className="lg:hidden fixed top-0 w-full z-30 bg-white border-b border-border px-4 py-3 flex items-center justify-between">
        <Link to={ROUTES.OFFICE.DASHBOARD} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-base text-text-primary">MR Institute</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-text-secondary hover:text-text-primary focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <FadeIn className="lg:hidden fixed inset-0 z-20 bg-black/50 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-border flex flex-col pt-16 z-30">
            <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-brand-primary text-white font-semibold'
                        : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                    )}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-border">
              <Button variant="ghost" onClick={logout} className="w-full justify-start text-error">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
        </FadeIn>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen pt-[60px] lg:pt-0">
        
        {/* Header / Breadcrumbs */}
        <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between sticky top-[60px] lg:top-0 z-10">
          <div className="flex items-center text-sm">
            <Link to={ROUTES.OFFICE.DASHBOARD} className="text-text-muted hover:text-brand-primary transition-colors">
              Office
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.url}>
                <ChevronRight className="w-4 h-4 mx-1 text-text-muted" />
                <span className={cn(
                  index === breadcrumbs.length - 1 ? "text-text-primary font-semibold" : "text-text-muted"
                )}>
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center gap-3">
             <NotificationDropdown />
             <Button variant="outline" size="sm" asChild>
                <Link to={ROUTES.PUBLIC.HOME} target="_blank">View Site</Link>
             </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Suspense fallback={
            <div className="h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};
