import { HeroSection } from '../components/public/HeroSection';
import { SectionHeading } from '../components/public/SectionHeading';
import { StatCard } from '../components/public/StatCard';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { PageTransition } from '../components/animations/PageTransition';
import { SlideIn } from '../components/animations/SlideIn';
import { CheckCircle, FileText, HelpCircle } from 'lucide-react';
import { DynamicFormRenderer } from '../components/forms/DynamicFormRenderer';
import { ROUTES } from '../constants';
import { useState, useEffect } from 'react';
import { charityRepository } from '../repositories/cms';
import { type CharityContent } from '../types/cms';
import { useSEO } from '../hooks/useSEO';

export default function Charity() {
  const [data, setData] = useState<CharityContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const res = await charityRepository.getById('main');
      if(res.data) setData(res.data);
      setIsLoading(false);
    };
    fetch();
  }, []);

  useSEO(data?.seo);

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
        headline={data?.title || "Education for All"}
        description={data?.description || "MR Institute's Charity and Scholarship initiatives are dedicated to removing financial barriers and empowering deserving students."}
        imageSrc="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80"
        primaryCtaText="Apply for Support"
        primaryCtaLink={ROUTES.PUBLIC.CONTACT}
      />

      {/* Impact Stats */}
      {data?.impactStats && data.impactStats.length > 0 && (
        <Section className="bg-white border-b border-border">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {data.impactStats.map((stat, i) => (
                <StatCard key={i} label={stat.label} value={stat.value} delay={i * 0.1} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Initiatives */}
      {data?.schemes && data.schemes.length > 0 && (
        <Section className="bg-surface">
          <Container>
            <SectionHeading 
              title="Our Core Initiatives" 
              subtitle="Through various programs, we strive to make a tangible difference in our community."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.schemes.map((initiative, i) => (
                <SlideIn key={i} delay={i * 0.1} direction="up" className="bg-white p-8 rounded-2xl shadow-sm border border-border text-center group hover:border-primary transition-colors">
                  <h3 className="text-xl font-bold mb-4">{initiative.title}</h3>
                  <div 
                    className="prose text-text-secondary leading-relaxed text-sm max-w-none text-left" 
                    dangerouslySetInnerHTML={{ __html: initiative.description }}
                  />
                  {initiative.eligibility && (
                    <div className="mt-4 pt-4 border-t border-border text-left">
                       <span className="font-semibold block mb-1 text-sm text-text-primary">Eligibility:</span>
                       <span className="text-sm text-text-secondary">{initiative.eligibility}</span>
                    </div>
                  )}
                </SlideIn>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Eligibility & Documents */}
      {((data?.eligibilityCriteria && data.eligibilityCriteria.length > 0) || (data?.requiredDocuments && data.requiredDocuments.length > 0)) && (
        <Section className="bg-white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {data.eligibilityCriteria && data.eligibilityCriteria.length > 0 && (
                <SlideIn direction="right">
                  <h2 className="text-3xl font-bold text-text-primary mb-6 flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-primary" /> General Eligibility
                  </h2>
                  <ul className="space-y-4 text-lg text-text-secondary">
                    {data.eligibilityCriteria.map((crit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                        {crit}
                      </li>
                    ))}
                  </ul>
                </SlideIn>
              )}

              {data.requiredDocuments && data.requiredDocuments.length > 0 && (
                <SlideIn direction="left" delay={0.2} className="bg-surface p-8 rounded-2xl border border-border">
                  <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-primary" /> Required Documents
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.requiredDocuments.map((doc, i) => (
                      <div key={i} className="bg-white px-4 py-3 rounded-lg text-sm font-medium text-text-secondary shadow-sm border border-border">
                        {doc}
                      </div>
                    ))}
                  </div>
                </SlideIn>
              )}

            </div>
          </Container>
        </Section>
      )}

      {/* Success Stories */}
      {data?.successStories && data.successStories.length > 0 && (
        <Section className="bg-surface border-t border-border">
          <Container>
            <SectionHeading title="Success Stories" subtitle="Hear from students whose lives were transformed." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {data.successStories.map((story, i) => (
                 <SlideIn key={i} delay={i * 0.1} direction="up" className="bg-white p-6 rounded-2xl shadow-sm border border-border">
                    <div className="flex items-center gap-4 mb-4">
                       {story.image && <img loading="lazy" src={story.image} alt={story.name} className="w-16 h-16 rounded-full object-cover" />}
                       <div>
                          <h4 className="font-bold text-lg">{story.name}</h4>
                          <p className="text-sm text-primary font-medium">{story.course}</p>
                       </div>
                    </div>
                    <div className="prose text-text-secondary text-sm" dangerouslySetInnerHTML={{ __html: story.story }} />
                 </SlideIn>
               ))}
            </div>
          </Container>
        </Section>
      )}

      {/* FAQs */}
      {data?.faqs && data.faqs.length > 0 && (
        <Section className="bg-white border-t border-border">
          <Container>
            <SectionHeading title="Frequently Asked Questions" subtitle="Find answers to common queries about our charity schemes." />
            <div className="max-w-3xl mx-auto space-y-4">
               {data.faqs.map((faq, i) => (
                 <div key={i} className="bg-surface p-6 rounded-xl border border-border shadow-sm">
                   <h3 className="font-bold text-lg text-text-primary mb-2 flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
                      {faq.question}
                   </h3>
                   <p className="text-text-secondary pl-8">{faq.answer}</p>
                 </div>
               ))}
            </div>
          </Container>
        </Section>
      )}

      <Section className="bg-surface border-t border-border" id="apply">
        <Container>
          <SlideIn direction="up">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                 <h2 className="text-3xl font-bold mb-2">Apply for Support</h2>
                 <p className="text-text-secondary">Fill out the charity application form below.</p>
              </div>
              <DynamicFormRenderer type={data?.formTypeMapping || "charity"} />
            </div>
          </SlideIn>
        </Container>
      </Section>
    </PageTransition>
  );
}
