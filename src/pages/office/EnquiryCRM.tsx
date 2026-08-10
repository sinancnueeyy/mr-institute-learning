import { useState, useEffect } from 'react';
import { FadeIn } from '../../components/animations/FadeIn';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { Drawer } from '../../components/ui/Drawer';
import { FilterPanel } from '../../components/office/FilterPanel';
import { StatusBadge, type StatusType } from '../../components/office/StatusBadge';
import { WorkflowTimeline } from '../../components/office/WorkflowTimeline';
import { ConfirmationDialog } from '../../components/office/ConfirmationDialog';
import { ExportDialog } from '../../components/office/ExportDialog';
import { enquiriesRepository } from '../../repositories/operations';
import type { Enquiry } from '../../types/operations';
import { Eye, Download, Check, Phone, Mail, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Textarea } from '../../components/ui/Textarea';

export default function EnquiryCRM() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<{ id: string, newStatus: string } | null>(null);

  const [followUpNote, setFollowUpNote] = useState('');
  const [followUps, setFollowUps] = useState<any[]>([]);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await enquiriesRepository.getAll();
      setEnquiries(res.data || []);
    } catch (error) {
      console.error("Error fetching enquiries", error);
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!statusAction) return;
    try {
      await enquiriesRepository.update(statusAction.id, { 
        status: statusAction.newStatus as any,
      });
      toast.success('Status updated successfully');
      fetchEnquiries();
      
      if (selectedEnquiry && selectedEnquiry.id === statusAction.id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: statusAction.newStatus as any });
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

  const handleAddFollowUp = () => {
    if (!followUpNote.trim()) return;
    
    // In a real implementation this would be saved via a followUpRepository
    const newFollowUp = {
      id: Date.now().toString(),
      title: 'Follow-up Note',
      description: followUpNote,
      date: new Date().toISOString(),
      status: 'completed',
      icon: 'message'
    };
    
    setFollowUps([newFollowUp, ...followUps]);
    setFollowUpNote('');
    toast.success('Follow-up note added');
  };

  const mapStatus = (rawStatus: string): StatusType => {
    const map: Record<string, string> = {
      'new': 'New',
      'read': 'Contacted',
      'resolved': 'Closed'
    };
    return map[rawStatus] || rawStatus;
  };

  const filteredEnquiries = enquiries.filter(enq => {
    const matchesSearch = enq.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          enq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          enq.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { 
      accessorKey: 'name', 
      header: 'Enquirer',
      cell: (item: Enquiry) => (
        <div>
          <p className="font-medium text-text-primary">{item.name}</p>
          <p className="text-xs text-text-muted flex items-center gap-1">
            <Mail className="w-3 h-3" /> {item.email}
          </p>
        </div>
      )
    },
    { 
      accessorKey: 'subject', 
      header: 'Subject',
      cell: (item: Enquiry) => (
        <div>
          <p className="text-sm font-medium">{item.subject}</p>
          <p className="text-xs text-text-muted truncate max-w-[200px]">{item.message}</p>
        </div>
      )
    },
    { 
      accessorKey: 'createdAt', 
      header: 'Date',
      cell: (item: Enquiry) => <span className="text-sm">{new Date(item.createdAt).toLocaleDateString()}</span>
    },
    { 
      accessorKey: 'status', 
      header: 'Status',
      cell: (item: Enquiry) => <StatusBadge status={mapStatus(item.status)} />
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (item: Enquiry) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => { 
              setSelectedEnquiry(item); 
              setIsDrawerOpen(true);
              setFollowUps([]); // Reset for mock
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <FadeIn className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Enquiries CRM</h1>
          <p className="text-text-secondary">Manage and respond to website enquiries.</p>
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
        searchPlaceholder="Search by name, email or subject..."
        statusOptions={[
          { label: 'All Statuses', value: 'all' },
          { label: 'New', value: 'new' },
          { label: 'Contacted', value: 'read' },
          { label: 'Closed / Resolved', value: 'resolved' }
        ]}
      />

      <div className="bg-white rounded-md border border-border overflow-hidden">
        <DataTable 
          data={filteredEnquiries}
          columns={columns}
          keyExtractor={(item) => item.id}
          isLoading={loading}
          emptyMessage="No enquiries found matching your criteria."
        />
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Enquiry Details"
      >
        {selectedEnquiry && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-text-primary">{selectedEnquiry.name}</h2>
                <div className="flex items-center gap-4 mt-2 text-text-secondary text-sm">
                  <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {selectedEnquiry.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {selectedEnquiry.phone}</span>
                </div>
              </div>
              <StatusBadge status={mapStatus(selectedEnquiry.status)} />
            </div>

            <div className="bg-surface p-6 rounded-md border border-border">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-text-primary">Subject: {selectedEnquiry.subject}</p>
                <p className="text-sm text-text-muted">{new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded border border-border text-sm leading-relaxed whitespace-pre-wrap">
                {selectedEnquiry.message}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-text-primary border-b border-border pb-2">Update Status</h3>
              <div className="flex flex-wrap gap-3">
                {selectedEnquiry.status === 'new' && (
                  <Button onClick={() => promptStatusChange(selectedEnquiry.id, 'read')} className="bg-info hover:bg-info/90 text-white">
                    <Check className="w-4 h-4 mr-2" /> Mark as Contacted
                  </Button>
                )}
                {selectedEnquiry.status !== 'resolved' && (
                  <Button onClick={() => promptStatusChange(selectedEnquiry.id, 'resolved')} className="bg-success hover:bg-success/90 text-white">
                    <Check className="w-4 h-4 mr-2" /> Mark Resolved
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="font-bold text-text-primary">Follow-up Notes</h3>
              
              <div className="bg-surface p-4 rounded-md border border-border space-y-3">
                <Textarea 
                  placeholder="Type a new internal note or follow-up summary..."
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button size="sm" onClick={handleAddFollowUp}>
                    <Save className="w-4 h-4 mr-2" /> Save Note
                  </Button>
                </div>
              </div>

              <div className="pt-4">
                <WorkflowTimeline 
                  events={[
                    ...followUps,
                    {
                      id: '1',
                      title: 'Enquiry Received',
                      date: selectedEnquiry.createdAt,
                      status: 'completed',
                      icon: 'message'
                    }
                  ]}
                />
              </div>
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
        variant="info"
      />

      <ExportDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExportCSV={() => toast.success('Exporting CSV...')}
        onPrint={() => window.print()}
      />
    </FadeIn>
  );
}
