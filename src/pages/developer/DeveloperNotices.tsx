import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { FadeIn } from '../../components/animations/FadeIn';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { type NoticeContent } from '../../types/cms';
import { noticesRepository } from '../../repositories/cms';
import { Dialog } from '../../components/ui/Dialog';
import { RichTextEditor } from '../../components/cms/RichTextEditor';
import { MediaSelector } from '../../components/cms/MediaSelector';

export default function DeveloperNotices() {
  const [data, setData] = useState<NoticeContent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<NoticeContent> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const res = await noticesRepository.getAll();
      setData(res.data || []);
      setIsLoading(false);
    };
    fetch();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      await noticesRepository.delete(id);
      setData(data.filter(i => i.id !== id));
    }
  };

  const handleSave = async () => {
    if (!editingItem?.title || !editingItem?.type) {
      alert('Please fill out all required fields');
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (editingItem.id) {
        await noticesRepository.update(editingItem.id, editingItem);
        setData(data.map(i => i.id === editingItem.id ? { ...i, ...editingItem } as NoticeContent : i));
      } else {
        const payload = {
          ...editingItem,
          publishDate: editingItem.publishDate || new Date().toISOString(),
          isActive: editingItem.isActive !== undefined ? editingItem.isActive : true,
          isFeatured: editingItem.isFeatured || false,
          priority: editingItem.priority || 'medium',
        };
        const res = await noticesRepository.create(payload as Omit<NoticeContent, 'id'>);
        if (res.data) setData([...data, res.data]);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (e) {
      console.error(e);
      alert('Failed to save notice');
    } finally {
      setIsSaving(false);
    }
  };

  const columns: Column<NoticeContent>[] = [
    { header: 'Title', accessorKey: 'title' },
    { header: 'Type', accessorKey: 'type', cell: (item) => <span className="capitalize">{item.type}</span> },
    { header: 'Priority', accessorKey: 'priority', cell: (item) => <span className="capitalize">{item.priority}</span> },
    { header: 'Status', accessorKey: 'isActive', cell: (item) => (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.isActive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
        {item.isActive ? 'Active' : 'Inactive'}
      </span>
    )},
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (item) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { setEditingItem(item); setIsModalOpen(true); }}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-error" onClick={() => handleDelete(item.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FadeIn className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Notices & Announcements</h2>
          <p className="text-text-secondary">Manage news, updates, and general notices.</p>
        </div>
        <Button onClick={() => { setEditingItem({ type: 'announcement', priority: 'medium' }); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Create Notice
        </Button>
      </div>

      <Card className="flex-1 flex flex-col border-border shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border bg-surface/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
            <Input 
              placeholder="Search notices..." 
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
            emptyMessage="No notices found."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <Dialog 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingItem?.id ? 'Edit Notice' : 'Create Notice'}
      >
        {editingItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Title *</label>
                <Input 
                  value={editingItem.title || ''} 
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Type *</label>
                <select 
                  className="w-full bg-surface border border-border rounded-md px-4 py-3 text-sm focus:ring-4 focus:ring-brand-primary/20"
                  value={editingItem.type || 'announcement'}
                  onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as any })}
                >
                  <option value="announcement">Announcement</option>
                  <option value="news">News</option>
                  <option value="exam">Exam Notification</option>
                  <option value="scholarship">Scholarship</option>
                  <option value="holiday">Holiday</option>
                  <option value="event">Event</option>
                </select>
              </div>
            </div>

            <RichTextEditor 
              label="Description"
              value={editingItem.description || ''}
              onChange={(val) => setEditingItem({ ...editingItem, description: val })}
            />

            <MediaSelector 
              label="Attachment URL (Optional)"
              value={editingItem.attachmentUrl || ''}
              onChange={(url) => setEditingItem({ ...editingItem, attachmentUrl: url })}
              type="document"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Priority</label>
                <select 
                  className="w-full bg-surface border border-border rounded-md px-4 py-3 text-sm focus:ring-4 focus:ring-brand-primary/20"
                  value={editingItem.priority || 'medium'}
                  onChange={(e) => setEditingItem({ ...editingItem, priority: e.target.value as any })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={editingItem.isActive !== false} 
                    onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                    className="w-4 h-4 text-brand-primary rounded"
                  />
                  <span className="text-sm font-semibold">Active</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </FadeIn>
  );
}
