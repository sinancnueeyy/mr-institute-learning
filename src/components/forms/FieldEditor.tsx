import { type FormField } from '../../types/cms';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface FieldEditorProps {
  field: FormField;
  onChange: (field: FormField) => void;
}

export function FieldEditor({ field, onChange }: FieldEditorProps) {
  const handleChange = (key: keyof FormField, value: any) => {
    onChange({ ...field, [key]: value });
  };

  const handleValidationChange = (key: string, value: any) => {
    onChange({
      ...field,
      validation: {
        ...(field.validation || {}),
        [key]: value
      }
    });
  };

  const isChoiceField = ['select', 'multi-select', 'radio', 'checkbox'].includes(field.type);

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider">Basic Settings</h4>
        
        <div>
          <label className="text-sm font-semibold mb-1 block">Label</label>
          <Input 
            value={field.label} 
            onChange={(e) => handleChange('label', e.target.value)} 
          />
        </div>

        <div>
          <label className="text-sm font-semibold mb-1 block">Name (Key)</label>
          <Input 
            value={field.name} 
            onChange={(e) => handleChange('name', e.target.value.replace(/[^a-zA-Z0-9_]/g, '_'))} 
            className="font-mono text-sm"
          />
          <p className="text-xs text-text-muted mt-1">Must be unique, alphanumeric and underscores.</p>
        </div>

        {!['divider', 'heading', 'paragraph'].includes(field.type) && (
          <>
            <div>
              <label className="text-sm font-semibold mb-1 block">Placeholder</label>
              <Input 
                value={field.placeholder || ''} 
                onChange={(e) => handleChange('placeholder', e.target.value)} 
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Help Text</label>
              <Input 
                value={field.helpText || ''} 
                onChange={(e) => handleChange('helpText', e.target.value)} 
              />
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="required"
                checked={field.required}
                onChange={(e) => handleChange('required', e.target.checked)}
                className="w-4 h-4 text-brand-primary border-border rounded focus:ring-brand-primary"
              />
              <label htmlFor="required" className="text-sm font-medium">Required Field</label>
            </div>
          </>
        )}
      </div>

      {isChoiceField && (
        <div className="space-y-4 pt-4 border-t border-border">
          <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider">Options</h4>
          <div className="space-y-2">
            {(field.options || []).map((opt, i) => (
              <div key={i} className="flex gap-2">
                <Input 
                  placeholder="Label" 
                  value={opt.label} 
                  onChange={(e) => {
                    const newOpts = [...(field.options || [])];
                    newOpts[i].label = e.target.value;
                    handleChange('options', newOpts);
                  }}
                  className="flex-1"
                />
                <Input 
                  placeholder="Value" 
                  value={opt.value} 
                  onChange={(e) => {
                    const newOpts = [...(field.options || [])];
                    newOpts[i].value = e.target.value;
                    handleChange('options', newOpts);
                  }}
                  className="flex-1 font-mono text-sm"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-error"
                  onClick={() => {
                    const newOpts = [...(field.options || [])];
                    newOpts.splice(i, 1);
                    handleChange('options', newOpts);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2 border-dashed"
              onClick={() => {
                const newOpts = [...(field.options || []), { label: 'New Option', value: 'new_option' }];
                handleChange('options', newOpts);
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Option
            </Button>
          </div>
        </div>
      )}

      {!['divider', 'heading', 'paragraph'].includes(field.type) && (
        <div className="space-y-4 pt-4 border-t border-border">
          <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider">Validation</h4>
          
          {(field.type === 'text' || field.type === 'textarea') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-1 block">Min Length</label>
                <Input 
                  type="number"
                  value={field.validation?.minLength || ''} 
                  onChange={(e) => handleValidationChange('minLength', parseInt(e.target.value) || undefined)} 
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Max Length</label>
                <Input 
                  type="number"
                  value={field.validation?.maxLength || ''} 
                  onChange={(e) => handleValidationChange('maxLength', parseInt(e.target.value) || undefined)} 
                />
              </div>
            </div>
          )}

          {field.type === 'number' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-1 block">Min Value</label>
                <Input 
                  type="number"
                  value={field.validation?.min || ''} 
                  onChange={(e) => handleValidationChange('min', parseInt(e.target.value) || undefined)} 
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Max Value</label>
                <Input 
                  type="number"
                  value={field.validation?.max || ''} 
                  onChange={(e) => handleValidationChange('max', parseInt(e.target.value) || undefined)} 
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="text-sm font-semibold mb-1 block">Custom Error Message</label>
            <Input 
              value={field.validation?.customErrorMessage || ''} 
              onChange={(e) => handleValidationChange('customErrorMessage', e.target.value)} 
              placeholder="E.g. Please enter a valid value"
            />
          </div>
        </div>
      )}

      <div className="space-y-4 pt-4 border-t border-border">
        <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider">Layout</h4>
        <div>
          <label className="text-sm font-semibold mb-1 block">Field Width</label>
          <select 
            className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            value={field.width || 'full'}
            onChange={(e) => handleChange('width', e.target.value)}
          >
            <option value="full">Full Width (100%)</option>
            <option value="half">Half Width (50%)</option>
            <option value="third">One Third (33%)</option>
            <option value="quarter">One Quarter (25%)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
