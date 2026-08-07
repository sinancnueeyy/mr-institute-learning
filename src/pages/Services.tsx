import { HeroSection } from '../components/public/HeroSection';
import { SectionHeading } from '../components/public/SectionHeading';
import { ServiceCard } from '../components/public/ServiceCard';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { PageTransition } from '../components/animations/PageTransition';
import { Check } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useState, useEffect } from 'react';
import { servicesRepository } from '../repositories/cms';
import { type ServiceContent } from '../types/cms';
import { useSEO } from '../hooks/useSEO';

export default function Services() {
  useSEO({ title: 'Services - MR Institute', description: 'Our Services and Offerings', keywords: 'services, offerings' });
  const [services, setServices] = useState<ServiceContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const res = await servicesRepository.query([{ field: 'isActive', operator: '==', value: true }]);
      if(res.data) {
        // Sort by order
        const sorted = [...res.data].sort((a, b) => (a.order || 0) - (b.order || 0));
        setServices(sorted);
      }
      setIsLoading(false);
    };
    fetch();
  }, []);

  const getIcon = (name?: string) => {
    if (!name) return <Check className="w-8 h-8" />;
    const IconComponent = (Icons as any)[name] || Check;
    return <IconComponent className="w-8 h-8" />;
  };

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
        headline="Our Educational Services"
        description="Comprehensive support systems designed to guide students through every phase of their academic and professional journey."
        imageSrc="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80"
      />

      <Section className="bg-surface relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        
        <Container className="relative z-10">
          <SectionHeading 
            title="How We Help You Succeed" 
            subtitle="From the classroom to your career, MR Institute provides a robust ecosystem of services."
          />
          
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, i) => (
                <ServiceCard 
                  key={service.id}
                  title={service.title}
                  description={service.description}
                  icon={getIcon(service.iconName)}
                  delay={i * 0.1}
                />
              ))}
            </div>
          ) : (
             <div className="text-center py-20 bg-white rounded-2xl border border-border">
               <h3 className="text-2xl font-bold text-text-primary mb-2">No services found</h3>
               <p className="text-text-secondary">We are currently updating our service offerings. Please check back later.</p>
             </div>
          )}
        </Container>
      </Section>
    </PageTransition>
  );
}
