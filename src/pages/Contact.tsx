import { HeroSection } from '../components/public/HeroSection';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { PageTransition } from '../components/animations/PageTransition';
import { SlideIn } from '../components/animations/SlideIn';
import { DynamicFormRenderer } from '../components/forms/DynamicFormRenderer';
import { MapPin, Phone, Mail, Clock, Building2, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { settingsRepository } from '../repositories/cms';
import { type SiteSettings } from '../types/cms';
import { useSEO } from '../hooks/useSEO';

export default function Contact() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const res = await settingsRepository.getById('global');
      if(res.data) setSettings(res.data);
      setIsLoading(false);
    };
    fetch();
  }, []);

  useSEO(settings?.seo || { title: 'Contact Us - MR Institute', description: '', keywords: '' });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="bg-surface py-16 sm:py-24 lg:py-32">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="h-16 w-3/4 animate-shimmer rounded-lg bg-border/50" />
                <div className="h-24 w-full animate-shimmer rounded-lg bg-border/30" />
                <div className="h-12 w-1/3 animate-shimmer rounded-lg bg-border/50" />
              </div>
              <div className="h-96 w-full animate-shimmer rounded-2xl bg-border/30" />
            </div>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <HeroSection
        headline="Get In Touch"
        description="Have questions about admissions, courses, or charity programs? Our team is here to help you."
        imageSrc="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80"
        primaryCtaText="Send a Message"
        primaryCtaLink="#contact-form"
      />

      <Section className="bg-surface relative" id="contact-form">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Information (Left) */}
            <div className="lg:col-span-5 space-y-8">
              <SlideIn direction="right">
                <h2 className="text-3xl font-bold text-text-primary mb-6">Contact Information</h2>
                <p className="text-text-secondary text-lg mb-8">
                  Fill out the form and our admissions team will get back to you within 24 hours. Alternatively, you can reach us directly using the information below.
                </p>
                
                <div className="space-y-6">
                  {settings?.address && (
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border shadow-sm">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary mb-1">Our Campus</h3>
                        <p className="text-text-secondary leading-relaxed">
                          {settings.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {settings?.contactPhone && (
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border shadow-sm">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary mb-1">Phone Number</h3>
                        <p className="text-text-secondary leading-relaxed">
                          {settings.contactPhone}
                        </p>
                      </div>
                    </div>
                  )}

                  {settings?.contactEmail && (
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border shadow-sm">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary mb-1">Email Address</h3>
                        <p className="text-text-secondary leading-relaxed">
                          {settings.contactEmail}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {settings?.officeHours && (
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border shadow-sm">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary mb-1">Office Hours</h3>
                        <p className="text-text-secondary leading-relaxed">
                          {settings.officeHours}
                        </p>
                      </div>
                    </div>
                  )}

                  {settings?.branches && settings.branches.length > 0 && (
                     <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border shadow-sm">
                       <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                         <Building2 className="w-6 h-6" />
                       </div>
                       <div>
                         <h3 className="font-bold text-text-primary mb-2">Our Branches</h3>
                         <div className="space-y-3">
                           {settings.branches.map((branch, i) => (
                              <div key={i} className="text-sm border-l-2 border-primary/20 pl-3">
                                 <p className="font-semibold text-text-primary">{branch.name}</p>
                                 <p className="text-text-secondary">{branch.address}</p>
                                 <p className="text-text-secondary">{branch.phone}</p>
                              </div>
                           ))}
                         </div>
                       </div>
                     </div>
                  )}

                  {settings?.departmentContacts && settings.departmentContacts.length > 0 && (
                     <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border shadow-sm">
                       <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                         <Users className="w-6 h-6" />
                       </div>
                       <div>
                         <h3 className="font-bold text-text-primary mb-2">Department Contacts</h3>
                         <div className="space-y-3">
                           {settings.departmentContacts.map((dept, i) => (
                              <div key={i} className="text-sm border-l-2 border-primary/20 pl-3">
                                 <p className="font-semibold text-text-primary">{dept.department}</p>
                                 <p className="text-text-secondary">{dept.email}</p>
                                 <p className="text-text-secondary">{dept.phone}</p>
                              </div>
                           ))}
                         </div>
                       </div>
                     </div>
                  )}
                </div>
              </SlideIn>
            </div>

            {/* Enquiry Form UI (Right) */}
            <div className="lg:col-span-7">
              <DynamicFormRenderer type="contact" />
            </div>

          </div>
        </Container>
      </Section>
      
      {/* Map Placeholder */}
      <Section className="p-0 border-t border-border bg-surface">
        <SlideIn direction="up">
          <div className="w-full h-96 bg-gray-200 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-cover bg-center opacity-50 grayscale" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80')" }}></div>
            <div className="relative z-10 bg-white/90 backdrop-blur-md px-8 py-4 rounded-xl shadow-lg border border-border font-bold text-text-primary flex items-center gap-3">
              <MapPin className="text-primary w-6 h-6" /> Google Maps Placeholder
            </div>
          </div>
        </SlideIn>
      </Section>
    </PageTransition>
  );
}
