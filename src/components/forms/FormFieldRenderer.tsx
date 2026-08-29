import React, { useRef, useState } from 'react';
import { type FormField } from '../../types/cms';
import { Input } from '../ui/Input';
import { ValidationMessage } from './ValidationMessage';
import { UploadCloud, X, FileText } from 'lucide-react';
import { Button } from '../ui/Button';

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (name: string, value: any) => void;
  error?: string;
  onFileSelect?: (name: string, file: File | null) => void;
}

export function FormFieldRenderer({ field, value, onChange, error, onFileSelect }: FormFieldRendererProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let val: any = e.target.value;
    if (field.type === 'number') {
      val = val === '' ? '' : Number(val);
    }
    onChange(field.name, val);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(field.name, e.target.checked);
  };

  const handleMultiCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, optionValue: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    if (e.target.checked) {
      onChange(field.name, [...currentValues, optionValue]);
    } else {
      onChange(field.name, currentValues.filter((v: string) => v !== optionValue));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      setFileName(file.name);
      onFileSelect(field.name, file);
      // We don't store the file object in the regular form state, we just store the file name to satisfy required validation temporarily
      onChange(field.name, file.name);
    }
  };

  const clearFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    setFileName('');
    if (onFileSelect) onFileSelect(field.name, null);
    onChange(field.name, '');
  };

  const widthClass = {
    'full': 'col-span-12',
    'half': 'col-span-12 sm:col-span-6',
    'third': 'col-span-12 md:col-span-4',
    'quarter': 'col-span-12 md:col-span-3'
  }[field.width || 'full'];

  const renderInput = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
      case 'password':
      case 'url':
      case 'date':
      case 'time':
      case 'datetime':
        const inputType = field.type === 'datetime' ? 'datetime-local' : field.type;
        return (
          <Input 
            type={inputType}
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={handleChange}
            required={field.required}
            disabled={field.disabled}
            readOnly={field.readOnly}
            className={error ? 'border-error focus:ring-error/20 focus:border-error' : ''}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={handleChange}
            required={field.required}
            disabled={field.disabled}
            readOnly={field.readOnly}
            rows={4}
            className={`w-full bg-white text-text-primary border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-4 transition-all resize-none ${
              error 
                ? 'border-error focus:ring-error/20 focus:border-error' 
                : 'border-border focus:ring-brand-primary/20 focus:border-brand-primary'
            }`}
          />
        );

      case 'select':
        return (
          <select
            id={field.name}
            name={field.name}
            value={value || ''}
            onChange={handleChange}
            required={field.required}
            disabled={field.disabled}
            className={`w-full bg-white text-text-primary border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-4 transition-all appearance-none ${
              error 
                ? 'border-error focus:ring-error/20 focus:border-error' 
                : 'border-border focus:ring-brand-primary/20 focus:border-brand-primary'
            }`}
          >
            <option value="" disabled>{field.placeholder || 'Select an option'}</option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((opt, i) => (
              <label key={i} className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-surface/50 transition-colors">
                <input 
                  type="radio" 
                  name={field.name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={handleChange}
                  disabled={field.disabled}
                  className="w-4 h-4 text-brand-primary border-border focus:ring-brand-primary"
                />
                <span className="text-sm font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        if (field.options && field.options.length > 0) {
          // Multi-checkbox
          return (
            <div className="space-y-2">
              {field.options.map((opt, i) => (
                <label key={i} className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-surface/50 transition-colors">
                  <input 
                    type="checkbox" 
                    name={`${field.name}_${i}`}
                    value={opt.value}
                    checked={Array.isArray(value) && value.includes(opt.value)}
                    onChange={(e) => handleMultiCheckboxChange(e, opt.value)}
                    disabled={field.disabled}
                    className="w-4 h-4 text-brand-primary border-border rounded focus:ring-brand-primary"
                  />
                  <span className="text-sm font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          );
        } else {
          // Single boolean checkbox
          return (
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id={field.name}
                name={field.name}
                checked={!!value}
                onChange={handleCheckboxChange}
                disabled={field.disabled}
                required={field.required}
                className="w-5 h-5 text-brand-primary border-border rounded focus:ring-brand-primary"
              />
              <span className="text-sm font-medium">{field.placeholder || 'Check this box to confirm'}</span>
            </label>
          );
        }

      case 'toggle':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={!!value} 
              onChange={handleCheckboxChange} 
              className="sr-only peer"
              disabled={field.disabled}
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
            {field.placeholder && <span className="ml-3 text-sm font-medium">{field.placeholder}</span>}
          </label>
        );

      case 'file':
      case 'image':
        return (
          <div>
            <input 
              type="file" 
              id={field.name}
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept={field.type === 'image' ? 'image/*' : field.validation?.allowedFileTypes?.join(',')}
              disabled={field.disabled}
            />
            {!fileName ? (
              <div 
                className={`w-full border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  error ? 'border-error bg-error/5' : 'border-border hover:border-brand-primary bg-surface/50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className={`w-8 h-8 mb-2 ${error ? 'text-error' : 'text-text-muted'}`} />
                <p className="text-sm font-semibold text-text-primary">
                  {field.placeholder || `Upload ${field.type === 'image' ? 'Image' : 'File'}`}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {field.validation?.maxFileSize ? `Max size: ${field.validation.maxFileSize}MB` : 'Click to browse'}
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border border-border rounded-md bg-surface">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-brand-primary" />
                  </div>
                  <span className="text-sm font-medium truncate">{fileName}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-error shrink-0" onClick={clearFile}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        );

      case 'divider':
        return <hr className="border-border my-6" />;
      
      case 'heading':
        return <h3 className="text-2xl font-bold text-text-primary mt-6 mb-2">{field.label}</h3>;
      
      case 'paragraph':
        return <p className="text-text-secondary leading-relaxed mb-4">{field.label}</p>;

      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  };

  const isStructural = ['divider', 'heading', 'paragraph', 'hidden'].includes(field.type);

  if (field.type === 'hidden') return null;

  return (
    <div className={`${widthClass} ${field.customCssClass || ''}`}>
      {!isStructural && (
        <div className="mb-2 flex items-baseline justify-between">
          <label htmlFor={field.name} className="block text-sm font-bold text-text-primary">
            {field.label} {field.required && <span className="text-error ml-1">*</span>}
          </label>
        </div>
      )}
      
      {renderInput()}
      
      {!isStructural && field.helpText && !error && (
        <p className="mt-2 text-xs text-text-muted">{field.helpText}</p>
      )}
      
      <ValidationMessage message={error} />
    </div>
  );
}
