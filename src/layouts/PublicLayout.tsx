import React, { Suspense, useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { cn } from '../utils';
import { FadeIn } from '../components/animations/FadeIn';
import { FloatingEnquiryButton } from '../components/growth/FloatingEnquiryButton';
import { settingsRepository } from '../repositories/cms';
import { type SiteSettings } from '../types/cms';

const NAV_LINKS = [
  { label: 'Home', path: ROUTES.PUBLIC.HOME },
  { label: 'About', path: ROUTES.PUBLIC.ABOUT },
  { label: 'Courses', path: ROUTES.PUBLIC.COURSES },
  { label: 'Services', path: ROUTES.PUBLIC.SERVICES },
  { label: 'Charity', path: ROUTES.PUBLIC.CHARITY },
  { label: 'Gallery', path: ROUTES.PUBLIC.GALLERY },
  { label: 'Contact', path: ROUTES.PUBLIC.CONTACT },
];

export const PublicLayout: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsRepository.getById('global');
        if (res.data) setSettings(res.data);
      } catch (err) {
        // Ignore settings fetch errors gracefully
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Top Info Bar (Optional) */}
      <div className="bg-brand-primary text-text-on-primary text-sm py-2 hidden md:block">
        <Container>
          <div className="flex justify-between items-center">
            <div className="flex gap-6">
              <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 98765 43210</span>
              <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@mrinstitute.edu</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Admissions Open 2026 | Enroll Today</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navigation */}
      <header 
        className={cn(
          "sticky top-0 z-50 transition-all duration-300 border-b",
          isScrolled ? "bg-surface/95 backdrop-blur-md border-border shadow-sm py-4" : "bg-surface border-transparent py-6"
        )}
      >
        <Container>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={ROUTES.PUBLIC.HOME} className="flex items-center gap-3 group">
              <img 
                src={settings?.logoUrl || '/logo.png'} 
                alt="MR Institute Logo" 
                className="h-12 w-auto object-contain" 
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-[15px] font-medium transition-colors relative group py-2",
                    location.pathname === link.path ? "text-brand-primary" : "text-text-secondary hover:text-brand-primary"
                  )}
                >
                  {link.label}
                  <span className={cn(
                    "absolute -bottom-1 left-0 w-full h-[2px] bg-brand-secondary transform origin-left transition-transform duration-300",
                    location.pathname === link.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <Button asChild size="lg" className="rounded-md px-8">
                <Link to={ROUTES.PUBLIC.CONTACT}>Apply Now</Link>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-text-primary hover:bg-surface rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <FadeIn duration={0.2} className="md:hidden fixed inset-0 top-[73px] z-40 bg-surface border-t border-border flex flex-col h-[calc(100vh-73px)] overflow-y-auto">
          <nav className="flex flex-col p-6 gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-3 rounded-lg text-lg font-semibold transition-colors",
                  location.pathname === link.path ? "bg-brand-primary/10 text-brand-primary" : "text-text-primary hover:bg-surface"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="p-6 mt-auto border-t border-border flex flex-col gap-4">
            <Button size="lg" className="w-full" asChild>
              <Link to={ROUTES.PUBLIC.CONTACT}>Apply Now</Link>
            </Button>
          </div>
        </FadeIn>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>

      {/* Premium Footer */}
      <footer className="dark bg-surface text-text-primary border-t border-border pt-16 pb-8">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <Link to={ROUTES.PUBLIC.HOME} className="flex items-center gap-3 mb-6 group">
                <img 
                  src={settings?.logoUrl || '/logo.png'} 
                  alt="MR Institute Logo" 
                  className="h-10 w-auto object-contain" 
                />
              </Link>
              <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-xs">
                Empowering students with quality education, modern facilities, and expert guidance to achieve their academic and career goals.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-text-on-dark mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
              <ul className="space-y-4">
                <li><Link to={ROUTES.PUBLIC.ABOUT} className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors">About Us</Link></li>
                <li><Link to={ROUTES.PUBLIC.COURSES} className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors">Our Courses</Link></li>
                <li><Link to={ROUTES.PUBLIC.CHARITY} className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors">Charity & Scholarships</Link></li>
                <li><Link to={ROUTES.PUBLIC.GALLERY} className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors">Campus Gallery</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-text-on-dark mb-6 uppercase tracking-wider text-sm">Services</h3>
              <ul className="space-y-4">
                <li><Link to={ROUTES.PUBLIC.SERVICES} className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors">Academic Tuition</Link></li>
                <li><Link to={ROUTES.PUBLIC.SERVICES} className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors">Career Guidance</Link></li>
                <li><Link to={ROUTES.PUBLIC.SERVICES} className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors">Direct Examinations</Link></li>
                <li><Link to={ROUTES.PUBLIC.SERVICES} className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors">Skill Development</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-text-on-dark mb-6 uppercase tracking-wider text-sm">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                  <MapPin className="w-5 h-5 text-brand-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-text-secondary">123 Education Hub, Main Street, City Name, State 12345</span>
                </li>
                <li className="flex items-center gap-3 group">
                  <Phone className="w-5 h-5 text-brand-primary shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-text-secondary">+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-3 group">
                  <Mail className="w-5 h-5 text-brand-primary shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-text-secondary">info@mrinstitute.edu</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-text-muted font-medium">
              © {new Date().getFullYear()} MR Institute of Learning. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="#" className="text-sm font-medium text-text-muted hover:text-brand-primary transition-colors">Privacy Policy</Link>
              <Link to="#" className="text-sm font-medium text-text-muted hover:text-brand-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </Container>
      </footer>
      <FloatingEnquiryButton />
    </div>
  );
};
