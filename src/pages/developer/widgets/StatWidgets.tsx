import { Card, CardContent } from '../../../components/ui/Card';
import { BookOpen, Briefcase, Image as ImageIcon, FileText } from 'lucide-react';

const STATS = [
  { label: 'Total Courses', value: '24', icon: <BookOpen className="w-5 h-5 text-primary" />, change: '+3 this month' },
  { label: 'Services', value: '8', icon: <Briefcase className="w-5 h-5 text-success" />, change: 'Active' },
  { label: 'Gallery Items', value: '142', icon: <ImageIcon className="w-5 h-5 text-warning" />, change: '+12 this week' },
  { label: 'Forms & Applications', value: '856', icon: <FileText className="w-5 h-5 text-info" />, change: '+124 this week' },
];

export function StatWidgets() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {STATS.map((stat, index) => (
        <Card key={index} className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center">
                {stat.icon}
              </div>
              <span className="text-xs font-semibold text-text-muted bg-surface px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-text-primary mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
