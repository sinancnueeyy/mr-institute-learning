import { useState, useEffect } from 'react';
import { coursesRepository } from '../../repositories';
import { CourseCard } from '../public/CourseCard';
import { Section } from '../ui/Section';
import { SectionHeading } from '../public/SectionHeading';
import { PageLoader } from '../ui/Loaders';

export const PopularCourses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        // Fetch active courses
        const res = await coursesRepository.query([
          { field: 'isActive', operator: '==', value: true }
        ], { limit: 3 });
        
        if (res.data) {
          setCourses(res.data);
        }
      } catch (err) {
        console.error('Failed to load popular courses', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPopular();
  }, []);

  if (isLoading) return <PageLoader />;
  if (courses.length === 0) return null;

  return (
    <Section background="surface">
      <SectionHeading 
        title="Popular Courses" 
        subtitle="Explore our most sought-after programs designed to accelerate your career."
        alignment="center"
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </Section>
  );
};
