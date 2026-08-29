import { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { FileText, Eye, ExternalLink, Download, Loader2, AlertCircle } from 'lucide-react';
import { StorageService } from '../../services/StorageService';
import { Button } from '../ui/Button';

interface DocumentPreviewProps {
  url: string;
  title: string;
}

export function DocumentPreview({ url, title }: DocumentPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolveSignedUrl = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const secureUrl = await StorageService.getSignedDocumentUrl(url, 3600);
      if (secureUrl) {
        setSignedUrl(secureUrl);
      } else {
        // Fallback to original url if signed URL generation returns null
        setSignedUrl(url);
      }
    } catch (err: any) {
      console.error('Failed to resolve signed document URL:', err);
      setError('Unable to generate secure document URL');
      setSignedUrl(url);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    resolveSignedUrl();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div 
        className="flex items-center gap-2 p-2 pr-4 bg-white border border-border rounded-lg cursor-pointer hover:border-brand-primary/30 transition-colors group"
        onClick={handleOpen}
      >
        <div className="w-8 h-8 rounded bg-brand-primary/5 flex items-center justify-center text-brand-primary">
          <FileText className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-text-primary group-hover:text-brand-primary transition-colors">
          {title}
        </span>
        <Eye className="w-4 h-4 text-text-muted ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <Dialog
        isOpen={isOpen}
        onClose={handleClose}
        title={title}
        className="max-w-4xl w-[90vw]"
      >
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-3 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">Secure Temporary Access (1-Hour Expiry)</span>
            </div>
            {signedUrl && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={signedUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <ExternalLink className="w-3.5 h-3.5 mr-1" /> Open in New Tab
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={signedUrl} download target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <Download className="w-3.5 h-3.5 mr-1" /> Download
                  </a>
                </Button>
              </div>
            )}
          </div>

          <div className="aspect-[16/10] w-full bg-surface rounded-lg border border-border overflow-hidden flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2 text-text-muted p-8">
                <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                <p className="text-sm font-medium">Generating secure temporary view...</p>
              </div>
            ) : error && !signedUrl ? (
              <div className="flex flex-col items-center gap-2 text-error p-6 text-center">
                <AlertCircle className="w-8 h-8" />
                <p className="text-sm font-semibold">{error}</p>
                <Button variant="outline" size="sm" onClick={resolveSignedUrl} className="mt-2">
                  Retry
                </Button>
              </div>
            ) : (
              <iframe 
                src={signedUrl || url} 
                title={title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}
