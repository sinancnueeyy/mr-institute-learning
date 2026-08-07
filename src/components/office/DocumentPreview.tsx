import { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { FileText, Eye } from 'lucide-react';

interface DocumentPreviewProps {
  url: string;
  title: string;
}

export function DocumentPreview({ url, title }: DocumentPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className="flex items-center gap-2 p-2 pr-4 bg-white border border-border rounded-lg cursor-pointer hover:border-indigo-300 transition-colors group"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center text-indigo-600">
          <FileText className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-text-primary group-hover:text-indigo-600 transition-colors">
          {title}
        </span>
        <Eye className="w-4 h-4 text-text-muted ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        className="max-w-4xl w-[90vw]"
      >
        <div className="aspect-[16/10] w-full bg-surface rounded-lg border border-border overflow-hidden mt-4">
          <iframe 
            src={url} 
            title={title}
            className="w-full h-full object-cover"
          />
        </div>
      </Dialog>
    </>
  );
}
