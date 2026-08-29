import { HeroSection } from '../components/public/HeroSection';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { PageTransition } from '../components/animations/PageTransition';
import { SlideIn } from '../components/animations/SlideIn';
import { DynamicFormRenderer } from '../components/forms/DynamicFormRenderer';
import { MapPin, Phone, Mail, Clock, Building2, Users, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { settingsRepository } from '../repositories/cms';
import { type SiteSettings, type ContactPageContent } from '../types/cms';
import { useSEO } from '../hooks/useSEO';
import { Button } from '../components/ui/Button';

const FALLBACK_CONTACT: ContactPageContent = {
  headline: 'Get In Touch',
  description: 'Have questions about admissions, courses, or charity programs? Our team is here to help you.',
  heroImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
  primaryCtaText: 'Send a Message',
  primaryCtaLink: '#contact-form',
  infoTitle: 'Contact Information',
  infoSubtitle: 'Fill out the form and our admissions team will get back to you within 24 hours. Alternatively, you can reach us directly using the information below.',
  mapEmbedUrl: 'https://maps.google.com/maps?q=MR+Institute+of+Learning+Kerala&t=&z=14&ie=UTF8&iwloc=&output=embed',
  mapLocationName: 'MR Institute Campus, Main Knowledge City Road, Kerala, India',
  mapTitle: 'Our Campus Location',
  mapSubtitle: 'Find us at our central knowledge campus in Kerala.',
  portalSectionTitle: 'Institutional Portal Access',
  portalSectionSubtitle: 'Authorized staff and administrators can access their respective management portals here.',
  staffPortalButtonText: 'Staff Login',
  developerPortalButtonText: 'Developer Login'
};

export default function Contact() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await settingsRepository.getById('global');
        if (res.data) setSettings(res.data);
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    };
    fetch();
  }, []);

  const content: ContactPageContent = {
    ...FALLBACK_CONTACT,
    ...(settings?.contactContent || (settings?.seo as any)?.contactContent || {})
  };

  useSEO(settings?.seo || { 
    title: 'Contact Us - MR Institute of Learning', 
    description: 'Get in touch with MR Institute of Learning for admissions, courses, and enquiries.', 
    keywords: 'contact, MR Institute, admissions, education, Kerala' 
  });

  // Determine valid Google Maps embed URL
  const rawMapUrl = content.mapEmbedUrl || settings?.mapEmbedUrl;
  const isEmbeddable = rawMapUrl && (
    rawMapUrl.includes('google.com/maps') || 
    rawMapUrl.startsWith('https://')
  );

  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings?.address || 'MR Institute of Learning Kerala')}`;

  return (
    <PageTransition>
      {/* 1. Dynamic Hero Section */}
      <HeroSection
        headline={content.headline || 'Get In Touch'}
        description={content.description || 'Have questions about admissions, courses, or charity programs? Our team is here to help you.'}
        imageSrc={content.heroImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80'}
        primaryCtaText={content.primaryCtaText || 'Send a Message'}
        primaryCtaLink={content.primaryCtaLink || '#contact-form'}
      />

      {/* 2. Contact Information & Enquiry Form Section */}
      <Section className="bg-surface relative" id="contact-form">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Information (Left) */}
            <div className="lg:col-span-5 space-y-8">
              <SlideIn direction="right">
                <h2 className="text-3xl font-bold text-text-primary mb-4">
                  {content.infoTitle || 'Contact Information'}
                </h2>
                <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                  {content.infoSubtitle || 'Fill out the form and our admissions team will get back to you within 24 hours. Alternatively, you can reach us directly using the information below.'}
                </p>
                
                <div className="space-y-4">
                  {/* Campus Address Card */}
                  {(settings?.address || content.mapLocationName) && (
                    <div className="flex items-start gap-4 p-5 rounded-lg bg-white border border-border shadow-sm hover:border-brand-primary/30 transition-colors">
                      <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary mb-1">Our Campus</h3>
                        <p className="text-text-secondary leading-relaxed text-sm">
                          {settings?.address || content.mapLocationName}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Phone Number Card */}
                  {settings?.contactPhone && (
                    <div className="flex items-start gap-4 p-5 rounded-lg bg-white border border-border shadow-sm hover:border-brand-primary/30 transition-colors">
                      <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary mb-1">Phone Number</h3>
                        <a 
                          href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`} 
                          className="text-brand-primary hover:text-brand-primary-hover font-medium text-sm transition-colors"
                        >
                          {settings.contactPhone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Email Address Card */}
                  {settings?.contactEmail && (
                    <div className="flex items-start gap-4 p-5 rounded-lg bg-white border border-border shadow-sm hover:border-brand-primary/30 transition-colors">
                      <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary mb-1">Email Address</h3>
                        <a 
                          href={`mailto:${settings.contactEmail}`} 
                          className="text-brand-primary hover:text-brand-primary-hover font-medium text-sm transition-colors"
                        >
                          {settings.contactEmail}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Working Hours Card */}
                  {settings?.officeHours && (
                    <div className="flex items-start gap-4 p-5 rounded-lg bg-white border border-border shadow-sm hover:border-brand-primary/30 transition-colors">
                      <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary mb-1">Office Hours</h3>
                        <p className="text-text-secondary leading-relaxed text-sm">
                          {settings.officeHours}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Branch Offices */}
                  {settings?.branches && settings.branches.length > 0 && (
                    <div className="p-5 rounded-lg bg-white border border-border shadow-sm">
                      <div className="flex items-center gap-3 mb-3 text-brand-primary font-bold">
                        <Building2 className="w-5 h-5" />
                        <span>Branch Campuses</span>
                      </div>
                      <div className="space-y-4 pt-1">
                        {settings.branches.map((branch, i) => (
                          <div key={i} className="text-sm border-l-2 border-brand-primary/30 pl-3 py-1 space-y-1">
                            <p className="font-bold text-text-primary">{branch.name}</p>
                            {branch.address && <p className="text-text-secondary text-xs">{branch.address}</p>}
                            {branch.phone && <p className="text-text-secondary text-xs">📞 {branch.phone}</p>}
                            {branch.email && <p className="text-text-secondary text-xs">✉️ {branch.email}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Department Contacts */}
                  {settings?.departmentContacts && settings.departmentContacts.length > 0 && (
                    <div className="p-5 rounded-lg bg-white border border-border shadow-sm">
                      <div className="flex items-center gap-3 mb-3 text-brand-primary font-bold">
                        <Users className="w-5 h-5" />
                        <span>Department Inquiries</span>
                      </div>
                      <div className="space-y-3 pt-1">
                        {settings.departmentContacts.map((dept, i) => (
                          <div key={i} className="text-sm border-l-2 border-brand-secondary/40 pl-3 py-1 space-y-0.5">
                            <p className="font-bold text-text-primary">{dept.department}</p>
                            {dept.name && <p className="text-text-secondary text-xs">{dept.name}</p>}
                            {dept.email && <p className="text-text-secondary text-xs font-medium text-brand-primary">{dept.email}</p>}
                            {dept.phone && <p className="text-text-secondary text-xs">{dept.phone}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </SlideIn>
            </div>

            {/* Public Enquiry Form (Right) */}
            <div className="lg:col-span-7">
              <DynamicFormRenderer type="contact" />
            </div>

          </div>
        </Container>
      </Section>
      
      {/* 3. Google Maps / Location Section */}
      <Section className="p-0 border-t border-border bg-white overflow-hidden">
        <SlideIn direction="up">
          <div className="w-full relative">
            {isEmbeddable ? (
              <div className="relative w-full h-[420px] bg-surface-muted">
                <iframe
                  src={rawMapUrl}
                  title={content.mapTitle || "MR Institute of Learning Campus Location"}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-lg shadow-md border border-border text-xs font-bold text-text-primary flex items-center gap-2">
                  <MapPin className="text-brand-primary w-4 h-4 shrink-0" />
                  <span>{content.mapLocationName || settings?.address || 'MR Institute Campus'}</span>
                  <a 
                    href={googleMapsDirectionsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-brand-primary hover:underline flex items-center gap-1 font-semibold"
                  >
                    Directions <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="w-full h-96 bg-surface-muted relative flex items-center justify-center p-8">
                <div className="absolute inset-0 bg-cover bg-center opacity-30 grayscale" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80')" }}></div>
                <div className="relative z-10 bg-white/95 backdrop-blur-md p-8 rounded-xl shadow-lg border border-border max-w-lg text-center space-y-4">
                  <div className="w-14 h-14 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">{content.mapTitle || 'Visit Our Main Campus'}</h3>
                    <p className="text-text-secondary text-sm mt-1">{settings?.address || content.mapLocationName || 'MR Institute Campus, Main Knowledge City Road, Kerala, India'}</p>
                  </div>
                  <Button asChild size="default" className="shadow-sm">
                    <a href={googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" /> Open in Google Maps
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SlideIn>
      </Section>
    </PageTransition>
  );
}
