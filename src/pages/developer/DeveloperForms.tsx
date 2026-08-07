import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { FadeIn } from '../../components/animations/FadeIn';
import { Plus, Edit2, Copy, Trash2, Search, LayoutList } from 'lucide-react';
import { type FormSchema } from '../../types/cms';
import { formsRepository } from '../../repositories/cms';
import { ROUTES } from '../../constants';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function DeveloperForms() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Mock data for UI representation
  const [data, setData] = useState<FormSchema[]>([]);

  useEffect(() => {
    const unsubscribe = formsRepository.listenAll((docs) => {
      setData(docs);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDuplicate = async (schema: FormSchema) => {
    try {
      const duplicate = { ...schema };
      duplicate.title = `${duplicate.title} (Copy)`;
      duplicate.id = '';
      await formsRepository.create(duplicate);
      toast.success('Form duplicated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to duplicate');
    }
  };

  const columns: Column<FormSchema>[] = [
    { header: 'Title', accessorKey: 'title' },
    { header: 'Type', accessorKey: 'type', cell: (item) => <span className="uppercase text-xs font-bold">{item.type}</span> },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: (item) => (
        <Badge variant={item.isActive ? 'success' : 'secondary'}>
          {item.isActive ? 'Active' : 'Draft'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (item) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" title="Submissions" onClick={() => navigate(ROUTES.DEVELOPER.CMS.FORM_SUBMISSIONS)}>
            <LayoutList className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" title="Edit" onClick={() => navigate(ROUTES.DEVELOPER.CMS.FORM_BUILDER.replace(':id', item.id))}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" title="Duplicate" onClick={() => handleDuplicate(item)}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-error border-error/20 hover:bg-error/10" title="Delete" onClick={() => {
            if(window.confirm('Are you sure you want to delete this form?')) {
              formsRepository.delete(item.id);
            }
          }}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  const filteredData = data.filter(form => 
    form.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    form.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FadeIn className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Dynamic Forms</h2>
          <p className="text-text-secondary">Manage and organize your dynamic forms.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(ROUTES.DEVELOPER.CMS.FORM_SUBMISSIONS)}>
            <LayoutList className="w-4 h-4 mr-2" /> View Submissions
          </Button>
          <Button onClick={() => navigate(ROUTES.DEVELOPER.CMS.FORM_BUILDER.replace(':id', 'new'))}>
            <Plus className="w-4 h-4 mr-2" /> Add New Form
          </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col border-border shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border bg-surface/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
            <Input 
              placeholder="Search..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-auto">
          <DataTable 
            data={filteredData}
            columns={columns}
            keyExtractor={(item) => item.id}
            emptyMessage="No forms created yet."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </FadeIn>
  );
}
