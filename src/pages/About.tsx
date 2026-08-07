import { HeroSection } from '../components/public/HeroSection';
import { SectionHeading } from '../components/public/SectionHeading';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { SlideIn } from '../components/animations/SlideIn';
import { PageTransition } from '../components/animations/PageTransition';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import { useState, useEffect } from 'react';
import { aboutRepository } from '../repositories/cms';
import { type AboutContent } from '../types/cms';
import { useSEO } from '../hooks/useSEO';
import * as Icons from 'lucide-react';

export default function About() {
  const [data, setData] = useState<AboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const res = await aboutRepository.getById('main');
      if(res.data) setData(res.data);
      setIsLoading(false);
    };
    fetch();
  }, []);

  useSEO(data?.seo);

  const getIcon = (name: string) => {
    const IconComponent = (Icons as any)[name] || Check;
    return <IconComponent className="w-6 h-6" />;
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
        headline={data?.title || "About MR Institute"}
        description="Learn about our journey, our mission, and the passionate team dedicated to shaping the future of education."
        imageSrc="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&q=80"
      />

      {data?.story && (
        <Section className="bg-white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <SlideIn direction="right">
                <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-6">Our Story</h2>
                <div 
                  className="prose text-text-secondary text-lg leading-relaxed max-w-none"
                  dangerouslySetInnerHTML={{ __html: data.story }}
                />
              </SlideIn>
              <SlideIn direction="left" className="grid grid-cols-2 gap-4">
                <img loading="lazy" src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80" alt="Students studying" className="rounded-2xl shadow-floating object-cover aspect-square w-full" />
                <img loading="lazy" src="https://images.unsplash.com/photo-1568667256549-094345857637?w=400&q=80" alt="Library" className="rounded-2xl shadow-floating object-cover aspect-square w-full mt-8" />
              </SlideIn>
            </div>
          </Container>
        </Section>
      )}

      {(data?.vision || data?.mission) && (
        <Section className="bg-surface">
          <Container>
            <SectionHeading title="Vision & Mission" subtitle="The core principles that guide everything we do." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.vision && (
                <SlideIn delay={0.1} direction="up" className="bg-white p-8 rounded-2xl shadow-sm border border-border">
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <div className="prose text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: data.vision }} />
                </SlideIn>
              )}
              {data.mission && (
                <SlideIn delay={0.2} direction="up" className="bg-white p-8 rounded-2xl shadow-sm border border-border">
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <div className="prose text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: data.mission }} />
                </SlideIn>
              )}
            </div>
          </Container>
        </Section>
      )}

      {data?.values && data.values.length > 0 && (
        <Section className="bg-white">
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <SlideIn direction="up">
                <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-6">Our Core Values</h2>
              </SlideIn>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.values.map((value, i) => (
                <SlideIn key={i} delay={i * 0.1} direction="up" className="text-center">
                  <div className="w-16 h-16 mx-auto bg-surface rounded-full flex items-center justify-center text-primary mb-6 shadow-sm">
                    {getIcon(value.icon || 'Check')}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-text-secondary">{value.description}</p>
                </SlideIn>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Leadership Messages */}
      {(data?.chairmanMessage?.message || data?.principalMessage?.message) && (
        <Section className="bg-surface border-t border-border">
          <Container>
            <SectionHeading title="Leadership" subtitle="Messages from our guiding forces." />
            <div className="space-y-16">
              {data.chairmanMessage?.message && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-white p-8 rounded-2xl shadow-sm">
                  <div className="md:col-span-1">
                    <img loading="lazy" 
                      src={data.chairmanMessage.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80"} 
                      alt={data.chairmanMessage.name} 
                      className="rounded-xl w-full object-cover aspect-[3/4]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold mb-2">{data.chairmanMessage.name}</h3>
                    <p className="text-primary font-semibold mb-6">Chairman</p>
                    <div className="prose text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: data.chairmanMessage.message }} />
                  </div>
                </div>
              )}

              {data.principalMessage?.message && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-white p-8 rounded-2xl shadow-sm">
                  <div className="md:col-span-2 order-2 md:order-1">
                    <h3 className="text-2xl font-bold mb-2">{data.principalMessage.name}</h3>
                    <p className="text-primary font-semibold mb-6">Principal</p>
                    <div className="prose text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: data.principalMessage.message }} />
                  </div>
                  <div className="md:col-span-1 order-1 md:order-2">
                    <img loading="lazy" 
                      src={data.principalMessage.image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"} 
                      alt={data.principalMessage.name} 
                      className="rounded-xl w-full object-cover aspect-[3/4]"
                    />
                  </div>
                </div>
              )}
            </div>
          </Container>
        </Section>
      )}

      {/* Infrastructure */}
      {data?.infrastructure && data.infrastructure.length > 0 && (
         <Section className="bg-white">
            <Container>
               <SectionHeading title="Campus & Infrastructure" subtitle="State of the art facilities to support your learning journey." />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {data.infrastructure.map((fac, i) => (
                     <div key={i} className="flex flex-col md:flex-row gap-6 bg-surface p-4 rounded-xl border border-border">
                        {fac.image && <img loading="lazy" src={fac.image} alt={fac.title} className="w-full md:w-32 h-32 object-cover rounded-lg shrink-0" />}
                        <div>
                           <h4 className="font-bold text-lg mb-2">{fac.title}</h4>
                           <p className="text-text-secondary text-sm">{fac.description}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </Container>
         </Section>
      )}

      <Section className="bg-primary text-white">
        <Container>
          <SlideIn direction="up" className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Educational Community
            </h2>
            <p className="text-lg text-white/80 mb-10">
              Whether you're looking for academic tuition, degree support, or skill development, we have a place for you.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to={ROUTES.PUBLIC.COURSES}>Explore Our Courses <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </SlideIn>
        </Container>
      </Section>
    </PageTransition>
  );
}
