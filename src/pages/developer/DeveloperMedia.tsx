import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { FadeIn } from '../../components/animations/FadeIn';
import { Search, Trash2, Link as LinkIcon, FileText, FileVideo, UploadCloud } from 'lucide-react';
import { type MediaAsset } from '../../types/cms';
import { mediaRepository } from '../../repositories/cms';
import { StorageService } from '../../services/StorageService';

export default function DeveloperMedia() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [data, setData] = useState<MediaAsset[]>([]);

  useEffect(() => {
    const unsubscribe = mediaRepository.listenAll((docs) => {
      setData(docs);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const url = await StorageService.uploadFile(
        file,
        `media/${Date.now()}_${file.name}`,
        (progress) => setUploadProgress(progress)
      );

      // Determine type
      let type: 'image' | 'video' | 'document' = 'document';
      if (file.type.startsWith('image/')) type = 'image';
      if (file.type.startsWith('video/')) type = 'video';

      const newAsset: Omit<MediaAsset, 'id'> = {
        name: file.name,
        url,
        type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };

      await mediaRepository.create(newAsset);
    } catch (error: any) {
      console.error(error);
      alert('Upload failed: ' + error.message);
    }

    setIsUploading(false);
    setUploadProgress(0);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  const columns: Column<MediaAsset>[] = [
    { 
      header: 'Preview', 
      accessorKey: 'url',
      cell: (item) => (
        <div className="w-12 h-12 bg-surface rounded flex items-center justify-center overflow-hidden border border-border">
          {item.type === 'image' ? (
            <img loading="lazy" src={item.url} alt={item.name} className="w-full h-full object-cover" />
          ) : item.type === 'video' ? (
            <FileVideo className="text-text-muted" />
          ) : (
            <FileText className="text-text-muted" />
          )}
        </div>
      )
    },
    { header: 'File Name', accessorKey: 'name' },
    { 
      header: 'Size', 
      accessorKey: 'size',
      cell: (item) => (
        <span className="text-text-secondary text-sm">
          {(item.size / 1024 / 1024).toFixed(2)} MB
        </span>
      )
    },
    { 
      header: 'Uploaded Date', 
      accessorKey: 'uploadedAt',
      cell: (item) => (
        <span className="text-text-secondary text-sm">
          {new Date(item.uploadedAt).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (item) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(item.url)}>
            <LinkIcon className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-error border-error/20 hover:bg-error/10" 
            onClick={async () => {
              if (item.url) await StorageService.deleteFile(item.url);
              mediaRepository.delete(item.id as string);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FadeIn className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Media Library</h1>
          <p className="text-text-secondary">Upload, manage, and inspect media assets across the website.</p>
        </div>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,video/*,.pdf"
          />
          <Button onClick={handleUploadClick} disabled={isUploading}>
            <UploadCloud className="w-4 h-4 mr-2" />
            {isUploading ? `Uploading (${uploadProgress.toFixed(0)}%)...` : 'Upload Media'}
          </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
              <Input
                placeholder="Search media by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="text-sm text-text-secondary">
              Total Assets: {data.length}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <DataTable
            columns={columns}
            data={filteredData}
            keyExtractor={(item) => item.id || item.url || item.name}
            isLoading={isLoading}
            emptyMessage="No media assets found. Upload some to get started!"
          />
        </CardContent>
      </Card>
    </FadeIn>
  );
}
