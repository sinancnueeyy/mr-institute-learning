import { ShieldCheck, Users, Award, BookOpen } from 'lucide-react';

export const TrustIndicators = () => {
  const indicators = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "Government Certified",
      description: "All our programs are fully accredited and recognized."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Expert Faculty",
      description: "Learn from industry professionals with years of experience."
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      title: "Career Support",
      description: "100% placement assistance and career guidance."
    },
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Modern Curriculum",
      description: "Updated syllabus aligned with current industry standards."
    }
  ];

  return (
    <div className="bg-white py-12 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {indicators.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
