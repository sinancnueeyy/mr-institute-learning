import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { FadeIn } from '../../components/animations/FadeIn';
import { Save } from 'lucide-react';
import { type AboutContent } from '../../types/cms';
import { aboutRepository } from '../../repositories/cms';
import { SectionEditor } from '../../components/cms/SectionEditor';
import { SeoEditor } from '../../components/cms/SeoEditor';
import { SortableList } from '../../components/cms/SortableList';
import { RichTextEditor } from '../../components/cms/RichTextEditor';
import { MediaSelector } from '../../components/cms/MediaSelector';

export default function DeveloperAbout() {
  const [data, setData] = useState<Partial<AboutContent>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const res = await aboutRepository.getById('main');
      if (res.data) {
        setData(res.data);
      } else {
        setData({ 
          id: 'main', 
          isActive: true, 
          values: [], 
          timeline: [], 
          achievements: [], 
          infrastructure: [],
          stats: [],
          teamMembers: []
        });
      }
      setIsLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await aboutRepository.update('main', data);
      alert('About page saved successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to save.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <FadeIn className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">About Page CMS</h2>
          <p className="text-text-secondary">Manage the institute's story, mission, and leadership messages.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Saving...' : 'Publish Changes'}
        </Button>
      </div>

      <div className="space-y-6 max-w-4xl pb-20">
        <SectionEditor title="Institute Overview" defaultOpen>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Page Title</label>
              <Input value={data.title || ''} onChange={e => setData({...data, title: e.target.value})} />
            </div>
            <RichTextEditor 
              label="Our Story" 
              value={data.story || ''} 
              onChange={v => setData({...data, story: v})} 
            />
            <RichTextEditor 
              label="Mission" 
              value={data.mission || ''} 
              onChange={v => setData({...data, mission: v})} 
            />
            <RichTextEditor 
              label="Vision" 
              value={data.vision || ''} 
              onChange={v => setData({...data, vision: v})} 
            />
          </div>
        </SectionEditor>

        <SectionEditor title="Core Values">
          <Button 
            variant="outline" size="sm" className="mb-4"
            onClick={() => setData({ ...data, values: [...(data.values || []), { title: '', description: '' }] })}
          >
            Add Value
          </Button>
          <SortableList 
            items={data.values || []}
            onReorder={(newVals) => setData({ ...data, values: newVals })}
            onRemove={(idx) => setData({ ...data, values: (data.values || []).filter((_, i) => i !== idx) })}
            renderItem={(item, index) => (
              <div className="grid grid-cols-1 gap-4">
                <Input 
                  placeholder="Value Title (e.g. Excellence)" 
                  value={item.title} 
                  onChange={e => {
                    const newF = [...(data.values || [])];
                    newF[index].title = e.target.value;
                    setData({ ...data, values: newF });
                  }} 
                />
                <Input 
                  placeholder="Description" 
                  value={item.description} 
                  onChange={e => {
                    const newF = [...(data.values || [])];
                    newF[index].description = e.target.value;
                    setData({ ...data, values: newF });
                  }} 
                />
                <Input 
                  placeholder="Icon (lucide name)" 
                  value={item.icon || ''} 
                  onChange={e => {
                    const newF = [...(data.values || [])];
                    newF[index].icon = e.target.value;
                    setData({ ...data, values: newF });
                  }} 
                />
              </div>
            )}
          />
        </SectionEditor>

        <SectionEditor title="Leadership Messages">
          <div className="space-y-8">
             <div>
                <h4 className="font-bold mb-4">Chairman's Message</h4>
                <div className="space-y-4">
                  <Input 
                    placeholder="Name" 
                    value={data.chairmanMessage?.name || ''} 
                    onChange={e => setData({...data, chairmanMessage: {...data.chairmanMessage, name: e.target.value} as any})} 
                  />
                  <RichTextEditor 
                    value={data.chairmanMessage?.message || ''} 
                    onChange={v => setData({...data, chairmanMessage: {...data.chairmanMessage, message: v} as any})} 
                  />
                  <MediaSelector 
                    label="Chairman Photo" 
                    value={data.chairmanMessage?.image || ''} 
                    onChange={v => setData({...data, chairmanMessage: {...data.chairmanMessage, image: v} as any})} 
                  />
                </div>
             </div>
             
             <div className="border-t border-border pt-8">
                <h4 className="font-bold mb-4">Principal's Message</h4>
                <div className="space-y-4">
                  <Input 
                    placeholder="Name" 
                    value={data.principalMessage?.name || ''} 
                    onChange={e => setData({...data, principalMessage: {...data.principalMessage, name: e.target.value} as any})} 
                  />
                  <RichTextEditor 
                    value={data.principalMessage?.message || ''} 
                    onChange={v => setData({...data, principalMessage: {...data.principalMessage, message: v} as any})} 
                  />
                  <MediaSelector 
                    label="Principal Photo" 
                    value={data.principalMessage?.image || ''} 
                    onChange={v => setData({...data, principalMessage: {...data.principalMessage, image: v} as any})} 
                  />
                </div>
             </div>
          </div>
        </SectionEditor>

        <SectionEditor title="Infrastructure / Facilities">
          <Button 
            variant="outline" size="sm" className="mb-4"
            onClick={() => setData({ ...data, infrastructure: [...(data.infrastructure || []), { title: '', description: '', image: '' }] })}
          >
            Add Facility
          </Button>
          <SortableList 
            items={data.infrastructure || []}
            onReorder={(newVals) => setData({ ...data, infrastructure: newVals })}
            onRemove={(idx) => setData({ ...data, infrastructure: (data.infrastructure || []).filter((_, i) => i !== idx) })}
            renderItem={(item, index) => (
              <div className="space-y-4">
                <Input 
                  placeholder="Facility Title" 
                  value={item.title} 
                  onChange={e => {
                    const newF = [...(data.infrastructure || [])];
                    newF[index].title = e.target.value;
                    setData({ ...data, infrastructure: newF });
                  }} 
                />
                <Input 
                  placeholder="Description" 
                  value={item.description} 
                  onChange={e => {
                    const newF = [...(data.infrastructure || [])];
                    newF[index].description = e.target.value;
                    setData({ ...data, infrastructure: newF });
                  }} 
                />
                <MediaSelector 
                  value={item.image} 
                  onChange={v => {
                    const newF = [...(data.infrastructure || [])];
                    newF[index].image = v;
                    setData({ ...data, infrastructure: newF });
                  }} 
                />
              </div>
            )}
          />
        </SectionEditor>

        <SectionEditor title="SEO Settings">
          <SeoEditor 
            seo={data.seo}
            onChange={(seo) => setData({ ...data, seo })}
          />
        </SectionEditor>
      </div>
    </FadeIn>
  );
}
