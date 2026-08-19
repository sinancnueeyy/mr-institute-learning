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
  const [visibleCount, setVisibleCount] = useState(12);

  useSEO({ title: 'Gallery - MR Institute', description: '', keywords: '' });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await galleryRepository.query([{ field: 'isActive', operator: '==', value: true }]);
        if(res.data) {
          setGallery(res.data);
          const uniqueCategories = Array.from(new Set(res.data.map(item => item.category).filter(Boolean)));
          setCategories(['All', ...uniqueCategories]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const filteredGallery = activeCategory === 'All' 
    ? gallery 
    : gallery.filter(item => item.category === activeCategory);

  const visibleGallery = filteredGallery.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  // Reset visible count when category changes
  useEffect(() => {
    setVisibleCount(12);
  }, [activeCategory]);

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
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 w-full animate-pulse rounded-md bg-surface-muted border border-border" />
              ))}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {categories.map((category, index) => (
                  <SlideIn key={category} delay={index * 0.05} direction="up">
                    <button
                      onClick={() => setActiveCategory(category)}
                      className={cn(
                        "px-6 py-2 rounded-md text-sm font-semibold transition-all duration-300",
                        activeCategory === category
                          ? "bg-brand-primary text-text-on-primary shadow-md"
                          : "bg-white text-text-secondary border border-border hover:border-brand-primary hover:text-brand-primary"
                      )}
                    >
                      {category}
                    </button>
                  </SlideIn>
                ))}
              </div>

              {visibleGallery.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleGallery.map((item, i) => (
                    <GalleryCard key={item.id} item={item} delay={(i % 12) * 0.1} />
                  ))}
                </div>
              ) : (
                <SlideIn direction="up">
                  <div className="text-center py-20 bg-white rounded-md border border-border shadow-sm">
                    <h3 className="text-2xl font-bold text-text-primary mb-2">No media found</h3>
                    <p className="text-text-secondary">We haven't uploaded any media for this category yet.</p>
                  </div>
                </SlideIn>
              )}
              
              {visibleCount < filteredGallery.length && (
                <div className="mt-12 text-center">
                  <button 
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-brand-primary text-text-on-primary font-semibold rounded-md hover:bg-brand-secondary transition-colors shadow-sm"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </Container>
      </Section>
    </PageTransition>
  );
}
