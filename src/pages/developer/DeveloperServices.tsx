import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { FadeIn } from '../../components/animations/FadeIn';
import { Plus, Search, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { type ServiceContent } from '../../types/cms';
import { servicesRepository } from '../../repositories/cms';
import { SectionEditor } from '../../components/cms/SectionEditor';
import { SeoEditor } from '../../components/cms/SeoEditor';
import { SortableList } from '../../components/cms/SortableList';
import { RichTextEditor } from '../../components/cms/RichTextEditor';
import { MediaSelector } from '../../components/cms/MediaSelector';

export default function DeveloperServices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ServiceContent[]>([]);
  
  const [editingItem, setEditingItem] = useState<Partial<ServiceContent> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = servicesRepository.listenAll((docs) => {
      // Sort by order by default
      const sorted = [...docs].sort((a, b) => (a.order || 0) - (b.order || 0));
      setData(sorted);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!editingItem?.title) {
      alert('Title is required.');
      return;
    }
    setIsSaving(true);
    try {
      if (editingItem.id) {
        await servicesRepository.update(editingItem.id, editingItem);
      } else {
        const payload = {
          ...editingItem,
          isActive: editingItem.isActive !== undefined ? editingItem.isActive : true,
          benefits: editingItem.benefits || [],
          order: editingItem.order || data.length,
        };
        await servicesRepository.create(payload as Omit<ServiceContent, 'id'>);
      }
      setEditingItem(null);
    } catch (e) {
      console.error(e);
      alert('Failed to save service.');
    } finally {
      setIsSaving(false);
    }
  };

  const columns: Column<ServiceContent>[] = [
    { header: 'Title', accessorKey: 'title' },
    { header: 'Icon', accessorKey: 'iconName' },
    { header: 'Order', accessorKey: 'order' },
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
          <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}><Edit2 className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" className="text-error border-error/20 hover:bg-error/10" onClick={() => {
            if(window.confirm('Delete service?')) servicesRepository.delete(item.id as string);
          }}><Trash2 className="w-4 h-4" /></Button>
        </div>
      )
    }
  ];

  if (editingItem) {
    return (
      <FadeIn className="space-y-6 max-w-4xl pb-20">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setEditingItem(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Service'}
          </Button>
        </div>

        <SectionEditor title="Basic Information" defaultOpen>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Service Title *</label>
              <Input value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Icon (Lucide Name)</label>
              <Input value={editingItem.iconName || ''} onChange={e => setEditingItem({...editingItem, iconName: e.target.value})} />
            </div>
            <div className="col-span-2">
               <RichTextEditor 
                 label="Description" 
                 value={editingItem.description || ''} 
                 onChange={v => setEditingItem({...editingItem, description: v})} 
               />
            </div>
            <div className="col-span-2">
               <MediaSelector 
                 label="Banner Image (Optional)" 
                 value={editingItem.image || ''} 
                 onChange={v => setEditingItem({...editingItem, image: v})} 
               />
            </div>
          </div>
        </SectionEditor>

        <SectionEditor title="Details & CTAs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Eligibility / Target Audience</label>
              <Input value={editingItem.eligibility || ''} onChange={e => setEditingItem({...editingItem, eligibility: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Display Order</label>
              <Input type="number" value={editingItem.order || 0} onChange={e => setEditingItem({...editingItem, order: parseInt(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">CTA Text</label>
              <Input value={editingItem.ctaText || ''} onChange={e => setEditingItem({...editingItem, ctaText: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">CTA Link</label>
              <Input value={editingItem.ctaLink || ''} onChange={e => setEditingItem({...editingItem, ctaLink: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2 mt-4 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={editingItem.isActive !== false} 
                  onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary rounded"
                />
                <span className="text-sm font-semibold">Active (Visible to public)</span>
              </label>
            </div>
          </div>
        </SectionEditor>

        <SectionEditor title="Benefits">
          <Button variant="outline" size="sm" className="mb-4" onClick={() => setEditingItem({ ...editingItem, benefits: [...(editingItem.benefits || []), ''] })}>
            Add Benefit
          </Button>
          <SortableList 
            items={editingItem.benefits || []}
            onReorder={(newVals) => setEditingItem({ ...editingItem, benefits: newVals })}
            onRemove={(idx) => setEditingItem({ ...editingItem, benefits: (editingItem.benefits || []).filter((_, i) => i !== idx) })}
            renderItem={(item, index) => (
              <Input 
                value={item} 
                onChange={e => {
                  const newF = [...(editingItem.benefits || [])];
                  newF[index] = e.target.value;
                  setEditingItem({ ...editingItem, benefits: newF });
                }} 
              />
            )}
          />
        </SectionEditor>

        <SectionEditor title="SEO Settings">
          <SeoEditor 
            seo={editingItem.seo}
            onChange={(seo) => setEditingItem({ ...editingItem, seo })}
          />
        </SectionEditor>
      </FadeIn>
    );
  }

  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FadeIn className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Services Management</h2>
          <p className="text-text-secondary">Manage and organize your services.</p>
        </div>
        <Button onClick={() => setEditingItem({})}>
          <Plus className="w-4 h-4 mr-2" /> Add New Service
        </Button>
      </div>

      <Card className="flex-1 flex flex-col border-border shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border bg-surface/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
            <Input 
              placeholder="Search services..." 
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
            emptyMessage="No services available."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </FadeIn>
  );
}
