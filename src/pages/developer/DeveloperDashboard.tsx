import { FadeIn } from '../../components/animations/FadeIn';
import { StatWidgets } from './widgets/StatWidgets';
import { SystemHealthWidget } from './widgets/SystemHealthWidget';
import { QuickActionsWidget } from './widgets/QuickActionsWidget';

export default function DeveloperDashboard() {
  return (
    <FadeIn className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Overview</h2>
        <p className="text-text-secondary">Welcome to the MR Institute Developer Management Panel.</p>
      </div>

      <StatWidgets />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SystemHealthWidget />
        <QuickActionsWidget />
      </div>
    </FadeIn>
  );
}
