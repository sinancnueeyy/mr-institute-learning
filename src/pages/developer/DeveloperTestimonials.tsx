import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { FadeIn } from '../../components/animations/FadeIn';
import { Plus, Edit2, Trash2, Search, Star } from 'lucide-react';
import { type TestimonialContent } from '../../types/cms';
import { testimonialsRepository } from '../../repositories/cms';
import { Dialog } from '../../components/ui/Dialog';
import { MediaSelector } from '../../components/cms/MediaSelector';

export default function DeveloperTestimonials() {
  const [data, setData] = useState<TestimonialContent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<TestimonialContent> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const res = await testimonialsRepository.getAll();
      setData(res.data || []);
      setIsLoading(false);
    };
    fetch();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      await testimonialsRepository.delete(id);
      setData(data.filter(i => i.id !== id));
    }
  };

  const handleSave = async () => {
    if (!editingItem?.studentName || !editingItem?.review) {
      alert('Please fill out Student Name and Review fields.');
      return;
    }

    setIsSaving(true);

    try {
      if (editingItem.id) {
        await testimonialsRepository.update(editingItem.id, editingItem);
        setData(data.map(i => i.id === editingItem.id ? { ...i, ...editingItem } as TestimonialContent : i));
      } else {
        const payload = {
          ...editingItem,
          course: editingItem.course || '',
          rating: editingItem.rating ?? 5,
          isActive: editingItem.isActive !== undefined ? editingItem.isActive : true,
          isFeatured: editingItem.isFeatured || false,
          order: editingItem.order ?? data.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const res = await testimonialsRepository.create(payload as Omit<TestimonialContent, 'id'>);
        if (res.data) setData([...data, res.data]);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (e) {
      console.error(e);
      alert('Failed to save testimonial. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          className={`w-3.5 h-3.5 ${n <= rating ? 'text-warning fill-warning' : 'text-border'}`}
        />
      ))}
    </div>
  );

  const columns: Column<TestimonialContent>[] = [
    {
      header: 'Student',
      accessorKey: 'studentName',
      cell: (item) => (
        <div className="flex items-center gap-3">
          {item.image && (
            <img
              src={item.image}
              alt={item.studentName}
              className="w-8 h-8 rounded-full object-cover border border-border shrink-0"
            />
          )}
          <span className="font-medium text-text-primary">{item.studentName}</span>
        </div>
      ),
    },
    { header: 'Course', accessorKey: 'course' },
    {
      header: 'Rating',
      accessorKey: 'rating',
      cell: (item) => <StarRating rating={item.rating} />,
    },
    {
      header: 'Featured',
      accessorKey: 'isFeatured',
      cell: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.isFeatured ? 'bg-brand-primary/10 text-brand-primary' : 'bg-surface text-text-muted'}`}>
          {item.isFeatured ? 'Featured' : 'Standard'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.isActive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (item) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-error"
            onClick={() => handleDelete(item.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const filteredData = data.filter(item =>
    item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FadeIn className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Testimonials</h2>
          <p className="text-text-secondary">Manage student success stories displayed on the public website.</p>
        </div>
        <Button onClick={() => { setEditingItem({ rating: 5, isActive: true, isFeatured: false, order: data.length }); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Testimonial
        </Button>
      </div>

      <Card className="flex-1 flex flex-col border-border shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border bg-surface/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
            <Input
              placeholder="Search by name or course..."
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
            emptyMessage="No testimonials found. Add one to get started."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem?.id ? 'Edit Testimonial' : 'Add Testimonial'}
      >
        {editingItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Student Name *</label>
                <Input
                  value={editingItem.studentName || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, studentName: e.target.value })}
                  placeholder="e.g. Sarah Ahmed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Course</label>
                <Input
                  value={editingItem.course || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, course: e.target.value })}
                  placeholder="e.g. Advanced Mathematics"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Review *</label>
              <textarea
                className="w-full bg-surface border border-border rounded-md px-4 py-3 text-sm focus:ring-4 focus:ring-brand-primary/20 focus:outline-none min-h-[100px] resize-y"
                value={editingItem.review || ''}
                onChange={(e) => setEditingItem({ ...editingItem, review: e.target.value })}
                placeholder="Student's testimonial text..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Rating (1–5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, rating: n })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${n <= (editingItem.rating ?? 5) ? 'text-warning fill-warning' : 'text-border hover:text-warning/50'}`}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-text-secondary ml-1">{editingItem.rating ?? 5}/5</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Display Order</label>
                <Input
                  type="number"
                  min={0}
                  value={editingItem.order ?? 0}
                  onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value, 10) || 0 })}
                />
              </div>
            </div>

            <MediaSelector
              label="Student Photo (Optional)"
              value={editingItem.image || ''}
              onChange={(url) => setEditingItem({ ...editingItem, image: url })}
              type="image"
            />

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingItem.isFeatured || false}
                  onChange={(e) => setEditingItem({ ...editingItem, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-brand-primary rounded"
                />
                <span className="text-sm font-semibold">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingItem.isActive !== false}
                  onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                  className="w-4 h-4 text-brand-primary rounded"
                />
                <span className="text-sm font-semibold">Active (visible on website)</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : (editingItem.id ? 'Update' : 'Add Testimonial')}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </FadeIn>
  );
}
