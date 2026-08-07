import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { FadeIn } from '../../components/animations/FadeIn';
import { Plus, Search, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { type GalleryContent } from '../../types/cms';
import { galleryRepository } from '../../repositories/cms';
import { SectionEditor } from '../../components/cms/SectionEditor';
import { MediaSelector } from '../../components/cms/MediaSelector';

export default function DeveloperGallery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<GalleryContent[]>([]);
  
  const [editingItem, setEditingItem] = useState<Partial<GalleryContent> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = galleryRepository.listenAll((docs) => {
      setData(docs);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!editingItem?.title || !editingItem?.category || !editingItem?.imageUrl) {
      alert('Title, Category, and Media URL are required.');
      return;
    }
    setIsSaving(true);
    try {
      if (editingItem.id) {
        await galleryRepository.update(editingItem.id, editingItem);
      } else {
        const payload = {
          ...editingItem,
          isActive: editingItem.isActive !== undefined ? editingItem.isActive : true,
        };
        await galleryRepository.create(payload as Omit<GalleryContent, 'id'>);
      }
      setEditingItem(null);
    } catch (e) {
      console.error(e);
      alert('Failed to save gallery item.');
    } finally {
      setIsSaving(false);
    }
  };

  const columns: Column<GalleryContent>[] = [
    { 
      header: 'Preview', 
      accessorKey: 'imageUrl',
      cell: (item) => (
         <img loading="lazy" src={item.imageUrl} alt={item.title} className="w-12 h-12 object-cover rounded" />
      )
    },
    { header: 'Title', accessorKey: 'title' },
    { header: 'Category', accessorKey: 'category' },
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
            if(window.confirm('Delete media?')) galleryRepository.delete(item.id as string);
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
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Gallery
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Media'}
          </Button>
        </div>

        <SectionEditor title="Media Details" defaultOpen>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
               <MediaSelector 
                 label="Upload Image" 
                 value={editingItem.imageUrl || ''} 
                 onChange={v => setEditingItem({...editingItem, imageUrl: v})} 
                 type="image"
               />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Title *</label>
              <Input value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Category *</label>
              <Input value={editingItem.category || ''} placeholder="e.g. Campus, Events, Alumni" onChange={e => setEditingItem({...editingItem, category: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Tags (comma separated)</label>
              <Input 
                 value={(editingItem.tags || []).join(', ')} 
                 onChange={e => setEditingItem({...editingItem, tags: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} 
              />
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
      </FadeIn>
    );
  }

  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FadeIn className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Gallery Management</h2>
          <p className="text-text-secondary">Upload and manage campus and event media.</p>
        </div>
        <Button onClick={() => setEditingItem({})}>
          <Plus className="w-4 h-4 mr-2" /> Add Media
        </Button>
      </div>

      <Card className="flex-1 flex flex-col border-border shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border bg-surface/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
            <Input 
              placeholder="Search gallery..." 
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
            emptyMessage="No gallery images found."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </FadeIn>
  );
}
