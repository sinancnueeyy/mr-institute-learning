import { HeroSection } from '../components/public/HeroSection';
import { SectionHeading } from '../components/public/SectionHeading';
import { CourseCard } from '../components/public/CourseCard';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { PageTransition } from '../components/animations/PageTransition';
import { SlideIn } from '../components/animations/SlideIn';
import { useState, useEffect } from 'react';
import { coursesRepository } from '../repositories/cms';
import { type CourseContent } from '../types/cms';
import { cn } from '../utils';

export default function Courses() {
  const [courses, setCourses] = useState<CourseContent[]>([]);
  const [categories, setCategories] = useState<string[]>(['All Courses']);
  const [activeCategory, setActiveCategory] = useState('All Courses');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await coursesRepository.query([{ field: 'isActive', operator: '==', value: true }]);
        if(res.data) {
          setCourses(res.data);
          const uniqueCategories = Array.from(new Set(res.data.map(c => c.category).filter(Boolean)));
          setCategories(['All Courses', ...uniqueCategories]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const filteredCourses = activeCategory === 'All Courses' 
    ? courses 
    : courses.filter(c => c.category === activeCategory);

  return (
    <PageTransition>
      <HeroSection
        headline="Discover Our Programs"
        description="From academic tuition to advanced AI skill development, find the perfect course to accelerate your career and education."
        imageSrc="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80"
        primaryCtaText="View All Courses"
        primaryCtaLink="#course-list"
        secondaryCtaText="Contact Advisor"
        secondaryCtaLink="/contact"
      />

      <Section id="course-list" className="bg-surface">
        <Container>
          <SectionHeading 
            title="Browse by Category" 
            subtitle="Select a category below to filter our extensive list of educational programs."
          />
          
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category, index) => (
              <SlideIn key={category} delay={index * 0.05} direction="up">
                <button
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-5 py-2.5 rounded-md text-sm font-semibold transition-all duration-300",
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

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 rounded-md bg-border/30 animate-pulse" />
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, i) => (
                <CourseCard key={course.id} course={course} delay={i * 0.1} />
              ))}
            </div>
          ) : (
            <SlideIn direction="up">
              <div className="text-center py-20 bg-white rounded-md border border-border shadow-sm">
                <h3 className="text-2xl font-bold text-text-primary mb-2">No courses found</h3>
                <p className="text-text-secondary">We are currently updating our syllabus for this category. Please check back later.</p>
              </div>
            </SlideIn>
          )}
        </Container>
      </Section>
    </PageTransition>
  );
}
