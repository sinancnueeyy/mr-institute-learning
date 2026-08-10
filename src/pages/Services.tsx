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
      try {
        const res = await servicesRepository.query([{ field: 'isActive', operator: '==', value: true }]);
        if(res.data) {
          // Sort by order
          const sorted = [...res.data].sort((a, b) => (a.order || 0) - (b.order || 0));
          setServices(sorted);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const getIcon = (name?: string) => {
    if (!name) return <Check className="w-8 h-8" />;
    const IconComponent = (Icons as any)[name] || Check;
    return <IconComponent className="w-8 h-8" />;
  };

  return (
    <PageTransition>
      <HeroSection
        headline="Our Educational Services"
        description="Comprehensive support systems designed to guide students through every phase of their academic and professional journey."
        imageSrc="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80"
      />

      <Section className="bg-surface relative overflow-hidden">
        {/* Background Accents */}

        
        <Container className="relative z-10">
          <SectionHeading 
            title="How We Help You Succeed" 
            subtitle="From the classroom to your career, MR Institute provides a robust ecosystem of services."
          />
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-md bg-border/30 animate-pulse" />
              ))}
            </div>
          ) : services.length > 0 ? (
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
             <div className="text-center py-20 bg-white rounded-md border border-border shadow-sm">
               <h3 className="text-2xl font-bold text-text-primary mb-2">No services found</h3>
               <p className="text-text-secondary">We are currently updating our service offerings. Please check back later.</p>
             </div>
          )}
        </Container>
      </Section>
    </PageTransition>
  );
}
