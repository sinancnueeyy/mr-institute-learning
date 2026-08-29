import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Activity } from 'lucide-react';

export function SystemHealthWidget() {
  return (
    <Card className="lg:col-span-2 border-border shadow-sm">
      <CardHeader className="border-b border-border bg-surface/50">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-success" /> System Health
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-text-primary">Database Connection (Supabase)</span>
              <span className="text-success font-bold">Connected</span>
            </div>
            <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
              <div className="w-full h-full bg-success"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-text-primary">Storage Usage</span>
              <span className="text-text-secondary">4.2 GB / 10 GB</span>
            </div>
            <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
              <div className="w-[42%] h-full bg-brand-primary"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-text-primary">API Response Time</span>
              <span className="text-text-secondary">42ms avg</span>
            </div>
            <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
              <div className="w-[15%] h-full bg-info"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
