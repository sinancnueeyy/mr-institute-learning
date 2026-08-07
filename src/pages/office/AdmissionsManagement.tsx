import { useState, useEffect } from 'react';
import { FadeIn } from '../../components/animations/FadeIn';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { Drawer } from '../../components/ui/Drawer';
import { FilterPanel } from '../../components/office/FilterPanel';
import { StatusBadge, type StatusType } from '../../components/office/StatusBadge';
import { WorkflowTimeline } from '../../components/office/WorkflowTimeline';
import { DocumentPreview } from '../../components/office/DocumentPreview';
import { ConfirmationDialog } from '../../components/office/ConfirmationDialog';
import { ExportDialog } from '../../components/office/ExportDialog';
import { applicationsRepository } from '../../repositories/operations';
import type { Application } from '../../types/operations';
import { Eye, Download, MessageSquare, Check, X, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdmissionsManagement() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [isExportOpen, setIsExportOpen] = useState(false);
  
  // Status update
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<{ id: string, newStatus: string } | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationsRepository.getAll();
      setApplications(res.data || []);
    } catch (error) {
      console.error("Error fetching applications", error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!statusAction) return;
    try {
      await applicationsRepository.update(statusAction.id, { 
        status: statusAction.newStatus as any,
        updatedAt: new Date().toISOString()
      });
      toast.success('Status updated successfully');
      fetchApplications();
      
      if (selectedApp && selectedApp.id === statusAction.id) {
        setSelectedApp({ ...selectedApp, status: statusAction.newStatus as any });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    } finally {
      setIsConfirmOpen(false);
      setStatusAction(null);
    }
  };

  const promptStatusChange = (id: string, newStatus: string) => {
    setStatusAction({ id, newStatus });
    setIsConfirmOpen(true);
  };

  const mapStatus = (rawStatus: string): StatusType => {
    const map: Record<string, string> = {
      'pending': 'New',
      'under_review': 'Under Review',
      'accepted': 'Approved',
      'rejected': 'Rejected'
    };
    return map[rawStatus] || rawStatus;
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { 
      accessorKey: 'applicantName', 
      header: 'Applicant Name',
      cell: (item: Application) => (
        <div>
          <p className="font-medium text-text-primary">{item.applicantName}</p>
          <p className="text-xs text-text-muted">{item.email}</p>
        </div>
      )
    },
    { 
      accessorKey: 'courseId', 
      header: 'Course ID',
      cell: (item: Application) => <span className="font-mono text-sm">{item.courseId}</span>
    },
    { 
      accessorKey: 'submittedAt', 
      header: 'Applied On',
      cell: (item: Application) => <span className="text-sm">{new Date(item.submittedAt).toLocaleDateString()}</span>
    },
    { 
      accessorKey: 'status', 
      header: 'Status',
      cell: (item: Application) => <StatusBadge status={mapStatus(item.status)} />
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (item: Application) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => { setSelectedApp(item); setIsDrawerOpen(true); }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {item.status === 'pending' && (
            <Button variant="ghost" size="sm" onClick={() => promptStatusChange(item.id, 'under_review')} className="text-indigo-600">
              Review
            </Button>
          )}
        </div>
      )
    }
  ];

  const handleExportCSV = () => {
    toast.success('Exporting CSV...');
    // Real export logic here
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <FadeIn className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Admissions</h1>
          <p className="text-text-secondary">Process and review student applications.</p>
        </div>
        <Button variant="outline" onClick={() => setIsExportOpen(true)}>
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>

      <FilterPanel 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchPlaceholder="Search applicants by name or email..."
        statusOptions={[
          { label: 'All Statuses', value: 'all' },
          { label: 'New / Pending', value: 'pending' },
          { label: 'Under Review', value: 'under_review' },
          { label: 'Approved', value: 'accepted' },
          { label: 'Rejected', value: 'rejected' }
        ]}
      />

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <DataTable 
          data={filteredApps}
          columns={columns}
          keyExtractor={(item) => item.id}
          isLoading={loading}
          emptyMessage="No applications found matching your criteria."
        />
      </div>

      {/* Application Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Application Details"
      >
        {selectedApp && (
          <div className="space-y-8">
            {/* Header Info */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-text-primary">{selectedApp.applicantName}</h2>
                <p className="text-text-secondary">{selectedApp.email} • {selectedApp.phone}</p>
              </div>
              <StatusBadge status={mapStatus(selectedApp.status)} />
            </div>

            {/* Application Data */}
            <div className="grid grid-cols-2 gap-6 bg-surface p-6 rounded-xl border border-border">
              <div>
                <p className="text-sm text-text-muted mb-1">Course Applied</p>
                <p className="font-semibold text-text-primary">{selectedApp.courseId}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted mb-1">Application Date</p>
                <p className="font-semibold text-text-primary">{new Date(selectedApp.submittedAt).toLocaleString()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-text-muted mb-2">Attached Documents</p>
                {selectedApp.documents?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.documents.map((doc: string, idx: number) => (
                      <DocumentPreview key={idx} url={doc} title={`Document ${idx + 1}`} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-text-muted">No documents attached.</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <h3 className="font-bold text-text-primary border-b border-border pb-2">Update Status</h3>
              <div className="flex flex-wrap gap-3">
                {selectedApp.status === 'pending' && (
                  <Button onClick={() => promptStatusChange(selectedApp.id, 'under_review')} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Search className="w-4 h-4 mr-2" /> Start Review
                  </Button>
                )}
                {(selectedApp.status === 'pending' || selectedApp.status === 'under_review') && (
                  <>
                    <Button onClick={() => promptStatusChange(selectedApp.id, 'accepted')} className="bg-success hover:bg-success/90 text-white">
                      <Check className="w-4 h-4 mr-2" /> Approve
                    </Button>
                    <Button onClick={() => promptStatusChange(selectedApp.id, 'rejected')} className="bg-error hover:bg-error/90 text-white">
                      <X className="w-4 h-4 mr-2" /> Reject
                    </Button>
                  </>
                )}
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" /> Email Applicant
                </Button>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="font-bold text-text-primary">Application Timeline</h3>
              <WorkflowTimeline 
                events={[
                  {
                    id: '1',
                    title: 'Application Submitted',
                    date: selectedApp.submittedAt,
                    status: 'completed',
                    icon: 'check'
                  },
                  ...(selectedApp.status === 'under_review' ? [{
                    id: '2',
                    title: 'Review Started',
                    date: selectedApp.updatedAt,
                    status: 'current' as const,
                    icon: 'user' as const
                  }] : []),
                  ...(selectedApp.status === 'accepted' ? [{
                    id: '3',
                    title: 'Application Approved',
                    date: selectedApp.updatedAt,
                    status: 'completed' as const,
                    icon: 'check' as const
                  }] : []),
                  ...(selectedApp.status === 'rejected' ? [{
                    id: '3',
                    title: 'Application Rejected',
                    date: selectedApp.updatedAt,
                    status: 'completed' as const,
                    icon: 'x' as any
                  }] : [])
                ]}
              />
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleStatusChange}
        title="Update Status"
        description={`Are you sure you want to change the status to ${mapStatus(statusAction?.newStatus || '')}?`}
        confirmText="Yes, Update"
        variant={statusAction?.newStatus === 'rejected' ? 'danger' : 'info'}
      />

      <ExportDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExportCSV={handleExportCSV}
        onPrint={handlePrint}
      />
    </FadeIn>
  );
}
