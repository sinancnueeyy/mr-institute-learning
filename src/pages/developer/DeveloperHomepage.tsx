import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { FadeIn } from '../../components/animations/FadeIn';
import { Save, Eye, EyeOff } from 'lucide-react';
import { type HomepageContent } from '../../types/cms';
import { homepageRepository } from '../../repositories/cms';
import { SectionEditor } from '../../components/cms/SectionEditor';
import { SeoEditor } from '../../components/cms/SeoEditor';
import { MediaSelector } from '../../components/cms/MediaSelector';
import { SortableList } from '../../components/cms/SortableList';
import { RichTextEditor } from '../../components/cms/RichTextEditor';

export default function DeveloperHomepage() {
  const [data, setData] = useState<Partial<HomepageContent>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const res = await homepageRepository.getById('main');
      if (res.data) {
        setData(res.data);
      } else {
        // Init default if doesn't exist
        setData({ id: 'main', isActive: true, stats: [], features: [], partnerLogos: [], featuredCourseIds: [], featuredServiceIds: [] });
      }
      setIsLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await homepageRepository.update('main', data);
      alert('Homepage saved successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to save homepage.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <FadeIn className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Homepage CMS</h2>
          <p className="text-text-secondary">Manage the content and layout of the main landing page.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? <><EyeOff className="w-4 h-4 mr-2" /> Exit Preview</> : <><Eye className="w-4 h-4 mr-2" /> Live Preview</>}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Saving...' : 'Publish Changes'}
          </Button>
        </div>
      </div>

      <div className={`grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} gap-6 flex-1 h-full`}>
        {/* Editor Side */}
        <div className="space-y-6 overflow-y-auto pr-2 pb-20">
          <SectionEditor title="Hero Section" defaultOpen>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Headline</label>
                <Input value={data.heroHeadline || ''} onChange={e => setData({...data, heroHeadline: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Subheadline</label>
                <Input value={data.heroSubheadline || ''} onChange={e => setData({...data, heroSubheadline: e.target.value})} />
              </div>
              <RichTextEditor 
                label="Description" 
                value={data.heroDescription || ''} 
                onChange={v => setData({...data, heroDescription: v})} 
                rows={3}
              />
              <MediaSelector 
                label="Hero Background Image" 
                value={data.heroImage || ''} 
                onChange={v => setData({...data, heroImage: v})} 
              />
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <label className="text-sm font-semibold">Primary CTA Text</label>
                  <Input value={data.primaryCtaText || ''} onChange={e => setData({...data, primaryCtaText: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Primary CTA Link</label>
                  <Input value={data.primaryCtaLink || ''} onChange={e => setData({...data, primaryCtaLink: e.target.value})} />
                </div>
              </div>
            </div>
          </SectionEditor>

          <SectionEditor title="Announcement Bar">
             <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Announcement Text</label>
                  <Input value={data.announcementText || ''} onChange={e => setData({...data, announcementText: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Announcement Link</label>
                  <Input value={data.announcementLink || ''} onChange={e => setData({...data, announcementLink: e.target.value})} />
                </div>
             </div>
          </SectionEditor>

          <SectionEditor title="Why Choose Us (Features)">
            <Button 
              variant="outline" 
              size="sm" 
              className="mb-4"
              onClick={() => setData({ ...data, features: [...(data.features || []), { title: 'New Feature', description: '', icon: 'check' }] })}
            >
              Add Feature
            </Button>
            <SortableList 
              items={data.features || []}
              onReorder={(newFeatures) => setData({ ...data, features: newFeatures })}
              onRemove={(idx) => setData({ ...data, features: (data.features || []).filter((_, i) => i !== idx) })}
              renderItem={(item, index) => (
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    placeholder="Title" 
                    value={item.title} 
                    onChange={e => {
                      const newF = [...(data.features || [])];
                      newF[index].title = e.target.value;
                      setData({ ...data, features: newF });
                    }} 
                  />
                  <Input 
                    placeholder="Icon (lucide name)" 
                    value={item.icon} 
                    onChange={e => {
                      const newF = [...(data.features || [])];
                      newF[index].icon = e.target.value;
                      setData({ ...data, features: newF });
                    }} 
                  />
                  <div className="col-span-2">
                    <Input 
                      placeholder="Description" 
                      value={item.description} 
                      onChange={e => {
                        const newF = [...(data.features || [])];
                        newF[index].description = e.target.value;
                        setData({ ...data, features: newF });
                      }} 
                    />
                  </div>
                </div>
              )}
            />
          </SectionEditor>

          <SectionEditor title="Statistics">
            <Button 
              variant="outline" 
              size="sm" 
              className="mb-4"
              onClick={() => setData({ ...data, stats: [...(data.stats || []), { label: 'Stat', value: '0' }] })}
            >
              Add Stat
            </Button>
            <SortableList 
              items={data.stats || []}
              onReorder={(newStats) => setData({ ...data, stats: newStats })}
              onRemove={(idx) => setData({ ...data, stats: (data.stats || []).filter((_, i) => i !== idx) })}
              renderItem={(item, index) => (
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    placeholder="Label (e.g. Students)" 
                    value={item.label} 
                    onChange={e => {
                      const newF = [...(data.stats || [])];
                      newF[index].label = e.target.value;
                      setData({ ...data, stats: newF });
                    }} 
                  />
                  <Input 
                    placeholder="Value (e.g. 500+)" 
                    value={item.value} 
                    onChange={e => {
                      const newF = [...(data.stats || [])];
                      newF[index].value = e.target.value;
                      setData({ ...data, stats: newF });
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

        {/* Preview Side */}
        {showPreview && (
          <div className="border border-border rounded-md overflow-hidden bg-surface flex flex-col shadow-inner min-h-[600px]">
            <div className="bg-surface border-b border-border p-2 flex justify-center gap-4 text-xs font-semibold text-text-muted">
              <span>Previewing Live Homepage</span>
              <span>Note: Dynamic references (Courses/Gallery) will load from production.</span>
            </div>
            <div className="flex-1 relative bg-white overflow-y-auto">
              <div className="scale-[0.8] transform origin-top w-[125%] pointer-events-none">
                <PreviewRenderer draftData={data} />
              </div>
            </div>
          </div>
        )}
      </div>
    </FadeIn>
  );
}

// A simple wrapper to preview the Home component without causing router issues inside the dev panel
import Home from '../../pages/Home';
import { MemoryRouter } from 'react-router-dom';

function PreviewRenderer({ draftData }: { draftData: any }) {
  return (
    <MemoryRouter>
       <Home draftData={draftData} />
    </MemoryRouter>
  );
}
