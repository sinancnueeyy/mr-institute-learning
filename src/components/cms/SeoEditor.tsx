import { useState } from 'react';
import { type SeoMetadata } from '../../types/cms';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

interface SeoEditorProps {
  seo?: SeoMetadata;
  onChange: (seo: SeoMetadata) => void;
}

export function SeoEditor({ seo, onChange }: SeoEditorProps) {
  const [data, setData] = useState<SeoMetadata>(seo || {
    title: '',
    description: '',
    keywords: '',
    canonicalUrl: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
    noIndex: false
  });

  const handleChange = (field: keyof SeoMetadata, value: any) => {
    const updated = { ...data, [field]: value };
    setData(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary">SEO Title</label>
          <Input 
            value={data.title} 
            onChange={e => handleChange('title', e.target.value)} 
            placeholder="E.g. Homepage - MR Institute" 
          />
          <p className="text-xs text-text-muted">Optimal length: 50-60 characters</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary">Canonical URL</label>
          <Input 
            value={data.canonicalUrl || ''} 
            onChange={e => handleChange('canonicalUrl', e.target.value)} 
            placeholder="https://mrinstitute.edu" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-text-primary">Meta Description</label>
        <Textarea 
          value={data.description} 
          onChange={e => handleChange('description', e.target.value)} 
          placeholder="Brief description of this page..."
          rows={3}
        />
        <p className="text-xs text-text-muted">Optimal length: 150-160 characters</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-text-primary">Keywords</label>
        <Input 
          value={data.keywords} 
          onChange={e => handleChange('keywords', e.target.value)} 
          placeholder="education, college, admissions, (comma separated)" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary">OpenGraph Image URL</label>
          <Input 
            value={data.ogImage || ''} 
            onChange={e => handleChange('ogImage', e.target.value)} 
            placeholder="https://..." 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary">Twitter Card Type</label>
          <select 
            value={data.twitterCard || 'summary_large_image'} 
            onChange={e => handleChange('twitterCard', e.target.value)}
            className="w-full bg-surface border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
          >
            <option value="summary">Summary</option>
            <option value="summary_large_image">Summary Large Image</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={data.noIndex || false}
            onChange={e => handleChange('noIndex', e.target.checked)}
            className="w-5 h-5 text-brand-primary rounded border-border focus:ring-brand-primary"
          />
          <div>
            <p className="text-sm font-bold text-text-primary">NoIndex (Hide from Search Engines)</p>
            <p className="text-xs text-text-muted">Prevent Google from indexing this page.</p>
          </div>
        </label>
      </div>
    </div>
  );
}
