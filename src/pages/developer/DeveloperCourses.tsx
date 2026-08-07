import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { FadeIn } from '../../components/animations/FadeIn';
import { Plus, Search, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { type CourseContent } from '../../types/cms';
import { coursesRepository } from '../../repositories/cms';
import { SectionEditor } from '../../components/cms/SectionEditor';
import { SeoEditor } from '../../components/cms/SeoEditor';
import { SortableList } from '../../components/cms/SortableList';
import { RichTextEditor } from '../../components/cms/RichTextEditor';
import { MediaSelector } from '../../components/cms/MediaSelector';

export default function DeveloperCourses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<CourseContent[]>([]);
  
  const [editingItem, setEditingItem] = useState<Partial<CourseContent> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = coursesRepository.listenAll((docs) => {
      setData(docs);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!editingItem?.title || !editingItem?.category) {
      alert('Title and Category are required.');
      return;
    }
    setIsSaving(true);
    try {
      if (editingItem.id) {
        await coursesRepository.update(editingItem.id, editingItem);
      } else {
        const payload = {
          ...editingItem,
          isActive: editingItem.isActive !== undefined ? editingItem.isActive : true,
          highlights: editingItem.highlights || [],
          syllabus: editingItem.syllabus || [],
          faqs: editingItem.faqs || [],
          gallery: editingItem.gallery || [],
        };
        await coursesRepository.create(payload as Omit<CourseContent, 'id'>);
      }
      setEditingItem(null);
    } catch (e) {
      console.error(e);
      alert('Failed to save course.');
    } finally {
      setIsSaving(false);
    }
  };

  const columns: Column<CourseContent>[] = [
    { header: 'Title', accessorKey: 'title' },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Duration', accessorKey: 'duration' },
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
            if(window.confirm('Delete course?')) coursesRepository.delete(item.id as string);
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
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Course'}
          </Button>
        </div>

        <SectionEditor title="Basic Information" defaultOpen>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Course Title *</label>
              <Input value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Category *</label>
              <Input value={editingItem.category || ''} onChange={e => setEditingItem({...editingItem, category: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Duration</label>
              <Input value={editingItem.duration || ''} onChange={e => setEditingItem({...editingItem, duration: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Mode</label>
              <Input value={editingItem.mode || ''} onChange={e => setEditingItem({...editingItem, mode: e.target.value})} />
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
                 label="Primary Image" 
                 value={editingItem.image || ''} 
                 onChange={v => setEditingItem({...editingItem, image: v})} 
               />
            </div>
          </div>
        </SectionEditor>

        <SectionEditor title="Admission & Fees">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Eligibility</label>
              <Input value={editingItem.eligibility || ''} onChange={e => setEditingItem({...editingItem, eligibility: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Fees</label>
              <Input value={editingItem.fees || ''} onChange={e => setEditingItem({...editingItem, fees: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Admission Dates</label>
              <Input value={editingItem.admissionDates || ''} onChange={e => setEditingItem({...editingItem, admissionDates: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Batch Schedule</label>
              <Input value={editingItem.batchSchedule || ''} onChange={e => setEditingItem({...editingItem, batchSchedule: e.target.value})} />
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

        <SectionEditor title="Highlights & Syllabus">
          <div className="space-y-6">
            <div>
              <Button variant="outline" size="sm" className="mb-4" onClick={() => setEditingItem({ ...editingItem, highlights: [...(editingItem.highlights || []), ''] })}>
                Add Highlight
              </Button>
              <SortableList 
                items={editingItem.highlights || []}
                onReorder={(newVals) => setEditingItem({ ...editingItem, highlights: newVals })}
                onRemove={(idx) => setEditingItem({ ...editingItem, highlights: (editingItem.highlights || []).filter((_, i) => i !== idx) })}
                renderItem={(item, index) => (
                  <Input 
                    value={item} 
                    onChange={e => {
                      const newF = [...(editingItem.highlights || [])];
                      newF[index] = e.target.value;
                      setEditingItem({ ...editingItem, highlights: newF });
                    }} 
                  />
                )}
              />
            </div>
            
            <div className="border-t border-border pt-6">
              <Button variant="outline" size="sm" className="mb-4" onClick={() => setEditingItem({ ...editingItem, syllabus: [...(editingItem.syllabus || []), ''] })}>
                Add Syllabus Topic
              </Button>
              <SortableList 
                items={editingItem.syllabus || []}
                onReorder={(newVals) => setEditingItem({ ...editingItem, syllabus: newVals })}
                onRemove={(idx) => setEditingItem({ ...editingItem, syllabus: (editingItem.syllabus || []).filter((_, i) => i !== idx) })}
                renderItem={(item, index) => (
                  <Input 
                    value={item} 
                    onChange={e => {
                      const newF = [...(editingItem.syllabus || [])];
                      newF[index] = e.target.value;
                      setEditingItem({ ...editingItem, syllabus: newF });
                    }} 
                  />
                )}
              />
            </div>

            <div className="border-t border-border pt-6">
               <MediaSelector 
                 label="Syllabus/Brochure PDF Download" 
                 value={editingItem.syllabusPdf || ''} 
                 onChange={v => setEditingItem({...editingItem, syllabusPdf: v})} 
                 type="document"
               />
            </div>
          </div>
        </SectionEditor>

        <SectionEditor title="FAQs">
          <Button variant="outline" size="sm" className="mb-4" onClick={() => setEditingItem({ ...editingItem, faqs: [...(editingItem.faqs || []), { question: '', answer: '' }] })}>
            Add FAQ
          </Button>
          <SortableList 
            items={editingItem.faqs || []}
            onReorder={(newVals) => setEditingItem({ ...editingItem, faqs: newVals })}
            onRemove={(idx) => setEditingItem({ ...editingItem, faqs: (editingItem.faqs || []).filter((_, i) => i !== idx) })}
            renderItem={(item, index) => (
              <div className="space-y-2">
                <Input 
                  placeholder="Question"
                  value={item.question} 
                  onChange={e => {
                    const newF = [...(editingItem.faqs || [])];
                    newF[index].question = e.target.value;
                    setEditingItem({ ...editingItem, faqs: newF });
                  }} 
                />
                <Input 
                  placeholder="Answer"
                  value={item.answer} 
                  onChange={e => {
                    const newF = [...(editingItem.faqs || [])];
                    newF[index].answer = e.target.value;
                    setEditingItem({ ...editingItem, faqs: newF });
                  }} 
                />
              </div>
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
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FadeIn className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Courses Management</h2>
          <p className="text-text-secondary">Manage and organize your courses.</p>
        </div>
        <Button onClick={() => setEditingItem({})}>
          <Plus className="w-4 h-4 mr-2" /> Add New Course
        </Button>
      </div>

      <Card className="flex-1 flex flex-col border-border shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border bg-surface/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
            <Input 
              placeholder="Search courses..." 
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
            emptyMessage="No courses available."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </FadeIn>
  );
}
