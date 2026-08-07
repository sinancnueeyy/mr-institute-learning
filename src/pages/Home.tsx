import { HeroSection } from '../components/public/HeroSection';
import { SectionHeading } from '../components/public/SectionHeading';
import { FeatureCard } from '../components/public/FeatureCard';

import { GalleryCard } from '../components/public/GalleryCard';
import { TestimonialCard } from '../components/public/TestimonialCard';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { SlideIn } from '../components/animations/SlideIn';
import { PageTransition } from '../components/animations/PageTransition';
import { ArrowRight, Check, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { initialTestimonials } from '../data/initialData';
import { PopularCourses } from '../components/growth/PopularCourses';
import { TrustIndicators } from '../components/growth/TrustIndicators';
import { galleryRepository, homepageRepository } from '../repositories/cms';
import { type GalleryContent, type HomepageContent } from '../types/cms';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import { useSEO } from '../hooks/useSEO';
import * as Icons from 'lucide-react';

interface HomeProps {
  draftData?: Partial<HomepageContent>;
}

export default function Home({ draftData }: HomeProps) {
  const [data, setData] = useState<Partial<HomepageContent>>(draftData || {});
  const [featuredGallery, setFeaturedGallery] = useState<GalleryContent[]>([]);
  const [isLoading, setIsLoading] = useState(!draftData);

  useEffect(() => {
    if (draftData) {
      setData(draftData);
      return;
    }

    const fetchHomeData = async () => {
      const pageRes = await homepageRepository.getById('main');
      if (pageRes.data) setData(pageRes.data);


      const galleryRes = await galleryRepository.query([{ field: 'isActive', operator: '==', value: true }], { limit: 4 });
      if (galleryRes.data) setFeaturedGallery(galleryRes.data);

      setIsLoading(false);
    };
    fetchHomeData();
  }, [draftData]);

  useSEO(data.seo);

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
      {/* Announcement Bar */}
      {data.announcementText && (
        <div className="bg-primary-dark text-white py-2 text-center text-sm font-medium">
          {data.announcementLink ? (
            <a href={data.announcementLink} className="hover:underline">{data.announcementText}</a>
          ) : (
             <span>{data.announcementText}</span>
          )}
        </div>
      )}

      {/* Hero Section */}
      <HeroSection
        headline={data.heroHeadline || "Empowering Minds, Shaping Futures"}
        description={data.heroDescription || "Join MR Institute of Learning and unlock your true potential with our expert faculty and modern curriculum."}
        primaryCtaText={data.primaryCtaText || "Explore Courses"}
        primaryCtaLink={data.primaryCtaLink || ROUTES.PUBLIC.COURSES}
        secondaryCtaText={data.secondaryCtaText || "Contact Us"}
        secondaryCtaLink={data.secondaryCtaLink || ROUTES.PUBLIC.CONTACT}
        imageSrc={data.heroImage || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80"}
      />

      {/* Trust Indicators for CRO */}
      <TrustIndicators />

      {/* About Preview */}
      <Section className="bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <SlideIn direction="right">
              <img loading="lazy" 
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80" 
                alt="Students learning" 
                className="rounded-2xl shadow-floating object-cover aspect-[4/3] w-full"
              />
            </SlideIn>
            <SlideIn direction="left">
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">About MR Institute</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-6">
                A Legacy of Educational Excellence
              </h3>
              <p className="text-text-secondary text-lg mb-6 leading-relaxed">
                Founded with a mission to make quality education accessible, MR Institute provides a modern learning environment tailored to the unique needs of every student. We bridge the gap between academic theory and real-world skills.
              </p>
              <ul className="space-y-4 mb-8">
                {['Personalized Attention', 'Expert Faculty', 'Modern Infrastructure'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-success w-5 h-5 shrink-0" />
                    <span className="font-medium text-text-primary">{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild>
                <Link to={ROUTES.PUBLIC.ABOUT}>Learn More About Us <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </SlideIn>
          </div>
        </Container>
      </Section>

      {/* Stats Section */}
      {data.stats && data.stats.length > 0 && (
         <Section className="bg-primary text-white py-12">
            <Container>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                 {data.stats.map((stat, i) => (
                    <div key={i} className="text-center">
                       <div className="text-4xl font-bold mb-2">{stat.value}</div>
                       <div className="text-sm font-medium text-white/80 uppercase tracking-wider">{stat.label}</div>
                    </div>
                 ))}
               </div>
            </Container>
         </Section>
      )}

      {/* Learning Areas (Features) */}
      <Section className="bg-surface">
        <Container>
          <SectionHeading 
            title="Why Choose MR Institute" 
            subtitle="Discover our comprehensive educational programs designed for every stage of your learning journey."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data.features?.length ? data.features : [
               { title: 'Academic Tuition', description: 'Extensive support for grades 8th to 12th.', icon: 'BookOpen' },
               { title: 'Degree Support', description: 'Guidance and resources for university students.', icon: 'Award' },
               { title: 'Computer & AI', description: 'Future-ready courses in programming and AI.', icon: 'Monitor' }
            ]).map((feature, i) => (
              <FeatureCard 
                key={i}
                title={feature.title} 
                description={feature.description} 
                icon={getIcon(feature.icon || 'Check')}
                delay={i * 0.1}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* Popular Courses Component */}
      <PopularCourses />

      {/* Charity Highlight */}
      <Section className="bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-black/10 blur-3xl"></div>
        
        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <SlideIn direction="right">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Our Commitment to Society</h2>
              <p className="text-primary-foreground/90 text-lg mb-8 leading-relaxed">
                We believe financial constraints should never be a barrier to education. MR Institute runs active scholarship programs, free education support for deserving students, and a community book bank.
              </p>
              <Button asChild variant="secondary" size="lg">
                <Link to={ROUTES.PUBLIC.CHARITY}>View Charity Initiatives</Link>
              </Button>
            </SlideIn>
            <SlideIn direction="left" className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
                <div className="text-4xl font-bold mb-2">₹50L+</div>
                <div className="text-sm font-medium text-primary-foreground/80">Scholarships</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 mt-8">
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-sm font-medium text-primary-foreground/80">Free Students</div>
              </div>
            </SlideIn>
          </div>
        </Container>
      </Section>

      {/* Student Success */}
      <Section className="bg-surface">
        <Container>
          <SectionHeading 
            title="Student Success Stories" 
            subtitle="Don't just take our word for it. Hear from the students who achieved their dreams with us."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {initialTestimonials.map((testimonial, i) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} delay={i * 0.1} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Gallery Preview */}
      <Section className="bg-white">
        <Container>
          <SectionHeading 
            title="Campus Life" 
            subtitle="Take a glimpse into the vibrant environment and modern facilities at MR Institute."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredGallery.map((item, i) => (
              <GalleryCard key={item.id} item={item} delay={i * 0.1} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to={ROUTES.PUBLIC.GALLERY}>View Full Gallery</Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section className="bg-surface border-t border-border">
        <Container>
          <SlideIn direction="up" className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-lg text-text-secondary mb-10">
              Join thousands of successful students and take the first step towards a brighter future today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link to={ROUTES.PUBLIC.CONTACT}>Apply Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to={ROUTES.PUBLIC.COURSES}>Browse Courses</Link>
              </Button>
            </div>
          </SlideIn>
        </Container>
      </Section>
    </PageTransition>
  );
}
