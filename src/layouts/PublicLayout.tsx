import React, { Suspense, useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Menu, X, GraduationCap, Phone, Mail, MapPin } from 'lucide-react';
import { cn } from '../utils';
import { FadeIn } from '../components/animations/FadeIn';
import { FloatingEnquiryButton } from '../components/growth/FloatingEnquiryButton';

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
  const location = useLocation();

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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Info Bar (Optional) */}
      <div className="bg-primary text-primary-foreground text-sm py-2 hidden md:block">
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
          isScrolled ? "bg-white/90 backdrop-blur-md border-border shadow-sm py-3" : "bg-white border-transparent py-5"
        )}
      >
        <Container>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={ROUTES.PUBLIC.HOME} className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-tight text-text-primary group-hover:text-primary transition-colors">
                  MR Institute
                </h1>
                <p className="text-[10px] uppercase tracking-wider text-text-secondary font-semibold">of Learning</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-sm font-semibold transition-colors hover:text-primary relative group",
                    location.pathname === link.path ? "text-primary" : "text-text-secondary"
                  )}
                >
                  {link.label}
                  <span className={cn(
                    "absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full transform origin-left transition-transform duration-300",
                    location.pathname === link.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to={ROUTES.AUTH.LOGIN}>Staff Login</Link>
              </Button>
              <Button asChild>
                <Link to={ROUTES.PUBLIC.CONTACT}>Apply Now</Link>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-text-primary hover:bg-surface rounded-lg transition-colors"
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
        <FadeIn duration={0.2} className="md:hidden fixed inset-0 top-[73px] z-40 bg-white border-t border-border flex flex-col h-[calc(100vh-73px)] overflow-y-auto">
          <nav className="flex flex-col p-6 gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-3 rounded-lg text-lg font-semibold transition-colors",
                  location.pathname === link.path ? "bg-primary/10 text-primary" : "text-text-primary hover:bg-surface"
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
            <Button size="lg" variant="outline" className="w-full" asChild>
              <Link to={ROUTES.AUTH.LOGIN}>Staff Login</Link>
            </Button>
          </div>
        </FadeIn>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>

      {/* Premium Footer */}
      <footer className="bg-surface border-t border-border pt-16 pb-8">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <Link to={ROUTES.PUBLIC.HOME} className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-tight text-text-primary">MR Institute</h2>
                  <p className="text-[9px] uppercase tracking-wider text-text-secondary font-semibold">of Learning</p>
                </div>
              </Link>
              <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-xs">
                Empowering students with quality education, modern facilities, and expert guidance to achieve their academic and career goals.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-text-primary mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li><Link to={ROUTES.PUBLIC.ABOUT} className="text-sm text-text-secondary hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to={ROUTES.PUBLIC.COURSES} className="text-sm text-text-secondary hover:text-primary transition-colors">Our Courses</Link></li>
                <li><Link to={ROUTES.PUBLIC.CHARITY} className="text-sm text-text-secondary hover:text-primary transition-colors">Charity & Scholarships</Link></li>
                <li><Link to={ROUTES.PUBLIC.GALLERY} className="text-sm text-text-secondary hover:text-primary transition-colors">Campus Gallery</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-text-primary mb-6">Services</h3>
              <ul className="space-y-4">
                <li><Link to={ROUTES.PUBLIC.SERVICES} className="text-sm text-text-secondary hover:text-primary transition-colors">Academic Tuition</Link></li>
                <li><Link to={ROUTES.PUBLIC.SERVICES} className="text-sm text-text-secondary hover:text-primary transition-colors">Career Guidance</Link></li>
                <li><Link to={ROUTES.PUBLIC.SERVICES} className="text-sm text-text-secondary hover:text-primary transition-colors">Direct Examinations</Link></li>
                <li><Link to={ROUTES.PUBLIC.SERVICES} className="text-sm text-text-secondary hover:text-primary transition-colors">Skill Development</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-text-primary mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">123 Education Hub, Main Street, City Name, State 12345</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm text-text-secondary">+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm text-text-secondary">info@mrinstitute.edu</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-text-muted">
              © {new Date().getFullYear()} MR Institute of Learning. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="#" className="text-sm text-text-muted hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="#" className="text-sm text-text-muted hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </Container>
      </footer>
      <FloatingEnquiryButton />
    </div>
  );
};
