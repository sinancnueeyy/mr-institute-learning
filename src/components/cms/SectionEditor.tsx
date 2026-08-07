import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';

interface SectionEditorProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SectionEditor({ title, description, children, defaultOpen = false }: SectionEditorProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="mb-6 overflow-hidden border-border transition-all duration-300">
      <CardHeader 
        className="cursor-pointer bg-surface/50 hover:bg-surface border-b border-border transition-colors flex flex-row items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
        </div>
        <div className="p-2 rounded-full hover:bg-black/5 text-text-secondary">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="p-6 bg-white">
          {children}
        </CardContent>
      )}
    </Card>
  );
}
