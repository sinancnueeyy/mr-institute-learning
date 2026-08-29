import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { FadeIn } from '../../components/animations/FadeIn';
import { Search, Activity, Shield } from 'lucide-react';
import { type ActivityLog, type ActivityAction } from '../../types/system';
import { activityLogRepository } from '../../repositories/system/activityLogRepository';

const ACTION_COLORS: Record<ActivityAction, string> = {
  CREATE:  'bg-success/10 text-success',
  UPDATE:  'bg-info/10 text-info',
  DELETE:  'bg-error/10 text-error',
  LOGIN:   'bg-brand-primary/10 text-brand-primary',
  LOGOUT:  'bg-surface text-text-muted',
  PUBLISH: 'bg-success/10 text-success',
  APPROVE: 'bg-success/10 text-success',
  REJECT:  'bg-error/10 text-error',
};

const ALL_ACTIONS: ActivityAction[] = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'PUBLISH', 'APPROVE', 'REJECT'];

export default function DeveloperActivityLogs() {
  const [data, setData] = useState<ActivityLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<ActivityAction | ''>('');
  const [filterModule, setFilterModule] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await activityLogRepository.getRecentLogs(200);
      setData(res.data || []);
      setIsLoading(false);
    };
    fetchLogs();
  }, []);

  const uniqueModules = Array.from(new Set(data.map(l => l.module))).sort();

  const filteredData = data.filter(item => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = filterAction ? item.action === filterAction : true;
    const matchesModule = filterModule ? item.module === filterModule : true;
    return matchesSearch && matchesAction && matchesModule;
  });

  const formatTimestamp = (item: ActivityLog) => {
    const raw = item.timestamp || (item as any).createdAt || (item as any).created_at;
    if (!raw) return '—';
    try {
      const d = new Date(raw);
      if (isNaN(d.getTime())) return String(raw);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return String(raw);
    }
  };

  const columns: Column<ActivityLog>[] = [
    {
      header: 'Timestamp',
      accessorKey: 'timestamp',
      cell: (item) => (
        <span className="text-xs text-text-secondary whitespace-nowrap font-mono">
          {formatTimestamp(item)}
        </span>
      ),
    },
    {
      header: 'User',
      accessorKey: 'userEmail',
      cell: (item) => (
        <div>
          <p className="text-sm font-medium text-text-primary">{item.userEmail}</p>
          <p className="text-xs text-text-muted">{item.role}</p>
        </div>
      ),
    },
    {
      header: 'Module',
      accessorKey: 'module',
      cell: (item) => (
        <span className="text-xs bg-surface border border-border px-2 py-1 rounded font-mono">
          {item.module}
        </span>
      ),
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${ACTION_COLORS[item.action] || 'bg-surface text-text-muted'}`}>
          {item.action}
        </span>
      ),
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: (item) => (
        <span className="text-sm text-text-secondary max-w-xs truncate block">{item.description}</span>
      ),
    },
  ];

  return (
    <FadeIn className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Activity className="w-6 h-6 text-brand-primary" />
            Activity Logs
          </h2>
          <p className="text-text-secondary mt-1">
            Read-only audit trail of all administrative actions across all portals.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-info/10 text-info border border-info/20 rounded-lg px-3 py-2 text-sm font-medium shrink-0">
          <Shield className="w-4 h-4" />
          <span>Read-only — DEVELOPER access</span>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(['CREATE', 'UPDATE', 'DELETE', 'LOGIN'] as ActivityAction[]).map(action => {
          const count = data.filter(l => l.action === action).length;
          return (
            <Card key={action} className="border-border shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-muted font-semibold uppercase tracking-wide">{action}</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{count}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${ACTION_COLORS[action]}`}>{action}</span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="flex-1 flex flex-col border-border shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border bg-surface/30">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
              <Input
                placeholder="Search by description or email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="bg-surface border border-border rounded-md px-3 py-2.5 text-sm focus:ring-4 focus:ring-brand-primary/20 focus:outline-none"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value as ActivityAction | '')}
            >
              <option value="">All Actions</option>
              {ALL_ACTIONS.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <select
              className="bg-surface border border-border rounded-md px-3 py-2.5 text-sm focus:ring-4 focus:ring-brand-primary/20 focus:outline-none"
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
            >
              <option value="">All Modules</option>
              {uniqueModules.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-auto">
          <DataTable
            data={filteredData}
            columns={columns}
            keyExtractor={(item) => item.id}
            emptyMessage={isLoading ? 'Loading logs...' : 'No activity logs match your filter.'}
            isLoading={isLoading}
          />
        </CardContent>
        {!isLoading && (
          <div className="px-6 py-3 border-t border-border bg-surface/30 text-xs text-text-muted">
            Showing {filteredData.length} of {data.length} log entries (latest 200)
          </div>
        )}
      </Card>
    </FadeIn>
  );
}
