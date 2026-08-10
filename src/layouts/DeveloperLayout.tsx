import React, { Suspense, useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants';
import { Button } from '../components/ui/Button';
import { cn } from '../utils';
import { 
  Menu, X, GraduationCap, LayoutDashboard, Home, Info, BookOpen, 
  Briefcase, Heart, Image, FileText, Settings, Video, LogOut, ChevronRight, Bell
} from 'lucide-react';
import { FadeIn } from '../components/animations/FadeIn';
import { CommandPalette } from '../components/ui/CommandPalette';
import { NotificationDropdown } from '../components/ui/NotificationDropdown';

const NAV_LINKS = [
  { label: 'Dashboard', path: ROUTES.DEVELOPER.DASHBOARD, icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Homepage', path: ROUTES.DEVELOPER.CMS.HOMEPAGE, icon: <Home className="w-5 h-5" /> },
  { label: 'About', path: ROUTES.DEVELOPER.CMS.ABOUT, icon: <Info className="w-5 h-5" /> },
  { label: 'Courses', path: ROUTES.DEVELOPER.CMS.COURSES, icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Services', path: ROUTES.DEVELOPER.CMS.SERVICES, icon: <Briefcase className="w-5 h-5" /> },
  { label: 'Charity', path: ROUTES.DEVELOPER.CMS.CHARITY, icon: <Heart className="w-5 h-5" /> },
  { label: 'Gallery', path: ROUTES.DEVELOPER.CMS.GALLERY, icon: <Image className="w-5 h-5" /> },
  { label: 'Forms', path: ROUTES.DEVELOPER.CMS.FORMS, icon: <FileText className="w-5 h-5" /> },
  { label: 'Media', path: ROUTES.DEVELOPER.CMS.MEDIA, icon: <Video className="w-5 h-5" /> },
  { label: 'Notices', path: ROUTES.DEVELOPER.CMS.NOTICES, icon: <Bell className="w-5 h-5" /> },
  { label: 'Settings', path: ROUTES.DEVELOPER.SETTINGS, icon: <Settings className="w-5 h-5" /> },
];

export const DeveloperLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Derive breadcrumb from current path
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
          <Link to={ROUTES.DEVELOPER.DASHBOARD} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight text-text-primary group-hover:text-brand-primary transition-colors">
                Dev Panel
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
            <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center">
              D
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-text-primary font-semibold truncate">Developer</p>
              <p className="text-xs text-text-muted truncate">dev@mrinstitute.edu</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-error hover:text-error hover:bg-error/10 mt-2">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header & Overlay */}
      <div className="lg:hidden fixed top-0 w-full z-30 bg-white border-b border-border px-4 py-3 flex items-center justify-between">
        <Link to={ROUTES.DEVELOPER.DASHBOARD} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold text-text-primary">Dev Panel</h1>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-text-secondary hover:bg-surface rounded-md"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <FadeIn duration={0.2} className="lg:hidden fixed inset-0 z-20 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="w-64 bg-white h-full flex flex-col" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border mt-[60px]">
              <p className="text-sm font-medium text-text-secondary">Navigation</p>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);
                return (
                    <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive ? "bg-brand-primary/10 text-brand-primary" : "text-text-secondary"
                    )}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-border">
              <Button variant="ghost" className="w-full justify-start text-error">
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
            <Link to={ROUTES.DEVELOPER.DASHBOARD} className="text-text-muted hover:text-brand-primary transition-colors">
              Home
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
