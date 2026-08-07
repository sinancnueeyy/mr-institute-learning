import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { FadeIn } from '../../components/animations/FadeIn';
import { Search, Download, Eye } from 'lucide-react';
import { type FormSubmission } from '../../types/operations';
import { formSubmissionsRepository } from '../../repositories/operations/formSubmissionsRepository';
import { Dialog } from '../../components/ui/Dialog';

export default function DeveloperFormSubmissions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<FormSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);

  useEffect(() => {
    const unsubscribe = formSubmissionsRepository.listenAll((docs) => {
      setData(docs);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'info';
      case 'under_review': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'secondary';
    }
  };

  const columns: Column<FormSubmission>[] = [
    { header: 'Form Title', accessorKey: 'formTitle' },
    { header: 'Type', accessorKey: 'formType', cell: (item) => <span className="uppercase text-xs font-bold">{item.formType}</span> },
    { 
      header: 'Submitted', 
      accessorKey: 'submittedAt', 
      cell: (item) => new Date(item.submittedAt).toLocaleDateString()
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item) => (
        <Badge variant={getStatusColor(item.status) as any}>
          {item.status.replace('_', ' ').toUpperCase()}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (item) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(item)}>
            <Eye className="w-4 h-4 mr-2" /> View
          </Button>
        </div>
      )
    }
  ];

  const filteredData = data.filter(sub => 
    sub.formTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.formType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FadeIn className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Form Submissions</h2>
          <p className="text-text-secondary">View and manage all dynamic form submissions.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col border-border shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border bg-surface/30">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
              <Input 
                placeholder="Search submissions..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-auto">
          <DataTable 
            data={filteredData}
            columns={columns}
            keyExtractor={(item) => item.id}
            emptyMessage="No submissions found."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* View Submission Modal */}
      <Dialog
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        title={selectedSubmission ? `${selectedSubmission.formTitle} Submission` : ''}
      >
        {selectedSubmission && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface p-4 rounded-lg">
                <p className="text-sm text-text-secondary">Submitted At</p>
                <p className="font-semibold">{new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
              </div>
              <div className="bg-surface p-4 rounded-lg">
                <p className="text-sm text-text-secondary">Status</p>
                <Badge variant={getStatusColor(selectedSubmission.status) as any} className="mt-1">
                  {selectedSubmission.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b pb-2">Submitted Data</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(selectedSubmission.data).map(([key, value]) => (
                  <div key={key} className="p-3 border rounded-lg">
                    <p className="text-xs text-text-muted font-mono mb-1">{key}</p>
                    <p className="font-medium">
                      {Array.isArray(value) ? value.join(', ') : (value !== null && typeof value === 'object' ? JSON.stringify(value) : String(value || '-'))}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {selectedSubmission.files && selectedSubmission.files.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg border-b pb-2">Attached Files</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedSubmission.files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-semibold">{file.fieldName}</p>
                        <p className="text-xs text-text-muted">{file.fileName}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={file.url} target="_blank" rel="noopener noreferrer">View</a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </FadeIn>
  );
}
