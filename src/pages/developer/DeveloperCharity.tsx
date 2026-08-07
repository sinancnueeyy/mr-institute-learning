import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { FadeIn } from '../../components/animations/FadeIn';
import { Save } from 'lucide-react';
import { type CharityContent } from '../../types/cms';
import { charityRepository } from '../../repositories/cms';
import { SectionEditor } from '../../components/cms/SectionEditor';
import { SeoEditor } from '../../components/cms/SeoEditor';
import { SortableList } from '../../components/cms/SortableList';
import { RichTextEditor } from '../../components/cms/RichTextEditor';
import { MediaSelector } from '../../components/cms/MediaSelector';

export default function DeveloperCharity() {
  const [data, setData] = useState<Partial<CharityContent>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const res = await charityRepository.getById('main');
      if (res.data) {
        setData(res.data);
      } else {
        setData({ 
          id: 'main', 
          isActive: true, 
          schemes: [], 
          successStories: [], 
          impactStats: [], 
          videos: [],
          faqs: [],
          eligibilityCriteria: [],
          requiredDocuments: []
        });
      }
      setIsLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (data.id === 'main') {
        // Try update, if fails, create
        try {
          await charityRepository.update('main', data);
        } catch {
          await charityRepository.create({ ...data, id: 'main' } as any);
        }
      }
      alert('Charity page saved successfully!');
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
          <h2 className="text-2xl font-bold text-text-primary">Charity Page CMS</h2>
          <p className="text-text-secondary">Manage schemes, success stories, and impact statistics.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Saving...' : 'Publish Changes'}
        </Button>
      </div>

      <div className="space-y-6 max-w-4xl pb-20">
        <SectionEditor title="Page Overview" defaultOpen>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Page Title</label>
              <Input value={data.title || ''} onChange={e => setData({...data, title: e.target.value})} />
            </div>
            <RichTextEditor 
              label="Description" 
              value={data.description || ''} 
              onChange={v => setData({...data, description: v})} 
            />
          </div>
        </SectionEditor>

        <SectionEditor title="Impact Statistics">
          <Button 
            variant="outline" size="sm" className="mb-4"
            onClick={() => setData({ ...data, impactStats: [...(data.impactStats || []), { label: '', value: '' }] })}
          >
            Add Stat
          </Button>
          <SortableList 
            items={data.impactStats || []}
            onReorder={(newVals) => setData({ ...data, impactStats: newVals })}
            onRemove={(idx) => setData({ ...data, impactStats: (data.impactStats || []).filter((_, i) => i !== idx) })}
            renderItem={(item, index) => (
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  placeholder="Label (e.g. Students Helped)" 
                  value={item.label} 
                  onChange={e => {
                    const newF = [...(data.impactStats || [])];
                    newF[index].label = e.target.value;
                    setData({ ...data, impactStats: newF });
                  }} 
                />
                <Input 
                  placeholder="Value (e.g. 500+)" 
                  value={item.value} 
                  onChange={e => {
                    const newF = [...(data.impactStats || [])];
                    newF[index].value = e.target.value;
                    setData({ ...data, impactStats: newF });
                  }} 
                />
              </div>
            )}
          />
        </SectionEditor>

        <SectionEditor title="Charity Schemes">
          <Button 
            variant="outline" size="sm" className="mb-4"
            onClick={() => setData({ ...data, schemes: [...(data.schemes || []), { title: '', description: '', eligibility: '', docsRequired: [] }] })}
          >
            Add Scheme
          </Button>
          <SortableList 
            items={data.schemes || []}
            onReorder={(newVals) => setData({ ...data, schemes: newVals })}
            onRemove={(idx) => setData({ ...data, schemes: (data.schemes || []).filter((_, i) => i !== idx) })}
            renderItem={(item, index) => (
              <div className="space-y-4">
                <Input 
                  placeholder="Scheme Title" 
                  value={item.title} 
                  onChange={e => {
                    const newF = [...(data.schemes || [])];
                    newF[index].title = e.target.value;
                    setData({ ...data, schemes: newF });
                  }} 
                />
                <RichTextEditor 
                  placeholder="Description" 
                  value={item.description} 
                  onChange={v => {
                    const newF = [...(data.schemes || [])];
                    newF[index].description = v;
                    setData({ ...data, schemes: newF });
                  }} 
                />
                <Input 
                  placeholder="Eligibility" 
                  value={item.eligibility} 
                  onChange={e => {
                    const newF = [...(data.schemes || [])];
                    newF[index].eligibility = e.target.value;
                    setData({ ...data, schemes: newF });
                  }} 
                />
              </div>
            )}
          />
        </SectionEditor>

        <SectionEditor title="Success Stories">
          <Button 
            variant="outline" size="sm" className="mb-4"
            onClick={() => setData({ ...data, successStories: [...(data.successStories || []), { name: '', story: '', image: '', course: '' }] })}
          >
            Add Story
          </Button>
          <SortableList 
            items={data.successStories || []}
            onReorder={(newVals) => setData({ ...data, successStories: newVals })}
            onRemove={(idx) => setData({ ...data, successStories: (data.successStories || []).filter((_, i) => i !== idx) })}
            renderItem={(item, index) => (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    placeholder="Student Name" 
                    value={item.name} 
                    onChange={e => {
                      const newF = [...(data.successStories || [])];
                      newF[index].name = e.target.value;
                      setData({ ...data, successStories: newF });
                    }} 
                  />
                  <Input 
                    placeholder="Course Completed" 
                    value={item.course || ''} 
                    onChange={e => {
                      const newF = [...(data.successStories || [])];
                      newF[index].course = e.target.value;
                      setData({ ...data, successStories: newF });
                    }} 
                  />
                </div>
                <RichTextEditor 
                  placeholder="Their Story" 
                  value={item.story} 
                  onChange={v => {
                    const newF = [...(data.successStories || [])];
                    newF[index].story = v;
                    setData({ ...data, successStories: newF });
                  }} 
                />
                <MediaSelector 
                  label="Student Photo (Optional)"
                  value={item.image || ''} 
                  onChange={v => {
                    const newF = [...(data.successStories || [])];
                    newF[index].image = v;
                    setData({ ...data, successStories: newF });
                  }} 
                />
              </div>
            )}
          />
        </SectionEditor>

        <SectionEditor title="FAQs">
          <Button variant="outline" size="sm" className="mb-4" onClick={() => setData({ ...data, faqs: [...(data.faqs || []), { question: '', answer: '' }] })}>
            Add FAQ
          </Button>
          <SortableList 
            items={data.faqs || []}
            onReorder={(newVals) => setData({ ...data, faqs: newVals })}
            onRemove={(idx) => setData({ ...data, faqs: (data.faqs || []).filter((_, i) => i !== idx) })}
            renderItem={(item, index) => (
              <div className="space-y-2">
                <Input 
                  placeholder="Question"
                  value={item.question} 
                  onChange={e => {
                    const newF = [...(data.faqs || [])];
                    newF[index].question = e.target.value;
                    setData({ ...data, faqs: newF });
                  }} 
                />
                <Input 
                  placeholder="Answer"
                  value={item.answer} 
                  onChange={e => {
                    const newF = [...(data.faqs || [])];
                    newF[index].answer = e.target.value;
                    setData({ ...data, faqs: newF });
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
