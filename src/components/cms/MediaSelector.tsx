import { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { StorageService } from '../../firebase/storage';
import { mediaRepository } from '../../repositories/cms';

interface MediaSelectorProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  type?: 'image' | 'video' | 'document';
  placeholder?: string;
}

export function MediaSelector({ label, value, onChange, type = 'image', placeholder }: MediaSelectorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await StorageService.uploadFile(file, `cms/${type}/${Date.now()}_${file.name}`);
      
      // Also save to media repository so it appears in the media library
      await mediaRepository.create({
        name: file.name,
        url,
        type: type === 'image' ? 'image' : type === 'video' ? 'video' : 'document',
        size: file.size,
        uploadedAt: new Date().toISOString()
      });

      onChange(url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-semibold text-text-primary">{label}</label>}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
          <Input 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder={placeholder || 'Paste URL or upload...'}
            className="pl-9"
          />
        </div>
        <input 
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : '*/*'}
          onChange={handleUpload}
        />
        <Button 
          type="button" 
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            'Uploading...'
          ) : (
            <><UploadCloud className="w-4 h-4 mr-2" /> Upload</>
          )}
        </Button>
      </div>
      {type === 'image' && value && (
        <div className="mt-2 w-32 h-20 rounded bg-surface border border-border overflow-hidden flex items-center justify-center">
          <img loading="lazy" src={value} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
          {!value && <ImageIcon className="w-6 h-6 text-text-muted absolute" />}
        </div>
      )}
    </div>
  );
}
