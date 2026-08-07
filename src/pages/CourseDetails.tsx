import { useParams } from 'react-router-dom';
import { PageTransition } from '../components/animations/PageTransition';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SlideIn } from '../components/animations/SlideIn';
import { Clock, MonitorPlay, Calendar, CheckCircle, ArrowRight, Download, CreditCard, Users, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { coursesRepository } from '../repositories/cms';
import { type CourseContent } from '../types/cms';
import { DynamicFormRenderer } from '../components/forms/DynamicFormRenderer';
import { useSEO } from '../hooks/useSEO';

export default function CourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<CourseContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if(courseId) {
        const res = await coursesRepository.getById(courseId);
        if(res.data) setCourse(res.data);
      }
      setIsLoading(false);
    };
    fetch();
  }, [courseId]);

  useSEO(course?.seo);

  if (isLoading) return null;
  if (!course) return <div>Course not found</div>;

  return (
    <PageTransition>
      {/* Course Banner */}
      <div className="relative bg-black h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img loading="lazy" 
            src={course.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80"} 
            alt={course.title} 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
        
        <Container className="relative z-10">
          <SlideIn direction="up">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-none backdrop-blur-md">
              {course.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 max-w-4xl leading-tight">
              {course.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90 font-medium">
              {course.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
              )}
              {course.mode && (
                <div className="flex items-center gap-2">
                  <MonitorPlay className="w-5 h-5" />
                  <span>{course.mode}</span>
                </div>
              )}
            </div>
          </SlideIn>
        </Container>
      </div>

      <Section className="bg-surface relative">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content (Left) */}
            <div className="lg:col-span-8 space-y-12">
              {course.description && (
                <SlideIn direction="up">
                  <h2 className="text-3xl font-bold text-text-primary mb-6">Course Overview</h2>
                  <div 
                    className="prose text-lg text-text-secondary leading-relaxed max-w-none"
                    dangerouslySetInnerHTML={{ __html: course.description }}
                  />
                </SlideIn>
              )}

              {course.highlights && course.highlights.length > 0 && (
                <SlideIn direction="up" delay={0.1}>
                  <h2 className="text-2xl font-bold text-text-primary mb-6">Key Highlights</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {course.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-border">
                        <CheckCircle className="w-5 h-5 text-success shrink-0" />
                        <span className="font-semibold text-text-primary">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </SlideIn>
              )}

              {course.syllabus && course.syllabus.length > 0 && (
                <SlideIn direction="up" delay={0.2}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-text-primary">Syllabus Preview</h2>
                    {course.syllabusPdf && (
                       <Button variant="outline" size="sm" asChild>
                         <a href={course.syllabusPdf} target="_blank" rel="noopener noreferrer">
                           <Download className="w-4 h-4 mr-2" /> Download Full Syllabus
                         </a>
                       </Button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {course.syllabus.map((module, i) => (
                      <div key={i} className="bg-white p-6 rounded-xl border border-border shadow-sm flex justify-between items-center group cursor-pointer hover:border-primary transition-colors">
                        <span className="font-bold text-lg text-text-primary">{module}</span>
                        <ArrowRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 transform duration-300" />
                      </div>
                    ))}
                  </div>
                </SlideIn>
              )}

              {course.faqs && course.faqs.length > 0 && (
                <SlideIn direction="up" delay={0.3}>
                  <h2 className="text-2xl font-bold text-text-primary mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {course.faqs.map((faq, index) => (
                      <div key={index} className="bg-white p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="font-bold text-lg text-text-primary mb-2 flex items-start gap-3">
                           <HelpCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
                           {faq.question}
                        </h3>
                        <p className="text-text-secondary pl-8">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </SlideIn>
              )}
            </div>

            {/* Sticky Sidebar (Right) */}
            <div className="lg:col-span-4">
              <SlideIn direction="left" delay={0.3} className="sticky top-24">
                <div className="bg-white rounded-2xl shadow-floating p-8 border border-border">
                  <h3 className="text-2xl font-bold text-text-primary mb-6">Enrollment Details</h3>
                  
                  <div className="space-y-6 mb-8">
                    {course.admissionDates && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm text-text-muted font-medium mb-1">Admission Dates</div>
                          <div className="font-bold text-text-primary">{course.admissionDates}</div>
                        </div>
                      </div>
                    )}
                    
                    {course.batchSchedule && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm text-text-muted font-medium mb-1">Batch Schedule</div>
                          <div className="font-bold text-text-primary">{course.batchSchedule}</div>
                        </div>
                      </div>
                    )}

                    {course.eligibility && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm text-text-muted font-medium mb-1">Eligibility</div>
                          <div className="font-bold text-text-primary">{course.eligibility}</div>
                        </div>
                      </div>
                    )}

                    {course.fees && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm text-text-muted font-medium mb-1">Fees</div>
                          <div className="font-bold text-text-primary">{course.fees}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button size="lg" className="w-full mb-4 text-lg" onClick={() => {
                    document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    Enquire Now
                  </Button>
                  <p className="text-center text-sm text-text-muted">
                    Need help? <a href="#enquiry-form" className="text-primary font-semibold hover:underline">Contact an Advisor</a>
                  </p>
                </div>
              </SlideIn>
            </div>

          </div>
        </Container>
      </Section>

      {/* Enquiry Form Section */}
      <Section className="bg-surface border-t border-border" id="enquiry-form">
        <Container>
          <div className="max-w-4xl mx-auto">
             <div className="text-center mb-8">
               <h2 className="text-3xl font-bold mb-4">Request Information</h2>
               <p className="text-text-secondary">Fill out the form below and our admissions team will get back to you shortly.</p>
             </div>
            <DynamicFormRenderer type="enquiry" />
          </div>
        </Container>
      </Section>
    </PageTransition>
  );
}
