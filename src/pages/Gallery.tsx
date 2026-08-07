import { useState, useEffect } from 'react';
import { HeroSection } from '../components/public/HeroSection';
import { SectionHeading } from '../components/public/SectionHeading';
import { GalleryCard } from '../components/public/GalleryCard';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { PageTransition } from '../components/animations/PageTransition';
import { SlideIn } from '../components/animations/SlideIn';
import { galleryRepository } from '../repositories/cms';
import { type GalleryContent } from '../types/cms';
import { cn } from '../utils';
import { useSEO } from '../hooks/useSEO';

export default function Gallery() {
  const [gallery, setGallery] = useState<GalleryContent[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useSEO({ title: 'Gallery - MR Institute', description: '', keywords: '' });

  useEffect(() => {
    const fetch = async () => {
      const res = await galleryRepository.query([{ field: 'isActive', operator: '==', value: true }]);
      if(res.data) {
        setGallery(res.data);
        const uniqueCategories = Array.from(new Set(res.data.map(item => item.category).filter(Boolean)));
        setCategories(['All', ...uniqueCategories]);
      }
      setIsLoading(false);
    };
    fetch();
  }, []);

  const filteredGallery = activeCategory === 'All' 
    ? gallery 
    : gallery.filter(item => item.category === activeCategory);

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
        headline="Campus Gallery"
        description="A visual journey through the vibrant life, events, and facilities at MR Institute of Learning."
        imageSrc="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80"
      />

      <Section className="bg-surface min-h-[50vh]">
        <Container>
          <SectionHeading 
            title="Explore Moments" 
            subtitle="Filter by category to view our state-of-the-art facilities and memorable events."
          />
          
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category, index) => (
              <SlideIn key={category} delay={index * 0.05} direction="up">
                <button
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                    activeCategory === category
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-white text-text-secondary border border-border hover:border-primary hover:text-primary"
                  )}
                >
                  {category}
                </button>
              </SlideIn>
            ))}
          </div>

          {filteredGallery.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGallery.map((item, i) => (
                <GalleryCard key={item.id} item={item} delay={i * 0.1} />
              ))}
            </div>
          ) : (
            <SlideIn direction="up">
              <div className="text-center py-20 bg-white rounded-2xl border border-border">
                <h3 className="text-2xl font-bold text-text-primary mb-2">No media found</h3>
                <p className="text-text-secondary">We haven't uploaded any media for this category yet.</p>
              </div>
            </SlideIn>
          )}
        </Container>
      </Section>
    </PageTransition>
  );
}
