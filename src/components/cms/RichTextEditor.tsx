import { Textarea } from '../ui/Textarea';

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function RichTextEditor({ label, value, onChange, placeholder, rows = 5 }: RichTextEditorProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-semibold text-text-primary">{label}</label>}
      <Textarea 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder || 'Enter content here...'}
        rows={rows}
        className="font-mono text-sm" // Mono for markdown/html ease if needed
      />
      <p className="text-xs text-text-muted text-right">Plain text or HTML allowed</p>
    </div>
  );
}
