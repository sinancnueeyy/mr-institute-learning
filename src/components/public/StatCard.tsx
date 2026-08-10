import { Card, CardContent } from '../ui/Card';
import { SlideIn } from '../animations/SlideIn';

export interface StatCardProps {
  label: string;
  value: string;
  delay?: number;
}

export function StatCard({ label, value, delay = 0 }: StatCardProps) {
  return (
    <SlideIn delay={delay} duration={0.6} direction="up">
      <Card className="text-center py-8 bg-brand-primary text-text-on-primary border-none hover:shadow-floating hover:-translate-y-1 transition-all duration-300">
        <CardContent className="p-0 flex flex-col justify-center items-center h-full">
          <div className="text-4xl md:text-5xl font-extrabold mb-2">{value}</div>
          <div className="text-text-on-primary/80 font-medium">{label}</div>
        </CardContent>
      </Card>
    </SlideIn>
  );
}
