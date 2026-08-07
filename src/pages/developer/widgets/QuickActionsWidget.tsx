import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Plus, LayoutDashboard, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants';

const QUICK_ACTIONS = [
  { label: 'Add New Course', icon: <Plus className="w-4 h-4 mr-2" />, path: ROUTES.DEVELOPER.CMS.COURSES },
  { label: 'Upload Media', icon: <Plus className="w-4 h-4 mr-2" />, path: ROUTES.DEVELOPER.CMS.MEDIA },
  { label: 'Edit Homepage', icon: <LayoutDashboard className="w-4 h-4 mr-2" />, path: ROUTES.DEVELOPER.CMS.HOMEPAGE },
  { label: 'Site Settings', icon: <Settings className="w-4 h-4 mr-2" />, path: ROUTES.DEVELOPER.SETTINGS },
];

export function QuickActionsWidget() {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="border-b border-border bg-surface/50">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex flex-col gap-3">
        {QUICK_ACTIONS.map((action, index) => (
          <Button key={index} variant="outline" className="w-full justify-start h-12" asChild>
            <Link to={action.path}>
              {action.icon}
              {action.label}
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
